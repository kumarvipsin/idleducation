'use client';

import Image from "next/image";
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "../ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import type { THeroSlide } from "@/app/actions/types";
import { Zap, Phone, ArrowRight, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import { AdmissionModal } from "@/components/admission-modal";
import { BookDemoModal } from "@/components/book-demo-modal";
import { 
  EnrollNowModal, 
  JEE_NEET_CLASSES, 
  JEE_NEET_COURSES 
} from "@/components/enroll-now-modal";

interface HeroSlideItem {
  id: string;
  badgeTag?: string;
  badgeYear?: string;
  headlineLine1: string;
  headlineLine2: string;
  streamText?: string;
  streamClass?: string;
  buttonText: string;
  secondaryButtonText: string;
  studentImage: string;
  studentAlt: string;
}

const heroSlidesList: HeroSlideItem[] = [
  {
    id: "admission-slide-1",
    headlineLine1: "JEE / NEET",
    headlineLine2: "Dream Big. Achieve More.",
    streamText: "Expert Guidance • Conceptual Clarity • Result-Oriented Preparation",
    streamClass: "text-slate-100/95 font-medium text-xs sm:text-sm md:text-base tracking-wide drop-shadow-[0_1px_4px_rgba(0,0,0,0.5)]",
    buttonText: "Enroll Now",
    secondaryButtonText: "Book Free Demo",
    studentImage: "/scholarship.png",
    studentAlt: "IDL Education Student",
  },
  {
    id: "admission-slide-2",
    headlineLine1: "JEE / NEET",
    headlineLine2: "Dream Big. Achieve More.",
    streamText: "Expert Guidance • Conceptual Clarity • Result-Oriented Preparation",
    streamClass: "text-slate-100/95 font-medium text-xs sm:text-sm md:text-base tracking-wide drop-shadow-[0_1px_4px_rgba(0,0,0,0.5)]",
    buttonText: "Enroll Now",
    secondaryButtonText: "Book Free Demo",
    studentImage: "/scholarship.png",
    studentAlt: "IDL Education Student",
  },
];

/**
 * Luminous Minimalist Background with Subtle Layered Radial Lighting & Ambient Floor Stage Glow
 * Rich Vivid Royal Blue brand aesthetic with golden core ambient light and glowing horizon.
 */
function LuminousHeroBackground() {
  return (
    <div 
      aria-hidden="true" 
      className="absolute inset-0 pointer-events-none select-none overflow-hidden z-0"
    >
      {/* 1. Rich Vivid Royal Blue Gradient (Vibrant & saturated, not dull) */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 135% 100% at 50% 18%, #1A56DB 0%, #1243B5 30%, #0B2C82 65%, #061A4E 100%)'
        }}
      />

      {/* 2. Top Edge Subtle Neon Rim Light */}
      <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-sky-300/50 via-blue-300/40 to-transparent shadow-[0_0_12px_rgba(56,189,248,0.45)]" />

      {/* 3. Vibrant Electric Royal Blue Glow behind Left Text */}
      <div 
        className="absolute top-[36%] left-[28%] lg:left-[22%] -translate-x-1/2 -translate-y-1/2 w-[650px] sm:w-[800px] md:w-[950px] h-[380px] sm:h-[450px] rounded-full blur-[90px] opacity-85"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(37, 99, 235, 0.60) 0%, rgba(59, 130, 246, 0.35) 40%, rgba(29, 78, 216, 0.15) 70%, transparent 85%)'
        }}
      />

      {/* 4. Warm Golden Ambient Core Lighting behind Left Headline */}
      <div 
        className="absolute top-[42%] left-[26%] lg:left-[20%] -translate-x-1/2 -translate-y-1/2 w-[420px] sm:w-[550px] h-[220px] sm:h-[260px] rounded-full blur-[75px] opacity-55"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(251, 191, 36, 0.65) 0%, rgba(245, 158, 11, 0.30) 45%, transparent 75%)'
        }}
      />

      {/* 5. Luminous Stage Floor Glow near Bottom Edge (Seamless transition into lower section) */}
      <div 
        className="absolute bottom-0 inset-x-0 h-48 sm:h-60 md:h-72 pointer-events-none overflow-hidden"
        style={{
          background: 'radial-gradient(ellipse 85% 100% at 50% 100%, rgba(219, 234, 254, 0.65) 0%, rgba(96, 165, 250, 0.40) 32%, rgba(37, 99, 235, 0.18) 65%, transparent 85%)'
        }}
      />

      {/* 6. Soft Horizon Edge Light Line */}
      <div className="absolute bottom-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-blue-200/60 via-white/85 to-transparent shadow-[0_0_20px_rgba(96,165,250,0.5)]" />
    </div>
  );
}

