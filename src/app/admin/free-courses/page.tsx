
'use client';

import { useEffect, useState } from 'react';
import { getFreeCourses, addFreeCourse, editFreeCourse, deleteFreeCourse } from '@/app/actions/free-courses';
import type { TFreeCourse } from '@/app/actions/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, Edit, Trash2, Image as ImageIcon, Video, BookOpen } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { GcsImage } from '@/components/gcs-image';
import { FreeCourseForm } from './form';

export default function AdminFreeCoursesPage() {
  const [courses, setCourses] = useState<TFreeCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<TFreeCourse | null>(null);
  const [deletingCourse, setDeletingCourse] = useState<TFreeCourse | null>(null);
  const { toast } = useToast();

  const fetchCourses = async () => {
    setLoading(true);
    const result = await getFreeCourses();
    if (result.success && result.data) {
      setCourses(result.data as TFreeCourse[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleSuccess = () => {
    setIsDialogOpen(false);
    setEditingCourse(null);
    fetchCourses();
  };

  const handleDelete = async () => {
    if (!deletingCourse) return;
    const result = await deleteFreeCourse(deletingCourse.id);
    if (result.success) {
      toast({ title: "Success", description: result.message });
      fetchCourses();
    } else {
      toast({ variant: "destructive", title: "Error", description: result.message });
    }
    setDeletingCourse(null);
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <AlertDialog open={!!deletingCourse} onOpenChange={(isOpen) => !isOpen && setDeletingCourse(null)}>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Manage Free Courses</CardTitle>
              <CardDescription>Add, edit, or delete free courses.</CardDescription>
            </div>
            <DialogTrigger asChild>
              <Button onClick={() => setEditingCourse(null)}>
                <PlusCircle className="mr-2 h-4 w-4" /> Add Course
              </Button>
            </DialogTrigger>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[calc(100vh-250px)]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Image</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    [...Array(5)].map((_, i) => (
                      <TableRow key={i}>
                        <TableCell><Skeleton className="h-10 w-16 rounded-md" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                        <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                        <TableCell className="text-right"><Skeleton className="h-8 w-20" /></TableCell>
                      </TableRow>
                    ))
                  ) : (
                    courses.map((course) => (
                      <TableRow key={course.id}>
                        <TableCell>
                          <div className="w-16 h-10 rounded-md flex items-center justify-center bg-muted overflow-hidden">
                            {course.coverImageUrl ? <GcsImage filePath={course.coverImageUrl} alt={course.title} width={64} height={40} className="object-cover" /> : <ImageIcon className="w-4 h-4 text-muted-foreground"/>}
                          </div>
                        </TableCell>
                        <TableCell>{course.title}</TableCell>
                        <TableCell>{course.class}</TableCell>
                        <TableCell>{course.subject}</TableCell>
                        <TableCell>{course.status}</TableCell>
                        <TableCell className="text-right space-x-2">
                           <Button variant="outline" size="icon" onClick={() => { setEditingCourse(course); setIsDialogOpen(true); }}>
                             <Edit className="h-4 w-4" />
                           </Button>
                           <AlertDialogTrigger asChild>
                                <Button variant="destructive" size="icon" onClick={() => setDeletingCourse(course)}>
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
        <DialogContent className="sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle>{editingCourse ? 'Edit' : 'Add'} Free Course</DialogTitle>
            <DialogDescription>
              {editingCourse ? 'Update the details for this course.' : 'Create a new free course.'}
            </DialogDescription>
          </DialogHeader>
          <FreeCourseForm course={editingCourse} onSuccess={handleSuccess} />
        </DialogContent>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the course: <span className="font-semibold">{deletingCourse?.title}</span>. This action cannot be undone.
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
