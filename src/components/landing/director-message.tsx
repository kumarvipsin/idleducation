'use client';

import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { PenSquare } from "lucide-react";
import placeholderImages from '@/app/lib/placeholder-images.json';

export function DirectorMessage() {
  return (
    <section className="w-full bg-gray-50 dark:bg-gray-900/50 py-12 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-4xl mx-auto">
                <Card className="overflow-hidden rounded-2xl shadow-xl border-2 border-primary/10 bg-background/80 backdrop-blur-sm">
                    <div className="grid md:grid-cols-5 items-center">
                        <div className="md:col-span-2 p-6 flex flex-col items-center justify-center">
                             <div className="relative w-32 h-32 md:w-40 md:h-40 border-4 border-primary/20 shadow-lg rounded-full overflow-hidden">
                                <Image src={placeholderImages.director.src} alt={placeholderImages.director.alt} data-ai-hint={placeholderImages.director.hint} fill className="object-cover" />
                            </div>
                            <div className="text-center mt-4">
                                <p className="font-bold text-lg text-primary">AMOD KUMAR SHARMA</p>
                                <p className="text-sm text-muted-foreground">Founder & Managing Director</p>
                            </div>
                        </div>
                        <div className="md:col-span-3 p-6 md:p-8 bg-muted/30 md:bg-transparent">
                            <h3 className="text-2xl font-bold text-primary mb-4 flex items-center gap-2">
                                <PenSquare className="w-7 h-7" /> Director's Message
                            </h3>
                            <blockquote className="border-l-4 border-primary pl-6 italic text-base md:text-lg text-foreground/80 leading-relaxed">
                                "At IDL EDUCATION, we are driven by a single, powerful idea: education should be limitless. We've built this platform to break down barriers and create a space where curiosity thrives, knowledge is shared, and potential is realized. Our commitment is to provide the highest quality education and empower every student to achieve their dreams."
                            </blockquote>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    </section>
  );
}
