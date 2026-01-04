
'use client';

import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const resources = [
  {
    category: "REVISION",
    title: "Notes",
    description: "Find concise and well-structured notes designed for quick revision.",
    href: "/resources/notes",
    imageUrl: "https://ezeenotes.in/wp-content/uploads/2024/03/Book-Mockups-2-1-e1710253086447-1024x802.png",
    imageHint: "notebook pen",
  },
  {
    category: "TEXTBOOK HELP",
    title: "NCERT Solutions",
    description: "Access detailed, step-by-step solutions for all your NCERT textbook questions.",
    href: "/resources/ncert-solutions",
    imageUrl: "https://ezeenotes.in/wp-content/uploads/2024/03/Book-Mockups-2-1-e1710253086447-1024x802.png",
    imageHint: "textbooks pile",
  },
  {
    category: "PRACTICE",
    title: "Previous Year Questions",
    description: "Practice with past exam papers to understand the pattern and types of questions.",
    href: "/resources/previous-year-questions",
    imageUrl: "https://ezeenotes.in/wp-content/uploads/2024/03/Book-Mockups-2-1-e1710253086447-1024x802.png",
    imageHint: "exam paper test",
  },
  {
    category: "FURTHER READING",
    title: "Reference Books",
    description: "Explore a curated collection of reference books to supplement your learning.",
    href: "/resources/reference-books",
    imageUrl: "https://ezeenotes.in/wp-content/uploads/2024/03/Book-Mockups-2-1-e1710253086447-1024x802.png",
    imageHint: "library books",
  },
];

export function StudyResources() {
  return (
    <section className="w-full py-4 md:py-8 bg-[#F5F5F7] dark:bg-gray-900">
      <div className="container mx-auto px-4 md:px-[10%] mb-12">
        <div className="text-center">
            <div className="flex items-center justify-center">
              <span className="text-blue-600 text-2xl mr-2">•</span>
              <h2 className="text-lg font-semibold text-blue-600">Study Resources</h2>
            </div>
          <p className="text-muted-foreground mt-2 max-w-2xl mx-auto text-sm">
            A diverse array of learning materials to enhance your educational journey.
          </p>
        </div>
      </div>
      <div className="relative">
        <div className="overflow-x-auto pb-8 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex gap-6 px-4 md:px-[10%]">
            {resources.map((resource, index) => (
              <Link href={resource.href} key={index} className="block flex-shrink-0 w-[300px] sm:w-[350px] group">
                <Card className="h-full rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col bg-card">
                  <CardContent className="p-8 flex-grow flex flex-col">
                    
                    <h3 className="text-2xl font-black mt-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">{resource.title}</h3>
                    <p className="text-sm mt-2 text-muted-foreground flex-grow">{resource.description}</p>
                  </CardContent>
                  <div className="relative aspect-[4/3] w-full mt-auto">
                    <Image
                      src={resource.imageUrl}
                      alt={resource.title}
                      data-ai-hint={resource.imageHint}
                      fill
                      className="object-cover"
                    />
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
