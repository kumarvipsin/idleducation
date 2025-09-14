
'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Card } from '../ui/card';
import { cn } from '@/lib/utils';

const categories = [
  'CUET',
  'CBSE 10',
  'CBSE 12',
  'JEE',
  'NEET',
  'SSC',
  'BANK PO',
  'DELHI POLICE',
];

export function AcademicExcellence() {
  const [activeCategory, setActiveCategory] = useState('CUET');
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [animationKey, setAnimationKey] = useState(0);

  const startAutoSwitch = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setActiveCategory(prevCategory => {
        const currentIndex = categories.indexOf(prevCategory);
        const nextIndex = (currentIndex + 1) % categories.length;
        return categories[nextIndex];
      });
    }, 3000); // Switch every 3 seconds
  };

  useEffect(() => {
    startAutoSwitch();
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);
  
  useEffect(() => {
    setAnimationKey(prev => prev + 1);
  }, [activeCategory]);

  const handleCategoryClick = (category: string) => {
    setActiveCategory(category);
    // Restart the timer when a user manually selects a category
    startAutoSwitch(); 
  };

  return (
    <section 
      className="w-full py-8 md:py-16 bg-white dark:bg-background"
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-6">
          <h2 className="text-3xl md:text-4xl font-bold">
            <span className="text-black dark:text-white">Excellence </span> <span style={{ color: '#ced4da' }}>Results</span>
          </h2>
          <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
            Our students consistently achieve outstanding results. Here's a glimpse of their success.
          </p>
        </div>

        <div className="mb-4" style={{ animationDelay: '0.2s' }}>
            <div className="overflow-x-auto pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                <div className="flex justify-start md:justify-center items-center gap-2 whitespace-nowrap px-4 sm:px-0">
                {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => handleCategoryClick(category)}
                      className={cn(`py-2 px-4 whitespace-nowrap text-sm font-medium transition-colors rounded-md border`,
                        activeCategory === category 
                          ? 'border-primary text-primary bg-primary/10' 
                          : 'border-border text-muted-foreground hover:text-foreground hover:bg-muted'
                      )}
                    >
                      {category}
                    </button>
                ))}
                </div>
            </div>
        </div>

        <Card className="h-full transition-all duration-300 bg-gradient-to-br from-primary/5 to-accent/5 dark:from-primary/10 dark:to-accent/10 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] hover:shadow-[0_8px_32px_0_rgba(31,38,135,0.5)]" style={{ animationDelay: '0.4s' }}>
          <div className="bg-background rounded-lg h-full overflow-hidden">
            <div className="relative w-full aspect-[16/9] md:aspect-[16/5]">
                <Image
                key={animationKey}
                src="/result.jpg"
                alt="Excellent student results"
                data-ai-hint="student results success"
                fill
                className="object-cover"
                />
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}
