'use client';

import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "../ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import type { THeroSlide } from "@/app/actions/types";
import { ArrowRight } from "lucide-react";
import { AdmissionModal } from "@/components/admission-modal";

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
    yearText: "2026–27",
    courseLine1: "Foundation 4–10 | 11 & 12 | JEE | NEET | CUET",
    courseLine2: "SCIENCE, COMMERCE, HUMANITIES",
    buttonText: "Enroll Now",
    buttonLink: "/admission",
    imageSrc: "/scholarship.png",
  },
  {
    id: "admission-slide-2",
    bulletText: "Admission Started",
    yearText: "2026–27",
    courseLine1: "Foundation 4–10 | 11 & 12 | JEE | NEET | CUET",
    courseLine2: "SCIENCE, COMMERCE, HUMANITIES",
    buttonText: "Enroll Now",
    buttonLink: "/admission",
    imageSrc: "/scholarship.png",
  },
];

// ── Enhanced Background Components (Premium Dark Navy + Electric Blue + Orbits + Dotted Grids + Academic Motif) ──

function DesktopHeroBackground() {
  return (
    <div 
      aria-hidden="true" 
      className="absolute inset-0 pointer-events-none select-none overflow-hidden z-0"
      style={{
        background: 'radial-gradient(ellipse 100% 90% at 80% 50%, #0B3386 0%, #072464 35%, #031135 70%, #020B21 100%)'
      }}
    >
      {/* 1. Top Edge Electric Highlight */}
      <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-sky-400/35 to-transparent" />

      {/* 2. Top-Left Celestial Ambient Glow (Behind Text) */}
      <div 
        className="absolute -top-36 left-[6%] w-[650px] lg:w-[800px] h-[400px] rounded-full blur-[95px] opacity-75"
        style={{ background: 'radial-gradient(ellipse at center, rgba(56, 189, 248, 0.24) 0%, rgba(21, 94, 239, 0.22) 50%, transparent 75%)' }}
      />

      {/* 3. Right Ambient Sapphire Halo (Studio Backlight for Student Photo) */}
      <div 
        className="absolute bottom-0 right-[2%] w-[620px] lg:w-[780px] h-[480px] rounded-full blur-[90px] opacity-80"
        style={{ background: 'radial-gradient(ellipse at center, rgba(21, 94, 239, 0.46) 0%, rgba(59, 130, 246, 0.24) 50%, transparent 75%)' }}
      />

      {/* 4. Bottom-Left Subtle Azure Depth Glow */}
      <div 
        className="absolute -bottom-20 left-[22%] w-[450px] h-[260px] rounded-full blur-[85px] opacity-40"
        style={{ background: 'radial-gradient(ellipse at center, rgba(30, 64, 175, 0.35) 0%, rgba(21, 94, 239, 0.15) 50%, transparent 75%)' }}
      />

      {/* 5. Precision SVG Orbital Arcs & Curved Geometric Lines */}
      <svg 
        className="absolute inset-0 w-full h-full" 
        viewBox="0 0 1440 440" 
        preserveAspectRatio="xMidYMid slice" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="deskOrbitGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.28" />
            <stop offset="45%" stopColor="#2563EB" stopOpacity="0.16" />
            <stop offset="100%" stopColor="#1E40AF" stopOpacity="0.03" />
          </linearGradient>
          <linearGradient id="deskOrbitGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#60A5FA" stopOpacity="0.22" />
            <stop offset="55%" stopColor="#1D4ED8" stopOpacity="0.10" />
            <stop offset="100%" stopColor="#0B2E75" stopOpacity="0.02" />
          </linearGradient>
          <linearGradient id="deskWaveGrad" x1="0%" y1="50%" x2="100%" y2="50%">
            <stop offset="0%" stopColor="#38BDF8" stopOpacity="0" />
            <stop offset="30%" stopColor="#38BDF8" stopOpacity="0.16" />
            <stop offset="70%" stopColor="#2563EB" stopOpacity="0.20" />
            <stop offset="100%" stopColor="#1D4ED8" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Concentric Orbital Rings Radiating from Right */}
        <circle cx="1180" cy="220" r="190" stroke="url(#deskOrbitGrad1)" strokeWidth="1" />
        <circle cx="1180" cy="220" r="275" stroke="url(#deskOrbitGrad2)" strokeWidth="1" strokeDasharray="5 7" />
        <circle cx="1180" cy="220" r="365" stroke="url(#deskOrbitGrad1)" strokeWidth="1" />
        <circle cx="1180" cy="220" r="470" stroke="url(#deskOrbitGrad2)" strokeWidth="1" strokeDasharray="6 9" />
        <circle cx="1180" cy="220" r="590" stroke="url(#deskOrbitGrad1)" strokeWidth="1" />
        <circle cx="1180" cy="220" r="740" stroke="url(#deskOrbitGrad2)" strokeWidth="1" opacity="0.6" />

        {/* Elliptical Tilted Orbit with Celestial Pulse Dot */}
        <ellipse 
          cx="1150" 
          cy="225" 
          rx="440" 
          ry="190" 
          transform="rotate(-16 1150 225)" 
          stroke="url(#deskOrbitGrad1)" 
          strokeWidth="1.2" 
          strokeDasharray="4 8"
        />
        <circle cx="740" cy="180" r="3" fill="#38BDF8" opacity="0.8" />
        <circle cx="740" cy="180" r="7" fill="#38BDF8" opacity="0.2" />

        {/* Sweeping Dynamic Geometric Wave Arc */}
        <path 
          d="M -50 340 C 280 230, 680 390, 1500 240" 
          stroke="url(#deskWaveGrad)" 
          strokeWidth="1.2" 
        />
        <path 
          d="M -20 375 C 320 270, 720 430, 1520 280" 
          stroke="url(#deskWaveGrad)" 
          strokeWidth="1" 
          opacity="0.6" 
          strokeDasharray="8 6" 
        />

        {/* Top-Left Concentric Ambient Arc */}
        <circle cx="0" cy="0" r="260" stroke="url(#deskOrbitGrad1)" strokeWidth="1" opacity="0.5" />
        <circle cx="0" cy="0" r="380" stroke="url(#deskOrbitGrad2)" strokeWidth="1" strokeDasharray="4 8" opacity="0.4" />
      </svg>

      {/* 6. Minimal Dotted Matrix Accents */}
      {/* Top-Left Dot Cluster (offset from text) */}
      <div className="absolute top-6 left-12 lg:left-16 pointer-events-none opacity-50">
        <svg width="68" height="48" viewBox="0 0 68 48" fill="none">
          {[0, 1, 2, 3].map((r) =>
            [0, 1, 2, 3, 4].map((c) => (
              <circle
                key={`tl-${r}-${c}`}
                cx={c * 14 + 6}
                cy={r * 12 + 6}
                r="1.5"
                fill="#60A5FA"
                opacity={0.3 + ((c + r) % 3) * 0.22}
              />
            ))
          )}
        </svg>
      </div>

      {/* Top-Right Dot Cluster */}
      <div className="absolute top-7 right-14 lg:right-24 pointer-events-none opacity-55">
        <svg width="82" height="54" viewBox="0 0 82 54" fill="none">
          {[0, 1, 2, 3].map((r) =>
            [0, 1, 2, 3, 4, 5].map((c) => (
              <circle
                key={`tr-${r}-${c}`}
                cx={c * 13 + 6}
                cy={r * 13 + 6}
                r="1.4"
                fill="#38BDF8"
                opacity={0.25 + ((5 - c) % 3) * 0.2}
              />
            ))
          )}
        </svg>
      </div>

      {/* Bottom-Left Margin Subtle Dot Strip */}
      <div className="absolute bottom-16 left-8 lg:left-12 pointer-events-none opacity-30">
        <svg width="32" height="56" viewBox="0 0 32 56" fill="none">
          {[0, 1, 2, 3].map((r) =>
            [0, 1].map((c) => (
              <circle
                key={`bl-${r}-${c}`}
                cx={c * 15 + 6}
                cy={r * 14 + 6}
                r="1.3"
                fill="#93C5FD"
              />
            ))
          )}
        </svg>
      </div>

      {/* 7. Subtle Academic-Inspired Graduation-Cap Outline Motif */}
      <div 
        className="absolute top-8 md:top-10 lg:top-11 right-[38%] lg:right-[36%] xl:right-[34%] pointer-events-none opacity-25 transform -rotate-6 scale-95 lg:scale-105"
      >
        <svg 
          width="116" 
          height="102" 
          viewBox="0 0 116 102" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="stroke-sky-300 drop-shadow-[0_0_10px_rgba(56,189,248,0.35)]"
        >
          {/* Mortarboard Diamond Top */}
          <path 
            d="M58 20 L100 40 L58 60 L16 40 Z" 
            strokeWidth="1.5" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            fill="rgba(56, 189, 248, 0.04)"
          />
          {/* Cap Skull Underneath */}
          <path 
            d="M32 48 V 66 C 32 76, 84 76, 84 66 V 48" 
            strokeWidth="1.4" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />
          {/* Tassel String & Hanging Brush */}
          <path 
            d="M58 40 V 50 C 58 58, 48 62, 48 72" 
            strokeWidth="1.4" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />
          <circle cx="48" cy="74.5" r="2.5" fill="#38BDF8" strokeWidth="0" />
          <path 
            d="M46 77 L45 84 M48 77 L48 85 M50 77 L51 84" 
            strokeWidth="1.2" 
            strokeLinecap="round" 
          />
        </svg>
      </div>
    </div>
  );
}

