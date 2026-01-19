'use client';

import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

const idlEducationFeatures = [
  {
    title: "Modern Learning Approach",
    description: "Updated curriculum, smart learning methods, and exam focused strategies built for today's students.",
  },
  {
    title: "Personal Mentorship",
    description: "Small batches, instant doubt resolution, and dedicated mentor support at every step.",
  },
  {
    title: "Structured & Transparent",
    description: "Clear learning paths, organized study plans, and upfront pricing with no hidden charges.",
  },
  {
    title: "Rich Content Library",
    description: "Extensive library of video lectures, notes, and practice quizzes for all topics.",
  },
];

export function OurFeatures() {
  return (
    <section className="w-full py-12 md:py-24 bg-white dark:bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-black text-sky-500">Why IDL is Different</h2>
          <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
            See how our approach to learning sets us apart from traditional institutes.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 max-w-2xl mx-auto">
          <Card className="rounded-2xl shadow-lg border-primary/20 bg-primary/5 dark:bg-primary/10">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-primary mb-6">IDL EDUCATION</h3>
              <ul className="space-y-6">
                {idlEducationFeatures.map((feature, index) => (
                  <li key={index} className="flex items-start gap-4">
                    <div className="bg-primary/10 text-primary p-2 rounded-full mt-1">
                      <CheckCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">{feature.title}</h4>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
