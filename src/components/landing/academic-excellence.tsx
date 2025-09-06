
'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Card } from '../ui/card';

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

  const stopAutoSwitch = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  useEffect(() => {
    startAutoSwitch();
    return () => stopAutoSwitch(); // Cleanup on unmount
  }, []);

  const handleCategoryClick = (category: string) => {
    setActiveCategory(category);
    // Restart the timer when a user manually selects a category
    startAutoSwitch(); 
  };

  return (
    <section 
      className="w-full py-12 md:py-24 bg-background"
      onMouseEnter={stopAutoSwitch}
      onMouseLeave={startAutoSwitch}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold">
            <span className="text-black dark:text-white">Excellence </span> <span style={{ color: '#ced4da' }}>Results</span>
          </h2>
          <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
            Our students consistently achieve outstanding results. Here's a glimpse of their success.
          </p>
        </div>

        <div className="mb-4">
            <div className="overflow-x-auto pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                <div className="flex justify-start md:justify-center items-center gap-2 whitespace-nowrap px-4 sm:px-0">
                {categories.map((category) => (
                    <Button
                    key={category}
                    variant={activeCategory === category ? 'ghost' : 'outline'}
                    className="rounded-full"
                    onClick={() => handleCategoryClick(category)}
                    >
                    {category}
                    </Button>
                ))}
                </div>
            </div>
        </div>

        <Card className="h-full transition-all duration-300 bg-gradient-to-br from-primary/5 to-accent/5 dark:from-primary/10 dark:to-accent/10 shadow-xl shadow-blue-500/30">
          <div className="bg-background rounded-lg h-full overflow-hidden">
            <div className="relative w-full aspect-[4/1.2]">
                <Image
                key={activeCategory}
                src="/result.jpg"
                alt="Excellent student results"
                data-ai-hint="student results success"
                fill
                className="object-cover animate-fade-in-up"
                />
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}
