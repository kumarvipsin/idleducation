
'use client';

import * as React from 'react';
import { useState, useEffect, Suspense } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, BookCheck, Home } from 'lucide-react';
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
  science: { url: "https://images.unsplash.com/photo-1576086213369-97a306d36557?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxzY2llbmNlJTIwYWJzdHJhY3R8ZW58MHx8fHwxNzE5MjYxNDAyfDA&ixlib=rb-4.1.0&q=80&w=1080", hint: "science abstract" },
  social: { url: "https://images.unsplash.com/photo-1583426533758-3a172a6b29cf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxzb2NpYWwlMjBzdHVkaWVzJTIwYWJzdHJhY3R8ZW58MHx8fHwxNzE5MjYxNDIzfDA&ixlib=rb-4.1.0&q=80&w=1080", hint: "social studies" },
  english: { url: "https://images.unsplash.com/photo-1456324504439-367cee3b3c32?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxlbmdsaXNoJTIwbGl0ZXJhdHVyZXxlbnwwfHx8fDE3E5MjYxNDQyfDA&ixlib=rb-4.1.0&q=80&w=1080", hint: "english literature" },
  physics: { url: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxwaHlzaWNzJTIwYWJzdHJhY3R8ZW58MHx8fHwxNzE5MjYxNDYxfDA&ixlib=rb-4.1.0&q=80&w=1080", hint: "physics abstract" },
  chemistry: { url: "https://images.unsplash.com/photo-1554475901-4538ddfbccc2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxjaGVtaXN0cnklMjBhYnN0cmFjdHxlbnwwfHx8fDE3E5MjYxNDc5fDA&ixlib=rb-4.1.0&q=80&w=1080", hint: "chemistry abstract" },
  biology: { url: "https://images.unsplash.com/photo-1530026405186-ed1f139313f8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxib2xvZ3klMjBhYnN0cmFjdHxlbnwwfHx8fDE3E5MjYxNDk3fDA&ixlib=rb-4.1.0&q=80&w=1080", hint: "biology abstract" },
  history: { url: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxoaXN0b3J5JTIwYWJzdHJhY3R8ZW58MHx8fHwxNzE5MjYxNTE1fDA&ixlib=rb-4.1.0&q=80&w=1080", hint: "history abstract" },
  geography: { url: "https://images.unsplash.com/photo-1542051841857-5f90071e7989?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxnZW9ncmFwaHklMjBhYnN0cmFjdHxlbnwwfHx8fDE3E5MjYxNTMwfDA&ixlib=rb-4.1.0&q=80&w=1080", hint: "geography abstract" },
  'political-science': { url: "https://images.unsplash.com/photo-1534294668382-95b2ae36b57d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxwb2xpdGljYWwlMjBzY2llbmNlJTIwYWJzdHJhY3R8ZW58MHx8fHwxNzE5MjYxNTQ4fDA&ixlib=rb-4.1.0&q=80&w=1080", hint: "political science" },
  economics: { url: "https://images.unsplash.com/photo-1579621970795-87f54f12c7a0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxlY29ub21pY3MlMjBhYnN0cmFjdHxlbnwwfHx8fDE3E5MjYxNTY0fDA&ixlib=rb-4.1.0&q=80&w=1080", hint: "economics abstract" },
  default: { url: "https://picsum.photos/seed/default-subject/600/400", hint: "books stack" },
};

const getImage = (key: string) => subjectImageMap[key.toLowerCase()] || subjectImageMap.default;

const mockSolutions = {
    "Class 10": [
        { name: "Maths", href: "/resources/ncert-solutions/class-10-maths", imageUrl: getImage('maths').url, imageHint: getImage('maths').hint },
        { name: "Science", href: "/resources/ncert-solutions/class-10-science", imageUrl: getImage('science').url, imageHint: getImage('science').hint },
        { name: "Social Studies", href: "/resources/ncert-solutions/class-10-social", imageUrl: getImage('social').url, imageHint: getImage('social').hint },
        { name: "English", href: "/resources/ncert-solutions/class-10-english", imageUrl: getImage('english').url, imageHint: getImage('english').hint }
    ],
    "Class 9": [
        { name: "Maths", href: "/resources/ncert-solutions/class-9-maths", imageUrl: getImage('maths').url, imageHint: getImage('maths').hint },
        { name: "Science", href: "/resources/ncert-solutions/class-9-science", imageUrl: getImage('science').url, imageHint: getImage('science').hint },
        { name: "Social Studies", href: "/resources/ncert-solutions/class-9-social", imageUrl: getImage('social').url, imageHint: getImage('social').hint },
        { name: "English", href: "/resources/ncert-solutions/class-9-english", imageUrl: getImage('english').url, imageHint: getImage('english').hint }
    ],
    "Class 11": [
        { name: "Maths", href: "/resources/ncert-solutions/class-11-maths", imageUrl: getImage('maths').url, imageHint: getImage('maths').hint },
        { name: "Physics", href: "/resources/ncert-solutions/class-11-physics", imageUrl: getImage('physics').url, imageHint: getImage('physics').hint },
        { name: "Chemistry", href: "/resources/ncert-solutions/class-11-chemistry", imageUrl: getImage('chemistry').url, imageHint: getImage('chemistry').hint },
        { name: "Biology", href: "/resources/ncert-solutions/class-11-biology", imageUrl: getImage('biology').url, imageHint: getImage('biology').hint }
    ],
    "Class 12": [
        { name: "Maths", href: "/resources/ncert-solutions/class-12-maths", imageUrl: getImage('maths').url, imageHint: getImage('maths').hint },
        { name: "Physics", href: "/resources/ncert-solutions/class-12-physics", imageUrl: getImage('physics').url, imageHint: getImage('physics').hint },
        { name: "Chemistry", href: "/resources/ncert-solutions/class-12-chemistry", imageUrl: getImage('chemistry').url, imageHint: getImage('chemistry').hint },
        { name: "Biology", href: "/resources/ncert-solutions/class-12-biology", imageUrl: getImage('biology').url, imageHint: getImage('biology').hint }
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
    <div className="overflow-x-auto pb-8 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex gap-6 px-4 md:px-[10%]">
            {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-96 w-[350px] rounded-2xl flex-shrink-0" />
            ))}
        </div>
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
                  [...Array(6)].map((_, i) => <Skeleton key={i} className="h-9 w-24 rounded-md" />)
              ) : (
                  classes.map((className) => (
                  <button
                      key={className}
                      onClick={() => handleClassChange(className)}
                      className={`py-2 px-4 whitespace-nowrap text-sm font-medium transition-colors border
                      ${selectedClass === className 
                          ? 'border-primary text-primary bg-primary/10 rounded-md' 
                          : 'border-border text-muted-foreground hover:text-foreground hover:bg-muted rounded-md'}`}
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
                          <Link href={subject.href} key={index} className="block flex-shrink-0 w-[300px] sm:w-[350px] group">
                              <Card className="h-full rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col bg-card">
                                  <CardContent className="p-8 flex-grow flex flex-col">
                                  
                                  <h3 className="text-2xl font-bold mt-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">{subject.name}</h3>
                                  <p className="text-sm mt-2 text-muted-foreground flex-grow">Solutions for {subject.name}.</p>
                                  </CardContent>
                                  <div className="relative aspect-[4/3] w-full mt-auto">
                                  <Image
                                      src={subject.imageUrl}
                                      alt={subject.name}
                                      data-ai-hint={subject.imageHint}
                                      fill
                                      className="object-cover"
                                  />
                                  </div>
                              </Card>
                          </Link>
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

export default function NcertSolutionsNewPage() {
    return (
        <Suspense fallback={<div className="flex justify-center items-center h-screen"><Skeleton className="h-96 w-full max-w-4xl" /></div>}>
            <NcertSolutionsPageContent />
        </Suspense>
    )
}
