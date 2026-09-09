'use client';

/**
 * Toppers' Talk — Premium Vertical Video Showcase (YouTube Shorts Style)
 *
 * Exact 3-step interaction:
 *  1. RESTING STATE (Clean Front Look):
 *     - Each card independently displays its full poster image
 *     - Big prominent bold message text at bottom + Student Name, Class
 *     - NO play button, NO Shorts icon
 *
 *  2. HOVER STATE (Mouse Over A Specific Video):
 *     - ONLY that hovered card's bottom text disappears (isHovered = true)
 *     - ONLY that hovered card's center Red YouTube Shorts icon appears
 *     - ALL other cards remain 100% untouched with their text visible
 *
 *  3. PLAY STATE (Click on Video):
 *     - ONLY that clicked video plays inline inside its card slot
 *     - ALL other videos remain resting
 *     - Clicking close (✕) returns only that card back to clean resting state
 */

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import type { TTopperTestimonial } from "@/app/actions/types";
import { X } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import Autoplay from "embla-carousel-autoplay";

import { TopperStoryCard } from "./topper-story-card";

// ── Main Section Component ────────────────────────────────────────────────
export function TopperTestimonialsClient({ testimonials }: { testimonials: TTopperTestimonial[] }) {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);

  // Active playing video ID — only one video can play at a time
  const [activeVideoId, setActiveVideoId] = React.useState<string | null>(null);

  // Sort testimonials by display order if defined
  const sortedTestimonials = React.useMemo(() => {
    return [...testimonials].sort((a, b) => {
      const orderA = a.order ?? 999;
      const orderB = b.order ?? 999;
      return orderA - orderB;
    });
  }, [testimonials]);

  React.useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());

    const onSelect = () => {
      setCurrent(api.selectedScrollSnap());
    };

    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  const scrollTo = React.useCallback(
    (index: number) => {
      api?.scrollTo(index);
    },
    [api]
  );

  if (!sortedTestimonials || sortedTestimonials.length === 0) {
    return null;
  }

  return (
    <section className="relative w-full py-8 sm:py-10 md:py-12 bg-white dark:bg-background overflow-hidden">
      {/* Subtle brand ambiance */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[900px] h-[320px] bg-blue-500/[0.03] dark:bg-blue-500/[0.02] rounded-full blur-3xl pointer-events-none" />

      <div className="container relative z-10 mx-auto px-4 md:px-6 max-w-7xl">
        <div className="flex flex-col">
          {/* ── Section Heading ── */}
          <div className="text-center space-y-2 mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-[#0B1F4B] dark:text-white">
              Stories of our{' '}
              <span className="relative inline-block text-[#1D4ED8] dark:text-blue-400">
                Brightest Stars!
                {/* ── Curved Wave Line under Brightest Stars! (reduced suitable length + single distinct wave) ── */}
                <span
                  className="absolute -bottom-2 sm:-bottom-2.5 left-1/2 -translate-x-1/2 w-[115px] sm:w-[135px] h-3 pointer-events-none select-none flex items-center"
                  aria-hidden="true"
                >
                  <svg
                    className="w-full h-full overflow-visible"
                    viewBox="0 0 100 16"
                    fill="none"
                    preserveAspectRatio="none"
                  >
                    <defs>
                      <linearGradient id="brightest-stars-swoosh" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#3B82F6" stopOpacity="0" />
                        <stop offset="20%" stopColor="#3B82F6" stopOpacity="0.4" />
                        <stop offset="60%" stopColor="#2563EB" stopOpacity="0.9" />
                        <stop offset="100%" stopColor="#1D4ED8" stopOpacity="1" />
                      </linearGradient>
                      <linearGradient id="brightest-stars-swoosh-dark" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#60A5FA" stopOpacity="0" />
                        <stop offset="20%" stopColor="#60A5FA" stopOpacity="0.4" />
                        <stop offset="60%" stopColor="#3B82F6" stopOpacity="0.9" />
                        <stop offset="100%" stopColor="#60A5FA" stopOpacity="1" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M 6,8 C 28,1.5 72,14.5 94,8"
                      stroke="url(#brightest-stars-swoosh)"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      vectorEffect="non-scaling-stroke"
                      className="dark:hidden"
                    />
                    <path
                      d="M 6,8 C 28,1.5 72,14.5 94,8"
                      stroke="url(#brightest-stars-swoosh-dark)"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      vectorEffect="non-scaling-stroke"
                      className="hidden dark:inline"
                    />
                  </svg>
                  <span className="absolute -right-2 sm:-right-2.5 top-1/2 -translate-y-1/2 rotate-[14deg] text-[#F59E0B]">
                    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-[#F59E0B] stroke-[#F59E0B] stroke-[1] stroke-linejoin-round">
                      <path d="M12 2l2.9 6.26 6.86.73-5.1 4.62 1.43 6.75L12 17l-6.09 3.36 1.43-6.75-5.1-4.62 6.86-.73L12 2z" />
                    </svg>
                  </span>
                </span>
              </span>
            </h2>
            <p className="text-sm md:text-[15px] text-slate-500 dark:text-slate-400 font-medium max-w-xl mx-auto">
              Real journeys and inspiring experiences shared by our proud students and parents.
            </p>
          </div>

          {/* ── Vertical Story Carousel ── */}
          <div className="relative">
            <Carousel
              setApi={setApi}
              opts={{
                align: "start",
                loop: true,
                dragFree: true,
              }}
              plugins={[
                Autoplay({
                  delay: 2800,
                  stopOnInteraction: false,
                  stopOnMouseEnter: true,
                }),
              ]}
              className="w-full"
            >
              <CarouselContent className="-ml-3 sm:-ml-4 scroll-smooth snap-x snap-mandatory">
                {sortedTestimonials.map((testimonial, index) => {
                  const cardId = testimonial.id || testimonial.videoId || String(index);
                  const isPlaying = activeVideoId === cardId;

                  return (
                    <CarouselItem
                      key={cardId}
                      className="pl-3 sm:pl-4 basis-[44%] min-[360px]:basis-[43%] min-[410px]:basis-[40%] sm:basis-[30%] md:basis-[25%] lg:basis-[20%] snap-start shrink-0"
                    >
                      <TopperStoryCard
                        testimonial={testimonial}
                        isPlaying={isPlaying}
                        onPlay={() => setActiveVideoId(cardId)}
                        onClose={() => setActiveVideoId(null)}
                      />
                    </CarouselItem>
                  );
                })}
              </CarouselContent>
            </Carousel>

            {/* ── Compact Pagination (● ━ ● ● ● ●) ── */}
            {count > 1 && (
              <div className="flex justify-center items-center gap-1.5 mt-5 sm:mt-6">
                {Array.from({ length: count }).map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => scrollTo(i)}
                    className={cn(
                      "h-1.5 rounded-full transition-all duration-300 cursor-pointer focus-visible:outline-none",
                      current === i
                        ? "w-7 sm:w-8 bg-[#0B1F4B] dark:bg-[#1D4ED8]"
                        : "w-1.5 sm:w-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300"
                    )}
                    aria-label={`Go to slide ${i + 1}`}
                  />
                ))}
              </div>
            )}

            {/* ── View More Student Stories CTA ── */}
            <div className="mt-7 sm:mt-8 flex justify-center">
              <Link
                href="/idl-stars"
                className="inline-flex items-center justify-center gap-2 h-11 px-6 rounded-[10px] bg-white hover:bg-blue-50/70 dark:bg-slate-900/80 dark:hover:bg-blue-950/40 text-[#1D4ED8] dark:text-blue-300 font-semibold text-sm border border-blue-200/80 dark:border-blue-800/60 shadow-2xs hover:shadow-xs transition-all duration-200 group cursor-pointer"
              >
                <span>View More Student Stories</span>
                <span className="transition-transform duration-180 ease-out group-hover:translate-x-0.5" aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
