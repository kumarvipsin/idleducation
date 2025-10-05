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
  
  return (
    <section className="relative w-full h-[36vh] md:h-[40vh] overflow-hidden">
      <Carousel 
        setApi={setApi}
        opts={{ loop: true }}
        plugins={[autoplayPlugin.current]} 
        className="w-full h-full"
      >
        <CarouselContent className="h-full">
          {slides.map((slide, index) => (
            <CarouselItem key={index} className="h-full">
              <div className="relative w-full h-full" style={{ background: 'linear-gradient(90deg, rgba(2, 0, 36, 1) 0%, rgba(9, 9, 121, 1) 35%, rgba(0, 212, 255, 1) 100%)' }}>
                 <div className="absolute inset-0 z-10 flex flex-col items-center justify-center">
                    <div className="container mx-auto px-4 md:px-6 flex-grow flex items-center justify-center">
                        <div className="grid lg:grid-cols-1 gap-8 items-center text-center">
                            <div className="space-y-4 text-white">
                                <h1 className="text-2xl md:text-5xl lg:text-6xl font-bold tracking-tighter">
                                   {slide.title}
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
          ))}
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
