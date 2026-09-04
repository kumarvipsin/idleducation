'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { ArrowRight, Timer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DailyChallengeModal } from './daily-challenge-modal';
import { hasCompletedToday, getDailyChallengeState, DailyChallengeState } from '@/lib/daily-challenge-storage';

export function DailyChallengeSection() {
    const [isChallengeOpen, setIsChallengeOpen] = useState(false);
    const [challengeState, setChallengeState] = useState<DailyChallengeState | null>(null);

    useEffect(() => {
        setChallengeState(getDailyChallengeState());
    }, [isChallengeOpen]);

    const handleStartChallenge = () => {
        setIsChallengeOpen(true);
    };

    return (
        <section className="w-full pt-4 sm:pt-6 md:pt-11 pb-2 sm:pb-3 bg-white dark:bg-background relative z-20">
            <div className="container mx-auto px-4 md:px-6">
                <div className="relative rounded-[22px] bg-white dark:bg-card p-5 sm:p-7 md:p-8 lg:p-9 border border-slate-200/80 dark:border-border/60 shadow-sm md:shadow-md overflow-hidden">
                    {/* Subtle branded top accent line */}
                    <div className="absolute top-0 left-6 right-6 h-[2px] bg-gradient-to-r from-transparent via-[#1F4FA3]/40 to-transparent pointer-events-none" />

                    {/* Soft pale-blue radial glow */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-[radial-gradient(circle_at_top_right,rgba(31,79,163,0.06),transparent_70%)] pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-80 h-80 bg-[radial-gradient(circle_at_bottom_left,rgba(31,79,163,0.04),transparent_70%)] pointer-events-none" />

                    {/* Tiny academic dots */}
                    <div className="absolute inset-0 bg-dot-pattern opacity-25 pointer-events-none" />

                    {/* Minimal mathematical/academic decorative accents (subtle, low opacity) */}
                    <span className="absolute top-4 left-1/3 text-xl font-serif text-[#1F4FA3] select-none pointer-events-none opacity-[0.08]">∑</span>
                    <span className="absolute bottom-6 left-1/4 text-lg font-serif text-[#1F4FA3] select-none pointer-events-none opacity-[0.07]">π</span>
                    <span className="absolute top-1/2 right-6 text-xl font-serif text-[#1F4FA3] select-none pointer-events-none opacity-[0.07]">√x</span>

                    {/* ============================================================ */}
                    {/* DESKTOP COMPOSITION (Two-Column Layout)                     */}
                    {/* ============================================================ */}
                    <div className="hidden md:grid md:grid-cols-12 md:gap-8 lg:gap-10 items-center relative z-10">
                        {/* Left: badge + heading + three info pills + motivation line + CTA */}
                        <div className="md:col-span-7 flex flex-col items-start text-left space-y-4 lg:space-y-4.5">
                            {/* Small Label */}
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-blue-50 dark:bg-blue-950/40 text-[#1F4FA3] dark:text-blue-400 border border-blue-200/60 dark:border-blue-900/40">
                                <span>🎯 TODAY&apos;S CHALLENGE</span>
                            </div>

                            {/* Main Heading (Strongest Visual Focus) */}
                            <h2 className="text-2xl sm:text-3xl lg:text-[34px] font-extrabold text-[#0B1F4B] dark:text-white leading-[1.2] tracking-tight">
                                Can You Solve It in 60 Seconds?
                            </h2>

                            {/* Three Compact Premium Info Pills */}
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-blue-50 dark:bg-blue-950/40 text-[#1F4FA3] dark:text-blue-300 border border-blue-200/70 dark:border-blue-900/40">
                                    5 Questions
                                </span>
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-blue-50 dark:bg-blue-950/40 text-[#1F4FA3] dark:text-blue-300 border border-blue-200/70 dark:border-blue-900/40">
                                    60 Sec Each
                                </span>
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-blue-50 dark:bg-blue-950/40 text-[#1F4FA3] dark:text-blue-300 border border-blue-200/70 dark:border-blue-900/40">
                                    Every Day
                                </span>
                            </div>

                            {/* Streak Motivation Line */}
                            <p className="text-xs sm:text-[13px] font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-1.5 pt-0.5">
                                <span className="text-sm">🔥</span>
                                <span>Complete today&apos;s challenge &amp; keep your streak alive</span>
                            </p>

                            {/* CTA */}
                            <div className="pt-2">
                                <Button
                                    onClick={handleStartChallenge}
                                    className="h-11 px-6 sm:px-7 rounded-[12px] bg-[#1F4FA3] hover:bg-[#163b7d] text-white font-bold text-sm shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 border-none flex items-center gap-2 group cursor-pointer"
                                >
                                    <span>START CHALLENGE</span>
                                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                </Button>
                            </div>
                        </div>

                        {/* Right: Transparent illustration + subtle timer visual cue */}
                        <div className="md:col-span-5 relative flex items-center justify-center">
                            {/* Subtle circular timer-inspired graphics */}
                            <div className="absolute w-56 h-56 sm:w-64 sm:h-64 lg:w-72 lg:h-72 rounded-full border-[1.5px] border-dashed border-[#1F4FA3]/15 pointer-events-none" />
                            <div className="absolute w-44 h-44 sm:w-52 sm:h-52 lg:w-60 lg:h-60 rounded-full border border-blue-200/30 dark:border-blue-900/20 pointer-events-none" />

                            {/* Timer Visual Cue Badge */}
                            <div className="absolute -top-1 right-2 lg:right-4 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-xs border border-blue-200/80 dark:border-blue-900/60 shadow-xs text-[#1F4FA3] dark:text-blue-300 z-10">
                                <Timer className="w-3.5 h-3.5 text-[#1F4FA3] dark:text-blue-400" />
                                <span className="text-[10px] font-extrabold tracking-wider uppercase">60 SEC</span>
                            </div>

                            {/* Seamless Transparent Illustration (Zero outline, blends 100% with card background) */}
                            <div className="relative w-full h-56 sm:h-64 lg:h-72 flex items-center justify-center">
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
                    {/* MOBILE COMPOSITION (Heading -> Illustration -> Info -> Motivation -> CTA) */}
                    {/* ============================================================ */}
                    <div className="flex flex-col md:hidden text-left space-y-3.5 relative z-10">
                        {/* 1. Badge & Heading */}
                        <div className="space-y-2">
                            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-50 dark:bg-blue-950/40 text-[#1F4FA3] dark:text-blue-400 border border-blue-200/60 dark:border-blue-900/40">
                                <span>🎯 TODAY&apos;S CHALLENGE</span>
                            </div>
                            <h2 className="text-xl sm:text-2xl font-extrabold text-[#0B1F4B] dark:text-white leading-tight tracking-tight">
                                Can You Solve It in 60 Seconds?
                            </h2>
                        </div>

                        {/* 2. Illustration Second (Seamless, transparent, zero outline) */}
                        <div className="relative w-full max-w-[280px] mx-auto py-2 flex items-center justify-center">
                            {/* Subtle timer ring */}
                            <div className="absolute w-48 h-48 rounded-full border border-dashed border-[#1F4FA3]/15 pointer-events-none" />
                            
                            {/* Timer Cue Badge */}
                            <div className="absolute top-0 right-1 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-xs border border-blue-200/80 dark:border-blue-900/60 shadow-xs text-[#1F4FA3] dark:text-blue-300 z-10">
                                <Timer className="w-3 h-3 text-[#1F4FA3] dark:text-blue-400" />
                                <span className="text-[9px] font-extrabold tracking-wider uppercase">60 SEC</span>
                            </div>

                            {/* Seamless Transparent Illustration */}
                            <div className="relative w-full h-44 flex items-center justify-center">
                                <Image
                                    src="/idl_daily_challenge.png"
                                    alt="Today's Challenge - Student solving problem challenge"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                        </div>

                        {/* 3. Three Compact Premium Info Pills */}
                        <div className="flex flex-wrap items-center gap-1.5 pt-1">
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-50 dark:bg-blue-950/40 text-[#1F4FA3] dark:text-blue-300 border border-blue-200/70 dark:border-blue-900/40">
                                5 Questions
                            </span>
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-50 dark:bg-blue-950/40 text-[#1F4FA3] dark:text-blue-300 border border-blue-200/70 dark:border-blue-900/40">
                                60 Sec Each
                            </span>
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-50 dark:bg-blue-950/40 text-[#1F4FA3] dark:text-blue-300 border border-blue-200/70 dark:border-blue-900/40">
                                Every Day
                            </span>
                        </div>

                        {/* 4. Streak Motivation Line */}
                        <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-1.5 pt-0.5">
                            <span className="text-sm">🔥</span>
                            <span>Complete today&apos;s challenge &amp; keep your streak alive</span>
                        </p>

                        {/* 5. Primary CTA */}
                        <div className="pt-1">
                            <Button
                                onClick={handleStartChallenge}
                                className="w-full sm:w-auto h-11 px-6 rounded-[12px] bg-[#1F4FA3] hover:bg-[#163b7d] text-white font-bold text-sm shadow-sm hover:shadow-md transition-all duration-200 border-none flex items-center justify-center gap-2 group cursor-pointer"
                            >
                                <span>START CHALLENGE</span>
                                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                            </Button>
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
