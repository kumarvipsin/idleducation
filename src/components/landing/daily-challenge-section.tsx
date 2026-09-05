'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { ArrowRight, Timer } from 'lucide-react';
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
                
                {/* Main Card Container: Cool-white, refined 1px border, soft multi-layer shadow, matching scholarship card dimensions */}
                <div className="relative rounded-[22px] bg-[#FAFBFD] dark:bg-card/95 p-5 sm:p-7 md:p-8 border border-slate-200/80 dark:border-slate-800 shadow-[inset_0_1px_1px_rgba(255,255,255,0.95),0_10px_30px_-4px_rgba(16,42,104,0.05),0_2px_8px_-1px_rgba(16,42,104,0.02)] overflow-hidden">
                    
                    {/* Subtle micro dot-grid texture across card */}
                    <div 
                        aria-hidden="true" 
                        className="pointer-events-none absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
                        style={{
                            backgroundImage: `radial-gradient(#102A68 0.75px, transparent 0.75px)`,
                            backgroundSize: '14px 14px'
                        }}
                    />

                    {/* Subtle top ambient brand glow */}
                    <div className="absolute top-0 right-1/4 w-80 h-32 bg-blue-500/[0.03] blur-2xl rounded-full pointer-events-none" />
                    <div className="absolute bottom-0 left-10 w-72 h-32 bg-[#102A68]/[0.025] blur-2xl rounded-full pointer-events-none" />

                    {/* Faint academic symbols in background (Extremely low opacity) */}
                    <span className="absolute top-4 left-[38%] text-lg font-serif text-[#102A68] select-none pointer-events-none opacity-[0.04]">∑</span>
                    <span className="absolute bottom-4 left-[28%] text-base font-serif text-[#102A68] select-none pointer-events-none opacity-[0.035]">π</span>
                    <span className="absolute top-1/2 left-[48%] text-base font-serif text-[#102A68] select-none pointer-events-none opacity-[0.03]">∫</span>
                    <span className="absolute bottom-8 right-8 text-lg font-serif text-[#102A68] select-none pointer-events-none opacity-[0.04]">√x</span>

                    {/* ============================================================ */}
                    {/* DESKTOP COMPOSITION (Left: Content, Right: Illustration)    */}
                    {/* ============================================================ */}
                    <div className="hidden md:grid md:grid-cols-12 md:gap-6 lg:gap-8 items-center relative z-10">
                        
                        {/* Left Column: Label -> Heading -> Meta chips -> Streak Line -> CTA */}
                        <div className="md:col-span-7 flex flex-col items-start text-left space-y-3 sm:space-y-3.5 lg:space-y-4 max-w-[520px]">
                            
                            {/* 1. Outlined Pill Label with Orange Accent */}
                            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/90 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60 shadow-2xs text-[#102A68] dark:text-blue-200 text-[10.5px] sm:text-[11px] font-bold tracking-wider">
                                <span className="w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0" />
                                <span>TODAY&apos;S CHALLENGE</span>
                            </div>

                            {/* 2. Main Heading: Bold Anchor with Single Blue Accent */}
                            <h2 className="text-2xl sm:text-3xl lg:text-[32px] xl:text-[34px] font-extrabold text-[#0B1F4B] dark:text-white leading-[1.2] tracking-tight">
                                Can You Solve It in{' '}
                                <span className="text-[#1D4ED8] dark:text-blue-400">60 Seconds</span>?
                            </h2>

                            {/* 3. Minimal Info Chips */}
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="inline-flex items-center px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-[11px] sm:text-xs font-semibold bg-blue-50/85 dark:bg-blue-950/40 text-[#1F4FA3] dark:text-blue-300 border border-blue-200/60 dark:border-blue-900/40 shadow-2xs">
                                    5 Questions
                                </span>
                                <span className="inline-flex items-center px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-[11px] sm:text-xs font-semibold bg-blue-50/85 dark:bg-blue-950/40 text-[#1F4FA3] dark:text-blue-300 border border-blue-200/60 dark:border-blue-900/40 shadow-2xs">
                                    60 Sec Each
                                </span>
                                <span className="inline-flex items-center px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-[11px] sm:text-xs font-semibold bg-blue-50/85 dark:bg-blue-950/40 text-[#1F4FA3] dark:text-blue-300 border border-blue-200/60 dark:border-blue-900/40 shadow-2xs">
                                    Every Day
                                </span>
                            </div>

                            {/* 4. Supporting Streak Line */}
                            <p className="text-xs sm:text-[13px] font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1.5 pt-0.5">
                                <span className="text-sm shrink-0">🔥</span>
                                <span>Complete today&apos;s challenge &amp; keep your streak alive</span>
                            </p>

                            {/* 5. Strong Primary CTA */}
                            <div className="pt-1">
                                <Button
                                    onClick={handleStartChallenge}
                                    className="h-11 px-6 sm:px-7 rounded-[12px] bg-[#102A68] hover:bg-[#0c2152] text-white font-bold text-sm shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-180 ease-out border-none flex items-center gap-2 group cursor-pointer"
                                >
                                    <span>START CHALLENGE</span>
                                    <ArrowRight className="w-4 h-4 transition-transform duration-180 ease-out group-hover:translate-x-1" />
                                </Button>
                            </div>
                        </div>

                        {/* Right Column: Illustration + Academic Halo + Floating 60 SEC Badge */}
                        <div className="md:col-span-5 relative flex items-center justify-center">
                            
                            {/* Academic halo behind illustration */}
                            <div className="absolute w-56 h-56 sm:w-64 sm:h-64 lg:w-72 lg:h-72 rounded-full border border-blue-200/35 dark:border-blue-900/25 pointer-events-none" />
                            <div className="absolute w-44 h-44 sm:w-52 sm:h-52 lg:w-60 lg:h-60 rounded-full border border-dashed border-[#102A68]/15 dark:border-blue-700/20 pointer-events-none" />

                            {/* Floating 60 SEC Badge near top-right of illustration */}
                            <div className="absolute -top-1.5 right-3 lg:right-5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-xs border border-blue-200/80 dark:border-blue-900/60 shadow-xs text-[#102A68] dark:text-blue-300 z-10">
                                <Timer className="w-3.5 h-3.5 text-[#102A68] dark:text-blue-400 shrink-0" />
                                <span className="text-[10px] font-extrabold tracking-wider uppercase">60 SEC</span>
                            </div>

                            {/* Student solving problem illustration */}
                            <div className="relative w-full h-52 sm:h-60 lg:h-68 flex items-center justify-center">
                                <Image
                                    src="/idl_daily_challenge.png"
                                    alt="Today's Challenge - Student solving problem challenge"
                                    fill
                                    className="object-contain"
                                    priority
                                />
                            </div>
                        </div>
                    </div>

                    {/* ============================================================ */}
                    {/* MOBILE COMPOSITION:                                          */}
                    {/* Label -> Heading -> Meta chips -> Streak -> CTA -> Art below */}
                    {/* ============================================================ */}
                    <div className="flex flex-col md:hidden text-left space-y-3 relative z-10">
                        
                        {/* 1. Label */}
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/90 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60 shadow-2xs text-[#102A68] dark:text-blue-200 text-[10px] font-bold tracking-wider w-fit">
                            <span className="w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0" />
                            <span>TODAY&apos;S CHALLENGE</span>
                        </div>

                        {/* 2. Heading with clean intentional wrap */}
                        <h2 className="text-xl min-[360px]:text-[22px] sm:text-2xl font-extrabold text-[#0B1F4B] dark:text-white leading-tight tracking-tight">
                            Can You Solve It in{' '}
                            <span className="text-[#1D4ED8] dark:text-blue-400">60 Seconds</span>?
                        </h2>

                        {/* 3. Three Compact Info Chips */}
                        <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50/90 dark:bg-blue-950/40 text-[#1F4FA3] dark:text-blue-300 border border-blue-200/60 dark:border-blue-900/40 shadow-2xs">
                                5 Questions
                            </span>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50/90 dark:bg-blue-950/40 text-[#1F4FA3] dark:text-blue-300 border border-blue-200/60 dark:border-blue-900/40 shadow-2xs">
                                60 Sec Each
                            </span>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50/90 dark:bg-blue-950/40 text-[#1F4FA3] dark:text-blue-300 border border-blue-200/60 dark:border-blue-900/40 shadow-2xs">
                                Every Day
                            </span>
                        </div>

                        {/* 4. Supporting streak line */}
                        <p className="text-[11.5px] sm:text-xs font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1.5 pt-0.5">
                            <span className="text-sm shrink-0">🔥</span>
                            <span>Complete today&apos;s challenge &amp; keep your streak alive</span>
                        </p>

                        {/* 5. Primary CTA placed before illustration for immediate action */}
                        <div className="pt-1">
                            <Button
                                onClick={handleStartChallenge}
                                className="w-full sm:w-auto h-11 px-6 rounded-[12px] bg-[#102A68] hover:bg-[#0c2152] text-white font-bold text-sm shadow-sm hover:shadow-md transition-all duration-180 ease-out border-none flex items-center justify-center gap-2 group cursor-pointer"
                            >
                                <span>START CHALLENGE</span>
                                <ArrowRight className="w-4 h-4 transition-transform duration-180 ease-out group-hover:translate-x-1" />
                            </Button>
                        </div>

                        {/* 6. Illustration placed below textual content on mobile */}
                        <div className="relative w-full max-w-[260px] mx-auto pt-3 pb-1 flex items-center justify-center">
                            {/* Academic halo */}
                            <div className="absolute w-44 h-44 rounded-full border border-dashed border-[#102A68]/15 pointer-events-none" />
                            
                            {/* 60 SEC Badge over illustration */}
                            <div className="absolute top-1 right-2 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-xs border border-blue-200/80 dark:border-blue-900/60 shadow-xs text-[#102A68] dark:text-blue-300 z-10">
                                <Timer className="w-3 h-3 text-[#102A68] dark:text-blue-400" />
                                <span className="text-[9px] font-extrabold tracking-wider uppercase">60 SEC</span>
                            </div>

                            {/* Transparent student illustration */}
                            <div className="relative w-full h-40 flex items-center justify-center">
                                <Image
                                    src="/idl_daily_challenge.png"
                                    alt="Today's Challenge - Student solving problem challenge"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* Dedicated IDL Daily Challenge Modal Experience */}
            <DailyChallengeModal 
                isOpen={isChallengeOpen} 
                onOpenChange={setIsChallengeOpen} 
            />
        </section>
    );
}
