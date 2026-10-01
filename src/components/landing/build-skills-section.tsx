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
        <div className="relative w-full rounded-none overflow-hidden bg-[#020B21] select-none">
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
                  <div 
                    className="block md:hidden relative w-full overflow-hidden pt-5 min-[390px]:pt-6 pb-0 px-5 min-[360px]:px-6 min-[390px]:px-7 select-none"
                    style={{
                      background: 'radial-gradient(ellipse 120% 100% at 85% 65%, #0A2B70 0%, #051A46 45%, #020B21 100%)'
                    }}
                  >
                    
                    {/* Atmospheric Lighting — Top-Left Soft Sky Glow */}
                    <div 
                      aria-hidden="true"
                      className="absolute -top-16 -left-12 w-[280px] h-[220px] rounded-full pointer-events-none blur-[65px] opacity-70"
                      style={{ background: 'radial-gradient(ellipse at center, rgba(56, 189, 248, 0.28) 0%, rgba(21, 94, 239, 0.22) 50%, transparent 75%)' }}
                    />

                    {/* Atmospheric Lighting — Bottom-Right Luminous Student Halo */}
                    <div 
                      aria-hidden="true"
                      className="absolute bottom-0 -right-8 w-[280px] h-[280px] rounded-full pointer-events-none blur-[70px] opacity-75"
                      style={{ background: 'radial-gradient(ellipse at center, rgba(21, 94, 239, 0.45) 0%, rgba(59, 130, 246, 0.2) 55%, transparent 75%)' }}
                    />

                    {/* Subtle Architectural Concentric Rings (IDL Brand Motif) */}
                    <div 
                      aria-hidden="true"
                      className="absolute top-1/2 -translate-y-1/2 -right-20 w-[340px] h-[340px] rounded-full border border-blue-400/[0.08] pointer-events-none" 
                    />
                    <div 
                      aria-hidden="true"
                      className="absolute top-1/2 -translate-y-1/2 -right-8 w-[240px] h-[240px] rounded-full border border-sky-400/[0.06] pointer-events-none" 
                    />
                    <div 
                      aria-hidden="true"
                      className="absolute -top-20 -left-16 w-[220px] h-[220px] rounded-full border border-blue-300/[0.05] pointer-events-none" 
                    />

                    {/* Dedicated Left-Aligned Mobile Composition */}
                    <div className="relative z-10 w-full max-w-[420px] mx-auto flex flex-col items-start text-left">
                      
                      {/* Main Heading: Admission Started with live pulse bullet (Left-aligned, secondary) */}
                      <div className="inline-flex items-center gap-1.5 text-[11.5px] min-[390px]:text-[12.5px] sm:text-[13.5px] font-bold tracking-wide text-sky-300 drop-shadow-xs mb-1 select-none">
                        <span className="relative flex h-2 w-2 shrink-0">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75" />
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.9)]" />
                        </span>
                        <span>{slide.bulletText}</span>
                      </div>

                      {/* Strongest Visual Element: 2025-26 (Left-aligned, refined & dominant) */}
                      <h1 className="text-[36px] min-[360px]:text-[40px] min-[390px]:text-[46px] sm:text-[52px] font-black tracking-tight text-white leading-none pb-2 min-[390px]:pb-2.5 drop-shadow-sm text-left">
                        {slide.yearText}
                      </h1>

                      {/* Supporting Text: Course Categories (Harmonious ice-blue tint, comfortable line-height) */}
                      <div className="space-y-1.5 min-[390px]:space-y-2 pb-3.5 min-[390px]:pb-4 text-left max-w-[320px]">
                        <p className="text-[11px] min-[360px]:text-[11.5px] min-[390px]:text-[12.5px] sm:text-[13.5px] font-semibold text-[#DCE8F8] tracking-[0.01em] leading-normal">
                          {slide.courseLine1}
                        </p>
                        <p className="text-[9.5px] min-[360px]:text-[10px] min-[390px]:text-[10.5px] sm:text-[11.5px] font-bold text-amber-300 tracking-[0.07em] uppercase leading-normal">
                          {slide.courseLine2}
                        </p>
                      </div>

                      {/* Clear CTA Button: Enroll Now (Luminous premium gradient, refined border highlight) */}
                      <div className="pb-1 text-left w-full flex justify-start">
                        <Link
                          href={slide.buttonLink}
                          className="inline-flex items-center justify-center gap-2 h-9 min-[390px]:h-[38px] sm:h-10 px-6 min-[390px]:px-7 sm:px-8 rounded-full bg-gradient-to-r from-[#155EEF] to-[#2563EB] hover:from-[#1048B8] hover:to-[#1D4ED8] active:from-[#0C3894] active:to-[#1742B0] text-white font-bold text-[12.5px] min-[390px]:text-[13px] sm:text-[13.5px] shadow-[0_2px_12px_rgba(21,94,239,0.3)] border border-blue-400/25 active:scale-95 transition-all cursor-pointer select-none"
                        >
                          <span>{slide.buttonText}</span>
                          <ArrowRight className="w-3.5 h-3.5 stroke-[2.4]" />
                        </Link>
                      </div>

                      {/* Natural Student Visual in Lower-Right Area (Positioned slightly higher, visually connecting with text block) */}
                      <div className="relative w-full flex justify-end items-end -mt-5 min-[390px]:-mt-7 sm:-mt-8 overflow-visible pointer-events-none">
                        <div className="relative w-[250px] min-[360px]:w-[275px] min-[390px]:w-[305px] min-[420px]:w-[330px] shrink-0 flex items-end justify-end -mr-3 min-[390px]:-mr-2">
                          <img
                            src={slide.imageSrc}
                            alt="IDL Education Student"
                            className="w-full h-auto object-contain object-bottom select-none drop-shadow-[0_16px_36px_rgba(0,0,0,0.65)] block"
                            loading="eager"
                          />
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* ── 2. DEDICATED DESKTOP HERO SECTION (>= 768px ONLY) ── */}
                  <div 
                    className="hidden md:block relative w-full overflow-hidden pt-6 md:pt-7 lg:pt-8 pb-0 px-6 sm:px-10 md:px-12 lg:px-16 xl:px-20 select-none"
                    style={{
                      background: 'radial-gradient(ellipse 110% 100% at 80% 55%, #0B2E75 0%, #061F52 40%, #030E29 75%, #020B21 100%)'
                    }}
                  >
                    
                    {/* Top-Left Ambient Celestial Glow (Behind Text) */}
                    <div 
                      aria-hidden="true"
                      className="absolute -top-32 left-[8%] w-[600px] lg:w-[750px] h-[380px] rounded-full pointer-events-none blur-[95px] opacity-70"
                      style={{ background: 'radial-gradient(ellipse at center, rgba(56, 189, 248, 0.24) 0%, rgba(21, 94, 239, 0.25) 50%, transparent 75%)' }}
                    />

                    {/* Right Ambient Sapphire Halo (Studio Backlight for Student Photo) */}
                    <div 
                      aria-hidden="true"
                      className="absolute bottom-0 right-[4%] w-[580px] lg:w-[720px] h-[450px] rounded-full pointer-events-none blur-[90px] opacity-75"
                      style={{ background: 'radial-gradient(ellipse at center, rgba(21, 94, 239, 0.42) 0%, rgba(59, 130, 246, 0.22) 50%, transparent 75%)' }}
                    />

                    {/* Subtle Concentric Rings & Brand Orbit Arcs */}
                    <div 
                      aria-hidden="true"
                      className="absolute top-1/2 -translate-y-1/2 right-[-6%] w-[720px] h-[720px] rounded-full border border-blue-400/[0.08] pointer-events-none" 
                    />
                    <div 
                      aria-hidden="true"
                      className="absolute top-1/2 -translate-y-1/2 right-[1%] w-[560px] h-[560px] rounded-full border border-sky-400/[0.06] pointer-events-none" 
                    />
                    <div 
                      aria-hidden="true"
                      className="absolute top-1/2 -translate-y-1/2 right-[8%] w-[400px] h-[400px] rounded-full border border-blue-300/[0.05] pointer-events-none" 
                    />
                    <div 
                      aria-hidden="true"
                      className="absolute -top-40 -left-36 w-[480px] h-[480px] rounded-full border border-blue-400/[0.05] pointer-events-none" 
                    />

                    {/* Desktop Balanced Composition (Tighter ~16% Shorter Height, Left-Aligned Text, Right Anchored Student) */}
                    <div className="relative z-10 w-full max-w-7xl mx-auto flex items-center justify-between gap-8 lg:gap-12 xl:gap-16 min-h-[360px] md:min-h-[390px] lg:min-h-[415px]">
                      
                      {/* Left Column: Text Content (Repositioned slightly upward and vertically balanced) */}
                      <div className="flex flex-col items-start text-left max-w-md lg:max-w-lg self-center -translate-y-6 md:-translate-y-8 lg:-translate-y-9 pt-1 md:pt-2 pb-2 md:pb-3">
                        
                        {/* 1. Main Heading: • Admission Started (Live pulse bullet, supporting micro-label) */}
                        <div className="inline-flex items-center gap-2 text-xs md:text-[12.5px] lg:text-[13px] font-bold tracking-[0.06em] text-sky-300 drop-shadow-xs mb-1 md:mb-1.5 select-none">
                          <span className="relative flex h-2 w-2 shrink-0">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75" />
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.9)]" />
                          </span>
                          <span>{slide.bulletText}</span>
                        </div>

                        {/* 2. Strongest Visual Element: 2025-26 (Reduced ~8-10%, Dominant & Proportionate) */}
                        <h1 className="text-3xl md:text-[2.75rem] lg:text-[3.35rem] xl:text-[3.8rem] font-black tracking-[-0.025em] text-white leading-none pb-2 md:pb-2.5 drop-shadow-sm text-left">
                          {slide.yearText}
                        </h1>

                        {/* 3. Supporting Text: Course Categories (Ice-blue tone, clearly readable) */}
                        <div className="space-y-1 pb-3.5 md:pb-4 text-left">
                          <p className="text-xs md:text-[13.5px] lg:text-[14.5px] font-semibold text-[#DCE8F8] tracking-normal leading-snug">
                            {slide.courseLine1}
                          </p>
                          <p className="text-[10px] md:text-[11px] lg:text-[11.5px] font-bold text-amber-300 tracking-[0.07em] uppercase">
                            {slide.courseLine2}
                          </p>
                        </div>

                        {/* 4. Clear CTA Button: Enroll Now (Luminous premium gradient, refined border highlight) */}
                        <div className="pt-0.5 text-left">
                          <Link
                            href={slide.buttonLink}
                            className="inline-flex items-center justify-center gap-2 h-9.5 md:h-10 lg:h-[40px] px-5.5 md:px-6 lg:px-6.5 rounded-full bg-gradient-to-r from-[#155EEF] to-[#2563EB] hover:from-[#1048B8] hover:to-[#1D4ED8] active:from-[#0C3894] active:to-[#1742B0] text-white font-bold text-[13px] shadow-[0_2px_12px_rgba(21,94,239,0.3)] hover:shadow-[0_4px_16px_rgba(21,94,239,0.4)] border border-blue-400/25 hover:scale-[1.01] active:scale-95 transition-all cursor-pointer select-none"
                          >
                            <span>{slide.buttonText}</span>
                            <ArrowRight className="w-3.5 h-3.5 stroke-[2.4]" />
                          </Link>
                        </div>

                      </div>

                      {/* Right Column: Student Visual (Slightly Enlarged, Lower/Right Anchored without Cropping) */}
                      <div className="relative flex justify-end items-end shrink-0 w-[320px] md:w-[375px] lg:w-[440px] xl:w-[480px] self-end mr-[-4px] md:mr-0 lg:mr-2 xl:mr-4 translate-y-1 md:translate-y-2">
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

          {/* Dotted Switch Indicators (Repositioned slightly upward on desktop) */}
          <div className="absolute bottom-8 min-[390px]:bottom-10 md:bottom-13 lg:bottom-15 xl:bottom-17 left-1/2 -translate-x-1/2 z-30 flex justify-center items-center gap-1.5 sm:gap-2 pointer-events-auto select-none">
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