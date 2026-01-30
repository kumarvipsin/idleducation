'use client';

import { useState } from "react";
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

export default function CuetPage() {
    const [activeTab, setActiveTab] = useState('ug');
    
    const resourceCards = [
        {
          title: "PDF Bank",
          description: "Access Our PDF Bank",
          icon: <FileText className="w-6 h-6 text-pink-600" />,
          gradient: 'from-pink-50 to-pink-100 dark:from-pink-900/30 dark:to-pink-800/30',
          href: "#"
        },
        {
          title: "Test Series",
          description: "Explore Our Test Series",
          icon: <ClipboardList className="w-6 h-6 text-green-600" />,
          gradient: 'from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30',
          href: "#"
        },
        {
          title: "Books",
          description: "Find Preparation Books",
          icon: <BookOpen className="w-6 h-6 text-indigo-600" />,
          gradient: 'from-sky-50 to-sky-100 dark:from-sky-900/30 dark:to-sky-800/30',
          href: "/resources/reference-books"
        },
         {
          title: "Blogs",
          description: "Read Our Latest Blogs",
          icon: <Monitor className="w-6 h-6 text-blue-600" />,
          gradient: 'from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30',
          href: "/blog"
        },
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

    const ugFeeStructure = [
        { category: "General (UR)", uptoThree: "₹1000", additional: "₹400 each" },
        { category: "OBC-NCL / EWS", uptoThree: "₹900", additional: "₹375 each" },
        { category: "SC / ST / PwBD / Third Gender", uptoThree: "₹800", additional: "₹350 each" },
        { category: "Centres Outside India", uptoThree: "₹4500", additional: "₹1800 each" },
    ];

    const ugEligibilityCriteria = [
      { parameter: "Educational Qualification", details: "Class 12 or equivalent from any recognized board with at least 45% marks" },
      { parameter: "Age Limit", details: "No age limit" },
      { parameter: "Nationality", details: "Must be Indian; NRI and OCI candidates can also apply" },
    ];
    
    const ugExamPatternData = [
      { section: 'Language', questions: 50, duration: '60 minutes' },
      { section: 'Domain Subject', questions: 50, duration: '60 minutes' },
      { section: 'General Aptitude Test', questions: 50, duration: '60 minutes' },
    ];

    const ugSyllabusData = [
      { section: 'Language Test', types: 'Reading Comprehension (Factual, Literary, Narrative), Literary Aptitude, and Vocabulary' },
      { section: 'Domain Subjects', types: 'Based on the Class 12 syllabus of selected subjects like Accountancy, Biology, Business Studies, Chemistry, Economics, History, Maths, Physics, Political Science, and more' },
      { section: 'General Test', types: 'General Knowledge, Current Affairs, General Mental Ability, Numerical Ability, Quantitative Reasoning (up to Class 8 level), Logical and Analytical Reasoning' },
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

    const pgFeeStructure = [
        { category: "General (UR)", perPaper: "₹600", additional: "₹200 each" },
        { category: "OBC-NCL / EWS", perPaper: "₹500", additional: "₹150 each" },
        { category: "SC / ST / Third Gender", perPaper: "₹500", additional: "₹150 each" },
        { category: "PwBD", perPaper: "₹500", additional: "₹150 each" },
        { category: "Centres Outside India", perPaper: "₹4000", additional: "₹1000 each" },
    ];

    const pgEligibilityCriteria = [
      { parameter: "Educational Qualification", details: "Candidates must have a bachelor's degree or equivalent from a recognized university." },
      { parameter: "Age Limit", details: "No age limit for appearing in CUET (PG)." },
      { parameter: "Appearing Candidates", details: "Candidates appearing in the final year of their bachelor's degree are also eligible to apply." },
    ];
    
    const pgExamPatternData = [
      { section: 'Part A', questions: '25', details: 'Language Comprehension/ Verbal Ability, General Awareness, Mathematical/Quantitative ability, and Analytical Skills.' },
      { section: 'Part B', questions: '75', details: 'Domain-specific questions related to the subject of the PG course.' },
    ];

    const pgSyllabusData = [
      { section: 'Part A', types: 'General aptitude, reasoning, language skills, and general knowledge.' },
      { section: 'Part B', types: 'Syllabus is based on the undergraduate level of the specific domain subject chosen by the candidate.' },
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
    
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
              {resourceCards.map((card, index) => (
                 <Link key={index} href={card.href} className="block group h-full">
                    <Card className={`flex flex-col h-full rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-gradient-to-br ${card.gradient}`}>
                        <CardContent className="p-6 flex flex-col flex-grow items-start text-foreground">
                            <div className="flex justify-between items-start w-full mb-4">
                                <div className="p-2 bg-white/30 rounded-full">{card.icon}</div>
                            </div>
                            <h3 className="text-xl font-bold mb-1 flex-grow">{card.title}</h3>
                            <p className="text-sm text-muted-foreground mb-4">{card.description}</p>
                            <div className="text-primary font-semibold flex items-center group-hover:underline text-sm mt-auto">
                                VIEW MORE
                                <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </div>
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
                    <section className="mt-16 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
                      <h2 className="text-3xl font-bold text-left mb-4">CUET UG 2026 Exam date</h2>
                      <p className="text-left text-muted-foreground">
                        CUET UG 2026 exam date is tentatively scheduled to be conducted <span className="font-bold text-foreground">Between 11 - 31 May 2026 (tentative)</span>. The exact dates will be announced by the National Testing Agency (NTA) in March 2026.
                      </p>
                    </section>
                    <section className="mt-16 animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
                      <h2 className="text-3xl font-bold text-left mb-4">CUET UG 2026 Fee</h2>
                      <p className="text-left text-muted-foreground max-w-4xl">
                        CUET UG 2026 application fee must be paid online before the deadline, which is <strong className="text-foreground">31 January 2026</strong>. The fee structure varies based on the candidate's category and the number of subjects chosen. Below is the detailed fee structure for CUET 2026:
                      </p>
                      <Card className="mt-6">
                        <CardContent className="pt-6">
                          <Table>
                            <TableHeader>
                                <TableRow className="bg-orange-500 hover:bg-orange-600">
                                <TableHead className="font-bold text-white">Category</TableHead>
                                <TableHead className="font-bold text-white">Upto Three Subjects</TableHead>
                                <TableHead className="font-bold text-white">For Each Additional Subject</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {ugFeeStructure.map((row, index) => (
                                <TableRow key={row.category} className={index % 2 === 0 ? 'bg-orange-50 dark:bg-orange-900/20' : 'bg-white dark:bg-card'}>
                                    <TableCell className="font-medium">{row.category}</TableCell>
                                    <TableCell className="font-semibold text-foreground">{row.uptoThree}</TableCell>
                                    <TableCell className="font-semibold text-foreground">{row.additional}</TableCell>
                                </TableRow>
                                ))}
                            </TableBody>
                            </Table>
                        </CardContent>
                      </Card>
                    </section>
                     <section className="mt-16 animate-fade-in-up" style={{ animationDelay: '1s' }}>
                        <h2 className="text-3xl font-bold text-left mb-4">CUET UG 2026 Eligibility Criteria</h2>
                        <p className="text-left text-muted-foreground max-w-4xl">
                            The National Testing Agency (NTA) sets the eligibility criteria for students who wish to appear in the CUET UG 2026 exam. It is important for candidates to meet these basic requirements in order to register and appear for the test. However, meeting the CUET eligibility criteria does not guarantee admission, as individual universities may have their own course-specific requirements. The table below outlines the general eligibility criteria for CUET UG 2026:
                        </p>
                        <Card className="mt-6">
                            <CardContent className="pt-6">
                                 <Table>
                                    <TableHeader>
                                        <TableRow className="bg-orange-500 hover:bg-orange-600">
                                            <TableHead className="font-bold text-white">Parameters</TableHead>
                                            <TableHead className="font-bold text-white">Details</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                       {ugEligibilityCriteria.map((row, index) => (
                                            <TableRow key={row.parameter} className={index % 2 === 0 ? 'bg-orange-50 dark:bg-orange-900/20' : 'bg-white dark:bg-card'}>
                                                <TableCell className="font-medium">{row.parameter}</TableCell>
                                                <TableCell>{row.details}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                                <p className="text-xs text-muted-foreground mt-4">
                                    <strong>Note:</strong> These criteria are only for appearing in CUET UG 2026. Each university will release its own course-wise eligibility (including subject combinations and Class 12 marks) separately. Students must visit the official websites of the respective universities for detailed admission requirements.
                                </p>
                            </CardContent>
                        </Card>
                    </section>
                    <section className="mt-16 animate-fade-in-up" style={{ animationDelay: '1.2s' }}>
                        <h2 className="text-3xl font-bold text-left mb-4">CUET UG 2026 Exam Pattern</h2>
                        <p className="text-left text-muted-foreground max-w-4xl">
                            Candidates appearing for CUET UG 2026 must understand the cuet exam pattern to strategize their preparation effectively. The exam consists of three main sections: Language, Domain Subject, and General Aptitude Test, each with a specific number of questions and duration.
                        </p>
                        <Card className="mt-6">
                            <CardContent className="pt-6">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-orange-500 hover:bg-orange-600">
                                            <TableHead className="font-bold text-white">Section</TableHead>
                                            <TableHead className="font-bold text-white">Number of Questions (All Compulsory)</TableHead>
                                            <TableHead className="font-bold text-white">Duration of Exam</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {ugExamPatternData.map((row, index) => (
                                            <TableRow key={row.section} className={index % 2 === 0 ? 'bg-orange-50 dark:bg-orange-900/20' : 'bg-white dark:bg-card'}>
                                                <TableCell className="font-medium">{row.section}</TableCell>
                                                <TableCell>{row.questions}</TableCell>
                                                <TableCell>{row.duration}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </section>
            
                    <section className="mt-16 animate-fade-in-up" style={{ animationDelay: '1.4s' }}>
                        <h2 className="text-3xl font-bold text-left mb-4">CUET UG 2026 Syllabus</h2>
                        <p className="text-left text-muted-foreground max-w-4xl">
                            CUET UG 2026 syllabus has been officially released by the National Testing Agency (NTA) for the CUET Aspirants. It will follow the NCERT Class 12 curriculum, making it easier for students already preparing for their board exams. The syllabus is divided into three major sections: Language, Domain Subjects, and General Test. Here's a simplified breakdown of each section:
                        </p>
                        <Card className="mt-6">
                            <CardContent className="p-6">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-orange-500 hover:bg-orange-600">
                                            <TableHead className="font-bold text-white">Section</TableHead>
                                            <TableHead className="font-bold text-white">CUET 2026 Syllabus / Question Types</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {ugSyllabusData.map((row, index) => (
                                            <TableRow key={row.section} className={index % 2 === 0 ? 'bg-orange-50 dark:bg-orange-900/20' : 'bg-white dark:bg-card'}>
                                                <TableCell className="font-medium">{row.section}</TableCell>
                                                <TableCell>{row.types}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
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
                    <section className="mt-16 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
                      <h2 className="text-3xl font-bold text-left mb-4">CUET PG 2026 Fee</h2>
                      <Card className="mt-6">
                        <CardContent className="pt-6">
                          <Table>
                            <TableHeader>
                                <TableRow className="bg-orange-500 hover:bg-orange-600">
                                <TableHead className="font-bold text-white">Category</TableHead>
                                <TableHead className="font-bold text-white">Fee (up to 2 test papers)</TableHead>
                                <TableHead className="font-bold text-white">For Each Additional Paper</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {pgFeeStructure.map((row, index) => (
                                <TableRow key={row.category} className={index % 2 === 0 ? 'bg-orange-50 dark:bg-orange-900/20' : 'bg-white dark:bg-card'}>
                                    <TableCell className="font-medium">{row.category}</TableCell>
                                    <TableCell className="font-semibold text-foreground">{row.perPaper}</TableCell>
                                    <TableCell className="font-semibold text-foreground">{row.additional}</TableCell>
                                </TableRow>
                                ))}
                            </TableBody>
                            </Table>
                        </CardContent>
                      </Card>
                    </section>
                     <section className="mt-16 animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
                        <h2 className="text-3xl font-bold text-left mb-4">CUET PG 2026 Eligibility Criteria</h2>
                        <Card className="mt-6">
                            <CardContent className="pt-6">
                                 <Table>
                                    <TableHeader>
                                        <TableRow className="bg-orange-500 hover:bg-orange-600">
                                            <TableHead className="font-bold text-white">Parameters</TableHead>
                                            <TableHead className="font-bold text-white">Details</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                       {pgEligibilityCriteria.map((row, index) => (
                                            <TableRow key={row.parameter} className={index % 2 === 0 ? 'bg-orange-50 dark:bg-orange-900/20' : 'bg-white dark:bg-card'}>
                                                <TableCell className="font-medium">{row.parameter}</TableCell>
                                                <TableCell>{row.details}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </section>
                    <section className="mt-16 animate-fade-in-up" style={{ animationDelay: '1.0s' }}>
                        <h2 className="text-3xl font-bold text-left mb-4">CUET PG 2026 Exam Pattern</h2>
                        <Card className="mt-6">
                            <CardContent className="pt-6">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-orange-500 hover:bg-orange-600">
                                            <TableHead className="font-bold text-white">Section</TableHead>
                                            <TableHead className="font-bold text-white">Number of Questions</TableHead>
                                            <TableHead className="font-bold text-white">Details</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {pgExamPatternData.map((row, index) => (
                                            <TableRow key={row.section} className={index % 2 === 0 ? 'bg-orange-50 dark:bg-orange-900/20' : 'bg-white dark:bg-card'}>
                                                <TableCell className="font-medium">{row.section}</TableCell>
                                                <TableCell>{row.questions}</TableCell>
                                                <TableCell>{row.details}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </section>
            
                    <section className="mt-16 animate-fade-in-up" style={{ animationDelay: '1.2s' }}>
                        <h2 className="text-3xl font-bold text-left mb-4">CUET PG 2026 Syllabus</h2>
                        <Card className="mt-6">
                            <CardContent className="p-6">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-orange-500 hover:bg-orange-600">
                                            <TableHead className="font-bold text-white">Section</TableHead>
                                            <TableHead className="font-bold text-white">Syllabus / Question Types</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {pgSyllabusData.map((row, index) => (
                                            <TableRow key={row.section} className={index % 2 === 0 ? 'bg-orange-50 dark:bg-orange-900/20' : 'bg-white dark:bg-card'}>
                                                <TableCell className="font-medium">{row.section}</TableCell>
                                                <TableCell>{row.types}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
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