function MobileHeroBackground() {
  return (
    <div 
      aria-hidden="true" 
      className="absolute inset-0 pointer-events-none select-none overflow-hidden z-0"
      style={{
        background: 'radial-gradient(ellipse 110% 90% at 85% 60%, #0B3386 0%, #062058 42%, #031135 75%, #020B21 100%)'
      }}
    >
      {/* 1. Top Edge Subtle Electric Accent */}
      <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-sky-400/30 to-transparent" />

      {/* 2. Atmospheric Lighting — Top-Left Soft Sky Glow */}
      <div 
        className="absolute -top-16 -left-12 w-[290px] h-[230px] rounded-full blur-[65px] opacity-75"
        style={{ background: 'radial-gradient(ellipse at center, rgba(56, 189, 248, 0.26) 0%, rgba(21, 94, 239, 0.20) 50%, transparent 75%)' }}
      />

      {/* 3. Atmospheric Lighting — Bottom-Right Luminous Student Halo */}
      <div 
        className="absolute bottom-0 -right-8 w-[290px] h-[290px] rounded-full blur-[70px] opacity-80"
        style={{ background: 'radial-gradient(ellipse at center, rgba(21, 94, 239, 0.46) 0%, rgba(59, 130, 246, 0.22) 55%, transparent 75%)' }}
      />

      {/* 4. Precision SVG Orbital Arcs & Curved Geometric Lines */}
      <svg 
        className="absolute inset-0 w-full h-full" 
        viewBox="0 0 420 480" 
        preserveAspectRatio="xMidYMid slice" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="mobOrbitGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.26" />
            <stop offset="50%" stopColor="#2563EB" stopOpacity="0.14" />
            <stop offset="100%" stopColor="#1E40AF" stopOpacity="0.02" />
          </linearGradient>
          <linearGradient id="mobOrbitGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#60A5FA" stopOpacity="0.20" />
            <stop offset="60%" stopColor="#1D4ED8" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#0B2E75" stopOpacity="0.01" />
          </linearGradient>
        </defs>

        {/* Concentric Orbital Arcs Radiating behind Student */}
        <circle cx="340" cy="270" r="140" stroke="url(#mobOrbitGrad1)" strokeWidth="1" />
        <circle cx="340" cy="270" r="190" stroke="url(#mobOrbitGrad2)" strokeWidth="1" strokeDasharray="4 6" />
        <circle cx="340" cy="270" r="250" stroke="url(#mobOrbitGrad1)" strokeWidth="1" />
        <circle cx="340" cy="270" r="320" stroke="url(#mobOrbitGrad2)" strokeWidth="1" strokeDasharray="5 7" opacity="0.6" />

        {/* Tilted Elliptical Arc */}
        <ellipse 
          cx="330" 
          cy="270" 
          rx="220" 
          ry="100" 
          transform="rotate(-18 330 270)" 
          stroke="url(#mobOrbitGrad1)" 
          strokeWidth="1.1" 
          strokeDasharray="4 7" 
        />
        <circle cx="170" cy="235" r="2.5" fill="#38BDF8" opacity="0.8" />

        {/* Top-Left Concentric Ambient Arc */}
        <circle cx="0" cy="0" r="160" stroke="url(#mobOrbitGrad1)" strokeWidth="1" opacity="0.5" />
        <circle cx="0" cy="0" r="230" stroke="url(#mobOrbitGrad2)" strokeWidth="1" strokeDasharray="4 6" opacity="0.4" />
      </svg>

      {/* 5. Minimal Dotted Matrix Accents */}
      {/* Top-Right Dotted Matrix */}
      <div className="absolute top-2 right-5 pointer-events-none opacity-30">
        <svg width="48" height="24" viewBox="0 0 48 24" fill="none">
          {[0, 1].map((r) =>
            [0, 1, 2, 3].map((c) => (
              <circle
                key={`mob-tr-${r}-${c}`}
                cx={c * 12 + 4}
                cy={r * 11 + 4}
                r="1.2"
                fill="#38BDF8"
                opacity={0.3 + ((c + r) % 2) * 0.3}
              />
            ))
          )}
        </svg>
      </div>

      {/* Top-Left Dotted Matrix (tucked cleanly in top margin above text) */}
      <div className="absolute top-1 left-5 pointer-events-none opacity-25">
        <svg width="42" height="18" viewBox="0 0 42 18" fill="none">
          {[0, 1].map((r) =>
            [0, 1, 2, 3].map((c) => (
              <circle
                key={`mob-tl-${r}-${c}`}
                cx={c * 11 + 4}
                cy={r * 9 + 4}
                r="1.1"
                fill="#60A5FA"
                opacity={0.35}
              />
            ))
          )}
        </svg>
      </div>

      {/* 6. Subtle Academic-Inspired Graduation-Cap Outline Motif */}
      <div 
        className="absolute top-6 right-6 pointer-events-none opacity-18 transform -rotate-6 scale-75"
      >
        <svg 
          width="80" 
          height="70" 
          viewBox="0 0 116 102" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="stroke-sky-300 drop-shadow-[0_0_8px_rgba(56,189,248,0.3)]"
        >
          {/* Mortarboard Diamond Top */}
          <path 
            d="M58 20 L100 40 L58 60 L16 40 Z" 
            strokeWidth="1.6" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            fill="rgba(56, 189, 248, 0.04)"
          />
          {/* Cap Skull Underneath */}
          <path 
            d="M32 48 V 66 C 32 76, 84 76, 84 66 V 48" 
            strokeWidth="1.5" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />
          {/* Tassel String & Hanging Brush */}
          <path 
            d="M58 40 V 50 C 58 58, 48 62, 48 72" 
            strokeWidth="1.5" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />
          <circle cx="48" cy="74.5" r="2.5" fill="#38BDF8" strokeWidth="0" />
        </svg>
      </div>
    </div>
  );
}

