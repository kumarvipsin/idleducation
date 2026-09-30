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
      className="w-full bg-[#041A4D] dark:bg-[#020B1E] border-y border-white/[0.08] relative z-20"
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
          Slim, ultra-compact height
          ══════════════════════════════════════════════════ */}
      <div className="block sm:hidden w-full px-3 py-1.5">
        <div className="w-full max-w-[420px] mx-auto bg-[#041A4D] rounded-[16px] border border-white/[0.12] shadow-lg overflow-hidden p-0.5">
          
          {/* Top Row: 2021 & 5+ */}
          <div className="grid grid-cols-2 divide-x divide-white/[0.12]">
            {/* Cell 1: 2021 */}
            <div className="flex flex-col items-center justify-center text-center py-1.5 px-2">
              <span className="text-[18.5px] min-[360px]:text-[19.5px] font-[800] text-white tracking-tight leading-none">
                {stats[0].value}
              </span>
              <div className="flex items-center justify-center my-0.5">
                <svg width="32" height="5" viewBox="0 0 34 6" fill="none" aria-hidden="true">
                  <line x1="0" y1="3" x2="34" y2="3" stroke="#1D64EC" strokeWidth="1.5" strokeLinecap="round" />
                  <circle cx="17" cy="3" r="2" fill="#38BDF8" stroke="#041A4D" strokeWidth="1" />
                </svg>
              </div>
              <span className="text-[10.5px] min-[360px]:text-[11px] font-medium text-[#BAC7D5] leading-tight">
                {stats[0].label}
              </span>
            </div>

            {/* Cell 2: 5+ */}
            <div className="flex flex-col items-center justify-center text-center py-1.5 px-2">
              <span className="text-[18.5px] min-[360px]:text-[19.5px] font-[800] text-white tracking-tight leading-none">
                {stats[1].value}
              </span>
              <div className="flex items-center justify-center my-0.5">
                <svg width="32" height="5" viewBox="0 0 34 6" fill="none" aria-hidden="true">
                  <line x1="0" y1="3" x2="34" y2="3" stroke="#1D64EC" strokeWidth="1.5" strokeLinecap="round" />
                  <circle cx="17" cy="3" r="2" fill="#38BDF8" stroke="#041A4D" strokeWidth="1" />
                </svg>
              </div>
              <span className="text-[10.5px] min-[360px]:text-[11px] font-medium text-[#BAC7D5] leading-tight">
                {stats[1].label}
              </span>
            </div>
          </div>

          {/* Horizontal cross divider between Row 1 and Row 2 */}
          <div className="w-full h-px bg-white/[0.12]" />

          {/* Bottom Row: 10,000+ & Academic Growth */}
          <div className="grid grid-cols-2 divide-x divide-white/[0.12]">
            {/* Cell 3: 10,000+ */}
            <div className="flex flex-col items-center justify-center text-center py-1.5 px-2">
              <span className="text-[18.5px] min-[360px]:text-[19.5px] font-[800] text-white tracking-tight leading-none">
                {stats[2].value}
              </span>
              <div className="flex items-center justify-center my-0.5">
                <svg width="32" height="5" viewBox="0 0 34 6" fill="none" aria-hidden="true">
                  <line x1="0" y1="3" x2="34" y2="3" stroke="#1D64EC" strokeWidth="1.5" strokeLinecap="round" />
                  <circle cx="17" cy="3" r="2" fill="#38BDF8" stroke="#041A4D" strokeWidth="1" />
                </svg>
              </div>
              <span className="text-[10.5px] min-[360px]:text-[11px] font-medium text-[#BAC7D5] leading-tight">
                {stats[2].label}
              </span>
            </div>

            {/* Cell 4: Academic Growth */}
            <div className="flex flex-col items-center justify-center text-center py-1.5 px-2">
              <span className="text-[18.5px] min-[360px]:text-[19.5px] font-[800] text-white tracking-tight leading-none whitespace-nowrap">
                {stats[3].value}
              </span>
              <div className="flex items-center justify-center my-0.5">
                <svg width="32" height="5" viewBox="0 0 34 6" fill="none" aria-hidden="true">
                  <line x1="0" y1="3" x2="34" y2="3" stroke="#1D64EC" strokeWidth="1.5" strokeLinecap="round" />
                  <circle cx="17" cy="3" r="2" fill="#38BDF8" stroke="#041A4D" strokeWidth="1" />
                </svg>
              </div>
              <span className="text-[10.5px] min-[360px]:text-[11px] font-medium text-[#BAC7D5] leading-tight">
                {stats[3].label}
              </span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
