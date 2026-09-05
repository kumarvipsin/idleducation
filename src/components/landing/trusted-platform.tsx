'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { BookDemoModal } from "@/components/book-demo-modal";

export function TrustedPlatform() {
  const [isDemoOpen, setIsDemoOpen] = useState(false);

  return (
    <>
      <section suppressHydrationWarning className="w-full py-6 sm:py-8 lg:py-14 bg-white dark:bg-background relative overflow-hidden">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-[46%_54%] xl:grid-cols-[47%_53%] lg:gap-8 xl:gap-10 items-center">
            
            {/* ============================================================ */}
            {/* LEFT COLUMN: 46-47% width on desktop                         */}
            {/* ============================================================ */}
            <div className="w-full flex flex-col items-start text-left max-w-[620px]">
              {/* Main Heading: Exactly 2 lines on desktop with controlled tighter leading */}
              <h2 className="text-2xl min-[360px]:text-[26px] min-[390px]:text-[28px] sm:text-3xl lg:text-[30px] xl:text-[34px] font-extrabold tracking-tight text-[#0B1F4B] dark:text-white leading-[1.15]">
                Bharat&apos;s Trusted &amp;{' '}
                <span className="block text-[#1D4ED8] dark:text-blue-400 lg:whitespace-nowrap">
                  Affordable Learning Platform
                </span>
              </h2>

              {/* Supporting Text: 2 lines on desktop with comfortable width (18-24px gap from heading) */}
              <p className="mt-4 lg:mt-5 text-sm md:text-base text-slate-600 dark:text-slate-400 font-bold leading-relaxed max-w-[560px] xl:max-w-[620px]">
                Unlock your potential with IDL Education — an affordable learning solution built for every student&apos;s journey.
              </p>

              {/* CTA Button: 24-28px spacing from paragraph, naturally integrated into text block */}
              <div className="mt-6 lg:mt-7">
                <Button 
                  onClick={() => setIsDemoOpen(true)} 
                  className="h-11 px-6 rounded-[8px] font-bold text-sm bg-[#FF6B16] hover:bg-[#e65a0c] text-white border-none shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
                >
                  Book a Demo
                </Button>
              </div>

              {/* Book Demo Modal */}
              <BookDemoModal isOpen={isDemoOpen} onOpenChange={setIsDemoOpen} />
            </div>

            {/* ============================================================ */}
            {/* MOBILE-ONLY VISUAL COMPOSITION (lg:hidden)                   */}
            {/* Compact 300-320px height, centered, tightened diagonal flow  */}
            {/* ============================================================ */}
            <div className="block lg:hidden relative w-full mt-7 min-[360px]:mt-8">
              
              {/* Background: Extremely subtle dot texture & cool wash */}
              <div 
                aria-hidden="true" 
                className="pointer-events-none absolute inset-0 opacity-[0.035] dark:opacity-[0.05]"
                style={{
                  backgroundImage: `radial-gradient(#102A68 0.75px, transparent 0.75px)`,
                  backgroundSize: '14px 14px'
                }}
              />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-blue-500/[0.03] blur-2xl rounded-full pointer-events-none" />

              {/* Centered Compact Canvas: 300-320px height, 330-360px max width */}
              <div className="relative w-full max-w-[340px] min-[390px]:max-w-[365px] h-[300px] min-[360px]:h-[310px] min-[390px]:h-[320px] mx-auto">
                
                {/* Shortened Dotted Guidance Arc (Mentor -> Student) */}
                <svg 
                  className="absolute inset-0 w-full h-full pointer-events-none" 
                  viewBox="0 0 340 310" 
                  fill="none" 
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <path 
                    d="M 115 210 C 160 190, 195 140, 235 95" 
                    stroke="#2563EB" 
                    strokeOpacity="0.2" 
                    strokeWidth="1.2" 
                    strokeDasharray="3 4" 
                  />
                  <circle cx="175" cy="152" r="2" fill="#3B82F6" fillOpacity="0.35" />
                </svg>

                {/* 1. UPPER-RIGHT: Student Portrait + Message Bubble to Left */}
                <div 
                  className="absolute top-1.5 right-1.5 min-[360px]:right-3 min-[390px]:right-4 flex items-center z-10 animate-[tp-float-1_5.5s_ease-in-out_infinite]"
                  style={{ animation: 'tp-float-1 5.5s ease-in-out infinite' }}
                >
                  {/* Upper Bubble (150-175px): Amod Sir, What is IDL? */}
                  <div className="relative mr-2 w-[148px] min-[360px]:w-[160px] min-[390px]:w-[168px] bg-[#F0FDF4] dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/60 text-slate-800 dark:text-emerald-200 px-2.5 py-1.5 rounded-xl shadow-2xs">
                    <p className="text-[10px] min-[360px]:text-[10.5px] font-semibold leading-tight text-[#0B2154] dark:text-emerald-200 text-center">
                      Amod Sir, What is IDL?
                    </p>
                    {/* Directional tail pointing toward student portrait */}
                    <div 
                      className="absolute -right-[5px] top-1/2 -translate-y-1/2 w-0 h-0 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent border-l-[5px] border-l-[#F0FDF4] dark:border-l-emerald-950/40" 
                      aria-hidden="true"
                    />
                  </div>

                  {/* Student Portrait: 78-88px circular */}
                  <div className="relative w-[78px] h-[78px] min-[360px]:w-[84px] min-[360px]:h-[84px] min-[390px]:w-[88px] min-[390px]:h-[88px] shrink-0">
                    <div className="absolute -inset-1.5 border border-dashed border-blue-200/80 dark:border-blue-800/60 rounded-full pointer-events-none" />
                    <div className="w-full h-full rounded-full bg-[#EDF5FF] dark:bg-blue-950/40 border border-blue-200/70 dark:border-blue-800/50 shadow-xs overflow-hidden flex items-center justify-center">
                      <Image 
                        src="/student.png" 
                        alt="IDL Student" 
                        width={88} 
                        height={88} 
                        className="w-full h-full object-cover object-top" 
                        priority 
                      />
                    </div>
                  </div>
                </div>

                {/* 2. LOWER-LEFT: Mentor Portrait + Message Bubble to Right */}
                <div 
                  className="absolute bottom-1.5 left-1.5 min-[360px]:left-3 min-[390px]:left-4 flex items-center z-10 animate-[tp-float-2_6s_ease-in-out_infinite]"
                  style={{ animation: 'tp-float-2 6s ease-in-out infinite' }}
                >
                  {/* Mentor Portrait: 82-92px circular */}
                  <div className="relative w-[82px] h-[82px] min-[360px]:w-[88px] min-[360px]:h-[88px] min-[390px]:w-[92px] min-[390px]:h-[92px] shrink-0">
                    <div className="absolute -inset-1.5 border border-dashed border-indigo-200/80 dark:border-indigo-800/60 rounded-full pointer-events-none" />
                    <div className="w-full h-full rounded-full bg-[#EDF2FE] dark:bg-indigo-950/40 border border-indigo-200/70 dark:border-indigo-800/50 shadow-xs overflow-hidden flex items-center justify-center">
                      <Image 
                        src="/teacher.png" 
                        alt="Amod Sir - IDL Mentor" 
                        width={92} 
                        height={92} 
                        className="w-full h-full object-cover object-top" 
                        priority 
                      />
                    </div>
                  </div>

                  {/* Lower Bubble (190-225px): IDL value statement */}
                  <div className="relative ml-2 w-[185px] min-[360px]:w-[205px] min-[390px]:w-[220px] bg-white/95 dark:bg-slate-900/95 backdrop-blur-xs border border-blue-100 dark:border-blue-900/60 p-2 min-[360px]:p-2.5 rounded-xl shadow-[0_3px_12px_-3px_rgba(16,42,104,0.08)]">
                    {/* Directional tail pointing toward mentor */}
                    <div 
                      className="absolute -left-[5px] top-5 -translate-y-1/2 w-0 h-0 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent border-r-[5px] border-r-white dark:border-r-slate-900" 
                      aria-hidden="true"
                    />
                    <p className="text-[9px] min-[360px]:text-[9.5px] min-[390px]:text-[10px] leading-snug font-medium text-[#0B1F4B] dark:text-blue-100">
                      IDL is where dreams are encouraged, effort is empowered, and every student is guided to rise with confidence and purpose.
                    </p>
                  </div>
                </div>

                {/* 3. STRATEGIC DECORATIVE ACCENTS (2-3 subtle dots only) */}
                <div 
                  aria-hidden="true" 
                  className="absolute top-14 left-[42%] w-1.5 h-1.5 rounded-full bg-[#1D4ED8]/30 dark:bg-blue-400/35 pointer-events-none" 
                />
                <div 
                  aria-hidden="true" 
                  className="absolute bottom-16 right-[40%] w-1.5 h-1.5 rounded-full bg-[#FF6B16]/35 dark:bg-orange-400/40 pointer-events-none" 
                />
                <div 
                  aria-hidden="true" 
                  className="absolute top-[32%] right-1 w-1 h-1 rounded-full bg-emerald-400/40 pointer-events-none" 
                />

              </div>
            </div>

            {/* ============================================================ */}
            {/* DESKTOP-ONLY VISUAL COMPOSITION (hidden lg:flex)             */}
            {/* 100% UNTOUCHED APPROVED DESKTOP DESIGN                       */}
            {/* ============================================================ */}
            <div className="hidden lg:flex relative w-full items-center justify-center">
              
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

                {/* ============================================================ */}
                {/* SUBTLE PHYSICS + CHEMISTRY ACADEMIC BACKGROUND ATMOSPHERE    */}
                {/* Visual Flow: Molecular Node -> Trajectory -> Orbit -> Student */}
                {/* 2-6% opacity lines | 4-8% dots | 6-10s subtle micro-drift    */}
                {/* ============================================================ */}

                {/* 1. Thin Curved Trajectory / Wave Line (Knowledge Path) */}
                <svg 
                  className="pointer-events-none absolute inset-0 w-full h-full" 
                  viewBox="0 0 540 350" 
                  fill="none" 
                  aria-hidden="true"
                  style={{ animation: 'tp-trajectory-shift 9.5s ease-in-out infinite' }}
                >
                  <path 
                    d="M 55 42 C 145 16, 215 62, 315 32 S 395 72, 440 65" 
                    stroke="#1D4ED8" 
                    strokeOpacity="0.05" 
                    strokeWidth="1.2" 
                    strokeDasharray="4 6" 
                  />
                </svg>

                {/* 2. Atomic Orbit Graphic (Behind/Around Student Portrait) */}
                <svg 
                  className="pointer-events-none absolute -top-8 -right-8 w-[280px] h-[260px] text-blue-600 dark:text-blue-400"
                  viewBox="0 0 280 260" 
                  fill="none"
                  aria-hidden="true"
                  style={{ animation: 'tp-orbit-shift 10s ease-in-out infinite' }}
                >
                  {/* Orbit Path 1 (35° tilt) */}
                  <ellipse 
                    cx="140" 
                    cy="130" 
                    rx="110" 
                    ry="52" 
                    transform="rotate(32 140 130)" 
                    stroke="currentColor" 
                    strokeWidth="1.1" 
                    strokeDasharray="4 6"
                    strokeOpacity="0.06"
                  />
                  {/* Orbit Path 2 (-35° tilt) */}
                  <ellipse 
                    cx="140" 
                    cy="130" 
                    rx="110" 
                    ry="52" 
                    transform="rotate(-32 140 130)" 
                    stroke="currentColor" 
                    strokeWidth="1.1" 
                    strokeDasharray="4 6"
                    strokeOpacity="0.05"
                  />
                  {/* 2 Tiny Orbit Particles */}
                  <circle cx="215" cy="85" r="1.5" fill="#3B82F6" fillOpacity="0.25" />
                  <circle cx="65" cy="175" r="1.5" fill="#1D4ED8" fillOpacity="0.2" />
                </svg>

                {/* 3. Chemistry Element 1: Small Molecular Node Cluster (Top-Left) */}
                <div 
                  aria-hidden="true"
                  className="pointer-events-none absolute top-5 left-8"
                  style={{ animation: 'tp-molecule-pulse 8.5s ease-in-out infinite' }}
                >
                  <svg width="34" height="34" viewBox="0 0 34 34" fill="none" className="text-blue-600 dark:text-blue-400">
                    <line x1="17" y1="17" x2="8" y2="9" stroke="currentColor" strokeWidth="0.75" strokeOpacity="0.14" />
                    <line x1="17" y1="17" x2="26" y2="11" stroke="currentColor" strokeWidth="0.75" strokeOpacity="0.14" />
                    <line x1="17" y1="17" x2="19" y2="28" stroke="currentColor" strokeWidth="0.75" strokeOpacity="0.14" />
                    <circle cx="17" cy="17" r="2.5" fill="currentColor" fillOpacity="0.22" />
                    <circle cx="17" cy="17" r="4.25" stroke="currentColor" strokeWidth="0.6" strokeOpacity="0.12" />
                    <circle cx="8" cy="9" r="1.5" fill="currentColor" fillOpacity="0.18" />
                    <circle cx="26" cy="11" r="1.35" fill="currentColor" fillOpacity="0.18" />
                    <circle cx="19" cy="28" r="1.5" fill="currentColor" fillOpacity="0.18" />
                  </svg>
                </div>

                {/* 4. Chemistry Element 2: Secondary Miniature Molecular Bond (Far-Right) */}
                <div 
                  aria-hidden="true"
                  className="pointer-events-none absolute top-[64%] right-2"
                  style={{ animation: 'tp-molecule-pulse 9s ease-in-out infinite' }}
                >
                  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" className="text-indigo-600 dark:text-indigo-400">
                    <line x1="6" y1="6" x2="16" y2="16" stroke="currentColor" strokeWidth="0.7" strokeOpacity="0.12" />
                    <circle cx="6" cy="6" r="1.5" fill="currentColor" fillOpacity="0.18" />
                    <circle cx="16" cy="16" r="1.5" fill="currentColor" fillOpacity="0.18" />
                  </svg>
                </div>

                {/* 5. Physics Elements: Extremely Faint Symbols (4-8% opacity watermark style) */}
                {/* π (Pi) */}
                <span 
                  aria-hidden="true"
                  className="pointer-events-none absolute top-3 left-[36%] font-serif text-[13px] text-[#0B2154]/[0.08] dark:text-blue-200/[0.1] select-none"
                  style={{ animation: 'tp-symbol-1 8s ease-in-out infinite' }}
                >
                  π
                </span>

                {/* ∑ (Summation) */}
                <span 
                  aria-hidden="true"
                  className="pointer-events-none absolute top-11 right-[40%] font-serif text-[13.5px] text-[#0B2154]/[0.07] dark:text-blue-200/[0.09] select-none"
                  style={{ animation: 'tp-symbol-2 9.5s ease-in-out infinite' }}
                >
                  ∑
                </span>

                {/* E = mc² */}
                <span 
                  aria-hidden="true"
                  className="pointer-events-none absolute bottom-8 left-[38%] font-serif text-[10.5px] tracking-wide text-[#1D4ED8]/[0.08] dark:text-blue-300/[0.1] select-none"
                  style={{ animation: 'tp-symbol-3 7.5s ease-in-out infinite' }}
                >
                  E = mc²
                </span>

                {/* F = ma */}
                <span 
                  aria-hidden="true"
                  className="pointer-events-none absolute top-[47%] -right-1 font-serif text-[10px] tracking-wide text-[#0B2154]/[0.07] dark:text-blue-200/[0.09] select-none"
                  style={{ animation: 'tp-symbol-1 8.5s ease-in-out infinite' }}
                >
                  F = ma
                </span>

                {/* √ (Square root) */}
                <span 
                  aria-hidden="true"
                  className="pointer-events-none absolute bottom-20 right-[18%] font-serif text-[12px] text-[#0B2154]/[0.07] dark:text-blue-200/[0.09] select-none"
                  style={{ animation: 'tp-symbol-2 9s ease-in-out infinite' }}
                >
                  √
                </span>

                {/* 6. Tiny Floating Particles (4 total: light blue, orange, mint, indigo) */}
                <div 
                  aria-hidden="true" 
                  className="pointer-events-none absolute top-11 left-[45%] w-1.5 h-1.5 rounded-full bg-[#1D4ED8]/25 dark:bg-blue-400/30"
                  style={{ animation: 'tp-particle-1 7s ease-in-out infinite' }}
                />
                <div 
                  aria-hidden="true" 
                  className="pointer-events-none absolute bottom-16 right-[40%] w-1.5 h-1.5 rounded-full bg-[#FF6B16]/30 dark:bg-orange-400/35"
                  style={{ animation: 'tp-particle-2 8s ease-in-out infinite' }}
                />
                <div 
                  aria-hidden="true" 
                  className="pointer-events-none absolute top-[38%] right-6 w-1 h-1 rounded-full bg-emerald-500/25 dark:bg-emerald-400/30"
                  style={{ animation: 'tp-particle-3 6.5s ease-in-out infinite' }}
                />
                <div 
                  aria-hidden="true" 
                  className="pointer-events-none absolute top-16 right-[26%] w-1 h-1 rounded-full bg-indigo-500/20 dark:bg-indigo-400/25"
                  style={{ animation: 'tp-particle-4 9s ease-in-out infinite' }}
                />

              </div>

            </div>

          </div>
        </div>

        {/* Scoped CSS Keyframes for subtle, subconscious movement (6-10s duration) */}
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
          @keyframes tp-orbit-shift {
            0%, 100% {
              transform: rotate(0deg);
            }
            50% {
              transform: rotate(2deg);
            }
          }
          @keyframes tp-trajectory-shift {
            0%, 100% {
              transform: translate(0px, 0px);
            }
            50% {
              transform: translate(1.5px, -1.5px);
            }
          }
          @keyframes tp-molecule-pulse {
            0%, 100% {
              transform: translate(0px, 0px) rotate(0deg);
              opacity: 0.85;
            }
            50% {
              transform: translate(1.5px, -2px) rotate(3deg);
              opacity: 1;
            }
          }
          @keyframes tp-symbol-1 {
            0%, 100% {
              transform: translate(0px, 0px);
            }
            50% {
              transform: translate(-1.5px, -2px);
            }
          }
          @keyframes tp-symbol-2 {
            0%, 100% {
              transform: translate(0px, 0px);
            }
            50% {
              transform: translate(2px, -1.5px);
            }
          }
          @keyframes tp-symbol-3 {
            0%, 100% {
              transform: translate(0px, 0px);
            }
            50% {
              transform: translate(-1.5px, 1.5px);
            }
          }
          @keyframes tp-particle-1 {
            0%, 100% {
              transform: translate(0px, 0px);
            }
            50% {
              transform: translate(-2px, -2.5px);
            }
          }
          @keyframes tp-particle-2 {
            0%, 100% {
              transform: translate(0px, 0px);
            }
            50% {
              transform: translate(2px, -1.5px);
            }
          }
          @keyframes tp-particle-3 {
            0%, 100% {
              transform: translate(0px, 0px);
            }
            50% {
              transform: translate(-1px, 2px);
            }
          }
          @keyframes tp-particle-4 {
            0%, 100% {
              transform: translate(0px, 0px);
            }
            50% {
              transform: translate(1.5px, 1px);
            }
          }
        `}</style>
      </section>
    </>
  );
}
