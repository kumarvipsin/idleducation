
'use client';

import { Card, CardContent } from "@/components/ui/card";
import { Award, BookCheck, MessageSquare, Video, Presentation, ClipboardCheck, History, Lightbulb } from "lucide-react";

const features = [
  {
    icon: <Award className="w-10 h-10 text-primary" />,
    title: "100% Free Quality Education",
  },
  {
    icon: <BookCheck className="w-10 h-10 text-primary" />,
    title: "100% Complete Syllabus",
  },
  {
    icon: <MessageSquare className="w-10 h-10 text-primary" />,
    title: "Doubt Solving Sessions",
  },
  {
    icon: <Video className="w-10 h-10 text-primary" />,
    title: "Recorded Video Lectures",
  },
  {
    icon: <Presentation className="w-10 h-10 text-primary" />,
    title: "Live Interactive Classes",
  },
  {
    icon: <ClipboardCheck className="w-10 h-10 text-primary" />,
    title: "Exam Preparation Videos",
  },
  {
    icon: <History className="w-10 h-10 text-primary" />,
    title: "Previous Year Questions",
  },
  {
    icon: <Lightbulb className="w-10 h-10 text-primary" />,
    title: "Sample Paper & E-Notes",
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
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="text-center p-6 shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-300 ease-in-out border-transparent hover:border-primary/20">
                <div className="flex justify-center mb-4">
                  <div className="p-4 rounded-full bg-primary/10">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-base md:text-lg font-semibold text-foreground">{feature.title}</h3>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
