'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { PhoneCall, MessageSquare, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { getFollowUps, updateFollowUp, getAttendanceStudents } from '@/app/actions/attendance';
import type { TFollowUp, TAttendanceStudent } from '@/app/actions/types';

export default function FollowUpsPage() {
  const [followUps, setFollowUps] = useState<TFollowUp[]>([]);
  const [students, setStudents] = useState<{ [key: string]: string }>({}); // map of id -> name
  const [loading, setLoading] = useState(true);
  
  // Status Update Dialog
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<TFollowUp | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const fetchFollowUps = async () => {
    setLoading(true);
    const res = await getFollowUps();
    if (res.success && res.data) {
      const data = res.data as TFollowUp[];
      setFollowUps(data);
      
      // Fetch names for unique student IDs (basic implementation for this view)
      const uniqueStudentIds = Array.from(new Set(data.map(f => f.studentId)));
      // Note: Ideally, we'd have a bulk fetch by IDs. For now, doing a generic fetch and map
      const stuRes = await getAttendanceStudents(); // gets all students
      if (stuRes.success && stuRes.data) {
          const stuMap: { [key: string]: string } = {};
          (stuRes.data as TAttendanceStudent[]).forEach(s => { stuMap[s.id] = s.name; });
          setStudents(stuMap);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchFollowUps();
  }, []);

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedTask) return;
    setIsSubmitting(true);
    const fd = new FormData(e.currentTarget);
    
    const data = {
      status: fd.get('status') as string,
      callRemark: fd.get('remark') as string, // Using callRemark as a generic update field here
    };

    const res = await updateFollowUp(selectedTask.id, data);
    if (res.success) {
      toast({ title: 'Success', description: 'Follow-up updated successfully.' });
      setDialogOpen(false);
      fetchFollowUps();
    } else {
      toast({ variant: 'destructive', title: 'Error', description: res.message });
    }
    setIsSubmitting(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2"><PhoneCall className="h-6 w-6 text-primary" /> Follow-ups</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage and track parent communication and internal alerts.</p>
      </div>

      <Card className="border border-slate-200/80 rounded-2xl">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Student</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Details</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                    <TableCell><Skeleton className="h-8 w-20 ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : followUps.length > 0 ? (
                followUps.map(task => (
                  <TableRow key={task.id} className={task.status === 'RESOLVED' ? 'opacity-60 bg-slate-50/50' : ''}>
                    <TableCell className="text-xs font-medium text-slate-500 whitespace-nowrap">
                      {new Date(task.createdAt || '').toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </TableCell>
                    <TableCell className="font-bold text-slate-800">{students[task.studentId] || 'Unknown Student'}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-sm font-medium text-slate-600 capitalize">
                        {task.type === 'call' ? <PhoneCall className="h-3.5 w-3.5 text-blue-500" /> : 
                         task.type === 'message' ? <MessageSquare className="h-3.5 w-3.5 text-emerald-500" /> : 
                         <AlertCircle className="h-3.5 w-3.5 text-amber-500" />}
                        {task.type}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={`text-[10px] font-extrabold uppercase ${
                        task.status === 'OPEN' ? 'bg-amber-100 text-amber-700 border-amber-200' :
                        task.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                        'bg-slate-100 text-slate-600 border-slate-200'
                      }`}>
                        {task.status.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-slate-600 max-w-xs truncate">
                      {task.callRemark || task.messageRemark || 'No details'}
                    </TableCell>
                    <TableCell className="text-right">
                      {task.status !== 'RESOLVED' ? (
                        <Button variant="outline" size="sm" className="font-bold gap-1.5 h-8 text-xs border-primary/30 text-primary" onClick={() => { setSelectedTask(task); setDialogOpen(true); }}>
                           Update
                        </Button>
                      ) : (
                        <span className="text-xs font-bold text-emerald-600 flex items-center justify-end gap-1"><CheckCircle2 className="h-3.5 w-3.5" /> Resolved</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow><TableCell colSpan={6} className="text-center h-28 text-muted-foreground font-medium">No follow-ups logged yet.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-extrabold">Update Follow-up</DialogTitle>
            <DialogDescription>Update the status and add new remarks.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdate}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right font-bold">Status</Label>
                <Select name="status" defaultValue={selectedTask?.status || 'IN_PROGRESS'}>
                  <SelectTrigger className="col-span-3 font-medium"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="OPEN">Open</SelectItem>
                    <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                    <SelectItem value="RESOLVED">Resolved</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="remark" className="text-right font-bold pt-2">Update Note</Label>
                <Textarea id="remark" name="remark" className="col-span-3" placeholder="Add latest update details..." defaultValue={selectedTask?.callRemark} />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={isSubmitting} className="font-bold">{isSubmitting ? 'Updating...' : 'Save Update'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
