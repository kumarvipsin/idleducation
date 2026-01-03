
'use client';

import { Card, CardContent } from "@/components/ui/card";
import { GraduationCap, BookUp, FileStack, Users, ChevronRight, FlaskConical, Clock, IndianRupee, Zap, Shield } from "lucide-react";
import Image from "next/image";

const features = [
  {
    icon: <GraduationCap className="w-6 h-6 text-white" />,
    title: "Expert Faculty",
    description: "Learn from highly skilled, experienced mentors.",
  },
  {
    icon: <FlaskConical className="w-6 h-6 text-white" />,
    title: "Practical Learning",
    description: "Apply concepts through real, hands-on practice.",
  },
  {
    icon: <Clock className="w-6 h-6 text-white" />,
    title: "Flexible Batches",
    description: "Choose timings that suit your schedule.",
  },
  {
    icon: <IndianRupee className="w-6 h-6 text-white" />,
    title: "Affordable Fees",
    description: "Quality learning at genuinely fair pricing.",
  },
  {
    icon: <Zap className="w-6 h-6 text-white" />,
    title: "Quick Support",
    description: "Get immediate help whenever you need.",
  },
  {
    icon: <Shield className="w-6 h-6 text-white" />,
    title: "Trusted Institute",
    description: "Known for consistent results and reliability.",
  },
];

export function OurFeatures() {
  return (
    <section 
      className="w-full relative py-12 md:py-24"
    >
      <div className="container mx-auto px-4 md:px-[10%] relative z-10">
        
        <div className="text-center mb-12">
            <div className="flex items-center justify-center">
                <span className="text-sky-500 text-2xl mr-2">•</span>
                <h2 className="text-lg font-semibold text-sky-500">Our Features</h2>
            </div>
            <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
                Discover the advantages that make our platform the best choice for your learning journey.
            </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-12 gap-x-8">
            {features.map((feature, index) => (
                <div 
                    key={index}
                    className="flex flex-col items-center text-center animate-fade-in-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                >
                    <div className="flex justify-center mb-4">
                        <div className="bg-primary p-4 rounded-xl shadow-lg">
                            {feature.icon}
                        </div>
                    </div>
                    <h3 className="text-lg font-bold mb-2 text-foreground">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground max-w-xs">{feature.description}</p>
                </div>
            ))}
        </div>

      </div>
    </section>
  );
}
