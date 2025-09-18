
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, BookOpen, ChevronRight, Eye, Download, ShoppingCart, Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const class7SocialResources = {
  books: [
    {
      name: "Our Pasts - II",
      lang: "en",
      chapters: [
        { name: "Chapter 1: Tracing Changes Through A Thousand Years", slug: "tracing-changes-through-a-thousand-years" },
        { name: "Chapter 2: New Kings And Kingdoms", slug: "new-kings-and-kingdoms" },
        { name: "Chapter 3: The Delhi Sultans", slug: "the-delhi-sultans" },
        { name: "Chapter 4: The Mughal Empire", slug: "the-mughal-empire" },
        { name: "Chapter 5: Rulers And Buildings", slug: "rulers-and-buildings" },
        { name: "Chapter 6: Towns, Traders And Craftspersons", slug: "towns-traders-and-craftspersons" },
        { name: "Chapter 7: Tribes, Nomads And Settled Communities", slug: "tribes-nomads-and-settled-communities" },
        { name: "Chapter 8: Devotional Paths To The Divine", slug: "devotional-paths-to-the-divine" },
      ],
    },
    {
      name: "Our Environment",
      lang: "en",
      chapters: [
        { name: "Chapter 1: Environment", slug: "environment" },
        { name: "Chapter 2: Inside Our Earth", slug: "inside-our-earth" },
        { name: "Chapter 3: Our Changing Earth", slug: "our-changing-earth" },
        { name: "Chapter 4: Air", slug: "air" },
        { name: "Chapter 5: Water", slug: "water" },
        { name: "Chapter 6: Human Environment–Interaction: The Tropical and the Subtropical Region", slug: "human-environment-interaction-tropical-subtropical" },
        { name: "Chapter 7: Life in the Deserts", slug: "life-in-the-deserts" },
      ],
    },
    {
      name: "Social and Political Life - II",
      lang: "en",
      chapters: [
        { name: "Chapter 1: On Equality", slug: "on-equality" },
        { name: "Chapter 2: Role of the Government in Health", slug: "role-of-government-in-health" },
        { name: "Chapter 3: How the State Government Works", slug: "how-the-state-government-works" },
        { name: "Chapter 4: Growing Up as Boys and Girls", slug: "growing-up-as-boys-and-girls" },
        { name: "Chapter 5: Women Change the World", slug: "women-change-the-world" },
        { name: "Chapter 6: Understanding Media", slug: "understanding-media" },
        { name: "Chapter 7: Markets Around Us", slug: "markets-around-us" },
        { name: "Chapter 8: A Shirt in the Market", slug: "a-shirt-in-the-market" },
      ],
    },
    {
      name: "हमारे अतीत - II (विषय सूचि)",
      lang: "hi",
      chapters: [
        { name: "अध्याय 1: हज़ार वर्षों के दौरान हुए परिवर्तनों की पड़ताल", slug: "tracing-changes-through-a-thousand-years" },
        { name: "अध्याय 2: नये राजा और उनके राज्य", slug: "new-kings-and-kingdoms" },
        { name: "अध्याय 3: दिल्ली के सुलतान", slug: "the-delhi-sultans" },
        { name: "अध्याय 4: मुग़ल साम्राज्य", slug: "the-mughal-empire" },
        { name: "अध्याय 5: शासक और इमारतें", slug: "rulers-and-buildings" },
        { name: "अध्याय 6: नगर, व्यापारी और शिल्पीजन", slug: "towns-traders-and-craftspersons" },
        { name: "अध्याय 7: जनजातियाँ, खानाबदोश और एक जगह बसे हुए समुदाय", slug: "tribes-nomads-and-settled-communities" },
        { name: "अध्याय 8: ईश्वर से अनुराग", slug: "devotional-paths-to-the-divine" },
      ],
    },
    {
      name: "हमारा पर्यावरण (विषय सूचि)",
      lang: "hi",
      chapters: [
        { name: "अध्याय 1: पर्यावरण", slug: "environment" },
        { name: "अध्याय 2: हमारी पृथ्वी के अंदर", slug: "inside-our-earth" },
        { name: "अध्याय 3: हमारी बदलती पृथ्वी", slug: "our-changing-earth" },
        { name: "अध्याय 4: वायु", slug: "air" },
        { name: "अध्याय 5: जल", slug: "water" },
        { name: "अध्याय 6: मानव-पर्यावरण अन्योन्यक्रिया: उष्णकटिबंधीय एवं उपोष्ण प्रदेश", slug: "human-environment-interaction-tropical-subtropical" },
        { name: "अध्याय 7: रेगिस्तान में जीवन", slug: "life-in-the-deserts" },
      ],
    },
    {
      name: "सामाजिक एवं राजनीतिक जीवन - II (विषय सूचि)",
      lang: "hi",
      chapters: [
        { name: "अध्याय 1: समानता", slug: "on-equality" },
        { name: "अध्याय 2: स्वास्थ्य में सरकार की भूमिका", slug: "role-of-government-in-health" },
        { name: "अध्याय 3: राज्य शासन कैसे काम करता है", slug: "how-the-state-government-works" },
        { name: "अध्याय 4: लड़के और लड़कियों के रूप में बड़ा होना", slug: "growing-up-as-boys-and-girls" },
        { name: "अध्याय 5: औरतों ने बदली दुनिया", slug: "women-change-the-world" },
        { name: "अध्याय 6: संचार माध्यमों को समझना", slug: "understanding-media" },
        { name: "अध्याय 7: हमारे आस-पास के बाज़ार", slug: "markets-around-us" },
        { name: "अध्याय 8: बाज़ार में एक कमीज़", slug: "a-shirt-in-the-market" },
      ],
    },
  ],
};

export default function Class7SocialPage() {
  const [notesLang, setNotesLang] = useState<'en' | 'hi'>('en');
  const isMobile = useIsMobile();

  const allChapters = class7SocialResources.books
    .filter(book => book.lang === notesLang)
    .flatMap(book => book.chapters);
    
  const contents = (
    <div>
        <h2 className="text-xl md:text-2xl font-bold mb-4 text-foreground lg:hidden">Contents</h2>
        <div className="space-y-4 md:space-y-6">
        {class7SocialResources.books.map((book, bookIndex) => (
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
                        <Link href="#">View</Link>
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
    <Card className="shadow-lg overflow-hidden border-t-8 border-amber-700">
        <div className="bg-gradient-to-r from-amber-500 to-orange-600 text-white p-4">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-3 rounded-full">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold">Class 7 | Social Studies</CardTitle>
            </div>
          </div>
        </div>
        <CardContent className="p-4 md:p-6">
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 max-w-7xl mx-auto">
              <div className="lg:col-span-1">
                <h2 className="text-xl md:text-2xl font-bold mb-4 text-foreground">Contents</h2>
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
