'use client';

import { Button } from "@/components/ui/button";
import { ArrowRight, GraduationCap, Layers, HeartHandshake } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function DiscoverAdvantage() {
  return (
    <section className="w-full pt-2 md:pt-3 pb-5 sm:pb-6 md:pb-7 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 md:px-6">
        <div className="rounded-2xl md:rounded-3xl bg-white dark:bg-card border border-slate-200/80 dark:border-border/60 p-4 sm:p-5 md:p-6 lg:p-7 shadow-sm md:shadow-md overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-8 items-center">
            
            {/* LEFT: Heading, One Supporting Line, Compact Benefits Row, CTA */}
            <div className="lg:col-span-7 space-y-3 sm:space-y-4 text-left relative z-10 flex flex-col justify-center">
              {/* Heading */}
              <h2 className="text-2xl sm:text-3xl lg:text-[32px] font-extrabold text-[#0B1F4B] dark:text-white leading-tight tracking-tight">
                What Makes <span className="text-orange-500">IDL</span> Different?
              </h2>

              {/* Single Supporting Line */}
              <p className="text-sm sm:text-base font-medium text-slate-600 dark:text-slate-300 leading-snug">
                Discover how IDL teaches, supports, and helps students grow.
              </p>

              {/* Compact Benefits: Single Row with Small Icons & Short Labels Only */}
              <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 sm:gap-4 lg:gap-5 py-1">
                <div className="inline-flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-orange-50 dark:bg-orange-950/40 text-orange-600 flex items-center justify-center shrink-0 border border-orange-100 dark:border-orange-900/30">
                    <GraduationCap className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs sm:text-[13px] font-bold text-[#0B1F4B] dark:text-white whitespace-nowrap">
                    Expert Faculty
                  </span>
                </div>

                <div className="inline-flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-blue-50 dark:bg-blue-950/40 text-[#1F4FA3] flex items-center justify-center shrink-0 border border-blue-100 dark:border-blue-900/30">
                    <Layers className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs sm:text-[13px] font-bold text-[#0B1F4B] dark:text-white whitespace-nowrap">
                    Structured Learning
                  </span>
                </div>

                <div className="inline-flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100 dark:border-emerald-900/30">
                    <HeartHandshake className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs sm:text-[13px] font-bold text-[#0B1F4B] dark:text-white whitespace-nowrap">
                    Student-First Support
                  </span>
                </div>
              </div>

              {/* CTA Button */}
              <div className="pt-0.5">
                <Button 
                  asChild 
                  className="h-10 sm:h-11 px-5 sm:px-6 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs sm:text-sm shadow-md shadow-orange-500/20 hover:shadow-lg transition-all border-none inline-flex items-center gap-1.5 cursor-pointer"
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
