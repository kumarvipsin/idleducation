'use client';

import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, GraduationCap, BookOpenCheck, Award } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function DiscoverAdvantage() {
  const advantagePoints = [
    {
      icon: <GraduationCap className="w-4 h-4 text-[#1D4ED8]" />,
      iconBg: "bg-blue-50/90 dark:bg-blue-950/50 border-blue-100 dark:border-blue-900/40",
      cardBg: "bg-[#F9FBFF] dark:bg-slate-900/60 border-blue-100/70 dark:border-slate-800 hover:border-blue-300/60 dark:hover:border-blue-600/40",
      title: "Top-Tier Faculty & Mentors",
      description: "Learn from experienced subject experts with proven teaching methodology.",
    },
    {
      icon: <BookOpenCheck className="w-4 h-4 text-[#FF6B16]" />,
      iconBg: "bg-orange-50/90 dark:bg-orange-950/50 border-orange-100 dark:border-orange-900/40",
      cardBg: "bg-[#FFFDFB] dark:bg-slate-900/60 border-orange-100/70 dark:border-slate-800 hover:border-orange-300/60 dark:hover:border-orange-600/40",
      title: "Structured Modular Curriculum",
      description: "CBSE, JEE & NEET preparation mapped into clear step-by-step learning.",
    },
    {
      icon: <Award className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />,
      iconBg: "bg-emerald-50/90 dark:bg-emerald-950/50 border-emerald-100 dark:border-emerald-900/40",
      cardBg: "bg-[#FBFCFA] dark:bg-slate-900/60 border-emerald-100/70 dark:border-slate-800 hover:border-emerald-300/60 dark:hover:border-emerald-600/40",
      title: "Scholarship & 1-on-1 Guidance",
      description: "Merit-based support with continuous doubt-solving and personalized guidance.",
    },
  ];

  return (
    <section className="w-full pt-1 md:pt-1.5 pb-3 sm:pb-4 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 md:px-6">
        <div className="relative rounded-[20px] bg-gradient-to-b from-[#FAFCFF] via-white to-[#F8FAFD] dark:from-card dark:via-card dark:to-slate-900/70 border border-slate-200/80 dark:border-slate-800/80 p-5 sm:p-6 md:p-7 lg:p-7.5 shadow-[0_4px_20px_-4px_rgba(11,31,75,0.05)] overflow-hidden">
          
          {/* Subtle top accent highlight */}
          <div className="absolute top-0 left-8 right-8 h-[2px] bg-gradient-to-r from-transparent via-[#FF6B16]/50 to-transparent pointer-events-none" />

          {/* Unified Subtle Background Artwork (Clean, Low Opacity) */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
            {/* Very light cool-blue gradient wash */}
            <div className="absolute top-0 right-1/4 w-[420px] h-[300px] bg-gradient-to-br from-blue-100/25 via-indigo-50/15 to-transparent dark:from-blue-900/10 dark:to-transparent rounded-full blur-3xl" />
            <div className="absolute -bottom-10 -left-10 w-[260px] h-[220px] bg-gradient-to-tr from-orange-100/20 to-transparent dark:from-orange-950/10 dark:to-transparent rounded-full blur-3xl" />

            {/* Very faint dot grid */}
            <svg className="absolute inset-0 w-full h-full opacity-[0.025] dark:opacity-[0.04]" width="100%" height="100%">
              <defs>
                <pattern id="advantage-fine-grid" width="24" height="24" patternUnits="userSpaceOnUse">
                  <circle cx="1.5" cy="1.5" r="1" fill="#0B1F4B" className="dark:fill-white" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#advantage-fine-grid)" />
            </svg>

            {/* 1-2 ultra-subtle curved line arcs */}
            <svg className="absolute top-0 right-0 w-[420px] h-[320px] opacity-[0.05] dark:opacity-[0.07]" viewBox="0 0 420 320" fill="none">
              <path d="M 100 30 C 220 70, 310 150, 400 280" stroke="#1D4ED8" strokeWidth="1.2" strokeDasharray="5 7" />
              <path d="M 190 15 C 290 90, 360 190, 420 310" stroke="#FF6B16" strokeWidth="1" />
            </svg>
          </div>

          {/* MAIN EDITORIAL GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center relative z-10">
            
            {/* LEFT CONTENT COLUMN (ANCHOR) */}
            <div className="lg:col-span-7 xl:col-span-8 flex flex-col items-start justify-start text-left">
              
              {/* Compact Premium Eyebrow Label */}
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10.5px] sm:text-[11px] font-bold uppercase tracking-wider bg-orange-50/70 dark:bg-orange-950/25 text-[#FF6B16] border border-orange-200/50 dark:border-orange-900/30">
                <Sparkles className="w-3 h-3 text-[#FF6B16] shrink-0" />
                <span>The IDL Advantage 2026–27</span>
              </div>

              {/* Main Heading: Strongest visual anchor */}
              <h2 className="mt-2 mb-1 text-2xl sm:text-3xl lg:text-[32px] xl:text-[36px] font-black text-[#0B1F4B] dark:text-white leading-[1.15] tracking-tight">
                What Makes <span className="text-[#FF6B16]">IDL</span> Different?
              </h2>

              {/* Subtitle: Clean & lighter than heading */}
              <p className="text-sm sm:text-[15px] font-normal text-slate-500 dark:text-slate-400 leading-relaxed max-w-[540px]">
                Discover how IDL teaches, supports, and empowers every student to excel.
              </p>

              {/* Three Advantage Cards (Desktop: 3-column row / Mobile: stacked) */}
              <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3 mt-4 sm:mt-4.5">
                {advantagePoints.map((pt, i) => (
                  <div 
                    key={i} 
                    className={`group relative flex flex-col p-3 sm:p-3.5 rounded-[12px] border shadow-[0_2px_8px_-2px_rgba(11,31,75,0.03)] hover:shadow-xs transition-all duration-180 ease-out hover:-translate-y-1 ${pt.cardBg}`}
                  >
                    {/* Small Icon in Micro-Container */}
                    <div className={`w-7 h-7 rounded-[8px] flex items-center justify-center shrink-0 border transition-transform duration-180 group-hover:scale-105 ${pt.iconBg}`}>
                      {pt.icon}
                    </div>

                    {/* Card Title */}
                    <h3 className="mt-2.5 text-[14px] sm:text-[15px] font-bold text-[#0B1F4B] dark:text-white leading-snug tracking-tight">
                      {pt.title}
                    </h3>

                    {/* Card Description: Matched with Technical Support typography */}
                    <p className="mt-1 text-xs sm:text-[13px] text-slate-600 dark:text-slate-400 font-semibold leading-snug">
                      {pt.description}
                    </p>
                  </div>
                ))}
              </div>

              {/* CTA Row */}
              <div className="w-full mt-4 sm:mt-5 flex items-center">
                {/* Primary CTA Button */}
                <Button 
                  asChild 
                  className="group h-10 px-5 sm:px-6 rounded-[8px] bg-[#FF6B16] hover:bg-[#E85D0C] text-white font-bold text-xs sm:text-[13px] shadow-sm hover:shadow-md transition-all border-none inline-flex items-center justify-center gap-1.5 cursor-pointer active:scale-[0.98] shrink-0"
                >
                  <Link href="/brochure.pdf" target="_blank" rel="noopener noreferrer">
                    <span>Download IDL Brochure</span>
                    <ArrowRight className="w-4 h-4 ml-0.5 transition-transform duration-180 ease-out group-hover:translate-x-1" />
                  </Link>
                </Button>
              </div>

            </div>

            {/* RIGHT COLUMN: CLEAN BROCHURE COMPOSITION */}
            <div className="lg:col-span-5 xl:col-span-4 relative w-full h-52 sm:h-60 lg:h-[260px] flex items-center justify-center mt-1 lg:mt-0">
              
              {/* Subtle Soft Blue Halo Blur Backdrop */}
              <div className="absolute inset-4 bg-gradient-to-tr from-blue-100/40 via-indigo-50/25 to-transparent dark:from-blue-900/20 dark:to-transparent rounded-full blur-2xl pointer-events-none" />
              
              {/* Faint Dotted Elliptical Orbit Outline */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30 dark:opacity-15" viewBox="0 0 320 260">
                <ellipse cx="160" cy="130" rx="130" ry="65" transform="rotate(-12 160 130)" fill="none" stroke="#1D4ED8" strokeWidth="1" strokeDasharray="4 6" strokeOpacity="0.25" />
              </svg>

              {/* Brochure Visual Composition with Micro-Float Interaction */}
              <div className="relative w-full h-full flex items-center justify-center transition-transform duration-500 hover:scale-[1.015]">
                <div className="relative w-[90%] sm:w-[94%] h-[90%] sm:h-[94%]">
                  <Image
                    src="/idladv.png"
                    alt="IDL Education Brochure 2026-27"
                    data-ai-hint="education brochure"
                    fill
                    priority
                    className="object-contain drop-shadow-[0_10px_20px_rgba(11,31,75,0.1)] dark:drop-shadow-[0_10px_20px_rgba(0,0,0,0.4)]"
                  />
                </div>
              </div>

            </div>

          </div>
        </div>
      </div>
    </section>
  );
}


