
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, BookOpen, ChevronRight, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";

const class10MathsResources = {
  books: [
    {
      name: "Mathematics Textbook for Class X",
      lang: "en",
      chapters: [
        { name: "Chapter 1: Real Numbers", slug: "real-numbers" },
        { name: "Chapter 2: Polynomials", slug: "polynomials-10" },
        { name: "Chapter 3: Pair of Linear Equations in Two Variables", slug: "pair-of-linear-equations-in-two-variables" },
        { name: "Chapter 4: Quadratic Equations", slug: "quadratic-equations" },
        { name: "Chapter 5: Arithmetic Progressions", slug: "arithmetic-progressions" },
        { name: "Chapter 6: Triangles", slug: "triangles" },
        { name: "Chapter 7: Coordinate Geometry", slug: "coordinate-geometry-10" },
        { name: "Chapter 8: Introduction to Trigonometry", slug: "introduction-to-trigonometry" },
        { name: "Chapter 9: Some Applications of Trigonometry", slug: "some-applications-of-trigonometry" },
        { name: "Chapter 10: Circles", slug: "circles" },
        { name: "Chapter 11: Areas Related to Circles", slug: "areas-related-to-circles" },
        { name: "Chapter 12: Surface Areas and Volumes", slug: "surface-areas-and-volumes" },
        { name: "Chapter 13: Statistics", slug: "statistics" },
        { name: "Chapter 14: Probability", slug: "probability" },
      ],
    },
    {
      name: "विषय सूचि",
      lang: "hi",
      chapters: [
        { name: "अध्याय 1: वास्तविक संख्याएँ", slug: "real-numbers" },
        { name: "अध्याय 2: बहुपद", slug: "polynomials-10" },
        { name: "अध्याय 3: दो चर वाले रैखिक समीकरण युग्म", slug: "pair-of-linear-equations-in-two-variables" },
        { name: "अध्याय 4: द्विघात समीकरण", slug: "quadratic-equations" },
        { name: "अध्याय 5: समांतर श्रेढ़ियाँ", slug: "arithmetic-progressions" },
        { name: "अध्याय 6: त्रिभुज", slug: "triangles" },
        { name: "अध्याय 7: निर्देशांक ज्यामिति", slug: "coordinate-geometry-10" },
        { name: "अध्याय 8: त्रिकोणमिति का परिचय", slug: "introduction-to-trigonometry" },
        { name: "अध्याय 9: त्रिकोणमिति के कुछ अनुप्रयोग", slug: "some-applications-of-trigonometry" },
        { name: "अध्याय 10: वृत्त", slug: "circles" },
        { name: "अध्याय 11: वृत्तों से संबंधित क्षेत्रफल", slug: "areas-related-to-circles" },
        { name: "अध्याय 12: पृष्ठीय क्षेत्रफल और आयतन", slug: "surface-areas-and-volumes" },
        { name: "अध्याय 13: सांख्यिकी", slug: "statistics" },
        { name: "अध्याय 14: प्रायिकता", slug: "probability" },
      ],
    },
  ],
};

export default function Class10MathsPage() {
  const [notesLang, setNotesLang] = useState<'en' | 'hi'>('en');

  return (
    <Card className="shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-4">
        <div className="flex items-center gap-4">
          <div className="bg-white/20 p-3 rounded-full">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold">Class 10 | Maths</CardTitle>
          </div>
        </div>
      </div>
      <CardContent className="p-4 md:p-6 bg-muted/20">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 md:gap-8 max-w-7xl mx-auto">
          <div className="lg:col-span-3">
            <h2 className="text-xl md:text-2xl font-bold mb-4 text-foreground">Contents</h2>
            <div className="space-y-4 md:space-y-6">
              {class10MathsResources.books.map((book, bookIndex) => (
                <div key={bookIndex}>
                  {book.lang === 'hi' && <h3 className="text-base md:text-lg font-semibold mb-3 text-foreground/80">{book.name}</h3>}
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
          <div className="lg:col-span-2">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl md:text-2xl font-bold text-foreground">Important Questions</h2>
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
              {(class10MathsResources.books.find(b => b.lang === notesLang)?.chapters || []).map((chapter, index) => (
                <Card key={index} className="bg-background">
                  <CardContent className="p-3 flex items-center justify-between">
                    <p className="font-medium text-xs md:text-sm flex-1 pr-2">{chapter.name}</p>
                    <div className="flex items-center gap-1 md:gap-2">
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
  );
}
