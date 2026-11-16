'use client';

import React, { useState, useMemo } from 'react';
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
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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

// Predefined Coaching Weeks around Sep 2026
const COACHING_WEEKS: CoachingWeek[] = [
  {
    id: 'week-current',
    label: '07 Sep – 12 Sep 2026 (Current Week)',
    startDate: '2026-09-07',
    endDate: '2026-09-12',
    days: [
      { date: '2026-09-07', dayName: 'Mon', dayNum: '07', formatted: '07 Sep' },
      { date: '2026-09-08', dayName: 'Tue', dayNum: '08', formatted: '08 Sep' },
      { date: '2026-09-09', dayName: 'Wed', dayNum: '09', formatted: '09 Sep' },
      { date: '2026-09-10', dayName: 'Thu', dayNum: '10', formatted: '10 Sep' },
      { date: '2026-09-11', dayName: 'Fri', dayNum: '11', formatted: '11 Sep' },
      { date: '2026-09-12', dayName: 'Sat', dayNum: '12', formatted: '12 Sep' },
    ],
  },
  {
    id: 'week-prev-1',
    label: '31 Aug – 05 Sep 2026 (Previous Week)',
    startDate: '2026-08-31',
    endDate: '2026-09-05',
    days: [
      { date: '2026-08-31', dayName: 'Mon', dayNum: '31', formatted: '31 Aug' },
      { date: '2026-09-01', dayName: 'Tue', dayNum: '01', formatted: '01 Sep' },
      { date: '2026-09-02', dayName: 'Wed', dayNum: '02', formatted: '02 Sep' },
      { date: '2026-09-03', dayName: 'Thu', dayNum: '03', formatted: '03 Sep' },
      { date: '2026-09-04', dayName: 'Fri', dayNum: '04', formatted: '04 Sep' },
      { date: '2026-09-05', dayName: 'Sat', dayNum: '05', formatted: '05 Sep' },
    ],
  },
  {
    id: 'week-prev-2',
    label: '24 Aug – 29 Aug 2026 (2 Weeks Ago)',
    startDate: '2026-08-24',
    endDate: '2026-08-29',
    days: [
      { date: '2026-08-24', dayName: 'Mon', dayNum: '24', formatted: '24 Aug' },
      { date: '2026-08-25', dayName: 'Tue', dayNum: '25', formatted: '25 Aug' },
      { date: '2026-08-26', dayName: 'Wed', dayNum: '26', formatted: '26 Aug' },
      { date: '2026-08-27', dayName: 'Thu', dayNum: '27', formatted: '27 Aug' },
      { date: '2026-08-28', dayName: 'Fri', dayNum: '28', formatted: '28 Aug' },
      { date: '2026-08-29', dayName: 'Sat', dayNum: '29', formatted: '29 Aug' },
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

  // View Mode: 'weekly' or 'monthly'
  const [reportMode, setReportMode] = useState<'weekly' | 'monthly'>('weekly');

  // Period States
  const [selectedWeekIndex, setSelectedWeekIndex] = useState<number>(0);
  const [selectedMonthIndex, setSelectedMonthIndex] = useState<number>(0);

  // Search & Secondary Filters
  const [searchQuery, setSearchQuery] = useState('');
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
        const matchesRoll = String(st.rollNo).includes(query);
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
    });
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
      'Roll No',
      'Student Name',
      'Father Name',
      'Class',
      'Batch',
      'Branch',
      'Join Date',
      'Fee Due Date',
      'Student Phone',
      'Parent Phone',
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
        r.student.rollNo,
        `"${r.student.name}"`,
        `"${r.fatherName}"`,
        `"${r.student.className}"`,
        `"${r.student.batchName}"`,
        `"${r.branchName}"`,
        r.effectiveJoinDate,
        r.effectiveDueDate,
        r.contactPhone,
        r.parentPhone,
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
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      {/* ------------------------------------------------------------- */}
      {/* TOP TOOLBAR (Exact Fee Management & Overview UI Style)         */}
      {/* ------------------------------------------------------------- */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl px-4 py-3 shadow-[0_1px_3px_rgba(15,23,42,0.04)]">
        <div className="flex items-center justify-between flex-wrap gap-3">
          {/* Left: Branch Selector + Mode Segmented Toggle + Period Selector */}
          <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
            {/* 1. Branch Selector Popover */}
            <Popover open={isBranchPickerOpen} onOpenChange={setIsBranchPickerOpen}>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  aria-label="Select branch"
                  className="h-8 px-2.5 py-1 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg text-xs sm:text-[13px] font-semibold text-[#172033] dark:text-slate-100 hover:text-[#2864E8] hover:border-blue-300 dark:hover:text-blue-400 inline-flex items-center gap-2 transition-colors cursor-pointer select-none focus:outline-none"
                >
                  {selectedBranch === 'all' ? (
                    <Globe className="w-3.5 h-3.5 text-[#2864E8] dark:text-blue-400 shrink-0" />
                  ) : (
                    <Building2 className="w-3.5 h-3.5 text-[#2864E8] dark:text-blue-400 shrink-0" />
                  )}
                  <span className="whitespace-nowrap font-medium">
                    {IDL_BRANCHES.find(b => b.id === selectedBranch)?.name || 'All Branches'}
                  </span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-150 shrink-0 ${isBranchPickerOpen ? 'rotate-180 text-slate-700 dark:text-slate-200' : ''}`}
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

            {/* 2. Unified Report Mode Segmented Switcher (Weekly / Monthly) */}
            <div className="inline-flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-200/80 dark:border-slate-700">
              <button
                type="button"
                onClick={() => setReportMode('weekly')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
                  reportMode === 'weekly'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <CalendarDays className="h-3.5 w-3.5" />
                <span>Weekly Report</span>
              </button>
              <button
                type="button"
                onClick={() => setReportMode('monthly')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
                  reportMode === 'monthly'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Calendar className="h-3.5 w-3.5" />
                <span>Monthly Report</span>
              </button>
            </div>

            {/* 3. Period Navigator (Prev / Next & Quick Select) */}
            {reportMode === 'weekly' ? (
              <div className="flex items-center gap-1 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 text-xs">
                <button
                  type="button"
                  disabled={selectedWeekIndex >= COACHING_WEEKS.length - 1}
                  onClick={() => setSelectedWeekIndex(prev => Math.min(COACHING_WEEKS.length - 1, prev + 1))}
                  className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                  title="Previous Week"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                </button>
                <span className="font-semibold text-slate-800 dark:text-slate-200 px-1 whitespace-nowrap">
                  {currentWeek.label}
                </span>
                <button
                  type="button"
                  disabled={selectedWeekIndex <= 0}
                  onClick={() => setSelectedWeekIndex(prev => Math.max(0, prev - 1))}
                  className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                  title="Next Week"
                >
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 text-xs">
                <button
                  type="button"
                  disabled={selectedMonthIndex >= COACHING_MONTHS.length - 1}
                  onClick={() => setSelectedMonthIndex(prev => Math.min(COACHING_MONTHS.length - 1, prev + 1))}
                  className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                  title="Previous Month"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                </button>
                <span className="font-semibold text-slate-800 dark:text-slate-200 px-1 whitespace-nowrap">
                  {currentMonth.label}
                </span>
                <button
                  type="button"
                  disabled={selectedMonthIndex <= 0}
                  onClick={() => setSelectedMonthIndex(prev => Math.max(0, prev - 1))}
                  className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                  title="Next Month"
                >
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Right Actions: Export CSV + Print Report */}
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={handleExportCSV}
              className="text-xs font-semibold h-8 gap-1.5 border-slate-200 hover:bg-slate-50 text-slate-700 cursor-pointer"
            >
              <Download className="h-3.5 w-3.5 text-blue-600" />
              <span>Export CSV</span>
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => window.print()}
              className="text-xs font-semibold h-8 gap-1.5 border-slate-200 hover:bg-slate-50 text-slate-700 cursor-pointer"
            >
              <Printer className="h-3.5 w-3.5 text-slate-600" />
              <span>Print All</span>
            </Button>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* SUMMARY KPI CARDS                                             */}
      {/* ------------------------------------------------------------- */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {/* Total Students */}
        <Card className="border-slate-200 shadow-xs">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Students
              </span>
              <div className="h-7 w-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <Users className="h-3.5 w-3.5" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-2xl font-black text-slate-900">{summaryStats.totalStudents}</span>
              <span className="text-[11px] text-slate-500 font-medium">In branch</span>
            </div>
          </CardContent>
        </Card>

        {/* Avg Attendance */}
        <Card className="border-slate-200 shadow-xs border-l-4 border-l-emerald-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">
                Avg Attendance
              </span>
              <div className="h-7 w-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Percent className="h-3.5 w-3.5" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-2xl font-black text-emerald-600">{summaryStats.avgPercent}%</span>
              <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 font-bold text-[10px]">
                {summaryStats.avgPercent >= 75 ? 'Compliant' : 'Low'}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Total Present */}
        <Card className="border-slate-200 shadow-xs">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Total Present
              </span>
              <div className="h-7 w-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="h-3.5 w-3.5" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-2xl font-black text-slate-900">{summaryStats.totalPresent}</span>
              <span className="text-[11px] text-slate-500 font-medium">Sessions</span>
            </div>
          </CardContent>
        </Card>

        {/* Total Absent */}
        <Card className="border-slate-200 shadow-xs">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-rose-600 uppercase tracking-wider">
                Total Absent
              </span>
              <div className="h-7 w-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
                <XCircle className="h-3.5 w-3.5" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-2xl font-black text-rose-600">{summaryStats.totalAbsent}</span>
              <span className="text-[11px] text-rose-500 font-medium">{summaryStats.atRiskCount} at risk (&lt;75%)</span>
            </div>
          </CardContent>
        </Card>

        {/* Approved Leave */}
        <Card className="border-slate-200 shadow-xs col-span-2 sm:col-span-1">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider">
                Approved Leaves
              </span>
              <div className="h-7 w-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                <PlaneTakeoff className="h-3.5 w-3.5" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-2xl font-black text-amber-600">{summaryStats.totalLeave}</span>
              <span className="text-[11px] text-amber-700 font-medium">Informed</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* FILTER & SEARCH BAR                                           */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 flex-1 min-w-[260px] max-w-md">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <Input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by student name, father name, phone, roll..."
              className="pl-9 h-8 text-xs bg-slate-50/70 border-slate-200 focus-visible:ring-1 focus-visible:ring-blue-500"
            />
          </div>
          {searchQuery && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setSearchQuery('')}
              className="h-8 px-2 text-xs text-slate-400 hover:text-slate-600"
            >
              Clear
            </Button>
          )}
        </div>

        {/* Dropdown Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Class Filter */}
          <select
            value={selectedClassId}
            onChange={e => {
              setSelectedClassId(e.target.value);
              setSelectedBatchId('all'); // reset batch on class change
            }}
            className="h-8 px-2.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
          >
            <option value="all">All Classes</option>
            {classes.map(c => (
              <option key={c.id} value={c.name}>
                Class {c.name}
              </option>
            ))}
          </select>

          {/* Batch Filter */}
          <select
            value={selectedBatchId}
            onChange={e => setSelectedBatchId(e.target.value)}
            className="h-8 px-2.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
          >
            <option value="all">All Batches</option>
            {batches
              .filter(b => selectedClassId === 'all' || b.className === selectedClassId || b.classId === selectedClassId)
              .map(b => (
                <option key={b.id} value={b.name}>
                  Batch {b.name}
                </option>
              ))}
          </select>

          {/* Attendance Threshold Filter */}
          <select
            value={attendanceRateFilter}
            onChange={e => setAttendanceRateFilter(e.target.value as any)}
            className="h-8 px-2.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
          >
            <option value="all">All Attendance</option>
            <option value="high">Above 85% (Excellent)</option>
            <option value="avg">75% - 84% (Good)</option>
            <option value="low">Below 75% (Critical Alert)</option>
          </select>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* STUDENT ATTENDANCE REPORT TABLE                               */}
      {/* ------------------------------------------------------------- */}
      <Card className="border-slate-200 shadow-sm overflow-hidden">
        <CardHeader className="p-4 sm:p-5 flex flex-row items-center justify-between border-b border-slate-100 bg-slate-50/50">
          <div>
            <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
              <FileText className="h-4 w-4 text-blue-600" />
              <span>
                {reportMode === 'weekly'
                  ? `Student Weekly Attendance Matrix (${currentWeek.label})`
                  : `Student Monthly Attendance Register (${currentMonth.label})`}
              </span>
            </CardTitle>
            <CardDescription className="text-xs text-slate-500 mt-0.5">
              Comprehensive student report including parent details, admission date, fee due date, and attendance records.
            </CardDescription>
          </div>
          <Badge variant="outline" className="text-xs font-semibold border-slate-200 bg-white text-slate-700">
            {filteredReports.length} {filteredReports.length === 1 ? 'Student' : 'Students'}
          </Badge>
        </CardHeader>

        <CardContent className="p-0 overflow-x-auto">
          {filteredReports.length === 0 ? (
            <div className="py-16 px-4 text-center space-y-3">
              <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-800">No students found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                No students match your filter criteria for this branch or class. Try selecting another branch or clearing your search.
              </p>
            </div>
          ) : (
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                  <th className="py-3 px-3.5 text-center w-12">#</th>
                  <th className="py-3 px-3 min-w-[210px]">Student &amp; Father Details</th>
                  <th className="py-3 px-3 min-w-[120px]">Class &amp; Batch</th>
                  <th className="py-3 px-3 min-w-[110px]">Branch</th>
                  <th className="py-3 px-3 min-w-[100px]">Join Date</th>
                  <th className="py-3 px-3 min-w-[100px]">Fee Due Date</th>
                  <th className="py-3 px-3 min-w-[150px]">Contact Numbers</th>
                  {reportMode === 'weekly' ? (
                    <th className="py-3 px-3 min-w-[240px] text-center">
                      Weekly Matrix (Mon – Sat)
                    </th>
                  ) : (
                    <th className="py-3 px-3 min-w-[200px]">
                      Monthly Summary (P / A / L)
                    </th>
                  )}
                  <th className="py-3 px-3 text-center min-w-[110px]">Attendance %</th>
                  <th className="py-3 px-3.5 text-right min-w-[110px]">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredReports.map((item, index) => {
                  const st = item.student;
                  const metrics = reportMode === 'weekly' ? item.weekly : item.monthly;
                  const isCritical = metrics.percent < 75;
                  const isExcellent = metrics.percent >= 85;

                  return (
                    <tr
                      key={st.id}
                      className="hover:bg-blue-50/30 transition-colors group"
                    >
                      {/* # Index / Roll */}
                      <td className="py-3 px-3.5 text-center font-mono text-slate-500 font-semibold">
                        {st.rollNo || index + 1}
                      </td>

                      {/* Student Name & Father Name */}
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2.5">
                          <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs shrink-0">
                            {st.name.charAt(0)}
                          </div>
                          <div className="min-w-0">
                            <span className="font-bold text-slate-900 block truncate text-[13px] group-hover:text-blue-600 transition-colors">
                              {st.name}
                            </span>
                            <span className="text-[11px] text-slate-500 truncate block">
                              {item.fatherName}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Class & Batch */}
                      <td className="py-3 px-3">
                        <div className="space-y-0.5">
                          <span className="font-semibold text-slate-800 block text-xs">
                            Class {st.className}
                          </span>
                          <span className="text-[11px] text-slate-500 block">
                            Batch {st.batchName}
                          </span>
                        </div>
                      </td>

                      {/* Branch */}
                      <td className="py-3 px-3">
                        <Badge variant="outline" className="bg-slate-50 text-slate-700 border-slate-200 text-[11px] font-medium inline-flex items-center gap-1">
                          <Building2 className="h-3 w-3 text-slate-400" />
                          <span>{item.branchName}</span>
                        </Badge>
                      </td>

                      {/* Join Date */}
                      <td className="py-3 px-3 text-slate-600 font-mono text-[11.5px]">
                        {formatDateDisplay(item.effectiveJoinDate)}
                      </td>

                      {/* Due Date */}
                      <td className="py-3 px-3">
                        <span className="inline-flex items-center gap-1 text-[11.5px] font-mono font-medium text-slate-700 bg-amber-50/80 text-amber-800 px-2 py-0.5 rounded border border-amber-200/80">
                          <Calendar className="h-3 w-3 text-amber-600" />
                          <span>{formatDateDisplay(item.effectiveDueDate)}</span>
                        </span>
                      </td>

                      {/* Contact Numbers */}
                      <td className="py-3 px-3">
                        <div className="space-y-0.5 text-[11px]">
                          <div className="flex items-center gap-1 text-slate-700">
                            <span className="text-slate-400 font-mono text-[10px]">St:</span>
                            <span className="font-mono">{item.contactPhone}</span>
                          </div>
                          <div className="flex items-center gap-1 text-slate-500">
                            <span className="text-slate-400 font-mono text-[10px]">Pa:</span>
                            <span className="font-mono">{item.parentPhone}</span>
                          </div>
                        </div>
                      </td>

                      {/* Weekly Matrix OR Monthly Summary */}
                      {reportMode === 'weekly' ? (
                        <td className="py-3 px-3">
                          <div className="flex items-center justify-center gap-1.5">
                            {item.weekly.days.map(d => {
                              let badgeColor = 'bg-slate-100 text-slate-400 border-slate-200';
                              let title = `${d.formatted}: Holiday / No Class`;

                              if (d.status === 'Present') {
                                badgeColor = 'bg-emerald-500 text-white border-emerald-600';
                                title = `${d.formatted} (${d.dayName}): Present (Check-in ${d.checkIn})`;
                              } else if (d.status === 'Absent') {
                                badgeColor = 'bg-rose-500 text-white border-rose-600';
                                title = `${d.formatted} (${d.dayName}): Absent`;
                              } else if (d.status === 'Leave') {
                                badgeColor = 'bg-amber-500 text-white border-amber-600';
                                title = `${d.formatted} (${d.dayName}): Approved Leave`;
                              }

                              return (
                                <div
                                  key={d.date}
                                  title={title}
                                  className={`w-6 h-6 rounded flex items-center justify-center font-bold text-[10px] border shadow-xs cursor-help ${badgeColor}`}
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
                            <span className="text-[11px] font-mono text-slate-500 ml-1.5 font-semibold">
                              {item.weekly.present}/{item.weekly.workingDays}d
                            </span>
                          </div>
                        </td>
                      ) : (
                        <td className="py-3 px-3">
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-[11px]">
                              <span className="font-medium text-slate-600">
                                <b className="text-emerald-700">{item.monthly.present}P</b> •{' '}
                                <b className="text-rose-600">{item.monthly.absent}A</b> •{' '}
                                <b className="text-amber-700">{item.monthly.leave}L</b>
                              </span>
                              <span className="text-slate-400 font-mono text-[10px]">
                                {item.monthly.workingDays} working days
                              </span>
                            </div>
                            <Progress value={item.monthly.percent} className="h-1.5 bg-slate-100" />
                          </div>
                        </td>
                      )}

                      {/* Attendance % Badge */}
                      <td className="py-3 px-3 text-center">
                        <Badge
                          className={`font-mono font-bold text-xs px-2.5 py-0.5 ${
                            isCritical
                              ? 'bg-rose-100 text-rose-800 border-rose-200'
                              : isExcellent
                              ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                              : 'bg-blue-100 text-blue-800 border-blue-200'
                          }`}
                        >
                          {metrics.percent}%
                        </Badge>
                      </td>

                      {/* Action: Open Individual Report */}
                      <td className="py-3 px-3.5 text-right">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleOpenStudentModal(st)}
                          className="h-7 text-xs font-bold text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-2 gap-1 cursor-pointer"
                        >
                          <FileText className="h-3.5 w-3.5" />
                          <span>View Report</span>
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>

      {/* ------------------------------------------------------------- */}
      {/* INDIVIDUAL STUDENT REPORT MODAL (Drilldown)                    */}
      {/* ------------------------------------------------------------- */}
      <Dialog open={isIndividualModalOpen} onOpenChange={setIsIndividualModalOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-0 gap-0 rounded-2xl border-slate-200 bg-white">
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
