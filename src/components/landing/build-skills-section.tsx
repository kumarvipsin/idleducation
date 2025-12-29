'use client';

import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "../ui/carousel";
import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

const slides = [
  { 
    src: "https://picsum.photos/seed/build-skills/1920/1080", 
    alt: "Students with backpacks looking towards the sky", 
    hint: "students future skills",
    title: <>Build Skills That Shape<br/> Your Future.</>,
    buttonText: "Enroll Now"
  },
  { 
    src: "https://picsum.photos/seed/discover-passion/1920/1080", 
    alt: "A student engaged in a creative activity", 
    hint: "student engaged hobby",
    title: <>Discover Your Passion. <br/>Ignite Your Career.</>,
    buttonText: "Explore Courses"
  },
  { 
    src: "https://picsum.photos/seed/career-ready/1920/1080", 
    alt: "A young professional working on a laptop", 
    hint: "young professional",
    title: <>From Classroom to <br/>Career-Ready.</>,
    buttonText: "Get Started"
  },
];

export function BuildSkillsSection() {
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
    <section className="relative w-full h-[60vh] md:h-[70vh] overflow-hidden rounded-2xl">
      <Carousel 
        setApi={setApi}
        opts={{ loop: true }}
        plugins={[autoplayPlugin.current]} 
        className="w-full h-full"
      >
        <CarouselContent className="h-full">
          {slides.map((slide, index) => (
            <CarouselItem key={index} className="h-full">
              <div className="relative w-full h-full flex flex-col items-center justify-center">
                <Image 
                  src={slide.src} 
                  alt={slide.alt} 
                  data-ai-hint={slide.hint}
                  fill
                  className="object-cover"
                />
                 <div className="absolute inset-0 bg-black/30 z-0"></div>
                 <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center p-4">
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white drop-shadow-lg">
                       {slide.title}
                    </h1>
                    <Button className="mt-8 rounded-full h-12 px-8 text-base font-bold bg-white text-primary hover:bg-gray-200 shadow-lg transition-transform hover:scale-105">
                        {slide.buttonText}
                        <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
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
