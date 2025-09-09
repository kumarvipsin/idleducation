
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, BookOpen, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const class6SocialResources = {
  books: [
    {
      name: "Our Pasts - I",
      lang: "en",
      chapters: [
        { name: "Chapter 1: What, Where, How and When?", slug: "what-where-how-and-when" },
        { name: "Chapter 2: On The Trail of The Earliest People", slug: "from-hunting-gathering-to-growing-food" },
        { name: "Chapter 3: In the Earliest Cities", slug: "in-the-earliest-cities" },
        { name: "Chapter 4: What Books and Burials Tell Us", slug: "what-books-and-burials-tell-us" },
        { name: "Chapter 5: Kingdoms, Kings and an Early Republic", slug: "kingdoms-kings-and-an-early-republic" },
        { name: "Chapter 6: New Questions and Ideas", slug: "new-questions-and-ideas" },
        { name: "Chapter 7: Ashoka, The Emperor Who Gave Up War", slug: "ashoka-the-emperor-who-gave-up-war" },
        { name: "Chapter 8: Vital Villages, Thriving Towns", slug: "vital-villages-thriving-towns" },
        { name: "Chapter 9: Traders, Kings and Pilgrims", slug: "traders-kings-and-pilgrims" },
        { name: "Chapter 10: New Empires and Kingdoms", slug: "new-empires-and-kingdoms" },
        { name: "Chapter 11: Buildings, Paintings and Books", slug: "buildings-paintings-and-books" },
      ],
    },
    {
      name: "The Earth: Our Habitat",
      lang: "en",
      chapters: [
        { name: "Chapter 1: The Earth in the Solar System", slug: "the-earth-in-the-solar-system" },
        { name: "Chapter 2: Globe: Latitudes and Longitudes", slug: "globe-latitudes-and-longitudes" },
        { name: "Chapter 3: Motions of the Earth", slug: "motions-of-the-earth" },
        { name: "Chapter 4: Maps", slug: "maps" },
        { name: "Chapter 5: Major Domains of the Earth", slug: "major-domains-of-the-earth" },
        { name: "Chapter 6: Major Landforms of the Earth", slug: "major-landforms-of-the-earth" },
        { name: "Chapter 7: Our Country - India", slug: "our-country-india" },
        { name: "Chapter 8: India: Climate, Vegetation and Wildlife", slug: "india-climate-vegetation-and-wildlife" },
      ],
    },
    {
      name: "Social and Political Life - I",
      lang: "en",
      chapters: [
        { name: "Chapter 1: Understanding Diversity", slug: "understanding-diversity" },
        { name: "Chapter 2: Diversity and Discrimination", slug: "diversity-and-discrimination" },
        { name: "Chapter 3: What is Government?", slug: "what-is-government" },
        { name: "Chapter 4: Key Elements of a Democratic Government", slug: "key-elements-of-a-democratic-government" },
        { name: "Chapter 5: Panchayati Raj", slug: "panchayati-raj" },
        { name: "Chapter 6: Rural Administration", slug: "rural-administration" },
        { name: "Chapter 7: Urban Administration", slug: "urban-administration" },
        { name: "Chapter 8: Rural Livelihoods", slug: "rural-livelihoods" },
        { name: "Chapter 9: Urban Livelihoods", slug: "urban-livelihoods" },
      ],
    },
  ],
  papers: [
    { name: "Mid-Term Exam 2024", type: "Question Paper", icon: <FileText className="w-5 h-5 text-blue-500" /> },
    { name: "Annual Exam 2024", type: "Question Paper", icon: <FileText className="w-5 h-5 text-blue-500" /> },
  ],
};

export default function Class6SocialPage() {
  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <Card className="shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-amber-500 to-orange-600 text-white p-8">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-4 rounded-full">
              <BookOpen className="w-8 h-8" />
            </div>
            <div>
              <CardTitle className="text-3xl font-bold">Class 6 | Social Studies</CardTitle>
              <CardDescription className="text-amber-100 mt-1">
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
                {class6SocialResources.books.map((book, bookIndex) => (
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
                {class6SocialResources.papers.map((paper, index) => (
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
