
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, BookOpen, ChevronRight } from "lucide-react";
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
      name: "विषय सूचि",
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
      <Card className="shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-8">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-4 rounded-full">
              <BookOpen className="w-8 h-8" />
            </div>
            <div>
              <CardTitle className="text-3xl font-bold">Class 6 | Maths</CardTitle>
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
                {class6MathsResources.books.map((book, bookIndex) => (
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
                {class6MathsResources.papers.map((paper, index) => (
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
