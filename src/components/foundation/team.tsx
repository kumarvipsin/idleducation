
'use client';

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Users } from "lucide-react";

const team = [
    { name: "Amod Kumar Sharma", role: "Founder & Managing Director", image: "https://png.pngtree.com/png-clipart/20231006/ourmid/pngtree-handsome-businessman-transparent-background-png-image_10194933.png", description: "Visionary leader with a passion for education and social change." },
    { name: "Manish Sharma", role: "Co-Founder & CEO", image: "https://png.pngtree.com/png-clipart/20231006/ourmid/pngtree-handsome-businessman-transparent-background-png-image_10194933.png", description: "Driving the mission forward with innovation and dedication." },
    { name: "Vidhi Sharma", role: "Chief Operating Officer", image: "https://png.pngtree.com/png-clipart/20231006/ourmid/pngtree-handsome-businessman-transparent-background-png-image_10194933.png", description: "Ensuring operational excellence and impactful program delivery." },
    { name: "Vijay Verma", role: "Head of Skill Development", image: "https://png.pngtree.com/png-clipart/20231006/ourmid/pngtree-handsome-businessman-transparent-background-png-image_10194933.png", description: "Empowering individuals with skills for a brighter future." },
    { name: "Priya Singh", role: "Community Engagement Lead", image: "https://png.pngtree.com/png-clipart/20231006/ourmid/pngtree-handsome-businessman-transparent-background-png-image_10194933.png", description: "Building strong relationships with our communities and partners." },
    { name: "Rajesh Kumar", role: "Finance & Compliance Officer", image: "https://png.pngtree.com/png-clipart/20231006/ourmid/pngtree-handsome-businessman-transparent-background-png-image_10194933.png", description: "Ensuring financial health and regulatory compliance of the foundation." },
    { name: "Sunita Gupta", role: "Program Coordinator", image: "https://png.pngtree.com/png-clipart/20231006/ourmid/pngtree-handsome-businessman-transparent-background-png-image_10194933.png", description: "Managing and coordinating our diverse range of social programs." },
    { name: "Amit Patel", role: "Technology Lead", image: "https://png.pngtree.com/png-clipart/20231006/ourmid/pngtree-handsome-businessman-transparent-background-png-image_10194933.png", description: "Leveraging technology to amplify our impact and reach." },
    { name: "Anita Desai", role: "Education Specialist", image: "https://png.pngtree.com/png-clipart/20231006/ourmid/pngtree-handsome-businessman-transparent-background-png-image_10194933.png", description: "Designing and implementing effective educational programs for all ages." },
    { name: "Ravi Shankar", role: "Healthcare Program Manager", image: "https://png.pngtree.com/png-clipart/20231006/ourmid/pngtree-handsome-businessman-transparent-background-png-image_10194933.png", description: "Overseeing health initiatives and ensuring access to medical care." },
    { name: "Geeta Sharma", role: "Volunteer Coordinator", image: "https://png.pngtree.com/png-clipart/20231006/ourmid/pngtree-handsome-businessman-transparent-background-png-image_10194933.png", description: "Mobilizing and managing our passionate team of volunteers." },
    { name: "Vikram Singh", role: "Field Operations Manager", image: "https://png.pngtree.com/png-clipart/20231006/ourmid/pngtree-handsome-businessman-transparent-background-png-image_10194933.png", description: "Ensuring smooth execution of our on-ground activities and projects." },
];

export function Team() {
    return (
        <section className="w-full py-8 bg-background">
            <div className="text-center mb-8 px-4 md:px-6">
                 <div className="flex justify-center mb-4">
                    <div className="bg-primary/10 p-4 rounded-full">
                        <Users className="w-12 h-12 text-primary" />
                    </div>
                </div>
                <h2 className="text-3xl md:text-4xl font-black text-black dark:text-white">Meet Our Team</h2>
                <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
                    The dedicated individuals leading our mission forward.
                </p>
            </div>
            <div className="relative">
                <div className="overflow-x-auto pb-8 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    <div className="flex gap-6 pl-[10%]">
                        {team.map((member, index) => (
                            <div key={index} className="block flex-shrink-0 w-64 group">
                                <Card className="text-center overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group bg-card rounded-lg h-full">
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
                                        <p className="text-xs text-muted-foreground mt-2">{member.description}</p>
                                    </CardContent>
                                </Card>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
