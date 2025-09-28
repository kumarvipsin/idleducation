
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen } from "lucide-react";
import { getCollection } from "@/app/actions/data";
import { Suspense, useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { NotesChapterList } from "@/components/notes-chapter-list";
import type { TSubject } from "@/app/actions/types";

function NcertSolutionsContent() {
  const [solutionsData, setSolutionsData] = useState<TSubject | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      const classId = 'class-5';
      const subjectKey = 'maths';
      
      const solutionsResult = await getCollection('ncertSolutions');

      if (solutionsResult.success && solutionsResult.data) {
          const classDoc = (solutionsResult.data as any[]).find(doc => doc.id === classId);
          if (classDoc && classDoc.subjects[subjectKey]) {
              setSolutionsData(classDoc.subjects[subjectKey]);
          } else {
               setError("NCERT Solutions content not found for this subject.");
          }
      } else {
          setError(solutionsResult.message || "Failed to fetch NCERT Solutions.");
      }
      
      setLoading(false);
    }
    fetchData();
  }, []);

  if (loading) {
    return (
        <Card>
            <CardContent className="p-6">
                <Skeleton className="h-96 w-full" />
            </CardContent>
        </Card>
    );
  }

  if (error || !solutionsData) {
    return (
        <Card>
            <CardContent className="p-6 text-center text-destructive">
                {error || "Could not load resources. Please try again later."}
            </CardContent>
        </Card>
    );
  }

  return <NotesChapterList notes={solutionsData} importantQuestions={null} classId="class-5" subjectKey="maths" />;
}


export default function Class5MathsPage() {
  return (
    <Card className="shadow-lg overflow-hidden border-t-8 border-green-700">
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-4">
        <div className="flex items-center gap-4">
          <div className="bg-white/20 p-3 rounded-full">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold">Class 5 | Maths | CBSE</CardTitle>
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
