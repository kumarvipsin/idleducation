'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { addFreeCourse, editFreeCourse } from '@/app/actions/free-courses';
import type { TFreeCourse } from '@/app/actions/types';
import { parseYouTubeUrl, ParsedYouTubeResult } from '@/lib/youtube';
import { Video, ListVideo, Sparkles, CheckCircle, AlertCircle, ExternalLink, Image as ImageIcon, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';

const STANDARD_CLASSES = [
  'Class 6',
  'Class 7',
  'Class 8',
  'Class 9',
  'Class 10',
  'Class 11',
  'Class 12',
];

const STANDARD_SUBJECTS = [
  'Mathematics',
  'Science',
  'English',
  'Social Studies',
  'Physics',
  'Chemistry',
  'Biology',
  'Economics',
  'Hindi',
  'General',
];

const STANDARD_CATEGORIES = [
  'Free Course',
  'Revision',
  'One Shot',
  'Concept Class',
  'Exam Preparation',
  'Important Questions',
  'Strategy',
];

const courseFormSchema = z.object({
  title: z.string().min(2, 'Title is required (at least 2 characters)'),
  youtubeUrl: z.string().min(5, 'YouTube URL is required'),
  class: z.string().min(1, 'Please select a Class'),
  subject: z.string().min(1, 'Please enter or select a Subject'),
  chapter: z.string().optional(),
  category: z.string().optional(),
  shortDescription: z.string().max(250, 'Short description should be 1-2 concise lines (under 250 chars)').optional(),
  publishStatus: z.enum(['published', 'draft', 'unpublished', 'archived']),
  displayOrder: z.coerce.number().default(0),
  isFeatured: z.boolean().default(false),
  customThumbnailUrl: z.string().optional(),
});

type FormValues = z.infer<typeof courseFormSchema>;

interface FreeCourseFormProps {
  course?: TFreeCourse | null;
  onSuccess: () => void;
}

export function FreeCourseForm({ course, onSuccess }: FreeCourseFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ytPreview, setYtPreview] = useState<ParsedYouTubeResult | null>(null);

  const defaultValues: FormValues = useMemo(() => ({
    title: course?.title || '',
    youtubeUrl: course?.youtubeUrl || '',
    class: course?.class || 'Class 9',
    subject: course?.subject || 'Mathematics',
    chapter: course?.chapter || '',
    category: course?.category || 'Free Course',
    shortDescription: course?.shortDescription || course?.description || '',
    publishStatus: (course?.publishStatus as any) || (course?.status === 'inactive' ? 'unpublished' : 'published'),
    displayOrder: course?.displayOrder ?? 0,
    isFeatured: Boolean(course?.isFeatured),
    customThumbnailUrl: course?.thumbnailUrl || '',
  }), [course]);

  const form = useForm<FormValues>({
    resolver: zodResolver(courseFormSchema),
    defaultValues,
  });

  const watchedUrl = form.watch('youtubeUrl');

  // Live validate YouTube link and update instant preview
  useEffect(() => {
    if (watchedUrl && watchedUrl.trim().length > 6) {
      const parsed = parseYouTubeUrl(watchedUrl);
      setYtPreview(parsed);
    } else {
      setYtPreview(null);
    }
  }, [watchedUrl]);

  const onSubmit = async (data: FormValues) => {
    // Validate YouTube URL before proceeding
    const validation = parseYouTubeUrl(data.youtubeUrl);
    if (!validation.isValid) {
      form.setError('youtubeUrl', {
        type: 'manual',
        message: validation.error || 'Please enter a valid YouTube video or playlist link.',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('title', data.title.trim());
      formData.append('youtubeUrl', validation.normalizedUrl || data.youtubeUrl.trim());
      formData.append('youtubeType', validation.type);
      if (validation.videoId) formData.append('youtubeVideoId', validation.videoId);
      if (validation.playlistId) formData.append('youtubePlaylistId', validation.playlistId);

      // Auto thumbnail: use manual override or derived YouTube thumbnail
      const activeThumbnail = data.customThumbnailUrl?.trim() || validation.thumbnailUrl || '';
      formData.append('thumbnailUrl', activeThumbnail);

      formData.append('class', data.class);
      formData.append('subject', data.subject.trim());
      formData.append('chapter', data.chapter?.trim() || '');
      formData.append('category', data.category || 'Free Course');
      formData.append('shortDescription', data.shortDescription?.trim() || '');
      formData.append('description', data.shortDescription?.trim() || '');
      formData.append('publishStatus', data.publishStatus);
      formData.append('status', data.publishStatus === 'published' ? 'active' : 'inactive');
      formData.append('displayOrder', String(data.displayOrder || 0));
      formData.append('isFeatured', String(data.isFeatured));

      const result = course
        ? await editFreeCourse(course.id, formData)
        : await addFreeCourse(formData);

      if (result.success) {
        toast({ title: 'Success', description: result.message });
        onSuccess();
      } else {
        toast({ variant: 'destructive', title: 'Error', description: result.message });
      }
    } catch (err: any) {
      toast({ variant: 'destructive', title: 'Failed to save', description: err?.message || 'An error occurred' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        {/* Step 1: Paste YouTube URL (with instant reactive preview) */}
        <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
          <FormField
            control={form.control}
            name="youtubeUrl"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel className="font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    YouTube URL *
                  </FormLabel>
                  <span className="text-[11px] text-muted-foreground font-medium">
                    Video or Playlist link
                  </span>
                </div>
                <FormControl>
                  <Input
                    placeholder="https://www.youtube.com/watch?v=... or https://youtu.be/..."
                    {...field}
                    className="bg-white dark:bg-slate-950 font-mono text-xs h-11"
                  />
                </FormControl>
                <FormMessage className="text-xs font-semibold" />
              </FormItem>
            )}
          />

          {/* Instant Live Preview */}
          {ytPreview && (
            <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-800">
              {ytPreview.isValid ? (
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-3 bg-white dark:bg-slate-950 rounded-lg border border-emerald-200 dark:border-emerald-900/60 shadow-xs">
                  <div className="relative w-28 aspect-video rounded overflow-hidden bg-slate-200 shrink-0 border border-slate-200 dark:border-slate-800">
                    {ytPreview.thumbnailUrl && (
                      <Image
                        src={ytPreview.thumbnailUrl}
                        alt="Detected YouTube Thumbnail"
                        fill
                        unoptimized
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={ytPreview.type === 'playlist' ? 'secondary' : 'default'}
                        className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 h-5 flex items-center gap-1"
                      >
                        {ytPreview.type === 'playlist' ? (
                          <>
                            <ListVideo className="w-3 h-3" /> Playlist / Course
                          </>
                        ) : (
                          <>
                            <Video className="w-3 h-3" /> Single Video
                          </>
                        )}
                      </Badge>
                      <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                        <CheckCircle className="w-3 h-3" /> Auto Thumbnail Ready
                      </span>
                    </div>
                    <p className="text-[11px] font-mono text-muted-foreground truncate">
                      ID: {ytPreview.videoId || ytPreview.playlistId}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-xs text-destructive font-medium p-2 bg-destructive/10 rounded-lg">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{ytPreview.error}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Step 2: Course Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Title */}
          <div className="md:col-span-2">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Course / Video Title *
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. Class 9 Maths Super One Shot Revision"
                      {...field}
                      className="font-medium h-10"
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
          </div>

          {/* Class Dropdown */}
          <FormField
            control={form.control}
            name="class"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Class *
                </FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="h-10">
                      <SelectValue placeholder="Select Class" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {STANDARD_CLASSES.map((cls) => (
                      <SelectItem key={cls} value={cls}>
                        {cls}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          {/* Subject Selector / Input */}
          <FormField
            control={form.control}
            name="subject"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Subject *
                </FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="h-10">
                      <SelectValue placeholder="Select Subject" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {STANDARD_SUBJECTS.map((sub) => (
                      <SelectItem key={sub} value={sub}>
                        {sub}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          {/* Chapter Grouping (Optional) */}
          <FormField
            control={form.control}
            name="chapter"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Chapter / Topic (Optional)
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g. Number System, Polynomials"
                    {...field}
                    className="h-10"
                  />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          {/* Category Dropdown (Optional) */}
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Category (Optional)
                </FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="h-10">
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {STANDARD_CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          {/* Short Description */}
          <div className="md:col-span-2">
            <FormField
              control={form.control}
              name="shortDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Short Description (1–2 concise lines)
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Complete revision of Number System with exam-focused questions and formulas."
                      {...field}
                      rows={2}
                      className="resize-none text-sm"
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
          </div>

          {/* Publish Status */}
          <FormField
            control={form.control}
            name="publishStatus"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Publish Status *
                </FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="h-10">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="published">Published (Visible on site)</SelectItem>
                    <SelectItem value="draft">Draft (Admin only)</SelectItem>
                    <SelectItem value="unpublished">Unpublished (Hidden)</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          {/* Display Order */}
          <FormField
            control={form.control}
            name="displayOrder"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Display Order
                </FormLabel>
                <FormControl>
                  <Input type="number" placeholder="0" {...field} className="h-10" />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />
        </div>

        <DialogFooter className="pt-4 border-t flex items-center justify-between sm:justify-end gap-2">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto font-bold text-xs px-6 h-10 shadow-md"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : course ? (
              'Save Changes'
            ) : (
              'Publish Free Course'
            )}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
