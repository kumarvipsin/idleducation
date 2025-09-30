
'use client';

import { Card, CardContent } from "@/components/ui/card";
import { GraduationCap, BookUp, FileStack, Users } from "lucide-react";
import Link from "next/link";

const features = [
  {
    icon: <GraduationCap className="w-8 h-8 text-primary" />,
    title: "100% Quality Education",
    subtitle: "Interactive classes",
    href: "#",
  },
  {
    icon: <BookUp className="w-8 h-8 text-primary" />,
    title: "100% Complete Syllabus",
    subtitle: "Thorough coverage",
    href: "#",
  },
  {
    icon: <FileStack className="w-8 h-8 text-primary" />,
    title: "1000+",
    subtitle: "Tests, sample papers & notes",
    href: "#",
  },
  {
    icon: <Users className="w-8 h-8 text-primary" />,
    title: "100+",
    subtitle: "Expert Teachers",
    href: "#",
  },
];

export function OurFeatures() {
  return (
    <section 
      className="w-full relative py-12 md:py-24 bg-[#F5F5F7] dark:bg-gray-900"
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary">Why Choose Us?</h2>
            <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
                Discover the advantages that make our platform the best choice for your learning journey.
            </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {features.map((feature, index) => (
                <Link href={feature.href} key={index} className="group">
                     <Card className="bg-background rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 h-full overflow-hidden" style={{ animation: `float 6s ease-in-out infinite`, animationDelay: `${index * 0.5}s` }}>
                        <CardContent className="p-4 md:p-6 text-center flex flex-col items-center justify-center h-full">
                           <div className="p-4 bg-primary/10 text-primary rounded-full mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">
                                {feature.icon}
                            </div>
                            <h3 className="text-lg md:text-xl font-bold text-foreground">
                                {feature.title}
                            </h3>
                            <p className="text-xs md:text-sm text-muted-foreground mt-1">{feature.subtitle}</p>
                        </CardContent>
                    </Card>
                </Link>
            ))}
        </div>
      </div>
    </section>
  );
}
