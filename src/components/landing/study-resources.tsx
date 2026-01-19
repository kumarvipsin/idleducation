'use client';

import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import React, { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";

const resources = [
  {
    category: "REVISION",
    title: "Notes",
    description: "Find concise and well-structured notes designed for quick revision.",
    href: "/resources/notes",
    imageUrl: "/notes.png",
    imageHint: "notebook pen",
  },
  {
    category: "TEXTBOOK HELP",
    title: "NCERT Solutions",
    description: "Access detailed, step-by-step solutions for all your NCERT textbook questions.",
    href: "/resources/ncert-solutions",
    imageUrl: "/notes.png",
    imageHint: "textbooks pile",
  },
  {
    category: "PRACTICE",
    title: "Previous YQP",
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
    const [api, setApi] = useState<CarouselApi>()
    const [current, setCurrent] = useState(0)

    useEffect(() => {
        if (!api) {
        return
        }
        setCurrent(api.selectedScrollSnap())
        api.on("select", () => {
        setCurrent(api.selectedScrollSnap())
        })
    }, [api])

    const scrollTo = useCallback(
        (index: number) => {
        api?.scrollTo(index);
        },
        [api]
    );

  return (
    <section className="w-full py-4 md:py-8 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-xl md:text-2xl font-black text-accent tracking-tight">Study Material</h2>
          <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
            Your one-stop destination for comprehensive and effective study materials.
          </p>
        </div>
       <Carousel
          setApi={setApi}
          opts={{
              align: "start",
              loop: true,
          }}
          plugins={[
              Autoplay({
                  delay: 5000,
                  stopOnInteraction: true,
              }),
          ]}
          className="w-full"
      >
          <CarouselContent className="-ml-4">
              {resources.map((resource, index) => (
                  <CarouselItem key={index} className="pl-4 md:basis-1/2 lg:basis-1/3">
                      <div className="p-1 h-full">
                          <Link href={resource.href} className="block h-full group">
                              <Card className="h-full rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col bg-card">
                              <CardContent className="p-8 flex-grow flex flex-col">
                                  
                                  <h3 className="text-xl font-bold mt-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">{resource.title}</h3>
                                  <p className="text-sm mt-2 text-muted-foreground flex-grow min-h-[5rem]">{resource.description}</p>
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
                      </div>
                  </CarouselItem>
              ))}
          </CarouselContent>
      </Carousel>
      <div className="flex justify-center gap-2 mt-8">
            {resources.map((_, i) => (
                <button
                    key={i}
                    onClick={() => scrollTo(i)}
                    className={cn(
                        "h-1.5 w-1.5 rounded-full transition-all duration-300",
                        current === i ? "w-6 bg-primary" : "bg-muted-foreground/50"
                    )}
                />
            ))}
        </div>
      </div>
    </section>
  )
}
