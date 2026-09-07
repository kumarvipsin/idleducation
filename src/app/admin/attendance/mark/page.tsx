'use client';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/auth-context';
import {
  CheckCircle2, XCircle, Clock, Users, ClipboardList, Save,
  CheckCheck, Calendar, BookOpen, UserPlus, ArrowRight, Sparkles, PlusCircle
} from 'lucide-react';
import {
  getAttendanceClasses, getSubjects, getAttendanceStudents,
  markPeriodAttendance, getAttendanceForPeriod, createAttendanceStudent
} from '@/app/actions/attendance';
import type { TAttendanceClass, TSubject, TAttendanceStudent } from '@/app/actions/types';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

// Hour / Period presets for coaching routine
const PERIOD_PRESETS = [
  { index: 1, label: 'Hour 1 (1st Period)', defaultStart: '16:00', defaultEnd: '17:00' },
  { index: 2, label: 'Hour 2 (2nd Period)', defaultStart: '17:00', defaultEnd: '18:00' },
  { index: 3, label: 'Hour 3 (3rd Period)', defaultStart: '18:00', defaultEnd: '19:00' },
];

type StudentMarkRow = {
  studentId: string;
  studentName: string;
  studentCode: string;
  status: 'PRESENT' | 'ABSENT' | 'LATE' | 'ON_LEAVE';
  inTime: string;
  outTime: string;
  remark: string;
};

