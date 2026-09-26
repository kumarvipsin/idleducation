'use client';

import React from 'react';
import Image from 'next/image';

/* ══════════════════════════════════════════════════════════════════
   WHY IDL EDUCATION — Clean, Premium & Modern Section
   Exact implementation of reference design:
   - Eyebrow pill: "WHY IDL EDUCATION?"
   - Heading: "Learn Better. Grow Stronger." with curved blue underline
   - 4 Pillars: Focused Learning, Expert Teachers, Proven Progress, Future Ready
   - Floating circular halo icons with number badges (01, 02, 03, 04)
   - Connecting curved dotted line on desktop
   - White translucent card containers with subtle blue borders & short accent line
   - Clean 2x2 grid on mobile
   - Subtle bottom navy curve transitioning to trust stats
   ══════════════════════════════════════════════════════════════════ */

interface PillarItem {
  id: string;
  badge: string;
  iconSrc: string;
  title: string;
  descLine1: string;
  descLine2: string;
}

const pillars: PillarItem[] = [
  {
    id: '01',
    badge: '01',
    iconSrc: '/01.png',
    title: 'Focused Learning',
    descLine1: 'Clear concepts,',
    descLine2: 'focused guidance.',
  },
  {
    id: '02',
    badge: '02',
    iconSrc: '/02.png',
    title: 'Expert Teachers',
    descLine1: 'Learn from',
    descLine2: 'experienced educators.',
  },
  {
    id: '03',
    badge: '03',
    iconSrc: '/03.png',
    title: 'Proven Progress',
    descLine1: 'Regular practice,',
    descLine2: 'measurable growth.',
  },
  {
    id: '04',
    badge: '04',
    iconSrc: '/04.png',
    title: 'Future Ready',
    descLine1: 'Build skills for',
    descLine2: 'the next step.',
  },
];

