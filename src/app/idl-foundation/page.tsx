
'use client';

import { Button } from "@/components/ui/button";
import { HandHeart, Target, Eye, Briefcase, UserRound, Trees, Save, ArrowRight, Heart, BookOpen, Home } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Header } from "@/components/header";
import { FoundationHero } from "@/components/landing/foundation-hero";

const donationCategories = [
    { title: "Skill Trainings", description: "Help individuals gain valuable skills for a better future.", imageUrl: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", imageHint: "team training" },
    { title: "Street & Slum Children Education", description: "Provide access to education for children in need.", imageUrl: "https://images.unsplash.com/photo-1594735232922-261543dd3a48?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", imageHint: "children studying" },
    { title: "Environment / Tree Plantation", description: "Contribute to a greener planet for future generations.", imageUrl: "https://images.unsplash.com/photo-1518544458318-775c74de0b90?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", imageHint: "planting tree" },
    { title: "Women Empowerment", description: "Support programs that empower women and promote equality.", imageUrl: "https://images.unsplash.com/photo-1567427018141-0584cfcbf1b8?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", imageHint: "women group" },
    { title: "Medical Assistance", description: "Help provide essential healthcare to those who can't afford it.", imageUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", imageHint: "doctor patient" },
    { title: "Senior Citizen/Old Age Home", description: "Support the elderly and ensure they live with dignity.", imageUrl: "https://images.unsplash.com/photo-1598411354366-052445e90f528?q=80&w=1934&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", imageHint: "elderly people" },
];

export default function IDLFoundationPage() {
    return (
        <div className="relative w-full bg-background overflow-y-auto">
            <Header />

            <FoundationHero slides={donationCategories} />
            
            <section className="w-full relative py-12 md:py-24 bg-white dark:bg-gray-800/20">
                <div className="container mx-auto px-4 md:px-[10%] mb-12">
                    <div className="text-center">
                        <div className="flex justify-center mb-4">
                            <div className="bg-primary/10 text-primary p-4 rounded-full">
                                <Heart className="w-12 h-12" />
                            </div>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-sans font-bold text-foreground">
                            Make World Happier
                        </h1>
                        <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
                            Join us in making a difference. Your contribution can change lives.
                        </p>
                        <div className="mt-6">
                            <Button className="font-bold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700">Donate</Button>
                        </div>
                    </div>
                </div>
                <div className="relative">
                    <div className="overflow-x-auto pb-8 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                        <div className="flex gap-6 px-4 md:px-[10%]">
                            {donationCategories.map((category, index) => (
                            <div key={index} className="block flex-shrink-0 w-[300px] sm:w-[350px] group">
                                <Card className="h-full rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col bg-card">
                                <CardContent className="p-8 flex-grow flex flex-col">
                                    <h3 className="text-xl text-left font-bold mt-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">{category.title}</h3>
                                    <p className="text-sm text-muted-foreground mt-1 text-left">{category.description}</p>
                                    <div className="mt-4 text-left">
                                        <Button asChild variant="outline" className="font-bold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out">
                                            <Link href="#">
                                                More
                                                <ArrowRight className="w-4 h-4 ml-2" />
                                            </Link>
                                        </Button>
                                    </div>
                                </CardContent>
                                 <div className="relative aspect-[4/3] w-full mt-auto">
                                    <Image
                                    src={category.imageUrl}
                                    alt={category.title}
                                    data-ai-hint={category.imageHint}
                                    fill
                                    className="object-cover"
                                    />
                                </div>
                                </Card>
                            </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
