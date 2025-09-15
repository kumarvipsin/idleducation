
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, BookOpen, ChevronRight, Eye, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const class12ChemistryResources = {
  books: [
    {
      name: "Chemistry Part - I",
      lang: "en",
      chapters: [
        { name: "Chapter 1: Solutions", slug: "solutions" },
        { name: "Chapter 2: Electrochemistry", slug: "electrochemistry" },
        { name: "Chapter 3: Chemical Kinetics", slug: "chemical-kinetics" },
        { name: "Chapter 4: The d- and f-Block Elements", slug: "the-d-and-f-block-elements" },
        { name: "Chapter 5: Coordination Compounds", slug: "coordination-compounds" },
      ],
    },
     {
      name: "Chemistry Part - II",
      lang: "en",
      chapters: [
        { name: "Chapter 6: Haloalkanes and Haloarenes", slug: "haloalkanes-and-haloarenes" },
        { name: "Chapter 7: Alcohols, Phenols and Ethers", slug: "alcohols-phenols-and-ethers" },
        { name: "Chapter 8: Aldehydes, Ketones and Carboxylic Acids", slug: "aldehydes-ketones-and-carboxylic-acids" },
        { name: "Chapter 9: Amines", slug: "amines" },
        { name: "Chapter 10: Biomolecules", slug: "biomolecules-12" },
      ],
    },
    {
      name: "रसायन विज्ञान भाग I (विषय सूचि)",
      lang: "hi",
      chapters: [
        { name: "अध्याय 1: विलयन", slug: "solutions" },
        { name: "अध्याय 2: वैद्युतरसायन", slug: "electrochemistry" },
        { name: "अध्याय 3: रासायनिक बलगतिकी", slug: "chemical-kinetics" },
        { name: "अध्याय 4: d- एवं f- ब्लॉक के तत्त्व", slug: "the-d-and-f-block-elements" },
        { name: "अध्याय 5: उपसहसंयोजन यौगिक", slug: "coordination-compounds" },
      ],
    },
    {
      name: "रसायन विज्ञान भाग II (विषय सूचि)",
      lang: "hi",
      chapters: [
        { name: "अध्याय 6: हैलोऐल्केन तथा हैलोऐरीन", slug: "haloalkanes-and-haloarenes" },
        { name: "अध्याय 7: ऐल्कोहॉल, फ़िनॉल एवं ईथर", slug: "alcohols-phenols-and-ethers" },
        { name: "अध्याय 8: ऐल्डिहाइड, कीटोन एवं कार्बोक्सिलिक अम्ल", slug: "aldehydes-ketones-and-carboxylic-acids" },
        { name: "अध्याय 9: ऐमीन", slug: "amines" },
        { name: "अध्याय 10: जैव-अणु", slug: "biomolecules-12" },
      ],
    },
  ],
};

export default function Class12ChemistryPage() {
  const [notesLang, setNotesLang] = useState<'en' | 'hi'>('en');
  const isMobile = useIsMobile();

  const allChapters = class12ChemistryResources.books
    .filter(book => book.lang === notesLang)
    .flatMap(book => book.chapters);
    
  const contents = (
    <div>
      <h2 className="text-xl md:text-2xl font-bold mb-4 text-foreground lg:hidden">Contents</h2>
      <div className="space-y-4 md:space-y-6">
        {class12ChemistryResources.books.map((book, bookIndex) => (
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
      <div className="bg-gradient-to-r from-purple-500 to-violet-600 text-white p-4">
        <div className="flex items-center gap-4">
          <div className="bg-white/20 p-3 rounded-full">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold">Class 12 | Chemistry</CardTitle>
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
