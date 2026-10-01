'use client';

import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "../ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import type { THeroSlide } from "@/app/actions/types";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface HeroSlideItem {
  id: string;
  bulletText: string;
  yearText: string;
  courseLine1: string;
  courseLine2: string;
  buttonText: string;
  buttonLink: string;
  imageSrc: string;
}

// 2 identical slides of this same design so carousel functions with smooth transitions
const heroSlidesList: HeroSlideItem[] = [
  {
    id: "admission-slide-1",
    bulletText: "Admission Started",
    yearText: "2025–26",
    courseLine1: "Foundation 4–10 | 11 & 12 | JEE | NEET | CUET",
    courseLine2: "SCIENCE, COMMERCE, HUMANITIES",
    buttonText: "Enroll Now",
    buttonLink: "/admission",
    imageSrc: "/scholarship.png",
  },
  {
    id: "admission-slide-2",
    bulletText: "Admission Started",
    yearText: "2025–26",
    courseLine1: "Foundation 4–10 | 11 & 12 | JEE | NEET | CUET",
    courseLine2: "SCIENCE, COMMERCE, HUMANITIES",
    buttonText: "Enroll Now",
    buttonLink: "/admission",
    imageSrc: "/scholarship.png",
  },
];

export function BuildSkillsSection({ slides: _initialSlides }: { slides?: THeroSlide[] }) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  const autoplayPlugin = useRef(
    Autoplay({ delay: 5000, stopOnInteraction: false, stopOnMouseEnter: true })
  );

  useEffect(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  const scrollTo = useCallback(
    (index: number) => {
      api?.scrollTo(index);
    },
    [api]
  );

  return (
    <section suppressHydrationWarning className="w-full pt-0 pb-0 bg-white dark:bg-background">
      <div className="w-full px-0">
        <div className="relative w-full rounded-none overflow-hidden bg-[#061230] select-none">
          <Carousel 
            setApi={setApi}
            opts={{ loop: true }}
            plugins={[autoplayPlugin.current]} 
            className="w-full"
          >
            <CarouselContent>
              {heroSlidesList.map((slide) => (
                <CarouselItem key={slide.id} className="rounded-none overflow-hidden">
                  
                  {/* ── 1. DEDICATED MOBILE HERO SECTION (< 768px ONLY) ── */}
                  <div className="block md:hidden relative w-full overflow-hidden bg-gradient-to-b from-[#061230] via-[#091E4C] to-[#040E26] pt-6 min-[390px]:pt-7 pb-0 px-4 min-[390px]:px-5 select-none">
                    
                    {/* Subtle Ambient Radial Lighting */}
                    <div 
                      className="absolute -top-20 left-1/2 -translate-x-1/2 w-[340px] min-[390px]:w-[380px] h-[220px] rounded-full pointer-events-none blur-3xl opacity-75"
                      style={{ background: 'radial-gradient(ellipse at center, rgba(56, 189, 248, 0.2) 0%, transparent 70%)' }}
                    />
                    <div 
                      className="absolute bottom-4 right-[-10%] w-[260px] h-[200px] rounded-full pointer-events-none blur-3xl opacity-50"
                      style={{ background: 'radial-gradient(ellipse at center, rgba(21, 94, 239, 0.25) 0%, transparent 70%)' }}
                    />

                    {/* Micro Grid Pattern for Texture */}
                    <div 
                      className="absolute inset-0 pointer-events-none opacity-[0.035]"
                      style={{
                        backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.9) 1px, transparent 1px)`,
                        backgroundSize: '24px 24px'
                      }}
                    />

                    {/* Dedicated Center-Aligned Mobile Composition */}
                    <div className="relative z-10 w-full max-w-[390px] mx-auto flex flex-col items-center text-center">
                      
                      {/* Main Heading: Admission Started with bullet point */}
                      <div className="inline-flex items-center gap-2 text-[13px] min-[390px]:text-[14.5px] sm:text-base font-bold tracking-wide text-sky-300 drop-shadow-xs">
                        <span className="w-1.5 h-1.5 min-[390px]:w-2 min-[390px]:h-2 rounded-full bg-sky-400 shrink-0 shadow-[0_0_8px_rgba(56,189,248,0.9)]" />
                        <span>{slide.bulletText}</span>
                      </div>

                      {/* Strongest Visual Element: 2025-26 */}
                      <h1 className="text-[44px] min-[390px]:text-[52px] sm:text-6xl font-black tracking-tight text-white leading-none pt-1 pb-2 drop-shadow-sm">
                        {slide.yearText}
                      </h1>

                      {/* Supporting Text: Course Categories */}
                      <div className="space-y-1 pb-3">
                        <p className="text-[11.5px] min-[390px]:text-[12.5px] sm:text-sm font-semibold text-slate-200 tracking-wide leading-snug">
                          {slide.courseLine1}
                        </p>
                        <p className="text-[10px] min-[390px]:text-[11px] sm:text-xs font-extrabold text-amber-300 tracking-[0.08em] uppercase">
                          {slide.courseLine2}
                        </p>
                      </div>

                      {/* Clear CTA Button: Enroll Now */}
                      <div className="pb-2">
                        <Link
                          href={slide.buttonLink}
                          className="inline-flex items-center justify-center gap-2 h-10 min-[390px]:h-11 px-7 min-[390px]:px-8 rounded-full bg-[#155EEF] hover:bg-[#1048B8] active:bg-[#0C3894] text-white font-bold text-[13px] min-[390px]:text-sm shadow-md shadow-blue-600/35 active:scale-95 transition-all cursor-pointer select-none"
                        >
                          <span>{slide.buttonText}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>

                      {/* Natural Student Visual in Lower Area (Anchored to touch bottom 100%) */}
                      <div className="relative w-full flex justify-center items-end mt-1 overflow-visible">
                        <div className="relative w-[280px] min-[390px]:w-[315px] min-[420px]:w-[340px] shrink-0 flex items-end justify-center">
                          <img
                            src={slide.imageSrc}
                            alt="IDL Education Student"
                            className="w-full h-auto object-contain object-bottom select-none pointer-events-none drop-shadow-[0_16px_36px_rgba(0,0,0,0.65)] block"
                            loading="eager"
                          />
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* ── 2. DEDICATED DESKTOP HERO SECTION (>= 768px ONLY) ── */}
                  <div className="hidden md:block relative w-full overflow-hidden bg-gradient-to-b from-[#061230] via-[#091E4C] to-[#040E26] pt-10 md:pt-12 lg:pt-14 pb-0 px-6 sm:px-10 md:px-12 lg:px-16 xl:px-20 select-none">
                    
                    {/* Top Ambient Glow Flare */}
                    <div 
                      className="absolute -top-32 left-1/3 w-[600px] lg:w-[850px] h-[360px] rounded-full pointer-events-none blur-3xl opacity-75"
                      style={{ background: 'radial-gradient(ellipse at center, rgba(56, 189, 248, 0.22) 0%, transparent 70%)' }}
                    />
                    <div 
                      className="absolute bottom-0 right-1/4 w-[500px] h-[300px] rounded-full pointer-events-none blur-3xl opacity-45"
                      style={{ background: 'radial-gradient(ellipse at center, rgba(21, 94, 239, 0.28) 0%, transparent 70%)' }}
                    />

                    {/* Micro Grid Dot Pattern for Texture */}
                    <div 
                      className="absolute inset-0 pointer-events-none opacity-[0.035]"
                      style={{
                        backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.9) 1px, transparent 1px)`,
                        backgroundSize: '28px 28px'
                      }}
                    />

                    {/* Desktop Balanced Composition (Text Left Vertically Balanced, Student Right Anchored to Bottom) */}
                    <div className="relative z-10 w-full max-w-7xl mx-auto flex items-center justify-between gap-8 lg:gap-12 xl:gap-16 min-h-[460px] md:min-h-[490px] lg:min-h-[520px]">
                      
                      {/* Left Column: Text Content (Shifted Upward by ~40px as a Single Unit for Perfect Optical Balance) */}
                      <div className="flex flex-col items-start text-left max-w-lg lg:max-w-xl self-center -translate-y-10 pt-3 md:pt-4 pb-10 md:pb-12 lg:pb-14">
                        
                        {/* 1. Main Heading: • Admission Started (Supporting Micro-Label) */}
                        <div className="inline-flex items-center gap-2 text-xs md:text-sm lg:text-[14.5px] font-bold tracking-[0.06em] text-sky-300 drop-shadow-xs mb-2 md:mb-2.5">
                          <span className="w-2 h-2 rounded-full bg-sky-400 shrink-0 shadow-[0_0_8px_rgba(56,189,248,0.9)]" />
                          <span>{slide.bulletText}</span>
                        </div>

                        {/* 2. Strongest Visual Element: 2025-26 (Dominant Headline, Refined & Proportional) */}
                        <h1 className="text-4xl md:text-[3.5rem] lg:text-[4.25rem] xl:text-[4.8rem] font-black tracking-[-0.025em] text-white leading-none pb-2.5 md:pb-3 drop-shadow-sm">
                          {slide.yearText}
                        </h1>

                        {/* 3. Supporting Text: Course Categories (Clearly Readable, Secondary) */}
                        <div className="space-y-1.5 pb-6 md:pb-7">
                          <p className="text-sm md:text-base lg:text-[1.05rem] font-semibold text-slate-200/95 tracking-[0.01em] leading-snug">
                            {slide.courseLine1}
                          </p>
                          <p className="text-[11px] md:text-xs lg:text-[12.5px] font-extrabold text-amber-300 tracking-[0.08em] uppercase">
                            {slide.courseLine2}
                          </p>
                        </div>

                        {/* 4. Clear CTA Button: Enroll Now (Refined Premium Desktop Dimensions) */}
                        <div className="pt-0.5">
                          <Link
                            href={slide.buttonLink}
                            className="inline-flex items-center justify-center gap-2.5 h-11 lg:h-12 px-7 lg:px-8 rounded-full bg-[#155EEF] hover:bg-[#1048B8] active:bg-[#0C3894] text-white font-bold text-sm lg:text-[14.5px] shadow-md shadow-blue-600/35 hover:shadow-blue-600/50 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer select-none"
                          >
                            <span>{slide.buttonText}</span>
                            <ArrowRight className="w-4 h-4" />
                          </Link>
                        </div>

                      </div>

                      {/* Right Column: Student Visual (Properly Scaled & Naturally Integrated, 100% Touch at Bottom) */}
                      <div className="relative flex justify-center items-end shrink-0 w-[300px] md:w-[350px] lg:w-[410px] xl:w-[450px] self-end mr-0 lg:mr-2 xl:mr-4">
                        <img
                          src={slide.imageSrc}
                          alt="IDL Education Student"
                          className="w-full h-auto object-contain object-bottom select-none pointer-events-none drop-shadow-[0_20px_40px_rgba(0,0,0,0.65)] block"
                          loading="eager"
                        />
                      </div>

                    </div>

                  </div>

                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>

          {/* Dotted Switch Indicators (Exactly like Academic Results, No Outline, Only Dotted, Positioned Directly Above Courses We Offer Card) */}
          <div className="absolute bottom-8 min-[390px]:bottom-10 md:bottom-16 lg:bottom-20 xl:bottom-22 left-1/2 -translate-x-1/2 z-30 flex justify-center items-center gap-1.5 sm:gap-2 pointer-events-auto select-none">
            {heroSlidesList.map((_, i) => (
              <button
                key={i}
                onClick={() => scrollTo(i)}
                aria-label={`Jump to slide ${i + 1}`}
                className="p-1 cursor-pointer flex items-center justify-center min-w-[18px] min-h-[18px]"
              >
                <span
                  className={cn(
                    "rounded-full transition-all duration-300",
                    (current % heroSlidesList.length) === i 
                      ? "w-6 sm:w-7 h-1.5 bg-[#155EEF] shadow-[0_0_8px_rgba(21,94,239,0.7)]" 
                      : "w-1.5 h-1.5 bg-white/40 hover:bg-white/70"
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