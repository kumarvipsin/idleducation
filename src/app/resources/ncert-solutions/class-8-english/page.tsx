
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

const class8EnglishResources = {
  books: [
    {
      name: "Honeydew",
      lang: "en",
      chapters: [
        { name: "Chapter 1: The Best Christmas Present in the World", slug: "c8-en-h-unit1" },
        { name: "Chapter 2: The Tsunami", slug: "c8-en-h-unit2" },
        { name: "Chapter 3: Glimpses of the Past", slug: "c8-en-h-unit3" },
        { name: "Chapter 4: Bepin Choudhury’s Lapse of Memory", slug: "c8-en-h-unit4" },
      ],
    },
    {
      name: "It So Happened",
      lang: "en",
      chapters: [
        { name: "Chapter 1: How the Camel got his Hump", slug: "c8-en-i-unit1" },
        { name: "Chapter 2: Children at Work", slug: "c8-en-i-unit2" },
        { name: "Chapter 3: The Selfish Giant", slug: "c8-en-i-unit3" },
      ],
    },
  ],
};

export default function Class8EnglishPage() {

  const contents = (
    <div>
        <div className="space-y-4 md:space-y-6">
          <Accordion type="multiple" className="w-full space-y-2">
            {class8EnglishResources.books.map((book, bookIndex) => (
              <AccordionItem value={`book-${bookIndex}`} key={bookIndex} className="border-b-0">
                  <Card className="transition-all duration-300">
                    <AccordionTrigger className="p-3 md:p-4 text-base md:text-lg font-semibold hover:no-underline">{book.name}</AccordionTrigger>
                    <AccordionContent className="p-4 pt-0">
                      <div className="space-y-2">
                      {book.chapters.map((chapter, chapterIndex) => (
                          <Card key={chapterIndex} className="transition-all duration-300 hover:shadow-md hover:bg-background/80 hover:border-primary/30">
                            <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-3 md:p-4 group">
                              <span className="font-medium text-sm md:text-base text-foreground/90 mb-2 md:mb-0">{chapter.name}</span>
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
              <CardTitle className="text-2xl font-bold">Class 8 | English | CBSE</CardTitle>
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
