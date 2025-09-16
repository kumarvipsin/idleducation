
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import Image from "next/image";
import Link from "next/link";
import { Award, Calendar, IndianRupee } from 'lucide-react';

export default function ScholarshipPage() {
    return (
        <div className="relative min-h-screen w-full flex flex-col items-center justify-center p-4 bg-gray-100 dark:bg-gray-900">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="https://picsum.photos/seed/trophy-student/1920/1080"
                    alt="Student with a trophy"
                    data-ai-hint="student trophy"
                    fill
                    className="object-cover opacity-30"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/50" />
            </div>

            {/* Content */}
            <div className="relative z-10 container mx-auto flex flex-col items-center justify-center text-center">
                
                {/* Header Information */}
                <div className="space-y-6 mb-8 animate-fade-in-up text-center">
                    <Image
                        src="/logo.png"
                        alt="IDL Education Logo"
                        width={100}
                        height={100}
                        className="mx-auto filter hue-rotate-15 saturate-150"
                    />
                    <h1 className="text-4xl md:text-5xl font-extrabold text-primary tracking-tight">
                        IDL National Scholarship & Admission Test
                    </h1>
                    <p className="mt-2 text-lg text-muted-foreground font-semibold">
                        For Class V to X
                    </p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
                        <Card className="bg-background/50 backdrop-blur-sm">
                            <CardContent className="p-4">
                                <Award className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                                <span className="text-sm font-semibold text-muted-foreground">Cash Prize</span>
                                <p className="text-2xl font-bold text-primary">₹ 2.5 Cr.</p>
                             </CardContent>
                        </Card>
                        <Card className="bg-background/50 backdrop-blur-sm">
                             <CardContent className="p-4">
                                <IndianRupee className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                                <span className="text-sm font-semibold text-muted-foreground">Scholarships</span>
                                <p className="text-2xl font-bold text-primary">₹ 250 Cr.</p>
                            </CardContent>
                        </Card>
                         <Card className="bg-background/50 backdrop-blur-sm">
                            <CardContent className="p-4">
                                <Calendar className="w-8 h-8 text-green-500 mx-auto mb-2" />
                                <span className="text-sm font-semibold text-muted-foreground">Exam Dates</span>
                                <p className="text-lg font-bold text-primary">5th & 12th<br/>October 2025</p>
                             </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Registration Form */}
                <div className="w-full max-w-md mx-auto animate-fade-in-up" style={{animationDelay: '0.2s'}}>
                    <Card className="shadow-2xl rounded-2xl border-2 border-primary/10 bg-background/80 backdrop-blur-sm">
                        <CardContent className="p-8 space-y-6">
                            <div className="text-center">
                                <h2 className="text-2xl font-bold text-primary">Register Here</h2>
                            </div>

                            <form className="space-y-6">
                                <div>
                                    <Label className="text-sm font-semibold text-muted-foreground">What is your preferred mode of study?</Label>
                                    <RadioGroup className="mt-2 grid grid-cols-2 gap-4">
                                        <div>
                                            <RadioGroupItem value="online" id="online" className="peer sr-only" />
                                            <Label htmlFor="online" className="flex items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer">
                                                Online
                                            </Label>
                                        </div>
                                         <div>
                                            <RadioGroupItem value="offline" id="offline" className="peer sr-only" />
                                            <Label htmlFor="offline" className="flex items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer">
                                                Offline
                                            </Label>
                                        </div>
                                    </RadioGroup>
                                </div>

                                <div>
                                    <Label htmlFor="phone" className="text-sm font-semibold text-muted-foreground">Phone number</Label>
                                    <div className="flex items-center mt-1">
                                        <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm h-10">
                                            +91
                                        </span>
                                        <Input type="tel" id="phone" placeholder="Enter Your Mobile Number" className="rounded-l-none h-10" />
                                    </div>
                                </div>
                                
                                <div className="space-y-4">
                                    <div className="flex items-start space-x-2">
                                        <Checkbox id="terms" className="mt-1" />
                                        <Label htmlFor="terms" className="text-xs text-muted-foreground">
                                            I agree to the <Link href="#" className="underline text-primary">Terms & conditions</Link>.
                                        </Label>
                                    </div>
                                    <div className="flex items-start space-x-2">
                                        <Checkbox id="authorize" className="mt-1" />
                                        <Label htmlFor="authorize" className="text-xs text-muted-foreground">
                                            I authorize IDL EDUCATION to send me regular updates via Phone Calls, WhatsApp, SMS, Robocalls (Automated Calls), Email, or on Postal addresses.
                                        </Label>
                                    </div>
                                </div>

                                <Button type="submit" className="w-full text-lg h-12 rounded-full font-bold">
                                    Submit
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
