
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Download, BookOpen, Home } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { getPreviousYearQuestions, getSignedUrlForPdf } from '@/app/actions';
import type { TPreviousYearQuestion } from '@/app/actions/types';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';

export default function PreviousYearQuestionsPage() {
  const [papers, setPapers] = useState<TPreviousYearQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('All');
  const { toast } = useToast();

  useEffect(() => {
    const fetchPapers = async () => {
      setLoading(true);
      const result = await getPreviousYearQuestions();
      if (result.success && result.data) {
        const data = result.data as TPreviousYearQuestion[];
        setPapers(data);
        const classes = Array.from(new Set(data.map(p => p.exam.includes('Class 12') ? 'Class 12' : 'Class 10'))).sort();
         if(classes.length > 0) {
           setSelectedClass(classes.find(c => c.includes('10')) || classes[0]);
         }
      }
      setLoading(false);
    };
    fetchPapers();
  }, []);
  
  const handleDownload = async (pdfUrl: string) => {
    if (!pdfUrl) {
      toast({ variant: "destructive", title: "Error", description: "No PDF available for this paper." });
      return;
    }
    // If it's a GCS URL, get a signed URL
    if (pdfUrl.includes('storage.googleapis.com')) {
        const result = await getSignedUrlForPdf(pdfUrl);
        if (result.success && result.url) {
            window.open(result.url, '_blank');
        } else {
            toast({ variant: "destructive", title: "Error", description: result.message });
        }
    } else {
        // Otherwise, open it directly
        window.open(pdfUrl, '_blank');
    }
  };

  const classes = Array.from(new Set(papers.map(p => p.exam.includes('Class 12') ? 'Class 12' : 'Class 10'))).sort();
  
  const subjects = ['All', ...Array.from(new Set(papers.filter(p => p.exam.includes(selectedClass)).map(p => p.subject)))];

  useEffect(() => {
    if (!subjects.includes(selectedSubject)) {
        setSelectedSubject('All');
    }
  }, [selectedClass, subjects, selectedSubject]);

  const filteredPapers = papers.filter(p => 
    p.exam.includes(selectedClass) && 
    (selectedSubject === 'All' || p.subject === selectedSubject)
  );

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800 overflow-y-auto p-4">
      <Link href="/" className="absolute top-4 right-4 z-20">
        <Button variant="ghost" size="icon">
          <Home className="h-6 w-6 text-primary" />
          <span className="sr-only">Home</span>
        </Button>
      </Link>
      <div className="relative z-10 container mx-auto py-12">
        <div className="mb-8 space-y-4">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-extrabold text-primary tracking-tight">Previous Year Question Papers</h1>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                  Practice with past exam papers to familiarize yourself with the format and question types.
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
            </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
             {loading ? (
                [...Array(4)].map((_, index) => (
                    <div key={index} className="block flex-shrink-0">
                        <Skeleton className="h-48 w-full rounded-lg" />
                    </div>
                ))
             ) : (
                filteredPapers.map((paper, index) => (
                    <div key={paper.id} className="block group">
                    <Card className="h-full rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col bg-card bg-gradient-to-br from-purple-50 to-blue-100 dark:from-purple-900/20 dark:to-blue-900/30">
                        <CardContent className="p-6 flex-grow flex flex-col">
                            <div className="flex justify-between items-start">
                                <FileText className="w-8 h-8 text-primary" />
                                <Badge variant="secondary">{paper.year}</Badge>
                            </div>
                            <h3 className="text-lg font-bold mt-4 flex-grow text-foreground">{paper.subject}</h3>
                            <p className="text-sm text-muted-foreground mt-1 mb-4">{paper.title}</p>
                            <Button className="w-full mt-auto" onClick={() => handleDownload(paper.pdfUrl)}>
                                Download PDF <Download className="ml-2 h-4 w-4" />
                            </Button>
                        </CardContent>
                    </Card>
                    </div>
                ))
             )}
        </div>
      </div>
    </div>
  );
}
