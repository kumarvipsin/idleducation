'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  FeeClass,
  FeeBatch,
  FeeStudent,
  IDL_BRANCHES,
} from '@/types/fee-management';
import {
  createFeeClass,
  updateFeeClass,
  deleteFeeClass,
  createFeeBatch,
  updateFeeBatch,
  deleteFeeBatch,
} from '@/app/actions/fee-management';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover';
import { FormModalDialogContent } from '@/components/ui/form-modal-dialog';
import { useToast } from '@/hooks/use-toast';
import {
  AlertTriangle,
  ArrowRight,
  Building2,
  Check,
  ChevronDown,
  Clock,
  Edit,
  Globe,
  Layers,
  Plus,
  RefreshCw,
  School,
  Trash2,
  X,
} from 'lucide-react';

// Shared Card Modal Styles (Create Class / Create Batch / Edit Class / Edit Batch)
export const FORM_CARD_SURFACE_CLS =
  'w-[94vw] rounded-2xl p-5 bg-white dark:bg-slate-950 border border-[#E2E8F0] dark:border-slate-800 shadow-[0_24px_56px_-12px_rgba(11,31,75,0.16),0_6px_18px_-4px_rgba(15,23,42,0.07),0_0_0_1px_rgba(15,23,42,0.03)] font-sans antialiased [&>button:last-child]:border-slate-200/90 [&>button:last-child]:text-slate-400 [&>button:last-child]:hover:text-[#0B1F4B] [&>button:last-child]:hover:border-slate-300 [&>button:last-child]:hover:bg-slate-50 [&>button:last-child]:shadow-[0_1px_2px_rgba(15,23,42,0.04)] [&>button:last-child]:transition-colors';
export const FORM_CARD_DIALOG_CLS = `max-w-[440px] ${FORM_CARD_SURFACE_CLS}`;
export const FORM_CARD_WIDE_DIALOG_CLS = `max-w-[480px] sm:max-w-[500px] ${FORM_CARD_SURFACE_CLS}`;
export const FORM_CARD_HEADER_CLS =
  'pb-3 border-b border-[#EEF2F7] dark:border-slate-800/80 shrink-0 text-left pr-9';
export const FORM_CARD_TITLE_CLS =
  'text-[16px] sm:text-[17px] font-bold text-[#0B1F4B] dark:text-white tracking-[-0.015em] leading-snug';
export const FORM_CARD_DESC_CLS =
  'text-[11.5px] text-slate-500 dark:text-slate-400 font-normal leading-relaxed mt-0.5';
export const FORM_CARD_LABEL_CLS =
  'text-xs font-medium text-slate-400 dark:text-slate-500 tracking-[0.005em]';
export const FORM_CARD_FIELD_CLS =
  'h-9 text-xs sm:text-[13px] md:text-[13px] font-semibold !rounded-none !border-0 !border-b border-slate-200/85 dark:border-slate-800 !bg-transparent px-0 hover:!border-b-slate-300 dark:hover:!border-b-slate-700 focus:!bg-transparent focus:!border-b-[#2864E8] focus-visible:ring-0 focus-visible:!border-b-[#2864E8] placeholder:font-normal placeholder:text-slate-400/65 dark:placeholder:text-slate-600 text-[#0B1F4B] dark:text-slate-100 transition-colors duration-150 !shadow-none';
export const FORM_CARD_SELECT_TRIGGER_CLS = `${FORM_CARD_FIELD_CLS} focus:outline-none focus:ring-0 focus-visible:outline-none data-[state=open]:!border-b-[#2864E8] data-[state=open]:!bg-transparent data-[placeholder]:font-normal data-[placeholder]:text-slate-400/65 dark:data-[placeholder]:text-slate-600 [&>svg]:text-slate-400 data-[state=open]:[&>svg]:text-[#2864E8] [&>svg]:transition-[transform,color] [&>svg]:duration-150 data-[state=open]:[&>svg]:rotate-180`;
export const FORM_CARD_SELECT_CONTENT_CLS =
  'rounded-xl border border-slate-200/95 dark:border-slate-800 bg-white dark:bg-slate-950 p-1 shadow-[0_14px_34px_-8px_rgba(11,31,75,0.14),0_2px_8px_rgba(15,23,42,0.05)]';
export const FORM_CARD_SELECT_ITEM_CLS =
  'text-xs sm:text-[13px] font-medium text-slate-700 dark:text-slate-200 rounded-lg py-1.5 sm:py-2 focus:bg-blue-50/90 focus:text-[#2864E8] data-[state=checked]:text-[#2864E8] data-[state=checked]:font-semibold dark:focus:bg-blue-950/40 dark:focus:text-blue-400 cursor-pointer';
export const CIRCLE_PLUS_BTN_BASE_CLS =
  'rounded-full border inline-flex items-center justify-center shrink-0 transition-colors duration-150 cursor-pointer';
export const FORM_CARD_SUBMIT_BTN_CLS =
  'group w-full h-9 !rounded-[5px] text-xs font-semibold uppercase tracking-[0.06em] bg-[#2864E8] hover:bg-[#1E4ED8] active:bg-[#1842BE] text-white shadow-[0_2px_8px_-1px_rgba(40,100,232,0.26),0_1px_2px_rgba(23,32,51,0.08)] hover:shadow-[0_4px_12px_rgba(40,100,232,0.3),0_1px_3px_rgba(23,32,51,0.1)] flex items-center justify-center gap-2 transition-all duration-150 cursor-pointer active:scale-[0.995]';

export type ClassBatchDeleteTarget = {
  type: 'class' | 'batch';
  id: string;
  name: string;
};

type ClassFormState = {
  name: string;
  code: string;
  division: string;
  branchId: string;
  academicSession: string;
  description: string;
  defaultMonthlyFee: number;
  order?: number | '';
};

type EditClassFormState = {
  name: string;
  division?: string;
  code: string;
  branchId: string;
  academicSession: string;
  description: string;
  defaultMonthlyFee: number;
  order?: number | '';
};

type BatchFormState = {
  classId: string;
  branchId: string;
  name: string;
  duration: string;
  classTime: string;
  subjects: string[];
  monthlyFee: number;
  courseFee?: number;
  startDate?: string;
  endDate?: string;
  order?: number | '';
};

const EMPTY_CLASS_FORM: ClassFormState = {
  name: '',
  code: '',
  division: '',
  branchId: '',
  academicSession: '',
  description: '',
  defaultMonthlyFee: 0,
  order: '',
};

const EMPTY_BATCH_FORM: BatchFormState = {
  classId: '',
  branchId: '',
  name: '',
  duration: '',
  classTime: '',
  subjects: [],
  monthlyFee: 0,
  courseFee: 0,
  startDate: '',
  endDate: '',
  order: '',
};

/** Formats an ISO YYYY-MM-DD date string into `DD MMM YYYY` for batch duration badges. */
export function formatBatchDateString(dateStr?: string): string {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  const [y, m, d] = parts;
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthIdx = parseInt(m, 10) - 1;
  return `${d} ${monthNames[monthIdx] || m} ${y}`;
}

/** Parses `startDate` and `endDate` ISO strings back out of a formatted batch duration string. */
export function parseDateRangeFromDuration(durationStr?: string): { startDate: string; endDate: string } {
  if (!durationStr) return { startDate: '', endDate: '' };
  const monthMap: Record<string, string> = {
    jan: '01',
    feb: '02',
    mar: '03',
    apr: '04',
    may: '05',
    jun: '06',
    jul: '07',
    aug: '08',
    sep: '09',
    oct: '10',
    nov: '11',
    dec: '12',
  };
  const parsePart = (str: string): string => {
    const m = str.trim().match(/(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})/);
    if (!m) return '';
    const day = m[1].padStart(2, '0');
    const mon = monthMap[m[2].toLowerCase().slice(0, 3)];
    const year = m[3];
    if (mon && year) return `${year}-${mon}-${day}`;
    return '';
  };

  const normalized = durationStr.replace(/–/g, '-');
  if (normalized.includes('-')) {
    const [startRaw, endRaw] = normalized.split('-');
    return {
      startDate: parsePart(startRaw),
      endDate: parsePart(endRaw),
    };
  }
  if (normalized.startsWith('From ')) {
    return { startDate: parsePart(normalized.replace('From ', '')), endDate: '' };
  }
  if (normalized.startsWith('Till ')) {
    return { startDate: '', endDate: parsePart(normalized.replace('Till ', '')) };
  }
  return { startDate: '', endDate: '' };
}

/** Parses comma-separated subject entries while deduplicating case-insensitively. */
export function parseSubjectEntries(raw: string, existing: string[] = []): string[] {
  const result = [...existing];
  for (const part of raw.split(',')) {
    const clean = part.trim();
    if (clean && !result.some(s => s.toLowerCase() === clean.toLowerCase())) {
      result.push(clean);
    }
  }
  return result;
}

interface UseClassBatchControllerOptions {
  classes: FeeClass[];
  selectedBranch: string;
  hasBranchSelection: boolean;
  onRefresh: () => void | Promise<void>;
  onBatchUpdated?: (batchId: string) => void | Promise<void>;
  onRequestDelete?: (target: ClassBatchDeleteTarget) => void;
  isBranchAdmin?: boolean;
  branchAdminBranchId?: string;
}

