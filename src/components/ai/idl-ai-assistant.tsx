'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { ChatPanel } from './chat-panel';
import { cn } from '@/lib/utils';

export function IdlAiAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [isActivating, setIsActivating] = useState(false);
  const pathname = usePathname();
  const currentPath = pathname || (typeof window !== 'undefined' ? window.location.pathname : '/');
  const isLandingPage = !currentPath || currentPath === '/' || currentPath === '';
  const isFreeCoursesPage = currentPath.startsWith('/free-courses');
  const isPrimaryCorner = isLandingPage || isFreeCoursesPage;

  useEffect(() => {
    if (typeof document !== 'undefined') {
      if (isLandingPage) {
        document.body.classList.add('is-landing-page');
      } else {
        document.body.classList.remove('is-landing-page');
      }
      if (isFreeCoursesPage) {
        document.body.classList.add('is-free-courses-page');
      } else {
        document.body.classList.remove('is-free-courses-page');
      }
    }
    return () => {
      if (typeof document !== 'undefined') {
        document.body.classList.remove('is-landing-page');
        document.body.classList.remove('is-free-courses-page');
      }
    };
  }, [isLandingPage, isFreeCoursesPage]);

  const handleToggle = () => {
    if (!isOpen) {
      setIsActivating(true);
      setTimeout(() => setIsActivating(false), 450);
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Floating Circular Trigger (Matches WhatsApp Floating Action Family) */}
      <button
              id="idl-ai-floating-btn"
              type="button"
              onClick={handleToggle}
              aria-label={isOpen ? 'Close IDL AI' : 'Ask IDL AI'}
              aria-expanded={isOpen}
              className={cn(
                // Position: On landing page and free courses (where WhatsApp is removed), sit at primary corner (bottom: 20-24px, right: 16-24px).
                // On pages with WhatsApp, float right above WhatsApp (sm:bottom-[98px]).
                isPrimaryCorner
                  ? 'fixed bottom-[calc(1.25rem+env(safe-area-inset-bottom))] right-[calc(1rem+env(safe-area-inset-right))] sm:bottom-6 sm:right-6 z-50'
                  : 'fixed bottom-[calc(88px+env(safe-area-inset-bottom))] right-[calc(1.25rem+env(safe-area-inset-right))] sm:bottom-[98px] sm:right-6 z-50',
                // Dimensions: perfectly circular, matching WhatsApp size family (54px mobile / 58px desktop)
                'w-[54px] h-[54px] sm:w-[58px] sm:h-[58px] rounded-full',
                'bg-[#1D4ED8] hover:bg-[#1A44BD]',
                'text-white flex items-center justify-center',
                // Elevation & Glow: matches WhatsApp shadow profile in IDL Blue
                'shadow-[0_4px_16px_rgba(29,78,216,0.32),0_2px_6px_rgba(0,0,0,0.08)]',
                'hover:shadow-[0_6px_20px_rgba(29,78,216,0.42),0_3px_8px_rgba(0,0,0,0.12)]',
                'border border-white/20',
                'hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.97]',
                'transition-all duration-200 ease-out cursor-pointer',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1D4ED8] focus-visible:ring-offset-2',
                isOpen && 'bg-[#1A44BD]',
                isActivating && 'animate-ai-trigger-glow'
              )}
            >
              {/* Subtle 4-point AI sparkle upon activation */}
              {isActivating && (
                <span className="absolute -top-1.5 -left-1.5 pointer-events-none animate-ai-sparkle text-blue-200 z-10" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 drop-shadow-[0_0_8px_rgba(59,130,246,0.9)]">
                    <path d="M12 0L14.2 9.8L24 12L14.2 14.2L12 24L9.8 14.2L0 12L9.8 9.8L12 0Z" />
                  </svg>
                </span>
              )}
              {isOpen ? (
                // Clean close icon when open
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-[20px] h-[20px] sm:w-[22px] sm:h-[22px] text-white shrink-0"
                  aria-hidden="true"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              ) : (
                // Premium Illustrated AI Bot Icon
                <svg
                  viewBox="0 0 28 28"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-[27px] h-[27px] sm:w-[29px] sm:h-[29px] shrink-0 transition-transform duration-200 hover:scale-105"
                  aria-hidden="true"
                >
                  {/* Top Antenna Node & Pulse */}
                  <circle cx="14" cy="3" r="1.6" fill="white" />
                  <path d="M14 4.6V6.8" stroke="white" strokeWidth="1.8" strokeLinecap="round" />

                  {/* Ear Audio Modules / Side Sensors */}
                  <rect x="2.5" y="9.8" width="2.2" height="6.4" rx="1.1" fill="white" opacity="0.9" />
                  <rect x="23.3" y="9.8" width="2.2" height="6.4" rx="1.1" fill="white" opacity="0.9" />

                  {/* Main Bot Head Helmet */}
                  <rect
                    x="4.2"
                    y="6.8"
                    width="19.6"
                    height="14.4"
                    rx="5.8"
                    fill="white"
                  />

                  {/* Deep Visor Screen */}
                  <rect
                    x="6.8"
                    y="9.4"
                    width="14.4"
                    height="8.8"
                    rx="3.4"
                    fill="#0B2568"
                  />

                  {/* Expressive Smart AI Eyes */}
                  <rect x="9.4" y="11.4" width="2.8" height="4.6" rx="1.4" fill="white" />
                  <rect x="15.8" y="11.4" width="2.8" height="4.6" rx="1.4" fill="white" />

                  {/* Bottom Collar / Sleek Neck Base */}
                  <path
                    d="M9 24.2C9 22.4 19 22.4 19 24.2"
                    stroke="white"
                    strokeWidth="1.9"
                    strokeLinecap="round"
                  />
                </svg>
              )}
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
