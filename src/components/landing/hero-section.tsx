
'use client';

import { Button } from "@/components/ui/button";
import { CheckCircle, Smartphone } from "lucide-react";
import Link from 'next/link';
import { Separator } from "../ui/separator";

export function HeroSection() {
  
  return (
    <section className="relative w-full bg-cover bg-center bg-no-repeat pb-10" style={{backgroundImage: "url('https://picsum.photos/seed/student-bg/1920/1080')"}} data-ai-hint="student smiling">
    <div className="absolute inset-0 bg-primary/80 bg-gradient-to-br from-[#070A52]/90 via-[#070A52]/80 to-accent/90 z-0"></div>
    <div className="container mx-auto px-4 md:px-6 relative z-10 py-16 md:py-24">
        <div className="grid lg:grid-cols-1 gap-8 items-center text-center">
            <div className="space-y-4 text-white">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter">
                   Your Future, <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-amber-500">Brightened.</span>
                </h1>
                <p className="max-w-2xl mx-auto text-lg md:text-xl text-white/90">
                    Join thousands of students achieving their dreams with our expert-led courses and personalized learning paths.
                </p>
                <div className="flex justify-center items-center">
                    <div className="flex items-center rounded-full border-2 border-white overflow-hidden">
                        <Button asChild className="rounded-none border-0 transition-all duration-300 ease-in-out bg-transparent text-white hover:bg-white hover:text-primary h-9 px-4">
                            <Link href="/admission">Admission</Link>
                        </Button>
                        <Separator orientation="vertical" className="h-5 bg-white/50" />
                        <Button asChild className="rounded-none border-0 transition-all duration-300 ease-in-out bg-transparent text-white hover:bg-white hover:text-primary h-9 px-4">
                           <Link href="/book-demo">Book Free Demo</Link>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    </section>
  );
}
