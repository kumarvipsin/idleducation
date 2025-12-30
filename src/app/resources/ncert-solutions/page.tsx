
'use client';

import * as React from 'react';
import { useState, useEffect, Suspense } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookCheck, HelpCircle, ArrowRight } from 'lucide-react';
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
  className: string;
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

function NcertSolutionsPageContent() {
  const [solutionsByClass, setSolutionsByClass] = useState<any>({});
  const [classes, setClasses] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedClass, setSelectedClass] = useState('All Ncert');
  const [animationKey, setAnimationKey] = useState(0);

  useEffect(() => {
    const fetchSolutionsData = async () => {
      setLoading(true);
      const result = await getCollection('ncertSolutions');
      if (result.success && result.data) {
        const formattedData = (result.data as any[]).reduce((acc, classDoc) => {
          const className = classDoc.name || classDoc.id.replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase());
          acc[className] = Object.entries(classDoc.subjects).map(([subjectKey, subjectData]: [string, any]) => ({
            name: subjectData.name,
            href: `/resources/ncert-solutions/${classDoc.id}/${subjectKey}`,
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

        setSolutionsByClass(formattedData);
        setClasses(sortedClasses);
      }
      setLoading(false);
    };

    fetchSolutionsData();
  }, []);

  const subjects = selectedClass === 'All Ncert'
    ? Object.values(solutionsByClass).flat() as Subject[]
    : solutionsByClass[selectedClass] || [];
  
  const handleClassChange = (className: string) => {
    setSelectedClass(className);
    setAnimationKey(prev => prev + 1);
  };
  
  const allClassButtons = ['All Ncert', ...classes];

  const renderSkeleton = () => (
    <div className="flex gap-6 px-4 md:px-[10%]">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="block flex-shrink-0 w-[300px] sm:w-[350px]">
            <Skeleton key={i} className="h-[450px] w-full rounded-2xl" />
        </div>
      ))}
    </div>
  );

  return (
    <div className="py-12">
        <div className="text-center mb-12 animate-fade-in-up">
            <h1 className="text-4xl md:text-5xl font-extrabold text-primary tracking-tight">NCERT Solutions for {selectedClass === 'All Ncert' ? 'All Classes' : selectedClass}</h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                Explore our detailed, step-by-step solutions for your NCERT textbooks.
            </p>
        </div>

      <div className="mb-8">
        <div className="overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex justify-start md:justify-center items-center gap-2 whitespace-nowrap px-4 sm:px-0">
             {loading ? (
                 [...Array(7)].map((_, i) => <Skeleton key={i} className="h-9 w-24 rounded-md" />)
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
            {loading ? (
              renderSkeleton()
            ) : (
              <div key={animationKey} className="flex gap-6 px-4 md:pl-[10%] animate-fade-in-up">
                {subjects && subjects.length > 0 ? (
                  subjects.map((subject: Subject, index: number) => (
                    <div key={`${subject.href}-${index}`} className="block flex-shrink-0 w-[300px] sm:w-[350px] group">
                      <Link href={subject.href} className="block h-full">
                        <Card
                          className="flex flex-col rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 bg-card h-full"
                          style={{ animationDelay: `${index * 50}ms` }}
                        >
                          <CardContent className="p-6 flex-grow flex flex-col">
                            <div className="flex justify-between items-start">
                              <h3 className="text-2xl font-bold text-primary mb-1">{subject.name}</h3>
                              <Badge variant="secondary">{subject.className}</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-4">Solutions for {subject.name}.</p>
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
                    </div>
                  ))
                ) : (
                    <div className="w-full text-center py-12">
                        <Card className="p-8 inline-block bg-background/50">
                            <BookCheck className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                            <p className="text-muted-foreground font-semibold">No solutions found for this class.</p>
                            <p className="text-sm text-muted-foreground">Please select another class to see available solutions.</p>
                        </Card>
                    </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default function NcertSolutionsPage() {
    return (
        <Suspense fallback={
            <div className="relative min-h-screen w-full p-4">
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
        }>
            <NcertSolutionsPageContent />
        </Suspense>
    )
}
