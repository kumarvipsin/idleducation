'use client';

import { useState } from "react";
import { 
  Users, BookOpen, Video, FileText, Upload, Plus, 
  Calendar, Clock, CheckCircle2, AlertCircle, ArrowUpRight, 
  Search, Filter, Sparkles, MessageSquare, Play, 
  ExternalLink, MoreVertical, Send, ShieldCheck, Download
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/context/auth-context";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function TeacherDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();

  // Modals state
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isLiveClassModalOpen, setIsLiveClassModalOpen] = useState(false);
  const [isNoticeModalOpen, setIsNoticeModalOpen] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState<string>("All Batches");

  // Form states
  const [materialTitle, setMaterialTitle] = useState("");
  const [materialBatch, setMaterialBatch] = useState("UPSC GS Foundation (Batch A)");
  const [materialType, setMaterialType] = useState("PDF Notes");
  const [noticeText, setNoticeText] = useState("");

  // Live classes schedule
  const todayClasses = [
    {
      id: "live-1",
      title: "Indian Polity & Governance: Fundamental Rights",
      batch: "UPSC GS Foundation (Batch A)",
      time: "04:00 PM - 05:30 PM",
      studentsCount: 48,
      status: "Starting Soon",
      isLive: true,
      roomLink: "https://meet.google.com/idl-upsc-polity",
    },
    {
      id: "live-2",
      title: "Modern Indian History: 1857 Revolt to Independence",
      batch: "BPSC Prelims Special",
      time: "06:30 PM - 08:00 PM",
      studentsCount: 62,
      status: "Scheduled",
      isLive: false,
      roomLink: "https://meet.google.com/idl-bpsc-history",
    },
  ];

  // Active Batches
  const activeBatches = [
    {
      id: 1,
      name: "UPSC GS Foundation (Batch A)",
      subject: "General Studies & CSAT",
      students: 54,
      attendance: 92,
      progress: 68,
      nextSession: "Today, 4:00 PM",
      status: "Active",
    },
    {
      id: 2,
      name: "BPSC 70th CCE Target Batch",
      subject: "State History & Geography",
      students: 62,
      attendance: 88,
      progress: 45,
      nextSession: "Today, 6:30 PM",
      status: "Active",
    },
    {
      id: 3,
      name: "Ethics, Integrity & Aptitude (GS IV)",
      subject: "Case Studies & Ethics",
      students: 38,
      attendance: 95,
      progress: 82,
      nextSession: "Tomorrow, 11:00 AM",
      status: "Active",
    },
    {
      id: 4,
      name: "NCERT Comprehensive Foundation",
      subject: "Class 6-12 Core Subjects",
      students: 76,
      attendance: 85,
      progress: 30,
      nextSession: "Friday, 3:00 PM",
      status: "Active",
    },
  ];

  // Pending Submissions & Doubts
  const recentSubmissions = [
    {
      id: "sub-1",
      studentName: "Rahul Sharma",
      assignment: "Answer Writing: Article 21 & Judicial Review",
      batch: "UPSC Batch A",
      submittedAt: "25 mins ago",
      type: "Test Copy",
    },
    {
      id: "sub-2",
      studentName: "Pooja Verma",
      assignment: "Modern History Quiz 4",
      batch: "BPSC Target",
      submittedAt: "1 hour ago",
      type: "Assignment",
    },
    {
      id: "sub-3",
      studentName: "Aman Gupta",
      assignment: "Case Study on Administrative Ethics",
      batch: "GS IV Ethics",
      submittedAt: "3 hours ago",
      type: "Case Study",
    },
  ];

  // Doubts
  const recentDoubts = [
    {
      id: "d-1",
      student: "Sneha Patel",
      question: "Sir, what is the key difference between Writ of Prohibition and Certiorari?",
      topic: "Polity",
      time: "10 mins ago",
    },
    {
      id: "d-2",
      student: "Vikram Kumar",
      question: "Please clarify the Mahalwari vs Ryotwari land revenue system impact.",
      topic: "Modern History",
      time: "45 mins ago",
    },
  ];

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!materialTitle) {
      toast({ variant: "destructive", title: "Title required", description: "Please enter material title." });
      return;
    }
    toast({
      title: "Material Uploaded Successfully",
      description: `"${materialTitle}" is now available for ${materialBatch}.`,
    });
    setMaterialTitle("");
    setIsUploadModalOpen(false);
  };

  const handleNoticeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noticeText) {
      toast({ variant: "destructive", title: "Notice empty", description: "Please enter announcement text." });
      return;
    }
    toast({
      title: "Announcement Broadcasted",
      description: "Notice sent to all enrolled students.",
    });
    setNoticeText("");
    setIsNoticeModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* 1. Welcome & Quick Action Bar */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 md:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-primary uppercase tracking-wider bg-primary/10 px-2.5 py-0.5 rounded-md">
              Faculty Workspace
            </span>
            <span className="text-xs text-slate-400">
              {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 mt-1">
            Welcome back, {user?.name || 'Professor'}! 👋
          </h2>
          <p className="text-xs md:text-sm text-slate-500 mt-0.5">
            You have <strong className="text-slate-800">2 live classes</strong> scheduled today and <strong className="text-slate-800">3 test copies</strong> awaiting evaluation.
          </p>
        </div>

        {/* Quick Action CTAs */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <Button 
            onClick={() => setIsUploadModalOpen(true)}
            variant="outline" 
            className="h-9 text-xs font-bold border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg flex-1 md:flex-initial cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5 mr-1.5 text-primary" />
            Upload Notes
          </Button>

          <Button 
            onClick={() => setIsNoticeModalOpen(true)}
            variant="outline" 
            className="h-9 text-xs font-bold border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg flex-1 md:flex-initial cursor-pointer"
          >
            <Send className="w-3.5 h-3.5 mr-1.5 text-blue-600" />
            Post Notice
          </Button>

          <Link href="/teacher/classes" className="flex-1 md:flex-initial">
            <Button className="h-9 text-xs font-bold bg-primary hover:bg-primary/95 text-white rounded-lg shadow-none w-full cursor-pointer">
              <Video className="w-3.5 h-3.5 mr-1.5" />
              Live Classroom
            </Button>
          </Link>
        </div>
      </div>

      {/* 2. Key Performance Metrics (KPI Cards) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <Card className="border border-slate-200/80 bg-white rounded-xl shadow-none">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Students</p>
              <h3 className="text-xl md:text-2xl font-black text-slate-900 mt-0.5">230</h3>
              <p className="text-[10px] text-emerald-600 font-bold mt-1 flex items-center gap-0.5">
                <ArrowUpRight className="w-3 h-3" /> +12 this month
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200/80 bg-white rounded-xl shadow-none">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Active Batches</p>
              <h3 className="text-xl md:text-2xl font-black text-slate-900 mt-0.5">4</h3>
              <p className="text-[10px] text-slate-500 font-medium mt-1">
                4 Courses ongoing
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200/80 bg-white rounded-xl shadow-none">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Today's Lectures</p>
              <h3 className="text-xl md:text-2xl font-black text-slate-900 mt-0.5">2 Classes</h3>
              <p className="text-[10px] text-primary font-bold mt-1">
                Starts 4:00 PM
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Video className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200/80 bg-white rounded-xl shadow-none">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Copies to Grade</p>
              <h3 className="text-xl md:text-2xl font-black text-slate-900 mt-0.5">3 Pending</h3>
              <p className="text-[10px] text-amber-600 font-bold mt-1">
                Evaluation queue
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 3. Today's Live Class Schedule (Interactive Section) */}
      <Card className="border border-slate-200/80 bg-white rounded-2xl shadow-none overflow-hidden">
        <CardHeader className="p-5 border-b border-slate-100 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Video className="w-4 h-4 text-primary" />
              <span>Today's Live Class Schedule</span>
            </CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Interactive live lectures and doubt sessions scheduled for today.
            </CardDescription>
          </div>
          <Link href="/teacher/classes">
            <Button variant="ghost" size="sm" className="text-xs font-bold text-primary hover:bg-primary/5">
              Full Schedule <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent className="p-5 divide-y divide-slate-100">
          {todayClasses.map((item) => (
            <div key={item.id} className="py-3.5 first:pt-0 last:pb-0 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                  item.isLive ? 'bg-rose-100 text-rose-600 animate-pulse' : 'bg-slate-100 text-slate-600'
                }`}>
                  <Video className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="text-sm font-bold text-slate-900">{item.title}</h4>
                    {item.isLive ? (
                      <Badge className="bg-rose-600 text-white text-[10px] font-extrabold uppercase px-2 py-0.5 animate-pulse">
                        ● LIVE READY
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-slate-600 text-[10px] font-semibold">
                        {item.status}
                      </Badge>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1">
                    <span className="font-semibold text-primary">{item.batch}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-slate-400" /> {item.time}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5 text-slate-400" /> {item.studentsCount} Students</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto self-end md:self-center">
                <Button 
                  size="sm"
                  onClick={() => {
                    navigator.clipboard.writeText(item.roomLink);
                    toast({ title: "Link Copied!", description: "Live classroom link copied to clipboard." });
                  }}
                  variant="outline" 
                  className="h-8 text-xs font-semibold rounded-lg text-slate-600 border-slate-200 cursor-pointer"
                >
                  Copy Link
                </Button>
                <a href={item.roomLink} target="_blank" rel="noopener noreferrer">
                  <Button size="sm" className="h-8 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-none cursor-pointer">
                    <Play className="w-3 h-3 mr-1 fill-white" /> Start Class
                  </Button>
                </a>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* 4. Two Columns: Active Batches & Recent Submissions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Active Batches / Courses (2 Cols on LG) */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="border border-slate-200/80 bg-white rounded-2xl shadow-none">
            <CardHeader className="p-5 border-b border-slate-100 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-primary" />
                  <span>My Active Batches</span>
                </CardTitle>
                <CardDescription className="text-xs text-slate-500">
                  Track course syllabus completion and student engagement.
                </CardDescription>
              </div>
              <Link href="/teacher/classes">
                <Button variant="ghost" size="sm" className="text-xs font-bold text-primary hover:bg-primary/5">
                  View All Batches
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {activeBatches.map((batch) => (
                  <div key={batch.id} className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-white hover:border-primary/40 transition-all space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] font-bold text-primary uppercase tracking-wider bg-primary/10 px-2 py-0.5 rounded">
                          {batch.subject}
                        </span>
                        <h4 className="font-bold text-xs text-slate-900 mt-1.5 leading-tight">{batch.name}</h4>
                      </div>
                      <Badge variant="outline" className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 border-emerald-200">
                        {batch.status}
                      </Badge>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px] font-medium text-slate-500">
                        <span>Syllabus Covered</span>
                        <span className="font-bold text-slate-800">{batch.progress}%</span>
                      </div>
                      <Progress value={batch.progress} className="h-1.5 bg-slate-200" />
                    </div>

                    <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500">
                      <span>👥 <strong>{batch.students}</strong> Enrolled</span>
                      <span>Next: <strong className="text-slate-800">{batch.nextSession}</strong></span>
                    </div>

                    <div className="pt-1 flex items-center gap-2">
                      <Link href="/teacher/students" className="flex-1">
                        <Button variant="outline" size="sm" className="w-full h-7 text-[11px] font-semibold rounded-md border-slate-200">
                          Students
                        </Button>
                      </Link>
                      <Button 
                        onClick={() => {
                          setMaterialBatch(batch.name);
                          setIsUploadModalOpen(true);
                        }}
                        size="sm" 
                        className="flex-1 h-7 text-[11px] font-semibold bg-primary hover:bg-primary/95 text-white rounded-md shadow-none cursor-pointer"
                      >
                        <Upload className="w-3 h-3 mr-1" /> Notes
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Pending Test Copies & Student Doubts */}
        <div className="space-y-4">
          {/* Pending Copies / Reviews */}
          <Card className="border border-slate-200/80 bg-white rounded-2xl shadow-none">
            <CardHeader className="p-4 border-b border-slate-100 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-xs font-bold text-slate-900 flex items-center gap-1.5 uppercase tracking-wider text-slate-500">
                  <FileText className="w-3.5 h-3.5 text-amber-600" />
                  <span>Submissions to Evaluate</span>
                </CardTitle>
              </div>
              <Badge variant="secondary" className="text-[10px] font-bold bg-amber-100 text-amber-800">
                3 Pending
              </Badge>
            </CardHeader>
            <CardContent className="p-4 divide-y divide-slate-100">
              {recentSubmissions.map((sub) => (
                <div key={sub.id} className="py-2.5 first:pt-0 last:pb-0 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">{sub.studentName}</span>
                    <span className="text-[10px] text-slate-400">{sub.submittedAt}</span>
                  </div>
                  <p className="text-[11px] text-slate-600 line-clamp-1">{sub.assignment}</p>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] text-primary font-semibold">{sub.batch}</span>
                    <Link href="/teacher/reports">
                      <Button size="sm" variant="ghost" className="h-6 text-[11px] font-bold text-amber-700 hover:bg-amber-50 p-1">
                        Evaluate <ArrowUpRight className="w-3 h-3 ml-0.5" />
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Student Doubts Box */}
          <Card className="border border-slate-200/80 bg-white rounded-2xl shadow-none">
            <CardHeader className="p-4 border-b border-slate-100 flex flex-row items-center justify-between">
              <CardTitle className="text-xs font-bold text-slate-900 flex items-center gap-1.5 uppercase tracking-wider text-slate-500">
                <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
                <span>Student Doubt Box</span>
              </CardTitle>
              <Badge variant="secondary" className="text-[10px] font-bold bg-blue-50 text-blue-700">
                2 New
              </Badge>
            </CardHeader>
            <CardContent className="p-4 divide-y divide-slate-100">
              {recentDoubts.map((doubt) => (
                <div key={doubt.id} className="py-2.5 first:pt-0 last:pb-0 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">{doubt.student}</span>
                    <Badge variant="outline" className="text-[9px] px-1.5 py-0">
                      {doubt.topic}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-slate-600 italic line-clamp-2">
                    "{doubt.question}"
                  </p>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] text-slate-400">{doubt.time}</span>
                    <Button 
                      onClick={() => {
                        toast({ title: "Doubt Reply Opened", description: `Drafting reply for ${doubt.student}.` });
                      }}
                      size="sm" 
                      variant="ghost" 
                      className="h-6 text-[11px] font-bold text-blue-700 hover:bg-blue-50 p-1 cursor-pointer"
                    >
                      Reply Now
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* --- MODAL 1: Upload Study Material --- */}
      <Dialog open={isUploadModalOpen} onOpenChange={setIsUploadModalOpen}>
        <DialogContent className="sm:max-w-[480px] bg-white rounded-2xl p-6 border border-slate-200 shadow-none">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Upload className="w-5 h-5 text-primary" />
              <span>Upload Notes / Material</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Share lecture slides, PDF notes, reference materials, or practice questions with your batch.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUploadSubmit} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-700">Target Batch / Course</Label>
              <select 
                value={materialBatch}
                onChange={(e) => setMaterialBatch(e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-slate-50/70 text-xs font-medium text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-primary"
              >
                {activeBatches.map((b) => (
                  <option key={b.id} value={b.name}>{b.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-700">Document Title</Label>
              <Input 
                placeholder="e.g. Fundamental Rights Handout & Case Studies PDF"
                value={materialTitle}
                onChange={(e) => setMaterialTitle(e.target.value)}
                className="h-10 text-xs bg-slate-50/70 border-slate-200 rounded-lg"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-700">Select File (PDF, DOCX, ZIP)</Label>
              <Input 
                type="file" 
                className="h-10 text-xs bg-slate-50/70 border-slate-200 rounded-lg cursor-pointer" 
              />
            </div>

            <DialogFooter className="pt-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsUploadModalOpen(false)}
                className="text-xs font-semibold h-9 rounded-lg"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="text-xs font-bold bg-primary hover:bg-primary/95 text-white h-9 rounded-lg shadow-none cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5 mr-1.5" /> Upload & Share
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* --- MODAL 2: Post Announcement / Notice --- */}
      <Dialog open={isNoticeModalOpen} onOpenChange={setIsNoticeModalOpen}>
        <DialogContent className="sm:max-w-[480px] bg-white rounded-2xl p-6 border border-slate-200 shadow-none">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Send className="w-5 h-5 text-blue-600" />
              <span>Broadcast Announcement</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Send an instant notification/notice to your students' dashboard.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleNoticeSubmit} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-700">Announcement Text</Label>
              <Textarea 
                placeholder="Write your announcement or notice here (e.g. Tomorrow's live lecture will start at 4:30 PM instead of 4:00 PM)..."
                value={noticeText}
                onChange={(e) => setNoticeText(e.target.value)}
                rows={4}
                className="text-xs bg-slate-50/70 border-slate-200 rounded-lg"
                required
              />
            </div>

            <DialogFooter className="pt-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsNoticeModalOpen(false)}
                className="text-xs font-semibold h-9 rounded-lg"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white h-9 rounded-lg shadow-none cursor-pointer"
              >
                <Send className="w-3.5 h-3.5 mr-1.5" /> Broadcast Notice
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
