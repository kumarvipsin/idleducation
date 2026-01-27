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
  
  const isAdminPage = pathname.startsWith('/admin/');
  const isStudentPage = pathname.startsWith('/student/');
  const isTeacherPage = pathname.startsWith('/teacher/');
  
  const specialLayoutPages = [
    '/book-demo',
    '/student-enquiry',
    '/volunteer',
    '/admission',
    '/login'
  ];
  
  const noHeaderFooterPages = [
    '/scholarship',
    '/feature',
    '/examcat',
    '/notifications',
    '/new-work',
    '/store',
  ];
  
  const isIdlFoundationPage = pathname === '/idl-foundation';

  // 1. Protected routes with their own layouts
  if (isAdminPage || isStudentPage || isTeacherPage) {
     return (
        <>
            {children}
            <Toaster />
        </>
    );
  }
  
  // 2. Special public pages that need header/footer
  if (specialLayoutPages.includes(pathname)) {
       return (
        <>
          <Header />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
          <ChatBotWrapper />
          <Toaster />
        </>
      );
  }

  // 3. Pages that should NOT have a header or footer
  if (noHeaderFooterPages.some(path => pathname.startsWith(path)) || isIdlFoundationPage) {
    return (
        <>
            <main className="flex-grow">
                {children}
            </main>
            <Toaster />
        </>
    );
  }
  
  // 4. Default: all other pages get header and footer
  return (
    <>
      <Header />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
      <ChatBotWrapper />
      <Toaster />
    </>
  );
}
