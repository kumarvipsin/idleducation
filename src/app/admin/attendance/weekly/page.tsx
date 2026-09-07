'use client';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  CalendarDays, ChevronLeft, ChevronRight, CheckCircle2, XCircle,
  Clock, Users, Printer, ArrowLeft, BookOpen, AlertCircle
} from 'lucide-react';
import { getAttendanceClasses, getAttendanceStudents, getClassWeeklyAttendance } from '@/app/actions/attendance';
import type { TAttendanceClass, TAttendanceStudent, TAttendanceRecord } from '@/app/actions/types';

// Helper to get week bounds (Monday to Saturday)
function getCoachingWeekDates(date: Date): { start: string; end: string; days: { dateStr: string; label: string; dayName: string }[] } {
  const d = new Date(date);
  const day = d.getDay();
  // Monday is start (day 1). If Sunday (0), go back 6 days
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(d.setDate(diff));

  const days: { dateStr: string; label: string; dayName: string }[] = [];
  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  for (let i = 0; i < 6; i++) {
    const dt = new Date(monday);
    dt.setDate(monday.getDate() + i);
    const dateStr = dt.toISOString().split('T')[0];
    const label = dt.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
    days.push({ dateStr, label, dayName: dayNames[i] });
  }

  return {
    start: days[0].dateStr,
    end: days[days.length - 1].dateStr,
    days,
  };
}

