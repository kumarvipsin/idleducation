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

export default function CuetPage() {
    
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

    const cuetCourses = [
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

    const feeStructure = [
        { category: "General (UR)", uptoThree: "₹1000", additional: "₹400 each" },
        { category: "OBC-NCL / EWS", uptoThree: "₹900", additional: "₹375 each" },
        { category: "SC / ST / PwBD / Third Gender", uptoThree: "₹800", additional: "₹350 each" },
        { category: "Centres Outside India", uptoThree: "₹4500", additional: "₹1800 each" },
    ];

    const eligibilityCriteria = [
      { parameter: "Educational Qualification", details: "Class 12 or equivalent from any recognized board with at least 45% marks" },
      { parameter: "Age Limit", details: "No age limit" },
      { parameter: "Nationality", details: "Must be Indian; NRI and OCI candidates can also apply" },
    ];
    
    const examPatternData = [
      { section: 'Language', questions: 50, duration: '60 minutes' },
      { section: 'Domain Subject', questions: 50, duration: '60 minutes' },
      { section: 'General Aptitude Test', questions: 50, duration: '60 minutes' },
    ];

    const syllabusData = [
      { section: 'Language Test', types: 'Reading Comprehension (Factual, Literary, Narrative), Literary Aptitude, and Vocabulary' },
      { section: 'Domain Subjects', types: 'Based on the Class 12 syllabus of selected subjects like Accountancy, Biology, Business Studies, Chemistry, Economics, History, Maths, Physics, Political Science, and more' },
      { section: 'General Test', types: 'General Knowledge, Current Affairs, General Mental Ability, Numerical Ability, Quantitative Reasoning (up to Class 8 level), Logical and Analytical Reasoning' },
    ];

    const cuetFaqs = [
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

    return (
        <div className="container mx-auto py-12 px-4 md:px-6">
            <section className="mb-20 animate-fade-in-up">
              <h1 className="text-3xl md:text-5xl font-extrabold text-foreground tracking-tight text-left">
                CUET UG 2026: Application Form (Ongoing), Exam Date, Syllabus, Pattern, Colleges, Cutoff
              </h1>
              <p className="mt-6 max-w-4xl text-left text-muted-foreground text-lg">
                CUET UG 2026 is the Common University Entrance Test for undergraduate admissions in various Central, State, Private, and Deemed universities across India. 
                <br />
                <strong className="text-foreground">The official notification has been released & the registration started from 3 January to 30 January 2026.</strong> 
                <br />
                Get complete details including exam date, syllabus, eligibility, pattern, participating universities.
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
    
            <section className="mt-16 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              <h2 className="text-3xl font-bold text-left mb-8">CUET Courses</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cuetCourses.map((course, index) => (
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
              <h2 className="text-3xl font-bold text-left mb-4">CUET 2026 Exam date</h2>
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
                      <TableRow className="bg-orange-100 dark:bg-orange-900/30 hover:bg-orange-100/80 dark:hover:bg-orange-900/40">
                        <TableHead className="font-bold text-orange-800 dark:text-orange-300">Category</TableHead>
                        <TableHead className="font-bold text-orange-800 dark:text-orange-300">Upto Three Subjects</TableHead>
                        <TableHead className="font-bold text-orange-800 dark:text-orange-300">For Each Additional Subject</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {feeStructure.map((row, index) => (
                        <TableRow key={row.category} className={index % 2 === 0 ? 'bg-orange-50/50 dark:bg-orange-900/10' : 'bg-white dark:bg-card'}>
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
                                <TableRow className="bg-orange-100 dark:bg-orange-900/30 hover:bg-orange-100/80 dark:hover:bg-orange-900/40">
                                    <TableHead className="font-bold text-orange-800 dark:text-orange-300">Section</TableHead>
                                    <TableHead className="font-bold text-orange-800 dark:text-orange-300">Number of Questions (All Compulsory)</TableHead>
                                    <TableHead className="font-bold text-orange-800 dark:text-orange-300">Duration of Exam</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {examPatternData.map((row, index) => (
                                    <TableRow key={row.section} className={index % 2 === 0 ? 'bg-orange-50/50 dark:bg-orange-900/10' : 'bg-white dark:bg-card'}>
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
                                <TableRow className="bg-orange-100 dark:bg-orange-900/30 hover:bg-orange-100/80 dark:hover:bg-orange-900/40">
                                    <TableHead className="font-bold text-orange-800 dark:text-orange-300">Section</TableHead>
                                    <TableHead className="font-bold text-orange-800 dark:text-orange-300">CUET 2026 Syllabus / Question Types</TableHead>
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
    
             <section className="mt-16 animate-fade-in-up" style={{ animationDelay: '1.6s' }}>
              <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-3xl font-bold mb-8">CUET 2026 Exam FAQs</h2>
                <Accordion type="single" collapsible className="w-full space-y-4">
                  {cuetFaqs.map((faq, index) => (
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
