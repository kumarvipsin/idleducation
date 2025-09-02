
'use client';

import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Book, BookCheck, FileText, StickyNote } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

const resources = [
  {
    icon: <Book className="w-8 h-8 text-primary" />,
    title: "Reference Books",
    description: "Our experts have created thorough study materials that break down complicated concepts into easily understandable content.",
    href: "/resources/reference-books",
  },
  {
    icon: <BookCheck className="w-8 h-8 text-primary" />,
    title: "NCERT Solutions",
    description: "Unlock academic excellence with Physics Wallah's NCERT Solutions which provides you step-by-step solutions",
    href: "/resources/ncert-solutions",
  },
  {
    icon: <StickyNote className="w-8 h-8 text-primary" />,
    title: "Notes",
    description: "Use Physics Wallah's detailed study materials that simplify complex ideas into easily understandable language.",
    href: "/resources/notes",
  },
  {
    icon: <FileText className="w-8 h-8 text-primary" />,
    title: "Previous Year Questions",
    description: "Practice with past exam papers to understand patterns and improve your time management for the actual exams.",
    href: "/resources/previous-year-questions",
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
                <Card className="overflow-hidden shadow-md h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-card">
                <CardContent className="p-6 flex flex-col h-full text-center items-center">
                    <div className="mb-4 bg-primary/10 p-4 rounded-full transition-transform duration-300 group-hover:scale-110">
                        {resource.icon}
                    </div>
                    <h3 className="text-lg font-bold mb-2">{resource.title}</h3>
                    <p className="text-muted-foreground text-sm mb-4 flex-grow">{resource.description}</p>
                    <div className="mt-auto flex justify-center items-center text-primary font-semibold group-hover:underline underline-offset-4">
                        <span className="text-sm">Explore</span>
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
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
