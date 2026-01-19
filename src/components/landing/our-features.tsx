
'use client';

import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { Lightbulb, UserCheck, Smartphone, GraduationCap } from "lucide-react";

const features = [
  {
    title: "Modern Learning Approach",
    description: "Our modern approach makes learning enjoyable and effective.",
    imageUrl: "https://www.webelight.com/_next/static/media/e-learning_hero.fa5a4e2c.webp",
    imageHint: "online learning illustration",
  },
  {
    title: "Personal Mentorship",
    description: "Our unique two-teacher model ensures instant doubt clarification.",
    imageUrl: "https://www.pw.live/version14/assets/img/group-20358.svg",
    imageHint: "hybrid classroom illustration",
  },
  {
    title: "All-in-One Learning App",
    description: "Learn anytime, anywhere with our vast library of study materials.",
    imageUrl: "https://www.pw.live/version14/assets/img/group-20358.svg",
    imageHint: "mentor student illustration",
  },
  {
    title: "100+ Expert Faculty",
    description: "Learn from experienced educators dedicated to your success.",
    imageUrl: "https://www.pw.live/version14/assets/img/group-20358.svg",
    imageHint: "books resources illustration",
  },
];

export function OurFeatures() {
  return (
    <section className="w-full py-12 md:py-24 bg-white dark:bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-xl md:text-2xl font-black text-accent">Why think IDL?</h2>
          <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
            Discover the advantages that make our platform the best choice for your learning journey.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {features.map((feature, index) => (
            <Card key={index} className="bg-background/80 dark:bg-card rounded-2xl shadow-lg overflow-hidden border-primary/10">
              <CardContent className="p-8 space-y-4 text-center">
                <div className="flex flex-col items-center gap-4">
                  <h3 className="text-xl font-bold text-foreground">{feature.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
                <div className="relative h-56 w-full mt-4">
                  <Image
                    src={feature.imageUrl}
                    alt={feature.title}
                    data-ai-hint={feature.imageHint}
                    fill
                    className="object-contain"
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
