'use client';

import Image from "next/image";
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import React, { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";

const slides = [
  { src: "/banner.jpg", alt: "IDL Education Banner 1", hint: "education banner" },
  { src: "/banner.jpg", alt: "IDL Education Banner 2", hint: "education banner" }
];

export function BuildSkillsSection() {
    const [api, setApi] = useState<CarouselApi>();
    const [current, setCurrent] = useState(0);
 
    useEffect(() => {
        if (!api) {
        return;
        }
    
        setCurrent(api.selectedScrollSnap());
        api.on("select", () => {
        setCurrent(api.selectedScrollSnap());
        });
    }, [api]);

    const scrollTo = useCallback(
        (index: number) => {
        api?.scrollTo(index);
        },
        [api]
    );

    return (
        <section className="w-full bg-white dark:bg-black py-2">
        <div className="container mx-auto px-4 md:px-6 relative">
            <Carousel 
                setApi={setApi} 
                className="w-full" 
                plugins={[Autoplay({ delay: 3000, stopOnInteraction: false })]}
                opts={{ loop: true }}
            >
                <CarouselContent>
                    {slides.map((slide, index) => (
                        <CarouselItem key={index}>
                            <div className="relative w-full aspect-video md:aspect-[16/6] rounded-2xl overflow-hidden">
                                <Image 
                                    src={slide.src}
                                    alt={slide.alt}
                                    data-ai-hint={slide.hint}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        </CarouselItem>
                    ))}
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
