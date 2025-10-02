
'use client';

import * as React from 'react';
import { useState, useEffect, Suspense } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, BookText, HelpCircle, Home } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { getCollection } from '@/app/actions/data';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { usePathname, useRouter } from 'next/navigation';

type Subject = {
  name: string;
  href: string;
  imageUrl: string;
  imageHint: string;
};

const newImageUrl = "https://ezeenotes.in/wp-content/uploads/2024/03/Book-Mockups-2-1-e1710253086447-1024x802.png";

const subjectImageMap: { [key: string]: { url: string; hint: string } } = {
  maths: { url: newImageUrl, hint: "math abstract" },
  science: { url: newImageUrl, hint: "science abstract" },
  social: { url: newImageUrl, hint: "social studies" },
  english: { url: newImageUrl, hint: "english literature" },
  physics: { url: newImageUrl, hint: "physics abstract" },
  chemistry: { url: newImageUrl, hint: "chemistry abstract" },
  biology: { url: newImageUrl, hint: "biology abstract" },
  history: { url: newImageUrl, hint: "history abstract" },
  geography: { url: newImageUrl, hint: "geography abstract" },
  'political-science': { url: newImageUrl, hint: "political science" },
  economics: { url: newImageUrl, hint: "economics abstract" },
  default: { url: newImageUrl, hint: "books stack" },
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

function NotesPageContent({ initialData }: { initialData: any }) {
  const { notesByClass, classes: sortedClasses } = initialData;
  const [selectedClass, setSelectedClass] = useState('');
  const [animationKey, setAnimationKey] = useState(0);

  useEffect(() => {
    if (sortedClasses.length > 0) {
      const defaultClass = sortedClasses.find((c: string) => c.includes('10')) || sortedClasses[0];
      setSelectedClass(defaultClass);
    }
  }, [sortedClasses]);

  const subjects = notesByClass[selectedClass] || [];

  const handleClassChange = (className: string) => {
    setSelectedClass(className);
    setAnimationKey(prev => prev + 1);
  };
  
  const renderSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {[...Array(4)].map((_, i) => (
        <Card key={i} className="flex flex-col rounded-xl shadow-lg">
          <CardContent className="p-6 flex flex-col flex-grow items-start">
            <Skeleton className="h-8 w-1/2 mb-2" />
            <Skeleton className="h-4 w-full mb-4" />
            <Skeleton className="h-10 w-48 mb-4" />
          </CardContent>
          <Skeleton className="w-full aspect-[4/3] rounded-b-xl" />
        </Card>
      ))}
    </div>
  );

  return (
    <>
      <div className="text-center mb-12 animate-fade-in-up">
        <h1 className="text-4xl md:text-5xl font-extrabold text-primary tracking-tight">Notes for {selectedClass}</h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          Find concise and comprehensive notes to help you revise and learn effectively.
        </p>
      </div>

      <div className="mb-8">
        <div className="overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex justify-start md:justify-center items-center gap-2 whitespace-nowrap px-4 sm:px-0">
             {sortedClasses.length === 0 ? (
                 [...Array(6)].map((_, i) => <Skeleton key={i} className="h-9 w-24 rounded-md" />)
            ) : (
                sortedClasses.map((className: string) => (
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
        {sortedClasses.length === 0 ? renderSkeleton() : (
            <div key={animationKey} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-fade-in-up">
            {subjects && subjects.length > 0 ? (
                subjects.map((subject: Subject, index: number) => (
                  <Link href={subject.href} key={index} className="block group">
                    <Card
                      className="flex flex-col rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 bg-card h-full"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <CardContent className="p-6 flex-grow flex flex-col">
                        
                        <h3 className="text-2xl font-bold text-primary mb-1">{subject.name}</h3>
                        <p className="text-sm text-muted-foreground mb-4">In-depth notes for {subject.name}.</p>
                        <Button variant="outline" className="w-full rounded-full bg-white hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700">English / हिन्दी</Button>
                      </CardContent>
                       <div className="relative aspect-[4/3] w-full mt-auto">
                           <Image
                                src={subject.imageUrl}
                                alt={subject.name}
                                data-ai-hint={subject.imageHint}
                                fill
                                className="object-cover rounded-b-xl"
                            />
                        </div>
                    </Card>
                  </Link>
                ))
            ) : (
                <div className="col-span-full text-center py-12">
                    <Card className="p-8 inline-block bg-background/50">
                        <BookText className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                        <p className="text-muted-foreground font-semibold">No notes found for this class.</p>
                        <p className="text-sm text-muted-foreground">Please select another class to see available notes.</p>
                    </Card>
                </div>
            )}
            </div>
        )}
      </main>
    </>
  );
}

export default function NotesNewPage() {
    const [initialData, setInitialData] = useState({ notesByClass: {}, classes: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            const result = await getCollection('notes');
            if (result.success && result.data) {
                const notesByClass = (result.data as any[]).reduce((acc, classDoc) => {
                    const className = classDoc.name || classDoc.id.replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase());
                    acc[className] = Object.entries(classDoc.subjects).map(([subjectKey, subjectData]: [string, any]) => ({
                        name: subjectData.name,
                        href: `/resources/notes_new/${classDoc.id}/${subjectKey}`,
                        imageUrl: getImage(subjectKey).url,
                        imageHint: getImage(subjectKey).hint,
                    }));
                    return acc;
                }, {});
                
                const classes = Object.keys(notesByClass).sort((a, b) => {
                    const getOrder = (name: string) => parseInt(name.replace('Class ', ''), 10) || 99;
                    return getOrder(a) - getOrder(b);
                });

                setInitialData({ notesByClass, classes });
            }
            setLoading(false);
        }
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="relative min-h-screen w-full p-4 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800 overflow-y-auto">
              <div className="relative z-10 container mx-auto py-12">
                <div className="mb-6 text-center">
                    <Skeleton className="h-9 w-64 mx-auto mb-2" />
                    <Skeleton className="h-5 w-96 mx-auto" />
                </div>
                <div className="mb-8 flex justify-center gap-2">
                    {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-9 w-24 rounded-full" />)}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-96 w-full rounded-2xl" />)}
                </div>
              </div>
            </div>
        );
    }
    
    return (
        <div className="relative min-h-screen w-full bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800 overflow-y-auto">
            <Link href="/" className="absolute top-4 right-4 z-20">
                <Button variant="ghost" size="icon">
                    <Home className="h-6 w-6 text-primary" />
                    <span className="sr-only">Home</span>
                </Button>
            </Link>
            <div className="relative z-10 container mx-auto py-12">
                <Suspense fallback={<div>Loading content...</div>}>
                    <NotesPageContent initialData={initialData} />
                </Suspense>
            </div>
        </div>
    );
}
