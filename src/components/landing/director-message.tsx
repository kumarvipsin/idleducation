
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
        <Card className="max-w-4xl mx-auto shadow-lg">
          <CardContent className="p-8 grid md:grid-cols-3 gap-8 items-center">
            <div className="md:col-span-1 flex justify-center">
              <Avatar className="w-40 h-40 border-4 border-primary">
                <Image src="https://picsum.photos/seed/director/400/400" alt="Director's Photo" data-ai-hint="director portrait" layout="fill" objectFit="cover" />
                <AvatarFallback>DM</AvatarFallback>
              </Avatar>
            </div>
            <div className="md:col-span-2">
              <blockquote className="border-l-4 border-primary pl-4 italic text-lg text-foreground/80">
                "At IDL EDUCATION, we are driven by a single, powerful idea: education should be limitless. We've built this platform to break down barriers and create a space where curiosity thrives, knowledge is shared, and potential is realized. Our commitment is to provide the highest quality education and empower every student to achieve their dreams."
              </blockquote>
              <div className="mt-4 text-right">
                <p className="font-bold text-lg text-primary">Amod Kumar Sharma</p>
                <p className="text-sm text-muted-foreground">Founder & Managing Director</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
