
'use client';

import { useEffect, useState } from 'react';
import { addPreviousYearQuestion, editPreviousYearQuestion, deletePreviousYearQuestion, getPreviousYearQuestions } from '@/app/actions';
import type { TPreviousYearQuestion } from '@/app/actions/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, Edit, Trash2, FileText, MinusCircle, Upload } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import Link from 'next/link';

const questionSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  exam: z.string().min(1, 'Exam/Class is required'),
  subjects: z.array(z.object({ 
    name: z.string().min(1, 'Subject cannot be empty.'),
    pdf: z.any().optional(),
  })).min(1, 'At least one subject is required.'),
  year: z.coerce.number().min(2000, 'Year must be 2000 or later'),
});

type QuestionFormValues = z.infer<typeof questionSchema>;

const QuestionForm = ({
  question,
  onSuccess,
}: {
  question?: TPreviousYearQuestion | null;
  onSuccess: () => void;
}) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const defaultSubjects = question?.subjects
    ? question.subjects.map(s => ({ name: s.name, pdf: null, existingPdfUrl: s.pdfUrl }))
    : [{ name: "", pdf: null }];

  const form = useForm<QuestionFormValues>({
    resolver: zodResolver(questionSchema),
    defaultValues: {
      title: question?.title || '',
      exam: question?.exam || '',
      subjects: defaultSubjects.map(s => ({name: s.name, pdf: s.pdf})),
      year: question?.year || new Date().getFullYear(),
    },
  });
  
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "subjects"
  });


  const handleSubmit = async (data: QuestionFormValues) => {
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('exam', data.exam);
    formData.append('year', String(data.year));
    
    data.subjects.forEach((subject, index) => {
        formData.append(`subjects[${index}][name]`, subject.name);
        if (subject.pdf && subject.pdf[0]) {
            formData.append(`subjects[${index}][pdf]`, subject.pdf[0]);
        }
        // For edits, include existing URL if no new file is uploaded
        if (question?.subjects[index]?.pdfUrl && !subject.pdf?.[0]) {
           formData.append(`subjects[${index}][pdfUrl]`, question.subjects[index].pdfUrl!);
        }
    });
    
    const apiCall = question
      ? editPreviousYearQuestion(question.id, formData)
      : addPreviousYearQuestion(formData);

    const result = await apiCall;

    if (result.success) {
      toast({ title: 'Success', description: result.message });
      onSuccess();
    } else {
      toast({ variant: 'destructive', title: 'Error', description: result.message });
    }
    setIsSubmitting(false);
  };

  return (
    <Form {...form}>
    <form onSubmit={form.handleSubmit(handleSubmit)}>
      <ScrollArea className="h-96 pr-2">
        <div className="grid gap-4 py-4 pr-2">
            <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">Title</Label>
                <FormControl>
                    <Input id="title" {...field} className="col-span-3" />
                </FormControl>
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="exam"
            render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="exam" className="text-right">Exam/Class</Label>
                <FormControl>
                    <Input id="exam" {...field} className="col-span-3" />
                </FormControl>
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="year"
            render={({ field }) => (
                <FormItem className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="year" className="text-right">Year</Label>
                <FormControl>
                    <Input id="year" type="number" {...field} className="col-span-3" />
                </FormControl>
                </FormItem>
            )}
            />

            <div className="space-y-4 pt-4 border-t">
                {fields.map((field, index) => (
                <div key={field.id} className="grid grid-cols-4 items-start gap-4 p-2 border rounded-md">
                    <div className="col-span-4 flex justify-between items-center">
                        <Label htmlFor={`subject-${index}`} className="font-semibold">Subject {index + 1}</Label>
                        {fields.length > 1 && (
                            <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}>
                                <MinusCircle className="h-4 w-4 text-destructive" />
                            </Button>
                        )}
                    </div>
                     <FormField
                        control={form.control}
                        name={`subjects.${index}.name`}
                        render={({ field }) => (
                        <FormItem className="col-span-4">
                            <FormControl>
                                <Input placeholder="Subject Name" {...field} />
                            </FormControl>
                        </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name={`subjects.${index}.pdf`}
                        render={({ field: { onChange, value, ...rest} }) => (
                           <FormItem className="col-span-4">
                            <FormControl>
                                 <Input type="file" accept=".pdf" onChange={(e) => onChange(e.target.files)} {...rest} />
                            </FormControl>
                            {(defaultSubjects[index]?.existingPdfUrl) && <p className="text-xs text-muted-foreground mt-1">Current file: <Link href={defaultSubjects[index].existingPdfUrl!} target="_blank" className="underline">View</Link></p>}
                           </FormItem>
                        )}
                    />
                </div>
                ))}
                <div className="flex justify-end mt-2">
                    <Button type="button" variant="outline" size="sm" onClick={() => append({ name: "", pdf: null })}>
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Add Subject
                    </Button>
                </div>
            </div>
        </div>
      </ScrollArea>
      <DialogFooter>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save changes'}
        </Button>
      </DialogFooter>
    </form>
    </Form>
  );
};

