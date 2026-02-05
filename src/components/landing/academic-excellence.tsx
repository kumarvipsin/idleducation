'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card } from '../ui/card';
import { cn } from '@/lib/utils';
import { getExcellenceResults } from '@/app/actions';
import type { TExcellenceResult } from '@/app/actions/types';
import { Skeleton } from '../ui/skeleton';
import { GcsImage } from '../gcs-image';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';

export function AcademicExcellence() {
  const [results, setResults] = useState<TExcellenceResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: true, 
    align: 'start',
    skipSnaps: false 
  }, [Autoplay({ delay: 4000, stopOnInteraction: false })]);
  
  const [activeIndex, setActiveIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setActiveIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      const res = await getExcellenceResults();
      if (res.success && res.data) {
        setResults(res.data as TExcellenceResult[]);
      }
      setLoading(false);
    };
    fetchResults();
  }, []);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onSelect);
    };
  }, [emblaApi, onSelect]);

  const handleCategoryClick = (index: number) => {
    emblaApi?.scrollTo(index);
  };

  return (
    <section className="w-full py-10 md:py-16 bg-white dark:bg-background overflow-hidden">
      <div className="container mx-auto px-4 md:px-6 mb-8">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 border border-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest">
            Academic Success
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            Our Excellence Results
          </h2>
          <p className="text-sm text-muted-foreground max-w-2xl mx-auto font-medium">
            Celebrating the consistent hard work and outstanding achievements of our students across various domains.
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
                    "py-2 px-5 text-xs font-bold transition-all rounded-full border uppercase tracking-wider",
                    activeIndex === index
                      ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20 scale-105"
                      : "bg-background text-muted-foreground border-border hover:border-primary hover:text-primary"
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
        <div className="overflow-hidden cursor-grab active:cursor-grabbing" ref={emblaRef}>
          <div className="flex">
            {loading ? (
              <div className="flex-shrink-0 flex-grow-0 basis-full">
                <Skeleton className="w-full aspect-video md:aspect-[21/7] rounded-none" />
              </div>
            ) : (
              results.map((result) => (
                <div 
                  key={result.id} 
                  className="flex-shrink-0 flex-grow-0 basis-full"
                >
                  <Card className="rounded-none overflow-hidden border-none shadow-none bg-muted">
                    <div className="relative w-full aspect-video md:aspect-[21/7]">
                      <GcsImage
                        filePath={result.imageUrl}
                        alt={`Result for ${result.categoryName}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </Card>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
