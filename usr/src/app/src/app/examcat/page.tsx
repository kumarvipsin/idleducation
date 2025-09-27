
import { getExamCategories } from "@/app/actions/data";
import type { TExamCategory } from "@/app/actions/types";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight, BookText, Atom, Sigma, Dna, Scale, TrendingUp, FlaskConical, HelpCircle } from "lucide-react";
import Link from "next/link";

const subjectIconMap: { [key: string]: React.ReactNode } = {
  maths: <Sigma className="w-8 h-8 text-green-600 dark:text-green-400" />,
  physics: <Atom className="w-8 h-8 text-sky-600 dark:text-sky-400" />,
  chemistry: <FlaskConical className="w-8 h-8 text-purple-600 dark:text-purple-400" />,
  biology: <Dna className="w-8 h-8 text-lime-600 dark:text-lime-400" />,
  'political-science': <Scale className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />,
  economics: <TrendingUp className="w-8 h-8 text-pink-600 dark:text-pink-400" />,
  default: <BookText className="w-8 h-8 text-gray-600 dark:text-gray-400" />,
};

const getIcon = (name: string) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('jee') || lowerName.includes('gate') || lowerName.includes('math')) return subjectIconMap.maths;
    if (lowerName.includes('neet')) return subjectIconMap.biology;
    if (lowerName.includes('cuet') || lowerName.includes('clat')) return subjectIconMap['political-science'];
    if (lowerName.includes('ssc') || lowerName.includes('police') || lowerName.includes('govt')) return subjectIconMap.default;
    return subjectIconMap.default;
}

export default async function ExamcatPage() {
  const categoriesResult = await getExamCategories();
  const competitiveExams = categoriesResult.success 
    ? (categoriesResult.data as TExamCategory[]).filter(c => c.group === 'competitive')
    : [];

  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <div className="mb-8 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">Competitive Exams</h1>
        <p className="text-muted-foreground">Explore our wide range of courses for various competitive exams.</p>
      </div>

      <main className="flex-1">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {competitiveExams.length > 0 ? (
            competitiveExams.map((exam, index) => (
              <Link href={exam.href} key={exam.id} className="block h-full group">
                <Card 
                  className="overflow-hidden h-full transition-all duration-300 bg-card p-0 flex flex-col shadow-lg hover:shadow-xl dark:bg-zinc-800/50 border-t-4 rounded-t-lg hover:-translate-y-2 border-primary"
                >
                    <CardContent className="p-6 flex flex-col flex-grow items-center text-center">
                        <div className="p-4 bg-background/60 rounded-full mb-4 transition-transform duration-300 group-hover:scale-110 shadow-inner">
                            {getIcon(exam.name)}
                        </div>
                        <h3 className="text-lg font-bold mb-2 text-foreground flex-grow">{exam.name}</h3>
                        <div className="mt-auto flex justify-center items-center font-semibold text-primary group-hover:underline underline-offset-4">
                            <span className="text-sm">View Details</span>
                            <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                        </div>
                    </CardContent>
                </Card>
              </Link>
            ))
          ) : (
             <div className="col-span-full text-center py-12">
                <Card className="p-8 inline-block">
                    <HelpCircle className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground font-semibold">No competitive exams found.</p>
                    <p className="text-sm text-muted-foreground">Please check back later or add categories in the admin panel.</p>
                </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
