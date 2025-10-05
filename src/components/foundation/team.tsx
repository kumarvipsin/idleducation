
'use client';

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import React, { useState, useEffect, useCallback } from 'react';
import useEmblaCarousel, { type CarouselApi } from 'embla-carousel-react';
import { cn } from "@/lib/utils";

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

const TeamMemberCard = ({ member }: { member: typeof team[0] }) => (
    <Card className="h-full bg-white dark:bg-card shadow-xl rounded-2xl border-primary/10 overflow-hidden">
        <CardContent className="p-6">
            <div className="flex flex-col items-center gap-4 text-center">
                 <div className="w-32 h-32 flex-shrink-0 relative">
                     <Image
                        src={member.image}
                        alt={member.name}
                        data-ai-hint="person headshot"
                        fill
                        className="rounded-full object-cover shadow-md border-4 border-white"
                    />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-primary">{member.name}</h3>
                    <p className="text-sm text-muted-foreground font-medium">{member.role}</p>
                    <p className="text-sm text-muted-foreground mt-3 text-center">
                        {member.description}
                    </p>
                </div>
            </div>
        </CardContent>
    </Card>
);

export function Team() {
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'center', slidesToScroll: 1 });
    const [selectedIndex, setSelectedIndex] = useState(0);

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
                
                <div className="relative">
                    <div className="overflow-hidden" ref={emblaRef}>
                        <div className="flex -ml-4">
                            {team.map((member, index) => (
                                <div 
                                    key={member.name} 
                                    className="flex-shrink-0 flex-grow-0 basis-full md:basis-1/2 lg:basis-1/3 min-w-0 pl-4"
                                >
                                    <div className={cn(
                                        "transition-transform duration-300",
                                        selectedIndex === index ? "scale-100" : "scale-90 opacity-60"
                                    )}>
                                        <TeamMemberCard member={member} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
