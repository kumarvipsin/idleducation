
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, BookOpen, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const class12GeographyResources = {
  books: [
    {
      name: "Fundamentals of Human Geography",
      lang: "en",
      chapters: [
        { name: "Chapter 1: Human Geography: Nature and Scope", slug: "human-geography-nature-and-scope" },
        { name: "Chapter 2: The World Population: Distribution, Density and Growth", slug: "the-world-population-distribution-density-and-growth" },
        { name: "Chapter 3: Human Development", slug: "human-development" },
        { name: "Chapter 4: Primary Activities", slug: "primary-activities" },
        { name: "Chapter 5: Secondary Activities", slug: "secondary-activities" },
        { name: "Chapter 6: Tertiary and Quaternary Activities", slug: "tertiary-and-quaternary-activities" },
        { name: "Chapter 7: Transport and Communication", slug: "transport-and-communication" },
        { name: "Chapter 8: International Trade", slug: "international-trade" },
      ],
    },
    {
      name: "India: People and Economy",
      lang: "en",
      chapters: [
        { name: "Chapter 1: Population: Distribution, Density, Growth and Composition", slug: "population-distribution-density-growth-and-composition" },
        { name: "Chapter 2: Human Settlements", slug: "human-settlements" },
        { name: "Chapter 3: Land Resources and Agriculture", slug: "land-resources-and-agriculture" },
        { name: "Chapter 4: Water Resources", slug: "water-resources" },
        { name: "Chapter 5: Mineral and Energy Resources", slug: "mineral-and-energy-resources" },
        { name: "Chapter 6: Planning and Sustainable Development in Indian Context", slug: "planning-and-sustainable-development-in-indian-context" },
        { name: "Chapter 7: Transport and Communication", slug: "transport-and-communication-india" },
        { name: "Chapter 8: International Trade", slug: "international-trade-india" },
        { name: "Chapter 9: Geographical Perspective on Selected Issues and Problems", slug: "geographical-perspective-on-selected-issues-and-problems" },
      ],
    },
    {
      name: "मानव भूगोल के मूल सिद्धांत (विषय सूचि)",
      lang: "hi",
      chapters: [
        { name: "अध्याय 1: मानव भूगोल – प्रकृति एवं विषय क्षेत्र", slug: "human-geography-nature-and-scope" },
        { name: "अध्याय 2: विश्व जनसंख्या-वितरण, घनत्व और वृद्धि", slug: "the-world-population-distribution-density-and-growth" },
        { name: "अध्याय 3: मानव विकास", slug: "human-development" },
        { name: "अध्याय 4: प्राथमिक क्रियाएँ", slug: "primary-activities" },
        { name: "अध्याय 5: द्वितीयक क्रियाएँ", slug: "secondary-activities" },
        { name: "अध्याय 6: तृतीयक और चतुर्थ क्रियाकलाप", slug: "tertiary-and-quaternary-activities" },
        { name: "अध्याय 7: परिवहन एवं संचार", slug: "transport-and-communication" },
        { name: "अध्याय 8: अंतर्राष्ट्रीय व्यापार", slug: "international-trade" },
      ],
    },
    {
      name: "भारत - लोग और अर्थव्यवस्था (विषय सूचि)",
      lang: "hi",
      chapters: [
        { name: "अध्याय 1: जनसंख्या: वितरण, घनत्व, वृद्धि और संघटन", slug: "population-distribution-density-growth-and-composition" },
        { name: "अध्याय 2: मानव बस्तियाँ", slug: "human-settlements" },
        { name: "अध्याय 3: भूसंसाधन तथा कृषि", slug: "land-resources-and-agriculture" },
        { name: "अध्याय 4: जल-संसाधन", slug: "water-resources" },
        { name: "अध्याय 5: खनिज तथा ऊर्जा संसाधन", slug: "mineral-and-energy-resources" },
        { name: "अध्याय 6: भारत के संदर्भ में नियोजन और सततपोषणीय विकास", slug: "planning-and-sustainable-development-in-indian-context" },
        { name: "अध्याय 7: परिवहन तथा संचार", slug: "transport-and-communication-india" },
        { name: "अध्याय 8: अंतर्राष्ट्रीय व्यापार", slug: "international-trade-india" },
        { name: "अध्याय 9: भौगोलिक परिप्रेक्ष्य में चयनित कुछ मुद्दे एवं समस्याएँ", slug: "geographical-perspective-on-selected-issues-and-problems" },
      ],
    },
  ],
  papers: [
    { name: "Mid-Term Exam 2024", type: "Question Paper", icon: <FileText className="w-5 h-5 text-blue-500" /> },
    { name: "Annual Exam 2024", type: "Question Paper", icon: <FileText className="w-5 h-5 text-blue-500" /> },
  ],
};

export default function Class12GeographyPage() {
  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <Card className="shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-amber-500 to-orange-600 text-white p-8">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-4 rounded-full">
              <BookOpen className="w-8 h-8" />
            </div>
            <div>
              <CardTitle className="text-3xl font-bold">Class 12 | Geography</CardTitle>
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
                {class12GeographyResources.books.map((book, bookIndex) => (
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
                {class12GeographyResources.papers.map((paper, index) => (
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
