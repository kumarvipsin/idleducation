'use client';

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
    ArrowRight, 
    BookOpen, 
    Sparkles, 
    Book, 
    PlayCircle,
    IndianRupee,
    Monitor,
    GraduationCap,
    Sigma,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const cuetSubjects = [
    { name: "Language (Section IA & IB)", key: "language", icon: <BookOpen className="w-4 h-4" />, color: "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400", border: "border-emerald-100" },
    { name: "Domain Specific Subjects", key: "domain", icon: <Sigma className="w-4 h-4" />, color: "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400", border: "border-blue-100" },
    { name: "General Test (Section III)", key: "gat", icon: <GraduationCap className="w-4 h-4" />, color: "bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400", border: "border-purple-100" },
    { name: "Reasoning & Aptitude", key: "reasoning", icon: <Sparkles className="w-4 h-4" />, color: "bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400", border: "border-amber-100" },
];

export default function CuetPage() {
    const [activeTab, setActiveTab] = useState('ug');
    
    const resourceCards = [
        {
          title: "CUET Advantage",
          subtitle: `Specialized ${activeTab.toUpperCase()} prep`,
          icon: <Sparkles />,
          bgColor: "bg-white dark:bg-slate-900/50",
          textColor: "text-slate-900",
          iconBg: "bg-amber-50 text-amber-600",
          href: "/about"
        },
        {
          title: "Revision Notes",
          subtitle: "Expert study material",
          icon: <BookOpen />,
          bgColor: "bg-white dark:bg-slate-900/50",
          textColor: "text-slate-900",
          iconBg: "bg-blue-50 text-blue-600",
          href: "/resources/notes"
        },
         {
          title: "Mock Tests",
          subtitle: "Practice & PYQs",
          icon: <Book />,
          bgColor: "bg-white dark:bg-slate-900/50",
          textColor: "text-slate-900",
          iconBg: "bg-indigo-50 text-indigo-600",
          href: "/resources/ncert-solutions"
        }
    ];

    return (
        <div className="min-h-screen w-full bg-[#F8F7FF] dark:bg-slate-950 relative">
            <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none" />
            
            <div className="container mx-auto py-6 px-4 md:px-6 max-w-6xl relative z-10">
                {/* Banner */}
                <section className="mb-6 animate-fade-in-up">
                    <div className="relative rounded-xl overflow-hidden border bg-white shadow-sm">
                        <div className="relative w-full aspect-[21/7] md:aspect-[21/5]">
                            <Image
                                src="/result.jpg"
                                alt="CUET Results"
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>
                    </div>
                </section>

                {/* Compact Heading Area */}
                <section className="mb-10 text-center md:text-left animate-fade-in-up">
                    <div className="flex flex-col items-center md:items-start gap-3">
                        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-primary/5 border border-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider">
                            <Sparkles className="w-3 h-3 text-yellow-500" />
                            CUET 2026 Preparation
                        </div>
                        
                        <div className="space-y-1">
                            <h1 className="text-2xl md:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
                                CUET {activeTab.toUpperCase()} Entrance 2026-27
                            </h1>
                            <p className="max-w-2xl text-slate-600 dark:text-slate-400 text-sm font-medium leading-relaxed">
                                Secure your future in top universities with IDL's specialized preparation strategy.
                            </p>
                        </div>

                        <div className="flex items-center gap-1.5 p-1 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-full border shadow-sm">
                            <Button 
                                onClick={() => setActiveTab('ug')} 
                                variant="ghost"
                                size="sm"
                                className={cn(
                                    "rounded-full px-5 text-xs font-bold transition-all h-7",
                                    activeTab === 'ug' ? "bg-primary text-white shadow-sm" : "text-slate-500 hover:bg-primary/5"
                                )}
                            >
                                CUET UG
                            </Button>
                            <Button 
                                onClick={() => setActiveTab('pg')} 
                                variant="ghost"
                                size="sm"
                                className={cn(
                                    "rounded-full px-5 text-xs font-bold transition-all h-7",
                                    activeTab === 'pg' ? "bg-primary text-white shadow-sm" : "text-slate-500 hover:bg-primary/5"
                                )}
                            >
                                CUET PG
                            </Button>
                        </div>
                    </div>
                </section>
        
                {/* Compact Resource Hub */}
                <section className="mb-12 animate-fade-in-up" style={{animationDelay: '0.1s'}}>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {resourceCards.map((card, index) => (
                            <Link key={index} href={card.href} className="group">
                                <div className={cn(
                                    "flex items-center gap-3 p-3.5 rounded-xl transition-all duration-300 shadow-sm border bg-white dark:bg-slate-900/50 hover:shadow-md hover:border-primary/20",
                                )}>
                                    <div className={cn("p-2 rounded-lg shrink-0 border border-slate-100 dark:border-slate-800 shadow-sm", card.iconBg)}>
                                        {React.cloneElement(card.icon as React.ReactElement, { className: "w-4 h-4" })}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-xs font-bold leading-none mb-1 text-foreground">{card.title}</h4>
                                        <p className="text-[10px] font-medium text-muted-foreground truncate">{card.subtitle}</p>
                                    </div>
                                    <ArrowRight className="w-3.5 h-3.5 transition-all group-hover:translate-x-1 opacity-20 group-hover:opacity-100" />
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>

                {/* Compact Subject Syllabus */}
                <section className="mb-12 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
                    <div className="space-y-5">
                        <div className="flex items-center justify-between border-l-4 border-primary pl-3">
                            <div>
                                <h3 className="font-bold text-lg md:text-xl text-slate-900 dark:text-white tracking-tight">
                                    Curriculum Intelligence
                                </h3>
                                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Session 2026-27</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {cuetSubjects.map((subject) => (
                                <div key={subject.key} className="group bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-primary/30 transition-all duration-300 flex flex-col sm:flex-row items-center justify-between gap-3">
                                    <div className="flex items-center gap-3 w-full">
                                        <div className={cn("p-2.5 rounded-lg shrink-0 border shadow-sm transition-transform group-hover:scale-105", subject.color, subject.border)}>
                                            {subject.icon}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-[13px] text-slate-900 dark:text-white leading-tight">{subject.name}</h4>
                                            <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-tighter">Core Academic Module</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
                                        <Button variant="outline" size="sm" className="flex-1 sm:w-20 h-7 text-[9px] font-bold tracking-wider uppercase text-blue-600 border-blue-100 hover:bg-blue-50 transition-all">
                                            VIEW
                                        </Button>
                                        <Button variant="outline" size="sm" className="flex-1 sm:w-20 h-7 text-[9px] font-bold tracking-wider uppercase text-emerald-600 border-emerald-100 hover:bg-emerald-50 transition-all">
                                            GET PDF
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Compact Learning Path */}
                <section className="animate-fade-in-up" style={{animationDelay: '0.3s'}}>
                    <div className="space-y-6">
                        <div className="text-center space-y-1">
                            <h3 className="font-bold text-xl md:text-2xl text-slate-900 dark:text-white tracking-tight">
                                Strategic Learning Tiers
                            </h3>
                            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Choose your path to excellence</p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {/* Free Courses */}
                            <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-card hover:border-orange-200 transition-all duration-300 rounded-xl shadow-sm border-t-4 border-t-orange-500 overflow-hidden">
                                <CardContent className="p-5 space-y-4 flex flex-col h-full">
                                    <div className="flex items-center justify-between">
                                        <div className="p-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg text-orange-600 shadow-sm">
                                            <PlayCircle className="w-5 h-5" />
                                        </div>
                                        <Badge className="text-[8px] font-bold uppercase tracking-wider bg-orange-500 text-white border-none rounded-full">OPEN NODE</Badge>
                                    </div>
                                    <div className="space-y-1.5">
                                        <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-tight">Free Courses</h4>
                                        <p className="text-[11px] font-medium text-muted-foreground leading-relaxed">
                                            Foundational lectures available to all aspirants. Ideal for rapid revision.
                                        </p>
                                    </div>
                                    <div className="mt-auto pt-3">
                                        <Button asChild size="sm" className="w-full bg-slate-900 hover:bg-black dark:bg-orange-600 dark:hover:bg-orange-700 text-white font-bold text-[9px] h-9 rounded-lg uppercase tracking-widest">
                                            <Link href="/free-courses">ACCESS LESSONS</Link>
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Paid Courses */}
                            <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-card hover:border-emerald-200 transition-all duration-300 rounded-xl shadow-sm border-t-4 border-t-emerald-500 overflow-hidden">
                                <CardContent className="p-5 space-y-4 flex flex-col h-full">
                                    <div className="flex items-center justify-between">
                                        <div className="p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg text-emerald-600 shadow-sm">
                                            <IndianRupee className="w-5 h-5" />
                                        </div>
                                        <Badge className="text-[8px] font-bold uppercase tracking-wider bg-emerald-500 text-white border-none rounded-full">PREMIUM NODE</Badge>
                                    </div>
                                    <div className="space-y-1.5">
                                        <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-tight">Structured Path</h4>
                                        <p className="text-[11px] font-medium text-muted-foreground leading-relaxed">
                                            Comprehensive curricula with structured paths and 100% syllabus coverage.
                                        </p>
                                    </div>
                                    <div className="mt-auto pt-3">
                                        <Button asChild size="sm" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[9px] h-9 rounded-lg uppercase tracking-widest">
                                            <Link href="/paid-courses">VIEW BATCHES</Link>
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Live Classes */}
                            <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-card hover:border-indigo-200 transition-all duration-300 rounded-xl shadow-sm border-t-4 border-t-indigo-500 overflow-hidden">
                                <CardContent className="p-5 space-y-4 flex flex-col h-full">
                                    <div className="flex items-center justify-between">
                                        <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg text-indigo-600 shadow-sm">
                                            <Monitor className="w-5 h-5" />
                                        </div>
                                        <Badge className="text-[8px] font-bold uppercase tracking-wider bg-indigo-500 text-white border-none rounded-full">ACTIVE NODE</Badge>
                                    </div>
                                    <div className="space-y-1.5">
                                        <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-tight">Real-Time Sync</h4>
                                        <p className="text-[11px] font-medium text-muted-foreground leading-relaxed">
                                            Interactive sessions with top faculty. Instant doubt clearing and peer learning.
                                        </p>
                                    </div>
                                    <div className="mt-auto pt-3">
                                        <Button asChild size="sm" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[9px] h-9 rounded-lg uppercase tracking-widest">
                                            <Link href="/book-demo">JOIN LIVE DEMO</Link>
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
