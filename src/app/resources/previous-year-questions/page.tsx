
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Download, BookOpen, Home } from 'lucide-react';
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
    <div className="relative min-h-screen w-full p-4 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800 overflow-y-auto">
      <Link href="/" className="absolute top-4 right-4 z-20">
        <Button variant="ghost" size="icon">
          <Home className="h-6 w-6 text-primary" />
          <span className="sr-only">Home</span>
        </Button>
      </Link>
      <div className="relative z-10 container mx-auto py-12">
        <div className="md:max-w-4xl md:mx-auto">
          <Card className="shadow-2xl rounded-2xl border-2 border-primary/10 bg-background/80 backdrop-blur-sm overflow-hidden animate-fade-in-up">
            <div className="relative w-full h-64">
              <Image
                src="https://img.freepik.com/free-photo/top-view-stacked-books-with-copy-space_23-2148898375.jpg"
                alt="Previous Year Question Papers"
                data-ai-hint="books studying"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <h1 className="text-4xl md:text-5xl font-extrabold text-white text-center p-4">
                  Previous Year Question Papers
                </h1>
              </div>
            </div>
            <CardContent className="p-6 md:p-10">
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

              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-16 w-full rounded-lg" />)}
                </div>
              ) : filteredPapers.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {filteredPapers.map((paper) => (
                    <Card key={paper.id} className="bg-muted/30">
                      <CardContent className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <FileText className="h-6 w-6 text-primary" />
                          <div className="flex-1">
                            <p className="font-semibold text-sm">{paper.subject} - {paper.year}</p>
                            <p className="text-xs text-muted-foreground">{paper.title}</p>
                          </div>
                        </div>
                        <Button asChild size="sm">
                           <Link href={paper.pdfUrl || '#'} target="_blank" rel="noopener noreferrer" >
                                <Download className="mr-2 h-4 w-4" /> Download
                           </Link>
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <BookOpen className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-semibold">No Papers Available</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Question papers for the selected exam will be available soon.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
