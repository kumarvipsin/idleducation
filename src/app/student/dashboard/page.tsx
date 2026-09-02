'use client';

import { useState, useEffect } from "react";
import { 
  BookOpen, Video, Clock, FileText, Download, Play, 
  Sparkles, CheckCircle2, ArrowRight, Award, Calendar, 
  MessageSquare, User, AlertCircle, ArrowUpRight, ShieldCheck, 
  Target, Zap, HelpCircle
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/context/auth-context";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { getStudentProgressReports, getUpdates, getStudentEnrolledCourses } from "@/app/actions";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

export default function StudentDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isDoubtModalOpen, setIsDoubtModalOpen] = useState(false);
  const [doubtText, setDoubtText] = useState("");
  const [doubtSubject, setDoubtSubject] = useState("Indian Polity");

  // Real-time student schedule
  const todayLiveClasses = [
    {
      id: "live-1",
      title: "Indian Polity & Governance: Fundamental Rights & Judicial Review",
      instructor: "Prof. Sharma (Senior Faculty)",
      time: "04:00 PM - 05:30 PM",
      batch: "UPSC GS Foundation (Batch A)",
      status: "Starting Soon",
      isLive: true,
      roomLink: "https://meet.google.com/idl-upsc-polity",
    },
    {
      id: "live-2",
      title: "Modern Indian History: 1857 Revolt to Independence",
      instructor: "Dr. A. Verma (History Lead)",
      time: "06:30 PM - 08:00 PM",
      batch: "BPSC Prelims Special",
      status: "Scheduled",
      isLive: false,
      roomLink: "https://meet.google.com/idl-bpsc-history",
    },
  ];

  // Active courses
  const enrolledCourses = [
    {
      id: "c-1",
      title: "UPSC GS Comprehensive Foundation (Prelims + Mains)",
      batch: "UPSC 2027 Aspirants",
      progress: 68,
      completedLessons: 48,
      totalLessons: 70,
      nextLesson: "Directive Principles & Fundamental Duties",
      subject: "General Studies",
    },
    {
      id: "c-2",
      title: "BPSC 70th CCE Target Prelims Batch",
      batch: "State Services Batch",
      progress: 45,
      completedLessons: 27,
      totalLessons: 60,
      nextLesson: "Bihar History & Freedom Struggle",
      subject: "State Special",
    },
  ];

  // Study Materials
  const recentMaterials = [
    {
      id: "m-1",
      title: "Indian Polity: Complete Fundamental Rights Handout & Case Laws",
      type: "PDF Notes",
      size: "4.8 MB",
      date: "Today",
      subject: "Polity",
    },
    {
      id: "m-2",
      title: "Modern History: 1857 to 1947 Timeline & Governor-Generals Summary",
      type: "PDF Notes",
      size: "6.2 MB",
      date: "Yesterday",
      subject: "History",
    },
    {
      id: "m-3",
      title: "Ethics Case Studies Practice Sheet with Model Answers",
      type: "Practice Sheet",
      size: "2.1 MB",
      date: "3 days ago",
      subject: "Ethics",
    },
  ];

  // Progress Reports
  const progressReports = [
    {
      id: "rep-1",
      month: "August 2026",
      mentor: "Prof. Sharma",
      score: "85/100",
      feedback: "Great analytical depth in GS-II answer writing. Keep working on intro conciseness and case law citations.",
      attendance: "96%",
    },
    {
      id: "rep-2",
      month: "July 2026",
      mentor: "Dr. A. Verma",
      score: "80/100",
      feedback: "Consistent test performance in Modern History. Revise timeline diagrams regularly.",
      attendance: "92%",
    },
  ];

  const handleDoubtSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!doubtText) {
      toast({ variant: "destructive", title: "Question required", description: "Please enter your doubt question." });
      return;
    }
    toast({
      title: "Doubt Submitted to Faculty",
      description: `Your question on ${doubtSubject} has been sent. Faculty will respond shortly.`,
    });
    setDoubtText("");
    setIsDoubtModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* 1. Welcome & Daily Focus Banner */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 md:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-primary uppercase tracking-wider bg-primary/10 px-2.5 py-0.5 rounded-md">
              Aspirant Workspace
            </span>
            <span className="text-xs text-slate-400">
              {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 mt-1">
            Welcome back, {user?.name || 'Aspirant'}! 🎯
          </h2>
          <p className="text-xs md:text-sm text-slate-500 mt-0.5">
            You have <strong className="text-slate-800">2 live lectures</strong> today and your syllabus completion is at <strong className="text-slate-800">68%</strong>.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <Button 
            onClick={() => setIsDoubtModalOpen(true)}
            variant="outline" 
            className="h-9 text-xs font-bold border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg flex-1 md:flex-initial cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5 mr-1.5 text-blue-600" />
            Ask Doubt
          </Button>

          <Link href="/student/study-plan" className="flex-1 md:flex-initial">
            <Button variant="outline" className="h-9 text-xs font-bold border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg w-full cursor-pointer">
              <Calendar className="w-3.5 h-3.5 mr-1.5 text-purple-600" />
              Study Plan
            </Button>
          </Link>

          <Link href="/student/courses" className="flex-1 md:flex-initial">
            <Button className="h-9 text-xs font-bold bg-primary hover:bg-primary/95 text-white rounded-lg shadow-none w-full cursor-pointer">
              <BookOpen className="w-3.5 h-3.5 mr-1.5" />
              My Courses
            </Button>
          </Link>
        </div>
      </div>

      {/* 2. Key Academic Metrics (KPI Cards) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <Card className="border border-slate-200/80 bg-white rounded-xl shadow-none">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Enrolled Courses</p>
              <h3 className="text-xl md:text-2xl font-black text-slate-900 mt-0.5">2 Courses</h3>
              <p className="text-[10px] text-primary font-bold mt-1">
                Active Batch
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200/80 bg-white rounded-xl shadow-none">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Today's Lectures</p>
              <h3 className="text-xl md:text-2xl font-black text-slate-900 mt-0.5">2 Live</h3>
              <p className="text-[10px] text-emerald-600 font-bold mt-1">
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
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Overall Progress</p>
              <h3 className="text-xl md:text-2xl font-black text-slate-900 mt-0.5">68%</h3>
              <p className="text-[10px] text-purple-600 font-bold mt-1">
                On track for target
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Target className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200/80 bg-white rounded-xl shadow-none">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Attendance Rate</p>
              <h3 className="text-xl md:text-2xl font-black text-slate-900 mt-0.5">94%</h3>
              <p className="text-[10px] text-emerald-600 font-bold mt-1">
                Excellent presence
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 3. Today's Live Class Room (Interactive Launcher) */}
      <Card className="border border-slate-200/80 bg-white rounded-2xl shadow-none overflow-hidden">
        <CardHeader className="p-5 border-b border-slate-100 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Video className="w-4 h-4 text-primary" />
              <span>Today's Live Class Schedule</span>
            </CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Interactive live lectures and doubt-solving sessions for your enrolled batches.
            </CardDescription>
          </div>
          <Badge variant="outline" className="text-slate-600 text-xs font-semibold">
            2 Lectures Today
          </Badge>
        </CardHeader>
        <CardContent className="p-5 divide-y divide-slate-100">
          {todayLiveClasses.map((item) => (
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
                    <span className="font-semibold text-primary">{item.instructor}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-slate-400" /> {item.time}</span>
                    <span>•</span>
                    <span>{item.batch}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto self-end md:self-center">
                <a href={item.roomLink} target="_blank" rel="noopener noreferrer" className="w-full md:w-auto">
                  <Button size="sm" className="w-full md:w-auto h-8 text-xs font-bold bg-primary hover:bg-primary/95 text-white rounded-lg shadow-none cursor-pointer">
                    <Play className="w-3 h-3 mr-1.5 fill-white" /> Join Live Classroom
                  </Button>
                </a>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* 4. Two Columns: Active Courses & Study Resources */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: My Active Courses (2 Cols on LG) */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="border border-slate-200/80 bg-white rounded-2xl shadow-none">
            <CardHeader className="p-5 border-b border-slate-100 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-primary" />
                  <span>My Enrolled Curricula</span>
                </CardTitle>
                <CardDescription className="text-xs text-slate-500">
                  Pick up right where you left off in your structured curriculum.
                </CardDescription>
              </div>
              <Link href="/student/courses">
                <Button variant="ghost" size="sm" className="text-xs font-bold text-primary hover:bg-primary/5">
                  View All <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {enrolledCourses.map((c) => (
                  <div key={c.id} className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-white hover:border-primary/40 transition-all space-y-3">
                    <div>
                      <span className="text-[10px] font-bold text-primary uppercase tracking-wider bg-primary/10 px-2 py-0.5 rounded">
                        {c.subject}
                      </span>
                      <h4 className="font-bold text-xs text-slate-900 mt-1.5 leading-tight">{c.title}</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">{c.batch}</p>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px] font-medium text-slate-500">
                        <span>Completion ({c.completedLessons}/{c.totalLessons} Lessons)</span>
                        <span className="font-bold text-slate-800">{c.progress}%</span>
                      </div>
                      <Progress value={c.progress} className="h-1.5 bg-slate-200" />
                    </div>

                    <div className="pt-2 border-t border-slate-200/60 text-[11px] text-slate-600">
                      <span>Next: <strong>{c.nextLesson}</strong></span>
                    </div>

                    <Link href="/student/courses" className="block pt-1">
                      <Button size="sm" className="w-full h-8 text-xs font-bold bg-primary hover:bg-primary/95 text-white rounded-lg shadow-none cursor-pointer">
                        <Play className="w-3 h-3 mr-1 fill-white" /> Continue Learning
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Progress & Faculty Feedback */}
          <Card className="border border-slate-200/80 bg-white rounded-2xl shadow-none">
            <CardHeader className="p-5 border-b border-slate-100 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Award className="w-4 h-4 text-emerald-600" />
                  <span>Faculty Feedback & Monthly Progress</span>
                </CardTitle>
                <CardDescription className="text-xs text-slate-500">
                  Direct evaluation and feedback from your instructors.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="p-5 divide-y divide-slate-100">
              {progressReports.map((rep) => (
                <div key={rep.id} className="py-3 first:pt-0 last:pb-0 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">{rep.month} Evaluation</span>
                    <Badge className="bg-emerald-600 text-white text-[10px] font-bold">
                      Score: {rep.score}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100 italic">
                    "{rep.feedback}"
                  </p>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-0.5">
                    <span>Evaluated by: <strong className="text-slate-800">{rep.mentor}</strong></span>
                    <span>Attendance: <strong className="text-emerald-600">{rep.attendance}</strong></span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Downloadable Notes & Resources */}
        <div className="space-y-4">
          <Card className="border border-slate-200/80 bg-white rounded-2xl shadow-none">
            <CardHeader className="p-4 border-b border-slate-100 flex flex-row items-center justify-between">
              <CardTitle className="text-xs font-bold text-slate-900 flex items-center gap-1.5 uppercase tracking-wider text-slate-500">
                <FileText className="w-3.5 h-3.5 text-primary" />
                <span>Class Handouts & Notes</span>
              </CardTitle>
              <Badge variant="secondary" className="text-[10px] font-bold bg-primary/10 text-primary">
                3 New
              </Badge>
            </CardHeader>
            <CardContent className="p-4 divide-y divide-slate-100">
              {recentMaterials.map((mat) => (
                <div key={mat.id} className="py-3 first:pt-0 last:pb-0 space-y-1.5">
                  <div className="flex items-start justify-between gap-2">
                    <h5 className="text-xs font-bold text-slate-800 leading-tight">{mat.title}</h5>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span>{mat.size} • {mat.date}</span>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => toast({ title: "Downloading Handout", description: `Downloading ${mat.title}` })}
                      className="h-6 text-[10px] font-bold text-primary border-primary/20 hover:bg-primary/5 p-1.5 rounded cursor-pointer"
                    >
                      <Download className="w-3 h-3 mr-1" /> PDF
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Academic Support Card */}
          <Card className="border border-blue-200/80 bg-blue-50/50 rounded-2xl shadow-none p-5 space-y-3">
            <div className="flex items-center gap-2 text-blue-900 font-bold text-xs">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>Need Guidance or Mentorship?</span>
            </div>
            <p className="text-xs text-blue-800/80 leading-relaxed">
              Have doubts regarding syllabus topics, answer writing structure, or time management? Submit your query to get faculty assistance.
            </p>
            <Button 
              onClick={() => setIsDoubtModalOpen(true)}
              size="sm" 
              className="w-full h-8 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-none cursor-pointer"
            >
              Ask Faculty Doubt
            </Button>
          </Card>
        </div>
      </div>

      {/* --- Ask Doubt Modal --- */}
      <Dialog open={isDoubtModalOpen} onOpenChange={setIsDoubtModalOpen}>
        <DialogContent className="sm:max-w-[480px] bg-white rounded-2xl p-6 border border-slate-200 shadow-none">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-blue-600" />
              <span>Ask Doubt to Faculty</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Submit your academic query or question. Your course instructor will reply in your dashboard.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleDoubtSubmit} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 block">Select Subject / Course</label>
              <select 
                value={doubtSubject}
                onChange={(e) => setDoubtSubject(e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-slate-50/70 text-xs font-medium text-slate-800"
              >
                <option value="Indian Polity & Governance">Indian Polity & Governance</option>
                <option value="Modern Indian History">Modern Indian History</option>
                <option value="Physical & Human Geography">Physical & Human Geography</option>
                <option value="Ethics, Integrity & Aptitude">Ethics, Integrity & Aptitude</option>
                <option value="General Studies & CSAT">General Studies & CSAT</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 block">Your Doubt / Question</label>
              <Textarea 
                placeholder="Explain the topic or question you need help with (e.g. Please clarify the doctrine of basic structure in Kesavananda Bharati case)..."
                value={doubtText}
                onChange={(e) => setDoubtText(e.target.value)}
                rows={4}
                className="text-xs bg-slate-50/70 border-slate-200 rounded-lg"
                required
              />
            </div>

            <DialogFooter className="pt-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsDoubtModalOpen(false)}
                className="text-xs font-semibold h-9 rounded-lg"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white h-9 rounded-lg shadow-none cursor-pointer"
              >
                Submit Doubt
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
