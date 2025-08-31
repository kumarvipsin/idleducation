
'use client';

import { usePathname } from 'next/navigation';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Toaster } from "@/components/ui/toaster"
import { ChatBot } from '@/components/chat-bot';
import { useAuth } from '@/context/auth-context';

export function AppContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user } = useAuth();
  
  // Define paths where the footer should be hidden even for non-logged-in users
  const noFooterPaths = ['/login', '/signup'];
  
  // The footer should not be shown if the user is on a dashboard path OR if they are simply logged in.
  const showFooter = !user && !noFooterPaths.some(path => pathname.startsWith(path));

  return (
    <>
      <Header />
      <main className="flex-grow">
        {children}
      </main>
      {showFooter && <Footer />}
      <Toaster />
      <ChatBot />
    </>
  );
}
