
'use client';

import { useEffect, useState, Suspense, ReactNode } from 'react';
import { getCollection } from '@/app/actions/data';
import { getImportantQuestionsForSubject } from '@/app/actions';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { BookOpen, Languages, ShoppingCart } from 'lucide-react';
import type { TClass, TSubject, TPart, TChapter } from '@/app/actions/types';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useIsMobile } from '@/hooks/use-mobile';
import { NcertChapterList } from '@/components/ncert-chapter-list';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { usePathname, useParams } from 'next/navigation';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';

function NcertSolutionsDetailsContent() {
    const params = useParams();
    const slug = params.slug as string[] || [];
    const [classId, subjectKey] = slug;
    const [classData, setClassData] = useState<TClass | null>(null);
    const [notesData, setNotesData] = useState<TSubject | null>(null);
    const [impQuestionsData, setImpQuestionsData] = useState<TSubject | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [contentsLang, setContentsLang] = useState<'en' | 'hi'>('en');
    const isMobile = useIsMobile();


    useEffect(() => {
        if (!classId || !subjectKey) {
            setError("Invalid URL.");
            setLoading(false);
            return;
        }

        const fetchData = async () => {
            setLoading(true);
            setError(null);
            
            const notesResult = await getCollection('ncertSolutions');

            if (notesResult.success && notesResult.data) {
                const classDoc = (notesResult.data as any[]).find(doc => doc.id === classId);
                if (classDoc && classDoc.subjects[subjectKey]) {
                    setClassData(classDoc);
                    setNotesData(classDoc.subjects[subjectKey]);
                } else {
                    setError("NCERT Notes content not found.");
                }
            } else {
                setError(notesResult.message || "Failed to fetch NCERT Notes.");
            }

            setLoading(false);
        };
        fetchData();
    }, [classId, subjectKey]);
    
    if (loading) {
        return (
             <Card>
                <CardContent className="p-6">
                    <Skeleton className="h-96 w-full" />
                </CardContent>
            </Card>
        )
    }
    
    if (error || !classData || !notesData) {
         return (
            <Card>
                <CardContent className="p-6">
                    <p className="text-destructive text-center">{error || "Could not load resources."}</p>
                </CardContent>
            </Card>
        )
    }

    const subjectName = notesData.name || subjectKey.replace('-', ' ');
    const className = classData.name || classId.replace('-', ' ');

    const contents = <NcertChapterList resources={notesData} is_note={true}/>;
    

    return (
      <div className="space-y-6">
        <Card className="shadow-lg overflow-hidden border-t-8 border-primary">
            <div className="bg-gradient-to-r from-primary to-accent text-white p-4">
                <div className="flex items-center gap-4">
                <div className="bg-white/20 p-3 rounded-full">
                    <BookOpen className="w-6 h-6" />
                </div>
                <div>
                    <CardTitle className="text-2xl font-bold capitalize">CBSE | {className} | {subjectName}</CardTitle>
                </div>
                </div>
            </div>
            <CardContent className="p-4 md:p-6">
                    <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl md:text-2xl font-bold text-foreground pb-2 bg-gradient-to-r from-red-500 from-50% to-primary to-50% bg-no-repeat bg-bottom inline-block" style={{ backgroundSize: '100% 2px' }}>Contents</h2>
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => setContentsLang(contentsLang === 'en' ? 'hi' : 'en')}
                        className="rounded-full bg-background/50 border"
                    >
                        <Languages className="w-5 h-5" />
                        <span className="sr-only">Toggle Language</span>
                    </Button>
                </div>
                {contents}
            </CardContent>
        </Card>
      </div>
    );
}


export default function NcertSolutionsDetailsPage() {
    return (
        <div className="container mx-auto px-4 md:px-[10%] py-8">
            <Suspense fallback={<Skeleton className="h-screen w-full" />}>
                <NcertSolutionsDetailsContent />
            </Suspense>
        </div>
    )
}
