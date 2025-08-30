
"use client";

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { onAuthStateChanged, signOut, type User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

export interface UserProfile extends Partial<FirebaseUser> {
  uid: string;
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
    // Attempt to load user from session storage first
    try {
      const sessionUser = sessionStorage.getItem('userProfile');
      if (sessionUser) {
        const parsedUser = JSON.parse(sessionUser);
        setUser(parsedUser);
      }
    } catch (error) {
      console.error("Failed to parse user profile from session storage", error);
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // If user is already in state from session, no need to fetch again
        if (user && user.uid === firebaseUser.uid) {
            setLoading(false);
            return;
        }

        // Fetch user details if not found in session
        const userDocRef = doc(db, "users", firebaseUser.uid);
        const userDoc = await getDoc(userDocRef);
        let role: UserProfile['role'] = null;
        let name: UserProfile['name'] = null;

        if (userDoc.exists()) {
          const userData = userDoc.data();
          role = userData.role;
          name = userData.name;
        } else if (firebaseUser.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
          role = 'admin';
          name = 'Admin';
        }
        
        const userProfile: UserProfile = { 
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          photoURL: firebaseUser.photoURL,
          emailVerified: firebaseUser.emailVerified,
          role, 
          name 
        };
        
        sessionStorage.setItem('userProfile', JSON.stringify(userProfile));
        setUser(userProfile);

      } else {
        // User is signed out
        sessionStorage.removeItem('userProfile');
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []); // The empty array ensures this effect runs only once on mount

  const logout = async () => {
    await signOut(auth);
    sessionStorage.removeItem('userProfile');
    setUser(null);
    router.push('/'); 
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
