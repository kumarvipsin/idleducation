
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
import { Award } from 'lucide-react';

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
    <section className="w-full pt-10 sm:pt-12 md:pt-16 pb-12 sm:pb-16 md:pb-20 bg-white dark:bg-background overflow-hidden">
      <div className="container mx-auto px-4 md:px-6 mb-6 sm:mb-8">
          <div className="text-center space-y-3 sm:space-y-4">
              <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                  Academic{' '}
                  <span className="relative inline-block">
                      <span className="relative z-10">Results</span>
                      <div className="absolute -bottom-1 left-0 w-full h-3 z-0">
                          <svg viewBox="0 0 100 15" preserveAspectRatio="none" className="w-full h-full text-blue-500 fill-none stroke-current stroke-[10] opacity-70">
                              <path d="M0,15 Q50,5 100,15" />
                          </svg>
                      </div>
                  </span>
              </h2>
              <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 font-bold max-w-2xl mx-auto">
                  Celebrating the hard work and exceptional milestones that turn academic dreams into reality.
              </p>
          </div>
      </div>

      <div className="mb-6 sm:mb-8">
        <div className="overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex justify-center items-center gap-2 sm:gap-3 px-4 md:px-6 whitespace-nowrap">
            {loading ? (
              [...Array(3)].map((_, i) => <Skeleton key={i} className="h-9 w-24 rounded-full" />)
            ) : (
              results.map((result, index) => (
                <button
                  key={result.id}
                  onClick={() => handleCategoryClick(index)}
                  className={cn(
                    "h-9 sm:h-10 px-4 sm:px-6 text-xs sm:text-[13px] font-bold transition-all rounded-full border uppercase tracking-wider flex items-center justify-center",
                    activeIndex === index
                      ? "border-2 border-[#0A225C] text-[#0A225C] dark:border-primary dark:text-primary bg-white dark:bg-card shadow-sm"
                      : "border border-transparent text-slate-500 dark:text-slate-400 bg-slate-100/70 dark:bg-muted/30 hover:bg-slate-100 hover:text-slate-700"
                  )}
                >
                  {result.categoryName}
                </button>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="relative w-full">
        {loading ? (
          <div className="container mx-auto px-4 md:px-6">
            <Skeleton className="w-full aspect-[16/8] sm:aspect-[16/7] md:aspect-[21/7] rounded-2xl" />
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
            <CarouselContent className="-ml-2.5 sm:-ml-3 md:-ml-4">
              {results.map((result) => (
                <CarouselItem key={result.id} className="pl-2.5 sm:pl-3 md:pl-4 basis-[86%] sm:basis-[82%] md:basis-[80%] lg:basis-[76%]">
                  <div className="rounded-2xl overflow-hidden border border-slate-200/80 dark:border-border/60 shadow-sm md:shadow-md bg-white dark:bg-card">
                    <div className="relative w-full aspect-[16/8] sm:aspect-[16/7] md:aspect-[21/7]">
                      <GcsImage
                        filePath={result.imageUrl}
                        alt={`Result for ${result.categoryName}`}
                        fill
                        className="object-cover"
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
        <div className="flex justify-center gap-1.5 sm:gap-2 mt-6 sm:mt-8">
          {results.map((_, i) => (
            <button
              key={i}
              onClick={() => handleCategoryClick(i)}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300 shadow-sm",
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
