
'use client';

import Link from "next/link";
import React from 'react';
import { ArrowRight, BookOpen, IndianRupee, GraduationCap, Landmark, ClipboardList } from "lucide-react";
import { cn } from "@/lib/utils";

const goals = [
    {
        name: "FREE COURSES",
        icon: <BookOpen className="w-6 h-6 md:w-8 md:h-8" />,
        href: "/free-courses",
        color: "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400",
    },
    {
        name: "PAID COURSES",
        icon: <IndianRupee className="w-6 h-6 md:w-8 md:h-8" />,
        href: "/paid-courses",
        color: "bg-lime-100 dark:bg-lime-900/30 text-lime-600 dark:text-lime-400",
    },
    {
        name: "SCHOOL BOARD",
        icon: <GraduationCap className="w-6 h-6 md:w-8 md:h-8" />,
        href: "/school",
        color: "bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400",
    },
    {
        name: "CUET UG/PG",
        icon: <GraduationCap className="h-6 w-6 md:h-8 md:w-8" />,
        href: "/category/cuet",
        color: "bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400",
    },
    {
        name: "GOVT. EXAMS",
        icon: <Landmark className="w-6 h-6 md:w-8 md:h-8" />,
        href: "#",
        color: "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400",
    },
    {
        name: "TEST SERIES",
        icon: <ClipboardList className="w-6 h-6 md:w-8 md:h-8" />,
        href: "#",
        color: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
    },
];

export function SelectGoalSection() {
    return (
        <section className="w-full pb-6 md:pb-10 relative z-20">
            <div className="container mx-auto px-4 md:px-6">
                <div className="bg-white dark:bg-card p-4 md:p-6 rounded-2xl shadow-lg border">
                    <div className="flex justify-center mb-6">
                        <div className="bg-yellow-400 text-black px-4 py-1 rounded-full font-bold text-xs">
                            Discover Our Courses
                        </div>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4 items-stretch">
                        {goals.map((goal) => {
                            const isDisabled = goal.href === "#";
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
                                        "flex flex-col items-center justify-center p-3 md:p-4 rounded-xl transition-all duration-300 h-full border border-transparent",
                                        goal.color,
                                        isDisabled ? "opacity-50 grayscale-[0.5]" : "hover:shadow-lg hover:-translate-y-1 hover:border-white/20"
                                    )}>
                                        <div className="mb-2">
                                            {goal.icon}
                                        </div>
                                        <p className="text-[10px] md:text-xs font-bold text-center text-foreground whitespace-nowrap tracking-tight">{goal.name}</p>
                                        
                                        {!isDisabled && <ArrowRight className="w-3 h-3 md:w-4 md:h-4 mt-2 text-muted-foreground group-hover:text-primary transition-colors" />}
                                        {isDisabled && <span className="text-[8px] font-bold opacity-60 mt-2 uppercase tracking-tighter">Coming Soon</span>}
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
