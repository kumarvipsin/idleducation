
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, BookOpen, ChevronRight, Eye, Download, ShoppingCart, Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const class11HistoryResources = {
  books: [
    {
      name: "Themes in World History",
      lang: "en",
      chapters: [
        { name: "Chapter 1: From the Beginning of Time", slug: "from-the-beginning-of-time" },
        { name: "Chapter 2: Writing and City Life", slug: "writing-and-city-life" },
        { name: "Chapter 3: An Empire Across Three Continents", slug: "an-empire-across-three-continents" },
        { name: "Chapter 4: The Central Islamic Lands", slug: "the-central-islamic-lands" },
        { name: "Chapter 5: Nomadic Empires", slug: "nomadic-empires" },
        { name: "Chapter 6: The Three Orders", slug: "the-three-orders" },
        { name: "Chapter 7: Changing Cultural Traditions", slug: "changing-cultural-traditions" },
        { name: "Chapter 8: Confrontation of Cultures", slug: "confrontation-of-cultures" },
        { name: "Chapter 9: The Industrial Revolution", slug: "the-industrial-revolution" },
        { name: "Chapter 10: Displacing Indigenous Peoples", slug: "displacing-indigenous-peoples" },
        { name: "Chapter 11: Paths to Modernisation", slug: "paths-to-modernisation" },
      ],
    },
    {
      name: "विश्व इतिहास के कुछ विषय (विषय सूचि)",
      lang: "hi",
      chapters: [
        { name: "अध्याय 1: समय की शुरुआत से", slug: "from-the-beginning-of-time" },
        { name: "अध्याय 2: लेखन कला और शहरी जीवन", slug: "writing-and-city-life" },
        { name: "अध्याय 3: तीन महाद्वीपों में फैला हुआ साम्राज्य", slug: "an-empire-across-three-continents" },
        { name: "अध्याय 4: इस्लाम का उदय और विस्तार—लगभग 570-1200 ई.", slug: "the-central-islamic-lands" },
        { name: "अध्याय 5: यायावर साम्राज्य", slug: "nomadic-empires" },
        { name: "अध्याय 6: तीन वर्ग", slug: "the-three-orders" },
        { name: "अध्याय 7: बदलती हुई सांस्कृतिक परंपराएँ", slug: "changing-cultural-traditions" },
        { name: "अध्याय 8: संस्कृतियों का टकराव", slug: "confrontation-of-cultures" },
        { name: "अध्याय 9: औद्योगिक क्रांति", slug: "the-industrial-revolution" },
        { name: "अध्याय 10: मूल निवासियों का विस्थापन", slug: "displacing-indigenous-peoples" },
        { name: "अध्याय 11: आधुनिकीकरण के रास्ते", slug: "paths-to-modernisation" },
      ],
    },
  ],
};

export default function Class11HistoryPage() {
  const [notesLang, setNotesLang] = useState<'en' | 'hi'>('en');
  const [contentsLang, setContentsLang] = useState<'en' | 'hi'>('en');
  const isMobile = useIsMobile();

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
        {class11HistoryResources.books.filter(b => b.lang === contentsLang).map((book, bookIndex) => (
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
        {(class11HistoryResources.books.find(b => b.lang === notesLang)?.chapters || []).map((chapter, index) => (
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
      <div className="bg-gradient-to-r from-red-500 to-rose-600 text-white p-4">
        <div className="flex items-center gap-4">
          <div className="bg-white/20 p-3 rounded-full">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold">Class 11 | History | CBSE</CardTitle>
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
