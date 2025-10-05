
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

const heroSlides = [
  { 
    src: "https://s3.ap-south-1.amazonaws.com/awsimages.imagesbazaar.com/1200x1800-old/15219/SM601012.jpg?date=Fri%20Oct%2003%202025%2023:12:28%20GMT+0530%20(India%20Standard%20Time)", 
    alt: "Happy students celebrating", 
    hint: "students celebrating",
    title: "Winds of Change 2019",
    description: "In the winds of change, we find our true direction."
  },
  { 
    src: "https://picsum.photos/seed/foundation2/1920/1080", 
    alt: "Children in a rural school", 
    hint: "children school",
    title: "Empowering Futures",
    description: "Providing quality education to underprivileged students."
  },
  { 
    src: "https://picsum.photos/seed/foundation3/1920/1080", 
    alt: "Volunteers helping the community", 
    hint: "volunteers community",
    title: "Community Upliftment",
    description: "Working together to build stronger communities."
  },
  {
    src: "https://picsum.photos/seed/foundation4/1920/1080",
    alt: "A single lightbulb glowing",
    hint: "idea lightbulb",
    title: "Igniting Minds",
    description: "Education is the most powerful weapon which you can use to change the world.",
  },
  {
    src: "https://picsum.photos/seed/foundation5/1920/1080",
    alt: "Hands holding a small plant",
    hint: "growth plant",
    title: "Nurturing Growth",
    description: "The foundation of every state is the education of its youth.",
  },
]

export function FoundationHero() {
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
          {heroSlides.map((slide, index) => (
            <CarouselItem key={index} className="h-full">
              <div className="relative w-full h-full">
                <Image 
                  src={slide.src} 
                  alt={slide.alt} 
                  data-ai-hint={slide.hint}
                  fill
                  className="object-cover"
                />
                 <div className="absolute inset-0 bg-black/70 z-0"></div>
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
        {heroSlides.map((_, i) => (
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

