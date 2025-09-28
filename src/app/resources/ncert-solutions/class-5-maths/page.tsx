
'use client';

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, BookOpen, ChevronRight, Eye, Download, Languages, ShoppingCart, Folder, Dot } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";

const class5MathsResources = {
  books: [
    {
      name: "Math-Magic Textbook for Class V",
      lang: "en",
      chapters: [
        { name: "Chapter 1: The Fish Tale", slug: "the-fish-tale", topics: [{ name: "Topic 1.1", subTopics: [{ name: "Sub-topic 1.1.1" }, { name: "Sub-topic 1.1.2" }] }, { name: "Topic 1.2" }] },
        { name: "Chapter 2: Shapes and Angles", slug: "shapes-and-angles", topics: [{ name: "Topic 2.1" }, { name: "Topic 2.2" }] },
        { name: "Chapter 3: How Many Squares?", slug: "how-many-squares" },
        { name: "Chapter 4: Parts and Wholes", slug: "parts-and-wholes" },
        { name: "Chapter 5: Does it Look the Same?", slug: "does-it-look-the-same" },
        { name: "Chapter 6: Be My Multiple, I'll be Your Factor", slug: "be-my-multiple-ill-be-your-factor" },
        { name: "Chapter 7: Can You See the Pattern?", slug: "can-you-see-the-pattern" },
        { name: "Chapter 8: Mapping Your Way", slug: "mapping-your-way" },
        { name: "Chapter 9: Boxes and Sketches", slug: "boxes-and-sketches" },
        { name: "Chapter 10: Tenths and Hundredths", slug: "tenths-and-hundredths" },
        { name: "Chapter 11: Area and its Boundary", slug: "area-and-its-boundary" },
        { name: "Chapter 12: Smart Charts", slug: "smart-charts" },
        { name: "Chapter 13: Ways to Multiply and Divide", slug: "ways-to-multiply-and-divide" },
        { name: "Chapter 14: How Big, How Heavy?", slug: "how-big-how-heavy" },
      ],
    },
    {
      name: "विषय सूचि",
      lang: "hi",
      chapters: [
        { name: "अध्याय 1: मछली उछली", slug: "the-fish-tale", topics: [{ name: "विषय 1.1", subTopics: [{ name: "उप-विषय 1.1.1" }, { name: "उप-विषय 1.1.2" }] }, { name: "विषय 1.2" }] },
        { name: "अध्याय 2: आकृतियाँ और कोण", slug: "shapes-and-angles", topics: [{ name: "विषय 2.1" }, { name: "विषय 2.2" }] },
        { name: "अध्याय 3: कितने वर्ग?", slug: "how-many-squares" },
        { name: "अध्याय 4: हिस्से और पूरे", slug: "parts-and-wholes" },
        { name: "अध्याय 5: क्या यह एक जैसा दिखता है?", slug: "does-it-look-the-same" },
        { name: "अध्याय 6: मैं तेरा गुणनखंड, गुणज तू मेरा", slug: "be-my-multiple-ill-be-your-factor" },
        { name: "अध्याय 7: क्या तुम्हें पैटर्न दिखा?", slug: "can-you-see-the-pattern" },
        { name: "अध्याय 8: नक्शा", slug: "mapping-your-way" },
        { name: "अध्याय 9: डिब्बे और स्कैच", slug: "boxes-and-sketches" },
        { name: "अध्याय 10: दसवाँ और सौवाँ भाग", slug: "tenths-and-hundredths" },
        { name: "अध्याय 11: क्षेत्रफल और घेरा", slug: "area-and-its-boundary" },
        { name: "अध्याय 12: स्मार्ट चार्ट", slug: "smart-charts" },
        { name: "अध्याय 13: गुणा और भाग के तरीके", slug: "ways-to-multiply-and-divide" },
        { name: "अध्याय 14: कितना बड़ा, कितना भारी?", slug: "how-big-how-heavy" },
      ],
    },
  ],
};

const ContentTree = ({ items, level = 0 }: { items: any[], level?: number }) => {
    if (!items || items.length === 0) return null;

    return (
        <div className={cn("space-y-1", level > 0 && "pl-4")}>
            {items.map((item, index) => {
                const hasChildren = 'topics' in item || 'subTopics' in item;
                const children = ('topics' in item ? item.topics : ('subTopics' in item ? item.subTopics : [])) || [];
                
                return (
                    <div key={index} className="py-1">
                        <div className="flex items-center gap-2">
                           <span className={cn(
                                "text-sm",
                                level > 0 ? "font-normal text-foreground/80" : "font-semibold text-foreground",
                            )}>
                                {item.name}
                            </span>
                        </div>
                        {hasChildren && children.length > 0 && <ContentTree items={children} level={level + 1} />}
                    </div>
                );
            })}
        </div>
    );
};

export default function Class5MathsPage() {
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
       <Accordion type="single" collapsible className="w-full space-y-2">
        {class5MathsResources.books.filter(b => b.lang === contentsLang).map((book, bookIndex) => (
            <React.Fragment key={bookIndex}>
                {book.chapters.map((chapter, chapterIndex) => (
                    <Card key={chapterIndex} className="transition-all duration-300 hover:shadow-md hover:bg-background/80 hover:border-primary/30">
                        <AccordionItem value={`chapter-${chapterIndex}`} className="border-b-0">
                            <div className="flex items-center justify-between p-3 md:p-4 group">
                                <AccordionTrigger className="flex-1 font-medium text-sm md:text-base text-foreground/90 text-left hover:no-underline p-0">
                                    {chapter.name}
                                </AccordionTrigger>
                                <div className="flex items-center gap-1">
                                    <Button asChild variant="ghost" size="icon" className="h-8 w-8">
                                        <Link href="#"><Eye className="h-4 w-4"/></Link>
                                    </Button>
                                    <Button asChild variant="ghost" size="icon" className="h-8 w-8">
                                        <Link href="#"><ShoppingCart className="h-4 w-4"/></Link>
                                    </Button>
                                </div>
                            </div>
                            <AccordionContent className="p-4 pt-0">
                                <ContentTree items={chapter.topics || []} />
                            </AccordionContent>
                        </AccordionItem>
                    </Card>
                ))}
            </React.Fragment>
        ))}
      </Accordion>
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
        {(class5MathsResources.books.find(b => b.lang === notesLang)?.chapters || []).map((chapter, index) => (
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
    <Card className="shadow-lg overflow-hidden border-t-8 border-green-700">
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-4">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-3 rounded-full">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold">Class 5 | Maths | CBSE</CardTitle>
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
