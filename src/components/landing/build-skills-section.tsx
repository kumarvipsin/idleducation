
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

const defaultSlides = [
  { 
    id: "default-1",
    imageUrl: "https://picsum.photos/seed/build-skills/1920/1080", 
    alt: "Students with backpacks looking towards the sky", 
    hint: "students future skills",
    title: "",
    description: "Join thousands of students achieving their dreams with our expert-led courses and personalized learning paths.",
    buttonText: "Enroll Now",
    buttonLink: "/admission",
    order: 1,
  },
];


export function BuildSkillsSection({ slides: initialSlides }: { slides: THeroSlide[] }) {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)

  const slides = initialSlides.length > 0 ? initialSlides : defaultSlides;

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
    <section className="relative w-full aspect-video md:aspect-[16/7] lg:aspect-[16/7] overflow-hidden rounded-2xl">
      <Carousel 
        setApi={setApi}
        opts={{ loop: true }}
        plugins={[autoplayPlugin.current]} 
        className="w-full h-full"
      >
        <CarouselContent className="h-full">
          {slides.map((slide, index) => (
            <CarouselItem key={slide.id || index} className="h-full">
              <div className="relative w-full h-full flex flex-col items-center justify-center">
                 <GcsImage 
                  filePath={slide.imageUrl}
                  alt={slide.title}
                  fill
                  className="object-cover"
                />
                 <div className="absolute inset-0 bg-black/30 z-0"></div>
                 <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center p-4">
                     {slide.description && <p className="mt-4 max-w-2xl text-lg text-white/90 drop-shadow-md">{slide.description}</p>}
                     {slide.buttonText && slide.buttonLink && (
                        <Button asChild size="lg" className="mt-8">
                            <Link href={slide.buttonLink}>{slide.buttonText}</Link>
                        </Button>
                     )}
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      <div className="absolute bottom-6 left-0 right-0 z-20 flex justify-center gap-2">
        {slides.map((_, i) => (
            <button
            key={i}
            onClick={() => scrollTo(i)}
            className={cn(
                "h-2 w-2 rounded-full transition-all duration-300",
                current === i ? "w-8 bg-white" : "bg-white/50"
            )}
            />
        ))}
    </div>
    </section>
  );
}
