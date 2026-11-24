'use client';

import React, { useState, useMemo } from 'react';
import { useAttendance } from '@/context/attendance-context';
import {
  BookOpen,
  Plus,
  Edit2,
  Archive,
  RotateCcw,
  Trash2,
  Search,
  Building2,
  Globe,
  ChevronDown,
  Check,
  Clock,
  Users,
  Layers,
  CheckCircle2,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
  DialogFooter,
} from '@/components/ui/dialog';
import { TSubject } from '@/lib/attendance-store';
import { SmartDeleteDialog } from '@/components/attendance/smart-delete-dialog';
import { AttendanceMonthPicker } from '@/components/attendance/attendance-month-picker';

const IDL_BRANCHES = [
  { id: 'all', name: 'All Branches' },
  { id: 'budh-vihar', name: 'Budh Vihar' },
  { id: 'krishan-vihar', name: 'Krishan Vihar' },
  { id: 'mangolpuri', name: 'Mangol Puri' },
  { id: 'mukherjee-nagar', name: 'Mukherjee Nagar' },
];

type DayPattern = 'MWF' | 'TTS' | 'Mon-Sat' | 'Sunday';

const DAY_PATTERNS: Array<{ id: DayPattern; label: string; sub: string }> = [
  { id: 'MWF', label: 'MWF', sub: 'Mon · Wed · Fri' },
  { id: 'TTS', label: 'TTS', sub: 'Tue · Thu · Sat' },
  { id: 'Mon-Sat', label: 'Mon–Sat', sub: '6 Days' },
  { id: 'Sunday', label: 'Sunday', sub: 'Special' },
];

function formatClassLabel(name?: string): string {
  if (!name) return 'Class';
  return name.startsWith('Class') ? name : `Class ${name}`;
}

function splitTime12h(raw?: string, fallbackPeriod: 'AM' | 'PM' = 'PM'): { time: string; period: 'AM' | 'PM' } {
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
}

function combineTime12h(timeStr: string, period: 'AM' | 'PM'): string {
  const clean = timeStr.replace(/\s*(AM|PM)\s*$/i, '').trim();
  if (!clean) return '';
  const onlyHour = clean.match(/^(\d{1,2})$/);
  if (onlyHour) return `${onlyHour[1].padStart(2, '0')}:00 ${period}`;
  const hm = clean.match(/^(\d{1,2}):(\d{1,2})$/);
  if (hm) return `${hm[1].padStart(2, '0')}:${hm[2].padStart(2, '0')} ${period}`;
  return `${clean} ${period}`;
}

function parseTimeToMinutes(timeStr?: string): number | null {
  if (!timeStr) return null;
  const match = timeStr.trim().match(/^(\d{1,2}):(\d{2})(?:\s*(AM|PM))?$/i);
  if (!match) return null;
  let hh = parseInt(match[1], 10);
  const mm = parseInt(match[2], 10);
  const meridiem = match[3]?.toUpperCase();
  if (Number.isNaN(hh) || Number.isNaN(mm) || mm < 0 || mm > 59) return null;
  if (meridiem) {
    if (hh < 1 || hh > 12) return null;
    if (meridiem === 'AM') hh = hh === 12 ? 0 : hh;
    else hh = hh === 12 ? 12 : hh + 12;
  } else if (hh < 0 || hh > 23) {
    return null;
  }
  return hh * 60 + mm;
}

function calcDurationLabel(start?: string, end?: string): string | null {
  const s = parseTimeToMinutes(start);
  const e = parseTimeToMinutes(end);
  if (s === null || e === null) return null;
  let diff = e - s;
  if (diff <= 0) diff += 24 * 60;
  if (diff <= 0 || diff > 12 * 60) return null;
  const h = Math.floor(diff / 60);
  const m = diff % 60;
  if (h > 0 && m > 0) return `${h}h ${m}m`;
  if (h > 0) return `${h}h`;
  return `${m}m`;
}

