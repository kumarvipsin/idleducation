'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useAttendance } from '@/context/attendance-context';
import {
  CalendarCheck,
  PhoneCall,
  CalendarDays,
  Plus,
  Filter,
  Check,
  X,
  PlaneTakeoff,
  AlertTriangle,
  Clock,
  Search,
  UserCheck,
  MoreVertical,
  CheckCircle2,
  XCircle,
  Phone,
  Edit2,
  Trash2,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
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
import { Textarea } from '@/components/ui/textarea';
import { CallStatus, LeaveReason, SpokeTo, TAbsenceFollowUp, TLeaveRequest } from '@/lib/attendance-store';

export default function LeaveManagementPage() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') === 'followup' ? 'followup' : 'requests';

  const {
    leaveRequests,
    absentFollowUps,
    addLeaveRequest,
    updateLeaveStatus,
    updateLeaveRequest,
    deleteLeaveRequest,
    deleteAbsentFollowUp,
    logCallFollowUp,
    classes,
    batches,
    students,
  } = useAttendance();

  const [activeTab, setActiveTab] = useState(initialTab);
  const [selectedClass, setSelectedClass] = useState('all');
  const [selectedBatch, setSelectedBatch] = useState('all');
  const [filterPendingOnly, setFilterPendingOnly] = useState(false);

  // Edit leave modal state
  const [editingLeave, setEditingLeave] = useState<TLeaveRequest | null>(null);
  const [editLeaveDate, setEditLeaveDate] = useState('');
  const [editLeaveReasonType, setEditLeaveReasonType] = useState<LeaveReason>('Medical');
  const [editCustomReason, setEditCustomReason] = useState('');
  const [editLeaveInformedBy, setEditLeaveInformedBy] = useState<'Parent' | 'Student' | 'Guardian' | 'Other'>('Parent');
  const [editLeaveRemark, setEditLeaveRemark] = useState('');
  const [editLeaveStatus, setEditLeaveStatus] = useState<'Approved' | 'Pending' | 'Rejected'>('Approved');

  // Call parent modal
  const [callingStudent, setCallingStudent] = useState<TAbsenceFollowUp | null>(null);
  const [callStatus, setCallStatus] = useState<CallStatus>('Contacted');
  const [spokeTo, setSpokeTo] = useState<SpokeTo>('Father');
  const [parentReason, setParentReason] = useState('');
  const [callRemark, setCallRemark] = useState('');

  // Add leave modal
  const [isAddLeaveOpen, setIsAddLeaveOpen] = useState(false);
  const [leaveStudentId, setLeaveStudentId] = useState(students[0]?.id || 's-9a-8');
  const [leaveDate, setLeaveDate] = useState('2026-09-11');
  const [leaveReasonType, setLeaveReasonType] = useState<LeaveReason>('Family Function');
  const [customReason, setCustomReason] = useState('');
  const [leaveInformedBy, setLeaveInformedBy] = useState<'Parent' | 'Student' | 'Guardian'>('Parent');
  const [leaveNotes, setLeaveNotes] = useState('');

  // Filtered follow ups
  const filteredFollowUps = absentFollowUps.filter(item => {
    if (selectedClass !== 'all' && item.className !== selectedClass) return false;
    if (selectedBatch !== 'all' && item.batchName !== selectedBatch) return false;
    if (filterPendingOnly && item.callStatus === 'Contacted') return false;
    return true;
  });

  const totalAbsentCount = absentFollowUps.length;
  const contactedCount = absentFollowUps.filter(f => f.callStatus === 'Contacted').length;
  const pendingCount = totalAbsentCount - contactedCount;

  const handleSaveCall = () => {
    if (!callingStudent) return;
    logCallFollowUp({
      id: callingStudent.id,
      callStatus,
      spokeTo,
      parentReason,
      remark: callRemark,
    });
    setCallingStudent(null);
  };

  const handleCreateLeaveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const st = students.find(s => s.id === leaveStudentId);
    if (!st) return;

    addLeaveRequest({
      date: leaveDate,
      studentId: st.id,
      studentName: st.name,
      classId: st.classId,
      className: st.className,
      batchId: st.batchId,
      batchName: st.batchName,
      reason: leaveReasonType,
      customReason: leaveReasonType === 'Other' ? customReason : undefined,
      informedBy: leaveInformedBy,
      status: 'Approved',
      remark: leaveNotes,
    });

    setIsAddLeaveOpen(false);
    setCustomReason('');
    setLeaveNotes('');
  };

  const openEditLeaveModal = (item: TLeaveRequest) => {
    setEditingLeave(item);
    setEditLeaveDate(item.date);
    setEditLeaveReasonType(item.reason);
    setEditCustomReason(item.customReason || '');
    setEditLeaveInformedBy(item.informedBy);
    setEditLeaveRemark(item.remark || '');
    setEditLeaveStatus(item.status);
  };

  const handleUpdateLeaveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLeave) return;
    updateLeaveRequest(editingLeave.id, {
      date: editLeaveDate,
      reason: editLeaveReasonType,
      customReason: editLeaveReasonType === 'Other' ? editCustomReason : undefined,
      informedBy: editLeaveInformedBy,
      remark: editLeaveRemark,
      status: editLeaveStatus,
    });
    setEditingLeave(null);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl md:text-2xl font-black tracking-tight text-slate-900">
              Leave &amp; Absence Management
            </h1>
            <Badge className="bg-amber-50 text-amber-700 border-amber-200 font-bold text-xs">
              Attendance Follow-up
            </Badge>
          </div>
          <p className="text-xs md:text-sm text-slate-500 mt-1 font-medium">
            Manage pre-informed student leaves and track follow-up calls for unexcused absences.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={() => setIsAddLeaveOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs h-9 px-4 gap-1.5 shadow-sm"
          >
            <Plus className="h-3.5 w-3.5" />
            + Add Leave Request
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-between">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-slate-200/70 p-1 rounded-xl">
            <TabsTrigger value="requests" className="text-xs font-bold rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
              Leave Requests ({leaveRequests.length})
            </TabsTrigger>
            <TabsTrigger value="followup" className="text-xs font-bold rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm gap-1.5">
              <span>Absent Follow-up</span>
              {pendingCount > 0 && (
                <span className="h-4 w-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center">
                  {pendingCount}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="calendar" className="text-xs font-bold rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
              Leave Calendar
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Contact Counters Strip (Panel 5 Reference) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <Card className="border-slate-200 shadow-xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                Today&apos;s Absent Students
              </span>
              <span className="text-2xl font-black text-slate-900 mt-0.5 block">{totalAbsentCount}</span>
            </div>
            <div className="h-8 w-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center">
              <AlertTriangle className="h-4 w-4" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-xs border-l-4 border-l-emerald-500">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider block">
                Contacted &amp; Verified
              </span>
              <span className="text-2xl font-black text-emerald-600 mt-0.5 block">{contactedCount}</span>
            </div>
            <div className="h-8 w-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Check className="h-4 w-4" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-xs border-l-4 border-l-rose-500">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-rose-700 uppercase tracking-wider block">
                Pending Follow-up Calls
              </span>
              <span className="text-2xl font-black text-rose-600 mt-0.5 block">{pendingCount}</span>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setActiveTab('followup');
                setFilterPendingOnly(!filterPendingOnly);
              }}
              className="text-xs font-bold text-rose-700 border-rose-200 hover:bg-rose-50 h-7"
            >
              {filterPendingOnly ? 'Show All' : 'View Pending'}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
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
        </div>

        <div className="text-xs text-slate-500 font-medium">
          Date range: <strong>01 Sep 2026 – 30 Sep 2026</strong>
        </div>
      </div>

      {/* TAB 1: Leave Requests Table (Panel 5 Reference) */}
      {activeTab === 'requests' && (
        <Card className="border-slate-200 shadow-sm overflow-hidden">
          <CardHeader className="p-4 sm:p-5 border-b border-slate-100">
            <CardTitle className="text-sm font-bold text-slate-900">
              Student Leave Applications &amp; Excused Absences
            </CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Pre-informed leave requests with reason and approval status
            </CardDescription>
          </CardHeader>

          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 text-[11px] uppercase tracking-wider">
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Student Name</th>
                  <th className="py-3 px-3">Class</th>
                  <th className="py-3 px-3">Batch</th>
                  <th className="py-3 px-3">Type</th>
                  <th className="py-3 px-4">Reason</th>
                  <th className="py-3 px-3">Informed By</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {leaveRequests.map(item => {
                  const isApproved = item.status === 'Approved';
                  const isPending = item.status === 'Pending';
                  const isRejected = item.status === 'Rejected';

                  return (
                    <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4 font-mono font-semibold text-slate-800">
                        {item.date}
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-900">
                        <Link
                          href={`/admin/attendance/students/${item.studentId}`}
                          className="hover:text-blue-600 hover:underline"
                        >
                          {item.studentName}
                        </Link>
                      </td>
                      <td className="py-3 px-3 font-semibold text-slate-700">{item.className}</td>
                      <td className="py-3 px-3 font-bold text-blue-700">{item.batchName}</td>
                      <td className="py-3 px-3">
                        <Badge variant="outline" className="bg-amber-50/60 text-amber-800 border-amber-200 text-[10px] font-bold">
                          Leave
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-slate-700 font-medium">
                        {item.reason} {item.customReason && `(${item.customReason})`}
                      </td>
                      <td className="py-3 px-3 text-slate-600">{item.informedBy}</td>
                      <td className="py-3 px-3">
                        {isApproved && (
                          <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px] font-bold">
                            ✓ Approved
                          </Badge>
                        )}
                        {isPending && (
                          <Badge className="bg-amber-50 text-amber-700 border-amber-200 text-[10px] font-bold">
                            Pending
                          </Badge>
                        )}
                        {isRejected && (
                          <Badge className="bg-rose-50 text-rose-700 border-rose-200 text-[10px] font-bold">
                            Rejected
                          </Badge>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {isPending && (
                            <>
                              <Button
                                size="sm"
                                onClick={() => updateLeaveStatus(item.id, 'Approved')}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] h-6 px-2.5"
                              >
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateLeaveStatus(item.id, 'Rejected')}
                                className="text-rose-600 border-rose-200 text-[11px] h-6 px-2"
                              >
                                Reject
                              </Button>
                            </>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEditLeaveModal(item)}
                            className="h-6 w-6 p-0 text-slate-500 hover:text-blue-600 hover:bg-blue-50"
                            title="Edit Leave"
                          >
                            <Edit2 className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              if (confirm(`Are you sure you want to delete this leave request for ${item.studentName}?`)) {
                                deleteLeaveRequest(item.id);
                              }
                            }}
                            className="h-6 w-6 p-0 text-slate-500 hover:text-rose-600 hover:bg-rose-50"
                            title="Delete Leave"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}

      {/* TAB 2: Follow-up (Absent Students) Table (Panel 5 Reference) */}
      {activeTab === 'followup' && (
        <Card className="border-slate-200 shadow-sm overflow-hidden">
          <CardHeader className="p-4 sm:p-5 border-b border-slate-100 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <PhoneCall className="h-4 w-4 text-blue-600" />
                Follow-up: Unexcused Absent Students
              </CardTitle>
              <CardDescription className="text-xs text-slate-500">
                Log calls made to parents, record reasons, and maintain permanent follow-up history
              </CardDescription>
            </div>
            {filterPendingOnly && (
              <Badge className="bg-rose-50 text-rose-700 border-rose-200 text-[10px]">
                Showing Pending Only
              </Badge>
            )}
          </CardHeader>

          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 text-[11px] uppercase tracking-wider">
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-3">Class</th>
                  <th className="py-3 px-4">Subject</th>
                  <th className="py-3 px-3">Missed Hours</th>
                  <th className="py-3 px-3">Call Status</th>
                  <th className="py-3 px-3">Spoke To</th>
                  <th className="py-3 px-4">Reason / Remark</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredFollowUps.map(item => {
                  const isContacted = item.callStatus === 'Contacted';
                  const isNotContacted = item.callStatus === 'Not Contacted';

                  return (
                    <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4 font-mono font-semibold text-slate-800">
                        {item.date}
                      </td>
                      <td className="py-3 px-4">
                        <Link
                          href={`/admin/attendance/students/${item.studentId}`}
                          className="font-bold text-slate-900 hover:text-blue-600 hover:underline block"
                        >
                          {item.studentName}
                        </Link>
                        <span className="text-[10px] text-slate-500 font-mono">
                          {item.contactNumber}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-semibold text-slate-700">
                        {item.className} ({item.batchName})
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-900">{item.subject}</td>
                      <td className="py-3 px-3 font-bold text-rose-600">{item.missedHours}</td>
                      <td className="py-3 px-3">
                        <Badge
                          className={`text-[10px] font-bold ${
                            isContacted
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : isNotContacted
                              ? 'bg-rose-50 text-rose-700 border-rose-200 animate-pulse'
                              : 'bg-amber-50 text-amber-700 border-amber-200'
                          }`}
                        >
                          {item.callStatus}
                        </Badge>
                      </td>
                      <td className="py-3 px-3 text-slate-700 font-medium">
                        {item.spokeTo || <span className="text-slate-300">-</span>}
                      </td>
                      <td className="py-3 px-4 text-slate-700">
                        {item.parentReason ? (
                          <div>
                            <span className="font-semibold text-slate-900">{item.parentReason}</span>
                            {item.remark && (
                              <p className="text-[11px] text-slate-500 italic mt-0.5">{item.remark}</p>
                            )}
                          </div>
                        ) : (
                          <span className="text-slate-300">-</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            size="sm"
                            onClick={() => {
                              setCallingStudent(item);
                              setCallStatus(item.callStatus);
                              setSpokeTo(item.spokeTo || 'Father');
                              setParentReason(item.parentReason || '');
                              setCallRemark(item.remark || '');
                            }}
                            className={`font-bold text-xs h-7 px-3 gap-1 shadow-xs ${
                              isContacted
                                ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                                : 'bg-blue-600 hover:bg-blue-700 text-white'
                            }`}
                          >
                            <Phone className="h-3 w-3" />
                            {isContacted ? 'Update Call' : 'Call Parent'}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              if (confirm(`Dismiss or remove follow-up for ${item.studentName}?`)) {
                                deleteAbsentFollowUp(item.id);
                              }
                            }}
                            className="h-7 w-7 p-0 text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                            title="Dismiss Follow-up"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}

      {/* TAB 3: Leave Calendar */}
      {activeTab === 'calendar' && (
        <Card className="border-slate-200 shadow-sm p-6 text-center">
          <div className="max-w-md mx-auto space-y-3">
            <CalendarDays className="h-10 w-10 text-blue-600 mx-auto" />
            <h3 className="font-bold text-slate-900 text-base">Monthly Absence &amp; Leave Heatmap</h3>
            <p className="text-xs text-slate-500">
              Visual calendar tracking student leave density and batch-wise attendance rates throughout September 2026.
            </p>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-7 gap-2 text-xs font-bold text-center">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => (
                <div key={d} className="text-slate-400 text-[10px]">
                  {d}
                </div>
              ))}
              {Array.from({ length: 30 }).map((_, i) => (
                <div
                  key={i}
                  className={`p-2 rounded-lg border text-[11px] ${
                    i === 10
                      ? 'bg-blue-600 text-white font-black'
                      : i === 15
                      ? 'bg-amber-100 text-amber-800 border-amber-300 font-bold'
                      : 'bg-white border-slate-100 text-slate-700'
                  }`}
                >
                  {i + 1}
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* Log Call Modal */}
      <Dialog open={!!callingStudent} onOpenChange={open => !open && setCallingStudent(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base font-bold">
              <PhoneCall className="h-4 w-4 text-blue-600" />
              Follow-up Call: {callingStudent?.studentName}
            </DialogTitle>
            <DialogDescription className="text-xs">
              Class {callingStudent?.className} ({callingStudent?.batchName}) • Parent Phone: {callingStudent?.contactNumber}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3.5 py-2 text-xs">
            <div>
              <Label className="text-xs font-semibold">Call Status</Label>
              <Select value={callStatus} onValueChange={(v: any) => setCallStatus(v)}>
                <SelectTrigger className="mt-1 h-9 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Contacted">Contacted</SelectItem>
                  <SelectItem value="Not Contacted">Not Contacted</SelectItem>
                  <SelectItem value="Busy">Busy</SelectItem>
                  <SelectItem value="Not Reachable">Not Reachable</SelectItem>
                  <SelectItem value="Call Back Requested">Call Back Requested</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {callStatus === 'Contacted' && (
              <div>
                <Label className="text-xs font-semibold">Spoke To</Label>
                <Select value={spokeTo} onValueChange={(v: any) => setSpokeTo(v)}>
                  <SelectTrigger className="mt-1 h-9 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Father">Father</SelectItem>
                    <SelectItem value="Mother">Mother</SelectItem>
                    <SelectItem value="Student">Student</SelectItem>
                    <SelectItem value="Guardian">Guardian</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <div>
              <Label className="text-xs font-semibold">Parent Reason</Label>
              <Input
                placeholder="e.g. Mild fever, out of station, personal emergency..."
                value={parentReason}
                onChange={e => setParentReason(e.target.value)}
                className="mt-1 h-9 text-xs"
              />
            </div>

            <div>
              <Label className="text-xs font-semibold">Remark / Follow-up Note</Label>
              <Textarea
                placeholder="e.g. Will attend class tomorrow..."
                value={callRemark}
                onChange={e => setCallRemark(e.target.value)}
                className="mt-1 text-xs h-20"
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" size="sm" onClick={() => setCallingStudent(null)}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleSaveCall} className="bg-blue-600 hover:bg-blue-700 text-white font-bold">
              Save to Call Log
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Leave Modal */}
      <Dialog open={isAddLeaveOpen} onOpenChange={setIsAddLeaveOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">Submit Student Leave Request</DialogTitle>
            <DialogDescription className="text-xs">
              Pre-informed absence. Does not penalize as unexcused absence.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateLeaveSubmit} className="space-y-3.5 py-2 text-xs">
            <div>
              <Label className="text-xs font-semibold">Select Student</Label>
              <Select value={leaveStudentId} onValueChange={setLeaveStudentId}>
                <SelectTrigger className="mt-1 h-9 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {students.slice(0, 30).map(s => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.name} ({s.className} - Batch {s.batchName})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-xs font-semibold">Leave Date</Label>
              <Input
                type="date"
                value={leaveDate}
                onChange={e => setLeaveDate(e.target.value)}
                className="mt-1 h-9 text-xs"
                required
              />
            </div>

            <div>
              <Label className="text-xs font-semibold">Leave Reason</Label>
              <Select value={leaveReasonType} onValueChange={(v: any) => setLeaveReasonType(v)}>
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

            {leaveReasonType === 'Other' && (
              <div>
                <Label className="text-xs font-semibold">Specify Custom Reason</Label>
                <Input
                  value={customReason}
                  onChange={e => setCustomReason(e.target.value)}
                  placeholder="Enter reason..."
                  className="mt-1 h-9 text-xs"
                  required
                />
              </div>
            )}

            <div>
              <Label className="text-xs font-semibold">Who Informed?</Label>
              <Select value={leaveInformedBy} onValueChange={(v: any) => setLeaveInformedBy(v)}>
                <SelectTrigger className="mt-1 h-9 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Parent">Parent</SelectItem>
                  <SelectItem value="Student">Student</SelectItem>
                  <SelectItem value="Guardian">Guardian</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-xs font-semibold">Remark</Label>
              <Textarea
                value={leaveNotes}
                onChange={e => setLeaveNotes(e.target.value)}
                placeholder="Additional details..."
                className="mt-1 text-xs h-16"
              />
            </div>

            <DialogFooter>
              <Button variant="outline" size="sm" type="button" onClick={() => setIsAddLeaveOpen(false)}>
                Cancel
              </Button>
              <Button size="sm" type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold">
                Approve &amp; Record Leave
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Leave Modal */}
      <Dialog open={!!editingLeave} onOpenChange={open => !open && setEditingLeave(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">Edit Leave Application</DialogTitle>
            <DialogDescription className="text-xs">
              Update leave parameters for <strong>{editingLeave?.studentName}</strong> ({editingLeave?.className} - {editingLeave?.batchName}).
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleUpdateLeaveSubmit} className="space-y-3 py-2 text-xs">
            <div>
              <Label className="text-xs font-semibold">Leave Date</Label>
              <Input
                type="date"
                value={editLeaveDate}
                onChange={e => setEditLeaveDate(e.target.value)}
                className="mt-1 h-9 text-xs"
                required
              />
            </div>

            <div>
              <Label className="text-xs font-semibold">Leave Reason</Label>
              <Select value={editLeaveReasonType} onValueChange={(v: any) => setEditLeaveReasonType(v)}>
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

            {editLeaveReasonType === 'Other' && (
              <div>
                <Label className="text-xs font-semibold">Specify Custom Reason</Label>
                <Input
                  value={editCustomReason}
                  onChange={e => setEditCustomReason(e.target.value)}
                  placeholder="Enter reason..."
                  className="mt-1 h-9 text-xs"
                  required
                />
              </div>
            )}

            <div>
              <Label className="text-xs font-semibold">Who Informed?</Label>
              <Select value={editLeaveInformedBy} onValueChange={(v: any) => setEditLeaveInformedBy(v)}>
                <SelectTrigger className="mt-1 h-9 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Parent">Parent</SelectItem>
                  <SelectItem value="Student">Student</SelectItem>
                  <SelectItem value="Guardian">Guardian</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-xs font-semibold">Approval Status</Label>
              <Select value={editLeaveStatus} onValueChange={(v: any) => setEditLeaveStatus(v)}>
                <SelectTrigger className="mt-1 h-9 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Approved">Approved</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-xs font-semibold">Remark / Notes</Label>
              <Textarea
                value={editLeaveRemark}
                onChange={e => setEditLeaveRemark(e.target.value)}
                placeholder="Additional details..."
                className="mt-1 text-xs h-16"
              />
            </div>

            <DialogFooter>
              <Button variant="outline" size="sm" type="button" onClick={() => setEditingLeave(null)}>
                Cancel
              </Button>
              <Button size="sm" type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold">
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
