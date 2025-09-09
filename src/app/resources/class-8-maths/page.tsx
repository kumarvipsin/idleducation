
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, BookOpen, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

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
  papers: [
    { name: "Mid-Term Exam 2024", type: "Question Paper", icon: <FileText className="w-5 h-5 text-blue-500" /> },
    { name: "Annual Exam 2024", type: "Question Paper", icon: <FileText className="w-5 h-5 text-blue-500" /> },
  ],
};

export default function Class8MathsPage() {
  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <Card className="shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-8">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-4 rounded-full">
              <BookOpen className="w-8 h-8" />
            </div>
            <div>
              <CardTitle className="text-3xl font-bold">Class 8 | Maths</CardTitle>
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
              <h2 className="text-2xl font-bold mb-4 text-foreground">Papers & Materials</h2>
              <div className="space-y-4">
                {class8MathsResources.papers.map((paper, index) => (
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
