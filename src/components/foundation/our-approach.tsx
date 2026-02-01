'use client';

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Target } from "lucide-react";

export function OurApproach() {
    return (
        <section id="approach" className="w-full py-16 md:py-24 bg-white dark:bg-background scroll-mt-20">
            <div className="container mx-auto px-4 md:px-6">
                <div className="rounded-2xl bg-white dark:bg-card p-6 md:p-8 border">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="relative h-96 rounded-lg overflow-hidden shadow-lg">
                            <Image
                                src="https://images.unsplash.com/photo-1593113598332-cd288d649433?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                                alt="People working together on a project"
                                data-ai-hint="teamwork collaboration"
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div className="space-y-6 flex flex-col items-center lg:items-start text-center lg:text-left">
                            <p className="text-sm font-semibold tracking-wider text-muted-foreground uppercase">OUR APPROACH</p>
                            <h2 className="text-4xl md:text-5xl font-black text-foreground leading-tight">
                                Strategic & Sustainable
                                <br/>
                                <span className="bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent">
                                    Impact
                                </span>
                            </h2>
                            <p className="text-muted-foreground leading-relaxed max-w-prose">
                                Our approach is rooted in creating sustainable and scalable solutions. We work closely with local communities to understand their unique challenges and co-create programs that address their needs effectively. By focusing on long-term impact, we ensure that our interventions lead to lasting positive change.
                            </p>
                            <div className="flex items-center gap-8 pt-4">
                                <Target className="w-16 h-16 text-teal-500" />
                                 <Button asChild variant="link" className="px-0 text-primary font-bold text-lg">
                                    <Link href="#">
                                        Our Programs <ArrowRight className="ml-2 h-4 w-4" />
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
