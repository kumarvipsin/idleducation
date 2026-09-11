'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAttendance } from '@/context/attendance-context';
import {
  BarChart3,
  Calendar,
  Download,
  Share2,
  Printer,
  FileSpreadsheet,
  TrendingUp,
  Filter,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  PlaneTakeoff,
  Users,
  Clock,
  Sparkles,
  Search,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from 'recharts';

const MONTHLY_TREND = [
  { day: '1 Sep', percent: 84 },
  { day: '5 Sep', percent: 87 },
  { day: '10 Sep', percent: 89 },
  { day: '15 Sep', percent: 85 },
  { day: '20 Sep', percent: 88 },
  { day: '25 Sep', percent: 86 },
  { day: '30 Sep', percent: 91 },
];

const SUBJECT_ATTENDANCE_DATA = [
  { subject: 'Maths', percent: 88, color: '#2563eb' },
  { subject: 'Science', percent: 82, color: '#0284c7' },
  { subject: 'English', percent: 93, color: '#16a34a' },
  { subject: 'SST', percent: 85, color: '#7c3aed' },
  { subject: 'Hindi', percent: 76, color: '#f59e0b' },
];

const RANKED_STUDENTS = [
  { rank: 1, name: 'Bhavya Singh', batch: '9A', attendance: 97.2, status: 'high' },
  { rank: 2, name: 'Aarav Sharma', batch: '9A', attendance: 95.8, status: 'high' },
  { rank: 3, name: 'Sakshi Gupta', batch: '9A', attendance: 93.5, status: 'high' },
  { rank: 4, name: 'Aman Kumar', batch: '9A', attendance: 84.4, status: 'normal' },
  { rank: 5, name: 'Rohan Verma', batch: '9A', attendance: 82.1, status: 'normal' },
  { rank: 6, name: 'Karan Mehta', batch: '9A', attendance: 73.0, status: 'low' },
  { rank: 7, name: 'Mohit Verma', batch: '9A', attendance: 71.5, status: 'low' },
];

export default function ReportsPage() {
  const { classes, batches } = useAttendance();

  const [period, setPeriod] = useState('monthly');
  const [selectedMonth, setSelectedMonth] = useState('September 2026');
  const [selectedClass, setSelectedClass] = useState('9th');
  const [selectedBatch, setSelectedBatch] = useState('all');
  const [selectedSubject, setSelectedSubject] = useState('all');

  const [isGenerating, setIsGenerating] = useState(false);
  const [reportGenerated, setReportGenerated] = useState(true);

  const handleGenerateReport = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setReportGenerated(true);
    }, 400);
  };

  const handleExportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Rank,Student Name,Batch,Attendance %,Status\n"
      + RANKED_STUDENTS.map(s => `${s.rank},${s.name},${s.batch},${s.attendance}%,${s.status}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `IDL_Attendance_Report_${selectedClass}_${selectedMonth}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl md:text-2xl font-black tracking-tight text-slate-900">
              Attendance Report &amp; Analytics
            </h1>
            <Badge className="bg-purple-50 text-purple-700 border-purple-200 font-bold text-xs">
              Reports Hub
            </Badge>
          </div>
          <p className="text-xs md:text-sm text-slate-500 mt-1 font-medium">
            Generate detailed attendance reports for students, classes or batches with parent PDF export.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={() => window.print()}
            variant="outline"
            className="text-xs font-semibold h-9 gap-1.5 border-slate-300"
          >
            <Printer className="h-3.5 w-3.5" />
            Print Report
          </Button>
        </div>
      </div>

      {/* Granularity Tabs (Panel 6 Reference) */}
      <div className="flex items-center justify-between">
        <Tabs value={period} onValueChange={setPeriod}>
          <TabsList className="bg-slate-200/70 p-1 rounded-xl">
            <TabsTrigger value="daily" className="text-xs font-bold rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
              Daily
            </TabsTrigger>
            <TabsTrigger value="weekly" className="text-xs font-bold rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
              Weekly
            </TabsTrigger>
            <TabsTrigger value="monthly" className="text-xs font-bold rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
              Monthly
            </TabsTrigger>
            <TabsTrigger value="custom" className="text-xs font-bold rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
              Custom Range
            </TabsTrigger>
            <TabsTrigger value="yearly" className="text-xs font-bold rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
              Yearly
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Filter Parameters Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 flex-1">
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Month / Period
            </span>
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger className="h-9 text-xs font-semibold">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="September 2026">September 2026</SelectItem>
                <SelectItem value="August 2026">August 2026</SelectItem>
                <SelectItem value="July 2026">July 2026</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Class
            </span>
            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger className="h-9 text-xs font-semibold">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {classes.map(c => (
                  <SelectItem key={c.id} value={c.name}>
                    Class {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Batch
            </span>
            <Select value={selectedBatch} onValueChange={setSelectedBatch}>
              <SelectTrigger className="h-9 text-xs font-semibold">
                <SelectValue />
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

          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Subject
            </span>
            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
              <SelectTrigger className="h-9 text-xs font-semibold">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subjects</SelectItem>
                <SelectItem value="Mathematics">Mathematics</SelectItem>
                <SelectItem value="Science">Science</SelectItem>
                <SelectItem value="English">English</SelectItem>
                <SelectItem value="SST">Social Science</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="self-end lg:self-center">
          <Button
            onClick={handleGenerateReport}
            disabled={isGenerating}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs h-9 px-5 shadow-sm"
          >
            {isGenerating ? 'Generating...' : '+ Generate Report'}
          </Button>
        </div>
      </div>

      {/* Aggregated Stat Cards (Exact match from Panel 6 Reference) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Total Students</span>
          <span className="text-2xl font-black text-slate-900 mt-1 block">45</span>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Total Classes</span>
          <span className="text-2xl font-black text-slate-900 mt-1 block">62</span>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs border-l-4 border-l-emerald-500">
          <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">Present</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-black text-emerald-600">523</span>
            <span className="text-[10px] font-bold text-emerald-700">(85.6%)</span>
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs border-l-4 border-l-rose-500">
          <span className="text-[10px] font-bold text-rose-700 uppercase tracking-wider block">Absent</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-black text-rose-600">62</span>
            <span className="text-[10px] font-bold text-rose-700">(10.1%)</span>
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs border-l-4 border-l-amber-500">
          <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider block">Leave</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-black text-amber-600">26</span>
            <span className="text-[10px] font-bold text-amber-700">(4.3%)</span>
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs col-span-2 sm:col-span-1">
          <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider block">Total Hours</span>
          <span className="text-2xl font-black text-blue-900 mt-1 block">124h</span>
        </div>
      </div>

      {/* Two Charts Grid (Attendance Trend & Subject-Wise Attendance) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attendance Trend Chart */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="p-4 sm:p-5 border-b border-slate-100 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-sm font-bold text-slate-900">
                Attendance Trend
              </CardTitle>
              <CardDescription className="text-xs text-slate-500">
                Weekly fluctuation of student presence rate
              </CardDescription>
            </div>
            <span className="text-xs font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
              85.6% Avg
            </span>
          </CardHeader>
          <CardContent className="p-4 pt-6">
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={MONTHLY_TREND} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="reportAtt" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <YAxis domain={[50, 100]} tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} unit="%" />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-slate-900 text-white p-2 rounded-lg text-xs shadow-lg">
                            <p className="font-bold">{label}</p>
                            <p className="text-emerald-400 font-semibold">{payload[0].value}% Attendance</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="percent"
                    stroke="#2563eb"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#reportAtt)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Subject-Wise Attendance Bar Chart */}
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="p-4 sm:p-5 border-b border-slate-100 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-sm font-bold text-slate-900">
                Subject-wise Attendance
              </CardTitle>
              <CardDescription className="text-xs text-slate-500">
                Identify which subjects students are missing most
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-6">
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={SUBJECT_ATTENDANCE_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="subject" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <YAxis domain={[50, 100]} tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} unit="%" />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-slate-900 text-white p-2 rounded-lg text-xs shadow-lg">
                            <p className="font-bold">{label}</p>
                            <p className="text-blue-400 font-semibold">{payload[0].value}% Average</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="percent" radius={[6, 6, 0, 0]}>
                    {SUBJECT_ATTENDANCE_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Student Attendance Ranking Table (Highest & Lowest with <75% Threshold Alert) */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="p-4 sm:p-5 border-b border-slate-100 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-sm font-bold text-slate-900">
              Student Attendance Ranking &amp; Threshold Alerts
            </CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Students highlighted in red are below the 75% required attendance threshold
            </CardDescription>
          </div>
          <Badge className="bg-rose-50 text-rose-700 border-rose-200 text-xs font-bold">
            2 Below 75%
          </Badge>
        </CardHeader>

        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 text-[11px] uppercase tracking-wider">
                <th className="py-3 px-4 w-16">Rank</th>
                <th className="py-3 px-4">Student Name</th>
                <th className="py-3 px-3">Batch</th>
                <th className="py-3 px-4">Attendance Rate</th>
                <th className="py-3 px-4">Threshold Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {RANKED_STUDENTS.map(st => {
                const isBelowThreshold = st.attendance < 75;
                return (
                  <tr
                    key={st.name}
                    className={`hover:bg-slate-50 transition-colors ${
                      isBelowThreshold ? 'bg-rose-50/40' : ''
                    }`}
                  >
                    <td className="py-3 px-4 font-black text-slate-700 font-mono">
                      #{st.rank}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900">
                      {st.name}
                    </td>
                    <td className="py-3 px-3 font-semibold text-blue-700">{st.batch}</td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">
                      {st.attendance}%
                    </td>
                    <td className="py-3 px-4">
                      {isBelowThreshold ? (
                        <Badge className="bg-rose-100 text-rose-800 border-rose-300 font-bold text-[10px] gap-1">
                          <AlertTriangle className="h-3 w-3" />
                          Critical: Below 75%
                        </Badge>
                      ) : (
                        <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 font-bold text-[10px]">
                          ✓ Compliant
                        </Badge>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Link href="/admin/attendance/students/s-9a-7">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-blue-600 hover:text-blue-800 font-semibold text-xs h-7 px-2"
                        >
                          View History
                        </Button>
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Action Footer Buttons (Panel 6 Reference) */}
      <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
        <Button
          onClick={() => window.print()}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs h-9 px-4 gap-1.5 shadow-sm"
        >
          <Download className="h-3.5 w-3.5" />
          Download PDF
        </Button>

        <Button
          onClick={() => {
            alert('Parent PDF report link generated and ready to send via WhatsApp / SMS.');
          }}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs h-9 px-4 gap-1.5 shadow-sm"
        >
          <Share2 className="h-3.5 w-3.5" />
          Share with Parent (PDF)
        </Button>

        <Button
          variant="outline"
          onClick={handleExportCSV}
          className="text-xs font-bold h-9 px-4 gap-1.5 border-slate-300"
        >
          <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-600" />
          Export Excel / CSV
        </Button>

        <Button
          variant="outline"
          onClick={() => window.print()}
          className="text-xs font-bold h-9 px-4 gap-1.5 border-slate-300"
        >
          <Printer className="h-3.5 w-3.5" />
          Print Report
        </Button>
      </div>
    </div>
  );
}
