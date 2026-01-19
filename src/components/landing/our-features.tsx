'use client';

import { Card, CardContent } from "@/components/ui/card";
import { Zap, Users, ClipboardList, BookOpen } from "lucide-react";

const idlEducationFeatures = [
  {
    icon: <Zap className="w-6 h-6 text-primary" />,
    title: "Modern Learning Approach",
    description: "Updated curriculum, smart learning methods, and exam focused strategies built for today's students.",
  },
  {
    icon: <Users className="w-6 h-6 text-primary" />,
    title: "Personal Mentorship",
    description: "Small batches, instant doubt resolution, and dedicated mentor support at every step.",
  },
  {
    icon: <ClipboardList className="w-6 h-6 text-primary" />,
    title: "Structured & Transparent",
    description: "Clear learning paths, organized study plans, and upfront pricing with no hidden charges.",
  },
  {
    icon: <BookOpen className="w-6 h-6 text-primary" />,
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

        <Card className="max-w-4xl mx-auto shadow-2xl rounded-2xl border-primary/10">
            <CardContent className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    {idlEducationFeatures.map((feature, index) => (
                        <div key={index} className="flex items-start gap-4">
                            <div className="bg-primary/10 p-3 rounded-full mt-1">
                                {feature.icon}
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-foreground mb-1">{feature.title}</h3>
                                <p className="text-sm text-muted-foreground">{feature.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
      </div>
    </section>
  );
}