export default function WeeklyAttendanceReportPage() {
  const [classes, setClasses] = useState<TAttendanceClass[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<string>('');
  const [currentWeekDate, setCurrentWeekDate] = useState<Date>(new Date());
  const [students, setStudents] = useState<TAttendanceStudent[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<TAttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const weekInfo = useMemo(() => getCoachingWeekDates(currentWeekDate), [currentWeekDate]);

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

  // Load Students and Weekly Attendance
  const loadData = async () => {
    if (!selectedClassId) return;
    setLoading(true);

    const [stuRes, attRes] = await Promise.all([
      getAttendanceStudents(selectedClassId),
      getClassWeeklyAttendance(selectedClassId, weekInfo.start, weekInfo.end),
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
  }, [selectedClassId, weekInfo.start]);

  const navigateWeek = (direction: number) => {
    const nextDate = new Date(currentWeekDate);
    nextDate.setDate(nextDate.getDate() + direction * 7);
    setCurrentWeekDate(nextDate);
  };

  const jumpToThisWeek = () => {
    setCurrentWeekDate(new Date());
  };

  // Build student weekly calculations
  const studentWeeklyStats = useMemo(() => {
    return students.map(student => {
      const studentRecords = attendanceRecords.filter(r => r.studentId === student.id);

      // Days student attended (distinct dates with at least 1 PRESENT or LATE)
      const attendedDates = new Set(
        studentRecords.filter(r => r.status === 'PRESENT' || r.status === 'LATE').map(r => r.sessionDate)
      );
      const daysAttended = attendedDates.size;

      // Classes/Hours attended
      const hoursAttended = studentRecords.filter(r => r.status === 'PRESENT' || r.status === 'LATE').length;
      // Classes/Hours missed
      const hoursMissed = studentRecords.filter(r => r.status === 'ABSENT').length;
      const totalHoursMarked = hoursAttended + hoursMissed;

      // Day-by-day mapping
      const dayData = weekInfo.days.map(day => {
        const recordsForDay = studentRecords.filter(r => r.sessionDate === day.dateStr);
        recordsForDay.sort((a, b) => (a.periodIndex || 1) - (b.periodIndex || 1));

        const presentPeriods = recordsForDay.filter(r => r.status === 'PRESENT' || r.status === 'LATE');
        const isAbsentWholeDay = recordsForDay.length > 0 && recordsForDay.every(r => r.status === 'ABSENT');

        // Extract earliest in-time and latest out-time
        let inTime = '—';
        let outTime = '—';
        const validInTimes = presentPeriods.map(r => r.inTime || r.entryTime).filter(Boolean);
        const validOutTimes = presentPeriods.map(r => r.outTime).filter(Boolean);

        if (validInTimes.length > 0) inTime = validInTimes[0] as string;
        if (validOutTimes.length > 0) outTime = validOutTimes[validOutTimes.length - 1] as string;

        return {
          dateStr: day.dateStr,
          dayName: day.dayName,
          hasRecords: recordsForDay.length > 0,
          periodsCount: recordsForDay.length,
          presentPeriodsCount: presentPeriods.length,
          isAbsentWholeDay,
          records: recordsForDay,
          inTime,
          outTime,
        };
      });

      return {
        student,
        daysAttended,
        hoursAttended,
        hoursMissed,
        totalHoursMarked,
        dayData,
      };
    });
  }, [students, attendanceRecords, weekInfo]);

  // Overall Weekly Summary
  const overallSummary = useMemo(() => {
    let totalStudentHoursPresent = 0;
    let totalStudentHoursMissed = 0;
    let totalStudentDays = 0;

    studentWeeklyStats.forEach(s => {
      totalStudentHoursPresent += s.hoursAttended;
      totalStudentHoursMissed += s.hoursMissed;
      totalStudentDays += s.daysAttended;
    });

    const totalScheduled = totalStudentHoursPresent + totalStudentHoursMissed;
    const avgAttendancePct = totalScheduled > 0 ? Math.round((totalStudentHoursPresent / totalScheduled) * 100) : 0;
    const avgDaysPerStudent = students.length > 0 ? (totalStudentDays / students.length).toFixed(1) : '0';

    return {
      totalStudentHoursPresent,
      totalStudentHoursMissed,
      avgAttendancePct,
      avgDaysPerStudent,
      totalStudents: students.length,
    };
  }, [studentWeeklyStats, students]);

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
              <CalendarDays className="h-6 w-6 text-primary" /> Weekly Attendance Report
            </h1>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Weekly organized report: days attended, total class hours taken vs missed, and exact In/Out timestamps.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.print()}
            className="font-bold text-xs gap-1.5 h-9"
          >
            <Printer className="h-4 w-4" /> Print / Export
          </Button>
          <Link href="/admin/attendance/mark">
            <Button size="sm" className="font-bold text-xs h-9">
              Take Attendance
            </Button>
          </Link>
        </div>
      </div>

      {/* Class Selector & Week Navigation */}
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

            {/* Week Navigator */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => navigateWeek(-1)}
                className="h-8 w-8 rounded-lg"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <div className="px-3 py-1.5 bg-slate-50 border rounded-lg text-xs font-bold text-slate-800 text-center min-w-[210px]">
                {weekInfo.days[0].label} – {weekInfo.days[weekInfo.days.length - 1].label}, {new Date(weekInfo.start).getFullYear()}
              </div>

              <Button
                variant="outline"
                size="icon"
                onClick={() => navigateWeek(1)}
                className="h-8 w-8 rounded-lg"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={jumpToThisWeek}
                className="text-xs font-bold h-8 text-primary"
              >
                This Week
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border border-slate-200/80 rounded-xl">
          <CardContent className="p-4">
            <span className="text-[11px] font-bold text-slate-500 uppercase">Class Attendance</span>
            <p className="text-3xl font-extrabold text-primary mt-1">{overallSummary.avgAttendancePct}%</p>
            <p className="text-[11px] text-slate-400 mt-0.5">overall class performance</p>
          </CardContent>
        </Card>

        <Card className="border border-slate-200/80 rounded-xl">
          <CardContent className="p-4">
            <span className="text-[11px] font-bold text-slate-500 uppercase">Avg Days Attended</span>
            <p className="text-3xl font-extrabold text-emerald-700 mt-1">{overallSummary.avgDaysPerStudent} <span className="text-sm font-bold text-slate-400">/ 6</span></p>
            <p className="text-[11px] text-slate-400 mt-0.5">days per student this week</p>
          </CardContent>
        </Card>

        <Card className="border border-slate-200/80 rounded-xl">
          <CardContent className="p-4">
            <span className="text-[11px] font-bold text-slate-500 uppercase">Class Hours Attended</span>
            <p className="text-3xl font-extrabold text-blue-700 mt-1">{overallSummary.totalStudentHoursPresent} <span className="text-sm font-bold text-slate-400">hrs</span></p>
            <p className="text-[11px] text-slate-400 mt-0.5">total student-hours completed</p>
          </CardContent>
        </Card>

        <Card className="border border-slate-200/80 rounded-xl">
          <CardContent className="p-4">
            <span className="text-[11px] font-bold text-slate-500 uppercase">Class Hours Missed</span>
            <p className="text-3xl font-extrabold text-red-600 mt-1">{overallSummary.totalStudentHoursMissed} <span className="text-sm font-bold text-slate-400">hrs</span></p>
            <p className="text-[11px] text-slate-400 mt-0.5">missed class hours</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Weekly Attendance Grid */}
      <Card className="border border-slate-200/80 shadow-sm rounded-2xl overflow-hidden">
        <CardHeader className="pb-3 border-b bg-slate-50/50">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold text-slate-800">
                {selectedClassName} — Weekly Breakdown
              </CardTitle>
              <CardDescription className="text-xs">
                Detailed day-by-day classes taken, exact arrival & departure time, and missed classes.
              </CardDescription>
            </div>
            <Badge variant="outline" className="font-bold text-xs">
              {students.length} Students enrolled
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
          ) : studentWeeklyStats.length > 0 ? (
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b text-slate-600 font-bold">
                  <th className="p-3 pl-4 min-w-[170px]">Student Name</th>
                  <th className="p-3 text-center min-w-[90px]">Days Present</th>
                  <th className="p-3 text-center min-w-[90px]">Hours Attended</th>
                  <th className="p-3 text-center min-w-[80px]">Missed</th>
                  {weekInfo.days.map(d => (
                    <th key={d.dateStr} className="p-3 text-center min-w-[130px]">
                      <div>{d.dayName}</div>
                      <div className="text-[10px] font-normal text-slate-400">{d.label}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {studentWeeklyStats.map((item, idx) => {
                  return (
                    <tr key={item.student.id} className="hover:bg-slate-50/60 transition">
                      {/* Student Info */}
                      <td className="p-3 pl-4">
                        <p className="font-bold text-slate-900 text-xs">{item.student.name}</p>
                        <p className="text-[10px] font-mono text-slate-500">
                          Roll: {item.student.studentCode || `STU-${idx + 1}`}
                        </p>
                      </td>

                      {/* Days Present */}
                      <td className="p-3 text-center">
                        <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 font-bold text-xs">
                          {item.daysAttended} / 6 Days
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

                      {/* Daily Cells (Mon - Sat) */}
                      {item.dayData.map(day => {
                        if (!day.hasRecords) {
                          return (
                            <td key={day.dateStr} className="p-2 text-center text-slate-300">
                              —
                            </td>
                          );
                        }

                        if (day.isAbsentWholeDay) {
                          return (
                            <td key={day.dateStr} className="p-2 text-center">
                              <div className="bg-red-50 text-red-600 border border-red-200 rounded-lg py-1 px-1.5 font-bold text-[11px]">
                                Absent
                              </div>
                            </td>
                          );
                        }

                        return (
                          <td key={day.dateStr} className="p-2 text-center">
                            <div className="bg-emerald-50/70 border border-emerald-200 rounded-lg p-1.5 space-y-1">
                              <div className="flex items-center justify-between text-[10px] font-bold text-emerald-800">
                                <span>{day.presentPeriodsCount} Class{day.presentPeriodsCount > 1 ? 'es' : ''}</span>
                                <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                              </div>

                              {/* In/Out Times */}
                              <div className="text-[10px] text-slate-600 font-mono bg-white/80 py-0.5 px-1 rounded flex items-center justify-center gap-1">
                                <Clock className="h-2.5 w-2.5 text-slate-400" />
                                <span>{day.inTime} – {day.outTime}</span>
                              </div>

                              {/* Subject badges */}
                              <div className="flex flex-wrap gap-0.5 justify-center">
                                {day.records.map((r, rIdx) => (
                                  <span
                                    key={r.id || rIdx}
                                    className={`text-[9px] px-1 rounded font-semibold ${
                                      r.status === 'ABSENT'
                                        ? 'bg-red-100 text-red-700'
                                        : 'bg-emerald-100 text-emerald-800'
                                    }`}
                                  >
                                    H{r.periodIndex || (rIdx + 1)}: {r.subjectName || 'Class'}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <div className="p-12 text-center flex flex-col items-center justify-center">
              <Users className="h-10 w-10 text-muted-foreground/30 mb-2" />
              <p className="font-bold text-sm text-slate-800">No students enrolled in {selectedClassName}.</p>
              <p className="text-xs text-muted-foreground mt-1 mb-4">
                Add students to {selectedClassName} to view weekly reports.
              </p>
              <Link href="/admin/attendance/mark">
                <Button size="sm" className="font-bold text-xs">
                  Go to Attendance Register
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
