'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useAttendance } from '@/context/attendance-context';
import {
  GraduationCap,
  Search,
  Filter,
  UserPlus,
  ArrowRight,
  Phone,
  Calendar,
  Layers,
  ChevronRight,
  Sparkles,
  Edit2,
  Archive,
  RotateCcw,
  Trash2,
  ArrowRightLeft,
  FileSpreadsheet,
  AlertTriangle,
  UserCheck,
  UserX,
  MapPin,
  Clock,
  MoreVertical,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { TStudent } from '@/lib/attendance-store';
import { SmartDeleteDialog } from '@/components/attendance/smart-delete-dialog';

export default function StudentsDirectoryPage() {
  const {
    students,
    classes,
    batches,
    currentRole,
    isDemoData,
    getDependencySummary,
    addStudent,
    updateStudent,
    archiveStudent,
    restoreStudent,
    transferStudentBatch,
    deleteStudentSafe,
    forceDeleteStudent,
    bulkArchiveStudents,
    bulkTransferStudents,
  } = useAttendance();

  const searchParams = useSearchParams();

  // Filters & Search — pre-filled from URL params when coming from Classes & Batches page
  const urlBatchId = searchParams.get('batchId') || 'all';
  const urlClassId = searchParams.get('classId') || 'all';

  const [search, setSearch] = useState('');
  const [classFilter, setClassFilter] = useState('all');
  const [batchFilter, setBatchFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'archived'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'roll' | 'admission'>('roll');

  // Initialize filters from URL once batches/classes are loaded
  useEffect(() => {
    if (urlBatchId !== 'all' && batches.length > 0) {
      const batchObj = batches.find(b => b.id === urlBatchId);
      if (batchObj) {
        setBatchFilter(batchObj.id);
        setClassFilter(batchObj.classId);
      }
    } else if (urlClassId !== 'all' && classes.length > 0) {
      setClassFilter(urlClassId);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlBatchId, urlClassId, batches.length, classes.length]);

  // Multi-select bulk actions
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);

  // Modals
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  const [editStudentItem, setEditStudentItem] = useState<TStudent | null>(null);
  const [transferStudentItem, setTransferStudentItem] = useState<TStudent | null>(null);
  const [deleteStudentConfirm, setDeleteStudentConfirm] = useState<TStudent | null>(null);
  const [isBulkTransferOpen, setIsBulkTransferOpen] = useState(false);
  const [isBulkDeleteOpen, setIsBulkDeleteOpen] = useState(false);
  const [isBulkDeleteAllOpen, setIsBulkDeleteAllOpen] = useState(false);

  // Form states for Add / Edit
  // Helper to compute dependency summary for bulk delete
  const computeBulkDependency = () => {
    return {
      batches: 0,
      students: selectedStudentIds.length,
      schedules: 0,
      attendanceSessions: 0,
      leaveRecords: 0,
      callRecords: 0,
    };
  };
  const [formName, setFormName] = useState('');
  const [formDob, setFormDob] = useState('2011-06-15');
  const [formParentName, setFormParentName] = useState('');
  const [formStudentPhone, setFormStudentPhone] = useState('');
  const [formParentPhone, setFormParentPhone] = useState('');
  const [formAddress, setFormAddress] = useState('');
  // formBatch stores batch ID (not name) for precise assignment
  const [formBatch, setFormBatch] = useState('');
  const [formAdmissionDate, setFormAdmissionDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [formNotes, setFormNotes] = useState('');

  // Pre-fill formBatch from URL when opening Add Student from a specific batch
  useEffect(() => {
    if (urlBatchId !== 'all' && batches.length > 0) {
      const batchObj = batches.find(b => b.id === urlBatchId);
      if (batchObj) setFormBatch(batchObj.id);
    } else if (batches.length > 0 && !formBatch) {
      setFormBatch(batches[0].id);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlBatchId, batches.length]);

  // Transfer Form states
  const [transferToBatch, setTransferToBatch] = useState('');
  const [transferEffectiveDate, setTransferEffectiveDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [transferReason, setTransferReason] = useState('');

  // Filter & Sort logic — uses IDs for class/batch to avoid cross-class name collisions
  const filteredStudents = students.filter(s => {
    if (search.trim()) {
      const q = search.toLowerCase();
      const match =
        s.name.toLowerCase().includes(q) ||
        s.phone.includes(q) ||
        s.parentPhone.includes(q) ||
        String(s.rollNo) === q;
      if (!match) return false;
    }
    if (classFilter !== 'all' && s.classId !== classFilter) return false;
    if (batchFilter !== 'all' && s.batchId !== batchFilter) return false;
    if (statusFilter !== 'all' && s.status !== statusFilter) return false;
    return true;
  });

  const sortedStudents = [...filteredStudents].sort((a, b) => {
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    if (sortBy === 'admission') return a.admissionDate.localeCompare(b.admissionDate);
    return a.rollNo - b.rollNo;
  });

  // Bulk selection helpers
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedStudentIds(sortedStudents.map(s => s.id));
    } else {
      setSelectedStudentIds([]);
    }
  };

  const handleToggleStudent = (id: string) => {
    setSelectedStudentIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formBatch) return;
    // formBatch is a batch ID — look up full batch object for denormalized fields
    const batchObj = batches.find(b => b.id === formBatch);
    if (!batchObj) return;

    addStudent({
      name: formName.trim(),
      rollNo: students.filter(s => s.batchId === batchObj.id).length + 1,
      classId: batchObj.classId,
      className: batchObj.className || batchObj.name,
      batchId: batchObj.id,
      batchName: batchObj.name,
      admissionDate: formAdmissionDate,
      dob: formDob,
      status: 'active',
      phone: formStudentPhone || '+91 98110 00000',
      parentName: formParentName || 'Parent / Guardian',
      parentPhone: formParentPhone || '+91 99110 00000',
      address: formAddress || 'New Delhi',
      notes: formNotes,
    });

    setIsAddStudentOpen(false);
    resetForm();
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editStudentItem) return;

    updateStudent(editStudentItem.id, {
      name: formName || editStudentItem.name,
      dob: formDob,
      parentName: formParentName,
      phone: formStudentPhone,
      parentPhone: formParentPhone,
      address: formAddress,
      admissionDate: formAdmissionDate,
      notes: formNotes,
    });

    setEditStudentItem(null);
    resetForm();
  };

  const handleTransferSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!transferStudentItem) return;

    transferStudentBatch(
      transferStudentItem.id,
      transferToBatch,
      transferEffectiveDate,
      transferReason
    );

    setTransferStudentItem(null);
  };

  const handleBulkTransferSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedStudentIds.length === 0) return;
    bulkTransferStudents(selectedStudentIds, transferToBatch, transferEffectiveDate);
    setIsBulkTransferOpen(false);
    setSelectedStudentIds([]);
  };

  const handleBulkExportCSV = () => {
    const dataToExport = sortedStudents.filter(s =>
      selectedStudentIds.length > 0 ? selectedStudentIds.includes(s.id) : true
    );
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      'ID,Roll,Name,Class,Batch,Admission Date,Phone,Parent Phone,Status\n' +
      dataToExport
        .map(
          s =>
            `${s.id},${s.rollNo},${s.name},${s.className},${s.batchName},${s.admissionDate},${s.phone},${s.parentPhone},${s.status}`
        )
        .join('\n');
    const encoded = encodeURI(csvContent);
    const a = document.createElement('a');
    a.href = encoded;
    a.download = `IDL_Students_Export_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const resetForm = () => {
    setFormName('');
    setFormParentName('');
    setFormStudentPhone('');
    setFormParentPhone('');
    setFormAddress('');
    setFormNotes('');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl md:text-2xl font-black tracking-tight text-slate-900">
              Student Information &amp; Enrollment
            </h1>
            <Badge className="bg-blue-50 text-blue-700 border-blue-200 font-bold text-xs">
              {students.filter(s => s.status === 'active').length} Active Enrolled
            </Badge>
          </div>
          <p className="text-xs md:text-sm text-slate-500 mt-1 font-medium">
            Manage student admissions, batch transfers with effective dates, archival, and full profiles.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            onClick={() => {
              resetForm();
              setIsAddStudentOpen(true);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs h-9 px-4 gap-1.5 shadow-sm"
          >
            <UserPlus className="h-3.5 w-3.5" />
            + Add Student
          </Button>

          <Button
            variant="outline"
            onClick={handleBulkExportCSV}
            className="border-slate-300 text-slate-700 font-bold text-xs h-9 px-3 gap-1.5"
          >
            <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-600" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Search, Filter & Bulk Action Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="relative w-full lg:w-80">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search by name, phone, or roll..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9 h-9 text-xs"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="w-32">
              <Select value={classFilter} onValueChange={(v) => { setClassFilter(v); setBatchFilter('all'); }}>
                <SelectTrigger className="h-9 text-xs font-medium">
                  <SelectValue placeholder="Class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Classes</SelectItem>
                  {classes.map(c => (
                    <SelectItem key={c.id} value={c.id}>
                      Class {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="w-32">
              <Select value={batchFilter} onValueChange={setBatchFilter}>
                <SelectTrigger className="h-9 text-xs font-medium">
                  <SelectValue placeholder="Batch" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Batches</SelectItem>
                  {batches
                    .filter(b => classFilter === 'all' || b.classId === classFilter)
                    .map(b => (
                      <SelectItem key={b.id} value={b.id}>
                        {b.className ? `Class ${b.className} — ` : ''}Batch {b.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div className="w-32">
              <Select value={statusFilter} onValueChange={(v: any) => setStatusFilter(v)}>
                <SelectTrigger className="h-9 text-xs font-medium">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active Only</SelectItem>
                  <SelectItem value="archived">Archived Only</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="w-32">
              <Select value={sortBy} onValueChange={(v: any) => setSortBy(v)}>
                <SelectTrigger className="h-9 text-xs font-medium">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="roll">Roll Number</SelectItem>
                  <SelectItem value="name">Student Name</SelectItem>
                  <SelectItem value="admission">Admission Date</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Multi-Select Floating Bulk Strip */}
        {selectedStudentIds.length > 0 && (
  <div className="p-2.5 rounded-lg bg-blue-50 border border-blue-200 flex flex-wrap items-center justify-between gap-3 text-xs">
    <div className="flex items-center gap-2 text-blue-900 font-bold">
      <span>{selectedStudentIds.length} students selected</span>
    </div>
    <div className="flex items-center gap-2">
      <Button
        size="sm"
        onClick={() => setIsBulkTransferOpen(true)}
        className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs h-7 px-3 gap-1"
      >
        <ArrowRightLeft className="h-3 w-3" /> Transfer Batch
      </Button>
      <Button
        size="sm"
        variant="outline"
        onClick={() => bulkArchiveStudents(selectedStudentIds)}
        className="text-amber-800 border-amber-300 bg-amber-50 hover:bg-amber-100 font-bold text-xs h-7 px-3 gap-1"
      >
        <Archive className="h-3 w-3" /> Archive Selected
      </Button>
      <Button
        size="sm"
        variant="ghost"
        onClick={() => setSelectedStudentIds([])}
        className="text-slate-500 h-7 text-xs"
      >
        Clear Selection
      </Button>
      <Button
        size="sm"
        variant="destructive"
        onClick={() => setIsBulkDeleteOpen(true)}
        className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs h-7 px-3 gap-1"
      >
        Delete Selected
      </Button>
      {isDemoData && (
        <Button
          size="sm"
          variant="destructive"
          onClick={() => setIsBulkDeleteAllOpen(true)}
          className="bg-red-800 hover:bg-red-900 text-white font-bold text-xs h-7 px-3 gap-1 ml-2"
        >
          Delete All Students
        </Button>
      )}
    </div>
  </div>
)}

      {/* Bulk Delete Confirmation Dialogs */}
      <SmartDeleteDialog
        open={isBulkDeleteOpen}
        onClose={() => setIsBulkDeleteOpen(false)}
        entityType="Student"
        entityName={`${selectedStudentIds.length} selected student${selectedStudentIds.length > 1 ? 's' : ''}`}
        entityId=""
        isDemoMode={isDemoData}
        currentRole={currentRole}
        dependencies={computeBulkDependency()}
        onForceDelete={(reason) => {
          selectedStudentIds.forEach(id => forceDeleteStudent(id, reason));
          setSelectedStudentIds([]);
          setIsBulkDeleteOpen(false);
        }}
      />
      <SmartDeleteDialog
        open={isBulkDeleteAllOpen}
        onClose={() => setIsBulkDeleteAllOpen(false)}
        entityType="Student"
        entityName={`All ${students.length} students`}
        entityId=""
        isDemoMode={isDemoData}
        currentRole={currentRole}
        dependencies={{
          batches: 0,
          students: students.length,
          schedules: 0,
          attendanceSessions: 0,
          leaveRecords: 0,
          callRecords: 0,
        }}
        onForceDelete={(reason) => {
          students.forEach(s => forceDeleteStudent(s.id, reason));
          setSelectedStudentIds([]);
          setIsBulkDeleteAllOpen(false);
        }}
      />
              <Button
                size="sm"
                onClick={() => setIsBulkTransferOpen(true)}
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs h-7 px-3 gap-1"
              >
                <ArrowRightLeft className="h-3 w-3" />
                Transfer Batch
              </Button>

              <Button
                size="sm"
                variant="outline"
                onClick={() => bulkArchiveStudents(selectedStudentIds)}
                className="text-amber-800 border-amber-300 bg-amber-50 hover:bg-amber-100 font-bold text-xs h-7 px-3 gap-1"
              >
                <Archive className="h-3 w-3" />
                Archive Selected
              </Button>

              <Button
                size="sm"
                variant="ghost"
                onClick={() => setSelectedStudentIds([])}
                className="text-slate-500 h-7 text-xs"
              >
                Clear Selection
              </Button>
  


      </div>

      {/* Students Table */}
      <Card className="border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          {sortedStudents.length === 0 ? (
            <div className="p-12 text-center text-slate-500 space-y-3">
              <GraduationCap className="h-12 w-12 text-slate-300 mx-auto" />
              <div>
                <h4 className="font-bold text-slate-900 text-sm">No Students Found</h4>
                <p className="text-xs text-slate-500 mt-1">
                  No records match your search or filter criteria. Add a new student to start tracking attendance.
                </p>
              </div>
              <Button
                size="sm"
                onClick={() => {
                  resetForm();
                  setIsAddStudentOpen(true);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs"
              >
                + Add Student Now
              </Button>
            </div>
          ) : (
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 text-[11px] uppercase tracking-wider">
                  <th className="py-3 px-3 w-10 text-center">
                    <input
                      type="checkbox"
                      checked={
                        selectedStudentIds.length === sortedStudents.length &&
                        sortedStudents.length > 0
                      }
                      onChange={e => handleSelectAll(e.target.checked)}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                  </th>
                  <th className="py-3 px-3 w-12">Roll</th>
                  <th className="py-3 px-4">Student Name</th>
                  <th className="py-3 px-3">Class</th>
                  <th className="py-3 px-3">Batch</th>
                  <th className="py-3 px-3">Admission</th>
                  <th className="py-3 px-4">Parent Contact</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sortedStudents.slice(0, 40).map(st => {
                  const isSelected = selectedStudentIds.includes(st.id);
                  const isArchived = st.status === 'archived';

                  return (
                    <tr
                      key={st.id}
                      className={`hover:bg-slate-50 transition-colors ${
                        isSelected ? 'bg-blue-50/40' : ''
                      } ${isArchived ? 'opacity-60 bg-slate-50/50' : ''}`}
                    >
                      <td className="py-3 px-3 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleStudent(st.id)}
                          className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                        />
                      </td>
                      <td className="py-3 px-3 font-mono font-semibold text-slate-600">
                        {st.rollNo}
                      </td>
                      <td className="py-3 px-4">
                        <Link
                          href={`/admin/attendance/students/${st.id}`}
                          className="font-bold text-slate-900 hover:text-blue-600 hover:underline block"
                        >
                          {st.name}
                        </Link>
                        {st.batchHistory && st.batchHistory.length > 0 && (
                          <span className="text-[10px] text-purple-700 font-semibold flex items-center gap-1">
                            <ArrowRightLeft className="h-2.5 w-2.5" />
                            Transferred from Batch {st.batchHistory[st.batchHistory.length - 1].fromBatchName}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3 font-semibold text-slate-700">{st.className}</td>
                      <td className="py-3 px-3 font-bold text-blue-700">Batch {st.batchName}</td>
                      <td className="py-3 px-3 font-mono text-slate-600 text-[11px]">
                        {st.admissionDate}
                      </td>
                      <td className="py-3 px-4 text-slate-600 font-mono text-[11px]">
                        <div>{st.parentPhone}</div>
                        <span className="text-[10px] text-slate-400 font-sans">{st.parentName}</span>
                      </td>
                      <td className="py-3 px-3">
                        <Badge
                          className={`text-[10px] font-bold ${
                            isArchived
                              ? 'bg-amber-50 text-amber-700 border-amber-200'
                              : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          }`}
                        >
                          {st.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link href={`/admin/attendance/students/${st.id}`}>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-blue-600 hover:bg-blue-50 font-semibold text-xs h-7 px-2"
                            >
                              Profile
                            </Button>
                          </Link>

                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setEditStudentItem(st);
                              setFormName(st.name);
                              setFormDob(st.dob || '2011-06-15');
                              setFormParentName(st.parentName);
                              setFormStudentPhone(st.phone);
                              setFormParentPhone(st.parentPhone);
                              setFormAddress(st.address || '');
                              setFormAdmissionDate(st.admissionDate);
                              setFormNotes(st.notes || '');
                            }}
                            className="text-slate-600 hover:text-slate-900 h-7 px-2 text-xs"
                          >
                            Edit
                          </Button>

                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setTransferStudentItem(st);
                              setTransferToBatch('');
                            }}
                            className="text-purple-700 hover:bg-purple-50 h-7 px-2 text-xs"
                            title="Transfer Batch"
                          >
                            Transfer
                          </Button>

                          {isArchived ? (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => restoreStudent(st.id)}
                              className="text-emerald-700 hover:bg-emerald-50 h-7 px-2 text-xs font-semibold"
                            >
                              Restore
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => archiveStudent(st.id)}
                              className="text-amber-700 hover:bg-amber-50 h-7 px-2 text-xs"
                            >
                              Archive
                            </Button>
                          )}

                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setDeleteStudentConfirm(st)}
                            className="text-rose-600 hover:bg-rose-50 h-7 px-1.5 text-xs"
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
          </div>

      </Card>

      {/* Add Student Modal */}
      <Dialog open={isAddStudentOpen} onOpenChange={setIsAddStudentOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">New Student Admission Form</DialogTitle>
            <DialogDescription className="text-xs">
              Complete student and guardian contact details. Attendance starts from admission date.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddSubmit} className="space-y-3.5 py-2 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs font-semibold">Student Full Name *</Label>
                <Input
                  placeholder="e.g. Yashika Mehra"
                  value={formName}
                  onChange={e => setFormName(e.target.value)}
                  className="mt-1 h-9 text-xs"
                  required
                />
              </div>
              <div>
                <Label className="text-xs font-semibold">Date of Birth</Label>
                <Input
                  type="date"
                  value={formDob}
                  onChange={e => setFormDob(e.target.value)}
                  className="mt-1 h-9 text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs font-semibold">Assign Batch *</Label>
                <Select value={formBatch} onValueChange={setFormBatch}>
                  <SelectTrigger className="mt-1 h-9 text-xs">
                    <SelectValue placeholder="Select batch..." />
                  </SelectTrigger>
                  <SelectContent>
                    {batches.map(b => (
                      <SelectItem key={b.id} value={b.id}>
                        Class {b.className || b.name} — Batch {b.name} ({b.room})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs font-semibold">Admission Date *</Label>
                <Input
                  type="date"
                  value={formAdmissionDate}
                  onChange={e => setFormAdmissionDate(e.target.value)}
                  className="mt-1 h-9 text-xs"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs font-semibold">Student Phone</Label>
                <Input
                  placeholder="+91 98110 00000"
                  value={formStudentPhone}
                  onChange={e => setFormStudentPhone(e.target.value)}
                  className="mt-1 h-9 text-xs"
                />
              </div>
              <div>
                <Label className="text-xs font-semibold">Parent Phone *</Label>
                <Input
                  placeholder="+91 99110 00000"
                  value={formParentPhone}
                  onChange={e => setFormParentPhone(e.target.value)}
                  className="mt-1 h-9 text-xs"
                  required
                />
              </div>
            </div>

            <div>
              <Label className="text-xs font-semibold">Parent / Guardian Name</Label>
              <Input
                placeholder="e.g. Rajesh Mehra (Father)"
                value={formParentName}
                onChange={e => setFormParentName(e.target.value)}
                className="mt-1 h-9 text-xs"
              />
            </div>

            <div>
              <Label className="text-xs font-semibold">Address</Label>
              <Input
                placeholder="e.g. Laxmi Nagar, New Delhi"
                value={formAddress}
                onChange={e => setFormAddress(e.target.value)}
                className="mt-1 h-9 text-xs"
              />
            </div>

            <div>
              <Label className="text-xs font-semibold">Admission Notes</Label>
              <Textarea
                placeholder="Target exam, previous school, remarks..."
                value={formNotes}
                onChange={e => setFormNotes(e.target.value)}
                className="mt-1 text-xs h-16"
              />
            </div>

            <DialogFooter className="pt-2">
              <Button variant="outline" size="sm" type="button" onClick={() => setIsAddStudentOpen(false)}>
                Cancel
              </Button>
              <Button size="sm" type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold">
                Enroll Student
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Student Modal */}
      <Dialog open={!!editStudentItem} onOpenChange={open => !open && setEditStudentItem(null)}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">Edit Student Information</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleEditSubmit} className="space-y-3.5 py-2 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs font-semibold">Student Full Name</Label>
                <Input
                  value={formName}
                  onChange={e => setFormName(e.target.value)}
                  className="mt-1 h-9 text-xs"
                  required
                />
              </div>
              <div>
                <Label className="text-xs font-semibold">Date of Birth</Label>
                <Input
                  type="date"
                  value={formDob}
                  onChange={e => setFormDob(e.target.value)}
                  className="mt-1 h-9 text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs font-semibold">Parent Phone</Label>
                <Input
                  value={formParentPhone}
                  onChange={e => setFormParentPhone(e.target.value)}
                  className="mt-1 h-9 text-xs"
                  required
                />
              </div>
              <div>
                <Label className="text-xs font-semibold">Admission Date</Label>
                <Input
                  type="date"
                  value={formAdmissionDate}
                  onChange={e => setFormAdmissionDate(e.target.value)}
                  className="mt-1 h-9 text-xs"
                />
              </div>
            </div>

            <div>
              <Label className="text-xs font-semibold">Parent / Guardian Name</Label>
              <Input
                value={formParentName}
                onChange={e => setFormParentName(e.target.value)}
                className="mt-1 h-9 text-xs"
              />
            </div>

            <div>
              <Label className="text-xs font-semibold">Address</Label>
              <Input
                value={formAddress}
                onChange={e => setFormAddress(e.target.value)}
                className="mt-1 h-9 text-xs"
              />
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
              <Button variant="outline" size="sm" type="button" onClick={() => setEditStudentItem(null)}>
                Cancel
              </Button>
              <Button size="sm" type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold">
                Update Student
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Transfer Student Modal (Requirement #4) */}
      <Dialog open={!!transferStudentItem} onOpenChange={open => !open && setTransferStudentItem(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              <ArrowRightLeft className="h-4 w-4 text-purple-600" />
              Transfer Student: {transferStudentItem?.name}
            </DialogTitle>
            <DialogDescription className="text-xs">
              Current Batch: <strong>Batch {transferStudentItem?.batchName}</strong> ({transferStudentItem?.className})
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleTransferSubmit} className="space-y-3.5 py-2 text-xs">
            <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl text-purple-900 text-[11px] leading-relaxed">
              <strong>Data Protection Rule:</strong> Previous attendance will strictly remain tied to{' '}
              <strong>Batch {transferStudentItem?.batchName}</strong>. Future attendance on and after the effective date will be counted under the new batch.
            </div>

            <div>
              <Label className="text-xs font-semibold">Select Destination Batch *</Label>
              <Select value={transferToBatch} onValueChange={setTransferToBatch}>
                <SelectTrigger className="mt-1 h-9 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {batches
                    .filter(b => b.id !== transferStudentItem?.batchId)
                    .map(b => (
                      <SelectItem key={b.id} value={b.id}>
                        Class {b.className} — Batch {b.name} ({b.room})
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-xs font-semibold">Effective Transfer Date *</Label>
              <Input
                type="date"
                value={transferEffectiveDate}
                onChange={e => setTransferEffectiveDate(e.target.value)}
                className="mt-1 h-9 text-xs"
                required
              />
            </div>

            <div>
              <Label className="text-xs font-semibold">Reason for Batch Transfer</Label>
              <Textarea
                placeholder="e.g. Schedule clash, requested morning batch, academic performance..."
                value={transferReason}
                onChange={e => setTransferReason(e.target.value)}
                className="mt-1 text-xs h-16"
              />
            </div>

            <DialogFooter className="pt-2">
              <Button variant="outline" size="sm" type="button" onClick={() => setTransferStudentItem(null)}>
                Cancel
              </Button>
              <Button size="sm" type="submit" className="bg-purple-600 hover:bg-purple-700 text-white font-bold">
                Confirm Batch Transfer
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Bulk Batch Transfer Modal */}
      <Dialog open={isBulkTransferOpen} onOpenChange={setIsBulkTransferOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">
              Bulk Transfer {selectedStudentIds.length} Students
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleBulkTransferSubmit} className="space-y-3.5 py-2 text-xs">
            <div>
              <Label className="text-xs font-semibold">Destination Batch *</Label>
              <Select value={transferToBatch} onValueChange={setTransferToBatch}>
                <SelectTrigger className="mt-1 h-9 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {batches.map(b => (
                    <SelectItem key={b.id} value={b.id}>
                      Class {b.className} — Batch {b.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-xs font-semibold">Effective Date *</Label>
              <Input
                type="date"
                value={transferEffectiveDate}
                onChange={e => setTransferEffectiveDate(e.target.value)}
                className="mt-1 h-9 text-xs"
                required
              />
            </div>

            <DialogFooter className="pt-2">
              <Button variant="outline" size="sm" type="button" onClick={() => setIsBulkTransferOpen(false)}>
                Cancel
              </Button>
              <Button size="sm" type="submit" className="bg-purple-600 hover:bg-purple-700 text-white font-bold">
                Transfer All Selected
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Smart Delete Student Modal */}
      {deleteStudentConfirm && (
        <SmartDeleteDialog
          open={!!deleteStudentConfirm}
          onClose={() => setDeleteStudentConfirm(null)}
          entityType="Student"
          entityName={deleteStudentConfirm.name}
          entityId={deleteStudentConfirm.id}
          isDemoMode={isDemoData || (deleteStudentConfirm.isDemo ?? false)}
          currentRole={currentRole}
          dependencies={getDependencySummary('student', deleteStudentConfirm.id)}
          onArchive={() => archiveStudent(deleteStudentConfirm.id)}
          onForceDelete={(reason) => forceDeleteStudent(deleteStudentConfirm.id, reason)}
        />
      )}
    </div>
  );
}
