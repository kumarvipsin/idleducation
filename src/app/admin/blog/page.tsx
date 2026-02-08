
'use client';

import { useEffect, useState } from 'react';
import { getBlogPosts, addBlogPost, editBlogPost, deleteBlogPost } from '@/app/actions/blog';
import type { TBlogPost } from '@/app/actions/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, Edit, Trash2, Image as ImageIcon } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { GcsImage } from '@/components/gcs-image';
import Image from 'next/image';

const BlogForm = ({
  post,
  onSuccess,
}: {
  post?: TBlogPost | null;
  onSuccess: () => void;
}) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const result = post
      ? await editBlogPost(post.id, formData)
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

  return (
    <form onSubmit={handleSubmit}>
      <ScrollArea className="h-[70vh] pr-4">
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">Title</Label>
            <Input id="title" name="title" defaultValue={post?.title} className="col-span-3" required />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category" className="text-right">Category</Label>
            <Input id="category" name="category" defaultValue={post?.category} className="col-span-3" required placeholder="e.g., Exams, Education" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="author" className="text-right">Author</Label>
            <Input id="author" name="author" defaultValue={post?.author} className="col-span-3" required />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="date" className="text-right">Display Date</Label>
            <Input id="date" name="date" defaultValue={post?.date} className="col-span-3" required placeholder="e.g., July 15, 2024" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="excerpt" className="text-right">Excerpt</Label>
            <Textarea id="excerpt" name="excerpt" defaultValue={post?.excerpt} className="col-span-3" required />
          </div>
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="content" className="text-right pt-2">Article Content</Label>
            <Textarea id="content" name="content" defaultValue={post?.content} className="col-span-3 min-h-[200px]" required />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="image" className="text-right">Post Photo</Label>
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
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save Changes'}
        </Button>
      </DialogFooter>
    </form>
  );
};

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<TBlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<TBlogPost | null>(null);
  const [deletingPost, setDeletingPost] = useState<TBlogPost | null>(null);
  const { toast } = useToast();

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
    const result = await deleteBlogPost(deletingPost.id);
    if (result.success) {
      toast({ title: "Success", description: result.message });
      fetchPosts();
    } else {
      toast({ variant: "destructive", title: "Error", description: result.message });
    }
    setDeletingPost(null);
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <AlertDialog open={!!deletingPost} onOpenChange={(isOpen) => !isOpen && setDeletingPost(null)}>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Manage Blog Posts</CardTitle>
              <CardDescription>Add, edit, or remove articles from the IDL Blog.</CardDescription>
            </div>
            <DialogTrigger asChild>
              <Button onClick={() => setEditingPost(null)}>
                <PlusCircle className="mr-2 h-4 w-4" /> Add Article
              </Button>
            </DialogTrigger>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[calc(100vh-250px)]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Photo</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Author</TableHead>
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
                        <TableCell className="text-right"><Skeleton className="h-8 w-20" /></TableCell>
                      </TableRow>
                    ))
                  ) : posts.length > 0 ? (
                    posts.map((post) => (
                      <TableRow key={post.id}>
                        <TableCell>
                          <div className="w-16 h-10 rounded-md overflow-hidden relative bg-muted">
                            {post.imageUrl ? (
                              <GcsImage filePath={post.imageUrl} alt={post.title} fill className="object-cover" />
                            ) : (
                              <ImageIcon className="w-4 h-4 text-muted-foreground absolute inset-0 m-auto" />
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="font-medium max-w-xs truncate">{post.title}</TableCell>
                        <TableCell>{post.category}</TableCell>
                        <TableCell>{post.author}</TableCell>
                        <TableCell>{post.date}</TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button variant="outline" size="icon" onClick={() => { setEditingPost(post); setIsDialogOpen(true); }}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="icon" onClick={() => setDeletingPost(post)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">No blog posts found.</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </ScrollArea>
          </CardContent>
        </Card>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>{editingPost ? 'Edit Article' : 'Add New Article'}</DialogTitle>
            <DialogDescription>
              {editingPost ? 'Update the details for this article.' : 'Create a new blog post for your readers.'}
            </DialogDescription>
          </DialogHeader>
          <BlogForm post={editingPost} onSuccess={handleSuccess} />
        </DialogContent>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the article: <span className="font-semibold">{deletingPost?.title}</span>. This action cannot be undone.
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
