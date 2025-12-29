
'use client';

import { Card, CardContent } from "@/components/ui/card";
import { GraduationCap, BookUp, FileStack, Users, ChevronRight, FlaskConical, Clock, IndianRupee, Zap, Shield } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import Image from "next/image";

const features = [
  {
    icon: <GraduationCap className="w-6 h-6 text-primary" />,
    title: "Expert Faculty",
    description: "Learn from highly skilled, experienced mentors.",
  },
  {
    icon: <FlaskConical className="w-6 h-6 text-primary" />,
    title: "Practical Learning",
    description: "Apply concepts through real, hands-on practice.",
  },
  {
    icon: <Clock className="w-6 h-6 text-primary" />,
    title: "Flexible Batches",
    description: "Choose timings that suit your schedule.",
  },
  {
    icon: <IndianRupee className="w-6 h-6 text-primary" />,
    title: "Affordable Fees",
    description: "Quality learning at genuinely fair pricing.",
  },
  {
    icon: <Zap className="w-6 h-6 text-primary" />,
    title: "Quick Support",
    description: "Get immediate help whenever you need.",
  },
  {
    icon: <Shield className="w-6 h-6 text-primary" />,
    title: "Trusted Institute",
    description: "Known for consistent results and reliability.",
  },
];

export function OurFeatures() {
  return (
    <section 
      className="w-full relative py-12 md:py-16 bg-white dark:bg-gray-900/50"
    >
      <div className="container mx-auto px-4 md:px-[10%] relative z-10">
        
        <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-black dark:text-white">Why Choose IDL?</h2>
            <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
                Discover the advantages that make our platform the best choice for your learning journey.
            </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl animate-fade-in-up">
                <Image 
                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    alt="Students collaborating"
                    data-ai-hint="students collaborating"
                    fill
                    className="object-cover"
                />
                 <div className="absolute inset-0 bg-gradient-to-t from-primary/50 to-transparent"></div>
            </div>
            <div className="space-y-4 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                 <Accordion type="single" defaultValue="item-0" collapsible className="w-full">
                    {features.map((feature, index) => (
                        <AccordionItem value={`item-${index}`} key={index} className="bg-background border border-border rounded-lg mb-2 shadow-sm transition-shadow hover:shadow-md">
                            <AccordionTrigger className="p-4 text-base font-semibold text-left hover:no-underline">
                                <div className="flex items-center gap-4">
                                    <div className="bg-primary/10 text-primary p-3 rounded-full">
                                        {feature.icon}
                                    </div>
                                    <span>{feature.title}</span>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="px-4 pb-4">
                                <p className="text-muted-foreground pl-14 text-sm">{feature.description}</p>
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
        </div>

      </div>
    </section>
  );
}
