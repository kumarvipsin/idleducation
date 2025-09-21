
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


export function NotesChapterList({ resources: subject, classId, subjectKey }: { resources: TSubject, classId: string, subjectKey: string }) {
  const [notesLang, setNotesLang] = useState<'en' | 'hi'>('en');
  const [contentsLang, setContentsLang] = useState<'en' | 'hi'>('en');
  const isMobile = useIsMobile();
  
  const renderChapter = (chapter: TChapter, index: number, partKey?: string) => (
      <Card key={`chapter-${index}`} className="transition-all duration-300 hover:shadow-md hover:bg-background/80 hover:border-primary/30">
        <div className="flex items-center justify-between p-3 md:p-4 group">
          <span className="font-medium text-sm md:text-base text-foreground/90">{chapter.name}</span>
          {chapter.pdfUrl && <ViewPdfButton pdfUrl={chapter.pdfUrl} />}
        </div>
      </Card>
  );

  const renderPart = (part: TPart, partKey: string) => (
    <div key={partKey}>
      <h3 className="text-base md:text-lg font-bold mb-3 text-primary border-b pb-1 capitalize">{part.name}</h3>
      <div className="space-y-2">
        {part.chapters.map((chapter, index) => renderChapter(chapter, index, partKey))}
      </div>
    </div>
  );

  const contents = (
    <div>
      <div className="space-y-4 md:space-y-6">
        {subject.parts && Object.keys(subject.parts).length > 0 ? (
          Object.entries(subject.parts)
            .sort(([, a], [, b]) => (a.order || 99) - (b.order || 99))
            .map(([partKey, partData]) => renderPart(partData, partKey))
        ) : subject.chapters && subject.chapters.length > 0 ? (
          <div className="space-y-2">
             {subject.chapters.map((chapter, index) => renderChapter(chapter, index))}
          </div>
        ) : (
          <p className="text-muted-foreground p-4 text-center">No content available for this subject yet.</p>
        )}
      </div>
    </div>
  );

  const primumNotes = (
    <div>
        <p className="text-muted-foreground p-4 text-center">Important Questions are coming soon for this subject.</p>
    </div>
  );
  
  return (
    <>
      {isMobile ? (
        <Tabs defaultValue="contents" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-muted/60 rounded-lg">
            <TabsTrigger value="contents" className="rounded-md">Contents</TabsTrigger>
            <TabsTrigger value="notes" className="rounded-md">Important Questions</TabsTrigger>
          </TabsList>
          <TabsContent value="contents" className="pt-4">{contents}</TabsContent>
          <TabsContent value="notes" className="pt-4">{primumNotes}</TabsContent>
        </Tabs>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 max-w-7xl mx-auto">
          <div className="lg:col-span-1">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl md:text-2xl font-bold text-foreground pb-2 bg-gradient-to-r from-red-500 from-50% to-primary to-50% bg-no-repeat bg-bottom inline-block" style={{ backgroundSize: '100% 2px' }}>Contents</h2>
            </div>
            {contents}
          </div>
          <div className="lg:col-span-1">
             <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl md:text-2xl font-bold text-foreground pb-2 bg-gradient-to-r from-red-500 from-50% to-primary to-50% bg-no-repeat bg-bottom inline-block" style={{ backgroundSize: '100% 2px' }}>Important Questions</h2>
            </div>
            {primumNotes}
          </div>
        </div>
      )}
    </>
  );
}