export function BuildSkillsSection({ slides: _initialSlides }: { slides?: THeroSlide[] }) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isEnrollOpen, setIsEnrollOpen] = useState(false);
  const [isAdmissionOpen, setIsAdmissionOpen] = useState(false);
  const [isBookDemoOpen, setIsBookDemoOpen] = useState(false);

  // Section in-view detection: re-triggers motion every time user scrolls into this section
  const sectionRef = useRef<HTMLElement>(null);
  const [animKey, setAnimKey] = useState(1);
  const wasOutOfViewRef = useRef(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (wasOutOfViewRef.current) {
            setAnimKey((prev) => prev + 1);
            wasOutOfViewRef.current = false;
          }
        } else {
          wasOutOfViewRef.current = true;
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Synchronized Autoplay & Progress Bar (Fill 0% to 100%, then slide transitions)
  const progressRef = useRef(0);

  useEffect(() => {
    if (!api) return;

    setCurrent(api.selectedScrollSnap());
    const onSelect = () => {
      setCurrent(api.selectedScrollSnap());
      progressRef.current = 0;
      setProgress(0);
    };

    api.on("select", onSelect);

    const SLIDE_DURATION = 6000; // 6 seconds per slide
    const INTERVAL = 50; // smooth 20fps update
    const step = (INTERVAL / SLIDE_DURATION) * 100;

    const timer = setInterval(() => {
      if (isHovered) return;

      progressRef.current += step;
      if (progressRef.current >= 100) {
        progressRef.current = 0;
        setProgress(0);
        api.scrollNext();
      } else {
        setProgress(progressRef.current);
      }
    }, INTERVAL);

    return () => {
      clearInterval(timer);
      api.off("select", onSelect);
    };
  }, [api, isHovered]);

  const handlePrev = useCallback(() => {
    progressRef.current = 0;
    setProgress(0);
    api?.scrollPrev();
  }, [api]);

  const handleNext = useCallback(() => {
    progressRef.current = 0;
    setProgress(0);
    api?.scrollNext();
  }, [api]);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes heroFadeUp {
          0% {
            opacity: 0;
            transform: translateY(26px);
            filter: blur(5px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
            filter: blur(0px);
          }
        }

        @keyframes heroBadgePop {
          0% {
            opacity: 0;
            transform: translateY(14px) scale(0.92);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes heroButtonRise {
          0% {
            opacity: 0;
            transform: translateY(22px);
            filter: blur(3px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
            filter: blur(0px);
          }
        }

        @keyframes heroStudentReveal {
          0% {
            opacity: 0;
            transform: translateY(24px) scale(0.96);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .animate-hero-badge {
          animation: heroBadgePop 0.65s cubic-bezier(0.16, 1, 0.3, 1) 0.05s both;
          will-change: transform, opacity;
        }

        .animate-hero-line1 {
          animation: heroFadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.12s both;
          will-change: transform, opacity, filter;
        }

        .animate-hero-line2 {
          animation: heroFadeUp 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.25s both;
          will-change: transform, opacity, filter;
        }

        .animate-hero-subtitle {
          animation: heroFadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.38s both;
          will-change: transform, opacity, filter;
        }

        .animate-hero-cta {
          animation: heroButtonRise 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.50s both;
          will-change: transform, opacity, filter;
        }

        .animate-hero-student {
          animation: heroStudentReveal 0.95s cubic-bezier(0.16, 1, 0.3, 1) 0.20s both;
          will-change: transform, opacity;
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-hero-badge,
          .animate-hero-line1,
          .animate-hero-line2,
          .animate-hero-subtitle,
          .animate-hero-cta,
          .animate-hero-student {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
            filter: none !important;
          }
        }
      ` }} />

      <section 
        ref={sectionRef}
        suppressHydrationWarning 
        className="w-full max-w-full overflow-hidden pt-0 pb-0 bg-[#061A4E]"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative w-full max-w-full overflow-hidden select-none">
          <Carousel 
            setApi={setApi}
            opts={{ align: "start", loop: true }}
            className="w-full overflow-hidden"
          >
            <CarouselContent className="ml-0">
              {heroSlidesList.map((slide, index) => {
                const isActive = index === current;

                return (
                <CarouselItem key={slide.id} className="min-w-0 shrink-0 grow-0 basis-full pl-0 rounded-none">
                  
                  {/* Clean Luminous Slide with Left-Aligned Content & Right Integrated Student Visual */}
                  <div className="relative w-full max-w-full overflow-hidden flex items-center min-h-[500px] sm:min-h-[540px] md:min-h-[560px] lg:min-h-[580px] xl:min-h-[600px] px-4 sm:px-8 md:px-12 lg:px-16 pt-20 min-[380px]:pt-24 sm:pt-28 md:pt-24 lg:pt-14 xl:pt-16 pb-12 sm:pb-16 md:pb-20 lg:pb-0">
                    <LuminousHeroBackground />

                    {/* 2-Column Responsive Layout */}
                    <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-8 lg:gap-10">
                      
                      {/* LEFT COLUMN: All text & buttons strictly LEFT-ALIGNED */}
                      <div 
                        key={`${slide.id}-${animKey}-${isActive ? 'active' : 'idle'}`}
                        className="w-full lg:max-w-[58%] xl:max-w-[60%] flex flex-col items-start text-left pt-1 sm:pt-2 lg:pt-0"
                      >
                        
                        {/* 1. Top Pill Badge (if any) */}
                        {slide.badgeTag && (
                          <div className={cn(
                            "inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 hover:bg-white/15 border border-amber-400/50 backdrop-blur-md shadow-[0_0_24px_rgba(251,191,36,0.35)] mb-3 sm:mb-4 transition-all duration-300 cursor-default",
                            isActive && "animate-hero-badge"
                          )}>
                            <Sparkles className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                            <span className="text-xs sm:text-[13px] font-bold text-white tracking-wide">
                              {slide.badgeTag}
                            </span>
                            {slide.badgeYear && (
                              <span className="text-xs sm:text-[13px] font-black text-amber-300 drop-shadow-[0_0_8px_rgba(253,224,71,0.8)]">
                                {slide.badgeYear}
                              </span>
                            )}
                          </div>
                        )}

                        {/* 2. Main Headline (Left Aligned with balanced spacing) */}
                        <h1 className="text-[26px] min-[360px]:text-[28px] min-[400px]:text-[32px] sm:text-4xl md:text-5xl lg:text-[48px] xl:text-[54px] font-black tracking-tight leading-[1.2] mb-3 sm:mb-4 text-left">
                          <span className={cn(
                            "block text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)]",
                            isActive && "animate-hero-line1"
                          )}>
                            {slide.headlineLine1}
                          </span>
                          <span className={cn(
                            "block mt-1 sm:mt-1.5 pb-2 sm:pb-3 text-transparent bg-clip-text bg-gradient-to-r from-[#FFF8C5] via-[#FFD233] to-[#F59E0B] drop-shadow-[0_2px_16px_rgba(250,204,21,0.45)] font-black",
                            isActive && "animate-hero-line2"
                          )}>
                            {slide.headlineLine2}
                          </span>
                        </h1>

                        {/* 3. Supporting Subtitle / Stream Tag (Left Aligned) */}
                        {slide.streamText && (
                          <div className={cn(
                            "mb-5 sm:mb-7 text-left max-w-xl",
                            isActive && "animate-hero-subtitle"
                          )}>
                            <p className={slide.streamClass || "text-slate-100/95 font-medium text-xs sm:text-sm md:text-base tracking-wide drop-shadow-[0_1px_4px_rgba(0,0,0,0.5)]"}>
                              {slide.streamText}
                            </p>
                          </div>
                        )}

                        {/* 4. Two CTA Buttons (Left Aligned) */}
                        <div className={cn(
                          "flex flex-wrap items-center justify-start gap-3 sm:gap-4",
                          isActive && "animate-hero-cta"
                        )}>
                          {/* Primary Golden CTA Button */}
                          <button
                            type="button"
                            onClick={() => setIsEnrollOpen(true)}
                            className="group relative inline-flex items-center justify-center gap-2 h-11 sm:h-12 md:h-13 px-6 sm:px-8 md:px-9 rounded-[5px] bg-gradient-to-r from-[#F59E0B] via-[#FBBF24] to-[#D97706] hover:brightness-105 active:scale-95 text-slate-950 font-black text-xs sm:text-sm md:text-base shadow-[0_0_24px_rgba(245,158,11,0.4),0_4px_14px_rgba(0,0,0,0.4)] hover:shadow-[0_0_32px_rgba(245,158,11,0.55)] border-t border-amber-200/60 transition-all duration-200 cursor-pointer overflow-hidden"
                          >
                            <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full duration-700 bg-gradient-to-r from-transparent via-white/35 to-transparent transition-transform ease-out pointer-events-none" />
                            <Zap className="w-4 h-4 fill-slate-950 text-slate-950 shrink-0" />
                            <span className="tracking-wide">{slide.buttonText}</span>
                          </button>

                          {/* Secondary Outline Glass CTA Button: "Book Free Demo" with Phone Icon */}
                          <button
                            type="button"
                            onClick={() => setIsBookDemoOpen(true)}
                            className="inline-flex items-center justify-center gap-2 h-11 sm:h-12 md:h-13 px-5 sm:px-7 md:px-8 rounded-[5px] bg-[#0E3584]/65 hover:bg-[#154AC7]/80 border border-sky-300/50 hover:border-sky-200 text-white font-bold text-xs sm:text-sm md:text-base backdrop-blur-md shadow-[0_0_20px_rgba(37,99,235,0.30)] hover:shadow-[0_0_28px_rgba(59,130,246,0.45)] active:scale-95 transition-all duration-200 cursor-pointer"
                          >
                            <Phone className="w-4 h-4 text-cyan-300 shrink-0" />
                            <span>{slide.secondaryButtonText}</span>
                          </button>
                        </div>

                      </div>

                      {/* RIGHT COLUMN: Naturally Integrated Student Visual (Circle centered behind student & grounded to floor) */}
                      <div className="w-full lg:max-w-[42%] xl:max-w-[40%] flex items-end justify-center lg:justify-end relative mt-4 sm:mt-6 lg:mt-0 lg:self-end">
                        <div 
                          key={`student-${slide.id}-${animKey}-${isActive ? 'active' : 'idle'}`}
                          className={cn(
                            "relative w-[270px] min-[360px]:w-[290px] sm:w-[330px] md:w-[370px] lg:w-[420px] xl:w-[460px] h-[300px] min-[360px]:h-[320px] sm:h-[360px] md:h-[410px] lg:h-[480px] xl:h-[510px] flex items-end justify-center",
                            isActive && "animate-hero-student"
                          )}
                        >
                          
                          {/* 1. Luminous Stage Halo Circle Perfectly Centered on Student's Head & Torso */}
                          <div 
                            aria-hidden="true" 
                            className="absolute top-4 min-[360px]:top-6 sm:top-7 md:top-8 lg:top-8 xl:top-9 left-[56%] -translate-x-1/2 w-[260px] min-[360px]:w-[280px] sm:w-[320px] md:w-[360px] lg:w-[410px] xl:w-[430px] h-[260px] min-[360px]:h-[280px] sm:h-[320px] md:h-[360px] lg:h-[410px] xl:h-[430px] rounded-full pointer-events-none"
                            style={{
                              background: 'radial-gradient(circle, rgba(29, 78, 216, 0.55) 0%, rgba(59, 130, 246, 0.28) 55%, transparent 75%)',
                              border: '1.5px solid rgba(147, 197, 253, 0.55)',
                              boxShadow: '0 0 42px rgba(37, 99, 235, 0.45)'
                            }}
                          />

                          {/* 2. Student Photo with Soft Feathered Bottom Mask (Smooth fade into floor without dark rectangle seam) */}
                          <div 
                            className="relative w-full h-full"
                            style={{
                              maskImage: 'linear-gradient(to bottom, black 0%, black 78%, rgba(0,0,0,0.5) 89%, transparent 100%)',
                              WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 78%, rgba(0,0,0,0.5) 89%, transparent 100%)',
                            }}
                          >
                            <Image
                              src={slide.studentImage}
                              alt={slide.studentAlt}
                              fill
                              sizes="(max-width: 640px) 290px, (max-width: 1024px) 370px, 460px"
                              className="object-contain object-bottom drop-shadow-[0_16px_36px_rgba(0,0,0,0.6)]"
                              priority
                            />
                          </div>

                        </div>
                      </div>

                    </div>

                  </div>

                </CarouselItem>
                );
              })}
            </CarouselContent>
          </Carousel>

          {/* Bottom Slider Controls: Left Animated Progress Line + Right Circular Outline Buttons */}
          <div className="absolute bottom-14 sm:bottom-16 lg:bottom-20 left-0 right-0 z-30 pointer-events-auto px-4 sm:px-8 md:px-12 lg:px-16">
            <div className="max-w-7xl mx-auto flex items-center justify-between sm:justify-start lg:justify-start gap-4 sm:gap-6">
              
              {/* Progress Line Track (Starting to end color fill, transitions slide when full) */}
              <div 
                className="flex-1 max-w-[180px] min-[360px]:max-w-[220px] sm:max-w-[280px] md:max-w-[340px] lg:max-w-[380px] h-[2.5px] sm:h-[3px] bg-white/40 rounded-full overflow-hidden relative shadow-[0_0_6px_rgba(0,0,0,0.5)]"
                aria-label="Slide transition progress"
              >
                <div 
                  className="h-full bg-gradient-to-r from-[#F59E0B] via-[#FDE047] to-white shadow-[0_0_12px_rgba(250,204,21,0.95)] rounded-full transition-all duration-75 ease-linear"
                  style={{ width: `${progress}%` }}
                />
              </div>

              {/* Circular Outline Navigation Buttons (Bina background, only circular outline & shape) */}
              <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
                <button
                  type="button"
                  onClick={handlePrev}
                  aria-label="Previous slide"
                  className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full border border-white/60 hover:border-white hover:bg-white/10 active:scale-95 flex items-center justify-center text-white transition-all duration-200 cursor-pointer backdrop-blur-xs shadow-[0_0_12px_rgba(255,255,255,0.12)]"
                >
                  <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.2]" />
                </button>

                <button
                  type="button"
                  onClick={handleNext}
                  aria-label="Next slide"
                  className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full border border-white/60 hover:border-white hover:bg-white/10 active:scale-95 flex items-center justify-center text-white transition-all duration-200 cursor-pointer backdrop-blur-xs shadow-[0_0_12px_rgba(255,255,255,0.12)]"
                >
                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.2]" />
                </button>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* Popups & Modals */}
      <EnrollNowModal 
        isOpen={isEnrollOpen} 
        onOpenChange={setIsEnrollOpen} 
        programTitle="JEE / NEET Target Program"
        allowedClasses={JEE_NEET_CLASSES}
        allowedCourses={JEE_NEET_COURSES}
        defaultClass={JEE_NEET_CLASSES[0]}
        defaultCourse={JEE_NEET_COURSES[0]}
        source="Main Hero - JEE / NEET Slide"
      />
      <AdmissionModal isOpen={isAdmissionOpen} onOpenChange={setIsAdmissionOpen} />
      <BookDemoModal isOpen={isBookDemoOpen} onOpenChange={setIsBookDemoOpen} />
    </>
  );
}
