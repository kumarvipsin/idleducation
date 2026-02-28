'use client';

import React from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function AllAboutCuetPage() {
  return (
    <div className="min-h-screen w-full bg-white dark:bg-slate-950 selection:bg-primary/10">
      
      {/* 1. Hero Section */}
      <section className="relative w-full py-16 md:py-24 bg-white overflow-hidden">
        <div className="container mx-auto px-4 md:px-6 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
                <div className="space-y-8 animate-fade-in-up text-left">
                    <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-slate-900 leading-[0.9] uppercase">
                        ALL ABOUT <br/>
                        <span className="text-red-600">CUET (UG)</span>
                    </h1>
                    <p className="text-slate-600 font-bold text-sm md:text-lg leading-relaxed max-w-lg">
                        Master every detail of the nation's biggest entrance exam. From registration to top college shortlisting, your journey starts here.
                    </p>
                    <Button asChild size="lg" className="rounded-xl bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-widest text-[10px] h-12 px-8 shadow-xl shadow-red-600/20">
                        <Link href="/student-enquiry">Book Free Counselling</Link>
                    </Button>
                </div>
                <div className="relative aspect-video lg:aspect-square flex items-center justify-center animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                    <div className="relative w-[300px] h-[300px] md:w-[450px] md:h-[450px] rounded-full overflow-hidden bg-white border-[12px] border-slate-50">
                        <Image src="/cuet.png" alt="CUET" fill className="object-contain p-10" />
                    </div>
                </div>
            </div>
        </div>
      </section>
    </div>
  );
}
