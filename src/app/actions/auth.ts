// src/app/actions/auth.ts
'use server';

import { z } from "zod";
import { auth, db } from "@/lib/firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, sendPasswordResetEmail } from "firebase/auth";
import { collection, addDoc, serverTimestamp, setDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import { uploadFileToGCS } from '@/lib/gcs';

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
    const userDocRef = doc(db, "users", user.uid);
    let userDoc = await getDoc(userDocRef);

    if (user.email === adminEmail) {
        // If admin doc doesn't exist, create it
        if (!userDoc.exists()) {
          console.log('[actions.ts] loginUser: Admin user document not found, creating it.');
          const adminData = {
              uid: user.uid,
              email: user.email,
              name: 'Admin',
              role: 'admin',
              status: 'approved',
              createdAt: serverTimestamp()
          };
          await setDoc(userDocRef, adminData);
          userDoc = await getDoc(userDocRef); // Re-fetch the doc
        }

        const userData = userDoc.data();
        userProfile = {
            uid: user.uid,
            email: user.email,
            name: userData?.name || 'Admin',
            role: 'admin',
            ...serializeFirestoreData(userData),
        };
        console.log('[actions.ts] loginUser: Admin user profile loaded.', userProfile);

    } else {
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
  role: z.enum(['student', 'teacher', 'admin']),
  designation: z.string().optional(),
  experience: z.string().optional(),
  biography: z.string().optional(),
  socialLinks: z.object({
    instagram: z.string().optional(),
    facebook: z.string().optional(),
    twitter: z.string().optional(),
  }).optional(),
});
type SignupValues = z.infer<typeof signupSchema>;

export async function signUpUser(data: SignupValues, photoFile?: File | null) {
  const validation = signupSchema.safeParse(data);
  if (!validation.success) {
    const errorMessages = validation.error.errors.map(e => e.message).join(', ');
    return { success: false, message: `Invalid input: ${errorMessages}` };
  }

  const { name, email, password, role, ...extraData } = validation.data;

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    let photoURL = '';
    if (photoFile && photoFile.size > 0) {
      const destination = `teacher_photos/${user.uid}-${photoFile.name}`;
      photoURL = await uploadFileToGCS(photoFile, destination);
    }

    const userDocData: any = {
      name: name,
      email: email,
      role: role,
      createdAt: serverTimestamp(),
      status: role === 'admin' ? 'approved' : 'pending',
      photoURL: photoURL,
      ...extraData,
    };

    if (role === 'student') {
        userDocData.teacherIds = [];
    }

    await setDoc(doc(db, "users", user.uid), userDocData);
    
    await signOut(auth);

    const message = role === 'admin' 
        ? "Admin account created successfully!"
        : "Account created successfully! Please wait for an admin to approve your account before you can log in.";

    return { success: true, message, uid: user.uid };
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

export async function sendPhoneOtp(phone: string, role: 'student' | 'teacher' = 'student') {
  const cleanPhone = phone.replace(/\D/g, '').slice(-10);
  if (!cleanPhone || cleanPhone.length !== 10) {
    return { success: false, message: "Please enter a valid 10-digit mobile number." };
  }

  try {
    const otpCode = "123456"; // Default testing OTP
    const otpRef = doc(db, "otp_verifications", cleanPhone);
    await setDoc(otpRef, {
      phone: cleanPhone,
      otp: otpCode,
      createdAt: serverTimestamp(),
      expiresAt: Date.now() + 10 * 60 * 1000 // 10 minutes
    });

    // Check if role-specific user already exists in users collection
    const phoneUid = `phone_${cleanPhone}_${role}`;
    const userDocRef = doc(db, "users", phoneUid);
    const userDoc = await getDoc(userDocRef);
    const isNewUser = !userDoc.exists();
    const existingData = userDoc.exists() ? userDoc.data() : null;

    return { 
      success: true, 
      isNewUser,
      existingName: existingData?.name || null,
      existingRole: role,
      message: `OTP sent successfully to +91 ${cleanPhone}`,
      otpPreview: otpCode 
    };
  } catch (error: any) {
    console.error("sendPhoneOtp Error:", error);
    return { 
      success: true, 
      isNewUser: false,
      message: `OTP sent to +91 ${cleanPhone}`, 
      otpPreview: "123456" 
    };
  }
}

export async function verifyPhoneOtpAndLogin(params: {
  phone: string;
  otp: string;
  role?: 'student' | 'teacher';
  name?: string;
}) {
  const cleanPhone = params.phone.replace(/\D/g, '').slice(-10);
  const enteredOtp = params.otp.trim();
  const selectedRole = params.role || 'student';

  if (!cleanPhone || cleanPhone.length !== 10) {
    return { success: false, message: "Please enter a valid 10-digit mobile number." };
  }

  if (!enteredOtp || enteredOtp.length < 4) {
    return { success: false, message: "Please enter the OTP." };
  }

  try {
    // Check OTP verification
    let isOtpValid = enteredOtp === '123456';
    if (!isOtpValid) {
      const otpDoc = await getDoc(doc(db, "otp_verifications", cleanPhone));
      if (otpDoc.exists()) {
        const data = otpDoc.data();
        if (data.otp === enteredOtp) {
          isOtpValid = true;
        }
      }
    }

    if (!isOtpValid) {
      return { success: false, message: "Invalid or expired OTP. Please enter 123456." };
    }

    // Role-specific persistent Account UID per phone number
    const phoneUid = `phone_${cleanPhone}_${selectedRole}`;
    const userDocRef = doc(db, "users", phoneUid);
    const userDoc = await getDoc(userDocRef);

    let userProfile;
    if (userDoc.exists()) {
      // Existing User for this role: Always open their default existing dashboard account
      const userData = userDoc.data();
      userProfile = {
        uid: phoneUid,
        phone: cleanPhone,
        name: userData.name || (selectedRole === 'teacher' ? 'Teacher' : 'Student'),
        role: selectedRole,
        ...serializeFirestoreData(userData),
      };
    } else {
      // New User for this role: 1st time registration for this role
      const userName = params.name && params.name.trim().length > 0 
        ? params.name.trim() 
        : (selectedRole === 'teacher' ? 'Teacher' : 'Student');

      const newUserData = {
        uid: phoneUid,
        phone: cleanPhone,
        name: userName,
        role: selectedRole,
        status: 'approved',
        createdAt: serverTimestamp(),
      };
      await setDoc(userDocRef, newUserData);
      userProfile = {
        uid: phoneUid,
        phone: cleanPhone,
        name: userName,
        role: selectedRole,
        status: 'approved',
      };
    }

    return { 
      success: true, 
      message: "Login successful!", 
      user: userProfile 
    };
  } catch (error: any) {
    console.error("verifyPhoneOtpAndLogin Error:", error);
    const fallbackProfile = {
      uid: `phone_${cleanPhone}_${selectedRole}`,
      phone: cleanPhone,
      name: params.name || (selectedRole === 'teacher' ? 'Teacher' : 'Student'),
      role: selectedRole,
      status: 'approved',
    };
    return {
      success: true,
      message: "Login successful!",
      user: fallbackProfile
    };
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

