
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { FileText, Edit, BookOpen, BrainCircuit } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const class9MathsResources = {
  books: [
    {
      name: "Mathematics Textbook for Class IX",
      lang: "en",
      chapters: [
        { name: "Chapter 1: Number Systems", slug: "number-systems" },
        { name: "Chapter 2: Polynomials", slug: "polynomials" },
        { name: "Chapter 3: Coordinate Geometry", slug: "coordinate-geometry" },
        { name: "Chapter 4: Linear Equations in Two Variables", slug: "linear-equations-in-two-variables" },
        { name: "Chapter 5: Introduction to Euclid's Geometry", slug: "introduction-to-euclids-geometry" },
        { name: "Chapter 6: Lines and Angles", slug: "lines-and-angles-9" },
      ],
    },
    {
      name: "गणित कक्षा 9",
      lang: "hi",
      chapters: [
        { name: "अध्याय 1: संख्या पद्धति", slug: "number-systems" },
        { name: "अध्याय 2: बहुपद", slug: "polynomials" },
        { name: "अध्याय 3: निर्देशांक ज्यामिति", slug: "coordinate-geometry" },
        { name: "अध्याय 4: दो चरों वाले रैखिक समीकरण", slug: "linear-equations-in-two-variables" },
        { name: "अध्याय 5: यूक्लिड की ज्यामिति का परिचय", slug: "introduction-to-euclids-geometry" },
        { name: "अध्याय 6: रेखाएँ और कोण", slug: "lines-and-angles-9" },
      ],
    },
  ],
  papers: [
    { name: "Mid-Term Exam 2024", type: "Question Paper", icon: <FileText className="w-5 h-5 text-blue-500" /> },
    { name: "Annual Exam 2024", type: "Question Paper", icon: <FileText className="w-5 h-5 text-blue-500" /> },
  ],
};

export default function Class9MathsPage() {
  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <Card className="shadow-lg">
        <CardHeader className="bg-primary text-primary-foreground">
          <CardTitle className="text-2xl">Class 9 | Maths</CardTitle>
          <CardDescription className="text-primary-foreground/80">Explore resources for Class 9 Maths (2025 NCERT Syllabus).</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-bold mb-4">Chapters & Topics</h2>
              <Accordion type="multiple" className="w-full space-y-4">
                {class9MathsResources.books.map((book, bookIndex) => (
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
                {class9MathsResources.papers.map((paper, index) => (
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
