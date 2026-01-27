
'use client';

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { getPreviousYearQuestions, getSignedUrlForPdf } from '@/app/actions';
import type { TPreviousYearQuestion } from '@/app/actions/types';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export default function PreviousYearQuestionsPage() {
    const [questions, setQuestions] = useState<TPreviousYearQuestion[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedClass, setSelectedClass] = useState<string>('');
    const [selectedSubject, setSelectedSubject] = useState<string>('All');
    const { toast } = useToast();

    useEffect(() => {
        const fetchQuestions = async () => {
            setLoading(true);
            const result = await getPreviousYearQuestions();
            if (result.success && result.data) {
                const fetchedQuestions = result.data as TPreviousYearQuestion[];
                setQuestions(fetchedQuestions);
                 const initialClasses = Array.from(new Set(fetchedQuestions.map(q => q.exam))).sort();
                if(initialClasses.length > 0) {
                    setSelectedClass(initialClasses[0]);
                }
            }
            setLoading(false);
        };
        fetchQuestions();
    }, []);

    const classes = useMemo(() => {
        if (questions.length === 0) return [];
        return [...Array.from(new Set(questions.map(q => q.exam)))].sort();
    }, [questions]);

    const subjects = useMemo(() => {
        const subjectsForClass = questions
            .filter(q => selectedClass === '' || q.exam === selectedClass)
            .flatMap(q => Array.isArray(q.subjects) ? q.subjects.map(s => s.name) : []);
        return ['All', ...Array.from(new Set(subjectsForClass))].sort();
    }, [questions, selectedClass]);
    
    useEffect(() => {
      setSelectedSubject('All');
    }, [selectedClass]);

    const filteredQuestions = useMemo(() => {
        return questions.filter(q => 
            (selectedClass === '' || q.exam === selectedClass) &&
            (selectedSubject === 'All' || (Array.isArray(q.subjects) && q.subjects.some(s => s.name === selectedSubject)))
        );
    }, [questions, selectedClass, selectedSubject]);

    const groupedByYear = useMemo(() => {
        return filteredQuestions.reduce((acc, q) => {
            const year = q.year.toString();
            if (!acc[year]) {
                acc[year] = [];
            }
            acc[year].push(q);
            return acc;
        }, {} as Record<string, TPreviousYearQuestion[]>);
    }, [filteredQuestions]);

    const handleDownload = async (pdfUrl: string | undefined) => {
        if (!pdfUrl) {
            toast({ variant: "destructive", title: "Error", description: "No PDF file available for download." });
            return;
        }
        const result = await getSignedUrlForPdf(pdfUrl);
        if (result.success && result.url) {
            window.open(result.url, '_blank');
        } else {
            toast({ variant: "destructive", title: "Error", description: result.message });
        }
    };
    
    const renderSkeleton = () => (
      <div className="space-y-4">
        {[...Array(3)].map((_, index) => (
          <Skeleton key={index} className="h-16 w-full rounded-lg" />
        ))}
      </div>
    );

    return (
        <div className="relative min-h-screen w-full bg-white dark:bg-background overflow-y-auto">
            <div className="relative z-10 container mx-auto py-12">
                <div className="text-center mb-12 animate-fade-in-up">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-primary tracking-tight">Previous Year Question Papers</h1>
                    <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                        Practice with past exam papers to ace your upcoming exams.
                    </p>
                </div>

                <div className="flex flex-col items-center space-y-4 mb-8">
                    <div className="overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden w-full">
                        <div className="flex justify-start md:justify-center gap-2 whitespace-nowrap px-4 sm:px-0">
                            {classes.map(c => (
                                <button
                                    key={c}
                                    onClick={() => setSelectedClass(c)}
                                    className={cn(`py-2 px-6 text-sm font-medium transition-colors border rounded-full`,
                                        selectedClass === c
                                        ? 'border-primary text-primary bg-primary/10 shadow'
                                        : 'border-border text-muted-foreground hover:text-foreground hover:bg-muted/50'
                                    )}
                                >
                                    {c}
                                </button>
                            ))}
                        </div>
                    </div>
                   <div className="overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden w-full">
                        <div className="flex justify-start md:justify-center gap-2 whitespace-nowrap px-4 sm:px-0">
                            {subjects.map(s => (
                                <button
                                    key={s}
                                    onClick={() => setSelectedSubject(s)}
                                    className={cn(`py-1 px-4 text-xs font-medium transition-colors border rounded-full`,
                                        selectedSubject === s
                                        ? 'border-primary text-primary bg-primary/10' 
                                        : 'border-border text-muted-foreground hover:text-foreground hover:bg-muted'
                                    )}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
                 
                <div className="max-w-4xl mx-auto">
                    {loading ? (
                        renderSkeleton()
                    ) : Object.keys(groupedByYear).length > 0 ? (
                         <Accordion type="multiple" className="w-full space-y-4">
                           {Object.entries(groupedByYear).sort(([yearA], [yearB]) => parseInt(yearB) - parseInt(yearA)).map(([year, questionsInYear]) => (
                                <AccordionItem value={year} key={year} className="border-b-0">
                                    <Card className="rounded-xl shadow-md bg-muted/30">
                                        <AccordionTrigger className="p-4 font-bold text-lg text-primary hover:no-underline">
                                            {questionsInYear[0]?.title || `${selectedClass} - ${year}`}
                                        </AccordionTrigger>
                                        <AccordionContent className="p-4 pt-0">
                                            <div className="space-y-3">
                                            {questionsInYear.flatMap(q => 
                                                (Array.isArray(q.subjects) ? q.subjects : [])
                                                .filter(subject => selectedSubject === 'All' || subject.name === subject)
                                                .map(subject => (
                                                    <Card key={subject.name} className="bg-background">
                                                        <CardContent className="p-3">
                                                            <h4 className="font-semibold mb-2">{subject.name}</h4>
                                                            <div className="flex flex-col gap-2">
                                                                {(Array.isArray(subject.papers) ? subject.papers : []).map((paper, pIdx) => (
                                                                    <Button key={pIdx} className="w-full justify-between" variant="ghost" onClick={() => handleDownload(paper.pdfUrl)} disabled={!paper.pdfUrl}>
                                                                        <span>{paper.title}</span>
                                                                        <Download className="h-4 w-4"/>
                                                                    </Button>
                                                                ))}
                                                            </div>
                                                        </CardContent>
                                                    </Card>
                                                ))
                                            )}
                                            </div>
                                        </AccordionContent>
                                    </Card>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    ) : (
                        <div className="col-span-full text-center py-16 w-full">
                            <Card className="inline-block p-8 bg-background/50">
                                <FileText className="mx-auto h-16 w-16 text-muted-foreground" />
                                <h3 className="mt-4 text-lg font-semibold">No Papers Available</h3>
                                <p className="mt-2 text-sm text-muted-foreground">
                                    Question papers for the selected filters will be available soon.
                                </p>
                            </Card>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
