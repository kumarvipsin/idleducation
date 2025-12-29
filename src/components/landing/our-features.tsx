
'use client';

import { Card, CardContent } from "@/components/ui/card";
import { GraduationCap, BookUp, FileStack, Users, ChevronRight, FlaskConical, Clock, IndianRupee, Zap, Shield } from "lucide-react";
import Image from "next/image";

const features = [
  {
    icon: <GraduationCap className="w-8 h-8 text-primary" />,
    title: "Expert Faculty",
    description: "Learn from highly skilled, experienced mentors.",
  },
  {
    icon: <FlaskConical className="w-8 h-8 text-primary" />,
    title: "Practical Learning",
    description: "Apply concepts through real, hands-on practice.",
  },
  {
    icon: <Clock className="w-8 h-8 text-primary" />,
    title: "Flexible Batches",
    description: "Choose timings that suit your schedule.",
  },
  {
    icon: <IndianRupee className="w-8 h-8 text-primary" />,
    title: "Affordable Fees",
    description: "Quality learning at genuinely fair pricing.",
  },
  {
    icon: <Zap className="w-8 h-8 text-primary" />,
    title: "Quick Support",
    description: "Get immediate help whenever you need.",
  },
  {
    icon: <Shield className="w-8 h-8 text-primary" />,
    title: "Trusted Institute",
    description: "Known for consistent results and reliability.",
  },
];

export function OurFeatures() {
  return (
    <section 
      className="w-full relative py-12 md:py-16 bg-white dark:bg-gray-900/50"
    >
      <div className="container mx-auto px-4 md:px-[10%] relative z-10">
        
        <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-black dark:text-white">Why Choose IDL?</h2>
            <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
                Discover the advantages that make our platform the best choice for your learning journey.
            </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
                <Card 
                    key={index}
                    className="p-6 text-center bg-background/50 rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300 animate-fade-in-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                >
                    <div className="flex justify-center mb-4">
                        <div className="bg-primary/10 text-primary p-4 rounded-full">
                            {feature.icon}
                        </div>
                    </div>
                    <h3 className="text-lg font-bold mb-2 text-foreground">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                </Card>
            ))}
        </div>

      </div>
    </section>
  );
}
