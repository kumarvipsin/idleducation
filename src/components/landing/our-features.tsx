
'use client';

import { Card, CardContent } from "@/components/ui/card";
import { GraduationCap, BookUp, FileQuestion, MessageSquarePlus, Building, Users } from "lucide-react";
import Link from "next/link";

const features = [
  {
    icon: <GraduationCap className="w-10 h-10 text-primary" />,
    title: "100% Quality Education",
    subtitle: "Interactive classes",
    href: "#",
  },
  {
    icon: <BookUp className="w-10 h-10 text-primary" />,
    title: "100% Complete Syllabus",
    subtitle: "Thorough coverage",
    href: "#",
  },
  {
    icon: <FileQuestion className="w-10 h-10 text-primary" />,
    title: "1000+",
    subtitle: "Tests, sample papers & notes",
    href: "#",
  },
  {
    icon: <Users className="w-10 h-10 text-primary" />,
    title: "100+",
    subtitle: "Expert Teachers",
    href: "#",
  },
  {
    icon: <MessageSquarePlus className="w-10 h-10 text-primary" />,
    title: "24 x 7",
    subtitle: "Doubt solving sessions",
    href: "#",
  },
  {
    icon: <Building className="w-10 h-10 text-primary" />,
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
        <div className="p-6 rounded-xl">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
            {features.map((feature, index) => (
                <Link href={feature.href} key={index} className="group h-full">
                <Card 
                    className="relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:-translate-y-2 h-full bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/10 dark:to-purple-900/10"
                    style={{ animationDelay: `${index * 0.1 + 0.3}s` }}
                >
                    <CardContent className="p-6 text-center flex flex-col items-center justify-center h-full">
                    <div className="p-4 bg-primary/10 rounded-full mb-4 transition-transform duration-300 group-hover:scale-110">
                        {feature.icon}
                    </div>
                    <h3 className="text-xl font-bold text-foreground">
                        {feature.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">{feature.subtitle}</p>
                    </CardContent>
                </Card>
                </Link>
            ))}
            </div>
        </div>
      </div>
    </section>
  );
}
