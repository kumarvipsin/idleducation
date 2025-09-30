'use client';

import { useState, useEffect, useRef } from 'react';
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
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'center' }, [Autoplay({ delay: 3000, stopOnInteraction: false })]);
  const [activeIndex, setActiveIndex] = useState(0);

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

    const onSelect = () => {
      setActiveIndex(emblaApi.selectedScrollSnap());
    };

    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);

    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onSelect);
    };
  }, [emblaApi]);

  const handleCategoryClick = (index: number) => {
    emblaApi?.scrollTo(index);
  };
  
  const activeCategoryName = results[activeIndex]?.categoryName;

  return (
    <section 
      className="w-full py-8 md:py-16 bg-[#F5F5F7] dark:bg-background"
    >
      <div className="container mx-auto px-4 md:px-[10%]">
        <div className="text-center mb-6">
          <h2 className="text-3xl md:text-4xl font-bold">
            <span className="text-primary">Excellence </span> <span style={{ color: '#ced4da' }}>Results</span>
          </h2>
          <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
            Our students consistently achieve outstanding results. Here's a glimpse of their success.
          </p>
        </div>

        <div className="mb-4" style={{ animationDelay: '0.2s' }}>
            <div className="overflow-x-auto pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                <div className="flex justify-start md:justify-center items-center gap-2 whitespace-nowrap px-4 sm:px-0">
                {loading ? (
                  [...Array(6)].map((_, i) => <Skeleton key={i} className="h-9 w-24 rounded-md" />)
                ) : (
                  results.map((result, index) => (
                    <button
                      key={result.id}
                      onClick={() => handleCategoryClick(index)}
                      className={cn(`py-2 px-4 whitespace-nowrap text-sm font-medium transition-colors rounded-md border`,
                        activeCategoryName === result.categoryName
                          ? 'border-primary text-primary bg-primary/10' 
                          : 'border-border text-muted-foreground hover:text-foreground hover:bg-muted'
                      )}
                    >
                      {result.categoryName}
                    </button>
                  ))
                )}
                </div>
            </div>
        </div>
        
        <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex">
                {loading ? (
                    <Skeleton className="w-full h-80 rounded-lg flex-shrink-0" />
                ) : (
                    results.map((result, index) => (
                        <div 
                            key={result.id} 
                            className="flex-shrink-0 flex-grow-0 basis-full min-w-0 md:basis-4/5 lg:basis-3/4 pl-4"
                        >
                            <Card 
                                className={cn(
                                  "h-full rounded-lg overflow-hidden transition-all duration-500",
                                  index === activeIndex ? "transform scale-100 opacity-100" : "transform scale-90 opacity-40"
                                )}
                            >
                                <div className="relative w-full aspect-[16/6] md:aspect-[16/5]">
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
