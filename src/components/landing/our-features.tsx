
'use client';

import { Card, CardContent } from "@/components/ui/card";
import { GraduationCap, BookUp, FileQuestion, MessageSquarePlus, Building } from "lucide-react";
import { useEffect, useState, useRef } from 'react';

const features = [
  {
    icon: <GraduationCap className="w-10 h-10 text-white" />,
    title: "100% Quality Education",
    subtitle: "Interactive classes",
  },
  {
    icon: <BookUp className="w-10 h-10 text-white" />,
    title: "100% Complete Syllabus",
    subtitle: "Thorough coverage",
  },
  {
    icon: <FileQuestion className="w-10 h-10 text-white" />,
    title: "1000+",
    subtitle: "Tests, sample papers & notes",
  },
  {
    icon: <MessageSquarePlus className="w-10 h-10 text-white" />,
    title: "24 x 7",
    subtitle: "Doubt solving sessions",
  },
  {
    icon: <Building className="w-10 h-10 text-white" />,
    title: "5 +",
    subtitle: "Offline centres",
  },
];

export function OurFeatures() {
  return (
    <section className="w-full py-12 md:py-16 bg-muted/20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:-translate-y-2 bg-gradient-to-br from-primary via-primary to-accent"
            >
              <CardContent className="p-6 text-center flex flex-col items-center justify-center h-full">
                <div className="p-4 bg-white/20 rounded-full mb-4 transition-transform duration-300 group-hover:scale-110">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-white">
                  {feature.title}
                </h3>
                <p className="text-sm text-primary-foreground/80">{feature.subtitle}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
