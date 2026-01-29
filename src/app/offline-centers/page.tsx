
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowRight, Building, Sparkles, MapPin, Trophy, Award, X } from "lucide-react";
import Image from "next/image";
import Link from 'next/link';
import { Badge } from "@/components/ui/badge";
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { cn } from "@/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";


const cities = [
    "Mukherjee Nagar",
    "Mangol Puri",
    "Budh Vihar",
    "Krishan Vihar",
];

const centers = [
    {
      name: "Mukherjee Nagar, Delhi",
      address: "Plot No 123, Batra Cinema Complex, Dr Mukherjee Nagar, Delhi - 110009",
      imageUrl: "https://picsum.photos/seed/center1/400/300",
      imageHint: "classroom students",
      mapLink: "https://maps.app.goo.gl/uGr9CB7W8fpRUxJD6"
    },
    {
      name: "Mangol Puri, Delhi",
      address: "Block B, Mangolpuri, New Delhi, Delhi 110083",
      imageUrl: "https://picsum.photos/seed/center2/400/300",
      imageHint: "modern classroom",
      mapLink: "https://maps.app.goo.gl/uGr9CB7W8fpRUxJD6"
    },
    {
      name: "Budh Vihar, Delhi",
      address: "Phase 1, Budh Vihar, New Delhi, Delhi 110086",
      imageUrl: "https://picsum.photos/seed/center3/400/300",
      imageHint: "students learning",
      mapLink: "https://maps.app.goo.gl/uGr9CB7W8fpRUxJD6"
    },
    {
      name: "Krishan Vihar, Delhi",
      address: "Near Krishan Vihar Metro, Delhi 110086",
      imageUrl: "https://picsum.photos/seed/center4/400/300",
      imageHint: "library books",
      mapLink: "https://maps.app.goo.gl/uGr9CB7W8fpRUxJD6"
    }
];

const faqs = [
    {
      question: "What are the benefits of joining an IDL offline center?",
      answer: "Our offline centers provide a structured learning environment with direct interaction with expert faculty. Students get personalized attention, instant doubt clarification, and peer learning opportunities, which are crucial for comprehensive understanding and growth."
    },
    {
      question: "What are the timings for the offline centers?",
      answer: "Our centers generally operate from morning till evening. Specific batch timings vary depending on the course and class. Please contact your nearest center for detailed information on batch schedules."
    },
    {
      question: "Are there any demo classes available before enrolling?",
      answer: "Yes, we offer free demo classes for students to experience our teaching methodology and interact with our faculty before making a decision. You can book a free demo class through our website or by visiting one of our centers."
    },
    {
      question: "What is the student-teacher ratio in the classes?",
      answer: "We maintain a low student-teacher ratio to ensure personalized attention for every student. This allows our teachers to focus on individual learning needs and provide tailored guidance."
    },
    {
      question: "How is the progress of students tracked?",
      answer: "We have a comprehensive progress tracking system that includes regular assessments, mock tests, and performance analysis. Parents are kept informed about their child's progress through regular parent-teacher meetings and progress reports."
    },
    {
      question: "Are study materials provided at the offline centers?",
      answer: "Yes, we provide well-researched and comprehensive study materials, including textbooks, practice papers, and notes, which are curated by our expert faculty to align with the latest syllabus and exam patterns."
    },
    {
      question: "What courses are offered at the offline centers?",
      answer: "Our offline centers offer a wide range of courses for school students (Class 6-12) and for competitive exams like JEE, NEET, and other government job exams. Please visit our centers or contact us for course-specific details."
    },
    {
      question: "How can I enroll my child in an IDL offline center?",
      answer: "You can visit any of our offline centers to complete the admission formalities. You can also start the process online by filling out the admission form on our website and then visiting the center for final verification."
    },
    {
      question: "What is the fee structure for the courses?",
      answer: "The fee structure varies depending on the course and its duration. We offer flexible payment options and EMI facilities. For detailed fee information, please contact the specific center you are interested in."
    },
    {
      question: "Is there any scholarship available for students?",
      answer: "Yes, we offer scholarships up to 70% based on the performance in our IDL Scholarship Admission Test (ISAT). We encourage all students to take the test and avail the benefits."
    }
];

