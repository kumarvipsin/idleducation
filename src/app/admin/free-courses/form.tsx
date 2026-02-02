
'use client';

import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { ScrollArea } from '@/components/ui/scroll-area';
import { DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';
import { addFreeCourse, editFreeCourse } from '@/app/actions/free-courses';
import type { TFreeCourse } from '@/app/actions/types';
import { PlusCircle, Trash2, XCircle } from 'lucide-react';
import Image from 'next/image';
import { GcsImage } from '@/components/gcs-image';

const videoSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  youtubeLink: z.string().url('Must be a valid YouTube URL'),
});

const chapterSchema = z.object({
  name: z.string().min(1, 'Chapter name is required'),
  videos: z.array(videoSchema),
});

const courseSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  class: z.string().optional(),
  board: z.string().optional(),
  subject: z.string().optional(),
  medium: z.string().optional(),
  batchName: z.string().optional(),
  validity: z.string().optional(),
  price: z.coerce.number().optional(),
  originalPrice: z.coerce.number().optional(),
  description: z.string().optional(),
  status: z.enum(['active', 'inactive']),
  chapters: z.array(chapterSchema),
});

type CourseFormValues = z.infer<typeof courseSchema>;

export function FreeCourseForm({ course, onSuccess }: { course?: TFreeCourse | null; onSuccess: () => void }) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const form = useForm<CourseFormValues>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      title: course?.title || '',
      class: course?.class || '',
      board: course?.board || '',
      subject: course?.subject || '',
      medium: course?.medium || '',
      batchName: course?.batchName || '',
      validity: course?.validity || '',
      price: course?.price || 0,
      originalPrice: course?.originalPrice || 0,
      description: course?.description || '',
      status: course?.status || 'active',
      chapters: course?.chapters || [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'chapters',
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (data: CourseFormValues) => {
    setIsSubmitting(true);
    const formData = new FormData();
    const imageInput = document.getElementById('coverImage') as HTMLInputElement;
    if (imageInput?.files?.[0]) {
        formData.append('coverImage', imageInput.files[0]);
    } else if (course?.coverImageUrl) {
        formData.append('existingCoverImageUrl', course.coverImageUrl);
    }
    
    // Append all other form data
    Object.keys(data).forEach(key => {
        if (key !== 'chapters') {
            const value = data[key as keyof typeof data];
            if (value !== undefined && value !== null) {
              formData.append(key, String(value));
            }
        }
    });

    data.chapters.forEach((chapter, chapIndex) => {
        formData.append(`chapters[${chapIndex}].name`, chapter.name);
        chapter.videos.forEach((video, videoIndex) => {
            formData.append(`chapters[${chapIndex}].videos[${videoIndex}].title`, video.title);
            formData.append(`chapters[${chapIndex}].videos[${videoIndex}].youtubeLink`, video.youtubeLink);
        });
    });

    const result = course ? await editFreeCourse(course.id, formData) : await addFreeCourse(formData);

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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <ScrollArea className="h-[60vh] pr-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField control={form.control} name="title" render={({ field }) => <FormItem><Label>Title</Label><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>} />
            <FormField control={form.control} name="class" render={({ field }) => <FormItem><Label>Class</Label><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>} />
            <FormField control={form.control} name="board" render={({ field }) => <FormItem><Label>Board</Label><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>} />
            <FormField control={form.control} name="subject" render={({ field }) => <FormItem><Label>Subject</Label><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>} />
            <FormField control={form.control} name="medium" render={({ field }) => <FormItem><Label>Medium</Label><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>} />
            <FormField control={form.control} name="batchName" render={({ field }) => <FormItem><Label>Batch Name</Label><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>} />
            <FormField control={form.control} name="validity" render={({ field }) => <FormItem><Label>Validity</Label><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>} />
            <FormField control={form.control} name="price" render={({ field }) => <FormItem><Label>Price</Label><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>} />
            <FormField control={form.control} name="originalPrice" render={({ field }) => <FormItem><Label>Original Price</Label><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>} />
            <FormField control={form.control} name="status" render={({ field }) => <FormItem><Label>Status</Label><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="active">Active</SelectItem><SelectItem value="inactive">Inactive</SelectItem></SelectContent></Select><FormMessage /></FormItem>} />
            <div className="md:col-span-2"><FormField control={form.control} name="description" render={({ field }) => <FormItem><Label>Description</Label><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>} /></div>
            <div className="md:col-span-2">
                <Label>Cover Image</Label>
                <div className="flex items-center gap-4 mt-2">
                    {preview ? <Image src={preview} alt="Preview" width={128} height={72} className="rounded-md object-cover" /> : (course?.coverImageUrl) ? <GcsImage filePath={course.coverImageUrl} alt={course.title} width={128} height={72} className="rounded-md object-cover" /> : null}
                    <Input id="coverImage" name="coverImage" type="file" onChange={handleFileChange} />
                </div>
            </div>
          </div>
          
          <div className="space-y-4 pt-4 border-t mt-4">
              <h3 className="text-lg font-semibold">Chapters & Videos</h3>
              {fields.map((chapter, chapIndex) => (
                  <ChapterField key={chapter.id} chapIndex={chapIndex} removeChapter={remove} control={form.control} />
              ))}
              <Button type="button" variant="outline" size="sm" onClick={() => append({ name: '', videos: [] })}>
                  <PlusCircle className="mr-2 h-4 w-4" /> Add Chapter
              </Button>
          </div>
        </ScrollArea>
        <DialogFooter>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}

function ChapterField({ chapIndex, control, removeChapter }: { chapIndex: number; control: any; removeChapter: (index: number) => void; }) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `chapters.${chapIndex}.videos`,
  });

  return (
    <div className="space-y-3 p-3 border rounded-lg bg-muted/50">
        <div className="flex justify-between items-center">
            <FormField control={control} name={`chapters.${chapIndex}.name`} render={({ field }) => ( <FormItem className="flex-1"><FormControl><Input placeholder="Chapter Name" {...field} /></FormControl><FormMessage /></FormItem> )}/>
            <Button type="button" variant="ghost" size="icon" onClick={() => removeChapter(chapIndex)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
        </div>
        <div className="space-y-2 pl-4">
            {fields.map((video, videoIndex) => (
                <div key={video.id} className="p-2 border rounded-md bg-background relative">
                     <div className="flex items-center gap-2">
                         <FormField control={control} name={`chapters.${chapIndex}.videos.${videoIndex}.title`} render={({ field }) => ( <FormItem className="flex-1"><FormControl><Input placeholder="Video Title" {...field} /></FormControl><FormMessage /></FormItem> )}/>
                         <FormField control={control} name={`chapters.${chapIndex}.videos.${videoIndex}.youtubeLink`} render={({ field }) => ( <FormItem className="flex-1"><FormControl><Input placeholder="YouTube Link" {...field} /></FormControl><FormMessage /></FormItem> )}/>
                         <Button type="button" variant="ghost" size="icon" className="h-6 w-6" onClick={() => remove(videoIndex)}><XCircle className="h-4 w-4 text-muted-foreground" /></Button>
                     </div>
                </div>
            ))}
        </div>
        <div className="flex justify-end">
            <Button type="button" variant="outline" size="sm" onClick={() => append({ title: '', youtubeLink: '' })}>
                <PlusCircle className="mr-2 h-4 w-4" /> Add Video
            </Button>
        </div>
    </div>
  );
}
