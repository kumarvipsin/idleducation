'use client';

import React, { useState, useMemo, useRef } from 'react';
import { useAttendance } from '@/context/attendance-context';
import {
  Check,
  X,
  Search,
  Building2,
  Globe,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  PlaneTakeoff,
  RotateCcw,
  UserCheck,
  Users,
  Clock,
  Edit3,
  Calendar,
  CalendarDays,
  CalendarOff,
  CalendarCheck,
  Sun,
  Sparkles,
  LogOut,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AttendanceDashboardTabs } from '@/components/attendance/attendance-dashboard-tabs';
import { AttendanceMonthPicker, formatMonthYearLabel } from '@/components/attendance/attendance-month-picker';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { StudentStatus, TStudent, getCurrentTimeFormatted } from '@/lib/attendance-store';

// Branches list matching Fees Management, Classes & Students pages
const IDL_BRANCHES = [
  { id: 'all', name: 'All Branches' },
  { id: 'budh-vihar', name: 'Budh Vihar' },
  { id: 'krishan-vihar', name: 'Krishan Vihar' },
  { id: 'mangolpuri', name: 'Mangol Puri' },
  { id: 'mukherjee-nagar', name: 'Mukherjee Nagar' },
];

const QUICK_OFF_REASONS = [
  'Festival Holiday',
  'Coaching Off',
  'Rain / Weather Off',
  'Exam Prep Off',
];

const DAY_NAMES_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MON_TO_SUN_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function parseDateLocal(dateStr: string): Date {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, (m || 1) - 1, d || 1);
}

