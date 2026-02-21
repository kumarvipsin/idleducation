'use client';

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Download, ShoppingCart, Eye, FileText, Folder, Plus, Minus } from "lucide-react";
import type { TSubject, TChapter } from "@/app/actions/types";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";
import { useToast } from "@/hooks/use-toast";
import { getSignedUrlForPdf } from "@/app/actions";
import { PdfViewerDialog } from "./pdf-viewer-dialog";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

/**
 * A playful fallback component for missing resources.
 */
const EmptyResourceMessage = ({ compact = false }: { compact?: boolean }) => (
    <div className={cn(
        "flex flex-col items-center justify-center text-center space-y-3 bg-muted/5 rounded-2xl border border-dashed border-muted-foreground/20 animate-fade-in-up",
        compact ? "py-6 px-4" : "py-12 px-6 m-4"
    )}>
        <div className="relative">
            <div className="text-4xl animate-float">🕵️‍♂️</div>
            <div className="absolute -top-1 -right-1 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </div>
        </div>
        <div className="space-y-1">
            <p className="text-[10px] font-black text-foreground uppercase tracking-tight">PDF is Playing Hide & Seek!</p>
            <p className="text-[10px] text-muted-foreground font-bold leading-relaxed max-w-[220px]">
                Our digital scholars are still transcribing these ancient scrolls. Check back soon for the wisdom! ✨
            </p>
        </div>
    </div>
);

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
    
    const availableResources = [];
    
    // 1. Solution/Note (English)
    if (chapter.longNotePdfUrl && chapter.longNotePdfUrl.trim() !== "") {
        availableResources.push({
            url: chapter.longNotePdfUrl,
            label: is_note ? 'NCERT Notes (English)' : 'NCERT Solutions (English)',
            theme: 'blue',
            is_download: true
        });
    }

    // 2. Premium Notes (Only for Revision Notes page)
    if (is_note && chapter.shortNotePdfUrl && chapter.shortNotePdfUrl.trim() !== "") {
        availableResources.push({
            url: chapter.shortNotePdfUrl,
            label: 'Premium Notes (English)',
            theme: 'orange',
            is_download: false
        });
    }

    if (availableResources.length === 0) {
        return <EmptyResourceMessage />;
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
            {availableResources.map((res, i) => (
                <div
                    key={i}
                    className="group flex items-center justify-between p-4 rounded-xl bg-slate-50 hover:bg-slate-100 border border-transparent hover:border-primary/10 transition-all duration-300 shadow-sm"
                >
                    <div className="flex items-center gap-3">
                        <div className={cn(
                            "p-2 rounded-lg transition-transform group-hover:scale-110",
                            res.theme === 'blue' ? "bg-blue-500/5 text-blue-600" : "bg-orange-500/5 text-orange-600"
                        )}>
                            <FileText className="w-4 h-4" />
                        </div>
                        <span className="text-[11px] font-black uppercase tracking-tight text-foreground/80">{res.label}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 hover:bg-blue-50" onClick={() => onViewPdf(res.url, res.label)}>
                            <Eye className="h-4 w-4" />
                        </Button>
                        {res.is_download ? (
                            <DownloadPdfButton pdfUrl={res.url} />
                        ) : (
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-orange-600 hover:bg-orange-50" onClick={() => router.push('/store')}>
                                <ShoppingCart className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                </div>
            ))}
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
  const [activeItem, setActiveItem] = useState<string | null>(null);
  
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

  const renderChapterItem = (chapter: TChapter, chapterIndex: number, partPrefix: string = "") => {
    const value = `${partPrefix}chapter-${chapterIndex}`;
    const isExpanded = activeItem === value;
    
    const parts = chapter.name.split('|');
    const chapterLabel = parts.length > 1 ? parts[0].trim() : `Chapter ${chapterIndex + 1}`;
    const chapterName = parts.length > 1 ? parts[1].trim() : chapter.name;

    return (
        <div key={chapterIndex} className="relative pt-6">
            <div className={cn(
                "absolute top-0 left-4 border border-b-0 border-primary/20 px-4 py-1 rounded-t-lg text-[10px] font-bold z-0 flex items-center gap-2 transition-all duration-300",
                isExpanded ? "bg-primary text-white" : "bg-primary/10 text-primary"
            )}>
                <div className={cn("w-1.5 h-1.5 rounded-full animate-pulse", isExpanded ? "bg-white" : "bg-primary")} />
                {chapterLabel}
            </div>

            <Card className={cn(
                "overflow-hidden border-muted-foreground/10 hover:border-primary/30 transition-all duration-300 shadow-sm bg-white relative z-10 rounded-lg",
                isExpanded && "ring-1 ring-primary/20"
            )}>
                <AccordionItem value={value} className="border-b-0">
                    <AccordionTrigger className="p-4 md:p-5 font-bold text-[13px] md:text-sm text-foreground text-left hover:no-underline group">
                        <span className="group-hover:text-primary transition-colors">{chapterName}</span>
                    </AccordionTrigger>
                    <AccordionContent>
                        <div className="px-4 pb-4">
                        {chapter.topics && chapter.topics.length > 0 ? (
                            chapter.topics.map((topic, topicIdx) => {
                                const allPossibleCards = [
                                    {
                                        pdf: is_note ? topic.notePdfUrl_en : topic.pdfUrl_en,
                                        label: is_note ? 'NCERT Notes (English)' : 'NCERT Solutions (English)',
                                        is_download: true,
                                        theme: 'blue'
                                    },
                                    {
                                        pdf: is_note ? topic.notePdfUrl_hi : topic.pdfUrl_hi,
                                        label: is_note ? 'NCERT Notes (Hindi)' : 'NCERT Solutions (Hindi)',
                                        is_download: true,
                                        theme: 'emerald'
                                    },
                                    {
                                        pdf: topic.notePdfUrl_en_demo || topic.notePdfUrl_en_primum,
                                        label: 'Premium Notes (English)',
                                        is_download: false,
                                        theme: 'orange',
                                        onlyShowIfNote: true
                                    },
                                    {
                                        pdf: topic.notePdfUrl_hi_demo || topic.notePdfUrl_hi_primum,
                                        label: 'Premium Notes (Hindi)',
                                        is_download: false,
                                        theme: 'orange',
                                        onlyShowIfNote: true
                                    }
                                ];

                                const filteredCards = allPossibleCards.filter(card => {
                                    if (card.onlyShowIfNote && !is_note) return false;
                                    return card.pdf && card.pdf.trim() !== "";
                                });

                                if (filteredCards.length === 0) {
                                    return <EmptyResourceMessage key={topicIdx} compact />;
                                }

                                return (
                                    <div key={topicIdx} className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 first:mt-0">
                                        {filteredCards.map((card, i) => (
                                            <div key={i} className="group flex items-center justify-between p-4 rounded-xl bg-slate-50 hover:bg-slate-100 border border-transparent hover:border-primary/10 transition-all duration-300">
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
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 hover:bg-blue-50" onClick={() => handleViewPdf(card.pdf!, `${topic.name} - ${card.label}`)}>
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                    {card.is_download ? (
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-emerald-600 hover:bg-emerald-50" onClick={() => handleDownload(card.pdf!)}>
                                                            <Download className="h-4 w-4" />
                                                        </Button>
                                                    ) : (
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-orange-600 hover:bg-orange-50" onClick={() => router.push('/store')}>
                                                            <ShoppingCart className="h-4 w-4" />
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                );
                            })
                        ) : (
                            <ChapterResources 
                                chapter={chapter} 
                                onViewPdf={(url, label) => handleViewPdf(url, `${chapter.name} - ${label}`)} 
                                is_note={is_note} 
                            />
                        )}
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Card>
        </div>
    );
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
                        <div key={partKey} className="space-y-6">
                            <div className="flex items-center gap-3 border-l-4 border-primary pl-4">
                                <h3 className="text-lg md:text-xl font-black text-foreground tracking-tight uppercase">CONTENTS</h3>
                            </div>
                             <Accordion type="single" collapsible value={activeItem || ""} onValueChange={setActiveItem} className="w-full space-y-6">
                                {partData.chapters.map((chapter, chapterIndex) => renderChapterItem(chapter, chapterIndex, partKey))}
                            </Accordion>
                        </div>
                    ))
            ) : subject.chapters && subject.chapters.length > 0 ? (
                <Accordion type="single" collapsible value={activeItem || ""} onValueChange={setActiveItem} className="w-full space-y-6">
                    {subject.chapters.map((chapter, chapterIndex) => renderChapterItem(chapter, chapterIndex))}
                </Accordion>
            ) : (
                <EmptyResourceMessage />
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
