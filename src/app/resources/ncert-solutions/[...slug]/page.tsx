
'use client';

import { useEffect, useState, Suspense } from 'react';
import { getCollection } from '@/app/actions';
import { getImportantQuestionsForSubject } from '@/app/actions';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { BookOpen } from 'lucide-react';
import type { TClass, TSubject } from '@/app/actions/types';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { NotesChapterList } from '@/components/notes-chapter-list';
import { usePathname } from 'next/navigation';

function NcertSolutionsDetailsContent() {
    const pathname = usePathname();
    const slug = pathname.split('/').slice(3);
    const [classId, subjectKey] = slug || [];
    const [classData, setClassData] = useState<TClass | null>(null);
    const [notesData, setNotesData] = useState<TSubject | null>(null);
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
                    <NotesChapterList 
                        notes={notesData} 
                        importantQuestions={impQuestionsData} 
                        classId={classId} 
                        subjectKey={subjectKey} 
                    />
                </CardContent>
            </Card>
        </div>
    );
}


export default function NcertSolutionsDetailsPage() {
    return (
        <Suspense fallback={<Skeleton className="h-screen w-full" />}>
            <NcertSolutionsDetailsContent />
        </Suspense>
    )
}
