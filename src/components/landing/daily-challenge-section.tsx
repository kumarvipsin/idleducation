'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
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
        <section className="w-full pt-2 pb-2 sm:pb-3 bg-white dark:bg-background relative z-20">
            <div className="container mx-auto px-4 md:px-6">
                <div className="relative rounded-[22px] bg-white dark:bg-card p-5 sm:p-7 md:p-8 border border-slate-200/80 dark:border-border/60 shadow-sm md:shadow-md overflow-hidden">
                    {/* Subtle branded top accent line */}
                    <div className="absolute top-0 left-6 right-6 h-[2px] bg-gradient-to-r from-transparent via-[#1F4FA3]/40 to-transparent pointer-events-none" />

                    {/* ============================================================ */}
                    {/* DESKTOP COMPOSITION (Two-Column Layout)                     */}
                    {/* ============================================================ */}
                    <div className="hidden md:grid md:grid-cols-12 md:gap-8 items-center">
                        {/* Left: label + heading + supporting text + CTA + streak */}
                        <div className="md:col-span-7 flex flex-col items-start text-left space-y-4 sm:space-y-4.5">
                            {/* Small Label */}
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-blue-50 dark:bg-blue-950/40 text-[#1F4FA3] dark:text-blue-400 border border-blue-200/60 dark:border-blue-900/40">
                                <span>🎯 TODAY&apos;S CHALLENGE</span>
                            </div>

                            {/* Main Heading */}
                            <h2 className="text-2xl lg:text-3xl font-extrabold text-[#0B1F4B] dark:text-white leading-tight tracking-tight">
                                Can You Solve It in 60 Seconds?
                            </h2>

                            {/* Supporting Text Pill / Tag */}
                            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-lg bg-blue-50/60 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30 text-[#1F4FA3] dark:text-blue-300 font-bold text-xs sm:text-sm">
                                <span>5 Questions • 3 Minutes • Every Day</span>
                            </div>

                            {/* Short Supporting Message */}
                            <p className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-300 leading-relaxed max-w-lg">
                                Challenge yourself, improve your concepts, and build your learning streak.
                            </p>

                            {/* CTA & Motivational Line */}
                            <div className="pt-2 space-y-2.5">
                                <Button
                                    onClick={handleStartChallenge}
                                    className="h-11 px-6 rounded-[12px] bg-[#1F4FA3] hover:bg-[#163b7d] text-white font-bold text-sm shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 border-none group"
                                >
                                    <span>START TODAY&apos;S CHALLENGE</span>
                                    <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                                </Button>

                                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                                    <span>🔥</span>
                                    <span>Come back tomorrow to keep your streak!</span>
                                </p>
                            </div>
                        </div>

                        {/* Right: Educational Illustration */}
                        <div className="md:col-span-5 flex items-center justify-center">
                            <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-slate-50/70 dark:bg-slate-900/30 border border-slate-100 dark:border-slate-800/80 flex items-center justify-center p-2">
                                <Image
                                    src="/idl_daily_challenge.jpg"
                                    alt="Today's Challenge - Student solving problem challenge"
                                    fill
                                    className="object-contain"
                                    priority
                                />
                            </div>
                        </div>
                    </div>

                    {/* ============================================================ */}
                    {/* MOBILE COMPOSITION (Heading -> Illustration -> Info -> CTA)  */}
                    {/* ============================================================ */}
                    <div className="flex flex-col md:hidden text-left space-y-4">
                        {/* 1. Label & Heading */}
                        <div className="space-y-2">
                            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-50 dark:bg-blue-950/40 text-[#1F4FA3] dark:text-blue-400 border border-blue-200/60 dark:border-blue-900/40">
                                <span>🎯 TODAY&apos;S CHALLENGE</span>
                            </div>
                            <h2 className="text-xl sm:text-2xl font-extrabold text-[#0B1F4B] dark:text-white leading-tight tracking-tight">
                                Can You Solve It in 60 Seconds?
                            </h2>
                        </div>

                        {/* 2. Educational Illustration */}
                        <div className="relative w-full aspect-[4/3] max-w-[320px] mx-auto rounded-xl overflow-hidden bg-slate-50/70 dark:bg-slate-900/30 border border-slate-100 dark:border-slate-800/80 p-1">
                            <Image
                                src="/idl_daily_challenge.jpg"
                                alt="Today's Challenge - Student solving problem challenge"
                                fill
                                className="object-contain"
                            />
                        </div>

                        {/* 3. Challenge Information */}
                        <div className="space-y-2 pt-1">
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-50/60 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30 text-[#1F4FA3] dark:text-blue-300 font-bold text-xs">
                                <span>5 Questions • 3 Minutes • Every Day</span>
                            </div>
                            <p className="text-xs font-medium text-slate-600 dark:text-slate-300 leading-relaxed">
                                Challenge yourself, improve your concepts, and build your learning streak.
                            </p>
                        </div>

                        {/* 4. Primary CTA & Motivational Line */}
                        <div className="pt-2 space-y-2">
                            <Button
                                onClick={handleStartChallenge}
                                className="w-full sm:w-auto h-11 px-6 rounded-[12px] bg-[#1F4FA3] hover:bg-[#163b7d] text-white font-bold text-sm shadow-sm hover:shadow-md transition-all duration-200 border-none flex items-center justify-center gap-2 group"
                            >
                                <span>START TODAY&apos;S CHALLENGE</span>
                                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                            </Button>

                            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                                <span>🔥</span>
                                <span>Come back tomorrow to keep your streak!</span>
                            </p>
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
