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
  description: string;
}

const pillars: PillarItem[] = [
  {
    id: '01',
    badge: '01',
    iconSrc: '/01.png',
    title: 'Focused Learning',
    description: 'Learn with clarity.',
  },
  {
    id: '02',
    badge: '02',
    iconSrc: '/02.png',
    title: 'Expert Teachers',
    description: 'Learn from experts.',
  },
  {
    id: '03',
    badge: '03',
    iconSrc: '/03.png',
    title: 'Proven Progress',
    description: 'Progress you can measure.',
  },
  {
    id: '04',
    badge: '04',
    iconSrc: '/04.png',
    title: 'Future Ready',
    description: 'Ready for what’s next.',
  },
];

export function ScholarshipSection() {
  return (
    <section
      id="why-idl-education"
      aria-label="Why Choose IDL"
      className="relative w-full pt-8 sm:pt-10 md:pt-12 pb-12 sm:pb-16 md:pb-20 bg-gradient-to-b from-[#FAFBFD] via-[#F4F8FD] to-[#EEF5FD] dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 overflow-hidden"
      style={{ fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif" }}
    >
      {/* Subtle ambient light glow in background */}
      <div 
        className="pointer-events-none absolute top-8 left-1/2 -translate-x-1/2 w-[600px] sm:w-[900px] h-[340px] bg-blue-400/[0.03] dark:bg-blue-500/[0.02] rounded-full blur-3xl select-none"
        aria-hidden="true" 
      />

      <div className="container relative z-10 mx-auto px-4 sm:px-6 max-w-6xl">
        
        {/* ══════════════════════════════════════════════════
            1. HEADER AREA
            ══════════════════════════════════════════════════ */}
        <div className="flex flex-col items-center justify-center text-center mb-8 sm:mb-11 md:mb-12">
          {/* Eyebrow — clean text with bullet point */}
          <div className="inline-flex items-center justify-center gap-2.5 sm:gap-3 mb-3 sm:mb-3.5">
            <span className="w-[9px] h-[9px] sm:w-[10px] sm:h-[10px] rounded-full bg-[#155EEF] dark:bg-blue-400 shrink-0" />
            <span className="text-[15px] sm:text-[17px] font-[900] tracking-tight">
              <span className="text-[#062B67] dark:text-blue-200">Why think </span>
              <span className="text-[#155EEF] dark:text-blue-400">IDL ?</span>
            </span>
          </div>

          {/* Main Heading — exact style, size, and curved underline from screenshot, single line on all screens */}
          <h2 className="text-[15px] min-[360px]:text-[16.5px] min-[400px]:text-[18px] sm:text-[28px] md:text-[36px] font-[750] tracking-[-0.02em] leading-[1.2] max-w-4xl mx-auto whitespace-nowrap">
            <span className="text-[#062B67] dark:text-white">Learn Better.{' '}</span>
            <span className="relative inline-block text-[#155EEF] dark:text-blue-400">
              Grow Stronger.
              {/* Subtle curved blue underline stroke matching reference screenshot */}
              <svg 
                className="absolute -bottom-1 sm:-bottom-1.5 md:-bottom-2 left-0 right-0 w-full h-[5px] sm:h-[7px] md:h-[8px] text-[#155EEF] dark:text-blue-400 overflow-visible pointer-events-none" 
                viewBox="0 0 100 12" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path 
                  d="M3 6C28 11 72 11 97 4" 
                  stroke="currentColor" 
                  strokeWidth="3.2" 
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
          
          {/* Subtle dotted curved connecting line (Desktop only) — thin and non-distracting */}
          <div className="hidden lg:block absolute top-[43px] left-[11%] right-[11%] h-[20px] pointer-events-none z-0 opacity-70">
            <svg 
              className="w-full h-full text-[#B0CDF5] dark:text-blue-900/50 overflow-visible" 
              viewBox="0 0 760 20" 
              fill="none" 
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              {/* Connect 01 to 02 */}
              <path 
                d="M 50 10 Q 140 3 230 10" 
                stroke="currentColor" 
                strokeWidth="1.2" 
                strokeDasharray="3 4" 
                strokeLinecap="round" 
              />
              {/* Connect 02 to 03 */}
              <path 
                d="M 310 10 Q 400 17 490 10" 
                stroke="currentColor" 
                strokeWidth="1.2" 
                strokeDasharray="3 4" 
                strokeLinecap="round" 
              />
              {/* Connect 03 to 04 */}
              <path 
                d="M 570 10 Q 660 3 750 10" 
                stroke="currentColor" 
                strokeWidth="1.2" 
                strokeDasharray="3 4" 
                strokeLinecap="round" 
              />
            </svg>
          </div>

          {/* Cards Grid: 2x2 on mobile/tablet, 4x1 on desktop */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-3.5 gap-y-5 sm:gap-5 lg:gap-6 relative z-10 items-stretch">
            {pillars.map((item) => (
              <div 
                key={item.id} 
                className="group flex flex-col items-center h-full select-none"
              >
                
                {/* ── Floating Icon Halo ── */}
                <div className="relative z-20 transition-transform duration-300 group-hover:scale-105">
                  <div className="w-[72px] h-[72px] sm:w-[80px] sm:h-[80px] lg:w-[86px] lg:h-[86px] rounded-full bg-[#EDF4FD] dark:bg-slate-800 border border-white dark:border-slate-700/80 shadow-[0_3px_12px_rgba(6,43,103,0.05)] flex items-center justify-center p-2.5 relative">
                    <Image
                      src={item.iconSrc}
                      alt={item.title}
                      width={64}
                      height={64}
                      unoptimized
                      className="w-[46px] h-[46px] sm:w-[52px] sm:h-[52px] lg:w-[56px] lg:h-[56px] object-contain select-none pointer-events-none drop-shadow-xs"
                      priority
                    />

                    {/* Small Circular Number Badge */}
                    <div className="absolute -top-0.5 -right-0.5 sm:top-0 sm:-right-0.5 w-[21px] h-[21px] sm:w-[23px] sm:h-[23px] rounded-full bg-[#EBF3FF] dark:bg-slate-800 border border-[#CBDFFC] dark:border-slate-700 text-[#062B67] dark:text-blue-300 text-[10px] sm:text-[10.5px] font-bold flex items-center justify-center shadow-2xs">
                      {item.badge}
                    </div>
                  </div>
                </div>

                {/* ── Compact White Card Body ── */}
                <div className="-mt-8 sm:-mt-9 w-full flex-1 bg-white dark:bg-slate-900 rounded-[18px] sm:rounded-[22px] border border-[#E2EEF8] dark:border-slate-800/80 shadow-[0_2px_12px_-3px_rgba(6,43,103,0.04),0_1px_2px_rgba(6,43,103,0.02)] hover:shadow-[0_8px_22px_-5px_rgba(6,43,103,0.08)] transition-all duration-300 pt-9 sm:pt-10 pb-4 sm:pb-5 px-2.5 sm:px-3.5 lg:px-4 flex flex-col items-center justify-center text-center">
                  
                  {/* Card Title */}
                  <h3 className="text-[13.5px] min-[360px]:text-[14px] sm:text-[16px] lg:text-[18px] xl:text-[19px] font-bold text-[#062B67] dark:text-white tracking-tight leading-tight whitespace-nowrap">
                    {item.title}
                  </h3>

                  {/* Subtle Underline Accent */}
                  <div className="w-5 sm:w-6 h-[1.5px] bg-[#155EEF] dark:bg-blue-500 rounded-full my-1.5 sm:my-2" />

                  {/* Card Description */}
                  <p className="text-[12.5px] min-[360px]:text-[13px] sm:text-[14px] lg:text-[14.5px] text-[#344054] dark:text-slate-200 font-semibold leading-[1.4] text-center max-w-[185px] sm:max-w-[210px] mx-auto">
                    {item.description}
                  </p>

                </div>

              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
