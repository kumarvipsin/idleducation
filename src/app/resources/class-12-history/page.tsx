
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, BookOpen, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const class12HistoryResources = {
  books: [
    {
      name: "Themes in Indian History Part - I",
      lang: "en",
      chapters: [
        { name: "Chapter 1: Bricks, Beads and Bones", slug: "bricks-beads-and-bones" },
        { name: "Chapter 2: Kings, Farmers and Towns", slug: "kings-farmers-and-towns" },
        { name: "Chapter 3: Kinship, Caste and Class", slug: "kinship-caste-and-class" },
        { name: "Chapter 4: Thinkers, Beliefs and Buildings", slug: "thinkers-beliefs-and-buildings" },
      ],
    },
    {
      name: "Themes in Indian History Part - II",
      lang: "en",
      chapters: [
        { name: "Chapter 5: Through the Eyes of Travellers", slug: "through-the-eyes-of-travellers" },
        { name: "Chapter 6: Bhakti-Sufi Traditions", slug: "bhakti-sufi-traditions" },
        { name: "Chapter 7: An Imperial Capital: Vijayanagara", slug: "an-imperial-capital-vijayanagara" },
        { name: "Chapter 8: Peasants, Zamindars and the State", slug: "peasants-zamindars-and-the-state" },
      ],
    },
     {
      name: "Themes in Indian History Part - III",
      lang: "en",
      chapters: [
        { name: "Chapter 9: Colonialism and the Countryside", slug: "colonialism-and-the-countryside" },
        { name: "Chapter 10: Rebels and the Raj", slug: "rebels-and-the-raj" },
        { name: "Chapter 11: Mahatma Gandhi and the Nationalist Movement", slug: "mahatma-gandhi-and-the-nationalist-movement" },
        { name: "Chapter 12: Framing the Constitution", slug: "framing-the-constitution" },
      ],
    },
    {
      name: "भारतीय इतिहास के कुछ विषय - भाग I (विषय सूचि)",
      lang: "hi",
      chapters: [
        { name: "विषय 1: ईंटें, मनके तथा अस्थियाँ", slug: "bricks-beads-and-bones" },
        { name: "विषय 2: राजा, किसान और नगर", slug: "kings-farmers-and-towns" },
        { name: "विषय 3: बंधुत्व, जाति तथा वर्ग", slug: "kinship-caste-and-class" },
        { name: "विषय 4: विचारक, विश्वास और इमारतें", slug: "thinkers-beliefs-and-buildings" },
      ],
    },
    {
      name: "भारतीय इतिहास के कुछ विषय - भाग II (विषय सूचि)",
      lang: "hi",
      chapters: [
        { name: "विषय 5: यात्रियों के नज़रिए", slug: "through-the-eyes-of-travellers" },
        { name: "विषय 6: भक्ति-सूफ़ी परंपराएँ", slug: "bhakti-sufi-traditions" },
        { name: "विषय 7: एक साम्राज्य की राजधानी: विजयनगर", slug: "an-imperial-capital-vijayanagara" },
        { name: "विषय 8: किसान, ज़मींदार और राज्य", slug: "peasants-zamindars-and-the-state" },
      ],
    },
     {
      name: "भारतीय इतिहास के कुछ विषय - भाग III (विषय सूचि)",
      lang: "hi",
      chapters: [
        { name: "विषय 9: उपनिवेशवाद और देहात", slug: "colonialism-and-the-countryside" },
        { name: "विषय 10: विद्रोही और राज", slug: "rebels-and-the-raj" },
        { name: "विषय 11: महात्मा गांधी और राष्ट्रीय आंदोलन", slug: "mahatma-gandhi-and-the-nationalist-movement" },
        { name: "विषय 12: संविधान का निर्माण", slug: "framing-the-constitution" },
      ],
    },
  ],
  papers: [
    { name: "Mid-Term Exam 2024", type: "Question Paper", icon: <FileText className="w-5 h-5 text-blue-500" /> },
    { name: "Annual Exam 2024", type: "Question Paper", icon: <FileText className="w-5 h-5 text-blue-500" /> },
  ],
};

export default function Class12HistoryPage() {
  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <Card className="shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-red-500 to-rose-600 text-white p-8">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-4 rounded-full">
              <BookOpen className="w-8 h-8" />
            </div>
            <div>
              <CardTitle className="text-3xl font-bold">Class 12 | History</CardTitle>
              <CardDescription className="text-red-100 mt-1">
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
                {class12HistoryResources.books.map((book, bookIndex) => (
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
                {class12HistoryResources.papers.map((paper, index) => (
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
