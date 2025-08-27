
'use client';

import { Card } from "@/components/ui/card";
import { Award, BookCheck, MessageSquare } from "lucide-react";

const features = [
  {
    icon: <Award className="w-6 h-6 text-primary" />,
    title: "100% Free Quality Education",
  },
  {
    icon: <BookCheck className="w-6 h-6 text-primary" />,
    title: "100% Complete Syllabus",
  },
  {
    icon: <MessageSquare className="w-6 h-6 text-primary" />,
    title: "Doubt Solving Sessions",
  },
];

export function OurFeatures() {
  return (
    <section className="w-full py-12 md:py-24 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-primary">Our Features</h2>
          <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
            Everything you need to succeed, all in one place.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-4 md:gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="group flex items-center gap-4 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors duration-300"
            >
                <div className="flex-shrink-0">
                  <div className="p-3 rounded-full bg-background group-hover:bg-primary/10 transition-colors duration-300">
                    <div className="transition-colors duration-300 group-hover:text-primary">
                      {feature.icon}
                    </div>
                  </div>
                </div>
                <h3 className="text-sm md:text-base font-semibold text-foreground">{feature.title}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
