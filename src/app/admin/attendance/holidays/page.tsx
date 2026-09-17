'use client';

import React, { useState, useMemo } from 'react';
import { useAttendance } from '@/context/attendance-context';
import {
  Plus,
  Calendar,
  AlertCircle,
  Trash2,
  CheckCircle2,
  Search,
  Edit2,
  Archive,
  RotateCcw,
  Sparkles,
  Building2,
  Users,
  Filter,
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
import { THoliday } from '@/lib/attendance-store';

export default function HolidaysPage() {
  const {
    holidays,
    addHoliday,
    updateHoliday,
    deleteHoliday,
    archiveHoliday,
    classes,
    batches,
    currentRole,
    isDemoData,
    getDependencySummary,
  } = useAttendance();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'archived'>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHoliday, setEditingHoliday] = useState<THoliday | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [type, setType] = useState<THoliday['type']>('Institute Holiday');
  const [branchName, setBranchName] = useState('All Branches');
  const [appliedTo, setAppliedTo] = useState<'all' | 'selected'>('all');
  const [selectedBatches, setSelectedBatches] = useState<string[]>([]);
  const [reason, setReason] = useState('');

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState<THoliday | null>(null);

  const openAddModal = () => {
    setEditingHoliday(null);
    setTitle('');
    setDate(new Date().toISOString().split('T')[0]);
    setType('Institute Holiday');
    setBranchName('All Branches');
    setAppliedTo('all');
    setSelectedBatches([]);
    setReason('');
    setIsModalOpen(true);
  };

  const openEditModal = (h: THoliday) => {
    setEditingHoliday(h);
    setTitle(h.title);
    setDate(h.date);
    setType(h.type);
    setBranchName(h.branchName || 'All Branches');
    setAppliedTo(h.appliedTo || 'all');
    setSelectedBatches(h.targetBatches || []);
    setReason(h.reason || '');
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !date) return;

    if (editingHoliday) {
      updateHoliday(editingHoliday.id, {
        title: title.trim(),
        date,
        type,
        branchName,
        appliedTo,
        targetBatches: appliedTo === 'selected' ? selectedBatches : [],
        reason: reason.trim() || 'Institute closed.',
      });
    } else {
      addHoliday({
        title: title.trim(),
        date,
        type,
        branchName,
        appliedTo,
        targetBatches: appliedTo === 'selected' ? selectedBatches : [],
        reason: reason.trim() || 'Institute closed.',
        status: 'active',
      });
    }

    setIsModalOpen(false);
  };

  const toggleBatchSelection = (batchName: string) => {
    setSelectedBatches(prev =>
      prev.includes(batchName) ? prev.filter(b => b !== batchName) : [...prev, batchName]
    );
  };

  const filteredHolidays = useMemo(() => {
    return holidays.filter(h => {
      if (statusFilter !== 'all') {
        const isArchived = h.status === 'archived';
        if (statusFilter === 'archived' && !isArchived) return false;
        if (statusFilter === 'active' && isArchived) return false;
      }
      if (typeFilter !== 'all' && h.type !== typeFilter) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = h.title.toLowerCase().includes(q);
        const matchesReason = h.reason?.toLowerCase().includes(q);
        const matchesDate = h.date.includes(q);
        const matchesBranch = h.branchName?.toLowerCase().includes(q);
        if (!matchesTitle && !matchesReason && !matchesDate && !matchesBranch) return false;
      }
      return true;
    });
  }, [holidays, statusFilter, typeFilter, searchQuery]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl md:text-2xl font-black tracking-tight text-slate-900">
              Holidays &amp; Institute Off Days
            </h1>
            <Badge className="bg-amber-50 text-amber-800 border-amber-200 font-bold text-xs">
              Attendance Protection Rule
            </Badge>
          </div>
          <p className="text-xs md:text-sm text-slate-500 mt-1 font-medium">
            Declared institute holidays and emergency closures NEVER count as student absences or missed class hours.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={openAddModal}
            className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs h-9 px-4 gap-1.5 shadow-sm"
          >
            <Plus className="h-3.5 w-3.5" />
            Declare Holiday
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search holiday by name, date or reason..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-9 h-9 text-xs"
          />
        </div>
        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value as any)}
            className="h-9 px-3 rounded-md border border-slate-200 text-xs bg-white text-slate-700 font-medium focus:ring-1 focus:ring-amber-500 outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active Only</option>
            <option value="archived">Archived Only</option>
          </select>
          <select
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
            className="h-9 px-3 rounded-md border border-slate-200 text-xs bg-white text-slate-700 font-medium focus:ring-1 focus:ring-amber-500 outline-none"
          >
            <option value="all">All Types</option>
            <option value="Institute Holiday">Institute Holiday</option>
            <option value="Class Cancelled">Class Cancelled</option>
            <option value="Teacher Unavailable">Teacher Unavailable</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      {/* Holiday Cards Grid */}
      {filteredHolidays.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-12 text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center text-amber-600 mb-3">
            <Calendar className="h-6 w-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">No Holidays Declared</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-4">
            {searchQuery || statusFilter !== 'all' || typeFilter !== 'all'
              ? 'No declared holidays match your active filters. Try clearing your search.'
              : 'There are currently no holidays or closure dates recorded in the system. Declare one when needed to protect student attendance scores.'}
          </p>
          <Button
            onClick={openAddModal}
            className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs h-9 px-4 gap-1.5"
          >
            <Plus className="h-3.5 w-3.5" />
            Declare Holiday
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredHolidays.map(h => {
            const isArchived = h.status === 'archived';
            return (
              <Card
                key={h.id}
                className={`transition-all shadow-xs ${
                  isArchived
                    ? 'border-slate-200 bg-slate-50/70 opacity-80'
                    : 'border-amber-200 bg-amber-50/25 hover:border-amber-300'
                }`}
              >
                <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <Badge
                      className={`font-bold text-[10px] ${
                        isArchived
                          ? 'bg-slate-200 text-slate-700 border-slate-300'
                          : 'bg-amber-100 text-amber-900 border-amber-300'
                      }`}
                    >
                      {h.type}
                    </Badge>
                    {isArchived ? (
                      <Badge className="bg-slate-100 text-slate-600 border-slate-200 text-[10px] font-semibold">
                        Archived
                      </Badge>
                    ) : (
                      <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px] font-semibold">
                        Active
                      </Badge>
                    )}
                  </div>
                  <span className="font-mono text-xs font-bold text-slate-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                    {h.date}
                  </span>
                </CardHeader>

                <CardContent className="p-4 pt-2 space-y-3">
                  <div>
                    <CardTitle className="text-base font-bold text-slate-900">{h.title}</CardTitle>
                    <p className="text-xs text-slate-600 font-medium mt-1">{h.reason}</p>
                  </div>

                  <div className="flex flex-wrap gap-1.5 text-[11px] text-slate-600 font-medium">
                    <span className="inline-flex items-center gap-1 bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-700">
                      <Building2 className="h-3 w-3 text-slate-400" />
                      {h.branchName || 'All Branches'}
                    </span>
                    <span className="inline-flex items-center gap-1 bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-700">
                      <Users className="h-3 w-3 text-slate-400" />
                      {h.appliedTo === 'selected' && h.targetBatches && h.targetBatches.length > 0
                        ? `Batches: ${h.targetBatches.join(', ')}`
                        : 'All Batches Protected'}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-amber-100/80 text-[11px] text-amber-900 flex items-center justify-between font-semibold">
                    <div className="flex items-center gap-1 text-emerald-700">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                      Zero absence penalty
                    </div>

                    <div className="flex items-center gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7 text-slate-600 hover:text-amber-700 hover:bg-white"
                        title="Edit Holiday"
                        onClick={() => openEditModal(h)}
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7 text-slate-600 hover:text-slate-900 hover:bg-white"
                        title={isArchived ? 'Reactivate Holiday' : 'Archive Holiday'}
                        onClick={() => {
                          if (isArchived) {
                            updateHoliday(h.id, { status: 'active' });
                          } else {
                            archiveHoliday(h.id);
                          }
                        }}
                      >
                        {isArchived ? <RotateCcw className="h-3.5 w-3.5" /> : <Archive className="h-3.5 w-3.5" />}
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7 text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                        title="Delete Holiday"
                        onClick={() => setDeleteTarget(h)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Add / Edit Holiday Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-slate-900">
              {editingHoliday ? 'Edit Holiday / Closure' : 'Declare Institute Holiday'}
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Students and batches will not be marked absent or penalized for classes on this date.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-3.5 py-2 text-xs">
            <div>
              <Label className="text-xs font-semibold text-slate-700">Date *</Label>
              <Input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                className="mt-1 h-9 text-xs"
                required
              />
            </div>

            <div>
              <Label className="text-xs font-semibold text-slate-700">Occasion / Title *</Label>
              <Input
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. Diwali Vacation, Ganesh Chaturthi, Institute Day"
                className="mt-1 h-9 text-xs"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs font-semibold text-slate-700">Category</Label>
                <select
                  value={type}
                  onChange={e => setType(e.target.value as any)}
                  className="mt-1 w-full h-9 px-2.5 rounded-md border border-slate-200 text-xs bg-white text-slate-800"
                >
                  <option value="Institute Holiday">Institute Holiday</option>
                  <option value="Class Cancelled">Class Cancelled</option>
                  <option value="Teacher Unavailable">Teacher Unavailable</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <Label className="text-xs font-semibold text-slate-700">Branch Scope</Label>
                <select
                  value={branchName}
                  onChange={e => setBranchName(e.target.value)}
                  className="mt-1 w-full h-9 px-2.5 rounded-md border border-slate-200 text-xs bg-white text-slate-800"
                >
                  <option value="All Branches">All Branches</option>
                  <option value="Main Branch">Main Branch</option>
                </select>
              </div>
            </div>

            <div>
              <Label className="text-xs font-semibold text-slate-700">Batch Applicability</Label>
              <div className="flex gap-4 mt-1.5">
                <label className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer">
                  <input
                    type="radio"
                    name="appliedTo"
                    value="all"
                    checked={appliedTo === 'all'}
                    onChange={() => setAppliedTo('all')}
                  />
                  <span>All Batches (Institute Wide)</span>
                </label>
                <label className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer">
                  <input
                    type="radio"
                    name="appliedTo"
                    value="selected"
                    checked={appliedTo === 'selected'}
                    onChange={() => setAppliedTo('selected')}
                  />
                  <span>Specific Batches Only</span>
                </label>
              </div>
            </div>

            {appliedTo === 'selected' && (
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                <Label className="text-[11px] font-semibold text-slate-600">Select Applicable Batches</Label>
                <div className="grid grid-cols-2 gap-1.5 max-h-32 overflow-y-auto">
                  {batches.map(b => (
                    <label
                      key={b.id}
                      className="flex items-center gap-1.5 text-xs text-slate-700 hover:bg-white p-1 rounded cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedBatches.includes(b.name)}
                        onChange={() => toggleBatchSelection(b.name)}
                        className="rounded text-amber-600 focus:ring-amber-500"
                      />
                      <span className="truncate">{b.name} ({b.className})</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            <div>
              <Label className="text-xs font-semibold text-slate-700">Official Reason / Remark</Label>
              <Textarea
                value={reason}
                onChange={e => setReason(e.target.value)}
                placeholder="Official notice reason or closure notes..."
                className="mt-1 text-xs h-20"
              />
            </div>

            <DialogFooter className="pt-2">
              <Button variant="outline" size="sm" type="button" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button size="sm" type="submit" className="bg-amber-600 hover:bg-amber-700 text-white font-bold">
                {editingHoliday ? 'Save Changes' : 'Declare Holiday'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Smart Delete Dialog */}
      {deleteTarget && (
        <SmartDeleteDialog
          open={!!deleteTarget}
          onClose={() => setDeleteTarget(null)}
          entityType="Holiday"
          entityName={deleteTarget.title}
          entityId={deleteTarget.id}
          isDemoMode={isDemoData}
          currentRole={currentRole}
          dependencies={getDependencySummary('holiday', deleteTarget.id)}
          onArchive={() => {
            archiveHoliday(deleteTarget.id);
            setDeleteTarget(null);
          }}
          onForceDelete={delReason => {
            deleteHoliday(deleteTarget.id, delReason);
            setDeleteTarget(null);
          }}
        />
      )}
    </div>
  );
}
