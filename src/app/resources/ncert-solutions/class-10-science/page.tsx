
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, BookOpen, ChevronRight, Edit, BrainCircuit, Download, ShoppingCart, Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const scienceResources = {
  books: [
    {
      name: "Science Class X (2025 Syllabus)",
      lang: "en",
      chapters: [
        { name: "Chapter 1: Chemical Reactions and Equations", slug: "chemical-reactions-and-equations" },
        { name: "Chapter 2: Acids, Bases and Salts", slug: "acids-bases-and-salts" },
        { name: "Chapter 3: Metals and Non-metals", slug: "metals-and-non-metals" },
        { name: "Chapter 4: Carbon and its Compounds", slug: "carbon-and-its-compounds" },
        { name: "Chapter 5: Life Processes", slug: "life-processes" },
        { name: "Chapter 6: Control and Coordination", slug: "control-and-coordination" },
        { name: "Chapter 7: How do Organisms Reproduce?", slug: "how-do-organisms-reproduce" },
        { name: "Chapter 8: Heredity", slug: "heredity" },
        { name: "Chapter 9: Light – Reflection and Refraction", slug: "light-reflection-and-refraction" },
        { name: "Chapter 10: The Human Eye and the Colourful World", slug: "human-eye-and-colourful-world" },
        { name: "Chapter 11: Electricity", slug: "electricity" },
        { name: "Chapter 12: Magnetic Effects of Electric Current", slug: "magnetic-effects-of-electric-current" },
        { name: "Chapter 13: Our Environment", slug: "our-environment" },
      ],
    },
    {
      name: "विषय सूचि",
      lang: "hi",
      chapters: [
        { name: "अध्याय 1: रासायनिक अभिक्रियाएँ एवं समीकरण", slug: "chemical-reactions-and-equations" },
        { name: "अध्याय 2: अम्ल, क्षारक एवं लवण", slug: "acids-bases-and-salts" },
        { name: "अध्याय 3: धातु एवं अधातु", slug: "metals-and-non-metals" },
        { name: "अध्याय 4: कार्बन एवं उसके यौगिक", slug: "carbon-and-its-compounds" },
        { name: "अध्याय 5: जैव प्रक्रम", slug: "life-processes" },
        { name: "अध्याय 6: नियंत्रण एवं समन्वय", slug: "control-and-coordination" },
        { name: "अध्याय 7: जीव जनन कैसे करते हैं?", slug: "how-do-organisms-reproduce" },
        { name: "अध्याय 8: आनुवंशिकता", slug: "heredity" },
        { name: "अध्याय 9: प्रकाश – परावर्तन तथा अपवर्तन", slug: "light-reflection-and-refraction" },
        { name: "अध्याय 10: मानव नेत्र तथा रंगबिरंगा संसार", slug: "human-eye-and-colourful-world" },
        { name: "अध्याय 11: विद्युत", slug: "electricity" },
        { name: "अध्याय 12: विद्युत धारा के चुंबकीय प्रभाव", slug: "magnetic-effects-of-electric-current" },
        { name: "अध्याय 13: हमारा पर्यावरण", slug: "our-environment" },
      ],
    },
  ],
};

export default function ScienceDetailsPage() {
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
        {scienceResources.books.filter(b => b.lang === contentsLang).map((book, bookIndex) => (
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
          {(scienceResources.books.find(b => b.lang === notesLang)?.chapters || []).map((chapter, index) => (
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
    <Card className="shadow-lg overflow-hidden border-t-8 border-blue-700">
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-4">
        <div className="flex items-center gap-4">
          <div className="bg-white/20 p-3 rounded-full">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold">Class 10 | Science | CBSE</CardTitle>
          </div>
        </div>
      </div>
      <CardContent className="p-4 md:p-6">
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
