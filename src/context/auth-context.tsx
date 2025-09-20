
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
    console.log('[auth-context] AuthProvider mounting. Setting up onAuthStateChanged listener.');
    // Attempt to load user from sessionStorage on initial load
    try {
      const storedUser = sessionStorage.getItem('userProfile');
      if (storedUser) {
        console.log('[auth-context] Found user in sessionStorage, setting initial state.');
        setUser(JSON.parse(storedUser));
      } else {
         console.log('[auth-context] No user in sessionStorage.');
      }
    } catch (error) {
        console.error("[auth-context] Failed to parse user from sessionStorage", error);
        sessionStorage.removeItem('userProfile');
    }
    // We still set loading to true to allow Firebase to verify the session
    setLoading(true);

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log('[auth-context] onAuthStateChanged triggered.');
      if (firebaseUser) {
        console.log('[auth-context] Firebase user detected with UID:', firebaseUser.uid);
        const userDocRef = doc(db, "users", firebaseUser.uid);
        const userDoc = await getDoc(userDocRef);
        
        let userProfile: UserProfile | null = null;

        if (userDoc.exists()) {
            console.log('[auth-context] Found user document in Firestore.');
            const userData = userDoc.data();
            userProfile = {
                uid: firebaseUser.uid,
                email: firebaseUser.email,
                name: userData.name,
                role: userData.role,
                ...serializeFirestoreData(userData),
            };
        } else if (firebaseUser.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
            console.log('[auth-context] Admin user detected.');
            userProfile = {
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              name: 'Admin',
              role: 'admin',
            };
        }

        if (userProfile) {
          console.log('[auth-context] Setting user profile and storing in sessionStorage.');
          setUser(userProfile);
          sessionStorage.setItem('userProfile', JSON.stringify(userProfile));
        } else {
          console.error('[auth-context] Firebase user exists but no profile found. Logging out.');
          await signOut(auth); 
          setUser(null);
          sessionStorage.removeItem('userProfile');
        }
      } else {
        console.log('[auth-context] No Firebase user. Clearing state and sessionStorage.');
        setUser(null);
        sessionStorage.removeItem('userProfile');
      }
      console.log('[auth-context] Finished auth state check, setting loading to false.');
      setLoading(false);
    });

    return () => {
        console.log('[auth-context] AuthProvider unmounting. Cleaning up listener.');
        unsubscribe();
    }
  }, []);

  const login = (profile: UserProfile) => {
    console.log('[auth-context] login function called with profile:', profile);
    sessionStorage.setItem('userProfile', JSON.stringify(profile));
    setUser(profile);
    setLoading(false);
    console.log('[auth-context] User state and sessionStorage updated.');
  };

  const logout = async () => {
    console.log('[auth-context] logout function called.');
    await signOut(auth);
    console.log('[auth-context] Firebase signOut successful.');
    sessionStorage.removeItem('userProfile');
    console.log('[auth-context] Removed user from sessionStorage.');
    setUser(null);
    console.log('[auth-context] User state set to null.');
    setLoading(false);
    router.push('/');
    console.log('[auth-context] Redirected to home page.');
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
