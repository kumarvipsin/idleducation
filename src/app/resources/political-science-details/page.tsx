
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { FileText, Edit, BookOpen, BrainCircuit } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const politicalScienceResources = {
  books: [
    {
      name: "Politics in India Since Independence",
      lang: "en",
      chapters: [
        { name: "Chapter 1: Challenges of Nation Building", slug: "challenges-of-nation-building" },
        { name: "Chapter 2: Era of One-party Dominance", slug: "era-of-one-party-dominance" },
        { name: "Chapter 3: Politics of Planned Development", slug: "politics-of-planned-development" },
        { name: "Chapter 4: India’s External Relations", slug: "indias-external-relations" },
        { name: "Chapter 5: Challenges to and Restoration of the Congress System", slug: "challenges-to-and-restoration-of-the-congress-system" },
        { name: "Chapter 6: The Crisis of Democratic Order", slug: "the-crisis-of-democratic-order" },
        { name: "Chapter 7: Rise of Popular Movements", slug: "rise-of-popular-movements" },
        { name: "Chapter 8: Regional Aspirations", slug: "regional-aspirations" },
        { name: "Chapter 9: Recent Developments in Indian Politics", slug: "recent-developments-in-indian-politics" },
      ],
    },
    {
      name: "Contemporary World Politics",
      lang: "en",
      chapters: [
        { name: "Chapter 1: The Cold War Era", slug: "the-cold-war-era" },
        { name: "Chapter 2: The End of Bipolarity", slug: "the-end-of-bipolarity" },
        { name: "Chapter 3: US Hegemony in World Politics", slug: "us-hegemony-in-world-politics" },
        { name: "Chapter 4: Alternative Centres of Power", slug: "alternative-centres-of-power" },
        { name: "Chapter 5: Contemporary South Asia", slug: "contemporary-south-asia" },
        { name: "Chapter 6: International Organisations", slug: "international-organisations" },
        { name: "Chapter 7: Security in the Contemporary World", slug: "security-in-the-contemporary-world" },
        { name: "Chapter 8: Environment and Natural Resources", slug: "environment-and-natural-resources" },
        { name: "Chapter 9: Globalisation", slug: "globalisation" },
      ],
    },
    {
      name: "स्वतंत्र भारत में राजनीति",
      lang: "hi",
      chapters: [
        { name: "अध्याय 1: राष्ट्र-निर्माण की चुनौतियाँ", slug: "challenges-of-nation-building" },
        { name: "अध्याय 2: एक दल के प्रभुत्व का दौर", slug: "era-of-one-party-dominance" },
        { name: "अध्याय 3: नियोजित विकास की राजनीति", slug: "politics-of-planned-development" },
        { name: "अध्याय 4: भारत के विदेश संबंध", slug: "indias-external-relations" },
        { name: "अध्याय 5: कांग्रेस प्रणाली: चुनौतियाँ और पुनर्स्थापना", slug: "challenges-to-and-restoration-of-the-congress-system" },
        { name: "अध्याय 6: लोकतांत्रिक व्यवस्था का संकट", slug: "the-crisis-of-democratic-order" },
        { name: "अध्याय 7: जन आंदोलनों का उदय", slug: "rise-of-popular-movements" },
        { name: "अध्याय 8: क्षेत्रीय आकांक्षाएँ", slug: "regional-aspirations" },
        { name: "अध्याय 9: भारतीय राजनीति: नए बदलाव", slug: "recent-developments-in-indian-politics" },
      ],
    },
    {
      name: "समकालीन विश्व राजनीति",
      lang: "hi",
      chapters: [
        { name: "अध्याय 1: शीतयुद्ध का दौर", slug: "the-cold-war-era" },
        { name: "अध्याय 2: दो ध्रुवीयता का अंत", slug: "the-end-of-bipolarity" },
        { name: "अध्याय 3: समकालीन विश्व में अमरीकी वर्चस्व", slug: "us-hegemony-in-world-politics" },
        { name: "अध्याय 4: सत्ता के वैकल्पिक केंद्र", slug: "alternative-centres-of-power" },
        { name: "अध्याय 5: समकालीन दक्षिण एशिया", slug: "contemporary-south-asia" },
        { name: "अध्याय 6: अंतर्राष्ट्रीय संगठन", slug: "international-organisations" },
        { name: "अध्याय 7: समकालीन विश्व में सुरक्षा", slug: "security-in-the-contemporary-world" },
        { name: "अध्याय 8: पर्यावरण और प्राकृतिक संसाधन", slug: "environment-and-natural-resources" },
        { name: "अध्याय 9: वैश्वीकरण", slug: "globalisation" },
      ],
    },
  ],
  papers: [
    { name: "Mid-Term Exam 2023", type: "Question Paper", icon: <FileText className="w-5 h-5 text-blue-500" /> },
    { name: "Annual Exam 2023", type: "Question Paper", icon: <FileText className="w-5 h-5 text-blue-500" /> },
    { name: "Unit Test 1 (Chapters 1-2)", type: "Test Paper", icon: <Edit className="w-5 h-5 text-green-500" /> },
    { name: "Half-Yearly Revision", type: "Practice Paper", icon: <BrainCircuit className="w-5 h-5 text-yellow-500" /> },
    { name: "Advanced Problems Set", type: "Extra Paper", icon: <BookOpen className="w-5 h-5 text-purple-500" /> },
  ],
};

export default function PoliticalScienceDetailsPage() {
  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <Card className="shadow-lg">
        <CardHeader className="bg-primary text-primary-foreground">
          <CardTitle className="text-2xl">Class 12 | Political Science</CardTitle>
          <CardDescription className="text-primary-foreground/80">Explore comprehensive resources for your Class 12 Political Science curriculum.</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-bold mb-4">Chapters & Topics</h2>
              <Accordion type="multiple" className="w-full space-y-4">
                {politicalScienceResources.books.map((book, bookIndex) => (
                  <AccordionItem value={`book-${bookIndex}`} key={bookIndex} className="border-none">
                    <Card className="shadow-sm hover:shadow-md transition-shadow">
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
                    </Card>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-4">Papers & Materials</h2>
              <div className="space-y-4">
                {politicalScienceResources.papers.map((paper, index) => (
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
