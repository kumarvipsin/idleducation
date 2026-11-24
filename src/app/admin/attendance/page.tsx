'use client';

import React, { useState, useMemo } from 'react';
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
  Building2,
  Globe,
  ChevronDown,
  Check,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AttendanceDashboardTabs } from '@/components/attendance/attendance-dashboard-tabs';
import { AttendanceMonthPicker } from '@/components/attendance/attendance-month-picker';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
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
import {
  CallStatus,
  SpokeTo,
  calculateDashboardStats,
  formatDateDisplay,
  TDashboardStats,
} from '@/lib/attendance-store';

// Branches matching Fee Management, Classes & Live Attendance
const IDL_BRANCHES = [
  { id: 'all', name: 'All Branches' },
  { id: 'budh-vihar', name: 'Budh Vihar' },
  { id: 'krishan-vihar', name: 'Krishan Vihar' },
  { id: 'mangolpuri', name: 'Mangol Puri' },
  { id: 'mukherjee-nagar', name: 'Mukherjee Nagar' },
];

export default function AttendanceDashboard() {
  const {
    students,
    schedules,
    attendanceSessions,
    liveSession,
    leaveRequests,
    absentFollowUps,
    holidays,
    selectedDate,
    setSelectedDate,
    selectedBranch,
    setSelectedBranch,
    isBranchLocked,
    logCallFollowUp,
    addScheduleItem,
    addStudent,
    classes,
    batches,
    teachers,
  } = useAttendance();

  // Branch Selection Popover
  const [isBranchPickerOpen, setIsBranchPickerOpen] = useState(false);

  // Date Selection Popover
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  const todayDate = selectedDate || '2026-09-11';

  // Dynamic Dashboard Calculation (Branch-filtered)
  const dashboardStats = useMemo(() => {
    const branchFilteredStudents = selectedBranch === 'all'
      ? students
      : students.filter(st => {
          const parentClass = classes.find(c => c.id === st.classId);
          const parentBatch = batches.find(b => b.id === st.batchId);
          return (
            st.branchId === selectedBranch ||
            parentClass?.branchId === selectedBranch ||
            parentBatch?.branchId === selectedBranch
          );
        });

    const branchFilteredSchedules = selectedBranch === 'all'
      ? schedules
      : schedules.filter(sch => {
          const parentClass = classes.find(c => c.id === sch.classId);
          const parentBatch = batches.find(b => b.id === sch.batchId);
          return (
            parentClass?.branchId === selectedBranch ||
            parentBatch?.branchId === selectedBranch
          );
        });

    const branchFilteredAbsentFollowUps = selectedBranch === 'all'
      ? absentFollowUps
      : absentFollowUps.filter(af => {
          const parentClass = classes.find(c => c.id === af.classId);
          const parentBatch = batches.find(b => b.id === af.batchId);
          return (
            parentClass?.branchId === selectedBranch ||
            parentBatch?.branchId === selectedBranch
          );
        });

    return calculateDashboardStats({
      todayDate,
      students: branchFilteredStudents,
      schedules: branchFilteredSchedules,
      attendanceSessions,
      liveSession,
      leaveRequests,
      absentFollowUps: branchFilteredAbsentFollowUps,
      holidays,
    });
  }, [todayDate, selectedBranch, students, schedules, classes, batches, attendanceSessions, liveSession, leaveRequests, absentFollowUps, holidays]);

  // Filtered Today's Classes for Table
  const filteredTodayClasses = useMemo(() => {
    return dashboardStats.todayClassesOverview.filter(item => {
      if (selectedBranch === 'all') return true;
      const parentClass = classes.find(c => c.id === (item as any).classId || c.name === item.className);
      const parentBatch = batches.find(b => b.id === (item as any).batchId || b.name === item.batchName);
      return (
        parentClass?.branchId === selectedBranch ||
        parentBatch?.branchId === selectedBranch
      );
    });
  }, [dashboardStats.todayClassesOverview, selectedBranch, classes, batches]);

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

  const toolbarControlClass =
    'h-7 px-0.5 py-0.5 bg-transparent hover:bg-transparent border-0 rounded-none shadow-none ring-0 outline-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 text-xs sm:text-[13px] font-semibold text-[#172033] dark:text-slate-100 hover:text-[#2864E8] dark:hover:text-blue-400 inline-flex items-center gap-1.5 transition-colors cursor-pointer shrink-0';

  return (
    <div className="min-h-[calc(100svh-68px)] flex-1 flex flex-col overflow-x-hidden">
      {/* ------------------------------------------------------------- */}
      {/* TOP TOOLBAR (Exact Fee Management 100% Edge-to-Edge Style)    */}
      {/* ------------------------------------------------------------- */}
      <section
        aria-label="Attendance overview toolbar"
        className="w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border-b border-[#E5EAF2] dark:border-slate-800 md:sticky md:top-0 z-40"
      >
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between flex-wrap gap-4 sm:gap-6 min-w-0">
          {/* Left: Branch Selector + Date Selector */}
          <div className="flex items-center justify-start flex-wrap gap-4 sm:gap-6 min-w-0">
            {/* 1. Branch Selector */}
            <Popover open={isBranchLocked ? false : isBranchPickerOpen} onOpenChange={(open) => { if (!isBranchLocked) setIsBranchPickerOpen(open); }}>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  aria-label="Select branch"
                  className={isBranchLocked ? `${toolbarControlClass} cursor-default hover:text-[#172033] dark:hover:text-slate-100` : toolbarControlClass}
                >
                  <Building2 className="w-3.5 h-3.5 text-[#2864E8] dark:text-blue-400 shrink-0" />
                  <span className="whitespace-nowrap">
                    {IDL_BRANCHES.find(b => b.id === selectedBranch)?.name || 'All Branches'}
                  </span>
                  {!isBranchLocked && (
                    <ChevronDown
                      className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 shrink-0 ${isBranchPickerOpen ? 'rotate-180 text-slate-700 dark:text-slate-200' : ''}`}
                    />
                  )}
                </button>
              </PopoverTrigger>
              <PopoverContent
                align="start"
                sideOffset={8}
                className="w-[212px] p-2 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white z-50"
              >
                {/* First Option: All Branches */}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedBranch('all');
                    setIsBranchPickerOpen(false);
                  }}
                  className={`h-8 w-full px-2.5 rounded-lg text-xs flex items-center justify-between gap-2 transition-colors cursor-pointer select-none ${
                    selectedBranch === 'all'
                      ? 'bg-blue-100/80 dark:bg-blue-950/60 text-[#2864E8] dark:text-blue-400 font-semibold'
                      : 'bg-blue-50/75 hover:bg-blue-100/70 dark:bg-blue-950/35 dark:hover:bg-blue-950/55 text-[#2864E8] dark:text-blue-400 font-semibold'
                  }`}
                >
                  <span className="flex items-center gap-2 min-w-0">
                    <Globe className="w-3.5 h-3.5 text-[#2864E8] dark:text-blue-400 shrink-0" />
                    <span className="truncate">All Branches</span>
                  </span>
                  {selectedBranch === 'all' && (
                    <Check className="w-3.5 h-3.5 text-[#2864E8] dark:text-blue-400 shrink-0" />
                  )}
                </button>

                <div className="my-1.5 border-t border-slate-100 dark:border-slate-800/80" />

                {/* Individual Branches */}
                <div className="space-y-0.5">
                  {IDL_BRANCHES.filter(b => b.id !== 'all').map(b => {
                    const isSelected = selectedBranch === b.id;
                    return (
                      <button
                        key={b.id}
                        type="button"
                        onClick={() => {
                          setSelectedBranch(b.id);
                          setIsBranchPickerOpen(false);
                        }}
                        className={`h-8 w-full px-2.5 rounded-lg text-xs flex items-center justify-between gap-2 transition-colors cursor-pointer select-none ${
                          isSelected
                            ? 'bg-blue-50/90 dark:bg-blue-950/40 text-[#2864E8] dark:text-blue-400 font-semibold'
                            : 'text-slate-700 dark:text-slate-200 font-medium hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                        }`}
                      >
                        <span className="flex items-center gap-2 min-w-0">
                          <Building2
                            className={`w-3.5 h-3.5 shrink-0 ${
                              isSelected ? 'text-[#2864E8] dark:text-blue-400' : 'text-slate-400 dark:text-slate-500'
                            }`}
                          />
                          <span className="truncate">{b.name}</span>
                        </span>
                        {isSelected && (
                          <Check className="w-3.5 h-3.5 text-[#2864E8] dark:text-blue-400 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </PopoverContent>
            </Popover>

            {/* 2. Month & Year Calendar Selector (Exact Fee Dashboard UI) */}
            <AttendanceMonthPicker />
          </div>

          {/* Right: Live Attendance Link */}
          <div className="flex items-center gap-2 shrink-0">
            <Link href="/admin/attendance/live">
              <Button className="h-7 px-2.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs gap-1.5 cursor-pointer">
                <Radio className="w-3.5 h-3.5 animate-pulse text-white" />
                <span>Live Attendance (Ongoing)</span>
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* MAIN CONTENT CONTAINER (Fee Dashboard Proportion & Spacing)   */}
      {/* ------------------------------------------------------------- */}
      <div className="container mx-auto p-4 sm:p-6 lg:p-8 max-w-7xl flex-1 space-y-6 pb-12">
        {/* Top Summary Stat Cards (Exact Fee Dashboard Proportions) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4">
          {/* 1. Total Students */}
          <Card className="rounded-2xl border border-[#E9EEF5] dark:border-slate-800 bg-white dark:bg-slate-900 shadow-[0_1px_3px_rgba(15,23,42,0.03)] hover:border-slate-300/80 dark:hover:border-slate-700 transition-all h-full flex flex-col justify-between">
            <CardContent className="p-3.5 sm:p-4 flex flex-col justify-between h-full">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0" />
                <span className="text-[11.5px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-[0.4px]">
                  Students
                </span>
              </div>
              <div className="text-[24px] sm:text-[25px] font-bold text-slate-900 dark:text-white tracking-tight mt-1.5 tabular-nums leading-tight">
                {dashboardStats.totalStudents}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-normal mt-0.5 truncate">
                Active enrolled
              </p>
            </CardContent>
          </Card>

          {/* 2. Today's Classes */}
          <Card className="rounded-2xl border border-[#E9EEF5] dark:border-slate-800 bg-white dark:bg-slate-900 shadow-[0_1px_3px_rgba(15,23,42,0.03)] hover:border-slate-300/80 dark:hover:border-slate-700 transition-all h-full flex flex-col justify-between">
            <CardContent className="p-3.5 sm:p-4 flex flex-col justify-between h-full">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                <span className="text-[11.5px] font-semibold text-blue-700 dark:text-blue-400 uppercase tracking-[0.4px]">
                  Today&apos;s Classes
                </span>
              </div>
              <div className="text-[24px] sm:text-[25px] font-bold text-slate-900 dark:text-white tracking-tight mt-1.5 tabular-nums leading-tight">
                {dashboardStats.todayClassesCount}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-normal mt-0.5 truncate">
                {dashboardStats.completedClassesCount} Completed • {dashboardStats.ongoingClassesCount} Ongoing
              </p>
            </CardContent>
          </Card>

          {/* 3. Present Today */}
          <Card className="rounded-2xl border border-[#E9EEF5] dark:border-slate-800 bg-white dark:bg-slate-900 shadow-[0_1px_3px_rgba(15,23,42,0.03)] hover:border-slate-300/80 dark:hover:border-slate-700 transition-all h-full flex flex-col justify-between">
            <CardContent className="p-3.5 sm:p-4 flex flex-col justify-between h-full">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                <span className="text-[11.5px] font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-[0.4px]">
                  Present Today
                </span>
              </div>
              <div className="text-[24px] sm:text-[25px] font-bold text-emerald-600 dark:text-emerald-400 tracking-tight mt-1.5 tabular-nums leading-tight">
                {dashboardStats.todayPresentCount}
              </div>
              <p className="text-[11px] text-emerald-700/80 dark:text-emerald-400/80 font-normal mt-0.5 truncate">
                {dashboardStats.todayPresentPercent}% attended
              </p>
            </CardContent>
          </Card>

          {/* 4. Absent Today */}
          <Card className="rounded-2xl border border-[#E9EEF5] dark:border-slate-800 bg-white dark:bg-slate-900 shadow-[0_1px_3px_rgba(15,23,42,0.03)] hover:border-slate-300/80 dark:hover:border-slate-700 transition-all h-full flex flex-col justify-between">
            <CardContent className="p-3.5 sm:p-4 flex flex-col justify-between h-full">
              <div className="flex items-center gap-1.5">
                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dashboardStats.todayAbsentCount > 0 ? 'bg-rose-500 animate-pulse' : 'bg-slate-400'}`} />
                <span className={`text-[11.5px] font-semibold uppercase tracking-[0.4px] ${dashboardStats.todayAbsentCount > 0 ? 'text-rose-700 dark:text-rose-400' : 'text-slate-500 dark:text-slate-400'}`}>
                  Absent Today
                </span>
              </div>
              <div className={`text-[24px] sm:text-[25px] font-bold mt-1.5 tracking-tight tabular-nums leading-tight ${dashboardStats.todayAbsentCount > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-slate-800 dark:text-slate-200'}`}>
                {dashboardStats.todayAbsentCount}
              </div>
              <p className={`text-[11px] font-normal mt-0.5 truncate ${dashboardStats.todayAbsentCount > 0 ? 'text-rose-600/80 dark:text-rose-400/80' : 'text-slate-400'}`}>
                {dashboardStats.todayAbsentPercent}% absent
              </p>
            </CardContent>
          </Card>

          {/* 5. On Leave */}
          <Card className="rounded-2xl border border-[#E9EEF5] dark:border-slate-800 bg-white dark:bg-slate-900 shadow-[0_1px_3px_rgba(15,23,42,0.03)] hover:border-slate-300/80 dark:hover:border-slate-700 transition-all h-full flex flex-col justify-between">
            <CardContent className="p-3.5 sm:p-4 flex flex-col justify-between h-full">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                <span className="text-[11.5px] font-semibold text-amber-700 dark:text-amber-400 uppercase tracking-[0.4px]">
                  On Leave
                </span>
              </div>
              <div className="text-[24px] sm:text-[25px] font-bold text-amber-600 dark:text-amber-400 tracking-tight mt-1.5 tabular-nums leading-tight">
                {dashboardStats.todayLeaveCount}
              </div>
              <p className="text-[11px] text-amber-700/80 dark:text-amber-400/80 font-normal mt-0.5 truncate">
                {dashboardStats.todayLeavePercent}% approved leave
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Unified Attendance Dashboard Navigation Tabs */}
        <AttendanceDashboardTabs />

        {/* Main Section: Today's Class Overview Table */}
        <Card className="rounded-2xl border border-[#E9EEF5] dark:border-slate-800 bg-white dark:bg-slate-900 shadow-[0_1px_3px_rgba(15,23,42,0.03)]">
          <CardHeader className="py-3 px-4 sm:px-6 flex flex-row items-center justify-between border-b border-slate-100 dark:border-slate-800/80">
            <div>
              <CardTitle className="text-base sm:text-[17px] font-bold text-slate-900 dark:text-white uppercase flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-[#2864E8]" />
                Today&apos;s Class Overview
              </CardTitle>
              <CardDescription className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Live schedule and real-time attendance counts for today&apos;s classes
              </CardDescription>
            </div>
            <Link
              href="/admin/attendance/schedule"
              className="text-xs font-semibold text-[#2864E8] hover:underline flex items-center gap-1"
            >
              View Full Schedule <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </CardHeader>

          <CardContent className="p-0 overflow-x-auto">
            {filteredTodayClasses.length === 0 ? (
              <div className="py-12 px-4 text-center space-y-3">
                <div className="h-12 w-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
                  <CalendarDays className="h-6 w-6" />
                </div>
                <p className="text-sm font-bold text-slate-800 dark:text-slate-200">No classes scheduled for today</p>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Schedule a regular class or add an extra session to begin live attendance tracking.
                </p>
                <Button
                  size="sm"
                  onClick={() => setIsAddClassOpen(true)}
                  className="bg-[#2864E8] hover:bg-blue-700 text-white font-bold text-xs h-8"
                >
                  + Add Class Session
                </Button>
              </div>
            ) : (
              <table className="w-full text-left text-xs sm:text-sm border-collapse">
                <thead className="bg-slate-50/90 dark:bg-slate-900/70 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-[0.06em] text-[10.5px] border-b border-slate-200/80 dark:border-slate-800/80">
                  <tr>
                    <th className="py-3 px-4 pl-5">Time</th>
                    <th className="py-3 px-3">Class</th>
                    <th className="py-3 px-3">Batch</th>
                    <th className="py-3 px-4">Subject</th>
                    <th className="py-3 px-4">Teacher</th>
                    <th className="py-3 px-3">Duration</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3 text-center">Present / Total</th>
                    <th className="py-3 px-4 pr-5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {filteredTodayClasses.map((item: TDashboardStats['todayClassesOverview'][0]) => {
                  const isOngoing = item.status === 'Ongoing';
                  const isCompleted = item.status === 'Completed';
                  const presentCountStr = (isCompleted || isOngoing)
                    ? `${item.presentCount} / ${item.totalEnrolled}`
                    : `- / ${item.totalEnrolled}`;

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
                            {item.status}
                          </Badge>
                        )}
                      </td>
                      <td className="py-3 px-3 text-center font-bold text-slate-800">
                        {presentCountStr}
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
          )}
        </CardContent>
      </Card>

      {/* Two Column Grid: Today's Absent Students & Attendance Trend Graph */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Today's Absent Students (5 Cols) */}
        <Card className="lg:col-span-5 rounded-2xl border border-[#E9EEF5] dark:border-slate-800 bg-white dark:bg-slate-900 shadow-[0_1px_3px_rgba(15,23,42,0.03)] flex flex-col">
          <CardHeader className="py-3 px-4 sm:px-6 flex flex-row items-center justify-between border-b border-slate-100 dark:border-slate-800/80">
            <div>
              <CardTitle className="text-sm font-bold text-slate-900 dark:text-white uppercase flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-rose-500" />
                Today&apos;s Absent Students
              </CardTitle>
              <CardDescription className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Follow up with parents and log contact remarks
              </CardDescription>
            </div>
            <Link
              href="/admin/attendance/leave?tab=followup"
              className="text-xs font-semibold text-[#2864E8] hover:underline"
            >
              View All →
            </Link>
          </CardHeader>

          <CardContent className="p-4 flex-1 space-y-3">
            {dashboardStats.todayAbsentStudents.length === 0 ? (
              <div className="py-8 px-4 text-center space-y-2 flex-1 flex flex-col items-center justify-center">
                <div className="h-10 w-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">No absences recorded today</p>
                <p className="text-[11px] text-slate-500 max-w-xs">
                  All students attended their scheduled classes or no session was conducted yet.
                </p>
              </div>
            ) : (
              dashboardStats.todayAbsentStudents.slice(0, 4).map((item: TDashboardStats['todayAbsentStudents'][0]) => {
                const isContacted = item.callStatus === 'Contacted';
                return (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 hover:bg-slate-50 dark:hover:bg-slate-800/70 transition-colors"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-900 dark:text-slate-100">{item.studentName}</span>
                        <span className="text-[10px] text-slate-500 font-semibold">
                          {item.className} {item.subject}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                        <span className="text-rose-600 font-bold">{item.missedHours} Missed</span>
                        <span>•</span>
                        <span>{item.contactNumber}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge
                        className={`text-[10px] font-bold ${
                          isContacted
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300'
                            : 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 animate-pulse'
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
                        className="h-7 px-2.5 text-xs font-bold bg-[#2864E8] hover:bg-blue-700 text-white gap-1"
                      >
                        <PhoneCall className="h-3 w-3" />
                        Call
                      </Button>
                    </div>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>

        {/* Attendance Trend Graph (7 Cols) */}
        <Card className="lg:col-span-7 rounded-2xl border border-[#E9EEF5] dark:border-slate-800 bg-white dark:bg-slate-900 shadow-[0_1px_3px_rgba(15,23,42,0.03)] flex flex-col">
          <CardHeader className="py-3 px-4 sm:px-6 flex flex-row items-center justify-between border-b border-slate-100 dark:border-slate-800/80">
            <div>
              <CardTitle className="text-sm font-bold text-slate-900 dark:text-white uppercase flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-[#2864E8]" />
                Attendance Trend (This Month)
              </CardTitle>
              <CardDescription className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Daily institute-wide student attendance rate across all batches
              </CardDescription>
            </div>
            <div className="text-right">
              <span className="text-[11px] text-slate-500 font-medium block">Average</span>
              <span className="text-lg font-black text-emerald-600 dark:text-emerald-400">
                {dashboardStats.trendAverage > 0 ? `${dashboardStats.trendAverage}%` : '—'}
              </span>
            </div>
          </CardHeader>

          <CardContent className="p-4 pt-6 flex-1">
            {dashboardStats.attendanceTrend.length === 0 ? (
              <div className="h-56 w-full flex flex-col items-center justify-center text-center p-4">
                <div className="h-10 w-10 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mb-2">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <p className="text-xs font-bold text-slate-700">No Attendance Trend Recorded Yet</p>
                <p className="text-[11px] text-slate-500 max-w-xs mt-1">
                  Attendance rates across batches will automatically graph here as daily class attendance sessions are completed.
                </p>
              </div>
            ) : (
              <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={dashboardStats.attendanceTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorAtt" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2563eb" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} unit="%" />
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
            )}
          </CardContent>
        </Card>
      </div>
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
