
'use client';

import { Button } from "@/components/ui/button";
import { HandHeart, Target, Eye, Briefcase, UserRound, Trees, Save, ArrowRight, Heart, BookOpen, Home, Users, HelpingHand, UserCircle, Handshake, Plus, PlayCircle, Mail, Phone, MapPin, Instagram, Facebook, Twitter, Linkedin, Video, ImageIcon, CheckCircle, IndianRupee, Banknote } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Header } from "@/components/header";
import { FoundationHero } from "@/components/landing/foundation-hero";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { createRazorpayOrder } from "@/app/actions";
import Script from "next/script";

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
    { name: "DDU-GKY", logo: "https://picsum.photos/seed/company1/200/100" },
    { name: "Maulana Azad Education Foundation", logo: "https://picsum.photos/seed/company2/200/100" },
    { name: "Ministry of Textiles", logo: "https://picsum.photos/seed/company3/200/100" },
    { name: "Delhi Government", logo: "https://picsum.photos/seed/company4/200/100" },
];

const people = [
    { name: "Bhagwati Exports", logo: "https://picsum.photos/seed/person1/200/100" },
    { name: "Another Donor", logo: "https://picsum.photos/seed/donor2/200/100" },
    { name: "New Foundation", logo: "https://picsum.photos/seed/foundation/200/100" },
    { name: "Charity Plus", logo: "https://picsum.photos/seed/charity/200/100" },
];

const team = [
    { name: "Amod Kumar Sharma", role: "Founder & Managing Director", image: "https://picsum.photos/seed/team1/400/400", description: "Visionary leader with a passion for education and social change." },
    { name: "Manish Sharma", role: "Co-Founder & CEO", image: "https://picsum.photos/seed/team2/400/400", description: "Driving the mission forward with innovation and dedication." },
    { name: "Vidhi Sharma", role: "Chief Operating Officer", image: "https://picsum.photos/seed/team3/400/400", description: "Ensuring operational excellence and impactful program delivery." },
    { name: "Vijay Verma", role: "Head of Skill Development", image: "https://picsum.photos/seed/team4/400/400", description: "Empowering individuals with skills for a brighter future." },
];

const stats = [
    { count: 143703, label: 'Visitors' },
    { count: 255, label: 'Donors', plus: true },
    { count: 28, label: 'Members' },
    { count: 37, label: 'Volunteers' }
]

const EventVideo = ({ videoId, title }: { videoId: string, title: string }) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
                <button className="relative w-full aspect-video group cursor-pointer focus:outline-none">
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
            </DialogTrigger>
            <DialogContent className="max-w-3xl p-0">
                <DialogHeader className="p-4">
                    <DialogTitle>{title}</DialogTitle>
                </DialogHeader>
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
            </DialogContent>
        </Dialog>
    );
};

