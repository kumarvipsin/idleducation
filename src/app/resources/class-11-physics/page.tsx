
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, BookOpen, ChevronRight, Eye, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";

const class11PhysicsResources = {
  books: [
    {
      name: "Physics Part - I",
      lang: "en",
      chapters: [
        { name: "Chapter 1: Units and Measurements", slug: "units-and-measurements" },
        { name: "Chapter 2: Motion in a Straight Line", slug: "motion-in-a-straight-line" },
        { name: "Chapter 3: Motion in a Plane", slug: "motion-in-a-plane" },
        { name: "Chapter 4: Laws of Motion", slug: "laws-of-motion" },
        { name: "Chapter 5: Work, Energy and Power", slug: "work-energy-and-power" },
        { name: "Chapter 6: System of Particles and Rotational Motion", slug: "system-of-particles-and-rotational-motion" },
        { name: "Chapter 7: Gravitation", slug: "gravitation-11" },
      ],
    },
    {
      name: "Physics Part - II",
      lang: "en",
      chapters: [
        { name: "Chapter 8: Mechanical Properties of Solids", slug: "mechanical-properties-of-solids" },
        { name: "Chapter 9: Mechanical Properties of Fluids", slug: "mechanical-properties-of-fluids" },
        { name: "Chapter 10: Thermal Properties of Matter", slug: "thermal-properties-of-matter" },
        { name: "Chapter 11: Thermodynamics", slug: "thermodynamics" },
        { name: "Chapter 12: Kinetic Theory", slug: "kinetic-theory" },
        { name: "Chapter 13: Oscillations", slug: "oscillations" },
        { name: "Chapter 14: Waves", slug: "waves" },
      ],
    },
    {
      name: "भौतिकी भाग I (विषय सूचि)",
      lang: "hi",
      chapters: [
        { name: "अध्याय 1: मात्रक और मापन", slug: "units-and-measurements" },
        { name: "अध्याय 2: सरल रेखा में गति", slug: "motion-in-a-straight-line" },
        { name: "अध्याय 3: समतल में गति", slug: "motion-in-a-plane" },
        { name: "अध्याय 4: गति के नियम", slug: "laws-of-motion" },
        { name: "अध्याय 5: कार्य, ऊर्जा और शक्ति", slug: "work-energy-and-power" },
        { name: "अध्याय 6: कणों के निकाय तथा घूर्णी गति", slug: "system-of-particles-and-rotational-motion" },
        { name: "अध्याय 7: गुरुत्वाकर्षण", slug: "gravitation-11" },
      ],
    },
    {
      name: "भौतिकी भाग II (विषय सूचि)",
      lang: "hi",
      chapters: [
        { name: "अध्याय 8: ठोसों के यांत्रिक गुण", slug: "mechanical-properties-of-solids" },
        { name: "अध्याय 9: तरलों के यांत्रिकी गुण", slug: "mechanical-properties-of-fluids" },
        { name: "अध्याय 10: द्रव्य के तापीय गुण", slug: "thermal-properties-of-matter" },
        { name: "अध्याय 11: ऊष्मागतिकी", slug: "thermodynamics" },
        { name: "अध्याय 12: अणुगति सिद्धांत", slug: "kinetic-theory" },
        { name: "अध्याय 13: दोलन", slug: "oscillations" },
        { name: "अध्याय 14: तरंगें", slug: "waves" },
      ],
    },
  ],
};

export default function Class11PhysicsPage() {
  const [notesLang, setNotesLang] = useState<'en' | 'hi'>('en');

  const allChapters = class11PhysicsResources.books
    .filter(book => book.lang === notesLang)
    .flatMap(book => book.chapters);

  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <Card className="shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-sky-500 to-cyan-600 text-white p-8">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-4 rounded-full">
              <BookOpen className="w-8 h-8" />
            </div>
            <div>
              <CardTitle className="text-3xl font-bold">Class 11 | Physics</CardTitle>
              <CardDescription className="text-sky-100 mt-1">
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
                {class11PhysicsResources.books.map((book, bookIndex) => (
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
