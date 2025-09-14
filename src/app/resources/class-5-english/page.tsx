
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, BookOpen, ChevronRight, Eye, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";

const class5EnglishResources = {
  books: [
    {
      name: "Marigold Textbook in English for Class V",
      lang: "en",
      chapters: [
        { name: "Unit 1: Ice-Cream Man (Poem) & Wonderful Waste! (Story)", slug: "c5-en-unit1" },
        { name: "Unit 2: Teamwork (Poem) & Flying Together (Story)", slug: "c5-en-unit2" },
        { name: "Unit 3: My Shadow (Poem) & Robinson Crusoe Discovers a Footprint (Story)", slug: "c5-en-unit3" },
        { name: "Unit 4: Crying (Poem) & My Elder Brother (Story)", slug: "c5-en-unit4" },
        { name: "Unit 5: The Lazy Frog (Poem) & Rip Van Winkle (Story)", slug: "c5-en-unit5" },
        { name: "Unit 6: Class Discussion (Poem) & The Talkative Barber (Story)", slug: "c5-en-unit6" },
        { name: "Unit 7: Topsy-turvy Land (Poem) & Gulliver’s Travels (Story)", slug: "c5-en-unit7" },
        { name: "Unit 8: Nobody’s Friend (Poem) & The Little Bully (Story)", slug: "c5-en-unit8" },
        { name: "Unit 9: Sing a Song of People (Poem) & Around the World (Story)", slug: "c5-en-unit9" },
        { name: "Unit 10: Malu Bhalu (Poem) & Who Will be Ningthou? (Story)", slug: "c5-en-unit10" },
      ],
    },
  ],
};

export default function Class5EnglishPage() {
  const [notesLang, setNotesLang] = useState<'en' | 'hi'>('en');

  const allChapters = class5EnglishResources.books.flatMap(book => book.chapters);

  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <Card className="shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-purple-500 to-violet-600 text-white p-4">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-3 rounded-full">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold">Class 5 | English</CardTitle>
            </div>
          </div>
        </div>
        <CardContent className="p-6 bg-muted/20">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-3">
              <h2 className="text-2xl font-bold mb-4 text-foreground">Contents</h2>
              <div className="space-y-6">
                {class5EnglishResources.books.map((book, bookIndex) => (
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
