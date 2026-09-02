'use client';

import { useState } from "react";
import { 
  BookOpen, Video, Clock, Users, Plus, Play, 
  Calendar, CheckCircle2, Copy, Search, Filter 
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

export default function TeacherClassesPage() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);

  // New class schedule form
  const [classTitle, setClassTitle] = useState("");
  const [batchName, setBatchName] = useState("UPSC GS Foundation (Batch A)");
  const [classDate, setClassDate] = useState("");
  const [classTime, setClassTime] = useState("");
  const [meetLink, setMeetLink] = useState("https://meet.google.com/idl-live-room");

  const [classesList, setClassesList] = useState([
    {
      id: "cls-1",
      title: "Indian Polity & Governance: Fundamental Rights & Duties",
      batch: "UPSC GS Foundation (Batch A)",
      subject: "Polity",
      date: "Today",
      time: "04:00 PM - 05:30 PM",
      studentsCount: 48,
      status: "Starting Soon",
      isLive: true,
      roomLink: "https://meet.google.com/idl-upsc-polity",
    },
    {
      id: "cls-2",
      title: "Modern Indian History: 1857 Revolt to Independence",
      batch: "BPSC Prelims Special",
      subject: "History",
      date: "Today",
      time: "06:30 PM - 08:00 PM",
      studentsCount: 62,
      status: "Scheduled",
      isLive: false,
      roomLink: "https://meet.google.com/idl-bpsc-history",
    },
    {
      id: "cls-3",
      title: "Ethics Case Studies: Conflict of Interest & Integrity",
      batch: "GS IV Ethics & Case Studies",
      subject: "Ethics",
      date: "Tomorrow",
      time: "11:00 AM - 12:30 PM",
      studentsCount: 38,
      status: "Scheduled",
      isLive: false,
      roomLink: "https://meet.google.com/idl-ethics-case",
    },
    {
      id: "cls-4",
      title: "Physical Geography: Geomorphology & Plate Tectonics",
      batch: "NCERT Comprehensive Foundation",
      subject: "Geography",
      date: "Sep 05, 2026",
      time: "03:00 PM - 04:30 PM",
      studentsCount: 76,
      status: "Scheduled",
      isLive: false,
      roomLink: "https://meet.google.com/idl-geography-ncert",
    },
  ]);

  const handleScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!classTitle || !classTime) {
      toast({ variant: "destructive", title: "Missing fields", description: "Please fill class title and time." });
      return;
    }

    const newClass = {
      id: `cls-${Date.now()}`,
      title: classTitle,
      batch: batchName,
      subject: "General Studies",
      date: classDate || "Today",
      time: classTime,
      studentsCount: 50,
      status: "Scheduled",
      isLive: false,
      roomLink: meetLink || "https://meet.google.com/idl-live-room",
    };

    setClassesList([newClass, ...classesList]);
    toast({ title: "Class Scheduled", description: `"${classTitle}" has been scheduled for ${batchName}.` });
    setClassTitle("");
    setClassTime("");
    setIsScheduleModalOpen(false);
  };

  const filteredClasses = classesList.filter(c => 
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.batch.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" />
            <span>Class & Live Lecture Schedules</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Create, schedule, and launch live lecture rooms for your student batches.
          </p>
        </div>

        <Button 
          onClick={() => setIsScheduleModalOpen(true)}
          className="h-9 text-xs font-bold bg-primary hover:bg-primary/95 text-white rounded-lg shadow-none cursor-pointer"
        >
          <Plus className="w-4 h-4 mr-1.5" /> Schedule New Class
        </Button>
      </div>

      {/* Filter / Search Bar */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <Input 
          placeholder="Search by topic, subject, or batch name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 h-10 bg-white border-slate-200/80 rounded-xl text-xs"
        />
      </div>

      {/* Classes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredClasses.map((cls) => (
          <Card key={cls.id} className="border border-slate-200/80 bg-white rounded-2xl shadow-none overflow-hidden hover:border-primary/40 transition-all">
            <CardHeader className="p-5 border-b border-slate-100 flex flex-row items-start justify-between gap-2">
              <div>
                <span className="text-[10px] font-bold text-primary uppercase tracking-wider bg-primary/10 px-2 py-0.5 rounded">
                  {cls.subject}
                </span>
                <CardTitle className="text-sm font-bold text-slate-900 mt-2 leading-tight">
                  {cls.title}
                </CardTitle>
                <CardDescription className="text-xs font-semibold text-slate-600 mt-1">
                  {cls.batch}
                </CardDescription>
              </div>

              {cls.isLive ? (
                <Badge className="bg-rose-600 text-white text-[10px] font-extrabold uppercase px-2 py-0.5 animate-pulse shrink-0">
                  ● LIVE READY
                </Badge>
              ) : (
                <Badge variant="outline" className="text-slate-600 text-[10px] font-semibold shrink-0">
                  {cls.status}
                </Badge>
              )}
            </CardHeader>

            <CardContent className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>{cls.date}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>{cls.time}</span>
                </div>
                <div className="flex items-center gap-1.5 col-span-2 pt-1 border-t border-slate-200/60 text-slate-500">
                  <Users className="w-3.5 h-3.5 text-slate-400" />
                  <span><strong>{cls.studentsCount}</strong> enrolled students</span>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <Button 
                  size="sm"
                  onClick={() => {
                    navigator.clipboard.writeText(cls.roomLink);
                    toast({ title: "Link Copied!", description: "Live classroom URL copied to clipboard." });
                  }}
                  variant="outline" 
                  className="flex-1 h-8 text-xs font-semibold rounded-lg text-slate-600 border-slate-200 cursor-pointer"
                >
                  <Copy className="w-3 h-3 mr-1" /> Copy Link
                </Button>
                <a href={cls.roomLink} target="_blank" rel="noopener noreferrer" className="flex-1">
                  <Button size="sm" className="w-full h-8 text-xs font-bold bg-primary hover:bg-primary/95 text-white rounded-lg shadow-none cursor-pointer">
                    <Play className="w-3 h-3 mr-1 fill-white" /> Start Class
                  </Button>
                </a>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* --- Schedule Class Modal --- */}
      <Dialog open={isScheduleModalOpen} onOpenChange={setIsScheduleModalOpen}>
        <DialogContent className="sm:max-w-[480px] bg-white rounded-2xl p-6 border border-slate-200 shadow-none">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              <span>Schedule New Live Lecture</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Set the topic, batch, and timing for your upcoming lecture.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleScheduleSubmit} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-700">Select Batch</Label>
              <select 
                value={batchName}
                onChange={(e) => setBatchName(e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-slate-50/70 text-xs font-medium text-slate-800"
              >
                <option value="UPSC GS Foundation (Batch A)">UPSC GS Foundation (Batch A)</option>
                <option value="BPSC 70th CCE Target Batch">BPSC 70th CCE Target Batch</option>
                <option value="Ethics, Integrity & Aptitude (GS IV)">Ethics, Integrity & Aptitude (GS IV)</option>
                <option value="NCERT Comprehensive Foundation">NCERT Comprehensive Foundation</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-700">Lecture Topic / Title</Label>
              <Input 
                placeholder="e.g. Directive Principles of State Policy (DPSP) & Case Studies"
                value={classTitle}
                onChange={(e) => setClassTitle(e.target.value)}
                className="h-10 text-xs bg-slate-50/70 border-slate-200 rounded-lg"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-700">Date</Label>
                <Input 
                  type="date"
                  value={classDate}
                  onChange={(e) => setClassDate(e.target.value)}
                  className="h-10 text-xs bg-slate-50/70 border-slate-200 rounded-lg"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-700">Time (e.g. 05:00 PM)</Label>
                <Input 
                  placeholder="05:00 PM - 06:30 PM"
                  value={classTime}
                  onChange={(e) => setClassTime(e.target.value)}
                  className="h-10 text-xs bg-slate-50/70 border-slate-200 rounded-lg"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-700">Live Meeting Room URL</Label>
              <Input 
                value={meetLink}
                onChange={(e) => setMeetLink(e.target.value)}
                placeholder="https://meet.google.com/xyz-abc"
                className="h-10 text-xs bg-slate-50/70 border-slate-200 rounded-lg"
              />
            </div>

            <DialogFooter className="pt-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsScheduleModalOpen(false)}
                className="text-xs font-semibold h-9 rounded-lg"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="text-xs font-bold bg-primary hover:bg-primary/95 text-white h-9 rounded-lg shadow-none cursor-pointer"
              >
                Schedule Class
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
