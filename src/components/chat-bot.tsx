'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Phone } from 'lucide-react';

export function ChatBot() {
  useEffect(() => {
    const handleVibration = () => {
      // Check if the Vibration API is supported
      if ('vibrate' in navigator) {
        // Vibrate 3 times: 100ms vibration, 50ms pause, repeat.
        navigator.vibrate([100, 50, 100, 50, 100]);
      }
    };

    // Set an interval to trigger the vibration every 10 seconds
    const intervalId = setInterval(handleVibration, 10000);

    // Clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="relative">
        <Button
          asChild
          size="icon"
          className="relative rounded-full w-12 h-12 shadow-lg bg-gradient-to-br from-gray-800 to-black hover:from-gray-700 hover:to-gray-900 text-white transition-transform hover:scale-110"
        >
          <Link href="tel:+918860040010">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gray-600 opacity-75"></span>
            <Phone className="h-6 w-6 relative" />
            <span className="sr-only">Call Us</span>
          </Link>
        </Button>
      </div>
    </div>
  );
}
