
'use client';

import { Button } from "@/components/ui/button";
import { HandHeart, Target, Eye, Briefcase, UserRound, Trees, Save, ArrowRight, Heart, BookOpen, Home, Users, HelpingHand, UserCircle, Handshake, Plus, PlayCircle, Mail, Phone, MapPin, Instagram, Facebook, Twitter, Linkedin } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Header } from "@/components/header";
import { FoundationHero } from "@/components/landing/foundation-hero";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";

const donationCategories = [
    { title: "Skill Trainings", description: "Empower individuals with valuable skills for a better future.", imageUrl: "https://picsum.photos/seed/training/600/400", imageHint: "team training", goal: 7089758, raised: 533619 },
    { title: "Street & Slum Children Education", description: "Light up a child's future with the gift of education.", imageUrl: "https://picsum.photos/seed/slum/600/400", imageHint: "children studying", goal: 7089758, raised: 0 },
    { title: "Environment / Tree Plantation", description: "Help us nurture a greener and healthier planet.", imageUrl: "https://picsum.photos/seed/tree/600/400", imageHint: "planting tree", goal: 7089758, raised: 0 },
    { title: "Women Empowerment", description: "Support initiatives that uplift and empower women.", imageUrl: "https://picsum.photos/seed/women/600/400", imageHint: "women group", goal: 5000000, raised: 1250000 },
    { title: "Medical Assistance", description: "Provide critical healthcare to those who can't afford it.", imageUrl: "https://picsum.photos/seed/medical/600/400", imageHint: "doctor patient", goal: 3000000, raised: 300000 },
    { title: "Senior Citizen/Old Age Home", description: "Ensure our elders live with dignity and care.", imageUrl: "https://picsum.photos/seed/elderly/600/400", imageHint: "elderly people", goal: 2500000, raised: 800000 },
];

