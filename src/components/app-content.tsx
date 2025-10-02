
'use client';

import { usePathname } from 'next/navigation';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Toaster } from "@/components/ui/toaster"
import { ChatBotWrapper } from '@/components/chat-bot-wrapper';

export function AppContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  const isAdminPage = pathname.startsWith('/admin');
  const isStudentPage = pathname.startsWith('/student');
  const isTeacherPage = pathname.startsWith('/teacher');
  
  const noHeaderFooterPages = [
    '/scholarship',
    '/book-demo',
    '/admission',
    '/feedback',
    '/login',
    '/signup',
    '/about',
    '/contact',
    '/gallery',
    '/feature',
    '/school',
    '/examcat',
    '/resources',
    '/notifications',
  ];

  const showHeader = !noHeaderFooterPages.some(path => pathname.startsWith(path)) && !isStudentPage && !isTeacherPage && !isAdminPage;
  const showFooter = !isAdminPage && !isStudentPage && !isTeacherPage && !noHeaderFooterPages.some(path => pathname.startsWith(path)) && !pathname.startsWith('/about') && !pathname.startsWith('/contact') && !pathname.startsWith('/gallery');


  if (isStudentPage || isTeacherPage || isAdminPage) {
     return (
        <>
            {children}
            <Toaster />
        </>
    );
  }

  // For special public pages that shouldn't have a header or footer
  if (noHeaderFooterPages.some(path => pathname.startsWith(path))) {
    return (
        <>
            <main className="flex-grow">
                {children}
            </main>
            <Toaster />
        </>
    );
  }

  return (
    <>
      {showHeader && <Header />}
      <main className="flex-grow">
        {children}
      </main>
      {showFooter && <Footer />}
      <ChatBotWrapper />
      <Toaster />
    </>
  );
}
