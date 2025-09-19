
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, BookOpen, ChevronRight, Eye, Download, ShoppingCart, Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const class11GeographyResources = {
  books: [
    {
      name: "Fundamentals of Physical Geography",
      lang: "en",
      chapters: [
        { name: "Chapter 1: Geography as a Discipline", slug: "geography-as-a-discipline" },
        { name: "Chapter 2: The Origin and Evolution of the Earth", slug: "the-origin-and-evolution-of-the-earth" },
        { name: "Chapter 3: Interior of the Earth", slug: "interior-of-the-earth" },
        { name: "Chapter 4: Distribution of Oceans and Continents", slug: "distribution-of-oceans-and-continents" },
        { name: "Chapter 5: Minerals and Rocks", slug: "minerals-and-rocks" },
        { name: "Chapter 6: Geomorphic Processes", slug: "geomorphic-processes" },
        { name: "Chapter 7: Landforms and their Evolution", slug: "landforms-and-their-evolution" },
        { name: "Chapter 8: Composition and Structure of Atmosphere", slug: "composition-and-structure-of-atmosphere" },
        { name: "Chapter 9: Solar Radiation, Heat Balance and Temperature", slug: "solar-radiation-heat-balance-and-temperature" },
        { name: "Chapter 10: Atmospheric Circulation and Weather Systems", slug: "atmospheric-circulation-and-weather-systems" },
        { name: "Chapter 11: Water in the Atmosphere", slug: "water-in-the-atmosphere" },
        { name: "Chapter 12: World Climate and Climate Change", slug: "world-climate-and-climate-change" },
        { name: "Chapter 13: Water (Oceans)", slug: "water-oceans" },
        { name: "Chapter 14: Movements of Ocean Water", slug: "movements-of-ocean-water" },
        { name: "Chapter 15: Life on the Earth", slug: "life-on-the-earth" },
        { name: "Chapter 16: Biodiversity and Conservation", slug: "biodiversity-and-conservation" },
      ],
    },
    {
      name: "India Physical Environment",
      lang: "en",
      chapters: [
        { name: "Chapter 1: India - Location", slug: "india-location" },
        { name: "Chapter 2: Structure and Physiography", slug: "structure-and-physiography" },
        { name: "Chapter 3: Drainage System", slug: "drainage-system" },
        { name: "Chapter 4: Climate", slug: "climate-11" },
        { name: "Chapter 5: Natural Vegetation", slug: "natural-vegetation" },
        { name: "Chapter 6: Soils", slug: "soils" },
        { name: "Chapter 7: Natural Hazards and Disasters", slug: "natural-hazards-and-disasters" },
      ],
    },
    {
      name: "भौतिक भूगोल के मूल सिद्धांत",
      lang: "hi",
      chapters: [
        { name: "अध्याय 1: भूगोल एक विषय के रूप में", slug: "geography-as-a-discipline" },
        { name: "अध्याय 2: पृथ्वी की उत्पत्ति एवं विकास", slug: "the-origin-and-evolution-of-the-earth" },
        { name: "अध्याय 3: पृथ्वी की आंतरिक संरचना", slug: "interior-of-the-earth" },
        { name: "अध्याय 4: महासागरों और महाद्वीपों का वितरण", slug: "distribution-of-oceans-and-continents" },
        { name: "अध्याय 5: खनिज एवं शैल", slug: "minerals-and-rocks" },
        { name: "अध्याय 6: भू-आकृतिक प्रक्रियाएँ", slug: "geomorphic-processes" },
        { name: "अध्याय 7: भू-आकृतियाँ तथा उनका विकास", slug: "landforms-and-their-evolution" },
        { name: "अध्याय 8: वायुमंडल का संघटन तथा संरचना", slug: "composition-and-structure-of-atmosphere" },
        { name: "अध्याय 9: सौर विकिरण, ऊष्मा संतुलन एवं तापमान", slug: "solar-radiation-heat-balance-and-temperature" },
        { name: "अध्याय 10: वायुमंडलीय परिसंचरण तथा मौसम प्रणालियाँ", slug: "atmospheric-circulation-and-weather-systems" },
        { name: "अध्याय 11: वायुमंडल में जल", slug: "water-in-the-atmosphere" },
        { name: "अध्याय 12: विश्व की जलवायु एवं जलवायु परिवर्तन", slug: "world-climate-and-climate-change" },
        { name: "अध्याय 13: महासागरीय जल", slug: "water-oceans" },
        { name: "अध्याय 14: महासागरीय जल संचलन", slug: "movements-of-ocean-water" },
        { name: "अध्याय 15: पृथ्वी पर जीवन", slug: "life-on-the-earth" },
        { name: "अध्याय 16: जैव-विविधता एवं संरक्षण", slug: "biodiversity-and-conservation" },
      ],
    },
    {
      name: "भारत भौतिक पर्यावरण",
      lang: "hi",
      chapters: [
        { name: "अध्याय 1: भारत - स्थिति", slug: "india-location" },
        { name: "अध्याय 2: संरचना तथा भू-आकृति विज्ञान", slug: "structure-and-physiography" },
        { name: "अध्याय 3: अपवाह तंत्र", slug: "drainage-system" },
        { name: "अध्याय 4: जलवायु", slug: "climate-11" },
        { name: "अध्याय 5: प्राकृतिक वनस्पति", slug: "natural-vegetation" },
        { name: "अध्याय 6: मृदा", slug: "soils" },
        { name: "अध्याय 7: प्राकृतिक संकट तथा आपदाएँ", slug: "natural-hazards-and-disasters" },
      ],
    },
  ],
};

export default function Class11GeographyPage() {
  const [notesLang, setNotesLang] = useState<'en' | 'hi'>('en');
  const [contentsLang, setContentsLang] = useState<'en' | 'hi'>('en');
  const isMobile = useIsMobile();

  const allChapters = class11GeographyResources.books
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
        {class11GeographyResources.books.filter(b => b.lang === contentsLang).map((book, bookIndex) => (
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
      <div className="bg-gradient-to-r from-amber-500 to-orange-600 text-white p-4">
        <div className="flex items-center gap-4">
          <div className="bg-white/20 p-3 rounded-full">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold">Class 11 | Geography | CBSE</CardTitle>
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
            <div className="lg:col-span-2">
              {primumNotes}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}



    