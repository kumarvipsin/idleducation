
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
    // Attempt to load user from sessionStorage on initial load
    try {
      const storedUser = sessionStorage.getItem('userProfile');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to parse user profile from sessionStorage", error);
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userDocRef = doc(db, "users", firebaseUser.uid);
        const userDoc = await getDoc(userDocRef);
        
        let userProfile: UserProfile | null = null;

        if (userDoc.exists()) {
            const userData = userDoc.data();
            userProfile = {
                uid: firebaseUser.uid,
                email: firebaseUser.email,
                name: userData.name,
                role: userData.role,
                ...serializeFirestoreData(userData),
            };
        } else if (firebaseUser.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
            userProfile = {
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              name: 'Admin',
              role: 'admin',
            };
        }

        if (userProfile) {
          // If a user is found, update state and sessionStorage
          setUser(userProfile);
          sessionStorage.setItem('userProfile', JSON.stringify(userProfile));
        } else {
          // This case handles when a Firebase user exists but has no profile data in Firestore.
          // This is an invalid state, so we log them out.
          await signOut(auth); 
          setUser(null);
          sessionStorage.removeItem('userProfile');
        }
      } else {
        // Firebase confirms no user is signed in.
        // We only clear the state if there isn't already a user from sessionStorage.
        // The actual clearing of sessionStorage should only happen on explicit logout.
        if (user) {
          // This can happen if the token expires. Let's log them out fully.
          setUser(null);
          sessionStorage.removeItem('userProfile');
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  // We run this effect only once on mount. The `user` dependency is removed to prevent re-runs that clear state.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = (profile: UserProfile) => {
    sessionStorage.setItem('userProfile', JSON.stringify(profile));
    setUser(profile);
    setLoading(false);
  };

  const logout = async () => {
    await signOut(auth);
    sessionStorage.removeItem('userProfile');
    setUser(null);
    setLoading(false);
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
