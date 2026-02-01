
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

export default function SchoolPage() {
    const [activeTab, setActiveTab] = useState('class10');
    
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

    const class10Courses = [
      {
        title: "CBSE Class 10 Board Exam Crash Course 2026",
        imageUrl: "https://www.pw.live/version14/assets/img/cuet-ug-2024/cuet-commerce-3.png",
        imageHint: "Students studying",
        language: "Hinglish",
        startDate: "01 Dec, 2025",
        endDate: "15 Feb, 2026",
        price: 999,
        originalPrice: 4000,
        discount: 75,
        target: "For CBSE Class 10 Board Aspirants"
      },
      {
        title: "CBSE Class 10 Full Year Course 2025-26",
        imageUrl: "https://www.pw.live/version14/assets/img/cuet-ug-2024/cuet-ug-gat.png",
        imageHint: "Teacher with students",
        language: "Hinglish",
        startDate: "15 Apr, 2025",
        endDate: "28 Feb, 2026",
        price: 2499,
        originalPrice: 10000,
        discount: 75,
        target: "For CBSE Class 10 Aspirants"
      },
    ];

    const class10Faqs = [
        {
          question: "What is the syllabus for CBSE Class 10 2026?",
          answer: "The syllabus is prescribed by CBSE and covers subjects like Mathematics, Science, Social Science, English, and Hindi. It focuses on building a strong foundation for higher studies."
        },
        {
          question: "What is the exam pattern for CBSE Class 10?",
          answer: "The exam pattern includes a final board examination at the end of the year, along with internal assessments conducted by the school. The board exam consists of questions of varying difficulty levels, including MCQs, short answer, and long answer questions."
        },
        {
          question: "How can I score well in CBSE Class 10 exams?",
          answer: "Consistent study, solving previous year question papers, regular revisions, and clearing doubts with teachers are key to scoring well. Joining a good coaching program like ours can provide structured guidance."
        },
    ];

    const class12Courses = [
        {
            title: "CBSE Class 12 Science Board Exam Course 2026",
            imageUrl: "https://www.pw.live/version14/assets/img/cuet-ug-2024/cuet-pg-part-a.png",
            imageHint: "Science lab",
            language: "Hinglish",
            startDate: "10 Apr, 2025",
            endDate: "15 Mar, 2026",
            price: 2999,
            originalPrice: 12000,
            discount: 75,
            target: "For CBSE Class 12 Science Students"
        },
        {
            title: "CBSE Class 12 Commerce Board Exam Course 2026",
            imageUrl: "https://www.pw.live/version14/assets/img/cuet-ug-2024/cuet-pg-mba.png",
            imageHint: "Business charts",
            language: "English",
            startDate: "10 Apr, 2025",
            endDate: "15 Mar, 2026",
            price: 2999,
            originalPrice: 12000,
            discount: 75,
            target: "For CBSE Class 12 Commerce Students"
        },
    ];

    const class12Faqs = [
        {
          question: "What are the main subjects in CBSE Class 12 Science?",
          answer: "The main subjects are Physics, Chemistry, Mathematics (PCM) or Physics, Chemistry, Biology (PCB). English is a compulsory subject. Students can also opt for an optional subject like Computer Science."
        },
        {
          question: "Is Class 12 board exam difficult?",
          answer: "The difficulty level is moderate to high. With consistent preparation and a clear understanding of concepts, students can score very well. It is important to focus on NCERT books and practice sample papers."
        },
    ];

    const class10BlogLinks = [
        { text: "CBSE Class 10 Syllabus 2026", href: "#" },
        { text: "CBSE Class 10 Exam Pattern 2026", href: "#" },
        { text: "CBSE Class 10 Best Reference Books", href: "#" },
        { text: "CBSE Class 10 Previous Year Papers", href: "#" },
        { text: "How to Make Notes for Class 10", href: "#" },
        { text: "CBSE Class 10 Preparation Tips", href: "#" },
    ];
    
    const class12BlogLinks = [
        { text: "CBSE Class 12 Syllabus 2026", href: "#" },
        { text: "CBSE Class 12 Exam Pattern 2026", href: "#" },
        { text: "How to manage board exams with competitive exams", href: "#" },
        { text: "CBSE Class 12 Previous Year Papers", href: "#" },
        { text: "CBSE Class 12 Project Work Guide", href: "#" },
        { text: "Best Career Options after Class 12", href: "#" },
    ];

    return (
        <div className="container mx-auto py-12 px-4 md:px-6">
            <section className="mb-20 animate-fade-in-up">
              <h1 className="text-3xl md:text-5xl font-extrabold text-foreground tracking-tight text-left">
                CBSE Board {activeTab === 'class10' ? 'Class 10' : 'Class 12'} 2026: Exam Date, Syllabus, Pattern & Results
              </h1>
              <p className="mt-6 max-w-4xl text-left text-muted-foreground text-lg">
                Get complete details for CBSE Board exams for Class 10 and 12, including exam dates, syllabus, pattern, and preparation resources.
              </p>
            </section>
            
            <div className="flex justify-center gap-4 mb-12">
                <Button onClick={() => setActiveTab('class10')} variant={activeTab === 'class10' ? 'default' : 'outline'} className="rounded-full px-8 py-3 text-lg">Class 10</Button>
                <Button onClick={() => setActiveTab('class12')} variant={activeTab === 'class12' ? 'default' : 'outline'} className="rounded-full px-8 py-3 text-lg">Class 12</Button>
            </div>
    
            <section className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
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
    
            {activeTab === 'class10' ? (
                <div key="class10-content">
                    <section className="mt-16 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                        <h2 className="text-3xl font-bold text-left mb-8">CBSE Class 10 Courses</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {class10Courses.map((course, index) => (
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
                                <h2 className="text-3xl font-bold">Explore More CBSE Class 10 Resources</h2>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
                            {class10BlogLinks.map((link, index) => (
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
                        <h2 className="text-3xl font-bold mb-8">CBSE Class 10 FAQs</h2>
                        <Accordion type="single" collapsible className="w-full space-y-4">
                          {class10Faqs.map((faq, index) => (
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
                <div key="class12-content">
                    <section className="mt-16 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                        <h2 className="text-3xl font-bold text-left mb-8">CBSE Class 12 Courses</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {class12Courses.map((course, index) => (
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
                                <h2 className="text-3xl font-bold">Explore More CBSE Class 12 Resources</h2>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
                            {class12BlogLinks.map((link, index) => (
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
                        <h2 className="text-3xl font-bold mb-8">CBSE Class 12 FAQs</h2>
                        <Accordion type="single" collapsible className="w-full space-y-4">
                          {class12Faqs.map((faq, index) => (
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
