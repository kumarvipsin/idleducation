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
import { Play } from "lucide-react";

/* ═══════════════════════════════════════════════════════════════════════
   DEFAULT STORIES DATA — Fallback data (9 Authentic Students)
   ═══════════════════════════════════════════════════════════════════════ */
const DEFAULT_STORIES: TTestimonial[] = [
  // Section 1 (Cards 1 - 3)
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
    testimonial: "The teachers at IDL EDUCATION made even difficult topics easy to understand and always encouraged me. Their constant mentorship and doubt sessions gave me total confidence in my preparation.",
    avatarUrl: "/images/results/idl-student-girl.jpg",
    videoId: "opUk9BeH_t8",
    createdAt: new Date().toISOString(),
  },
  {
    id: "star-aditya",
    name: "Aditya Singh",
    achievement: "Class 10",
    testimonial: "Regular tests and personal guidance at IDL helped me improve a lot and build confidence in my preparation. The structured approach and teachers' personal feedback made all the difference.",
    avatarUrl: "/images/results/aditya-sharma.jpg",
    videoId: "RH3gAxlv7wo",
    createdAt: new Date().toISOString(),
  },
  // Section 2 (Cards 4 - 6)
  {
    id: "star-kirti",
    name: "Kirti Mishra",
    achievement: "Class 10",
    testimonial: "Before joining IDL, I felt lost with so many chapters, but the teachers here guided me step by step and made learning easy. Regular revision and mock tests gave me total clarity.",
    avatarUrl: "/images/results/idl-student-girl.jpg",
    videoId: "h-30HsxclVg",
    createdAt: new Date().toISOString(),
  },
  {
    id: "star-priya",
    name: "Priya Sharma",
    achievement: "Class 12",
    testimonial: "What I appreciated most about IDL EDUCATION during my Class 12 journey was the balance they maintained between teaching and revision. Every concept was reinforced until we had total clarity.",
    avatarUrl: "/images/results/student-female.jpg",
    videoId: "Xv7HlY4HUsk",
    createdAt: new Date().toISOString(),
  },
  {
    id: "star-aman",
    name: "Aman Singh",
    achievement: "Class 10",
    testimonial: "IDL Education structured test series and mentorship turned complex topics into my strongest strengths. The teachers never let any doubt linger.",
    avatarUrl: "/images/results/aman-singh.jpg",
    videoId: "RH3gAxlv7wo",
    createdAt: new Date().toISOString(),
  },
  // Section 3 (Cards 7 - 9)
  {
    id: "star-ishita",
    name: "Ishita Verma",
    achievement: "Class 10",
    testimonial: "Daily practice papers and immediate doubt solving made board preparation stress-free. The constant encouragement kept me inspired throughout the session.",
    avatarUrl: "/images/results/ishita-verma.jpg",
    videoId: "opUk9BeH_t8",
    createdAt: new Date().toISOString(),
  },
  {
    id: "star-raghav",
    name: "Raghav Sharma",
    achievement: "Class 10",
    testimonial: "The teachers at IDL never let us leave any concept half-understood. Truly indebted to their support, test series, and personalized attention.",
    avatarUrl: "/images/results/raghav-sharma.jpg",
    videoId: "9MOum9jk6lQ",
    createdAt: new Date().toISOString(),
  },
  {
    id: "star-mehak",
    name: "Mehak Jain",
    achievement: "Class 10",
    testimonial: "The weekly assessments gave me real exam temperament months before the actual boards. IDL guidance helped me score beyond my expectations.",
    avatarUrl: "/images/results/mehak-jain.jpg",
    videoId: "h-30HsxclVg",
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
    if (!src || (src.startsWith("http") && src.includes("storage.googleapis.com"))) {
      return fallbackSrc;
    }
    return src;
  });

  useEffect(() => {
    if (!src || (src.startsWith("http") && src.includes("storage.googleapis.com"))) {
      setImgSrc(fallbackSrc);
    } else {
      setImgSrc(src);
    }
  }, [src, fallbackSrc]);

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

