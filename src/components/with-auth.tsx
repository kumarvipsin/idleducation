'use client';

import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect, useState, type ComponentType } from 'react';
import { Skeleton } from './ui/skeleton';

const withAuth = <P extends object>(
  WrappedComponent: ComponentType<P>,
  allowedRoles: Array<'student' | 'teacher' | 'admin'>
) => {
  const AuthComponent = (props: P) => {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
      setIsClient(true);
    }, []);

    useEffect(() => {
      if (!isClient || loading) return;

      if (!user) {
        router.replace('/login');
        return;
      }

      if (user.role && !allowedRoles.includes(user.role)) {
        const dashboardPath = user.role === 'admin' 
            ? '/admin/dashboard' 
            : `/${user.role}/dashboard`;
        router.replace(dashboardPath);
      }
    }, [user, loading, router, isClient]);

    if (!isClient || loading || !user) {
      return null;
    }
    
    if (user.role && !allowedRoles.includes(user.role)) {
      return null;
    }

    // In Next.js 15, params and searchParams are Promises.
    // Spreading props will trigger enumeration and a warning.
    // We extract them and pass them through explicitly.
    const { params, searchParams, ...rest } = props as any;

    return <WrappedComponent {...(rest as P)} params={params} searchParams={searchParams} />;
  };

  AuthComponent.displayName = `withAuth(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

  return AuthComponent;
};

export default withAuth;
