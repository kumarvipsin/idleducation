'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { getAdminFreeCourses, deleteFreeCourse, togglePublishStatus } from '@/app/actions/free-courses';
import type { TFreeCourse } from '@/app/actions/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import {
  PlusCircle,
  Edit,
  Trash2,
  Image as ImageIcon,
  Search,
  Video,
  ListVideo,
  ExternalLink,
  Eye,
  CheckCircle2,
  EyeOff,
  Filter,
  X,
  Play,
  ArrowUpDown,
  GraduationCap
} from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Image from 'next/image';
import { FreeCourseForm } from './form';

export default function AdminFreeCoursesPage() {
  const [courses, setCourses] = useState<TFreeCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<TFreeCourse | null>(null);
  const [deletingCourse, setDeletingCourse] = useState<TFreeCourse | null>(null);
  const [previewingCourse, setPreviewingCourse] = useState<TFreeCourse | null>(null);

  // Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [classFilter, setClassFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const { toast } = useToast();

  const fetchCourses = async () => {
    setLoading(true);
    const result = await getAdminFreeCourses();
    if (result.success && result.data) {
      setCourses(result.data as TFreeCourse[]);
    } else {
      toast({ variant: 'destructive', title: 'Error', description: result.message });
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

  const handleTogglePublish = async (course: TFreeCourse) => {
    const current = course.publishStatus || (course.status === 'active' ? 'published' : 'unpublished');
    const result = await togglePublishStatus(course.id, current);
    if (result.success) {
      toast({ title: 'Status Updated', description: result.message });
      fetchCourses();
    } else {
      toast({ variant: 'destructive', title: 'Error', description: result.message });
    }
  };

  const handleDelete = async () => {
    if (!deletingCourse) return;
    const result = await deleteFreeCourse(deletingCourse.id);
    if (result.success) {
      toast({ title: 'Success', description: result.message });
      fetchCourses();
    } else {
      toast({ variant: 'destructive', title: 'Error', description: result.message });
    }
    setDeletingCourse(null);
  };

  // Dynamic Class list for filter dropdown
  const availableClasses = useMemo(() => {
    const set = new Set(courses.map((c) => c.class).filter(Boolean));
    return ['Class 9', 'Class 10', 'Class 11', 'Class 12', ...Array.from(set).filter(c => !['Class 9', 'Class 10', 'Class 11', 'Class 12'].includes(c))];
  }, [courses]);

  // Filtered courses
  const filteredCourses = useMemo(() => {
    return courses.filter((c) => {
      const matchSearch =
        !searchQuery.trim() ||
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.class?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.chapter?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchClass = classFilter === 'all' || c.class === classFilter;
      const matchType = typeFilter === 'all' || c.youtubeType === typeFilter;
      const matchStatus =
        statusFilter === 'all' ||
        (statusFilter === 'published' && (c.publishStatus === 'published' || (!c.publishStatus && c.status === 'active'))) ||
        (statusFilter === 'draft' && c.publishStatus === 'draft') ||
        (statusFilter === 'unpublished' && (c.publishStatus === 'unpublished' || c.status === 'inactive')) ||
        (statusFilter === 'archived' && c.publishStatus === 'archived');

      return matchSearch && matchClass && matchType && matchStatus;
    });
  }, [courses, searchQuery, classFilter, typeFilter, statusFilter]);

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Add Action */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Free Courses & YouTube Library
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground font-medium mt-1">
            Publish YouTube videos and playlists for students with automatic thumbnails and 1-minute setup.
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingCourse(null);
            setIsDialogOpen(true);
          }}
          className="font-bold text-xs shadow-md shrink-0 h-10 px-4"
        >
          <PlusCircle className="mr-2 h-4 w-4" /> Add Free Course
        </Button>
      </div>

      {/* Filter & Search Bar */}
      <Card className="shadow-xs border-slate-200 dark:border-slate-800">
        <CardContent className="p-4 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3">
            {/* Search Input */}
            <div className="lg:col-span-5 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by Title, Subject, Class..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-10 text-xs"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Class Filter */}
            <div className="lg:col-span-3">
              <Select value={classFilter} onValueChange={setClassFilter}>
                <SelectTrigger className="h-10 text-xs">
                  <SelectValue placeholder="All Classes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Classes</SelectItem>
                  {Array.from(new Set(availableClasses)).map((cls) => (
                    <SelectItem key={cls} value={cls}>
                      {cls}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Type Filter */}
            <div className="lg:col-span-2">
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="h-10 text-xs">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="video">Single Video</SelectItem>
                  <SelectItem value="playlist">Playlist</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Status Filter */}
            <div className="lg:col-span-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="h-10 text-xs">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="unpublished">Unpublished</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content Table / Cards */}
      <Card className="shadow-xs border-slate-200 dark:border-slate-800 overflow-hidden">
        <CardHeader className="py-4 px-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base font-black">
              Total Courses ({filteredCourses.length})
            </CardTitle>
            <CardDescription className="text-xs">
              Live content displayed across website and student portals.
            </CardDescription>
          </div>
          {(searchQuery || classFilter !== 'all' || typeFilter !== 'all' || statusFilter !== 'all') && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchQuery('');
                setClassFilter('all');
                setTypeFilter('all');
                setStatusFilter('all');
              }}
              className="text-xs font-bold text-muted-foreground hover:text-foreground h-8"
            >
              Reset Filters
            </Button>
          )}
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-28 text-xs uppercase font-bold">Thumbnail</TableHead>
                  <TableHead className="text-xs uppercase font-bold">Title & Details</TableHead>
                  <TableHead className="text-xs uppercase font-bold">Class & Subject</TableHead>
                  <TableHead className="text-xs uppercase font-bold">Type</TableHead>
                  <TableHead className="text-xs uppercase font-bold">Status</TableHead>
                  <TableHead className="text-right text-xs uppercase font-bold pr-6">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  [...Array(4)].map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-14 w-24 rounded-lg" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-48 mb-2" /><Skeleton className="h-3 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                      <TableCell className="text-right pr-6"><Skeleton className="h-8 w-24 ml-auto" /></TableCell>
                    </TableRow>
                  ))
                ) : filteredCourses.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-16 text-muted-foreground">
                      <GraduationCap className="w-10 h-10 mx-auto mb-3 opacity-30 text-primary" />
                      <p className="font-bold text-sm text-foreground">No free courses match your search or filter.</p>
                      <p className="text-xs mt-1">Try clearing filters or click &ldquo;Add Free Course&rdquo; to publish a new one.</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCourses.map((course) => {
                    const isPub = course.publishStatus === 'published' || (!course.publishStatus && course.status === 'active');
                    const isDraft = course.publishStatus === 'draft';
                    const isUnpub = course.publishStatus === 'unpublished' || course.status === 'inactive';
                    const isArch = course.publishStatus === 'archived';

                    return (
                      <TableRow key={course.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-900/50">
                        {/* 16:9 Thumbnail */}
                        <TableCell>
                          <div className="relative w-24 aspect-video rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 shrink-0">
                            {course.thumbnailUrl || course.coverImageUrl ? (
                              <Image
                                src={course.thumbnailUrl || course.coverImageUrl || ''}
                                alt={course.title}
                                fill
                                unoptimized
                                className="object-cover"
                              />
                            ) : (
                              <div className="flex items-center justify-center w-full h-full text-muted-foreground">
                                <ImageIcon className="w-5 h-5 opacity-40" />
                              </div>
                            )}
                            <div className="absolute inset-0 bg-black/15 flex items-center justify-center">
                              <Play className="w-3.5 h-3.5 text-white fill-white/80" />
                            </div>
                          </div>
                        </TableCell>

                        {/* Title & Description */}
                        <TableCell className="max-w-md">
                          <div className="space-y-1">
                            <p className="font-bold text-sm text-slate-900 dark:text-white leading-snug line-clamp-1">
                              {course.title}
                            </p>
                            <p className="text-xs text-muted-foreground line-clamp-1">
                              {course.shortDescription || course.description || 'No description provided.'}
                            </p>
                            {course.chapter && (
                              <span className="inline-block text-[10px] font-semibold text-primary bg-primary/10 rounded px-1.5 py-0.5">
                                Chapter: {course.chapter}
                              </span>
                            )}
                          </div>
                        </TableCell>

                        {/* Class & Subject */}
                        <TableCell>
                          <div className="space-y-1">
                            <Badge variant="outline" className="text-[10px] font-bold">
                              {course.class}
                            </Badge>
                            <p className="text-xs text-muted-foreground font-semibold">
                              {course.subject || 'General'}
                            </p>
                          </div>
                        </TableCell>

                        {/* Type */}
                        <TableCell>
                          <Badge
                            variant={course.youtubeType === 'playlist' ? 'secondary' : 'outline'}
                            className="text-[10px] font-bold uppercase tracking-wider gap-1 h-6"
                          >
                            {course.youtubeType === 'playlist' ? (
                              <>
                                <ListVideo className="w-3 h-3" /> Playlist
                              </>
                            ) : (
                              <>
                                <Video className="w-3 h-3" /> Video
                              </>
                            )}
                          </Badge>
                        </TableCell>

                        {/* Publish Status */}
                        <TableCell>
                          {isPub && (
                            <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/20 border-emerald-500/30 text-[10px] font-bold uppercase">
                              Published
                            </Badge>
                          )}
                          {isDraft && (
                            <Badge className="bg-amber-500/15 text-amber-700 dark:text-amber-400 hover:bg-amber-500/20 border-amber-500/30 text-[10px] font-bold uppercase">
                              Draft
                            </Badge>
                          )}
                          {isUnpub && (
                            <Badge variant="outline" className="text-slate-500 dark:text-slate-400 border-slate-300 dark:border-slate-700 text-[10px] font-bold uppercase">
                              Unpublished
                            </Badge>
                          )}
                          {isArch && (
                            <Badge variant="outline" className="text-rose-500 border-rose-300 text-[10px] font-bold uppercase">
                              Archived
                            </Badge>
                          )}
                        </TableCell>

                        {/* Action Buttons */}
                        <TableCell className="text-right pr-6 space-x-1 whitespace-nowrap">
                          {/* Student Preview Modal Button */}
                          <Button
                            variant="ghost"
                            size="icon"
                            title="Preview Course"
                            onClick={() => setPreviewingCourse(course)}
                            className="h-8 w-8 text-slate-600 dark:text-slate-300 hover:text-primary"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>

                          {/* Quick Toggle Publish */}
                          <Button
                            variant="ghost"
                            size="icon"
                            title={isPub ? 'Unpublish' : 'Publish'}
                            onClick={() => handleTogglePublish(course)}
                            className={`h-8 w-8 ${isPub ? 'text-emerald-600 hover:text-amber-600' : 'text-slate-400 hover:text-emerald-600'}`}
                          >
                            {isPub ? <CheckCircle2 className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                          </Button>

                          {/* Edit */}
                          <Button
                            variant="outline"
                            size="icon"
                            title="Edit"
                            onClick={() => {
                              setEditingCourse(course);
                              setIsDialogOpen(true);
                            }}
                            className="h-8 w-8"
                          >
                            <Edit className="h-3.5 w-3.5" />
                          </Button>

                          {/* Delete */}
                          <Button
                            variant="destructive"
                            size="icon"
                            title="Delete"
                            onClick={() => setDeletingCourse(course)}
                            className="h-8 w-8"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Add / Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg font-black">
              {editingCourse ? 'Edit Free Course' : 'Add Free Course / Video'}
            </DialogTitle>
            <DialogDescription className="text-xs">
              Paste a YouTube link to automatically fetch thumbnails and configure class learning details.
            </DialogDescription>
          </DialogHeader>
          <FreeCourseForm course={editingCourse} onSuccess={handleSuccess} />
        </DialogContent>
      </Dialog>

      {/* Student Preview Modal */}
      <Dialog open={!!previewingCourse} onOpenChange={(open) => !open && setPreviewingCourse(null)}>
        <DialogContent className="sm:max-w-xl p-0 overflow-hidden rounded-2xl">
          <DialogHeader className="sr-only">
            <DialogTitle>{previewingCourse?.title || 'Course Preview'}</DialogTitle>
            <DialogDescription>
              {previewingCourse?.shortDescription || previewingCourse?.description || 'Video course preview'}
            </DialogDescription>
          </DialogHeader>
          {previewingCourse && (
            <div>
              <div className="relative aspect-video w-full bg-black">
                {previewingCourse.thumbnailUrl || previewingCourse.coverImageUrl ? (
                  <Image
                    src={previewingCourse.thumbnailUrl || previewingCourse.coverImageUrl || ''}
                    alt={previewingCourse.title}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                ) : null}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <a
                    href={previewingCourse.youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-14 w-14 rounded-full bg-primary/90 hover:bg-primary text-white flex items-center justify-center shadow-lg transition-transform hover:scale-110"
                  >
                    <Play className="h-6 w-6 ml-0.5 fill-white" />
                  </a>
                </div>
              </div>
              <div className="p-6 space-y-4 bg-white dark:bg-slate-900">
                <div className="flex items-center gap-2">
                  <Badge className="bg-emerald-500 text-white font-bold text-[10px]">
                    FREE
                  </Badge>
                  <Badge variant="outline" className="text-[10px] font-bold">
                    {previewingCourse.class}
                  </Badge>
                  <Badge variant="secondary" className="text-[10px] font-bold">
                    {previewingCourse.subject}
                  </Badge>
                  {previewingCourse.category && (
                    <span className="text-xs text-muted-foreground font-semibold">
                      • {previewingCourse.category}
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white leading-snug">
                  {previewingCourse.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {previewingCourse.shortDescription || previewingCourse.description || 'No description provided.'}
                </p>
                <div className="pt-3 border-t flex items-center justify-between">
                  <span className="text-[11px] text-muted-foreground font-mono truncate max-w-xs">
                    {previewingCourse.youtubeUrl}
                  </span>
                  <a
                    href={previewingCourse.youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
                  >
                    Watch on YouTube <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Alert Dialog */}
      <AlertDialog open={!!deletingCourse} onOpenChange={(open) => !open && setDeletingCourse(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-base font-black">
              Remove Free Course?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs">
              Are you sure you want to remove <span className="font-bold text-foreground">{deletingCourse?.title}</span>?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="text-xs font-bold">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive hover:bg-destructive/90 text-xs font-bold"
            >
              Confirm Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
