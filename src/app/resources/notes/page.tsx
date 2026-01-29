'use client';

import * as React from 'react';
import { useState, useEffect, Suspense } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { BookText, TestTube2, Scale, Globe, Landmark, Atom, Sigma, Dna, ArrowRight, TrendingUp, FlaskConical, HelpCircle } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getCollection } from '@/app/actions/data';
import { Skeleton } from '@/components/ui/skeleton';
import Image from "next/image";
import { cn } from "@/lib/utils";

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


type Subject = {
  name: string;
  href: string;
  imageUrl: string;
  imageHint: string;
  className: string;
};

function NotesPageContent() {
  const [notesByClass, setNotesByClass] = useState<any>({});
  const [classes, setClasses] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedClass, setSelectedClass] = useState('');
  const [animationKey, setAnimationKey] = useState(0);

  useEffect(() => {
    const fetchNotesData = async () => {
      setLoading(true);
      const result = await getCollection('notes');
      if (result.success && result.data) {
        const formattedData = (result.data as any[]).reduce((acc, classDoc) => {
          const className = classDoc.name || classDoc.id.replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase());
          acc[className] = Object.entries(classDoc.subjects).map(([subjectKey, subjectData]: [string, any]) => ({
            name: subjectData.name,
            href: `/resources/notes/${classDoc.id}/${subjectKey}`,
            imageUrl: getImage(subjectKey).url,
            imageHint: getImage(subjectKey).hint,
            className: className,
          }));
          return acc;
        }, {});
        
        const sortedClasses = Object.keys(formattedData).sort((a, b) => {
             const getOrder = (name: string) => parseInt(name.replace('Class ', ''), 10) || 99;
             return getOrder(a) - getOrder(b);
        });

        setNotesByClass(formattedData);
        setClasses(sortedClasses);
        if (sortedClasses.length > 0) {
            const defaultClass = sortedClasses.find(c => c.includes('10')) || sortedClasses[0];
            setSelectedClass(defaultClass);
        }
      }
      setLoading(false);
    };

    fetchNotesData();
  }, []);

  const subjects = notesByClass[selectedClass] || [];
  
  const handleClassChange = (className: string) => {
    setSelectedClass(className);
    setAnimationKey(prev => prev + 1);
  };
  
  const allClassButtons = ['All Notes', ...classes];

  const renderSkeleton = () => (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {[...Array(12)].map((_, i) => (
            <Skeleton key={i} className="h-[280px] w-full rounded-lg" />
        ))}
    </div>
  );

  return (
    <div className="py-12 bg-white">
      <div className="text-center mb-12 animate-fade-in-up">
        <h1 className="text-2xl md:text-3xl font-extrabold text-primary tracking-tight group inline-block">
            Notes for {selectedClass}
            <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-primary mx-auto"></span>
        </h1>
        <p className="mt-2 text-sm text-muted-foreground font-semibold">
            Find concise and comprehensive notes to help you revise and learn effectively.
        </p>
      </div>

      <div className="mb-8">
        <div className="overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex justify-start md:justify-center items-center gap-2 whitespace-nowrap px-4 sm:px-0">
             {loading ? (
                 [...Array(7)].map((_, i) => <Skeleton key={i} className="h-9 w-24 rounded-md" />)
            ) : (
                allClassButtons.map((className) => (
                <button
                    key={className}
                    onClick={() => handleClassChange(className)}
                    className={`py-2 px-6 text-sm font-medium transition-colors
                    ${selectedClass === className 
                        ? 'border-b-2 border-primary text-primary' 
                        : 'text-muted-foreground hover:text-foreground'}`}
                >
                    {className}
                </button>
                ))
            )}
          </div>
        </div>
      </div>

      <main className="flex-1 px-4 md:px-6">
        {loading ? renderSkeleton() : (
            <div key={animationKey} className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 animate-fade-in-up">
            {subjects && subjects.length > 0 ? (
                subjects.map((subject: Subject, index: number) => (
                    <Link key={`${subject.href}-${index}`} href={subject.href} className="block h-full group">
                        <Card
                          className="flex flex-col rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-card h-full"
                          style={{ animationDelay: `${index * 50}ms` }}
                        >
                          <div className="relative aspect-[4/3] w-full">
                               <Image
                                    src={subject.imageUrl}
                                    alt={subject.name}
                                    data-ai-hint={subject.imageHint}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                          <CardContent className="p-4 flex-grow flex flex-col">
                            <div className="flex justify-between items-start">
                              <h3 className="font-semibold text-base text-primary mb-1">{subject.name}</h3>
                              <Badge variant="secondary" className="text-xs">{subject.className}</Badge>
                            </div>
                            <p className="text-xs text-muted-foreground mb-3 flex-grow">Notes for {subject.name}.</p>
                            <Button variant="outline" className="w-full rounded-full bg-white hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 h-8 text-xs">VIEW MORE</Button>
                          </CardContent>
                        </Card>
                      </Link>
                ))
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
        )}
      </main>
    </div>
  );
}

export default function NotesPage() {
    return (
        <div className="relative min-h-screen w-full bg-white dark:bg-background">
            <div className="relative z-10 container mx-auto py-12">
                <Suspense fallback={
                    <div className="relative min-h-screen w-full bg-white dark:bg-background">
                    <div className="relative z-10 container mx-auto py-12">
                        <div className="mb-6 text-center">
                            <Skeleton className="h-9 w-64 mx-auto mb-2" />
                            <Skeleton className="h-5 w-96 mx-auto" />
                        </div>
                        <div className="mb-8 flex justify-center gap-2">
                            {[...Array(7)].map((_, i) => <Skeleton key={i} className="h-9 w-24 rounded-full" />)}
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-48 w-full rounded-xl" />)}
                        </div>
                    </div>
                    </div>
                }>
                    <NotesPageContent />
                </Suspense>
            </div>
        </div>
    );
}
