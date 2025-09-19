
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, BookOpen, ChevronRight, Eye, Download, ShoppingCart, Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const class11MathsResources = {
  books: [
    {
      name: "Mathematics Textbook for Class XI",
      lang: "en",
      chapters: [
        { name: "Chapter 1: Sets", slug: "sets" },
        { name: "Chapter 2: Relations and Functions", slug: "relations-and-functions" },
        { name: "Chapter 3: Trigonometric Functions", slug: "trigonometric-functions" },
        { name: "Chapter 4: Principle of Mathematical Induction", slug: "principle-of-mathematical-induction" },
        { name: "Chapter 5: Complex Numbers and Quadratic Equations", slug: "complex-numbers-and-quadratic-equations" },
        { name: "Chapter 6: Linear Inequalities", slug: "linear-inequalities" },
        { name: "Chapter 7: Permutations and Combinations", slug: "permutations-and-combinations" },
        { name: "Chapter 8: Binomial Theorem", slug: "binomial-theorem" },
        { name: "Chapter 9: Sequences and Series", slug: "sequences-and-series" },
        { name: "Chapter 10: Straight Lines", slug: "straight-lines" },
        { name: "Chapter 11: Conic Sections", slug: "conic-sections" },
        { name: "Chapter 12: Introduction to Three Dimensional Geometry", slug: "introduction-to-three-dimensional-geometry" },
        { name: "Chapter 13: Limits and Derivatives", slug: "limits-and-derivatives" },
        { name: "Chapter 14: Mathematical Reasoning", slug: "mathematical-reasoning" },
        { name: "Chapter 15: Statistics", slug: "statistics-11" },
        { name: "Chapter 16: Probability", slug: "probability-11" },
      ],
    },
    {
      name: "विषय सूचि",
      lang: "hi",
      chapters: [
        { name: "अध्याय 1: समुच्चय", slug: "sets" },
        { name: "अध्याय 2: संबंध एवं फलन", slug: "relations-and-functions" },
        { name: "अध्याय 3: त्रिकोणमितीय फलन", slug: "trigonometric-functions" },
        { name: "अध्याय 4: गणितीय आगमन का सिद्धांत", slug: "principle-of-mathematical-induction" },
        { name: "अध्याय 5: सम्मिश्र संख्याएँ और द्विघातीय समीकरण", slug: "complex-numbers-and-quadratic-equations" },
        { name: "अध्याय 6: रैखिक असमिकाएँ", slug: "linear-inequalities" },
        { name: "अध्याय 7: क्रमचय और संचय", slug: "permutations-and-combinations" },
        { name: "अध्याय 8: द्विपद प्रमेय", slug: "binomial-theorem" },
        { name: "अध्याय 9: अनुक्रम तथा श्रेणी", slug: "sequences-and-series" },
        { name: "अध्याय 10: सरल रेखाएँ", slug: "straight-lines" },
        { name: "अध्याय 11: शंकु परिच्छेद", slug: "conic-sections" },
        { name: "अध्याय 12: त्रिविमीय ज्यामिति का परिचय", slug: "introduction-to-three-dimensional-geometry" },
        { name: "अध्याय 13: सीमा और अवकलज", slug: "limits-and-derivatives" },
        { name: "अध्याय 14: गणितीय विवेचन", slug: "mathematical-reasoning" },
        { name: "अध्याय 15: सांख्यिकी", slug: "statistics-11" },
        { name: "अध्याय 16: प्रायिकता", slug: "probability-11" },
      ],
    },
  ],
};

export default function Class11MathsPage() {
  const [notesLang, setNotesLang] = useState<'en' | 'hi'>('en');
  const [contentsLang, setContentsLang] = useState<'en' | 'hi'>('en');
  const isMobile = useIsMobile();

  const contents = (
    <div>
      <div className="flex justify-between items-center mb-4 lg:hidden">
        <h2 className="text-xl md:text-2xl font-bold text-foreground">Contents</h2>
        <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setContentsLang(contentsLang === 'en' ? 'hi' : 'en')}
            className="rounded-full bg-background/50 border"
        >
            <Languages className="w-5 h-5" />
            <span className="sr-only">Toggle Language</span>
        </Button>
      </div>
      <div className="space-y-4 md:space-y-6">
        {class11MathsResources.books.filter(b => b.lang === contentsLang).map((book, bookIndex) => (
          <div key={bookIndex}>
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
          <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setNotesLang(notesLang === 'en' ? 'hi' : 'en')}
              className="rounded-full bg-background/50 border"
          >
              <Languages className="w-5 h-5" />
              <span className="sr-only">Toggle Language</span>
          </Button>
      </div>
      <div className="space-y-2">
        {(class11MathsResources.books.find(b => b.lang === notesLang)?.chapters || []).map((chapter, index) => (
          <Card key={index} className="bg-background">
            <CardContent className="p-3 flex items-center justify-between">
              <p className="font-medium text-xs md:text-sm flex-1 pr-2">{chapter.name}</p>
              <div className="flex items-center gap-1 md:gap-2">
                  <Button asChild variant="ghost" size="sm">
                      <Link href="#"><Eye className="w-4 h-4 mr-1"/>View</Link>
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
    <Card className="shadow-lg overflow-hidden border-t-8 border-green-700">
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-4">
        <div className="flex items-center gap-4">
          <div className="bg-white/20 p-3 rounded-full">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold">Class 11 | Maths | CBSE</CardTitle>
          </div>
        </div>
      </div>
      <CardContent className="p-4 md:p-6 bg-muted/20">
        {isMobile ? (
          <Tabs defaultValue="contents" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-muted/60 rounded-lg">
              <TabsTrigger value="contents" className="rounded-md">Contents</TabsTrigger>
              <TabsTrigger value="notes" className="rounded-md">Primum Notes</TabsTrigger>
            </TabsList>
            <TabsContent value="contents" className="pt-4">{contents}</TabsContent>
            <TabsContent value="notes" className="pt-4">{primumNotes}</TabsContent>
          </Tabs>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 max-w-7xl mx-auto">
            <div className="lg:col-span-1">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl md:text-2xl font-bold text-foreground">Contents</h2>
                <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => setContentsLang(contentsLang === 'en' ? 'hi' : 'en')}
                    className="rounded-full bg-background/50 border"
                >
                    <Languages className="w-5 h-5" />
                    <span className="sr-only">Toggle Language</span>
                </Button>
              </div>
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
