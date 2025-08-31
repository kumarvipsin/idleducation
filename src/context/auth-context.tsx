
"use client";

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { onAuthStateChanged, signOut, type User as FirebaseUser } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { doc, getDoc, Timestamp } from 'firebase/firestore';

export interface UserProfile extends Partial<FirebaseUser> {
  uid: string;
  role: 'student' | 'teacher' | 'admin' | null;
  name: string | null;
}

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  login: (profile: UserProfile) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

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


export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const sessionUser = sessionStorage.getItem('userProfile');
    if (sessionUser) {
      try {
        setUser(JSON.parse(sessionUser));
      } catch (error) {
        console.error("Failed to parse user profile from session storage", error);
        sessionStorage.removeItem('userProfile');
      }
    }
    setLoading(false); // Initial load from session storage is done

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // If there's a firebase user, let's ensure our profile is up to date
        // This prevents stale data if the user's role changes, for example.
        const userDocRef = doc(db, "users", firebaseUser.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
            const userData = userDoc.data();
            const userProfile: UserProfile = {
                uid: firebaseUser.uid,
                email: firebaseUser.email,
                name: userData.name,
                role: userData.role,
                ...serializeFirestoreData(userData),
            };
            setUser(userProfile);
            sessionStorage.setItem('userProfile', JSON.stringify(userProfile));
        } else {
            // This might happen if user is in auth but not in firestore.
            // In this case, we log them out.
             await signOut(auth);
             sessionStorage.removeItem('userProfile');
             setUser(null);
        }
      } else {
        sessionStorage.removeItem('userProfile');
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = (profile: UserProfile) => {
    sessionStorage.setItem('userProfile', JSON.stringify(profile));
    setUser(profile);
  };

  const logout = async () => {
    await signOut(auth);
    sessionStorage.removeItem('userProfile');
    setUser(null);
    router.push('/');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
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
