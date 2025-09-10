
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, BookOpen, ChevronRight, Eye, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";

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

  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <Card className="shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-red-500 to-rose-600 text-white p-8">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-4 rounded-full">
              <BookOpen className="w-8 h-8" />
            </div>
            <div>
              <CardTitle className="text-3xl font-bold">Class 11 | History</CardTitle>
              <CardDescription className="text-red-100 mt-1">
                Explore resources for the 2025 NCERT Syllabus.
              </CardDescription>
            </div>
          </div>
        </div>
        <CardContent className="p-6 bg-muted/20">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-3">
              <h2 className="text-2xl font-bold mb-4 text-foreground">CONTENTS</h2>
              <div className="space-y-6">
                {class11HistoryResources.books.map((book, bookIndex) => (
                  <div key={bookIndex}>
                    <h3 className="text-lg font-semibold mb-3 text-foreground/80">{book.name}</h3>
                    <div className="space-y-2">
                      {book.chapters.map((chapter, chapterIndex) => (
                        <Card key={chapterIndex} className="transition-all duration-300 hover:shadow-md hover:bg-background/80 hover:border-primary/30">
                          <Link href={`/resources/notes-details/${chapter.slug}?lang=${book.lang}`} className="flex items-center justify-between p-4 group">
                            <span className="font-medium text-foreground/90">{chapter.name}</span>
                            <ChevronRight className="w-5 h-5 text-muted-foreground transition-transform duration-300 group-hover:translate-x-1 group-hover:text-primary" />
                          </Link>
                        </Card>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="lg:col-span-2">
              <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-foreground">Premium Notes</h2>
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
                {(class11HistoryResources.books.find(b => b.lang === notesLang)?.chapters || []).map((chapter, index) => (
                  <Card key={index} className="bg-background">
                    <CardContent className="p-3 flex items-center justify-between">
                      <p className="font-medium text-sm flex-1 pr-2">{chapter.name}</p>
                      <div className="flex items-center gap-2">
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
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
