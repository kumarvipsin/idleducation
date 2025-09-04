
'use client';

import { usePathname } from 'next/navigation';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Toaster } from "@/components/ui/toaster"
import { useAuth } from '@/context/auth-context';

export function AppContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  // Define paths where the footer should be visible
  const footerVisiblePaths = ['/', '/about', '/contact'];
  
  // The footer should only be shown on the specified public pages.
  const showFooter = footerVisiblePaths.includes(pathname);

  return (
    <>
      <Header />
      <main className="flex-grow">
        {children}
      </main>
      {showFooter && <Footer />}
      <Toaster />
    </>
  );
}
