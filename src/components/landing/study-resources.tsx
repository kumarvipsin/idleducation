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
import { ScrollArea } from "@/components/ui/scroll-area";

const resources = [
  {
    category: "REVISION",
    title: "Notes",
    description: "Find concise and well-structured notes designed for effective daily learning.",
    href: "/resources/notes",
    imageUrl: "https://ezeenotes.in/wp-content/uploads/2024/03/Book-Mockups-2-1-e1710253086447-1024x802.png",
    imageHint: "notebook pen",
    color: "bg-blue-600 text-white"
  },
  {
    category: "SOLUTIONS",
    title: "NCERT Solutions",
    description: "Access detailed solutions for all your NCERT textbook questions prepared by experts.",
    href: "/resources/ncert-solutions",
    imageUrl: "https://ezeenotes.in/wp-content/uploads/2024/03/Book-Mockups-2-1-e1710253086447-1024x802.png",
    imageHint: "textbooks pile",
    color: "bg-emerald-600 text-white"
  },
  {
    category: "PRACTICE",
    title: "Previous Year QP",
    description: "Practice with past exam papers to understand the pattern and score higher.",
    href: "/resources/previous-year-questions",
    imageUrl: "https://ezeenotes.in/wp-content/uploads/2024/03/Book-Mockups-2-1-e1710253086447-1024x802.png",
    imageHint: "exam paper test",
    color: "bg-orange-600 text-white"
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
    <section className="w-full py-6 md:py-10 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-gray-800 dark:text-white">
            Study{' '}
            <span className="relative inline-block">
              <span className="relative z-10">Resources</span>
              <div className="absolute -bottom-1 left-0 w-full h-3 z-0">
                <svg viewBox="0 0 100 15" preserveAspectRatio="none" className="w-full h-full text-blue-500 fill-none stroke-current stroke-[10] opacity-70">
                    <path d="M0,15 Q50,5 100,15" />
                </svg>
              </div>
            </span>
          </h2>
          <p className="text-sm text-muted-foreground mt-2 max-w-2xl mx-auto font-bold">
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
                  <CarouselItem key={index} className="pl-4 basis-[80%] md:basis-1/2 lg:basis-1/3">
                      <div className="p-1 h-full">
                          <Link href={resource.href} className="block h-full group">
                              <Card className="h-full flex flex-col shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white dark:bg-card text-foreground rounded-2xl overflow-hidden border-muted-foreground/10">
                                <CardContent className="p-4 flex flex-col text-left items-start">
                                    <div className="relative w-full aspect-square mb-4 rounded-2xl overflow-hidden bg-primary/5 p-8 flex items-center justify-center">
                                        <div className="relative w-full h-full">
                                            <Image
                                                src={resource.imageUrl}
                                                alt={resource.title}
                                                data-ai-hint={resource.imageHint}
                                                fill
                                                className="object-contain"
                                            />
                                        </div>
                                    </div>
                                    
                                    <h3 className="font-extrabold text-base tracking-tight mb-2 line-clamp-1">
                                        {resource.title}
                                    </h3>
                                    
                                    <div className="relative h-24 w-full">
                                        <span className="absolute top-0 left-0 text-4xl text-primary/10 font-serif -translate-y-2 -translate-x-1">“</span>
                                        <div className="h-full w-full px-2 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                                            <p className="text-xs text-muted-foreground font-bold leading-relaxed text-left">
                                                {resource.description}
                                            </p>
                                        </div>
                                        <span className="absolute bottom-0 right-0 text-4xl text-primary/10 font-serif translate-y-4 translate-x-1"></span>
                                    </div>
                                </CardContent>
                              </Card>
                          </Link>
                      </div>
                  </CarouselItem>
              ))}
          </CarouselContent>
      </Carousel>
      <div className="flex justify-center gap-1.5 mt-6">
            {resources.map((_, i) => (
                <button
                    key={i}
                    onClick={() => scrollTo(i)}
                    className={cn(
                        "h-1 w-1 rounded-full transition-all duration-300",
                        current === i ? "w-4 bg-primary" : "bg-muted-foreground/30"
                    )}
                />
            ))}
        </div>
      </div>
    </section>
  )
}