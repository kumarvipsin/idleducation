
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, BookOpen, ChevronRight, Eye, Download, ShoppingCart, Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const class11ChemistryResources = {
  books: [
    {
      name: "Chemistry Part - I",
      lang: "en",
      chapters: [
        { name: "Chapter 1: Some Basic Concepts of Chemistry", slug: "some-basic-concepts-of-chemistry" },
        { name: "Chapter 2: Structure of Atom", slug: "structure-of-atom" },
        { name: "Chapter 3: Classification of Elements and Periodicity in Properties", slug: "classification-of-elements-and-periodicity-in-properties" },
        { name: "Chapter 4: Chemical Bonding and Molecular Structure", slug: "chemical-bonding-and-molecular-structure" },
        { name: "Chapter 5: Thermodynamics", slug: "thermodynamics-11" },
        { name: "Chapter 6: Equilibrium", slug: "equilibrium" },
      ],
    },
    {
      name: "Chemistry Part - II",
      lang: "en",
      chapters: [
        { name: "Chapter 7: Redox Reactions", slug: "redox-reactions" },
        { name: "Chapter 8: Organic Chemistry – Some Basic Principles and Techniques", slug: "organic-chemistry-some-basic-principles-and-techniques" },
        { name: "Chapter 9: Hydrocarbons", slug: "hydrocarbons" },
      ],
    },
    {
      name: "रसायन विज्ञान भाग I",
      lang: "hi",
      chapters: [
        { name: "अध्याय 1: रसायन विज्ञान की कुछ मूल अवधारणाएँ", slug: "some-basic-concepts-of-chemistry" },
        { name: "अध्याय 2: परमाणु की संरचना", slug: "structure-of-atom" },
        { name: "अध्याय 3: तत्वों का वर्गीकरण एवं गुणधर्मों में आवर्तिता", slug: "classification-of-elements-and-periodicity-in-properties" },
        { name: "अध्याय 4: रासायनिक आबंधन तथा आण्विक संरचना", slug: "chemical-bonding-and-molecular-structure" },
        { name: "अध्याय 5: ऊष्मागतिकी", slug: "thermodynamics-11" },
        { name: "अध्याय 6: साम्यावस्था", slug: "equilibrium" },
      ],
    },
    {
      name: "रसायन विज्ञान भाग II",
      lang: "hi",
      chapters: [
        { name: "अध्याय 7: अपचयोपचय अभिक्रियाएँ", slug: "redox-reactions" },
        { name: "अध्याय 8: कार्बनिक रसायन – कुछ आधारभूत सिद्धांत तथा तकनीकें", slug: "organic-chemistry-some-basic-principles-and-techniques" },
        { name: "अध्याय 9: हाइड्रोकार्बन", slug: "hydrocarbons" },
      ],
    },
  ],
};

export default function Class11ChemistryPage() {
  const [notesLang, setNotesLang] = useState<'en' | 'hi'>('en');
  const [contentsLang, setContentsLang] = useState<'en' | 'hi'>('en');
  const isMobile = useIsMobile();

  const allChapters = class11ChemistryResources.books
    .filter(book => book.lang === notesLang)
    .flatMap(book => book.chapters);

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
        {class11ChemistryResources.books.filter(b => b.lang === contentsLang).map((book, bookIndex) => (
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
      <div className="space-y-4">
        {class11ChemistryResources.books
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
            <CardTitle className="text-2xl font-bold">Class 11 | Chemistry | CBSE</CardTitle>
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
