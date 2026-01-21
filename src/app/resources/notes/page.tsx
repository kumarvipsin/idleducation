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
import { Sigma, TestTube2, Landmark, Atom, Dna, Globe, Scale, TrendingUp, FlaskConical } from 'lucide-react';

type Subject = {
  name: string;
  href: string;
  icon: React.ReactNode;
  gradient: string;
};

const subjectIconMap: { [key: string]: React.ReactNode } = {
  maths: <div className="p-2 bg-white/30 rounded-full"><Sigma className="w-8 h-8 text-green-600 dark:text-green-400" /></div>,
  science: <div className="p-2 bg-white/30 rounded-full"><TestTube2 className="w-8 h-8 text-blue-600 dark:text-blue-400" /></div>,
  social: <div className="p-2 bg-white/30 rounded-full"><Landmark className="w-8 h-8 text-amber-600 dark:text-amber-400" /></div>,
  english: <div className="p-2 bg-white/30 rounded-full"><BookText className="w-8 h-8 text-purple-600 dark:text-purple-400" /></div>,
  physics: <div className="p-2 bg-white/30 rounded-full"><Atom className="w-8 h-8 text-sky-600 dark:text-sky-400" /></div>,
  chemistry: <div className="p-2 bg-white/30 rounded-full"><FlaskConical className="w-8 h-8 text-purple-600 dark:text-purple-400" /></div>,
  biology: <div className="p-2 bg-white/30 rounded-full"><Dna className="w-8 h-8 text-lime-600 dark:text-lime-400" /></div>,
  history: <div className="p-2 bg-white/30 rounded-full"><Landmark className="w-8 h-8 text-red-600 dark:text-red-400" /></div>,
  geography: <div className="p-2 bg-white/30 rounded-full"><Globe className="w-8 h-8 text-orange-600 dark:text-orange-400" /></div>,
  'political-science': <div className="p-2 bg-white/30 rounded-full"><Scale className="w-8 h-8 text-indigo-600 dark:text-indigo-400" /></div>,
  economics: <div className="p-2 bg-white/30 rounded-full"><TrendingUp className="w-8 h-8 text-pink-600 dark:text-pink-400" /></div>,
  default: <div className="p-2 bg-white/30 rounded-full"><BookText className="w-8 h-8 text-gray-600 dark:text-gray-400" /></div>,
};

const subjectGradientMap: { [key: string]: string } = {
  maths: 'from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30',
  science: 'from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30',
  social: 'from-amber-50 to-amber-100 dark:from-amber-900/30 dark:to-amber-800/30',
  english: 'from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30',
  physics: 'from-sky-50 to-sky-100 dark:from-sky-900/30 dark:to-sky-800/30',
  chemistry: 'from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30',
  biology: 'from-lime-50 to-lime-100 dark:from-lime-900/30 dark:to-lime-800/30',
  history: 'from-red-50 to-red-100 dark:from-red-900/30 dark:to-red-800/30',
  geography: 'from-orange-50 to-orange-100 dark:from-orange-900/30 dark:to-orange-800/30',
  'political-science': 'from-indigo-50 to-indigo-100 dark:from-indigo-900/30 dark:to-indigo-800/30',
  economics: 'from-pink-50 to-rose-100 dark:from-pink-900/30 dark:to-rose-800/30',
  default: 'from-gray-50 to-gray-100 dark:from-gray-900/30 dark:to-gray-800/30',
};

const getIcon = (key: string) => {
    const lowerKey = key.toLowerCase();
    for (const subjectKey in subjectIconMap) {
        if (lowerKey.includes(subjectKey)) {
            return subjectIconMap[subjectKey];
        }
    }
    return subjectIconMap.default;
};

const getGradient = (key: string) => {
    const lowerKey = key.toLowerCase();
     for (const subjectKey in subjectGradientMap) {
        if (lowerKey.includes(subjectKey)) {
            return subjectGradientMap[subjectKey];
        }
    }
    return subjectGradientMap.default;
};

