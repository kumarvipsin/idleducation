'use client';

import { useEffect, useState, useCallback, useRef } from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselApi } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import type { TTestimonial } from "@/app/actions/types";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { GcsImage } from "../gcs-image";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog";
import { VideoModalDialogContent } from "@/components/ui/video-modal-dialog";
import { Play, ChevronLeft, ChevronRight } from "lucide-react";

const DURATIONS = ["2:35", "3:12", "2:18", "2:52", "3:05", "2:40", "3:15"];

const FALLBACK_TESTIMONIALS: TTestimonial[] = [
  {
    id: "star-1",
    name: "Ananya Verma",
    achievement: "Class 10",
    testimonial: "IDL’s regular tests and personal guidance really helped me stay on track.",
    avatarUrl: "https://storage.googleapis.com/idlcloud/testimonials/1768739625626-Gemini_Generated_Image_lrc5h4lrc5h4lrc5.png",
    videoId: "9MOum9jk6lQ",
    createdAt: new Date().toISOString(),
  },
  {
    id: "star-2",
    name: "Rohit Kumar",
    achievement: "Class 10",
    testimonial: "Doubt sessions and structured study plan at IDL made a big difference for me.",
    avatarUrl: "https://storage.googleapis.com/idlcloud/testimonials/1768739609684-Gemini_Generated_Image_xetos3xetos3xeto.png",
    videoId: "opUk9BeH_t8",
    createdAt: new Date().toISOString(),
  },
  {
    id: "star-3",
    name: "Sneha Yadav",
    achievement: "Class 10",
    testimonial: "The teachers at IDL always supported me at every step.",
    avatarUrl: "https://storage.googleapis.com/idlcloud/testimonials/1768739662958-Gemini_Generated_Image_upv06supv06supv0.png",
    videoId: "RH3gAxlv7wo",
    createdAt: new Date().toISOString(),
  },
  {
    id: "star-4",
    name: "Aman Singh",
    achievement: "Class 12",
    testimonial: "The study plan and doubt support at IDL helped me improve consistently.",
    avatarUrl: "https://storage.googleapis.com/idlcloud/testimonials/1768739647590-Gemini_Generated_Image_768s45768s45768s.png",
    videoId: "h-30HsxclVg",
    createdAt: new Date().toISOString(),
  },
  {
    id: "star-5",
    name: "Kavya Singh",
    achievement: "Class 12",
    testimonial: "Regular tests and personal attention at IDL gave me the confidence to do better.",
    avatarUrl: "https://storage.googleapis.com/idlcloud/testimonials/1768739625626-Gemini_Generated_Image_lrc5h4lrc5h4lrc5.png",
    videoId: "Xv7HlY4HUsk",
    createdAt: new Date().toISOString(),
  },
];

function getStoryButtonLabel(name: string): string {
  const firstName = name.trim().split(" ")[0].toLowerCase();
  const femaleNames = new Set([
    "ananya", "sneha", "kavya", "priya", "kirti", "pooja", "neha", "riya", 
    "shreya", "anjali", "divya", "isha", "tanvi", "simran", "aditi", "swati", 
    "shipra", "megha", "muskan", "khushi", "tanya", "palak", "mansi"
  ]);
  if (femaleNames.has(firstName)) return "Watch Her Story →";
  if (firstName.endsWith("a") || firstName.endsWith("i") || firstName.endsWith("ya")) {
    if (!["aman", "krishna", "rishi", "ravi", "ali"].includes(firstName)) {
      return "Watch Her Story →";
    }
  }
  return "Watch His Story →";
}

function formatStudentClass(achievement?: string): string {
  if (!achievement) return "Class 10";
  const ach = achievement.trim();
  if (/class\s*10|10th|cbse-10|cbse\s*10/i.test(ach)) return "Class 10";
  if (/class\s*12|12th|cbse-12|cbse\s*12|xii/i.test(ach)) return "Class 12";
  if (ach.toLowerCase().startsWith("class")) return ach;
  const parts = ach.split("|");
  return parts[0].trim() || "Class 10";
}

