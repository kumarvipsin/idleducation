
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Bell, FileText, Megaphone, Calendar, PlusCircle } from 'lucide-react';
import { addUpdate, getUpdates } from '@/app/actions';
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
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
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

  const handleAddPost = async () => {
    if (newTitle && newDescription) {
      setIsSubmitting(true);
      const result = await addUpdate({ title: newTitle, description: newDescription });
      if (result.success) {
        toast({ title: "Success", description: "Update posted successfully!" });
        setNewTitle('');
        setNewDescription('');
        setIsDialogOpen(false);
        fetchUpdates(); // Re-fetch updates to show the new one
      } else {
        toast({ variant: "destructive", title: "Error", description: result.message });
      }
      setIsSubmitting(false);
    }
  };

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

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Updates</CardTitle>
            <CardDescription>A quick look at the latest platform announcements.</CardDescription>
          </div>
          <DialogTrigger asChild>
            <Button size="sm">
              <PlusCircle className="mr-2 h-4 w-4" />
              New Post
            </Button>
          </DialogTrigger>
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
                    <div className="text-xs text-muted-foreground whitespace-nowrap">
                      {formatDistanceToNow(new Date(update.createdAt), { addSuffix: true })}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-muted-foreground">No recent updates.</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Post</DialogTitle>
          <DialogDescription>
            Add a new update or announcement for all users to see.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Title
            </Label>
            <Input
              id="title"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
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
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              className="col-span-3"
              placeholder="Enter the details of the announcement."
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleAddPost} disabled={isSubmitting}>
            {isSubmitting ? 'Posting...' : 'Post Update'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
