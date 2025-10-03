
'use client';

import React, { createContext, useState, useContext, useEffect, ReactNode, useCallback } from 'react';
import { useRouter } from 'next/navigation';

export interface StoreUserProfile {
  id: string;
  name: string;
  mobile: string;
}

interface StoreAuthContextType {
  user: StoreUserProfile | null;
  loading: boolean;
  login: (profile: StoreUserProfile) => void;
  logout: () => void;
}

const StoreAuthContext = createContext<StoreAuthContextType | undefined>(undefined);

export const StoreAuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<StoreUserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    try {
      const storedUser = sessionStorage.getItem('storeUserProfile');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to parse store user from sessionStorage", error);
      sessionStorage.removeItem('storeUserProfile');
    }
    setLoading(false);
  }, []);

  const login = (profile: StoreUserProfile) => {
    sessionStorage.setItem('storeUserProfile', JSON.stringify(profile));
    setUser(profile);
    setLoading(false);
  };

  const logout = () => {
    sessionStorage.removeItem('storeUserProfile');
    setUser(null);
    setLoading(false);
    router.push('/store');
  };

  return (
    <StoreAuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </StoreAuthContext.Provider>
  );
};

export const useStoreAuth = (): StoreAuthContextType => {
  const context = useContext(StoreAuthContext);
  if (!context) {
    throw new Error('useStoreAuth must be used within a StoreAuthProvider');
  }
  return context;
};
