
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { FileText, Edit, BookOpen, BrainCircuit } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const class6MathsResources = {
  books: [
    {
      name: "Mathematics Textbook for Class VI",
      lang: "en",
      chapters: [
        { name: "Chapter 1: Knowing Our Numbers", slug: "knowing-our-numbers" },
        { name: "Chapter 2: Whole Numbers", slug: "whole-numbers" },
        { name: "Chapter 3: Playing with Numbers", slug: "playing-with-numbers" },
        { name: "Chapter 4: Basic Geometrical Ideas", slug: "basic-geometrical-ideas" },
        { name: "Chapter 5: Understanding Elementary Shapes", slug: "understanding-elementary-shapes" },
        { name: "Chapter 6: Integers", slug: "integers" },
        { name: "Chapter 7: Fractions", slug: "fractions" },
        { name: "Chapter 8: Decimals", slug: "decimals" },
        { name: "Chapter 9: Data Handling", slug: "data-handling" },
        { name: "Chapter 10: Mensuration", slug: "mensuration" },
        { name: "Chapter 11: Algebra", slug: "algebra" },
        { name: "Chapter 12: Ratio and Proportion", slug: "ratio-and-proportion" },
      ],
    },
    {
      name: "गणित कक्षा 6",
      lang: "hi",
      chapters: [
        { name: "अध्याय 1: अपनी संख्याओं की जानकारी", slug: "knowing-our-numbers" },
        { name: "अध्याय 2: पूर्ण संख्याएँ", slug: "whole-numbers" },
        { name: "अध्याय 3: संख्याओं के साथ खेलना", slug: "playing-with-numbers" },
        { name: "अध्याय 4: आधारभूत ज्यामितीय अवधारणाएँ", slug: "basic-geometrical-ideas" },
        { name: "अध्याय 5: प्रारंभिक आकारों को समझना", slug: "understanding-elementary-shapes" },
        { name: "अध्याय 6: पूर्णांक", slug: "integers" },
        { name: "अध्याय 7: भिन्न", slug: "fractions" },
        { name: "अध्याय 8: दशमलव", slug: "decimals" },
        { name: "अध्याय 9: आँकड़ों का प्रबंधन", slug: "data-handling" },
        { name: "अध्याय 10: क्षेत्रमिति", slug: "mensuration" },
        { name: "अध्याय 11: बीजगणित", slug: "algebra" },
        { name: "अध्याय 12: अनुपात और समानुपात", slug: "ratio-and-proportion" },
      ],
    },
  ],
  papers: [
    { name: "Mid-Term Exam 2024", type: "Question Paper", icon: <FileText className="w-5 h-5 text-blue-500" /> },
    { name: "Annual Exam 2024", type: "Question Paper", icon: <FileText className="w-5 h-5 text-blue-500" /> },
  ],
};

export default function Class6MathsPage() {
  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <Card className="shadow-lg">
        <CardHeader className="bg-primary text-primary-foreground">
          <CardTitle className="text-2xl">Class 6 | Maths</CardTitle>
          <CardDescription className="text-primary-foreground/80">Explore resources for Class 6 Maths (2025 NCERT Syllabus).</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-bold mb-4">Chapters & Topics</h2>
              <Accordion type="multiple" className="w-full space-y-4">
                {class6MathsResources.books.map((book, bookIndex) => (
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
                {class6MathsResources.papers.map((paper, index) => (
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
