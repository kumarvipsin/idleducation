'use client';

import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";

const activities = [
  {
    title: "English Speaking Course",
    imageUrl: "https://s3.ap-south-1.amazonaws.com/s3.idleducation.com/idl-foundation/english-speaking.jpeg",
    imageHint: "students classroom",
  },
  {
    title: "Computer Training",
    imageUrl: "https://s3.ap-south-1.amazonaws.com/s3.idleducation.com/idl-foundation/computer-training.jpeg",
    imageHint: "computer lab",
  },
  {
    title: "Mid Day Meal",
    imageUrl: "https://s3.ap-south-1.amazonaws.com/s3.idleducation.com/idl-foundation/mid-day-meal.jpeg",
    imageHint: "children eating",
  },
  {
    title: "Braille Resource Library",
    imageUrl: "https://s3.ap-south-1.amazonaws.com/s3.idleducation.com/idl-foundation/braille-library.jpeg",
    imageHint: "library books",
  },
];

export function Activities() {
    const [api, setApi] = useState<CarouselApi>()
    const [current, setCurrent] = useState(0)
    
    useEffect(() => {
        if (!api) {
          return
        }
     
        setCurrent(api.selectedScrollSnap() + 1)
        api.on("select", () => {
          setCurrent(api.selectedScrollSnap() + 1)
        })
      }, [api])

    const scrollTo = useCallback(
        (index: number) => {
        api?.scrollTo(index);
        },
        [api]
    );

  return (
    <section className="w-full py-16 md:py-24 bg-white dark:bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="rounded-2xl bg-white dark:bg-card p-6 md:p-8 border">
            <div className="text-center mb-12">
            <p className="text-sm font-semibold tracking-wider text-muted-foreground uppercase">
                IDL FOUNDATION ACTIVITIES
            </p>
            <h2 className="text-4xl md:text-5xl font-black text-foreground leading-tight mt-2">
                Our <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">Activities</span>
            </h2>
            </div>
            <Carousel setApi={setApi} opts={{ align: "center", loop: true }} className="w-full">
                <CarouselContent className="-ml-4">
                {activities.map((activity, index) => (
                    <CarouselItem key={index} className="pl-4 md:basis-1/2 lg:basis-1/4">
                    <div className="p-1">
                        <div className="flex flex-col items-center gap-4">
                            <div className="relative w-48 h-48 sm:w-56 sm:h-56 transform -rotate-6 transition-transform duration-300 hover:rotate-0 hover:scale-105">
                                <Image
                                src={activity.imageUrl}
                                alt={activity.title}
                                data-ai-hint={activity.imageHint}
                                fill
                                className="object-cover rounded-lg shadow-lg"
                                />
                            </div>
                            <h3 className="text-lg font-bold text-center">{activity.title}</h3>
                        </div>
                    </div>
                    </CarouselItem>
                ))}
                </CarouselContent>
            </Carousel>
            <div className="flex justify-center gap-2 mt-8">
                {activities.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => scrollTo(i)}
                        className={cn(
                            "h-2 w-2 rounded-full transition-all duration-300",
                            (current -1) % activities.length === i ? "w-4 bg-primary" : "bg-muted-foreground/50"
                        )}
                    />
                ))}
            </div>
        </div>
      </div>
    </section>
  );
}
