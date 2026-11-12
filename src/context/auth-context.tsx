
"use client";

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { multiFactor, onAuthStateChanged, signOut, type User as FirebaseUser } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { doc, getDoc, Timestamp, setDoc, serverTimestamp } from 'firebase/firestore';
import { getServerSessionUser, logoutUser, syncServerSessionFromIdToken, syncServerSessionFromProfile } from '@/app/actions/auth';
import { getBranchDisplayName, normalizeBranchId } from '@/lib/branch-utils';

export interface UserProfile extends Partial<FirebaseUser> {
  uid: string;
  role: 'student' | 'teacher' | 'admin' | null;
  name: string | null;
  branchId?: string | null;
  branchName?: string | null;
  phone?: string | null;
  address?: string | null;
  status?: string | null;
  emailVerified?: boolean;
  twoFactorEnabled?: boolean;
  lastSignInTime?: string | null;
  dob?: string | Date | null;
  bloodGroup?: string | null;
  createdAt?: string | null;
}

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  login: (profile: UserProfile) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const serializeFirestoreData = (docData: any): any => {
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
  const authMutationVersionRef = React.useRef(0);
  
  useEffect(() => {
    let initialStoredUser: UserProfile | null = null;
    const storedProfile = sessionStorage.getItem('userProfile');
    if (storedProfile) {
      try {
        const profile = JSON.parse(storedProfile);
        initialStoredUser = profile;
        setUser(profile);
        if (profile?.uid && localStorage.getItem('idl_active_cookie_uid') !== profile.uid) {
          syncServerSessionFromProfile({ uid: profile.uid, email: profile.email })
            .then((res) => {
              if (res?.success && res.user?.uid) {
                localStorage.setItem('idl_active_cookie_uid', res.user.uid);
              }
            })
            .catch(() => {});
        }
      } catch (e) {
        console.error("Failed to parse user profile from session storage", e);
        sessionStorage.removeItem('userProfile');
      }
    }
    // We set loading to false initially to avoid a flicker on page load
    // if the user is already authenticated from session storage.
    // The onAuthStateChanged listener will then verify and update if needed.
    setLoading(false);

    const syncTabCookieIfNeeded = () => {
      try {
        const raw = sessionStorage.getItem('userProfile');
        if (!raw) return;
        const parsed = JSON.parse(raw);
        if (parsed?.uid && localStorage.getItem('idl_active_cookie_uid') !== parsed.uid) {
          syncServerSessionFromProfile({ uid: parsed.uid, email: parsed.email })
            .then((res) => {
              if (res?.success && res.user?.uid) {
                localStorage.setItem('idl_active_cookie_uid', res.user.uid);
              }
            })
            .catch(() => {});
        }
      } catch {
        // Ignore parse errors
      }
    };

    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        syncTabCookieIfNeeded();
      }
    };
    window.addEventListener('focus', syncTabCookieIfNeeded);
    document.addEventListener('visibilitychange', handleVisibility);

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      const runVersion = authMutationVersionRef.current;
      setLoading(true);
      if (firebaseUser) {
        const userDocRef = doc(db, "users", firebaseUser.uid);
        const userDoc = await getDoc(userDocRef);
        if (runVersion !== authMutationVersionRef.current) return;
        
        let userProfile: UserProfile | null = null;
        let twoFactorEnabled: boolean | undefined;
        try {
          const enrolledFactors = multiFactor(firebaseUser)?.enrolledFactors;
          if (Array.isArray(enrolledFactors)) {
            twoFactorEnabled = enrolledFactors.length > 0;
          }
        } catch {
          const mfaInfo = (firebaseUser as any)?.reloadUserInfo?.mfaInfo;
          if (Array.isArray(mfaInfo)) {
            twoFactorEnabled = mfaInfo.length > 0;
          }
        }
        const securityMeta: Partial<UserProfile> = {
          ...(typeof firebaseUser.emailVerified === 'boolean'
            ? { emailVerified: firebaseUser.emailVerified }
            : {}),
          ...(typeof twoFactorEnabled === 'boolean' ? { twoFactorEnabled } : {}),
          ...(firebaseUser.metadata?.lastSignInTime
            ? { lastSignInTime: firebaseUser.metadata.lastSignInTime }
            : {}),
        };
        
        if (userDoc.exists()) {
            const userData = userDoc.data();
            const isAdminRole = String(userData.role || '').toLowerCase() === 'admin';
            const rawBranchId = normalizeBranchId(userData.branchId || userData.branchName || userData.branch);
            const branchId = isAdminRole
              ? (firebaseUser.email === 'aksias.sos@outlook.com' ? 'all' : (rawBranchId || 'all'))
              : rawBranchId;
            const branchName = userData.branchName || (branchId ? getBranchDisplayName(branchId, true) : null);

            userProfile = {
                ...serializeFirestoreData(userData),
                uid: firebaseUser.uid,
                email: firebaseUser.email,
                name: userData.name,
                role: isAdminRole ? 'admin' : userData.role,
                branchId: branchId,
                branchName: branchName,
                status: userData.status || 'approved',
                ...securityMeta,
            };
        } else if (firebaseUser.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL || firebaseUser.email === 'aksias.sos@outlook.com') {
             userProfile = {
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              name: 'Admin',
              role: 'admin',
              branchId: 'all',
              branchName: 'All Branches (Super Admin)',
              status: 'approved',
              ...securityMeta,
            };
            const adminData = {
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              name: 'Admin',
              role: 'admin',
              branchId: 'all',
              branchName: 'All Branches (Super Admin)',
              status: 'approved',
              createdAt: serverTimestamp()
            };
            await setDoc(userDocRef, adminData, { merge: true });
            if (runVersion !== authMutationVersionRef.current) return;
        }

        if (userProfile) {
          try {
            const idToken = await firebaseUser.getIdToken();
            await syncServerSessionFromIdToken(idToken);
            localStorage.setItem('idl_active_cookie_uid', userProfile.uid);
          } catch {
            // Non-blocking sync fallback
          }
          if (runVersion !== authMutationVersionRef.current) return;
          setUser(userProfile);
          sessionStorage.setItem('userProfile', JSON.stringify(userProfile));
        } else {
          await logoutUser();
          await signOut(auth);
          if (runVersion !== authMutationVersionRef.current) return;
          setUser(null);
          sessionStorage.removeItem('userProfile');
        }
      } else {
        try {
          if (initialStoredUser?.uid) {
            const syncRes = await syncServerSessionFromProfile({
              uid: initialStoredUser.uid,
              email: initialStoredUser.email,
            });
            if (runVersion !== authMutationVersionRef.current) return;
            if (syncRes?.success && syncRes.user) {
              localStorage.setItem('idl_active_cookie_uid', syncRes.user.uid);
              setUser(syncRes.user as UserProfile);
              sessionStorage.setItem('userProfile', JSON.stringify(syncRes.user));
              setLoading(false);
              return;
            }
          }
          const sessionRes = await getServerSessionUser();
          if (runVersion !== authMutationVersionRef.current) return;
          if (sessionRes?.success && sessionRes.user) {
            localStorage.setItem('idl_active_cookie_uid', sessionRes.user.uid);
            setUser(sessionRes.user as UserProfile);
            sessionStorage.setItem('userProfile', JSON.stringify(sessionRes.user));
            setLoading(false);
            return;
          }
        } catch {
          // Fall through to clear state
        }
        if (runVersion !== authMutationVersionRef.current) return;
        setUser(null);
        sessionStorage.removeItem('userProfile');
      }
      setLoading(false);
    });

    return () => {
      window.removeEventListener('focus', syncTabCookieIfNeeded);
      document.removeEventListener('visibilitychange', handleVisibility);
      unsubscribe();
    };
  }, []);

  const login = (profile: UserProfile) => {
    authMutationVersionRef.current += 1;
    const isAdminRole = String(profile?.role || '').toLowerCase() === 'admin';
    const rawBranchId = normalizeBranchId(
      profile?.branchId || profile?.branchName || (profile as any)?.branch
    );
    const branchId = isAdminRole
      ? (profile?.email === 'aksias.sos@outlook.com' ? 'all' : (rawBranchId || 'all'))
      : rawBranchId;
    const branchName =
      profile?.branchName || (branchId ? getBranchDisplayName(branchId, true) : null);

    const normalizedProfile: UserProfile = {
      ...profile,
      role: (isAdminRole ? 'admin' : profile.role) as UserProfile['role'],
      branchId,
      branchName,
    };

    if (auth.currentUser && auth.currentUser.uid !== normalizedProfile.uid) {
      signOut(auth).catch(() => {});
    }

    if (normalizedProfile.uid) {
      localStorage.setItem('idl_active_cookie_uid', normalizedProfile.uid);
    }
    sessionStorage.setItem('userProfile', JSON.stringify(normalizedProfile));
    setUser(normalizedProfile);
    setLoading(false);
  };

  const logout = async () => {
    authMutationVersionRef.current += 1;
    localStorage.removeItem('idl_active_cookie_uid');
    await logoutUser();
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
