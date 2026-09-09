
'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card } from '../ui/card';
import { cn } from '@/lib/utils';
import { getExcellenceResults } from '@/app/actions';
import type { TExcellenceResult } from '@/app/actions/types';
import { Skeleton } from '../ui/skeleton';
import { GcsImage } from '../gcs-image';
import { Carousel, CarouselContent, CarouselItem, type CarouselApi, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

export function AcademicExcellence() {
  const [results, setResults] = useState<TExcellenceResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [api, setApi] = useState<CarouselApi>();
  const [activeIndex, setActiveIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!api) return;
    setActiveIndex(api.selectedScrollSnap());
  }, [api]);

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      const res = await getExcellenceResults();
      if (res.success && res.data) {
        setResults(res.data as any[]);
      }
      setLoading(false);
    };
    fetchResults();
  }, []);

  useEffect(() => {
    if (!api) return;
    onSelect();
    api.on('select', onSelect);
    api.on('reInit', onSelect);
    return () => {
      api.off('select', onSelect);
      api.off('reInit', onSelect);
    };
  }, [api, onSelect]);

  const handleCategoryClick = (index: number) => {
    api?.scrollTo(index);
  };

  return (
    <section id="academic-results" className="w-full pt-10 sm:pt-12 md:pt-16 pb-12 sm:pb-16 md:pb-20 bg-white dark:bg-background overflow-hidden">
      <div className="container mx-auto px-4 md:px-6 mb-3.5 sm:mb-4.5">
          <div className="text-center space-y-2 sm:space-y-2.5">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-[#0B1F4B] dark:text-white">
                  Academic{' '}
                  <span className="text-[#1D4ED8] dark:text-blue-400">
                      Results
                  </span>
              </h2>
              <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 font-medium leading-relaxed max-w-2xl mx-auto text-center">
                  Real progress, real performance, and brighter futures with IDL Education.
              </p>
          </div>
      </div>

      {/* Clean Outline Button Selector (Zero Background, Outline Only) */}
      <div className="mb-5 sm:mb-6">
        <div className="flex justify-center px-4 md:px-6">
          <div 
            className="inline-flex items-center gap-2 sm:gap-2.5 select-none"
            role="tablist"
            aria-label="Academic Results Category"
          >
            {loading ? (
              [...Array(3)].map((_, i) => <Skeleton key={i} className="h-9 w-[92px] sm:w-[114px] rounded-lg" />)
            ) : (
              results.map((result, index) => {
                const isActive = activeIndex === index;
                return (
                  <button
                    key={result.id}
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => handleCategoryClick(index)}
                    className={cn(
                      "h-9 sm:h-[38px] min-w-[92px] sm:min-w-[114px] px-3.5 sm:px-5 text-[13px] sm:text-[13.5px] rounded-lg flex items-center justify-center transition-all duration-150 cursor-pointer bg-transparent",
                      isActive
                        ? "border-2 border-[#0B1F4B] dark:border-blue-400 text-[#0B1F4B] dark:text-blue-300 font-bold shadow-none"
                        : "border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-medium hover:border-slate-400 hover:text-[#0B1F4B] dark:hover:text-white"
                    )}
                  >
                    {result.categoryName}
                  </button>
                );
              })
            )}
          </div>
        </div>
      </div>

      <div className="relative w-full px-4 sm:px-6 md:px-0">
        {loading ? (
          <div className="container mx-auto">
            <Skeleton className="w-full aspect-[16/9] sm:aspect-[2/1] md:aspect-[21/7] rounded-xl sm:rounded-2xl" />
          </div>
        ) : (
          <Carousel
            setApi={setApi}
            opts={{ 
                loop: true, 
                align: 'center',
                dragFree: false
            }}
            plugins={[Autoplay({ delay: 3500, stopOnInteraction: false, stopOnMouseEnter: true })]}
            className="w-full"
          >
            <CarouselContent className="ml-0 md:-ml-4">
              {results.map((result) => (
                <CarouselItem key={result.id} className="pl-0 md:pl-4 basis-full md:basis-[80%] lg:basis-[76%]">
                  <div className="rounded-xl sm:rounded-2xl overflow-hidden border border-slate-200/80 dark:border-slate-800/80 shadow-xs md:shadow-md bg-white dark:bg-card">
                    {/* Mobile View: Natural Image Dimensions (100% width, auto height, NO cropping, NO black bars) */}
                    <div className="block md:hidden w-full">
                      <GcsImage
                        filePath={result.imageUrl}
                        alt={`Result for ${result.categoryName}`}
                        asImgTag
                        className="w-full h-auto block select-none rounded-xl sm:rounded-2xl"
                      />
                    </div>

                    {/* Desktop View: Approved Wide Carousel Banner with aspect-[21/7] */}
                    <div className="hidden md:block relative w-full aspect-[21/7]">
                      <GcsImage
                        filePath={result.imageUrl}
                        alt={`Result for ${result.categoryName}`}
                        fill
                        className="object-cover select-none"
                      />
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="hidden md:block">
                <CarouselPrevious className="left-3 lg:left-6 bg-white/95 hover:bg-white text-slate-800 border border-slate-200/80 shadow-sm" />
                <CarouselNext className="right-3 lg:right-6 bg-white/95 hover:bg-white text-slate-800 border border-slate-200/80 shadow-sm" />
            </div>
          </Carousel>
        )}
      </div>
      
      {/* Visual Indicator Dots */}
      {!loading && results.length > 1 && (
        <div className="flex justify-center items-center gap-1.5 sm:gap-2 mt-4 sm:mt-5 md:mt-6">
          {results.map((_, i) => (
            <button
              key={i}
              onClick={() => handleCategoryClick(i)}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300 shadow-2xs",
                activeIndex === i ? "w-6 sm:w-8 bg-[#0A225C] dark:bg-primary" : "w-1.5 sm:w-2 bg-slate-200 dark:bg-muted-foreground/30 hover:bg-slate-300"
              )}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
