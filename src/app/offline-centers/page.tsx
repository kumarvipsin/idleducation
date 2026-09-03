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
      imageUrl: "/idlbranch.png",
      imageHint: "IDL Education branch building",
      mapLink: "https://maps.app.goo.gl/uGr9CB7W8fpRUxJD6"
    },
    {
      name: "Mangol Puri",
      address: "Mangol Puri, Delhi-110083",
      imageUrl: "/idlbranch.png",
      imageHint: "IDL Education branch building",
      mapLink: "https://maps.app.goo.gl/uGr9CB7W8fpRUxJD6"
    },
    {
      name: "Budh Vihar",
      address: "Budh Vihar, Delhi-110086",
      imageUrl: "/idlbranch.png",
      imageHint: "IDL Education branch building",
      mapLink: "https://maps.app.goo.gl/uGr9CB7W8fpRUxJD6"
    },
    {
      name: "Krishan Vihar",
      address: "Krishan Vihar, Delhi-110086",
      imageUrl: "/idlbranch.png",
      imageHint: "IDL Education branch building",
      mapLink: "https://maps.app.goo.gl/uGr9CB7W8fpRUxJD6"
    }
];

export default function OfflineCentersPage() {
    return (
        <div className="relative bg-white dark:bg-background pb-20">
            {/* Single Banner Image */}
            <div className="container mx-auto px-4 md:px-6 pt-4 pb-2">
                 <div className="relative rounded-2xl overflow-hidden shadow-sm border bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
                    <Image
                        src="/idlbranch1.png"
                        alt="IDL Offline Centres Map - 4 Centres. One Commitment."
                        width={1920}
                        height={1080}
                        className="w-full h-auto object-contain rounded-2xl"
                        priority
                    />
                </div>
            </div>

            {/* Heading Section */}
            <div className="container mx-auto px-4 md:px-6 pt-8 pb-10">
                <div className="text-left mb-10 animate-fade-in-up">
                    <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight text-foreground">
                        Our Learning Centres in{' '}
                        <span className="relative inline-block">
                            <span className="relative z-10 text-blue-600">Delhi</span>
                            <div className="absolute -bottom-1 left-0 w-full h-2.5 z-0">
                                <svg viewBox="0 0 100 15" preserveAspectRatio="none" className="w-full h-full text-blue-500 fill-none stroke-current stroke-[10] opacity-70">
                                    <path d="M0,15 Q50,5 100,15" />
                                </svg>
                            </div>
                        </span>
                    </h2>
                    <p className="text-sm md:text-base text-muted-foreground mt-3 max-w-2xl font-medium leading-relaxed">
                        Focused classrooms, dedicated mentors, and a learning environment designed to help students achieve their goals.
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
                                        <a href="tel:8860040010">
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