function toDateStr(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function addDays(dateStr: string, delta: number): string {
  const d = parseDateLocal(dateStr);
  d.setDate(d.getDate() + delta);
  return toDateStr(d);
}

function addMonths(ym: string, delta: number): string {
  const [yStr, mStr] = (ym || '2026-09').split('-');
  const d = new Date(parseInt(yStr, 10) || 2026, (parseInt(mStr, 10) || 9) - 1 + delta, 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

function formatFullDate(dateStr: string): string {
  const d = parseDateLocal(dateStr);
  return d.toLocaleDateString('en-GB', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function formatShortDate(dateStr: string): string {
  const d = parseDateLocal(dateStr);
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
}

function getWeekDatesMonToSun(anchorDateStr: string): string[] {
  const d = parseDateLocal(anchorDateStr);
  const dow = d.getDay(); // 0=Sun, 1=Mon...6=Sat
  const diffToMon = dow === 0 ? -6 : 1 - dow;
  const mon = new Date(d);
  mon.setDate(d.getDate() + diffToMon);
  const result: string[] = [];
  for (let i = 0; i < 7; i++) {
    const cur = new Date(mon);
    cur.setDate(mon.getDate() + i);
    result.push(toDateStr(cur));
  }
  return result;
}

function getMonthCalendarCells(ym: string): Array<string | null> {
  const [yStr, mStr] = (ym || '2026-09').split('-');
  const y = parseInt(yStr, 10) || 2026;
  const m = parseInt(mStr, 10) || 9;
  const firstDay = new Date(y, m - 1, 1);
  const daysInMonth = new Date(y, m, 0).getDate();
  // Monday-based offset: Mon=0 ... Sun=6
  const startOffset = (firstDay.getDay() + 6) % 7;
  const cells: Array<string | null> = [];
  for (let i = 0; i < startOffset; i++) cells.push(null);
  for (let day = 1; day <= daysInMonth; day++) {
    cells.push(`${y}-${String(m).padStart(2, '0')}-${String(day).padStart(2, '0')}`);
  }
  return cells;
}

function parseTimeToMinutes(timeStr?: string): number | null {
  if (!timeStr) return null;
  const trimmed = timeStr.trim();
  if (!trimmed || trimmed === '—' || trimmed === '-') return null;
  const match = trimmed.match(/^(\d{1,2}):(\d{2})(?:\s*(AM|PM))?$/i);
  if (!match) return null;
  let hh = parseInt(match[1], 10);
  const mm = parseInt(match[2], 10);
  const meridiem = match[3]?.toUpperCase();
  if (Number.isNaN(hh) || Number.isNaN(mm) || mm < 0 || mm > 59) return null;
  // Treat reset placeholder 00:00 as unset
  if (hh === 0 && mm === 0) return null;
  if (meridiem) {
    if (hh < 1 || hh > 12) return null;
    if (meridiem === 'AM') {
      hh = hh === 12 ? 0 : hh;
    } else {
      hh = hh === 12 ? 12 : hh + 12;
    }
  } else if (hh < 0 || hh > 23) {
    return null;
  }
  return hh * 60 + mm;
}

function formatDuration(inTime?: string, outTime?: string): string | null {
  const start = parseTimeToMinutes(inTime);
  const end = parseTimeToMinutes(outTime);
  if (start === null || end === null) return null;
  let diff = end - start;
  if (diff < 0) diff += 24 * 60; // Handle overnight / past-midnight sessions (e.g., 11:22 PM -> 01:00 AM)
  const hours = Math.floor(diff / 60);
  const mins = diff % 60;
  if (hours > 0) return `${hours}h ${mins}m`;
  return `${mins}m`;
}

type DayStatusType = 'working' | 'sunday_off' | 'sunday_class' | 'holiday';

export default function LiveAttendancePage() {
  const {
    students,
    classes,
    batches,
    holidays,
    addHoliday,
    deleteHoliday,
    attendanceSessions,
    liveSession,
    selectedDate,
    setSelectedDate,
    todayDateStr,
    minDateStr,
    selectedMonth,
    selectedBranch,
    setSelectedBranch,
    isBranchLocked,
    activeSundayDates,
    toggleSundayClass,
    dailyAttendanceByDate,
    markDateStudentStatus,
    bulkMarkDatePresent,
    bulkMarkBatchOutTime,
    resetDateAttendance,
  } = useAttendance();

  // Branch Selection Popover
  const [isBranchPickerOpen, setIsBranchPickerOpen] = useState(false);

  // Class & Batch-wise Out Time Popover State
  const [isBatchOutOpen, setIsBatchOutOpen] = useState(false);
  const [batchOutClassId, setBatchOutClassId] = useState<string>('');
  const [batchOutTargetId, setBatchOutTargetId] = useState<string>('all');
  const [batchOutTimeInput, setBatchOutTimeInput] = useState<string>('');
  const [batchOutPeriod, setBatchOutPeriod] = useState<'AM' | 'PM'>('PM');
  const [batchOutOnlyEmpty, setBatchOutOnlyEmpty] = useState<boolean>(true);

  // Holiday / Off Popover
  const [isMarkOffOpen, setIsMarkOffOpen] = useState(false);
  const [customOffReason, setCustomOffReason] = useState('');

  // Individual Student Weekly / Monthly Modal State
  const [inspectStudent, setInspectStudent] = useState<TStudent | null>(null);
  const [modalMode, setModalMode] = useState<'weekly' | 'monthly'>('weekly');
  const [modalWeekAnchor, setModalWeekAnchor] = useState<string>(selectedDate);
  const [modalMonth, setModalMonth] = useState<string>(selectedMonth);

  // Filters
  const [selectedClassId, setSelectedClassId] = useState<string>('all');
  const [selectedBatchId, setSelectedBatchId] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Arrival & Exit time editing state
  const [editingTimeStudentId, setEditingTimeStudentId] = useState<string | null>(null);
  const [customTimeInput, setCustomTimeInput] = useState('');
  const [customInPeriod, setCustomInPeriod] = useState<'AM' | 'PM'>('PM');
  const [customOutTimeInput, setCustomOutTimeInput] = useState('');
  const [customOutPeriod, setCustomOutPeriod] = useState<'AM' | 'PM'>('PM');

  // Parse "04:00 PM" -> { time: "04:00", period: "PM" }
  const splitTime12h = (raw?: string, fallbackPeriod: 'AM' | 'PM' = 'PM'): { time: string; period: 'AM' | 'PM' } => {
    const val = (raw || '').trim();
    if (!val) return { time: '', period: fallbackPeriod };
    const m = val.match(/^(\d{1,2}:\d{2})\s*(AM|PM)?$/i);
    if (m) {
      return {
        time: m[1],
        period: (m[2]?.toUpperCase() as 'AM' | 'PM') || fallbackPeriod,
      };
    }
    return { time: val.replace(/\s*(AM|PM)\s*$/i, ''), period: /AM/i.test(val) ? 'AM' : fallbackPeriod };
  };

  // Combine "04:00" + "PM" -> "04:00 PM" (always preserves AM/PM & normalizes shorthand like "6" -> "06:00")
  const combineTime12h = (timeStr: string, period: 'AM' | 'PM'): string => {
    const clean = timeStr.replace(/\s*(AM|PM)\s*$/i, '').trim();
    if (!clean) return '';
    // Normalize "6" -> "06:00" or "6:5" -> "06:05"
    const onlyHour = clean.match(/^(\d{1,2})$/);
    if (onlyHour) {
      return `${onlyHour[1].padStart(2, '0')}:00 ${period}`;
    }
    const hm = clean.match(/^(\d{1,2}):(\d{1,2})$/);
    if (hm) {
      return `${hm[1].padStart(2, '0')}:${hm[2].padStart(2, '0')} ${period}`;
    }
    return `${clean} ${period}`;
  };

  const toolbarControlClass =
    'h-7 px-0.5 py-0.5 bg-transparent hover:bg-transparent border-0 rounded-none shadow-none ring-0 outline-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 text-xs sm:text-[13px] font-semibold text-[#172033] dark:text-slate-100 hover:text-[#2864E8] dark:hover:text-blue-400 inline-flex items-center gap-1.5 transition-colors cursor-pointer shrink-0';

  const openStudentAttendanceModal = (student: TStudent) => {
    setInspectStudent(student);
    setModalWeekAnchor(selectedDate);
    setModalMonth(selectedDate.slice(0, 7) || selectedMonth);
  };

  // Active holidays lookup by date (YYYY-MM-DD -> THoliday)
  const holidayByDate = useMemo(() => {
    const map: Record<string, (typeof holidays)[number]> = {};
    for (const h of holidays) {
      if (h.status !== 'archived' && h.date) {
        map[h.date] = h;
      }
    }
    return map;
  }, [holidays]);

  // Helper: Determine day status (Mon-Sat regular, Sunday off unless enabled, or declared holiday)
  const getDayInfo = (dateStr: string): { type: DayStatusType; label: string; isWorking: boolean; holidayId?: string } => {
    const holiday = holidayByDate[dateStr];
    if (holiday) {
      return {
        type: 'holiday',
        label: holiday.title || 'Holiday / Class Off',
        isWorking: false,
        holidayId: holiday.id,
      };
    }
    const dow = parseDateLocal(dateStr).getDay();
    if (dow === 0) {
      if (activeSundayDates.includes(dateStr)) {
        return {
          type: 'sunday_class',
          label: 'Special Sunday Class',
          isWorking: true,
        };
      }
      return {
        type: 'sunday_off',
        label: 'Sunday Off',
        isWorking: false,
      };
    }
    return {
      type: 'working',
      label: 'Regular Class Day',
      isWorking: true,
    };
  };

  // Historical sessions lookup by date -> studentId -> record
  const sessionRecordsByDate = useMemo(() => {
    const map: Record<string, Record<string, { status: StudentStatus; checkInTime?: string; checkOutTime?: string }>> = {};
    for (const sess of attendanceSessions) {
      if (!sess.date || !sess.studentRecords) continue;
      if (!map[sess.date]) map[sess.date] = {};
      for (const rec of Object.values(sess.studentRecords)) {
        if (!rec || rec.isVoided) continue;
        const st = rec.status === 'live' ? 'present' : rec.status;
        map[sess.date][rec.studentId] = {
          status: st,
          checkInTime: rec.checkInTime,
          checkOutTime: rec.checkOutTime,
        };
      }
    }
    return map;
  }, [attendanceSessions]);

  // Unified getter: get student's attendance status & check-in/out time for ANY date
  const getStudentRecordForDate = (
    dateStr: string,
    studentId: string
  ): { status: StudentStatus; checkInTime?: string; checkOutTime?: string } => {
    const dailyRec = dailyAttendanceByDate[dateStr]?.[studentId];
    if (dailyRec) {
      return {
        status: dailyRec.status === 'live' ? 'present' : dailyRec.status,
        checkInTime: dailyRec.checkInTime,
        checkOutTime: dailyRec.checkOutTime,
      };
    }
    if (
      liveSession &&
      liveSession.studentRecords &&
      liveSession.studentRecords[studentId] &&
      liveSession.date === dateStr
    ) {
      const rec = liveSession.studentRecords[studentId];
      return {
        status: rec.status === 'live' ? 'present' : rec.status,
        checkInTime: rec.checkInTime,
        checkOutTime: rec.checkOutTime,
      };
    }
    const histRec = sessionRecordsByDate[dateStr]?.[studentId];
    if (histRec) return histRec;
    return { status: 'not_arrived' };
  };

  const activeDayInfo = getDayInfo(selectedDate);

  // Filter classes by selected branch
  const availableClasses = useMemo(() => {
    if (selectedBranch === 'all') return classes.filter(c => c.status === 'active');
    return classes.filter(c => c.status === 'active' && (!c.branchId || c.branchId === selectedBranch));
  }, [classes, selectedBranch]);

  // Filter batches by selected branch and selected class
  const availableBatches = useMemo(() => {
    return batches.filter(b => {
      if (b.status === 'archived') return false;
      if (selectedClassId !== 'all' && b.classId !== selectedClassId) return false;
      if (selectedBranch !== 'all') {
        const parentClass = classes.find(c => c.id === b.classId);
        const branchMatch = b.branchId === selectedBranch || parentClass?.branchId === selectedBranch;
        if (!branchMatch) return false;
      }
      return true;
    });
  }, [batches, classes, selectedClassId, selectedBranch]);

  // Filtered Students Roster (Daily)
  const filteredStudents = useMemo(() => {
    return students.filter(st => {
      if (st.status === 'archived') return false;

      if (selectedBranch !== 'all') {
        const parentClass = classes.find(c => c.id === st.classId);
        const parentBatch = batches.find(b => b.id === st.batchId);
        const branchMatch =
          st.branchId === selectedBranch ||
          parentClass?.branchId === selectedBranch ||
          parentBatch?.branchId === selectedBranch;
        if (!branchMatch) return false;
      }

      if (selectedClassId !== 'all' && st.classId !== selectedClassId) return false;
      if (selectedBatchId !== 'all' && st.batchId !== selectedBatchId && st.batchName !== selectedBatchId) return false;

      if (statusFilter !== 'all') {
        const currentSt = getStudentRecordForDate(selectedDate, st.id).status;
        if (statusFilter === 'present' && currentSt !== 'present') return false;
        if (statusFilter === 'absent' && currentSt !== 'absent') return false;
        if (statusFilter === 'leave' && currentSt !== 'leave') return false;
        if (statusFilter === 'unmarked' && currentSt !== 'not_arrived') return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const match =
          st.name.toLowerCase().includes(q) ||
          String(st.rollNo).includes(q) ||
          (st.phone && st.phone.includes(q)) ||
          (st.parentName && st.parentName.toLowerCase().includes(q));
        if (!match) return false;
      }

      return true;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    students,
    classes,
    batches,
    selectedBranch,
    selectedClassId,
    selectedBatchId,
    statusFilter,
    selectedDate,
    searchQuery,
    liveSession,
    dailyAttendanceByDate,
    sessionRecordsByDate,
  ]);

  // KPI Metrics for selectedDate
  const metrics = useMemo(() => {
    const scopeStudents = students.filter(st => {
      if (st.status === 'archived') return false;
      if (selectedBranch !== 'all') {
        const parentClass = classes.find(c => c.id === st.classId);
        const parentBatch = batches.find(b => b.id === st.batchId);
        const branchMatch =
          st.branchId === selectedBranch ||
          parentClass?.branchId === selectedBranch ||
          parentBatch?.branchId === selectedBranch;
        if (!branchMatch) return false;
      }
      if (selectedClassId !== 'all' && st.classId !== selectedClassId) return false;
      if (selectedBatchId !== 'all' && st.batchId !== selectedBatchId && st.batchName !== selectedBatchId) return false;
      return true;
    });

    const total = scopeStudents.length;
    let present = 0;
    let absent = 0;
    let leave = 0;

    if (activeDayInfo.isWorking) {
      for (const st of scopeStudents) {
        const rec = getStudentRecordForDate(selectedDate, st.id).status;
        if (rec === 'present' || rec === 'late') present++;
        else if (rec === 'absent') absent++;
        else if (rec === 'leave') leave++;
      }
    }

    const presentPercent = total > 0 ? Math.round((present / total) * 100) : 0;
    return { total, present, absent, leave, presentPercent };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    students,
    classes,
    batches,
    selectedBranch,
    selectedClassId,
    selectedBatchId,
    selectedDate,
    activeDayInfo.isWorking,
    liveSession,
    dailyAttendanceByDate,
    sessionRecordsByDate,
  ]);

  const handleMarkAllVisiblePresent = () => {
    if (!activeDayInfo.isWorking) return;
    const idsToMark = filteredStudents.map(s => s.id);
    if (idsToMark.length === 0) return;
    bulkMarkDatePresent(selectedDate, idsToMark);
  };

  // Helper: extract scheduled end time from batch.classTime (e.g. "04:00 PM - 06:00 PM" -> "06:00 PM")
  const getBatchDefaultOutTime = (batchId: string) => {
    const b = batches.find(item => item.id === batchId);
    if (b?.classTime && b.classTime.includes('-')) {
      const endPart = b.classTime.split('-')[1]?.trim();
      if (endPart) return endPart;
    }
    return getCurrentTimeFormatted();
  };

  // Batches belonging to the selected Class inside Batch Out Time popover
  const batchesForOutClass = useMemo(() => {
    return batches.filter(b => {
      if (b.status === 'archived') return false;
      if (batchOutClassId && batchOutClassId !== 'all' && b.classId !== batchOutClassId) return false;
      if (selectedBranch !== 'all') {
        const parentClass = classes.find(c => c.id === b.classId);
        const branchMatch = b.branchId === selectedBranch || parentClass?.branchId === selectedBranch;
        if (!branchMatch) return false;
      }
      return true;
    });
  }, [batches, classes, batchOutClassId, selectedBranch]);

  // Present students inside the selected Class & Batch for Bulk Out Time
  const presentStudentsInTargetBatch = useMemo(() => {
    if (!batchOutClassId || !activeDayInfo.isWorking) return [];
    return students.filter(st => {
      if (st.status === 'archived') return false;
      if (selectedBranch !== 'all') {
        const parentClass = classes.find(c => c.id === st.classId);
        const parentBatch = batches.find(b => b.id === st.batchId);
        const branchMatch =
          st.branchId === selectedBranch ||
          parentClass?.branchId === selectedBranch ||
          parentBatch?.branchId === selectedBranch;
        if (!branchMatch) return false;
      }
      if (batchOutClassId !== 'all' && st.classId !== batchOutClassId) return false;
      if (batchOutTargetId !== 'all' && st.batchId !== batchOutTargetId && st.batchName !== batchOutTargetId) return false;
      const rec = getStudentRecordForDate(selectedDate, st.id);
      return rec.status === 'present' || rec.status === 'late';
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [batchOutClassId, batchOutTargetId, students, classes, batches, selectedBranch, selectedDate, activeDayInfo.isWorking, liveSession, dailyAttendanceByDate, sessionRecordsByDate]);

  const handleApplyBatchOutTime = () => {
    if (!activeDayInfo.isWorking || !batchOutClassId) return;
    const targetIds = presentStudentsInTargetBatch
      .filter(st => {
        if (!batchOutOnlyEmpty) return true;
        const rec = getStudentRecordForDate(selectedDate, st.id);
        return !rec.checkOutTime;
      })
      .map(st => st.id);
    if (targetIds.length === 0) return;
    const fallbackBatchId = batchOutTargetId !== 'all' ? batchOutTargetId : batchesForOutClass[0]?.id || '';
    const formattedOut =
      combineTime12h(batchOutTimeInput, batchOutPeriod) || getBatchDefaultOutTime(fallbackBatchId);
    bulkMarkBatchOutTime(selectedDate, targetIds, formattedOut, batchOutOnlyEmpty);
    setIsBatchOutOpen(false);
  };

  const handleReset = () => {
    const idsToReset = filteredStudents.map(s => s.id);
    resetDateAttendance(selectedDate, idsToReset);
  };

  const handleDeclareDayOff = (reasonTitle: string) => {
    const cleanTitle = reasonTitle.trim() || 'Coaching Off';
    addHoliday({
      title: cleanTitle,
      date: selectedDate,
      type: 'Institute Holiday',
      reason: `Marked off from Live Attendance (${cleanTitle})`,
      status: 'active',
    });
    setCustomOffReason('');
    setIsMarkOffOpen(false);
  };

  const handleCycleCellStatus = (dateStr: string, studentId: string) => {
    if (dateStr < minDateStr || dateStr > todayDateStr) return;
    const info = getDayInfo(dateStr);
    if (!info.isWorking) return;
    const current = getStudentRecordForDate(dateStr, studentId).status;
    const next: StudentStatus =
      current === 'present'
        ? 'absent'
        : current === 'absent'
          ? 'leave'
          : 'present';
    markDateStudentStatus(dateStr, studentId, next);
  };

  const selectedBranchObj = IDL_BRANCHES.find(b => b.id === selectedBranch);

  // Modal Computed Data (Individual Student Weekly / Monthly)
  const modalWeekDates = useMemo(() => getWeekDatesMonToSun(modalWeekAnchor), [modalWeekAnchor]);
  const modalMonthCells = useMemo(() => getMonthCalendarCells(modalMonth), [modalMonth]);

  return (
    <div className="min-h-[calc(100svh-68px)] flex-1 flex flex-col overflow-x-hidden">
      {/* ------------------------------------------------------------- */}
      {/* TOP TOOLBAR (Exact Fee Management 100% Edge-to-Edge Style)    */}
      {/* ------------------------------------------------------------- */}
      <section
        aria-label="Live attendance toolbar"
        className="w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border-b border-[#E5EAF2] dark:border-slate-800 md:sticky md:top-0 z-40"
      >
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between flex-wrap gap-4 sm:gap-6 min-w-0">
          {/* Left: Branch Selector + Month/Year Calendar + Live Status Pill */}
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
                    {selectedBranch === 'all'
                      ? 'All Branches'
                      : selectedBranchObj?.name || 'All Branches'}
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

            {/* 2. Month & Year Calendar Selector */}
            <AttendanceMonthPicker />
          </div>

          {/* Right: Dynamic Live Status Indicator */}
          <div className="flex items-center gap-2 shrink-0 flex-wrap">
            {activeDayInfo.type === 'working' && (
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50/70 dark:bg-emerald-950/30 px-2.5 py-0.5 rounded-full border border-emerald-200/60 dark:border-emerald-800/50">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span>Live Active</span>
              </div>
            )}
            {activeDayInfo.type === 'sunday_class' && (
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2864E8] dark:text-blue-400 bg-blue-50/80 dark:bg-blue-950/40 px-2.5 py-0.5 rounded-full border border-blue-200/70 dark:border-blue-800/60">
                <Sparkles className="w-3 h-3 shrink-0" />
                <span>Special Sunday Class</span>
              </div>
            )}
            {activeDayInfo.type === 'sunday_off' && (
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-100/90 dark:bg-slate-800/80 px-2.5 py-0.5 rounded-full border border-slate-200/80 dark:border-slate-700">
                <Sun className="w-3 h-3 text-slate-500 shrink-0" />
                <span>Sunday Off</span>
              </div>
            )}
            {activeDayInfo.type === 'holiday' && (
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700 dark:text-amber-300 bg-amber-50/80 dark:bg-amber-950/40 px-2.5 py-0.5 rounded-full border border-amber-200/70 dark:border-amber-800/60">
                <CalendarOff className="w-3 h-3 shrink-0" />
                <span className="truncate max-w-[160px]">{activeDayInfo.label}</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* MAIN CONTENT CONTAINER                                        */}
      {/* ------------------------------------------------------------- */}
      <div className="container mx-auto p-4 sm:p-6 lg:p-8 max-w-7xl flex-1 space-y-6 pb-12">
        {/* KPI Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 sm:gap-4">
          <Card className="rounded-2xl border border-[#E9EEF5] dark:border-slate-800 bg-white dark:bg-slate-900 shadow-[0_1px_3px_rgba(15,23,42,0.03)] hover:border-slate-300/80 dark:hover:border-slate-700 transition-all h-full flex flex-col justify-between">
            <CardContent className="p-3.5 sm:p-4 flex flex-col justify-between h-full">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0" />
                <span className="text-[11.5px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-[0.4px]">
                  Total Students
                </span>
              </div>
              <div className="text-[24px] sm:text-[25px] font-bold text-slate-900 dark:text-white tracking-tight mt-1.5 tabular-nums leading-tight">
                {metrics.total}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-normal mt-0.5 truncate">
                {activeDayInfo.isWorking ? 'Active enrolled in filter' : `${activeDayInfo.label}`}
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border border-[#E9EEF5] dark:border-slate-800 bg-white dark:bg-slate-900 shadow-[0_1px_3px_rgba(15,23,42,0.03)] hover:border-slate-300/80 dark:hover:border-slate-700 transition-all h-full flex flex-col justify-between">
            <CardContent className="p-3.5 sm:p-4 flex flex-col justify-between h-full">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                <span className="text-[11.5px] font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-[0.4px]">
                  Present
                </span>
              </div>
              <div className="text-[24px] sm:text-[25px] font-bold text-emerald-600 dark:text-emerald-400 tracking-tight mt-1.5 tabular-nums leading-tight">
                {metrics.present}
              </div>
              <p className="text-[11px] text-emerald-700/80 dark:text-emerald-400/80 font-normal mt-0.5 truncate">
                {metrics.presentPercent}% attended today
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border border-[#E9EEF5] dark:border-slate-800 bg-white dark:bg-slate-900 shadow-[0_1px_3px_rgba(15,23,42,0.03)] hover:border-slate-300/80 dark:hover:border-slate-700 transition-all h-full flex flex-col justify-between">
            <CardContent className="p-3.5 sm:p-4 flex flex-col justify-between h-full">
              <div className="flex items-center gap-1.5">
                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${metrics.absent > 0 ? 'bg-rose-500 animate-pulse' : 'bg-slate-400'}`} />
                <span className={`text-[11.5px] font-semibold uppercase tracking-[0.4px] ${metrics.absent > 0 ? 'text-rose-700 dark:text-rose-400' : 'text-slate-500 dark:text-slate-400'}`}>
                  Absent
                </span>
              </div>
              <div className={`text-[24px] sm:text-[25px] font-bold mt-1.5 tracking-tight tabular-nums leading-tight ${metrics.absent > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-slate-800 dark:text-slate-200'}`}>
                {metrics.absent}
              </div>
              <p className={`text-[11px] font-normal mt-0.5 truncate ${metrics.absent > 0 ? 'text-rose-600/80 dark:text-rose-400/80' : 'text-slate-400'}`}>
                Unexcused absences
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border border-[#E9EEF5] dark:border-slate-800 bg-white dark:bg-slate-900 shadow-[0_1px_3px_rgba(15,23,42,0.03)] hover:border-slate-300/80 dark:hover:border-slate-700 transition-all h-full flex flex-col justify-between">
            <CardContent className="p-3.5 sm:p-4 flex flex-col justify-between h-full">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                <span className="text-[11.5px] font-semibold text-amber-700 dark:text-amber-400 uppercase tracking-[0.4px]">
                  Approved Leaves
                </span>
              </div>
              <div className="text-[24px] sm:text-[25px] font-bold text-amber-600 dark:text-amber-400 tracking-tight mt-1.5 tabular-nums leading-tight">
                {metrics.leave}
              </div>
              <p className="text-[11px] text-amber-700/80 dark:text-amber-400/80 font-normal mt-0.5 truncate">
                Leave requests approved
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Unified Attendance Dashboard Navigation Tabs */}
        <AttendanceDashboardTabs />

        {/* ------------------------------------------------------------- */}
        {/* SMART DATE & WORKING DAY / SUNDAY / HOLIDAY CONTROL BAR       */}
        {/* ------------------------------------------------------------- */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 sm:p-3.5 rounded-2xl border border-[#E9EEF5] dark:border-slate-800 bg-white dark:bg-slate-900 shadow-[0_1px_3px_rgba(15,23,42,0.03)]">
          {/* Left: Daily Date Navigator */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <div className="inline-flex items-center bg-slate-50 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700 rounded-lg p-0.5">
              <button
                type="button"
                disabled={selectedDate <= minDateStr}
                onClick={() => setSelectedDate(addDays(selectedDate, -1))}
                className="h-6 w-6 rounded-md flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-white dark:hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-colors cursor-pointer"
                title={selectedDate <= minDateStr ? `Records start from ${formatShortDate(minDateStr)}` : 'Previous day'}
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>

              <label className="relative inline-flex items-center gap-1.5 px-2.5 h-6 text-xs font-semibold text-slate-800 dark:text-slate-100 cursor-pointer hover:text-[#2864E8] transition-colors">
                <Calendar className="w-3.5 h-3.5 text-[#2864E8] shrink-0" />
                <span className="tabular-nums whitespace-nowrap">{formatFullDate(selectedDate)}</span>
                <input
                  type="date"
                  value={selectedDate}
                  min={minDateStr}
                  max={todayDateStr}
                  onChange={e => {
                    if (e.target.value) setSelectedDate(e.target.value);
                  }}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  aria-label="Pick specific date"
                />
              </label>

              <button
                type="button"
                disabled={selectedDate >= todayDateStr}
                onClick={() => setSelectedDate(addDays(selectedDate, 1))}
                className="h-6 w-6 rounded-md flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-white dark:hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-colors cursor-pointer"
                title={selectedDate >= todayDateStr ? 'Cannot view future dates' : 'Next day'}
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {selectedDate !== todayDateStr && (
              <button
                type="button"
                onClick={() => setSelectedDate(todayDateStr)}
                className="h-7 px-2.5 rounded-lg text-[11px] font-semibold text-[#2864E8] bg-blue-50/80 hover:bg-blue-100/80 dark:bg-blue-950/40 border border-blue-200/70 dark:border-blue-800 transition-colors cursor-pointer"
              >
                Today
              </button>
            )}

            <span className="hidden md:inline-block text-[11px] text-slate-400 dark:text-slate-500">
              Mon–Sat Regular · Sunday Optional · Click any student for Weekly/Monthly check
            </span>
          </div>

          {/* Right: Mark All Present + Batch Out Time + Smart Day-Type Controls */}
          <div className="flex items-center gap-2 shrink-0 flex-wrap">
            {activeDayInfo.isWorking && (
              <button
                type="button"
                onClick={handleMarkAllVisiblePresent}
                disabled={filteredStudents.length === 0}
                className="inline-flex items-center gap-1.5 h-7 px-2.5 rounded-lg text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50/80 hover:bg-emerald-100 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                title="Mark all visible students Present"
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Mark All Present</span>
              </button>
            )}

            {/* Class & Batch-wise Out Time Popover (Always visible right above Roster) */}
            {activeDayInfo.isWorking && (
              <Popover
                open={isBatchOutOpen}
                onOpenChange={open => {
                  setIsBatchOutOpen(open);
                  if (open) {
                    const defaultClassId = selectedClassId || 'all';
                    const defaultBatchId = selectedBatchId || 'all';
                    setBatchOutClassId(defaultClassId);
                    setBatchOutTargetId(defaultBatchId);
                    const refBatchId = defaultBatchId !== 'all' ? defaultBatchId : availableBatches[0]?.id || '';
                    const parsed = splitTime12h(getBatchDefaultOutTime(refBatchId), 'PM');
                    setBatchOutTimeInput(parsed.time);
                    setBatchOutPeriod(parsed.period);
                  }
                }}
              >
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    disabled={availableClasses.length === 0}
                    className="inline-flex items-center gap-1.5 h-7 px-2.5 rounded-lg text-xs font-semibold text-[#2864E8] dark:text-blue-400 bg-blue-50/80 hover:bg-blue-100/80 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                    title="Set Out Time for all Present students of a Class / Batch"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Batch Out Time</span>
                  </button>
                </PopoverTrigger>
                <PopoverContent
                  align="end"
                  sideOffset={8}
                  className="w-72 p-3.5 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-xl bg-white dark:bg-slate-900 z-50"
                >
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <LogOut className="w-3.5 h-3.5 text-[#2864E8]" />
                        <span>Class / Batch Out Time</span>
                      </p>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Mark same Out Time for all Present students of a Class or specific Batch.
                      </p>
                    </div>

                    {/* 1. Select Class */}
                    <div className="space-y-1">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block">
                        1. Select Class
                      </span>
                      <Select
                        value={batchOutClassId}
                        onValueChange={val => {
                          setBatchOutClassId(val);
                          setBatchOutTargetId('all');
                        }}
                      >
                        <SelectTrigger className="h-8 text-xs font-medium">
                          <SelectValue placeholder="Choose class..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all" className="text-xs font-semibold">
                            All Classes
                          </SelectItem>
                          {availableClasses.map(c => {
                            const label = c.name.startsWith('Class') ? c.name : `Class ${c.name}`;
                            return (
                              <SelectItem key={c.id} value={c.id} className="text-xs">
                                {label}
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* 2. Select Batch */}
                    <div className="space-y-1">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block">
                        2. Select Batch
                      </span>
                      <Select
                        value={batchOutTargetId}
                        onValueChange={val => {
                          setBatchOutTargetId(val);
                          if (val !== 'all') {
                            const parsed = splitTime12h(getBatchDefaultOutTime(val), 'PM');
                            setBatchOutTimeInput(parsed.time);
                            setBatchOutPeriod(parsed.period);
                          }
                        }}
                      >
                        <SelectTrigger className="h-8 text-xs font-medium">
                          <SelectValue placeholder="Choose batch..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all" className="text-xs font-semibold">
                            All Batches
                          </SelectItem>
                          {batchesForOutClass.map(b => (
                            <SelectItem key={b.id} value={b.id} className="text-xs">
                              {b.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Out Time Input + Inline AM/PM Selector */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                          Out Time
                        </span>
                        <button
                          type="button"
                          onClick={() => setBatchOutTimeInput('00:00')}
                          className="text-[10px] font-mono text-slate-400 hover:text-[#2864E8] transition-colors cursor-pointer"
                        >
                          00:00
                        </button>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Input
                          value={batchOutTimeInput}
                          onChange={e => setBatchOutTimeInput(e.target.value)}
                          placeholder="06:00"
                          className="h-8 text-xs font-mono flex-1 min-w-0"
                        />
                        <div className="inline-flex items-center p-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 shrink-0">
                          {(['AM', 'PM'] as const).map(p => (
                            <button
                              key={p}
                              type="button"
                              onClick={e => {
                                e.preventDefault();
                                e.stopPropagation();
                                setBatchOutPeriod(p);
                              }}
                              className={`h-7 px-2.5 rounded-md text-[11px] font-bold transition-colors cursor-pointer ${
                                batchOutPeriod === p
                                  ? 'bg-[#2864E8] text-white shadow-2xs'
                                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
                              }`}
                            >
                              {p}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Preserve already-edited Out times option */}
                    <label className="flex items-start gap-2 text-[11px] text-slate-600 dark:text-slate-300 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={batchOutOnlyEmpty}
                        onChange={e => setBatchOutOnlyEmpty(e.target.checked)}
                        className="mt-0.5 rounded border-slate-300 text-[#2864E8] focus:ring-[#2864E8]"
                      />
                      <span>Keep already-edited Out times unchanged (only fill blank)</span>
                    </label>

                    <Button
                      size="sm"
                      disabled={presentStudentsInTargetBatch.length === 0}
                      onClick={handleApplyBatchOutTime}
                      className="w-full h-8 bg-[#2864E8] hover:bg-[#1E4ED8] text-white font-semibold text-xs cursor-pointer shadow-none"
                    >
                      Set Out Time ({presentStudentsInTargetBatch.length} Present)
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            )}

            {activeDayInfo.type === 'sunday_off' && (
              <Button
                size="sm"
                onClick={() => toggleSundayClass(selectedDate)}
                className="h-7 px-3 rounded-lg text-xs bg-[#2864E8] hover:bg-[#1E4ED8] text-white font-semibold gap-1.5 cursor-pointer shadow-none"
              >
                <CalendarCheck className="w-3.5 h-3.5" />
                <span>Enable Sunday Class</span>
              </Button>
            )}

            {activeDayInfo.type === 'sunday_class' && (
              <button
                type="button"
                onClick={() => toggleSundayClass(selectedDate)}
                className="inline-flex items-center gap-1.5 h-7 px-2.5 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 transition-colors cursor-pointer"
              >
                <Sun className="w-3.5 h-3.5 text-slate-500" />
                <span>Set Sunday Off</span>
              </button>
            )}

            {activeDayInfo.type === 'working' && (
              <Popover open={isMarkOffOpen} onOpenChange={setIsMarkOffOpen}>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className="inline-flex items-center gap-1.5 h-7 px-2.5 rounded-lg text-xs font-semibold text-amber-700 dark:text-amber-400 bg-amber-50/70 hover:bg-amber-100/80 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/70 transition-colors cursor-pointer"
                    title="Mark this working day as Holiday / Class Off (excluded from attendance %)"
                  >
                    <CalendarOff className="w-3.5 h-3.5" />
                    <span>Mark Day Off</span>
                  </button>
                </PopoverTrigger>
                <PopoverContent
                  align="end"
                  sideOffset={8}
                  className="w-64 p-3 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-xl bg-white dark:bg-slate-900 z-50"
                >
                  <div className="space-y-2.5">
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">
                        Mark {formatShortDate(selectedDate)} as Off
                      </p>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Excluded from working days so students aren&apos;t marked absent.
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {QUICK_OFF_REASONS.map(reason => (
                        <button
                          key={reason}
                          type="button"
                          onClick={() => handleDeclareDayOff(reason)}
                          className="px-2 py-1 rounded-md text-[11px] font-medium bg-slate-100 hover:bg-amber-50 hover:text-amber-700 dark:bg-slate-800 dark:hover:bg-amber-950/50 text-slate-700 dark:text-slate-300 border border-transparent hover:border-amber-200 transition-colors cursor-pointer"
                        >
                          {reason}
                        </button>
                      ))}
                    </div>

                    <div className="flex items-center gap-1.5 pt-1 border-t border-slate-100 dark:border-slate-800">
                      <Input
                        placeholder="Custom reason..."
                        value={customOffReason}
                        onChange={e => setCustomOffReason(e.target.value)}
                        onKeyDown={e => {
                          if (e.key === 'Enter' && customOffReason.trim()) {
                            handleDeclareDayOff(customOffReason);
                          }
                        }}
                        className="h-7 text-xs"
                      />
                      <Button
                        size="sm"
                        onClick={() => handleDeclareDayOff(customOffReason || 'Coaching Off')}
                        className="h-7 px-2.5 text-xs bg-amber-600 hover:bg-amber-700 text-white shrink-0 cursor-pointer"
                      >
                        Off
                      </Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            )}

            {activeDayInfo.type === 'holiday' && activeDayInfo.holidayId && (
              <button
                type="button"
                onClick={() => deleteHoliday(activeDayInfo.holidayId!, 'Class resumed from Live Attendance')}
                className="inline-flex items-center gap-1.5 h-7 px-2.5 rounded-lg text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50/80 hover:bg-emerald-100 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800 transition-colors cursor-pointer"
              >
                <CalendarCheck className="w-3.5 h-3.5" />
                <span>Resume Class</span>
              </button>
            )}

            {/* Reset Button (Right of Mark Day Off / Day Control) */}
            <button
              type="button"
              onClick={handleReset}
              disabled={!activeDayInfo.isWorking}
              className="inline-flex items-center gap-1.5 h-7 px-2.5 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 bg-white hover:bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
              title="Reset attendance for selected date"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* STUDENT LIVE ATTENDANCE ROSTER TABLE (DAILY)                  */}
        {/* ------------------------------------------------------------- */}
        <Card className="rounded-2xl border border-[#E9EEF5] dark:border-slate-800 bg-white dark:bg-slate-900 shadow-[0_1px_3px_rgba(15,23,42,0.03)]">
          <CardHeader className="py-3 px-4 sm:px-6 border-b border-slate-100 dark:border-slate-800/80">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <CardTitle className="text-base sm:text-[17px] font-bold text-slate-900 dark:text-white tracking-[-0.015em] leading-snug uppercase">
                  LIVE ATTENDANCE ROSTER ({filteredStudents.length})
                </CardTitle>
                <CardDescription className="text-xs text-slate-500 dark:text-slate-400 font-normal leading-relaxed mt-0.5">
                  Daily marking for {formatFullDate(selectedDate)} — click any student name or calendar icon to view individual Weekly / Monthly attendance.
                </CardDescription>
              </div>

              {/* Filter Row */}
              <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap justify-end">
                <Select
                  value={selectedClassId}
                  onValueChange={(val) => {
                    setSelectedClassId(val);
                    setSelectedBatchId('all');
                  }}
                >
                  <SelectTrigger className="h-7 !border-0 !border-b-0 !shadow-none !ring-0 !outline-none px-1 text-[11px] font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white focus:!outline-none focus:!ring-0 focus:!ring-offset-0 focus:!shadow-none data-[state=open]:!shadow-none data-[state=open]:!border-b-0 gap-1 cursor-pointer w-auto [&>span]:line-clamp-none [&>svg]:w-3 [&>svg]:h-3 [&>svg]:opacity-60 tracking-wider uppercase">
                    <SelectValue placeholder="CLASS">
                      {selectedClassId === 'all'
                        ? 'CLASS'
                        : classes.find(c => c.name === selectedClassId || c.id === selectedClassId)?.name.toUpperCase() || selectedClassId.toUpperCase()}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all" className="text-xs font-semibold">All Classes</SelectItem>
                    {availableClasses.map(c => (
                      <SelectItem key={c.id} value={c.id} className="text-xs">
                        {c.name.startsWith('Class') ? c.name : `Class ${c.name}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedBatchId} onValueChange={setSelectedBatchId}>
                  <SelectTrigger className="h-7 !border-0 !border-b-0 !shadow-none !ring-0 !outline-none px-1 text-[11px] font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white focus:!outline-none focus:!ring-0 focus:!ring-offset-0 focus:!shadow-none data-[state=open]:!shadow-none data-[state=open]:!border-b-0 gap-1 cursor-pointer w-auto [&>span]:line-clamp-none [&>svg]:w-3 [&>svg]:h-3 [&>svg]:opacity-60 tracking-wider uppercase">
                    <SelectValue placeholder="BATCH">
                      {selectedBatchId === 'all'
                        ? 'BATCH'
                        : batches.find(b => b.id === selectedBatchId || b.name === selectedBatchId)?.name.toUpperCase() || selectedBatchId.toUpperCase()}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all" className="text-xs font-semibold">All Batches</SelectItem>
                    {availableBatches.map(b => (
                      <SelectItem key={b.id} value={b.id} className="text-xs">
                        {b.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="h-7 !border-0 !border-b-0 !shadow-none !ring-0 !outline-none px-1 text-[11px] font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white focus:!outline-none focus:!ring-0 focus:!ring-offset-0 focus:!shadow-none data-[state=open]:!shadow-none data-[state=open]:!border-b-0 gap-1 cursor-pointer w-auto [&>span]:line-clamp-none [&>svg]:w-3 [&>svg]:h-3 [&>svg]:opacity-60 tracking-wider uppercase">
                    <SelectValue placeholder="STATUS">
                      {statusFilter === 'all'
                        ? 'STATUS'
                        : statusFilter === 'present'
                          ? 'PRESENT'
                          : statusFilter === 'absent'
                            ? 'ABSENT'
                            : statusFilter === 'leave'
                              ? 'LEAVE'
                              : 'NOT MARKED'}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all" className="text-xs font-semibold">All Status</SelectItem>
                    <SelectItem value="present" className="text-xs text-emerald-700 font-medium">Present Only</SelectItem>
                    <SelectItem value="absent" className="text-xs text-rose-700 font-medium">Absent Only</SelectItem>
                    <SelectItem value="leave" className="text-xs text-amber-700 font-medium">Leave Only</SelectItem>
                    <SelectItem value="unmarked" className="text-xs text-slate-500 font-medium">Not Marked</SelectItem>
                  </SelectContent>
                </Select>

                <div className="relative flex items-center justify-end">
                  <div
                    onClick={() => {
                      if (!isSearchOpen && !searchQuery) {
                        setIsSearchOpen(true);
                        setTimeout(() => searchInputRef.current?.focus(), 150);
                      }
                    }}
                    className={`flex items-center rounded-full transition-all duration-300 ease-in-out border ${
                      isSearchOpen || searchQuery
                        ? 'w-44 sm:w-56 h-7 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 shadow-xs px-2.5'
                        : 'w-7 h-7 bg-slate-100/90 hover:bg-slate-200/80 dark:bg-slate-800 dark:hover:bg-slate-700 border-transparent justify-center cursor-pointer'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!isSearchOpen && !searchQuery) {
                          setIsSearchOpen(true);
                          setTimeout(() => searchInputRef.current?.focus(), 150);
                        } else if (isSearchOpen && !searchQuery) {
                          setIsSearchOpen(false);
                        }
                      }}
                      className={`shrink-0 flex items-center justify-center text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors cursor-pointer ${
                        isSearchOpen || searchQuery ? 'w-4 h-4' : 'w-7 h-7 rounded-full'
                      }`}
                      title="Search students"
                    >
                      <Search className="w-3.5 h-3.5" />
                    </button>

                    <input
                      ref={searchInputRef}
                      type="text"
                      placeholder="Search name, roll..."
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      onFocus={() => setIsSearchOpen(true)}
                      onBlur={() => {
                        if (!searchQuery.trim()) setIsSearchOpen(false);
                      }}
                      onKeyDown={e => {
                        if (e.key === 'Escape') {
                          setSearchQuery('');
                          setIsSearchOpen(false);
                        }
                      }}
                      className={`text-xs bg-transparent border-none outline-none focus:outline-none focus:ring-0 text-slate-800 dark:text-white placeholder:text-slate-400 transition-all duration-300 ${
                        isSearchOpen || searchQuery ? 'w-full ml-1.5 opacity-100' : 'w-0 ml-0 opacity-0 pointer-events-none'
                      }`}
                    />

                    {(isSearchOpen || searchQuery) && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSearchQuery('');
                          setIsSearchOpen(false);
                        }}
                        className="shrink-0 p-0.5 ml-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
                        title="Clear & close search"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            {/* Non-Working Day Notice Banner */}
            {!activeDayInfo.isWorking && (
              <div className="m-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    activeDayInfo.type === 'sunday_off'
                      ? 'bg-blue-50 dark:bg-blue-950/50 text-[#2864E8]'
                      : 'bg-amber-50 dark:bg-amber-950/50 text-amber-600'
                  }`}>
                    {activeDayInfo.type === 'sunday_off' ? (
                      <Sun className="w-4.5 h-4.5" />
                    ) : (
                      <CalendarOff className="w-4.5 h-4.5" />
                    )}
                  </div>
                  <div>
                    <p className="text-xs sm:text-[13px] font-bold text-slate-900 dark:text-white">
                      {activeDayInfo.type === 'sunday_off'
                        ? `Sunday Off — ${formatFullDate(selectedDate)}`
                        : `Class Off / Holiday — ${activeDayInfo.label} (${formatFullDate(selectedDate)})`}
                    </p>
                    <p className="text-[11.5px] text-slate-500 dark:text-slate-400 mt-0.5">
                      {activeDayInfo.type === 'sunday_off'
                        ? 'Regular classes run Monday to Saturday. This Sunday is excluded from attendance %. Enable Sunday Class if an extra session is held today.'
                        : 'This working day is marked Off/Holiday and excluded from total working days so student attendance % is unaffected.'}
                    </p>
                  </div>
                </div>

                {activeDayInfo.type === 'sunday_off' ? (
                  <Button
                    size="sm"
                    onClick={() => toggleSundayClass(selectedDate)}
                    className="h-8 px-3 rounded-lg text-xs bg-[#2864E8] hover:bg-[#1E4ED8] text-white font-semibold shrink-0 cursor-pointer shadow-none gap-1.5"
                  >
                    <CalendarCheck className="w-3.5 h-3.5" />
                    <span>Enable Sunday Class</span>
                  </Button>
                ) : activeDayInfo.holidayId ? (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => deleteHoliday(activeDayInfo.holidayId!, 'Class resumed')}
                    className="h-8 px-3 rounded-lg text-xs text-emerald-700 border-emerald-200 bg-emerald-50 hover:bg-emerald-100 font-semibold shrink-0 cursor-pointer gap-1.5"
                  >
                    <CalendarCheck className="w-3.5 h-3.5" />
                    <span>Resume Class</span>
                  </Button>
                ) : null}
              </div>
            )}

            {filteredStudents.length === 0 ? (
              <div className="py-12 text-center space-y-2">
                <Users className="w-8 h-8 text-slate-300 dark:text-slate-700 mx-auto" />
                <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">No students match your filter</p>
                <p className="text-xs text-slate-400">Try clearing the search query or changing the branch/class filter.</p>
                {(selectedClassId !== 'all' || selectedBatchId !== 'all' || statusFilter !== 'all' || searchQuery) && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setSelectedClassId('all');
                      setSelectedBatchId('all');
                      setStatusFilter('all');
                      setSearchQuery('');
                    }}
                    className="text-xs font-semibold h-7 mt-2"
                  >
                    Clear Filters
                  </Button>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-slate-50/90 dark:bg-slate-900/70 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-[0.06em] text-[10.5px] border-b border-slate-200/80 dark:border-slate-800/80">
                    <tr>
                      <th className="py-3 px-3.5 pl-5 whitespace-nowrap min-w-[240px]">STUDENT NAME &amp; DETAILS</th>
                      <th className="py-3 px-3.5 whitespace-nowrap min-w-[140px]">CLASS/BATCH</th>
                      <th className="py-3 px-3.5 text-center whitespace-nowrap min-w-[95px]">CURRENT STATUS</th>
                      <th className="py-3 px-3.5 whitespace-nowrap min-w-[130px]">IN / OUT TIME</th>
                      <th className="py-3 px-3.5 pr-5 text-right whitespace-nowrap min-w-[270px]">MARK ATTENDANCE</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                    {filteredStudents.map(student => {
                      const rec = getStudentRecordForDate(selectedDate, student.id);
                      const currentStatus = rec.status;
                      const checkInTime = rec.checkInTime;
                      const checkOutTime = rec.checkOutTime;
                      const isPresent = currentStatus === 'present';
                      const isAbsent = currentStatus === 'absent';
                      const isLeave = currentStatus === 'leave';
                      const isNotMarked = currentStatus === 'not_arrived' || !currentStatus;

                      return (
                        <tr
                          key={student.id}
                          className="bg-white hover:bg-slate-50/60 dark:bg-slate-900 dark:hover:bg-slate-800/40 transition-colors duration-150"
                        >
                          {/* Student Name & Details (Click name to open individual Weekly/Monthly popup) */}
                          <td className="py-3 px-3.5 pl-5 whitespace-nowrap align-middle">
                            <button
                              type="button"
                              onClick={() => openStudentAttendanceModal(student)}
                              className="font-semibold text-slate-900 dark:text-white hover:text-[#2864E8] dark:hover:text-blue-400 transition-colors text-[13.5px] sm:text-[14px] tracking-tight leading-none h-[18px] flex items-center cursor-pointer bg-transparent border-0 p-0 text-left"
                              title="Click to view Weekly & Monthly attendance"
                            >
                              {student.name}
                            </button>
                            <div className="text-[11.5px] text-slate-500 dark:text-slate-400 font-normal whitespace-nowrap mt-1 leading-none h-[16px] flex items-center">
                              Father : <span className="font-medium text-slate-700 dark:text-slate-300 capitalize ml-1">{student.parentName || (student as any).fatherName || '—'}</span>
                            </div>
                            <div className="text-[11px] text-slate-400 dark:text-slate-500 font-normal whitespace-nowrap mt-1 leading-none h-[16px] flex items-center">
                              Admission No. : <span className="font-mono font-medium text-slate-600 dark:text-slate-400 ml-1">{student.rollNo || student.id}</span>
                            </div>
                          </td>

                          {/* Class/Batch */}
                          <td className="py-3 px-3.5 whitespace-nowrap align-middle">
                            <div className="space-y-0.5">
                              <span className="font-semibold text-slate-800 dark:text-slate-200 block text-xs sm:text-[13px]">
                                {student.className?.startsWith('Class')
                                  ? student.className
                                  : `Class ${student.className || '—'}`}
                              </span>
                              <span className="text-[11px] text-slate-400 dark:text-slate-500 block">
                                {student.batchName}
                              </span>
                            </div>
                          </td>

                          {/* Status Tag — Compact Circular Outline (No BG, No Icon) */}
                          <td className="py-3 px-3.5 text-center whitespace-nowrap align-middle">
                            {!activeDayInfo.isWorking ? (
                              <span
                                title={activeDayInfo.type === 'holiday' ? activeDayInfo.label : 'Sunday Off'}
                                className={`inline-flex items-center justify-center w-7 h-7 rounded-full border text-[10px] font-bold uppercase bg-transparent ${
                                  activeDayInfo.type === 'holiday'
                                    ? 'border-amber-400 text-amber-600 dark:border-amber-500 dark:text-amber-400'
                                    : 'border-slate-300 text-slate-400 dark:border-slate-600 dark:text-slate-500'
                                }`}
                              >
                                {activeDayInfo.type === 'holiday' ? 'H' : 'S'}
                              </span>
                            ) : (
                              <>
                                {isPresent && (
                                  <span
                                    title="Present"
                                    className="inline-flex items-center justify-center w-7 h-7 rounded-full border-[1.5px] border-emerald-500 text-emerald-600 dark:border-emerald-400 dark:text-emerald-400 bg-transparent text-xs font-bold uppercase select-none"
                                  >
                                    P
                                  </span>
                                )}
                                {isAbsent && (
                                  <span
                                    title="Absent"
                                    className="inline-flex items-center justify-center w-7 h-7 rounded-full border-[1.5px] border-rose-500 text-rose-600 dark:border-rose-400 dark:text-rose-400 bg-transparent text-xs font-bold uppercase select-none"
                                  >
                                    A
                                  </span>
                                )}
                                {isLeave && (
                                  <span
                                    title="Leave"
                                    className="inline-flex items-center justify-center w-7 h-7 rounded-full border-[1.5px] border-amber-500 text-amber-600 dark:border-amber-400 dark:text-amber-400 bg-transparent text-xs font-bold uppercase select-none"
                                  >
                                    L
                                  </span>
                                )}
                                {isNotMarked && (
                                  <span
                                    title="Not Marked"
                                    className="inline-flex items-center justify-center w-7 h-7 rounded-full border border-slate-300 text-slate-400 dark:border-slate-700 dark:text-slate-500 bg-transparent text-xs font-medium select-none"
                                  >
                                    —
                                  </span>
                                )}
                              </>
                            )}
                          </td>

                          {/* Arrival & Exit Time — Clean, Compact, No BG, No Clock Icon, Edit Icon Only */}
                          <td className="py-3 px-3.5 whitespace-nowrap align-middle">
                            {activeDayInfo.isWorking && isPresent ? (
                              <Popover
                                open={editingTimeStudentId === student.id}
                                onOpenChange={open => {
                                  if (open) {
                                    setEditingTimeStudentId(student.id);
                                    const parsedIn = splitTime12h(checkInTime || getCurrentTimeFormatted(), 'PM');
                                    setCustomTimeInput(parsedIn.time);
                                    setCustomInPeriod(parsedIn.period);
                                    const parsedOut = splitTime12h(checkOutTime || '', 'PM');
                                    setCustomOutTimeInput(parsedOut.time);
                                    setCustomOutPeriod(parsedOut.period);
                                  } else {
                                    setEditingTimeStudentId(null);
                                  }
                                }}
                              >
                                <PopoverTrigger asChild>
                                  <button
                                    type="button"
                                    className="group text-left bg-transparent border-0 p-0 shadow-none focus:outline-none cursor-pointer flex items-center gap-2"
                                    title="Click to edit Arrival & Exit time"
                                  >
                                    <div className="flex flex-col leading-tight">
                                      <div className="text-[12px] font-mono font-medium text-slate-800 dark:text-slate-100 tabular-nums flex items-center gap-1.5 leading-snug">
                                        <span className="font-sans text-[11px] font-normal text-slate-400 dark:text-slate-500 w-7 shrink-0">In:</span>
                                        <span className="w-[62px] shrink-0">{checkInTime || '04:00 PM'}</span>
                                      </div>
                                      <div className="text-[12px] font-mono font-medium text-slate-500 dark:text-slate-400 tabular-nums mt-0.5 flex items-center gap-1.5 leading-snug">
                                        <span className="font-sans text-[11px] font-normal text-slate-400 dark:text-slate-500 w-7 shrink-0">Out:</span>
                                        <span className="w-[62px] shrink-0">{checkOutTime || '—'}</span>
                                      </div>
                                    </div>
                                    <Edit3 className="w-3 h-3 text-slate-400 group-hover:text-[#2864E8] dark:group-hover:text-blue-400 transition-colors shrink-0" />
                                  </button>
                                </PopoverTrigger>
                                <PopoverContent
                                  align="start"
                                  className="w-64 p-3 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xl bg-white dark:bg-slate-900 z-50"
                                >
                                  <div className="space-y-2.5">
                                    <div className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center justify-between">
                                      <span>In / Out Time</span>
                                      <span className="text-[10px] text-slate-400 font-normal">
                                        {student.name.split(' ')[0]}
                                      </span>
                                    </div>

                                    <div className="space-y-2.5">
                                      <div>
                                        <div className="flex items-center justify-between mb-1">
                                          <span className="text-[10px] font-semibold text-slate-400 uppercase">Arrival (In)</span>
                                          <button
                                            type="button"
                                            onClick={() => setCustomTimeInput('00:00')}
                                            className="text-[10px] font-mono text-slate-400 hover:text-[#2864E8] transition-colors cursor-pointer"
                                          >
                                            00:00
                                          </button>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                          <Input
                                            value={customTimeInput}
                                            onChange={e => setCustomTimeInput(e.target.value)}
                                            placeholder="04:00"
                                            className="h-8 text-xs font-mono flex-1 min-w-0"
                                          />
                                          <div className="inline-flex items-center p-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 shrink-0">
                                            {(['AM', 'PM'] as const).map(p => (
                                              <button
                                                key={p}
                                                type="button"
                                                onClick={e => {
                                                  e.preventDefault();
                                                  e.stopPropagation();
                                                  setCustomInPeriod(p);
                                                }}
                                                className={`h-7 px-2.5 rounded-md text-[11px] font-bold transition-colors cursor-pointer ${
                                                  customInPeriod === p
                                                    ? 'bg-[#2864E8] text-white shadow-2xs'
                                                    : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
                                                }`}
                                              >
                                                {p}
                                              </button>
                                            ))}
                                          </div>
                                        </div>
                                      </div>

                                      <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                                        <div className="flex items-center justify-between mb-1">
                                          <span className="text-[10px] font-semibold text-slate-400 uppercase">Exit (Out)</span>
                                          <button
                                            type="button"
                                            onClick={() => setCustomOutTimeInput('00:00')}
                                            className="text-[10px] font-mono text-slate-400 hover:text-[#2864E8] transition-colors cursor-pointer"
                                          >
                                            00:00
                                          </button>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                          <Input
                                            value={customOutTimeInput}
                                            onChange={e => setCustomOutTimeInput(e.target.value)}
                                            placeholder="06:00"
                                            className="h-8 text-xs font-mono flex-1 min-w-0"
                                          />
                                          <div className="inline-flex items-center p-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 shrink-0">
                                            {(['AM', 'PM'] as const).map(p => (
                                              <button
                                                key={p}
                                                type="button"
                                                onClick={e => {
                                                  e.preventDefault();
                                                  e.stopPropagation();
                                                  setCustomOutPeriod(p);
                                                }}
                                                className={`h-7 px-2.5 rounded-md text-[11px] font-bold transition-colors cursor-pointer ${
                                                  customOutPeriod === p
                                                    ? 'bg-[#2864E8] text-white shadow-2xs'
                                                    : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
                                                }`}
                                              >
                                                {p}
                                              </button>
                                            ))}
                                          </div>
                                        </div>
                                      </div>
                                    </div>

                                    <Button
                                      size="sm"
                                      onClick={() => {
                                        const finalIn =
                                          combineTime12h(customTimeInput, customInPeriod) ||
                                          checkInTime ||
                                          getCurrentTimeFormatted();
                                        const finalOut = combineTime12h(customOutTimeInput, customOutPeriod);
                                        markDateStudentStatus(
                                          selectedDate,
                                          student.id,
                                          'present',
                                          finalIn,
                                          finalOut
                                        );
                                        setEditingTimeStudentId(null);
                                      }}
                                      className="w-full h-8 bg-[#2864E8] hover:bg-[#1E4ED8] text-white font-semibold text-xs cursor-pointer"
                                    >
                                      Save Timing
                                    </Button>
                                  </div>
                                </PopoverContent>
                              </Popover>
                            ) : (
                              <span className="text-slate-400 font-mono text-xs">—</span>
                            )}
                          </td>

                          {/* 1-Click Action Buttons + Individual Weekly/Monthly Calendar Button */}
                          <td className="py-3 px-3.5 pr-5 text-right whitespace-nowrap align-middle">
                            <div className="inline-flex items-center gap-1.5 justify-end">
                              {/* Individual Student Weekly / Monthly Check Button */}
                              <button
                                type="button"
                                onClick={() => openStudentAttendanceModal(student)}
                                className="h-7 w-7 rounded-lg border border-slate-200/80 dark:border-slate-700/80 bg-white dark:bg-slate-900 text-slate-500 hover:text-[#2864E8] dark:hover:text-blue-400 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-blue-50/50 dark:hover:bg-slate-800 flex items-center justify-center transition-colors cursor-pointer mr-1"
                                title="Check individual Weekly & Monthly attendance"
                              >
                                <CalendarDays className="w-3.5 h-3.5" />
                              </button>

                              <button
                                type="button"
                                disabled={!activeDayInfo.isWorking}
                                onClick={() => {
                                  const existingTime = checkInTime || getCurrentTimeFormatted();
                                  markDateStudentStatus(selectedDate, student.id, 'present', existingTime);
                                }}
                                className={`h-7 px-2.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer ${
                                  activeDayInfo.isWorking && isPresent
                                    ? 'bg-emerald-600 text-white shadow-xs'
                                    : 'bg-emerald-50/70 hover:bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/60 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800'
                                }`}
                                title="Mark Present"
                              >
                                <Check className="w-3 h-3" />
                                <span>Present</span>
                              </button>

                              <button
                                type="button"
                                disabled={!activeDayInfo.isWorking}
                                onClick={() => markDateStudentStatus(selectedDate, student.id, 'absent')}
                                className={`h-7 px-2.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer ${
                                  activeDayInfo.isWorking && isAbsent
                                    ? 'bg-rose-600 text-white shadow-xs'
                                    : 'bg-rose-50/70 hover:bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:hover:bg-rose-900/60 dark:text-rose-300 border border-rose-200/80 dark:border-rose-800'
                                }`}
                                title="Mark Absent"
                              >
                                <X className="w-3 h-3" />
                                <span>Absent</span>
                              </button>

                              <button
                                type="button"
                                disabled={!activeDayInfo.isWorking}
                                onClick={() => markDateStudentStatus(selectedDate, student.id, 'leave')}
                                className={`h-7 px-2.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer ${
                                  activeDayInfo.isWorking && isLeave
                                    ? 'bg-amber-600 text-white shadow-xs'
                                    : 'bg-amber-50/70 hover:bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:hover:bg-amber-900/60 dark:text-amber-300 border border-amber-200/80 dark:border-amber-800'
                                }`}
                                title="Mark Leave"
                              >
                                <PlaneTakeoff className="w-3 h-3" />
                                <span>Leave</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* INDIVIDUAL STUDENT WEEKLY & MONTHLY ATTENDANCE POPUP MODAL         */}
      {/* ------------------------------------------------------------------ */}
      <Dialog
        open={!!inspectStudent}
        onOpenChange={open => {
          if (!open) setInspectStudent(null);
        }}
      >
        <DialogContent className="max-w-[540px] w-[95vw] rounded-2xl p-5 sm:p-6 bg-white dark:bg-slate-950 border border-slate-200/75 dark:border-slate-800 shadow-[0_24px_60px_-15px_rgba(15,23,42,0.16),0_0_0_1px_rgba(15,23,42,0.03)] overflow-hidden max-h-[90vh] flex flex-col">
          {inspectStudent && (() => {
            const minMonthStr = minDateStr.slice(0, 7);
            const currentMonthStr = todayDateStr.slice(0, 7);
            const datesInScope =
              modalMode === 'weekly'
                ? modalWeekDates
                : modalMonthCells.filter((d): d is string => Boolean(d));

            let workingCount = 0;
            let presentCount = 0;
            let absentCount = 0;
            let leaveCount = 0;

            datesInScope.forEach(d => {
              if (d < minDateStr || d > todayDateStr) return; // Bounded strictly to [minDateStr, todayDateStr]
              const info = getDayInfo(d);
              if (!info.isWorking) return;
              workingCount++;
              const st = getStudentRecordForDate(d, inspectStudent.id).status;
              if (st === 'present' || st === 'late') presentCount++;
              else if (st === 'absent') absentCount++;
              else if (st === 'leave') leaveCount++;
            });

            const pct = workingCount > 0 ? Math.round((presentCount / workingCount) * 100) : 0;

            return (
              <div className="flex flex-col flex-1 min-h-0 overflow-hidden space-y-4">
                {/* Modal Header */}
                <DialogHeader className="pb-3.5 border-b border-slate-100 dark:border-slate-800/80 text-left pr-8 shrink-0 space-y-0">
                  <DialogTitle className="text-[17px] sm:text-[18px] font-bold text-slate-950 dark:text-white tracking-[-0.02em] leading-snug flex items-center gap-2.5 flex-wrap">
                    <span>{inspectStudent.name}</span>
                    <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-blue-50/90 text-[#2864E8] border border-blue-200/60 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800/60 tracking-tight leading-tight">
                      {inspectStudent.className?.startsWith('Class')
                        ? inspectStudent.className
                        : `Class ${inspectStudent.className || '—'}`} · {inspectStudent.batchName}
                    </span>
                  </DialogTitle>
                  <div className="text-[12px] text-slate-500 dark:text-slate-400 mt-1.5 flex items-center gap-2.5 flex-wrap leading-normal">
                    <span>Father: <strong className="font-medium text-slate-700 dark:text-slate-200">{inspectStudent.parentName || '—'}</strong></span>
                    <span className="text-slate-300 dark:text-slate-700 select-none">•</span>
                    <span className="font-mono text-[11.5px]">Admission No.: <strong className="font-medium text-slate-700 dark:text-slate-200 tabular-nums">{inspectStudent.rollNo || inspectStudent.id}</strong></span>
                  </div>
                </DialogHeader>

                {/* Weekly / Monthly Switcher + Period Navigator */}
                <div className="flex items-center justify-between gap-2.5 flex-wrap shrink-0">
                  <div className="inline-flex items-center p-[3px] rounded-lg bg-slate-100/75 dark:bg-slate-800/75">
                    <button
                      type="button"
                      onClick={() => setModalMode('weekly')}
                      className={`h-7 px-3 rounded-[6px] text-[12px] font-semibold tracking-[-0.005em] transition-all cursor-pointer ${
                        modalMode === 'weekly'
                          ? 'bg-white dark:bg-slate-900 text-[#2864E8] dark:text-blue-400 shadow-[0_1px_2px_rgba(15,23,42,0.06)]'
                          : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                      }`}
                    >
                      Weekly
                    </button>
                    <button
                      type="button"
                      onClick={() => setModalMode('monthly')}
                      className={`h-7 px-3 rounded-[6px] text-[12px] font-semibold tracking-[-0.005em] transition-all cursor-pointer ${
                        modalMode === 'monthly'
                          ? 'bg-white dark:bg-slate-900 text-[#2864E8] dark:text-blue-400 shadow-[0_1px_2px_rgba(15,23,42,0.06)]'
                          : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                      }`}
                    >
                      Monthly
                    </button>
                  </div>

                  {modalMode === 'weekly' ? (
                    <div className="h-8 inline-flex items-center justify-between w-[188px] shrink-0">
                      <button
                        type="button"
                        disabled={modalWeekDates[0] <= minDateStr}
                        onClick={() => setModalWeekAnchor(addDays(modalWeekAnchor, -7))}
                        className="h-7 w-7 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100/80 dark:hover:text-slate-200 dark:hover:bg-slate-800/80 disabled:opacity-25 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-colors cursor-pointer shrink-0"
                      >
                        <ChevronLeft className="w-3.5 h-3.5" />
                      </button>
                      <span className="flex-1 text-center text-[12.5px] font-semibold text-slate-800 dark:text-slate-100 tracking-[-0.01em] tabular-nums whitespace-nowrap select-none">
                        {formatShortDate(modalWeekDates[0])} – {formatShortDate(modalWeekDates[6])}
                      </span>
                      <button
                        type="button"
                        disabled={modalWeekDates[6] >= todayDateStr}
                        onClick={() => setModalWeekAnchor(addDays(modalWeekAnchor, 7))}
                        className="h-7 w-7 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100/80 dark:hover:text-slate-200 dark:hover:bg-slate-800/80 disabled:opacity-25 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-colors cursor-pointer shrink-0"
                      >
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div className="h-8 inline-flex items-center justify-between w-[188px] shrink-0">
                      <button
                        type="button"
                        disabled={modalMonth <= minMonthStr}
                        onClick={() => setModalMonth(addMonths(modalMonth, -1))}
                        className="h-7 w-7 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100/80 dark:hover:text-slate-200 dark:hover:bg-slate-800/80 disabled:opacity-25 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-colors cursor-pointer shrink-0"
                      >
                        <ChevronLeft className="w-3.5 h-3.5" />
                      </button>
                      <span className="flex-1 text-center text-[12.5px] font-semibold text-slate-800 dark:text-slate-100 tracking-[-0.01em] tabular-nums whitespace-nowrap select-none">
                        {formatMonthYearLabel(modalMonth)}
                      </span>
                      <button
                        type="button"
                        disabled={modalMonth >= currentMonthStr}
                        onClick={() => setModalMonth(addMonths(modalMonth, 1))}
                        className="h-7 w-7 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100/80 dark:hover:text-slate-200 dark:hover:bg-slate-800/80 disabled:opacity-25 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-colors cursor-pointer shrink-0"
                      >
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Mini Summary Strip (Excluding Sunday Off & Holidays) */}
                <div className="grid grid-cols-5 gap-2 shrink-0">
                  <div className="py-2.5 px-2 rounded-xl bg-slate-50/70 dark:bg-slate-900/70 border border-slate-200/55 dark:border-slate-800/80 text-center">
                    <span className="text-[9.5px] font-semibold uppercase tracking-[0.06em] text-slate-500 dark:text-slate-400 block leading-none">Working</span>
                    <span className="text-[15.5px] font-bold text-slate-900 dark:text-slate-100 tabular-nums tracking-tight mt-1.5 block leading-none">{workingCount}d</span>
                  </div>
                  <div className="py-2.5 px-2 rounded-xl bg-emerald-50/45 dark:bg-emerald-950/20 border border-emerald-200/50 dark:border-emerald-900/40 text-center">
                    <span className="text-[9.5px] font-semibold uppercase tracking-[0.06em] text-emerald-600/90 dark:text-emerald-400 block leading-none">Present</span>
                    <span className="text-[15.5px] font-bold text-emerald-700 dark:text-emerald-400 tabular-nums tracking-tight mt-1.5 block leading-none">{presentCount}</span>
                  </div>
                  <div className="py-2.5 px-2 rounded-xl bg-rose-50/45 dark:bg-rose-950/20 border border-rose-200/50 dark:border-rose-900/40 text-center">
                    <span className="text-[9.5px] font-semibold uppercase tracking-[0.06em] text-rose-600/90 dark:text-rose-400 block leading-none">Absent</span>
                    <span className="text-[15.5px] font-bold text-rose-600 dark:text-rose-400 tabular-nums tracking-tight mt-1.5 block leading-none">{absentCount}</span>
                  </div>
                  <div className="py-2.5 px-2 rounded-xl bg-amber-50/45 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-900/40 text-center">
                    <span className="text-[9.5px] font-semibold uppercase tracking-[0.06em] text-amber-600/90 dark:text-amber-400 block leading-none">Leave</span>
                    <span className="text-[15.5px] font-bold text-amber-600 dark:text-amber-400 tabular-nums tracking-tight mt-1.5 block leading-none">{leaveCount}</span>
                  </div>
                  <div className="py-2.5 px-2 rounded-xl bg-blue-50/50 dark:bg-blue-950/30 border border-blue-200/50 dark:border-blue-900/40 text-center">
                    <span className="text-[9.5px] font-semibold uppercase tracking-[0.06em] text-[#2864E8]/90 dark:text-blue-400 block leading-none">Rate</span>
                    <span className="text-[15.5px] font-bold text-[#2864E8] dark:text-blue-400 tabular-nums tracking-tight mt-1.5 block leading-none">{pct}%</span>
                  </div>
                </div>

                {/* Body: Fixed-height pure-white area for Weekly 7-Day List OR Monthly Calendar Grid */}
                <div className="h-[358px] max-h-[calc(90vh-260px)] overflow-y-auto overflow-x-hidden overscroll-contain bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800/80 shrink-0 [scrollbar-width:thin] [scrollbar-color:transparent_transparent] hover:[scrollbar-color:rgba(148,163,184,0.4)_transparent] [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-transparent hover:[&::-webkit-scrollbar-thumb]:bg-slate-300/80 dark:hover:[&::-webkit-scrollbar-thumb]:bg-slate-700/80">
                  {modalMode === 'weekly' ? (
                    <div className="divide-y divide-slate-100/90 dark:divide-slate-800/80 bg-white dark:bg-slate-950">
                      {modalWeekDates.map(d => {
                        const isOutOfRange = d < minDateStr || d > todayDateStr;
                        const isFuture = d > todayDateStr;
                        const info = getDayInfo(d);
                        const rec = getStudentRecordForDate(d, inspectStudent.id);
                        const dt = parseDateLocal(d);
                        const dayName = DAY_NAMES_SHORT[dt.getDay()];
                        const isPresentLike = rec.status === 'present' || rec.status === 'late';
                        const hasInTime = Boolean(rec.checkInTime && rec.checkInTime !== '—');
                        const hasOutTime = Boolean(rec.checkOutTime && rec.checkOutTime !== '—');
                        const durationLabel = isPresentLike ? formatDuration(rec.checkInTime, rec.checkOutTime) : null;

                        return (
                          <div
                            key={d}
                            className={`grid grid-cols-[minmax(128px,1.2fr)_minmax(108px,1fr)_minmax(76px,0.8fr)_32px] items-center gap-2 px-1.5 py-2.5 bg-white dark:bg-slate-950 text-xs transition-colors ${
                              isOutOfRange ? 'opacity-45' : info.isWorking ? 'hover:bg-slate-50/50 dark:hover:bg-slate-900/40' : ''
                            }`}
                          >
                            {/* Col 1: Day & Date */}
                            <div className="flex items-center gap-2.5 min-w-0">
                              <span className="w-9 text-[11px] font-semibold uppercase tracking-[0.04em] text-slate-400 dark:text-slate-500 shrink-0">{dayName}</span>
                              <span className={`text-[12.5px] font-semibold tabular-nums tracking-[-0.01em] whitespace-nowrap ${isOutOfRange || !info.isWorking ? 'text-slate-500 dark:text-slate-400' : 'text-slate-900 dark:text-slate-100'}`}>
                                {formatShortDate(d)}
                              </span>
                              {!isOutOfRange && info.type === 'sunday_class' && (
                                <span className="text-[10.5px] font-semibold text-[#2864E8] whitespace-nowrap">Special Sun</span>
                              )}
                              {!isOutOfRange && info.type === 'holiday' && (
                                <span className="text-[10.5px] font-medium text-amber-600 truncate max-w-[110px]">{info.label}</span>
                              )}
                              {!isOutOfRange && info.type === 'sunday_off' && (
                                <span className="text-[10.5px] font-medium text-slate-400 whitespace-nowrap">Weekly Off</span>
                              )}
                              {isOutOfRange && (
                                <span className="text-[10.5px] font-normal text-slate-400 whitespace-nowrap">
                                  {isFuture ? 'Upcoming' : 'Before Start'}
                                </span>
                              )}
                            </div>

                            {/* Col 2: IN / OUT Time */}
                            <div className="flex justify-center">
                              {!isOutOfRange && info.isWorking && isPresentLike && (hasInTime || hasOutTime) ? (
                                <div className="flex flex-col gap-0.5 text-[11px] leading-[14px] font-mono tabular-nums min-w-[96px]">
                                  <div className="flex items-center justify-between gap-2">
                                    <span className="w-7 text-left font-sans text-[9.5px] font-semibold uppercase tracking-[0.06em] text-slate-400">IN</span>
                                    <span className={hasInTime ? 'text-slate-800 dark:text-slate-200 font-medium' : 'text-slate-300 dark:text-slate-600'}>
                                      {hasInTime ? rec.checkInTime : '--:-- --'}
                                    </span>
                                  </div>
                                  <div className="flex items-center justify-between gap-2">
                                    <span className="w-7 text-left font-sans text-[9.5px] font-semibold uppercase tracking-[0.06em] text-slate-400">OUT</span>
                                    <span className={hasOutTime ? 'text-slate-500 dark:text-slate-400' : 'text-slate-300 dark:text-slate-600'}>
                                      {hasOutTime ? rec.checkOutTime : '--:-- --'}
                                    </span>
                                  </div>
                                </div>
                              ) : null}
                            </div>

                            {/* Col 3: Duration (Hours & Minutes) */}
                            <div className="flex justify-center">
                              {!isOutOfRange && info.isWorking && isPresentLike ? (
                                durationLabel ? (
                                  <span
                                    title="Total duration (IN to OUT)"
                                    className="inline-flex items-center gap-1.5 text-[11.5px] font-semibold text-[#2864E8] dark:text-blue-400 tabular-nums whitespace-nowrap"
                                  >
                                    <Clock className="w-3 h-3 text-[#2864E8]/70 dark:text-blue-400/75 shrink-0" />
                                    {durationLabel}
                                  </span>
                                ) : (
                                  <span
                                    title="Out time not marked yet"
                                    className="inline-flex items-center gap-1.5 text-[11px] font-medium text-slate-300 dark:text-slate-600 tabular-nums whitespace-nowrap"
                                  >
                                    <Clock className="w-3 h-3 opacity-70 shrink-0" />
                                    --h --m
                                  </span>
                                )
                              ) : null}
                            </div>

                            {/* Col 4: Status Circle (P / A / L / — / SUN / OFF) */}
                            <div className="flex justify-end">
                              {isOutOfRange ? (
                                <span className="w-7 h-7 inline-flex items-center justify-center text-xs font-medium text-slate-300 dark:text-slate-600 select-none">—</span>
                              ) : info.isWorking ? (
                                <button
                                  type="button"
                                  onClick={() => handleCycleCellStatus(d, inspectStudent.id)}
                                  title="Click to toggle Present / Absent / Leave"
                                  className={`w-7 h-7 rounded-full inline-flex items-center justify-center text-[11px] font-bold transition-all cursor-pointer shrink-0 ${
                                    isPresentLike
                                      ? 'border-[1.5px] border-emerald-500/80 bg-emerald-50/40 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-400/80 dark:bg-emerald-950/30 dark:text-emerald-300 dark:hover:bg-emerald-950/50'
                                      : rec.status === 'absent'
                                        ? 'border-[1.5px] border-rose-500/80 bg-rose-50/40 text-rose-600 hover:bg-rose-50 dark:border-rose-400/80 dark:bg-rose-950/30 dark:text-rose-300 dark:hover:bg-rose-950/50'
                                        : rec.status === 'leave'
                                          ? 'border-[1.5px] border-amber-500/80 bg-amber-50/40 text-amber-700 hover:bg-amber-50 dark:border-amber-400/80 dark:bg-amber-950/30 dark:text-amber-300 dark:hover:bg-amber-950/50'
                                          : 'bg-transparent text-slate-300 hover:text-slate-600 dark:text-slate-600 dark:hover:text-slate-300'
                                  }`}
                                >
                                  {isPresentLike
                                    ? 'P'
                                    : rec.status === 'absent'
                                      ? 'A'
                                      : rec.status === 'leave'
                                        ? 'L'
                                        : '—'}
                                </button>
                              ) : (
                                <span className="w-7 h-7 inline-flex items-center justify-center text-[10px] font-semibold tracking-wide text-slate-400 uppercase">
                                  {info.type === 'holiday' ? 'OFF' : 'SUN'}
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    /* Monthly Calendar Grid (Mon - Sun columns, pure white, horizontal row dividers) */
                    <div className="bg-white dark:bg-slate-950 pt-2">
                      <div className="grid grid-cols-7 text-center border-b border-slate-100 dark:border-slate-800/80 pb-2">
                        {MON_TO_SUN_LABELS.map(day => (
                          <div key={day} className="text-[10px] font-semibold uppercase tracking-[0.06em] text-slate-400">
                            {day}
                          </div>
                        ))}
                      </div>
                      <div className="grid grid-cols-7">
                        {modalMonthCells.map((d, idx) => {
                          if (!d) {
                            return <div key={`empty-${idx}`} className="h-[48px] bg-white dark:bg-slate-950 border-b border-slate-100/80 dark:border-slate-800/60" />;
                          }
                          const dayNum = parseDateLocal(d).getDate();
                          const isOutOfRange = d < minDateStr || d > todayDateStr;
                          const info = getDayInfo(d);
                          const rec = getStudentRecordForDate(d, inspectStudent.id);

                          if (isOutOfRange) {
                            return (
                              <div
                                key={d}
                                title={`${formatFullDate(d)} — ${d > todayDateStr ? 'Upcoming date' : 'Before session start'}`}
                                className="h-[48px] bg-white dark:bg-slate-950 border-b border-slate-100/80 dark:border-slate-800/60 text-slate-300 dark:text-slate-700 flex flex-col items-center justify-center cursor-not-allowed"
                              >
                                <span className="text-[11.5px] font-medium tabular-nums leading-none">{dayNum}</span>
                                <span className="text-[10px] mt-1 leading-none">—</span>
                              </div>
                            );
                          }

                          if (!info.isWorking) {
                            return (
                              <div
                                key={d}
                                title={`${formatFullDate(d)} — ${info.label}`}
                                className={`h-[48px] bg-white dark:bg-slate-950 border-b border-slate-100/80 dark:border-slate-800/60 flex flex-col items-center justify-center ${
                                  info.type === 'holiday'
                                    ? 'text-amber-600 dark:text-amber-400'
                                    : 'text-slate-400 dark:text-slate-500'
                                }`}
                              >
                                <span className="text-[11.5px] font-medium tabular-nums leading-none">{dayNum}</span>
                                <span className="text-[8.5px] font-semibold uppercase tracking-wide mt-1 leading-none">
                                  {info.type === 'holiday' ? 'OFF' : 'SUN'}
                                </span>
                              </div>
                            );
                          }

                          const st = rec.status;
                          const badgeCls =
                            st === 'present' || st === 'late'
                              ? 'text-emerald-600 dark:text-emerald-400 font-bold'
                              : st === 'absent'
                                ? 'text-rose-600 dark:text-rose-400 font-bold'
                                : st === 'leave'
                                  ? 'text-amber-600 dark:text-amber-400 font-bold'
                                  : 'text-slate-300 dark:text-slate-600 font-medium';

                          const statusShort =
                            st === 'present' || st === 'late'
                              ? 'P'
                              : st === 'absent'
                                ? 'A'
                                : st === 'leave'
                                  ? 'L'
                                  : '—';

                          return (
                            <button
                              key={d}
                              type="button"
                              onClick={() => handleCycleCellStatus(d, inspectStudent.id)}
                              title={`${formatFullDate(d)} — Click to toggle P / A / L`}
                              className="h-[48px] bg-white dark:bg-slate-950 border-b border-slate-100/80 dark:border-slate-800/60 hover:bg-slate-50/70 dark:hover:bg-slate-900/60 flex flex-col items-center justify-center transition-colors cursor-pointer"
                            >
                              <span className="text-[11.5px] font-semibold text-slate-800 dark:text-slate-100 tabular-nums leading-none">{dayNum}</span>
                              <span className={`text-[10.5px] mt-1 leading-none ${badgeCls}`}>{statusShort}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })()}
        </DialogContent>
      </Dialog>
    </div>
  );
}
