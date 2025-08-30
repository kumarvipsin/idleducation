
"use client";

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { onAuthStateChanged, signOut, type User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

export interface UserProfile extends FirebaseUser {
  role: 'student' | 'teacher' | 'admin' | null;
  name: string | null;
}

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    console.log("AuthProvider mounted. Setting up auth state listener.");
    
    // Attempt to load user from sessionStorage on initial load
    try {
      console.log("Attempting to load user from sessionStorage.");
      const sessionUser = sessionStorage.getItem('userProfile');
      if (sessionUser) {
        const parsedUser = JSON.parse(sessionUser);
        setUser(parsedUser);
        console.log("Successfully loaded user from sessionStorage:", parsedUser);
      } else {
        console.log("No user found in sessionStorage.");
      }
    } catch (error) {
      console.error("Failed to parse user profile from session storage", error);
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log("onAuthStateChanged triggered.");
      if (firebaseUser) {
        console.log("Firebase Auth reports a logged-in user:", firebaseUser.uid);
        
        // If user from session storage is already set, no need to re-fetch unless it's a different user
        if (user && user.uid === firebaseUser.uid) {
            console.log("User from context matches Firebase user. No re-fetch needed.");
            setLoading(false);
            return;
        }

        console.log("Fetching user details from Firestore...");
        const userDocRef = doc(db, "users", firebaseUser.uid);
        const userDoc = await getDoc(userDocRef);
        let role: UserProfile['role'] = null;
        let name: UserProfile['name'] = null;

        if (userDoc.exists()) {
          const userData = userDoc.data();
          role = userData.role;
          name = userData.name;
          console.log("User document found in Firestore. Role:", role, "Name:", name);
        } else if (firebaseUser.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
          role = 'admin';
          name = 'Admin';
          console.log("User is an admin.");
        } else {
          console.log("User document not found in Firestore.");
        }
        
        const userProfile: UserProfile = { 
          ...firebaseUser,
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
          emailVerified: firebaseUser.emailVerified,
          role, 
          name 
        };
        
        console.log("Constructed final userProfile:", userProfile);
        console.log("Saving userProfile to sessionStorage and updating state.");
        sessionStorage.setItem('userProfile', JSON.stringify(userProfile));
        setUser(userProfile);

      } else {
        console.log("Firebase Auth reports no user is logged in.");
        console.log("Clearing user from sessionStorage and state.");
        sessionStorage.removeItem('userProfile');
        setUser(null);
      }
      console.log("Auth loading finished.");
      setLoading(false);
    });

    return () => {
      console.log("Cleaning up auth state listener.");
      unsubscribe();
    };
  }, []);

  const logout = async () => {
    console.log("Logout function called.");
    await signOut(auth);
    console.log("Firebase signOut successful. Clearing session.");
    sessionStorage.removeItem('userProfile');
    setUser(null);
    router.push('/'); 
    console.log("Redirected to homepage.");
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
