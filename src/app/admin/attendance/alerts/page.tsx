'use client';

import { useEffect, useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertTriangle, TrendingDown, Clock, PhoneCall, PlusCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { getAcademicYears, getAttendanceClasses, getBatches, getAttendanceByFilters, getAttendanceStudents, addFollowUp } from '@/app/actions/attendance';
import type { TAcademicYear, TAttendanceClass, TBatch } from '@/app/actions/types';

export default function AlertsPage() {
  const [years, setYears] = useState<TAcademicYear[]>([]);
  const [classes, setClasses] = useState<TAttendanceClass[]>([]);
  const [batches, setBatches] = useState<TBatch[]>([]);
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedBatch, setSelectedBatch] = useState('');
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState<any[]>([]);
  const [attendanceData, setAttendanceData] = useState<any[]>([]);
  
  // Follow-up Dialog
  const [followUpDialogOpen, setFollowUpDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const currentMonth = new Date().toISOString().slice(0, 7); // "YYYY-MM"

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
      const res = await getAttendanceClasses(selectedYear);
      if (res.success && res.data) setClasses((res.data as TAttendanceClass[]).filter(c => c.status === 'active'));
    })();
  }, [selectedYear]);

  useEffect(() => {
    if (!selectedClass) return;
    (async () => {
      const res = await getBatches(selectedClass);
      if (res.success && res.data) setBatches((res.data as TBatch[]).filter(b => b.status === 'active'));
    })();
  }, [selectedClass]);

  useEffect(() => {
    if (!selectedClass || !selectedBatch) return;
    (async () => {
      setLoading(true);
      const [attRes, stuRes] = await Promise.all([
        getAttendanceByFilters({
          academicYearId: selectedYear, classId: selectedClass, batchId: selectedBatch,
          status: 'ABSENT' // Only fetch absences for alerts
        }),
        getAttendanceStudents(selectedClass, selectedBatch),
      ]);
      if (attRes.success && attRes.data) setAttendanceData(attRes.data as any[]);
      if (stuRes.success && stuRes.data) setStudents(stuRes.data as any[]);
      setLoading(false);
    })();
  }, [selectedYear, selectedClass, selectedBatch]);

  // Analyze alerts
  const alerts = useMemo(() => {
    return students.map(student => {
      const absences = attendanceData.filter(a => a.studentId === student.id);
      const monthAbsences = absences.filter(a => a.sessionDate?.startsWith(currentMonth));
      
      // Consecutive absences logic
      const sortedDates = monthAbsences.map(a => a.sessionDate).sort((a, b) => b.localeCompare(a));
      let consecutive = 0;
      if (sortedDates.length > 0) {
          // Simplistic consecutive check based on having multiple absences
          consecutive = sortedDates.length; 
      }

      return {
        ...student,
        totalAbsences: absences.length,
        monthAbsences: monthAbsences.length,
        consecutive,
        recentAbsence: sortedDates[0] || null,
        needsAttention: monthAbsences.length >= 3 || consecutive >= 2
      };
    }).filter(s => s.needsAttention).sort((a, b) => b.monthAbsences - a.monthAbsences);
  }, [students, attendanceData, currentMonth]);


  const handleCreateFollowUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedStudent) return;
    setIsSubmitting(true);
    const fd = new FormData(e.currentTarget);
    
    // Create follow-up attached to the most recent absence session
    const recentAbsenceRecord = attendanceData.find(a => a.studentId === selectedStudent.id && a.sessionDate === selectedStudent.recentAbsence);
    
    const data = {
      attendanceId: recentAbsenceRecord?.id || 'general',
      studentId: selectedStudent.id,
      sessionId: recentAbsenceRecord?.sessionId || 'general',
      type: fd.get('type') as string,
      callRemark: fd.get('remark') as string,
    };

    const res = await addFollowUp(data);
    if (res.success) {
      toast({ title: 'Success', description: 'Follow-up created successfully.' });
      setFollowUpDialogOpen(false);
    } else {
      toast({ variant: 'destructive', title: 'Error', description: res.message });
    }
    setIsSubmitting(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2"><AlertTriangle className="h-6 w-6 text-red-500" /> Attendance Alerts</h1>
          <p className="text-sm text-muted-foreground mt-1">Students requiring attention due to low attendance.</p>
        </div>
      </div>

      <Card className="border border-slate-200/80 rounded-2xl">
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Select value={selectedClass} onValueChange={v => { setSelectedClass(v); setSelectedBatch(''); }}>
              <SelectTrigger className="font-medium"><SelectValue placeholder="Select Class" /></SelectTrigger>
              <SelectContent>{classes.map(c => <SelectItem key={c.id} value={c.id}>{c.displayName || c.name}</SelectItem>)}</SelectContent>
            </Select>
            <Select value={selectedBatch} onValueChange={setSelectedBatch}>
              <SelectTrigger className="font-medium"><SelectValue placeholder="Select Batch" /></SelectTrigger>
              <SelectContent>{batches.map(b => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {selectedClass && selectedBatch && (
        <Card className="border border-slate-200/80 rounded-2xl overflow-hidden">
          <CardHeader className="bg-red-50/30 border-b border-red-100">
            <CardTitle className="text-red-700 text-lg">Action Required</CardTitle>
            <CardDescription className="text-red-600/80">Students with 3+ absences this month or consecutive absences.</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead className="text-center">Month Absences</TableHead>
                  <TableHead>Last Absent</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  [...Array(3)].map((_, i) => (
                    <TableRow key={i}><TableCell><Skeleton className="h-4 w-32" /></TableCell><TableCell><Skeleton className="h-4 w-12 mx-auto" /></TableCell><TableCell><Skeleton className="h-4 w-24" /></TableCell><TableCell><Skeleton className="h-8 w-24 ml-auto" /></TableCell></TableRow>
                  ))
                ) : alerts.length > 0 ? (
                  alerts.map(student => (
                    <TableRow key={student.id}>
                      <TableCell>
                        <p className="font-bold text-slate-800">{student.name}</p>
                        <p className="text-xs text-slate-500">{student.parentPhone || 'No phone'}</p>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge className="bg-red-100 text-red-700 border-red-200 font-extrabold">{student.monthAbsences}</Badge>
                      </TableCell>
                      <TableCell className="text-sm text-slate-600">{student.recentAbsence || '—'}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm" className="font-bold gap-1.5 h-8 border-primary/30 hover:bg-primary/5" onClick={() => { setSelectedStudent(student); setFollowUpDialogOpen(true); }}>
                          <PhoneCall className="h-3.5 w-3.5" /> Log Follow-up
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow><TableCell colSpan={4} className="text-center h-28 text-muted-foreground font-medium">No alerts for this batch! Great attendance. 🎉</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      <Dialog open={followUpDialogOpen} onOpenChange={setFollowUpDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-extrabold">Log Follow-up</DialogTitle>
            <DialogDescription>Create a follow-up task for {selectedStudent?.name}.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateFollowUp}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="type" className="text-right font-bold">Type</Label>
                <Select name="type" defaultValue="call">
                  <SelectTrigger className="col-span-3 font-medium"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="call">Phone Call</SelectItem>
                    <SelectItem value="message">Message/WhatsApp</SelectItem>
                    <SelectItem value="remark">Internal Remark</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="remark" className="text-right font-bold">Details</Label>
                <Input id="remark" name="remark" className="col-span-3" required placeholder="E.g., Called parent, student is sick." />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={isSubmitting} className="font-bold">{isSubmitting ? 'Logging...' : 'Log Follow-up'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
