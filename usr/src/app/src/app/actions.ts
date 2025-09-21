
'use server';
import 'dotenv/config';
import { z } from "zod";
import { auth, db } from "@/lib/firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, sendPasswordResetEmail } from "firebase/auth";
import { collection, addDoc, serverTimestamp, setDoc, doc, getDoc, query, where, getDocs, updateDoc, Timestamp, orderBy, deleteDoc, writeBatch,getCountFromServer, limit, startAt } from "firebase/firestore";
import { format } from "date-fns";
import { uploadFileToGCS, getSignedUrl as getGcsSignedUrl } from '@/lib/gcs';
import Razorpay from 'razorpay';

const formSchema = z.object({
  sessionMode: z.enum(["online", "offline"], { required_error: "Please select a session mode." }),
  studentName: z.string().min(2, { message: "Name must be at least 2 characters." }),
  classCourse: z.string().min(1, { message: "Please select a class or course." }),
  country: z.string().min(1, { message: "Please select a country." }),
  mobile: z.string().regex(/^\d{10}$/, { message: "Please enter a valid 10-digit mobile number." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  state: z.string().min(1, { message: "Please select a state." }),
});

type FormValues = z.infer<typeof formSchema>;

export async function bookFreeSession(data: FormValues) {
  const validation = formSchema.safeParse(data);
  if (!validation.success) {
    return { success: false, message: "Invalid data provided. Please check your inputs." };
  }
  
  try {
    // Save data to Firestore
    await addDoc(collection(db, "sessionBookings"), {
      ...validation.data,
      status: 'new', // Add status for new bookings
      createdAt: serverTimestamp(),
    });

    return { success: true, message: "Your free session has been booked successfully!" };

  } catch (error) {
    console.error("Error booking session:", error);
    return { success: false, message: "Failed to book session. Please try again later." };
  }
}

const scholarshipSchema = z.object({
  studentName: z.string().min(2, { message: "Name must be at least 2 characters." }),
  guardianName: z.string().min(2, { message: "Guardian name must be at least 2 characters." }),
  class: z.string().min(1, { message: "Please select a class." }),
  mobile: z.string().regex(/^\d{10}$/, { message: "Please enter a valid 10-digit mobile number." }),
  country: z.string().min(1, { message: "Please select a country." }),
  state: z.string().min(1, { message: "Please select a state." }),
});

type ScholarshipFormValues = z.infer<typeof scholarshipSchema>;

export async function registerForScholarship(data: ScholarshipFormValues) {
    const validation = scholarshipSchema.safeParse(data);
    if (!validation.success) {
        return { success: false, message: "Invalid data. Please check your inputs." };
    }

    try {
        await addDoc(collection(db, "scholarshipRegistrations"), {
            ...validation.data,
            createdAt: serverTimestamp(),
        });
        return { success: true, message: "You have successfully registered for the scholarship!" };
    } catch (error) {
        console.error("Error registering for scholarship:", error);
        return { success: false, message: "Registration failed. Please try again later." };
    }
}


const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, { message: "Password is required." }),
});

type LoginValues = z.infer<typeof loginSchema>;

const serializeFirestoreData = (docData: any) => {
    if (!docData) return null;
    const data = { ...docData };
    for (const key in data) {
        if (data[key] instanceof Timestamp) {
            data[key] = data[key].toDate().toISOString();
        }
    }
    return data;
};


