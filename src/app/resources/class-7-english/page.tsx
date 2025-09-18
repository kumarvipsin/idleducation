
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, BookOpen, ChevronRight, Eye, Download, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

export default function Class7EnglishPage() {
  const [notesLang, setNotesLang] = useState<'en' | 'hi'>('en');
  const isMobile = useIsMobile();

  const allChapters = class7EnglishResources.books.flatMap(book => book.chapters);
  
  const contents = (
    <div>
        <h2 className="text-xl md:text-2xl font-bold mb-4 text-foreground lg:hidden">Contents</h2>
        <div className="space-y-4 md:space-y-6">
            {class7EnglishResources.books.map((book, bookIndex) => (
            <div key={bookIndex}>
                <h3 className="text-base md:text-lg font-semibold mb-3 text-foreground/80">{book.name}</h3>
                <div className="space-y-2">
                {book.chapters.map((chapter, chapterIndex) => (
                    <Card key={chapterIndex} className="transition-all duration-300 hover:shadow-md hover:bg-background/80 hover:border-primary/30">
                    <Link href={`/resources/notes-details/${chapter.slug}?lang=${book.lang}`} className="flex items-center justify-between p-3 md:p-4 group">
                        <span className="font-medium text-sm md:text-base text-foreground/90">{chapter.name}</span>
                        <ChevronRight className="w-5 h-5 text-muted-foreground transition-transform duration-300 group-hover:translate-x-1 group-hover:text-primary" />
                    </Link>
                    </Card>
                ))}
                </div>
            </div>
            ))}
        </div>
    </div>
  );

  const primumNotes = (
    <div>
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl md:text-2xl font-bold text-foreground">Primum Notes</h2>
        </div>
        <div className="space-y-2">
          {allChapters.map((chapter, index) => (
            <Card key={index} className="bg-background">
              <CardContent className="p-3 flex items-center justify-between">
                <p className="font-medium text-xs md:text-sm flex-1 pr-2">{chapter.name}</p>
                <div className="flex items-center gap-1 md:gap-2">
                    <Button asChild variant="ghost" size="sm">
                        <Link href="#">View</Link>
                    </Button>
                    <Button asChild variant="ghost" size="sm">
                        <Link href="#"><ShoppingCart className="w-4 h-4 mr-1"/>CART</Link>
                    </Button>
                </div>
              </CardContent>
            </Card>
          ))}
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
              <CardTitle className="text-2xl font-bold">Class 7 | English</CardTitle>
            </div>
          </div>
        </div>
        <CardContent className="p-4 md:p-6">
          {isMobile ? (
            <Tabs defaultValue="contents" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="contents">Contents</TabsTrigger>
                    <TabsTrigger value="notes">Primum Notes</TabsTrigger>
                </TabsList>
                <TabsContent value="contents" className="pt-4">{contents}</TabsContent>
                <TabsContent value="notes" className="pt-4">{primumNotes}</TabsContent>
            </Tabs>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 max-w-7xl mx-auto">
              <div className="lg:col-span-1">
                <h2 className="text-xl md:text-2xl font-bold mb-4 text-foreground">Contents</h2>
                {contents}
              </div>
              <div className="lg:col-span-1">
                {primumNotes}
              </div>
            </div>
          )}
        </CardContent>
    </Card>
  );
}
