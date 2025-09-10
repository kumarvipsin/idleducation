
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, BookOpen, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const class11MathsResources = {
  books: [
    {
      name: "Mathematics Textbook for Class XI",
      lang: "en",
      chapters: [
        { name: "Chapter 1: Sets", slug: "sets" },
        { name: "Chapter 2: Relations and Functions", slug: "relations-and-functions" },
        { name: "Chapter 3: Trigonometric Functions", slug: "trigonometric-functions" },
        { name: "Chapter 4: Principle of Mathematical Induction", slug: "principle-of-mathematical-induction" },
        { name: "Chapter 5: Complex Numbers and Quadratic Equations", slug: "complex-numbers-and-quadratic-equations" },
        { name: "Chapter 6: Linear Inequalities", slug: "linear-inequalities" },
        { name: "Chapter 7: Permutations and Combinations", slug: "permutations-and-combinations" },
        { name: "Chapter 8: Binomial Theorem", slug: "binomial-theorem" },
        { name: "Chapter 9: Sequences and Series", slug: "sequences-and-series" },
        { name: "Chapter 10: Straight Lines", slug: "straight-lines" },
        { name: "Chapter 11: Conic Sections", slug: "conic-sections" },
        { name: "Chapter 12: Introduction to Three Dimensional Geometry", slug: "introduction-to-three-dimensional-geometry" },
        { name: "Chapter 13: Limits and Derivatives", slug: "limits-and-derivatives" },
        { name: "Chapter 14: Mathematical Reasoning", slug: "mathematical-reasoning" },
        { name: "Chapter 15: Statistics", slug: "statistics-11" },
        { name: "Chapter 16: Probability", slug: "probability-11" },
      ],
    },
    {
      name: "विषय सूचि",
      lang: "hi",
      chapters: [
        { name: "अध्याय 1: समुच्चय", slug: "sets" },
        { name: "अध्याय 2: संबंध एवं फलन", slug: "relations-and-functions" },
        { name: "अध्याय 3: त्रिकोणमितीय फलन", slug: "trigonometric-functions" },
        { name: "अध्याय 4: गणितीय आगमन का सिद्धांत", slug: "principle-of-mathematical-induction" },
        { name: "अध्याय 5: सम्मिश्र संख्याएँ और द्विघातीय समीकरण", slug: "complex-numbers-and-quadratic-equations" },
        { name: "अध्याय 6: रैखिक असमिकाएँ", slug: "linear-inequalities" },
        { name: "अध्याय 7: क्रमचय और संचय", slug: "permutations-and-combinations" },
        { name: "अध्याय 8: द्विपद प्रमेय", slug: "binomial-theorem" },
        { name: "अध्याय 9: अनुक्रम तथा श्रेणी", slug: "sequences-and-series" },
        { name: "अध्याय 10: सरल रेखाएँ", slug: "straight-lines" },
        { name: "अध्याय 11: शंकु परिच्छेद", slug: "conic-sections" },
        { name: "अध्याय 12: त्रिविमीय ज्यामिति का परिचय", slug: "introduction-to-three-dimensional-geometry" },
        { name: "अध्याय 13: सीमा और अवकलज", slug: "limits-and-derivatives" },
        { name: "अध्याय 14: गणितीय विवेचन", slug: "mathematical-reasoning" },
        { name: "अध्याय 15: सांख्यिकी", slug: "statistics-11" },
        { name: "अध्याय 16: प्रायिकता", slug: "probability-11" },
      ],
    },
  ],
  papers: [
    { name: "Mid-Term Exam 2024", type: "Question Paper", icon: <FileText className="w-5 h-5 text-blue-500" /> },
    { name: "Annual Exam 2024", type: "Question Paper", icon: <FileText className="w-5 h-5 text-blue-500" /> },
  ],
};

export default function Class11MathsPage() {
  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <Card className="shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-8">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-4 rounded-full">
              <BookOpen className="w-8 h-8" />
            </div>
            <div>
              <CardTitle className="text-3xl font-bold">Class 11 | Maths</CardTitle>
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
                {class11MathsResources.books.map((book, bookIndex) => (
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
              <h2 className="text-2xl font-bold mb-4 text-foreground">Papers & Materials</h2>
              <div className="space-y-4">
                {class11MathsResources.papers.map((paper, index) => (
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
