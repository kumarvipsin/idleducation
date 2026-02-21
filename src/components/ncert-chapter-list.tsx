'use client';

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";
import { ChevronRight, Download, ShoppingCart, Eye, FileText } from "lucide-react";
import type { TSubject, TChapter } from "@/app/actions/types";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";
import { useToast } from "@/hooks/use-toast";
import { getSignedUrlForPdf } from "@/app/actions";
import { PdfViewerDialog } from "./pdf-viewer-dialog";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

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
        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary transition-colors" onClick={handleDownload} disabled={isLoading}>
            <Download className="h-4 w-4" />
        </Button>
    );
}

const ChapterResources = ({ chapter, onViewPdf, is_note }: { chapter: TChapter; onViewPdf: (url: string, label: string) => void; is_note?: boolean; }) => {
    const router = useRouter();
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
            {chapter.longNotePdfUrl && (
                <div className="group flex items-center justify-between p-4 rounded-xl bg-slate-50 hover:bg-slate-100 border border-transparent hover:border-primary/10 transition-all duration-300">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/5 rounded-lg text-primary group-hover:scale-110 transition-transform">
                            <FileText className="w-4 h-4" />
                        </div>
                        <span className="text-sm font-bold text-foreground/80">{is_note ? 'NCERT Notes (English)' : 'NCERT Solutions (English)'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 hover:bg-blue-50" onClick={() => onViewPdf(chapter.longNotePdfUrl!, is_note ? 'NCERT Notes (English)' : 'NCERT Solutions (English)')}>
                            <Eye className="h-4 w-4" />
                        </Button>
                        <DownloadPdfButton pdfUrl={chapter.longNotePdfUrl} />
                    </div>
                </div>
            )}
            {chapter.shortNotePdfUrl && (
                <div className="group flex items-center justify-between p-4 rounded-xl bg-slate-50 hover:bg-slate-100 border border-transparent hover:border-primary/10 transition-all duration-300">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-orange-500/5 rounded-lg text-orange-600 group-hover:scale-110 transition-transform">
                            <ShoppingCart className="w-4 h-4" />
                        </div>
                        <span className="text-sm font-bold text-foreground/80">Important Q's (English)</span>
                    </div>
                    <div className="flex items-center gap-1">
                         <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 hover:bg-blue-50" onClick={() => onViewPdf(chapter.shortNotePdfUrl!, 'Important Q\'s (English)')}>
                            <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-orange-600 hover:bg-orange-50" onClick={() => router.push('/store')}>
                            <ShoppingCart className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    )
};

export function NcertChapterList({ resources, is_note }: { resources: TSubject | null, is_note?: boolean }) {
  const { toast } = useToast();
  const router = useRouter();
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
        return <p className="text-muted-foreground p-12 text-center font-bold italic">No content available for this subject yet.</p>;
    }
    const hasParts = subject.parts && Object.keys(subject.parts).length > 0;
    return (
         <div className="space-y-8">
            {hasParts ? (
                Object.entries(subject.parts)
                    .sort(([, a], [, b]) => (a.order || 99) - (b.order || 99))
                    .map(([partKey, partData]) => (
                        <div key={partKey} className="space-y-4">
                            <div className="flex items-center gap-3 border-l-4 border-primary pl-4">
                                <h3 className="text-lg md:text-xl font-black text-foreground tracking-tight">Content</h3>
                            </div>
                             <Accordion type="single" collapsible className="w-full space-y-3">
                                {partData.chapters.map((chapter, chapterIndex) => (
                                    <Card key={chapterIndex} className="overflow-hidden border-muted-foreground/10 hover:border-primary/30 transition-colors shadow-sm bg-white">
                                        <AccordionItem value={`chapter-${chapterIndex}`} className="border-b-0">
                                            <AccordionTrigger className="p-4 md:p-5 font-extrabold text-sm md:text-base text-foreground text-left hover:no-underline group">
                                               <span className="group-hover:text-primary transition-colors">{chapter.name}</span>
                                            </AccordionTrigger>
                                            <AccordionContent>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 px-4 pb-4">
                                                {chapter.topics?.map((topic, index) => {
                                                    const allCards = [
                                                          {
                                                            pdfs: [is_note ? topic.notePdfUrl_en : topic.pdfUrl_en],
                                                            label: is_note ? 'NCERT Notes (English)' : 'NCERT Solutions (English)',
                                                            is_download: true,
                                                            theme: 'blue'
                                                          },
                                                          {
                                                            pdfs: [is_note ? topic.notePdfUrl_hi : topic.pdfUrl_hi],
                                                            label: is_note ? 'NCERT Notes (Hindi)' : 'NCERT Solutions (Hindi)',
                                                            is_download: true,
                                                            theme: 'emerald'
                                                          },
                                                          {
                                                            pdfs: [topic.notePdfUrl_en_demo, topic.notePdfUrl_en_primum],
                                                            label: `Premium Notes (English)`,
                                                            is_download: false,
                                                            theme: 'orange'
                                                          },
                                                          {
                                                            pdfs: [topic.notePdfUrl_hi_demo, topic.notePdfUrl_hi_primum],
                                                            label: `Premium Notes (Hindi)`,
                                                            is_download: false,
                                                            theme: 'orange'
                                                          }
                                                    ];

                                                    const cards = is_note ? allCards : allCards.slice(0, 2);

                                                    return cards.map((card, i) => {
                                                    const availablePdf = card.pdfs.find((pdf) => pdf && pdf.trim() !== "");
                                                    const hasPdf = !!availablePdf;

                                                    return (
                                                        <div
                                                        key={`${index}-${i}`}
                                                        className="group flex items-center justify-between p-4 rounded-xl bg-slate-50 hover:bg-slate-100 border border-transparent hover:border-primary/10 transition-all duration-300"
                                                        >
                                                            <div className="flex items-center gap-3">
                                                                <div className={cn(
                                                                    "p-2 rounded-lg transition-transform group-hover:scale-110",
                                                                    card.theme === 'blue' ? "bg-blue-500/5 text-blue-600" : 
                                                                    card.theme === 'emerald' ? "bg-emerald-500/5 text-emerald-600" :
                                                                    "bg-orange-500/5 text-orange-600"
                                                                )}>
                                                                    <FileText className="w-4 h-4" />
                                                                </div>
                                                                <p className="text-[11px] font-bold text-foreground/80">{card.label}</p>
                                                            </div>

                                                            <div className="flex items-center gap-1">
                                                                {hasPdf ? (
                                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 hover:bg-blue-50" onClick={() => handleViewPdf(availablePdf, `${topic.name} - ${card.label}`)}>
                                                                        <Eye className="h-4 w-4" />
                                                                    </Button>
                                                                ) : (
                                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground opacity-30 cursor-not-allowed" disabled>
                                                                        <Eye className="h-4 w-4" />
                                                                    </Button>
                                                                )}

                                                                {card.is_download ? (
                                                                    <Button 
                                                                        variant="ghost" 
                                                                        size="icon" 
                                                                        className={cn("h-8 w-8 transition-all", hasPdf ? "text-emerald-600 hover:bg-emerald-50" : "text-muted-foreground opacity-30")}
                                                                        onClick={hasPdf ? () => handleDownload(availablePdf) : undefined}
                                                                        disabled={!hasPdf}
                                                                    >
                                                                        <Download className="h-4 w-4" />
                                                                    </Button>
                                                                ) : (
                                                                    <Button 
                                                                        variant="ghost" 
                                                                        size="icon" 
                                                                        className="h-8 w-8 text-orange-600 hover:bg-orange-50"
                                                                        onClick={() => router.push('/store')}
                                                                    >
                                                                        <ShoppingCart className="h-4 w-4" />
                                                                    </Button>
                                                                )}
                                                            </div>
                                                        </div>
                                                    );
                                                    });
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
                <Accordion type="single" collapsible className="w-full space-y-3">
                    {subject.chapters.map((chapter, chapterIndex) => (
                        <Card key={chapterIndex} className="overflow-hidden border-muted-foreground/10 hover:border-primary/30 transition-colors shadow-sm bg-white">
                             <AccordionItem value={`chapter-${chapterIndex}`} className="border-b-0">
                                <AccordionTrigger className="p-4 md:p-5 font-extrabold text-sm md:text-base text-foreground text-left hover:no-underline group">
                                    <span className="group-hover:text-primary transition-colors">{chapter.name}</span>
                                </AccordionTrigger>
                                <AccordionContent>
                                     <ChapterResources chapter={chapter} onViewPdf={(url, label) => handleViewPdf(url, `${chapter.name} - ${label}`)} is_note={is_note} />
                                </AccordionContent>
                            </AccordionItem>
                        </Card>
                    ))}
                </Accordion>
            ) : (
                <p className="text-muted-foreground p-12 text-center font-bold italic">No content available for this subject yet.</p>
            )}
        </div>
    );
};

  return (
    <>
        {renderSubjectContent(resources)}
        <PdfViewerDialog
          isOpen={isPdfDialogOpen}
          onOpenChange={setIsPdfDialogOpen}
          pdfSrc={pdfSrc}
          isLoading={isLoadingPdf}
          title={dialogTitle}
        />
    </>
  );
}
