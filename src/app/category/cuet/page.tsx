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
    Sigma
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

// Subjects for CUET UG/PG
const cuetSubjects = [
    { name: "Language (Section IA & IB)", key: "language", icon: <BookOpen className="w-5 h-5" />, color: "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400" },
    { name: "Domain Specific Subjects", key: "domain", icon: <Sigma className="w-5 h-5" />, color: "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400" },
    { name: "General Test (Section III)", key: "gat", icon: <GraduationCap className="w-5 h-5" />, color: "bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400" },
];

export default function CuetPage() {
    const [activeTab, setActiveTab] = useState('ug');
    
    const resourceCards = [
        {
          title: "GET THE",
          subtitle: `CUET ${activeTab.toUpperCase()} Advantage`,
          icon: <Sparkles />,
          bgColor: "bg-amber-50 border-amber-100",
          textColor: "text-amber-900",
          iconBg: "bg-amber-100 text-amber-600",
          href: "/about"
        },
        {
          title: "REVISION",
          subtitle: "High-Quality Notes",
          icon: <BookOpen />,
          bgColor: "bg-blue-50 border-blue-100",
          textColor: "text-blue-900",
          iconBg: "bg-blue-100 text-blue-600",
          href: "/resources/notes"
        },
         {
          title: "SOLUTIONS",
          subtitle: "Mock Tests & PYQs",
          icon: <Book />,
          bgColor: "bg-indigo-50 border-indigo-100",
          textColor: "text-indigo-900",
          iconBg: "bg-indigo-100 text-indigo-600",
          href: "/resources/ncert-solutions"
        }
    ];

    return (
        <div className="container mx-auto py-2 px-4 md:px-6 max-w-7xl relative">
            <section className="mb-12 animate-fade-in-up">
                <div className="relative rounded-2xl overflow-hidden border border-border/50 bg-white shadow-sm">
                    <div className="relative w-full aspect-video md:aspect-[16/6]">
                        <Image
                            src="/result.jpg"
                            alt="CUET Results Banner"
                            data-ai-hint="exam result banner"
                            fill
                            className="object-cover"
                        />
                    </div>
                </div>
            </section>

            <section className="mb-16 animate-fade-in-up">
              <div className="flex flex-col items-start gap-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 border border-primary/10 text-primary text-[10px] font-bold uppercase tracking-wide">
                    <Sparkles className="w-3 h-3 text-yellow-500" />
                    CUET Preparation
                </div>
                <h1 className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight text-left leading-tight text-balance">
                    <span className="relative inline-block">
                        <span className="relative z-10">CUET {activeTab.toUpperCase()} 2026-2027</span>
                        <div className="absolute -bottom-1 left-0 w-full h-3 z-0">
                            <svg viewBox="0 0 100 15" preserveAspectRatio="none" className="w-full h-full text-blue-500 fill-none stroke-current stroke-[10] opacity-70">
                                <path d="M0,15 Q50,5 100,15" />
                            </svg>
                        </div>
                    </span> <br/>
                    <span className="text-primary text-sm md:text-base font-bold">Application, Syllabus, Pattern & Cutoff</span>
                </h1>
                <p className="max-w-3xl text-left text-muted-foreground text-sm md:text-base font-bold leading-relaxed">
                    CUET {activeTab.toUpperCase()} 2026 is the Common University Entrance Test for admissions in various Central, State, Private, and Deemed universities across India. 
                    {activeTab === 'ug' && " The official notification has been released & the registration started from 3 January to 30 January 2026."}
                </p>
              </div>
            </section>
            
            <div className="mb-12">
                <div className="overflow-x-auto pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    <div className="flex justify-start md:justify-center items-center gap-3 whitespace-nowrap px-4 sm:px-0">
                        <Button 
                            onClick={() => setActiveTab('ug')} 
                            variant="outline"
                            className={cn(
                                "rounded-full px-6 py-2 text-sm font-bold transition-all duration-300 border bg-transparent h-9 shadow-none whitespace-nowrap",
                                activeTab === 'ug' ? "border-primary text-primary bg-primary/5" : "border-muted-foreground/20 text-muted-foreground hover:border-primary/50"
                            )}
                        >
                            CUET UG
                        </Button>
                        <Button 
                            onClick={() => setActiveTab('pg')} 
                            variant="outline"
                            className={cn(
                                "rounded-full px-6 py-2 text-sm font-bold transition-all duration-300 border bg-transparent h-9 shadow-none whitespace-nowrap",
                                activeTab === 'pg' ? "border-primary text-primary bg-primary/5" : "border-muted-foreground/20 text-muted-foreground hover:border-primary/50"
                            )}
                        >
                            CUET PG
                        </Button>
                    </div>
                </div>
            </div>
    
            <section className="mb-16 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
                    {resourceCards.map((card, index) => {
                        return (
                            <Link key={index} href={card.href} className="group">
                                <div className={cn(
                                    "flex items-center gap-4 p-5 rounded-xl transition-all duration-300 shadow-sm border group-hover:shadow-md group-hover:scale-[1.02] active:scale-[0.98]",
                                    card.bgColor
                                )}>
                                    <div className={cn("p-3 rounded-xl shrink-0 transition-transform group-hover:rotate-12 shadow-sm", card.iconBg)}>
                                        {React.cloneElement(card.icon as React.ReactElement, { className: "w-6 h-6" })}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className={cn("text-[13px] font-black uppercase tracking-tight leading-tight", card.title)}>{card.title}</h4>
                                        <p className={cn("text-[11px] font-bold opacity-80 truncate", card.textColor)}>{card.subtitle}</p>
                                    </div>
                                    <ArrowRight className={cn("w-5 h-5 transition-all group-hover:translate-x-1", card.textColor)} />
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </section>

            <section className="mb-16 animate-fade-in-up" style={{animationDelay: '0.3s'}}>
                <div className="space-y-6">
                    <div className="flex items-center gap-3 border-l-4 border-primary pl-4">
                        <div>
                            <h3 className="font-bold text-xl md:text-2xl text-foreground uppercase tracking-tight text-primary">
                                Subject-wise Syllabus
                            </h3>
                            <p className="text-[10px] md:text-xs text-muted-foreground font-bold uppercase tracking-wide mt-1">Official curriculum for CUET {activeTab.toUpperCase()}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {cuetSubjects.map((subject) => (
                            <div key={subject.key} className="group bg-primary/[0.02] dark:bg-primary/[0.05] p-4 rounded-xl shadow-sm border border-primary/10 hover:border-primary/30 hover:shadow-md transition-all flex flex-col sm:flex-row items-center justify-between gap-4 border-l-4 border-l-primary/20 hover:border-l-primary">
                                <div className="flex items-center gap-4 w-full">
                                    <div className={cn("p-3 rounded-lg shrink-0 transition-transform duration-500 group-hover:scale-105 shadow-sm", subject.color)}>
                                        <BookOpen className="w-5 h-5" />
                                    </div>
                                    <div className="space-y-0.5">
                                        <h4 className="font-bold text-sm text-foreground tracking-tight leading-tight">{subject.name}</h4>
                                        <p className="text-[9px] text-muted-foreground font-medium uppercase tracking-wide opacity-80">Academic Session 2026-27</p>
                                    </div>
                                </div>
                                <div className="flex flex-row items-center gap-2 w-full sm:w-auto shrink-0">
                                    <Button variant="outline" size="sm" className="flex-1 sm:w-24 h-8 rounded-lg text-[9px] font-bold tracking-wide uppercase text-blue-600 border-blue-200 hover:bg-blue-50 transition-all shadow-none">
                                        <div className="flex items-center">
                                            <Eye className="w-3.5 h-3.5 mr-1.5" />
                                            <span>VIEW PDF</span>
                                        </div>
                                    </Button>
                                    <Button variant="outline" size="sm" className="flex-1 sm:w-24 h-8 rounded-lg text-[9px] font-bold tracking-wide uppercase text-emerald-600 border-emerald-200 hover:bg-emerald-50 transition-all shadow-none">
                                        <div className="flex items-center">
                                            <Download className="w-3.5 h-3.5 mr-1.5" />
                                            <span>Get PDF</span>
                                        </div>
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="mb-16 animate-fade-in-up" style={{animationDelay: '0.4s'}}>
                <div className="space-y-8">
                    <div className="flex items-center gap-3 border-l-4 border-primary pl-4">
                        <div>
                            <h3 className="font-bold text-xl md:text-2xl text-foreground uppercase tracking-tight text-primary">
                                Choose Your Learning Path
                            </h3>
                            <p className="text-[10px] md:text-xs text-muted-foreground font-bold uppercase tracking-wide mt-1">Premium solutions for every aspirant</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Free Courses */}
                        <Card className="group relative border bg-white dark:bg-card hover:border-orange-200 transition-all duration-300 rounded-xl shadow-sm hover:shadow-md border-t-4 border-t-orange-500 overflow-hidden">
                            <CardContent className="p-6 space-y-4 flex flex-col h-full">
                                <div className="flex items-center justify-between">
                                    <div className="p-2.5 bg-orange-50 rounded-lg text-orange-600">
                                        <PlayCircle className="w-6 h-6" />
                                    </div>
                                    <Badge variant="outline" className="text-[8px] font-bold uppercase tracking-widest border-orange-200 text-orange-600 bg-orange-50/50">ACCESS</Badge>
                                </div>
                                <div className="space-y-1">
                                    <h4 className="text-base font-black text-foreground uppercase tracking-tight">Free Courses</h4>
                                    <p className="text-[11px] font-bold text-muted-foreground leading-relaxed">
                                        Access expert-led video lessons at no cost. Perfect for foundation building and revisions.
                                    </p>
                                </div>
                                <div className="mt-auto pt-4">
                                    <Button asChild variant="outline" className="w-full border-orange-500 text-orange-600 hover:bg-orange-500 hover:text-white font-bold text-sm h-12 rounded-lg shadow-none transition-all">
                                        <Link href="/free-courses">Explore Free Courses</Link>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Paid Courses */}
                        <Card className="group relative border bg-white dark:bg-card hover:border-emerald-200 transition-all duration-300 rounded-xl shadow-sm hover:shadow-md border-t-4 border-t-emerald-500 overflow-hidden">
                            <CardContent className="p-6 space-y-4 flex flex-col h-full">
                                <div className="flex items-center justify-between">
                                    <div className="p-2.5 bg-emerald-50 rounded-lg text-emerald-600">
                                        <IndianRupee className="w-6 h-6" />
                                    </div>
                                    <Badge variant="outline" className="text-[8px] font-bold uppercase tracking-widest border-emerald-200 text-emerald-600 bg-emerald-50/50">PREMIUM</Badge>
                                </div>
                                <div className="space-y-1">
                                    <h4 className="text-base font-black text-foreground uppercase tracking-tight">Paid Courses</h4>
                                    <p className="text-[11px] font-bold text-muted-foreground leading-relaxed">
                                        Comprehensive curricula with structured paths, premium notes, and 100% coverage.
                                    </p>
                                </div>
                                <div className="mt-auto pt-4">
                                    <Button asChild variant="outline" className="w-full border-emerald-500 text-emerald-600 hover:bg-emerald-500 hover:text-white font-bold text-sm h-12 rounded-lg shadow-none transition-all">
                                        <Link href="/paid-courses">Explore Paid Courses</Link>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Live Classes */}
                        <Card className="group relative border bg-white dark:bg-card hover:border-indigo-200 transition-all duration-300 rounded-xl shadow-sm hover:shadow-md border-t-4 border-t-indigo-500 overflow-hidden">
                            <CardContent className="p-6 space-y-4 flex flex-col h-full">
                                <div className="flex items-center justify-between">
                                    <div className="p-2.5 bg-indigo-50 rounded-lg text-indigo-600">
                                        <Monitor className="w-6 h-6" />
                                    </div>
                                    <Badge variant="outline" className="text-[8px] font-bold uppercase tracking-widest border-indigo-200 text-indigo-600 bg-indigo-50/50">LIVE</Badge>
                                </div>
                                <div className="space-y-1">
                                    <h4 className="text-base font-black text-foreground uppercase tracking-tight">Live Classes</h4>
                                    <p className="text-[11px] font-bold text-muted-foreground leading-relaxed">
                                        Interactive real-time sessions with top faculty. Instant doubt clearing and peer learning.
                                    </p>
                                </div>
                                <div className="mt-auto pt-4">
                                    <Button asChild variant="outline" className="w-full border-indigo-500 text-indigo-600 hover:bg-indigo-500 hover:text-white font-bold text-sm h-12 rounded-lg shadow-none transition-all">
                                        <Link href="/book-demo">Join Live Session</Link>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>
        </div>
    );
}
