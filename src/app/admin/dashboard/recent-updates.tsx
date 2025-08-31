
'use client';

import { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Bell, FileText, Megaphone, Calendar, PlusCircle, MoreVertical, Trash2, Edit } from 'lucide-react';
import { addUpdate, getUpdates, editUpdate, deleteUpdate } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';

interface Update {
  id: string;
  title: string;
  description: string;
  createdAt: string;
}

const iconMap: { [key: string]: React.ReactNode } = {
    "New Course Announcement!": <Megaphone className="w-6 h-6 text-primary" />,
    "Algebra 101 Materials Updated": <FileText className="w-6 h-6 text-primary" />,
    "Upcoming Webinar": <Calendar className="w-6 h-6 text-primary" />,
    default: <Bell className="w-6 h-6 text-primary" />,
};

const getIconForTitle = (title: string) => {
    return iconMap[title] || iconMap.default;
};


export function RecentUpdates() {
  const [updates, setUpdates] = useState<Update[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingUpdate, setEditingUpdate] = useState<Update | null>(null);
  const [deletingUpdate, setDeletingUpdate] = useState<Update | null>(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const fetchUpdates = async () => {
    setLoading(true);
    const result = await getUpdates();
    if (result.success && result.data) {
      setUpdates(result.data as Update[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUpdates();
  }, []);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setEditingUpdate(null);
  }

  const handleAddPost = async () => {
    if (title && description) {
      setIsSubmitting(true);
      const result = await addUpdate({ title, description });
      if (result.success) {
        toast({ title: "Success", description: "Update posted successfully!" });
        resetForm();
        setIsAddDialogOpen(false);
        fetchUpdates(); 
      } else {
        toast({ variant: "destructive", title: "Error", description: result.message });
      }
      setIsSubmitting(false);
    }
  };

  const handleEditPost = async () => {
    if (editingUpdate && title && description) {
      setIsSubmitting(true);
      const result = await editUpdate(editingUpdate.id, { title, description });
       if (result.success) {
        toast({ title: "Success", description: "Update edited successfully!" });
        resetForm();
        setIsEditDialogOpen(false);
        fetchUpdates();
      } else {
        toast({ variant: "destructive", title: "Error", description: result.message });
      }
      setIsSubmitting(false);
    }
  }

  const handleDeletePost = async () => {
    if (deletingUpdate) {
        const result = await deleteUpdate(deletingUpdate.id);
        if (result.success) {
            toast({ title: "Success", description: "Update deleted successfully!" });
            fetchUpdates();
        } else {
            toast({ variant: "destructive", title: "Error", description: result.message });
        }
        setDeletingUpdate(null);
    }
  }

  const openEditDialog = (update: Update) => {
    setEditingUpdate(update);
    setTitle(update.title);
    setDescription(update.description);
    setIsEditDialogOpen(true);
  }


  const renderSkeleton = () => (
    <div className="space-y-6">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="flex items-start gap-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-full" />
          </div>
          <Skeleton className="h-4 w-1/4" />
        </div>
      ))}
    </div>
  );

  const PostForm = ({ onSubmit, isSubmitting: isSubmittingProp, buttonText }: { onSubmit: () => void, isSubmitting: boolean, buttonText: string }) => (
    <>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="title" className="text-right">
            Title
          </Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="col-span-3"
            placeholder="e.g., New Course Available"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="description" className="text-right">
            Description
          </Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="col-span-3"
            placeholder="Enter the details of the announcement."
          />
        </div>
      </div>
      <DialogFooter>
        <Button onClick={onSubmit} disabled={isSubmittingProp}>
          {isSubmittingProp ? 'Saving...' : buttonText}
        </Button>
      </DialogFooter>
    </>
  );

  return (
    <>
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Recent Updates</CardTitle>
          <CardDescription>A quick look at the latest platform announcements.</CardDescription>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={(isOpen) => { setIsAddDialogOpen(isOpen); if (!isOpen) resetForm(); }}>
          <DialogTrigger asChild>
            <Button size="sm">
              <PlusCircle className="mr-2 h-4 w-4" />
              New Post
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
              <DialogTitle>Create New Post</DialogTitle>
              <DialogDescription>
                  Add a new update or announcement for all users to see.
              </DialogDescription>
              </DialogHeader>
              <PostForm onSubmit={handleAddPost} isSubmitting={isSubmitting} buttonText="Post Update" />
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {loading ? (
          renderSkeleton()
        ) : (
          <div className="space-y-6">
            {updates.length > 0 ? (
              updates.map((update) => (
                <div key={update.id} className="flex items-start gap-4">
                    <div className="bg-primary/10 p-3 rounded-full">
                      {getIconForTitle(update.title)}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{update.title}</h3>
                    <p className="text-xs text-muted-foreground">{update.description}</p>
                  </div>
                  <div className="text-xs text-muted-foreground whitespace-nowrap mr-2">
                    {formatDistanceToNow(new Date(update.createdAt), { addSuffix: true })}
                  </div>
                   <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-6 w-6">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => openEditDialog(update)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                         <AlertDialogTrigger asChild>
                           <DropdownMenuItem onSelect={(e) => e.preventDefault()} onClick={() => setDeletingUpdate(update)}>
                            <Trash2 className="mr-2 h-4 w-4 text-destructive" />
                            <span className="text-destructive">Delete</span>
                          </DropdownMenuItem>
                        </AlertDialogTrigger>
                      </DropdownMenuContent>
                    </DropdownMenu>
                </div>
              ))
            ) : (
              <p className="text-center text-muted-foreground">No recent updates.</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>

    <Dialog open={isEditDialogOpen} onOpenChange={(isOpen) => { setIsEditDialogOpen(isOpen); if (!isOpen) resetForm(); }}>
        <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
            <DialogTitle>Edit Post</DialogTitle>
            <DialogDescription>
                Make changes to your post here. Click save when you're done.
            </DialogDescription>
            </DialogHeader>
            <PostForm onSubmit={handleEditPost} isSubmitting={isSubmitting} buttonText="Save Changes" />
        </DialogContent>
    </Dialog>

    <AlertDialog open={!!deletingUpdate} onOpenChange={(isOpen) => !isOpen && setDeletingUpdate(null)}>
        <AlertDialogContent>
            <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the post titled "<span className="font-semibold">{deletingUpdate?.title}</span>".
            </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeletePost} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                Delete
            </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
    </>
  );
}
