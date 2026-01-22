'use client';

import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel";
import { useCallback, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const localSlides = [
  {
    id: "local-1",
    imageUrl: "/bannerr.jpg",
    alt: "IDL Education Banner",
  },
  {
    id: "local-2",
    imageUrl: "/bannerr.jpg",
    alt: "IDL Education Banner Alternate",
  },
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
    <section className="py-2 container mx-auto px-4 md:px-6">
        <div className="relative rounded-2xl overflow-hidden">
            <Carousel
              setApi={setApi}
              plugins={[ Autoplay({ delay: 3000, stopOnInteraction: false }) ]}
              className="w-full"
              opts={{ loop: true }}
            >
                <CarouselContent>
                    {localSlides.map((slide, index) => (
                        <CarouselItem key={slide.id}>
                            <div className="relative w-full aspect-video md:aspect-[16/6]">
                                <Image
                                    src={slide.imageUrl}
                                    alt={slide.alt}
                                    fill
                                    className="object-cover"
                                    priority={index === 0}
                                />
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
            </Carousel>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex justify-center gap-2">
                {localSlides.map((_, i) => (
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
