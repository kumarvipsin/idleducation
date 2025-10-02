
'use client';

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Home, Download, FileText } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { getPreviousYearQuestions, getSignedUrlForPdf } from '@/app/actions';
import type { TPreviousYearQuestion } from '@/app/actions/types';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';

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
                if (fetchedQuestions.length > 0) {
                    const classes = Array.from(new Set(fetchedQuestions.map(q => q.exam))).sort();
                    if (classes.length > 0) {
                        const defaultClass = classes.find(c => c.includes('10')) || classes[0];
                        setSelectedClass(defaultClass);
                    }
                }
            }
            setLoading(false);
        };
        fetchQuestions();
    }, []);

    const classes = useMemo(() => {
        if (questions.length === 0) return [];
        return Array.from(new Set(questions.map(q => q.exam))).sort();
    }, [questions]);

    const subjects = useMemo(() => {
        if (!selectedClass) return [];
        const subjectsForClass = questions
            .filter(q => q.exam === selectedClass)
            .flatMap(q => Array.isArray(q.subjects) ? q.subjects.map(s => s.name) : []);
        return ['All', ...Array.from(new Set(subjectsForClass))].sort();
    }, [questions, selectedClass]);
    
    useEffect(() => {
      setSelectedSubject('All');
    }, [selectedClass]);

    const filteredQuestions = useMemo(() => {
        return questions.filter(q => 
            q.exam === selectedClass &&
            (selectedSubject === 'All' || q.subjects.some(s => s.name === selectedSubject))
        );
    }, [questions, selectedClass, selectedSubject]);

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

    return (
        <div className="relative min-h-screen w-full p-4 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800 overflow-y-auto">
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
                        Practice with past exam papers to ace your upcoming exams.
                    </p>
                </div>

                <div className="flex flex-col items-center space-y-4 mb-8">
                    <div className="flex justify-center gap-2 flex-wrap">
                        {loading ? (
                            [...Array(2)].map((_, i) => <Skeleton key={i} className="h-9 w-24 rounded-full" />)
                        ) : (
                            classes.map(exam => (
                                <button
                                    key={exam}
                                    onClick={() => setSelectedClass(exam)}
                                    className={cn(`py-2 px-6 text-sm font-medium transition-colors border rounded-full`,
                                        selectedClass === exam
                                        ? 'border-primary text-primary bg-primary/10 shadow'
                                        : 'border-border text-muted-foreground hover:text-foreground hover:bg-muted/50'
                                    )}
                                >
                                    {exam}
                                </button>
                            ))
                        )}
                    </div>
                    {subjects.length > 1 && (
                      <div className="flex justify-center gap-2 flex-wrap">
                          {subjects.map(subject => (
                              <button
                                  key={subject}
                                  onClick={() => setSelectedSubject(subject)}
                                  className={cn(`py-1 px-4 text-xs font-medium transition-colors border rounded-full`,
                                      selectedSubject === subject
                                      ? 'border-primary text-primary bg-primary/5' 
                                      : 'border-border text-muted-foreground hover:text-foreground hover:bg-muted/50'
                                  )}
                              >
                                  {subject}
                              </button>
                          ))}
                      </div>
                    )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {loading ? (
                        [...Array(6)].map((_, index) => (
                            <Card key={index} className="overflow-hidden">
                                <CardContent className="p-4 space-y-3">
                                    <Skeleton className="h-8 w-3/4" />
                                    <Skeleton className="h-4 w-1/2" />
                                    <Skeleton className="h-10 w-full" />
                                </CardContent>
                            </Card>
                        ))
                    ) : filteredQuestions.length > 0 ? (
                        filteredQuestions.map((question, index) => (
                            <Card key={question.id} className="overflow-hidden shadow-sm hover:shadow-lg transition-shadow animate-fade-in-up" style={{ animationDelay: `${index * 50}ms` }}>
                                <CardContent className="p-4 flex flex-col h-full">
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 bg-primary/10 text-primary rounded-md">
                                            <FileText className="h-5 w-5" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-base leading-tight">{question.title}</h3>
                                            <p className="text-xs text-muted-foreground">{question.exam} - {question.year}</p>
                                        </div>
                                    </div>
                                    <div className="mt-4 flex-grow flex flex-col gap-2">
                                        {(Array.isArray(question.subjects) ? question.subjects : [])
                                            .filter(subject => selectedSubject === 'All' || subject.name === selectedSubject)
                                            .map((subject, idx) => (
                                           <Button key={idx} className="w-full justify-between" onClick={() => handleDownload(subject.pdfUrl)} disabled={!subject.pdfUrl}>
                                                <span>{subject.name}</span>
                                                <Download className="h-4 w-4"/>
                                            </Button>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-16">
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
