'use client';

import React, { useEffect, useCallback, useRef } from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselApi } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import type { TExpertTeacher } from "@/app/actions/types";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { EducatorCard } from "./educator-card";

interface EducatorsCarouselProps {
  teachers: TExpertTeacher[];
  loading?: boolean;
  setApi?: (api: CarouselApi) => void;
  api?: CarouselApi;
  current: number;
  count: number;
  scrollTo: (index: number) => void;
}

export function EducatorsCarousel({
  teachers,
  loading = false,
  setApi,
  api,
  current,
  count,
  scrollTo,
}: EducatorsCarouselProps) {
  const isHoveredRef = useRef(false);
  const touchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!api || typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      api.plugins()?.autoplay?.stop();
    }
  }, [api]);

  useEffect(() => () => {
    if (touchTimeoutRef.current) clearTimeout(touchTimeoutRef.current);
  }, []);

  const canScroll = useCallback(() => Boolean((api?.scrollSnapList()?.length ?? 0) > 1), [api]);

  const handleMouseEnter = useCallback(() => {
    isHoveredRef.current = true;
    try {
      api?.plugins()?.autoplay?.stop();
    } catch {
      /* safe */
    }
  }, [api]);

  const handleMouseLeave = useCallback(() => {
    isHoveredRef.current = false;
    if (!canScroll()) return;
    try {
      api?.plugins()?.autoplay?.play();
    } catch {
      /* safe */
    }
  }, [api, canScroll]);

  const handleTouchStart = useCallback(() => {
    if (touchTimeoutRef.current) clearTimeout(touchTimeoutRef.current);
    try {
      api?.plugins()?.autoplay?.stop();
    } catch {
      /* safe */
    }
  }, [api]);

  const handleTouchEnd = useCallback(() => {
    if (touchTimeoutRef.current) clearTimeout(touchTimeoutRef.current);
    if (!canScroll()) return;
    touchTimeoutRef.current = setTimeout(() => {
      if (!isHoveredRef.current) {
        try {
          api?.plugins()?.autoplay?.play();
        } catch {
          /* safe */
        }
      }
    }, 1200);
  }, [api, canScroll]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-[380px] w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (teachers.length === 0) {
    return (
      <p className="text-center text-sm text-muted-foreground italic font-medium py-10">
        Faculty profiles coming soon!
      </p>
    );
  }

  return (
    <div
      className="relative w-full overflow-hidden"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onFocusCapture={handleMouseEnter}
      onBlurCapture={handleMouseLeave}
    >
      <Carousel
        setApi={setApi}
        opts={{ align: "start", loop: true, duration: 32 }}
        plugins={[Autoplay({ delay: 4500, stopOnInteraction: false, stopOnMouseEnter: true })]}
        className="w-full"
      >
        <CarouselContent className="-ml-3 sm:-ml-4 items-stretch">
          {teachers.map((teacher, index) => (
            <CarouselItem
              key={teacher.id || index}
              className="pl-3 sm:pl-4 basis-[82%] sm:basis-1/2 md:basis-1/3 lg:basis-1/4 flex flex-col"
            >
              <div className="h-full flex flex-col flex-1">
                <EducatorCard teacher={teacher} />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {/* Pagination dots */}
      <div className="flex justify-center items-center gap-2 mt-3 sm:mt-4">
        {Array.from({ length: count }).map((_, i) => (
          <button
            key={i}
            onClick={() => scrollTo(i)}
            aria-label={`Go to educator slide ${i + 1}`}
            className="p-3 flex items-center justify-center min-w-[44px] min-h-[44px] cursor-pointer group"
          >
            <span
              className={cn(
                "rounded-full transition-all duration-300",
                current === i
                  ? "w-8 sm:w-10 h-2.5 bg-[#062B67]"
                  : "w-2.5 h-2.5 bg-slate-300/70 group-hover:bg-slate-400"
              )}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
