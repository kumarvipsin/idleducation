
'use client';

import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { PenSquare } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function DirectorMessage() {
  return (
    <section className="w-full bg-white dark:bg-background py-12 md:py-20">
        <div className="container mx-auto px-4 md:px-6">
            <div className="bg-gray-100 dark:bg-gray-800/20 rounded-2xl shadow-2xl overflow-hidden">
                <div className="relative w-full aspect-[4/3] md:aspect-[16/7]">
                    <Image
                        src="/team.png"
                        alt="IDL Education Team"
                        data-ai-hint="team meeting"
                        fill
                        className="object-contain object-center"
                    />
                </div>
            </div>
            <div className="relative text-center px-4 -mt-24 z-10">
                <Card className="max-w-4xl mx-auto p-4 rounded-2xl shadow-xl bg-gradient-to-b from-background via-background/90 to-background/70 backdrop-blur-sm border-0">
                  <Accordion type="single" collapsible>
                    <AccordionItem value="item-1" className="border-b-0">
                      <AccordionTrigger>
                        <h3 className="text-2xl md:text-3xl font-bold text-primary flex items-center justify-center gap-2">
                            <PenSquare className="w-7 h-7" /> Director's Message
                        </h3>
                      </AccordionTrigger>
                      <AccordionContent>
                        <blockquote className="font-josefin-sans text-base md:text-lg text-foreground/80 leading-relaxed pt-4">
                            "At IDL EDUCATION, we are driven by a single, powerful idea: education should be limitless. We've built this platform to break down barriers and create a space where curiosity thrives, knowledge is shared, and potential is realized. Our commitment is to provide the highest quality education and empower every student to achieve their dreams. We believe in fostering a learning environment that is not only rigorous but also inspiring and supportive. Join us on this journey to redefine education and shape the leaders of tomorrow."
                        </blockquote>
                        <div className="mt-6">
                            <p className="font-josefin-sans font-bold text-lg text-primary">AMOD KUMAR SHARMA</p>
                            <p className="text-sm text-muted-foreground font-josefin-sans">Founder & Managing Director</p>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </Card>
            </div>
        </div>
    </section>
  );
}
