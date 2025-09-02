
'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Phone } from 'lucide-react';

export function ChatBot() {
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Button
        asChild
        size="icon"
        className="rounded-full w-16 h-16 shadow-lg bg-primary hover:bg-primary/90 text-primary-foreground transition-transform hover:scale-110"
      >
        <Link href="tel:+918860040010">
          <Phone className="h-8 w-8" />
          <span className="sr-only">Call Us</span>
        </Link>
      </Button>
    </div>
  );
}
