'use client';

import { Card, CardContent } from "@/components/ui/card";
import { GraduationCap, BookUp, FileStack, Users, CheckCircle, Zap } from "lucide-react";

const otherInstituteFeatures = [
  {
    title: "Outdated Teaching",
    description: "Traditional methods that fail to adapt to changing exam patterns and student needs.",
  },
  {
    title: "Minimal Attention",
    description: "Large batches where students struggle to get personal guidance or doubt support.",
  },
  {
    title: "Unclear Process",
    description: "Confusing fee structures and no clear roadmap for learning or improvement.",
  },
];

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
];

export function OurFeatures() {
  return (
    <section 
      className="w-full relative py-12 md:py-20 bg-[#F5F5F7] dark:bg-gray-900"
    >
      <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-10">
        <div className="space-y-6 text-center mb-12">
            <div className="flex items-center justify-center">
                <span className="text-blue-600 text-2xl mr-2">•</span>
                <h2 className="text-lg font-semibold text-blue-600">Why Choose IDL?</h2>
            </div>
            <h3 className="text-3xl md:text-4xl font-black text-foreground tracking-tight">
                Experience a New Era of Learning
            </h3>
            <p className="text-muted-foreground max-w-3xl mx-auto">
                Our platform is meticulously crafted to provide a holistic and effective learning experience. Here's what sets us apart:
            </p>
        </div>

        <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-0 bg-white dark:bg-card p-4 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
                {/* Other Institute Column */}
                <div className="space-y-8 p-4">
                    <h4 className="text-2xl font-bold text-foreground">Other Institute</h4>
                    {otherInstituteFeatures.map((feature, index) => (
                        <div key={index} className="flex items-start gap-4">
                            <div className="w-5 h-5 rounded-full bg-orange-500 mt-1 flex-shrink-0" />
                            <div>
                                <h5 className="font-semibold text-lg">{feature.title}</h5>
                                <p className="text-muted-foreground text-sm">{feature.description}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* IDL Education Column */}
                <div className="space-y-8 bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
                    <h4 className="text-2xl font-bold text-primary">IDL Education</h4>
                    {idlEducationFeatures.map((feature, index) => (
                        <div key={index} className="flex items-start gap-4">
                            <div className="w-5 h-5 rounded-full bg-blue-500 mt-1 flex-shrink-0" />
                            <div>
                                <h5 className="font-semibold text-lg">{feature.title}</h5>
                                <p className="text-muted-foreground text-sm">{feature.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>

      </div>
    </section>
  );
}
