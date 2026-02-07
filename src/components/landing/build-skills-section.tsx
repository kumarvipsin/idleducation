'use client';

import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import type { THeroSlide } from "@/app/actions/types";
import { GcsImage } from "../gcs-image";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

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
                  {/* Overlay Content */}
                  <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white text-center p-6 md:p-12">
                    <div className="space-y-4 md:space-y-6 max-w-4xl animate-fade-in-up">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-[10px] font-bold uppercase tracking-[0.2em]">
                            <Sparkles className="w-3 h-3 text-yellow-400" />
                            Academic Excellence
                        </div>
                        <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold tracking-tight drop-shadow-lg">
                            {slide.title || "Build Skills That Shape Your Future"}
                        </h1>
                        <p className="text-sm md:text-lg text-white/90 font-medium max-w-2xl mx-auto drop-shadow-md">
                            {slide.description || "Join thousands of students achieving their dreams with our expert-led courses."}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
                            <Button asChild size="lg" className="rounded-full bg-primary hover:bg-primary/90 text-white font-bold h-12 px-8 shadow-2xl border-none active:scale-95 transition-all">
                                <Link href={slide.buttonLink || "/admission"}>
                                    {slide.buttonText || "Enroll Now"} <ArrowRight className="ml-2 h-5 w-5" />
                                </Link>
                            </Button>
                            <Button asChild size="lg" variant="outline" className="rounded-full bg-white/10 backdrop-blur-md border-white/30 text-white hover:bg-white hover:text-primary font-bold h-12 px-8 transition-all">
                                <Link href="/contact">Contact Us</Link>
                            </Button>
                        </div>
                    </div>
                  </div>
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