function TimeInput12h({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (nextVal: string) => void;
}) {
  const { time, period } = splitTime12h(value, 'PM');

  const handleTimeChange = (raw: string) => {
    const cleaned = raw.replace(/[^0-9:]/g, '').slice(0, 5);
    if (!cleaned) {
      onChange('');
      return;
    }
    onChange(`${cleaned} ${period}`);
  };

  const handleBlur = () => {
    if (!time) return;
    onChange(combineTime12h(time, period));
  };

  const handlePeriod = (nextPeriod: 'AM' | 'PM') => {
    onChange(combineTime12h(time || '04:00', nextPeriod));
  };

  return (
    <div className="space-y-1">
      <Label className="text-[10.5px] font-semibold uppercase tracking-wider text-slate-400">
        {label}
      </Label>
      <div className="flex items-center gap-1.5">
        <Input
          type="text"
          inputMode="numeric"
          placeholder="04:00"
          value={time}
          onChange={e => handleTimeChange(e.target.value)}
          onBlur={handleBlur}
          className="h-8 flex-1 min-w-0 font-mono text-xs tabular-nums px-2.5 rounded-lg border-slate-200 dark:border-slate-700"
        />
        <div className="inline-flex items-center p-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 shrink-0">
          {(['AM', 'PM'] as const).map(p => (
            <button
              key={p}
              type="button"
              onClick={() => handlePeriod(p)}
              className={`h-7 px-2 rounded-md text-[11px] font-bold transition-colors cursor-pointer ${
                period === p
                  ? 'bg-[#2864E8] text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function SubjectsPage() {
  const {
    subjects,
    classes,
    batches,
    teachers,
    selectedBranch,
    setSelectedBranch,
    isBranchLocked,
    currentRole,
    isDemoData,
    getDependencySummary,
    addSubject,
    updateSubject,
    archiveSubject,
    restoreSubject,
    forceDeleteSubject,
  } = useAttendance();

  const [isBranchPickerOpen, setIsBranchPickerOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'archived'>('all');
  const [classFilter, setClassFilter] = useState('all');
  const [batchFilter, setBatchFilter] = useState('all');
  const [dayFilter, setDayFilter] = useState<'all' | DayPattern>('all');

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<TSubject | null>(null);
  const [deleteConfirmItem, setDeleteConfirmItem] = useState<TSubject | null>(null);

  // Form states
  const [formClassName, setFormClassName] = useState('');
  const [formBatchId, setFormBatchId] = useState('');
  const [formName, setFormName] = useState('');
  const [formTeacher, setFormTeacher] = useState('');
  const [formDays, setFormDays] = useState<DayPattern>('MWF');
  const [formStartTime, setFormStartTime] = useState('04:00 PM');
  const [formEndTime, setFormEndTime] = useState('05:00 PM');

  const activeClasses = useMemo(() => {
    if (selectedBranch === 'all') return classes.filter(c => c.status === 'active');
    return classes.filter(c => c.status === 'active' && (!c.branchId || c.branchId === selectedBranch));
  }, [classes, selectedBranch]);

  const filterBatches = useMemo(() => {
    return batches.filter(b => {
      if (selectedBranch !== 'all' && b.branchId && b.branchId !== selectedBranch) return false;
      if (classFilter !== 'all' && b.className !== classFilter) return false;
      return true;
    });
  }, [batches, selectedBranch, classFilter]);

  const formClassBatches = useMemo(() => {
    if (!formClassName) return batches;
    return batches.filter(b => b.className === formClassName);
  }, [batches, formClassName]);

  const filteredSubjects = useMemo(() => {
    return subjects.filter(s => {
      if (selectedBranch !== 'all' && s.branchId && s.branchId !== selectedBranch) return false;
      if (statusFilter !== 'all' && s.status !== statusFilter) return false;
      if (classFilter !== 'all') {
        const matchesClass =
          s.className === classFilter ||
          s.classes.some(c => c.toLowerCase().includes(classFilter.toLowerCase()));
        if (!matchesClass) return false;
      }
      if (batchFilter !== 'all') {
        if (s.batchName !== batchFilter && s.batchId !== batchFilter) return false;
      }
      if (dayFilter !== 'all' && (s.scheduleDays || 'MWF') !== dayFilter) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        const match =
          s.name.toLowerCase().includes(q) ||
          (s.className || '').toLowerCase().includes(q) ||
          (s.batchName || '').toLowerCase().includes(q) ||
          s.teachers.some(t => t.toLowerCase().includes(q));
        if (!match) return false;
      }
      return true;
    });
  }, [subjects, selectedBranch, statusFilter, classFilter, batchFilter, dayFilter, search]);

  const kpiStats = useMemo(() => {
    const active = subjects.filter(s => s.status === 'active');
    const archived = subjects.filter(s => s.status === 'archived');
    const uniqueTeachers = new Set(active.flatMap(s => s.teachers).filter(Boolean)).size;
    return {
      total: subjects.length,
      activeCount: active.length,
      teachersCount: uniqueTeachers,
      archivedCount: archived.length,
    };
  }, [subjects]);

  const openCreateModal = () => {
    setEditingSubject(null);
    const defaultClass = activeClasses[0]?.name || classes[0]?.name || '9th';
    const matchingBatch = batches.find(b => b.className === defaultClass) || batches[0];
    setFormClassName(defaultClass);
    setFormBatchId(matchingBatch?.id || '');
    setFormName('');
    setFormTeacher(teachers[0]?.name || 'Amod Sharma');
    setFormDays('MWF');
    setFormStartTime('04:00 PM');
    setFormEndTime('05:00 PM');
    setIsModalOpen(true);
  };

  const openEditModal = (sub: TSubject) => {
    setEditingSubject(sub);
    const clsName = sub.className || sub.classes[0] || activeClasses[0]?.name || '9th';
    const matchingBatch =
      batches.find(b => b.id === sub.batchId || b.name === sub.batchName) ||
      batches.find(b => b.className === clsName) ||
      batches[0];
    setFormClassName(clsName);
    setFormBatchId(matchingBatch?.id || '');
    setFormName(sub.name);
    setFormTeacher(sub.teachers[0] || teachers[0]?.name || '');
    setFormDays(sub.scheduleDays || 'MWF');
    setFormStartTime(sub.startTime || '04:00 PM');
    setFormEndTime(sub.endTime || '05:00 PM');
    setIsModalOpen(true);
  };

  const handleFormClassChange = (nextClassName: string) => {
    setFormClassName(nextClassName);
    const firstBatch = batches.find(b => b.className === nextClassName);
    setFormBatchId(firstBatch?.id || '');
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    const classObj = classes.find(c => c.name === formClassName);
    const batchObj = batches.find(b => b.id === formBatchId);
    const normalizedStart = formStartTime
      ? combineTime12h(splitTime12h(formStartTime).time, splitTime12h(formStartTime).period)
      : '04:00 PM';
    const normalizedEnd = formEndTime
      ? combineTime12h(splitTime12h(formEndTime).time, splitTime12h(formEndTime).period)
      : '05:00 PM';

    const payload: Omit<TSubject, 'id'> = {
      name: formName.trim(),
      code:
        editingSubject?.code ||
        `${formName.trim().slice(0, 3).toUpperCase()}-${(formClassName || '01').replace(/\D/g, '') || '01'}`,
      classes: formClassName ? [formClassName] : [],
      teachers: formTeacher ? [formTeacher] : [],
      classId: classObj?.id,
      className: formClassName,
      batchId: batchObj?.id,
      batchName: batchObj?.name,
      branchId: batchObj?.branchId || classObj?.branchId || (selectedBranch !== 'all' ? selectedBranch : undefined),
      scheduleDays: formDays,
      startTime: normalizedStart,
      endTime: normalizedEnd,
      status: editingSubject?.status || 'active',
    };

    if (editingSubject) {
      updateSubject(editingSubject.id, payload);
    } else {
      addSubject(payload);
    }

    setIsModalOpen(false);
    setEditingSubject(null);
  };

  const toolbarControlClass =
    'h-7 px-0.5 py-0.5 bg-transparent hover:bg-transparent border-0 rounded-none shadow-none ring-0 outline-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 text-xs sm:text-[13px] font-semibold text-[#172033] dark:text-slate-100 hover:text-[#2864E8] dark:hover:text-blue-400 inline-flex items-center gap-1.5 transition-colors cursor-pointer shrink-0';

  const filterTriggerClass =
    'h-7 !border-0 !border-b-0 !shadow-none !ring-0 !outline-none px-1 text-[11px] font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white focus:!outline-none focus:!ring-0 focus:!ring-offset-0 focus:!shadow-none data-[state=open]:!shadow-none data-[state=open]:!border-b-0 gap-1 cursor-pointer w-auto [&>span]:line-clamp-none [&>svg]:w-3 [&>svg]:h-3 [&>svg]:opacity-60 tracking-wider uppercase';

  return (
    <div className="min-h-[calc(100svh-68px)] flex-1 flex flex-col overflow-x-hidden">
      {/* ------------------------------------------------------------- */}
      {/* TOP TOOLBAR (Exact Attendance Dashboard Edge-to-Edge Style)   */}
      {/* ------------------------------------------------------------- */}
      <section
        aria-label="Subjects toolbar"
        className="w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border-b border-[#E5EAF2] dark:border-slate-800 md:sticky md:top-0 z-40"
      >
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between flex-wrap gap-3 sm:gap-5 min-w-0">
          {/* Left: Branch Selector + Month Picker */}
          <div className="flex items-center justify-start flex-wrap gap-4 sm:gap-6 min-w-0">
            <Popover open={isBranchLocked ? false : isBranchPickerOpen} onOpenChange={(open) => { if (!isBranchLocked) setIsBranchPickerOpen(open); }}>
              <PopoverTrigger asChild>
                <button type="button" aria-label="Select branch" className={isBranchLocked ? `${toolbarControlClass} cursor-default hover:text-[#172033] dark:hover:text-slate-100` : toolbarControlClass}>
                  <Building2 className="w-3.5 h-3.5 text-[#2864E8] dark:text-blue-400 shrink-0" />
                  <span className="whitespace-nowrap">
                    {IDL_BRANCHES.find(b => b.id === selectedBranch)?.name || 'All Branches'}
                  </span>
                  {!isBranchLocked && (
                    <ChevronDown
                      className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 shrink-0 ${
                        isBranchPickerOpen ? 'rotate-180 text-slate-700 dark:text-slate-200' : ''
                      }`}
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
                  {selectedBranch === 'all' && <Check className="w-3.5 h-3.5 shrink-0" />}
                </button>

                <div className="my-1.5 border-t border-slate-100 dark:border-slate-800" />

                <div className="flex flex-col gap-0.5">
                  {IDL_BRANCHES.filter(b => b.id !== 'all').map(branch => {
                    const isSelected = selectedBranch === branch.id;
                    return (
                      <button
                        key={branch.id}
                        type="button"
                        onClick={() => {
                          setSelectedBranch(branch.id);
                          setIsBranchPickerOpen(false);
                        }}
                        className={`h-8 w-full px-2.5 rounded-lg text-xs flex items-center justify-between gap-2 transition-colors cursor-pointer select-none ${
                          isSelected
                            ? 'bg-blue-50/80 dark:bg-blue-950/50 text-[#2864E8] dark:text-blue-400 font-semibold'
                            : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100/80 dark:hover:bg-slate-800/80 font-medium'
                        }`}
                      >
                        <span className="flex items-center gap-2 min-w-0">
                          <Building2
                            className={`w-3.5 h-3.5 shrink-0 ${
                              isSelected ? 'text-[#2864E8] dark:text-blue-400' : 'text-slate-400 dark:text-slate-500'
                            }`}
                          />
                          <span className="truncate">{branch.name}</span>
                        </span>
                        {isSelected && <Check className="w-3.5 h-3.5 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </PopoverContent>
            </Popover>

            <AttendanceMonthPicker />
          </div>

          {/* Right: Add Subject Action */}
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={openCreateModal}
              className="h-7 px-3 rounded-lg bg-[#2864E8] hover:bg-blue-700 text-white text-[11.5px] font-semibold gap-1.5 shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              New Subject
            </Button>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* MAIN CONTAINER                                                */}
      {/* ------------------------------------------------------------- */}
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-5 space-y-5 flex-1">
        {/* 4 Attendance-Dashboard-Style KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <Card className="bg-white dark:bg-slate-900 border border-[#E5EAF2] dark:border-slate-800 rounded-2xl shadow-[0_1px_3px_rgba(15,23,42,0.03)]">
            <CardContent className="p-4">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10.5px] font-bold uppercase tracking-[0.06em] text-slate-400">
                  Total Subjects
                </span>
                <span className="h-7 w-7 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-[#2864E8] dark:text-blue-400 flex items-center justify-center">
                  <BookOpen className="w-3.5 h-3.5" />
                </span>
              </div>
              <div className="mt-2 text-2xl font-bold text-slate-900 dark:text-white tabular-nums tracking-tight">
                {kpiStats.total}
              </div>
              <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                All configured subjects
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-slate-900 border border-[#E5EAF2] dark:border-slate-800 rounded-2xl shadow-[0_1px_3px_rgba(15,23,42,0.03)]">
            <CardContent className="p-4">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10.5px] font-bold uppercase tracking-[0.06em] text-slate-400">
                  Active Subjects
                </span>
                <span className="h-7 w-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </span>
              </div>
              <div className="mt-2 text-2xl font-bold text-emerald-600 dark:text-emerald-400 tabular-nums tracking-tight">
                {kpiStats.activeCount}
              </div>
              <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                Currently running in batches
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-slate-900 border border-[#E5EAF2] dark:border-slate-800 rounded-2xl shadow-[0_1px_3px_rgba(15,23,42,0.03)]">
            <CardContent className="p-4">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10.5px] font-bold uppercase tracking-[0.06em] text-slate-400">
                  Assigned Teachers
                </span>
                <span className="h-7 w-7 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                  <Users className="w-3.5 h-3.5" />
                </span>
              </div>
              <div className="mt-2 text-2xl font-bold text-indigo-600 dark:text-indigo-400 tabular-nums tracking-tight">
                {kpiStats.teachersCount}
              </div>
              <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                Faculty mapped to subjects
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-slate-900 border border-[#E5EAF2] dark:border-slate-800 rounded-2xl shadow-[0_1px_3px_rgba(15,23,42,0.03)]">
            <CardContent className="p-4">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10.5px] font-bold uppercase tracking-[0.06em] text-slate-400">
                  Archived
                </span>
                <span className="h-7 w-7 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                  <Archive className="w-3.5 h-3.5" />
                </span>
              </div>
              <div className="mt-2 text-2xl font-bold text-amber-600 dark:text-amber-400 tabular-nums tracking-tight">
                {kpiStats.archivedCount}
              </div>
              <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                Retained for past records
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Blue-Underlined Status Tabs + Inline Filters */}
        <div className="border-b border-[#E5EAF2] dark:border-slate-800 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-6 overflow-x-auto">
            {[
              { id: 'all', label: `ALL SUBJECTS (${subjects.length})` },
              { id: 'active', label: `ACTIVE (${kpiStats.activeCount})` },
              { id: 'archived', label: `ARCHIVED (${kpiStats.archivedCount})` },
            ].map(tab => {
              const isActive = statusFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setStatusFilter(tab.id as typeof statusFilter)}
                  className={`relative pb-2.5 pt-1 text-[11.5px] font-bold tracking-[0.04em] uppercase transition-colors cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'text-[#2864E8] dark:text-blue-400'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  {tab.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#2864E8] dark:bg-blue-400 rounded-full" />
                  )}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap pb-2">
            <Select
              value={classFilter}
              onValueChange={val => {
                setClassFilter(val);
                setBatchFilter('all');
              }}
            >
              <SelectTrigger className={filterTriggerClass}>
                <SelectValue placeholder="CLASS">
                  {classFilter === 'all' ? 'CLASS' : `CLASS ${classFilter.toUpperCase()}`}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="text-xs font-semibold">All Classes</SelectItem>
                {activeClasses.map(c => (
                  <SelectItem key={c.id} value={c.name} className="text-xs">
                    {formatClassLabel(c.name)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={batchFilter} onValueChange={setBatchFilter}>
              <SelectTrigger className={filterTriggerClass}>
                <SelectValue placeholder="BATCH">
                  {batchFilter === 'all' ? 'BATCH' : batchFilter.toUpperCase()}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="text-xs font-semibold">All Batches</SelectItem>
                {filterBatches.map(b => (
                  <SelectItem key={b.id} value={b.name} className="text-xs">
                    {b.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={dayFilter} onValueChange={v => setDayFilter(v as typeof dayFilter)}>
              <SelectTrigger className={filterTriggerClass}>
                <SelectValue placeholder="DAYS">
                  {dayFilter === 'all' ? 'DAYS' : dayFilter.toUpperCase()}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="text-xs font-semibold">All Days</SelectItem>
                {DAY_PATTERNS.map(d => (
                  <SelectItem key={d.id} value={d.id} className="text-xs">
                    {d.label} ({d.sub})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="relative w-44 sm:w-52">
              <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-slate-400" />
              <Input
                placeholder="Search subject or teacher..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-8 h-7 text-xs rounded-lg bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700"
              />
            </div>
          </div>
        </div>

        {/* Clean Subjects Table Card */}
        <Card className="bg-white dark:bg-slate-900 border border-[#E5EAF2] dark:border-slate-800 rounded-2xl shadow-[0_1px_3px_rgba(15,23,42,0.03)] overflow-hidden">
          <CardHeader className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex flex-row items-center justify-between gap-3 space-y-0">
            <div>
              <CardTitle className="text-[15px] font-bold uppercase tracking-tight text-slate-900 dark:text-white">
                SUBJECTS DIRECTORY ({filteredSubjects.length})
              </CardTitle>
              <CardDescription className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Class, batch, assigned teacher, MWF/TTS schedule days aur timing ek jagah manage karein.
              </CardDescription>
            </div>
          </CardHeader>

          <div className="overflow-x-auto">
            <div className="min-w-[820px]">
              {/* Column Headers */}
              <div className="grid grid-cols-[1.2fr_1.05fr_1.1fr_1.45fr_84px_156px] gap-4 px-5 py-2.5 bg-slate-50/70 dark:bg-slate-900/70 border-b border-slate-100 dark:border-slate-800 text-[10.5px] font-bold uppercase tracking-[0.06em] text-slate-400">
                <div>SUBJECT NAME</div>
                <div>CLASS / BATCH</div>
                <div>ASSIGNED TEACHER</div>
                <div>DAYS &amp; TIMING</div>
                <div>STATUS</div>
                <div className="text-right">ACTIONS</div>
              </div>

              {filteredSubjects.length === 0 ? (
                <div className="py-14 text-center space-y-2.5">
                  <BookOpen className="w-8 h-8 text-slate-300 mx-auto" />
                  <div className="text-sm font-bold text-slate-800 dark:text-slate-200">No Subjects Found</div>
                  <p className="text-xs text-slate-500">Naya subject create karke class, batch, teacher aur time assign karein.</p>
                  <Button
                    size="sm"
                    onClick={openCreateModal}
                    className="h-8 px-3.5 rounded-lg bg-[#2864E8] hover:bg-blue-700 text-white text-xs font-semibold gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    New Subject
                  </Button>
                </div>
              ) : (
                <div className="divide-y divide-slate-100 dark:divide-slate-800/80 bg-white dark:bg-slate-900">
                  {filteredSubjects.map(s => {
                    const isArchived = s.status === 'archived';
                    const displayClass = s.className
                      ? formatClassLabel(s.className)
                      : s.classes.length > 0
                        ? s.classes.map(c => formatClassLabel(c)).join(', ')
                        : '—';
                    const displayBatch = s.batchName || 'All Batches';
                    const displayDays = s.scheduleDays || 'MWF';
                    const startT = s.startTime || '04:00 PM';
                    const endT = s.endTime || '05:00 PM';
                    const dur = calcDurationLabel(startT, endT);

                    return (
                      <div
                        key={s.id}
                        className={`grid grid-cols-[1.2fr_1.05fr_1.1fr_1.45fr_84px_156px] gap-4 px-5 py-3.5 items-center transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-800/30 ${
                          isArchived ? 'opacity-60' : ''
                        }`}
                      >
                        {/* Subject Name */}
                        <div className="min-w-0">
                          <div className="text-[13px] font-bold text-slate-900 dark:text-white truncate">
                            {s.name}
                          </div>
                          {s.code && (
                            <div className="text-[10.5px] font-mono text-slate-400 mt-0.5">
                              {s.code}
                            </div>
                          )}
                        </div>

                        {/* Class / Batch */}
                        <div className="min-w-0">
                          <div className="text-[12.5px] font-semibold text-slate-800 dark:text-slate-100 truncate">
                            {displayClass}
                          </div>
                          <div className="text-[11px] font-semibold text-[#2864E8] dark:text-blue-400 mt-0.5 truncate">
                            {displayBatch}
                          </div>
                        </div>

                        {/* Assigned Teacher */}
                        <div className="min-w-0">
                          <div className="text-[12.5px] font-medium text-slate-700 dark:text-slate-200 truncate">
                            {s.teachers.length > 0 ? s.teachers.join(', ') : 'Unassigned'}
                          </div>
                        </div>

                        {/* Days & Timing */}
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span
                              className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded-full ${
                                displayDays === 'MWF'
                                  ? 'bg-blue-50 text-[#2864E8]'
                                  : displayDays === 'TTS'
                                    ? 'bg-emerald-50 text-emerald-700'
                                    : displayDays === 'Sunday'
                                      ? 'bg-amber-50 text-amber-700'
                                      : 'bg-indigo-50 text-indigo-700'
                              }`}
                            >
                              {displayDays}
                            </span>
                            {dur && (
                              <span className="text-[10px] font-semibold text-slate-400 tabular-nums">
                                {dur}
                              </span>
                            )}
                          </div>
                          <div className="font-mono text-[11.5px] font-semibold text-slate-700 dark:text-slate-200 tabular-nums mt-0.5">
                            {startT} – {endT}
                          </div>
                        </div>

                        {/* Status */}
                        <div>
                          <Badge
                            variant="outline"
                            className={`text-[10px] font-semibold capitalize rounded-full px-2 py-0.5 ${
                              isArchived
                                ? 'bg-amber-50 text-amber-700 border-amber-200'
                                : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            }`}
                          >
                            {s.status}
                          </Badge>
                        </div>

                        {/* Actions: Edit / Archive-Restore / Delete */}
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => openEditModal(s)}
                            title="Edit Subject"
                            className="h-7 px-2 rounded-lg text-[11px] font-semibold text-slate-600 hover:text-[#2864E8] hover:bg-blue-50 dark:text-slate-300 dark:hover:bg-blue-950/40 inline-flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            <Edit2 className="w-3 h-3" />
                            Edit
                          </button>

                          {isArchived ? (
                            <button
                              type="button"
                              onClick={() => restoreSubject(s.id)}
                              title="Restore Subject"
                              className="h-7 w-7 rounded-lg text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 inline-flex items-center justify-center transition-colors cursor-pointer"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => archiveSubject(s.id)}
                              title="Archive Subject"
                              className="h-7 w-7 rounded-lg text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/40 inline-flex items-center justify-center transition-colors cursor-pointer"
                            >
                              <Archive className="w-3.5 h-3.5" />
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => setDeleteConfirmItem(s)}
                            title="Delete Subject"
                            className="h-7 w-7 rounded-lg text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 inline-flex items-center justify-center transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* CREATE / EDIT SUBJECT MODAL                                   */}
      {/* ------------------------------------------------------------- */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-[500px] w-[95vw] rounded-2xl p-5 sm:p-6 bg-white dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 shadow-2xl">
          <DialogHeader className="pb-3 border-b border-slate-100 dark:border-slate-800 text-left">
            <DialogTitle className="text-[16px] font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#2864E8]" />
              <span>{editingSubject ? 'Edit Subject' : 'Create New Subject'}</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Class, Batch, Subject Name, Teacher, Days (MWF / TTS) aur Time set karein.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleFormSubmit} className="space-y-4 pt-1">
            {/* Step 1: Class & Batch */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400">
                  1. Class
                </Label>
                <Select value={formClassName} onValueChange={handleFormClassChange}>
                  <SelectTrigger className="h-9 text-xs font-semibold rounded-xl border-slate-200 dark:border-slate-700">
                    <SelectValue placeholder="Select Class" />
                  </SelectTrigger>
                  <SelectContent>
                    {classes
                      .filter(c => c.status === 'active')
                      .map(c => (
                        <SelectItem key={c.id} value={c.name} className="text-xs">
                          {formatClassLabel(c.name)}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400">
                  2. Batch
                </Label>
                <Select value={formBatchId} onValueChange={setFormBatchId}>
                  <SelectTrigger className="h-9 text-xs font-semibold rounded-xl border-slate-200 dark:border-slate-700">
                    <SelectValue placeholder="Select Batch" />
                  </SelectTrigger>
                  <SelectContent>
                    {formClassBatches.map(b => (
                      <SelectItem key={b.id} value={b.id} className="text-xs">
                        {b.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Step 2: Subject Name & Teacher */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400">
                  3. Subject Name *
                </Label>
                <Input
                  placeholder="e.g. Mathematics, Physics"
                  value={formName}
                  onChange={e => setFormName(e.target.value)}
                  className="h-9 text-xs rounded-xl border-slate-200 dark:border-slate-700"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400">
                  4. Assign Teacher
                </Label>
                <Select value={formTeacher} onValueChange={setFormTeacher}>
                  <SelectTrigger className="h-9 text-xs rounded-xl border-slate-200 dark:border-slate-700">
                    <SelectValue placeholder="Select Teacher" />
                  </SelectTrigger>
                  <SelectContent>
                    {teachers.map(t => (
                      <SelectItem key={t.id} value={t.name} className="text-xs">
                        {t.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Step 3: Schedule Days (MWF / TTS / Mon-Sat / Sunday) */}
            <div className="space-y-1.5">
              <Label className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400">
                5. Subject Days
              </Label>
              <div className="grid grid-cols-4 gap-1.5">
                {DAY_PATTERNS.map(d => {
                  const isActive = formDays === d.id;
                  return (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => setFormDays(d.id)}
                      className={`py-2 px-1.5 rounded-xl border text-center transition-all cursor-pointer ${
                        isActive
                          ? 'bg-blue-50/80 border-[#2864E8] text-[#2864E8] dark:bg-blue-950/50 dark:text-blue-400'
                          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="text-[11.5px] font-bold leading-none">{d.label}</div>
                      <div className="text-[9.5px] opacity-75 mt-1 leading-none">{d.sub}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 4: Start Time & End Time */}
            <div className="space-y-2.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <TimeInput12h label="Start Time" value={formStartTime} onChange={setFormStartTime} />
                <TimeInput12h label="End Time" value={formEndTime} onChange={setFormEndTime} />
              </div>

              <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40 text-xs">
                <span className="text-slate-600 dark:text-slate-300 font-medium inline-flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#2864E8]" />
                  Class Duration
                </span>
                <span className="font-bold text-[#2864E8] dark:text-blue-400 tabular-nums">
                  {calcDurationLabel(formStartTime, formEndTime) || '—'}
                </span>
              </div>
            </div>

            <DialogFooter className="pt-3 border-t border-slate-100 dark:border-slate-800">
              <Button
                variant="outline"
                size="sm"
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="h-8 rounded-lg text-xs"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                type="submit"
                className="h-8 rounded-lg bg-[#2864E8] hover:bg-blue-700 text-white text-xs font-semibold px-4"
              >
                {editingSubject ? 'Update Subject' : 'Create Subject'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Smart Delete Confirmation Dialog */}
      {deleteConfirmItem && (
        <SmartDeleteDialog
          open={!!deleteConfirmItem}
          onClose={() => setDeleteConfirmItem(null)}
          entityType="Subject"
          entityName={deleteConfirmItem.name}
          entityId={deleteConfirmItem.id}
          isDemoMode={isDemoData || (deleteConfirmItem.isDemo ?? false)}
          currentRole={currentRole}
          dependencies={getDependencySummary('subject', deleteConfirmItem.id)}
          onArchive={() => {
            archiveSubject(deleteConfirmItem.id);
            setDeleteConfirmItem(null);
          }}
          onForceDelete={reason => {
            forceDeleteSubject(deleteConfirmItem.id, reason);
            setDeleteConfirmItem(null);
          }}
        />
      )}
    </div>
  );
}
