'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useAttendance } from '@/context/attendance-context';
import {
  CalendarDays,
  Clock,
  Plus,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Building2,
  Globe,
  Radio,
  Calendar,
  Edit2,
  Trash2,
  Check,
  Layers,
  ListFilter,
  LayoutGrid,
  CalendarRange,
  Sun,
  Sunrise,
  Sunset,
  Copy,
  SlidersHorizontal,
  X,
  BookOpen,
  Users,
  Archive,
  RotateCcw,
  Phone,
  Mail,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { TSubject, TTeacher } from '@/lib/attendance-store';
import { SmartDeleteDialog } from '@/components/attendance/smart-delete-dialog';
import { AttendanceMonthPicker, formatMonthYearLabel } from '@/components/attendance/attendance-month-picker';

const IDL_BRANCHES = [
  { id: 'all', name: 'All Branches' },
  { id: 'budh-vihar', name: 'Budh Vihar' },
  { id: 'krishan-vihar', name: 'Krishan Vihar' },
  { id: 'mangolpuri', name: 'Mangol Puri' },
  { id: 'mukherjee-nagar', name: 'Mukherjee Nagar' },
];

const DAY_NAMES_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MON_TO_SUN_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const TIMETABLE_STORAGE_KEY = 'idl_batch_timetables_v1';

type SubjectTeacherEntry = {
  subject: string;
  teacher: string;
};

type DaySlotConfig = {
  enabled: boolean;
  entryTime: string; // e.g. "04:00 PM"
  exitTime: string;  // e.g. "06:00 PM"
  subject: string;
  teacher: string;
  subjectTeachers?: SubjectTeacherEntry[];
  room?: string;
};

type SundaySlotConfig = {
  enabled: boolean;
  shift: 'morning' | 'evening';
  entryTime: string;
  exitTime: string;
  subject: string;
  teacher: string;
  subjectTeachers?: SubjectTeacherEntry[];
  date?: string; // optional specific Sunday date (YYYY-MM-DD)
  note?: string;
};

function getSlotEntries(slot: { subject: string; teacher: string; subjectTeachers?: SubjectTeacherEntry[] }): SubjectTeacherEntry[] {
  if (slot.subjectTeachers && slot.subjectTeachers.length > 0) {
    return slot.subjectTeachers;
  }
  return [{ subject: slot.subject || '', teacher: slot.teacher || '' }];
}

export type TBatchTimetable = {
  batchId: string;
  classId: string;
  className: string;
  batchName: string;
  mwf: DaySlotConfig;
  tts: DaySlotConfig;
  sunday: SundaySlotConfig;
};

function parseDateLocal(dateStr: string): Date {
  const [y, m, d] = (dateStr || '2026-11-24').split('-').map(Number);
  return new Date(y || 2026, (m || 11) - 1, d || 24);
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

function formatShortDate(dateStr: string): string {
  const d = parseDateLocal(dateStr);
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
}

function getWeekDaysMonToSun(anchorDateStr: string, todayStr: string) {
  const d = parseDateLocal(anchorDateStr);
  const dow = d.getDay();
  const diffToMon = dow === 0 ? -6 : 1 - dow;
  const mon = new Date(d);
  mon.setDate(d.getDate() + diffToMon);
  return Array.from({ length: 7 }, (_, i) => {
    const cur = new Date(mon);
    cur.setDate(mon.getDate() + i);
    const fullDate = toDateStr(cur);
    return {
      name: DAY_NAMES_SHORT[cur.getDay()],
      date: formatShortDate(fullDate),
      dayNum: cur.getDay(),
      fullDate,
      isToday: fullDate === todayStr,
    };
  });
}

function getMonthCalendarCells(ym: string): Array<string | null> {
  const [yStr, mStr] = (ym || '2026-11').split('-');
  const y = parseInt(yStr, 10) || 2026;
  const m = parseInt(mStr, 10) || 11;
  const firstDay = new Date(y, m - 1, 1);
  const daysInMonth = new Date(y, m, 0).getDate();
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

function calcDurationLabel(entryTime?: string, exitTime?: string): string | null {
  const start = parseTimeToMinutes(entryTime);
  const end = parseTimeToMinutes(exitTime);
  if (start === null || end === null) return null;
  let diff = end - start;
  if (diff <= 0) diff += 24 * 60;
  if (diff <= 0 || diff > 12 * 60) return null;
  const h = Math.floor(diff / 60);
  const m = diff % 60;
  if (h > 0 && m > 0) return `${h}h ${m}m`;
  if (h > 0) return `${h}h`;
  return `${m}m`;
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

function formatClassLabel(name?: string): string {
  if (!name) return 'Class';
  return name.startsWith('Class') ? name : `Class ${name}`;
}

// Inline HH:MM + AM/PM time input component
function TimeField12h({
  label,
  value,
  onChange,
  defaultPeriod = 'PM',
}: {
  label: string;
  value: string;
  onChange: (nextVal: string) => void;
  defaultPeriod?: 'AM' | 'PM';
}) {
  const { time, period } = splitTime12h(value, defaultPeriod);

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

// Multi-subject + per-subject teacher list editor
function SubjectTeachersEditor({
  entries,
  onChange,
  subjectOptions,
  teacherOptions,
}: {
  entries: SubjectTeacherEntry[];
  onChange: (next: SubjectTeacherEntry[]) => void;
  subjectOptions: string[];
  teacherOptions: string[];
}) {
  const safeEntries = entries.length > 0 ? entries : [{ subject: subjectOptions[0] || 'Mathematics', teacher: teacherOptions[0] || '' }];

  const handleUpdate = (idx: number, field: keyof SubjectTeacherEntry, val: string) => {
    const next = safeEntries.map((item, i) => (i === idx ? { ...item, [field]: val } : item));
    onChange(next);
  };

  const handleAdd = () => {
    const usedSubjects = new Set(safeEntries.map(e => e.subject));
    const nextSub = subjectOptions.find(s => !usedSubjects.has(s)) || subjectOptions[0] || 'Mathematics';
    onChange([...safeEntries, { subject: nextSub, teacher: teacherOptions[0] || '' }]);
  };

  const handleRemove = (idx: number) => {
    if (safeEntries.length <= 1) return;
    onChange(safeEntries.filter((_, i) => i !== idx));
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="text-[10.5px] font-semibold uppercase tracking-wider text-slate-400">
          Subjects &amp; Teachers
        </Label>
        <button
          type="button"
          onClick={handleAdd}
          className="inline-flex items-center gap-1 h-6 px-2 rounded-md text-[11px] font-semibold text-[#2864E8] bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/50 dark:text-blue-400 transition-colors cursor-pointer"
        >
          <Plus className="w-3 h-3" />
          Add Subject
        </button>
      </div>

      <div className="space-y-2">
        {safeEntries.map((row, idx) => {
          const mergedSubjects = row.subject && !subjectOptions.includes(row.subject)
            ? [row.subject, ...subjectOptions]
            : subjectOptions;
          const mergedTeachers = row.teacher && !teacherOptions.includes(row.teacher)
            ? [row.teacher, ...teacherOptions]
            : teacherOptions;

          return (
            <div key={idx} className="flex items-center gap-2">
              <div className="flex-1 min-w-0">
                <Select value={row.subject} onValueChange={v => handleUpdate(idx, 'subject', v)}>
                  <SelectTrigger className="h-8 text-xs rounded-lg border-slate-200 dark:border-slate-700">
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {mergedSubjects.map(sub => (
                      <SelectItem key={sub} value={sub} className="text-xs">
                        {sub}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex-1 min-w-0">
                <Select value={row.teacher} onValueChange={v => handleUpdate(idx, 'teacher', v)}>
                  <SelectTrigger className="h-8 text-xs rounded-lg border-slate-200 dark:border-slate-700">
                    <SelectValue placeholder="Select teacher" />
                  </SelectTrigger>
                  <SelectContent>
                    {mergedTeachers.map(t => (
                      <SelectItem key={t} value={t} className="text-xs">
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {safeEntries.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemove(idx)}
                  title="Remove subject"
                  className="h-8 w-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer shrink-0"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function ClassSchedulePage() {
  const {
    classes,
    batches,
    teachers,
    subjects,
    holidays,
    selectedBranch,
    setSelectedBranch,
    isBranchLocked,
    selectedMonth,
    todayDateStr,
    currentRole,
    isDemoData,
    getDependencySummary,
    addHoliday,
    deleteHoliday,
    addSubject,
    updateSubject,
    archiveSubject,
    restoreSubject,
    forceDeleteSubject,
    addTeacher,
    updateTeacher,
    archiveTeacher,
    restoreTeacher,
    forceDeleteTeacher,
    showToast,
  } = useAttendance();

  const [isBranchPickerOpen, setIsBranchPickerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'weekly' | 'daily' | 'calendar' | 'list' | 'subjects' | 'teachers'>('weekly');
  const [selectedClass, setSelectedClass] = useState('all');
  const [selectedBatch, setSelectedBatch] = useState('all');
  const [patternFilter, setPatternFilter] = useState<'all' | 'mwf' | 'tts' | 'sunday'>('all');
  const [weekAnchorDate, setWeekAnchorDate] = useState<string>(() => todayDateStr);
  const [dailySelectedDate, setDailySelectedDate] = useState<string>(() => todayDateStr);

  // Embedded Subjects tab state
  const [subStatusFilter, setSubStatusFilter] = useState<'all' | 'active' | 'archived'>('all');
  const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<TSubject | null>(null);
  const [subFormClassName, setSubFormClassName] = useState('');
  const [subFormBatchId, setSubFormBatchId] = useState('');
  const [subFormName, setSubFormName] = useState('');
  const [subFormTeacher, setSubFormTeacher] = useState('');
  const [subFormDays, setSubFormDays] = useState<'MWF' | 'TTS' | 'Mon-Sat' | 'Sunday'>('MWF');
  const [subFormStartTime, setSubFormStartTime] = useState('04:00 PM');
  const [subFormEndTime, setSubFormEndTime] = useState('05:00 PM');
  const [deleteSubjectConfirm, setDeleteSubjectConfirm] = useState<TSubject | null>(null);

  // Embedded Teachers tab state
  const [teacherStatusFilter, setTeacherStatusFilter] = useState<'all' | 'active' | 'archived'>('all');
  const [isTeacherModalOpen, setIsTeacherModalOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<TTeacher | null>(null);
  const [tFormName, setTFormName] = useState('');
  const [tFormSubject, setTFormSubject] = useState('Mathematics');
  const [tFormPhone, setTFormPhone] = useState('');
  const [tFormEmail, setTFormEmail] = useState('');
  const [tFormJoiningDate, setTFormJoiningDate] = useState(() => todayDateStr);
  const [tFormNotes, setTFormNotes] = useState('');
  const [deleteTeacherConfirm, setDeleteTeacherConfirm] = useState<TTeacher | null>(null);

  // Per-batch MWF / TTS / Sunday Timetables
  const [timetables, setTimetables] = useState<Record<string, TBatchTimetable>>(() => {
    if (typeof window !== 'undefined') {
      try {
        const raw = localStorage.getItem(TIMETABLE_STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed && typeof parsed === 'object') return parsed;
        }
      } catch {}
    }
    return {};
  });

  // Auto-seed clean realistic defaults for any batch not yet configured
  useEffect(() => {
    if (batches.length === 0) return;
    setTimetables(prev => {
      let changed = false;
      const next = { ...prev };
      batches.forEach((b, idx) => {
        if (next[b.id]) return;
        changed = true;
        const defaultTeacher = teachers[idx % Math.max(teachers.length, 1)]?.name || 'Amod Sharma';
        const secondTeacher = teachers[(idx + 1) % Math.max(teachers.length, 1)]?.name || defaultTeacher;
        // Varied realistic coaching durations (1h, 2h, 3h) across batches
        const presets = [
          {
            mwf: { enabled: true, entryTime: '04:00 PM', exitTime: '06:00 PM', subject: 'Mathematics', teacher: defaultTeacher, room: b.room || 'Room 101' },
            tts: { enabled: true, entryTime: '04:00 PM', exitTime: '05:00 PM', subject: 'Science', teacher: secondTeacher, room: b.room || 'Room 101' },
            sunday: { enabled: false, shift: 'morning' as const, entryTime: '09:00 AM', exitTime: '11:00 AM', subject: 'Weekly Test / Doubt', teacher: defaultTeacher, note: '' },
          },
          {
            mwf: { enabled: true, entryTime: '05:00 PM', exitTime: '07:00 PM', subject: 'Science & Maths', teacher: defaultTeacher, room: b.room || 'Room 102' },
            tts: { enabled: true, entryTime: '05:30 PM', exitTime: '07:30 PM', subject: 'English & SST', teacher: secondTeacher, room: b.room || 'Room 102' },
            sunday: { enabled: true, shift: 'morning' as const, entryTime: '09:00 AM', exitTime: '11:00 AM', subject: 'Special Doubt Class', teacher: defaultTeacher, note: 'Optional Sunday Batch' },
          },
          {
            mwf: { enabled: true, entryTime: '03:30 PM', exitTime: '06:30 PM', subject: 'Physics & Maths', teacher: defaultTeacher, room: b.room || 'Hall A' },
            tts: { enabled: true, entryTime: '03:30 PM', exitTime: '05:30 PM', subject: 'Chemistry', teacher: secondTeacher, room: b.room || 'Hall A' },
            sunday: { enabled: false, shift: 'evening' as const, entryTime: '04:00 PM', exitTime: '06:00 PM', subject: 'Test Series', teacher: defaultTeacher, note: '' },
          },
        ];
        const p = presets[idx % presets.length];
        next[b.id] = {
          batchId: b.id,
          classId: b.classId,
          className: b.className,
          batchName: b.name,
          mwf: p.mwf,
          tts: p.tts,
          sunday: p.sunday,
        };
      });
      return changed ? next : prev;
    });
  }, [batches, teachers]);

  // Persist to localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (Object.keys(timetables).length === 0) return;
    try {
      localStorage.setItem(TIMETABLE_STORAGE_KEY, JSON.stringify(timetables));
    } catch {}
  }, [timetables]);

  // Editor Modal State (Step-wise: Class -> Batch -> MWF / TTS / Sunday)
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editorClassName, setEditorClassName] = useState<string>('');
  const [editorBatchId, setEditorBatchId] = useState<string>('');
  const [editorSection, setEditorSection] = useState<'mwf' | 'tts' | 'sunday'>('mwf');

  const activeSubjectNames = useMemo(() => {
    const names = subjects.filter(s => s.status !== 'archived').map(s => s.name);
    return names.length > 0 ? names : ['Mathematics', 'Science', 'Physics', 'Chemistry', 'English', 'Social Studies'];
  }, [subjects]);

  const activeTeacherNames = useMemo(() => {
    const names = teachers.map(t => t.name);
    return names.length > 0 ? names : ['Amod Sharma'];
  }, [teachers]);

  const editorClassBatches = useMemo(() => {
    if (!editorClassName) return batches;
    return batches.filter(b => b.className === editorClassName);
  }, [batches, editorClassName]);
  const [draftMwf, setDraftMwf] = useState<DaySlotConfig>({
    enabled: true,
    entryTime: '04:00 PM',
    exitTime: '06:00 PM',
    subject: 'Mathematics',
    teacher: 'Amod Sharma',
    room: 'Room 101',
  });
  const [draftTts, setDraftTts] = useState<DaySlotConfig>({
    enabled: true,
    entryTime: '04:00 PM',
    exitTime: '06:00 PM',
    subject: 'Science',
    teacher: 'Amod Sharma',
    room: 'Room 101',
  });
  const [draftSunday, setDraftSunday] = useState<SundaySlotConfig>({
    enabled: false,
    shift: 'morning',
    entryTime: '09:00 AM',
    exitTime: '11:00 AM',
    subject: 'Special Doubt / Test',
    teacher: 'Amod Sharma',
    date: '',
    note: '',
  });

  // Holiday Modal State
  const [isHolidayOpen, setIsHolidayOpen] = useState(false);
  const [holidayDate, setHolidayDate] = useState(() => todayDateStr);
  const [holidayTitle, setHolidayTitle] = useState('');
  const [holidayReason, setHolidayReason] = useState('');

  // Branch-filtered classes & batches
  const branchClasses = useMemo(() => {
    if (selectedBranch === 'all') return classes.filter(c => c.status === 'active');
    return classes.filter(c => c.status === 'active' && (!c.branchId || c.branchId === selectedBranch));
  }, [classes, selectedBranch]);

  const branchBatches = useMemo(() => {
    return batches.filter(b => {
      if (selectedBranch !== 'all' && b.branchId && b.branchId !== selectedBranch) return false;
      if (selectedClass !== 'all' && b.className !== selectedClass) return false;
      return true;
    });
  }, [batches, selectedBranch, selectedClass]);

  // Filtered batch timetables list
  const visibleRows = useMemo(() => {
    return branchBatches
      .filter(b => {
        if (selectedBatch !== 'all' && b.name !== selectedBatch && b.id !== selectedBatch) return false;
        const tt = timetables[b.id];
        if (!tt) return true;
        if (patternFilter === 'mwf' && !tt.mwf.enabled) return false;
        if (patternFilter === 'tts' && !tt.tts.enabled) return false;
        if (patternFilter === 'sunday' && !tt.sunday.enabled) return false;
        return true;
      })
      .map(b => {
        const tt: TBatchTimetable = timetables[b.id] || {
          batchId: b.id,
          classId: b.classId,
          className: b.className,
          batchName: b.name,
          mwf: { enabled: false, entryTime: '04:00 PM', exitTime: '06:00 PM', subject: '', teacher: teachers[0]?.name || '', room: b.room || 'Room 101' },
          tts: { enabled: false, entryTime: '04:00 PM', exitTime: '06:00 PM', subject: '', teacher: teachers[0]?.name || '', room: b.room || 'Room 101' },
          sunday: { enabled: false, shift: 'morning', entryTime: '09:00 AM', exitTime: '11:00 AM', subject: 'Special Class', teacher: teachers[0]?.name || '', note: '' },
        };
        return { batch: b, timetable: tt };
      });
  }, [branchBatches, selectedBatch, patternFilter, timetables, teachers]);

  const weekDays = useMemo(() => getWeekDaysMonToSun(weekAnchorDate, todayDateStr), [weekAnchorDate, todayDateStr]);
  const monthCells = useMemo(() => getMonthCalendarCells(selectedMonth), [selectedMonth]);
  const activeHolidays = useMemo(() => holidays.filter(h => h.status !== 'archived'), [holidays]);

  // KPI metrics
  const kpiStats = useMemo(() => {
    const totalBatches = visibleRows.length;
    const mwfCount = visibleRows.filter(r => r.timetable.mwf.enabled).length;
    const ttsCount = visibleRows.filter(r => r.timetable.tts.enabled).length;
    const sundayActiveCount = visibleRows.filter(r => r.timetable.sunday.enabled).length;
    return {
      totalBatches,
      mwfCount,
      ttsCount,
      sundayActiveCount,
      holidaysCount: activeHolidays.length,
    };
  }, [visibleRows, activeHolidays]);

  const loadBatchIntoEditor = (batchId: string) => {
    setEditorBatchId(batchId);
    const batchObj = batches.find(b => b.id === batchId);
    if (batchObj?.className) {
      setEditorClassName(batchObj.className);
    }
    const existing = timetables[batchId];
    if (existing) {
      setDraftMwf({
        ...existing.mwf,
        subjectTeachers: getSlotEntries(existing.mwf),
      });
      setDraftTts({
        ...existing.tts,
        subjectTeachers: getSlotEntries(existing.tts),
      });
      setDraftSunday({
        ...existing.sunday,
        subjectTeachers: getSlotEntries(existing.sunday),
      });
    } else {
      const defTeacher = activeTeacherNames[0] || 'Amod Sharma';
      const defSubject = activeSubjectNames[0] || 'Mathematics';
      const secondSubject = activeSubjectNames[1] || 'Science';
      setDraftMwf({
        enabled: true,
        entryTime: '04:00 PM',
        exitTime: '06:00 PM',
        subject: defSubject,
        teacher: defTeacher,
        subjectTeachers: [{ subject: defSubject, teacher: defTeacher }],
        room: batchObj?.room || 'Room 101',
      });
      setDraftTts({
        enabled: true,
        entryTime: '04:00 PM',
        exitTime: '06:00 PM',
        subject: secondSubject,
        teacher: defTeacher,
        subjectTeachers: [{ subject: secondSubject, teacher: defTeacher }],
        room: batchObj?.room || 'Room 101',
      });
      setDraftSunday({
        enabled: false,
        shift: 'morning',
        entryTime: '09:00 AM',
        exitTime: '11:00 AM',
        subject: defSubject,
        teacher: defTeacher,
        subjectTeachers: [{ subject: defSubject, teacher: defTeacher }],
        date: '',
        note: '',
      });
    }
  };

  const handleEditorClassChange = (nextClassName: string) => {
    setEditorClassName(nextClassName);
    const matchingBatch = batches.find(b => b.className === nextClassName);
    if (matchingBatch) {
      loadBatchIntoEditor(matchingBatch.id);
    } else {
      setEditorBatchId('');
    }
  };

  const openEditor = (batchId?: string, focusTab: 'mwf' | 'tts' | 'sunday' = 'mwf') => {
    const targetId = batchId || branchBatches[0]?.id || batches[0]?.id || '';
    if (targetId) loadBatchIntoEditor(targetId);
    setEditorSection(focusTab);
    setIsEditorOpen(true);
  };

  const handleSaveTimetable = () => {
    const batchObj = batches.find(b => b.id === editorBatchId);
    if (!batchObj) return;

    const mwfEntries = getSlotEntries(draftMwf).filter(e => e.subject.trim() || e.teacher.trim());
    const ttsEntries = getSlotEntries(draftTts).filter(e => e.subject.trim() || e.teacher.trim());
    const sunEntries = getSlotEntries(draftSunday).filter(e => e.subject.trim() || e.teacher.trim());

    const normalizedMwf: DaySlotConfig = {
      ...draftMwf,
      entryTime: draftMwf.entryTime ? combineTime12h(splitTime12h(draftMwf.entryTime).time, splitTime12h(draftMwf.entryTime).period) : '',
      exitTime: draftMwf.exitTime ? combineTime12h(splitTime12h(draftMwf.exitTime).time, splitTime12h(draftMwf.exitTime).period) : '',
      subjectTeachers: mwfEntries,
      subject: mwfEntries.map(e => e.subject).filter(Boolean).join(', '),
      teacher: mwfEntries.map(e => e.teacher).filter(Boolean).join(', '),
    };
    const normalizedTts: DaySlotConfig = {
      ...draftTts,
      entryTime: draftTts.entryTime ? combineTime12h(splitTime12h(draftTts.entryTime).time, splitTime12h(draftTts.entryTime).period) : '',
      exitTime: draftTts.exitTime ? combineTime12h(splitTime12h(draftTts.exitTime).time, splitTime12h(draftTts.exitTime).period) : '',
      subjectTeachers: ttsEntries,
      subject: ttsEntries.map(e => e.subject).filter(Boolean).join(', '),
      teacher: ttsEntries.map(e => e.teacher).filter(Boolean).join(', '),
    };
    const normalizedSun: SundaySlotConfig = {
      ...draftSunday,
      entryTime: draftSunday.entryTime ? combineTime12h(splitTime12h(draftSunday.entryTime, draftSunday.shift === 'morning' ? 'AM' : 'PM').time, splitTime12h(draftSunday.entryTime, draftSunday.shift === 'morning' ? 'AM' : 'PM').period) : '',
      exitTime: draftSunday.exitTime ? combineTime12h(splitTime12h(draftSunday.exitTime, draftSunday.shift === 'morning' ? 'AM' : 'PM').time, splitTime12h(draftSunday.exitTime, draftSunday.shift === 'morning' ? 'AM' : 'PM').period) : '',
      subjectTeachers: sunEntries,
      subject: sunEntries.map(e => e.subject).filter(Boolean).join(', '),
      teacher: sunEntries.map(e => e.teacher).filter(Boolean).join(', '),
    };

    setTimetables(prev => ({
      ...prev,
      [batchObj.id]: {
        batchId: batchObj.id,
        classId: batchObj.classId,
        className: batchObj.className,
        batchName: batchObj.name,
        mwf: normalizedMwf,
        tts: normalizedTts,
        sunday: normalizedSun,
      },
    }));

    showToast(`Timetable saved for ${formatClassLabel(batchObj.className)} · ${batchObj.name}.`, 'success');
    setIsEditorOpen(false);
  };

  // Embedded Subjects helpers
  const subFormClassBatches = useMemo(() => {
    if (!subFormClassName) return batches;
    return batches.filter(b => b.className === subFormClassName);
  }, [batches, subFormClassName]);

  const filteredSubjectsList = useMemo(() => {
    return subjects.filter(s => {
      if (selectedBranch !== 'all' && s.branchId && s.branchId !== selectedBranch) return false;
      if (subStatusFilter !== 'all' && s.status !== subStatusFilter) return false;
      if (selectedClass !== 'all') {
        const matchCls =
          s.className === selectedClass ||
          s.classes.some(c => c.toLowerCase().includes(selectedClass.toLowerCase()));
        if (!matchCls) return false;
      }
      if (selectedBatch !== 'all' && s.batchName && s.batchName !== selectedBatch && s.batchId !== selectedBatch) return false;
      return true;
    });
  }, [subjects, selectedBranch, subStatusFilter, selectedClass, selectedBatch]);

  const openCreateSubjectModal = () => {
    setEditingSubject(null);
    const defaultClass = branchClasses[0]?.name || classes[0]?.name || '9th';
    const matchingBatch = batches.find(b => b.className === defaultClass) || batches[0];
    setSubFormClassName(defaultClass);
    setSubFormBatchId(matchingBatch?.id || '');
    setSubFormName('');
    setSubFormTeacher(teachers[0]?.name || 'Amod Sharma');
    setSubFormDays('MWF');
    setSubFormStartTime('04:00 PM');
    setSubFormEndTime('05:00 PM');
    setIsSubjectModalOpen(true);
  };

  const openEditSubjectModal = (sub: TSubject) => {
    setEditingSubject(sub);
    const clsName = sub.className || sub.classes[0] || branchClasses[0]?.name || '9th';
    const matchingBatch =
      batches.find(b => b.id === sub.batchId || b.name === sub.batchName) ||
      batches.find(b => b.className === clsName) ||
      batches[0];
    setSubFormClassName(clsName);
    setSubFormBatchId(matchingBatch?.id || '');
    setSubFormName(sub.name);
    setSubFormTeacher(sub.teachers[0] || teachers[0]?.name || '');
    setSubFormDays(sub.scheduleDays || 'MWF');
    setSubFormStartTime(sub.startTime || '04:00 PM');
    setSubFormEndTime(sub.endTime || '05:00 PM');
    setIsSubjectModalOpen(true);
  };

  const handleSubjectFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subFormName.trim()) return;
    const classObj = classes.find(c => c.name === subFormClassName);
    const batchObj = batches.find(b => b.id === subFormBatchId);
    const normStart = subFormStartTime
      ? combineTime12h(splitTime12h(subFormStartTime).time, splitTime12h(subFormStartTime).period)
      : '04:00 PM';
    const normEnd = subFormEndTime
      ? combineTime12h(splitTime12h(subFormEndTime).time, splitTime12h(subFormEndTime).period)
      : '05:00 PM';

    const payload: Omit<TSubject, 'id'> = {
      name: subFormName.trim(),
      code:
        editingSubject?.code ||
        `${subFormName.trim().slice(0, 3).toUpperCase()}-${(subFormClassName || '01').replace(/\D/g, '') || '01'}`,
      classes: subFormClassName ? [subFormClassName] : [],
      teachers: subFormTeacher ? [subFormTeacher] : [],
      classId: classObj?.id,
      className: subFormClassName,
      batchId: batchObj?.id,
      batchName: batchObj?.name,
      branchId: batchObj?.branchId || classObj?.branchId || (selectedBranch !== 'all' ? selectedBranch : undefined),
      scheduleDays: subFormDays,
      startTime: normStart,
      endTime: normEnd,
      status: editingSubject?.status || 'active',
    };

    if (editingSubject) {
      updateSubject(editingSubject.id, payload);
    } else {
      addSubject(payload);
    }
    setIsSubjectModalOpen(false);
    setEditingSubject(null);
  };

  // Embedded Teachers helpers
  const filteredTeachersList = useMemo(() => {
    return teachers.filter(t => {
      if (teacherStatusFilter !== 'all' && t.status !== teacherStatusFilter) return false;
      return true;
    });
  }, [teachers, teacherStatusFilter]);

  const openCreateTeacherModal = () => {
    setEditingTeacher(null);
    setTFormName('');
    setTFormSubject(activeSubjectNames[0] || 'Mathematics');
    setTFormPhone('');
    setTFormEmail('');
    setTFormJoiningDate(todayDateStr);
    setTFormNotes('');
    setIsTeacherModalOpen(true);
  };

  const openEditTeacherModal = (t: TTeacher) => {
    setEditingTeacher(t);
    setTFormName(t.name);
    setTFormSubject(t.subject);
    setTFormPhone(t.phone);
    setTFormEmail(t.email);
    setTFormJoiningDate(t.joiningDate || todayDateStr);
    setTFormNotes(t.notes || '');
    setIsTeacherModalOpen(true);
  };

  const handleTeacherFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tFormName.trim()) return;
    const payload = {
      name: tFormName.trim(),
      subject: tFormSubject.trim() || 'Mathematics',
      phone: tFormPhone.trim() || '+91 98765 00000',
      email: tFormEmail.trim() || `${tFormName.trim().toLowerCase().replace(/\s+/g, '.')}@idleducation.com`,
      joiningDate: tFormJoiningDate || todayDateStr,
      notes: tFormNotes.trim(),
    };
    if (editingTeacher) {
      updateTeacher(editingTeacher.id, payload);
    } else {
      addTeacher({ ...payload, status: 'active' });
    }
    setIsTeacherModalOpen(false);
    setEditingTeacher(null);
  };

  const handleToggleSundayQuick = (batchId: string) => {
    const existing = timetables[batchId];
    if (!existing) {
      openEditor(batchId, 'sunday');
      return;
    }
    const nextEnabled = !existing.sunday.enabled;
    setTimetables(prev => ({
      ...prev,
      [batchId]: {
        ...existing,
        sunday: { ...existing.sunday, enabled: nextEnabled },
      },
    }));
    showToast(
      nextEnabled
        ? `Sunday Special Class enabled for Batch ${existing.batchName}.`
        : `Sunday marked Off for Batch ${existing.batchName}.`,
      'info'
    );
  };

  const handleAddHolidaySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!holidayTitle.trim()) return;
    addHoliday({
      date: holidayDate,
      title: holidayTitle.trim(),
      type: 'Institute Holiday',
      reason: holidayReason.trim(),
    });
    setHolidayTitle('');
    setHolidayReason('');
  };

  // Helper: get classes running on a specific date (based on MWF / TTS / Sunday)
  const getClassesForDate = (dateStr: string) => {
    const holiday = activeHolidays.find(h => h.date === dateStr);
    if (holiday) return { holiday, items: [] as Array<{ batchName: string; className: string; batchId: string; pattern: 'MWF' | 'TTS' | 'Sunday'; entryTime: string; exitTime: string; duration: string | null; subject: string; teacher: string; shift?: 'morning' | 'evening' }> };

    const dow = parseDateLocal(dateStr).getDay(); // 0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat
    const isMwf = dow === 1 || dow === 3 || dow === 5;
    const isTts = dow === 2 || dow === 4 || dow === 6;
    const isSun = dow === 0;

    const items: Array<{ batchName: string; className: string; batchId: string; pattern: 'MWF' | 'TTS' | 'Sunday'; entryTime: string; exitTime: string; duration: string | null; subject: string; teacher: string; shift?: 'morning' | 'evening' }> = [];

    visibleRows.forEach(({ batch, timetable }) => {
      if (isMwf && timetable.mwf.enabled) {
        items.push({
          batchId: batch.id,
          className: batch.className,
          batchName: batch.name,
          pattern: 'MWF',
          entryTime: timetable.mwf.entryTime,
          exitTime: timetable.mwf.exitTime,
          duration: calcDurationLabel(timetable.mwf.entryTime, timetable.mwf.exitTime),
          subject: timetable.mwf.subject,
          teacher: timetable.mwf.teacher,
        });
      } else if (isTts && timetable.tts.enabled) {
        items.push({
          batchId: batch.id,
          className: batch.className,
          batchName: batch.name,
          pattern: 'TTS',
          entryTime: timetable.tts.entryTime,
          exitTime: timetable.tts.exitTime,
          duration: calcDurationLabel(timetable.tts.entryTime, timetable.tts.exitTime),
          subject: timetable.tts.subject,
          teacher: timetable.tts.teacher,
        });
      } else if (isSun && timetable.sunday.enabled && (!timetable.sunday.date || timetable.sunday.date === dateStr)) {
        items.push({
          batchId: batch.id,
          className: batch.className,
          batchName: batch.name,
          pattern: 'Sunday',
          entryTime: timetable.sunday.entryTime,
          exitTime: timetable.sunday.exitTime,
          duration: calcDurationLabel(timetable.sunday.entryTime, timetable.sunday.exitTime),
          subject: timetable.sunday.subject,
          teacher: timetable.sunday.teacher,
          shift: timetable.sunday.shift,
        });
      }
    });

    return { holiday: undefined, items };
  };

  const dailyData = useMemo(() => getClassesForDate(dailySelectedDate), [dailySelectedDate, visibleRows, activeHolidays]);

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
        aria-label="Class schedule toolbar"
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

          {/* Right: Clean Quick Actions */}
          <div className="flex items-center gap-2 flex-wrap">
            <Button
              size="sm"
              onClick={() => openEditor(undefined, 'mwf')}
              className="h-7 px-3 rounded-lg bg-[#2864E8] hover:bg-blue-700 text-white text-[11.5px] font-semibold gap-1.5 shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              Set Batch Timetable
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => openEditor(undefined, 'sunday')}
              className="h-7 px-2.5 rounded-lg border-blue-200/80 dark:border-blue-900/60 bg-blue-50/50 dark:bg-blue-950/20 text-[#2864E8] dark:text-blue-400 hover:bg-blue-100/70 text-[11.5px] font-semibold gap-1 cursor-pointer"
            >
              <Sun className="w-3.5 h-3.5" />
              Sunday Special
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsHolidayOpen(true)}
              className="h-7 px-2.5 rounded-lg border-amber-200/80 dark:border-amber-900/60 bg-amber-50/50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 hover:bg-amber-100/70 text-[11.5px] font-semibold gap-1 cursor-pointer"
            >
              <CalendarDays className="w-3.5 h-3.5" />
              Holidays ({kpiStats.holidaysCount})
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
                  Total Batches
                </span>
                <span className="h-7 w-7 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-[#2864E8] dark:text-blue-400 flex items-center justify-center">
                  <Layers className="w-3.5 h-3.5" />
                </span>
              </div>
              <div className="mt-2 text-2xl font-bold text-slate-900 dark:text-white tabular-nums tracking-tight">
                {kpiStats.totalBatches}
              </div>
              <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                Across {branchClasses.length} active classes
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-slate-900 border border-[#E5EAF2] dark:border-slate-800 rounded-2xl shadow-[0_1px_3px_rgba(15,23,42,0.03)]">
            <CardContent className="p-4">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10.5px] font-bold uppercase tracking-[0.06em] text-slate-400">
                  MWF Batches
                </span>
                <span className="h-7 w-7 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                  <CalendarRange className="w-3.5 h-3.5" />
                </span>
              </div>
              <div className="mt-2 text-2xl font-bold text-indigo-600 dark:text-indigo-400 tabular-nums tracking-tight">
                {kpiStats.mwfCount}
              </div>
              <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                Mon · Wed · Fri active
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-slate-900 border border-[#E5EAF2] dark:border-slate-800 rounded-2xl shadow-[0_1px_3px_rgba(15,23,42,0.03)]">
            <CardContent className="p-4">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10.5px] font-bold uppercase tracking-[0.06em] text-slate-400">
                  TTS Batches
                </span>
                <span className="h-7 w-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <Clock className="w-3.5 h-3.5" />
                </span>
              </div>
              <div className="mt-2 text-2xl font-bold text-emerald-600 dark:text-emerald-400 tabular-nums tracking-tight">
                {kpiStats.ttsCount}
              </div>
              <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                Tue · Thu · Sat active
              </p>
            </CardContent>
          </Card>

          <Card
            onClick={() => openEditor(undefined, 'sunday')}
            className="bg-white dark:bg-slate-900 border border-[#E5EAF2] dark:border-slate-800 rounded-2xl shadow-[0_1px_3px_rgba(15,23,42,0.03)] cursor-pointer hover:border-amber-300/80 transition-colors"
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10.5px] font-bold uppercase tracking-[0.06em] text-slate-400">
                  Sunday Special
                </span>
                <span className="h-7 w-7 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                  <Sun className="w-3.5 h-3.5" />
                </span>
              </div>
              <div className="mt-2 text-2xl font-bold text-amber-600 dark:text-amber-400 tabular-nums tracking-tight">
                {kpiStats.sundayActiveCount}
              </div>
              <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                {kpiStats.sundayActiveCount > 0 ? 'Morning / Evening scheduled' : 'All Sundays Off'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Unified Zero-Gap Tabs + Content Wrapper */}
        <div className="space-y-0">
          {/* Blue-Underlined View Tabs Bar */}
          <div className="border-b border-[#E5EAF2] dark:border-slate-800 flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-5 sm:gap-6 overflow-x-auto">
              {[
                { id: 'weekly', label: 'WEEKLY SCHEDULE', icon: LayoutGrid },
                { id: 'daily', label: 'DAILY VIEW', icon: Clock },
                { id: 'calendar', label: 'CALENDAR VIEW', icon: CalendarDays },
                { id: 'list', label: 'LIST VIEW', icon: ListFilter },
                { id: 'subjects', label: 'SUBJECTS', icon: BookOpen },
                { id: 'teachers', label: 'TEACHERS', icon: Users },
              ].map(tab => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id as typeof activeTab)}
                    className={`relative pb-2.5 pt-1 text-[11.5px] font-bold tracking-[0.04em] uppercase inline-flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
                      isActive
                        ? 'text-[#2864E8] dark:text-blue-400'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#2864E8] dark:bg-blue-400 rounded-full" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Right: Clean Inline Filters */}
            <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap pb-2">
              {activeTab !== 'teachers' && (
                <>
                  <Select
                    value={selectedClass}
                    onValueChange={val => {
                      setSelectedClass(val);
                      setSelectedBatch('all');
                    }}
                  >
                    <SelectTrigger className={filterTriggerClass}>
                      <SelectValue placeholder="CLASS">
                        {selectedClass === 'all' ? 'CLASS' : `CLASS ${selectedClass.toUpperCase()}`}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all" className="text-xs font-semibold">All Classes</SelectItem>
                      {branchClasses.map(c => (
                        <SelectItem key={c.id} value={c.name} className="text-xs">
                          {formatClassLabel(c.name)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={selectedBatch} onValueChange={setSelectedBatch}>
                    <SelectTrigger className={filterTriggerClass}>
                      <SelectValue placeholder="BATCH">
                        {selectedBatch === 'all' ? 'BATCH' : selectedBatch.toUpperCase()}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all" className="text-xs font-semibold">All Batches</SelectItem>
                      {branchBatches.map(b => (
                        <SelectItem key={b.id} value={b.name} className="text-xs">
                          {b.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </>
              )}

              {(activeTab === 'weekly' || activeTab === 'daily' || activeTab === 'calendar' || activeTab === 'list') && (
                <Select value={patternFilter} onValueChange={v => setPatternFilter(v as typeof patternFilter)}>
                  <SelectTrigger className={filterTriggerClass}>
                    <SelectValue placeholder="DAYS">
                      {patternFilter === 'all'
                        ? 'ALL DAYS'
                        : patternFilter === 'mwf'
                          ? 'MWF ONLY'
                          : patternFilter === 'tts'
                            ? 'TTS ONLY'
                            : 'SUNDAY SPECIAL'}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all" className="text-xs font-semibold">All Days</SelectItem>
                    <SelectItem value="mwf" className="text-xs">MWF (Mon · Wed · Fri)</SelectItem>
                    <SelectItem value="tts" className="text-xs">TTS (Tue · Thu · Sat)</SelectItem>
                    <SelectItem value="sunday" className="text-xs">Sunday Special</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>

        {/* ----------------------------------------------------------- */}
        {/* VIEW 1: CLEAN MWF / TTS / SUNDAY BATCH TIMETABLE            */}
        {/* ----------------------------------------------------------- */}
        {activeTab === 'weekly' && (
          <Card className="bg-white dark:bg-slate-900 border border-[#E5EAF2] dark:border-slate-800 rounded-b-2xl rounded-t-none border-t-0 shadow-[0_1px_3px_rgba(15,23,42,0.03)] overflow-hidden">
            <CardHeader className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 space-y-0">
              <div>
                <CardTitle className="text-[15px] font-bold uppercase tracking-tight text-slate-900 dark:text-white">
                  BATCH-WISE WEEKLY TIMETABLE ({visibleRows.length})
                </CardTitle>
                <CardDescription className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Har class aur batch ka alag MWF, TTS &amp; Sunday Special schedule — kisi bhi slot par click karke Entry / Exit time edit karein.
                </CardDescription>
              </div>
              <div className="inline-flex items-center gap-2 text-[11px] text-slate-500">
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-blue-50 text-[#2864E8] font-semibold">
                  MWF
                </span>
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-semibold">
                  TTS
                </span>
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 font-semibold">
                  Sunday
                </span>
              </div>
            </CardHeader>

            <div className="overflow-x-auto">
              <div className="min-w-[780px]">
                {/* Clean Column Header Row */}
                <div className="grid grid-cols-[1.1fr_1.35fr_1.35fr_1.25fr_76px] gap-4 px-5 py-2.5 bg-slate-50/70 dark:bg-slate-900/70 border-b border-slate-100 dark:border-slate-800 text-[10.5px] font-bold uppercase tracking-[0.06em] text-slate-400">
                  <div>CLASS / BATCH</div>
                  <div>MWF (MON · WED · FRI)</div>
                  <div>TTS (TUE · THU · SAT)</div>
                  <div>SUNDAY (SPECIAL / OFF)</div>
                  <div className="text-right">ACTION</div>
                </div>

                {/* Batch Rows */}
                {visibleRows.length === 0 ? (
                  <div className="py-12 text-center text-xs text-slate-400">
                    No batches match the selected filters.
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100 dark:divide-slate-800/80 bg-white dark:bg-slate-900">
                    {visibleRows.map(({ batch, timetable }) => {
                      const mwfDur = calcDurationLabel(timetable.mwf.entryTime, timetable.mwf.exitTime);
                      const ttsDur = calcDurationLabel(timetable.tts.entryTime, timetable.tts.exitTime);
                      const sunDur = calcDurationLabel(timetable.sunday.entryTime, timetable.sunday.exitTime);

                      return (
                        <div
                          key={batch.id}
                          className="grid grid-cols-[1.1fr_1.35fr_1.35fr_1.25fr_76px] gap-4 px-5 py-3.5 items-center hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
                        >
                          {/* Col 1: Class & Batch */}
                          <div className="min-w-0">
                            <div className="text-[13px] font-bold text-slate-900 dark:text-white truncate">
                              {formatClassLabel(batch.className)}
                            </div>
                            <div className="mt-0.5 text-[11.5px] font-semibold text-[#2864E8] dark:text-blue-400 truncate">
                              {batch.name}
                            </div>
                          </div>

                          {/* Col 2: MWF */}
                          <button
                            type="button"
                            onClick={() => openEditor(batch.id, 'mwf')}
                            className="text-left group cursor-pointer rounded-xl px-2.5 py-1.5 -mx-2.5 hover:bg-blue-50/50 dark:hover:bg-blue-950/25 transition-colors"
                          >
                            {timetable.mwf.enabled ? (
                              <div>
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="font-mono text-[12px] font-semibold text-slate-900 dark:text-slate-100 tabular-nums">
                                    {timetable.mwf.entryTime} – {timetable.mwf.exitTime}
                                  </span>
                                  {mwfDur && (
                                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-blue-50 text-[#2864E8] dark:bg-blue-950/50 dark:text-blue-400 tabular-nums">
                                      {mwfDur}
                                    </span>
                                  )}
                                </div>
                                <div className="mt-1 space-y-0.5">
                                  {getSlotEntries(timetable.mwf).map((entry, idx) => (
                                    <div key={idx} className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                                      <span className="font-medium text-slate-700 dark:text-slate-300">{entry.subject || 'Regular Class'}</span>
                                      {entry.teacher ? ` · ${entry.teacher}` : ''}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ) : (
                              <span className="text-xs font-medium text-slate-400 group-hover:text-[#2864E8] transition-colors">
                                Off · + Set MWF
                              </span>
                            )}
                          </button>

                          {/* Col 3: TTS */}
                          <button
                            type="button"
                            onClick={() => openEditor(batch.id, 'tts')}
                            className="text-left group cursor-pointer rounded-xl px-2.5 py-1.5 -mx-2.5 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/25 transition-colors"
                          >
                            {timetable.tts.enabled ? (
                              <div>
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="font-mono text-[12px] font-semibold text-slate-900 dark:text-slate-100 tabular-nums">
                                    {timetable.tts.entryTime} – {timetable.tts.exitTime}
                                  </span>
                                  {ttsDur && (
                                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400 tabular-nums">
                                      {ttsDur}
                                    </span>
                                  )}
                                </div>
                                <div className="mt-1 space-y-0.5">
                                  {getSlotEntries(timetable.tts).map((entry, idx) => (
                                    <div key={idx} className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                                      <span className="font-medium text-slate-700 dark:text-slate-300">{entry.subject || 'Regular Class'}</span>
                                      {entry.teacher ? ` · ${entry.teacher}` : ''}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ) : (
                              <span className="text-xs font-medium text-slate-400 group-hover:text-emerald-600 transition-colors">
                                Off · + Set TTS
                              </span>
                            )}
                          </button>

                          {/* Col 4: Sunday Special / Off */}
                          <button
                            type="button"
                            onClick={() => openEditor(batch.id, 'sunday')}
                            className="text-left group cursor-pointer rounded-xl px-2.5 py-1.5 -mx-2.5 hover:bg-amber-50/50 dark:hover:bg-amber-950/25 transition-colors"
                          >
                            {timetable.sunday.enabled ? (
                              <div>
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <span
                                    className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase px-1.5 py-0.5 rounded-full ${
                                      timetable.sunday.shift === 'morning'
                                        ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400'
                                        : 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-400'
                                    }`}
                                  >
                                    {timetable.sunday.shift === 'morning' ? (
                                      <Sunrise className="w-2.5 h-2.5" />
                                    ) : (
                                      <Sunset className="w-2.5 h-2.5" />
                                    )}
                                    {timetable.sunday.shift}
                                  </span>
                                  {sunDur && (
                                    <span className="text-[10px] font-semibold text-slate-500 tabular-nums">
                                      {sunDur}
                                    </span>
                                  )}
                                </div>
                                <div className="font-mono text-[11.5px] font-semibold text-slate-800 dark:text-slate-200 tabular-nums mt-0.5">
                                  {timetable.sunday.entryTime} – {timetable.sunday.exitTime}
                                </div>
                                <div className="mt-0.5 space-y-0.5">
                                  {getSlotEntries(timetable.sunday).map((entry, idx) => (
                                    <div key={idx} className="text-[10.5px] text-slate-500 truncate">
                                      <span className="font-medium text-slate-700 dark:text-slate-300">{entry.subject}</span>
                                      {entry.teacher ? ` · ${entry.teacher}` : ''}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1.5">
                                <span className="text-xs font-medium text-slate-400 group-hover:text-amber-600 transition-colors">
                                  Sunday Off
                                </span>
                                <span className="text-[10px] text-slate-300 group-hover:text-amber-600 transition-colors">
                                  · + Add
                                </span>
                              </div>
                            )}
                          </button>

                          {/* Col 5: Action */}
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openEditor(batch.id, 'mwf')}
                              className="h-7 px-2.5 rounded-lg border-slate-200 dark:border-slate-700 text-[11px] font-semibold text-slate-700 dark:text-slate-200 hover:border-[#2864E8] hover:text-[#2864E8] gap-1 cursor-pointer"
                            >
                              <Edit2 className="w-3 h-3" />
                              Edit
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </Card>
        )}

        {/* ----------------------------------------------------------- */}
        {/* VIEW 2: DAILY VIEW (Auto-derived from MWF / TTS / Sunday)   */}
        {/* ----------------------------------------------------------- */}
        {activeTab === 'daily' && (
          <Card className="bg-white dark:bg-slate-900 border border-[#E5EAF2] dark:border-slate-800 rounded-b-2xl rounded-t-none border-t-0 shadow-[0_1px_3px_rgba(15,23,42,0.03)] overflow-hidden">
            <CardHeader className="px-5 py-3.5 border-b border-slate-100 dark:border-slate-800 flex flex-row items-center justify-between gap-3 space-y-0">
              <div>
                <CardTitle className="text-sm font-bold uppercase tracking-wide text-slate-900 dark:text-white">
                  Daily Classes — {DAY_NAMES_SHORT[parseDateLocal(dailySelectedDate).getDay()]}, {formatShortDate(dailySelectedDate)}
                </CardTitle>
                <CardDescription className="text-xs text-slate-500 mt-0.5">
                  Automatically shows MWF, TTS, or Sunday Special batches for the selected day.
                </CardDescription>
              </div>
              <div className="inline-flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setDailySelectedDate(addDays(dailySelectedDate, -1))}
                  className="h-7 w-7 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-100 tabular-nums px-2">
                  {formatShortDate(dailySelectedDate)}
                </span>
                <button
                  type="button"
                  onClick={() => setDailySelectedDate(addDays(dailySelectedDate, 1))}
                  className="h-7 w-7 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {dailyData.holiday ? (
                <div className="py-12 text-center space-y-1">
                  <div className="text-sm font-bold text-amber-700">Institute Holiday — {dailyData.holiday.title}</div>
                  <p className="text-xs text-slate-500">{dailyData.holiday.reason || 'No classes scheduled on declared holidays.'}</p>
                </div>
              ) : dailyData.items.length === 0 ? (
                <div className="py-12 text-center text-xs text-slate-400">
                  No batches scheduled for {DAY_NAMES_SHORT[parseDateLocal(dailySelectedDate).getDay()]}, {formatShortDate(dailySelectedDate)}.
                </div>
              ) : (
                <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
                  {dailyData.items.map(item => (
                    <div
                      key={`${item.batchId}-${item.pattern}`}
                      onClick={() => openEditor(item.batchId, item.pattern === 'MWF' ? 'mwf' : item.pattern === 'TTS' ? 'tts' : 'sunday')}
                      className="px-5 py-3.5 flex items-center justify-between gap-4 hover:bg-slate-50/70 dark:hover:bg-slate-800/40 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-4 min-w-0">
                        <div className="min-w-[146px] text-center font-mono bg-slate-50 dark:bg-slate-800/80 border border-slate-200/70 dark:border-slate-700 px-3 py-1.5 rounded-xl shrink-0">
                          <div className="text-[11.5px] font-bold text-slate-800 dark:text-slate-100 tabular-nums">
                            {item.entryTime} – {item.exitTime}
                          </div>
                          {item.duration && (
                            <div className="text-[10px] text-[#2864E8] font-semibold tabular-nums mt-0.5">{item.duration}</div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-[13px] text-slate-900 dark:text-white">
                              {formatClassLabel(item.className)} · {item.batchName}
                            </span>
                            <span
                              className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                                item.pattern === 'MWF'
                                  ? 'bg-blue-50 text-[#2864E8]'
                                  : item.pattern === 'TTS'
                                    ? 'bg-emerald-50 text-emerald-700'
                                    : 'bg-amber-50 text-amber-700'
                              }`}
                            >
                              {item.pattern === 'Sunday' && item.shift ? `Sunday · ${item.shift}` : item.pattern}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                            {item.subject || 'Regular Class'}
                            {item.teacher ? ` · ${item.teacher}` : ''}
                          </p>
                        </div>
                      </div>
                      <Link
                        href="/admin/attendance/live"
                        onClick={e => e.stopPropagation()}
                        className="inline-flex items-center gap-1.5 h-7 px-3 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-[11px] font-semibold shrink-0 transition-colors"
                      >
                        <Radio className="w-3 h-3" />
                        Live Attendance
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* ----------------------------------------------------------- */}
        {/* VIEW 3: MONTHLY CALENDAR VIEW                               */}
        {/* ----------------------------------------------------------- */}
        {activeTab === 'calendar' && (
          <Card className="bg-white dark:bg-slate-900 border border-[#E5EAF2] dark:border-slate-800 rounded-b-2xl rounded-t-none border-t-0 shadow-[0_1px_3px_rgba(15,23,42,0.03)] overflow-hidden">
            <CardHeader className="px-5 py-3.5 border-b border-slate-100 dark:border-slate-800">
              <CardTitle className="text-sm font-bold uppercase tracking-wide text-slate-900 dark:text-white">
                {formatMonthYearLabel(selectedMonth)} — Monthly Calendar
              </CardTitle>
              <CardDescription className="text-xs text-slate-500 mt-0.5">
                Shows active MWF, TTS, Sunday Special batches &amp; holidays for every date.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4">
              <div className="grid grid-cols-7 text-center border-b border-slate-100 dark:border-slate-800 pb-2 mb-1">
                {MON_TO_SUN_LABELS.map(d => (
                  <div key={d} className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400">
                    {d}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7">
                {monthCells.map((d, idx) => {
                  if (!d) {
                    return <div key={`empty-${idx}`} className="h-20 border-b border-slate-100/80 dark:border-slate-800/60" />;
                  }
                  const dt = parseDateLocal(d);
                  const isSun = dt.getDay() === 0;
                  const isToday = d === todayDateStr;
                  const dayInfo = getClassesForDate(d);

                  return (
                    <button
                      key={d}
                      type="button"
                      onClick={() => {
                        setDailySelectedDate(d);
                        setActiveTab('daily');
                      }}
                      className={`h-20 p-2 text-left border-b border-slate-100/80 dark:border-slate-800/60 flex flex-col justify-between transition-colors cursor-pointer ${
                        isToday ? 'bg-blue-50/40 dark:bg-blue-950/20' : 'hover:bg-slate-50/60 dark:hover:bg-slate-800/30'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span
                          className={`text-xs font-semibold tabular-nums ${
                            isToday
                              ? 'px-1.5 py-0.5 rounded-full bg-[#2864E8] text-white text-[10.5px]'
                              : isSun
                                ? 'text-slate-400'
                                : 'text-slate-800 dark:text-slate-200'
                          }`}
                        >
                          {dt.getDate()}
                        </span>
                        {isSun && !dayInfo.holiday && (
                          <span className="text-[9px] font-semibold uppercase text-slate-400">Sun</span>
                        )}
                      </div>

                      {dayInfo.holiday ? (
                        <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded truncate w-full">
                          {dayInfo.holiday.title}
                        </span>
                      ) : dayInfo.items.length > 0 ? (
                        <span className={`text-[10px] font-semibold ${isSun ? 'text-amber-600' : 'text-[#2864E8] dark:text-blue-400'}`}>
                          {dayInfo.items.length} {dayInfo.items.length === 1 ? 'batch' : 'batches'}
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-300 dark:text-slate-700">Off</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* ----------------------------------------------------------- */}
        {/* VIEW 4: COMPACT SUMMARY LIST VIEW                           */}
        {/* ----------------------------------------------------------- */}
        {activeTab === 'list' && (
          <Card className="bg-white dark:bg-slate-900 border border-[#E5EAF2] dark:border-slate-800 rounded-b-2xl rounded-t-none border-t-0 shadow-[0_1px_3px_rgba(15,23,42,0.03)] overflow-hidden">
            <CardHeader className="px-5 py-3.5 border-b border-slate-100 dark:border-slate-800">
              <CardTitle className="text-sm font-bold uppercase tracking-wide text-slate-900 dark:text-white">
                All Batch Schedules ({visibleRows.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {visibleRows.map(({ batch, timetable }) => (
                  <div
                    key={batch.id}
                    onClick={() => openEditor(batch.id, 'mwf')}
                    className="px-5 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/70 dark:hover:bg-slate-800/40 cursor-pointer transition-colors"
                  >
                    <div>
                      <div className="font-bold text-[13px] text-slate-900 dark:text-white">
                        {formatClassLabel(batch.className)} · {batch.name}
                      </div>
                      <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-slate-600 dark:text-slate-400">
                        <span>
                          <strong className="text-[#2864E8]">MWF:</strong>{' '}
                          {timetable.mwf.enabled ? `${timetable.mwf.entryTime} – ${timetable.mwf.exitTime}` : 'Off'}
                        </span>
                        <span className="text-slate-300">•</span>
                        <span>
                          <strong className="text-emerald-600">TTS:</strong>{' '}
                          {timetable.tts.enabled ? `${timetable.tts.entryTime} – ${timetable.tts.exitTime}` : 'Off'}
                        </span>
                        <span className="text-slate-300">•</span>
                        <span>
                          <strong className="text-amber-600">Sunday:</strong>{' '}
                          {timetable.sunday.enabled
                            ? `${timetable.sunday.shift === 'morning' ? 'Morning' : 'Evening'} (${timetable.sunday.entryTime} – ${timetable.sunday.exitTime})`
                            : 'Off'}
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={e => {
                        e.stopPropagation();
                        handleToggleSundayQuick(batch.id);
                      }}
                      className="h-7 px-2.5 rounded-lg text-[11px] font-semibold shrink-0"
                    >
                      {timetable.sunday.enabled ? 'Turn Sunday Off' : '+ Enable Sunday'}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* ----------------------------------------------------------- */}
        {/* VIEW 5: SUBJECTS DIRECTORY (Embedded in Schedule Dashboard) */}
        {/* ----------------------------------------------------------- */}
        {activeTab === 'subjects' && (
          <Card className="bg-white dark:bg-slate-900 border border-[#E5EAF2] dark:border-slate-800 rounded-b-2xl rounded-t-none border-t-0 shadow-[0_1px_3px_rgba(15,23,42,0.03)] overflow-hidden">
            <CardHeader className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 space-y-0">
              <div>
                <CardTitle className="text-[15px] font-bold uppercase tracking-tight text-slate-900 dark:text-white">
                  SUBJECTS DIRECTORY ({filteredSubjectsList.length})
                </CardTitle>
                <CardDescription className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Class, batch, assigned teacher, MWF/TTS days aur timing yahin se manage karein.
                </CardDescription>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <div className="inline-flex items-center p-0.5 rounded-lg bg-slate-100/80 dark:bg-slate-800">
                  {(['all', 'active', 'archived'] as const).map(st => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setSubStatusFilter(st)}
                      className={`h-6 px-2.5 rounded-md text-[11px] font-semibold capitalize transition-colors cursor-pointer ${
                        subStatusFilter === st
                          ? 'bg-white dark:bg-slate-900 text-[#2864E8] shadow-xs'
                          : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
                <Button
                  size="sm"
                  onClick={openCreateSubjectModal}
                  className="h-7 px-3 rounded-lg bg-[#2864E8] hover:bg-blue-700 text-white text-[11.5px] font-semibold gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  New Subject
                </Button>
              </div>
            </CardHeader>

            <div className="overflow-x-auto">
              <div className="min-w-[780px]">
                <div className="grid grid-cols-[1.2fr_1.05fr_1.1fr_1.45fr_82px_148px] gap-4 px-5 py-2.5 bg-slate-50/70 dark:bg-slate-900/70 border-b border-slate-100 dark:border-slate-800 text-[10.5px] font-bold uppercase tracking-[0.06em] text-slate-400">
                  <div>SUBJECT NAME</div>
                  <div>CLASS / BATCH</div>
                  <div>ASSIGNED TEACHER</div>
                  <div>DAYS &amp; TIMING</div>
                  <div>STATUS</div>
                  <div className="text-right">ACTIONS</div>
                </div>

                {filteredSubjectsList.length === 0 ? (
                  <div className="py-12 text-center space-y-2">
                    <div className="text-xs font-semibold text-slate-500">No subjects found for the selected filters.</div>
                    <Button size="sm" onClick={openCreateSubjectModal} className="h-7 px-3 rounded-lg bg-[#2864E8] text-white text-xs font-semibold gap-1">
                      <Plus className="w-3.5 h-3.5" /> New Subject
                    </Button>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100 dark:divide-slate-800/80 bg-white dark:bg-slate-900">
                    {filteredSubjectsList.map(s => {
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
                          className={`grid grid-cols-[1.2fr_1.05fr_1.1fr_1.45fr_82px_148px] gap-4 px-5 py-3.5 items-center hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors ${
                            isArchived ? 'opacity-60' : ''
                          }`}
                        >
                          <div className="min-w-0">
                            <div className="text-[13px] font-bold text-slate-900 dark:text-white truncate">{s.name}</div>
                            {s.code && <div className="text-[10.5px] font-mono text-slate-400 mt-0.5">{s.code}</div>}
                          </div>
                          <div className="min-w-0">
                            <div className="text-[12.5px] font-semibold text-slate-800 dark:text-slate-100 truncate">{displayClass}</div>
                            <div className="text-[11px] font-semibold text-[#2864E8] dark:text-blue-400 mt-0.5 truncate">{displayBatch}</div>
                          </div>
                          <div className="min-w-0 text-[12.5px] font-medium text-slate-700 dark:text-slate-200 truncate">
                            {s.teachers.length > 0 ? s.teachers.join(', ') : 'Unassigned'}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
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
                              {dur && <span className="text-[10px] font-semibold text-slate-400 tabular-nums">{dur}</span>}
                            </div>
                            <div className="font-mono text-[11.5px] font-semibold text-slate-700 dark:text-slate-200 tabular-nums mt-0.5">
                              {startT} – {endT}
                            </div>
                          </div>
                          <div>
                            <Badge
                              variant="outline"
                              className={`text-[10px] font-semibold capitalize rounded-full px-2 py-0.5 ${
                                isArchived ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              }`}
                            >
                              {s.status}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-end gap-1">
                            <button
                              type="button"
                              onClick={() => openEditSubjectModal(s)}
                              className="h-7 px-2 rounded-lg text-[11px] font-semibold text-slate-600 hover:text-[#2864E8] hover:bg-blue-50 inline-flex items-center gap-1 cursor-pointer"
                            >
                              <Edit2 className="w-3 h-3" /> Edit
                            </button>
                            {isArchived ? (
                              <button
                                type="button"
                                onClick={() => restoreSubject(s.id)}
                                title="Restore Subject"
                                className="h-7 w-7 rounded-lg text-emerald-600 hover:bg-emerald-50 inline-flex items-center justify-center cursor-pointer"
                              >
                                <RotateCcw className="w-3.5 h-3.5" />
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => archiveSubject(s.id)}
                                title="Archive Subject"
                                className="h-7 w-7 rounded-lg text-amber-600 hover:bg-amber-50 inline-flex items-center justify-center cursor-pointer"
                              >
                                <Archive className="w-3.5 h-3.5" />
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => setDeleteSubjectConfirm(s)}
                              title="Delete Subject"
                              className="h-7 w-7 rounded-lg text-rose-500 hover:text-rose-600 hover:bg-rose-50 inline-flex items-center justify-center cursor-pointer"
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
        )}

        {/* ----------------------------------------------------------- */}
        {/* VIEW 6: TEACHERS DIRECTORY (Embedded in Schedule Dashboard) */}
        {/* ----------------------------------------------------------- */}
        {activeTab === 'teachers' && (
          <Card className="bg-white dark:bg-slate-900 border border-[#E5EAF2] dark:border-slate-800 rounded-b-2xl rounded-t-none border-t-0 shadow-[0_1px_3px_rgba(15,23,42,0.03)] overflow-hidden">
            <CardHeader className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 space-y-0">
              <div>
                <CardTitle className="text-[15px] font-bold uppercase tracking-tight text-slate-900 dark:text-white">
                  FACULTY &amp; TEACHERS ({filteredTeachersList.length})
                </CardTitle>
                <CardDescription className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Institute teachers, subject specialties aur contact details yahin se manage karein.
                </CardDescription>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <div className="inline-flex items-center p-0.5 rounded-lg bg-slate-100/80 dark:bg-slate-800">
                  {(['all', 'active', 'archived'] as const).map(st => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setTeacherStatusFilter(st)}
                      className={`h-6 px-2.5 rounded-md text-[11px] font-semibold capitalize transition-colors cursor-pointer ${
                        teacherStatusFilter === st
                          ? 'bg-white dark:bg-slate-900 text-[#2864E8] shadow-xs'
                          : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
                <Button
                  size="sm"
                  onClick={openCreateTeacherModal}
                  className="h-7 px-3 rounded-lg bg-[#2864E8] hover:bg-blue-700 text-white text-[11.5px] font-semibold gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Teacher
                </Button>
              </div>
            </CardHeader>

            <div className="overflow-x-auto">
              <div className="min-w-[760px]">
                <div className="grid grid-cols-[1.2fr_1fr_1.4fr_105px_82px_148px] gap-4 px-5 py-2.5 bg-slate-50/70 dark:bg-slate-900/70 border-b border-slate-100 dark:border-slate-800 text-[10.5px] font-bold uppercase tracking-[0.06em] text-slate-400">
                  <div>TEACHER NAME</div>
                  <div>SUBJECT</div>
                  <div>CONTACT</div>
                  <div>JOINED</div>
                  <div>STATUS</div>
                  <div className="text-right">ACTIONS</div>
                </div>

                {filteredTeachersList.length === 0 ? (
                  <div className="py-12 text-center space-y-2">
                    <div className="text-xs font-semibold text-slate-500">No teachers found.</div>
                    <Button size="sm" onClick={openCreateTeacherModal} className="h-7 px-3 rounded-lg bg-[#2864E8] text-white text-xs font-semibold gap-1">
                      <Plus className="w-3.5 h-3.5" /> Add Teacher
                    </Button>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100 dark:divide-slate-800/80 bg-white dark:bg-slate-900">
                    {filteredTeachersList.map(t => {
                      const isArchived = t.status === 'archived';
                      return (
                        <div
                          key={t.id}
                          className={`grid grid-cols-[1.2fr_1fr_1.4fr_105px_82px_148px] gap-4 px-5 py-3.5 items-center hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors ${
                            isArchived ? 'opacity-60' : ''
                          }`}
                        >
                          <div className="min-w-0">
                            <div className="text-[13px] font-bold text-slate-900 dark:text-white truncate">{t.name}</div>
                            {t.notes && <div className="text-[11px] text-slate-400 truncate mt-0.5">{t.notes}</div>}
                          </div>
                          <div className="min-w-0">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-[#2864E8] dark:bg-blue-950/50 dark:text-blue-400">
                              {t.subject}
                            </span>
                          </div>
                          <div className="min-w-0 space-y-0.5 text-[11.5px] text-slate-600 dark:text-slate-300">
                            <div className="flex items-center gap-1.5 font-mono truncate">
                              <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                              <span className="truncate">{t.phone || '—'}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-[11px] text-slate-400 truncate">
                              <Mail className="w-3 h-3 shrink-0" />
                              <span className="truncate">{t.email || '—'}</span>
                            </div>
                          </div>
                          <div className="text-[11.5px] font-mono text-slate-500 tabular-nums">
                            {t.joiningDate || '—'}
                          </div>
                          <div>
                            <Badge
                              variant="outline"
                              className={`text-[10px] font-semibold capitalize rounded-full px-2 py-0.5 ${
                                isArchived ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              }`}
                            >
                              {t.status}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-end gap-1">
                            <button
                              type="button"
                              onClick={() => openEditTeacherModal(t)}
                              className="h-7 px-2 rounded-lg text-[11px] font-semibold text-slate-600 hover:text-[#2864E8] hover:bg-blue-50 inline-flex items-center gap-1 cursor-pointer"
                            >
                              <Edit2 className="w-3 h-3" /> Edit
                            </button>
                            {isArchived ? (
                              <button
                                type="button"
                                onClick={() => restoreTeacher(t.id)}
                                title="Restore Teacher"
                                className="h-7 w-7 rounded-lg text-emerald-600 hover:bg-emerald-50 inline-flex items-center justify-center cursor-pointer"
                              >
                                <RotateCcw className="w-3.5 h-3.5" />
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => archiveTeacher(t.id)}
                                title="Archive Teacher"
                                className="h-7 w-7 rounded-lg text-amber-600 hover:bg-amber-50 inline-flex items-center justify-center cursor-pointer"
                              >
                                <Archive className="w-3.5 h-3.5" />
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => setDeleteTeacherConfirm(t)}
                              title="Delete Teacher"
                              className="h-7 w-7 rounded-lg text-rose-500 hover:text-rose-600 hover:bg-rose-50 inline-flex items-center justify-center cursor-pointer"
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
        )}
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* STEP-WISE BATCH TIMETABLE EDITOR MODAL (MWF / TTS / SUNDAY)   */}
      {/* ------------------------------------------------------------- */}
      <Dialog open={isEditorOpen} onOpenChange={setIsEditorOpen}>
        <DialogContent className="max-w-[540px] w-[95vw] max-h-[90vh] flex flex-col rounded-2xl p-5 sm:p-6 bg-white dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 shadow-2xl overflow-hidden">
          <DialogHeader className="pb-3 border-b border-slate-100 dark:border-slate-800 text-left shrink-0">
            <DialogTitle className="text-[16px] font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-[#2864E8]" />
              <span>Set Batch Weekly Timetable</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Select Class &amp; Batch, then configure MWF, TTS, and optional Sunday Special timings.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-1 overflow-y-auto flex-1 pr-0.5 [scrollbar-width:thin]">
            {/* Step 1: Separate Class & Batch Selectors */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400">
                  1. Class
                </Label>
                <Select
                  value={editorClassName}
                  onValueChange={val => handleEditorClassChange(val)}
                >
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
                <Select
                  value={editorBatchId}
                  onValueChange={val => loadBatchIntoEditor(val)}
                >
                  <SelectTrigger className="h-9 text-xs font-semibold rounded-xl border-slate-200 dark:border-slate-700">
                    <SelectValue placeholder="Select Batch" />
                  </SelectTrigger>
                  <SelectContent>
                    {editorClassBatches.map(b => (
                      <SelectItem key={b.id} value={b.id} className="text-xs">
                        {b.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Step 2: Clean Segmented Tabs for MWF / TTS / Sunday */}
            <div className="inline-flex w-full items-center p-1 rounded-xl bg-slate-100/80 dark:bg-slate-800/80">
              {[
                { id: 'mwf', label: 'MWF (Mon·Wed·Fri)', active: draftMwf.enabled },
                { id: 'tts', label: 'TTS (Tue·Thu·Sat)', active: draftTts.enabled },
                { id: 'sunday', label: 'Sunday Special', active: draftSunday.enabled },
              ].map(sec => (
                <button
                  key={sec.id}
                  type="button"
                  onClick={() => setEditorSection(sec.id as typeof editorSection)}
                  className={`flex-1 h-8 px-2 rounded-lg text-[11.5px] font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    editorSection === sec.id
                      ? 'bg-white dark:bg-slate-900 text-[#2864E8] dark:text-blue-400 shadow-xs'
                      : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      sec.active ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600'
                    }`}
                  />
                  <span className="truncate">{sec.label}</span>
                </button>
              ))}
            </div>

            {/* Panel: MWF */}
            {editorSection === 'mwf' && (
              <div className="space-y-3.5 pt-1">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-slate-800 dark:text-slate-100">Monday, Wednesday &amp; Friday</div>
                    <div className="text-[11px] text-slate-500">Set entry &amp; exit time (1h, 2h, 3h or custom).</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setDraftMwf(prev => ({ ...prev, enabled: !prev.enabled }))}
                    className={`h-7 px-3 rounded-full text-[11px] font-semibold transition-colors cursor-pointer ${
                      draftMwf.enabled
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-slate-100 text-slate-500 border border-slate-200'
                    }`}
                  >
                    {draftMwf.enabled ? 'Active' : 'Off'}
                  </button>
                </div>

                {draftMwf.enabled && (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <TimeField12h
                        label="Entry Time"
                        value={draftMwf.entryTime}
                        onChange={v => setDraftMwf(prev => ({ ...prev, entryTime: v }))}
                      />
                      <TimeField12h
                        label="Exit Time"
                        value={draftMwf.exitTime}
                        onChange={v => setDraftMwf(prev => ({ ...prev, exitTime: v }))}
                      />
                    </div>

                    <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40 text-xs">
                      <span className="text-slate-600 dark:text-slate-300 font-medium">Calculated Class Duration</span>
                      <span className="font-bold text-[#2864E8] dark:text-blue-400 tabular-nums">
                        {calcDurationLabel(draftMwf.entryTime, draftMwf.exitTime) || '—'}
                      </span>
                    </div>

                    <SubjectTeachersEditor
                      entries={getSlotEntries(draftMwf)}
                      onChange={nextEntries =>
                        setDraftMwf(prev => ({
                          ...prev,
                          subjectTeachers: nextEntries,
                          subject: nextEntries[0]?.subject || '',
                          teacher: nextEntries[0]?.teacher || '',
                        }))
                      }
                      subjectOptions={activeSubjectNames}
                      teacherOptions={activeTeacherNames}
                    />
                  </>
                )}
              </div>
            )}

            {/* Panel: TTS */}
            {editorSection === 'tts' && (
              <div className="space-y-3.5 pt-1">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <div className="text-xs font-bold text-slate-800 dark:text-slate-100">Tuesday, Thursday &amp; Saturday</div>
                    <div className="text-[11px] text-slate-500">Different timing or same as MWF.</div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {draftMwf.enabled && (
                      <button
                        type="button"
                        onClick={() =>
                          setDraftTts({
                            ...draftMwf,
                            enabled: true,
                            subjectTeachers: getSlotEntries(draftMwf).map(e => ({ ...e })),
                          })
                        }
                        className="h-7 px-2.5 rounded-full text-[10.5px] font-semibold bg-blue-50 text-[#2864E8] hover:bg-blue-100 transition-colors cursor-pointer inline-flex items-center gap-1"
                      >
                        <Copy className="w-3 h-3" />
                        Same as MWF
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => setDraftTts(prev => ({ ...prev, enabled: !prev.enabled }))}
                      className={`h-7 px-3 rounded-full text-[11px] font-semibold transition-colors cursor-pointer ${
                        draftTts.enabled
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-slate-100 text-slate-500 border border-slate-200'
                      }`}
                    >
                      {draftTts.enabled ? 'Active' : 'Off'}
                    </button>
                  </div>
                </div>

                {draftTts.enabled && (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <TimeField12h
                        label="Entry Time"
                        value={draftTts.entryTime}
                        onChange={v => setDraftTts(prev => ({ ...prev, entryTime: v }))}
                      />
                      <TimeField12h
                        label="Exit Time"
                        value={draftTts.exitTime}
                        onChange={v => setDraftTts(prev => ({ ...prev, exitTime: v }))}
                      />
                    </div>

                    <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40 text-xs">
                      <span className="text-slate-600 dark:text-slate-300 font-medium">Calculated Class Duration</span>
                      <span className="font-bold text-emerald-700 dark:text-emerald-400 tabular-nums">
                        {calcDurationLabel(draftTts.entryTime, draftTts.exitTime) || '—'}
                      </span>
                    </div>

                    <SubjectTeachersEditor
                      entries={getSlotEntries(draftTts)}
                      onChange={nextEntries =>
                        setDraftTts(prev => ({
                          ...prev,
                          subjectTeachers: nextEntries,
                          subject: nextEntries[0]?.subject || '',
                          teacher: nextEntries[0]?.teacher || '',
                        }))
                      }
                      subjectOptions={activeSubjectNames}
                      teacherOptions={activeTeacherNames}
                    />
                  </>
                )}
              </div>
            )}

            {/* Panel: Sunday Special / Off */}
            {editorSection === 'sunday' && (
              <div className="space-y-3.5 pt-1">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-slate-800 dark:text-slate-100">Sunday Special Class</div>
                    <div className="text-[11px] text-slate-500">Keep Sunday Off or schedule Morning / Evening class.</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setDraftSunday(prev => ({ ...prev, enabled: !prev.enabled }))}
                    className={`h-7 px-3 rounded-full text-[11px] font-semibold transition-colors cursor-pointer ${
                      draftSunday.enabled
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : 'bg-slate-100 text-slate-500 border border-slate-200'
                    }`}
                  >
                    {draftSunday.enabled ? 'Class Active' : 'Sunday Off'}
                  </button>
                </div>

                {draftSunday.enabled && (
                  <>
                    {/* Morning / Evening quick shift selector */}
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          setDraftSunday(prev => ({
                            ...prev,
                            shift: 'morning',
                            entryTime: '09:00 AM',
                            exitTime: '11:00 AM',
                          }))
                        }
                        className={`h-9 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                          draftSunday.shift === 'morning'
                            ? 'bg-amber-50 border-amber-300 text-amber-800'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <Sunrise className="w-3.5 h-3.5" />
                        Morning Shift
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setDraftSunday(prev => ({
                            ...prev,
                            shift: 'evening',
                            entryTime: '04:00 PM',
                            exitTime: '06:00 PM',
                          }))
                        }
                        className={`h-9 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                          draftSunday.shift === 'evening'
                            ? 'bg-indigo-50 border-indigo-300 text-indigo-800'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <Sunset className="w-3.5 h-3.5" />
                        Evening Shift
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <TimeField12h
                        label="Entry Time"
                        value={draftSunday.entryTime}
                        defaultPeriod={draftSunday.shift === 'morning' ? 'AM' : 'PM'}
                        onChange={v => setDraftSunday(prev => ({ ...prev, entryTime: v }))}
                      />
                      <TimeField12h
                        label="Exit Time"
                        value={draftSunday.exitTime}
                        defaultPeriod={draftSunday.shift === 'morning' ? 'AM' : 'PM'}
                        onChange={v => setDraftSunday(prev => ({ ...prev, exitTime: v }))}
                      />
                    </div>

                    <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/40 text-xs">
                      <span className="text-slate-600 dark:text-slate-300 font-medium">Sunday Class Duration</span>
                      <span className="font-bold text-amber-700 dark:text-amber-400 tabular-nums">
                        {calcDurationLabel(draftSunday.entryTime, draftSunday.exitTime) || '—'}
                      </span>
                    </div>

                    <SubjectTeachersEditor
                      entries={getSlotEntries(draftSunday)}
                      onChange={nextEntries =>
                        setDraftSunday(prev => ({
                          ...prev,
                          subjectTeachers: nextEntries,
                          subject: nextEntries[0]?.subject || '',
                          teacher: nextEntries[0]?.teacher || '',
                        }))
                      }
                      subjectOptions={activeSubjectNames}
                      teacherOptions={activeTeacherNames}
                    />

                    <div className="space-y-1">
                      <Label className="text-[10.5px] font-semibold uppercase tracking-wider text-slate-400">
                        Specific Sunday Date (Optional)
                      </Label>
                      <Input
                        type="date"
                        value={draftSunday.date || ''}
                        onChange={e => setDraftSunday(prev => ({ ...prev, date: e.target.value }))}
                        className="h-8 text-xs rounded-lg"
                      />
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          <DialogFooter className="pt-3 border-t border-slate-100 dark:border-slate-800 mt-2">
            <Button variant="outline" size="sm" onClick={() => setIsEditorOpen(false)} className="h-8 rounded-lg text-xs">
              Cancel
            </Button>
            <Button size="sm" onClick={handleSaveTimetable} className="h-8 rounded-lg bg-[#2864E8] hover:bg-blue-700 text-white text-xs font-semibold px-4">
              Save Timetable
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ------------------------------------------------------------- */}
      {/* MANAGE HOLIDAY MODAL                                          */}
      {/* ------------------------------------------------------------- */}
      <Dialog open={isHolidayOpen} onOpenChange={setIsHolidayOpen}>
        <DialogContent className="max-w-lg rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-amber-600" />
              <span>Institute Holidays &amp; Closures</span>
            </DialogTitle>
            <DialogDescription className="text-xs">
              All classes on declared holidays are automatically excused and never penalize student attendance records.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Declared Holidays ({activeHolidays.length})
            </h4>
            {activeHolidays.length === 0 ? (
              <p className="text-xs text-slate-400 italic py-2">No holidays declared.</p>
            ) : (
              <div className="max-h-44 overflow-y-auto space-y-1.5 pr-1 divide-y divide-slate-100 dark:divide-slate-800 border border-slate-100 dark:border-slate-800 rounded-xl p-2 bg-slate-50/50 dark:bg-slate-900/50">
                {activeHolidays.map(h => (
                  <div key={h.id} className="pt-1.5 first:pt-0 flex items-center justify-between gap-2 text-xs">
                    <div>
                      <div className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                        <span>{h.title}</span>
                        <Badge variant="outline" className="text-[10px] font-semibold text-amber-700 bg-amber-50 border-amber-200">
                          {h.date}
                        </Badge>
                      </div>
                      {h.reason && <p className="text-[11px] text-slate-500 line-clamp-1">{h.reason}</p>}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteHoliday(h.id)}
                      className="h-7 w-7 p-0 text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                      title="Delete Holiday"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <form onSubmit={handleAddHolidaySubmit} className="space-y-3 py-2 text-xs border-t border-slate-100 dark:border-slate-800 pt-3">
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              + Declare New Holiday
            </h4>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs font-semibold">Holiday Date</Label>
                <Input type="date" value={holidayDate} onChange={e => setHolidayDate(e.target.value)} className="mt-1 h-9 text-xs" required />
              </div>
              <div>
                <Label className="text-xs font-semibold">Holiday Title / Occasion</Label>
                <Input
                  value={holidayTitle}
                  onChange={e => setHolidayTitle(e.target.value)}
                  placeholder="e.g. Republic Day"
                  className="mt-1 h-9 text-xs"
                  required
                />
              </div>
            </div>

            <div>
              <Label className="text-xs font-semibold">Reason / Circular Note</Label>
              <Textarea
                value={holidayReason}
                onChange={e => setHolidayReason(e.target.value)}
                placeholder="Details of closure or circular announcement..."
                className="mt-1 text-xs h-16"
              />
            </div>

            <DialogFooter>
              <Button variant="outline" size="sm" type="button" onClick={() => setIsHolidayOpen(false)}>
                Close
              </Button>
              <Button size="sm" type="submit" className="bg-amber-600 hover:bg-amber-700 text-white font-bold">
                Declare Holiday
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ------------------------------------------------------------- */}
      {/* CREATE / EDIT SUBJECT MODAL (Embedded)                        */}
      {/* ------------------------------------------------------------- */}
      <Dialog open={isSubjectModalOpen} onOpenChange={setIsSubjectModalOpen}>
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

          <form onSubmit={handleSubjectFormSubmit} className="space-y-4 pt-1">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400">1. Class</Label>
                <Select
                  value={subFormClassName}
                  onValueChange={val => {
                    setSubFormClassName(val);
                    const firstB = batches.find(b => b.className === val);
                    setSubFormBatchId(firstB?.id || '');
                  }}
                >
                  <SelectTrigger className="h-9 text-xs font-semibold rounded-xl border-slate-200 dark:border-slate-700">
                    <SelectValue placeholder="Select Class" />
                  </SelectTrigger>
                  <SelectContent>
                    {classes.filter(c => c.status === 'active').map(c => (
                      <SelectItem key={c.id} value={c.name} className="text-xs">
                        {formatClassLabel(c.name)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400">2. Batch</Label>
                <Select value={subFormBatchId} onValueChange={setSubFormBatchId}>
                  <SelectTrigger className="h-9 text-xs font-semibold rounded-xl border-slate-200 dark:border-slate-700">
                    <SelectValue placeholder="Select Batch" />
                  </SelectTrigger>
                  <SelectContent>
                    {subFormClassBatches.map(b => (
                      <SelectItem key={b.id} value={b.id} className="text-xs">
                        {b.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400">3. Subject Name *</Label>
                <Input
                  placeholder="e.g. Mathematics, Physics"
                  value={subFormName}
                  onChange={e => setSubFormName(e.target.value)}
                  className="h-9 text-xs rounded-xl border-slate-200 dark:border-slate-700"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400">4. Assign Teacher</Label>
                <Select value={subFormTeacher} onValueChange={setSubFormTeacher}>
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

            <div className="space-y-1.5">
              <Label className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400">5. Subject Days</Label>
              <div className="grid grid-cols-4 gap-1.5">
                {(['MWF', 'TTS', 'Mon-Sat', 'Sunday'] as const).map(d => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setSubFormDays(d)}
                    className={`py-2 px-1.5 rounded-xl border text-center text-[11.5px] font-bold transition-all cursor-pointer ${
                      subFormDays === d
                        ? 'bg-blue-50/80 border-[#2864E8] text-[#2864E8]'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <TimeField12h label="Start Time" value={subFormStartTime} onChange={setSubFormStartTime} />
              <TimeField12h label="End Time" value={subFormEndTime} onChange={setSubFormEndTime} />
            </div>

            <DialogFooter className="pt-3 border-t border-slate-100 dark:border-slate-800">
              <Button variant="outline" size="sm" type="button" onClick={() => setIsSubjectModalOpen(false)} className="h-8 rounded-lg text-xs">
                Cancel
              </Button>
              <Button size="sm" type="submit" className="h-8 rounded-lg bg-[#2864E8] hover:bg-blue-700 text-white text-xs font-semibold px-4">
                {editingSubject ? 'Update Subject' : 'Create Subject'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ------------------------------------------------------------- */}
      {/* CREATE / EDIT TEACHER MODAL (Embedded)                        */}
      {/* ------------------------------------------------------------- */}
      <Dialog open={isTeacherModalOpen} onOpenChange={setIsTeacherModalOpen}>
        <DialogContent className="max-w-[480px] w-[95vw] rounded-2xl p-5 sm:p-6 bg-white dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 shadow-2xl">
          <DialogHeader className="pb-3 border-b border-slate-100 dark:border-slate-800 text-left">
            <DialogTitle className="text-[16px] font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-[#2864E8]" />
              <span>{editingTeacher ? 'Edit Teacher' : 'Add New Teacher'}</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Teacher details aur subject specialty add karein.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleTeacherFormSubmit} className="space-y-3.5 pt-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400">Teacher Name *</Label>
                <Input
                  placeholder="e.g. Amod Sharma"
                  value={tFormName}
                  onChange={e => setTFormName(e.target.value)}
                  className="h-9 text-xs rounded-xl"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400">Subject Specialty</Label>
                <Input
                  placeholder="e.g. Mathematics"
                  value={tFormSubject}
                  onChange={e => setTFormSubject(e.target.value)}
                  className="h-9 text-xs rounded-xl"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400">Phone</Label>
                <Input
                  placeholder="+91 98765 00000"
                  value={tFormPhone}
                  onChange={e => setTFormPhone(e.target.value)}
                  className="h-9 text-xs rounded-xl"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400">Email</Label>
                <Input
                  type="email"
                  placeholder="teacher@idleducation.com"
                  value={tFormEmail}
                  onChange={e => setTFormEmail(e.target.value)}
                  className="h-9 text-xs rounded-xl"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400">Joining Date</Label>
                <Input
                  type="date"
                  value={tFormJoiningDate}
                  onChange={e => setTFormJoiningDate(e.target.value)}
                  className="h-9 text-xs rounded-xl"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400">Notes</Label>
                <Input
                  placeholder="Optional remarks..."
                  value={tFormNotes}
                  onChange={e => setTFormNotes(e.target.value)}
                  className="h-9 text-xs rounded-xl"
                />
              </div>
            </div>

            <DialogFooter className="pt-3 border-t border-slate-100 dark:border-slate-800">
              <Button variant="outline" size="sm" type="button" onClick={() => setIsTeacherModalOpen(false)} className="h-8 rounded-lg text-xs">
                Cancel
              </Button>
              <Button size="sm" type="submit" className="h-8 rounded-lg bg-[#2864E8] hover:bg-blue-700 text-white text-xs font-semibold px-4">
                {editingTeacher ? 'Update Teacher' : 'Add Teacher'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Smart Delete Dialogs */}
      {deleteSubjectConfirm && (
        <SmartDeleteDialog
          open={!!deleteSubjectConfirm}
          onClose={() => setDeleteSubjectConfirm(null)}
          entityType="Subject"
          entityName={deleteSubjectConfirm.name}
          entityId={deleteSubjectConfirm.id}
          isDemoMode={isDemoData || (deleteSubjectConfirm.isDemo ?? false)}
          currentRole={currentRole}
          dependencies={getDependencySummary('subject', deleteSubjectConfirm.id)}
          onArchive={() => {
            archiveSubject(deleteSubjectConfirm.id);
            setDeleteSubjectConfirm(null);
          }}
          onForceDelete={reason => {
            forceDeleteSubject(deleteSubjectConfirm.id, reason);
            setDeleteSubjectConfirm(null);
          }}
        />
      )}

      {deleteTeacherConfirm && (
        <SmartDeleteDialog
          open={!!deleteTeacherConfirm}
          onClose={() => setDeleteTeacherConfirm(null)}
          entityType="Teacher"
          entityName={deleteTeacherConfirm.name}
          entityId={deleteTeacherConfirm.id}
          isDemoMode={isDemoData || (deleteTeacherConfirm.isDemo ?? false)}
          currentRole={currentRole}
          dependencies={getDependencySummary('teacher', deleteTeacherConfirm.id)}
          onArchive={() => {
            archiveTeacher(deleteTeacherConfirm.id);
            setDeleteTeacherConfirm(null);
          }}
          onForceDelete={reason => {
            forceDeleteTeacher(deleteTeacherConfirm.id, reason);
            setDeleteTeacherConfirm(null);
          }}
        />
      )}
    </div>
  );
}
