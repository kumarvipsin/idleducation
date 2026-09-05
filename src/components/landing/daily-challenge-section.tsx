'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { ArrowRight, Timer, HelpCircle, CalendarDays, Flame, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
        <section suppressHydrationWarning className="w-full py-3 sm:py-4 md:py-6 bg-white dark:bg-background relative z-20">
            <div className="container mx-auto px-4 md:px-6">
                
                {/* Main Card Container: Cool-white, subtle 1px border, soft multi-layer shadow, inner highlight */}
                <div className="relative rounded-[22px] bg-[#FAFBFD] dark:bg-card/95 p-5 sm:p-7 md:p-8 border border-slate-200/70 dark:border-slate-800/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.95),0_8px_24px_-6px_rgba(16,42,104,0.04),0_2px_6px_-1px_rgba(16,42,104,0.02)] overflow-hidden">
                    
                    {/* Subtle branded top accent line */}
                    <div className="absolute top-0 left-6 right-6 h-[2px] bg-gradient-to-r from-transparent via-[#102A68]/30 dark:via-blue-500/30 to-transparent pointer-events-none" />

                    {/* Subtle micro dot-grid texture across card */}
                    <div 
                        aria-hidden="true" 
                        className="pointer-events-none absolute inset-0 opacity-[0.025] dark:opacity-[0.04]"
                        style={{
                            backgroundImage: `radial-gradient(#102A68 0.75px, transparent 0.75px)`,
                            backgroundSize: '14px 14px'
                        }}
                    />

                    {/* Very soft ambient brand depth */}
                    <div className="absolute top-0 right-1/4 w-80 h-32 bg-blue-500/[0.025] blur-3xl rounded-full pointer-events-none" />
                    <div className="absolute bottom-0 left-10 w-72 h-32 bg-[#102A68]/[0.02] blur-3xl rounded-full pointer-events-none" />

                    {/* Faint academic marks (Very low prominence so student artwork dominates) */}
                    <span className="absolute top-4 left-[38%] text-base font-serif text-[#102A68] select-none pointer-events-none opacity-[0.02]">∑</span>
                    <span className="absolute bottom-4 left-[28%] text-sm font-serif text-[#102A68] select-none pointer-events-none opacity-[0.02]">π</span>
                    <span className="absolute top-1/2 left-[48%] text-sm font-serif text-[#102A68] select-none pointer-events-none opacity-[0.018]">∫</span>
                    <span className="absolute bottom-8 right-8 text-base font-serif text-[#102A68] select-none pointer-events-none opacity-[0.02]">√x</span>

                    {/* ============================================================ */}
                    {/* DESKTOP COMPOSITION (Left: Content, Right: Illustration)    */}
                    {/* ============================================================ */}
                    <div className="hidden md:grid md:grid-cols-12 md:gap-6 lg:gap-8 items-center relative z-10">
                        
                        {/* Left Column: Label -> Heading -> Refined Chips -> Streak Line -> CTA */}
                        <div className="md:col-span-7 flex flex-col items-start text-left max-w-[530px]">
                            
                            {/* 1. Outlined Pill Label with Sparkles Accent */}
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200/60 dark:border-blue-800/50 shadow-2xs text-[#102A68] dark:text-blue-200 text-[10.5px] sm:text-[11px] font-bold tracking-wider uppercase mb-3">
                                <Sparkles className="w-3 h-3 text-[#FF6B16]" />
                                <span>TODAY&apos;S CHALLENGE</span>
                            </div>

                            {/* 2. Main Heading: Tighter leading & clean navy-to-blue transition */}
                            <h2 className="text-2xl sm:text-3xl lg:text-[32px] xl:text-[34px] font-extrabold text-[#0B1F4B] dark:text-white leading-[1.18] tracking-tight mb-3.5 sm:mb-4">
                                Can You Solve It in{' '}
                                <span className="text-[#1D4ED8] dark:text-blue-400">60 Seconds</span>?
                            </h2>

                            {/* 3. Refined Information Chips: Compact, softer borders & lightweight tactile shapes */}
                            <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 mb-3 sm:mb-3.5">
                                {/* 5 Questions */}
                                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1 rounded-lg bg-white/80 dark:bg-slate-800/70 border border-slate-200/70 dark:border-slate-700/60 shadow-2xs">
                                    <div className="w-5 h-5 rounded-md bg-blue-50/90 dark:bg-blue-950/60 border border-blue-200/50 dark:border-blue-800/40 flex items-center justify-center shrink-0">
                                        <HelpCircle className="w-3 h-3 text-[#1D4ED8] dark:text-blue-400 stroke-[2]" />
                                    </div>
                                    <span className="text-[11.5px] sm:text-xs font-semibold text-slate-700 dark:text-slate-200">5 Questions</span>
                                </div>

                                {/* 60 Sec Each */}
                                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1 rounded-lg bg-white/80 dark:bg-slate-800/70 border border-slate-200/70 dark:border-slate-700/60 shadow-2xs">
                                    <div className="w-5 h-5 rounded-md bg-orange-50/90 dark:bg-orange-950/60 border border-orange-200/50 dark:border-orange-800/40 flex items-center justify-center shrink-0">
                                        <Timer className="w-3 h-3 text-[#FF6B16] dark:text-orange-400 stroke-[2]" />
                                    </div>
                                    <span className="text-[11.5px] sm:text-xs font-semibold text-slate-700 dark:text-slate-200">60 Sec Each</span>
                                </div>

                                {/* Every Day */}
                                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1 rounded-lg bg-white/80 dark:bg-slate-800/70 border border-slate-200/70 dark:border-slate-700/60 shadow-2xs">
                                    <div className="w-5 h-5 rounded-md bg-emerald-50/90 dark:bg-emerald-950/60 border border-emerald-200/50 dark:border-emerald-800/40 flex items-center justify-center shrink-0">
                                        <CalendarDays className="w-3 h-3 text-emerald-600 dark:text-emerald-400 stroke-[2]" />
                                    </div>
                                    <span className="text-[11.5px] sm:text-xs font-semibold text-slate-700 dark:text-slate-200">Every Day</span>
                                </div>
                            </div>

                            {/* 4. Supporting Streak Line with Subtle Flame Accent */}
                            <div className="flex items-center gap-2.5 mb-4 sm:mb-5">
                                <div className="w-6 h-6 rounded-md bg-orange-50/90 dark:bg-orange-950/50 border border-orange-200/60 dark:border-orange-900/50 flex items-center justify-center shrink-0 shadow-2xs">
                                    <Flame className="w-3.5 h-3.5 text-[#FF6B16] fill-[#FF6B16]/20 stroke-[2]" />
                                </div>
                                <p className="text-sm md:text-base font-semibold text-slate-600 dark:text-slate-400 leading-snug">
                                    Complete today&apos;s challenge &amp; keep your streak alive
                                </p>
                            </div>

                            {/* 5. Refined Primary CTA: 2px lift, subtle shadow, 3px arrow move */}
                            <div>
                                <Button
                                    onClick={handleStartChallenge}
                                    className="h-11 px-6 sm:px-7 rounded-[8px] bg-[#102A68] hover:bg-[#0c2152] text-white font-bold text-sm shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-180 ease-out border-none flex items-center gap-2 group cursor-pointer"
                                >
                                    <span>START CHALLENGE</span>
                                    <ArrowRight className="w-4 h-4 transition-transform duration-180 ease-out group-hover:translate-x-[3px]" />
                                </Button>
                            </div>
                        </div>

                        {/* Right Column: Illustration with integrated 60 SEC badge and subtle 6s float */}
                        <div className="md:col-span-5 relative flex items-center justify-center">
                            
                            {/* Integrated 60 SEC Badge */}
                            <div className="absolute top-1 right-3 lg:right-5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-xs border border-blue-200/70 dark:border-blue-800/60 shadow-xs text-[#102A68] dark:text-blue-200 z-10 select-none">
                                <div className="w-3.5 h-3.5 rounded-full bg-orange-500/10 flex items-center justify-center shrink-0">
                                    <Timer className="w-2.5 h-2.5 text-[#FF6B16]" />
                                </div>
                                <span className="text-[10px] font-extrabold tracking-wider uppercase">60 SEC</span>
                            </div>

                            {/* Student solving quiz illustration (Focal Point) */}
                            <div 
                                className="relative w-full h-56 sm:h-64 lg:h-72 flex items-center justify-center"
                                style={{ animation: 'dc-float 6s ease-in-out infinite' }}
                            >
                                <Image
                                    src="/quiz.png"
                                    alt="Daily Quiz Challenge - Student taking quiz"
                                    fill
                                    className="object-contain"
                                    priority
                                />
                            </div>
                        </div>
                    </div>

                    {/* ============================================================ */}
                    {/* MOBILE COMPOSITION                                           */}
                    {/* ============================================================ */}
                    <div className="flex flex-col md:hidden text-left space-y-3 relative z-10">
                        
                        {/* 1. Label with Sparkles */}
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200/60 dark:border-blue-800/50 shadow-2xs text-[#102A68] dark:text-blue-200 text-[10px] font-bold tracking-wider uppercase w-fit">
                            <Sparkles className="w-3 h-3 text-[#FF6B16]" />
                            <span>TODAY&apos;S CHALLENGE</span>
                        </div>

                        {/* 2. Heading with clean intentional wrap */}
                        <h2 className="text-xl min-[360px]:text-[22px] sm:text-2xl font-extrabold text-[#0B1F4B] dark:text-white leading-[1.2] tracking-tight">
                            Can You Solve It in{' '}
                            <span className="text-[#1D4ED8] dark:text-blue-400">60 Seconds</span>?
                        </h2>

                        {/* 3. Three Refined Info Chips */}
                        <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/80 dark:bg-slate-800/70 border border-slate-200/70 dark:border-slate-700/60 shadow-2xs">
                                <div className="w-4.5 h-4.5 rounded-md bg-blue-50/90 dark:bg-blue-950/60 border border-blue-200/50 dark:border-blue-800/40 flex items-center justify-center shrink-0">
                                    <HelpCircle className="w-2.5 h-2.5 text-[#1D4ED8] dark:text-blue-400 stroke-[2]" />
                                </div>
                                <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-200">5 Questions</span>
                            </div>

                            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/80 dark:bg-slate-800/70 border border-slate-200/70 dark:border-slate-700/60 shadow-2xs">
                                <div className="w-4.5 h-4.5 rounded-md bg-orange-50/90 dark:bg-orange-950/60 border border-orange-200/50 dark:border-orange-800/40 flex items-center justify-center shrink-0">
                                    <Timer className="w-2.5 h-2.5 text-[#FF6B16] dark:text-orange-400 stroke-[2]" />
                                </div>
                                <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-200">60 Sec Each</span>
                            </div>

                            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/80 dark:bg-slate-800/70 border border-slate-200/70 dark:border-slate-700/60 shadow-2xs">
                                <div className="w-4.5 h-4.5 rounded-md bg-emerald-50/90 dark:bg-emerald-950/60 border border-emerald-200/50 dark:border-emerald-800/40 flex items-center justify-center shrink-0">
                                    <CalendarDays className="w-2.5 h-2.5 text-emerald-600 dark:text-emerald-400 stroke-[2]" />
                                </div>
                                <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-200">Every Day</span>
                            </div>
                        </div>

                        {/* 4. Supporting streak line */}
                        <div className="flex items-center gap-2 pt-0.5">
                            <div className="w-5.5 h-5.5 rounded-md bg-orange-50/90 dark:bg-orange-950/50 border border-orange-200/60 dark:border-orange-900/50 flex items-center justify-center shrink-0 shadow-2xs">
                                <Flame className="w-3 h-3 text-[#FF6B16] fill-[#FF6B16]/20 stroke-[2]" />
                            </div>
                            <p className="text-xs min-[360px]:text-sm font-semibold text-slate-600 dark:text-slate-400 leading-snug">
                                Complete today&apos;s challenge &amp; keep your streak alive
                            </p>
                        </div>

                        {/* 5. Primary CTA */}
                        <div className="pt-1">
                            <Button
                                onClick={handleStartChallenge}
                                className="w-full sm:w-auto h-11 px-6 rounded-[8px] bg-[#102A68] hover:bg-[#0c2152] text-white font-bold text-sm shadow-xs hover:shadow-md transition-all duration-180 ease-out border-none flex items-center justify-center gap-2 group cursor-pointer"
                            >
                                <span>START CHALLENGE</span>
                                <ArrowRight className="w-4 h-4 transition-transform duration-180 ease-out group-hover:translate-x-[3px]" />
                            </Button>
                        </div>

                        {/* 6. Illustration with integrated 60 SEC badge on mobile */}
                        <div className="relative w-full max-w-[320px] sm:max-w-[360px] mx-auto pt-2 pb-1 flex items-center justify-center">
                            {/* Integrated mobile 60 SEC Badge */}
                            <div className="absolute top-0 right-2 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-xs border border-blue-200/70 dark:border-blue-800/60 shadow-xs text-[#102A68] dark:text-blue-200 z-10 select-none">
                                <div className="w-3 h-3 rounded-full bg-orange-500/10 flex items-center justify-center shrink-0">
                                    <Timer className="w-2 h-2 text-[#FF6B16]" />
                                </div>
                                <span className="text-[9px] font-extrabold tracking-wider uppercase">60 SEC</span>
                            </div>

                            <div 
                                className="relative w-full h-48 min-[360px]:h-52 sm:h-60 flex items-center justify-center"
                                style={{ animation: 'dc-float 6s ease-in-out infinite' }}
                            >
                                <Image
                                    src="/quiz.png"
                                    alt="Daily Quiz Challenge - Student taking quiz"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* Scoped keyframe for subtle 6-second float of the illustration */}
            <style>{`
                @keyframes dc-float {
                    0%, 100% {
                        transform: translateY(0px);
                    }
                    50% {
                        transform: translateY(-2.5px);
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
