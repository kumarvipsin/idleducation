'use client';

import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { cn } from "@/lib/utils";

const resources = [
  {
    category: "REVISION NOTES",
    title: "Notes",
    description: "Comprehensive, simplified notes designed for conceptual clarity and quick exam revision.",
    href: "/resources/notes",
    imageUrl: "/notes.png",
    imageHint: "idl notes illustration",
    ctaText: "Explore Notes",
    // Notes: Blue + soft yellow accent
    badgeStyle: "bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-200/80 dark:border-amber-800/60",
    imgBgStyle: "bg-gradient-to-b from-blue-50/40 to-amber-50/50 dark:from-blue-950/20 dark:to-amber-950/20 border-amber-100/70 dark:border-amber-900/30",
    ctaStyle: "text-[#1F4FA3] group-hover:text-amber-600 dark:group-hover:text-amber-400",
    borderHover: "group-hover:border-amber-200 dark:group-hover:border-amber-800/60",
  },
  {
    category: "TEXTBOOK SOLUTIONS",
    title: "NCERT Solutions",
    description: "Step-by-step, expert-verified solutions for NCERT textbook exercises across all subjects.",
    href: "/resources/ncert-solutions",
    imageUrl: "/ncert.png",
    imageHint: "ncert solutions illustration",
    ctaText: "View Solutions",
    // NCERT Solutions: Blue + soft green accent
    badgeStyle: "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-200/80 dark:border-emerald-800/60",
    imgBgStyle: "bg-gradient-to-b from-blue-50/40 to-emerald-50/50 dark:from-blue-950/20 dark:to-emerald-950/20 border-emerald-100/70 dark:border-emerald-900/30",
    ctaStyle: "text-[#1F4FA3] group-hover:text-emerald-600 dark:group-hover:text-emerald-400",
    borderHover: "group-hover:border-emerald-200 dark:group-hover:border-emerald-800/60",
  },
  {
    category: "EXAM PRACTICE",
    title: "Previous Year QP",
    description: "Practice with the last 10 years of solved board and entrance question papers to master exam timing.",
    href: "/resources/previous-year-questions",
    imageUrl: "/pyq.png",
    imageHint: "previous year questions illustration",
    ctaText: "Practice PYQs",
    // Previous Year QP: Navy + soft orange accent
    badgeStyle: "bg-orange-50 dark:bg-orange-950/40 text-orange-800 dark:text-orange-300 border-orange-200/80 dark:border-orange-800/60",
    imgBgStyle: "bg-gradient-to-b from-slate-50 to-orange-50/50 dark:from-slate-900/40 dark:to-orange-950/20 border-orange-100/70 dark:border-orange-900/30",
    ctaStyle: "text-[#0B1F4B] group-hover:text-[#FF6B16] dark:group-hover:text-[#FF6B16]",
    borderHover: "group-hover:border-orange-200 dark:group-hover:border-orange-800/60",
  },
];

