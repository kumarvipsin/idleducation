
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, BookOpen, ChevronRight, Eye, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";

const politicalScienceResources = {
  books: [
    {
      name: "Contemporary World Politics",
      lang: "en",
      chapters: [
        { name: "Chapter 1: The End of Bipolarity", slug: "the-end-of-bipolarity" },
        { name: "Chapter 2: Contemporary Centres of Power", slug: "contemporary-centres-of-power" },
        { name: "Chapter 3: Contemporary South Asia", slug: "contemporary-south-asia" },
        { name: "Chapter 4: International Organisations", slug: "international-organisations" },
        { name: "Chapter 5: Security in the Contemporary World", slug: "security-in-the-contemporary-world" },
        { name: "Chapter 6: Environment and Natural Resources", slug: "environment-and-natural-resources" },
        { name: "Chapter 7: Globalisation", slug: "globalisation" },
      ],
    },
    {
      name: "Politics in India Since Independence",
      lang: "en",
      chapters: [
        { name: "Chapter 1: Challenges of Nation Building", slug: "challenges-of-nation-building" },
        { name: "Chapter 2: Era of One-party Dominance", slug: "era-of-one-party-dominance" },
        { name: "Chapter 3: Politics of Planned Development", slug: "politics-of-planned-development" },
        { name: "Chapter 4: India’s External Relations", slug: "indias-external-relations" },
        { name: "Chapter 5: Challenges to and Restoration of the Congress System", slug: "challenges-to-and-restoration-of-the-congress-system" },
        { name: "Chapter 6: The Crisis of Democratic Order", slug: "the-crisis-of-democratic-order" },
        { name: "Chapter 7: Regional Aspirations", slug: "regional-aspirations" },
        { name: "Chapter 8: Recent Developments in Indian Politics", slug: "recent-developments-in-indian-politics" },
      ],
    },
    {
      name: "समकालीन विश्व राजनीति (विषय सूचि)",
      lang: "hi",
      chapters: [
        { name: "अध्याय 1: दो ध्रुवीयता का अंत", slug: "the-end-of-bipolarity" },
        { name: "अध्याय 2: सत्ता के समकालीन केंद्र", slug: "contemporary-centres-of-power" },
        { name: "अध्याय 3: समकालीन दक्षिण एशिया", slug: "contemporary-south-asia" },
        { name: "अध्याय 4: अंतर्राष्ट्रीय संगठन", slug: "international-organisations" },
        { name: "अध्याय 5: समकालीन विश्व में सुरक्षा", slug: "security-in-the-contemporary-world" },
        { name: "अध्याय 6: पर्यावरण और प्राकृतिक संसाधन", slug: "environment-and-natural-resources" },
        { name: "अध्याय 7: वैश्वीकरण", slug: "globalisation" },
      ],
    },
    {
      name: "स्वतंत्र भारत में राजनीति (विषय सूचि)",
      lang: "hi",
      chapters: [
        { name: "अध्याय 1: राष्ट्र-निर्माण की चुनौतियाँ", slug: "challenges-of-nation-building" },
        { name: "अध्याय 2: एक दल के प्रभुत्व का दौर", slug: "era-of-one-party-dominance" },
        { name: "अध्याय 3: नियोजित विकास की राजनीति", slug: "politics-of-planned-development" },
        { name: "अध्याय 4: भारत के विदेश संबंध", slug: "indias-external-relations" },
        { name: "अध्याय 5: कांग्रेस प्रणाली: चुनौतियाँ और पुनर्स्थापना", slug: "challenges-to-and-restoration-of-the-congress-system" },
        { name: "अध्याय 6: लोकतांत्रिक व्यवस्था का संकट", slug: "the-crisis-of-democratic-order" },
        { name: "अध्याय 7: क्षेत्रीय आकांक्षाएँ", slug: "regional-aspirations" },
        { name: "अध्याय 8: भारतीय राजनीति: नए बदलाव", slug: "recent-developments-in-indian-politics" },
      ],
    },
  ],
};

export default function PoliticalScienceDetailsPage() {
  const [notesLang, setNotesLang] = useState<'en' | 'hi'>('en');

  const allChapters = politicalScienceResources.books
    .filter(book => book.lang === notesLang)
    .flatMap(book => book.chapters);

  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <Card className="shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-4">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-3 rounded-full">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold">Class 12 | Political Science</CardTitle>
            </div>
          </div>
        </div>
        <CardContent className="p-6 bg-muted/20">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-3">
              <h2 className="text-2xl font-bold mb-4 text-foreground">Contents</h2>
              <div className="space-y-6">
                {politicalScienceResources.books.map((book, bookIndex) => (
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
