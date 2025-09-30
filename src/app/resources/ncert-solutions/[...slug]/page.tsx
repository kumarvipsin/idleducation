
'use client';

import { useEffect, useState, Suspense, ReactNode } from 'react';
import { getCollection } from '@/app/actions';
import { getImportantQuestionsForSubject } from '@/app/actions';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { BookOpen, Languages, ShoppingCart } from 'lucide-react';
import type { TClass, TSubject, TPart, TChapter } from '@/app/actions/types';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useIsMobile } from '@/hooks/use-mobile';
import { NotesChapterList } from '@/components/ncert-chapter-list';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { usePathname, useParams } from 'next/navigation';

function PrimumNotes({ subject, lang, onLangChange }: { subject: TSubject | null, lang: 'en' | 'hi', onLangChange: (lang: 'en' | 'hi') => void }) {
    if (!subject) {
        return <p className="text-muted-foreground p-4 text-center">No important questions available for this subject yet.</p>;
    }
    
    const hasParts = subject.parts && Object.keys(subject.parts).length > 0;
    const books = hasParts 
        ? Object.values(subject.parts).map(p => ({ name: p.name, chapters: p.chapters }))
        : [{ name: subject.name, chapters: subject.chapters || [] }];

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl md:text-2xl font-bold text-foreground pb-2 bg-gradient-to-r from-red-500 from-50% to-primary to-50% bg-no-repeat bg-bottom inline-block" style={{ backgroundSize: '100% 2px' }}>Important Questions</h2>
                <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => onLangChange(lang === 'en' ? 'hi' : 'en')}
                    className="rounded-full bg-background/50 border"
                >
                    <Languages className="w-5 h-5" />
                    <span className="sr-only">Toggle Language</span>
                </Button>
            </div>
            <div className="space-y-4">
              {books.map((book, bookIndex) => (
                <div key={bookIndex}>
                  {hasParts && <h3 className="text-base md:text-lg font-bold mb-3 text-primary border-b pb-1">{book.name}</h3>}
                  <div className="space-y-2">
                    {book.chapters.map((chapter, index) => (
                      <Card key={index} className="bg-background">
                        <CardContent className="p-3 flex items-center justify-between">
                          <p className="font-medium text-xs md:text-sm flex-1 pr-2">{chapter.name}</p>
                          <div className="flex items-center gap-1 md:gap-2">
                              <Button asChild variant="ghost" size="sm">
                                  <Link href="#">View</Link>
                              </Button>
                              <Button asChild variant="ghost" size="sm">
                                  <Link href="#"><ShoppingCart className="w-4 h-4 mr-1"/>CART</Link>
                              </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </div>
        </div>
    );
}

function NcertSolutionsDetailsContent() {
    const params = useParams();
    const slug = params.slug as string[] || [];
    const [classId, subjectKey] = slug;
    const [classData, setClassData] = useState<TClass | null>(null);
    const [notesData, setNotesData] = useState<TSubject | null>(null);
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
            
            const notesResult = await getCollection('ncertSolutions');

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

    const contents = <NotesChapterList notes={notesData} contentType="notes" language={contentsLang} classId={classId} subjectKey={subjectKey} />;
    const importantQuestions = <PrimumNotes subject={notesData} lang={notesLang} onLangChange={setNotesLang} />;

    return (
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
                        <TabsContent value="contents" className="pt-4">{contents}</TabsContent>
                        <TabsContent value="notes" className="pt-4">{importantQuestions}</TabsContent>
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
                            {contents}
                        </div>
                        <div className="lg:col-span-1">{importantQuestions}</div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}


export default function NcertSolutionsDetailsPage() {
    return (
        <Suspense fallback={<Skeleton className="h-screen w-full" />}>
            <NcertSolutionsDetailsContent />
        </Suspense>
    )
}
