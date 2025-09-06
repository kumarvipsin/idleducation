
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { FileText, Edit, BookOpen, BrainCircuit } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const scienceResources = {
  chapters: [
    { name: "Chapter 1: Chemical Reactions and Equations", topics: ["Balancing chemical equations", "Types of chemical reactions"] },
    { name: "Chapter 2: Acids, Bases and Salts", topics: ["Properties of acids and bases", "pH scale", "Important salts"] },
    { name: "Chapter 3: Metals and Non-metals", topics: ["Physical and chemical properties", "Reactivity series", "Corrosion"] },
    { name: "Chapter 6: Life Processes", topics: ["Nutrition", "Respiration", "Transportation", "Excretion"] },
    { name: "Chapter 10: Light - Reflection and Refraction", topics: ["Laws of reflection", "Spherical mirrors", "Refraction of light"] },
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
          <CardTitle className="text-3xl">Science Course Resources</CardTitle>
          <CardDescription className="text-primary-foreground/80">All your study materials for Science in one place.</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-bold mb-4">Chapters & Topics</h2>
              <Accordion type="single" collapsible className="w-full">
                {scienceResources.chapters.map((chapter, index) => (
                  <AccordionItem value={`item-${index}`} key={index}>
                    <AccordionTrigger className="font-semibold">{chapter.name}</AccordionTrigger>
                    <AccordionContent>
                      <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                        {chapter.topics.map((topic, i) => (
                          <li key={i}>{topic}</li>
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
