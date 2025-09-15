
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, BookOpen, ChevronRight, Eye, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const class12EconomicsResources = {
  books: [
    {
      name: "Introductory Microeconomics",
      lang: "en",
      chapters: [
        { name: "Chapter 1: Introduction", slug: "introduction-micro" },
        { name: "Chapter 2: Theory of Consumer Behaviour", slug: "theory-of-consumer-behaviour" },
        { name: "Chapter 3: Production and Costs", slug: "production-and-costs" },
        { name: "Chapter 4: The Theory of the Firm under Perfect Competition", slug: "theory-of-firm-perfect-competition" },
        { name: "Chapter 5: Market Equilibrium", slug: "market-equilibrium" },
        { name: "Chapter 6: Non-Competitive Markets", slug: "non-competitive-markets" },
      ],
    },
    {
      name: "Introductory Macroeconomics",
      lang: "en",
      chapters: [
        { name: "Chapter 1: Introduction", slug: "introduction-macro" },
        { name: "Chapter 2: National Income Accounting", slug: "national-income-accounting" },
        { name: "Chapter 3: Money and Banking", slug: "money-and-banking" },
        { name: "Chapter 4: Determination of Income and Employment", slug: "determination-of-income-and-employment" },
        { name: "Chapter 5: Government Budget and the Economy", slug: "government-budget-and-the-economy" },
        { name: "Chapter 6: Open Economy Macroeconomics", slug: "open-economy-macroeconomics" },
      ],
    },
    {
      name: "व्यष्टि अर्थशास्त्र: एक परिचय (विषय सूचि)",
      lang: "hi",
      chapters: [
        { name: "अध्याय 1: परिचय", slug: "introduction-micro" },
        { name: "अध्याय 2: उपभोक्ता के व्यवहार का सिद्धांत", slug: "theory-of-consumer-behaviour" },
        { name: "अध्याय 3: उत्पादन तथा लागत", slug: "production-and-costs" },
        { name: "अध्याय 4: पूर्ण प्रतिस्पर्धा की स्थिति में फर्म का सिद्धांत", slug: "theory-of-firm-perfect-competition" },
        { name: "अध्याय 5: बाजार संतुलन", slug: "market-equilibrium" },
        { name: "अध्याय 6: प्रतिस्पर्धारहित बाजार", slug: "non-competitive-markets" },
      ],
    },
    {
      name: "समष्टि अर्थशास्त्र: एक परिचय (विषय सूचि)",
      lang: "hi",
      chapters: [
        { name: "अध्याय 1: परिचय", slug: "introduction-macro" },
        { name: "अध्याय 2: राष्ट्रीय आय का लेखांकन", slug: "national-income-accounting" },
        { name: "अध्याय 3: मुद्रा और बैंकिंग", slug: "money-and-banking" },
        { name: "अध्याय 4: आय और रोजगार के निर्धारण", slug: "determination-of-income-and-employment" },
        { name: "अध्याय 5: सरकारी बजट एवं अर्थव्यवस्था", slug: "government-budget-and-the-economy" },
        { name: "अध्याय 6: खुली अर्थव्यवस्था - समष्टि अर्थशास्त्र", slug: "open-economy-macroeconomics" },
      ],
    },
  ],
};

export default function Class12EconomicsPage() {
  const [notesLang, setNotesLang] = useState<'en' | 'hi'>('en');
  const isMobile = useIsMobile();

  const allChapters = class12EconomicsResources.books
    .filter(book => book.lang === notesLang)
    .flatMap(book => book.chapters);

  const contents = (
    <div>
      <h2 className="text-xl md:text-2xl font-bold mb-4 text-foreground lg:hidden">Contents</h2>
      <div className="space-y-4 md:space-y-6">
        {class12EconomicsResources.books.map((book, bookIndex) => (
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
            <CardTitle className="text-2xl font-bold">Class 12 | Economics</CardTitle>
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
