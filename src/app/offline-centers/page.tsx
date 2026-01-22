'use client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowRight, Building, Sparkles, MapPin, Trophy, Award } from "lucide-react";
import Image from "next/image";
import Link from 'next/link';
import { Badge } from "@/components/ui/badge";
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import React, { useState, useEffect, useCallback } from 'react';
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

const WhyIDL = () => {
    return (
        <section className="w-full py-12 bg-muted/20 dark:bg-gray-900">
            <div className="container mx-auto px-4 md:px-6">
                <div className="rounded-2xl bg-white dark:bg-card p-4 md:p-6 border">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                        <div className="space-y-4">
                            <h2 className="text-3xl md:text-4xl font-bold text-orange-500">Why IDL?</h2>
                            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                                Unlock True Potential Through <span className="text-orange-500">Highest Personal Attention</span>
                            </h2>
                            <p className="text-muted-foreground">
                                At IDL we provide highest personal attention through our Student Obsessed Heroes and our Tech-integrated Systems.
                            </p>
                        </div>
                        <div>
                            <Image
                                src="https://images.unsplash.com/photo-1764720572930-eb63afd14b06?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxM3x8c3R1ZGVudCUyMHNjaG9vbHxlbnwwfHx8fDE3NjkwNTUzNzB8MA&ixlib=rb-4.1.0&q=80&w=1080"
                                alt="Teacher helping students"
                                data-ai-hint="teacher students"
                                width={600}
                                height={400}
                                className="rounded-lg shadow-lg"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

const ScholarshipSection = () => {
    return (
        <section className="w-full py-4 md:py-7 bg-muted/20 dark:bg-gray-900 mt-12">
            <div className="container mx-auto px-4 md:px-6">
                <div className="rounded-2xl bg-white dark:bg-card p-4 md:p-6 border">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                        <div className="space-y-6 text-center md:text-left">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white">Get up to 70% scholarship with the <span className="text-orange-500">IDL Scholarship Admission Test</span></h2>
                            <div className="space-y-2 flex flex-col items-center md:items-start">
                                <div className="flex items-center gap-2 justify-start">
                                    <Trophy className="h-6 w-6 text-primary flex-shrink-0" />
                                    <p className="text-muted-foreground">Upto 70% Scholarship on IDL Course Admissions</p>
                                </div>
                                <div className="flex items-center gap-2 justify-start">
                                    <Award className="h-6 w-6 text-primary flex-shrink-0" />
                                    <p className="text-muted-foreground">Get 2X Scholarship by taking the Test at Our Centre</p>
                                </div>
                            </div>
                            <div className="text-center md:text-left">
                                <Button asChild className="rounded-full bg-orange-500 hover:bg-orange-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all">
                                    <Link href="/scholarship">Register For FREE</Link>
                                </Button>
                                <p className="text-xs text-muted-foreground mt-2">Hurry, limited seats are left</p>
                            </div>
                        </div>
                        <div className="h-64 md:h-80 flex items-center justify-center">
                           <div className="relative w-full h-full">
                                <Image
                                    src="https://images.unsplash.com/photo-1633061273960-9c33bf7cc0c6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw1fHxzY2hvbGFyc2hpcHxlbnwwfHx8fDE3NjkwNTUyMzJ8MA&ixlib=rb-4.1.0&q=80&w=1080"
                                    alt="Student with trophy"
                                    data-ai-hint="student trophy"
                                    fill
                                    className="object-contain"
                                />
                           </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

const FixedBottomBar = () => {
    return (
        <section className="fixed bottom-0 left-0 right-0 z-50 w-full py-3 bg-white dark:bg-gray-800 border-t">
            <div className="container mx-auto px-4 md:px-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                <p className="text-lg text-center sm:text-left text-foreground">
                    Reach out to us : <a href="tel:08860040010" className="font-bold underline hover:text-primary">08860040010</a>
                </p>
            </div>
        </section>
    )
}

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
                <div className="rounded-2xl bg-white dark:bg-card p-4 md:p-6 border">
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
      { src: "https://images.unsplash.com/photo-1510531704581-5b2870972060?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxM3x8Y2xhc3Nyb29tfGVufDB8fHx8fDE3NjkwOTMzOHww&ixlib=rb-4.0.3&q=80&w=1080", alt: "IDL Offline Center", hint: "classroom students" },
      { src: "https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", alt: "Students learning", hint: "students learning" },
      { src: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", alt: "Students collaborating", hint: "students collaborating" },
    ];
    
    const OutstandingResultsImageSlider = () => {
        const slides = [
            { src: 'https://www.pw.live/version14/assets/img/jee-toppers-2023/pw-jee-topper-2.png', alt: 'Topper Student 1', hint: 'student portrait' },
            { src: 'https://www.pw.live/version14/assets/img/jee-toppers-2023/pw-jee-topper-1.png', alt: 'Topper Student 2', hint: 'student happy' },
            { src: 'https://www.pw.live/version14/assets/img/jee-toppers-2023/pw-jee-topper-3.png', alt: 'Topper Student 3', hint: 'student headshot' },
        ];
    
        const [sliderApi, setSliderApi] = useState<CarouselApi>();
        const [sliderCurrent, setSliderCurrent] = useState(0);
    
        useEffect(() => {
            if (!sliderApi) {
                return;
            }
    
            setSliderCurrent(sliderApi.selectedScrollSnap());
            sliderApi.on("select", () => {
                setSliderCurrent(sliderApi.selectedScrollSnap());
            });
        }, [sliderApi]);
    
        const sliderScrollTo = useCallback(
            (index: number) => {
                sliderApi?.scrollTo(index);
            },
            [sliderApi]
        );
    
        return (
            <section className="w-full py-12">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">Our outstanding{' '}
                            <span className="relative inline-block">
                                <span className="relative z-10">results</span>
                                <span className="absolute -bottom-1 left-0 w-full h-3 bg-yellow-300 z-0"></span>
                            </span>
                        </h2>
                    </div>
                     <div className="relative rounded-2xl overflow-hidden">
                        <Carousel
                          setApi={setSliderApi}
                          plugins={[ Autoplay({ delay: 3000, stopOnInteraction: false }) ]}
                          className="w-full"
                          opts={{ loop: true }}
                        >
                            <CarouselContent>
                                {slides.map((slide, index) => (
                                    <CarouselItem key={index}>
                                        <div className="relative w-full aspect-video md:aspect-[16/7]">
                                            <Image
                                                src={slide.src}
                                                alt={slide.alt}
                                                data-ai-hint={slide.hint}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    </CarouselItem>
                                ))}
                            </CarouselContent>
                        </Carousel>
                         <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex justify-center gap-2">
                            {slides.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => sliderScrollTo(i)}
                                    className={cn(
                                        "h-2 w-2 rounded-full transition-all duration-300",
                                        sliderCurrent === i ? "w-6 bg-white" : "bg-white/50"
                                    )}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        );
    };

    return (
        <div className="bg-white dark:bg-background pb-20">
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
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">IDL Learning Centres Now in{' '}
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
            
            <WhyIDL />
            
            <OutstandingResultsImageSlider />

            <ScholarshipSection />
            
            <FAQSection />

            <FixedBottomBar />
        </div>
    );
}
