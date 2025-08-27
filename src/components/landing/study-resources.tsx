
'use client';

import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

const resources = [
  {
    title: "Reference Books",
    description: "Our experts have created thorough study materials that break down complicated concepts into easily understandable content.",
    bgColor: "bg-blue-50 dark:bg-blue-900/20",
    href: "/resources/reference-books",
    imageSrc: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8",
    imageHint: "books on shelf",
  },
  {
    title: "NCERT Solutions",
    description: "Unlock academic excellence with Physics Wallah's NCERT Solutions which provides you step-by-step solutions",
    bgColor: "bg-orange-50 dark:bg-orange-900/20",
    href: "/resources/ncert-solutions",
    imageSrc: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8",
    imageHint: "student writing",
  },
  {
    title: "Notes",
    description: "Use Physics Wallah's detailed study materials that simplify complex ideas into easily understandable language.",
    bgColor: "bg-green-50 dark:bg-green-900/20",
    href: "/resources/notes",
    imageSrc: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw5fHxub3Rlc3xlbnwwfHx8fDE3NTYyNzY5NDl8MA&ixlib=rb-4.1.0&q=80&w=1080",
    imageHint: "planning notes",
  },
  {
    title: "Previous Year Questions",
    description: "Practice with past exam papers to understand patterns and improve your time management for the actual exams.",
    bgColor: "bg-purple-50 dark:bg-purple-900/20",
    href: "/resources/previous-year-questions",
    imageSrc: "https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxxdWVzdGlvbiUyMHBhcGVyfGVufDB8fHx8MTc1NjI3ODI4MHww&ixlib=rb-4.1.0&q=80&w=1080",
    imageHint: "question paper",
  },
]

export function StudyResources() {
  return (
    <section className="w-full py-8 md:py-16 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-primary">Study Resources</h2>
          <p className="text-muted-foreground mt-2 max-w-2xl mx-auto text-sm md:text-base">
            A diverse array of learning materials to enhance your educational journey.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {resources.map((resource, index) => (
             <Link href={resource.href} key={index} className="block h-full group">
                <Card className={`overflow-hidden shadow-md h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${resource.bgColor}`}>
                <CardContent className="p-6 flex flex-col h-full text-center">
                    <h3 className="text-lg font-bold mb-2">{resource.title}</h3>
                    <p className="text-muted-foreground text-xs mb-4 flex-grow">{resource.description}</p>
                     <div className="relative aspect-video w-full mb-4 overflow-hidden rounded-md">
                        <Image
                            src={resource.imageSrc}
                            alt={resource.title}
                            data-ai-hint={resource.imageHint}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                    </div>
                    <div className="mt-auto flex justify-center items-center">
                        <span className="font-semibold text-primary text-sm">Explore</span>
                        <ArrowRight className="ml-2 h-4 w-4 text-primary" />
                    </div>
                </CardContent>
                </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
