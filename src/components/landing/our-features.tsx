
'use client';

import { Card, CardContent } from "@/components/ui/card";
import { GraduationCap, BookUp, FileStack, Users } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const features = [
  {
    title: "Expert Faculty",
    description: "Learn from the best and most experienced educators in the industry.",
    href: "#",
    imageUrl: "https://picsum.photos/seed/teachers/600/400",
    imageHint: "teacher classroom",
  },
  {
    title: "100% Quality Education",
    description: "Interactive classes designed to provide the best learning experience.",
    href: "#",
    imageUrl: "https://www.jirs.ac.in/uploads/blog/7a76ecbb7e5d2a599c5e90471d0d7790.jpg",
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
    title: "Comprehensive Study Material",
    description: "Access a vast library of tests, sample papers, and notes.",
    href: "#",
    imageUrl: "https://picsum.photos/seed/resources/600/400",
    imageHint: "online library",
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
              <Link href={feature.href} key={index} className="block flex-shrink-0 w-[300px] sm:w-[350px] group">
                <Card className="h-full rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col bg-card">
                  <CardContent className="p-8 flex-grow flex flex-col">
                    
                    <h3 className="text-2xl font-bold mt-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">{feature.title}</h3>
                    <p className="text-sm mt-2 text-muted-foreground flex-grow">{feature.description}</p>
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
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
