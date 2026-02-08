
'use client';

import React, { useState, useEffect, Suspense, useRef } from "react";
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
    PlayCircle,
    IndianRupee,
    Monitor
} from "lucide-react";
import Link from "next/link";
import { useSearchParams, useRouter } from 'next/navigation';
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
          title: "GET THE",
          subtitle: `Advantage For ${activeTab}`,
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
          subtitle: "NCERT Step-by-Step",
          icon: <Book />,
          bgColor: "bg-indigo-50 border-indigo-100",
          textColor: "text-indigo-900",
          iconBg: "bg-indigo-100 text-indigo-600",
          href: "/resources/ncert-solutions"
        }
    ];

    return (
        <div className="container mx-auto py-12 px-4 md:px-6 max-w-7xl relative">
            <section className="mb-12 animate-fade-in-up">
                <div className="relative rounded-2xl overflow-hidden border border-border/50 bg-white">
                    <div className="relative w-full aspect-[16/6]">
                        <Image
                            src="/result.jpg"
                            alt="Academic Banners"
                            data-ai-hint="students exam success"
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
                    Academic Prep
                </div>
                <h1 className="text-xl md:text-3xl font-bold text-foreground tracking-tight text-left leading-tight text-balance">
                    <span className="text-3xl md:text-6xl font-black">{activeTab} CBSE 2026-2027</span> <br/>
                    <span className="text-primary text-sm md:text-base font-bold">Syllabus, Date Sheet & Mock Tests</span>
                </h1>
                <p className="max-w-3xl text-left text-muted-foreground text-sm md:text-base font-bold leading-relaxed">
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
                                        <h4 className={cn("text-[13px] font-black uppercase tracking-tight leading-tight", card.textColor)}>{card.title}</h4>
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
                            <p className="text-[10px] md:text-xs text-muted-foreground font-bold uppercase tracking-wide mt-1">Official curriculum for {activeTab}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {currentSubjects.map((subject) => (
                            <div key={subject.key} className="group bg-white dark:bg-card p-4 rounded-xl shadow-sm border hover:shadow-md transition-all flex flex-col sm:flex-row items-center justify-between gap-4 border-l-4 border-l-primary/10 hover:border-l-primary">
                                <div className="flex items-center gap-4 w-full">
                                    <div className={cn("p-3 rounded-lg shrink-0 transition-transform duration-500 group-hover:scale-105 shadow-sm", subject.color)}>
                                        {React.cloneElement(subject.icon as React.ReactElement, { className: "w-5 h-5" })}
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
                            <p className="text-[10px] md:text-xs text-muted-foreground font-bold uppercase tracking-wide mt-1">Premium solutions for every student</p>
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
                                    <Button asChild variant="outline" className="w-full border-orange-500 text-orange-600 hover:bg-orange-500 hover:text-white font-black uppercase tracking-widest text-[10px] h-10 rounded-lg shadow-none transition-all">
                                        <Link href="/free-courses">EXPLORE FREE COURSES</Link>
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
                                    <Button asChild variant="outline" className="w-full border-emerald-500 text-emerald-600 hover:bg-emerald-500 hover:text-white font-black uppercase tracking-widest text-[10px] h-10 rounded-lg shadow-none transition-all">
                                        <Link href="/paid-courses">EXPLORE PAID COURSES</Link>
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
                                    <Button asChild variant="outline" className="w-full border-indigo-500 text-indigo-600 hover:bg-indigo-500 hover:text-white font-black uppercase tracking-widest text-[10px] h-10 rounded-lg shadow-none transition-all">
                                        <Link href="/book-demo">JOIN LIVE SESSION</Link>
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
