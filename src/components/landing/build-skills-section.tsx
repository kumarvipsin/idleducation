
'use client';

import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "../ui/carousel";
import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import type { THeroSlide } from "@/app/actions/types";
import { GcsImage } from "../gcs-image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const defaultSlides = [
  { 
    id: "default-1",
    imageUrl: "/banner.jpg", 
    alt: "Students with backpacks looking towards the sky", 
    hint: "students future skills",
    title: "Build Skills That Shape Your Future.",
    description: "Join thousands of students achieving their dreams with our expert-led courses and personalized learning paths.",
    buttonText: "Enroll Now",
    buttonLink: "/admission",
    order: 1,
  },
];

export function BuildSkillsSection({ slides: initialSlides }: { slides: THeroSlide[] }) {
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
    <section className="relative w-full h-screen overflow-hidden">
      <Carousel
        setApi={setApi}
        opts={{ loop: true }}
        plugins={[Autoplay({ delay: 3000, stopOnInteraction: false })]}
        className="w-full h-full"
      >
        <CarouselContent className="h-full">
          {(initialSlides.length > 0 ? initialSlides : defaultSlides).map((slide) => (
            <CarouselItem key={slide.id} className="h-full">
              <div className="relative w-full h-full">
                <GcsImage
                  filePath={slide.imageUrl}
                  alt={slide.title || 'Hero Image'}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
                  <div className="space-y-4 text-white">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter">
                       {slide.title}
                    </h1>
                    <p className="max-w-2xl mx-auto text-base md:text-xl text-white/90">
                        {slide.description}
                    </p>
                    <Button asChild size="lg" className="rounded-full">
                      <Link href={slide.buttonLink || '#'}>
                        {slide.buttonText || 'Learn More'}
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      <div className="absolute bottom-8 left-0 right-0 z-20 flex justify-center gap-2">
            {(initialSlides.length > 0 ? initialSlides : defaultSlides).map((_, i) => (
                <button
                key={i}
                onClick={() => scrollTo(i)}
                className={cn(
                    "h-2 w-2 rounded-full transition-all",
                    current === i ? "w-8 bg-white" : "bg-white/50"
                )}
                />
            ))}
      </div>
    </section>
  );
}