export async function loginUser(data: LoginValues) {
  console.log('[actions.ts] loginUser: Initiating login process for', data.email);
  const validation = loginSchema.safeParse(data);
  if (!validation.success) {
    console.error('[actions.ts] loginUser: Invalid input data.');
    return { success: false, message: "Invalid input." };
  }

  const { email, password } = validation.data;
  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'aksias.sos@outlook.com';

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log('[actions.ts] loginUser: Firebase sign-in successful for UID:', user.uid);
    
    let userProfile;

    if (user.email === adminEmail) {
      userProfile = {
        uid: user.uid,
        email: user.email,
        name: 'Admin',
        role: 'admin',
      };
      console.log('[actions.ts] loginUser: Admin user detected.');
    } else {
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
            console.log('[actions.ts] loginUser: Found user document in Firestore.');
            const userData = userDoc.data();

            if (userData.status === 'pending') {
                console.warn('[actions.ts] loginUser: Account is pending approval.');
                await signOut(auth);
                return { success: false, message: "Your account is pending approval. Please wait for an admin to approve it." };
            }
            if (userData.status === 'inactive') {
                console.warn('[actions.ts] loginUser: Account is inactive.');
                await signOut(auth);
                return { success: false, message: "Your account is currently inactive. Please contact support." };
            }

            userProfile = {
                uid: user.uid,
                email: user.email,
                name: userData.name,
                role: userData.role,
                ...serializeFirestoreData(userData),
            };
            console.log('[actions.ts] loginUser: User profile created.', userProfile);
        } else {
            console.error('[actions.ts] loginUser: User document not found in Firestore.');
            await signOut(auth);
            return { success: false, message: "User data not found. Please contact support." };
        }
    }

    console.log('[actions.ts] loginUser: Login successful, returning user profile.');
    return { success: true, message: "Login successful!", user: userProfile };

  } catch (error: any) {
    let message = "An unknown error occurred.";
    console.error('[actions.ts] loginUser: Firebase Auth error:', error);
    switch (error.code) {
      case 'auth/user-not-found':
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        message = 'Invalid email or password.';
        break;
      case 'auth/invalid-email':
        message = 'Please enter a valid email address.';
        break;
      case 'auth/user-disabled':
        message = 'This user account has been disabled.';
        break;
      case 'permission-denied':
        message = 'You do not have permission to access this resource. Please check Firestore rules.';
        break;
      default:
        console.error("Firebase Auth Error:", error);
        message = 'Failed to login. Please try again later.';
        break;
    }
    console.log('[actions.ts] loginUser: Login failed with message:', message);
    return { success: false, message };
  }
}

const signupSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email(),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
  role: z.enum(['student', 'teacher'])
});

type SignupValues = z.infer<typeof signupSchema>;

export async function signUpUser(data: SignupValues) {
  const validation = signupSchema.safeParse(data);
  if (!validation.success) {
    return { success: false, message: "Invalid input." };
  }

  const { name, email, password, role } = validation.data;

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Store user role and name in Firestore
    const userDocData: any = {
      name: name,
      email: email,
      role: role,
      createdAt: serverTimestamp(),
      status: 'pending', // Set initial status to pending
    };

    if (role === 'student') {
        userDocData.teacherIds = [];
    }

    await setDoc(doc(db, "users", user.uid), userDocData);
    
    // Log out user immediately after signup, forcing them to wait for approval
    await signOut(auth);

    return { success: true, message: "Account created successfully! Please wait for an admin to approve your account before you can log in." };
  } catch (error: any) {
    let message = "An unknown error occurred.";
    switch (error.code) {
      case 'auth/email-already-in-use':
        message = 'This email address is already in use.';
        break;
      case 'auth/invalid-email':
        message = 'Please enter a valid email address.';
        break;
      case 'auth/weak-password':
        message = 'The password is too weak. Please use at least 6 characters.';
        break;
      default:
        console.error("Firebase Auth Signup Error:", error);
        message = 'Failed to create account. Please try again later.';
        break;
    }
    return { success: false, message };
  }
}

export async function resetUserPassword(email: string) {
  if (!email) {
    return { success: false, message: "Email is required." };
  }
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true, message: `Password reset email sent to ${email}.` };
  } catch (error: any) {
    console.error("Password Reset Error:", error);
    let message = "Failed to send password reset email. Please try again later.";
    if (error.code === 'auth/user-not-found') {
      message = "This email is not associated with any account.";
    }
    return { success: false, message };
  }
}

// Note: The actual signOut operation must be called on the client.
// This server action is a placeholder and will not work as expected for signing out a user.
// The client-side implementation will handle the sign-out.
export async function logoutUser() {
  console.log('[actions.ts] logoutUser: Server action called.');
  try {
    // This will not sign out the client, as auth state is managed on the client.
    // await signOut(auth); 
    console.log('[actions.ts] logoutUser: Returning success. Client-side will handle actual sign out.');
    return { success: true, message: "Logout successful." };
  } catch (error) {
    console.error("[actions.ts] logoutUser: Error during server-side logout attempt:", error);
    return { success: false, message: "Logout failed. Please try again." };
  }
}


const progressReportSchema = z.object({
  studentId: z.string(),
  teacherId: z.string(),
  month: z.string(),
  report: z.string().min(10, { message: "Report must be at least 10 characters." }),
});

type ProgressReportValues = z.infer<typeof progressReportSchema>;

export async function addProgressReport(data: ProgressReportValues) {
  const validation = progressReportSchema.safeParse(data);
  if (!validation.success) {
    return { success: false, message: "Invalid data provided." };
  }

  try {
    await addDoc(collection(db, "progressReports"), {
      ...validation.data,
      createdAt: serverTimestamp(),
    });
    return { success: true, message: "Progress report added successfully!" };
  } catch (error) {
    console.error("Error adding progress report:", error);
    return { success: false, message: "Failed to add report. Please check permissions." };
  }
}

