
import { getNotes, getImportantQuestionsForSubject } from '@/app/actions';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { BookOpen } from 'lucide-react';
import type { TClass, TSubject } from '@/app/actions/types';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { NotesChapterList } from '@/components/notes-chapter-list';
import { Suspense } from 'react';
import { NotesDetailsClient } from './notes-details-client';


export default async function NotesDetailsPage({ params }: { params: { slug: string[] } }) {
    const slug = params.slug || [];
    const [classId, subjectKey] = slug;

    if (!classId || !subjectKey) {
        return <p>Invalid URL.</p>;
    }
    
    const [notesResult, impQuestionsResult] = await Promise.all([
        getNotes(),
        getImportantQuestionsForSubject(classId, subjectKey)
    ]);

    const classDoc = notesResult.success ? (notesResult.data as any[]).find(doc => doc.id === classId) : null;
    
    if (!classDoc || !classDoc.subjects[subjectKey]) {
        return (
            <Card>
                <CardContent className="p-6">
                    <p className="text-destructive text-center">Notes content not found.</p>
                </CardContent>
            </Card>
        );
    }

    const classData: TClass = classDoc;
    const impQuestionsData: TSubject | null = (impQuestionsResult.success && impQuestionsResult.data) ? impQuestionsResult.data as TSubject : null;
    
    const subject = classData.subjects[subjectKey];
    const subjectName = subject.name || subjectKey.replace('-', ' ');
    const className = classData.name || classId.replace('-', ' ');

    return (
        <div className="space-y-6">
             <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/resources/notes">Notes</BreadcrumbLink>
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
                    <NotesDetailsClient 
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

