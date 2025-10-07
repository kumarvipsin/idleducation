
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

interface Slide {
  imageUrl: string;
  imageHint: string;
  alt?: string;
  title: string;
  description: string;
}

export function FoundationHero({ slides }: { slides: Slide[] }) {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)

  const autoplayPlugin = useRef(
    Autoplay({ delay: 3000, stopOnInteraction: false, stopOnMouseEnter: false })
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
  
  const splitTitle = (title: string) => {
    const words = title.split(' ');
    if (words.length <= 1) {
      return { part1: '', part2: title };
    }
    const splitIndex = Math.ceil(words.length / 2);
    const part1 = words.slice(0, splitIndex).join(' ');
    const part2 = words.slice(splitIndex).join(' ');
    return { part1, part2 };
  };

  return (
    <section className="relative w-full h-[25vh] md:h-[40vh] overflow-hidden bg-blue-600">
      <Carousel 
        setApi={setApi}
        opts={{ loop: true }}
        plugins={[autoplayPlugin.current]} 
        className="w-full h-full"
      >
        <CarouselContent className="h-full">
          {slides.map((slide, index) => {
              const { part1, part2 } = splitTitle(slide.title);
              return (
                <CarouselItem key={index} className="h-full">
                  <div className="relative w-full h-full flex flex-col items-center justify-center">
                    <Image 
                      src={slide.imageUrl} 
                      alt={slide.alt || slide.title} 
                      data-ai-hint={slide.imageHint}
                      fill
                      className="object-cover"
                    />
                     <div className="absolute inset-0 bg-primary/80 bg-gradient-to-br from-[#070A52]/90 via-[#070A52]/80 to-accent/90 z-0"></div>
                     <div className="absolute inset-0 z-10 flex flex-col items-center justify-center">
                        <div className="container mx-auto px-4 md:px-6 flex-grow flex items-center justify-center">
                            <div className="grid lg:grid-cols-1 gap-8 items-center text-center">
                                <div className="space-y-4 text-white">
                                    <h1 className="text-2xl md:text-5xl lg:text-6xl font-bold tracking-tighter">
                                        <span>{part1} </span>
                                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-amber-500">
                                            {part2}
                                        </span>
                                    </h1>
                                    <p className="max-w-2xl mx-auto text-sm md:text-xl text-white/90">
                                        {slide.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                  </div>
                </CarouselItem>
            )})}
        </CarouselContent>
      </Carousel>
      <div className="absolute bottom-4 left-0 right-0 z-20 flex justify-center gap-2">
        {slides.map((_, i) => (
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
