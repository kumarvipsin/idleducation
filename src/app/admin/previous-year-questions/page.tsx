
'use client';

import * as React from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { getPreviousYearQuestions, addPreviousYearQuestion, editPreviousYearQuestion, deletePreviousYearQuestion } from '@/app/actions';
import type { TPreviousYearQuestion } from '@/app/actions/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';

const examCategories = [
  'CBSE Class 10', 'CBSE Class 12', 'NIOS Class 10', 'NIOS Class 12',
  'JEE', 'NEET', 'CUET', 'CLAT', 'GATE', 'SSC', 'DELHI POLICE'
];

const questionSchema = z.object({
  exam: z.string().min(1, "Exam category is required."),
  subject: z.string().min(1, "Subject is required."),
  year: z.coerce.number().min(2000, "Year must be 2000 or later."),
  title: z.string().min(1, "Title is required."),
  pdf: z.instanceof(File).optional(),
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
  const form = useForm<QuestionFormValues>({
    resolver: zodResolver(questionSchema),
    defaultValues: {
      exam: question?.exam || '',
      subject: question?.subject || '',
      year: question?.year || new Date().getFullYear(),
      title: question?.title || '',
    },
  });

  const onSubmit: SubmitHandler<QuestionFormValues> = async (data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value) {
        formData.append(key, value as any);
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
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField control={form.control} name="exam" render={({ field }) => (
          <FormItem><FormLabel>Exam</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select an exam category" /></SelectTrigger></FormControl><SelectContent><ScrollArea className="h-48">{examCategories.map(exam => <SelectItem key={exam} value={exam}>{exam}</SelectItem>)}</ScrollArea></SelectContent></Select><FormMessage /></FormItem>
        )} />
        <FormField control={form.control} name="subject" render={({ field }) => (
          <FormItem><FormLabel>Subject</FormLabel><FormControl><Input placeholder="e.g., Maths (Standard)" {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField control={form.control} name="year" render={({ field }) => (
          <FormItem><FormLabel>Year</FormLabel><FormControl><Input type="number" placeholder="e.g., 2024" {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField control={form.control} name="title" render={({ field }) => (
          <FormItem><FormLabel>Title</FormLabel><FormControl><Input placeholder="e.g., Set 1" {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField control={form.control} name="pdf" render={({ field: { onChange, value, ...rest } }) => (
          <FormItem>
            <FormLabel>PDF File</FormLabel>
            <FormControl>
              <Input
                type="file"
                accept=".pdf"
                onChange={(e) => onChange(e.target.files?.[0])}
                {...rest}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <DialogFooter>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? 'Saving...' : 'Save changes'}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default function AdminPreviousYearQuestionsPage() {
  const [questions, setQuestions] = React.useState<TPreviousYearQuestion[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [editingQuestion, setEditingQuestion] = React.useState<TPreviousYearQuestion | null>(null);
  const [deletingQuestion, setDeletingQuestion] = React.useState<TPreviousYearQuestion | null>(null);
  const { toast } = useToast();

  const fetchQuestions = React.useCallback(async () => {
    setLoading(true);
    const result = await getPreviousYearQuestions();
    if (result.success && result.data) {
      setQuestions(result.data as TPreviousYearQuestion[]);
    }
    setLoading(false);
  }, []);

  React.useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

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

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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
                    <TableHead>Exam</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Year</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    [...Array(5)].map((_, i) => (
                      <TableRow key={i}>
                        <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                        <TableCell className="text-right"><Skeleton className="h-8 w-20" /></TableCell>
                      </TableRow>
                    ))
                  ) : (
                    questions.map((q) => (
                      <TableRow key={q.id}>
                        <TableCell>{q.exam}</TableCell>
                        <TableCell>{q.subject}</TableCell>
                        <TableCell>{q.year}</TableCell>
                        <TableCell>{q.title}</TableCell>
                        <TableCell className="text-right space-x-2">
                           <Button variant="outline" size="icon" onClick={() => { setEditingQuestion(q); setIsDialogOpen(true); }}>
                             <Edit className="h-4 w-4" />
                           </Button>
                           <AlertDialogTrigger asChild>
                                <Button variant="destructive" size="icon" onClick={() => setDeletingQuestion(q)}>
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                           </AlertDialogTrigger>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </ScrollArea>
          </CardContent>
        </Card>
         <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingQuestion ? 'Edit' : 'Add'} Question Paper</DialogTitle>
            <DialogDescription>
              {editingQuestion ? 'Update the details for this paper.' : 'Add a new paper.'}
            </DialogDescription>
          </DialogHeader>
          <QuestionForm question={editingQuestion} onSuccess={handleSuccess} />
        </DialogContent>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the question paper: <span className="font-semibold">{deletingQuestion?.title} ({deletingQuestion?.subject} {deletingQuestion?.year})</span>. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Dialog>
  );
}
