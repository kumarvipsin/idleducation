
'use client';

import { useState, useEffect, Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, BookCopy, FileText, BookCheck as BookCheckIcon, ClipboardEdit } from 'lucide-react';
import Link from 'next/link';
import { getExamCategories } from '@/app/actions/data';
import type { TExamCategory } from '@/app/actions/types';
import { Skeleton } from '@/components/ui/skeleton';
import { GcsImage } from '@/components/gcs-image';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { BookText, TestTube2, Scale, Globe, Landmark, Atom, Sigma, Dna, TrendingUp, FlaskConical, HelpCircle } from 'lucide-react';
import React from 'react';

const resourceLinks = [
  { href: '/resources/previous-year-questions', label: 'Previous Year Question Paper', icon: <FileText /> },
  { href: '/resources/ncert-solutions', label: 'NCERT Solutions', icon: <BookCheckIcon /> },
  { href: '/resources/notes', label: 'Notes', icon: <ClipboardEdit /> },
  { href: '/resources/reference-books', label: 'Reference Books', icon: <BookCopy /> },
];

const subjectIconMap: { [key: string]: React.ReactNode } = {
  maths: <Sigma className="w-8 h-8 text-green-600 dark:text-green-400" />,
  science: <TestTube2 className="w-8 h-8 text-blue-600 dark:text-blue-400" />,
  'social-studies': <Landmark className="w-8 h-8 text-amber-600 dark:text-amber-400" />,
  english: <BookText className="w-8 h-8 text-purple-600 dark:text-purple-400" />,
  physics: <Atom className="w-8 h-8 text-sky-600 dark:text-sky-400" />,
  chemistry: <FlaskConical className="w-8 h-8 text-purple-600 dark:text-purple-400" />,
  biology: <Dna className="w-8 h-8 text-lime-600 dark:text-lime-400" />,
  history: <Landmark className="w-8 h-8 text-red-600 dark:text-red-400" />,
  geography: <Globe className="w-8 h-8 text-orange-600 dark:text-orange-400" />,
  'political-science': <Scale className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />,
  economics: <TrendingUp className="w-8 h-8 text-pink-600 dark:text-pink-400" />,
  default: <HelpCircle className="w-8 h-8 text-gray-600 dark:text-gray-400" />,
};

const getIconForCategory = (categoryName: string) => {
    const lowerCaseName = categoryName.toLowerCase();
    if (lowerCaseName.includes('math')) return subjectIconMap.maths;
    if (lowerCaseName.includes('jee')) return subjectIconMap.physics;
    if (lowerCaseName.includes('neet')) return subjectIconMap.biology;
    if (lowerCaseName.includes('ssc')) return subjectIconMap.social;
    if (lowerCaseName.includes('cuet')) return subjectIconMap.english;
    if (lowerCaseName.includes('gate')) return subjectIconMap.maths;
    return subjectIconMap.default;
}

const getGradientForCategory = (categoryName: string): string => {
  const lowerCaseName = categoryName.toLowerCase();
  if (lowerCaseName.includes('math')) return 'from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30';
  if (lowerCaseName.includes('jee')) return 'from-sky-50 to-sky-100 dark:from-sky-900/30 dark:to-sky-800/30';
  if (lowerCaseName.includes('neet')) return 'from-lime-50 to-lime-100 dark:from-lime-900/30 dark:to-lime-800/30';
  if (lowerCaseName.includes('ssc')) return 'from-amber-50 to-amber-100 dark:from-amber-900/30 dark:to-amber-800/30';
  if (lowerCaseName.includes('cuet')) return 'from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30';
  if (lowerCaseName.includes('gate')) return 'from-indigo-50 to-indigo-100 dark:from-indigo-900/30 dark:to-indigo-800/30';
  return 'from-gray-50 to-gray-100 dark:from-gray-900/30 dark:to-gray-800/30';
};


function ExamcatPageContent() {
  const [categories, setCategories] = useState<TExamCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<TExamCategory | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const categoriesResult = await getExamCategories();
      if (categoriesResult.success && categoriesResult.data) {
        const competitiveExams = (categoriesResult.data as TExamCategory[])
          .filter(cat => cat.group === 'competitive')
          .sort((a, b) => (a.order || 99) - (b.order || 99));
        setCategories(competitiveExams);
        if (competitiveExams.length > 0) {
          const defaultCat = competitiveExams.find(c => c.name === 'NEET') || competitiveExams[0];
          setActiveCategory(defaultCat);
        }
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const renderSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
       {[...Array(8)].map((_, i) => (
        <Card key={i} className="flex flex-col rounded-xl shadow-lg">
          <CardContent className="p-6 flex flex-col flex-grow items-start">
            <Skeleton className="h-10 w-10 rounded-full mb-4" />
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
        <div className="mb-6 text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">Competitive Exams</h1>
            <p className="text-muted-foreground">Choose your goal and start your journey to success with our expert guidance.</p>
        </div>

        <main className="flex-1">
        {loading ? renderSkeleton() : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-fade-in-up">
            {categories.map((category, index) => (
                <Card 
                    key={category.id} 
                    className={`flex flex-col rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-gradient-to-br ${getGradientForCategory(category.name)}`}
                    style={{ animationDelay: `${index * 0.05}s` }}
                >
                    <CardContent className="p-6 flex flex-col flex-grow items-start text-foreground">
                        <div className="flex justify-between items-start w-full mb-4">
                            {getIconForCategory(category.name)}
                        </div>
                        <h3 className="text-xl font-bold mb-1 flex-grow">{category.name}</h3>
                        <Button asChild variant="default" className="mt-auto w-full">
                            <Link href={category.href}>
                                VIEW MORE <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            ))}
            </div>
        )}
        </main>
        
        <section className="w-full py-12 md:py-24 bg-muted/30 rounded-lg animate-fade-in-up mt-16" style={{ animationDelay: '0.4s' }}>
          <div className="container mx-auto px-4 md:px-[10%]">
             <div className="text-center">
                <h3 className="font-bold text-2xl mb-6 text-primary border-b-2 border-primary/20 pb-2 inline-block">Essential Resources</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {resourceLinks.map(link => (
                        <Button asChild variant="outline" key={link.href} className="justify-start bg-background h-12 text-base">
                            <Link href={link.href}>
                                {link.icon}
                                <span className="ml-2">{link.label}</span>
                            </Link>
                        </Button>
                    ))}
                </div>
            </div>
          </div>
      </section>
    </div>
  );
}

export default function ExamcatPage() {
    return (
        <Suspense fallback={<div className="flex justify-center items-center h-screen"><Skeleton className="h-96 w-full max-w-4xl" /></div>}>
            <ExamcatPageContent />
        </Suspense>
    )
}

    