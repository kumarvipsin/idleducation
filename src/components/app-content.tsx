
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
  
  const isScholarshipPage = pathname.startsWith('/scholarship');
  const isBookDemoPage = pathname.startsWith('/book-demo');

  if (isScholarshipPage || isBookDemoPage) {
    return (
        <>
            <main className="flex-grow">
                {children}
            </main>
            <Toaster />
        </>
    )
  }

  const showFooter = !(pathname.startsWith('/about') || pathname.startsWith('/contact') || pathname.startsWith('/gallery'));
  
  // Don't show chatbot on admin pages
  const showChatBot = !pathname.startsWith('/admin');


  return (
    <>
      <Header />
      <main className="flex-grow">
        {children}
      </main>
      {showFooter && <Footer />}
      {showChatBot && <ChatBotWrapper />}
      <Toaster />
    </>
  );
}
