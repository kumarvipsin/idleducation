
'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

export function DirectorMessage() {
  return (
    <section className="w-full py-12 md:py-24 bg-muted/20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-primary">Director's Message</h2>
        </div>
        <Card className="max-w-4xl mx-auto shadow-lg overflow-hidden">
          <div className="relative w-full aspect-[16/7]">
             <Image 
                src="https://images.unsplash.com/photo-1758270703178-bc9eed1525f7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxN3x8Z3JvdXAlMjBwaG90byUyMHN0dWRlbnR8ZW58MHx8fHwxNzY3NTQwOTMzfDA&ixlib=rb-4.1.0&q=80&w=1080" 
                alt="IDL Education Team" 
                data-ai-hint="team meeting" 
                layout="fill" 
                objectFit="cover" 
             />
          </div>
          <CardContent className="p-8 text-center">
              <blockquote className="border-l-4 border-primary pl-4 italic text-lg text-foreground/80 max-w-3xl mx-auto">
                "At IDL EDUCATION, we are driven by a single, powerful idea: education should be limitless. We've built this platform to break down barriers and create a space where curiosity thrives, knowledge is shared, and potential is realized. Our commitment is to provide the highest quality education and empower every student to achieve their dreams."
              </blockquote>
              <div className="mt-6">
                <p className="font-bold text-lg text-primary">Amod Kumar Sharma</p>
                <p className="text-sm text-muted-foreground">Founder & Managing Director</p>
              </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
