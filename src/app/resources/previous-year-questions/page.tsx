
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Download, BookOpen, Sigma, TestTube2, Landmark, Atom, Dna, BookText, Globe, Scale, TrendingUp, FlaskConical, HelpCircle } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { getPreviousYearQuestions } from '@/app/actions';
import type { TPreviousYearQuestion } from '@/app/actions/types';
import { Skeleton } from '@/components/ui/skeleton';
import { GcsImage } from '@/components/gcs-image';
import Image from 'next/image';

const subjectIcons: { [key: string]: React.ReactNode } = {
  'science': <TestTube2 className="w-8 h-8 text-blue-600 dark:text-blue-400" />,
  'maths (standard)': <Sigma className="w-8 h-8 text-green-600 dark:text-green-400" />,
  'maths (basic)': <Sigma className="w-8 h-8 text-green-600 dark:text-green-400" />,
  'maths': <Sigma className="w-8 h-8 text-green-600 dark:text-green-400" />,
  'social studies': <Landmark className="w-8 h-8 text-amber-600 dark:text-amber-400" />,
  'english': <BookText className="w-8 h-8 text-purple-600 dark:text-purple-400" />,
  'physics': <Atom className="w-8 h-8 text-sky-600 dark:text-sky-400" />,
  'chemistry': <FlaskConical className="w-8 h-8 text-purple-600 dark:text-purple-400" />,
  'biology': <Dna className="w-8 h-8 text-lime-600 dark:text-lime-400" />,
  'general test': <BookOpen className="w-8 h-8 text-gray-600 dark:text-gray-400" />,
  default: <FileText className="w-8 h-8 text-gray-600 dark:text-gray-400" />,
};

const getIcon = (subject: string) => subjectIcons[subject.toLowerCase()] || subjectIcons.default;


export default function PreviousYearQuestionsPage() {
  const [papers, setPapers] = useState<TPreviousYearQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedExam, setSelectedExam] = useState('');
  const [animationKey, setAnimationKey] = useState(0);

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

  const handleExamChange = (exam: string) => {
    setSelectedExam(exam);
    setAnimationKey(prev => prev + 1);
  };

  const renderSkeleton = () => (
    <div className="overflow-x-auto pb-8 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex gap-6 px-4 md:px-[10%]">
            {[...Array(4)].map((_, i) => (
                <div key={i} className="block flex-shrink-0 w-[300px] sm:w-[350px]">
                    <Skeleton className="h-64 w-full rounded-lg" />
                </div>
            ))}
        </div>
    </div>
  );

  return (
    <div className="bg-gray-100 dark:bg-gray-800 py-12">
      <div className="mb-8 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">Previous Year Question Papers</h1>
        <p className="text-muted-foreground">
          Practice with past exam papers for {selectedExam} to familiarize yourself with the format and question types.
        </p>
      </div>
      
      {loading ? (
        <div className="flex justify-center gap-2 mb-8">
            {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-9 w-24 rounded-full" />)}
        </div>
      ) : (
        <div className="mb-8">
            <div className="overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div className="flex justify-start md:justify-center items-center gap-2 whitespace-nowrap px-4 sm:px-0">
                {examCategories.map((examName) => (
                    <button
                    key={examName}
                    onClick={() => handleExamChange(examName)}
                    className={`py-2 px-4 whitespace-nowrap text-sm font-medium transition-colors border rounded-full
                        ${selectedExam === examName 
                        ? 'border-primary text-primary bg-primary/10 shadow-md' 
                        : 'border-border text-muted-foreground hover:text-foreground hover:bg-muted/50'}`}
                    >
                    {examName}
                    </button>
                ))}
            </div>
            </div>
        </div>
      )}

      <main className="flex-1">
          <div key={animationKey} className="relative animate-fade-in-up">
              {loading ? renderSkeleton() : filteredPapers.length > 0 ? (
                  <div className="overflow-x-auto pb-8 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                      <div className="flex gap-6 px-4 md:px-[10%]">
                          {filteredPapers.map((paper, index) => (
                              <div key={paper.id} className="block flex-shrink-0 w-[300px] sm:w-[320px] group">
                                  <Card className="h-full rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col bg-card bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-800/30">
                                      <CardContent className="p-6 flex-grow flex flex-col items-start">
                                          <div className="p-3 bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl mb-4">
                                            {getIcon(paper.subject)}
                                          </div>
                                          <p className="text-xs font-semibold uppercase tracking-wider text-primary">{paper.subject}</p>
                                          <h3 className="text-lg font-bold text-foreground mt-1 flex-grow">{paper.title} - {paper.year}</h3>
                                          <Button asChild className="w-full mt-4">
                                              <Link href={paper.pdfUrl || '#'} target="_blank" rel="noopener noreferrer" >
                                                  <Download className="mr-2 h-4 w-4" /> Download PDF
                                              </Link>
                                          </Button>
                                      </CardContent>
                                  </Card>
                              </div>
                          ))}
                      </div>
                  </div>
              ) : (
                  <div className="col-span-full text-center py-12">
                       <Card className="p-8 inline-block bg-background">
                            <BookOpen className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                            <p className="text-muted-foreground font-semibold">No papers found for this exam.</p>
                            <p className="text-sm text-muted-foreground">Please select another category.</p>
                       </Card>
                  </div>
              )}
          </div>
      </main>
    </div>
  );
}
