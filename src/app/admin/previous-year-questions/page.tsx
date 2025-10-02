
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
import { PlusCircle, Edit, Trash2, FileText, MinusCircle, Upload, XCircle } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import Link from 'next/link';

const paperSchema = z.object({
  title: z.string().min(1, 'Paper title is required.'),
  pdf: z.any().optional(),
  pdfUrl: z.string().optional(),
});

const subjectSchema = z.object({ 
  name: z.string().min(1, 'Subject name is required.'),
  papers: z.array(paperSchema).min(1, 'At least one paper is required per subject.'),
});

const questionSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  exam: z.string().min(1, 'Exam/Class is required'),
  year: z.coerce.number().min(2000, 'Year must be 2000 or later'),
  subjects: z.array(subjectSchema).min(1, 'At least one subject is required.'),
});


type QuestionFormValues = z.infer<typeof questionSchema>;


const PaperField = ({ subjectIndex, paperIndex, control, removePaper }: { subjectIndex: number, paperIndex: number, control: any, removePaper: (index: number) => void }) => {
    return (
        <div className="space-y-2 p-2 border rounded-md relative ml-4">
            <div className="flex justify-between items-center">
                <Label className="font-medium text-sm">Paper {paperIndex + 1}</Label>
                <Button type="button" variant="ghost" size="icon" className="h-6 w-6" onClick={() => removePaper(paperIndex)}>
                    <XCircle className="h-4 w-4 text-muted-foreground" />
                </Button>
            </div>
            <FormField
                control={control}
                name={`subjects.${subjectIndex}.papers.${paperIndex}.title`}
                render={({ field }) => (
                <FormItem>
                    <FormControl>
                        <Input placeholder="Paper Title (e.g., Paper 1, Set A)" {...field} />
                    </FormControl>
                </FormItem>
                )}
            />
            <Controller
                control={control}
                name={`subjects.${subjectIndex}.papers.${paperIndex}.pdf`}
                render={({ field: { onChange, ...rest } }) => (
                    <FormItem>
                        <FormControl>
                            <Input type="file" accept=".pdf" onChange={(e) => onChange(e.target.files?.[0])} {...rest} />
                        </FormControl>
                    </FormItem>
                )}
            />
             <FormField
                control={control}
                name={`subjects.${subjectIndex}.papers.${paperIndex}.pdfUrl`}
                render={({ field }) => ( <input type="hidden" {...field} /> )}
            />
        </div>
    );
};

const SubjectField = ({ subjectIndex, control, removeSubject }: { subjectIndex: number, control: any, removeSubject: (index: number) => void }) => {
    const { fields: paperFields, append: appendPaper, remove: removePaper } = useFieldArray({
        control,
        name: `subjects.${subjectIndex}.papers`
    });

    return (
        <div className="space-y-3 p-3 border rounded-lg bg-muted/50">
            <div className="flex justify-between items-center">
                <FormField
                    control={control}
                    name={`subjects.${subjectIndex}.name`}
                    render={({ field }) => (
                    <FormItem className="flex-1">
                        <FormControl>
                            <Input placeholder="Subject Name" {...field} />
                        </FormControl>
                    </FormItem>
                    )}
                />
                <Button type="button" variant="ghost" size="icon" onClick={() => removeSubject(subjectIndex)}>
                    <MinusCircle className="h-4 w-4 text-destructive" />
                </Button>
            </div>
            <div className="space-y-2">
                {paperFields.map((paper, paperIndex) => (
                    <PaperField key={paper.id} subjectIndex={subjectIndex} paperIndex={paperIndex} control={control} removePaper={removePaper} />
                ))}
            </div>
             <div className="flex justify-end">
                <Button type="button" variant="outline" size="sm" onClick={() => appendPaper({ title: '', pdf: null, pdfUrl: '' })}>
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add Paper
                </Button>
            </div>
        </div>
    );
};


const QuestionForm = ({
  question,
  onSuccess,
}: {
  question?: TPreviousYearQuestion | null;
  onSuccess: () => void;
}) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<QuestionFormValues>({
    resolver: zodResolver(questionSchema),
    defaultValues: {
      title: question?.title || '',
      exam: question?.exam || '',
      year: question?.year || new Date().getFullYear(),
      subjects: question?.subjects.map(s => ({
        ...s,
        papers: s.papers?.map(p => ({...p, pdf: undefined})) || []
      })) || [{ name: "", papers: [{ title: "", pdf: null, pdfUrl: '' }] }],
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

    data.subjects.forEach((subject, subjectIndex) => {
      formData.append(`subjects[${subjectIndex}][name]`, subject.name);
      subject.papers.forEach((paper, paperIndex) => {
        formData.append(`subjects[${subjectIndex}][papers][${paperIndex}][title]`, paper.title);
        if (paper.pdf) {
          formData.append(`subjects[${subjectIndex}][papers][${paperIndex}][pdf]`, paper.pdf);
        }
        if (paper.pdfUrl) {
            formData.append(`subjects[${subjectIndex}][papers][${paperIndex}][pdfUrl]`, paper.pdfUrl);
        }
      });
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
             <FormField control={form.control} name="title" render={({ field }) => (
                <FormItem><Label>Title</Label><FormControl><Input {...field} /></FormControl></FormItem>
            )} />
            <FormField control={form.control} name="exam" render={({ field }) => (
                <FormItem><Label>Exam/Class</Label><FormControl><Input {...field} /></FormControl></FormItem>
            )} />
            <FormField control={form.control} name="year" render={({ field }) => (
                <FormItem><Label>Year</Label><FormControl><Input type="number" {...field} /></FormControl></FormItem>
            )} />

            <div className="space-y-4 pt-4 border-t">
                <Label className="font-semibold">Subjects & Papers</Label>
                {fields.map((field, index) => (
                    <SubjectField key={field.id} subjectIndex={index} control={form.control} removeSubject={remove} />
                ))}
                <div className="flex justify-end mt-2">
                    <Button type="button" variant="outline" onClick={() => append({ name: "", papers: [{ title: "", pdf: null, pdfUrl: '' }] })}>
                        <PlusCircle className="h-4 w-4 mr-2" /> Add Subject
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
                    <TableHead>Year</TableHead>
                    <TableHead>Subjects & Papers</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    renderSkeleton()
                  ) : questions.length > 0 ? (
                    questions.map((question, qIndex) => (
                      <TableRow key={question.id}>
                        <TableCell className="font-medium">{question.title}</TableCell>
                        <TableCell>{question.exam}</TableCell>
                        <TableCell>{question.year}</TableCell>
                        <TableCell>
                           <ul className="space-y-2">
                            {Array.isArray(question.subjects) && question.subjects.map((s, sIndex) => (
                              <li key={`${qIndex}-${sIndex}`}>
                                <span className="font-semibold">{s.name}</span>
                                {Array.isArray(s.papers) && s.papers.length > 0 &&
                                  <ul className="list-disc pl-5 text-sm text-muted-foreground">
                                    {s.papers.map((p, pIndex) => <li key={`${qIndex}-${sIndex}-${pIndex}`}>{p.title}</li>)}
                                  </ul>
                                }
                              </li>
                            ))}
                          </ul>
                        </TableCell>
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
