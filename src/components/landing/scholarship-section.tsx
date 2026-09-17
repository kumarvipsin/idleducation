'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trophy, Medal, Sparkles, ArrowRight } from "lucide-react";
import Image from "next/image";
import { ScholarshipModal } from "@/components/scholarship-modal";

export function ScholarshipSection() {
    const [isScholarshipOpen, setIsScholarshipOpen] = useState(false);

    return (
        <section className="w-full py-6 sm:py-8 bg-white dark:bg-background">
            <div className="container mx-auto px-4 md:px-6">
                {/* ── Premium Deep Navy Banner Box ── */}
                <div className="relative rounded-3xl bg-[#06173D] dark:bg-[#040F28] p-6 sm:p-8 md:p-10 border border-[#162B5E] shadow-xl overflow-hidden text-white">
                    
                    {/* Soft ambient background glows */}
                    <div className="absolute top-0 right-1/3 w-72 h-72 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-center relative z-10">
                        {/* LEFT COLUMN: Scholarship message, benefits, CTA */}
                        <div className="md:col-span-7 flex flex-col items-start text-left space-y-4 sm:space-y-5">
                            {/* Branded Gold Pill Badge */}
                            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[11.5px] font-bold uppercase tracking-wider bg-amber-400/15 text-[#F5B51B] border border-amber-400/30">
                                <Sparkles className="w-3.5 h-3.5 text-[#F5B51B]" />
                                <span>Admissions &amp; Scholarship 2026-27</span>
                            </div>

                            {/* Main Heading */}
                            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white leading-[1.2] tracking-tight">
                                Get up to 70% scholarship with the{" "}
                                <span className="text-[#38BDF8]">IDL Scholarship &amp; Admission Test</span>
                            </h2>

                            {/* Benefit Points */}
                            <div className="space-y-3 w-full pt-1">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-xl bg-blue-900/50 border border-blue-700/50 flex items-center justify-center shrink-0">
                                        <Trophy className="h-4.5 w-4.5 text-[#F5B51B]" />
                                    </div>
                                    <p className="text-sm sm:text-base text-slate-200 font-semibold leading-snug">
                                        Get Up to 70% Scholarship on IDL Admissions Test
                                    </p>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-xl bg-blue-900/50 border border-blue-700/50 flex items-center justify-center shrink-0">
                                        <Medal className="h-4.5 w-4.5 text-[#38BDF8]" />
                                    </div>
                                    <p className="text-sm sm:text-base text-slate-200 font-semibold leading-snug">
                                        Get 2X Scholarship by taking the Test at Our Centre
                                    </p>
                                </div>
                            </div>

                            {/* Primary CTA */}
                            <div className="pt-2">
                                <Button 
                                    onClick={() => setIsScholarshipOpen(true)} 
                                    className="h-12 px-7 rounded-xl bg-[#0A5CFF] hover:bg-[#0240B8] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all duration-200 border-none cursor-pointer flex items-center gap-2"
                                >
                                    <span>Register For FREE</span>
                                    <ArrowRight className="w-4 h-4" />
                                </Button>
                                <ScholarshipModal isOpen={isScholarshipOpen} onOpenChange={setIsScholarshipOpen} />
                            </div>
                        </div>

                        {/* RIGHT COLUMN: Relevant Scholarship/Student Visual */}
                        <div className="md:col-span-5 w-full flex items-end justify-center self-end pt-4 md:pt-0">
                            <div className="relative w-full h-[240px] sm:h-[290px] md:h-[320px] lg:h-[350px] flex items-end justify-center">
                                <Image
                                    src="/idlsch.png"
                                    alt="IDL Scholarship and Admission Test merit students"
                                    fill
                                    className="object-contain object-bottom"
                                    sizes="(max-width: 768px) 100vw, 40vw"
                                    priority
                                    unoptimized
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

