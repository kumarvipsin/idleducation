'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Card } from '../ui/card';

const resultsData = {
  'CUET': {
    image: '/cuet.jpg',
    alt: 'CUET Toppers',
    hint: 'students celebrating'
  },
  'CBSE 10': {
    image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=2132&auto-format=fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8',
    alt: 'CBSE 10th Toppers',
    hint: 'classroom students'
  },
  'CBSE 12': {
    image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=2070&auto-format=fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8',
    alt: 'CBSE 12th Toppers',
    hint: 'graduation ceremony'
  },
  'JEE': {
    image: 'https://images.unsplash.com/photo-1681567012715-4990694c5aa9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw1fHxqZWUlMjByZXN1bHQlMjBiYW5uZXIlMjB3aXRoJTIwMjAlMjBzdHVkZW50fGVufDB8fHx8MTc1Njc5MTI3MHww&ixlib=rb-4.1.0&q=80&w=1080',
    alt: 'JEE Toppers',
    hint: 'students studying'
  },
  'NEET': {
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=2070&auto-format=fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8',
    alt: 'NEET Toppers',
    hint: 'medical students'
  },
  'SSC': {
    image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxM3x8ZWR1Y2F0aW9ufGVufDB8fHx8MTc1NjI3ODk4OHww&ixlib=rb-4.1.0&q=80&w=1080',
    alt: 'SSC Toppers',
    hint: 'education'
  },
  'BANK PO': {
    image: 'https://firebasestorage.googleapis.com/v0/b/learnscape-p4l0x.appspot.com/o/1722421303869-ranking.png?alt=media&token=c1303c80-53e7-4001-9a70-8b9a12a524ae',
    alt: 'Banking Toppers',
    hint: 'banking professionals'
  },
  'DELHI POLICE': {
    image: 'https://images.unsplash.com/photo-1621293291359-582875154b2b?q=80&w=2070&auto-format=fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8',
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
            A Legacy of Academic Excellence
          </h2>
          <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
            Giving wings to a millions dreams, a million more to go
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
            <div className="relative w-full aspect-[2.5/1] md:aspect-[4/1]">
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
