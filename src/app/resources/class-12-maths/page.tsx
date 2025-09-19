
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, BookOpen, ChevronRight, Eye, Download, ShoppingCart, Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
      name: "गणित भाग I",
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
      name: "गणित भाग II",
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
  const [contentsLang, setContentsLang] = useState<'en' | 'hi'>('en');
  const isMobile = useIsMobile();
  
  const contents = (
    <div>
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
        <div className="space-y-4 md:space-y-6">
        {class12MathsResources.books.filter(b => b.lang === contentsLang).map((book, bookIndex) => (
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
        <div className="space-y-4 md:space-y-6">
        {class12MathsResources.books
          .filter(book => book.lang === notesLang)
          .map((book, bookIndex) => (
            <div key={bookIndex}>
              <h3 className="text-base md:text-lg font-bold mb-3 text-primary border-b pb-1">{book.name}</h3>
              <div className="space-y-2">
                {book.chapters.map((chapter, index) => (
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
            <CardTitle className="text-2xl font-bold">Class 12 | Maths | CBSE</CardTitle>
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
