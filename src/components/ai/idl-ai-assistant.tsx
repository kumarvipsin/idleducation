'use client';

import { useState } from 'react';
import { ChatPanel } from './chat-panel';
import { cn } from '@/lib/utils';

export function IdlAiAssistant() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Trigger */}
      <button
        onClick={() => setIsOpen(o => !o)}
        aria-label={isOpen ? 'Close IDL AI' : 'Ask IDL AI'}
        aria-expanded={isOpen}
        className={cn(
          // Position: above WhatsApp button
          'fixed bottom-[84px] right-4 sm:bottom-[92px] sm:right-6 z-[55]',
          'flex items-center gap-2 pl-3 pr-4 h-10 sm:h-10',
          'rounded-[9px]',
          'bg-[#1D4ED8]',
          'text-white text-[12.5px] font-semibold tracking-tight',
          'shadow-[0_2px_12px_rgba(29,78,216,0.35),0_1px_3px_rgba(0,0,0,0.08)]',
          'hover:bg-[#1B45C0]',
          'hover:shadow-[0_4px_16px_rgba(29,78,216,0.45)]',
          'active:scale-[0.97]',
          'transition-all duration-150 ease-out',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2',
          isOpen && 'bg-[#1B45C0]'
        )}
      >
        {/* IDL AI mark — same as panel */}
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="shrink-0 opacity-90">
          <path d="M8 2L9.5 5.5L13 5.5L10.5 7.5L11.5 11L8 9L4.5 11L5.5 7.5L3 5.5L6.5 5.5L8 2Z" fill="white"/>
        </svg>
        <span>Ask IDL AI</span>
      </button>

      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[54] bg-black/25 backdrop-blur-[2px] sm:hidden"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Chat Panel */}
      <ChatPanel isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
