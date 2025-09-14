
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, BookOpen, ChevronRight, Eye, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";

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

export default function Class12EnglishPage() {
  const [notesLang, setNotesLang] = useState<'en' | 'hi'>('en');

  const allChapters = class12EnglishResources.books.flatMap(book => book.chapters);
    
  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <Card className="shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-purple-500 to-violet-600 text-white p-4">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-3 rounded-full">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold">Class 12 | English</CardTitle>
            </div>
          </div>
        </div>
        <CardContent className="p-6 bg-muted/20">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-3">
              <h2 className="text-2xl font-bold mb-4 text-foreground">Contents</h2>
              <div className="space-y-6">
                {class12EnglishResources.books.map((book, bookIndex) => (
                  <div key={bookIndex}>
                    <h3 className="text-lg font-semibold mb-3 text-foreground/80">{book.name}</h3>
                    <div className="space-y-2">
                      {book.chapters.map((chapter, chapterIndex) => (
                        <Card key={chapterIndex} className="transition-all duration-300 hover:shadow-md hover:bg-background/80 hover:border-primary/30">
                          <Link href={`/resources/notes-details/${chapter.slug}?lang=${book.lang}`} className="flex items-center justify-between p-4 group">
                            <span className="font-medium text-foreground/90">{chapter.name}</span>
                            <ChevronRight className="w-5 h-5 text-muted-foreground transition-transform duration-300 group-hover:translate-x-1 group-hover:text-primary" />
                          </Link>
                        </Card>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="lg:col-span-2">
              <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-foreground">Important Questions</h2>
              </div>
              <div className="space-y-2">
                {allChapters.map((chapter, index) => (
                  <Card key={index} className="bg-background">
                    <CardContent className="p-3 flex items-center justify-between">
                      <p className="font-medium text-sm flex-1 pr-2">{chapter.name}</p>
                      <div className="flex items-center gap-2">
                          <Button asChild variant="ghost" size="sm">
                              <Link href="#"><Eye className="w-4 h-4 mr-1"/>View</Link>
                          </Button>
                          <Button asChild variant="ghost" size="sm">
                              <Link href="#"><Download className="w-4 h-4 mr-1"/>Download</Link>
                          </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
