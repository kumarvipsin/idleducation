
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, BookOpen, ChevronRight, Eye, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";

const class6ScienceResources = {
  books: [
    {
      name: "Science Textbook for Class VI",
      lang: "en",
      chapters: [
        { name: "Chapter 1: Food: Where Does It Come From?", slug: "food-where-does-it-come-from" },
        { name: "Chapter 2: Components of Food", slug: "components-of-food" },
        { name: "Chapter 3: Fibre to Fabric", slug: "fibre-to-fabric" },
        { name: "Chapter 4: Sorting Materials into Groups", slug: "sorting-materials-into-groups" },
        { name: "Chapter 5: Separation of Substances", slug: "separation-of-substances" },
        { name: "Chapter 6: Changes Around Us", slug: "changes-around-us" },
        { name: "Chapter 7: Getting to Know Plants", slug: "getting-to-know-plants" },
        { name: "Chapter 8: Body Movements", slug: "body-movements" },
        { name: "Chapter 9: The Living Organisms and Their Surroundings", slug: "the-living-organisms-and-their-surroundings" },
        { name: "Chapter 10: Motion and Measurement of Distances", slug: "motion-and-measurement-of-distances" },
        { name: "Chapter 11: Light, Shadows and Reflections", slug: "light-shadows-and-reflections" },
        { name: "Chapter 12: Electricity and Circuits", slug: "electricity-and-circuits" },
      ],
    },
    {
      name: "विषय सूचि",
      lang: "hi",
      chapters: [
        { name: "अध्याय 1: भोजन: यह कहाँ से आता है?", slug: "food-where-does-it-come-from" },
        { name: "अध्याय 2: भोजन के घटक", slug: "components-of-food" },
        { name: "अध्याय 3: तंतु से वस्त्र तक", slug: "fibre-to-fabric" },
        { name: "अध्याय 4: वस्तुओं के समूह बनाना", slug: "sorting-materials-into-groups" },
        { name: "अध्याय 5: पदार्थों का पृथक्करण", slug: "separation-of-substances" },
        { name: "अध्याय 6: हमारे चारों ओर के परिवर्तन", slug: "changes-around-us" },
        { name: "अध्याय 7: पौधों को जानिए", slug: "getting-to-know-plants" },
        { name: "अध्याय 8: शरीर में गति", slug: "body-movements" },
        { name: "अध्याय 9: सजीव एवं उनका परिवेश", slug: "the-living-organisms-and-their-surroundings" },
        { name: "अध्याय 10: गति एवं दूरियों का मापन", slug: "motion-and-measurement-of-distances" },
        { name: "अध्याय 11: प्रकाश – छायाएँ एवं परावर्तन", slug: "light-shadows-and-reflections" },
        { name: "अध्याय 12: विद्युत् तथा परिपथ", slug: "electricity-and-circuits" },
      ],
    },
  ],
};

export default function Class6SciencePage() {
  const [notesLang, setNotesLang] = useState<'en' | 'hi'>('en');

  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <Card className="shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-8">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-4 rounded-full">
              <BookOpen className="w-8 h-8" />
            </div>
            <div>
              <CardTitle className="text-3xl font-bold">Class 6 | Science</CardTitle>
              <CardDescription className="text-blue-100 mt-1">
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
                {class6ScienceResources.books.map((book, bookIndex) => (
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
                {(class6ScienceResources.books.find(b => b.lang === notesLang)?.chapters || []).map((chapter, index) => (
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
