
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
    Monitor,
    CheckCircle2
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
                <div className="relative rounded-2xl overflow-hidden border border-border/50 bg-white shadow-sm">
                    <div className="relative w-full aspect-video md:aspect-[16/6]">
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
                <h1 className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight text-left leading-tight text-balance">
                    <span className="relative inline-block">
                        <span className="relative z-10">{activeTab} CBSE 2026-2027</span>
                        <div className="absolute -bottom-1 left-0 w-full h-3 z-0">
                            <svg viewBox="0 0 100 15" preserveAspectRatio="none" className="w-full h-full text-blue-500 fill-none stroke-current stroke-[10] opacity-70">
                                <path d="M0,15 Q50,5 100,15" />
                            </svg>
                        </div>
                    </span> <br/>
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
                        <Card className="group relative border border-primary/5 bg-gradient-to-br from-white to-orange-50/30 dark:from-card dark:to-orange-950/10 hover:border-orange-200 transition-all duration-500 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-2 border-t-4 border-t-orange-500 overflow-hidden">
                            <CardContent className="p-8 space-y-6 flex flex-col h-full">
                                <div className="flex items-center justify-between">
                                    <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-xl text-orange-600 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3 shadow-sm">
                                        <PlayCircle className="w-7 h-7" />
                                    </div>
                                    <Badge className="text-[9px] font-black uppercase tracking-[0.2em] bg-orange-500 text-white border-none px-3 py-1 shadow-md shadow-orange-500/20">ACCESS</Badge>
                                </div>
                                <div className="space-y-2">
                                    <h4 className="text-lg font-black text-foreground uppercase tracking-tight">Free Courses</h4>
                                    <p className="text-[12px] font-bold text-muted-foreground/80 leading-relaxed">
                                        Access expert-led video lessons at no cost. Perfect for foundation building and revisions.
                                    </p>
                                </div>
                                <div className="mt-auto pt-6">
                                    <Button asChild className="w-full bg-orange-500 hover:bg-orange-600 text-white font-black text-xs h-12 rounded-xl shadow-lg shadow-orange-500/20 transition-all uppercase tracking-widest group/btn">
                                        <Link href="/free-courses">
                                            Explore Free Courses
                                            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                                        </Link>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Paid Courses */}
                        <Card className="group relative border border-primary/5 bg-gradient-to-br from-white to-emerald-50/30 dark:from-card dark:to-emerald-950/10 hover:border-emerald-200 transition-all duration-500 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-2 border-t-4 border-t-emerald-500 overflow-hidden">
                            <CardContent className="p-8 space-y-6 flex flex-col h-full">
                                <div className="flex items-center justify-between">
                                    <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl text-emerald-600 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3 shadow-sm">
                                        <IndianRupee className="w-7 h-7" />
                                    </div>
                                    <Badge className="text-[9px] font-black uppercase tracking-[0.2em] bg-emerald-500 text-white border-none px-3 py-1 shadow-md shadow-emerald-500/20">PREMIUM</Badge>
                                </div>
                                <div className="space-y-2">
                                    <h4 className="text-lg font-black text-foreground uppercase tracking-tight">Paid Courses</h4>
                                    <p className="text-[12px] font-bold text-muted-foreground/80 leading-relaxed">
                                        Comprehensive curricula with structured paths, premium notes, and 100% coverage.
                                    </p>
                                </div>
                                <div className="mt-auto pt-6">
                                    <Button asChild className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs h-12 rounded-xl shadow-lg shadow-emerald-500/20 transition-all uppercase tracking-widest group/btn">
                                        <Link href="/paid-courses">
                                            Explore Paid Courses
                                            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                                        </Link>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Live Classes */}
                        <Card className="group relative border border-primary/5 bg-gradient-to-br from-white to-indigo-50/30 dark:from-card dark:to-indigo-950/10 hover:border-indigo-200 transition-all duration-500 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-2 border-t-4 border-t-indigo-500 overflow-hidden">
                            <CardContent className="p-8 space-y-6 flex flex-col h-full">
                                <div className="flex items-center justify-between">
                                    <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl text-indigo-600 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3 shadow-sm">
                                        <Monitor className="w-7 h-7" />
                                    </div>
                                    <Badge className="text-[9px] font-black uppercase tracking-[0.2em] bg-indigo-500 text-white border-none px-3 py-1 shadow-md shadow-indigo-500/20">LIVE</Badge>
                                </div>
                                <div className="space-y-2">
                                    <h4 className="text-lg font-black text-foreground uppercase tracking-tight">Live Classes</h4>
                                    <p className="text-[12px] font-bold text-muted-foreground/80 leading-relaxed">
                                        Interactive real-time sessions with top faculty. Instant doubt clearing and peer learning.
                                    </p>
                                </div>
                                <div className="mt-auto pt-6">
                                    <Button asChild className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-black text-xs h-12 rounded-xl shadow-lg shadow-indigo-500/20 transition-all uppercase tracking-widest group/btn">
                                        <Link href="/book-demo">
                                            Join Live Session
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
