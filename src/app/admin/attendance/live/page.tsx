'use client';

import React, { useState, useMemo } from 'react';
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

  // Arrival time editing state
  const [editingTimeStudentId, setEditingTimeStudentId] = useState<string | null>(null);
  const [customTimeInput, setCustomTimeInput] = useState('');

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
    <div className="space-y-4 max-w-7xl mx-auto pb-12">
      {/* ------------------------------------------------------------------ */}
      {/* SECTION 1: Top Branch Filter Toolbar (Exact match with Fees/Classes) */}
      {/* ------------------------------------------------------------------ */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl px-4 py-2.5 shadow-[0_1px_3px_rgba(15,23,42,0.04)]">
        <div className="flex items-center justify-between">
          <Popover open={isBranchPickerOpen} onOpenChange={setIsBranchPickerOpen}>
            <PopoverTrigger asChild>
              <button
                type="button"
                className="inline-flex items-center gap-2 text-xs sm:text-[13px] font-semibold text-slate-800 dark:text-slate-100 hover:text-[#2864E8] dark:hover:text-blue-400 transition-colors cursor-pointer select-none focus:outline-none group"
              >
                {selectedBranch === 'all' ? (
                  <Globe className="w-4 h-4 text-[#2864E8] dark:text-blue-400 shrink-0" />
                ) : (
                  <Building2 className="w-4 h-4 text-[#2864E8] dark:text-blue-400 shrink-0" />
                )}
                <span className="truncate max-w-[200px] sm:max-w-none">
                  {selectedBranchObj?.name || 'All Branches'}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-transform duration-150 group-data-[state=open]:rotate-180 shrink-0" />
              </button>
            </PopoverTrigger>
            <PopoverContent
              align="start"
              sideOffset={8}
              className="w-[212px] p-2 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
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
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* SECTION 2: Sub-header with Blue Underline */}
      {/* ------------------------------------------------------------------ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-[#2864E8] pb-2 sm:pb-2.5 pt-2">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 py-1 px-2 text-[12px] sm:text-[12.5px] font-semibold tracking-[0.3px] text-[#2864E8] uppercase">
            <Radio className="w-[15px] h-[15px] shrink-0 text-[#2864E8] animate-pulse" />
            <span>LIVE ATTENDANCE</span>
          </span>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 px-1">
          <button
            type="button"
            onClick={handleMarkAllVisiblePresent}
            disabled={filteredStudents.length === 0}
            className="group flex items-center gap-1.5 text-[11.5px] sm:text-[12px] font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 uppercase tracking-[0.3px] transition-colors bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-2.5 py-1 rounded-md cursor-pointer disabled:opacity-50"
            title="Mark all visible students present"
          >
            <UserCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Mark All Present</span>
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="group flex items-center gap-1.5 text-[11.5px] sm:text-[12px] font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 uppercase tracking-[0.3px] transition-colors bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 px-2.5 py-1 rounded-md cursor-pointer"
            title="Reset Attendance"
          >
            <RotateCcw className="w-3 h-3 text-slate-500 dark:text-slate-400" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* SECTION 3: Dynamic Metric Tiles (4 Balanced Cards) */}
      {/* ------------------------------------------------------------------ */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
        {/* Total Students */}
        <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Total Students
            </span>
            <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {metrics.total}
            </span>
            <span className="text-[10px] text-slate-400 font-medium block mt-0.5">
              Enrolled in filter
            </span>
          </div>
          <Users className="h-7 w-7 text-slate-300 dark:text-slate-700" />
        </div>

        {/* Present */}
        <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs border-l-4 border-l-emerald-500 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider block">
              Present
            </span>
            <span className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400">
              {metrics.present}
            </span>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold block mt-0.5">
              {metrics.presentPercent}% attended
            </span>
          </div>
          <Check className="h-7 w-7 text-emerald-400/50" />
        </div>

        {/* Absent */}
        <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs border-l-4 border-l-rose-500 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-rose-700 dark:text-rose-400 uppercase tracking-wider block">
              Absent
            </span>
            <span className="text-2xl sm:text-3xl font-black text-rose-600 dark:text-rose-400">
              {metrics.absent}
            </span>
            <span className="text-[10px] text-rose-600 dark:text-rose-400 font-medium block mt-0.5">
              Unexcused
            </span>
          </div>
          <X className="h-7 w-7 text-rose-400/50" />
        </div>

        {/* Leave */}
        <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs border-l-4 border-l-amber-500 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider block">
              Leave
            </span>
            <span className="text-2xl sm:text-3xl font-black text-amber-600 dark:text-amber-400">
              {metrics.leave}
            </span>
            <span className="text-[10px] text-amber-600 dark:text-amber-400 font-medium block mt-0.5">
              Informed
            </span>
          </div>
          <PlaneTakeoff className="h-7 w-7 text-amber-400/50" />
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* SECTION 4: Filter Bar (Class, Batch, Status, Search) */}
      {/* ------------------------------------------------------------------ */}
      <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Class Filter */}
          <div className="w-40 sm:w-44">
            <Select
              value={selectedClassId}
              onValueChange={val => {
                setSelectedClassId(val);
                setSelectedBatchId('all');
              }}
            >
              <SelectTrigger className="h-9 text-xs bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 font-medium">
                <SelectValue placeholder="All Classes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Classes</SelectItem>
                {availableClasses.map(c => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.displayName || c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Batch Filter */}
          <div className="w-36 sm:w-40">
            <Select
              value={selectedBatchId}
              onValueChange={setSelectedBatchId}
            >
              <SelectTrigger className="h-9 text-xs bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 font-medium">
                <SelectValue placeholder="All Batches" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Batches</SelectItem>
                {availableBatches.map(b => (
                  <SelectItem key={b.id} value={b.id}>
                    {b.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Status Filter */}
          <div className="w-32 sm:w-36">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-9 text-xs bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 font-medium">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="present">Present</SelectItem>
                <SelectItem value="absent">Absent</SelectItem>
                <SelectItem value="leave">Leave</SelectItem>
                <SelectItem value="not_arrived">Not Marked</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Search bar & Counts */}
        <div className="flex items-center gap-2.5">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search student or roll #..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-9 h-9 text-xs bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
            />
          </div>

          <Badge variant="outline" className="h-9 px-3 text-xs font-semibold shrink-0 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">
            {filteredStudents.length} Students
          </Badge>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* SECTION 5: Student Roster List, Arrival Time & 1-Click Action Buttons */}
      {/* ------------------------------------------------------------------ */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        {filteredStudents.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <GraduationCap className="h-10 w-10 text-slate-300 dark:text-slate-600 mx-auto" />
            <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm">
              No students found
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              No students match your selected filters. Try changing branch, class, or batch filters.
            </p>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setSelectedBranch('all');
                setSelectedClassId('all');
                setSelectedBatchId('all');
                setStatusFilter('all');
                setSearchQuery('');
              }}
              className="text-xs font-semibold h-8"
            >
              Clear All Filters
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50/80 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 font-bold border-b border-slate-200 dark:border-slate-800 text-[11px] uppercase tracking-wider">
                  <th className="py-3 px-4 w-12 text-center">#</th>
                  <th className="py-3 px-4">Student Details</th>
                  <th className="py-3 px-4">Class &amp; Batch</th>
                  <th className="py-3 px-4">Current Status</th>
                  <th className="py-3 px-4">Arrival Time</th>
                  <th className="py-3 px-4 text-right">Mark Attendance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
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
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      {/* Roll Number */}
                      <td className="py-3.5 px-4 text-center font-mono font-bold text-slate-500 dark:text-slate-400">
                        {student.rollNo}
                      </td>

                      {/* Student Info */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-950/50 text-[#2864E8] dark:text-blue-400 font-bold text-xs flex items-center justify-center shrink-0 border border-blue-100 dark:border-blue-900">
                            {student.name.charAt(0)}
                          </div>
                          <div>
                            <Link
                              href={`/admin/attendance/students/${student.id}`}
                              className="font-bold text-slate-900 dark:text-slate-100 hover:text-[#2864E8] dark:hover:text-blue-400 transition-colors text-xs sm:text-[13px]"
                            >
                              {student.name}
                            </Link>
                            <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                              <span>{student.parentName || 'Parent'}</span>
                              <span>•</span>
                              <span>{student.phone || student.parentPhone}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Class & Batch Badge */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-0.5">
                          <span className="font-semibold text-slate-800 dark:text-slate-200 block">
                            {student.className}
                          </span>
                          <span className="text-[11px] text-slate-400 block">
                            Batch {student.batchName}
                          </span>
                        </div>
                      </td>

                      {/* Status Tag */}
                      <td className="py-3.5 px-4">
                        {isPresent && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                            <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400 shrink-0" />
                            Present
                          </span>
                        )}
                        {isAbsent && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                            <X className="w-3 h-3 text-rose-600 dark:text-rose-400 shrink-0" />
                            Absent
                          </span>
                        )}
                        {isLeave && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                            <PlaneTakeoff className="w-3 h-3 text-amber-600 dark:text-amber-400 shrink-0" />
                            Leave
                          </span>
                        )}
                        {isNotMarked && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                            Not Marked
                          </span>
                        )}
                      </td>

                      {/* Arrival / Entry Time Column */}
                      <td className="py-3.5 px-4">
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
                                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50/90 hover:bg-emerald-100/90 dark:bg-emerald-950/50 dark:hover:bg-emerald-900/60 border border-emerald-200/90 dark:border-emerald-800/80 text-emerald-800 dark:text-emerald-300 font-mono text-[11.5px] font-semibold transition-colors cursor-pointer group"
                                title="Click to adjust arrival time"
                              >
                                <Clock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
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
                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center gap-1.5 justify-end">
                          {/* Present Button */}
                          <button
                            type="button"
                            onClick={() => {
                              const existingTime = checkInTime || getCurrentTimeFormatted();
                              markStudentStatus(student.id, 'present', undefined, existingTime);
                            }}
                            className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer flex items-center gap-1.5 ${
                              isPresent
                                ? 'bg-emerald-600 text-white shadow-xs'
                                : 'bg-emerald-50/70 hover:bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/60 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800'
                            }`}
                            title="Mark Present (Records arrival time)"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Present</span>
                          </button>

                          {/* Absent Button */}
                          <button
                            type="button"
                            onClick={() => markStudentStatus(student.id, 'absent', 'Unexcused Absence')}
                            className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer flex items-center gap-1.5 ${
                              isAbsent
                                ? 'bg-rose-600 text-white shadow-xs'
                                : 'bg-rose-50/70 hover:bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:hover:bg-rose-900/60 dark:text-rose-300 border border-rose-200/80 dark:border-rose-800'
                            }`}
                            title="Mark Absent"
                          >
                            <X className="w-3.5 h-3.5" />
                            <span>Absent</span>
                          </button>

                          {/* Leave Button */}
                          <button
                            type="button"
                            onClick={() => markStudentStatus(student.id, 'leave', 'Informed Leave')}
                            className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer flex items-center gap-1.5 ${
                              isLeave
                                ? 'bg-amber-600 text-white shadow-xs'
                                : 'bg-amber-50/70 hover:bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:hover:bg-amber-900/60 dark:text-amber-300 border border-amber-200/80 dark:border-amber-800'
                            }`}
                            title="Mark Leave"
                          >
                            <PlaneTakeoff className="w-3.5 h-3.5" />
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
      </div>
    </div>
  );
}
