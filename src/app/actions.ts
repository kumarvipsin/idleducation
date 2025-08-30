
'use server';
import { z } from "zod";
import 'dotenv/config';
import { auth, db } from "@/lib/firebase";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

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
  role: z.enum(['student', 'teacher'])
});

type LoginValues = z.infer<typeof loginSchema>;

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

    if (user && user.email === adminEmail) {
      return { success: true, message: "Admin login successful!", role: 'admin' };
    }
    
    // The role from the form is used for redirection purposes on the client
    return { success: true, message: "Login successful!", role: data.role };
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
      default:
        console.error("Firebase Auth Error:", error);
        message = 'Failed to login. Please try again later.';
        break;
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
