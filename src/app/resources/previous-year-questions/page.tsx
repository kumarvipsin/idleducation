
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Download, BookOpen, Home, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { getPreviousYearQuestions } from '@/app/actions';
import type { TPreviousYearQuestion } from '@/app/actions/types';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';

export default function PreviousYearQuestionsPage() {
  const [papers, setPapers] = useState<TPreviousYearQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedExam, setSelectedExam] = useState('');

  useEffect(() => {
    const fetchPapers = async () => {
      setLoading(true);
      const result = await getPreviousYearQuestions();
      if (result.success && result.data) {
        const fetchedPapers = result.data as TPreviousYearQuestion[];
        setPapers(fetchedPapers);
        const examCategories = Array.from(new Set(fetchedPapers.map(p => p.exam))).sort();
        if (examCategories.length > 0) {
          const defaultExam = examCategories.find(e => e.includes('CBSE Class 10')) || examCategories[0];
          setSelectedExam(defaultExam);
        }
      }
      setLoading(false);
    };
    fetchPapers();
  }, []);

  const examCategories = Array.from(new Set(papers.map(p => p.exam))).sort();
  const filteredPapers = papers.filter(p => p.exam === selectedExam);

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800 overflow-y-auto">
      <Link href="/" className="absolute top-4 right-4 z-20">
        <Button variant="ghost" size="icon">
          <Home className="h-6 w-6 text-primary" />
          <span className="sr-only">Home</span>
        </Button>
      </Link>
      <div className="relative z-10 container mx-auto py-12">
        <div className="text-center mb-12 animate-fade-in-up">
            <h1 className="text-4xl md:text-5xl font-extrabold text-primary tracking-tight">Previous Year Question Papers</h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                Practice with past exam papers to familiarize yourself with the format and question types.
            </p>
        </div>

        <div className="mb-8">
            <div className="overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                <div className="flex justify-start md:justify-center items-center gap-2 whitespace-nowrap px-4 sm:px-0">
                    {loading ? (
                        [...Array(6)].map((_, i) => <Skeleton key={i} className="h-9 w-24 rounded-full" />)
                    ) : (
                        examCategories.map((examName) => (
                        <button
                            key={examName}
                            onClick={() => setSelectedExam(examName)}
                            className={cn(
                            `py-2 px-4 whitespace-nowrap text-sm font-medium transition-colors border rounded-full`,
                            selectedExam === examName
                                ? 'border-primary text-primary bg-primary/10 shadow-md'
                                : 'border-border text-muted-foreground hover:text-foreground hover:bg-muted/50'
                            )}
                        >
                            {examName}
                        </button>
                        ))
                    )}
                </div>
            </div>
        </div>

        <div className="relative">
            {loading ? (
                 <div className="overflow-x-auto pb-8 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    <div className="flex gap-6 px-4 md:px-[10%]">
                        {[...Array(3)].map((_, i) => (
                            <Skeleton key={i} className="h-48 w-[300px] sm:w-[350px] rounded-lg" />
                        ))}
                    </div>
                </div>
            ) : filteredPapers.length > 0 ? (
                <div className="overflow-x-auto pb-8 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    <div className="flex gap-6 px-4 md:px-[10%]">
                        {filteredPapers.map((paper, index) => (
                            <div key={paper.id} className="block flex-shrink-0 w-[300px] sm:w-[350px] group">
                                <Card className="h-full rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col bg-card bg-gradient-to-br from-purple-50 to-blue-100 dark:from-purple-900/20 dark:to-blue-900/30">
                                    <CardContent className="p-6 flex-grow flex flex-col">
                                        <div className="flex justify-between items-start">
                                            <FileText className="w-8 h-8 text-primary" />
                                            <Badge variant="secondary">{paper.year}</Badge>
                                        </div>
                                        <h3 className="text-lg font-bold mt-4 flex-grow text-foreground">{paper.subject}</h3>
                                        <p className="text-sm text-muted-foreground mt-1 mb-4">{paper.title}</p>
                                        <Button asChild className="w-full mt-auto">
                                        <Link href={paper.pdfUrl || '#'} target="_blank" rel="noopener noreferrer" >
                                            Download PDF <Download className="ml-2 h-4 w-4" />
                                        </Link>
                                        </Button>
                                    </CardContent>
                                </Card>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="text-center py-16">
                    <BookOpen className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-semibold">No Papers Available</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Question papers for the selected exam will be available soon.
                    </p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
}
