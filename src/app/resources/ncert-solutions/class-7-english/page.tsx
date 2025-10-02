
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

const class7EnglishResources = {
  books: [
    {
      name: "Honeycomb",
      lang: "en",
      chapters: [
        { name: "Chapter 1: Three Questions", slug: "c7-en-h-unit1" },
        { name: "Chapter 2: A Gift of Chappals", slug: "c7-en-h-unit2" },
        { name: "Chapter 3: Gopal and the Hilsa Fish", slug: "c7-en-h-unit3" },
        { name: "Chapter 4: The Ashes That Made Trees Bloom", slug: "c7-en-h-unit4" },
        { name: "Chapter 5: Quality", slug: "c7-en-h-unit5" },
      ],
    },
    {
      name: "An Alien Hand",
      lang: "en",
      chapters: [
        { name: "Chapter 1: The Tiny Teacher", slug: "c7-en-a-unit1" },
        { name: "Chapter 2: Bringing Up Kari", slug: "c7-en-a-unit2" },
        { name: "Chapter 3: The Desert", slug: "c7-en-a-unit3" },
      ],
    },
  ],
};

const ResourceLinks = () => (
    <div className="space-y-2 pt-2">
      <div className="flex items-center justify-between p-2 rounded-md bg-muted/50">
        <span className="text-sm font-medium">NCERT Solutions (English Medium)</span>
        <div className="flex items-center">
          <Button asChild variant="ghost" size="icon" className="h-8 w-8">
            <Link href="#"><Eye className="h-4 w-4" /></Link>
          </Button>
          <Button asChild variant="ghost" size="icon" className="h-8 w-8">
            <Link href="#"><Download className="h-4 w-4" /></Link>
          </Button>
        </div>
      </div>
      <div className="flex items-center justify-between p-2 rounded-md bg-muted/50">
        <span className="text-sm font-medium">NCERT Solutions (Hindi Medium)</span>
        <div className="flex items-center">
          <Button asChild variant="ghost" size="icon" className="h-8 w-8">
            <Link href="#"><Eye className="h-4 w-4" /></Link>
          </Button>
          <Button asChild variant="ghost" size="icon" className="h-8 w-8">
            <Link href="#"><Download className="h-4 w-4" /></Link>
          </Button>
        </div>
      </div>
      <div className="flex items-center justify-between p-2 rounded-md bg-muted/50">
        <span className="text-sm font-medium">Important Questions (English Medium)</span>
        <div className="flex items-center">
          <Button asChild variant="ghost" size="icon" className="h-8 w-8">
            <Link href="#"><Eye className="h-4 w-4" /></Link>
          </Button>
          <Button asChild variant="ghost" size="icon" className="h-8 w-8">
            <Link href="#"><ShoppingCart className="h-4 w-4" /></Link>
          </Button>
        </div>
      </div>
      <div className="flex items-center justify-between p-2 rounded-md bg-muted/50">
        <span className="text-sm font-medium">Important Questions (Hindi Medium)</span>
        <div className="flex items-center">
          <Button asChild variant="ghost" size="icon" className="h-8 w-8">
            <Link href="#"><Eye className="h-4 w-4" /></Link>
          </Button>
          <Button asChild variant="ghost" size="icon" className="h-8 w-8">
            <Link href="#"><ShoppingCart className="h-4 w-4" /></Link>
          </Button>
        </div>
      </div>
    </div>
);

export default function Class7EnglishPage() {

  const contents = (
    <div>
        <div className="space-y-4 md:space-y-6">
          <Accordion type="multiple" className="w-full space-y-2">
            {class7EnglishResources.books.map((book, bookIndex) => (
              <AccordionItem value={`book-${bookIndex}`} key={bookIndex} className="border-b-0">
                  <Card className="transition-all duration-300">
                    <AccordionTrigger className="p-3 md:p-4 text-base md:text-lg font-semibold hover:no-underline">{book.name}</AccordionTrigger>
                    <AccordionContent className="p-4 pt-0">
                      <div className="space-y-2">
                      {book.chapters.map((chapter, chapterIndex) => (
                          <Card key={chapterIndex} className="transition-all duration-300">
                            <Accordion type="single" collapsible>
                              <AccordionItem value={`chapter-${chapterIndex}`} className="border-b-0">
                                <AccordionTrigger className="p-3 md:p-4 font-medium text-sm md:text-base text-foreground/90 text-left hover:no-underline">
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
              <CardTitle className="text-2xl font-bold">Class 7 | English | CBSE</CardTitle>
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
