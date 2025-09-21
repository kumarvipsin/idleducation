
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, BookOpen, ChevronRight, Eye, Download, ShoppingCart, Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const class9SocialResources = {
  books: [
    {
      name: "India and the Contemporary World - I",
      lang: "en",
      chapters: [
        { name: "Chapter 1: The French Revolution", slug: "the-french-revolution" },
        { name: "Chapter 2: Socialism in Europe and the Russian Revolution", slug: "socialism-in-europe-and-the-russian-revolution" },
        { name: "Chapter 3: Nazism and the Rise of Hitler", slug: "nazism-and-the-rise-of-hitler" },
        { name: "Chapter 4: Forest Society and Colonialism", slug: "forest-society-and-colonialism" },
        { name: "Chapter 5: Pastoralists in the Modern World", slug: "pastoralists-in-the-modern-world" },
      ],
    },
    {
      name: "Contemporary India - I",
      lang: "en",
      chapters: [
        { name: "Chapter 1: India - Size and Location", slug: "india-size-and-location" },
        { name: "Chapter 2: Physical Features of India", slug: "physical-features-of-india" },
        { name: "Chapter 3: Drainage", slug: "drainage" },
        { name: "Chapter 4: Climate", slug: "climate" },
        { name: "Chapter 5: Natural Vegetation and Wildlife", slug: "natural-vegetation-and-wildlife" },
        { name: "Chapter 6: Population", slug: "population" },
      ],
    },
    {
      name: "Democratic Politics - I",
      lang: "en",
      chapters: [
        { name: "Chapter 1: What is Democracy? Why Democracy?", slug: "what-is-democracy-why-democracy" },
        { name: "Chapter 2: Constitutional Design", slug: "constitutional-design" },
        { name: "Chapter 3: Electoral Politics", slug: "electoral-politics" },
        { name: "Chapter 4: Working of Institutions", slug: "working-of-institutions" },
        { name: "Chapter 5: Democratic Rights", slug: "democratic-rights" },
      ],
    },
    {
      name: "Economics",
      lang: "en",
      chapters: [
        { name: "Chapter 1: The Story of Village Palampur", slug: "the-story-of-village-palampur" },
        { name: "Chapter 2: People as Resource", slug: "people-as-resource" },
        { name: "Chapter 3: Poverty as a Challenge", slug: "poverty-as-a-challenge" },
        { name: "Chapter 4: Food Security in India", slug: "food-security-in-india" },
      ],
    },
    {
      name: "भारत और समकालीन विश्व - I",
      lang: "hi",
      chapters: [
        { name: "अध्याय 1: फ्रांसीसी क्रांति", slug: "the-french-revolution" },
        { name: "अध्याय 2: यूरोप में समाजवाद एवं रूसी क्रांति", slug: "socialism-in-europe-and-the-russian-revolution" },
        { name: "अध्याय 3: नात्सीवाद और हिटलर का उदय", slug: "nazism-and-the-rise-of-hitler" },
        { name: "अध्याय 4: वन्य समाज एवं उपनिवेशवाद", slug: "forest-society-and-colonialism" },
        { name: "अध्याय 5: आधुनिक विश्व में चरवाहे", slug: "pastoralists-in-the-modern-world" },
      ],
    },
    {
      name: "समकालीन भारत - I",
      lang: "hi",
      chapters: [
        { name: "अध्याय 1: भारत - आकार और स्थिति", slug: "india-size-and-location" },
        { name: "अध्याय 2: भारत का भौतिक स्वरूप", slug: "physical-features-of-india" },
        { name: "अध्याय 3: अपवाह", slug: "drainage" },
        { name: "अध्याय 4: जलवायु", slug: "climate" },
        { name: "अध्याय 5: प्राकृतिक वनस्पति तथा वन्य प्राणी", slug: "natural-vegetation-and-wildlife" },
        { name: "अध्याय 6: जनसंख्या", slug: "population" },
      ],
    },
    {
      name: "लोकतांत्रिक राजनीति - I",
      lang: "hi",
      chapters: [
        { name: "अध्याय 1: लोकतंत्र क्या? लोकतंत्र क्यों?", slug: "what-is-democracy-why-democracy" },
        { name: "अध्याय 2: संविधान निर्माण", slug: "constitutional-design" },
        { name: "अध्याय 3: चुनावी राजनीति", slug: "electoral-politics" },
        { name: "अध्याय 4: संस्थाओं का कामकाज", slug: "working-of-institutions" },
        { name: "अध्याय 5: लोकतांत्रिक अधिकार", slug: "democratic-rights" },
      ],
    },
    {
      name: "अर्थशास्त्र",
      lang: "hi",
      chapters: [
        { name: "अध्याय 1: पालमपुर गाँव की कहानी", slug: "the-story-of-village-palampur" },
        { name: "अध्याय 2: संसाधन के रूप में लोग", slug: "people-as-resource" },
        { name: "अध्याय 3: निर्धनता: एक चुनौती", slug: "poverty-as-a-challenge" },
        { name: "अध्याय 4: भारत में खाद्य सुरक्षा", slug: "food-security-in-india" },
      ],
    },
  ],
};

export default function Class9SocialPage() {
  const [notesLang, setNotesLang] = useState<'en' | 'hi'>('en');
  const [contentsLang, setContentsLang] = useState<'en' | 'hi'>('en');
  const isMobile = useIsMobile();

  const allChapters = class9SocialResources.books
    .filter(book => book.lang === notesLang)
    .flatMap(book => book.chapters);
    
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
        {class9SocialResources.books.filter(b => b.lang === contentsLang).map((book, bookIndex) => (
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
        <div className="space-y-4">
        {class9SocialResources.books
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
                              <Link href="#"><Download className="w-4 h-4 mr-1"/>Download</Link>
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
    <Card className="shadow-lg overflow-hidden border-t-8 border-amber-700">
        <div className="bg-gradient-to-r from-amber-500 to-orange-600 text-white p-4">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-3 rounded-full">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold">Class 9 | Social Studies | CBSE</CardTitle>
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