/**
 * Shared state and CRUD handlers for Academic Class & Batch creation, editing, filtering, and deletion.
 */
export function useClassBatchController({
  classes,
  selectedBranch,
  hasBranchSelection,
  onRefresh,
  onBatchUpdated,
  onRequestDelete,
  isBranchAdmin = false,
  branchAdminBranchId,
}: UseClassBatchControllerOptions) {
  const { toast } = useToast();

  // Create Class state
  const [isClassModalOpen, setIsClassModalOpen] = useState(false);
  const [classForm, setClassForm] = useState<ClassFormState>({ ...EMPTY_CLASS_FORM });

  // Create Batch state
  const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);
  const [isSubmittingBatch, setIsSubmittingBatch] = useState(false);
  const [batchForm, setBatchForm] = useState<BatchFormState>({ ...EMPTY_BATCH_FORM });
  const [newBatchSubjectInput, setNewBatchSubjectInput] = useState('');
  const [isBatchSubjectInputOpen, setIsBatchSubjectInputOpen] = useState(false);
  const batchSubjectInputRef = useRef<HTMLInputElement | null>(null);
  const [editingBatchSubIdx, setEditingBatchSubIdx] = useState<number | null>(null);
  const [editingBatchSubName, setEditingBatchSubName] = useState('');
  const [isCustomBatchFee, setIsCustomBatchFee] = useState(false);
  const [selectedBatchPerClass, setSelectedBatchPerClass] = useState<Record<string, string>>({});

  // Edit Batch state
  const [isEditBatchOpen, setIsEditBatchOpen] = useState(false);
  const [editingBatch, setEditingBatch] = useState<FeeBatch | null>(null);
  const [editBatchForm, setEditBatchForm] = useState<BatchFormState>({
    ...EMPTY_BATCH_FORM,
    branchId: 'mukherjee-nagar',
  });
  const [newEditBatchSubjectInput, setNewEditBatchSubjectInput] = useState('');
  const [editingEditBatchSubIdx, setEditingEditBatchSubIdx] = useState<number | null>(null);
  const [editingEditBatchSubName, setEditingEditBatchSubName] = useState('');

  // Edit Class state
  const [isEditClassOpen, setIsEditClassOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<FeeClass | null>(null);
  const [editClassForm, setEditClassForm] = useState<EditClassFormState>({
    name: '',
    division: '',
    code: '',
    branchId: 'mukherjee-nagar',
    academicSession: '2026-27',
    description: '',
    defaultMonthlyFee: 0,
    order: '',
  });

  // Standalone delete target (used when caller does not supply external AlertDialog)
  const [internalDeleteTarget, setInternalDeleteTarget] = useState<ClassBatchDeleteTarget | null>(null);

  const filteredClasses = useMemo(() => {
    if (!hasBranchSelection) return [];
    let list = classes;
    if (selectedBranch && selectedBranch !== 'all') {
      list = list.filter(
        c =>
          c.branchId === selectedBranch ||
          (selectedBranch === 'mangolpuri' && c.branchId === 'mangol-puri') ||
          (selectedBranch === 'mangol-puri' && c.branchId === 'mangolpuri')
      );
    }
    return [...list].sort((a, b) => {
      const ordA = a.order !== undefined && a.order !== null ? Number(a.order) : 999999;
      const ordB = b.order !== undefined && b.order !== null ? Number(b.order) : 999999;
      if (ordA !== ordB) return ordA - ordB;
      return a.name.localeCompare(b.name, undefined, { numeric: true });
    });
  }, [classes, selectedBranch, hasBranchSelection]);

  const openCreateClassModal = () => {
    setClassForm({
      ...EMPTY_CLASS_FORM,
      branchId: isBranchAdmin && branchAdminBranchId ? branchAdminBranchId : '',
    });
    setIsClassModalOpen(true);
  };

  const handleCreateClass = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!classForm.name.trim()) {
      toast({ variant: 'destructive', title: 'Error', description: 'Class Name is required.' });
      return;
    }
    if (!classForm.branchId) {
      toast({ variant: 'destructive', title: 'Error', description: 'Please select a Branch for this class.' });
      return;
    }

    const autoCode =
      classForm.code?.trim() ||
      classForm.name
        .replace(/[^a-zA-Z0-9]/g, '')
        .slice(0, 10)
        .toUpperCase() ||
      'CLASS';

    const payload = {
      ...classForm,
      code: autoCode,
      division: classForm.division?.trim() || '',
      academicSession: classForm.academicSession?.trim() || '2026-27',
      description: classForm.description || '',
      defaultMonthlyFee: 0,
      order: classForm.order !== '' && classForm.order !== undefined ? Number(classForm.order) : undefined,
    };

    try {
      const res = await createFeeClass(payload);
      if (res.success) {
        toast({ title: 'Success', description: res.message });
        setIsClassModalOpen(false);
        setClassForm({ ...EMPTY_CLASS_FORM });
        await onRefresh();
      } else {
        toast({ variant: 'destructive', title: 'Error', description: res.message });
      }
    } catch (err: any) {
      toast({ variant: 'destructive', title: 'Error', description: err?.message || 'Failed to create class' });
    }
  };

  const openEditClassModal = (cls: FeeClass) => {
    setEditingClass(cls);
    setEditClassForm({
      name: cls.name,
      division: cls.division || '',
      code: cls.code || cls.name.replace(/\s+/g, '').toUpperCase(),
      branchId: cls.branchId || 'mukherjee-nagar',
      academicSession: cls.academicSession || '2026-27',
      description: cls.description || '',
      defaultMonthlyFee: cls.defaultMonthlyFee || 0,
      order: cls.order !== undefined && cls.order !== null ? cls.order : '',
    });
    setIsEditClassOpen(true);
  };

  const handleUpdateClass = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingClass) return;
    if (!editClassForm.name.trim()) {
      toast({ variant: 'destructive', title: 'Error', description: 'Class Name is required.' });
      return;
    }

    const payload = {
      ...editClassForm,
      code: editClassForm.code || editingClass.code || editClassForm.name.replace(/\s+/g, '').toUpperCase(),
      order: editClassForm.order !== '' && editClassForm.order !== undefined ? Number(editClassForm.order) : undefined,
    };

    const res = await updateFeeClass(editingClass.id, payload);
    if (res.success) {
      toast({ title: 'Class Updated', description: res.message });
      setIsEditClassOpen(false);
      setEditingClass(null);
      await onRefresh();
    } else {
      toast({ variant: 'destructive', title: 'Error', description: res.message });
    }
  };

  const openCreateBatchModal = (initialClassId?: string) => {
    const available = filteredClasses.length > 0 ? filteredClasses : classes;
    const targetClassId =
      initialClassId || (available.length === 1 ? available[0].id : classes.length === 1 ? classes[0].id : '');
    const matchedClass = classes.find(c => c.id === targetClassId);
    const defaultBranch =
      matchedClass?.branchId ||
      (selectedBranch && selectedBranch !== 'all' ? selectedBranch : classes[0]?.branchId || 'mukherjee-nagar');
    const defaultFee = matchedClass?.defaultMonthlyFee || 0;

    setBatchForm({
      classId: targetClassId,
      branchId: defaultBranch,
      name: '',
      duration: '',
      classTime: '',
      subjects: [],
      monthlyFee: defaultFee,
      courseFee: defaultFee > 0 ? defaultFee * 12 : 0,
      startDate: '',
      endDate: '',
      order: '',
    });
    setNewBatchSubjectInput('');
    setIsBatchSubjectInputOpen(false);
    setEditingBatchSubIdx(null);
    setIsCustomBatchFee(false);
    setIsBatchModalOpen(true);
  };

  const handleAddBatchSubject = (subjectToAdd?: string) => {
    const raw = subjectToAdd !== undefined ? subjectToAdd : newBatchSubjectInput;
    const trimmed = raw.trim();
    if (!trimmed) return;
    const updatedSubjects = parseSubjectEntries(raw, batchForm.subjects);
    if (updatedSubjects.length === batchForm.subjects.length) {
      toast({ title: 'Notice', description: `"${trimmed}" is already added to this batch.` });
      return;
    }
    setBatchForm(prev => ({
      ...prev,
      subjects: updatedSubjects,
    }));
    setNewBatchSubjectInput('');
  };

  const handleDeleteBatchSubject = (idx: number) => {
    const updatedSubjects = batchForm.subjects.filter((_, i) => i !== idx);
    setBatchForm(prev => ({
      ...prev,
      subjects: updatedSubjects,
    }));
    if (editingBatchSubIdx === idx) {
      setEditingBatchSubIdx(null);
    }
  };

  const handleCreateBatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!batchForm.name.trim()) {
      toast({ variant: 'destructive', title: 'Error', description: 'Please enter Batch Name.' });
      return;
    }
    if (!batchForm.classId) {
      toast({ variant: 'destructive', title: 'Error', description: 'Please select a Class.' });
      return;
    }

    setIsSubmittingBatch(true);
    try {
      const durationStr =
        batchForm.startDate && batchForm.endDate
          ? `${formatBatchDateString(batchForm.startDate)} – ${formatBatchDateString(batchForm.endDate)}`
          : batchForm.startDate
            ? `From ${formatBatchDateString(batchForm.startDate)}`
            : batchForm.duration || '';

      const matchedClass = classes.find(c => c.id === batchForm.classId);
      const rawMonthly = Number(batchForm.monthlyFee) || 0;
      const rawYearly = Number(batchForm.courseFee) || 0;
      const resolvedMonthlyFee =
        rawMonthly > 0
          ? rawMonthly
          : rawYearly > 0
            ? Math.round(rawYearly / 12)
            : matchedClass?.defaultMonthlyFee || 0;
      const resolvedCourseFee =
        rawYearly > 0 ? rawYearly : resolvedMonthlyFee > 0 ? resolvedMonthlyFee * 12 : undefined;

      const finalSubjects = parseSubjectEntries(newBatchSubjectInput, batchForm.subjects);

      const payload = {
        classId: batchForm.classId,
        branchId:
          matchedClass?.branchId ||
          batchForm.branchId ||
          (selectedBranch && selectedBranch !== 'all' ? selectedBranch : 'mukherjee-nagar'),
        name: batchForm.name.trim(),
        subjects: finalSubjects,
        monthlyFee: resolvedMonthlyFee,
        courseFee: resolvedCourseFee,
        duration: durationStr,
        startDate: batchForm.startDate || undefined,
        endDate: batchForm.endDate || undefined,
        classTime: batchForm.classTime?.trim() || undefined,
        order: batchForm.order !== '' && batchForm.order !== undefined ? Number(batchForm.order) : undefined,
        createdAt: new Date().toISOString(),
      };

      const res = await createFeeBatch(payload);
      if (res.success) {
        toast({ title: 'Success', description: res.message });
        setIsBatchModalOpen(false);
        setBatchForm({
          ...EMPTY_BATCH_FORM,
          branchId: selectedBranch && selectedBranch !== 'all' ? selectedBranch : '',
        });
        setNewBatchSubjectInput('');
        setIsBatchSubjectInputOpen(false);
        setEditingBatchSubIdx(null);
        setIsCustomBatchFee(false);
        await onRefresh();
      } else {
        toast({ variant: 'destructive', title: 'Error', description: res.message });
      }
    } catch (err: any) {
      toast({ variant: 'destructive', title: 'Error', description: err.message || 'Failed to create batch' });
    } finally {
      setIsSubmittingBatch(false);
    }
  };

  const openEditBatchModal = (batch: FeeBatch) => {
    setEditingBatch(batch);
    const parsed = parseDateRangeFromDuration(batch.duration);
    const sDate = batch.startDate || parsed.startDate;
    const eDate = batch.endDate || parsed.endDate;
    const mFee = batch.monthlyFee || 0;
    const cFee = batch.courseFee || (mFee > 0 ? mFee * 12 : 0);

    setEditBatchForm({
      classId: batch.classId,
      branchId: batch.branchId || 'mukherjee-nagar',
      name: batch.name,
      duration: batch.duration || '',
      classTime: batch.classTime || '',
      subjects: batch.subjects ? [...batch.subjects] : [],
      monthlyFee: mFee,
      courseFee: cFee,
      startDate: sDate,
      endDate: eDate,
      order: batch.order !== undefined && batch.order !== null ? batch.order : '',
    });
    setNewEditBatchSubjectInput('');
    setEditingEditBatchSubIdx(null);
    setEditingEditBatchSubName('');
    setIsEditBatchOpen(true);
  };

  const handleAddEditBatchSubject = (subjectName?: string) => {
    const nameToAdd = (subjectName || newEditBatchSubjectInput).trim();
    if (!nameToAdd) return;
    if (editBatchForm.subjects.some(s => s.toLowerCase() === nameToAdd.toLowerCase())) {
      toast({ variant: 'destructive', title: 'Subject exists', description: `"${nameToAdd}" is already in this batch.` });
      return;
    }
    setEditBatchForm(prev => ({
      ...prev,
      subjects: [...prev.subjects, nameToAdd],
    }));
    if (!subjectName) setNewEditBatchSubjectInput('');
  };

  const handleDeleteEditBatchSubject = (idx: number) => {
    setEditBatchForm(prev => ({
      ...prev,
      subjects: prev.subjects.filter((_, i) => i !== idx),
    }));
    if (editingEditBatchSubIdx === idx) {
      setEditingEditBatchSubIdx(null);
    }
  };

  const handleUpdateBatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBatch) return;
    if (!editBatchForm.name.trim() || !editBatchForm.classId) {
      toast({ variant: 'destructive', title: 'Error', description: 'Please select a Class and enter Batch Name.' });
      return;
    }

    const durationStr =
      editBatchForm.startDate && editBatchForm.endDate
        ? `${formatBatchDateString(editBatchForm.startDate)} – ${formatBatchDateString(editBatchForm.endDate)}`
        : editBatchForm.startDate
          ? `From ${formatBatchDateString(editBatchForm.startDate)}`
          : editBatchForm.endDate
            ? `Till ${formatBatchDateString(editBatchForm.endDate)}`
            : editBatchForm.duration || '';

    const rawMonthly = Number(editBatchForm.monthlyFee) || 0;
    const rawYearly = Number(editBatchForm.courseFee) || 0;
    const resolvedMonthlyFee = rawMonthly > 0 ? rawMonthly : rawYearly > 0 ? Math.round(rawYearly / 12) : 0;
    const resolvedCourseFee =
      rawYearly > 0 ? rawYearly : resolvedMonthlyFee > 0 ? resolvedMonthlyFee * 12 : undefined;

    const pendingSub = newEditBatchSubjectInput.trim();
    const finalSubjects =
      pendingSub && !editBatchForm.subjects.some(s => s.toLowerCase() === pendingSub.toLowerCase())
        ? [...editBatchForm.subjects, pendingSub]
        : editBatchForm.subjects;

    const payload = {
      ...editBatchForm,
      subjects: finalSubjects,
      monthlyFee: resolvedMonthlyFee,
      courseFee: resolvedCourseFee,
      duration: durationStr,
      order:
        editBatchForm.order !== '' && editBatchForm.order !== undefined ? Number(editBatchForm.order) : undefined,
    };

    const updatedId = editingBatch.id;
    const res = await updateFeeBatch(updatedId, payload);
    if (res.success) {
      toast({ title: 'Batch Updated', description: res.message });
      setIsEditBatchOpen(false);
      setEditingBatch(null);
      await onRefresh();
      if (onBatchUpdated) {
        await onBatchUpdated(updatedId);
      }
    } else {
      toast({ variant: 'destructive', title: 'Error', description: res.message });
    }
  };

  const requestDelete = (target: ClassBatchDeleteTarget) => {
    if (onRequestDelete) {
      onRequestDelete(target);
    } else {
      setInternalDeleteTarget(target);
    }
  };

  const handleExecuteDelete = async () => {
    if (!internalDeleteTarget) return;
    const { type, id } = internalDeleteTarget;
    setInternalDeleteTarget(null);

    const res = type === 'class' ? await deleteFeeClass(id) : await deleteFeeBatch(id);
    if (res.success) {
      toast({ title: 'Deleted', description: res.message });
      await onRefresh();
    } else {
      toast({ variant: 'destructive', title: 'Deletion Blocked', description: res.message });
    }
  };

  const hasOpenModal =
    isClassModalOpen || isBatchModalOpen || isEditBatchOpen || isEditClassOpen || !!internalDeleteTarget;

  return {
    filteredClasses,
    selectedBatchPerClass,
    setSelectedBatchPerClass,
    hasOpenModal,
    // Create Class
    isClassModalOpen,
    setIsClassModalOpen,
    classForm,
    setClassForm,
    openCreateClassModal,
    handleCreateClass,
    // Edit Class
    isEditClassOpen,
    setIsEditClassOpen,
    editClassForm,
    setEditClassForm,
    openEditClassModal,
    handleUpdateClass,
    // Create Batch
    isBatchModalOpen,
    setIsBatchModalOpen,
    isSubmittingBatch,
    batchForm,
    setBatchForm,
    newBatchSubjectInput,
    setNewBatchSubjectInput,
    isBatchSubjectInputOpen,
    setIsBatchSubjectInputOpen,
    batchSubjectInputRef,
    editingBatchSubIdx,
    setEditingBatchSubIdx,
    editingBatchSubName,
    setEditingBatchSubName,
    isCustomBatchFee,
    setIsCustomBatchFee,
    openCreateBatchModal,
    handleAddBatchSubject,
    handleDeleteBatchSubject,
    handleCreateBatch,
    // Edit Batch
    isEditBatchOpen,
    setIsEditBatchOpen,
    editBatchForm,
    setEditBatchForm,
    newEditBatchSubjectInput,
    setNewEditBatchSubjectInput,
    editingEditBatchSubIdx,
    setEditingEditBatchSubIdx,
    editingEditBatchSubName,
    setEditingEditBatchSubName,
    openEditBatchModal,
    handleAddEditBatchSubject,
    handleDeleteEditBatchSubject,
    handleUpdateBatch,
    // Standalone delete dialog
    internalDeleteTarget,
    setInternalDeleteTarget,
    requestDelete,
    handleExecuteDelete,
  };
}

