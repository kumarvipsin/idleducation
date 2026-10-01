'use client';

import React from 'react';

/* ══════════════════════════════════════════════════════════════════
   TRUST STATS SECTION — Exact Match to Reference Mockup
   
   • Desktop (>= sm): Full-length 100% left-to-right dark navy strip
     4 columns in 1 row with clean vertical dividers
     Number/Title -> Line with Center Dot (──●──) -> Label
   
   • Mobile (< sm): Compact 2x2 rounded dark navy card
     Cross dividers (1 vertical, 1 horizontal)
     Centered on page, matching exact right-hand mobile mockup
   ══════════════════════════════════════════════════════════════════ */

interface StatItem {
  value: string;
  label: string;
  mobileLine1?: string;
  mobileLine2?: string;
}

const stats: StatItem[] = [
  {
    value: '2021',
    label: 'Our Journey Began',
  },
  {
    value: '5+',
    label: 'Branches in Delhi',
  },
  {
    value: '10,000+',
    label: 'Students Guided',
  },
  {
    value: 'Academic Growth',
    label: 'Every Step Forward',
    mobileLine1: 'Academic',
    mobileLine2: 'Growth',
  },
];

export function TrustStatsSection() {
  return (
    <section 
      id="trust-stats"
      aria-label="IDL Education Milestones"
      className="w-full bg-white dark:bg-slate-950 sm:bg-[#041A4D] sm:dark:bg-[#020B1E] border-t-0 sm:border-y sm:border-white/[0.08] relative z-20"
      style={{ fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif" }}
    >
      {/* ══════════════════════════════════════════════════
          1. DESKTOP VIEW (>= sm): 100% Full-Length Left to Right Strip
          Slim, compact height with 100% preserved text size
          ══════════════════════════════════════════════════ */}
      <div className="hidden sm:block w-full py-3.5 sm:py-4 lg:py-4.5 px-4 sm:px-6 md:px-10 lg:px-16 xl:px-20">
        <div className="grid grid-cols-4 divide-x divide-white/[0.12] items-center w-full">
          {stats.map((item, idx) => (
            <div 
              key={idx} 
              className="flex flex-col items-center justify-center text-center px-2 sm:px-3 md:px-4 lg:px-6"
            >
              {/* Stat Value — Preserved Size */}
              <div className="text-[22px] md:text-[25px] lg:text-[28px] xl:text-[30px] font-[800] text-white tracking-tight leading-none">
                {item.value}
              </div>

              {/* Accent Line with Center Dot (──●──) */}
              <div className="flex items-center justify-center my-1.5 sm:my-1.5">
                <svg 
                  width="44" 
                  height="6" 
                  viewBox="0 0 44 6" 
                  fill="none" 
                  className="overflow-visible"
                  aria-hidden="true"
                >
                  <line 
                    x1="0" 
                    y1="3" 
                    x2="44" 
                    y2="3" 
                    stroke="#1D64EC" 
                    strokeWidth="1.5" 
                    strokeLinecap="round" 
                  />
                  <circle 
                    cx="22" 
                    cy="3" 
                    r="2.5" 
                    fill="#38BDF8" 
                    stroke="#041A4D" 
                    strokeWidth="1" 
                  />
                </svg>
              </div>

              {/* Stat Label — Preserved Size */}
              <div className="text-[12px] md:text-[13px] lg:text-[14px] font-medium text-[#BAC7D5] leading-tight tracking-normal">
                {item.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════
          2. MOBILE VIEW (< sm): 2x2 Rounded Dark Navy Card
          Premium compact information block with subtle dividers
          ══════════════════════════════════════════════════ */}
      <div className="block sm:hidden w-full px-3.5 min-[390px]:px-4 pt-1 pb-5 min-[390px]:pb-6">
        <div className="w-full max-w-[480px] mx-auto bg-[#041A4D] dark:bg-[#020B1E] rounded-[16px] border border-white/[0.10] shadow-[0_4px_16px_rgba(4,26,77,0.18)] overflow-hidden">
          
          {/* Top Row: 2021 & 5+ */}
          <div className="grid grid-cols-2 divide-x divide-white/[0.08]">
            {/* Cell 1: 2021 */}
            <div className="flex flex-col items-center justify-center text-center py-2.5 min-[390px]:py-3 px-2">
              <span className="text-[18px] min-[360px]:text-[19px] min-[390px]:text-[20px] font-[800] text-white tracking-tight leading-none">
                {stats[0].value}
              </span>
              <div className="flex items-center justify-center my-1 min-[390px]:my-1.5">
                <svg width="28" height="4" viewBox="0 0 28 4" fill="none" aria-hidden="true">
                  <line x1="0" y1="2" x2="28" y2="2" stroke="#1D64EC" strokeWidth="1.2" strokeLinecap="round" opacity="0.85" />
                  <circle cx="14" cy="2" r="1.5" fill="#38BDF8" />
                </svg>
              </div>
              <span className="text-[10px] min-[360px]:text-[10.5px] font-medium text-[#BAC7D5] leading-tight">
                {stats[0].label}
              </span>
            </div>

            {/* Cell 2: 5+ */}
            <div className="flex flex-col items-center justify-center text-center py-2.5 min-[390px]:py-3 px-2">
              <span className="text-[18px] min-[360px]:text-[19px] min-[390px]:text-[20px] font-[800] text-white tracking-tight leading-none">
                {stats[1].value}
              </span>
              <div className="flex items-center justify-center my-1 min-[390px]:my-1.5">
                <svg width="28" height="4" viewBox="0 0 28 4" fill="none" aria-hidden="true">
                  <line x1="0" y1="2" x2="28" y2="2" stroke="#1D64EC" strokeWidth="1.2" strokeLinecap="round" opacity="0.85" />
                  <circle cx="14" cy="2" r="1.5" fill="#38BDF8" />
                </svg>
              </div>
              <span className="text-[10px] min-[360px]:text-[10.5px] font-medium text-[#BAC7D5] leading-tight">
                {stats[1].label}
              </span>
            </div>
          </div>

          {/* Horizontal cross divider between Row 1 and Row 2 */}
          <div className="w-full h-px bg-white/[0.08]" />

          {/* Bottom Row: 10,000+ & Academic Growth */}
          <div className="grid grid-cols-2 divide-x divide-white/[0.08]">
            {/* Cell 3: 10,000+ */}
            <div className="flex flex-col items-center justify-center text-center py-2.5 min-[390px]:py-3 px-2">
              <span className="text-[18px] min-[360px]:text-[19px] min-[390px]:text-[20px] font-[800] text-white tracking-tight leading-none">
                {stats[2].value}
              </span>
              <div className="flex items-center justify-center my-1 min-[390px]:my-1.5">
                <svg width="28" height="4" viewBox="0 0 28 4" fill="none" aria-hidden="true">
                  <line x1="0" y1="2" x2="28" y2="2" stroke="#1D64EC" strokeWidth="1.2" strokeLinecap="round" opacity="0.85" />
                  <circle cx="14" cy="2" r="1.5" fill="#38BDF8" />
                </svg>
              </div>
              <span className="text-[10px] min-[360px]:text-[10.5px] font-medium text-[#BAC7D5] leading-tight">
                {stats[2].label}
              </span>
            </div>

            {/* Cell 4: Academic Growth */}
            <div className="flex flex-col items-center justify-center text-center py-2.5 min-[390px]:py-3 px-2">
              <span className="text-[15px] min-[360px]:text-[16px] min-[390px]:text-[16.5px] font-[800] text-white tracking-tight leading-none whitespace-nowrap">
                {stats[3].value}
              </span>
              <div className="flex items-center justify-center my-1 min-[390px]:my-1.5">
                <svg width="28" height="4" viewBox="0 0 28 4" fill="none" aria-hidden="true">
                  <line x1="0" y1="2" x2="28" y2="2" stroke="#1D64EC" strokeWidth="1.2" strokeLinecap="round" opacity="0.85" />
                  <circle cx="14" cy="2" r="1.5" fill="#38BDF8" />
                </svg>
              </div>
              <span className="text-[10px] min-[360px]:text-[10.5px] font-medium text-[#BAC7D5] leading-tight">
                {stats[3].label}
              </span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
