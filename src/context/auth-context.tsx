
"use client";

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { onAuthStateChanged, signOut, type User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

export interface UserProfile extends FirebaseUser {
  role: 'student' | 'teacher' | 'admin' | null;
  name: string | null; // Add name to the user profile
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
    const sessionUser = sessionStorage.getItem('userProfile');
    if (sessionUser) {
        setUser(JSON.parse(sessionUser));
        setLoading(false);
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // If user is already loaded from session, check if it's the same user
        const sessionData = sessionUser ? JSON.parse(sessionUser) : null;
        if (sessionData && sessionData.uid === firebaseUser.uid) {
            setLoading(false);
            return;
        }

        const userDocRef = doc(db, "users", firebaseUser.uid);
        const userDoc = await getDoc(userDocRef);
        let role: UserProfile['role'] = null;
        let name: UserProfile['name'] = null;

        if (userDoc.exists()) {
          const userData = userDoc.data();
          role = userData.role;
          name = userData.name; // Fetch name from Firestore
        } else if (firebaseUser.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
          role = 'admin';
          name = 'Admin'; // Default admin name
        }
        
        const userProfile: UserProfile = { ...firebaseUser, role, name };
        
        sessionStorage.setItem('userProfile', JSON.stringify(userProfile));
        setUser(userProfile);

      } else {
        sessionStorage.removeItem('userProfile');
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

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
