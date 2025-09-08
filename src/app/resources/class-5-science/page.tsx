
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { FileText, Edit, BookOpen, BrainCircuit } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const class5ScienceResources = {
  books: [
    {
      name: "Looking Around Textbook for Class V",
      lang: "en",
      chapters: [
        { name: "Chapter 1: Super Senses", slug: "super-senses" },
        { name: "Chapter 2: A Snake Charmer's Story", slug: "a-snake-charmers-story" },
        { name: "Chapter 3: From Tasting to Digesting", slug: "from-tasting-to-digesting" },
        { name: "Chapter 4: Mangoes Round the Year", slug: "mangoes-round-the-year" },
        { name: "Chapter 5: Seeds and Seeds", slug: "seeds-and-seeds" },
        { name: "Chapter 6: Every Drop Counts", slug: "every-drop-counts" },
        { name: "Chapter 7: Experiments with Water", slug: "experiments-with-water" },
        { name: "Chapter 8: A Treat for Mosquitoes", slug: "a-treat-for-mosquitoes" },
        { name: "Chapter 9: Up You Go!", slug: "up-you-go" },
        { name: "Chapter 10: Walls Tell Stories", slug: "walls-tell-stories" },
      ],
    },
    {
      name: "आस-पास कक्षा 5",
      lang: "hi",
      chapters: [
        { name: "अध्याय 1: कैसे पहचाना चींटी ने दोस्त को?", slug: "super-senses" },
        { name: "अध्याय 2: कहानी सँपेरों की", slug: "a-snake-charmers-story" },
        { name: "अध्याय 3: चखने से पचने तक", slug: "from-tasting-to-digesting" },
        { name: "अध्याय 4: खाएँ आम बारहों महीने", slug: "mangoes-round-the-year" },
        { name: "अध्याय 5: बीज, बीज, बीज", slug: "seeds-and-seeds" },
        { name: "अध्याय 6: बूँद-बूँद, दरिया-दरिया", slug: "every-drop-counts" },
        { name: "अध्याय 7: पानी के प्रयोग", slug: "experiments-with-water" },
        { name: "अध्याय 8: मच्छरों की दावत?", slug: "a-treat-for-mosquitoes" },
        { name: "अध्याय 9: डायरी: कमर सीधी, ऊपर चढ़ो!", slug: "up-you-go" },
        { name: "अध्याय 10: बोलती इमारतें", slug: "walls-tell-stories" },
      ],
    },
  ],
  papers: [
    { name: "Mid-Term Exam 2024", type: "Question Paper", icon: <FileText className="w-5 h-5 text-blue-500" /> },
    { name: "Annual Exam 2024", type: "Question Paper", icon: <FileText className="w-5 h-5 text-blue-500" /> },
  ],
};

export default function Class5SciencePage() {
  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <Card className="shadow-lg">
        <CardHeader className="bg-primary text-primary-foreground">
          <CardTitle className="text-2xl">Class 5 | Science</CardTitle>
          <CardDescription className="text-primary-foreground/80">Explore resources for Class 5 Science (2025 NCERT Syllabus).</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-bold mb-4">Chapters & Topics</h2>
              <Accordion type="multiple" className="w-full space-y-4">
                {class5ScienceResources.books.map((book, bookIndex) => (
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
                {class5ScienceResources.papers.map((paper, index) => (
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