function getFeaturedAvatar(avatarUrl?: string, isGirl?: boolean): string {
  if (avatarUrl) {
    const lower = avatarUrl.toLowerCase();
    if (lower.includes("girl") || lower.includes("female") || lower.includes("ishita") || lower.includes("mehak") || lower.includes("kavya")) {
      return "/images/results/idl-student-girl.jpg";
    }
    if (lower.includes("boy") || lower.includes("male") || lower.includes("aditya") || lower.includes("aman") || lower.includes("raghav")) {
      return "/images/results/idl-student-boy.jpg";
    }
    if (!lower.includes("results/")) {
      return avatarUrl;
    }
  }
  return isGirl ? "/images/results/idl-student-girl.jpg" : "/images/results/idl-student-boy.jpg";
}

/* ═══════════════════════════════════════════════════════════════════════
   FEATURED STORY CARD (DESKTOP LEFT)
   ═══════════════════════════════════════════════════════════════════════ */
const FeaturedStoryCard = ({ testimonial }: { testimonial: TTestimonial }) => {
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const classLabel = formatStudentClass(testimonial.achievement);
  const quoteText = cleanQuote(testimonial.testimonial);
  const videoId = testimonial.videoId || "9MOum9jk6lQ";
  const isGirl = testimonial.name?.toLowerCase().includes("priya") || 
                 testimonial.name?.toLowerCase().includes("gauri") || 
                 testimonial.name?.toLowerCase().includes("kirti") ||
                 testimonial.name?.toLowerCase().includes("ishita") ||
                 testimonial.name?.toLowerCase().includes("mehak") ||
                 testimonial.name?.toLowerCase().includes("kavya") ||
                 testimonial.name?.toLowerCase().includes("lavanya");
  const fallback = isGirl
    ? "/images/results/idl-student-girl.jpg"
    : "/images/results/idl-student-boy.jpg";
  const avatarSrc = getFeaturedAvatar(testimonial.avatarUrl, isGirl);

  return (
    <>
      <div className="group/featured relative flex flex-row h-full w-full bg-white dark:bg-slate-900 rounded-[18px] lg:rounded-[20px] overflow-hidden border border-[#E2ECF8] dark:border-slate-800 shadow-[0_2px_10px_rgba(6,43,103,0.03)] p-2.5 sm:p-3 transition-all duration-300">

        {/* Left Side: Student Portrait Image (Matching Academic Results style) */}
        <div 
          className="relative w-[44%] xl:w-[45%] h-full shrink-0 overflow-hidden rounded-[14px] sm:rounded-[15px] bg-[#EAF2FC] dark:bg-slate-800 cursor-pointer"
          onClick={() => setIsVideoOpen(true)}
        >
          <StudentAvatar
            src={avatarSrc}
            fallbackSrc={fallback}
            alt={testimonial.name}
            className="object-cover object-top"
          />

          {/* Subtle bottom gradient for play button readability */}
          <div
            className="absolute inset-x-0 bottom-0 h-14 z-20 pointer-events-none"
            style={{ background: "linear-gradient(to top, rgba(6,43,103,0.25) 0%, transparent 100%)" }}
          />

          {/* Play Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsVideoOpen(true);
            }}
            aria-label={`Watch story of ${testimonial.name}`}
            className="absolute bottom-2.5 right-2.5 z-30 w-[32px] h-[32px] sm:w-[34px] sm:h-[34px] rounded-full bg-black/40 hover:bg-black/55 active:scale-95 backdrop-blur-xs border border-white/30 flex items-center justify-center transition-all duration-200 cursor-pointer text-white"
          >
            <Play className="w-3.5 h-3.5 fill-white text-white ml-[1px]" />
          </button>
        </div>

        {/* Right Side: Quote & Student Identity */}
        <div className="flex flex-col justify-center flex-1 py-1 px-4 lg:py-1.5 lg:px-5 xl:px-6 relative min-w-0 bg-white dark:bg-slate-900">
          {/* Subtle Quotation Mark */}
          <svg
            className="w-5 h-5 text-[#BFDBFE] dark:text-blue-900/60 mb-1 select-none pointer-events-none shrink-0"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
          </svg>

          {/* Testimonial Quote */}
          <div className="relative z-10 min-w-0 max-w-[360px] xl:max-w-[390px]">
            <blockquote className="mb-2">
              <p 
                className="text-[13.5px] lg:text-[13.8px] text-[#4A5872] dark:text-slate-300 font-[500] leading-[1.48] tracking-normal" 
              >
                {quoteText}
              </p>
            </blockquote>

            {/* Student Name & Class */}
            <div className="flex items-baseline gap-1.5 flex-wrap min-w-0">
              <h3 className="font-[800] text-[16px] lg:text-[16.5px] text-[#062B67] dark:text-white tracking-tight leading-snug">
                {testimonial.name}
              </h3>
              <span className="text-slate-300 dark:text-slate-600 font-normal select-none">|</span>
              <span className="text-[12.5px] lg:text-[13px] font-[600] text-slate-500 dark:text-slate-400">
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
   COMPACT STORY CARD (SUPPORTING CARDS) — Uniform clean card without blue outline
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
  const isGirl = testimonial.name?.toLowerCase().includes("gauri") || 
                 testimonial.name?.toLowerCase().includes("kirti") || 
                 testimonial.name?.toLowerCase().includes("priya") ||
                 testimonial.name?.toLowerCase().includes("ishita") ||
                 testimonial.name?.toLowerCase().includes("mehak") ||
                 testimonial.name?.toLowerCase().includes("kavya") ||
                 testimonial.name?.toLowerCase().includes("lavanya");
  const fallback = isGirl
    ? "/images/results/idl-student-girl.jpg"
    : "/images/results/idl-student-boy.jpg";

  return (
    <>
      <div 
        className="group/compact h-[76px] min-[390px]:h-[80px] lg:h-[84px] xl:h-[86px] w-full flex flex-row items-center rounded-[12px] min-[390px]:rounded-[14px] overflow-hidden transition-all duration-200 cursor-pointer select-none bg-white dark:bg-slate-900 border border-[#E2ECF8] dark:border-slate-800 shadow-[0_1px_4px_rgba(6,43,103,0.03)] hover:border-[#BFDBFE] dark:hover:border-slate-700 hover:bg-slate-50/40"
        onClick={() => {
          if (onSelect) {
            onSelect();
          } else {
            setIsVideoOpen(true);
          }
        }}
      >
        {/* Thumbnail on Left */}
        <div className="p-1.5 min-[390px]:p-2 shrink-0 flex items-center">
          <div className="relative w-[62px] h-[62px] min-[390px]:w-[66px] min-[390px]:h-[66px] lg:w-[68px] lg:h-[68px] rounded-[9px] min-[390px]:rounded-[10px] overflow-hidden bg-[#EAF2FC] dark:bg-slate-800">
            <StudentAvatar
              src={testimonial.avatarUrl}
              fallbackSrc={fallback}
              alt={testimonial.name}
              className="object-cover object-top"
            />
          </div>
        </div>

        {/* Text Content on Right */}
        <div className="flex flex-col justify-center flex-1 py-1 pr-2.5 min-[390px]:pr-3 pl-1 min-w-0">
          {/* Testimonial Quote */}
          <p className="text-[11.4px] min-[390px]:text-[11.8px] sm:text-[12.2px] text-[#4A5872] dark:text-slate-300 font-[500] leading-[1.38] mb-1 line-clamp-2">
            {quoteText}
          </p>
          {/* Student Identity */}
          <div className="flex items-baseline gap-1.5 flex-nowrap min-w-0">
            <span className="font-[800] text-[12.5px] min-[390px]:text-[13px] text-[#062B67] dark:text-white tracking-tight leading-none shrink-0">
              {testimonial.name}
            </span>
            <span className="text-slate-300 dark:text-slate-600 text-[10px] select-none">|</span>
            <span className="text-[11px] min-[390px]:text-[11.5px] font-[600] text-slate-500 dark:text-slate-400 truncate leading-none">
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
   MOBILE STORY CARD — Matching Academic Results student photo sizing & framing
   ═══════════════════════════════════════════════════════════════════════ */
const MobileStoryCard = ({ testimonial }: { testimonial: TTestimonial }) => {
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const classLabel = formatStudentClass(testimonial.achievement);
  const quoteText = cleanQuote(testimonial.testimonial);
  const videoId = testimonial.videoId || "9MOum9jk6lQ";
  const isGirl = testimonial.name?.toLowerCase().includes("priya") || 
                 testimonial.name?.toLowerCase().includes("gauri") || 
                 testimonial.name?.toLowerCase().includes("kirti") ||
                 testimonial.name?.toLowerCase().includes("ishita") ||
                 testimonial.name?.toLowerCase().includes("mehak") ||
                 testimonial.name?.toLowerCase().includes("kavya") ||
                 testimonial.name?.toLowerCase().includes("lavanya");
  const fallback = isGirl
    ? "/images/results/idl-student-girl.jpg"
    : "/images/results/idl-student-boy.jpg";
  const avatarSrc = getFeaturedAvatar(testimonial.avatarUrl, isGirl);

  return (
    <>
      <div className="group/mobile w-full flex flex-col bg-white dark:bg-slate-900 rounded-[16px] min-[390px]:rounded-[18px] overflow-hidden border border-[#E2ECF8] dark:border-slate-800 shadow-[0_2px_8px_rgba(6,43,103,0.03)] p-2.5 min-[390px]:p-3 transition-all duration-300">
        
        {/* Student Image: Exactly matching Academic Results style, visual, aspect-square and full portrait portion */}
        <div 
          className="relative w-full aspect-square rounded-[14px] sm:rounded-[15px] bg-[#EAF2FC] dark:bg-slate-800 overflow-hidden cursor-pointer"
          onClick={() => setIsVideoOpen(true)}
        >
          <StudentAvatar
            src={avatarSrc}
            fallbackSrc={fallback}
            alt={testimonial.name}
            className="object-cover object-top"
          />

          {/* Smooth, subtle photographic bottom gradient for play button readability */}
          <div
            className="absolute inset-x-0 bottom-0 h-14 z-20 pointer-events-none"
            style={{ background: "linear-gradient(to top, rgba(6,43,103,0.22) 0%, transparent 100%)" }}
          />

          {/* Play Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsVideoOpen(true);
            }}
            aria-label={`Watch story of ${testimonial.name}`}
            className="absolute bottom-2.5 right-2.5 z-30 w-[32px] h-[32px] min-[390px]:w-[34px] min-[390px]:h-[34px] rounded-full bg-black/40 hover:bg-black/55 active:scale-95 backdrop-blur-xs border border-white/30 shadow-xs flex items-center justify-center transition-all duration-200 cursor-pointer text-white"
          >
            <Play className="w-3.5 h-3.5 fill-white text-white ml-[1px]" />
          </button>
        </div>

        {/* Content Area — Balanced spacing from image → quote mark → testimonial → name */}
        <div className="pt-2 min-[390px]:pt-2.5 px-0.5 pb-0.5 flex flex-col relative">
          <div className="relative z-10 min-w-0">
            {/* Quotation Mark Graphic */}
            <div className="flex items-center justify-between mb-1">
              <svg 
                className="w-3.5 h-3.5 min-[390px]:w-4 min-[390px]:h-4 text-[#BFDBFE] dark:text-blue-900/60 select-none pointer-events-none shrink-0" 
                viewBox="0 0 24 24" 
                fill="currentColor" 
                aria-hidden="true"
              >
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
            </div>
            
            {/* Testimonial Quote */}
            <blockquote className="mb-2">
              <p className="text-[12.6px] min-[390px]:text-[13.2px] text-[#4A5872] dark:text-slate-300 font-[500] leading-[1.46] tracking-normal line-clamp-3 text-pretty">
                {quoteText}
              </p>
            </blockquote>

            {/* Student Identity: Name prominent, class secondary on clean horizontal baseline */}
            <div className="flex items-baseline gap-1.5 flex-nowrap min-w-0 w-full">
              <h3 className="font-[800] text-[15px] min-[360px]:text-[16px] text-[#062B67] dark:text-white tracking-tight leading-none shrink-0">
                {testimonial.name}
              </h3>
              <span className="text-slate-300 dark:text-slate-600 text-xs select-none mx-0.5">|</span>
              <span className="text-[12px] min-[360px]:text-[12.5px] font-[600] text-slate-500 dark:text-slate-400 truncate leading-none">
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
  const [mobileApi, setMobileApi] = useState<CarouselApi>();
  const [desktopApi, setDesktopApi] = useState<CarouselApi>();
  const [activePageIndex, setActivePageIndex] = useState(0);

  const touchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Harmonize stories: Use passed database testimonials if available, else fallback to DEFAULT_STORIES
  const testimonialList = React.useMemo(() => {
    if (testimonials && testimonials.length > 0) {
      return testimonials;
    }
    return DEFAULT_STORIES;
  }, [testimonials]);

  // Group into pages of 3 cards each (last page cleanly holds remaining 1, 2, or 3 cards)
  const CHUNK_SIZE = 3;
  const pages = React.useMemo(() => {
    const result: TTestimonial[][] = [];
    for (let i = 0; i < testimonialList.length; i += CHUNK_SIZE) {
      const chunk = testimonialList.slice(i, i + CHUNK_SIZE);
      if (chunk.length > 0) {
        result.push(chunk);
      }
    }
    return result.length > 0 ? result : [testimonialList];
  }, [testimonialList]);

  // Selected student for main featured card (defaults to 1st card of 1st page)
  const [selectedStudent, setSelectedStudent] = useState<TTestimonial>(() => {
    return pages[0]?.[0] || DEFAULT_STORIES[0];
  });

  // Keep selectedStudent updated if pages change
  useEffect(() => {
    if (pages[0] && pages[0][0]) {
      setSelectedStudent(pages[0][0]);
      setActivePageIndex(0);
    }
  }, [pages]);

  // Mobile Carousel Select Listener: Updates page index and defaults featured photo to 1st card of that section
  useEffect(() => {
    if (!mobileApi) return;
    const onSelect = () => {
      const snap = mobileApi.selectedScrollSnap();
      setActivePageIndex(snap);
      const newPage = pages[snap];
      if (newPage && newPage[0]) {
        setSelectedStudent(newPage[0]);
      }
    };
    mobileApi.on("select", onSelect);
    return () => {
      mobileApi.off("select", onSelect);
    };
  }, [mobileApi, pages]);

  // Desktop Carousel Select Listener: Updates page index and defaults featured photo to 1st card of that section
  useEffect(() => {
    if (!desktopApi) return;
    const onSelect = () => {
      const snap = desktopApi.selectedScrollSnap();
      setActivePageIndex(snap);
      const newPage = pages[snap];
      if (newPage && newPage[0]) {
        setSelectedStudent(newPage[0]);
      }
    };
    desktopApi.on("select", onSelect);
    return () => {
      desktopApi.off("select", onSelect);
    };
  }, [desktopApi, pages]);

  // Reduced motion preference
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mediaQuery.matches) {
      try {
        mobileApi?.plugins()?.autoplay?.stop();
        desktopApi?.plugins()?.autoplay?.stop();
      } catch {}
    }
  }, [mobileApi, desktopApi]);

  // Cleanup timeout
  useEffect(() => {
    return () => {
      if (touchTimeoutRef.current) clearTimeout(touchTimeoutRef.current);
    };
  }, []);

  // When user clicks a card in the 3-card stack:
  const handleCardSelect = useCallback((t: TTestimonial) => {
    setSelectedStudent(t);
    // Pause autoplay briefly so user can inspect the selected student
    try {
      mobileApi?.plugins()?.autoplay?.stop();
      desktopApi?.plugins()?.autoplay?.stop();
    } catch {}
    if (touchTimeoutRef.current) clearTimeout(touchTimeoutRef.current);
    touchTimeoutRef.current = setTimeout(() => {
      try {
        mobileApi?.plugins()?.autoplay?.play();
        desktopApi?.plugins()?.autoplay?.play();
      } catch {}
    }, 4500);
  }, [mobileApi, desktopApi]);

  // When user clicks a pagination dot:
  const handleDotClick = useCallback((index: number) => {
    setActivePageIndex(index);
    const targetPage = pages[index];
    if (targetPage && targetPage[0]) {
      setSelectedStudent(targetPage[0]);
    }
    mobileApi?.scrollTo(index);
    desktopApi?.scrollTo(index);
  }, [pages, mobileApi, desktopApi]);

  // Mobile touch handlers
  const handleMobileTouchStart = useCallback(() => {
    if (touchTimeoutRef.current) clearTimeout(touchTimeoutRef.current);
    try {
      mobileApi?.plugins()?.autoplay?.stop();
    } catch {}
  }, [mobileApi]);

  const handleMobileTouchEnd = useCallback(() => {
    if (touchTimeoutRef.current) clearTimeout(touchTimeoutRef.current);
    touchTimeoutRef.current = setTimeout(() => {
      try {
        mobileApi?.plugins()?.autoplay?.play();
      } catch {}
    }, 2500);
  }, [mobileApi]);

  // Desktop hover handlers
  const handleDesktopMouseEnter = useCallback(() => {
    try {
      desktopApi?.plugins()?.autoplay?.stop();
    } catch {}
  }, [desktopApi]);

  const handleDesktopMouseLeave = useCallback(() => {
    try {
      desktopApi?.plugins()?.autoplay?.play();
    } catch {}
  }, [desktopApi]);

  return (
    <section id="testimonials" className="relative w-full pt-6 min-[390px]:pt-7 sm:pt-10 md:pt-12 pb-5 min-[390px]:pb-6 sm:pb-8 md:pb-10 bg-white dark:bg-background overflow-hidden" style={{ fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif" }}>
      <div className="container relative z-10 mx-auto px-3.5 min-[390px]:px-4 sm:px-6 max-w-7xl">

        {/* ── 1. Section Header ── */}
        <div className="flex flex-col items-center justify-center text-center mb-3.5 min-[390px]:mb-4 sm:mb-8 md:mb-10">
          {/* Eyebrow — bullet point */}
          <div className="inline-flex items-center justify-center gap-1.5 sm:gap-2 mb-1.5 min-[390px]:mb-2 select-none">
            <span className="w-[7px] h-[7px] sm:w-[8px] sm:h-[8px] rounded-full bg-[#155EEF] dark:bg-blue-400 shrink-0" />
            <span className="text-[13px] min-[390px]:text-[13.5px] sm:text-[15px] font-[800] tracking-tight">
              <span className="text-[#062B67] dark:text-blue-200">IDL </span>
              <span className="text-[#155EEF] dark:text-blue-400 font-extrabold">Stars</span>
            </span>
          </div>

          {/* Description heading */}
          <h2 className="text-[17px] min-[360px]:text-[18px] min-[400px]:text-[20px] sm:text-[28px] md:text-[34px] font-[800] tracking-[-0.015em] leading-[1.22] max-w-4xl mx-auto whitespace-nowrap">
            <span className="text-[#062B67] dark:text-white">Celebrate Achievement.{' '}</span>
            <span className="text-[#155EEF] dark:text-blue-400">Inspire Excellence.</span>
          </h2>
        </div>

        {/* ── Loading State ── */}
        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <Skeleton className="h-[320px] w-full rounded-2xl" />
            <div className="space-y-2.5">
              {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-[80px] w-full rounded-xl" />)}
            </div>
          </div>
        ) : (
          <>
            {/* ═══════════════════════════════════════════
                2. DESKTOP LAYOUT — Left Featured Card + Right 3-Card Carousel + Dots Below
               ═══════════════════════════════════════════ */}
            <div 
              className="hidden lg:grid lg:grid-cols-[1.38fr_1fr] gap-5 xl:gap-6 lg:h-[295px] xl:h-[305px] items-stretch"
              onMouseEnter={handleDesktopMouseEnter}
              onMouseLeave={handleDesktopMouseLeave}
            >
              {/* LEFT — Large Featured Student Story */}
              <div key={selectedStudent.id} className="h-full w-full animate-in fade-in duration-300">
                <FeaturedStoryCard testimonial={selectedStudent} />
              </div>

              {/* RIGHT — Three Compact Story Cards Carousel Stacked Vertically with Dots Below */}
              <div className="flex flex-col justify-between h-full min-w-0">
                <div className="flex-1 min-h-0">
                  <Carousel
                    setApi={setDesktopApi}
                    opts={{
                      align: "start",
                      loop: pages.length > 1,
                      duration: 25,
                    }}
                    plugins={[
                      Autoplay({
                        delay: 5000,
                        stopOnInteraction: false,
                        stopOnMouseEnter: true,
                      }),
                    ]}
                    className="w-full h-full overflow-hidden"
                  >
                    <CarouselContent className="-ml-0 items-stretch h-full">
                      {pages.map((page, pageIndex) => (
                        <CarouselItem 
                          key={pageIndex} 
                          className="pl-0 basis-full h-full"
                        >
                          <div className="flex flex-col gap-2 xl:gap-2.5 h-full">
                            {page.map((t) => (
                              <CompactStoryCard 
                                key={t.id} 
                                testimonial={t} 
                                onSelect={() => handleCardSelect(t)}
                              />
                            ))}
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                  </Carousel>
                </div>

                {/* Desktop Pagination Dots — Placed directly below the 3 cards */}
                <div className="flex justify-center items-center gap-1.5 mt-2.5 pt-0.5">
                  {pages.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => handleDotClick(i)}
                      className="p-1 cursor-pointer flex items-center justify-center min-w-[20px] min-h-[20px]"
                      aria-label={`Go to section ${i + 1}`}
                    >
                      <span
                        className={cn(
                          "rounded-full transition-all duration-300",
                          activePageIndex === i 
                            ? "w-6 h-2 bg-[#062B67] dark:bg-blue-500 shadow-[0_1px_3px_rgba(6,43,103,0.2)]" 
                            : "w-2 h-2 bg-slate-300 dark:bg-slate-700 hover:bg-[#062B67]/50"
                        )}
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* ═══════════════════════════════════════════
                3. MOBILE LAYOUT — Main Card at top, then 3-Card Carousel, then Pagination Dots Below
               ═══════════════════════════════════════════ */}
            <div 
              className="lg:hidden relative w-full max-w-[480px] mx-auto px-0"
              onTouchStart={handleMobileTouchStart}
              onTouchEnd={handleMobileTouchEnd}
            >
              {/* TOP — Main Featured Student Card */}
              <div key={selectedStudent.id} className="w-full animate-in fade-in duration-300 mb-2 min-[390px]:mb-2.5">
                <MobileStoryCard testimonial={selectedStudent} />
              </div>

              {/* MIDDLE — 3 Cards Carousel (Swipes up to 3 cards at a time, infinite free loop) */}
              <Carousel
                setApi={setMobileApi}
                opts={{
                  align: "start",
                  loop: pages.length > 1,
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
                  {pages.map((page, pageIndex) => (
                    <CarouselItem 
                      key={pageIndex} 
                      className="pl-0 basis-full flex flex-col"
                    >
                      <div className="flex flex-col gap-2 min-[390px]:gap-2.5 w-full">
                        {page.map((t) => (
                          <CompactStoryCard 
                            key={t.id} 
                            testimonial={t} 
                            onSelect={() => handleCardSelect(t)}
                          />
                        ))}
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>

              {/* BOTTOM — Mobile Pagination Dots (Placed BELOW the 3 cards) */}
              <div className="flex justify-center items-center gap-1.5 mt-2.5 min-[390px]:mt-3 mb-0.5">
                {pages.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => handleDotClick(i)}
                    className="p-1 cursor-pointer flex items-center justify-center min-w-[20px] min-h-[20px]"
                    aria-label={`Go to section ${i + 1}`}
                  >
                    <span
                      className={cn(
                        "rounded-full transition-all duration-300",
                        activePageIndex === i 
                          ? "w-5 min-[390px]:w-6 h-1.5 min-[390px]:h-2 bg-[#062B67] dark:bg-blue-500 shadow-[0_1px_3px_rgba(6,43,103,0.2)]" 
                          : "w-1.5 min-[390px]:w-2 h-1.5 min-[390px]:h-2 bg-slate-300 dark:bg-slate-700 hover:bg-[#062B67]/50"
                      )}
                    />
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
