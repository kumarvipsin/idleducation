
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
import { PlusCircle, Edit, Trash2, Upload, FileText } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

const QuestionForm = ({
  question,
  onSuccess,
}: {
  question?: TPreviousYearQuestion | null;
  onSuccess: () => void;
}) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
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
    <form onSubmit={handleSubmit}>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="title" className="text-right">Title</Label>
          <Input id="title" name="title" defaultValue={question?.title} className="col-span-3" required />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="exam" className="text-right">Exam/Class</Label>
          <Input id="exam" name="exam" defaultValue={question?.exam} className="col-span-3" required />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="subject" className="text-right">Subject</Label>
          <Input id="subject" name="subject" defaultValue={question?.subject} className="col-span-3" required />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="year" className="text-right">Year</Label>
          <Input id="year" name="year" type="number" defaultValue={question?.year} className="col-span-3" required />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="pdf" className="text-right">PDF File</Label>
          <Input id="pdf" name="pdf" type="file" accept=".pdf" className="col-span-3" />
        </div>
      </div>
      <DialogFooter>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save changes'}
        </Button>
      </DialogFooter>
    </form>
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
        <TableCell><Skeleton className="h-4 w-20" /></TableCell>
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
                    <TableHead>Subject</TableHead>
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
                        <TableCell>{question.subject}</TableCell>
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
