
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, BookOpen, ChevronRight, Eye, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";

const class6MathsResources = {
  books: [
    {
      name: "Mathematics Textbook for Class VI",
      lang: "en",
      chapters: [
        { name: "Chapter 1: Knowing Our Numbers", slug: "knowing-our-numbers" },
        { name: "Chapter 2: Whole Numbers", slug: "whole-numbers" },
        { name: "Chapter 3: Playing with Numbers", slug: "playing-with-numbers" },
        { name: "Chapter 4: Basic Geometrical Ideas", slug: "basic-geometrical-ideas" },
        { name: "Chapter 5: Understanding Elementary Shapes", slug: "understanding-elementary-shapes" },
        { name: "Chapter 6: Integers", slug: "integers" },
        { name: "Chapter 7: Fractions", slug: "fractions" },
        { name: "Chapter 8: Decimals", slug: "decimals" },
        { name: "Chapter 9: Data Handling", slug: "data-handling" },
        { name: "Chapter 10: Mensuration", slug: "mensuration" },
        { name: "Chapter 11: Algebra", slug: "algebra" },
        { name: "Chapter 12: Ratio and Proportion", slug: "ratio-and-proportion" },
      ],
    },
    {
      name: "विषय सूचि",
      lang: "hi",
      chapters: [
        { name: "अध्याय 1: अपनी संख्याओं की जानकारी", slug: "knowing-our-numbers" },
        { name: "अध्याय 2: पूर्ण संख्याएँ", slug: "whole-numbers" },
        { name: "अध्याय 3: संख्याओं के साथ खेलना", slug: "playing-with-numbers" },
        { name: "अध्याय 4: आधारभूत ज्यामितीय अवधारणाएँ", slug: "basic-geometrical-ideas" },
        { name: "अध्याय 5: प्रारंभिक आकारों को समझना", slug: "understanding-elementary-shapes" },
        { name: "अध्याय 6: पूर्णांक", slug: "integers" },
        { name: "अध्याय 7: भिन्न", slug: "fractions" },
        { name: "अध्याय 8: दशमलव", slug: "decimals" },
        { name: "अध्याय 9: आँकड़ों का प्रबंधन", slug: "data-handling" },
        { name: "अध्याय 10: क्षेत्रमिति", slug: "mensuration" },
        { name: "अध्याय 11: बीजगणित", slug: "algebra" },
        { name: "अध्याय 12: अनुपात और समानुपात", slug: "ratio-and-proportion" },
      ],
    },
  ],
};

export default function Class6MathsPage() {
  const [notesLang, setNotesLang] = useState<'en' | 'hi'>('en');
  
  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <Card className="shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-4">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-3 rounded-full">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold">Class 6 | Maths</CardTitle>
            </div>
          </div>
        </div>
        <CardContent className="p-6 bg-muted/20">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 max-w-7xl mx-auto">
            <div className="lg:col-span-3">
              <h2 className="text-2xl font-bold mb-4 text-foreground">Contents</h2>
              <div className="space-y-6">
                {class6MathsResources.books.map((book, bookIndex) => (
                  <div key={bookIndex}>
                    {book.lang === 'hi' && <h3 className="text-lg font-semibold mb-3 text-foreground/80">{book.name}</h3>}
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
                  <div className="flex items-center border rounded-md p-1 bg-background/50">
                      <button 
                          onClick={() => setNotesLang('en')}
                          className={cn("px-2 py-1 text-xs rounded-sm", notesLang === 'en' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground')}>
                          EN
                      </button>
                      <button 
                          onClick={() => setNotesLang('hi')}
                          className={cn("px-2 py-1 text-xs rounded-sm", notesLang === 'hi' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground')}>
                          HI
                      </button>
                  </div>
              </div>
              <div className="space-y-2">
                {(class6MathsResources.books.find(b => b.lang === notesLang)?.chapters || []).map((chapter, index) => (
                  <Card key={index} className="bg-background">
                    <CardContent className="p-3 flex items-center justify-between">
                      <p className="font-medium text-sm flex-1 pr-2">{chapter.name}</p>
                      <div className="flex items-center gap-2">
                          <Button asChild variant="ghost" size="sm">
                              <Link href="#">View</Link>
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
