
'use client';

import * as React from 'react';
import { useState, useEffect, Suspense } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, BookCheck, Home, Star } from 'lucide-react';
import Link from 'next/link';
import { getCollection } from '@/app/actions/data';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';

type Subject = {
  name: string;
  href: string;
  imageUrl: string;
  imageHint: string;
};

const subjectImageMap: { [key: string]: { url: string; hint: string } } = {
  maths: { url: "https://images.unsplash.com/photo-1632571401005-458e9d244591?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw0fHxtYXRocyUyMHxlbnwwfHx8fDE3NTkzMDkwNDF8MA&ixlib=rb-4.1.0&q=80&w=1080", hint: "math abstract" },
  english: { url: "https://images.unsplash.com/photo-1456324504439-367cee3b3c32?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxlbmdsaXNoJTIwbGl0ZXJhdHVyZXxlbnwwfHx8fDE3E5MjYxNDQyfDA&ixlib=rb-4.1.0&q=80&w=1080", hint: "english literature" },
  physics: { url: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxwaHlzaWNzJTIwYWJzdHJhY3R8ZW58MHx8fHwxNzE5MjYxNDYxfDA&ixlib=rb-4.1.0&q=80&w=1080", hint: "physics abstract" },
  default: { url: "https://picsum.photos/seed/default-subject/600/400", hint: "books stack" },
};

const getImage = (key: string) => {
    const lowerKey = key.toLowerCase();
    for (const subjectKey in subjectImageMap) {
        if (lowerKey.includes(subjectKey)) {
            return subjectImageMap[subjectKey];
        }
    }
    return subjectImageMap.default;
};

const mockSolutions = {
    "Class 10": [
        { name: "Maths", href: "/resources/ncert-solutions/class-10-maths", imageUrl: getImage('maths').url, imageHint: getImage('maths').hint },
        { name: "English", href: "/resources/ncert-solutions/class-10-english", imageUrl: getImage('english').url, imageHint: getImage('english').hint }
    ],
    "Class 12": [
        { name: "Maths", href: "/resources/ncert-solutions/class-12-maths", imageUrl: getImage('maths').url, imageHint: getImage('maths').hint },
        { name: "Physics", href: "/resources/ncert-solutions/class-12-physics", imageUrl: getImage('physics').url, imageHint: getImage('physics').hint }
    ]
};

function NcertSolutionsPageContent() {
  const [solutionsByClass, setSolutionsByClass] = useState<any>(mockSolutions);
  const [classes, setClasses] = useState<string[]>(Object.keys(mockSolutions));
  const [loading, setLoading] = useState(false);
  const [selectedClass, setSelectedClass] = useState('Class 10');
  const [animationKey, setAnimationKey] = useState(0);

  const subjects = solutionsByClass[selectedClass] || [];
  
  const handleClassChange = (className: string) => {
    setSelectedClass(className);
    setAnimationKey(prev => prev + 1);
  };

  const renderSkeleton = () => (
    <div className="flex gap-6 px-4 md:px-[10%]">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="block flex-shrink-0 w-[300px] sm:w-[350px]">
            <Skeleton className="h-[450px] w-full rounded-lg" />
          </div>
        ))}
    </div>
  );

  return (
    <div className="relative min-h-screen w-full p-4 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800 overflow-y-auto">
       <Link href="/" className="absolute top-4 right-4 z-20">
          <Button variant="ghost" size="icon">
              <Home className="h-6 w-6 text-primary" />
              <span className="sr-only">Home</span>
          </Button>
      </Link>
      <div className="relative z-10 container mx-auto py-12">
        <div className="mb-6 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">NCERT Solutions for {selectedClass}</h1>
          <p className="text-muted-foreground">Explore our detailed, step-by-step solutions for your NCERT textbooks.</p>
        </div>

        <div className="mb-8">
          <div className="overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div className="flex justify-start md:justify-center items-center gap-2 whitespace-nowrap px-4 sm:px-0">
              {loading ? (
                  [...Array(2)].map((_, i) => <Skeleton key={i} className="h-9 w-24 rounded-md" />)
              ) : (
                  classes.map((className) => (
                  <button
                      key={className}
                      onClick={() => handleClassChange(className)}
                      className={`py-2 px-6 text-sm font-medium transition-colors border rounded-full
                      ${selectedClass === className 
                          ? 'border-primary text-primary bg-primary/10 shadow' 
                          : 'border-border text-muted-foreground hover:text-foreground hover:bg-muted/50'}`}
                  >
                      {className}
                  </button>
                  ))
              )}
            </div>
          </div>
        </div>

        <main className="flex-1">
          {loading ? renderSkeleton() : (
              <div key={animationKey} className="relative animate-fade-in-up">
                  {subjects && subjects.length > 0 ? (
                  <div className="overflow-x-auto pb-8 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                      <div className="flex gap-6 px-4 md:px-[10%]">
                          {subjects.map((subject: Subject, index: number) => (
                           <div key={index} className="block flex-shrink-0 w-[300px] sm:w-[350px] group">
                                <Card className="overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 animate-fade-in-up group rounded-lg bg-card flex flex-col h-full" style={{ animationDelay: `${index * 50}ms` }}>
                                    <CardContent className="p-4 flex flex-col flex-1">
                                        <div className="relative aspect-[4/5] w-full mb-4">
                                            <Image
                                                src={subject.imageUrl}
                                                alt={subject.name}
                                                data-ai-hint={subject.imageHint}
                                                fill
                                                className="object-cover rounded-md"
                                            />
                                        </div>
                                        <h3 className="font-bold text-base leading-tight mt-2 flex-grow" title={subject.name}>{subject.name}</h3>
                                        <div className="flex items-baseline gap-2 mt-2">
                                            <p className="text-xl font-bold text-foreground">Free</p>
                                            <p className="text-sm text-muted-foreground line-through">₹999</p>
                                        </div>
                                        <div className="grid grid-cols-1 gap-2 mt-4">
                                            <Button asChild>
                                                <Link href={subject.href}>
                                                    Explore Solutions <ArrowRight className="ml-2 h-4 w-4" />
                                                </Link>
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                          ))}
                      </div>
                  </div>
                  ) : (
                  <div className="col-span-full text-center py-12">
                      <Card className="p-8 inline-block">
                          <BookCheck className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                          <p className="text-muted-foreground font-semibold">No solutions found for this class.</p>
                          <p className="text-sm text-muted-foreground">Please select another class to see available solutions.</p>
                      </Card>
                  </div>
                  )}
              </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default function NcertSolutionsPage() {
    return (
        <Suspense fallback={<div className="flex justify-center items-center h-screen"><Skeleton className="h-96 w-full max-w-4xl" /></div>}>
            <NcertSolutionsPageContent />
        </Suspense>
    )
}
