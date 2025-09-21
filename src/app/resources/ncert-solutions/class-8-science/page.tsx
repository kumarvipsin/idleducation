
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, BookOpen, ChevronRight, Eye, Download, ShoppingCart, Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const class8ScienceResources = {
  books: [
    {
      name: "Science Textbook for Class VIII",
      lang: "en",
      chapters: [
        { name: "Chapter 1: Crop Production and Management", slug: "crop-production-and-management" },
        { name: "Chapter 2: Microorganisms: Friend and Foe", slug: "microorganisms-friend-and-foe" },
        { name: "Chapter 3: Coal and Petroleum", slug: "coal-and-petroleum" },
        { name: "Chapter 4: Combustion and Flame", slug: "combustion-and-flame" },
        { name: "Chapter 5: Conservation of Plants and Animals", slug: "conservation-of-plants-and-animals" },
        { name: "Chapter 6: Reproduction in Animals", slug: "reproduction-in-animals" },
        { name: "Chapter 7: Reaching the Age of Adolescence", slug: "reaching-the-age-of-adolescence" },
        { name: "Chapter 8: Force and Pressure", slug: "force-and-pressure" },
        { name: "Chapter 9: Friction", slug: "friction" },
        { name: "Chapter 10: Sound", slug: "sound-8" },
        { name: "Chapter 11: Chemical Effects of Electric Current", slug: "chemical-effects-of-electric-current" },
        { name: "Chapter 12: Some Natural Phenomena", slug: "some-natural-phenomena" },
        { name: "Chapter 13: Light", slug: "light" },
      ],
    },
    {
      name: "विषय सूचि",
      lang: "hi",
      chapters: [
        { name: "अध्याय 1: फसल उत्पादन एवं प्रबंध", slug: "crop-production-and-management" },
        { name: "अध्याय 2: सूक्ष्मजीव: मित्र एवं शत्रु", slug: "microorganisms-friend-and-foe" },
        { name: "अध्याय 3: कोयला और पेट्रोलियम", slug: "coal-and-petroleum" },
        { name: "अध्याय 4: दहन और ज्वाला", slug: "combustion-and-flame" },
        { name: "अध्याय 5: पौधों एवं जंतुओं का संरक्षण", slug: "conservation-of-plants-and-animals" },
        { name: "अध्याय 6: जंतुओं में जनन", slug: "reproduction-in-animals" },
        { name: "अध्याय 7: किशोरावस्था की ओर", slug: "reaching-the-age-of-adolescence" },
        { name: "अध्याय 8: बल तथा दाब", slug: "force-and-pressure" },
        { name: "अध्याय 9: घर्षण", slug: "friction" },
        { name: "अध्याय 10: ध्वनि", slug: "sound-8" },
        { name: "अध्याय 11: विद्युत धारा के रासायनिक प्रभाव", slug: "chemical-effects-of-electric-current" },
        { name: "अध्याय 12: कुछ प्राकृतिक परिघटनाएँ", slug: "some-natural-phenomena" },
        { name: "अध्याय 13: प्रकाश", slug: "light" },
      ],
    },
  ],
};

export default function Class8SciencePage() {
  const [notesLang, setNotesLang] = useState<'en' | 'hi'>('en');
  const [contentsLang, setContentsLang] = useState<'en' | 'hi'>('en');
  const isMobile = useIsMobile();
  
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
        {class8ScienceResources.books.filter(b => b.lang === contentsLang).map((book, bookIndex) => (
            <div key={bookIndex}>
            
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
        <div className="space-y-2">
          {(class8ScienceResources.books.find(b => b.lang === notesLang)?.chapters || []).map((chapter, index) => (
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
  );

  return (
    <Card className="shadow-lg overflow-hidden border-t-8 border-blue-700">
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-4">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-3 rounded-full">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold">Class 8 | Science | CBSE</CardTitle>
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
