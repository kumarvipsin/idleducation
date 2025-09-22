
'use client';

import { useEffect, useState } from 'react';
import { getTopperTestimonials, addTopperTestimonial, editTopperTestimonial, deleteTopperTestimonial } from '@/app/actions';
import type { TTopperTestimonial } from '@/app/actions/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, Edit, Trash2, Youtube } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

const TopperTestimonialForm = ({
  testimonial,
  onSuccess,
}: {
  testimonial?: TTopperTestimonial | null;
  onSuccess: () => void;
}) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const data = {
        studentName: formData.get('studentName') as string,
        studentClass: formData.get('studentClass') as string,
        studentPlace: formData.get('studentPlace') as string,
        videoId: formData.get('videoId') as string,
    };

    const result = testimonial
      ? await editTopperTestimonial(testimonial.id, data)
      : await addTopperTestimonial(data);

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
          <Label htmlFor="studentName" className="text-right">Student Name</Label>
          <Input id="studentName" name="studentName" defaultValue={testimonial?.studentName} className="col-span-3" />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="studentClass" className="text-right">Class/Course</Label>
          <Input id="studentClass" name="studentClass" defaultValue={testimonial?.studentClass} className="col-span-3" />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="studentPlace" className="text-right">Place</Label>
          <Input id="studentPlace" name="studentPlace" defaultValue={testimonial?.studentPlace} className="col-span-3" />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="videoId" className="text-right">YouTube Video ID</Label>
          <Input id="videoId" name="videoId" defaultValue={testimonial?.videoId} className="col-span-3" placeholder="e.g., _t-tMW2-m5c" />
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

export default function AdminTopperTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<TTopperTestimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<TTopperTestimonial | null>(null);
  const [deletingTestimonial, setDeletingTestimonial] = useState<TTopperTestimonial | null>(null);
  const { toast } = useToast();

  const fetchTestimonials = async () => {
    setLoading(true);
    const result = await getTopperTestimonials();
    if (result.success && result.data) {
      setTestimonials(result.data as TTopperTestimonial[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleSuccess = () => {
    setIsDialogOpen(false);
    setEditingTestimonial(null);
    fetchTestimonials();
  };

  const handleDelete = async () => {
    if (!deletingTestimonial) return;
    const result = await deleteTopperTestimonial(deletingTestimonial.id);
    if (result.success) {
      toast({ title: "Success", description: result.message });
      fetchTestimonials();
    } else {
      toast({ variant: "destructive", title: "Error", description: result.message });
    }
    setDeletingTestimonial(null);
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
       <AlertDialog open={!!deletingTestimonial} onOpenChange={(isOpen) => !isOpen && setDeletingTestimonial(null)}>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Manage Topper Testimonials</CardTitle>
              <CardDescription>Add, edit, or delete topper video testimonials.</CardDescription>
            </div>
            <DialogTrigger asChild>
              <Button onClick={() => setEditingTestimonial(null)}>
                <PlusCircle className="mr-2 h-4 w-4" /> Add Topper Testimonial
              </Button>
            </DialogTrigger>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[calc(100vh-250px)]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student Name</TableHead>
                    <TableHead>Class/Course</TableHead>
                    <TableHead>Place</TableHead>
                    <TableHead>Video</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    [...Array(5)].map((_, i) => (
                      <TableRow key={i}>
                        <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                        <TableCell><Skeleton className="h-8 w-20" /></TableCell>
                        <TableCell className="text-right"><Skeleton className="h-8 w-20" /></TableCell>
                      </TableRow>
                    ))
                  ) : (
                    testimonials.map((testimonial) => (
                      <TableRow key={testimonial.id}>
                        <TableCell>{testimonial.studentName}</TableCell>
                        <TableCell>{testimonial.studentClass}</TableCell>
                        <TableCell>{testimonial.studentPlace}</TableCell>
                        <TableCell>
                           <a href={`https://www.youtube.com/watch?v=${testimonial.videoId}`} target="_blank" rel="noopener noreferrer">
                                <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600"><Youtube className="mr-2"/>View</Button>
                           </a>
                        </TableCell>
                        <TableCell className="text-right space-x-2">
                           <Button variant="outline" size="icon" onClick={() => { setEditingTestimonial(testimonial); setIsDialogOpen(true); }}>
                             <Edit className="h-4 w-4" />
                           </Button>
                           <AlertDialogTrigger asChild>
                                <Button variant="destructive" size="icon" onClick={() => setDeletingTestimonial(testimonial)}>
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
         <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingTestimonial ? 'Edit' : 'Add'} Topper Testimonial</DialogTitle>
            <DialogDescription>
              {editingTestimonial ? 'Update the details for this video testimonial.' : 'Create a new topper testimonial to display on the homepage.'}
            </DialogDescription>
          </DialogHeader>
          <TopperTestimonialForm testimonial={editingTestimonial} onSuccess={handleSuccess} />
        </DialogContent>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the testimonial from <span className="font-semibold">{deletingTestimonial?.studentName}</span>. This action cannot be undone.
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
