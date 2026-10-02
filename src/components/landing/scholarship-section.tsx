'use client';

import React from 'react';
import Image from 'next/image';

/* ══════════════════════════════════════════════════════════════════
   IDL EDUCATION — 4-Stage Academic Success Framework
   “From Foundation to Future. Built for Every Step.”
   
   Exact Match to Reference Design:
   • Eyebrow: "• OUR LEARNING APPROACH" pill badge
   • Heading: "From Foundation to Future. Built for Every Step."
   • Subtitle: "A structured learning journey designed to help every student learn better, grow stronger and achieve more."
   • Desktop (>= lg): 4 Large White Circular Feature Cards with Arched Connector Line & Nodes
   • Mobile (< lg): 4 Horizontal Rounded Cards with Left Icon Disc, Number Badge & Right Text
   ══════════════════════════════════════════════════════════════════ */

interface PillarItem {
  id: string;
  badge: string;
  badgeColor: 'blue' | 'yellow';
  iconSrc: string;
  iconGlow: 'blue' | 'yellow';
  titleDark: string;
  titleBlue: string;
  descriptionMobile: string;
  descriptionLine1: string;
  descriptionLine2: string;
  descriptionLine3: string;
}

const pillars: PillarItem[] = [
  {
    id: '01',
    badge: '01',
    badgeColor: 'blue',
    iconSrc: '/001.png',
    iconGlow: 'blue',
    titleDark: 'Focused',
    titleBlue: 'Learning',
    descriptionMobile: 'Structured learning with complete clarity for conceptual mastery.',
    descriptionLine1: 'Structured learning with',
    descriptionLine2: 'complete clarity for',
    descriptionLine3: 'conceptual mastery.',
  },
  {
    id: '02',
    badge: '02',
    badgeColor: 'yellow',
    iconSrc: '/02.png',
    iconGlow: 'yellow',
    titleDark: 'Expert',
    titleBlue: 'Teachers',
    descriptionMobile: 'Learn from top mentors with years of proven experience.',
    descriptionLine1: 'Learn from top mentors',
    descriptionLine2: 'with years of proven',
    descriptionLine3: 'experience.',
  },
  {
    id: '03',
    badge: '03',
    badgeColor: 'blue',
    iconSrc: '/03.png',
    iconGlow: 'blue',
    titleDark: 'Proven',
    titleBlue: 'Progress',
    descriptionMobile: 'Regular assessments and continuous performance tracking.',
    descriptionLine1: 'Regular assessments and',
    descriptionLine2: 'continuous performance',
    descriptionLine3: 'tracking.',
  },
  {
    id: '04',
    badge: '04',
    badgeColor: 'yellow',
    iconSrc: '/04.png',
    iconGlow: 'yellow',
    titleDark: 'Future',
    titleBlue: 'Ready',
    descriptionMobile: 'Comprehensive preparation for board exams and top university admissions.',
    descriptionLine1: 'Comprehensive preparation',
    descriptionLine2: 'for board exams and top',
    descriptionLine3: 'university admissions.',
  },
];

