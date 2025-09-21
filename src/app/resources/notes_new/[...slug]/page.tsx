
'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { getNotes, getImportantQuestionsForSubject } from '@/app/actions';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { BookOpen } from 'lucide-react';
import type { TClass, TSubject } from '@/app/actions/types';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { NotesChapterList } from '@/components/notes-chapter-list';

function NotesDetailsContent({ slug }: { slug: string[] }) {
    const [classId, subjectKey] = slug || [];
    const [classData, setClassData] = useState<TClass | null>(null);
    const [impQuestionsData, setImpQuestionsData] = useState<TSubject | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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
                getNotes(),
                getImportantQuestionsForSubject(classId, subjectKey)
            ]);

            if (notesResult.success && notesResult.data) {
                const classDoc = (notesResult.data as any[]).find(doc => doc.id === classId);
                if (classDoc && classDoc.subjects[subjectKey]) {
                    setClassData(classDoc);
                } else {
                    setError("Notes content not found.");
                }
            } else {
                setError(notesResult.message || "Failed to fetch notes.");
            }

            if (impQuestionsResult.success && impQuestionsResult.data) {
                setImpQuestionsData(impQuestionsResult.data as TSubject);
            } else {
                // Not setting an error, as important questions might not exist for all subjects
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
    
    if (error && !classData) {
         return (
            <Card>
                <CardContent className="p-6">
                    <p className="text-destructive text-center">{error}</p>
                </CardContent>
            </Card>
        )
    }

    if (!classData) {
        return null;
    }

    const subject = classData.subjects[subjectKey];
    const subjectName = subject.name || subjectKey.replace('-', ' ');
    const className = classData.name || classId.replace('-', ' ');

    return (
        <div className="space-y-6">
             <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/resources/notes_new">Notes</BreadcrumbLink>
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
                    <NotesChapterList 
                        notes={subject} 
                        importantQuestions={impQuestionsData} 
                        classId={classId} 
                        subjectKey={subjectKey} 
                    />
                </CardContent>
            </Card>
        </div>
    );
}


export default function NotesDetailsPage({ params }: { params: { slug: string[] } }) {
    // Using React.use() to unwrap the params promise as recommended by Next.js
    const resolvedParams = React.use(params);
    const slug = resolvedParams.slug || [];
    
    return (
        <Suspense fallback={<Skeleton className="h-screen w-full" />}>
            <NotesDetailsContent slug={slug} />
        </Suspense>
    )
}
