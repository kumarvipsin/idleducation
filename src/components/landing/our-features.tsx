
'use client';

import { Card, CardContent } from "@/components/ui/card";
import { GraduationCap, BookUp, FileStack, Users } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const features = [
  {
    title: "100% Quality Education",
    description: "Interactive classes designed to provide the best learning experience.",
    href: "#",
    imageUrl: "https://picsum.photos/seed/quality/600/400",
    imageHint: "teacher student",
  },
  {
    title: "100% Complete Syllabus",
    description: "Thorough coverage of all subjects and topics as per the latest syllabus.",
    href: "#",
    imageUrl: "https://picsum.photos/seed/syllabus/600/400",
    imageHint: "books pencils",
  },
  {
    title: "1000+ Resources",
    description: "Access a vast library of tests, sample papers, and notes.",
    href: "#",
    imageUrl: "https://picsum.photos/seed/resources/600/400",
    imageHint: "online library",
  },
  {
    title: "100+ Expert Teachers",
    description: "Learn from the best and most experienced educators in the industry.",
    href: "#",
    imageUrl: "https://picsum.photos/seed/teachers/600/400",
    imageHint: "teacher classroom",
  },
  {
    title: "Regular Assessments",
    description: "High-quality mock tests with multi-layer testing and detailed evaluation.",
    href: "#",
    imageUrl: "https://picsum.photos/seed/assessments/600/400",
    imageHint: "student test",
  },
  {
    title: "Unique Two-Teacher Model",
    description: "Ensuring your doubts are cleared instantly for a seamless learning experience.",
    href: "#",
    imageUrl: "https://picsum.photos/seed/two-teachers/600/400",
    imageHint: "teachers collaborating",
  },
];

export function OurFeatures() {
  return (
    <section 
      className="w-full relative py-12 md:py-24 bg-[#F5F5F7] dark:bg-gray-900"
    >
      <div className="container mx-auto px-4 md:px-[10%] mb-12">
        <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-primary">Why Choose Us?</h2>
            <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
                Discover the advantages that make our platform the best choice for your learning journey.
            </p>
        </div>
      </div>
      <div className="relative">
        <div className="overflow-x-auto pb-8 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex gap-6 px-4 md:px-[10%]">
            {features.map((feature, index) => (
              <Link href={feature.href} key={index} className="block flex-shrink-0 w-[300px] sm:w-[350px] group">
                <Card className="h-full rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col bg-card">
                  <CardContent className="p-8 flex-grow flex flex-col">
                    
                    <h3 className="text-2xl font-bold text-foreground mt-2">{feature.title}</h3>
                    <p className="text-sm mt-2 text-muted-foreground flex-grow">{feature.description}</p>
                  </CardContent>
                  <div className="relative aspect-[4/3] w-full mt-auto p-[5%]">
                    <Image
                      src={feature.imageUrl}
                      alt={feature.title}
                      data-ai-hint={feature.imageHint}
                      fill
                      className="object-cover rounded-md"
                    />
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
