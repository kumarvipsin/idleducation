
'use server';
import { z } from "zod";
import 'dotenv/config';
import { auth, db } from "@/lib/firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, sendPasswordResetEmail } from "firebase/auth";
import { collection, addDoc, serverTimestamp, setDoc, doc, getDoc, query, where, getDocs, updateDoc, Timestamp, orderBy, deleteDoc, writeBatch,getCountFromServer, limit, startAt } from "firebase/firestore";
import { format } from "date-fns";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const formSchema = z.object({
  sessionMode: z.enum(["online", "offline"]),
  studentName: z.string().min(2, { message: "Name must be at least 2 characters." }),
  classCourse: z.string().min(1, { message: "Please enter your class or course." }),
  countryCode: z.string(),
  mobile: z.string().regex(/^\d{10}$/, { message: "Please enter a valid 10-digit mobile number." }),
  email: z.string().email({ message: "Please enter a valid email address." }).optional().or(z.literal('')),
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
  const validation = loginSchema.safeParse(data);
  if (!validation.success) {
    return { success: false, message: "Invalid input." };
  }

  const { email, password } = validation.data;
  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'aksias.sos@outlook.com';

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    let userProfile;

    if (user.email === adminEmail) {
      userProfile = {
        uid: user.uid,
        email: user.email,
        name: 'Admin',
        role: 'admin',
      };
    } else {
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
            const userData = userDoc.data();

            if (userData.status === 'pending') {
                await signOut(auth);
                return { success: false, message: "Your account is pending approval. Please wait for an admin to approve it." };
            }
            if (userData.status === 'inactive') {
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
        } else {
            await signOut(auth);
            return { success: false, message: "User data not found. Please contact support." };
        }
    }

    return { success: true, message: "Login successful!", user: userProfile };

  } catch (error: any) {
    let message = "An unknown error occurred.";
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
  try {
    // This will not sign out the client, as auth state is managed on the client.
    // await signOut(auth); 
    return { success: true, message: "Logout successful." };
  } catch (error) {
    console.error("Logout Error:", error);
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
  email: z.string().email({ message: "Please enter a valid email." }).optional().or(z.literal('')),
  countryCode: z.string(),
  phone: z.string().min(10, { message: "Please enter a valid phone number." }),
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
        const fiscalYear = fiscalYearStart.getFullYear();

        const monthNames = ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar"];
        
        const allUsersQuery = query(collection(db, "users"), where("createdAt", ">=", fiscalYearStart), where("createdAt", "<=", fiscalYearEnd));
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

        const chartData = monthNames.map((monthName, i) => {
            const month = (i + 3) % 12;
            const year = month < 3 ? fiscalYear + 1 : fiscalYear;
            
            const usersInMonth = allUsers.filter(u => {
                const createdAtDate = u.createdAt;
                return createdAtDate.getFullYear() === year && createdAtDate.getMonth() === month;
            });

            const newStudents = usersInMonth.filter(u => u.role === 'student' && u.status === 'approved').length;
            const totalUsers = usersInMonth.length;
            const totalStudents = usersInMonth.filter(u => u.role === 'student').length;
            const trainedStudents = usersInMonth.filter(u => u.role === 'student' && u.status === 'approved' && u.teacherIds && u.teacherIds.length > 0).length;
            const totalTeachers = usersInMonth.filter(u => u.role === 'teacher').length;

            return { 
                name: monthName,
                newStudents,
                totalUsers,
                totalStudents,
                trainedStudents,
                totalTeachers
            };
        });
        
        let cumulativeUsers = 0;
        let cumulativeStudents = 0;
        let cumulativeTrained = 0;
        let cumulativeTeachers = 0;

        const cumulativeChartData = chartData.map(monthData => {
             cumulativeUsers += monthData.totalUsers;
             cumulativeStudents += monthData.totalStudents;
             cumulativeTrained += monthData.trainedStudents;
             cumulativeTeachers += monthData.totalTeachers;
            
             return {
                name: monthData.name,
                newStudents: monthData.newStudents,
                totalUsers: cumulativeUsers,
                totalStudents: cumulativeStudents,
                trainedStudents: cumulativeTrained,
                totalTeachers: cumulativeTeachers
             }
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
        email: rawFormData.email as string,
        studentPhone: rawFormData.studentPhone as string || '',
        fatherPhone: rawFormData.fatherPhone as string,
        motherPhone: rawFormData.motherPhone as string,
        address: rawFormData.address as string,
        classApplied: rawFormData.classApplied as string,
        previousSchool: rawFormData.previousSchool as string || '',
        additionalInfo: rawFormData.additionalInfo as string || '',
        branch: rawFormData.branch as string,
        transactionId: rawFormData.transactionId as string,
    };
    
    try {
        let studentPhotoUrl = '';
        if (studentPhoto && studentPhoto.size > 0) {
            const storage = getStorage();
            const photoRef = ref(storage, `student_photos/${admissionData.studentId}-${studentPhoto.name}`);
            const snapshot = await uploadBytes(photoRef, studentPhoto);
            studentPhotoUrl = await getDownloadURL(snapshot.ref);
        }
        
        await addDoc(collection(db, "admissions"), {
            ...admissionData,
            studentPhotoUrl,
            createdAt: serverTimestamp(),
            status: 'submitted',
        });
        
        return { success: true, message: "Admission form submitted successfully." };
    } catch (error) {
        console.error("Error submitting admission form:", error);
        return { success: false, message: "Failed to submit admission form." };
    }
}
