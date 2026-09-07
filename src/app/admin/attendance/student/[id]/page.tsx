'use client';

import { useEffect, useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, CheckCircle2, XCircle, Clock, AlertTriangle, CalendarDays, BookOpen, Activity, Calendar } from 'lucide-react';
import { getAttendanceByStudent, getAcademicYears } from '@/app/actions/attendance';
import { getDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { TAttendanceRecord, TAcademicYear, TAttendanceStudent } from '@/app/actions/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function StudentAttendanceProfile() {
  const { id } = useParams();
  const studentId = id as string;

  const [student, setStudent] = useState<TAttendanceStudent | null>(null);
  const [years, setYears] = useState<TAcademicYear[]>([]);
  const [selectedYear, setSelectedYear] = useState('');
  const [records, setRecords] = useState<TAttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      // Fetch student data
      const docRef = doc(db, 'users', studentId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setStudent({ id: docSnap.id, ...docSnap.data() } as TAttendanceStudent);
      }

      // Fetch years
      const res = await getAcademicYears();
      if (res.success && res.data) {
        const yrs = res.data as TAcademicYear[];
        setYears(yrs);
        const active = yrs.find(y => y.status === 'active');
        if (active) setSelectedYear(active.id);
      }
    })();
  }, [studentId]);

  useEffect(() => {
    if (!selectedYear) return;
    (async () => {
      setLoading(true);
      const res = await getAttendanceByStudent(studentId, { academicYearId: selectedYear });
      if (res.success && res.data) {
        setRecords(res.data as TAttendanceRecord[]);
      }
      setLoading(false);
    })();
  }, [studentId, selectedYear]);

  // Overall Stats
  const stats = useMemo(() => {
    const total = records.length;
    const present = records.filter(r => r.status === 'PRESENT').length;
    const absent = records.filter(r => r.status === 'ABSENT').length;
    const late = records.filter(r => r.status === 'LATE').length;
    const onLeave = records.filter(r => r.status === 'ON_LEAVE').length;
    const pct = total > 0 ? Math.round(((present + late) / total) * 100) : 0;
    return { total, present, absent, late, onLeave, pct };
  }, [records]);

  // Subject-wise Breakdown
  const subjectStats = useMemo(() => {
    const subjectsMap: { [key: string]: { total: number; present: number; late: number; absent: number; name: string } } = {};
    records.forEach(r => {
      if (!subjectsMap[r.subjectId]) {
        subjectsMap[r.subjectId] = { total: 0, present: 0, late: 0, absent: 0, name: r.subjectId }; // would need subject name mapping ideally
      }
      subjectsMap[r.subjectId].total++;
      if (r.status === 'PRESENT') subjectsMap[r.subjectId].present++;
      else if (r.status === 'LATE') subjectsMap[r.subjectId].late++;
      else if (r.status === 'ABSENT') subjectsMap[r.subjectId].absent++;
    });
    return Object.values(subjectsMap).map(s => ({ ...s, pct: s.total > 0 ? Math.round(((s.present + s.late) / s.total) * 100) : 0 }));
  }, [records]);

  if (!student) {
    return <div className="p-8"><Skeleton className="h-32 w-full rounded-2xl" /></div>;
  }

  return (
    <div className="space-y-6">
      {/* Header Profile Card */}
      <Card className="border border-slate-200/80 rounded-2xl overflow-hidden relative">
        <div className="h-24 bg-gradient-to-r from-primary/20 to-primary/5 absolute top-0 left-0 right-0" />
        <CardContent className="pt-12 relative z-10 flex flex-col md:flex-row items-center md:items-end justify-between gap-6 pb-6">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-6 text-center md:text-left">
            <Avatar className="h-24 w-24 border-4 border-white shadow-sm">
              <AvatarImage src={student.photoURL} />
              <AvatarFallback className="text-3xl font-bold bg-primary/10 text-primary">{student.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="mb-2">
              <h1 className="text-2xl font-extrabold text-slate-900">{student.name}</h1>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mt-2">
                <Badge variant="secondary" className="font-bold">{student.studentCode || 'No Code'}</Badge>
                <Badge variant="outline" className="font-bold border-primary/30 text-primary bg-primary/5">{student.className || 'Unknown Class'}</Badge>
                <Badge variant="outline" className="font-bold border-primary/30 text-primary bg-primary/5">{student.batchName || 'Unknown Batch'}</Badge>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center md:items-end gap-2 mb-2">
            <div className="flex items-center gap-2">
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger className="w-32 h-8 text-xs font-bold"><SelectValue /></SelectTrigger>
                <SelectContent>{years.map(y => <SelectItem key={y.id} value={y.id}>{y.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-3 bg-slate-50 border px-4 py-2 rounded-xl">
              <div className="text-right">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Overall</p>
                <p className={`text-2xl font-extrabold leading-none ${stats.pct >= 75 ? 'text-emerald-600' : stats.pct >= 50 ? 'text-amber-600' : 'text-red-600'}`}>
                  {stats.pct}%
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border border-slate-200/80 rounded-xl">
          <CardContent className="p-4 flex items-center justify-between">
            <div><p className="text-[11px] font-bold text-slate-500 uppercase">Present</p><p className="text-2xl font-extrabold text-emerald-700">{stats.present}</p></div>
            <div className="h-10 w-10 rounded-full bg-emerald-50 flex items-center justify-center"><CheckCircle2 className="h-5 w-5 text-emerald-600" /></div>
          </CardContent>
        </Card>
        <Card className="border border-slate-200/80 rounded-xl">
          <CardContent className="p-4 flex items-center justify-between">
            <div><p className="text-[11px] font-bold text-slate-500 uppercase">Absent</p><p className="text-2xl font-extrabold text-red-700">{stats.absent}</p></div>
            <div className="h-10 w-10 rounded-full bg-red-50 flex items-center justify-center"><XCircle className="h-5 w-5 text-red-600" /></div>
          </CardContent>
        </Card>
        <Card className="border border-slate-200/80 rounded-xl">
          <CardContent className="p-4 flex items-center justify-between">
            <div><p className="text-[11px] font-bold text-slate-500 uppercase">Late</p><p className="text-2xl font-extrabold text-amber-700">{stats.late}</p></div>
            <div className="h-10 w-10 rounded-full bg-amber-50 flex items-center justify-center"><Clock className="h-5 w-5 text-amber-600" /></div>
          </CardContent>
        </Card>
        <Card className="border border-slate-200/80 rounded-xl">
          <CardContent className="p-4 flex items-center justify-between">
            <div><p className="text-[11px] font-bold text-slate-500 uppercase">Total Sessions</p><p className="text-2xl font-extrabold text-slate-800">{stats.total}</p></div>
            <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center"><CalendarDays className="h-5 w-5 text-slate-600" /></div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="history" className="w-full">
        <TabsList className="w-full justify-start h-12 bg-transparent border-b rounded-none p-0">
          <TabsTrigger value="history" className="h-12 px-6 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent font-bold">History</TabsTrigger>
          <TabsTrigger value="subjects" className="h-12 px-6 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent font-bold">Subject-wise</TabsTrigger>
        </TabsList>
        
        <TabsContent value="history" className="pt-4">
          <Card className="border border-slate-200/80 rounded-2xl">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow><TableCell colSpan={4} className="h-20 text-center"><Skeleton className="h-4 w-32 mx-auto" /></TableCell></TableRow>
                  ) : records.length > 0 ? (
                    records.map(record => (
                      <TableRow key={record.id}>
                        <TableCell className="font-medium text-slate-800">
                          {new Date(record.sessionDate).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}
                        </TableCell>
                        <TableCell className="text-slate-600">{record.subjectId}</TableCell>
                        <TableCell>
                          <Badge className={`text-[10px] font-extrabold uppercase ${
                            record.status === 'PRESENT' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                            record.status === 'ABSENT' ? 'bg-red-50 text-red-700 border-red-200' :
                            record.status === 'LATE' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                            'bg-blue-50 text-blue-700 border-blue-200'
                          }`}>
                            {record.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs text-slate-500">
                          {record.status === 'LATE' && record.entryTime ? `Entry: ${record.entryTime}` : 
                           record.status === 'ABSENT' && record.absenceReason ? record.absenceReason :
                           record.remark || '—'}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow><TableCell colSpan={4} className="text-center h-28 text-muted-foreground font-medium">No attendance records found.</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subjects" className="pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {subjectStats.map(stat => (
              <Card key={stat.name} className="border border-slate-200/80 rounded-2xl">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-bold flex items-center gap-2"><BookOpen className="h-4 w-4 text-slate-400" /> {stat.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end justify-between mb-2">
                    <span className={`text-2xl font-extrabold ${stat.pct >= 75 ? 'text-emerald-600' : stat.pct >= 50 ? 'text-amber-600' : 'text-red-600'}`}>{stat.pct}%</span>
                    <span className="text-xs font-bold text-slate-500">{stat.present}/{stat.total} Attended</span>
                  </div>
                  <Progress value={stat.pct} className="h-1.5" />
                  <div className="flex items-center gap-4 mt-4 pt-4 border-t text-xs font-medium text-slate-600">
                    <span className="flex items-center gap-1"><XCircle className="h-3 w-3 text-red-500" /> {stat.absent} A</span>
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3 text-amber-500" /> {stat.late} L</span>
                  </div>
                </CardContent>
              </Card>
            ))}
            {subjectStats.length === 0 && !loading && (
              <div className="col-span-full text-center py-12 text-muted-foreground">No subject data available.</div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
