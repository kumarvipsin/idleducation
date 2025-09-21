
'use client';
import { useEffect, useState } from 'react';
import { getImportantQuestions } from '@/app/actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

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
        <CardHeader className="flex flex-row items-center justify-between">
            <div>
                <CardTitle>Manage Important Questions</CardTitle>
                <CardDescription>
                    View and manage the seeded important questions data for all classes.
                </CardDescription>
            </div>
            <Dialog>
                <DialogTrigger asChild>
                    <Button size="sm"><PlusCircle className="mr-2 h-4 w-4"/> Add Class</Button>
                </DialogTrigger>
                <DialogContent>
                    {/* Add Class Form Here */}
                </DialogContent>
            </Dialog>
        </CardHeader>
      </Card>
      {loading ? renderSkeleton() : (
        <Accordion type="multiple" className="w-full space-y-4">
          {questions.sort((a, b) => a.id.localeCompare(b.id, undefined, { numeric: true })).map((classDoc) => (
            <AccordionItem value={classDoc.id} key={classDoc.id}>
              <Card>
                <AccordionTrigger className="text-xl font-bold text-primary hover:no-underline p-4 flex-1">
                  <div className="flex items-center justify-between w-full">
                      <span className="capitalize">{classDoc.id.replace('-', ' ')}</span>
                      <div className="flex items-center gap-2 mr-2">
                          <Button variant="ghost" size="icon" className="h-8 w-8"><Edit className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
                      </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <CardContent>
                    <Accordion type="multiple" className="w-full space-y-2">
                       {Object.entries(classDoc.data).map(([key, value]) => {
                        if (key === 'id') return null;
                         return (
                            <AccordionItem value={`${classDoc.id}-${key}`} key={key}>
                                <AccordionTrigger className="font-semibold capitalize text-base hover:no-underline p-2 bg-muted/50 rounded-md flex-1">
                                    <div className="flex items-center justify-between w-full">
                                        <span>{key}</span>
                                        <div className="flex items-center gap-2 mr-2">
                                            <Button variant="ghost" size="icon" className="h-7 w-7"><Edit className="h-4 w-4" /></Button>
                                            <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
                                        </div>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="p-2">
                                     {(value as Subject).books.map((book, bookIndex) => (
                                        <div key={bookIndex} className="mb-2 p-2 border rounded-md">
                                            <div className="flex justify-between items-center">
                                                <p className="font-semibold text-sm italic p-2">{book.name} ({book.lang})</p>
                                                <div className="flex items-center gap-1">
                                                    <Button variant="ghost" size="icon" className="h-7 w-7"><Edit className="h-4 w-4" /></Button>
                                                    <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
                                                </div>
                                            </div>
                                            <ul className="list-disc pl-8 text-sm text-muted-foreground mt-2">
                                                {book.chapters.map((chapter, chapterIndex) => (
                                                     <li key={chapterIndex} className="flex justify-between items-center hover:bg-muted/50 rounded-md p-1">
                                                        <span>{chapter.name}</span>
                                                         <div className="flex items-center gap-1">
                                                            <Button variant="ghost" size="icon" className="h-6 w-6"><Edit className="h-3 w-3" /></Button>
                                                            <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive hover:text-destructive"><Trash2 className="h-3 w-3" /></Button>
                                                        </div>
                                                    </li>
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
