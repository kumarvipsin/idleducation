
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { FileText, Edit, BookOpen, BrainCircuit } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const scienceResources = {
  books: [
    {
      name: "Book 2: Politics in India Since Independence",
      name_hi: "स्वतंत्र भारत में राजनीति",
      chapters: [
        { name: "Chapter 1: Challenges of Nation Building", name_hi: "अध्याय 1: राष्ट्र-निर्माण की चुनौतियाँ", slug: "challenges-of-nation-building" },
        { name: "Chapter 2: Era of One-Party Dominance", name_hi: "अध्याय 2: एक दल के प्रभुत्व का दौर", slug: "era-of-one-party-dominance" },
        { name: "Chapter 3: Politics of Planned Development", name_hi: "अध्याय 3: नियोजित विकास की राजनीति", slug: "politics-of-planned-development" },
        { name: "Chapter 4: India’s External Relations", name_hi: "अध्याय 4: भारत के विदेश संबंध", slug: "indias-external-relations" },
        { name: "Chapter 5: Challenges to and Restoration of the Congress System", name_hi: "अध्याय 5: कांग्रेस प्रणाली: चुनौतियाँ और पुनर्स्थापना", slug: "challenges-to-and-restoration-of-the-congress-system" },
        { name: "Chapter 6: The Crisis of Democratic Order", name_hi: "अध्याय 6: लोकतांत्रिक व्यवस्था का संकट", slug: "the-crisis-of-democratic-order" },
        { name: "Chapter 7: Rise of Popular Movements", name_hi: "अध्याय 7: जन आंदोलनों का उदय", slug: "rise-of-popular-movements" },
        { name: "Chapter 8: Regional Aspirations", name_hi: "अध्याय 8: क्षेत्रीय आकांक्षाएँ", slug: "regional-aspirations" },
        { name: "Chapter 9: Recent Developments in Indian Politics", name_hi: "अध्याय 9: भारतीय राजनीति: नए बदलाव", slug: "recent-developments-in-indian-politics" },
      ]
    }
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