export default function AdminPreviousYearQuestionsPage() {
  const [questions, setQuestions] = useState<TPreviousYearQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<TPreviousYearQuestion | null>(null);
  const [deletingQuestion, setDeletingQuestion] = useState<TPreviousYearQuestion | null>(null);
  const { toast } = useToast();

  const fetchQuestions = async () => {
    setLoading(true);
    const result = await getPreviousYearQuestions();
    if (result.success && result.data) {
      setQuestions(result.data as TPreviousYearQuestion[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const handleSuccess = () => {
    setIsDialogOpen(false);
    setEditingQuestion(null);
    fetchQuestions();
  };

  const handleDelete = async () => {
    if (!deletingQuestion) return;
    const result = await deletePreviousYearQuestion(deletingQuestion.id);
    if (result.success) {
      toast({ title: "Success", description: result.message });
      fetchQuestions();
    } else {
      toast({ variant: "destructive", title: "Error", description: result.message });
    }
    setDeletingQuestion(null);
  };

  const renderSkeleton = () => (
    [...Array(5)].map((_, i) => (
      <TableRow key={i}>
        <TableCell><Skeleton className="h-4 w-48" /></TableCell>
        <TableCell><Skeleton className="h-4 w-20" /></TableCell>
        <TableCell><Skeleton className="h-4 w-32" /></TableCell>
        <TableCell><Skeleton className="h-4 w-16" /></TableCell>
        <TableCell className="text-right"><Skeleton className="h-8 w-20 ml-auto" /></TableCell>
      </TableRow>
    ))
  );

  return (
    <Dialog open={isDialogOpen} onOpenChange={(isOpen) => {
        if (!isOpen) setEditingQuestion(null);
        setIsDialogOpen(isOpen);
    }}>
      <AlertDialog open={!!deletingQuestion} onOpenChange={(isOpen) => !isOpen && setDeletingQuestion(null)}>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Manage Previous Year Questions</CardTitle>
              <CardDescription>Add, edit, or delete question papers.</CardDescription>
            </div>
            <DialogTrigger asChild>
              <Button onClick={() => setEditingQuestion(null)}>
                <PlusCircle className="mr-2 h-4 w-4" /> Add Paper
              </Button>
            </DialogTrigger>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[calc(100vh-250px)]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Exam/Class</TableHead>
                    <TableHead>Subjects</TableHead>
                    <TableHead>Year</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    renderSkeleton()
                  ) : questions.length > 0 ? (
                    questions.map((question) => (
                      <TableRow key={question.id}>
                        <TableCell className="font-medium">{question.title}</TableCell>
                        <TableCell>{question.exam}</TableCell>
                        <TableCell>
                           <ul className="list-disc pl-5">
                            {Array.isArray(question.subjects) ? question.subjects.map((s, idx) => <li key={`${s.name}-${idx}`}>{s.name}</li>) : <li>{question.subjects}</li>}
                          </ul>
                        </TableCell>
                        <TableCell>{question.year}</TableCell>
                        <TableCell className="text-right space-x-2">
                           <Button variant="outline" size="icon" onClick={() => { setEditingQuestion(question); setIsDialogOpen(true); }}>
                             <Edit className="h-4 w-4" />
                           </Button>
                           <AlertDialogTrigger asChild>
                                <Button variant="destructive" size="icon" onClick={() => setDeletingQuestion(question)}>
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                           </AlertDialogTrigger>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center h-24">No question papers found.</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </ScrollArea>
          </CardContent>
        </Card>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingQuestion ? 'Edit' : 'Add'} Question Paper</DialogTitle>
            <DialogDescription>
              {editingQuestion ? 'Update the details for this question paper.' : 'Upload a new question paper.'}
            </DialogDescription>
          </DialogHeader>
          <QuestionForm question={editingQuestion} onSuccess={handleSuccess} />
        </DialogContent>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the question paper: <span className="font-semibold">{deletingQuestion?.title}</span>. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Dialog>
  );
}
