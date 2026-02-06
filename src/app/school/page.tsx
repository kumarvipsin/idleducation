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
          title: "PDF Bank",
          icon: <FileText className="w-5 h-5 text-pink-600" />,
          gradient: "from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-800/20",
          href: "/resources/notes"
        },
        {
          title: "Test Series",
          icon: <ClipboardList className="w-5 h-5 text-green-600" />,
          gradient: "from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-800/20",
          href: "#"
        },
        {
          title: "Books",
          icon: <BookOpen className="w-5 h-5 text-sky-600" />,
          gradient: "from-sky-50 to-blue-50 dark:from-sky-900/20 dark:to-blue-800/20",
          href: "/resources/reference-books"
        },
         {
          title: "Blogs",
          icon: <Monitor className="w-5 h-5 text-blue-600" />,
          gradient: "from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-800/20",
          href: "/blog"
        }
    ];

    const cbseCourses = [
      {
        title: "Class 10th Board Booster 2026 - All Subjects",
        imageUrl: "https://picsum.photos/seed/cbse10/800/450",
        imageHint: "student studying",
        language: "Hinglish",
        startDate: "15 Dec, 2025",
        endDate: "31 Mar, 2026",
        features: "Revision + Sample Papers",
        price: 999,
        originalPrice: 4999,
        discount: 80,
        target: "For CBSE Class 10 Aspirants"
      },
      {
        title: "Class 12th Science Victory Batch 2026",
        imageUrl: "https://picsum.photos/seed/cbse12/800/450",
        imageHint: "science concept",
        language: "Hinglish",
        startDate: "01 Jan, 2026",
        endDate: "30 May, 2026",
        price: 1999,
        originalPrice: 8000,
        discount: 75,
        target: "For CBSE Class 12 Science"
      },
      {
        title: "Class 9th Foundation 2026",
        imageUrl: "https://picsum.photos/seed/cbse9/800/450",
        imageHint: "classroom students",
        language: "Hinglish",
        startDate: "10 Feb, 2026",
        endDate: "31 Dec, 2026",
        price: 1499,
        originalPrice: 6000,
        discount: 75,
        target: "For CBSE Class 9 Students"
      }
    ];

    const niosCourses = [
        {
            title: "NIOS Secondary (Class 10) Full Course",
            imageUrl: "https://picsum.photos/seed/nios10/800/450",
            imageHint: "nios books",
            language: "Hinglish",
            startDate: "01 Dec, 2025",
            endDate: "30 Apr, 2026",
            price: 1299,
            originalPrice: 5000,
            discount: 74,
            target: "For NIOS Class 10 Aspirants"
        },
        {
            title: "NIOS Senior Secondary (Class 12) Science",
            imageUrl: "https://picsum.photos/seed/nios12/800/450",
            imageHint: "physics student",
            language: "Hinglish",
            startDate: "05 Dec, 2025",
            endDate: "30 Apr, 2026",
            price: 1599,
            originalPrice: 7000,
            discount: 77,
            target: "For NIOS Class 12 Science"
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
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 border border-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.2em]">
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
                        "rounded-full px-8 py-2 text-xs font-black tracking-widest transition-all duration-300 border-2 bg-transparent h-auto",
                        activeTab === 'cbse' ? "border-primary text-primary" : "border-muted-foreground/20 text-muted-foreground hover:border-primary/50"
                    )}
                >
                    CBSE
                </Button>
                <Button 
                    onClick={() => handleTabChange('nios')} 
                    variant="outline"
                    className={cn(
                        "rounded-full px-8 py-2 text-xs font-black tracking-widest transition-all duration-300 border-2 bg-transparent h-auto",
                        activeTab === 'nios' ? "border-primary text-primary" : "border-muted-foreground/20 text-muted-foreground hover:border-primary/50"
                    )}
                >
                    NIOS
                </Button>
            </div>
    
            <section className="grid grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
                {resourceCards.map((card, index) => (
                    <Link key={index} href={card.href} className="block group">
                        <Card className={cn(
                            "h-full rounded-[1.5rem] shadow-sm border border-muted-foreground/10 overflow-hidden transition-all duration-500 hover:shadow-xl hover:-translate-y-1 bg-gradient-to-br",
                            card.gradient
                        )}>
                            <CardContent className="p-6 flex flex-col items-center justify-center text-center text-foreground h-full min-h-[160px]">
                                <div className="mb-4 p-4 rounded-[1.25rem] bg-white dark:bg-card shadow-sm transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
                                    {card.icon}
                                </div>
                                <h3 className="text-sm font-black uppercase tracking-widest">{card.title}</h3>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </section>
    
            <div key={activeTab}>
                <section className="mt-20 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                    <div className="flex items-end justify-between mb-10 border-l-4 border-primary pl-6">
                        <div>
                            <h2 className="text-2xl md:text-3xl font-black tracking-tight text-foreground uppercase">
                                Featured {activeTab.toUpperCase()} Batches
                            </h2>
                            <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest mt-1">Structured Learning Programs</p>
                        </div>
                        <Button variant="ghost" className="font-black text-primary hover:bg-primary/5 tracking-[0.2em] text-[10px] hidden sm:flex">
                            VIEW ALL <ArrowRight className="ml-2 h-3.5 w-3.5" />
                        </Button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {(activeTab === 'cbse' ? cbseCourses : niosCourses).map((course, index) => (
                        <Card key={index} className="rounded-[2rem] overflow-hidden shadow-xl hover:shadow-primary/10 transition-all duration-500 flex flex-col bg-card border-muted-foreground/10 group">
                            <div className="relative overflow-hidden aspect-[16/9]">
                                <Image
                                    src={course.imageUrl}
                                    alt={course.title}
                                    data-ai-hint={course.imageHint}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute top-4 left-4">
                                    <Badge className="bg-primary/90 text-white font-black text-[9px] tracking-widest px-3 py-1 rounded-full uppercase shadow-xl border-none">ONLINE</Badge>
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-60" />
                            </div>
                            
                            <CardContent className="p-6 flex flex-col flex-grow">
                                <h3 className="font-black text-lg leading-tight line-clamp-2 mb-3 group-hover:text-primary transition-colors">{course.title}</h3>
                                
                                <div className="flex flex-wrap items-center gap-2 mb-6">
                                    <Badge variant="secondary" className="bg-muted text-muted-foreground font-black text-[9px] tracking-widest rounded-lg uppercase border-none px-2.5 py-1">{course.language}</Badge>
                                    <Badge variant="outline" className="font-black text-[9px] tracking-widest rounded-lg uppercase border-muted-foreground/20 px-2.5 py-1">{activeTab.toUpperCase()}</Badge>
                                </div>

                                <div className="space-y-2 mb-6 text-[10px] font-black text-muted-foreground uppercase tracking-tighter opacity-80">
                                    <p className="flex items-center gap-2.5"><Users className="w-3.5 h-3.5 text-primary/60" /> {course.target}</p>
                                    <p className="flex items-center gap-2.5"><Calendar className="w-3.5 h-3.5 text-primary/60" /> {course.startDate} • {course.endDate}</p>
                                </div>
                
                                <div className="mt-auto pt-6 border-t border-muted-foreground/5">
                                    <div className="flex items-baseline gap-2 mb-1.5">
                                        <p className="text-3xl font-black text-primary tracking-tighter">₹{course.price}</p>
                                        <p className="text-sm text-muted-foreground line-through opacity-40 font-bold">₹{course.originalPrice}</p>
                                    </div>
                                    <div className="inline-flex items-center px-2 py-0.5 rounded-md bg-green-500/10 text-green-600 text-[9px] font-black uppercase tracking-tighter mb-6">
                                        -{course.discount}% Exclusive Offer
                                    </div>
                                    <Button className="w-full font-black tracking-[0.2em] uppercase rounded-xl h-12 shadow-lg shadow-primary/20 active:scale-[0.98] transition-all text-[11px]">ENROLL NOW</Button>
                                </div>
                            </CardContent>
                        </Card>
                        ))}
                    </div>
                </section>

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
