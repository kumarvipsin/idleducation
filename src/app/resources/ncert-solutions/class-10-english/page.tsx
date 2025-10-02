
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, BookOpen, ChevronRight, Eye, Download, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionTrigger, AccordionContent, AccordionItem } from "@/components/ui/accordion";

const class10EnglishResources = {
  books: [
    {
      name: "First Flight",
      lang: "en",
      chapters: [
        { name: "Chapter 1: A Letter to God", slug: "a-letter-to-god", topics: [{ name: "About the Author" }, { name: "Summary" }, { name: "Character Sketch" }] },
        { name: "Chapter 2: Nelson Mandela: Long Walk to Freedom", slug: "nelson-mandela-long-walk-to-freedom", topics: [{ name: "About the Author" }, { name: "Summary" }] },
        { name: "Chapter 3: Two Stories about Flying", slug: "two-stories-about-flying", topics: [{ name: "His First Flight" }, { name: "Black Aeroplane" }] },
      ],
    },
    {
      name: "Footprints Without Feet",
      lang: "en",
      chapters: [
        { name: "Chapter 1: A Triumph of Surgery", slug: "a-triumph-of-surgery", topics: [{ name: "Summary" }, { name: "Character Sketch" }] },
        { name: "Chapter 2: The Thief's Story", slug: "the-thiefs-story", topics: [{ name: "About the Author" }, { name: "Summary" }] },
        { name: "Chapter 3: The Midnight Visitor", slug: "the-midnight-visitor", topics: [{ name: "Summary" }] },
      ],
    },
  ],
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

export default function Class10EnglishPage() {
  
  const contents = (
    <div>
        <div className="space-y-4 md:space-y-6">
          <Accordion type="multiple" className="w-full space-y-2">
            {class10EnglishResources.books.map((book, bookIndex) => (
              <AccordionItem value={`book-${bookIndex}`} key={bookIndex} className="border-b-0">
                  <Card className="transition-all duration-300">
                    <AccordionTrigger className="p-3 md:p-4 text-base md:text-lg font-semibold hover:no-underline">{book.name}</AccordionTrigger>
                    <AccordionContent className="p-4 pt-0">
                      <div className="space-y-2">
                      {book.chapters.map((chapter, chapterIndex) => (
                          <Card key={chapterIndex} className="transition-all duration-300">
                            <Accordion type="single" collapsible>
                              <AccordionItem value={`chapter-${chapterIndex}`} className="border-b-0">
                                <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-3 md:p-4 group">
                                  <AccordionTrigger className="font-medium text-sm md:text-base text-foreground/90 mb-2 md:mb-0 text-left hover:no-underline">{chapter.name}</AccordionTrigger>
                                  <div className="flex items-center gap-2 w-full md:w-auto">
                                    <Button asChild variant="ghost" size="icon" className="h-8 w-8">
                                      <Link href="#"><Eye className="h-4 w-4" /></Link>
                                    </Button>
                                    <Button asChild variant="ghost" size="icon" className="h-8 w-8">
                                      <Link href="#"><Download className="h-4 w-4" /></Link>
                                    </Button>
                                    <Button asChild variant="ghost" size="icon" className="h-8 w-8">
                                      <Link href="#"><ShoppingCart className="w-4 h-4" /></Link>
                                    </Button>
                                  </div>
                                </div>
                                <AccordionContent className="p-4 pt-0">
                                  <ContentTree items={chapter.topics || []} />
                                </AccordionContent>
                              </AccordionItem>
                            </Accordion>
                          </Card>
                      ))}
                      </div>
                    </AccordionContent>
                  </Card>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
    </div>
  );

  return (
    <Card className="shadow-lg overflow-hidden border-t-8 border-purple-700">
        <div className="bg-gradient-to-r from-purple-500 to-violet-600 text-white p-4">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-3 rounded-full">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold">Class 10 | English | CBSE</CardTitle>
            </div>
          </div>
        </div>
        <CardContent className="p-4 md:p-6">
          <h2 className="text-xl md:text-2xl font-bold mb-4 text-foreground pb-2 bg-gradient-to-r from-red-500 from-50% to-primary to-50% bg-no-repeat bg-bottom inline-block" style={{ backgroundSize: '100% 2px' }}>Contents</h2>
          {contents}
        </CardContent>
    </Card>
  );
}
