
'use client';

import { Card, CardContent } from "@/components/ui/card";
import { GraduationCap, BookUp, FileQuestion, MessageSquarePlus, Building, Users } from "lucide-react";
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
    icon: <FileQuestion className="w-8 h-8 text-primary" />,
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
  {
    icon: <MessageSquarePlus className="w-8 h-8 text-primary" />,
    title: "24 x 7",
    subtitle: "Doubt solving sessions",
    href: "#",
  },
  {
    icon: <Building className="w-8 h-8 text-primary" />,
    title: "5 +",
    subtitle: "Offline centres",
    href: "/offline-centers",
  },
];

export function OurFeatures() {
  return (
    <section 
      className="w-full pt-6 md:pt-12 pb-12 md:pb-16"
      style={{ backgroundColor: '#f8f9fa' }}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">
            <span className="text-black dark:text-white">Our</span> <span style={{ color: '#adb5bd' }}>Features</span>
          </h2>
          <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
            Discover the key features that make our platform the best choice for your learning needs.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-8 justify-items-center">
            {features.map((feature, index) => (
                <Link href={feature.href} key={index} className="group">
                    <div 
                        className="relative w-48 h-48 sm:w-56 sm:h-56 flex flex-col items-center justify-center text-center p-4 rounded-full border-4 border-primary/20 bg-background shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1"
                        style={{ animationDelay: `${index * 0.1 + 0.3}s` }}
                    >
                         <div className="absolute inset-0 rounded-full border-4 border-white dark:border-gray-800 transform scale-90"></div>
                         <div className="relative z-10 flex flex-col items-center justify-center">
                            {feature.icon}
                            <h3 className="text-lg font-bold text-primary mt-2">
                                {feature.title}
                            </h3>
                            <p className="text-xs text-muted-foreground">{feature.subtitle}</p>
                         </div>
                    </div>
                </Link>
            ))}
        </div>
      </div>
    </section>
  );
}
