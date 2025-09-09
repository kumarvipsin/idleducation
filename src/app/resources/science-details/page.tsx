
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, BookOpen, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const scienceResources = {
  books: [
    {
      name: "Science Class X (2025 Syllabus)",
      lang: "en",
      chapters: [
        { name: "Chapter 1: Chemical Reactions and Equations", slug: "chemical-reactions-and-equations" },
        { name: "Chapter 2: Acids, Bases and Salts", slug: "acids-bases-and-salts" },
        { name: "Chapter 3: Metals and Non-metals", slug: "metals-and-non-metals" },
        { name: "Chapter 4: Carbon and its Compounds", slug: "carbon-and-its-compounds" },
        { name: "Chapter 5: Life Processes", slug: "life-processes" },
        { name: "Chapter 6: Control and Coordination", slug: "control-and-coordination" },
        { name: "Chapter 7: How do Organisms Reproduce?", slug: "how-do-organisms-reproduce" },
        { name: "Chapter 8: Heredity", slug: "heredity" },
        { name: "Chapter 9: Light – Reflection and Refraction", slug: "light-reflection-and-refraction" },
        { name: "Chapter 10: The Human Eye and the Colourful World", slug: "human-eye-and-colourful-world" },
        { name: "Chapter 11: Electricity", slug: "electricity" },
        { name: "Chapter 12: Magnetic Effects of Electric Current", slug: "magnetic-effects-of-electric-current" },
        { name: "Chapter 13: Our Environment", slug: "our-environment" },
      ],
    },
    {
      name: "विषय सूचि",
      lang: "hi",
      chapters: [
        { name: "अध्याय 1: रासायनिक अभिक्रियाएँ एवं समीकरण", slug: "chemical-reactions-and-equations" },
        { name: "अध्याय 2: अम्ल, क्षारक एवं लवण", slug: "acids-bases-and-salts" },
        { name: "अध्याय 3: धातु एवं अधातु", slug: "metals-and-non-metals" },
        { name: "अध्याय 4: कार्बन एवं उसके यौगिक", slug: "carbon-and-its-compounds" },
        { name: "अध्याय 5: जैव प्रक्रम", slug: "life-processes" },
        { name: "अध्याय 6: नियंत्रण एवं समन्वय", slug: "control-and-coordination" },
        { name: "अध्याय 7: जीव जनन कैसे करते हैं?", slug: "how-do-organisms-reproduce" },
        { name: "अध्याय 8: आनुवंशिकता", slug: "heredity" },
        { name: "अध्याय 9: प्रकाश – परावर्तन तथा अपवर्तन", slug: "light-reflection-and-refraction" },
        { name: "अध्याय 10: मानव नेत्र तथा रंगबिरंगा संसार", slug: "human-eye-and-colourful-world" },
        { name: "अध्याय 11: विद्युत", slug: "electricity" },
        { name: "अध्याय 12: विद्युत धारा के चुंबकीय प्रभाव", slug: "magnetic-effects-of-electric-current" },
        { name: "अध्याय 13: हमारा पर्यावरण", slug: "our-environment" },
      ],
    },
  ],
  papers: [
    { name: "Mid-Term Exam 2024", type: "Question Paper", icon: <FileText className="w-5 h-5 text-blue-500" /> },
    { name: "Annual Exam 2024", type: "Question Paper", icon: <FileText className="w-5 h-5 text-blue-500" /> },
    { name: "Unit Test 1 (Chapters 1-3)", type: "Test Paper", icon: <FileText className="w-5 h-5 text-green-500" /> },
    { name: "Half-Yearly Revision", type: "Practice Paper", icon: <FileText className="w-5 h-5 text-yellow-500" /> },
  ],
};

export default function ScienceDetailsPage() {
  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <Card className="shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-8">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-4 rounded-full">
              <BookOpen className="w-8 h-8" />
            </div>
            <div>
              <CardTitle className="text-3xl font-bold">Class 10 | Science</CardTitle>
              <CardDescription className="text-blue-100 mt-1">
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
                {scienceResources.books.map((book, bookIndex) => (
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
                {scienceResources.papers.map((paper, index) => (
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
