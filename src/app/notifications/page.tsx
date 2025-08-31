import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, FileText, Megaphone, Calendar } from "lucide-react";

const notifications = [
  {
    icon: <Megaphone className="w-6 h-6 text-white" />,
    title: "New Course Announcement!",
    description: "We're excited to launch 'Introduction to Python Programming' starting next month. Enroll now to get an early bird discount.",
    date: "2 hours ago",
  },
  {
    icon: <FileText className="w-6 h-6 text-white" />,
    title: "Algebra 101 Materials Updated",
    description: "New practice worksheets and an interactive quiz have been added to the 'Introduction to Algebra' course.",
    date: "1 day ago",
  },
  {
    icon: <Calendar className="w-6 h-6 text-white" />,
    title: "Upcoming Webinar",
    description: "Join our free webinar on 'Effective Study Techniques for Exams' this Friday at 4 PM. Don't miss out!",
    date: "3 days ago",
  },
  {
    icon: <Bell className="w-6 h-6 text-white" />,
    title: "Welcome to IDL EDUCATION!",
    description: "We're glad to have you here. Explore our courses and start your learning journey today.",
    date: "1 week ago",
  },
];

export default function NotificationsPage() {
  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <Card className="max-w-4xl mx-auto" style={{ backgroundColor: '#191970' }}>
        <CardHeader>
          <CardTitle className="text-white">Recent Updates</CardTitle>
          <CardDescription className="text-gray-300">Here's what's new.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {notifications.map((notification, index) => (
              <div key={index} className="flex items-start gap-4 p-4 rounded-lg border border-gray-700 bg-white/5 hover:bg-white/10 transition-colors">
                <div className="bg-white/10 p-3 rounded-full">
                    {notification.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-white">{notification.title}</h3>
                  <p className="text-sm text-gray-300">{notification.description}</p>
                </div>
                <div className="text-xs text-gray-400 whitespace-nowrap">
                  {notification.date}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