function cleanQuote(text: string): string {
  let q = text.trim();
  q = q.replace(/^["“']|["”']$/g, '').trim();
  return `“${q}”`;
}

const TestimonialCard = ({ testimonial, index }: { testimonial: TTestimonial; index: number }) => {
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  const duration = DURATIONS[index % DURATIONS.length];
  const storyLabel = getStoryButtonLabel(testimonial.name);
  const classLabel = formatStudentClass(testimonial.achievement);
  const quoteText = cleanQuote(testimonial.testimonial);
  const videoId = testimonial.videoId || "9MOum9jk6lQ";

  return (
    <>
      <div className="h-full w-full flex flex-col bg-white dark:bg-card text-foreground rounded-2xl overflow-hidden border border-slate-200/90 dark:border-border/60 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-md transition-all duration-200 group/card">
        {/* Photo Container — flush with card edges */}
        <div className="relative w-full aspect-[16/11] overflow-hidden bg-slate-100 dark:bg-muted shrink-0">
          <GcsImage
            filePath={testimonial.avatarUrl || "https://picsum.photos/seed/5/400/300"}
            alt={testimonial.name}
            fill
            className="object-cover transition-transform duration-300 ease-out group-hover/card:scale-[1.03]"
          />
          {/* Duration Pill Badge */}
          <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-[4px] bg-black/75 backdrop-blur-[2px] text-white text-[11px] font-semibold tracking-tight z-10 select-none">
            {duration}
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between relative bg-white dark:bg-card">
          {/* Watermark Quote Icon in top-right */}
          <svg
            className="absolute top-3.5 right-4 w-10 h-10 text-[#E8F0FE] dark:text-blue-950/40 select-none pointer-events-none"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
          </svg>

          {/* Testimonial Quote */}
          <p className="text-[13px] sm:text-[13.5px] text-[#334155] dark:text-slate-300 font-normal leading-[1.45] line-clamp-3 min-h-[58px] mb-3.5 relative z-10 antialiased">
            {quoteText}
          </p>

          {/* Student Name & Class */}
          <div className="mb-4">
            <h3 className="font-bold text-[16px] sm:text-[17px] text-[#0B1F4B] dark:text-white tracking-tight leading-snug mb-0.5 truncate">
              {testimonial.name}
            </h3>
            <p className="text-[12.5px] sm:text-[13px] text-[#64748B] dark:text-slate-400 font-medium leading-none">
              {classLabel}
            </p>
          </div>

          {/* Bottom Action Button */}
          <button
            type="button"
            onClick={() => setIsVideoOpen(true)}
            aria-label={`${storyLabel} - ${testimonial.name}`}
            className="w-full py-2.5 px-4 rounded-xl bg-[#0066FF] hover:bg-[#0052CC] active:scale-[0.99] text-white flex items-center justify-center gap-2 font-medium text-[13px] sm:text-[13.5px] shadow-xs transition-all duration-150 cursor-pointer"
          >
            <span className="w-[18px] h-[18px] rounded-full border-[1.5px] border-white flex items-center justify-center shrink-0">
              <Play className="w-2 h-2 fill-white text-white ml-[1px]" />
            </span>
            <span>{storyLabel}</span>
          </button>
        </div>
      </div>

      {/* Video Modal */}
      {videoId && (
        <Dialog open={isVideoOpen} onOpenChange={setIsVideoOpen}>
          <VideoModalDialogContent className="w-[min(calc(100vw-2.5rem),calc((84dvh)*9/16),420px)] aspect-[9/16] h-auto">
            <DialogHeader className="sr-only">
              <DialogTitle>{testimonial.name} - Success Story</DialogTitle>
              <DialogDescription>Video success story from a student.</DialogDescription>
            </DialogHeader>
            <div className="relative w-full h-full overflow-hidden">
              <iframe
                className="block w-full h-full border-0"
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`}
                title={`YouTube video player for ${testimonial.name}'s testimonial`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          </VideoModalDialogContent>
        </Dialog>
      )}
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
      try {
        api.plugins()?.autoplay?.stop();
      } catch {
        /* safe */
      }
    }
  }, [api]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (touchTimeoutRef.current) clearTimeout(touchTimeoutRef.current);
    };
  }, []);

  const canAutoplay = useCallback(() => {
    if (!api) return false;
    const snaps = api.scrollSnapList();
    return Boolean(snaps && snaps.length > 1);
  }, [api]);

  const handleMouseEnter = useCallback(() => {
    isHoveredRef.current = true;
    if (!canAutoplay()) return;
    try {
      api?.plugins()?.autoplay?.stop();
    } catch {
      /* safe */
    }
  }, [api, canAutoplay]);

  const handleMouseLeave = useCallback(() => {
    isHoveredRef.current = false;
    if (!canAutoplay()) return;
    try {
      api?.plugins()?.autoplay?.play();
    } catch {
      /* safe */
    }
  }, [api, canAutoplay]);

  const handleTouchStart = useCallback(() => {
    if (touchTimeoutRef.current) clearTimeout(touchTimeoutRef.current);
    if (!canAutoplay()) return;
    try {
      api?.plugins()?.autoplay?.stop();
    } catch {
      /* safe */
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
          /* safe */
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

  // Ensure we have at least 5 testimonials for rich display
  const rawList = testimonials && testimonials.length > 0 ? testimonials : [];
  const testimonialList = rawList.length >= 5 
    ? rawList 
    : [...rawList, ...FALLBACK_TESTIMONIALS.slice(rawList.length)];

  return (
    <section id="testimonials" className="relative w-full pt-8 sm:pt-10 md:pt-12 pb-8 sm:pb-10 md:pb-12 bg-[#F8FAFD]/60 dark:bg-background overflow-hidden">
      {/* Subtle ambient depth glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] sm:w-[960px] h-[340px] sm:h-[420px] bg-blue-500/[0.03] dark:bg-blue-500/[0.02] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/4 right-[10%] w-[320px] sm:w-[480px] h-[260px] bg-amber-500/[0.015] rounded-full blur-3xl pointer-events-none" />

      <div className="container relative z-10 mx-auto px-4 md:px-6 max-w-7xl">
        <div className="flex flex-col">
          <div className="text-center space-y-2.5 sm:space-y-3 mb-6 sm:mb-8 md:mb-10">
            <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight text-[#0B1F4B] dark:text-white">
              IDL{' '}
              <span className="relative inline-block text-[#1D4ED8] dark:text-blue-400">
                Stars
                {/* Curved Wave Line under Stars */}
                <span className="absolute -bottom-2 sm:-bottom-2.5 left-1/2 -translate-x-1/2 w-[72%] h-3 pointer-events-none select-none flex items-center" aria-hidden="true">
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 100 16" fill="none" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="idl-stars-swoosh" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#3B82F6" stopOpacity="0" />
                        <stop offset="30%" stopColor="#3B82F6" stopOpacity="0.45" />
                        <stop offset="70%" stopColor="#2563EB" stopOpacity="0.9" />
                        <stop offset="100%" stopColor="#1D4ED8" stopOpacity="1" />
                      </linearGradient>
                      <linearGradient id="idl-stars-swoosh-dark" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#60A5FA" stopOpacity="0" />
                        <stop offset="30%" stopColor="#60A5FA" stopOpacity="0.45" />
                        <stop offset="70%" stopColor="#3B82F6" stopOpacity="0.9" />
                        <stop offset="100%" stopColor="#60A5FA" stopOpacity="1" />
                      </linearGradient>
                    </defs>
                    <path d="M 6,8 C 28,1.5 72,14.5 94,8" stroke="url(#idl-stars-swoosh)" strokeWidth="2.5" strokeLinecap="round" vectorEffect="non-scaling-stroke" className="dark:hidden" />
                    <path d="M 6,8 C 28,1.5 72,14.5 94,8" stroke="url(#idl-stars-swoosh-dark)" strokeWidth="2.5" strokeLinecap="round" vectorEffect="non-scaling-stroke" className="hidden dark:inline" />
                  </svg>
                </span>
              </span>
            </h2>
            <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 font-medium max-w-2xl mx-auto">
              Celebrating the achievements of our bright and determined learners.
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-80 w-full rounded-2xl" />)}
            </div>
          ) : testimonialList.length > 0 ? (
            <div 
              className="relative w-full overflow-visible"
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
                  duration: 32,
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
                <CarouselContent className="-ml-3 sm:-ml-4 md:-ml-4 items-stretch">
                  {testimonialList.map((testimonial, index) => (
                    <CarouselItem 
                      key={testimonial.id || index} 
                      className="pl-3 sm:pl-4 md:pl-4 basis-[82%] min-[480px]:basis-[48%] md:basis-[33.33%] lg:basis-[25%] xl:basis-[20%] flex flex-col"
                    >
                      <div className="h-full flex flex-col flex-1">
                        <TestimonialCard testimonial={testimonial} index={index} />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>

              {/* Circular Prev/Next Arrow Buttons (Matching Screenshot) */}
              <button
                type="button"
                onClick={() => api?.scrollPrev()}
                className="hidden md:flex absolute -left-4 lg:-left-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white dark:bg-slate-900 shadow-md border border-slate-200/90 dark:border-slate-800 items-center justify-center text-slate-700 dark:text-slate-200 hover:text-[#0066FF] hover:scale-105 active:scale-95 transition-all cursor-pointer"
                aria-label="Previous testimonials"
              >
                <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
              </button>
              <button
                type="button"
                onClick={() => api?.scrollNext()}
                className="hidden md:flex absolute -right-4 lg:-right-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white dark:bg-slate-900 shadow-md border border-slate-200/90 dark:border-slate-800 items-center justify-center text-slate-700 dark:text-slate-200 hover:text-[#0066FF] hover:scale-105 active:scale-95 transition-all cursor-pointer"
                aria-label="Next testimonials"
              >
                <ChevronRight className="w-5 h-5 stroke-[2.5]" />
              </button>
              
              {/* Pagination Dots */}
              <div className="flex justify-center gap-1.5 sm:gap-2 mt-6 sm:mt-7">
                {testimonialList.map((_, i) => (
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
