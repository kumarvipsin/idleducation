'use client';

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { getPreviousYearQuestions, getSignedUrlForPdf } from '@/app/actions';
import type { TPreviousYearQuestion, SubjectWithPapers, Paper } from '@/app/actions/types';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export default function PreviousYearQuestionsPage() {
    const [questions, setQuestions] = useState<TPreviousYearQuestion[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedClass, setSelectedClass] = useState<string>('');
    const [selectedSubject, setSelectedSubject] = useState<string>('All');
    const [selectedYear, setSelectedYear] = useState<string>('All');
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
    
    const years = useMemo(() => {
        if (questions.length === 0 || !selectedClass) return [];
        const yearsForClass = questions
            .filter(q => q.exam === selectedClass)
            .map(q => q.year.toString());
        const uniqueYears = Array.from(new Set(yearsForClass));
        uniqueYears.sort((a, b) => parseInt(b, 10) - parseInt(a, 10));
        return ['All', ...uniqueYears];
    }, [questions, selectedClass]);


    const subjects = useMemo(() => {
        const subjectsForClass = questions
            .filter(q => selectedClass === '' || q.exam === selectedClass)
            .flatMap(q => Array.isArray(q.subjects) ? q.subjects.map(s => s.name) : []);
        return ['All', ...Array.from(new Set(subjectsForClass))].sort();
    }, [questions, selectedClass]);
    
    useEffect(() => {
      setSelectedSubject('All');
      setSelectedYear('All');
    }, [selectedClass]);

    const filteredQuestions = useMemo(() => {
        return questions.filter(q => 
            (selectedClass === '' || q.exam === selectedClass) &&
            (selectedSubject === 'All' || (Array.isArray(q.subjects) && q.subjects.some(s => s.name === selectedSubject))) &&
            (selectedYear === 'All' || q.year.toString() === selectedYear)
        );
    }, [questions, selectedClass, selectedSubject, selectedYear]);

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
          <Skeleton key={index} className="h-48 w-full rounded-lg" />
        ))}
      </div>
    );
    
    const renderContent = () => {
        if (loading) {
            return renderSkeleton();
        }
        if (Object.keys(groupedByYear).length > 0) {
            return (
                <div className="space-y-6">
                    {Object.entries(groupedByYear).sort(([yearA], [yearB]) => parseInt(yearB) - parseInt(yearA)).map(([year, questionsInYear]) => {
                        
                        const subjectsForYear = questionsInYear.flatMap(q => 
                            (Array.isArray(q.subjects) ? q.subjects : [])
                            .filter(subject => selectedSubject === 'All' || subject.name === selectedSubject)
                        );

                        const groupedSubjects = subjectsForYear.reduce((acc, subject) => {
                            if (!acc[subject.name]) {
                                acc[subject.name] = [];
                            }
                            acc[subject.name].push(...(subject.papers || []));
                            return acc;
                        }, {} as Record<string, Paper[]>);

                        return (
                            <Card key={year} className="overflow-hidden shadow-md">
                                <CardHeader className="bg-muted/30">
                                    <CardTitle>{questionsInYear[0]?.title || `${selectedClass} - ${year}`}</CardTitle>
                                </CardHeader>
                                <CardContent className="p-0">
                                    <Accordion type="multiple" className="w-full">
                                        {Object.entries(groupedSubjects).map(([subjectName, papers]) => (
                                            <AccordionItem value={subjectName} key={subjectName}>
                                                <AccordionTrigger className="px-6 font-semibold text-base hover:no-underline">{subjectName}</AccordionTrigger>
                                                <AccordionContent className="pt-2 px-6 pb-4">
                                                    <div className="space-y-2">
                                                        {papers.map((paper, pIdx) => (
                                                            <div key={pIdx} className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50 border">
                                                                <span className="text-sm font-medium flex items-center gap-2">
                                                                    <FileText className="w-4 h-4 text-primary" />
                                                                    {paper.title}
                                                                </span>
                                                                <Button variant="outline" size="sm" onClick={() => handleDownload(paper.pdfUrl)} disabled={!paper.pdfUrl}>
                                                                    <Download className="h-4 w-4 mr-2"/>
                                                                    Download
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
                        );
                    })}
                </div>
            );
        }
        return (
            <div className="col-span-full text-center py-16 w-full">
                <Card className="inline-block p-8 bg-background/50">
                    <FileText className="mx-auto h-16 w-16 text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-semibold">No Papers Available</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Question papers for the selected filters will be available soon.
                    </p>
                </Card>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen w-full bg-white dark:bg-background">
            <div className="container mx-auto py-12 px-4 md:px-6">
                <div className="text-center mb-12 animate-fade-in-up">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-primary tracking-tight">Previous Year Question Papers</h1>
                    <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                        Practice with past exam papers to ace your upcoming exams.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Filters Sidebar */}
                    <aside className="lg:col-span-1">
                        <Card className="sticky top-20 bg-muted/20 border-border shadow-sm">
                            <CardHeader>
                                <CardTitle>Filters</CardTitle>
                                <CardDescription>Select class and subject</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-3">
                                    <h4 className="font-semibold text-foreground">Class</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {loading ? (
                                            [...Array(4)].map((_, i) => <Skeleton key={i} className="h-9 w-20 rounded-full" />)
                                        ) : (
                                            classes.map(c => (
                                                <Button
                                                    key={c}
                                                    onClick={() => setSelectedClass(c)}
                                                    variant={selectedClass === c ? 'default' : 'outline'}
                                                    size="sm"
                                                    className="rounded-full"
                                                >
                                                    {c}
                                                </Button>
                                            ))
                                        )}
                                    </div>
                                </div>
                                {selectedClass && (
                                    <div className="space-y-3">
                                        <h4 className="font-semibold text-foreground">Subject</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {loading ? (
                                                [...Array(4)].map((_, i) => <Skeleton key={i} className="h-9 w-20 rounded-full" />)
                                            ) : (
                                                subjects.map(s => (
                                                    <Button
                                                        key={s}
                                                        onClick={() => setSelectedSubject(s)}
                                                        variant={selectedSubject === s ? 'default' : 'outline'}
                                                        size="sm"
                                                        className="rounded-full"
                                                    >
                                                        {s}
                                                    </Button>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                )}
                                {selectedClass && (
                                    <div className="space-y-3">
                                        <h4 className="font-semibold text-foreground">Year</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {loading ? (
                                                [...Array(4)].map((_, i) => <Skeleton key={i} className="h-9 w-20 rounded-full" />)
                                            ) : (
                                                years.map(y => (
                                                    <Button
                                                        key={y}
                                                        onClick={() => setSelectedYear(y)}
                                                        variant={selectedYear === y ? 'default' : 'outline'}
                                                        size="sm"
                                                        className="rounded-full"
                                                    >
                                                        {y}
                                                    </Button>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </aside>

                    {/* Main Content */}
                    <main className="lg:col-span-3">
                       {renderContent()}
                    </main>
                </div>
            </div>
        </div>
    );
}
