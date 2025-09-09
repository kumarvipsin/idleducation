
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, BookOpen, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const class9ScienceResources = {
  books: [
    {
      name: "Science Textbook for Class IX",
      lang: "en",
      chapters: [
        { name: "Chapter 1: Matter in Our Surroundings", slug: "matter-in-our-surroundings" },
        { name: "Chapter 2: Is Matter Around Us Pure", slug: "is-matter-around-us-pure" },
        { name: "Chapter 3: Atoms and Molecules", slug: "atoms-and-molecules" },
        { name: "Chapter 4: Structure of the Atom", slug: "structure-of-the-atom" },
        { name: "Chapter 5: The Fundamental Unit of Life", slug: "the-fundamental-unit-of-life" },
      ],
    },
    {
      name: "विज्ञान कक्षा 9",
      lang: "hi",
      chapters: [
        { name: "अध्याय 1: हमारे आस-पास के पदार्थ", slug: "matter-in-our-surroundings" },
        { name: "अध्याय 2: क्या हमारे आस-पास के पदार्थ शुद्ध हैं", slug: "is-matter-around-us-pure" },
        { name: "अध्याय 3: परमाणु एवं अणु", slug: "atoms-and-molecules" },
        { name: "अध्याय 4: परमाणु की संरचना", slug: "structure-of-the-atom" },
        { name: "अध्याय 5: जीवन की मौलिक इकाई", slug: "the-fundamental-unit-of-life" },
      ],
    },
  ],
  papers: [
    { name: "Mid-Term Exam 2024", type: "Question Paper", icon: <FileText className="w-5 h-5 text-blue-500" /> },
    { name: "Annual Exam 2024", type: "Question Paper", icon: <FileText className="w-5 h-5 text-blue-500" /> },
  ],
};

export default function Class9SciencePage() {
  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <Card className="shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-8">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-4 rounded-full">
              <BookOpen className="w-8 h-8" />
            </div>
            <div>
              <CardTitle className="text-3xl font-bold">Class 9 | Science</CardTitle>
              <CardDescription className="text-blue-100 mt-1">
                Explore resources for the 2025 NCERT Syllabus.
              </CardDescription>
            </div>
          </div>
        </div>
        <CardContent className="p-6 bg-muted/20">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-3">
              <h2 className="text-2xl font-bold mb-4 text-foreground">Chapters & Topics</h2>
              <div className="space-y-6">
                {class9ScienceResources.books.map((book, bookIndex) => (
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
                {class9ScienceResources.papers.map((paper, index) => (
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
