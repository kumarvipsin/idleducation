
'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import Image from "next/image";
import Link from "next/link";
import { IndianRupee, Banknote, CheckCircle, Heart } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { createRazorpayOrder } from "@/app/actions";
import Script from "next/script";

interface DonationCategory {
    title: string;
    description: string;
    imageUrl: string;
    imageHint: string;
    goal: number;
    raised: number;
}

const HandHeartIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M12.38,8.23C12.38,8.23,12.38,8.23,12.38,8.23C11.1,7.5,9.54,8.14,9.14,9.53c-0.24,0.82-0.08,1.72,0.42,2.37 c-0.12-0.2-0.25-0.38-0.39-0.57c-0.83-1.15-1.03-2.62-0.54-3.86c0.7-1.78,2.69-2.73,4.46-2.02C13.81,5.77,14,6.3,14,6.3 s0.19-0.53,0.91-0.84c1.78-0.7,3.77,0.25,4.46,2.02c0.49,1.24,0.29,2.71-0.54,3.86c-0.15,0.2-0.28,0.38-0.4,0.58 c0.5-0.65,0.66-1.55,0.42-2.37c-0.4-1.39-1.96-2.03-3.24-1.31C14.19,8.23,12.38,8.23,12.38,8.23z" />
        <path d="M19.8,11.91c-0.06,0-0.12,0-0.18,0.01c-0.49,0.05-0.95,0.22-1.38,0.47c-0.14-0.17-0.29-0.34-0.45-0.5 c-1.02-1.22-2.4-1.9-3.9-1.9c-1.5,0-2.88,0.68-3.9,1.9c-0.16,0.16-0.3,0.33-0.45,0.5C8.94,12.14,8.48,11.96,7.99,11.91 c-0.06,0-0.12,0-0.18,0c-1.3,0-2.48,0.66-3.19,1.69c-0.42,0.62-0.61,1.33-0.61,2.06c0,2.6,2.09,4.7,4.69,4.7h0.01 c0.13,0,0.25-0.02,0.37-0.05c0.55-0.13,1.03-0.45,1.4-0.89l0.01-0.01c0.12-0.15,0.22-0.3,0.3-0.47 c0.33,0.11,0.68,0.17,1.04,0.17s0.71-0.06,1.04-0.17c0.08,0.16,0.19,0.32,0.3,0.47l0.01,0.01c0.37,0.44,0.85,0.76,1.4,0.89 c0.12,0.03,0.24,0.05,0.37,0.05h0.01c2.6,0,4.69-2.1,4.69-4.7c0-0.73-0.2-1.44-0.61-2.06C22.28,12.56,21.1,11.91,19.8,11.91z" />
    </svg>
);

export function DonationCategories({ donationCategories }: { donationCategories: DonationCategory[] }) {
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
            <section className="w-full relative py-8 bg-white dark:bg-gray-800/20">
                <div className="container mx-auto px-4 md:px-[10%] mb-8">
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
                        <h1 className="text-3xl md:text-4xl font-black text-black dark:text-white">Make World Happier</h1>
                        <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
                            Join us in making a difference. Your contribution can change lives.
                        </p>
                        <div className="mt-6">
                            <Dialog onOpenChange={(open) => { if (!open) setDonationStep(1); }}>
                                <DialogTrigger asChild>
                                    <Button className="font-bold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out bg-red-600 text-white hover:bg-red-700 h-12 px-6">
                                        <Heart className="w-6 h-6 mr-2 fill-white" />
                                        <span className="text-lg">DONATE</span>
                                    </Button>
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
                                            <Input id="name" name="name" placeholder="Name (Optional)" value={donorDetails.name} onChange={handleDetailChange} className="h-9 text-sm" />
                                            <Input id="contact" name="contact" placeholder="Contact (Optional)" value={donorDetails.contact} onChange={handleDetailChange} className="h-9 text-sm" />
                                            <Input id="email" name="email" type="email" placeholder="Email (Optional)" value={donorDetails.email} onChange={handleDetailChange} className="h-9 text-sm" />
                                            <Input id="place" name="place" placeholder="Place (Optional)" value={donorDetails.place} onChange={handleDetailChange} className="h-9 text-sm" />
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
                        <div className="flex gap-6 pl-[10%]">
                            {donationCategories.map((category, index) => {
                                const percentage = category.goal > 0 ? (category.raised / category.goal) * 100 : 0;
                                return (
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
                                                        <Progress value={percentage} className="h-2 [&>div]:bg-green-500 mt-2" />
                                                        <p className="text-xs text-right text-muted-foreground">{Math.round(percentage)}%</p>
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
                                )
                            })}
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
