
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

const class12EnglishResources = {
  books: [
    {
      name: "Flamingo",
      lang: "en",
      chapters: [
        { name: "Chapter 1: The Last Lesson", slug: "the-last-lesson" },
        { name: "Chapter 2: Lost Spring", slug: "lost-spring" },
        { name: "Chapter 3: Deep Water", slug: "deep-water" },
        { name: "Chapter 4: The Rattrap", slug: "the-rattrap" },
        { name: "Chapter 5: Indigo", slug: "indigo" },
        { name: "Chapter 6: Poets and Pancakes", slug: "poets-and-pancakes" },
        { name: "Chapter 7: The Interview", slug: "the-interview" },
        { name: "Chapter 8: Going Places", slug: "going-places" },
      ],
    },
    {
      name: "Vistas",
      lang: "en",
      chapters: [
        { name: "Chapter 1: The Third Level", slug: "the-third-level" },
        { name: "Chapter 2: The Tiger King", slug: "the-tiger-king" },
        { name: "Chapter 3: Journey to the end of the Earth", slug: "journey-to-the-end-of-the-earth" },
        { name: "Chapter 4: The Enemy", slug: "the-enemy" },
        { name: "Chapter 5: On the face of It", slug: "on-the-face-of-it" },
        { name: "Chapter 6: Memories of Childhood", slug: "memories-of-childhood" },
      ],
    },
  ],
};

const ResourceLinks = () => (
    <div className="grid grid-cols-2 gap-2 pt-2">
      <div className="flex items-center justify-between p-1 rounded-md bg-muted/50">
        <span className="text-xs font-medium">NCERT Solutions (EN)</span>
        <div className="flex items-center">
          <Button asChild variant="ghost" size="icon" className="h-7 w-7">
            <Link href="#"><Eye className="h-4 w-4" /></Link>
          </Button>
          <Button asChild variant="ghost" size="icon" className="h-7 w-7">
            <Link href="#"><Download className="h-4 w-4" /></Link>
          </Button>
        </div>
      </div>
      <div className="flex items-center justify-between p-1 rounded-md bg-muted/50">
        <span className="text-xs font-medium">NCERT Solutions (HI)</span>
        <div className="flex items-center">
          <Button asChild variant="ghost" size="icon" className="h-7 w-7">
            <Link href="#"><Eye className="h-4 w-4" /></Link>
          </Button>
          <Button asChild variant="ghost" size="icon" className="h-7 w-7">
            <Link href="#"><Download className="h-4 w-4" /></Link>
          </Button>
        </div>
      </div>
      <div className="flex items-center justify-between p-1 rounded-md bg-muted/50">
        <span className="text-xs font-medium">Important Q's (EN)</span>
        <div className="flex items-center">
          <Button asChild variant="ghost" size="icon" className="h-7 w-7">
            <Link href="#"><Eye className="h-4 w-4" /></Link>
          </Button>
          <Button asChild variant="ghost" size="icon" className="h-7 w-7">
            <Link href="#"><ShoppingCart className="w-4 h-4" /></Link>
          </Button>
        </div>
      </div>
      <div className="flex items-center justify-between p-1 rounded-md bg-muted/50">
        <span className="text-xs font-medium">Important Q's (HI)</span>
        <div className="flex items-center">
          <Button asChild variant="ghost" size="icon" className="h-7 w-7">
            <Link href="#"><Eye className="h-4 w-4" /></Link>
          </Button>
          <Button asChild variant="ghost" size="icon" className="h-7 w-7">
            <Link href="#"><ShoppingCart className="w-4 w-4" /></Link>
          </Button>
        </div>
      </div>
    </div>
);

export default function Class12EnglishPage() {

  const contents = (
    <div>
        <div className="space-y-4 md:space-y-6">
          <Accordion type="multiple" className="w-full space-y-2">
            {class12EnglishResources.books.map((book, bookIndex) => (
              <AccordionItem value={`book-${bookIndex}`} key={bookIndex} className="border-b-0">
                  <Card className="transition-all duration-300">
                    <AccordionTrigger className="p-3 md:p-4 text-base md:text-lg font-semibold hover:no-underline text-black">{book.name}</AccordionTrigger>
                    <AccordionContent className="p-4 pt-0">
                      <div className="space-y-2">
                      {book.chapters.map((chapter, chapterIndex) => (
                          <Card key={chapterIndex} className="transition-all duration-300">
                            <Accordion type="single" collapsible>
                              <AccordionItem value={`chapter-${chapterIndex}`} className="border-b-0">
                                <AccordionTrigger className="p-3 md:p-4 font-medium text-sm md:text-base text-black text-left hover:no-underline">
                                  {chapter.name}
                                </AccordionTrigger>
                                <AccordionContent className="p-4 pt-0">
                                  <ResourceLinks />
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
              <CardTitle className="text-2xl font-bold">Class 12 | English | CBSE</CardTitle>
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