export function StudyResources() {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  const isHoveredRef = useRef(false);
  const touchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!api) {
      return;
    }
    setCurrent(api.selectedScrollSnap());
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  // Reduced motion preference check
  useEffect(() => {
    if (!api || typeof window === "undefined") return;
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mediaQuery.matches) {
      api.plugins()?.autoplay?.stop();
    }
  }, [api]);

  // Cleanup touch delay timer on unmount
  useEffect(() => {
    return () => {
      if (touchTimeoutRef.current) clearTimeout(touchTimeoutRef.current);
    };
  }, []);

  // Check if carousel actually has multiple slides to scroll
  const canAutoplay = useCallback(() => {
    if (!api) return false;
    const snaps = api.scrollSnapList();
    return Boolean(snaps && snaps.length > 1);
  }, [api]);

  // Hover handlers: immediate pause on hover, smooth resume on leave
  const handleMouseEnter = useCallback(() => {
    isHoveredRef.current = true;
    if (!canAutoplay()) return;
    try {
      api?.plugins()?.autoplay?.stop();
    } catch {
      // safe fallback
    }
  }, [api, canAutoplay]);

  const handleMouseLeave = useCallback(() => {
    isHoveredRef.current = false;
    if (!canAutoplay()) return;
    try {
      api?.plugins()?.autoplay?.play();
    } catch {
      // safe fallback
    }
  }, [api, canAutoplay]);

  // Touch handlers: pause during touch/swipe, resume after gentle delay
  const handleTouchStart = useCallback(() => {
    if (touchTimeoutRef.current) clearTimeout(touchTimeoutRef.current);
    if (!canAutoplay()) return;
    try {
      api?.plugins()?.autoplay?.stop();
    } catch {
      // safe fallback
    }
  }, [api, canAutoplay]);

  const handleTouchEnd = useCallback(() => {
    if (touchTimeoutRef.current) clearTimeout(touchTimeoutRef.current);
    if (!canAutoplay()) return;
    touchTimeoutRef.current = setTimeout(() => {
      if (!isHoveredRef.current && canAutoplay()) {
        try {
          api?.plugins()?.autoplay?.play();
        } catch {
          // safe fallback
        }
      }
    }, 2000);
  }, [api, canAutoplay]);

  const scrollTo = useCallback(
    (index: number) => {
      api?.scrollTo(index);
    },
    [api]
  );

  return (
    <section className="w-full pt-10 md:pt-12 pb-12 md:pb-16 bg-[#F8FAFC] dark:bg-[#080D1A] border-y border-slate-200/60 dark:border-slate-800/60">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col gap-8 md:gap-10">
          {/* Heading */}
          <div className="text-center space-y-2.5">
            <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Study{' '}
              <span className="relative inline-block">
                <span className="relative z-10">Resources</span>
                <div className="absolute -bottom-1 left-0 w-full h-3 z-0">
                  <svg viewBox="0 0 100 15" preserveAspectRatio="none" className="w-full h-full text-blue-500 fill-none stroke-current stroke-[10] opacity-70">
                    <path d="M0,15 Q50,5 100,15" />
                  </svg>
                </div>
              </span>
            </h2>
            <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 font-bold max-w-2xl mx-auto">
              Notes, NCERT Solutions &amp; Previous Year Questions — all in one place.
            </p>
          </div>

          {/* Carousel Container with Hover & Touch Pause */}
          <div 
            className="w-full"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <Carousel
              setApi={setApi}
              opts={{
                align: "start",
                loop: true,
                duration: 35,
              }}
              plugins={[
                Autoplay({
                  delay: 4000,
                  stopOnInteraction: false,
                  stopOnMouseEnter: true,
                }),
              ]}
              className="w-full"
            >
              <CarouselContent className="-ml-4">
                {resources.map((resource, index) => (
                  <CarouselItem key={index} className="pl-4 basis-[calc(100%-14px)] sm:basis-[80%] md:basis-1/2 lg:basis-1/3">
                    <div className="p-1 h-full">
                      <Link href={resource.href} className="block h-full group">
                        <Card className={cn(
                          "h-full flex flex-col bg-white dark:bg-slate-900 text-foreground rounded-2xl overflow-hidden border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1.5",
                          resource.borderHover
                        )}>
                          <CardContent className="p-4 sm:p-5 flex flex-col flex-1 text-left items-start">
                            {/* Top Tag & Info */}
                            <div className="flex items-center justify-between w-full mb-3">
                              <span className={cn(
                                "inline-flex items-center px-2.5 py-0.5 rounded-md text-[10px] sm:text-[11px] font-bold uppercase tracking-wider border",
                                resource.badgeStyle
                              )}>
                                {resource.category}
                              </span>
                              <span className="text-[10px] font-medium text-slate-400/80 dark:text-slate-500/80 tracking-tight">Free Access</span>
                            </div>

                            {/* Reduced Height Container (-25-30%) with +15-20% Visual Presence */}
                            <div className={cn(
                              "relative w-full h-44 sm:h-48 rounded-xl overflow-hidden mb-3.5 p-2 flex items-center justify-center border",
                              resource.imgBgStyle
                            )}>
                              <div className="relative w-full h-full transition-transform duration-300 ease-out group-hover:scale-105">
                                <Image
                                  src={resource.imageUrl}
                                  alt={resource.title}
                                  data-ai-hint={resource.imageHint}
                                  fill
                                  className="object-contain drop-shadow-sm"
                                />
                              </div>
                            </div>
                            
                            {/* Title */}
                            <h3 className="font-extrabold text-base sm:text-lg tracking-tight text-[#0B1F4B] dark:text-white mb-1.5 line-clamp-1 group-hover:text-primary transition-colors">
                              {resource.title}
                            </h3>
                            
                            {/* Description with balanced spacing */}
                            <p className="text-xs sm:text-[13px] text-slate-600 dark:text-slate-400 font-semibold leading-relaxed line-clamp-2 sm:line-clamp-3 mb-4 flex-1">
                              {resource.description}
                            </p>

                            {/* Resource CTA */}
                            <div className="mt-auto pt-3 border-t border-slate-100 dark:border-slate-800/80 w-full flex items-center justify-between">
                              <span className={cn(
                                "text-xs sm:text-sm font-bold transition-colors flex items-center gap-1.5",
                                resource.ctaStyle
                              )}>
                                <span>{resource.ctaText}</span>
                                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                              </span>
                              <span className="text-[10px] font-medium text-slate-400/80 dark:text-slate-500/80 tracking-tight">Instant PDF</span>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </div>
          
          {/* Pagination Dots */}
          <div className="flex justify-center gap-2 mt-2">
            {resources.map((_, i) => (
              <button
                key={i}
                onClick={() => scrollTo(i)}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-300 cursor-pointer",
                  current === i ? "w-8 bg-primary" : "w-2 bg-muted-foreground/20 hover:bg-muted-foreground/40"
                )}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
