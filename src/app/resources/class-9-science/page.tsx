
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, BookOpen, ChevronRight, Eye, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";

const class9ScienceResources = {
  books: [
    {
      name: "Science Textbook for Class IX",
      lang: "en",
      chapters: [
        { name: "Chapter 1: Matter in Our Surroundings", slug: "matter-in-our-surroundings" },
        { name: "Chapter 2: Is Matter Around Us Pure", slug: "is-matter-around-us-pure" },
        { name: "Chapter 3: Atoms and Molecules", slug: "atoms-and-molecules" },
        { name: "Chapter 4: Structure of the Atom", slug: "structure-of-the-atom" },
        { name: "Chapter 5: The Fundamental Unit of Life", slug: "the-fundamental-unit-of-life" },
        { name: "Chapter 6: Tissues", slug: "tissues" },
        { name: "Chapter 7: Motion", slug: "motion" },
        { name: "Chapter 8: Force and Laws of Motion", slug: "force-and-laws-of-motion" },
        { name: "Chapter 9: Gravitation", slug: "gravitation" },
        { name: "Chapter 10: Work and Energy", slug: "work-and-energy" },
        { name: "Chapter 11: Sound", slug: "sound" },
        { name: "Chapter 12: Improvement in Food Resources", slug: "improvement-in-food-resources" },
      ],
    },
    {
      name: "विषय सूचि",
      lang: "hi",
      chapters: [
        { name: "अध्याय 1: हमारे आस-पास के पदार्थ", slug: "matter-in-our-surroundings" },
        { name: "अध्याय 2: क्या हमारे आस-पास के पदार्थ शुद्ध हैं", slug: "is-matter-around-us-pure" },
        { name: "अध्याय 3: परमाणु एवं अणु", slug: "atoms-and-molecules" },
        { name: "अध्याय 4: परमाणु की संरचना", slug: "structure-of-the-atom" },
        { name: "अध्याय 5: जीवन की मौलिक इकाई", slug: "the-fundamental-unit-of-life" },
        { name: "अध्याय 6: ऊतक", slug: "tissues" },
        { name: "अध्याय 7: गति", slug: "motion" },
        { name: "अध्याय 8: बल तथा गति के नियम", slug: "force-and-laws-of-motion" },
        { name: "अध्याय 9: गुरुत्वाकर्षण", slug: "gravitation" },
        { name: "अध्याय 10: कार्य तथा ऊर्जा", slug: "work-and-energy" },
        { name: "अध्याय 11: ध्वनि", slug: "sound" },
        { name: "अध्याय 12: खाद्य संसाधनों में सुधार", slug: "improvement-in-food-resources" },
      ],
    },
  ],
};

export default function Class9SciencePage() {
  const [notesLang, setNotesLang] = useState<'en' | 'hi'>('en');

  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <Card className="shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-4">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-3 rounded-full">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold">Class 9 | Science</CardTitle>
            </div>
          </div>
        </div>
        <CardContent className="p-6 bg-muted/20">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-3">
              <h2 className="text-2xl font-bold mb-4 text-foreground">Contents</h2>
              <div className="space-y-6">
                {class9ScienceResources.books.map((book, bookIndex) => (
                  <div key={bookIndex}>
                    {book.lang === 'hi' && <h3 className="text-lg font-semibold mb-3 text-foreground/80">{book.name}</h3>}
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
                {(class9ScienceResources.books.find(b => b.lang === notesLang)?.chapters || []).map((chapter, index) => (
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
