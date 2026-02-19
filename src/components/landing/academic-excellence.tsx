
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
    <section className="w-full py-12 md:py-20 bg-white dark:bg-background overflow-hidden">
      <div className="container mx-auto px-4 md:px-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-4 text-left">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-primary/20">
                        <Award className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-black tracking-tighter text-foreground uppercase italic">Academic Results</h2>
                </div>
                <p className="text-sm text-muted-foreground font-bold max-w-xl">
                    Celebrating the hard work and exceptional milestones that turn academic dreams into reality.
                </p>
            </div>
        </div>
      </div>

      <div className="mb-10">
        <div className="overflow-x-auto pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex justify-center items-center gap-2 px-4 md:px-6 whitespace-nowrap">
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
            opts={{ 
                loop: true, 
                align: 'start',
                dragFree: true
            }}
            plugins={[Autoplay({ delay: 2000, stopOnInteraction: false })]}
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
