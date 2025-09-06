
'use client';

import { useState } from 'react';
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

  return (
    <section className="w-full py-12 md:py-24 bg-background">
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
                    onClick={() => setActiveCategory(category)}
                    >
                    {category}
                    </Button>
                ))}
                </div>
            </div>
        </div>

        <Card className="h-full transition-all duration-300 bg-gradient-to-br from-primary/5 to-accent/5 dark:from-primary/10 dark:to-accent/10 shadow-[0_4px_15px_rgba(0,0,0,0.05),0_-4px_15px_rgba(0,0,0,0.05)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.07),0_-6px_20px_rgba(0,0,0,0.07)]">
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
