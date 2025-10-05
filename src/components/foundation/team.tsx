
'use client';

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Users } from "lucide-react";
import React, { useState, useEffect, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

const team = [
    { name: "Amod Kumar Sharma", role: "Founder & Managing Director", image: "https://picsum.photos/seed/1/400/400", description: "Visionary leader with a passion for education and social change." },
    { name: "Manish Sharma", role: "Co-Founder & CEO", image: "https://picsum.photos/seed/2/400/400", description: "Driving the mission forward with innovation and dedication." },
    { name: "Vidhi Sharma", role: "Chief Operating Officer", image: "https://picsum.photos/seed/3/400/400", description: "Ensuring operational excellence and impactful program delivery." },
    { name: "Vijay Verma", role: "Head of Skill Development", image: "https://picsum.photos/seed/4/400/400", description: "Empowering individuals with skills for a brighter future." },
    { name: "Priya Singh", role: "Community Engagement Lead", image: "https://picsum.photos/seed/5/400/400", description: "Building strong relationships with our communities and partners." },
];

const TeamMemberCard = ({ member }: { member: typeof team[0] }) => (
    <Card className="max-w-2xl mx-auto bg-white dark:bg-card shadow-xl rounded-2xl border-primary/10 overflow-hidden">
        <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center gap-6">
                 <div className="w-24 h-24 md:w-32 md:h-32 flex-shrink-0 relative">
                     <Image
                        src={member.image}
                        alt={member.name}
                        data-ai-hint="person headshot"
                        fill
                        className="rounded-lg object-cover shadow-md"
                    />
                </div>
                <div className="text-center md:text-left">
                    <h3 className="text-xl font-bold text-primary">{member.name}</h3>
                    <p className="text-sm text-muted-foreground font-medium">{member.role}</p>
                    <p className="text-sm text-muted-foreground mt-4 text-justify">
                        {member.description}
                    </p>
                </div>
            </div>
        </CardContent>
    </Card>
);

export function Team() {
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'center' });
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
        <section className="w-full py-8 bg-background">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center mb-12">
                     <h2 className="text-3xl md:text-4xl font-black text-black dark:text-white">Meet Our Team</h2>
                    <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
                        The dedicated individuals leading our mission forward.
                    </p>
                </div>
                
                <div className="space-y-8">
                    <div className="relative">
                        <div className="overflow-hidden" ref={emblaRef}>
                            <div className="flex">
                                {team.map((member) => (
                                    <div key={member.name} className="flex-shrink-0 flex-grow-0 basis-full min-w-0">
                                        <TeamMemberCard member={member} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="relative flex items-center justify-center gap-4 px-12">
                         <div className="absolute left-0 right-0 top-1/2 h-px bg-gray-300 dark:bg-gray-700 -z-10" />
                        {team.map((member, index) => (
                            <button key={member.name} onClick={() => scrollTo(index)} className="relative shrink-0">
                                <div className={cn(
                                    "w-20 h-20 rounded-full overflow-hidden transition-all duration-300 grayscale hover:grayscale-0",
                                     selectedIndex === index ? 'scale-125 grayscale-0 border-4 border-primary' : 'scale-90 opacity-60'
                                )}>
                                    <Image
                                        src={member.image}
                                        alt={member.name}
                                        data-ai-hint="person headshot"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            </button>
                        ))}
                    </div>
                     <div className="flex justify-center gap-2 mt-4">
                        <Button variant="outline" size="icon" onClick={scrollPrev} className="rounded-full">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" onClick={scrollNext} className="rounded-full">
                            <ArrowRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
}
