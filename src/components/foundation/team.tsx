
'use client';

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import React, { useState, useEffect, useCallback, useRef } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from "embla-carousel-autoplay";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

const team = [
    { name: "Amod Kumar Sharma", role: "Founder & Managing Director", image: "https://picsum.photos/seed/1/400/400", description: "Visionary leader with a passion for education and social change." },
    { name: "Manish Sharma", role: "Co-Founder & CEO", image: "https://picsum.photos/seed/2/400/400", description: "Driving the mission forward with innovation and dedication." },
    { name: "Vidhi Sharma", role: "Chief Operating Officer", image: "https://picsum.photos/seed/3/400/400", description: "Ensuring operational excellence and impactful program delivery." },
    { name: "Vijay Verma", role: "Head of Skill Development", image: "https://picsum.photos/seed/4/400/400", description: "Empowering individuals with skills for a brighter future." },
    { name: "Priya Singh", role: "Community Engagement Lead", image: "https://picsum.photos/seed/5/400/400", description: "Building strong relationships with our communities and partners." },
    { name: "Rahul Gupta", role: "Technology Head", image: "https://picsum.photos/seed/6/400/400", description: "Leveraging technology to make education accessible to all." },
    { name: "Anjali Mehta", role: "Healthcare Coordinator", image: "https://picsum.photos/seed/7/400/400", description: "Leading our health initiatives and medical assistance programs." },
    { name: "Suresh Kumar", role: "Environmental Projects Manager", image: "https://picsum.photos/seed/8/400/400", description: "Spearheading our green initiatives and plantation drives." },
];

const TeamMemberCard = ({ member, isActive }: { member: typeof team[0], isActive: boolean }) => (
     <Card className={cn(
        "h-full shadow-xl rounded-2xl border-0 overflow-hidden transition-all duration-300 relative aspect-[4/5]",
        isActive ? "scale-105" : "scale-95 opacity-80"
    )}>
        <Image
            src={member.image}
            alt={member.name}
            data-ai-hint="person headshot"
            fill
            className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
        <CardContent className="p-4 absolute bottom-0 left-0 right-0 text-white">
             <h3 className="text-lg font-bold">{member.name}</h3>
             <p className="text-sm text-white/90">{member.role}</p>
        </CardContent>
    </Card>
);

export function Team() {
    const autoplayPlugin = useRef(Autoplay({ delay: 3000, stopOnInteraction: true, stopOnMouseEnter: true }));
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'center', slidesToScroll: 1 }, [autoplayPlugin.current]);
    const [selectedIndex, setSelectedIndex] = useState(0);

    const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
    const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);
    const scrollTo = useCallback((index: number) => emblaApi && emblaApi.scrollTo(index), [emblaApi]);

    const onSelect = useCallback(() => {
        if (!emblaApi) return;
        setSelectedIndex(emblaApi.selectedScrollSnap());
    }, [emblaApi, setSelectedIndex]);

    useEffect(() => {
        if (!emblaApi) return;
        onSelect();
        emblaApi.on('select', onSelect);
        emblaApi.on('reInit', onSelect);
    }, [emblaApi, onSelect]);

    return (
        <section className="w-full py-16 md:py-24 bg-background">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center mb-12">
                     <h2 className="text-3xl md:text-4xl font-black text-black dark:text-white">Meet Our Team</h2>
                    <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
                        The dedicated individuals leading our mission forward.
                    </p>
                </div>
                
                <div className="relative">
                    <div className="overflow-hidden" ref={emblaRef}>
                        <div className="flex -ml-4">
                            {team.map((member, index) => (
                                <div 
                                    key={member.name} 
                                    className="flex-shrink-0 flex-grow-0 basis-full md:basis-1/3 lg:basis-1/4 min-w-0 pl-4"
                                >
                                    <TeamMemberCard member={member} isActive={selectedIndex === index} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                 <div className="flex justify-center items-center gap-2 mt-8">
                     <Button variant="outline" size="icon" onClick={scrollPrev} className="rounded-full h-8 w-8">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    {team.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => scrollTo(index)}
                            className={cn(
                                "h-2 w-2 rounded-full transition-all duration-300",
                                selectedIndex === index ? "w-6 bg-primary" : "bg-muted-foreground/50"
                            )}
                        />
                    ))}
                    <Button variant="outline" size="icon" onClick={scrollNext} className="rounded-full h-8 w-8">
                        <ArrowRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </section>
    );
}
