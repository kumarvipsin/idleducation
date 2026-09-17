'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useAttendance } from '@/context/attendance-context';
import {
  Radio,
  Clock,
  Check,
  X,
  PlaneTakeoff,
  LogOut,
  Search,
  Filter,
  CheckSquare,
  Square,
  AlertTriangle,
  Sparkles,
  ChevronDown,
  UserCheck,
  UserX,
  History,
  Info,
  Calendar,
  Layers,
  Edit2,
  CheckCircle2,
  PhoneCall,
  ArrowRight,
  Shield,
  Ban,
  RotateCcw,
  Play,
  User,
  BookOpen,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  StudentStatus,
  formatMinutesToDuration,
  getCurrentTimeFormatted,
  formatDateDisplay,
  TScheduleItem,
} from '@/lib/attendance-store';

export default function LiveAttendancePage() {
  const {
    liveSession,
    schedules,
    students,
    currentRole,
    startLiveSession,
    markStudentPresent,
    bulkMarkPresent,
    markStudentExit,
    markExitAllPresent,
    markStudentStatus,
    bulkResolveUnmarked,
    endLiveSession,
    editAttendanceRecord,
    voidAttendanceRecord,
  } = useAttendance();

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Elapsed Timer
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    if (!liveSession) {
      setElapsedSeconds(0);
      return;
    }
    setElapsedSeconds(0);
    const timer = setInterval(() => {
      setElapsedSeconds(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [liveSession?.id]);

  const formatTimer = (totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs
      .toString()
      .padStart(2, '0')}`;
  };

  // Modals
  const [isEndSessionModalOpen, setIsEndSessionModalOpen] = useState(false);
  const [editTimingStudent, setEditTimingStudent] = useState<any | null>(null);
  const [editCheckIn, setEditCheckIn] = useState('');
  const [editCheckOut, setEditCheckOut] = useState('');
  const [editStatus, setEditStatus] = useState<StudentStatus>('present');
  const [editReason, setEditReason] = useState('Manual verification correction');

  // Custom Exit Modal
  const [exitModalStudent, setExitModalStudent] = useState<any | null>(null);
  const [customExitTime, setCustomExitTime] = useState('');

  // Void Modal
  const [voidModalRecord, setVoidModalRecord] = useState<any | null>(null);
  const [voidReason, setVoidReason] = useState('Attendance marked incorrectly by teacher');

  // Individual leave modal
  const [leaveModalStudent, setLeaveModalStudent] = useState<any | null>(null);
  const [leaveReason, setLeaveReason] = useState('Fever');
  const [leaveRemark, setLeaveRemark] = useState('');

  // Today's date for scheduled classes list
  const todayDate = useMemo(() => new Date().toISOString().split('T')[0], []);

  const todaySchedules = useMemo(() => {
    return schedules.filter(s => s.date === todayDate || s.status === 'Ongoing' || s.status === 'Upcoming');
  }, [schedules, todayDate]);

  // If no live session is currently running, show active schedules to start immediately
  if (!liveSession) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Radio className="h-5 w-5 text-slate-400" />
              <h1 className="text-xl md:text-2xl font-black text-slate-900">Live Attendance Session</h1>
            </div>
            <p className="text-xs md:text-sm text-slate-500 mt-1">
              There is no live session running right now. Choose a scheduled class below to begin live roll-call tracking.
            </p>
          </div>
          <Link href="/admin/attendance/schedule">
            <Button variant="outline" className="text-xs font-bold gap-1.5 border-slate-300">
              <Calendar className="h-3.5 w-3.5 text-slate-500" />
              Manage All Schedules
            </Button>
          </Link>
        </div>

        <Card className="border-slate-200 shadow-xs">
          <CardHeader className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-sm font-bold text-slate-800">
                Scheduled Classes for Today ({formatDateDisplay(todayDate)})
              </CardTitle>
              <CardDescription className="text-xs text-slate-500">
                Select any class below to start live attendance and check-in capture.
              </CardDescription>
            </div>
            <Badge variant="outline" className="bg-white font-mono text-xs font-semibold">
              {todaySchedules.length} Available
            </Badge>
          </CardHeader>

          <CardContent className="p-4 space-y-3">
            {todaySchedules.length === 0 ? (
              <div className="p-8 text-center text-slate-500 space-y-3">
                <Calendar className="h-10 w-10 text-slate-300 mx-auto" />
                <h4 className="font-bold text-slate-800 text-sm">No classes scheduled for today</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Create a schedule entry in the Class Schedule page to start tracking live attendance for your batches.
                </p>
                <Link href="/admin/attendance/schedule">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs h-9 px-4">
                    Create Class Schedule
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {todaySchedules.map(sch => {
                  const enrolledCount = students.filter(
                    s => s.status === 'active' && (s.batchId === sch.batchId || s.batchName === sch.batchName)
                  ).length;

                  return (
                    <div
                      key={sch.id}
                      className="p-4 rounded-xl border border-slate-200 bg-white hover:border-blue-300 hover:shadow-xs transition-all flex flex-col justify-between gap-3"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between gap-2">
                          <Badge className="bg-blue-50 text-blue-800 border-blue-200 font-bold text-[10px]">
                            {sch.className} • {sch.batchName}
                          </Badge>
                          <span className="text-[11px] font-mono font-bold text-slate-600">
                            {sch.startTime} – {sch.endTime}
                          </span>
                        </div>
                        <h3 className="font-bold text-sm text-slate-900">{sch.subject}</h3>
                        <div className="flex items-center gap-4 text-xs text-slate-600">
                          <span className="flex items-center gap-1">
                            <User className="h-3 w-3 text-slate-400" />
                            {sch.teacherName}
                          </span>
                          <span className="flex items-center gap-1">
                            <BookOpen className="h-3 w-3 text-slate-400" />
                            {enrolledCount} enrolled students
                          </span>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-[11px] font-semibold text-slate-500">
                          Duration: {formatMinutesToDuration(sch.durationMinutes)}
                        </span>
                        <Button
                          size="sm"
                          onClick={() => startLiveSession(sch.id)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs h-8 px-3 gap-1.5 shadow-xs"
                        >
                          <Play className="h-3.5 w-3.5 fill-current" />
                          Start Live Attendance
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  const recordsArray = Object.values(liveSession.studentRecords);

  // Counters
  const totalCount = recordsArray.length;
  const presentCount = recordsArray.filter(r => r.status === 'present').length;
  const absentCount = recordsArray.filter(r => r.status === 'absent').length;
  const leaveCount = recordsArray.filter(r => r.status === 'leave').length;
  const notArrivedCount = recordsArray.filter(r => r.status === 'not_arrived').length;

  // Filter students
  const filteredRecords = recordsArray.filter(record => {
    if (searchQuery.trim() && !record.studentName.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (statusFilter !== 'all' && record.status !== statusFilter) {
      return false;
    }
    return true;
  });

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(filteredRecords.map(r => r.studentId));
    } else {
      setSelectedIds([]);
    }
  };

  const handleToggleSelect = (studentId: string) => {
    setSelectedIds(prev =>
      prev.includes(studentId) ? prev.filter(id => id !== studentId) : [...prev, studentId]
    );
  };

  const handleBulkMarkPresent = () => {
    if (selectedIds.length === 0) return;
    bulkMarkPresent(selectedIds);
    setSelectedIds([]);
  };

  const handleBulkMarkAbsent = () => {
    if (selectedIds.length === 0) return;
    selectedIds.forEach(id => {
      markStudentStatus(id, 'absent', 'Unexcused absence');
    });
    setSelectedIds([]);
  };

  const handleBulkMarkLeave = () => {
    if (selectedIds.length === 0) return;
    selectedIds.forEach(id => {
      markStudentStatus(id, 'leave', 'Informed leave');
    });
    setSelectedIds([]);
  };

  const handleEndSessionClick = () => {
    if (notArrivedCount > 0) {
      setIsEndSessionModalOpen(true);
    } else {
      endLiveSession();
    }
  };

  const handleResolveUnmarkedAndFinish = (action: 'absent' | 'leave') => {
    bulkResolveUnmarked(action);
    endLiveSession();
    setIsEndSessionModalOpen(false);
  };

  const handleSaveTimingCorrection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTimingStudent) return;
    editAttendanceRecord(
      liveSession.id,
      editTimingStudent.studentId,
      {
        checkInTime: editCheckIn,
        checkOutTime: editCheckOut,
        status: editStatus,
      },
      editReason
    );
    setEditTimingStudent(null);
  };

  const handleSaveCustomExit = () => {
    if (!exitModalStudent) return;
    markStudentExit(exitModalStudent.studentId, customExitTime || getCurrentTimeFormatted());
    setExitModalStudent(null);
  };

  const handleConfirmVoid = () => {
    if (!voidModalRecord) return;
    voidAttendanceRecord(liveSession.id, voidModalRecord.studentId, voidReason);
    setVoidModalRecord(null);
  };

  const handleSaveLeaveModal = () => {
    if (!leaveModalStudent) return;
    markStudentStatus(leaveModalStudent.studentId, 'leave', `${leaveReason} - ${leaveRemark}`);
    setLeaveModalStudent(null);
    setLeaveRemark('');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header Card */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-xl md:text-2xl font-black tracking-tight text-slate-900">
              {liveSession.className} {liveSession.batchName} — {liveSession.subject}
            </h1>
            <Badge className="bg-emerald-50 text-emerald-700 border-emerald-300 font-bold text-xs gap-1.5 py-1 px-2.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
              <span>Session Running</span>
              <span className="font-mono ml-1">{formatTimer(elapsedSeconds)}</span>
            </Badge>
          </div>
          <p className="text-xs md:text-sm text-slate-500 mt-1 font-medium">
            Live attendance tracking with exact check-in capture. Students default to &quot;Not Arrived&quot;.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            onClick={handleEndSessionClick}
            className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs h-10 px-5 shadow-sm gap-2"
          >
            <LogOut className="h-4 w-4" />
            End Session
          </Button>
        </div>
      </div>

      {/* Info Strip */}
      <div className="bg-slate-900 text-white p-4 rounded-xl shadow-md flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex flex-wrap items-center gap-4 sm:gap-6">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-blue-400" />
            <span className="text-slate-300 font-medium">
              {liveSession.date ? formatDateDisplay(liveSession.date) : formatDateDisplay(todayDate)}
            </span>
          </div>
          <div>
            <span className="text-slate-400">Class:</span>{' '}
            <span className="font-bold text-white">{liveSession.className}</span>
          </div>
          <div>
            <span className="text-slate-400">Batch:</span>{' '}
            <span className="font-bold text-white">{liveSession.batchName}</span>
          </div>
          <div>
            <span className="text-slate-400">Subject:</span>{' '}
            <span className="font-bold text-white">{liveSession.subject}</span>
          </div>
          <div>
            <span className="text-slate-400">Teacher:</span>{' '}
            <span className="font-bold text-blue-300">{liveSession.teacherName}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-slate-800/90 px-3 py-1.5 rounded-lg border border-slate-700">
          <Clock className="h-3.5 w-3.5 text-blue-400" />
          <span className="text-slate-300">Scheduled:</span>
          <span className="font-bold text-white font-mono">
            {liveSession.scheduledStartTime} – {liveSession.scheduledEndTime} (
            {formatMinutesToDuration(liveSession.scheduledDurationMinutes)})
          </span>
        </div>
      </div>

      {/* Live Metric Counters Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Students</span>
            <span className="text-2xl font-black text-slate-900">{totalCount}</span>
          </div>
          <span className="text-xs text-slate-400 font-semibold">Total</span>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs border-l-4 border-l-emerald-500 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider block">Present</span>
            <span className="text-2xl font-black text-emerald-600">{presentCount}</span>
          </div>
          <span className="text-xs text-emerald-600 font-bold">
            {totalCount > 0 ? Math.round((presentCount / totalCount) * 100) : 0}%
          </span>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs border-l-4 border-l-rose-500 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-rose-700 uppercase tracking-wider block">Absent</span>
            <span className="text-2xl font-black text-rose-600">{absentCount}</span>
          </div>
          <span className="text-xs text-rose-600 font-bold">{absentCount}</span>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs border-l-4 border-l-amber-500 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider block">Leave</span>
            <span className="text-2xl font-black text-amber-600">{leaveCount}</span>
          </div>
          <span className="text-xs text-amber-600 font-bold">{leaveCount}</span>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs border-l-4 border-l-slate-400 col-span-2 sm:col-span-1 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">Not Arrived</span>
            <span className="text-2xl font-black text-slate-700">{notArrivedCount}</span>
          </div>
          <Badge variant="outline" className="text-[10px] bg-slate-50 font-bold">
            Pending
          </Badge>
        </div>
      </div>

      {/* Action Toolbar & Search */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            size="sm"
            onClick={handleBulkMarkPresent}
            disabled={selectedIds.length === 0}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs h-9 gap-1.5 shadow-sm disabled:opacity-50"
          >
            <Check className="h-4 w-4" />
            Mark Present (Selected) {selectedIds.length > 0 && `(${selectedIds.length})`}
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={handleBulkMarkAbsent}
            disabled={selectedIds.length === 0}
            className="text-rose-600 border-rose-200 hover:bg-rose-50 font-bold text-xs h-9 gap-1.5 disabled:opacity-50"
          >
            <X className="h-4 w-4" />
            Mark Absent
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={handleBulkMarkLeave}
            disabled={selectedIds.length === 0}
            className="text-amber-700 border-amber-200 hover:bg-amber-50 font-bold text-xs h-9 gap-1.5 disabled:opacity-50"
          >
            <PlaneTakeoff className="h-4 w-4" />
            Mark Leave
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={() => markExitAllPresent()}
            className="text-purple-700 border-purple-200 bg-purple-50/50 hover:bg-purple-100 font-bold text-xs h-9 gap-1.5"
          >
            <LogOut className="h-4 w-4" />
            Mark Exit for All Present
          </Button>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-full sm:w-60">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search students..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-9 h-9 text-xs"
            />
          </div>

          <div className="w-32">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-9 text-xs">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="present">Present</SelectItem>
                <SelectItem value="not_arrived">Not Arrived</SelectItem>
                <SelectItem value="absent">Absent</SelectItem>
                <SelectItem value="leave">Leave</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Main Student Roster Table */}
      <Card className="border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/90 text-slate-600 font-bold border-b border-slate-200 text-[11px] uppercase tracking-wider">
                <th className="py-3 px-3 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === filteredRecords.length && filteredRecords.length > 0}
                    onChange={e => handleSelectAll(e.target.checked)}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                </th>
                <th className="py-3 px-3 w-10">#</th>
                <th className="py-3 px-4">Student Name</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-4">Check-in Time</th>
                <th className="py-3 px-4">Check-out Time</th>
                <th className="py-3 px-4">Attended Duration</th>
                <th className="py-3 px-4 text-right">Actions &amp; Corrections</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRecords.map(record => {
                const isSelected = selectedIds.includes(record.studentId);
                const isPresent = record.status === 'present';
                const isNotArrived = record.status === 'not_arrived';
                const isAbsent = record.status === 'absent';
                const isLeave = record.status === 'leave';

                return (
                  <tr
                    key={record.studentId}
                    className={`hover:bg-slate-50 transition-colors ${
                      isSelected ? 'bg-blue-50/40' : ''
                    } ${record.isVoided ? 'bg-rose-50/20' : ''}`}
                  >
                    <td className="py-3 px-3 text-center">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleToggleSelect(record.studentId)}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                      />
                    </td>

                    <td className="py-3 px-3 text-slate-500 font-mono font-semibold">
                      {record.rollNo}
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/admin/attendance/students/${record.studentId}`}
                          className="font-bold text-slate-900 hover:text-blue-600 hover:underline"
                        >
                          {record.studentName}
                        </Link>
                        {record.isVoided && (
                          <Badge variant="outline" className="text-[9px] text-rose-700 border-rose-300 bg-rose-50">
                            Voided Record
                          </Badge>
                        )}
                        {record.lastEditedAt && (
                          <span className="text-[9px] text-blue-600 font-medium" title={`Edited by ${record.lastEditedBy}: ${record.editReason}`}>
                            (Corrected)
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-3 px-3">
                      {isPresent && (
                        <Badge className="bg-emerald-50 text-emerald-700 border-emerald-300 font-bold text-[10px] gap-1">
                          <Check className="h-3 w-3" />
                          Present
                        </Badge>
                      )}
                      {isNotArrived && (
                        <Badge variant="outline" className="text-slate-500 border-slate-300 font-bold text-[10px]">
                          Not Arrived
                        </Badge>
                      )}
                      {isAbsent && (
                        <Badge className="bg-rose-50 text-rose-700 border-rose-300 font-bold text-[10px] gap-1">
                          <X className="h-3 w-3" />
                          Absent
                        </Badge>
                      )}
                      {isLeave && (
                        <Badge className="bg-amber-50 text-amber-700 border-amber-300 font-bold text-[10px] gap-1">
                          <PlaneTakeoff className="h-3 w-3" />
                          Leave
                        </Badge>
                      )}
                    </td>

                    <td className="py-3 px-4 font-mono text-slate-800 font-medium">
                      {record.checkInTime ? (
                        <span className="flex items-center gap-1.5">
                          <Clock className="h-3 w-3 text-emerald-600" />
                          {record.checkInTime}
                        </span>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>

                    <td className="py-3 px-4 font-mono text-slate-800 font-medium">
                      {record.checkOutTime ? (
                        <span className="flex items-center gap-1.5">
                          <LogOut className="h-3 w-3 text-purple-600" />
                          {record.checkOutTime}
                        </span>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-slate-700 font-medium">
                      {isPresent && (
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-slate-900">
                            {formatMinutesToDuration(record.attendedMinutes)}
                          </span>
                          {!record.checkOutTime && (
                            <span className="text-[10px] text-emerald-600 font-bold italic">
                              (ongoing)
                            </span>
                          )}
                        </div>
                      )}
                      {isNotArrived && <span className="text-slate-400">-</span>}
                      {isAbsent && (
                        <span className="text-rose-600 font-bold">
                          0h (Missed {formatMinutesToDuration(liveSession.scheduledDurationMinutes)})
                        </span>
                      )}
                      {isLeave && (
                        <span className="text-amber-700 font-medium">
                          Leave ({record.leaveReason || 'Informed leave'})
                        </span>
                      )}
                    </td>

                    {/* Actions & Administrative Correction Controls */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {isNotArrived && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => markStudentPresent(record.studentId)}
                              className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs h-7 px-3 gap-1 shadow-xs"
                            >
                              <Check className="h-3.5 w-3.5" />
                              Mark Present
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setLeaveModalStudent(record)}
                              className="text-amber-700 hover:bg-amber-50 h-7 px-2 text-xs"
                            >
                              Leave
                            </Button>
                          </>
                        )}

                        {isPresent && !record.checkOutTime && (
                          <div className="flex items-center gap-1">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => markStudentExit(record.studentId)}
                              className="text-rose-600 border-rose-200 hover:bg-rose-50 font-bold text-xs h-7 px-2.5 gap-1"
                              title="Mark Student Exit Now"
                            >
                              <LogOut className="h-3 w-3" />
                              Exit Now
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                setExitModalStudent(record);
                                setCustomExitTime(getCurrentTimeFormatted());
                              }}
                              className="text-slate-600 hover:text-slate-900 h-7 px-1.5 text-xs"
                              title="Set Custom Exit Time"
                            >
                              <Clock className="h-3 w-3" />
                            </Button>
                          </div>
                        )}

                        {/* Admin Correction & Voiding Dropdown Actions */}
                        {(isPresent || isAbsent || isLeave) && (
                          <>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                setEditTimingStudent(record);
                                setEditCheckIn(record.checkInTime || liveSession.scheduledStartTime || getCurrentTimeFormatted());
                                setEditCheckOut(record.checkOutTime || liveSession.scheduledEndTime || getCurrentTimeFormatted());
                                setEditStatus(record.status);
                                setEditReason('Manual teacher attendance correction');
                              }}
                              className="text-slate-600 hover:text-blue-600 h-7 px-2 text-xs"
                              title="Edit Attendance with Audit Log"
                            >
                              <Edit2 className="h-3 w-3 mr-1" />
                              Edit
                            </Button>

                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                setVoidModalRecord(record);
                                setVoidReason('Attendance marked incorrectly');
                              }}
                              className="text-rose-600 hover:bg-rose-50 h-7 px-2 text-xs"
                              title="Void Attendance Record (Audit Logged)"
                            >
                              <Ban className="h-3 w-3 mr-1" />
                              Void
                            </Button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Custom Exit Time Modal */}
      <Dialog open={!!exitModalStudent} onOpenChange={open => !open && setExitModalStudent(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-sm font-bold flex items-center gap-2">
              <LogOut className="h-4 w-4 text-rose-600" />
              Student Exit: {exitModalStudent?.studentName}
            </DialogTitle>
            <DialogDescription className="text-xs">
              Record specific early exit or departure time for this student.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2 text-xs">
            <div>
              <Label className="text-xs font-semibold">Exit Time (e.g. 04:45 PM)</Label>
              <Input
                value={customExitTime}
                onChange={e => setCustomExitTime(e.target.value)}
                placeholder="04:45 PM"
                className="mt-1 h-9 text-xs font-mono"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setExitModalStudent(null)}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleSaveCustomExit} className="bg-rose-600 hover:bg-rose-700 text-white font-bold">
              Record Exit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Audit Logged Attendance Correction Modal */}
      <Dialog open={!!editTimingStudent} onOpenChange={open => !open && setEditTimingStudent(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              <Shield className="h-4 w-4 text-blue-600" />
              Correct Attendance Record
            </DialogTitle>
            <DialogDescription className="text-xs">
              Student: <strong>{editTimingStudent?.studentName}</strong> • Role: <strong>{currentRole}</strong>
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveTimingCorrection} className="space-y-3 py-2 text-xs">
            <div>
              <Label className="text-xs font-semibold">Attendance Status</Label>
              <Select value={editStatus} onValueChange={(v: any) => setEditStatus(v)}>
                <SelectTrigger className="mt-1 h-9 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="present">Present</SelectItem>
                  <SelectItem value="absent">Absent</SelectItem>
                  <SelectItem value="leave">Leave</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs font-semibold">Check-in Time</Label>
                <Input
                  value={editCheckIn}
                  onChange={e => setEditCheckIn(e.target.value)}
                  className="mt-1 h-9 text-xs font-mono"
                />
              </div>
              <div>
                <Label className="text-xs font-semibold">Check-out Time</Label>
                <Input
                  value={editCheckOut}
                  onChange={e => setEditCheckOut(e.target.value)}
                  className="mt-1 h-9 text-xs font-mono"
                />
              </div>
            </div>

            <div>
              <Label className="text-xs font-semibold text-slate-800">
                Mandatory Reason for Change (Audit Requirement) *
              </Label>
              <Input
                placeholder="e.g. Bus breakdown, verified manual attendance sheet..."
                value={editReason}
                onChange={e => setEditReason(e.target.value)}
                className="mt-1 h-9 text-xs"
                required
              />
            </div>

            <DialogFooter className="pt-2">
              <Button variant="outline" size="sm" type="button" onClick={() => setEditTimingStudent(null)}>
                Cancel
              </Button>
              <Button size="sm" type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold">
                Confirm &amp; Log Audit Record
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Void Attendance Record Modal */}
      <Dialog open={!!voidModalRecord} onOpenChange={open => !open && setVoidModalRecord(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-rose-700 flex items-center gap-2">
              <Ban className="h-5 w-5 text-rose-600" />
              Void Attendance: {voidModalRecord?.studentName}?
            </DialogTitle>
            <DialogDescription className="text-xs">
              Voiding marks the record as invalid and resets attended minutes. The previous record remains preserved in the audit log.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2 text-xs">
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-950 space-y-1">
              <p><strong>Admin Role:</strong> {currentRole}</p>
              <p><strong>Timestamp:</strong> {getCurrentTimeFormatted()}</p>
              <p><strong>Previous Status:</strong> {voidModalRecord?.status} (Check-in: {voidModalRecord?.checkInTime || '-'})</p>
            </div>

            <div>
              <Label className="text-xs font-semibold">
                Mandatory Void Reason *
              </Label>
              <Textarea
                placeholder="Provide reason for voiding attendance record..."
                value={voidReason}
                onChange={e => setVoidReason(e.target.value)}
                className="mt-1 text-xs h-16"
                required
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" size="sm" onClick={() => setVoidModalRecord(null)}>
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleConfirmVoid}
              className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs"
            >
              Confirm Void &amp; Record Audit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* End Session Review Modal */}
      <Dialog open={isEndSessionModalOpen} onOpenChange={setIsEndSessionModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base font-bold text-amber-700">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
              {notArrivedCount} students are still unmarked!
            </DialogTitle>
            <DialogDescription className="text-xs">
              Class session is ending. Please decide how to resolve students who never checked in.
            </DialogDescription>
          </DialogHeader>

          <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl text-xs space-y-2 text-amber-900">
            <p className="font-semibold">
              Students who have not arrived will be converted according to your choice:
            </p>
            <ul className="list-disc list-inside space-y-1 text-slate-700">
              <li>
                <strong>Mark as Absent:</strong> Creates an absence follow-up record for parent calling.
              </li>
              <li>
                <strong>Mark as Leave:</strong> Records leave with informed status (does not penalize).
              </li>
            </ul>
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2 pt-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEndSessionModalOpen(false)}
              className="text-xs"
            >
              Review Individually
            </Button>
            <Button
              size="sm"
              onClick={() => handleResolveUnmarkedAndFinish('leave')}
              className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs"
            >
              Mark Remaining as Leave
            </Button>
            <Button
              size="sm"
              onClick={() => handleResolveUnmarkedAndFinish('absent')}
              className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs"
            >
              Mark Remaining as Absent
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Individual Leave Modal */}
      <Dialog open={!!leaveModalStudent} onOpenChange={open => !open && setLeaveModalStudent(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-sm font-bold">Record Student Leave</DialogTitle>
            <DialogDescription className="text-xs">
              {leaveModalStudent?.studentName} • Batch {liveSession.batchName}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2 text-xs">
            <div>
              <Label className="text-xs font-semibold">Reason for Leave</Label>
              <Select value={leaveReason} onValueChange={setLeaveReason}>
                <SelectTrigger className="mt-1 h-9 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Fever">Fever</SelectItem>
                  <SelectItem value="Medical">Medical</SelectItem>
                  <SelectItem value="Family Function">Family Function</SelectItem>
                  <SelectItem value="Personal Work">Personal Work</SelectItem>
                  <SelectItem value="Out of Station">Out of Station</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs font-semibold">Remark / Who Informed</Label>
              <Input
                value={leaveRemark}
                onChange={e => setLeaveRemark(e.target.value)}
                placeholder="e.g. Parent called morning..."
                className="mt-1 h-9 text-xs"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setLeaveModalStudent(null)}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleSaveLeaveModal} className="bg-amber-600 hover:bg-amber-700 text-white font-bold">
              Record Leave
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
