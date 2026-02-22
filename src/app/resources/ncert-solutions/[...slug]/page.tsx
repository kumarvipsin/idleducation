
'use client';

import { useEffect, useState, Suspense } from 'react';
import { getCollection } from '@/app/actions/data';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { BookOpen, Home } from 'lucide-react';
import type { TClass, TSubject } from '@/app/actions/types';
import { NcertChapterList } from '@/components/ncert-chapter-list';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';

function NcertSolutionsDetailsContent() {
    const params = useParams();
    const slug = params.slug as string[] || [];
    const [classId, subjectKey] = slug;
    const [classData, setClassData] = useState<TClass | null>(null);
    const [notesData, setNotesData] = useState<TSubject | null>(null);
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
             <div className="space-y-10">
                <div className="px-1"><Skeleton className="h-6 w-64" /></div>
                <div className="space-y-4">
                    <Skeleton className="h-14 w-full rounded-2xl" />
                    <Skeleton className="h-14 w-full rounded-2xl" />
                    <Skeleton className="h-14 w-full rounded-2xl" />
                </div>
            </div>
        )
    }
    
    if (error || !classData || !notesData) {
         return (
            <Card className="rounded-2xl border-none shadow-none bg-white">
                <CardContent className="p-12">
                    <div className="text-center space-y-6">
                        <div className="bg-destructive/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                            <BookOpen className="w-8 h-8 text-destructive" />
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-2xl font-black tracking-tight">Resource Unavailable</h2>
                            <p className="text-muted-foreground font-bold">{error || "Could not load the requested academic resources."}</p>
                        </div>
                        <Button asChild variant="outline" className="rounded-xl font-bold uppercase tracking-widest text-[10px]">
                            <Link href="/resources/ncert-solutions">Return to Solutions</Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        )
    }

    const subjectName = notesData.name || subjectKey.replace(/-/g, ' ');
    const className = classData.name || classId.replace(/-/g, ' ');

    return (
      <div className="space-y-8 md:space-y-12">
        <Breadcrumb className="px-1">
            <BreadcrumbList>
                <BreadcrumbItem>
                    <BreadcrumbLink href="/" className="flex items-center gap-1.5 font-bold text-[10px] uppercase tracking-widest">
                        <Home className="h-3 w-3" /> Home
                    </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                    <BreadcrumbLink href="/resources/ncert-solutions" className="font-bold text-[10px] uppercase tracking-widest">NCERT Solutions</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                    <BreadcrumbLink href="/resources/ncert-solutions" className="capitalize font-bold text-[10px] uppercase tracking-widest">{className}</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                    <BreadcrumbPage className="capitalize font-black text-primary text-[10px] uppercase tracking-widest">{subjectName}</BreadcrumbPage>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>

        <div className="space-y-10">
             <div className="flex items-center gap-4 p-3 md:p-4 bg-primary/[0.03] rounded-lg border border-primary/10 shadow-sm transition-all duration-300">
                <h2 className="text-xl md:text-2xl font-black tracking-tighter text-foreground">Contents</h2>
                <div className="h-[2px] flex-1 bg-gradient-to-r from-primary/30 via-primary/10 to-transparent rounded-full" />
            </div>
            <NcertChapterList resources={notesData} />
        </div>
      </div>
    );
}

export default function NcertSolutionsDetailsPage() {
    return (
        <div className="container mx-auto py-12 px-4 md:px-6 max-w-6xl">
            <Suspense fallback={<Skeleton className="h-screen w-full" />}>
                <NcertSolutionsDetailsContent />
            </Suspense>
        </div>
    )
}
