
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Download, BookOpen, Sigma, TestTube2, Landmark, Atom, Dna, BookText, Globe, Scale, TrendingUp, FlaskConical } from 'lucide-react';
import Link from 'next/link';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { cn } from '@/lib/utils';
import { getPreviousYearQuestions } from '@/app/actions';
import type { TPreviousYearQuestion } from '@/app/actions/types';
import { Skeleton } from '@/components/ui/skeleton';

type GroupedPapers = {
  [exam: string]: {
    [subject: string]: {
      [year: number]: TPreviousYearQuestion[];
    };
  };
};

const subjectIcons: { [key: string]: React.ReactNode } = {
  'Science': <TestTube2 className="w-5 h-5 mr-3 shrink-0" />,
  'Maths (Standard)': <Sigma className="w-5 h-5 mr-3 shrink-0" />,
  'Maths (Basic)': <Sigma className="w-5 h-5 mr-3 shrink-0" />,
  'Maths': <Sigma className="w-5 h-5 mr-3 shrink-0" />,
  'Social Studies': <Landmark className="w-5 h-5 mr-3 shrink-0" />,
  'English': <BookText className="w-5 h-5 mr-3 shrink-0" />,
  'Physics': <Atom className="w-5 h-5 mr-3 shrink-0" />,
  'Chemistry': <FlaskConical className="w-5 h-5 mr-3 shrink-0" />,
  'Biology': <Dna className="w-5 h-5 mr-3 shrink-0" />,
  'General Test': <BookOpen className="w-5 h-5 mr-3 shrink-0" />,
};

export default function PreviousYearQuestionsPage() {
  const [papers, setPapers] = useState<TPreviousYearQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedExam, setSelectedExam] = useState('CBSE Class 10');
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [animationKey, setAnimationKey] = useState(0);

  useEffect(() => {
    const fetchPapers = async () => {
      setLoading(true);
      const result = await getPreviousYearQuestions();
      if (result.success && result.data) {
        setPapers(result.data as TPreviousYearQuestion[]);
        // Auto-select first subject if available for the default exam
        const defaultSubjects = Array.from(new Set(result.data.filter((p: TPreviousYearQuestion) => p.exam === 'CBSE Class 10').map((p: TPreviousYearQuestion) => p.subject))).sort();
        if(defaultSubjects.length > 0) {
            setSelectedSubject(defaultSubjects[0]);
        }
      }
      setLoading(false);
    };
    fetchPapers();
  }, []);

  const examCategories = Array.from(new Set(papers.map(p => p.exam))).sort();
  const subjects = Array.from(new Set(papers.filter(p => p.exam === selectedExam).map(p => p.subject))).sort();
  
  const papersGroupedByYear = papers
    .filter(p => p.exam === selectedExam && p.subject === selectedSubject)
    .reduce((acc, paper) => {
        const { year } = paper;
        if (!acc[year]) {
            acc[year] = [];
        }
        acc[year].push(paper);
        acc[year].sort((a, b) => a.title.localeCompare(b.title));
        return acc;
    }, {} as { [year: number]: TPreviousYearQuestion[] });

  const sortedYears = Object.keys(papersGroupedByYear).map(Number).sort((a, b) => b - a);

  const handleExamChange = (exam: string) => {
    setSelectedExam(exam);
    const firstSubject = Array.from(new Set(papers.filter(p => p.exam === exam).map(p => p.subject))).sort()[0] || '';
    setSelectedSubject(firstSubject);
    setAnimationKey(prev => prev + 1);
  };
  
  const handleSubjectChange = (subject: string) => {
    setSelectedSubject(subject);
    setAnimationKey(prev => prev + 1);
  };

  const renderSkeleton = () => (
    <div className="space-y-4">
        <div className="flex justify-center gap-2">
            {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-9 w-24 rounded-md" />)}
        </div>
        <Skeleton className="h-80 w-full rounded-lg"/>
    </div>
  );

  return (
    <div>
      <div className="mb-6 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">Previous Year Question Papers</h1>
        <p className="text-muted-foreground">Practice with past exam papers for {selectedExam} to familiarize yourself with the format and question types.</p>
      </div>
      
      {loading ? renderSkeleton() : (
        <>
            <div className="mb-4">
                <div className="overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                <div className="flex justify-start md:justify-center items-center gap-2 whitespace-nowrap px-4 sm:px-0">
                    {examCategories.map((examName) => (
                        <button
                        key={examName}
                        onClick={() => handleExamChange(examName)}
                        className={`py-2 px-4 whitespace-nowrap text-sm font-medium transition-colors border
                            ${selectedExam === examName 
                            ? 'border-primary text-primary bg-primary/10 rounded-md' 
                            : 'border-border text-muted-foreground hover:text-foreground hover:bg-muted rounded-md'}`}
                        >
                        {examName}
                        </button>
                    ))}
                </div>
                </div>
            </div>
            
            {subjects.length > 0 && (
                <div className="mb-8">
                    <div className="overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                        <div className="flex justify-start md:justify-center items-center gap-2 whitespace-nowrap px-4 sm:px-0">
                            {subjects.map((subject) => (
                                <button
                                key={subject}
                                onClick={() => handleSubjectChange(subject)}
                                className={`py-1 px-3 whitespace-nowrap text-sm font-medium transition-colors border
                                    ${selectedSubject === subject 
                                    ? 'border-primary text-primary bg-primary/10 rounded-full' 
                                    : 'border-border text-muted-foreground hover:text-foreground hover:bg-muted rounded-full'}`}
                                >
                                {subject}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}


            <main className="flex-1">
                <div className="flex-1" key={animationKey}>
                    {selectedSubject && sortedYears.length > 0 ? (
                        <Card className="shadow-lg animate-fade-in-up bg-background">
                            <CardHeader className="p-4 border-b border-primary/10">
                                <CardTitle className="text-lg font-semibold text-primary flex items-center gap-2">
                                    {subjectIcons[selectedSubject]}
                                    {`Available Papers for ${selectedSubject}`}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-4">
                                <Accordion type="multiple" defaultValue={sortedYears.slice(0, 1).map(String)} className="w-full">
                                {sortedYears.map(year => (
                                        <AccordionItem value={String(year)} key={year}>
                                            <AccordionTrigger className="text-lg font-semibold">
                                                Year {year}
                                            </AccordionTrigger>
                                            <AccordionContent>
                                                <div className="divide-y">
                                                    {papersGroupedByYear[year].map((paper) => (
                                                        <div key={paper.id} className="flex items-center justify-between py-3">
                                                            <div>
                                                                <p className="font-medium">{paper.title}</p>
                                                            </div>
                                                            <Button asChild size="sm">
                                                                <Link href={paper.pdfUrl} target="_blank" rel="noopener noreferrer">
                                                                    <Download className="mr-2 h-4 w-4" />
                                                                    Download
                                                                </Link>
                                                            </Button>
                                                        </div>
                                                    ))}
                                                </div>
                                            </AccordionContent>
                                        </AccordionItem>
                                ))}
                                </Accordion>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="col-span-full text-center py-12 animate-fade-in-up">
                            <Card className="p-8 inline-block">
                                <BookOpen className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                                <p className="text-muted-foreground font-semibold">Select a subject</p>
                                <p className="text-sm text-muted-foreground">Choose a subject to see available papers.</p>
                            </Card>
                        </div>
                    )}
                </div>
            </main>
        </>
      )}
    </div>
  );
}
