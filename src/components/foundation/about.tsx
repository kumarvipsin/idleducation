'use client';

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function About() {
    return (
        <section id="about" className="w-full pb-16 md:pb-24 bg-white dark:bg-background scroll-mt-20">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6 flex flex-col items-center lg:items-start text-center lg:text-left">
                        <p className="text-sm font-semibold tracking-wider text-muted-foreground uppercase">ABOUT US</p>
                        <h2 className="text-4xl md:text-5xl font-black text-foreground leading-tight">
                            Empowering Communities,
                            <br/>
                            <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                                Transforming Lives
                            </span>
                        </h2>
                        <p className="text-muted-foreground leading-relaxed max-w-prose">
                            IDL Foundation is a non-profit organization dedicated to creating lasting change through education, healthcare, and skill development. We believe in empowering individuals to build a better future for themselves and their communities.
                        </p>
                        <Button asChild variant="link" className="px-0 text-primary font-bold text-lg">
                            <Link href="#">
                                Discover More <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </div>
                    <div className="relative h-96 rounded-lg overflow-hidden shadow-lg">
                        <Image
                            src="https://images.unsplash.com/photo-1652858672796-960164bd632b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwyfHxuZ298ZW58MHx8fHwxNzY5ODY5NTMzfDA&ixlib=rb-4.1.0&q=80&w=1080"
                            alt="Children in a classroom at an NGO"
                            data-ai-hint="ngo children"
                            fill
                            className="object-cover"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
