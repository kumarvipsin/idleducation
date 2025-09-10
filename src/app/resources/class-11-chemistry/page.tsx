
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, BookOpen, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const class11ChemistryResources = {
  books: [
    {
      name: "Chemistry Part - I",
      lang: "en",
      chapters: [
        { name: "Chapter 1: Some Basic Concepts of Chemistry", slug: "some-basic-concepts-of-chemistry" },
        { name: "Chapter 2: Structure of Atom", slug: "structure-of-atom" },
        { name: "Chapter 3: Classification of Elements and Periodicity in Properties", slug: "classification-of-elements-and-periodicity-in-properties" },
        { name: "Chapter 4: Chemical Bonding and Molecular Structure", slug: "chemical-bonding-and-molecular-structure" },
        { name: "Chapter 5: Thermodynamics", slug: "thermodynamics-11" },
        { name: "Chapter 6: Equilibrium", slug: "equilibrium" },
      ],
    },
    {
      name: "Chemistry Part - II",
      lang: "en",
      chapters: [
        { name: "Chapter 7: Redox Reactions", slug: "redox-reactions" },
        { name: "Chapter 8: Organic Chemistry – Some Basic Principles and Techniques", slug: "organic-chemistry-some-basic-principles-and-techniques" },
        { name: "Chapter 9: Hydrocarbons", slug: "hydrocarbons" },
      ],
    },
    {
      name: "रसायन विज्ञान भाग I (विषय सूचि)",
      lang: "hi",
      chapters: [
        { name: "अध्याय 1: रसायन विज्ञान की कुछ मूल अवधारणाएँ", slug: "some-basic-concepts-of-chemistry" },
        { name: "अध्याय 2: परमाणु की संरचना", slug: "structure-of-atom" },
        { name: "अध्याय 3: तत्वों का वर्गीकरण एवं गुणधर्मों में आवर्तिता", slug: "classification-of-elements-and-periodicity-in-properties" },
        { name: "अध्याय 4: रासायनिक आबंधन तथा आण्विक संरचना", slug: "chemical-bonding-and-molecular-structure" },
        { name: "अध्याय 5: ऊष्मागतिकी", slug: "thermodynamics-11" },
        { name: "अध्याय 6: साम्यावस्था", slug: "equilibrium" },
      ],
    },
    {
      name: "रसायन विज्ञान भाग II (विषय सूचि)",
      lang: "hi",
      chapters: [
        { name: "अध्याय 7: अपचयोपचय अभिक्रियाएँ", slug: "redox-reactions" },
        { name: "अध्याय 8: कार्बनिक रसायन – कुछ आधारभूत सिद्धांत तथा तकनीकें", slug: "organic-chemistry-some-basic-principles-and-techniques" },
        { name: "अध्याय 9: हाइड्रोकार्बन", slug: "hydrocarbons" },
      ],
    },
  ],
  papers: [
    { name: "Mid-Term Exam 2024", type: "Question Paper", icon: <FileText className="w-5 h-5 text-blue-500" /> },
    { name: "Annual Exam 2024", type: "Question Paper", icon: <FileText className="w-5 h-5 text-blue-500" /> },
  ],
};

export default function Class11ChemistryPage() {
  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <Card className="shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-purple-500 to-violet-600 text-white p-8">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-4 rounded-full">
              <BookOpen className="w-8 h-8" />
            </div>
            <div>
              <CardTitle className="text-3xl font-bold">Class 11 | Chemistry</CardTitle>
              <CardDescription className="text-purple-100 mt-1">
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
                {class11ChemistryResources.books.map((book, bookIndex) => (
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
                {class11ChemistryResources.papers.map((paper, index) => (
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
