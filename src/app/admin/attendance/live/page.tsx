'use client';

import React, { useState, useMemo, useRef } from 'react';
import Link from 'next/link';
import { useAttendance } from '@/context/attendance-context';
import {
  Radio,
  Check,
  X,
  Search,
  Building2,
  Globe,
  ChevronDown,
  PlaneTakeoff,
  RotateCcw,
  UserCheck,
  Users,
  GraduationCap,
  Clock,
  Edit3,
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
import { StudentStatus, getCurrentTimeFormatted } from '@/lib/attendance-store';

// Branches list matching Fees Management, Classes & Students pages
const IDL_BRANCHES = [
  { id: 'all', name: 'All Branches' },
  { id: 'budh-vihar', name: 'Budh Vihar' },
  { id: 'krishan-vihar', name: 'Krishan Vihar' },
  { id: 'mangolpuri', name: 'Mangol Puri' },
  { id: 'mukherjee-nagar', name: 'Mukherjee Nagar' },
];

export default function LiveAttendancePage() {
  const {
    students,
    classes,
    batches,
    liveSession,
    markStudentStatus,
    bulkMarkPresent,
    resetLiveAttendance,
  } = useAttendance();

  // Branch Selection Popover
  const [selectedBranch, setSelectedBranch] = useState<string>('all');
  const [isBranchPickerOpen, setIsBranchPickerOpen] = useState(false);

  // Filters
  const [selectedClassId, setSelectedClassId] = useState<string>('all');
  const [selectedBatchId, setSelectedBatchId] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Arrival time editing state
  const [editingTimeStudentId, setEditingTimeStudentId] = useState<string | null>(null);
  const [customTimeInput, setCustomTimeInput] = useState('');

  const toolbarControlClass =
    'h-7 px-0.5 py-0.5 bg-transparent hover:bg-transparent border-0 rounded-none shadow-none ring-0 outline-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 text-xs sm:text-[13px] font-semibold text-[#172033] dark:text-slate-100 hover:text-[#2864E8] dark:hover:text-blue-400 inline-flex items-center gap-1.5 transition-colors cursor-pointer shrink-0';

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

  // Map student live statuses from context (treat any legacy 'live' status as 'present')
  const getStudentLiveStatus = (studentId: string): StudentStatus => {
    if (liveSession && liveSession.studentRecords && liveSession.studentRecords[studentId]) {
      const st = liveSession.studentRecords[studentId].status;
      return st === 'live' ? 'present' : st;
    }
    return 'not_arrived';
  };

  // Get student check-in / arrival time
  const getStudentCheckInTime = (studentId: string): string | undefined => {
    if (liveSession && liveSession.studentRecords && liveSession.studentRecords[studentId]) {
      return liveSession.studentRecords[studentId].checkInTime;
    }
    return undefined;
  };

  // Filtered Students Roster
  const filteredStudents = useMemo(() => {
    return students.filter(st => {
      if (st.status === 'archived') return false;

      // Branch filter
      if (selectedBranch !== 'all') {
        const parentClass = classes.find(c => c.id === st.classId);
        const parentBatch = batches.find(b => b.id === st.batchId);
        const branchMatch =
          st.branchId === selectedBranch ||
          parentClass?.branchId === selectedBranch ||
          parentBatch?.branchId === selectedBranch;
        if (!branchMatch) return false;
      }

      // Class filter
      if (selectedClassId !== 'all' && st.classId !== selectedClassId) {
        return false;
      }

      // Batch filter
      if (selectedBatchId !== 'all') {
        if (st.batchId !== selectedBatchId && st.batchName !== selectedBatchId) {
          return false;
        }
      }

      // Status filter
      const currentStatus = getStudentLiveStatus(st.id);
      if (statusFilter !== 'all') {
        if (statusFilter === 'present' && currentStatus !== 'present') return false;
        if (statusFilter === 'absent' && currentStatus !== 'absent') return false;
        if (statusFilter === 'leave' && currentStatus !== 'leave') return false;
        if (statusFilter === 'not_arrived' && currentStatus !== 'not_arrived') return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const nameMatch = st.name.toLowerCase().includes(q);
        const rollMatch = String(st.rollNo).includes(q);
        const phoneMatch = (st.phone || '').includes(q) || (st.parentPhone || '').includes(q);
        if (!nameMatch && !rollMatch && !phoneMatch) return false;
      }

      return true;
    });
  }, [students, classes, batches, selectedBranch, selectedClassId, selectedBatchId, statusFilter, searchQuery, liveSession]);

  // Metric Tiles Calculations based on current branch, class, and batch filter
  const metrics = useMemo(() => {
    // Determine scope of students matching current branch/class/batch
    const scopedStudents = students.filter(st => {
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
      if (selectedBatchId !== 'all' && st.batchId !== selectedBatchId && st.batchName !== selectedBatchId) {
        return false;
      }

      return true;
    });

    const total = scopedStudents.length;
    let present = 0;
    let absent = 0;
    let leave = 0;
    let notArrived = 0;

    scopedStudents.forEach(st => {
      const status = getStudentLiveStatus(st.id);
      if (status === 'present') present++;
      else if (status === 'absent') absent++;
      else if (status === 'leave') leave++;
      else notArrived++;
    });

    const presentPercent = total > 0 ? Math.round((present / total) * 100) : 0;

    return {
      total,
      present,
      absent,
      leave,
      notArrived,
      presentPercent,
    };
  }, [students, classes, batches, selectedBranch, selectedClassId, selectedBatchId, liveSession]);

  // Bulk mark all currently visible students present
  const handleMarkAllVisiblePresent = () => {
    const idsToMark = filteredStudents.map(s => s.id);
    if (idsToMark.length === 0) return;
    bulkMarkPresent(idsToMark);
  };

  // Reset live attendance
  const handleReset = () => {
    resetLiveAttendance();
  };

  const selectedBranchObj = IDL_BRANCHES.find(b => b.id === selectedBranch);

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
          {/* Left: Branch Selector + Live Indicator */}
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
                      : selectedBranchObj?.name || 'All Branches'}
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
                {/* Option 1: All Branches */}
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

            {/* Live Session Status Indicator */}
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50/70 dark:bg-emerald-950/30 px-2.5 py-0.5 rounded-full border border-emerald-200/60 dark:border-emerald-800/50">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="tracking-[0.3px] uppercase text-[11px] font-bold">Live Attendance</span>
            </div>
          </div>

          {/* Right Action Buttons: Mark All Present & Reset */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleMarkAllVisiblePresent}
              disabled={filteredStudents.length === 0}
              className="inline-flex items-center gap-1.5 h-7 px-2.5 rounded-lg text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50/90 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-950/60 border border-emerald-200/80 dark:border-emerald-800 transition-colors cursor-pointer disabled:opacity-50"
              title="Mark all visible students present"
            >
              <UserCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Mark All Present</span>
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 h-7 px-2.5 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-50/90 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200/80 dark:border-slate-700 transition-colors cursor-pointer"
              title="Reset Attendance"
            >
              <RotateCcw className="w-3 h-3 text-slate-500 dark:text-slate-400" />
              <span>Reset</span>
            </button>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* MAIN CONTENT CONTAINER (Fee Dashboard Proportion & Spacing)   */}
      {/* ------------------------------------------------------------- */}
      <div className="container mx-auto p-4 sm:p-6 lg:p-8 max-w-7xl flex-1 space-y-6 pb-12">
        {/* TOP SUMMARY METRICS CARDS (EXACT FEE DASHBOARD KPI STYLE & PROPORTIONS) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 sm:gap-4">
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
                {metrics.total}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-normal mt-0.5 truncate">
                Active enrolled in branch
              </p>
            </CardContent>
          </Card>

          {/* 2. Present */}
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
                {metrics.presentPercent}% attended
              </p>
            </CardContent>
          </Card>

          {/* 3. Absent */}
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
                Unexcused absence
              </p>
            </CardContent>
          </Card>

          {/* 4. Approved Leaves */}
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
        {/* STUDENT LIVE ATTENDANCE ROSTER TABLE                          */}
        {/* ------------------------------------------------------------- */}
        <Card className="rounded-2xl border border-[#E9EEF5] dark:border-slate-800 bg-white dark:bg-slate-900 shadow-[0_1px_3px_rgba(15,23,42,0.03)]">
          <CardHeader className="py-3 px-4 sm:px-6 border-b border-slate-100 dark:border-slate-800/80">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <CardTitle className="text-base sm:text-[17px] font-bold text-slate-900 dark:text-white tracking-[-0.015em] leading-snug uppercase">
                  LIVE ATTENDANCE ROSTER ({filteredStudents.length})
                </CardTitle>
                <CardDescription className="text-xs text-slate-500 dark:text-slate-400 font-normal leading-relaxed mt-0.5">
                  Real-time student check-in, arrival timestamps and single-click attendance marking.
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
                    {availableClasses.map(c => (
                      <SelectItem key={c.id} value={c.id} className="text-xs">
                        {c.displayName || c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* 2. BATCH */}
                <Select
                  value={selectedBatchId}
                  onValueChange={setSelectedBatchId}
                >
                  <SelectTrigger className="h-7 !border-0 !border-b-0 !shadow-none !ring-0 !outline-none px-1 text-[11px] font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white focus:!outline-none focus:!ring-0 focus:!ring-offset-0 focus:!shadow-none data-[state=open]:!shadow-none data-[state=open]:!border-b-0 gap-1 cursor-pointer w-auto [&>span]:line-clamp-none [&>svg]:w-3 [&>svg]:h-3 [&>svg]:opacity-60 tracking-wider uppercase">
                    <SelectValue placeholder="BATCH">
                      {selectedBatchId === 'all'
                        ? 'BATCH'
                        : availableBatches.find(b => b.id === selectedBatchId)?.name.toUpperCase() || selectedBatchId.toUpperCase()}
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

                {/* 3. STATUS */}
                <Select
                  value={statusFilter}
                  onValueChange={setStatusFilter}
                >
                  <SelectTrigger className="h-7 !border-0 !border-b-0 !shadow-none !ring-0 !outline-none px-1 text-[11px] font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white focus:!outline-none focus:!ring-0 focus:!ring-offset-0 focus:!shadow-none data-[state=open]:!shadow-none data-[state=open]:!border-b-0 gap-1 cursor-pointer w-auto [&>span]:line-clamp-none [&>svg]:w-3 [&>svg]:h-3 [&>svg]:opacity-60 tracking-wider uppercase">
                    <SelectValue placeholder="STATUS">
                      {statusFilter === 'all'
                        ? 'STATUS'
                        : statusFilter === 'not_arrived'
                        ? 'NOT MARKED'
                        : statusFilter.toUpperCase()}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all" className="text-xs font-semibold">All Status</SelectItem>
                    <SelectItem value="present" className="text-xs">Present</SelectItem>
                    <SelectItem value="absent" className="text-xs">Absent</SelectItem>
                    <SelectItem value="leave" className="text-xs">Leave</SelectItem>
                    <SelectItem value="not_arrived" className="text-xs">Not Marked</SelectItem>
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
                      placeholder="Search student or roll #..."
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
            {filteredStudents.length === 0 ? (
              <div className="py-12 text-center text-slate-400 space-y-2">
                <GraduationCap className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-700" />
                <p className="font-semibold text-xs text-slate-600 dark:text-slate-300">
                  {selectedClassId !== 'all' || selectedBatchId !== 'all' || statusFilter !== 'all' || searchQuery.trim()
                    ? 'No matching students found'
                    : 'No students enrolled for this selection'}
                </p>
                <p className="text-[11px] text-slate-400 max-w-sm mx-auto">
                  {selectedClassId !== 'all' || selectedBatchId !== 'all' || statusFilter !== 'all' || searchQuery.trim()
                    ? 'Try clearing or adjusting your branch, class, batch, or search filters.'
                    : 'Please select a different branch or class.'}
                </p>
                {(selectedClassId !== 'all' || selectedBatchId !== 'all' || statusFilter !== 'all' || searchQuery.trim()) && (
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
                      <th className="py-3 px-3.5 pl-5 whitespace-nowrap min-w-[240px]">STUDENT DETAILS</th>
                      <th className="py-3 px-3.5 whitespace-nowrap min-w-[150px]">CLASS &amp; BATCH</th>
                      <th className="py-3 px-3.5 whitespace-nowrap min-w-[130px]">CURRENT STATUS</th>
                      <th className="py-3 px-3.5 whitespace-nowrap min-w-[130px]">ARRIVAL TIME</th>
                      <th className="py-3 px-3.5 pr-5 text-right whitespace-nowrap min-w-[240px]">MARK ATTENDANCE</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                    {filteredStudents.map(student => {
                      const currentStatus = getStudentLiveStatus(student.id);
                      const checkInTime = getStudentCheckInTime(student.id);
                      const isPresent = currentStatus === 'present';
                      const isAbsent = currentStatus === 'absent';
                      const isLeave = currentStatus === 'leave';
                      const isNotMarked = currentStatus === 'not_arrived' || !currentStatus;

                      return (
                        <tr
                          key={student.id}
                          className="bg-white hover:bg-slate-50/60 dark:bg-slate-900 dark:hover:bg-slate-800/40 transition-colors duration-150"
                        >
                          {/* Student Details */}
                          <td className="py-3 px-3.5 pl-5 whitespace-nowrap align-middle">
                            <Link
                              href={`/admin/attendance/students/${student.id}`}
                              className="font-bold text-slate-900 dark:text-white hover:text-[#2864E8] dark:hover:text-blue-400 transition-colors text-[13.5px] sm:text-[14px] tracking-tight leading-tight block"
                            >
                              {student.name}
                            </Link>
                            <div className="text-[12px] font-medium text-slate-600 dark:text-slate-300 leading-tight mt-1 flex items-center">
                              <span className="text-slate-400 dark:text-slate-500 font-normal mr-1">Father:</span>
                              <span className="capitalize">{student.parentName || (student as any).fatherName || '—'}</span>
                            </div>
                            <div className="text-[11px] font-mono font-medium text-slate-500 dark:text-slate-400 leading-tight mt-1 flex items-center">
                              <span className="text-slate-400 dark:text-slate-500 font-sans font-normal mr-1">Admission No.:</span>
                              <span>{student.rollNo || student.id}</span>
                              {(student.phone || student.parentPhone) && (
                                <>
                                  <span className="mx-1.5 text-slate-300 dark:text-slate-600">•</span>
                                  <span className="font-mono text-slate-400 dark:text-slate-500">{student.phone || student.parentPhone}</span>
                                </>
                              )}
                            </div>
                          </td>

                          {/* Class & Batch Badge */}
                          <td className="py-3 px-3.5 whitespace-nowrap align-middle">
                            <div className="space-y-0.5">
                              <span className="font-semibold text-slate-800 dark:text-slate-200 block text-xs sm:text-[13px]">
                                {student.className}
                              </span>
                              <span className="text-[11px] text-slate-400 dark:text-slate-500 block">
                                Batch {student.batchName}
                              </span>
                            </div>
                          </td>

                          {/* Status Tag */}
                          <td className="py-3 px-3.5 whitespace-nowrap align-middle">
                            {isPresent && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                                <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400 shrink-0" />
                                Present
                              </span>
                            )}
                            {isAbsent && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                                <X className="w-3 h-3 text-rose-600 dark:text-rose-400 shrink-0" />
                                Absent
                              </span>
                            )}
                            {isLeave && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                                <PlaneTakeoff className="w-3 h-3 text-amber-600 dark:text-amber-400 shrink-0" />
                                Leave
                              </span>
                            )}
                            {isNotMarked && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                                Not Marked
                              </span>
                            )}
                          </td>

                          {/* Arrival / Entry Time Column */}
                          <td className="py-3 px-3.5 whitespace-nowrap align-middle">
                            {isPresent ? (
                              <Popover
                                open={editingTimeStudentId === student.id}
                                onOpenChange={open => {
                                  if (open) {
                                    setEditingTimeStudentId(student.id);
                                    setCustomTimeInput(checkInTime || getCurrentTimeFormatted());
                                  } else {
                                    setEditingTimeStudentId(null);
                                  }
                                }}
                              >
                                <PopoverTrigger asChild>
                                  <button
                                    type="button"
                                    className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-50/90 hover:bg-emerald-100/90 dark:bg-emerald-950/50 dark:hover:bg-emerald-900/60 border border-emerald-200/90 dark:border-emerald-800/80 text-emerald-800 dark:text-emerald-300 font-mono text-[11.5px] font-semibold transition-colors cursor-pointer group"
                                    title="Click to adjust arrival time"
                                  >
                                    <Clock className="w-3 h-3 text-emerald-600 dark:text-emerald-400 shrink-0" />
                                    <span>{checkInTime || '04:00 PM'}</span>
                                    <Edit3 className="w-2.5 h-2.5 opacity-40 group-hover:opacity-100 text-emerald-700 dark:text-emerald-300 transition-opacity ml-0.5" />
                                  </button>
                                </PopoverTrigger>
                                <PopoverContent
                                  align="start"
                                  className="w-56 p-3 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xl bg-white dark:bg-slate-900 z-50"
                                >
                                  <div className="space-y-2.5">
                                    <div className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center justify-between">
                                      <span className="flex items-center gap-1.5">
                                        <Clock className="w-3.5 h-3.5 text-emerald-600" />
                                        Arrival Time
                                      </span>
                                      <span className="text-[10px] text-slate-400 font-normal">
                                        {student.name.split(' ')[0]}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                      <Input
                                        value={customTimeInput}
                                        onChange={e => setCustomTimeInput(e.target.value)}
                                        placeholder="e.g. 04:15 PM"
                                        className="h-8 text-xs font-mono"
                                      />
                                      <Button
                                        size="sm"
                                        onClick={() => {
                                          if (customTimeInput.trim()) {
                                            markStudentStatus(student.id, 'present', undefined, customTimeInput.trim());
                                            setEditingTimeStudentId(null);
                                          }
                                        }}
                                        className="h-8 px-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shrink-0"
                                      >
                                        Save
                                      </Button>
                                    </div>
                                    <div className="pt-1.5 border-t border-slate-100 dark:border-slate-800">
                                      <span className="text-[10px] text-slate-400 block mb-1">Quick Select:</span>
                                      <div className="flex flex-wrap gap-1">
                                        {['04:00 PM', '04:05 PM', '04:10 PM', '04:15 PM', '04:30 PM', '05:00 PM'].map(preset => (
                                          <button
                                            key={preset}
                                            type="button"
                                            onClick={() => {
                                              markStudentStatus(student.id, 'present', undefined, preset);
                                              setEditingTimeStudentId(null);
                                            }}
                                            className="text-[10px] font-mono font-medium px-1.5 py-0.5 rounded bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 dark:bg-slate-800 dark:hover:bg-emerald-950 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
                                          >
                                            {preset}
                                          </button>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                </PopoverContent>
                              </Popover>
                            ) : (
                              <span className="text-slate-400 font-mono text-xs pl-2.5">-</span>
                            )}
                          </td>

                          {/* 1-Click Action Buttons */}
                          <td className="py-3 px-3.5 pr-5 text-right whitespace-nowrap align-middle">
                            <div className="inline-flex items-center gap-1.5 justify-end">
                              {/* Present Button */}
                              <button
                                type="button"
                                onClick={() => {
                                  const existingTime = checkInTime || getCurrentTimeFormatted();
                                  markStudentStatus(student.id, 'present', undefined, existingTime);
                                }}
                                className={`h-7 px-2.5 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                                  isPresent
                                    ? 'bg-emerald-600 text-white shadow-xs'
                                    : 'bg-emerald-50/70 hover:bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/60 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800'
                                }`}
                                title="Mark Present (Records arrival time)"
                              >
                                <Check className="w-3 h-3" />
                                <span>Present</span>
                              </button>

                              {/* Absent Button */}
                              <button
                                type="button"
                                onClick={() => markStudentStatus(student.id, 'absent', 'Unexcused Absence')}
                                className={`h-7 px-2.5 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                                  isAbsent
                                    ? 'bg-rose-600 text-white shadow-xs'
                                    : 'bg-rose-50/70 hover:bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:hover:bg-rose-900/60 dark:text-rose-300 border border-rose-200/80 dark:border-rose-800'
                                }`}
                                title="Mark Absent"
                              >
                                <X className="w-3 h-3" />
                                <span>Absent</span>
                              </button>

                              {/* Leave Button */}
                              <button
                                type="button"
                                onClick={() => markStudentStatus(student.id, 'leave', 'Informed Leave')}
                                className={`h-7 px-2.5 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                                  isLeave
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
    </div>
  );
}