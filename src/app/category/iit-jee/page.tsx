
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, ClipboardList, Monitor, FileText } from "lucide-react";
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

export default function IitJeePage() {

    const resourceCards = [
        {
          title: "PDF Bank",
          description: "Access Our PDF Bank",
          icon: <FileText className="w-6 h-6 text-pink-600" />,
          bgColor: "bg-pink-50 dark:bg-pink-900/20",
          borderColor: "border-pink-100 dark:border-pink-800",
          href: "#"
        },
        {
          title: "Test Series",
          description: "Explore Our Test Series",
          icon: <ClipboardList className="w-6 h-6 text-green-600" />,
          bgColor: "bg-green-50 dark:bg-green-900/20",
          borderColor: "border-green-100 dark:border-green-800",
          href: "#"
        },
        {
          title: "Books",
          description: "Find Preparation Books",
          icon: <BookOpen className="w-6 h-6 text-indigo-600" />,
          bgColor: "bg-sky-50 dark:bg-sky-900/20",
          borderColor: "border-sky-100 dark:border-sky-800",
          href: "/resources/reference-books"
        },
         {
          title: "Blogs",
          description: "Read Our Latest Blogs",
          icon: <Monitor className="w-6 h-6 text-blue-600" />,
          bgColor: "bg-blue-50 dark:bg-blue-900/20",
          borderColor: "border-blue-100 dark:border-blue-800",
          href: "/blog"
        },
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

    const feeStructure = [
        { category: "General (UR)", paper1: "₹1000", bothPapers: "₹2000" },
        { category: "OBC-NCL / EWS", paper1: "₹900", bothPapers: "₹1800" },
        { category: "SC / ST / PwBD / Third Gender", paper1: "₹500", bothPapers: "₹1000" },
        { category: "Centres Outside India", paper1: "₹5000", bothPapers: "₹10000" },
    ];

    const eligibilityCriteria = [
      { parameter: "Educational Qualification", details: "Must have passed Class 12 or equivalent exam with Physics, Chemistry, and Mathematics." },
      { parameter: "Age Limit", details: "No age limit, but candidates must have passed Class 12 in the last two years." },
      { parameter: "Attempts", details: "A candidate can attempt JEE (Main) for three consecutive years." },
    ];
    
    const examPatternData = [
      { section: 'Physics', questions: '20 (MCQ) + 10 (Numerical)', marks: 100 },
      { section: 'Chemistry', questions: '20 (MCQ) + 10 (Numerical)', marks: 100 },
      { section: 'Mathematics', questions: '20 (MCQ) + 10 (Numerical)', marks: 100 },
    ];

    const syllabusData = [
      { section: 'Physics', types: 'Mechanics, Electrodynamics, Optics, Modern Physics, Thermodynamics.' },
      { section: 'Chemistry', types: 'Physical, Organic, and Inorganic Chemistry based on Class 11 and 12 NCERT.' },
      { section: 'Mathematics', types: 'Algebra, Trigonometry, Analytical Geometry, Differential Calculus, Integral Calculus, Vectors.' },
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

    return (
        <div className="container mx-auto py-12 px-4 md:px-6">
            <section className="mb-20 animate-fade-in-up">
              <h1 className="text-3xl md:text-5xl font-extrabold text-foreground tracking-tight text-left">
                IIT-JEE 2026: Application Form, Exam Date, Syllabus, Pattern, and More
              </h1>
              <p className="mt-6 max-w-4xl text-left text-muted-foreground text-lg">
                The Joint Entrance Examination (JEE) is an engineering entrance assessment conducted for admission to various engineering colleges in India. It is constituted by two different examinations: the JEE-Main and the JEE-Advanced.
              </p>
            </section>
    
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
              {resourceCards.map((card, index) => (
                 <Link key={index} href={card.href} className="block mt-6">
                    <Card className={`group pt-8 relative hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ${card.bgColor} ${card.borderColor} rounded-xl`}>
                        <div className="absolute -top-6 left-6 bg-white p-3 rounded-full shadow-lg border">
                            {card.icon}
                        </div>
                        <CardContent className="p-6 flex items-end justify-between">
                        <div>
                            <h3 className="text-xl font-bold text-foreground">{card.title}</h3>
                            <p className="text-sm text-muted-foreground">{card.description}</p>
                        </div>
                        <ArrowRight className="w-5 h-5 text-muted-foreground shrink-0 group-hover:text-primary transition-colors" />
                        </CardContent>
                    </Card>
                </Link>
              ))}
            </section>
    
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
            
            <section className="mt-16 animate-fade-in-up" style={{animationDelay: '0.6s' }}>
              <h2 className="text-3xl font-bold text-left mb-4">IIT-JEE 2026 Exam Date</h2>
              <p className="text-left text-muted-foreground">
                JEE Main 2026 exam is conducted in two sessions, January and April. JEE Advanced 2026 is expected to be held in late May or early June 2026.
              </p>
            </section>

            <section className="mt-16 animate-fade-in-up" style={{animationDelay: '0.8s' }}>
              <h2 className="text-3xl font-bold text-left mb-4">IIT-JEE 2026 Fee</h2>
              <p className="text-left text-muted-foreground max-w-4xl">
                The application fee for JEE Main varies based on the paper and category. Below is a sample fee structure:
              </p>
              <Card className="mt-6">
                <CardContent className="pt-6">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-orange-100 dark:bg-orange-900/30 hover:bg-orange-100/80 dark:hover:bg-orange-900/40">
                        <TableHead className="font-bold text-orange-800 dark:text-orange-300">Category</TableHead>
                        <TableHead className="font-bold text-orange-800 dark:text-orange-300">Paper 1 (B.E./B.Tech)</TableHead>
                        <TableHead className="font-bold text-orange-800 dark:text-orange-300">Paper 1 & 2 (Both)</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {feeStructure.map((row, index) => (
                        <TableRow key={row.category} className={index % 2 === 0 ? 'bg-orange-50/50 dark:bg-orange-900/10' : 'bg-white dark:bg-card'}>
                          <TableCell className="font-medium">{row.category}</TableCell>
                          <TableCell className="font-semibold text-foreground">{row.paper1}</TableCell>
                          <TableCell className="font-semibold text-foreground">{row.bothPapers}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </section>

             <section className="mt-16 animate-fade-in-up" style={{animationDelay: '1s' }}>
                <h2 className="text-3xl font-bold text-left mb-4">IIT-JEE 2026 Eligibility Criteria</h2>
                <Card className="mt-6">
                    <CardContent className="pt-6">
                         <Table>
                            <TableHeader>
                                <TableRow className="bg-orange-100 dark:bg-orange-900/30 hover:bg-orange-100/80 dark:hover:bg-orange-900/40">
                                    <TableHead className="font-bold text-orange-800 dark:text-orange-300">Parameters</TableHead>
                                    <TableHead className="font-bold text-orange-800 dark:text-orange-300">Details</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                               {eligibilityCriteria.map((row, index) => (
                                    <TableRow key={row.parameter} className={index % 2 === 0 ? 'bg-orange-50/50 dark:bg-orange-900/10' : 'bg-white dark:bg-card'}>
                                        <TableCell className="font-medium">{row.parameter}</TableCell>
                                        <TableCell>{row.details}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </section>

            <section className="mt-16 animate-fade-in-up" style={{animationDelay: '1.2s' }}>
                <h2 className="text-3xl font-bold text-left mb-4">IIT-JEE 2026 Exam Pattern</h2>
                <Card className="mt-6">
                    <CardContent className="pt-6">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-orange-100 dark:bg-orange-900/30 hover:bg-orange-100/80 dark:hover:bg-orange-900/40">
                                    <TableHead className="font-bold text-orange-800 dark:text-orange-300">Section</TableHead>
                                    <TableHead className="font-bold text-orange-800 dark:text-orange-300">Number of Questions</TableHead>
                                    <TableHead className="font-bold text-orange-800 dark:text-orange-300">Total Marks</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {examPatternData.map((row, index) => (
                                    <TableRow key={row.section} className={index % 2 === 0 ? 'bg-orange-50/50 dark:bg-orange-900/10' : 'bg-white dark:bg-card'}>
                                        <TableCell className="font-medium">{row.section}</TableCell>
                                        <TableCell>{row.questions}</TableCell>
                                        <TableCell>{row.marks}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </section>
    
            <section className="mt-16 animate-fade-in-up" style={{animationDelay: '1.4s' }}>
                <h2 className="text-3xl font-bold text-left mb-4">IIT-JEE 2026 Syllabus</h2>
                <Card className="mt-6">
                    <CardContent className="p-6">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-orange-100 dark:bg-orange-900/30 hover:bg-orange-100/80 dark:hover:bg-orange-900/40">
                                    <TableHead className="font-bold text-orange-800 dark:text-orange-300">Section</TableHead>
                                    <TableHead className="font-bold text-orange-800 dark:text-orange-300">Syllabus Topics</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {syllabusData.map((row, index) => (
                                    <TableRow key={row.section} className={index % 2 === 0 ? 'bg-orange-50/50 dark:bg-orange-900/10' : 'bg-white dark:bg-card'}>
                                        <TableCell className="font-medium">{row.section}</TableCell>
                                        <TableCell>{row.types}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </section>
    
             <section className="mt-16 animate-fade-in-up" style={{animationDelay: '1.6s' }}>
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
    );
}
