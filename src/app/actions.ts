
'use server';
import { z } from "zod";
import 'dotenv/config';
import { auth, db } from "@/lib/firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, sendPasswordResetEmail } from "firebase/auth";
import { collection, addDoc, serverTimestamp, setDoc, doc, getDoc, query, where, getDocs, updateDoc, Timestamp } from "firebase/firestore";

const formSchema = z.object({
  sessionMode: z.enum(["online", "offline"]),
  childName: z.string().min(2, { message: "Name must be at least 2 characters." }),
  classCourse: z.string().min(1, { message: "Please enter your class or course." }),
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
  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;

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
    };

    if (role === 'student') {
        userDocData.teacherIds = [];
    }

    await setDoc(doc(db, "users", user.uid), userDocData);
    
    const userProfile = {
      uid: user.uid,
      email: user.email,
      name: name,
      role: role,
      ...serializeFirestoreData(userDocData),
    };


    return { success: true, message: "Account created successfully!", user: userProfile };
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
