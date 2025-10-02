
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, BookOpen, ChevronRight, Eye, Download, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const class9EnglishResources = {
  books: [
    {
      name: "Beehive",
      lang: "en",
      chapters: [
        { name: "Chapter 1: The Fun They Had", slug: "the-fun-they-had" },
        { name: "Chapter 2: The Sound of Music", slug: "the-sound-of-music" },
        { name: "Chapter 3: The Little Girl", slug: "the-little-girl" },
      ],
    },
    {
      name: "Moments",
      lang: "en",
      chapters: [
        { name: "Chapter 1: The Lost Child", slug: "the-lost-child" },
        { name: "Chapter 2: The Adventures of Toto", slug: "the-adventures-of-toto" },
        { name: "Chapter 3: Iswaran the Storyteller", slug: "iswaran-the-storyteller" },
      ],
    },
  ],
};

export default function Class9EnglishPage() {

  const contents = (
    <div>
      <h2 className="text-xl md:text-2xl font-bold mb-4 text-foreground pb-2 bg-gradient-to-r from-red-500 from-50% to-primary to-50% bg-no-repeat bg-bottom inline-block" style={{ backgroundSize: '100% 2px' }}>Contents</h2>
        <div className="space-y-4 md:space-y-6">
          {class9EnglishResources.books.map((book, bookIndex) => (
            <div key={bookIndex}>
              <h3 className="text-base md:text-lg font-bold mb-3 text-primary border-b pb-1">{book.name}</h3>
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

  return (
    <Card className="shadow-lg overflow-hidden border-t-8 border-purple-700">
        <div className="bg-gradient-to-r from-purple-500 to-violet-600 text-white p-4">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-3 rounded-full">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold">Class 9 | English | CBSE</CardTitle>
            </div>
          </div>
        </div>
        <CardContent className="p-4 md:p-6">
            {contents}
        </CardContent>
    </Card>
  );
}
