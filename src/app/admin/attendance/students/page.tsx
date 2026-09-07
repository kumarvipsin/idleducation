'use client';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import {
  Users, UserPlus, Search, Edit2, Trash2,
  ClipboardList, CheckCircle2, Phone, GraduationCap,
  ArrowRight, Shield
} from 'lucide-react';
import {
  getAttendanceClasses, getAttendanceStudents,
  createAttendanceStudent, updateAttendanceStudent,
  deleteAttendanceStudent
} from '@/app/actions/attendance';
import type { TAttendanceClass, TAttendanceStudent } from '@/app/actions/types';

export default function StudentEnrollmentPage() {
  const { toast } = useToast();

  const [classes, setClasses] = useState<TAttendanceClass[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [students, setStudents] = useState<TAttendanceStudent[]>([]);
  const [loading, setLoading] = useState(true);

  // Add Student Dialog State
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newCode, setNewCode] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newParentPhone, setNewParentPhone] = useState('');
  const [newClassId, setNewClassId] = useState('');
  const [submittingAdd, setSubmittingAdd] = useState(false);

  // Edit Student Dialog State
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<TAttendanceStudent | null>(null);
  const [submittingEdit, setSubmittingEdit] = useState(false);

  // Load classes
  useEffect(() => {
    (async () => {
      setLoading(true);
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
        if (uniqueClasses.length > 0) {
          setSelectedClassId(uniqueClasses[0].id);
          setNewClassId(uniqueClasses[0].id);
        }
      }
      setLoading(false);
    })();
  }, []);

  // Load students for active class
  const loadStudents = async () => {
    if (!selectedClassId) return;
    setLoading(true);
    const res = await getAttendanceStudents(selectedClassId);
    if (res.success && res.data) {
      setStudents(res.data as TAttendanceStudent[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (selectedClassId) {
      loadStudents();
    }
  }, [selectedClassId]);

  // Open Add Dialog with active class pre-selected
  const handleOpenAdd = () => {
    setNewClassId(selectedClassId);
    setAddDialogOpen(true);
  };

  // Submit Add Student
  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) {
      toast({ variant: 'destructive', title: 'Name Required', description: 'Please enter student name.' });
      return;
    }
    const targetClassId = newClassId || selectedClassId;
    if (!targetClassId) {
      toast({ variant: 'destructive', title: 'Class Required', description: 'Please choose a class.' });
      return;
    }

    setSubmittingAdd(true);
    const res = await createAttendanceStudent({
      name: newName.trim(),
      studentCode: newCode.trim() || `STU-${Date.now().toString().slice(-4)}`,
      phone: newPhone.trim(),
      parentPhone: newParentPhone.trim(),
      classId: targetClassId,
      batchId: 'default',
    });

    if (res.success) {
      toast({ title: 'Student Added', description: `${newName} added successfully.` });
      setAddDialogOpen(false);
      setNewName('');
      setNewCode('');
      setNewPhone('');
      setNewParentPhone('');
      loadStudents();
    } else {
      toast({ variant: 'destructive', title: 'Error', description: res.message });
    }
    setSubmittingAdd(false);
  };

  // Submit Edit Student
  const handleEditStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;

    setSubmittingEdit(true);
    const res = await updateAttendanceStudent(editingStudent.id, {
      name: editingStudent.name,
      studentCode: editingStudent.studentCode,
      phone: editingStudent.phone,
      parentPhone: editingStudent.parentPhone,
      classId: editingStudent.classId,
    });

    if (res.success) {
      toast({ title: 'Student Updated', description: `${editingStudent.name} updated.` });
      setEditDialogOpen(false);
      setEditingStudent(null);
      loadStudents();
    } else {
      toast({ variant: 'destructive', title: 'Error', description: res.message });
    }
    setSubmittingEdit(false);
  };

  // Delete / Remove Student
  const handleDeleteStudent = async (stu: TAttendanceStudent) => {
    if (!confirm(`Are you sure you want to remove ${stu.name}?`)) return;
    const res = await deleteAttendanceStudent(stu.id);
    if (res.success) {
      toast({ title: 'Removed', description: `${stu.name} has been removed.` });
      loadStudents();
    } else {
      toast({ variant: 'destructive', title: 'Error', description: res.message });
    }
  };

  // Filtered students by search
  const filteredStudents = useMemo(() => {
    return students.filter(s => {
      const q = searchQuery.toLowerCase();
      return (
        (s.name || '').toLowerCase().includes(q) ||
        (s.studentCode || '').toLowerCase().includes(q) ||
        (s.phone || '').includes(q) ||
        (s.parentPhone || '').includes(q)
      );
    });
  }, [students, searchQuery]);

  const selectedClassName = classes.find(c => c.id === selectedClassId)?.name || 'Class';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Users className="h-6 w-6 text-primary" /> Students Management
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage Class 9th and Class 10th students, roll numbers, and parent contacts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/admin/attendance/mark">
            <Button variant="outline" size="sm" className="font-bold text-xs h-9 gap-1">
              <ClipboardList className="h-4 w-4" /> Take Attendance
            </Button>
          </Link>
          <Button onClick={handleOpenAdd} className="font-bold text-xs gap-1.5 h-9">
            <UserPlus className="h-4 w-4" /> Add Student
          </Button>
        </div>
      </div>

      {/* Class Switcher & Search Bar */}
      <Card className="border border-slate-200/80 shadow-sm rounded-2xl">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            {/* Class Tabs */}
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
                      className={`px-5 py-2.5 rounded-xl font-bold text-sm transition border flex items-center gap-2 ${
                        isSelected
                          ? 'bg-primary text-primary-foreground border-primary shadow-sm ring-2 ring-primary/20'
                          : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      <GraduationCap className="h-4 w-4" />
                      {cls.displayName || cls.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search name, roll, phone..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-8 text-xs font-medium h-9"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Student List Table */}
      <Card className="border border-slate-200/80 shadow-sm rounded-2xl overflow-hidden">
        <CardHeader className="pb-3 border-b bg-slate-50/50">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold text-slate-800">
                {selectedClassName} Students ({filteredStudents.length})
              </CardTitle>
              <CardDescription className="text-xs">
                Active students enrolled in this class.
              </CardDescription>
            </div>

            <Button
              size="sm"
              onClick={handleOpenAdd}
              className="h-8 text-xs font-bold gap-1"
            >
              <UserPlus className="h-3.5 w-3.5" /> + Add to {selectedClassName}
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-0 overflow-x-auto">
          {loading ? (
            <div className="p-6 space-y-3">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full rounded-xl" />
              ))}
            </div>
          ) : filteredStudents.length > 0 ? (
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b text-slate-600 font-bold">
                  <th className="p-3 pl-4">Roll No</th>
                  <th className="p-3">Student Name</th>
                  <th className="p-3">Student Phone</th>
                  <th className="p-3">Parent Phone</th>
                  <th className="p-3">Class</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right pr-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudents.map((stu, idx) => (
                  <tr key={stu.id} className="hover:bg-slate-50/70 transition">
                    <td className="p-3 pl-4 font-mono font-bold text-slate-700">
                      {stu.studentCode || `STU-${idx + 1}`}
                    </td>

                    <td className="p-3">
                      <div className="flex items-center gap-2.5">
                        <Avatar className="h-7 w-7 border">
                          <AvatarImage src={stu.photoURL} />
                          <AvatarFallback className="text-[10px] font-bold bg-primary/10 text-primary">
                            {(stu.name || 'S').slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-bold text-slate-900 text-xs">{stu.name}</span>
                      </div>
                    </td>

                    <td className="p-3">
                      {stu.phone ? (
                        <span className="flex items-center gap-1 text-slate-700 font-medium">
                          <Phone className="h-3 w-3 text-slate-400" /> {stu.phone}
                        </span>
                      ) : (
                        <span className="text-slate-400 italic">—</span>
                      )}
                    </td>

                    <td className="p-3">
                      {stu.parentPhone ? (
                        <span className="font-medium text-slate-700">
                          {stu.parentPhone}
                        </span>
                      ) : (
                        <span className="text-slate-400 italic">—</span>
                      )}
                    </td>

                    <td className="p-3">
                      <Badge className="bg-primary/10 text-primary border-primary/20 text-[10px] font-bold">
                        {selectedClassName}
                      </Badge>
                    </td>

                    <td className="p-3">
                      <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px] font-bold">
                        <CheckCircle2 className="h-3 w-3 mr-1" /> Active
                      </Badge>
                    </td>

                    <td className="p-3 text-right pr-4">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-slate-600 hover:bg-slate-100"
                          onClick={() => {
                            setEditingStudent(stu);
                            setEditDialogOpen(true);
                          }}
                          title="Edit Student"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </Button>

                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-red-500 hover:bg-red-50"
                          onClick={() => handleDeleteStudent(stu)}
                          title="Remove Student"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-12 text-center flex flex-col items-center justify-center">
              <Users className="h-10 w-10 text-muted-foreground/30 mb-2" />
              <p className="font-bold text-sm text-slate-800">No students found in {selectedClassName}.</p>
              <p className="text-xs text-muted-foreground mt-1 mb-4">
                Add students to {selectedClassName} to start managing attendance.
              </p>
              <Button size="sm" onClick={handleOpenAdd} className="font-bold text-xs gap-1.5">
                <UserPlus className="h-3.5 w-3.5" /> + Add Student
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* DIALOG 1: Add New Student */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <form onSubmit={handleAddStudent}>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <UserPlus className="h-5 w-5 text-primary" /> Add New Student
              </DialogTitle>
              <DialogDescription className="text-xs">
                Add student to {selectedClassName} with Roll Number and Contact details.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3.5 py-4">
              <div className="space-y-1">
                <Label className="text-xs font-bold">Class *</Label>
                <Select value={newClassId} onValueChange={setNewClassId} required>
                  <SelectTrigger className="h-9 text-xs"><SelectValue placeholder="Select Class" /></SelectTrigger>
                  <SelectContent>
                    {classes.map(c => (
                      <SelectItem key={c.id} value={c.id}>{c.displayName || c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs font-bold">Full Name *</Label>
                  <Input
                    required
                    placeholder="e.g. Amod Kumar"
                    value={newName}
                    onChange={e => setNewName(e.target.value)}
                    className="h-9 text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-bold">Roll / Student Code</Label>
                  <Input
                    placeholder="e.g. 101"
                    value={newCode}
                    onChange={e => setNewCode(e.target.value)}
                    className="h-9 text-xs font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs font-bold">Student Phone</Label>
                  <Input
                    placeholder="Student contact"
                    value={newPhone}
                    onChange={e => setNewPhone(e.target.value)}
                    className="h-9 text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-bold">Parent Phone</Label>
                  <Input
                    placeholder="Parent contact"
                    value={newParentPhone}
                    onChange={e => setNewParentPhone(e.target.value)}
                    className="h-9 text-xs"
                  />
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setAddDialogOpen(false)} className="text-xs">
                Cancel
              </Button>
              <Button type="submit" disabled={submittingAdd} className="font-bold text-xs">
                {submittingAdd ? 'Saving...' : 'Add Student'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* DIALOG 2: Edit Student */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          {editingStudent && (
            <form onSubmit={handleEditStudent}>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Edit2 className="h-5 w-5 text-primary" /> Edit Student Details
                </DialogTitle>
                <DialogDescription className="text-xs">
                  Update student name, roll number, class or contact numbers.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-3.5 py-4">
                <div className="space-y-1">
                  <Label className="text-xs font-bold">Class</Label>
                  <Select
                    value={editingStudent.classId}
                    onValueChange={v => setEditingStudent({ ...editingStudent, classId: v })}
                  >
                    <SelectTrigger className="h-9 text-xs"><SelectValue placeholder="Select Class" /></SelectTrigger>
                    <SelectContent>
                      {classes.map(c => (
                        <SelectItem key={c.id} value={c.id}>{c.displayName || c.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs font-bold">Full Name</Label>
                    <Input
                      required
                      value={editingStudent.name || ''}
                      onChange={e => setEditingStudent({ ...editingStudent, name: e.target.value })}
                      className="h-9 text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs font-bold">Roll / Code</Label>
                    <Input
                      value={editingStudent.studentCode || ''}
                      onChange={e => setEditingStudent({ ...editingStudent, studentCode: e.target.value })}
                      className="h-9 text-xs font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs font-bold">Student Phone</Label>
                    <Input
                      value={editingStudent.phone || ''}
                      onChange={e => setEditingStudent({ ...editingStudent, phone: e.target.value })}
                      className="h-9 text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs font-bold">Parent Phone</Label>
                    <Input
                      value={editingStudent.parentPhone || ''}
                      onChange={e => setEditingStudent({ ...editingStudent, parentPhone: e.target.value })}
                      className="h-9 text-xs"
                    />
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setEditDialogOpen(false)} className="text-xs">
                  Cancel
                </Button>
                <Button type="submit" disabled={submittingEdit} className="font-bold text-xs">
                  {submittingEdit ? 'Saving...' : 'Save Changes'}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
