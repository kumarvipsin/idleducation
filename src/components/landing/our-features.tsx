'use client';

import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

const features = [
  {
    title: "Modern Learning Approach",
    description: "Our teaching methodology is designed to make learning enjoyable and effective, utilizing modern teaching aids and real-world examples.",
    imageUrl: "https://www.pw.live/version14/assets/img/group-20356.svg",
    imageHint: "online learning illustration",
  },
  {
    title: "Personal Mentorship",
    description: "Ensuring your doubts are cleared instantly with one teacher leading the class and a second dedicated to doubt-solving.",
    imageUrl: "https://www.pw.live/version14/assets/img/group-20355.svg",
    imageHint: "hybrid classroom illustration",
  },
  {
    title: "All-in-One Learning App",
    description: "Access a vast library of study materials, tests, and notes to learn at your own pace, anytime, anywhere.",
    imageUrl: "https://www.pw.live/version14/assets/img/group-20358.svg",
    imageHint: "mentor student illustration",
  },
  {
    title: "100+ Expert Faculty",
    description: "Learn from highly qualified and experienced educators from top institutions who are dedicated to nurturing your potential.",
    imageUrl: "https://www.pw.live/version14/assets/img/group-20357.svg",
    imageHint: "books resources illustration",
  },
  {
    title: "Complete Syllabus Coverage",
    description: "We ensure thorough coverage of all subjects and topics as per the latest academic syllabus, leaving no stone unturned.",
    imageUrl: "https://www.pw.live/version14/assets/img/group-20357.svg",
    imageHint: "syllabus books",
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
                <h3 className="text-xl font-bold text-foreground">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
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