export function BuildSkillsSection({ slides: _initialSlides }: { slides?: THeroSlide[] }) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [isAdmissionOpen, setIsAdmissionOpen] = useState(false);

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
    <>
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
                  <div className="block md:hidden relative w-full overflow-hidden pt-5 min-[390px]:pt-6 pb-0 px-5 min-[360px]:px-6 min-[390px]:px-7 select-none">
                    <MobileHeroBackground />

                    {/* Dedicated Left-Aligned Mobile Composition */}
                    <div className="relative z-10 w-full max-w-[420px] mx-auto flex flex-col items-start text-left">
                      
                      {/* Main Heading: Admission Started 2026-27 (Single line, fits 360px+) */}
                      <h1 className="flex items-center gap-1.5 min-[360px]:gap-2 min-[390px]:gap-2 text-[18px] min-[360px]:text-[20px] min-[390px]:text-[22px] sm:text-[32px] font-black tracking-tight text-white leading-none pb-2 min-[390px]:pb-2.5 drop-shadow-sm text-left whitespace-nowrap">
                        <span>{slide.bulletText}</span>
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-amber-400">{slide.yearText}</span>
                      </h1>

                      {/* Supporting Text: Course Categories (single-line at all mobile widths) */}
                      <div className="space-y-1 min-[390px]:space-y-1.5 pb-3.5 min-[390px]:pb-4 text-left">
                        <p className="text-[12px] min-[360px]:text-[13px] min-[390px]:text-[14px] sm:text-[16px] font-semibold text-[#DCE8F8] tracking-[0.01em] leading-normal whitespace-nowrap">
                          {slide.courseLine1}
                        </p>
                        <p className="text-[10.5px] min-[360px]:text-[11px] min-[390px]:text-[11.5px] sm:text-[13px] font-bold text-amber-300 tracking-[0.05em] uppercase leading-normal whitespace-nowrap">
                          {slide.courseLine2}
                        </p>
                      </div>

                      {/* Clear CTA Button: Enroll Now — opens Admission Modal */}
                      <div className="pb-1 text-left w-full flex justify-start">
                        <button
                          type="button"
                          onClick={() => setIsAdmissionOpen(true)}
                          className="inline-flex items-center justify-center gap-2 h-[38px] min-[390px]:h-[40px] sm:h-[42px] px-7 min-[390px]:px-8 sm:px-9 rounded-full bg-gradient-to-r from-[#155EEF] to-[#2563EB] hover:from-[#1048B8] hover:to-[#1D4ED8] active:from-[#0C3894] active:to-[#1742B0] text-white font-bold text-[13px] min-[390px]:text-[13.5px] sm:text-[14px] shadow-[0_2px_12px_rgba(21,94,239,0.3)] border border-blue-400/25 active:scale-95 transition-all cursor-pointer select-none"
                        >
                          <span>{slide.buttonText}</span>
                          <ArrowRight className="w-4 h-4 stroke-[2.4]" />
                        </button>
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
                  <div className="hidden md:block relative w-full overflow-hidden pt-6 md:pt-7 lg:pt-8 pb-0 px-6 sm:px-10 md:px-12 lg:px-16 xl:px-20 select-none">
                    <DesktopHeroBackground />

                    {/* Desktop Balanced Composition (Tighter ~16% Shorter Height, Left-Aligned Text, Right Anchored Student) */}
                    <div className="relative z-10 w-full max-w-7xl mx-auto flex items-center justify-between gap-8 lg:gap-12 xl:gap-16 min-h-[360px] md:min-h-[390px] lg:min-h-[415px]">
                      
                      {/* Left Column: Text Content (Repositioned slightly upward and vertically balanced) */}
                      <div className="flex flex-col items-start text-left max-w-md lg:max-w-lg self-center -translate-y-6 md:-translate-y-8 lg:-translate-y-9 pt-1 md:pt-2 pb-2 md:pb-3">
                        
                        {/* 1. Main Heading: Admission Started 2026-27 (Single line, large font, no bullet) */}
                        <h1 className="flex items-center gap-3 md:gap-3.5 text-[1.85rem] md:text-[2.35rem] lg:text-[2.85rem] xl:text-[3.25rem] font-black tracking-[-0.02em] text-white leading-none pb-3 md:pb-3.5 drop-shadow-sm text-left whitespace-nowrap">
                          <span>{slide.bulletText}</span>
                          <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-amber-400">{slide.yearText}</span>
                        </h1>

                        {/* 3. Supporting Text: Course Categories (Ice-blue tone, clearly readable) */}
                        <div className="space-y-1.5 pb-4.5 md:pb-5 text-left">
                          <p className="text-[17px] md:text-[19px] lg:text-[20px] font-semibold text-[#DCE8F8] tracking-normal leading-relaxed">
                            {slide.courseLine1}
                          </p>
                          <p className="text-[13px] md:text-[14px] lg:text-[15px] font-bold text-amber-300 tracking-[0.07em] uppercase">
                            {slide.courseLine2}
                          </p>
                        </div>

                        {/* 4. Clear CTA Button: Enroll Now — opens Admission Modal */}
                        <div className="pt-0.5 text-left">
                          <button
                            type="button"
                            onClick={() => setIsAdmissionOpen(true)}
                            className="inline-flex items-center justify-center gap-2.5 h-[40px] md:h-[42px] lg:h-[44px] px-6 md:px-7 lg:px-8 rounded-full bg-gradient-to-r from-[#155EEF] to-[#2563EB] hover:from-[#1048B8] hover:to-[#1D4ED8] active:from-[#0C3894] active:to-[#1742B0] text-white font-bold text-[14px] shadow-[0_2px_12px_rgba(21,94,239,0.3)] hover:shadow-[0_4px_16px_rgba(21,94,239,0.4)] border border-blue-400/25 hover:scale-[1.01] active:scale-95 transition-all cursor-pointer select-none"
                          >
                            <span>{slide.buttonText}</span>
                            <ArrowRight className="w-4 h-4 stroke-[2.4]" />
                          </button>
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

    {/* Admission Form Popup Modal */}
    <AdmissionModal isOpen={isAdmissionOpen} onOpenChange={setIsAdmissionOpen} />
    </>
  );
}