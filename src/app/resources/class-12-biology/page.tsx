
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, BookOpen, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const class12BiologyResources = {
  books: [
    {
      name: "Biology Textbook for Class XII",
      lang: "en",
      chapters: [
        { name: "Chapter 1: Sexual Reproduction in Flowering Plants", slug: "sexual-reproduction-in-flowering-plants" },
        { name: "Chapter 2: Human Reproduction", slug: "human-reproduction" },
        { name: "Chapter 3: Reproductive Health", slug: "reproductive-health" },
        { name: "Chapter 4: Principles of Inheritance and Variation", slug: "principles-of-inheritance-and-variation" },
        { name: "Chapter 5: Molecular Basis of Inheritance", slug: "molecular-basis-of-inheritance" },
        { name: "Chapter 6: Evolution", slug: "evolution" },
        { name: "Chapter 7: Human Health and Disease", slug: "human-health-and-disease" },
        { name: "Chapter 8: Microbes in Human Welfare", slug: "microbes-in-human-welfare" },
        { name: "Chapter 9: Biotechnology: Principles and Processes", slug: "biotechnology-principles-and-processes" },
        { name: "Chapter 10: Biotechnology and its Applications", slug: "biotechnology-and-its-applications" },
        { name: "Chapter 11: Organisms and Populations", slug: "organisms-and-populations" },
        { name: "Chapter 12: Ecosystem", slug: "ecosystem" },
        { name: "Chapter 13: Biodiversity and Conservation", slug: "biodiversity-and-conservation" },
      ],
    },
    {
      name: "जीव विज्ञान (विषय सूचि)",
      lang: "hi",
      chapters: [
        { name: "अध्याय 1: पुष्पी पादपों में लैंगिक जनन", slug: "sexual-reproduction-in-flowering-plants" },
        { name: "अध्याय 2: मानव जनन", slug: "human-reproduction" },
        { name: "अध्याय 3: जनन स्वास्थ्य", slug: "reproductive-health" },
        { name: "अध्याय 4: वंशागति तथा विविधता के सिद्धांत", slug: "principles-of-inheritance-and-variation" },
        { name: "अध्याय 5: वंशागति के आणविक आधार", slug: "molecular-basis-of-inheritance" },
        { name: "अध्याय 6: विकास", slug: "evolution" },
        { name: "अध्याय 7: मानव स्वास्थ्य तथा रोग", slug: "human-health-and-disease" },
        { name: "अध्याय 8: मानव कल्याण में सूक्ष्म जीव", slug: "microbes-in-human-welfare" },
        { name: "अध्याय 9: जैव प्रौद्योगिकी-सिद्धांत व प्रक्रम", slug: "biotechnology-principles-and-processes" },
        { name: "अध्याय 10: जैव प्रौद्योगिकी एवं उसके उपयोग", slug: "biotechnology-and-its-applications" },
        { name: "अध्याय 11: जीव और समष्टियाँ", slug: "organisms-and-populations" },
        { name: "अध्याय 12: पारितंत्र", slug: "ecosystem" },
        { name: "अध्याय 13: जैव विविधता एवं संरक्षण", slug: "biodiversity-and-conservation" },
      ],
    },
  ],
  papers: [
    { name: "Mid-Term Exam 2024", type: "Question Paper", icon: <FileText className="w-5 h-5 text-blue-500" /> },
    { name: "Annual Exam 2024", type: "Question Paper", icon: <FileText className="w-5 h-5 text-blue-500" /> },
  ],
};

export default function Class12BiologyPage() {
  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <Card className="shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-lime-500 to-green-600 text-white p-8">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-4 rounded-full">
              <BookOpen className="w-8 h-8" />
            </div>
            <div>
              <CardTitle className="text-3xl font-bold">Class 12 | Biology</CardTitle>
              <CardDescription className="text-lime-100 mt-1">
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
                {class12BiologyResources.books.map((book, bookIndex) => (
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
                {class12BiologyResources.papers.map((paper, index) => (
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
