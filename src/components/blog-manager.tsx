'use client';

import { useEffect, useState } from 'react';
import { getBlogPosts, addBlogPost, editBlogPost, deleteBlogPost, approveBlogPost } from '@/app/actions/blog';
import type { TBlogPost } from '@/app/actions/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, Edit, Trash2, Image as ImageIcon, Info, ShieldCheck, GraduationCap, UserCheck, Lock, CheckCircle2, Clock } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { GcsImage } from '@/components/gcs-image';
import Image from 'next/image';
import { useAuth } from '@/context/auth-context';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export function AuthorRoleBadge({ role }: { role?: 'admin' | 'teacher' | 'student' | string }) {
  if (role === 'teacher') {
    return (
      <Badge className="bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800 text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 gap-1 inline-flex items-center">
        <GraduationCap className="w-3 h-3 text-emerald-600" />
        <span>Teacher</span>
      </Badge>
    );
  }

  if (role === 'student') {
    return (
      <Badge className="bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-800 text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 gap-1 inline-flex items-center">
        <UserCheck className="w-3 h-3 text-indigo-600" />
        <span>Student</span>
      </Badge>
    );
  }

  return (
    <Badge className="bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200/80 dark:border-blue-800 text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 gap-1 inline-flex items-center">
      <ShieldCheck className="w-3 h-3 text-blue-600" />
      <span>Admin</span>
    </Badge>
  );
}

export function StatusBadge({ status }: { status?: 'pending' | 'approved' | string }) {
  if (status === 'pending') {
    return (
      <Badge className="bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200/80 dark:border-amber-800 text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 gap-1 inline-flex items-center">
        <Clock className="w-3 h-3 text-amber-600" />
        <span>Pending</span>
      </Badge>
    );
  }

  return (
    <Badge className="bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800 text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 gap-1 inline-flex items-center">
      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
      <span>Approved</span>
    </Badge>
  );
}

const BlogForm = ({
  post,
  onSuccess,
  defaultRole = 'admin',
  currentUserId,
  currentUserName,
}: {
  post?: TBlogPost | null;
  onSuccess: () => void;
  defaultRole?: 'admin' | 'teacher' | 'student';
  currentUserId?: string;
  currentUserName?: string;
}) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const defaultAuthorName = post?.author || currentUserName || (defaultRole === 'teacher' ? 'Faculty Member' : defaultRole === 'student' ? 'Student Contributor' : 'IDL Academic Team');
  const defaultAuthorRole = post?.authorRole || defaultRole;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    formData.set('authorRole', defaultAuthorRole);
    if (currentUserId) {
      formData.set('authorId', currentUserId);
    }

    const result = post
      ? await editBlogPost(post.id, formData, defaultRole, currentUserId, currentUserName)
      : await addBlogPost(formData);

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

  const formattedDefaultDate = post?.date || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <form onSubmit={handleSubmit}>
      <ScrollArea className="h-[70vh] pr-4">
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right font-bold">Title</Label>
            <Input id="title" name="title" defaultValue={post?.title} className="col-span-3" required placeholder="Enter article headline" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category" className="text-right font-bold">Category</Label>
            <Input id="category" name="category" defaultValue={post?.category || 'Exams'} className="col-span-3" required placeholder="e.g., CBSE 2026, Revision Tips, Strategy" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="author" className="text-right font-bold">Author Name</Label>
            <div className="col-span-3 flex items-center gap-2">
              <Input id="author" name="author" defaultValue={defaultAuthorName} className="flex-1" required />
              <AuthorRoleBadge role={defaultAuthorRole} />
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="date" className="text-right font-bold">Display Date</Label>
            <Input id="date" name="date" defaultValue={formattedDefaultDate} className="col-span-3" required placeholder="e.g., Sep 07, 2026" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="excerpt" className="text-right font-bold">Excerpt Summary</Label>
            <Textarea id="excerpt" name="excerpt" defaultValue={post?.excerpt} className="col-span-3" required placeholder="Short summary of the article..." />
          </div>
          <div className="grid grid-cols-4 items-start gap-4">
            <div className="text-right pt-2 space-y-2">
                <Label htmlFor="content" className="font-bold">Article Content</Label>
                <div className="p-2 bg-primary/5 rounded-lg border border-primary/10 text-[9px] text-primary font-black uppercase tracking-tighter leading-tight text-left">
                    <p className="flex items-center gap-1 mb-1"><Info className="w-2.5 h-2.5"/> Formatting Guide</p>
                    <ul className="space-y-0.5 opacity-80">
                        <li># Text → Centered Hero Title</li>
                        <li>**Text** → <b>Extra Bold</b></li>
                        <li>++Text++ → <b className="text-[#41A67E]">Bold Green</b></li>
                        <li>==Text== → <mark>Soft Highlight</mark></li>
                        <li>1. Title → Numbered Module</li>
                        <li>- Item → Standard Bullet</li>
                    </ul>
                </div>
            </div>
            <Textarea id="content" name="content" defaultValue={post?.content} className="col-span-3 min-h-[300px] font-medium" required placeholder="Write your blog post content here..." />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="image" className="text-right font-bold">Cover Photo</Label>
            <div className="col-span-3 flex items-center gap-4">
              {preview ? (
                <Image src={preview} alt="Preview" width={100} height={60} className="rounded-md object-cover aspect-video" />
              ) : post?.imageUrl ? (
                <GcsImage filePath={post.imageUrl} alt={post.title} width={100} height={60} className="rounded-md object-cover aspect-video" />
              ) : (
                <div className="w-20 h-12 bg-muted rounded-md flex items-center justify-center">
                  <ImageIcon className="w-4 h-4 text-muted-foreground" />
                </div>
              )}
              <Input id="image" name="image" type="file" onChange={handleFileChange} className="flex-1" />
            </div>
          </div>
        </div>
      </ScrollArea>
      <DialogFooter className="mt-6">
        <Button type="submit" disabled={isSubmitting} className="font-bold">
          {isSubmitting ? 'Saving...' : post ? 'Update Article' : (defaultRole === 'admin' ? 'Publish Article' : 'Submit for Approval')}
        </Button>
      </DialogFooter>
    </form>
  );
};

