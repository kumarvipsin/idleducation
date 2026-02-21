'use client';

import { useState, useEffect, useMemo, Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
    Download, 
    FileText, 
    Search, 
    ArrowRight, 
    HelpCircle, 
    X, 
    Folder, 
    Plus, 
    Minus,
    Sigma,
    TestTube2,
    Atom,
    FlaskConical,
    Dna,
    BookText,
    Landmark,
    Globe,
    TrendingUp,
    Users
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getPreviousYearQuestions, getSignedUrlForPdf } from '@/app/actions';
import type { TPreviousYearQuestion, SubjectWithPapers, Paper } from '@/app/actions/types';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Badge } from "@/components/ui/badge";

const SubjectIcon = ({ name, className }: { name: string, className?: string }) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('math')) return <Sigma className={className} />;
    if (lowerName.includes('science')) return <TestTube2 className={className} />;
    if (lowerName.includes('physics')) return <Atom className={className} />;
    if (lowerName.includes('chemistry')) return <FlaskConical className={className} />;
    if (lowerName.includes('biology')) return <Dna className={className} />;
    if (lowerName.includes('english')) return <BookText className={className} />;
    if (lowerName.includes('history') || lowerName.includes('social') || lowerName.includes('pol')) return <Landmark className={className} />;
    if (lowerName.includes('geography')) return <Globe className={className} />;
    if (lowerName.includes('economics')) return <TrendingUp className={className} />;
    if (lowerName.includes('sociology')) return <Users className={className} />;
    return <FileText className={className} />;
};

function PreviousYearQuestionsContent() {
    const [questions, setQuestions] = useState<TPreviousYearQuestion[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedClass, setSelectedClass] = useState<string>('');
    const [expandedSubjects, setExpandedSubjects] = useState<Set<string>>(new Set());
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
                    const defaultClass = initialClasses.find(c => c.includes('10')) || initialClasses[0];
                    setSelectedClass(defaultClass);
                }
            }
            setLoading(false);
        };
        fetchQuestions();
    }, []);

    const toggleSubject = (id: string) => {
        setExpandedSubjects(prev => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }
            return next;
        });
    };

    const classes = useMemo(() => {
        if (questions.length === 0) return [];
        const uniqueClasses = Array.from(new Set(questions.map(q => q.exam))).sort();
        return uniqueClasses;
    }, [questions]);

    useEffect(() => {
        setExpandedSubjects(new Set()); // Reset expansions when class changes
    }, [selectedClass]);

    const filteredQuestions = useMemo(() => {
        return questions.filter(q => {
            const matchesClass = selectedClass === '' || q.exam === selectedClass;
            const matchesSearch = q.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                q.exam.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                (Array.isArray(q.subjects) && q.subjects.some(s => s.name.toLowerCase().includes(searchTerm.toLowerCase())));
            
            return matchesClass && matchesSearch;
        });
    }, [questions, selectedClass, searchTerm]);

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
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="bg-primary text-white px-6 py-2 rounded-tr-[2rem] rounded-bl-[1rem] font-black text-lg shadow-lg flex items-center gap-2">
                                            <Folder className="w-5 h-5 fill-white/20" />
                                            CBSE {year} (PYQ)
                                        </div>
                                        <div className="flex-1 h-[2px] bg-gradient-to-r from-primary/20 to-transparent" />
                                    </div>
                                    <div className="grid gap-8">
                                        {Object.entries(groupedSubjects).map(([subjectName, papers]) => {
                                            const expansionKey = `${year}-${subjectName}`;
                                            const isExpanded = expandedSubjects.has(expansionKey);

                                            return (
                                                <div key={subjectName} className="relative">
                                                    {/* Folder Tab Effect */}
                                                    <div className="absolute -top-6 left-4 bg-primary/10 border border-b-0 border-primary/20 px-4 py-1.5 rounded-t-xl text-[10px] font-bold text-primary z-0 flex items-center gap-2">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                                                        {subjectName} Folder
                                                    </div>
                                                    
                                                    <Card className="border-none shadow-md bg-white overflow-hidden relative z-10 rounded-2xl">
                                                        <button 
                                                            onClick={() => toggleSubject(expansionKey)}
                                                            className="w-full text-left focus:outline-none"
                                                        >
                                                            <CardHeader className="bg-primary/5 py-4 px-6 border-b border-primary/10 flex flex-row items-center justify-between">
                                                                <CardTitle className="text-sm font-bold text-primary flex items-center gap-2">
                                                                    <SubjectIcon name={subjectName} className="w-4 h-4" />
                                                                    {subjectName} (PYQ) {year}
                                                                </CardTitle>
                                                                <div className="bg-white/50 p-1.5 rounded-full shadow-sm border border-primary/10 transition-transform duration-300">
                                                                    {isExpanded ? <Minus className="w-4 h-4 text-primary" /> : <Plus className="w-4 h-4 text-primary" />}
                                                                </div>
                                                            </CardHeader>
                                                        </button>
                                                        {isExpanded && (
                                                            <CardContent className="p-6 md:p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-top-2 duration-300">
                                                                {papers.map((paper, pIdx) => (
                                                                    <div key={pIdx} className="group p-5 border rounded-2xl hover:border-primary/40 hover:bg-primary/[0.02] transition-all duration-300 flex flex-col justify-between gap-5 bg-white shadow-sm hover:shadow-lg">
                                                                        <div className="flex items-start gap-4">
                                                                            <div className="p-3 bg-primary/5 rounded-xl text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300 shadow-sm">
                                                                                <SubjectIcon name={subjectName} className="w-5 h-5" />
                                                                            </div>
                                                                            <div className="space-y-1">
                                                                                <span className="text-[10px] font-black text-primary/60 uppercase tracking-widest">{subjectName}</span>
                                                                                <p className="text-sm font-black text-foreground leading-tight">{paper.title}</p>
                                                                            </div>
                                                                        </div>
                                                                        <Button 
                                                                            variant="outline" 
                                                                            size="sm" 
                                                                            className="w-full font-black text-[10px] uppercase tracking-widest rounded-xl h-10 border-primary/20 hover:bg-primary hover:text-white transition-all shadow-none"
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                handleDownload(paper.pdfUrl);
                                                                            }} 
                                                                            disabled={!paper.pdfUrl}
                                                                        >
                                                                            <Download className="w-4 h-4 mr-2" />
                                                                            Download PDF
                                                                        </Button>
                                                                    </div>
                                                                ))}
                                                            </CardContent>
                                                        )}
                                                    </Card>
                                                </div>
                                            );
                                        })}
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