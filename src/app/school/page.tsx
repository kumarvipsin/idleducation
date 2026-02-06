'use client';

import { useState, useEffect, Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, ClipboardList, Monitor, FileText, Landmark, GraduationCap, Users, Calendar, MessageSquare, CheckCircle, Sparkles } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useSearchParams, useRouter } from 'next/navigation';
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

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

function SchoolPageContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const boardParam = searchParams.get('board') || 'cbse';
    
    const [activeTab, setActiveTab] = useState(boardParam);
    
    useEffect(() => {
        if(boardParam) {
            setActiveTab(boardParam);
        }
    }, [boardParam]);

    const handleTabChange = (tab: string) => {
        setActiveTab(tab);
        router.push(`/school?board=${tab}`, { scroll: false });
    };
    
    const resourceCards = [
        {
          title: "PDF BANK",
          icon: <FileText className="w-6 h-6 md:w-8 md:h-8" />,
          color: "bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400",
          href: "/resources/notes"
        },
        {
          title: "TEST SERIES",
          icon: <ClipboardList className="w-6 h-6 md:w-8 md:h-8" />,
          color: "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400",
          href: "#"
        },
        {
          title: "BOOKS",
          icon: <BookOpen className="w-6 h-6 md:w-8 md:h-8" />,
          color: "bg-sky-100 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400",
          href: "/resources/reference-books"
        },
         {
          title: "BLOGS",
          icon: <Monitor className="w-6 h-6 md:w-8 md:h-8" />,
          color: "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400",
          href: "/blog"
        }
    ];

    const cbseFaqs = [
        {
          question: "When will CBSE Class 10 & 12 Board Exams 2026 start?",
          answer: "CBSE Board exams typically start in mid-February. The detailed date sheet is usually released by the board in December."
        },
        {
          question: "How can I download CBSE sample papers?",
          answer: "You can access verified CBSE sample papers and solutions directly through our PDF Bank section on this page."
        },
        {
          question: "What is the passing criteria for CBSE Board?",
          answer: "For Class 10, students must secure a minimum of 33% marks in theory and practical combined. For Class 12, students must secure 33% separately in theory and practical."
        }
    ];

    const niosFaqs = [
        {
          question: "Is NIOS certificate valid for regular college admissions?",
          answer: "Yes, NIOS certificates are fully recognized by the Ministry of Education and are equivalent to CBSE/ICSE for admissions to all universities and government jobs."
        },
        {
          question: "Can I switch from a regular board to NIOS?",
          answer: "Yes, students who find it difficult to attend regular school or want to improve their marks can easily transfer to NIOS through the Transfer of Credit (TOC) facility."
        }
    ];

    const blogLinks = [
        { text: `${activeTab.toUpperCase()} Syllabus 2026`, href: "#" },
        { text: `${activeTab.toUpperCase()} Exam Dates`, href: "#" },
        { text: "Preparation Strategy", href: "#" },
        { text: "Previous Year Papers", href: "#" },
        { text: "Result Updates", href: "#" },
        { text: "Admit Card Guide", href: "#" },
        { text: "Top Study Tips", href: "#" },
        { text: "Career Guidance", href: "#" },
    ];

    return (
        <div className="container mx-auto py-12 px-4 md:px-6 max-w-7xl">
            <section className="mb-16 animate-fade-in-up">
              <div className="flex flex-col items-start gap-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 border border-primary/10 text-primary text-[10px] font-bold uppercase tracking-[0.2em]">
                    <Sparkles className="w-3 h-3 text-yellow-500" />
                    Academic Board Prep
                </div>
                <h1 className="text-xl md:text-3xl font-black text-foreground tracking-tight text-left leading-tight">
                    {activeTab === 'cbse' ? 'Cbse' : 'Nios'} Board 2026: <br/>
                    <span className="text-primary">Syllabus, Date Sheet & Mock Tests</span>
                </h1>
                <p className="max-w-3xl text-left text-muted-foreground text-sm md:text-base font-medium leading-relaxed">
                    Comprehensive preparation resources for {activeTab === 'cbse' ? 'Central Board of Secondary Education' : 'National Institute of Open Schooling'}. Get expert guidance, structured courses, and premium study materials to excel in your board examinations.
                </p>
              </div>
            </section>
            
            <div className="flex justify-center gap-4 mb-16">
                <Button 
                    onClick={() => handleTabChange('cbse')} 
                    variant="outline"
                    className={cn(
                        "rounded-full px-8 py-2 text-xs font-black tracking-widest transition-all duration-300 border-2 bg-transparent h-10 shadow-none",
                        activeTab === 'cbse' ? "border-primary text-primary" : "border-muted-foreground/20 text-muted-foreground hover:border-primary/50"
                    )}
                >
                    CBSE
                </Button>
                <Button 
                    onClick={() => handleTabChange('nios')} 
                    variant="outline"
                    className={cn(
                        "rounded-full px-8 py-2 text-xs font-black tracking-widest transition-all duration-300 border-2 bg-transparent h-10 shadow-none",
                        activeTab === 'nios' ? "border-primary text-primary" : "border-muted-foreground/20 text-muted-foreground hover:border-primary/50"
                    )}
                >
                    NIOS
                </Button>
            </div>
    
            <section className="mb-16 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
                <div className="bg-white dark:bg-card p-4 md:p-6 rounded-2xl shadow-lg border">
                    <div className="flex justify-center mb-6">
                        <div className="bg-yellow-400 text-black px-4 py-1 rounded-full font-bold text-xs uppercase">
                            Explore Board Resources
                        </div>
                    </div>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 items-stretch">
                        {resourceCards.map((card, index) => (
                            <Link key={index} href={card.href} className="group block h-full">
                                <div className={cn(
                                    "flex flex-col items-center justify-center p-3 md:p-4 rounded-xl transition-all duration-300 h-full hover:shadow-lg hover:-translate-y-1 border border-transparent hover:border-white/20",
                                    card.color
                                )}>
                                    <div className="mb-2">
                                        {card.icon}
                                    </div>
                                    <p className="text-[10px] md:text-xs font-black text-center text-foreground whitespace-nowrap tracking-tight uppercase">{card.title}</p>
                                    <ArrowRight className="w-3 h-3 md:w-4 md:h-4 mt-2 text-muted-foreground group-hover:text-primary transition-colors" />
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
    
            <div key={activeTab}>
                <section className="w-full py-16 bg-[#070A52] text-white mt-24 rounded-[3rem] shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[100px] -mr-32 -mt-32"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/10 rounded-full blur-[100px] -ml-32 -mb-32"></div>
                    
                    <div className="container mx-auto px-4 md:px-6 relative z-10">
                        <div className="text-center mb-14">
                            <h2 className="text-2xl md:text-4xl font-black tracking-tighter uppercase leading-tight">
                                Explore Board <span className="text-yellow-400">Knowledge Hub</span>
                            </h2>
                            <p className="text-white/60 mt-3 text-sm font-bold tracking-[0.1em] uppercase opacity-80">Latest Insights & Academic Updates</p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
                        {blogLinks.map((link, index) => (
                            <Button key={index} asChild variant="ghost" className="w-full justify-between bg-white/5 backdrop-blur-xl text-white hover:bg-white/10 hover:text-white border border-white/10 rounded-2xl p-5 h-auto group/blog active:scale-95 transition-all">
                                <Link href={link.href}>
                                    <div className="flex items-center gap-4">
                                        <div className="bg-white/10 p-2 rounded-xl group-hover/blog:bg-primary transition-colors">
                                            <CheckCircle className="h-4 w-4 text-white" />
                                        </div>
                                        <span className="text-xs font-black text-left tracking-tight">{link.text}</span>
                                    </div>
                                    <ArrowRight className="h-4 w-4 text-white/40 group-hover/blog:translate-x-1 group-hover/blog:text-white transition-all" />
                                </Link>
                            </Button>
                        ))}
                        </div>
                    </div>
                </section>
        
                <section className="mt-24 mb-16">
                  <div className="max-w-4xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted border mb-6 text-muted-foreground text-[10px] font-black uppercase tracking-[0.2em]">
                        Help Center
                    </div>
                    <h2 className="text-3xl md:text-4xl font-black tracking-tighter text-foreground mb-12 uppercase">
                        Board FAQ<span className="text-primary">s</span>
                    </h2>
                    <Accordion type="single" collapsible className="w-full space-y-4">
                      {(activeTab === 'cbse' ? cbseFaqs : niosFaqs).map((faq, index) => (
                        <AccordionItem key={index} value={`item-${index}`} className="bg-white dark:bg-muted/30 rounded-[1.5rem] border border-muted-foreground/10 shadow-sm overflow-hidden px-2">
                          <AccordionTrigger className="text-left p-6 font-black text-foreground hover:no-underline text-sm md:text-base tracking-tight transition-all data-[state=open]:text-primary group">
                            {faq.question}
                          </AccordionTrigger>
                          <AccordionContent className="p-6 pt-0 text-left text-muted-foreground text-[13px] font-medium leading-relaxed">
                           {faq.answer}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </div>
                </section>
            </div>
        </div>
    );
}

export default function SchoolPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-background">
                <GraduationCap className="w-12 h-12 text-primary animate-bounce" />
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground animate-pulse">Loading Board Resources</p>
            </div>
        }>
            <SchoolPageContent />
        </Suspense>
    );
}
