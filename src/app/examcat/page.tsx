'use client';

import { useState, useEffect, Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, BookOpen, ClipboardList, Monitor, FileText, Landmark } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams, useRouter } from 'next/navigation';
import { cn } from "@/lib/utils";
import { MessageSquare, Users, Calendar } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const CheckIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2Z" fill="url(#paint0_linear_jee_blog)"/>
        <path d="M8 12.5L11 15.5L16.5 9.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <defs>
            <linearGradient id="paint0_linear_jee_blog" x1="2" y1="12" x2="22" y2="12" gradientUnits="userSpaceOnUse">
                <stop stopColor="#F97316"/>
                <stop offset="1" stopColor="#16A34A"/>
            </linearGradient>
        </defs>
    </svg>
);


function ExamcatPageContent() {
    const searchParams = useSearchParams();
    const categoryParam = searchParams.get('category');
    const [activeTab, setActiveTab] = useState(categoryParam || 'ssc-mts');
    
    useEffect(() => {
        if(categoryParam) {
            setActiveTab(categoryParam);
        }
    }, [categoryParam]);
    
    const resourceCards = [
        {
          title: "PDF Bank",
          icon: <FileText className="w-6 h-6 text-pink-600" />,
          gradient: "from-pink-100 to-rose-100 dark:from-pink-900/30 dark:to-rose-800/30",
          href: "#"
        },
        {
          title: "Test Series",
          icon: <ClipboardList className="w-6 h-6 text-green-600" />,
          gradient: "from-green-100 to-teal-100 dark:from-green-900/30 dark:to-teal-800/30",
          href: "#"
        },
        {
          title: "Books",
          icon: <BookOpen className="w-6 h-6 text-sky-600" />,
          gradient: "from-sky-100 to-blue-100 dark:from-sky-900/30 dark:to-blue-800/30",
          href: "/resources/reference-books"
        },
         {
          title: "Blogs",
          icon: <Monitor className="w-6 h-6 text-blue-600" />,
          gradient: "from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-800/30",
          href: "/blog"
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
    
    const blogLinksData: { [key: string]: { text: string; href: string }[] } = {
        'ssc-cgl': [
            { text: "SSC CGL Syllabus 2026", href: "#" },
            { text: "SSC CGL Previous Year Papers", href: "#" },
            { text: "SSC CGL Salary & Job Profile", href: "#" },
            { text: "SSC CGL Cut Off 2026", href: "#" },
        ],
        'ssc-chsl': [
            { text: "SSC CHSL Syllabus 2026", href: "#" },
            { text: "SSC CHSL Exam Pattern 2026", href: "#" },
            { text: "SSC CHSL Previous Year Papers", href: "#" },
            { text: "SSC CHSL Salary & Job Profile", href: "#" },
        ],
        'ssc-mts': [
            { text: "SSC MTS Syllabus 2026", href: "#" },
            { text: "SSC MTS Eligibility Criteria 2026", href: "#" },
            { text: "SSC MTS Previous Year Papers", href: "#" },
            { text: "SSC MTS Job Profile 2026", href: "#" },
        ],
        'delhi-police': [
            { text: "Delhi Police Syllabus 2026", href: "#" },
            { text: "Delhi Police Exam Pattern 2026", href: "#" },
            { text: "Delhi Police Previous Year Papers", href: "#" },
            { text: "Delhi Police Salary & Promotion", href: "#" },
        ],
        'govt-job-exams': [
            { text: "How to crack CGL in first attempt", href: "#" },
            { text: "IBPS PO Exam Strategy 2026", href: "#" },
            { text: "Best Books for RRB NTPC", href: "#" },
            { text: "Latest Govt Job Notifications", href: "#" },
        ]
    };
    
    const blogLinks = blogLinksData[activeTab] || blogLinksData['govt-job-exams'];

    return (
        <div className="container mx-auto py-12 px-4 md:px-6">
            <section className="mb-8 animate-fade-in-up">
                <Card className="overflow-hidden shadow-lg border-none bg-transparent">
                    <div className="relative w-full aspect-[2/1] md:aspect-[16/5] bg-muted rounded-2xl overflow-hidden">
                        <Image
                            src="/result.jpg"
                            alt="Competitive Exam Results"
                            data-ai-hint="exam result banner"
                            fill
                            className="object-contain"
                        />
                    </div>
                </Card>
            </section>

            <section className="mb-20 animate-fade-in-up">
              <h1 className="text-3xl md:text-5xl font-extrabold text-foreground tracking-tight text-left">
                {(tabTitleMapping[activeTab] || 'Govt Job')} Exams 2026: Application, Syllabus, Pattern
              </h1>
              <p className="mt-6 max-w-4xl text-left text-muted-foreground text-lg">
                Your one-stop destination for all government job exam preparations. Get complete details for SSC, Banking, Railways, and other government exams.
              </p>
            </section>
            
            <div className="mb-12">
                <div className="overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    <div className="flex justify-start md:justify-center items-center gap-4 whitespace-nowrap px-4 sm:px-0">
                        <Button onClick={() => setActiveTab('ssc-mts')} variant={activeTab === 'ssc-mts' ? 'default' : 'outline'} className="rounded-full px-6 h-10 font-bold">SSC MTS</Button>
                        <Button onClick={() => setActiveTab('ssc-chsl')} variant={activeTab === 'ssc-chsl' ? 'default' : 'outline'} className="rounded-full px-6 h-10 font-bold">SSC CHSL</Button>
                        <Button onClick={() => setActiveTab('ssc-cgl')} variant={activeTab === 'ssc-cgl' ? 'default' : 'outline'} className="rounded-full px-6 h-10 font-bold">SSC CGL</Button>
                        <Button onClick={() => setActiveTab('delhi-police')} variant={activeTab === 'delhi-police' ? 'default' : 'outline'} className="rounded-full px-6 h-10 font-bold">DELHI POLICE</Button>
                    </div>
                </div>
            </div>
    
            <section className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
                {resourceCards.map((card, index) => (
                    <Link key={index} href={card.href} className="block group h-full">
                        <Card className={`h-full rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-gradient-to-br ${card.gradient}`}>
                            <CardContent className="p-4 flex flex-col items-center justify-center text-center text-foreground h-full">
                                <div className={`mb-3 p-3 rounded-full bg-white/30`}>
                                    {card.icon}
                                </div>
                                <h3 className="text-lg font-bold mb-1">{card.title}</h3>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </section>
    
            <section className="mt-16 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                <h2 className="text-3xl font-bold text-left mb-8">{(tabTitleMapping[activeTab] || 'Govt Job')} Exam Courses</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sscCourses.map((course, index) => (
                    <Card key={index} className="rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col">
                        <div className="relative">
                        <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded-md z-10">ONLINE</div>
                        <div className="relative w-full aspect-[16/9]">
                            <Image
                            src={course.imageUrl}
                            alt={course.title}
                            data-ai-hint={course.imageHint}
                            fill
                            className="object-cover"
                            />
                        </div>
                        </div>
                        <CardContent className="p-4 flex flex-col flex-grow">
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="font-bold text-base leading-tight flex-1">{course.title}</h3>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground ml-2">
                            <span>{course.language}</span>
                            <MessageSquare className="w-4 h-4" />
                            </div>
                        </div>
                        <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1"><Users className="w-3 h-3" /> {course.target}</p>
                        <p className="text-xs text-muted-foreground mb-4 flex items-center gap-1"><Calendar className="w-3 h-3" /> Starts {course.startDate} <span className="mx-1">•</span> Ends {course.endDate}</p>
                        
                        <div className="flex items-center gap-2 mb-1">
                            <p className="text-2xl font-bold">₹{course.price}</p>
                            <p className="text-sm text-muted-foreground line-through">₹{course.originalPrice}</p>
                        </div>
                        <div className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-md mb-4 self-start">
                            Discount of {course.discount}% applied
                        </div>
                        </CardContent>
                        <div className="p-4 pt-0 mt-auto">
                            <div className="flex gap-2">
                                <Button variant="outline" className="w-full h-10 font-bold">EXPLORE</Button>
                                <Button className="w-full h-10 font-bold">BUY NOW</Button>
                            </div>
                        </div>
                    </Card>
                    ))}
                </div>
            </section>

            <section className="w-full py-16 bg-blue-950 text-white mt-16 animate-fade-in-up rounded-lg" style={{ animationDelay: '1.4s' }}>
                <div className="container mx-auto px-4 md:px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold">Explore {tabTitleMapping[activeTab] || 'Govt Job'} Blogs</h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
                    {blogLinks.map((link, index) => (
                        <Button key={index} asChild variant="ghost" className="w-full justify-between bg-white text-black hover:bg-gray-100 rounded-lg p-4 h-auto">
                            <Link href={link.href}>
                                <div className="flex items-center gap-2">
                                    <CheckIcon />
                                    <span className="text-sm font-medium text-left">{link.text}</span>
                                </div>
                                <ArrowRight className="h-5 w-5 text-gray-400" />
                            </Link>
                        </Button>
                    ))}
                    </div>
                </div>
            </section>
        </div>
    );
}

export default function ExamcatPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ExamcatPageContent />
        </Suspense>
    )
}