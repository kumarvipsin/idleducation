'use client';

import React from 'react';
import Image from 'next/image';

/* ══════════════════════════════════════════════════════════════════
   WHY IDL EDUCATION — 4-Stage Academic Success Framework
   - Eyebrow: "Why think IDL ?"
   - Heading: "Learn Better. Grow Stronger." with curved blue underline
   - Connected chronological roadmap across 4 circular stage portals:
     01 Foundation → 02 Mentorship → 03 Evaluation → 04 Achievement
   - Illuminated connecting flow pipeline on desktop
   - Ultra-rounded capsule stage cards with milestone proof badges
   - Fully responsive: 4-stage flow on desktop, balanced 2x2 grid on mobile
   ══════════════════════════════════════════════════════════════════ */

interface PillarItem {
  id: string;
  badge: string;
  stageLabel: string;
  iconSrc: string;
  title: string;
  tagline: string;
  description: string;
}

const pillars: PillarItem[] = [
  {
    id: '01',
    badge: '01',
    stageLabel: 'STAGE 01 • FOUNDATION',
    iconSrc: '/01.png',
    title: 'Focused Learning',
    tagline: 'Learn with complete clarity',
    description: 'Structured daily syllabus modules and active doubt-solving built for conceptual mastery.',
  },
  {
    id: '02',
    badge: '02',
    stageLabel: 'STAGE 02 • MENTORSHIP',
    iconSrc: '/02.png',
    title: 'Expert Teachers',
    tagline: 'Learn from top mentors',
    description: 'Mentored directly by senior educators with 10+ years of proven board and exam success.',
  },
  {
    id: '03',
    badge: '03',
    stageLabel: 'STAGE 03 • EVALUATION',
    iconSrc: '/03.png',
    title: 'Proven Progress',
    tagline: 'Progress you can measure',
    description: 'Regular chapter assessments, simulated CBT mocks and continuous rank performance analytics.',
  },
  {
    id: '04',
    badge: '04',
    stageLabel: 'STAGE 04 • ACHIEVEMENT',
    iconSrc: '/04.png',
    title: 'Future Ready',
    tagline: 'Ready for what’s next',
    description: 'Comprehensive curriculum tailored for CBSE Board excellence and top university CUET admissions.',
  },
];

