'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAttendance } from '@/context/attendance-context';
import {
  Users,
  Mail,
  Phone,
  BookOpen,
  Calendar,
  ArrowRight,
  Plus,
  Edit2,
  Archive,
  RotateCcw,
  Trash2,
  Search,
  CheckCircle2,
  AlertTriangle,
  UserPlus,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { TTeacher } from '@/lib/attendance-store';

export default function TeachersPage() {
  const {
    teachers,
    schedules,
    addTeacher,
    updateTeacher,
    archiveTeacher,
    restoreTeacher,
    deleteTeacherSafe,
  } = useAttendance();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'archived'>('all');

  // Modals
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editItem, setEditItem] = useState<TTeacher | null>(null);
  const [deleteConfirmItem, setDeleteConfirmItem] = useState<TTeacher | null>(null);

  // Form
  const [formName, setFormName] = useState('');
  const [formSubject, setFormSubject] = useState('Mathematics');
  const [formPhone, setFormPhone] = useState('+91 98765 00000');
  const [formEmail, setFormEmail] = useState('');
  const [formJoiningDate, setFormJoiningDate] = useState('2026-04-01');
  const [formNotes, setFormNotes] = useState('');

  const filteredTeachers = teachers.filter(t => {
    if (search.trim()) {
      const q = search.toLowerCase();
      const match =
        t.name.toLowerCase().includes(q) ||
        t.subject.toLowerCase().includes(q) ||
        t.email.toLowerCase().includes(q) ||
        t.phone.includes(q);
      if (!match) return false;
    }
    if (statusFilter !== 'all' && t.status !== statusFilter) return false;
    return true;
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    addTeacher({
      name: formName.trim(),
      subject: formSubject.trim(),
      phone: formPhone.trim(),
      email: formEmail.trim() || `${formName.toLowerCase().replace(/\s+/g, '.')}@idleducation.com`,
      status: 'active',
      joiningDate: formJoiningDate,
      notes: formNotes,
    });

    setIsAddOpen(false);
    resetForm();
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editItem) return;

    updateTeacher(editItem.id, {
      name: formName || editItem.name,
      subject: formSubject || editItem.subject,
      phone: formPhone || editItem.phone,
      email: formEmail || editItem.email,
      joiningDate: formJoiningDate || editItem.joiningDate,
      notes: formNotes,
    });

    setEditItem(null);
    resetForm();
  };

  const resetForm = () => {
    setFormName('');
    setFormPhone('');
    setFormEmail('');
    setFormNotes('');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl md:text-2xl font-black tracking-tight text-slate-900">
              Faculty &amp; Teachers Management
            </h1>
            <Badge className="bg-blue-50 text-blue-700 border-blue-200 font-bold text-xs">
              {teachers.filter(t => t.status === 'active').length} Active Faculty
            </Badge>
          </div>
          <p className="text-xs md:text-sm text-slate-500 mt-1 font-medium">
            Manage instructors, assigned batches, and preserve historical teaching records on archive.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={() => {
              resetForm();
              setIsAddOpen(true);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs h-9 px-4 gap-1.5 shadow-sm"
          >
            <UserPlus className="h-3.5 w-3.5" />
            + Add Teacher
          </Button>
        </div>
      </div>

      {/* Search & Status Filter */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search by teacher name or subject..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9 h-9 text-xs"
          />
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant={statusFilter === 'all' ? 'default' : 'outline'}
            onClick={() => setStatusFilter('all')}
            className={`text-xs h-8 ${statusFilter === 'all' ? 'bg-blue-600' : 'border-slate-300'}`}
          >
            All Teachers
          </Button>
          <Button
            size="sm"
            variant={statusFilter === 'active' ? 'default' : 'outline'}
            onClick={() => setStatusFilter('active')}
            className={`text-xs h-8 ${statusFilter === 'active' ? 'bg-blue-600' : 'border-slate-300'}`}
          >
            Active Only
          </Button>
          <Button
            size="sm"
            variant={statusFilter === 'archived' ? 'default' : 'outline'}
            onClick={() => setStatusFilter('archived')}
            className={`text-xs h-8 ${statusFilter === 'archived' ? 'bg-blue-600' : 'border-slate-300'}`}
          >
            Archived
          </Button>
        </div>
      </div>

      {/* Teachers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTeachers.length === 0 ? (
          <div className="col-span-full p-12 text-center text-slate-500 bg-white rounded-xl border border-slate-200 space-y-3">
            <Users className="h-10 w-10 text-slate-300 mx-auto" />
            <h4 className="font-bold text-slate-900 text-sm">No Faculty Found</h4>
            <p className="text-xs text-slate-500">No teachers found matching your filter criteria.</p>
            <Button
              size="sm"
              onClick={() => {
                resetForm();
                setIsAddOpen(true);
              }}
              className="bg-blue-600 text-white font-bold text-xs"
            >
              + Add Teacher Now
            </Button>
          </div>
        ) : (
          filteredTeachers.map(t => {
            const scheduledCount = schedules.filter(s => s.teacherName === t.name).length;
            const isArchived = t.status === 'archived';

            return (
              <Card
                key={t.id}
                className={`border-slate-200 shadow-xs hover:shadow transition-shadow ${
                  isArchived ? 'opacity-60 bg-slate-50' : 'bg-white'
                }`}
              >
                <CardContent className="p-5 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-xl bg-gradient-to-tr from-slate-900 to-blue-900 text-white font-black text-lg flex items-center justify-center shadow">
                        {t.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-slate-900">{t.name}</h3>
                        <p className="text-xs text-blue-600 font-semibold">{t.subject}</p>
                      </div>
                    </div>
                    <Badge
                      className={`text-[10px] font-bold ${
                        isArchived
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      }`}
                    >
                      {t.status}
                    </Badge>
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
                    <div className="flex items-center gap-2">
                      <Phone className="h-3.5 w-3.5 text-slate-400" />
                      <span>{t.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-3.5 w-3.5 text-slate-400" />
                      <span>{t.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3.5 w-3.5 text-slate-400" />
                      <span>
                        Classes Scheduled: <strong>{scheduledCount} Sessions</strong>
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setEditItem(t);
                        setFormName(t.name);
                        setFormSubject(t.subject);
                        setFormPhone(t.phone);
                        setFormEmail(t.email);
                        setFormJoiningDate(t.joiningDate || '2026-04-01');
                        setFormNotes(t.notes || '');
                      }}
                      className="text-slate-600 hover:text-slate-900 text-xs h-7 px-2"
                    >
                      <Edit2 className="h-3 w-3 mr-1" />
                      Edit
                    </Button>

                    {isArchived ? (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => restoreTeacher(t.id)}
                        className="text-emerald-700 hover:bg-emerald-50 text-xs h-7 px-2 font-semibold"
                      >
                        <RotateCcw className="h-3 w-3 mr-1" />
                        Restore
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => archiveTeacher(t.id)}
                        className="text-amber-700 hover:bg-amber-50 text-xs h-7 px-2"
                      >
                        <Archive className="h-3 w-3 mr-1" />
                        Archive
                      </Button>
                    )}

                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setDeleteConfirmItem(t)}
                      className="text-rose-600 hover:bg-rose-50 text-xs h-7 px-2"
                    >
                      <Trash2 className="h-3 w-3 mr-1" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Add Teacher Modal */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">Add New Teacher</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleAddSubmit} className="space-y-3.5 py-2 text-xs">
            <div>
              <Label className="text-xs font-semibold">Teacher Full Name *</Label>
              <Input
                placeholder="e.g. Dr. Ramesh Chander"
                value={formName}
                onChange={e => setFormName(e.target.value)}
                className="mt-1 h-9 text-xs"
                required
              />
            </div>
            <div>
              <Label className="text-xs font-semibold">Primary Teaching Subject *</Label>
              <Input
                placeholder="e.g. Physics, Chemistry, Mathematics"
                value={formSubject}
                onChange={e => setFormSubject(e.target.value)}
                className="mt-1 h-9 text-xs"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs font-semibold">Phone Number</Label>
                <Input
                  value={formPhone}
                  onChange={e => setFormPhone(e.target.value)}
                  className="mt-1 h-9 text-xs"
                  required
                />
              </div>
              <div>
                <Label className="text-xs font-semibold">Joining Date</Label>
                <Input
                  type="date"
                  value={formJoiningDate}
                  onChange={e => setFormJoiningDate(e.target.value)}
                  className="mt-1 h-9 text-xs"
                />
              </div>
            </div>
            <div>
              <Label className="text-xs font-semibold">Email Address</Label>
              <Input
                type="email"
                placeholder="teacher@idleducation.com"
                value={formEmail}
                onChange={e => setFormEmail(e.target.value)}
                className="mt-1 h-9 text-xs"
              />
            </div>
            <div>
              <Label className="text-xs font-semibold">Notes / Qualifications</Label>
              <Textarea
                placeholder="Degrees, previous institute, availability..."
                value={formNotes}
                onChange={e => setFormNotes(e.target.value)}
                className="mt-1 text-xs h-16"
              />
            </div>
            <DialogFooter className="pt-2">
              <Button variant="outline" size="sm" type="button" onClick={() => setIsAddOpen(false)}>
                Cancel
              </Button>
              <Button size="sm" type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold">
                Add Faculty
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Teacher Modal */}
      <Dialog open={!!editItem} onOpenChange={open => !open && setEditItem(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">Edit Teacher Information</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleEditSubmit} className="space-y-3.5 py-2 text-xs">
            <div>
              <Label className="text-xs font-semibold">Full Name</Label>
              <Input
                value={formName}
                onChange={e => setFormName(e.target.value)}
                className="mt-1 h-9 text-xs"
                required
              />
            </div>
            <div>
              <Label className="text-xs font-semibold">Subject</Label>
              <Input
                value={formSubject}
                onChange={e => setFormSubject(e.target.value)}
                className="mt-1 h-9 text-xs"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs font-semibold">Phone</Label>
                <Input
                  value={formPhone}
                  onChange={e => setFormPhone(e.target.value)}
                  className="mt-1 h-9 text-xs"
                />
              </div>
              <div>
                <Label className="text-xs font-semibold">Email</Label>
                <Input
                  value={formEmail}
                  onChange={e => setFormEmail(e.target.value)}
                  className="mt-1 h-9 text-xs"
                />
              </div>
            </div>
            <div>
              <Label className="text-xs font-semibold">Notes</Label>
              <Textarea
                value={formNotes}
                onChange={e => setFormNotes(e.target.value)}
                className="mt-1 text-xs h-16"
              />
            </div>
            <DialogFooter className="pt-2">
              <Button variant="outline" size="sm" type="button" onClick={() => setEditItem(null)}>
                Cancel
              </Button>
              <Button size="sm" type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold">
                Update Faculty
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Teacher Confirmation */}
      <Dialog open={!!deleteConfirmItem} onOpenChange={open => !open && setDeleteConfirmItem(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-rose-700 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-rose-600" />
              Delete Teacher {deleteConfirmItem?.name}?
            </DialogTitle>
            <DialogDescription className="text-xs">
              If this teacher has conducted any classes, use Archive instead to protect past class attendance records.
            </DialogDescription>
          </DialogHeader>

          <p className="text-xs text-slate-600 py-2">
            Archiving preserves the teacher&apos;s name on past class transcripts without allowing new assignments.
          </p>

          <DialogFooter className="gap-2">
            <Button variant="outline" size="sm" onClick={() => setDeleteConfirmItem(null)}>
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={() => {
                if (deleteConfirmItem) {
                  deleteTeacherSafe(deleteConfirmItem.id);
                  setDeleteConfirmItem(null);
                }
              }}
              className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs"
            >
              Confirm Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
