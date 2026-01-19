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
import useEmblaCarousel from "embla-carousel-react"

const defaultSlides = [
  { 
    id: "default-1",
    imageUrl: "", 
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

  const slides = (initialSlides.length > 0 ? initialSlides : defaultSlides).filter((_, index) => index !== 1);

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
    <section className="relative w-full aspect-[2.5/1] md:aspect-[16/6] overflow-hidden">
      <Carousel 
        setApi={setApi}
        opts={{ loop: slides.length > 1 }}
        plugins={[autoplayPlugin.current]} 
        className="w-full h-full"
      >
        <CarouselContent className="h-full">
          {slides.map((slide, index) => (
            <CarouselItem key={slide.id || index} className="h-full">
              <div className="relative w-full h-full flex flex-col items-center justify-center">
                 <Image src="/banner.jpg" alt={slide.alt || "IDL Education Banner"} fill className="object-cover" />
                 <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center p-4">
                     <div className="text-white [text-shadow:0_2px_4px_rgba(0,0,0,0.5)]">
                        {slide.description && <p className="mt-2 text-sm md:text-lg max-w-2xl drop-shadow-md">{slide.description}</p>}
                     </div>
                     {slide.buttonText && slide.buttonLink && (
                        <Button asChild size="sm" className="mt-4 h-8 px-4 text-xs md:h-11 md:px-8 md:text-base md:mt-8">
                            <Link href={slide.buttonLink}>{slide.buttonText}</Link>
                        </Button>
                     )}
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      {slides.length > 1 && (
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
      )}
    </section>
  );
}
