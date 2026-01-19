'use client';

import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { Lightbulb, UserCheck, Smartphone, GraduationCap } from "lucide-react";

const features = [
  {
    title: "Modern Learning Approach",
    description: "Our modern approach makes learning enjoyable and effective with real-world examples.",
    imageUrl: "https://www.webelight.com/_next/static/media/e-learning_hero.fa5a4e2c.webp",
    imageHint: "online learning illustration",
    icon: (
      <div className="bg-primary/10 p-3 rounded-full">
        <Lightbulb className="w-6 h-6 text-primary" />
      </div>
    ),
  },
  {
    title: "Personal Mentorship",
    description: "Ensuring your doubts are cleared instantly with one teacher leading the class and a second dedicated to doubt-solving.",
    imageUrl: "https://www.pw.live/version14/assets/img/group-20355.svg",
    imageHint: "hybrid classroom illustration",
    icon: (
      <div className="bg-primary/10 p-3 rounded-full">
        <UserCheck className="w-6 h-6 text-primary" />
      </div>
    ),
  },
  {
    title: "All-in-One Learning App",
    description: "Access a vast library of study materials, tests, and notes to learn at your own pace, anytime, anywhere.",
    imageUrl: "https://www.pw.live/version14/assets/img/group-20358.svg",
    imageHint: "mentor student illustration",
    icon: (
      <div className="bg-primary/10 p-3 rounded-full">
        <Smartphone className="w-6 h-6 text-primary" />
      </div>
    ),
  },
  {
    title: "100+ Expert Faculty",
    description: "Learn from highly qualified and experienced educators from top institutions who are dedicated to nurturing your potential.",
    imageUrl: "https://www.pw.live/version14/assets/img/group-20357.svg",
    imageHint: "books resources illustration",
    icon: (
      <div className="bg-primary/10 p-3 rounded-full">
        <GraduationCap className="w-6 h-6 text-primary" />
      </div>
    ),
  },
];

export function OurFeatures() {
  return (
    <section className="w-full py-12 md:py-24 bg-white dark:bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-black text-primary">Why think IDL?</h2>
          <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
            Discover the advantages that make our platform the best choice for your learning journey.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {features.map((feature, index) => (
            <Card key={index} className="bg-background/80 dark:bg-card rounded-2xl shadow-lg overflow-hidden border-primary/10">
              <CardContent className="p-8 space-y-4 text-center">
                <div className="flex items-center justify-center gap-4">
                  {feature.icon}
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
