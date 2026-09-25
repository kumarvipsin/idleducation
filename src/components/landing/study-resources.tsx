'use client';

import React, { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { cn } from "@/lib/utils";

interface ResourceItem {
  id: string;
  title: string;
  description: string;
  href: string;
  imageUrl: string;
  imageHint: string;
  ctaText: string;
}

const resources: ResourceItem[] = [
  {
    id: "revision-notes",
    title: "Revision Notes",
    description: "Concise notes for concepts and quick revision.",
    href: "/resources/notes",
    imageUrl: "/notes.png",
    imageHint: "revision notes illustration",
    ctaText: "Explore Notes",
  },
  {
    id: "ncert-solutions",
    title: "NCERT Solutions",
    description: "Step-by-step solutions for NCERT exercises.",
    href: "/resources/ncert-solutions",
    imageUrl: "/ncert.png",
    imageHint: "ncert solutions illustration",
    ctaText: "Explore Solutions",
  },
  {
    id: "previous-year-qp",
    title: "Previous Year QP",
    description: "Solved previous-year papers for better exam practice.",
    href: "/resources/previous-year-questions",
    imageUrl: "/pyq.png",
    imageHint: "previous year questions illustration",
    ctaText: "Practice PYQs",
  },
];

function ResourceCard({ resource }: { resource: ResourceItem }) {
  return (
    <Link href={resource.href} className="group block h-full select-none">
      <div className="h-full flex flex-col bg-white dark:bg-slate-900 rounded-[22px] border border-slate-200/80 dark:border-slate-800 shadow-[0_2px_12px_-4px_rgba(6,43,103,0.06)] hover:shadow-[0_12px_28px_-6px_rgba(6,43,103,0.12)] hover:-translate-y-1.5 transition-all duration-300 overflow-hidden p-4 sm:p-5">
        
        {/* Consistent Top Image Container — unified light background, subtle border, rounded frame */}
        <div className="relative w-full aspect-[16/11] sm:aspect-[16/10] rounded-[16px] overflow-hidden bg-[#F0F5FD] dark:bg-slate-800/80 border border-[#E0ECFB] dark:border-slate-700/60 p-3.5 flex items-center justify-center mb-4 sm:mb-4.5">
          <div className="relative w-full h-full transition-transform duration-300 ease-out group-hover:scale-[1.04]">
            <Image
              src={resource.imageUrl}
              alt={resource.title}
              data-ai-hint={resource.imageHint}
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 text-left">
          {/* Title */}
          <h3 className="font-bold text-[18px] sm:text-[19px] lg:text-[20px] tracking-tight text-[#0A1E42] dark:text-white mb-1.5 group-hover:text-[#1D4ED8] dark:group-hover:text-blue-400 transition-colors">
            {resource.title}
          </h3>

          {/* Short, concise description */}
          <p className="text-[13px] sm:text-[13.5px] text-[#4A5568] dark:text-slate-300 font-normal leading-relaxed mb-4 flex-1 line-clamp-2">
            {resource.description}
          </p>

          {/* Clean CTA with arrow */}
          <div className="pt-1 mt-auto">
            <span className="inline-flex items-center gap-1.5 text-[13.5px] sm:text-[14px] font-semibold text-[#1D4ED8] dark:text-blue-400 group-hover:text-[#062B67] dark:group-hover:text-blue-300 transition-colors">
              <span>{resource.ctaText}</span>
              <ArrowRight className="w-4 h-4 stroke-[2.2] transition-transform duration-200 group-hover:translate-x-1" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export function StudyResources() {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  const isHoveredRef = useRef(false);
  const touchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!api) return;
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

  const handleMouseEnter = useCallback(() => {
    isHoveredRef.current = true;
    try {
      api?.plugins()?.autoplay?.stop();
    } catch {
      /* safe fallback */
    }
  }, [api]);

  const handleMouseLeave = useCallback(() => {
    isHoveredRef.current = false;
    try {
      api?.plugins()?.autoplay?.play();
    } catch {
      /* safe fallback */
    }
  }, [api]);

  const handleTouchStart = useCallback(() => {
    if (touchTimeoutRef.current) clearTimeout(touchTimeoutRef.current);
    try {
      api?.plugins()?.autoplay?.stop();
    } catch {
      /* safe fallback */
    }
  }, [api]);

  const handleTouchEnd = useCallback(() => {
    if (touchTimeoutRef.current) clearTimeout(touchTimeoutRef.current);
    touchTimeoutRef.current = setTimeout(() => {
      if (!isHoveredRef.current) {
        try {
          api?.plugins()?.autoplay?.play();
        } catch {
          /* safe fallback */
        }
      }
    }, 1200);
  }, [api]);

  const scrollTo = useCallback(
    (index: number) => {
      api?.scrollTo(index);
    },
    [api]
  );

  return (
    <section className="w-full py-6 sm:py-8 md:py-10 bg-white dark:bg-background relative z-20">
      <div className="container mx-auto px-4 sm:px-5 md:px-6 max-w-7xl">
        
        {/* Section Header */}
        <div className="text-center mb-6 sm:mb-8 md:mb-10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-[#0A1E42] dark:text-white leading-[1.15]">
            Study{' '}
            <span className="text-[#1D4ED8] dark:text-blue-400">
              Resources
            </span>
          </h2>
        </div>

        {/* ── DESKTOP: Equal 3-Column Grid ── */}
        <div className="hidden md:grid md:grid-cols-3 gap-6 lg:gap-7 items-stretch">
          {resources.map((resource) => (
            <ResourceCard key={resource.id} resource={resource} />
          ))}
        </div>

        {/* ── MOBILE: Proper Horizontal Carousel (1 Full Card visible at a time, zero clipping) ── */}
        <div 
          className="md:hidden w-full max-w-[380px] sm:max-w-md mx-auto"
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
              duration: 25,
            }}
            plugins={[
              Autoplay({
                delay: 4000,
                stopOnInteraction: false,
                stopOnMouseEnter: true,
              }),
            ]}
            className="w-full overflow-hidden"
          >
            <CarouselContent className="-ml-0 items-stretch">
              {resources.map((resource) => (
                <CarouselItem key={resource.id} className="pl-0 basis-full flex flex-col">
                  <div className="w-full p-0.5">
                    <ResourceCard resource={resource} />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>

          {/* Clean Pagination Dots */}
          <div className="flex justify-center gap-1.5 mt-4 sm:mt-5">
            {resources.map((_, i) => (
              <button
                key={i}
                onClick={() => scrollTo(i)}
                className="p-1.5 flex items-center justify-center min-w-[28px] min-h-[28px] cursor-pointer group/dot"
                aria-label={`Go to resource ${i + 1}`}
              >
                <span
                  className={cn(
                    "rounded-full transition-all duration-300",
                    (current % resources.length) === i
                      ? "w-6 h-2 bg-[#1D4ED8]"
                      : "w-2 h-2 bg-slate-300 dark:bg-slate-700 group-hover:bg-slate-400"
                  )}
                />
              </button>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
