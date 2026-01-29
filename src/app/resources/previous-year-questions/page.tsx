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
import { Label } from '@/components/ui/label';

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
      <div className="space-y-6">
        {[...Array(2)].map((_, index) => (
          <Card key={index} className="overflow-hidden">
            <CardHeader><Skeleton className="h-6 w-1/2" /></CardHeader>
            <CardContent className="p-6 space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
            </CardContent>
          </Card>
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
                            <Card key={year} className="overflow-hidden shadow-lg border-primary/10 bg-gradient-to-br from-card to-muted/20">
                                <CardHeader className="bg-primary/5">
                                    <CardTitle className="text-xl text-primary">{questionsInYear[0]?.title || `${selectedClass} - ${year}`}</CardTitle>
                                </CardHeader>
                                <CardContent className="p-4 md:p-6 space-y-4">
                                    {Object.entries(groupedSubjects).map(([subjectName, papers]) => (
                                        <div key={subjectName}>
                                            <h3 className="font-semibold text-lg mb-2 border-b pb-1">{subjectName}</h3>
                                            <div className="space-y-2">
                                                {papers.map((paper, pIdx) => (
                                                    <div key={pIdx} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 border transition-all">
                                                        <span className="text-sm font-medium flex items-center gap-2">
                                                            <FileText className="w-4 h-4 text-primary/80" />
                                                            {paper.title}
                                                        </span>
                                                        <Button variant="outline" size="sm" onClick={() => handleDownload(paper.pdfUrl)} disabled={!paper.pdfUrl}>
                                                            <Download className="h-4 w-4 mr-2"/>
                                                            Download
                                                        </Button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            );
        }
        return (
            <div className="col-span-full text-center py-16 w-full">
                <Card className="inline-block p-8 bg-background/50 shadow-lg border-dashed">
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
                    <h1 className="text-2xl md:text-3xl font-extrabold text-primary tracking-tight group inline-block">
                        Previous Year Question Papers
                        <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-primary mx-auto"></span>
                    </h1>
                    <p className="mt-2 text-sm text-muted-foreground font-semibold">
                        Practice with past exam papers to ace your upcoming exams.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    <aside className="lg:col-span-1">
                        <Card className="sticky top-20 bg-muted/20 border-border shadow-sm">
                            <CardHeader>
                                <CardTitle>Filters</CardTitle>
                                <CardDescription>Select class, subject, and year</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-3">
                                    <Label className="font-semibold text-foreground">Class</Label>
                                    <div className="flex flex-wrap gap-2">
                                        {loading ? (
                                            [...Array(4)].map((_, i) => <Skeleton key={i} className="h-9 w-20 rounded-md" />)
                                        ) : (
                                            classes.map(c => (
                                                <Button
                                                    key={c}
                                                    onClick={() => setSelectedClass(c)}
                                                    variant={selectedClass === c ? 'default' : 'ghost'}
                                                    size="sm"
                                                    className="rounded-md"
                                                >
                                                    {c}
                                                </Button>
                                            ))
                                        )}
                                    </div>
                                </div>
                                {selectedClass && (
                                    <div className="space-y-3">
                                        <Label className="font-semibold text-foreground">Subject</Label>
                                        <div className="flex flex-wrap gap-2">
                                            {loading ? (
                                                [...Array(4)].map((_, i) => <Skeleton key={i} className="h-9 w-20 rounded-md" />)
                                            ) : (
                                                subjects.map(s => (
                                                    <Button
                                                        key={s}
                                                        onClick={() => setSelectedSubject(s)}
                                                        variant={selectedSubject === s ? 'default' : 'ghost'}
                                                        size="sm"
                                                        className="rounded-md"
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
                                        <Label className="font-semibold text-foreground">Year</Label>
                                        <div className="flex flex-wrap gap-2">
                                            {loading ? (
                                                [...Array(4)].map((_, i) => <Skeleton key={i} className="h-9 w-20 rounded-md" />)
                                            ) : (
                                                years.map(y => (
                                                    <Button
                                                        key={y}
                                                        onClick={() => setSelectedYear(y)}
                                                        variant={selectedYear === y ? 'default' : 'ghost'}
                                                        size="sm"
                                                        className="rounded-md"
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
                    <main className="lg:col-span-3">
                       {renderContent()}
                    </main>
                </div>
            </div>
        </div>
    );
}
