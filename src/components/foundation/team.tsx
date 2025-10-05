'use client';

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Users } from "lucide-react";

const team = [
    { name: "Amod Kumar Sharma", role: "Founder & Managing Director", image: "https://picsum.photos/seed/1/400/400", description: "Visionary leader with a passion for education and social change." },
    { name: "Manish Sharma", role: "Co-Founder & CEO", image: "https://picsum.photos/seed/2/400/400", description: "Driving the mission forward with innovation and dedication." },
    { name: "Vidhi Sharma", role: "Chief Operating Officer", image: "https://picsum.photos/seed/3/400/400", description: "Ensuring operational excellence and impactful program delivery." },
    { name: "Vijay Verma", role: "Head of Skill Development", image: "https://picsum.photos/seed/4/400/400", description: "Empowering individuals with skills for a brighter future." },
    { name: "Priya Singh", role: "Community Engagement Lead", image: "https://picsum.photos/seed/5/400/400", description: "Building strong relationships with our communities and partners." },
];

export function Team() {
    return (
        <section className="w-full py-8 bg-background">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center mb-8">
                    <h2 className="text-3xl md:text-4xl font-black text-black dark:text-white">Meet Our Team</h2>
                    <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
                        The dedicated individuals leading our mission forward.
                    </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                    {team.map((member, index) => (
                        <Card key={index} className="text-center overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group bg-card rounded-lg h-full">
                            <div className="relative w-full aspect-square">
                                <Image
                                    src={member.image}
                                    alt={member.name}
                                    data-ai-hint="person headshot"
                                    fill
                                    className="object-cover object-top transition-transform duration-300 group-hover:scale-105"
                                />
                            </div>
                            <CardContent className="p-4">
                                <h3 className="text-base md:text-lg font-bold text-foreground">{member.name}</h3>
                                <p className="text-xs text-muted-foreground">{member.role}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}
