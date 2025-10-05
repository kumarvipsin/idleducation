
'use client';

import { Button } from "@/components/ui/button";
import { Home, HandHeart, Target, Eye, PiggyBank, Book, Trees, UserRound, Briefcase, Plus, Heart } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Header } from "@/components/header";
import { FoundationHero } from "@/components/landing/foundation-hero";

const donationCategories = [
    { title: "Skill Trainings", icon: <Briefcase className="w-8 h-8" /> },
    { title: "Slum Children Education", icon: <Book className="w-8 h-8" /> },
    { title: "Street Children Education", icon: <UserRound className="w-8 h-8" /> },
    { title: "Environment / Tree Plantation", icon: <Trees className="w-8 h-8" /> },
    { title: "Women Empowerment", icon: <Heart className="w-8 h-8" /> },
    { title: "Medical Assistance", icon: <Plus className="w-8 h-8" /> },
    { title: "Senior Citizen/Old Age Home", icon: <Home className="w-8 h-8" /> },
];

export default function IDLFoundationPage() {
    return (
        <div className="relative w-full bg-background overflow-y-auto">
            <Header />

            <FoundationHero />

            <section className="py-16 md:py-24 bg-white dark:bg-gray-800/20">
                <div className="container mx-auto px-4 md:px-6">
                     <div className="text-center mb-12">
                        <h1 className="text-4xl md:text-6xl font-sans font-bold text-foreground">Make World Happier</h1>
                        <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
                            Join us in making a difference. Your contribution can change lives.
                        </p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                        {donationCategories.map((category, index) => (
                             <Card key={index} className="text-center group shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                                <CardContent className="p-6">
                                    <div className="mx-auto h-16 w-16 mb-4 flex items-center justify-center rounded-full bg-primary/10 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-white">
                                        {category.icon}
                                    </div>
                                    <h3 className="text-sm md:text-base font-semibold text-foreground">{category.title}</h3>
                                    <Button variant="outline" size="sm" className="mt-4 rounded-full">Donate</Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-16 md:py-24 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-primary flex items-center justify-center gap-3">
                            <HandHeart className="w-8 h-8" />
                            About IDL Foundation
                        </h2>
                        <p className="text-muted-foreground mt-2 max-w-3xl mx-auto">
                            Committed to creating a brighter future through education, empowerment, and community development.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 items-center">
                        <div className="space-y-6">
                             <div className="flex items-start gap-4">
                                <div className="bg-primary/10 text-primary p-3 rounded-full">
                                    <Eye className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-foreground">Our Vision</h3>
                                    <p className="text-muted-foreground">To create a world where every individual has the opportunity to reach their full potential through quality education and sustainable community support.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="bg-primary/10 text-primary p-3 rounded-full">
                                    <Target className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-foreground">Our Mission</h3>
                                    <p className="text-muted-foreground">The IDL Foundation is dedicated to providing educational resources, scholarships, and mentorship to underprivileged students. We strive to foster an environment of learning and growth that empowers individuals to become leaders and innovators in their communities.</p>
                                </div>
                            </div>
                        </div>

                         <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                           <CardContent className="p-0">
                               <div className="relative aspect-video w-full">
                                    <Image
                                        src="https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                                        alt="Group of volunteers"
                                        data-ai-hint="volunteers community"
                                        fill
                                        className="object-cover rounded-t-lg"
                                    />
                               </div>
                                <div className="p-4">
                                    <h4 className="font-bold">Our Activities</h4>
                                    <p className="text-sm text-muted-foreground mt-1">We organize educational workshops, provide scholarships, run mentorship programs, and engage in community outreach to ensure holistic development for students from all backgrounds.</p>
                                </div>
                           </CardContent>
                        </Card>
                    </div>
                </div>
            </section>
        </div>
    );
}
