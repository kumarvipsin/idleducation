
'use client';
import { useEffect, useState } from 'react';
import { getImportantQuestions } from '@/app/actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Skeleton } from '@/components/ui/skeleton';

interface Chapter {
  name: string;
}
interface Book {
  name: string;
  lang: string;
  chapters: Chapter[];
}
interface Subject {
  books: Book[];
}
interface ClassData {
  [subject: string]: Subject;
}
interface QuestionDoc {
  id: string; // This will be 'class-5', 'class-6', etc.
  data: ClassData;
}

export default function AdminImportantQuestionsPage() {
  const [questions, setQuestions] = useState<QuestionDoc[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
      const result = await getImportantQuestions();
      if (result.success && result.data) {
        const formattedData = (result.data as any[]).map(doc => ({
          id: doc.id,
          data: doc,
        }));
        setQuestions(formattedData);
      }
      setLoading(false);
    };
    fetchQuestions();
  }, []);

  const renderSkeleton = () => (
    [...Array(3)].map((_, i) => (
      <Card key={i} className="mb-4">
        <CardHeader><Skeleton className="h-6 w-1/3" /></CardHeader>
        <CardContent className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </CardContent>
      </Card>
    ))
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Manage Important Questions</CardTitle>
          <CardDescription>
            View and manage the seeded important questions data for all classes.
          </CardDescription>
        </CardHeader>
      </Card>
      {loading ? renderSkeleton() : (
        <Accordion type="multiple" className="w-full space-y-4">
          {questions.sort((a, b) => a.id.localeCompare(b.id, undefined, { numeric: true })).map((classDoc) => (
            <AccordionItem value={classDoc.id} key={classDoc.id}>
              <Card>
                <CardHeader>
                  <AccordionTrigger className="text-xl font-bold text-primary">
                    {classDoc.id.replace('-', ' ')}
                  </AccordionTrigger>
                </CardHeader>
                <AccordionContent>
                  <CardContent>
                    <Accordion type="multiple" className="w-full space-y-2">
                       {Object.entries(classDoc.data).map(([key, value]) => {
                        if (key === 'id') return null;
                         return (
                            <AccordionItem value={`${classDoc.id}-${key}`} key={key}>
                                <AccordionTrigger className="font-semibold capitalize text-base p-2 bg-muted/50 rounded-md">
                                    {key}
                                </AccordionTrigger>
                                <AccordionContent className="p-2">
                                     {(value as Subject).books.map((book, bookIndex) => (
                                        <div key={bookIndex} className="mb-2">
                                            <p className="font-semibold text-sm italic p-2">{book.name} ({book.lang})</p>
                                            <ul className="list-disc pl-8 text-sm text-muted-foreground">
                                                {book.chapters.map((chapter, chapterIndex) => (
                                                    <li key={chapterIndex}>{chapter.name}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                </AccordionContent>
                            </AccordionItem>
                         )
                       })}
                    </Accordion>
                  </CardContent>
                </AccordionContent>
              </Card>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </div>
  );
}
