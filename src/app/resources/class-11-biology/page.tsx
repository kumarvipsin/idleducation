
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, BookOpen, ChevronRight, Eye, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";

const class11BiologyResources = {
  books: [
    {
      name: "Biology Textbook for Class XI",
      lang: "en",
      chapters: [
        { name: "Chapter 1: The Living World", slug: "the-living-world" },
        { name: "Chapter 2: Biological Classification", slug: "biological-classification" },
        { name: "Chapter 3: Plant Kingdom", slug: "plant-kingdom" },
        { name: "Chapter 4: Animal Kingdom", slug: "animal-kingdom" },
        { name: "Chapter 5: Morphology of Flowering Plants", slug: "morphology-of-flowering-plants" },
        { name: "Chapter 6: Anatomy of Flowering Plants", slug: "anatomy-of-flowering-plants" },
        { name: "Chapter 7: Structural Organisation in Animals", slug: "structural-organisation-in-animals" },
        { name: "Chapter 8: Cell: The Unit of Life", slug: "cell-the-unit-of-life" },
        { name: "Chapter 9: Biomolecules", slug: "biomolecules" },
        { name: "Chapter 10: Cell Cycle and Cell Division", slug: "cell-cycle-and-cell-division" },
        { name: "Chapter 11: Photosynthesis in Higher Plants", slug: "photosynthesis-in-higher-plants" },
        { name: "Chapter 12: Respiration in Plants", slug: "respiration-in-plants" },
        { name: "Chapter 13: Plant Growth and Development", slug: "plant-growth-and-development" },
        { name: "Chapter 14: Breathing and Exchange of Gases", slug: "breathing-and-exchange-of-gases" },
        { name: "Chapter 15: Body Fluids and Circulation", slug: "body-fluids-and-circulation" },
        { name: "Chapter 16: Excretory Products and their Elimination", slug: "excretory-products-and-their-elimination" },
        { name: "Chapter 17: Locomotion and Movement", slug: "locomotion-and-movement" },
        { name: "Chapter 18: Neural Control and Coordination", slug: "neural-control-and-coordination" },
        { name: "Chapter 19: Chemical Coordination and Integration", slug: "chemical-coordination-and-integration" },
      ],
    },
    {
        name: "विषय सूचि",
        lang: "hi",
        chapters: [
          { name: "अध्याय 1: जीव जगत", slug: "the-living-world" },
          { name: "अध्याय 2: जीव जगत का वर्गीकरण", slug: "biological-classification" },
          { name: "अध्याय 3: वनस्पति जगत", slug: "plant-kingdom" },
          { name: "अध्याय 4: प्राणि जगत", slug: "animal-kingdom" },
          { name: "अध्याय 5: पुष्पी पादपों की आकारिकी", slug: "morphology-of-flowering-plants" },
          { name: "अध्याय 6: पुष्पी पादपों का शरीर", slug: "anatomy-of-flowering-plants" },
          { name: "अध्याय 7: प्राणियों में संरचनात्मक संगठन", slug: "structural-organisation-in-animals" },
          { name: "अध्याय 8: कोशिका: जीवन की इकाई", slug: "cell-the-unit-of-life" },
          { name: "अध्याय 9: जैव अणु", slug: "biomolecules" },
          { name: "अध्याय 10: कोशिका चक्र और कोशिका विभाजन", slug: "cell-cycle-and-cell-division" },
          { name: "अध्याय 11: उच्च पादपों में प्रकाश संश्लेषण", slug: "photosynthesis-in-higher-plants" },
          { name: "अध्याय 12: पादप में श्वसन", slug: "respiration-in-plants" },
          { name: "अध्याय 13: पादप वृद्धि एवं परिवर्धन", slug: "plant-growth-and-development" },
          { name: "अध्याय 14: श्वसन और गैसों का विनिमय", slug: "breathing-and-exchange-of-gases" },
          { name: "अध्याय 15: शरीर द्रव तथा परिसंचरण", slug: "body-fluids-and-circulation" },
          { name: "अध्याय 16: उत्सर्जी उत्पाद एवं उनका निष्कासन", slug: "excretory-products-and-their-elimination" },
          { name: "अध्याय 17: गमन एवं संचलन", slug: "locomotion-and-movement" },
          { name: "अध्याय 18: तंत्रिकीय नियंत्रण एवं समन्वय", slug: "neural-control-and-coordination" },
          { name: "अध्याय 19: रासायनिक समन्वय तथा एकीकरण", slug: "chemical-coordination-and-integration" },
        ],
    }
  ],
};

export default function Class11BiologyPage() {
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
              <CardTitle className="text-3xl font-bold">Class 11 | Biology</CardTitle>
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
                {class11BiologyResources.books.map((book, bookIndex) => (
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
                {(class11BiologyResources.books.find(b => b.lang === notesLang)?.chapters || []).map((chapter, index) => (
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
