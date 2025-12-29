
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
      className="w-full relative py-8 md:py-12 bg-[#F5F5F7] dark:bg-background"
    >
      <div className="container mx-auto px-4 md:px-[10%]">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-6">
                <div className="flex justify-center mb-4">
                  <div className="bg-gradient-to-br from-blue-500 to-blue-700 text-primary-foreground p-4 rounded-full shadow-lg">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
        </div>
      </div>
    </section>
  );
}
