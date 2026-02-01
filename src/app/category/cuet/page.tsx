
'use client';

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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


export default function CuetPage() {
    const [activeTab, setActiveTab] = useState('ug');
    
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

    const cuetUgCourses = [
      {
        title: "Project 45 Class 12th Commerce 2026 + Pravesh CUET Commerce 3.0 2026",
        imageUrl: "https://www.pw.live/version14/assets/img/cuet-ug-2024/cuet-commerce-3.png",
        imageHint: "Alakh Pandey",
        language: "Hinglish",
        startDate: "18 Nov, 2025",
        endDate: "31 May, 2026",
        features: "Premium Features Included",
        price: 1499,
        originalPrice: 11000,
        discount: 86,
        target: "For CUET UG 2026 Aspirants"
      },
      {
        title: "Pravesh CUET General Aptitude Test (GAT) 2026",
        imageUrl: "https://www.pw.live/version14/assets/img/cuet-ug-2024/cuet-ug-gat.png",
        imageHint: "Two teachers",
        language: "Hinglish",
        startDate: "19 Jan, 2026",
        endDate: "30 Jun, 2026",
        price: 449,
        originalPrice: 999,
        discount: 55,
        target: "For CUET UG 2026 Aspirants"
      },
      {
        title: "Pravesh CUET Commerce 2.0 2026",
        imageUrl: "https://www.pw.live/version14/assets/img/cuet-ug-2024/cuet-commerce-2.png",
        imageHint: "Group of teachers",
        language: "Hinglish",
        startDate: "17 Nov, 2025",
        endDate: "31 May, 2026",
        price: 1499,
        originalPrice: 8000,
        discount: 81,
        target: "Targeted Batch for CUET UG Commerce 2026"
      }
    ];

    const cuetUgFaqs = [
        {
          question: "What is the syllabus for CUET UG 2026?",
          answer: "The syllabus for CUET UG 2026 is based on the Class 12 curriculum. It is divided into three sections: Language, Domain-specific subjects, and a General Test."
        },
        {
          question: "When will CUET UG 2026 notification be released?",
          answer: "The official notification for CUET UG 2026 is expected to be released by the National Testing Agency (NTA) in March 2026."
        },
        {
          question: "Who conducts CUET UG?",
          answer: "The Common University Entrance Test (CUET) for undergraduate admissions is conducted by the National Testing Agency (NTA)."
        },
        {
          question: "How many subjects can I choose in CUET UG?",
          answer: "Candidates can choose up to 6 subjects from all three sections. It is advisable to visit the official websites of the respective universities for detailed subject combination requirements for specific courses."
        },
        {
          question: "Is it mandatory to appear for the General Test in CUET UG?",
          answer: "It depends on the university and the course you are applying for. Some universities may require the General Test score for admission to certain programs, while others may not. Always check the eligibility criteria of the specific university."
        }
    ];

    const cuetPgCourses = [
        {
            title: "Pravesh CUET PG (Part A) 2026",
            imageUrl: "https://www.pw.live/version14/assets/img/cuet-ug-2024/cuet-pg-part-a.png",
            imageHint: "Abstract design",
            language: "Hinglish",
            startDate: "10 Feb, 2026",
            endDate: "30 Jul, 2026",
            price: 599,
            originalPrice: 1999,
            discount: 70,
            target: "For CUET PG 2026 Aspirants"
        },
        {
            title: "Pravesh CUET PG (MBA) 2026",
            imageUrl: "https://www.pw.live/version14/assets/img/cuet-ug-2024/cuet-pg-mba.png",
            imageHint: "Business students",
            language: "English",
            startDate: "15 Feb, 2026",
            endDate: "31 Jul, 2026",
            price: 1999,
            originalPrice: 7000,
            discount: 71,
            target: "For CUET PG MBA 2026 Aspirants"
        },
        {
            title: "Pravesh CUET PG (M.Com) 2026",
            imageUrl: "https://www.pw.live/version14/assets/img/cuet-ug-2024/cuet-pg-mcom.png",
            imageHint: "Accounting concept",
            language: "Hinglish",
            startDate: "20 Feb, 2026",
            endDate: "31 Jul, 2026",
            price: 1499,
            originalPrice: 6000,
            discount: 75,
            target: "For CUET PG M.Com 2026 Aspirants"
        }
    ];

    const cuetPgFaqs = [
        {
          question: "What is the exam pattern for CUET PG?",
          answer: "The CUET PG exam consists of two parts. Part A is a general aptitude test, and Part B consists of domain-specific questions."
        },
        {
          question: "How many subjects can I apply for in CUET PG?",
          answer: "Candidates can apply for multiple subjects, but they must check the eligibility criteria for each course and university they are interested in."
        },
        {
          question: "Is there an age limit for CUET PG?",
          answer: "No, there is no age limit for candidates appearing for the CUET (PG) examination."
        }
    ];

    const cuetUgBlogLinks = [
        { text: "CUET UG Syllabus 2026", href: "#" },
        { text: "CUET UG Eligibility Criteria 2026", href: "#" },
        { text: "CUET UG Exam Pattern 2026", href: "#" },
        { text: "CUET UG Previous Year Papers", href: "#" },
        { text: "CUET UG Participating Colleges 2026", href: "#" },
        { text: "CUET UG Courses List 2026", href: "#" },
        { text: "CUET UG Preparation Tips 2026", href: "#" },
        { text: "CUET UG Cut Off 2026", href: "#" },
    ];
    
    const cuetPgBlogLinks = [
        { text: "CUET PG Syllabus 2026", href: "#" },
        { text: "CUET PG Eligibility Criteria 2026", href: "#" },
        { text: "CUET PG Exam Pattern 2026", href: "#" },
        { text: "CUET PG Previous Year Papers", href: "#" },
        { text: "CUET PG Participating Colleges 2026", href: "#" },
        { text: "CUET PG Courses List 2026", href: "#" },
        { text: "CUET PG Preparation Tips 2026", href: "#" },
        { text: "CUET PG Cut Off 2026", href: "#" },
    ];

    return (
        <div className="container mx-auto py-12 px-4 md:px-6">
            <section className="mb-20 animate-fade-in-up">
              <h1 className="text-3xl md:text-5xl font-extrabold text-foreground tracking-tight text-left">
                CUET {activeTab.toUpperCase()} 2026: Application Form, Exam Date, Syllabus, Pattern, Colleges, Cutoff
              </h1>
              <p className="mt-6 max-w-4xl text-left text-muted-foreground text-lg">
                CUET {activeTab.toUpperCase()} 2026 is the Common University Entrance Test for {activeTab === 'ug' ? 'undergraduate' : 'postgraduate'} admissions in various Central, State, Private, and Deemed universities across India. 
                <br />
                {activeTab === 'ug' && <><strong className="text-foreground">The official notification has been released & the registration started from 3 January to 30 January 2026.</strong> <br /></>}
                Get complete details including exam date, syllabus, eligibility, pattern, participating universities.
              </p>
            </section>
            
            <div className="flex justify-center gap-4 mb-12">
                <Button onClick={() => setActiveTab('ug')} variant={activeTab === 'ug' ? 'default' : 'outline'} className="rounded-full px-8 py-3 text-lg">CUET UG</Button>
                <Button onClick={() => setActiveTab('pg')} variant={activeTab === 'pg' ? 'default' : 'outline'} className="rounded-full px-8 py-3 text-lg">CUET PG</Button>
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
    
            {activeTab === 'ug' ? (
                <div key="ug-content">
                    <section className="mt-16 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                        <h2 className="text-3xl font-bold text-left mb-8">CUET UG Courses</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {cuetUgCourses.map((course, index) => (
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
                                        <span className="font-extrabold tracking-widest">INFINITY</span>
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
                                <h2 className="text-3xl font-bold">Explore Other Category Blogs</h2>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
                            {cuetUgBlogLinks.map((link, index) => (
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
                        <h2 className="text-3xl font-bold mb-8">CUET UG 2026 Exam FAQs</h2>
                        <Accordion type="single" collapsible className="w-full space-y-4">
                          {cuetUgFaqs.map((faq, index) => (
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
            ) : (
                <div key="pg-content">
                    <section className="mt-16 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                        <h2 className="text-3xl font-bold text-left mb-8">CUET PG Courses</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {cuetPgCourses.map((course, index) => (
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
                    </section>
                    <section className="w-full py-16 bg-blue-950 text-white mt-16 animate-fade-in-up rounded-lg" style={{ animationDelay: '1.4s' }}>
                        <div className="container mx-auto px-4 md:px-6">
                            <div className="text-center mb-12">
                                <h2 className="text-3xl font-bold">Explore Other Category Blogs</h2>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
                            {cuetPgBlogLinks.map((link, index) => (
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
                    <section className="mt-16 animate-fade-in-up" style={{ animationDelay: '1.4s' }}>
                      <div className="max-w-4xl mx-auto text-center">
                        <h2 className="text-3xl font-bold mb-8">CUET PG 2026 Exam FAQs</h2>
                        <Accordion type="single" collapsible className="w-full space-y-4">
                          {cuetPgFaqs.map((faq, index) => (
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
            )}
        </div>
    );
}
