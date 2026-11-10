// src/app/admin/fees/fees-client.tsx
'use client';

import React, { useState, useEffect, useTransition, useRef } from 'react';
import Link from 'next/link';
import {
  FeeClass,
  FeeBatch,
  FeeStudent,
  FeeLedgerEntry,
  FeePayment,
  FeeDashboardStats,
  FeeBranch,
  IDL_BRANCHES,
  AVAILABLE_SUBJECTS,
  StudentStatus,
  LedgerStatus,
  PaymentMode,
  FeeStructureType,
  AdditionalSubject,
  getStudentStatusForMonth,
  getActiveAdditionalSubjectsForMonth,
  BranchYearlyReportResult,
  BranchYearlyData,
} from '@/types/fee-management';
import {
  getFeeDashboardStats,
  getFeeClasses,
  createFeeClass,
  updateFeeClass,
  deleteFeeClass,
  getFeeBatches,
  createFeeBatch,
  updateFeeBatch,
  deleteFeeBatch,
  getFeeStudents,
  createFeeStudent,
  updateFeeStudent,
  transferFeeStudent,
  addStudentAdditionalSubject,
  removeStudentAdditionalSubject,
  toggleStudentStatus,
  deleteFeeStudent,
  deleteStudentFromMonth,
  restoreStudentToMonth,
  getMonthlyLedger,
  collectFeePayment,
  collectYearlyPackagePayment,
  updatePaymentDate,
  revertFeePayment,
  markMonthUnpaid,
  getFeePayments,
  getCurrentMonth,
  getMonthLabel,
  clearAllFeeData,
  getBranchYearlyReport,
} from '@/app/actions/fee-management';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
  Users,
  GraduationCap,
  IndianRupee,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Plus,
  Search,
  Filter,
  Trash2,
  Edit,
  Power,
  PowerOff,
  Receipt,
  Printer,
  Calendar,
  Layers,
  History,
  Building2,
  Check,
  ChevronRight,
  TrendingUp,
  Sparkles,
  Percent,
  CreditCard,
  Banknote,
  RefreshCw,
  RotateCcw,
  Eye,
  FileText,
  CalendarX2,
  UserX,
  Info,
  ArrowLeft,
  ArrowRight,
  ArrowRightLeft,
  Shield,
  UserPlus,
  FolderPlus,
  School,
  BookOpen,
  BookPlus,
  Presentation,
  BarChart3,
  ChevronDown,
  X,
  UserCheck,
  Star,
} from 'lucide-react';

interface FeesClientProps {
  initialTab?: string;
  initialMonth: string;
  initialBranch?: string;
  initialStats: FeeDashboardStats;
  initialClasses: FeeClass[];
  initialBatches: FeeBatch[];
  initialStudents: FeeStudent[];
  initialLedger: (FeeLedgerEntry & { student: FeeStudent })[];
  initialYearlyReport?: BranchYearlyReportResult;
}

export function FeesClient({
  initialTab = 'overview',
  initialMonth,
  initialBranch = '',
  initialStats,
  initialClasses,
  initialBatches,
  initialStudents,
  initialLedger,
  initialYearlyReport,
}: FeesClientProps) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  // Filters - By default no branch selected so user manually chooses
  const [selectedBranch, setSelectedBranch] = useState<string>(initialBranch);
  const [selectedMonth, setSelectedMonth] = useState<string>(initialMonth);
  const [activeTab, setActiveTab] = useState<string>(initialTab);
  const [studentSearch, setStudentSearch] = useState<string>('');
  const [isStudentSearchOpen, setIsStudentSearchOpen] = useState<boolean>(false);
  const studentSearchInputRef = useRef<HTMLInputElement>(null);
  const [isLedgerSearchOpen, setIsLedgerSearchOpen] = useState<boolean>(false);
  const ledgerSearchInputRef = useRef<HTMLInputElement>(null);
  const [classFilter, setClassFilter] = useState<string>('all');
  const [batchFilter, setBatchFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [ledgerStatusFilter, setLedgerStatusFilter] = useState<string>('all');

  // Live Data States
  const [stats, setStats] = useState<FeeDashboardStats>(initialStats);
  const [classes, setClasses] = useState<FeeClass[]>(initialClasses);
  const [batches, setBatches] = useState<FeeBatch[]>(initialBatches);
  const [students, setStudents] = useState<FeeStudent[]>(initialStudents);
  const [ledger, setLedger] = useState<(FeeLedgerEntry & { student: FeeStudent })[]>(initialLedger);

  // Academic session months strictly from 1 April 2026 up to current month (future months locked)
  const monthOptions = React.useMemo(() => {
    const startYear = 2026;
    const startMonth = 4; // 1 April 2026
    const [currYear, currMonth] = (initialMonth || '2026-11').split('-').map(Number);
    const options: { value: string; label: string }[] = [];
    let y = startYear;
    let m = startMonth;
    while (y < currYear || (y === currYear && m <= currMonth)) {
      const val = `${y}-${String(m).padStart(2, '0')}`;
      const d = new Date(y, m - 1, 1);
      const label = d.toLocaleString('en-US', { month: 'long', year: 'numeric' });
      options.push({ value: val, label });
      m++;
      if (m > 12) {
        m = 1;
        y++;
      }
    }
    return options;
  }, [initialMonth]);

  // Refresh data function
  const refreshAllData = (month = selectedMonth, branch = selectedBranch) => {
    startTransition(async () => {
      const [newStats, newClasses, newBatches, newStudents, newLedger, newYearly] = await Promise.all([
        getFeeDashboardStats(month, branch),
        getFeeClasses(branch),
        getFeeBatches(undefined, branch),
        getFeeStudents({ branchId: branch }),
        getMonthlyLedger(month, { branchId: branch }),
        getBranchYearlyReport('2026-27'),
      ]);

      if (newStats.success) setStats(newStats.data);
      if (newClasses.success) setClasses(newClasses.data);
      if (newBatches.success) setBatches(newBatches.data);
      if (newStudents.success) {
        setStudents(newStudents.data);
        setSelectedStudentProfile(prev => {
          if (!prev) return null;
          const updated = newStudents.data.find(s => s.id === prev.id);
          return updated || prev;
        });
      }
      if (newLedger.success) setLedger(newLedger.data);
      if (newYearly.success) setYearlyReport(newYearly.data);
    });
  };

  useEffect(() => {
    refreshAllData(selectedMonth, selectedBranch);
  }, [selectedMonth, selectedBranch]);

  // --------------------------------------------------------------------------
  // MODAL STATES
  // --------------------------------------------------------------------------

  // 1. Create Class Modal
  const [isClassModalOpen, setIsClassModalOpen] = useState(false);
  const [classForm, setClassForm] = useState<{
    name: string;
    code: string;
    division: string;
    branchId: string;
    academicSession: string;
    description: string;
    defaultMonthlyFee: number;
    order?: number | '';
  }>({
    name: '',
    code: '',
    division: '',
    branchId: '',
    academicSession: '2026-27',
    description: '',
    defaultMonthlyFee: 0,
    order: '',
  });

  // 2. Create Batch Modal
  const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);
  const [isSubmittingBatch, setIsSubmittingBatch] = useState(false);
  const [batchForm, setBatchForm] = useState<{
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
  }>({
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
  });
  const [newBatchSubjectInput, setNewBatchSubjectInput] = useState('');
  const [editingBatchSubIdx, setEditingBatchSubIdx] = useState<number | null>(null);
  const [editingBatchSubName, setEditingBatchSubName] = useState('');
  const [isCustomBatchFee, setIsCustomBatchFee] = useState(false);
  const [selectedBatchPerClass, setSelectedBatchPerClass] = useState<Record<string, string>>({});

  // 2B. Edit Batch Modal
  const [isEditBatchOpen, setIsEditBatchOpen] = useState(false);
  const [editingBatch, setEditingBatch] = useState<FeeBatch | null>(null);
  const [editBatchForm, setEditBatchForm] = useState<{
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
  }>({
    classId: '',
    branchId: 'mukherjee-nagar',
    name: '',
    duration: '',
    classTime: '',
    subjects: [],
    monthlyFee: 0,
    startDate: '',
    endDate: '',
    order: '',
  });
  const [newEditBatchSubjectInput, setNewEditBatchSubjectInput] = useState('');
  const [editingEditBatchSubIdx, setEditingEditBatchSubIdx] = useState<number | null>(null);
  const [editingEditBatchSubName, setEditingEditBatchSubName] = useState('');

  // 1B. Edit Class Modal
  const [isEditClassOpen, setIsEditClassOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<FeeClass | null>(null);
  const [editClassForm, setEditClassForm] = useState<{
    name: string;
    division?: string;
    code: string;
    branchId: string;
    academicSession: string;
    description: string;
    defaultMonthlyFee: number;
    order?: number | '';
  }>({
    name: '',
    division: '',
    code: '',
    branchId: 'mukherjee-nagar',
    academicSession: '2026-27',
    description: '',
    defaultMonthlyFee: 0,
    order: '',
  });

  // 3. Register Student Modal
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [studentForm, setStudentForm] = useState<{
    rollNumber?: string;
    name: string;
    fatherName: string;
    fatherOccupation?: string;
    dob: string;
    gender: 'male' | 'female' | 'other' | '';
    bloodGroup?: string;
    address: string;
    contact1: string;
    fatherContact?: string;
    motherContact?: string;
    contact2: string;
    branchId: string;
    classId: string;
    batchId: string;
    subjects: string[];
    joiningDate: string;
    dueDate?: string;
    dueDayOfMonth: number;
    feeType: 'monthly' | 'course_onetime' | 'yearly_package';
    paymentCycleMonths: number;
    baseFee: number;
    scholarshipPercent: number;
    discountAmount?: number;
    totalYearlyFee?: number;
    yearlyStandardFee?: number;
    yearlyCourseMonths?: number;
    additionalSubjects?: AdditionalSubject[];
  }>({
    rollNumber: '',
    name: '',
    fatherName: '',
    fatherOccupation: '',
    dob: '',
    gender: '',
    bloodGroup: '',
    address: '',
    contact1: '',
    fatherContact: '',
    motherContact: '',
    contact2: '',
    branchId: '',
    classId: '',
    batchId: '',
    subjects: [],
    joiningDate: '',
    dueDate: '',
    dueDayOfMonth: 5,
    feeType: 'monthly',
    paymentCycleMonths: 1,
    baseFee: 0,
    scholarshipPercent: 0,
    discountAmount: 0,
    totalYearlyFee: 0,
    yearlyStandardFee: 0,
    yearlyCourseMonths: 12,
    additionalSubjects: [],
  });

  const [isCustomRollNumber, setIsCustomRollNumber] = useState(false);
  const [newEnrollAddlSubjectName, setNewEnrollAddlSubjectName] = useState('');
  const [newEnrollAddlSubjectFee, setNewEnrollAddlSubjectFee] = useState('');
  const [newEditAddlSubjectName, setNewEditAddlSubjectName] = useState('');
  const [newEditAddlSubjectFee, setNewEditAddlSubjectFee] = useState('');

  // 3B. Edit Student Modal
  const [isEditStudentOpen, setIsEditStudentOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<FeeStudent | null>(null);
  const [editStudentForm, setEditStudentForm] = useState<{
    rollNumber?: string;
    name: string;
    fatherName: string;
    fatherOccupation?: string;
    dob: string;
    gender: 'male' | 'female' | 'other';
    bloodGroup?: string;
    address: string;
    contact1: string;
    fatherContact?: string;
    motherContact?: string;
    contact2: string;
    branchId: string;
    classId: string;
    batchId: string;
    subjects: string[];
    joiningDate: string;
    dueDate?: string;
    dueDayOfMonth: number;
    feeType: 'monthly' | 'course_onetime' | 'yearly_package';
    paymentCycleMonths: number;
    baseFee: number;
    scholarshipPercent: number;
    discountAmount?: number;
    totalYearlyFee?: number;
    yearlyStandardFee?: number;
    yearlyCourseMonths?: number;
    additionalSubjects?: AdditionalSubject[];
  }>({
    rollNumber: '',
    name: '',
    fatherName: '',
    fatherOccupation: '',
    dob: '',
    gender: 'male',
    bloodGroup: '',
    address: '',
    contact1: '',
    fatherContact: '',
    motherContact: '',
    contact2: '',
    branchId: '',
    classId: '',
    batchId: '',
    subjects: [],
    joiningDate: '',
    dueDate: '',
    dueDayOfMonth: 5,
    feeType: 'monthly',
    paymentCycleMonths: 1,
    baseFee: 0,
    scholarshipPercent: 0,
    discountAmount: 0,
    totalYearlyFee: 0,
    yearlyStandardFee: 0,
    yearlyCourseMonths: 12,
    additionalSubjects: [],
  });

  // Reset confirmation dialog
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  // 4. Collect Fee Modal
  const [isCollectFeeOpen, setIsCollectFeeOpen] = useState(false);
  const [collectTarget, setCollectTarget] = useState<(FeeLedgerEntry & { student: FeeStudent }) | null>(null);
  const [collectForm, setCollectForm] = useState<{
    collectType: 'single' | 'yearly_package';
    amount: number;
    totalYearlyFee: number;
    yearlyCourseMonths: number;
    paymentMode: PaymentMode | '';
    transactionRef: string;
    remarks: string;
    paymentDate: string;
  }>({
    collectType: 'single',
    amount: 0,
    totalYearlyFee: 0,
    yearlyCourseMonths: 12,
    paymentMode: '',
    transactionRef: '',
    remarks: '',
    paymentDate: new Date().toISOString().split('T')[0],
  });

  // 4B. Fee Recording State
  const [isRecordingPayment, setIsRecordingPayment] = useState(false);

  // 6. Payment Receipt Dialog
  const [recentReceipt, setRecentReceipt] = useState<FeePayment | null>(null);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);

  // 7. Student Profile View Modal
  const [selectedStudentProfile, setSelectedStudentProfile] = useState<FeeStudent | null>(null);
  const [profileSubjectTab, setProfileSubjectTab] = useState<'enrolled' | 'additional'>('enrolled');
  const [editStudentSubjectTab, setEditStudentSubjectTab] = useState<'enrolled' | 'additional'>('enrolled');
  const [showAddSubjectInput, setShowAddSubjectInput] = useState(false);

  // 8. Delete Confirmation States
  const [deleteTarget, setDeleteTarget] = useState<{
    type: 'class' | 'batch' | 'student';
    id: string;
    name: string;
  } | null>(null);

  // 8B. Student Delete Options Modal (Month Only vs All Months)
  const [studentDeleteModal, setStudentDeleteModal] = useState<{
    isOpen: boolean;
    student: FeeStudent | null;
    source: 'ledger' | 'students' | 'profile';
  }>({
    isOpen: false,
    student: null,
    source: 'students',
  });

  // 9. Status Toggle Options Modal (Month Onwards vs All Months)
  const [statusOptionsModal, setStatusOptionsModal] = useState<{
    isOpen: boolean;
    student: FeeStudent | null;
    targetStatus: StudentStatus;
  }>({
    isOpen: false,
    student: null,
    targetStatus: 'disabled',
  });

  // 10. Revert / Mark Unpaid States
  const [isRevertModalOpen, setIsRevertModalOpen] = useState(false);
  const [revertTarget, setRevertTarget] = useState<(FeeLedgerEntry & { student: FeeStudent }) | null>(null);
  const [revertTargetPayments, setRevertTargetPayments] = useState<FeePayment[]>([]);
  const [isReverting, setIsReverting] = useState(false);
  const [revertPaymentTarget, setRevertPaymentTarget] = useState<FeePayment | null>(null);

  // 11. Edit Receipt Payment Date State
  const [editingPaymentDateTarget, setEditingPaymentDateTarget] = useState<FeePayment | null>(null);
  const [newPaymentDateInput, setNewPaymentDateInput] = useState<string>('');
  const [isUpdatingPaymentDate, setIsUpdatingPaymentDate] = useState(false);

  // 12. Batch & Branch Transfer Modal State
  const [transferModal, setTransferModal] = useState<{
    isOpen: boolean;
    student: FeeStudent | null;
    targetBranchId: string;
    targetClassId: string;
    targetBatchId: string;
    retainCurrentFee: boolean;
    customBaseFee: string;
    effectiveMonth: string;
    reason: string;
    isSubmitting: boolean;
    feeAdjustmentMode: 'charge_extra' | 'add_scholarship' | 'retain_current' | 'custom';
    customFeeInput: string;
  }>({
    isOpen: false,
    student: null,
    targetBranchId: '',
    targetClassId: '',
    targetBatchId: '',
    retainCurrentFee: false,
    customBaseFee: '',
    effectiveMonth: initialMonth || '2026-11',
    reason: '',
    isSubmitting: false,
    feeAdjustmentMode: 'add_scholarship',
    customFeeInput: '',
  });

  const openTransferModal = (student: FeeStudent) => {
    const stBranch = student.branchId || 'budh-vihar';
    const branchClasses = classes.filter(c => c.branchId === stBranch || c.branchId === 'all');
    const initialClassId = student.classId || branchClasses[0]?.id || '';
    const classBatches = batches.filter(b => b.classId === initialClassId);
    const initialBatchId = student.batchId || classBatches[0]?.id || '';

    setTransferModal({
      isOpen: true,
      student,
      targetBranchId: stBranch,
      targetClassId: initialClassId,
      targetBatchId: initialBatchId,
      retainCurrentFee: false,
      customBaseFee: String(student.baseFee || ''),
      effectiveMonth: selectedMonth || initialMonth || '2026-11',
      reason: '',
      isSubmitting: false,
      feeAdjustmentMode: 'add_scholarship',
      customFeeInput: String(student.baseFee || ''),
    });
  };

  const handleTransferSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!transferModal.student) return;

    if (!transferModal.targetBranchId || !transferModal.targetClassId || !transferModal.targetBatchId) {
      toast({ variant: 'destructive', title: 'Selection Missing', description: 'Kripya Target Branch, Class aur Batch select karein.' });
      return;
    }

    if (
      transferModal.targetBranchId === transferModal.student.branchId &&
      transferModal.targetClassId === transferModal.student.classId &&
      transferModal.targetBatchId === transferModal.student.batchId
    ) {
      toast({ variant: 'destructive', title: 'Same Batch', description: 'Student pehle se isi Batch me hai. Kripya koi dusra batch select karein.' });
      return;
    }

    const targetBatch = batches.find(b => b.id === transferModal.targetBatchId);
    const targetClass = classes.find(c => c.id === transferModal.targetClassId);
    const targetBaseFee = (targetBatch && typeof targetBatch.monthlyFee === 'number' && targetBatch.monthlyFee > 0)
      ? targetBatch.monthlyFee
      : (targetClass?.defaultMonthlyFee || transferModal.student.baseFee);

    const currBaseFee = transferModal.student.baseFee || 0;
    const currDiscount = transferModal.student.discountAmount || 0;
    const currPct = transferModal.student.scholarshipPercent || 0;
    const diff = targetBaseFee - currBaseFee;

    let retainCurrentFee = false;
    let newBaseFee: number | undefined = undefined;
    let newDiscountAmount: number | undefined = undefined;
    let newScholarshipPercent: number | undefined = undefined;

    if (transferModal.feeAdjustmentMode === 'retain_current') {
      retainCurrentFee = true;
    } else if (transferModal.feeAdjustmentMode === 'charge_extra') {
      retainCurrentFee = false;
      newBaseFee = targetBaseFee;
      newDiscountAmount = Math.round((targetBaseFee * currPct) / 100);
      newScholarshipPercent = currPct;
    } else if (transferModal.feeAdjustmentMode === 'add_scholarship') {
      retainCurrentFee = false;
      newBaseFee = targetBaseFee;
      newDiscountAmount = Math.max(0, currDiscount + (diff > 0 ? diff : 0));
      newScholarshipPercent = targetBaseFee > 0 ? Number(((newDiscountAmount / targetBaseFee) * 100).toFixed(1)) : 0;
    } else if (transferModal.feeAdjustmentMode === 'custom') {
      retainCurrentFee = false;
      const userEntered = Number(transferModal.customFeeInput) || targetBaseFee;
      newBaseFee = userEntered;
      newDiscountAmount = Math.round((userEntered * currPct) / 100);
      newScholarshipPercent = currPct;
    }

    setTransferModal(prev => ({ ...prev, isSubmitting: true }));
    try {
      const res = await transferFeeStudent({
        studentId: transferModal.student.id,
        targetBranchId: transferModal.targetBranchId,
        targetClassId: transferModal.targetClassId,
        targetBatchId: transferModal.targetBatchId,
        effectiveMonth: transferModal.effectiveMonth,
        retainCurrentFee,
        newBaseFee,
        newDiscountAmount,
        newScholarshipPercent,
        reason: transferModal.reason.trim() || undefined,
      });

      if (res.success && res.data) {
        toast({ title: 'Student Transferred', description: res.message });
        setStudents(prev => prev.map(s => s.id === res.data!.id ? res.data! : s));
        if (selectedStudentProfile && selectedStudentProfile.id === res.data.id) {
          setSelectedStudentProfile(res.data);
        }
        refreshAllData();
        setTransferModal(prev => ({ ...prev, isOpen: false, isSubmitting: false }));
      } else {
        toast({ variant: 'destructive', title: 'Transfer Failed', description: res.message || 'Transfer execute nahi ho saka.' });
        setTransferModal(prev => ({ ...prev, isSubmitting: false }));
      }
    } catch (err: any) {
      toast({ variant: 'destructive', title: 'Error', description: err.message || 'Unexpected error during transfer.' });
      setTransferModal(prev => ({ ...prev, isSubmitting: false }));
    }
  };

  // Safeguard: Ensure document.body never gets stuck with pointer-events: none
  useEffect(() => {
    const timer = setTimeout(() => {
      const anyModalOpen =
        isCollectFeeOpen ||
        isReceiptOpen ||
        isStudentModalOpen ||
        isClassModalOpen ||
        isBatchModalOpen ||
        isEditBatchOpen ||
        isEditClassOpen ||
        isEditStudentOpen ||
        isRevertModalOpen ||
        !!revertPaymentTarget ||
        !!selectedStudentProfile ||
        !!deleteTarget ||
        studentDeleteModal.isOpen ||
        statusOptionsModal.isOpen ||
        transferModal.isOpen ||
        !!editingPaymentDateTarget ||
        isResetConfirmOpen;

      if (!anyModalOpen && typeof document !== 'undefined') {
        if (document.body.style.pointerEvents === 'none') {
          document.body.style.pointerEvents = '';
        }
      }
    }, 150);
    return () => clearTimeout(timer);
  }, [
    isCollectFeeOpen,
    isReceiptOpen,
    isStudentModalOpen,
    isClassModalOpen,
    isBatchModalOpen,
    isEditBatchOpen,
    isEditClassOpen,
    isEditStudentOpen,
    isRevertModalOpen,
    revertPaymentTarget,
    selectedStudentProfile,
    deleteTarget,
    studentDeleteModal.isOpen,
    statusOptionsModal.isOpen,
    transferModal.isOpen,
    editingPaymentDateTarget,
    isResetConfirmOpen,
  ]);

  // --------------------------------------------------------------------------
  // HANDLERS
  // --------------------------------------------------------------------------

  // Handle Class Creation
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

    // Auto-generate code from class name since code field was removed from form
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

    const res = await createFeeClass(payload);
    if (res.success) {
      toast({ title: 'Success', description: res.message });
      setIsClassModalOpen(false);
      setClassForm({
        name: '',
        code: '',
        division: '',
        branchId: selectedBranch && selectedBranch !== 'all' ? selectedBranch : '',
        academicSession: '2026-27',
        description: '',
        defaultMonthlyFee: 0,
        order: '',
      });
      refreshAllData();
    } else {
      toast({ variant: 'destructive', title: 'Error', description: res.message });
    }
  };

  // Helper for formatting batch date range
  const formatBatchDateString = (dateStr?: string) => {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length !== 3) return dateStr;
    const [y, m, d] = parts;
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthIdx = parseInt(m, 10) - 1;
    return `${d} ${monthNames[monthIdx] || m} ${y}`;
  };

  // Helper for parsing date range from batch duration string
  const parseDateRangeFromDuration = (durationStr?: string) => {
    if (!durationStr) return { startDate: '', endDate: '' };
    const monthMap: Record<string, string> = {
      jan: '01', feb: '02', mar: '03', apr: '04', may: '05', jun: '06',
      jul: '07', aug: '08', sep: '09', oct: '10', nov: '11', dec: '12',
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
  };

  // Handle Batch Creation
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
      const durationStr = batchForm.startDate && batchForm.endDate
        ? `${formatBatchDateString(batchForm.startDate)} – ${formatBatchDateString(batchForm.endDate)}`
        : batchForm.startDate ? `From ${formatBatchDateString(batchForm.startDate)}`
        : batchForm.duration || '';

      const matchedClass = classes.find(c => c.id === batchForm.classId);
      const rawMonthly = Number(batchForm.monthlyFee) || 0;
      const rawYearly = Number(batchForm.courseFee) || 0;
      const resolvedMonthlyFee = rawMonthly > 0
        ? rawMonthly
        : (rawYearly > 0 ? Math.round(rawYearly / 12) : (matchedClass?.defaultMonthlyFee || 0));
      const resolvedCourseFee = rawYearly > 0
        ? rawYearly
        : (resolvedMonthlyFee > 0 ? resolvedMonthlyFee * 12 : undefined);

      const pendingSub = newBatchSubjectInput.trim();
      const finalSubjects = pendingSub && !batchForm.subjects.some(s => s.toLowerCase() === pendingSub.toLowerCase())
        ? [...batchForm.subjects, pendingSub]
        : batchForm.subjects;

      const payload = {
        classId: batchForm.classId,
        branchId: matchedClass?.branchId || batchForm.branchId || (selectedBranch && selectedBranch !== 'all' ? selectedBranch : 'mukherjee-nagar'),
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
          classId: '',
          branchId: selectedBranch && selectedBranch !== 'all' ? selectedBranch : '',
          name: '',
          duration: '',
          classTime: '',
          subjects: [],
          monthlyFee: 0,
          courseFee: 0,
          startDate: '',
          endDate: '',
          order: '',
        });
        setNewBatchSubjectInput('');
        setEditingBatchSubIdx(null);
        setIsCustomBatchFee(false);
        refreshAllData(selectedMonth, selectedBranch);
      } else {
        toast({ variant: 'destructive', title: 'Error', description: res.message });
      }
    } catch (err: any) {
      toast({ variant: 'destructive', title: 'Error', description: err.message || 'Failed to create batch' });
    } finally {
      setIsSubmittingBatch(false);
    }
  };

  // Handlers for dynamic batch subjects creation, editing & deletion
  const handleAddBatchSubject = (subjectToAdd?: string) => {
    const sub = (subjectToAdd !== undefined ? subjectToAdd : newBatchSubjectInput).trim();
    if (!sub) return;
    if (batchForm.subjects.some(s => s.toLowerCase() === sub.toLowerCase())) {
      toast({ title: 'Notice', description: `"${sub}" is already added to this batch.` });
      return;
    }
    const updatedSubjects = [...batchForm.subjects, sub];
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

  const handleSaveEditBatchSubject = (idx: number) => {
    const trimmed = editingBatchSubName.trim();
    if (!trimmed) {
      setEditingBatchSubIdx(null);
      return;
    }
    const updatedSubjects = [...batchForm.subjects];
    updatedSubjects[idx] = trimmed;
    setBatchForm(prev => ({ ...prev, subjects: updatedSubjects }));
    setEditingBatchSubIdx(null);
    setEditingBatchSubName('');
  };

  // Open Edit Batch Modal
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

  const handleSaveSubjectInEditBatch = (idx: number) => {
    const trimmed = editingEditBatchSubName.trim();
    if (!trimmed) {
      setEditingEditBatchSubIdx(null);
      return;
    }
    const updatedSubjects = [...editBatchForm.subjects];
    updatedSubjects[idx] = trimmed;
    setEditBatchForm(prev => ({ ...prev, subjects: updatedSubjects }));
    setEditingEditBatchSubIdx(null);
    setEditingEditBatchSubName('');
  };

  // Handle Batch Update
  const handleUpdateBatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBatch) return;
    if (!editBatchForm.name.trim() || !editBatchForm.classId) {
      toast({ variant: 'destructive', title: 'Error', description: 'Please select a Class and enter Batch Name.' });
      return;
    }

    const durationStr = editBatchForm.startDate && editBatchForm.endDate
      ? `${formatBatchDateString(editBatchForm.startDate)} – ${formatBatchDateString(editBatchForm.endDate)}`
      : editBatchForm.startDate ? `From ${formatBatchDateString(editBatchForm.startDate)}`
      : editBatchForm.endDate ? `Till ${formatBatchDateString(editBatchForm.endDate)}`
      : editBatchForm.duration || '';

    const rawMonthly = Number(editBatchForm.monthlyFee) || 0;
    const rawYearly = Number(editBatchForm.courseFee) || 0;
    const resolvedMonthlyFee = rawMonthly > 0
      ? rawMonthly
      : (rawYearly > 0 ? Math.round(rawYearly / 12) : 0);
    const resolvedCourseFee = rawYearly > 0
      ? rawYearly
      : (resolvedMonthlyFee > 0 ? resolvedMonthlyFee * 12 : undefined);

    const pendingSub = newEditBatchSubjectInput.trim();
    const finalSubjects = pendingSub && !editBatchForm.subjects.some(s => s.toLowerCase() === pendingSub.toLowerCase())
      ? [...editBatchForm.subjects, pendingSub]
      : editBatchForm.subjects;

    const payload = {
      ...editBatchForm,
      subjects: finalSubjects,
      monthlyFee: resolvedMonthlyFee,
      courseFee: resolvedCourseFee,
      duration: durationStr,
      order: editBatchForm.order !== '' && editBatchForm.order !== undefined ? Number(editBatchForm.order) : undefined,
    };

    const res = await updateFeeBatch(editingBatch.id, payload);
    if (res.success) {
      toast({ title: 'Batch Updated', description: res.message });
      setIsEditBatchOpen(false);
      setEditingBatch(null);
      refreshAllData();
      if (selectedStudentProfile && selectedStudentProfile.batchId === editingBatch.id) {
        getFeeStudents().then(sRes => {
          if (sRes.success) {
            const found = sRes.data.find(s => s.id === selectedStudentProfile.id);
            if (found) setSelectedStudentProfile(found);
          }
        });
      }
    } else {
      toast({ variant: 'destructive', title: 'Error', description: res.message });
    }
  };

  // Open Edit Class Modal
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

  // Handle Class Update
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
      refreshAllData();
    } else {
      toast({ variant: 'destructive', title: 'Error', description: res.message });
    }
  };

  // Handle Student Creation
  const handleCreateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentForm.name.trim() || !studentForm.contact1.trim() || !studentForm.branchId || !studentForm.classId || !studentForm.batchId) {
      toast({ variant: 'destructive', title: 'Error', description: 'Name, Contact 1, Branch, Class, and Batch are mandatory.' });
      return;
    }
    if (!studentForm.gender) {
      toast({ variant: 'destructive', title: 'Error', description: 'Please select Gender.' });
      return;
    }

    // Normalize dates back to ISO YYYY-MM-DD if entered as DD-MM-YYYY
    const toIso = (d?: string) => {
      if (!d) return '';
      const clean = d.trim().replace(/\//g, '-');
      const parts = clean.split('-');
      if (parts.length === 3 && parts[2].length === 4) {
        return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
      }
      return clean;
    };

    const isYearly = studentForm.feeType === 'yearly_package';
    const cMonths = studentForm.yearlyCourseMonths || 12;
    const effectiveYearlyStandard = Number(studentForm.yearlyStandardFee) || ((studentForm.baseFee || 0) * cMonths);
    const effectiveYearlyNet = studentForm.totalYearlyFee !== undefined && studentForm.totalYearlyFee > 0
      ? studentForm.totalYearlyFee
      : Math.round(effectiveYearlyStandard * (1 - (studentForm.scholarshipPercent || 0) / 100));

    const effectiveJoiningDate = studentForm.joiningDate?.trim() || todayDateWatermark;
    const effectiveDueDate = studentForm.dueDate?.trim() || defaultDueDateWatermark;

    let dueDay = Number(studentForm.dueDayOfMonth) || 5;
    if (effectiveDueDate) {
      const p = effectiveDueDate.split('-');
      if (p.length > 0 && !isNaN(parseInt(p[0], 10))) {
        dueDay = parseInt(p[0], 10);
      }
    }

    const effectiveRollNumber = studentForm.rollNumber?.trim() || generateNextStudentId(effectiveJoiningDate, students);

    const payload = {
      ...studentForm,
      additionalSubjects: studentForm.additionalSubjects || [],
      rollNumber: effectiveRollNumber,
      gender: (studentForm.gender || 'male') as 'male' | 'female',
      dueDayOfMonth: dueDay,
      joiningDate: toIso(effectiveJoiningDate) || effectiveJoiningDate,
      dob: toIso(studentForm.dob) || studentForm.dob,
      baseFee: isYearly ? Math.round(effectiveYearlyStandard / cMonths) : (studentForm.baseFee || 0),
      discountAmount: isYearly
        ? Math.round((effectiveYearlyStandard - effectiveYearlyNet) / cMonths)
        : (studentForm.discountAmount || 0),
      scholarshipPercent: studentForm.scholarshipPercent || 0,
      yearlyPackage: isYearly ? {
        totalYearlyFee: effectiveYearlyNet,
        courseMonths: cMonths,
        packageSubjects: studentForm.subjects,
      } : undefined,
    };

    const res = await createFeeStudent(payload);
    if (res.success) {
      toast({ title: 'Student Enrolled', description: res.message });
      setIsStudentModalOpen(false);
      setStudentForm({
        rollNumber: '',
        name: '',
        fatherName: '',
        fatherOccupation: '',
        dob: '',
        gender: '',
        bloodGroup: '',
        address: '',
        contact1: '',
        fatherContact: '',
        motherContact: '',
        contact2: '',
        branchId: selectedBranch && selectedBranch !== 'all' ? selectedBranch : '',
        classId: '',
        batchId: '',
        subjects: [],
        joiningDate: '',
        dueDate: '',
        dueDayOfMonth: 5,
        feeType: 'monthly',
        paymentCycleMonths: 1,
        baseFee: 0,
        scholarshipPercent: 0,
        discountAmount: 0,
        totalYearlyFee: 0,
        yearlyStandardFee: 0,
        yearlyCourseMonths: 12,
        additionalSubjects: [],
      });
      refreshAllData();
    } else {
      toast({ variant: 'destructive', title: 'Error', description: res.message });
    }
  };

  // Open Edit Student Modal with current values
  const openEditStudentModal = (student: FeeStudent) => {
    setEditingStudent(student);
    const cMonths = student.yearlyPackage?.courseMonths || 12;
    const yrTotal = student.yearlyPackage?.totalYearlyFee || ((student.netFee || student.baseFee) * cMonths);
    const yrStd = student.yearlyPackage?.standardMonthlyFee ? student.yearlyPackage.standardMonthlyFee * cMonths : (student.baseFee * cMonths);
    const formattedJoin = formatAdmDate(student.joiningDate);
    const formattedDob = formatAdmDate(student.dob);
    
    const today = new Date();
    const currentMonthStr = String(today.getMonth() + 1).padStart(2, '0');
    const currentYearStr = String(today.getFullYear());
    const dueDay = String(student.dueDayOfMonth || 5).padStart(2, '0');
    const computedDueDate = `${dueDay}-${currentMonthStr}-${currentYearStr}`;

    const isYr = student.feeType === 'yearly_package' || Boolean(student.yearlyPackage);
    const baseFee = student.baseFee || 0;
    const yearlyStandardFee = yrStd > 0 ? yrStd : (baseFee * cMonths);

    let discountAmount = student.discountAmount !== undefined ? student.discountAmount : 0;
    let totalYearlyFee = yrTotal;

    if (isYr) {
      if (student.yearlyPackage?.totalYearlyFee !== undefined && yearlyStandardFee > student.yearlyPackage.totalYearlyFee) {
        totalYearlyFee = student.yearlyPackage.totalYearlyFee;
        const yearlyDisc = yearlyStandardFee - totalYearlyFee;
        discountAmount = Math.round(yearlyDisc / cMonths);
      } else if (discountAmount > 0) {
        totalYearlyFee = Math.max(0, yearlyStandardFee - (discountAmount * cMonths));
      }
    } else {
      if (discountAmount === 0 && student.scholarshipPercent && baseFee > 0) {
        discountAmount = Math.round((baseFee * student.scholarshipPercent) / 100);
      }
      totalYearlyFee = Math.max(0, (baseFee - discountAmount) * cMonths);
    }

    const calculatedPct = isYr
      ? (yearlyStandardFee > 0 ? Number((((yearlyStandardFee - totalYearlyFee) / yearlyStandardFee) * 100).toFixed(1)) : (student.scholarshipPercent || 0))
      : (baseFee > 0 ? Number(((discountAmount / baseFee) * 100).toFixed(1)) : (student.scholarshipPercent || 0));

    setEditStudentForm({
      rollNumber: student.rollNumber || '',
      name: student.name,
      fatherName: student.fatherName,
      fatherOccupation: student.fatherOccupation || '',
      dob: formattedDob === '—' ? (student.dob || '') : formattedDob,
      gender: student.gender || 'male',
      bloodGroup: student.bloodGroup || '',
      address: student.address || '',
      contact1: student.contact1,
      fatherContact: student.fatherContact || '',
      motherContact: student.motherContact || student.contact2 || '',
      contact2: student.contact2 || '',
      branchId: student.branchId,
      classId: student.classId,
      batchId: student.batchId,
      subjects: student.subjects || [],
      joiningDate: formattedJoin === '—' ? (student.joiningDate || '') : formattedJoin,
      dueDate: computedDueDate,
      dueDayOfMonth: student.dueDayOfMonth || 5,
      feeType: student.feeType || 'monthly',
      paymentCycleMonths: student.paymentCycleMonths || 1,
      baseFee: baseFee,
      scholarshipPercent: calculatedPct,
      discountAmount: discountAmount,
      totalYearlyFee: totalYearlyFee,
      yearlyStandardFee: yearlyStandardFee,
      yearlyCourseMonths: cMonths,
      additionalSubjects: student.additionalSubjects || [],
    });
    setEditStudentSubjectTab('enrolled');
    setShowAddSubjectInput(false);
    setNewEditAddlSubjectName('');
    setNewEditAddlSubjectFee('');
    setIsEditStudentOpen(true);
  };

  // Handle Update Student Submission
  const handleUpdateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;
    if (!editStudentForm.name.trim() || !editStudentForm.contact1.trim() || !editStudentForm.classId || !editStudentForm.batchId) {
      toast({ variant: 'destructive', title: 'Error', description: 'Name, Contact 1, Class, and Batch are mandatory.' });
      return;
    }

    // Normalize dates back to ISO YYYY-MM-DD if entered as DD-MM-YYYY
    const toIso = (d?: string) => {
      if (!d) return '';
      const clean = d.trim().replace(/\//g, '-');
      const parts = clean.split('-');
      if (parts.length === 3 && parts[2].length === 4) {
        return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
      }
      return clean;
    };

    const isYearly = editStudentForm.feeType === 'yearly_package';
    const cMonths = editStudentForm.yearlyCourseMonths || 12;
    const effectiveYearlyStandard = Number(editStudentForm.yearlyStandardFee) || ((editStudentForm.baseFee || 0) * cMonths);
    const effectiveYearlyNet = editStudentForm.totalYearlyFee !== undefined && editStudentForm.totalYearlyFee > 0
      ? editStudentForm.totalYearlyFee
      : Math.round(effectiveYearlyStandard * (1 - (editStudentForm.scholarshipPercent || 0) / 100));

    let dueDay = Number(editStudentForm.dueDayOfMonth) || 5;
    if (editStudentForm.dueDate) {
      const p = editStudentForm.dueDate.split('-');
      if (p.length > 0 && !isNaN(parseInt(p[0], 10))) {
        dueDay = parseInt(p[0], 10);
      }
    }

    const payload = {
      ...editStudentForm,
      additionalSubjects: editStudentForm.additionalSubjects || [],
      dueDayOfMonth: dueDay,
      joiningDate: toIso(editStudentForm.joiningDate) || editStudentForm.joiningDate,
      dob: toIso(editStudentForm.dob) || editStudentForm.dob,
      baseFee: isYearly ? Math.round(effectiveYearlyStandard / cMonths) : (editStudentForm.baseFee || 0),
      discountAmount: isYearly
        ? Math.round((effectiveYearlyStandard - effectiveYearlyNet) / cMonths)
        : (editStudentForm.discountAmount || 0),
      scholarshipPercent: editStudentForm.scholarshipPercent || 0,
      yearlyPackage: isYearly ? {
        totalYearlyFee: effectiveYearlyNet,
        courseMonths: cMonths,
        packageSubjects: editStudentForm.subjects,
      } : undefined,
    };

    startTransition(async () => {
      const res = await updateFeeStudent(editingStudent.id, payload);
      if (res.success) {
        toast({ title: 'Student Updated', description: res.message });
        setIsEditStudentOpen(false);
        setEditingStudent(null);
        if (selectedStudentProfile && selectedStudentProfile.id === editingStudent.id && res.data) {
          setSelectedStudentProfile(res.data);
        }
        refreshAllData();
      } else {
        toast({ variant: 'destructive', title: 'Error', description: res.message });
      }
    });
  };

  // Handle Clear All Data
  const handleClearAllData = async () => {
    setIsResetConfirmOpen(false);
    const res = await clearAllFeeData();
    if (res.success) {
      toast({ title: 'Data Cleared', description: res.message });
      refreshAllData();
    } else {
      toast({ variant: 'destructive', title: 'Error', description: res.message });
    }
  };

  // Handle Fee Collection
  const openCollectFeeModal = (entry: FeeLedgerEntry & { student: FeeStudent }) => {
    const todayStr = new Date().toISOString().split('T')[0];
    const defaultYearly = (entry.student.baseFee || entry.netDueAmount) * 12;
    setCollectTarget(entry);
    setCollectForm({
      collectType: entry.student.feeType === 'yearly_package' ? 'yearly_package' : 'single',
      amount: entry.balanceAmount > 0 ? entry.balanceAmount : entry.netDueAmount,
      totalYearlyFee: entry.student.yearlyPackage?.totalYearlyFee || defaultYearly,
      yearlyCourseMonths: entry.student.yearlyPackage?.courseMonths || 12,
      paymentMode: '',
      transactionRef: '',
      remarks: '',
      paymentDate: todayStr,
    });
    setIsCollectFeeOpen(true);
  };

  // Direct Record Fee Payment
  const handleRecordPayment = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!collectTarget) return;

    if (!collectForm.paymentMode) {
      toast({
        variant: 'destructive',
        title: 'Payment Mode Required',
        description: 'Please select Mode of Payment (Cash or Online).',
      });
      return;
    }

    // Handle Yearly Package Collection
    if (collectForm.collectType === 'yearly_package') {
      const yearlyAmt = Number(collectForm.totalYearlyFee) || Number(collectForm.amount);
      if (!yearlyAmt || yearlyAmt <= 0) {
        toast({ variant: 'destructive', title: 'Invalid Amount', description: 'Please enter a valid yearly package amount.' });
        return;
      }
      setIsRecordingPayment(true);
      try {
        const res = await collectYearlyPackagePayment({
          studentId: collectTarget.studentId,
          totalYearlyFee: yearlyAmt,
          courseMonths: collectForm.yearlyCourseMonths || 12,
          paymentMode: collectForm.paymentMode,
          transactionRef: collectForm.transactionRef,
          remarks: collectForm.remarks,
          paymentDate: collectForm.paymentDate,
          collectedBy: 'Admin Desk',
        });
        if (res.success && res.receipt) {
          toast({ title: 'Yearly Package Recorded', description: res.message });
          setIsCollectFeeOpen(false);
          if (typeof document !== 'undefined') {
            document.body.style.pointerEvents = '';
          }
          setRecentReceipt(res.receipt);
          setIsReceiptOpen(true);
          refreshAllData();
        } else {
          toast({ variant: 'destructive', title: 'Payment Failed', description: res.message });
        }
      } catch (err: any) {
        toast({ variant: 'destructive', title: 'Error', description: err?.message || 'Failed to record yearly package' });
      } finally {
        setIsRecordingPayment(false);
      }
      return;
    }

    const amount = Number(collectForm.amount);
    if (!amount || amount <= 0) {
      toast({ variant: 'destructive', title: 'Invalid Amount', description: 'Please enter a valid amount greater than zero.' });
      return;
    }

    setIsRecordingPayment(true);
    try {
      const res = await collectFeePayment({
        studentId: collectTarget.studentId,
        month: collectTarget.month,
        amount,
        paymentMode: collectForm.paymentMode,
        transactionRef: collectForm.transactionRef,
        remarks: collectForm.remarks,
        paymentDate: collectForm.paymentDate,
        collectedBy: 'Admin Desk',
      });

      if (res.success && res.receipt) {
        toast({ title: 'Payment Recorded', description: res.message });
        setIsCollectFeeOpen(false);
        // Ensure body pointer-events is cleaned up immediately
        if (typeof document !== 'undefined') {
          document.body.style.pointerEvents = '';
        }
        setRecentReceipt(res.receipt);
        setIsReceiptOpen(true);
        refreshAllData();
      } else {
        toast({ variant: 'destructive', title: 'Payment Failed', description: res.message });
      }
    } catch (err: any) {
      toast({ variant: 'destructive', title: 'Error', description: err?.message || 'Failed to record payment' });
    } finally {
      setIsRecordingPayment(false);
    }
  };

  // Open Revert / Mark Unpaid Modal
  const openRevertModal = async (entry: FeeLedgerEntry & { student: FeeStudent }) => {
    setRevertTarget(entry);
    setRevertTargetPayments([]);
    setIsRevertModalOpen(true);
    try {
      const res = await getFeePayments({ studentId: entry.studentId, month: entry.month });
      if (res.success) {
        setRevertTargetPayments(res.data);
      }
    } catch (e) {
      console.error('Error fetching payments:', e);
    }
  };

  // Revert / Mark Entire Month Unpaid
  const handleMarkEntireMonthUnpaid = async () => {
    if (!revertTarget) return;
    setIsReverting(true);
    try {
      const res = await markMonthUnpaid(revertTarget.studentId, revertTarget.month);
      if (res.success) {
        toast({ title: 'Marked as Unpaid', description: res.message });
        setIsRevertModalOpen(false);
        setRevertTarget(null);
        setRevertTargetPayments([]);
        if (typeof document !== 'undefined') {
          document.body.style.pointerEvents = '';
        }
        refreshAllData();
      } else {
        toast({ variant: 'destructive', title: 'Action Failed', description: res.message });
      }
    } catch (err: any) {
      toast({ variant: 'destructive', title: 'Error', description: err?.message || 'Failed to mark unpaid' });
    } finally {
      setIsReverting(false);
    }
  };

  // Revert Single Payment Receipt
  const handleRevertSinglePayment = async (paymentId: string) => {
    setIsReverting(true);
    try {
      const res = await revertFeePayment(paymentId);
      if (res.success) {
        toast({ title: 'Payment Reverted', description: res.message });
        if (isRevertModalOpen && revertTarget) {
          const updatedRes = await getFeePayments({ studentId: revertTarget.studentId, month: revertTarget.month });
          if (updatedRes.success) {
            setRevertTargetPayments(updatedRes.data);
            if (updatedRes.data.length === 0) {
              setIsRevertModalOpen(false);
              setRevertTarget(null);
            }
          }
        }
        if (isReceiptOpen) {
          setIsReceiptOpen(false);
          setRecentReceipt(null);
        }
        setRevertPaymentTarget(null);
        if (typeof document !== 'undefined') {
          document.body.style.pointerEvents = '';
        }
        refreshAllData();
      } else {
        toast({ variant: 'destructive', title: 'Revert Failed', description: res.message });
      }
    } catch (err: any) {
      toast({ variant: 'destructive', title: 'Error', description: err?.message || 'Failed to revert payment' });
    } finally {
      setIsReverting(false);
    }
  };

  // Handle Update Collection / Payment Date
  const handleUpdatePaymentDateSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!editingPaymentDateTarget || !newPaymentDateInput) return;
    setIsUpdatingPaymentDate(true);
    try {
      const res = await updatePaymentDate(editingPaymentDateTarget.id, newPaymentDateInput);
      if (res.success) {
        toast({ title: 'Collection Date Updated', description: res.message });
        setEditingPaymentDateTarget(null);
        if (recentReceipt && recentReceipt.id === editingPaymentDateTarget.id && res.updatedPayment) {
          setRecentReceipt(res.updatedPayment);
        }
        refreshAllData();
      } else {
        toast({ variant: 'destructive', title: 'Error', description: res.message });
      }
    } catch (err: any) {
      toast({ variant: 'destructive', title: 'Error', description: err?.message || 'Failed to update payment date' });
    } finally {
      setIsUpdatingPaymentDate(false);
    }
  };

  // Handle Delete Confirmed
  const handleExecuteDelete = async () => {
    if (!deleteTarget) return;
    const { type, id, name } = deleteTarget;
    setDeleteTarget(null);

    let res: { success: boolean; message: string };
    if (type === 'class') res = await deleteFeeClass(id);
    else if (type === 'batch') res = await deleteFeeBatch(id);
    else res = await deleteFeeStudent(id);

    if (res.success) {
      toast({ title: 'Deleted', description: res.message });
      refreshAllData();
    } else {
      toast({ variant: 'destructive', title: 'Deletion Blocked', description: res.message });
    }
  };

  // Handle Student Status Toggle Confirmed
  const handleExecuteStatusToggle = async (mode: 'month_onwards' | 'all_months') => {
    if (!statusOptionsModal.student) return;
    const { student, targetStatus } = statusOptionsModal;
    setStatusOptionsModal({ isOpen: false, student: null, targetStatus: 'disabled' });

    const res = await toggleStudentStatus(student.id, targetStatus, {
      month: selectedMonth,
      mode,
    });
    if (res.success) {
      toast({ title: 'Status Updated', description: res.message });
      refreshAllData();
    } else {
      toast({ variant: 'destructive', title: 'Error', description: res.message });
    }
  };

  // Helper for Net Fee preview in student form
  const isStudentYearly = studentForm.feeType === 'yearly_package';
  const currentStudentYearlyStandard = studentForm.yearlyStandardFee || ((studentForm.baseFee || 0) * (studentForm.yearlyCourseMonths || 12));

  const currentStudentAddlFee = (studentForm.additionalSubjects || [])
    .filter(s => s.status !== 'removed')
    .reduce((sum, s) => sum + (Number(s.fee) || 0), 0);

  const previewDiscount = isStudentYearly
    ? (studentForm.totalYearlyFee !== undefined && currentStudentYearlyStandard > 0 && studentForm.totalYearlyFee < currentStudentYearlyStandard
        ? currentStudentYearlyStandard - studentForm.totalYearlyFee
        : ((studentForm.discountAmount || 0) * (studentForm.yearlyCourseMonths || 12)))
    : (studentForm.discountAmount !== undefined ? studentForm.discountAmount : Math.round((Number(studentForm.baseFee || 0) * Number(studentForm.scholarshipPercent || 0)) / 100));

  const previewNetFee = isStudentYearly
    ? (studentForm.totalYearlyFee !== undefined && studentForm.totalYearlyFee > 0
        ? studentForm.totalYearlyFee + (currentStudentAddlFee * (studentForm.yearlyCourseMonths || 12))
        : Math.max(0, currentStudentYearlyStandard - previewDiscount) + (currentStudentAddlFee * (studentForm.yearlyCourseMonths || 12)))
    : Math.max(0, Number(studentForm.baseFee || 0) - previewDiscount) + currentStudentAddlFee;

  // Helper for Net Fee preview in edit student form
  const isEditStudentYearly = editStudentForm.feeType === 'yearly_package';
  const currentEditStudentYearlyStandard = editStudentForm.yearlyStandardFee || ((editStudentForm.baseFee || 0) * (editStudentForm.yearlyCourseMonths || 12));

  const currentEditStudentAddlFee = (editStudentForm.additionalSubjects || [])
    .filter(s => s.status !== 'removed')
    .reduce((sum, s) => sum + (Number(s.fee) || 0), 0);

  const editPreviewDiscount = isEditStudentYearly
    ? (editStudentForm.totalYearlyFee !== undefined && currentEditStudentYearlyStandard > 0 && editStudentForm.totalYearlyFee < currentEditStudentYearlyStandard
        ? currentEditStudentYearlyStandard - editStudentForm.totalYearlyFee
        : ((editStudentForm.discountAmount || 0) * (editStudentForm.yearlyCourseMonths || 12)))
    : (editStudentForm.discountAmount !== undefined ? editStudentForm.discountAmount : Math.round((Number(editStudentForm.baseFee || 0) * Number(editStudentForm.scholarshipPercent || 0)) / 100));

  const editPreviewNetFee = isEditStudentYearly
    ? (editStudentForm.totalYearlyFee !== undefined && editStudentForm.totalYearlyFee > 0
        ? editStudentForm.totalYearlyFee + (currentEditStudentAddlFee * (editStudentForm.yearlyCourseMonths || 12))
        : Math.max(0, currentEditStudentYearlyStandard - editPreviewDiscount) + (currentEditStudentAddlFee * (editStudentForm.yearlyCourseMonths || 12)))
    : Math.max(0, Number(editStudentForm.baseFee || 0) - editPreviewDiscount) + currentEditStudentAddlFee;

  // Additional Subjects Handlers for Enroll Student Form
  const handleAddEnrollAddlSubject = (nameToAdd?: string, feeToAdd?: number) => {
    const rawName = (nameToAdd !== undefined ? nameToAdd : newEnrollAddlSubjectName).trim();
    if (!rawName) {
      toast({ title: 'Notice', description: 'Please enter subject name.' });
      return;
    }
    const name = toTitleCase(rawName);
    const fee = feeToAdd !== undefined ? feeToAdd : (Number(newEnrollAddlSubjectFee) || 0);

    if ((studentForm.additionalSubjects || []).some(s => s.name.toLowerCase() === name.toLowerCase())) {
      toast({ title: 'Notice', description: `"${name}" is already added as an additional subject.` });
      return;
    }

    const newSub: AdditionalSubject = {
      id: `addl-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      name,
      fee,
      addedMonth: studentForm.joiningDate ? studentForm.joiningDate.slice(0, 7) : (selectedMonth || '2026-11'),
      status: 'active',
      addedAt: new Date().toISOString(),
    };

    setStudentForm(prev => ({
      ...prev,
      additionalSubjects: [...(prev.additionalSubjects || []), newSub],
    }));
    setNewEnrollAddlSubjectName('');
    setNewEnrollAddlSubjectFee('');
  };

  const handleUpdateEnrollAddlSubject = (id: string, field: 'name' | 'fee', value: any) => {
    setStudentForm(prev => ({
      ...prev,
      additionalSubjects: (prev.additionalSubjects || []).map(s => {
        if (s.id === id) {
          return {
            ...s,
            [field]: field === 'fee' ? (Number(value) || 0) : value,
          };
        }
        return s;
      }),
    }));
  };

  const handleRemoveEnrollAddlSubject = (id: string) => {
    setStudentForm(prev => ({
      ...prev,
      additionalSubjects: (prev.additionalSubjects || []).filter(s => s.id !== id),
    }));
  };

  // Additional Subjects Handlers for Edit Student Form
  const handleAddEditAddlSubject = (nameToAdd?: string, feeToAdd?: number) => {
    const rawName = (nameToAdd !== undefined ? nameToAdd : newEditAddlSubjectName).trim();
    if (!rawName) {
      toast({ title: 'Notice', description: 'Please enter subject name.' });
      return;
    }
    const name = toTitleCase(rawName);
    const fee = feeToAdd !== undefined ? feeToAdd : (Number(newEditAddlSubjectFee) || 0);

    if ((editStudentForm.additionalSubjects || []).some(s => s.name.toLowerCase() === name.toLowerCase() && s.status !== 'removed')) {
      toast({ title: 'Notice', description: `"${name}" is already added as an additional subject.` });
      return;
    }

    const newSub: AdditionalSubject = {
      id: `addl-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      name,
      fee,
      addedMonth: selectedMonth || '2026-11',
      status: 'active',
      addedAt: new Date().toISOString(),
    };

    setEditStudentForm(prev => ({
      ...prev,
      additionalSubjects: [...(prev.additionalSubjects || []), newSub],
    }));
    setNewEditAddlSubjectName('');
    setNewEditAddlSubjectFee('');
  };

  const handleUpdateEditAddlSubject = (id: string, field: 'name' | 'fee', value: any) => {
    setEditStudentForm(prev => ({
      ...prev,
      additionalSubjects: (prev.additionalSubjects || []).map(s => {
        if (s.id === id) {
          return {
            ...s,
            [field]: field === 'fee' ? (Number(value) || 0) : value,
          };
        }
        return s;
      }),
    }));
  };

  const handleToggleRemoveEditAddlSubject = (id: string) => {
    setEditStudentForm(prev => ({
      ...prev,
      additionalSubjects: (prev.additionalSubjects || []).map(s => {
        if (s.id === id) {
          const isCurrentlyActive = s.status !== 'removed';
          return {
            ...s,
            status: isCurrentlyActive ? 'removed' : 'active',
            removedMonth: isCurrentlyActive ? (selectedMonth || '2026-11') : undefined,
            removedAt: isCurrentlyActive ? new Date().toISOString() : undefined,
          };
        }
        return s;
      }),
    }));
  };

  // Toggle Fee Type between Monthly and Yearly in Student Form
  const handleToggleStudentFeeType = (mode: 'monthly' | 'yearly_package') => {
    const selectedB = batches.find(b => b.id === studentForm.batchId);
    const selectedC = classes.find(c => c.id === studentForm.classId);

    const bMonthly = (selectedB && typeof selectedB.monthlyFee === 'number' && selectedB.monthlyFee > 0)
      ? selectedB.monthlyFee
      : (selectedC?.defaultMonthlyFee || 0);

    const cMonths = studentForm.yearlyCourseMonths || 12;

    const bYearly = (selectedB && typeof selectedB.courseFee === 'number' && selectedB.courseFee > 0)
      ? selectedB.courseFee
      : (bMonthly * cMonths);

    if (mode === 'yearly_package') {
      const yearlyStd = bYearly > 0 ? bYearly : (studentForm.yearlyStandardFee || ((studentForm.baseFee || 0) * cMonths));
      const currentMonthlyDisc = studentForm.discountAmount || 0;
      const yearlyDisc = Math.min(yearlyStd, currentMonthlyDisc * cMonths);
      const net = Math.max(0, yearlyStd - yearlyDisc);
      const pct = yearlyStd > 0 ? Number(((yearlyDisc / yearlyStd) * 100).toFixed(1)) : 0;

      setStudentForm(prev => ({
        ...prev,
        feeType: 'yearly_package',
        yearlyStandardFee: yearlyStd,
        totalYearlyFee: net,
        yearlyCourseMonths: cMonths,
        baseFee: Math.round(yearlyStd / cMonths),
        discountAmount: currentMonthlyDisc,
        scholarshipPercent: pct,
      }));
    } else {
      const stdMonth = bMonthly > 0 ? bMonthly : (studentForm.baseFee || (studentForm.yearlyStandardFee ? Math.round(studentForm.yearlyStandardFee / cMonths) : 0));
      const currentYearlyStd = studentForm.yearlyStandardFee || (stdMonth * cMonths);
      const currentYearlyDisc = (studentForm.totalYearlyFee !== undefined && currentYearlyStd > studentForm.totalYearlyFee)
        ? (currentYearlyStd - studentForm.totalYearlyFee)
        : ((studentForm.discountAmount || 0) * cMonths);
      const monthlyDisc = Math.min(stdMonth, Math.round(currentYearlyDisc / cMonths));
      const net = Math.max(0, stdMonth - monthlyDisc);
      const pct = stdMonth > 0 ? Number(((monthlyDisc / stdMonth) * 100).toFixed(1)) : 0;

      setStudentForm(prev => ({
        ...prev,
        feeType: 'monthly',
        baseFee: stdMonth,
        discountAmount: monthlyDisc,
        yearlyStandardFee: stdMonth * cMonths,
        totalYearlyFee: net * cMonths,
        scholarshipPercent: pct,
      }));
    }
  };

  // Toggle Fee Type between Monthly and Yearly in Edit Student Form
  const handleToggleEditStudentFeeType = (mode: 'monthly' | 'yearly_package') => {
    const selectedB = batches.find(b => b.id === editStudentForm.batchId);
    const selectedC = classes.find(c => c.id === editStudentForm.classId);

    const bMonthly = (selectedB && typeof selectedB.monthlyFee === 'number' && selectedB.monthlyFee > 0)
      ? selectedB.monthlyFee
      : (selectedC?.defaultMonthlyFee || 0);

    const cMonths = editStudentForm.yearlyCourseMonths || 12;

    const bYearly = (selectedB && typeof selectedB.courseFee === 'number' && selectedB.courseFee > 0)
      ? selectedB.courseFee
      : (bMonthly * cMonths);

    if (mode === 'yearly_package') {
      const yearlyStd = bYearly > 0 ? bYearly : (editStudentForm.yearlyStandardFee || ((editStudentForm.baseFee || 0) * cMonths));
      const currentMonthlyDisc = editStudentForm.discountAmount || 0;
      const yearlyDisc = Math.min(yearlyStd, currentMonthlyDisc * cMonths);
      const net = Math.max(0, yearlyStd - yearlyDisc);
      const pct = yearlyStd > 0 ? Number(((yearlyDisc / yearlyStd) * 100).toFixed(1)) : 0;

      setEditStudentForm(prev => ({
        ...prev,
        feeType: 'yearly_package',
        yearlyStandardFee: yearlyStd,
        totalYearlyFee: net,
        yearlyCourseMonths: cMonths,
        baseFee: Math.round(yearlyStd / cMonths),
        discountAmount: currentMonthlyDisc,
        scholarshipPercent: pct,
      }));
    } else {
      const stdMonth = bMonthly > 0 ? bMonthly : (editStudentForm.baseFee || (editStudentForm.yearlyStandardFee ? Math.round(editStudentForm.yearlyStandardFee / cMonths) : 0));
      const currentYearlyStd = editStudentForm.yearlyStandardFee || (stdMonth * cMonths);
      const currentYearlyDisc = (editStudentForm.totalYearlyFee !== undefined && currentYearlyStd > editStudentForm.totalYearlyFee)
        ? (currentYearlyStd - editStudentForm.totalYearlyFee)
        : ((editStudentForm.discountAmount || 0) * cMonths);
      const monthlyDisc = Math.min(stdMonth, Math.round(currentYearlyDisc / cMonths));
      const net = Math.max(0, stdMonth - monthlyDisc);
      const pct = stdMonth > 0 ? Number(((monthlyDisc / stdMonth) * 100).toFixed(1)) : 0;

      setEditStudentForm(prev => ({
        ...prev,
        feeType: 'monthly',
        baseFee: stdMonth,
        discountAmount: monthlyDisc,
        yearlyStandardFee: stdMonth * cMonths,
        totalYearlyFee: net * cMonths,
        scholarshipPercent: pct,
      }));
    }
  };

  // Helper: Auto-capitalizes first letter of each word (Title Case)
  const toTitleCase = (str: string): string => {
    if (!str) return '';
    return str.replace(/(?:^|\s|[,.\-\/])([a-z])/g, match => match.toUpperCase());
  };

  // Helper: Smart Date Input Typing (DD-MM-YYYY auto dash & zero-padding)
  const handleDateTyping = (input: string, prev: string = ''): string => {
    if (input.length < prev.length) {
      if (prev.endsWith('-') && !input.endsWith('-')) {
        return input.slice(0, -1);
      }
      return input;
    }

    if (input.endsWith('-')) {
      const raw = input.slice(0, -1).replace(/\D/g, '');
      if (raw.length === 1) return `0${raw}-`;
      if (raw.length === 3) {
        const d = raw.slice(0, 2);
        const m = raw.slice(2, 3);
        return `${d}-0${m}-`;
      }
    }

    const digits = input.replace(/\D/g, '').slice(0, 8);
    if (!digits) return '';

    if (digits.length === 1) {
      if (parseInt(digits, 10) > 3) {
        return `0${digits}-`;
      }
      return digits;
    }

    let day = digits.slice(0, 2);
    let dNum = parseInt(day, 10);
    if (dNum > 31) day = '31';
    if (dNum === 0) day = '01';

    if (digits.length === 2) {
      return `${day}-`;
    }

    if (digits.length === 3) {
      const m1 = digits[2];
      if (parseInt(m1, 10) > 1) {
        return `${day}-0${m1}-`;
      }
      return `${day}-${m1}`;
    }

    let month = digits.slice(2, 4);
    let mNum = parseInt(month, 10);
    if (mNum > 12) month = '12';
    if (mNum === 0 && month.length === 2) month = '01';

    if (digits.length === 4) {
      return `${day}-${month}-`;
    }

    const year = digits.slice(4, 8);
    return `${day}-${month}-${year}`;
  };

  // Helper: Normalizes incomplete single digit date on blur to DD-MM-YYYY
  const normalizeDateBlur = (val: string): string => {
    if (!val) return '';
    const parts = val.split('-');
    if (parts.length === 3) {
      const d = parts[0].padStart(2, '0');
      const m = parts[1].padStart(2, '0');
      let y = parts[2];
      if (y.length === 2) y = `20${y}`;
      if (y.length === 4) return `${d}-${m}-${y}`;
    }
    return val;
  };

  // Helper: Auto-generates student ID matching date format DDMMYYYY-101, 102...
  const generateNextStudentId = (joiningDateStr?: string, studentsList: FeeStudent[] = []): string => {
    const now = new Date();
    let day = String(now.getDate()).padStart(2, '0');
    let month = String(now.getMonth() + 1).padStart(2, '0');
    let year = String(now.getFullYear());

    if (joiningDateStr) {
      const clean = joiningDateStr.trim().replace(/\//g, '-');
      const parts = clean.split('-');
      if (parts.length === 3) {
        if (parts[0].length === 4) {
          year = parts[0];
          month = parts[1].padStart(2, '0');
          day = parts[2].padStart(2, '0');
        } else {
          day = parts[0].padStart(2, '0');
          month = parts[1].padStart(2, '0');
          year = parts[2];
        }
      }
    }

    const datePrefix = `${day}${month}${year}`;
    const prefixMatch = `${datePrefix}-`;
    let maxSeq = 100;

    for (const s of studentsList) {
      if (s.rollNumber && s.rollNumber.startsWith(prefixMatch)) {
        const rest = s.rollNumber.slice(prefixMatch.length);
        const num = parseInt(rest, 10);
        if (!isNaN(num) && num > maxSeq) {
          maxSeq = num;
        }
      }
    }

    return `${datePrefix}-${maxSeq + 1}`;
  };

  // Dynamic watermarks for admission
  const todayDateWatermark = React.useMemo(() => {
    const today = new Date();
    return `${String(today.getDate()).padStart(2, '0')}-${String(today.getMonth() + 1).padStart(2, '0')}-${today.getFullYear()}`;
  }, []);

  const defaultDueDateWatermark = React.useMemo(() => {
    const today = new Date();
    return `05-${String(today.getMonth() + 1).padStart(2, '0')}-${today.getFullYear()}`;
  }, []);

  const studentIdWatermark = React.useMemo(() => {
    const joinDateToUse = studentForm.joiningDate?.trim() || todayDateWatermark;
    const clean = joinDateToUse.replace(/\//g, '-');
    const parts = clean.split('-');
    let day = String(new Date().getDate()).padStart(2, '0');
    let month = String(new Date().getMonth() + 1).padStart(2, '0');
    let year = String(new Date().getFullYear());

    if (parts.length === 3) {
      if (parts[0].length === 4) {
        year = parts[0];
        month = parts[1].padStart(2, '0');
        day = parts[2].padStart(2, '0');
      } else {
        day = parts[0].padStart(2, '0');
        month = parts[1].padStart(2, '0');
        year = parts[2].length === 2 ? `20${parts[2]}` : parts[2];
      }
    }
    return `${day}${month}${year}-`;
  }, [studentForm.joiningDate, todayDateWatermark]);

  // Scope for Students tab: 'month' (shows only students active in selectedMonth) or 'all' (shows all registered students)
  const [studentMonthScope, setStudentMonthScope] = useState<'month' | 'all'>('month');

  // Selected Month Label
  const selectedMonthLabel = React.useMemo(() => {
    return monthOptions.find(m => m.value === selectedMonth)?.label || selectedMonth;
  }, [monthOptions, selectedMonth]);

  // Branch Alphabetical Sequence: Budh Vihar -> Krishan Vihar -> Mangol Puri -> Mukherjee Nagar
  const BRANCH_ALPHABETICAL_ORDER = ['budh-vihar', 'krishan-vihar', 'mangolpuri', 'mukherjee-nagar'];
  const sortBranchesAlphabetical = <T extends { branchId?: string; id?: string }>(list: T[]): T[] => {
    return [...list].sort((a, b) => {
      const aId = (a.branchId || a.id) === 'mangol-puri' ? 'mangolpuri' : (a.branchId || a.id || '');
      const bId = (b.branchId || b.id) === 'mangol-puri' ? 'mangolpuri' : (b.branchId || b.id || '');
      const aIdx = BRANCH_ALPHABETICAL_ORDER.indexOf(aId);
      const bIdx = BRANCH_ALPHABETICAL_ORDER.indexOf(bId);
      return (aIdx === -1 ? 99 : aIdx) - (bIdx === -1 ? 99 : bIdx);
    });
  };

  // Branch Report View Mode ('monthly' vs 'yearly')
  const [branchReportMode, setBranchReportMode] = useState<'monthly' | 'yearly'>('monthly');
  const [yearlyReport, setYearlyReport] = useState<BranchYearlyReportResult | null>(initialYearlyReport || null);
  const [isLoadingYearly, setIsLoadingYearly] = useState<boolean>(false);

  // Manual / Premium Calendar Date Range Selection State
  // Financial Year default is 01-Apr-2026 to 31-Mar-2027
  const [customStartDate, setCustomStartDate] = useState<string>('');
  const [customEndDate, setCustomEndDate] = useState<string>('');
  const [isCalendarOpen, setIsCalendarOpen] = useState<boolean>(false);

  const formatDisplayDate = (dStr: string) => {
    if (!dStr) return '';
    const [y, m, d] = dStr.split('-').map(Number);
    const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    const monthName = monthNames[m - 1] || 'NOV';
    const dayStr = String(d).padStart(2, '0');
    return `${dayStr}-${monthName}-${y}`;
  };

  const activeDateRangeLabel = React.useMemo(() => {
    if (customStartDate && customEndDate) {
      return `FROM ${formatDisplayDate(customStartDate)} TO ${formatDisplayDate(customEndDate)}`;
    }
    if (branchReportMode === 'yearly') {
      return 'FROM 01-APR-2026 TO 31-MAR-2027';
    }
    // Monthly Default
    const targetMonth = selectedMonth || initialMonth || '2026-11';
    const [yearStr, monthStr] = targetMonth.split('-');
    const year = parseInt(yearStr, 10);
    const month = parseInt(monthStr, 10);
    const lastDay = new Date(year, month, 0).getDate();
    const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    const monthName = monthNames[month - 1] || 'NOV';
    const lastDayStr = String(lastDay).padStart(2, '0');
    return `FROM 01-${monthName}-${year} TO ${lastDayStr}-${monthName}-${year}`;
  }, [customStartDate, customEndDate, branchReportMode, selectedMonth, initialMonth]);

  // Fetch real-time data when in reports tab or switching branch report mode
  useEffect(() => {
    let isMounted = true;
    if (activeTab === 'reports' || branchReportMode === 'yearly') {
      setIsLoadingYearly(true);
      getBranchYearlyReport('2026-27')
        .then(res => {
          if (isMounted && res.success) {
            setYearlyReport(res.data);
          }
        })
        .catch(err => console.error('Error fetching yearly branch report:', err))
        .finally(() => {
          if (isMounted) setIsLoadingYearly(false);
        });

      if (activeTab === 'reports') {
        refreshAllData(selectedMonth, selectedBranch);
      }
    }
    return () => {
      isMounted = false;
    };
  }, [activeTab, branchReportMode]);

  // Students excluded for current month
  const excludedStudentsForMonth = React.useMemo(() => {
    return students.filter(s => {
      if (selectedBranch !== 'all' && s.branchId !== selectedBranch) return false;
      return s.excludedMonths?.includes(selectedMonth);
    });
  }, [students, selectedBranch, selectedMonth]);

  // Open Create Class Modal (sets default branch if a specific branch is selected, or leaves empty if 'all')
  const openCreateClassModal = () => {
    setClassForm({
      name: '',
      code: '',
      division: '',
      branchId: selectedBranch && selectedBranch !== 'all' ? selectedBranch : '',
      academicSession: '2026-27',
      description: '',
      defaultMonthlyFee: 0,
    });
    setIsClassModalOpen(true);
  };

  // Sync Create Class modal branch with currently active branch filter
  useEffect(() => {
    if (isClassModalOpen) {
      if (selectedBranch && selectedBranch !== 'all') {
        setClassForm(prev => ({
          ...prev,
          branchId: selectedBranch,
        }));
      }
    }
  }, [isClassModalOpen, selectedBranch]);

  // Open Create Student Modal with clean defaults and dynamic watermarks
  const openCreateStudentModal = () => {
    setIsCustomRollNumber(false);

    setStudentForm({
      rollNumber: '',
      name: '',
      fatherName: '',
      fatherOccupation: '',
      dob: '',
      gender: '',
      bloodGroup: '',
      address: '',
      contact1: '',
      fatherContact: '',
      motherContact: '',
      contact2: '',
      branchId: selectedBranch && selectedBranch !== 'all' ? selectedBranch : '',
      classId: '',
      batchId: '',
      subjects: [],
      joiningDate: '',
      dueDate: '',
      dueDayOfMonth: 5,
      feeType: 'monthly',
      paymentCycleMonths: 1,
      baseFee: 0,
      scholarshipPercent: 0,
      discountAmount: 0,
      totalYearlyFee: 0,
      yearlyStandardFee: 0,
      yearlyCourseMonths: 12,
    });
    setIsStudentModalOpen(true);
  };

  // Open Create Batch Modal with clean defaults (auto-selects class if only 1 exists)
  const openCreateBatchModal = (initialClassId?: string) => {
    const available = filteredClasses.length > 0 ? filteredClasses : classes;
    const targetClassId = initialClassId || (available.length === 1 ? available[0].id : (classes.length === 1 ? classes[0].id : ''));
    const matchedClass = classes.find(c => c.id === targetClassId);
    const defaultBranch = matchedClass?.branchId || (selectedBranch && selectedBranch !== 'all' ? selectedBranch : (classes[0]?.branchId || 'mukherjee-nagar'));
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
    setEditingBatchSubIdx(null);
    setIsCustomBatchFee(false);
    setIsBatchModalOpen(true);
  };

  // Handle student delete option choice (month_only vs all_months)
  const handleDeleteStudentChoice = async (mode: 'month_only' | 'all_months') => {
    if (!studentDeleteModal.student) return;
    const student = studentDeleteModal.student;
    const month = selectedMonth;
    setStudentDeleteModal({ isOpen: false, student: null, source: 'students' });

    startTransition(async () => {
      if (mode === 'month_only') {
        const res = await deleteStudentFromMonth(student.id, month);
        if (res.success) {
          toast({ title: 'Removed from Month', description: res.message });
          if (selectedStudentProfile?.id === student.id) {
            setSelectedStudentProfile(null);
          }
          refreshAllData();
        } else {
          toast({ variant: 'destructive', title: 'Error', description: res.message });
        }
      } else {
        const res = await deleteFeeStudent(student.id);
        if (res.success) {
          toast({ title: 'Student Deleted', description: res.message });
          if (selectedStudentProfile?.id === student.id) {
            setSelectedStudentProfile(null);
          }
          refreshAllData();
        } else {
          toast({ variant: 'destructive', title: 'Error', description: res.message });
        }
      }
    });
  };

  // Restore student to month handler
  const handleRestoreStudent = async (studentId: string, month: string) => {
    startTransition(async () => {
      const res = await restoreStudentToMonth(studentId, month);
      if (res.success) {
        toast({ title: 'Student Restored', description: res.message });
        refreshAllData();
      } else {
        toast({ variant: 'destructive', title: 'Error', description: res.message });
      }
    });
  };

  // Filtered classes matching active branch selection, arranged by order number
  const filteredClasses = React.useMemo(() => {
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
  }, [classes, selectedBranch]);

  // Filtered batches for student directory filter (respects selected branch & class filter)
  const availableBatchesForStudentFilter = React.useMemo(() => {
    let list = batches;
    if (selectedBranch && selectedBranch !== 'all') {
      list = list.filter(
        b =>
          b.branchId === selectedBranch ||
          (selectedBranch === 'mangolpuri' && b.branchId === 'mangol-puri') ||
          (selectedBranch === 'mangol-puri' && b.branchId === 'mangolpuri') ||
          classes.some(c => c.id === b.classId && (c.branchId === selectedBranch || (selectedBranch === 'mangolpuri' && c.branchId === 'mangol-puri')))
      );
    }
    if (classFilter !== 'all') {
      list = list.filter(b => b.classId === classFilter);
    }
    return [...list].sort((a, b) => {
      const ordA = a.order !== undefined && a.order !== null ? Number(a.order) : 999999;
      const ordB = b.order !== undefined && b.order !== null ? Number(b.order) : 999999;
      if (ordA !== ordB) return ordA - ordB;
      return a.name.localeCompare(b.name, undefined, { numeric: true });
    });
  }, [batches, selectedBranch, classFilter, classes]);

  const formatAdmDate = (d?: string) => {
    if (!d) return '—';
    const pure = d.split('T')[0];
    const parts = pure.split('-');
    if (parts.length === 3 && parts[0].length === 4) {
      return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
    return pure;
  };

  const getOverdueDays = (dueDateStr?: string) => {
    if (!dueDateStr) return 0;
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const pure = dueDateStr.split('T')[0];
      const parts = pure.split('-');
      if (parts.length === 3) {
        const year = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        const day = parseInt(parts[2], 10);
        const dueDate = new Date(year, month, day);
        dueDate.setHours(0, 0, 0, 0);
        const diffMs = today.getTime() - dueDate.getTime();
        return Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
      }
    } catch {
      return 0;
    }
    return 0;
  };

  // Filtered Students (Respects admission date, month exclusions, and month status when in 'month' scope)
  const filteredStudents = students.filter(s => {
    if (selectedBranch !== 'all' && s.branchId !== selectedBranch) return false;
    if (classFilter !== 'all' && s.classId !== classFilter) return false;
    if (batchFilter !== 'all' && s.batchId !== batchFilter) return false;
    
    const effectiveStatus = (studentMonthScope === 'month' && selectedMonth)
      ? getStudentStatusForMonth(s, selectedMonth)
      : s.status;
    if (statusFilter !== 'all' && effectiveStatus !== statusFilter) return false;

    // Month-based filtering: Student only shows from admission month onwards, and not if excluded in this month
    if (studentMonthScope === 'month' && selectedMonth) {
      const jMonth = (s.joiningDate || '2026-11-01').slice(0, 7);
      if (jMonth > selectedMonth) return false;
      if (s.excludedMonths?.includes(selectedMonth)) return false;
    }

    if (studentSearch.trim()) {
      const q = studentSearch.toLowerCase().trim();
      return (
        s.name.toLowerCase().includes(q) ||
        s.rollNumber.toLowerCase().includes(q) ||
        s.fatherName.toLowerCase().includes(q) ||
        s.contact1.includes(q) ||
        (s.fatherContact && s.fatherContact.includes(q)) ||
        (s.motherContact && s.motherContact.includes(q)) ||
        (s.contact2 && s.contact2.includes(q))
      );
    }
    return true;
  });

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Sticky Deep Dark Navy App Header with Controls in ONE Line */}
      <header className="sticky top-0 z-40 w-full bg-[#071942] border-b border-white/[0.08] shadow-[0_2px_12px_rgba(7,25,66,0.25)]">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-3 sm:px-6 lg:px-8 py-2 sm:py-2.5 gap-2 sm:gap-4">
          {/* Left: Original IDL Brand Logo (White with Yellow Dot) & System Title */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <Link href="/admin/fees" className="flex items-center gap-2 sm:gap-3 group">
              <img
                src="/idllogo-white.png"
                alt="IDL Education"
                className="h-8 sm:h-10 w-auto object-contain shrink-0 group-hover:opacity-95 transition-opacity"
              />
              <div className="h-6 sm:h-7 w-px bg-white/30 shrink-0" />
              <div className="flex flex-col justify-center leading-none">
                <span className="text-white font-extrabold text-sm sm:text-base md:text-[17px] lg:text-lg tracking-tight whitespace-nowrap">
                  Fee Management
                </span>
                <span className="text-emerald-400 font-semibold text-[7.5px] sm:text-[8px] md:text-[8.5px] tracking-tight whitespace-nowrap flex items-center gap-1 mt-0.5">
                  <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                  Live Fee Management System
                </span>
              </div>
            </Link>
          </div>

          {/* Center: The 4 Controls in ONE Line (Pure Icon + Text, No Box, No Background, No Outline) */}
          <div className="flex items-center flex-nowrap gap-1.5 sm:gap-3 md:gap-4 overflow-x-auto no-scrollbar py-0.5 shrink min-w-0 max-w-[130px] sm:max-w-none">
            {/* 1. Branch Selector */}
            <div className="flex items-center gap-1.5 px-1 py-0.5 hover:opacity-80 transition-opacity cursor-pointer group shrink-0">
              <Building2 className="w-3.5 h-3.5 text-blue-300 shrink-0" />
              <Select value={selectedBranch || 'none'} onValueChange={(val) => setSelectedBranch(val === 'none' ? '' : val)}>
                <SelectTrigger className="h-6 border-0 bg-transparent text-xs font-semibold text-white/95 shadow-none px-0 gap-1 hover:text-white transition-colors focus:bg-transparent focus:outline-none focus:ring-0 focus:ring-offset-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 ring-0 ring-offset-0 outline-none">
                  <SelectValue placeholder="Select Branch">
                    {!selectedBranch || selectedBranch === 'none'
                      ? 'Select Branch'
                      : selectedBranch === 'all'
                      ? 'All Branches'
                      : IDL_BRANCHES.find(b => b.id === selectedBranch)?.name || 'Select Branch'}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                  <SelectItem value="none" className="text-xs text-slate-500">
                    Select Branch
                  </SelectItem>
                  <SelectItem value="all" className="text-xs font-bold text-[#2864E8]">
                    🌐 All Branches
                  </SelectItem>
                  {IDL_BRANCHES.filter(b => b.id !== 'all').map(b => (
                    <SelectItem key={b.id} value={b.id} className="text-xs font-medium">
                      🏢 {b.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* 2. Date / Month Selector */}
            <div className="flex items-center gap-1.5 px-1 py-0.5 hover:opacity-80 transition-opacity cursor-pointer group shrink-0">
              <Calendar className="w-3.5 h-3.5 text-blue-300 shrink-0" />
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger className="h-6 border-0 bg-transparent text-xs font-semibold text-white/95 shadow-none px-0 gap-1 hover:text-white transition-colors focus:bg-transparent focus:outline-none focus:ring-0 focus:ring-offset-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 ring-0 ring-offset-0 outline-none">
                  <SelectValue placeholder="Select Month" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                  {monthOptions.map(m => (
                    <SelectItem key={m.value} value={m.value} className="text-xs font-medium">
                      {m.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* 3. Sync (Scan) Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => refreshAllData()}
              disabled={isPending}
              className="h-6 px-1.5 sm:px-2 bg-transparent hover:bg-transparent hover:opacity-80 text-white/90 hover:text-white text-xs font-semibold gap-1.5 transition-all shadow-none border-0 shrink-0 focus:outline-none focus:ring-0 focus:ring-offset-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 ring-0 ring-offset-0 outline-none cursor-pointer"
              title="Refresh fee data"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-blue-300 ${isPending ? 'animate-spin' : ''}`} />
              <span>Sync</span>
            </Button>

            {/* 4. Reset Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsResetConfirmOpen(true)}
              className="h-6 px-1.5 sm:px-2 bg-transparent hover:bg-transparent hover:opacity-80 text-rose-300/90 hover:text-rose-200 text-xs font-semibold gap-1.5 transition-all shadow-none border-0 shrink-0 focus:outline-none focus:ring-0 focus:ring-offset-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 ring-0 ring-offset-0 outline-none cursor-pointer"
              title="Clear all dummy/test data and start fresh"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Reset</span>
            </Button>
          </div>

          {/* Right: Admin Dashboard Link */}
          <div className="flex items-center shrink-0">
            <Button
              asChild
              variant="outline"
              size="sm"
              className="h-8 px-2.5 sm:px-3 rounded-xl border-white/20 bg-white/10 hover:bg-white/20 hover:border-white/30 text-white text-xs font-semibold transition-all shadow-xs shrink-0 focus:outline-none focus:ring-0 focus:ring-offset-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 ring-0 ring-offset-0 outline-none"
            >
              <Link href="/admin/dashboard" className="flex items-center gap-1.5">
                <ArrowLeft className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Admin Dashboard</span>
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="container mx-auto p-4 sm:p-6 lg:p-8 max-w-7xl flex-1 space-y-6 pb-12">
        {/* TOP FINANCIAL METRICS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4">
        {/* 1. Expected Fees */}
        <Card className="rounded-2xl border border-[#E9EEF5] dark:border-slate-800 bg-white dark:bg-slate-900 shadow-[0_1px_3px_rgba(15,23,42,0.03)] hover:border-slate-300/80 dark:hover:border-slate-700 transition-all h-full flex flex-col justify-between">
          <CardContent className="p-3.5 sm:p-4 flex flex-col justify-between h-full">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0" />
              <span className="text-[11.5px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-[0.4px]">
                Expected ({stats.currentMonthLabel?.split(' ')[0]})
              </span>
            </div>
            <div className="text-[24px] sm:text-[25px] font-bold text-slate-900 dark:text-white tracking-tight mt-1.5 tabular-nums leading-tight">
              ₹{stats.totalExpectedFee.toLocaleString('en-IN')}
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-normal mt-0.5 truncate">
              Active billable students: {stats.activeStudents}
            </p>
          </CardContent>
        </Card>

        {/* 2. Received Fees */}
        <Card className="rounded-2xl border border-[#E9EEF5] dark:border-slate-800 bg-white dark:bg-slate-900 shadow-[0_1px_3px_rgba(15,23,42,0.03)] hover:border-slate-300/80 dark:hover:border-slate-700 transition-all h-full flex flex-col justify-between">
          <CardContent className="p-3.5 sm:p-4 flex flex-col justify-between h-full">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
              <span className="text-[11.5px] font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-[0.4px]">
                Total Received
              </span>
            </div>
            <div className="text-[24px] sm:text-[25px] font-bold text-emerald-600 dark:text-emerald-400 tracking-tight mt-1.5 tabular-nums leading-tight">
              ₹{stats.totalReceivedFee.toLocaleString('en-IN')}
            </div>
            <p className="text-[11px] text-emerald-700/80 dark:text-emerald-400/80 font-normal mt-0.5 truncate">
              {stats.collectionRate}% collected this month
            </p>
          </CardContent>
        </Card>

        {/* 3. Pending / Balance Fees */}
        <Card className="rounded-2xl border border-[#E9EEF5] dark:border-slate-800 bg-white dark:bg-slate-900 shadow-[0_1px_3px_rgba(15,23,42,0.03)] hover:border-slate-300/80 dark:hover:border-slate-700 transition-all h-full flex flex-col justify-between">
          <CardContent className="p-3.5 sm:p-4 flex flex-col justify-between h-full">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
              <span className="text-[11.5px] font-semibold text-amber-700 dark:text-amber-400 uppercase tracking-[0.4px]">
                Pending Balance
              </span>
            </div>
            <div className="text-[24px] sm:text-[25px] font-bold text-amber-600 dark:text-amber-400 tracking-tight mt-1.5 tabular-nums leading-tight">
              ₹{stats.totalPendingFee.toLocaleString('en-IN')}
            </div>
            <p className="text-[11px] text-amber-700/80 dark:text-amber-400/80 font-normal mt-0.5 truncate">
              Due to be collected
            </p>
          </CardContent>
        </Card>

        {/* 4. Overdue Alerts */}
        <Card className="rounded-2xl border border-[#E9EEF5] dark:border-slate-800 bg-white dark:bg-slate-900 shadow-[0_1px_3px_rgba(15,23,42,0.03)] hover:border-slate-300/80 dark:hover:border-slate-700 transition-all h-full flex flex-col justify-between">
          <CardContent className="p-3.5 sm:p-4 flex flex-col justify-between h-full">
            <div className="flex items-center gap-1.5">
              <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${stats.overdueCount > 0 ? 'bg-rose-500 animate-pulse' : 'bg-slate-400'}`} />
              <span className={`text-[11.5px] font-semibold uppercase tracking-[0.4px] ${stats.overdueCount > 0 ? 'text-rose-700 dark:text-rose-400' : 'text-slate-500 dark:text-slate-400'}`}>
                Overdue Alerts
              </span>
            </div>
            <div className={`text-[24px] sm:text-[25px] font-bold mt-1.5 tracking-tight tabular-nums leading-tight ${stats.overdueCount > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-slate-800 dark:text-slate-200'}`}>
              {stats.overdueCount} Students
            </div>
            <p className={`text-[11px] font-normal mt-0.5 truncate ${stats.overdueCount > 0 ? 'text-rose-600/80 dark:text-rose-400/80' : 'text-slate-400'}`}>
              Due date crossed
            </p>
          </CardContent>
        </Card>

        {/* 5. Total Enrolled Students */}
        <Card className="rounded-2xl border border-[#E9EEF5] dark:border-slate-800 bg-white dark:bg-slate-900 shadow-[0_1px_3px_rgba(15,23,42,0.03)] hover:border-slate-300/80 dark:hover:border-slate-700 transition-all h-full flex flex-col justify-between">
          <CardContent className="p-3.5 sm:p-4 flex flex-col justify-between h-full">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2864E8] shrink-0" />
              <span className="text-[11.5px] font-semibold text-blue-700 dark:text-blue-400 uppercase tracking-[0.4px]">
                Total Enrolled
              </span>
            </div>
            <div className="text-[24px] sm:text-[25px] font-bold text-[#2864E8] dark:text-blue-400 tracking-tight mt-1.5 tabular-nums leading-tight">
              {stats.totalStudents}
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-normal mt-0.5 truncate">
              {stats.activeStudents} Active | {stats.disabledStudents} Paused
            </p>
          </CardContent>
        </Card>
      </div>

      {/* NAVIGATION TABS */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-[#2864E8] pb-2 sm:pb-2.5">
          <div className="overflow-x-auto no-scrollbar -mx-1 px-1">
            <TabsList className="bg-transparent dark:bg-transparent p-0 rounded-none h-auto flex items-center gap-1 sm:gap-6 min-w-max border-0 shadow-none">
              <TabsTrigger
                value="overview"
                className="flex items-center gap-1.5 py-1 px-2 text-[12px] sm:text-[12.5px] font-semibold tracking-[0.3px] transition-colors bg-transparent rounded-lg border-0 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 data-[state=active]:text-[#2864E8] data-[state=active]:font-semibold data-[state=active]:bg-transparent data-[state=active]:shadow-none shadow-none ring-0 outline-none focus:outline-none focus-visible:ring-0 uppercase cursor-pointer"
              >
                <TrendingUp className="w-[15px] h-[15px] shrink-0" />
                <span>OVERVIEW</span>
              </TabsTrigger>
              <TabsTrigger
                value="ledger"
                className="flex items-center gap-1.5 py-1 px-2 text-[12px] sm:text-[12.5px] font-semibold tracking-[0.3px] transition-colors bg-transparent rounded-lg border-0 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 data-[state=active]:text-[#2864E8] data-[state=active]:font-semibold data-[state=active]:bg-transparent data-[state=active]:shadow-none shadow-none ring-0 outline-none focus:outline-none focus-visible:ring-0 uppercase cursor-pointer"
              >
                <IndianRupee className="w-[15px] h-[15px] shrink-0" />
                <span>FEE COLLECTION</span>
                {stats.overdueCount > 0 && (
                  <span className="ml-1 min-w-[15px] h-[15px] px-1 rounded-full bg-rose-500 text-white text-[9px] font-bold inline-flex items-center justify-center leading-none shadow-2xs">
                    {stats.overdueCount}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger
                value="classes"
                className="flex items-center gap-1.5 py-1 px-2 text-[12px] sm:text-[12.5px] font-semibold tracking-[0.3px] transition-colors bg-transparent rounded-lg border-0 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 data-[state=active]:text-[#2864E8] data-[state=active]:font-semibold data-[state=active]:bg-transparent data-[state=active]:shadow-none shadow-none ring-0 outline-none focus:outline-none focus-visible:ring-0 uppercase cursor-pointer"
              >
                <School className="w-[15px] h-[15px] shrink-0" />
                <span>CLASS/BATCH</span>
              </TabsTrigger>
              <TabsTrigger
                value="students"
                className="flex items-center gap-1.5 py-1 px-2 text-[12px] sm:text-[12.5px] font-semibold tracking-[0.3px] transition-colors bg-transparent rounded-lg border-0 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 data-[state=active]:text-[#2864E8] data-[state=active]:font-semibold data-[state=active]:bg-transparent data-[state=active]:shadow-none shadow-none ring-0 outline-none focus:outline-none focus-visible:ring-0 uppercase cursor-pointer"
              >
                <span
                  className="text-[13px] leading-none inline-flex items-center justify-center select-none shrink-0"
                  style={{ filter: 'grayscale(100%)', opacity: 0.75 }}
                  aria-hidden="true"
                >
                  🧑‍🎓
                </span>
                <span>STUDENTS</span>
              </TabsTrigger>
              <TabsTrigger
                value="reports"
                className="flex items-center gap-1.5 py-1 px-2 text-[12px] sm:text-[12.5px] font-semibold tracking-[0.3px] transition-colors bg-transparent rounded-lg border-0 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 data-[state=active]:text-[#2864E8] data-[state=active]:font-semibold data-[state=active]:bg-transparent data-[state=active]:shadow-none shadow-none ring-0 outline-none focus:outline-none focus-visible:ring-0 uppercase cursor-pointer"
              >
                <Building2 className="w-[15px] h-[15px] shrink-0" />
                <span>FINAL REPORTS</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Quick Action Controls (CLASS first, BATCH second, STUDENT third, circular outline around icons) */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0 px-1">
            <button
              type="button"
              onClick={openCreateClassModal}
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
            <button
              type="button"
              onClick={openCreateStudentModal}
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
        {/* TAB 1: OVERVIEW & DASHBOARD */}
        {/* ------------------------------------------------------------------ */}
        <TabsContent value="overview" className="space-y-6 font-['Inter_Tight',sans-serif]">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Cols: Class-wise Revenue Breakdown */}
            <div className="lg:col-span-2 space-y-4">
              <Card className="rounded-2xl border border-[#E9EEF5] dark:border-slate-800 bg-white dark:bg-slate-900 shadow-[0_1px_3px_rgba(15,23,42,0.03)]">
                <CardHeader className="py-2.5 sm:py-3 px-4 sm:px-6 border-b border-slate-100 dark:border-slate-800/80">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-base sm:text-[17px] font-bold text-slate-900 dark:text-white tracking-tight uppercase">
                        CLASS-WISE FEE OVERVIEW
                      </CardTitle>
                      <CardDescription className="text-xs text-slate-400 font-normal mt-0.5">
                        Class-wise student and fee overview for {stats.currentMonthLabel}
                      </CardDescription>
                    </div>
                    <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 tabular-nums uppercase tracking-wider whitespace-nowrap">
                      TOTAL CLASSES {classes.length}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs sm:text-sm">
                      <thead className="bg-slate-50/70 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider text-[10.5px] border-b border-slate-200/70 dark:border-slate-800">
                        <tr>
                          <th className="py-2.5 sm:py-3 px-3.5 pl-5 whitespace-nowrap">CLASS / COURSE</th>
                          <th className="py-2.5 sm:py-3 px-3.5 whitespace-nowrap">BRANCH</th>
                          <th className="py-2.5 sm:py-3 px-3.5 text-center whitespace-nowrap">STUDENTS</th>
                          <th className="py-2.5 sm:py-3 px-3.5 text-right whitespace-nowrap">EXPECTED</th>
                          <th className="py-2.5 sm:py-3 px-3.5 text-right whitespace-nowrap">RECEIVED</th>
                          <th className="py-2.5 sm:py-3 px-3.5 text-right pr-5 whitespace-nowrap">PENDING</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800/70">
                        {stats.classBreakdown.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="py-10 text-center text-slate-400">
                              <GraduationCap className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-700 mb-2" />
                              <p className="font-semibold text-xs text-slate-600 dark:text-slate-300">Abhi koi class create nahi hui hai</p>
                              <p className="text-[11px] text-slate-400 mt-0.5">Classes & Batches tab me jaakar apni pehli class banayein.</p>
                              <Button
                                size="sm"
                                onClick={() => {
                                  setActiveTab('classes');
                                  openCreateClassModal();
                                }}
                                className="mt-3 h-8 px-3.5 rounded-xl text-xs font-semibold bg-[#2864E8] hover:bg-[#1E4ED8] text-white shadow-2xs cursor-pointer transition-colors"
                              >
                                <Plus className="w-3.5 h-3.5 mr-1" />
                                Create First Class
                              </Button>
                            </td>
                          </tr>
                        ) : (
                          stats.classBreakdown.map(item => {
                            const branch = IDL_BRANCHES.find(b => b.id === item.branchId);
                            return (
                              <tr key={item.classId} className="bg-white hover:bg-slate-50/60 dark:bg-slate-900 dark:hover:bg-slate-800/40 transition-colors duration-150">
                                <td className="py-3 px-3.5 pl-5 font-semibold text-slate-900 dark:text-white text-[13px] whitespace-nowrap tracking-tight">
                                  {item.className}
                                </td>
                                <td className="py-3 px-3.5 text-slate-400 dark:text-slate-500 text-[11px] font-normal whitespace-nowrap">
                                  {branch ? branch.name.replace(' Branch', '') : item.branchId}
                                </td>
                                <td className="py-3 px-3.5 text-center whitespace-nowrap">
                                  <span className="inline-flex items-center justify-center min-w-[22px] px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[11px] font-semibold text-slate-600 dark:text-slate-300 tabular-nums">
                                    {item.studentCount}
                                  </span>
                                </td>
                                <td className="py-3 px-3.5 text-right font-semibold text-slate-900 dark:text-slate-100 text-[13px] tabular-nums whitespace-nowrap tracking-tight">
                                  ₹{item.expectedFee.toLocaleString('en-IN')}
                                </td>
                                <td className="py-3 px-3.5 text-right font-bold text-emerald-600 dark:text-emerald-400 text-[13px] tabular-nums whitespace-nowrap tracking-tight">
                                  ₹{item.receivedFee.toLocaleString('en-IN')}
                                </td>
                                <td className="py-3 px-3.5 text-right pr-5 font-bold text-amber-600 dark:text-amber-400 text-[13px] tabular-nums whitespace-nowrap tracking-tight">
                                  ₹{item.pendingFee.toLocaleString('en-IN')}
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

              {/* Overdue Alert Section */}
              {stats.overdueCount > 0 && (
                <Card className="rounded-2xl border border-rose-200/60 dark:border-rose-900/30 bg-rose-50/20 dark:bg-rose-950/10 shadow-none">
                  <CardHeader className="py-2.5 sm:py-3 px-4 sm:px-5 border-b border-rose-100/70 dark:border-rose-900/30">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 shrink-0 text-rose-500" />
                        <CardTitle className="text-sm font-bold tracking-tight text-slate-900 dark:text-white">
                          Immediate Overdue Attention Required
                        </CardTitle>
                        <span className="ml-1 text-xs font-semibold text-rose-600 dark:text-rose-400 tabular-nums">
                          {stats.overdueCount} Students
                        </span>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setLedgerStatusFilter('OVERDUE');
                          setActiveTab('ledger');
                        }}
                        className="h-7 px-2.5 text-xs font-semibold rounded-[5px] border-rose-200/80 dark:border-rose-800 text-rose-700 dark:text-rose-300 bg-white dark:bg-slate-900 hover:bg-rose-50 dark:hover:bg-rose-950/40 shadow-none transition-colors cursor-pointer"
                      >
                        View All
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="p-3.5 sm:p-4 space-y-2">
                    {(() => {
                      const overdueList = ledger.filter(l => l.isOverdue || l.status === 'OVERDUE');
                      return (
                        <>
                          {overdueList.slice(0, 5).map(item => {
                            const cls = classes.find(c => c.id === item.student.classId);
                            const batch = batches.find(b => b.id === item.student.batchId);
                            const branch = IDL_BRANCHES.find(b => b.id === item.student.branchId || b.id === item.branchId);
                            const effectiveDueDate = (item.student.feeType === 'yearly_package' || Boolean(item.student.yearlyPackage))
                              ? (item.student.joiningDate || item.dueDate)
                              : item.dueDate;
                            const overdueDays = getOverdueDays(effectiveDueDate);
                            return (
                              <div
                                key={item.id}
                                className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-slate-900 border border-rose-100/80 dark:border-rose-900/30 shadow-[0_1px_2px_rgba(244,63,94,0.02)] hover:border-rose-200 dark:hover:border-rose-800 transition-colors gap-3"
                              >
                                {/* Left: Student & Father info + Vertical Divider + Class | Batch (top) & Branch (bottom) */}
                                <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                                  {/* 1. Student Name & Father Name */}
                                  <div className="w-[135px] sm:w-[155px] shrink-0 min-w-0">
                                    <div className="font-semibold text-slate-900 dark:text-white text-[13px] flex items-center gap-1.5 tracking-tight">
                                      <span className="truncate">{item.student.name}</span>
                                      {(item.student.feeType === 'yearly_package' || Boolean(item.student.yearlyPackage)) && (
                                        <span title="Yearly Package Student" className="inline-flex items-center justify-center shrink-0 ml-0.5">
                                          <span className="w-2 h-2 rounded-full bg-violet-600 dark:bg-violet-400 shadow-[0_0_7px_2px_rgba(139,92,246,0.75)] animate-pulse" />
                                        </span>
                                      )}
                                    </div>
                                    <div className="text-[11px] text-slate-500 dark:text-slate-400 font-normal truncate mt-0.5">
                                      Father : <span className="font-medium text-slate-700 dark:text-slate-300">{item.student.fatherName || '—'}</span>
                                    </div>
                                  </div>

                                  {/* Single vertical line in gray */}
                                  <div className="h-7 w-px bg-slate-200 dark:bg-slate-700 shrink-0 self-center" />

                                  {/* 2. Class | Batch (top) & Branch (bottom) */}
                                  <div className="min-w-0 flex-1">
                                    <div className="font-semibold text-slate-900 dark:text-white text-[12.5px] tracking-tight truncate">
                                      {cls?.name || 'Class'} | {batch?.name || 'Batch'}
                                    </div>
                                    <div className="text-[11px] text-slate-500 dark:text-slate-400 font-normal truncate mt-0.5">
                                      Branch : <span className="font-medium text-slate-700 dark:text-slate-300">{branch?.name || item.student.branchId || 'Budh Vihar'}</span>
                                    </div>
                                  </div>
                                </div>

                                {/* Right: Balance Amount, Due Date & Collect Fee Button */}
                                <div className="flex items-center gap-3 shrink-0">
                                  <div className="text-right">
                                    <div className="font-bold text-rose-600 text-[13.5px] tabular-nums tracking-tight">
                                      ₹{item.balanceAmount.toLocaleString('en-IN')}
                                    </div>
                                    <div className="text-[11px] text-rose-500 dark:text-rose-400 font-medium tabular-nums whitespace-nowrap flex items-center justify-end gap-1.5">
                                      <span>Due: {formatAdmDate(effectiveDueDate)}</span>
                                      {overdueDays > 0 && (
                                        <span className="inline-flex flex-col items-start justify-center leading-none text-rose-600 dark:text-rose-400 text-left">
                                          <span className="flex items-baseline gap-0.5 leading-none">
                                            <span className="font-bold text-[11px] tabular-nums leading-none">{overdueDays}</span>
                                            <span className="text-[8.5px] font-medium leading-none">{overdueDays === 1 ? 'day' : 'days'}</span>
                                          </span>
                                          <span className="text-[8.5px] font-semibold leading-none mt-0.5">
                                            Overdue
                                          </span>
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                  <Button
                                    size="sm"
                                    onClick={() => openCollectFeeModal(item)}
                                    className="h-7.5 px-3 rounded-[5px] text-[11px] font-bold tracking-wider uppercase bg-[#2864E8] hover:bg-blue-600 text-white shadow-none whitespace-nowrap transition-colors cursor-pointer"
                                  >
                                    COLLECT FEE
                                  </Button>
                                </div>
                              </div>
                            );
                          })}

                          {overdueList.length > 5 && (
                            <div className="pt-1 text-center">
                              <button
                                type="button"
                                onClick={() => {
                                  setLedgerStatusFilter('OVERDUE');
                                  setActiveTab('ledger');
                                }}
                                className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 hover:underline cursor-pointer py-1"
                              >
                                View All ({overdueList.length} Overdue Students) →
                              </button>
                            </div>
                          )}
                        </>
                      );
                    })()}
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Right 1 Col: Recent Payments & Receipts */}
            <div className="space-y-4">
              <Card className="rounded-2xl border border-[#E9EEF5] dark:border-slate-800 bg-white dark:bg-slate-900 shadow-[0_1px_3px_rgba(15,23,42,0.03)]">
                <CardHeader className="py-2.5 sm:py-3 px-4 sm:px-5 border-b border-slate-100 dark:border-slate-800/80">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base sm:text-[17px] font-bold text-slate-900 dark:text-white flex items-center gap-2 tracking-tight">
                      <Receipt className="w-4 h-4 text-[#2864E8]" />
                      Recent Receipts
                    </CardTitle>
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 text-[10px] font-semibold uppercase tracking-wider">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Live
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="p-3.5 sm:p-4 space-y-2">
                  {stats.recentPayments.length === 0 ? (
                    <p className="text-xs text-slate-400 text-center py-4 font-medium">No recent payments recorded.</p>
                  ) : (
                    stats.recentPayments.slice(0, 6).map(pay => (
                      <div
                        key={pay.id}
                        onClick={() => {
                          setRecentReceipt(pay);
                          setIsReceiptOpen(true);
                        }}
                        className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 shadow-[0_1px_2px_rgba(15,23,42,0.02)] hover:border-[#2864E8]/40 hover:bg-slate-50/40 dark:hover:bg-slate-800/40 transition-all cursor-pointer space-y-1.5"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[13px] font-semibold text-slate-900 dark:text-white tracking-tight truncate">
                            {pay.studentName}
                          </span>
                          <span className="text-[13.5px] font-bold text-emerald-600 dark:text-emerald-400 tabular-nums shrink-0 tracking-tight">
                            +₹{pay.amount.toLocaleString('en-IN')}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500">
                          <span className="font-mono text-[10.5px] tabular-nums tracking-tight">{pay.receiptNumber}</span>
                          <span className="text-[9.5px] uppercase font-semibold py-0.5 px-1.5 rounded bg-slate-50 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700 text-slate-600 dark:text-slate-300">
                            {pay.paymentMode}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-[10.5px] text-slate-400 dark:text-slate-500 pt-0.5 border-t border-slate-100 dark:border-slate-800/80">
                          <span className="tabular-nums truncate max-w-[180px]">Date: {formatAdmDate(pay.paymentDate)} • {pay.collectedBy}</span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setRevertPaymentTarget(pay);
                            }}
                            className="text-[10.5px] font-medium text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 flex items-center gap-1 transition-colors cursor-pointer shrink-0"
                            title="Revert / Void this receipt"
                          >
                            <RotateCcw className="w-3 h-3" />
                            Revert
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* ------------------------------------------------------------------ */}
        {/* TAB 2: MONTHLY LEDGER & FEE COLLECTION */}
        {/* ------------------------------------------------------------------ */}
        <TabsContent value="ledger" className="space-y-4 font-['Inter_Tight',sans-serif]">
          <Card className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-[0_1px_3px_rgba(15,23,42,0.03)] font-['Inter_Tight',sans-serif]">
            <CardHeader className="py-2.5 sm:py-3 px-4 sm:px-6 border-b border-slate-100 dark:border-slate-800/80">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <CardTitle className="text-base sm:text-[17px] font-bold text-slate-900 dark:text-white tracking-tight uppercase">
                    MONTHLY FEE COLLECTION
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-400 font-normal mt-0.5">
                    Track student payments and pending dues.
                  </CardDescription>
                </div>

                {/* Filter Row: [ STATUS ] [ Search (Rightmost, Round) ] */}
                <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap justify-end">
                  {/* STATUS */}
                  <Select value={ledgerStatusFilter} onValueChange={setLedgerStatusFilter}>
                    <SelectTrigger className="h-7 !border-0 !border-b-0 !shadow-none !ring-0 !outline-none px-1 text-[11px] font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white focus:!outline-none focus:!ring-0 focus:!ring-offset-0 focus:!shadow-none data-[state=open]:!shadow-none data-[state=open]:!border-b-0 gap-1 cursor-pointer w-auto [&>span]:line-clamp-none [&>svg]:w-3 [&>svg]:h-3 [&>svg]:opacity-60 tracking-wider uppercase">
                      <SelectValue placeholder="STATUS">
                        {ledgerStatusFilter === 'all'
                          ? 'STATUS'
                          : ledgerStatusFilter === 'PAID'
                          ? 'RECEIVED'
                          : ledgerStatusFilter}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all" className="text-xs font-semibold">All Status</SelectItem>
                      <SelectItem value="PAID" className="text-xs">RECEIVED</SelectItem>
                      <SelectItem value="PARTIAL" className="text-xs">PARTIAL</SelectItem>
                      <SelectItem value="PENDING" className="text-xs">PENDING</SelectItem>
                      <SelectItem value="OVERDUE" className="text-xs">OVERDUE</SelectItem>
                      <SelectItem value="ADVANCE" className="text-xs">ADVANCE</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* Search Bar (Rightmost, 100% round, expands right-to-left) */}
                  <div className="relative flex items-center justify-end">
                    <div
                      onClick={() => {
                        if (!isLedgerSearchOpen && !studentSearch) {
                          setIsLedgerSearchOpen(true);
                          setTimeout(() => ledgerSearchInputRef.current?.focus(), 150);
                        }
                      }}
                      className={`flex items-center rounded-full transition-all duration-300 ease-in-out border ${
                        isLedgerSearchOpen || studentSearch
                          ? 'w-48 sm:w-60 h-7 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 shadow-xs px-2.5'
                          : 'w-7 h-7 bg-slate-100/90 hover:bg-slate-200/80 dark:bg-slate-800 dark:hover:bg-slate-700 border-transparent justify-center cursor-pointer'
                      }`}
                    >
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!isLedgerSearchOpen && !studentSearch) {
                            setIsLedgerSearchOpen(true);
                            setTimeout(() => ledgerSearchInputRef.current?.focus(), 150);
                          } else if (isLedgerSearchOpen && !studentSearch) {
                            setIsLedgerSearchOpen(false);
                          }
                        }}
                        className={`shrink-0 flex items-center justify-center text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors cursor-pointer ${
                          isLedgerSearchOpen || studentSearch ? 'w-4 h-4' : 'w-7 h-7 rounded-full'
                        }`}
                        title="Search students"
                      >
                        <Search className="w-3.5 h-3.5" />
                      </button>

                      <input
                        ref={ledgerSearchInputRef}
                        type="text"
                        placeholder="Search student..."
                        value={studentSearch}
                        onChange={e => setStudentSearch(e.target.value)}
                        onFocus={() => setIsLedgerSearchOpen(true)}
                        onBlur={() => {
                          if (!studentSearch.trim()) {
                            setIsLedgerSearchOpen(false);
                          }
                        }}
                        onKeyDown={e => {
                          if (e.key === 'Escape') {
                            setStudentSearch('');
                            setIsLedgerSearchOpen(false);
                          }
                        }}
                        className={`bg-transparent text-xs text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none transition-all duration-300 ${
                          isLedgerSearchOpen || studentSearch
                            ? 'w-full ml-1.5 opacity-100 block'
                            : 'w-0 ml-0 opacity-0 hidden'
                        }`}
                      />

                      {studentSearch && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setStudentSearch('');
                            setIsLedgerSearchOpen(false);
                          }}
                          className="w-3.5 h-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 shrink-0 ml-1 flex items-center justify-center cursor-pointer"
                          title="Clear search"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {excludedStudentsForMonth.length > 0 && (
                <div className="m-3.5 p-3 rounded-xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 flex flex-wrap items-center justify-between gap-2 text-xs text-amber-900 dark:text-amber-200">
                  <div className="flex items-center gap-2">
                    <Info className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>
                      <strong>{excludedStudentsForMonth.length} student(s)</strong> ko sirf is mahine ({selectedMonthLabel}) se remove kiya gaya hai:
                      {' '}{excludedStudentsForMonth.map(s => s.name).join(', ')}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {excludedStudentsForMonth.map(s => (
                      <Button
                        key={s.id}
                        size="sm"
                        variant="outline"
                        onClick={() => handleRestoreStudent(s.id, selectedMonth)}
                        className="h-7 px-2.5 text-[11px] font-bold border-amber-300 dark:border-amber-700 bg-white dark:bg-slate-900 text-amber-800 dark:text-amber-300 hover:bg-amber-100 rounded-lg shadow-2xs"
                        title={`Restore ${s.name} to ${selectedMonthLabel}`}
                      >
                        Restore {s.name}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-slate-50/70 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider text-[11px] border-b border-slate-200/70 dark:border-slate-800">
                    <tr>
                      <th className="py-2.5 sm:py-3 px-3.5 pl-5 whitespace-nowrap min-w-[240px]">STUDENT NAME & DETAILS</th>
                      <th className="py-2.5 sm:py-3 px-3.5 whitespace-nowrap min-w-[110px]">CLASS/BATCH</th>
                      <th className="py-2.5 sm:py-3 px-3.5 whitespace-nowrap min-w-[120px]">CONTACT</th>
                      <th className="py-2.5 sm:py-3 px-3.5 text-right whitespace-nowrap min-w-[85px]">Total Fee</th>
                      <th className="py-2.5 sm:py-3 px-3.5 text-right whitespace-nowrap min-w-[80px]">Pending</th>
                      <th className="py-2.5 sm:py-3 px-3.5 text-right whitespace-nowrap min-w-[80px]">Received</th>
                      <th className="py-2.5 sm:py-3 px-3.5 text-center whitespace-nowrap min-w-[90px]">Status</th>
                      <th className="py-2.5 sm:py-3 px-3.5 text-right pr-5 whitespace-nowrap min-w-[120px]">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/70">
                    {(() => {
                      const filteredLedger = ledger.filter(entry => {
                        if (ledgerStatusFilter !== 'all' && entry.status !== ledgerStatusFilter) return false;
                        if (studentSearch.trim()) {
                          const q = studentSearch.toLowerCase().trim();
                          return (
                            entry.student.name.toLowerCase().includes(q) ||
                            entry.student.rollNumber.toLowerCase().includes(q) ||
                            entry.student.contact1.includes(q)
                          );
                        }
                        return true;
                      });

                      if (filteredLedger.length === 0) {
                        const monthName = monthOptions.find(m => m.value === selectedMonth)?.label || selectedMonth;
                        return (
                          <tr>
                            <td colSpan={8} className="py-12 text-center text-slate-400">
                              <Calendar className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-700 mb-2" />
                              <p className="font-semibold text-xs text-slate-600 dark:text-slate-300">
                                {monthName} me koi student admitted / enrolled nahi hai
                              </p>
                              <p className="text-[11px] text-slate-400 mt-0.5">
                                Jis student ki admission date is mahine ya isse pehle hogi, unka fee record yahan automatically dikhega.
                              </p>
                            </td>
                          </tr>
                        );
                      }

                      return filteredLedger.map(entry => {
                        const isOver = (entry.isOverdue || entry.status === 'OVERDUE') && entry.status !== 'PAID';
                        const cls = classes.find(c => c.id === entry.classId);
                        const batch = batches.find(b => b.id === entry.batchId);
                        const branch = IDL_BRANCHES.find(b => b.id === entry.branchId);
                        const student = entry.student;

                        return (
                          <tr
                            key={entry.id}
                            className={`transition-colors duration-150 ${
                              isOver
                                ? 'bg-rose-50/15 hover:bg-rose-50/35 dark:bg-rose-950/10 dark:hover:bg-rose-950/20'
                                : 'bg-white hover:bg-slate-50/60 dark:bg-slate-900 dark:hover:bg-slate-800/40'
                            }`}
                          >
                            <td className="py-3 px-3.5 pl-5 whitespace-nowrap">
                              <div className="font-semibold text-slate-900 dark:text-white text-[14px] flex items-center gap-1.5 whitespace-nowrap tracking-tight">
                                <span>{student.name}</span>
                                {(student.feeType === 'yearly_package' || Boolean(student.yearlyPackage)) && (
                                  <span title="Yearly Package Student" className="inline-flex items-center justify-center shrink-0 ml-0.5">
                                    <span className="w-2 h-2 rounded-full bg-violet-600 dark:bg-violet-400 shadow-[0_0_7px_2px_rgba(139,92,246,0.75)] animate-pulse" />
                                  </span>
                                )}
                              </div>
                              <div className="text-[12px] text-slate-500 dark:text-slate-400 font-normal whitespace-nowrap mt-0.5">
                                Father : <span className="font-medium text-slate-700 dark:text-slate-300">{student.fatherName || '—'}</span>
                              </div>
                              <div className="text-[11px] text-slate-400 dark:text-slate-500 font-normal whitespace-nowrap mt-0.5">
                                Student ID : <span className="font-mono font-medium text-slate-700 dark:text-slate-300">{student.rollNumber || student.id}</span>
                              </div>
                            </td>
                            <td className="py-3 px-3.5 whitespace-nowrap">
                              <div className="flex items-center gap-1 font-semibold text-slate-800 dark:text-slate-200 text-[13px] whitespace-nowrap tracking-tight">
                                <span>{cls?.name || 'Class'}</span>
                                {batch?.name && (
                                  <>
                                    <span className="inline-block w-px h-3 bg-slate-300 dark:bg-slate-600 mx-1 shrink-0" aria-hidden="true" />
                                    <span className="text-slate-600 dark:text-slate-400 font-medium">{batch.name}</span>
                                  </>
                                )}
                              </div>
                              <div className="text-[11px] text-slate-400 dark:text-slate-500 font-normal whitespace-nowrap mt-0.5">
                                Join Date : {formatAdmDate(student.joiningDate)}
                              </div>
                              {(() => {
                                const effectiveDueDate = (student.feeType === 'yearly_package' || Boolean(student.yearlyPackage))
                                  ? (student.joiningDate || entry.dueDate)
                                  : entry.dueDate;
                                const overdueDays = isOver ? getOverdueDays(effectiveDueDate) : 0;
                                return (
                                  <div className={`text-[11px] font-normal whitespace-nowrap mt-0.5 flex items-center gap-1.5 ${
                                    isOver ? "text-rose-600 dark:text-rose-400 font-medium" : "text-slate-400 dark:text-slate-500"
                                  }`}>
                                    <span>Due Date : {formatAdmDate(effectiveDueDate)}</span>
                                    {isOver && overdueDays > 0 && (
                                      <span className="inline-flex flex-col items-start justify-center leading-none text-rose-600 dark:text-rose-400">
                                        <span className="flex items-baseline gap-0.5 leading-none">
                                          <span className="font-bold text-[11px] tabular-nums leading-none">{overdueDays}</span>
                                          <span className="text-[8.5px] font-medium leading-none">{overdueDays === 1 ? 'day' : 'days'}</span>
                                        </span>
                                        <span className="text-[8.5px] font-semibold leading-none mt-0.5">
                                          Overdue
                                        </span>
                                      </span>
                                    )}
                                  </div>
                                );
                              })()}
                            </td>
                            <td className="py-3 px-3.5 whitespace-nowrap">
                              {/* 1. Father Contact (Primary) */}
                              <div className="font-medium text-slate-800 dark:text-slate-200 text-[13px] font-mono tabular-nums whitespace-nowrap tracking-tight" title="Father Contact">
                                {student.fatherContact || student.contact1 || '—'}
                              </div>

                              {/* 2. Mother Contact (Smaller text) */}
                              {(student.motherContact || (student.contact2 && student.contact2 !== student.fatherContact && student.contact2 !== student.contact1)) && (
                                <div className="text-[11px] text-slate-400 dark:text-slate-500 font-mono tabular-nums whitespace-nowrap mt-0.5 leading-tight" title="Mother Contact">
                                  {student.motherContact || student.contact2}
                                </div>
                              )}

                              {/* 3. Student Contact (Smaller text) */}
                              {student.contact1 && student.contact1 !== student.fatherContact && (
                                <div className="text-[11px] text-slate-400 dark:text-slate-500 font-mono tabular-nums whitespace-nowrap mt-0.5 leading-tight" title="Student Contact">
                                  {student.contact1}
                                </div>
                              )}
                            </td>
                            <td className="py-3 px-3.5 text-right font-medium text-slate-700 dark:text-slate-300 whitespace-nowrap">
                              <div className="font-semibold text-slate-900 dark:text-white text-[13.5px] tabular-nums tracking-tight whitespace-nowrap">
                                ₹{entry.netDueAmount.toLocaleString('en-IN')}
                              </div>
                              {entry.carriedForwardDue > 0 ? (
                                <div className="text-[10px] text-amber-700 dark:text-amber-300 font-medium bg-amber-50 dark:bg-amber-950/40 rounded px-1.5 py-0.5 inline-block border border-amber-200/60 mt-0.5 whitespace-nowrap tabular-nums">
                                  Fee: ₹{(entry.baseAmount - entry.discountAmount).toLocaleString('en-IN')} + Prev Due: ₹{entry.carriedForwardDue.toLocaleString('en-IN')}
                                </div>
                              ) : null}
                            </td>
                            <td className="py-3 px-3.5 text-right whitespace-nowrap">
                              <span
                                className={`font-semibold text-[13.5px] tabular-nums tracking-tight whitespace-nowrap ${
                                  entry.balanceAmount <= 0
                                    ? 'text-slate-400 dark:text-slate-500 font-medium'
                                    : isOver
                                    ? 'text-rose-600 dark:text-rose-400'
                                    : 'text-amber-600 dark:text-amber-400'
                                }`}
                              >
                                ₹{entry.balanceAmount.toLocaleString('en-IN')}
                              </span>
                            </td>
                            <td className="py-3 px-3.5 text-right whitespace-nowrap">
                              <div className="font-semibold text-emerald-600 dark:text-emerald-400 text-[13.5px] tabular-nums tracking-tight whitespace-nowrap">
                                ₹{entry.paidAmount.toLocaleString('en-IN')}
                              </div>
                              {(() => {
                                const isYearly = student.feeType === 'yearly_package' || Boolean(student.yearlyPackage);
                                const collectionDate = entry.lastPaymentDate || (isYearly ? student.joiningDate : null);
                                if (!collectionDate || entry.paidAmount <= 0) return null;
                                return (
                                  <div className="text-[10px] text-slate-400 font-normal mt-0.5 tabular-nums whitespace-nowrap text-right" title={`Fee collection date: ${formatAdmDate(collectionDate)}`}>
                                    {formatAdmDate(collectionDate)}
                                  </div>
                                );
                              })()}
                            </td>
                            <td className="py-3 px-3.5 text-center whitespace-nowrap align-middle">
                              <div className="flex flex-col items-center justify-center gap-1">
                                <span
                                  className={`h-[28px] min-w-[78px] px-2 inline-flex items-center justify-center text-[11px] font-semibold tracking-wider rounded-md whitespace-nowrap uppercase ${
                                    entry.status === 'PAID'
                                      ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200/70 dark:border-emerald-800/40'
                                      : entry.status === 'PARTIAL'
                                      ? 'bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border border-amber-200/70 dark:border-amber-800/40'
                                      : entry.status === 'OVERDUE'
                                      ? 'bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 border border-rose-200/70 dark:border-rose-800/40'
                                      : entry.status === 'ADVANCE'
                                      ? 'bg-blue-50 dark:bg-blue-950/30 text-[#2864E8] dark:text-blue-400 border border-blue-200/70 dark:border-blue-800/40'
                                      : 'bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                                  }`}
                                >
                                  {entry.status === 'PAID' ? 'RECEIVED' : entry.status}
                                </span>
                                {entry.forwardedToNextMonth && entry.forwardedAmount ? (
                                  <span
                                    className="text-[10px] font-medium bg-blue-50/60 dark:bg-blue-950/30 text-[#2864E8] dark:text-blue-300 border border-blue-200/60 dark:border-blue-800/50 py-0.5 px-2 text-center max-w-[155px] leading-tight rounded-md whitespace-nowrap"
                                    title={`Unpaid ₹${entry.forwardedAmount} agle mahine (${entry.forwardedMonthLabel || 'Next Month'}) ke fee bill me add ho chuka hai`}
                                  >
                                    ➡️ Added to {entry.forwardedMonthLabel || 'Next Month'}
                                  </span>
                                ) : null}
                              </div>
                            </td>
                            <td className="py-3 px-3.5 text-right pr-5 whitespace-nowrap align-middle">
                              <div className="flex items-center justify-end gap-1.5 flex-nowrap whitespace-nowrap">
                                {entry.status === 'PAID' ? (
                                  <button
                                    type="button"
                                    onClick={() => openRevertModal(entry)}
                                    className="h-[34px] min-w-[88px] px-2.5 rounded-[5px] border border-rose-200/80 dark:border-rose-900/40 bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400 hover:bg-rose-50/80 dark:hover:bg-rose-950/30 hover:border-rose-300 text-[11px] font-bold tracking-wider uppercase shadow-none whitespace-nowrap flex items-center justify-center cursor-pointer transition-colors"
                                    title="Mark Unpaid / Revert"
                                  >
                                    REVERT FEE
                                  </button>
                                ) : (
                                  <div className="flex items-center justify-end gap-1.5 flex-nowrap">
                                    <Button
                                      size="sm"
                                      onClick={() => openCollectFeeModal(entry)}
                                      className="h-[34px] min-w-[88px] px-2.5 rounded-[5px] text-[11px] font-bold tracking-wider uppercase bg-[#2864E8] hover:bg-blue-600 text-white shadow-none whitespace-nowrap flex items-center justify-center cursor-pointer transition-colors"
                                    >
                                      COLLECT FEE
                                    </Button>
                                    {entry.paidAmount > 0 && (
                                      <button
                                        type="button"
                                        onClick={() => openRevertModal(entry)}
                                        className="h-[34px] w-[34px] rounded-[5px] border border-slate-200/80 dark:border-slate-700/80 text-rose-500 hover:text-rose-600 hover:bg-rose-50/60 dark:hover:bg-rose-950/30 flex items-center justify-center transition-colors cursor-pointer"
                                        title="Mark Unpaid / Revert"
                                      >
                                        <RotateCcw className="w-3 h-3" />
                                      </button>
                                    )}
                                  </div>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      });
                    })()}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ------------------------------------------------------------------ */}
        {/* TAB 3: CLASS & BATCH MANAGEMENT */}
        {/* ------------------------------------------------------------------ */}
        <TabsContent value="classes" className="space-y-4 font-['Inter_Tight',sans-serif]">
          {filteredClasses.length === 0 ? (
            <button
              type="button"
              onClick={openCreateClassModal}
              title="Create Class"
              aria-label="Create Class"
              className="w-full h-40 sm:h-48 flex items-center justify-center rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 bg-slate-50/50 hover:bg-slate-100/70 dark:bg-slate-900/30 dark:hover:bg-slate-900/60 hover:border-[#2864E8]/60 transition-all cursor-pointer group"
            >
              <Plus className="w-8 h-8 text-slate-400 group-hover:text-[#2864E8] group-hover:scale-110 transition-all" />
            </button>
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
                const branch = IDL_BRANCHES.find(b => b.id === cls.branchId);
                const activeBatchId = selectedBatchPerClass[cls.id] || clsBatches[0]?.id;
                const activeBatch = clsBatches.find(b => b.id === activeBatchId) || clsBatches[0];

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
                              onClick={() => openEditClassModal(cls)}
                              className="h-7 w-7 rounded-lg text-slate-400 hover:text-[#2864E8] hover:bg-blue-50/80 dark:hover:bg-slate-800 flex items-center justify-center transition-colors cursor-pointer"
                              title="Edit Class Details"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeleteTarget({ type: 'class', id: cls.id, name: cls.name })}
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
                            <span className="font-semibold text-slate-900 dark:text-white tabular-nums">{cls.studentCount || 0}</span>
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
                                      onClick={() => setSelectedBatchPerClass(prev => ({ ...prev, [cls.id]: b.id }))}
                                      className={`text-[12px] transition-colors cursor-pointer shrink-0 whitespace-nowrap bg-transparent p-0 ${
                                        isActive
                                          ? "font-bold text-[#2864E8] dark:text-[#4B82F6]"
                                          : "font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
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
                            className="text-xs text-slate-400 hover:text-[#2864E8] dark:hover:text-[#4B82F6] bg-slate-50/70 dark:bg-slate-800/40 hover:bg-blue-50/40 p-3 rounded-xl text-center font-medium cursor-pointer transition-colors border border-dashed border-slate-200 dark:border-slate-700/60"
                          >
                            No batches created yet. Click &ldquo;+ Add Batch&rdquo; to create one.
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
                                  ₹{Number(activeBatch.monthlyFee || 0).toLocaleString('en-IN')}<span className="text-[10.5px] text-slate-400 font-normal ml-0.5">/mo</span>
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
                                    onClick={() => setDeleteTarget({ type: 'batch', id: activeBatch.id, name: activeBatch.name })}
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
                              {/* Schedule Row */}
                              {(activeBatch.classTime || activeBatch.duration) && (
                                <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 font-medium">
                                  <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                  <span>{activeBatch.classTime || ''}</span>
                                  {activeBatch.duration && <span className="text-slate-400 font-normal">• {activeBatch.duration}</span>}
                                </div>
                              )}

                              {/* Subjects */}
                              {activeBatch.subjects && activeBatch.subjects.length > 0 && (
                                <div className="flex items-center gap-1.5 text-[11px] pt-0.5">
                                  <span className="text-slate-400 font-normal shrink-0">Subjects:</span>
                                  <span className="text-slate-700 dark:text-slate-300 font-medium truncate" title={activeBatch.subjects.join(', ')}>
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
          )}
        </TabsContent>

        {/* ------------------------------------------------------------------ */}
        {/* TAB 4: STUDENT DIRECTORY & PROFILES */}
        {/* ------------------------------------------------------------------ */}
        <TabsContent value="students" className="space-y-4 font-['Inter_Tight',sans-serif]">
          <Card className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-[0_1px_3px_rgba(15,23,42,0.03)] font-['Inter_Tight',sans-serif]">
            <CardHeader className="py-2.5 sm:py-3 px-4 sm:px-6 border-b border-slate-100 dark:border-slate-800/80">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div>
                  <CardTitle className="text-base sm:text-[17px] font-bold text-slate-900 dark:text-white tracking-tight uppercase">
                    STUDENT DIRECTORY ({filteredStudents.length})
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-400 font-normal mt-0.5">
                    Manage student profiles, fees and enrolment details.
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
                          : filteredClasses.find(c => c.id === classFilter)?.name.toUpperCase() || 'CLASS'}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all" className="text-xs font-semibold">All Classes</SelectItem>
                      {filteredClasses.map(c => (
                        <SelectItem key={c.id} value={c.id} className="text-xs">{c.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* 2. BATCH (No icon, all capital, compact & refined) */}
                  <Select value={batchFilter} onValueChange={setBatchFilter}>
                    <SelectTrigger className="h-7 !border-0 !border-b-0 !shadow-none !ring-0 !outline-none px-1 text-[11px] font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white focus:!outline-none focus:!ring-0 focus:!ring-offset-0 focus:!shadow-none data-[state=open]:!shadow-none data-[state=open]:!border-b-0 gap-1 cursor-pointer w-auto [&>span]:line-clamp-none [&>svg]:w-3 [&>svg]:h-3 [&>svg]:opacity-60 tracking-wider uppercase">
                      <SelectValue placeholder="BATCH">
                        {batchFilter === 'all'
                          ? 'BATCH'
                          : availableBatchesForStudentFilter.find(b => b.id === batchFilter)?.name.toUpperCase() || 'BATCH'}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all" className="text-xs font-semibold">All Batches</SelectItem>
                      {availableBatchesForStudentFilter.map(b => (
                        <SelectItem key={b.id} value={b.id} className="text-xs">{b.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* 3. STATUS (No icon, all capital, compact & refined) */}
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="h-7 !border-0 !border-b-0 !shadow-none !ring-0 !outline-none px-1 text-[11px] font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white focus:!outline-none focus:!ring-0 focus:!ring-offset-0 focus:!shadow-none data-[state=open]:!shadow-none data-[state=open]:!border-b-0 gap-1 cursor-pointer w-auto [&>span]:line-clamp-none [&>svg]:w-3 [&>svg]:h-3 [&>svg]:opacity-60 tracking-wider uppercase">
                      <SelectValue placeholder="STATUS">
                        {statusFilter === 'all'
                          ? 'STATUS'
                          : statusFilter === 'active'
                          ? 'ACTIVE'
                          : 'PAUSED'}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all" className="text-xs font-semibold">All Status</SelectItem>
                      <SelectItem value="active" className="text-xs">Active Only</SelectItem>
                      <SelectItem value="disabled" className="text-xs">Paused Only</SelectItem>
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
              {excludedStudentsForMonth.length > 0 && (
                <div className="m-3 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 flex flex-wrap items-center justify-between gap-2 text-xs text-amber-900 dark:text-amber-200">
                  <div className="flex items-center gap-2">
                    <Info className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>
                      <strong>{excludedStudentsForMonth.length} student(s)</strong> ko sirf is mahine ({selectedMonthLabel}) se remove kiya gaya hai:
                      {' '}{excludedStudentsForMonth.map(s => s.name).join(', ')}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {excludedStudentsForMonth.map(s => (
                      <Button
                        key={s.id}
                        size="sm"
                        variant="outline"
                        onClick={() => handleRestoreStudent(s.id, selectedMonth)}
                        className="h-7 px-2.5 text-[11px] font-bold border-amber-300 dark:border-amber-700 bg-white dark:bg-slate-900 text-amber-800 dark:text-amber-300 hover:bg-amber-100"
                        title={`Restore ${s.name} to ${selectedMonthLabel}`}
                      >
                        Restore {s.name}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-slate-50/70 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider text-[11px] border-b border-slate-200/70 dark:border-slate-800">
                    <tr>
                      <th className="py-2.5 sm:py-3 px-3.5 pl-5 whitespace-nowrap min-w-[240px]">STUDENT NAME & DETAILS</th>
                      <th className="py-2.5 sm:py-3 px-3.5 whitespace-nowrap min-w-[110px]">CLASS/BATCH</th>
                      <th className="py-2.5 sm:py-3 px-3.5 whitespace-nowrap min-w-[120px]">CONTACT</th>
                      <th className="py-2.5 sm:py-3 px-3.5 text-right whitespace-nowrap min-w-[140px]">MONTHLY FEE</th>
                      <th className="py-2.5 sm:py-3 px-3.5 text-center whitespace-nowrap min-w-[90px]">STATUS</th>
                      <th className="py-2.5 sm:py-3 px-3.5 text-right pr-5 whitespace-nowrap min-w-[85px]">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/70">
                    {filteredStudents.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-slate-400">
                          <Users className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-700 mb-2" />
                          <p className="font-semibold text-xs text-slate-600 dark:text-slate-300">Abhi koi student register nahi hai</p>
                          <p className="text-[11px] text-slate-400 mt-0.5 max-w-sm mx-auto">
                            {classes.length === 0
                              ? "Student add karne se pehle kripya 'Classes & Batches' tab me jakar Class aur Batch create karein."
                              : "Naya student add karne ke liye upar 'Enroll New Student' button par click karein."}
                          </p>
                          {classes.length > 0 && (
                            <Button
                              size="sm"
                              onClick={openCreateStudentModal}
                              className="mt-3 h-8 px-3.5 rounded-xl text-xs font-semibold bg-[#2864E8] hover:bg-[#1E4ED8] text-white shadow-2xs cursor-pointer transition-colors"
                            >
                              <Plus className="w-3.5 h-3.5 mr-1" />
                              Enroll First Student
                            </Button>
                          )}
                        </td>
                      </tr>
                    ) : (
                      filteredStudents.map(student => {
                        const cls = classes.find(c => c.id === student.classId);
                        const batch = batches.find(b => b.id === student.batchId);
                        const branch = IDL_BRANCHES.find(b => b.id === student.branchId);
                        const sStatus = selectedMonth ? getStudentStatusForMonth(student, selectedMonth) : student.status;
                        const studentLedgerEntry = ledger.find(l => l.studentId === student.id && (!selectedMonth || l.month === selectedMonth));
                        const dueDateStr = studentLedgerEntry ? studentLedgerEntry.dueDate : `2026-11-${String(student.dueDayOfMonth || 5).padStart(2, '0')}`;
                        const isOver = studentLedgerEntry ? ((studentLedgerEntry.isOverdue || studentLedgerEntry.status === 'OVERDUE') && studentLedgerEntry.status !== 'PAID') : false;
                        const genderLabel = student.gender
                          ? student.gender.charAt(0).toUpperCase() + student.gender.slice(1).toLowerCase()
                          : '';

                        return (
                          <tr
                            key={student.id}
                            className={`transition-colors duration-150 ${
                              isOver
                                ? 'bg-rose-50/15 hover:bg-rose-50/35 dark:bg-rose-950/10 dark:hover:bg-rose-950/20'
                                : 'bg-white hover:bg-slate-50/60 dark:bg-slate-900 dark:hover:bg-slate-800/40'
                            }`}
                          >
                            <td className="py-3 px-3.5 pl-5 whitespace-nowrap">
                              <div className="font-semibold text-slate-900 dark:text-white text-[14px] flex items-center gap-1.5 whitespace-nowrap tracking-tight">
                                <span>{student.name}</span>
                                {(student.feeType === 'yearly_package' || Boolean(student.yearlyPackage)) && (
                                  <span title="Yearly Package Student" className="inline-flex items-center justify-center shrink-0 ml-0.5">
                                    <span className="w-2 h-2 rounded-full bg-violet-600 dark:bg-violet-400 shadow-[0_0_7px_2px_rgba(139,92,246,0.75)] animate-pulse" />
                                  </span>
                                )}
                              </div>
                              <div className="text-[12px] text-slate-500 dark:text-slate-400 font-normal whitespace-nowrap mt-0.5">
                                Father : <span className="font-medium text-slate-700 dark:text-slate-300">{student.fatherName || '—'}</span>
                              </div>
                              <div className="text-[11px] text-slate-400 dark:text-slate-500 font-normal whitespace-nowrap mt-0.5">
                                Student ID : <span className="font-mono font-medium text-slate-700 dark:text-slate-300">{student.rollNumber || student.id}</span>
                              </div>
                            </td>
                            <td className="py-3 px-3.5 whitespace-nowrap">
                              <div className="flex items-center gap-1 font-semibold text-slate-800 dark:text-slate-200 text-[13px] whitespace-nowrap tracking-tight">
                                <span>{cls?.name || 'Class'}</span>
                                {batch?.name && (
                                  <>
                                    <span className="inline-block w-px h-3 bg-slate-300 dark:bg-slate-600 mx-1 shrink-0" aria-hidden="true" />
                                    <span className="text-slate-600 dark:text-slate-400 font-medium">{batch.name}</span>
                                  </>
                                )}
                              </div>
                              <div className="text-[11px] text-slate-400 dark:text-slate-500 font-normal whitespace-nowrap mt-0.5">
                                Join Date : {formatAdmDate(student.joiningDate)}
                              </div>
                              {(() => {
                                const effectiveDueDate = (student.feeType === 'yearly_package' || Boolean(student.yearlyPackage))
                                  ? (student.joiningDate || dueDateStr)
                                  : dueDateStr;
                                const overdueDays = isOver ? getOverdueDays(effectiveDueDate) : 0;
                                return (
                                  <div className={`text-[11px] font-normal whitespace-nowrap mt-0.5 flex items-center gap-1.5 ${
                                    isOver ? "text-rose-600 dark:text-rose-400 font-medium" : "text-slate-400 dark:text-slate-500"
                                  }`}>
                                    <span>Due Date : {formatAdmDate(effectiveDueDate)}</span>
                                    {isOver && overdueDays > 0 && (
                                      <span className="inline-flex flex-col items-start justify-center leading-none text-rose-600 dark:text-rose-400">
                                        <span className="flex items-baseline gap-0.5 leading-none">
                                          <span className="font-bold text-[11px] tabular-nums leading-none">{overdueDays}</span>
                                          <span className="text-[8.5px] font-medium leading-none">{overdueDays === 1 ? 'day' : 'days'}</span>
                                        </span>
                                        <span className="text-[8.5px] font-semibold leading-none mt-0.5">
                                          Overdue
                                        </span>
                                      </span>
                                    )}
                                  </div>
                                );
                              })()}
                            </td>
                            <td className="py-3 px-3.5 whitespace-nowrap">
                              {/* 1. Father Contact (Primary) */}
                              <div className="font-medium text-slate-800 dark:text-slate-200 text-[13px] font-mono tabular-nums whitespace-nowrap tracking-tight" title="Father Contact">
                                {student.fatherContact || student.contact1 || '—'}
                              </div>

                              {/* 2. Mother Contact (Smaller text) */}
                              {(student.motherContact || (student.contact2 && student.contact2 !== student.fatherContact && student.contact2 !== student.contact1)) && (
                                <div className="text-[11px] text-slate-400 dark:text-slate-500 font-mono tabular-nums whitespace-nowrap mt-0.5 leading-tight" title="Mother Contact">
                                  {student.motherContact || student.contact2}
                                </div>
                              )}

                              {/* 3. Student Contact (Smaller text) */}
                              {student.contact1 && student.contact1 !== student.fatherContact && (
                                <div className="text-[11px] text-slate-400 dark:text-slate-500 font-mono tabular-nums whitespace-nowrap mt-0.5 leading-tight" title="Student Contact">
                                  {student.contact1}
                                </div>
                              )}
                            </td>
                            <td className="py-3 px-3.5 text-right whitespace-nowrap">
                              <div className="font-semibold text-slate-900 dark:text-white text-[13.5px] tabular-nums tracking-tight whitespace-nowrap">
                                ₹{student.netFee.toLocaleString('en-IN')}
                                <span className="text-[11px] text-slate-400 font-normal ml-0.5">/mo</span>
                              </div>
                              {Boolean((student.scholarshipPercent && student.scholarshipPercent > 0) || (student.discountAmount && student.discountAmount > 0)) && (
                                <div className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 mt-0.5 tabular-nums whitespace-nowrap">
                                  {student.scholarshipPercent || Math.round(((student.discountAmount || 0) / (student.baseFee || 1)) * 100)}% Scholarship (-₹{Number(student.discountAmount !== undefined ? student.discountAmount : Math.round(((student.baseFee || 0) * (student.scholarshipPercent || 0)) / 100)).toLocaleString('en-IN')})
                                </div>
                              )}
                              {(() => {
                                const activeSubs = getActiveAdditionalSubjectsForMonth(student, selectedMonth || '2026-11');
                                if (activeSubs.length === 0) return null;
                                const totalFee = activeSubs.reduce((sum, s) => sum + (Number(s.fee) || 0), 0);
                                const subNames = activeSubs.map(s => `${s.name} (+₹${s.fee})`).join(', ');
                                return (
                                  <div
                                    className="text-[11px] font-medium text-indigo-600 dark:text-indigo-400 mt-0.5 cursor-help tabular-nums whitespace-nowrap"
                                    title={`Additional Subjects (${activeSubs.length}): ${subNames}`}
                                  >
                                    +{activeSubs.length} Addl Subj (+₹{totalFee.toLocaleString('en-IN')})
                                  </div>
                                );
                              })()}
                            </td>
                            <td className="py-3 px-3.5 text-center whitespace-nowrap align-middle">
                              <div className="flex flex-col items-center justify-center gap-1">
                                <span
                                  className={`h-[28px] min-w-[78px] px-2 inline-flex items-center justify-center text-[11px] font-semibold tracking-wider rounded-md whitespace-nowrap uppercase ${
                                    sStatus === 'active'
                                      ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200/70 dark:border-emerald-800/40'
                                      : 'bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border border-amber-200/70 dark:border-amber-800/40'
                                  }`}
                                >
                                  {sStatus}
                                </span>
                              </div>
                            </td>
                            <td className="py-3 px-3.5 text-right pr-5 whitespace-nowrap align-middle">
                              <div className="flex items-center justify-end">
                                {/* View Profile */}
                                <button
                                  type="button"
                                  onClick={() => setSelectedStudentProfile(student)}
                                  className="h-[28px] min-w-[78px] px-2.5 inline-flex items-center justify-center gap-1.5 text-[11px] font-semibold tracking-wider rounded-md border border-slate-200/80 dark:border-slate-700/80 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:text-[#2864E8] dark:hover:text-blue-400 hover:border-[#2864E8]/50 hover:bg-blue-50/40 dark:hover:bg-slate-800 transition-colors cursor-pointer uppercase shadow-2xs"
                                  title="View Details"
                                >
                                  <span>VIEW</span>
                                  <Eye className="w-3.5 h-3.5 shrink-0" />
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
        </TabsContent>

        {/* ------------------------------------------------------------------ */}
        {/* TAB 5: BRANCH FINANCIAL REPORTS */}
        {/* ------------------------------------------------------------------ */}
        <TabsContent value="reports" className="space-y-4 font-['Inter_Tight',sans-serif]">
          <Card className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-[0_1px_3px_rgba(15,23,42,0.03)] font-['Inter_Tight',sans-serif]">
            <CardHeader className="py-2.5 sm:py-3 px-4 sm:px-6 border-b border-slate-100 dark:border-slate-800/80">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div>
                  <CardTitle className="text-base sm:text-[17px] font-bold text-slate-900 dark:text-white tracking-tight uppercase">
                    BRANCH PERFORMANCE OVERVIEW
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-400 font-normal mt-0.5">
                    <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                      <PopoverTrigger asChild>
                        <button
                          type="button"
                          className="group inline-flex items-center gap-1.5 text-xs font-normal text-slate-400 hover:text-[#2864E8] dark:text-slate-400 dark:hover:text-blue-400 transition-colors cursor-pointer select-none py-0 focus:outline-none"
                          title="Click to view or change date range"
                        >
                          <span>{activeDateRangeLabel}</span>
                          <ChevronDown className="w-3 h-3 text-slate-400 group-hover:text-[#2864E8] transition-transform duration-200" />
                        </button>
                      </PopoverTrigger>
                    <PopoverContent align="start" className="w-80 p-4 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200/90 dark:border-slate-800 z-50">
                      <div className="space-y-3.5">
                        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                          <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-[#2864E8]" /> Select Date Range
                          </span>
                          {(customStartDate || customEndDate) && (
                            <button
                              type="button"
                              onClick={() => {
                                setCustomStartDate('');
                                setCustomEndDate('');
                                refreshAllData(selectedMonth, selectedBranch);
                              }}
                              className="text-[11px] font-semibold text-rose-600 hover:underline cursor-pointer"
                            >
                              Reset
                            </button>
                          )}
                        </div>

                        {/* Quick Presets */}
                        <div className="space-y-1.5">
                          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Quick Presets</span>
                          <div className="grid grid-cols-2 gap-1.5">
                            <button
                              type="button"
                              onClick={() => {
                                setCustomStartDate('2026-04-01');
                                setCustomEndDate('2027-03-31');
                                setBranchReportMode('yearly');
                                setIsCalendarOpen(false);
                                refreshAllData(selectedMonth, selectedBranch);
                              }}
                              className="text-left px-2.5 py-1.5 text-xs font-medium rounded-lg bg-slate-50 hover:bg-blue-50 hover:text-[#2864E8] dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                            >
                              FY 2026–27 (Full)
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setCustomStartDate('2026-11-01');
                                setCustomEndDate('2026-11-30');
                                setBranchReportMode('monthly');
                                setSelectedMonth('2026-11');
                                setIsCalendarOpen(false);
                                refreshAllData('2026-11', selectedBranch);
                              }}
                              className="text-left px-2.5 py-1.5 text-xs font-medium rounded-lg bg-slate-50 hover:bg-blue-50 hover:text-[#2864E8] dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                            >
                              November 2026
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setCustomStartDate('2026-10-01');
                                setCustomEndDate('2026-10-31');
                                setBranchReportMode('monthly');
                                setSelectedMonth('2026-10');
                                setIsCalendarOpen(false);
                                refreshAllData('2026-10', selectedBranch);
                              }}
                              className="text-left px-2.5 py-1.5 text-xs font-medium rounded-lg bg-slate-50 hover:bg-blue-50 hover:text-[#2864E8] dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                            >
                              October 2026
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setCustomStartDate('2026-04-01');
                                setCustomEndDate('2026-11-30');
                                setBranchReportMode('yearly');
                                setIsCalendarOpen(false);
                                refreshAllData(selectedMonth, selectedBranch);
                              }}
                              className="text-left px-2.5 py-1.5 text-xs font-medium rounded-lg bg-slate-50 hover:bg-blue-50 hover:text-[#2864E8] dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                            >
                              YTD (Apr – Nov)
                            </button>
                          </div>
                        </div>

                        {/* Custom From / To */}
                        <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Custom Range</span>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">From Date</label>
                              <input
                                type="date"
                                value={customStartDate || (branchReportMode === 'yearly' ? '2026-04-01' : '2026-11-01')}
                                onChange={(e) => setCustomStartDate(e.target.value)}
                                className="w-full text-xs font-semibold px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#2864E8]"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">To Date</label>
                              <input
                                type="date"
                                value={customEndDate || (branchReportMode === 'yearly' ? '2027-03-31' : '2026-11-30')}
                                onChange={(e) => setCustomEndDate(e.target.value)}
                                className="w-full text-xs font-semibold px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#2864E8]"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setCustomStartDate('');
                              setCustomEndDate('');
                              setIsCalendarOpen(false);
                              refreshAllData(selectedMonth, selectedBranch);
                            }}
                            className="text-xs h-8 px-3 rounded-lg cursor-pointer"
                          >
                            Clear
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            onClick={() => {
                              setIsCalendarOpen(false);
                              const startM = customStartDate ? customStartDate.slice(0, 7) : selectedMonth;
                              const endM = customEndDate ? customEndDate.slice(0, 7) : selectedMonth;
                              if (startM && endM && startM === endM) {
                                setBranchReportMode('monthly');
                                setSelectedMonth(startM);
                                refreshAllData(startM, selectedBranch);
                              } else {
                                setBranchReportMode('yearly');
                                refreshAllData(selectedMonth, selectedBranch);
                              }
                            }}
                            className="text-xs h-8 px-4 rounded-lg bg-[#2864E8] hover:bg-blue-600 text-white font-bold cursor-pointer"
                          >
                            Apply Range
                          </Button>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                </CardDescription>
              </div>

              {/* FILTER CONTROLS ON THE RIGHT */}
              <div className="flex items-center gap-2 sm:gap-2.5 shrink-0 justify-end">
                {/* View Mode Toggle: Monthly vs Yearly */}
                <div className="inline-flex items-center gap-2">
                  <button
                    type="button"
                    data-report-toggle="monthly"
                    onClick={() => {
                      setBranchReportMode('monthly');
                      refreshAllData(selectedMonth, selectedBranch);
                    }}
                    className={`h-7 flex items-center gap-1.5 px-1.5 text-xs transition-colors cursor-pointer bg-transparent border-0 shadow-none focus:outline-none focus:ring-0 ${
                      branchReportMode === 'monthly'
                        ? 'text-[#2864E8] font-bold'
                        : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white font-medium'
                    }`}
                  >
                    <Calendar className={`w-3.5 h-3.5 ${branchReportMode === 'monthly' ? 'text-[#2864E8]' : 'text-slate-400'}`} />
                    <span>Monthly</span>
                  </button>
                  <button
                    type="button"
                    data-report-toggle="yearly"
                    onClick={() => {
                      setBranchReportMode('yearly');
                      refreshAllData(selectedMonth, selectedBranch);
                    }}
                    className={`h-7 flex items-center gap-1.5 px-1.5 text-xs transition-colors cursor-pointer bg-transparent border-0 shadow-none focus:outline-none focus:ring-0 ${
                      branchReportMode === 'yearly'
                        ? 'text-[#2864E8] font-bold'
                        : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white font-medium'
                    }`}
                  >
                    <BarChart3 className={`w-3.5 h-3.5 ${branchReportMode === 'yearly' ? 'text-[#2864E8]' : 'text-slate-400'}`} />
                    <span>Yearly</span>
                  </button>
                </div>

                {/* Real-time Sync Button */}
                <button
                  type="button"
                  onClick={() => refreshAllData(selectedMonth, selectedBranch)}
                  disabled={isPending}
                  className="h-7 inline-flex items-center gap-1 px-2 text-xs font-semibold text-slate-500 hover:text-[#2864E8] dark:text-slate-400 transition-colors cursor-pointer rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800"
                  title="Refresh branch report data in real time"
                >
                  <RefreshCw className={`w-3 h-3 text-[#2864E8] ${isPending ? 'animate-spin' : ''}`} />
                  <span className="hidden sm:inline">Sync</span>
                </button>
              </div>
            </div>
          </CardHeader>

            <CardContent className="p-0">
              {/* ------------------------------------------------------------ */}
              {/* MODE 1: MONTHLY REPORT */}
              {/* ------------------------------------------------------------ */}
              {branchReportMode === 'monthly' && (
                <>
                  {/* Case A: All Branches Monthly Comparison */}
                  {selectedBranch === 'all' ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs sm:text-sm">
                        <thead className="bg-slate-50/70 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider text-[10.5px] border-b border-slate-200/70 dark:border-slate-800">
                          <tr>
                            <th className="py-2.5 sm:py-3 px-3.5 pl-5 whitespace-nowrap">Branch Name</th>
                            <th className="py-2.5 sm:py-3 px-3.5 whitespace-nowrap">Center Address</th>
                            <th className="py-2.5 sm:py-3 px-3.5 text-center whitespace-nowrap">Active Students</th>
                            <th className="py-2.5 sm:py-3 px-3.5 text-right whitespace-nowrap">Expected Revenue</th>
                            <th className="py-2.5 sm:py-3 px-3.5 text-right whitespace-nowrap">Collected Revenue</th>
                            <th className="py-2.5 sm:py-3 px-3.5 text-right whitespace-nowrap">Pending Balance</th>
                            <th className="py-2.5 sm:py-3 px-3.5 text-center pr-5 whitespace-nowrap">Collection %</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/70">
                          {sortBranchesAlphabetical(stats.branchBreakdown).map(b => {
                            const rate = b.expectedFee > 0 ? Math.round((b.receivedFee / b.expectedFee) * 100) : 0;
                            const branchInfo = IDL_BRANCHES.find(br => br.id === b.branchId || (b.branchId === 'mangolpuri' && br.id === 'mangol-puri'));
                            return (
                              <tr key={b.branchId} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                                <td className="py-3 px-3.5 pl-5 font-semibold text-slate-900 dark:text-white text-[13px] whitespace-nowrap tracking-tight">
                                  {b.branchName}
                                </td>
                                <td className="py-3 px-3.5 text-slate-400 dark:text-slate-500 text-[11px] font-normal whitespace-nowrap">
                                  {branchInfo?.address || 'Delhi'}
                                </td>
                                <td className="py-3 px-3.5 text-center whitespace-nowrap">
                                  <span className="inline-flex items-center justify-center min-w-[22px] px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[11px] font-semibold text-slate-600 dark:text-slate-300 tabular-nums">
                                    {b.studentCount}
                                  </span>
                                </td>
                                <td className="py-3 px-3.5 text-right font-medium text-slate-900 dark:text-white text-[13px] tabular-nums whitespace-nowrap tracking-tight">
                                  ₹{b.expectedFee.toLocaleString('en-IN')}
                                </td>
                                <td className="py-3 px-3.5 text-right font-bold text-emerald-600 dark:text-emerald-400 text-[13px] tabular-nums whitespace-nowrap tracking-tight">
                                  ₹{b.receivedFee.toLocaleString('en-IN')}
                                </td>
                                <td className="py-3 px-3.5 text-right font-bold text-amber-600 dark:text-amber-400 text-[13px] tabular-nums whitespace-nowrap tracking-tight">
                                  ₹{b.pendingFee.toLocaleString('en-IN')}
                                </td>
                                <td className="py-3 px-3.5 text-center pr-5 whitespace-nowrap">
                                  <span className={`text-[12px] font-bold tabular-nums ${
                                    rate >= 75
                                      ? 'text-emerald-600 dark:text-emerald-400'
                                      : 'text-amber-600 dark:text-amber-400'
                                  }`}>
                                    {rate}%
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                        <tfoot className="bg-slate-50/90 dark:bg-slate-800/60 border-t border-slate-200/80 dark:border-slate-700 text-slate-900 dark:text-white text-xs sm:text-sm">
                          <tr>
                            <td className="py-3 px-3.5 pl-5 font-bold text-slate-900 dark:text-white whitespace-nowrap">
                              Total (All Branches)
                            </td>
                            <td className="py-3 px-3.5 text-slate-400 dark:text-slate-500 text-[11px] font-normal whitespace-nowrap">Delhi-NCR Network</td>
                            <td className="py-3 px-3.5 text-center whitespace-nowrap">
                              <span className="inline-flex items-center justify-center min-w-[22px] px-1.5 py-0.5 rounded-md bg-slate-200/70 dark:bg-slate-700 text-[11px] font-bold text-slate-800 dark:text-slate-100 tabular-nums">
                                {stats.branchBreakdown.reduce((sum, b) => sum + b.studentCount, 0)}
                              </span>
                            </td>
                            <td className="py-3 px-3.5 text-right font-semibold text-slate-900 dark:text-white text-[13px] tabular-nums whitespace-nowrap tracking-tight">
                              ₹{stats.branchBreakdown.reduce((sum, b) => sum + b.expectedFee, 0).toLocaleString('en-IN')}
                            </td>
                            <td className="py-3 px-3.5 text-right font-bold text-emerald-600 dark:text-emerald-400 text-[13px] tabular-nums whitespace-nowrap tracking-tight">
                              ₹{stats.branchBreakdown.reduce((sum, b) => sum + b.receivedFee, 0).toLocaleString('en-IN')}
                            </td>
                            <td className="py-3 px-3.5 text-right font-bold text-amber-600 dark:text-amber-400 text-[13px] tabular-nums whitespace-nowrap tracking-tight">
                              ₹{stats.branchBreakdown.reduce((sum, b) => sum + b.pendingFee, 0).toLocaleString('en-IN')}
                            </td>
                            <td className="py-3 px-3.5 text-center pr-5 whitespace-nowrap">
                              {(() => {
                                const totExp = stats.branchBreakdown.reduce((sum, b) => sum + b.expectedFee, 0);
                                const totRec = stats.branchBreakdown.reduce((sum, b) => sum + b.receivedFee, 0);
                                const totRate = totExp > 0 ? Math.round((totRec / totExp) * 100) : 0;
                                return (
                                  <span className="text-[12px] font-bold text-[#2864E8] dark:text-blue-400 tabular-nums">
                                    {totRate}%
                                  </span>
                                );
                              })()}
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  ) : (
                    /* Case B: Particular Branch Selected -> Only That Branch's Month Report */
                    <div className="p-4 sm:p-5 space-y-5">
                      {(() => {
                        const curBranch = stats.branchBreakdown.find(
                          b => b.branchId === selectedBranch ||
                               (selectedBranch === 'mangolpuri' && b.branchId === 'mangol-puri') ||
                               (selectedBranch === 'mangol-puri' && b.branchId === 'mangolpuri')
                        );
                        const rate = curBranch && curBranch.expectedFee > 0
                          ? Math.round((curBranch.receivedFee / curBranch.expectedFee) * 100)
                          : 0;
                        const branchClasses = classes.filter(
                          c => c.branchId === selectedBranch ||
                               (selectedBranch === 'mangolpuri' && c.branchId === 'mangol-puri') ||
                               (selectedBranch === 'mangol-puri' && c.branchId === 'mangolpuri')
                        );

                        return (
                          <div className="space-y-5">
                            {/* Branch KPI Metric Cards */}
                            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                              <div className="p-3 sm:p-3.5 rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs flex items-center justify-between">
                                <div>
                                  <p className="text-[10.5px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Active Students</p>
                                  <p className="text-lg sm:text-[19px] font-bold text-slate-900 dark:text-white mt-0.5 tracking-tight tabular-nums">
                                    {curBranch?.studentCount || 0}
                                  </p>
                                </div>
                                <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 shrink-0">
                                  <Users className="w-4 h-4" />
                                </div>
                              </div>

                              <div className="p-3 sm:p-3.5 rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs flex items-center justify-between">
                                <div>
                                  <p className="text-[10.5px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Expected Fee</p>
                                  <p className="text-lg sm:text-[19px] font-bold text-slate-900 dark:text-white mt-0.5 tracking-tight tabular-nums">
                                    ₹{(curBranch?.expectedFee || 0).toLocaleString('en-IN')}
                                  </p>
                                </div>
                                <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 shrink-0">
                                  <IndianRupee className="w-4 h-4" />
                                </div>
                              </div>

                              <div className="p-3 sm:p-3.5 rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs flex items-center justify-between">
                                <div>
                                  <p className="text-[10.5px] font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">Collected</p>
                                  <p className="text-lg sm:text-[19px] font-bold text-emerald-600 dark:text-emerald-400 mt-0.5 tracking-tight tabular-nums">
                                    ₹{(curBranch?.receivedFee || 0).toLocaleString('en-IN')}
                                  </p>
                                </div>
                                <div className="w-8 h-8 rounded-full bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                                  <CheckCircle2 className="w-4 h-4" />
                                </div>
                              </div>

                              <div className="p-3 sm:p-3.5 rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs flex items-center justify-between">
                                <div>
                                  <p className="text-[10.5px] font-semibold text-amber-700 dark:text-amber-400 uppercase tracking-wider">Pending Dues</p>
                                  <p className="text-lg sm:text-[19px] font-bold text-amber-600 dark:text-amber-400 mt-0.5 tracking-tight tabular-nums">
                                    ₹{(curBranch?.pendingFee || 0).toLocaleString('en-IN')}
                                  </p>
                                </div>
                                <div className="w-8 h-8 rounded-full bg-amber-50 dark:bg-amber-950/50 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
                                  <AlertTriangle className="w-4 h-4" />
                                </div>
                              </div>

                              {/* Collection % Tile with Round Circular Progress Graph */}
                              <div className="p-2.5 sm:p-3 rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs col-span-2 sm:col-span-1 flex flex-col items-center justify-center text-center">
                                <p className="text-[10.5px] font-semibold text-[#2864E8] dark:text-blue-400 uppercase tracking-wider mb-1">Collection %</p>
                                <div className="relative w-12 h-12 flex items-center justify-center">
                                  <svg className="w-12 h-12 -rotate-90" viewBox="0 0 48 48">
                                    <circle
                                      cx="24"
                                      cy="24"
                                      r="19"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="4"
                                      className="text-slate-100 dark:text-slate-800"
                                    />
                                    <circle
                                      cx="24"
                                      cy="24"
                                      r="19"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="4"
                                      strokeLinecap="round"
                                      strokeDasharray={2 * Math.PI * 19}
                                      strokeDashoffset={2 * Math.PI * 19 * (1 - Math.min(100, Math.max(0, rate)) / 100)}
                                      className={`${rate >= 75 ? 'text-emerald-500' : 'text-[#2864E8]'} transition-all duration-700 ease-out`}
                                    />
                                  </svg>
                                  <span className="absolute text-[11px] font-bold text-slate-900 dark:text-white tabular-nums">
                                    {rate}%
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Branch Class Breakdown Table */}
                            <div className="border border-slate-200/70 dark:border-slate-800 rounded-xl overflow-hidden shadow-2xs">
                              <div className="px-4 py-2.5 bg-slate-50/70 dark:bg-slate-800/50 border-b border-slate-200/70 dark:border-slate-800 flex items-center justify-between">
                                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                                  Active Classes in {IDL_BRANCHES.find(b => b.id === selectedBranch)?.name || selectedBranch} ({branchClasses.length})
                                </span>
                                <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500">
                                  Monthly Summary
                                </span>
                              </div>
                              <table className="w-full text-left text-xs sm:text-sm">
                                <thead className="bg-slate-50/70 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider text-[10.5px] border-b border-slate-200/70 dark:border-slate-800">
                                  <tr>
                                    <th className="py-2.5 sm:py-3 px-3.5 pl-4 whitespace-nowrap">Class / Course</th>
                                    <th className="py-2.5 sm:py-3 px-3.5 whitespace-nowrap">Session</th>
                                    <th className="py-2.5 sm:py-3 px-3.5 text-right whitespace-nowrap">Standard Fee</th>
                                    <th className="py-2.5 sm:py-3 px-3.5 text-center pr-4 whitespace-nowrap">Branch Status</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/70">
                                  {branchClasses.length === 0 ? (
                                    <tr>
                                      <td colSpan={4} className="py-6 text-center text-xs text-slate-400">
                                        No classes registered under this branch yet.
                                      </td>
                                    </tr>
                                  ) : (
                                    branchClasses.map(c => (
                                      <tr key={c.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                                        <td className="py-3 px-3.5 pl-4 font-semibold text-slate-900 dark:text-white text-[13px] whitespace-nowrap tracking-tight">
                                          {c.name}
                                        </td>
                                        <td className="py-3 px-3.5 text-slate-400 dark:text-slate-500 text-[11px] font-normal whitespace-nowrap">{c.academicSession || '2026-27'}</td>
                                        <td className="py-3 px-3.5 text-right font-medium text-slate-900 dark:text-white text-[13px] tabular-nums whitespace-nowrap tracking-tight">
                                          ₹{c.defaultMonthlyFee.toLocaleString('en-IN')}
                                        </td>
                                        <td className="py-3 px-3.5 text-center pr-4 whitespace-nowrap">
                                          <span className="inline-flex px-2 py-0.5 rounded-md text-[10.5px] font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/50">
                                            Active
                                          </span>
                                        </td>
                                      </tr>
                                    ))
                                  )}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  )}
                </>
              )}

              {/* ------------------------------------------------------------ */}
              {/* MODE 2: YEARLY REPORT (ACADEMIC SESSION 2026-27) */}
              {/* ------------------------------------------------------------ */}
              {branchReportMode === 'yearly' && (
                <>
                  {isLoadingYearly ? (
                    <div className="p-12 text-center text-xs font-semibold text-slate-500 flex items-center justify-center gap-2">
                      <RefreshCw className="w-4 h-4 animate-spin text-[#2864E8]" />
                      <span>Loading Yearly Academic Session Data...</span>
                    </div>
                  ) : selectedBranch === 'all' ? (
                    /* Case C: All Branches Yearly Comparison */
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs sm:text-sm">
                        <thead className="bg-slate-50/70 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider text-[10.5px] border-b border-slate-200/70 dark:border-slate-800">
                          <tr>
                            <th className="py-2.5 sm:py-3 px-3.5 pl-5 whitespace-nowrap">Branch Name</th>
                            <th className="py-2.5 sm:py-3 px-3.5 whitespace-nowrap">Center Address</th>
                            <th className="py-2.5 sm:py-3 px-3.5 text-center whitespace-nowrap">Enrolled Students</th>
                            <th className="py-2.5 sm:py-3 px-3.5 text-right whitespace-nowrap">Annual Expected</th>
                            <th className="py-2.5 sm:py-3 px-3.5 text-right whitespace-nowrap">Annual Collected</th>
                            <th className="py-2.5 sm:py-3 px-3.5 text-right whitespace-nowrap">Annual Pending</th>
                            <th className="py-2.5 sm:py-3 px-3.5 text-center pr-5 whitespace-nowrap">Annual Rate %</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/70">
                          {sortBranchesAlphabetical(yearlyReport?.branches || []).map(b => (
                            <tr key={b.branchId} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                              <td className="py-3 px-3.5 pl-5 font-semibold text-slate-900 dark:text-white text-[13px] whitespace-nowrap tracking-tight">
                                {b.branchName}
                              </td>
                              <td className="py-3 px-3.5 text-slate-400 dark:text-slate-500 text-[11px] font-normal whitespace-nowrap">
                                {b.address}
                              </td>
                              <td className="py-3 px-3.5 text-center font-medium text-slate-700 dark:text-slate-300 text-[13px] tabular-nums whitespace-nowrap">
                                {b.activeStudents}
                              </td>
                              <td className="py-3 px-3.5 text-right font-medium text-slate-900 dark:text-white text-[13px] tabular-nums whitespace-nowrap tracking-tight">
                                ₹{b.annualExpected.toLocaleString('en-IN')}
                              </td>
                              <td className="py-3 px-3.5 text-right font-semibold text-emerald-600 dark:text-emerald-400 text-[13px] tabular-nums whitespace-nowrap">
                                ₹{b.annualReceived.toLocaleString('en-IN')}
                              </td>
                              <td className="py-3 px-3.5 text-right font-semibold text-amber-600 dark:text-amber-400 text-[13px] tabular-nums whitespace-nowrap">
                                ₹{b.annualPending.toLocaleString('en-IN')}
                              </td>
                              <td className="py-3 px-3.5 text-center pr-5 whitespace-nowrap">
                                <span className={`text-[12px] font-bold tabular-nums ${
                                  b.annualRate >= 75
                                    ? 'text-emerald-600 dark:text-emerald-400'
                                    : 'text-amber-600 dark:text-amber-400'
                                }`}>
                                  {b.annualRate}%
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot className="bg-slate-50/90 dark:bg-slate-900/80 border-t border-slate-200/70 dark:border-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm">
                          <tr>
                            <td className="py-3 px-3.5 pl-5 font-bold text-slate-900 dark:text-white text-[13px] whitespace-nowrap">
                              Total Institute (Annual 2026–27)
                            </td>
                            <td className="py-3 px-3.5 text-slate-400 dark:text-slate-500 text-[11px] font-normal whitespace-nowrap">Delhi-NCR Network</td>
                            <td className="py-3 px-3.5 text-center font-bold text-slate-900 dark:text-white text-[13px] tabular-nums whitespace-nowrap">
                              {yearlyReport?.totals.activeStudents || 0}
                            </td>
                            <td className="py-3 px-3.5 text-right font-medium text-slate-900 dark:text-white text-[13px] tabular-nums whitespace-nowrap">
                              ₹{(yearlyReport?.totals.annualExpected || 0).toLocaleString('en-IN')}
                            </td>
                            <td className="py-3 px-3.5 text-right font-bold text-emerald-600 dark:text-emerald-400 text-[13px] tabular-nums whitespace-nowrap">
                              ₹{(yearlyReport?.totals.annualReceived || 0).toLocaleString('en-IN')}
                            </td>
                            <td className="py-3 px-3.5 text-right font-bold text-amber-600 dark:text-amber-400 text-[13px] tabular-nums whitespace-nowrap">
                              ₹{(yearlyReport?.totals.annualPending || 0).toLocaleString('en-IN')}
                            </td>
                            <td className="py-3 px-3.5 text-center pr-5 whitespace-nowrap">
                              <span className="text-[12px] font-bold text-[#2864E8] dark:text-blue-400 tabular-nums">
                                {yearlyReport?.totals.annualRate || 0}%
                              </span>
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  ) : (
                    /* Case D: Particular Branch Selected -> Month-by-Month Trend for Full Year */
                    <div className="p-5 space-y-6">
                      {(() => {
                        const curBranchYearly = yearlyReport?.branches.find(
                          b => b.branchId === selectedBranch ||
                               (selectedBranch === 'mangolpuri' && b.branchId === 'mangol-puri') ||
                               (selectedBranch === 'mangol-puri' && b.branchId === 'mangolpuri')
                        );

                        if (!curBranchYearly) {
                          return (
                            <p className="text-center text-xs text-slate-400 py-6">
                              No yearly record available for this branch.
                            </p>
                          );
                        }

                        return (
                          <div className="space-y-5">
                            {/* Branch Annual KPI Metric Cards */}
                            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                              <div className="p-3 sm:p-3.5 rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs flex items-center justify-between">
                                <div>
                                  <p className="text-[10.5px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Enrolled Students</p>
                                  <p className="text-lg sm:text-[19px] font-bold text-slate-900 dark:text-white tracking-tight mt-0.5 tabular-nums">
                                    {curBranchYearly.activeStudents}
                                  </p>
                                </div>
                                <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 shrink-0">
                                  <Users className="w-3.5 h-3.5" />
                                </div>
                              </div>

                              <div className="p-3 sm:p-3.5 rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs flex items-center justify-between">
                                <div>
                                  <p className="text-[10.5px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Annual Expected</p>
                                  <p className="text-lg sm:text-[19px] font-bold text-slate-900 dark:text-white tracking-tight mt-0.5 tabular-nums">
                                    ₹{curBranchYearly.annualExpected.toLocaleString('en-IN')}
                                  </p>
                                </div>
                                <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 shrink-0">
                                  <IndianRupee className="w-3.5 h-3.5" />
                                </div>
                              </div>

                              <div className="p-3 sm:p-3.5 rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs flex items-center justify-between">
                                <div>
                                  <p className="text-[10.5px] font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">Annual Received</p>
                                  <p className="text-lg sm:text-[19px] font-bold text-emerald-600 dark:text-emerald-400 tracking-tight mt-0.5 tabular-nums">
                                    ₹{curBranchYearly.annualReceived.toLocaleString('en-IN')}
                                  </p>
                                </div>
                                <div className="w-8 h-8 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                </div>
                              </div>

                              <div className="p-3 sm:p-3.5 rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs flex items-center justify-between">
                                <div>
                                  <p className="text-[10.5px] font-semibold text-amber-700 dark:text-amber-400 uppercase tracking-wider">Annual Pending</p>
                                  <p className="text-lg sm:text-[19px] font-bold text-amber-600 dark:text-amber-400 tracking-tight mt-0.5 tabular-nums">
                                    ₹{curBranchYearly.annualPending.toLocaleString('en-IN')}
                                  </p>
                                </div>
                                <div className="w-8 h-8 rounded-full bg-amber-50 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-800/40 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
                                  <AlertTriangle className="w-3.5 h-3.5" />
                                </div>
                              </div>

                              {/* Annual Rate Tile with Round Circular Progress Graph */}
                              <div className="p-2 sm:p-2.5 rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs col-span-2 sm:col-span-1 flex flex-col items-center justify-center text-center">
                                <p className="text-[10.5px] font-semibold text-[#2864E8] dark:text-blue-400 uppercase tracking-wider mb-1">Annual Rate</p>
                                <div className="relative w-12 h-12 flex items-center justify-center">
                                  <svg className="w-12 h-12 -rotate-90" viewBox="0 0 48 48">
                                    <circle
                                      cx="24"
                                      cy="24"
                                      r="19"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="4"
                                      className="text-slate-100 dark:text-slate-800"
                                    />
                                    <circle
                                      cx="24"
                                      cy="24"
                                      r="19"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="4"
                                      strokeLinecap="round"
                                      strokeDasharray={2 * Math.PI * 19}
                                      strokeDashoffset={2 * Math.PI * 19 * (1 - Math.min(100, Math.max(0, curBranchYearly.annualRate)) / 100)}
                                      className={`${curBranchYearly.annualRate >= 75 ? 'text-emerald-500' : 'text-[#2864E8]'} transition-all duration-700 ease-out`}
                                    />
                                  </svg>
                                  <span className="absolute text-[12px] font-bold text-slate-900 dark:text-white tabular-nums">
                                    {curBranchYearly.annualRate}%
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Month-by-Month Table for this Branch */}
                            <div className="border border-slate-200/70 dark:border-slate-800 rounded-xl overflow-hidden shadow-2xs">
                              <div className="px-4 py-2.5 bg-slate-50/70 dark:bg-slate-800/50 border-b border-slate-200/70 dark:border-slate-800 flex items-center justify-between">
                                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                                  Month-by-Month Session Breakdown ({curBranchYearly.branchName})
                                </span>
                                <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500">
                                  Session 2026-27 (Apr 2026 – Mar 2027)
                                </span>
                              </div>
                              <table className="w-full text-left text-xs sm:text-sm">
                                <thead className="bg-slate-50/70 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider text-[10.5px] border-b border-slate-200/70 dark:border-slate-800">
                                  <tr>
                                    <th className="py-2.5 sm:py-3 px-3.5 pl-4 whitespace-nowrap">Month</th>
                                    <th className="py-2.5 sm:py-3 px-3.5 text-center whitespace-nowrap">Active Students</th>
                                    <th className="py-2.5 sm:py-3 px-3.5 text-right whitespace-nowrap">Expected Revenue</th>
                                    <th className="py-2.5 sm:py-3 px-3.5 text-right whitespace-nowrap">Collected Revenue</th>
                                    <th className="py-2.5 sm:py-3 px-3.5 text-right whitespace-nowrap">Pending Balance</th>
                                    <th className="py-2.5 sm:py-3 px-3.5 text-center pr-4 whitespace-nowrap">Collection %</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/70">
                                  {curBranchYearly.monthData.map(m => (
                                    <tr key={m.month} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                                      <td className="py-3 px-3.5 pl-4 font-semibold text-slate-900 dark:text-white text-[13px] whitespace-nowrap tracking-tight">
                                        {m.monthLabel}
                                      </td>
                                      <td className="py-3 px-3.5 text-center font-medium text-slate-700 dark:text-slate-300 text-[13px] tabular-nums whitespace-nowrap">
                                        {m.studentCount}
                                      </td>
                                      <td className="py-3 px-3.5 text-right font-medium text-slate-900 dark:text-white text-[13px] tabular-nums whitespace-nowrap tracking-tight">
                                        ₹{m.expected.toLocaleString('en-IN')}
                                      </td>
                                      <td className="py-3 px-3.5 text-right font-semibold text-emerald-600 dark:text-emerald-400 text-[13px] tabular-nums whitespace-nowrap">
                                        ₹{m.received.toLocaleString('en-IN')}
                                      </td>
                                      <td className="py-3 px-3.5 text-right font-semibold text-amber-600 dark:text-amber-400 text-[13px] tabular-nums whitespace-nowrap">
                                        ₹{m.pending.toLocaleString('en-IN')}
                                      </td>
                                      <td className="py-3 px-3.5 text-center pr-4 whitespace-nowrap">
                                        <span className={`text-[12px] font-bold tabular-nums ${
                                          m.rate >= 75
                                            ? 'text-emerald-600 dark:text-emerald-400'
                                            : 'text-amber-600 dark:text-amber-400'
                                        }`}>
                                          {m.rate}%
                                        </span>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                                <tfoot className="bg-slate-50/90 dark:bg-slate-900/80 border-t border-slate-200/70 dark:border-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm">
                                  <tr>
                                    <td className="py-3 px-3.5 pl-4 font-bold text-slate-900 dark:text-white text-[13px] whitespace-nowrap">
                                      Annual Total
                                    </td>
                                    <td className="py-3 px-3.5 text-center font-bold text-slate-900 dark:text-white text-[13px] tabular-nums whitespace-nowrap">
                                      {curBranchYearly.activeStudents}
                                    </td>
                                    <td className="py-3 px-3.5 text-right text-slate-900 dark:text-white font-medium text-[13px] tabular-nums whitespace-nowrap">
                                      ₹{curBranchYearly.annualExpected.toLocaleString('en-IN')}
                                    </td>
                                    <td className="py-3 px-3.5 text-right text-emerald-600 dark:text-emerald-400 font-bold text-[13px] tabular-nums whitespace-nowrap">
                                      ₹{curBranchYearly.annualReceived.toLocaleString('en-IN')}
                                    </td>
                                    <td className="py-3 px-3.5 text-right text-amber-600 dark:text-amber-400 font-bold text-[13px] tabular-nums whitespace-nowrap">
                                      ₹{curBranchYearly.annualPending.toLocaleString('en-IN')}
                                    </td>
                                    <td className="py-3 px-3.5 text-center pr-4 whitespace-nowrap">
                                      <span className="text-[12px] font-bold text-[#2864E8] dark:text-blue-400 tabular-nums">
                                        {curBranchYearly.annualRate}%
                                      </span>
                                    </td>
                                  </tr>
                                </tfoot>
                              </table>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* -------------------------------------------------------------------- */}
      {/* MODAL 1: CREATE CLASS (Matching CREATE ACADEMIC BATCH Design System) */}
      {/* -------------------------------------------------------------------- */}
      <Dialog open={isClassModalOpen} onOpenChange={setIsClassModalOpen}>
        <FormModalDialogContent
          maxWidthClass="max-w-[480px] sm:max-w-[530px]"
          hideCloseButton={true}
          className="w-[94vw] sm:w-[92vw] p-0 shadow-[0_20px_50px_-12px_rgba(15,23,42,0.18),0_2px_8px_rgba(15,23,42,0.06)] !rounded-[6px] sm:!rounded-[8px] border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-950 flex flex-col overflow-hidden max-h-[90vh]"
        >
          {/* Header: Height exactly matching name field height (h-[34px] sm:h-[36px]) */}
          <div className="h-[34px] sm:h-[36px] flex items-center justify-between px-4 sm:px-5 border-b border-slate-100 dark:border-slate-800/80 bg-white dark:bg-slate-950 shrink-0">
            <span className="text-[12px] sm:text-[12.5px] font-bold tracking-[0.05em] uppercase text-slate-800 dark:text-slate-100 block">
              CREATE ACADEMIC CLASS
            </span>
            <button
              type="button"
              onClick={() => setIsClassModalOpen(false)}
              className="w-6 h-6 -mr-1 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-3.5 h-3.5 stroke-[2.2]" />
            </button>
          </div>

          <DialogHeader className="sr-only">
            <DialogTitle>Create Academic Class</DialogTitle>
            <DialogDescription>Define a new class/course and assign it to an IDL Education branch.</DialogDescription>
          </DialogHeader>

          <form
            onSubmit={handleCreateClass}
            className="p-4 sm:p-5 space-y-3 sm:space-y-3.5 overflow-y-auto"
            autoComplete="off"
          >
            {/* Row 1: Class Name & Class Division */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5">
              <div className="space-y-1">
                <Input
                  placeholder="Class Name *"
                  value={classForm.name}
                  onChange={e => setClassForm({ ...classForm, name: e.target.value })}
                  required
                  className="h-[34px] sm:h-[36px] w-full border-0 border-b border-slate-200/90 dark:border-slate-700/80 !bg-transparent rounded-none px-0 text-[13px] sm:text-[13.5px] md:text-[14px] font-medium text-slate-900 dark:text-slate-100 placeholder:text-[9.5px] sm:placeholder:text-[10px] placeholder:text-slate-400 focus:outline-none focus:ring-0 focus:border-slate-300 dark:focus:border-slate-600 focus:shadow-none focus-visible:outline-none focus-visible:ring-0 focus-visible:shadow-none shadow-none"
                />
              </div>

              <div className="space-y-1">
                <Input
                  placeholder="Class Division *"
                  value={classForm.division}
                  onChange={e => setClassForm({ ...classForm, division: e.target.value })}
                  className="h-[34px] sm:h-[36px] w-full border-0 border-b border-slate-200/90 dark:border-slate-700/80 !bg-transparent rounded-none px-0 text-[13px] sm:text-[13.5px] md:text-[14px] font-medium text-slate-900 dark:text-slate-100 placeholder:text-[9.5px] sm:placeholder:text-[10px] placeholder:text-slate-400 focus:outline-none focus:ring-0 focus:border-slate-300 dark:focus:border-slate-600 focus:shadow-none focus-visible:outline-none focus-visible:ring-0 focus-visible:shadow-none shadow-none"
                />
              </div>
            </div>

            {/* Row 2: Branch & Academic Session */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5">
              <div className="space-y-1">
                <Select
                  value={classForm.branchId}
                  onValueChange={val => setClassForm({ ...classForm, branchId: val })}
                >
                  <SelectTrigger className="h-[34px] sm:h-[36px] w-full border-0 border-b border-slate-200/90 dark:border-slate-700/80 !bg-transparent rounded-none px-0 text-[13px] sm:text-[13.5px] md:text-[14px] font-medium text-slate-900 dark:text-slate-100 [&>span]:text-[13px] sm:[&>span]:text-[13.5px] md:[&>span]:text-[14px] [&>span]:font-medium [&>span]:text-slate-900 dark:[&>span]:text-slate-100 data-[placeholder]:!text-slate-400 [&[data-placeholder]>span]:!text-slate-400 [&[data-placeholder]>span]:!text-[9.5px] sm:[&[data-placeholder]>span]:!text-[10px] [&[data-placeholder]>span]:!font-normal focus:outline-none focus:ring-0 focus:border-slate-300 dark:focus:border-slate-600 focus:shadow-none focus-visible:outline-none focus-visible:ring-0 focus-visible:shadow-none shadow-none flex items-center justify-between">
                    <SelectValue placeholder="Branch *" />
                  </SelectTrigger>
                  <SelectContent>
                    {IDL_BRANCHES.filter(b => b.id !== 'all').map(b => (
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
                  value={classForm.academicSession}
                  onChange={e => setClassForm({ ...classForm, academicSession: e.target.value })}
                  className="h-[34px] sm:h-[36px] w-full border-0 border-b border-slate-200/90 dark:border-slate-700/80 !bg-transparent rounded-none px-0 text-[13px] sm:text-[13.5px] md:text-[14px] font-medium text-slate-900 dark:text-slate-100 placeholder:text-[9.5px] sm:placeholder:text-[10px] placeholder:text-slate-400 focus:outline-none focus:ring-0 focus:border-slate-300 dark:focus:border-slate-600 focus:shadow-none focus-visible:outline-none focus-visible:ring-0 focus-visible:shadow-none shadow-none"
                />
              </div>
            </div>

            {/* Row 3: Display Order */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5">
              <div className="space-y-1">
                <Input
                  type="number"
                  min="1"
                  placeholder="Card Order Number (e.g. 1, 2)"
                  value={classForm.order !== undefined ? classForm.order : ''}
                  onChange={e => setClassForm({ ...classForm, order: e.target.value === '' ? '' : Number(e.target.value) })}
                  className="h-[34px] sm:h-[36px] w-full border-0 border-b border-slate-200/90 dark:border-slate-700/80 !bg-transparent rounded-none px-0 text-[13px] sm:text-[13.5px] md:text-[14px] font-medium text-slate-900 dark:text-slate-100 placeholder:text-[9.5px] sm:placeholder:text-[10px] placeholder:text-slate-400 focus:outline-none focus:ring-0 focus:border-slate-300 dark:focus:border-slate-600 focus:shadow-none focus-visible:outline-none focus-visible:ring-0 focus-visible:shadow-none shadow-none"
                />
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isPending}
              className="w-full h-9 sm:h-9 text-[11.5px] sm:text-[12px] font-bold tracking-[0.06em] uppercase rounded-[5px] sm:rounded-[6px] bg-[#2864E8] hover:bg-[#1E4ED8] text-white shadow-none transition-all flex items-center justify-center gap-1.5 cursor-pointer mt-1 sm:mt-1.5 group"
            >
              <span>CREATE CLASS</span>
              <ArrowRight className="w-3.5 h-3.5 text-white/90 group-hover:translate-x-0.5 transition-transform duration-150" />
            </Button>
          </form>
        </FormModalDialogContent>
      </Dialog>

      {/* -------------------------------------------------------------------- */}
      {/* MODAL 2: CREATE BATCH (Restyled to match Contact Us Design System) */}
      {/* -------------------------------------------------------------------- */}
      <Dialog open={isBatchModalOpen} onOpenChange={setIsBatchModalOpen}>
        <FormModalDialogContent
          maxWidthClass="max-w-[480px] sm:max-w-[530px]"
          hideCloseButton={true}
          className="w-[94vw] sm:w-[92vw] p-0 shadow-[0_20px_50px_-12px_rgba(15,23,42,0.18),0_2px_8px_rgba(15,23,42,0.06)] !rounded-[6px] sm:!rounded-[8px] border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-950 flex flex-col overflow-hidden max-h-[90vh]"
        >
          {/* Header: Height exactly matching name field height (h-[34px] sm:h-[36px]) */}
          <div className="h-[34px] sm:h-[36px] flex items-center justify-between px-4 sm:px-5 border-b border-slate-100 dark:border-slate-800/80 bg-white dark:bg-slate-950 shrink-0">
            <span className="text-[12px] sm:text-[12.5px] font-bold tracking-[0.05em] uppercase text-slate-800 dark:text-slate-100 block">
              CREATE ACADEMIC BATCH
            </span>
            <button
              type="button"
              onClick={() => setIsBatchModalOpen(false)}
              className="w-6 h-6 -mr-1 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-3.5 h-3.5 stroke-[2.2]" />
            </button>
          </div>

          <DialogHeader className="sr-only">
            <DialogTitle>Create Academic Batch</DialogTitle>
            <DialogDescription>Define a new academic batch and timing.</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateBatch} className="p-4 sm:p-5 space-y-3 sm:space-y-3.5 overflow-y-auto">
            {/* Row 1: Select Class (1st) & Batch Name (2nd) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5">
              <div className="space-y-1">
                <Select
                  value={batchForm.classId || undefined}
                  onValueChange={val => {
                    const matchedClass = classes.find(c => c.id === val);
                    setBatchForm(prev => ({
                      ...prev,
                      classId: val,
                      branchId: matchedClass?.branchId || prev.branchId,
                      monthlyFee: prev.monthlyFee || matchedClass?.defaultMonthlyFee || 0,
                      courseFee: prev.courseFee || ((prev.monthlyFee || matchedClass?.defaultMonthlyFee || 0) * 12),
                    }));
                  }}
                >
                  <SelectTrigger className="h-[34px] sm:h-[36px] w-full border-0 border-b border-slate-200/90 dark:border-slate-700/80 !bg-transparent rounded-none px-0 text-[13px] sm:text-[13.5px] md:text-[14px] font-medium text-slate-900 dark:text-slate-100 [&>span]:text-[13px] sm:[&>span]:text-[13.5px] md:[&>span]:text-[14px] [&>span]:font-medium [&>span]:text-slate-900 dark:[&>span]:text-slate-100 data-[placeholder]:!text-slate-400 [&[data-placeholder]>span]:!text-slate-400 [&[data-placeholder]>span]:!text-[9.5px] sm:[&[data-placeholder]>span]:!text-[10px] [&[data-placeholder]>span]:!font-normal focus:outline-none focus:ring-0 focus:border-slate-300 dark:focus:border-slate-600 focus:shadow-none focus-visible:outline-none focus-visible:ring-0 focus-visible:shadow-none shadow-none flex items-center justify-between">
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
                  value={batchForm.name}
                  onChange={e => setBatchForm({ ...batchForm, name: e.target.value })}
                  required
                  className="h-[34px] sm:h-[36px] w-full border-0 border-b border-slate-200/90 dark:border-slate-700/80 !bg-transparent rounded-none px-0 text-[13px] sm:text-[13.5px] md:text-[14px] font-medium text-slate-900 dark:text-slate-100 placeholder:text-[9.5px] sm:placeholder:text-[10px] placeholder:text-slate-400 focus:outline-none focus:ring-0 focus:border-slate-300 dark:focus:border-slate-600 focus:shadow-none focus-visible:outline-none focus-visible:ring-0 focus-visible:shadow-none shadow-none"
                />
              </div>
            </div>

            {/* Row 2: Batch Start Date & Batch End Date */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5">
              <div className="space-y-1">
                <Input
                  type={batchForm.startDate ? "date" : "text"}
                  placeholder="Batch Start Date (DD/MM/YYYY)"
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
                  className="h-[34px] sm:h-[36px] w-full border-0 border-b border-slate-200/90 dark:border-slate-700/80 !bg-transparent rounded-none px-0 text-[13px] sm:text-[13.5px] md:text-[14px] font-medium text-slate-900 dark:text-slate-100 placeholder:text-[9.5px] sm:placeholder:text-[10px] placeholder:text-slate-400 focus:outline-none focus:ring-0 focus:border-slate-300 dark:focus:border-slate-600 focus:shadow-none focus-visible:outline-none focus-visible:ring-0 focus-visible:shadow-none shadow-none cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <Input
                  type={batchForm.endDate ? "date" : "text"}
                  placeholder="Batch End Date (DD/MM/YYYY)"
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
                  className="h-[34px] sm:h-[36px] w-full border-0 border-b border-slate-200/90 dark:border-slate-700/80 !bg-transparent rounded-none px-0 text-[13px] sm:text-[13.5px] md:text-[14px] font-medium text-slate-900 dark:text-slate-100 placeholder:text-[9.5px] sm:placeholder:text-[10px] placeholder:text-slate-400 focus:outline-none focus:ring-0 focus:border-slate-300 dark:focus:border-slate-600 focus:shadow-none focus-visible:outline-none focus-visible:ring-0 focus-visible:shadow-none shadow-none cursor-pointer"
                />
              </div>
            </div>

            {/* Row 3: Class Timings & Batch Order Number */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5">
              <div className="space-y-1">
                <Input
                  placeholder="Class Timings (e.g. 04:00 PM - 06:00 PM)"
                  value={batchForm.classTime}
                  onChange={e => setBatchForm({ ...batchForm, classTime: e.target.value })}
                  className="h-[34px] sm:h-[36px] w-full border-0 border-b border-slate-200/90 dark:border-slate-700/80 !bg-transparent rounded-none px-0 text-[13px] sm:text-[13.5px] md:text-[14px] font-medium text-slate-900 dark:text-slate-100 placeholder:text-[9.5px] sm:placeholder:text-[10px] placeholder:text-slate-400 focus:outline-none focus:ring-0 focus:border-slate-300 dark:focus:border-slate-600 focus:shadow-none focus-visible:outline-none focus-visible:ring-0 focus-visible:shadow-none shadow-none"
                />
              </div>

              <div className="space-y-1">
                <Input
                  type="number"
                  min="1"
                  placeholder="Batch Order Number (e.g. 1, 2)"
                  value={batchForm.order !== undefined ? batchForm.order : ''}
                  onChange={e => setBatchForm({ ...batchForm, order: e.target.value === '' ? '' : Number(e.target.value) })}
                  className="h-[34px] sm:h-[36px] w-full border-0 border-b border-slate-200/90 dark:border-slate-700/80 !bg-transparent rounded-none px-0 text-[13px] sm:text-[13.5px] md:text-[14px] font-medium text-slate-900 dark:text-slate-100 placeholder:text-[9.5px] sm:placeholder:text-[10px] placeholder:text-slate-400 focus:outline-none focus:ring-0 focus:border-slate-300 dark:focus:border-slate-600 focus:shadow-none focus-visible:outline-none focus-visible:ring-0 focus-visible:shadow-none shadow-none"
                />
              </div>
            </div>

            {/* Row 4: Default Batch Fees (Monthly Fee & Yearly Fee) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5">
              <div className="space-y-1">
                <Input
                  type="number"
                  min="0"
                  placeholder="Batch Monthly Fee (₹)"
                  value={batchForm.monthlyFee !== undefined && batchForm.monthlyFee > 0 ? batchForm.monthlyFee : ''}
                  onChange={e => {
                    const m = e.target.value === '' ? 0 : Number(e.target.value);
                    setBatchForm(prev => ({
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
                  value={batchForm.courseFee !== undefined && batchForm.courseFee > 0 ? batchForm.courseFee : ''}
                  onChange={e => {
                    const y = e.target.value === '' ? 0 : Number(e.target.value);
                    setBatchForm(prev => ({
                      ...prev,
                      courseFee: y,
                      monthlyFee: y > 0 ? Math.round(y / 12) : 0,
                    }));
                  }}
                  className="h-[34px] sm:h-[36px] w-full border-0 border-b border-slate-200/90 dark:border-slate-700/80 !bg-transparent rounded-none px-0 text-[13px] sm:text-[13.5px] md:text-[14px] font-medium text-slate-900 dark:text-slate-100 placeholder:text-[9.5px] sm:placeholder:text-[10px] placeholder:text-slate-400 focus:outline-none focus:ring-0 focus:border-slate-300 dark:focus:border-slate-600 focus:shadow-none focus-visible:outline-none focus-visible:ring-0 focus-visible:shadow-none shadow-none"
                />
              </div>
            </div>

            {/* Row 5: Batch Subjects (Manual with + option) */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Enter Subject (e.g. Physics, Maths)..."
                  value={newBatchSubjectInput}
                  onChange={e => setNewBatchSubjectInput(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddBatchSubject();
                    }
                  }}
                  className="h-[34px] sm:h-[36px] flex-1 border-0 border-b border-slate-200/90 dark:border-slate-700/80 !bg-transparent rounded-none px-0 text-[13px] sm:text-[13.5px] md:text-[14px] font-medium text-slate-900 dark:text-slate-100 placeholder:text-[9.5px] sm:placeholder:text-[10px] placeholder:text-slate-400 focus:outline-none focus:ring-0 focus:border-slate-300 dark:focus:border-slate-600 focus:shadow-none focus-visible:outline-none focus-visible:ring-0 focus-visible:shadow-none shadow-none"
                />
                <button
                  type="button"
                  onClick={() => handleAddBatchSubject()}
                  className="h-[28px] sm:h-[30px] px-2.5 rounded-md text-[11px] font-bold bg-[#2864E8]/10 hover:bg-[#2864E8]/20 text-[#2864E8] flex items-center gap-1 transition-colors cursor-pointer shrink-0"
                  title="Add Subject"
                  aria-label="Add Subject"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Subject</span>
                </button>
              </div>

              {batchForm.subjects && batchForm.subjects.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  {batchForm.subjects.map((sub, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[11px] font-semibold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700"
                    >
                      <span>{sub}</span>
                      <button
                        type="button"
                        onClick={() => handleDeleteBatchSubject(idx)}
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

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmittingBatch || isPending}
              className="group w-full h-[36px] sm:h-[38px] !rounded-[4px] sm:!rounded-[6px] font-bold text-[11px] sm:text-[11.5px] tracking-[0.08em] bg-[#2864E8] hover:bg-[#1E4ED8] active:bg-[#1842BE] text-white shadow-[0_2px_8px_rgba(40,100,232,0.25)] hover:shadow-[0_4px_12px_rgba(40,100,232,0.35)] uppercase flex items-center justify-center gap-1.5 transition-all cursor-pointer !mt-4"
            >
              {isSubmittingBatch ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>CREATING BATCH...</span>
                </>
              ) : (
                <>
                  <span>CREATE BATCH</span>
                  <ArrowRight className="w-3.5 h-3.5 text-white/90 group-hover:translate-x-0.5 transition-transform duration-150" />
                </>
              )}
            </Button>
          </form>
        </FormModalDialogContent>
      </Dialog>

      {/* -------------------------------------------------------------------- */}
      {/* MODAL 2B: EDIT BATCH */}
      {/* -------------------------------------------------------------------- */}
      {/* -------------------------------------------------------------------- */}
      {/* MODAL 2B: EDIT BATCH DETAILS (Matching CREATE ACADEMIC BATCH Design System) */}
      {/* -------------------------------------------------------------------- */}
      <Dialog open={isEditBatchOpen} onOpenChange={setIsEditBatchOpen}>
        <FormModalDialogContent
          maxWidthClass="max-w-[480px] sm:max-w-[530px]"
          hideCloseButton={true}
          className="w-[94vw] sm:w-[92vw] p-0 shadow-[0_20px_50px_-12px_rgba(15,23,42,0.18),0_2px_8px_rgba(15,23,42,0.06)] !rounded-[6px] sm:!rounded-[8px] border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-950 flex flex-col overflow-hidden max-h-[90vh]"
        >
          {/* Header: Height exactly matching name field height (h-[34px] sm:h-[36px]) */}
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
            {/* Row 1: Select Class (1st) & Batch Name (2nd) */}
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

            {/* Row 2: Start Date & End Date (No heading label, clean underline inputs) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5">
              <div className="space-y-1">
                <Input
                  type={editBatchForm.startDate ? "date" : "text"}
                  placeholder="Batch Start Date (DD/MM/YYYY)"
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
                  className="h-[34px] sm:h-[36px] w-full border-0 border-b border-slate-200/90 dark:border-slate-700/80 !bg-transparent rounded-none px-0 text-[13px] sm:text-[13.5px] md:text-[14px] font-medium text-slate-900 dark:text-slate-100 placeholder:text-[9.5px] sm:placeholder:text-[10px] placeholder:text-slate-400 focus:outline-none focus:ring-0 focus:border-slate-300 dark:focus:border-slate-600 focus:shadow-none focus-visible:outline-none focus-visible:ring-0 focus-visible:shadow-none shadow-none cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <Input
                  type={editBatchForm.endDate ? "date" : "text"}
                  placeholder="Batch End Date (DD/MM/YYYY)"
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
                  className="h-[34px] sm:h-[36px] w-full border-0 border-b border-slate-200/90 dark:border-slate-700/80 !bg-transparent rounded-none px-0 text-[13px] sm:text-[13.5px] md:text-[14px] font-medium text-slate-900 dark:text-slate-100 placeholder:text-[9.5px] sm:placeholder:text-[10px] placeholder:text-slate-400 focus:outline-none focus:ring-0 focus:border-slate-300 dark:focus:border-slate-600 focus:shadow-none focus-visible:outline-none focus-visible:ring-0 focus-visible:shadow-none shadow-none cursor-pointer"
                />
              </div>
            </div>

            {/* Row 3: Class Timings & Batch Order Number */}
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
                  onChange={e => setEditBatchForm({ ...editBatchForm, order: e.target.value === '' ? '' : Number(e.target.value) })}
                  className="h-[34px] sm:h-[36px] w-full border-0 border-b border-slate-200/90 dark:border-slate-700/80 !bg-transparent rounded-none px-0 text-[13px] sm:text-[13.5px] md:text-[14px] font-medium text-slate-900 dark:text-slate-100 placeholder:text-[9.5px] sm:placeholder:text-[10px] placeholder:text-slate-400 focus:outline-none focus:ring-0 focus:border-slate-300 dark:focus:border-slate-600 focus:shadow-none focus-visible:outline-none focus-visible:ring-0 focus-visible:shadow-none shadow-none"
                />
              </div>
            </div>

            {/* Row 4: Default Batch Fees (Monthly Fee & Yearly Fee) */}
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

            {/* Row 5: Batch Subjects (Manual with + option) */}
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

            {/* Submit Button */}
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

      {/* -------------------------------------------------------------------- */}
      {/* MODAL 1B: EDIT CLASS DETAILS (Matching CREATE ACADEMIC BATCH Design System) */}
      {/* -------------------------------------------------------------------- */}
      <Dialog open={isEditClassOpen} onOpenChange={setIsEditClassOpen}>
        <FormModalDialogContent
          maxWidthClass="max-w-[480px] sm:max-w-[530px]"
          hideCloseButton={true}
          className="w-[94vw] sm:w-[92vw] p-0 shadow-[0_20px_50px_-12px_rgba(15,23,42,0.18),0_2px_8px_rgba(15,23,42,0.06)] !rounded-[6px] sm:!rounded-[8px] border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-950 flex flex-col overflow-hidden max-h-[90vh]"
        >
          {/* Header: Height exactly matching name field height (h-[34px] sm:h-[36px]) */}
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
            {/* Row 1: Class Name & Class Division */}
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

            {/* Row 2: Branch & Academic Session */}
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
                    {IDL_BRANCHES.filter(b => b.id !== 'all').map(b => (
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

            {/* Row 3: Display Order */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5">
              <div className="space-y-1">
                <Input
                  type="number"
                  min="1"
                  placeholder="Card Order Number (e.g. 1, 2)"
                  value={editClassForm.order !== undefined ? editClassForm.order : ''}
                  onChange={e => setEditClassForm({ ...editClassForm, order: e.target.value === '' ? '' : Number(e.target.value) })}
                  className="h-[34px] sm:h-[36px] w-full border-0 border-b border-slate-200/90 dark:border-slate-700/80 !bg-transparent rounded-none px-0 text-[13px] sm:text-[13.5px] md:text-[14px] font-medium text-slate-900 dark:text-slate-100 placeholder:text-[9.5px] sm:placeholder:text-[10px] placeholder:text-slate-400 focus:outline-none focus:ring-0 focus:border-slate-300 dark:focus:border-slate-600 focus:shadow-none focus-visible:outline-none focus-visible:ring-0 focus-visible:shadow-none shadow-none"
                />
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isPending}
              className="w-full h-9 sm:h-9 text-[11.5px] sm:text-[12px] font-bold tracking-[0.06em] uppercase rounded-[5px] sm:rounded-[6px] bg-[#2864E8] hover:bg-[#1E4ED8] text-white shadow-none transition-all flex items-center justify-center gap-1.5 cursor-pointer mt-1 sm:mt-1.5 group"
            >
              <span>SAVE CLASS CHANGES</span>
              <ArrowRight className="w-3.5 h-3.5 text-white/90 group-hover:translate-x-0.5 transition-transform duration-150" />
            </Button>
          </form>
        </FormModalDialogContent>
      </Dialog>

      {/* -------------------------------------------------------------------- */}
      {/* MODAL 3: ENROLL NEW STUDENT (1:1 Exact Match with Edit Student Details & Student Profile Visual System) */}
      {/* -------------------------------------------------------------------- */}
      <Dialog open={isStudentModalOpen} onOpenChange={open => !open && setIsStudentModalOpen(false)}>
        <DialogContent onOpenAutoFocus={(e) => e.preventDefault()} className="max-w-[490px] sm:max-w-[530px] w-[92vw] rounded-2xl p-4 sm:p-5 bg-white dark:bg-slate-950 text-left border border-slate-200/90 dark:border-slate-800 shadow-[0_20px_50px_-12px_rgba(15,23,42,0.15),0_4px_16px_rgba(15,23,42,0.06)] overflow-hidden max-h-[92vh] flex flex-col">
          {/* Header: Clean Title without Icon + Compact Student ID & Joined Date */}
          <DialogHeader className="pb-2.5 border-b border-slate-100 dark:border-slate-800/80 shrink-0">
            <div>
              <DialogTitle className="text-[17px] sm:text-[18px] font-semibold tracking-tight text-slate-900 dark:text-white">
                Enroll New Student
              </DialogTitle>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono mt-1 flex items-center gap-2 sm:gap-2.5 whitespace-nowrap overflow-x-auto no-scrollbar">
                <span className="font-semibold text-slate-500 dark:text-slate-400">ID :</span>
                <input
                  type="text"
                  placeholder={studentIdWatermark}
                  value={studentForm.rollNumber || ""}
                  onChange={e => {
                    setIsCustomRollNumber(true);
                    setStudentForm({ ...studentForm, rollNumber: e.target.value });
                  }}
                  style={{ width: `${Math.max(9, (studentForm.rollNumber || studentIdWatermark).length)}ch` }}
                  className="font-semibold text-slate-800 dark:text-slate-100 bg-transparent border-0 p-0 m-0 focus:outline-none focus:ring-0 font-mono uppercase cursor-text selection:bg-[#2864E8]/20 placeholder:font-normal placeholder:text-slate-400/80 dark:placeholder:text-slate-500 transition-colors"
                />
                <span className="text-slate-400 dark:text-slate-600 select-none">•</span>
                <span className="font-semibold text-slate-500 dark:text-slate-400">JOIN :</span>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder={todayDateWatermark}
                  value={studentForm.joiningDate || ""}
                  onChange={e => {
                    const formatted = handleDateTyping(e.target.value, studentForm.joiningDate);
                    setStudentForm(prev => ({
                      ...prev,
                      joiningDate: formatted,
                    }));
                  }}
                  onBlur={e => {
                    const normalized = normalizeDateBlur(e.target.value);
                    setStudentForm(prev => ({
                      ...prev,
                      joiningDate: normalized,
                    }));
                  }}
                  style={{ width: "10ch" }}
                  className="font-semibold text-slate-800 dark:text-slate-100 bg-transparent border-0 p-0 m-0 focus:outline-none focus:ring-0 font-mono cursor-text selection:bg-[#2864E8]/20 placeholder:font-normal placeholder:text-slate-400/80 dark:placeholder:text-slate-500 transition-colors"
                />
                <span className="text-slate-400 dark:text-slate-600 select-none">•</span>
                <span className="font-semibold text-slate-500 dark:text-slate-400">DUE :</span>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder={defaultDueDateWatermark}
                  value={studentForm.dueDate || ""}
                  onChange={e => {
                    const formatted = handleDateTyping(e.target.value, studentForm.dueDate);
                    setStudentForm({ ...studentForm, dueDate: formatted });
                  }}
                  onBlur={e => {
                    const normalized = normalizeDateBlur(e.target.value);
                    setStudentForm({ ...studentForm, dueDate: normalized });
                  }}
                  style={{ width: "10ch" }}
                  className="font-semibold text-slate-800 dark:text-slate-100 bg-transparent border-0 p-0 m-0 focus:outline-none focus:ring-0 font-mono cursor-text selection:bg-[#2864E8]/20 placeholder:font-normal placeholder:text-slate-400/80 dark:placeholder:text-slate-500 transition-colors"
                />
              </div>
            </div>
          </DialogHeader>

          <form onSubmit={handleCreateStudent} noValidate className="flex flex-col flex-1 min-h-0 overflow-hidden pt-1 text-left" autoComplete="off">
            <div className="flex-1 overflow-y-auto pr-1 pb-1 space-y-2.5">
              {/* Personal Information & Academic Inputs (Matching Contact Form / Clean Underline UI) */}
              <div className="py-2 border-b border-slate-100 dark:border-slate-800/80 space-y-3 sm:space-y-3.5">
                {/* Row 1: Student Full Name, Father/Guardian Name, Father/Guardian Occ. */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-3.5">
                  <input
                    placeholder="Full Name *"
                    value={studentForm.name}
                    onChange={e => setStudentForm({ ...studentForm, name: toTitleCase(e.target.value) })}
                    className="h-[34px] w-full border-0 border-b border-slate-200 dark:border-slate-800 !bg-transparent rounded-none px-0 text-[12.5px] font-normal text-slate-800 dark:text-slate-100 placeholder:text-slate-500/75 dark:placeholder:text-slate-400/80 placeholder:font-normal focus:outline-none focus:ring-0 focus:border-[#2864E8] dark:focus:border-[#2864E8] shadow-none flex items-center leading-none transition-colors duration-150"
                  />

                  <input
                    placeholder="Father / Guardian Name *"
                    value={studentForm.fatherName}
                    onChange={e => setStudentForm({ ...studentForm, fatherName: toTitleCase(e.target.value) })}
                    className="h-[34px] w-full border-0 border-b border-slate-200 dark:border-slate-800 !bg-transparent rounded-none px-0 text-[12.5px] font-normal text-slate-800 dark:text-slate-100 placeholder:text-slate-500/75 dark:placeholder:text-slate-400/80 placeholder:font-normal focus:outline-none focus:ring-0 focus:border-[#2864E8] dark:focus:border-[#2864E8] shadow-none flex items-center leading-none transition-colors duration-150"
                  />

                  <input
                    placeholder="Father / Guardian Occ."
                    value={studentForm.fatherOccupation || ""}
                    onChange={e => setStudentForm({ ...studentForm, fatherOccupation: toTitleCase(e.target.value) })}
                    className="h-[34px] w-full border-0 border-b border-slate-200 dark:border-slate-800 !bg-transparent rounded-none px-0 text-[12.5px] font-normal text-slate-800 dark:text-slate-100 placeholder:text-slate-500/75 dark:placeholder:text-slate-400/80 placeholder:font-normal focus:outline-none focus:ring-0 focus:border-[#2864E8] dark:focus:border-[#2864E8] shadow-none flex items-center leading-none transition-colors duration-150"
                  />
                </div>

                {/* Row 2: Date of Birth, Gender, Blood Group */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-3.5">
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="DOB (DD-MM-YYYY)"
                    value={studentForm.dob || ""}
                    onChange={e => {
                      const formatted = handleDateTyping(e.target.value, studentForm.dob);
                      setStudentForm({ ...studentForm, dob: formatted });
                    }}
                    onBlur={e => {
                      const normalized = normalizeDateBlur(e.target.value);
                      setStudentForm({ ...studentForm, dob: normalized });
                    }}
                    className="h-[34px] w-full border-0 border-b border-slate-200 dark:border-slate-800 !bg-transparent rounded-none px-0 text-[12.5px] font-normal text-slate-800 dark:text-slate-100 placeholder:text-slate-500/75 dark:placeholder:text-slate-400/80 placeholder:font-normal focus:outline-none focus:ring-0 focus:border-[#2864E8] dark:focus:border-[#2864E8] shadow-none flex items-center leading-none transition-colors duration-150 font-mono"
                  />

                  <Select
                    value={studentForm.gender || ""}
                    onValueChange={(val: any) => setStudentForm({ ...studentForm, gender: val })}
                  >
                    <SelectTrigger className="h-[34px] w-full border-0 border-b border-slate-200 dark:border-slate-800 !bg-transparent rounded-none px-0 text-[12.5px] font-normal text-slate-800 dark:text-slate-100 data-[placeholder]:text-slate-500/75 dark:data-[placeholder]:text-slate-400/80 data-[placeholder]:font-normal focus:outline-none focus:border-[#2864E8] dark:focus:border-[#2864E8] focus:shadow-none focus-visible:outline-none focus-visible:ring-0 !ring-0 !ring-offset-0 focus:!ring-0 focus-visible:!ring-0 data-[state=open]:!ring-0 data-[state=open]:border-[#2864E8] dark:data-[state=open]:border-[#2864E8] shadow-none flex items-center justify-between cursor-pointer [&>span]:truncate [&>svg]:h-3.5 [&>svg]:w-3.5 [&>svg]:text-slate-400 [&>svg]:opacity-70 transition-colors duration-150">
                      <SelectValue placeholder="Gender *" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male" className="text-xs">Male</SelectItem>
                      <SelectItem value="female" className="text-xs">Female</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select
                    value={studentForm.bloodGroup || ""}
                    onValueChange={(val: string) => setStudentForm({ ...studentForm, bloodGroup: val })}
                  >
                    <SelectTrigger className="h-[34px] w-full border-0 border-b border-slate-200 dark:border-slate-800 !bg-transparent rounded-none px-0 text-[12.5px] font-normal text-slate-800 dark:text-slate-100 data-[placeholder]:text-slate-500/75 dark:data-[placeholder]:text-slate-400/80 data-[placeholder]:font-normal focus:outline-none focus:border-[#2864E8] dark:focus:border-[#2864E8] focus:shadow-none focus-visible:outline-none focus-visible:ring-0 !ring-0 !ring-offset-0 focus:!ring-0 focus-visible:!ring-0 data-[state=open]:!ring-0 data-[state=open]:border-[#2864E8] dark:data-[state=open]:border-[#2864E8] shadow-none flex items-center justify-between cursor-pointer [&>span]:truncate [&>svg]:h-3.5 [&>svg]:w-3.5 [&>svg]:text-slate-400 [&>svg]:opacity-70 transition-colors duration-150">
                      <SelectValue placeholder="Blood Group" />
                    </SelectTrigger>
                    <SelectContent>
                      {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(bg => (
                        <SelectItem key={bg} value={bg} className="text-xs">{bg}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Row 3: Father Contact, Mother Contact, Student Contact with +91 Prefix */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-3.5">
                  <div className="relative h-[34px] w-full flex items-center">
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 text-[12px] font-medium text-slate-400 select-none pointer-events-none">
                      +91
                    </span>
                    <input
                      type="tel"
                      maxLength={10}
                      placeholder="Father Contact"
                      value={studentForm.fatherContact || ""}
                      onChange={e => setStudentForm({ ...studentForm, fatherContact: e.target.value.replace(/\D/g, "") })}
                      className="h-[34px] w-full border-0 border-b border-slate-200 dark:border-slate-800 !bg-transparent rounded-none pl-[26px] pr-0 text-[12.5px] font-normal text-slate-800 dark:text-slate-100 placeholder:text-slate-500/75 dark:placeholder:text-slate-400/80 placeholder:font-normal focus:outline-none focus:ring-0 focus:border-[#2864E8] dark:focus:border-[#2864E8] shadow-none flex items-center leading-none transition-colors duration-150 font-mono"
                    />
                  </div>

                  <div className="relative h-[34px] w-full flex items-center">
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 text-[12px] font-medium text-slate-400 select-none pointer-events-none">
                      +91
                    </span>
                    <input
                      type="tel"
                      maxLength={10}
                      placeholder="Mother Contact"
                      value={studentForm.motherContact || ""}
                      onChange={e => setStudentForm({ ...studentForm, motherContact: e.target.value.replace(/\D/g, ""), contact2: e.target.value.replace(/\D/g, "") })}
                      className="h-[34px] w-full border-0 border-b border-slate-200 dark:border-slate-800 !bg-transparent rounded-none pl-[26px] pr-0 text-[12.5px] font-normal text-slate-800 dark:text-slate-100 placeholder:text-slate-500/75 dark:placeholder:text-slate-400/80 placeholder:font-normal focus:outline-none focus:ring-0 focus:border-[#2864E8] dark:focus:border-[#2864E8] shadow-none flex items-center leading-none transition-colors duration-150 font-mono"
                    />
                  </div>

                  <div className="relative h-[34px] w-full flex items-center">
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 text-[12px] font-medium text-slate-400 select-none pointer-events-none">
                      +91
                    </span>
                    <input
                      type="tel"
                      maxLength={10}
                      placeholder="Phone Number *"
                      value={studentForm.contact1}
                      onChange={e => setStudentForm({ ...studentForm, contact1: e.target.value.replace(/\D/g, "") })}
                      className="h-[34px] w-full border-0 border-b border-slate-200 dark:border-slate-800 !bg-transparent rounded-none pl-[26px] pr-0 text-[12.5px] font-normal text-slate-800 dark:text-slate-100 placeholder:text-slate-500/75 dark:placeholder:text-slate-400/80 placeholder:font-normal focus:outline-none focus:ring-0 focus:border-[#2864E8] dark:focus:border-[#2864E8] shadow-none flex items-center leading-none transition-colors duration-150 font-mono"
                    />
                  </div>
                </div>

                {/* Residential Address: Full-width underline field */}
                <div>
                  <input
                    placeholder="Residential Address (House no, colony, landmark, PIN)"
                    value={studentForm.address}
                    onChange={e => setStudentForm({ ...studentForm, address: toTitleCase(e.target.value) })}
                    className="h-[34px] w-full border-0 border-b border-slate-200 dark:border-slate-800 !bg-transparent rounded-none px-0 text-[12.5px] font-normal text-slate-800 dark:text-slate-100 placeholder:text-slate-500/75 dark:placeholder:text-slate-400/80 placeholder:font-normal focus:outline-none focus:ring-0 focus:border-[#2864E8] dark:focus:border-[#2864E8] shadow-none flex items-center leading-none transition-colors duration-150"
                  />
                </div>

                {/* Academic Details (Branch, Class, Batch) in clean 3-column row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-3.5">
                  <Select
                    value={studentForm.branchId}
                    onValueChange={val => setStudentForm({ ...studentForm, branchId: val, classId: "", batchId: "" })}
                  >
                    <SelectTrigger className="h-[34px] w-full border-0 border-b border-slate-200 dark:border-slate-800 !bg-transparent rounded-none px-0 text-[12.5px] font-normal text-slate-800 dark:text-slate-100 data-[placeholder]:text-slate-500/75 dark:data-[placeholder]:text-slate-400/80 data-[placeholder]:font-normal focus:outline-none focus:border-[#2864E8] dark:focus:border-[#2864E8] focus:shadow-none focus-visible:outline-none focus-visible:ring-0 !ring-0 !ring-offset-0 focus:!ring-0 focus-visible:!ring-0 data-[state=open]:!ring-0 data-[state=open]:border-[#2864E8] dark:data-[state=open]:border-[#2864E8] shadow-none flex items-center justify-between cursor-pointer [&>span]:truncate [&>svg]:h-3.5 [&>svg]:w-3.5 [&>svg]:text-slate-400 [&>svg]:opacity-70 transition-colors duration-150">
                      <SelectValue placeholder="Branch *" />
                    </SelectTrigger>
                    <SelectContent>
                      {IDL_BRANCHES.filter(b => b.id !== "all").map(b => (
                        <SelectItem key={b.id} value={b.id} className="text-xs">{b.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select
                    value={studentForm.classId}
                    onValueChange={val => {
                      const c = classes.find(item => item.id === val);
                      const clsFee = c?.defaultMonthlyFee || 0;
                      setStudentForm(prev => ({
                        ...prev,
                        classId: val,
                        branchId: prev.branchId || (c?.branchId && c.branchId !== 'all' ? c.branchId : prev.branchId),
                        batchId: "",
                        baseFee: clsFee,
                        discountAmount: 0,
                        scholarshipPercent: 0,
                        subjects: [],
                      }));
                    }}
                  >
                    <SelectTrigger className="h-[34px] w-full border-0 border-b border-slate-200 dark:border-slate-800 !bg-transparent rounded-none px-0 text-[12.5px] font-normal text-slate-800 dark:text-slate-100 data-[placeholder]:text-slate-500/75 dark:data-[placeholder]:text-slate-400/80 data-[placeholder]:font-normal focus:outline-none focus:border-[#2864E8] dark:focus:border-[#2864E8] focus:shadow-none focus-visible:outline-none focus-visible:ring-0 !ring-0 !ring-offset-0 focus:!ring-0 focus-visible:!ring-0 data-[state=open]:!ring-0 data-[state=open]:border-[#2864E8] dark:data-[state=open]:border-[#2864E8] shadow-none flex items-center justify-between cursor-pointer [&>span]:truncate [&>svg]:h-3.5 [&>svg]:w-3.5 [&>svg]:text-slate-400 [&>svg]:opacity-70 transition-colors duration-150">
                      <SelectValue placeholder="Class *" />
                    </SelectTrigger>
                    <SelectContent>
                      {classes
                        .filter(c => !studentForm.branchId || c.branchId === studentForm.branchId || c.branchId === "all")
                        .map(c => (
                          <SelectItem key={c.id} value={c.id} className="text-xs">{c.name}</SelectItem>
                        ))}
                    </SelectContent>
                  </Select>

                  <Select
                    value={studentForm.batchId}
                    onValueChange={val => {
                      const b = batches.find(item => item.id === val);
                      const c = classes.find(item => item.id === studentForm.classId);
                      const actualMonthlyFee = (b && typeof b.monthlyFee === 'number' && b.monthlyFee > 0)
                        ? b.monthlyFee
                        : (c?.defaultMonthlyFee || 0);
                      const actualYearlyFee = (b && typeof b.courseFee === 'number' && b.courseFee > 0)
                        ? b.courseFee
                        : (actualMonthlyFee * 12);

                      setStudentForm(prev => {
                        let pct = prev.scholarshipPercent || 0;
                        const isYr = prev.feeType === 'yearly_package';
                        const stdFee = isYr ? actualYearlyFee : actualMonthlyFee;
                        const disc = Math.round((stdFee * pct) / 100);
                        return {
                          ...prev,
                          batchId: val,
                          baseFee: actualMonthlyFee,
                          yearlyStandardFee: actualYearlyFee,
                          totalYearlyFee: actualYearlyFee - Math.round((actualYearlyFee * pct) / 100),
                          discountAmount: Math.round((actualMonthlyFee * pct) / 100),
                          scholarshipPercent: pct,
                          subjects: b?.subjects ? [...b.subjects] : prev.subjects,
                        };
                      });
                    }}
                  >
                    <SelectTrigger className="h-[34px] w-full border-0 border-b border-slate-200 dark:border-slate-800 !bg-transparent rounded-none px-0 text-[12.5px] font-normal text-slate-800 dark:text-slate-100 data-[placeholder]:text-slate-500/75 dark:data-[placeholder]:text-slate-400/80 data-[placeholder]:font-normal focus:outline-none focus:border-[#2864E8] dark:focus:border-[#2864E8] focus:shadow-none focus-visible:outline-none focus-visible:ring-0 !ring-0 !ring-offset-0 focus:!ring-0 focus-visible:!ring-0 data-[state=open]:!ring-0 data-[state=open]:border-[#2864E8] dark:data-[state=open]:border-[#2864E8] shadow-none flex items-center justify-between cursor-pointer [&>span]:truncate [&>svg]:h-3.5 [&>svg]:w-3.5 [&>svg]:text-slate-400 [&>svg]:opacity-70 transition-colors duration-150">
                      <SelectValue placeholder="Batch *" />
                    </SelectTrigger>
                    <SelectContent>
                      {batches
                        .filter(b => b.classId === studentForm.classId)
                        .map(b => (
                          <SelectItem key={b.id} value={b.id} className="text-xs">{b.name}</SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Fee Breakdown Card: Clean, Compact Premium Styling */}
              <div className="p-3 sm:p-3.5 rounded-xl bg-slate-50/70 dark:bg-slate-900/40 border border-slate-200/80 dark:border-slate-800/80 space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-[10.5px] font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  <span className="flex items-center gap-1.5 whitespace-nowrap shrink-0">
                    <IndianRupee className="w-3.5 h-3.5 text-[#2864E8]" />
                    Fee Breakdown
                  </span>
                  
                  {/* Monthly / Yearly Selection Option */}
                  <div className="inline-flex items-center p-0.5 rounded-md bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700/80 shadow-2xs">
                    <button
                      type="button"
                      onClick={() => handleToggleStudentFeeType('monthly')}
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold tracking-wider uppercase transition-all cursor-pointer ${
                        studentForm.feeType !== 'yearly_package'
                          ? 'bg-[#2864E8] text-white shadow-xs'
                          : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                      }`}
                    >
                      Monthly
                    </button>
                    <button
                      type="button"
                      onClick={() => handleToggleStudentFeeType('yearly_package')}
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold tracking-wider uppercase transition-all cursor-pointer ${
                        studentForm.feeType === 'yearly_package'
                          ? 'bg-[#2864E8] text-white shadow-xs'
                          : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                      }`}
                    >
                      Yearly
                    </button>
                  </div>
                </div>

                <div className="space-y-1 pt-0.5">
                  {/* Standard Fee */}
                  <div className="flex justify-between items-baseline text-slate-600 dark:text-slate-400 text-[12px]">
                    <span className="font-normal">Standard Fee:</span>
                    <div className="inline-flex items-baseline justify-end font-medium text-slate-800 dark:text-slate-200 font-mono text-[12px] whitespace-nowrap">
                      <span className="text-slate-500 dark:text-slate-400 select-none mr-1">₹</span>
                      <input
                        type="text"
                        inputMode="numeric"
                        placeholder="0"
                        value={
                          studentForm.feeType === 'yearly_package'
                            ? (studentForm.yearlyStandardFee || (studentForm.baseFee > 0 ? studentForm.baseFee * 12 : "") || "")
                            : (studentForm.baseFee || "")
                        }
                        onChange={e => {
                          const val = Number(e.target.value.replace(/[^0-9]/g, "")) || 0;
                          if (studentForm.feeType === 'yearly_package') {
                            setStudentForm(prev => {
                              const pct = prev.scholarshipPercent || 0;
                              const disc = Math.round((val * pct) / 100);
                              const net = Math.max(0, val - disc);
                              return {
                                ...prev,
                                yearlyStandardFee: val,
                                totalYearlyFee: net,
                                baseFee: Math.round(val / 12),
                                discountAmount: Math.round(disc / 12),
                              };
                            });
                          } else {
                            setStudentForm(prev => {
                              const disc = prev.discountAmount || 0;
                              const pct = val > 0 && disc > 0 ? Number(((disc / val) * 100).toFixed(1)) : (prev.scholarshipPercent || 0);
                              return {
                                ...prev,
                                baseFee: val,
                                yearlyStandardFee: val * 12,
                                scholarshipPercent: pct,
                                discountAmount: val > 0 && pct > 0 ? Math.round((val * pct) / 100) : disc,
                              };
                            });
                          }
                        }}
                        style={{
                          width: `${Math.max(
                            1,
                            String(
                              (studentForm.feeType === 'yearly_package'
                                ? (studentForm.yearlyStandardFee || (studentForm.baseFee > 0 ? studentForm.baseFee * 12 : ""))
                                : (studentForm.baseFee || "")) || 0
                            ).length
                          )}ch`
                        }}
                        className="text-right p-0 m-0 border-0 bg-transparent font-medium text-slate-800 dark:text-slate-200 font-mono placeholder:font-normal placeholder:text-slate-400 focus:outline-none focus:ring-0 leading-none"
                      />
                      <span className="text-slate-400 dark:text-slate-500 text-[11px] select-none ml-1">
                        {studentForm.feeType === 'yearly_package' ? '/yr' : '/mo'}
                      </span>
                    </div>
                  </div>

                  {/* Scholarship: Percentage & Rupee Amount both interactive and synced */}
                  <div className="flex justify-between items-baseline text-slate-600 dark:text-slate-400 text-[12px]">
                    <span className="font-normal">Scholarship:</span>
                    <div className="inline-flex items-baseline justify-end font-medium text-emerald-600 dark:text-emerald-400 font-mono text-[12px] whitespace-nowrap">
                      <input
                        type="text"
                        inputMode="numeric"
                        placeholder="0"
                        title="Scholarship Percentage (%)"
                        value={studentForm.scholarshipPercent ?? ""}
                        onChange={e => {
                          const val = e.target.value.replace(/[^0-9.]/g, "");
                          const pct = Math.min(100, Math.max(0, Number(val) || 0));
                          if (studentForm.feeType === 'yearly_package') {
                            const yearlyStd = studentForm.yearlyStandardFee || (studentForm.baseFee * 12);
                            const disc = Math.round((yearlyStd * pct) / 100);
                            const net = Math.max(0, yearlyStd - disc);
                            setStudentForm(prev => ({
                              ...prev,
                              scholarshipPercent: pct,
                              totalYearlyFee: net,
                              discountAmount: Math.round(disc / 12),
                            }));
                          } else {
                            const base = Number(studentForm.baseFee || 0);
                            const disc = Math.round((base * pct) / 100);
                            setStudentForm(prev => ({
                              ...prev,
                              scholarshipPercent: pct,
                              discountAmount: disc,
                            }));
                          }
                        }}
                        style={{ width: `${Math.max(1, String(studentForm.scholarshipPercent ?? 0).length)}ch` }}
                        className="text-right p-0 m-0 border-0 bg-transparent font-medium text-emerald-600 dark:text-emerald-400 font-mono placeholder:font-normal placeholder:text-slate-400 focus:outline-none focus:ring-0 leading-none"
                      />
                      <span className="select-none">%</span>
                      <span className="ml-1.5 select-none font-mono">(-₹</span>
                      <input
                        type="text"
                        inputMode="numeric"
                        placeholder="0"
                        title="Enter scholarship discount amount in ₹"
                        value={previewDiscount || ""}
                        onChange={e => {
                          const val = Number(e.target.value.replace(/[^0-9]/g, "")) || 0;
                          if (studentForm.feeType === 'yearly_package') {
                            const yearlyStd = studentForm.yearlyStandardFee || (studentForm.baseFee * 12);
                            const cappedDisc = Math.min(yearlyStd, Math.max(0, val));
                            const pct = yearlyStd > 0 ? Number(((cappedDisc / yearlyStd) * 100).toFixed(1)) : 0;
                            const net = Math.max(0, yearlyStd - cappedDisc);
                            setStudentForm(prev => ({
                              ...prev,
                              yearlyStandardFee: yearlyStd,
                              totalYearlyFee: net,
                              scholarshipPercent: pct,
                              discountAmount: cappedDisc,
                            }));
                          } else {
                            const base = Number(studentForm.baseFee || 0);
                            const cappedDisc = Math.min(base, Math.max(0, val));
                            const pct = base > 0 ? Number(((cappedDisc / base) * 100).toFixed(1)) : 0;
                            setStudentForm(prev => ({
                              ...prev,
                              discountAmount: cappedDisc,
                              scholarshipPercent: pct,
                            }));
                          }
                        }}
                        style={{ width: `${Math.max(1, String(previewDiscount || 0).length)}ch` }}
                        className="text-right p-0 m-0 border-0 bg-transparent font-medium text-emerald-600 dark:text-emerald-400 font-mono placeholder:font-normal placeholder:text-slate-400 focus:outline-none focus:ring-0 leading-none"
                      />
                      <span className="font-mono select-none">)</span>
                    </div>
                  </div>

                  {/* Additional Subjects Fee (if any added) */}
                  {currentStudentAddlFee > 0 && (
                    <div className="flex justify-between items-baseline text-slate-600 dark:text-slate-400 text-[12px]">
                      <span className="font-normal flex items-center gap-1">
                        <span>Additional Subjects:</span>
                        <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold bg-indigo-50 dark:bg-indigo-950/60 px-1 py-0.2 rounded">
                          {(studentForm.additionalSubjects || []).filter(s => s.status !== 'removed').length} subj
                        </span>
                      </span>
                      <div className="inline-flex items-baseline justify-end font-semibold text-indigo-600 dark:text-indigo-400 font-mono text-[12px] whitespace-nowrap">
                        <span className="select-none mr-0.5">+₹</span>
                        <span>
                          {studentForm.feeType === 'yearly_package'
                            ? currentStudentAddlFee * (studentForm.yearlyCourseMonths || 12)
                            : currentStudentAddlFee}
                        </span>
                        <span className="text-slate-400 dark:text-slate-500 text-[11px] select-none ml-1">
                          {studentForm.feeType === 'yearly_package' ? '/yr' : '/mo'}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Net Payable Fee Highlight matching Profile View */}
                <div className="flex justify-between items-baseline pt-1.5 border-t border-slate-200/80 dark:border-slate-800">
                  <span className="font-semibold text-slate-900 dark:text-white text-[12px] sm:text-[12.5px]">Net Payable Fee:</span>
                  <div className="inline-flex items-baseline justify-end text-[#2864E8] font-mono tracking-tight whitespace-nowrap">
                    <span className="text-[13px] sm:text-[14px] font-bold mr-1 select-none">₹</span>
                    <input
                      type="text"
                      inputMode="numeric"
                      placeholder="0"
                      title="Net Payable Fee (or edit directly)"
                      value={previewNetFee || ""}
                      onChange={e => {
                        const targetNet = Number(e.target.value.replace(/[^0-9]/g, "")) || 0;
                        if (studentForm.feeType === 'yearly_package') {
                          const yearlyStd = studentForm.yearlyStandardFee || (studentForm.baseFee * 12);
                          const cappedNet = Math.min(yearlyStd, Math.max(0, targetNet));
                          const disc = Math.max(0, yearlyStd - cappedNet);
                          const pct = yearlyStd > 0 ? Number(((disc / yearlyStd) * 100).toFixed(1)) : 0;
                          setStudentForm(prev => ({
                            ...prev,
                            yearlyStandardFee: yearlyStd,
                            totalYearlyFee: cappedNet,
                            scholarshipPercent: pct,
                            discountAmount: disc,
                          }));
                        } else {
                          const base = Number(studentForm.baseFee || 0);
                          const disc = Math.max(0, base - targetNet);
                          const pct = base > 0 ? Number(((disc / base) * 100).toFixed(1)) : 0;
                          setStudentForm(prev => ({
                            ...prev,
                            discountAmount: disc,
                            scholarshipPercent: pct,
                          }));
                        }
                      }}
                      style={{ width: `${Math.max(1, String(previewNetFee || 0).length)}ch` }}
                      className="p-0 m-0 border-0 bg-transparent text-[#2864E8] font-bold font-mono text-[16px] sm:text-[17px] focus:outline-none focus:ring-0 text-right leading-none"
                    />
                    <span className="text-[11px] sm:text-[11.5px] font-medium text-slate-400 dark:text-slate-500 ml-1 select-none">
                      {studentForm.feeType === 'yearly_package' ? '/year' : '/month'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Enrolled Subjects: Show only when batch is selected and has subjects */}
              {Boolean(studentForm.batchId) && (() => {
                const currentBatch = batches.find(b => b.id === studentForm.batchId);
                const batchSubjects = currentBatch?.subjects && currentBatch.subjects.length > 0
                  ? currentBatch.subjects
                  : [];

                if (batchSubjects.length === 0) return null;

                return (
                  <div className="py-1.5 space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-semibold text-slate-400 dark:text-slate-500 tracking-wider">
                        Enrolled Subjects ({studentForm.subjects?.length || 0})
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-0.5">
                      {batchSubjects.map(sub => {
                        const active = studentForm.subjects?.includes(sub);
                        return (
                          <button
                            type="button"
                            key={sub}
                            onClick={() => {
                              if (active) {
                                setStudentForm({
                                  ...studentForm,
                                  subjects: (studentForm.subjects || []).filter(s => s !== sub),
                                });
                              } else {
                                setStudentForm({
                                  ...studentForm,
                                  subjects: [...(studentForm.subjects || []), sub],
                                });
                              }
                            }}
                            title={active ? `Click to remove ${sub}` : `Click to add ${sub}`}
                            className={`inline-flex items-center gap-1.5 text-xs transition-colors cursor-pointer ${
                              active
                                ? "font-medium text-slate-900 dark:text-slate-100"
                                : "font-normal text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full shrink-0 transition-colors ${
                                active ? "bg-[#2864E8]" : "bg-slate-300 dark:bg-slate-600"
                              }`}
                            />
                            <span>{sub}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}

              {/* Additional Subjects (Optional for individual student) - Exactly matches Batch Subject Input Pattern */}
              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Enter Additional Subject (e.g. Computer Science)..."
                    value={newEnrollAddlSubjectName}
                    onChange={e => setNewEnrollAddlSubjectName(toTitleCase(e.target.value))}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddEnrollAddlSubject();
                      }
                    }}
                    className="h-[34px] sm:h-[36px] flex-1 border-0 border-b border-slate-200/90 dark:border-slate-700/80 !bg-transparent rounded-none px-0 text-[13px] sm:text-[13.5px] md:text-[14px] font-medium text-slate-900 dark:text-slate-100 placeholder:text-[9.5px] sm:placeholder:text-[10px] placeholder:text-slate-400 focus:outline-none focus:ring-0 focus:border-slate-300 dark:focus:border-slate-600 focus:shadow-none focus-visible:outline-none focus-visible:ring-0 focus-visible:shadow-none shadow-none"
                  />
                  <div className="flex items-center gap-1 border-b border-slate-200/90 dark:border-slate-700/80 h-[34px] sm:h-[36px] px-1 w-[75px] sm:w-[85px] shrink-0">
                    <span className="text-slate-400 text-xs font-mono">₹</span>
                    <input
                      type="text"
                      inputMode="numeric"
                      placeholder="Fee"
                      value={newEnrollAddlSubjectFee}
                      onChange={e => setNewEnrollAddlSubjectFee(e.target.value.replace(/[^0-9]/g, ''))}
                      onKeyDown={e => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddEnrollAddlSubject();
                        }
                      }}
                      className="w-full text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-transparent border-0 p-0 focus:outline-none focus:ring-0 placeholder:text-slate-400 placeholder:font-normal font-mono"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleAddEnrollAddlSubject()}
                    className="h-[28px] sm:h-[30px] px-2.5 rounded-md text-[11px] font-bold bg-[#2864E8]/10 hover:bg-[#2864E8]/20 text-[#2864E8] flex items-center gap-1 transition-colors cursor-pointer shrink-0"
                    title="Add adition sub."
                    aria-label="Add adition sub."
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add adition sub.</span>
                  </button>
                </div>

                {studentForm.additionalSubjects && studentForm.additionalSubjects.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    {studentForm.additionalSubjects.map((sub, idx) => (
                      <span
                        key={sub.id || idx}
                        className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/40 text-[11px] font-semibold text-slate-800 dark:text-slate-200 border border-indigo-200 dark:border-indigo-800"
                      >
                        <span>{sub.name}</span>
                        <span className="font-mono text-indigo-600 dark:text-indigo-400 font-bold flex items-center">
                          <span>(+₹</span>
                          <input
                            type="text"
                            inputMode="numeric"
                            value={sub.fee || ''}
                            placeholder="0"
                            onChange={e => {
                              const val = Number(e.target.value.replace(/[^0-9]/g, '')) || 0;
                              handleUpdateEnrollAddlSubject(sub.id, 'fee', val);
                            }}
                            style={{ width: `${Math.max(1, String(sub.fee || 0).length)}ch` }}
                            className="p-0 m-0 border-0 bg-transparent text-indigo-600 dark:text-indigo-400 font-mono font-bold text-[11px] focus:outline-none focus:ring-0 text-center"
                            title="Edit fee"
                          />
                          <span>/mo)</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveEnrollAddlSubject(sub.id)}
                          className="text-slate-400 hover:text-rose-600 transition-colors cursor-pointer ml-0.5"
                          title="Remove Subject"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button (Pinned Bottom Action Footer) - Compact & Elegant */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 shrink-0">
              <Button
                type="submit"
                disabled={isPending}
                className="group w-full h-[38px] rounded-lg font-semibold text-[12px] tracking-[0.06em] uppercase bg-[#2864E8] hover:bg-[#1E4ED8] active:bg-[#1842BE] text-white shadow-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <span>ENROLL STUDENT</span>
                <ArrowRight className="w-3.5 h-3.5 text-white/90 group-hover:translate-x-0.5 transition-transform duration-150" />
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* -------------------------------------------------------------------- */}
      {/* MODAL 3B: EDIT STUDENT DETAILS (1:1 Exact Match with Student Profile Visual System) */}
      {/* -------------------------------------------------------------------- */}
      <Dialog open={isEditStudentOpen} onOpenChange={open => {
        if (!open) {
          setIsEditStudentOpen(false);
          setShowAddSubjectInput(false);
        }
      }}>
        <DialogContent overlayClassName="z-[120]" onOpenAutoFocus={(e) => e.preventDefault()} className="z-[121] max-w-[480px] sm:max-w-[500px] w-[94vw] rounded-2xl p-4 sm:p-5 bg-white dark:bg-slate-950 text-left border border-slate-200/80 dark:border-slate-800 shadow-[0_20px_50px_-12px_rgba(15,23,42,0.12),0_4px_16px_rgba(15,23,42,0.04)] overflow-hidden max-h-[88vh] flex flex-col font-['Inter_Tight',sans-serif]">
          {/* Header: Student Name / Edit Title + Compact Student ID & Joined Date matching Profile */}
          <DialogHeader className="pb-2.5 pr-8 border-b border-slate-100 dark:border-slate-800/80 shrink-0">
            <div>
              <DialogTitle className="text-[20px] sm:text-[22px] font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2 leading-snug">
                <span className="w-6 h-6 rounded-md bg-blue-50 dark:bg-blue-950/60 border border-blue-200/60 dark:border-blue-900/50 flex items-center justify-center text-[#2864E8] shrink-0">
                  <Edit className="w-3.5 h-3.5" />
                </span>
                <input
                  type="text"
                  placeholder="Student Full Name"
                  value={editStudentForm.name}
                  onChange={e => setEditStudentForm({ ...editStudentForm, name: toTitleCase(e.target.value) })}
                  required
                  className="font-bold text-slate-900 dark:text-white bg-transparent border-0 p-0 m-0 focus:outline-none focus:ring-0 leading-snug w-full selection:bg-[#2864E8]/20"
                />
              </DialogTitle>
              <div className="text-[11.5px] text-slate-500 font-mono mt-1 flex items-center gap-1.5 flex-nowrap whitespace-nowrap overflow-x-auto no-scrollbar">
                <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 dark:text-slate-500 shrink-0">ID:</span>
                <input
                  type="text"
                  placeholder="ID"
                  value={editStudentForm.rollNumber || ""}
                  onChange={e => setEditStudentForm({ ...editStudentForm, rollNumber: e.target.value })}
                  style={{ width: `${Math.max(8, (editStudentForm.rollNumber || "").length)}ch` }}
                  className="font-bold text-slate-800 dark:text-slate-200 bg-transparent border-0 border-b border-transparent hover:border-slate-300 focus:border-[#2864E8] focus:outline-none p-0 m-0 font-mono uppercase cursor-text selection:bg-[#2864E8]/20"
                />
                <span className="text-slate-300 dark:text-slate-700 shrink-0">•</span>
                <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 dark:text-slate-500 shrink-0">JOIN:</span>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="DD-MM-YYYY"
                  value={editStudentForm.joiningDate || ""}
                  onChange={e => {
                    const formatted = handleDateTyping(e.target.value, editStudentForm.joiningDate);
                    setEditStudentForm({ ...editStudentForm, joiningDate: formatted });
                  }}
                  onBlur={e => {
                    const normalized = normalizeDateBlur(e.target.value);
                    setEditStudentForm({ ...editStudentForm, joiningDate: normalized });
                  }}
                  style={{ width: "10ch" }}
                  className="font-medium text-slate-600 dark:text-slate-300 bg-transparent border-0 border-b border-transparent hover:border-slate-300 focus:border-[#2864E8] focus:outline-none p-0 m-0 font-mono cursor-text selection:bg-[#2864E8]/20"
                />
                <span className="text-slate-300 dark:text-slate-700 shrink-0">•</span>
                <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 dark:text-slate-500 shrink-0">DUE:</span>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="DD-MM-YYYY"
                  value={editStudentForm.dueDate || ""}
                  onChange={e => {
                    const formatted = handleDateTyping(e.target.value, editStudentForm.dueDate);
                    setEditStudentForm({ ...editStudentForm, dueDate: formatted });
                  }}
                  onBlur={e => {
                    const normalized = normalizeDateBlur(e.target.value);
                    setEditStudentForm({ ...editStudentForm, dueDate: normalized });
                  }}
                  style={{ width: "10ch" }}
                  className="font-medium text-slate-600 dark:text-slate-300 bg-transparent border-0 border-b border-transparent hover:border-slate-300 focus:border-[#2864E8] focus:outline-none p-0 m-0 font-mono cursor-text selection:bg-[#2864E8]/20"
                />
              </div>
            </div>
          </DialogHeader>

          <form onSubmit={handleUpdateStudent} className="flex flex-col flex-1 min-h-0 overflow-hidden pt-1 text-left" autoComplete="off">
            <div className="flex-1 overflow-y-auto pr-1 pb-1 space-y-2.5">
              {/* Personal Information Grid (Father/Guardian Name, DOB, Gender, Contacts, Address, Academic) */}
              <div className="py-1.5 border-b border-slate-100 dark:border-slate-800/70 space-y-2 text-xs">
                {/* Row 1: Father / Guardian Name, Date of Birth, Gender (3 columns matching profile view card) */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-3.5 gap-y-1.5">
                  <div>
                    <span className="text-[10.5px] font-medium text-slate-400 dark:text-slate-500 block truncate">
                      Father / Guardian Name
                    </span>
                    <input
                      placeholder="Father Name"
                      value={editStudentForm.fatherName}
                      onChange={e => setEditStudentForm({ ...editStudentForm, fatherName: toTitleCase(e.target.value) })}
                      required
                      className="w-full bg-transparent border-0 border-b border-transparent hover:border-slate-300 dark:hover:border-slate-700 focus:border-[#2864E8] dark:focus:border-[#2864E8] focus:outline-none focus:ring-0 text-[13px] font-semibold text-slate-800 dark:text-slate-100 placeholder:text-slate-400/80 p-0 m-0 mt-0.5 h-[22px] leading-tight transition-colors"
                    />
                  </div>

                  <div>
                    <span className="text-[10.5px] font-medium text-slate-400 dark:text-slate-500 block">
                      Date of Birth
                    </span>
                    <input
                      type="text"
                      inputMode="numeric"
                      placeholder="DD-MM-YYYY"
                      value={editStudentForm.dob || ""}
                      onChange={e => {
                        const formatted = handleDateTyping(e.target.value, editStudentForm.dob);
                        setEditStudentForm({ ...editStudentForm, dob: formatted });
                      }}
                      onBlur={e => {
                        const normalized = normalizeDateBlur(e.target.value);
                        setEditStudentForm({ ...editStudentForm, dob: normalized });
                      }}
                      className="w-full bg-transparent border-0 border-b border-transparent hover:border-slate-300 dark:hover:border-slate-700 focus:border-[#2864E8] dark:focus:border-[#2864E8] focus:outline-none focus:ring-0 text-[13px] font-semibold text-slate-800 dark:text-slate-100 font-mono placeholder:text-slate-400/80 p-0 m-0 mt-0.5 h-[22px] leading-tight transition-colors"
                    />
                  </div>

                  <div>
                    <span className="text-[10.5px] font-medium text-slate-400 dark:text-slate-500 block">
                      Gender
                    </span>
                    <Select
                      value={editStudentForm.gender || ""}
                      onValueChange={(val: any) => setEditStudentForm({ ...editStudentForm, gender: val })}
                    >
                      <SelectTrigger className="w-full bg-transparent border-0 border-b border-transparent hover:border-slate-300 dark:hover:border-slate-700 focus:border-[#2864E8] dark:focus:border-[#2864E8] focus:outline-none focus:ring-0 text-[13px] font-semibold text-slate-800 dark:text-slate-100 p-0 m-0 mt-0.5 h-[22px] shadow-none flex items-center justify-between cursor-pointer transition-colors [&>svg]:h-2.5 [&>svg]:w-2.5 [&>svg]:text-slate-400 [&>svg]:opacity-50 hover:[&>svg]:text-[#2864E8] hover:[&>svg]:opacity-100">
                        <SelectValue placeholder="Gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male" className="text-xs">Male</SelectItem>
                        <SelectItem value="female" className="text-xs">Female</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Row 2: Primary Contact, Secondary Contact, Emergency Contact (3 columns matching profile view card) */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-3.5 gap-y-1.5 pt-1.5 border-t border-slate-100/80 dark:border-slate-800/50">
                  <div>
                    <span className="text-[10.5px] font-medium text-slate-400 dark:text-slate-500 block">
                      Primary Contact
                    </span>
                    <input
                      type="tel"
                      maxLength={10}
                      placeholder="Primary Phone"
                      value={editStudentForm.fatherContact || ""}
                      onChange={e => setEditStudentForm({ ...editStudentForm, fatherContact: e.target.value })}
                      className="w-full bg-transparent border-0 border-b border-transparent hover:border-slate-300 dark:hover:border-slate-700 focus:border-[#2864E8] dark:focus:border-[#2864E8] focus:outline-none focus:ring-0 text-[13px] font-semibold text-slate-800 dark:text-slate-100 font-mono placeholder:text-slate-400/80 p-0 m-0 mt-0.5 h-[22px] leading-tight transition-colors"
                    />
                  </div>

                  <div>
                    <span className="text-[10.5px] font-medium text-slate-400 dark:text-slate-500 block">
                      Secondary Contact
                    </span>
                    <input
                      type="tel"
                      maxLength={10}
                      placeholder="Secondary Phone"
                      value={editStudentForm.motherContact || ""}
                      onChange={e => setEditStudentForm({ ...editStudentForm, motherContact: e.target.value, contact2: e.target.value })}
                      className="w-full bg-transparent border-0 border-b border-transparent hover:border-slate-300 dark:hover:border-slate-700 focus:border-[#2864E8] dark:focus:border-[#2864E8] focus:outline-none focus:ring-0 text-[13px] font-semibold text-slate-800 dark:text-slate-100 font-mono placeholder:text-slate-400/80 p-0 m-0 mt-0.5 h-[22px] leading-tight transition-colors"
                    />
                  </div>

                  <div>
                    <span className="text-[10.5px] font-medium text-slate-400 dark:text-slate-500 block">
                      Emergency Contact
                    </span>
                    <input
                      type="tel"
                      maxLength={10}
                      placeholder="Emergency Phone"
                      value={editStudentForm.contact1}
                      onChange={e => setEditStudentForm({ ...editStudentForm, contact1: e.target.value })}
                      required
                      className="w-full bg-transparent border-0 border-b border-transparent hover:border-slate-300 dark:hover:border-slate-700 focus:border-[#2864E8] dark:focus:border-[#2864E8] focus:outline-none focus:ring-0 text-[13px] font-semibold text-slate-800 dark:text-slate-100 font-mono placeholder:text-slate-400/80 p-0 m-0 mt-0.5 h-[22px] leading-tight transition-colors"
                    />
                  </div>
                </div>

                {/* Row 3: Residential Address (Full-width row matching profile view card) */}
                <div className="pt-1.5 border-t border-slate-100/80 dark:border-slate-800/50">
                  <span className="text-[10.5px] font-medium text-slate-400 dark:text-slate-500 block">
                    Residential Address
                  </span>
                  <input
                    placeholder="Residential Address"
                    value={editStudentForm.address}
                    onChange={e => setEditStudentForm({ ...editStudentForm, address: toTitleCase(e.target.value) })}
                    className="w-full bg-transparent border-0 border-b border-transparent hover:border-slate-300 dark:hover:border-slate-700 focus:border-[#2864E8] dark:focus:border-[#2864E8] focus:outline-none focus:ring-0 text-[12.5px] font-medium text-slate-800 dark:text-slate-200 placeholder:text-slate-400/80 p-0 m-0 mt-0.5 h-[22px] leading-snug transition-colors"
                  />
                </div>

                {/* Row 4: Academic Details (Branch, Class, Batch) in clean 3-column row matching profile view card */}
                <div className="pt-1.5 border-t border-slate-100/80 dark:border-slate-800/50 grid grid-cols-1 sm:grid-cols-3 gap-x-3.5 gap-y-1.5">
                  <div>
                    <span className="text-[10.5px] font-medium text-slate-400 dark:text-slate-500 block">
                      Branch
                    </span>
                    <Select
                      value={editStudentForm.branchId}
                      onValueChange={val => setEditStudentForm({ ...editStudentForm, branchId: val, classId: "", batchId: "" })}
                    >
                      <SelectTrigger className="w-full bg-transparent border-0 border-b border-transparent hover:border-slate-300 dark:hover:border-slate-700 focus:border-[#2864E8] dark:focus:border-[#2864E8] focus:outline-none focus:ring-0 text-[13px] font-semibold text-slate-800 dark:text-slate-100 p-0 m-0 mt-0.5 h-[22px] shadow-none flex items-center justify-between cursor-pointer transition-colors [&>svg]:h-2.5 [&>svg]:w-2.5 [&>svg]:text-slate-400 [&>svg]:opacity-50 hover:[&>svg]:text-[#2864E8] hover:[&>svg]:opacity-100">
                        <SelectValue placeholder="Branch" />
                      </SelectTrigger>
                      <SelectContent>
                        {IDL_BRANCHES.filter(b => b.id !== "all").map(b => (
                          <SelectItem key={b.id} value={b.id} className="text-xs">{b.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <span className="text-[10.5px] font-medium text-slate-400 dark:text-slate-500 block">
                      Class
                    </span>
                    <Select
                      value={editStudentForm.classId}
                      onValueChange={val => {
                        const c = classes.find(item => item.id === val);
                        setEditStudentForm({
                          ...editStudentForm,
                          classId: val,
                          batchId: "",
                          baseFee: c?.defaultMonthlyFee || editStudentForm.baseFee,
                        });
                      }}
                    >
                      <SelectTrigger className="w-full bg-transparent border-0 border-b border-transparent hover:border-slate-300 dark:hover:border-slate-700 focus:border-[#2864E8] dark:focus:border-[#2864E8] focus:outline-none focus:ring-0 text-[13px] font-semibold text-slate-800 dark:text-slate-100 p-0 m-0 mt-0.5 h-[22px] shadow-none flex items-center justify-between cursor-pointer transition-colors [&>svg]:h-2.5 [&>svg]:w-2.5 [&>svg]:text-slate-400 [&>svg]:opacity-50 hover:[&>svg]:text-[#2864E8] hover:[&>svg]:opacity-100">
                        <SelectValue placeholder="Class" />
                      </SelectTrigger>
                      <SelectContent>
                        {classes
                          .filter(c => c.branchId === editStudentForm.branchId || c.branchId === "all")
                          .map(c => (
                            <SelectItem key={c.id} value={c.id} className="text-xs">{c.name}</SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <span className="text-[10.5px] font-medium text-slate-400 dark:text-slate-500 block">
                      Batch
                    </span>
                    <Select
                      value={editStudentForm.batchId}
                      onValueChange={val => {
                        const b = batches.find(item => item.id === val);
                        const c = classes.find(item => item.id === editStudentForm.classId);
                        const actualMonthlyFee = (b && typeof b.monthlyFee === 'number' && b.monthlyFee > 0)
                          ? b.monthlyFee
                          : (c?.defaultMonthlyFee || 0);
                        const actualYearlyFee = (b && typeof b.courseFee === 'number' && b.courseFee > 0)
                          ? b.courseFee
                          : (actualMonthlyFee * 12);

                        setEditStudentForm(prev => {
                          let pct = prev.scholarshipPercent || 0;
                          const isYr = prev.feeType === 'yearly_package';
                          const stdFee = isYr ? actualYearlyFee : actualMonthlyFee;
                          const disc = Math.round((stdFee * pct) / 100);
                          return {
                            ...prev,
                            batchId: val,
                            baseFee: actualMonthlyFee,
                            yearlyStandardFee: actualYearlyFee,
                            totalYearlyFee: actualYearlyFee - Math.round((actualYearlyFee * pct) / 100),
                            discountAmount: Math.round((actualMonthlyFee * pct) / 100),
                            scholarshipPercent: pct,
                            subjects: b?.subjects ? [...b.subjects] : prev.subjects,
                          };
                        });
                      }}
                    >
                      <SelectTrigger className="w-full bg-transparent border-0 border-b border-transparent hover:border-slate-300 dark:hover:border-slate-700 focus:border-[#2864E8] dark:focus:border-[#2864E8] focus:outline-none focus:ring-0 text-[13px] font-semibold text-slate-800 dark:text-slate-100 p-0 m-0 mt-0.5 h-[22px] shadow-none flex items-center justify-between cursor-pointer transition-colors [&>svg]:h-2.5 [&>svg]:w-2.5 [&>svg]:text-slate-400 [&>svg]:opacity-50 hover:[&>svg]:text-[#2864E8] hover:[&>svg]:opacity-100">
                        <SelectValue placeholder="Batch" />
                      </SelectTrigger>
                      <SelectContent>
                        {batches
                          .filter(b => b.classId === editStudentForm.classId)
                          .map(b => (
                            <SelectItem key={b.id} value={b.id} className="text-xs">{b.name}</SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Fee Breakdown Card: Clean, Compact Premium Styling */}
              <div className="p-3 rounded-xl bg-slate-50/60 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800/60 space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[10.5px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <IndianRupee className="w-3.5 h-3.5 text-[#2864E8]" />
                    FEE BREAKDOWN
                  </span>

                  {/* Clean text Monthly / Yearly Toggle matching gray uppercase style */}
                  <div className="flex items-center gap-1.5 text-[10px] font-semibold tracking-wider uppercase">
                    <button
                      type="button"
                      onClick={() => handleToggleEditStudentFeeType('monthly')}
                      className={`transition-colors cursor-pointer ${
                        editStudentForm.feeType !== 'yearly_package'
                          ? 'text-slate-700 dark:text-slate-200 font-bold'
                          : 'text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300'
                      }`}
                    >
                      Monthly Fee
                    </button>
                    <span className="text-slate-300 dark:text-slate-700">•</span>
                    <button
                      type="button"
                      onClick={() => handleToggleEditStudentFeeType('yearly_package')}
                      className={`transition-colors cursor-pointer ${
                        editStudentForm.feeType === 'yearly_package'
                          ? 'text-slate-700 dark:text-slate-200 font-bold'
                          : 'text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300'
                      }`}
                    >
                      Yearly Package
                    </button>
                  </div>
                </div>

                <div className="space-y-1 pt-0.5">
                  {/* Standard Fee: Fixed from batch, non-editable */}
                  <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
                    <span className="text-[12px] font-medium">Standard Fee:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200 font-mono text-[13px] tabular-nums">
                      ₹{Number(editStudentForm.feeType === 'yearly_package'
                        ? (editStudentForm.yearlyStandardFee || (editStudentForm.baseFee > 0 ? editStudentForm.baseFee * 12 : 0))
                        : (editStudentForm.baseFee || 0)).toLocaleString('en-IN')}
                      <span className="text-[10.5px] text-slate-400 font-normal ml-0.5">
                        {editStudentForm.feeType === 'yearly_package' ? '/yr' : '/mo'}
                      </span>
                    </span>
                  </div>

                  {/* Scholarship: Percentage is non-editable, only discount amount (₹) is editable */}
                  <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
                    <span className="text-[12px] font-medium">Scholarship:</span>
                    <div className="flex items-center justify-end font-semibold text-emerald-600 dark:text-emerald-400 font-mono text-[13px] tabular-nums">
                      <span>{editStudentForm.scholarshipPercent || 0}%</span>
                      <span className="ml-1 mr-0.5 text-emerald-600 dark:text-emerald-400">(-₹</span>
                      <input
                        type="text"
                        inputMode="numeric"
                        placeholder="0"
                        title="Enter scholarship discount amount in ₹"
                        value={editPreviewDiscount ? editPreviewDiscount : ""}
                        onChange={e => {
                          const rawVal = e.target.value.replace(/[^0-9]/g, "");
                          const val = rawVal === "" ? 0 : Number(rawVal);
                          const cMonths = editStudentForm.yearlyCourseMonths || 12;
                          if (editStudentForm.feeType === 'yearly_package') {
                            const yearlyStd = editStudentForm.yearlyStandardFee || ((editStudentForm.baseFee || 0) * cMonths);
                            const cappedDisc = Math.min(yearlyStd, Math.max(0, val));
                            const pct = yearlyStd > 0 ? Number(((cappedDisc / yearlyStd) * 100).toFixed(1)) : 0;
                            const net = Math.max(0, yearlyStd - cappedDisc);
                            const monthlyDisc = Math.round(cappedDisc / cMonths);
                            setEditStudentForm(prev => ({
                              ...prev,
                              yearlyStandardFee: yearlyStd,
                              totalYearlyFee: net,
                              scholarshipPercent: pct,
                              discountAmount: monthlyDisc,
                            }));
                          } else {
                            const base = Number(editStudentForm.baseFee || 0);
                            const cappedDisc = Math.min(base, Math.max(0, val));
                            const pct = base > 0 ? Number(((cappedDisc / base) * 100).toFixed(1)) : 0;
                            const yearlyStd = editStudentForm.yearlyStandardFee || (base * cMonths);
                            const totalYr = Math.max(0, yearlyStd - (cappedDisc * cMonths));
                            setEditStudentForm(prev => ({
                              ...prev,
                              discountAmount: cappedDisc,
                              scholarshipPercent: pct,
                              totalYearlyFee: totalYr,
                            }));
                          }
                        }}
                        style={{ width: `${Math.max(2, String(editPreviewDiscount || "").length)}ch` }}
                        className="bg-transparent border-0 border-b border-transparent hover:border-emerald-300 focus:border-emerald-500 focus:outline-none focus:ring-0 p-0 m-0 font-semibold text-emerald-600 dark:text-emerald-400 font-mono text-[13px] text-right transition-colors"
                      />
                      <span className="text-emerald-600 dark:text-emerald-400">)</span>
                    </div>
                  </div>

                  {/* Additional Subjects Fee (if any) */}
                  {currentEditStudentAddlFee > 0 && (
                    <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
                      <span className="flex items-center gap-1.5 text-[12px] font-medium">
                        <span>Additional Subjects:</span>
                        <span className="text-[9.5px] text-purple-700 dark:text-purple-300 font-semibold bg-purple-50 dark:bg-purple-950/40 border border-purple-200/60 dark:border-purple-800/40 px-1.5 py-0.2 rounded">
                          {(editStudentForm.additionalSubjects || []).filter(s => s.status !== 'removed').length} subj
                        </span>
                      </span>
                      <span className="font-semibold text-purple-600 dark:text-purple-400 font-mono text-[13px]">
                        +₹{editStudentForm.feeType === 'yearly_package'
                          ? currentEditStudentAddlFee * (editStudentForm.yearlyCourseMonths || 12)
                          : currentEditStudentAddlFee}
                        <span className="text-[10.5px] text-slate-400 font-normal ml-0.5">
                          {editStudentForm.feeType === 'yearly_package' ? '/yr' : '/mo'}
                        </span>
                      </span>
                    </div>
                  )}
                </div>

                {/* Net Payable Fee Highlight: Non-editable bold text */}
                <div className="flex justify-between items-baseline pt-1.5 border-t border-slate-200/70 dark:border-slate-800">
                  <span className="font-bold text-slate-900 dark:text-white text-[12.5px]">Net Payable Fee:</span>
                  <span className="text-[#2864E8] font-bold text-[16px] font-mono tracking-tight tabular-nums">
                    ₹{Number(editPreviewNetFee || 0).toLocaleString('en-IN')}
                    <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 ml-0.5">
                      {editStudentForm.feeType === 'yearly_package' ? '/year' : '/month'}
                    </span>
                  </span>
                </div>
              </div>

              {/* Enrolled & Additional Subjects: Single-line Interactive Text Tabs matching screenshot */}
              <div className="py-2 border-b border-slate-100 dark:border-slate-800/70 space-y-1.5 text-xs">
                {/* Single Line Tabs: ENROLLED SUBJECTS & ADDITIONAL SUBJECTS */}
                <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
                  <button
                    type="button"
                    onClick={() => setEditStudentSubjectTab('enrolled')}
                    className={`text-[10.5px] uppercase font-bold tracking-wider transition-colors cursor-pointer bg-transparent border-0 p-0 ${
                      editStudentSubjectTab === 'enrolled'
                        ? 'text-slate-900 dark:text-white'
                        : 'text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300'
                    }`}
                  >
                    ENROLLED SUBJECTS ({editStudentForm.subjects.length})
                  </button>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setEditStudentSubjectTab('additional')}
                      className={`text-[10.5px] uppercase font-bold tracking-wider transition-colors cursor-pointer bg-transparent border-0 p-0 ${
                        editStudentSubjectTab === 'additional'
                          ? 'text-slate-900 dark:text-white'
                          : 'text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300'
                      }`}
                    >
                      ADDITIONAL SUBJECTS ({(editStudentForm.additionalSubjects || []).filter(s => s.status !== 'removed').length})
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (editStudentSubjectTab !== 'additional') {
                          setEditStudentSubjectTab('additional');
                          setShowAddSubjectInput(true);
                        } else {
                          setShowAddSubjectInput(prev => !prev);
                        }
                      }}
                      title={showAddSubjectInput ? "Hide Add Subject Input" : "Add Additional Subject"}
                      className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors cursor-pointer bg-transparent ${
                        showAddSubjectInput
                          ? 'border-[#2864E8] text-[#2864E8]'
                          : 'border-slate-300 dark:border-slate-600 hover:border-[#2864E8] text-slate-400 hover:text-[#2864E8]'
                      }`}
                    >
                      <Plus className="w-2.5 h-2.5" />
                    </button>
                  </div>
                </div>

                {/* Tab 1 Content: Enrolled Subjects */}
                {editStudentSubjectTab === 'enrolled' && (
                  (() => {
                    const currentBatch = batches.find(b => b.id === editStudentForm.batchId);
                    const batchSubjects = currentBatch?.subjects && currentBatch.subjects.length > 0
                      ? currentBatch.subjects
                      : (editStudentForm.subjects && editStudentForm.subjects.length > 0 ? editStudentForm.subjects : []);

                    if (batchSubjects.length === 0) {
                      return (
                        <div className="pt-0.5 text-xs text-slate-400 italic">
                          No subjects configured in selected batch.
                        </div>
                      );
                    }

                    return (
                      <div className="flex flex-wrap items-center gap-x-3.5 gap-y-1 pt-0.5">
                        {batchSubjects.map(sub => {
                          const cleanSub = sub
                            .replace(/Socil\s*Studies/gi, 'Social Studies')
                            .replace(/Socil/gi, 'Social');
                          const active = editStudentForm.subjects.includes(sub);
                          return (
                            <button
                              type="button"
                              key={sub}
                              onClick={() => {
                                if (active) {
                                  setEditStudentForm({
                                    ...editStudentForm,
                                    subjects: editStudentForm.subjects.filter(s => s !== sub),
                                  });
                                } else {
                                  setEditStudentForm({
                                    ...editStudentForm,
                                    subjects: [...editStudentForm.subjects, sub],
                                  });
                                }
                              }}
                              title={active ? `Click to remove ${cleanSub}` : `Click to add ${cleanSub}`}
                              className={`inline-flex items-center gap-1.5 text-xs transition-colors cursor-pointer ${
                                active
                                  ? "font-semibold text-slate-800 dark:text-slate-200"
                                  : "font-normal text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
                              }`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full shrink-0 transition-colors ${
                                  active ? "bg-slate-400 dark:bg-slate-500" : "bg-slate-200 dark:bg-slate-700"
                                }`}
                              />
                              <span>{cleanSub}</span>
                            </button>
                          );
                        })}
                      </div>
                    );
                  })()
                )}

                {/* Tab 2 Content: Additional Subjects with Add input & management in exact same space */}
                {editStudentSubjectTab === 'additional' && (
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 pt-0.5">
                    {/* Existing Additional Subjects with gray bullets matching profile view */}
                    {editStudentForm.additionalSubjects && editStudentForm.additionalSubjects.length > 0 ? (
                      editStudentForm.additionalSubjects.map((sub, idx) => {
                        const cleanName = (sub.name || '')
                          .replace(/Socil\s*Studies/gi, 'Social Studies')
                          .replace(/Socil/gi, 'Social');
                        const isRemoved = sub.status === 'removed';
                        return (
                          <span
                            key={sub.id || idx}
                            className={`inline-flex items-center gap-1 text-xs ${
                              isRemoved ? 'line-through text-slate-400 opacity-60' : 'font-semibold text-slate-800 dark:text-slate-200'
                            }`}
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-500 shrink-0" />
                            <span>{cleanName}</span>
                            <span className={`text-[11px] font-mono tabular-nums ${isRemoved ? 'text-slate-400' : 'text-purple-600 dark:text-purple-400'}`}>
                              (+₹{sub.fee})
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                setEditStudentForm(prev => ({
                                  ...prev,
                                  additionalSubjects: (prev.additionalSubjects || []).filter(s => s.id !== sub.id),
                                }));
                              }}
                              className="text-slate-400 hover:text-rose-500 transition-colors cursor-pointer p-0.5 ml-0.5"
                              title={`Delete ${cleanName}`}
                            >
                              <X className="w-2.5 h-2.5" />
                            </button>
                          </span>
                        );
                      })
                    ) : (
                      !showAddSubjectInput && (
                        <div className="text-xs text-slate-400 italic">
                          No additional subjects. Click (+) above to add.
                        </div>
                      )
                    )}

                    {/* Inline Add Subject Controls: Toggled by the circular (+) button in the header */}
                    {showAddSubjectInput && (
                      <div className="inline-flex items-center gap-1.5">
                        <input
                          autoFocus
                          placeholder="Add subject..."
                          value={newEditAddlSubjectName}
                          onChange={e => setNewEditAddlSubjectName(toTitleCase(e.target.value))}
                          onKeyDown={e => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddEditAddlSubject();
                            }
                          }}
                          className="h-[22px] w-[110px] sm:w-[125px] bg-transparent border-0 border-b border-transparent hover:border-slate-300 dark:hover:border-slate-700 focus:border-[#2864E8] dark:focus:border-[#2864E8] focus:outline-none focus:ring-0 text-xs font-medium text-slate-800 dark:text-slate-100 placeholder:text-slate-400 p-0 m-0 transition-colors"
                        />
                        <div className="inline-flex items-center">
                          <span className="text-slate-400 text-xs font-mono mr-0.5">₹</span>
                          <input
                            type="text"
                            inputMode="numeric"
                            placeholder="Fee"
                            value={newEditAddlSubjectFee}
                            onChange={e => setNewEditAddlSubjectFee(e.target.value.replace(/[^0-9]/g, ''))}
                            onKeyDown={e => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleAddEditAddlSubject();
                              }
                            }}
                            className="h-[22px] w-[42px] bg-transparent border-0 border-b border-transparent hover:border-slate-300 dark:hover:border-slate-700 focus:border-[#2864E8] dark:focus:border-[#2864E8] focus:outline-none focus:ring-0 text-xs font-semibold text-purple-600 dark:text-purple-400 placeholder:text-slate-400 font-mono p-0 m-0 transition-colors"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => handleAddEditAddlSubject()}
                          className="w-4 h-4 rounded-full border border-slate-300 dark:border-slate-600 hover:border-[#2864E8] text-slate-400 hover:text-[#2864E8] flex items-center justify-center transition-colors cursor-pointer shrink-0 bg-transparent"
                          title="Add Subject"
                        >
                          <Plus className="w-2.5 h-2.5" />
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button (Pinned Bottom Action Footer) - Compact & Elegant */}
            <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800/80 shrink-0">
              <Button
                type="submit"
                disabled={isPending}
                className="group w-full h-[48px] rounded-xl font-bold text-[13px] tracking-wider uppercase bg-[#2864E8] hover:bg-[#1E4ED8] active:bg-[#1842BE] text-white shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span>SAVE STUDENT CHANGES</span>
                <ArrowRight className="w-4 h-4 text-white/90 group-hover:translate-x-0.5 transition-transform duration-150" />
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* -------------------------------------------------------------------- */}
      {/* MODAL 4: COLLECT FEE MODAL */}
      {/* -------------------------------------------------------------------- */}
      <Dialog
        open={isCollectFeeOpen}
        onOpenChange={(open) => {
          setIsCollectFeeOpen(open);
          if (!open && typeof document !== 'undefined') {
            document.body.style.pointerEvents = '';
          }
        }}
      >
        <DialogContent className="max-w-[440px] w-[94vw] rounded-2xl p-5 bg-white dark:bg-slate-950 border border-slate-200/90 dark:border-slate-800 shadow-[0_25px_60px_-15px_rgba(15,23,42,0.18),0_4px_16px_rgba(15,23,42,0.06)] font-['Inter_Tight',sans-serif]">
          <DialogHeader className="pb-3 border-b border-slate-100 dark:border-slate-800/80 shrink-0">
            <div>
              <DialogTitle className="text-base sm:text-[17px] font-bold text-slate-900 dark:text-white tracking-tight">
                Collect Student Fee
              </DialogTitle>
              <DialogDescription className="text-[11.5px] text-slate-400 dark:text-slate-500 font-normal mt-0.5">
                Record fee receipt and update monthly ledger.
              </DialogDescription>
            </div>
          </DialogHeader>

          {collectTarget && (
            <form onSubmit={handleRecordPayment} className="space-y-3 pt-1">
              {/* Target Student Header Section: Clean White with Horizontal Separator */}
              <div className="pb-3 border-b border-slate-100 dark:border-slate-800/80">
                <div className="flex items-start justify-between gap-3">
                  {/* Left Side: Student Name, Father Name, Join Date, Due Date */}
                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="text-[15px] font-bold text-slate-900 dark:text-white truncate tracking-tight">
                        {collectTarget.student.name}
                      </span>
                      {(collectTarget.student.feeType === 'yearly_package' || Boolean(collectTarget.student.yearlyPackage)) && (
                        <span title="Yearly Package Student" className="inline-flex items-center justify-center shrink-0 ml-0.5">
                          <span className="w-2 h-2 rounded-full bg-violet-600 dark:bg-violet-400 shadow-[0_0_7px_2px_rgba(139,92,246,0.75)] animate-pulse" />
                        </span>
                      )}
                    </div>

                    <div className="text-[12px] text-slate-500 dark:text-slate-400 font-normal">
                      Father : <span className="font-semibold text-slate-800 dark:text-slate-200 capitalize">{collectTarget.student.fatherName || '—'}</span>
                    </div>

                    {/* Join Date Line */}
                    <div className="text-[11px] text-slate-400 dark:text-slate-500 pt-0.5">
                      <span>Join Date : <strong className="font-mono text-slate-700 dark:text-slate-300 font-semibold">{formatAdmDate(collectTarget.student.joiningDate)}</strong></span>
                    </div>

                    {/* Due Date & Overdue Line (Directly Below Join Date in One Line) */}
                    {(() => {
                      const effDue = (collectTarget.student.feeType === 'yearly_package' || Boolean(collectTarget.student.yearlyPackage)) ? (collectTarget.student.joiningDate || collectTarget.dueDate) : collectTarget.dueDate;
                      const oDays = getOverdueDays(effDue);
                      const isOverdue = oDays > 0 && (collectTarget.status === 'OVERDUE' || collectTarget.isOverdue || collectTarget.balanceAmount > 0);

                      return (
                        <div className="flex items-center gap-2.5 pt-0.5 leading-none">
                          <span className={`text-[11px] ${isOverdue ? 'text-rose-600 dark:text-rose-400' : 'text-slate-400 dark:text-slate-500'}`}>
                            Due Date : <strong className={`font-mono font-semibold ${isOverdue ? 'text-rose-600 dark:text-rose-400' : 'text-slate-700 dark:text-slate-300'}`}>{formatAdmDate(effDue)}</strong>
                          </span>
                          {isOverdue && (
                            <div className="inline-flex flex-col items-start leading-none text-rose-600 dark:text-rose-400">
                              <span className="flex items-baseline gap-0.5 leading-none">
                                <strong className="font-bold text-xs sm:text-[13px] tabular-nums leading-none">{oDays}</strong>
                                <span className="text-[9px] font-medium leading-none">{oDays === 1 ? 'day' : 'days'}</span>
                              </span>
                              <span className="text-[9.5px] font-semibold leading-none mt-0.5">
                                Overdue
                              </span>
                            </div>
                          )}
                        </div>
                      );
                    })()}
                  </div>

                  {/* Right Side: Student IDL badge with No Background & No Outline */}
                  <div className="shrink-0">
                    <span className="font-mono font-medium text-[11px] text-slate-500 dark:text-slate-400">
                      {collectTarget.student.rollNumber}
                    </span>
                  </div>
                </div>
              </div>

              {/* Fee Breakdown Section: Clean White with Horizontal Separator */}
              <div className="space-y-2 text-xs pb-3 border-b border-slate-100 dark:border-slate-800/80">
                <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  <span className="flex items-center gap-1.5 whitespace-nowrap shrink-0">
                    <IndianRupee className="w-3.5 h-3.5 text-[#2864E8]" />
                    FEE BREAKDOWN
                  </span>
                  <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 tracking-wider uppercase">
                    {(collectTarget.student.feeType === 'yearly_package' || Boolean(collectTarget.student.yearlyPackage)) ? "Yearly Package" : "MONTHLY FEE"}
                  </span>
                </div>

                <div className="space-y-1.5 pt-0.5 text-xs">
                  {/* Standard Fee */}
                  <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
                    <span className="font-medium text-[12px]">Standard Fee:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200 font-mono tabular-nums text-[12.5px]">
                      ₹{Number(
                        (collectTarget.student.feeType === 'yearly_package' || Boolean(collectTarget.student.yearlyPackage))
                          ? (collectTarget.student.yearlyPackage?.totalYearlyFee
                              ? (collectTarget.student.yearlyPackage.totalYearlyFee + ((collectTarget.student.discountAmount || 0) * (collectTarget.student.yearlyPackage.courseMonths || 12)))
                              : (collectTarget.student.baseFee || 3000) * 12)
                          : (collectTarget.student.baseFee || collectTarget.baseAmount || collectTarget.netDueAmount)
                      ).toLocaleString('en-IN')}
                      <span className="text-[10.5px] text-slate-400 font-normal ml-0.5">
                        {(collectTarget.student.feeType === 'yearly_package' || Boolean(collectTarget.student.yearlyPackage)) ? "/yr" : "/mo"}
                      </span>
                    </span>
                  </div>

                  {/* Scholarship */}
                  <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
                    <span className="font-medium text-[12px]">Scholarship:</span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400 font-mono tabular-nums text-[12.5px]">
                      {collectTarget.student.scholarshipPercent || 0}% (-₹
                      {Number(
                        (collectTarget.student.feeType === 'yearly_package' || Boolean(collectTarget.student.yearlyPackage))
                          ? (collectTarget.student.discountAmount || 0) * (collectTarget.student.yearlyPackage?.courseMonths || 12)
                          : (collectTarget.discountAmount || collectTarget.student.discountAmount || 0)
                      ).toLocaleString('en-IN')})
                    </span>
                  </div>

                  {/* Additional Subjects (if any) */}
                  {(() => {
                    const activeSubs = getActiveAdditionalSubjectsForMonth(collectTarget.student, collectTarget.month || selectedMonth || '2026-11');
                    const totalAddl = activeSubs.reduce((sum, s) => sum + (Number(s.fee) || 0), 0);
                    if (totalAddl <= 0) return null;
                    const isYearly = collectTarget.student.feeType === 'yearly_package' || Boolean(collectTarget.student.yearlyPackage);
                    return (
                      <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
                        <span className="flex items-center gap-1.5">
                          <span className="font-medium text-[12px]">Additional Subjects:</span>
                          <span className="text-[9.5px] text-violet-600 dark:text-violet-400 font-bold bg-violet-50/80 dark:bg-violet-950/50 border border-violet-200/60 dark:border-violet-800/50 px-1.5 py-0.5 rounded">
                            {activeSubs.length} subj
                          </span>
                        </span>
                        <span className="font-semibold text-violet-600 dark:text-violet-400 font-mono tabular-nums text-[12.5px]">
                          +₹{Number(isYearly ? totalAddl * 12 : totalAddl).toLocaleString('en-IN')}
                          <span className="text-[10.5px] text-slate-400 font-normal ml-0.5">
                            {isYearly ? '/yr' : '/mo'}
                          </span>
                        </span>
                      </div>
                    );
                  })()}
                </div>

                {/* Net Payable Fee */}
                <div className="flex justify-between items-baseline pt-2 border-t border-slate-100 dark:border-slate-800">
                  <span className="font-bold text-slate-900 dark:text-white text-[13px] tracking-tight">Net Payable Fee:</span>
                  <span className="text-[#2864E8] font-bold text-[17px] sm:text-[18px] font-mono tabular-nums tracking-tight">
                    ₹{Number(
                      (collectTarget.student.feeType === 'yearly_package' || Boolean(collectTarget.student.yearlyPackage))
                        ? (collectTarget.student.yearlyPackage?.totalYearlyFee || (collectTarget.student.netFee * 12))
                        : collectTarget.netDueAmount
                    ).toLocaleString('en-IN')}
                    <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 ml-0.5">
                      {(collectTarget.student.feeType === 'yearly_package' || Boolean(collectTarget.student.yearlyPackage)) ? "/year" : "/month"}
                    </span>
                  </span>
                </div>
              </div>

              {/* Partial Payment Reminder (if student has already paid part of fee) */}
              {collectTarget.paidAmount > 0 && (
                <div className="flex items-center justify-between text-[11px] px-3 py-1.5 rounded-[5px] bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200/70 dark:border-amber-900/40 text-amber-800 dark:text-amber-300 font-medium">
                  <span>Already Paid: <strong className="font-semibold text-emerald-700 dark:text-emerald-400">₹{collectTarget.paidAmount.toLocaleString('en-IN')}</strong></span>
                  <span>Balance Due: <strong className="font-semibold text-rose-700 dark:text-rose-400">₹{collectTarget.balanceAmount.toLocaleString('en-IN')}</strong></span>
                </div>
              )}

              {/* Mode of Payment: Single Line Selectable Options with White Background */}
              <div className="flex items-center justify-between py-1 pb-3 border-b border-slate-100 dark:border-slate-800/80">
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Mode of Payment :
                </span>
                <div className="flex items-center gap-2.5">
                  {/* Cash */}
                  <button
                    type="button"
                    onClick={() => setCollectForm({ ...collectForm, paymentMode: 'cash', transactionRef: '' })}
                    className="inline-flex items-center gap-2 text-xs cursor-pointer transition-colors bg-transparent border-0 p-0 shadow-none focus:outline-none"
                  >
                    <span className={collectForm.paymentMode === 'cash' ? 'font-bold text-[#2864E8]' : 'font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'}>
                      Cash
                    </span>
                    <div className={`w-4 h-4 rounded-[3px] flex items-center justify-center border transition-all ${
                      collectForm.paymentMode === 'cash'
                        ? 'border-[#2864E8] bg-[#2864E8] text-white shadow-none'
                        : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800'
                    }`}>
                      {collectForm.paymentMode === 'cash' && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                    </div>
                  </button>

                  {/* Online */}
                  <button
                    type="button"
                    onClick={() => setCollectForm({ ...collectForm, paymentMode: 'online' })}
                    className="inline-flex items-center gap-2 text-xs cursor-pointer transition-colors bg-transparent border-0 p-0 shadow-none focus:outline-none"
                  >
                    <span className={
                      collectForm.paymentMode === 'online' || collectForm.paymentMode === 'upi' || collectForm.paymentMode === 'net_banking' || collectForm.paymentMode === 'cheque' || collectForm.paymentMode === 'card'
                        ? 'font-bold text-[#2864E8]'
                        : 'font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                    }>
                      Online
                    </span>
                    <div className={`w-4 h-4 rounded-[3px] flex items-center justify-center border transition-all ${
                      collectForm.paymentMode === 'online' || collectForm.paymentMode === 'upi' || collectForm.paymentMode === 'net_banking' || collectForm.paymentMode === 'cheque' || collectForm.paymentMode === 'card'
                        ? 'border-[#2864E8] bg-[#2864E8] text-white shadow-none'
                        : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800'
                    }`}>
                      {(collectForm.paymentMode === 'online' || collectForm.paymentMode === 'upi' || collectForm.paymentMode === 'net_banking' || collectForm.paymentMode === 'cheque' || collectForm.paymentMode === 'card') && (
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      )}
                    </div>
                  </button>
                </div>
              </div>

              {/* Remarks (Optional): 100% Rectangular Shape with 5% Corner Round */}
              <div className="space-y-1">
                <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Remarks <span className="text-slate-400 dark:text-slate-500 font-normal">(Optional)</span>
                </Label>
                <Input
                  placeholder="Notes, installments, etc."
                  value={collectForm.remarks}
                  onChange={e => setCollectForm({ ...collectForm, remarks: e.target.value })}
                  className="h-10 text-xs sm:text-[13px] rounded-[5px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:bg-white dark:focus:bg-slate-950 focus-visible:ring-2 focus-visible:ring-[#2864E8]/15 focus-visible:border-[#2864E8] placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-colors shadow-none"
                />
              </div>

              <DialogFooter className="pt-2">
                <Button
                  type="submit"
                  disabled={
                    isRecordingPayment ||
                    !collectForm.paymentMode ||
                    (collectForm.collectType === 'yearly_package'
                      ? !collectForm.totalYearlyFee || collectForm.totalYearlyFee <= 0
                      : !collectForm.amount || collectForm.amount <= 0)
                  }
                  className={`w-full h-11 text-xs sm:text-[13px] font-bold uppercase tracking-wider rounded-[5px] flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-none active:scale-[0.99] ${
                    !collectForm.paymentMode
                      ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-slate-700 cursor-not-allowed shadow-none'
                      : 'bg-[#2864E8] hover:bg-[#1E4ED8] text-white shadow-none'
                  }`}
                >
                  {isRecordingPayment ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Recording...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className={`w-4 h-4 ${!collectForm.paymentMode ? 'text-slate-400' : 'text-white'}`} />
                      <span>
                        {!collectForm.paymentMode
                          ? 'Select Payment Mode (Cash or Online)'
                          : `Confirm & Collect ₹${Number(collectForm.amount || 0).toLocaleString('en-IN')}`}
                      </span>
                    </>
                  )}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* -------------------------------------------------------------------- */}
      {/* MODAL 6: OFFICIAL RECEIPT PREVIEW & PRINT DIALOG */}
      {/* -------------------------------------------------------------------- */}
      <Dialog
        open={isReceiptOpen}
        onOpenChange={(open) => {
          setIsReceiptOpen(open);
          if (!open) {
            setRecentReceipt(null);
            if (typeof document !== 'undefined') {
              document.body.style.pointerEvents = '';
            }
          }
        }}
      >
        <DialogContent overlayClassName="z-[120]" className="z-[121] max-w-md rounded-2xl p-6 bg-white dark:bg-slate-900 text-left">
          <DialogHeader className="sr-only">
            <DialogTitle>Student Fee Receipt</DialogTitle>
            <DialogDescription>Official student fee receipt details</DialogDescription>
          </DialogHeader>
          {recentReceipt && (
            <div className="space-y-4">
              {/* Receipt Header */}
              <div className="text-center border-b border-slate-200/80 pb-3">
                <div className="flex items-center justify-center gap-1.5">
                  <div className="w-7 h-7 rounded-lg bg-[#2864E8] text-white flex items-center justify-center font-black text-sm">
                    IDL
                  </div>
                  <h3 className="text-base font-black tracking-tight text-slate-900 dark:text-white">
                    IDL EDUCATION
                  </h3>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Official Student Fee Receipt
                </p>
                <div className="inline-block mt-2 px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-[11px] font-mono font-bold text-slate-700 dark:text-slate-300">
                  Receipt No: {recentReceipt.receiptNumber}
                </div>
              </div>

              {/* Receipt Details Table */}
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Student Name:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{recentReceipt.studentName}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Roll Number:</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">{recentReceipt.rollNumber}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Billing Month:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{recentReceipt.monthLabel}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Payment Date:</span>
                  <span className="font-medium text-slate-700 dark:text-slate-300">{formatAdmDate(recentReceipt.paymentDate)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Payment Mode:</span>
                  <span className="font-bold uppercase text-slate-900 dark:text-white">{recentReceipt.paymentMode}</span>
                </div>
                {recentReceipt.transactionRef && (
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">Reference No:</span>
                    <span className="font-mono text-slate-700 dark:text-slate-300">{recentReceipt.transactionRef}</span>
                  </div>
                )}
                <div className="flex justify-between py-2.5 bg-emerald-50 dark:bg-emerald-950/40 p-2.5 rounded-xl border border-emerald-200/60 mt-2">
                  <span className="font-bold text-emerald-800 dark:text-emerald-300">Amount Received:</span>
                  <span className="text-base font-black text-emerald-600 dark:text-emerald-400">
                    ₹{recentReceipt.amount.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <div className="text-[10px] text-slate-400 text-center">
                Authorized By: {recentReceipt.collectedBy} | Computer generated receipt.
              </div>

              <DialogFooter className="pt-2 flex items-center justify-between flex-wrap gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setRevertPaymentTarget(recentReceipt)}
                  className="h-9 text-xs gap-1.5 border-rose-200 dark:border-rose-900 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 hover:text-rose-700 font-bold"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Void / Revert Receipt
                </Button>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.print()}
                    className="h-9 text-xs gap-1.5"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    Print Receipt
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => {
                      setIsReceiptOpen(false);
                      setRecentReceipt(null);
                      if (typeof document !== 'undefined') {
                        document.body.style.pointerEvents = '';
                      }
                    }}
                    className="h-9 text-xs font-bold bg-[#2864E8] hover:bg-[#1E4ED8] text-white"
                  >
                    Done
                  </Button>
                </div>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* -------------------------------------------------------------------- */}
      {/* MODAL 7: STUDENT PROFILE & DETAILS VIEW */}
      {/* -------------------------------------------------------------------- */}
      <Dialog
        open={!!selectedStudentProfile}
        onOpenChange={open => {
          if (!open) {
            setSelectedStudentProfile(null);
            setProfileSubjectTab('enrolled');
          }
        }}
      >
        <DialogContent className="max-w-[480px] sm:max-w-[500px] w-[94vw] rounded-2xl p-4 sm:p-5 bg-white dark:bg-slate-950 text-left border border-slate-200/80 dark:border-slate-800 shadow-[0_20px_50px_-12px_rgba(15,23,42,0.12),0_4px_16px_rgba(15,23,42,0.04)] overflow-hidden max-h-[88vh] flex flex-col font-['Inter_Tight',sans-serif]">
          {selectedStudentProfile && (
            <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
              {/* Header: Student Name + Highlighted ID & Joined Date */}
              <DialogHeader className="pb-2.5 pr-8 border-b border-slate-100 dark:border-slate-800/80 shrink-0">
                <div>
                  <DialogTitle className="text-[19px] sm:text-[21px] font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5 leading-snug">
                    <span>{selectedStudentProfile.name}</span>
                    {(selectedStudentProfile.feeType === 'yearly_package' || Boolean(selectedStudentProfile.yearlyPackage)) && (
                      <span title="Yearly Package Student" className="inline-flex items-center justify-center shrink-0 ml-1">
                        <span className="w-2.5 h-2.5 rounded-full bg-violet-600 dark:bg-violet-400 shadow-[0_0_8px_2px_rgba(139,92,246,0.75)] animate-pulse" />
                      </span>
                    )}
                  </DialogTitle>
                  {(() => {
                    const profileLedgerEntry = ledger.find(l => l.studentId === selectedStudentProfile.id && (!selectedMonth || l.month === selectedMonth));
                    const today = new Date();
                    const currentMonthStr = String(today.getMonth() + 1).padStart(2, '0');
                    const currentYearStr = String(today.getFullYear());
                    const dueDay = String(selectedStudentProfile.dueDayOfMonth || 5).padStart(2, '0');
                    const fallbackDueDate = `${currentYearStr}-${currentMonthStr}-${dueDay}`;
                    const effectiveDueDate = profileLedgerEntry?.dueDate || fallbackDueDate;

                    return (
                      <div className="text-[11.5px] text-slate-500 font-mono mt-1 flex items-center gap-1.5 flex-nowrap whitespace-nowrap overflow-x-auto no-scrollbar">
                        <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 dark:text-slate-500 shrink-0">ID:</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200 shrink-0">
                          {selectedStudentProfile.rollNumber || selectedStudentProfile.id}
                        </span>
                        <span className="text-slate-300 dark:text-slate-700 shrink-0">•</span>
                        <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 dark:text-slate-500 shrink-0">JOIN:</span>
                        <span className="font-medium text-slate-600 dark:text-slate-300 shrink-0">
                          {formatAdmDate(selectedStudentProfile.joiningDate)}
                        </span>
                        <span className="text-slate-300 dark:text-slate-700 shrink-0">•</span>
                        <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 dark:text-slate-500 shrink-0">DUE:</span>
                        <span className="font-medium text-slate-600 dark:text-slate-300 shrink-0">
                          {formatAdmDate(effectiveDueDate)}
                        </span>
                        {(() => {
                          const oDays = getOverdueDays(effectiveDueDate);
                          const studentLedger = ledger.find(l => l.studentId === selectedStudentProfile.id && l.month === (selectedMonth || '2026-11'));
                          const isOver = oDays > 0 && studentLedger && (studentLedger.balanceAmount > 0 || studentLedger.status === 'OVERDUE');
                          if (isOver) {
                            return (
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 font-bold text-[9.5px] shrink-0">
                                {oDays} {oDays === 1 ? 'day' : 'days'} overdue
                              </span>
                            );
                          }
                          return null;
                        })()}
                      </div>
                    );
                  })()}
                </div>
              </DialogHeader>

              <div className="flex-1 overflow-y-auto pr-1 pb-1 space-y-2.5 pt-2">
                {/* Personal Information Grid (Father/Guardian Name, DOB, Gender, Contacts, Address, Academic) */}
                <div className="py-1.5 border-b border-slate-100 dark:border-slate-800/70 space-y-2 text-xs">
                  {/* Row 1: Father/Guardian Name, Date of Birth, Gender (3 columns) */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-4 gap-y-1.5">
                    <div>
                      <span className="text-[10.5px] font-medium text-slate-400 dark:text-slate-500 block truncate">
                        Father / Guardian Name
                      </span>
                      <div className="text-[13px] font-semibold text-slate-800 dark:text-slate-100 mt-0.5 truncate">
                        {selectedStudentProfile.fatherName || "—"}
                      </div>
                    </div>

                    <div>
                      <span className="text-[10.5px] font-medium text-slate-400 dark:text-slate-500 block">
                        Date of Birth
                      </span>
                      <div className="text-[13px] font-semibold text-slate-800 dark:text-slate-100 font-mono tabular-nums mt-0.5">
                        {formatAdmDate(selectedStudentProfile.dob)}
                      </div>
                    </div>

                    <div>
                      <span className="text-[10.5px] font-medium text-slate-400 dark:text-slate-500 block">
                        Gender
                      </span>
                      <div className="text-[13px] font-semibold text-slate-800 dark:text-slate-100 mt-0.5">
                        {selectedStudentProfile.gender
                          ? selectedStudentProfile.gender.charAt(0).toUpperCase() + selectedStudentProfile.gender.slice(1).toLowerCase()
                          : "—"}
                      </div>
                    </div>
                  </div>

                  {/* Row 2: Primary Contact, Secondary Contact, Emergency Contact (3 columns) */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-4 gap-y-1.5 pt-1.5 border-t border-slate-100/80 dark:border-slate-800/50">
                    <div>
                      <span className="text-[10.5px] font-medium text-slate-400 dark:text-slate-500 block">
                        Primary Contact
                      </span>
                      <div className="text-[13px] font-semibold text-slate-800 dark:text-slate-100 font-mono tabular-nums mt-0.5">
                        {selectedStudentProfile.fatherContact || selectedStudentProfile.contact1 || "—"}
                      </div>
                    </div>

                    <div>
                      <span className="text-[10.5px] font-medium text-slate-400 dark:text-slate-500 block">
                        Secondary Contact
                      </span>
                      <div className="text-[13px] font-semibold text-slate-800 dark:text-slate-100 font-mono tabular-nums mt-0.5">
                        {selectedStudentProfile.motherContact || selectedStudentProfile.contact2 || "—"}
                      </div>
                    </div>

                    <div>
                      <span className="text-[10.5px] font-medium text-slate-400 dark:text-slate-500 block">
                        Emergency Contact
                      </span>
                      <div className="text-[13px] font-semibold text-slate-800 dark:text-slate-100 font-mono tabular-nums mt-0.5">
                        {selectedStudentProfile.contact1 || selectedStudentProfile.contact2 || "—"}
                      </div>
                    </div>
                  </div>

                  {/* Residential Address: Full-width row matching Edit Modal */}
                  <div className="pt-1.5 border-t border-slate-100/80 dark:border-slate-800/50">
                    <span className="text-[10.5px] font-medium text-slate-400 dark:text-slate-500 block">
                      Residential Address
                    </span>
                    <div className="text-[12.5px] font-medium text-slate-800 dark:text-slate-200 mt-0.5 leading-snug">
                      {selectedStudentProfile.address || "—"}
                    </div>
                  </div>

                  {/* Academic Details (Branch, Class, Batch) in clean 3-column row */}
                  <div className="pt-1.5 border-t border-slate-100/80 dark:border-slate-800/50 grid grid-cols-1 sm:grid-cols-3 gap-x-4 gap-y-1.5">
                    <div>
                      <span className="text-[10.5px] font-medium text-slate-400 dark:text-slate-500 block">
                        Branch
                      </span>
                      <div className="text-[13px] font-semibold text-slate-800 dark:text-slate-100 mt-0.5 truncate">
                        {IDL_BRANCHES.find(b => b.id === selectedStudentProfile.branchId)?.name || "—"}
                      </div>
                    </div>

                    <div>
                      <span className="text-[10.5px] font-medium text-slate-400 dark:text-slate-500 block">
                        Class
                      </span>
                      <div className="text-[13px] font-semibold text-slate-800 dark:text-slate-100 mt-0.5 truncate">
                        {classes.find(c => c.id === selectedStudentProfile.classId)?.name || "—"}
                      </div>
                    </div>

                    <div>
                      <span className="text-[10.5px] font-medium text-slate-400 dark:text-slate-500 block">
                        Batch
                      </span>
                      <div className="text-[13px] font-semibold text-slate-800 dark:text-slate-100 mt-0.5 truncate">
                        {batches.find(b => b.id === selectedStudentProfile.batchId)?.name || "—"}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Fee Breakdown Card: Clean, Compact Premium Styling */}
                <div className="p-3 rounded-xl bg-slate-50/60 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800/60 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[10.5px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      <IndianRupee className="w-3.5 h-3.5 text-[#2864E8]" />
                      FEE BREAKDOWN
                    </span>
                    <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 tracking-wider uppercase">
                      {selectedStudentProfile.feeType === "yearly_package" ? "Yearly Package" : "MONTHLY FEE"}
                    </span>
                  </div>

                  <div className="space-y-1 pt-0.5 text-xs">
                    <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
                      <span>Standard Fee:</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200 font-mono tabular-nums">
                        ₹{Number(selectedStudentProfile.feeType === "yearly_package"
                          ? (selectedStudentProfile.yearlyPackage?.totalYearlyFee
                              ? (selectedStudentProfile.yearlyPackage.totalYearlyFee + (selectedStudentProfile.discountAmount * (selectedStudentProfile.yearlyPackage.courseMonths || 12)))
                              : selectedStudentProfile.baseFee * 12)
                          : selectedStudentProfile.baseFee).toLocaleString('en-IN')}
                        <span className="text-[10px] text-slate-400 font-normal ml-0.5">
                          {selectedStudentProfile.feeType === "yearly_package" ? "/yr" : "/mo"}
                        </span>
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
                      <span>Scholarship:</span>
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400 font-mono tabular-nums">
                        {selectedStudentProfile.scholarshipPercent}% (-₹
                        {Number(selectedStudentProfile.feeType === "yearly_package"
                          ? selectedStudentProfile.discountAmount * (selectedStudentProfile.yearlyPackage?.courseMonths || 12)
                          : selectedStudentProfile.discountAmount).toLocaleString('en-IN')})
                      </span>
                    </div>

                    {(() => {
                      const activeSubs = getActiveAdditionalSubjectsForMonth(selectedStudentProfile, selectedMonth || '2026-11');
                      const totalAddl = activeSubs.reduce((sum, s) => sum + (Number(s.fee) || 0), 0);
                      if (totalAddl <= 0) return null;
                      return (
                        <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
                          <span className="flex items-center gap-1.5">
                            <span>Additional Subjects:</span>
                            <span className="text-[9.5px] text-purple-700 dark:text-purple-300 font-semibold bg-purple-50 dark:bg-purple-950/40 border border-purple-200/50 dark:border-purple-800/40 px-1.5 py-0.2 rounded">
                              {activeSubs.length} subj
                            </span>
                          </span>
                          <span className="font-semibold text-purple-600 dark:text-purple-400 font-mono tabular-nums">
                            +₹{Number(selectedStudentProfile.feeType === 'yearly_package' ? totalAddl * 12 : totalAddl).toLocaleString('en-IN')}
                            <span className="text-[10px] text-slate-400 font-normal ml-0.5">
                              {selectedStudentProfile.feeType === 'yearly_package' ? '/yr' : '/mo'}
                            </span>
                          </span>
                        </div>
                      );
                    })()}
                  </div>

                  <div className="flex justify-between items-baseline pt-1.5 border-t border-slate-200/70 dark:border-slate-800">
                    <span className="font-bold text-slate-900 dark:text-white text-[12.5px]">Net Payable Fee:</span>
                    <span className="text-[#2864E8] font-bold text-[16px] font-mono tabular-nums tracking-tight">
                      ₹{Number(selectedStudentProfile.feeType === "yearly_package"
                        ? (selectedStudentProfile.yearlyPackage?.totalYearlyFee || (selectedStudentProfile.netFee * 12))
                        : selectedStudentProfile.netFee).toLocaleString('en-IN')}
                      <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 ml-0.5">
                        {selectedStudentProfile.feeType === "yearly_package" ? "/year" : "/month"}
                      </span>
                    </span>
                  </div>
                </div>

                {/* Enrolled & Additional Subjects: Single-line Interactive Text Tabs */}
                <div className="py-2 border-b border-slate-100 dark:border-slate-800/70 space-y-1.5 text-xs">
                  {/* Single Line Tabs: ENROLLED SUBJECTS & ADDITIONAL SUBJECTS */}
                  <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
                    <button
                      type="button"
                      onClick={() => setProfileSubjectTab('enrolled')}
                      className={`text-[10.5px] uppercase font-bold tracking-wider transition-colors cursor-pointer bg-transparent border-0 p-0 ${
                        profileSubjectTab === 'enrolled'
                          ? 'text-slate-900 dark:text-white'
                          : 'text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300'
                      }`}
                    >
                      ENROLLED SUBJECTS ({selectedStudentProfile.subjects?.length || 0})
                    </button>

                    {Boolean(selectedStudentProfile.additionalSubjects && selectedStudentProfile.additionalSubjects.length > 0) && (
                      <button
                        type="button"
                        onClick={() => setProfileSubjectTab('additional')}
                        className={`text-[10.5px] uppercase font-bold tracking-wider transition-colors cursor-pointer bg-transparent border-0 p-0 ${
                          profileSubjectTab === 'additional'
                            ? 'text-slate-900 dark:text-white'
                            : 'text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300'
                        }`}
                      >
                        ADDITIONAL SUBJECTS ({selectedStudentProfile.additionalSubjects?.length || 0})
                      </button>
                    )}
                  </div>

                  {/* Dynamic Subjects List */}
                  <div className="flex flex-wrap items-center gap-x-3.5 gap-y-1 pt-0.5">
                    {profileSubjectTab === 'enrolled' ? (
                      selectedStudentProfile.subjects && selectedStudentProfile.subjects.length > 0 ? (
                        selectedStudentProfile.subjects.map(sub => {
                          const cleanSub = sub
                            .replace(/Socil\s*Studies/gi, 'Social Studies')
                            .replace(/Socil/gi, 'Social');
                          return (
                            <span
                              key={sub}
                              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200"
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-500 shrink-0" />
                              <span>{cleanSub}</span>
                            </span>
                          );
                        })
                      ) : (
                        <span className="text-slate-400 font-normal italic">No subjects selected</span>
                      )
                    ) : (
                      selectedStudentProfile.additionalSubjects && selectedStudentProfile.additionalSubjects.length > 0 ? (
                        selectedStudentProfile.additionalSubjects.map(sub => {
                          const cleanName = (sub.name || '')
                            .replace(/Socil\s*Studies/gi, 'Social Studies')
                            .replace(/Socil/gi, 'Social');
                          return (
                            <span
                              key={sub.id}
                              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200"
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-500 shrink-0" />
                              <span>{cleanName}</span>
                            </span>
                          );
                        })
                      ) : (
                        <span className="text-slate-400 font-normal italic">No additional subjects</span>
                      )
                    )}
                  </div>
                </div>

                {/* Transfer History (if any) */}
                {Boolean(selectedStudentProfile.transferHistory && selectedStudentProfile.transferHistory.length > 0) && (
                  <div className="py-2 border-b border-slate-100 dark:border-slate-800/70 space-y-1 text-xs">
                    <span className="text-[10.5px] uppercase font-bold tracking-wider text-slate-500 dark:text-slate-400 block">
                      TRANSFER HISTORY ({selectedStudentProfile.transferHistory?.length || 0})
                    </span>
                    <div className="space-y-1 pt-0.5">
                      {selectedStudentProfile.transferHistory?.map(tr => {
                        const fromB = IDL_BRANCHES.find(b => b.id === tr.fromBranchId)?.name?.replace(' Branch', '') || tr.fromBranchId;
                        const toB = IDL_BRANCHES.find(b => b.id === tr.toBranchId)?.name?.replace(' Branch', '') || tr.toBranchId;
                        const fromBat = batches.find(b => b.id === tr.fromBatchId)?.name || 'Batch';
                        const toBat = batches.find(b => b.id === tr.toBatchId)?.name || 'Batch';
                        return (
                          <div
                            key={tr.id}
                            className="p-2 rounded-lg bg-blue-50/30 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40 text-xs"
                          >
                            <div className="flex items-center justify-between font-semibold text-slate-900 dark:text-slate-100">
                              <span className="flex items-center gap-1.5 flex-wrap">
                                <span>{fromBat} ({fromB})</span>
                                <ArrowRight className="w-3 h-3 text-[#2864E8] shrink-0" />
                                <span className="text-[#2864E8] font-bold">{toBat} ({toB})</span>
                              </span>
                              <span className="text-[10px] text-slate-400 font-mono shrink-0 ml-2">{tr.transferDate}</span>
                            </div>
                            {tr.reason && (
                              <div className="text-[10.5px] text-slate-500 dark:text-slate-400 mt-0.5">
                                Note: {tr.reason}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Actions: Minimal icon-only action bar with no background or border */}
              <div className="pt-2 mt-1 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-end gap-1 w-full shrink-0">
                {/* Pause / Re-activate Toggle */}
                <button
                  type="button"
                  title={(selectedMonth ? getStudentStatusForMonth(selectedStudentProfile, selectedMonth) : selectedStudentProfile.status) === "active" ? "Pause Student" : "Re-activate Student"}
                  onClick={() => {
                    const stu = selectedStudentProfile;
                    const curSt = selectedMonth ? getStudentStatusForMonth(stu, selectedMonth) : stu.status;
                    setStatusOptionsModal({
                      isOpen: true,
                      student: stu,
                      targetStatus: curSt === "active" ? "disabled" : "active",
                    });
                  }}
                  className={`h-8 w-8 rounded-lg flex items-center justify-center transition-colors cursor-pointer focus:outline-none bg-transparent hover:bg-slate-100/70 dark:hover:bg-slate-800/70 ${
                    (selectedMonth ? getStudentStatusForMonth(selectedStudentProfile, selectedMonth) : selectedStudentProfile.status) === "active"
                      ? "text-slate-400 hover:text-amber-500 active:text-amber-600 dark:text-slate-500 dark:hover:text-amber-400"
                      : "text-slate-400 hover:text-emerald-500 active:text-emerald-600 dark:text-slate-500 dark:hover:text-emerald-400"
                  }`}
                >
                  {(selectedMonth ? getStudentStatusForMonth(selectedStudentProfile, selectedMonth) : selectedStudentProfile.status) === "active" ? (
                    <PowerOff className="w-4 h-4" />
                  ) : (
                    <Power className="w-4 h-4" />
                  )}
                </button>

                {/* Delete Student */}
                <button
                  type="button"
                  title="Delete Student"
                  onClick={() => {
                    const stu = selectedStudentProfile;
                    setStudentDeleteModal({ isOpen: true, student: stu, source: "profile" });
                  }}
                  className="h-8 w-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-rose-500 active:text-rose-600 hover:bg-rose-50/60 dark:hover:bg-slate-800/70 dark:text-slate-500 dark:hover:text-rose-400 transition-colors cursor-pointer bg-transparent focus:outline-none"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                {/* Transfer Student (Batch / Branch) */}
                <button
                  type="button"
                  title="Transfer Student (Batch / Branch)"
                  onClick={() => {
                    const stu = selectedStudentProfile;
                    openTransferModal(stu);
                  }}
                  className="h-8 w-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-[#2864E8] active:text-[#1E4ED8] hover:bg-blue-50/60 dark:hover:bg-slate-800/70 dark:text-slate-500 dark:hover:text-blue-400 transition-colors cursor-pointer bg-transparent focus:outline-none"
                >
                  <ArrowRightLeft className="w-4 h-4" />
                </button>

                {/* Edit Student Details */}
                <button
                  type="button"
                  title="Edit Student Details"
                  onClick={() => {
                    const stu = selectedStudentProfile;
                    openEditStudentModal(stu);
                  }}
                  className="h-8 w-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-[#2864E8] active:text-[#1E4ED8] hover:bg-blue-50/60 dark:hover:bg-slate-800/70 dark:text-slate-500 dark:hover:text-blue-400 transition-colors cursor-pointer bg-transparent focus:outline-none"
                >
                  <Edit className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* -------------------------------------------------------------------- */}
      {/* MODAL 8: DOUBLE CONFIRMATION DELETE DIALOG */}
      {/* -------------------------------------------------------------------- */}
      <AlertDialog open={!!deleteTarget} onOpenChange={open => !open && setDeleteTarget(null)}>
        <AlertDialogContent className="max-w-md rounded-2xl p-6 bg-white dark:bg-slate-900">
          <AlertDialogHeader>
            <div className="flex items-center gap-2 text-rose-600 mb-1">
              <AlertTriangle className="w-5 h-5" />
              <AlertDialogTitle className="text-base font-bold">
                Confirm Deletion of {deleteTarget?.type.toUpperCase()}
              </AlertDialogTitle>
            </div>
            <AlertDialogDescription className="text-xs text-slate-600 dark:text-slate-400">
              Are you sure you want to delete <strong className="text-slate-900 dark:text-white">{deleteTarget?.name}</strong>?
              {deleteTarget?.type === 'class' && (
                <span className="block mt-1 text-rose-600 font-semibold">
                  This action cannot be undone. You will not be able to delete this class if active batches or students are associated with it.
                </span>
              )}
              {deleteTarget?.type === 'student' && (
                <span className="block mt-1 text-rose-600 font-semibold">
                  Warning: Deleting a student removes their active ledger. If the student has left or paused, please consider disabling them instead.
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

      {/* -------------------------------------------------------------------- */}
      {/* MODAL 8B: STUDENT DELETE OPTIONS (THIS MONTH ONLY vs ALL MONTHS) */}
      {/* -------------------------------------------------------------------- */}
      <Dialog
        open={studentDeleteModal.isOpen}
        onOpenChange={open => !open && setStudentDeleteModal({ isOpen: false, student: null, source: 'students' })}
      >
        <DialogContent overlayClassName="z-[120]" className="z-[121] max-w-md rounded-2xl p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl">
          <DialogHeader>
            <div className="flex items-center gap-2.5 text-rose-600 mb-1">
              <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <DialogTitle className="text-base font-bold text-slate-900 dark:text-white">
                  Student Delete / Remove Karein
                </DialogTitle>
                <DialogDescription className="text-xs text-slate-500 font-medium">
                  {studentDeleteModal.student?.name} ({studentDeleteModal.student?.rollNumber})
                </DialogDescription>
              </div>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">
              Aap is student ko kis tarah remove karna chahte hain? Neeche diye gaye 2 options me se ek chunein:
            </p>
          </DialogHeader>

          <div className="space-y-3 my-3">
            {/* Option 1: Remove from selected month only */}
            <div
              onClick={() => handleDeleteStudentChoice('month_only')}
              className="p-3.5 rounded-xl border-2 border-amber-200 dark:border-amber-900/60 bg-amber-50/60 dark:bg-amber-950/30 hover:bg-amber-100/70 dark:hover:bg-amber-950/50 hover:border-amber-400 transition-all cursor-pointer group"
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300 flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
                  <CalendarX2 className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs sm:text-sm text-amber-950 dark:text-amber-200">
                      Option 1: Sirf {selectedMonthLabel} se Hatao
                    </span>
                    <Badge variant="outline" className="text-[10px] bg-amber-100 text-amber-800 border-amber-300 font-bold">
                      Safe Delete
                    </Badge>
                  </div>
                  <p className="text-[11px] text-amber-900/80 dark:text-amber-400 mt-1 leading-relaxed">
                    Student ka sirf <strong>{selectedMonthLabel}</strong> ka fee record/ledger delete hoga. Pichle mahino ka history, receipts aur student profile bilkul <strong>safe</strong> rahegi.
                  </p>
                </div>
              </div>
            </div>

            {/* Option 2: Delete from all months permanently */}
            <div
              onClick={() => handleDeleteStudentChoice('all_months')}
              className="p-3.5 rounded-xl border-2 border-rose-200 dark:border-rose-900/60 bg-rose-50/60 dark:bg-rose-950/30 hover:bg-rose-100/70 dark:hover:bg-rose-950/50 hover:border-rose-400 transition-all cursor-pointer group"
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-rose-100 dark:bg-rose-900/60 text-rose-600 flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
                  <UserX className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs sm:text-sm text-rose-950 dark:text-rose-200">
                      Option 2: Sabhi Mahino se Permanently Delete Karein
                    </span>
                    <Badge variant="outline" className="text-[10px] bg-rose-100 text-rose-800 border-rose-300 font-bold">
                      Permanent
                    </Badge>
                  </div>
                  <p className="text-[11px] text-rose-900/80 dark:text-rose-400 mt-1 leading-relaxed">
                    Student profile, unke sabhi mahino ke fee records aur payment receipts poore system se <strong>hamesha ke liye delete</strong> ho jayenge.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="pt-2 border-t border-slate-100 dark:border-slate-800">
            <Button
              type="button"
              variant="outline"
              onClick={() => setStudentDeleteModal({ isOpen: false, student: null, source: 'students' })}
              className="h-9 text-xs rounded-xl w-full"
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* -------------------------------------------------------------------- */}
      {/* MODAL 9: STATUS TOGGLE (ACTIVE <-> DISABLED) OPTIONS MODAL */}
      {/* -------------------------------------------------------------------- */}
      <Dialog
        open={statusOptionsModal.isOpen}
        onOpenChange={open => {
          if (!open) {
            setStatusOptionsModal({ isOpen: false, student: null, targetStatus: 'disabled' });
            if (typeof document !== 'undefined') {
              document.body.style.pointerEvents = '';
            }
          }
        }}
      >
        <DialogContent overlayClassName="z-[120]" className="z-[121] max-w-md rounded-2xl p-6 bg-white dark:bg-slate-900 text-left">
          {statusOptionsModal.student && (
            <>
              <DialogHeader>
                <div
                  className={`flex items-center gap-2.5 mb-1 ${
                    statusOptionsModal.targetStatus === 'disabled' ? 'text-amber-600' : 'text-emerald-600'
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      statusOptionsModal.targetStatus === 'disabled'
                        ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-600'
                        : 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600'
                    }`}
                  >
                    {statusOptionsModal.targetStatus === 'disabled' ? (
                      <PowerOff className="w-5 h-5" />
                    ) : (
                      <Power className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <DialogTitle className="text-base font-bold text-slate-900 dark:text-white">
                      {statusOptionsModal.targetStatus === 'disabled'
                        ? 'Student Profile Pause / Disable Karein'
                        : 'Student Profile Re-activate / Enable Karein'}
                    </DialogTitle>
                    <DialogDescription className="text-xs text-slate-500 font-medium">
                      {statusOptionsModal.student.name} ({statusOptionsModal.student.rollNumber})
                    </DialogDescription>
                  </div>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">
                  {statusOptionsModal.targetStatus === 'disabled'
                    ? 'Aap is student ko kis mahine se pause/disable karna chahte hain? Neeche diye gaye 2 options me se ek chunein:'
                    : 'Aap is student ko kis mahine se dobara active/enable karna chahte hain? Neeche diye gaye 2 options me se ek chunein:'}
                </p>
              </DialogHeader>

              <div className="space-y-3 my-3">
                {/* Option 1: Month onwards */}
                <button
                  type="button"
                  data-option="month_onwards"
                  onClick={() => handleExecuteStatusToggle('month_onwards')}
                  className={`w-full text-left p-3.5 rounded-xl border-2 transition-all cursor-pointer group ${
                    statusOptionsModal.targetStatus === 'disabled'
                      ? 'border-amber-200 dark:border-amber-900/60 bg-amber-50/60 dark:bg-amber-950/30 hover:bg-amber-100/70 dark:hover:bg-amber-950/50 hover:border-amber-400'
                      : 'border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/60 dark:bg-emerald-950/30 hover:bg-emerald-100/70 dark:hover:bg-emerald-950/50 hover:border-emerald-400'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-105 transition-transform ${
                        statusOptionsModal.targetStatus === 'disabled'
                          ? 'bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300'
                          : 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300'
                      }`}
                    >
                      <Calendar className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span
                          className={`font-bold text-xs sm:text-sm ${
                            statusOptionsModal.targetStatus === 'disabled'
                              ? 'text-amber-950 dark:text-amber-200'
                              : 'text-emerald-950 dark:text-emerald-200'
                          }`}
                        >
                          {statusOptionsModal.targetStatus === 'disabled'
                            ? `Option 1: Sirf ${selectedMonthLabel} se aage Pause Karein`
                            : `Option 1: ${selectedMonthLabel} se aage Active / Enable Karein`}
                        </span>
                        <Badge
                          variant="outline"
                          className={`text-[10px] font-bold ${
                            statusOptionsModal.targetStatus === 'disabled'
                              ? 'bg-amber-100 text-amber-800 border-amber-300'
                              : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                          }`}
                        >
                          Month Specific
                        </Badge>
                      </div>
                      <p
                        className={`text-[11px] mt-1 leading-relaxed ${
                          statusOptionsModal.targetStatus === 'disabled'
                            ? 'text-amber-900/80 dark:text-amber-400'
                            : 'text-emerald-900/80 dark:text-emerald-400'
                        }`}
                      >
                        {statusOptionsModal.targetStatus === 'disabled' ? (
                          <>
                            Student <strong>{selectedMonthLabel}</strong> se pause ho jayega. Agle sabhi mahino me bhi tab tak disabled rahega jab tak manually enable na karein. <strong>Is mahine aur aage ke disabled mahino me is student ki fee count nahi hogi.</strong> Pichle active mahino ka fee record safe rahega.
                          </>
                        ) : (
                          <>
                            Student <strong>{selectedMonthLabel}</strong> se re-activate ho jayega aur fee billing resume ho jayegi. <strong>Pichle mahine (jinme ye student disabled tha) disabled hi rahenge aur unme fee count nahi hogi.</strong>
                          </>
                        )}
                      </p>
                    </div>
                  </div>
                </button>

                {/* Option 2: All months */}
                <button
                  type="button"
                  data-option="all_months"
                  onClick={() => handleExecuteStatusToggle('all_months')}
                  className={`w-full text-left p-3.5 rounded-xl border-2 transition-all cursor-pointer group ${
                    statusOptionsModal.targetStatus === 'disabled'
                      ? 'border-rose-200 dark:border-rose-900/60 bg-rose-50/60 dark:bg-rose-950/30 hover:bg-rose-100/70 dark:hover:bg-rose-950/50 hover:border-rose-400'
                      : 'border-blue-200 dark:border-blue-900/60 bg-blue-50/60 dark:bg-blue-950/30 hover:bg-blue-100/70 dark:hover:bg-blue-950/50 hover:border-blue-400'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-105 transition-transform ${
                        statusOptionsModal.targetStatus === 'disabled'
                          ? 'bg-rose-100 dark:bg-rose-900/60 text-rose-600'
                          : 'bg-blue-100 dark:bg-blue-900/60 text-blue-600'
                      }`}
                    >
                      <RotateCcw className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span
                          className={`font-bold text-xs sm:text-sm ${
                            statusOptionsModal.targetStatus === 'disabled'
                              ? 'text-rose-950 dark:text-rose-200'
                              : 'text-blue-950 dark:text-blue-200'
                          }`}
                        >
                          {statusOptionsModal.targetStatus === 'disabled'
                            ? 'Option 2: Sabhi Mahino me Permanently Disable Karein'
                            : 'Option 2: Sabhi Mahino me Active Karein'}
                        </span>
                        <Badge
                          variant="outline"
                          className={`text-[10px] font-bold ${
                            statusOptionsModal.targetStatus === 'disabled'
                              ? 'bg-rose-100 text-rose-800 border-rose-300'
                              : 'bg-blue-100 text-blue-800 border-blue-300'
                          }`}
                        >
                          All Months
                        </Badge>
                      </div>
                      <p
                        className={`text-[11px] mt-1 leading-relaxed ${
                          statusOptionsModal.targetStatus === 'disabled'
                            ? 'text-rose-900/80 dark:text-rose-400'
                            : 'text-blue-900/80 dark:text-blue-400'
                        }`}
                      >
                        {statusOptionsModal.targetStatus === 'disabled' ? (
                          <>
                            Student <strong>sabhi mahino (All months)</strong> me permanently disabled rahega aur kisi bhi mahine me is student ki fee count nahi hogi.
                          </>
                        ) : (
                          <>
                            Student <strong>sabhi mahino (All months)</strong> ke liye active ho jayega.
                          </>
                        )}
                      </p>
                    </div>
                  </div>
                </button>
              </div>

              <DialogFooter className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setStatusOptionsModal({ isOpen: false, student: null, targetStatus: 'disabled' });
                    if (typeof document !== 'undefined') {
                      document.body.style.pointerEvents = '';
                    }
                  }}
                  className="h-9 text-xs rounded-xl w-full"
                >
                  Cancel
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* -------------------------------------------------------------------- */}
      {/* MODAL 9: REVERT / MARK UNPAID MODAL */}
      {/* -------------------------------------------------------------------- */}
      <Dialog
        open={isRevertModalOpen}
        onOpenChange={(open) => {
          setIsRevertModalOpen(open);
          if (!open) {
            setRevertTarget(null);
            setRevertTargetPayments([]);
            if (typeof document !== 'undefined') {
              document.body.style.pointerEvents = '';
            }
          }
        }}
      >
        <DialogContent overlayClassName="z-[120]" className="z-[121] max-w-md rounded-2xl p-6 bg-white dark:bg-slate-900 text-left">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <RotateCcw className="w-5 h-5 text-rose-600" />
              Fee Mark as Unpaid / Revert
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Agar galti se kisi student ka payment collect mark ho gaya hai, to aap yahan se use revert karke wapas UNPAID / PENDING kar sakte hain.
            </DialogDescription>
          </DialogHeader>

          {revertTarget && (
            <div className="space-y-4 pt-2">
              {/* Student & Fee Summary Card */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-medium">Student:</span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {revertTarget.student.name} ({revertTarget.student.rollNumber})
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-medium">Billing Month:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{revertTarget.monthLabel}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-medium">Net Monthly Due:</span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    ₹{revertTarget.netDueAmount.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-1 border-t border-slate-200/60">
                  <span className="text-emerald-700 dark:text-emerald-400 font-semibold">Currently Recorded Paid:</span>
                  <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">
                    ₹{revertTarget.paidAmount.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-medium">Current Status:</span>
                  <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400 font-bold uppercase text-[10px]">
                    {revertTarget.status}
                  </Badge>
                </div>
              </div>

              {/* Individual Receipts Breakdown */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                  <span>Payment Receipts ({revertTargetPayments.length})</span>
                  <span className="text-[11px] font-normal text-slate-400">Revert specific receipt</span>
                </div>

                {revertTargetPayments.length === 0 ? (
                  <p className="text-xs text-slate-400 italic py-2 text-center bg-slate-50 dark:bg-slate-800/40 rounded-xl">
                    No individual receipts found for this month.
                  </p>
                ) : (
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {revertTargetPayments.map(pay => (
                      <div
                        key={pay.id}
                        className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200/70 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs shadow-2xs"
                      >
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-slate-900 dark:text-white">{pay.receiptNumber}</span>
                            <Badge variant="outline" className="text-[9px] uppercase font-bold py-0">{pay.paymentMode}</Badge>
                          </div>
                          <div className="text-[11px] text-slate-500 flex items-center gap-1.5 flex-wrap">
                            <span>Date: <strong className="text-slate-800 dark:text-slate-200">{formatAdmDate(pay.paymentDate)}</strong></span>
                            {pay.transactionRef ? <span>| Ref: {pay.transactionRef}</span> : ''}
                            <button
                              type="button"
                              onClick={() => {
                                setEditingPaymentDateTarget(pay);
                                setNewPaymentDateInput(pay.paymentDate);
                              }}
                              className="text-[10px] text-blue-600 hover:text-blue-800 hover:underline font-semibold flex items-center gap-0.5 ml-1 cursor-pointer bg-blue-50 dark:bg-blue-950/60 px-1.5 py-0.5 rounded border border-blue-200/60"
                              title="Collection Date manually change karein"
                            >
                              <Calendar className="w-2.5 h-2.5 text-blue-600" />
                              Edit Date
                            </button>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-black text-emerald-600 text-xs">₹{pay.amount.toLocaleString('en-IN')}</span>
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={isReverting}
                            onClick={() => handleRevertSinglePayment(pay.id)}
                            className="h-7 px-2 text-[11px] font-bold border-rose-200 text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                          >
                            Revert
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Master Option: Mark Entire Month Unpaid */}
              <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800 space-y-1.5">
                <Button
                  type="button"
                  disabled={isReverting}
                  onClick={handleMarkEntireMonthUnpaid}
                  className="w-full h-10 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-xs flex items-center justify-center gap-2"
                >
                  {isReverting ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Processing Revert...</span>
                    </>
                  ) : (
                    <>
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Mark Entire Month Unpaid (Reset to ₹0 Paid)</span>
                    </>
                  )}
                </Button>
                <p className="text-[11px] text-slate-400 text-center">
                  Yeh button is mahine ke saare payments hata kar status ko wapas UNPAID / PENDING kar dega.
                </p>
              </div>

              <DialogFooter className="pt-1">
                <Button
                  type="button"
                  variant="outline"
                  disabled={isReverting}
                  onClick={() => {
                    setIsRevertModalOpen(false);
                    setRevertTarget(null);
                    setRevertTargetPayments([]);
                    if (typeof document !== 'undefined') {
                      document.body.style.pointerEvents = '';
                    }
                  }}
                  className="h-9 text-xs w-full sm:w-auto"
                >
                  Cancel / Close
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* -------------------------------------------------------------------- */}
      {/* MODAL 11: EDIT PAYMENT / COLLECTION DATE DIALOG */}
      {/* -------------------------------------------------------------------- */}
      <Dialog
        open={!!editingPaymentDateTarget}
        onOpenChange={open => !open && setEditingPaymentDateTarget(null)}
      >
        <DialogContent className="max-w-sm rounded-2xl p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl text-left">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#2864E8]" />
              Collection Date Change Karein
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500 font-medium">
              Receipt: {editingPaymentDateTarget?.receiptNumber} ({editingPaymentDateTarget?.studentName})
            </DialogDescription>
          </DialogHeader>

          {editingPaymentDateTarget && (
            <form onSubmit={handleUpdatePaymentDateSubmit} className="space-y-4 pt-2">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">Amount:</span>
                  <span className="font-bold text-emerald-600">₹{editingPaymentDateTarget.amount.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Purani Date:</span>
                  <span className="font-mono text-slate-700 dark:text-slate-300">{formatAdmDate(editingPaymentDateTarget.paymentDate)}</span>
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-bold text-[#2864E8]">Nayi Collection Date Chunein *</Label>
                <Input
                  type="date"
                  value={newPaymentDateInput}
                  onChange={e => setNewPaymentDateInput(e.target.value)}
                  required
                  className="h-10 text-xs font-bold rounded-xl"
                />
                <p className="text-[10px] text-slate-500">
                  Fee aane ki sahi date manually set karke save karein.
                </p>
              </div>

              <DialogFooter className="pt-2 flex items-center justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditingPaymentDateTarget(null)}
                  className="h-9 text-xs rounded-xl"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isUpdatingPaymentDate || !newPaymentDateInput}
                  className="h-9 px-4 text-xs font-bold bg-[#2864E8] hover:bg-[#1E4ED8] text-white rounded-xl"
                >
                  {isUpdatingPaymentDate ? 'Updating...' : 'Save New Date'}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* -------------------------------------------------------------------- */}
      {/* ALERT: CONFIRM REVERT SINGLE RECEIPT */}
      {/* -------------------------------------------------------------------- */}
      <AlertDialog
        open={!!revertPaymentTarget}
        onOpenChange={(open) => {
          if (!open) {
            setRevertPaymentTarget(null);
            if (typeof document !== 'undefined') {
              document.body.style.pointerEvents = '';
            }
          }
        }}
      >
        <AlertDialogContent className="rounded-2xl max-w-md bg-white dark:bg-slate-900">
          <AlertDialogHeader>
            <div className="flex items-center gap-2 text-rose-600 mb-1">
              <RotateCcw className="w-5 h-5 text-rose-600" />
              <AlertDialogTitle className="text-base font-bold text-rose-600">
                Payment Receipt Revert Karein?
              </AlertDialogTitle>
            </div>
            <AlertDialogDescription asChild className="text-xs text-slate-600 dark:text-slate-300">
              <div className="space-y-2">
                <p>
                  Kya aap Receipt <strong className="font-mono text-slate-900 dark:text-white">{revertPaymentTarget?.receiptNumber}</strong> (₹{revertPaymentTarget?.amount.toLocaleString('en-IN')}) for <strong className="text-slate-900 dark:text-white">{revertPaymentTarget?.studentName}</strong> ko cancel/revert karna chahte hain?
                </p>
                <div className="p-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200/60 text-rose-800 dark:text-rose-300 font-medium">
                  Yeh amount student ke payment record se deduct ho jayegi aur pending balance restore ho jayega.
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={isReverting}
              onClick={() => {
                setRevertPaymentTarget(null);
                if (typeof document !== 'undefined') {
                  document.body.style.pointerEvents = '';
                }
              }}
              className="h-9 text-xs"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={isReverting}
              onClick={() => {
                if (revertPaymentTarget) {
                  handleRevertSinglePayment(revertPaymentTarget.id);
                }
              }}
              className="h-9 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white"
            >
              {isReverting ? 'Reverting...' : 'Confirm Revert'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* -------------------------------------------------------------------- */}
      {/* MODAL 10: CLEAR ALL DATA CONFIRMATION */}
      {/* -------------------------------------------------------------------- */}
      <AlertDialog open={isResetConfirmOpen} onOpenChange={setIsResetConfirmOpen}>
        <AlertDialogContent className="max-w-md rounded-2xl p-6 bg-white dark:bg-slate-900">
          <AlertDialogHeader>
            <div className="flex items-center gap-2 text-rose-600 mb-1">
              <AlertTriangle className="w-5 h-5" />
              <AlertDialogTitle className="text-base font-bold">
                Reset All Fee Management Data?
              </AlertDialogTitle>
            </div>
            <AlertDialogDescription asChild className="text-xs text-slate-600 dark:text-slate-400">
              <div className="space-y-2">
                <p>
                  Kya aap sach me saara random dummy/test data delete karke bilkul <strong>fresh start</strong> karna chahte hain?
                </p>
                <div className="p-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200/60 text-rose-800 dark:text-rose-300 font-medium">
                  Iske baad sabhi classes, batches, students, ledger records, aur receipts remove ho jayenge taaki aap khud shuru se apni classes aur students add kar sakein.
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="pt-2">
            <AlertDialogCancel className="h-9 text-xs">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleClearAllData}
              className="h-9 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white"
            >
              Haan, Saara Data Clear Karo
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* -------------------------------------------------------------------- */}
      {/* MODAL 11: STUDENT BATCH & BRANCH TRANSFER */}
      {/* -------------------------------------------------------------------- */}
      <Dialog
        open={transferModal.isOpen}
        onOpenChange={open => !open && setTransferModal(prev => ({ ...prev, isOpen: false }))}
      >
        <DialogContent overlayClassName="z-[120]" className="z-[121] max-w-[480px] sm:max-w-[520px] w-[94vw] rounded-2xl p-4 sm:p-5 bg-white dark:bg-slate-950 text-left border border-slate-200/90 dark:border-slate-800 shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
          {transferModal.student && (() => {
            const stu = transferModal.student;

            const targetBranchClasses = classes
              .filter(c => c.branchId === transferModal.targetBranchId || c.branchId === 'all')
              .sort((a, b) => {
                const ordA = a.order !== undefined && a.order !== null ? Number(a.order) : 999999;
                const ordB = b.order !== undefined && b.order !== null ? Number(b.order) : 999999;
                if (ordA !== ordB) return ordA - ordB;
                return a.name.localeCompare(b.name, undefined, { numeric: true });
              });

            const targetClassBatches = batches
              .filter(b => b.classId === transferModal.targetClassId)
              .sort((a, b) => {
                const ordA = a.order !== undefined && a.order !== null ? Number(a.order) : 999999;
                const ordB = b.order !== undefined && b.order !== null ? Number(b.order) : 999999;
                if (ordA !== ordB) return ordA - ordB;
                return a.name.localeCompare(b.name, undefined, { numeric: true });
              });

            const targetClass = classes.find(c => c.id === transferModal.targetClassId);
            const targetBatch = batches.find(b => b.id === transferModal.targetBatchId);
            const isSameBatch =
              transferModal.targetBranchId === stu.branchId &&
              transferModal.targetClassId === stu.classId &&
              transferModal.targetBatchId === stu.batchId;

            // Target batch standard fee
            const targetStandardFee = (targetBatch && typeof targetBatch.monthlyFee === 'number' && targetBatch.monthlyFee > 0)
              ? targetBatch.monthlyFee
              : (targetClass?.defaultMonthlyFee || 0);
            const targetYearlyFee = (targetBatch && typeof targetBatch.courseFee === 'number' && targetBatch.courseFee > 0)
              ? targetBatch.courseFee
              : (targetStandardFee * 12);

            const currBaseFee = stu.baseFee || 0;
            const currDiscount = stu.discountAmount || 0;
            const currPct = stu.scholarshipPercent || 0;
            const addlFee = (stu.additionalSubjects || [])
              .filter(s => s.status === 'active')
              .reduce((sum, s) => sum + (Number(s.fee) || 0), 0);
            const currNetFee = Math.max(0, currBaseFee - currDiscount) + addlFee;

            const feeDifference = targetStandardFee - currBaseFee;

            // Calculations for each mode
            const chargeExtraDiscount = Math.round((targetStandardFee * currPct) / 100);
            const chargeExtraNet = Math.max(0, targetStandardFee - chargeExtraDiscount) + addlFee;

            const addScholarshipDiscount = Math.max(0, currDiscount + (feeDifference > 0 ? feeDifference : 0));
            const addScholarshipNet = Math.max(0, targetStandardFee - addScholarshipDiscount) + addlFee;

            const retainNet = currNetFee;

            const customEnteredBase = Number(transferModal.customFeeInput) || targetStandardFee;
            const customDiscount = Math.round((customEnteredBase * currPct) / 100);
            const customNet = Math.max(0, customEnteredBase - customDiscount) + addlFee;

            const finalResultingNet = transferModal.feeAdjustmentMode === 'charge_extra'
              ? chargeExtraNet
              : transferModal.feeAdjustmentMode === 'add_scholarship'
              ? addScholarshipNet
              : transferModal.feeAdjustmentMode === 'retain_current'
              ? retainNet
              : customNet;

            const currentMonthLedger = ledger.find(l => l.studentId === stu.id && l.month === transferModal.effectiveMonth);
            const paidThisMonth = currentMonthLedger ? Number(currentMonthLedger.paidAmount) || 0 : 0;

            return (
              <form onSubmit={handleTransferSubmit} className="flex flex-col flex-1 min-h-0 overflow-hidden text-left">
                {/* Header */}
                <DialogHeader className="pb-2.5 border-b border-slate-100 dark:border-slate-800/80 shrink-0">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-[#2864E8] flex items-center justify-center shrink-0">
                      <ArrowRightLeft className="w-5 h-5" />
                    </div>
                    <div>
                      <DialogTitle className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                        Transfer Student
                      </DialogTitle>
                      <DialogDescription className="text-xs text-slate-500 font-medium flex items-center gap-1.5 flex-wrap">
                        <span className="font-bold text-slate-900 dark:text-slate-100">{stu.name}</span>
                        <span className="text-slate-300 dark:text-slate-700">•</span>
                        <span className="font-mono text-[11px]">{stu.rollNumber}</span>
                      </DialogDescription>
                    </div>
                  </div>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto pr-1 pb-1 space-y-3 pt-2 text-xs">
                  {/* Destination Selection */}
                  <div className="space-y-2.5 pt-1">
                    <span className="text-[10.5px] uppercase font-bold text-slate-600 dark:text-slate-400 tracking-wider block">
                      Select Destination
                    </span>

                    {/* Target Branch */}
                    <div>
                      <label className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block mb-1">
                        Destination Branch *
                      </label>
                      <Select
                        value={transferModal.targetBranchId}
                        onValueChange={val => {
                          const newBranchClasses = classes
                            .filter(c => c.branchId === val || c.branchId === 'all')
                            .sort((a, b) => {
                              const ordA = a.order !== undefined && a.order !== null ? Number(a.order) : 999999;
                              const ordB = b.order !== undefined && b.order !== null ? Number(b.order) : 999999;
                              if (ordA !== ordB) return ordA - ordB;
                              return a.name.localeCompare(b.name, undefined, { numeric: true });
                            });
                          const curClass = classes.find(c => c.id === transferModal.targetClassId);
                          const matchingClass = (val === stu.branchId ? newBranchClasses.find(c => c.id === stu.classId) : null)
                            || newBranchClasses.find(c => c.id === transferModal.targetClassId)
                            || newBranchClasses.find(c => c.name.toLowerCase() === curClass?.name?.toLowerCase())
                            || newBranchClasses[0];
                          const newClassId = matchingClass?.id || '';
                          const newClassBatches = batches
                            .filter(b => b.classId === newClassId)
                            .sort((a, b) => {
                              const ordA = a.order !== undefined && a.order !== null ? Number(a.order) : 999999;
                              const ordB = b.order !== undefined && b.order !== null ? Number(b.order) : 999999;
                              if (ordA !== ordB) return ordA - ordB;
                              return a.name.localeCompare(b.name, undefined, { numeric: true });
                            });
                          const curBatch = batches.find(b => b.id === transferModal.targetBatchId);
                          const matchingBatch = (val === stu.branchId && newClassId === stu.classId)
                            ? newClassBatches.find(b => b.id === stu.batchId)
                            : (newClassBatches.find(b => b.name.toLowerCase() === curBatch?.name?.toLowerCase()) || newClassBatches[0]);
                          const newBatchId = matchingBatch?.id || '';
                          setTransferModal(prev => ({
                            ...prev,
                            targetBranchId: val,
                            targetClassId: newClassId,
                            targetBatchId: newBatchId,
                          }));
                        }}
                      >
                        <SelectTrigger className="w-full h-9 text-xs rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 font-semibold text-slate-900 dark:text-white">
                          <SelectValue placeholder="Branch Chunein" />
                        </SelectTrigger>
                        <SelectContent>
                          {IDL_BRANCHES.map(b => (
                            <SelectItem key={b.id} value={b.id} className="text-xs">
                              {b.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Target Class & Target Batch in 2 Columns */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {/* Target Class */}
                      <div>
                        <label className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block mb-1">
                          Destination Class *
                        </label>
                        <Select
                          value={transferModal.targetClassId}
                          onValueChange={val => {
                            const newClassBatches = batches
                              .filter(b => b.classId === val)
                              .sort((a, b) => {
                                const ordA = a.order !== undefined && a.order !== null ? Number(a.order) : 999999;
                                const ordB = b.order !== undefined && b.order !== null ? Number(b.order) : 999999;
                                if (ordA !== ordB) return ordA - ordB;
                                return a.name.localeCompare(b.name, undefined, { numeric: true });
                              });
                            const curBatch = batches.find(b => b.id === transferModal.targetBatchId);
                            const matchingBatch = (val === stu.classId && transferModal.targetBranchId === stu.branchId)
                              ? newClassBatches.find(b => b.id === stu.batchId)
                              : (newClassBatches.find(b => b.name.toLowerCase() === curBatch?.name?.toLowerCase()) || newClassBatches[0]);
                            const newBatchId = matchingBatch?.id || '';
                            setTransferModal(prev => ({
                              ...prev,
                              targetClassId: val,
                              targetBatchId: newBatchId,
                            }));
                          }}
                        >
                          <SelectTrigger className="w-full h-9 text-xs rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 font-semibold text-slate-900 dark:text-white">
                            <SelectValue placeholder="Class Chunein" />
                          </SelectTrigger>
                          <SelectContent>
                            {targetBranchClasses.map(c => (
                              <SelectItem key={c.id} value={c.id} className="text-xs">
                                {c.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Target Batch */}
                      <div>
                        <label className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block mb-1">
                          Destination Batch *
                        </label>
                        <Select
                          value={transferModal.targetBatchId}
                          onValueChange={val => {
                            setTransferModal(prev => ({ ...prev, targetBatchId: val }));
                          }}
                        >
                          <SelectTrigger className="w-full h-9 text-xs rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 font-semibold text-slate-900 dark:text-white">
                            <SelectValue placeholder="Batch Chunein" />
                          </SelectTrigger>
                          <SelectContent>
                            {targetClassBatches.map(b => (
                              <SelectItem key={b.id} value={b.id} className="text-xs">
                                {b.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* Target Batch Details Preview Card */}
                  {targetBatch ? (
                    <div className="p-2.5 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40 space-y-1">
                      <div className="flex items-start justify-between text-[11px]">
                        <span className="font-bold text-[#2864E8] flex items-center gap-1 pt-0.5">
                          <History className="w-3.5 h-3.5" />
                          {targetBatch.name}
                        </span>
                        <div className="text-right">
                          <div className="font-mono text-slate-700 dark:text-slate-200 font-bold">
                            Standard Fee: ₹{Number(targetStandardFee).toLocaleString('en-IN')}/mo
                          </div>
                          <div className="font-mono text-slate-500 dark:text-slate-400 text-[10.5px] font-medium">
                            Yearly Fee: ₹{Number(targetYearlyFee).toLocaleString('en-IN')}/yr
                          </div>
                        </div>
                      </div>
                      <div className="text-[10.5px] text-slate-500">
                        Timing:{' '}
                        <span className="font-medium text-slate-700 dark:text-slate-300">
                          {targetBatch.classTime || 'Not specified'}
                        </span>
                      </div>
                      <div className="text-[10.5px] text-slate-500">
                        Subjects:{' '}
                        <span className="font-medium text-slate-700 dark:text-slate-300">
                          {targetBatch.subjects && targetBatch.subjects.length > 0
                            ? targetBatch.subjects.join(', ')
                            : 'No subjects configured'}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-800 text-center text-slate-400 text-[11px]">
                      Koi batch uplabdh nahi hai.
                    </div>
                  )}

                  {/* Fee Difference & Adjustment Section (Shows when different batch/branch/class is selected) */}
                  {!isSameBatch && targetBatch && (
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/90 dark:border-slate-800 space-y-2.5">
                      {/* Difference Header */}
                      <div className="flex items-center justify-between gap-2 flex-wrap text-xs">
                        <span className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                          <CreditCard className="w-3.5 h-3.5 text-[#2864E8]" />
                          Fee Difference & Adjustment
                        </span>
                        {feeDifference > 0 ? (
                          <span className="text-[10.5px] font-bold text-amber-700 dark:text-amber-300 bg-amber-100/80 dark:bg-amber-950/60 px-2.5 py-0.5 rounded-full border border-amber-300 dark:border-amber-900">
                            +₹{feeDifference.toLocaleString('en-IN')}/mo Extra Dena Hoga
                          </span>
                        ) : feeDifference < 0 ? (
                          <span className="text-[10.5px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100/80 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-900">
                            -₹{Math.abs(feeDifference).toLocaleString('en-IN')}/mo Fee Kam Hogi
                          </span>
                        ) : (
                          <span className="text-[10.5px] font-medium text-slate-500 bg-slate-200/60 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                            Same Standard Fee (₹0 Diff)
                          </span>
                        )}
                      </div>

                      {/* Comparison chips */}
                      <div className="grid grid-cols-2 gap-2 text-[11px]">
                        <div className="p-2 rounded-lg bg-white dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60">
                          <div className="text-[10px] text-slate-400 font-medium">Abhi Ki Current Fee</div>
                          <div className="font-bold font-mono text-slate-800 dark:text-slate-100 mt-0.5">
                            ₹{currBaseFee.toLocaleString('en-IN')}/mo
                            <span className="text-[10px] text-slate-400 font-normal ml-1">
                              (Net: ₹{currNetFee.toLocaleString('en-IN')})
                            </span>
                          </div>
                        </div>

                        <div className="p-2 rounded-lg bg-white dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60">
                          <div className="text-[10px] text-slate-400 font-medium">Naye Batch Ki Standard Fee</div>
                          <div className="font-bold font-mono text-[#2864E8] mt-0.5">
                            ₹{targetStandardFee.toLocaleString('en-IN')}/mo
                          </div>
                        </div>
                      </div>

                      {paidThisMonth > 0 && (
                        <div className="text-[10.5px] text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 p-1.5 rounded-lg border border-emerald-200 dark:border-emerald-900/50 flex items-center justify-between">
                          <span>Student ne is mahine pay kiya hai:</span>
                          <span className="font-bold font-mono">₹{paidThisMonth.toLocaleString('en-IN')}</span>
                        </div>
                      )}

                      {/* Adjustment Options (Manual) */}
                      <div className="space-y-1.5 pt-1 border-t border-slate-200/70 dark:border-slate-800">
                        <div className="flex items-center justify-between">
                          <span className="text-[10.5px] font-semibold text-slate-600 dark:text-slate-400">
                            Extra Fee Adjustment (Manual Option)
                          </span>
                          <span className="text-[9.5px] text-slate-400">Compulsory nahi hai</span>
                        </div>

                        <div className="grid grid-cols-3 gap-1.5">
                          {/* Option 1: Charge Extra */}
                          <button
                            type="button"
                            onClick={() => setTransferModal(prev => ({ ...prev, feeAdjustmentMode: 'charge_extra' }))}
                            className={`p-2 rounded-xl border text-left transition-all cursor-pointer ${
                              transferModal.feeAdjustmentMode === 'charge_extra'
                                ? 'border-[#2864E8] bg-blue-50/70 dark:bg-blue-950/50 text-[#2864E8] ring-1 ring-[#2864E8]'
                                : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                            }`}
                          >
                            <div className="text-[11px] font-bold">Extra Fee Lein</div>
                            <div className="text-[9.5px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                              New std fee lagu hogi
                            </div>
                            <div className="text-[10px] font-mono font-bold text-slate-800 dark:text-slate-100 mt-1">
                              Net: ₹{chargeExtraNet.toLocaleString('en-IN')}/mo
                            </div>
                          </button>

                          {/* Option 2: Add to Scholarship */}
                          <button
                            type="button"
                            onClick={() => setTransferModal(prev => ({ ...prev, feeAdjustmentMode: 'add_scholarship' }))}
                            className={`p-2 rounded-xl border text-left transition-all cursor-pointer ${
                              transferModal.feeAdjustmentMode === 'add_scholarship'
                                ? 'border-emerald-600 bg-emerald-50/70 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 ring-1 ring-emerald-600'
                                : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                            }`}
                          >
                            <div className="text-[11px] font-bold">Scholarship me Add</div>
                            <div className="text-[9.5px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                              Difference waive karein
                            </div>
                            <div className="text-[10px] font-mono font-bold text-emerald-700 dark:text-emerald-300 mt-1">
                              Net: ₹{addScholarshipNet.toLocaleString('en-IN')}/mo
                            </div>
                          </button>

                          {/* Option 3: Manual Custom Fee */}
                          <button
                            type="button"
                            onClick={() => setTransferModal(prev => ({ ...prev, feeAdjustmentMode: 'custom' }))}
                            className={`p-2 rounded-xl border text-left transition-all cursor-pointer ${
                              transferModal.feeAdjustmentMode === 'custom'
                                ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 ring-1 ring-indigo-600'
                                : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                            }`}
                          >
                            <div className="text-[11px] font-bold">Custom Fee</div>
                            <div className="text-[9.5px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                              Manually fee dalein
                            </div>
                            <div className="text-[10px] font-mono font-bold text-indigo-700 dark:text-indigo-300 mt-1">
                              Net: ₹{customNet.toLocaleString('en-IN')}/mo
                            </div>
                          </button>
                        </div>

                        {/* If Custom mode is selected, provide an input field */}
                        {transferModal.feeAdjustmentMode === 'custom' && (
                          <div className="p-2 rounded-lg bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900/40 flex items-center gap-2 mt-1">
                            <label className="text-[10.5px] font-semibold text-slate-700 dark:text-slate-200 shrink-0">
                              New Base Fee:
                            </label>
                            <div className="relative flex-1">
                              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">₹</span>
                              <input
                                type="number"
                                value={transferModal.customFeeInput}
                                onChange={e => setTransferModal(prev => ({ ...prev, customFeeInput: e.target.value }))}
                                placeholder={String(targetStandardFee)}
                                className="w-full h-7 pl-6 pr-2 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-mono font-bold text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500"
                              />
                            </div>
                          </div>
                        )}

                        {/* Final Resulting Net Fee Bar */}
                        <div className="p-2 rounded-lg bg-blue-50/60 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40 flex items-center justify-between text-[11px] mt-1">
                          <span className="text-slate-600 dark:text-slate-300 font-medium">
                            Final Payable Net Fee:
                          </span>
                          <span className="font-bold font-mono text-[#2864E8] text-xs">
                            ₹{finalResultingNet.toLocaleString('en-IN')}/month
                            {addlFee > 0 && <span className="text-[10px] text-slate-500 font-normal ml-1">(+₹{addlFee.toLocaleString('en-IN')} addl)</span>}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Effective Month & Reason */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                    <div>
                      <label className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block mb-1">
                        Effective Month *
                      </label>
                      <Select
                        value={transferModal.effectiveMonth}
                        onValueChange={val => setTransferModal(prev => ({ ...prev, effectiveMonth: val }))}
                      >
                        <SelectTrigger className="w-full h-9 text-xs rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 font-semibold text-slate-900 dark:text-white">
                          <SelectValue placeholder="Month" />
                        </SelectTrigger>
                        <SelectContent>
                          {monthOptions.map(m => (
                            <SelectItem key={m.value} value={m.value} className="text-xs">
                              {m.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <span className="text-[9.5px] text-slate-400 block mt-0.5">
                        Is mahine aur aage se batch update hoga
                      </span>
                    </div>

                    <div>
                      <label className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block mb-1">
                        Transfer Reason (Optional)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Batch timing request"
                        value={transferModal.reason}
                        onChange={e => setTransferModal(prev => ({ ...prev, reason: e.target.value }))}
                        className="w-full h-9 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-[#2864E8]"
                      />
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <DialogFooter className="pt-2.5 border-t border-slate-100 dark:border-slate-800 shrink-0 flex items-center justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setTransferModal(prev => ({ ...prev, isOpen: false }))}
                    className="h-9 px-4 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={transferModal.isSubmitting || isSameBatch || !transferModal.targetBatchId}
                    className="h-9 px-4 rounded-xl text-xs font-bold bg-[#2864E8] hover:bg-[#1E4ED8] text-white shadow-xs disabled:opacity-50"
                  >
                    {transferModal.isSubmitting ? (
                      <span className="flex items-center gap-1.5">
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        Transferring...
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5">
                        <ArrowRightLeft className="w-3.5 h-3.5" />
                        Confirm Transfer
                      </span>
                    )}
                  </Button>
                </DialogFooter>
              </form>
            );
          })()}
        </DialogContent>
      </Dialog>
      </div>
    </div>
  );
}
