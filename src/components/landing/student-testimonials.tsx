'use client';

import React, { useEffect, useState, useCallback, useRef } from "react";
import Image from "next/image";
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import type { TTestimonial } from "@/app/actions/types";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Dialog, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { VideoModalDialogContent } from "@/components/ui/video-modal-dialog";
import { Play, ArrowRight } from "lucide-react";

/* ═══════════════════════════════════════════════════════════════════════
   DEFAULT STORIES DATA — Exact content & structure from reference
   ═══════════════════════════════════════════════════════════════════════ */
const DEFAULT_STORIES: TTestimonial[] = [
  {
    id: "star-kartik",
    name: "Kartik Goel",
    achievement: "Class 12",
    testimonial: "Class 12 was a crucial year for me, and IDL EDUCATION gave me the right guidance, regular practice and constant support. The teachers always cleared my doubts and helped me stay focused.",
    avatarUrl: "/images/results/idl-student-boy.jpg",
    videoId: "9MOum9jk6lQ",
    createdAt: new Date().toISOString(),
  },
  {
    id: "star-gauri",
    name: "Gauri Shukla",
    achievement: "Class 10",
    testimonial: "The teachers at IDL EDUCATION made even difficult topics easy to understand and always encouraged me.",
    avatarUrl: "/images/results/idl-student-girl.jpg",
    videoId: "opUk9BeH_t8",
    createdAt: new Date().toISOString(),
  },
  {
    id: "star-aditya",
    name: "Aditya Singh",
    achievement: "Class 10",
    testimonial: "Regular tests and personal guidance at IDL helped me improve a lot and build confidence in my preparation.",
    avatarUrl: "/images/results/idl-student-boy.jpg",
    videoId: "RH3gAxlv7wo",
    createdAt: new Date().toISOString(),
  },
  {
    id: "star-kirti",
    name: "Kirti Mishra",
    achievement: "Class 10",
    testimonial: "Before joining IDL, I felt lost with so many chapters, but the teachers here guided me step by step and made learning easy.",
    avatarUrl: "/images/results/idl-student-girl.jpg",
    videoId: "h-30HsxclVg",
    createdAt: new Date().toISOString(),
  },
  {
    id: "star-priya",
    name: "Priya Sharma",
    achievement: "Class 12",
    testimonial: "What I appreciated most about IDL EDUCATION during my Class 12 journey was the balance they maintained between teaching and revision. Every concept was reinforced until we had total clarity.",
    avatarUrl: "/images/results/idl-student-girl.jpg",
    videoId: "Xv7HlY4HUsk",
    createdAt: new Date().toISOString(),
  },
];

function formatStudentClass(achievement?: string): string {
  if (!achievement) return "Class 10";
  const ach = achievement.trim();
  if (/class\s*12|12th|cbse-12|cbse\s*12|xii/i.test(ach)) return "Class 12";
  if (/class\s*10|10th|cbse-10|cbse\s*10/i.test(ach)) return "Class 10";
  if (ach.toLowerCase().startsWith("class")) return ach;
  const parts = ach.split("|");
  return parts[0].trim() || "Class 10";
}

