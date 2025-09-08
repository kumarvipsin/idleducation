
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { FileText, Edit, BookOpen, BrainCircuit } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const scienceResources = {
  books: [
    {
      name: "Science Class X (2025 Syllabus)",
      lang: "en",
      chapters: [
        { name: "Chapter 1: Chemical Reactions and Equations", slug: "chemical-reactions-and-equations" },
        { name: "Chapter 2: Acids, Bases and Salts", slug: "acids-bases-and-salts" },
        { name: "Chapter 3: Metals and Non-metals", slug: "metals-and-non-metals" },
        { name: "Chapter 4: Carbon and its Compounds", slug: "carbon-and-its-compounds" },
        { name: "Chapter 5: Life Processes", slug: "life-processes" },
        { name: "Chapter 6: Control and Coordination", slug: "control-and-coordination" },
        { name: "Chapter 7: How do Organisms Reproduce?", slug: "how-do-organisms-reproduce" },
        { name: "Chapter 8: Heredity", slug: "heredity" },
        { name: "Chapter 9: Light – Reflection and Refraction", slug: "light-reflection-and-refraction" },
        { name: "Chapter 10: The Human Eye and the Colourful World", slug: "human-eye-and-colourful-world" },
        { name: "Chapter 11: Electricity", slug: "electricity" },
        { name: "Chapter 12: Magnetic Effects of Electric Current", slug: "magnetic-effects-of-electric-current" },
        { name: "Chapter 13: Our Environment", slug: "our-environment" },
      ],
    },
    {
      name: "विज्ञान कक्षा X (2025 पाठ्यक्रम)",
      lang: "hi",
      chapters: [
        { name: "अध्याय 1: रासायनिक अभिक्रियाएँ एवं समीकरण", slug: "chemical-reactions-and-equations" },
        { name: "अध्याय 2: अम्ल, क्षारक एवं लवण", slug: "acids-bases-and-salts" },
        { name: "अध्याय 3: धातु एवं अधातु", slug: "metals-and-non-metals" },
        { name: "अध्याय 4: कार्बन एवं उसके यौगिक", slug: "carbon-and-its-compounds" },
        { name: "अध्याय 5: जैव प्रक्रम", slug: "life-processes" },
        { name: "अध्याय 6: नियंत्रण एवं समन्वय", slug: "control-and-coordination" },
        { name: "अध्याय 7: जीव जनन कैसे करते हैं?", slug: "how-do-organisms-reproduce" },
        { name: "अध्याय 8: आनुवंशिकता", slug: "heredity" },
        { name: "अध्याय 9: प्रकाश – परावर्तन तथा अपवर्तन", slug: "light-reflection-and-refraction" },
        { name: "अध्याय 10: मानव नेत्र तथा रंगबिरंगा संसार", slug: "human-eye-and-colourful-world" },
        { name: "अध्याय 11: विद्युत", slug: "electricity" },
        { name: "अध्याय 12: विद्युत धारा के चुंबकीय प्रभाव", slug: "magnetic-effects-of-electric-current" },
        { name: "अध्याय 13: हमारा पर्यावरण", slug: "our-environment" },
      ],
    },
  ],
  papers: [
    { name: "Mid-Term Exam 2024", type: "Question Paper", icon: <FileText className="w-5 h-5 text-blue-500" /> },
    { name: "Annual Exam 2024", type: "Question Paper", icon: <FileText className="w-5 h-5 text-blue-500" /> },
    { name: "Unit Test 1 (Chapters 1-3)", type: "Test Paper", icon: <Edit className="w-5 h-5 text-green-500" /> },
    { name: "Half-Yearly Revision", type: "Practice Paper", icon: <BrainCircuit className="w-5 h-5 text-yellow-500" /> },
    { name: "Advanced Problems Set", type: "Extra Paper", icon: <BookOpen className="w-5 h-5 text-purple-500" /> },
  ],
};

export default function ScienceDetailsPage() {
  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <Card className="shadow-lg">
        <CardHeader className="bg-primary text-primary-foreground">
          <CardTitle className="text-2xl">Class 10 | Science</CardTitle>
          <CardDescription className="text-primary-foreground/80">Explore comprehensive resources for your Class 10 Science curriculum (2025 NCERT Syllabus).</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-bold mb-4">Chapters & Topics</h2>
              <Accordion type="multiple" className="w-full space-y-4">
                {scienceResources.books.map((book, bookIndex) => (
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
