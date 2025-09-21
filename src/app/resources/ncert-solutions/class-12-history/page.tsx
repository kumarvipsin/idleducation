
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, BookOpen, ChevronRight, Eye, Download, ShoppingCart, Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const class12HistoryResources = {
  books: [
    {
      name: "Themes in Indian History Part - I",
      lang: "en",
      chapters: [
        { name: "Chapter 1: Bricks, Beads and Bones", slug: "bricks-beads-and-bones" },
        { name: "Chapter 2: Kings, Farmers and Towns", slug: "kings-farmers-and-towns" },
        { name: "Chapter 3: Kinship, Caste and Class", slug: "kinship-caste-and-class" },
        { name: "Chapter 4: Thinkers, Beliefs and Buildings", slug: "thinkers-beliefs-and-buildings" },
      ],
    },
    {
      name: "Themes in Indian History Part - II",
      lang: "en",
      chapters: [
        { name: "Chapter 5: Through the Eyes of Travellers", slug: "through-the-eyes-of-travellers" },
        { name: "Chapter 6: Bhakti-Sufi Traditions", slug: "bhakti-sufi-traditions" },
        { name: "Chapter 7: An Imperial Capital: Vijayanagara", slug: "an-imperial-capital-vijayanagara" },
        { name: "Chapter 8: Peasants, Zamindars and the State", slug: "peasants-zamindars-and-the-state" },
      ],
    },
     {
      name: "Themes in Indian History Part - III",
      lang: "en",
      chapters: [
        { name: "Chapter 9: Colonialism and the Countryside", slug: "colonialism-and-the-countryside" },
        { name: "Chapter 10: Rebels and the Raj", slug: "rebels-and-the-raj" },
        { name: "Chapter 11: Mahatma Gandhi and the Nationalist Movement", slug: "mahatma-gandhi-and-the-nationalist-movement" },
        { name: "Chapter 12: Framing the Constitution", slug: "framing-the-constitution" },
      ],
    },
    {
      name: "भारतीय इतिहास के कुछ विषय - भाग I",
      lang: "hi",
      chapters: [
        { name: "विषय 1: ईंटें, मनके तथा अस्थियाँ", slug: "bricks-beads-and-bones" },
        { name: "विषय 2: राजा, किसान और नगर", slug: "kings-farmers-and-towns" },
        { name: "विषय 3: बंधुत्व, जाति तथा वर्ग", slug: "kinship-caste-and-class" },
        { name: "विषय 4: विचारक, विश्वास और इमारतें", slug: "thinkers-beliefs-and-buildings" },
      ],
    },
    {
      name: "भारतीय इतिहास के कुछ विषय - भाग II",
      lang: "hi",
      chapters: [
        { name: "विषय 5: यात्रियों के नज़रिए", slug: "through-the-eyes-of-travellers" },
        { name: "विषय 6: भक्ति-सूफ़ी परंपराएँ", slug: "bhakti-sufi-traditions" },
        { name: "विषय 7: एक साम्राज्य की राजधानी: विजयनगर", slug: "an-imperial-capital-vijayanagara" },
        { name: "विषय 8: किसान, ज़मींदार और राज्य", slug: "peasants-zamindars-and-the-state" },
      ],
    },
     {
      name: "भारतीय इतिहास के कुछ विषय - भाग III",
      lang: "hi",
      chapters: [
        { name: "विषय 9: उपनिवेशवाद और देहात", slug: "colonialism-and-the-countryside" },
        { name: "विषय 10: विद्रोही और राज", slug: "rebels-and-the-raj" },
        { name: "विषय 11: महात्मा गांधी और राष्ट्रीय आंदोलन", slug: "mahatma-gandhi-and-the-nationalist-movement" },
        { name: "विषय 12: संविधान का निर्माण", slug: "framing-the-constitution" },
      ],
    },
  ],
};

export default function Class12HistoryPage() {
  const [notesLang, setNotesLang] = useState<'en' | 'hi'>('en');
  const [contentsLang, setContentsLang] = useState<'en' | 'hi'>('en');
  const isMobile = useIsMobile();

  const allChapters = class12HistoryResources.books
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
        {class12HistoryResources.books.filter(b => b.lang === contentsLang).map((book, bookIndex) => (
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
        {class12HistoryResources.books
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
    <Card className="shadow-lg overflow-hidden border-t-8 border-red-700">
        <div className="bg-gradient-to-r from-red-500 to-rose-600 text-white p-4">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-3 rounded-full">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold">Class 12 | History | CBSE</CardTitle>
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