export default function MarkAttendancePage() {
  const { user } = useAuth();
  const { toast } = useToast();

  // Classes and Subjects
  const [classes, setClasses] = useState<TAttendanceClass[]>([]);
  const [subjects, setSubjects] = useState<TSubject[]>([]);
  const [loadingInitial, setLoadingInitial] = useState(true);

  // Selected State
  const [selectedClassId, setSelectedClassId] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [selectedPeriod, setSelectedPeriod] = useState<number>(1);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('');
  const [customSubjectName, setCustomSubjectName] = useState<string>('');
  const [periodStart, setPeriodStart] = useState<string>('16:00');
  const [periodEnd, setPeriodEnd] = useState<string>('17:00');

  // Student Attendance State
  const [students, setStudents] = useState<TAttendanceStudent[]>([]);
  const [attendanceRows, setAttendanceRows] = useState<StudentMarkRow[]>([]);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [saving, setSaving] = useState(false);

  // Quick Add Student Dialog
  const [addStudentOpen, setAddStudentOpen] = useState(false);
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentCode, setNewStudentCode] = useState('');
  const [newStudentPhone, setNewStudentPhone] = useState('');
  const [newParentPhone, setNewParentPhone] = useState('');
  const [addingStudent, setAddingStudent] = useState(false);

  // Load classes and subjects on mount
  useEffect(() => {
    (async () => {
      setLoadingInitial(true);
      const [cRes, sRes] = await Promise.all([getAttendanceClasses(), getSubjects()]);

      if (cRes.success && cRes.data) {
        const clsList = cRes.data as TAttendanceClass[];
        // Filter unique by name if duplicates exist
        const uniqueClasses: TAttendanceClass[] = [];
        const seenNames = new Set<string>();
        clsList.forEach(c => {
          if (!seenNames.has(c.name)) {
            seenNames.add(c.name);
            uniqueClasses.push(c);
          }
        });
        setClasses(uniqueClasses);
        if (uniqueClasses.length > 0) setSelectedClassId(uniqueClasses[0].id);
      }

      if (sRes.success && sRes.data) {
        const subList = (sRes.data as TSubject[]).filter(s => s.status === 'active');
        setSubjects(subList);
        if (subList.length > 0) setSelectedSubjectId(subList[0].id);
      }
      setLoadingInitial(false);
    })();
  }, []);

  // When Period changes, update default times
  const handlePeriodChange = (pIndex: number) => {
    setSelectedPeriod(pIndex);
    const preset = PERIOD_PRESETS.find(p => p.index === pIndex);
    if (preset) {
      setPeriodStart(preset.defaultStart);
      setPeriodEnd(preset.defaultEnd);
    }
  };

  // Load students & existing attendance for selected Class, Date & Period
  const loadClassRoster = async () => {
    if (!selectedClassId) return;
    setLoadingStudents(true);

    const [stuRes, existingAttRes] = await Promise.all([
      getAttendanceStudents(selectedClassId),
      getAttendanceForPeriod(selectedClassId, selectedDate, selectedPeriod),
    ]);

    const stuList = (stuRes.success && stuRes.data) ? (stuRes.data as TAttendanceStudent[]) : [];
    setStudents(stuList);

    const existingRecords = (existingAttRes.success && existingAttRes.data) ? (existingAttRes.data as any[]) : [];

    // If existing records exist, populate subject if available
    if (existingRecords.length > 0 && existingRecords[0].subjectId) {
      setSelectedSubjectId(existingRecords[0].subjectId);
    }

    const rows: StudentMarkRow[] = stuList.map(stu => {
      const existing = existingRecords.find(r => r.studentId === stu.id);
      return {
        studentId: stu.id,
        studentName: stu.name,
        studentCode: stu.studentCode || '',
        status: existing?.status || 'PRESENT',
        inTime: existing?.inTime || existing?.entryTime || periodStart,
        outTime: existing?.outTime || periodEnd,
        remark: existing?.remark || '',
      };
    });

    setAttendanceRows(rows);
    setLoadingStudents(false);
  };

  useEffect(() => {
    if (selectedClassId) {
      loadClassRoster();
    }
  }, [selectedClassId, selectedDate, selectedPeriod]);

  // Mark all students Present / Absent
  const handleMarkAll = (status: 'PRESENT' | 'ABSENT') => {
    setAttendanceRows(prev =>
      prev.map(r => ({
        ...r,
        status,
        inTime: status === 'PRESENT' ? (r.inTime || periodStart) : '',
        outTime: status === 'PRESENT' ? (r.outTime || periodEnd) : '',
      }))
    );
  };

  // Reset all In & Out times to current period scheduled times
  const handleApplyDefaultTimes = () => {
    setAttendanceRows(prev =>
      prev.map(r => ({
        ...r,
        inTime: periodStart,
        outTime: periodEnd,
      }))
    );
    toast({ title: 'Times Applied', description: `In: ${periodStart} · Out: ${periodEnd} set for all students.` });
  };

  // Single student status change
  const handleStudentStatus = (index: number, status: 'PRESENT' | 'ABSENT' | 'LATE') => {
    setAttendanceRows(prev =>
      prev.map((r, i) => {
        if (i !== index) return r;
        return {
          ...r,
          status,
          inTime: status === 'ABSENT' ? '' : (r.inTime || periodStart),
          outTime: status === 'ABSENT' ? '' : (r.outTime || periodEnd),
        };
      })
    );
  };

  // Single student field change
  const handleRowChange = (index: number, field: keyof StudentMarkRow, value: string) => {
    setAttendanceRows(prev =>
      prev.map((r, i) => (i === index ? { ...r, [field]: value } : r))
    );
  };

  // Save Attendance
  const handleSaveAttendance = async () => {
    if (!selectedClassId) {
      toast({ variant: 'destructive', title: 'Missing Class', description: 'Please select a class.' });
      return;
    }
    if (attendanceRows.length === 0) {
      toast({ variant: 'destructive', title: 'No Students', description: 'There are no students in this class to mark.' });
      return;
    }

    setSaving(true);
    const selectedClassObj = classes.find(c => c.id === selectedClassId);
    const selectedSubObj = subjects.find(s => s.id === selectedSubjectId);
    const subjectName = customSubjectName.trim() || selectedSubObj?.name || 'Class Period';

    const res = await markPeriodAttendance({
      classId: selectedClassId,
      className: selectedClassObj?.name || 'Class',
      sessionDate: selectedDate,
      periodIndex: selectedPeriod,
      subjectId: selectedSubjectId || 'general',
      subjectName,
      scheduledStartTime: periodStart,
      scheduledEndTime: periodEnd,
      records: attendanceRows.map(r => ({
        studentId: r.studentId,
        studentName: r.studentName,
        studentCode: r.studentCode,
        status: r.status,
        inTime: r.inTime || undefined,
        outTime: r.outTime || undefined,
        remark: r.remark || undefined,
      })),
      markedBy: user?.name || user?.email || 'admin',
    });

    if (res.success) {
      toast({ title: '✅ Attendance Saved', description: res.message });
    } else {
      toast({ variant: 'destructive', title: 'Save Failed', description: res.message });
    }
    setSaving(false);
  };

  // Quick Add Student to this class
  const handleQuickAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName.trim()) {
      toast({ variant: 'destructive', title: 'Name Required', description: 'Please enter student name.' });
      return;
    }

    setAddingStudent(true);
    const res = await createAttendanceStudent({
      name: newStudentName.trim(),
      studentCode: newStudentCode.trim() || `STU-${Date.now().toString().slice(-4)}`,
      phone: newStudentPhone.trim(),
      parentPhone: newParentPhone.trim(),
      classId: selectedClassId,
      batchId: 'default',
    });

    if (res.success) {
      toast({ title: 'Student Added', description: `${newStudentName} added to ${classes.find(c => c.id === selectedClassId)?.name}.` });
      setAddStudentOpen(false);
      setNewStudentName('');
      setNewStudentCode('');
      setNewStudentPhone('');
      setNewParentPhone('');
      loadClassRoster();
    } else {
      toast({ variant: 'destructive', title: 'Error', description: res.message });
    }
    setAddingStudent(false);
  };

  // Summary counts
  const summary = useMemo(() => {
    const present = attendanceRows.filter(r => r.status === 'PRESENT').length;
    const absent = attendanceRows.filter(r => r.status === 'ABSENT').length;
    const late = attendanceRows.filter(r => r.status === 'LATE').length;
    return { present, absent, late, total: attendanceRows.length };
  }, [attendanceRows]);

  const selectedClassName = classes.find(c => c.id === selectedClassId)?.name || 'Class';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <ClipboardList className="h-6 w-6 text-primary" /> Daily Attendance Marking
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Class 9th & 10th daily period-wise attendance, arrival & departure times, and subject tracking.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/admin/attendance/weekly">
            <Button variant="outline" size="sm" className="font-bold text-xs h-9">
              Weekly Report <ArrowRight className="h-3.5 w-3.5 ml-1" />
            </Button>
          </Link>
          <Link href="/admin/attendance/monthly">
            <Button variant="outline" size="sm" className="font-bold text-xs h-9">
              Monthly Report <ArrowRight className="h-3.5 w-3.5 ml-1" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Control Panel: Class, Date, Period & Subject */}
      <Card className="border border-slate-200/80 shadow-sm rounded-2xl">
        <CardContent className="pt-6 space-y-5">
          {/* STEP 1: Choose Class */}
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
              1. Select Class
            </label>
            <div className="flex flex-wrap gap-2.5">
              {classes.map(cls => {
                const isSelected = selectedClassId === cls.id;
                return (
                  <button
                    key={cls.id}
                    type="button"
                    onClick={() => setSelectedClassId(cls.id)}
                    className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 border ${
                      isSelected
                        ? 'bg-primary text-primary-foreground border-primary shadow-sm ring-2 ring-primary/20'
                        : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    <Users className="h-4 w-4" />
                    {cls.displayName || cls.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* STEP 2: Choose Date & Hour / Period */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2 border-t border-slate-100">
            {/* Date */}
            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1.5">Date</label>
              <Input
                type="date"
                value={selectedDate}
                onChange={e => setSelectedDate(e.target.value)}
                className="font-medium text-xs h-9"
              />
            </div>

            {/* Period / Hour Selector */}
            <div className="md:col-span-2">
              <label className="text-xs font-bold text-slate-600 block mb-1.5">
                Hour / Period (1 hr each)
              </label>
              <div className="grid grid-cols-3 gap-2">
                {PERIOD_PRESETS.map(preset => {
                  const isSelected = selectedPeriod === preset.index;
                  return (
                    <button
                      key={preset.index}
                      type="button"
                      onClick={() => handlePeriodChange(preset.index)}
                      className={`h-9 px-2 rounded-lg text-xs font-bold border transition flex items-center justify-center gap-1.5 ${
                        isSelected
                          ? 'bg-purple-50 text-purple-700 border-purple-300 ring-1 ring-purple-400'
                          : 'bg-white hover:bg-slate-50 text-slate-600 border-slate-200'
                      }`}
                    >
                      <Clock className="h-3.5 w-3.5" />
                      <span>Hour {preset.index}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Subject */}
            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1.5">Subject</label>
              <Select value={selectedSubjectId} onValueChange={setSelectedSubjectId}>
                <SelectTrigger className="h-9 text-xs font-medium">
                  <SelectValue placeholder="Select Subject" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map(s => (
                    <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* STEP 3: Scheduled Times (Editable Default) */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50/80 p-3 rounded-xl border border-slate-200/60 text-xs">
            <div className="flex items-center gap-4">
              <span className="font-bold text-slate-700 flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-primary" /> Class Scheduled Time:
              </span>
              <div className="flex items-center gap-2">
                <span className="text-slate-500 font-medium">In:</span>
                <Input
                  type="time"
                  value={periodStart}
                  onChange={e => setPeriodStart(e.target.value)}
                  className="h-7 w-24 text-xs font-medium bg-white"
                />
                <span className="text-slate-500 font-medium">Out:</span>
                <Input
                  type="time"
                  value={periodEnd}
                  onChange={e => setPeriodEnd(e.target.value)}
                  className="h-7 w-24 text-xs font-medium bg-white"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleApplyDefaultTimes}
                className="h-7 text-[11px] font-bold"
              >
                Apply In/Out to All Students
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Bar & Quick Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2.5">
          <Badge variant="secondary" className="text-xs font-bold px-3 py-1 gap-1.5">
            <Users className="h-3.5 w-3.5" /> {summary.total} Students in {selectedClassName}
          </Badge>
          <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs font-bold px-3 py-1 gap-1">
            <CheckCircle2 className="h-3.5 w-3.5" /> {summary.present} Present
          </Badge>
          <Badge className="bg-red-50 text-red-700 border-red-200 text-xs font-bold px-3 py-1 gap-1">
            <XCircle className="h-3.5 w-3.5" /> {summary.absent} Absent
          </Badge>
          {summary.late > 0 && (
            <Badge className="bg-amber-50 text-amber-700 border-amber-200 text-xs font-bold px-3 py-1 gap-1">
              <Clock className="h-3.5 w-3.5" /> {summary.late} Late
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => handleMarkAll('PRESENT')}
            className="h-9 font-bold text-xs gap-1.5 text-emerald-700 border-emerald-300 hover:bg-emerald-50"
          >
            <CheckCheck className="h-4 w-4" /> All Present
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => handleMarkAll('ABSENT')}
            className="h-9 font-bold text-xs gap-1.5 text-red-600 border-red-200 hover:bg-red-50"
          >
            <XCircle className="h-4 w-4" /> All Absent
          </Button>

          <Button
            type="button"
            onClick={handleSaveAttendance}
            disabled={saving || attendanceRows.length === 0}
            className="h-9 font-bold text-xs gap-1.5 px-4 shadow-sm"
          >
            <Save className="h-4 w-4" /> {saving ? 'Saving...' : 'Save Attendance'}
          </Button>
        </div>
      </div>

      {/* Student Attendance List */}
      <Card className="border border-slate-200/80 shadow-sm rounded-2xl overflow-hidden">
        <CardHeader className="pb-3 border-b bg-slate-50/50">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold text-slate-800">
                {selectedClassName} — Hour {selectedPeriod} Roster
              </CardTitle>
              <CardDescription className="text-xs">
                Mark status, edit exact arrival (In) & departure (Out) times for each student.
              </CardDescription>
            </div>

            <Button
              size="sm"
              variant="outline"
              onClick={() => setAddStudentOpen(true)}
              className="h-8 text-xs font-bold gap-1"
            >
              <UserPlus className="h-3.5 w-3.5" /> + Add Student to {selectedClassName}
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {loadingStudents ? (
            <div className="p-6 space-y-3">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full rounded-xl" />
              ))}
            </div>
          ) : attendanceRows.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {attendanceRows.map((row, index) => {
                const isPresent = row.status === 'PRESENT';
                const isAbsent = row.status === 'ABSENT';
                const isLate = row.status === 'LATE';

                return (
                  <div
                    key={row.studentId}
                    className={`p-3.5 sm:px-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 transition ${
                      isAbsent ? 'bg-red-50/20' : isLate ? 'bg-amber-50/20' : 'hover:bg-slate-50/70'
                    }`}
                  >
                    {/* Student Info */}
                    <div className="flex items-center gap-3 min-w-[200px]">
                      <div className="h-9 w-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0">
                        {row.studentCode ? row.studentCode.slice(-3) : (index + 1)}
                      </div>
                      <div>
                        <p className="font-bold text-xs text-slate-900">{row.studentName}</p>
                        <p className="text-[11px] text-slate-500 font-mono">
                          Roll: {row.studentCode || '—'}
                        </p>
                      </div>
                    </div>

                    {/* Status Toggle Buttons */}
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleStudentStatus(index, 'PRESENT')}
                        className={`h-8 px-3 rounded-lg text-xs font-bold border transition flex items-center gap-1 ${
                          isPresent
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" /> Present
                      </button>

                      <button
                        type="button"
                        onClick={() => handleStudentStatus(index, 'ABSENT')}
                        className={`h-8 px-3 rounded-lg text-xs font-bold border transition flex items-center gap-1 ${
                          isAbsent
                            ? 'bg-red-600 text-white border-red-600 shadow-sm'
                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <XCircle className="h-3.5 w-3.5" /> Absent
                      </button>

                      <button
                        type="button"
                        onClick={() => handleStudentStatus(index, 'LATE')}
                        className={`h-8 px-3 rounded-lg text-xs font-bold border transition flex items-center gap-1 ${
                          isLate
                            ? 'bg-amber-500 text-white border-amber-500 shadow-sm'
                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <Clock className="h-3.5 w-3.5" /> Late
                      </button>
                    </div>

                    {/* In Time & Out Time (Auto-filled, Editable) */}
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] font-bold text-slate-500">In:</span>
                        <Input
                          type="time"
                          disabled={isAbsent}
                          value={row.inTime}
                          onChange={e => handleRowChange(index, 'inTime', e.target.value)}
                          className={`h-8 w-24 text-xs font-medium ${isAbsent ? 'opacity-40 bg-slate-100' : 'bg-white'}`}
                        />
                      </div>

                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] font-bold text-slate-500">Out:</span>
                        <Input
                          type="time"
                          disabled={isAbsent}
                          value={row.outTime}
                          onChange={e => handleRowChange(index, 'outTime', e.target.value)}
                          className={`h-8 w-24 text-xs font-medium ${isAbsent ? 'opacity-40 bg-slate-100' : 'bg-white'}`}
                        />
                      </div>
                    </div>

                    {/* Optional Remark */}
                    <div className="w-full md:w-44">
                      <Input
                        placeholder="Optional note / topic"
                        value={row.remark}
                        onChange={e => handleRowChange(index, 'remark', e.target.value)}
                        className="h-8 text-xs bg-white"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-12 text-center flex flex-col items-center justify-center">
              <Users className="h-10 w-10 text-muted-foreground/30 mb-2" />
              <p className="font-bold text-sm text-slate-800">No students enrolled in {selectedClassName} yet.</p>
              <p className="text-xs text-muted-foreground mt-1 mb-4">
                Add students to {selectedClassName} to start tracking daily attendance.
              </p>
              <Button
                size="sm"
                onClick={() => setAddStudentOpen(true)}
                className="font-bold text-xs gap-1.5"
              >
                <UserPlus className="h-3.5 w-3.5" /> + Add First Student to {selectedClassName}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* QUICK ADD STUDENT DIALOG */}
      <Dialog open={addStudentOpen} onOpenChange={setAddStudentOpen}>
        <DialogContent className="sm:max-w-md">
          <form onSubmit={handleQuickAddStudent}>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <UserPlus className="h-5 w-5 text-primary" /> Add Student to {selectedClassName}
              </DialogTitle>
              <DialogDescription className="text-xs">
                Enter student details to add them directly to this class.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 py-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs font-bold">Student Name *</Label>
                  <Input
                    required
                    placeholder="e.g. Amod"
                    value={newStudentName}
                    onChange={e => setNewStudentName(e.target.value)}
                    className="h-9 text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-xs font-bold">Roll / Code</Label>
                  <Input
                    placeholder="e.g. 101"
                    value={newStudentCode}
                    onChange={e => setNewStudentCode(e.target.value)}
                    className="h-9 text-xs font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs font-bold">Student Phone</Label>
                  <Input
                    placeholder="10-digit number"
                    value={newStudentPhone}
                    onChange={e => setNewStudentPhone(e.target.value)}
                    className="h-9 text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-xs font-bold">Parent Phone</Label>
                  <Input
                    placeholder="Parent contact"
                    value={newParentPhone}
                    onChange={e => setNewParentPhone(e.target.value)}
                    className="h-9 text-xs"
                  />
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setAddStudentOpen(false)} className="text-xs">
                Cancel
              </Button>
              <Button type="submit" disabled={addingStudent} className="font-bold text-xs">
                {addingStudent ? 'Adding...' : 'Add Student'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
