
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { FileText, Edit, BookOpen, BrainCircuit } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const scienceResources = {
  books: [
    
  ],
  papers: [
    { name: "Mid-Term Exam 2023", type: "Question Paper", icon: <FileText className="w-5 h-5 text-blue-500" /> },
    { name: "Annual Exam 2023", type: "Question Paper", icon: <FileText className="w-5 h-5 text-blue-500" /> },
    { name: "Unit Test 1 (Chapters 1-2)", type: "Test Paper", icon: <Edit className="w-5 h-5 text-green-500" /> },
    { name: "Half-Yearly Revision", type: "Practice Paper", icon: <BrainCircuit className="w-5 h-5 text-yellow-500" /> },
    { name: "Advanced Problems Set", type: "Extra Paper", icon: <BookOpen className="w-5 h-5 text-purple-500" /> },
  ],
};

export default function ScienceDetailsPage() {
  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <Card className="shadow-lg">
        <CardHeader className="bg-primary text-primary-foreground">
          <CardTitle className="text-2xl">Class 12 | Political Science | Book-1 | Book-2</CardTitle>
          <CardDescription className="text-primary-foreground/80">Explore comprehensive resources for your Class 12 Political Science curriculum.</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-bold mb-4">Chapters & Topics</h2>
              <Accordion type="multiple" className="w-full space-y-4">
                {scienceResources.books.map((book, bookIndex) => (
                  <AccordionItem value={`book-${bookIndex}`} key={bookIndex} className="border rounded-lg">
                    <AccordionTrigger className="font-semibold text-lg p-4">
                      <div>
                        <p>{book.name}</p>
                        <p className="text-sm font-normal text-muted-foreground">{book.name_hi}</p>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="p-4 pt-0">
                      <ul className="space-y-2 text-muted-foreground">
                        {book.chapters.map((chapter, chapterIndex) => (
                          <li key={chapterIndex} className="p-2 rounded-md hover:bg-muted/50">
                             <Link href={`/resources/notes-details/${chapter.slug}?lang=en`} className="font-medium text-foreground hover:underline">{chapter.name}</Link>
                            <br />
                            <Link href={`/resources/notes-details/${chapter.slug}?lang=hi`} className="text-sm hover:underline">{chapter.name_hi}</Link>
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
                {scienceResources.papers.map((paper, index) => (
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
