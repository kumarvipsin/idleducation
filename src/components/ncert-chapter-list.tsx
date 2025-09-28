
'use client';

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
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
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleViewPdf} disabled={isLoading}>
            <Eye className="h-4 w-4" />
        </Button>
    );
};


const renderContentTree = (items: (TChapter | TTopic | TSubTopic)[], level = 0) => {
    if (!items || items.length === 0) return null;

    return (
        <div className={level > 0 ? "pl-4 border-l ml-4" : ""}>
            {items.map((item, index) => {
                const hasChildren = 'topics' in item || 'subTopics' in item;
                const children = ('topics' in item ? item.topics : ('subTopics' in item ? item.subTopics : [])) || [];
                
                if (hasChildren && children.length > 0) {
                    return (
                        <Accordion type="single" collapsible key={index}>
                            <AccordionItem value={`item-${index}`} className="border-b-0">
                                <div className="flex items-center p-2 my-1 bg-muted/30 rounded-md">
                                    <AccordionTrigger className="font-medium capitalize text-sm hover:no-underline flex-1 w-full pr-2">
                                        {level === 0 ? <Folder className="w-4 h-4 mr-2" /> : <Dot className="w-4 h-4 mr-2" />}
                                        {item.name}
                                    </AccordionTrigger>
                                    {item.pdfUrl && <ViewPdfButton pdfUrl={item.pdfUrl} />}
                                </div>
                                <AccordionContent className="pt-0">
                                    {renderContentTree(children, level + 1)}
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    );
                }

                return (
                     <Card key={`item-${index}`} className="transition-all duration-300 my-1">
                        <div className="flex items-center justify-between p-3 md:p-4 group">
                            <span className="font-medium text-sm md:text-base text-foreground/90 flex items-center">
                               {level === 0 ? <FileIcon className="w-4 h-4 mr-2" /> : <Dot className="w-4 h-4 mr-2" />}
                               {item.name}
                            </span>
                          {item.pdfUrl && <ViewPdfButton pdfUrl={item.pdfUrl} />}
                        </div>
                    </Card>
                );
            })}
        </div>
    );
};


const renderSubjectContent = (subject: TSubject | null) => {
    if (!subject) {
        return <p className="text-muted-foreground p-4 text-center">No content available for this subject yet.</p>;
    }

    const hasParts = subject.parts && Object.keys(subject.parts).length > 0;

    return (
         <div className="space-y-4 md:space-y-6">
            {hasParts ? (
                Object.entries(subject.parts)
                    .sort(([, a], [, b]) => (a.order || 99) - (b.order || 99))
                    .map(([partKey, partData]) => (
                        <Accordion type="single" collapsible key={partKey} defaultValue="item-0">
                            <AccordionItem value={`item-0`} className="border-b-0">
                                 <AccordionTrigger className="text-base md:text-lg font-bold mb-3 text-primary border-b pb-1 capitalize hover:no-underline">
                                    {partData.name}
                                 </AccordionTrigger>
                                 <AccordionContent>
                                     {renderContentTree(partData.chapters)}
                                 </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    ))
            ) : subject.chapters && subject.chapters.length > 0 ? (
                renderContentTree(subject.chapters)
            ) : (
                <p className="text-muted-foreground p-4 text-center">No content available for this subject yet.</p>
            )}
        </div>
    );
};


export function NotesChapterList({ notes, importantQuestions }: { notes: TSubject, importantQuestions: TSubject | null, classId: string, subjectKey: string }) {
  const isMobile = useIsMobile();
  
  const notesContent = renderSubjectContent(notes);
  const impQuestionsContent = renderSubjectContent(importantQuestions);

  return (
    <>
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
            </div>
            {notesContent}
          </div>
          <div className="lg:col-span-1">
             <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl md:text-2xl font-bold text-foreground pb-2 bg-gradient-to-r from-red-500 from-50% to-primary to-50% bg-no-repeat bg-bottom inline-block" style={{ backgroundSize: '100% 2px' }}>Important Questions</h2>
            </div>
            {impQuestionsContent}
          </div>
        </div>
      )}
    </>
  );
}