export function ScholarshipSection() {
  return (
    <section
      id="why-idl-education"
      aria-label="Why Choose IDL"
      className="relative w-full pt-10 sm:pt-13 md:pt-16 pb-14 sm:pb-18 md:pb-22 bg-gradient-to-b from-[#FAFBFD] via-[#F4F8FD] to-[#EEF5FD] dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 overflow-hidden"
      style={{ fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif" }}
    >
      {/* Subtle ambient light glow in background */}
      <div 
        className="pointer-events-none absolute top-8 left-1/2 -translate-x-1/2 w-[600px] sm:w-[900px] h-[340px] bg-blue-400/[0.03] dark:bg-blue-500/[0.02] rounded-full blur-3xl select-none"
        aria-hidden="true" 
      />

      <div className="container relative z-10 mx-auto px-4 sm:px-6 max-w-[1240px]">
        
        {/* ══════════════════════════════════════════════════
            1. HEADER AREA
            ══════════════════════════════════════════════════ */}
        <div className="flex flex-col items-center justify-center text-center mb-10 sm:mb-13 md:mb-16">
          {/* Eyebrow — clean text with bullet point */}
          <div className="inline-flex items-center justify-center gap-2.5 sm:gap-3 mb-2.5 sm:mb-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#155EEF] dark:bg-blue-400 shrink-0 shadow-[0_0_8px_rgba(21,94,239,0.35)]" />
            <span className="text-[14px] sm:text-[15.5px] font-[900] tracking-tight">
              <span className="text-[#062B67] dark:text-blue-200">Why think </span>
              <span className="text-[#155EEF] dark:text-blue-400">IDL ?</span>
            </span>
          </div>

          {/* Main Heading — exact style with curved blue underline stroke */}
          <h2 className="text-[16px] min-[360px]:text-[17.5px] min-[400px]:text-[19px] sm:text-[28px] md:text-[34px] font-[800] tracking-[-0.025em] leading-[1.2] max-w-4xl mx-auto whitespace-nowrap">
            <span className="text-[#062B67] dark:text-white">Learn Better.{' '}</span>
            <span className="relative inline-block text-[#155EEF] dark:text-blue-400">
              Grow Stronger.
              {/* Subtle curved blue underline stroke matching reference screenshot */}
              <svg 
                className="absolute -bottom-1.5 sm:-bottom-2 left-0 right-0 w-full h-[6px] sm:h-[8px] text-[#155EEF] dark:text-blue-400 overflow-visible pointer-events-none" 
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

          {/* Supportive Subtitle */}
          <p className="text-[13px] sm:text-[14.5px] text-slate-500 dark:text-slate-400 font-normal max-w-xl mx-auto mt-2.5 sm:mt-3 leading-relaxed">
            A proven 4-stage academic framework engineered to take students from core clarity to top university ranks.
          </p>
        </div>

        {/* ══════════════════════════════════════════════════
            2. THE 4-STAGE LEARNING JOURNEY
            ══════════════════════════════════════════════════ */}
        <div className="relative w-full mx-auto">
          {/* Cards Grid: 2x2 on mobile/tablet, 4x1 on desktop */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6 relative z-10 items-stretch">
            {pillars.map((item) => (
              <div 
                key={item.id} 
                className="group flex flex-col items-center h-full select-none"
              >
                
                {/* ── Circular Halo Medallion with Luminous Rings ── */}
                <div className="relative z-20 transition-transform duration-300 group-hover:scale-105 group-hover:-translate-y-1">
                  <div className="w-[84px] h-[84px] sm:w-[92px] sm:h-[92px] lg:w-[98px] lg:h-[98px] rounded-full bg-gradient-to-b from-white via-[#F6FAFE] to-[#E8F2FC] dark:from-slate-800 dark:to-slate-900 border-4 border-white dark:border-slate-800 shadow-[0_10px_28px_rgba(6,43,103,0.1),0_2px_6px_rgba(6,43,103,0.04)] ring-2 ring-[#DCE7F6] dark:ring-slate-700 flex items-center justify-center p-2.5 relative">
                    <Image
                      src={item.iconSrc}
                      alt={item.title}
                      width={64}
                      height={64}
                      unoptimized
                      className="w-[50px] h-[50px] sm:w-[56px] sm:h-[56px] lg:w-[60px] lg:h-[60px] object-contain select-none pointer-events-none drop-shadow-sm group-hover:rotate-2 transition-transform duration-300"
                      priority
                    />

                    {/* Step Number Badge */}
                    <div className="absolute -top-0.5 -right-0.5 sm:top-0 sm:-right-0.5 w-[25px] h-[25px] sm:w-[27px] sm:h-[27px] rounded-full bg-[#155EEF] border-2 border-white dark:border-slate-900 text-white text-[11px] sm:text-[11.5px] font-[950] flex items-center justify-center shadow-[0_2px_8px_rgba(21,94,239,0.4)]">
                      {item.badge}
                    </div>
                  </div>
                </div>

                {/* ── Ultra-Rounded Capsule Pod Body (Clean & Minimalist) ── */}
                <div className="-mt-10 sm:-mt-11 w-full flex-1 bg-gradient-to-b from-white via-white to-[#F8FAFD] dark:from-slate-900 dark:to-slate-950 rounded-[28px] sm:rounded-[34px] border border-[#DCE7F6] dark:border-slate-800 shadow-[0_4px_20px_-4px_rgba(6,43,103,0.05),0_1px_3px_rgba(0,0,0,0.02)] hover:shadow-[0_16px_40px_-6px_rgba(6,43,103,0.13)] hover:border-[#155EEF]/50 hover:-translate-y-1.5 transition-all duration-300 ease-out pt-13 sm:pt-14 pb-6 sm:pb-7 px-4 sm:px-5 flex flex-col items-center text-center relative overflow-hidden">
                  
                  {/* Stage Label */}
                  <div className="mb-1">
                    <span className="text-[10px] sm:text-[10.5px] font-black tracking-[0.1em] text-[#155EEF] dark:text-blue-400 uppercase">
                      {item.stageLabel}
                    </span>
                  </div>

                  {/* Card Title */}
                  <h3 className="text-[16px] min-[360px]:text-[17px] sm:text-[18px] lg:text-[19px] font-[950] text-[#0A1E4A] dark:text-white tracking-tight leading-snug group-hover:text-[#155EEF] transition-colors">
                    {item.title}
                  </h3>

                  {/* Tagline — smooth typographic highlight */}
                  <p className="text-[12.5px] sm:text-[13px] font-bold text-[#155EEF] dark:text-blue-400 mt-1 tracking-tight">
                    {item.tagline}
                  </p>

                  {/* Rich Meaningful Description */}
                  <p className="text-[12px] min-[360px]:text-[12.5px] sm:text-[13px] text-slate-500 dark:text-slate-400 font-normal leading-[1.6] mt-2.5 max-w-[240px] mx-auto">
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
