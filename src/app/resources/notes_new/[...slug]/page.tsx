
'use client';

import { useEffect, useState } from 'react';
import { getNotes, getSignedUrlForPdf } from '@/app/actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Skeleton } from '@/components/ui/skeleton';
import { BookOpen, Folder, File as FileIcon, Dot, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import type { TClass, TSubject, TPart, TChapter, TTopic, TSubTopic } from '@/app/actions/types';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';

const ViewPdfButton = ({ pdfUrl }: { pdfUrl: string }) => {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);

    const handleViewPdf = async () => {
        if (!pdfUrl) return;
        setIsLoading(true);
        const result = await getSignedUrlForPdf(pdfUrl);
        if (result.success && result.url) {
            window.open(result.url, '_blank');
        } else {
            toast({ variant: "destructive", title: "Error", description: result.message });
        }
        setIsLoading(false);
    };

    return (
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleViewPdf} disabled={isLoading}>
            <Eye className="h-4 w-4" />
        </Button>
    );
};

const ContentDisplay = ({ classData, subjectKey }: { classData: TClass, subjectKey: string }) => {
    const subject = classData.subjects[subjectKey];

    const renderChapter = (chapter: TChapter, index: number) => (
        <AccordionItem value={`chapter-${index}`} key={`chapter-${index}`}>
            <AccordionTrigger className="font-medium text-sm hover:no-underline pl-2">
                <div className="flex items-center gap-2">
                    <FileIcon className="w-4 h-4" />
                    <span>{chapter.name}</span>
                </div>
            </AccordionTrigger>
            <AccordionContent className="pl-8 border-l ml-4">
                {chapter.pdfUrl && (
                    <div className="flex items-center justify-between p-2">
                        <span>Chapter PDF</span>
                        <ViewPdfButton pdfUrl={chapter.pdfUrl} />
                    </div>
                )}
                {chapter.topics && chapter.topics.length > 0 ? (
                    <Accordion type="multiple" className="w-full">
                        {chapter.topics.map(renderTopic)}
                    </Accordion>
                ) : (
                    <p className="text-muted-foreground p-2 text-sm">No topics in this chapter.</p>
                )}
            </AccordionContent>
        </AccordionItem>
    );

    const renderTopic = (topic: TTopic, index: number) => (
        <AccordionItem value={`topic-${index}`} key={`topic-${index}`}>
            <AccordionTrigger className="text-sm hover:no-underline pl-2">
                <div className="flex items-center gap-2">
                    <Dot />
                    <span>{topic.name}</span>
                </div>
            </AccordionTrigger>
            <AccordionContent className="pl-8 border-l ml-4">
                {topic.pdfUrl && (
                     <div className="flex items-center justify-between p-2">
                        <span>Topic PDF</span>
                        <ViewPdfButton pdfUrl={topic.pdfUrl} />
                    </div>
                )}
                {topic.subTopics && topic.subTopics.length > 0 ? (
                    <ul className="space-y-1">
                        {topic.subTopics.map(renderSubTopic)}
                    </ul>
                ) : (
                     <p className="text-muted-foreground p-2 text-xs">No sub-topics here.</p>
                )}
            </AccordionContent>
        </AccordionItem>
    );

    const renderSubTopic = (subTopic: TSubTopic, index: number) => (
         <li key={`subtopic-${index}`} className="flex items-center justify-between p-2 text-sm">
            <div className="flex items-center gap-2">
                <span>{subTopic.name}</span>
            </div>
            {subTopic.pdfUrl && <ViewPdfButton pdfUrl={subTopic.pdfUrl} />}
        </li>
    );

    const renderPart = (part: TPart, partKey: string) => (
         <AccordionItem value={`part-${partKey}`} key={`part-${partKey}`}>
            <AccordionTrigger className="font-semibold capitalize text-base hover:no-underline">
                <div className="flex items-center gap-2">
                    <Folder className="w-4 h-4" />
                    <span>{part.name}</span>
                </div>
            </AccordionTrigger>
            <AccordionContent className="pl-6">
                 {part.chapters && part.chapters.length > 0 ? (
                    <Accordion type="multiple" className="w-full">
                        {part.chapters.map(renderChapter)}
                    </Accordion>
                ) : (
                    <p className="text-muted-foreground p-2 text-sm">No chapters in this part.</p>
                )}
            </AccordionContent>
        </AccordionItem>
    );

    return (
        <Accordion type="multiple" className="w-full">
            {subject.parts && Object.keys(subject.parts).length > 0 ? (
                Object.entries(subject.parts)
                    .sort(([, a], [, b]) => (a.order || 99) - (b.order || 99))
                    .map(([partKey, partData]) => renderPart(partData, partKey))
            ) : subject.chapters && subject.chapters.length > 0 ? (
                subject.chapters.map(renderChapter)
            ) : (
                <p className="text-muted-foreground p-4 text-center">No content available for this subject yet.</p>
            )}
        </Accordion>
    );
};


export default function NotesDetailsPage({ params }: { params: { slug: string[] } }) {
    const { slug } = params;
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

    const renderSkeleton = () => (
        <Card>
            <CardHeader>
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
            </CardContent>
        </Card>
    );
    
    const subjectName = classData?.subjects?.[subjectKey]?.name || subjectKey.replace('-', ' ');
    const className = classData?.name || classId.replace('-', ' ');

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
            {loading ? (
                renderSkeleton()
            ) : error ? (
                <Card>
                    <CardHeader><CardTitle>Error</CardTitle></CardHeader>
                    <CardContent><p className="text-destructive">{error}</p></CardContent>
                </Card>
            ) : classData ? (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 capitalize">
                            <BookOpen /> {subjectName} - {className}
                        </CardTitle>
                        <CardDescription>
                            Detailed notes and topics for {subjectName}.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ContentDisplay classData={classData} subjectKey={subjectKey} />
                    </CardContent>
                </Card>
            ) : null}
        </div>
    );
}
