
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, BookOpen, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";

const class5MathsResources = {
  books: [
    {
      name: "Math-Magic Textbook for Class V",
      lang: "en",
      chapters: [
        { name: "Chapter 1: The Fish Tale", slug: "the-fish-tale" },
        { name: "Chapter 2: Shapes and Angles", slug: "shapes-and-angles" },
        { name: "Chapter 3: How Many Squares?", slug: "how-many-squares" },
        { name: "Chapter 4: Parts and Wholes", slug: "parts-and-wholes" },
        { name: "Chapter 5: Does it Look the Same?", slug: "does-it-look-the-same" },
        { name: "Chapter 6: Be My Multiple, I'll be Your Factor", slug: "be-my-multiple-ill-be-your-factor" },
        { name: "Chapter 7: Can You See the Pattern?", slug: "can-you-see-the-pattern" },
        { name: "Chapter 8: Mapping Your Way", slug: "mapping-your-way" },
        { name: "Chapter 9: Boxes and Sketches", slug: "boxes-and-sketches" },
        { name: "Chapter 10: Tenths and Hundredths", slug: "tenths-and-hundredths" },
        { name: "Chapter 11: Area and its Boundary", slug: "area-and-its-boundary" },
        { name: "Chapter 12: Smart Charts", slug: "smart-charts" },
        { name: "Chapter 13: Ways to Multiply and Divide", slug: "ways-to-multiply-and-divide" },
        { name: "Chapter 14: How Big, How Heavy?", slug: "how-big-how-heavy" },
      ],
    },
    {
      name: "विषय सूचि",
      lang: "hi",
      chapters: [
        { name: "अध्याय 1: मछली उछली", slug: "the-fish-tale" },
        { name: "अध्याय 2: आकृतियाँ और कोण", slug: "shapes-and-angles" },
        { name: "अध्याय 3: कितने वर्ग?", slug: "how-many-squares" },
        { name: "अध्याय 4: हिस्से और पूरे", slug: "parts-and-wholes" },
        { name: "अध्याय 5: क्या यह एक जैसा दिखता है?", slug: "does-it-look-the-same" },
        { name: "अध्याय 6: मैं तेरा गुणनखंड, गुणज तू मेरा", slug: "be-my-multiple-ill-be-your-factor" },
        { name: "अध्याय 7: क्या तुम्हें पैटर्न दिखा?", slug: "can-you-see-the-pattern" },
        { name: "अध्याय 8: नक्शा", slug: "mapping-your-way" },
        { name: "अध्याय 9: डिब्बे और स्कैच", slug: "boxes-and-sketches" },
        { name: "अध्याय 10: दसवाँ और सौवाँ भाग", slug: "tenths-and-hundredths" },
        { name: "अध्याय 11: क्षेत्रफल और घेरा", slug: "area-and-its-boundary" },
        { name: "अध्याय 12: स्मार्ट चार्ट", slug: "smart-charts" },
        { name: "अध्याय 13: गुणा और भाग के तरीके", slug: "ways-to-multiply-and-divide" },
        { name: "अध्याय 14: कितना बड़ा, कितना भारी?", slug: "how-big-how-heavy" },
      ],
    },
  ],
  papers: [
    { name: "Mid-Term Exam 2024", type: "Question Paper", icon: <FileText className="w-5 h-5 text-blue-500" /> },
    { name: "Annual Exam 2024", type: "Question Paper", icon: <FileText className="w-5 h-5 text-blue-500" /> },
  ],
};

export default function Class5MathsPage() {
  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <Card className="shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-8">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-4 rounded-full">
              <BookOpen className="w-8 h-8" />
            </div>
            <div>
              <CardTitle className="text-3xl font-bold">Class 5 | Maths</CardTitle>
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
                {class5MathsResources.books.map((book, bookIndex) => (
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
                {class5MathsResources.papers.map((paper, index) => (
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
