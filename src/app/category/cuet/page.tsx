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
    CheckCircle2
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
          title: "GET THE",
          subtitle: `CUET ${activeTab.toUpperCase()} Advantage`,
          icon: <Sparkles />,
          bgColor: "bg-amber-50/50 border-amber-100",
          textColor: "text-amber-900",
          iconBg: "bg-white text-amber-600 shadow-sm",
          href: "/about"
        },
        {
          title: "REVISION",
          subtitle: "High-Quality Notes",
          icon: <BookOpen />,
          bgColor: "bg-blue-50/50 border-blue-100",
          textColor: "text-blue-900",
          iconBg: "bg-white text-blue-600 shadow-sm",
          href: "/resources/notes"
        },
         {
          title: "SOLUTIONS",
          subtitle: "Mock Tests & PYQs",
          icon: <Book />,
          bgColor: "bg-indigo-50/50 border-indigo-100",
          textColor: "text-indigo-900",
          iconBg: "bg-white text-indigo-600 shadow-sm",
          href: "/resources/ncert-solutions"
        }
    ];

    return (
        <div className="min-h-screen w-full bg-[#F8F7FF] dark:bg-slate-950 relative selection:bg-primary/10">
            {/* Background Decorations */}
            <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none" />
            <div className="absolute top-[10%] left-[5%] w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-pulse pointer-events-none" />
            <div className="absolute bottom-[10%] right-[5%] w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse pointer-events-none" />

            <div className="container mx-auto py-12 px-4 md:px-6 max-w-7xl relative z-10">
                {/* Visual Banner */}
                <section className="mb-12 animate-fade-in-up">
                    <div className="relative rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white shadow-2xl">
                        <div className="relative w-full aspect-video md:aspect-[21/6]">
                            <Image
                                src="/result.jpg"
                                alt="CUET Results Banner"
                                data-ai-hint="exam result banner"
                                fill
                                className="object-cover"
                                priority
                            />
                            <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent hidden md:block" />
                        </div>
                    </div>
                </section>

                {/* Heading Area */}
                <section className="mb-16 text-center md:text-left animate-fade-in-up">
                    <div className="flex flex-col items-center md:items-start gap-6">
                        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-primary text-[10px] font-black uppercase tracking-[0.2em] shadow-sm">
                            <Sparkles className="w-3.5 h-3.5 text-yellow-500 animate-pulse" />
                            CUET 2026 PREPARATION
                        </div>
                        
                        <div className="space-y-4">
                            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">
                                CUET {activeTab.toUpperCase()}{' '}
                                <span className="relative inline-block">
                                    <span className="relative z-10 text-primary">Entrance 2026-27</span>
                                    <div className="absolute -bottom-2 left-0 w-full h-3 z-0">
                                        <svg viewBox="0 0 100 15" preserveAspectRatio="none" className="w-full h-full text-blue-500 fill-none stroke-current stroke-[10] opacity-70">
                                            <path d="M0,15 Q50,5 100,15" />
                                        </svg>
                                    </div>
                                </span>
                            </h1>
                            <p className="max-w-3xl text-slate-600 dark:text-slate-400 text-sm md:text-lg font-bold leading-relaxed">
                                Master the Common University Entrance Test with IDL's specialized curricula. 
                                {activeTab === 'ug' ? " Secure your seat in India's top Central, State, and Private universities." : " Advanced strategies for postgraduate excellence."}
                            </p>
                        </div>

                        <div className="flex items-center gap-3 p-1 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md rounded-full border border-slate-200 dark:border-slate-800 shadow-sm">
                            <Button 
                                onClick={() => setActiveTab('ug')} 
                                variant="ghost"
                                className={cn(
                                    "rounded-full px-8 h-10 text-[11px] font-black uppercase tracking-widest transition-all",
                                    activeTab === 'ug' ? "bg-primary text-white shadow-lg" : "text-slate-500 hover:text-primary"
                                )}
                            >
                                CUET UG
                            </Button>
                            <Button 
                                onClick={() => setActiveTab('pg')} 
                                variant="ghost"
                                className={cn(
                                    "rounded-full px-8 h-10 text-[11px] font-black uppercase tracking-widest transition-all",
                                    activeTab === 'pg' ? "bg-primary text-white shadow-lg" : "text-slate-500 hover:text-primary"
                                )}
                            >
                                CUET PG
                            </Button>
                        </div>
                    </div>
                </section>
        
                {/* Resource Quick Links */}
                <section className="mb-20 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {resourceCards.map((card, index) => (
                            <Link key={index} href={card.href} className="group">
                                <div className={cn(
                                    "flex items-center gap-5 p-6 rounded-2xl transition-all duration-500 shadow-sm border group-hover:shadow-2xl group-hover:border-primary/20 group-hover:-translate-y-1 bg-white dark:bg-slate-900/50 backdrop-blur-sm",
                                )}>
                                    <div className={cn("p-4 rounded-xl shrink-0 transition-all duration-500 group-hover:rotate-[15deg] group-hover:scale-110 border border-slate-100 dark:border-slate-800", card.iconBg)}>
                                        {React.cloneElement(card.icon as React.ReactElement, { className: "w-6 h-6" })}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className={cn("text-[13px] font-black uppercase tracking-widest leading-none mb-1.5", card.textColor)}>{card.title}</h4>
                                        <p className={cn("text-[11px] font-bold opacity-60 truncate uppercase tracking-tight", card.textColor)}>{card.subtitle}</p>
                                    </div>
                                    <ArrowRight className={cn("w-5 h-5 transition-all group-hover:translate-x-1 opacity-20 group-hover:opacity-100", card.textColor)} />
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>

                {/* Subject Syllabus Nodes */}
                <section className="mb-24 animate-fade-in-up" style={{animationDelay: '0.3s'}}>
                    <div className="space-y-10">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-l-4 border-primary pl-6">
                            <div>
                                <h3 className="font-black text-2xl md:text-3xl text-slate-900 dark:text-white uppercase tracking-tighter">
                                    Curriculum <span className="text-primary">Intelligence</span>
                                </h3>
                                <p className="text-[10px] md:text-xs text-muted-foreground font-black uppercase tracking-[0.2em] mt-2">Subject-wise navigation for 2026-27</p>
                            </div>
                            <Button variant="link" className="text-primary font-black text-xs uppercase tracking-widest group">
                                View Full Exam Pattern <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {cuetSubjects.map((subject) => (
                                <div key={subject.key} className="group relative bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-200 dark:border-slate-800 hover:border-primary/30 hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)] transition-all duration-500 flex flex-col sm:flex-row items-center justify-between gap-6 overflow-hidden">
                                    <div className="absolute top-0 left-0 w-1.5 h-full bg-primary/5 group-hover:bg-primary transition-colors duration-500" />
                                    <div className="flex items-center gap-5 w-full relative z-10">
                                        <div className={cn("p-4 rounded-2xl shrink-0 transition-all duration-700 group-hover:scale-110 group-hover:rotate-12 shadow-sm border", subject.color, subject.border)}>
                                            {subject.icon}
                                        </div>
                                        <div className="space-y-1">
                                            <h4 className="font-black text-base text-slate-900 dark:text-white tracking-tight leading-tight">{subject.name}</h4>
                                            <div className="flex items-center gap-2">
                                                <div className="h-1 w-1 rounded-full bg-primary/40" />
                                                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Core Module • Session 2026</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-row items-center gap-3 w-full sm:w-auto shrink-0 relative z-10">
                                        <Button variant="outline" size="sm" className="flex-1 sm:w-28 h-11 rounded-xl text-[10px] font-black tracking-widest uppercase text-blue-600 border-blue-100 hover:bg-blue-50 hover:border-blue-200 transition-all shadow-none group/btn">
                                            <Eye className="w-4 h-4 mr-2 transition-transform group-hover/btn:scale-110" />
                                            <span>SYLLABUS</span>
                                        </Button>
                                        <Button variant="outline" size="sm" className="flex-1 sm:w-28 h-11 rounded-xl text-[10px] font-black tracking-widest uppercase text-emerald-600 border-emerald-100 hover:bg-emerald-50 hover:border-emerald-200 transition-all shadow-none group/btn">
                                            <Download className="w-4 h-4 mr-2 transition-transform group-hover/btn:translate-y-0.5" />
                                            <span>PDF</span>
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Path Selection */}
                <section className="mb-12 animate-fade-in-up" style={{animationDelay: '0.4s'}}>
                    <div className="space-y-12">
                        <div className="text-center space-y-4">
                            <h3 className="font-black text-2xl md:text-4xl text-slate-900 dark:text-white uppercase tracking-tighter">
                                Strategic <span className="text-primary">Learning Tiers</span>
                            </h3>
                            <p className="text-[11px] md:text-sm text-muted-foreground font-bold uppercase tracking-[0.2em] max-w-xl mx-auto">Proprietary educational delivery models for specific needs</p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {/* Free Courses */}
                            <Card className="group relative border border-slate-200 dark:border-slate-800 bg-white dark:bg-card hover:border-orange-300 transition-all duration-500 rounded-[2.5rem] shadow-xl hover:shadow-2xl hover:-translate-y-2 border-t-[12px] border-t-orange-500 overflow-hidden">
                                <CardContent className="p-10 space-y-8 flex flex-col h-full">
                                    <div className="flex items-center justify-between">
                                        <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-[1.25rem] text-orange-600 transition-transform duration-700 group-hover:scale-110 group-hover:rotate-[15deg] shadow-inner">
                                            <PlayCircle className="w-8 h-8" />
                                        </div>
                                        <Badge className="text-[9px] font-black uppercase tracking-[0.25em] bg-orange-500 text-white border-none px-4 py-1.5 shadow-lg shadow-orange-500/20 rounded-full">PUBLIC NODE</Badge>
                                    </div>
                                    <div className="space-y-3">
                                        <h4 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Open Source</h4>
                                        <p className="text-[13px] font-bold text-muted-foreground leading-relaxed">
                                            High-definition foundational lectures available to all aspirants. Ideal for revision and concept clarification.
                                        </p>
                                    </div>
                                    <div className="mt-auto pt-8">
                                        <Button asChild className="w-full bg-slate-900 hover:bg-black dark:bg-orange-600 dark:hover:bg-orange-700 text-white font-black text-[10px] h-14 rounded-2xl shadow-xl transition-all uppercase tracking-[0.2em] group/btn">
                                            <Link href="/free-courses" className="flex items-center justify-center">
                                                ACCESS LESSONS
                                                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                                            </Link>
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Paid Courses */}
                            <Card className="group relative border border-slate-200 dark:border-slate-800 bg-white dark:bg-card hover:border-emerald-300 transition-all duration-500 rounded-[2.5rem] shadow-xl hover:shadow-2xl hover:-translate-y-2 border-t-[12px] border-t-emerald-500 overflow-hidden">
                                <CardContent className="p-10 space-y-8 flex flex-col h-full">
                                    <div className="flex items-center justify-between">
                                        <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-[1.25rem] text-emerald-600 transition-transform duration-700 group-hover:scale-110 group-hover:rotate-[15deg] shadow-inner">
                                            <IndianRupee className="w-8 h-8" />
                                        </div>
                                        <Badge className="text-[9px] font-black uppercase tracking-[0.25em] bg-emerald-500 text-white border-none px-4 py-1.5 shadow-lg shadow-emerald-500/20 rounded-full">PREMIUM NODE</Badge>
                                    </div>
                                    <div className="space-y-3">
                                        <h4 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Structured Path</h4>
                                        <p className="text-[13px] font-bold text-muted-foreground leading-relaxed">
                                            End-to-end comprehensive curricula with 100% syllabus coverage, premium digital notes, and mock tests.
                                        </p>
                                    </div>
                                    <div className="mt-auto pt-8">
                                        <Button asChild className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black text-[10px] h-14 rounded-2xl shadow-xl transition-all uppercase tracking-[0.2em] group/btn">
                                            <Link href="/paid-courses" className="flex items-center justify-center">
                                                VIEW BATCHES
                                                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                                            </Link>
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Live Classes */}
                            <Card className="group relative border border-slate-200 dark:border-slate-800 bg-white dark:bg-card hover:border-indigo-300 transition-all duration-500 rounded-[2.5rem] shadow-xl hover:shadow-2xl hover:-translate-y-2 border-t-[12px] border-t-indigo-500 overflow-hidden">
                                <CardContent className="p-10 space-y-8 flex flex-col h-full">
                                    <div className="flex items-center justify-between">
                                        <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-[1.25rem] text-indigo-600 transition-transform duration-700 group-hover:scale-110 group-hover:rotate-[15deg] shadow-inner">
                                            <Monitor className="w-8 h-8" />
                                        </div>
                                        <Badge className="text-[9px] font-black uppercase tracking-[0.25em] bg-indigo-500 text-white border-none px-4 py-1.5 shadow-lg shadow-indigo-500/20 rounded-full">ACTIVE NODE</Badge>
                                    </div>
                                    <div className="space-y-3">
                                        <h4 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Real-Time Sync</h4>
                                        <p className="text-[13px] font-bold text-muted-foreground leading-relaxed">
                                            Interactive real-time sessions with top faculty. Instant doubt clearing via our proprietary 2-Teacher model.
                                        </p>
                                    </div>
                                    <div className="mt-auto pt-8">
                                        <Button asChild className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black text-[10px] h-14 rounded-2xl shadow-xl transition-all uppercase tracking-[0.2em] group/btn">
                                            <Link href="/book-demo" className="flex items-center justify-center">
                                                BOOK LIVE DEMO
                                                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                                            </Link>
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
