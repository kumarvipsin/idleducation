'use client';

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function About() {
    return (
        <section id="about" className="w-full py-16 md:py-24 bg-white dark:bg-background scroll-mt-20">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                        <p className="text-sm font-semibold tracking-wider text-muted-foreground uppercase">ABOUT</p>
                        <h2 className="text-4xl md:text-5xl font-bold text-foreground leading-tight">
                            A charitable trust 
                            <br/>
                            with motto 
                            <br/>
                            <span className="relative inline-block">
                                'Service to Humanity'
                                <span className="absolute -bottom-2 left-0 w-3/4 h-1.5 bg-yellow-400 z-0"></span>
                            </span>
                        </h2>
                        <p className="text-muted-foreground leading-relaxed">
                            IDL Foundation, inaugurated in 2003 by Indian Cricket Legends, Saurav Ganguly, Sachin Tendulkar along with their teammates, is a non-profit, registered charitable trust working for the holistic development of specially abled people.
                        </p>
                        <Button asChild variant="link" className="px-0 text-primary font-bold text-lg">
                            <Link href="#">
                                Discover More <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </div>
                    <div className="relative h-96 rounded-lg overflow-hidden shadow-lg">
                        <Image
                            src="https://images.unsplash.com/photo-1594283182613-2503a03c239b?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                            alt="A visually impaired child reading braille in a classroom"
                            data-ai-hint="visually impaired child classroom"
                            fill
                            className="object-cover"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
