
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, BookOpen, ChevronRight, Eye, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";

const class10SocialResources = {
  books: [
    {
      name: "India and the Contemporary World - II",
      lang: "en",
      chapters: [
        { name: "Chapter 1: The Rise of Nationalism in Europe", slug: "the-rise-of-nationalism-in-europe" },
        { name: "Chapter 2: Nationalism in India", slug: "nationalism-in-india" },
        { name: "Chapter 3: The Making of a Global World", slug: "the-making-of-a-global-world" },
        { name: "Chapter 4: The Age of Industrialisation", slug: "the-age-of-industrialisation" },
        { name: "Chapter 5: Print Culture and the Modern World", slug: "print-culture-and-the-modern-world" },
      ],
    },
     {
      name: "Contemporary India - II",
      lang: "en",
      chapters: [
        { name: "Chapter 1: Resources and Development", slug: "resources-and-development" },
        { name: "Chapter 2: Forest and Wildlife Resources", slug: "forest-and-wildlife-resources" },
        { name: "Chapter 3: Water Resources", slug: "water-resources" },
        { name: "Chapter 4: Agriculture", slug: "agriculture" },
        { name: "Chapter 5: Minerals and Energy Resources", slug: "minerals-and-energy-resources" },
        { name: "Chapter 6: Manufacturing Industries", slug: "manufacturing-industries" },
        { name: "Chapter 7: Lifelines of National Economy", slug: "lifelines-of-national-economy" },
      ],
    },
    {
      name: "Democratic Politics - II",
      lang: "en",
      chapters: [
        { name: "Chapter 1: Power-sharing", slug: "power-sharing" },
        { name: "Chapter 2: Federalism", slug: "federalism" },
        { name: "Chapter 3: Gender, Religion and Caste", slug: "gender-religion-and-caste" },
        { name: "Chapter 4: Political Parties", slug: "political-parties" },
        { name: "Chapter 5: Outcomes of Democracy", slug: "outcomes-of-democracy" },
      ],
    },
    {
      name: "Understanding Economic Development",
      lang: "en",
      chapters: [
        { name: "Chapter 1: Development", slug: "development" },
        { name: "Chapter 2: Sectors of the Indian Economy", slug: "sectors-of-the-indian-economy" },
        { name: "Chapter 3: Money and Credit", slug: "money-and-credit" },
        { name: "Chapter 4: Globalisation and the Indian Economy", slug: "globalisation-and-the-indian-economy" },
        { name: "Chapter 5: Consumer Rights", slug: "consumer-rights" },
      ],
    },
    {
      name: "भारत और समकालीन विश्व - II (विषय सूचि)",
      lang: "hi",
      chapters: [
        { name: "अध्याय 1: यूरोप में राष्ट्रवाद का उदय", slug: "the-rise-of-nationalism-in-europe" },
        { name: "अध्याय 2: भारत में राष्ट्रवाद", slug: "nationalism-in-india" },
        { name: "अध्याय 3: भूमंडलीकृत विश्व का बनना", slug: "the-making-of-a-global-world" },
        { name: "अध्याय 4: औद्योगिकीकरण का युग", slug: "the-age-of-industrialisation" },
        { name: "अध्याय 5: मुद्रण संस्कृति और आधुनिक दुनिया", slug: "print-culture-and-the-modern-world" },
      ],
    },
     {
      name: "समकालीन भारत - II (विषय सूचि)",
      lang: "hi",
      chapters: [
        { name: "अध्याय 1: संसाधन एवं विकास", slug: "resources-and-development" },
        { name: "अध्याय 2: वन और वन्यजीव संसाधन", slug: "forest-and-wildlife-resources" },
        { name: "अध्याय 3: जल संसाधन", slug: "water-resources" },
        { name: "अध्याय 4: कृषि", slug: "agriculture" },
        { name: "अध्याय 5: खनिज तथा ऊर्जा संसाधन", slug: "minerals-and-energy-resources" },
        { name: "अध्याय 6: विनिर्माण उद्योग", slug: "manufacturing-industries" },
        { name: "अध्याय 7: राष्ट्रीय अर्थव्यवस्था की जीवन रेखाएँ", slug: "lifelines-of-national-economy" },
      ],
    },
    {
      name: "लोकतांत्रिक राजनीति - II (विषय सूचि)",
      lang: "hi",
      chapters: [
        { name: "अध्याय 1: सत्ता की साझेदारी", slug: "power-sharing" },
        { name: "अध्याय 2: संघवाद", slug: "federalism" },
        { name: "अध्याय 3: लिंग, धर्म और जाति", slug: "gender-religion-and-caste" },
        { name: "अध्याय 4: राजनीतिक दल", slug: "political-parties" },
        { name: "अध्याय 5: लोकतंत्र के परिणाम", slug: "outcomes-of-democracy" },
      ],
    },
    {
      name: "आर्थिक विकास की समझ (विषय सूचि)",
      lang: "hi",
      chapters: [
        { name: "अध्याय 1: विकास", slug: "development" },
        { name: "अध्याय 2: भारतीय अर्थव्यवस्था के क्षेत्रक", slug: "sectors-of-the-indian-economy" },
        { name: "अध्याय 3: मुद्रा और साख", slug: "money-and-credit" },
        { name: "अध्याय 4: वैश्वीकरण और भारतीय अर्थव्यवस्था", slug: "globalisation-and-the-indian-economy" },
        { name: "अध्याय 5: उपभोक्ता अधिकार", slug: "consumer-rights" },
      ],
    },
  ],
};

export default function Class10SocialPage() {
  const [notesLang, setNotesLang] = useState<'en' | 'hi'>('en');

  const allChapters = class10SocialResources.books
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
              <CardTitle className="text-2xl font-bold">Class 10 | Social Studies</CardTitle>
            </div>
          </div>
        </div>
        <CardContent className="p-6 bg-muted/20">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-3">
              <h2 className="text-2xl font-bold mb-4 text-foreground">Contents</h2>
              <div className="space-y-6">
                {class10SocialResources.books.map((book, bookIndex) => (
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
