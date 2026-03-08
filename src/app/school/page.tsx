'use client';

import React, { useState, useEffect, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { 
    ArrowRight, 
    BookOpen, 
    GraduationCap, 
    Sparkles, 
    Book, 
    Sigma, 
    TestTube2, 
    BookText, 
    Landmark, 
    Scale, 
    TrendingUp, 
    Eye, 
    Download, 
    Home,
    MapPin
} from "lucide-react";
import Link from "next/link";
import { useSearchParams, useRouter } from 'next/navigation';
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const schoolSubjects = [
    { name: "Science", key: "science", icon: <TestTube2 className="w-5 h-5" />, color: "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400" },
    { name: "Mathematics", key: "maths", icon: <Sigma className="w-5 h-5" />, color: "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400" },
    { name: "English", key: "english", icon: <BookText className="w-5 h-5" />, color: "bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400" },
    { name: "Social Studies", key: "social", icon: <Landmark className="w-5 h-5" />, color: "bg-rose-50 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400" },
];

const seniorSubjects = [
    { name: "Political", key: "political-science", icon: <Scale className="w-5 h-5" />, color: "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400" },
    { name: "History", key: "history", icon: <Landmark className="w-5 h-5" />, color: "bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400" },
    { name: "English", key: "english", icon: <BookText className="w-5 h-5" />, color: "bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400" },
    { name: "Economics", key: "economics", icon: <TrendingUp className="w-5 h-5" />, color: "bg-pink-50 text-pink-600 dark:bg-pink-900/20 dark:text-pink-400" },
];

function SchoolPageContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const classParam = searchParams.get('class') || 'Class 10';
    
    const [activeTab, setActiveTab] = useState(classParam);
    const classes = ["Class 8", "Class 9", "Class 10", "Class 11", "Class 12"];
    
    useEffect(() => {
        if(classParam) {
            setActiveTab(classParam);
        }
    }, [classParam]);

    const handleClassChange = (className: string) => {
        setActiveTab(className);
        router.push(`/school?class=${encodeURIComponent(className)}`, { scroll: false });
    };
    
    const quickInfoCards = [
        {
            title: "GET THE",
            subtitle: `Advantage For ${activeTab}`,
            icon: <Sparkles />,
            color: "text-amber-600",
            iconBg: "bg-amber-50",
            href: "/about"
        },
        {
            title: "REVISION",
            subtitle: "High-Quality Notes",
            icon: <BookOpen />,
            color: "text-blue-600",
            iconBg: "bg-blue-50",
            href: "/resources/notes"
        },
        {
            title: "SOLUTIONS",
            subtitle: "NCERT Step-by-Step",
            icon: <Book />,
            color: "text-indigo-600",
            iconBg: "bg-indigo-50",
            href: "/resources/ncert-solutions"
        }
    ];

    const currentSubjects = (activeTab === "Class 11" || activeTab === "Class 12") ? seniorSubjects : schoolSubjects;

    return (
        <div className="container mx-auto py-6 md:py-10 px-4 md:px-6 max-w-7xl relative">
            <section className="mb-6 animate-fade-in-up">
                <div className="relative rounded-2xl overflow-hidden border border-border/50 bg-white shadow-sm">
                    <div className="relative w-full aspect-video md:aspect-[16/6]">
                        <Image
                            src="/result.jpg"
                            alt="Academic Banners"
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>
                </div>
            </section>

            <section className="mb-10 text-center md:text-left animate-fade-in-up">
              <div className="flex flex-col items-center md:items-start gap-3">
                <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-tight uppercase">
                    TARGET <span className="text-primary">{activeTab} CBSE</span> 2026
                </h1>
                <p className="w-full text-slate-600 dark:text-slate-400 text-sm font-medium leading-relaxed text-left">
                    Comprehensive preparation resources specifically for {activeTab}. Get expert guidance, structured courses, and premium study materials to excel in your examinations.
                </p>
              </div>
            </section>
            
            <div className="mb-8">
                <div className="overflow-x-auto pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    <div className="flex justify-start md:justify-center items-center gap-3 whitespace-nowrap px-4 sm:px-0">
                        {classes.map((className) => (
                            <Button 
                                key={className}
                                onClick={() => handleClassChange(className)} 
                                variant="outline"
                                className={cn(
                                    "rounded-full px-6 py-2 text-sm font-bold transition-all duration-300 border bg-transparent h-9 shadow-none whitespace-nowrap",
                                    activeTab === className ? "border-primary text-primary bg-primary/5" : "border-muted-foreground/20 text-muted-foreground hover:border-primary/50"
                                )}
                            >
                                {className}
                            </Button>
                        ))}
                    </div>
                </div>
            </div>
    
            {/* Redesigned Quick Info Cards matching CUET Portal style */}
            <section className="mb-12 animate-fade-in-up" style={{animationDelay: '0.15s'}}>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
                    {quickInfoCards.map((card, index) => (
                        <Link 
                            key={index} 
                            href={card.href} 
                            className="group/card h-full"
                        >
                            <div className="flex items-center gap-4 p-5 rounded-xl transition-all duration-500 shadow-sm border border-slate-100 bg-white dark:bg-slate-900/50 hover:shadow-xl hover:border-primary/30 h-full group/item relative overflow-hidden text-left">
                                <div className="absolute bottom-0 left-0 w-0 h-1 bg-primary transition-all duration-500 group-hover/card:w-full" />
                                <div className={cn(
                                    "p-3 rounded-xl shrink-0 border border-slate-100 dark:border-slate-800 shadow-sm transition-all duration-500 group-hover/card:rotate-6 group-hover/card:scale-110", 
                                    card.iconBg, 
                                    card.color
                                )}>
                                    {React.cloneElement(card.icon as React.ReactElement, { className: "w-5 h-5" })}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="text-[12px] font-black leading-tight text-slate-900 dark:text-white uppercase tracking-tight group-hover/card:text-primary transition-colors">
                                        <span className="block opacity-60 text-[10px] mb-0.5">{card.title}</span>
                                        <span className="block">{card.subtitle}</span>
                                    </h4>
                                </div>
                                <div className="bg-primary/5 rounded-full p-1 opacity-0 group-hover/card:opacity-100 transition-all transform translate-x-2 group-hover/card:translate-x-0">
                                    <ArrowRight className="w-3.5 h-3.5 text-primary" />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            <section className="mb-16 animate-fade-in-up" style={{animationDelay: '0.3s'}}>
                <div className="space-y-6">
                    <div className="flex items-center gap-3 border-l-4 border-primary pl-4">
                        <div>
                            <h3 className="font-bold text-xl md:text-2xl text-foreground uppercase tracking-tight text-primary">
                                Subject-wise Syllabus
                            </h3>
                            <p className="text-[10px] md:text-xs text-muted-foreground font-bold uppercase tracking-wide mt-1">Official curriculum for {activeTab}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {currentSubjects.map((subject) => (
                            <div key={subject.key} className="group relative bg-white dark:bg-slate-900 p-5 rounded-2xl border border-muted-foreground/10 hover:border-primary/30 hover:shadow-xl transition-all duration-300 flex flex-col sm:flex-row items-center justify-between gap-4 overflow-hidden">
                                <div className="absolute top-0 left-0 w-1 h-full bg-primary/10 group-hover:bg-primary transition-colors duration-300" />
                                <div className="flex items-center gap-4 w-full relative z-10">
                                    <div className={cn("p-3.5 rounded-xl shrink-0 transition-all duration-500 group-hover:scale-110 shadow-sm", subject.color)}>
                                        {React.cloneElement(subject.icon as React.ReactElement, { className: "w-5 h-5" })}
                                    </div>
                                    <div className="space-y-1">
                                        <h4 className="font-extrabold text-[15px] text-foreground tracking-tight leading-tight">{subject.name}</h4>
                                        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest opacity-60">Academic Session 2026-27</p>
                                    </div>
                                </div>
                                <div className="flex flex-row items-center gap-2 w-full sm:w-auto shrink-0 relative z-10">
                                    <Button variant="outline" size="sm" className="flex-1 sm:w-24 h-9 rounded-xl text-[9px] font-black tracking-widest uppercase text-blue-600 border-blue-100 hover:bg-blue-50 transition-all shadow-none">
                                        <div className="flex items-center">
                                            <Eye className="w-3.5 h-3.5 mr-1.5" />
                                            <span>VIEW</span>
                                        </div>
                                    </Button>
                                    <Button variant="outline" size="sm" className="flex-1 sm:w-24 h-9 rounded-xl text-[9px] font-black tracking-widest uppercase text-emerald-600 border-emerald-100 hover:bg-emerald-50 transition-all shadow-none">
                                        <div className="flex items-center">
                                            <Download className="w-3.5 h-3.5 mr-1.5" />
                                            <span>GET</span>
                                        </div>
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}

export default function SchoolPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-background">
                <GraduationCap className="w-12 h-12 text-primary animate-bounce" />
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground animate-pulse">Loading Resources</p>
            </div>
        }>
            <SchoolPageContent />
        </Suspense>
    );
}
