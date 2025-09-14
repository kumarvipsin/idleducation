
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, BookOpen, ChevronRight, Eye, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";

const class8SocialResources = {
  books: [
    {
      name: "Our Pasts - III",
      lang: "en",
      chapters: [
        { name: "Chapter 1: How, When and Where", slug: "how-when-and-where" },
        { name: "Chapter 2: From Trade to Territory", slug: "from-trade-to-territory" },
        { name: "Chapter 3: Ruling the Countryside", slug: "ruling-the-countryside" },
        { name: "Chapter 4: Tribals, Dikus and the Vision of a Golden Age", slug: "tribals-dikus-and-the-vision-of-a-golden-age" },
        { name: "Chapter 5: When People Rebel", slug: "when-people-rebel" },
        { name: "Chapter 6: Weavers, Iron Smelters and Factory Owners", slug: "weavers-iron-smelters-and-factory-owners" },
        { name: "Chapter 7: Civilising the 'Native', Educating the Nation", slug: "civilising-the-native-educating-the-nation" },
        { name: "Chapter 8: Women, Caste and Reform", slug: "women-caste-and-reform" },
        { name: "Chapter 9: The Making of the National Movement: 1870s-1947", slug: "the-making-of-the-national-movement" },
        { name: "Chapter 10: India After Independence", slug: "india-after-independence" },
      ],
    },
    {
      name: "Resources and Development",
      lang: "en",
      chapters: [
        { name: "Chapter 1: Resources", slug: "resources" },
        { name: "Chapter 2: Land, Soil, Water, Natural Vegetation and Wildlife Resources", slug: "land-soil-water-natural-vegetation-and-wildlife-resources" },
        { name: "Chapter 3: Agriculture", slug: "agriculture-8" },
        { name: "Chapter 4: Industries", slug: "industries" },
        { name: "Chapter 5: Human Resources", slug: "human-resources" },
      ],
    },
    {
      name: "Social and Political Life - III",
      lang: "en",
      chapters: [
        { name: "Chapter 1: The Indian Constitution", slug: "the-indian-constitution" },
        { name: "Chapter 2: Understanding Secularism", slug: "understanding-secularism" },
        { name: "Chapter 3: Parliament and the Making of Laws", slug: "parliament-and-the-making-of-laws" },
        { name: "Chapter 4: The Judiciary", slug: "the-judiciary" },
        { name: "Chapter 5: Understanding Marginalisation", slug: "understanding-marginalisation" },
        { name: "Chapter 6: Confronting Marginalisation", slug: "confronting-marginalisation" },
        { name: "Chapter 7: Public Facilities", slug: "public-facilities" },
        { name: "Chapter 8: Law and Social Justice", slug: "law-and-social-justice" },
      ],
    },
    {
      name: "हमारे अतीत - III (विषय सूचि)",
      lang: "hi",
      chapters: [
        { name: "अध्याय 1: कैसे, कब और कहाँ", slug: "how-when-and-where" },
        { name: "अध्याय 2: व्यापार से साम्राज्य तक", slug: "from-trade-to-territory" },
        { name: "अध्याय 3: ग्रामीण क्षेत्र पर शासन चलाना", slug: "ruling-the-countryside" },
        { name: "अध्याय 4: आदिवासी, दीकु और एक स्वर्ण युग की कल्पना", slug: "tribals-dikus-and-the-vision-of-a-golden-age" },
        { name: "अध्याय 5: जब जनता बग़ावत करती है", slug: "when-people-rebel" },
        { name: "अध्याय 6: बुनकर, लोहा बनाने वाले और फैक्ट्री मालिक", slug: "weavers-iron-smelters-and-factory-owners" },
        { name: "अध्याय 7: 'देशी' जनता को सभ्य बनाना, राष्ट्र को शिक्षित करना", slug: "civilising-the-native-educating-the-nation" },
        { name: "अध्याय 8: महिलाएँ, जाति एवं सुधार", slug: "women-caste-and-reform" },
        { name: "अध्याय 9: राष्ट्रीय आंदोलन का संघटन: 1870 के दशक से 1947 तक", slug: "the-making-of-the-national-movement" },
        { name: "अध्याय 10: स्वतंत्रता के बाद भारत", slug: "india-after-independence" },
      ],
    },
    {
      name: "संसाधन एवं विकास (विषय सूचि)",
      lang: "hi",
      chapters: [
        { name: "अध्याय 1: संसाधन", slug: "resources" },
        { name: "अध्याय 2: भूमि, मृदा, जल, प्राकृतिक वनस्पति और वन्य जीवन संसाधन", slug: "land-soil-water-natural-vegetation-and-wildlife-resources" },
        { name: "अध्याय 3: कृषि", slug: "agriculture-8" },
        { name: "अध्याय 4: उद्योग", slug: "industries" },
        { name: "अध्याय 5: मानव संसाधन", slug: "human-resources" },
      ],
    },
    {
      name: "सामाजिक एवं राजनीतिक जीवन - III (विषय सूचि)",
      lang: "hi",
      chapters: [
        { name: "अध्याय 1: भारतीय संविधान", slug: "the-indian-constitution" },
        { name: "अध्याय 2: धर्मनिरपेक्षता की समझ", slug: "understanding-secularism" },
        { name: "अध्याय 3: संसद तथा कानूनों का निर्माण", slug: "parliament-and-the-making-of-laws" },
        { name: "अध्याय 4: न्यायपालिका", slug: "the-judiciary" },
        { name: "अध्याय 5: हाशियाकरण की समझ", slug: "understanding-marginalisation" },
        { name: "अध्याय 6: हाशियाकरण से निपटना", slug: "confronting-marginalisation" },
        { name: "अध्याय 7: जनसुविधाएँ", slug: "public-facilities" },
        { name: "अध्याय 8: कानून और सामाजिक न्याय", slug: "law-and-social-justice" },
      ],
    },
  ],
};

export default function Class8SocialPage() {
  const [notesLang, setNotesLang] = useState<'en' | 'hi'>('en');

  const allChapters = class8SocialResources.books
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
              <CardTitle className="text-2xl font-bold">Class 8 | Social Studies</CardTitle>
            </div>
          </div>
        </div>
        <CardContent className="p-6 bg-muted/20">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 max-w-7xl mx-auto">
            <div className="lg:col-span-3">
              <h2 className="text-2xl font-bold mb-4 text-foreground">Contents</h2>
              <div className="space-y-6">
                {class8SocialResources.books.map((book, bookIndex) => (
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
