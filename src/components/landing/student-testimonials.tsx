'use client';

import { useEffect, useState, useCallback, useRef } from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselApi } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import type { TTestimonial } from "@/app/actions/types";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { GcsImage } from "../gcs-image";
import { Dialog, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog";
import { VideoModalDialogContent } from "@/components/ui/video-modal-dialog";
import { Play, ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";

const DURATIONS = ["2:35", "3:12", "2:18", "2:52", "3:05", "2:40", "3:15"];

const FALLBACK_TESTIMONIALS: TTestimonial[] = [
  {
    id: "star-1",
    name: "Ananya Verma",
    achievement: "Class 10",
    testimonial: "IDL's regular tests and personal guidance really helped me stay on track.",
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
  if (femaleNames.has(firstName)) return "Watch Her Story";
  if (firstName.endsWith("a") || firstName.endsWith("i") || firstName.endsWith("ya")) {
    if (!["aman", "krishna", "rishi", "ravi", "ali"].includes(firstName)) {
      return "Watch Her Story";
    }
  }
  return "Watch His Story";
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
  q = q.replace(/^[""']|[""']$/g, '').trim();
  return q;
}

/* ═══════════════════════════════════════════════════════════════════════
   FEATURED STORY CARD — Refined Editorial Hero
   ═══════════════════════════════════════════════════════════════════════ */
const FeaturedStoryCard = ({ testimonial, index }: { testimonial: TTestimonial; index: number }) => {
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const duration = DURATIONS[index % DURATIONS.length];
  const storyLabel = getStoryButtonLabel(testimonial.name);
  const classLabel = formatStudentClass(testimonial.achievement);
  const quoteText = cleanQuote(testimonial.testimonial);
  const videoId = testimonial.videoId || "9MOum9jk6lQ";

  return (
    <>
      <div className="group/featured flex flex-col lg:flex-row h-full w-full bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200/70 dark:border-slate-800/70 shadow-[0_2px_12px_-4px_rgba(10,30,66,0.06)] hover:shadow-[0_8px_24px_-6px_rgba(10,30,66,0.10)] transition-all duration-300">
        
        {/* IMAGE — Editorial portrait visual */}
        <div 
          className="relative w-full lg:w-[48%] xl:w-[49%] h-[240px] sm:h-[270px] lg:h-full overflow-hidden cursor-pointer shrink-0"
          onClick={() => setIsVideoOpen(true)}
        >
          <GcsImage
            filePath={testimonial.avatarUrl || "https://picsum.photos/seed/5/600/400"}
            alt={testimonial.name}
            fill
            className="object-cover object-center transition-transform duration-500 ease-out group-hover/featured:scale-[1.03]"
          />
          {/* Subtle bottom gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent pointer-events-none" />
          
          {/* Duration badge */}
          <div className="absolute top-3.5 left-3.5 px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-xs text-white text-[10.5px] font-semibold tracking-tight z-10 select-none">
            {duration}
          </div>
        </div>

        {/* CONTENT PANEL — Refined editorial composition with natural, balanced spacing */}
        <div className="flex flex-col justify-center h-full flex-1 p-6 sm:p-7 xl:p-8 relative min-w-0 bg-white dark:bg-slate-900">
          {/* Watermark quote icon — subtle & elegant */}
          <svg
            className="absolute top-5 right-5 lg:top-6 lg:right-6 w-12 h-12 lg:w-14 lg:h-14 text-blue-100/50 dark:text-blue-950/20 select-none pointer-events-none"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
          </svg>

          {/* Quote & Student identity */}
          <div className="relative z-10 min-w-0">
            {/* Quote — strong readable navy tone, clamped to 3 lines */}
            <blockquote className="mb-3 sm:mb-3.5">
              <p className="text-[17px] sm:text-[18px] lg:text-[18.5px] xl:text-[19.5px] font-semibold text-[#0B1E48] dark:text-slate-100 leading-[1.45] tracking-tight line-clamp-3 antialiased">
                &ldquo;{quoteText}&rdquo;
              </p>
            </blockquote>

            {/* Student metadata positioned naturally below the quote */}
            <div className="min-w-0">
              <h3 className="font-bold text-[16px] sm:text-[17px] text-[#0A1E42] dark:text-white tracking-tight leading-snug truncate">
                {testimonial.name}
              </h3>
              <p className="text-[12.5px] sm:text-[13px] text-[#3B4D66] dark:text-slate-300 font-medium mt-0.5 truncate">
                {classLabel} · IDL Education
              </p>
            </div>
          </div>

          {/* CTA Button — tightened spacing */}
          <div className="relative z-10 mt-4 sm:mt-4.5">
            <button
              type="button"
              onClick={() => setIsVideoOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#062B67] hover:bg-[#0A1E42] text-white text-[13.5px] font-semibold shadow-[0_2px_8px_-2px_rgba(6,43,103,0.25)] hover:shadow-[0_4px_14px_-2px_rgba(6,43,103,0.35)] transition-all duration-200 cursor-pointer active:scale-[0.98] shrink-0"
            >
              <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                <Play className="w-2.5 h-2.5 fill-white text-white ml-[1px]" />
              </span>
              {storyLabel}
              <ArrowRight className="w-3.5 h-3.5 stroke-[2.5] ml-0.5" />
            </button>
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
   COMPACT STORY CARD — Supporting stories (right side on desktop)
   ═══════════════════════════════════════════════════════════════════════ */
const CompactStoryCard = ({ 
  testimonial, 
  index, 
  onSelect 
}: { 
  testimonial: TTestimonial; 
  index: number; 
  onSelect?: () => void;
}) => {
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const duration = DURATIONS[index % DURATIONS.length];
  const classLabel = formatStudentClass(testimonial.achievement);
  const quoteText = cleanQuote(testimonial.testimonial);
  const videoId = testimonial.videoId || "9MOum9jk6lQ";

  return (
    <>
      <div 
        className="group/compact flex-1 min-h-0 flex flex-row bg-white dark:bg-slate-900 rounded-xl overflow-hidden border border-slate-200/70 dark:border-slate-800/70 shadow-[0_1px_6px_-2px_rgba(10,30,66,0.05)] hover:shadow-[0_4px_16px_-3px_rgba(10,30,66,0.1)] hover:-translate-y-[1px] transition-all duration-200 cursor-pointer"
        onClick={() => {
          if (onSelect) {
            onSelect();
          } else {
            setIsVideoOpen(true);
          }
        }}
      >
        {/* Thumbnail */}
        <div className="relative w-[115px] sm:w-[120px] xl:w-[125px] h-full shrink-0 overflow-hidden">
          <GcsImage
            filePath={testimonial.avatarUrl || "https://picsum.photos/seed/5/200/200"}
            alt={testimonial.name}
            fill
            className="object-cover transition-transform duration-400 group-hover/compact:scale-[1.04]"
          />
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-black/15 pointer-events-none" />
          
          {/* Clean subtle duration badge */}
          <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-xs text-white text-[9.5px] font-medium tracking-tight z-10 select-none">
            {duration}
          </div>
        </div>

        {/* Text content — stronger weight, deep navy color, balanced spacing */}
        <div className="flex flex-col justify-center flex-1 px-3.5 py-2.5 min-w-0">
          {/* Quote — stronger weight, deep navy color, balanced readability */}
          <p className="text-[13.5px] sm:text-[14px] xl:text-[14.2px] text-[#0A1E42] dark:text-slate-100 font-semibold leading-[1.38] line-clamp-2 mb-1.5 antialiased">
            &ldquo;{quoteText}&rdquo;
          </p>
          {/* Identity */}
          <div className="min-w-0">
            <p className="font-bold text-[13.5px] sm:text-[14px] text-[#0A1E42] dark:text-white tracking-tight leading-snug truncate">
              {testimonial.name}
            </p>
            <p className="text-[11.5px] sm:text-[12px] text-[#3B4D66] dark:text-slate-300 font-medium leading-none truncate mt-0.5">
              {classLabel}
            </p>
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
   MOBILE STORY CARD — Full-width single-card layout for mobile
   ═══════════════════════════════════════════════════════════════════════ */
const MobileStoryCard = ({ testimonial, index }: { testimonial: TTestimonial; index: number }) => {
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const duration = DURATIONS[index % DURATIONS.length];
  const storyLabel = getStoryButtonLabel(testimonial.name);
  const classLabel = formatStudentClass(testimonial.achievement);
  const quoteText = cleanQuote(testimonial.testimonial);
  const videoId = testimonial.videoId || "9MOum9jk6lQ";

  return (
    <>
      <div className="group/mobile w-full flex flex-col bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200/70 dark:border-slate-800/70 shadow-[0_2px_12px_-4px_rgba(10,30,66,0.06)]">
        {/* Image — full width at top, cinematic aspect ratio */}
        <div 
          className="relative w-full aspect-[16/10] overflow-hidden cursor-pointer shrink-0"
          onClick={() => setIsVideoOpen(true)}
        >
          <GcsImage
            filePath={testimonial.avatarUrl || "https://picsum.photos/seed/5/600/400"}
            alt={testimonial.name}
            fill
            className="object-cover object-center transition-transform duration-500 group-hover/mobile:scale-[1.03]"
          />
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent pointer-events-none" />
          
          {/* Duration badge at top-left */}
          <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-xs text-white text-[10.5px] font-semibold tracking-tight z-10 select-none">
            {duration}
          </div>
        </div>

        {/* Content Area — comfortable horizontal padding, readable navy quote, student info, compact CTA */}
        <div className="p-5 sm:p-6 flex flex-col justify-between relative bg-white dark:bg-slate-900">
          {/* Subtle Watermark */}
          <svg className="absolute top-4 right-4 w-10 h-10 text-blue-100/40 dark:text-blue-950/20 select-none pointer-events-none" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
          </svg>
          
          <div className="relative z-10 min-w-0">
            {/* Quote — 3-4 lines with controlled ellipsis */}
            <blockquote className="mb-3.5">
              <p className="text-[14.5px] sm:text-[15.5px] font-semibold text-[#0B1E48] dark:text-slate-100 leading-[1.48] tracking-tight line-clamp-3 sm:line-clamp-4 antialiased">
                &ldquo;{quoteText}&rdquo;
              </p>
            </blockquote>

            {/* Student info */}
            <div className="min-w-0">
              <h3 className="font-bold text-[15px] sm:text-[16px] text-[#0A1E42] dark:text-white tracking-tight leading-snug truncate">
                {testimonial.name}
              </h3>
              <p className="text-[12.5px] sm:text-[13px] text-[#3B4D66] dark:text-slate-300 font-medium mt-0.5 truncate">
                {classLabel} · IDL Education
              </p>
            </div>
          </div>

          {/* Compact CTA Button — fixed padding, gap, and whitespace-nowrap to prevent text clipping */}
          <div className="relative z-10 pt-4 mt-1">
            <button
              type="button"
              onClick={() => setIsVideoOpen(true)}
              className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-xl bg-[#062B67] hover:bg-[#0A1E42] text-white text-[13.5px] font-semibold shadow-[0_2px_8px_-2px_rgba(6,43,103,0.25)] hover:shadow-[0_4px_14px_-2px_rgba(6,43,103,0.35)] transition-all duration-200 cursor-pointer active:scale-[0.98] w-fit whitespace-nowrap"
            >
              <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                <Play className="w-2.5 h-2.5 fill-white text-white ml-[1px]" />
              </span>
              <span className="whitespace-nowrap">{storyLabel}</span>
              <ArrowRight className="w-3.5 h-3.5 stroke-[2.5] ml-0.5 shrink-0" />
            </button>
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
   MAIN SECTION — IDL Stars · Premium editorial layout
   ═══════════════════════════════════════════════════════════════════════ */
export function StudentTestimonials({ testimonials }: { testimonials: TTestimonial[] }) {
  const [loading, setLoading] = useState(!testimonials);
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [activeSlide, setActiveSlide] = useState(0);
  const [isDesktopHovered, setIsDesktopHovered] = useState(false);

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

  // Split: first = featured, rest = supporting stories
  const featured = testimonialList[activeSlide] || testimonialList[0];
  const supporting = testimonialList.filter((_, i) => i !== activeSlide);
  // Show up to 3 supporting stories on desktop
  const desktopSupporting = supporting.slice(0, 3);

  // Auto-rotate the featured story every 6 seconds (pauses on desktop hover)
  useEffect(() => {
    if (loading || testimonialList.length <= 1 || isDesktopHovered) return;
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % testimonialList.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [loading, testimonialList.length, isDesktopHovered]);

  return (
    <section id="testimonials" className="relative w-full pt-8 sm:pt-10 md:pt-12 pb-8 sm:pb-10 md:pb-12 bg-[#FAFBFE] dark:bg-background overflow-hidden">
      {/* Subtle ambient depth glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] sm:w-[900px] h-[350px] sm:h-[450px] bg-blue-500/[0.02] dark:bg-blue-500/[0.015] rounded-full blur-3xl pointer-events-none" />

      <div className="container relative z-10 mx-auto px-4 md:px-6 max-w-7xl">

        {/* ── Section Header — Tighter vertical spacing ── */}
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-[#0A1E42] dark:text-white leading-[1.15]">
            IDL{' '}
            <span className="relative inline-block text-[#1D4ED8] dark:text-blue-400">
              Stars
              {/* Curved underline accent */}
              <span className="absolute -bottom-1.5 sm:-bottom-2 left-1/2 -translate-x-1/2 w-[75%] h-3 pointer-events-none select-none flex items-center" aria-hidden="true">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 100 16" fill="none" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="idl-stars-swoosh-v3" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#3B82F6" stopOpacity="0" />
                      <stop offset="30%" stopColor="#3B82F6" stopOpacity="0.45" />
                      <stop offset="70%" stopColor="#2563EB" stopOpacity="0.9" />
                      <stop offset="100%" stopColor="#1D4ED8" stopOpacity="1" />
                    </linearGradient>
                    <linearGradient id="idl-stars-swoosh-v3-dark" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#60A5FA" stopOpacity="0" />
                      <stop offset="30%" stopColor="#60A5FA" stopOpacity="0.45" />
                      <stop offset="70%" stopColor="#3B82F6" stopOpacity="0.9" />
                      <stop offset="100%" stopColor="#60A5FA" stopOpacity="1" />
                    </linearGradient>
                  </defs>
                  <path d="M 6,8 C 28,1.5 72,14.5 94,8" stroke="url(#idl-stars-swoosh-v3)" strokeWidth="2.5" strokeLinecap="round" vectorEffect="non-scaling-stroke" className="dark:hidden" />
                  <path d="M 6,8 C 28,1.5 72,14.5 94,8" stroke="url(#idl-stars-swoosh-v3-dark)" strokeWidth="2.5" strokeLinecap="round" vectorEffect="non-scaling-stroke" className="hidden dark:inline" />
                </svg>
              </span>
            </span>
          </h2>
          <p className="text-sm sm:text-[15px] md:text-base text-[#3B4D66] dark:text-slate-300 font-medium mt-2.5 sm:mt-3 max-w-xl mx-auto tracking-[-0.01em]">
            Real stories. Real journeys. Real results.
          </p>
        </div>

        {/* ── Loading State ── */}
        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <Skeleton className="h-[364px] w-full rounded-2xl" />
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-[104px] w-full rounded-xl" />)}
            </div>
          </div>
        ) : testimonialList.length > 0 ? (
          <>
            {/* ═══════════════════════════════════════════
                DESKTOP LAYOUT — Asymmetric editorial with FIXED matched height
                Featured (left) + Stacked compact (right)
               ═══════════════════════════════════════════ */}
            <div 
              className="hidden lg:grid lg:grid-cols-[1fr_370px] xl:grid-cols-[1fr_395px] gap-5 xl:gap-5.5 lg:h-[364px] xl:h-[372px] items-stretch"
              onMouseEnter={() => setIsDesktopHovered(true)}
              onMouseLeave={() => setIsDesktopHovered(false)}
            >
              
              {/* LEFT — Featured story (fixed height, clamped text, balanced vertical spacing) */}
              <div key={activeSlide} className="h-full w-full animate-in fade-in duration-300">
                <FeaturedStoryCard 
                  testimonial={featured} 
                  index={activeSlide} 
                />
              </div>

              {/* RIGHT — Stacked compact stories with matched total height */}
              <div className="flex flex-col justify-between h-full">
                <div className="flex flex-col gap-2.5 flex-1 min-h-0 justify-between">
                  {desktopSupporting.map((t) => {
                    const originalIndex = testimonialList.indexOf(t);
                    return (
                      <CompactStoryCard 
                        key={t.id || originalIndex} 
                        testimonial={t} 
                        index={originalIndex}
                        onSelect={() => setActiveSlide(originalIndex)}
                      />
                    );
                  })}
                </div>

                {/* "View More Student Stories" link */}
                <a 
                  href="/idl-stars"
                  className="inline-flex items-center justify-center gap-1.5 sm:gap-2 text-[#062B67] dark:text-blue-400 hover:text-[#155EEF] dark:hover:text-blue-300 text-[13.5px] sm:text-sm font-bold pt-2 pb-0.5 transition-colors cursor-pointer group shrink-0"
                >
                  <span>View More Student Stories</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>

            {/* Slide indicators (Desktop) */}
            <div className="hidden lg:flex justify-center gap-1.5 mt-6">
              {testimonialList.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveSlide(i)}
                  className="p-2 flex items-center justify-center min-w-[32px] min-h-[32px] cursor-pointer group/dot"
                  aria-label={`View story ${i + 1}`}
                >
                  <span
                    className={cn(
                      "rounded-full transition-all duration-300",
                      activeSlide === i 
                        ? "w-6 h-2 bg-[#062B67] dark:bg-blue-500" 
                        : "w-2 h-2 bg-slate-200 dark:bg-slate-700 group-hover/dot:bg-slate-300"
                    )}
                  />
                </button>
              ))}
            </div>

            {/* ═══════════════════════════════════════════
                MOBILE/TABLET LAYOUT — Single card carousel (One card at a time)
               ═══════════════════════════════════════════ */}
            <div 
              className="lg:hidden relative w-full max-w-sm sm:max-w-md mx-auto px-2 sm:px-0"
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
                  duration: 25,
                }}
                plugins={[
                  Autoplay({
                    delay: 4500,
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
                        <MobileStoryCard testimonial={testimonial} index={index} />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>

              {/* Nav arrows (tablet) */}
              <button
                type="button"
                onClick={() => api?.scrollPrev()}
                className="hidden sm:flex absolute -left-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white dark:bg-slate-900 shadow-md border border-slate-200/80 dark:border-slate-800 items-center justify-center text-slate-600 dark:text-slate-300 hover:text-[#062B67] hover:scale-105 active:scale-95 transition-all cursor-pointer"
                aria-label="Previous stories"
              >
                <ChevronLeft className="w-4.5 h-4.5 stroke-[2.5]" />
              </button>
              <button
                type="button"
                onClick={() => api?.scrollNext()}
                className="hidden sm:flex absolute -right-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white dark:bg-slate-900 shadow-md border border-slate-200/80 dark:border-slate-800 items-center justify-center text-slate-600 dark:text-slate-300 hover:text-[#062B67] hover:scale-105 active:scale-95 transition-all cursor-pointer"
                aria-label="Next stories"
              >
                <ChevronRight className="w-4.5 h-4.5 stroke-[2.5]" />
              </button>
              
              {/* Pagination dots (mobile) */}
              <div className="flex justify-center gap-1.5 mt-5 sm:mt-6 mb-2">
                {testimonialList.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => scrollTo(i)}
                    className="p-2 flex items-center justify-center min-w-[32px] min-h-[32px] cursor-pointer group/dot"
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

              {/* "View More Student Stories" link (mobile below dots) */}
              <div className="flex justify-center mt-2.5">
                <a 
                  href="/idl-stars"
                  className="inline-flex items-center justify-center gap-1.5 text-[#062B67] dark:text-blue-400 hover:text-[#155EEF] dark:hover:text-blue-300 text-[13.5px] sm:text-sm font-bold py-1 px-3 transition-colors cursor-pointer group"
                >
                  <span>View More Student Stories</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>
          </>
        ) : (
          <p className="text-center text-sm text-[#3B4D66] dark:text-slate-300 font-medium italic">New success stories coming soon!</p>
        )}
      </div>
    </section>
  );
}
