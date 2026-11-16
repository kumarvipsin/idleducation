'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { useAttendance } from '@/context/attendance-context';
import {
  Building2,
  School,
  Edit,
  Trash2,
  Plus,
  Clock,
  Layers,
  ArrowRight,
  RefreshCw,
  X,
  Globe,
  Check,
  ChevronDown,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SmartDeleteDialog } from '@/components/attendance/smart-delete-dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { TBatch, TClass } from '@/lib/attendance-store';

// --------------------------------------------------------------------------
// DESIGN SYSTEM TOKENS (Exact 1:1 Match with Fees Management Class & Batch)
// --------------------------------------------------------------------------
const FORM_CARD_SURFACE_CLS =
  "w-[94vw] rounded-2xl p-5 bg-white dark:bg-slate-950 border border-[#E2E8F0] dark:border-slate-800 shadow-[0_24px_56px_-12px_rgba(11,31,75,0.16),0_6px_18px_-4px_rgba(15,23,42,0.07),0_0_0_1px_rgba(15,23,42,0.03)] font-sans antialiased [&>button:last-child]:border-slate-200/90 [&>button:last-child]:text-slate-400 [&>button:last-child]:hover:text-[#0B1F4B] [&>button:last-child]:hover:border-slate-300 [&>button:last-child]:hover:bg-slate-50 [&>button:last-child]:shadow-[0_1px_2px_rgba(15,23,42,0.04)] [&>button:last-child]:transition-colors";
const FORM_CARD_DIALOG_CLS = `max-w-[440px] ${FORM_CARD_SURFACE_CLS}`;
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
const CIRCLE_PLUS_BTN_BASE_CLS = "rounded-full border inline-flex items-center justify-center shrink-0 transition-colors duration-150 cursor-pointer";
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

