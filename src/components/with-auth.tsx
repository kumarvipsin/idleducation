'use client';

import { useAuth } from '@/context/auth-context';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState, type ComponentType } from 'react';
import { Skeleton } from './ui/skeleton';

const withAuth = <P extends object>(
  WrappedComponent: ComponentType<P>,
  allowedRoles: Array<'student' | 'teacher' | 'admin'>
) => {
  const AuthComponent = (props: P) => {
    const { user, loading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
      setIsClient(true);
    }, []);

    useEffect(() => {
      if (!isClient || loading) return;

      const checkAuth = async () => {
        if (pathname?.startsWith('/admin/attendance') || pathname?.startsWith('/admin/fees') || pathname?.startsWith('/fee-management')) {
          return;
        }

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
      };

      checkAuth();
    }, [user, loading, router, isClient, pathname]);

    if (!isClient || loading) {
      return null;
    }

    if (!user) {
      if (pathname?.startsWith('/admin/attendance') || pathname?.startsWith('/admin/fees') || pathname?.startsWith('/fee-management')) {
        const { params, searchParams, ...rest } = props as any;
        return <WrappedComponent {...(rest as P)} params={params} searchParams={searchParams} />;
      }
      return null;
    }
    
    if (user.role && !allowedRoles.includes(user.role)) {
      return null;
    }

    // Next.js 15 compatibility: Avoid spreading props that might contain params/searchParams promises.
    // We explicitly extract them to prevent triggers of synchronous enumeration warnings.
    const { params, searchParams, ...rest } = props as any;
    return <WrappedComponent {...(rest as P)} params={params} searchParams={searchParams} />;
  };

  AuthComponent.displayName = `withAuth(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

  return AuthComponent;
};

export default withAuth;
