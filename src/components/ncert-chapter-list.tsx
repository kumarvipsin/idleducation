
'use client';

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronRight, Download, Languages, ShoppingCart, Folder, File as FileIcon, Dot, Eye } from "lucide-react";
import type { TSubject, TPart, TChapter, TTopic, TSubTopic } from "@/app/actions/types";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";
import { useToast } from "@/hooks/use-toast";
import { getSignedUrlForPdf } from "@/app/actions";


const ViewPdfButton = ({ pdfUrl }: { pdfUrl: string }) => {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);

    const handleViewPdf = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
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
        <Button variant="ghost" size="sm" onClick={handleViewPdf} disabled={isLoading}>
            <Eye className="w-4 h-4 mr-1"/>View
        </Button>
    );
};

const ContentTree = ({ items, level = 0 }: { items: any[], level?: number }) => {
    if (!items || items.length === 0) return null;

    return (
        <div className={cn("space-y-1", level > 0 && "pl-3 border-l ml-3")}>
            {items.map((item, index) => {
                const hasChildren = 'topics' in item || 'subTopics' in item;
                const children = ('topics' in item ? item.topics : ('subTopics' in item ? item.subTopics : [])) || [];
                
                return (
                    <div key={index} className="py-0.5">
                        <div className="flex items-center gap-2">
                           <span className="text-sm font-semibold text-foreground/80">
                                {item.name}
                            </span>
                        </div>
                        {hasChildren && children.length > 0 && <ContentTree items={children} level={level + 1} />}
                    </div>
                );
            })}
        </div>
    );
};
const renderContentTree = (items: (TChapter | TTopic | TSubTopic)[], level = 0) => {
    if (!items || items.length === 0) return null;

    return (
        <Accordion type="single" collapsible className="w-full space-y-2">
            {items.map((item, index) => {
                const hasChildren = 'topics' in item || 'subTopics' in item;
                const children = ('topics' in item ? item.topics : ('subTopics' in item ? item.subTopics : [])) || [];
                
                return (
                     <Card key={`item-${index}`} className="transition-all duration-300 my-1">
                        <AccordionItem value={`item-${index}`} className="border-b-0">
                           <div className="flex items-center justify-between px-1.5 md:px-2 py-0.5 md:py-1 group">
                                <AccordionTrigger className="flex-1 font-medium text-sm md:text-base text-foreground/90 text-left hover:no-underline p-2">
                                    <div className="flex items-center">
                                    {hasChildren ? <Folder className="w-4 h-4 mr-2" /> : <FileIcon className="w-4 h-4 mr-2" />}
                                    {item.name}
                                    </div>
                                </AccordionTrigger>
                                <div className="flex items-center gap-1">
                                {item.pdfUrl && <ViewPdfButton pdfUrl={item.pdfUrl} />}
                                 <Button asChild variant="ghost" size="sm">
                                    <Link href="#"><ShoppingCart className="w-4 h-4 mr-1"/>CART</Link>
                                </Button>
                                </div>
                           </div>
                            {hasChildren && (
                                <AccordionContent className="p-4 pt-0">
                                    <ContentTree items={children || []} />
                                </AccordionContent>
                            )}
                        </AccordionItem>
                    </Card>
                );
            })}
        </Accordion>
    );
};


const renderSubjectContent = (subject: TSubject | null, contentType: 'notes' | 'importantQuestions', language: 'en' | 'hi') => {
    if (!subject) {
        return <p className="text-muted-foreground p-4 text-center">No {contentType === 'notes' ? 'content' : 'questions'} available for this subject yet.</p>;
    }

    const hasParts = subject.parts && Object.keys(subject.parts).length > 0;

    const books = hasParts 
      ? Object.values(subject.parts).sort((a,b) => (a.order || 99) - (b.order || 99)).map(part => ({name: part.name, chapters: part.chapters}))
      : [{ name: subject.name, chapters: subject.chapters || [] }];

    return (
         <div className="space-y-4 md:space-y-6">
            {books.map((book, bookIndex) => (
                <div key={bookIndex}>
                    {hasParts && <h3 className="text-base md:text-lg font-bold mb-3 text-primary border-b pb-1 capitalize">{book.name}</h3>}
                    {renderContentTree(book.chapters)}
                </div>
            ))}
        </div>
    );
};


export function NotesChapterList({ notes, importantQuestions, contentType, language }: { notes: TSubject | null, importantQuestions: TSubject | null, contentType: 'notes' | 'importantQuestions', language: 'en' | 'hi', classId: string, subjectKey: string }) {
    if (contentType === 'notes') {
        return renderSubjectContent(notes, 'notes', language);
    }
    return renderSubjectContent(importantQuestions, 'importantQuestions', language);
}

