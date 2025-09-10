
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, BookOpen, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const class12EconomicsResources = {
  books: [
    {
      name: "Introductory Microeconomics",
      lang: "en",
      chapters: [
        { name: "Chapter 1: Introduction", slug: "introduction-micro" },
        { name: "Chapter 2: Theory of Consumer Behaviour", slug: "theory-of-consumer-behaviour" },
        { name: "Chapter 3: Production and Costs", slug: "production-and-costs" },
        { name: "Chapter 4: The Theory of the Firm under Perfect Competition", slug: "theory-of-firm-perfect-competition" },
        { name: "Chapter 5: Market Equilibrium", slug: "market-equilibrium" },
        { name: "Chapter 6: Non-Competitive Markets", slug: "non-competitive-markets" },
      ],
    },
    {
      name: "Introductory Macroeconomics",
      lang: "en",
      chapters: [
        { name: "Chapter 1: Introduction", slug: "introduction-macro" },
        { name: "Chapter 2: National Income Accounting", slug: "national-income-accounting" },
        { name: "Chapter 3: Money and Banking", slug: "money-and-banking" },
        { name: "Chapter 4: Determination of Income and Employment", slug: "determination-of-income-and-employment" },
        { name: "Chapter 5: Government Budget and the Economy", slug: "government-budget-and-the-economy" },
        { name: "Chapter 6: Open Economy Macroeconomics", slug: "open-economy-macroeconomics" },
      ],
    },
    {
      name: "व्यष्टि अर्थशास्त्र: एक परिचय (विषय सूचि)",
      lang: "hi",
      chapters: [
        { name: "अध्याय 1: परिचय", slug: "introduction-micro" },
        { name: "अध्याय 2: उपभोक्ता के व्यवहार का सिद्धांत", slug: "theory-of-consumer-behaviour" },
        { name: "अध्याय 3: उत्पादन तथा लागत", slug: "production-and-costs" },
        { name: "अध्याय 4: पूर्ण प्रतिस्पर्धा की स्थिति में फर्म का सिद्धांत", slug: "theory-of-firm-perfect-competition" },
        { name: "अध्याय 5: बाजार संतुलन", slug: "market-equilibrium" },
        { name: "अध्याय 6: प्रतिस्पर्धारहित बाजार", slug: "non-competitive-markets" },
      ],
    },
    {
      name: "समष्टि अर्थशास्त्र: एक परिचय (विषय सूचि)",
      lang: "hi",
      chapters: [
        { name: "अध्याय 1: परिचय", slug: "introduction-macro" },
        { name: "अध्याय 2: राष्ट्रीय आय का लेखांकन", slug: "national-income-accounting" },
        { name: "अध्याय 3: मुद्रा और बैंकिंग", slug: "money-and-banking" },
        { name: "अध्याय 4: आय और रोजगार के निर्धारण", slug: "determination-of-income-and-employment" },
        { name: "अध्याय 5: सरकारी बजट एवं अर्थव्यवस्था", slug: "government-budget-and-the-economy" },
        { name: "अध्याय 6: खुली अर्थव्यवस्था - समष्टि अर्थशास्त्र", slug: "open-economy-macroeconomics" },
      ],
    },
  ],
  papers: [
    { name: "Mid-Term Exam 2024", type: "Question Paper", icon: <FileText className="w-5 h-5 text-blue-500" /> },
    { name: "Annual Exam 2024", type: "Question Paper", icon: <FileText className="w-5 h-5 text-blue-500" /> },
  ],
};

export default function Class12EconomicsPage() {
  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <Card className="shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-pink-500 to-rose-600 text-white p-8">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-4 rounded-full">
              <BookOpen className="w-8 h-8" />
            </div>
            <div>
              <CardTitle className="text-3xl font-bold">Class 12 | Economics</CardTitle>
              <CardDescription className="text-pink-100 mt-1">
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
                {class12EconomicsResources.books.map((book, bookIndex) => (
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
                {class12EconomicsResources.papers.map((paper, index) => (
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
