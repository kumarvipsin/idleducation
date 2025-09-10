
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, BookOpen, ChevronRight, Eye, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";

const class12GeographyResources = {
  books: [
    {
      name: "Fundamentals of Human Geography",
      lang: "en",
      chapters: [
        { name: "Chapter 1: Human Geography: Nature and Scope", slug: "human-geography-nature-and-scope" },
        { name: "Chapter 2: The World Population: Distribution, Density and Growth", slug: "the-world-population-distribution-density-and-growth" },
        { name: "Chapter 3: Human Development", slug: "human-development" },
        { name: "Chapter 4: Primary Activities", slug: "primary-activities" },
        { name: "Chapter 5: Secondary Activities", slug: "secondary-activities" },
        { name: "Chapter 6: Tertiary and Quaternary Activities", slug: "tertiary-and-quaternary-activities" },
        { name: "Chapter 7: Transport and Communication", slug: "transport-and-communication" },
        { name: "Chapter 8: International Trade", slug: "international-trade" },
      ],
    },
    {
      name: "India: People and Economy",
      lang: "en",
      chapters: [
        { name: "Chapter 1: Population: Distribution, Density, Growth and Composition", slug: "population-distribution-density-growth-and-composition" },
        { name: "Chapter 2: Human Settlements", slug: "human-settlements" },
        { name: "Chapter 3: Land Resources and Agriculture", slug: "land-resources-and-agriculture" },
        { name: "Chapter 4: Water Resources", slug: "water-resources-12" },
        { name: "Chapter 5: Mineral and Energy Resources", slug: "mineral-and-energy-resources-12" },
        { name: "Chapter 6: Planning and Sustainable Development in Indian Context", slug: "planning-and-sustainable-development-in-indian-context" },
        { name: "Chapter 7: Transport and Communication", slug: "transport-and-communication-india" },
        { name: "Chapter 8: International Trade", slug: "international-trade-india" },
        { name: "Chapter 9: Geographical Perspective on Selected Issues and Problems", slug: "geographical-perspective-on-selected-issues-and-problems" },
      ],
    },
    {
      name: "मानव भूगोल के मूल सिद्धांत (विषय सूचि)",
      lang: "hi",
      chapters: [
        { name: "अध्याय 1: मानव भूगोल – प्रकृति एवं विषय क्षेत्र", slug: "human-geography-nature-and-scope" },
        { name: "अध्याय 2: विश्व जनसंख्या-वितरण, घनत्व और वृद्धि", slug: "the-world-population-distribution-density-and-growth" },
        { name: "अध्याय 3: मानव विकास", slug: "human-development" },
        { name: "अध्याय 4: प्राथमिक क्रियाएँ", slug: "primary-activities" },
        { name: "अध्याय 5: द्वितीयक क्रियाएँ", slug: "secondary-activities" },
        { name: "अध्याय 6: तृतीयक और चतुर्थ क्रियाकलाप", slug: "tertiary-and-quaternary-activities" },
        { name: "अध्याय 7: परिवहन एवं संचार", slug: "transport-and-communication" },
        { name: "अध्याय 8: अंतर्राष्ट्रीय व्यापार", slug: "international-trade" },
      ],
    },
    {
      name: "भारत - लोग और अर्थव्यवस्था (विषय सूचि)",
      lang: "hi",
      chapters: [
        { name: "अध्याय 1: जनसंख्या: वितरण, घनत्व, वृद्धि और संघटन", slug: "population-distribution-density-growth-and-composition" },
        { name: "अध्याय 2: मानव बस्तियाँ", slug: "human-settlements" },
        { name: "अध्याय 3: भूसंसाधन तथा कृषि", slug: "land-resources-and-agriculture" },
        { name: "अध्याय 4: जल-संसाधन", slug: "water-resources-12" },
        { name: "अध्याय 5: खनिज तथा ऊर्जा संसाधन", slug: "mineral-and-energy-resources-12" },
        { name: "अध्याय 6: भारत के संदर्भ में नियोजन और सततपोषणीय विकास", slug: "planning-and-sustainable-development-in-indian-context" },
        { name: "अध्याय 7: परिवहन तथा संचार", slug: "transport-and-communication-india" },
        { name: "अध्याय 8: अंतर्राष्ट्रीय व्यापार", slug: "international-trade-india" },
        { name: "अध्याय 9: भौगोलिक परिप्रेक्ष्य में चयनित कुछ मुद्दे एवं समस्याएँ", slug: "geographical-perspective-on-selected-issues-and-problems" },
      ],
    },
  ],
};

export default function Class12GeographyPage() {
  const [notesLang, setNotesLang] = useState<'en' | 'hi'>('en');

  const allChapters = class12GeographyResources.books
    .filter(book => book.lang === notesLang)
    .flatMap(book => book.chapters);

  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <Card className="shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-amber-500 to-orange-600 text-white p-4">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-3 rounded-full">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold">Class 12 | Geography</CardTitle>
            </div>
          </div>
        </div>
        <CardContent className="p-6 bg-muted/20">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-3">
              <h2 className="text-2xl font-bold mb-4 text-foreground">Contents</h2>
              <div className="space-y-6">
                {class12GeographyResources.books.map((book, bookIndex) => (
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
                  <h2 className="text-2xl font-bold text-foreground">Important Questions</h2>
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