const galleryImages = [
    { src: 'https://picsum.photos/seed/gallery1/600/600', alt: 'Community gathering', hint: 'community gathering', title: 'Community Outreach' },
    { src: 'https://picsum.photos/seed/gallery2/600/600', alt: 'Children learning', hint: 'children learning', title: 'Educational Initiatives' },
    { src: 'https://picsum.photos/seed/gallery3/600/600', alt: 'Event presentation', hint: 'event presentation', title: 'Awareness Campaigns' },
    { src: 'https://picsum.photos/seed/gallery4/600/600', alt: 'Group discussion', hint: 'group discussion', title: 'Skill Development' },
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

const EventVideo = ({ videoId, title }: { videoId: string, title: string }) => {
    const [isPlaying, setIsPlaying] = useState(false);

    if (isPlaying) {
        return (
            <div className="aspect-video">
                <iframe
                    className="w-full h-full"
                    src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
                    title={title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                ></iframe>
            </div>
        );
    }

    return (
        <button onClick={() => setIsPlaying(true)} className="relative w-full aspect-video group cursor-pointer focus:outline-none">
            <Image
                src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
                alt={title}
                fill
                className="object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/40 transition-colors group-hover:bg-black/20" />
            <div className="absolute inset-0 flex items-center justify-center">
                <PlayCircle className="w-16 h-16 text-white/80 transition-transform duration-300 group-hover:scale-110" />
            </div>
        </button>
    );
};

export default function IDLFoundationPage() {
    const [selectedImage, setSelectedImage] = useState<typeof galleryImages[0] | null>(null);

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
                            {donationCategories.map((category, index) => {
                                const percentage = category.goal > 0 ? (category.raised / category.goal) * 100 : 0;
                                return(
                                <div key={index} className="block flex-shrink-0 w-[300px] sm:w-[350px] group">
                                    <Card className="h-full rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col bg-card">
                                        <div className="relative aspect-[4/3] w-full">
                                            <Image
                                                src={category.imageUrl}
                                                alt={category.title}
                                                data-ai-hint={category.imageHint}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <CardContent className="p-6 flex-grow flex flex-col">
                                            <h3 className="text-xl text-left font-bold">{category.title}</h3>
                                            <p className="text-sm text-muted-foreground mt-2 text-left flex-grow">{category.description}</p>
                                            
                                            <div className="mt-4 space-y-2">
                                                <div className="flex justify-between items-center text-sm font-semibold">
                                                    <span className="text-muted-foreground">Goal:</span>
                                                    <span className="text-primary">₹{category.goal.toLocaleString('en-IN')}</span>
                                                </div>
                                                 <div className="flex justify-between items-center text-sm font-semibold">
                                                    <span className="text-muted-foreground">Raised:</span>
                                                    <span className="text-green-600">₹{category.raised.toLocaleString('en-IN')}</span>
                                                </div>
                                                <Progress value={percentage} className="mt-2 h-2 [&>div]:bg-green-500" />
                                            </div>

                                            <div className="mt-6 text-left">
                                                <Button asChild variant="outline" className="font-bold rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out bg-amber-500 text-white hover:bg-amber-600 border-0">
                                                    <Link href="#">
                                                        READ MORE
                                                    </Link>
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            )})}
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
                         <div className="flex justify-center mb-4">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="url(#heart-gradient-donors)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-12 h-12">
                            <defs>
                                <linearGradient id="heart-gradient-donors" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" style={{stopColor: 'red', stopOpacity:1}} />
                                <stop offset="100%" style={{stopColor: 'darkred', stopOpacity:1}} />
                                </linearGradient>
                            </defs>
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                            </svg>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-foreground">Our Donors</h2>
                    </div>
                    <div className="space-y-8">
                        <div>
                            <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest text-center mb-4">10+ Companies and Organizations</h3>
                            <div className="w-full overflow-hidden">
                                <div className="flex animate-marquee-scroll-reverse">
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
                            <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest text-center mb-4">100+ People</h3>
                            <div className="w-full overflow-hidden">
                                <div className="flex animate-marquee-scroll">
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

            <Dialog>
                <section className="w-full py-12 md:py-24 bg-white dark:bg-gray-800/20">
                    <div className="container mx-auto px-4 md:px-6">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold text-foreground">Glimpses of Our Work</h2>
                            <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
                                A visual journey through our impactful initiatives and community engagements.
                            </p>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {galleryImages.map((image, index) => (
                                <DialogTrigger asChild key={index}>
                                    <div 
                                        className="relative aspect-square rounded-lg overflow-hidden shadow-lg group cursor-pointer"
                                        onClick={() => setSelectedImage(image)}
                                    >
                                        <Image
                                            src={image.src}
                                            alt={image.alt}
                                            data-ai-hint={image.hint}
                                            fill
                                            className="object-cover transition-transform duration-300 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-2 text-center">
                                            <h3 className="text-white font-bold text-lg">{image.title}</h3>
                                        </div>
                                        <div className="absolute top-2 right-2 p-2 bg-background/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <Plus className="w-4 h-4 text-foreground" />
                                        </div>
                                    </div>
                                </DialogTrigger>
                            ))}
                        </div>
                        <div className="text-center mt-8">
                            <Button asChild variant="outline" className="rounded-full">
                                <Link href="/idl-foundation/gallery">
                                    VIEW ALL
                                </Link>
                            </Button>
                        </div>
                    </div>
                </section>
                {selectedImage && (
                    <DialogContent className="sm:max-w-3xl p-2">
                        <DialogHeader>
                            <DialogTitle className="sr-only">{selectedImage.title}</DialogTitle>
                        </DialogHeader>
                        <div className="relative aspect-video">
                            <Image
                                src={selectedImage.src}
                                alt={selectedImage.alt}
                                fill
                                className="object-contain"
                            />
                        </div>
                        <div className="p-4 bg-muted/50 rounded-b-lg">
                            <h3 className="font-bold text-lg">{selectedImage.title}</h3>
                        </div>
                    </DialogContent>
                )}
            </Dialog>

            <section className="w-full py-12 md:py-24 bg-background">
              <div className="container mx-auto px-4 md:px-6">
                <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-bold text-foreground">Events & Highlights</h2>
                  <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
                    Watch highlights from our recent events and see the impact we're making together.
                  </p>
                </div>
                <div className="relative">
                  <div className="overflow-x-auto pb-8 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    <div className="flex gap-6 px-4 md:px-[10%]">
                      <div className="block flex-shrink-0 w-80 rounded-lg overflow-hidden shadow-lg">
                        <EventVideo videoId="xXpFxS-B5Lg" title="IDL Foundation Event Highlights" />
                      </div>
                      <div className="block flex-shrink-0 w-80 rounded-lg overflow-hidden shadow-lg">
                        <EventVideo videoId="r9s-s4-N9A8" title="Community Skill Training Workshop" />
                      </div>
                      <div className="block flex-shrink-0 w-80 rounded-lg overflow-hidden shadow-lg">
                        <EventVideo videoId="dQw4w9WgXcQ" title="Annual Charity Gala" />
                      </div>
                      <div className="block flex-shrink-0 w-80 rounded-lg overflow-hidden shadow-lg">
                        <EventVideo videoId="xvFZjo5PgG0" title="Tree Plantation Drive" />
                      </div>
                      <div className="block flex-shrink-0 w-80 rounded-lg overflow-hidden shadow-lg">
                        <EventVideo videoId="3JZ_D3p_L4A" title="Women Empowerment Seminar" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

             <section className="w-full py-12 md:py-24 bg-white dark:bg-gray-800/20">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-foreground">About IDL Foundation</h2>
                        <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
                            Our commitment to creating a better society through education and empowerment.
                        </p>
                    </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <Card className="bg-background/50 border-t-4 border-primary rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300">
                            <CardContent className="p-8 text-center">
                                <div className="flex justify-center mb-4">
                                    <div className="bg-primary/10 text-primary p-4 rounded-full">
                                        <Eye className="w-8 h-8" />
                                    </div>
                                </div>
                                <h3 className="text-2xl font-bold text-foreground mb-2">Our Vision</h3>
                                <p className="text-muted-foreground">
                                    To create a world where every individual has the opportunity to achieve their full potential through quality education and skill development, fostering a society of empowered, self-reliant, and responsible citizens.
                                </p>
                            </CardContent>
                        </Card>
                        <Card className="bg-background/50 border-t-4 border-primary rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300">
                             <CardContent className="p-8 text-center">
                                <div className="flex justify-center mb-4">
                                    <div className="bg-primary/10 text-primary p-4 rounded-full">
                                        <Target className="w-8 h-8" />
                                    </div>
                                </div>
                                <h3 className="text-2xl font-bold text-foreground mb-2">Our Mission</h3>
                                <p className="text-muted-foreground">
                                    To provide accessible and innovative educational programs, vocational training, and healthcare support to underprivileged communities, with a special focus on children, women, and the elderly, enabling them to lead a life of dignity and respect.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>
            
            <footer className="bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 mt-12">
                <div className="container mx-auto px-4 md:px-6 py-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div>
                             <Link href="/idl-foundation" className="flex items-center gap-2 mb-4">
                                <Image src="/logo.png" alt="IDL Foundation Logo" width={32} height={32} />
                                <span className="text-lg font-bold text-primary">IDL FOUNDATION</span>
                            </Link>
                            <p className="text-sm text-muted-foreground">A non-profit organization dedicated to empowering communities through education and skill development.</p>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-foreground mb-2">Contact Us</h3>
                            <div className="w-full h-0.5 mb-4 bg-gradient-to-r from-red-500 from-50% to-primary to-50%" style={{width: 'calc(20% + 80px)'}}></div>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li className="flex items-start gap-2">
                                    <MapPin className="w-4 h-4 mt-1 shrink-0"/>
                                    <span>Y-25A Budh Vihar, Delhi-110086</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <Phone className="w-4 h-4"/>
                                    <a href="tel:+917011117585" className="hover:text-primary hover:underline">+91 7011117585</a>
                                </li>
                                <li className="flex items-center gap-2">
                                    <Mail className="w-4 h-4"/>
                                    <a href="mailto:info@idlfoundation.in" className="hover:text-primary hover:underline">info@idlfoundation.in</a>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-foreground mb-2">Follow Us</h3>
                            <div className="w-full h-0.5 mb-4 bg-gradient-to-r from-red-500 from-50% to-primary to-50%" style={{width: 'calc(20% + 80px)'}}></div>
                            <div className="flex items-center gap-3">
                                <Link href="#" className="p-2 bg-gray-200 dark:bg-gray-700 rounded-full text-muted-foreground hover:bg-primary hover:text-white transition-colors" aria-label="Instagram">
                                  <Instagram className="w-5 h-5"/>
                                </Link>
                                <Link href="#" className="p-2 bg-gray-200 dark:bg-gray-700 rounded-full text-muted-foreground hover:bg-primary hover:text-white transition-colors" aria-label="Facebook">
                                  <Facebook className="w-5 h-5"/>
                                </Link>
                                <Link href="#" className="p-2 bg-gray-200 dark:bg-gray-700 rounded-full text-muted-foreground hover:bg-primary hover:text-white transition-colors" aria-label="Twitter">
                                  <Twitter className="w-5 h-5"/>
                                </Link>
                                <Link href="#" className="p-2 bg-gray-200 dark:bg-gray-700 rounded-full text-muted-foreground hover:bg-primary hover:text-white transition-colors" aria-label="LinkedIn">
                                  <Linkedin className="w-5 h-5"/>
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="mt-8 border-t border-gray-700 pt-4 text-center text-xs text-gray-500">
                        <p>&copy; {new Date().getFullYear()} IDL Foundation. All Rights Reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