function NotesPageContent({ initialData }: { initialData: any }) {
  const { notesByClass, classes: sortedClasses } = initialData;
  const [selectedClass, setSelectedClass] = useState('All Notes');
  const [animationKey, setAnimationKey] = useState(0);

  useEffect(() => {
    if (sortedClasses.length > 0 && selectedClass === 'All Notes') {
        const defaultClass = sortedClasses.find(c => c.includes('10')) || sortedClasses[0];
        setSelectedClass(defaultClass);
    }
  }, [sortedClasses, selectedClass]);

  const subjects = selectedClass === 'All Notes'
    ? Object.values(notesByClass).flat() as Subject[]
    : notesByClass[selectedClass] || [];

  const handleClassChange = (className: string) => {
    setSelectedClass(className);
    setAnimationKey(prev => prev + 1);
  };
  
  const renderSkeleton = () => (
    <div className="flex gap-6 px-4 md:pl-[10%]">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="block flex-shrink-0 w-[300px] sm:w-[350px]">
            <Skeleton key={i} className="h-[450px] w-full rounded-2xl" />
        </div>
      ))}
    </div>
  );
  
  const allClassButtons = ['All Notes', ...sortedClasses];

  return (
    <>
      <div className="text-center mb-12 animate-fade-in-up">
        <h1 className="text-3xl md:text-4xl font-extrabold text-primary tracking-tight">Notes for {selectedClass === 'All Notes' ? 'All Classes' : selectedClass}</h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          Find concise and comprehensive notes to help you revise and learn effectively.
        </p>
      </div>

      <div className="mb-8">
        <div className="overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex justify-start md:justify-center items-center gap-2 whitespace-nowrap px-4 sm:px-0">
             {sortedClasses.length === 0 ? (
                 [...Array(7)].map((_, i) => <Skeleton key={i} className="h-9 w-24 rounded-full" />)
            ) : (
                allClassButtons.map((className: string) => (
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
        <div className="relative">
          <div className="overflow-x-auto pb-8 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {sortedClasses.length === 0 ? renderSkeleton() : (
                <div key={animationKey} className="flex gap-6 pl-4 md:pl-[10%] animate-fade-in-up">
                {subjects && subjects.length > 0 ? (
                    subjects.map((subject: Subject, index: number) => (
                        <div key={`${subject.href}-${index}`} className="block flex-shrink-0 w-[300px] sm:w-[350px] group">
                            <Link href={subject.href} className="block h-full">
                                <Card
                                    className={`flex flex-col rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-gradient-to-br ${subject.gradient} h-full`}
                                    style={{ animationDelay: `${index * 50}ms` }}
                                >
                                <CardContent className="p-6 flex-grow flex flex-col items-start text-foreground">
                                    <div className="flex justify-between items-start w-full mb-4">
                                        {subject.icon}
                                        <Badge variant="secondary">{subject.className}</Badge>
                                    </div>
                                    <h3 className="text-xl font-bold mb-1 flex-grow">{subject.name}</h3>
                                    <Button asChild variant="default" className="mt-auto w-full">
                                        <Link href={subject.href}>
                                            VIEW MORE <ArrowRight className="ml-2 h-4 w-4" />
                                        </Link>
                                    </Button>
                                </CardContent>
                                </Card>
                            </Link>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full text-center py-12 w-full">
                        <Card className="p-8 inline-block bg-background/50">
                            <BookText className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                            <p className="text-muted-foreground font-semibold">No notes found for this class.</p>
                            <p className="text-sm text-muted-foreground">Please select another class to see available notes.</p>
                        </Card>
                    </div>
                )}
                </div>
            )}
            </div>
        </div>
      </main>
    </>
  );
}

export default function NotesNewPage() {
    const [initialData, setInitialData] = useState<{ notesByClass: any, classes: string[] }>({ notesByClass: {}, classes: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            const result = await getCollection('notes');
            if (result.success && result.data) {
                const notesByClass = (result.data as any[]).reduce((acc, classDoc) => {
                    const className = classDoc.name || classDoc.id.replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase());
                    acc[className] = Object.entries(classDoc.subjects).map(([subjectKey, subjectData]: [string, any]) => ({
                        name: subjectData.name,
                        href: `/resources/notes/${classDoc.id}/${subjectKey}`,
                        icon: getIcon(subjectKey),
                        gradient: getGradient(subjectKey),
                        className: className
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
            <div className="relative min-h-screen w-full bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800">
              <div className="relative z-10 container mx-auto py-12">
                <div className="mb-6 text-center">
                    <Skeleton className="h-9 w-64 mx-auto mb-2" />
                    <Skeleton className="h-5 w-96 mx-auto" />
                </div>
                <div className="mb-8 flex justify-center gap-2">
                    {[...Array(7)].map((_, i) => <Skeleton key={i} className="h-9 w-24 rounded-full" />)}
                </div>
                <div className="flex gap-6 overflow-hidden">
                    {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-[450px] w-[350px] flex-shrink-0 rounded-2xl" />)}
                </div>
              </div>
            </div>
        );
    }
    
    return (
        <div className="relative min-h-screen w-full bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800">
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