export async function getStudents(teacherId?: string) {
  try {
    let studentsQuery;
    if (teacherId) {
      studentsQuery = query(
        collection(db, "users"), 
        where("role", "==", "student"),
        where("teacherIds", "array-contains", teacherId)
      );
    } else {
      studentsQuery = query(collection(db, "users"), where("role", "==", "student"));
    }
    const querySnapshot = await getDocs(studentsQuery);
    const students = querySnapshot.docs.map(doc => ({ id: doc.id, ...serializeFirestoreData(doc.data()) }));
    return { success: true, data: students };
  } catch (error) {
    console.error("Error fetching students:", error);
    return { success: false, message: "Failed to fetch students." };
  }
}

export async function getTeachers() {
  try {
    const teachersQuery = query(collection(db, "users"), where("role", "==", "teacher"));
    const querySnapshot = await getDocs(teachersQuery);
    const teachers = querySnapshot.docs.map(doc => ({ id: doc.id, ...serializeFirestoreData(doc.data()) }));
    return { success: true, data: teachers };
  } catch (error) {
    console.error("Error fetching teachers:", error);
    return { success: false, message: "Failed to fetch teachers." };
  }
}

export async function assignTeachersToStudent(studentId: string, teacherIds: string[]) {
  try {
    const studentDocRef = doc(db, "users", studentId);
    await updateDoc(studentDocRef, { teacherIds: teacherIds });
    return { success: true, message: "Teachers assigned successfully!" };
  } catch (error) {
    console.error("Error assigning teachers:", error);
    return { success: false, message: "Failed to assign teachers." };
  }
}

export async function getStudentProgressReports(studentId: string) {
  try {
    const reportsQuery = query(collection(db, "progressReports"), where("studentId", "==", studentId));
    const querySnapshot = await getDocs(reportsQuery);
    const reports = querySnapshot.docs.map(doc => ({ id: doc.id, ...serializeFirestoreData(doc.data()) }));
    // Sort by date or month if needed
    return { success: true, data: reports };
  } catch (error) {
    console.error("Error fetching progress reports:", error);
    return { success: false, message: "Failed to fetch progress reports." };
  }
}

export async function getProgressReportsForTeacher(teacherId: string) {
  try {
    const reportsQuery = query(collection(db, "progressReports"), where("teacherId", "==", teacherId));
    const querySnapshot = await getDocs(reportsQuery);
    const reports = querySnapshot.docs.map(doc => ({ id: doc.id, ...serializeFirestoreData(doc.data()) }));
    return { success: true, data: reports };
  } catch (error) {
    console.error("Error fetching progress reports:", error);
    return { success: false, message: "Failed to fetch progress reports." };
  }
}

