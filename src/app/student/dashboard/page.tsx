'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Target, Award, Calendar as CalendarIcon, Bell, ArrowRight, PlayCircle, Clock, CheckCircle2, MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/auth-context";
import { getStudentProgressReports, getUpdates } from "@/app/actions";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

const activeCourses = [
  { title: "Algebra 101", instructor: "Manish Sharma", progress: 75, nextLesson: "Quadratic Equations", color: "bg-blue-500" },
  { title: "World History", instructor: "Vidhi Sharma", progress: 45, nextLesson: "Ancient Rome", color: "bg-orange-500" },
  { title: "Chemistry", instructor: "Amod Sharma", progress: 60, nextLesson: "Organic Bonds", color: "bg-green-500" },
];

const todaySchedule = [
  { time: "09:00 AM", subject: "Mathematics", room: "Room 102" },
  { time: "11:30 AM", subject: "History", room: "Virtual" },
  { time: "02:00 PM", subject: "Physics Lab", room: "Science Block" },
];

interface ProgressReport {
  id: string;
  month: string;
  report: string;
  createdAt: any;
}

interface Update {
  id: string;
  title: string;
  description: string;
  createdAt: string;
}

export default function StudentDashboard() {
  const { user } = useAuth();
  const [reports, setReports] = useState<ProgressReport[]>([]);
  const [announcements, setAnnouncements] = useState<Update[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      const fetchData = async () => {
        setLoading(true);
        const [reportsRes, updatesRes] = await Promise.all([
          getStudentProgressReports(user.uid),
          getUpdates(3)
        ]);
        
        if (reportsRes.success) setReports(reportsRes.data as ProgressReport[]);
        if (updatesRes.success) setAnnouncements(updatesRes.data as Update[]);
        setLoading(false);
      };
      fetchData();
    }
  }, [user]);
  
  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-8">
      {/* Personalized Welcome Header */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-card p-6 rounded-2xl border shadow-sm">
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-primary">
            Hello, {user?.name?.split(' ')[0] || 'Student'}! 👋
          </h1>
          <p className="text-muted-foreground text-sm font-medium">
            You have 3 classes today. Your overall progress is looking great!
          </p>
        </div>
        <div className="flex items-center gap-3">
            <div className="px-4 py-2 bg-primary/5 rounded-xl border border-primary/10 text-center min-w-[80px]">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Attendance</p>
                <p className="text-lg font-black text-primary">94%</p>
            </div>
            <div className="px-4 py-2 bg-orange-500/5 rounded-xl border border-orange-500/10 text-center min-w-[80px]">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Avg GPA</p>
                <p className="text-lg font-black text-orange-600">3.8</p>
            </div>
            <div className="px-4 py-2 bg-green-500/5 rounded-xl border border-green-500/10 text-center min-w-[80px]">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Points</p>
                <p className="text-lg font-black text-green-600">1,250</p>
            </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Content: Active Courses */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" />
                Active Courses
            </h2>
            <Button variant="link" size="sm" asChild className="text-primary font-bold">
                <Link href="/student/courses">View All <ArrowRight className="ml-1 w-4 h-4" /></Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeCourses.map((course, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-md transition-all group border-muted-foreground/10">
                <CardContent className="p-0">
                  <div className={cn("h-2", course.color)} />
                  <div className="p-5 space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-lg leading-tight">{course.title}</h3>
                        <p className="text-xs text-muted-foreground">Instructor: {course.instructor}</p>
                      </div>
                      <Badge variant="secondary" className="bg-primary/5 text-primary border-none text-[10px] font-bold">LATEST</Badge>
                    </div>
                    
                    <div className="space-y-2">
                        <div className="flex justify-between text-[10px] font-black uppercase tracking-wider text-muted-foreground">
                            <span>Course Progress</span>
                            <span>{course.progress}%</span>
                        </div>
                        <Progress value={course.progress} className="h-1.5" />
                    </div>

                    <div className="bg-muted/30 p-3 rounded-lg flex items-center justify-between group-hover:bg-muted/50 transition-colors">
                        <div className="flex items-center gap-3">
                            <PlayCircle className="w-5 h-5 text-primary" />
                            <div className="text-xs">
                                <p className="text-muted-foreground font-medium">Next: {course.nextLesson}</p>
                            </div>
                        </div>
                        <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full">
                            <ArrowRight className="w-4 h-4" />
                        </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Progress Reports Section */}
          <div className="space-y-4 pt-4">
            <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                Performance Feedback
            </h2>
            <Card className="border-muted-foreground/10">
                <CardContent className="p-0">
                    {reports.length > 0 ? (
                        <Accordion type="single" collapsible className="w-full">
                        {reports.map((report) => (
                            <AccordionItem value={report.id} key={report.id} className="px-4 border-b last:border-0">
                            <AccordionTrigger className="hover:no-underline py-4">
                                <div className="flex items-center gap-3 text-left">
                                    <div className="bg-primary/10 p-2 rounded-lg">
                                        <CalendarIcon className="h-4 w-4 text-primary" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm">Monthly Report - {report.month}</p>
                                        <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">Teacher Assessment</p>
                                    </div>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="pb-4 pt-0 text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap pl-11">
                                {report.report}
                            </AccordionContent>
                            </AccordionItem>
                        ))}
                        </Accordion>
                    ) : (
                        <div className="p-8 text-center space-y-2">
                            <div className="bg-muted w-12 h-12 rounded-full flex items-center justify-center mx-auto">
                                <Clock className="w-6 h-6 text-muted-foreground/40" />
                            </div>
                            <p className="text-sm font-medium text-muted-foreground">No reports available for this period.</p>
                        </div>
                    )}
                </CardContent>
            </Card>
          </div>
        </div>

        {/* Sidebar: Schedule & Notifications */}
        <aside className="lg:col-span-4 space-y-6">
          {/* Today's Schedule */}
          <Card className="border-muted-foreground/10 shadow-sm">
            <CardHeader className="pb-3 border-b">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Clock className="w-4 h-4 text-orange-500" />
                Today's Schedule
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {todaySchedule.map((item, i) => (
                  <div key={i} className="p-4 flex items-start gap-4 hover:bg-muted/20 transition-colors">
                    <div className="text-center min-w-[65px] pt-0.5">
                        <p className="text-xs font-black text-primary leading-none">{item.time.split(' ')[0]}</p>
                        <p className="text-[9px] font-bold text-muted-foreground uppercase">{item.time.split(' ')[1]}</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-sm font-bold text-foreground leading-none">{item.subject}</p>
                        <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                            <MapPin className="w-3 h-3" /> {item.room}
                        </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Notice Board / Announcements */}
          <Card className="border-muted-foreground/10 shadow-sm">
            <CardHeader className="pb-3 border-b">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Bell className="w-4 h-4 text-blue-500" />
                Notice Board
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              {announcements.length > 0 ? announcements.map((item) => (
                <div key={item.id} className="space-y-1 group">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold group-hover:text-primary transition-colors line-clamp-1">{item.title}</h4>
                    <span className="text-[9px] text-muted-foreground font-medium shrink-0">
                        {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground line-clamp-2 leading-snug">{item.description}</p>
                </div>
              )) : (
                <p className="text-xs text-center text-muted-foreground py-4 italic">No new announcements today.</p>
              )}
              <Button variant="outline" size="sm" asChild className="w-full h-8 text-[10px] font-bold rounded-lg mt-2">
                <Link href="/notifications">VIEW ALL NOTICES</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Quick Stats / Achievements Summary */}
          <Card className="bg-primary text-primary-foreground overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
                <Award className="w-24 h-24 rotate-12" />
            </div>
            <CardContent className="p-6 space-y-4 relative z-10">
                <div className="space-y-1">
                    <h3 className="text-lg font-black">Level Up!</h3>
                    <p className="text-xs text-primary-foreground/70">Complete 2 more assignments to reach Bronze tier.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex -space-x-2">
                        {[1,2,3].map(i => (
                            <div key={i} className="w-8 h-8 rounded-full border-2 border-primary bg-white/20 flex items-center justify-center">
                                <CheckCircle2 className="w-4 h-4 text-white" />
                            </div>
                        ))}
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest">3 New Badges</span>
                </div>
                <Button variant="secondary" size="sm" asChild className="w-full font-bold h-9">
                    <Link href="/student/achievements">My Achievements</Link>
                </Button>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}
