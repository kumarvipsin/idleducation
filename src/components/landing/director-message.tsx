
'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

export function DirectorMessage() {
  return (
    <section className="w-full">
      <Card className="shadow-lg overflow-hidden border-0 rounded-none bg-white">
          <div className="relative w-full h-[70vh] bg-black">
             <Image 
                src="/team.png"
                alt="IDL Education Team" 
                data-ai-hint="team meeting" 
                fill
                className="object-contain"
             />
          </div>
          <CardContent className="p-8 text-center relative bg-white">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-12 bg-no-repeat bg-center bg-contain" style={{backgroundImage: `url("data:image/svg+xml,%3Csvg width='200' height='50' viewBox='0 0 200 50' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 50 L100 0 L200 50' fill='white'/%3E%3C/svg%3E")`}}></div>
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
