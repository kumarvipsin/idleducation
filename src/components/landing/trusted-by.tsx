
'use client';

import { Card, CardContent } from "@/components/ui/card";
import { XCircle, CheckCircle } from "lucide-react";

const otherInstitutePoints = [
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

const idlEducationPoints = [
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

export function TrustedBy() {
  return (
    <section className="w-full py-12 md:py-24 bg-[#F5F5F7] dark:bg-gray-900">
        <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-black text-black dark:text-white">
                    Trusted by Students & Parents
                </h2>
                <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
                    See how IDL Education compares to other institutes and why we are the preferred choice for dedicated learners.
                </p>
            </div>

            <div className="max-w-7xl mx-auto">
                 <Card className="shadow-2xl rounded-3xl overflow-hidden bg-background">
                    <div className="grid grid-cols-1 md:grid-cols-2">
                        {/* Other Institute Column */}
                        <div className="p-8">
                            <h3 className="text-2xl font-bold text-foreground mb-6">Other Institute</h3>
                            <div className="space-y-6">
                                {otherInstitutePoints.map((item, index) => (
                                    <div key={index} className="flex items-start gap-4">
                                        <XCircle className="w-5 h-5 text-destructive mt-1 flex-shrink-0" />
                                        <div>
                                            <h4 className="font-bold text-foreground">{item.title}</h4>
                                            <p className="text-sm text-muted-foreground">{item.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* IDL Education Column */}
                        <div className="p-8 bg-blue-50 dark:bg-blue-900/20 md:rounded-l-[25%]">
                             <h3 className="text-2xl font-bold text-primary mb-6">IDL Education</h3>
                             <div className="space-y-6">
                                {idlEducationPoints.map((item, index) => (
                                    <div key={index} className="flex items-start gap-4">
                                        <CheckCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                                        <div>
                                            <h4 className="font-bold text-foreground">{item.title}</h4>
                                            <p className="text-sm text-muted-foreground">{item.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    </section>
  );
}
