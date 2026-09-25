'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { ArrowRight, Sparkles } from 'lucide-react';
import { DailyChallengeModal } from './daily-challenge-modal';
import { getDailyChallengeState, DailyChallengeState } from '@/lib/daily-challenge-storage';

export function DailyChallengeSection() {
    const [isChallengeOpen, setIsChallengeOpen] = useState(false);
    const [, setChallengeState] = useState<DailyChallengeState | null>(null);

    useEffect(() => {
        setChallengeState(getDailyChallengeState());
    }, [isChallengeOpen]);

    const handleStartChallenge = () => {
        setIsChallengeOpen(true);
    };

    return (
        <section suppressHydrationWarning className="w-full py-2.5 sm:py-3.5 md:py-6 bg-white dark:bg-background relative z-20">
            <div className="container mx-auto px-4 sm:px-5 md:px-6 max-w-7xl">
                
                {/* ── Feature Container: Clean, breathable, minimal light backdrop, no heavy ad/banner feel ── */}
                <div className="relative rounded-[22px] sm:rounded-[26px] lg:rounded-[28px] bg-[#F7FAFE] dark:bg-slate-900/60 border border-[#E1EDF9] dark:border-slate-800/80 px-4 pt-4 pb-1.5 sm:px-5 sm:pt-4.5 sm:pb-2 md:px-8 md:py-6 lg:px-10 lg:py-7 xl:px-11 xl:py-8 overflow-hidden shadow-[0_2px_12px_-4px_rgba(6,43,103,0.03)]">
                    
                    {/* Very subtle ambient coolness in corners */}
                    <div className="pointer-events-none absolute -top-24 -left-16 w-72 h-72 bg-blue-400/[0.04] rounded-full blur-3xl" />
                    <div className="pointer-events-none absolute -bottom-24 right-1/4 w-72 h-72 bg-blue-300/[0.04] rounded-full blur-3xl" />

                    {/* ============================================================ */}
                    {/* DESKTOP LAYOUT (Curiosity-first, balanced 48% / 44% spread)   */}
                    {/* ============================================================ */}
                    <div className="hidden md:grid md:grid-cols-12 md:gap-6 lg:gap-8 items-center relative z-10">
                        
                        {/* Left Column: Label -> Headline -> Metadata -> Curiosity line -> Refined Navy CTA */}
                        <div className="md:col-span-7 lg:col-span-7 flex flex-col items-start text-left">
                            
                            {/* 1. Small Label: TODAY'S CHALLENGE */}
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50/90 dark:bg-blue-950/40 border border-blue-200/70 dark:border-blue-800/50 text-[#062B67] dark:text-blue-300 text-[11px] font-bold tracking-wider uppercase mb-3 select-none">
                                <Sparkles className="w-3.5 h-3.5 text-[#FF5500] fill-[#FF5500]/20" />
                                <span>TODAY&apos;S CHALLENGE</span>
                            </div>

                            {/* 2. Main Headline: Can You Solve It in 60 Seconds? */}
                            <h2 className="text-2xl sm:text-[27px] lg:text-[31px] xl:text-[33px] font-extrabold text-[#0A1E42] dark:text-white leading-[1.2] tracking-tight mb-2.5">
                                Can You Solve It in{' '}
                                <span className="text-[#FF5500]">60 Seconds</span>?
                            </h2>

                            {/* 3. Supporting Line: 5 Questions · 60 Seconds · Every Day */}
                            <p className="text-[13.5px] lg:text-[14px] font-semibold text-[#0E357A] dark:text-blue-300 tracking-wide mb-1.5">
                                5 Questions <span className="text-slate-300 dark:text-slate-600 mx-1.5">·</span> 60 Seconds <span className="text-slate-300 dark:text-slate-600 mx-1.5">·</span> Every Day
                            </p>

                            {/* 4. Short Curiosity Line */}
                            <p className="text-[13px] lg:text-[13.5px] font-medium text-slate-500 dark:text-slate-400 mb-5 leading-normal">
                                Think fast. Beat the clock. Keep your streak alive.
                            </p>

                            {/* 5. Primary CTA: Refined Premium Challenge Button */}
                            <div>
                                <button
                                    type="button"
                                    onClick={handleStartChallenge}
                                    className="group inline-flex items-center gap-2.5 h-[44px] px-6 rounded-[12px] bg-gradient-to-r from-[#FF5500] to-[#FF6E1C] hover:from-[#E64D00] hover:to-[#F05C0F] text-white text-[13.5px] font-bold shadow-[0_4px_14px_rgba(255,85,0,0.28)] hover:shadow-[0_6px_20px_rgba(255,85,0,0.38)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-200 cursor-pointer select-none"
                                >
                                    <span>Take the Challenge</span>
                                    <ArrowRight className="w-4 h-4 stroke-[2.3] text-white transition-transform duration-200 group-hover:translate-x-1" />
                                </button>
                            </div>
                        </div>

                        {/* Right Column: Confident Student Illustration with Subtle Idle Float */}
                        <div className="md:col-span-5 lg:col-span-5 relative flex items-center justify-end">
                            <div 
                                className="relative w-full h-[220px] lg:h-[245px] xl:h-[265px] flex items-center justify-end"
                                style={{ animation: 'dc-float 6s ease-in-out infinite' }}
                            >
                                <Image
                                    src="/quiz1.png"
                                    alt="Today's Challenge - Student taking quick quiz"
                                    fill
                                    className="object-contain object-right"
                                    priority
                                />
                            </div>
                        </div>
                    </div>

                    {/* ============================================================ */}
                    {/* MOBILE LAYOUT (Dedicated, compact, curiosity-driven)          */}
                    {/* ============================================================ */}
                    <div className="flex flex-col md:hidden text-left space-y-2 relative z-10">
                        
                        {/* 1. Small Label */}
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50/90 dark:bg-blue-950/40 border border-blue-200/70 dark:border-blue-800/50 text-[#062B67] dark:text-blue-300 text-[10.5px] font-bold tracking-wider uppercase w-fit select-none">
                            <Sparkles className="w-3 h-3 text-[#FF5500] fill-[#FF5500]/20" />
                            <span>TODAY&apos;S CHALLENGE</span>
                        </div>

                        {/* 2. Main Headline: Natural 2 lines, clean & not oversized */}
                        <h2 className="text-[20px] min-[360px]:text-[21px] font-extrabold text-[#0A1E42] dark:text-white leading-[1.24] tracking-tight">
                            Can You Solve It in{' '}
                            <span className="text-[#FF5500]">60 Seconds</span>?
                        </h2>

                        {/* 3. Supporting Line */}
                        <p className="text-[12.5px] font-semibold text-[#0E357A] dark:text-blue-300 tracking-wide">
                            5 Questions <span className="text-slate-300 dark:text-slate-600 mx-1">·</span> 60 Seconds <span className="text-slate-300 dark:text-slate-600 mx-1">·</span> Every Day
                        </p>

                        {/* 4. Short Curiosity Line */}
                        <p className="text-[12px] font-medium text-slate-500 dark:text-slate-400 leading-snug">
                            Think fast. Beat the clock. Keep your streak alive.
                        </p>

                        {/* 5. Compact CTA (Content-width, premium vibrant orange challenge button) */}
                        <div className="pt-0.5">
                            <button
                                type="button"
                                onClick={handleStartChallenge}
                                className="group inline-flex items-center gap-2 h-[40px] px-5 rounded-[11px] bg-gradient-to-r from-[#FF5500] to-[#FF6E1C] hover:from-[#E64D00] hover:to-[#F05C0F] text-white text-[13px] font-bold shadow-[0_3px_12px_rgba(255,85,0,0.26)] active:scale-[0.98] transition-all duration-200 cursor-pointer w-fit select-none"
                            >
                                <span>Take the Challenge</span>
                                <ArrowRight className="w-3.5 h-3.5 stroke-[2.3] text-white transition-transform duration-200 group-hover:translate-x-1" />
                            </button>
                        </div>

                        {/* 6. Integrated Illustration: Prominent, student + laptop + 60s timer sharp, zero bottom dead space */}
                        <div className="relative w-full max-w-[290px] min-[360px]:max-w-[320px] mx-auto mt-0.5 flex items-center justify-center -mb-2">
                            <div 
                                className="relative w-full h-[175px] min-[360px]:h-[195px] flex items-center justify-center"
                                style={{ animation: 'dc-float 6s ease-in-out infinite' }}
                            >
                                <Image
                                    src="/quiz1.png"
                                    alt="Today's Challenge - Student taking quick quiz"
                                    fill
                                    className="object-contain"
                                    priority
                                />
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* Subtle floating animation */}
            <style>{`
                @keyframes dc-float {
                    0%, 100% {
                        transform: translateY(0px);
                    }
                    50% {
                        transform: translateY(-3px);
                    }
                }
            `}</style>

            {/* Dedicated IDL Daily Challenge Modal Experience */}
            <DailyChallengeModal 
                isOpen={isChallengeOpen} 
                onOpenChange={setIsChallengeOpen} 
            />
        </section>
    );
}
