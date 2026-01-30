'use client';

import React from "react";
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
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

export default function IitJeePage() {
    const [activeTab, setActiveTab] = useState('jee');
    
    const resourceCards = [
        {
          title: "PDF Bank",
          description: "Access Our PDF Bank",
          icon: <FileText className="w-5 h-5 text-pink-600" />,
          bgColor: "bg-pink-50 dark:bg-pink-900/20",
          borderColor: "border-pink-100 dark:border-pink-800",
          href: "#"
        },
        {
          title: "Test Series",
          description: "Explore Our Test Series",
          icon: <ClipboardList className="w-5 h-5 text-green-600" />,
          bgColor: "bg-green-50 dark:bg-green-900/20",
          borderColor: "border-green-100 dark:border-green-800",
          href: "#"
        },
        {
          title: "Books",
          description: "Find Preparation Books",
          icon: <BookOpen className="w-5 h-5 text-indigo-600" />,
          bgColor: "bg-sky-50 dark:bg-sky-900/20",
          borderColor: "border-sky-100 dark:border-sky-800",
          href: "/resources/reference-books"
        },
         {
          title: "Blogs",
          description: "Read Our Latest Blogs",
          icon: <Monitor className="w-5 h-5 text-blue-600" />,
          bgColor: "bg-blue-50 dark:bg-blue-900/20",
          borderColor: "border-blue-100 dark:border-blue-800",
          href: "/blog"
        },
        {
            title: "Colleges",
            description: "Explore participating universities",
            icon: <Landmark className="w-5 h-5 text-purple-600" />,
            bgColor: "bg-purple-50 dark:bg-purple-900/20",
            borderColor: "border-purple-100 dark:border-purple-800",
            href: "#"
          }
    ];

    const jeeCourses = [
      {
        title: "JEE Main & Advanced 2026",
        imageUrl: "https://www.pw.live/version14/assets/img/jee-toppers-2023/pw-jee-topper-2.png",
        imageHint: "Student portrait",
        language: "Hinglish",
        startDate: "15 Nov, 2025",
        endDate: "31 May, 2026",
        features: "For Class 12th & Droppers",
        price: 3499,
        originalPrice: 15000,
        discount: 77,
        target: "For JEE 2026 Aspirants"
      },
      {
        title: "JEE Main Crash Course 2026",
        imageUrl: "https://www.pw.live/version14/assets/img/jee-toppers-2023/pw-jee-topper-1.png",
        imageHint: "Student smiling",
        language: "English",
        startDate: "10 Jan, 2026",
        endDate: "30 Apr, 2026",
        price: 1999,
        originalPrice: 8000,
        discount: 75,
        target: "For JEE Main 2026"
      },
      {
        title: "JEE Advanced 2026 High-Yield Course",
        imageUrl: "https://www.pw.live/version14/assets/img/jee-toppers-2023/pw-jee-topper-3.png",
        imageHint: "Student with books",
        language: "Hinglish",
        startDate: "01 Jun, 2026",
        endDate: "31 Aug, 2026",
        price: 2499,
        originalPrice: 10000,
        discount: 75,
        target: "For JEE Advanced 2026"
      }
    ];

    const jeeFaqs = [
        {
          question: "What is the syllabus for IIT-JEE 2026?",
          answer: "The syllabus is based on the Class 11 and 12 curriculum for Physics, Chemistry, and Mathematics. It covers topics from Mechanics, Electrodynamics, Organic Chemistry, Algebra, Calculus, etc."
        },
        {
          question: "When will IIT-JEE 2026 notification be released?",
          answer: "The official notification for JEE Main is typically released in two sessions, one in January and another in April. JEE Advanced notification usually follows the JEE Main results."
        },
        {
          question: "Who conducts IIT-JEE?",
          answer: "JEE Main is conducted by the National Testing Agency (NTA), while JEE Advanced is conducted by one of the seven zonal IITs on a rotational basis."
        },
        {
          question: "How many subjects are there in IIT-JEE?",
          answer: "There are three subjects: Physics, Chemistry, and Mathematics."
        },
    ];

    const neetCourses = [
      {
        title: "NEET UG 2026 Full Course",
        imageUrl: "https://www.aakash.ac.in/blog/wp-content/uploads/2023/06/Post-Blog-Banner-1.jpg",
        imageHint: "NEET topper",
        language: "Hinglish",
        startDate: "15 Nov, 2025",
        endDate: "31 May, 2026",
        features: "For Class 12th & Droppers",
        price: 3499,
        originalPrice: 15000,
        discount: 77,
        target: "For NEET 2026 Aspirants"
      },
      {
        title: "NEET Crash Course 2026",
        imageUrl: "https://www.pw.live/version14/assets/img/neet-toppers-2023/pranjal-agarwal.png",
        imageHint: "NEET student",
        language: "English",
        startDate: "10 Jan, 2026",
        endDate: "30 Apr, 2026",
        price: 1999,
        originalPrice: 8000,
        discount: 75,
        target: "For NEET 2026"
      },
      {
        title: "NEET Advanced Biology Course",
        imageUrl: "https://www.pw.live/version14/assets/img/neet-toppers-2023/dhruv-advani.png",
        imageHint: "NEET success",
        language: "Hinglish",
        startDate: "01 Jun, 2026",
        endDate: "31 Aug, 2026",
        price: 2499,
        originalPrice: 10000,
        discount: 75,
        target: "For NEET Advanced 2026"
      }
    ];

    const neetFaqs = [
        {
          question: "What is the syllabus for NEET 2026?",
          answer: "The syllabus is based on the Class 11 and 12 curriculum for Physics, Chemistry, and Biology (Botany and Zoology)."
        },
        {
          question: "Is there any negative marking in NEET?",
          answer: "Yes, there is negative marking. For each incorrect answer, one mark is deducted."
        },
        {
          question: "Who conducts NEET?",
          answer: "NEET is conducted by the National Testing Agency (NTA)."
        },
    ];
    
    const jeeTopperSlides = [
        { imageUrl: "https://www.pw.live/version14/assets/img/jee-toppers-2023/pw-jee-topper-2.png", alt: "Dhrumil Chauhan", title: "Dhrumil Chauhan - AIR 5" },
        { imageUrl: "https://www.pw.live/version14/assets/img/jee-toppers-2023/pw-jee-topper-1.png", alt: "Ipsit Mittal", title: "Ipsit Mittal - AIR 1" },
        { imageUrl: "https://www.pw.live/version14/assets/img/jee-toppers-2023/pw-jee-topper-3.png", alt: "Aditya Neeraje", title: "Aditya Neeraje - AIR 27" },
      ];
      
    const neetTopperSlides = [
        { imageUrl: "https://www.aakash.ac.in/blog/wp-content/uploads/2023/06/Post-Blog-Banner-1.jpg", alt: "Aritro Ray", title: "Aritro Ray - AIR 50" },
        { imageUrl: "https://www.pw.live/version14/assets/img/neet-toppers-2023/pranjal-agarwal.png", alt: "Pranjal Aggarwal", title: "Pranjal Aggarwal - AIR 4" },
        { imageUrl: "https://www.pw.live/version14/assets/img/neet-toppers-2023/dhruv-advani.png", alt: "Dhruv Advani", title: "Dhruv Advani - AIR 5" },
      ];

    const blogLinks = [
        { text: "JEE Syllabus 2026", href: "#" },
        { text: "JEE Eligibility Criteria 2026", href: "#" },
        { text: "JEE Exam Pattern 2026", href: "#" },
        { text: "JEE Previous Year Papers", href: "#" },
        { text: "JEE Participating Colleges 2026", href: "#" },
        { text: "JEE Courses List 2026", href: "#" },
        { text: "JEE Preparation Tips 2026", href: "#" },
        { text: "JEE Cut Off 2026", href: "#" },
    ];
    
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

    return (
        <div className="container mx-auto py-12 px-4 md:px-6">
            <section className="mb-12 animate-fade-in-up">
              <h1 className="text-2xl md:text-3xl font-extrabold text-foreground tracking-tight text-left">
                {activeTab === 'jee' ? 'IIT-JEE' : 'NEET'} 2026: Application Form, Exam Date, Syllabus, Pattern, and More
              </h1>
              <p className="mt-6 max-w-4xl text-left text-muted-foreground text-lg">
                The {activeTab === 'jee' ? 'Joint Entrance Examination (JEE)' : 'National Eligibility cum Entrance Test (NEET)'} is a national-level examination for admission to premier engineering and medical colleges in India.
              </p>
            </section>
            
            <div className="flex justify-center gap-4 mb-12">
                <Button onClick={() => setActiveTab('jee')} variant={activeTab === 'jee' ? 'default' : 'outline'} className="rounded-full px-8 py-3 text-lg">IIT-JEE</Button>
                <Button onClick={() => setActiveTab('neet')} variant={activeTab === 'neet' ? 'default' : 'outline'} className="rounded-full px-8 py-3 text-lg">NEET</Button>
            </div>

            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
                {resourceCards.map((card, index) => (
                    <Link key={index} href={card.href} className="block group h-full">
                        <Card className={`h-full rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-card border-t-4 ${card.borderColor}`}>
                            <CardContent className="p-4 flex flex-col items-start text-foreground h-full">
                                <div className={`mb-3 p-2.5 rounded-full ${card.bgColor}`}>
                                    {card.icon}
                                </div>
                                <h3 className="text-md font-bold mb-1">{card.title}</h3>
                                <p className="text-xs text-muted-foreground mb-3 flex-grow">{card.description}</p>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </section>
    
            {activeTab === 'jee' ? (
                <div key="jee-content">
                    <section className="mt-16 animate-fade-in-up" style={{animationDelay: '0.4s' }}>
                      <h2 className="text-3xl font-bold text-left mb-8">IIT-JEE Courses</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {jeeCourses.map((course, index) => (
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
                        <h2 className="text-3xl font-bold mb-8">IIT-JEE 2026 FAQs</h2>
                        <Accordion type="single" collapsible className="w-full space-y-4">
                          {jeeFaqs.map((faq, index) => (
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
                 <div key="neet-content">
                    <section className="mt-16 animate-fade-in-up" style={{animationDelay: '0.4s' }}>
                      <h2 className="text-3xl font-bold text-left mb-8">NEET Courses</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {neetCourses.map((course, index) => (
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
            
                     <section className="mt-16 animate-fade-in-up" style={{ animationDelay: '1.6s' }}>
                      <div className="max-w-4xl mx-auto text-center">
                        <h2 className="text-3xl font-bold mb-8">NEET 2026 FAQs</h2>
                        <Accordion type="single" collapsible className="w-full space-y-4">
                          {neetFaqs.map((faq, index) => (
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