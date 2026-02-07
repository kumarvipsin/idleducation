'use client';

import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "../ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import type { THeroSlide } from "@/app/actions/types";
import { GcsImage } from "../gcs-image";

const defaultSlides: THeroSlide[] = [
  { 
    id: "default-1",
    imageUrl: "https://picsum.photos/seed/build-skills/1920/1080", 
    title: "Build Skills That Shape Your Future",
    description: "Join thousands of students achieving their dreams with our expert-led courses and personalized learning paths.",
    buttonText: "Enroll Now",
    buttonLink: "/admission",
    order: 1,
  },
];

export function BuildSkillsSection({ slides: initialSlides }: { slides: THeroSlide[] }) {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)

  const autoplayPlugin = useRef(
    Autoplay({ delay: 4000, stopOnInteraction: false, stopOnMouseEnter: true })
  );

  useEffect(() => {
    if (!api) return
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

  const displaySlides = initialSlides && initialSlides.length > 0 ? initialSlides : defaultSlides;

  return (
    <section className="w-full py-2 container mx-auto px-4 md:px-6 bg-white dark:bg-background">
      <div className="relative rounded-2xl overflow-hidden shadow-sm border border-border/50">
        <Carousel 
          setApi={setApi}
          opts={{ loop: true }}
          plugins={[autoplayPlugin.current]} 
          className="w-full"
        >
          <CarouselContent>
            {displaySlides.map((slide, index) => (
              <CarouselItem key={slide.id}>
                <div className="relative w-full aspect-video md:aspect-[16/6]">
                  <GcsImage
                    filePath={slide.imageUrl}
                    alt={slide.title || 'Educational Excellence'}
                    fill
                    className="object-cover"
                    priority={index === 0}
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
        
        {/* Carousel Indicators */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex justify-center gap-2">
          {displaySlides.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollTo(i)}
              className={cn(
                "h-2 w-2 rounded-full transition-all duration-300 shadow-sm",
                current === i ? "w-10 bg-white" : "bg-white/40 hover:bg-white/60"
              )}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}