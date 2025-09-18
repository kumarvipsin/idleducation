
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, BookOpen, ChevronRight, Eye, Download, ShoppingCart, Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const class12PhysicsResources = {
  books: [
    {
      name: "Physics Part - I",
      lang: "en",
      chapters: [
        { name: "Chapter 1: Electric Charges and Fields", slug: "electric-charges-and-fields" },
        { name: "Chapter 2: Electrostatic Potential and Capacitance", slug: "electrostatic-potential-and-capacitance" },
        { name: "Chapter 3: Current Electricity", slug: "current-electricity" },
        { name: "Chapter 4: Moving Charges and Magnetism", slug: "moving-charges-and-magnetism" },
        { name: "Chapter 5: Magnetism and Matter", slug: "magnetism-and-matter" },
        { name: "Chapter 6: Electromagnetic Induction", slug: "electromagnetic-induction" },
        { name: "Chapter 7: Alternating Current", slug: "alternating-current" },
        { name: "Chapter 8: Electromagnetic Waves", slug: "electromagnetic-waves" },
      ],
    },
    {
      name: "Physics Part - II",
      lang: "en",
      chapters: [
        { name: "Chapter 9: Ray Optics and Optical Instruments", slug: "ray-optics-and-optical-instruments" },
        { name: "Chapter 10: Wave Optics", slug: "wave-optics" },
        { name: "Chapter 11: Dual Nature of Radiation and Matter", slug: "dual-nature-of-radiation-and-matter" },
        { name: "Chapter 12: Atoms", slug: "atoms" },
        { name: "Chapter 13: Nuclei", slug: "nuclei" },
        { name: "Chapter 14: Semiconductor Electronics: Materials, Devices and Simple Circuits", slug: "semiconductor-electronics" },
      ],
    },
    {
      name: "भौतिकी भाग I (विषय सूचि)",
      lang: "hi",
      chapters: [
        { name: "अध्याय 1: वैद्युत आवेश तथा क्षेत्र", slug: "electric-charges-and-fields" },
        { name: "अध्याय 2: स्थिरवैद्युत विभव तथा धारिता", slug: "electrostatic-potential-and-capacitance" },
        { name: "अध्याय 3: विद्युत धारा", slug: "current-electricity" },
        { name: "अध्याय 4: गतिमान आवेश और चुंबकत्व", slug: "moving-charges-and-magnetism" },
        { name: "अध्याय 5: चुंबकत्व एवं द्रव्य", slug: "magnetism-and-matter" },
        { name: "अध्याय 6: वैद्युतचुंबकीय प्रेरण", slug: "electromagnetic-induction" },
        { name: "अध्याय 7: प्रत्यावर्ती धारा", slug: "alternating-current" },
        { name: "अध्याय 8: वैद्युतचुंबकीय तरंगें", slug: "electromagnetic-waves" },
      ],
    },
    {
      name: "भौतिकी भाग II (विषय सूचि)",
      lang: "hi",
      chapters: [
        { name: "अध्याय 9: किरण प्रकाशिकी एवं प्रकाशिक यंत्र", slug: "ray-optics-and-optical-instruments" },
        { name: "अध्याय 10: तरंग-प्रकाशिकी", slug: "wave-optics" },
        { name: "अध्याय 11: विकिरण तथा द्रव्य की द्वैत प्रकृति", slug: "dual-nature-of-radiation-and-matter" },
        { name: "अध्याय 12: परमाणु", slug: "atoms" },
        { name: "अध्याय 13: नाभिक", slug: "nuclei" },
        { name: "अध्याय 14: अर्धचालक इलेक्ट्रॉनिकी: पदार्थ, युक्तियाँ तथा सरल परिपथ", slug: "semiconductor-electronics" },
      ],
    },
  ],
};

export default function Class12PhysicsPage() {
  const [notesLang, setNotesLang] = useState<'en' | 'hi'>('en');
  const isMobile = useIsMobile();

  const allChapters = class12PhysicsResources.books
    .filter(book => book.lang === notesLang)
    .flatMap(book => book.chapters);

  const contents = (
    <div>
      <h2 className="text-xl md:text-2xl font-bold mb-4 text-foreground lg:hidden">Contents</h2>
      <div className="space-y-4 md:space-y-6">
        {class12PhysicsResources.books.map((book, bookIndex) => (
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
            <CardTitle className="text-2xl font-bold">Class 12 | Physics</CardTitle>
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
