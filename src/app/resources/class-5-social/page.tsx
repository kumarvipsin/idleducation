
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { FileText, Edit, BookOpen, BrainCircuit } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const class5SocialResources = {
  books: [
    {
      name: "Social Studies Class V",
      lang: "en",
      chapters: [
        { name: "Chapter 1: Globes and Maps", slug: "globes-and-maps" },
        { name: "Chapter 2: The Earth's Movements", slug: "the-earths-movements" },
        { name: "Chapter 3: Weather and Climate", slug: "weather-and-climate" },
        { name: "Chapter 4: Major Landforms", slug: "major-landforms" },
        { name: "Chapter 5: Our Rich Heritage", slug: "our-rich-heritage" },
      ],
    },
    {
      name: "सामाजिक अध्ययन कक्षा 5",
      lang: "hi",
      chapters: [
        { name: "अध्याय 1: ग्लोब और मानचित्र", slug: "globes-and-maps" },
        { name: "अध्याय 2: पृथ्वी की गतियाँ", slug: "the-earths-movements" },
        { name: "अध्याय 3: मौसम और जलवायु", slug: "weather-and-climate" },
        { name: "अध्याय 4: प्रमुख स्थलाकृतियाँ", slug: "major-landforms" },
        { name: "अध्याय 5: हमारी समृद्ध विरासत", slug: "our-rich-heritage" },
      ],
    },
  ],
  papers: [
    { name: "Mid-Term Exam 2024", type: "Question Paper", icon: <FileText className="w-5 h-5 text-blue-500" /> },
    { name: "Annual Exam 2024", type: "Question Paper", icon: <FileText className="w-5 h-5 text-blue-500" /> },
  ],
};

export default function Class5SocialPage() {
  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <Card className="shadow-lg">
        <CardHeader className="bg-primary text-primary-foreground">
          <CardTitle className="text-2xl">Class 5 | Social Studies</CardTitle>
          <CardDescription className="text-primary-foreground/80">Explore resources for Class 5 Social Studies (2025 NCERT Syllabus).</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-bold mb-4">Chapters & Topics</h2>
              <Accordion type="multiple" className="w-full space-y-4">
                {class5SocialResources.books.map((book, bookIndex) => (
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
                {class5SocialResources.papers.map((paper, index) => (
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
