
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Building, MapPin, Phone, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from 'next/link';
import React from 'react';

const centers = [
    {
      name: "Mukherjee Nagar",
      address: "Mukherjee Nagar, Delhi-110009",
      imageUrl: "https://picsum.photos/seed/center1/800/600",
      imageHint: "classroom students",
      mapLink: "https://maps.app.goo.gl/uGr9CB7W8fpRUxJD6"
    },
    {
      name: "Mangol Puri",
      address: "D-Block Mangol Puri, Delhi-110083",
      imageUrl: "https://picsum.photos/seed/center2/800/600",
      imageHint: "modern classroom",
      mapLink: "https://maps.app.goo.gl/uGr9CB7W8fpRUxJD6"
    },
    {
      name: "Budh Vihar",
      address: "Budh Vihar Phase-1, Delhi-110086",
      imageUrl: "https://picsum.photos/seed/center3/800/600",
      imageHint: "students learning",
      mapLink: "https://maps.app.goo.gl/uGr9CB7W8fpRUxJD6"
    },
    {
      name: "Krishan Vihar",
      address: "E-Block Krishan Vihar, Delhi-110086",
      imageUrl: "https://picsum.photos/seed/center4/800/600",
      imageHint: "library books",
      mapLink: "https://maps.app.goo.gl/uGr9CB7W8fpRUxJD6"
    }
];

export default function OfflineCentersPage() {
    return (
        <div className="relative bg-white dark:bg-background pb-20">
            {/* Single Banner Image */}
            <div className="container mx-auto px-4 md:px-6 py-2">
                 <div className="relative rounded-2xl overflow-hidden shadow-sm border aspect-video md:aspect-[21/7]">
                    <Image
                        src="https://picsum.photos/seed/offline-center-banner/1920/640"
                        alt="IDL Offline Center"
                        data-ai-hint="modern classroom"
                        fill
                        className="object-cover"
                        priority
                    />
                </div>
            </div>

            {/* Heading Section */}
            <div className="container mx-auto px-4 md:px-6 py-12 md:py-16">
                <div className="text-center mb-16 animate-fade-in-up">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 border border-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest mb-4">
                        OFFLINE LEARNING
                    </div>
                    <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-foreground">
                        IDL Learning Centres Now in{' '}
                        <span className="relative inline-block">
                            <span className="relative z-10 text-blue-600">Delhi</span>
                            <div className="absolute -bottom-1 left-0 w-full h-3 z-0">
                                <svg viewBox="0 0 100 15" preserveAspectRatio="none" className="w-full h-full text-blue-500 fill-none stroke-current stroke-[10] opacity-70">
                                    <path d="M0,15 Q50,5 100,15" />
                                </svg>
                            </div>
                        </span>
                    </h2>
                    <p className="text-sm md:text-base text-muted-foreground mt-6 max-w-2xl mx-auto font-bold leading-relaxed">
                        Experience premium education in person at our state-of-the-art facilities across the capital. Our centres provide a focused environment for student growth, personalized mentorship, and academic excellence.
                    </p>
                </div>

                {/* Centers Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {centers.map((center, index) => (
                        <Card key={center.name} className="overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 flex flex-col bg-card border-muted-foreground/10 animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                            <div className="relative h-56 w-full overflow-hidden">
                                <Image
                                    src={center.imageUrl}
                                    alt={center.name}
                                    data-ai-hint={center.imageHint}
                                    fill
                                    className="object-cover transition-transform duration-700 hover:scale-110"
                                />
                            </div>
                            <CardContent className="p-6 flex-grow flex flex-col">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
                                    <h3 className="text-xl font-bold text-foreground tracking-tight">{center.name}</h3>
                                </div>
                                <div className="flex items-start gap-2 text-muted-foreground mb-8 flex-grow">
                                    <MapPin className="w-4 h-4 mt-1 shrink-0 text-primary" />
                                    <p className="text-[13px] font-bold leading-relaxed">{center.address}</p>
                                </div>
                                <div className="flex flex-col gap-3">
                                    <Button asChild variant="outline" className="w-full h-12 rounded-xl font-bold border-primary/20 text-primary hover:bg-primary/5 transition-all shadow-none">
                                        <a href="tel:7011117585">
                                            <Phone className="w-4 h-4 mr-2" />
                                            Call Us
                                        </a>
                                    </Button>
                                    <Button asChild className="w-full h-12 rounded-xl font-bold shadow-lg shadow-primary/10 transition-all active:scale-95 group/btn">
                                        <Link href={center.mapLink} target="_blank" rel="noopener noreferrer">
                                            Visit Centre
                                            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                                        </Link>
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
