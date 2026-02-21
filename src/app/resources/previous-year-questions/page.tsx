'use client';

import { useState, useEffect, useMemo, Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText, Search, ArrowRight, HelpCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { getPreviousYearQuestions, getSignedUrlForPdf } from '@/app/actions';
import type { TPreviousYearQuestion, SubjectWithPapers, Paper } from '@/app/actions/types';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

function PreviousYearQuestionsContent() {
    const [questions, setQuestions] = useState<TPreviousYearQuestion[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
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
                if (initialClasses.length > 0) {
                    setSelectedClass(initialClasses[0]);
                }
            }
            setLoading(false);
        };
        fetchQuestions();
    }, []);

    const classes = useMemo(() => {
        if (questions.length === 0) return [];
        const uniqueClasses = Array.from(new Set(questions.map(q => q.exam))).sort();
        return uniqueClasses;
    }, [questions]);

    const subjects = useMemo(() => {
        const subjectsForClass = questions
            .filter(q => selectedClass === '' || q.exam === selectedClass)
            .flatMap(q => Array.isArray(q.subjects) ? q.subjects.map(s => s.name) : []);
        return ['All', ...Array.from(new Set(subjectsForClass))].sort();
    }, [questions, selectedClass]);

    const years = useMemo(() => {
        if (questions.length === 0 || !selectedClass) return [];
        const yearsForClass = questions
            .filter(q => q.exam === selectedClass)
            .map(q => q.year.toString());
        const uniqueYears = Array.from(new Set(yearsForClass));
        uniqueYears.sort((a, b) => parseInt(b, 10) - parseInt(a, 10));
        return ['All', ...uniqueYears];
    }, [questions, selectedClass]);

    useEffect(() => {
        setSelectedSubject('All');
        setSelectedYear('All');
    }, [selectedClass]);

    const filteredQuestions = useMemo(() => {
        return questions.filter(q => {
            const matchesClass = selectedClass === '' || q.exam === selectedClass;
            const matchesSubject = selectedSubject === 'All' || (Array.isArray(q.subjects) && q.subjects.some(s => s.name === selectedSubject));
            const matchesYear = selectedYear === 'All' || q.year.toString() === selectedYear;
            const matchesSearch = q.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                q.exam.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                (Array.isArray(q.subjects) && q.subjects.some(s => s.name.toLowerCase().includes(searchTerm.toLowerCase())));
            
            return matchesClass && matchesSubject && matchesYear && matchesSearch;
        });
    }, [questions, selectedClass, selectedSubject, selectedYear, searchTerm]);

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
            {[...Array(3)].map((_, index) => (
                <Card key={index} className="overflow-hidden">
                    <CardHeader><Skeleton className="h-6 w-1/2" /></CardHeader>
                    <CardContent className="p-6 space-y-4">
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                    </CardContent>
                </Card>
            ))}
        </div>
    );

    return (
        <div className="container mx-auto py-12 px-4 md:px-6 max-w-6xl">
            <div className="mb-12 space-y-8 animate-fade-in-up">
                {/* Premium Search Bar */}
                <div className="relative mx-auto bg-white border border-gray-300 rounded-sm flex items-center h-12 md:h-16 shadow-none transition-all focus-within:border-primary/50">
                    <div className="pl-3 md:pl-5 pr-2 md:pr-3">
                        <Search className="h-5 w-5 md:h-7 md:w-7 text-black" strokeWidth={2.5} />
                    </div>
                    <Input
                        type="text"
                        placeholder="Search Previous Year Papers (e.g. Maths 2024)..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="flex-1 border-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 text-sm md:text-lg placeholder:text-gray-400 placeholder:font-light bg-transparent h-full"
                    />
                    <Separator orientation="vertical" className="h-8 md:h-10 mx-2 hidden sm:block bg-gray-300" />
                    <Button variant="ghost" className="hidden sm:flex flex-col h-full rounded-none px-4 md:px-8 items-center justify-center gap-0.5 hover:bg-gray-50 transition-colors">
                        <ArrowRight className="h-5 w-5 md:h-6 md:w-6 text-black" strokeWidth={1.5} />
                        <span className="text-[8px] md:text-[9px] font-bold text-gray-600 uppercase tracking-tight">Search papers</span>
                    </Button>
                </div>

                {/* Minimalist Horizontal Class Filter */}
                <div className="overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    <div className="flex justify-start md:justify-center items-center gap-8 whitespace-nowrap px-4 sm:px-0">
                        {loading ? (
                            [...Array(4)].map((_, i) => <Skeleton key={i} className="h-6 w-20 rounded-md" />)
                        ) : (
                            classes.map(className => (
                                <button
                                    key={className}
                                    onClick={() => setSelectedClass(className)}
                                    className={cn(
                                        "text-[10px] md:text-xs font-black uppercase tracking-[0.2em] transition-all duration-300 pb-2 border-b-2 outline-none focus:outline-none",
                                        selectedClass === className 
                                        ? 'text-primary border-primary' 
                                        : 'text-muted-foreground/60 border-transparent hover:text-foreground hover:border-muted-foreground/20'
                                    )}
                                >
                                    {className}
                                </button>
                            ))
                        )}
                    </div>
                </div>

                {/* Secondary Filters (Subject & Year) */}
                {!loading && selectedClass && (
                    <div className="flex flex-wrap justify-center items-center gap-2 md:gap-4 px-4">
                        <div className="flex items-center gap-2">
                            <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Subject:</span>
                            <div className="flex gap-1">
                                {subjects.map(s => (
                                    <Badge
                                        key={s}
                                        onClick={() => setSelectedSubject(s)}
                                        variant={selectedSubject === s ? "default" : "outline"}
                                        className="cursor-pointer text-[9px] px-2 py-0.5 font-bold uppercase transition-all"
                                    >
                                        {s}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                        <Separator orientation="vertical" className="h-4 hidden sm:block" />
                        <div className="flex items-center gap-2">
                            <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Year:</span>
                            <div className="flex gap-1">
                                {years.map(y => (
                                    <Badge
                                        key={y}
                                        onClick={() => setSelectedYear(y)}
                                        variant={selectedYear === y ? "default" : "outline"}
                                        className="cursor-pointer text-[9px] px-2 py-0.5 font-bold uppercase transition-all"
                                    >
                                        {y}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <main className="space-y-12">
                {loading ? (
                    renderSkeleton()
                ) : Object.keys(groupedByYear).length > 0 ? (
                    Object.entries(groupedByYear)
                        .sort(([yearA], [yearB]) => parseInt(yearB) - parseInt(yearA))
                        .map(([year, questionsInYear]) => {
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
                                <section key={year} className="animate-fade-in-up">
                                    <div className="flex items-center gap-4 mb-6">
                                        <h2 className="text-xl md:text-2xl font-black text-foreground tracking-tight">{year} Examinations</h2>
                                        <Separator className="flex-1" />
                                    </div>
                                    <div className="grid gap-6">
                                        {Object.entries(groupedSubjects).map(([subjectName, papers]) => (
                                            <Card key={subjectName} className="border-none shadow-sm bg-white overflow-hidden">
                                                <CardHeader className="bg-primary/[0.03] py-3 px-6">
                                                    <CardTitle className="text-sm font-black text-primary uppercase tracking-widest">{subjectName}</CardTitle>
                                                </CardHeader>
                                                <CardContent className="p-4 md:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                                    {papers.map((paper, pIdx) => (
                                                        <div key={pIdx} className="group p-4 border rounded-xl hover:border-primary/30 hover:bg-primary/[0.01] transition-all flex flex-col justify-between gap-4">
                                                            <div className="flex items-start gap-3">
                                                                <div className="p-2 bg-primary/5 rounded-lg text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                                                                    <FileText className="w-4 h-4" />
                                                                </div>
                                                                <span className="text-sm font-bold text-foreground leading-tight">{paper.title}</span>
                                                            </div>
                                                            <Button 
                                                                variant="outline" 
                                                                size="sm" 
                                                                className="w-full font-black text-[10px] uppercase tracking-widest rounded-lg h-9 border-muted-foreground/20"
                                                                onClick={() => handleDownload(paper.pdfUrl)} 
                                                                disabled={!paper.pdfUrl}
                                                            >
                                                                <Download className="w-3.5 h-3.5 mr-2" />
                                                                Download PDF
                                                            </Button>
                                                        </div>
                                                    ))}
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                </section>
                            );
                        })
                ) : (
                    <div className="text-center py-24 animate-fade-in-up">
                        <div className="bg-muted p-6 rounded-full w-fit mx-auto mb-6">
                            <HelpCircle className="w-12 h-12 text-muted-foreground opacity-20" />
                        </div>
                        <h3 className="text-xl font-black text-foreground uppercase tracking-tight">No Papers Found</h3>
                        <p className="text-sm text-muted-foreground font-bold mt-2">Try adjusting your search or filters.</p>
                        <Button variant="link" className="mt-4 font-black uppercase text-[10px] tracking-widest" onClick={() => {
                            setSearchTerm('');
                            setSelectedSubject('All');
                            setSelectedYear('All');
                        }}>
                            Clear all filters
                        </Button>
                    </div>
                )}
            </main>
        </div>
    );
}

export default function PreviousYearQuestionsPage() {
    return (
        <Suspense fallback={
            <div className="container mx-auto py-12 px-4 flex flex-col items-center justify-center min-h-[60vh]">
                <Skeleton className="h-16 w-full max-w-5xl rounded-sm mb-12" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
                    {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-64 w-full rounded-2xl" />)}
                </div>
            </div>
        }>
            <PreviousYearQuestionsContent />
        </Suspense>
    );
}
