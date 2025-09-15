
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, BookOpen, ChevronRight, Eye, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const class11EconomicsResources = {
  books: [
    {
      name: "Indian Economic Development",
      lang: "en",
      chapters: [
        { name: "Chapter 1: Indian Economy on the Eve of Independence", slug: "indian-economy-on-the-eve-of-independence" },
        { name: "Chapter 2: Indian Economy 1950-1990", slug: "indian-economy-1950-1990" },
        { name: "Chapter 3: Liberalisation, Privatisation and Globalisation: An Appraisal", slug: "liberalisation-privatisation-and-globalisation" },
        { name: "Chapter 4: Poverty", slug: "poverty" },
        { name: "Chapter 5: Human Capital Formation in India", slug: "human-capital-formation-in-india" },
        { name: "Chapter 6: Rural Development", slug: "rural-development" },
        { name: "Chapter 7: Employment: Growth, Informalisation and other Issues", slug: "employment-growth-informalisation-and-other-issues" },
        { name: "Chapter 8: Infrastructure", slug: "infrastructure" },
        { name: "Chapter 9: Environment and Sustainable Development", slug: "environment-and-sustainable-development" },
        { name: "Chapter 10: Comparative Development Experiences of India and its Neighbours", slug: "comparative-development-experiences" },
      ],
    },
    {
      name: "Statistics for Economics",
      lang: "en",
      chapters: [
        { name: "Chapter 1: Introduction", slug: "introduction-stats" },
        { name: "Chapter 2: Collection of Data", slug: "collection-of-data" },
        { name: "Chapter 3: Organisation of Data", slug: "organisation-of-data" },
        { name: "Chapter 4: Presentation of Data", slug: "presentation-of-data" },
        { name: "Chapter 5: Measures of Central Tendency", slug: "measures-of-central-tendency" },
        { name: "Chapter 6: Measures of Dispersion", slug: "measures-of-dispersion" },
        { name: "Chapter 7: Correlation", slug: "correlation" },
        { name: "Chapter 8: Index Numbers", slug: "index-numbers" },
      ],
    },
    {
      name: "भारतीय आर्थिक विकास (विषय सूचि)",
      lang: "hi",
      chapters: [
        { name: "अध्याय 1: स्वतंत्रता की पूर्व संध्या पर भारतीय अर्थव्यवस्था", slug: "indian-economy-on-the-eve-of-independence" },
        { name: "अध्याय 2: भारतीय अर्थव्यवस्था 1950-1990", slug: "indian-economy-1950-1990" },
        { name: "अध्याय 3: उदारीकरण, निजीकरण और वैश्वीकरण: एक समीक्षा", slug: "liberalisation-privatisation-and-globalisation" },
        { name: "अध्याय 4: निर्धनता", slug: "poverty" },
        { name: "अध्याय 5: भारत में मानव पूँजी का निर्माण", slug: "human-capital-formation-in-india" },
        { name: "अध्याय 6: ग्रामीण विकास", slug: "rural-development" },
        { name: "अध्याय 7: रोजगार-संवृद्धि, अनौपचारीकरण एवं अन्य मुद्दे", slug: "employment-growth-informalisation-and-other-issues" },
        { name: "अध्याय 8: आधारिक संरचना", slug: "infrastructure" },
        { name: "अध्याय 9: पर्यावरण और धारणीय विकास", slug: "environment-and-sustainable-development" },
        { name: "अध्याय 10: भारत और उसके पड़ोसी देशों के तुलनात्मक विकास अनुभव", slug: "comparative-development-experiences" },
      ],
    },
    {
      name: "अर्थशास्त्र में सांख्यिकी (विषय सूचि)",
      lang: "hi",
      chapters: [
        { name: "अध्याय 1: परिचय", slug: "introduction-stats" },
        { name: "अध्याय 2: आँकड़ों का संग्रह", slug: "collection-of-data" },
        { name: "अध्याय 3: आँकड़ों का संगठन", slug: "organisation-of-data" },
        { name: "अध्याय 4: आँकड़ों का प्रस्तुतीकरण", slug: "presentation-of-data" },
        { name: "अध्याय 5: केंद्रीय प्रवृत्ति की माप", slug: "measures-of-central-tendency" },
        { name: "अध्याय 6: परिक्षेपण के माप", slug: "measures-of-dispersion" },
        { name: "अध्याय 7: सहसंबंध", slug: "correlation" },
        { name: "अध्याय 8: सूचकांक", slug: "index-numbers" },
      ],
    },
  ],
};

export default function Class11EconomicsPage() {
  const [notesLang, setNotesLang] = useState<'en' | 'hi'>('en');
  const isMobile = useIsMobile();

  const allChapters = class11EconomicsResources.books
    .filter(book => book.lang === notesLang)
    .flatMap(book => book.chapters);

  const contents = (
    <div>
      <h2 className="text-xl md:text-2xl font-bold mb-4 text-foreground lg:hidden">Contents</h2>
      <div className="space-y-4 md:space-y-6">
        {class11EconomicsResources.books.map((book, bookIndex) => (
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
          <h2 className="text-xl md:text-2xl font-bold text-foreground">Important Questions</h2>
          <div className="flex items-center border rounded-md p-1 bg-background/50">
              <button 
                  onClick={() => setNotesLang('en')}
                  className={cn("px-2 py-1 text-xs rounded-sm", notesLang === 'en' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground')}>
                  EN
              </button>
              <button 
                  onClick={() => setNotesLang('hi')}
                  className={cn("px-2 py-1 text-xs rounded-sm", notesLang === 'hi' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground')}>
                  HI
              </button>
          </div>
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
    <Card className="shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-pink-500 to-rose-600 text-white p-4">
        <div className="flex items-center gap-4">
          <div className="bg-white/20 p-3 rounded-full">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold">Class 11 | Economics</CardTitle>
          </div>
        </div>
      </div>
      <CardContent className="p-4 md:p-6 bg-muted/20">
        {isMobile ? (
          <Tabs defaultValue="contents" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="contents">Contents</TabsTrigger>
              <TabsTrigger value="notes">Primum Notes</TabsTrigger>
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
