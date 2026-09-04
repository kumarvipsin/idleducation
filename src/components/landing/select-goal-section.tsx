
'use client';

import Link from "next/link";
import React from 'react';
import { ArrowRight, BookOpen, IndianRupee, GraduationCap, Landmark, ClipboardList } from "lucide-react";
import { cn } from "@/lib/utils";
import { DISCOVER_COURSES } from "@/lib/courses";

const iconMap: { [key: string]: React.ReactNode } = {
    "FREE COURSES": <BookOpen className="w-5 h-5 sm:w-6 sm:h-6" />,
    "PAID COURSES": <IndianRupee className="w-5 h-5 sm:w-6 sm:h-6" />,
    "SCHOOL BOARD": <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6" />,
    "CUET EXAM": <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6" />,
    "GOVT. EXAMS": <Landmark className="w-5 h-5 sm:w-6 sm:h-6" />,
    "TEST SERIES": <ClipboardList className="w-5 h-5 sm:w-6 sm:h-6" />,
};

const colorMap: { [key: string]: string } = {
    "FREE COURSES": "bg-orange-100/70 dark:bg-orange-900/25 text-orange-600 dark:text-orange-400 border-orange-200/50 dark:border-orange-800/30",
    "PAID COURSES": "bg-lime-100/70 dark:bg-lime-900/25 text-lime-600 dark:text-lime-400 border-lime-200/50 dark:border-lime-800/30",
    "SCHOOL BOARD": "bg-teal-100/70 dark:bg-teal-900/25 text-teal-600 dark:text-teal-400 border-teal-200/50 dark:border-teal-800/30",
    "CUET EXAM": "bg-cyan-100/70 dark:bg-cyan-900/25 text-cyan-600 dark:text-cyan-400 border-cyan-200/50 dark:border-cyan-800/30",
    "GOVT. EXAMS": "bg-indigo-100/70 dark:bg-indigo-900/25 text-indigo-600 dark:text-indigo-400 border-indigo-200/50 dark:border-indigo-800/30",
    "TEST SERIES": "bg-blue-100/70 dark:bg-blue-900/25 text-blue-600 dark:text-blue-400 border-blue-200/50 dark:border-blue-800/30",
};

export function SelectGoalSection() {
    return (
        <section className="w-full pt-1 pb-2 sm:pb-3 bg-white dark:bg-black relative z-20">
            <div className="container mx-auto px-4 md:px-6">
                <div className="bg-white dark:bg-card p-4 sm:p-5 md:p-6 rounded-2xl shadow-sm border border-slate-200/80 dark:border-border/60">
                    <div className="flex justify-center mb-4 sm:mb-5">
                        <div className="bg-[#F5B51B] text-slate-900 px-3.5 py-1 rounded-full font-bold text-xs uppercase tracking-wider shadow-sm">
                            Discover Our Courses
                        </div>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3 md:gap-3.5 items-stretch">
                        {DISCOVER_COURSES.map((goal) => {
                            const isDisabled = goal.href === "#";
                            const icon = iconMap[goal.name] || <BookOpen className="w-5 h-5 sm:w-6 sm:h-6" />;
                            const color = colorMap[goal.name] || "bg-slate-100 text-slate-600 border-slate-200/50";

                            return (
                                <Link 
                                    key={goal.name} 
                                    href={goal.href} 
                                    className={cn(
                                        "group block h-full",
                                        isDisabled && "pointer-events-none"
                                    )}
                                >
                                    <div className={cn(
                                        "flex flex-col items-center justify-between py-3 px-2 sm:py-3.5 sm:px-2.5 rounded-xl transition-all duration-200 h-full border min-h-[105px] sm:min-h-[115px]",
                                        color,
                                        isDisabled 
                                            ? "opacity-60 grayscale-[0.4]" 
                                            : "hover:-translate-y-0.5 hover:shadow-sm"
                                    )}>
                                        <div className="flex items-center justify-center h-7 sm:h-8 mb-1">
                                            {icon}
                                        </div>
                                        <p className="text-[11px] sm:text-xs font-bold text-center text-slate-800 dark:text-slate-200 tracking-tight leading-snug">
                                            {goal.name}
                                        </p>
                                        <div className="mt-1 sm:mt-1.5 flex items-center justify-center h-4">
                                            {!isDisabled ? (
                                                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-primary group-hover:translate-x-0.5 transition-all duration-200" />
                                            ) : (
                                                <span className="text-[9px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                                                    Coming Soon
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}

