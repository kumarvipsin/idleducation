'use client';

import { useEffect, useState, useCallback, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselApi } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import type { TTestimonial } from "@/app/actions/types";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { GcsImage } from "../gcs-image";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog";
import { VideoModalDialogContent } from "@/components/ui/video-modal-dialog";
import { PlayCircle, Quote } from "lucide-react";

const TestimonialCard = ({ testimonial }: { testimonial: TTestimonial }) => {
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [isReadMoreOpen, setIsReadMoreOpen] = useState(false);

  const isLongTestimonial = testimonial.testimonial && testimonial.testimonial.length > 120;

  return (
    <>
      <Card
        className="h-full w-full flex flex-col shadow-[0_2px_10px_-2px_rgba(11,31,75,0.04)] hover:shadow-[0_8px_24px_-4px_rgba(11,31,75,0.08)] hover:-translate-y-0.5 transition-all duration-180 ease-out bg-white dark:bg-card text-foreground rounded-[18px] sm:rounded-[20px] overflow-hidden border border-slate-200/80 dark:border-border/60 group/card"
      >
          <CardContent className="p-3.5 sm:p-4 flex flex-col text-left items-start h-full justify-between flex-1 w-full">
              {/* Photo & Video Area */}
              <div className="relative w-full aspect-square mb-3 rounded-xl overflow-hidden bg-slate-100 dark:bg-muted flex items-center justify-center border border-slate-100 dark:border-border/30 shrink-0">
                  <GcsImage
                      filePath={testimonial.avatarUrl || "https://picsum.photos/seed/5/400/400"}
                      alt={testimonial.name}
                      fill
                      className="object-cover contrast-[1.03] transition-transform duration-180 ease-out group-hover/card:scale-[1.01]"
                  />
                  {/* Extremely soft subtle bottom gradient inside image for premium depth */}
                  <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />

                  {testimonial.videoId && (
                    <button 
                      type="button"
                      onClick={() => setIsVideoOpen(true)}
                      className="absolute bottom-2.5 right-2.5 transition-all duration-180 active:scale-95 group-hover/card:scale-105 z-10 p-1.5 rounded-full bg-black/45 hover:bg-black/65 backdrop-blur-sm text-white cursor-pointer shadow-md ring-1 ring-white/20 border border-white/10"
                      aria-label={`Watch ${testimonial.name}'s video story`}
                    >
                      <PlayCircle className="w-8 h-8 sm:w-9 sm:h-9" />
                    </button>
                  )}
              </div>

              {/* Student Name */}
              <h3 className="font-bold text-[17px] sm:text-[18px] text-[#0B1F4B] dark:text-white tracking-tight leading-snug mb-1.5 truncate w-full shrink-0">
                {testimonial.name}
              </h3>

              {/* Score / Achievement Badge: Slimmer & Lighter */}
              <div className="inline-flex items-center h-[22px] px-2 rounded-[4px] bg-blue-50/65 dark:bg-blue-950/25 text-[#1D4ED8] dark:text-blue-300 text-[10px] sm:text-[10.5px] font-semibold tracking-[0.03em] uppercase leading-none mb-3 sm:mb-3.5 border border-blue-100/50 dark:border-blue-900/25 shrink-0">
                  {testimonial.achievement}
              </div>

              {/* Testimonial Text & Read More: Fixed Height Area & Exact Same Baseline */}
              <div className="relative w-full flex-1 flex flex-col justify-between mt-auto">
                  {/* Fixed-height testimonial quote box: holds exactly 4 lines comfortably at 15px/1.5 leading */}
                  <div className="flex items-start gap-2 w-full h-[90px] sm:h-[94px] overflow-hidden">
                      <Quote className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#1D4ED8] dark:text-blue-400 shrink-0 mt-1 stroke-[1.75]" />
                      <blockquote className="text-[14px] sm:text-[15px] lg:text-[15.5px] text-slate-600 dark:text-slate-300 font-normal leading-[1.5] tracking-[-0.01em] text-left line-clamp-4 antialiased flex-1">
                          {testimonial.testimonial}
                      </blockquote>
                  </div>
                  
                  {/* Fixed Read More Row at exact same baseline with 14-16px top gap */}
                  <div className="h-6 sm:h-7 mt-3.5 sm:mt-4 flex items-center shrink-0">
                    {isLongTestimonial ? (
                      <button
                        type="button"
                        onClick={() => setIsReadMoreOpen(true)}
                        className="text-[13px] sm:text-[13.5px] font-semibold text-[#1D4ED8] hover:text-[#0B1F4B] dark:text-blue-400 dark:hover:text-blue-300 inline-flex items-center gap-1.5 transition-colors duration-150 cursor-pointer group/link"
                      >
                        <span>Read More</span>
                        <span className="transition-transform duration-150 ease-out group-hover/link:translate-x-1">→</span>
                      </button>
                    ) : (
                      <div className="invisible text-[13px] sm:text-[13.5px]">Placeholder</div>
                    )}
                  </div>
              </div>
          </CardContent>
      </Card>

      {/* Video Modal */}
      {testimonial.videoId && (
        <Dialog open={isVideoOpen} onOpenChange={setIsVideoOpen}>
          <VideoModalDialogContent className="w-[min(calc(100vw-2.5rem),calc((84dvh)*9/16),420px)] aspect-[9/16] h-auto">
              <DialogHeader className="sr-only">
                  <DialogTitle>{testimonial.name} - Success Story</DialogTitle>
                  <DialogDescription>Video success story from a student.</DialogDescription>
              </DialogHeader>
              <div className="relative w-full h-full overflow-hidden">
                <iframe
                    className="block w-full h-full border-0"
                    src={`https://www.youtube.com/embed/${testimonial.videoId}?autoplay=1&rel=0&modestbranding=1`}
                    title={`YouTube video player for ${testimonial.name}'s testimonial`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                ></iframe>
              </div>
          </VideoModalDialogContent>
        </Dialog>
      )}

      {/* Read More Modal */}
      <Dialog open={isReadMoreOpen} onOpenChange={setIsReadMoreOpen}>
        <DialogContent className="w-[92vw] sm:max-w-lg p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 shadow-xl">
          <DialogHeader className="text-left pb-2">
            <div className="flex items-center gap-3.5">
              <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-slate-200/80 dark:border-slate-800 bg-slate-100">
                <GcsImage
                  filePath={testimonial.avatarUrl || "https://picsum.photos/seed/5/400/400"}
                  alt={testimonial.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="space-y-0.5">
                <DialogTitle className="text-base sm:text-lg font-bold text-[#0B1F4B] dark:text-white">
                  {testimonial.name}
                </DialogTitle>
                <div className="inline-block px-2.5 py-0.5 rounded-md bg-blue-50 dark:bg-primary/10 text-[#1F4FA3] dark:text-blue-300 text-[11px] sm:text-[12px] font-bold uppercase tracking-wider border border-blue-100/80 dark:border-primary/20">
                  {testimonial.achievement}
                </div>
              </div>
            </div>
            <DialogDescription className="sr-only">
              Full testimonial from {testimonial.name}
            </DialogDescription>
          </DialogHeader>
          <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800/80">
            <div className="flex items-start gap-2 pt-1">
              <Quote className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#1D4ED8] dark:text-blue-400 stroke-[1.75] shrink-0 mt-1" />
              <blockquote className="text-[14.5px] sm:text-[15.5px] text-slate-700 dark:text-slate-300 font-medium leading-[1.5] tracking-tight antialiased text-left">
                {testimonial.testimonial}
              </blockquote>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export function StudentTestimonials({ testimonials }: { testimonials: TTestimonial[] }) {
  const [loading, setLoading] = useState(!testimonials);
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

  // Cleanup timeout on unmount
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

  // Hover pause handlers
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

  // Touch handlers for mobile
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
    }, 1200);
  }, [api, canAutoplay]);

  const scrollTo = useCallback(
    (index: number) => {
      api?.scrollTo(index);
    },
    [api]
  );
  
  useEffect(() => {
    if (testimonials) {
      setLoading(false);
    }
  }, [testimonials]);

  return (
    <section id="testimonials" className="relative w-full pt-12 sm:pt-14 md:pt-16 pb-10 sm:pb-12 md:pb-14 bg-gradient-to-b from-[#FCFBF8]/40 via-[#F6F8FC] to-[#F6F8FC] dark:bg-background overflow-hidden">
      {/* Subtle ambient depth glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] sm:w-[960px] h-[340px] sm:h-[420px] bg-blue-500/[0.03] dark:bg-blue-500/[0.02] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/4 right-[10%] w-[320px] sm:w-[480px] h-[260px] bg-amber-500/[0.015] rounded-full blur-3xl pointer-events-none" />

      <div className="container relative z-10 mx-auto px-4 md:px-6">
          <div className="flex flex-col">
              <div className="text-center space-y-2.5 sm:space-y-3 mb-6 sm:mb-7 md:mb-8">
                  <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                      IDL{' '}
                      <span className="relative inline-block">
                          <span className="relative z-10">Stars</span>
                          <div className="absolute -bottom-1 left-0 w-full h-3 z-0">
                              <svg viewBox="0 0 100 15" preserveAspectRatio="none" className="w-full h-full text-blue-500 fill-none stroke-current stroke-[10] opacity-70">
                                  <path d="M0,15 Q50,5 100,15" />
                              </svg>
                          </div>
                      </span>
                  </h2>
                  <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 font-bold max-w-2xl mx-auto">
                      Real Students. Real Progress. Real Stories.
                  </p>
              </div>

              {loading ? (
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-80 w-full rounded-[20px]" />)}
                 </div>
              ) : testimonials && testimonials.length > 0 ? (
                <div 
                  className="relative w-full max-w-6xl mx-auto overflow-hidden"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                  onTouchStart={handleTouchStart}
                  onTouchEnd={handleTouchEnd}
                  onFocusCapture={handleMouseEnter}
                  onBlurCapture={handleMouseLeave}
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
                              delay: 4500,
                              stopOnInteraction: false,
                              stopOnMouseEnter: true,
                          }),
                      ]}
                      className="w-full"
                  >
                      <CarouselContent className="-ml-4 sm:-ml-5 md:-ml-6 items-stretch">
                          {testimonials.map((testimonial, index) => (
                              <CarouselItem key={index} className="pl-4 sm:pl-5 md:pl-6 basis-[84%] sm:basis-[48%] lg:basis-1/3 flex flex-col">
                                  <div className="h-full flex flex-col flex-1">
                                      <TestimonialCard testimonial={testimonial} />
                                  </div>
                              </CarouselItem>
                          ))}
                      </CarouselContent>
                  </Carousel>
                  
                  <div className="flex justify-center gap-1.5 sm:gap-2 mt-6 sm:mt-7">
                      {testimonials.map((_, i) => (
                          <button
                              key={i}
                              onClick={() => scrollTo(i)}
                              className={cn(
                                  "h-1.5 rounded-full transition-all duration-300 shadow-xs cursor-pointer",
                                  current === i ? "w-6 sm:w-8 bg-[#0A225C] dark:bg-primary" : "w-1.5 sm:w-2 bg-slate-200 dark:bg-muted-foreground/30 hover:bg-slate-300"
                              )}
                              aria-label={`Go to slide ${i + 1}`}
                          />
                      ))}
                  </div>
                </div>
              ) : (
                <p className="text-center text-xs text-muted-foreground italic font-bold">New success stories coming soon!</p>
              )}
          </div>
        </div>
    </section>
  );
}
