
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
    src: "https://picsum.photos/seed/hero1/1920/1080", 
    alt: "Students learning in a modern classroom", 
    hint: "students classroom",
    title: <>Your Future, <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-amber-500">Brightened.</span></>,
    description: "Join thousands of students achieving their dreams with our expert-led courses and personalized learning paths."
  },
  { 
    src: "https://picsum.photos/seed/hero2/1920/1080", 
    alt: "A student focused on a difficult problem", 
    hint: "student studying",
    title: <>Unlock Your <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-amber-500">Potential.</span></>,
    description: "Discover a new way of learning that adapts to you, not the other way around."
  },
  { 
    src: "https://picsum.photos/seed/hero3/1920/1080", 
    alt: "A group of happy students celebrating success", 
    hint: "students success",
    title: <>Excellence in <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-amber-500">Education.</span></>,
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
    <section className="relative w-full h-[28vh] md:h-[32vh] overflow-hidden bg-black">
      <Carousel 
        setApi={setApi}
        opts={{ loop: true }}
        plugins={[autoplayPlugin.current]} 
        className="w-full h-full"
      >
        <CarouselContent className="h-full">
          {heroSlides.map((slide, index) => (
            <CarouselItem key={index} className="h-full">
              <div className="relative w-full h-full">
                <Image 
                  src={slide.src} 
                  alt={slide.alt} 
                  data-ai-hint={slide.hint}
                  fill
                  className="object-cover opacity-30"
                />
                 <div className="absolute inset-0 z-10 flex flex-col items-center justify-center">
                    <div className="container mx-auto px-4 md:px-6 flex-grow flex items-center justify-center">
                        <div className="grid lg:grid-cols-1 gap-8 items-center text-center">
                            <div className="space-y-4 text-white">
                                <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tighter">
                                   {slide.title}
                                </h1>
                                <p className="max-w-2xl mx-auto text-base md:text-xl text-white/90">
                                    {slide.description}
                                </p>
                            </div>
                        </div>
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
                current === i ? "w-6 bg-white" : "bg-white/50"
            )}
            />
        ))}
    </div>
    </section>
  );
}
