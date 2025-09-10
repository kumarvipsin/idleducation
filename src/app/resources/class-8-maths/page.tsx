
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, BookOpen, ChevronRight, Eye, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";

const class8MathsResources = {
  books: [
    {
      name: "Mathematics Textbook for Class VIII",
      lang: "en",
      chapters: [
        { name: "Chapter 1: Rational Numbers", slug: "rational-numbers" },
        { name: "Chapter 2: Linear Equations in One Variable", slug: "linear-equations-in-one-variable" },
        { name: "Chapter 3: Understanding Quadrilaterals", slug: "understanding-quadrilaterals" },
        { name: "Chapter 4: Data Handling", slug: "data-handling-8" },
        { name: "Chapter 5: Squares and Square Roots", slug: "squares-and-square-roots" },
        { name: "Chapter 6: Cubes and Cube Roots", slug: "cubes-and-cube-roots" },
        { name: "Chapter 7: Comparing Quantities", slug: "comparing-quantities" },
        { name: "Chapter 8: Algebraic Expressions and Identities", slug: "algebraic-expressions-and-identities" },
        { name: "Chapter 9: Mensuration", slug: "mensuration-8" },
        { name: "Chapter 10: Exponents and Powers", slug: "exponents-and-powers" },
        { name: "Chapter 11: Direct and Inverse Proportions", slug: "direct-and-inverse-proportions" },
        { name: "Chapter 12: Factorisation", slug: "factorisation" },
        { name: "Chapter 13: Introduction to Graphs", slug: "introduction-to-graphs" },
      ],
    },
    {
      name: "विषय सूचि",
      lang: "hi",
      chapters: [
        { name: "अध्याय 1: परिमेय संख्याएँ", slug: "rational-numbers" },
        { name: "अध्याय 2: एक चर वाले रैखिक समीकरण", slug: "linear-equations-in-one-variable" },
        { name: "अध्याय 3: चतुर्भुजों को समझना", slug: "understanding-quadrilaterals" },
        { name: "अध्याय 4: आँकड़ों का प्रबंधन", slug: "data-handling-8" },
        { name: "अध्याय 5: वर्ग और वर्गमूल", slug: "squares-and-square-roots" },
        { name: "अध्याय 6: घन और घनमूल", slug: "cubes-and-cube-roots" },
        { name: "अध्याय 7: राशियों की तुलना", slug: "comparing-quantities" },
        { name: "अध्याय 8: बीजीय व्यंजक एवं सर्वसमिकाएँ", slug: "algebraic-expressions-and-identities" },
        { name: "अध्याय 9: क्षेत्रमिति", slug: "mensuration-8" },
        { name: "अध्याय 10: घातांक और घात", slug: "exponents-and-powers" },
        { name: "अध्याय 11: सीधा और प्रतिलोम समानुपात", slug: "direct-and-inverse-proportions" },
        { name: "अध्याय 12: गुणनखंडन", slug: "factorisation" },
        { name: "अध्याय 13: आलेखों से परिचय", slug: "introduction-to-graphs" },
      ],
    },
  ],
};

export default function Class8MathsPage() {
  const [notesLang, setNotesLang] = useState<'en' | 'hi'>('en');

  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <Card className="shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-4">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-3 rounded-full">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold">Class 8 | Maths</CardTitle>
            </div>
          </div>
        </div>
        <CardContent className="p-6 bg-muted/20">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-3">
              <h2 className="text-2xl font-bold mb-4 text-foreground">Contents</h2>
              <div className="space-y-6">
                {class8MathsResources.books.map((book, bookIndex) => (
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
                {(class8MathsResources.books.find(b => b.lang === notesLang)?.chapters || []).map((chapter, index) => (
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
