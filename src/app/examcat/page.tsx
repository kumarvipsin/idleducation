'use client';

import { useState, useEffect, Suspense, ReactElement, cloneElement } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from "@/components/ui/card";
import { 
    ArrowRight, 
    BookOpen, 
    Sparkles, 
    Book, 
    Calendar
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams, useRouter } from 'next/navigation';
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

function ExamcatPageContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const categoryParam = searchParams.get('category') || 'ssc-cgl';
    const [activeTab, setActiveTab] = useState(categoryParam);
    
    useEffect(() => {
        if(categoryParam) {
            setActiveTab(categoryParam);
        }
    }, [categoryParam]);

    const handleTabChange = (tab: string) => {
        setActiveTab(tab);
        router.push(`/examcat?category=${encodeURIComponent(tab)}`, { scroll: false });
    };
    
    const quickInfoCards = [
        {
            title: "GET THE",
            subtitle: "Govt Job Advantage",
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
            subtitle: "PYQs & Mock Tests",
            icon: <Book />,
            color: "text-indigo-600",
            iconBg: "bg-indigo-50",
            href: "/resources/ncert-solutions"
        }
    ];

    const sscCourses = [
      {
        title: "SSC CGL Foundation Batch 2026 (Tier I & II)",
        imageUrl: "https://www.pw.live/version14/assets/img/cuet-ug-2024/cuet-commerce-3.png",
        imageHint: "government building",
        language: "Hinglish",
        startDate: "20 Nov, 2025",
        endDate: "30 Jun, 2026",
        features: "Premium Features Included",
        price: 1999,
        originalPrice: 12000,
        discount: 83,
        target: "For SSC CGL 2026 Aspirants"
      },
      {
        title: "SSC CHSL Complete Course 2026",
        imageUrl: "https://www.pw.live/version14/assets/img/cuet-ug-2024/cuet-ug-gat.png",
        imageHint: "office work",
        language: "Hinglish",
        startDate: "15 Jan, 2026",
        endDate: "31 May, 2026",
        price: 1499,
        originalPrice: 8000,
        discount: 81,
        target: "For SSC CHSL 2026 Aspirants"
      },
      {
        title: "SSC GD Constable Batch 2026",
        imageUrl: "https://www.pw.live/version14/assets/img/cuet-ug-2024/cuet-commerce-2.png",
        imageHint: "police officers",
        language: "Hinglish",
        startDate: "01 Feb, 2026",
        endDate: "30 Jul, 2026",
        price: 999,
        originalPrice: 5000,
        discount: 80,
        target: "Targeted Batch for SSC GD 2026"
      }
    ];

    const tabTitleMapping: { [key: string]: string } = {
        'ssc-mts': 'SSC MTS',
        'ssc-chsl': 'SSC CHSL',
        'ssc-cgl': 'SSC CGL',
        'delhi-police': 'Delhi Police',
        'govt-job-exams': 'Govt Job'
    };

    return (
        <div className="container mx-auto py-2 px-4 md:px-6 max-w-7xl relative">
            <section className="mb-12 animate-fade-in-up">
                <div className="relative rounded-2xl overflow-hidden border border-border/50 bg-white shadow-none">
                    <div className="relative w-full aspect-video md:aspect-[16/6]">
                        <Image
                            src="/result.jpg"
                            alt="Government Exams Results"
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
                    Government Job Prep
                </div>
                <h1 className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight text-left leading-tight text-balance">
                    <span className="relative inline-block">
                        <span className="relative z-10">{(tabTitleMapping[activeTab] || 'Govt Job')} 2026-2027</span>
                        <div className="absolute -bottom-1 left-0 w-full h-3 z-0">
                            <svg viewBox="0 0 100 15" preserveAspectRatio="none" className="w-full h-full text-blue-500 fill-none stroke-current stroke-[10] opacity-70">
                                <path d="M0,15 Q50,5 100,15" />
                            </svg>
                        </div>
                    </span> <br/>
                    <span className="text-primary text-sm md:text-base font-bold">Application, Syllabus, Pattern & Notifications</span>
                </h1>
                <p className="max-w-3xl text-left text-muted-foreground text-sm md:text-base font-bold leading-relaxed">
                    Your ultimate destination for {(tabTitleMapping[activeTab] || 'Govt Job')} preparation. Access the latest notifications, detailed syllabus, and the most reliable study materials to secure your future.
                </p>
              </div>
            </section>
            
            <div className="mb-12">
                <div className="overflow-x-auto pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    <div className="flex justify-start md:justify-center items-center gap-3 whitespace-nowrap px-4 sm:px-0">
                        {Object.entries(tabTitleMapping).map(([key, label]) => (
                            <Button 
                                key={key}
                                onClick={() => handleTabChange(key)} 
                                variant="outline"
                                className={cn(
                                    "rounded-full px-6 py-2 text-sm font-bold transition-all duration-300 border bg-transparent h-9 shadow-none whitespace-nowrap",
                                    activeTab === key ? "border-primary text-primary bg-primary/5" : "border-muted-foreground/20 text-muted-foreground hover:border-primary/50"
                                )}
                            >
                                {label}
                            </Button>
                        ))}
                    </div>
                </div>
            </div>
    
            {/* Redesigned Quick Info Cards matching CUET Portal style */}
            <section className="mb-16 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
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
                                    {cloneElement(card.icon as ReactElement, { className: "w-6 h-6" })}
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
                <div className="space-y-8">
                    <div className="flex items-center gap-3 border-l-4 border-primary pl-4">
                        <div>
                            <h3 className="font-bold text-xl md:text-2xl text-foreground uppercase tracking-tight text-primary">
                                Popular Exam Courses
                            </h3>
                            <p className="text-[10px] md:text-xs text-muted-foreground font-bold uppercase tracking-wide mt-1">Structured learning for {(tabTitleMapping[activeTab] || 'Govt Job')}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {sscCourses.map((course, index) => (
                        <Card key={index} className="rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 flex flex-col group/card border-muted-foreground/10">
                            <div className="relative aspect-video w-full overflow-hidden">
                                <div className="absolute top-2 left-2 bg-primary/90 text-white text-[9px] font-bold px-2 py-0.5 rounded-full z-10 shadow-sm uppercase tracking-wider">ONLINE</div>
                                <Image
                                    src={course.imageUrl}
                                    alt={course.title}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover/card:scale-105"
                                />
                            </div>
                            <CardContent className="p-5 flex flex-col flex-grow text-left">
                                <h3 className="font-extrabold text-base leading-tight mb-2 group-hover/card:text-primary transition-colors line-clamp-2">{course.title}</h3>
                                
                                <div className="flex items-center gap-2 mb-3">
                                    <Badge variant="secondary" className="text-[9px] font-bold uppercase tracking-widest bg-muted/50">{course.language}</Badge>
                                    <Badge variant="outline" className="text-[9px] font-bold uppercase tracking-widest">{course.target}</Badge>
                                </div>

                                <div className="space-y-1.5 mb-4">
                                    <p className="text-[10px] text-muted-foreground flex items-center gap-1.5 font-bold uppercase tracking-tight"><Calendar className="w-3 h-3" /> {course.startDate} - {course.endDate}</p>
                                </div>
                                
                                <div className="mt-auto pt-4 border-t border-muted-foreground/5">
                                    <div className="flex items-baseline gap-2 mb-3">
                                        <p className="text-xl font-black text-foreground">₹{course.price}</p>
                                        <p className="text-xs text-muted-foreground line-through font-bold opacity-60">₹{course.originalPrice}</p>
                                        <Badge className="bg-green-500/10 text-green-600 border-none font-bold text-[9px] px-1.5 py-0">-{course.discount}%</Badge>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <Button variant="outline" className="w-full font-bold h-9 text-[10px] uppercase tracking-widest rounded-lg border-primary/20 hover:bg-primary/5 transition-all">EXPLORE</Button>
                                        <Button className="w-full font-bold h-9 text-[10px] uppercase tracking-widest rounded-lg shadow-md shadow-primary/10">BUY NOW</Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}

export default function ExamcatPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Skeleton className="h-96 w-full max-w-4xl rounded-[2rem]" /></div>}>
            <ExamcatPageContent />
        </Suspense>
    )
}
