
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { BookOpen } from "lucide-react";
import { getNcertSolutions } from "@/app/actions";
import { NcertChapterList } from "@/components/ncert-chapter-list";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";

async function NcertSolutionsContent() {
  const result = await getNcertSolutions('class-10', 'maths');

  if (!result.success || !result.data) {
    return <p>Could not load resources. Please try again later.</p>;
  }

  const class10MathsResources = result.data;
  
  return <NcertChapterList resources={class10MathsResources} />;
}


export default function Class10MathsPage() {
  return (
    <Card className="shadow-lg overflow-hidden border-t-8 border-green-700">
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-4">
        <div className="flex items-center gap-4">
          <div className="bg-white/20 p-3 rounded-full">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold">Class 10 | Maths | CBSE</CardTitle>
          </div>
        </div>
      </div>
      <CardContent className="p-4 md:p-6">
        <Suspense fallback={<Skeleton className="h-96 w-full" />}>
            <NcertSolutionsContent />
        </Suspense>
      </CardContent>
    </Card>
  );
}
