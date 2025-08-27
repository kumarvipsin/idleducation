
'use client';

import { Card } from "@/components/ui/card";
import { GraduationCap, BookUp, FileQuestion, MessageSquarePlus, Building } from "lucide-react";

const features = [
  {
    icon: <GraduationCap className="w-8 h-8 text-primary" />,
    title: "100% Quality Education",
    subtitle: "Interactive classes",
  },
  {
    icon: <BookUp className="w-8 h-8 text-primary" />,
    title: "100% Complete Syllabus",
    subtitle: "Thorough coverage",
  },
  {
    icon: <FileQuestion className="w-8 h-8 text-primary" />,
    title: "10 Million +",
    subtitle: "Tests, sample papers & notes",
  },
  {
    icon: <MessageSquarePlus className="w-8 h-8 text-primary" />,
    title: "24 x 7",
    subtitle: "Doubt solving sessions",
  },
  {
    icon: <Building className="w-8 h-8 text-primary" />,
    title: "100 +",
    subtitle: "Offline centres",
  },
];

export function OurFeatures() {
  return (
    <section className="w-full py-12 md:py-16 bg-muted/20">
      <div className="container mx-auto px-4 md:px-6">
        <Card className="shadow-lg rounded-xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-0">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="relative flex flex-col items-center text-center gap-2 p-6"
              >
                <div className="flex items-center justify-center h-16 w-16 mb-2">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold text-foreground">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.subtitle}</p>
                {index < features.length - 1 && (
                   <div className="absolute right-0 top-1/2 -translate-y-1/2 h-1/2 w-px bg-border hidden lg:block"></div>
                )}
                 {index < features.length - 1 && (
                    <div className="w-1/2 h-px bg-border mt-4 lg:hidden"></div>
                )}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </section>
  );
}
