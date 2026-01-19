
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
      <div className="flex gap-6 px-4 md:px-[10%]">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="block flex-shrink-0 w-[300px] sm:w-[350px]">
            <Skeleton className="h-[400px] w-full rounded-2xl" />
          </div>
        ))}
      </div>
    );

    return (
        <div className="relative min-h-screen w-full bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800 overflow-y-auto">
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
                 
                <div className="relative">
                    <div className="overflow-x-auto pb-8 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                        <div className="flex gap-6 px-4 md:px-[10%]">
                            {loading ? (
                                renderSkeleton()
                            ) : filteredQuestions.length > 0 ? (
                                filteredQuestions.map((question, index) => (
                                    <div key={question.id} className="block flex-shrink-0 w-[300px] sm:w-[350px] group">
                                      <Card className="h-full rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col bg-card animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                                          <CardContent className="p-4 flex flex-col flex-1">
                                              <div className="flex items-start gap-3">
                                                  <div className="p-2 bg-primary/10 text-primary rounded-md">
                                                      <FileText className="h-5 w-5" />
                                                  </div>
                                                  <div className="flex-1">
                                                      <h3 className="font-semibold text-base leading-tight">{question.title}</h3>
                                                      <p className="text-xs text-muted-foreground">{question.exam} - {question.year}</p>
                                                  </div>
                                              </div>
                                              <div className="mt-4 flex-grow">
                                                  <Accordion type="multiple" className="w-full space-y-2">
                                                      {(Array.isArray(question.subjects) ? question.subjects : [])
                                                          .filter(subject => selectedSubject === 'All' || subject.name === selectedSubject)
                                                          .map((subject, idx) => (
                                                          <AccordionItem value={`subject-${idx}`} key={idx} className="border bg-background/50 rounded-md px-3">
                                                              <AccordionTrigger className="py-2 text-sm font-semibold">{subject.name}</AccordionTrigger>
                                                              <AccordionContent className="pb-2">
                                                                  <div className="flex flex-col gap-2 pt-2 border-t">
                                                                      {Array.isArray(subject.papers) && subject.papers.map((paper, pIdx) => (
                                                                          <Button key={pIdx} className="w-full justify-between" variant="ghost" onClick={() => handleDownload(paper.pdfUrl)} disabled={!paper.pdfUrl}>
                                                                              <span>{paper.title}</span>
                                                                              <Download className="h-4 w-4"/>
                                                                          </Button>
                                                                      ))}
                                                                  </div>
                                                              </AccordionContent>
                                                          </AccordionItem>
                                                      ))}
                                                  </Accordion>
                                              </div>
                                          </CardContent>
                                      </Card>
                                    </div>
                                ))
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
            </div>
        </div>
    );
}
