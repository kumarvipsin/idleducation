'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useAttendance } from '@/context/attendance-context';
import {
  Building2,
  Plus,
  Search,
  X,
  Edit,
  Trash2,
  Archive,
  ArrowRightLeft,
  RotateCcw,
  GraduationCap,
  Users,
  RefreshCw,
  ArrowRight,
  Phone,
  Calendar,
  Layers,
  Globe,
  Check,
  ChevronDown,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
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

// --------------------------------------------------------------------------
// DESIGN SYSTEM TOKENS (Exact 1:1 Match with Fees Management & Classes/Batches)
// --------------------------------------------------------------------------
const FORM_CARD_SURFACE_CLS =
  "w-[94vw] rounded-2xl p-5 bg-white dark:bg-slate-950 border border-[#E2E8F0] dark:border-slate-800 shadow-[0_24px_56px_-12px_rgba(11,31,75,0.16),0_6px_18px_-4px_rgba(15,23,42,0.07),0_0_0_1px_rgba(15,23,42,0.03)] font-sans antialiased [&>button:last-child]:border-slate-200/90 [&>button:last-child]:text-slate-400 [&>button:last-child]:hover:text-[#0B1F4B] [&>button:last-child]:hover:border-slate-300 [&>button:last-child]:hover:bg-slate-50 [&>button:last-child]:shadow-[0_1px_2px_rgba(15,23,42,0.04)] [&>button:last-child]:transition-colors";
const FORM_CARD_DIALOG_CLS = `max-w-[480px] ${FORM_CARD_SURFACE_CLS}`;
const FORM_CARD_HEADER_CLS = "pb-3 border-b border-[#EEF2F7] dark:border-slate-800/80 shrink-0 text-left pr-9";
const FORM_CARD_TITLE_CLS = "text-[16px] sm:text-[17px] font-bold text-[#0B1F4B] dark:text-white tracking-[-0.015em] leading-snug";
const FORM_CARD_DESC_CLS = "text-[11.5px] text-slate-500 dark:text-slate-400 font-normal leading-relaxed mt-0.5";
const FORM_CARD_LABEL_CLS = "text-xs font-medium text-slate-400 dark:text-slate-500 tracking-[0.005em]";
const FORM_CARD_FIELD_CLS =
  "h-9 text-xs sm:text-[13px] md:text-[13px] font-semibold !rounded-none !border-0 !border-b border-slate-200/85 dark:border-slate-800 !bg-transparent px-0 hover:!border-b-slate-300 dark:hover:!border-b-slate-700 focus:!bg-transparent focus:!border-b-[#2864E8] focus-visible:ring-0 focus-visible:!border-b-[#2864E8] placeholder:font-normal placeholder:text-slate-400/65 dark:placeholder:text-slate-600 text-[#0B1F4B] dark:text-slate-100 transition-colors duration-150 !shadow-none";
const FORM_CARD_SELECT_TRIGGER_CLS = `${FORM_CARD_FIELD_CLS} focus:outline-none focus:ring-0 focus-visible:outline-none data-[state=open]:!border-b-[#2864E8] data-[state=open]:!bg-transparent data-[placeholder]:font-normal data-[placeholder]:text-slate-400/65 dark:data-[placeholder]:text-slate-600 [&>svg]:text-slate-400 data-[state=open]:[&>svg]:text-[#2864E8] [&>svg]:transition-[transform,color] [&>svg]:duration-150 data-[state=open]:[&>svg]:rotate-180`;
const FORM_CARD_SELECT_CONTENT_CLS = "rounded-xl border border-slate-200/95 dark:border-slate-800 bg-white dark:bg-slate-950 p-1 shadow-[0_14px_34px_-8px_rgba(11,31,75,0.14),0_2px_8px_rgba(15,23,42,0.05)]";
const FORM_CARD_SELECT_ITEM_CLS =
  "text-xs sm:text-[13px] font-medium text-slate-700 dark:text-slate-200 rounded-lg py-1.5 sm:py-2 focus:bg-blue-50/90 focus:text-[#2864E8] data-[state=checked]:text-[#2864E8] data-[state=checked]:font-semibold dark:focus:bg-blue-950/40 dark:focus:text-blue-400 cursor-pointer";
const FORM_CARD_SUBMIT_BTN_CLS =
  "group w-full h-9 !rounded-[5px] text-xs font-semibold uppercase tracking-[0.06em] bg-[#2864E8] hover:bg-[#1E4ED8] active:bg-[#1842BE] text-white shadow-[0_2px_8px_-1px_rgba(40,100,232,0.26),0_1px_2px_rgba(23,32,51,0.08)] hover:shadow-[0_4px_12px_rgba(40,100,232,0.3),0_1px_3px_rgba(23,32,51,0.1)] flex items-center justify-center gap-2 transition-all duration-150 cursor-pointer active:scale-[0.995]";

// Branches
const IDL_BRANCHES = [
  { id: 'all', name: 'All Branches' },
  { id: 'budh-vihar', name: 'Budh Vihar' },
  { id: 'krishan-vihar', name: 'Krishan Vihar' },
  { id: 'mangolpuri', name: 'Mangol Puri' },
  { id: 'mukherjee-nagar', name: 'Mukherjee Nagar' },
];

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
    forceDeleteStudent,
    bulkArchiveStudents,
    bulkTransferStudents,
  } = useAttendance();

  const searchParams = useSearchParams();

  // URL Params
  const urlBatchId = searchParams.get('batchId') || 'all';
  const urlClassId = searchParams.get('classId') || 'all';

  // Branch Selection (Upper section)
  const [selectedBranch, setSelectedBranch] = useState<string>('all');
  const [isBranchPickerOpen, setIsBranchPickerOpen] = useState<boolean>(false);

  // Filter States
  const [classFilter, setClassFilter] = useState('all');
  const [batchFilter, setBatchFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'archived'>('all');

  // Search State (Rightmost round expandable search bar)
  const [studentSearch, setStudentSearch] = useState('');
  const [isStudentSearchOpen, setIsStudentSearchOpen] = useState(false);
  const studentSearchInputRef = useRef<HTMLInputElement | null>(null);

  // Initialize filters from URL
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
  }, [urlBatchId, urlClassId, batches.length, classes.length]);

  // Multi-select bulk actions
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);

  // Modals
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  const [isSubmittingAdd, setIsSubmittingAdd] = useState(false);
  const [editStudentItem, setEditStudentItem] = useState<TStudent | null>(null);
  const [transferStudentItem, setTransferStudentItem] = useState<TStudent | null>(null);
  const [deleteStudentConfirm, setDeleteStudentConfirm] = useState<TStudent | null>(null);
  const [isBulkTransferOpen, setIsBulkTransferOpen] = useState(false);
  const [isBulkDeleteOpen, setIsBulkDeleteOpen] = useState(false);

  // Add / Edit Student Form States
  const [formName, setFormName] = useState('');
  const [formDob, setFormDob] = useState('2011-06-15');
  const [formParentName, setFormParentName] = useState('');
  const [formStudentPhone, setFormStudentPhone] = useState('');
  const [formParentPhone, setFormParentPhone] = useState('');
  const [formAddress, setFormAddress] = useState('');
  const [formBatch, setFormBatch] = useState('');
  const [formAdmissionDate, setFormAdmissionDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [formNotes, setFormNotes] = useState('');

  // Transfer Form States
  const [transferToBatch, setTransferToBatch] = useState('');
  const [transferEffectiveDate, setTransferEffectiveDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [transferReason, setTransferReason] = useState('');

  // Classes filtered by selected Branch
  const branchClasses = classes.filter(c => {
    if (selectedBranch === 'all') return true;
    const cBranch = c.branchId || 'budh-vihar';
    return cBranch.toLowerCase().includes(selectedBranch.replace('-branch', '')) || cBranch === selectedBranch;
  });
  const branchClassIds = new Set(branchClasses.map(c => c.id));

  // Batches available for filtering
  const availableBatchesForFilter = batches.filter(b => {
    if (classFilter !== 'all') return b.classId === classFilter;
    if (selectedBranch !== 'all') {
      const bBranch = b.branchId || 'budh-vihar';
      return (
        bBranch.toLowerCase().includes(selectedBranch.replace('-branch', '')) ||
        bBranch === selectedBranch ||
        branchClassIds.has(b.classId)
      );
    }
    return true;
  });

  // Pre-fill formBatch when batches change
  useEffect(() => {
    if (urlBatchId !== 'all' && batches.length > 0) {
      const batchObj = batches.find(b => b.id === urlBatchId);
      if (batchObj) setFormBatch(batchObj.id);
    } else if (availableBatchesForFilter.length > 0 && !formBatch) {
      setFormBatch(availableBatchesForFilter[0].id);
    }
  }, [urlBatchId, batches.length, availableBatchesForFilter, formBatch]);

  // Filtered Students
  const filteredStudents = students.filter(s => {
    // 1. Branch Filter
    if (selectedBranch !== 'all') {
      const batchObj = batches.find(b => b.id === s.batchId);
      const sBranch = s.branchId || batchObj?.branchId;
      if (sBranch) {
        if (!sBranch.toLowerCase().includes(selectedBranch.replace('-branch', '')) && sBranch !== selectedBranch) {
          return false;
        }
      } else if (s.classId && !branchClassIds.has(s.classId)) {
        return false;
      }
    }

    // 2. Search Filter
    if (studentSearch.trim()) {
      const q = studentSearch.toLowerCase();
      const match =
        s.name.toLowerCase().includes(q) ||
        (s.phone && s.phone.includes(q)) ||
        (s.parentPhone && s.parentPhone.includes(q)) ||
        String(s.rollNo) === q;
      if (!match) return false;
    }

    // 3. Class Filter
    if (classFilter !== 'all' && s.classId !== classFilter) return false;

    // 4. Batch Filter
    if (batchFilter !== 'all' && s.batchId !== batchFilter) return false;

    // 5. Status Filter
    if (statusFilter !== 'all' && s.status !== statusFilter) return false;

    return true;
  });

  // Sorted Students (by roll number ascending)
  const sortedStudents = [...filteredStudents].sort((a, b) => a.rollNo - b.rollNo);

  // Bulk Selection Helpers
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

  const resetForm = () => {
    setFormName('');
    setFormDob('2011-06-15');
    setFormParentName('');
    setFormStudentPhone('');
    setFormParentPhone('');
    setFormAddress('');
    setFormNotes('');
    setFormAdmissionDate(new Date().toISOString().split('T')[0]);
    if (availableBatchesForFilter.length > 0) {
      setFormBatch(availableBatchesForFilter[0].id);
    }
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formBatch) return;

    setIsSubmittingAdd(true);
    const batchObj = batches.find(b => b.id === formBatch);
    if (!batchObj) {
      setIsSubmittingAdd(false);
      return;
    }

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
      branchId: batchObj.branchId || (selectedBranch !== 'all' ? selectedBranch : 'budh-vihar'),
    });

    setIsSubmittingAdd(false);
    setIsAddStudentOpen(false);
    resetForm();
  };

  const openEditModal = (st: TStudent) => {
    setEditStudentItem(st);
    setFormName(st.name);
    setFormDob(st.dob || '2011-06-15');
    setFormParentName(st.parentName || '');
    setFormStudentPhone(st.phone || '');
    setFormParentPhone(st.parentPhone || '');
    setFormAddress(st.address || '');
    setFormAdmissionDate(st.admissionDate || new Date().toISOString().split('T')[0]);
    setFormNotes(st.notes || '');
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
    if (!transferStudentItem || !transferToBatch) return;

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
    if (selectedStudentIds.length === 0 || !transferToBatch) return;
    bulkTransferStudents(selectedStudentIds, transferToBatch, transferEffectiveDate);
    setIsBulkTransferOpen(false);
    setSelectedStudentIds([]);
  };

  return (
    <div className="space-y-0 font-['Inter_Tight',sans-serif] max-w-7xl mx-auto">
      {/* ------------------------------------------------------------------ */}
      {/* SECTION 1: TOP TOOLBAR — Branch Only (Matches Fee System Toolbar) */}
      {/* ------------------------------------------------------------------ */}
      <section
        aria-label="Attendance students toolbar"
        className="w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border-b border-[#E5EAF2] dark:border-slate-800"
      >
        <div className="py-2.5 flex items-center justify-start flex-wrap gap-4 sm:gap-6 min-w-0">
          {/* Branch Selector (Fee System Style — compact, borderless, icon + text + chevron + Popover) */}
          <Popover open={isBranchPickerOpen} onOpenChange={setIsBranchPickerOpen}>
            <PopoverTrigger asChild>
              <button
                type="button"
                aria-label="Select branch"
                className="h-7 px-0.5 py-0.5 bg-transparent hover:bg-transparent border-0 rounded-none shadow-none ring-0 outline-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 text-xs sm:text-[13px] font-semibold text-[#172033] dark:text-slate-100 hover:text-[#2864E8] dark:hover:text-blue-400 inline-flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
              >
                <Building2 className="w-3.5 h-3.5 text-[#2864E8] dark:text-blue-400 shrink-0" />
                <span className="whitespace-nowrap">
                  {!selectedBranch || selectedBranch === 'all'
                    ? 'All Branches'
                    : IDL_BRANCHES.find(b => b.id === selectedBranch)?.name || 'Select Branch'}
                </span>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 shrink-0 ${isBranchPickerOpen ? 'rotate-180 text-slate-700 dark:text-slate-200' : ''}`}
                />
              </button>
            </PopoverTrigger>
            <PopoverContent
              align="start"
              sideOffset={8}
              className="w-[212px] p-2 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
            >
              {/* First Option: All Branches */}
              <button
                type="button"
                onClick={() => {
                  setSelectedBranch('all');
                  setIsBranchPickerOpen(false);
                }}
                className={`h-8 w-full px-2.5 rounded-lg text-xs flex items-center justify-between gap-2 transition-colors cursor-pointer select-none ${
                  selectedBranch === 'all'
                    ? 'bg-blue-100/80 dark:bg-blue-950/60 text-[#2864E8] dark:text-blue-400 font-semibold'
                    : 'bg-blue-50/75 hover:bg-blue-100/70 dark:bg-blue-950/35 dark:hover:bg-blue-950/55 text-[#2864E8] dark:text-blue-400 font-semibold'
                }`}
              >
                <span className="flex items-center gap-2 min-w-0">
                  <Globe className="w-3.5 h-3.5 text-[#2864E8] dark:text-blue-400 shrink-0" />
                  <span className="truncate">All Branches</span>
                </span>
                {selectedBranch === 'all' && (
                  <Check className="w-3.5 h-3.5 text-[#2864E8] dark:text-blue-400 shrink-0" />
                )}
              </button>

              <div className="my-1.5 border-t border-slate-100 dark:border-slate-800/80" />

              {/* Individual Branches */}
              <div className="space-y-0.5">
                {IDL_BRANCHES.filter(b => b.id !== 'all').map(b => {
                  const isSelected = selectedBranch === b.id;
                  return (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => {
                        setSelectedBranch(b.id);
                        setIsBranchPickerOpen(false);
                      }}
                      className={`h-8 w-full px-2.5 rounded-lg text-xs flex items-center justify-between gap-2 transition-colors cursor-pointer select-none ${
                        isSelected
                          ? 'bg-blue-50/90 dark:bg-blue-950/40 text-[#2864E8] dark:text-blue-400 font-semibold'
                          : 'text-slate-700 dark:text-slate-200 font-medium hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <span className="flex items-center gap-2 min-w-0">
                        <Building2
                          className={`w-3.5 h-3.5 shrink-0 ${
                            isSelected ? 'text-[#2864E8] dark:text-blue-400' : 'text-slate-400 dark:text-slate-500'
                          }`}
                        />
                        <span className="truncate">{b.name}</span>
                      </span>
                      {isSelected && (
                        <Check className="w-3.5 h-3.5 text-[#2864E8] dark:text-blue-400 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* SECTION 2: STUDENTS Tab + Quick Action (Matches Class/Batch Bar) */}
      {/* ------------------------------------------------------------------ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-[#2864E8] pb-2 sm:pb-2.5 pt-3">
        {/* Left: STUDENTS tab */}
        <div className="overflow-x-auto no-scrollbar -mx-1 px-1">
          <div className="flex items-center gap-1 sm:gap-6 min-w-max">
            <span className="flex items-center gap-1.5 py-1 px-2 text-[12px] sm:text-[12.5px] font-semibold tracking-[0.3px] text-[#2864E8] uppercase">
              <span
                className="text-[13px] leading-none inline-flex items-center justify-center select-none shrink-0"
                style={{ filter: 'grayscale(100%)', opacity: 0.75 }}
                aria-hidden="true"
              >
                🧑‍🎓
              </span>
              <span>STUDENTS</span>
            </span>
          </div>
        </div>

        {/* Right: + STUDENT button with circular outline icon */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0 px-1">
          <button
            type="button"
            onClick={() => {
              resetForm();
              setIsAddStudentOpen(true);
            }}
            className="group flex items-center gap-1.5 text-[12px] sm:text-[12.5px] font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 uppercase tracking-[0.3px] transition-colors bg-transparent border-0 p-0 cursor-pointer focus:outline-none focus:ring-0 shadow-none"
            title="Add Student"
          >
            <span className="w-[18px] h-[18px] rounded-full border border-slate-300 dark:border-slate-600 group-hover:border-slate-500 dark:group-hover:border-slate-400 flex items-center justify-center shrink-0 transition-colors">
              <Plus className="w-2.5 h-2.5 text-slate-500 dark:text-slate-400 group-hover:text-slate-800 dark:group-hover:text-slate-200 transition-colors" strokeWidth={2.5} />
            </span>
            <span>STUDENT</span>
          </button>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* SECTION 3: STUDENT DIRECTORY CARD & FILTERS */}
      {/* ------------------------------------------------------------------ */}
      <div className="pt-4">
        <Card className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-[0_1px_3px_rgba(15,23,42,0.03)] font-['Inter_Tight',sans-serif] overflow-hidden">
          <CardHeader className="py-2.5 sm:py-3 px-4 sm:px-6 border-b border-slate-100 dark:border-slate-800/80">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <CardTitle className="text-base sm:text-[17px] font-bold text-slate-900 dark:text-white tracking-tight uppercase">
                  STUDENT DIRECTORY ({filteredStudents.length})
                </CardTitle>
                <CardDescription className="text-xs text-slate-400 font-normal mt-0.5">
                  Manage student profiles, enrollment, and attendance records.
                </CardDescription>
              </div>

              {/* Filter Row: [ CLASS ] [ BATCH ] [ STATUS ] [ Search (Rightmost, Round) ] */}
              <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap justify-end">
                {/* 1. CLASS (No icon, all capital, compact & refined) */}
                <Select
                  value={classFilter}
                  onValueChange={(val) => {
                    setClassFilter(val);
                    setBatchFilter('all');
                  }}
                >
                  <SelectTrigger className="h-7 !border-0 !border-b-0 !shadow-none !ring-0 !outline-none px-1 text-[11px] font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white focus:!outline-none focus:!ring-0 focus:!ring-offset-0 focus:!shadow-none data-[state=open]:!shadow-none data-[state=open]:!border-b-0 gap-1 cursor-pointer w-auto [&>span]:line-clamp-none [&>svg]:w-3 [&>svg]:h-3 [&>svg]:opacity-60 tracking-wider uppercase">
                    <SelectValue placeholder="CLASS">
                      {classFilter === 'all'
                        ? 'CLASS'
                        : branchClasses.find(c => c.id === classFilter)?.name.toUpperCase() || 'CLASS'}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all" className="text-xs font-semibold">All Classes</SelectItem>
                    {branchClasses.map(c => (
                      <SelectItem key={c.id} value={c.id} className="text-xs">
                        {c.name.startsWith('Class') ? c.name : `Class ${c.name}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* 2. BATCH (No icon, all capital, compact & refined) */}
                <Select value={batchFilter} onValueChange={setBatchFilter}>
                  <SelectTrigger className="h-7 !border-0 !border-b-0 !shadow-none !ring-0 !outline-none px-1 text-[11px] font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white focus:!outline-none focus:!ring-0 focus:!ring-offset-0 focus:!shadow-none data-[state=open]:!shadow-none data-[state=open]:!border-b-0 gap-1 cursor-pointer w-auto [&>span]:line-clamp-none [&>svg]:w-3 [&>svg]:h-3 [&>svg]:opacity-60 tracking-wider uppercase">
                    <SelectValue placeholder="BATCH">
                      {batchFilter === 'all'
                        ? 'BATCH'
                        : availableBatchesForFilter.find(b => b.id === batchFilter)?.name.toUpperCase() || 'BATCH'}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all" className="text-xs font-semibold">All Batches</SelectItem>
                    {availableBatchesForFilter.map(b => (
                      <SelectItem key={b.id} value={b.id} className="text-xs">
                        {b.name.startsWith('Batch') ? b.name : `Batch ${b.name}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* 3. STATUS (No icon, all capital, compact & refined) */}
                <Select value={statusFilter} onValueChange={(val: any) => setStatusFilter(val)}>
                  <SelectTrigger className="h-7 !border-0 !border-b-0 !shadow-none !ring-0 !outline-none px-1 text-[11px] font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white focus:!outline-none focus:!ring-0 focus:!ring-offset-0 focus:!shadow-none data-[state=open]:!shadow-none data-[state=open]:!border-b-0 gap-1 cursor-pointer w-auto [&>span]:line-clamp-none [&>svg]:w-3 [&>svg]:h-3 [&>svg]:opacity-60 tracking-wider uppercase">
                    <SelectValue placeholder="STATUS">
                      {statusFilter === 'all'
                        ? 'STATUS'
                        : statusFilter === 'active'
                          ? 'ACTIVE'
                          : 'ARCHIVED'}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all" className="text-xs font-semibold">All Status</SelectItem>
                    <SelectItem value="active" className="text-xs">Active Only</SelectItem>
                    <SelectItem value="archived" className="text-xs">Archived Only</SelectItem>
                  </SelectContent>
                </Select>

                {/* 4. Search Bar (Rightmost, 100% round, expands right-to-left) */}
                <div className="relative flex items-center justify-end">
                  <div
                    onClick={() => {
                      if (!isStudentSearchOpen && !studentSearch) {
                        setIsStudentSearchOpen(true);
                        setTimeout(() => studentSearchInputRef.current?.focus(), 150);
                      }
                    }}
                    className={`flex items-center rounded-full transition-all duration-300 ease-in-out border ${
                      isStudentSearchOpen || studentSearch
                        ? 'w-48 sm:w-60 h-7 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 shadow-xs px-2.5'
                        : 'w-7 h-7 bg-slate-100/90 hover:bg-slate-200/80 dark:bg-slate-800 dark:hover:bg-slate-700 border-transparent justify-center cursor-pointer'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!isStudentSearchOpen && !studentSearch) {
                          setIsStudentSearchOpen(true);
                          setTimeout(() => studentSearchInputRef.current?.focus(), 150);
                        } else if (isStudentSearchOpen && !studentSearch) {
                          setIsStudentSearchOpen(false);
                        }
                      }}
                      className={`shrink-0 flex items-center justify-center text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors cursor-pointer ${
                        isStudentSearchOpen || studentSearch ? 'w-4 h-4' : 'w-7 h-7 rounded-full'
                      }`}
                      title="Search students"
                    >
                      <Search className="w-3.5 h-3.5" />
                    </button>

                    <input
                      ref={studentSearchInputRef}
                      type="text"
                      placeholder="Search name, roll..."
                      value={studentSearch}
                      onChange={e => setStudentSearch(e.target.value)}
                      onFocus={() => setIsStudentSearchOpen(true)}
                      onBlur={() => {
                        if (!studentSearch.trim()) {
                          setIsStudentSearchOpen(false);
                        }
                      }}
                      onKeyDown={e => {
                        if (e.key === 'Escape') {
                          setStudentSearch('');
                          setIsStudentSearchOpen(false);
                        }
                      }}
                      className={`text-xs bg-transparent border-none outline-none focus:outline-none focus:ring-0 text-slate-800 dark:text-white placeholder:text-slate-400 transition-all duration-300 ${
                        isStudentSearchOpen || studentSearch ? 'w-full ml-1.5 opacity-100' : 'w-0 ml-0 opacity-0 pointer-events-none'
                      }`}
                    />

                    {(isStudentSearchOpen || studentSearch) && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setStudentSearch('');
                          setIsStudentSearchOpen(false);
                        }}
                        className="shrink-0 p-0.5 ml-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
                        title="Clear & close search"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            {/* Multi-Select Floating Bulk Strip */}
            {selectedStudentIds.length > 0 && (
              <div className="m-3 p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 text-[#2864E8] dark:text-blue-400 font-bold">
                  <span>{selectedStudentIds.length} students selected</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    onClick={() => setIsBulkTransferOpen(true)}
                    className="bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs h-7 px-2.5 gap-1 shadow-none"
                  >
                    <ArrowRightLeft className="h-3 w-3" /> Transfer Batch
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => bulkArchiveStudents(selectedStudentIds)}
                    className="text-amber-800 border-amber-300 bg-amber-50 hover:bg-amber-100 font-semibold text-xs h-7 px-2.5 gap-1 shadow-none"
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
                </div>
              </div>
            )}

            {/* Students Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-50/80 dark:bg-slate-900/60 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider text-[10.5px] border-b border-slate-200/70 dark:border-slate-800/80">
                  <tr>
                    <th className="py-2.5 sm:py-3 px-3 w-10 text-center">
                      <input
                        type="checkbox"
                        checked={
                          selectedStudentIds.length === sortedStudents.length &&
                          sortedStudents.length > 0
                        }
                        onChange={e => handleSelectAll(e.target.checked)}
                        className="rounded border-slate-300 text-[#2864E8] focus:ring-[#2864E8] cursor-pointer"
                      />
                    </th>
                    <th className="py-2.5 sm:py-3 px-3.5 pl-3 whitespace-nowrap min-w-[240px]">STUDENT NAME & DETAILS</th>
                    <th className="py-2.5 sm:py-3 px-3.5 whitespace-nowrap w-[200px] min-w-[200px]">CLASS / BATCH</th>
                    <th className="py-2.5 sm:py-3 px-3.5 whitespace-nowrap w-[160px] min-w-[160px]">CONTACT</th>
                    <th className="py-2.5 sm:py-3 px-3.5 text-center whitespace-nowrap w-[110px] min-w-[100px]">STATUS</th>
                    <th className="py-2.5 sm:py-3 px-3.5 text-right pr-5 whitespace-nowrap min-w-[120px]">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {sortedStudents.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-400">
                        <Users className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-700 mb-2" />
                        <p className="font-semibold text-xs text-slate-600 dark:text-slate-300">
                          {classFilter !== 'all' || batchFilter !== 'all' || statusFilter !== 'all' || studentSearch.trim()
                            ? 'No matching students found'
                            : 'No students enrolled yet'}
                        </p>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          {classFilter !== 'all' || batchFilter !== 'all' || statusFilter !== 'all' || studentSearch.trim()
                            ? 'Try adjusting your class, batch, status or search query.'
                            : 'Click + STUDENT above to enroll students.'}
                        </p>
                      </td>
                    </tr>
                  ) : (
                    sortedStudents.map(st => {
                      const isSelected = selectedStudentIds.includes(st.id);
                      const isArchived = st.status === 'archived';

                      return (
                        <tr
                          key={st.id}
                          className={`transition-colors duration-150 ${
                            isSelected ? 'bg-blue-50/40 dark:bg-blue-950/20' : 'hover:bg-slate-50/70 dark:hover:bg-slate-800/40'
                          } ${isArchived ? 'opacity-60 bg-slate-50/40 dark:bg-slate-900/40' : ''}`}
                        >
                          {/* Checkbox */}
                          <td className="py-3 px-3 text-center">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => handleToggleStudent(st.id)}
                              className="rounded border-slate-300 text-[#2864E8] focus:ring-[#2864E8] cursor-pointer"
                            />
                          </td>

                          {/* Student Name & Details */}
                          <td className="py-3 px-3.5 pl-3">
                            <div className="flex flex-col">
                              <div className="flex items-center gap-1.5">
                                <Link
                                  href={`/admin/attendance/students/${st.id}`}
                                  className="text-[13px] font-bold text-slate-900 dark:text-white hover:text-[#2864E8] dark:hover:text-blue-400 transition-colors"
                                >
                                  {st.name}
                                </Link>
                                <span className="text-[10.5px] px-1.5 py-0.2 rounded font-mono font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                                  #{st.rollNo}
                                </span>
                              </div>
                              <div className="flex items-center gap-1 text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
                                {st.parentName && <span>{st.parentName}</span>}
                                {st.parentName && st.admissionDate && <span>•</span>}
                                {st.admissionDate && <span>Joined: {st.admissionDate}</span>}
                              </div>
                            </div>
                          </td>

                          {/* Class / Batch */}
                          <td className="py-3 px-3.5">
                            <div className="flex flex-col">
                              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                                {st.className?.startsWith('Class') ? st.className : `Class ${st.className || '-'}`}
                              </span>
                              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                                {st.batchName?.startsWith('Batch') ? st.batchName : `Batch ${st.batchName || '-'}`}
                              </span>
                            </div>
                          </td>

                          {/* Contact */}
                          <td className="py-3 px-3.5">
                            <div className="flex flex-col text-[11px]">
                              <span className="font-medium text-slate-700 dark:text-slate-300 tabular-nums">
                                {st.parentPhone || st.phone}
                              </span>
                              {st.parentPhone && st.phone && st.parentPhone !== st.phone && (
                                <span className="text-slate-400 tabular-nums">
                                  {st.phone}
                                </span>
                              )}
                            </div>
                          </td>

                          {/* Status */}
                          <td className="py-3 px-3.5 text-center">
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10.5px] font-bold uppercase tracking-wider ${
                                st.status === 'active'
                                  ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200/80 dark:border-emerald-800/60'
                                  : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
                              }`}
                            >
                              {st.status}
                            </span>
                          </td>

                          {/* Actions */}
                          <td className="py-3 px-3.5 text-right pr-5">
                            <div className="flex items-center justify-end gap-1">
                              {/* Edit Button */}
                              <button
                                type="button"
                                onClick={() => openEditModal(st)}
                                className="h-7 w-7 rounded-lg text-slate-400 hover:text-[#2864E8] hover:bg-blue-50/80 dark:hover:bg-slate-800 flex items-center justify-center transition-colors cursor-pointer"
                                title="Edit Student"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>

                              {/* Transfer Batch Button */}
                              <button
                                type="button"
                                onClick={() => {
                                  setTransferStudentItem(st);
                                  const destBatches = batches.filter(b => b.id !== st.batchId);
                                  if (destBatches.length > 0) setTransferToBatch(destBatches[0].id);
                                }}
                                className="h-7 w-7 rounded-lg text-slate-400 hover:text-purple-600 hover:bg-purple-50/80 dark:hover:bg-slate-800 flex items-center justify-center transition-colors cursor-pointer"
                                title="Transfer Batch"
                              >
                                <ArrowRightLeft className="w-3.5 h-3.5" />
                              </button>

                              {/* Archive / Restore Button */}
                              {st.status === 'active' ? (
                                <button
                                  type="button"
                                  onClick={() => archiveStudent(st.id)}
                                  className="h-7 w-7 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50/80 dark:hover:bg-slate-800 flex items-center justify-center transition-colors cursor-pointer"
                                  title="Archive Student"
                                >
                                  <Archive className="w-3.5 h-3.5" />
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => restoreStudent(st.id)}
                                  className="h-7 w-7 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50/80 dark:hover:bg-slate-800 flex items-center justify-center transition-colors cursor-pointer"
                                  title="Restore Student"
                                >
                                  <RotateCcw className="w-3.5 h-3.5" />
                                </button>
                              )}

                              {/* Delete Button */}
                              <button
                                type="button"
                                onClick={() => setDeleteStudentConfirm(st)}
                                className="h-7 w-7 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50/80 dark:hover:bg-slate-800 flex items-center justify-center transition-colors cursor-pointer"
                                title="Delete Student"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* -------------------------------------------------------------------- */}
      {/* MODAL 1: ADD STUDENT (Compact Card Design System) */}
      {/* -------------------------------------------------------------------- */}
      <Dialog open={isAddStudentOpen} onOpenChange={setIsAddStudentOpen}>
        <DialogContent className={`${FORM_CARD_DIALOG_CLS} !pt-3.5 !pb-3.5 !px-4 sm:!px-5 max-h-[90dvh] overflow-y-auto`}>
          <DialogHeader className={`${FORM_CARD_HEADER_CLS} !pb-2`}>
            <div>
              <DialogTitle className={FORM_CARD_TITLE_CLS}>
                Enroll New Student
              </DialogTitle>
              <DialogDescription className={FORM_CARD_DESC_CLS}>
                Add a new student profile and assign them to an academic batch.
              </DialogDescription>
            </div>
          </DialogHeader>

          <form onSubmit={handleAddSubmit} className="space-y-2 pt-0.5" autoComplete="off">
            {/* Row 1: Student Full Name & DOB */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-2">
              <div className="space-y-0.5">
                <Label className={FORM_CARD_LABEL_CLS}>
                  Student Full Name <span className="text-slate-400 dark:text-slate-500 font-normal">*</span>
                </Label>
                <Input
                  placeholder="e.g. Yashika Mehra"
                  value={formName}
                  onChange={e => setFormName(e.target.value)}
                  required
                  className={FORM_CARD_FIELD_CLS}
                />
              </div>

              <div className="space-y-0.5">
                <Label className={FORM_CARD_LABEL_CLS}>
                  Date of Birth
                </Label>
                <Input
                  type="date"
                  value={formDob}
                  onChange={e => setFormDob(e.target.value)}
                  className={`${FORM_CARD_FIELD_CLS} cursor-pointer`}
                />
              </div>
            </div>

            {/* Row 2: Batch & Admission Date */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-2">
              <div className="space-y-0.5">
                <Label className={FORM_CARD_LABEL_CLS}>
                  Assign Batch <span className="text-slate-400 dark:text-slate-500 font-normal">*</span>
                </Label>
                <Select value={formBatch} onValueChange={setFormBatch}>
                  <SelectTrigger className={FORM_CARD_SELECT_TRIGGER_CLS}>
                    <SelectValue placeholder="Select batch..." />
                  </SelectTrigger>
                  <SelectContent className={FORM_CARD_SELECT_CONTENT_CLS}>
                    {batches.map(b => (
                      <SelectItem key={b.id} value={b.id} className={FORM_CARD_SELECT_ITEM_CLS}>
                        Class {b.className || b.name} — Batch {b.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-0.5">
                <Label className={FORM_CARD_LABEL_CLS}>
                  Admission Date <span className="text-slate-400 dark:text-slate-500 font-normal">*</span>
                </Label>
                <Input
                  type="date"
                  value={formAdmissionDate}
                  onChange={e => setFormAdmissionDate(e.target.value)}
                  required
                  className={`${FORM_CARD_FIELD_CLS} cursor-pointer`}
                />
              </div>
            </div>

            {/* Row 3: Student Phone & Parent Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-2">
              <div className="space-y-0.5">
                <Label className={FORM_CARD_LABEL_CLS}>
                  Student Phone
                </Label>
                <Input
                  placeholder="+91 98110 00000"
                  value={formStudentPhone}
                  onChange={e => setFormStudentPhone(e.target.value)}
                  className={FORM_CARD_FIELD_CLS}
                />
              </div>

              <div className="space-y-0.5">
                <Label className={FORM_CARD_LABEL_CLS}>
                  Parent Phone <span className="text-slate-400 dark:text-slate-500 font-normal">*</span>
                </Label>
                <Input
                  placeholder="+91 99110 00000"
                  value={formParentPhone}
                  onChange={e => setFormParentPhone(e.target.value)}
                  required
                  className={FORM_CARD_FIELD_CLS}
                />
              </div>
            </div>

            {/* Row 4: Parent / Guardian Name */}
            <div className="space-y-0.5">
              <Label className={FORM_CARD_LABEL_CLS}>
                Parent / Guardian Name
              </Label>
              <Input
                placeholder="e.g. Rajesh Mehra (Father)"
                value={formParentName}
                onChange={e => setFormParentName(e.target.value)}
                className={FORM_CARD_FIELD_CLS}
              />
            </div>

            {/* Row 5: Address */}
            <div className="space-y-0.5">
              <Label className={FORM_CARD_LABEL_CLS}>
                Residential Address
              </Label>
              <Input
                placeholder="e.g. Budh Vihar, New Delhi"
                value={formAddress}
                onChange={e => setFormAddress(e.target.value)}
                className={FORM_CARD_FIELD_CLS}
              />
            </div>

            {/* Row 6: Admission Notes */}
            <div className="space-y-0.5">
              <Label className={FORM_CARD_LABEL_CLS}>
                Admission Notes (Optional)
              </Label>
              <Input
                placeholder="Target exam, previous school, remarks..."
                value={formNotes}
                onChange={e => setFormNotes(e.target.value)}
                className={FORM_CARD_FIELD_CLS}
              />
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="submit"
                disabled={isSubmittingAdd}
                className={FORM_CARD_SUBMIT_BTN_CLS}
              >
                {isSubmittingAdd ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin shrink-0" />
                    <span>ENROLLING STUDENT...</span>
                  </>
                ) : (
                  <>
                    <span>ENROLL STUDENT</span>
                    <ArrowRight className="w-3.5 h-3.5 text-white/90 group-hover:translate-x-0.5 transition-transform duration-150 shrink-0" />
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* -------------------------------------------------------------------- */}
      {/* MODAL 2: EDIT STUDENT (Compact Card Design System) */}
      {/* -------------------------------------------------------------------- */}
      <Dialog open={!!editStudentItem} onOpenChange={open => !open && setEditStudentItem(null)}>
        <DialogContent className={`${FORM_CARD_DIALOG_CLS} !pt-3.5 !pb-3.5 !px-4 sm:!px-5 max-h-[90dvh] overflow-y-auto`}>
          <DialogHeader className={`${FORM_CARD_HEADER_CLS} !pb-2`}>
            <div>
              <DialogTitle className={FORM_CARD_TITLE_CLS}>
                Edit Student Details
              </DialogTitle>
              <DialogDescription className={FORM_CARD_DESC_CLS}>
                Update student profile, contacts, and personal information.
              </DialogDescription>
            </div>
          </DialogHeader>

          <form onSubmit={handleEditSubmit} className="space-y-2 pt-0.5" autoComplete="off">
            {/* Row 1: Student Full Name & DOB */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-2">
              <div className="space-y-0.5">
                <Label className={FORM_CARD_LABEL_CLS}>
                  Student Full Name <span className="text-slate-400 dark:text-slate-500 font-normal">*</span>
                </Label>
                <Input
                  value={formName}
                  onChange={e => setFormName(e.target.value)}
                  required
                  className={FORM_CARD_FIELD_CLS}
                />
              </div>

              <div className="space-y-0.5">
                <Label className={FORM_CARD_LABEL_CLS}>
                  Date of Birth
                </Label>
                <Input
                  type="date"
                  value={formDob}
                  onChange={e => setFormDob(e.target.value)}
                  className={`${FORM_CARD_FIELD_CLS} cursor-pointer`}
                />
              </div>
            </div>

            {/* Row 2: Student Phone & Parent Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-2">
              <div className="space-y-0.5">
                <Label className={FORM_CARD_LABEL_CLS}>
                  Student Phone
                </Label>
                <Input
                  value={formStudentPhone}
                  onChange={e => setFormStudentPhone(e.target.value)}
                  className={FORM_CARD_FIELD_CLS}
                />
              </div>

              <div className="space-y-0.5">
                <Label className={FORM_CARD_LABEL_CLS}>
                  Parent Phone <span className="text-slate-400 dark:text-slate-500 font-normal">*</span>
                </Label>
                <Input
                  value={formParentPhone}
                  onChange={e => setFormParentPhone(e.target.value)}
                  required
                  className={FORM_CARD_FIELD_CLS}
                />
              </div>
            </div>

            {/* Row 3: Parent / Guardian Name */}
            <div className="space-y-0.5">
              <Label className={FORM_CARD_LABEL_CLS}>
                Parent / Guardian Name
              </Label>
              <Input
                value={formParentName}
                onChange={e => setFormParentName(e.target.value)}
                className={FORM_CARD_FIELD_CLS}
              />
            </div>

            {/* Row 4: Admission Date */}
            <div className="space-y-0.5">
              <Label className={FORM_CARD_LABEL_CLS}>
                Admission Date
              </Label>
              <Input
                type="date"
                value={formAdmissionDate}
                onChange={e => setFormAdmissionDate(e.target.value)}
                className={`${FORM_CARD_FIELD_CLS} cursor-pointer`}
              />
            </div>

            {/* Row 5: Address */}
            <div className="space-y-0.5">
              <Label className={FORM_CARD_LABEL_CLS}>
                Residential Address
              </Label>
              <Input
                value={formAddress}
                onChange={e => setFormAddress(e.target.value)}
                className={FORM_CARD_FIELD_CLS}
              />
            </div>

            {/* Row 6: Notes */}
            <div className="space-y-0.5">
              <Label className={FORM_CARD_LABEL_CLS}>
                Notes
              </Label>
              <Input
                value={formNotes}
                onChange={e => setFormNotes(e.target.value)}
                className={FORM_CARD_FIELD_CLS}
              />
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="submit"
                className={FORM_CARD_SUBMIT_BTN_CLS}
              >
                <span>SAVE STUDENT CHANGES</span>
                <ArrowRight className="w-3.5 h-3.5 text-white/90 group-hover:translate-x-0.5 transition-transform duration-150 shrink-0" />
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* -------------------------------------------------------------------- */}
      {/* MODAL 3: TRANSFER BATCH */}
      {/* -------------------------------------------------------------------- */}
      <Dialog open={!!transferStudentItem} onOpenChange={open => !open && setTransferStudentItem(null)}>
        <DialogContent className={`${FORM_CARD_DIALOG_CLS} !pt-3.5 !pb-3.5 !px-4 sm:!px-5 max-h-[90dvh] overflow-y-auto`}>
          <DialogHeader className={`${FORM_CARD_HEADER_CLS} !pb-2`}>
            <div>
              <DialogTitle className={FORM_CARD_TITLE_CLS}>
                Transfer Batch: {transferStudentItem?.name}
              </DialogTitle>
              <DialogDescription className={FORM_CARD_DESC_CLS}>
                Current Batch: <strong>Batch {transferStudentItem?.batchName}</strong> ({transferStudentItem?.className})
              </DialogDescription>
            </div>
          </DialogHeader>

          <form onSubmit={handleTransferSubmit} className="space-y-2 pt-0.5" autoComplete="off">
            <div className="p-2.5 bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/60 rounded-xl text-purple-900 dark:text-purple-300 text-[11px] leading-relaxed">
              <strong>Data Protection Rule:</strong> Previous attendance will strictly remain tied to{' '}
              <strong>Batch {transferStudentItem?.batchName}</strong>. Future attendance on and after the effective date will be counted under the new batch.
            </div>

            <div className="space-y-0.5">
              <Label className={FORM_CARD_LABEL_CLS}>
                Select Destination Batch <span className="text-slate-400 dark:text-slate-500 font-normal">*</span>
              </Label>
              <Select value={transferToBatch} onValueChange={setTransferToBatch}>
                <SelectTrigger className={FORM_CARD_SELECT_TRIGGER_CLS}>
                  <SelectValue placeholder="Select destination batch..." />
                </SelectTrigger>
                <SelectContent className={FORM_CARD_SELECT_CONTENT_CLS}>
                  {batches
                    .filter(b => b.id !== transferStudentItem?.batchId)
                    .map(b => (
                      <SelectItem key={b.id} value={b.id} className={FORM_CARD_SELECT_ITEM_CLS}>
                        Class {b.className || b.name} — Batch {b.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-0.5">
              <Label className={FORM_CARD_LABEL_CLS}>
                Effective Transfer Date <span className="text-slate-400 dark:text-slate-500 font-normal">*</span>
              </Label>
              <Input
                type="date"
                value={transferEffectiveDate}
                onChange={e => setTransferEffectiveDate(e.target.value)}
                required
                className={`${FORM_CARD_FIELD_CLS} cursor-pointer`}
              />
            </div>

            <div className="space-y-0.5">
              <Label className={FORM_CARD_LABEL_CLS}>
                Reason for Batch Transfer
              </Label>
              <Input
                placeholder="e.g. Schedule clash, requested morning batch..."
                value={transferReason}
                onChange={e => setTransferReason(e.target.value)}
                className={FORM_CARD_FIELD_CLS}
              />
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="submit"
                className={FORM_CARD_SUBMIT_BTN_CLS}
              >
                <span>CONFIRM BATCH TRANSFER</span>
                <ArrowRight className="w-3.5 h-3.5 text-white/90 group-hover:translate-x-0.5 transition-transform duration-150 shrink-0" />
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* -------------------------------------------------------------------- */}
      {/* MODAL 4: BULK TRANSFER BATCH */}
      {/* -------------------------------------------------------------------- */}
      <Dialog open={isBulkTransferOpen} onOpenChange={setIsBulkTransferOpen}>
        <DialogContent className={`${FORM_CARD_DIALOG_CLS} !pt-3.5 !pb-3.5 !px-4 sm:!px-5 max-h-[90dvh] overflow-y-auto`}>
          <DialogHeader className={`${FORM_CARD_HEADER_CLS} !pb-2`}>
            <div>
              <DialogTitle className={FORM_CARD_TITLE_CLS}>
                Bulk Transfer {selectedStudentIds.length} Students
              </DialogTitle>
              <DialogDescription className={FORM_CARD_DESC_CLS}>
                Move selected students to a new academic batch with an effective date.
              </DialogDescription>
            </div>
          </DialogHeader>

          <form onSubmit={handleBulkTransferSubmit} className="space-y-2 pt-0.5" autoComplete="off">
            <div className="space-y-0.5">
              <Label className={FORM_CARD_LABEL_CLS}>
                Destination Batch <span className="text-slate-400 dark:text-slate-500 font-normal">*</span>
              </Label>
              <Select value={transferToBatch} onValueChange={setTransferToBatch}>
                <SelectTrigger className={FORM_CARD_SELECT_TRIGGER_CLS}>
                  <SelectValue placeholder="Select batch..." />
                </SelectTrigger>
                <SelectContent className={FORM_CARD_SELECT_CONTENT_CLS}>
                  {batches.map(b => (
                    <SelectItem key={b.id} value={b.id} className={FORM_CARD_SELECT_ITEM_CLS}>
                      Class {b.className || b.name} — Batch {b.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-0.5">
              <Label className={FORM_CARD_LABEL_CLS}>
                Effective Date <span className="text-slate-400 dark:text-slate-500 font-normal">*</span>
              </Label>
              <Input
                type="date"
                value={transferEffectiveDate}
                onChange={e => setTransferEffectiveDate(e.target.value)}
                required
                className={`${FORM_CARD_FIELD_CLS} cursor-pointer`}
              />
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="submit"
                className={FORM_CARD_SUBMIT_BTN_CLS}
              >
                <span>TRANSFER ALL SELECTED</span>
                <ArrowRight className="w-3.5 h-3.5 text-white/90 group-hover:translate-x-0.5 transition-transform duration-150 shrink-0" />
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* -------------------------------------------------------------------- */}
      {/* SMART DELETE CONFIRMATION */}
      {/* -------------------------------------------------------------------- */}
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
          onArchive={() => {
            archiveStudent(deleteStudentConfirm.id);
            setDeleteStudentConfirm(null);
          }}
          onForceDelete={(reason) => {
            forceDeleteStudent(deleteStudentConfirm.id, reason);
            setDeleteStudentConfirm(null);
          }}
        />
      )}
    </div>
  );
}
