
'use client';

import { Button } from "@/components/ui/button";
import { CheckCircle, Smartphone } from "lucide-react";
import Link from 'next/link';
import { Separator } from "../ui/separator";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from "../ui/carousel";
import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const heroSlides = [
  { 
    title: <>Your Future, <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-primary">Brightened.</span></>,
    description: "Join thousands of students achieving their dreams with our expert-led courses and personalized learning paths."
  },
  { 
    title: <>Unlock Your <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-primary">Potential.</span></>,
    description: "Discover a new way of learning that adapts to you, not the other way around."
  },
  { 
    title: <>Excellence in <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-primary">Education.</span></>,
    description: "Our commitment to quality education ensures you receive the best learning experience possible."
  },
]

export function HeroSection() {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)

  const autoplayPlugin = useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true, stopOnMouseEnter: true })
  );

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
    <section className="relative w-full bg-white dark:bg-background py-12 md:py-20 overflow-hidden">
      <Carousel 
        setApi={setApi}
        opts={{ loop: true }}
        plugins={[autoplayPlugin.current]} 
        className="w-full"
      >
        <CarouselContent>
          {heroSlides.map((slide, index) => (
            <CarouselItem key={index}>
              <div className="container mx-auto px-4 md:px-6">
                <div className="text-center">
                    <div className="space-y-4 text-foreground">
                        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tighter">
                           {slide.title}
                        </h1>
                        <p className="max-w-2xl mx-auto text-sm md:text-xl text-muted-foreground">
                            {slide.description}
                        </p>
                    </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      <div className="absolute bottom-4 left-0 right-0 z-20 flex justify-center gap-2">
        {heroSlides.map((_, i) => (
            <button
            key={i}
            onClick={() => scrollTo(i)}
            className={cn(
                "h-2 w-2 rounded-full transition-all",
                current === i ? "w-6 bg-primary" : "bg-muted-foreground/50"
            )}
            />
        ))}
    </div>
    </section>
  );
}
