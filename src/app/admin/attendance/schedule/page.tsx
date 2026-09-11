'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAttendance } from '@/context/attendance-context';
import {
  CalendarDays,
  Clock,
  Plus,
  Filter,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  CalendarCheck,
  Building2,
  AlertCircle,
  MoreVertical,
  Radio,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Calendar,
  Edit2,
  Copy,
  Trash2,
  Check,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
import { ScheduleType, TScheduleItem } from '@/lib/attendance-store';

const TIME_SLOTS = [
  '08:00 - 09:00',
  '09:00 - 10:00',
  '10:00 - 11:00',
  '11:00 - 12:00',
  '12:00 - 01:00',
  '02:00 - 04:00',
  '04:00 - 06:00',
  '05:00 - 06:00',
  '06:00 - 07:00',
  '07:00 - 08:00',
];

const DAYS = [
  { name: 'Mon', date: '7 Sep', dayNum: 1, fullDate: '2026-09-07' },
  { name: 'Tue', date: '8 Sep', dayNum: 2, fullDate: '2026-09-08' },
  { name: 'Wed', date: '9 Sep', dayNum: 3, fullDate: '2026-09-09' },
  { name: 'Thu', date: '10 Sep', dayNum: 4, fullDate: '2026-09-10' },
  { name: 'Fri', date: '11 Sep', dayNum: 5, fullDate: '2026-09-11', isToday: true },
  { name: 'Sat', date: '12 Sep', dayNum: 6, fullDate: '2026-09-12' },
  { name: 'Sun', date: '13 Sep', dayNum: 0, fullDate: '2026-09-13' },
];

export default function ClassSchedulePage() {
  const {
    schedules,
    classes,
    batches,
    teachers,
    subjects,
    holidays,
    addScheduleItem,
    updateScheduleItem,
    duplicateScheduleItem,
    rescheduleClass,
    cancelClass,
    deleteScheduleItemSafe,
    addHoliday,
    deleteHoliday,
    startLiveSession,
    currentRole,
  } = useAttendance();

  const [activeTab, setActiveTab] = useState('weekly');
  const [selectedClass, setSelectedClass] = useState('all');
  const [selectedBatch, setSelectedBatch] = useState('all');
  const [selectedTeacher, setSelectedTeacher] = useState('all');

  // Modals
  const [isAddRegularOpen, setIsAddRegularOpen] = useState(false);
  const [isAddOneTimeOpen, setIsAddOneTimeOpen] = useState(false);
  const [isHolidayOpen, setIsHolidayOpen] = useState(false);
  const [selectedScheduleItem, setSelectedScheduleItem] = useState<TScheduleItem | null>(null);

  // Modal sub-views: 'details' | 'reschedule' | 'cancel' | 'edit' | 'duplicate'
  const [modalMode, setModalMode] = useState<'details' | 'reschedule' | 'cancel' | 'edit' | 'duplicate'>('details');

  // Reschedule & Cancel state inside item modal
  const [rescheduleDate, setRescheduleDate] = useState('2026-09-12');
  const [rescheduleStart, setRescheduleStart] = useState('04:00 PM');
  const [rescheduleEnd, setRescheduleEnd] = useState('06:00 PM');
  const [cancelReason, setCancelReason] = useState('');

  // Duplicate state
  const [duplicateTargetDate, setDuplicateTargetDate] = useState('2026-09-12');

  // Edit state
  const [editSubject, setEditSubject] = useState('');
  const [editTeacher, setEditTeacher] = useState('');
  const [editRoom, setEditRoom] = useState('');
  const [editStart, setEditStart] = useState('');
  const [editEnd, setEditEnd] = useState('');
  const [editDuration, setEditDuration] = useState('60');

  // Form states
  const [formBatch, setFormBatch] = useState('9A');
  const [formSubject, setFormSubject] = useState('Mathematics');
  const [formTeacher, setFormTeacher] = useState('Amod Sharma');
  const [formStart, setFormStart] = useState('04:00 PM');
  const [formEnd, setFormEnd] = useState('06:00 PM');
  const [formDate, setFormDate] = useState('2026-09-11');
  const [formDuration, setFormDuration] = useState('120');

  // Holiday Form
  const [holidayDate, setHolidayDate] = useState('2026-09-16');
  const [holidayTitle, setHolidayTitle] = useState('Ganesh Chaturthi');
  const [holidayReason, setHolidayReason] = useState('Institute Closed for Festival');

  const filteredSchedules = schedules.filter(item => {
    if (selectedClass !== 'all' && item.className !== selectedClass) return false;
    if (selectedBatch !== 'all' && item.batchName !== selectedBatch) return false;
    if (selectedTeacher !== 'all' && item.teacherName !== selectedTeacher) return false;
    return true;
  });

  const handleCreateClass = (type: ScheduleType) => {
    const batchObj = batches.find(b => b.name === formBatch);
    const teacherObj = teachers.find(t => t.name === formTeacher);

    addScheduleItem({
      date: formDate,
      dayOfWeek: 5,
      startTime: formStart,
      endTime: formEnd,
      durationMinutes: Number(formDuration) || 60,
      classId: batchObj?.classId || 'c9',
      className: batchObj?.className || '9th',
      batchId: formBatch,
      batchName: formBatch,
      subject: formSubject,
      teacherId: teacherObj?.id || 't1',
      teacherName: formTeacher,
      type,
      status: 'Upcoming',
      room: batchObj?.room || 'Room 101',
    });

    setIsAddRegularOpen(false);
    setIsAddOneTimeOpen(false);
  };

  const openScheduleModal = (item: TScheduleItem) => {
    setSelectedScheduleItem(item);
    setModalMode('details');
    setEditSubject(item.subject);
    setEditTeacher(item.teacherName);
    setEditRoom(item.room || 'Room 101');
    setEditStart(item.startTime);
    setEditEnd(item.endTime);
    setEditDuration(String(item.durationMinutes || 60));
    setRescheduleDate(item.date);
    setRescheduleStart(item.startTime);
    setRescheduleEnd(item.endTime);
    setCancelReason(item.cancellationReason || '');
    setDuplicateTargetDate('2026-09-12');
  };

  const handleAddHolidaySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addHoliday({
      date: holidayDate,
      title: holidayTitle,
      type: 'Institute Holiday',
      reason: holidayReason,
    });
    setHolidayTitle('');
    setHolidayReason('');
  };

  const handleRescheduleSubmit = () => {
    if (!selectedScheduleItem) return;
    rescheduleClass(selectedScheduleItem.id, rescheduleDate, rescheduleStart, rescheduleEnd);
    setSelectedScheduleItem(null);
    setModalMode('details');
  };

  const handleCancelSubmit = () => {
    if (!selectedScheduleItem) return;
    if (!cancelReason.trim()) {
      alert('Please provide a cancellation reason.');
      return;
    }
    cancelClass(selectedScheduleItem.id, cancelReason);
    setSelectedScheduleItem(null);
    setModalMode('details');
  };

  const handleEditScheduleSubmit = () => {
    if (!selectedScheduleItem) return;
    const teacherObj = teachers.find(t => t.name === editTeacher);
    updateScheduleItem(selectedScheduleItem.id, {
      subject: editSubject,
      teacherName: editTeacher,
      teacherId: teacherObj?.id || selectedScheduleItem.teacherId,
      room: editRoom,
      startTime: editStart,
      endTime: editEnd,
      durationMinutes: Number(editDuration) || 60,
    });
    setSelectedScheduleItem(null);
    setModalMode('details');
  };

  const handleDuplicateSubmit = () => {
    if (!selectedScheduleItem) return;
    duplicateScheduleItem(selectedScheduleItem.id, duplicateTargetDate);
    setSelectedScheduleItem(null);
    setModalMode('details');
  };

  const handleDeleteScheduleSubmit = () => {
    if (!selectedScheduleItem) return;
    if (confirm(`Are you sure you want to delete this session (${selectedScheduleItem.subject} - ${selectedScheduleItem.batchName})?`)) {
      const res = deleteScheduleItemSafe(selectedScheduleItem.id);
      if (res.success) {
        setSelectedScheduleItem(null);
        setModalMode('details');
      }
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl md:text-2xl font-black tracking-tight text-slate-900">
              Class Schedule
            </h1>
            <Badge variant="outline" className="text-[11px] font-bold text-blue-700 bg-blue-50 border-blue-200">
              Flexible Timetable
            </Badge>
          </div>
          <p className="text-xs md:text-sm text-slate-500 mt-1 font-medium">
            Create, manage and update regular, extra, or one-time class schedules.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-600 bg-slate-100/80 px-3 py-1.5 rounded-xl border border-slate-200 font-semibold">
          <Calendar className="h-4 w-4 text-blue-600" />
          <span>Thu, 11 Sep 2026</span>
        </div>
      </div>

      {/* Tabs & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* View Switcher */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-auto">
          <TabsList className="bg-slate-200/70 p-1 rounded-xl">
            <TabsTrigger value="weekly" className="text-xs font-bold rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
              Weekly Schedule
            </TabsTrigger>
            <TabsTrigger value="daily" className="text-xs font-bold rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
              Daily View
            </TabsTrigger>
            <TabsTrigger value="calendar" className="text-xs font-bold rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
              Calendar View
            </TabsTrigger>
            <TabsTrigger value="list" className="text-xs font-bold rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
              List View
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            size="sm"
            onClick={() => setIsAddRegularOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs h-9 gap-1.5 shadow-sm"
          >
            <Plus className="h-3.5 w-3.5" />
            + Add Regular Class
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsAddOneTimeOpen(true)}
            className="text-xs font-bold h-9 border-slate-300 text-slate-700 hover:bg-slate-100"
          >
            + Add One-time Class
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsHolidayOpen(true)}
            className="text-xs font-bold h-9 border-slate-300 text-amber-700 border-amber-200 bg-amber-50/60 hover:bg-amber-100"
          >
            <Building2 className="h-3.5 w-3.5 mr-1" />
            Manage Holidays
          </Button>
        </div>
      </div>

      {/* Filter Strip & Week Navigator */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Dropdowns */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="w-36">
            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger className="h-8 text-xs font-medium">
                <SelectValue placeholder="Class" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Classes</SelectItem>
                {classes.map(c => (
                  <SelectItem key={c.id} value={c.name}>
                    Class {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="w-36">
            <Select value={selectedBatch} onValueChange={setSelectedBatch}>
              <SelectTrigger className="h-8 text-xs font-medium">
                <SelectValue placeholder="Batch" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Batches</SelectItem>
                {batches.map(b => (
                  <SelectItem key={b.id} value={b.name}>
                    Batch {b.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="w-44">
            <Select value={selectedTeacher} onValueChange={setSelectedTeacher}>
              <SelectTrigger className="h-8 text-xs font-medium">
                <SelectValue placeholder="Teacher" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Teachers</SelectItem>
                {teachers.map(t => (
                  <SelectItem key={t.id} value={t.name}>
                    {t.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Week Navigator */}
        <div className="flex items-center gap-2 self-end md:self-auto">
          <Button variant="outline" size="sm" className="h-8 w-8 p-0 border-slate-300">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-xs font-bold text-slate-800 px-2">
            7 Sep – 13 Sep 2026
          </span>
          <Button variant="outline" size="sm" className="h-8 w-8 p-0 border-slate-300">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Schedule Content View */}
      {activeTab === 'weekly' && (
        <Card className="border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <div className="min-w-[850px]">
              {/* Header Row: Days */}
              <div className="grid grid-cols-8 bg-slate-50 border-b border-slate-200 text-center font-bold text-xs">
                <div className="p-3 border-r border-slate-200 text-slate-500 uppercase tracking-wider text-[11px] flex items-center justify-center">
                  Time
                </div>
                {DAYS.map(day => (
                  <div
                    key={day.name}
                    className={`p-3 border-r border-slate-200 last:border-r-0 ${
                      day.isToday ? 'bg-blue-50/70 text-blue-900 font-extrabold' : 'text-slate-700'
                    }`}
                  >
                    <div>{day.name}</div>
                    <div className="text-[10px] text-slate-500 font-normal">{day.date}</div>
                    {day.isToday && (
                      <span className="inline-block mt-0.5 px-1.5 py-0.2 bg-blue-600 text-white rounded text-[9px]">
                        Today
                      </span>
                    )}
                  </div>
                ))}
              </div>

              {/* Grid Rows: Time Slots */}
              <div className="divide-y divide-slate-100">
                {TIME_SLOTS.map(timeSlot => {
                  return (
                    <div key={timeSlot} className="grid grid-cols-8 min-h-[64px] text-xs">
                      {/* Time Label Column */}
                      <div className="p-2 border-r border-slate-200 bg-slate-50/50 font-mono text-[11px] text-slate-500 flex items-center justify-center font-semibold">
                        {timeSlot}
                      </div>

                      {/* 7 Days Columns */}
                      {DAYS.map((day, dIdx) => {
                        // Check if holiday falls on this date
                        const holidayMatch = holidays.find(h => h.date === day.fullDate);

                        // Find matching class schedule
                        const matchedClass = filteredSchedules.find(s => {
                          const slotStart = timeSlot.split(' - ')[0];
                          const sStart = s.startTime.includes(slotStart.split(':')[0]);
                          return sStart;
                        });

                        return (
                          <div
                            key={day.name}
                            className={`p-1.5 border-r border-slate-100 last:border-r-0 relative transition-colors ${
                              day.isToday ? 'bg-blue-50/10' : ''
                            }`}
                          >
                            {/* Holiday banner if on Saturday (e.g. Ganesh Chaturthi) */}
                            {dIdx === 5 && timeSlot === '09:00 - 10:00' && (
                              <div className="p-2 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-center font-bold text-[10px] shadow-xs">
                                <Building2 className="h-3 w-3 mx-auto text-amber-600 mb-0.5" />
                                <span>Holiday</span>
                                <div className="text-[9px] text-amber-700 font-normal">Ganesh Chaturthi</div>
                              </div>
                            )}

                            {/* Render Class Block if matched */}
                            {matchedClass && (
                              <div
                                onClick={() => openScheduleModal(matchedClass)}
                                className={`cursor-pointer p-2 rounded-lg text-left transition-all hover:scale-[1.02] shadow-xs ${
                                  matchedClass.type === 'regular'
                                    ? 'bg-blue-50/90 border border-blue-200 text-blue-900 hover:border-blue-400'
                                    : matchedClass.type === 'one_time'
                                    ? 'bg-emerald-50/90 border border-emerald-200 text-emerald-900 hover:border-emerald-400'
                                    : matchedClass.type === 'rescheduled'
                                    ? 'bg-amber-50/90 border border-amber-200 text-amber-900 hover:border-amber-400'
                                    : 'bg-slate-100 border border-slate-300 text-slate-700'
                                }`}
                              >
                                <div className="flex items-center justify-between">
                                  <span className="font-extrabold text-[11px]">
                                    {matchedClass.batchName}
                                  </span>
                                  {matchedClass.status === 'Ongoing' && (
                                    <span className="h-2 w-2 rounded-full bg-blue-600 animate-ping" />
                                  )}
                                </div>
                                <div className="font-semibold text-[10px] text-slate-800 line-clamp-1">
                                  {matchedClass.subject}
                                </div>
                                <div className="text-[9px] text-slate-600 mt-0.5 line-clamp-1">
                                  {matchedClass.teacherName}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Color Legend (as requested in specifications) */}
          <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4 text-xs">
            <div className="flex flex-wrap items-center gap-4">
              <span className="font-bold text-slate-600 text-[11px] uppercase tracking-wider">Legend:</span>
              <div className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-full bg-blue-500" />
                <span className="text-slate-700 font-medium">Regular Class</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-full bg-emerald-500" />
                <span className="text-slate-700 font-medium">One-time Class</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-full bg-amber-500" />
                <span className="text-slate-700 font-medium">Rescheduled Class</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-full bg-rose-500" />
                <span className="text-slate-700 font-medium">Cancelled Class</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-full bg-purple-500" />
                <span className="text-slate-700 font-medium">Holiday</span>
              </div>
            </div>

            <div className="text-[11px] text-slate-500 italic">
              * Cancelled &amp; holiday classes never count as student absences.
            </div>
          </div>
        </Card>
      )}

      {/* List View */}
      {activeTab !== 'weekly' && (
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="p-4">
            <CardTitle className="text-sm font-bold">Scheduled Classes List</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-100">
              {filteredSchedules.map(item => (
                <div
                  key={item.id}
                  onClick={() => openScheduleModal(item)}
                  className="p-4 flex items-center justify-between hover:bg-slate-50 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-center font-mono bg-slate-100 px-3 py-1.5 rounded-lg">
                      <div className="text-xs font-bold text-slate-800">{item.startTime}</div>
                      <div className="text-[10px] text-slate-500">{item.durationMinutes}m</div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900">{item.className} - Batch {item.batchName}</span>
                        <Badge variant="outline" className="text-[10px] capitalize">
                          {item.type.replace('_', ' ')}
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-600 font-medium">{item.subject} • Teacher: {item.teacherName}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge className={item.status === 'Completed' ? 'bg-emerald-50 text-emerald-700' : 'bg-blue-50 text-blue-700'}>
                      {item.status}
                    </Badge>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Class Details & Action Modal */}
      <Dialog open={!!selectedScheduleItem} onOpenChange={open => !open && setSelectedScheduleItem(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center justify-between">
              <span>{selectedScheduleItem?.className} - Batch {selectedScheduleItem?.batchName}</span>
              <Badge className="capitalize text-xs">
                {selectedScheduleItem?.type}
              </Badge>
            </DialogTitle>
            <DialogDescription className="text-xs">
              {selectedScheduleItem?.subject} • Room: {selectedScheduleItem?.room || 'Room 101'}
            </DialogDescription>
          </DialogHeader>

          {selectedScheduleItem && modalMode === 'details' && (
            <div className="space-y-3 py-2 text-xs">
              <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-lg border border-slate-100">
                <div>
                  <span className="text-slate-500 block text-[11px]">Teacher</span>
                  <span className="font-bold text-slate-800">{selectedScheduleItem.teacherName}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Time</span>
                  <span className="font-bold text-slate-800">
                    {selectedScheduleItem.startTime} – {selectedScheduleItem.endTime}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Duration</span>
                  <span className="font-bold text-slate-800">{selectedScheduleItem.durationMinutes} Minutes</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px]">Current Status</span>
                  <span className={`font-bold ${
                    selectedScheduleItem.status === 'Cancelled' ? 'text-rose-600' :
                    selectedScheduleItem.status === 'Completed' ? 'text-slate-600' :
                    selectedScheduleItem.status === 'Ongoing' ? 'text-emerald-600' : 'text-blue-600'
                  }`}>
                    {selectedScheduleItem.status}
                  </span>
                </div>
              </div>

              {selectedScheduleItem.cancellationReason && (
                <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs">
                  <span className="font-bold block">Cancellation Reason:</span>
                  <span>{selectedScheduleItem.cancellationReason}</span>
                </div>
              )}

              <div className="flex flex-col gap-2 pt-2">
                {selectedScheduleItem.status !== 'Completed' && selectedScheduleItem.status !== 'Cancelled' && (
                  <Link href="/admin/attendance/live" onClick={() => setSelectedScheduleItem(null)}>
                    <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs h-9 gap-2">
                      <Radio className="h-3.5 w-3.5 animate-pulse" />
                      Start / Open Live Session
                    </Button>
                  </Link>
                )}

                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setModalMode('edit')}
                    className="text-xs font-semibold h-8 border-slate-300 gap-1"
                  >
                    <Edit2 className="h-3 w-3 text-slate-600" />
                    Edit Details
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setModalMode('duplicate')}
                    className="text-xs font-semibold h-8 border-slate-300 gap-1 text-blue-700 bg-blue-50/50 hover:bg-blue-100/50"
                  >
                    <Copy className="h-3 w-3 text-blue-600" />
                    Duplicate Session
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setModalMode('reschedule')}
                    className="text-xs font-semibold h-8 border-slate-300 gap-1 text-amber-700 bg-amber-50/50 hover:bg-amber-100/50"
                  >
                    <Calendar className="h-3 w-3 text-amber-600" />
                    Reschedule
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setModalMode('cancel')}
                    disabled={selectedScheduleItem.status === 'Cancelled'}
                    className="text-xs font-semibold h-8 text-rose-600 border-rose-200 hover:bg-rose-50 gap-1"
                  >
                    <XCircle className="h-3 w-3" />
                    Cancel Class
                  </Button>
                </div>

                <div className="pt-2 border-t border-slate-100 flex justify-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleDeleteScheduleSubmit}
                    className="text-xs text-rose-600 hover:bg-rose-50 hover:text-rose-700 h-8 gap-1"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Delete Session
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Edit Session View */}
          {modalMode === 'edit' && (
            <div className="space-y-3 py-2 text-xs">
              <div>
                <Label className="text-xs font-semibold">Subject</Label>
                <Input
                  value={editSubject}
                  onChange={e => setEditSubject(e.target.value)}
                  className="mt-1 h-9 text-xs"
                />
              </div>

              <div>
                <Label className="text-xs font-semibold">Assigned Teacher</Label>
                <Select value={editTeacher} onValueChange={setEditTeacher}>
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

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs font-semibold">Room / Hall</Label>
                  <Input
                    value={editRoom}
                    onChange={e => setEditRoom(e.target.value)}
                    className="mt-1 h-9 text-xs"
                  />
                </div>
                <div>
                  <Label className="text-xs font-semibold">Duration (Mins)</Label>
                  <Input
                    type="number"
                    value={editDuration}
                    onChange={e => setEditDuration(e.target.value)}
                    className="mt-1 h-9 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs font-semibold">Start Time</Label>
                  <Input
                    value={editStart}
                    onChange={e => setEditStart(e.target.value)}
                    className="mt-1 h-9 text-xs"
                  />
                </div>
                <div>
                  <Label className="text-xs font-semibold">End Time</Label>
                  <Input
                    value={editEnd}
                    onChange={e => setEditEnd(e.target.value)}
                    className="mt-1 h-9 text-xs"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button variant="ghost" size="sm" onClick={() => setModalMode('details')}>
                  Back
                </Button>
                <Button size="sm" onClick={handleEditScheduleSubmit} className="bg-blue-600 hover:bg-blue-700 text-white font-bold">
                  Save Changes
                </Button>
              </div>
            </div>
          )}

          {/* Duplicate Session View */}
          {modalMode === 'duplicate' && (
            <div className="space-y-3 py-2 text-xs">
              <p className="text-slate-600 text-xs">
                Duplicate this class session (<span className="font-bold">{selectedScheduleItem?.subject}</span> - Batch {selectedScheduleItem?.batchName}) to another date.
              </p>
              <div>
                <Label className="text-xs font-semibold">Target Date</Label>
                <Input
                  type="date"
                  value={duplicateTargetDate}
                  onChange={e => setDuplicateTargetDate(e.target.value)}
                  className="mt-1 h-9 text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button variant="ghost" size="sm" onClick={() => setModalMode('details')}>
                  Back
                </Button>
                <Button size="sm" onClick={handleDuplicateSubmit} className="bg-blue-600 hover:bg-blue-700 text-white font-bold gap-1">
                  <Copy className="h-3 w-3" />
                  Confirm Duplicate
                </Button>
              </div>
            </div>
          )}

          {/* Reschedule View */}
          {modalMode === 'reschedule' && (
            <div className="space-y-3 py-2 text-xs">
              <div>
                <Label className="text-xs font-semibold">New Date</Label>
                <Input
                  type="date"
                  value={rescheduleDate}
                  onChange={e => setRescheduleDate(e.target.value)}
                  className="mt-1 h-9 text-xs"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs font-semibold">New Start</Label>
                  <Input
                    value={rescheduleStart}
                    onChange={e => setRescheduleStart(e.target.value)}
                    className="mt-1 h-9 text-xs"
                  />
                </div>
                <div>
                  <Label className="text-xs font-semibold">New End</Label>
                  <Input
                    value={rescheduleEnd}
                    onChange={e => setRescheduleEnd(e.target.value)}
                    className="mt-1 h-9 text-xs"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="ghost" size="sm" onClick={() => setModalMode('details')}>
                  Back
                </Button>
                <Button size="sm" onClick={handleRescheduleSubmit} className="bg-amber-600 hover:bg-amber-700 text-white font-bold">
                  Confirm Reschedule
                </Button>
              </div>
            </div>
          )}

          {/* Cancel View */}
          {modalMode === 'cancel' && (
            <div className="space-y-3 py-2 text-xs">
              <div>
                <Label className="text-xs font-semibold">Reason for Cancellation</Label>
                <Textarea
                  placeholder="e.g. Teacher unwell, institute power maintenance..."
                  value={cancelReason}
                  onChange={e => setCancelReason(e.target.value)}
                  className="mt-1 text-xs h-20"
                />
              </div>
              <p className="text-[11px] text-slate-500 italic">
                Note: Cancelled classes will not count as absence or missed hours for enrolled students.
              </p>
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="ghost" size="sm" onClick={() => setModalMode('details')}>
                  Back
                </Button>
                <Button size="sm" onClick={handleCancelSubmit} className="bg-rose-600 hover:bg-rose-700 text-white font-bold">
                  Confirm Cancellation
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Regular Class Modal */}
      <Dialog open={isAddRegularOpen} onOpenChange={setIsAddRegularOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">Add Regular Class</DialogTitle>
            <DialogDescription className="text-xs">
              Adds a recurring weekly schedule for this batch.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2 text-xs">
            <div>
              <Label className="text-xs font-semibold">Batch</Label>
              <Select value={formBatch} onValueChange={setFormBatch}>
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
              <Label className="text-xs font-semibold">Subject</Label>
              <Input
                value={formSubject}
                onChange={e => setFormSubject(e.target.value)}
                className="mt-1 h-9 text-xs"
              />
            </div>

            <div>
              <Label className="text-xs font-semibold">Teacher</Label>
              <Select value={formTeacher} onValueChange={setFormTeacher}>
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

            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs font-semibold">Start Time</Label>
                <Input
                  value={formStart}
                  onChange={e => setFormStart(e.target.value)}
                  className="mt-1 h-9 text-xs"
                />
              </div>
              <div>
                <Label className="text-xs font-semibold">End Time</Label>
                <Input
                  value={formEnd}
                  onChange={e => setFormEnd(e.target.value)}
                  className="mt-1 h-9 text-xs"
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setIsAddRegularOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" onClick={() => handleCreateClass('regular')} className="bg-blue-600 hover:bg-blue-700 text-white font-bold">
              Save Regular Schedule
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add One-Time Class Modal */}
      <Dialog open={isAddOneTimeOpen} onOpenChange={setIsAddOneTimeOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">Add One-time / Extra Class</DialogTitle>
            <DialogDescription className="text-xs">
              Create an individual class session for a particular date without altering regular timetable.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2 text-xs">
            <div>
              <Label className="text-xs font-semibold">Date</Label>
              <Input
                type="date"
                value={formDate}
                onChange={e => setFormDate(e.target.value)}
                className="mt-1 h-9 text-xs"
              />
            </div>

            <div>
              <Label className="text-xs font-semibold">Batch</Label>
              <Select value={formBatch} onValueChange={setFormBatch}>
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
              <Label className="text-xs font-semibold">Subject</Label>
              <Input
                value={formSubject}
                onChange={e => setFormSubject(e.target.value)}
                className="mt-1 h-9 text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs font-semibold">Start Time</Label>
                <Input
                  value={formStart}
                  onChange={e => setFormStart(e.target.value)}
                  className="mt-1 h-9 text-xs"
                />
              </div>
              <div>
                <Label className="text-xs font-semibold">End Time</Label>
                <Input
                  value={formEnd}
                  onChange={e => setFormEnd(e.target.value)}
                  className="mt-1 h-9 text-xs"
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setIsAddOneTimeOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" onClick={() => handleCreateClass('one_time')} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold">
              Schedule One-Time Class
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Manage Holiday Modal */}
      <Dialog open={isHolidayOpen} onOpenChange={setIsHolidayOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              <Building2 className="h-4 w-4 text-amber-600" />
              <span>Institute Holidays &amp; Closures</span>
            </DialogTitle>
            <DialogDescription className="text-xs">
              All classes on declared holidays are automatically excused and NEVER penalize student attendance records.
            </DialogDescription>
          </DialogHeader>

          {/* Existing Holidays list */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Declared Holidays ({holidays.length})
            </h4>
            {holidays.length === 0 ? (
              <p className="text-xs text-slate-400 italic py-2">No holidays declared.</p>
            ) : (
              <div className="max-h-44 overflow-y-auto space-y-1.5 pr-1 divide-y divide-slate-100 border border-slate-100 rounded-lg p-2 bg-slate-50/50">
                {holidays.map(h => (
                  <div key={h.id} className="pt-1.5 first:pt-0 flex items-center justify-between gap-2 text-xs">
                    <div>
                      <div className="font-bold text-slate-800 flex items-center gap-1.5">
                        <span>{h.title}</span>
                        <Badge variant="outline" className="text-[10px] font-semibold text-amber-700 bg-amber-50 border-amber-200">
                          {h.date}
                        </Badge>
                      </div>
                      {h.reason && (
                        <p className="text-[11px] text-slate-500 line-clamp-1">{h.reason}</p>
                      )}
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

          <form onSubmit={handleAddHolidaySubmit} className="space-y-3 py-2 text-xs border-t border-slate-100 pt-3">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              + Declare New Holiday
            </h4>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs font-semibold">Holiday Date</Label>
                <Input
                  type="date"
                  value={holidayDate}
                  onChange={e => setHolidayDate(e.target.value)}
                  className="mt-1 h-9 text-xs"
                  required
                />
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
    </div>
  );
}
