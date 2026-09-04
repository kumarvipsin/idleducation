
'use client';

import { Button } from '@/components/ui/button';

export function ChatBot() {
  return (
    <Button
      id="whatsapp-floating-btn"
      asChild
      className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 rounded-full h-12 w-12 sm:h-14 sm:w-14 shadow-lg bg-green-500 hover:bg-green-600 p-2.5 sm:p-3 z-40 transition-transform active:scale-95"
      aria-label="Chat on WhatsApp"
    >
      <a href="https://wa.me/918860040010" target="_blank" rel="noopener noreferrer">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/2062095_application_chat_communication_logo_whatsapp_icon.svg/105px-2062095_application_chat_communication_logo_whatsapp_icon.svg.png?20220531073934"
          alt="WhatsApp icon"
          className="w-full h-full object-contain"
        />
      </a>
    </Button>
  );
}
