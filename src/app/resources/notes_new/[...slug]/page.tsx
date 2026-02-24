'use client';

import { useEffect, useState, Suspense } from 'react';
import { getCollection } from '@/app/actions/data';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { BookOpen } from 'lucide-react';
import type { TClass, TSubject } from '@/app/actions/types';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { NcertChapterList } from '@/components/ncert-chapter-list';
import { useParams } from 'next/navigation';

function NotesDetailsContent() {
    const params = useParams();
    const slug = params.slug as string[] || [];
    const [classId, subjectKey] = slug;
    const [classData, setClassData] = useState<TClass | null>(null);
    const [notesData, setNotesData] = useState<TSubject | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!classId || !subjectKey) {
            setError("Invalid URL parameters.");
            setLoading(false);
            return;
        }

        const fetchData = async () => {
            setLoading(true);
            setError(null);
            
            const result = await getCollection('notes');

            if (result.success && result.data) {
                const classDoc = (result.data as any[]).find(doc => doc.id === classId);
                if (classDoc && classDoc.subjects[subjectKey]) {
                    setClassData(classDoc);
                    setNotesData(classDoc.subjects[subjectKey]);
                } else {
                    setError("Notes content not found.");
                }
            } else {
                setError(result.message || "Failed to fetch academic notes.");
            }

            setLoading(false);
        };
        fetchData();
    }, [classId, subjectKey]);
    
    if (loading) {
        return (
             <div className="space-y-6">
                <Skeleton className="h-6 w-64" />
                <Card>
                    <CardContent className="p-6">
                        <Skeleton className="h-96 w-full" />
                    </CardContent>
                </Card>
            </div>
        )
    }
    
    if (error || !classData || !notesData) {
         return (
            <Card>
                <CardContent className="p-12 text-center">
                    <p className="text-destructive font-bold">{error || "Could not load resources."}</p>
                </CardContent>
            </Card>
        )
    }

    const subjectName = notesData.name || subjectKey.replace(/-/g, ' ');
    const className = classData.name || classId.replace(/-/g, ' ');

    return (
        <div className="space-y-6">
             <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/resources/notes">Revision Notes</BreadcrumbLink>
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
                    <NcertChapterList resources={notesData} is_note={true} />
                </CardContent>
            </Card>
        </div>
    );
}


export default function NotesDetailsPage() {
    return (
        <div className="container mx-auto py-12 px-4 md:px-6">
            <Suspense fallback={<Skeleton className="h-screen w-full" />}>
                <NotesDetailsContent />
            </Suspense>
        </div>
    )
}
