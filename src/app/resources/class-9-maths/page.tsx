
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, BookOpen, ChevronRight, Eye, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";

const class9MathsResources = {
  books: [
    {
      name: "Mathematics Textbook for Class IX",
      lang: "en",
      chapters: [
        { name: "Chapter 1: Number Systems", slug: "number-systems" },
        { name: "Chapter 2: Polynomials", slug: "polynomials" },
        { name: "Chapter 3: Coordinate Geometry", slug: "coordinate-geometry" },
        { name: "Chapter 4: Linear Equations in Two Variables", slug: "linear-equations-in-two-variables" },
        { name: "Chapter 5: Introduction to Euclid's Geometry", slug: "introduction-to-euclids-geometry" },
        { name: "Chapter 6: Lines and Angles", slug: "lines-and-angles-9" },
        { name: "Chapter 7: Triangles", slug: "triangles-9" },
        { name: "Chapter 8: Quadrilaterals", slug: "quadrilaterals" },
        { name: "Chapter 9: Circles", slug: "circles-9" },
        { name: "Chapter 10: Heron's Formula", slug: "herons-formula" },
        { name: "Chapter 11: Surface Areas and Volumes", slug: "surface-areas-and-volumes-9" },
        { name: "Chapter 12: Statistics", slug: "statistics-9" },
      ],
    },
    {
      name: "विषय सूचि",
      lang: "hi",
      chapters: [
        { name: "अध्याय 1: संख्या पद्धति", slug: "number-systems" },
        { name: "अध्याय 2: बहुपद", slug: "polynomials" },
        { name: "अध्याय 3: निर्देशांक ज्यामिति", slug: "coordinate-geometry" },
        { name: "अध्याय 4: दो चरों वाले रैखिक समीकरण", slug: "linear-equations-in-two-variables" },
        { name: "अध्याय 5: यूक्लिड की ज्यामिति का परिचय", slug: "introduction-to-euclids-geometry" },
        { name: "अध्याय 6: रेखाएँ और कोण", slug: "lines-and-angles-9" },
        { name: "अध्याय 7: त्रिभुज", slug: "triangles-9" },
        { name: "अध्याय 8: चतुर्भुज", slug: "quadrilaterals" },
        { name: "अध्याय 9: वृत्त", slug: "circles-9" },
        { name: "अध्याय 10: हीरोन का सूत्र", slug: "herons-formula" },
        { name: "अध्याय 11: पृष्ठीय क्षेत्रफल और आयतन", slug: "surface-areas-and-volumes-9" },
        { name: "अध्याय 12: सांख्यिकी", slug: "statistics-9" },
      ],
    },
  ],
};

export default function Class9MathsPage() {
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
              <CardTitle className="text-2xl font-bold">Class 9 | Maths</CardTitle>
            </div>
          </div>
        </div>
        <CardContent className="p-6 bg-muted/20">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-3">
              <h2 className="text-2xl font-bold mb-4 text-foreground">Contents</h2>
              <div className="space-y-6">
                {class9MathsResources.books.map((book, bookIndex) => (
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
                  <h2 className="text-2xl font-bold text-foreground">Premium Notes</h2>
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
                {(class9MathsResources.books.find(b => b.lang === notesLang)?.chapters || []).map((chapter, index) => (
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
