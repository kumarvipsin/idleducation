
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, BookOpen, ChevronRight, Eye, Download, ShoppingCart, Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
  const [contentsLang, setContentsLang] = useState<'en' | 'hi'>('en');
  const isMobile = useIsMobile();
  
  const contents = (
    <div>
      <div className="flex justify-between items-center mb-4 lg:hidden">
        <h2 className="text-xl md:text-2xl font-bold mb-4 text-foreground pb-2 bg-gradient-to-r from-red-500 from-50% to-primary to-50% bg-no-repeat bg-bottom inline-block" style={{ backgroundSize: '100% 2px' }}>Contents</h2>
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
      <div className="space-y-4 md:space-y-6">
        {class11BiologyResources.books.filter(b => b.lang === contentsLang).map((book, bookIndex) => (
          <div key={bookIndex}>
            
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
      <div className="space-y-4">
        {class11BiologyResources.books
          .filter(book => book.lang === notesLang)
          .map((book, bookIndex) => (
            <div key={bookIndex}>
              <div className="space-y-2">
                {book.chapters.map((chapter, index) => (
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
          ))}
      </div>
    </div>
  );

  return (
    <Card className="shadow-lg overflow-hidden border-t-8 border-lime-700">
      <div className="bg-gradient-to-r from-lime-500 to-green-600 text-white p-4">
        <div className="flex items-center gap-4">
          <div className="bg-white/20 p-3 rounded-full">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold">Class 11 | Biology | CBSE</CardTitle>
          </div>
        </div>
      </div>
      <CardContent className="p-4 md:p-6 bg-muted/20">
        {isMobile ? (
          <Tabs defaultValue="contents" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-muted/60 rounded-lg">
              <TabsTrigger value="contents" className="rounded-md">Contents</TabsTrigger>
              <TabsTrigger value="notes" className="rounded-md">Important Questions</TabsTrigger>
            </TabsList>
            <TabsContent value="contents" className="pt-4">{contents}</TabsContent>
            <TabsContent value="notes" className="pt-4">{primumNotes}</TabsContent>
          </Tabs>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 max-w-7xl mx-auto">
            <div className="lg-col-span-1">
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
            <div className="lg-col-span-1">
              {primumNotes}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
