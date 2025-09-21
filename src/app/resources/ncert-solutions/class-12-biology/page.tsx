
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, BookOpen, ChevronRight, Eye, Download, ShoppingCart, Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const class12BiologyResources = {
  books: [
    {
      name: "Biology Textbook for Class XII",
      lang: "en",
      chapters: [
        { name: "Chapter 1: Sexual Reproduction in Flowering Plants", slug: "sexual-reproduction-in-flowering-plants" },
        { name: "Chapter 2: Human Reproduction", slug: "human-reproduction" },
        { name: "Chapter 3: Reproductive Health", slug: "reproductive-health" },
        { name: "Chapter 4: Principles of Inheritance and Variation", slug: "principles-of-inheritance-and-variation" },
        { name: "Chapter 5: Molecular Basis of Inheritance", slug: "molecular-basis-of-inheritance" },
        { name: "Chapter 6: Evolution", slug: "evolution" },
        { name: "Chapter 7: Human Health and Disease", slug: "human-health-and-disease" },
        { name: "Chapter 8: Microbes in Human Welfare", slug: "microbes-in-human-welfare" },
        { name: "Chapter 9: Biotechnology: Principles and Processes", slug: "biotechnology-principles-and-processes" },
        { name: "Chapter 10: Biotechnology and its Applications", slug: "biotechnology-and-its-applications" },
        { name: "Chapter 11: Organisms and Populations", slug: "organisms-and-populations" },
        { name: "Chapter 12: Ecosystem", slug: "ecosystem" },
        { name: "Chapter 13: Biodiversity and Conservation", slug: "biodiversity-and-conservation" },
      ],
    },
    {
      name: "जीव विज्ञान (विषय सूचि)",
      lang: "hi",
      chapters: [
        { name: "अध्याय 1: पुष्पी पादपों में लैंगिक जनन", slug: "sexual-reproduction-in-flowering-plants" },
        { name: "अध्याय 2: मानव जनन", slug: "human-reproduction" },
        { name: "अध्याय 3: जनन स्वास्थ्य", slug: "reproductive-health" },
        { name: "अध्याय 4: वंशागति तथा विविधता के सिद्धांत", slug: "principles-of-inheritance-and-variation" },
        { name: "अध्याय 5: वंशागति के आणविक आधार", slug: "molecular-basis-of-inheritance" },
        { name: "अध्याय 6: विकास", slug: "evolution" },
        { name: "अध्याय 7: मानव स्वास्थ्य तथा रोग", slug: "human-health-and-disease" },
        { name: "अध्याय 8: मानव कल्याण में सूक्ष्म जीव", slug: "microbes-in-human-welfare" },
        { name: "अध्याय 9: जैव प्रौद्योगिकी-सिद्धांत व प्रक्रम", slug: "biotechnology-principles-and-processes" },
        { name: "अध्याय 10: जैव प्रौद्योगिकी एवं उसके उपयोग", slug: "biotechnology-and-its-applications" },
        { name: "अध्याय 11: जीव और समष्टियाँ", slug: "organisms-and-populations" },
        { name: "अध्याय 12: पारितंत्र", slug: "ecosystem" },
        { name: "अध्याय 13: जैव विविधता एवं संरक्षण", slug: "biodiversity-and-conservation" },
      ],
    },
  ],
};

export default function Class12BiologyPage() {
  const [notesLang, setNotesLang] = useState<'en' | 'hi'>('en');
  const [contentsLang, setContentsLang] = useState<'en' | 'hi'>('en');
  const isMobile = useIsMobile();

  const contents = (
    <div>
      <div className="flex justify-between items-center mb-4 lg:hidden">
        <h2 className="text-xl md:text-2xl font-bold mb-4 text-foreground pb-2 bg-gradient-to-r from-red-500 from-50% to-primary to-50% bg-no-repeat bg-bottom inline-block" style={{ backgroundSize: '100% 2px' }}>Contents</h2>
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
        {class12BiologyResources.books.filter(b => b.lang === contentsLang).map((book, bookIndex) => (
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
        {(class12BiologyResources.books.find(b => b.lang === notesLang)?.chapters || []).map((chapter, index) => (
          <Card key={index} className="bg-background">
            <CardContent className="p-3 flex items-center justify-between">
              <p className="font-medium text-xs md:text-sm flex-1 pr-2">{chapter.name}</p>
              <div className="flex items-center gap-1 md:gap-2">
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
  );
  
  return (
    <Card className="shadow-lg overflow-hidden border-t-8 border-lime-700">
      <div className="bg-gradient-to-r from-lime-500 to-green-600 text-white p-4">
        <div className="flex items-center gap-4">
          <div className="bg-white/20 p-3 rounded-full">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold">Class 12 | Biology | CBSE</CardTitle>
          </div>
        </div>
      </div>
      <CardContent className="p-4 md:p-6 bg-muted/20">
        {isMobile ? (
          <Tabs defaultValue="contents" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-muted/60 rounded-lg">
              <TabsTrigger value="contents" className="rounded-md">Contents</TabsTrigger>
              <TabsTrigger value="notes" className="rounded-md">Important Questions</TabsTrigger>
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
