
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Bell, FileText, Megaphone, Calendar, Edit, Trash2 } from 'lucide-react';

const notifications = [
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
  return (
    <Card>
        <CardHeader>
          <CardTitle>Recent Updates</CardTitle>
          <CardDescription>A quick look at the latest platform announcements.</CardDescription>
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
  );
}
