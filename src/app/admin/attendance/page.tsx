'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
  ClipboardList,
  CalendarRange,
  BarChart3,
  Users,
  GraduationCap,
  Clock,
  ArrowRight,
  CheckCircle2,
  Calendar,
  Sparkles,
  BookOpen,
} from 'lucide-react';
import { getAttendanceClasses, getAttendanceStudents } from '@/app/actions/attendance';
import type { TAttendanceClass, TAttendanceStudent } from '@/app/actions/types';

export default function AttendanceDashboardPage() {
  const [classes, setClasses] = useState<TAttendanceClass[]>([]);
  const [students, setStudents] = useState<TAttendanceStudent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const [classRes, studRes] = await Promise.all([
        getAttendanceClasses(),
        getAttendanceStudents(),
      ]);
      if (classRes.success && classRes.data) {
        setClasses(classRes.data as TAttendanceClass[]);
      }
      if (studRes.success && studRes.data) {
        setStudents(studRes.data as TAttendanceStudent[]);
      }
      setLoading(false);
    })();
  }, []);

  const class9 = classes.find(c => c.name?.toLowerCase().includes('9') || c.displayName?.toLowerCase().includes('9'));
  const class10 = classes.find(c => c.name?.toLowerCase().includes('10') || c.displayName?.toLowerCase().includes('10'));

  const class9Students = students.filter(s => class9 && s.classId === class9.id);
  const class10Students = students.filter(s => class10 && s.classId === class10.id);

  const todayFormatted = new Intl.DateTimeFormat('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date());

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 p-6 md:p-8 text-white shadow-xl">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-200 text-xs font-semibold mb-3 border border-blue-400/30">
              <Sparkles className="h-3.5 w-3.5 text-blue-300" />
              <span>Coaching Attendance & Timing System</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Attendance Management</h1>
            <p className="text-blue-200/80 text-sm mt-1 max-w-xl">
              Manage Class 9th & 10th daily attendance (Hour 1, 2, 3), in/out timings, weekly logs, and monthly reports.
            </p>
            <div className="flex items-center gap-2 mt-4 text-xs text-blue-300 font-medium">
              <Calendar className="h-4 w-4" />
              <span>Today: {todayFormatted}</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link href="/admin/attendance/mark">
              <Button className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold shadow-lg gap-2 h-11 px-5">
                <ClipboardList className="h-4 w-4" />
                Mark Today&apos;s Attendance
              </Button>
            </Link>
            <Link href="/admin/attendance/students">
              <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 font-bold gap-2 h-11 px-4">
                <Users className="h-4 w-4" />
                Manage Students
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Class 9th & Class 10th Hub Cards */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-indigo-600" />
            Class Overview
          </h2>
          <span className="text-xs text-slate-500">2 Active Batches (9th & 10th)</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Class 9th Card */}
          <Card className="border-2 border-indigo-100 hover:border-indigo-300 transition-all rounded-2xl shadow-sm overflow-hidden bg-gradient-to-br from-indigo-50/40 via-white to-white">
            <CardHeader className="pb-3 border-b border-indigo-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black text-base shadow-md shadow-indigo-200">
                    9
                  </div>
                  <div>
                    <CardTitle className="text-lg font-bold text-slate-800">Class 9th</CardTitle>
                    <CardDescription className="text-xs">Regular Coaching Batch</CardDescription>
                  </div>
                </div>
                <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200 font-bold px-3 py-1">
                  {loading ? '...' : `${class9Students.length} Students`}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 font-medium block">Daily Schedule</span>
                  <span className="font-bold text-slate-700 mt-0.5 block">Up to 3 Hours / Day</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 font-medium block">Timing Tracking</span>
                  <span className="font-bold text-emerald-700 mt-0.5 block flex items-center gap-1">
                    <Clock className="h-3 w-3" /> Exact In / Out
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-1">
                <Link href={`/admin/attendance/mark?classId=${class9?.id || ''}`} className="flex-1">
                  <Button size="sm" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-9 text-xs">
                    Mark Attendance
                  </Button>
                </Link>
                <Link href={`/admin/attendance/weekly?classId=${class9?.id || ''}`}>
                  <Button size="sm" variant="outline" className="border-indigo-200 text-indigo-700 hover:bg-indigo-50 font-bold h-9 text-xs">
                    Weekly Report
                  </Button>
                </Link>
                <Link href={`/admin/attendance/monthly?classId=${class9?.id || ''}`}>
                  <Button size="sm" variant="outline" className="border-indigo-200 text-indigo-700 hover:bg-indigo-50 font-bold h-9 text-xs">
                    Monthly Report
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Class 10th Card */}
          <Card className="border-2 border-purple-100 hover:border-purple-300 transition-all rounded-2xl shadow-sm overflow-hidden bg-gradient-to-br from-purple-50/40 via-white to-white">
            <CardHeader className="pb-3 border-b border-purple-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-purple-600 text-white flex items-center justify-center font-black text-base shadow-md shadow-purple-200">
                    10
                  </div>
                  <div>
                    <CardTitle className="text-lg font-bold text-slate-800">Class 10th</CardTitle>
                    <CardDescription className="text-xs">Board Coaching Batch</CardDescription>
                  </div>
                </div>
                <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 font-bold px-3 py-1">
                  {loading ? '...' : `${class10Students.length} Students`}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 font-medium block">Daily Schedule</span>
                  <span className="font-bold text-slate-700 mt-0.5 block">Up to 3 Hours / Day</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 font-medium block">Timing Tracking</span>
                  <span className="font-bold text-emerald-700 mt-0.5 block flex items-center gap-1">
                    <Clock className="h-3 w-3" /> Exact In / Out
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-1">
                <Link href={`/admin/attendance/mark?classId=${class10?.id || ''}`} className="flex-1">
                  <Button size="sm" className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold h-9 text-xs">
                    Mark Attendance
                  </Button>
                </Link>
                <Link href={`/admin/attendance/weekly?classId=${class10?.id || ''}`}>
                  <Button size="sm" variant="outline" className="border-purple-200 text-purple-700 hover:bg-purple-50 font-bold h-9 text-xs">
                    Weekly Report
                  </Button>
                </Link>
                <Link href={`/admin/attendance/monthly?classId=${class10?.id || ''}`}>
                  <Button size="sm" variant="outline" className="border-purple-200 text-purple-700 hover:bg-purple-50 font-bold h-9 text-xs">
                    Monthly Report
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 4 Core Workflow Modules */}
      <div>
        <h2 className="text-lg font-bold text-slate-800 mb-4">Quick Navigation</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Module 1: Daily Mark */}
          <Link href="/admin/attendance/mark" className="group">
            <Card className="h-full border border-slate-200/80 hover:border-emerald-400 hover:shadow-lg transition-all rounded-2xl">
              <CardContent className="p-5 flex flex-col justify-between h-full space-y-4">
                <div className="flex items-start justify-between">
                  <div className="h-12 w-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors shadow-sm">
                    <ClipboardList className="h-6 w-6" />
                  </div>
                  <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100 text-[10px] font-bold">Daily</Badge>
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">Mark Attendance</h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Select Hour 1, 2, or 3, choose subject, and mark Present/Absent with auto-filled In & Out times.
                  </p>
                </div>
                <div className="flex items-center text-xs font-bold text-emerald-700 gap-1 pt-1">
                  <span>Take Attendance</span>
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </CardContent>
            </Card>
          </Link>

          {/* Module 2: Weekly Report */}
          <Link href="/admin/attendance/weekly" className="group">
            <Card className="h-full border border-slate-200/80 hover:border-blue-400 hover:shadow-lg transition-all rounded-2xl">
              <CardContent className="p-5 flex flex-col justify-between h-full space-y-4">
                <div className="flex items-start justify-between">
                  <div className="h-12 w-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors shadow-sm">
                    <CalendarRange className="h-6 w-6" />
                  </div>
                  <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 text-[10px] font-bold">Weekly</Badge>
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 group-hover:text-blue-700 transition-colors">Weekly Reports</h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Student days attended, hours taken vs missed, daily In/Out arrival timestamps, printable report.
                  </p>
                </div>
                <div className="flex items-center text-xs font-bold text-blue-700 gap-1 pt-1">
                  <span>View Weekly</span>
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </CardContent>
            </Card>
          </Link>

          {/* Module 3: Monthly Report */}
          <Link href="/admin/attendance/monthly" className="group">
            <Card className="h-full border border-slate-200/80 hover:border-indigo-400 hover:shadow-lg transition-all rounded-2xl">
              <CardContent className="p-5 flex flex-col justify-between h-full space-y-4">
                <div className="flex items-start justify-between">
                  <div className="h-12 w-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors shadow-sm">
                    <BarChart3 className="h-6 w-6" />
                  </div>
                  <Badge className="bg-indigo-100 text-indigo-800 hover:bg-indigo-100 text-[10px] font-bold">Monthly</Badge>
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 group-hover:text-indigo-700 transition-colors">Monthly Reports</h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Complete monthly breakdown: working days, days present, class hours attended vs missed, %.
                  </p>
                </div>
                <div className="flex items-center text-xs font-bold text-indigo-700 gap-1 pt-1">
                  <span>View Monthly</span>
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </CardContent>
            </Card>
          </Link>

          {/* Module 4: Students Management */}
          <Link href="/admin/attendance/students" className="group">
            <Card className="h-full border border-slate-200/80 hover:border-purple-400 hover:shadow-lg transition-all rounded-2xl">
              <CardContent className="p-5 flex flex-col justify-between h-full space-y-4">
                <div className="flex items-start justify-between">
                  <div className="h-12 w-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-colors shadow-sm">
                    <Users className="h-6 w-6" />
                  </div>
                  <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100 text-[10px] font-bold">Students</Badge>
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 group-hover:text-purple-700 transition-colors">Manage Students</h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Add new students to Class 9th or 10th, manage roll numbers, student & parent phone numbers.
                  </p>
                </div>
                <div className="flex items-center text-xs font-bold text-purple-700 gap-1 pt-1">
                  <span>Manage Roster</span>
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>

      {/* Quick Coaching Rules Info Card */}
      <Card className="border border-slate-200 rounded-2xl bg-gradient-to-r from-slate-50 to-blue-50/30 p-5">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800">Coaching Period Structure</p>
              <p className="text-xs text-slate-500 mt-0.5">
                Each day can have 1, 2, or 3 period hours (Hour 1: 4–5 PM, Hour 2: 5–6 PM, Hour 3: 6–7 PM).
                Each student has pre-filled In/Out times that you can edit anytime.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/admin/attendance/subjects">
              <Button variant="outline" size="sm" className="text-xs font-bold h-8">
                <BookOpen className="h-3.5 w-3.5 mr-1" />
                Manage Subjects
              </Button>
            </Link>
            <Link href="/admin/attendance/classes">
              <Button variant="outline" size="sm" className="text-xs font-bold h-8">
                Manage Batches
              </Button>
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
}
