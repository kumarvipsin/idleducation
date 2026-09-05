'use client';

import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function DiscoverAdvantage() {
  return (
    <section className="w-full pt-2 md:pt-3 pb-5 sm:pb-6 md:pb-7 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 md:px-6">
        <div className="relative rounded-[22px] bg-white dark:bg-card border border-slate-200/80 dark:border-border/60 p-5 sm:p-7 md:p-8 shadow-sm md:shadow-md overflow-hidden">
          {/* Subtle branded top accent line */}
          <div className="absolute top-0 left-6 right-6 h-[2px] bg-gradient-to-r from-transparent via-[#FF6B16]/50 to-transparent pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-8 items-start">
            
            {/* LEFT: Heading, One Supporting Line, CTA (Top-Left Aligned) */}
            <div className="lg:col-span-7 space-y-3.5 sm:space-y-4 text-left relative z-10 flex flex-col items-start justify-start">
              {/* Branded Pill Badge */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-orange-50 dark:bg-orange-950/30 text-[#FF6B16] border border-orange-200/60 dark:border-orange-900/40">
                <Sparkles className="w-3 h-3 text-[#FF6B16]" />
                <span>The IDL Advantage 2026-27</span>
              </div>

              {/* Heading: Matching text size and color of Scholarship heading */}
              <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[#0B1F4B] dark:text-white leading-[1.25] tracking-tight">
                What Makes <span className="text-[#FF6B16]">IDL</span> Different?
              </h2>

              {/* Single Supporting Line */}
              <p className="text-sm md:text-base font-bold text-slate-600 dark:text-slate-400 leading-snug">
                Discover how IDL teaches, supports, and helps students grow.
              </p>

              {/* CTA Button */}
              <div className="pt-0.5">
                <Button 
                  asChild 
                  className="h-10 sm:h-11 px-5 sm:px-6 rounded-[8px] bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs sm:text-sm shadow-md shadow-orange-500/20 hover:shadow-lg transition-all border-none inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Link href="/brochure.pdf" target="_blank" rel="noopener noreferrer">
                    <span>Download IDL Brochure</span>
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Link>
                </Button>
              </div>
            </div>

            {/* RIGHT: Large IDL Brochure visual with subtle soft pale-blue glow */}
            <div className="lg:col-span-5 relative w-full h-56 sm:h-64 md:h-72 lg:h-[310px] flex items-center justify-center">
              {/* Subtle soft pale-blue/navy glow behind brochure only */}
              <div className="absolute inset-2 sm:inset-4 bg-gradient-to-br from-blue-100/40 via-indigo-50/20 to-transparent dark:from-blue-900/20 dark:to-transparent rounded-full blur-2xl pointer-events-none" />
              
              <div className="relative w-full h-full">
                <Image
                  src="/idladv.png"
                  alt="IDL Education Brochure"
                  data-ai-hint="education brochure"
                  fill
                  className="object-contain drop-shadow-lg transition-transform duration-300 hover:scale-[1.02]"
                />
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
