
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, BookOpen, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const class11PolSciResources = {
  books: [
    {
      name: "Indian Constitution at Work",
      lang: "en",
      chapters: [
        { name: "Chapter 1: Constitution: Why and How?", slug: "constitution-why-and-how" },
        { name: "Chapter 2: Rights in the Indian Constitution", slug: "rights-in-the-indian-constitution" },
        { name: "Chapter 3: Election and Representation", slug: "election-and-representation" },
        { name: "Chapter 4: Executive", slug: "executive" },
        { name: "Chapter 5: Legislature", slug: "legislature" },
        { name: "Chapter 6: Judiciary", slug: "judiciary" },
        { name: "Chapter 7: Federalism", slug: "federalism-11" },
        { name: "Chapter 8: Local Governments", slug: "local-governments" },
        { name: "Chapter 9: Constitution as a Living Document", slug: "constitution-as-a-living-document" },
        { name: "Chapter 10: The Philosophy of the Constitution", slug: "the-philosophy-of-the-constitution" },
      ],
    },
    {
      name: "Political Theory",
      lang: "en",
      chapters: [
        { name: "Chapter 1: Political Theory: An Introduction", slug: "political-theory-an-introduction" },
        { name: "Chapter 2: Freedom", slug: "freedom-11" },
        { name: "Chapter 3: Equality", slug: "equality" },
        { name: "Chapter 4: Social Justice", slug: "social-justice" },
        { name: "Chapter 5: Rights", slug: "rights" },
        { name: "Chapter 6: Citizenship", slug: "citizenship" },
        { name: "Chapter 7: Nationalism", slug: "nationalism" },
        { name: "Chapter 8: Secularism", slug: "secularism" },
        { name: "Chapter 9: Peace", slug: "peace" },
        { name: "Chapter 10: Development", slug: "development-11" },
      ],
    },
    {
      name: "भारत का संविधान: सिद्धांत और व्यवहार (विषय सूचि)",
      lang: "hi",
      chapters: [
        { name: "अध्याय 1: संविधान: क्यों और कैसे?", slug: "constitution-why-and-how" },
        { name: "अध्याय 2: भारतीय संविधान में अधिकार", slug: "rights-in-the-indian-constitution" },
        { name: "अध्याय 3: चुनाव और प्रतिनिधित्व", slug: "election-and-representation" },
        { name: "अध्याय 4: कार्यपालिका", slug: "executive" },
        { name: "अध्याय 5: विधायिका", slug: "legislature" },
        { name: "अध्याय 6: न्यायपालिका", slug: "judiciary" },
        { name: "अध्याय 7: संघवाद", slug: "federalism-11" },
        { name: "अध्याय 8: स्थानीय शासन", slug: "local-governments" },
        { name: "अध्याय 9: संविधान: एक जीवंत दस्तावेज़", slug: "constitution-as-a-living-document" },
        { name: "अध्याय 10: संविधान का राजनीतिक दर्शन", slug: "the-philosophy-of-the-constitution" },
      ],
    },
    {
      name: "राजनीतिक सिद्धांत (विषय सूचि)",
      lang: "hi",
      chapters: [
        { name: "अध्याय 1: राजनीतिक सिद्धांत: एक परिचय", slug: "political-theory-an-introduction" },
        { name: "अध्याय 2: स्वतंत्रता", slug: "freedom-11" },
        { name: "अध्याय 3: समानता", slug: "equality" },
        { name: "अध्याय 4: सामाजिक न्याय", slug: "social-justice" },
        { name: "अध्याय 5: अधिकार", slug: "rights" },
        { name: "अध्याय 6: नागरिकता", slug: "citizenship" },
        { name: "अध्याय 7: राष्ट्रवाद", slug: "nationalism" },
        { name: "अध्याय 8: धर्मनिरपेक्षता", slug: "secularism" },
        { name: "अध्याय 9: शांति", slug: "peace" },
        { name: "अध्याय 10: विकास", slug: "development-11" },
      ],
    },
  ],
  papers: [
    { name: "Mid-Term Exam 2024", type: "Question Paper", icon: <FileText className="w-5 h-5 text-blue-500" /> },
    { name: "Annual Exam 2024", type: "Question Paper", icon: <FileText className="w-5 h-5 text-blue-500" /> },
  ],
};

export default function Class11PolSciPage() {
  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <Card className="shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-8">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-4 rounded-full">
              <BookOpen className="w-8 h-8" />
            </div>
            <div>
              <CardTitle className="text-3xl font-bold">Class 11 | Political Science</CardTitle>
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
                {class11PolSciResources.books.map((book, bookIndex) => (
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
                {class11PolSciResources.papers.map((paper, index) => (
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
