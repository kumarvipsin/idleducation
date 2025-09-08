
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { FileText, Edit, BookOpen, BrainCircuit } from "lucide-react";
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
      name: "गणित कक्षा 8",
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
      <Card className="shadow-lg">
        <CardHeader className="bg-primary text-primary-foreground">
          <CardTitle className="text-2xl">Class 8 | Maths</CardTitle>
          <CardDescription className="text-primary-foreground/80">Explore resources for Class 8 Maths (2025 NCERT Syllabus).</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-bold mb-4">Chapters & Topics</h2>
              <Accordion type="multiple" className="w-full space-y-4">
                {class8MathsResources.books.map((book, bookIndex) => (
                  <AccordionItem value={`book-${bookIndex}`} key={bookIndex} className="border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <AccordionTrigger className="font-semibold text-lg p-4 hover:bg-muted/50 rounded-t-lg data-[state=open]:bg-muted/50">
                      <p>{book.name}</p>
                    </AccordionTrigger>
                    <AccordionContent className="p-4 pt-0">
                      <ul className="space-y-1">
                        {book.chapters.map((chapter, chapterIndex) => (
                          <li key={chapterIndex}>
                             <Link href={`/resources/notes-details/${chapter.slug}?lang=${book.lang}`} className="block p-2 rounded-md text-foreground/80 hover:bg-accent/50 hover:text-accent-foreground font-medium transition-colors">
                                {chapter.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-4">Papers & Materials</h2>
              <div className="space-y-4">
                {class8MathsResources.papers.map((paper, index) => (
                  <Card key={index} className="hover:shadow-md transition-shadow">
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
