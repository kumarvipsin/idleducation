
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

const class11EnglishResources = {
  books: [
    {
      name: "Hornbill",
      lang: "en",
      chapters: [
        { name: "Chapter 1: The Portrait of a Lady", slug: "the-portrait-of-a-lady" },
        { name: "Chapter 2: We’re Not Afraid to Die... if We Can All Be Together", slug: "we-are-not-afraid-to-die" },
        { name: "Chapter 3: Discovering Tut: the Saga Continues", slug: "discovering-tut" },
      ],
    },
    {
      name: "Snapshots",
      lang: "en",
      chapters: [
        { name: "Chapter 1: The Summer of the Beautiful White Horse", slug: "the-summer-of-the-beautiful-white-horse" },
        { name: "Chapter 2: The Address", slug: "the-address" },
        { name: "Chapter 3: Ranga’s Marriage", slug: "rangas-marriage" },
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
            <Link href="#"><ShoppingCart className="w-4 h-4" /></Link>
          </Button>
        </div>
      </div>
    </div>
);

export default function Class11EnglishPage() {

  const contents = (
    <div>
        <div className="space-y-4 md:space-y-6">
          <Accordion type="multiple" className="w-full space-y-2">
            {class11EnglishResources.books.map((book, bookIndex) => (
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
              <CardTitle className="text-2xl font-bold">Class 11 | English | CBSE</CardTitle>
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
