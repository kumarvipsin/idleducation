
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, BookOpen, ChevronRight, Eye, Download, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const class11PolSciResources = {
  books: [
    {
      name: "Indian Constitution at Work",
      lang: "en",
      chapters: [
        { name: "Chapter 1: Constitution: Why and How?", slug: "constitution-why-and-how" },
        { name: "Chapter 2: Rights in the Indian Constitution", slug: "rights-in-the-indian-constitution" },
        { name: "Chapter 3: Election and Representation", slug: "election-and-representation" },
        { name: "Chapter 4: Executive", slug: "executive" },
        { name: "Chapter 5: Legislature", slug: "legislature" },
        { name: "Chapter 6: Judiciary", slug: "judiciary" },
        { name: "Chapter 7: Federalism", slug: "federalism-11" },
        { name: "Chapter 8: Local Governments", slug: "local-governments" },
        { name: "Chapter 9: Constitution as a Living Document", slug: "constitution-as-a-living-document" },
        { name: "Chapter 10: The Philosophy of the Constitution", slug: "the-philosophy-of-the-constitution" },
      ],
    },
    {
      name: "Political Theory",
      lang: "en",
      chapters: [
        { name: "Chapter 1: Political Theory: An Introduction", slug: "political-theory-an-introduction" },
        { name: "Chapter 2: Freedom", slug: "freedom-11" },
        { name: "Chapter 3: Equality", slug: "equality" },
        { name: "Chapter 4: Social Justice", slug: "social-justice" },
        { name: "Chapter 5: Rights", slug: "rights" },
        { name: "Chapter 6: Citizenship", slug: "citizenship" },
        { name: "Chapter 7: Nationalism", slug: "nationalism" },
        { name: "Chapter 8: Secularism", slug: "secularism" },
        { name: "Chapter 9: Peace", slug: "peace" },
        { name: "Chapter 10: Development", slug: "development-11" },
      ],
    },
    {
      name: "भारत का संविधान: सिद्धांत और व्यवहार (विषय सूचि)",
      lang: "hi",
      chapters: [
        { name: "अध्याय 1: संविधान: क्यों और कैसे?", slug: "constitution-why-and-how" },
        { name: "अध्याय 2: भारतीय संविधान में अधिकार", slug: "rights-in-the-indian-constitution" },
        { name: "अध्याय 3: चुनाव और प्रतिनिधित्व", slug: "election-and-representation" },
        { name: "अध्याय 4: कार्यपालिका", slug: "executive" },
        { name: "अध्याय 5: विधायिका", slug: "legislature" },
        { name: "अध्याय 6: न्यायपालिका", slug: "judiciary" },
        { name: "अध्याय 7: संघवाद", slug: "federalism-11" },
        { name: "अध्याय 8: स्थानीय शासन", slug: "local-governments" },
        { name: "अध्याय 9: संविधान: एक जीवंत दस्तावेज़", slug: "constitution-as-a-living-document" },
        { name: "अध्याय 10: संविधान का राजनीतिक दर्शन", slug: "the-philosophy-of-the-constitution" },
      ],
    },
    {
      name: "राजनीतिक सिद्धांत (विषय सूचि)",
      lang: "hi",
      chapters: [
        { name: "अध्याय 1: राजनीतिक सिद्धांत: एक परिचय", slug: "political-theory-an-introduction" },
        { name: "अध्याय 2: स्वतंत्रता", slug: "freedom-11" },
        { name: "अध्याय 3: समानता", slug: "equality" },
        { name: "अध्याय 4: सामाजिक न्याय", slug: "social-justice" },
        { name: "अध्याय 5: अधिकार", slug: "rights" },
        { name: "अध्याय 6: नागरिकता", slug: "citizenship" },
        { name: "अध्याय 7: राष्ट्रवाद", slug: "nationalism" },
        { name: "अध्याय 8: धर्मनिरपेक्षता", slug: "secularism" },
        { name: "अध्याय 9: शांति", slug: "peace" },
        { name: "अध्याय 10: विकास", slug: "development-11" },
      ],
    },
  ],
};

export default function Class11PolSciPage() {
  const [notesLang, setNotesLang] = useState<'en' | 'hi'>('en');
  const isMobile = useIsMobile();

  const allChapters = class11PolSciResources.books
    .filter(book => book.lang === notesLang)
    .flatMap(book => book.chapters);

  const contents = (
    <div>
      <h2 className="text-xl md:text-2xl font-bold mb-4 text-foreground lg:hidden">Contents</h2>
      <div className="space-y-4 md:space-y-6">
        {class11PolSciResources.books.map((book, bookIndex) => (
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
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-4">
        <div className="flex items-center gap-4">
          <div className="bg-white/20 p-3 rounded-full">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold">Class 11 | Political Science</CardTitle>
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