export async function getSessionBookings() {
  try {
    const bookingsQuery = query(collection(db, "sessionBookings"), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(bookingsQuery);
    const bookings = querySnapshot.docs.map(doc => ({ id: doc.id, ...serializeFirestoreData(doc.data()) }));
    return { success: true, data: bookings };
  } catch (error) {
    console.error("Error fetching session bookings:", error);
    return { success: false, message: "Failed to fetch session bookings." };
  }
}

export async function getNewSessionBookingsCount() {
  try {
    const bookingsQuery = query(collection(db, "sessionBookings"), where("status", "==", "new"));
    const querySnapshot = await getDocs(bookingsQuery);
    return { success: true, count: querySnapshot.size };
  } catch (error) {
    console.error("Error fetching new session bookings count:", error);
    return { success: false, message: "Failed to fetch new session bookings count." };
  }
}

export async function markAllBookingsAsSeen() {
  try {
    const newBookingsQuery = query(collection(db, "sessionBookings"), where("status", "==", "new"));
    const querySnapshot = await getDocs(newBookingsQuery);
    const batch = writeBatch(db);
    querySnapshot.docs.forEach(doc => {
      batch.update(doc.ref, { status: 'seen' });
    });
    await batch.commit();
    return { success: true, message: "All new bookings marked as seen." };
  } catch (error) {
    console.error("Error marking bookings as seen:", error);
    return { success: false, message: "Failed to mark bookings as seen." };
  }
}

const contactFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email." }),
  phone: z.string().min(10, { message: "Please enter a valid phone number." }),
  country: z.string().optional(),
  state: z.string().min(1, { message: "Please select a state." }),
  message: z.string().optional(),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

export async function submitContactForm(data: ContactFormValues) {
  const validation = contactFormSchema.safeParse(data);
  if (!validation.success) {
    return { success: false, message: "Invalid data provided. Please check your inputs." };
  }

  try {
    await addDoc(collection(db, "contactSubmissions"), {
      ...validation.data,
      createdAt: serverTimestamp(),
    });
    return { success: true, message: "Your message has been sent successfully!" };
  } catch (error) {
    console.error("Error submitting contact form:", error);
    return { success: false, message: "Failed to send message. Please try again later." };
  }
}

const supportTicketSchema = z.object({
    studentName: z.string().min(2, { message: "Name must be at least 2 characters." }),
    email: z.string().email({ message: "Please enter a valid email." }),
    problem: z.string().min(10, { message: "Please describe your problem in at least 10 characters." }),
});

type SupportTicketValues = z.infer<typeof supportTicketSchema>;

export async function submitSupportTicket(data: SupportTicketValues) {
    const validation = supportTicketSchema.safeParse(data);
    if (!validation.success) {
        return { success: false, message: "Invalid data provided. Please check your inputs." };
    }

    try {
        // Generate a unique, human-readable ticket ID
        const timestamp = Date.now();
        const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
        const ticketId = `IDL-${timestamp}-${randomPart}`;
        
        await addDoc(collection(db, "supportTickets"), {
            ...validation.data,
            ticketId: ticketId,
            status: 'new',
            createdAt: serverTimestamp(),
        });
        return { success: true, message: "Your support ticket has been submitted successfully!", ticketId: ticketId };
    } catch (error) {
        console.error("Error submitting support ticket:", error);
        return { success: false, message: "Failed to submit ticket. Please try again later." };
    }
}


export async function getContactSubmissions() {
  try {
    const submissionsQuery = query(collection(db, "contactSubmissions"), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(submissionsQuery);
    const submissions = querySnapshot.docs.map(doc => ({ id: doc.id, ...serializeFirestoreData(doc.data()) }));
    return { success: true, data: submissions };
  } catch (error) {
    console.error("Error fetching contact submissions:", error);
    return { success: false, message: "Failed to fetch contact submissions." };
  }
}

export async function getSupportTickets() {
  try {
    const ticketsQuery = query(collection(db, "supportTickets"), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(ticketsQuery);
    const tickets = querySnapshot.docs.map(doc => ({ id: doc.id, ...serializeFirestoreData(doc.data()) }));
    return { success: true, data: tickets };
  } catch (error) {
    console.error("Error fetching support tickets:", error);
    return { success: false, message: "Failed to fetch support tickets." };
  }
}

export async function getScholarshipRegistrations() {
  try {
    const registrationsQuery = query(collection(db, "scholarshipRegistrations"), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(registrationsQuery);
    const registrations = querySnapshot.docs.map(doc => ({ id: doc.id, ...serializeFirestoreData(doc.data()) }));
    return { success: true, data: registrations };
  } catch (error) {
    console.error("Error fetching scholarship registrations:", error);
    return { success: false, message: "Failed to fetch scholarship registrations." };
  }
}

const updateSchema = z.object({
  title: z.string().min(1, { message: "Title is required." }),
  description: z.string().min(1, { message: "Description is required." }),
});

type UpdateValues = z.infer<typeof updateSchema>;

export async function addUpdate(data: UpdateValues) {
  const validation = updateSchema.safeParse(data);
  if (!validation.success) {
    return { success: false, message: "Invalid data provided." };
  }

  try {
    await addDoc(collection(db, "updates"), {
      ...validation.data,
      createdAt: serverTimestamp(),
    });
    return { success: true, message: "Update posted successfully!" };
  } catch (error) {
    console.error("Error adding update:", error);
    return { success: false, message: "Failed to post update. Please try again." };
  }
}

export async function getUpdates(count?: number) {
  try {
    let updatesQuery;
    if (count) {
        updatesQuery = query(collection(db, "updates"), orderBy("createdAt", "desc"), limit(count));
    } else {
        updatesQuery = query(collection(db, "updates"), orderBy("createdAt", "desc"));
    }
    const querySnapshot = await getDocs(updatesQuery);
    const updates = querySnapshot.docs.map(doc => ({ id: doc.id, ...serializeFirestoreData(doc.data()) }));
    return { success: true, data: updates };
  } catch (error) {
    console.error("Error fetching updates:", error);
    return { success: false, message: "Failed to fetch updates." };
  }
}

export async function editUpdate(id: string, data: UpdateValues) {
  const validation = updateSchema.safeParse(data);
  if (!validation.success) {
    return { success: false, message: "Invalid data provided." };
  }

  try {
    const updateDocRef = doc(db, "updates", id);
    await updateDoc(updateDocRef, {
      ...validation.data,
    });
    return { success: true, message: "Update edited successfully!" };
  } catch (error) {
    console.error("Error editing update:", error);
    return { success: false, message: "Failed to edit update. Please try again." };
  }
}

export async function deleteUpdate(id: string) {
  try {
    const updateDocRef = doc(db, "updates", id);
    await deleteDoc(updateDocRef);
    return { success: true, message: "Update deleted successfully!" };
  } catch (error) {
    console.error("Error deleting update:", error);
    return { success: false, message: "Failed to delete update. Please try again." };
  }
}

export async function getPendingUsers() {
  try {
    const usersQuery = query(collection(db, "users"), where("status", "==", "pending"), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(usersQuery);
    const users = querySnapshot.docs.map(doc => ({ id: doc.id, ...serializeFirestoreData(doc.data()) }));
    return { success: true, data: users };
  } catch (error) {
    console.error("Error fetching pending users:", error);
    return { success: false, message: "Failed to fetch pending users." };
  }
}

export async function approveUser(userId: string) {
  try {
    const userDocRef = doc(db, "users", userId);
    await updateDoc(userDocRef, { status: 'approved' });
    return { success: true, message: "User approved successfully!" };
  } catch (error) {
    console.error("Error approving user:", error);
    return { success: false, message: "Failed to approve user." };
  }
}

export async function denyUser(userId: string) {
  try {
    const userDocRef = doc(db, "users", userId);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      const userData = userDoc.data();
      // Add to deniedUsers collection
      await setDoc(doc(db, "deniedUsers", userId), {
        ...userData,
        deniedAt: serverTimestamp(),
      });
      // Delete from users collection
      await deleteDoc(userDocRef);
      return { success: true, message: "User denied and data moved." };
    } else {
      return { success: false, message: "User not found." };
    }
  } catch (error) {
    console.error("Error denying user:", error);
    return { success: false, message: "Failed to deny user." };
  }
}

export async function setUserStatus(userId: string, status: 'approved' | 'inactive') {
  try {
    const userDocRef = doc(db, "users", userId);
    await updateDoc(userDocRef, { status });
    return { success: true, message: `User status updated to ${status}.` };
  } catch (error) {
    console.error(`Error setting user status to ${status}:`, error);
    return { success: false, message: "Failed to update user status." };
  }
}

async function getCount(q: any) {
    try {
        const snapshot = await getCountFromServer(q);
        return { success: true, count: snapshot.data().count };
    } catch (error) {
        console.error("Error getting count from server: ", error);
        return { success: false, message: "Failed to fetch count." };
    }
}

export async function getTotalUsersCount() {
    const q = query(collection(db, "users"));
    return getCount(q);
}

export async function getTotalStudentsCount() {
    const q = query(collection(db, "users"), where("role", "==", "student"));
    return getCount(q);
}

export async function getTotalTeachersCount() {
    const q = query(collection(db, "users"), where("role", "==", "teacher"));
    return getCount(q);
}

export async function getNewStudentsCount() {
    const q = query(collection(db, "users"), where("role", "==", "student"), where("status", "==", "approved"));
    return getCount(q);
}

export async function getTrainedStudentsCount() {
    // This is a placeholder, as "trained" is not defined. 
    // We'll count approved students who have an assigned teacher.
    const q = query(
      collection(db, "users"), 
      where("role", "==", "student"), 
      where("status", "==", "approved"),
      where("teacherIds", "!=", [])
    );
    return getCount(q);
}

export async function getDeniedUsersCount() {
    const q = query(collection(db, "deniedUsers"));
    return getCount(q);
}

export async function getTotalSessionBookingsCount() {
    const q = query(collection(db, "sessionBookings"));
    return getCount(q);
}

export async function getMonthlySessionBookingsCount() {
    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    const q = query(
        collection(db, "sessionBookings"),
        where("createdAt", ">=", startDate),
        where("createdAt", "<", endDate)
    );
    return getCount(q);
}

export async function getTotalContactSubmissionsCount() {
    const q = query(collection(db, "contactSubmissions"));
    return getCount(q);
}

export async function getMonthlyContactSubmissionsCount() {
    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    const q = query(
        collection(db, "contactSubmissions"),
        where("createdAt", ">=", startDate),
        where("createdAt", "<", endDate)
    );
    return getCount(q);
}

export async function getTotalUpdatesCount() {
    const q = query(collection(db, "updates"));
    return getCount(q);
}

export async function getMonthlyUpdatesCount() {
    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    const q = query(
        collection(db, "updates"),
        where("createdAt", ">=", startDate),
        where("createdAt", "<", endDate)
    );
    return getCount(q);
}

const getFiscalYearBoundaries = (date: Date) => {
    const currentMonth = date.getMonth();
    const currentYear = date.getFullYear();
    let fiscalYearStart, fiscalYearEnd;

    if (currentMonth >= 3) { // April (month 3) to December
        fiscalYearStart = new Date(currentYear, 3, 1);
        fiscalYearEnd = new Date(currentYear + 1, 2, 31, 23, 59, 59, 999);
    } else { // January to March
        fiscalYearStart = new Date(currentYear - 1, 3, 1);
        fiscalYearEnd = new Date(currentYear, 2, 31, 23, 59, 59, 999);
    }
    return { fiscalYearStart, fiscalYearEnd };
};

export async function getMonthlyUserStats() {
    try {
        const now = new Date();
        const { fiscalYearStart, fiscalYearEnd } = getFiscalYearBoundaries(now);

        // Fetch all users within the fiscal year once.
        const allUsersQuery = query(
            collection(db, "users"),
            where("createdAt", ">=", fiscalYearStart),
            where("createdAt", "<=", fiscalYearEnd)
        );
        const allUsersSnapshot = await getDocs(allUsersQuery);
        const allUsers = allUsersSnapshot.docs.map(doc => {
            const data = doc.data();
            const createdAtData = data.createdAt;
            // Handle both Firestore Timestamp and ISO string formats
            const createdAtDate = createdAtData instanceof Timestamp
                ? createdAtData.toDate()
                : (typeof createdAtData === 'string' ? new Date(createdAtData) : new Date());
            return {
                ...data,
                createdAt: createdAtDate
            };
        });

        const monthNames = ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar"];
        
        let cumulativeData: { [key: string]: any } = {};

        // Initialize cumulative data for each month
        monthNames.forEach(month => {
            cumulativeData[month] = {
                name: month,
                newStudents: 0,
                totalUsers: 0,
                totalStudents: 0,
                trainedStudents: 0,
                totalTeachers: 0
            };
        });

        // Process users and accumulate stats
        allUsers.forEach(user => {
            const monthIndex = user.createdAt.getMonth();
            const year = user.createdAt.getFullYear();
            
            let fiscalMonthName: string;
            // Adjust month index for fiscal year (April is 0)
            if (monthIndex >= 3) {
                fiscalMonthName = monthNames[monthIndex - 3];
            } else {
                fiscalMonthName = monthNames[monthIndex + 9];
            }

            if(cumulativeData[fiscalMonthName]) {
                cumulativeData[fiscalMonthName].totalUsers += 1;
                if (user.role === 'student') {
                    cumulativeData[fiscalMonthName].totalStudents += 1;
                    if (user.status === 'approved') {
                        cumulativeData[fiscalMonthName].newStudents += 1;
                        if (user.teacherIds && user.teacherIds.length > 0) {
                            cumulativeData[fiscalMonthName].trainedStudents += 1;
                        }
                    }
                } else if (user.role === 'teacher') {
                    cumulativeData[fiscalMonthName].totalTeachers += 1;
                }
            }
        });
        
        // Create the final cumulative chart data
        let cumulativeUsers = 0;
        let cumulativeStudents = 0;
        let cumulativeTrained = 0;
        let cumulativeTeachers = 0;
        
        const cumulativeChartData = monthNames.map(month => {
            cumulativeUsers += cumulativeData[month].totalUsers;
            cumulativeStudents += cumulativeData[month].totalStudents;
            cumulativeTrained += cumulativeData[month].trainedStudents;
            cumulativeTeachers += cumulativeData[month].totalTeachers;

            return {
                name: month,
                newStudents: cumulativeData[month].newStudents, // This should be monthly, not cumulative
                totalUsers: cumulativeUsers,
                totalStudents: cumulativeStudents,
                trainedStudents: cumulativeTrained,
                totalTeachers: cumulativeTeachers
            };
        });

        return { success: true, data: cumulativeChartData };

    } catch (error) {
        console.error("Error fetching monthly user stats:", error);
        return { success: false, message: "Failed to fetch monthly stats." };
    }
}


export async function getActiveUsersCount() {
    const q = query(collection(db, "users"), where("status", "==", "approved"));
    return getCount(q);
}

export async function getInactiveUsersCount() {
    const q = query(collection(db, "users"), where("status", "==", "inactive"));
    return getCount(q);
}

export async function getMonthlyActiveUsersCount() {
    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    const q = query(collection(db, "users"), where("status", "==", "approved"), where("createdAt", ">=", startDate), where("createdAt", "<", endDate));
    return getCount(q);
}

export async function getNextStudentId() {
  try {
    const today = new Date();
    const datePrefix = format(today, 'ddMMyy');

    // Query for the last admission to get the sequence number
    const admissionsQuery = query(
      collection(db, "admissions"),
      orderBy("createdAt", "desc"),
      limit(1)
    );

    const querySnapshot = await getDocs(admissionsQuery);
    
    let nextSequence = 101;

    if (!querySnapshot.empty) {
      const lastAdmission = querySnapshot.docs[0].data();
      const lastId = lastAdmission.studentId;
      // Extract sequence from the last ID, regardless of the date prefix
      if (lastId && lastId.includes('-')) {
        const lastSequence = parseInt(lastId.split('-')[1], 10);
        if (!isNaN(lastSequence)) {
          nextSequence = lastSequence + 1;
        }
      }
    }

    const studentId = `${datePrefix}-${nextSequence}`;
    
    return { success: true, studentId: studentId };
  } catch (error) {
    console.error("Error generating next student ID:", error);
    return { success: false, message: "Failed to generate student ID." };
  }
}

export async function getAdmissions() {
  try {
    const admissionsQuery = query(collection(db, "admissions"), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(admissionsQuery);
    const admissions = querySnapshot.docs.map(doc => ({ id: doc.id, ...serializeFirestoreData(doc.data()) }));
    return { success: true, data: admissions };
  } catch (error) {
    console.error("Error fetching admissions:", error);
    return { success: false, message: "Failed to fetch admissions." };
  }
}

export async function getSignedUrlForAdmissionPhoto(filePath: string) {
  if (!filePath) {
    return { success: false, message: 'File path is required.' };
  }
  try {
    const url = await getGcsSignedUrl(filePath);
    return { success: true, url: url };
  } catch (error) {
    return { success: false, message: 'Failed to get signed URL.' };
  }
}

export async function submitAdmissionForm(formData: FormData) {
    const rawFormData = Object.fromEntries(formData.entries());
    const studentPhoto = rawFormData.studentPhoto as File;

    const admissionData = {
        studentId: rawFormData.studentId as string,
        studentName: rawFormData.studentName as string,
        fatherName: rawFormData.fatherName as string,
        fatherOccupation: rawFormData.fatherOccupation as string || '',
        motherName: rawFormData.motherName as string,
        motherOccupation: rawFormData.motherOccupation as string || '',
        dob: rawFormData.dob as string,
        gender: rawFormData.gender as string,
        bloodGroup: rawFormData.bloodGroup as string || '',
        aadharNumber: rawFormData.aadharNumber as string || '',
        apaarId: rawFormData.apaarId as string || '',
        email: rawFormData.email as string,
        studentPhone: rawFormData.studentPhone as string || '',
        fatherPhone: rawFormData.fatherPhone as string,
        motherPhone: rawFormData.motherPhone as string,
        address: rawFormData.address as string,
        pincode: rawFormData.pincode as string,
        state: rawFormData.state as string,
        classApplied: rawFormData.classApplied as string,
        previousSchool: rawFormData.previousSchool as string || '',
        additionalInfo: rawFormData.additionalInfo as string || '',
        branch: rawFormData.branch as string,
        transactionId: rawFormData.transactionId as string,
    };
    
    try {
        let studentPhotoPath = '';
        if (studentPhoto && studentPhoto.size > 0) {
            const destination = `student_photos/${admissionData.studentId}-${studentPhoto.name}`;
            await uploadFileToGCS(studentPhoto, destination);
            studentPhotoPath = destination;
        }
        
        await addDoc(collection(db, "admissions"), {
            ...admissionData,
            studentPhotoUrl: studentPhotoPath, // Store the GCS file path
            createdAt: serverTimestamp(),
            status: 'submitted',
        });
        
        return { success: true, message: "Admission form submitted successfully." };
    } catch (error) {
        console.error("Error submitting admission form:", error);
        return { success: false, message: "Failed to submit admission form." };
    }
}

export async function createRazorpayOrder(options: { amount: number; currency: string }) {
    const razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    try {
        const order = await razorpay.orders.create({
            amount: options.amount, // amount in the smallest currency unit
            currency: options.currency,
            receipt: `receipt_order_${new Date().getTime()}`,
        });
        return { success: true, order };
    } catch (error) {
        console.error("Error creating Razorpay order:", error);
        return { success: false, message: "Failed to create Razorpay order." };
    }
}

const feedbackSchema = z.object({
  name: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  category: z.string().min(1, { message: "Please select a category." }),
  rating: z.number().min(1, { message: "Please provide a rating." }),
  feedback: z.string().min(10, { message: "Feedback must be at least 10 characters." }),
});

type FeedbackFormValues = z.infer<typeof feedbackSchema>;

export async function submitFeedback(data: FeedbackFormValues) {
  const validation = feedbackSchema.safeParse(data);
  if (!validation.success) {
    return { success: false, message: "Invalid data provided. Please check your inputs." };
  }

  try {
    await addDoc(collection(db, "feedbackSubmissions"), {
      ...validation.data,
      createdAt: serverTimestamp(),
    });
    return { success: true, message: "Thank you for your valuable feedback!" };
  } catch (error) {
    console.error("Error submitting feedback:", error);
    return { success: false, message: "Failed to submit feedback. Please try again later." };
  }
}

export async function getFeedbackSubmissions() {
    try {
        const feedbackQuery = query(collection(db, "feedbackSubmissions"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(feedbackQuery);
        const feedback = querySnapshot.docs.map(doc => ({ id: doc.id, ...serializeFirestoreData(doc.data()) }));
        return { success: true, data: feedback };
    } catch (error) {
        console.error("Error fetching feedback:", error);
        return { success: false, message: "Failed to fetch feedback submissions." };
    }
}

// NCERT Solutions Data Fetching
const ncertSolutionsData: { [key: string]: any } = {
  'class-10': {
    maths: {
      books: [
        {
          name: "Mathematics Textbook for Class X",
          lang: "en",
          chapters: [
            { name: "Chapter 1: Real Numbers", slug: "real-numbers" },
            { name: "Chapter 2: Polynomials", slug: "polynomials-10" },
            { name: "Chapter 3: Pair of Linear Equations in Two Variables", slug: "pair-of-linear-equations-in-two-variables" },
            { name: "Chapter 4: Quadratic Equations", slug: "quadratic-equations" },
            { name: "Chapter 5: Arithmetic Progressions", slug: "arithmetic-progressions" },
            { name: "Chapter 6: Triangles", slug: "triangles" },
            { name: "Chapter 7: Coordinate Geometry", slug: "coordinate-geometry-10" },
            { name: "Chapter 8: Introduction to Trigonometry", slug: "introduction-to-trigonometry" },
            { name: "Chapter 9: Some Applications of Trigonometry", slug: "some-applications-of-trigonometry" },
            { name: "Chapter 10: Circles", slug: "circles" },
            { name: "Chapter 11: Areas Related to Circles", slug: "areas-related-to-circles" },
            { name: "Chapter 12: Surface Areas and Volumes", slug: "surface-areas-and-volumes" },
            { name: "Chapter 13: Statistics", slug: "statistics" },
            { name: "Chapter 14: Probability", slug: "probability" },
          ],
        },
        {
          name: "विषय सूचि",
          lang: "hi",
          chapters: [
            { name: "अध्याय 1: वास्तविक संख्याएँ", slug: "real-numbers" },
            { name: "अध्याय 2: बहुपद", slug: "polynomials-10" },
            { name: "अध्याय 3: दो चर वाले रैखिक समीकरण युग्म", slug: "pair-of-linear-equations-in-two-variables" },
            { name: "अध्याय 4: द्विघात समीकरण", slug: "quadratic-equations" },
            { name: "अध्याय 5: समांतर श्रेढ़ियाँ", slug: "arithmetic-progressions" },
            { name: "अध्याय 6: त्रिभुज", slug: "triangles" },
            { name: "अध्याय 7: निर्देशांक ज्यामिति", slug: "coordinate-geometry-10" },
            { name: "अध्याय 8: त्रिकोणमिति का परिचय", slug: "introduction-to-trigonometry" },
            { name: "अध्याय 9: त्रिकोणमिति के कुछ अनुप्रयोग", slug: "some-applications-of-trigonometry" },
            { name: "अध्याय 10: वृत्त", slug: "circles" },
            { name: "अध्याय 11: वृत्तों से संबंधित क्षेत्रफल", slug: "areas-related-to-circles" },
            { name: "अध्याय 12: पृष्ठीय क्षेत्रफल और आयतन", slug: "surface-areas-and-volumes" },
            { name: "अध्याय 13: सांख्यिकी", slug: "statistics" },
            { name: "अध्याय 14: प्रायिकता", slug: "probability" },
          ],
        },
      ],
    }
  }
};

export async function getNcertSolutions(className: string, subject: string) {
  try {
    // In a real app, this would fetch from Firestore:
    // const docRef = doc(db, "ncertSolutions", className);
    // const docSnap = await getDoc(docRef);
    // if (docSnap.exists()) {
    //   const data = docSnap.data();
    //   return { success: true, data: data[subject] };
    // }
    
    // For now, return mock data
    const classData = ncertSolutionsData[className];
    if (classData && classData[subject]) {
      return { success: true, data: classData[subject] };
    }
    
    return { success: false, message: "No data found for this class and subject." };

  } catch (error) {
    console.error("Error fetching NCERT solutions:", error);
    return { success: false, message: "Failed to fetch NCERT solutions." };
  }
}
