
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, BookOpen, ChevronRight, Eye, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";

const class12MathsResources = {
  books: [
    {
      name: "Mathematics Part - I",
      lang: "en",
      chapters: [
        { name: "Chapter 1: Relations and Functions", slug: "relations-and-functions-12" },
        { name: "Chapter 2: Inverse Trigonometric Functions", slug: "inverse-trigonometric-functions" },
        { name: "Chapter 3: Matrices", slug: "matrices" },
        { name: "Chapter 4: Determinants", slug: "determinants" },
        { name: "Chapter 5: Continuity and Differentiability", slug: "continuity-and-differentiability" },
        { name: "Chapter 6: Application of Derivatives", slug: "application-of-derivatives" },
      ],
    },
    {
      name: "Mathematics Part - II",
      lang: "en",
      chapters: [
        { name: "Chapter 7: Integrals", slug: "integrals" },
        { name: "Chapter 8: Application of Integrals", slug: "application-of-integrals" },
        { name: "Chapter 9: Differential Equations", slug: "differential-equations" },
        { name: "Chapter 10: Vector Algebra", slug: "vector-algebra" },
        { name: "Chapter 11: Three Dimensional Geometry", slug: "three-dimensional-geometry" },
        { name: "Chapter 12: Linear Programming", slug: "linear-programming" },
        { name: "Chapter 13: Probability", slug: "probability-12" },
      ],
    },
    {
      name: "गणित भाग I (विषय सूचि)",
      lang: "hi",
      chapters: [
        { name: "अध्याय 1: संबंध एवं फलन", slug: "relations-and-functions-12" },
        { name: "अध्याय 2: प्रतिलोम त्रिकोणमितीय फलन", slug: "inverse-trigonometric-functions" },
        { name: "अध्याय 3: आव्यूह", slug: "matrices" },
        { name: "अध्याय 4: सारणिक", slug: "determinants" },
        { name: "अध्याय 5: सांतत्य तथा अवकलनीयता", slug: "continuity-and-differentiability" },
        { name: "अध्याय 6: अवकलज के अनुप्रयोग", slug: "application-of-derivatives" },
      ],
    },
    {
      name: "गणित भाग II (विषय सूचि)",
      lang: "hi",
      chapters: [
        { name: "अध्याय 7: समाकलन", slug: "integrals" },
        { name: "अध्याय 8: समाकलनों के अनुप्रयोग", slug: "application-of-integrals" },
        { name: "अध्याय 9: अवकल समीकरण", slug: "differential-equations" },
        { name: "अध्याय 10: सदिश बीजगणित", slug: "vector-algebra" },
        { name: "अध्याय 11: त्रिविमीय ज्यामिति", slug: "three-dimensional-geometry" },
        { name: "अध्याय 12: रैखिक प्रोग्रामन", slug: "linear-programming" },
        { name: "अध्याय 13: प्रायिकता", slug: "probability-12" },
      ],
    },
  ],
};

export default function Class12MathsPage() {
  const [notesLang, setNotesLang] = useState<'en' | 'hi'>('en');

  const allChapters = class12MathsResources.books
    .filter(book => book.lang === notesLang)
    .flatMap(book => book.chapters);

  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <Card className="shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-4">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-3 rounded-full">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold">Class 12 | Maths</CardTitle>
            </div>
          </div>
        </div>
        <CardContent className="p-6 bg-muted/20">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-3">
              <h2 className="text-2xl font-bold mb-4 text-foreground">Contents</h2>
              <div className="space-y-6">
                {class12MathsResources.books.map((book, bookIndex) => (
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
