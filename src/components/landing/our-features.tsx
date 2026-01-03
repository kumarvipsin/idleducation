
'use client';

import { Card, CardContent } from "@/components/ui/card";
import { GraduationCap, BookUp, FileStack, Users, CheckCircle, Zap } from "lucide-react";

const features = [
  {
    icon: <GraduationCap className="w-5 h-5" />,
    title: "100+ Expert Faculty",
    description: "Learn from experienced educators and subject matter experts dedicated to your success.",
  },
  {
    icon: <CheckCircle className="w-5 h-5" />,
    title: "100% Quality Education",
    description: "We are committed to delivering the highest quality education through interactive and engaging classes, utilizing modern teaching aids to make learning enjoyable and effective.",
  },
  {
    icon: <FileStack className="w-5 h-5" />,
    title: "100% Complete Syllabus",
    description: "Our curriculum ensures thorough coverage of all subjects as per the latest academic syllabus. Regular assessments and revision sessions are conducted to reinforce learning.",
  },
  {
    icon: <Users className="w-5 h-5" />,
    title: "Unique Two-Teacher Model",
    description: "Our innovative two-teacher model ensures every student gets the attention they need. One teacher leads the class, while the second instantly clears any doubts.",
  },
   {
    icon: <BookUp className="w-5 h-5" />,
    title: "All-in-One Learning, Anytime, Anywhere.",
    description: "Our platform is a one-stop solution with a vast library of study materials, including tests, sample papers, and notes, accessible anytime, anywhere.",
  },
  {
    icon: <Zap className="w-5 h-5" />,
    title: "Practical Learning",
    description: "Apply your knowledge with hands-on projects and real-world case studies to build practical skills.",
  },
];

export function OurFeatures() {
  return (
    <section 
      className="w-full relative py-6 md:py-12 bg-[#F5F5F7] dark:bg-gray-900"
    >
      <div className="container mx-auto px-4 md:px-[10%] relative z-10">
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
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <div className="space-y-4">
            {features.slice(0, 3).map((feature, index) => (
              <Card key={index} className="bg-background border border-border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-primary/10 text-primary rounded-lg mt-1">
                      {feature.icon}
                    </div>
                    <div>
                      <h4 className="font-semibold text-left">{feature.title}</h4>
                      <p className="text-muted-foreground text-left text-sm">{feature.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="space-y-4">
            {features.slice(3, 6).map((feature, index) => (
              <Card key={index} className="bg-background border border-border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-primary/10 text-primary rounded-lg mt-1">
                      {feature.icon}
                    </div>
                    <div>
                      <h4 className="font-semibold text-left">{feature.title}</h4>
                      <p className="text-muted-foreground text-left text-sm">{feature.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
