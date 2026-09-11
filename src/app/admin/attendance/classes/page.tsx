'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAttendance } from '@/context/attendance-context';
import {
  Layers,
  Users,
  Plus,
  ArrowRight,
  BookOpen,
  Calendar,
  Sparkles,
  Edit2,
  Archive,
  RotateCcw,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  FolderOpen,
  ChevronRight,
  DoorOpen,
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
import { SmartDeleteDialog } from '@/components/attendance/smart-delete-dialog';
import { TBatch, TClass } from '@/lib/attendance-store';

export default function ClassesAndBatchesPage() {
  const {
    classes,
    batches,
    students,
    addClass,
    updateClass,
    archiveClass,
    restoreClass,
    deleteClassSafe,
    addBatch,
    updateBatch,
    archiveBatch,
    restoreBatch,
    deleteBatchSafe,
    getDependencySummary,
    forceDeleteClass,
    forceDeleteBatch,
  } = useAttendance();

  // Active selected class drill-down (defaults to 9th or first class)
  const [selectedClassId, setSelectedClassId] = useState<string>(classes[0]?.id || 'c9');

  // Modals
  const [isAddClassOpen, setIsAddClassOpen] = useState(false);
  const [editClassItem, setEditClassItem] = useState<TClass | null>(null);
  const [deleteClassConfirm, setDeleteClassConfirm] = useState<TClass | null>(null);

  const [isAddBatchOpen, setIsAddBatchOpen] = useState(false);
  const [editBatchItem, setEditBatchItem] = useState<TBatch | null>(null);
  const [deleteBatchConfirm, setDeleteBatchConfirm] = useState<TBatch | null>(null);

  // Class Form
  const [classNameInput, setClassNameInput] = useState('');
  const [classDisplayInput, setClassDisplayInput] = useState('');
  const [classDescInput, setClassDescInput] = useState('');

  // Batch Form
  const [batchNameInput, setBatchNameInput] = useState('');
  const [batchRoomInput, setBatchRoomInput] = useState('Room 101');
  const [batchStartDate, setBatchStartDate] = useState('2026-04-01');
  const [batchEndDate, setBatchEndDate] = useState('');
  const [batchDescInput, setBatchDescInput] = useState('');

  const currentClass = classes.find(c => c.id === selectedClassId) || classes[0];
  const classBatches = batches.filter(b => b.classId === selectedClassId);

  const handleAddClassSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!classNameInput.trim()) return;
    addClass({
      name: classNameInput.trim(),
      displayName: classDisplayInput.trim() || `Class ${classNameInput}`,
      batches: [],
      status: 'active',
      description: classDescInput,
    });
    setClassNameInput('');
    setClassDisplayInput('');
    setClassDescInput('');
    setIsAddClassOpen(false);
  };

  const handleEditClassSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editClassItem) return;
    updateClass(editClassItem.id, {
      name: classNameInput || editClassItem.name,
      displayName: classDisplayInput || editClassItem.displayName,
      description: classDescInput,
    });
    setEditClassItem(null);
  };

  const handleAddBatchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!batchNameInput.trim() || !currentClass) return;
    addBatch({
      name: batchNameInput.trim(),
      classId: currentClass.id,
      className: currentClass.name,
      room: batchRoomInput || 'General Room',
      status: 'active',
      startDate: batchStartDate,
      endDate: batchEndDate || undefined,
      description: batchDescInput,
    });
    setBatchNameInput('');
    setBatchDescInput('');
    setIsAddBatchOpen(false);
  };

  const handleEditBatchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editBatchItem) return;
    updateBatch(editBatchItem.id, {
      name: batchNameInput || editBatchItem.name,
      room: batchRoomInput || editBatchItem.room,
      startDate: batchStartDate || editBatchItem.startDate,
      endDate: batchEndDate || editBatchItem.endDate,
      description: batchDescInput || editBatchItem.description,
    });
    setEditBatchItem(null);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl md:text-2xl font-black tracking-tight text-slate-900">
              Classes &amp; Batches Management
            </h1>
            <Badge className="bg-blue-50 text-blue-700 border-blue-200 font-bold text-xs">
              CRUD Controlled
            </Badge>
          </div>
          <p className="text-xs md:text-sm text-slate-500 mt-1 font-medium">
            Manage grade levels, dynamic batch sizes, classroom allocations, and archive policies.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            onClick={() => {
              setClassNameInput('');
              setClassDisplayInput('');
              setClassDescInput('');
              setIsAddClassOpen(true);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs h-9 px-4 gap-1.5 shadow-sm"
          >
            <Plus className="h-3.5 w-3.5" />
            + Add Class
          </Button>

          <Button
            onClick={() => {
              setBatchNameInput('');
              setBatchRoomInput('Room 101');
              setBatchDescInput('');
              setIsAddBatchOpen(true);
            }}
            variant="outline"
            className="border-slate-300 text-slate-700 font-bold text-xs h-9 px-4 gap-1.5"
          >
            <Plus className="h-3.5 w-3.5" />
            + Add Batch
          </Button>
        </div>
      </div>

      {/* Classes Selector / Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3.5">
        {classes.map(cls => {
          const isSelected = cls.id === selectedClassId;
          const isArchived = cls.status === 'archived';
          const studentCount = students.filter(s => s.classId === cls.id && s.status === 'active').length;
          const batchCount = batches.filter(b => b.classId === cls.id).length;

          return (
            <div
              key={cls.id}
              onClick={() => setSelectedClassId(cls.id)}
              className={`cursor-pointer p-4 rounded-xl border transition-all relative ${
                isSelected
                  ? 'bg-blue-50/70 border-blue-600 shadow-md ring-1 ring-blue-500/20'
                  : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
              } ${isArchived ? 'opacity-60 bg-slate-100' : ''}`}
            >
              <div className="flex items-center justify-between">
                <Badge
                  className={`text-[10px] font-bold ${
                    isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  Class {cls.name}
                </Badge>
                {isArchived && (
                  <Badge variant="outline" className="text-[9px] text-amber-700 border-amber-300">
                    Archived
                  </Badge>
                )}
              </div>

              <h3 className="font-extrabold text-sm text-slate-900 mt-2 line-clamp-1">
                {cls.displayName}
              </h3>

              <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium mt-2 pt-2 border-t border-slate-100">
                <span>{batchCount} Batches</span>
                <span>{studentCount} Students</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Class Detail & Batches Section */}
      {currentClass && (
        <Card className="border-slate-200 shadow-sm overflow-hidden">
          <CardHeader className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <CardTitle className="text-base font-bold text-slate-900">
                  {currentClass.displayName} — Batches &amp; Classrooms
                </CardTitle>
                <Badge className={currentClass.status === 'active' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}>
                  {currentClass.status}
                </Badge>
              </div>
              <CardDescription className="text-xs text-slate-500 mt-0.5">
                {currentClass.description || `Grade level containing ${classBatches.length} batches`}
              </CardDescription>
            </div>

            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setEditClassItem(currentClass);
                  setClassNameInput(currentClass.name);
                  setClassDisplayInput(currentClass.displayName);
                  setClassDescInput(currentClass.description || '');
                }}
                className="h-8 text-xs font-semibold"
              >
                <Edit2 className="h-3 w-3 mr-1" />
                Edit Class
              </Button>

              {currentClass.status === 'active' ? (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => archiveClass(currentClass.id)}
                  className="h-8 text-xs font-semibold text-amber-700 border-amber-200 hover:bg-amber-50"
                >
                  <Archive className="h-3 w-3 mr-1" />
                  Archive
                </Button>
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => restoreClass(currentClass.id)}
                  className="h-8 text-xs font-semibold text-emerald-700 border-emerald-200 hover:bg-emerald-50"
                >
                  <RotateCcw className="h-3 w-3 mr-1" />
                  Restore
                </Button>
              )}

              <Button
                size="sm"
                variant="outline"
                onClick={() => setDeleteClassConfirm(currentClass)}
                className="h-8 text-xs font-semibold text-rose-600 border-rose-200 hover:bg-rose-50"
              >
                <Trash2 className="h-3 w-3 mr-1" />
                Delete
              </Button>
            </div>
          </CardHeader>

          <CardContent className="p-0 overflow-x-auto">
            {classBatches.length === 0 ? (
              <div className="p-8 text-center text-slate-500 space-y-3">
                <FolderOpen className="h-10 w-10 text-slate-300 mx-auto" />
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">No Batches Yet</h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Add your first batch to start scheduling classes and enrolling students.
                  </p>
                </div>
                <Button
                  size="sm"
                  onClick={() => setIsAddBatchOpen(true)}
                  className="bg-blue-600 text-white font-bold text-xs"
                >
                  + Add First Batch
                </Button>
              </div>
            ) : (
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 text-[11px] uppercase tracking-wider">
                    <th className="py-3 px-4">Batch Name</th>
                    <th className="py-3 px-3">Allocated Room</th>
                    <th className="py-3 px-4">Active Students</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-4">Term / Dates</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {classBatches.map(batch => {
                    const enrolled = students.filter(s => s.batchId === batch.name && s.status === 'active').length;
                    const isArchived = batch.status === 'archived';

                    return (
                      <tr key={batch.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3 px-4">
                          <div className="font-bold text-blue-700 text-sm">Batch {batch.name}</div>
                          {batch.description && (
                            <span className="text-[10px] text-slate-500">{batch.description}</span>
                          )}
                        </td>
                        <td className="py-3 px-3 font-semibold text-slate-700">
                          <span className="inline-flex items-center gap-1">
                            <DoorOpen className="h-3 w-3 text-slate-400" />
                            {batch.room}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-mono font-bold text-slate-900">
                          {enrolled} Students
                        </td>
                        <td className="py-3 px-3">
                          <Badge
                            className={`text-[10px] font-bold ${
                              isArchived
                                ? 'bg-amber-50 text-amber-700 border-amber-200'
                                : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            }`}
                          >
                            {batch.status}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-slate-600 font-mono text-[11px]">
                          {batch.startDate || '2026-04-01'} {batch.endDate ? `to ${batch.endDate}` : '(Ongoing)'}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <Link href={`/admin/attendance/students?batch=${batch.name}`}>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-blue-600 hover:bg-blue-50 text-xs font-semibold h-7 px-2"
                              >
                                View Students
                              </Button>
                            </Link>

                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                setEditBatchItem(batch);
                                setBatchNameInput(batch.name);
                                setBatchRoomInput(batch.room);
                                setBatchStartDate(batch.startDate || '2026-04-01');
                                setBatchEndDate(batch.endDate || '');
                                setBatchDescInput(batch.description || '');
                              }}
                              className="text-slate-600 hover:text-slate-900 h-7 px-2 text-xs"
                            >
                              Edit
                            </Button>

                            {isArchived ? (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => restoreBatch(batch.id)}
                                className="text-emerald-700 hover:bg-emerald-50 h-7 px-2 text-xs font-semibold"
                              >
                                Restore
                              </Button>
                            ) : (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => archiveBatch(batch.id)}
                                className="text-amber-700 hover:bg-amber-50 h-7 px-2 text-xs"
                              >
                                Archive
                              </Button>
                            )}

                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setDeleteBatchConfirm(batch)}
                              className="text-rose-600 hover:bg-rose-50 h-7 px-2 text-xs"
                            >
                              Delete
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </CardContent>
        </Card>
      )}

      {/* Add Class Modal */}
      <Dialog open={isAddClassOpen} onOpenChange={setIsAddClassOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">Add Class Grade Level</DialogTitle>
            <DialogDescription className="text-xs">
              Creates a new academic class level (e.g. Class 8th, Foundation).
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddClassSubmit} className="space-y-3 py-2 text-xs">
            <div>
              <Label className="text-xs font-semibold">Class Short Name</Label>
              <Input
                placeholder="e.g. 8th, 9th, 12th"
                value={classNameInput}
                onChange={e => setClassNameInput(e.target.value)}
                className="mt-1 h-9 text-xs"
                required
              />
            </div>
            <div>
              <Label className="text-xs font-semibold">Display Title</Label>
              <Input
                placeholder="e.g. Class 8th (Foundation &amp; Olympiad)"
                value={classDisplayInput}
                onChange={e => setClassDisplayInput(e.target.value)}
                className="mt-1 h-9 text-xs"
              />
            </div>
            <div>
              <Label className="text-xs font-semibold">Description / Notes</Label>
              <Textarea
                placeholder="Optional notes..."
                value={classDescInput}
                onChange={e => setClassDescInput(e.target.value)}
                className="mt-1 text-xs h-16"
              />
            </div>
            <DialogFooter className="pt-2">
              <Button variant="outline" size="sm" type="button" onClick={() => setIsAddClassOpen(false)}>
                Cancel
              </Button>
              <Button size="sm" type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold">
                Save Class
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Class Modal */}
      <Dialog open={!!editClassItem} onOpenChange={open => !open && setEditClassItem(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">Edit Class Details</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleEditClassSubmit} className="space-y-3 py-2 text-xs">
            <div>
              <Label className="text-xs font-semibold">Class Name</Label>
              <Input
                value={classNameInput}
                onChange={e => setClassNameInput(e.target.value)}
                className="mt-1 h-9 text-xs"
                required
              />
            </div>
            <div>
              <Label className="text-xs font-semibold">Display Title</Label>
              <Input
                value={classDisplayInput}
                onChange={e => setClassDisplayInput(e.target.value)}
                className="mt-1 h-9 text-xs"
              />
            </div>
            <div>
              <Label className="text-xs font-semibold">Description</Label>
              <Textarea
                value={classDescInput}
                onChange={e => setClassDescInput(e.target.value)}
                className="mt-1 text-xs h-16"
              />
            </div>
            <DialogFooter className="pt-2">
              <Button variant="outline" size="sm" type="button" onClick={() => setEditClassItem(null)}>
                Cancel
              </Button>
              <Button size="sm" type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold">
                Update Class
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Add Batch Modal */}
      <Dialog open={isAddBatchOpen} onOpenChange={setIsAddBatchOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">
              Add New Batch for {currentClass?.displayName}
            </DialogTitle>
            <DialogDescription className="text-xs">
              Batches have dynamic student enrollment and individual timetables.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddBatchSubmit} className="space-y-3 py-2 text-xs">
            <div>
              <Label className="text-xs font-semibold">Batch Name</Label>
              <Input
                placeholder="e.g. 9C, Morning Elite, Weekend Alpha"
                value={batchNameInput}
                onChange={e => setBatchNameInput(e.target.value)}
                className="mt-1 h-9 text-xs"
                required
              />
            </div>
            <div>
              <Label className="text-xs font-semibold">Assigned Classroom / Lab</Label>
              <Input
                placeholder="e.g. Room 103, Chemistry Lab 2"
                value={batchRoomInput}
                onChange={e => setBatchRoomInput(e.target.value)}
                className="mt-1 h-9 text-xs"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs font-semibold">Batch Start Date</Label>
                <Input
                  type="date"
                  value={batchStartDate}
                  onChange={e => setBatchStartDate(e.target.value)}
                  className="mt-1 h-9 text-xs"
                />
              </div>
              <div>
                <Label className="text-xs font-semibold">Batch End Date (Optional)</Label>
                <Input
                  type="date"
                  value={batchEndDate}
                  onChange={e => setBatchEndDate(e.target.value)}
                  className="mt-1 h-9 text-xs"
                />
              </div>
            </div>
            <div>
              <Label className="text-xs font-semibold">Description / Batch Focus</Label>
              <Textarea
                placeholder="e.g. Advanced practice batch..."
                value={batchDescInput}
                onChange={e => setBatchDescInput(e.target.value)}
                className="mt-1 text-xs h-16"
              />
            </div>
            <DialogFooter className="pt-2">
              <Button variant="outline" size="sm" type="button" onClick={() => setIsAddBatchOpen(false)}>
                Cancel
              </Button>
              <Button size="sm" type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold">
                Create Batch
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Batch Modal */}
      <Dialog open={!!editBatchItem} onOpenChange={open => !open && setEditBatchItem(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">Edit Batch {editBatchItem?.name}</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleEditBatchSubmit} className="space-y-3 py-2 text-xs">
            <div>
              <Label className="text-xs font-semibold">Batch Name</Label>
              <Input
                value={batchNameInput}
                onChange={e => setBatchNameInput(e.target.value)}
                className="mt-1 h-9 text-xs"
                required
              />
            </div>
            <div>
              <Label className="text-xs font-semibold">Classroom</Label>
              <Input
                value={batchRoomInput}
                onChange={e => setBatchRoomInput(e.target.value)}
                className="mt-1 h-9 text-xs"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs font-semibold">Start Date</Label>
                <Input
                  type="date"
                  value={batchStartDate}
                  onChange={e => setBatchStartDate(e.target.value)}
                  className="mt-1 h-9 text-xs"
                />
              </div>
              <div>
                <Label className="text-xs font-semibold">End Date</Label>
                <Input
                  type="date"
                  value={batchEndDate}
                  onChange={e => setBatchEndDate(e.target.value)}
                  className="mt-1 h-9 text-xs"
                />
              </div>
            </div>
            <div>
              <Label className="text-xs font-semibold">Description</Label>
              <Textarea
                value={batchDescInput}
                onChange={e => setBatchDescInput(e.target.value)}
                className="mt-1 text-xs h-16"
              />
            </div>
            <DialogFooter className="pt-2">
              <Button variant="outline" size="sm" type="button" onClick={() => setEditBatchItem(null)}>
                Cancel
              </Button>
              <Button size="sm" type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold">
                Update Batch
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>


        {/* Delete Class Confirmation using SmartDeleteDialog */}
        <SmartDeleteDialog
          open={!!deleteClassConfirm}
          onClose={() => setDeleteClassConfirm(null)}
          entityType="Class"
          entityName={deleteClassConfirm?.displayName || ''}
          entityId={deleteClassConfirm?.id || ''}
          isDemoMode={isDemoData}
          currentRole={currentRole}
          dependencies={getDependencySummary('Class', deleteClassConfirm?.id)}
          onArchive={() => {
            if (deleteClassConfirm) {
              archiveClass(deleteClassConfirm.id);
              setDeleteClassConfirm(null);
            }
          }}
          onForceDelete={(reason) => {
            if (deleteClassConfirm) {
              forceDeleteClass(deleteClassConfirm.id, reason);
              setDeleteClassConfirm(null);
            }
          }}
        />
        

        {/* Delete Batch Confirmation using SmartDeleteDialog */}
        <SmartDeleteDialog
          open={!!deleteBatchConfirm}
          onClose={() => setDeleteBatchConfirm(null)}
          entityType="Batch"
          entityName={deleteBatchConfirm?.name || ''}
          entityId={deleteBatchConfirm?.id || ''}
          isDemoMode={isDemoData}
          currentRole={currentRole}
          dependencies={getDependencySummary('Batch', deleteBatchConfirm?.id)}
          onArchive={() => {
            if (deleteBatchConfirm) {
              archiveBatch(deleteBatchConfirm.id);
              setDeleteBatchConfirm(null);
            }
          }}
          onForceDelete={(reason) => {
            if (deleteBatchConfirm) {
              forceDeleteBatch(deleteBatchConfirm.id, reason);
              setDeleteBatchConfirm(null);
            }
          }}
        />
    </div>
  );
}
