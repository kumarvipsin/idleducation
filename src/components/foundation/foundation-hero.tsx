
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
    Autoplay({ delay: 3000, stopOnInteraction: false, stopOnMouseEnter: true })
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
    <section className="py-2 container mx-auto px-4 md:px-6">
      <div className="relative rounded-2xl overflow-hidden">
        <Carousel 
          setApi={setApi}
          opts={{ loop: true }}
          plugins={[autoplayPlugin.current]} 
          className="w-full"
        >
          <CarouselContent>
            {slides.map((slide, index) => {
                return (
                  <CarouselItem key={index}>
                     <div className="relative w-full aspect-video md:aspect-[16/6]">
                        <Image
                            src={slide.imageUrl}
                            alt={slide.alt || slide.title}
                            data-ai-hint={slide.imageHint}
                            fill
                            className="object-cover"
                            priority={index === 0}
                        />
                    </div>
                  </CarouselItem>
              )})}
          </CarouselContent>
        </Carousel>
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex justify-center gap-2">
          {slides.map((_, i) => (
              <button
              key={i}
              onClick={() => scrollTo(i)}
              className={cn(
                  "h-2 w-2 rounded-full transition-all duration-300",
                  current === i ? "w-6 bg-white" : "bg-white/50"
              )}
              />
          ))}
      </div>
      </div>
    </section>
  );
}
