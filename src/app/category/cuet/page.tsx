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
    Eye,
    Download,
    Monitor,
    GraduationCap,
    Sigma,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const cuetSubjects = [
    { name: "Language (Section IA & IB)", key: "language", icon: <BookOpen className="w-5 h-5" />, color: "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400", border: "border-emerald-100" },
    { name: "Domain Specific Subjects", key: "domain", icon: <Sigma className="w-5 h-5" />, color: "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400", border: "border-blue-100" },
    { name: "General Test (Section III)", key: "gat", icon: <GraduationCap className="w-5 h-5" />, color: "bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400", border: "border-purple-100" },
    { name: "Reasoning & Aptitude", key: "reasoning", icon: <Sparkles className="w-5 h-5" />, color: "bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400", border: "border-amber-100" },
];

export default function CuetPage() {
    const [activeTab, setActiveTab] = useState('ug');
    
    const resourceCards = [
        {
          title: "CUET Advantage",
          subtitle: `Specialized ${activeTab.toUpperCase()} prep`,
          icon: <Sparkles />,
          bgColor: "bg-amber-50/50 border-amber-100",
          textColor: "text-amber-900",
          iconBg: "bg-white text-amber-600 shadow-sm",
          href: "/about"
        },
        {
          title: "Revision Notes",
          subtitle: "High-quality study material",
          icon: <BookOpen />,
          bgColor: "bg-blue-50/50 border-blue-100",
          textColor: "text-blue-900",
          iconBg: "bg-white text-blue-600 shadow-sm",
          href: "/resources/notes"
        },
         {
          title: "Solutions & PYQs",
          subtitle: "Mock tests and practice",
          icon: <Book />,
          bgColor: "bg-indigo-50/50 border-indigo-100",
          textColor: "text-indigo-900",
          iconBg: "bg-white text-indigo-600 shadow-sm",
          href: "/resources/ncert-solutions"
        }
    ];

    return (
        <div className="min-h-screen w-full bg-[#F8F7FF] dark:bg-slate-950 relative">
            <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none" />
            
            <div className="container mx-auto py-8 px-4 md:px-6 max-w-6xl relative z-10">
                {/* Compact Banner */}
                <section className="mb-8 animate-fade-in-up">
                    <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white shadow-lg">
                        <div className="relative w-full aspect-[21/7] md:aspect-[21/5]">
                            <Image
                                src="/result.jpg"
                                alt="CUET Results"
                                fill
                                className="object-cover"
                                priority
                            />
                            <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-transparent hidden md:block" />
                        </div>
                    </div>
                </section>

                {/* Heading Area */}
                <section className="mb-12 text-center md:text-left animate-fade-in-up">
                    <div className="flex flex-col items-center md:items-start gap-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-primary text-[10px] font-bold uppercase tracking-widest shadow-sm">
                            <Sparkles className="w-3 h-3 text-yellow-500" />
                            CUET 2026 Preparation
                        </div>
                        
                        <div className="space-y-2">
                            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white tracking-tight leading-tight">
                                CUET {activeTab.toUpperCase()} Entrance 2026-27
                            </h1>
                            <p className="max-w-2xl text-slate-600 dark:text-slate-400 text-sm md:text-base font-medium leading-relaxed">
                                Master the Common University Entrance Test with IDL's specialized curricula. Secure your seat in India's top universities with our focused strategy.
                            </p>
                        </div>

                        <div className="flex items-center gap-2 p-1 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md rounded-full border border-slate-200 dark:border-slate-800">
                            <Button 
                                onClick={() => setActiveTab('ug')} 
                                variant="ghost"
                                size="sm"
                                className={cn(
                                    "rounded-full px-6 text-xs font-bold transition-all h-8",
                                    activeTab === 'ug' ? "bg-primary text-white shadow-md" : "text-slate-500"
                                )}
                            >
                                CUET UG
                            </Button>
                            <Button 
                                onClick={() => setActiveTab('pg')} 
                                variant="ghost"
                                size="sm"
                                className={cn(
                                    "rounded-full px-6 text-xs font-bold transition-all h-8",
                                    activeTab === 'pg' ? "bg-primary text-white shadow-md" : "text-slate-500"
                                )}
                            >
                                CUET PG
                            </Button>
                        </div>
                    </div>
                </section>
        
                {/* Resource Hub */}
                <section className="mb-16 animate-fade-in-up" style={{animationDelay: '0.1s'}}>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {resourceCards.map((card, index) => (
                            <Link key={index} href={card.href} className="group">
                                <div className={cn(
                                    "flex items-center gap-4 p-4 rounded-xl transition-all duration-300 shadow-sm border bg-white dark:bg-slate-900/50 hover:shadow-md hover:border-primary/20",
                                )}>
                                    <div className={cn("p-2.5 rounded-lg shrink-0 border border-slate-100 dark:border-slate-800", card.iconBg)}>
                                        {React.cloneElement(card.icon as React.ReactElement, { className: "w-5 h-5" })}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className={cn("text-xs font-bold leading-none mb-1", card.textColor)}>{card.title}</h4>
                                        <p className={cn("text-[10px] font-medium opacity-60 truncate", card.textColor)}>{card.subtitle}</p>
                                    </div>
                                    <ArrowRight className={cn("w-4 h-4 transition-all group-hover:translate-x-1 opacity-20 group-hover:opacity-100", card.textColor)} />
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>

                {/* Subject Syllabus */}
                <section className="mb-16 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
                    <div className="space-y-6">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-2 border-l-4 border-primary pl-4">
                            <div>
                                <h3 className="font-bold text-xl md:text-2xl text-slate-900 dark:text-white tracking-tight">
                                    Curriculum Intelligence
                                </h3>
                                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Subject-wise navigation for 2026-27</p>
                            </div>
                            <Button variant="link" className="text-primary font-bold text-xs h-auto p-0 group">
                                View Full Exam Pattern <ArrowRight className="ml-1 w-3 h-3 transition-transform group-hover:translate-x-1" />
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {cuetSubjects.map((subject) => (
                                <div key={subject.key} className="group bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-primary/30 transition-all duration-300 flex flex-col sm:flex-row items-center justify-between gap-4">
                                    <div className="flex items-center gap-4 w-full">
                                        <div className={cn("p-3 rounded-xl shrink-0 border shadow-sm", subject.color, subject.border)}>
                                            {subject.icon}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-sm text-slate-900 dark:text-white leading-tight">{subject.name}</h4>
                                            <p className="text-[10px] text-muted-foreground font-medium mt-0.5">Core Module • Session 2026</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 w-full sm:w-auto">
                                        <Button variant="outline" size="sm" className="flex-1 sm:w-24 h-8 text-[10px] font-bold tracking-wider uppercase text-blue-600 border-blue-100 hover:bg-blue-50">
                                            SYLLABUS
                                        </Button>
                                        <Button variant="outline" size="sm" className="flex-1 sm:w-20 h-8 text-[10px] font-bold tracking-wider uppercase text-emerald-600 border-emerald-100 hover:bg-emerald-50">
                                            PDF
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Learning Path */}
                <section className="mb-8 animate-fade-in-up" style={{animationDelay: '0.3s'}}>
                    <div className="space-y-8">
                        <div className="text-center space-y-2">
                            <h3 className="font-bold text-2xl md:text-3xl text-slate-900 dark:text-white tracking-tight">
                                Strategic Learning Tiers
                            </h3>
                            <p className="text-xs text-muted-foreground font-medium max-w-lg mx-auto">Proprietary educational delivery models for specific student needs</p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                            {/* Free Courses */}
                            <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-card hover:border-orange-300 transition-all duration-300 rounded-2xl shadow-md border-t-8 border-t-orange-500">
                                <CardContent className="p-6 space-y-6 flex flex-col h-full">
                                    <div className="flex items-center justify-between">
                                        <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-xl text-orange-600 shadow-inner">
                                            <PlayCircle className="w-6 h-6" />
                                        </div>
                                        <Badge className="text-[9px] font-bold uppercase tracking-wider bg-orange-500 text-white border-none rounded-full">PUBLIC NODE</Badge>
                                    </div>
                                    <div className="space-y-2">
                                        <h4 className="text-lg font-bold text-slate-900 dark:text-white uppercase tracking-tight">Open Source</h4>
                                        <p className="text-xs font-medium text-muted-foreground leading-relaxed">
                                            High-definition foundational lectures available to all aspirants. Ideal for revision.
                                        </p>
                                    </div>
                                    <div className="mt-auto pt-4">
                                        <Button asChild size="sm" className="w-full bg-slate-900 hover:bg-black dark:bg-orange-600 dark:hover:bg-orange-700 text-white font-bold text-[10px] h-10 rounded-lg uppercase tracking-widest">
                                            <Link href="/free-courses">ACCESS LESSONS</Link>
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Paid Courses */}
                            <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-card hover:border-emerald-300 transition-all duration-300 rounded-2xl shadow-md border-t-8 border-t-emerald-500">
                                <CardContent className="p-6 space-y-6 flex flex-col h-full">
                                    <div className="flex items-center justify-between">
                                        <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl text-emerald-600 shadow-inner">
                                            <IndianRupee className="w-6 h-6" />
                                        </div>
                                        <Badge className="text-[9px] font-bold uppercase tracking-wider bg-emerald-500 text-white border-none rounded-full">PREMIUM NODE</Badge>
                                    </div>
                                    <div className="space-y-2">
                                        <h4 className="text-lg font-bold text-slate-900 dark:text-white uppercase tracking-tight">Structured Path</h4>
                                        <p className="text-xs font-medium text-muted-foreground leading-relaxed">
                                            End-to-end comprehensive curricula with full coverage and premium notes.
                                        </p>
                                    </div>
                                    <div className="mt-auto pt-4">
                                        <Button asChild size="sm" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] h-10 rounded-lg uppercase tracking-widest">
                                            <Link href="/paid-courses">VIEW BATCHES</Link>
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Live Classes */}
                            <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-card hover:border-indigo-300 transition-all duration-300 rounded-2xl shadow-md border-t-8 border-t-indigo-500">
                                <CardContent className="p-6 space-y-6 flex flex-col h-full">
                                    <div className="flex items-center justify-between">
                                        <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl text-indigo-600 shadow-inner">
                                            <Monitor className="w-6 h-6" />
                                        </div>
                                        <Badge className="text-[9px] font-bold uppercase tracking-wider bg-indigo-500 text-white border-none rounded-full">ACTIVE NODE</Badge>
                                    </div>
                                    <div className="space-y-2">
                                        <h4 className="text-lg font-bold text-slate-900 dark:text-white uppercase tracking-tight">Real-Time Sync</h4>
                                        <p className="text-xs font-medium text-muted-foreground leading-relaxed">
                                            Interactive real-time sessions with top faculty. Instant doubt clearing.
                                        </p>
                                    </div>
                                    <div className="mt-auto pt-4">
                                        <Button asChild size="sm" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[10px] h-10 rounded-lg uppercase tracking-widest">
                                            <Link href="/book-demo">BOOK LIVE DEMO</Link>
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
