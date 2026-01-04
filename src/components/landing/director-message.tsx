'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

export function DirectorMessage() {
  return (
    <section className="w-full py-12 md:py-24 bg-white dark:bg-background">
      <Card className="shadow-lg overflow-hidden border-0 rounded-none">
          <div className="relative w-full h-96">
             <Image 
                src="/team.png"
                alt="IDL Education Team" 
                data-ai-hint="team meeting" 
                fill
                className="object-contain"
             />
             <div className="absolute inset-0 bg-black/30 -z-10"></div>
          </div>
          <CardContent className="p-8 text-center relative bg-background">
              <blockquote className="border-l-4 border-primary pl-4 italic text-lg text-foreground/80 max-w-3xl mx-auto pt-8">
                "At IDL EDUCATION, we are driven by a single, powerful idea: education should be limitless. We've built this platform to break down barriers and create a space where curiosity thrives, knowledge is shared, and potential is realized. Our commitment is to provide the highest quality education and empower every student to achieve their dreams."
              </blockquote>
              <div className="mt-6">
                <p className="font-bold text-lg text-primary">Amod Kumar Sharma</p>
                <p className="text-sm text-muted-foreground">Founder & Managing Director</p>
              </div>
          </CardContent>
        </Card>
    </section>
  );
}
