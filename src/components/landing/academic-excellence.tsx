'use client';

import { useState, useEffect } from 'react';
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
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'start' }, [Autoplay({ delay: 3000, stopOnInteraction: false })]);
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
      className="w-full py-6 md:py-10 bg-white dark:bg-background"
    >
      <div className="w-full">
        <div className="text-center mb-8 px-4">
          <h2 className="text-2xl md:text-3xl font-black tracking-tight text-gray-800 dark:text-white uppercase">
            Excellence{' '}
            <span className="relative inline-block">
              <span className="relative z-10">Results</span>
              <span className="absolute -bottom-1 left-0 w-full h-2 bg-yellow-300 z-0"></span>
            </span>
          </h2>
          <p className="text-sm text-muted-foreground mt-2 max-w-2xl mx-auto font-medium">
            Our students' success stories are a testament to our commitment to quality education.
          </p>
        </div>

        <div className="mb-6 px-4 md:px-6">
            <div className="overflow-x-auto pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                <div className="flex justify-center items-center gap-2 whitespace-nowrap">
                {loading ? (
                  [...Array(6)].map((_, i) => <Skeleton key={i} className="h-8 w-20 rounded-full" />)
                ) : (
                  results.map((result, index) => (
                    <button
                      key={result.id}
                      onClick={() => handleCategoryClick(index)}
                      className={cn(`py-1.5 px-4 whitespace-nowrap text-xs font-bold transition-all rounded-full border uppercase tracking-wider`,
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
            <div className="flex px-4 md:px-6">
                {loading ? (
                    <Skeleton className="w-full h-64 rounded-2xl flex-shrink-0" />
                ) : (
                    results.map((result, index) => (
                        <div 
                            key={result.id} 
                            className="flex-shrink-0 flex-grow-0 basis-[80%] md:basis-1/2 lg:basis-1/3 pr-4"
                        >
                            <Card 
                                className={cn(
                                  "h-full rounded-2xl overflow-hidden transition-all duration-500 border-muted-foreground/10",
                                  index === activeIndex ? "shadow-xl" : "opacity-60"
                                )}
                            >
                                <div className="relative w-full aspect-video">
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
