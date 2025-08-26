
'use client';

import { usePathname } from 'next/navigation';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Toaster } from "@/components/ui/toaster"
import { ChatBot } from '@/components/chat-bot';

export function AppContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const showFooter = !pathname.startsWith('/login');

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
