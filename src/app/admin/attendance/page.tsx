'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAttendance } from '@/context/attendance-context';
import {
  Users,
  CalendarDays,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRight,
  Sparkles,
  PhoneCall,
  Calendar,
  Radio,
  PlusCircle,
  FileSpreadsheet,
  AlertTriangle,
  ChevronRight,
  TrendingUp,
  UserCheck,
  UserX,
  PlaneTakeoff,
  Eye,
  SlidersHorizontal,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { CallStatus, SpokeTo } from '@/lib/attendance-store';

const TREND_DATA = [
  { day: '1 Sep', attendance: 84 },
  { day: '3 Sep', attendance: 86 },
  { day: '5 Sep', attendance: 89 },
  { day: '7 Sep', attendance: 85 },
  { day: '9 Sep', attendance: 88 },
  { day: '10 Sep', attendance: 91 },
  { day: '11 Sep', attendance: 86.4 },
  { day: '15 Sep', attendance: 87 },
  { day: '20 Sep', attendance: 89 },
  { day: '25 Sep', attendance: 88 },
  { day: '30 Sep', attendance: 90 },
];

export default function AttendanceDashboard() {
  const {
    students,
    schedules,
    liveSession,
    absentFollowUps,
    logCallFollowUp,
    addScheduleItem,
    addStudent,
    classes,
    batches,
    teachers,
  } = useAttendance();

  // Modal states
  const [callingStudent, setCallingStudent] = useState<any | null>(null);
  const [callStatus, setCallStatus] = useState<CallStatus>('Contacted');
  const [spokeTo, setSpokeTo] = useState<SpokeTo>('Father');
  const [parentReason, setParentReason] = useState('');
  const [callRemark, setCallRemark] = useState('');

  // Quick action modals
  const [isAddClassOpen, setIsAddClassOpen] = useState(false);
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);

  // New Class Form
  const [newClassSubject, setNewClassSubject] = useState('Mathematics');
  const [newClassBatch, setNewClassBatch] = useState('9A');
  const [newClassTeacher, setNewClassTeacher] = useState('Amod Sharma');
  const [newClassStart, setNewClassStart] = useState('04:00 PM');
  const [newClassEnd, setNewClassEnd] = useState('06:00 PM');

  // New Student Form
  const [newStName, setNewStName] = useState('');
  const [newStBatch, setNewStBatch] = useState('9A');
  const [newStParentPhone, setNewStParentPhone] = useState('');

  const handleCallSubmit = () => {
    if (!callingStudent) return;
    logCallFollowUp({
      id: callingStudent.id,
      callStatus,
      spokeTo,
      parentReason,
      remark: callRemark,
    });
    setCallingStudent(null);
    setParentReason('');
    setCallRemark('');
  };

  const handleAddClassSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const batchObj = batches.find(b => b.name === newClassBatch);
    const teacherObj = teachers.find(t => t.name === newClassTeacher);
    addScheduleItem({
      date: '2026-09-11',
      dayOfWeek: 4,
      startTime: newClassStart,
      endTime: newClassEnd,
      durationMinutes: 120,
      classId: batchObj?.classId || 'c9',
      className: batchObj?.className || '9th',
      batchId: newClassBatch,
      batchName: newClassBatch,
      subject: newClassSubject,
      teacherId: teacherObj?.id || 't1',
      teacherName: newClassTeacher,
      type: 'extra',
      status: 'Upcoming',
      room: batchObj?.room || 'Room 101',
    });
    setIsAddClassOpen(false);
  };

  const handleAddStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStName.trim()) return;
    const batchObj = batches.find(b => b.name === newStBatch);
    addStudent({
      name: newStName,
      rollNo: students.filter(s => s.batchId === newStBatch).length + 1,
      classId: batchObj?.classId || 'c9',
      className: batchObj?.className || '9th',
      batchId: newStBatch,
      batchName: newStBatch,
      admissionDate: new Date().toISOString().split('T')[0],
      status: 'active',
      phone: '+91 98110 99999',
      parentName: 'Guardian',
      parentPhone: newStParentPhone || '+91 99110 99999',
    });
    setNewStName('');
    setNewStParentPhone('');
    setIsAddStudentOpen(false);
  };

  const completedClassesCount = schedules.filter(s => s.status === 'Completed').length;
  const ongoingClassesCount = schedules.filter(s => s.status === 'Ongoing').length;
  const upcomingClassesCount = schedules.filter(s => s.status === 'Upcoming').length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl md:text-2xl font-black tracking-tight text-slate-900">
              Welcome back, Amod Sharma 👋
            </h1>
            <Badge className="bg-blue-50 text-blue-700 border-blue-200 font-bold text-[11px]">
              Admin
            </Badge>
          </div>
          <p className="text-xs md:text-sm text-slate-500 mt-1 font-medium">
            Here&apos;s what&apos;s happening at IDL Education today.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100/90 border border-slate-200 text-xs font-semibold text-slate-700">
            <Calendar className="h-4 w-4 text-blue-600" />
            <span>Thu, 11 Sep 2026</span>
          </div>
          <Link href="/admin/attendance/live">
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs h-9 px-4 gap-2 shadow-sm">
              <Radio className="h-3.5 w-3.5 animate-pulse" />
              Live Attendance (Ongoing)
            </Button>
          </Link>
        </div>
      </div>

      {/* Top Stat Cards (Reference panel 1) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {/* Total Students */}
        <Card className="border-slate-200 shadow-sm hover:shadow transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Total Students
              </span>
              <div className="h-7 w-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <Users className="h-3.5 w-3.5" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900">{students.length}</span>
              <span className="text-[10px] text-emerald-600 font-semibold">+3 New this month</span>
            </div>
          </CardContent>
        </Card>

        {/* Today's Classes */}
        <Card className="border-slate-200 shadow-sm hover:shadow transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Today&apos;s Classes
              </span>
              <div className="h-7 w-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <CalendarDays className="h-3.5 w-3.5" />
              </div>
            </div>
            <div className="mt-2">
              <span className="text-2xl font-black text-slate-900">{schedules.length}</span>
              <div className="text-[10px] text-slate-500 font-medium mt-0.5 flex gap-1.5 flex-wrap">
                <span className="text-emerald-600 font-semibold">{completedClassesCount} Completed</span>
                <span>•</span>
                <span className="text-blue-600 font-semibold">{ongoingClassesCount} Ongoing</span>
                <span>•</span>
                <span className="text-amber-600 font-semibold">{upcomingClassesCount} Up</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Present Today */}
        <Card className="border-slate-200 shadow-sm hover:shadow transition-shadow border-l-4 border-l-emerald-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">
                Present Today
              </span>
              <div className="h-7 w-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <UserCheck className="h-3.5 w-3.5" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-2xl font-black text-emerald-600">198</span>
              <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 font-bold text-[10px]">
                80.9%
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Absent Today */}
        <Card className="border-slate-200 shadow-sm hover:shadow transition-shadow border-l-4 border-l-rose-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-rose-700 uppercase tracking-wider">
                Absent Today
              </span>
              <div className="h-7 w-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
                <UserX className="h-3.5 w-3.5" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-2xl font-black text-rose-600">32</span>
              <Badge className="bg-rose-100 text-rose-800 border-rose-200 font-bold text-[10px]">
                13.1%
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* On Leave */}
        <Card className="border-slate-200 shadow-sm hover:shadow transition-shadow border-l-4 border-l-amber-500 col-span-2 sm:col-span-1">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider">
                On Leave
              </span>
              <div className="h-7 w-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                <PlaneTakeoff className="h-3.5 w-3.5" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-2xl font-black text-amber-600">15</span>
              <Badge className="bg-amber-100 text-amber-800 border-amber-200 font-bold text-[10px]">
                6.1%
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Action Bar */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
          <Sparkles className="h-4 w-4 text-blue-600" />
          <span>Quick Actions:</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            size="sm"
            onClick={() => setIsAddClassOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold h-8"
          >
            + Add Class Session
          </Button>
          <Link href="/admin/attendance/live">
            <Button size="sm" variant="outline" className="text-xs font-bold h-8 border-slate-300">
              Mark Attendance
            </Button>
          </Link>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsAddStudentOpen(true)}
            className="text-xs font-bold h-8 border-slate-300"
          >
            + Add Student
          </Button>
          <Link href="/admin/attendance/leave">
            <Button size="sm" variant="outline" className="text-xs font-bold h-8 border-slate-300">
              Manage Leave
            </Button>
          </Link>
          <Link href="/admin/attendance/holidays">
            <Button size="sm" variant="outline" className="text-xs font-bold h-8 border-slate-300">
              Add Holiday
            </Button>
          </Link>
          <Link href="/admin/attendance/reports">
            <Button size="sm" variant="outline" className="text-xs font-bold h-8 border-slate-300 text-purple-700 border-purple-200 bg-purple-50 hover:bg-purple-100">
              Generate Report
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Section: Today's Class Overview Table (Exact match from reference panel 1) */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="p-4 sm:p-5 flex flex-row items-center justify-between border-b border-slate-100">
          <div>
            <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-blue-600" />
              Today&apos;s Class Overview
            </CardTitle>
            <CardDescription className="text-xs text-slate-500 mt-0.5">
              Live schedule and real-time attendance counts for today&apos;s classes
            </CardDescription>
          </div>
          <Link
            href="/admin/attendance/schedule"
            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            View Full Schedule <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </CardHeader>

        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/80 text-slate-600 font-bold border-b border-slate-200 text-[11px] uppercase tracking-wider">
                <th className="py-3 px-4">Time</th>
                <th className="py-3 px-3">Class</th>
                <th className="py-3 px-3">Batch</th>
                <th className="py-3 px-4">Subject</th>
                <th className="py-3 px-4">Teacher</th>
                <th className="py-3 px-3">Duration</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-center">Present / Total</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {schedules.map(item => {
                const isOngoing = item.status === 'Ongoing';
                const isCompleted = item.status === 'Completed';

                let presentCount = '-';
                let totalStudents = '20';
                if (item.batchName === '10A') {
                  totalStudents = '28';
                  presentCount = isCompleted ? '26 / 28' : '-';
                } else if (item.batchName === '11A') {
                  totalStudents = '26';
                  presentCount = isCompleted ? '24 / 26' : '-';
                } else if (item.batchName === '9A') {
                  totalStudents = '20';
                  if (item.id === 'sch-4') {
                    // Live ongoing
                    const presentInLive = Object.values(liveSession.studentRecords).filter(r => r.status === 'present').length;
                    presentCount = `${presentInLive} / 20`;
                  } else {
                    presentCount = isCompleted ? '17 / 20' : '-';
                  }
                }

                return (
                  <tr
                    key={item.id}
                    className={`hover:bg-slate-50/80 transition-colors ${
                      isOngoing ? 'bg-blue-50/30 font-medium' : ''
                    }`}
                  >
                    <td className="py-3 px-4 font-mono font-semibold text-slate-800 whitespace-nowrap">
                      {item.startTime} – {item.endTime}
                    </td>
                    <td className="py-3 px-3">
                      <Badge variant="outline" className="font-bold text-slate-700 bg-white">
                        {item.className}
                      </Badge>
                    </td>
                    <td className="py-3 px-3 font-bold text-slate-800">{item.batchName}</td>
                    <td className="py-3 px-4 font-semibold text-slate-900">{item.subject}</td>
                    <td className="py-3 px-4 text-slate-700">{item.teacherName}</td>
                    <td className="py-3 px-3 text-slate-500">{Math.round(item.durationMinutes / 60)} Hours</td>
                    <td className="py-3 px-3">
                      {isCompleted && (
                        <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px] font-bold">
                          ✓ Completed
                        </Badge>
                      )}
                      {isOngoing && (
                        <Badge className="bg-blue-500 text-white text-[10px] font-bold animate-pulse">
                          ● Ongoing
                        </Badge>
                      )}
                      {!isCompleted && !isOngoing && (
                        <Badge variant="secondary" className="text-slate-600 bg-slate-100 text-[10px] font-bold">
                          Upcoming
                        </Badge>
                      )}
                    </td>
                    <td className="py-3 px-3 text-center font-bold text-slate-800">
                      {presentCount}
                    </td>
                    <td className="py-3 px-4 text-right">
                      {isOngoing ? (
                        <Link href="/admin/attendance/live">
                          <Button
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold h-7 px-3 shadow-sm"
                          >
                            Take Attendance
                          </Button>
                        </Link>
                      ) : (
                        <Link href={`/admin/attendance/schedule`}>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-blue-600 hover:text-blue-800 text-xs font-semibold h-7 px-2.5"
                          >
                            View
                          </Button>
                        </Link>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Two Column Grid: Today's Absent Students & Attendance Trend Graph */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Today's Absent Students (5 Cols) */}
        <Card className="lg:col-span-5 border-slate-200 shadow-sm flex flex-col">
          <CardHeader className="p-4 sm:p-5 flex flex-row items-center justify-between border-b border-slate-100">
            <div>
              <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-rose-500" />
                Today&apos;s Absent Students
              </CardTitle>
              <CardDescription className="text-xs text-slate-500">
                Follow up with parents and log contact remarks
              </CardDescription>
            </div>
            <Link
              href="/admin/attendance/leave?tab=followup"
              className="text-xs font-bold text-blue-600 hover:text-blue-700"
            >
              View All →
            </Link>
          </CardHeader>

          <CardContent className="p-4 flex-1 space-y-3">
            {absentFollowUps.slice(0, 4).map(item => {
              const isContacted = item.callStatus === 'Contacted';
              return (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50/60 hover:bg-slate-50 transition-colors"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-slate-900">{item.studentName}</span>
                      <span className="text-[10px] text-slate-500 font-semibold">
                        {item.className} {item.subject}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500">
                      <span className="text-rose-600 font-bold">{item.missedHours} Missed</span>
                      <span>•</span>
                      <span>{item.contactNumber}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge
                      className={`text-[10px] font-bold ${
                        isContacted
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-rose-50 text-rose-700 border-rose-200 animate-pulse'
                      }`}
                    >
                      {item.callStatus}
                    </Badge>
                    <Button
                      size="sm"
                      onClick={() => {
                        setCallingStudent(item);
                        setCallStatus(item.callStatus);
                        setSpokeTo(item.spokeTo || 'Father');
                        setParentReason(item.parentReason || '');
                        setCallRemark(item.remark || '');
                      }}
                      className="h-7 px-2.5 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white gap-1"
                    >
                      <PhoneCall className="h-3 w-3" />
                      Call
                    </Button>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Attendance Trend Graph (7 Cols) */}
        <Card className="lg:col-span-7 border-slate-200 shadow-sm flex flex-col">
          <CardHeader className="p-4 sm:p-5 flex flex-row items-center justify-between border-b border-slate-100">
            <div>
              <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-blue-600" />
                Attendance Trend (This Month)
              </CardTitle>
              <CardDescription className="text-xs text-slate-500">
                Daily institute-wide student attendance rate across all batches
              </CardDescription>
            </div>
            <div className="text-right">
              <span className="text-[11px] text-slate-500 font-medium block">Average</span>
              <span className="text-lg font-black text-emerald-600">86.4%</span>
            </div>
          </CardHeader>

          <CardContent className="p-4 pt-6 flex-1">
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={TREND_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorAtt" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <YAxis domain={[50, 100]} tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} unit="%" />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-slate-900 text-white p-2 rounded-lg text-xs shadow-lg">
                            <p className="font-bold">{label}</p>
                            <p className="text-emerald-400 font-semibold">
                              Attendance: {payload[0].value}%
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="attendance"
                    stroke="#2563eb"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#colorAtt)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Call Parent Modal */}
      <Dialog open={!!callingStudent} onOpenChange={open => !open && setCallingStudent(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base font-bold">
              <PhoneCall className="h-4 w-4 text-blue-600" />
              Follow-up Call: {callingStudent?.studentName}
            </DialogTitle>
            <DialogDescription className="text-xs">
              Class {callingStudent?.className} ({callingStudent?.batchName}) • Parent Contact: {callingStudent?.contactNumber}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3.5 py-2 text-xs">
            <div>
              <Label className="text-xs font-semibold">Call Status</Label>
              <Select value={callStatus} onValueChange={(v: any) => setCallStatus(v)}>
                <SelectTrigger className="mt-1 h-9 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Contacted">Contacted</SelectItem>
                  <SelectItem value="Not Contacted">Not Contacted</SelectItem>
                  <SelectItem value="Busy">Busy</SelectItem>
                  <SelectItem value="Not Reachable">Not Reachable</SelectItem>
                  <SelectItem value="Call Back Requested">Call Back Requested</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {callStatus === 'Contacted' && (
              <div>
                <Label className="text-xs font-semibold">Spoke To</Label>
                <Select value={spokeTo} onValueChange={(v: any) => setSpokeTo(v)}>
                  <SelectTrigger className="mt-1 h-9 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Father">Father</SelectItem>
                    <SelectItem value="Mother">Mother</SelectItem>
                    <SelectItem value="Student">Student</SelectItem>
                    <SelectItem value="Guardian">Guardian</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <div>
              <Label className="text-xs font-semibold">Reason Given by Parent</Label>
              <Input
                placeholder="e.g. Mild fever, out of town, doctor visit..."
                value={parentReason}
                onChange={e => setParentReason(e.target.value)}
                className="mt-1 h-9 text-xs"
              />
            </div>

            <div>
              <Label className="text-xs font-semibold">Follow-up Remark</Label>
              <Textarea
                placeholder="e.g. Will attend tomorrow's double session..."
                value={callRemark}
                onChange={e => setCallRemark(e.target.value)}
                className="mt-1 text-xs h-20"
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" size="sm" onClick={() => setCallingStudent(null)}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleCallSubmit} className="bg-blue-600 hover:bg-blue-700 text-white font-bold">
              Save Call Record
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Class Session Modal */}
      <Dialog open={isAddClassOpen} onOpenChange={setIsAddClassOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">Add Class Session</DialogTitle>
            <DialogDescription className="text-xs">
              Create a regular, extra, or one-time class session for today.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddClassSubmit} className="space-y-3.5 text-xs py-2">
            <div>
              <Label className="text-xs font-semibold">Batch</Label>
              <Select value={newClassBatch} onValueChange={setNewClassBatch}>
                <SelectTrigger className="mt-1 h-9 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {batches.map(b => (
                    <SelectItem key={b.id} value={b.name}>
                      {b.className} - Batch {b.name} ({b.room})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-xs font-semibold">Subject</Label>
              <Input
                value={newClassSubject}
                onChange={e => setNewClassSubject(e.target.value)}
                className="mt-1 h-9 text-xs"
                required
              />
            </div>

            <div>
              <Label className="text-xs font-semibold">Teacher</Label>
              <Select value={newClassTeacher} onValueChange={setNewClassTeacher}>
                <SelectTrigger className="mt-1 h-9 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {teachers.map(t => (
                    <SelectItem key={t.id} value={t.name}>
                      {t.name} ({t.subject})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs font-semibold">Start Time</Label>
                <Input
                  value={newClassStart}
                  onChange={e => setNewClassStart(e.target.value)}
                  className="mt-1 h-9 text-xs"
                  required
                />
              </div>
              <div>
                <Label className="text-xs font-semibold">End Time</Label>
                <Input
                  value={newClassEnd}
                  onChange={e => setNewClassEnd(e.target.value)}
                  className="mt-1 h-9 text-xs"
                  required
                />
              </div>
            </div>

            <DialogFooter className="pt-3">
              <Button variant="outline" size="sm" type="button" onClick={() => setIsAddClassOpen(false)}>
                Cancel
              </Button>
              <Button size="sm" type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold">
                Create Session
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Add Student Modal */}
      <Dialog open={isAddStudentOpen} onOpenChange={setIsAddStudentOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">Add New Student Admission</DialogTitle>
            <DialogDescription className="text-xs">
              Admissions can happen anytime. Attendance starts on their admission date.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddStudentSubmit} className="space-y-3.5 text-xs py-2">
            <div>
              <Label className="text-xs font-semibold">Student Full Name</Label>
              <Input
                placeholder="e.g. Priyansh Malhotra"
                value={newStName}
                onChange={e => setNewStName(e.target.value)}
                className="mt-1 h-9 text-xs"
                required
              />
            </div>

            <div>
              <Label className="text-xs font-semibold">Assign Batch</Label>
              <Select value={newStBatch} onValueChange={setNewStBatch}>
                <SelectTrigger className="mt-1 h-9 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {batches.map(b => (
                    <SelectItem key={b.id} value={b.name}>
                      {b.className} - Batch {b.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-xs font-semibold">Parent Phone Number</Label>
              <Input
                placeholder="+91 98110 00000"
                value={newStParentPhone}
                onChange={e => setNewStParentPhone(e.target.value)}
                className="mt-1 h-9 text-xs"
              />
            </div>

            <DialogFooter className="pt-3">
              <Button variant="outline" size="sm" type="button" onClick={() => setIsAddStudentOpen(false)}>
                Cancel
              </Button>
              <Button size="sm" type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold">
                Enroll Student
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
