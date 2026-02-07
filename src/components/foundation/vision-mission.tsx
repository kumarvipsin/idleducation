
'use client';

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function VisionMission() {
    return (
        <section id="vision-mission" className="w-full py-16 md:py-24 bg-white dark:bg-background scroll-mt-20">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <div className="relative h-96 rounded-3xl overflow-hidden shadow-lg border-4 border-primary/5">
                        <Image
                            src="https://images.unsplash.com/photo-1644726270363-e746b37b482b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw3fHxuZ298ZW58MHx8fHwxNzY5ODY5NTMzfDA&ixlib=rb-4.1.0&q=80&w=1080"
                            alt="Volunteers packing food supplies"
                            data-ai-hint="food donation"
                            fill
                            className="object-cover"
                        />
                    </div>
                    <div className="space-y-6 flex flex-col items-center lg:items-start text-center lg:text-left">
                        <p className="text-xs font-bold tracking-[0.2em] text-muted-foreground uppercase">VISION & MISSION</p>
                        <h2 className="text-4xl md:text-5xl font-extrabold text-foreground leading-tight tracking-tight">
                            Our Vision for a
                            <br/>
                            <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                                Brighter Future
                            </span>
                        </h2>
                        <p className="text-muted-foreground leading-relaxed max-w-prose font-bold text-sm">
                            We envision a world where every individual has access to the resources and opportunities they need to thrive. Our mission is to empower communities through education, healthcare, and sustainable development, creating a ripple effect of positive change for generations to come.
                        </p>
                        <div className="flex items-center gap-8 pt-4">
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