export function ScholarshipSection() {
  return (
    <section
      id="why-idl-education"
      aria-label="Why IDL Education"
      className="relative w-full pt-10 sm:pt-14 md:pt-16 pb-12 sm:pb-16 md:pb-20 bg-gradient-to-b from-[#FAFDFE] via-[#F4F8FE] to-[#EAF2FC] dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 overflow-hidden"
      style={{ fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif" }}
    >
      {/* Subtle ambient light glow in background */}
      <div 
        className="pointer-events-none absolute top-8 left-1/2 -translate-x-1/2 w-[600px] sm:w-[900px] h-[340px] bg-blue-400/[0.04] dark:bg-blue-500/[0.02] rounded-full blur-3xl select-none"
        aria-hidden="true" 
      />

      <div className="container relative z-10 mx-auto px-4 sm:px-6 max-w-6xl">
        
        {/* ══════════════════════════════════════════════════
            1. HEADER AREA
            ══════════════════════════════════════════════════ */}
        <div className="flex flex-col items-center justify-center text-center mb-9 sm:mb-12 md:mb-14">
          
          {/* Eyebrow Pill */}
          <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-[#EBF3FF] dark:bg-blue-950/70 border border-[#D0E2FC] dark:border-blue-900/60 shadow-[0_1px_4px_rgba(6,43,103,0.04)] mb-3 sm:mb-3.5">
            <span className="text-[11px] sm:text-[12px] font-bold tracking-[0.18em] uppercase text-[#062B67] dark:text-blue-300">
              WHY IDL EDUCATION?
            </span>
          </div>

          {/* Main Heading */}
          <h2 className="text-[26px] xs:text-[28px] sm:text-[34px] md:text-[40px] font-extrabold tracking-[-0.025em] text-[#062B67] dark:text-white leading-[1.18] max-w-2xl">
            <span className="block sm:inline">Learn Better.{' '}</span>
            <span className="relative inline-block text-[#155EEF] dark:text-blue-400">
              Grow Stronger.
              {/* Subtle curved blue underline stroke matching reference */}
              <svg 
                className="absolute -bottom-2 left-0 right-0 w-full h-[7px] text-[#155EEF] dark:text-blue-400 overflow-visible pointer-events-none" 
                viewBox="0 0 100 12" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path 
                  d="M3 6C28 11 72 11 97 4" 
                  stroke="currentColor" 
                  strokeWidth="3.4" 
                  strokeLinecap="round" 
                />
              </svg>
            </span>
          </h2>

        </div>

        {/* ══════════════════════════════════════════════════
            2. BENEFIT CARDS (Desktop: 4 in row with connecting dotted line, Mobile: 2x2 grid)
            ══════════════════════════════════════════════════ */}
        <div className="relative w-full max-w-[390px] xs:max-w-[430px] sm:max-w-3xl lg:max-w-5xl mx-auto">
          
          {/* Subtle dotted curved connecting line (Desktop only) */}
          <div className="hidden lg:block absolute top-[44px] left-[11%] right-[11%] h-[20px] pointer-events-none z-0">
            <svg 
              className="w-full h-full text-[#B9D3F8] dark:text-blue-900/60 overflow-visible" 
              viewBox="0 0 760 20" 
              fill="none" 
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              {/* Connect 01 to 02 */}
              <path 
                d="M 50 10 Q 140 2 230 10" 
                stroke="currentColor" 
                strokeWidth="1.8" 
                strokeDasharray="4 5" 
                strokeLinecap="round" 
              />
              {/* Connect 02 to 03 */}
              <path 
                d="M 310 10 Q 400 18 490 10" 
                stroke="currentColor" 
                strokeWidth="1.8" 
                strokeDasharray="4 5" 
                strokeLinecap="round" 
              />
              {/* Connect 03 to 04 */}
              <path 
                d="M 570 10 Q 660 2 750 10" 
                stroke="currentColor" 
                strokeWidth="1.8" 
                strokeDasharray="4 5" 
                strokeLinecap="round" 
              />
            </svg>
          </div>

          {/* Cards Grid: 2x2 on mobile/tablet, 4x1 on desktop */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5 lg:gap-6 relative z-10 items-stretch">
            {pillars.map((item) => (
              <div 
                key={item.id} 
                className="group flex flex-col items-center h-full select-none"
              >
                
                {/* ── Floating Icon Halo ── */}
                <div className="relative z-20 transition-transform duration-300 group-hover:scale-105">
                  <div className="w-[74px] h-[74px] sm:w-[82px] sm:h-[82px] lg:w-[88px] lg:h-[88px] rounded-full bg-gradient-to-b from-[#F2F7FF] via-[#E8F2FD] to-[#DFEEFC] dark:from-slate-800 dark:to-slate-900 border border-white/90 dark:border-slate-700/80 shadow-[0_6px_20px_-2px_rgba(6,43,103,0.08)] flex items-center justify-center p-2.5 relative">
                    <div className="relative w-full h-full flex items-center justify-center">
                      <Image
                        src={item.iconSrc}
                        alt={item.title}
                        width={60}
                        height={60}
                        className="object-contain w-auto h-auto max-w-[85%] max-h-[85%] select-none pointer-events-none drop-shadow-xs"
                        priority
                      />
                    </div>

                    {/* Small Circular Number Badge */}
                    <div className="absolute -top-1 -right-1 sm:top-0 sm:-right-0.5 w-[21px] h-[21px] sm:w-[23px] sm:h-[23px] rounded-full bg-[#EBF3FF] dark:bg-slate-800 border border-[#CBDFFC] dark:border-slate-700 text-[#062B67] dark:text-blue-300 text-[10px] sm:text-[10.5px] font-bold flex items-center justify-center shadow-2xs">
                      {item.badge}
                    </div>
                  </div>
                </div>

                {/* ── Compact White Card Body ── */}
                <div className="-mt-8 sm:-mt-9 w-full flex-1 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm rounded-[18px] sm:rounded-[22px] border border-[#E0EDFA] dark:border-slate-800 shadow-[0_4px_22px_-4px_rgba(6,43,103,0.05)] hover:shadow-[0_10px_28px_-6px_rgba(6,43,103,0.10)] transition-all duration-300 pt-10 sm:pt-11 pb-4 sm:pb-5 px-3 sm:px-4 flex flex-col items-center justify-center text-center">
                  
                  {/* Card Title */}
                  <h3 className="text-[14px] sm:text-[15.5px] lg:text-[16px] font-bold text-[#062B67] dark:text-white tracking-tight leading-tight">
                    {item.title}
                  </h3>

                  {/* Short Thin Blue Accent Line */}
                  <div className="w-5 sm:w-6 h-[1.5px] bg-[#155EEF] dark:bg-blue-500 rounded-full my-2 sm:my-2.5" />

                  {/* Card Description */}
                  <p className="text-[11.5px] sm:text-[12px] lg:text-[12.5px] text-[#64748B] dark:text-slate-400 font-normal leading-[1.4] text-center">
                    <span className="block">{item.descLine1}</span>
                    <span className="block">{item.descLine2}</span>
                  </p>

                </div>

              </div>
            ))}
          </div>

        </div>

      </div>

      {/* ══════════════════════════════════════════════════
          3. BOTTOM SECTION SHAPE (Subtle organic navy wave transitioning to Trust Stats)
          ══════════════════════════════════════════════════ */}
      <div className="absolute bottom-0 inset-x-0 overflow-hidden pointer-events-none z-10 leading-none">
        <svg 
          className="w-full h-6 sm:h-9 md:h-12 text-[#061C43] dark:text-slate-950 block" 
          viewBox="0 0 1440 60" 
          fill="currentColor" 
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path d="M0,35 C280,62 520,58 720,58 C920,58 1160,62 1440,35 L1440,60 L0,60 Z" />
        </svg>
      </div>

    </section>
  );
}
