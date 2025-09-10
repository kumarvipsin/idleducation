
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, BookOpen, ChevronRight, Eye, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";

const class6SocialResources = {
  books: [
    {
      name: "Our Pasts - I",
      lang: "en",
      chapters: [
        { name: "Chapter 1: What, Where, How and When?", slug: "what-where-how-and-when" },
        { name: "Chapter 2: On The Trail of The Earliest People", slug: "from-hunting-gathering-to-growing-food" },
        { name: "Chapter 3: In the Earliest Cities", slug: "in-the-earliest-cities" },
        { name: "Chapter 4: What Books and Burials Tell Us", slug: "what-books-and-burials-tell-us" },
        { name: "Chapter 5: Kingdoms, Kings and an Early Republic", slug: "kingdoms-kings-and-an-early-republic" },
        { name: "Chapter 6: New Questions and Ideas", slug: "new-questions-and-ideas" },
        { name: "Chapter 7: Ashoka, The Emperor Who Gave Up War", slug: "ashoka-the-emperor-who-gave-up-war" },
        { name: "Chapter 8: Vital Villages, Thriving Towns", slug: "vital-villages-thriving-towns" },
        { name: "Chapter 9: Traders, Kings and Pilgrims", slug: "traders-kings-and-pilgrims" },
        { name: "Chapter 10: New Empires and Kingdoms", slug: "new-empires-and-kingdoms" },
        { name: "Chapter 11: Buildings, Paintings and Books", slug: "buildings-paintings-and-books" },
      ],
    },
    {
      name: "The Earth: Our Habitat",
      lang: "en",
      chapters: [
        { name: "Chapter 1: The Earth in the Solar System", slug: "the-earth-in-the-solar-system" },
        { name: "Chapter 2: Globe: Latitudes and Longitudes", slug: "globe-latitudes-and-longitudes" },
        { name: "Chapter 3: Motions of the Earth", slug: "motions-of-the-earth" },
        { name: "Chapter 4: Maps", slug: "maps" },
        { name: "Chapter 5: Major Domains of the Earth", slug: "major-domains-of-the-earth" },
        { name: "Chapter 6: Major Landforms of the Earth", slug: "major-landforms-of-the-earth" },
        { name: "Chapter 7: Our Country - India", slug: "our-country-india" },
        { name: "Chapter 8: India: Climate, Vegetation and Wildlife", slug: "india-climate-vegetation-and-wildlife" },
      ],
    },
    {
      name: "Social and Political Life - I",
      lang: "en",
      chapters: [
        { name: "Chapter 1: Understanding Diversity", slug: "understanding-diversity" },
        { name: "Chapter 2: Diversity and Discrimination", slug: "diversity-and-discrimination" },
        { name: "Chapter 3: What is Government?", slug: "what-is-government" },
        { name: "Chapter 4: Key Elements of a Democratic Government", slug: "key-elements-of-a-democratic-government" },
        { name: "Chapter 5: Panchayati Raj", slug: "panchayati-raj" },
        { name: "Chapter 6: Rural Administration", slug: "rural-administration" },
        { name: "Chapter 7: Urban Administration", slug: "urban-administration" },
        { name: "Chapter 8: Rural Livelihoods", slug: "rural-livelihoods" },
        { name: "Chapter 9: Urban Livelihoods", slug: "urban-livelihoods" },
      ],
    },
    {
      name: "हमारे अतीत - I (विषय सूचि)",
      lang: "hi",
      chapters: [
        { name: "अध्याय 1: क्या, कब, कहाँ और कैसे?", slug: "what-where-how-and-when" },
        { name: "अध्याय 2: आखेट-खाद्य संग्रह से भोजन उत्पादन तक", slug: "from-hunting-gathering-to-growing-food" },
        { name: "अध्याय 3: आरंभिक नगर", slug: "in-the-earliest-cities" },
        { name: "अध्याय 4: क्या बताती हैं हमें किताबें और कब्रें", slug: "what-books-and-burials-tell-us" },
        { name: "अध्याय 5: राज्य, राजा और एक प्राचीन गणराज्य", slug: "kingdoms-kings-and-an-early-republic" },
        { name: "अध्याय 6: नए प्रश्न नए विचार", slug: "new-questions-and-ideas" },
        { name: "अध्याय 7: अशोक: एक अनोखा सम्राट जिसने युद्ध का त्याग किया", slug: "ashoka-the-emperor-who-gave-up-war" },
        { name: "अध्याय 8: खुशहाल गाँव और समृद्ध शहर", slug: "vital-villages-thriving-towns" },
        { name: "अध्याय 9: व्यापारी, राजा और तीर्थयात्री", slug: "traders-kings-and-pilgrims" },
        { name: "अध्याय 10: नए साम्राज्य और राज्य", slug: "new-empires-and-kingdoms" },
        { name: "अध्याय 11: इमारतें, चित्र तथा किताबें", slug: "buildings-paintings-and-books" },
      ],
    },
    {
      name: "पृथ्वी: हमारा आवास (विषय सूचि)",
      lang: "hi",
      chapters: [
        { name: "अध्याय 1: सौरमंडल में पृथ्वी", slug: "the-earth-in-the-solar-system" },
        { name: "अध्याय 2: ग्लोब: अक्षांश एवं देशांतर", slug: "globe-latitudes-and-longitudes" },
        { name: "अध्याय 3: पृथ्वी की गतियाँ", slug: "motions-of-the-earth" },
        { name: "अध्याय 4: मानचित्र", slug: "maps" },
        { name: "अध्याय 5: पृथ्वी के प्रमुख परिमंडल", slug: "major-domains-of-the-earth" },
        { name: "अध्याय 6: पृथ्वी के प्रमुख स्थलरूप", slug: "major-landforms-of-the-earth" },
        { name: "अध्याय 7: हमारा देश: भारत", slug: "our-country-india" },
        { name: "अध्याय 8: भारत: जलवायु, वनस्पति तथा वन्य प्राणी", slug: "india-climate-vegetation-and-wildlife" },
      ],
    },
    {
      name: "सामाजिक एवं राजनीतिक जीवन - I (विषय सूचि)",
      lang: "hi",
      chapters: [
        { name: "अध्याय 1: विविधता की समझ", slug: "understanding-diversity" },
        { name: "अध्याय 2: विविधता एवं भेदभाव", slug: "diversity-and-discrimination" },
        { name: "अध्याय 3: सरकार क्या है?", slug: "what-is-government" },
        { name: "अध्याय 4: लोकतांत्रिक सरकार के मुख्य तत्त्व", slug: "key-elements-of-a-democratic-government" },
        { name: "अध्याय 5: पंचायती राज", slug: "panchayati-raj" },
        { name: "अध्याय 6: गाँव का प्रशासन", slug: "rural-administration" },
        { name: "अध्याय 7: नगर का प्रशासन", slug: "urban-administration" },
        { name: "अध्याय 8: ग्रामीण क्षेत्र में आजीविका", slug: "rural-livelihoods" },
        { name: "अध्याय 9: शहरी क्षेत्र में आजीविका", slug: "urban-livelihoods" },
      ],
    },
  ],
};

export default function Class6SocialPage() {
  const [notesLang, setNotesLang] = useState<'en' | 'hi'>('en');

  const allChapters = class6SocialResources.books
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
              <CardTitle className="text-2xl font-bold">Class 6 | Social Studies</CardTitle>
            </div>
          </div>
        </div>
        <CardContent className="p-6 bg-muted/20">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-3">
              <h2 className="text-2xl font-bold mb-4 text-foreground">Contents</h2>
              <div className="space-y-6">
                {class6SocialResources.books.map((book, bookIndex) => (
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
