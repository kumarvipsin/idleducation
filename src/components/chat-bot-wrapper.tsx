
'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ChatBot } from "./chat-bot";

export function ChatBotWrapper() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // During SSR or before client mount, avoid rendering to prevent hydration mismatches and ensure no leak on landing page
  if (!mounted) {
    return null;
  }

  const currentPath = pathname || (typeof window !== 'undefined' ? window.location.pathname : '');
  const isNoWhatsAppPage = !currentPath || currentPath === '/' || currentPath === '' || currentPath.startsWith('/free-courses');

  // Hide WhatsApp floating icon on landing page ('/') and Free Courses ('/free-courses')
  if (isNoWhatsAppPage) {
    return null;
  }

  return <ChatBot />;
}

