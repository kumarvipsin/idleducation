'use client';

import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "../ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import type { THeroSlide } from "@/app/actions/types";
import { GcsImage } from "../gcs-image";
import Link from "next/link";

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
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  const autoplayPlugin = useRef(
    Autoplay({ delay: 4500, stopOnInteraction: false, stopOnMouseEnter: true })
  );

  useEffect(() => {
    if (!api) return;
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

  const displaySlides = (initialSlides && initialSlides.length > 0 ? initialSlides : defaultSlides)
    .slice()
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  return (
    <section suppressHydrationWarning className="w-full pt-0 pb-0 bg-white dark:bg-background">
      <div className="w-full px-0">
        <div className="relative w-full rounded-none overflow-hidden bg-[#06122E] [transform:translateZ(0)]">
          <Carousel 
            setApi={setApi}
            opts={{ loop: true }}
            plugins={[autoplayPlugin.current]} 
            className="w-full"
          >
            <CarouselContent>
              {displaySlides.map((slide, index) => {
                const link = slide.buttonLink || '/admission';

                return (
                  <CarouselItem key={slide.id} className="rounded-none overflow-hidden">
                    <Link
                      href={link}
                      className="block relative w-full select-none cursor-pointer overflow-hidden rounded-none [transform:translateZ(0)]"
                    >
                      {/* Mobile View (< 768px): Uses slide.mobileImageUrl if uploaded, else falls back to slide.imageUrl. Shows full-size vertical/mobile banner without cropping */}
                      <div className="block md:hidden relative w-full bg-[#06122E] overflow-hidden">
                        <GcsImage
                          filePath={slide.mobileImageUrl || slide.imageUrl}
                          alt={slide.title || 'Educational Excellence'}
                          asImgTag={true}
                          priority={index === 0}
                          className="w-full h-auto object-contain block mx-auto"
                          sizes="(max-width: 768px) 100vw, 768px"
                        />
                      </div>

                      {/* Desktop View (>= 768px): Uses slide.imageUrl - static image with no zoom on mouse hover */}
                      <div className="hidden md:block relative w-full aspect-[16/6] min-h-[360px] lg:min-h-[400px] xl:min-h-[440px] bg-[#06122E] overflow-hidden">
                        <GcsImage
                          filePath={slide.imageUrl}
                          alt={slide.title || 'Educational Excellence'}
                          fill
                          priority={index === 0}
                          className="object-cover object-center rounded-none"
                          sizes="(max-width: 1024px) 100vw, 1920px"
                        />
                      </div>
                    </Link>
                  </CarouselItem>
                );
              })}
            </CarouselContent>
          </Carousel>
          
          {/* Carousel Indicators: Positioned cleanly above overlapping course shelf */}
          {displaySlides.length > 1 && (
            <div className="absolute bottom-8 min-[390px]:bottom-10 sm:bottom-11 md:bottom-13 lg:bottom-16 left-1/2 -translate-x-1/2 z-20 flex justify-center gap-1.5 sm:gap-2 pointer-events-auto bg-black/25 backdrop-blur-xs px-2.5 py-1 rounded-full">
              {displaySlides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => scrollTo(i)}
                  className="p-3 flex items-center justify-center min-w-[44px] min-h-[44px] group"
                  aria-label={`Go to slide ${i + 1}`}
                >
                  <span
                    className={cn(
                      "rounded-full transition-all duration-300 shadow-sm",
                      current === i 
                        ? "h-2 w-8 sm:w-10 lg:w-12 bg-white" 
                        : "h-2 w-2 bg-white/40 group-hover:bg-white/60"
                    )}
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}