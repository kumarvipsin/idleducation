
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, BookOpen, ChevronRight, Eye, Download, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionTrigger, AccordionContent, AccordionItem } from "@/components/ui/accordion";
import { NotesChapterList } from "@/components/notes-chapter-list";
import { Suspense, useEffect } from "react";
import { getImportantQuestionsForSubject, getCollection } from "@/app/actions";
import { Skeleton } from "@/components/ui/skeleton";
import type { TSubject } from "@/app/actions/types";

function NcertSolutionsContent() {
  const [notesData, setNotesData] = useState<TSubject | null>(null);
  const [impQuestionsData, setImpQuestionsData] = useState<TSubject | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      const classId = 'class-6';
      const subjectKey = 'english';
      
      const [notesResult, impQuestionsResult] = await Promise.all([
          getCollection('ncertSolutions'),
          getImportantQuestionsForSubject(classId, subjectKey)
      ]);

      if (notesResult.success && notesResult.data) {
          const classDoc = (notesResult.data as any[]).find(doc => doc.id === classId);
          if (classDoc && classDoc.subjects[subjectKey]) {
              setNotesData(classDoc.subjects[subjectKey]);
          } else {
               setError("NCERT Solutions content not found for this subject.");
          }
      } else {
          setError(notesResult.message || "Failed to fetch NCERT Solutions.");
      }

      if (impQuestionsResult.success && impQuestionsResult.data) {
          setImpQuestionsData(impQuestionsResult.data as TSubject);
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

  if (error) {
    return (
        <Card>
            <CardContent className="p-6 text-center text-destructive">
                {error}
            </CardContent>
        </Card>
    );
  }

  return <NotesChapterList notes={notesData} importantQuestions={impQuestionsData} contentType="notes" language="en" classId="class-6" subjectKey="english" />;
}

export default function Class6EnglishPage() {

  return (
    <Card className="shadow-lg overflow-hidden border-t-8 border-purple-700">
        <div className="bg-gradient-to-r from-purple-500 to-violet-600 text-white p-4">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-3 rounded-full">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold">CBSE | Class 6 | English</CardTitle>
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

