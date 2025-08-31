
'use client';

import { useState } from 'react';
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
import { Bell, FileText, Megaphone, Calendar, Edit, Trash2, PlusCircle } from 'lucide-react';

const initialNotifications = [
  {
    icon: <Megaphone className="w-6 h-6 text-primary" />,
    title: "New Course Announcement!",
    description: "We're excited to launch 'Introduction to Python Programming' starting next month. Enroll now to get an early bird discount.",
    date: "2 hours ago",
  },
  {
    icon: <FileText className="w-6 h-6 text-primary" />,
    title: "Algebra 101 Materials Updated",
    description: "New practice worksheets and an interactive quiz have been added to the 'Introduction to Algebra' course.",
    date: "1 day ago",
  },
  {
    icon: <Calendar className="w-6 h-6 text-primary" />,
    title: "Upcoming Webinar",
    description: "Join our free webinar on 'Effective Study Techniques for Exams' this Friday at 4 PM. Don't miss out!",
    date: "3 days ago",
  },
];

export function RecentUpdates() {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');

  const handleAddPost = () => {
    if (newTitle && newDescription) {
      const newNotification = {
        icon: <Bell className="w-6 h-6 text-primary" />,
        title: newTitle,
        description: newDescription,
        date: 'Just now',
      };
      setNotifications([newNotification, ...notifications]);
      setNewTitle('');
      setNewDescription('');
      setIsDialogOpen(false);
    }
  };

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
          <div className="space-y-6">
            {notifications.map((notification, index) => (
              <div key={index} className="flex items-start gap-4">
                 <div className="bg-primary/10 p-3 rounded-full">
                    {notification.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{notification.title}</h3>
                  <p className="text-xs text-muted-foreground">{notification.description}</p>
                </div>
                <div className="text-xs text-muted-foreground whitespace-nowrap">
                  {notification.date}
                </div>
              </div>
            ))}
          </div>
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
          <Button onClick={handleAddPost}>Post Update</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
