
'use client';

import { useState, useEffect, Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, ClipboardList, Monitor, FileText, Landmark, GraduationCap, Users, Calendar, MessageSquare, CheckCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useSearchParams, useRouter } from 'next/navigation';

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
          icon: <FileText className="w-6 h-6 text-pink-600" />,
          gradient: "from-pink-100 to-rose-100 dark:from-pink-900/30 dark:to-rose-800/30",
          href: "/resources/notes"
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

    const cbseCourses = [
      {
        title: "Class 10th Board Booster 2026 - All Subjects",
        imageUrl: "https://www.pw.live/version14/assets/img/cuet-ug-2024/cuet-commerce-3.png",
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
        imageUrl: "https://www.pw.live/version14/assets/img/cuet-ug-2024/cuet-ug-gat.png",
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
        imageUrl: "https://www.pw.live/version14/assets/img/cuet-ug-2024/cuet-commerce-2.png",
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
            imageUrl: "https://www.pw.live/version14/assets/img/cuet-ug-2024/cuet-pg-part-a.png",
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
            imageUrl: "https://www.pw.live/version14/assets/img/cuet-ug-2024/cuet-pg-mba.png",
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
          answer: "Yes, students who find it difficult to attend regular school or want to improve their marks can easily transfer to NIX through the Transfer of Credit (TOC) facility."
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
        <div className="container mx-auto py-12 px-4 md:px-6">
            <section className="mb-20 animate-fade-in-up">
              <h1 className="text-3xl md:text-5xl font-black text-foreground tracking-tighter text-left uppercase">
                {activeTab.toUpperCase()} BOARD 2026: Syllabus, Date Sheet, Results & Mock Tests
              </h1>
              <p className="mt-6 max-w-4xl text-left text-muted-foreground text-lg font-medium">
                Comprehensive preparation resources for {activeTab === 'cbse' ? 'Central Board of Secondary Education' : 'National Institute of Open Schooling'}. Get expert guidance, structured courses, and premium study materials to excel in your board examinations.
              </p>
            </section>
            
            <div className="flex justify-center gap-4 mb-16">
                <Button 
                    onClick={() => handleTabChange('cbse')} 
                    variant={activeTab === 'cbse' ? 'default' : 'outline'} 
                    className="rounded-full px-10 py-6 text-lg font-black tracking-widest shadow-xl transition-all hover:scale-105 active:scale-95"
                >
                    CBSE BOARD
                </Button>
                <Button 
                    onClick={() => handleTabChange('nios')} 
                    variant={activeTab === 'nios' ? 'default' : 'outline'} 
                    className="rounded-full px-10 py-6 text-lg font-black tracking-widest shadow-xl transition-all hover:scale-105 active:scale-95"
                >
                    NIOS BOARD
                </Button>
            </div>
    
            <section className="grid grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
                {resourceCards.map((card, index) => (
                    <Link key={index} href={card.href} className="block group">
                        <Card className={`h-full rounded-2xl shadow-lg border-none overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 bg-gradient-to-br ${card.gradient}`}>
                            <CardContent className="p-6 flex flex-col items-center justify-center text-center text-foreground h-full min-h-[160px]">
                                <div className="mb-4 p-4 rounded-2xl bg-white/40 backdrop-blur-md shadow-sm transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
                                    {card.icon}
                                </div>
                                <h3 className="text-xl font-black tracking-tight">{card.title}</h3>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </section>
    
            <div key={activeTab}>
                <section className="mt-20 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                    <div className="flex items-center justify-between mb-10 border-l-8 border-primary pl-6">
                        <h2 className="text-3xl md:text-4xl font-black tracking-tighter text-foreground uppercase">
                            Featured {activeTab.toUpperCase()} Batches
                        </h2>
                        <Button variant="ghost" className="font-black text-primary hover:bg-primary/5 tracking-widest text-xs hidden sm:flex">
                            VIEW ALL <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {(activeTab === 'cbse' ? cbseCourses : niosCourses).map((course, index) => (
                        <Card key={index} className="rounded-[2rem] overflow-hidden shadow-2xl hover:shadow-primary/10 transition-all duration-500 flex flex-col bg-card border-muted-foreground/10 group">
                            <div className="relative overflow-hidden aspect-[16/9]">
                                <Image
                                    src={course.imageUrl}
                                    alt={course.title}
                                    data-ai-hint={course.imageHint}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute top-4 left-4">
                                    <Badge className="bg-primary/90 text-white font-black text-[10px] tracking-widest px-3 py-1 rounded-lg uppercase shadow-xl">ONLINE</Badge>
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
                            </div>
                            
                            <CardContent className="p-6 flex flex-col flex-grow">
                                <h3 className="font-black text-xl leading-tight line-clamp-2 mb-3 group-hover:text-primary transition-colors">{course.title}</h3>
                                
                                <div className="flex flex-wrap items-center gap-2 mb-6">
                                    <Badge variant="secondary" className="bg-muted text-muted-foreground font-bold text-[9px] tracking-widest rounded-md uppercase border-none">{course.language}</Badge>
                                    <Badge variant="outline" className="font-bold text-[9px] tracking-widest rounded-md uppercase border-muted-foreground/20">{activeTab.toUpperCase()}</Badge>
                                </div>

                                <div className="space-y-2 mb-6 text-[11px] font-bold text-muted-foreground uppercase tracking-tighter">
                                    <p className="flex items-center gap-2"><Users className="w-3.5 h-3.5" /> {course.target}</p>
                                    <p className="flex items-center gap-2"><Calendar className="w-3.5 h-3.5" /> Starts {course.startDate} • Ends {course.endDate}</p>
                                </div>
                
                                <div className="mt-auto pt-6 border-t border-muted-foreground/5">
                                    <div className="flex items-baseline gap-2 mb-2">
                                        <p className="text-3xl font-black text-primary tracking-tighter">₹{course.price}</p>
                                        <p className="text-sm text-muted-foreground line-through opacity-50 font-bold">₹{course.originalPrice}</p>
                                    </div>
                                    <div className="inline-flex items-center px-2 py-1 rounded-lg bg-green-500/10 text-green-600 text-[10px] font-black uppercase tracking-tighter mb-6">
                                        -{course.discount}% Limited Offer
                                    </div>
                                    <Button className="w-full font-black tracking-widest uppercase rounded-2xl h-12 shadow-xl shadow-primary/20 active:scale-95 transition-all">ENROLL NOW</Button>
                                </div>
                            </CardContent>
                        </Card>
                        ))}
                    </div>
                </section>

                <section className="w-full py-20 bg-[#070A52] text-white mt-24 rounded-[3rem] shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -mr-32 -mt-32"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl -ml-32 -mb-32"></div>
                    
                    <div className="container mx-auto px-4 md:px-6 relative z-10">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase">Explore Board Resources</h2>
                            <p className="text-white/60 mt-4 font-medium tracking-wide">Stay ahead with our latest blogs and updates</p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
                        {blogLinks.map((link, index) => (
                            <Button key={index} asChild variant="ghost" className="w-full justify-between bg-white/5 backdrop-blur-xl text-white hover:bg-white/10 hover:text-white border border-white/10 rounded-2xl p-6 h-auto group/blog">
                                <Link href={link.href}>
                                    <div className="flex items-center gap-3">
                                        <div className="bg-white/10 p-2 rounded-lg group-hover/blog:bg-primary transition-colors">
                                            <CheckCircle className="h-4 w-4 text-white" />
                                        </div>
                                        <span className="text-sm font-bold text-left tracking-tight">{link.text}</span>
                                    </div>
                                    <ArrowRight className="h-5 w-5 text-white/40 group-hover/blog:translate-x-1 group-hover/blog:text-white transition-all" />
                                </Link>
                            </Button>
                        ))}
                        </div>
                    </div>
                </section>
        
                <section className="mt-24 mb-12">
                  <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-black tracking-tighter text-foreground mb-12 uppercase">{activeTab.toUpperCase()} Board FAQs</h2>
                    <Accordion type="single" collapsible className="w-full space-y-4">
                      {(activeTab === 'cbse' ? cbseFaqs : niosFaqs).map((faq, index) => (
                        <AccordionItem key={index} value={`item-${index}`} className="bg-muted/30 rounded-3xl border-none shadow-sm overflow-hidden">
                          <AccordionTrigger className="text-left p-6 font-black text-foreground hover:no-underline text-base md:text-lg tracking-tight transition-all data-[state=open]:bg-primary/5">
                            {faq.question}
                          </AccordionTrigger>
                          <AccordionContent className="p-6 pt-0 text-left text-muted-foreground font-medium leading-relaxed bg-primary/5">
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
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><GraduationCap className="w-12 h-12 text-primary animate-bounce" /></div>}>
            <SchoolPageContent />
        </Suspense>
    );
}
