
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { FileText, Edit, BookOpen, BrainCircuit } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const class6ScienceResources = {
  books: [
    {
      name: "Science Textbook for Class VI",
      lang: "en",
      chapters: [
        { name: "Chapter 1: Food: Where Does It Come From?", slug: "food-where-does-it-come-from" },
        { name: "Chapter 2: Components of Food", slug: "components-of-food" },
        { name: "Chapter 3: Fibre to Fabric", slug: "fibre-to-fabric" },
        { name: "Chapter 4: Sorting Materials into Groups", slug: "sorting-materials-into-groups" },
        { name: "Chapter 5: Separation of Substances", slug: "separation-of-substances" },
        { name: "Chapter 6: Changes Around Us", slug: "changes-around-us" },
        { name: "Chapter 7: Getting to Know Plants", slug: "getting-to-know-plants" },
        { name: "Chapter 8: Body Movements", slug: "body-movements" },
        { name: "Chapter 9: The Living Organisms and Their Surroundings", slug: "the-living-organisms-and-their-surroundings" },
        { name: "Chapter 10: Motion and Measurement of Distances", slug: "motion-and-measurement-of-distances" },
        { name: "Chapter 11: Light, Shadows and Reflections", slug: "light-shadows-and-reflections" },
        { name: "Chapter 12: Electricity and Circuits", slug: "electricity-and-circuits" },
      ],
    },
    {
      name: "विज्ञान कक्षा 6",
      lang: "hi",
      chapters: [
        { name: "अध्याय 1: भोजन: यह कहाँ से आता है?", slug: "food-where-does-it-come-from" },
        { name: "अध्याय 2: भोजन के घटक", slug: "components-of-food" },
        { name: "अध्याय 3: तंतु से वस्त्र तक", slug: "fibre-to-fabric" },
        { name: "अध्याय 4: वस्तुओं के समूह बनाना", slug: "sorting-materials-into-groups" },
        { name: "अध्याय 5: पदार्थों का पृथक्करण", slug: "separation-of-substances" },
        { name: "अध्याय 6: हमारे चारों ओर के परिवर्तन", slug: "changes-around-us" },
        { name: "अध्याय 7: पौधों को जानिए", slug: "getting-to-know-plants" },
        { name: "अध्याय 8: शरीर में गति", slug: "body-movements" },
        { name: "अध्याय 9: सजीव एवं उनका परिवेश", slug: "the-living-organisms-and-their-surroundings" },
        { name: "अध्याय 10: गति एवं दूरियों का मापन", slug: "motion-and-measurement-of-distances" },
        { name: "अध्याय 11: प्रकाश – छायाएँ एवं परावर्तन", slug: "light-shadows-and-reflections" },
        { name: "अध्याय 12: विद्युत् तथा परिपथ", slug: "electricity-and-circuits" },
      ],
    },
  ],
  papers: [
    { name: "Mid-Term Exam 2024", type: "Question Paper", icon: <FileText className="w-5 h-5 text-blue-500" /> },
    { name: "Annual Exam 2024", type: "Question Paper", icon: <FileText className="w-5 h-5 text-blue-500" /> },
  ],
};

export default function Class6SciencePage() {
  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <Card className="shadow-lg">
        <CardHeader className="bg-primary text-primary-foreground">
          <CardTitle className="text-2xl">Class 6 | Science</CardTitle>
          <CardDescription className="text-primary-foreground/80">Explore resources for Class 6 Science (2025 NCERT Syllabus).</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-bold mb-4">Chapters & Topics</h2>
              <Accordion type="multiple" className="w-full space-y-4">
                {class6ScienceResources.books.map((book, bookIndex) => (
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
                {class6ScienceResources.papers.map((paper, index) => (
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
