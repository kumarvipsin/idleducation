'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, Edit, Calendar, CheckCircle2, Archive } from 'lucide-react';
import { getAcademicYears, addAcademicYear, updateAcademicYear } from '@/app/actions/attendance';
import type { TAcademicYear } from '@/app/actions/types';

export default function AcademicYearPage() {
  const [years, setYears] = useState<TAcademicYear[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingYear, setEditingYear] = useState<TAcademicYear | null>(null);
  const { toast } = useToast();

  const fetchYears = async () => {
    setLoading(true);
    const result = await getAcademicYears();
    if (result.success && result.data) setYears(result.data as TAcademicYear[]);
    setLoading(false);
  };

  useEffect(() => { fetchYears(); }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name') as string,
      startDate: formData.get('startDate') as string,
      endDate: formData.get('endDate') as string,
    };

    const result = editingYear
      ? await updateAcademicYear(editingYear.id, data)
      : await addAcademicYear(data);

    if (result.success) {
      toast({ title: 'Success', description: result.message });
      setIsDialogOpen(false);
      setEditingYear(null);
      fetchYears();
    } else {
      toast({ variant: 'destructive', title: 'Error', description: result.message });
    }
  };

  const handleToggleStatus = async (year: TAcademicYear) => {
    const newStatus = year.status === 'active' ? 'archived' : 'active';
    const result = await updateAcademicYear(year.id, { status: newStatus });
    if (result.success) {
      toast({ title: 'Success', description: `Academic year ${newStatus}.` });
      fetchYears();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">Academic Year</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage academic years for the attendance system.</p>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <Card className="border border-slate-200/80 dark:border-slate-800 shadow-sm rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <div>
              <CardTitle className="text-lg font-bold">Academic Years</CardTitle>
              <CardDescription className="text-xs">Create and manage academic year periods.</CardDescription>
            </div>
            <DialogTrigger asChild>
              <Button onClick={() => setEditingYear(null)} className="font-bold gap-1.5 h-9 rounded-lg">
                <PlusCircle className="h-4 w-4" /> Add Year
              </Button>
            </DialogTrigger>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>End Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  [...Array(3)].map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                    </TableRow>
                  ))
                ) : years.length > 0 ? (
                  years.map((year) => (
                    <TableRow key={year.id}>
                      <TableCell className="font-bold text-slate-800 dark:text-slate-100">{year.name}</TableCell>
                      <TableCell className="text-sm text-slate-600">{year.startDate}</TableCell>
                      <TableCell className="text-sm text-slate-600">{year.endDate}</TableCell>
                      <TableCell>
                        {year.status === 'active' ? (
                          <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px] font-extrabold uppercase gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Active
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="text-[10px] font-extrabold uppercase gap-1">
                            <Archive className="w-3 h-3" /> Archived
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button variant="outline" size="sm" className="h-8 px-2.5 text-xs font-bold gap-1"
                            onClick={() => { setEditingYear(year); setIsDialogOpen(true); }}>
                            <Edit className="h-3.5 w-3.5" /> Edit
                          </Button>
                          <Button variant="outline" size="sm"
                            className={`h-8 px-2.5 text-xs font-bold gap-1 ${year.status === 'active' ? 'text-amber-700 border-amber-300 hover:bg-amber-50' : 'text-emerald-700 border-emerald-300 hover:bg-emerald-50'}`}
                            onClick={() => handleToggleStatus(year)}>
                            {year.status === 'active' ? <><Archive className="h-3.5 w-3.5" /> Archive</> : <><CheckCircle2 className="h-3.5 w-3.5" /> Activate</>}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center h-28 text-muted-foreground font-medium">
                      No academic years found. Add your first one!
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-extrabold">{editingYear ? 'Edit Academic Year' : 'Add Academic Year'}</DialogTitle>
            <DialogDescription className="text-xs">e.g., 2026–27 (April 2026 to March 2027)</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right font-bold">Name</Label>
                <Input id="name" name="name" defaultValue={editingYear?.name} className="col-span-3" required placeholder="e.g., 2026–27" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="startDate" className="text-right font-bold">Start Date</Label>
                <Input id="startDate" name="startDate" type="date" defaultValue={editingYear?.startDate} className="col-span-3" required />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="endDate" className="text-right font-bold">End Date</Label>
                <Input id="endDate" name="endDate" type="date" defaultValue={editingYear?.endDate} className="col-span-3" required />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" className="font-bold">{editingYear ? 'Update' : 'Create'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
