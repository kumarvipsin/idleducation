
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, BookOpen, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const class7MathsResources = {
  books: [
    {
      name: "Mathematics Textbook for Class VII",
      lang: "en",
      chapters: [
        { name: "Chapter 1: Integers", slug: "integers-7" },
        { name: "Chapter 2: Fractions and Decimals", slug: "fractions-and-decimals-7" },
        { name: "Chapter 3: Data Handling", slug: "data-handling-7" },
        { name: "Chapter 4: Simple Equations", slug: "simple-equations" },
        { name: "Chapter 5: Lines and Angles", slug: "lines-and-angles" },
        { name: "Chapter 6: The Triangle and its Properties", slug: "the-triangle-and-its-properties" },
        { name: "Chapter 7: Congruence of Triangles", slug: "congruence-of-triangles" },
        { name: "Chapter 8: Comparing Quantities", slug: "comparing-quantities-7" },
        { name: "Chapter 9: Rational Numbers", slug: "rational-numbers-7" },
        { name: "Chapter 10: Practical Geometry", slug: "practical-geometry" },
        { name: "Chapter 11: Perimeter and Area", slug: "perimeter-and-area" },
        { name: "Chapter 12: Algebraic Expressions", slug: "algebraic-expressions" },
        { name: "Chapter 13: Exponents and Powers", slug: "exponents-and-powers-7" },
        { name: "Chapter 14: Symmetry", slug: "symmetry" },
        { name: "Chapter 15: Visualising Solid Shapes", slug: "visualising-solid-shapes" },
      ],
    },
    {
      name: "विषय सूचि",
      lang: "hi",
      chapters: [
        { name: "अध्याय 1: पूर्णांक", slug: "integers-7" },
        { name: "अध्याय 2: भिन्न एवं दशमलव", slug: "fractions-and-decimals-7" },
        { name: "अध्याय 3: आँकड़ो का प्रबंधन", slug: "data-handling-7" },
        { name: "अध्याय 4: सरल समीकरण", slug: "simple-equations" },
        { name: "अध्याय 5: रेखा एवं कोण", slug: "lines-and-angles" },
        { name: "अध्याय 6: त्रिभुज और उसके गुण", slug: "the-triangle-and-its-properties" },
        { name: "अध्याय 7: त्रिभुजों की सर्वांगसमता", slug: "congruence-of-triangles" },
        { name: "अध्याय 8: राशियों की तुलना", slug: "comparing-quantities-7" },
        { name: "अध्याय 9: परिमेय संख्याएँ", slug: "rational-numbers-7" },
        { name: "अध्याय 10: प्रायोगिक ज्यामिति", slug: "practical-geometry" },
        { name: "अध्याय 11: परिमाप और क्षेत्रफल", slug: "perimeter-and-area" },
        { name: "अध्याय 12: बीजीय व्यंजक", slug: "algebraic-expressions" },
        { name: "अध्याय 13: घातांक और घात", slug: "exponents-and-powers-7" },
        { name: "अध्याय 14: सममिति", slug: "symmetry" },
        { name: "अध्याय 15: ठोस आकारों का चित्रण", slug: "visualising-solid-shapes" },
      ],
    },
  ],
  papers: [
    { name: "Mid-Term Exam 2024", type: "Question Paper", icon: <FileText className="w-5 h-5 text-blue-500" /> },
    { name: "Annual Exam 2024", type: "Question Paper", icon: <FileText className="w-5 h-5 text-blue-500" /> },
  ],
};

export default function Class7MathsPage() {
  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <Card className="shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-8">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-4 rounded-full">
              <BookOpen className="w-8 h-8" />
            </div>
            <div>
              <CardTitle className="text-3xl font-bold">Class 7 | Maths</CardTitle>
              <CardDescription className="text-green-100 mt-1">
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
                {class7MathsResources.books.map((book, bookIndex) => (
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
              <h2 className="text-2xl font-bold mb-4 text-foreground">Papers & Materials</h2>
              <div className="space-y-4">
                {class7MathsResources.papers.map((paper, index) => (
                  <Card key={index} className="hover:shadow-md transition-shadow bg-background">
                    <CardContent className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        {paper.icon}
                        <div>
                          <p className="font-semibold">{paper.name}</p>
                          <p className="text-sm text-muted-foreground">{paper.type}</p>
                        </div>
                      </div>
                      <Button asChild variant="outline" size="sm">
                        <Link href="#">Download</Link>
                      </Button>
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
