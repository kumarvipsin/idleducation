
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, BookOpen, ChevronRight, Eye, Download, ShoppingCart, Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const class11PhysicsResources = {
  books: [
    {
      name: "Physics Part - I",
      lang: "en",
      chapters: [
        { name: "Chapter 1: Units and Measurements", slug: "units-and-measurements" },
        { name: "Chapter 2: Motion in a Straight Line", slug: "motion-in-a-straight-line" },
        { name: "Chapter 3: Motion in a Plane", slug: "motion-in-a-plane" },
        { name: "Chapter 4: Laws of Motion", slug: "laws-of-motion" },
        { name: "Chapter 5: Work, Energy and Power", slug: "work-energy-and-power" },
        { name: "Chapter 6: System of Particles and Rotational Motion", slug: "system-of-particles-and-rotational-motion" },
        { name: "Chapter 7: Gravitation", slug: "gravitation-11" },
      ],
    },
    {
      name: "Physics Part - II",
      lang: "en",
      chapters: [
        { name: "Chapter 8: Mechanical Properties of Solids", slug: "mechanical-properties-of-solids" },
        { name: "Chapter 9: Mechanical Properties of Fluids", slug: "mechanical-properties-of-fluids" },
        { name: "Chapter 10: Thermal Properties of Matter", slug: "thermal-properties-of-matter" },
        { name: "Chapter 11: Thermodynamics", slug: "thermodynamics" },
        { name: "Chapter 12: Kinetic Theory", slug: "kinetic-theory" },
        { name: "Chapter 13: Oscillations", slug: "oscillations" },
        { name: "Chapter 14: Waves", slug: "waves" },
      ],
    },
    {
      name: "भौतिकी भाग I (विषय सूचि)",
      lang: "hi",
      chapters: [
        { name: "अध्याय 1: मात्रक और मापन", slug: "units-and-measurements" },
        { name: "अध्याय 2: सरल रेखा में गति", slug: "motion-in-a-straight-line" },
        { name: "अध्याय 3: समतल में गति", slug: "motion-in-a-plane" },
        { name: "अध्याय 4: गति के नियम", slug: "laws-of-motion" },
        { name: "अध्याय 5: कार्य, ऊर्जा और शक्ति", slug: "work-energy-and-power" },
        { name: "अध्याय 6: कणों के निकाय तथा घूर्णी गति", slug: "system-of-particles-and-rotational-motion" },
        { name: "अध्याय 7: गुरुत्वाकर्षण", slug: "gravitation-11" },
      ],
    },
    {
      name: "भौतिकी भाग II (विषय सूचि)",
      lang: "hi",
      chapters: [
        { name: "अध्याय 8: ठोसों के यांत्रिक गुण", slug: "mechanical-properties-of-solids" },
        { name: "अध्याय 9: तरलों के यांत्रिकी गुण", slug: "mechanical-properties-of-fluids" },
        { name: "अध्याय 10: द्रव्य के तापीय गुण", slug: "thermal-properties-of-matter" },
        { name: "अध्याय 11: ऊष्मागतिकी", slug: "thermodynamics" },
        { name: "अध्याय 12: अणुगति सिद्धांत", slug: "kinetic-theory" },
        { name: "अध्याय 13: दोलन", slug: "oscillations" },
        { name: "अध्याय 14: तरंगें", slug: "waves" },
      ],
    },
  ],
};

export default function Class11PhysicsPage() {
  const [notesLang, setNotesLang] = useState<'en' | 'hi'>('en');
  const isMobile = useIsMobile();

  const allChapters = class11PhysicsResources.books
    .filter(book => book.lang === notesLang)
    .flatMap(book => book.chapters);

  const contents = (
    <div>
      <h2 className="text-xl md:text-2xl font-bold mb-4 text-foreground lg:hidden">Contents</h2>
      <div className="space-y-4 md:space-y-6">
        {class11PhysicsResources.books.map((book, bookIndex) => (
          <div key={bookIndex}>
            <h3 className="text-base md:text-lg font-semibold mb-3 text-foreground/80">{book.name}</h3>
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
              variant="outline" 
              size="sm" 
              onClick={() => setNotesLang(notesLang === 'en' ? 'hi' : 'en')}
              className="text-xs"
          >
              <Languages className="w-4 h-4 mr-2" />
              {notesLang === 'en' ? 'हिंदी में देखें' : 'View in English'}
          </Button>
      </div>
      <div className="space-y-2">
        {allChapters.map((chapter, index) => (
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
    <Card className="shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-sky-500 to-cyan-600 text-white p-4">
        <div className="flex items-center gap-4">
          <div className="bg-white/20 p-3 rounded-full">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold">Class 11 | Physics</CardTitle>
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
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 md:gap-8 max-w-7xl mx-auto">
            <div className="lg:col-span-3">
              <h2 className="text-xl md:text-2xl font-bold mb-4 text-foreground">Contents</h2>
              {contents}
            </div>
            <div className="lg:col-span-2">
              {primumNotes}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
