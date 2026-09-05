'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { BookDemoModal } from "@/components/book-demo-modal";

export function TrustedPlatform() {
  const [isDemoOpen, setIsDemoOpen] = useState(false);

  return (
    <>
      <section suppressHydrationWarning className="w-full py-6 sm:py-8 md:py-12 lg:py-14 bg-white dark:bg-background relative overflow-hidden">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 sm:gap-8 lg:gap-10 items-center">
            
            {/* ============================================================ */}
            {/* LEFT COLUMN: 42-46% width on desktop                         */}
            {/* ============================================================ */}
            <div className="lg:col-span-5 flex flex-col items-start text-left space-y-3 sm:space-y-4 max-w-[500px]">
              {/* Main Heading: Tighter line-height, clear IDL navy + royal blue emphasis */}
              <h2 className="text-2xl sm:text-3xl lg:text-[34px] xl:text-[38px] font-extrabold tracking-tight text-[#0B1F4B] dark:text-white leading-[1.18]">
                Bharat&apos;s Trusted &amp;{' '}
                <br className="hidden sm:inline" />
                <span className="text-[#1D4ED8] dark:text-blue-400">Affordable Learning Platform</span>
              </h2>

              {/* Supporting Text: Compact, readable (max 3 lines on mobile) */}
              <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-[15px] leading-relaxed font-normal max-w-[440px]">
                Unlock your potential with IDL Education — an affordable learning solution built for every student&apos;s journey.
              </p>

              {/* Refined CTA Button with strict 28-32px spacing to mobile visual */}
              <div className="pt-0.5 sm:pt-1.5">
                <Button 
                  onClick={() => setIsDemoOpen(true)} 
                  className="h-11 px-6 rounded-[12px] font-bold text-sm bg-[#FF6B16] hover:bg-[#e65a0c] text-white border-none shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
                >
                  Book a Demo
                </Button>
              </div>

              {/* Book Demo Modal */}
              <BookDemoModal isOpen={isDemoOpen} onOpenChange={setIsDemoOpen} />
            </div>

            {/* ============================================================ */}
            {/* MOBILE VISUAL COMPOSITION (lg:hidden)                        */}
            {/* Compact, tight diagonal arrangement, centered, no empty void */}
            {/* ============================================================ */}
            <div className="block lg:hidden relative w-full mt-1 sm:mt-2">
              
              {/* Subtle ambient wash & dot texture */}
              <div 
                aria-hidden="true" 
                className="pointer-events-none absolute inset-0 opacity-[0.035] dark:opacity-[0.05]"
                style={{
                  backgroundImage: `radial-gradient(#102A68 0.75px, transparent 0.75px)`,
                  backgroundSize: '14px 14px'
                }}
              />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-56 bg-blue-500/[0.04] blur-2xl rounded-full pointer-events-none" />

              {/* Compact Mobile Canvas: Max 350-380px wide, 260-285px tall */}
              <div className="relative w-full max-w-[350px] min-[390px]:max-w-[375px] h-[260px] min-[360px]:h-[275px] min-[390px]:h-[285px] mx-auto">
                
                {/* Shortened Dotted Connection Line (Mentor -> Student) */}
                <svg 
                  className="absolute inset-0 w-full h-full pointer-events-none" 
                  viewBox="0 0 360 280" 
                  fill="none" 
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <path 
                    d="M 118 200 C 165 190, 205 140, 258 75" 
                    stroke="#2563EB" 
                    strokeOpacity="0.22" 
                    strokeWidth="1.2" 
                    strokeDasharray="3 4" 
                  />
                  <circle cx="186" cy="142" r="2" fill="#3B82F6" fillOpacity="0.4" />
                </svg>

                {/* 1. MOBILE UPPER-RIGHT: Student Portrait + Left Speech Bubble */}
                <div 
                  className="absolute top-1 right-1 min-[360px]:top-2 min-[360px]:right-2 flex items-center z-10 animate-[tp-float-1_5.5s_ease-in-out_infinite]"
                  style={{ animation: 'tp-float-1 5.5s ease-in-out infinite' }}
                >
                  {/* Upper Bubble: Amod Sir, What is IDL? */}
                  <div className="relative mr-2 bg-[#F0FDF4] dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/60 text-slate-800 dark:text-emerald-200 px-2.5 py-1.5 rounded-xl shadow-2xs">
                    <p className="text-[10px] min-[360px]:text-[10.5px] font-semibold leading-tight text-[#0B2154] dark:text-emerald-200 whitespace-nowrap">
                      Amod Sir, What is IDL?
                    </p>
                    {/* Speech pointer towards student */}
                    <div 
                      className="absolute -right-[5px] top-1/2 -translate-y-1/2 w-0 h-0 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent border-l-[5px] border-l-[#F0FDF4] dark:border-l-emerald-950/40" 
                      aria-hidden="true"
                    />
                  </div>

                  {/* Student Circular Portrait: 76-86px on mobile */}
                  <div className="relative w-[76px] h-[76px] min-[360px]:w-[80px] min-[360px]:h-[80px] min-[390px]:w-[86px] min-[390px]:h-[86px] shrink-0">
                    <div className="absolute -inset-1.5 border border-dashed border-blue-200/90 dark:border-blue-800/70 rounded-full pointer-events-none" />
                    <div className="w-full h-full rounded-full bg-[#EDF5FF] dark:bg-blue-950/40 border border-blue-200/70 dark:border-blue-800/50 shadow-xs overflow-hidden flex items-center justify-center">
                      <Image 
                        src="/student.png" 
                        alt="IDL Student" 
                        width={86} 
                        height={86} 
                        className="w-full h-full object-cover object-top" 
                        priority 
                      />
                    </div>
                  </div>
                </div>

                {/* 2. MOBILE LOWER-LEFT: Mentor Portrait + Right Speech Bubble */}
                <div 
                  className="absolute bottom-1 left-1 min-[360px]:bottom-2 min-[360px]:left-2 flex items-center z-10 animate-[tp-float-2_6s_ease-in-out_infinite]"
                  style={{ animation: 'tp-float-2 6s ease-in-out infinite' }}
                >
                  {/* Mentor Circular Portrait: 80-90px on mobile */}
                  <div className="relative w-[80px] h-[80px] min-[360px]:w-[84px] min-[360px]:h-[84px] min-[390px]:w-[90px] min-[390px]:h-[90px] shrink-0">
                    <div className="absolute -inset-1.5 border border-dashed border-indigo-200/90 dark:border-indigo-800/70 rounded-full pointer-events-none" />
                    <div className="w-full h-full rounded-full bg-[#EDF2FE] dark:bg-indigo-950/40 border border-indigo-200/70 dark:border-indigo-800/50 shadow-xs overflow-hidden flex items-center justify-center">
                      <Image 
                        src="/teacher.png" 
                        alt="Amod Sir - IDL Mentor" 
                        width={90} 
                        height={90} 
                        className="w-full h-full object-cover object-top" 
                        priority 
                      />
                    </div>
                  </div>

                  {/* Lower Bubble: IDL value statement (compact 180-220px max) */}
                  <div className="relative ml-2 max-w-[180px] min-[360px]:max-w-[200px] min-[390px]:max-w-[220px] bg-white/95 dark:bg-slate-900/95 backdrop-blur-xs border border-blue-100 dark:border-blue-900/60 p-2 min-[360px]:p-2.5 rounded-xl shadow-[0_3px_12px_-3px_rgba(16,42,104,0.08)]">
                    {/* Speech pointer towards mentor */}
                    <div 
                      className="absolute -left-[5px] top-5 -translate-y-1/2 w-0 h-0 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent border-r-[5px] border-r-white dark:border-r-slate-900" 
                      aria-hidden="true"
                    />
                    <p className="text-[9px] min-[360px]:text-[9.5px] min-[390px]:text-[10px] leading-snug font-medium text-[#0B1F4B] dark:text-blue-100">
                      IDL is where dreams are encouraged, effort is empowered, and every student is guided to rise with confidence and purpose.
                    </p>
                  </div>
                </div>

                {/* 3. MOBILE STRATEGIC ACCENT DOTS (Only 3 subtle accents) */}
                <div 
                  aria-hidden="true" 
                  className="absolute top-12 left-[44%] w-1.5 h-1.5 rounded-full bg-[#1D4ED8]/35 dark:bg-blue-400/40 pointer-events-none" 
                />
                <div 
                  aria-hidden="true" 
                  className="absolute bottom-14 right-[42%] w-1.5 h-1.5 rounded-full bg-[#FF6B16]/45 dark:bg-orange-400/45 pointer-events-none" 
                />
                <div 
                  aria-hidden="true" 
                  className="absolute top-[32%] right-0 w-1 h-1 rounded-full bg-emerald-400/50 pointer-events-none" 
                />

              </div>
            </div>

            {/* ============================================================ */}
            {/* DESKTOP VISUAL COMPOSITION (hidden lg:flex)                  */}
            {/* 100% UNTOUCHED APPROVED DESKTOP DESIGN                       */}
            {/* ============================================================ */}
            <div className="hidden lg:flex lg:col-span-7 relative w-full items-center justify-center">
              
              {/* Ambient wash & subtle dot grid */}
              <div 
                aria-hidden="true" 
                className="pointer-events-none absolute inset-0 opacity-[0.035] dark:opacity-[0.05]"
                style={{
                  backgroundImage: `radial-gradient(#102A68 0.75px, transparent 0.75px)`,
                  backgroundSize: '16px 16px'
                }}
              />
              <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-64 h-64 sm:w-80 sm:h-80 bg-blue-500/[0.04] blur-3xl rounded-full pointer-events-none" />

              {/* Visual Composition Canvas */}
              <div className="relative w-full max-w-[540px] h-[350px]">
                
                {/* Connecting Dotted Guidance Path (Mentor -> Student) */}
                <svg 
                  className="absolute inset-0 w-full h-full pointer-events-none" 
                  viewBox="0 0 540 350" 
                  fill="none" 
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <path 
                    d="M 120 250 C 220 250, 280 180, 420 85" 
                    stroke="#2563EB" 
                    strokeOpacity="0.18" 
                    strokeWidth="1.5" 
                    strokeDasharray="4 5" 
                  />
                  {/* Subtle directional pulse dot on curve */}
                  <circle cx="270" cy="188" r="2.5" fill="#3B82F6" fillOpacity="0.35" />
                </svg>

                {/* 1. UPPER-RIGHT: Student Portrait + Message Bubble */}
                <div 
                  className="absolute top-4 right-6 md:right-8 flex items-center z-10 animate-[gentle-float-1_5.5s_ease-in-out_infinite]"
                  style={{
                    animation: 'tp-float-1 5.5s ease-in-out infinite'
                  }}
                >
                  {/* Upper Bubble: Amod Sir, What is IDL? */}
                  <div className="relative mr-3.5 bg-[#F0FDF4] dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/60 text-slate-800 dark:text-emerald-200 px-3.5 py-2 rounded-2xl shadow-xs">
                    <p className="text-xs font-semibold leading-tight text-[#0B2154] dark:text-emerald-200 whitespace-nowrap">
                      Amod Sir, What is IDL?
                    </p>
                    {/* Speech pointer towards student portrait */}
                    <div 
                      className="absolute -right-[6px] top-1/2 -translate-y-1/2 w-0 h-0 border-t-[5px] border-t-transparent border-b-[5px] border-b-transparent border-l-[6px] border-l-[#F0FDF4] dark:border-l-emerald-950/40" 
                      aria-hidden="true"
                    />
                  </div>

                  {/* Student Circular Portrait */}
                  <div className="relative w-[102px] h-[102px] shrink-0">
                    {/* Thin dotted outer orbit */}
                    <div className="absolute -inset-2.5 border border-dashed border-blue-200/80 dark:border-blue-800/60 rounded-full pointer-events-none" />
                    {/* Portrait background surface */}
                    <div className="w-full h-full rounded-full bg-[#EDF5FF] dark:bg-blue-950/40 border border-blue-200/70 dark:border-blue-800/50 shadow-xs overflow-hidden flex items-center justify-center">
                      <Image 
                        src="/student.png" 
                        alt="IDL Student" 
                        width={102} 
                        height={102} 
                        className="w-full h-full object-cover object-top" 
                        priority 
                      />
                    </div>
                  </div>
                </div>

                {/* 2. LOWER-LEFT: Mentor Portrait + Message Bubble */}
                <div 
                  className="absolute bottom-4 left-4 md:left-6 flex items-center z-10 animate-[gentle-float-2_6s_ease-in-out_infinite]"
                  style={{
                    animation: 'tp-float-2 6s ease-in-out infinite'
                  }}
                >
                  {/* Mentor Circular Portrait */}
                  <div className="relative w-[110px] h-[110px] shrink-0">
                    {/* Thin dotted outer orbit */}
                    <div className="absolute -inset-2.5 border border-dashed border-indigo-200/80 dark:border-indigo-800/60 rounded-full pointer-events-none" />
                    {/* Portrait background surface */}
                    <div className="w-full h-full rounded-full bg-[#EDF2FE] dark:bg-indigo-950/40 border border-indigo-200/70 dark:border-indigo-800/50 shadow-xs overflow-hidden flex items-center justify-center">
                      <Image 
                        src="/teacher.png" 
                        alt="Amod Sir - IDL Mentor" 
                        width={110} 
                        height={110} 
                        className="w-full h-full object-cover object-top" 
                        priority 
                      />
                    </div>
                  </div>

                  {/* Lower Bubble: IDL value statement */}
                  <div className="relative ml-3.5 max-w-[310px] bg-white/95 dark:bg-slate-900/95 backdrop-blur-xs border border-blue-100 dark:border-blue-900/60 p-3 rounded-2xl shadow-[0_4px_16px_-4px_rgba(16,42,104,0.08)]">
                    {/* Speech pointer towards mentor portrait */}
                    <div 
                      className="absolute -left-[6px] top-6 -translate-y-1/2 w-0 h-0 border-t-[5px] border-t-transparent border-b-[5px] border-b-transparent border-r-[6px] border-r-white dark:border-r-slate-900" 
                      aria-hidden="true"
                    />
                    <p className="text-xs leading-snug font-medium text-[#0B1F4B] dark:text-blue-100">
                      IDL is where dreams are encouraged, effort is empowered, and every student is guided to rise with confidence and purpose.
                    </p>
                  </div>
                </div>

                {/* 3. STRATEGIC DECORATIVE ACCENTS (Minimal, non-distracting) */}
                <div 
                  aria-hidden="true" 
                  className="absolute top-10 left-[42%] w-2 h-2 rounded-full bg-[#1D4ED8]/40 dark:bg-blue-400/40" 
                />
                <div 
                  aria-hidden="true" 
                  className="absolute bottom-16 right-[38%] w-2 h-2 rounded-full bg-[#FF6B16]/50 dark:bg-orange-400/50" 
                />
                <div 
                  aria-hidden="true" 
                  className="absolute top-[38%] right-2 sm:right-3 w-1.5 h-1.5 rounded-full bg-emerald-400/50" 
                />

              </div>

            </div>

          </div>
        </div>

        {/* Scoped CSS Keyframes for subtle 2-3px movement every 5-6 seconds */}
        <style>{`
          @keyframes tp-float-1 {
            0%, 100% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-3px);
            }
          }
          @keyframes tp-float-2 {
            0%, 100% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(2.5px);
            }
          }
        `}</style>
      </section>
    </>
  );
}
