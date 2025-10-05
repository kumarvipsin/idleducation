
'use client';

import { Button } from "@/components/ui/button";
import { HandHeart, Target, Eye, Briefcase, UserRound, Trees, Save, ArrowRight, Heart, BookOpen, Home, Users, HelpingHand, UserCircle, Handshake } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Header } from "@/components/header";
import { FoundationHero } from "@/components/landing/foundation-hero";

const donationCategories = [
    { title: "Skill Trainings", description: "Help individuals gain valuable skills for a better future.", imageUrl: "https://ekhumfoundation.com/wp-content/uploads/2022/02/Donate.jpeg", imageHint: "team training" },
    { title: "Street & Slum Children Education", description: "Provide access to education for children in need.", imageUrl: "https://ekhumfoundation.com/wp-content/uploads/2022/02/Donate.jpeg", imageHint: "children studying" },
    { title: "Environment / Tree Plantation", description: "Contribute to a greener planet for future generations.", imageUrl: "https://ekhumfoundation.com/wp-content/uploads/2022/02/Donate.jpeg", imageHint: "planting tree" },
    { title: "Women Empowerment", description: "Support programs that empower women and promote equality.", imageUrl: "https://ekhumfoundation.com/wp-content/uploads/2022/02/Donate.jpeg", imageHint: "women group" },
    { title: "Medical Assistance", description: "Help provide essential healthcare to those who can't afford it.", imageUrl: "https://ekhumfoundation.com/wp-content/uploads/2022/02/Donate.jpeg", imageHint: "doctor patient" },
    { title: "Senior Citizen/Old Age Home", description: "Support the elderly and ensure they live with dignity.", imageUrl: "https://ekhumfoundation.com/wp-content/uploads/2022/02/Donate.jpeg", imageHint: "elderly people" },
];

const companies = [
    { name: "DDU-GKY", logo: "https://picsum.photos/seed/ddu/200/100" },
    { name: "Maulana Azad Education Foundation", logo: "https://picsum.photos/seed/maef/200/100" },
    { name: "Ministry of Textiles", logo: "https://picsum.photos/seed/textiles/200/100" },
    { name: "Delhi Government", logo: "https://picsum.photos/seed/delhi/200/100" },
];

const people = [
    { name: "Bhagwati Exports", logo: "https://picsum.photos/seed/bhagwati/200/100" },
    { name: "Another Donor", logo: "https://picsum.photos/seed/donor2/200/100" },
    { name: "New Foundation", logo: "https://picsum.photos/seed/foundation/200/100" },
    { name: "Charity Plus", logo: "https://picsum.photos/seed/charity/200/100" },
];

const stats = [
    { icon: Users, count: 143703, label: 'Visitors' },
    { icon: HelpingHand, count: 255, label: 'Donors', plus: true },
    { icon: UserCircle, count: 28, label: 'Members' },
    { icon: Handshake, count: 37, label: 'Volunteers' }
]

export default function IDLFoundationPage() {
    return (
        <div className="relative w-full bg-background overflow-y-auto">
            <Header />

            <FoundationHero slides={donationCategories} />
            
            <section className="w-full relative py-12 md:py-24 bg-white dark:bg-gray-800/20">
                <div className="container mx-auto px-4 md:px-[10%] mb-12">
                    <div className="text-center">
                        <div className="flex justify-center mb-4">
                                <div className="bg-primary/10 p-4 rounded-full">
                                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="url(#heart-gradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-12 h-12">
                                    <defs>
                                        <linearGradient id="heart-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" style={{stopColor: 'red', stopOpacity:1}} />
                                        <stop offset="100%" style={{stopColor: 'darkred', stopOpacity:1}} />
                                        </linearGradient>
                                    </defs>
                                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                                    </svg>
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

            <section className="w-full py-12 md:py-20 bg-primary text-primary-foreground">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        {stats.map((stat, index) => (
                            <div key={index} className="flex flex-col items-center">
                                <stat.icon className="w-12 h-12 mb-2" />
                                <p className="text-3xl md:text-4xl font-bold">
                                    {stat.count.toLocaleString()}{stat.plus && '+'}
                                </p>
                                <p className="text-sm md:text-base font-medium">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            
            <section className="w-full py-12 md:py-24 bg-background">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-foreground">Our Donors</h2>
                    </div>
                    <div className="space-y-8">
                        <div>
                            <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest text-center mb-4">10+ Companies and Organizations</h3>
                            <div className="w-full overflow-hidden">
                                <div className="flex animate-marquee-scroll">
                                    {[...companies, ...companies].map((donor, index) => (
                                        <Card key={`company-${index}`} className="flex-shrink-0 w-64 flex items-center p-4 bg-card shadow-lg mx-3 rounded-lg">
                                            <p className="text-sm font-semibold text-center text-muted-foreground flex-1">{donor.name}</p>
                                            <div className="relative h-12 w-20 ml-4">
                                                <Image
                                                    src={donor.logo}
                                                    alt={`${donor.name} logo`}
                                                    fill
                                                    className="object-contain"
                                                />
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="mt-12">
                            <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest text-center mb-4">200+ People</h3>
                            <div className="w-full overflow-hidden">
                                <div className="flex animate-marquee-scroll-reverse">
                                    {[...people, ...people].map((donor, index) => (
                                        <Card key={`person-${index}`} className="flex-shrink-0 w-64 flex items-center p-4 bg-card shadow-lg mx-3 rounded-lg">
                                            <p className="text-sm font-semibold text-center text-muted-foreground flex-1">{donor.name}</p>
                                            <div className="relative h-12 w-20 ml-4">
                                                <Image
                                                    src={donor.logo}
                                                    alt={`${donor.name} logo`}
                                                    fill
                                                    className="object-contain"
                                                />
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
