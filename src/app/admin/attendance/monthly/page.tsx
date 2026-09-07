'use client';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import {
  CalendarDays, ChevronLeft, ChevronRight, CheckCircle2, XCircle,
  Clock, Users, Printer, ArrowLeft, TrendingUp, Phone, Download
} from 'lucide-react';
import { getAttendanceClasses, getAttendanceStudents, getClassMonthlyAttendance } from '@/app/actions/attendance';
import type { TAttendanceClass, TAttendanceStudent, TAttendanceRecord } from '@/app/actions/types';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export default function MonthlyAttendanceReportPage() {
  const [classes, setClasses] = useState<TAttendanceClass[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<string>('');
  const [currentMonthDate, setCurrentMonthDate] = useState<Date>(new Date());
  const [students, setStudents] = useState<TAttendanceStudent[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<TAttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // Drilldown modal for student details
  const [selectedStudentDetail, setSelectedStudentDetail] = useState<any | null>(null);

  // Month formatting: "YYYY-MM"
  const yearMonth = useMemo(() => {
    const y = currentMonthDate.getFullYear();
    const m = String(currentMonthDate.getMonth() + 1).padStart(2, '0');
    return `${y}-${m}`;
  }, [currentMonthDate]);

  const monthDisplayName = useMemo(() => {
    return currentMonthDate.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
  }, [currentMonthDate]);

  // Load Classes
  useEffect(() => {
    (async () => {
      const res = await getAttendanceClasses();
      if (res.success && res.data) {
        const list = res.data as TAttendanceClass[];
        const uniqueClasses: TAttendanceClass[] = [];
        const seen = new Set<string>();
        list.forEach(c => {
          if (!seen.has(c.name)) {
            seen.add(c.name);
            uniqueClasses.push(c);
          }
        });
        setClasses(uniqueClasses);
        if (uniqueClasses.length > 0) setSelectedClassId(uniqueClasses[0].id);
      }
    })();
  }, []);

  // Load monthly data
  const loadData = async () => {
    if (!selectedClassId) return;
    setLoading(true);

    const [stuRes, attRes] = await Promise.all([
      getAttendanceStudents(selectedClassId),
      getClassMonthlyAttendance(selectedClassId, yearMonth),
    ]);

    if (stuRes.success && stuRes.data) {
      setStudents(stuRes.data as TAttendanceStudent[]);
    }
    if (attRes.success && attRes.data) {
      setAttendanceRecords(attRes.data as TAttendanceRecord[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (selectedClassId) {
      loadData();
    }
  }, [selectedClassId, yearMonth]);

  const navigateMonth = (direction: number) => {
    const nextDate = new Date(currentMonthDate);
    nextDate.setMonth(nextDate.getMonth() + direction);
    setCurrentMonthDate(nextDate);
  };

  // Distinct working dates conducted this month for this class
  const workingDaysCount = useMemo(() => {
    const dates = new Set(attendanceRecords.map(r => r.sessionDate));
    return dates.size;
  }, [attendanceRecords]);

  // Total scheduled class hours
  const totalClassHoursScheduled = useMemo(() => {
    return attendanceRecords.length;
  }, [attendanceRecords]);

  // Calculations per student
  const studentMonthlyStats = useMemo(() => {
    return students.map((student, idx) => {
      const studentRecords = attendanceRecords.filter(r => r.studentId === student.id);

      // Distinct dates student came
      const attendedDates = new Set(
        studentRecords.filter(r => r.status === 'PRESENT' || r.status === 'LATE').map(r => r.sessionDate)
      );
      const daysPresent = attendedDates.size;

      // Hours attended vs missed
      const hoursAttended = studentRecords.filter(r => r.status === 'PRESENT' || r.status === 'LATE').length;
      const hoursMissed = studentRecords.filter(r => r.status === 'ABSENT').length;
      const totalHoursMarked = hoursAttended + hoursMissed;

      // Percentage
      const attendancePct = totalHoursMarked > 0 ? Math.round((hoursAttended / totalHoursMarked) * 100) : 0;

      return {
        student,
        rollNo: student.studentCode || `STU-${idx + 1}`,
        daysPresent,
        hoursAttended,
        hoursMissed,
        totalHoursMarked,
        attendancePct,
        records: studentRecords,
      };
    });
  }, [students, attendanceRecords]);

  // Overall Class Performance
  const classSummary = useMemo(() => {
    let totalPresent = 0;
    let totalMissed = 0;

    studentMonthlyStats.forEach(s => {
      totalPresent += s.hoursAttended;
      totalMissed += s.hoursMissed;
    });

    const total = totalPresent + totalMissed;
    const overallPct = total > 0 ? Math.round((totalPresent / total) * 100) : 0;

    return {
      overallPct,
      totalHoursAttended: totalPresent,
      totalHoursMissed: totalMissed,
      workingDays: workingDaysCount,
    };
  }, [studentMonthlyStats, workingDaysCount]);

  const selectedClassName = classes.find(c => c.id === selectedClassId)?.name || 'Class';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Link href="/admin/attendance" className="text-muted-foreground hover:text-slate-800">
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <CalendarDays className="h-6 w-6 text-primary" /> Monthly Attendance Report
            </h1>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Class 9th & 10th monthly organized data: total days attended, class hours taken vs missed, and percentages.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.print()}
            className="font-bold text-xs gap-1.5 h-9"
          >
            <Printer className="h-4 w-4" /> Print / PDF
          </Button>
          <Link href="/admin/attendance/mark">
            <Button size="sm" className="font-bold text-xs h-9">
              Mark Attendance
            </Button>
          </Link>
        </div>
      </div>

      {/* Class Selector & Month Navigation */}
      <Card className="border border-slate-200/80 shadow-sm rounded-2xl">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            {/* Class Switcher */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Class:</span>
              <div className="flex gap-2">
                {classes.map(cls => {
                  const isSelected = selectedClassId === cls.id;
                  return (
                    <button
                      key={cls.id}
                      type="button"
                      onClick={() => setSelectedClassId(cls.id)}
                      className={`px-4 py-2 rounded-xl font-bold text-xs transition border ${
                        isSelected
                          ? 'bg-primary text-primary-foreground border-primary shadow-sm ring-2 ring-primary/20'
                          : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      {cls.displayName || cls.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Month Navigator */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => navigateMonth(-1)}
                className="h-8 w-8 rounded-lg"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <div className="px-4 py-1.5 bg-slate-50 border rounded-lg text-xs font-extrabold text-slate-800 text-center min-w-[180px]">
                {monthDisplayName}
              </div>

              <Button
                variant="outline"
                size="icon"
                onClick={() => navigateMonth(1)}
                className="h-8 w-8 rounded-lg"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentMonthDate(new Date())}
                className="text-xs font-bold h-8 text-primary"
              >
                Current Month
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border border-slate-200/80 rounded-xl">
          <CardContent className="p-4">
            <span className="text-[11px] font-bold text-slate-500 uppercase">Monthly Attendance</span>
            <p className="text-3xl font-extrabold text-primary mt-1">{classSummary.overallPct}%</p>
            <Progress value={classSummary.overallPct} className="mt-2 h-1.5" />
          </CardContent>
        </Card>

        <Card className="border border-slate-200/80 rounded-xl">
          <CardContent className="p-4">
            <span className="text-[11px] font-bold text-slate-500 uppercase">Working Days</span>
            <p className="text-3xl font-extrabold text-slate-900 mt-1">{classSummary.workingDays}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">days sessions held in {monthDisplayName}</p>
          </CardContent>
        </Card>

        <Card className="border border-slate-200/80 rounded-xl">
          <CardContent className="p-4">
            <span className="text-[11px] font-bold text-slate-500 uppercase">Class Hours Attended</span>
            <p className="text-3xl font-extrabold text-emerald-700 mt-1">{classSummary.totalHoursAttended} <span className="text-sm font-bold text-slate-400">hrs</span></p>
            <p className="text-[11px] text-slate-400 mt-0.5">total student-hours completed</p>
          </CardContent>
        </Card>

        <Card className="border border-slate-200/80 rounded-xl">
          <CardContent className="p-4">
            <span className="text-[11px] font-bold text-slate-500 uppercase">Class Hours Missed</span>
            <p className="text-3xl font-extrabold text-red-600 mt-1">{classSummary.totalHoursMissed} <span className="text-sm font-bold text-slate-400">hrs</span></p>
            <p className="text-[11px] text-slate-400 mt-0.5">total student-hours missed</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Monthly Student-by-Student Table */}
      <Card className="border border-slate-200/80 shadow-sm rounded-2xl overflow-hidden">
        <CardHeader className="pb-3 border-b bg-slate-50/50">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold text-slate-800">
                {selectedClassName} — Monthly Attendance Register ({monthDisplayName})
              </CardTitle>
              <CardDescription className="text-xs">
                Comprehensive summary per student: days attended, hours taken vs missed, and attendance rate.
              </CardDescription>
            </div>
            <Badge variant="outline" className="font-bold text-xs">
              {students.length} Students
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="p-0 overflow-x-auto">
          {loading ? (
            <div className="p-6 space-y-3">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-14 w-full rounded-xl" />
              ))}
            </div>
          ) : studentMonthlyStats.length > 0 ? (
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b text-slate-600 font-bold">
                  <th className="p-3 pl-4">Roll</th>
                  <th className="p-3">Student Name</th>
                  <th className="p-3">Contact</th>
                  <th className="p-3 text-center">Days Present</th>
                  <th className="p-3 text-center">Hours Attended</th>
                  <th className="p-3 text-center">Hours Missed</th>
                  <th className="p-3 text-center">Attendance %</th>
                  <th className="p-3 text-right pr-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {studentMonthlyStats.map((item) => {
                  const isHighAttendance = item.attendancePct >= 75;
                  const isLowAttendance = item.attendancePct > 0 && item.attendancePct < 50;

                  return (
                    <tr key={item.student.id} className="hover:bg-slate-50/70 transition">
                      {/* Roll Code */}
                      <td className="p-3 pl-4 font-mono font-bold text-slate-600">
                        {item.rollNo}
                      </td>

                      {/* Name */}
                      <td className="p-3">
                        <p className="font-bold text-slate-900 text-xs">{item.student.name}</p>
                        <p className="text-[11px] text-slate-500">{item.student.email || 'No email'}</p>
                      </td>

                      {/* Phone & Parent Phone */}
                      <td className="p-3 text-[11px]">
                        {item.student.phone && <p className="text-slate-700 flex items-center gap-1"><Phone className="h-3 w-3 text-slate-400" /> {item.student.phone}</p>}
                        {item.student.parentPhone && <p className="text-slate-500">Parent: {item.student.parentPhone}</p>}
                        {!item.student.phone && !item.student.parentPhone && <span className="text-slate-400 italic">No contact</span>}
                      </td>

                      {/* Days Present */}
                      <td className="p-3 text-center">
                        <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 font-bold text-xs">
                          {item.daysPresent} / {classSummary.workingDays} Days
                        </Badge>
                      </td>

                      {/* Hours Attended */}
                      <td className="p-3 text-center font-bold text-blue-700">
                        {item.hoursAttended} hrs
                      </td>

                      {/* Hours Missed */}
                      <td className="p-3 text-center font-bold">
                        {item.hoursMissed > 0 ? (
                          <span className="text-red-600 bg-red-50 px-2 py-0.5 rounded-md border border-red-200">
                            {item.hoursMissed} hrs
                          </span>
                        ) : (
                          <span className="text-slate-400 font-normal">0</span>
                        )}
                      </td>

                      {/* Percentage */}
                      <td className="p-3 text-center">
                        <Badge
                          className={`font-bold text-xs ${
                            isHighAttendance
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : isLowAttendance
                              ? 'bg-red-50 text-red-700 border-red-200'
                              : 'bg-amber-50 text-amber-700 border-amber-200'
                          }`}
                        >
                          {item.attendancePct}%
                        </Badge>
                      </td>

                      {/* Drilldown Action */}
                      <td className="p-3 text-right pr-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedStudentDetail(item)}
                          className="h-7 text-xs font-bold"
                        >
                          View Details
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <div className="p-12 text-center flex flex-col items-center justify-center">
              <Users className="h-10 w-10 text-muted-foreground/30 mb-2" />
              <p className="font-bold text-sm text-slate-800">No attendance data found for {monthDisplayName}.</p>
              <p className="text-xs text-muted-foreground mt-1 mb-4">
                Mark daily attendance for {selectedClassName} to generate monthly reports.
              </p>
              <Link href="/admin/attendance/mark">
                <Button size="sm" className="font-bold text-xs">
                  Mark Today&apos;s Attendance
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>

      {/* STUDENT MONTHLY DETAIL MODAL */}
      <Dialog open={!!selectedStudentDetail} onOpenChange={(open) => !open && setSelectedStudentDetail(null)}>
        <DialogContent className="sm:max-w-xl max-h-[85vh] overflow-y-auto">
          {selectedStudentDetail && (
            <div>
              <DialogHeader>
                <DialogTitle className="text-base font-bold flex items-center justify-between">
                  <span>{selectedStudentDetail.student.name} — Monthly Sheet</span>
                  <Badge className="bg-primary/10 text-primary border-primary/20 text-xs">
                    {selectedStudentDetail.attendancePct}% Attendance
                  </Badge>
                </DialogTitle>
                <DialogDescription className="text-xs">
                  Roll: {selectedStudentDetail.rollNo} · {selectedClassName} · {monthDisplayName}
                </DialogDescription>
              </DialogHeader>

              {/* Student Summary KPIs */}
              <div className="grid grid-cols-3 gap-3 my-4">
                <div className="p-3 bg-slate-50 border rounded-xl text-center">
                  <span className="text-[10px] text-slate-500 font-bold uppercase block">Days Present</span>
                  <p className="text-xl font-extrabold text-emerald-700">{selectedStudentDetail.daysPresent} / {classSummary.workingDays}</p>
                </div>
                <div className="p-3 bg-slate-50 border rounded-xl text-center">
                  <span className="text-[10px] text-slate-500 font-bold uppercase block">Hours Attended</span>
                  <p className="text-xl font-extrabold text-blue-700">{selectedStudentDetail.hoursAttended} hrs</p>
                </div>
                <div className="p-3 bg-slate-50 border rounded-xl text-center">
                  <span className="text-[10px] text-slate-500 font-bold uppercase block">Hours Missed</span>
                  <p className="text-xl font-extrabold text-red-600">{selectedStudentDetail.hoursMissed} hrs</p>
                </div>
              </div>

              {/* Day-by-Day Log */}
              <div>
                <h4 className="text-xs font-bold text-slate-700 mb-2">Class-by-Class Attendance Records</h4>
                {selectedStudentDetail.records.length > 0 ? (
                  <div className="border rounded-xl divide-y max-h-60 overflow-y-auto text-xs">
                    {selectedStudentDetail.records.map((r: any, rIdx: number) => (
                      <div key={r.id || rIdx} className="p-2.5 flex items-center justify-between">
                        <div>
                          <p className="font-bold text-slate-800">
                            {new Date(r.sessionDate).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })} — Hour {r.periodIndex || 1}
                          </p>
                          <p className="text-[11px] text-slate-500">
                            Subject: <span className="font-medium text-slate-700">{r.subjectName || 'Class'}</span>
                            {r.remark && <span className="ml-2 text-slate-400 italic">({r.remark})</span>}
                          </p>
                        </div>

                        <div className="flex items-center gap-3">
                          {(r.inTime || r.outTime) && (
                            <div className="text-[11px] font-mono text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                              {r.inTime || '—'} – {r.outTime || '—'}
                            </div>
                          )}
                          <Badge
                            className={`text-[10px] font-bold ${
                              r.status === 'PRESENT'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : r.status === 'ABSENT'
                                ? 'bg-red-50 text-red-700 border-red-200'
                                : 'bg-amber-50 text-amber-700 border-amber-200'
                            }`}
                          >
                            {r.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground italic">No recorded sessions for this month.</p>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
