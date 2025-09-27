
'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '../ui/card';
import { cn } from '@/lib/utils';
import { getExcellenceResults } from '@/app/actions';
import type { TExcellenceResult } from '@/app/actions/types';
import { Skeleton } from '../ui/skeleton';
import { GcsImage } from '../gcs-image';

export function AcademicExcellence() {
  const [results, setResults] = useState<TExcellenceResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('');
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [animationKey, setAnimationKey] = useState(0);
  
  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      const res = await getExcellenceResults();
      if (res.success && res.data) {
        setResults(res.data as TExcellenceResult[]);
        if (res.data.length > 0) {
          setActiveCategory((res.data as TExcellenceResult[])[0].categoryName);
        }
      }
      setLoading(false);
    };
    fetchResults();
  }, []);

  const startAutoSwitch = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if(results.length === 0) return;
    
    intervalRef.current = setInterval(() => {
      setActiveCategory(prevCategory => {
        const currentIndex = results.findIndex(r => r.categoryName === prevCategory);
        const nextIndex = (currentIndex + 1) % results.length;
        return results[nextIndex].categoryName;
      });
    }, 3000);
  };

  useEffect(() => {
    if(!loading && results.length > 0) {
      startAutoSwitch();
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [loading, results]);
  
  useEffect(() => {
    setAnimationKey(prev => prev + 1);
  }, [activeCategory]);

  const handleCategoryClick = (category: string) => {
    setActiveCategory(category);
    startAutoSwitch(); 
  };

  const activeResult = results.find(r => r.categoryName === activeCategory);

  return (
    <section 
      className="w-full py-8 md:py-16 bg-white dark:bg-background"
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
                  results.map((result) => (
                    <button
                      key={result.id}
                      onClick={() => handleCategoryClick(result.categoryName)}
                      className={cn(`py-2 px-4 whitespace-nowrap text-sm font-medium transition-colors rounded-md border`,
                        activeCategory === result.categoryName
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

        <Card className="h-full transition-all duration-300 bg-gradient-to-br from-primary/5 to-accent/5 dark:from-primary/10 dark:to-accent/10 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] hover:shadow-[0_8px_32px_0_rgba(31,38,135,0.5)]" style={{ animationDelay: '0.4s' }}>
          <div className="bg-background rounded-lg h-full overflow-hidden">
            <div className="relative w-full aspect-[16/6] md:aspect-[16/5]">
                {loading || !activeResult ? (
                  <Skeleton className="w-full h-full" />
                ) : (
                  <GcsImage
                    key={animationKey}
                    filePath={activeResult.imageUrl}
                    alt={`Result for ${activeResult.categoryName}`}
                    fill
                    className="object-cover animate-fade-in-up"
                  />
                )}
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}
