'use client';

import { useEffect, useState } from 'react';
import { getTestimonials, addTestimonial, editTestimonial, deleteTestimonial, getSignedUrlForPdf } from '@/app/actions';
import type { TTestimonial } from '@/app/actions/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const TestimonialForm = ({
  testimonial,
  onSuccess,
}: {
  testimonial?: TTestimonial | null;
  onSuccess: () => void;
}) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [preview, setPreview] = useState<string | null>(testimonial?.avatarUrl || null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const result = testimonial
      ? await editTestimonial(testimonial.id, formData)
      : await addTestimonial(formData);

    if (result.success) {
      toast({ title: 'Success', description: result.message });
      onSuccess();
    } else {
      toast({ variant: 'destructive', title: 'Error', description: result.message });
    }
    setIsSubmitting(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="name" className="text-right">Name</Label>
          <Input id="name" name="name" defaultValue={testimonial?.name} className="col-span-3" />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="achievement" className="text-right">Achievement</Label>
          <Input id="achievement" name="achievement" defaultValue={testimonial?.achievement} className="col-span-3" />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="testimonial" className="text-right">Testimonial (EN)</Label>
          <Textarea id="testimonial" name="testimonial" defaultValue={testimonial?.testimonial} className="col-span-3" />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="testimonial_hi" className="text-right">Testimonial (HI)</Label>
          <Textarea id="testimonial_hi" name="testimonial_hi" defaultValue={testimonial?.testimonial_hi} className="col-span-3" />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="videoId" className="text-right">YouTube Video ID</Label>
          <Input id="videoId" name="videoId" defaultValue={testimonial?.videoId} className="col-span-3" placeholder="e.g., dQw4w9WgXcQ" />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="avatar" className="text-right">Avatar</Label>
          <div className="col-span-3 flex items-center gap-4">
            {preview && <Avatar><AvatarImage src={preview} alt="Avatar Preview" /></Avatar>}
            <Input id="avatar" name="avatar" type="file" onChange={handleFileChange} className="col-span-3" />
          </div>
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

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<TTestimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<TTestimonial | null>(null);
  const [deletingTestimonial, setDeletingTestimonial] = useState<TTestimonial | null>(null);
  const { toast } = useToast();

  const fetchTestimonials = async () => {
    setLoading(true);
    const result = await getTestimonials();
    if (result.success && result.data) {
      setTestimonials(result.data as TTestimonial[]);
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
    const result = await deleteTestimonial(deletingTestimonial.id);
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
              <CardTitle>Manage Testimonials</CardTitle>
              <CardDescription>Add, edit, or delete student testimonials.</CardDescription>
            </div>
            <DialogTrigger asChild>
              <Button onClick={() => setEditingTestimonial(null)}>
                <PlusCircle className="mr-2 h-4 w-4" /> Add Testimonial
              </Button>
            </DialogTrigger>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[calc(100vh-250px)]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Avatar</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Achievement</TableHead>
                    <TableHead>Testimonial</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    [...Array(5)].map((_, i) => (
                      <TableRow key={i}>
                        <TableCell><Skeleton className="h-10 w-10 rounded-full" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                        <TableCell className="text-right"><Skeleton className="h-8 w-20" /></TableCell>
                      </TableRow>
                    ))
                  ) : (
                    testimonials.map((testimonial) => (
                      <TableRow key={testimonial.id}>
                        <TableCell>
                          <Avatar>
                            <AvatarImage src={testimonial.avatarUrl} alt={testimonial.name} />
                            <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                        </TableCell>
                        <TableCell>{testimonial.name}</TableCell>
                        <TableCell>{testimonial.achievement}</TableCell>
                        <TableCell><p className="max-w-xs truncate">{testimonial.testimonial}</p></TableCell>
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
         <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingTestimonial ? 'Edit' : 'Add'} Testimonial</DialogTitle>
            <DialogDescription>
              {editingTestimonial ? 'Update the details for this testimonial.' : 'Create a new testimonial to display on the homepage.'}
            </DialogDescription>
          </DialogHeader>
          <TestimonialForm testimonial={editingTestimonial} onSuccess={handleSuccess} />
        </DialogContent>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the testimonial from <span className="font-semibold">{deletingTestimonial?.name}</span>. This action cannot be undone.
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
