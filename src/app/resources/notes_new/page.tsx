
'use client';

import * as React from 'react';
import { useState, useEffect, Suspense } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, BookText, HelpCircle } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
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
  maths: { url: "https://ezeenotes.in/wp-content/uploads/2024/03/Book-Mockups-2-1-e1710253086447-1024x802.png", hint: "math abstract" },
  science: { url: "https://ezeenotes.in/wp-content/uploads/2024/03/Book-Mockups-2-1-e1710253086447-1024x802.png", hint: "science abstract" },
  social: { url: "https://ezeenotes.in/wp-content/uploads/2024/03/Book-Mockups-2-1-e1710253086447-1024x802.png", hint: "social studies" },
  english: { url: "https://ezeenotes.in/wp-content/uploads/2024/03/Book-Mockups-2-1-e1710253086447-1024x802.png", hint: "english literature" },
  physics: { url: "https://ezeenotes.in/wp-content/uploads/2024/03/Book-Mockups-2-1-e1710253086447-1024x802.png", hint: "physics abstract" },
  chemistry: { url: "https://ezeenotes.in/wp-content/uploads/2024/03/Book-Mockups-2-1-e1710253086447-1024x802.png", hint: "chemistry abstract" },
  biology: { url: "https://ezeenotes.in/wp-content/uploads/2024/03/Book-Mockups-2-1-e1710253086447-1024x802.png", hint: "biology abstract" },
  history: { url: "https://ezeenotes.in/wp-content/uploads/2024/03/Book-Mockups-2-1-e1710253086447-1024x802.png", hint: "history abstract" },
  geography: { url: "https://ezeenotes.in/wp-content/uploads/2024/03/Book-Mockups-2-1-e1710253086447-1024x802.png", hint: "geography abstract" },
  'political-science': { url: "https://ezeenotes.in/wp-content/uploads/2024/03/Book-Mockups-2-1-e1710253086447-1024x802.png", hint: "political science" },
  economics: { url: "https://ezeenotes.in/wp-content/uploads/2024/03/Book-Mockups-2-1-e1710253086447-1024x802.png", hint: "economics abstract" },
  default: { url: "https://ezeenotes.in/wp-content/uploads/2024/03/Book-Mockups-2-1-e1710253086447-1024x802.png", hint: "books stack" },
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
  
  return (
     <div className="bg-gray-100 dark:bg-gray-800">
      <div className="container mx-auto px-4 md:px-6 pt-12 pb-6 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">Notes for {selectedClass}</h1>
        <p className="text-muted-foreground">Find concise and comprehensive notes to help you revise and learn effectively.</p>
      </div>

      <div className="mb-8">
        <div className="overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex justify-start md:justify-center items-center gap-2 whitespace-nowrap px-4 sm:px-0">
            {sortedClasses.map((className: string) => (
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
            ))}
          </div>
        </div>
      </div>

      <main className="flex-1 pb-12">
        <div key={animationKey} className="relative animate-fade-in-up">
            {subjects && subjects.length > 0 ? (
            <div className="overflow-x-auto pb-8 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                <div className="flex gap-6 px-4 md:px-[10%]">
                    {subjects.map((subject: Subject, index: number) => (
                        <Link href={subject.href} key={index} className="block flex-shrink-0 w-[300px] sm:w-[350px] group">
                        <Card className="h-full rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col bg-card">
                            <CardContent className="p-8 flex-grow flex flex-col">
                            
                            <h3 className="text-2xl font-bold mt-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">{subject.name}</h3>
                            <p className="text-sm mt-2 text-muted-foreground flex-grow">In-depth notes for {subject.name}.</p>
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
                    ))}
                </div>
            </div>
            ) : (
            <div className="col-span-full text-center py-12">
                <Card className="p-8 inline-block">
                    <BookText className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground font-semibold">No notes found for this class.</p>
                    <p className="text-sm text-muted-foreground">Please select another class to see available notes.</p>
                </Card>
            </div>
            )}
        </div>
      </main>
    </div>
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
             <div className="bg-gray-100 dark:bg-gray-800">
                <div className="container mx-auto px-4 md:px-6 pt-12 pb-6 text-center">
                    <Skeleton className="h-9 w-64 mx-auto mb-2" />
                    <Skeleton className="h-5 w-96 mx-auto" />
                </div>
                <div className="mb-8 flex justify-center gap-2">
                    {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-9 w-24 rounded-md" />)}
                </div>
                <div className="overflow-x-auto pb-8 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    <div className="flex gap-6 px-4 md:px-[10%]">
                        {[...Array(3)].map((_, i) => (
                            <Skeleton key={i} className="h-96 w-[350px] rounded-2xl" />
                        ))}
                    </div>
                </div>
            </div>
        );
    }
    
    return (
        <Suspense fallback={<div className="flex justify-center items-center h-screen"><Skeleton className="h-96 w-full max-w-4xl" /></div>}>
            <NotesPageContent initialData={initialData} />
        </Suspense>
    );
}
