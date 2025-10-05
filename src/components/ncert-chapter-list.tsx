
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";

const DownloadPdfButton = ({ pdfUrl }: { pdfUrl: string }) => {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);

    const handleDownload = async (e: React.MouseEvent) => {
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
        <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground" onClick={handleDownload} disabled={isLoading}>
            <Download className="h-4 w-4" />
        </Button>
    );
}

const ChapterResources = ({ chapter, onViewPdf }: { chapter: TChapter; onViewPdf: (url: string) => void; }) => {
    return (
        <div className="space-y-2 py-2 px-4">
            {chapter.longNotePdfUrl && (
                <div className="flex items-center justify-between p-1 rounded-md bg-muted/50">
                    <span className="text-xs font-medium text-gray-500">NCERT Solutions (EN)</span>
                    <div className="flex items-center">
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-blue-500 hover:text-blue-700 transition" onClick={() => onViewPdf(chapter.longNotePdfUrl!)}>
                            <Eye className="h-4 w-4" />
                        </Button>
                        <DownloadPdfButton pdfUrl={chapter.longNotePdfUrl} />
                    </div>
                </div>
            )}
            {chapter.shortNotePdfUrl && (
                <div className="flex items-center justify-between p-1 rounded-md bg-muted/50">
                    <span className="text-xs font-medium text-gray-500">Important Q's (EN)</span>
                    <div className="flex items-center">
                         <Button variant="ghost" size="icon" className="h-7 w-7 text-blue-500 hover:text-blue-700 transition" onClick={() => onViewPdf(chapter.shortNotePdfUrl!)}>
                            <Eye className="h-4 w-4" />
                        </Button>
                        <Button asChild variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground">
                            <Link href="/store"><ShoppingCart className="w-4 h-4" /></Link>
                        </Button>
                    </div>
                </div>
            )}
        </div>
    )
};

