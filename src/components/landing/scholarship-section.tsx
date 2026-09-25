'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Award, GraduationCap, Building2, Users, ArrowRight } from "lucide-react";
import Image from "next/image";
import { ScholarshipModal } from "@/components/scholarship-modal";

export function ScholarshipSection() {
    const [isScholarshipOpen, setIsScholarshipOpen] = useState(false);

    return (
        <section className="w-full py-6 sm:py-8 md:py-10 bg-white dark:bg-background">
            <div className="container max-w-[1280px] mx-auto px-4 md:px-6">
                {/* ── Main Light Card Banner ── */}
                <div className="relative rounded-[24px] sm:rounded-[28px] bg-gradient-to-r from-[#F4F9FE] via-[#EEF6FE] to-[#F5FAFE] dark:bg-slate-900/70 border border-[#DCE6F5] dark:border-slate-800 shadow-[0_4px_24px_rgba(6,43,103,0.03)] overflow-hidden p-5 sm:p-7 md:p-8 lg:p-9">
                    
                    <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 items-center">
                        
                        {/* ── LEFT COLUMN: Text, Benefits, CTA (5 cols on lg) ── */}
                        <div className="md:col-span-6 lg:col-span-5 flex flex-col items-start text-left space-y-3.5 sm:space-y-4">
                            {/* Refined Small Pill Badge */}
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#EBF3FE] dark:bg-blue-950/40 text-[#062B67] dark:text-blue-300 border border-[#D5E3FA] dark:border-blue-900/50">
                                <GraduationCap className="w-3.5 h-3.5 text-[#0A5CFF] dark:text-blue-400" />
                                <span>ADMISSIONS &amp; SCHOLARSHIP 2026–27</span>
                            </div>

                            {/* Main Heading */}
                            <h2 className="text-[22px] sm:text-[27px] md:text-[30px] lg:text-[33px] font-extrabold text-[#062B67] dark:text-white leading-[1.2] tracking-tight">
                                Get Up to <span className="text-[#0A5CFF] dark:text-blue-400">70% Scholarship</span> <br className="hidden sm:inline" />
                                with the <span className="text-[#0A5CFF] dark:text-blue-400">IDL Admission Test</span>
                            </h2>

                            {/* Benefit Points */}
                            <div className="space-y-2.5 w-full pt-1">
                                <div className="flex items-center gap-2.5">
                                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#EBF3FE] dark:bg-blue-950/50 border border-[#D5E3FA] dark:border-blue-900/40 flex items-center justify-center shrink-0">
                                        <Award className="h-4 w-4 text-[#0A5CFF] dark:text-blue-400" />
                                    </div>
                                    <p className="text-[12.5px] sm:text-[13.5px] font-semibold text-[#062B67]/90 dark:text-slate-200 leading-snug">
                                        Get up to 70% scholarship on the IDL Admission Test
                                    </p>
                                </div>

                                <div className="flex items-center gap-2.5">
                                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#EBF3FE] dark:bg-blue-950/50 border border-[#D5E3FA] dark:border-blue-900/40 flex items-center justify-center shrink-0">
                                        <Award className="h-4 w-4 text-[#0A5CFF] dark:text-blue-400" />
                                    </div>
                                    <p className="text-[12.5px] sm:text-[13.5px] font-semibold text-[#062B67]/90 dark:text-slate-200 leading-snug">
                                        Get 2X scholarship by taking the test at our centre
                                    </p>
                                </div>
                            </div>

                            {/* Primary CTA Button */}
                            <div className="pt-2 w-fit">
                                <Button 
                                    onClick={() => setIsScholarshipOpen(true)} 
                                    className="group w-fit h-[42px] sm:h-[46px] px-5 sm:px-7 rounded-xl bg-[#0A5CFF] hover:bg-[#004BD6] text-white font-bold text-sm shadow-[0_3px_10px_rgba(10,92,255,0.22)] hover:shadow-[0_5px_15px_rgba(10,92,255,0.32)] transition-all duration-200 border-none cursor-pointer flex items-center justify-center gap-2"
                                >
                                    <span>Apply Now</span>
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </Button>
                                <ScholarshipModal isOpen={isScholarshipOpen} onOpenChange={setIsScholarshipOpen} />
                            </div>
                        </div>

                        {/* ── CENTER COLUMN: Student Cutout + Circle Backdrop + Script Text (4 cols on lg) ── */}
                        <div className="md:col-span-6 lg:col-span-4 w-full flex items-end justify-center relative min-h-[260px] sm:min-h-[300px] md:min-h-[330px] pt-4 md:pt-0">
                            
                            {/* Soft Blue Circle Backdrop behind student */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[260px] h-[260px] sm:w-[310px] sm:h-[310px] rounded-full bg-gradient-to-b from-[#DCEBFE]/80 to-[#E9F3FE]/40 dark:from-blue-950/40 dark:to-transparent pointer-events-none" />



                            {/* Student Cutout Image */}
                            <div className="relative w-full h-[260px] sm:h-[300px] md:h-[330px] max-w-[340px] z-10 flex items-end justify-center">
                                <Image
                                    src="/scholarship.png"
                                    alt="IDL Admission Test Student"
                                    fill
                                    className="object-contain object-bottom select-none pointer-events-none"
                                    sizes="(max-width: 768px) 100vw, 35vw"
                                    priority
                                />
                            </div>
                        </div>

                        {/* ── RIGHT COLUMN: Stats Card (Horizontal compact proof strip on mobile, vertical card on desktop) ── */}
                        <div className="md:col-span-12 lg:col-span-3 w-full flex justify-center lg:justify-end pt-1.5 lg:pt-0">
                            <div className="w-full max-w-[390px] sm:max-w-[420px] lg:max-w-[240px] bg-white dark:bg-slate-900 rounded-[14px] sm:rounded-[16px] lg:rounded-2xl border border-[#DCE6F5]/80 dark:border-slate-800 shadow-[0_2px_8px_rgba(6,43,103,0.03)] lg:shadow-[0_4px_20px_rgba(6,43,103,0.04)] py-2.5 px-2 sm:py-3 sm:px-3 lg:p-5">
                                
                                <div className="grid grid-cols-3 lg:grid-cols-1 divide-x divide-[#EEF3FB] dark:divide-slate-800/60 lg:divide-x-0 lg:divide-y lg:divide-[#EDF2FA] lg:dark:divide-slate-800 lg:gap-5">
                                    {/* Stat 1 */}
                                    <div className="flex flex-col items-center text-center px-1 lg:flex-row lg:items-center lg:text-left lg:gap-3 lg:px-0 lg:pb-4">
                                        {/* Desktop Icon Box */}
                                        <div className="hidden lg:flex w-10 h-10 rounded-xl bg-[#EBF3FE] dark:bg-blue-950/60 text-[#0A5CFF] dark:text-blue-400 items-center justify-center shrink-0">
                                            <GraduationCap className="w-5 h-5" />
                                        </div>
                                        {/* Mobile Clean Line Icon Above Number */}
                                        <GraduationCap className="w-3.5 h-3.5 text-[#0A5CFF] dark:text-blue-400 mb-1 lg:hidden stroke-[2.2]" />
                                        
                                        <div className="flex flex-col items-center lg:items-start min-w-0">
                                            <span className="text-[16px] sm:text-[17px] lg:text-[18px] font-extrabold text-[#062B67] dark:text-white leading-none tracking-tight whitespace-nowrap">
                                                9+
                                            </span>
                                            <span className="text-[9.5px] sm:text-[10px] lg:text-[11px] font-medium text-slate-500 dark:text-slate-400 leading-tight text-center lg:text-left mt-1">
                                                <span className="lg:hidden">Years</span>
                                                <span className="hidden lg:inline">Years of Excellence</span>
                                            </span>
                                        </div>
                                    </div>

                                    {/* Stat 2 */}
                                    <div className="flex flex-col items-center text-center px-1 lg:flex-row lg:items-center lg:text-left lg:gap-3 lg:px-0 lg:py-4">
                                        {/* Desktop Icon Box */}
                                        <div className="hidden lg:flex w-10 h-10 rounded-xl bg-[#EBF3FE] dark:bg-blue-950/60 text-[#0A5CFF] dark:text-blue-400 items-center justify-center shrink-0">
                                            <Building2 className="w-5 h-5" />
                                        </div>
                                        {/* Mobile Clean Line Icon Above Number */}
                                        <Building2 className="w-3.5 h-3.5 text-[#0A5CFF] dark:text-blue-400 mb-1 lg:hidden stroke-[2.2]" />
                                        
                                        <div className="flex flex-col items-center lg:items-start min-w-0">
                                            <span className="text-[16px] sm:text-[17px] lg:text-[18px] font-extrabold text-[#062B67] dark:text-white leading-none tracking-tight whitespace-nowrap">
                                                5
                                            </span>
                                            <span className="text-[9.5px] sm:text-[10px] lg:text-[11px] font-medium text-slate-500 dark:text-slate-400 leading-tight text-center lg:text-left mt-1">
                                                Delhi<br className="lg:hidden" /> Branches
                                            </span>
                                        </div>
                                    </div>

                                    {/* Stat 3 */}
                                    <div className="flex flex-col items-center text-center px-1 lg:flex-row lg:items-center lg:text-left lg:gap-3 lg:px-0 lg:pt-4">
                                        {/* Desktop Icon Box */}
                                        <div className="hidden lg:flex w-10 h-10 rounded-xl bg-[#EBF3FE] dark:bg-blue-950/60 text-[#0A5CFF] dark:text-blue-400 items-center justify-center shrink-0">
                                            <Users className="w-5 h-5" />
                                        </div>
                                        {/* Mobile Clean Line Icon Above Number */}
                                        <Users className="w-3.5 h-3.5 text-[#0A5CFF] dark:text-blue-400 mb-1 lg:hidden stroke-[2.2]" />
                                        
                                        <div className="flex flex-col items-center lg:items-start min-w-0">
                                            <span className="text-[16px] sm:text-[17px] lg:text-[18px] font-extrabold text-[#062B67] dark:text-white leading-none tracking-tight whitespace-nowrap">
                                                <span className="lg:hidden">10K+</span>
                                                <span className="hidden lg:inline">10,000+</span>
                                            </span>
                                            <span className="text-[9.5px] sm:text-[10px] lg:text-[11px] font-medium text-slate-500 dark:text-slate-400 leading-tight text-center lg:text-left mt-1">
                                                Students<br className="lg:hidden" /> Guided
                                            </span>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
}
