
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, BookOpen, ChevronRight, Eye, Download, ShoppingCart, Languages } from "lucide-react";
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
      name: "भारत का संविधान: सिद्धांत और व्यवहार",
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
      name: "राजनीतिक सिद्धांत",
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
  const [contentsLang, setContentsLang] = useState<'en' | 'hi'>('en');
  const isMobile = useIsMobile();

  const allChapters = class11PolSciResources.books
    .filter(book => book.lang === notesLang)
    .flatMap(book => book.chapters);

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
        {class11PolSciResources.books.filter(b => b.lang === contentsLang).map((book, bookIndex) => (
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
        {class11PolSciResources.books
          .filter(book => book.lang === notesLang)
          .map((book, bookIndex) => (
            <div key={bookIndex}>
              <h3 className="text-base md:text-lg font-bold mb-3 text-primary border-b pb-1">{book.name}</h3>
              <div className="space-y-2">
                {book.chapters.map((chapter, index) => (
                  <Card key={index} className="transition-all duration-300 hover:shadow-md hover:bg-background/80 hover:border-primary/30">
                    <div className="flex items-center justify-between p-3 md:p-4 group">
                      <p className="font-medium text-sm md:text-base flex-1 pr-2 text-foreground/90">{chapter.name}</p>
                      <div className="flex items-center gap-1 md:gap-2">
                          <Button asChild variant="ghost" size="sm">
                              <Link href="#">View</Link>
                          </Button>
                          <Button asChild variant="ghost" size="sm">
                              <Link href="#"><Download className="w-4 h-4 mr-1"/>Download</Link>
                          </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
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
            <CardTitle className="text-2xl font-bold">Class 11 | Political Science</CardTitle>
          </div>
        </div>
      </div>
      <CardContent className="p-4 md:p-6">
        {isMobile ? (
          <Tabs defaultValue="contents" className="w-full">
            <TabsList className="grid w-full grid-cols-2 rounded-lg bg-muted/60">
              <TabsTrigger value="contents" className="rounded-md">Contents</TabsTrigger>
              <TabsTrigger value="notes" className="rounded-md">Important Questions</TabsTrigger>
            </TabsList>
            <TabsContent value="contents" className="pt-4">{contents}</TabsContent>
            <TabsContent value="notes" className="pt-4">{primumNotes}</TabsContent>
          </Tabs>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 max-w-7xl mx-auto">
            <div className="lg-col-span-1">
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
            <div className="lg-col-span-1">
              {primumNotes}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
