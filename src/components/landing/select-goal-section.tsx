'use client';

import Link from "next/link";
import React from 'react';
import { ArrowRight, Atom, Dna, Building, Trophy, BookHeart, Users, GraduationCap, Landmark } from "lucide-react";

const goals = [
  {
    name: "IIT-JEE/NEET",
    icon: <Atom className="w-8 h-8" />,
    href: "/category/iit-jee",
    color: "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400",
  },
  {
    name: "CUET UG/PG",
    icon: <GraduationCap className="w-8 h-8" />,
    href: "/category/cuet",
    color: "bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400",
  },
  {
    name: "CBSE BOARD",
    icon: <GraduationCap className="w-8 h-8" />,
    href: "/school",
    color: "bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400",
  },
    {
    name: "NIOS BOARD",
    icon: <GraduationCap className="w-8 h-8" />,
    href: "/new-work",
    color: "bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400",
  },
  {
    name: "GOVT. EXAMS",
    icon: <Landmark className="w-8 h-8" />,
    href: "/examcat?category=govt-job-exams",
    color: "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400",
  },
  {
    name: "Olympiad",
    icon: <Trophy className="w-8 h-8" />,
    href: "#",
    color: "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400",
  },
  {
    name: "Offline Centres",
    icon: <Building className="w-8 h-8" />,
    href: "/offline-centers",
    color: "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400",
  },
  {
    name: "One to One Classes",
    icon: <Users className="w-8 h-8" />,
    href: "#",
    color: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
  },
];

export function SelectGoalSection() {
    return (
        <section className="w-full pb-12 md:pb-24 relative z-20">
            <div className="container mx-auto px-4 md:px-6">
                <div className="bg-white dark:bg-card p-6 rounded-2xl shadow-lg border">
                    <div className="flex justify-center mb-6">
                        <div className="bg-yellow-400 text-black px-4 py-1 rounded-full font-bold text-sm">
                            Popular Courses
                        </div>
                    </div>
                    <div className="relative">
                        <div className="overflow-x-auto pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                            <div className="flex gap-4">
                                {goals.map((goal) => (
                                    <Link key={goal.name} href={goal.href} className="group flex-shrink-0 w-36">
                                        <div className={`flex flex-col items-center justify-center p-4 rounded-xl transition-all duration-300 h-full ${goal.color} hover:shadow-lg hover:-translate-y-1`}>
                                            <div className="mb-2">
                                                {goal.icon}
                                            </div>
                                            <p className="text-sm font-semibold text-center text-foreground">{goal.name}</p>
                                            
                                            <ArrowRight className="w-4 h-4 mt-2 text-muted-foreground group-hover:text-primary transition-colors" />
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}