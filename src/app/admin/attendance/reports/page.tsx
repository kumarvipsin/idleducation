'use client';

import React, { useState, useMemo, useRef } from 'react';
import Link from 'next/link';
import { useAttendance } from '@/context/attendance-context';
import {
  CalendarDays,
  Calendar,
  Building2,
  Globe,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Check,
  Search,
  Download,
  Printer,
  Phone,
  PhoneCall,
  User,
  Users,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  PlaneTakeoff,
  Clock,
  Share2,
  FileText,
  Percent,
  SlidersHorizontal,
  X,
  ExternalLink,
  Info,
  Eye,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AttendanceDashboardTabs } from '@/components/attendance/attendance-dashboard-tabs';
import { Badge } from '@/components/ui/badge';
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
  DialogDescription,
} from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import {
  TStudent,
  formatDateDisplay,
  normalizeDateString,
} from '@/lib/attendance-store';

// Standard IDL Branches (Matching Fee Management and Attendance Overview)
const IDL_BRANCHES = [
  { id: 'all', name: 'All Branches' },
  { id: 'budh-vihar', name: 'Budh Vihar' },
  { id: 'krishan-vihar', name: 'Krishan Vihar' },
  { id: 'mangolpuri', name: 'Mangol Puri' },
  { id: 'mukherjee-nagar', name: 'Mukherjee Nagar' },
];

// Week definition interface
interface CoachingWeek {
  id: string;
  label: string;
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
  days: {
    date: string;
    dayName: string; // 'Mon', 'Tue', etc.
    dayNum: string;  // '07', '08'
    formatted: string;
  }[];
}

// Predefined Coaching Weeks around Sep 2026 (Mon – Sun)
const COACHING_WEEKS: CoachingWeek[] = [
  {
    id: 'week-current',
    label: '07 Sep – 13 Sep 2026 (Current Week)',
    startDate: '2026-09-07',
    endDate: '2026-09-13',
    days: [
      { date: '2026-09-07', dayName: 'Mon', dayNum: '07', formatted: '07 Sep' },
      { date: '2026-09-08', dayName: 'Tue', dayNum: '08', formatted: '08 Sep' },
      { date: '2026-09-09', dayName: 'Wed', dayNum: '09', formatted: '09 Sep' },
      { date: '2026-09-10', dayName: 'Thu', dayNum: '10', formatted: '10 Sep' },
      { date: '2026-09-11', dayName: 'Fri', dayNum: '11', formatted: '11 Sep' },
      { date: '2026-09-12', dayName: 'Sat', dayNum: '12', formatted: '12 Sep' },
      { date: '2026-09-13', dayName: 'Sun', dayNum: '13', formatted: '13 Sep' },
    ],
  },
  {
    id: 'week-prev-1',
    label: '31 Aug – 06 Sep 2026 (Previous Week)',
    startDate: '2026-08-31',
    endDate: '2026-09-06',
    days: [
      { date: '2026-08-31', dayName: 'Mon', dayNum: '31', formatted: '31 Aug' },
      { date: '2026-09-01', dayName: 'Tue', dayNum: '01', formatted: '01 Sep' },
      { date: '2026-09-02', dayName: 'Wed', dayNum: '02', formatted: '02 Sep' },
      { date: '2026-09-03', dayName: 'Thu', dayNum: '03', formatted: '03 Sep' },
      { date: '2026-09-04', dayName: 'Fri', dayNum: '04', formatted: '04 Sep' },
      { date: '2026-09-05', dayName: 'Sat', dayNum: '05', formatted: '05 Sep' },
      { date: '2026-09-06', dayName: 'Sun', dayNum: '06', formatted: '06 Sep' },
    ],
  },
  {
    id: 'week-prev-2',
    label: '24 Aug – 30 Aug 2026 (2 Weeks Ago)',
    startDate: '2026-08-24',
    endDate: '2026-08-30',
    days: [
      { date: '2026-08-24', dayName: 'Mon', dayNum: '24', formatted: '24 Aug' },
      { date: '2026-08-25', dayName: 'Tue', dayNum: '25', formatted: '25 Aug' },
      { date: '2026-08-26', dayName: 'Wed', dayNum: '26', formatted: '26 Aug' },
      { date: '2026-08-27', dayName: 'Thu', dayNum: '27', formatted: '27 Aug' },
      { date: '2026-08-28', dayName: 'Fri', dayNum: '28', formatted: '28 Aug' },
      { date: '2026-08-29', dayName: 'Sat', dayNum: '29', formatted: '29 Aug' },
      { date: '2026-08-30', dayName: 'Sun', dayNum: '30', formatted: '30 Aug' },
    ],
  },
];

const COACHING_MONTHS = [
  { id: '2026-09', label: 'September 2026', totalWorkingDays: 24 },
  { id: '2026-08', label: 'August 2026', totalWorkingDays: 25 },
  { id: '2026-07', label: 'July 2026', totalWorkingDays: 26 },
];

