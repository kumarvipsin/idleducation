
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, BookOpen, ChevronRight } from "lucide-react";
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
      <Card className="shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-8">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-4 rounded-full">
              <BookOpen className="w-8 h-8" />
            </div>
            <div>
              <CardTitle className="text-3xl font-bold">Class 6 | Science</CardTitle>
              <CardDescription className="text-blue-100 mt-1">
                Explore resources for the 2025 NCERT Syllabus.
              </CardDescription>
            </div>
          </div>
        </div>
        <CardContent className="p-6 bg-muted/20">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-3">
              <h2 className="text-2xl font-bold mb-4 text-foreground">Chapters & Topics</h2>
              <div className="space-y-6">
                {class6ScienceResources.books.map((book, bookIndex) => (
                  <div key={bookIndex}>
                    <h3 className="text-lg font-semibold mb-3 text-foreground/80">{book.name}</h3>
                    <div className="space-y-2">
                      {book.chapters.map((chapter, chapterIndex) => (
                        <Button
                          key={chapterIndex}
                          asChild
                          variant="ghost"
                          className="w-full justify-start text-left h-auto py-3 group"
                        >
                           <Link href={`/resources/notes-details/${chapter.slug}?lang=${book.lang}`}>
                              {chapter.name}
                              <ChevronRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                          </Link>
                        </Button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold mb-4 text-foreground">Papers & Materials</h2>
              <div className="space-y-4">
                {class6ScienceResources.papers.map((paper, index) => (
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