export interface BlogManagerProps {
  role?: 'admin' | 'teacher' | 'student';
  title?: string;
  description?: string;
}

export function BlogManager({
  role = 'admin',
  title,
  description,
}: BlogManagerProps) {
  const { user } = useAuth();
  const [posts, setPosts] = useState<TBlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<TBlogPost | null>(null);
  const [deletingPost, setDeletingPost] = useState<TBlogPost | null>(null);
  const { toast } = useToast();

  const currentRole = role || user?.role || 'admin';
  const currentUserId = user?.uid || '';
  const currentUserName = user?.name || '';

  const fetchPosts = async () => {
    setLoading(true);
    const result = await getBlogPosts();
    if (result.success && result.data) {
      setPosts(result.data as TBlogPost[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleSuccess = () => {
    setIsDialogOpen(false);
    setEditingPost(null);
    fetchPosts();
  };

  const handleDelete = async () => {
    if (!deletingPost) return;
    const result = await deleteBlogPost(deletingPost.id, currentRole);
    if (result.success) {
      toast({ title: "Success", description: result.message });
      fetchPosts();
    } else {
      toast({ variant: "destructive", title: "Error", description: result.message });
    }
    setDeletingPost(null);
  };

  const isEditable = (post: TBlogPost) => {
    if (currentRole === 'admin') return true;
    // Non-admin can only edit their own PENDING posts
    if (post.status === 'approved') return false;
    if (post.authorRole && post.authorRole !== currentRole) return false;
    if (post.authorId && currentUserId && post.authorId === currentUserId) return true;
    if (post.author && currentUserName && post.author.toLowerCase() === currentUserName.toLowerCase()) return true;
    return false;
  };

  const handleApprove = async (post: TBlogPost) => {
    const result = await approveBlogPost(post.id, currentRole);
    if (result.success) {
      toast({ title: 'Approved!', description: result.message });
      fetchPosts();
    } else {
      toast({ variant: 'destructive', title: 'Error', description: result.message });
    }
  };

  const displayTitle = title || (currentRole === 'teacher' ? 'Faculty Article Portal' : currentRole === 'student' ? 'Student Blog Space' : 'Manage Blog Posts');
  const displayDesc = description || (currentRole === 'teacher' ? 'Write and publish educational blogs and study guides for students.' : currentRole === 'student' ? 'Share your exam preparation strategies and learning experience.' : 'Add, edit, or remove articles from the IDL Blog.');

  return (
    <TooltipProvider>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialog open={!!deletingPost} onOpenChange={(isOpen) => !isOpen && setDeletingPost(null)}>
          <Card className="border border-slate-200/80 dark:border-slate-800 shadow-sm rounded-2xl">
            <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4">
              <div>
                <CardTitle className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  {displayTitle}
                </CardTitle>
                <CardDescription className="text-xs font-medium text-slate-500 mt-0.5">
                  {displayDesc}
                </CardDescription>
              </div>
              <DialogTrigger asChild>
                <Button onClick={() => setEditingPost(null)} className="font-bold gap-1.5 h-9 rounded-lg">
                  <PlusCircle className="h-4 w-4" /> Add Article
                </Button>
              </DialogTrigger>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[calc(100vh-250px)]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-16">Cover</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Author</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      [...Array(5)].map((_, i) => (
                        <TableRow key={i}>
                          <TableCell><Skeleton className="h-10 w-16 rounded-md" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                          <TableCell className="text-right"><Skeleton className="h-8 w-20" /></TableCell>
                        </TableRow>
                      ))
                    ) : posts.length > 0 ? (
                      posts.map((post) => {
                        const canEdit = isEditable(post);
                        return (
                          <TableRow key={post.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                            <TableCell>
                              <div className="w-14 h-10 rounded-md overflow-hidden relative bg-muted border border-slate-200/60 dark:border-slate-800 shrink-0">
                                {post.imageUrl ? (
                                  <GcsImage filePath={post.imageUrl} alt={post.title} fill className="object-cover" />
                                ) : (
                                  <ImageIcon className="w-4 h-4 text-muted-foreground absolute inset-0 m-auto" />
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="font-bold text-slate-800 dark:text-slate-100 max-w-xs truncate">{post.title}</TableCell>
                            <TableCell className="text-xs font-semibold text-slate-600 dark:text-slate-400">{post.category}</TableCell>
                            <TableCell className="text-xs font-medium text-slate-700 dark:text-slate-300">{post.author}</TableCell>
                            <TableCell>
                              <AuthorRoleBadge role={post.authorRole} />
                            </TableCell>
                            <TableCell>
                              <StatusBadge status={post.status} />
                            </TableCell>
                            <TableCell className="text-xs text-slate-500 whitespace-nowrap">{post.date}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                {/* Approve button: admin only, pending posts only */}
                                {currentRole === 'admin' && post.status === 'pending' && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-8 px-2.5 rounded-md font-bold text-xs gap-1 border-emerald-300 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800"
                                    onClick={() => handleApprove(post)}
                                  >
                                    <CheckCircle2 className="h-3.5 w-3.5" />
                                    <span>Approve</span>
                                  </Button>
                                )}
                                {canEdit && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-8 px-2.5 rounded-md font-bold text-xs gap-1"
                                    onClick={() => { setEditingPost(post); setIsDialogOpen(true); }}
                                  >
                                    <Edit className="h-3.5 w-3.5" />
                                    <span>Edit</span>
                                  </Button>
                                )}
                                
                                {/* Delete action strictly restricted to Admin only */}
                                {currentRole === 'admin' && (
                                  <AlertDialogTrigger asChild>
                                    <Button
                                      variant="destructive"
                                      size="sm"
                                      className="h-8 px-2.5 rounded-md font-bold text-xs gap-1"
                                      onClick={() => setDeletingPost(post)}
                                    >
                                      <Trash2 className="h-3.5 w-3.5" />
                                      <span>Delete</span>
                                    </Button>
                                  </AlertDialogTrigger>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    ) : (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center h-28 text-muted-foreground font-medium">
                          No blog posts found. Click "Add Article" to publish your first post!
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </ScrollArea>
            </CardContent>
          </Card>
          <DialogContent className="sm:max-w-3xl">
            <DialogHeader>
              <DialogTitle className="text-lg font-extrabold">{editingPost ? 'Edit Article' : 'Publish New Article'}</DialogTitle>
              <DialogDescription className="text-xs">
                {editingPost ? 'Update details of your article.' : 'Share educational insights, guidelines, or study updates.'}
              </DialogDescription>
            </DialogHeader>
            <BlogForm 
              post={editingPost} 
              onSuccess={handleSuccess} 
              defaultRole={currentRole}
              currentUserId={currentUserId}
              currentUserName={currentUserName}
            />
          </DialogContent>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action will permanently delete the article: <span className="font-semibold">{deletingPost?.title}</span>.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </Dialog>
    </TooltipProvider>
  );
}
