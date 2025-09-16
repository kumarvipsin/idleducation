
'use client';

import { Button } from '@/components/ui/button';

const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
    </svg>
);


export function ChatBot() {
  return (
    <Button
      asChild
      className="fixed bottom-4 right-4 rounded-full h-14 w-14 shadow-lg bg-green-500 hover:bg-green-600"
      aria-label="Chat on WhatsApp"
    >
      <a href="https://wa.me/918860040010" target="_blank" rel="noopener noreferrer">
        <WhatsAppIcon className="h-7 w-7 text-white" />
      </a>
    </Button>
  );
}