export type ClassBatchController = ReturnType<typeof useClassBatchController>;

interface ClassBatchCardsGridProps {
  filteredClasses: FeeClass[];
  batches: FeeBatch[];
  students: FeeStudent[];
  hasBranchSelection: boolean;
  selectedBatchPerClass: Record<string, string>;
  onSelectBatch: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  onEditClass: (cls: FeeClass) => void;
  onDeleteClass: (cls: FeeClass) => void;
  onCreateBatch: (classId: string) => void;
  onEditBatch: (batch: FeeBatch) => void;
  onDeleteBatch: (batch: FeeBatch) => void;
}

/**
 * Shared 2-column Class & Batch management grid matching the Fee Management Class/Batch UI and live metrics.
 */
export function ClassBatchCardsGrid({
  filteredClasses,
  batches,
  students,
  hasBranchSelection,
  selectedBatchPerClass,
  onSelectBatch,
  onEditClass,
  onDeleteClass,
  onCreateBatch,
  onEditBatch,
  onDeleteBatch,
}: ClassBatchCardsGridProps) {
  if (!hasBranchSelection) {
    return (
      <div className="w-full h-40 sm:h-48 flex flex-col items-center justify-center rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 text-center px-4">
        <Building2 className="w-8 h-8 text-slate-300 dark:text-slate-700 mb-2" />
        <p className="font-semibold text-xs text-slate-600 dark:text-slate-300">No branch selected</p>
        <p className="text-[11px] text-slate-400 mt-0.5">
          Please select a branch from the top dropdown to view classes and batches.
        </p>
      </div>
    );
  }

  if (filteredClasses.length === 0) {
    return (
      <div className="w-full h-40 sm:h-48 flex flex-col items-center justify-center rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 text-center px-4">
        <School className="w-8 h-8 text-slate-300 dark:text-slate-700 mb-2" />
        <p className="font-semibold text-xs text-slate-600 dark:text-slate-300">No classes added yet</p>
        <p className="text-[11px] text-slate-400 mt-0.5">
          Click + Class above to create classes and batches for this branch.
        </p>
      </div>
    );
  }

  return (
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
        const branch = IDL_BRANCHES.find(
          b =>
            b.id === cls.branchId ||
            (cls.branchId === 'mangolpuri' && b.id === 'mangol-puri') ||
            (cls.branchId === 'mangol-puri' && b.id === 'mangolpuri')
        );
        const activeBatchId = selectedBatchPerClass[cls.id] || clsBatches[0]?.id;
        const activeBatch = clsBatches.find(b => b.id === activeBatchId) || clsBatches[0];
        const enrolledCount =
          typeof cls.studentCount === 'number'
            ? cls.studentCount
            : students.filter(s => s.classId === cls.id).length;

        return (
          <Card
            key={cls.id}
            className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-[0_1px_3px_rgba(15,23,42,0.03)] hover:shadow-md hover:border-slate-300/80 transition-all overflow-hidden flex flex-col justify-between"
          >
            <div>
              {/* 1. Header: Branch Name primary, Edit & Delete top-right, Compact metadata row, Subtle stats */}
              <div className="p-3.5 sm:p-4 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-800/40 space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <h3 className="text-base sm:text-[17px] font-bold text-slate-900 dark:text-white tracking-tight truncate">
                      {branch?.name.replace(' Branch', '') || cls.branchId}
                    </h3>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => onEditClass(cls)}
                      className="h-7 w-7 rounded-lg text-slate-400 hover:text-[#2864E8] hover:bg-blue-50/80 dark:hover:bg-slate-800 flex items-center justify-center transition-colors cursor-pointer"
                      title="Edit Class Details"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteClass(cls)}
                      className="h-7 w-7 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50/80 dark:hover:bg-slate-800 flex items-center justify-center transition-colors cursor-pointer"
                      title="Delete Class"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Metadata Row: Class Name • Course/Stream • Academic Year */}
                <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium flex-wrap">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{cls.name}</span>
                  {cls.division && !cls.name.toLowerCase().includes(cls.division.toLowerCase()) && (
                    <>
                      <span className="text-slate-300 dark:text-slate-600">•</span>
                      <span className="uppercase text-slate-600 dark:text-slate-300 font-semibold">{cls.division}</span>
                    </>
                  )}
                  <span className="text-slate-300 dark:text-slate-600">•</span>
                  <span className="tabular-nums">{cls.academicSession || '2026-27'}</span>
                </div>

                {/* 2. Compact Statistics */}
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
                    <span className="font-semibold text-slate-900 dark:text-white tabular-nums">{enrolledCount}</span>
                  </div>
                </div>
              </div>

              {/* 3. Batches Content Area */}
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
                              onClick={() => onSelectBatch(prev => ({ ...prev, [cls.id]: b.id }))}
                              className={`text-[12px] transition-colors cursor-pointer shrink-0 whitespace-nowrap bg-transparent p-0 ${
                                isActive
                                  ? 'font-bold text-[#2864E8] dark:text-[#4B82F6]'
                                  : 'font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                              }`}
                            >
                              {b.name}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Add Batch Button */}
                  <button
                    type="button"
                    onClick={() => onCreateBatch(cls.id)}
                    className="h-7 w-7 rounded-lg text-[#2864E8] hover:text-[#1E4ED8] hover:bg-blue-50 dark:hover:bg-blue-950/40 flex items-center justify-center transition-colors cursor-pointer shrink-0"
                    title="Add Batch"
                    aria-label="Add Batch"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {clsBatches.length === 0 ? (
                  <div
                    onClick={() => onCreateBatch(cls.id)}
                    className="py-5 px-3 rounded-xl text-center cursor-pointer transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-800/40 border border-slate-100 dark:border-slate-800/80"
                  >
                    <Layers className="w-7 h-7 mx-auto text-slate-300 dark:text-slate-700 mb-1.5" />
                    <p className="font-semibold text-xs text-slate-600 dark:text-slate-300">No batches added yet</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Click + above to create a batch for this class.
                    </p>
                  </div>
                ) : activeBatch ? (
                  <div className="border-t border-slate-100 dark:border-slate-800/80 pt-2.5 space-y-2">
                    {/* 4. Selected Batch Top Row: Batch Name & Students Count on left, Fee & Actions on right */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="text-[13.5px] font-bold text-slate-900 dark:text-white tracking-tight truncate">
                          {activeBatch.name}
                        </span>
                        <span className="text-slate-300 dark:text-slate-600">•</span>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 font-normal tabular-nums whitespace-nowrap">
                          {students.filter(s => s.batchId === activeBatch.id).length} students
                        </span>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="font-bold text-emerald-600 dark:text-emerald-400 text-[13px] tabular-nums tracking-tight">
                          ₹{Number(activeBatch.monthlyFee || 0).toLocaleString('en-IN')}
                          <span className="text-[10.5px] text-slate-400 font-normal ml-0.5">/mo</span>
                        </span>
                        <div className="flex items-center gap-0.5 border-l border-slate-200/80 dark:border-slate-700/60 pl-1.5">
                          <button
                            type="button"
                            onClick={() => onEditBatch(activeBatch)}
                            className="h-6.5 w-6.5 rounded-md text-slate-400 hover:text-[#2864E8] hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center transition-colors cursor-pointer"
                            title="Edit Batch"
                          >
                            <Edit className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => onDeleteBatch(activeBatch)}
                            className="h-6.5 w-6.5 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-slate-800 flex items-center justify-center transition-colors cursor-pointer"
                            title="Delete Batch"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Second Section: Timing, Dates, Subjects */}
                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800/60 space-y-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                      {(activeBatch.classTime || activeBatch.duration) && (
                        <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 font-medium">
                          <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{activeBatch.classTime || ''}</span>
                          {activeBatch.duration && (
                            <span className="text-slate-400 font-normal">• {activeBatch.duration}</span>
                          )}
                        </div>
                      )}

                      {activeBatch.subjects && activeBatch.subjects.length > 0 && (
                        <div className="flex items-center gap-1.5 text-[11px] pt-0.5">
                          <span className="text-slate-400 font-normal shrink-0">Subjects:</span>
                          <span
                            className="text-slate-700 dark:text-slate-300 font-medium truncate"
                            title={activeBatch.subjects.join(', ')}
                          >
                            {activeBatch.subjects.join(', ')}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}

interface ClassBatchModalsProps {
  controller: ClassBatchController;
  classes: FeeClass[];
  isPending?: boolean;
  renderDeleteDialog?: boolean;
  isBranchAdmin?: boolean;
  branchAdminBranchId?: string;
}

/**
 * Shared dialogs for creating and editing Academic Classes & Batches (and optional Class/Batch delete confirmation).
 */
export function ClassBatchModals({
  controller,
  classes,
  isPending = false,
  renderDeleteDialog = false,
  isBranchAdmin = false,
  branchAdminBranchId,
}: ClassBatchModalsProps) {
  const {
    filteredClasses,
    isClassModalOpen,
    setIsClassModalOpen,
    classForm,
    setClassForm,
    handleCreateClass,
    isBatchModalOpen,
    setIsBatchModalOpen,
    isSubmittingBatch,
    batchForm,
    setBatchForm,
    newBatchSubjectInput,
    setNewBatchSubjectInput,
    isBatchSubjectInputOpen,
    setIsBatchSubjectInputOpen,
    batchSubjectInputRef,
    handleAddBatchSubject,
    handleDeleteBatchSubject,
    handleCreateBatch,
    isEditBatchOpen,
    setIsEditBatchOpen,
    editBatchForm,
    setEditBatchForm,
    newEditBatchSubjectInput,
    setNewEditBatchSubjectInput,
    handleAddEditBatchSubject,
    handleDeleteEditBatchSubject,
    handleUpdateBatch,
    isEditClassOpen,
    setIsEditClassOpen,
    editClassForm,
    setEditClassForm,
    handleUpdateClass,
    internalDeleteTarget,
    setInternalDeleteTarget,
    handleExecuteDelete,
  } = controller;

  const selectableBranches = IDL_BRANCHES.filter(b =>
    isBranchAdmin && branchAdminBranchId ? b.id === branchAdminBranchId : b.id !== 'all'
  );

  return (
    <>
      {/* MODAL 1: CREATE CLASS */}
      <Dialog open={isClassModalOpen} onOpenChange={setIsClassModalOpen}>
        <DialogContent className={FORM_CARD_DIALOG_CLS}>
          <DialogHeader className={FORM_CARD_HEADER_CLS}>
            <div>
              <DialogTitle className={FORM_CARD_TITLE_CLS}>Create Academic Class</DialogTitle>
              <DialogDescription className={FORM_CARD_DESC_CLS}>
                Define a new academic class and assign it to a branch.
              </DialogDescription>
            </div>
          </DialogHeader>

          <form onSubmit={handleCreateClass} className="space-y-3 pt-1" autoComplete="off">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
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

              <div className="space-y-1.5">
                <Label className={FORM_CARD_LABEL_CLS}>
                  Class Division <span className="text-slate-400 dark:text-slate-500 font-normal">*</span>
                </Label>
                <Input
                  placeholder="e.g. Alpha, Sec A"
                  value={classForm.division}
                  onChange={e => setClassForm({ ...classForm, division: e.target.value })}
                  className={FORM_CARD_FIELD_CLS}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
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
                    {selectableBranches.map(b => (
                      <SelectItem key={b.id} value={b.id} className={FORM_CARD_SELECT_ITEM_CLS}>
                        {b.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className={FORM_CARD_LABEL_CLS}>Academic Session</Label>
                <Input
                  placeholder="e.g. 2026-27"
                  value={classForm.academicSession}
                  onChange={e => setClassForm({ ...classForm, academicSession: e.target.value })}
                  className={FORM_CARD_FIELD_CLS}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className={FORM_CARD_LABEL_CLS}>
                Card Order Number <span className="text-slate-400 dark:text-slate-500 font-normal">(Optional)</span>
              </Label>
              <Input
                type="number"
                min="1"
                placeholder="e.g. 1, 2"
                value={classForm.order !== undefined ? classForm.order : ''}
                onChange={e =>
                  setClassForm({ ...classForm, order: e.target.value === '' ? '' : Number(e.target.value) })
                }
                className={FORM_CARD_FIELD_CLS}
              />
            </div>

            <DialogFooter className="pt-2">
              <Button type="submit" disabled={isPending} className={FORM_CARD_SUBMIT_BTN_CLS}>
                <span>CREATE CLASS</span>
                <ArrowRight className="w-3.5 h-3.5 text-white/90 group-hover:translate-x-0.5 transition-transform duration-150 shrink-0" />
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* MODAL 2: CREATE BATCH */}
      <Dialog open={isBatchModalOpen} onOpenChange={setIsBatchModalOpen}>
        <DialogContent className={`${FORM_CARD_DIALOG_CLS} max-h-[90dvh] overflow-y-auto`}>
          <DialogHeader className={FORM_CARD_HEADER_CLS}>
            <div>
              <DialogTitle className={FORM_CARD_TITLE_CLS}>Create Academic Batch</DialogTitle>
              <DialogDescription className={FORM_CARD_DESC_CLS}>
                Define a new academic batch, schedule, and fee structure.
              </DialogDescription>
            </div>
          </DialogHeader>

          <form onSubmit={handleCreateBatch} className="space-y-3 pt-1" autoComplete="off">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
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
                      monthlyFee: prev.monthlyFee || matchedClass?.defaultMonthlyFee || 0,
                      courseFee: prev.courseFee || (prev.monthlyFee || matchedClass?.defaultMonthlyFee || 0) * 12,
                    }));
                  }}
                >
                  <SelectTrigger className={FORM_CARD_SELECT_TRIGGER_CLS}>
                    <SelectValue placeholder="Select class" />
                  </SelectTrigger>
                  <SelectContent className={FORM_CARD_SELECT_CONTENT_CLS}>
                    {(classes.length > 0 ? classes : filteredClasses).map(c => (
                      <SelectItem key={c.id} value={c.id} className={FORM_CARD_SELECT_ITEM_CLS}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
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
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className={FORM_CARD_LABEL_CLS}>Batch Start Date</Label>
                <Input
                  type={batchForm.startDate ? 'date' : 'text'}
                  placeholder="DD/MM/YYYY"
                  value={batchForm.startDate || ''}
                  onFocus={e => (e.target.type = 'date')}
                  onBlur={e => {
                    if (!e.target.value) e.target.type = 'text';
                  }}
                  onChange={e => {
                    const newStart = e.target.value;
                    const durationStr =
                      newStart && batchForm.endDate
                        ? `${formatBatchDateString(newStart)} – ${formatBatchDateString(batchForm.endDate)}`
                        : newStart
                          ? `From ${formatBatchDateString(newStart)}`
                          : '';
                    setBatchForm({
                      ...batchForm,
                      startDate: newStart,
                      duration: durationStr,
                    });
                  }}
                  className={`${FORM_CARD_FIELD_CLS} cursor-pointer`}
                />
              </div>

              <div className="space-y-1.5">
                <Label className={FORM_CARD_LABEL_CLS}>Batch End Date</Label>
                <Input
                  type={batchForm.endDate ? 'date' : 'text'}
                  placeholder="DD/MM/YYYY"
                  value={batchForm.endDate || ''}
                  onFocus={e => (e.target.type = 'date')}
                  onBlur={e => {
                    if (!e.target.value) e.target.type = 'text';
                  }}
                  onChange={e => {
                    const newEnd = e.target.value;
                    const durationStr =
                      batchForm.startDate && newEnd
                        ? `${formatBatchDateString(batchForm.startDate)} – ${formatBatchDateString(newEnd)}`
                        : newEnd
                          ? `Till ${formatBatchDateString(newEnd)}`
                          : '';
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className={FORM_CARD_LABEL_CLS}>Class Timings</Label>
                <Input
                  placeholder="e.g. 4:00 - 6:00 PM"
                  value={batchForm.classTime}
                  onChange={e => setBatchForm({ ...batchForm, classTime: e.target.value })}
                  className={FORM_CARD_FIELD_CLS}
                />
              </div>

              <div className="space-y-1.5">
                <Label className={FORM_CARD_LABEL_CLS}>
                  Batch Order <span className="text-slate-400 dark:text-slate-500 font-normal">(Optional)</span>
                </Label>
                <Input
                  type="number"
                  min="1"
                  placeholder="e.g. 1, 2"
                  value={batchForm.order !== undefined ? batchForm.order : ''}
                  onChange={e =>
                    setBatchForm({ ...batchForm, order: e.target.value === '' ? '' : Number(e.target.value) })
                  }
                  className={FORM_CARD_FIELD_CLS}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className={FORM_CARD_LABEL_CLS}>Batch Monthly Fee (₹)</Label>
                <Input
                  type="number"
                  min="0"
                  placeholder="e.g. 1500"
                  value={batchForm.monthlyFee !== undefined && batchForm.monthlyFee > 0 ? batchForm.monthlyFee : ''}
                  onChange={e => {
                    const m = e.target.value === '' ? 0 : Number(e.target.value);
                    setBatchForm(prev => ({
                      ...prev,
                      monthlyFee: m,
                      courseFee: m > 0 ? m * 12 : 0,
                    }));
                  }}
                  className={FORM_CARD_FIELD_CLS}
                />
              </div>

              <div className="space-y-1.5">
                <Label className={FORM_CARD_LABEL_CLS}>Batch Yearly Fee (₹)</Label>
                <Input
                  type="number"
                  min="0"
                  placeholder="e.g. 18000"
                  value={batchForm.courseFee !== undefined && batchForm.courseFee > 0 ? batchForm.courseFee : ''}
                  onChange={e => {
                    const y = e.target.value === '' ? 0 : Number(e.target.value);
                    setBatchForm(prev => ({
                      ...prev,
                      courseFee: y,
                      monthlyFee: y > 0 ? Math.round(y / 12) : 0,
                    }));
                  }}
                  className={FORM_CARD_FIELD_CLS}
                />
              </div>
            </div>

            <div className="space-y-1.5">
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
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
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

            <DialogFooter className="pt-2">
              <Button type="submit" disabled={isSubmittingBatch || isPending} className={FORM_CARD_SUBMIT_BTN_CLS}>
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

      {/* MODAL 2B: EDIT BATCH DETAILS */}
      <Dialog open={isEditBatchOpen} onOpenChange={setIsEditBatchOpen}>
        <FormModalDialogContent
          maxWidthClass="max-w-[480px] sm:max-w-[530px]"
          hideCloseButton={true}
          className="w-[94vw] sm:w-[92vw] p-0 shadow-[0_20px_50px_-12px_rgba(15,23,42,0.18),0_2px_8px_rgba(15,23,42,0.06)] !rounded-[6px] sm:!rounded-[8px] border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-950 flex flex-col overflow-hidden max-h-[90vh]"
        >
          <div className="h-[34px] sm:h-[36px] flex items-center justify-between px-4 sm:px-5 border-b border-slate-100 dark:border-slate-800/80 bg-white dark:bg-slate-950 shrink-0">
            <span className="text-[12px] sm:text-[12.5px] font-bold tracking-[0.05em] uppercase text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
              <Edit className="w-3.5 h-3.5 text-[#2864E8]" />
              EDIT BATCH DETAILS
            </span>
            <button
              type="button"
              onClick={() => setIsEditBatchOpen(false)}
              className="w-6 h-6 -mr-1 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-3.5 h-3.5 stroke-[2.2]" />
            </button>
          </div>

          <DialogHeader className="sr-only">
            <DialogTitle>Edit Batch Details</DialogTitle>
            <DialogDescription>Update batch details and schedule</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleUpdateBatch} className="p-4 sm:p-5 space-y-3 sm:space-y-3.5 overflow-y-auto text-left" autoComplete="off">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5">
              <div className="space-y-1">
                <Select
                  value={editBatchForm.classId || undefined}
                  onValueChange={val => {
                    const targetCls = classes.find(c => c.id === val);
                    setEditBatchForm(prev => ({
                      ...prev,
                      classId: val,
                      branchId: targetCls?.branchId || prev.branchId,
                    }));
                  }}
                >
                  <SelectTrigger className="h-[32px] sm:h-[35px] w-full border-0 border-b border-slate-200/90 dark:border-slate-700/80 !bg-transparent rounded-none px-0 text-[13px] sm:text-[13.5px] md:text-[14px] font-medium text-slate-900 dark:text-slate-100 [&>span]:text-[13px] sm:[&>span]:text-[13.5px] md:[&>span]:text-[14px] [&>span]:font-medium [&>span]:text-slate-900 dark:[&>span]:text-slate-100 data-[placeholder]:!text-slate-400 [&[data-placeholder]>span]:!text-slate-400 [&[data-placeholder]>span]:!text-[9.5px] sm:[&[data-placeholder]>span]:!text-[10px] [&[data-placeholder]>span]:!font-normal focus:outline-none focus:ring-0 focus:border-slate-300 dark:focus:border-slate-600 focus:shadow-none focus-visible:outline-none focus-visible:ring-0 focus-visible:shadow-none shadow-none flex items-center justify-between">
                    <SelectValue placeholder="Class *" />
                  </SelectTrigger>
                  <SelectContent>
                    {(classes.length > 0 ? classes : filteredClasses).map(c => (
                      <SelectItem key={c.id} value={c.id} className="text-[13px] sm:text-[13.5px] md:text-[14px] font-medium py-1.5 sm:py-2">
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Input
                  placeholder="Batch Name *"
                  value={editBatchForm.name}
                  onChange={e => setEditBatchForm({ ...editBatchForm, name: e.target.value })}
                  required
                  className="h-[32px] sm:h-[35px] w-full border-0 border-b border-slate-200/90 dark:border-slate-700/80 !bg-transparent rounded-none px-0 text-[13px] sm:text-[13.5px] md:text-[14px] font-medium text-slate-900 dark:text-slate-100 placeholder:text-[9.5px] sm:placeholder:text-[10px] placeholder:text-slate-400 focus:outline-none focus:ring-0 focus:border-slate-300 dark:focus:border-slate-600 focus:shadow-none focus-visible:outline-none focus-visible:ring-0 focus-visible:shadow-none shadow-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5">
              <div className="space-y-1">
                <Input
                  type={editBatchForm.startDate ? 'date' : 'text'}
                  placeholder="Batch Start Date (DD/MM/YYYY)"
                  value={editBatchForm.startDate || ''}
                  onFocus={e => (e.target.type = 'date')}
                  onBlur={e => {
                    if (!e.target.value) e.target.type = 'text';
                  }}
                  onChange={e => {
                    const newStart = e.target.value;
                    const durationStr =
                      newStart && editBatchForm.endDate
                        ? `${formatBatchDateString(newStart)} – ${formatBatchDateString(editBatchForm.endDate)}`
                        : newStart
                          ? `From ${formatBatchDateString(newStart)}`
                          : '';
                    setEditBatchForm({
                      ...editBatchForm,
                      startDate: newStart,
                      duration: durationStr,
                    });
                  }}
                  className="h-[34px] sm:h-[36px] w-full border-0 border-b border-slate-200/90 dark:border-slate-700/80 !bg-transparent rounded-none px-0 text-[13px] sm:text-[13.5px] md:text-[14px] font-medium text-slate-900 dark:text-slate-100 placeholder:text-[9.5px] sm:placeholder:text-[10px] placeholder:text-slate-400 focus:outline-none focus:ring-0 focus:border-slate-300 dark:focus:border-slate-600 focus:shadow-none focus-visible:outline-none focus-visible:ring-0 focus-visible:shadow-none shadow-none cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <Input
                  type={editBatchForm.endDate ? 'date' : 'text'}
                  placeholder="Batch End Date (DD/MM/YYYY)"
                  value={editBatchForm.endDate || ''}
                  onFocus={e => (e.target.type = 'date')}
                  onBlur={e => {
                    if (!e.target.value) e.target.type = 'text';
                  }}
                  onChange={e => {
                    const newEnd = e.target.value;
                    const durationStr =
                      editBatchForm.startDate && newEnd
                        ? `${formatBatchDateString(editBatchForm.startDate)} – ${formatBatchDateString(newEnd)}`
                        : newEnd
                          ? `Till ${formatBatchDateString(newEnd)}`
                          : '';
                    setEditBatchForm({
                      ...editBatchForm,
                      endDate: newEnd,
                      duration: durationStr,
                    });
                  }}
                  className="h-[34px] sm:h-[36px] w-full border-0 border-b border-slate-200/90 dark:border-slate-700/80 !bg-transparent rounded-none px-0 text-[13px] sm:text-[13.5px] md:text-[14px] font-medium text-slate-900 dark:text-slate-100 placeholder:text-[9.5px] sm:placeholder:text-[10px] placeholder:text-slate-400 focus:outline-none focus:ring-0 focus:border-slate-300 dark:focus:border-slate-600 focus:shadow-none focus-visible:outline-none focus-visible:ring-0 focus-visible:shadow-none shadow-none cursor-pointer"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5">
              <div className="space-y-1">
                <Input
                  placeholder="Class Timings (e.g. 04:00 PM - 06:00 PM)"
                  value={editBatchForm.classTime}
                  onChange={e => setEditBatchForm({ ...editBatchForm, classTime: e.target.value })}
                  className="h-[34px] sm:h-[36px] w-full border-0 border-b border-slate-200/90 dark:border-slate-700/80 !bg-transparent rounded-none px-0 text-[13px] sm:text-[13.5px] md:text-[14px] font-medium text-slate-900 dark:text-slate-100 placeholder:text-[9.5px] sm:placeholder:text-[10px] placeholder:text-slate-400 focus:outline-none focus:ring-0 focus:border-slate-300 dark:focus:border-slate-600 focus:shadow-none focus-visible:outline-none focus-visible:ring-0 focus-visible:shadow-none shadow-none"
                />
              </div>

              <div className="space-y-1">
                <Input
                  type="number"
                  min="1"
                  placeholder="Batch Order Number (e.g. 1, 2)"
                  value={editBatchForm.order !== undefined ? editBatchForm.order : ''}
                  onChange={e =>
                    setEditBatchForm({ ...editBatchForm, order: e.target.value === '' ? '' : Number(e.target.value) })
                  }
                  className="h-[34px] sm:h-[36px] w-full border-0 border-b border-slate-200/90 dark:border-slate-700/80 !bg-transparent rounded-none px-0 text-[13px] sm:text-[13.5px] md:text-[14px] font-medium text-slate-900 dark:text-slate-100 placeholder:text-[9.5px] sm:placeholder:text-[10px] placeholder:text-slate-400 focus:outline-none focus:ring-0 focus:border-slate-300 dark:focus:border-slate-600 focus:shadow-none focus-visible:outline-none focus-visible:ring-0 focus-visible:shadow-none shadow-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5">
              <div className="space-y-1">
                <Input
                  type="number"
                  min="0"
                  placeholder="Batch Monthly Fee (₹)"
                  value={editBatchForm.monthlyFee !== undefined && editBatchForm.monthlyFee > 0 ? editBatchForm.monthlyFee : ''}
                  onChange={e => {
                    const m = e.target.value === '' ? 0 : Number(e.target.value);
                    setEditBatchForm(prev => ({
                      ...prev,
                      monthlyFee: m,
                      courseFee: m > 0 ? m * 12 : 0,
                    }));
                  }}
                  className="h-[34px] sm:h-[36px] w-full border-0 border-b border-slate-200/90 dark:border-slate-700/80 !bg-transparent rounded-none px-0 text-[13px] sm:text-[13.5px] md:text-[14px] font-medium text-slate-900 dark:text-slate-100 placeholder:text-[9.5px] sm:placeholder:text-[10px] placeholder:text-slate-400 focus:outline-none focus:ring-0 focus:border-slate-300 dark:focus:border-slate-600 focus:shadow-none focus-visible:outline-none focus-visible:ring-0 focus-visible:shadow-none shadow-none"
                />
              </div>

              <div className="space-y-1">
                <Input
                  type="number"
                  min="0"
                  placeholder="Batch Yearly Fee (₹)"
                  value={editBatchForm.courseFee !== undefined && editBatchForm.courseFee > 0 ? editBatchForm.courseFee : ''}
                  onChange={e => {
                    const y = e.target.value === '' ? 0 : Number(e.target.value);
                    setEditBatchForm(prev => ({
                      ...prev,
                      courseFee: y,
                      monthlyFee: y > 0 ? Math.round(y / 12) : 0,
                    }));
                  }}
                  className="h-[34px] sm:h-[36px] w-full border-0 border-b border-slate-200/90 dark:border-slate-700/80 !bg-transparent rounded-none px-0 text-[13px] sm:text-[13.5px] md:text-[14px] font-medium text-slate-900 dark:text-slate-100 placeholder:text-[9.5px] sm:placeholder:text-[10px] placeholder:text-slate-400 focus:outline-none focus:ring-0 focus:border-slate-300 dark:focus:border-slate-600 focus:shadow-none focus-visible:outline-none focus-visible:ring-0 focus-visible:shadow-none shadow-none"
                />
              </div>
            </div>

            <div className="space-y-2 pt-1">
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Enter Subject (e.g. Physics, Maths)..."
                  value={newEditBatchSubjectInput}
                  onChange={e => setNewEditBatchSubjectInput(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddEditBatchSubject();
                    }
                  }}
                  className="h-[34px] sm:h-[36px] flex-1 border-0 border-b border-slate-200/90 dark:border-slate-700/80 !bg-transparent rounded-none px-0 text-[13px] sm:text-[13.5px] md:text-[14px] font-medium text-slate-900 dark:text-slate-100 placeholder:text-[9.5px] sm:placeholder:text-[10px] placeholder:text-slate-400 focus:outline-none focus:ring-0 focus:border-slate-300 dark:focus:border-slate-600 focus:shadow-none focus-visible:outline-none focus-visible:ring-0 focus-visible:shadow-none shadow-none"
                />
                <button
                  type="button"
                  onClick={() => handleAddEditBatchSubject()}
                  className="h-[28px] sm:h-[30px] px-2.5 rounded-md text-[11px] font-bold bg-[#2864E8]/10 hover:bg-[#2864E8]/20 text-[#2864E8] flex items-center gap-1 transition-colors cursor-pointer shrink-0"
                  title="Add Subject"
                  aria-label="Add Subject"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Subject</span>
                </button>
              </div>

              {editBatchForm.subjects && editBatchForm.subjects.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  {editBatchForm.subjects.map((sub, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[11px] font-semibold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700"
                    >
                      <span>{sub}</span>
                      <button
                        type="button"
                        onClick={() => handleDeleteEditBatchSubject(idx)}
                        className="text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                        title="Remove Subject"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <Button
              type="submit"
              disabled={isPending}
              className="group w-full h-[36px] sm:h-[38px] !rounded-[4px] sm:!rounded-[6px] font-bold text-[11px] sm:text-[11.5px] tracking-[0.08em] bg-[#2864E8] hover:bg-[#1E4ED8] active:bg-[#1842BE] text-white shadow-[0_2px_8px_rgba(40,100,232,0.25)] hover:shadow-[0_4px_12px_rgba(40,100,232,0.35)] uppercase flex items-center justify-center gap-1.5 transition-all cursor-pointer !mt-4"
            >
              <span>SAVE BATCH CHANGES</span>
              <ArrowRight className="w-3.5 h-3.5 text-white/90 group-hover:translate-x-0.5 transition-transform duration-150" />
            </Button>
          </form>
        </FormModalDialogContent>
      </Dialog>

      {/* MODAL 1B: EDIT CLASS DETAILS */}
      <Dialog open={isEditClassOpen} onOpenChange={setIsEditClassOpen}>
        <FormModalDialogContent
          maxWidthClass="max-w-[480px] sm:max-w-[530px]"
          hideCloseButton={true}
          className="w-[94vw] sm:w-[92vw] p-0 shadow-[0_20px_50px_-12px_rgba(15,23,42,0.18),0_2px_8px_rgba(15,23,42,0.06)] !rounded-[6px] sm:!rounded-[8px] border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-950 flex flex-col overflow-hidden max-h-[90vh]"
        >
          <div className="h-[34px] sm:h-[36px] flex items-center justify-between px-4 sm:px-5 border-b border-slate-100 dark:border-slate-800/80 bg-white dark:bg-slate-950 shrink-0">
            <span className="text-[12px] sm:text-[12.5px] font-bold tracking-[0.05em] uppercase text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
              <Edit className="w-3.5 h-3.5 text-[#2864E8]" />
              EDIT CLASS DETAILS
            </span>
            <button
              type="button"
              onClick={() => setIsEditClassOpen(false)}
              className="w-6 h-6 -mr-1 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-3.5 h-3.5 stroke-[2.2]" />
            </button>
          </div>

          <DialogHeader className="sr-only">
            <DialogTitle>Edit Class Details</DialogTitle>
            <DialogDescription>Update class name, division, branch, or academic session.</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleUpdateClass} className="p-4 sm:p-5 space-y-3 sm:space-y-3.5 overflow-y-auto" autoComplete="off">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5">
              <div className="space-y-1">
                <Input
                  placeholder="Class Name *"
                  value={editClassForm.name}
                  onChange={e => setEditClassForm({ ...editClassForm, name: e.target.value })}
                  required
                  className="h-[34px] sm:h-[36px] w-full border-0 border-b border-slate-200/90 dark:border-slate-700/80 !bg-transparent rounded-none px-0 text-[13px] sm:text-[13.5px] md:text-[14px] font-medium text-slate-900 dark:text-slate-100 placeholder:text-[9.5px] sm:placeholder:text-[10px] placeholder:text-slate-400 focus:outline-none focus:ring-0 focus:border-slate-300 dark:focus:border-slate-600 focus:shadow-none focus-visible:outline-none focus-visible:ring-0 focus-visible:shadow-none shadow-none"
                />
              </div>

              <div className="space-y-1">
                <Input
                  placeholder="Class Division *"
                  value={editClassForm.division || ''}
                  onChange={e => setEditClassForm({ ...editClassForm, division: e.target.value })}
                  className="h-[34px] sm:h-[36px] w-full border-0 border-b border-slate-200/90 dark:border-slate-700/80 !bg-transparent rounded-none px-0 text-[13px] sm:text-[13.5px] md:text-[14px] font-medium text-slate-900 dark:text-slate-100 placeholder:text-[9.5px] sm:placeholder:text-[10px] placeholder:text-slate-400 focus:outline-none focus:ring-0 focus:border-slate-300 dark:focus:border-slate-600 focus:shadow-none focus-visible:outline-none focus-visible:ring-0 focus-visible:shadow-none shadow-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5">
              <div className="space-y-1">
                <Select
                  value={editClassForm.branchId}
                  onValueChange={val => setEditClassForm({ ...editClassForm, branchId: val })}
                >
                  <SelectTrigger className="h-[34px] sm:h-[36px] w-full border-0 border-b border-slate-200/90 dark:border-slate-700/80 !bg-transparent rounded-none px-0 text-[13px] sm:text-[13.5px] md:text-[14px] font-medium text-slate-900 dark:text-slate-100 [&>span]:text-[13px] sm:[&>span]:text-[13.5px] md:[&>span]:text-[14px] [&>span]:font-medium [&>span]:text-slate-900 dark:[&>span]:text-slate-100 data-[placeholder]:!text-slate-400 [&[data-placeholder]>span]:!text-slate-400 [&[data-placeholder]>span]:!text-[9.5px] sm:[&[data-placeholder]>span]:!text-[10px] [&[data-placeholder]>span]:!font-normal focus:outline-none focus:ring-0 focus:border-slate-300 dark:focus:border-slate-600 focus:shadow-none focus-visible:outline-none focus-visible:ring-0 focus-visible:shadow-none shadow-none flex items-center justify-between">
                    <SelectValue placeholder="Branch *" />
                  </SelectTrigger>
                  <SelectContent>
                    {selectableBranches.map(b => (
                      <SelectItem key={b.id} value={b.id} className="text-[13px] sm:text-[13.5px] md:text-[14px] font-medium py-1.5 sm:py-2">
                        {b.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Input
                  placeholder="Academic Session (e.g. 2026-27)"
                  value={editClassForm.academicSession}
                  onChange={e => setEditClassForm({ ...editClassForm, academicSession: e.target.value })}
                  className="h-[34px] sm:h-[36px] w-full border-0 border-b border-slate-200/90 dark:border-slate-700/80 !bg-transparent rounded-none px-0 text-[13px] sm:text-[13.5px] md:text-[14px] font-medium text-slate-900 dark:text-slate-100 placeholder:text-[9.5px] sm:placeholder:text-[10px] placeholder:text-slate-400 focus:outline-none focus:ring-0 focus:border-slate-300 dark:focus:border-slate-600 focus:shadow-none focus-visible:outline-none focus-visible:ring-0 focus-visible:shadow-none shadow-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5">
              <div className="space-y-1">
                <Input
                  type="number"
                  min="1"
                  placeholder="Card Order Number (e.g. 1, 2)"
                  value={editClassForm.order !== undefined ? editClassForm.order : ''}
                  onChange={e =>
                    setEditClassForm({ ...editClassForm, order: e.target.value === '' ? '' : Number(e.target.value) })
                  }
                  className="h-[34px] sm:h-[36px] w-full border-0 border-b border-slate-200/90 dark:border-slate-700/80 !bg-transparent rounded-none px-0 text-[13px] sm:text-[13.5px] md:text-[14px] font-medium text-slate-900 dark:text-slate-100 placeholder:text-[9.5px] sm:placeholder:text-[10px] placeholder:text-slate-400 focus:outline-none focus:ring-0 focus:border-slate-300 dark:focus:border-slate-600 focus:shadow-none focus-visible:outline-none focus-visible:ring-0 focus-visible:shadow-none shadow-none"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isPending}
              className="group w-full h-9 !rounded-[5px] text-xs font-semibold uppercase tracking-wider bg-[#2864E8] hover:bg-[#1E4ED8] active:bg-[#1842BE] text-white shadow-[0_1px_2px_rgba(15,23,42,0.08)] transition-all flex items-center justify-center gap-1.5 cursor-pointer mt-1 sm:mt-1.5"
            >
              <span>SAVE CLASS CHANGES</span>
              <ArrowRight className="w-3.5 h-3.5 text-white/90 group-hover:translate-x-0.5 transition-transform duration-150" />
            </Button>
          </form>
        </FormModalDialogContent>
      </Dialog>

      {/* Optional standalone delete confirmation AlertDialog */}
      {renderDeleteDialog && (
        <AlertDialog open={!!internalDeleteTarget} onOpenChange={open => !open && setInternalDeleteTarget(null)}>
          <AlertDialogContent className="max-w-md rounded-2xl p-6 bg-white dark:bg-slate-900">
            <AlertDialogHeader>
              <div className="flex items-center gap-2 text-rose-600 mb-1">
                <AlertTriangle className="w-5 h-5" />
                <AlertDialogTitle className="text-base font-bold">
                  Confirm Deletion of {internalDeleteTarget?.type.toUpperCase()}
                </AlertDialogTitle>
              </div>
              <AlertDialogDescription className="text-xs text-slate-600 dark:text-slate-400">
                Are you sure you want to delete{' '}
                <strong className="text-slate-900 dark:text-white">{internalDeleteTarget?.name}</strong>?
                {internalDeleteTarget?.type === 'class' && (
                  <span className="block mt-1 text-rose-600 font-semibold">
                    This action cannot be undone. You will not be able to delete this class if active batches or students
                    are associated with it.
                  </span>
                )}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="pt-2">
              <AlertDialogCancel className="h-9 text-xs">Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleExecuteDelete}
                className="h-9 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white"
              >
                Confirm Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
}

interface BranchToolbarControlProps {
  selectedBranch: string;
  onSelectBranch: (branchId: string) => void;
  isBranchAdmin?: boolean;
  branchName?: string | null;
  controlClassName?: string;
}

const DEFAULT_TOOLBAR_CONTROL_CLS =
  'h-7 px-0.5 py-0.5 bg-transparent hover:bg-transparent border-0 rounded-none shadow-none ring-0 outline-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 text-xs sm:text-[13px] font-semibold text-[#172033] dark:text-slate-100 hover:text-[#2864E8] dark:hover:text-blue-400 inline-flex items-center gap-1.5 transition-colors cursor-pointer shrink-0';

/**
 * Borderless left-aligned Branch selector popover (or locked badge for Branch Admin) matching Fee Management toolbar.
 */
export function BranchToolbarControl({
  selectedBranch,
  onSelectBranch,
  isBranchAdmin = false,
  branchName,
  controlClassName = DEFAULT_TOOLBAR_CONTROL_CLS,
}: BranchToolbarControlProps) {
  const [open, setOpen] = useState(false);

  if (isBranchAdmin) {
    return (
      <div className="h-7 inline-flex items-center gap-1.5 bg-transparent border-0 text-xs sm:text-[13px] font-semibold text-[#172033] dark:text-slate-100 shrink-0">
        <Building2 className="w-3.5 h-3.5 text-[#2864E8] dark:text-blue-400 shrink-0" />
        <span className="whitespace-nowrap">{branchName || 'Mangol Puri Branch'}</span>
        <span className="text-[11px] font-medium text-[#2864E8] dark:text-blue-400 whitespace-nowrap">
          (Branch Admin)
        </span>
      </div>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button type="button" aria-label="Select branch" className={controlClassName}>
          <Building2 className="w-3.5 h-3.5 text-[#2864E8] dark:text-blue-400 shrink-0" />
          <span className="whitespace-nowrap">
            {!selectedBranch || selectedBranch === 'none'
              ? 'Select Branch'
              : IDL_BRANCHES.find(b => b.id === selectedBranch)?.name || 'All Branches'}
          </span>
          <ChevronDown
            className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 shrink-0 ${
              open ? 'rotate-180 text-slate-700 dark:text-slate-200' : ''
            }`}
          />
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="center"
        sideOffset={8}
        className="w-[212px] p-2 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
      >
        <button
          type="button"
          onClick={() => {
            onSelectBranch('all');
            setOpen(false);
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
          {selectedBranch === 'all' && <Check className="w-3.5 h-3.5 text-[#2864E8] dark:text-blue-400 shrink-0" />}
        </button>

        <div className="my-1.5 border-t border-slate-100 dark:border-slate-800/80" />

        <div className="space-y-0.5">
          {IDL_BRANCHES.filter(b => b.id !== 'all').map(b => {
            const isSelected = selectedBranch === b.id;
            return (
              <button
                key={b.id}
                type="button"
                onClick={() => {
                  onSelectBranch(b.id);
                  setOpen(false);
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
                {isSelected && <Check className="w-3.5 h-3.5 text-[#2864E8] dark:text-blue-400 shrink-0" />}
              </button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}

interface ClassBatchQuickActionsProps {
  onCreateClass: () => void;
  onCreateBatch: () => void;
  extraActions?: React.ReactNode;
}

/**
 * Shared Quick Action Controls (`+ CLASS`, `+ BATCH`, plus optional extra buttons) matching Fee Management header strip.
 */
export function ClassBatchQuickActions({
  onCreateClass,
  onCreateBatch,
  extraActions,
}: ClassBatchQuickActionsProps) {
  return (
    <div className="flex items-center gap-3 sm:gap-4 shrink-0 px-1">
      <button
        type="button"
        onClick={onCreateClass}
        className="group flex items-center gap-1.5 text-[12px] sm:text-[12.5px] font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 uppercase tracking-[0.3px] transition-colors bg-transparent border-0 p-0 cursor-pointer focus:outline-none focus:ring-0 shadow-none"
        title="Add Class"
      >
        <span className="w-[18px] h-[18px] rounded-full border border-slate-300 dark:border-slate-600 group-hover:border-slate-500 dark:group-hover:border-slate-400 flex items-center justify-center shrink-0 transition-colors">
          <Plus
            className="w-2.5 h-2.5 text-slate-500 dark:text-slate-400 group-hover:text-slate-800 dark:group-hover:text-slate-200 transition-colors"
            strokeWidth={2.5}
          />
        </span>
        <span>CLASS</span>
      </button>
      <button
        type="button"
        onClick={onCreateBatch}
        className="group flex items-center gap-1.5 text-[12px] sm:text-[12.5px] font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 uppercase tracking-[0.3px] transition-colors bg-transparent border-0 p-0 cursor-pointer focus:outline-none focus:ring-0 shadow-none"
        title="Add Batch"
      >
        <span className="w-[18px] h-[18px] rounded-full border border-slate-300 dark:border-slate-600 group-hover:border-slate-500 dark:group-hover:border-slate-400 flex items-center justify-center shrink-0 transition-colors">
          <Plus
            className="w-2.5 h-2.5 text-slate-500 dark:text-slate-400 group-hover:text-slate-800 dark:group-hover:text-slate-200 transition-colors"
            strokeWidth={2.5}
          />
        </span>
        <span>BATCH</span>
      </button>
      {extraActions}
    </div>
  );
}
