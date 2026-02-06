'use client';

import React, { useState, useEffect, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, FileText, GraduationCap, Sparkles, Monitor, ClipboardList, Eye, Download, Sigma, TestTube2, BookText, Landmark, Book, Scale, TrendingUp } from "lucide-react";
import Link from "next/link";
import { useSearchParams, useRouter } from 'next/navigation';
import { cn } from "@/lib/utils";

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
    
    const currentSubjects = (activeTab === "Class 11" || activeTab === "Class 12") ? seniorSubjects : schoolSubjects;

    const resourceCards = [
        {
          title: "GET THE\nIDL Advantage",
          icon: <Sparkles />,
          color: "bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400",
          href: "/about"
        },
        {
          title: "REVISION\nHigh-Quality Notes",
          icon: <BookOpen />,
          color: "bg-sky-50 text-sky-600 dark:bg-sky-900/20 dark:text-sky-400",
          href: "/resources/notes"
        },
         {
          title: "SOLUTIONS\nNCERT Step-by-Step",
          icon: <Book />,
          color: "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400",
          href: "/resources/ncert-solutions"
        }
    ];

    return (
        <div className="container mx-auto py-12 px-4 md:px-6 max-w-7xl relative">
            <section className="mb-16 animate-fade-in-up">
              <div className="flex flex-col items-start gap-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 border border-primary/10 text-primary text-[10px] font-bold uppercase tracking-[0.2em]">
                    <Sparkles className="w-3 h-3 text-yellow-500" />
                    Academic Prep
                </div>
                <h1 className="text-xl md:text-3xl font-black text-foreground tracking-tight text-left leading-tight text-balance">
                    {activeTab} CBSE 2026-2027 <br/>
                    <span className="text-primary text-lg md:text-xl">Syllabus, Date Sheet & Mock Tests</span>
                </h1>
                <p className="max-w-3xl text-left text-muted-foreground text-sm md:text-base font-medium leading-relaxed">
                    Comprehensive preparation resources specifically for {activeTab}. Get expert guidance, structured courses, and premium study materials to excel in your examinations.
                </p>
              </div>
            </section>
            
            <div className="mb-12">
                <div className="overflow-x-auto pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    <div className="flex justify-start md:justify-center items-center gap-3 whitespace-nowrap px-4 sm:px-0">
                        {classes.map((className) => (
                            <Button 
                                key={className}
                                onClick={() => handleClassChange(className)} 
                                variant="outline"
                                className={cn(
                                    "rounded-full px-6 py-2 text-sm font-semibold transition-all duration-300 border bg-transparent h-9 shadow-none whitespace-nowrap",
                                    activeTab === className ? "border-primary text-primary bg-primary/5" : "border-muted-foreground/20 text-muted-foreground hover:border-primary/50"
                                )}
                            >
                                {className}
                            </Button>
                        ))}
                    </div>
                </div>
            </div>
    
            {/* Resources Section */}
            <section className="mb-16 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
                    {resourceCards.map((card, index) => {
                        const [header, subtitle] = card.title.split('\n');
                        return (
                            <Link key={index} href={card.href} className="group">
                                <div className="flex items-center gap-4 p-4 bg-muted/20 hover:bg-white dark:hover:bg-card border border-transparent hover:border-primary/20 rounded-2xl transition-all duration-300 shadow-sm">
                                    <div className={cn("p-3 rounded-full shrink-0 group-hover:scale-110 transition-transform", card.color)}>
                                        {React.cloneElement(card.icon as React.ReactElement, { className: "w-6 h-6" })}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-[11px] font-black uppercase tracking-widest text-foreground leading-tight">{header}</h4>
                                        <p className="text-[10px] font-bold text-muted-foreground truncate">{subtitle}</p>
                                    </div>
                                    <ArrowRight className="w-4 h-4 text-muted-foreground/30 group-hover:text-primary transition-all group-hover:translate-x-1" />
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </section>

            {/* Separate Syllabus Section */}
            <section className="mb-16 animate-fade-in-up" style={{animationDelay: '0.3s'}}>
                <div className="space-y-6">
                    <div className="flex items-center gap-3 border-l-4 border-primary pl-4">
                        <div>
                            <h3 className="font-black text-xl md:text-2xl text-foreground uppercase tracking-tight text-primary">
                                Subject-wise Syllabus
                            </h3>
                            <p className="text-[10px] md:text-xs text-muted-foreground font-bold uppercase tracking-widest mt-1">Official curriculum for {activeTab}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {currentSubjects.map((subject) => (
                            <div key={subject.key} className="group bg-white dark:bg-card p-4 md:p-5 rounded-[1.5rem] shadow-sm border hover:shadow-md transition-all flex items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <div className={cn("p-3.5 rounded-full shrink-0 transition-transform duration-500 group-hover:scale-110", subject.color)}>
                                        {subject.icon}
                                    </div>
                                    <div>
                                        <h4 className="font-black text-base md:text-lg text-foreground tracking-tight">{subject.name}</h4>
                                        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-tighter">Academic Year 2026-27</p>
                                    </div>
                                </div>
                                <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2">
                                    <Button variant="ghost" size="sm" className="h-9 w-32 rounded-full text-[10px] font-black tracking-widest uppercase text-blue-600 bg-blue-50/50 hover:bg-blue-100 transition-all px-0 border border-blue-100 flex items-center justify-center shadow-sm">
                                        <Eye className="w-3.5 h-3.5 mr-1.5" />
                                        <span>VIEW PDF</span>
                                    </Button>
                                    <Button variant="ghost" size="sm" className="h-9 w-32 rounded-full text-[10px] font-black tracking-widest uppercase text-emerald-600 bg-emerald-50/50 hover:bg-emerald-100 transition-all px-0 border border-emerald-100 flex items-center justify-center shadow-sm">
                                        <Download className="w-3.5 h-3.5 mr-1.5" />
                                        <span>Get PDF</span>
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
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground animate-pulse">Loading Resources</p>
            </div>
        }>
            <SchoolPageContent />
        </Suspense>
    );
}