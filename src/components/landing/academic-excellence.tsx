
'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card } from '../ui/card';
import { cn } from '@/lib/utils';
import { getExcellenceResults } from '@/app/actions';
import type { TExcellenceResult } from '@/app/actions/types';
import { Skeleton } from '../ui/skeleton';
import { GcsImage } from '../gcs-image';
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel";
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
    <section className="w-full py-10 md:py-16 bg-white dark:bg-background overflow-hidden">
      <div className="container mx-auto px-4 md:px-6 mb-8">
        <div className="text-center space-y-3">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
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
          <p className="text-sm text-muted-foreground max-w-2xl mx-auto font-bold">
            Our students consistently secure top national ranks, a testament to their dedication and our comprehensive, result-oriented teaching methodologies.
          </p>
        </div>
      </div>

      <div className="mb-10">
        <div className="overflow-x-auto pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex justify-center items-center gap-2 px-4 whitespace-nowrap">
            {loading ? (
              [...Array(4)].map((_, i) => <Skeleton key={i} className="h-9 w-24 rounded-full" />)
            ) : (
              results.map((result, index) => (
                <button
                  key={result.id}
                  onClick={() => handleCategoryClick(index)}
                  className={cn(
                    "py-2 px-5 text-xs font-bold transition-all rounded-full border-2 uppercase tracking-wider",
                    activeIndex === index
                      ? "border-primary text-primary bg-background shadow-sm"
                      : "border-transparent text-muted-foreground bg-muted/30 hover:bg-muted/50 hover:border-primary/20"
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
            <Skeleton className="w-full aspect-video md:aspect-[21/7] rounded-3xl" />
          </div>
        ) : (
          <Carousel
            setApi={setApi}
            opts={{ loop: true, align: 'start' }}
            plugins={[Autoplay({ delay: 4000, stopOnInteraction: false })]}
            className="w-full"
          >
            <CarouselContent>
              {results.map((result) => (
                <CarouselItem key={result.id}>
                  <Card className="rounded-none overflow-hidden border-none shadow-none bg-muted">
                    <div className="relative w-full aspect-[2/1] md:aspect-[21/7]">
                      <GcsImage
                        filePath={result.imageUrl}
                        alt={`Result for ${result.categoryName}`}
                        fill
                        className="object-contain"
                      />
                    </div>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        )}
      </div>
    </section>
  );
}
