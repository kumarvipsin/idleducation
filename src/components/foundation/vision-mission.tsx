'use client';

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const SunIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d="M12.5 11.5C11 11.5 10 13 10 14.5C10 16 11.5 17.5 13 17.5C14.5 17.5 16 16 16 14.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 9.5C12 9.5 14 8 15.5 8C16.9 8 18 9.1 18 10.5C18 11.9 16.9 13 15.5 13C14.1 13 12.5 11.5 12.5 11.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 3V4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M21 12H20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M12 21V20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M4 12H3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M18.364 5.63604L17.6569 6.34315" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M6.34326 17.6569L5.63616 18.364" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M18.364 18.364L17.6569 17.6569" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M6.34326 6.34315L5.63616 5.63604" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
);


export function VisionMission() {
    return (
        <section id="vision-mission" className="w-full py-16 md:py-24 bg-white dark:bg-background scroll-mt-20">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <div className="relative h-96 rounded-lg overflow-hidden shadow-lg">
                        <Image
                            src="https://s3.ap-south-1.amazonaws.com/s3.idleducation.com/idl-foundation/food-donation.jpg"
                            alt="Volunteers packing food supplies"
                            data-ai-hint="food donation"
                            fill
                            className="object-cover"
                        />
                    </div>
                    <div className="space-y-6 flex flex-col items-center lg:items-start text-center lg:text-left">
                        <p className="text-sm font-semibold tracking-wider text-muted-foreground uppercase">VISION & MISSION</p>
                        <h2 className="text-4xl md:text-5xl font-black text-foreground leading-tight">
                            Helping 
                            <br/>
                            One Lakh People at
                            <br/>
                            <span className="relative inline-block pb-3">
                                the earliest
                                <svg className="absolute bottom-0 left-0 w-full h-3 text-yellow-400" viewBox="0 0 120 12" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" style={{ strokeWidth: 5 }}>
                                    <path d="M0,6 C40,0 80,0 120,6" stroke="currentColor" fill="none"/>
                                </svg>
                            </span>
                        </h2>
                        
                        <div className="flex items-center gap-8 pt-4">
                             <SunIcon className="w-16 h-16 text-yellow-500 animate-spin-slow" />
                             <Button asChild variant="link" className="px-0 text-primary font-bold text-lg">
                                <Link href="#">
                                    Discover More <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
