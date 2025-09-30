
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
    imageUrl: "https://picsum.photos/seed/notes/600/400",
    imageHint: "notebook pen",
  },
  {
    category: "TEXTBOOK HELP",
    title: "NCERT Solutions",
    description: "Access detailed, step-by-step solutions for all your NCERT textbook questions.",
    href: "/resources/ncert-solutions",
    imageUrl: "https://picsum.photos/seed/ncert/600/400",
    imageHint: "textbooks pile",
  },
  {
    category: "EXAM PREP",
    title: "Previous Year Paper",
    description: "Sharpen your skills and get exam-ready by practicing with past papers.",
    href: "/resources/previous-year-questions",
    imageUrl: "https://images.unsplash.com/photo-1724080924541-a9bbb5953229?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxMXx8ZXhhbXxlbnwwfHx8fDE3NTkxNzQ2OTB8MA&ixlib=rb-4.1.0&q=80&w=1080",
    imageHint: "exam papers",
  },
  {
    category: "FURTHER READING",
    title: "Reference Books",
    description: "Explore a curated collection of reference books to supplement your learning.",
    href: "/resources/reference-books",
    imageUrl: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw3fHxib29rc3xlbnwwfHx8fDE3NTkxNzQ2MDN8MA&ixlib=rb-4.1.0&q=80&w=1080",
    imageHint: "library books",
  },
];

export function StudyResources() {
  return (
    <section className="w-full py-12 md:py-24 bg-[#F5F5F7] dark:bg-gray-900">
      <div className="container mx-auto px-4 md:px-[10%] mb-12">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-black dark:text-white">
            Study Resources
          </h2>
          <p className="text-muted-foreground mt-2 max-w-2xl mx-auto text-sm md:text-base">
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
                    
                    <h3 className="text-2xl font-bold text-foreground mt-2">{resource.title}</h3>
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