export function NcertChapterList({ resources, is_note }: { resources: TSubject | null, is_note?: boolean }) {
  const { toast } = useToast();
  const [isLoadingPdf, setIsLoadingPdf] = useState(false);
  const [pdfSrc, setPdfSrc] = useState<string | null>(null);
  const [isPdfDialogOpen, setIsPdfDialogOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState("PDF Viewer");
  
  const handleViewPdf = async (pdfUrl: string, title?: string) => {
    if (!pdfUrl) return;
    setIsLoadingPdf(true);
    setIsPdfDialogOpen(true);
    if (title) setDialogTitle(title);
    
    const result = await getSignedUrlForPdf(pdfUrl);
    if (result.success && result.url) {
        setPdfSrc(result.url);
    } else {
        toast({ variant: "destructive", title: "Error", description: result.message });
        setIsPdfDialogOpen(false);
    }
    setIsLoadingPdf(false);
  };
  
  const handleDownload = async (url:string) => {
      const result = await getSignedUrlForPdf(url);
      if (result.success && result.url) {
          const link = document.createElement("a");
          link.href = result.url;
          link.target = "_blank";
          link.download = url.split("/").pop() || 'download';
          link.click();
      } else {
        toast({ variant: "destructive", title: "Error", description: "Could not generate download link."});
      }
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
                        <div key={partKey}>
                            <h3 className="text-base md:text-lg font-bold mb-3 text-primary border-b pb-1">{partData.name}</h3>
                             <Accordion type="single" collapsible className="w-full space-y-2">
                                {partData.chapters.map((chapter, chapterIndex) => (
                                    <Card key={chapterIndex} className="transition-all duration-300">
                                        <AccordionItem value={`chapter-${chapterIndex}`} className="border-b-0">
                                            <AccordionTrigger className="p-3 md:p-4 font-medium text-sm md:text-base text-foreground text-left hover:no-underline">
                                               {chapter.name}
                                            </AccordionTrigger>
                                            <AccordionContent>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                {chapter.topics?.map((topic, index) => {
                                                    const topicCards = [
                                                        { pdfs: [is_note ? topic.notePdfUrl_en : topic.pdfUrl_en], label: is_note ? `Notes (Eng)` : `NCERT Solution (Eng)`, is_download: true },
                                                        { pdfs: [is_note ? topic.notePdfUrl_hi : topic.pdfUrl_hi], label: is_note ? `Notes (Hi)` : `NCERT Solution (Hi)`, is_download: true },
                                                        { pdfs: [is_note ? topic.notePdfUrl_en_demo : topic.pdfUrl_en_demo], label: `Premium (Eng)`, is_download: false },
                                                        { pdfs: [is_note ? topic.notePdfUrl_hi_demo : topic.pdfUrl_hi_demo], label: `Premium (Hi)`, is_download: false },
                                                    ];
                                                    return (
                                                        <div key={index} className="bg-white shadow-md rounded-lg p-3 space-y-2">
                                                            <p className="text-gray-700 text-sm font-semibold truncate">{topic.name}</p>
                                                            <div className="grid grid-cols-1 gap-1">
                                                            {topicCards.map((card, i) => {
                                                                const availablePdf = card.pdfs.find((pdf) => pdf && pdf.trim() !== "");
                                                                const hasPdf = !!availablePdf;
                                                                return (
                                                                     <div key={`${index}-${i}`} className="flex items-center justify-between p-1 rounded-md bg-muted/50">
                                                                        <p className="text-xs font-medium text-gray-500">{card.label}</p>
                                                                        <div className="flex items-center">
                                                                            <Button variant="ghost" size="icon" className="h-7 w-7 text-blue-500" disabled={!hasPdf} onClick={() => hasPdf && handleViewPdf(availablePdf, `${topic.name} - ${card.label}`)}><Eye size={16} /></Button>
                                                                            {card.is_download ? (
                                                                                <Button variant="ghost" size="icon" className="h-7 w-7 text-green-500" disabled={!hasPdf} onClick={() => hasPdf && handleDownload(availablePdf)}><Download size={16} /></Button>
                                                                            ) : (
                                                                                <Button asChild variant="ghost" size="icon" className="h-7 w-7 text-yellow-500"><Link href="/store"><ShoppingCart size={16} /></Link></Button>
                                                                            )}
                                                                        </div>
                                                                     </div>
                                                                );
                                                            })}
                                                            </div>
                                                        </div>
                                                    )
                                                })}
                                                </div>
                                            </AccordionContent>
                                        </AccordionItem>
                                    </Card>
                                ))}
                            </Accordion>
                        </div>
                    ))
            ) : subject.chapters && subject.chapters.length > 0 ? (
                <Accordion type="single" collapsible className="w-full space-y-2">
                    {subject.chapters.map((chapter, chapterIndex) => (
                        <Card key={chapterIndex} className="transition-all duration-300">
                             <AccordionItem value={`chapter-${chapterIndex}`} className="border-b-0">
                                <AccordionTrigger className="p-3 md:p-4 font-medium text-sm md:text-base text-foreground text-left hover:no-underline">
                                    {chapter.name}
                                </AccordionTrigger>
                                <AccordionContent>
                                     <ChapterResources chapter={chapter} onViewPdf={(url) => handleViewPdf(url, chapter.name)}/>
                                </AccordionContent>
                            </AccordionItem>
                        </Card>
                    ))}
                </Accordion>
            ) : (
                <p className="text-muted-foreground p-4 text-center">No content available for this subject yet.</p>
            )}
        </div>
    );
};

  return (
    <>
        {renderSubjectContent(resources)}
        <Dialog open={isPdfDialogOpen} onOpenChange={setIsPdfDialogOpen}>
             <DialogContent className="max-w-4xl h-[90vh] p-2">
                <DialogHeader className="p-2">
                    <DialogTitle className="truncate">{dialogTitle}</DialogTitle>
                </DialogHeader>
                {isLoadingPdf || !pdfSrc ? (
                    <div className="flex items-center justify-center h-full">
                        <p>Loading PDF...</p>
                    </div>
                ) : (
                    <iframe src={pdfSrc} className="w-full h-full rounded-md" />
                )}
            </DialogContent>
        </Dialog>
    </>
  );
}
