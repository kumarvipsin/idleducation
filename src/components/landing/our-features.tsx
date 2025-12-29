'use client';

import { Card, CardContent } from "@/components/ui/card";
import { GraduationCap, BookUp, FileStack, Users, ChevronRight, FlaskConical, Clock, IndianRupee, Zap, Shield } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "../ui/button";

const features = [
  {
    icon: <GraduationCap className="w-8 h-8 text-white" />,
    title: "Expert Faculty",
    description: "Learn from highly skilled, experienced mentors.",
  },
  {
    icon: <FlaskConical className="w-8 h-8 text-white" />,
    title: "Practical Learning",
    description: "Apply concepts through real, hands-on practice.",
  },
  {
    icon: <Clock className="w-8 h-8 text-white" />,
    title: "Flexible Batches",
    description: "Choose timings that suit your schedule.",
  },
  {
    icon: <IndianRupee className="w-8 h-8 text-white" />,
    title: "Affordable Fees",
    description: "Quality learning at genuinely fair pricing.",
  },
  {
    icon: <Zap className="w-8 h-8 text-white" />,
    title: "Quick Support",
    description: "Get immediate help whenever you need.",
  },
  {
    icon: <Shield className="w-8 h-8 text-white" />,
    title: "Trusted Institute",
    description: "Known for consistent results and reliability.",
  },
];

export function OurFeatures() {
  return (
    <section 
      className="w-full relative py-12 md:py-16 bg-[#F5F5F7] dark:bg-gray-900"
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
                <Card key={index} className="group p-6 text-center bg-gradient-to-br from-purple-500 to-blue-500 dark:from-purple-900/70 dark:to-blue-900/70 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 animate-fade-in-up border-0" style={{ animationDelay: `${index * 100}ms` }}>
                    <div className="inline-block bg-white/20 text-white p-4 rounded-full mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">
                        {feature.icon}
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                    <p className="text-sm text-white/80">{feature.description}</p>
                </Card>
            ))}
        </div>

      </div>
    </section>
  );
}
