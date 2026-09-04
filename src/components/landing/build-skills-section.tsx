'use client';

import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "../ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import type { THeroSlide } from "@/app/actions/types";
import { GcsImage } from "../gcs-image";
import { Trophy } from "lucide-react";
import Link from "next/link";

const defaultSlides: THeroSlide[] = [
  { 
    id: "default-1",
    imageUrl: "https://picsum.photos/seed/build-skills/1920/1080", 
    title: "Build Skills That Shape Your Future",
    description: "Join thousands of students achieving their dreams with our expert-led courses and personalized learning paths.",
    buttonText: "Enroll Now",
    buttonLink: "/admission",
    order: 1,
  },
];

interface SlideVisualMeta {
  category: string;
  headline1: string;
  headline2: string;
  highlight: string;
  subHighlight: string;
  visualFocus: string;
  link: string;
}

function getSlideMeta(slide: THeroSlide, index: number): SlideVisualMeta {
  const url = slide.imageUrl || '';
  const title = (slide.title || '').trim();
  const desc = (slide.description || '').trim();
  const link = slide.buttonLink || '/admission';

  // Check for specific known hero banners by image URL or title
  if (url.includes('03_02_38') || title.toLowerCase().includes('iit') || title.toLowerCase().includes('jee')) {
    return {
      category: "CRACK IIT-JEE",
      headline1: "Focus Today,",
      headline2: "Achieve Tomorrow",
      highlight: "95%+ Success Rate",
      subHighlight: "Top Results • Expert IITian Mentorship",
      visualFocus: "object-[82%_35%] sm:object-[78%_center]",
      link,
    };
  }

  if (url.includes('03_09_01') || title.toLowerCase().includes('class 12') || title.toLowerCase().includes('12th')) {
    return {
      category: "CLASS 12 BOARDS",
      headline1: "Focused Today,",
      headline2: "Leading Tomorrow",
      highlight: "99% Results",
      subHighlight: "Outstanding Academic Track Record • Verified",
      visualFocus: "object-[82%_25%] sm:object-[80%_center]",
      link,
    };
  }

  if (url.includes('03_07_29') || title.toLowerCase().includes('class 10') || title.toLowerCase().includes('10th')) {
    return {
      category: "CLASS 10 BOARDS",
      headline1: "Focused Today,",
      headline2: "Future Ready",
      highlight: "99% Results",
      subHighlight: "Strong Foundation • Proven Board Success",
      visualFocus: "object-[82%_25%] sm:object-[80%_center]",
      link,
    };
  }

  // If a custom non-'cover' title was provided by admin
  if (title && title.toLowerCase() !== 'cover') {
    const parts = title.split(' ');
    const mid = Math.ceil(parts.length / 2);
    return {
      category: "ACADEMIC EXCELLENCE",
      headline1: parts.slice(0, mid).join(' '),
      headline2: parts.slice(mid).join(' '),
      highlight: desc ? desc.slice(0, 30) : "Enroll For 2026-27",
      subHighlight: desc || "Personalized Guidance & High Scores",
      visualFocus: "object-[80%_center]",
      link,
    };
  }

  // Fallback by order/index
  if (index === 0) {
    return {
      category: "CRACK IIT-JEE",
      headline1: "Focus Today,",
      headline2: "Achieve Tomorrow",
      highlight: "95%+ Success Rate",
      subHighlight: "Top Results • Expert IITian Mentorship",
      visualFocus: "object-[82%_35%] sm:object-[78%_center]",
      link,
    };
  } else if (index === 1) {
    return {
      category: "CLASS 12 BOARDS",
      headline1: "Focused Today,",
      headline2: "Leading Tomorrow",
      highlight: "99% Results",
      subHighlight: "Outstanding Academic Track Record",
      visualFocus: "object-[82%_25%] sm:object-[80%_center]",
      link,
    };
  } else {
    return {
      category: "CLASS 10 BOARDS",
      headline1: "Focused Today,",
      headline2: "Future Ready",
      highlight: "99% Results",
      subHighlight: "Strong Foundation • Board Exam Success",
      visualFocus: "object-[82%_25%] sm:object-[80%_center]",
      link,
    };
  }
}

