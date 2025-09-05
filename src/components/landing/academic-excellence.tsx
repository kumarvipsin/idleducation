
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Card } from '../ui/card';

const resultsData = {
  'CUET': {
    image: '/classxx.jpg',
    alt: 'CUET Toppers',
    hint: 'students celebrating'
  },
  'CBSE 10': {
    image: '/classxx.jpg',
    alt: 'CBSE 10th Toppers',
    hint: 'classroom students'
  },
  'CBSE 12': {
    image: '/classxx.jpg',
    alt: 'CBSE 12th Toppers',
    hint: 'graduation ceremony'
  },
  'JEE': {
    image: '/classxx.jpg',
    alt: 'JEE Toppers',
    hint: 'students studying'
  },
  'NEET': {
    image: '/classxx.jpg',
    alt: 'NEET Toppers',
    hint: 'medical students'
  },
  'SSC': {
    image: '/classxx.jpg',
    alt: 'SSC Toppers',
    hint: 'education'
  },
  'BANK PO': {
    image: '/classxx.jpg',
    alt: 'Banking Toppers',
    hint: 'banking professionals'
  },
  'DELHI POLICE': {
    image: '/classxx.jpg',
    alt: 'Delhi Police',
    hint: 'police officers'
  },
};

const categories = Object.keys(resultsData);

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
                    variant={activeCategory === category ? 'default' : 'outline'}
                    className="rounded-full"
                    onClick={() => setActiveCategory(category)}
                    >
                    {category}
                    </Button>
                ))}
                </div>
            </div>
        </div>

        <Card className="shadow-lg h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-gradient-to-br from-primary/5 to-accent/5 dark:from-primary/10 dark:to-accent/10 shadow-primary/20 hover:shadow-primary/30">
          <div className="bg-background rounded-lg h-full overflow-hidden">
            <div className="relative w-full aspect-video md:aspect-[2.5/1]">
                <Image
                key={activeCategory}
                src={resultsData[activeCategory as keyof typeof resultsData].image}
                alt={resultsData[activeCategory as keyof typeof resultsData].alt}
                data-ai-hint={resultsData[activeCategory as keyof typeof resultsData].hint}
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
