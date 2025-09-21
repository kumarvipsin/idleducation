// src/app/actions/auth.ts
'use server';

import { z } from "zod";
import { auth, db } from "@/lib/firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, sendPasswordResetEmail } from "firebase/auth";
import { collection, addDoc, serverTimestamp, setDoc, doc, getDoc } from "firebase/firestore";

import { serializeFirestoreData } from './utils';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, { message: "Password is required." }),
});
type LoginValues = z.infer<typeof loginSchema>;

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

    const userDocData: any = {
      name: name,
      email: email,
      role: role,
      createdAt: serverTimestamp(),
      status: 'pending', 
    };

    if (role === 'student') {
        userDocData.teacherIds = [];
    }

    await setDoc(doc(db, "users", user.uid), userDocData);
    
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

export async function logoutUser() {
  console.log('[actions.ts] logoutUser: Server action called.');
  try {
    return { success: true, message: "Logout successful." };
  } catch (error) {
    console.error("[actions.ts] logoutUser: Error during server-side logout attempt:", error);
    return { success: false, message: "Logout failed. Please try again." };
  }
}
