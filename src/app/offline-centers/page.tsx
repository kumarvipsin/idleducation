'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowRight, Building, Sparkles, MapPin, Trophy, Award, X, Phone } from "lucide-react";
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
      name: "Mukherjee Nagar",
      address: "Mukherjee Nagar, Delhi-110009",
      imageUrl: "https://picsum.photos/seed/center1/400/300",
      imageHint: "classroom students",
      mapLink: "https://maps.app.goo.gl/uGr9CB7W8fpRUxJD6"
    },
    {
      name: "Mangol Puri",
      address: "D-Block Mangol Puri, Delhi-110083",
      imageUrl: "https://picsum.photos/seed/center2/400/300",
      imageHint: "modern classroom",
      mapLink: "https://maps.app.goo.gl/uGr9CB7W8fpRUxJD6"
    },
    {
      name: "Budh Vihar",
      address: "Budh Vihar Phase-1, Delhi-110086",
      imageUrl: "https://picsum.photos/seed/center3/400/300",
      imageHint: "students learning",
      mapLink: "https://maps.app.goo.gl/uGr9CB7W8fpRUxJD6"
    },
    {
      name: "Krishan Vihar",
      address: "E-Block Krishan Vihar, Delhi-110086",
      imageUrl: "https://picsum.photos/seed/center4/400/300",
      imageHint: "library books",
      mapLink: "https://maps.app.goo.gl/uGr9CB7W8fpRUxJD6"
    }
];

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
                 <div className="relative rounded-2xl overflow-hidden shadow-sm border">
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
                <div className="text-center mb-12 animate-fade-in-up">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 border border-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest mb-4">
                        Offline Learning
                    </div>
                    <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">IDL Learning Centres Now in{' '}
                        <span className="relative inline-block">
                            <span className="relative z-10">Delhi</span>
                            <div className="absolute -bottom-1 left-0 w-full h-3 z-0">
                                <svg viewBox="0 0 100 15" preserveAspectRatio="none" className="w-full h-full text-blue-500 fill-none stroke-current stroke-[10] opacity-70">
                                    <path d="M0,15 Q50,5 100,15" />
                                </svg>
                            </div>
                        </span>
                    </h2>
                    <p className="text-sm text-muted-foreground mt-4 max-w-2xl mx-auto font-bold leading-relaxed">
                        Experience premium education in person at our state-of-the-art facilities across the capital. Our centres provide a focused environment for student growth and excellence.
                    </p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
                    {cities.map(city => (
                        <Card key={city} className="p-4 flex items-center gap-3 hover:shadow-md hover:border-primary transition-all cursor-pointer group">
                            <div className="bg-primary/10 p-2 rounded-lg group-hover:bg-primary group-hover:text-white transition-colors">
                                <Building className="w-6 h-6 text-primary group-hover:text-inherit" />
                            </div>
                            <p className="font-semibold text-sm">{city}</p>
                        </Card>
                    ))}
                </div>
            </div>

            <div className="container mx-auto px-4 md:px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {centers.map((center) => (
                        <Card key={center.name} className="overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col bg-card border-muted-foreground/10">
                            <div className="relative h-48 w-full">
                                <Image
                                    src={center.imageUrl}
                                    alt={center.name}
                                    data-ai-hint={center.imageHint}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <CardContent className="p-6 flex-grow flex flex-col">
                                <h3 className="text-xl font-bold mb-2 text-foreground">{center.name}</h3>
                                <div className="flex items-start gap-2 text-muted-foreground mb-6 flex-grow">
                                    <MapPin className="w-4 h-4 mt-1 shrink-0 text-primary" />
                                    <p className="text-sm font-medium leading-relaxed">{center.address}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <Button asChild variant="outline" className="h-12 rounded-xl font-bold border-primary/20 text-primary hover:bg-primary/5 transition-all">
                                        <a href="tel:7011117585">
                                            <Phone className="w-4 h-4 mr-2" />
                                            Call Us
                                        </a>
                                    </Button>
                                    <Button asChild className="h-12 rounded-xl font-bold shadow-md shadow-primary/10 transition-all">
                                        <Link href={center.mapLink} target="_blank" rel="noopener noreferrer">Visit Centre</Link>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

        </div>
    );
}
