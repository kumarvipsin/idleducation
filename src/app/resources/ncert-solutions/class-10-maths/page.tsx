
'use client';

import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { BookOpen } from "lucide-react";
import { getImportantQuestionsForSubject } from "@/app/actions";
import { Suspense, useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { NotesChapterList } from "@/components/notes-chapter-list";
import { TSubject } from "@/app/actions/types";

function NcertSolutionsContent() {
  const [resources, setResources] = useState<TSubject | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const result = await getImportantQuestionsForSubject('class-10', 'maths');
      if (result.success && result.data) {
        setResources(result.data);
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  if (loading) {
    return <Skeleton className="h-96 w-full" />;
  }

  if (!resources) {
    return <p>Could not load resources. Please try again later.</p>;
  }

  return <NotesChapterList notes={resources} importantQuestions={null} classId="class-10" subjectKey="maths" />;
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
