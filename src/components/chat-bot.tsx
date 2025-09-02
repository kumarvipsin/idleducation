'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Phone } from 'lucide-react';

export function ChatBot() {
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="relative">
        <Button
          asChild
          size="icon"
          className="relative rounded-full w-12 h-12 shadow-lg bg-gradient-to-br from-red-600 to-black hover:from-red-700 hover:to-black text-white transition-transform hover:scale-110"
        >
          <Link href="tel:+918860040010">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <Phone className="h-6 w-6 relative" />
            <span className="sr-only">Call Us</span>
          </Link>
        </Button>
      </div>
    </div>
  );
}