export function ScholarshipSection() {
  return (
    <section
      id="why-idl-education"
      aria-label="Why Choose IDL"
      className="relative w-full pt-6 min-[390px]:pt-7 sm:pt-10 md:pt-14 pb-3 min-[390px]:pb-4 sm:pb-16 md:pb-20 bg-white dark:bg-slate-950 overflow-hidden"
      style={{ fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif" }}
    >
      {/* ══════════════════════════════════════════════════
          Ambient Light Background Glows
          Pure seamless matching white on top (zero blur line/seam),
          soft light blue glow solely around/behind the circular cards
          ══════════════════════════════════════════════════ */}
      <div 
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 overflow-hidden select-none"
      >
        {/* Soft light blue ambient bloom strictly around the 4 circular cards */}
        <div 
          className="absolute inset-x-0 bottom-4 sm:bottom-8 mx-auto w-full max-w-[1260px] h-[360px] dark:hidden opacity-50"
          style={{
            background: 'radial-gradient(ellipse 65% 55% at 50% 60%, #EBF4FE 0%, #F5F9FE 42%, rgba(255, 255, 255, 0) 80%)',
          }}
        />

        {/* Dark mode center bloom */}
        <div 
          className="hidden dark:block absolute inset-x-0 bottom-4 sm:bottom-8 mx-auto w-full max-w-[1260px] h-[360px]"
          style={{
            background: 'radial-gradient(ellipse 65% 55% at 50% 60%, rgba(30, 58, 138, 0.15) 0%, rgba(30, 58, 138, 0.05) 45%, rgba(2, 6, 23, 0) 80%)',
          }}
        />
      </div>

      <div className="container relative z-10 mx-auto px-3.5 min-[390px]:px-4 sm:px-6 max-w-[1260px]">
        
        {/* ══════════════════════════════════════════════════
            1. HEADER AREA
            “● Why think IDL ?”
            “Learn Better. Grow Stronger.” with smile underline
            ══════════════════════════════════════════════════ */}
        <div className="flex flex-col items-center justify-center text-center mb-4 min-[390px]:mb-5 sm:mb-10 md:mb-12">
          {/* Eyebrow: "● Why think IDL ?" */}
          <div className="inline-flex items-center justify-center gap-1.5 sm:gap-2 mb-1.5 min-[390px]:mb-2 select-none">
            <span className="w-[7px] h-[7px] sm:w-[8px] sm:h-[8px] rounded-full bg-[#155EEF] dark:bg-blue-400 shrink-0" />
            <span className="text-[13px] min-[390px]:text-[13.5px] sm:text-[15px] font-[800] tracking-tight">
              <span className="text-[#062B67] dark:text-blue-200">Why think </span>
              <span className="text-[#155EEF] dark:text-blue-400 font-extrabold">IDL ?</span>
            </span>
          </div>

          {/* Main Heading: Matches exact size & clean hierarchy */}
          <h2 className="text-[15px] min-[360px]:text-[15.5px] min-[390px]:text-[16.5px] sm:text-[28px] md:text-[34px] font-[800] tracking-[-0.015em] leading-[1.22] max-w-4xl mx-auto whitespace-nowrap">
            <span className="text-[#062B67] dark:text-white">
              Learn Better.{' '}
            </span>
            <span className="text-[#155EEF] dark:text-blue-400 inline-block">
              Grow{' '}
              <span className="relative inline-block">
                Stronger.
                {/* Curved blue smile underline stroke */}
                <svg 
                  className="absolute -bottom-1 min-[390px]:-bottom-1.5 sm:-bottom-2 md:-bottom-2.5 left-0 w-full h-[5px] sm:h-[7px] md:h-[8px] overflow-visible pointer-events-none" 
                  viewBox="0 0 100 12" 
                  fill="none" 
                  aria-hidden="true"
                >
                  <path 
                    d="M 2 3 Q 50 13, 98 3" 
                    stroke="currentColor" 
                    strokeWidth="2.8" 
                    strokeLinecap="round" 
                    className="text-[#155EEF] dark:stroke-blue-400"
                  />
                </svg>
              </span>
            </span>
          </h2>
        </div>

        {/* ══════════════════════════════════════════════════
            2A. DESKTOP VIEW (>= lg): 4 CIRCULAR PODS IN 1 ROW
            ══════════════════════════════════════════════════ */}
        <div className="hidden lg:block relative w-full mx-auto">
          {/* 4 Large Perfect Circular Cards Grid */}
          <div className="grid grid-cols-4 gap-6 xl:gap-8 relative z-10 items-center justify-items-center">
            {pillars.map((item) => (
              <div 
                key={item.id} 
                className="relative pt-[34px] w-full max-w-[270px] flex flex-col items-center group select-none"
              >
                {/* Floating Icon Medallion: 40% above circle top, 60% on white circle surface */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 z-20 transition-transform duration-300 group-hover:scale-105 group-hover:-translate-y-1 pointer-events-none">
                  <div className={`w-[84px] h-[84px] rounded-full flex items-center justify-center p-2.5 relative border-2 border-white dark:border-slate-800 shadow-sm ${
                    item.iconGlow === 'yellow'
                      ? 'bg-gradient-to-b from-[#FEF9E7] to-[#FDE8B3] ring-3 ring-amber-50/70 dark:ring-amber-900/30 shadow-[0_4px_16px_rgba(245,158,11,0.14)]'
                      : 'bg-gradient-to-b from-[#EBF4FE] to-[#D7E9FD] ring-3 ring-blue-50/70 dark:ring-blue-900/30 shadow-[0_4px_16px_rgba(21,94,239,0.12)]'
                  }`}>
                    <Image
                      src={item.iconSrc}
                      alt={`${item.titleDark} ${item.titleBlue}`}
                      width={56}
                      height={56}
                      unoptimized
                      className="w-[50px] h-[50px] object-contain drop-shadow-sm group-hover:rotate-2 transition-transform duration-300"
                    />
                  </div>

                  {/* Centered Number Badge at bottom of disc */}
                  <div className={`absolute -bottom-2.5 inset-x-0 mx-auto w-[25px] h-[25px] rounded-full flex items-center justify-center text-white text-[11px] font-black border-2 border-white dark:border-slate-900 shadow-sm ${
                    item.badgeColor === 'yellow' ? 'bg-[#F59E0B]' : 'bg-[#155EEF]'
                  }`}>
                    {item.badge}
                  </div>
                </div>

                {/* Large White Circle Card Body — 3D Convex Dome / Hemisphere Shape */}
                <div className="idl-hemisphere-pod w-full aspect-square rounded-full border border-[#DCE6F5]/80 dark:border-slate-800/80 hover:-translate-y-1 transition-all duration-300 flex flex-col items-center justify-center pt-[64px] pb-5 px-5 text-center relative z-10">
                  {/* Two-Tone Title */}
                  <h3 
                    className="text-[18px] sm:text-[18.9px] font-black tracking-[-0.01em] text-center leading-snug"
                    style={{ 
                      fontWeight: 900,
                    }}
                  >
                    <span className="text-[#062B67] dark:text-white" style={{ fontWeight: 900 }}>{item.titleDark} </span>
                    <span className="text-[#155EEF] dark:text-blue-400" style={{ fontWeight: 900 }}>{item.titleBlue}</span>
                  </h3>

                  {/* Accent Dash Bar with refined separation */}
                  <div className={`w-6 sm:w-7 h-[2px] rounded-full mx-auto mt-2 mb-2.5 ${
                    item.badgeColor === 'yellow' ? 'bg-[#F59E0B]' : 'bg-[#155EEF]'
                  }`} />

                  {/* Centered Description */}
                  <p 
                    className="text-[13.6px] sm:text-[13.8px] text-[#4A5872] dark:text-slate-300 font-bold leading-[1.58] text-center"
                    style={{ 
                      fontWeight: 700,
                    }}
                  >
                    <span className="block">{item.descriptionLine1}</span>
                    <span className="block">{item.descriptionLine2}</span>
                    <span className="block">{item.descriptionLine3}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* ══════════════════════════════════════════════════
            2B. MOBILE VIEW (< lg): HORIZONTAL CARDS STACK
            Refined, modern, subtle 1px border, soft shadow,
            consistent height, clear typography hierarchy
            ══════════════════════════════════════════════════ */}
        <div className="block lg:hidden w-full max-w-[480px] mx-auto space-y-2.5 min-[390px]:space-y-3">
          {pillars.map((item) => (
            <div 
              key={item.id}
              className="w-full bg-white dark:bg-slate-900 rounded-[14px] min-[390px]:rounded-[16px] border border-[#E2ECF8] dark:border-slate-800 shadow-[0_2px_8px_rgba(6,43,103,0.03)] px-3.5 py-3 min-[390px]:px-4 min-[390px]:py-3.5 flex items-center gap-3 min-[390px]:gap-3.5 active:scale-[0.99] transition-all duration-200"
            >
              {/* Left Icon Disc with Number Badge */}
              <div className="relative shrink-0">
                <div className={`w-[54px] h-[54px] min-[390px]:w-[58px] min-[390px]:h-[58px] rounded-full flex items-center justify-center p-2 border transition-transform duration-200 ${
                  item.iconGlow === 'yellow'
                    ? 'bg-[#FEF9EC] dark:bg-amber-950/30 border-[#FDE8B5] dark:border-amber-900/40'
                    : 'bg-[#F0F6FE] dark:bg-blue-950/30 border-[#D8E6F8] dark:border-blue-900/40'
                }`}>
                  <Image
                    src={item.iconSrc}
                    alt={`${item.titleDark} ${item.titleBlue}`}
                    width={44}
                    height={44}
                    unoptimized
                    className="w-[32px] h-[32px] min-[390px]:w-[35px] min-[390px]:h-[35px] object-contain drop-shadow-xs"
                  />
                </div>

                {/* Badge at bottom-right of icon disc - subtle, compact, professional */}
                <div className={`absolute -bottom-0.5 -right-0.5 w-[19px] h-[19px] rounded-full flex items-center justify-center text-white text-[9.5px] font-[800] leading-none border-[1.5px] border-white dark:border-slate-900 shadow-xs ${
                  item.badgeColor === 'yellow' ? 'bg-[#F59E0B]' : 'bg-[#155EEF]'
                }`}>
                  {item.badge}
                </div>
              </div>

              {/* Right Text Column - vertically balanced */}
              <div className="flex-1 min-w-0 text-left flex flex-col justify-center">
                <h3 className="text-[15px] min-[390px]:text-[16px] font-[800] leading-snug tracking-[-0.01em]">
                  <span className="text-[#062B67] dark:text-white">{item.titleDark} </span>
                  <span className="text-[#155EEF] dark:text-blue-400">{item.titleBlue}</span>
                </h3>

                {/* Accent Dash Under Title */}
                <div className={`w-5 h-[2px] rounded-full mt-1 mb-1.5 ${
                  item.badgeColor === 'yellow' ? 'bg-[#F59E0B]' : 'bg-[#155EEF]'
                }`} />

                {/* Description: clear typography hierarchy, secondary, readable */}
                <p className="text-[12px] min-[390px]:text-[12.6px] text-[#4A5872] dark:text-slate-300 font-[500] leading-[1.44] text-pretty">
                  {item.descriptionMobile}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