export default function IDLFoundationPage() {
    const [selectedImage, setSelectedImage] = useState<typeof galleryImages[0] | null>(null);
    const [donationCategory, setDonationCategory] = useState<string>("");
    const [donationStep, setDonationStep] = useState(1);
    const [donorDetails, setDonorDetails] = useState({ name: '', contact: '', email: '', place: '' });
    const [donationAmount, setDonationAmount] = useState('');
    const { toast } = useToast();

    const handleDonateClick = () => {
        setDonationStep(2);
    }
    
    const handleDetailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDonorDetails({ ...donorDetails, [e.target.name]: e.target.value });
    }

    const handlePayment = async () => {
        const amount = parseInt(donationAmount);
        if (isNaN(amount) || amount <= 0) {
            toast({ variant: 'destructive', title: 'Invalid Amount', description: 'Please enter a valid donation amount.' });
            return;
        }

        const result = await createRazorpayOrder({ amount: amount * 100, currency: 'INR' });
        if (!result.success || !result.order) {
            toast({ variant: 'destructive', title: 'Payment Error', description: 'Could not create payment order.' });
            return;
        }
        const order = result.order;
        const options = {
            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
            amount: order.amount,
            currency: order.currency,
            name: 'IDL Foundation Donation',
            description: `Donation for ${donationCategory}`,
            order_id: order.id,
            handler: function (response: any) {
                toast({ title: 'Payment Successful', description: `Thank you for your donation of ₹${amount}!` });
                // Here you would typically save the donation details to your backend
                setDonationStep(1);
                setDonationCategory('');
                setDonationAmount('');
                setDonorDetails({ name: '', contact: '', email: '', place: '' });
            },
            prefill: {
                name: donorDetails.name,
                email: donorDetails.email,
                contact: donorDetails.contact,
            },
            notes: {
                category: donationCategory,
                place: donorDetails.place,
            },
            theme: {
                color: '#0d47a1',
            },
        };
        // @ts-ignore
        const rzp = new window.Razorpay(options);
        rzp.open();
    }


    return (
        <>
            <Script
                id="razorpay-checkout-js"
                src="https://checkout.razorpay.com/v1/checkout.js"
            />
            <div className="relative w-full bg-background overflow-y-auto">
                <Header />

                <FoundationHero slides={donationCategories} />
                
                <section className="w-full relative py-8 bg-white dark:bg-gray-800/20">
                    <div className="container mx-auto px-4 md:px-[10%] mb-8">
                        <div className="text-center">
                           <h1 className="text-3xl md:text-4xl font-black text-black dark:text-white">Make World Happier</h1>
                            <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
                                Join us in making a difference. Your contribution can change lives.
                            </p>
                            <div className="mt-6">
                                <Dialog onOpenChange={(open) => { if (!open) setDonationStep(1); }}>
                                    <DialogTrigger asChild>
                                        <Button className="font-bold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700">Donate</Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-md">
                                        <DialogHeader>
                                            <DialogTitle className="text-2xl font-bold text-center text-primary">Thank You for Your Support!</DialogTitle>
                                            <DialogDescription className="text-center">
                                                Your generosity helps us create a better world. Please choose where you'd like to make an impact.
                                            </DialogDescription>
                                        </DialogHeader>
                                        {donationStep === 1 ? (
                                            <div className="py-4 space-y-4">
                                                <RadioGroup onValueChange={setDonationCategory} value={donationCategory}>
                                                    {donationCategories.map(category => (
                                                        <div key={category.title} className="flex items-center space-x-2">
                                                            <RadioGroupItem value={category.title} id={category.title} />
                                                            <Label htmlFor={category.title}>{category.title}</Label>
                                                        </div>
                                                    ))}
                                                </RadioGroup>
                                                <Button onClick={handleDonateClick} disabled={!donationCategory} className="w-full">
                                                    Donate to {donationCategory || "..."}
                                                </Button>
                                            </div>
                                        ) : (
                                            <div className="pt-4 space-y-3">
                                                <p className="text-center font-semibold text-sm">You are donating to "{donationCategory}".</p>
                                                <div className="relative">
                                                    <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                    <Input id="amount" name="amount" type="number" placeholder="Enter Amount" value={donationAmount} onChange={(e) => setDonationAmount(e.target.value)} className="pl-9 h-9 text-sm" />
                                                </div>
                                                <Input id="name" name="name" placeholder="Name" value={donorDetails.name} onChange={handleDetailChange} className="h-9 text-sm" />
                                                <Input id="contact" name="contact" placeholder="Contact" value={donorDetails.contact} onChange={handleDetailChange} className="h-9 text-sm" />
                                                <Input id="email" name="email" type="email" placeholder="Email" value={donorDetails.email} onChange={handleDetailChange} className="h-9 text-sm" />
                                                <Input id="place" name="place" placeholder="Place" value={donorDetails.place} onChange={handleDetailChange} className="h-9 text-sm" />
                                                <Button onClick={handlePayment} className="w-full bg-green-600 hover:bg-green-700 h-9 text-sm">
                                                    <Banknote className="mr-2 h-4 w-4" />
                                                    Proceed to Final Payment
                                                </Button>
                                                <Button variant="link" onClick={() => setDonationStep(1)} className="text-xs w-full h-auto py-1">
                                                    Change Category
                                                </Button>
                                            </div>
                                        )}
                                    </DialogContent>
                                </Dialog>
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
                                                    <div className="space-y-1">
                                                        <Progress value={percentage} className="h-2 [&>div]:bg-green-500" />
                                                         <p className="text-xs text-muted-foreground text-right">{Math.round(percentage)}%</p>
                                                    </div>
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

                 <section className="w-full py-8 md:py-12 bg-background text-foreground">
                    <div className="container mx-auto px-4 md:px-6">
                         <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {stats.map((stat, index) => (
                                <Card key={index} className="text-center p-4 bg-transparent border-0 shadow-none">
                                    <p className="text-3xl md:text-4xl font-bold text-primary">
                                        {stat.count.toLocaleString()}{stat.plus && '+'}
                                    </p>
                                    <p className="text-sm md:text-base font-medium text-muted-foreground">{stat.label}</p>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>
                
                <section className="w-full py-8 bg-background">
                    <div className="container mx-auto px-4 md:px-6">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl md:text-4xl font-black text-black dark:text-white">Our Donors</h2>
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
                            <div className="mt-8">
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
                    <section className="w-full py-8 bg-white dark:bg-gray-800/20">
                        <div className="container mx-auto px-4 md:px-6">
                            <div className="text-center mb-8">
                                <h2 className="text-3xl md:text-4xl font-black text-black dark:text-white">Glimpses of Our Work</h2>
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

                <section className="w-full py-8 bg-background">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="text-center mb-8">
                      <h2 className="text-3xl md:text-4xl font-black text-black dark:text-white">Events & Highlights</h2>
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

                 <section className="w-full py-8 bg-white dark:bg-gray-800/20">
                    <div className="container mx-auto px-4 md:px-6">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl md:text-4xl font-black text-black dark:text-white">About IDL Foundation</h2>
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
                
                 <section className="w-full py-8 bg-background">
                    <div className="container mx-auto px-4 md:px-6">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl md:text-4xl font-black text-black dark:text-white">Meet Our Team</h2>
                            <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
                                The dedicated individuals leading our mission forward.
                            </p>
                        </div>
                        <div className="relative">
                            <div className="overflow-x-auto pb-8 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                                <div className="flex gap-6 px-4 md:px-[10%]">
                                    {team.map((member, index) => (
                                        <div key={index} className="block flex-shrink-0 w-64 group">
                                            <Card className="text-center overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group bg-card rounded-lg">
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
                    </div>
                </section>


                <footer className="bg-background text-gray-800 dark:text-gray-300">
                    <Separator className="w-full h-0.5 bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
                    <div className="container mx-auto px-4 md:px-6 py-6">
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
                                <div className="w-full h-0.5 mb-4 bg-gradient-to-r from-red-500 to-50% to-primary" style={{width: 'calc(20% + 80px)'}}></div>
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
                                <div className="w-full h-0.5 mb-4 bg-gradient-to-r from-red-500 to-50% to-primary" style={{width: 'calc(20% + 80px)'}}></div>
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
                        <div className="mt-6 border-t border-gray-700 py-2 text-center text-xs text-gray-500">
                            <p>&copy; {new Date().getFullYear()} IDL Foundation. All Rights Reserved.</p>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}

    