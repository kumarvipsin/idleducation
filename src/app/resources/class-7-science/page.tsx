
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { FileText, Edit, BookOpen, BrainCircuit } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const class7ScienceResources = {
  books: [
    {
      name: "Science Textbook for Class VII",
      lang: "en",
      chapters: [
        { name: "Chapter 1: Nutrition in Plants", slug: "nutrition-in-plants" },
        { name: "Chapter 2: Nutrition in Animals", slug: "nutrition-in-animals" },
        { name: "Chapter 3: Heat", slug: "heat" },
        { name: "Chapter 4: Acids, Bases and Salts", slug: "acids-bases-and-salts-7" },
        { name: "Chapter 5: Physical and Chemical Changes", slug: "physical-and-chemical-changes" },
      ],
    },
    {
      name: "विज्ञान कक्षा 7",
      lang: "hi",
      chapters: [
        { name: "अध्याय 1: पादपों में पोषण", slug: "nutrition-in-plants" },
        { name: "अध्याय 2: प्राणियों में पोषण", slug: "nutrition-in-animals" },
        { name: "अध्याय 3: ऊष्मा", slug: "heat" },
        { name: "अध्याय 4: अम्ल, क्षारक और लवण", slug: "acids-bases-and-salts-7" },
        { name: "अध्याय 5: भौतिक एवं रासायनिक परिवर्तन", slug: "physical-and-chemical-changes" },
      ],
    },
  ],
  papers: [
    { name: "Mid-Term Exam 2024", type: "Question Paper", icon: <FileText className="w-5 h-5 text-blue-500" /> },
    { name: "Annual Exam 2024", type: "Question Paper", icon: <FileText className="w-5 h-5 text-blue-500" /> },
  ],
};

export default function Class7SciencePage() {
  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <Card className="shadow-lg">
        <CardHeader className="bg-primary text-primary-foreground">
          <CardTitle className="text-2xl">Class 7 | Science</CardTitle>
          <CardDescription className="text-primary-foreground/80">Explore resources for Class 7 Science (2025 NCERT Syllabus).</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-bold mb-4">Chapters & Topics</h2>
              <Accordion type="multiple" className="w-full space-y-4">
                {class7ScienceResources.books.map((book, bookIndex) => (
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
                {class7ScienceResources.papers.map((paper, index) => (
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
