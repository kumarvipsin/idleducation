'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, Edit, CheckCircle2, XCircle, ChevronRight, Clock, Users } from 'lucide-react';
import { getAcademicYears, getAttendanceClasses, addAttendanceClass, updateAttendanceClass, getBatches, addBatch, updateBatch } from '@/app/actions/attendance';
import type { TAcademicYear, TAttendanceClass, TBatch } from '@/app/actions/types';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function ClassesBatchesPage() {
  const [years, setYears] = useState<TAcademicYear[]>([]);
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [classes, setClasses] = useState<TAttendanceClass[]>([]);
  const [batches, setBatches] = useState<TBatch[]>([]);
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [classDialogOpen, setClassDialogOpen] = useState(false);
  const [batchDialogOpen, setBatchDialogOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<TAttendanceClass | null>(null);
  const [editingBatch, setEditingBatch] = useState<TBatch | null>(null);
  const [selectedDays, setSelectedDays] = useState<string[]>(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']);
  const { toast } = useToast();

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
      const res = await getAttendanceClasses(selectedYear);
      if (res.success && res.data) {
        const clsList = res.data as TAttendanceClass[];
        setClasses(clsList);
        if (clsList.length > 0) {
          setSelectedClass(prev => prev && clsList.some(c => c.id === prev) ? prev : clsList[0].id);
        }
      }
      setLoading(false);
    })();
  }, [selectedYear]);

  useEffect(() => {
    if (!selectedClass) { setBatches([]); return; }
    (async () => {
      const res = await getBatches(selectedClass);
      if (res.success && res.data) setBatches(res.data as TBatch[]);
    })();
  }, [selectedClass]);

  const handleClassSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data = { name: fd.get('name') as string, displayName: fd.get('displayName') as string || undefined, academicYearId: selectedYear, order: parseInt(fd.get('order') as string) || 0 };
    const result = editingClass ? await updateAttendanceClass(editingClass.id, data) : await addAttendanceClass(data);
    if (result.success) {
      toast({ title: 'Success', description: result.message });
      setClassDialogOpen(false); setEditingClass(null);
      const res = await getAttendanceClasses(selectedYear);
      if (res.success && res.data) setClasses(res.data as TAttendanceClass[]);
    } else toast({ variant: 'destructive', title: 'Error', description: result.message });
  };

  const handleBatchSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data = {
      classId: selectedClass, academicYearId: selectedYear,
      name: fd.get('name') as string,
      startTime: fd.get('startTime') as string,
      endTime: fd.get('endTime') as string,
      daysOfWeek: selectedDays,
    };
    const result = editingBatch ? await updateBatch(editingBatch.id, { name: data.name, startTime: data.startTime, endTime: data.endTime, daysOfWeek: data.daysOfWeek }) : await addBatch(data);
    if (result.success) {
      toast({ title: 'Success', description: result.message });
      setBatchDialogOpen(false); setEditingBatch(null);
      const res = await getBatches(selectedClass);
      if (res.success && res.data) setBatches(res.data as TBatch[]);
    } else toast({ variant: 'destructive', title: 'Error', description: result.message });
  };

  const handleClassStatusToggle = async (cls: TAttendanceClass) => {
    const result = await updateAttendanceClass(cls.id, { status: cls.status === 'active' ? 'disabled' : 'active' });
    if (result.success) { toast({ title: 'Success', description: result.message }); const res = await getAttendanceClasses(selectedYear); if (res.success && res.data) setClasses(res.data as TAttendanceClass[]); }
  };

  const handleBatchStatusToggle = async (batch: TBatch) => {
    const result = await updateBatch(batch.id, { status: batch.status === 'active' ? 'disabled' : 'active' });
    if (result.success) { toast({ title: 'Success', description: result.message }); const res = await getBatches(selectedClass); if (res.success && res.data) setBatches(res.data as TBatch[]); }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">Classes & Batches</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage class structure and batch scheduling.</p>
        </div>
        <Select value={selectedYear} onValueChange={setSelectedYear}>
          <SelectTrigger className="w-48 font-bold"><SelectValue placeholder="Academic Year" /></SelectTrigger>
          <SelectContent>
            {years.map(y => <SelectItem key={y.id} value={y.id}>{y.name}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Classes Panel */}
        <Dialog open={classDialogOpen} onOpenChange={setClassDialogOpen}>
          <Card className="border border-slate-200/80 dark:border-slate-800 shadow-sm rounded-2xl">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <div><CardTitle className="text-lg font-bold">Classes</CardTitle><CardDescription className="text-xs">All classes for this academic year.</CardDescription></div>
              <DialogTrigger asChild>
                <Button onClick={() => setEditingClass(null)} size="sm" className="font-bold gap-1.5 h-9 rounded-lg" disabled={!selectedYear}>
                  <PlusCircle className="h-4 w-4" /> Add Class
                </Button>
              </DialogTrigger>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Order</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
                <TableBody>
                  {loading ? [...Array(4)].map((_, i) => (
                    <TableRow key={i}><TableCell><Skeleton className="h-4 w-20" /></TableCell><TableCell><Skeleton className="h-4 w-8" /></TableCell><TableCell><Skeleton className="h-4 w-16" /></TableCell><TableCell><Skeleton className="h-4 w-20" /></TableCell></TableRow>
                  )) : classes.length > 0 ? classes.map(cls => (
                    <TableRow key={cls.id} className={`cursor-pointer ${selectedClass === cls.id ? 'bg-primary/5 border-l-2 border-l-primary' : ''}`} onClick={() => setSelectedClass(cls.id)}>
                      <TableCell className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                        {selectedClass === cls.id && <ChevronRight className="h-4 w-4 text-primary" />}
                        {cls.displayName || cls.name}
                      </TableCell>
                      <TableCell className="text-sm text-slate-500">{cls.order}</TableCell>
                      <TableCell>
                        <Badge className={`text-[10px] font-extrabold uppercase ${cls.status === 'active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                          {cls.status === 'active' ? <CheckCircle2 className="w-3 h-3 mr-1" /> : <XCircle className="w-3 h-3 mr-1" />} {cls.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1" onClick={e => e.stopPropagation()}>
                          <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={() => { setEditingClass(cls); setClassDialogOpen(true); }}><Edit className="h-3 w-3" /></Button>
                          <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={() => handleClassStatusToggle(cls)}>
                            {cls.status === 'active' ? <XCircle className="h-3 w-3 text-red-500" /> : <CheckCircle2 className="h-3 w-3 text-emerald-500" />}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )) : (
                    <TableRow><TableCell colSpan={4} className="text-center h-20 text-muted-foreground text-sm">No classes yet. {selectedYear ? 'Add your first class!' : 'Select an academic year first.'}</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          <DialogContent className="sm:max-w-md">
            <DialogHeader><DialogTitle className="font-extrabold">{editingClass ? 'Edit Class' : 'Add Class'}</DialogTitle></DialogHeader>
            <form onSubmit={handleClassSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right font-bold">Name</Label>
                  <Input id="name" name="name" defaultValue={editingClass?.name} className="col-span-3" required placeholder="e.g., Class 10" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="displayName" className="text-right font-bold">Display</Label>
                  <Input id="displayName" name="displayName" defaultValue={editingClass?.displayName} className="col-span-3" placeholder="Optional display name" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="order" className="text-right font-bold">Order</Label>
                  <Input id="order" name="order" type="number" defaultValue={editingClass?.order || classes.length + 1} className="col-span-3" required />
                </div>
              </div>
              <DialogFooter><Button type="submit" className="font-bold">{editingClass ? 'Update' : 'Create'}</Button></DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Batches Panel */}
        <Dialog open={batchDialogOpen} onOpenChange={setBatchDialogOpen}>
          <Card className="border border-slate-200/80 dark:border-slate-800 shadow-sm rounded-2xl">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <div>
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  Batches
                  {selectedClass && <Badge variant="secondary" className="text-[10px] font-bold">{classes.find(c => c.id === selectedClass)?.name}</Badge>}
                </CardTitle>
                <CardDescription className="text-xs">Batch schedules for the selected class.</CardDescription>
              </div>
              <DialogTrigger asChild>
                <Button onClick={() => { setEditingBatch(null); setSelectedDays(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']); }} size="sm" className="font-bold gap-1.5 h-9 rounded-lg" disabled={!selectedClass}>
                  <PlusCircle className="h-4 w-4" /> Add Batch
                </Button>
              </DialogTrigger>
            </CardHeader>
            <CardContent>
              {!selectedClass ? (
                <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
                  <Users className="h-8 w-8 mb-2 opacity-40" />
                  <p className="text-sm font-medium">Select a class to view batches</p>
                </div>
              ) : (
                <Table>
                  <TableHeader><TableRow><TableHead>Batch</TableHead><TableHead>Time</TableHead><TableHead>Days</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
                  <TableBody>
                    {batches.length > 0 ? batches.map(batch => (
                      <TableRow key={batch.id}>
                        <TableCell className="font-bold text-slate-800 dark:text-slate-100">{batch.name}</TableCell>
                        <TableCell className="text-xs text-slate-600 whitespace-nowrap">
                          <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" /> {batch.startTime} – {batch.endTime}</span>
                        </TableCell>
                        <TableCell className="text-xs text-slate-500">{batch.daysOfWeek?.join(', ')}</TableCell>
                        <TableCell>
                          <Badge className={`text-[10px] font-extrabold uppercase ${batch.status === 'active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                            {batch.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={() => { setEditingBatch(batch); setSelectedDays(batch.daysOfWeek || []); setBatchDialogOpen(true); }}><Edit className="h-3 w-3" /></Button>
                            <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={() => handleBatchStatusToggle(batch)}>
                              {batch.status === 'active' ? <XCircle className="h-3 w-3 text-red-500" /> : <CheckCircle2 className="h-3 w-3 text-emerald-500" />}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )) : (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground text-sm">
                          <p className="font-semibold text-slate-700">No batches yet for this class.</p>
                          <p className="text-xs text-muted-foreground mt-1 mb-3">Create a batch schedule to mark student attendance.</p>
                          <Button size="sm" onClick={() => { setEditingBatch(null); setBatchDialogOpen(true); }} className="font-bold text-xs gap-1">
                            <PlusCircle className="h-3.5 w-3.5" /> Add First Batch
                          </Button>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
          <DialogContent className="sm:max-w-md">
            <DialogHeader><DialogTitle className="font-extrabold">{editingBatch ? 'Edit Batch' : 'Add Batch'}</DialogTitle></DialogHeader>
            <form onSubmit={handleBatchSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="batchName" className="text-right font-bold">Name</Label>
                  <Input id="batchName" name="name" defaultValue={editingBatch?.name} className="col-span-3" required placeholder="e.g., Batch A" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="startTime" className="text-right font-bold">Start</Label>
                  <Input id="startTime" name="startTime" type="time" defaultValue={editingBatch?.startTime || '17:00'} className="col-span-3" required />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="endTime" className="text-right font-bold">End</Label>
                  <Input id="endTime" name="endTime" type="time" defaultValue={editingBatch?.endTime || '18:00'} className="col-span-3" required />
                </div>
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label className="text-right font-bold pt-2">Days</Label>
                  <div className="col-span-3 flex flex-wrap gap-3">
                    {DAYS.map(day => (
                      <label key={day} className="flex items-center gap-1.5 text-sm font-medium cursor-pointer">
                        <Checkbox checked={selectedDays.includes(day)} onCheckedChange={(checked) => {
                          setSelectedDays(prev => checked ? [...prev, day] : prev.filter(d => d !== day));
                        }} />
                        {day}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              <DialogFooter><Button type="submit" className="font-bold">{editingBatch ? 'Update' : 'Create'}</Button></DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
