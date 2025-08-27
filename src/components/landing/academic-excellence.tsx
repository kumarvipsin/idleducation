
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Card } from '../ui/card';

const resultsData = {
  'CUET': {
    image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8',
    alt: 'CUET Toppers',
    hint: 'students celebrating'
  },
  'CBSE 10': {
    image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=2132&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8',
    alt: 'CBSE 10th Toppers',
    hint: 'classroom students'
  },
  'CBSE 12': {
    image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8',
    alt: 'CBSE 12th Toppers',
    hint: 'graduation ceremony'
  },
  'SSC': {
    image: 'https://images.unsplash.com/photo-1579567761406-462483c0c1f8?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8',
    alt: 'SSC Toppers',
    hint: 'government building'
  },
  'BANK PO': {
    image: 'https://firebasestorage.googleapis.com/v0/b/learnscape-p4l0x.appspot.com/o/1722421303869-ranking.png?alt=media&token=c1303c80-53e7-4001-9a70-8b9a12a524ae',
    alt: 'Banking Toppers',
    hint: 'banking professionals'
  },
  'DELHI POLICE': {
    image: 'https://images.unsplash.com/photo-1621293291359-582875154b2b?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8',
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
