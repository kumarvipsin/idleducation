
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, BookOpen, ChevronRight, Eye, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";

const class12BiologyResources = {
  books: [
    {
      name: "Biology Textbook for Class XII",
      lang: "en",
      chapters: [
        { name: "Chapter 1: Sexual Reproduction in Flowering Plants", slug: "sexual-reproduction-in-flowering-plants" },
        { name: "Chapter 2: Human Reproduction", slug: "human-reproduction" },
        { name: "Chapter 3: Reproductive Health", slug: "reproductive-health" },
        { name: "Chapter 4: Principles of Inheritance and Variation", slug: "principles-of-inheritance-and-variation" },
        { name: "Chapter 5: Molecular Basis of Inheritance", slug: "molecular-basis-of-inheritance" },
        { name: "Chapter 6: Evolution", slug: "evolution" },
        { name: "Chapter 7: Human Health and Disease", slug: "human-health-and-disease" },
        { name: "Chapter 8: Microbes in Human Welfare", slug: "microbes-in-human-welfare" },
        { name: "Chapter 9: Biotechnology: Principles and Processes", slug: "biotechnology-principles-and-processes" },
        { name: "Chapter 10: Biotechnology and its Applications", slug: "biotechnology-and-its-applications" },
        { name: "Chapter 11: Organisms and Populations", slug: "organisms-and-populations" },
        { name: "Chapter 12: Ecosystem", slug: "ecosystem" },
        { name: "Chapter 13: Biodiversity and Conservation", slug: "biodiversity-and-conservation" },
      ],
    },
    {
      name: "जीव विज्ञान (विषय सूचि)",
      lang: "hi",
      chapters: [
        { name: "अध्याय 1: पुष्पी पादपों में लैंगिक जनन", slug: "sexual-reproduction-in-flowering-plants" },
        { name: "अध्याय 2: मानव जनन", slug: "human-reproduction" },
        { name: "अध्याय 3: जनन स्वास्थ्य", slug: "reproductive-health" },
        { name: "अध्याय 4: वंशागति तथा विविधता के सिद्धांत", slug: "principles-of-inheritance-and-variation" },
        { name: "अध्याय 5: वंशागति के आणविक आधार", slug: "molecular-basis-of-inheritance" },
        { name: "अध्याय 6: विकास", slug: "evolution" },
        { name: "अध्याय 7: मानव स्वास्थ्य तथा रोग", slug: "human-health-and-disease" },
        { name: "अध्याय 8: मानव कल्याण में सूक्ष्म जीव", slug: "microbes-in-human-welfare" },
        { name: "अध्याय 9: जैव प्रौद्योगिकी-सिद्धांत व प्रक्रम", slug: "biotechnology-principles-and-processes" },
        { name: "अध्याय 10: जैव प्रौद्योगिकी एवं उसके उपयोग", slug: "biotechnology-and-its-applications" },
        { name: "अध्याय 11: जीव और समष्टियाँ", slug: "organisms-and-populations" },
        { name: "अध्याय 12: पारितंत्र", slug: "ecosystem" },
        { name: "अध्याय 13: जैव विविधता एवं संरक्षण", slug: "biodiversity-and-conservation" },
      ],
    },
  ],
};

export default function Class12BiologyPage() {
  const [notesLang, setNotesLang] = useState<'en' | 'hi'>('en');

  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <Card className="shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-lime-500 to-green-600 text-white p-8">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-4 rounded-full">
              <BookOpen className="w-8 h-8" />
            </div>
            <div>
              <CardTitle className="text-3xl font-bold">Class 12 | Biology</CardTitle>
              <CardDescription className="text-lime-100 mt-1">
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
                {class12BiologyResources.books.map((book, bookIndex) => (
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
                {(class12BiologyResources.books.find(b => b.lang === notesLang)?.chapters || []).map((chapter, index) => (
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
