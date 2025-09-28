
'use client';

import { useEffect, useState, Suspense } from 'react';
import { getCollection } from '@/app/actions';
import { getImportantQuestionsForSubject } from '@/app/actions';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { BookOpen, Languages } from 'lucide-react';
import type { TClass, TSubject } from '@/app/actions/types';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { NotesChapterList } from '@/components/ncert-chapter-list';
import { usePathname } from 'next/navigation';
import { useIsMobile } from '@/hooks/use-mobile';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';

function NcertSolutionsDetailsContent() {
    const pathname = usePathname();
    const slug = pathname.split('/').slice(3);
    const [classId, subjectKey] = slug || [];
    const [classData, setClassData] = useState<TClass | null>(null);
    const [notesData, setNotesData] = useState<TSubject | null>(null);
    const [impQuestionsData, setImpQuestionsData] = useState<TSubject | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [notesLang, setNotesLang] = useState<'en' | 'hi'>('en');
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
            
            const [notesResult, impQuestionsResult] = await Promise.all([
                getCollection('ncertSolutions'),
                getImportantQuestionsForSubject(classId, subjectKey)
            ]);

            if (notesResult.success && notesResult.data) {
                const classDoc = (notesResult.data as any[]).find(doc => doc.id === classId);
                if (classDoc && classDoc.subjects[subjectKey]) {
                    setClassData(classDoc);
                    setNotesData(classDoc.subjects[subjectKey]);
                } else {
                    setError("NCERT Solutions content not found.");
                }
            } else {
                setError(notesResult.message || "Failed to fetch NCERT Solutions.");
            }

            if (impQuestionsResult.success && impQuestionsResult.data) {
                setImpQuestionsData(impQuestionsResult.data as TSubject);
            } else {
                console.warn(impQuestionsResult.message);
                setImpQuestionsData(null);
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

    const notesContent = <NotesChapterList notes={notesData} contentType="notes" language={contentsLang} classId={classId} subjectKey={subjectKey} />;
    const impQuestionsContent = <NotesChapterList notes={impQuestionsData} contentType="importantQuestions" language={notesLang} classId={classId} subjectKey={subjectKey} />;


    return (
        <div className="space-y-6">
             <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/resources/ncert-solutions">NCERT Solutions</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage className="capitalize">{className}</BreadcrumbPage>
                    </BreadcrumbItem>
                     <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage className="capitalize">{subjectName}</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <Card className="shadow-lg overflow-hidden border-t-8 border-primary">
                <div className="bg-gradient-to-r from-primary to-accent text-white p-4">
                    <div className="flex items-center gap-4">
                    <div className="bg-white/20 p-3 rounded-full">
                        <BookOpen className="w-6 h-6" />
                    </div>
                    <div>
                        <CardTitle className="text-2xl font-bold capitalize">{className} | {subjectName} | CBSE</CardTitle>
                    </div>
                    </div>
                </div>
                <CardContent className="p-4 md:p-6">
                    {isMobile ? (
                        <Tabs defaultValue="contents" className="w-full">
                            <TabsList className="grid w-full grid-cols-2 bg-muted/60 rounded-lg">
                                <TabsTrigger value="contents" className="rounded-md">Contents</TabsTrigger>
                                <TabsTrigger value="notes" className="rounded-md">Important Questions</TabsTrigger>
                            </TabsList>
                            <TabsContent value="contents" className="pt-4">{notesContent}</TabsContent>
                            <TabsContent value="notes" className="pt-4">{impQuestionsContent}</TabsContent>
                        </Tabs>
                        ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 max-w-7xl mx-auto">
                            <div className="lg:col-span-1">
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
                                {notesContent}
                            </div>
                            <div className="lg:col-span-1">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-xl md:text-2xl font-bold text-foreground pb-2 bg-gradient-to-r from-red-500 from-50% to-primary to-50% bg-no-repeat bg-bottom inline-block" style={{ backgroundSize: '100% 2px' }}>Important Questions</h2>
                                    <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        onClick={() => setNotesLang(notesLang === 'en' ? 'hi' : 'en')}
                                        className="rounded-full bg-background/50 border"
                                    >
                                        <Languages className="w-5 h-5" />
                                        <span className="sr-only">Toggle Language</span>
                                    </Button>
                                </div>
                                {impQuestionsContent}
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}


export default function NcertSolutionsDetailsPage({ params }: { params: { slug: string[] } }) {
    const slug = params.slug || [];
    return (
        <Suspense fallback={<Skeleton className="h-screen w-full" />}>
            <NcertSolutionsDetailsContent />
        </Suspense>
    )
}