const formatBatchDateString = (isoDate?: string) => {
  if (!isoDate) return '';
  try {
    const [y, m, d] = isoDate.split('-');
    if (!y || !m || !d) return isoDate;
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${d} ${months[parseInt(m, 10) - 1]} ${y}`;
  } catch {
    return isoDate;
  }
};

export default function ClassesAndBatchesPage() {
  const {
    classes,
    batches,
    students,
    addClass,
    updateClass,
    archiveClass,
    forceDeleteClass,
    addBatch,
    updateBatch,
    archiveBatch,
    forceDeleteBatch,
    getDependencySummary,
    currentRole,
    isDemoData,
  } = useAttendance();

  // Branch Selection
  const [selectedBranch, setSelectedBranch] = useState<string>('all');
  const [isBranchPickerOpen, setIsBranchPickerOpen] = useState(false);

  // Selected Batch per Class Card
  const [selectedBatchPerClass, setSelectedBatchPerClass] = useState<Record<string, string>>({});

  // 1. Create Class Modal State
  const [isClassModalOpen, setIsClassModalOpen] = useState(false);
  const [isSubmittingClass, setIsSubmittingClass] = useState(false);
  const [classForm, setClassForm] = useState({
    name: '',
    division: '',
    branchId: 'budh-vihar',
    academicSession: '2026-27',
    order: '' as number | '',
  });

  // 1B. Edit Class Modal State
  const [isEditClassOpen, setIsEditClassOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<TClass | null>(null);
  const [editClassForm, setEditClassForm] = useState({
    name: '',
    division: '',
    branchId: 'budh-vihar',
    academicSession: '2026-27',
    order: '' as number | '',
  });

  // 2. Create Batch Modal State
  const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);
  const [isSubmittingBatch, setIsSubmittingBatch] = useState(false);
  const [batchForm, setBatchForm] = useState({
    branchId: 'budh-vihar',
    classId: '',
    name: '',
    startDate: '2026-04-01',
    endDate: '2027-03-31',
    duration: '01 Apr 2026 – 31 Mar 2027',
    classTime: '04:00 PM - 06:00 PM',
    order: '' as number | '',
    monthlyFee: 2400 as number | '',
    courseFee: 28800 as number | '',
    subjects: ['Maths', 'Science', 'English', 'Social Studies'] as string[],
  });
  const [newBatchSubjectInput, setNewBatchSubjectInput] = useState('');
  const [isBatchSubjectInputOpen, setIsBatchSubjectInputOpen] = useState(false);
  const batchSubjectInputRef = useRef<HTMLInputElement | null>(null);

  // 2B. Edit Batch Modal State
  const [isEditBatchOpen, setIsEditBatchOpen] = useState(false);
  const [editingBatch, setEditingBatch] = useState<TBatch | null>(null);
  const [editBatchForm, setEditBatchForm] = useState({
    branchId: 'budh-vihar',
    classId: '',
    name: '',
    startDate: '',
    endDate: '',
    duration: '',
    classTime: '',
    order: '' as number | '',
    monthlyFee: 2400 as number | '',
    courseFee: 28800 as number | '',
    subjects: [] as string[],
  });
  const [newEditBatchSubjectInput, setNewEditBatchSubjectInput] = useState('');
  const [isEditBatchSubjectInputOpen, setIsEditBatchSubjectInputOpen] = useState(false);
  const editBatchSubjectInputRef = useRef<HTMLInputElement | null>(null);

  // Deletion Confirmations
  const [deleteClassConfirm, setDeleteClassConfirm] = useState<TClass | null>(null);
  const [deleteBatchConfirm, setDeleteBatchConfirm] = useState<TBatch | null>(null);

  // Filtered Classes based on Branch Selection
  const filteredClasses = classes
    .filter(c => {
      if (selectedBranch === 'all') return true;
      const cBranch = c.branchId || 'budh-vihar';
      return cBranch.toLowerCase().includes(selectedBranch.replace('-branch', '')) || cBranch === selectedBranch;
    })
    .sort((a, b) => {
      const ordA = a.order !== undefined && a.order !== null ? Number(a.order) : 999999;
      const ordB = b.order !== undefined && b.order !== null ? Number(b.order) : 999999;
      if (ordA !== ordB) return ordA - ordB;
      return a.name.localeCompare(b.name, undefined, { numeric: true });
    });

  // Open Create Class Modal
  const openCreateClassModal = () => {
    setClassForm({
      name: '',
      division: '',
      branchId: selectedBranch !== 'all' ? selectedBranch : 'budh-vihar',
      academicSession: '2026-27',
      order: '',
    });
    setIsClassModalOpen(true);
  };

  // Open Edit Class Modal
  const openEditClassModal = (cls: TClass) => {
    setEditingClass(cls);
    setEditClassForm({
      name: cls.name.replace(/^Class\s*/i, ''),
      division: cls.division || '',
      branchId: cls.branchId || 'budh-vihar',
      academicSession: cls.academicSession || '2026-27',
      order: cls.order !== undefined && cls.order !== null ? cls.order : '',
    });
    setIsEditClassOpen(true);
  };

  // Open Create Batch Modal
  const openCreateBatchModal = (preselectedClassId?: string) => {
    const targetClass = preselectedClassId
      ? classes.find(c => c.id === preselectedClassId)
      : (filteredClasses[0] || classes[0]);
    const branchId = targetClass?.branchId || (selectedBranch !== 'all' ? selectedBranch : 'budh-vihar');

    setBatchForm({
      branchId,
      classId: targetClass ? targetClass.id : '',
      name: '',
      startDate: '2026-04-01',
      endDate: '2027-03-31',
      duration: '01 Apr 2026 – 31 Mar 2027',
      classTime: '04:00 PM - 06:00 PM',
      order: '',
      monthlyFee: 2400,
      courseFee: 28800,
      subjects: ['Maths', 'Science', 'English', 'Social Studies'],
    });
    setNewBatchSubjectInput('');
    setIsBatchSubjectInputOpen(false);
    setIsBatchModalOpen(true);
  };

  // Open Edit Batch Modal
  const openEditBatchModal = (batch: TBatch) => {
    setEditingBatch(batch);
    const targetClass = classes.find(c => c.id === batch.classId);
    const branchId = batch.branchId || targetClass?.branchId || 'budh-vihar';

    setEditBatchForm({
      branchId,
      classId: batch.classId,
      name: batch.name.replace(/^Batch\s*/i, ''),
      startDate: batch.startDate || '2026-04-01',
      endDate: batch.endDate || '2027-03-31',
      duration: batch.duration || '01 Apr 2026 – 31 Mar 2027',
      classTime: batch.classTime || '04:00 PM - 06:00 PM',
      order: batch.order !== undefined && batch.order !== null ? batch.order : '',
      monthlyFee: batch.monthlyFee !== undefined ? batch.monthlyFee : 2400,
      courseFee: batch.courseFee !== undefined ? batch.courseFee : 28800,
      subjects: batch.subjects && batch.subjects.length > 0 ? [...batch.subjects] : ['Maths', 'Science', 'English', 'Social Studies'],
    });
    setNewEditBatchSubjectInput('');
    setIsEditBatchSubjectInputOpen(false);
    setIsEditBatchOpen(true);
  };

  // Handle Add Subject in Create Batch
  const handleAddBatchSubject = () => {
    const trimmed = newBatchSubjectInput.trim();
    if (!trimmed) return;
    if (batchForm.subjects.some(s => s.toLowerCase() === trimmed.toLowerCase())) return;
    setBatchForm(prev => ({
      ...prev,
      subjects: [...prev.subjects, trimmed],
    }));
    setNewBatchSubjectInput('');
  };

  const handleDeleteBatchSubject = (idx: number) => {
    setBatchForm(prev => ({
      ...prev,
      subjects: prev.subjects.filter((_, i) => i !== idx),
    }));
  };

  // Handle Add Subject in Edit Batch
  const handleAddEditBatchSubject = () => {
    const trimmed = newEditBatchSubjectInput.trim();
    if (!trimmed) return;
    if (editBatchForm.subjects.some(s => s.toLowerCase() === trimmed.toLowerCase())) return;
    setEditBatchForm(prev => ({
      ...prev,
      subjects: [...prev.subjects, trimmed],
    }));
    setNewEditBatchSubjectInput('');
  };

  const handleDeleteEditBatchSubject = (idx: number) => {
    setEditBatchForm(prev => ({
      ...prev,
      subjects: prev.subjects.filter((_, i) => i !== idx),
    }));
  };

  // Submit Create Class
  const handleCreateClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!classForm.name.trim()) return;

    setIsSubmittingClass(true);
    const rawName = classForm.name.trim();
    const displayName = classForm.division
      ? `Class ${rawName} (${classForm.division.trim()})`
      : `Class ${rawName}`;

    addClass({
      name: rawName,
      displayName,
      division: classForm.division.trim(),
      branchId: classForm.branchId,
      academicSession: classForm.academicSession || '2026-27',
      order: classForm.order !== '' && classForm.order !== undefined ? Number(classForm.order) : undefined,
      batches: [],
      status: 'active',
    });

    setIsSubmittingClass(false);
    setIsClassModalOpen(false);
  };

  // Submit Update Class
  const handleUpdateClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingClass || !editClassForm.name.trim()) return;

    const rawName = editClassForm.name.trim();
    const displayName = editClassForm.division
      ? `Class ${rawName} (${editClassForm.division.trim()})`
      : `Class ${rawName}`;

    updateClass(editingClass.id, {
      name: rawName,
      displayName,
      division: editClassForm.division.trim(),
      branchId: editClassForm.branchId,
      academicSession: editClassForm.academicSession || '2026-27',
      order: editClassForm.order !== '' && editClassForm.order !== undefined ? Number(editClassForm.order) : undefined,
    });

    setIsEditClassOpen(false);
    setEditingClass(null);
  };

  // Submit Create Batch
  const handleCreateBatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!batchForm.name.trim() || !batchForm.classId) return;

    setIsSubmittingBatch(true);
    const targetClass = classes.find(c => c.id === batchForm.classId);
    if (!targetClass) {
      setIsSubmittingBatch(false);
      return;
    }

    const durationStr = batchForm.startDate && batchForm.endDate
      ? `${formatBatchDateString(batchForm.startDate)} – ${formatBatchDateString(batchForm.endDate)}`
      : batchForm.startDate
        ? `From ${formatBatchDateString(batchForm.startDate)}`
        : '';

    addBatch({
      name: batchForm.name.trim(),
      classId: targetClass.id,
      className: targetClass.name,
      branchId: batchForm.branchId || targetClass.branchId || 'budh-vihar',
      startDate: batchForm.startDate,
      endDate: batchForm.endDate,
      duration: durationStr,
      classTime: batchForm.classTime || '04:00 PM - 06:00 PM',
      order: batchForm.order !== '' && batchForm.order !== undefined ? Number(batchForm.order) : undefined,
      monthlyFee: Number(batchForm.monthlyFee) || 2400,
      courseFee: Number(batchForm.courseFee) || (Number(batchForm.monthlyFee) ? Number(batchForm.monthlyFee) * 12 : 28800),
      subjects: batchForm.subjects.length > 0 ? batchForm.subjects : ['Maths', 'Science', 'English', 'Social Studies'],
      room: 'Room 101',
      status: 'active',
    });

    setIsSubmittingBatch(false);
    setIsBatchModalOpen(false);
  };

  // Submit Update Batch
  const handleUpdateBatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBatch || !editBatchForm.name.trim() || !editBatchForm.classId) return;

    const targetClass = classes.find(c => c.id === editBatchForm.classId);

    const durationStr = editBatchForm.startDate && editBatchForm.endDate
      ? `${formatBatchDateString(editBatchForm.startDate)} – ${formatBatchDateString(editBatchForm.endDate)}`
      : editBatchForm.startDate
        ? `From ${formatBatchDateString(editBatchForm.startDate)}`
        : editBatchForm.duration || '';

    updateBatch(editingBatch.id, {
      name: editBatchForm.name.trim(),
      classId: editBatchForm.classId,
      className: targetClass?.name || editingBatch.className,
      branchId: editBatchForm.branchId,
      startDate: editBatchForm.startDate,
      endDate: editBatchForm.endDate,
      duration: durationStr,
      classTime: editBatchForm.classTime,
      order: editBatchForm.order !== '' && editBatchForm.order !== undefined ? Number(editBatchForm.order) : undefined,
      monthlyFee: Number(editBatchForm.monthlyFee) || 0,
      courseFee: Number(editBatchForm.courseFee) || 0,
      subjects: editBatchForm.subjects,
    });

    setIsEditBatchOpen(false);
    setEditingBatch(null);
  };

  return (
    <div className="space-y-0 font-['Inter_Tight',sans-serif] max-w-7xl mx-auto">
      {/* ------------------------------------------------------------------ */}
      {/* SECTION 1: TOP TOOLBAR — Branch Only (Matches Fee System Toolbar) */}
      {/* ------------------------------------------------------------------ */}
      <section
        aria-label="Attendance classes toolbar"
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
      {/* SECTION 2: CLASS/BATCH Tab + Quick Actions (Matches Fee System Nav) */}
      {/* ------------------------------------------------------------------ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-[#2864E8] pb-2 sm:pb-2.5 pt-3">
        {/* Left: CLASS/BATCH label */}
        <div className="overflow-x-auto no-scrollbar -mx-1 px-1">
          <div className="flex items-center gap-1 sm:gap-6 min-w-max">
            <span className="flex items-center gap-1.5 py-1 px-2 text-[12px] sm:text-[12.5px] font-semibold tracking-[0.3px] text-[#2864E8] uppercase">
              <School className="w-[15px] h-[15px] shrink-0" />
              <span>CLASS/BATCH</span>
            </span>
          </div>
        </div>

        {/* Right: Quick Action Controls — ⊕ CLASS, ⊕ BATCH (circular outline icons) */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0 px-1">
          <button
            type="button"
            onClick={() => openCreateClassModal()}
            className="group flex items-center gap-1.5 text-[12px] sm:text-[12.5px] font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 uppercase tracking-[0.3px] transition-colors bg-transparent border-0 p-0 cursor-pointer focus:outline-none focus:ring-0 shadow-none"
            title="Add Class"
          >
            <span className="w-[18px] h-[18px] rounded-full border border-slate-300 dark:border-slate-600 group-hover:border-slate-500 dark:group-hover:border-slate-400 flex items-center justify-center shrink-0 transition-colors">
              <Plus className="w-2.5 h-2.5 text-slate-500 dark:text-slate-400 group-hover:text-slate-800 dark:group-hover:text-slate-200 transition-colors" strokeWidth={2.5} />
            </span>
            <span>CLASS</span>
          </button>
          <button
            type="button"
            onClick={() => openCreateBatchModal()}
            className="group flex items-center gap-1.5 text-[12px] sm:text-[12.5px] font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 uppercase tracking-[0.3px] transition-colors bg-transparent border-0 p-0 cursor-pointer focus:outline-none focus:ring-0 shadow-none"
            title="Add Batch"
          >
            <span className="w-[18px] h-[18px] rounded-full border border-slate-300 dark:border-slate-600 group-hover:border-slate-500 dark:group-hover:border-slate-400 flex items-center justify-center shrink-0 transition-colors">
              <Plus className="w-2.5 h-2.5 text-slate-500 dark:text-slate-400 group-hover:text-slate-800 dark:group-hover:text-slate-200 transition-colors" strokeWidth={2.5} />
            </span>
            <span>BATCH</span>
          </button>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* 2-COLUMN CLASS & BATCH CARDS (Exact match with Fees Management) */}
      {/* ------------------------------------------------------------------ */}
      <div className="pt-4">
      {filteredClasses.length === 0 ? (
        <div className="w-full h-40 sm:h-48 flex flex-col items-center justify-center rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 text-center px-4">
          <School className="w-8 h-8 text-slate-300 dark:text-slate-700 mb-2" />
          <p className="font-semibold text-xs text-slate-600 dark:text-slate-300">No classes found</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Click + CLASS above to create classes and batches for this branch.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          {filteredClasses.map(cls => {
            const clsBatches = batches
              .filter(b => b.classId === cls.id)
              .sort((a, b) => {
                const ordA = a.order !== undefined && a.order !== null ? Number(a.order) : 999999;
                const ordB = b.order !== undefined && b.order !== null ? Number(b.order) : 999999;
                if (ordA !== ordB) return ordA - ordB;
                return a.name.localeCompare(b.name, undefined, { numeric: true });
              });

            const branch = IDL_BRANCHES.find(b => b.id === (cls.branchId || 'budh-vihar')) || IDL_BRANCHES[1];
            const activeBatchId = selectedBatchPerClass[cls.id] || clsBatches[0]?.id;
            const activeBatch = clsBatches.find(b => b.id === activeBatchId) || clsBatches[0];
            const batchIds = new Set(clsBatches.map(b => b.id));
            const clsStudentCount = students.filter(s => (s.classId === cls.id || batchIds.has(s.batchId)) && s.status === 'active').length;

            return (
              <Card
                key={cls.id}
                className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-[0_1px_3px_rgba(15,23,42,0.03)] hover:shadow-md hover:border-slate-300/80 transition-all overflow-hidden flex flex-col justify-between"
              >
                <div>
                  {/* Card Header */}
                  <div className="p-3.5 sm:p-4 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-800/40 space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <h3 className="text-base sm:text-[17px] font-bold text-slate-900 dark:text-white tracking-tight truncate">
                          {branch?.name.replace(' Branch', '') || 'Budh Vihar'}
                        </h3>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => openEditClassModal(cls)}
                          className="h-7 w-7 rounded-lg text-slate-400 hover:text-[#2864E8] hover:bg-blue-50/80 dark:hover:bg-slate-800 flex items-center justify-center transition-colors cursor-pointer"
                          title="Edit Class Details"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteClassConfirm(cls)}
                          className="h-7 w-7 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50/80 dark:hover:bg-slate-800 flex items-center justify-center transition-colors cursor-pointer"
                          title="Delete Class"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Metadata Row: Class Name • Division • Academic Year */}
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium flex-wrap">
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {cls.name.startsWith('Class') ? cls.name : `Class ${cls.name}`}
                      </span>
                      {cls.division && (
                        <>
                          <span className="text-slate-300 dark:text-slate-600">•</span>
                          <span className="uppercase text-slate-600 dark:text-slate-300 font-semibold">{cls.division}</span>
                        </>
                      )}
                      <span className="text-slate-300 dark:text-slate-600">•</span>
                      <span className="tabular-nums">{cls.academicSession || '2026-27'}</span>
                    </div>

                    {/* Statistics */}
                    <div className="flex items-center gap-3 pt-1 text-[11px] text-slate-500 dark:text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#2864E8]" />
                        <span>Batches:</span>
                        <span className="font-semibold text-slate-900 dark:text-white tabular-nums">{clsBatches.length}</span>
                      </div>
                      <span className="text-slate-300 dark:text-slate-700">•</span>
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span>Enrolled Students:</span>
                        <span className="font-semibold text-slate-900 dark:text-white tabular-nums">{clsStudentCount}</span>
                      </div>
                    </div>
                  </div>

                  {/* Batches Content Area */}
                  <div className="p-3.5 sm:p-4 space-y-3">
                    {/* Batch Navigation Header */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center shrink-0">
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                          Batches
                        </span>
                      </div>

                      {/* Batch text tabs */}
                      {clsBatches.length > 0 && (
                        <div className="flex-1 flex items-center overflow-x-auto no-scrollbar mx-2 py-0.5">
                          <div className="inline-flex items-center gap-3">
                            {clsBatches.map(b => {
                              const isActive = b.id === activeBatch?.id;
                              return (
                                <button
                                  key={b.id}
                                  type="button"
                                  onClick={() => setSelectedBatchPerClass(prev => ({ ...prev, [cls.id]: b.id }))}
                                  className={`text-[12px] transition-colors cursor-pointer shrink-0 whitespace-nowrap bg-transparent p-0 ${
                                    isActive
                                      ? "font-bold text-[#2864E8] dark:text-[#4B82F6]"
                                      : "font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                                  }`}
                                >
                                  {b.name.startsWith('Batch') ? b.name : `Batch ${b.name}`}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Add Batch Button */}
                      <button
                        type="button"
                        onClick={() => openCreateBatchModal(cls.id)}
                        className="h-7 w-7 rounded-lg text-[#2864E8] hover:text-[#1E4ED8] hover:bg-blue-50 dark:hover:bg-blue-950/40 flex items-center justify-center transition-colors cursor-pointer shrink-0"
                        title="Add Batch"
                        aria-label="Add Batch"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    {clsBatches.length === 0 ? (
                      <div
                        onClick={() => openCreateBatchModal(cls.id)}
                        className="py-5 px-3 rounded-xl text-center cursor-pointer transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-800/40 border border-slate-100 dark:border-slate-800/80"
                      >
                        <Layers className="w-7 h-7 mx-auto text-slate-300 dark:text-slate-700 mb-1.5" />
                        <p className="font-semibold text-xs text-slate-600 dark:text-slate-300">No batches added yet</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">Click + above to create a batch for this class.</p>
                      </div>
                    ) : activeBatch ? (
                      <div className="border-t border-slate-100 dark:border-slate-800/80 pt-2.5 space-y-2">
                        {/* Selected Batch Top Row: Batch Name & Students on left, Fee & Actions on right */}
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-1.5 min-w-0">
                            <span className="text-[13.5px] font-bold text-slate-900 dark:text-white tracking-tight truncate">
                              {activeBatch.name.startsWith('Batch') ? activeBatch.name : `Batch ${activeBatch.name}`}
                            </span>
                            <span className="text-slate-300 dark:text-slate-600">•</span>
                            <Link
                              href={`/admin/attendance/students?classId=${cls.id}&batchId=${activeBatch.id}`}
                              className="text-[11px] text-[#2864E8] hover:underline font-semibold tabular-nums whitespace-nowrap cursor-pointer inline-flex items-center gap-0.5"
                              title="View enrolled students in this batch"
                            >
                              <span>{students.filter(s => s.batchId === activeBatch.id).length} students</span>
                              <span className="text-[10px]">→</span>
                            </Link>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <span className="font-bold text-emerald-600 dark:text-emerald-400 text-[13px] tabular-nums tracking-tight">
                              ₹{Number(activeBatch.monthlyFee || 2400).toLocaleString('en-IN')}<span className="text-[10.5px] text-slate-400 font-normal ml-0.5">/mo</span>
                            </span>
                            <div className="flex items-center gap-0.5 border-l border-slate-200/80 dark:border-slate-700/60 pl-1.5">
                              <button
                                type="button"
                                onClick={() => openEditBatchModal(activeBatch)}
                                className="h-6.5 w-6.5 rounded-md text-slate-400 hover:text-[#2864E8] hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center transition-colors cursor-pointer"
                                title="Edit Batch"
                              >
                                <Edit className="w-3 h-3" />
                              </button>
                              <button
                                type="button"
                                onClick={() => setDeleteBatchConfirm(activeBatch)}
                                className="h-6.5 w-6.5 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-slate-800 flex items-center justify-center transition-colors cursor-pointer"
                                title="Delete Batch"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Timing, Dates, Subjects */}
                        <div className="pt-2 border-t border-slate-100 dark:border-slate-800/60 space-y-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                          <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 font-medium">
                            <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span>{activeBatch.classTime || '04:00 PM - 06:00 PM'}</span>
                            <span className="text-slate-400 font-normal">
                              • {activeBatch.duration || (activeBatch.startDate ? `${activeBatch.startDate} - Ongoing` : '01 Apr 2026 – 31 Mar 2027')}
                            </span>
                          </div>

                          {/* Subjects */}
                          <div className="flex items-center gap-1.5 text-[11px] pt-0.5">
                            <span className="text-slate-400 font-normal shrink-0">Subjects:</span>
                            <span
                              className="text-slate-700 dark:text-slate-300 font-medium truncate"
                              title={(activeBatch.subjects || ['Maths', 'Science', 'English', 'Social Studies']).join(', ')}
                            >
                              {(activeBatch.subjects || ['Maths', 'Science', 'English', 'Social Studies']).join(', ')}
                            </span>
                          </div>
                        </div>
                      </div>
                    ) : null}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
      </div>

      {/* -------------------------------------------------------------------- */}
      {/* MODAL 1: CREATE CLASS (Compact Card Design System) */}
      {/* -------------------------------------------------------------------- */}
      <Dialog open={isClassModalOpen} onOpenChange={setIsClassModalOpen}>
        <DialogContent className={`${FORM_CARD_DIALOG_CLS} !pt-3.5 !pb-3.5 !px-4 sm:!px-5`}>
          <DialogHeader className={`${FORM_CARD_HEADER_CLS} !pb-2`}>
            <div>
              <DialogTitle className={FORM_CARD_TITLE_CLS}>
                Create Academic Class
              </DialogTitle>
              <DialogDescription className={FORM_CARD_DESC_CLS}>
                Define a new academic class and assign it to a branch.
              </DialogDescription>
            </div>
          </DialogHeader>

          <form onSubmit={handleCreateClass} className="space-y-2 pt-0.5" autoComplete="off">
            {/* Row 1: Class Name & Class Title */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-2">
              <div className="space-y-0.5">
                <Label className={FORM_CARD_LABEL_CLS}>
                  Class Name <span className="text-slate-400 dark:text-slate-500 font-normal">*</span>
                </Label>
                <Input
                  placeholder="e.g. Class 9, Class 10"
                  value={classForm.name}
                  onChange={e => setClassForm({ ...classForm, name: e.target.value })}
                  required
                  className={FORM_CARD_FIELD_CLS}
                />
              </div>

              <div className="space-y-0.5">
                <Label className={FORM_CARD_LABEL_CLS}>
                  Class Title <span className="text-slate-400 dark:text-slate-500 font-normal">*</span>
                </Label>
                <Input
                  placeholder="e.g. CBSE, FOUNDATION"
                  value={classForm.division}
                  onChange={e => setClassForm({ ...classForm, division: e.target.value })}
                  className={FORM_CARD_FIELD_CLS}
                />
              </div>
            </div>

            {/* Row 2: Branch & Academic Session */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-2">
              <div className="space-y-0.5">
                <Label className={FORM_CARD_LABEL_CLS}>
                  Branch <span className="text-slate-400 dark:text-slate-500 font-normal">*</span>
                </Label>
                <Select
                  value={classForm.branchId}
                  onValueChange={val => setClassForm({ ...classForm, branchId: val })}
                >
                  <SelectTrigger className={FORM_CARD_SELECT_TRIGGER_CLS}>
                    <SelectValue placeholder="Select branch" />
                  </SelectTrigger>
                  <SelectContent className={FORM_CARD_SELECT_CONTENT_CLS}>
                    {IDL_BRANCHES.filter(b => b.id !== 'all').map(b => (
                      <SelectItem
                        key={b.id}
                        value={b.id}
                        className={FORM_CARD_SELECT_ITEM_CLS}
                      >
                        {b.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-0.5">
                <Label className={FORM_CARD_LABEL_CLS}>
                  Academic Session
                </Label>
                <Input
                  placeholder="e.g. 2026-27"
                  value={classForm.academicSession}
                  onChange={e => setClassForm({ ...classForm, academicSession: e.target.value })}
                  className={FORM_CARD_FIELD_CLS}
                />
              </div>
            </div>

            {/* Row 3: Card Order Number */}
            <div className="space-y-0.5">
              <Label className={FORM_CARD_LABEL_CLS}>
                Card Order Number <span className="text-slate-400 dark:text-slate-500 font-normal">(Optional)</span>
              </Label>
              <Input
                type="number"
                min="1"
                placeholder="e.g. 1, 2"
                value={classForm.order !== undefined ? classForm.order : ''}
                onChange={e => setClassForm({ ...classForm, order: e.target.value === '' ? '' : Number(e.target.value) })}
                className={FORM_CARD_FIELD_CLS}
              />
            </div>

            <DialogFooter className="pt-1.5">
              <Button
                type="submit"
                disabled={isSubmittingClass}
                className={FORM_CARD_SUBMIT_BTN_CLS}
              >
                {isSubmittingClass ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin shrink-0" />
                    <span>CREATING CLASS...</span>
                  </>
                ) : (
                  <>
                    <span>CREATE CLASS</span>
                    <ArrowRight className="w-3.5 h-3.5 text-white/90 group-hover:translate-x-0.5 transition-transform duration-150 shrink-0" />
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* -------------------------------------------------------------------- */}
      {/* MODAL 1B: EDIT CLASS (Compact Card Design System) */}
      {/* -------------------------------------------------------------------- */}
      <Dialog open={isEditClassOpen} onOpenChange={setIsEditClassOpen}>
        <DialogContent className={`${FORM_CARD_DIALOG_CLS} !pt-3.5 !pb-3.5 !px-4 sm:!px-5`}>
          <DialogHeader className={`${FORM_CARD_HEADER_CLS} !pb-2`}>
            <div>
              <DialogTitle className={FORM_CARD_TITLE_CLS}>
                Edit Academic Class
              </DialogTitle>
              <DialogDescription className={FORM_CARD_DESC_CLS}>
                Update academic class details and branch assignment.
              </DialogDescription>
            </div>
          </DialogHeader>

          <form onSubmit={handleUpdateClass} className="space-y-2 pt-0.5" autoComplete="off">
            {/* Row 1: Class Name & Class Title */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-2">
              <div className="space-y-0.5">
                <Label className={FORM_CARD_LABEL_CLS}>
                  Class Name <span className="text-slate-400 dark:text-slate-500 font-normal">*</span>
                </Label>
                <Input
                  placeholder="e.g. Class 9, Class 10"
                  value={editClassForm.name}
                  onChange={e => setEditClassForm({ ...editClassForm, name: e.target.value })}
                  required
                  className={FORM_CARD_FIELD_CLS}
                />
              </div>

              <div className="space-y-0.5">
                <Label className={FORM_CARD_LABEL_CLS}>
                  Class Title <span className="text-slate-400 dark:text-slate-500 font-normal">*</span>
                </Label>
                <Input
                  placeholder="e.g. CBSE, FOUNDATION"
                  value={editClassForm.division || ''}
                  onChange={e => setEditClassForm({ ...editClassForm, division: e.target.value })}
                  className={FORM_CARD_FIELD_CLS}
                />
              </div>
            </div>

            {/* Row 2: Branch & Academic Session */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-2">
              <div className="space-y-0.5">
                <Label className={FORM_CARD_LABEL_CLS}>
                  Branch <span className="text-slate-400 dark:text-slate-500 font-normal">*</span>
                </Label>
                <Select
                  value={editClassForm.branchId}
                  onValueChange={val => setEditClassForm({ ...editClassForm, branchId: val })}
                >
                  <SelectTrigger className={FORM_CARD_SELECT_TRIGGER_CLS}>
                    <SelectValue placeholder="Select branch" />
                  </SelectTrigger>
                  <SelectContent className={FORM_CARD_SELECT_CONTENT_CLS}>
                    {IDL_BRANCHES.filter(b => b.id !== 'all').map(b => (
                      <SelectItem
                        key={b.id}
                        value={b.id}
                        className={FORM_CARD_SELECT_ITEM_CLS}
                      >
                        {b.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-0.5">
                <Label className={FORM_CARD_LABEL_CLS}>
                  Academic Session
                </Label>
                <Input
                  placeholder="e.g. 2026-27"
                  value={editClassForm.academicSession}
                  onChange={e => setEditClassForm({ ...editClassForm, academicSession: e.target.value })}
                  className={FORM_CARD_FIELD_CLS}
                />
              </div>
            </div>

            {/* Row 3: Card Order Number */}
            <div className="space-y-0.5">
              <Label className={FORM_CARD_LABEL_CLS}>
                Card Order Number <span className="text-slate-400 dark:text-slate-500 font-normal">(Optional)</span>
              </Label>
              <Input
                type="number"
                min="1"
                placeholder="e.g. 1, 2"
                value={editClassForm.order !== undefined && editClassForm.order !== null ? editClassForm.order : ''}
                onChange={e => setEditClassForm({ ...editClassForm, order: e.target.value === '' ? '' : Number(e.target.value) })}
                className={FORM_CARD_FIELD_CLS}
              />
            </div>

            <DialogFooter className="pt-1.5">
              <Button
                type="submit"
                className={FORM_CARD_SUBMIT_BTN_CLS}
              >
                <span>SAVE CLASS CHANGES</span>
                <ArrowRight className="w-3.5 h-3.5 text-white/90 group-hover:translate-x-0.5 transition-transform duration-150 shrink-0" />
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* -------------------------------------------------------------------- */}
      {/* MODAL 2: CREATE BATCH (Compact Card Design System) */}
      {/* -------------------------------------------------------------------- */}
      <Dialog open={isBatchModalOpen} onOpenChange={setIsBatchModalOpen}>
        <DialogContent className={`${FORM_CARD_DIALOG_CLS} !pt-3.5 !pb-3.5 !px-4 sm:!px-5 max-h-[90dvh] overflow-y-auto`}>
          <DialogHeader className={`${FORM_CARD_HEADER_CLS} !pb-2`}>
            <div>
              <DialogTitle className={FORM_CARD_TITLE_CLS}>
                Create Academic Batch
              </DialogTitle>
              <DialogDescription className={FORM_CARD_DESC_CLS}>
                Define a new academic batch, schedule, and fee structure.
              </DialogDescription>
            </div>
          </DialogHeader>

          <form onSubmit={handleCreateBatch} className="space-y-2 pt-0.5" autoComplete="off">
            {/* Row 1: Branch & Class */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-2">
              <div className="space-y-0.5">
                <Label className={FORM_CARD_LABEL_CLS}>
                  Branch <span className="text-slate-400 dark:text-slate-500 font-normal">*</span>
                </Label>
                <Select
                  value={batchForm.branchId || undefined}
                  onValueChange={val => {
                    const branchClasses = classes.filter(c => (c.branchId || 'budh-vihar') === val);
                    const nextClass =
                      branchClasses.length === 1
                        ? branchClasses[0]
                        : branchClasses.find(c => c.id === batchForm.classId);
                    setBatchForm(prev => ({
                      ...prev,
                      branchId: val,
                      classId: nextClass ? nextClass.id : prev.classId,
                    }));
                  }}
                >
                  <SelectTrigger className={FORM_CARD_SELECT_TRIGGER_CLS}>
                    <SelectValue placeholder="Select branch" />
                  </SelectTrigger>
                  <SelectContent className={FORM_CARD_SELECT_CONTENT_CLS}>
                    {IDL_BRANCHES.filter(b => b.id !== 'all').map(b => (
                      <SelectItem
                        key={b.id}
                        value={b.id}
                        className={FORM_CARD_SELECT_ITEM_CLS}
                      >
                        {b.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-0.5">
                <Label className={FORM_CARD_LABEL_CLS}>
                  Class <span className="text-slate-400 dark:text-slate-500 font-normal">*</span>
                </Label>
                <Select
                  value={batchForm.classId || undefined}
                  onValueChange={val => {
                    const matchedClass = classes.find(c => c.id === val);
                    setBatchForm(prev => ({
                      ...prev,
                      classId: val,
                      branchId: matchedClass?.branchId || prev.branchId,
                    }));
                  }}
                >
                  <SelectTrigger className={FORM_CARD_SELECT_TRIGGER_CLS}>
                    <SelectValue placeholder="Select class" />
                  </SelectTrigger>
                  <SelectContent className={FORM_CARD_SELECT_CONTENT_CLS}>
                    {classes.map(c => (
                      <SelectItem
                        key={c.id}
                        value={c.id}
                        className={FORM_CARD_SELECT_ITEM_CLS}
                      >
                        {c.name.startsWith('Class') ? c.name : `Class ${c.name}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Row 1B: Batch Name */}
            <div className="space-y-0.5">
              <Label className={FORM_CARD_LABEL_CLS}>
                Batch Name <span className="text-slate-400 dark:text-slate-500 font-normal">*</span>
              </Label>
              <Input
                placeholder="e.g. Alpha, Batch A1"
                value={batchForm.name}
                onChange={e => setBatchForm({ ...batchForm, name: e.target.value })}
                required
                className={FORM_CARD_FIELD_CLS}
              />
            </div>

            {/* Row 2: Batch Start Date & Batch End Date */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-2">
              <div className="space-y-0.5">
                <Label className={FORM_CARD_LABEL_CLS}>
                  Batch Start Date
                </Label>
                <Input
                  type={batchForm.startDate ? "date" : "text"}
                  placeholder="DD/MM/YYYY"
                  value={batchForm.startDate || ''}
                  onFocus={e => (e.target.type = 'date')}
                  onBlur={e => {
                    if (!e.target.value) e.target.type = 'text';
                  }}
                  onChange={e => {
                    const newStart = e.target.value;
                    const durationStr = newStart && batchForm.endDate
                      ? `${formatBatchDateString(newStart)} – ${formatBatchDateString(batchForm.endDate)}`
                      : newStart ? `From ${formatBatchDateString(newStart)}` : '';
                    setBatchForm({
                      ...batchForm,
                      startDate: newStart,
                      duration: durationStr,
                    });
                  }}
                  className={`${FORM_CARD_FIELD_CLS} cursor-pointer`}
                />
              </div>

              <div className="space-y-0.5">
                <Label className={FORM_CARD_LABEL_CLS}>
                  Batch End Date
                </Label>
                <Input
                  type={batchForm.endDate ? "date" : "text"}
                  placeholder="DD/MM/YYYY"
                  value={batchForm.endDate || ''}
                  onFocus={e => (e.target.type = 'date')}
                  onBlur={e => {
                    if (!e.target.value) e.target.type = 'text';
                  }}
                  onChange={e => {
                    const newEnd = e.target.value;
                    const durationStr = batchForm.startDate && newEnd
                      ? `${formatBatchDateString(batchForm.startDate)} – ${formatBatchDateString(newEnd)}`
                      : newEnd ? `Till ${formatBatchDateString(newEnd)}` : '';
                    setBatchForm({
                      ...batchForm,
                      endDate: newEnd,
                      duration: durationStr,
                    });
                  }}
                  className={`${FORM_CARD_FIELD_CLS} cursor-pointer`}
                />
              </div>
            </div>

            {/* Row 3: Class Timings & Batch Order */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-2">
              <div className="space-y-0.5">
                <Label className={FORM_CARD_LABEL_CLS}>
                  Class Timings
                </Label>
                <Input
                  placeholder="e.g. 4:00 - 6:00 PM"
                  value={batchForm.classTime}
                  onChange={e => setBatchForm({ ...batchForm, classTime: e.target.value })}
                  className={FORM_CARD_FIELD_CLS}
                />
              </div>

              <div className="space-y-0.5">
                <Label className={FORM_CARD_LABEL_CLS}>
                  Batch Order <span className="text-slate-400 dark:text-slate-500 font-normal">(Optional)</span>
                </Label>
                <Input
                  type="number"
                  min="1"
                  placeholder="e.g. 1, 2"
                  value={batchForm.order !== undefined ? batchForm.order : ''}
                  onChange={e => setBatchForm({ ...batchForm, order: e.target.value === '' ? '' : Number(e.target.value) })}
                  className={FORM_CARD_FIELD_CLS}
                />
              </div>
            </div>

            {/* Row 4: Batch Monthly Fee & Batch Yearly Fee */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-2">
              <div className="space-y-0.5">
                <Label className={FORM_CARD_LABEL_CLS}>
                  Batch Monthly Fee (₹)
                </Label>
                <Input
                  type="number"
                  min="0"
                  placeholder="e.g. 1500"
                  value={batchForm.monthlyFee !== undefined && batchForm.monthlyFee !== '' ? batchForm.monthlyFee : ''}
                  onChange={e => {
                    const m = e.target.value === '' ? '' : Number(e.target.value);
                    setBatchForm(prev => ({
                      ...prev,
                      monthlyFee: m,
                      courseFee: typeof m === 'number' && m > 0 ? m * 12 : '',
                    }));
                  }}
                  className={FORM_CARD_FIELD_CLS}
                />
              </div>

              <div className="space-y-0.5">
                <Label className={FORM_CARD_LABEL_CLS}>
                  Batch Yearly Fee (₹)
                </Label>
                <Input
                  type="number"
                  min="0"
                  placeholder="e.g. 18000"
                  value={batchForm.courseFee !== undefined && batchForm.courseFee !== '' ? batchForm.courseFee : ''}
                  onChange={e => {
                    const y = e.target.value === '' ? '' : Number(e.target.value);
                    setBatchForm(prev => ({
                      ...prev,
                      courseFee: y,
                      monthlyFee: typeof y === 'number' && y > 0 ? Math.round(y / 12) : '',
                    }));
                  }}
                  className={FORM_CARD_FIELD_CLS}
                />
              </div>
            </div>

            {/* Row 5: Subjects */}
            <div className="space-y-1">
              <div className="flex items-center gap-1.5">
                <Label className={FORM_CARD_LABEL_CLS}>
                  Subjects <span className="text-slate-400 dark:text-slate-500 font-normal">(Optional)</span>
                </Label>
                <button
                  type="button"
                  onClick={() => {
                    if (!isBatchSubjectInputOpen) {
                      setIsBatchSubjectInputOpen(true);
                      requestAnimationFrame(() => batchSubjectInputRef.current?.focus());
                    } else if (newBatchSubjectInput.trim()) {
                      handleAddBatchSubject();
                      requestAnimationFrame(() => batchSubjectInputRef.current?.focus());
                    } else {
                      setIsBatchSubjectInputOpen(false);
                    }
                  }}
                  className={`${CIRCLE_PLUS_BTN_BASE_CLS} w-4 h-4 ${
                    isBatchSubjectInputOpen
                      ? 'border-[#2864E8]/70 text-[#2864E8] bg-[#2864E8]/[0.06] dark:border-blue-500/70 dark:text-blue-400'
                      : 'border-slate-300 dark:border-slate-700 text-slate-400 dark:text-slate-500 hover:border-[#2864E8] hover:text-[#2864E8] hover:bg-[#2864E8]/[0.06]'
                  }`}
                  title={isBatchSubjectInputOpen && !newBatchSubjectInput.trim() ? 'Hide subject field' : 'Add Subject'}
                  aria-label="Add Subject"
                  aria-expanded={isBatchSubjectInputOpen}
                >
                  <Plus className="w-2.5 h-2.5 stroke-[2.2]" />
                </button>
              </div>

              {isBatchSubjectInputOpen && (
                <Input
                  ref={batchSubjectInputRef}
                  placeholder="e.g. Physics, Maths"
                  value={newBatchSubjectInput}
                  onChange={e => setNewBatchSubjectInput(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddBatchSubject();
                    }
                  }}
                  className={FORM_CARD_FIELD_CLS}
                />
              )}

              {batchForm.subjects && batchForm.subjects.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                  {batchForm.subjects.map((sub, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[5px] bg-slate-50 dark:bg-slate-900 text-xs font-medium text-[#0B1F4B] dark:text-slate-200 border border-slate-200 dark:border-slate-800"
                    >
                      <span>{sub}</span>
                      <button
                        type="button"
                        onClick={() => handleDeleteBatchSubject(idx)}
                        className="text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                        title="Remove Subject"
                        aria-label={`Remove ${sub}`}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <DialogFooter className="pt-1.5">
              <Button
                type="submit"
                disabled={isSubmittingBatch}
                className={FORM_CARD_SUBMIT_BTN_CLS}
              >
                {isSubmittingBatch ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin shrink-0" />
                    <span>CREATING BATCH...</span>
                  </>
                ) : (
                  <>
                    <span>CREATE BATCH</span>
                    <ArrowRight className="w-3.5 h-3.5 text-white/90 group-hover:translate-x-0.5 transition-transform duration-150 shrink-0" />
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* -------------------------------------------------------------------- */}
      {/* MODAL 2B: EDIT BATCH (Compact Card Design System) */}
      {/* -------------------------------------------------------------------- */}
      <Dialog open={isEditBatchOpen} onOpenChange={setIsEditBatchOpen}>
        <DialogContent className={`${FORM_CARD_DIALOG_CLS} !pt-3.5 !pb-3.5 !px-4 sm:!px-5 max-h-[90dvh] overflow-y-auto`}>
          <DialogHeader className={`${FORM_CARD_HEADER_CLS} !pb-2`}>
            <div>
              <DialogTitle className={FORM_CARD_TITLE_CLS}>
                Edit Academic Batch
              </DialogTitle>
              <DialogDescription className={FORM_CARD_DESC_CLS}>
                Update academic batch schedule, timings, and fee structure.
              </DialogDescription>
            </div>
          </DialogHeader>

          <form onSubmit={handleUpdateBatch} className="space-y-2 pt-0.5" autoComplete="off">
            {/* Row 1: Branch & Class */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-2">
              <div className="space-y-0.5">
                <Label className={FORM_CARD_LABEL_CLS}>
                  Branch <span className="text-slate-400 dark:text-slate-500 font-normal">*</span>
                </Label>
                <Select
                  value={editBatchForm.branchId || undefined}
                  onValueChange={val => {
                    const branchClasses = classes.filter(c => (c.branchId || 'budh-vihar') === val);
                    const nextClass =
                      branchClasses.length === 1
                        ? branchClasses[0]
                        : branchClasses.find(c => c.id === editBatchForm.classId);
                    setEditBatchForm(prev => ({
                      ...prev,
                      branchId: val,
                      classId: nextClass ? nextClass.id : prev.classId,
                    }));
                  }}
                >
                  <SelectTrigger className={FORM_CARD_SELECT_TRIGGER_CLS}>
                    <SelectValue placeholder="Select branch" />
                  </SelectTrigger>
                  <SelectContent className={FORM_CARD_SELECT_CONTENT_CLS}>
                    {IDL_BRANCHES.filter(b => b.id !== 'all').map(b => (
                      <SelectItem
                        key={b.id}
                        value={b.id}
                        className={FORM_CARD_SELECT_ITEM_CLS}
                      >
                        {b.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-0.5">
                <Label className={FORM_CARD_LABEL_CLS}>
                  Class <span className="text-slate-400 dark:text-slate-500 font-normal">*</span>
                </Label>
                <Select
                  value={editBatchForm.classId || undefined}
                  onValueChange={val => {
                    const matchedClass = classes.find(c => c.id === val);
                    setEditBatchForm(prev => ({
                      ...prev,
                      classId: val,
                      branchId: matchedClass?.branchId || prev.branchId,
                    }));
                  }}
                >
                  <SelectTrigger className={FORM_CARD_SELECT_TRIGGER_CLS}>
                    <SelectValue placeholder="Select class" />
                  </SelectTrigger>
                  <SelectContent className={FORM_CARD_SELECT_CONTENT_CLS}>
                    {classes.map(c => (
                      <SelectItem
                        key={c.id}
                        value={c.id}
                        className={FORM_CARD_SELECT_ITEM_CLS}
                      >
                        {c.name.startsWith('Class') ? c.name : `Class ${c.name}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Row 1B: Batch Name */}
            <div className="space-y-0.5">
              <Label className={FORM_CARD_LABEL_CLS}>
                Batch Name <span className="text-slate-400 dark:text-slate-500 font-normal">*</span>
              </Label>
              <Input
                placeholder="e.g. Alpha, Batch A1"
                value={editBatchForm.name}
                onChange={e => setEditBatchForm({ ...editBatchForm, name: e.target.value })}
                required
                className={FORM_CARD_FIELD_CLS}
              />
            </div>

            {/* Row 2: Batch Start Date & Batch End Date */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-2">
              <div className="space-y-0.5">
                <Label className={FORM_CARD_LABEL_CLS}>
                  Batch Start Date
                </Label>
                <Input
                  type={editBatchForm.startDate ? "date" : "text"}
                  placeholder="DD/MM/YYYY"
                  value={editBatchForm.startDate || ''}
                  onFocus={e => (e.target.type = 'date')}
                  onBlur={e => {
                    if (!e.target.value) e.target.type = 'text';
                  }}
                  onChange={e => {
                    const newStart = e.target.value;
                    const durationStr = newStart && editBatchForm.endDate
                      ? `${formatBatchDateString(newStart)} – ${formatBatchDateString(editBatchForm.endDate)}`
                      : newStart ? `From ${formatBatchDateString(newStart)}` : '';
                    setEditBatchForm({
                      ...editBatchForm,
                      startDate: newStart,
                      duration: durationStr,
                    });
                  }}
                  className={`${FORM_CARD_FIELD_CLS} cursor-pointer`}
                />
              </div>

              <div className="space-y-0.5">
                <Label className={FORM_CARD_LABEL_CLS}>
                  Batch End Date
                </Label>
                <Input
                  type={editBatchForm.endDate ? "date" : "text"}
                  placeholder="DD/MM/YYYY"
                  value={editBatchForm.endDate || ''}
                  onFocus={e => (e.target.type = 'date')}
                  onBlur={e => {
                    if (!e.target.value) e.target.type = 'text';
                  }}
                  onChange={e => {
                    const newEnd = e.target.value;
                    const durationStr = editBatchForm.startDate && newEnd
                      ? `${formatBatchDateString(editBatchForm.startDate)} – ${formatBatchDateString(newEnd)}`
                      : newEnd ? `Till ${formatBatchDateString(newEnd)}` : '';
                    setEditBatchForm({
                      ...editBatchForm,
                      endDate: newEnd,
                      duration: durationStr,
                    });
                  }}
                  className={`${FORM_CARD_FIELD_CLS} cursor-pointer`}
                />
              </div>
            </div>

            {/* Row 3: Class Timings & Batch Order */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-2">
              <div className="space-y-0.5">
                <Label className={FORM_CARD_LABEL_CLS}>
                  Class Timings
                </Label>
                <Input
                  placeholder="e.g. 4:00 - 6:00 PM"
                  value={editBatchForm.classTime}
                  onChange={e => setEditBatchForm({ ...editBatchForm, classTime: e.target.value })}
                  className={FORM_CARD_FIELD_CLS}
                />
              </div>

              <div className="space-y-0.5">
                <Label className={FORM_CARD_LABEL_CLS}>
                  Batch Order <span className="text-slate-400 dark:text-slate-500 font-normal">(Optional)</span>
                </Label>
                <Input
                  type="number"
                  min="1"
                  placeholder="e.g. 1, 2"
                  value={editBatchForm.order !== undefined && editBatchForm.order !== null ? editBatchForm.order : ''}
                  onChange={e => setEditBatchForm({ ...editBatchForm, order: e.target.value === '' ? '' : Number(e.target.value) })}
                  className={FORM_CARD_FIELD_CLS}
                />
              </div>
            </div>

            {/* Row 4: Batch Monthly Fee & Batch Yearly Fee */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3 gap-y-2">
              <div className="space-y-0.5">
                <Label className={FORM_CARD_LABEL_CLS}>
                  Batch Monthly Fee (₹)
                </Label>
                <Input
                  type="number"
                  min="0"
                  placeholder="e.g. 1500"
                  value={editBatchForm.monthlyFee !== undefined && editBatchForm.monthlyFee !== '' ? editBatchForm.monthlyFee : ''}
                  onChange={e => {
                    const m = e.target.value === '' ? '' : Number(e.target.value);
                    setEditBatchForm(prev => ({
                      ...prev,
                      monthlyFee: m,
                      courseFee: typeof m === 'number' && m > 0 ? m * 12 : '',
                    }));
                  }}
                  className={FORM_CARD_FIELD_CLS}
                />
              </div>

              <div className="space-y-0.5">
                <Label className={FORM_CARD_LABEL_CLS}>
                  Batch Yearly Fee (₹)
                </Label>
                <Input
                  type="number"
                  min="0"
                  placeholder="e.g. 18000"
                  value={editBatchForm.courseFee !== undefined && editBatchForm.courseFee !== '' ? editBatchForm.courseFee : ''}
                  onChange={e => {
                    const y = e.target.value === '' ? '' : Number(e.target.value);
                    setEditBatchForm(prev => ({
                      ...prev,
                      courseFee: y,
                      monthlyFee: typeof y === 'number' && y > 0 ? Math.round(y / 12) : '',
                    }));
                  }}
                  className={FORM_CARD_FIELD_CLS}
                />
              </div>
            </div>

            {/* Row 5: Subjects */}
            <div className="space-y-1">
              <div className="flex items-center gap-1.5">
                <Label className={FORM_CARD_LABEL_CLS}>
                  Subjects <span className="text-slate-400 dark:text-slate-500 font-normal">(Optional)</span>
                </Label>
                <button
                  type="button"
                  onClick={() => {
                    if (!isEditBatchSubjectInputOpen) {
                      setIsEditBatchSubjectInputOpen(true);
                      requestAnimationFrame(() => editBatchSubjectInputRef.current?.focus());
                    } else if (newEditBatchSubjectInput.trim()) {
                      handleAddEditBatchSubject();
                      requestAnimationFrame(() => editBatchSubjectInputRef.current?.focus());
                    } else {
                      setIsEditBatchSubjectInputOpen(false);
                    }
                  }}
                  className={`${CIRCLE_PLUS_BTN_BASE_CLS} w-4 h-4 ${
                    isEditBatchSubjectInputOpen
                      ? 'border-[#2864E8]/70 text-[#2864E8] bg-[#2864E8]/[0.06] dark:border-blue-500/70 dark:text-blue-400'
                      : 'border-slate-300 dark:border-slate-700 text-slate-400 dark:text-slate-500 hover:border-[#2864E8] hover:text-[#2864E8] hover:bg-[#2864E8]/[0.06]'
                  }`}
                  title={isEditBatchSubjectInputOpen && !newEditBatchSubjectInput.trim() ? 'Hide subject field' : 'Add Subject'}
                  aria-label="Add Subject"
                  aria-expanded={isEditBatchSubjectInputOpen}
                >
                  <Plus className="w-2.5 h-2.5 stroke-[2.2]" />
                </button>
              </div>

              {isEditBatchSubjectInputOpen && (
                <Input
                  ref={editBatchSubjectInputRef}
                  placeholder="e.g. Physics, Maths"
                  value={newEditBatchSubjectInput}
                  onChange={e => setNewEditBatchSubjectInput(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddEditBatchSubject();
                    }
                  }}
                  className={FORM_CARD_FIELD_CLS}
                />
              )}

              {editBatchForm.subjects && editBatchForm.subjects.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                  {editBatchForm.subjects.map((sub, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[5px] bg-slate-50 dark:bg-slate-900 text-xs font-medium text-[#0B1F4B] dark:text-slate-200 border border-slate-200 dark:border-slate-800"
                    >
                      <span>{sub}</span>
                      <button
                        type="button"
                        onClick={() => handleDeleteEditBatchSubject(idx)}
                        className="text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                        title="Remove Subject"
                        aria-label={`Remove ${sub}`}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <DialogFooter className="pt-1.5">
              <Button
                type="submit"
                className={FORM_CARD_SUBMIT_BTN_CLS}
              >
                <span>SAVE BATCH CHANGES</span>
                <ArrowRight className="w-3.5 h-3.5 text-white/90 group-hover:translate-x-0.5 transition-transform duration-150 shrink-0" />
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* -------------------------------------------------------------------- */}
      {/* DELETE DIALOGS (Smart Deletion with dependency integrity) */}
      {/* -------------------------------------------------------------------- */}
      <SmartDeleteDialog
        open={!!deleteClassConfirm}
        onClose={() => setDeleteClassConfirm(null)}
        entityType="Class"
        entityName={deleteClassConfirm?.displayName || deleteClassConfirm?.name || ''}
        entityId={deleteClassConfirm?.id || ''}
        isDemoMode={isDemoData}
        currentRole={currentRole}
        dependencies={getDependencySummary('Class', deleteClassConfirm?.id || '')}
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

      <SmartDeleteDialog
        open={!!deleteBatchConfirm}
        onClose={() => setDeleteBatchConfirm(null)}
        entityType="Batch"
        entityName={deleteBatchConfirm?.name || ''}
        entityId={deleteBatchConfirm?.id || ''}
        isDemoMode={isDemoData}
        currentRole={currentRole}
        dependencies={getDependencySummary('Batch', deleteBatchConfirm?.id || '')}
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
