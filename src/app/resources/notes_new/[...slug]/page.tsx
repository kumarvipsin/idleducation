
'use client';

import { useEffect, useState, Suspense } from 'react';
import { getNotes } from '@/app/actions';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { BookOpen } from 'lucide-react';
import type { TClass } from '@/app/actions/types';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { NotesChapterList } from '@/components/notes-chapter-list';
import { useSearchParams } from 'next/navigation';

function NotesDetailsContent({ slug }: { slug: string[] }) {
    const [classId, subjectKey] = slug || [];
    const [classData, setClassData] = useState<TClass | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!classId || !subjectKey) {
            setError("Invalid URL.");
            setLoading(false);
            return;
        }

        const fetchNoteData = async () => {
            setLoading(true);
            const result = await getNotes();
            if (result.success && result.data) {
                const classDoc = (result.data as any[]).find(doc => doc.id === classId);
                if (classDoc && classDoc.subjects[subjectKey]) {
                    setClassData(classDoc);
                } else {
                    setError("Content not found.");
                }
            } else {
                setError("Failed to fetch notes.");
            }
            setLoading(false);
        };
        fetchNoteData();
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
    
    if (error) {
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
                    <NotesChapterList resources={subject} classId={classId} subjectKey={subjectKey} />
                </CardContent>
            </Card>
        </div>
    );
}


export default function NotesDetailsPage({ params }: { params: { slug: string[] } }) {
    return (
        <Suspense fallback={<Skeleton className="h-screen w-full" />}>
            <NotesDetailsContent slug={params.slug} />
        </Suspense>
    )
}
