
'use client';

import { Card, CardContent } from "@/components/ui/card";
import { Award, BookCheck, MessageSquare, Video, Presentation, ClipboardCheck, History, Lightbulb } from "lucide-react";

const features = [
  {
    icon: <Award className="w-8 h-8 text-primary" />,
    title: "100% Free Quality Education",
  },
  {
    icon: <BookCheck className="w-8 h-8 text-primary" />,
    title: "100% Complete Syllabus",
  },
  {
    icon: <MessageSquare className="w-8 h-8 text-primary" />,
    title: "Doubt Solving Sessions",
  },
  {
    icon: <Video className="w-8 h-8 text-primary" />,
    title: "Recorded Video Lectures",
  },
  {
    icon: <Presentation className="w-8 h-8 text-primary" />,
    title: "Live Interactive Classes",
  },
  {
    icon: <ClipboardCheck className="w-8 h-8 text-primary" />,
    title: "Exam Preparation Videos",
  },
  {
    icon: <History className="w-8 h-8 text-primary" />,
    title: "Previous Year Questions",
  },
  {
    icon: <Lightbulb className="w-8 h-8 text-primary" />,
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
        <Card className="shadow-lg">
          <CardContent className="p-8 md:p-12">
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="p-4 rounded-full bg-primary/10">
                    {feature.icon}
                  </div>
                  <h3 className="text-base md:text-lg font-semibold text-foreground">{feature.title}</h3>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
