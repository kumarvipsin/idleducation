
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, BookOpen, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";

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
      name: "विषय सूचि",
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
      <Card className="shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-8">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-4 rounded-full">
              <BookOpen className="w-8 h-8" />
            </div>
            <div>
              <CardTitle className="text-3xl font-bold">Class 5 | Science</CardTitle>
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
                {class5ScienceResources.books.map((book, bookIndex) => (
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
                {class5ScienceResources.papers.map((paper, index) => (
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
