'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import Image from "next/image";
import Link from "next/link";
import { IndianRupee, Banknote, CheckCircle, Heart, ArrowRight } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { createRazorpayOrder, recordDonation } from "@/app/actions";
import Script from "next/script";

interface DonationCategory {
    title: string;
    description: string;
    imageUrl: string;
    imageHint: string;
    goal: number;
    raised: number;
}

interface DonationCategoriesProps {
  donationCategories: DonationCategory[];
  openDonateDialog: () => void;
  isDonateDialogOpen: boolean;
  onDonateDialogChange: (open: boolean) => void;
}

export function DonationCategories({ donationCategories, openDonateDialog, isDonateDialogOpen, onDonateDialogChange }: DonationCategoriesProps) {
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
            handler: async function (response: any) {
                const donationData = {
                    ...donorDetails,
                    amount: amount,
                    category: donationCategory,
                    paymentId: response.razorpay_payment_id,
                };
                await recordDonation(donationData);
                toast({ title: 'Payment Successful', description: `Thank you for your donation of ₹${amount}!` });
                setDonationStep(1);
                setDonationCategory('');
                setDonationAmount('');
                setDonorDetails({ name: '', contact: '', email: '', place: '' });
                onDonateDialogChange(false);
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
            <section id="donate" className="w-full relative py-8 bg-white dark:bg-gray-800/20">
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
                            <Dialog open={isDonateDialogOpen} onOpenChange={(open) => { onDonateDialogChange(open); if (!open) setDonationStep(1); }}>
                                <DialogTrigger asChild>
                                    <Button onClick={openDonateDialog} className="font-bold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out bg-red-600 text-white hover:bg-red-700 h-12 px-6">
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
                        <div className="flex gap-6 px-4 md:px-[10%]">
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
                                                <h3 className="text-xl text-left font-black">{category.title}</h3>
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
                                                   <Button asChild variant="outline" size="sm" className="font-semibold rounded-full shadow-md hover:shadow-lg transition-all duration-300 ease-in-out text-primary text-xs h-8 px-2">
                                                        <Link href="#">
                                                            READ MORE<ArrowRight className="ml-1 h-3 w-3" />
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