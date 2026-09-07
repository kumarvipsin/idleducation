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
import { PlusCircle, Edit, CheckCircle2, XCircle, BookOpen } from 'lucide-react';
import { getSubjects, addSubject, updateSubject } from '@/app/actions/attendance';
import type { TSubject } from '@/app/actions/types';

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState<TSubject[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<TSubject | null>(null);
  const { toast } = useToast();

  const fetch = async () => {
    setLoading(true);
    const res = await getSubjects();
    if (res.success && res.data) setSubjects(res.data as TSubject[]);
    setLoading(false);
  };

  useEffect(() => { fetch(); }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data = { name: fd.get('name') as string, shortName: fd.get('shortName') as string || undefined };
    const result = editing ? await updateSubject(editing.id, data) : await addSubject(data);
    if (result.success) {
      toast({ title: 'Success', description: result.message });
      setDialogOpen(false); setEditing(null); fetch();
    } else toast({ variant: 'destructive', title: 'Error', description: result.message });
  };

  const handleToggle = async (subj: TSubject) => {
    const result = await updateSubject(subj.id, { status: subj.status === 'active' ? 'disabled' : 'active' });
    if (result.success) { toast({ title: 'Success', description: result.message }); fetch(); }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">Subjects</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage subjects for session scheduling.</p>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <Card className="border border-slate-200/80 dark:border-slate-800 shadow-sm rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <div><CardTitle className="text-lg font-bold">All Subjects</CardTitle><CardDescription className="text-xs">Dynamic list of subjects for attendance sessions.</CardDescription></div>
            <DialogTrigger asChild>
              <Button onClick={() => setEditing(null)} className="font-bold gap-1.5 h-9 rounded-lg"><PlusCircle className="h-4 w-4" /> Add Subject</Button>
            </DialogTrigger>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader><TableRow><TableHead>Subject</TableHead><TableHead>Short Name</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
              <TableBody>
                {loading ? [...Array(5)].map((_, i) => (
                  <TableRow key={i}><TableCell><Skeleton className="h-4 w-28" /></TableCell><TableCell><Skeleton className="h-4 w-16" /></TableCell><TableCell><Skeleton className="h-4 w-16" /></TableCell><TableCell><Skeleton className="h-4 w-20" /></TableCell></TableRow>
                )) : subjects.length > 0 ? subjects.map(s => (
                  <TableRow key={s.id}>
                    <TableCell className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2"><BookOpen className="h-4 w-4 text-primary/60" />{s.name}</TableCell>
                    <TableCell className="text-sm text-slate-500">{s.shortName || '—'}</TableCell>
                    <TableCell>
                      <Badge className={`text-[10px] font-extrabold uppercase ${s.status === 'active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                        {s.status === 'active' ? <CheckCircle2 className="w-3 h-3 mr-1" /> : <XCircle className="w-3 h-3 mr-1" />} {s.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button variant="outline" size="sm" className="h-8 px-2.5 text-xs font-bold gap-1" onClick={() => { setEditing(s); setDialogOpen(true); }}><Edit className="h-3.5 w-3.5" /> Edit</Button>
                        <Button variant="outline" size="sm" className={`h-8 px-2.5 text-xs font-bold gap-1 ${s.status === 'active' ? 'text-red-600 border-red-200 hover:bg-red-50' : 'text-emerald-600 border-emerald-200 hover:bg-emerald-50'}`} onClick={() => handleToggle(s)}>
                          {s.status === 'active' ? <><XCircle className="h-3.5 w-3.5" /> Disable</> : <><CheckCircle2 className="h-3.5 w-3.5" /> Enable</>}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )) : (
                  <TableRow><TableCell colSpan={4} className="text-center h-28 text-muted-foreground font-medium">No subjects yet. Add your first one!</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle className="font-extrabold">{editing ? 'Edit Subject' : 'Add Subject'}</DialogTitle><DialogDescription className="text-xs">e.g., Mathematics, Science, English</DialogDescription></DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right font-bold">Name</Label>
                <Input id="name" name="name" defaultValue={editing?.name} className="col-span-3" required placeholder="e.g., Mathematics" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="shortName" className="text-right font-bold">Short</Label>
                <Input id="shortName" name="shortName" defaultValue={editing?.shortName} className="col-span-3" placeholder="e.g., Maths" />
              </div>
            </div>
            <DialogFooter><Button type="submit" className="font-bold">{editing ? 'Update' : 'Create'}</Button></DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
