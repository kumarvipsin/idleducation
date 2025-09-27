
'use client';

import { useState, useEffect, Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, BookCopy, FileText, BookCheck as BookCheckIcon, ClipboardEdit } from 'lucide-react';
import Link from 'next/link';
import { getExamCategories } from '@/app/actions/data';
import type { TExamCategory } from '@/app/actions/types';
import { Skeleton } from '@/components/ui/skeleton';
import { getDynamicGradient, getDynamicIcon } from '@/lib/dynamic-styles';

const resourceLinks = [
  { href: '/resources/previous-year-questions', label: 'Previous Year Question Paper', icon: <FileText /> },
  { href: '/resources/ncert-solutions', label: 'NCERT Solutions', icon: <BookCheckIcon /> },
  { href: '/resources/notes', label: 'Notes', icon: <ClipboardEdit /> },
  { href: '/resources/reference-books', label: 'Reference Books', icon: <BookCopy /> },
];

function ExamcatPageContent() {
  const [categories, setCategories] = useState<TExamCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const categoriesResult = await getExamCategories();

      if (categoriesResult.success && categoriesResult.data) {
        const competitiveExams = (categoriesResult.data as TExamCategory[])
          .filter(cat => cat.group === 'competitive')
          .sort((a, b) => (a.order || 99) - (b.order || 99));
        setCategories(competitiveExams);
      }
      setLoading(false);
    };
    fetchData();
  }, []);
  
  const renderSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {[...Array(4)].map((_, i) => (
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
      <section className="w-full pb-12 md:pb-24 animate-fade-in-up">
        <div className="container mx-auto px-4 md:px-[10%]">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-primary">
              Competitive Exams
            </h1>
            <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
              Explore our comprehensive coaching programs for various competitive exams and take the next step towards your career goals.
            </p>
          </div>
          
           <main className="flex-1">
            {loading ? renderSkeleton() : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-fade-in-up">
                {categories.length > 0 ? (
                    categories.map((category, index) => (
                    <Card 
                        key={category.id} 
                        className={`flex flex-col rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-gradient-to-br ${getDynamicGradient(category.theme)}`}
                        style={{ animationDelay: `${index * 0.05}s` }}
                    >
                        <CardContent className="p-6 flex flex-col flex-grow items-start text-foreground">
                            <div className="flex justify-between items-start w-full mb-4">
                                {getDynamicIcon(category.icon)}
                            </div>
                            <h3 className="text-xl font-bold mb-1 flex-grow">{category.name}</h3>
                            <Button asChild variant="default" className="mt-auto w-full">
                                <Link href={category.href}>
                                    VIEW MORE <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                    ))
                ) : (
                    <div className="col-span-full text-center py-12">
                        <Card className="p-8 inline-block">
                            <p className="text-muted-foreground font-semibold">No competitive exam categories found.</p>
                        </Card>
                    </div>
                )}
                </div>
            )}
           </main>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 bg-muted/30 rounded-lg animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
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
