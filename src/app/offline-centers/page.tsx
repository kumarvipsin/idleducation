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
        <section className="bg-blue-50 dark:bg-blue-900/20 py-12">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                    <div className="space-y-4">
                        <h3 className="text-orange-500 font-bold text-lg">Why IDL?</h3>
                        <h2 className="text-3xl md:text-4xl font-bold text-foreground">Unlock True Potential Through<br />Highest Personal Attention</h2>
                        <p className="text-muted-foreground">
                            At IDL we provide highest personal attention through our Student Obsessed Heroes and our Tech-integrated Systems.
                        </p>
                    </div>
                    <div>
                        <Image
                            src="https://images.unsplash.com/photo-1764720572930-eb63afd14b06?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxMHx8c3R1ZGVudCUyMHNjaG9vbHxlbnwwfHx8fDE3NjkwNTUzNzB8MA&ixlib=rb-4.1.0&q=80&w=1080"
                            alt="Teacher helping students"
                            data-ai-hint="teacher students"
                            width={600}
                            height={400}
                            className="rounded-lg shadow-lg"
                        />
                    </div>
                </div>
            </div>
        </section>
    )
}

const ScholarshipSection = () => {
    return (
         <section className="bg-blue-50 dark:bg-blue-900/20 py-12 mt-12">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    <div className="space-y-6">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white">Get up to <span className="text-orange-500">70% scholarship</span> with the Instant IDL Scholarship Admission Test (ISAT)</h2>
                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <Trophy className="h-8 w-8 text-orange-500" />
                                <p className="text-gray-600 dark:text-gray-300">Upto 70% Scholarship on IDL Course Admissions</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <Award className="h-8 w-8 text-orange-500" />
                                <p className="text-gray-600 dark:text-gray-300">Get 2X Scholarship by taking the Test at Our Centre</p>
                            </div>
                        </div>
                        <Button asChild className="rounded-full bg-orange-500 hover:bg-orange-600 text-white font-semibold">
                            <Link href="/scholarship">Register For FREE</Link>
                        </Button>
                        <p className="text-xs text-muted-foreground">Hurry, limited seats are left</p>
                    </div>
                    <div className="relative h-80">
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
      { src: "https://images.unsplash.com/photo-1510531704581-5b2870972060?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxM3x8Y2xhc3Nyb29tfGVufDB8fHx8MTc2OTAwOTMzOHww&ixlib=rb-4.0.3&q=80&w=1080", alt: "IDL Offline Center", hint: "classroom students" },
      { src: "https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", alt: "Students learning", hint: "students learning" },
      { src: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", alt: "Students collaborating", hint: "students collaborating" },
    ];
    
    const OutstandingResults = () => {
        const resultSlides = [
            {
                title: "IDL Students Shine Bright in JEE ADVANCED 2025",
                students: [
                    { name: "Ipsit Mittal", air: "AIR 1", image: "https://www.pw.live/version14/assets/img/jee-toppers-2023/pw-jee-topper-1.png" },
                    { name: "Dhrumil Chauhan", air: "AIR 5", image: "https://www.pw.live/version14/assets/img/jee-toppers-2023/pw-jee-topper-2.png" },
                    { name: "Aditya Neeraje", air: "AIR 27", image: "https://www.pw.live/version14/assets/img/jee-toppers-2023/pw-jee-topper-3.png" }
                ],
                stat: {
                    main: "1 IN 3",
                    sub: "IDL Students Cleared JEE Advanced 2025"
                }
            },
            {
                title: "IDL Students Dominate NEET 2025",
                students: [
                    { name: "Pranjal Aggarwal", air: "AIR 4", image: "https://www.pw.live/version14/assets/img/neet-toppers-2023/pranjal-agarwal.png" },
                    { name: "Dhruv Advani", air: "AIR 5", image: "https://www.pw.live/version14/assets/img/neet-toppers-2023/dhruv-advani.png" },
                    { name: "Aritro Ray", air: "AIR 50", image: "https://www.aakash.ac.in/blog/wp-content/uploads/2023/06/Post-Blog-Banner-1.jpg" },
                ],
                stat: {
                    main: "3 IN 100",
                    sub: "Students in Top 100 All India Ranks"
                }
            }
        ];
    
        return (
            <section className="w-full py-12">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl md:text-4xl font-bold">Our outstanding <span className="text-orange-500">results</span></h2>
                    </div>
                    <Carousel
                        plugins={[Autoplay({ delay: 5000, stopOnInteraction: true })]}
                        opts={{ loop: true }}
                    >
                        <CarouselContent>
                            {resultSlides.map((slide, index) => (
                                <CarouselItem key={index}>
                                    <Card className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-2 md:p-6 rounded-2xl shadow-2xl">
                                        <h3 className="text-center text-sm md:text-lg font-bold mb-2">{slide.title}</h3>
                                        <div className="grid grid-cols-4 gap-2 items-center">
                                            {slide.students.map(student => (
                                                <div key={student.name} className="flex flex-col items-center text-center">
                                                    <Image src={student.image} alt={student.name} width={64} height={64} className="w-12 h-12 md:w-14 md:h-14 rounded-full border-2 border-white object-cover" />
                                                    <p className="font-bold mt-1 text-[0.6rem] md:text-xs">{student.name}</p>
                                                    <div className="text-[0.5rem] bg-gray-800 px-2 py-0.5 rounded-md mt-1">
                                                      {student.air}
                                                    </div>
                                                </div>
                                            ))}
                                            <div className="flex items-center justify-center">
                                                <div className="text-center bg-yellow-400 text-black p-1 rounded-full w-24 h-24 md:w-32 md:h-32 flex flex-col justify-center items-center">
                                                    <p className="text-xs md:text-sm font-semibold">EVERY</p>
                                                    <p className="text-2xl md:text-3xl font-extrabold leading-none">{slide.stat.main}</p>
                                                    <p className="text-[0.5rem] font-semibold mt-1 text-center px-1">{slide.stat.sub}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                    </Carousel>
                </div>
            </section>
        )
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
                                                <h1 className="text-3xl md:text-5xl font-bold">
                                                    IDL Learning Centres Now in Delhi
                                                </h1>
                                            </div>
                                            <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold py-2 px-4 inline-block rounded-lg mb-4">
                                                <p>Offline Courses for CUET | 6-10 Foundation</p>
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
                    <h2 className="text-3xl md:text-4xl font-bold">IDL Learning Centres Now in Delhi</h2>
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
                                <Button asChild variant="outline" className="w-full">
                                    <Link href={center.mapLink} target="_blank" rel="noopener noreferrer">Visit Centre</Link>
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
            
            <WhyIDL />
            
            <OutstandingResults />

            <ScholarshipSection />

            <FixedBottomBar />
        </div>
    );
}