const FAQSection = () => {
    return (
        <section className="w-full py-12 bg-muted/20 dark:bg-gray-900">
            <div className="container mx-auto px-4 md:px-6">
                <div className="rounded-2xl bg-white dark:bg-card p-4 md:p-6">
                    <div className="max-w-3xl mx-auto text-center">
                        <div className="flex items-center justify-center">
                            <span className="text-blue-600 text-2xl mr-2">•</span>
                            <h2 className="text-lg font-semibold text-blue-600">FAQ</h2>
                        </div>
                        <h3 className="text-3xl md:text-4xl font-black text-foreground tracking-tight mt-2">
                            Frequently Asked Questions
                        </h3>
                    </div>

                    <div className="max-w-3xl mx-auto mt-12">
                        <Accordion type="single" collapsible className="w-full space-y-4">
                            {faqs.map((faq, index) => (
                                <AccordionItem value={`item-${index}`} key={index} className="border rounded-lg bg-background/50">
                                    <AccordionTrigger className="text-left text-base font-semibold hover:no-underline p-4">
                                        {faq.question}
                                    </AccordionTrigger>
                                    <AccordionContent className="p-4 pt-0">
                                        <p className="text-muted-foreground">{faq.answer}</p>
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default function OfflineCentersPage() {
    const [api, setApi] = useState<CarouselApi>();
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        if (!api) {
        return;
        }
    
        setCurrent(api.selectedScrollSnap());
        api.on("select", () => {
        setCurrent(api.selectedScrollSnap());
        });
    }, [api]);

    const scrollTo = useCallback(
        (index: number) => {
        api?.scrollTo(index);
        },
        [api]
    );
    
    const slides = [
      { src: "https://picsum.photos/seed/classroom1/1600/700", alt: "IDL Offline Center", hint: "classroom students" },
      { src: "https://picsum.photos/seed/learning2/1600/700", alt: "Students learning", hint: "students learning" },
      { src: "https://picsum.photos/seed/collaborate3/1600/700", alt: "Students collaborating", hint: "students collaborating" },
    ];

    return (
        <div className="relative bg-white dark:bg-background">
            <div className="container mx-auto px-4 md:px-6 py-2">
                 <div className="relative rounded-2xl overflow-hidden">
                    <Carousel
                      setApi={setApi}
                      plugins={[ Autoplay({ delay: 3000, stopOnInteraction: false }) ]}
                      className="w-full"
                      opts={{ loop: true }}
                    >
                        <CarouselContent>
                            {slides.map((slide, index) => (
                                <CarouselItem key={index}>
                                    <div className="relative w-full aspect-video md:aspect-[16/6]">
                                        <Image
                                            src={slide.src}
                                            alt={slide.alt}
                                            data-ai-hint={slide.hint}
                                            fill
                                            className="object-cover"
                                        />
                                        <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white text-center p-4">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Sparkles className="w-8 h-8 text-yellow-500" />
                                            </div>
                                            <Button asChild size="lg" className="h-10 px-4 text-sm md:h-12 md:px-8 md:text-lg bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-bold shadow-lg hover:shadow-xl transition-all">
                                                <Link href="/book-demo">Book a Visit <ArrowRight className="ml-2 h-4 w-4" /></Link>
                                            </Button>
                                        </div>
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                    </Carousel>
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex justify-center gap-2">
                        {slides.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => scrollTo(i)}
                                className={cn(
                                    "h-2 w-2 rounded-full transition-all duration-300",
                                    current === i ? "w-6 bg-white" : "bg-white/50"
                                )}
                            />
                        ))}
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 md:px-6 py-12">
                <div className="text-center mb-8">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white">IDL Learning Centres Now in{' '}
                        <span className="relative inline-block">
                            <span className="relative z-10">Delhi</span>
                            <span className="absolute -bottom-1 left-0 w-full h-3 bg-yellow-300 z-0"></span>
                        </span>
                    </h2>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
                    {cities.map(city => (
                        <Card key={city} className="p-4 flex items-center gap-3 hover:shadow-md hover:border-primary transition-all cursor-pointer">
                            <div className="bg-primary/10 p-2 rounded-lg">
                                <Building className="w-6 h-6 text-primary" />
                            </div>
                            <p className="font-semibold">{city}</p>
                        </Card>
                    ))}
                </div>
            </div>

            <div className="container mx-auto px-4 md:px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {centers.map((center) => (
                        <Card key={center.name} className="overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300">
                            <div className="relative h-48 w-full">
                                <Image
                                    src={center.imageUrl}
                                    alt={center.name}
                                    data-ai-hint={center.imageHint}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <CardContent className="p-6">
                                <h3 className="text-xl font-bold mb-2">{center.name}</h3>
                                <div className="flex items-start gap-2 text-muted-foreground mb-4">
                                    <MapPin className="w-4 h-4 mt-1 shrink-0" />
                                    <p className="text-sm">{center.address}</p>
                                </div>
                                <Button asChild variant="outline" className="w-full rounded-full">
                                    <Link href={center.mapLink} target="_blank" rel="noopener noreferrer">Visit Centre</Link>
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
            
            <FAQSection />

        </div>
    );
}