export default function UnifiedAttendanceReportsPage() {
  const {
    students,
    classes,
    batches,
    schedules,
    attendanceSessions,
    liveSession,
    leaveRequests,
    holidays,
  } = useAttendance();

  // Top Filter States
  const [selectedBranch, setSelectedBranch] = useState<string>('all');
  const [isBranchPickerOpen, setIsBranchPickerOpen] = useState(false);
  const [isPeriodPickerOpen, setIsPeriodPickerOpen] = useState(false);
  const [isModePickerOpen, setIsModePickerOpen] = useState(false);

  const toolbarControlClass =
    'h-7 px-0.5 py-0.5 bg-transparent hover:bg-transparent border-0 rounded-none shadow-none ring-0 outline-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 text-xs sm:text-[13px] font-semibold text-[#172033] dark:text-slate-100 hover:text-[#2864E8] dark:hover:text-blue-400 inline-flex items-center gap-1.5 transition-colors cursor-pointer shrink-0';

  // View Mode: 'weekly' or 'monthly'
  const [reportMode, setReportMode] = useState<'weekly' | 'monthly'>('weekly');

  // Period States
  const [selectedWeekIndex, setSelectedWeekIndex] = useState<number>(0);
  const [selectedMonthIndex, setSelectedMonthIndex] = useState<number>(0);

  // Search & Secondary Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [selectedClassId, setSelectedClassId] = useState<string>('all');
  const [selectedBatchId, setSelectedBatchId] = useState<string>('all');
  const [attendanceRateFilter, setAttendanceRateFilter] = useState<'all' | 'high' | 'avg' | 'low'>('all');

  // Individual Student Modal State
  const [selectedStudentForReport, setSelectedStudentForReport] = useState<TStudent | null>(null);
  const [isIndividualModalOpen, setIsIndividualModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'weekly' | 'monthly'>('weekly');

  const currentWeek = COACHING_WEEKS[selectedWeekIndex] || COACHING_WEEKS[0];
  const currentMonth = COACHING_MONTHS[selectedMonthIndex] || COACHING_MONTHS[0];

  // Helper: compute single student day attendance record
  const getStudentDayRecord = (student: TStudent, dateStr: string) => {
    // 1. Check liveSession (if date is today 2026-09-11)
    if (liveSession && liveSession.date === dateStr && liveSession.studentRecords) {
      const liveRec = liveSession.studentRecords[student.id];
      if (liveRec) {
        if (liveRec.status === 'present' || liveRec.status === 'late') {
          return {
            status: 'Present' as const,
            checkIn: liveRec.checkInTime || '04:00 PM',
            checkOut: liveRec.checkOutTime || '06:00 PM',
            duration: '2h',
            subject: liveSession.subject || 'Mathematics',
          };
        }
        if (liveRec.status === 'leave') {
          return {
            status: 'Leave' as const,
            checkIn: '—',
            checkOut: '—',
            duration: '0h',
            subject: liveSession.subject || 'Mathematics',
          };
        }
        if (liveRec.status === 'absent') {
          return {
            status: 'Absent' as const,
            checkIn: '—',
            checkOut: '—',
            duration: '0h',
            subject: liveSession.subject || 'Mathematics',
          };
        }
      }
    }

    // 2. Check completed attendanceSessions
    const matchingSession = attendanceSessions.find(
      s => s.date === dateStr && s.studentRecords && s.studentRecords[student.id]
    );
    if (matchingSession && matchingSession.studentRecords) {
      const rec = matchingSession.studentRecords[student.id];
      if (rec.status === 'present' || rec.status === 'late') {
        return {
          status: 'Present' as const,
          checkIn: rec.checkInTime || '04:00 PM',
          checkOut: rec.checkOutTime || '06:00 PM',
          duration: '2h',
          subject: matchingSession.subject || 'Science',
        };
      }
      if (rec.status === 'leave') {
        return {
          status: 'Leave' as const,
          checkIn: '—',
          checkOut: '—',
          duration: '0h',
          subject: matchingSession.subject || 'Science',
        };
      }
      if (rec.status === 'absent') {
        return {
          status: 'Absent' as const,
          checkIn: '—',
          checkOut: '—',
          duration: '0h',
          subject: matchingSession.subject || 'Science',
        };
      }
    }

    // 3. Check approved leave requests
    const hasLeave = leaveRequests.some(
      l => l.studentId === student.id && l.date === dateStr && l.status === 'Approved'
    );
    if (hasLeave) {
      return {
        status: 'Leave' as const,
        checkIn: '—',
        checkOut: '—',
        duration: '0h',
        subject: 'Regular Class',
      };
    }

    // 4. Check institute holidays
    const isHoliday = holidays.some(h => h.date === dateStr);
    if (isHoliday) {
      return {
        status: 'Off' as const,
        checkIn: '—',
        checkOut: '—',
        duration: '0h',
        subject: 'Holiday',
      };
    }

    // 5. Deterministic fallback for mock demo data
    const roll = student.rollNo || 1;
    const dateNum = parseInt(dateStr.split('-')[2] || '1', 10);
    const dayOfWeek = new Date(dateStr).getDay(); // 0 is Sun

    if (dayOfWeek === 0) {
      // Check if this student's class/batch has an active Sunday schedule or special session
      const hasSundayClass = schedules.some(
        s => (s.classId === student.classId || s.batchId === student.batchId) &&
             (s.dayOfWeek === 0 || s.date === dateStr) &&
             s.status !== 'Cancelled' && s.status !== 'Holiday'
      );
      // Support realistic Sunday special classes / tests
      const hasSpecialSundaySession = hasSundayClass || (dateNum === 13 && (roll % 2 === 1));

      if (hasSpecialSundaySession) {
        return {
          status: 'Present' as const,
          checkIn: '10:00 AM',
          checkOut: '01:00 PM',
          duration: '3h',
          subject: 'Sunday Special Class',
        };
      }
      return { status: 'Off' as const, checkIn: '—', checkOut: '—', duration: '0h', subject: 'Sunday Off' };
    }

    // Specific profiles for realistic demo
    if (roll === 1) {
      // Aarav Sharma: 100% attendance, on time 04:00 PM
      return {
        status: 'Present' as const,
        checkIn: '04:00 PM',
        checkOut: '06:00 PM',
        duration: '2h',
        subject: 'Mathematics',
      };
    } else if (roll === 2) {
      // Bhavya Singh: Leave on Wednesday (9th), present rest
      if (dateNum === 9 || dayOfWeek === 3) {
        return { status: 'Leave' as const, checkIn: '—', checkOut: '—', duration: '0h', subject: 'Science' };
      }
      return {
        status: 'Present' as const,
        checkIn: '04:01 PM',
        checkOut: '06:00 PM',
        duration: '2h',
        subject: 'Science',
      };
    } else if (roll === 3) {
      // Karan Mehta: Absent on Tue (8th) & Fri (11th)
      if (dateNum === 8 || dateNum === 11 || dayOfWeek === 2) {
        return { status: 'Absent' as const, checkIn: '—', checkOut: '—', duration: '0h', subject: 'Mathematics' };
      }
      return {
        status: 'Present' as const,
        checkIn: '04:05 PM',
        checkOut: '06:00 PM',
        duration: '1h 55m',
        subject: 'Mathematics',
      };
    } else if (roll === 4) {
      // Neha Sharma: 100% Present
      return {
        status: 'Present' as const,
        checkIn: '04:00 PM',
        checkOut: '06:00 PM',
        duration: '2h',
        subject: 'Science',
      };
    } else {
      // General formula based on roll and date
      const hash = (roll * 7 + dateNum) % 10;
      if (hash === 2) {
        return { status: 'Absent' as const, checkIn: '—', checkOut: '—', duration: '0h', subject: 'Class Session' };
      }
      if (hash === 5) {
        return { status: 'Leave' as const, checkIn: '—', checkOut: '—', duration: '0h', subject: 'Class Session' };
      }
      const minute = 4 + (roll % 5);
      return {
        status: 'Present' as const,
        checkIn: `04:0${minute} PM`,
        checkOut: '06:00 PM',
        duration: '2h',
        subject: 'Class Session',
      };
    }
  };

  // Branch filtering & Student Report Aggregation
  const studentReports = useMemo(() => {
    // 1. Filter students by branch
    const branchFiltered = students.filter(st => {
      if (st.status !== 'active') return false;
      if (selectedBranch === 'all') return true;
      const parentClass = classes.find(c => c.id === st.classId);
      const parentBatch = batches.find(b => b.id === st.batchId);
      return (
        st.branchId === selectedBranch ||
        parentClass?.branchId === selectedBranch ||
        parentBatch?.branchId === selectedBranch
      );
    });

    return branchFiltered.map(student => {
      // Format branch name
      const studentBranchObj = IDL_BRANCHES.find(b => b.id === student.branchId);
      const branchName = studentBranchObj ? studentBranchObj.name : 'Budh Vihar';

      // Due Date fallback
      const effectiveDueDate = student.dueDate || '2026-09-10';
      const effectiveJoinDate = student.admissionDate || '2026-04-01';
      const fatherName = student.parentName || 'Rajesh Sharma (Father)';
      const contactPhone = student.phone || '+91 98110 11001';
      const parentPhone = student.parentPhone || '+91 99110 11001';

      // WEEKLY CALCULATIONS
      const weekDaysReport = currentWeek.days.map(day => {
        const record = getStudentDayRecord(student, day.date);
        return {
          ...day,
          ...record,
        };
      });

      const weeklyWorkingDays = weekDaysReport.filter(d => d.status !== 'Off').length;
      const weeklyPresent = weekDaysReport.filter(d => d.status === 'Present').length;
      const weeklyAbsent = weekDaysReport.filter(d => d.status === 'Absent').length;
      const weeklyLeave = weekDaysReport.filter(d => d.status === 'Leave').length;
      const weeklyPercent = weeklyWorkingDays > 0 ? Math.round((weeklyPresent / weeklyWorkingDays) * 100) : 0;

      // MONTHLY CALCULATIONS
      const totalWorkingDays = currentMonth.totalWorkingDays;
      let monthlyPresent = 0;
      let monthlyAbsent = 0;
      let monthlyLeave = 0;

      // Deterministic realistic monthly counts based on roll
      const roll = student.rollNo || 1;
      if (roll === 1 || roll === 4) {
        monthlyPresent = 23;
        monthlyAbsent = 0;
        monthlyLeave = 1;
      } else if (roll === 2) {
        monthlyPresent = 21;
        monthlyAbsent = 1;
        monthlyLeave = 2;
      } else if (roll === 3) {
        monthlyPresent = 17;
        monthlyAbsent = 5;
        monthlyLeave = 2;
      } else {
        const miss = (roll % 4);
        const lve = (roll % 3);
        monthlyAbsent = miss;
        monthlyLeave = lve;
        monthlyPresent = Math.max(16, totalWorkingDays - (monthlyAbsent + monthlyLeave));
      }
      const monthlyPercent = Math.round((monthlyPresent / totalWorkingDays) * 100);

      return {
        student,
        branchName,
        effectiveJoinDate,
        effectiveDueDate,
        fatherName,
        contactPhone,
        parentPhone,
        weekly: {
          days: weekDaysReport,
          workingDays: weeklyWorkingDays,
          present: weeklyPresent,
          absent: weeklyAbsent,
          leave: weeklyLeave,
          percent: weeklyPercent,
        },
        monthly: {
          workingDays: totalWorkingDays,
          present: monthlyPresent,
          absent: monthlyAbsent,
          leave: monthlyLeave,
          percent: monthlyPercent,
        },
      };
    });
  }, [students, classes, batches, selectedBranch, currentWeek, currentMonth, liveSession, attendanceSessions, leaveRequests, holidays]);

  // Secondary Filtered Students
  const filteredReports = useMemo(() => {
    return studentReports.filter(item => {
      const st = item.student;
      // Search
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = st.name.toLowerCase().includes(query);
        const matchesFather = item.fatherName.toLowerCase().includes(query);
        const matchesRoll = String((st as any).rollNumber || st.rollNo || st.id).toLowerCase().includes(query);
        const matchesPhone = item.contactPhone.includes(query) || item.parentPhone.includes(query);
        if (!matchesName && !matchesFather && !matchesRoll && !matchesPhone) return false;
      }

      // Class Filter
      if (selectedClassId !== 'all') {
        if (st.classId !== selectedClassId && st.className !== selectedClassId) return false;
      }

      // Batch Filter
      if (selectedBatchId !== 'all') {
        if (st.batchId !== selectedBatchId && st.batchName !== selectedBatchId) return false;
      }

      // Attendance Rate Filter
      const currentPct = reportMode === 'weekly' ? item.weekly.percent : item.monthly.percent;
      if (attendanceRateFilter === 'high' && currentPct < 85) return false;
      if (attendanceRateFilter === 'avg' && (currentPct < 75 || currentPct >= 85)) return false;
      if (attendanceRateFilter === 'low' && currentPct >= 75) return false;

      return true;
    }).sort((a, b) => a.student.name.localeCompare(b.student.name, undefined, { sensitivity: 'base' }));
  }, [studentReports, searchQuery, selectedClassId, selectedBatchId, attendanceRateFilter, reportMode]);

  // Top Statistics for currently displayed branch / scope
  const summaryStats = useMemo(() => {
    const totalStudents = studentReports.length;
    if (totalStudents === 0) {
      return { totalStudents: 0, avgPercent: 0, totalPresent: 0, totalAbsent: 0, totalLeave: 0, atRiskCount: 0 };
    }

    let sumPercent = 0;
    let totalPresent = 0;
    let totalAbsent = 0;
    let totalLeave = 0;
    let atRiskCount = 0;

    studentReports.forEach(r => {
      const metrics = reportMode === 'weekly' ? r.weekly : r.monthly;
      sumPercent += metrics.percent;
      totalPresent += metrics.present;
      totalAbsent += metrics.absent;
      totalLeave += metrics.leave;
      if (metrics.percent < 75) atRiskCount++;
    });

    const avgPercent = Math.round(sumPercent / totalStudents);
    return {
      totalStudents,
      avgPercent,
      totalPresent,
      totalAbsent,
      totalLeave,
      atRiskCount,
    };
  }, [studentReports, reportMode]);

  // Export CSV
  const handleExportCSV = () => {
    const headers = [
      'Student Name',
      'Father Name',
      'Class',
      'Batch',
      'Working Days',
      'Present',
      'Absent',
      'Leave',
      'Attendance %',
      'Status',
    ];

    const rows = filteredReports.map(r => {
      const metrics = reportMode === 'weekly' ? r.weekly : r.monthly;
      const statusText = metrics.percent >= 85 ? 'Excellent' : metrics.percent >= 75 ? 'Good' : 'Needs Attention';
      return [
        `"${r.student.name}"`,
        `"${r.fatherName}"`,
        `"${r.student.className}"`,
        `"${r.student.batchName}"`,
        metrics.workingDays,
        metrics.present,
        metrics.absent,
        metrics.leave,
        `${metrics.percent}%`,
        statusText,
      ].join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    const fileName = `IDL_Attendance_${reportMode.toUpperCase()}_Report_${selectedBranch}_${new Date().toISOString().split('T')[0]}.csv`;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Open Individual Student Report
  const handleOpenStudentModal = (student: TStudent) => {
    setSelectedStudentForReport(student);
    setModalMode(reportMode);
    setIsIndividualModalOpen(true);
  };

  // Selected student item for modal
  const selectedStudentItem = useMemo(() => {
    if (!selectedStudentForReport) return null;
    return studentReports.find(r => r.student.id === selectedStudentForReport.id) || null;
  }, [selectedStudentForReport, studentReports]);

  return (
    <div className="min-h-[calc(100svh-68px)] flex-1 flex flex-col overflow-x-hidden">
      {/* ------------------------------------------------------------- */}
      {/* TOP TOOLBAR (Exact Fee Management 100% Edge-to-Edge Style)    */}
      {/* ------------------------------------------------------------- */}
      <section
        aria-label="Attendance reports toolbar"
        className="w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border-b border-[#E5EAF2] dark:border-slate-800 md:sticky md:top-0 z-40"
      >
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between flex-wrap gap-4 sm:gap-6 min-w-0">
          {/* Left: Branch Selector + Period Selector + Report Mode */}
          <div className="flex items-center justify-start flex-wrap gap-4 sm:gap-6 min-w-0">
            {/* 1. Branch Selector */}
            <Popover open={isBranchPickerOpen} onOpenChange={setIsBranchPickerOpen}>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  aria-label="Select branch"
                  className={toolbarControlClass}
                >
                  {selectedBranch === 'all' ? (
                    <Globe className="w-3.5 h-3.5 text-[#2864E8] dark:text-blue-400 shrink-0" />
                  ) : (
                    <Building2 className="w-3.5 h-3.5 text-[#2864E8] dark:text-blue-400 shrink-0" />
                  )}
                  <span className="whitespace-nowrap">
                    {selectedBranch === 'all'
                      ? 'All Branches'
                      : IDL_BRANCHES.find(b => b.id === selectedBranch)?.name || 'All Branches'}
                  </span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 shrink-0 ${isBranchPickerOpen ? 'rotate-180 text-slate-700 dark:text-slate-200' : ''}`}
                  />
                </button>
              </PopoverTrigger>
              <PopoverContent
                align="start"
                sideOffset={8}
                className="w-[212px] p-2 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white z-50"
              >
                {/* All Branches option */}
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

            {/* 2. Date / Period Selector with Prev/Next Navigation */}
            <div className="inline-flex items-center gap-1.5">
              <Popover open={isPeriodPickerOpen} onOpenChange={setIsPeriodPickerOpen}>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    aria-label="Select period"
                    className={toolbarControlClass}
                  >
                    <Calendar className="w-3.5 h-3.5 text-[#2864E8] dark:text-blue-400 shrink-0" />
                    <span className="whitespace-nowrap">
                      {reportMode === 'weekly' ? currentWeek.label : currentMonth.label}
                    </span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 shrink-0 ${isPeriodPickerOpen ? 'rotate-180 text-slate-700 dark:text-slate-200' : ''}`}
                    />
                  </button>
                </PopoverTrigger>
                <PopoverContent
                  align="start"
                  sideOffset={8}
                  className="w-[260px] p-2 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white z-50"
                >
                  <div className="px-2 py-1.5 mb-1.5 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    <span>{reportMode === 'weekly' ? 'Select Coaching Week' : 'Select Coaching Month'}</span>
                  </div>
                  <div className="space-y-0.5 max-h-56 overflow-y-auto">
                    {reportMode === 'weekly' ? (
                      COACHING_WEEKS.map((w, idx) => {
                        const isSelected = selectedWeekIndex === idx;
                        return (
                          <button
                            key={w.id}
                            type="button"
                            onClick={() => {
                              setSelectedWeekIndex(idx);
                              setIsPeriodPickerOpen(false);
                            }}
                            className={`h-8 w-full px-2.5 rounded-lg text-xs flex items-center justify-between gap-2 transition-colors cursor-pointer select-none ${
                              isSelected
                                ? 'bg-blue-50/90 dark:bg-blue-950/40 text-[#2864E8] dark:text-blue-400 font-semibold'
                                : 'text-slate-700 dark:text-slate-200 font-medium hover:bg-slate-100 dark:hover:bg-slate-800'
                            }`}
                          >
                            <span className="truncate">{w.label}</span>
                            {isSelected && <Check className="w-3.5 h-3.5 text-[#2864E8] shrink-0" />}
                          </button>
                        );
                      })
                    ) : (
                      COACHING_MONTHS.map((m, idx) => {
                        const isSelected = selectedMonthIndex === idx;
                        return (
                          <button
                            key={m.id}
                            type="button"
                            onClick={() => {
                              setSelectedMonthIndex(idx);
                              setIsPeriodPickerOpen(false);
                            }}
                            className={`h-8 w-full px-2.5 rounded-lg text-xs flex items-center justify-between gap-2 transition-colors cursor-pointer select-none ${
                              isSelected
                                ? 'bg-blue-50/90 dark:bg-blue-950/40 text-[#2864E8] dark:text-blue-400 font-semibold'
                                : 'text-slate-700 dark:text-slate-200 font-medium hover:bg-slate-100 dark:hover:bg-slate-800'
                            }`}
                          >
                            <span className="truncate">{m.label}</span>
                            {isSelected && <Check className="w-3.5 h-3.5 text-[#2864E8] shrink-0" />}
                          </button>
                        );
                      })
                    )}
                  </div>
                </PopoverContent>
              </Popover>

              {/* Clean Prev / Next Navigation */}
              <div className="inline-flex items-center gap-0.5 ml-1 bg-slate-100/80 dark:bg-slate-800/60 rounded-md p-0.5 border border-slate-200/70 dark:border-slate-700/60">
                <button
                  type="button"
                  disabled={reportMode === 'weekly' ? selectedWeekIndex >= COACHING_WEEKS.length - 1 : selectedMonthIndex >= COACHING_MONTHS.length - 1}
                  onClick={() => {
                    if (reportMode === 'weekly') {
                      setSelectedWeekIndex(prev => Math.min(COACHING_WEEKS.length - 1, prev + 1));
                    } else {
                      setSelectedMonthIndex(prev => Math.min(COACHING_MONTHS.length - 1, prev + 1));
                    }
                  }}
                  className="w-5 h-5 flex items-center justify-center rounded text-slate-500 hover:text-slate-900 hover:bg-white dark:hover:bg-slate-700 dark:hover:text-white disabled:opacity-30 disabled:hover:bg-transparent disabled:cursor-not-allowed cursor-pointer transition-colors"
                  title="Previous week"
                  aria-label="Previous week"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  disabled={reportMode === 'weekly' ? selectedWeekIndex <= 0 : selectedMonthIndex <= 0}
                  onClick={() => {
                    if (reportMode === 'weekly') {
                      setSelectedWeekIndex(prev => Math.max(0, prev - 1));
                    } else {
                      setSelectedMonthIndex(prev => Math.max(0, prev - 1));
                    }
                  }}
                  className="w-5 h-5 flex items-center justify-center rounded text-slate-500 hover:text-slate-900 hover:bg-white dark:hover:bg-slate-700 dark:hover:text-white disabled:opacity-30 disabled:hover:bg-transparent disabled:cursor-not-allowed cursor-pointer transition-colors"
                  title="Next week"
                  aria-label="Next week"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* 3. Report Mode Selector */}
            <Popover open={isModePickerOpen} onOpenChange={setIsModePickerOpen}>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  aria-label="Select report mode"
                  className={toolbarControlClass}
                >
                  <CalendarDays className="w-3.5 h-3.5 text-[#2864E8] dark:text-blue-400 shrink-0" />
                  <span className="whitespace-nowrap">
                    {reportMode === 'weekly' ? 'Weekly Report' : 'Monthly Report'}
                  </span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 shrink-0 ${isModePickerOpen ? 'rotate-180 text-slate-700 dark:text-slate-200' : ''}`}
                  />
                </button>
              </PopoverTrigger>
              <PopoverContent
                align="start"
                sideOffset={8}
                className="w-[200px] p-2 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white z-50"
              >
                <div className="space-y-0.5">
                  <button
                    type="button"
                    onClick={() => {
                      setReportMode('weekly');
                      setIsModePickerOpen(false);
                    }}
                    className={`h-8 w-full px-2.5 rounded-lg text-xs flex items-center justify-between gap-2 transition-colors cursor-pointer select-none ${
                      reportMode === 'weekly'
                        ? 'bg-blue-50/90 dark:bg-blue-950/40 text-[#2864E8] dark:text-blue-400 font-semibold'
                        : 'text-slate-700 dark:text-slate-200 font-medium hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <CalendarDays className="w-3.5 h-3.5 text-[#2864E8]" />
                      <span>Weekly Report</span>
                    </span>
                    {reportMode === 'weekly' && <Check className="w-3.5 h-3.5 text-[#2864E8]" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setReportMode('monthly');
                      setIsModePickerOpen(false);
                    }}
                    className={`h-8 w-full px-2.5 rounded-lg text-xs flex items-center justify-between gap-2 transition-colors cursor-pointer select-none ${
                      reportMode === 'monthly'
                        ? 'bg-blue-50/90 dark:bg-blue-950/40 text-[#2864E8] dark:text-blue-400 font-semibold'
                        : 'text-slate-700 dark:text-slate-200 font-medium hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-[#2864E8]" />
                      <span>Monthly Report</span>
                    </span>
                    {reportMode === 'monthly' && <Check className="w-3.5 h-3.5 text-[#2864E8]" />}
                  </button>
                </div>
              </PopoverContent>
            </Popover>
          </div>

          {/* Right Action: Print (Icon Only, Matches Fee Dashboard Height) */}
          <div className="flex items-center shrink-0">
            <button
              type="button"
              onClick={() => window.print()}
              className="h-7 w-7 rounded-md flex items-center justify-center text-slate-500 hover:text-[#2864E8] dark:text-slate-400 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Print Report"
              aria-label="Print Report"
            >
              <Printer className="w-3.5 h-3.5 shrink-0" />
            </button>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* MAIN CONTENT CONTAINER (Fee Dashboard Proportion & Spacing)   */}
      {/* ------------------------------------------------------------- */}
      <div className="container mx-auto p-4 sm:p-6 lg:p-8 max-w-7xl flex-1 space-y-6 pb-12">
        {/* TOP SUMMARY METRICS CARDS (EXACT FEE DASHBOARD KPI STYLE & PROPORTIONS) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4">
          {/* 1. Students */}
          <Card className="rounded-2xl border border-[#E9EEF5] dark:border-slate-800 bg-white dark:bg-slate-900 shadow-[0_1px_3px_rgba(15,23,42,0.03)] hover:border-slate-300/80 dark:hover:border-slate-700 transition-all h-full flex flex-col justify-between">
            <CardContent className="p-3.5 sm:p-4 flex flex-col justify-between h-full">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0" />
                <span className="text-[11.5px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-[0.4px]">
                  Students
                </span>
              </div>
              <div className="text-[24px] sm:text-[25px] font-bold text-slate-900 dark:text-white tracking-tight mt-1.5 tabular-nums leading-tight">
                {summaryStats.totalStudents}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-normal mt-0.5 truncate">
                Active enrolled in branch
              </p>
            </CardContent>
          </Card>

          {/* 2. Avg Attendance */}
          <Card className="rounded-2xl border border-[#E9EEF5] dark:border-slate-800 bg-white dark:bg-slate-900 shadow-[0_1px_3px_rgba(15,23,42,0.03)] hover:border-slate-300/80 dark:hover:border-slate-700 transition-all h-full flex flex-col justify-between">
            <CardContent className="p-3.5 sm:p-4 flex flex-col justify-between h-full">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                <span className="text-[11.5px] font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-[0.4px]">
                  Avg Attendance
                </span>
              </div>
              <div className="text-[24px] sm:text-[25px] font-bold text-emerald-600 dark:text-emerald-400 tracking-tight mt-1.5 tabular-nums leading-tight">
                {summaryStats.avgPercent}%
              </div>
              <p className="text-[11px] text-emerald-700/80 dark:text-emerald-400/80 font-normal mt-0.5 truncate">
                {summaryStats.avgPercent >= 75 ? 'Compliant this period' : 'Below 75% target'}
              </p>
            </CardContent>
          </Card>

          {/* 3. Total Present */}
          <Card className="rounded-2xl border border-[#E9EEF5] dark:border-slate-800 bg-white dark:bg-slate-900 shadow-[0_1px_3px_rgba(15,23,42,0.03)] hover:border-slate-300/80 dark:hover:border-slate-700 transition-all h-full flex flex-col justify-between">
            <CardContent className="p-3.5 sm:p-4 flex flex-col justify-between h-full">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2864E8] shrink-0" />
                <span className="text-[11.5px] font-semibold text-blue-700 dark:text-blue-400 uppercase tracking-[0.4px]">
                  Total Present
                </span>
              </div>
              <div className="text-[24px] sm:text-[25px] font-bold text-[#2864E8] dark:text-blue-400 tracking-tight mt-1.5 tabular-nums leading-tight">
                {summaryStats.totalPresent}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-normal mt-0.5 truncate">
                Present sessions recorded
              </p>
            </CardContent>
          </Card>

          {/* 4. Total Absent */}
          <Card className="rounded-2xl border border-[#E9EEF5] dark:border-slate-800 bg-white dark:bg-slate-900 shadow-[0_1px_3px_rgba(15,23,42,0.03)] hover:border-slate-300/80 dark:hover:border-slate-700 transition-all h-full flex flex-col justify-between">
            <CardContent className="p-3.5 sm:p-4 flex flex-col justify-between h-full">
              <div className="flex items-center gap-1.5">
                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${summaryStats.totalAbsent > 0 ? 'bg-rose-500 animate-pulse' : 'bg-slate-400'}`} />
                <span className={`text-[11.5px] font-semibold uppercase tracking-[0.4px] ${summaryStats.totalAbsent > 0 ? 'text-rose-700 dark:text-rose-400' : 'text-slate-500 dark:text-slate-400'}`}>
                  Total Absent
                </span>
              </div>
              <div className={`text-[24px] sm:text-[25px] font-bold mt-1.5 tracking-tight tabular-nums leading-tight ${summaryStats.totalAbsent > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-slate-800 dark:text-slate-200'}`}>
                {summaryStats.totalAbsent}
              </div>
              <p className={`text-[11px] font-normal mt-0.5 truncate ${summaryStats.totalAbsent > 0 ? 'text-rose-600/80 dark:text-rose-400/80' : 'text-slate-400'}`}>
                {summaryStats.atRiskCount} {summaryStats.atRiskCount === 1 ? 'student' : 'students'} at risk (&lt;75%)
              </p>
            </CardContent>
          </Card>

          {/* 5. Approved Leaves */}
          <Card className="rounded-2xl border border-[#E9EEF5] dark:border-slate-800 bg-white dark:bg-slate-900 shadow-[0_1px_3px_rgba(15,23,42,0.03)] hover:border-slate-300/80 dark:hover:border-slate-700 transition-all h-full flex flex-col justify-between">
            <CardContent className="p-3.5 sm:p-4 flex flex-col justify-between h-full">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                <span className="text-[11.5px] font-semibold text-amber-700 dark:text-amber-400 uppercase tracking-[0.4px]">
                  Approved Leaves
                </span>
              </div>
              <div className="text-[24px] sm:text-[25px] font-bold text-amber-600 dark:text-amber-400 tracking-tight mt-1.5 tabular-nums leading-tight">
                {summaryStats.totalLeave}
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
      {/* STUDENT ATTENDANCE REPORT TABLE                               */}
      {/* ------------------------------------------------------------- */}
      <Card className="rounded-2xl border border-[#E9EEF5] dark:border-slate-800 bg-white dark:bg-slate-900 shadow-[0_1px_3px_rgba(15,23,42,0.03)]">
        <CardHeader className="py-3 px-4 sm:px-6 border-b border-slate-100 dark:border-slate-800/80">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <CardTitle className="text-base sm:text-[17px] font-bold text-slate-900 dark:text-white tracking-[-0.015em] leading-snug uppercase">
                {reportMode === 'weekly'
                  ? `STUDENT WEEKLY ATTENDANCE MATRIX (${filteredReports.length})`
                  : `STUDENT MONTHLY ATTENDANCE REGISTER (${filteredReports.length})`}
              </CardTitle>
              <CardDescription className="text-xs text-slate-500 dark:text-slate-400 font-normal leading-relaxed mt-0.5">
                Comprehensive student report including parent details and attendance records.
              </CardDescription>
            </div>

            {/* Filter Row: [ CLASS ] [ BATCH ] [ STATUS ] [ Search (Rightmost, Round) ] */}
            <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap justify-end">
              {/* 1. CLASS */}
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
                  {classes.map(c => (
                    <SelectItem key={c.id} value={c.name} className="text-xs">Class {c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* 2. BATCH */}
              <Select value={selectedBatchId} onValueChange={setSelectedBatchId}>
                <SelectTrigger className="h-7 !border-0 !border-b-0 !shadow-none !ring-0 !outline-none px-1 text-[11px] font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white focus:!outline-none focus:!ring-0 focus:!ring-offset-0 focus:!shadow-none data-[state=open]:!shadow-none data-[state=open]:!border-b-0 gap-1 cursor-pointer w-auto [&>span]:line-clamp-none [&>svg]:w-3 [&>svg]:h-3 [&>svg]:opacity-60 tracking-wider uppercase">
                  <SelectValue placeholder="BATCH">
                    {selectedBatchId === 'all'
                      ? 'BATCH'
                      : batches.find(b => b.name === selectedBatchId || b.id === selectedBatchId)?.name.toUpperCase() || selectedBatchId.toUpperCase()}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all" className="text-xs font-semibold">All Batches</SelectItem>
                  {batches
                    .filter(b => selectedClassId === 'all' || b.className === selectedClassId || b.classId === selectedClassId)
                    .map(b => (
                      <SelectItem key={b.id} value={b.name} className="text-xs">Batch {b.name}</SelectItem>
                    ))}
                </SelectContent>
              </Select>

              {/* 3. STATUS */}
              <Select value={attendanceRateFilter} onValueChange={(val: any) => setAttendanceRateFilter(val)}>
                <SelectTrigger className="h-7 !border-0 !border-b-0 !shadow-none !ring-0 !outline-none px-1 text-[11px] font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white focus:!outline-none focus:!ring-0 focus:!ring-offset-0 focus:!shadow-none data-[state=open]:!shadow-none data-[state=open]:!border-b-0 gap-1 cursor-pointer w-auto [&>span]:line-clamp-none [&>svg]:w-3 [&>svg]:h-3 [&>svg]:opacity-60 tracking-wider uppercase">
                  <SelectValue placeholder="STATUS">
                    {attendanceRateFilter === 'all'
                      ? 'STATUS'
                      : attendanceRateFilter === 'high'
                      ? '> 85%'
                      : attendanceRateFilter === 'avg'
                      ? '75 - 84%'
                      : '< 75%'}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all" className="text-xs font-semibold">All Status</SelectItem>
                  <SelectItem value="high" className="text-xs">Above 85% (Excellent)</SelectItem>
                  <SelectItem value="avg" className="text-xs">75% - 84% (Good)</SelectItem>
                  <SelectItem value="low" className="text-xs">Below 75% (Critical Alert)</SelectItem>
                </SelectContent>
              </Select>

              {/* 4. Search Bar (Rightmost, 100% round, expands right-to-left) */}
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
                      ? 'w-48 sm:w-60 h-7 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 shadow-xs px-2.5'
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
                      if (!searchQuery.trim()) {
                        setIsSearchOpen(false);
                      }
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
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50/90 dark:bg-slate-900/70 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-[0.06em] text-[10.5px] border-b border-slate-200/80 dark:border-slate-800/80">
                <tr>
                  <th className="py-3 px-3.5 pl-5 whitespace-nowrap min-w-[240px]">STUDENT NAME &amp; DETAILS</th>
                  <th className="py-3 px-3.5 whitespace-nowrap min-w-[170px]">CLASS/BATCH</th>
                  {reportMode === 'weekly' ? (
                    <th className="py-3 px-3.5 text-center whitespace-nowrap min-w-[280px]">WEEKLY MATRIX (MON – SUN)</th>
                  ) : (
                    <th className="py-3 px-3.5 whitespace-nowrap min-w-[220px]">MONTHLY SUMMARY (P / A / L)</th>
                  )}
                  <th className="py-3 px-3.5 text-center whitespace-nowrap w-[110px] min-w-[100px]">ATTENDANCE %</th>
                  <th className="py-3 px-3.5 text-right pr-5 whitespace-nowrap min-w-[85px]">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {filteredReports.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-slate-400">
                      <Users className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-700 mb-2" />
                      <p className="font-semibold text-xs text-slate-600 dark:text-slate-300">
                        {selectedClassId !== 'all' || selectedBatchId !== 'all' || attendanceRateFilter !== 'all' || searchQuery.trim()
                          ? 'No matching students'
                          : 'No students found'}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {selectedClassId !== 'all' || selectedBatchId !== 'all' || attendanceRateFilter !== 'all' || searchQuery.trim()
                          ? 'Try adjusting your class, batch, status or search filter.'
                          : 'No students enrolled for this selection.'}
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredReports.map((item) => {
                    const st = item.student;
                    const metrics = reportMode === 'weekly' ? item.weekly : item.monthly;
                    const isCritical = metrics.percent < 75;
                    const isExcellent = metrics.percent >= 85;

                    return (
                      <tr
                        key={st.id}
                        className="bg-white hover:bg-slate-50/60 dark:bg-slate-900 dark:hover:bg-slate-800/40 transition-colors duration-150"
                      >
                        {/* Student Name & Details */}
                        <td className="py-3 px-3.5 pl-5 whitespace-nowrap align-middle">
                          <div className="font-bold text-slate-900 dark:text-white text-[13.5px] sm:text-[14px] tracking-tight leading-tight">
                            {st.name}
                          </div>
                          <div className="text-[12px] font-medium text-slate-600 dark:text-slate-300 leading-tight mt-1 flex items-center">
                            <span className="text-slate-400 dark:text-slate-500 font-normal mr-1">Father:</span>
                            <span className="capitalize">{item.fatherName || '—'}</span>
                          </div>
                          <div className="text-[11px] font-mono font-medium text-slate-500 dark:text-slate-400 leading-tight mt-1 flex items-center">
                            <span className="text-slate-400 dark:text-slate-500 font-sans font-normal mr-1">Admission No.:</span>
                            <span>{(st as any).rollNumber || st.rollNo || st.id}</span>
                          </div>
                        </td>

                        {/* Class & Batch */}
                        <td className="py-3 px-3.5 whitespace-nowrap align-middle">
                          <div className="flex items-center gap-1.5 leading-none">
                            <span className="text-[13px] font-bold text-slate-800 dark:text-slate-200">
                              Class {st.className}
                            </span>
                            {st.batchName && (
                              <>
                                <span className="inline-block w-px h-3.5 bg-slate-200 dark:bg-slate-700 mx-1 shrink-0" aria-hidden="true" />
                                <span className="text-[12.5px] font-medium text-slate-600 dark:text-slate-400">
                                  Batch {st.batchName.replace(/^batch\s+/i, '')}
                                </span>
                              </>
                            )}
                          </div>
                        </td>

                        {/* Weekly Matrix OR Monthly Summary */}
                        {reportMode === 'weekly' ? (
                          <td className="py-3 px-3.5 align-middle">
                            <div className="flex items-center justify-center gap-1.5">
                              {item.weekly.days.map(d => {
                                let badgeColor = 'bg-slate-100 text-slate-400 border border-slate-200/70 dark:bg-slate-800/80 dark:text-slate-500 dark:border-slate-700/60';
                                let title = `${d.formatted}: Holiday / No Class`;

                                if (d.status === 'Present') {
                                  badgeColor = 'bg-emerald-500 text-white border border-emerald-600/30 shadow-xs';
                                  title = `${d.formatted} (${d.dayName}): Present (Check-in ${d.checkIn})`;
                                } else if (d.status === 'Absent') {
                                  badgeColor = 'bg-rose-500 text-white border border-rose-600/30 shadow-xs';
                                  title = `${d.formatted} (${d.dayName}): Absent`;
                                } else if (d.status === 'Leave') {
                                  badgeColor = 'bg-amber-500 text-white border border-amber-600/30 shadow-xs';
                                  title = `${d.formatted} (${d.dayName}): Approved Leave`;
                                }

                                return (
                                  <div
                                    key={d.date}
                                    title={title}
                                    className={`w-6 h-6 sm:w-[26px] sm:h-[26px] rounded-[6px] flex items-center justify-center font-bold text-[11px] cursor-help ${badgeColor}`}
                                  >
                                    {d.status === 'Present'
                                      ? 'P'
                                      : d.status === 'Absent'
                                      ? 'A'
                                      : d.status === 'Leave'
                                      ? 'L'
                                      : '—'}
                                  </div>
                                );
                              })}
                              <span className="text-[11.5px] sm:text-[12px] font-mono text-slate-600 dark:text-slate-400 ml-2 font-semibold whitespace-nowrap">
                                {item.weekly.present}/{item.weekly.workingDays}d
                              </span>
                            </div>
                          </td>
                        ) : (
                          <td className="py-3 px-3.5 align-middle">
                            <div className="space-y-1">
                              <div className="flex items-center justify-between text-[11px]">
                                <span className="font-medium text-slate-600 dark:text-slate-300">
                                  <b className="text-emerald-600 dark:text-emerald-400">{item.monthly.present}P</b> •{' '}
                                  <b className="text-rose-600 dark:text-rose-400">{item.monthly.absent}A</b> •{' '}
                                  <b className="text-amber-600 dark:text-amber-400">{item.monthly.leave}L</b>
                                </span>
                                <span className="text-slate-400 dark:text-slate-500 font-mono text-[10px]">
                                  {item.monthly.workingDays} working days
                                </span>
                              </div>
                              <Progress value={item.monthly.percent} className="h-1.5 bg-slate-100 dark:bg-slate-800" />
                            </div>
                          </td>
                        )}

                        {/* Attendance % Badge */}
                        <td className="py-3 px-3.5 text-center whitespace-nowrap align-middle">
                          <div className="flex flex-col items-center justify-center">
                            <span
                              className={`h-7 min-w-[62px] px-2.5 inline-flex items-center justify-center text-[11.5px] font-mono font-bold tracking-tight rounded-lg whitespace-nowrap ${
                                isCritical
                                  ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border border-rose-200/90 dark:border-rose-800/60'
                                  : isExcellent
                                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200/90 dark:border-emerald-800/60'
                                  : 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border border-blue-200/90 dark:border-blue-800/60'
                              }`}
                            >
                              {metrics.percent}%
                            </span>
                          </div>
                        </td>

                        {/* Action: Open Individual Report */}
                        <td className="py-3 px-3.5 text-right pr-5 whitespace-nowrap align-middle">
                          <div className="flex items-center justify-end">
                            <button
                              type="button"
                              onClick={() => handleOpenStudentModal(st)}
                              className="h-7 px-2.5 inline-flex items-center justify-center gap-1.5 text-[11px] font-bold tracking-wider rounded-lg border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:text-[#2864E8] dark:hover:text-blue-400 hover:border-blue-200 dark:hover:border-blue-800 hover:bg-blue-50/50 dark:hover:bg-slate-800 transition-colors cursor-pointer uppercase shadow-none"
                              title="View Details"
                            >
                              <span>VIEW</span>
                              <Eye className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* INDIVIDUAL STUDENT REPORT MODAL (Drilldown)                    */}
      {/* ------------------------------------------------------------- */}
      <Dialog open={isIndividualModalOpen} onOpenChange={setIsIndividualModalOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-0 gap-0 rounded-2xl border-slate-200 bg-white">
          <DialogHeader className="sr-only">
            <DialogTitle>{selectedStudentItem?.student?.name || 'Student Attendance Report'}</DialogTitle>
            <DialogDescription>
              {selectedStudentItem
                ? `Attendance details for ${selectedStudentItem.student.name}`
                : 'Student detailed attendance report'}
            </DialogDescription>
          </DialogHeader>
          {selectedStudentItem && (
            <div>
              {/* Modal Header */}
              <div className="bg-slate-900 text-white p-5 sm:p-6 rounded-t-2xl relative">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-xl bg-blue-600 text-white font-black text-lg flex items-center justify-center shrink-0 shadow-md">
                      {selectedStudentItem.student.name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-lg sm:text-xl font-black text-white">
                          {selectedStudentItem.student.name}
                        </h2>
                        <Badge className="bg-blue-500/30 text-blue-200 border-blue-400/40 text-[10px] font-bold">
                          Roll #{selectedStudentItem.student.rollNo}
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-300 mt-0.5">
                        Class {selectedStudentItem.student.className} • Batch {selectedStudentItem.student.batchName} • {selectedStudentItem.branchName}
                      </p>
                    </div>
                  </div>

                  {/* Period Switcher inside modal */}
                  <div className="inline-flex items-center p-1 bg-slate-800 rounded-lg border border-slate-700 self-start sm:self-auto">
                    <button
                      type="button"
                      onClick={() => setModalMode('weekly')}
                      className={`px-2.5 py-1 rounded text-xs font-bold transition-all cursor-pointer ${
                        modalMode === 'weekly' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Weekly Report
                    </button>
                    <button
                      type="button"
                      onClick={() => setModalMode('monthly')}
                      className={`px-2.5 py-1 rounded text-xs font-bold transition-all cursor-pointer ${
                        modalMode === 'monthly' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Monthly Report
                    </button>
                  </div>
                </div>

                {/* Key Student Details Bar */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-slate-800 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">
                      Father / Guardian
                    </span>
                    <span className="text-white font-medium truncate block">
                      {selectedStudentItem.fatherName}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">
                      Contact Phone
                    </span>
                    <span className="text-white font-mono font-medium block">
                      {selectedStudentItem.parentPhone}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">
                      Admission Date
                    </span>
                    <span className="text-white font-mono font-medium block">
                      {formatDateDisplay(selectedStudentItem.effectiveJoinDate)}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">
                      Fee Due Date
                    </span>
                    <span className="text-amber-300 font-mono font-medium block">
                      {formatDateDisplay(selectedStudentItem.effectiveDueDate)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-5 sm:p-6 space-y-6">
                {/* Metric Summary Ribbon */}
                {(() => {
                  const m = modalMode === 'weekly' ? selectedStudentItem.weekly : selectedStudentItem.monthly;
                  return (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                          Attendance Rate
                        </span>
                        <div className="mt-1 flex items-baseline gap-2">
                          <span className={`text-2xl font-black ${
                            m.percent >= 85 ? 'text-emerald-600' : m.percent >= 75 ? 'text-blue-600' : 'text-rose-600'
                          }`}>
                            {m.percent}%
                          </span>
                          <span className="text-[11px] text-slate-500 font-medium">
                            {m.percent >= 75 ? 'Regular' : 'Irregular'}
                          </span>
                        </div>
                      </div>

                      <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200/80">
                        <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">
                          Present Sessions
                        </span>
                        <div className="mt-1 flex items-baseline gap-1">
                          <span className="text-2xl font-black text-emerald-700">{m.present}</span>
                          <span className="text-xs text-emerald-600 font-medium">/ {m.workingDays} Days</span>
                        </div>
                      </div>

                      <div className="p-3.5 rounded-xl bg-rose-50/60 border border-rose-200/80">
                        <span className="text-[10px] font-bold text-rose-800 uppercase tracking-wider block">
                          Absent Sessions
                        </span>
                        <div className="mt-1 flex items-baseline gap-1">
                          <span className="text-2xl font-black text-rose-700">{m.absent}</span>
                          <span className="text-xs text-rose-600 font-medium">Days missed</span>
                        </div>
                      </div>

                      <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200/80">
                        <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block">
                          Approved Leaves
                        </span>
                        <div className="mt-1 flex items-baseline gap-1">
                          <span className="text-2xl font-black text-amber-700">{m.leave}</span>
                          <span className="text-xs text-amber-600 font-medium">Informed</span>
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* Day-by-Day Session History Table */}
                <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
                  <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-blue-600" />
                      <span>
                        {modalMode === 'weekly'
                          ? `Week Session Log (${currentWeek.label})`
                          : `Monthly Attendance Log (${currentMonth.label})`}
                      </span>
                    </span>
                    <span className="text-[11px] text-slate-500 font-medium">
                      Exact check-in arrival tracking
                    </span>
                  </div>

                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50/50 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        <th className="py-2.5 px-3">Date &amp; Day</th>
                        <th className="py-2.5 px-3">Subject</th>
                        <th className="py-2.5 px-3">Status</th>
                        <th className="py-2.5 px-3">Arrival Check-In</th>
                        <th className="py-2.5 px-3">Departure Check-Out</th>
                        <th className="py-2.5 px-3">Attended Duration</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {selectedStudentItem.weekly.days.map(d => (
                        <tr key={d.date} className="hover:bg-slate-50/60">
                          <td className="py-2.5 px-3 font-medium text-slate-800">
                            <span>{d.formatted}</span>{' '}
                            <span className="text-slate-400 font-normal">({d.dayName})</span>
                          </td>
                          <td className="py-2.5 px-3 text-slate-600">
                            {d.subject || 'Mathematics'}
                          </td>
                          <td className="py-2.5 px-3">
                            {d.status === 'Present' ? (
                              <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 font-bold text-[10px]">
                                ✓ Present
                              </Badge>
                            ) : d.status === 'Absent' ? (
                              <Badge className="bg-rose-100 text-rose-800 border-rose-200 font-bold text-[10px]">
                                ✗ Absent
                              </Badge>
                            ) : d.status === 'Leave' ? (
                              <Badge className="bg-amber-100 text-amber-800 border-amber-200 font-bold text-[10px]">
                                ✈ Leave
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="text-slate-400 border-slate-200 text-[10px]">
                                — Holiday
                              </Badge>
                            )}
                          </td>
                          <td className="py-2.5 px-3 font-mono font-medium text-slate-700">
                            {d.status === 'Present' ? (
                              <span className="text-emerald-700 font-semibold flex items-center gap-1">
                                <Clock className="h-3 w-3 text-emerald-600" />
                                {d.checkIn}
                              </span>
                            ) : (
                              <span className="text-slate-400">—</span>
                            )}
                          </td>
                          <td className="py-2.5 px-3 font-mono text-slate-500">
                            {d.status === 'Present' ? d.checkOut : '—'}
                          </td>
                          <td className="py-2.5 px-3 font-mono font-semibold text-slate-800">
                            {d.duration}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Parent Communication & Actions Footer */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    {/* WhatsApp Report to Parent */}
                    <a
                      href={`https://wa.me/${selectedStudentItem.parentPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                        `Dear ${selectedStudentItem.fatherName},\nHere is the attendance report for ${selectedStudentItem.student.name} (${selectedStudentItem.student.className} Batch ${selectedStudentItem.student.batchName}):\n- Attendance Rate: ${
                          modalMode === 'weekly'
                            ? selectedStudentItem.weekly.percent
                            : selectedStudentItem.monthly.percent
                        }%\n- Present Days: ${
                          modalMode === 'weekly'
                            ? selectedStudentItem.weekly.present
                            : selectedStudentItem.monthly.present
                        }\n- Missed Days: ${
                          modalMode === 'weekly'
                            ? selectedStudentItem.weekly.absent
                            : selectedStudentItem.monthly.absent
                        }\nFee Due Date: ${formatDateDisplay(selectedStudentItem.effectiveDueDate)}\nRegards, IDL Education`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button
                        size="sm"
                        className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold h-8 gap-1.5 shadow-xs cursor-pointer"
                      >
                        <Share2 className="h-3.5 w-3.5" />
                        <span>WhatsApp Parent</span>
                      </Button>
                    </a>

                    {/* Direct Call Parent */}
                    <a href={`tel:${selectedStudentItem.parentPhone}`}>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs font-bold h-8 gap-1.5 border-slate-300 text-slate-700 cursor-pointer"
                      >
                        <PhoneCall className="h-3.5 w-3.5 text-blue-600" />
                        <span>Call Parent</span>
                      </Button>
                    </a>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => window.print()}
                      className="text-xs font-bold h-8 gap-1.5 border-slate-300 text-slate-700 cursor-pointer"
                    >
                      <Printer className="h-3.5 w-3.5 text-slate-600" />
                      <span>Print Student Card</span>
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => setIsIndividualModalOpen(false)}
                      className="text-xs font-bold h-8 px-4 cursor-pointer"
                    >
                      Close
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
