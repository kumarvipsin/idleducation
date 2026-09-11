'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useAttendance } from '@/context/attendance-context';
import {
  GraduationCap,
  Calendar,
  Clock,
  Send,
  Download,
  Share2,
  Printer,
  CheckCircle2,
  XCircle,
  PlaneTakeoff,
  PhoneCall,
  FileText,
  BookOpen,
  ArrowLeft,
  ChevronRight,
  TrendingUp,
  AlertCircle,
  Eye,
  Check,
  Building,
  ArrowRightLeft,
  History,
  MapPin,
  Mail,
  Phone,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  AMAN_KUMAR_HISTORY,
  AMAN_KUMAR_SUBJECT_STATS,
  TStudentHistoryRecord,
} from '@/lib/attendance-store';

export default function StudentProfilePage() {
  const params = useParams();
  const { students, batches, absentFollowUps, leaveRequests, transferStudentBatch } = useAttendance();

  const studentId = (params?.id as string) || 's-9a-7';
  const student = students.find(s => s.id === studentId) || {
    id: 's-9a-7',
    name: 'Aman Kumar',
    rollNo: 12,
    className: '9th',
    batchName: '9A',
    admissionDate: '10 Aug 2026',
    status: 'active' as const,
    parentPhone: '+91 99110 20006',
    parentName: 'Ramesh Kumar (Father)',
    phone: '+91 98110 10006',
    address: 'Civil Lines, Delhi',
    dob: '15 May 2011',
    notes: '',
    batchHistory: [],
  };

  const [activeTab, setActiveTab] = useState('overview');
  const [dateFilter, setDateFilter] = useState('this_month');
  const [fromDate, setFromDate] = useState('01 Sep 2026');
  const [toDate, setToDate] = useState('30 Sep 2026');

  // Selected record modal
  const [selectedRecord, setSelectedRecord] = useState<TStudentHistoryRecord | null>(null);

  // Parent Report Modal
  const [isParentReportOpen, setIsParentReportOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  // Batch Transfer modal
  const [isTransferOpen, setIsTransferOpen] = useState(false);
  const [transferTargetBatch, setTransferTargetBatch] = useState('');
  const [transferEffectiveDate, setTransferEffectiveDate] = useState('2026-09-12');
  const [transferReason, setTransferReason] = useState('Requested by parent for evening slot');

  // Student call logs & leaves
  const studentCalls = absentFollowUps.filter(f => f.studentId === student.id);
  const studentLeaves = leaveRequests.filter(l => l.studentId === student.id);

  const handleTransferSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!transferTargetBatch) {
      alert('Please select a target batch.');
      return;
    }
    transferStudentBatch(student.id, transferTargetBatch, transferEffectiveDate, transferReason);
    setIsTransferOpen(false);
  };

  const handleShareWhatsApp = () => {
    const text = `*IDL EDUCATION - Student Attendance Report*\nStudent: ${student.name} (${student.className}, Batch ${student.batchName})\nAttendance: 84.4%\nAttended: 46 Hours | Missed: 8 Hours\n\nLearn Today, Lead Tomorrow.`;
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Back Link */}
      <div>
        <Link
          href="/admin/attendance/students"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Student Directory
        </Link>
      </div>

      {/* Student Profile Banner (Exact Match from Reference Panel 4) */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-2xl bg-gradient-to-tr from-blue-700 via-indigo-600 to-sky-500 text-white font-black text-xl flex items-center justify-center shadow-md">
            {student.name.slice(0, 2).toUpperCase()}
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
                {student.name}
              </h1>
              <Badge className="bg-emerald-50 text-emerald-700 border-emerald-300 font-bold text-xs">
                ● Active
              </Badge>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 font-medium">
              <span>
                Class: <strong className="text-slate-800">{student.className}</strong>
              </span>
              <span>•</span>
              <span>
                Batch: <strong className="text-blue-700">{student.batchName}</strong>
              </span>
              <span>•</span>
              <span>
                Roll No: <strong className="text-slate-800">{student.rollNo}</strong>
              </span>
              <span>•</span>
              <span>
                Admission: <strong className="text-slate-800">{student.admissionDate}</strong>
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            onClick={() => setIsTransferOpen(true)}
            className="border-slate-300 text-slate-700 font-bold text-xs h-10 px-3.5 gap-1.5 hover:bg-slate-50"
          >
            <ArrowRightLeft className="h-3.5 w-3.5 text-blue-600" />
            Transfer Batch
          </Button>
          <Button
            onClick={() => setIsParentReportOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs h-10 px-4 gap-2 shadow-sm"
          >
            <Send className="h-3.5 w-3.5" />
            Send Report to Parent
          </Button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-slate-200">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-transparent p-0 h-auto gap-4">
            <TabsTrigger
              value="overview"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 text-xs font-bold pb-2.5 px-1 shadow-none"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="attendance"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 text-xs font-bold pb-2.5 px-1 shadow-none"
            >
              Attendance History
            </TabsTrigger>
            <TabsTrigger
              value="subject_wise"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 text-xs font-bold pb-2.5 px-1 shadow-none"
            >
              Subject-wise
            </TabsTrigger>
            <TabsTrigger
              value="leave_history"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 text-xs font-bold pb-2.5 px-1 shadow-none"
            >
              Leave History
            </TabsTrigger>
            <TabsTrigger
              value="call_log"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 text-xs font-bold pb-2.5 px-1 shadow-none"
            >
              Call Log ({studentCalls.length})
            </TabsTrigger>
            <TabsTrigger
              value="documents"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 text-xs font-bold pb-2.5 px-1 shadow-none"
            >
              Documents
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Date Filters Bar (Panel 4) */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500 font-semibold">From:</span>
            <Input
              value={fromDate}
              onChange={e => setFromDate(e.target.value)}
              className="h-8 w-32 text-xs font-medium font-mono"
            />
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500 font-semibold">To:</span>
            <Input
              value={toDate}
              onChange={e => setToDate(e.target.value)}
              className="h-8 w-32 text-xs font-medium font-mono"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant={dateFilter === 'this_month' ? 'default' : 'outline'}
            onClick={() => {
              setDateFilter('this_month');
              setFromDate('01 Sep 2026');
              setToDate('30 Sep 2026');
            }}
            className={`text-xs font-bold h-8 ${dateFilter === 'this_month' ? 'bg-blue-600 text-white' : 'border-slate-300'}`}
          >
            This Month
          </Button>
          <Button
            size="sm"
            variant={dateFilter === 'last_month' ? 'default' : 'outline'}
            onClick={() => {
              setDateFilter('last_month');
              setFromDate('01 Aug 2026');
              setToDate('31 Aug 2026');
            }}
            className={`text-xs font-bold h-8 ${dateFilter === 'last_month' ? 'bg-blue-600 text-white' : 'border-slate-300'}`}
          >
            Last Month
          </Button>
          <Button
            size="sm"
            variant={dateFilter === 'custom' ? 'default' : 'outline'}
            onClick={() => setDateFilter('custom')}
            className={`text-xs font-bold h-8 ${dateFilter === 'custom' ? 'bg-blue-600 text-white' : 'border-slate-300'}`}
          >
            Custom Range
          </Button>
        </div>
      </div>

      {/* Metric Cards Row (Panel 4 Reference) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Total Classes</span>
          <span className="text-2xl font-black text-slate-900 mt-1 block">32</span>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs border-l-4 border-l-emerald-500">
          <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">Present</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-black text-emerald-600">27</span>
            <span className="text-[11px] font-bold text-emerald-700">(84.4%)</span>
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs border-l-4 border-l-rose-500">
          <span className="text-[10px] font-bold text-rose-700 uppercase tracking-wider block">Absent</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-black text-rose-600">3</span>
            <span className="text-[11px] font-bold text-rose-700">(9.4%)</span>
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs border-l-4 border-l-amber-500">
          <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider block">Leave</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-black text-amber-600">2</span>
            <span className="text-[11px] font-bold text-amber-700">(6.2%)</span>
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Scheduled</span>
          <span className="text-2xl font-black text-slate-900 mt-1 block">54h</span>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">Attended</span>
          <span className="text-2xl font-black text-emerald-600 mt-1 block">46h</span>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs col-span-2 sm:col-span-1">
          <span className="text-[10px] font-bold text-rose-700 uppercase tracking-wider block">Missed</span>
          <span className="text-2xl font-black text-rose-600 mt-1 block">8h</span>
        </div>
      </div>

      {/* Main Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Personal Details */}
            <Card className="border-slate-200 shadow-xs">
              <CardHeader className="p-4 border-b border-slate-100">
                <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-blue-600" />
                  Personal &amp; Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-2.5 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Student Phone</span>
                  <span className="font-semibold text-slate-800">{student.phone || 'N/A'}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Parent / Guardian Name</span>
                  <span className="font-semibold text-slate-800">{student.parentName || 'N/A'}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Parent Contact Phone</span>
                  <span className="font-semibold text-slate-800">{student.parentPhone || 'N/A'}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Date of Birth</span>
                  <span className="font-semibold text-slate-800">{student.dob || '15 May 2011'}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Residential Address</span>
                  <span className="font-semibold text-slate-800">{student.address || 'Civil Lines, Delhi'}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Enrolment Status</span>
                  <Badge className="bg-emerald-50 text-emerald-700 border-emerald-300 text-[10px] font-bold">
                    Active Student
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Academic & Batch Information */}
            <Card className="border-slate-200 shadow-xs">
              <CardHeader className="p-4 border-b border-slate-100 flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Building className="h-4 w-4 text-purple-600" />
                  Current Class &amp; Batch Assignment
                </CardTitle>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setIsTransferOpen(true)}
                  className="h-7 text-xs font-semibold gap-1 text-blue-600 border-blue-200 hover:bg-blue-50"
                >
                  <ArrowRightLeft className="h-3 w-3" />
                  Transfer Batch
                </Button>
              </CardHeader>
              <CardContent className="p-4 space-y-2.5 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Academic Class</span>
                  <span className="font-bold text-slate-800">{student.className}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Assigned Batch</span>
                  <span className="font-black text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    Batch {student.batchName}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Roll Number</span>
                  <span className="font-bold text-slate-800">#{student.rollNo}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Admission Date</span>
                  <span className="font-semibold text-slate-800">{student.admissionDate}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Total Recorded Sessions</span>
                  <span className="font-bold text-slate-800">32 Classes</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Batch Transfer History Card */}
          <Card className="border-slate-200 shadow-xs">
            <CardHeader className="p-4 border-b border-slate-100">
              <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <History className="h-4 w-4 text-blue-600" />
                Batch Transfer &amp; Enrolment Audit History
              </CardTitle>
              <CardDescription className="text-xs">
                Historical record of student batch movements. Note: Past attendance records permanently remain under the batch in which they were taken.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0 overflow-x-auto text-xs">
              {(!student.batchHistory || student.batchHistory.length === 0) ? (
                <div className="p-4 text-center text-slate-500 italic">
                  Initial enrollment in Batch {student.batchName}. No subsequent batch transfers recorded.
                </div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 text-[11px] uppercase tracking-wider">
                      <th className="py-2.5 px-4">Effective Date</th>
                      <th className="py-2.5 px-3">From Batch</th>
                      <th className="py-2.5 px-3">To Batch</th>
                      <th className="py-2.5 px-4">Transfer Reason</th>
                      <th className="py-2.5 px-3">Processed By</th>
                      <th className="py-2.5 px-3">Logged At</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {student.batchHistory.map((bh, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/70">
                        <td className="py-2.5 px-4 font-mono font-bold text-blue-700">{bh.effectiveDate}</td>
                        <td className="py-2.5 px-3 font-semibold text-slate-600">Batch {bh.fromBatchName}</td>
                        <td className="py-2.5 px-3 font-black text-emerald-700">Batch {bh.toBatchName}</td>
                        <td className="py-2.5 px-4 text-slate-700">{bh.reason}</td>
                        <td className="py-2.5 px-3 text-slate-600">{bh.transferredBy}</td>
                        <td className="py-2.5 px-3 text-slate-500 text-[11px]">{bh.transferredAt}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Tab Content */}
      {activeTab === 'attendance' && (
        <Card className="border-slate-200 shadow-sm overflow-hidden">
          <CardHeader className="p-4 sm:p-5 border-b border-slate-100 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-sm font-bold text-slate-900">
                Attendance Records ({AMAN_KUMAR_HISTORY.length} Sessions)
              </CardTitle>
              <CardDescription className="text-xs text-slate-500">
                Exact check-in, check-out, attended hours and absence remarks
              </CardDescription>
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              Overall: 84.4%
            </span>
          </CardHeader>

          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 text-[11px] uppercase tracking-wider">
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Subject</th>
                  <th className="py-3 px-4">Time</th>
                  <th className="py-3 px-3">Duration</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3">Missed</th>
                  <th className="py-3 px-4">Reason / Remark</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {AMAN_KUMAR_HISTORY.map(row => {
                  const isPresent = row.status === 'Present';
                  const isAbsent = row.status === 'Absent';
                  const isLeave = row.status === 'Leave';

                  return (
                    <tr
                      key={row.id}
                      onClick={() => setSelectedRecord(row)}
                      className="hover:bg-slate-50 cursor-pointer transition-colors"
                    >
                      <td className="py-3 px-4 font-mono font-semibold text-slate-800">
                        {row.date}
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-900">{row.subject}</td>
                      <td className="py-3 px-4 font-mono text-slate-600">{row.scheduledTime}</td>
                      <td className="py-3 px-3 font-semibold text-slate-700">{row.duration}</td>
                      <td className="py-3 px-3">
                        {isPresent && (
                          <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 font-bold text-[10px]">
                            Present
                          </Badge>
                        )}
                        {isAbsent && (
                          <Badge className="bg-rose-50 text-rose-700 border-rose-200 font-bold text-[10px]">
                            Absent
                          </Badge>
                        )}
                        {isLeave && (
                          <Badge className="bg-amber-50 text-amber-700 border-amber-200 font-bold text-[10px]">
                            Leave
                          </Badge>
                        )}
                      </td>
                      <td className="py-3 px-3 font-mono font-semibold">
                        {row.missed !== '0h' && row.missed !== '0m' ? (
                          <span className="text-rose-600 font-bold">{row.missed}</span>
                        ) : (
                          <span className="text-slate-400">0h</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        {row.reason || <span className="text-slate-300">-</span>}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-blue-600 hover:text-blue-800 font-semibold text-xs h-7 px-2"
                        >
                          View
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}

      {/* Subject-Wise Tab */}
      {activeTab === 'subject_wise' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {AMAN_KUMAR_SUBJECT_STATS.map(sub => (
            <Card key={sub.subject} className="border-slate-200 shadow-xs">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-slate-900">{sub.subject}</span>
                  <Badge
                    className={`font-bold text-xs ${
                      sub.attendancePercent >= 90
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : sub.attendancePercent >= 75
                        ? 'bg-blue-50 text-blue-700 border-blue-200'
                        : 'bg-rose-50 text-rose-700 border-rose-200'
                    }`}
                  >
                    {sub.attendancePercent}%
                  </Badge>
                </div>

                <div className="w-full bg-slate-100 h-2 rounded-full mt-3 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      sub.attendancePercent >= 90 ? 'bg-emerald-500' : 'bg-blue-600'
                    }`}
                    style={{ width: `${sub.attendancePercent}%` }}
                  />
                </div>

                <div className="grid grid-cols-3 gap-2 mt-4 text-center text-xs">
                  <div className="p-2 rounded-lg bg-slate-50">
                    <span className="text-[10px] text-slate-500 block">Total Hours</span>
                    <span className="font-bold text-slate-800">{sub.totalHours}h</span>
                  </div>
                  <div className="p-2 rounded-lg bg-emerald-50/60">
                    <span className="text-[10px] text-emerald-700 block">Attended</span>
                    <span className="font-bold text-emerald-700">{sub.attendedHours}h</span>
                  </div>
                  <div className="p-2 rounded-lg bg-rose-50/60">
                    <span className="text-[10px] text-rose-700 block">Missed</span>
                    <span className="font-bold text-rose-700">{sub.missedHours}h</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Leave History Tab */}
      {activeTab === 'leave_history' && (
        <Card className="border-slate-200 shadow-sm overflow-hidden">
          <CardHeader className="p-4 border-b border-slate-100">
            <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <PlaneTakeoff className="h-4 w-4 text-amber-600" />
              Leave Applications &amp; Excused Absences ({studentLeaves.length})
            </CardTitle>
            <CardDescription className="text-xs">
              Pre-informed leave requests and medical certificates recorded for this student.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0 overflow-x-auto text-xs">
            {studentLeaves.length === 0 ? (
              <div className="p-4 text-center text-slate-500 italic">
                No leave applications recorded for {student.name}.
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 text-[11px] uppercase tracking-wider">
                    <th className="py-2.5 px-4">Date</th>
                    <th className="py-2.5 px-3">Reason</th>
                    <th className="py-2.5 px-3">Informed By</th>
                    <th className="py-2.5 px-4">Remarks</th>
                    <th className="py-2.5 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {studentLeaves.map(leave => (
                    <tr key={leave.id} className="hover:bg-slate-50">
                      <td className="py-2.5 px-4 font-mono font-bold text-slate-900">{leave.date}</td>
                      <td className="py-2.5 px-3 font-semibold text-slate-800">{leave.reason}</td>
                      <td className="py-2.5 px-3 text-slate-600">{leave.informedBy}</td>
                      <td className="py-2.5 px-4 text-slate-600">{leave.remark || '—'}</td>
                      <td className="py-2.5 px-3">
                        <Badge
                          className={`text-[10px] font-bold ${
                            leave.status === 'Approved'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : leave.status === 'Pending'
                              ? 'bg-amber-50 text-amber-700 border-amber-200'
                              : 'bg-rose-50 text-rose-700 border-rose-200'
                          }`}
                        >
                          {leave.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </CardContent>
        </Card>
      )}

      {/* Call Log Tab */}
      {activeTab === 'call_log' && (
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="p-4 border-b border-slate-100">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <PhoneCall className="h-4 w-4 text-blue-600" />
              Permanent Communication &amp; Follow-up History
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-3">
            {studentCalls.length === 0 ? (
              <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-600">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">03 Sep 2026 • 06:15 PM</span>
                  <Badge className="bg-emerald-50 text-emerald-700 text-[10px]">Contacted</Badge>
                </div>
                <p className="mt-1 text-slate-700">
                  <strong>Spoke To:</strong> Father (Ramesh Kumar)
                </p>
                <p className="text-slate-600">
                  <strong>Reason:</strong> Student was having high fever.
                </p>
                <p className="text-slate-500 italic text-[11px] mt-0.5">
                  <strong>Remark:</strong> Father confirmed Aman will be back on Friday.
                </p>
              </div>
            ) : (
              studentCalls.map(c => (
                <div key={c.id} className="p-3 bg-slate-50 rounded-xl text-xs border border-slate-100">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{c.date}</span>
                    <Badge className="bg-blue-50 text-blue-700 text-[10px]">{c.callStatus}</Badge>
                  </div>
                  <p className="mt-1">
                    <strong>Spoke To:</strong> {c.spokeTo || 'Father'}
                  </p>
                  <p className="text-slate-600">
                    <strong>Reason:</strong> {c.parentReason || 'Fever'}
                  </p>
                  <p className="text-slate-500 italic text-[11px] mt-0.5">
                    <strong>Remark:</strong> {c.remark || 'Logged in system.'}
                  </p>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      )}

      {/* Record Details Modal */}
      <Dialog open={!!selectedRecord} onOpenChange={open => !open && setSelectedRecord(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-sm font-bold">Class Attendance Details</DialogTitle>
            <DialogDescription className="text-xs">
              {student.name} • {selectedRecord?.date}
            </DialogDescription>
          </DialogHeader>

          {selectedRecord && (
            <div className="space-y-3 py-2 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg space-y-1.5 border border-slate-100">
                <div className="flex justify-between">
                  <span className="text-slate-500">Subject:</span>
                  <span className="font-bold text-slate-800">{selectedRecord.subject}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Scheduled Time:</span>
                  <span className="font-mono text-slate-800">{selectedRecord.scheduledTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Check-in Time:</span>
                  <span className="font-mono font-bold text-emerald-600">{selectedRecord.checkIn}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Check-out Time:</span>
                  <span className="font-mono font-bold text-purple-600">{selectedRecord.checkOut}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Attended Time:</span>
                  <span className="font-bold text-slate-900">{selectedRecord.attended}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Missed Time:</span>
                  <span className="font-bold text-rose-600">{selectedRecord.missed}</span>
                </div>
                {selectedRecord.reason && (
                  <div className="pt-2 border-t border-slate-200">
                    <span className="text-slate-500 block">Reason:</span>
                    <span className="font-medium text-slate-800">{selectedRecord.reason}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button size="sm" variant="outline" onClick={() => setSelectedRecord(null)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Parent-Friendly Report Modal (Requirement #23) */}
      <Dialog open={isParentReportOpen} onOpenChange={setIsParentReportOpen}>
        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              <FileText className="h-4 w-4 text-blue-600" />
              Parent Attendance Report
            </DialogTitle>
            <DialogDescription className="text-xs">
              Clean, professional report formatted for parents.
            </DialogDescription>
          </DialogHeader>

          {/* Printable Report Canvas */}
          <div className="p-6 bg-white border border-slate-200 rounded-xl space-y-4 text-xs shadow-xs font-sans">
            {/* Institute Header */}
            <div className="flex items-center justify-between pb-3 border-b-2 border-slate-900">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-lg bg-blue-600 text-white font-black text-xs flex items-center justify-center">
                  IDL
                </div>
                <div>
                  <h3 className="font-black text-sm text-slate-900 tracking-tight">IDL EDUCATION</h3>
                  <p className="text-[10px] text-blue-600 font-semibold">Learn Today, Lead Tomorrow</p>
                </div>
              </div>
              <div className="text-right">
                <span className="font-bold text-slate-800 block">Student Progress &amp; Attendance</span>
                <span className="text-[10px] text-slate-500 font-mono">Date: 11 Sep 2026</span>
              </div>
            </div>

            {/* Student Info Box */}
            <div className="bg-slate-50 p-3 rounded-lg grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
              <div>
                <span className="text-slate-500 block text-[10px]">Student Name</span>
                <span className="font-bold text-slate-900">{student.name}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">Class &amp; Batch</span>
                <span className="font-bold text-slate-900">{student.className} ({student.batchName})</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">Roll No</span>
                <span className="font-bold text-slate-900">{student.rollNo}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">Attendance %</span>
                <span className="font-black text-emerald-600 text-sm">84.4%</span>
              </div>
            </div>

            {/* Hours Summary */}
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2 rounded-lg bg-blue-50/70 border border-blue-100">
                <span className="text-[10px] text-blue-700 block">Total Scheduled</span>
                <span className="font-black text-slate-900 text-sm">54 Hours</span>
              </div>
              <div className="p-2 rounded-lg bg-emerald-50/70 border border-emerald-100">
                <span className="text-[10px] text-emerald-700 block">Attended Hours</span>
                <span className="font-black text-emerald-700 text-sm">46 Hours</span>
              </div>
              <div className="p-2 rounded-lg bg-rose-50/70 border border-rose-100">
                <span className="text-[10px] text-rose-700 block">Missed Hours</span>
                <span className="font-black text-rose-700 text-sm">8 Hours</span>
              </div>
            </div>

            {/* Subject Breakdown */}
            <div>
              <h4 className="font-bold text-slate-900 text-[11px] mb-2 uppercase tracking-wider">
                Subject-Wise Attendance Breakdown
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {AMAN_KUMAR_SUBJECT_STATS.map(s => (
                  <div key={s.subject} className="flex items-center justify-between p-2 rounded bg-slate-50 border border-slate-100">
                    <span className="font-medium text-slate-800">{s.subject}</span>
                    <span className="font-black text-slate-900">{s.attendancePercent}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Absences */}
            <div>
              <h4 className="font-bold text-slate-900 text-[11px] mb-1 uppercase tracking-wider">
                Recent Absences &amp; Reasons
              </h4>
              <div className="space-y-1.5 text-[11px]">
                <div className="p-2 rounded bg-rose-50/50 border border-rose-100 flex justify-between">
                  <span>03 Sep 2026 • Science (1h)</span>
                  <span className="font-semibold text-rose-700">Fever (Father informed)</span>
                </div>
                <div className="p-2 rounded bg-amber-50/50 border border-amber-100 flex justify-between">
                  <span>04 Sep 2026 • Mathematics (2h)</span>
                  <span className="font-semibold text-amber-700">Family function (Leave)</span>
                </div>
              </div>
            </div>

            {/* Signature & Stamp */}
            <div className="pt-4 border-t border-slate-200 flex justify-between items-end text-[10px] text-slate-500">
              <div>
                <p className="font-bold text-slate-800">Amod Sharma</p>
                <p>Academic Director, IDL Education</p>
              </div>
              <div className="text-right italic">
                Verified Institute Digital Record
              </div>
            </div>
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.print()}
              className="text-xs font-semibold gap-1.5"
            >
              <Printer className="h-3.5 w-3.5" />
              Print
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleShareWhatsApp}
              className="text-xs font-semibold gap-1.5"
            >
              <Share2 className="h-3.5 w-3.5" />
              {isCopied ? 'Copied WhatsApp Text!' : 'Share WhatsApp'}
            </Button>
            <Button
              size="sm"
              onClick={() => window.print()}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs gap-1.5"
            >
              <Download className="h-3.5 w-3.5" />
              Download PDF
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Transfer Batch Modal */}
      <Dialog open={isTransferOpen} onOpenChange={setIsTransferOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              <ArrowRightLeft className="h-4 w-4 text-blue-600" />
              <span>Transfer Student to Different Batch</span>
            </DialogTitle>
            <DialogDescription className="text-xs">
              Transfer <strong>{student.name}</strong> from current batch <strong>{student.batchName}</strong> to another batch.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleTransferSubmit} className="space-y-3.5 py-2 text-xs">
            <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-200/70 text-blue-900 text-xs">
              <span className="font-bold block">Historical Attendance Guarantee:</span>
              <p className="text-[11px] text-blue-800/90 mt-0.5">
                Previous attendance records remain preserved under former Batch {student.batchName}. Future attendance will count under the new batch starting from the effective date.
              </p>
            </div>

            <div>
              <Label className="text-xs font-semibold">Select Target Batch</Label>
              <Select value={transferTargetBatch} onValueChange={setTransferTargetBatch}>
                <SelectTrigger className="mt-1 h-9 text-xs">
                  <SelectValue placeholder="Choose batch..." />
                </SelectTrigger>
                <SelectContent>
                  {batches
                    .filter(b => b.name !== student.batchName)
                    .map(b => (
                      <SelectItem key={b.id} value={b.name}>
                        {b.className} - Batch {b.name} ({b.room})
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-xs font-semibold">Effective Date</Label>
              <Input
                type="date"
                value={transferEffectiveDate}
                onChange={e => setTransferEffectiveDate(e.target.value)}
                className="mt-1 h-9 text-xs"
                required
              />
            </div>

            <div>
              <Label className="text-xs font-semibold">Reason for Batch Transfer</Label>
              <Textarea
                value={transferReason}
                onChange={e => setTransferReason(e.target.value)}
                placeholder="e.g. Schedule clash, requested morning batch, parent request..."
                className="mt-1 text-xs h-16"
                required
              />
            </div>

            <DialogFooter>
              <Button variant="outline" size="sm" type="button" onClick={() => setIsTransferOpen(false)}>
                Cancel
              </Button>
              <Button size="sm" type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold gap-1.5">
                <ArrowRightLeft className="h-3.5 w-3.5" />
                Confirm Transfer
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
