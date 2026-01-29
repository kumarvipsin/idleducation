'use client';

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ArrowRight } from "lucide-react";

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
    <Dialog>
        <Card className="text-center overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 group bg-card rounded-lg h-full flex flex-col">
            <div className="relative w-full aspect-[1/1]">
                <Image
                    src={member.image}
                    alt={member.name}
                    data-ai-hint="person headshot"
                    fill
                    className="object-cover object-top transition-transform duration-300 group-hover:scale-105"
                />
            </div>
            <CardContent className="p-4 flex-1 flex flex-col">
                <h3 className="text-base md:text-lg font-bold text-foreground">{member.name}</h3>
                <p className="text-xs text-muted-foreground">{member.role}</p>
                <div className="mt-4 text-center flex-grow flex items-end justify-center">
                    <DialogTrigger asChild>
                        <button className="text-xs font-semibold text-primary hover:underline underline-offset-4 group/link flex items-center justify-center mx-auto">
                            MORE <ArrowRight className="ml-1 h-3 w-3 transition-transform duration-300 group-hover/link:translate-x-1" />
                        </button>
                    </DialogTrigger>
                </div>
            </CardContent>
        </Card>
        <DialogContent className="sm:max-w-md bg-white text-foreground">
            <div className="p-4 pt-8">
                <div className="relative flex flex-col items-center text-center">
                    <div className="w-32 h-32 rounded-full border-4 border-white/80 shadow-lg flex items-center justify-center overflow-hidden -mt-24 mb-4 bg-primary">
                        <div className="relative w-full h-full">
                            <Image
                                src={member.image}
                                alt={member.name}
                                fill
                                className="object-cover"
                            />
                        </div>
                    </div>
                    <DialogTitle className="text-2xl font-bold tracking-tight text-primary">{member.name}</DialogTitle>
                    <DialogDescription className="text-sm uppercase tracking-widest text-muted-foreground">{member.role}</DialogDescription>
                    
                    <p className="text-sm text-muted-foreground mt-4 text-center">
                        {member.description}
                    </p>
                </div>
            </div>
        </DialogContent>
    </Dialog>
);


export function Team() {
    return (
        <section className="w-full py-16 md:py-24 bg-background">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center mb-12">
                     <h2 className="text-3xl md:text-4xl font-black text-black dark:text-white">Meet Our Team</h2>
                    <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
                        The dedicated individuals leading our mission forward.
                    </p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {team.map((member, index) => (
                        <TeamMemberCard key={index} member={member} />
                    ))}
                </div>
            </div>
        </section>
    );
}
