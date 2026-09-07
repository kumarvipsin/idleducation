'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import { CalendarDays, CheckCircle2, XCircle, Clock, AlertTriangle, Users, ArrowRight, ClipboardList } from 'lucide-react';
import { getAcademicYears, getAttendanceClasses, getBatches, getSessions, getAttendanceBySession } from '@/app/actions/attendance';
import type { TAcademicYear, TAttendanceClass, TBatch, TSession } from '@/app/actions/types';

export default function TodayPage() {
  const today = new Date().toISOString().split('T')[0];
  const [sessions, setSessions] = useState<(TSession & { stats?: { present: number; absent: number; late: number; leave: number; total: number } })[]>([]);
  const [loading, setLoading] = useState(true);
  const [years, setYears] = useState<TAcademicYear[]>([]);
  const [selectedYear, setSelectedYear] = useState('');

  useEffect(() => {
    (async () => {
      const res = await getAcademicYears();
      if (res.success && res.data) {
        const yrs = res.data as TAcademicYear[];
        setYears(yrs);
        const active = yrs.find(y => y.status === 'active');
        if (active) setSelectedYear(active.id);
      }
    })();
  }, []);

  useEffect(() => {
    if (!selectedYear) return;
    (async () => {
      setLoading(true);
      const sessRes = await getSessions({ academicYearId: selectedYear, date: today });
      if (sessRes.success && sessRes.data) {
        const sessList = sessRes.data as TSession[];
        // Load attendance stats for each session
        const withStats = await Promise.all(sessList.map(async (session) => {
          const attRes = await getAttendanceBySession(session.id);
          if (attRes.success && attRes.data) {
            const records = attRes.data as any[];
            return {
              ...session,
              stats: {
                present: records.filter(r => r.status === 'PRESENT').length,
                absent: records.filter(r => r.status === 'ABSENT').length,
                late: records.filter(r => r.status === 'LATE').length,
                leave: records.filter(r => r.status === 'ON_LEAVE').length,
                total: records.length,
              },
            };
          }
          return { ...session, stats: undefined };
        }));
        setSessions(withStats);
      }
      setLoading(false);
    })();
  }, [selectedYear]);

  const todayFormatted = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <CalendarDays className="h-6 w-6 text-primary" /> Today
          </h1>
          <p className="text-sm text-muted-foreground mt-1">{todayFormatted}</p>
        </div>
        <Link href="/admin/attendance/mark">
          <Button className="font-bold gap-1.5 h-9 rounded-lg"><ClipboardList className="h-4 w-4" /> Mark Attendance</Button>
        </Link>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border border-slate-200/80 rounded-xl">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center"><ClipboardList className="h-5 w-5 text-primary" /></div>
            <div><p className="text-2xl font-extrabold text-slate-900">{sessions.length}</p><p className="text-[11px] text-slate-500 font-medium">Sessions Today</p></div>
          </CardContent>
        </Card>
        <Card className="border border-slate-200/80 rounded-xl">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-emerald-50 flex items-center justify-center"><CheckCircle2 className="h-5 w-5 text-emerald-600" /></div>
            <div><p className="text-2xl font-extrabold text-emerald-700">{sessions.filter(s => s.status === 'completed').length}</p><p className="text-[11px] text-slate-500 font-medium">Completed</p></div>
          </CardContent>
        </Card>
        <Card className="border border-slate-200/80 rounded-xl">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-amber-50 flex items-center justify-center"><Clock className="h-5 w-5 text-amber-600" /></div>
            <div><p className="text-2xl font-extrabold text-amber-700">{sessions.filter(s => s.status === 'scheduled').length}</p><p className="text-[11px] text-slate-500 font-medium">Scheduled</p></div>
          </CardContent>
        </Card>
        <Card className="border border-slate-200/80 rounded-xl">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-red-50 flex items-center justify-center"><XCircle className="h-5 w-5 text-red-600" /></div>
            <div><p className="text-2xl font-extrabold text-red-700">{sessions.reduce((sum, s) => sum + (s.stats?.absent || 0), 0)}</p><p className="text-[11px] text-slate-500 font-medium">Total Absent</p></div>
          </CardContent>
        </Card>
      </div>

      {/* Sessions List */}
      <div className="space-y-3">
        <h2 className="text-lg font-bold text-slate-800">Today&apos;s Sessions</h2>
        {loading ? [...Array(3)].map((_, i) => (
          <Card key={i} className="border rounded-xl"><CardContent className="p-4"><div className="flex gap-4"><Skeleton className="h-12 w-12 rounded-lg" /><div className="flex-1 space-y-2"><Skeleton className="h-4 w-40" /><Skeleton className="h-3 w-60" /></div></div></CardContent></Card>
        )) : sessions.length > 0 ? sessions.map(session => (
          <Card key={session.id} className={`border rounded-xl transition-all hover:shadow-sm ${
            session.status === 'completed' ? 'border-emerald-200/60' : session.status === 'cancelled' ? 'border-red-200/60 opacity-60' : 'border-slate-200/80'
          }`}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className={`h-12 w-12 rounded-lg flex items-center justify-center text-xs font-extrabold ${
                    session.status === 'completed' ? 'bg-emerald-50 text-emerald-700' : session.status === 'cancelled' ? 'bg-red-50 text-red-600' : 'bg-primary/10 text-primary'
                  }`}>
                    {session.startTime}
                  </div>
                  <div>
                    <p className="font-bold text-slate-800">{session.subjectName || session.subjectId}</p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {session.className || session.classId} · {session.batchName || session.batchId} · {session.startTime}–{session.endTime}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {session.stats && session.stats.total > 0 && (
                    <div className="flex items-center gap-2 text-xs font-bold">
                      <span className="text-emerald-600">{session.stats.present}P</span>
                      {session.stats.absent > 0 && <span className="text-red-600">{session.stats.absent}A</span>}
                      {session.stats.late > 0 && <span className="text-amber-600">{session.stats.late}L</span>}
                    </div>
                  )}
                  <Badge className={`text-[10px] font-extrabold uppercase ${
                    session.status === 'completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                    session.status === 'cancelled' ? 'bg-red-50 text-red-600 border-red-200' :
                    'bg-primary/10 text-primary border-primary/20'
                  }`}>{session.status}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        )) : (
          <Card className="border border-dashed border-slate-300 rounded-2xl">
            <CardContent className="flex flex-col items-center justify-center h-40">
              <CalendarDays className="h-10 w-10 text-muted-foreground/30 mb-2" />
              <p className="text-sm text-muted-foreground font-medium">No sessions today</p>
              <Link href="/admin/attendance/mark" className="mt-2">
                <Button variant="outline" size="sm" className="font-bold text-xs gap-1"><ClipboardList className="h-3.5 w-3.5" /> Create & Mark Attendance</Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
