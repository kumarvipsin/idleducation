
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
      className="w-full py-4 md:py-8 bg-white dark:bg-background"
    >
      <div className="w-full">
        <div className="text-center mb-12 px-4">
          <h2 className="text-2xl md:text-3xl font-black text-accent">Excellence Results</h2>
          <p className="text-muted-foreground mt-2 max-w-3xl mx-auto">
            Our students' success stories are a testament to our commitment to excellence.
          </p>
        </div>

        <div className="mb-4" style={{ animationDelay: '0.2s' }}>
            <div className="overflow-x-auto pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                <div className="flex justify-center items-center gap-2 whitespace-nowrap px-4 sm:px-0">
                {loading ? (
                  [...Array(6)].map((_, i) => <Skeleton key={i} className="h-9 w-24 rounded-full" />)
                ) : (
                  results.map((result, index) => (
                    <button
                      key={result.id}
                      onClick={() => handleCategoryClick(index)}
                      className={cn(`py-2 px-4 whitespace-nowrap text-sm font-medium transition-colors rounded-full border`,
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
