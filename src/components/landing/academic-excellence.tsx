
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Card } from '../ui/card';

const resultsData = {
  'CUET': {
    image: 'https://images.unsplash.com/photo-1752650734133-b2442de2f561?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwyfHxyZXN1bHQlMjBzdHVkZW50fGVufDB8fHx8MTc1NzA5NzUyNXww&ixlib=rb-4.1.0&q=80&w=1080',
    alt: 'CUET Toppers',
    hint: 'students celebrating'
  },
  'CBSE 10': {
    image: 'https://picsum.photos/1200/210',
    alt: 'CBSE 10th Toppers',
    hint: 'classroom students'
  },
  'CBSE 12': {
    image: 'https://picsum.photos/1201/210',
    alt: 'CBSE 12th Toppers',
    hint: 'graduation ceremony'
  },
  'JEE': {
    image: 'https://picsum.photos/1201/210',
    alt: 'JEE Toppers',
    hint: 'students studying'
  },
  'NEET': {
    image: 'https://picsum.photos/1200/210',
    alt: 'NEET Toppers',
    hint: 'medical students'
  },
  'SSC': {
    image: 'https://picsum.photos/1202/210',
    alt: 'SSC Toppers',
    hint: 'education'
  },
  'BANK PO': {
    image: 'https://picsum.photos/1202/210',
    alt: 'Banking Toppers',
    hint: 'banking professionals'
  },
  'DELHI POLICE': {
    image: 'https://picsum.photos/1201/210',
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
            <div className="relative w-full aspect-[4/1.2]">
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
