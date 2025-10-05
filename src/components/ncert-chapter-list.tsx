
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


const ViewPdfButton = ({ pdfUrl }: { pdfUrl: string }) => {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [pdfSrc, setPdfSrc] = useState<string | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleViewPdf = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!pdfUrl) return;
        setIsLoading(true);
        setIsDialogOpen(true); // Open dialog immediately
        const result = await getSignedUrlForPdf(pdfUrl);
        if (result.success && result.url) {
            setPdfSrc(result.url);
        } else {
            toast({ variant: "destructive", title: "Error", description: result.message });
            setIsDialogOpen(false); // Close dialog on error
        }
        setIsLoading(false);
    };

    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-7 w-7 text-blue-500 hover:text-blue-700 transition" onClick={handleViewPdf} disabled={isLoading}>
                    <Eye className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl h-[90vh] p-2">
                <DialogHeader className="sr-only">
                    <DialogTitle>PDF Viewer</DialogTitle>
                </DialogHeader>
                {isLoading || !pdfSrc ? (
                    <div className="flex items-center justify-center h-full">
                        <p>Loading PDF...</p>
                    </div>
                ) : (
                    <iframe src={pdfSrc} className="w-full h-full rounded-md" />
                )}
            </DialogContent>
        </Dialog>
    );
};

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

const ChapterResources = ({ chapter }: { chapter: TChapter }) => {
    return (
        <div className="space-y-2 py-2 px-4">
            {chapter.longNotePdfUrl && (
                <div className="flex items-center justify-between p-1 rounded-md bg-muted/50">
                    <span className="text-xs font-medium text-gray-500">NCERT Solutions (EN)</span>
                    <div className="flex items-center">
                        <ViewPdfButton pdfUrl={chapter.longNotePdfUrl} />
                        <DownloadPdfButton pdfUrl={chapter.longNotePdfUrl} />
                    </div>
                </div>
            )}
            {chapter.shortNotePdfUrl && (
                <div className="flex items-center justify-between p-1 rounded-md bg-muted/50">
                    <span className="text-xs font-medium text-gray-500">Important Q's (EN)</span>
                    <div className="flex items-center">
                        <ViewPdfButton pdfUrl={chapter.shortNotePdfUrl} />
                        <Button asChild variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground">
                            <Link href="/store"><ShoppingCart className="w-4 h-4" /></Link>
                        </Button>
                    </div>
                </div>
            )}
        </div>
    )
};


const renderSubjectContent = (subject: TSubject | null, is_note: boolean) => {
    if (!subject) {
        return <p className="text-muted-foreground p-4 text-center">No content available for this subject yet.</p>;
    }
    const handleDownload = (url:string) => {
        const link = document.createElement("a");
        link.href = url;
        link.download = url.split("/").pop() || 'download';
        link.click();
      };
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
                                                    const cards = [
                                                        {
                                                            pdfs: [is_note ? topic.notePdfUrl_en : topic.pdfUrl_en],
                                                            label: is_note ? `${topic.name} (Eng)` : `${topic.name} (Eng)`,
                                                            is_download: true,
                                                          },
                                                          {
                                                            pdfs: [is_note ? topic.notePdfUrl_hi : topic.pdfUrl_hi],
                                                            label: is_note ? `${topic.name} (Hi)` : `${topic.name} (Hi)`,
                                                            is_download: true,
                                                          },
                                                          {
                                                        pdfs: is_note
                                                          ? [topic.notePdfUrl_en_demo, topic.notePdfUrl_en_primum]
                                                          : [topic.pdfUrl_en_demo, topic.pdfUrl_en_primum],
                                                        label: is_note
                                                          ? `Premium Notes (Eng)`
                                                          : `Important Q's (Eng)`,
                                                        is_download: false,
                                                      },
                                                      {
                                                        pdfs: is_note
                                                          ? [topic.notePdfUrl_hi_demo, topic.notePdfUrl_hi_primum]
                                                          : [topic.pdfUrl_hi_demo, topic.pdfUrl_hi_primum],
                                                        label: is_note
                                                          ? `Premium Notes (Hi)`
                                                          : `Important Q's (Hi)`,
                                                        is_download: false,
                                                      }
                                                    ];

                                                    return cards.map((card, i) => {
                                                    const availablePdf = card.pdfs.find((pdf) => pdf && pdf.trim() !== "");
                                                    const hasPdf = !!availablePdf;

                                                    return (
                                                        <div
                                                        key={`${index}-${i}`}
                                                        className="bg-white shadow-md rounded-lg p-4 flex items-center justify-between hover:shadow-lg transition-all duration-300"
                                                        >
                                                        {/* Left side: Topic name */}
                                                        <p className="text-gray-700 text-sm font-medium">{card.label}</p>

                                                        {/* Right side: Icons */}
                                                        <div className="flex items-center space-x-3">
                                                            {hasPdf ? (
                                                            <ViewPdfButton pdfUrl={availablePdf!} />
                                                            ) : (
                                                            <span title="PDF not available" className="text-gray-400 cursor-not-allowed">
                                                                <Eye size={20} />
                                                            </span>
                                                            )}

                                                            {card.is_download && (
                                                                <button
                                                                    onClick={hasPdf ? () => handleDownload(availablePdf!) : undefined}
                                                                    disabled={!hasPdf}
                                                                    title="Download"
                                                                    className={`text-green-500 hover:text-green-700 transition ${!hasPdf ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                                >
                                                                    <Download size={20} />
                                                                </button>
                                                            )}


                                                            {!card.is_download && (
                                                            <button
                                                                title="Add to Cart"
                                                                className="text-yellow-500 hover:text-yellow-700 transition"
                                                                onClick={() => alert(`${topic.name} added to cart!`)}
                                                            >
                                                                <ShoppingCart size={20} />
                                                            </button>
                                                            )}
                                                        </div>
                                                        </div>
                                                    );
                                                    });
                                                })}
                                                </div>


                                                {/* <ChapterResources chapter={chapter} /> */}
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
                                     <ChapterResources chapter={chapter} />
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


export function NcertChapterList({ resources, is_note }: { resources: TSubject | null, is_note?: boolean }) {
  const contents = renderSubjectContent(resources, is_note);

  return (
    <>
        {contents}
    </>
  );
}

    