
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

const heroImages = [
  { src: "https://picsum.photos/seed/hero1/1920/1080", alt: "Students learning in a modern classroom", hint: "students classroom" },
  { src: "https://picsum.photos/seed/hero2/1920/1080", alt: "A student focused on a difficult problem", hint: "student studying" },
  { src: "https://picsum.photos/seed/hero3/1920/1080", alt: "A group of happy students celebrating success", hint: "students success" },
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
    <section className="relative w-full h-[60vh] md:h-[40vh] overflow-hidden">
      <Carousel 
        setApi={setApi}
        opts={{ loop: true }}
        plugins={[autoplayPlugin.current]} 
        className="w-full h-full"
      >
        <CarouselContent className="h-full">
          {heroImages.map((image, index) => (
            <CarouselItem key={index} className="h-full">
              <div className="relative w-full h-full">
                <Image 
                  src={image.src} 
                  alt={image.alt} 
                  data-ai-hint={image.hint}
                  fill
                  className="object-cover"
                />
                 <div className="absolute inset-0 bg-primary/80 bg-gradient-to-br from-[#070A52]/90 via-[#070A52]/80 to-accent/90 z-0"></div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center">
        <div className="container mx-auto px-4 md:px-6 flex-grow flex items-center justify-center">
            <div className="grid lg:grid-cols-1 gap-8 items-center text-center">
                <div className="space-y-4 text-white">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter">
                       Your Future, <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-amber-500">Brightened.</span>
                    </h1>
                    <p className="max-w-2xl mx-auto text-lg md:text-xl text-white/90">
                        Join thousands of students achieving their dreams with our expert-led courses and personalized learning paths.
                    </p>
                </div>
            </div>
        </div>
         <div className="flex justify-center gap-2 pb-4">
            {heroImages.map((_, i) => (
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
      </div>
    </section>
  );
}
