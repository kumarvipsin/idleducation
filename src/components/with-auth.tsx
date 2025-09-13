
'use client';

import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect, type ComponentType } from 'react';
import { Skeleton } from './ui/skeleton';

const withAuth = <P extends object>(
  WrappedComponent: ComponentType<P>,
  allowedRoles: Array<'student' | 'teacher' | 'admin'>
) => {
  const AuthComponent = (props: P) => {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (loading) return;

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
    }, [user, loading, router]);

    if (loading || !user) {
      return (
        <div className="flex items-center justify-center h-screen bg-white">
        </div>
      );
    }
    
    if (user.role && !allowedRoles.includes(user.role)) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };

  AuthComponent.displayName = `withAuth(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

  return AuthComponent;
};

export default withAuth;
