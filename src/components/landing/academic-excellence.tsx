
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Card } from '../ui/card';

const resultsData = {
  'UPSC CSE': {
    image: 'https://images.unsplash.com/photo-1519074002996-a69e7ac46a42?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8',
    alt: 'UPSC CSE Toppers',
    hint: 'students celebrating'
  },
  'GATE': {
    image: 'https://images.unsplash.com/photo-1629904853716-f0bc54eea481?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8',
    alt: 'GATE Toppers',
    hint: 'engineering students'
  },
  'Board Exams - CBSE 10th': {
    image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=2132&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8',
    alt: 'CBSE 10th Toppers',
    hint: 'classroom students'
  },
  'Board Exams - ICSE 10th': {
    image: 'https://images.unsplash.com/photo-1531482615713-2c65a000c0a5?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8',
    alt: 'ICSE 10th Toppers',
    hint: 'students presentation'
  },
  'Board Exams - CBSE 12th': {
    image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8',
    alt: 'CBSE 12th Toppers',
    hint: 'graduation ceremony'
  },
  'CA': {
    image: 'https://images.unsplash.com/photo-1600880292210-85938a1639d6?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8',
    alt: 'CA Toppers',
    hint: 'business professionals'
  },
  'MBA': {
    image: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8',
    alt: 'MBA Toppers',
    hint: 'team meeting'
  },
  'SSC': {
    image: 'https://images.unsplash.com/photo-1579567761406-462483c0c1f8?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8',
    alt: 'SSC Toppers',
    hint: 'government building'
  },
  'IIT JAM': {
    image: 'https://images.unsplash.com/photo-1610116306796-6fea9f4fae38?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8',
    alt: 'IIT JAM Toppers',
    hint: 'science lab'
  },
  'Banking': {
    image: 'https://firebasestorage.googleapis.com/v0/b/learnscape-p4l0x.appspot.com/o/1722421303869-ranking.png?alt=media&token=c1303c80-53e7-4001-9a70-8b9a12a524ae',
    alt: 'Banking Toppers',
    hint: 'banking professionals'
  },
};

const categories = Object.keys(resultsData);

export function AcademicExcellence() {
  const [activeCategory, setActiveCategory] = useState('Banking');

  return (
    <section className="w-full py-12 md:py-24 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold">Academic Excellence : Results</h2>
          <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
            Giving wings to a millions dreams, a million more to go
          </p>
        </div>

        <div className="relative mb-8">
            <div className="flex flex-wrap justify-center items-center gap-2 pb-4">
            {categories.map((category) => (
                <Button
                key={category}
                variant={activeCategory === category ? 'default' : 'outline'}
                className="rounded-full whitespace-nowrap"
                onClick={() => setActiveCategory(category)}
                >
                {category}
                </Button>
            ))}
            </div>
        </div>

        <Card className="overflow-hidden shadow-lg">
          <Image
            src={resultsData[activeCategory as keyof typeof resultsData].image}
            alt={resultsData[activeCategory as keyof typeof resultsData].alt}
            data-ai-hint={resultsData[activeCategory as keyof typeof resultsData].hint}
            width={1200}
            height={300}
            className="w-full h-auto object-cover transition-transform duration-300 ease-in-out hover:scale-105"
            style={{ maxHeight: '300px' }}
          />
        </Card>
      </div>
    </section>
  );
}
