'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAttendance } from '@/context/attendance-context';
import {
  BookOpen,
  Plus,
  Edit2,
  Archive,
  RotateCcw,
  Trash2,
  Search,
  CheckCircle2,
  AlertTriangle,
  Layers,
  GraduationCap,
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
import { TSubject } from '@/lib/attendance-store';

export default function SubjectsPage() {
  const {
    subjects,
    classes,
    teachers,
    addSubject,
    updateSubject,
    archiveSubject,
    restoreSubject,
    deleteSubjectSafe,
  } = useAttendance();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'archived'>('all');

  // Modals
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editItem, setEditItem] = useState<TSubject | null>(null);
  const [deleteConfirmItem, setDeleteConfirmItem] = useState<TSubject | null>(null);

  // Form
  const [formName, setFormName] = useState('');
  const [formCode, setFormCode] = useState('');
  const [formClasses, setFormClasses] = useState('9th, 10th');
  const [formTeachers, setFormTeachers] = useState('Amod Sharma');
  const [formDesc, setFormDesc] = useState('');

  const filteredSubjects = subjects.filter(s => {
    if (search.trim()) {
      const q = search.toLowerCase();
      const match =
        s.name.toLowerCase().includes(q) ||
        s.code.toLowerCase().includes(q) ||
        s.teachers.some(t => t.toLowerCase().includes(q));
      if (!match) return false;
    }
    if (statusFilter !== 'all' && s.status !== statusFilter) return false;
    return true;
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    addSubject({
      name: formName.trim(),
      code: formCode.trim() || `${formName.slice(0, 4).toUpperCase()}-01`,
      classes: formClasses.split(',').map(c => c.trim()).filter(Boolean),
      teachers: formTeachers.split(',').map(t => t.trim()).filter(Boolean),
      status: 'active',
      description: formDesc,
    });

    setIsAddOpen(false);
    resetForm();
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editItem) return;

    updateSubject(editItem.id, {
      name: formName || editItem.name,
      code: formCode || editItem.code,
      classes: formClasses.split(',').map(c => c.trim()).filter(Boolean),
      teachers: formTeachers.split(',').map(t => t.trim()).filter(Boolean),
      description: formDesc,
    });

    setEditItem(null);
    resetForm();
  };

  const resetForm = () => {
    setFormName('');
    setFormCode('');
    setFormClasses('9th, 10th');
    setFormTeachers('Amod Sharma');
    setFormDesc('');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl md:text-2xl font-black tracking-tight text-slate-900">
              Curriculum Subjects Management
            </h1>
            <Badge className="bg-blue-50 text-blue-700 border-blue-200 font-bold text-xs">
              {subjects.filter(s => s.status === 'active').length} Active Subjects
            </Badge>
          </div>
          <p className="text-xs md:text-sm text-slate-500 mt-1 font-medium">
            Manage curriculum courses, instructor assignments, and retain archived subjects for historical reporting.
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
            <Plus className="h-3.5 w-3.5" />
            + Add Subject
          </Button>
        </div>
      </div>

      {/* Search & Status Filter */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search by subject name or code..."
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
            All Subjects
          </Button>
          <Button
            size="sm"
            variant={statusFilter === 'active' ? 'default' : 'outline'}
            onClick={() => setStatusFilter('active')}
            className={`text-xs h-8 ${statusFilter === 'active' ? 'bg-blue-600' : 'border-slate-300'}`}
          >
            Active
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

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSubjects.length === 0 ? (
          <div className="col-span-full p-12 text-center text-slate-500 bg-white rounded-xl border border-slate-200 space-y-3">
            <BookOpen className="h-10 w-10 text-slate-300 mx-auto" />
            <h4 className="font-bold text-slate-900 text-sm">No Subjects Found</h4>
            <p className="text-xs text-slate-500">Add a subject to map to classes and schedules.</p>
            <Button
              size="sm"
              onClick={() => {
                resetForm();
                setIsAddOpen(true);
              }}
              className="bg-blue-600 text-white font-bold text-xs"
            >
              + Add Subject Now
            </Button>
          </div>
        ) : (
          filteredSubjects.map(s => {
            const isArchived = s.status === 'archived';

            return (
              <Card
                key={s.id}
                className={`border-slate-200 shadow-xs hover:shadow transition-shadow ${
                  isArchived ? 'opacity-60 bg-slate-50' : 'bg-white'
                }`}
              >
                <CardHeader className="p-4 pb-2">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="font-mono text-[10px]">
                      {s.code}
                    </Badge>
                    <Badge
                      className={`text-[10px] font-bold ${
                        isArchived
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      }`}
                    >
                      {s.status}
                    </Badge>
                  </div>
                  <CardTitle className="text-base font-bold text-slate-900 mt-2">
                    {s.name}
                  </CardTitle>
                </CardHeader>

                <CardContent className="p-4 pt-2 space-y-2 text-xs text-slate-600">
                  <div>
                    <span className="text-slate-500 block text-[11px]">Taught In:</span>
                    <span className="font-semibold text-slate-800">{s.classes.join(', ')}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">Faculty Instructors:</span>
                    <span className="font-semibold text-blue-700">{s.teachers.join(', ')}</span>
                  </div>

                  <div className="pt-3 flex items-center justify-between border-t border-slate-100">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setEditItem(s);
                        setFormName(s.name);
                        setFormCode(s.code);
                        setFormClasses(s.classes.join(', '));
                        setFormTeachers(s.teachers.join(', '));
                        setFormDesc(s.description || '');
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
                        onClick={() => restoreSubject(s.id)}
                        className="text-emerald-700 hover:bg-emerald-50 text-xs h-7 px-2 font-semibold"
                      >
                        <RotateCcw className="h-3 w-3 mr-1" />
                        Restore
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => archiveSubject(s.id)}
                        className="text-amber-700 hover:bg-amber-50 text-xs h-7 px-2"
                      >
                        <Archive className="h-3 w-3 mr-1" />
                        Archive
                      </Button>
                    )}

                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setDeleteConfirmItem(s)}
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

      {/* Add Subject Modal */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">Add Subject Course</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleAddSubmit} className="space-y-3.5 py-2 text-xs">
            <div>
              <Label className="text-xs font-semibold">Subject Title *</Label>
              <Input
                placeholder="e.g. Physics, Accountancy, Computer Science"
                value={formName}
                onChange={e => setFormName(e.target.value)}
                className="mt-1 h-9 text-xs"
                required
              />
            </div>
            <div>
              <Label className="text-xs font-semibold">Course Code</Label>
              <Input
                placeholder="e.g. PHY-01"
                value={formCode}
                onChange={e => setFormCode(e.target.value)}
                className="mt-1 h-9 text-xs"
              />
            </div>
            <div>
              <Label className="text-xs font-semibold">Assigned Classes (comma separated)</Label>
              <Input
                value={formClasses}
                onChange={e => setFormClasses(e.target.value)}
                className="mt-1 h-9 text-xs"
              />
            </div>
            <div>
              <Label className="text-xs font-semibold">Assigned Teachers</Label>
              <Input
                value={formTeachers}
                onChange={e => setFormTeachers(e.target.value)}
                className="mt-1 h-9 text-xs"
              />
            </div>
            <div>
              <Label className="text-xs font-semibold">Syllabus Overview</Label>
              <Textarea
                value={formDesc}
                onChange={e => setFormDesc(e.target.value)}
                className="mt-1 text-xs h-16"
              />
            </div>
            <DialogFooter className="pt-2">
              <Button variant="outline" size="sm" type="button" onClick={() => setIsAddOpen(false)}>
                Cancel
              </Button>
              <Button size="sm" type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold">
                Create Subject
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Subject Modal */}
      <Dialog open={!!editItem} onOpenChange={open => !open && setEditItem(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">Edit Subject</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleEditSubmit} className="space-y-3.5 py-2 text-xs">
            <div>
              <Label className="text-xs font-semibold">Subject Title</Label>
              <Input
                value={formName}
                onChange={e => setFormName(e.target.value)}
                className="mt-1 h-9 text-xs"
                required
              />
            </div>
            <div>
              <Label className="text-xs font-semibold">Course Code</Label>
              <Input
                value={formCode}
                onChange={e => setFormCode(e.target.value)}
                className="mt-1 h-9 text-xs"
              />
            </div>
            <div>
              <Label className="text-xs font-semibold">Classes</Label>
              <Input
                value={formClasses}
                onChange={e => setFormClasses(e.target.value)}
                className="mt-1 h-9 text-xs"
              />
            </div>
            <div>
              <Label className="text-xs font-semibold">Teachers</Label>
              <Input
                value={formTeachers}
                onChange={e => setFormTeachers(e.target.value)}
                className="mt-1 h-9 text-xs"
              />
            </div>
            <DialogFooter className="pt-2">
              <Button variant="outline" size="sm" type="button" onClick={() => setEditItem(null)}>
                Cancel
              </Button>
              <Button size="sm" type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold">
                Update Subject
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

import { SmartDeleteDialog } from '@/components/attendance/smart-delete-dialog';
import { useAttendance } from '@/context/attendance-context';
import { useState } from 'react';

// Inside component (replace existing deleteConfirmItem state usage)
const { getDependencySummary, forceDeleteSubject, isDemoData, currentRole } = useAttendance();
// Using currentRole from context.

// Replace the Delete Subject Confirmation Dialog block with:
{deleteConfirmItem && (
  <SmartDeleteDialog
    open={!!deleteConfirmItem}
    onClose={() => setDeleteConfirmItem(null)}
    entityType="Subject"
    entityName={deleteConfirmItem.name}
    entityId={deleteConfirmItem.id}
    isDemoMode={isDemoData}
    currentRole={currentRole}
    dependencies={getDependencySummary('subject', deleteConfirmItem.id)}
    onArchive={() => {
      archiveSubject(deleteConfirmItem.id);
      setDeleteConfirmItem(null);
    }}
    onForceDelete={(reason) => {
      forceDeleteSubject(deleteConfirmItem.id, reason);
      setDeleteConfirmItem(null);
    }}
  />
)}
    </div>
  );
}