export function BuildSkillsSection({ slides: initialSlides }: { slides: THeroSlide[] }) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  const autoplayPlugin = useRef(
    Autoplay({ delay: 4500, stopOnInteraction: false, stopOnMouseEnter: true })
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

  const displaySlides = (initialSlides && initialSlides.length > 0 ? initialSlides : defaultSlides)
    .slice()
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  return (
    <section className="w-full py-2 sm:py-3 bg-white dark:bg-background">
      <div className="container mx-auto px-3 sm:px-4 md:px-6">
        <div className="relative rounded-2xl overflow-hidden shadow-sm border border-border/50 bg-[#06122E]">
          <Carousel 
            setApi={setApi}
            opts={{ loop: true }}
            plugins={[autoplayPlugin.current]} 
            className="w-full"
          >
            <CarouselContent>
              {displaySlides.map((slide, index) => {
                const meta = getSlideMeta(slide, index);

                return (
                  <CarouselItem key={slide.id}>
                    {/* Desktop Composition (>= 1024px): Preserved wide banner billboard */}
                    <div className="hidden lg:block relative w-full aspect-[16/6]">
                      <GcsImage
                        filePath={slide.imageUrl}
                        alt={slide.title || 'Educational Excellence'}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Mobile & Tablet Composition (< 1024px: 320px, 375px, 390px, 430px, 768px) */}
                    <Link
                      href={meta.link}
                      className="block lg:hidden relative w-full h-[200px] sm:h-[250px] md:h-[290px] overflow-hidden select-none bg-[#06122E] group"
                    >
                      {/* Primary Student / Artwork Visual (Confined strictly to right side; zero overlap behind text) */}
                      <div className="absolute top-0 right-0 bottom-0 w-[46%] sm:w-[48%] md:w-[50%] overflow-hidden pointer-events-none">
                        <GcsImage
                          filePath={slide.imageUrl}
                          alt={slide.title || 'Educational Excellence'}
                          fill
                          className="object-cover object-right"
                        />
                        {/* Soft left-edge blend into solid background so no hard seam is visible */}
                        <div className="absolute inset-y-0 left-0 w-8 sm:w-12 bg-gradient-to-r from-[#06122E] to-transparent z-10" />
                        {/* Soft bottom-edge scrim for carousel indicator cleanliness */}
                        <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-[#06122E]/80 to-transparent z-10" />
                      </div>

                      {/* Highest-Priority Content Layer on Solid Navy (Zero ghosted or duplicate background text) */}
                      <div className="relative z-20 h-full flex flex-col justify-center px-4 sm:px-8 md:px-10 max-w-[58%] sm:max-w-[54%] md:max-w-[50%]">
                        {/* Category Badge */}
                        <div className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-bold tracking-widest text-[#F5B51B] uppercase mb-1 sm:mb-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#F5B51B] shrink-0" />
                          <span className="truncate">{meta.category}</span>
                        </div>

                        {/* Main Headline */}
                        <h2 className="text-[17px] sm:text-2xl md:text-3xl font-black tracking-tight text-white leading-[1.2] mb-2">
                          {meta.headline1}<br />
                          <span className="text-[#F5B51B]">{meta.headline2}</span>
                        </h2>

                        {/* Key Result / Highlight Badge */}
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#0A225C] border border-[#F5B51B]/40 text-[#F5B51B] text-[11px] sm:text-xs font-bold shadow-sm w-fit">
                          <Trophy className="w-3.5 h-3.5 text-[#F5B51B] shrink-0" />
                          <span>{meta.highlight}</span>
                        </div>
                      </div>
                    </Link>
                  </CarouselItem>
                );
              })}
            </CarouselContent>
          </Carousel>
          
          {/* Carousel Indicators */}
          <div className="absolute bottom-2.5 sm:bottom-3 md:bottom-4 lg:bottom-6 left-1/2 -translate-x-1/2 z-20 flex justify-center gap-1.5 sm:gap-2">
            {displaySlides.map((_, i) => (
              <button
                key={i}
                onClick={() => scrollTo(i)}
                className={cn(
                  "h-1.5 sm:h-2 rounded-full transition-all duration-300 shadow-sm",
                  current === i 
                    ? "w-6 sm:w-8 lg:w-10 bg-white" 
                    : "w-1.5 sm:w-2 bg-white/40 hover:bg-white/60"
                )}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}