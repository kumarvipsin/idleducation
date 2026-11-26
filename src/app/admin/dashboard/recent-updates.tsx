
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
import { ScrollArea } from '@/components/ui/scroll-area';

interface Update {
  id: string;
  title: string;
  description: string;
  createdAt: string;
}

const iconMap: { [key: string]: React.ReactNode } = {
    "New Course Announcement!": <Megaphone className="w-5 h-5 text-primary" />,
    "Algebra 101 Materials Updated": <FileText className="w-5 h-5 text-primary" />,
    "Upcoming Webinar": <Calendar className="w-5 h-5 text-primary" />,
    default: <Bell className="w-5 h-5 text-primary" />,
};

const getIconForTitle = (title: string) => {
    return iconMap[title] || iconMap.default;
};

const AddPostForm = ({ onPostAdded }: { onPostAdded: () => void }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleAddPost = async () => {
    if (title && description) {
      setIsSubmitting(true);
      const result = await addUpdate({ title, description });
      if (result.success) {
        toast({ title: "Success", description: "Update posted successfully!" });
        onPostAdded();
      } else {
        toast({ variant: "destructive", title: "Error", description: result.message });
      }
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label
            htmlFor="add-title"
            className="text-right text-[13px] font-bold tracking-[0.005em] text-[#173568] dark:text-slate-200"
          >
            Title
          </Label>
          <Input
            id="add-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="col-span-3 text-[13px] font-medium"
            placeholder="e.g., New Course Available"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label
            htmlFor="add-description"
            className="text-right text-[13px] font-bold tracking-[0.005em] text-[#173568] dark:text-slate-200"
          >
            Description
          </Label>
          <Textarea
            id="add-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="col-span-3 text-[13px] font-medium"
            placeholder="Enter the details of the announcement."
          />
        </div>
      </div>
      <DialogFooter>
        <Button
          onClick={handleAddPost}
          disabled={isSubmitting}
          className="text-xs font-bold tracking-[0.01em]"
        >
          {isSubmitting ? 'Posting...' : 'Post Update'}
        </Button>
      </DialogFooter>
    </>
  );
};

const EditPostForm = ({ update, onPostEdited }: { update: Update, onPostEdited: () => void }) => {
  const [title, setTitle] = useState(update.title);
  const [description, setDescription] = useState(update.description);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleEditPost = async () => {
    if (title && description) {
      setIsSubmitting(true);
      const result = await editUpdate(update.id, { title, description });
       if (result.success) {
        toast({ title: "Success", description: "Update edited successfully!" });
        onPostEdited();
      } else {
        toast({ variant: "destructive", title: "Error", description: result.message });
      }
      setIsSubmitting(false);
    }
  }

  return (
     <>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label
            htmlFor={`edit-title-${update.id}`}
            className="text-right text-[13px] font-bold tracking-[0.005em] text-[#173568] dark:text-slate-200"
          >
            Title
          </Label>
          <Input
            id={`edit-title-${update.id}`}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="col-span-3 text-[13px] font-medium"
            placeholder="e.g., New Course Available"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label
            htmlFor={`edit-description-${update.id}`}
            className="text-right text-[13px] font-bold tracking-[0.005em] text-[#173568] dark:text-slate-200"
          >
            Description
          </Label>
          <Textarea
            id={`edit-description-${update.id}`}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="col-span-3 text-[13px] font-medium"
            placeholder="Enter the details of the announcement."
          />
        </div>
      </div>
      <DialogFooter>
        <Button
          onClick={handleEditPost}
          disabled={isSubmitting}
          className="text-xs font-bold tracking-[0.01em]"
        >
          {isSubmitting ? 'Saving...' : 'Save Changes'}
        </Button>
      </DialogFooter>
    </>
  )
}

export function RecentUpdates() {
  const [updates, setUpdates] = useState<Update[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingUpdate, setEditingUpdate] = useState<Update | null>(null);
  const [deletingUpdate, setDeletingUpdate] = useState<Update | null>(null);
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
  
  const handlePostAdded = () => {
    setIsAddDialogOpen(false);
    fetchUpdates();
  }

  const handlePostEdited = () => {
    setEditingUpdate(null);
    fetchUpdates();
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

  const renderSkeleton = () => (
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="flex items-start gap-4">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-full" />
          </div>
        </div>
      ))}
    </div>
  );

  const sectionTitleStyle = { wordSpacing: '0.03em' };
  const sectionTitleClass =
    'text-[18px] sm:text-[19px] font-extrabold tracking-[-0.015em] leading-snug text-[#173568] dark:text-slate-100';
  const sectionDescClass =
    'text-[12.5px] sm:text-[13px] font-medium tracking-[0.005em] leading-snug text-[#475E82] dark:text-slate-400';

  return (
    <AlertDialog>
      <Card className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 antialiased">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle style={sectionTitleStyle} className={sectionTitleClass}>
              Recent Updates
            </CardTitle>
            <CardDescription className={sectionDescClass}>
              Latest platform announcements.
            </CardDescription>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="text-xs font-bold tracking-[0.01em]">
                <PlusCircle className="mr-2 h-4 w-4" />
                New Post
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] antialiased">
                <DialogHeader>
                <DialogTitle
                  style={sectionTitleStyle}
                  className="text-[17px] font-extrabold tracking-[-0.015em] text-[#173568] dark:text-slate-100"
                >
                  Create New Post
                </DialogTitle>
                <DialogDescription className={sectionDescClass}>
                    Add a new update or announcement for all users to see.
                </DialogDescription>
                </DialogHeader>
                <AddPostForm onPostAdded={handlePostAdded} />
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[300px] w-full pr-4">
            {loading ? (
              renderSkeleton()
            ) : (
              <div className="space-y-4">
                {updates.length > 0 ? (
                  updates.map((update) => (
                    <div key={update.id} className="flex items-start gap-3">
                        <div className="bg-primary/10 p-2 rounded-full mt-1">
                          {getIconForTitle(update.title)}
                      </div>
                      <div className="flex-1">
                        <h3
                          style={sectionTitleStyle}
                          className="text-[13.5px] sm:text-[14px] font-bold tracking-[0.005em] leading-snug text-[#173568] dark:text-slate-100"
                        >
                          {update.title}
                        </h3>
                        <p className="mt-0.5 text-[12.5px] font-medium leading-relaxed text-[#334E75] dark:text-slate-300">
                          {update.description}
                        </p>
                        <p className="mt-1 text-[11.5px] font-semibold tracking-[0.005em] leading-none text-[#2864E8]/85 dark:text-blue-300">
                          {formatDistanceToNow(new Date(update.createdAt), { addSuffix: true })}
                        </p>
                      </div>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <Dialog>
                            <DialogTrigger asChild>
                               <DropdownMenuItem
                                  className="text-xs font-semibold"
                                  onSelect={(e) => e.preventDefault()}
                                  onClick={() => setEditingUpdate(update)}
                                >
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit
                                </DropdownMenuItem>
                            </DialogTrigger>
                             {editingUpdate && editingUpdate.id === update.id && (
                               <DialogContent className="sm:max-w-[425px] antialiased">
                                  <DialogHeader>
                                    <DialogTitle
                                      style={sectionTitleStyle}
                                      className="text-[17px] font-extrabold tracking-[-0.015em] text-[#173568] dark:text-slate-100"
                                    >
                                      Edit Post
                                    </DialogTitle>
                                    <DialogDescription className={sectionDescClass}>
                                      Make changes to your post here. Click save when you're done.
                                    </DialogDescription>
                                  </DialogHeader>
                                  <EditPostForm update={editingUpdate} onPostEdited={handlePostEdited} />
                                </DialogContent>
                            )}
                          </Dialog>
                          <AlertDialogTrigger asChild>
                            <DropdownMenuItem
                              className="text-xs font-semibold"
                              onSelect={(e) => e.preventDefault()}
                              onClick={() => setDeletingUpdate(update)}
                            >
                              <Trash2 className="mr-2 h-4 w-4 text-destructive" />
                              <span className="text-destructive">Delete</span>
                            </DropdownMenuItem>
                          </AlertDialogTrigger>
                        </DropdownMenuContent>
                      </DropdownMenu>

                    </div>
                  ))
                ) : (
                  <p className="py-12 text-center text-[13px] font-semibold tracking-[0.005em] text-[#475E82] dark:text-slate-400">
                    No recent updates.
                  </p>
                )}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>

      <AlertDialogContent className="antialiased">
          <AlertDialogHeader>
          <AlertDialogTitle
            style={sectionTitleStyle}
            className="text-[17px] font-extrabold tracking-[-0.015em] text-[#173568] dark:text-slate-100"
          >
            Are you absolutely sure?
          </AlertDialogTitle>
          <AlertDialogDescription className={sectionDescClass}>
              This action cannot be undone. This will permanently delete the post titled &ldquo;<span className="font-bold text-[#0B224D] dark:text-white">{deletingUpdate?.title}</span>&rdquo;.
          </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
          <AlertDialogCancel
            className="text-xs font-bold tracking-[0.01em]"
            onClick={() => setDeletingUpdate(null)}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDeletePost}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90 text-xs font-bold tracking-[0.01em]"
          >
              Delete
          </AlertDialogAction>
          </AlertDialogFooter>
      </AlertDialogContent>

    </AlertDialog>
  );
}
