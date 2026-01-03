
'use client';

import { Card, CardContent } from "@/components/ui/card";
import { GraduationCap, BookUp, FileStack, Users, CheckCircle, Zap } from "lucide-react";
import Image from "next/image";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className="order-2 lg:order-1 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                <div className="space-y-6">
                    <div className="flex items-center justify-center lg:justify-start">
                        <span className="text-blue-600 text-2xl mr-2">•</span>
                        <h2 className="text-lg font-semibold text-blue-600">Why Choose IDL?</h2>
                    </div>
                     <h3 className="text-3xl md:text-4xl font-black text-foreground tracking-tight text-center lg:text-left">
                        Experience a New Era of Learning
                    </h3>
                    <p className="text-muted-foreground text-center lg:text-left">
                        Our platform is meticulously crafted to provide a holistic and effective learning experience. Here's what sets us apart:
                    </p>
                    <Accordion type="single" collapsible className="w-full space-y-3">
                        {features.map((feature, index) => (
                           <AccordionItem value={`item-${index}`} key={index} className="border bg-background rounded-lg shadow-sm hover:shadow-md transition-shadow">
                                <AccordionTrigger className="p-4 font-semibold text-left hover:no-underline">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-primary/10 text-primary rounded-lg">
                                            {feature.icon}
                                        </div>
                                        <p className="text-foreground">{feature.title}</p>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="px-4 pb-4">
                                    <p className="text-sm text-muted-foreground ml-16">{feature.description}</p>
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
            </div>
             <div className="order-1 lg:order-2 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                 <div className="relative aspect-square max-w-md mx-auto lg:max-w-none">
                     <Image
                        src="https://media.istockphoto.com/id/2155002287/vector/vector-illustration-of-a-smiling-student-reading-a-book-with-an-idea-lightbulb-icon-flat.jpg?s=612x612&w=0&k=20&c=JnC3n6fZgWRQ5pKa8MTYP9dPz03kX0V_EzjgGlooz4Y="
                        alt="A student engaged in learning"
                        data-ai-hint="students learning together"
                        fill
                        className="object-cover rounded-2xl shadow-xl"
                    />
                 </div>
            </div>
        </div>
      </div>
    </section>
  );
}
