
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, BookOpen, ChevronRight, Eye, Download, ShoppingCart, Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const class7MathsResources = {
  books: [
    {
      name: "Mathematics Textbook for Class VII",
      lang: "en",
      chapters: [
        { name: "Chapter 1: Integers", slug: "integers-7" },
        { name: "Chapter 2: Fractions and Decimals", slug: "fractions-and-decimals-7" },
        { name: "Chapter 3: Data Handling", slug: "data-handling-7" },
        { name: "Chapter 4: Simple Equations", slug: "simple-equations" },
        { name: "Chapter 5: Lines and Angles", slug: "lines-and-angles" },
        { name: "Chapter 6: The Triangle and its Properties", slug: "the-triangle-and-its-properties" },
        { name: "Chapter 7: Congruence of Triangles", slug: "congruence-of-triangles" },
        { name: "Chapter 8: Comparing Quantities", slug: "comparing-quantities-7" },
        { name: "Chapter 9: Rational Numbers", slug: "rational-numbers-7" },
        { name: "Chapter 10: Practical Geometry", slug: "practical-geometry" },
        { name: "Chapter 11: Perimeter and Area", slug: "perimeter-and-area" },
        { name: "Chapter 12: Algebraic Expressions", slug: "algebraic-expressions" },
        { name: "Chapter 13: Exponents and Powers", slug: "exponents-and-powers-7" },
        { name: "Chapter 14: Symmetry", slug: "symmetry" },
        { name: "Chapter 15: Visualising Solid Shapes", slug: "visualising-solid-shapes" },
      ],
    },
    {
      name: "विषय सूचि",
      lang: "hi",
      chapters: [
        { name: "अध्याय 1: पूर्णांक", slug: "integers-7" },
        { name: "अध्याय 2: भिन्न एवं दशमलव", slug: "fractions-and-decimals-7" },
        { name: "अध्याय 3: आँकड़ो का प्रबंधन", slug: "data-handling-7" },
        { name: "अध्याय 4: सरल समीकरण", slug: "simple-equations" },
        { name: "अध्याय 5: रेखा एवं कोण", slug: "lines-and-angles" },
        { name: "अध्याय 6: त्रिभुज और उसके गुण", slug: "the-triangle-and-its-properties" },
        { name: "अध्याय 7: त्रिभुजों की सर्वांगसमता", slug: "congruence-of-triangles" },
        { name: "अध्याय 8: राशियों की तुलना", slug: "comparing-quantities-7" },
        { name: "अध्याय 9: परिमेय संख्याएँ", slug: "rational-numbers-7" },
        { name: "अध्याय 10: प्रायोगिक ज्यामिति", slug: "practical-geometry" },
        { name: "अध्याय 11: परिमाप और क्षेत्रफल", slug: "perimeter-and-area" },
        { name: "अध्याय 12: बीजीय व्यंजक", slug: "algebraic-expressions" },
        { name: "अध्याय 13: घातांक और घात", slug: "exponents-and-powers-7" },
        { name: "अध्याय 14: सममिति", slug: "symmetry" },
        { name: "अध्याय 15: ठोस आकारों का चित्रण", slug: "visualising-solid-shapes" },
      ],
    },
  ],
};

export default function Class7MathsPage() {
  const [notesLang, setNotesLang] = useState<'en' | 'hi'>('en');
  const [contentsLang, setContentsLang] = useState<'en' | 'hi'>('en');
  const isMobile = useIsMobile();
  
  const contents = (
    <div>
      <div className="flex justify-between items-center mb-4 lg:hidden">
          <h2 className="text-xl md:text-2xl font-bold text-foreground pb-2 bg-gradient-to-r from-red-500 from-50% to-primary to-50% bg-no-repeat bg-bottom inline-block" style={{ backgroundSize: '100% 2px' }}>Contents</h2>
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
        {class7MathsResources.books.filter(b => b.lang === contentsLang).map((book, bookIndex) => (
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
            <h2 className="text-xl md:text-2xl font-bold text-foreground pb-2 bg-gradient-to-r from-red-500 from-50% to-primary to-50% bg-no-repeat bg-bottom inline-block" style={{ backgroundSize: '100% 2px' }}>Important Questions</h2>
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
        {(class7MathsResources.books.find(b => b.lang === notesLang)?.chapters || []).map((chapter, index) => (
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
  );
  
  return (
    <Card className="shadow-lg overflow-hidden border-t-8 border-green-700">
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-4">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-3 rounded-full">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold">Class 7 | Maths | CBSE</CardTitle>
            </div>
          </div>
        </div>
        <CardContent className="p-4 md:p-6">
          {isMobile ? (
             <Tabs defaultValue="contents" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="contents">Contents</TabsTrigger>
                    <TabsTrigger value="notes">Important Questions</TabsTrigger>
                </TabsList>
                <TabsContent value="contents" className="pt-4">{contents}</TabsContent>
                <TabsContent value="notes" className="pt-4">{primumNotes}</TabsContent>
            </Tabs>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 max-w-7xl mx-auto">
                <div className="lg:col-span-1">
                     <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl md:text-2xl font-bold text-foreground pb-2 bg-gradient-to-r from-red-500 from-50% to-primary to-50% bg-no-repeat bg-bottom inline-block" style={{ backgroundSize: '100% 2px' }}>Contents</h2>
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
