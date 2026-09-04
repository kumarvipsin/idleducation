'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trophy, Medal, Sparkles } from "lucide-react";
import Image from "next/image";
import { ScholarshipModal } from "@/components/scholarship-modal";

export function ScholarshipSection() {
    const [isScholarshipOpen, setIsScholarshipOpen] = useState(false);

    return (
        <section className="w-full pt-4 sm:pt-6 pb-2 sm:pb-3 bg-white dark:bg-background">
            <div className="container mx-auto px-4 md:px-6">
                <div className="relative rounded-[22px] bg-white dark:bg-card p-5 sm:p-7 md:p-8 border border-slate-200/80 dark:border-border/60 shadow-sm md:shadow-md overflow-hidden">
                    {/* Subtle branded top accent line */}
                    <div className="absolute top-0 left-6 right-6 h-[2px] bg-gradient-to-r from-transparent via-[#FF6B16]/50 to-transparent pointer-events-none" />

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-center">
                        {/* LEFT COLUMN: Scholarship message, benefits, CTA */}
                        <div className="md:col-span-7 flex flex-col items-start text-left space-y-4 sm:space-y-5">
                            {/* Branded Pill Badge */}
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-orange-50 dark:bg-orange-950/30 text-[#FF6B16] border border-orange-200/60 dark:border-orange-900/40">
                                <Sparkles className="w-3 h-3 text-[#FF6B16]" />
                                <span>Admissions &amp; Scholarship 2026-27</span>
                            </div>

                            {/* Main Heading */}
                            <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[#0B1F4B] dark:text-white leading-[1.25] tracking-tight">
                                Get up to 70% scholarship with the{" "}
                                <span className="text-[#FF6B16]">IDL Scholarship &amp; Admission Test</span>
                            </h2>

                            {/* Benefit Points */}
                            <div className="space-y-2.5 sm:space-y-3 w-full">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-orange-50 dark:bg-orange-950/30 border border-orange-200/60 dark:border-orange-900/40 flex items-center justify-center shrink-0">
                                        <Trophy className="h-4 w-4 text-[#FF6B16] stroke-[2]" />
                                    </div>
                                    <p className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 leading-snug">
                                        Get Upto 70% Scholarship on IDL Admissions Test
                                    </p>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200/60 dark:border-blue-900/40 flex items-center justify-center shrink-0">
                                        <Medal className="h-4 w-4 text-[#1F4FA3] stroke-[2]" />
                                    </div>
                                    <p className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 leading-snug">
                                        Get 2X Scholarship by taking the Test at Our Centre
                                    </p>
                                </div>
                            </div>

                            {/* Primary CTA */}
                            <div className="pt-1">
                                <Button 
                                    onClick={() => setIsScholarshipOpen(true)} 
                                    className="h-11 px-6 rounded-[12px] bg-[#FF6B16] hover:bg-[#e65a0c] text-white font-bold text-sm shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 border-none"
                                >
                                    Register For FREE
                                </Button>
                                <ScholarshipModal isOpen={isScholarshipOpen} onOpenChange={setIsScholarshipOpen} />
                            </div>
                        </div>

                        {/* RIGHT COLUMN: Relevant Scholarship/Student Visual */}
                        <div className="md:col-span-5 w-full flex items-end justify-center self-end -mb-5 sm:-mb-7 md:-mb-8 pt-2">
                            <div className="relative w-full h-[280px] sm:h-[320px] md:h-[340px] lg:h-[380px] flex items-end justify-center">
                                <Image
                                    src="/idlsch.png"
                                    alt="IDL Scholarship and Admission Test merit students"
                                    fill
                                    className="object-contain object-bottom"
                                    sizes="(max-width: 768px) 100vw, 40vw"
                                    priority
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

