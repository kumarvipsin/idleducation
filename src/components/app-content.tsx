
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
  
  const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/signup');
  const isAdminPage = pathname.startsWith('/admin');
  const isStudentPage = pathname.startsWith('/student');
  const isTeacherPage = pathname.startsWith('/teacher');
  const isScholarshipPage = pathname.startsWith('/scholarship');
  const isBookDemoPage = pathname.startsWith('/book-demo');
  const isAdmissionPage = pathname.startsWith('/admission');
  const isFeedbackPage = pathname.startsWith('/feedback');

  // If it's a dashboard-like page, just render the children.
  // The layout for these pages will handle their own header/sidebar/footer.
  if (isAdminPage || isStudentPage || isTeacherPage) {
    return (
        <>
            {children}
            <Toaster />
        </>
    );
  }
  
  // For special public pages that shouldn't have a header or footer
  if (isAuthPage || isScholarshipPage || isBookDemoPage || isAdmissionPage || isFeedbackPage) {
    return (
        <>
            <main className="flex-grow">
                {children}
            </main>
            <Toaster />
        </>
    );
  }

  const showFooter = !pathname.startsWith('/admin') && !(pathname.startsWith('/about') || pathname.startsWith('/contact') || pathname.startsWith('/gallery'));

  return (
    <>
      <Header />
      <main className="flex-grow">
        {children}
      </main>
      {showFooter && <Footer />}
      <ChatBotWrapper />
      <Toaster />
    </>
  );
}
