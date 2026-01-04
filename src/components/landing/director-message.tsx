'use client';

import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

export function DirectorMessage() {
  return (
    <section className="w-full bg-white dark:bg-background py-12 md:py-20">
        <div className="container mx-auto px-4 md:px-6">
            <div className="bg-black rounded-2xl shadow-2xl overflow-hidden">
                <div className="relative w-full aspect-[16/9] md:aspect-[16/7]">
                    <Image
                        src="/team.png"
                        alt="IDL Education Team"
                        data-ai-hint="team meeting"
                        fill
                        className="object-contain"
                    />
                </div>
            </div>
            <div className="relative text-center px-4 -mt-16 z-10">
                <Card className="max-w-4xl mx-auto p-6 md:p-8 rounded-2xl shadow-xl bg-background">
                    <blockquote className="italic text-base md:text-lg text-foreground/80">
                        "At IDL EDUCATION, we are driven by a single, powerful idea: education should be limitless. We've built this platform to break down barriers and create a space where curiosity thrives, knowledge is shared, and potential is realized. Our commitment is to provide the highest quality education and empower every student to achieve their dreams."
                    </blockquote>
                    <div className="mt-6">
                        <p className="font-bold text-lg text-primary">Amod Kumar Sharma</p>
                        <p className="text-sm text-muted-foreground">Founder & Managing Director</p>
                    </div>
                </Card>
            </div>
        </div>
    </section>
  );
}
