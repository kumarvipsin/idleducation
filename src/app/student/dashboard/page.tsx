'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Target, Award, Calendar as CalendarIcon, Bell, ArrowRight, PlayCircle, Clock, CheckCircle2, MapPin, ShoppingBag, Book, Sparkles, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/auth-context";
import { getStudentProgressReports, getUpdates, getStudentEnrolledCourses, getStudentOrders } from "@/app/actions";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow, format } from "date-fns";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { GcsImage } from "@/components/gcs-image";

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

interface EnrolledCourse {
    id: string;
    title: string;
    subject: string;
    coverImageUrl?: string;
    batchName: string;
}

interface OrderItem {
    id: string;
    title: string;
    price: number;
    quantity: number;
}

interface StoreOrder {
    id: string;
    orderId: string;
    items: OrderItem[];
    totalAmount: number;
    createdAt: string;
    status: string;
}

export default function StudentDashboard() {
  const { user } = useAuth();
  const [reports, setReports] = useState<ProgressReport[]>([]);
  const [announcements, setAnnouncements] = useState<Update[]>([]);
  const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>([]);
  const [orders, setOrders] = useState<StoreOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      const fetchData = async () => {
        setLoading(true);
        const [reportsRes, updatesRes, coursesRes, ordersRes] = await Promise.all([
          getStudentProgressReports(user.uid),
          getUpdates(3),
          getStudentEnrolledCourses(user.uid),
          getStudentOrders(user.uid)
        ]);
        
        if (reportsRes.success) setReports(reportsRes.data as ProgressReport[]);
        if (updatesRes.success) setAnnouncements(updatesRes.data as Update[]);
        if (coursesRes.success) setEnrolledCourses(coursesRes.data as any[]);
        if (ordersRes.success) setOrders(ordersRes.data as any[]);
        setLoading(false);
      };
      fetchData();
    }
  }, [user]);
  
  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      {/* Premium Hero Welcome Banner */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-900 via-primary to-slate-900 p-8 md:p-10 rounded-[2rem] border shadow-2xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-accent/20 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/90 text-[10px] font-bold uppercase tracking-[0.2em]">
              <Sparkles className="w-3 h-3 text-yellow-400" />
              Academic Workspace
            </div>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white">
              Welcome back, <span className="text-yellow-400">{user?.name?.split(' ')[0] || 'Student'}</span>! 🎓
            </h1>
            <p className="text-white/70 text-sm md:text-base font-medium max-w-xl">
              {enrolledCourses.length > 0 
                  ? `Keep going! You have ${enrolledCourses.length} active courses to master today.` 
                  : "Start your success journey by exploring our premium curricula."}
            </p>
          </div>
          
          <div className="grid grid-cols-3 gap-3 md:gap-4 shrink-0">
              <div className="flex flex-col items-center justify-center p-4 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/10 shadow-lg min-w-[90px] md:min-w-[110px]">
                  <p className="text-[9px] font-black text-white/60 uppercase tracking-widest mb-1">Attendance</p>
                  <p className="text-xl md:text-2xl font-black text-white">94%</p>
              </div>
              <div className="flex flex-col items-center justify-center p-4 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/10 shadow-lg min-w-[90px] md:min-w-[110px]">
                  <p className="text-[9px] font-black text-white/60 uppercase tracking-widest mb-1">GPA</p>
                  <p className="text-xl md:text-2xl font-black text-yellow-400">3.8</p>
              </div>
              <div className="flex flex-col items-center justify-center p-4 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/10 shadow-lg min-w-[90px] md:min-w-[110px]">
                  <p className="text-[9px] font-black text-white/60 uppercase tracking-widest mb-1">Credits</p>
                  <p className="text-xl md:text-2xl font-black text-green-400">1.2k</p>
              </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-8 space-y-10">
          
          {/* Active Courses Section */}
          <section className="space-y-6">
            <div className="flex items-center justify-between border-l-4 border-primary pl-4">
                <div>
                    <h2 className="text-2xl font-black tracking-tight text-foreground">Active Learning</h2>
                    <p className="text-xs text-muted-foreground font-medium">Continue where you left off</p>
                </div>
                <Button variant="outline" size="sm" asChild className="rounded-full font-bold text-[10px] uppercase tracking-widest hover:bg-primary hover:text-white transition-all">
                    <Link href="/paid-courses">Discover More</Link>
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {loading ? (
                    [...Array(2)].map((_, i) => <Skeleton key={i} className="h-56 w-full rounded-3xl" />)
                ) : enrolledCourses.length > 0 ? (
                    enrolledCourses.map((course) => (
                        <Card key={course.id} className="overflow-hidden hover:shadow-2xl transition-all duration-500 group border-muted-foreground/10 flex flex-col bg-white dark:bg-card rounded-[1.5rem]">
                            <div className="relative h-32 w-full bg-muted overflow-hidden">
                                {course.coverImageUrl ? (
                                    <GcsImage filePath={course.coverImageUrl} alt={course.title} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                                ) : (
                                    <div className="w-full h-full bg-indigo-500/10 flex items-center justify-center text-indigo-500/20">
                                        <BookOpen className="w-12 h-12" />
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60"></div>
                                <Badge className="absolute top-3 left-3 bg-primary/90 text-white border-none font-black text-[9px] uppercase tracking-widest px-3 py-1 rounded-full shadow-xl">STUDYING</Badge>
                            </div>
                            <CardContent className="p-6 flex-grow flex flex-col justify-between space-y-4">
                                <div>
                                    <h3 className="font-black text-lg leading-tight group-hover:text-primary transition-colors line-clamp-2">{course.title}</h3>
                                    <p className="text-[10px] text-muted-foreground mt-2 uppercase tracking-[0.15em] font-black">{course.batchName}</p>
                                </div>
                                <Button asChild className="w-full font-black text-[10px] tracking-widest uppercase rounded-xl shadow-lg shadow-primary/20 group/btn h-11">
                                    <Link href="/paid-courses">
                                        <PlayCircle className="w-4 h-4 mr-2 transition-transform group-hover/btn:scale-110" />
                                        Resume Course
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <Card className="col-span-full border-2 border-dashed p-12 flex flex-col items-center justify-center text-center bg-muted/5 rounded-[2rem]">
                        <div className="bg-primary/5 p-8 rounded-full mb-6 border border-primary/10">
                            <BookOpen className="w-16 h-16 text-primary/20" />
                        </div>
                        <h3 className="text-2xl font-black text-foreground">No active courses yet</h3>
                        <p className="text-muted-foreground max-w-sm mx-auto mt-3 mb-8 font-medium">
                            Enroll in a premium curriculum to unlock your full academic potential and start learning.
                        </p>
                        <Button asChild size="lg" className="rounded-full px-10 font-black tracking-widest text-[11px] uppercase shadow-xl shadow-primary/20">
                            <Link href="/paid-courses">Explore Premium Library</Link>
                        </Button>
                    </Card>
                )}
            </div>
          </section>

          {/* Library Section */}
          <section className="space-y-6">
            <div className="flex items-center gap-2 border-l-4 border-orange-500 pl-4">
                <h2 className="text-2xl font-black tracking-tight text-foreground">
                    Your Library
                </h2>
                <Badge variant="secondary" className="bg-orange-100 text-orange-600 border-none font-bold text-[10px]">RESOURCES</Badge>
            </div>
            <Card className="rounded-[1.5rem] border-muted-foreground/10 bg-gradient-to-br from-white to-slate-50 dark:from-card dark:to-slate-900/50 shadow-sm">
                <CardContent className="p-6">
                    {loading ? (
                        <div className="space-y-4">
                            <Skeleton className="h-16 w-full rounded-2xl" />
                            <Skeleton className="h-16 w-full rounded-2xl" />
                        </div>
                    ) : orders.length > 0 ? (
                        <div className="space-y-4">
                            {orders.slice(0, 3).map((order) => (
                                <div key={order.id} className="flex items-center justify-between p-4 bg-white dark:bg-card/80 backdrop-blur-sm rounded-2xl border border-muted-foreground/10 shadow-sm hover:shadow-md transition-all group cursor-pointer">
                                    <div className="flex items-center gap-4">
                                        <div className="bg-orange-500/10 p-3 rounded-xl border border-orange-500/10 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                                            <Book className="w-5 h-5 text-orange-600 group-hover:text-inherit" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-black leading-tight line-clamp-1 group-hover:text-primary transition-colors">
                                                {order.items.map(i => i.title).join(", ")}
                                            </p>
                                            <p className="text-[10px] text-muted-foreground font-bold mt-1 uppercase tracking-tighter">
                                                ORDER #{order.orderId} • {format(new Date(order.createdAt), 'MMM d, yyyy')}
                                            </p>
                                        </div>
                                    </div>
                                    <Badge variant="outline" className={cn(
                                        "text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-lg h-auto border-none",
                                        order.status === 'delivered' ? "bg-green-100 text-green-600" : "bg-blue-100 text-blue-600"
                                    )}>
                                        {order.status}
                                    </Badge>
                                </div>
                            ))}
                            <Button variant="ghost" size="sm" asChild className="w-full text-[10px] font-black tracking-[0.2em] text-primary/60 hover:text-primary hover:bg-primary/5 uppercase">
                                <Link href="/store/orders">View complete order history ({orders.length})</Link>
                            </Button>
                        </div>
                    ) : (
                        <div className="text-center py-10 space-y-4">
                            <div className="w-16 h-16 bg-orange-500/5 rounded-full flex items-center justify-center mx-auto border border-orange-500/10">
                                <ShoppingBag className="w-8 h-8 text-orange-500/30" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-muted-foreground/80 italic">No textbooks or materials purchased yet.</p>
                                <Button variant="link" size="sm" asChild className="text-primary text-[11px] font-black tracking-widest uppercase mt-2">
                                    <Link href="/store">Visit the IDL Store <ArrowRight className="ml-1 w-3 h-3"/></Link>
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
          </section>

          {/* Progress Reports Section */}
          <section className="space-y-6">
            <div className="flex items-center gap-2 border-l-4 border-green-500 pl-4">
                <h2 className="text-2xl font-black tracking-tight text-foreground">Performance</h2>
                <Badge variant="secondary" className="bg-green-100 text-green-600 border-none font-bold text-[10px]">ANALYSIS</Badge>
            </div>
            <Card className="rounded-[1.5rem] border-muted-foreground/10 overflow-hidden bg-white shadow-sm">
                <CardContent className="p-0">
                    {reports.length > 0 ? (
                        <Accordion type="single" collapsible className="w-full">
                        {reports.map((report) => (
                            <AccordionItem value={report.id} key={report.id} className="px-6 border-b last:border-0 hover:bg-slate-50 transition-colors">
                            <AccordionTrigger className="hover:no-underline py-6">
                                <div className="flex items-center gap-4 text-left">
                                    <div className="bg-green-500/10 p-3 rounded-xl border border-green-500/10">
                                        <CalendarIcon className="h-5 w-5 text-green-600" />
                                    </div>
                                    <div>
                                        <p className="font-black text-base text-foreground tracking-tight">{report.month} Assessment</p>
                                        <p className="text-[10px] text-muted-foreground uppercase font-black tracking-[0.15em] mt-0.5">Faculty Evaluation Report</p>
                                    </div>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="pb-6 pt-0 text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap pl-16 max-w-2xl font-medium">
                                {report.report}
                            </AccordionContent>
                            </AccordionItem>
                        ))}
                        </Accordion>
                    ) : (
                        <div className="p-16 text-center space-y-4">
                            <div className="bg-muted w-20 h-20 rounded-3xl flex items-center justify-center mx-auto transform rotate-12 border border-muted-foreground/5">
                                <Clock className="w-10 h-10 text-muted-foreground/30" />
                            </div>
                            <p className="text-sm font-bold text-muted-foreground/60 tracking-tight">No evaluation reports available for this cycle.</p>
                        </div>
                    )}
                </CardContent>
            </Card>
          </section>
        </div>

        {/* Sidebar Info Panels */}
        <aside className="lg:col-span-4 space-y-8">
          
          {/* Schedule Sidebar */}
          <Card className="border-muted-foreground/10 shadow-xl rounded-[2rem] overflow-hidden bg-white">
            <CardHeader className="pb-4 border-b bg-slate-50">
              <CardTitle className="text-lg font-black flex items-center gap-3 text-primary">
                <div className="p-2 bg-primary/10 rounded-lg">
                    <Clock className="w-5 h-5 text-primary" />
                </div>
                Today's Timeline
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-50">
                {todaySchedule.map((item, i) => (
                  <div key={i} className="p-5 flex items-start gap-5 hover:bg-primary/[0.02] transition-all group">
                    <div className="text-center min-w-[75px] pt-1">
                        <p className="text-sm font-black text-primary leading-none group-hover:scale-110 transition-transform">{item.time.split(' ')[0]}</p>
                        <p className="text-[10px] font-black text-muted-foreground uppercase mt-1 tracking-tighter">{item.time.split(' ')[1]}</p>
                    </div>
                    <div className="space-y-1.5">
                        <p className="text-base font-black text-foreground leading-none tracking-tight">{item.subject}</p>
                        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-100 w-fit">
                            <MapPin className="w-3 h-3 text-primary/60" />
                            <span className="text-[10px] font-bold text-muted-foreground uppercase">{item.room}</span>
                        </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Announcements Sidebar */}
          <Card className="border-muted-foreground/10 shadow-xl rounded-[2rem] overflow-hidden bg-white">
            <CardHeader className="pb-4 border-b bg-amber-50">
              <CardTitle className="text-lg font-black flex items-center gap-3 text-amber-700">
                <div className="p-2 bg-amber-500/10 rounded-lg">
                    <Bell className="w-5 h-5 text-amber-600" />
                </div>
                Notice Board
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {announcements.length > 0 ? announcements.map((item) => (
                <div key={item.id} className="space-y-2 group border-b border-slate-50 last:border-0 pb-4 last:pb-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-black group-hover:text-primary transition-colors line-clamp-1 tracking-tight">{item.title}</h4>
                    <span className="text-[9px] font-black text-primary/40 uppercase tracking-widest shrink-0 bg-primary/5 px-2 py-0.5 rounded-md">
                        {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed font-medium">{item.description}</p>
                </div>
              )) : (
                <div className="text-center py-6">
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest italic">No urgent updates</p>
                </div>
              )}
              <Button variant="outline" size="sm" asChild className="w-full h-10 text-[10px] font-black tracking-[0.2em] uppercase rounded-xl border-slate-200 hover:border-primary transition-all mt-2">
                <Link href="/notifications">Access All Archives</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Status Quick Summary Card */}
          <Card className="bg-gradient-to-br from-indigo-600 to-indigo-800 text-white rounded-[2rem] shadow-2xl overflow-hidden border-none group">
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform duration-700">
                <Zap className="w-32 h-32 rotate-12 fill-white" />
            </div>
            <CardContent className="p-8 space-y-6 relative z-10">
                <div className="space-y-2">
                    <h3 className="text-xl font-black tracking-tight">Status: Prime</h3>
                    <p className="text-xs text-indigo-100/80 leading-relaxed font-medium">Your academic trajectory is impressive. Maintain consistency to unlock the "Excellence" tier badge next month!</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex -space-x-3">
                        {[1,2,3].map(i => (
                            <div key={i} className="w-10 h-10 rounded-full border-4 border-indigo-700 bg-white/20 backdrop-blur-md flex items-center justify-center shadow-lg transform hover:-translate-y-1 transition-transform">
                                <CheckCircle2 className="w-5 h-5 text-white" />
                            </div>
                        ))}
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-200">Consistency</span>
                        <span className="text-sm font-black">ON TRACK</span>
                    </div>
                </div>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}