function cleanQuote(text: string): string {
  if (!text) return "";
  let q = text.trim();
  q = q.replace(/^["'“”„‟«»]+|["'“”„‟«»]+$/g, '').trim();
  return q;
}

/* ═══════════════════════════════════════════════════════════════════════
   SAFE STUDENT AVATAR — Ensures images never break or show grey box
   ═══════════════════════════════════════════════════════════════════════ */
const StudentAvatar = ({ 
  src, 
  alt, 
  fallbackSrc = "/images/results/idl-student-boy.jpg",
  className 
}: { 
  src?: string; 
  alt: string; 
  fallbackSrc?: string;
  className?: string; 
}) => {
  const [imgSrc, setImgSrc] = useState<string>(() => {
    if (!src || src.startsWith("http") && src.includes("storage.googleapis.com")) {
      return fallbackSrc;
    }
    return src;
  });

  return (
    <Image
      src={imgSrc}
      alt={alt}
      fill
      unoptimized
      onError={() => setImgSrc(fallbackSrc)}
      className={cn("object-cover object-top", className)}
      priority={false}
    />
  );
};

/* ═══════════════════════════════════════════════════════════════════════
   FEATURED STORY CARD (DESKTOP LEFT)
   ═══════════════════════════════════════════════════════════════════════ */
const FeaturedStoryCard = ({ testimonial }: { testimonial: TTestimonial }) => {
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const classLabel = formatStudentClass(testimonial.achievement);
  const quoteText = cleanQuote(testimonial.testimonial);
  const videoId = testimonial.videoId || "9MOum9jk6lQ";
  const fallback = testimonial.name?.toLowerCase().includes("priya") || testimonial.name?.toLowerCase().includes("gauri") || testimonial.name?.toLowerCase().includes("kirti")
    ? "/images/results/idl-student-girl.jpg"
    : "/images/results/idl-student-boy.jpg";

  return (
    <>
      <div className="group/featured flex flex-row h-full w-full bg-white dark:bg-slate-900 rounded-[22px] overflow-hidden border border-slate-200/80 dark:border-slate-800 shadow-[0_2px_14px_rgba(10,30,66,0.04)] hover:shadow-[0_6px_22px_rgba(10,30,66,0.08)] transition-all duration-300">
        
        {/* Left Side: Student Portrait Image */}
        <div className="p-3 sm:p-3.5 w-[46%] xl:w-[47%] h-full shrink-0 flex">
          <div 
            className="relative w-full h-full rounded-[16px] overflow-hidden bg-[#E9F0FA] dark:bg-slate-800 cursor-pointer"
            onClick={() => setIsVideoOpen(true)}
          >
            <StudentAvatar
              src={testimonial.avatarUrl}
              fallbackSrc={fallback}
              alt={testimonial.name}
              className="transition-transform duration-500 ease-out group-hover/featured:scale-[1.03]"
            />

            {/* Premium Frosted Glass Play Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsVideoOpen(true);
              }}
              aria-label={`Watch story of ${testimonial.name}`}
              className="absolute bottom-3 right-3 z-30 w-11 h-11 rounded-full bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border border-white/70 dark:border-slate-700/70 shadow-[0_4px_12px_rgba(0,0,0,0.12)] flex items-center justify-center hover:bg-white/80 hover:scale-105 active:scale-95 transition-all cursor-pointer group/btn"
            >
              <Play className="w-4 h-4 fill-[#155EEF] text-[#155EEF] ml-0.5 transition-transform group-hover/btn:scale-110" />
            </button>
          </div>
        </div>

        {/* Right Side: Quote & Student Identity */}
        <div className="flex flex-col justify-center flex-1 p-5 sm:p-6 lg:p-7 relative min-w-0 bg-white dark:bg-slate-900">
          {/* Large Quotation Mark Graphic */}
          <svg
            className="w-10 h-10 text-[#DDE9F8] dark:text-blue-950/40 mb-3 select-none pointer-events-none shrink-0"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
          </svg>

          {/* Testimonial Quote */}
          <div className="relative z-10 min-w-0">
            <blockquote className="mb-3.5">
              <p className="text-[14px] sm:text-[14.5px] lg:text-[15px] font-normal text-[#1E293B] dark:text-slate-200 leading-[1.55] tracking-normal">
                {quoteText}
              </p>
            </blockquote>

            {/* Student Name & Class */}
            <div className="flex items-center gap-1.5 flex-wrap min-w-0">
              <h3 className="font-bold text-[15.5px] sm:text-[16px] text-[#062B67] dark:text-white tracking-tight leading-snug">
                {testimonial.name}
              </h3>
              <span className="text-slate-300 dark:text-slate-600 font-normal select-none">|</span>
              <span className="text-[13px] sm:text-[13.5px] text-[#64748B] dark:text-slate-400 font-normal">
                {classLabel}
              </span>
            </div>
          </div>
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

/* ═══════════════════════════════════════════════════════════════════════
   COMPACT STORY CARD (DESKTOP RIGHT)
   ═══════════════════════════════════════════════════════════════════════ */
const CompactStoryCard = ({ 
  testimonial, 
  onSelect 
}: { 
  testimonial: TTestimonial; 
  onSelect?: () => void;
}) => {
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const classLabel = formatStudentClass(testimonial.achievement);
  const quoteText = cleanQuote(testimonial.testimonial);
  const videoId = testimonial.videoId || "9MOum9jk6lQ";
  const fallback = testimonial.name?.toLowerCase().includes("gauri") || testimonial.name?.toLowerCase().includes("kirti") || testimonial.name?.toLowerCase().includes("priya")
    ? "/images/results/idl-student-girl.jpg"
    : "/images/results/idl-student-boy.jpg";

  return (
    <>
      <div 
        className="group/compact flex-1 min-h-0 flex flex-row bg-white dark:bg-slate-900 rounded-[16px] overflow-hidden border border-slate-200/80 dark:border-slate-800 shadow-[0_1px_8px_rgba(10,30,66,0.03)] hover:shadow-[0_4px_16px_rgba(10,30,66,0.07)] hover:-translate-y-[1px] transition-all duration-200 cursor-pointer"
        onClick={() => {
          if (onSelect) {
            onSelect();
          } else {
            setIsVideoOpen(true);
          }
        }}
      >
        {/* Thumbnail on Left */}
        <div className="p-2 sm:p-2.5 shrink-0 flex items-center">
          <div className="relative w-[82px] sm:w-[88px] h-[78px] sm:h-[84px] rounded-[12px] overflow-hidden bg-[#E9F0FA] dark:bg-slate-800">
            <StudentAvatar
              src={testimonial.avatarUrl}
              fallbackSrc={fallback}
              alt={testimonial.name}
              className="transition-transform duration-300 group-hover/compact:scale-105"
            />
          </div>
        </div>

        {/* Text Content on Right */}
        <div className="flex flex-col justify-center flex-1 py-2 pr-3.5 pl-1 min-w-0">
          {/* Testimonial Quote */}
          <p className="text-[12.5px] sm:text-[13px] text-[#334155] dark:text-slate-200 font-normal leading-[1.42] mb-1.5">
            {quoteText}
          </p>
          {/* Student Identity */}
          <div className="flex items-center gap-1.5 flex-wrap min-w-0">
            <span className="font-bold text-[13px] sm:text-[13.5px] text-[#062B67] dark:text-white tracking-tight leading-snug">
              {testimonial.name}
            </span>
            <span className="text-slate-300 dark:text-slate-600 font-normal select-none">|</span>
            <span className="text-[12px] text-[#64748B] dark:text-slate-400 font-normal">
              {classLabel}
            </span>
          </div>
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

/* ═══════════════════════════════════════════════════════════════════════
   MOBILE STORY CARD — Vertical format matching reference screenshot
   ═══════════════════════════════════════════════════════════════════════ */
const MobileStoryCard = ({ testimonial }: { testimonial: TTestimonial }) => {
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const classLabel = formatStudentClass(testimonial.achievement);
  const quoteText = cleanQuote(testimonial.testimonial);
  const videoId = testimonial.videoId || "9MOum9jk6lQ";
  const fallback = testimonial.name?.toLowerCase().includes("priya") || testimonial.name?.toLowerCase().includes("gauri") || testimonial.name?.toLowerCase().includes("kirti")
    ? "/images/results/idl-student-girl.jpg"
    : "/images/results/idl-student-boy.jpg";

  return (
    <>
      <div className="group/mobile w-full flex flex-col bg-white dark:bg-slate-900 rounded-[20px] overflow-hidden border border-slate-200/80 dark:border-slate-800 shadow-[0_2px_14px_rgba(10,30,66,0.05)] p-3 sm:p-3.5">
        
        {/* Student Image: Prominent portrait box */}
        <div 
          className="relative w-full aspect-[1.12/1] rounded-[14px] overflow-hidden bg-[#E9F0FA] dark:bg-slate-800 cursor-pointer"
          onClick={() => setIsVideoOpen(true)}
        >
          <StudentAvatar
            src={testimonial.avatarUrl}
            fallbackSrc={fallback}
            alt={testimonial.name}
            className="transition-transform duration-500 group-hover/mobile:scale-[1.02]"
          />

          {/* Frosted Glass Play Button on Mobile */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsVideoOpen(true);
            }}
            aria-label={`Watch story of ${testimonial.name}`}
            className="absolute bottom-2.5 right-2.5 z-30 w-[42px] h-[42px] rounded-full bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border border-white/70 dark:border-slate-700/70 shadow-[0_3px_10px_rgba(0,0,0,0.12)] flex items-center justify-center hover:bg-white/80 active:scale-95 transition-all cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-[#155EEF] text-[#155EEF] ml-0.5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="pt-3 px-1 pb-1 flex flex-col relative bg-white dark:bg-slate-900">
          {/* Subtle Watermark Quote Graphic */}
          <svg 
            className="w-7 h-7 text-[#DDE9F8] dark:text-blue-950/30 mb-1 select-none pointer-events-none" 
            viewBox="0 0 24 24" 
            fill="currentColor" 
            aria-hidden="true"
          >
            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
          </svg>
          
          <div className="relative z-10 min-w-0">
            {/* Testimonial Quote */}
            <blockquote className="mb-2">
              <p className="text-[13px] sm:text-[13.5px] font-normal text-[#1E293B] dark:text-slate-200 leading-[1.45] line-clamp-3 antialiased">
                {quoteText}
              </p>
            </blockquote>

            {/* Student Name & Class */}
            <div className="flex items-center gap-1.5 flex-wrap min-w-0">
              <h3 className="font-bold text-[14px] text-[#062B67] dark:text-white tracking-tight leading-snug">
                {testimonial.name}
              </h3>
              <span className="text-slate-300 dark:text-slate-600 font-normal select-none">|</span>
              <span className="text-[12px] text-[#64748B] dark:text-slate-400 font-normal">
                {classLabel}
              </span>
            </div>
          </div>
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

/* ═══════════════════════════════════════════════════════════════════════
   MAIN SECTION — IDL Stars
   ═══════════════════════════════════════════════════════════════════════ */
export function StudentTestimonials({ testimonials }: { testimonials?: TTestimonial[] }) {
  const [loading, setLoading] = useState(false);
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [activeSlide, setActiveSlide] = useState(0);
  const [isDesktopHovered, setIsDesktopHovered] = useState(false);

  const isHoveredRef = useRef(false);
  const touchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Harmonize stories: Use reference data ensuring unique testimonials & accurate student names
  const testimonialList = React.useMemo(() => {
    return DEFAULT_STORIES;
  }, []);

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

  const featured = testimonialList[activeSlide] || testimonialList[0];
  const supporting = testimonialList.filter((_, i) => i !== activeSlide);
  const desktopSupporting = supporting.slice(0, 3);

  return (
    <section id="testimonials" className="relative w-full pt-8 sm:pt-10 md:pt-12 pb-6 sm:pb-8 md:pb-10 bg-white dark:bg-background overflow-hidden">
      <div className="container relative z-10 mx-auto px-5 sm:px-6 max-w-7xl">

        {/* ── 1. Section Header ── */}
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-[26px] sm:text-[32px] md:text-[38px] font-extrabold tracking-tight leading-tight">
            <span className="text-[#062B67] dark:text-white">IDL</span>{' '}
            <span className="text-[#155EEF] dark:text-blue-500">Stars</span>
          </h2>
        </div>

        {/* ── Loading State ── */}
        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <Skeleton className="h-[360px] w-full rounded-2xl" />
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-[104px] w-full rounded-xl" />)}
            </div>
          </div>
        ) : (
          <>
            {/* ═══════════════════════════════════════════
                2. DESKTOP LAYOUT — Two Column (Left Featured + Right 3 Compact Cards)
               ═══════════════════════════════════════════ */}
            <div 
              className="hidden lg:grid lg:grid-cols-[1.38fr_1fr] gap-5 xl:gap-6 lg:h-[350px] xl:h-[360px] items-stretch"
              onMouseEnter={() => setIsDesktopHovered(true)}
              onMouseLeave={() => setIsDesktopHovered(false)}
            >
              {/* LEFT — Large Featured Student Story */}
              <div key={activeSlide} className="h-full w-full animate-in fade-in duration-300">
                <FeaturedStoryCard testimonial={featured} />
              </div>

              {/* RIGHT — Three Compact Story Cards Stacked Vertically */}
              <div className="flex flex-col justify-between h-full">
                <div className="flex flex-col gap-2.5 flex-1 min-h-0 justify-between">
                  {desktopSupporting.map((t) => {
                    const originalIndex = testimonialList.indexOf(t);
                    return (
                      <CompactStoryCard 
                        key={t.id || originalIndex} 
                        testimonial={t} 
                        onSelect={() => setActiveSlide(originalIndex)}
                      />
                    );
                  })}
                </div>

                {/* Desktop "View More Student Stories" text link */}
                <div className="flex justify-end pt-2">
                  <a 
                    href="/idl-stars"
                    className="inline-flex items-center gap-1.5 text-[13px] sm:text-[13.5px] font-bold text-[#062B67] dark:text-blue-400 hover:text-[#155EEF] dark:hover:text-blue-300 transition-colors cursor-pointer group"
                  >
                    <span>View More Student Stories</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>
              </div>
            </div>

            {/* Desktop Carousel Pagination Dots */}
            <div className="hidden lg:flex justify-center gap-1.5 mt-5">
              {testimonialList.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveSlide(i)}
                  className="p-1.5 flex items-center justify-center min-w-[28px] min-h-[28px] cursor-pointer group/dot"
                  aria-label={`View story ${i + 1}`}
                >
                  <span
                    className={cn(
                      "rounded-full transition-all duration-300",
                      activeSlide === i 
                        ? "w-7 h-2 bg-[#062B67] dark:bg-blue-500" 
                        : "w-2 h-2 bg-slate-200 dark:bg-slate-700 group-hover/dot:bg-slate-300"
                    )}
                  />
                </button>
              ))}
            </div>

            {/* ═══════════════════════════════════════════
                3. MOBILE LAYOUT — Dedicated Vertical Carousel
               ═══════════════════════════════════════════ */}
            <div 
              className="lg:hidden relative w-full max-w-[390px] mx-auto px-0"
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
                    delay: 5000,
                    stopOnInteraction: false,
                    stopOnMouseEnter: true,
                  }),
                ]}
                className="w-full overflow-hidden"
              >
                <CarouselContent className="-ml-0 items-stretch">
                  {testimonialList.map((testimonial, index) => (
                    <CarouselItem 
                      key={testimonial.id || index} 
                      className="pl-0 basis-full flex flex-col"
                    >
                      <div className="w-full">
                        <MobileStoryCard testimonial={testimonial} />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>

              {/* Mobile Pagination Dots */}
              <div className="flex justify-center gap-1.5 mt-4 sm:mt-5 mb-1">
                {testimonialList.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => scrollTo(i)}
                    className="p-1.5 flex items-center justify-center min-w-[28px] min-h-[28px] cursor-pointer group/dot"
                    aria-label={`Go to slide ${i + 1}`}
                  >
                    <span
                      className={cn(
                        "rounded-full transition-all duration-300",
                        current === i 
                          ? "w-6 h-2 bg-[#062B67] dark:bg-blue-500" 
                          : "w-2 h-2 bg-slate-200 dark:bg-slate-700 group-hover/dot:bg-slate-300"
                      )}
                    />
                  </button>
                ))}
              </div>

              {/* Mobile "View More Student Stories" link (centered) */}
              <div className="flex justify-center mt-1.5">
                <a 
                  href="/idl-stars"
                  className="inline-flex items-center justify-center gap-1.5 text-[#062B67] dark:text-blue-400 hover:text-[#155EEF] dark:hover:text-blue-300 text-[13px] sm:text-[13.5px] font-bold py-1 px-3 transition-colors cursor-pointer group"
                >
                  <span>View More Student Stories</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
