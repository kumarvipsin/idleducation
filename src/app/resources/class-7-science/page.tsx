
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, BookOpen, ChevronRight, Eye, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";

const class7ScienceResources = {
  books: [
    {
      name: "Science Textbook for Class VII",
      lang: "en",
      chapters: [
        { name: "Chapter 1: Nutrition in Plants", slug: "nutrition-in-plants" },
        { name: "Chapter 2: Nutrition in Animals", slug: "nutrition-in-animals" },
        { name: "Chapter 3: Fibre to Fabric", slug: "fibre-to-fabric-7" },
        { name: "Chapter 4: Heat", slug: "heat" },
        { name: "Chapter 5: Acids, Bases and Salts", slug: "acids-bases-and-salts-7" },
        { name: "Chapter 6: Physical and Chemical Changes", slug: "physical-and-chemical-changes" },
        { name: "Chapter 7: Weather, Climate and Adaptations of Animals to Climate", slug: "weather-climate-and-adaptations" },
        { name: "Chapter 8: Winds, Storms and Cyclones", slug: "winds-storms-and-cyclones" },
        { name: "Chapter 9: Soil", slug: "soil" },
        { name: "Chapter 10: Respiration in Organisms", slug: "respiration-in-organisms" },
        { name: "Chapter 11: Transportation in Animals and Plants", slug: "transportation-in-animals-and-plants" },
        { name: "Chapter 12: Reproduction in Plants", slug: "reproduction-in-plants" },
        { name: "Chapter 13: Motion and Time", slug: "motion-and-time" },
        { name: "Chapter 14: Electric Current and its Effects", slug: "electric-current-and-its-effects" },
        { name: "Chapter 15: Light", slug: "light-7" },
        { name: "Chapter 16: Water: A Precious Resource", slug: "water-a-precious-resource" },
        { name: "Chapter 17: Forests: Our Lifeline", slug: "forests-our-lifeline" },
        { name: "Chapter 18: Wastewater Story", slug: "wastewater-story" },
      ],
    },
    {
      name: "विषय सूचि",
      lang: "hi",
      chapters: [
        { name: "अध्याय 1: पादपों में पोषण", slug: "nutrition-in-plants" },
        { name: "अध्याय 2: प्राणियों में पोषण", slug: "nutrition-in-animals" },
        { name: "अध्याय 3: रेशों से वस्त्र तक", slug: "fibre-to-fabric-7" },
        { name: "अध्याय 4: ऊष्मा", slug: "heat" },
        { name: "अध्याय 5: अम्ल, क्षारक और लवण", slug: "acids-bases-and-salts-7" },
        { name: "अध्याय 6: भौतिक एवं रासायनिक परिवर्तन", slug: "physical-and-chemical-changes" },
        { name: "अध्याय 7: मौसम, जलवायु तथा जलवायु के अनुरूप जंतुओं द्वारा अनुकूलन", slug: "weather-climate-and-adaptations" },
        { name: "अध्याय 8: पवन, तूफ़ान और चक्रवात", slug: "winds-storms-and-cyclones" },
        { name: "अध्याय 9: मृदा", slug: "soil" },
        { name: "अध्याय 10: जीवों में श्वसन", slug: "respiration-in-organisms" },
        { name: "अध्याय 11: जंतुओं और पादप में परिवहन", slug: "transportation-in-animals-and-plants" },
        { name: "अध्याय 12: पादप में जनन", slug: "reproduction-in-plants" },
        { name: "अध्याय 13: गति एवं समय", slug: "motion-and-time" },
        { name: "अध्याय 14: विद्युत धारा और इसके प्रभाव", slug: "electric-current-and-its-effects" },
        { name: "अध्याय 15: प्रकाश", slug: "light-7" },
        { name: "अध्याय 16: जल: एक बहुमूल्य संसाधन", slug: "water-a-precious-resource" },
        { name: "अध्याय 17: वन: हमारी जीवन रेखा", slug: "forests-our-lifeline" },
        { name: "अध्याय 18: अपशिष्ट जल की कहानी", slug: "wastewater-story" },
      ],
    },
  ],
};

export default function Class7SciencePage() {
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
              <CardTitle className="text-2xl font-bold">Class 7 | Science</CardTitle>
            </div>
          </div>
        </div>
        <CardContent className="p-6 bg-muted/20">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 max-w-7xl mx-auto">
            <div className="lg:col-span-3">
              <h2 className="text-2xl font-bold mb-4 text-foreground">Contents</h2>
              <div className="space-y-6">
                {class7ScienceResources.books.map((book, bookIndex) => (
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
                {(class7ScienceResources.books.find(b => b.lang === notesLang)?.chapters || []).map((chapter, index) => (
                  <Card key={index} className="bg-background">
                    <CardContent className="p-3 flex items-center justify-between">
                      <p className="font-medium text-sm flex-1 pr-2">{chapter.name}</p>
                      <div className="flex items-center gap-2">
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
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
