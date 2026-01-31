'use client';

import { useState, useEffect, Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowRight, BookOpen, ClipboardList, Monitor, FileText, Landmark } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { MessageSquare, Users, Calendar } from "lucide-react";
import { useSearchParams } from 'next/navigation';

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
    
    // Determine initial active tab based on URL param, default to 'ssc-mts'
    const [activeTab, setActiveTab] = useState(categoryParam || 'ssc-mts');
    
    useEffect(() => {
        if(categoryParam) {
            setActiveTab(categoryParam);
        }
    }, [categoryParam]);
    
    const resourceCards = [
        {
          title: "PDF Bank",
          description: "Access Our PDF Bank",
          icon: <FileText className="w-6 h-6 text-pink-600" />,
          borderColor: "border-pink-500",
          bgColor: "bg-pink-100 dark:bg-pink-900/30",
          href: "#"
        },
        {
          title: "Test Series",
          description: "Explore Our Test Series",
          icon: <ClipboardList className="w-6 h-6 text-green-600" />,
          borderColor: "border-green-500",
          bgColor: "bg-green-100 dark:bg-green-900/30",
          href: "#"
        },
        {
          title: "Books",
          description: "Find Preparation Books",
          icon: <BookOpen className="w-6 h-6 text-sky-600" />,
          borderColor: "border-sky-500",
          bgColor: "bg-sky-100 dark:bg-sky-900/30",
          href: "/resources/reference-books"
        },
         {
          title: "Blogs",
          description: "Read Our Latest Blogs",
          icon: <Monitor className="w-6 h-6 text-blue-600" />,
          borderColor: "border-blue-500",
          bgColor: "bg-blue-100 dark:bg-blue-900/30",
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

    const sscFaqs = [
        { question: "What is SSC CGL?", answer: "Staff Selection Commission - Combined Graduate Level Examination is a national-level exam conducted to recruit candidates for Group B and Group C posts in various ministries, departments, and organizations of the Government of India." },
        { question: "What is the eligibility for SSC CHSL?", answer: "Candidates must have passed the 12th Standard or equivalent examination from a recognized Board or University. The age limit is typically 18-27 years, with relaxations for reserved categories." },
        { question: "What is the exam pattern for SSC exams?", answer: "Most SSC exams consist of multiple tiers. Tier-I is generally a computer-based objective test covering General Intelligence & Reasoning, General Awareness, Quantitative Aptitude, and English Comprehension. Subsequent tiers vary by exam." },
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
            { text: "SSC CGL Eligibility Criteria 2026", href: "#" },
            { text: "SSC CGL Exam Pattern 2026", href: "#" },
            { text: "SSC CGL Previous Year Papers", href: "#" },
            { text: "SSC CGL Participating Posts 2026", href: "#" },
            { text: "SSC CGL Salary & Job Profile 2026", href: "#" },
            { text: "SSC CGL Preparation Tips 2026", href: "#" },
            { text: "SSC CGL Cut Off 2026", href: "#" },
        ],
        'ssc-chsl': [
            { text: "SSC CHSL Syllabus 2026", href: "#" },
            { text: "SSC CHSL Eligibility Criteria 2026", href: "#" },
            { text: "SSC CHSL Exam Pattern 2026", href: "#" },
            { text: "SSC CHSL Previous Year Papers", href: "#" },
            { text: "SSC CHSL Participating Posts 2026", href: "#" },
            { text: "SSC CHSL Salary & Job Profile 2026", href: "#" },
            { text: "SSC CHSL Preparation Tips 2026", href: "#" },
            { text: "SSC CHSL Cut Off 2026", href: "#" },
        ],
        'ssc-mts': [
            { text: "SSC MTS Syllabus 2026", href: "#" },
            { text: "SSC MTS Eligibility Criteria 2026", href: "#" },
            { text: "SSC MTS Exam Pattern 2026", href: "#" },
            { text: "SSC MTS Previous Year Papers", href: "#" },
            { text: "SSC MTS Job Profile 2026", href: "#" },
            { text: "SSC MTS Salary 2026", href: "#" },
            { text: "SSC MTS Preparation Tips 2026", href: "#" },
            { text: "SSC MTS Cut Off 2026", href: "#" },
        ],
        'delhi-police': [
            { text: "Delhi Police Syllabus 2026", href: "#" },
            { text: "Delhi Police Eligibility Criteria 2026", href: "#" },
            { text: "Delhi Police Exam Pattern 2026", href: "#" },
            { text: "Delhi Police Previous Year Papers", href: "#" },
            { text: "Delhi Police Physical Test Details 2026", href: "#" },
            { text: "Delhi Police Salary & Promotion 2026", href: "#" },
            { text: "Delhi Police Preparation Tips 2026", href: "#" },
            { text: "Delhi Police Cut Off 2026", href: "#" },
        ],
        'govt-job-exams': [
            { text: "How to crack SSC CGL in first attempt", href: "#" },
            { text: "IBPS PO Exam Strategy 2026", href: "#" },
            { text: "Best Books for Railway RRB NTPC", href: "#" },
            { text: "Daily Current Affairs for Govt Exams", href: "#" },
            { text: "Quantitative Aptitude Shortcut Tricks", href: "#" },
            { text: "English Vocabulary for SSC & Banking", href: "#" },
            { text: "Latest Govt Job Notifications 2026", href: "#" },
            { text: "Reasoning Puzzles for Bank PO", href: "#" },
        ]
    };
    
    const blogLinks = blogLinksData[activeTab] || blogLinksData['govt-job-exams'];
    const blogSectionTitle = `Explore ${tabTitleMapping[activeTab] || 'Govt Job'} Exam Blogs`;

    return (
        <div className="container mx-auto py-12 px-4 md:px-6">
            <section className="mb-20 animate-fade-in-up">
              <h1 className="text-3xl md:text-5xl font-extrabold text-foreground tracking-tight text-left">
                {(tabTitleMapping[activeTab] || 'Govt Job')} Exams 2026: Application Form, Exam Date, Syllabus, Pattern
              </h1>
              <p className="mt-6 max-w-4xl text-left text-muted-foreground text-lg">
                Your one-stop destination for all government job exam preparations. Get complete details for SSC, Banking, Railways, and other government exams, including dates, syllabus, and preparation strategies.
              </p>
            </section>
            
            <div className="mb-12">
                <div className="overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    <div className="flex justify-start md:justify-center items-center gap-4 whitespace-nowrap px-4 sm:px-0">
                        <Button onClick={() => setActiveTab('ssc-mts')} variant={activeTab === 'ssc-mts' ? 'default' : 'outline'} className="rounded-full px-6 py-2 text-base">SSC MTS</Button>
                        <Button onClick={() => setActiveTab('ssc-chsl')} variant={activeTab === 'ssc-chsl' ? 'default' : 'outline'} className="rounded-full px-6 py-2 text-base">SSC CHSL</Button>
                        <Button onClick={() => setActiveTab('ssc-cgl')} variant={activeTab === 'ssc-cgl' ? 'default' : 'outline'} className="rounded-full px-6 py-2 text-base">SSC CGL</Button>
                        <Button onClick={() => setActiveTab('delhi-police')} variant={activeTab === 'delhi-police' ? 'default' : 'outline'} className="rounded-full px-6 py-2 text-base">DELHI POLICE</Button>
                    </div>
                </div>
            </div>

    
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
                {resourceCards.map((card, index) => (
                    <Link key={index} href={card.href} className="block group h-full">
                        <Card className={`h-full rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-card border-t-4 ${card.borderColor}`}>
                            <CardContent className="p-4 flex flex-col items-center text-center text-foreground h-full">
                                <div className={`mb-3 p-2.5 rounded-full ${card.bgColor}`}>
                                    {card.icon}
                                </div>
                                <h3 className="text-md font-bold mb-1">{card.title}</h3>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </section>
    
            {['ssc-mts', 'ssc-chsl', 'ssc-cgl', 'delhi-police'].includes(activeTab) ? (
                <div key="ssc-content">
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
                                <p className="text-xs text-muted-foreground mb-4 flex items-center gap-1"><Calendar className="w-3 h-3" /> Starts on {course.startDate} <span className="mx-1">•</span> Ends on {course.endDate}</p>
                                
                                {course.features && (
                                    <div className="bg-gray-800 text-white text-xs font-semibold px-3 py-1.5 rounded-md flex justify-between items-center mb-4">
                                        <span>{course.features}</span>
                                        <span className="font-extrabold tracking-widest">IDL</span>
                                    </div>
                                )}
                
                                <div className="flex items-center gap-2 mb-1">
                                    <p className="text-2xl font-bold">₹{course.price}</p>
                                    <p className="text-sm text-muted-foreground line-through">₹{course.originalPrice}</p>
                                </div>
                                <div className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-md mb-4 self-start">
                                    Discount of {course.discount}% applied
                                </div>
                                <p className="text-xs text-muted-foreground mb-4">(FOR FULL BATCH)</p>
                                </CardContent>
                                <div className="p-4 pt-0 mt-auto">
                                    <div className="flex gap-2">
                                        <Button variant="outline" className="w-full">EXPLORE</Button>
                                        <Button className="w-full">BUY NOW</Button>
                                    </div>
                                </div>
                            </Card>
                            ))}
                        </div>
                        <div className="text-center mt-8">
                            <Button variant="ghost" className="text-primary hover:text-primary">
                                View All Batches <ArrowRight className="ml-2 h-4 w-4"/>
                            </Button>
                        </div>
                    </section>

                    <section className="w-full py-16 bg-blue-950 text-white mt-16 animate-fade-in-up rounded-lg" style={{ animationDelay: '1.4s' }}>
                        <div className="container mx-auto px-4 md:px-6">
                            <div className="text-center mb-12">
                                <h2 className="text-3xl font-bold">{blogSectionTitle}</h2>
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
            
                    <section className="mt-16 animate-fade-in-up" style={{ animationDelay: '1.6s' }}>
                      <div className="max-w-4xl mx-auto text-center">
                        <h2 className="text-3xl font-bold mb-8">{(tabTitleMapping[activeTab] || 'Govt Job')} Exam FAQs</h2>
                        <Accordion type="single" collapsible className="w-full space-y-4">
                          {sscFaqs.map((faq, index) => (
                            <AccordionItem key={index} value={`item-${index}`} className="bg-muted/50 rounded-lg border">
                              <AccordionTrigger className="text-left p-4 font-semibold hover:no-underline">{faq.question}</AccordionTrigger>
                              <AccordionContent className="p-4 pt-0 text-left">
                               {faq.answer}
                              </AccordionContent>
                            </AccordionItem>
                          ))}
                        </Accordion>
                      </div>
                    </section>
                </div>
            ) : null }
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
