
'use client';

import { Card, CardContent } from "@/components/ui/card";
import { GraduationCap, BookUp, FileStack, Users, ChevronRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "../ui/button";

const features = [
  {
    slug: "expert-faculty",
    title: "100+ Expert Faculty",
    description: "Learn from the best and most experienced educators in the industry.",
    href: "/feature/expert-faculty",
    imageUrl: "https://www.euroschoolindia.com/blogs/wp-content/uploads/2023/07/importance-of-education.jpg",
    imageHint: "teacher classroom",
  },
  {
    slug: "quality-education",
    title: "100% Quality Education",
    description: "Interactive classes designed to provide the best learning experience.",
    href: "/feature/quality-education",
    imageUrl: "https://www.euroschoolindia.com/blogs/wp-content/uploads/2023/07/importance-of-education.jpg",
    imageHint: "teacher student",
  },
  {
    slug: "complete-syllabus",
    title: "100% Complete Syllabus",
    description: "Thorough coverage of all subjects and topics as per the latest syllabus.",
    href: "/feature/complete-syllabus",
    imageUrl: "https://www.euroschoolindia.com/blogs/wp-content/uploads/2023/07/importance-of-education.jpg",
    imageHint: "books pencils",
  },
  {
    slug: "two-teacher-model",
    title: "Unique Two-Teacher Model",
    description: "Ensuring your doubts are cleared instantly for a seamless learning experience.",
    href: "/feature/two-teacher-model",
    imageUrl: "https://www.euroschoolindia.com/blogs/wp-content/uploads/2023/07/importance-of-education.jpg",
    imageHint: "teachers collaborating",
  },
  {
    slug: "all-in-one-learning",
    title: "All-in-One Learning, Anytime, Anywhere.",
    description: "Access a vast library of tests, sample papers, and notes.",
    href: "/feature/all-in-one-learning",
    imageUrl: "https://www.euroschoolindia.com/blogs/wp-content/uploads/2023/07/importance-of-education.jpg",
    imageHint: "student laptop",
  },
];

export function OurFeatures() {
  return (
    <section 
      className="w-full relative py-12 md:py-24 bg-[#F5F5F7] dark:bg-gray-900"
    >
      <div className="container mx-auto px-4 md:px-[10%] mb-12">
        <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-black bg-clip-text text-transparent" style={{ backgroundImage: "linear-gradient(90deg, rgba(42, 123, 155, 1) 0%, rgba(87, 199, 133, 1) 57%, rgba(237, 221, 83, 1) 100%)" }}>Why Choose Us?</h2>
            <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
                Discover the advantages that make our platform the best choice for your learning journey.
            </p>
        </div>
      </div>
      <div className="relative">
        <div className="overflow-x-auto pb-8 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex gap-6 px-4 md:px-[10%]">
            {features.map((feature, index) => (
              <div key={index} className="block flex-shrink-0 w-[300px] sm:w-[350px] group">
                <Card className="h-full rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col bg-card">
                  <CardContent className="p-8 flex-grow flex flex-col">
                    
                    <h3 className="text-2xl font-bold mt-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">{feature.title}</h3>
                    <p className="text-sm mt-2 text-muted-foreground flex-grow">{feature.description}</p>
                    <div className="mt-4">
                        <Button asChild variant="outline" size="sm" className="rounded-full text-xs">
                            <Link href={feature.href}>
                                More <ChevronRight className="w-3 h-3 ml-1.5" />
                            </Link>
                        </Button>
                    </div>
                  </CardContent>
                  <div className="relative aspect-[4/3] w-full mt-auto p-4">
                    <Image
                      src={feature.imageUrl}
                      alt={feature.title}
                      data-ai-hint={feature.imageHint}
                      fill
                      className="object-cover rounded-md"
                    />
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
