
'use client';

import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, BookOpen } from "lucide-react";
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
    description: "Master your subjects with our comprehensive, simplified notes designed to enhance conceptual clarity and accelerate your exam revision.",
    href: "/resources/notes",
    imageUrl: "https://ezeenotes.in/wp-content/uploads/2024/03/Book-Mockups-2-1-e1710253086447-1024x802.png",
    imageHint: "notebook pen",
    color: "bg-blue-600 text-white"
  },
  {
    category: "SOLUTIONS",
    title: "NCERT Solutions",
    description: "Excel in your school exams with step-by-step, expert-verified solutions for every NCERT textbook exercise across all subjects.",
    href: "/resources/ncert-solutions",
    imageUrl: "https://ezeenotes.in/wp-content/uploads/2024/03/Book-Mockups-2-1-e1710253086447-1024x802.png",
    imageHint: "textbooks pile",
    color: "bg-emerald-600 text-white"
  },
  {
    category: "PRACTICE",
    title: "Previous Year QP",
    description: "Gain a competitive edge by practicing with the last 10 years of solved board and entrance exam question papers to master time management.",
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
    <section className="w-full py-12 md:py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col gap-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="space-y-4 text-left">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-primary/20">
                            <BookOpen className="w-5 h-5 text-white" />
                        </div>
                        <h2 className="text-2xl md:text-3xl font-black tracking-tighter text-foreground uppercase italic">Study Resources</h2>
                    </div>
                    <p className="text-sm text-muted-foreground font-bold max-w-xl">
                        Your one-stop destination for comprehensive and effective study materials.
                    </p>
                </div>
                
                <div className="hidden md:flex gap-2">
                    {resources.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => scrollTo(i)}
                            className={cn(
                                "h-1.5 rounded-full transition-all duration-300",
                                current === i ? "w-8 bg-primary" : "w-2 bg-muted-foreground/20 hover:bg-muted-foreground/40"
                            )}
                            aria-label={`Go to slide ${i + 1}`}
                        />
                    ))}
                </div>
            </div>

            <Carousel
                setApi={setApi}
                opts={{
                    align: "start",
                    loop: true,
                    dragFree: true,
                }}
                plugins={[
                    Autoplay({
                        delay: 3500,
                        stopOnInteraction: false,
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
                                                <div className="h-full w-full overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                                                    <p className="text-xs text-muted-foreground font-bold leading-relaxed text-left">
                                                        {resource.description}
                                                    </p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
            </Carousel>
            
            <div className="flex justify-center gap-1.5 mt-2 md:hidden">
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
      </div>
    </section>
  )
}
