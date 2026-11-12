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
import { useAuth } from '@/context/auth-context';
import { syncServerSessionFromProfile } from '@/app/actions/auth';
import { IDL_RECEIPT_LOGO_DATA_URL } from '@/lib/receipt-logo';
import { IDL_PAID_STAMP_DATA_URL } from '@/lib/receipt-stamp';
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
  getResetBackupStatus,
  restoreResetFeeData,
  type ResetBackupStatus,
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
  Download,
  Share2,
  Calendar,
  Layers,
  History,
  Building2,
  Globe,
  Check,
  ChevronLeft,
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
  ArrowRight,
  ArrowRightLeft,
  Shield,
  UserPlus,
  Folder,
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
  initialPayments?: FeePayment[];
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
  initialPayments = [],
}: FeesClientProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isPending, startTransition] = useTransition();

  const isBranchAdmin = Boolean(user?.branchId && user?.branchId !== 'all');
  const branchAdminBranchId = isBranchAdmin ? (user!.branchId === 'mangol-puri' ? 'mangolpuri' : user!.branchId!) : null;

  const normalizeClientBranch = (id?: string | null): string => {
    if (!id) return '';
    const clean = id.trim().toLowerCase();
    if (clean === 'mangol-puri' || clean === 'mangol puri' || clean === 'mangolpuri') return 'mangolpuri';
    return clean;
  };

  const branchIdsMatch = (a?: string | null, b?: string | null): boolean => {
    const na = normalizeClientBranch(a);
    const nb = normalizeClientBranch(b);
    if (!na || !nb) return false;
    if (na === 'all' || nb === 'all') return true;
    return na === nb;
  };

  const ensureActiveServerSession = async () => {
    try {
      if (user?.uid && typeof window !== 'undefined') {
        const activeCookieUid = localStorage.getItem('idl_active_cookie_uid');
        if (activeCookieUid !== user.uid) {
          const syncRes = await syncServerSessionFromProfile({ uid: user.uid, email: user.email });
          if (syncRes?.success && syncRes.user?.uid) {
            localStorage.setItem('idl_active_cookie_uid', syncRes.user.uid);
          }
        }
      }
    } catch {
      // Non-blocking session sync
    }
  };

  // Filters - Super Admin defaults to All Branches; Branch Admins stay locked to their assigned branch
  const [selectedBranch, setSelectedBranch] = useState<string>(
    branchAdminBranchId || initialBranch || (!isBranchAdmin && user?.role === 'admin' ? 'all' : 'all')
  );
  const hasBranchSelection = Boolean(selectedBranch && selectedBranch !== 'none');

  useEffect(() => {
    if (isBranchAdmin && branchAdminBranchId && selectedBranch !== branchAdminBranchId) {
      setSelectedBranch(branchAdminBranchId);
      refreshAllData(selectedMonth, branchAdminBranchId);
    } else if (!isBranchAdmin && user?.role === 'admin' && !selectedBranch) {
      setSelectedBranch('all');
      refreshAllData(selectedMonth, 'all');
    }
  }, [isBranchAdmin, branchAdminBranchId, user?.role, user?.uid]);
  const [selectedMonth, setSelectedMonth] = useState<string>(initialMonth);
  const [isBranchPickerOpen, setIsBranchPickerOpen] = useState<boolean>(false);
  const [isMonthPickerOpen, setIsMonthPickerOpen] = useState<boolean>(false);
  const [isDataGroupOpen, setIsDataGroupOpen] = useState<boolean>(false);
  const [monthPickerYear, setMonthPickerYear] = useState<number>(
    () => parseInt((initialMonth || '2026-11').split('-')[0], 10) || 2026
  );
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
  const [monthPayments, setMonthPayments] = useState<FeePayment[]>(initialPayments);

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

  const allowedMonthSet = React.useMemo(
    () => new Set(monthOptions.map(m => m.value)),
    [monthOptions]
  );
  const minPickerYear = monthOptions.length > 0 ? parseInt(monthOptions[0].value.split('-')[0], 10) : 2026;
  const maxPickerYear = monthOptions.length > 0 ? parseInt(monthOptions[monthOptions.length - 1].value.split('-')[0], 10) : 2026;

  const emptyStatsForMonth = (monthStr: string, monthLabelStr?: string): FeeDashboardStats => ({
    totalStudents: 0,
    activeStudents: 0,
    disabledStudents: 0,
    totalClasses: 0,
    totalBatches: 0,
    currentMonth: monthStr,
    currentMonthLabel: monthLabelStr || monthOptions.find(m => m.value === monthStr)?.label || monthStr,
    totalExpectedFee: 0,
    totalReceivedFee: 0,
    totalPendingFee: 0,
    totalAdvanceFee: 0,
    overdueCount: 0,
    collectionRate: 0,
    classBreakdown: [],
    branchBreakdown: [],
    recentPayments: [],
  });

  // Refresh data function
  const refreshAllData = (month = selectedMonth, branch = selectedBranch) => {
    if (!branch || branch === 'none') {
      setStats(prev => emptyStatsForMonth(month, month === prev.currentMonth ? prev.currentMonthLabel : undefined));
      setClasses([]);
      setBatches([]);
      setStudents([]);
      setLedger([]);
      setYearlyReport(null);
      setMonthPayments([]);
      setSelectedStudentProfile(null);
      getResetBackupStatus()
        .then(status => {
          if (status?.success) setResetBackupStatus(status);
        })
        .catch(() => {});
      return;
    }

    startTransition(async () => {
      try {
        await ensureActiveServerSession();
        const directoryScopeBranch = isBranchAdmin ? branch : 'all';
        const [newStats, newClasses, newBatches, newStudents, newLedger, newYearly, newPayments, backupStatus] = await Promise.all([
          getFeeDashboardStats(month, branch),
          getFeeClasses(directoryScopeBranch),
          getFeeBatches(undefined, directoryScopeBranch),
          getFeeStudents({ branchId: directoryScopeBranch }),
          getMonthlyLedger(month, { branchId: branch }),
          getBranchYearlyReport('2026-27'),
          getFeePayments({ month, branchId: branch }),
          getResetBackupStatus(),
        ]);

        if (newStats?.success) setStats(newStats.data);
        if (newClasses?.success) setClasses(newClasses.data);
        if (newBatches?.success) setBatches(newBatches.data);
        if (newStudents?.success) {
          setStudents(newStudents.data);
          setSelectedStudentProfile(prev => {
            if (!prev) return null;
            const updated = newStudents.data.find(s => s.id === prev.id);
            return updated || prev;
          });
        }
        if (newLedger?.success) setLedger(newLedger.data);
        if (newYearly?.success) setYearlyReport(newYearly.data);
        if (newPayments?.success) setMonthPayments(newPayments.data);
        if (backupStatus?.success) setResetBackupStatus(backupStatus);
      } catch (err) {
        console.error('Failed to refresh fee dashboard data:', err);
      }
    });
  };

  const latestFilterRef = useRef({ month: selectedMonth, branch: selectedBranch });
  latestFilterRef.current = { month: selectedMonth, branch: selectedBranch };

  useEffect(() => {
    refreshAllData(selectedMonth, selectedBranch);
  }, [selectedMonth, selectedBranch]);

  // Auto-sync report data when returning to the tab or periodically while active
  useEffect(() => {
    const syncLatest = () => {
      const { month, branch } = latestFilterRef.current;
      if (branch && branch !== 'none' && document.visibilityState === 'visible') {
        refreshAllData(month, branch);
      }
    };
    const handleVisibilityOrFocus = () => {
      if (document.visibilityState === 'visible') syncLatest();
    };
    window.addEventListener('focus', handleVisibilityOrFocus);
    document.addEventListener('visibilitychange', handleVisibilityOrFocus);
    const intervalId = window.setInterval(syncLatest, 45000);
    return () => {
      window.removeEventListener('focus', handleVisibilityOrFocus);
      document.removeEventListener('visibilitychange', handleVisibilityOrFocus);
      window.clearInterval(intervalId);
    };
  }, []);

  // --------------------------------------------------------------------------
  // MODAL STATES
  // --------------------------------------------------------------------------

  // Shared Card Modal Styles (Create Class / Create Batch / Enroll Student)
  const FORM_CARD_SURFACE_CLS = "w-[94vw] rounded-2xl p-5 bg-white dark:bg-slate-950 border border-[#E2E8F0] dark:border-slate-800 shadow-[0_24px_56px_-12px_rgba(11,31,75,0.16),0_6px_18px_-4px_rgba(15,23,42,0.07),0_0_0_1px_rgba(15,23,42,0.03)] font-sans antialiased [&>button:last-child]:border-slate-200/90 [&>button:last-child]:text-slate-400 [&>button:last-child]:hover:text-[#0B1F4B] [&>button:last-child]:hover:border-slate-300 [&>button:last-child]:hover:bg-slate-50 [&>button:last-child]:shadow-[0_1px_2px_rgba(15,23,42,0.04)] [&>button:last-child]:transition-colors";
  const FORM_CARD_DIALOG_CLS = `max-w-[440px] ${FORM_CARD_SURFACE_CLS}`;
  const FORM_CARD_WIDE_DIALOG_CLS = `max-w-[480px] sm:max-w-[500px] ${FORM_CARD_SURFACE_CLS}`;
  const FORM_CARD_HEADER_CLS = "pb-3 border-b border-[#EEF2F7] dark:border-slate-800/80 shrink-0 text-left pr-9";
  const FORM_CARD_TITLE_CLS = "text-[16px] sm:text-[17px] font-bold text-[#0B1F4B] dark:text-white tracking-[-0.015em] leading-snug";
  const FORM_CARD_DESC_CLS = "text-[11.5px] text-slate-500 dark:text-slate-400 font-normal leading-relaxed mt-0.5";
  const FORM_CARD_LABEL_CLS = "text-xs font-medium text-slate-400 dark:text-slate-500 tracking-[0.005em]";
  const FORM_CARD_FIELD_CLS = "h-9 text-xs sm:text-[13px] md:text-[13px] font-semibold !rounded-none !border-0 !border-b border-slate-200/85 dark:border-slate-800 !bg-transparent px-0 hover:!border-b-slate-300 dark:hover:!border-b-slate-700 focus:!bg-transparent focus:!border-b-[#2864E8] focus-visible:ring-0 focus-visible:!border-b-[#2864E8] placeholder:font-normal placeholder:text-slate-400/65 dark:placeholder:text-slate-600 text-[#0B1F4B] dark:text-slate-100 transition-colors duration-150 !shadow-none";
  const FORM_CARD_SELECT_TRIGGER_CLS = `${FORM_CARD_FIELD_CLS} focus:outline-none focus:ring-0 focus-visible:outline-none data-[state=open]:!border-b-[#2864E8] data-[state=open]:!bg-transparent data-[placeholder]:font-normal data-[placeholder]:text-slate-400/65 dark:data-[placeholder]:text-slate-600 [&>svg]:text-slate-400 data-[state=open]:[&>svg]:text-[#2864E8] [&>svg]:transition-[transform,color] [&>svg]:duration-150 data-[state=open]:[&>svg]:rotate-180`;
  const FORM_CARD_SELECT_CONTENT_CLS = "rounded-xl border border-slate-200/95 dark:border-slate-800 bg-white dark:bg-slate-950 p-1 shadow-[0_14px_34px_-8px_rgba(11,31,75,0.14),0_2px_8px_rgba(15,23,42,0.05)]";
  const FORM_CARD_SELECT_ITEM_CLS = "text-xs sm:text-[13px] font-medium text-slate-700 dark:text-slate-200 rounded-lg py-1.5 sm:py-2 focus:bg-blue-50/90 focus:text-[#2864E8] data-[state=checked]:text-[#2864E8] data-[state=checked]:font-semibold dark:focus:bg-blue-950/40 dark:focus:text-blue-400 cursor-pointer";
  const CIRCLE_PLUS_BTN_BASE_CLS = "rounded-full border inline-flex items-center justify-center shrink-0 transition-colors duration-150 cursor-pointer";
  const FORM_CARD_SUBMIT_BTN_CLS = "group w-full h-9 !rounded-[5px] text-xs font-semibold uppercase tracking-[0.06em] bg-[#2864E8] hover:bg-[#1E4ED8] active:bg-[#1842BE] text-white shadow-[0_2px_8px_-1px_rgba(40,100,232,0.26),0_1px_2px_rgba(23,32,51,0.08)] hover:shadow-[0_4px_12px_rgba(40,100,232,0.3),0_1px_3px_rgba(23,32,51,0.1)] flex items-center justify-center gap-2 transition-all duration-150 cursor-pointer active:scale-[0.995]";

  // Shared Student Profile / Enroll / Edit Modal Tokens (1:1 Visual Consistency)
  const STUDENT_MODAL_DIALOG_CLS = "max-w-[480px] sm:max-w-[500px] w-[94vw] rounded-2xl p-4 sm:p-5 bg-white dark:bg-slate-950 text-left border border-slate-200/80 dark:border-slate-800 shadow-[0_20px_50px_-12px_rgba(15,23,42,0.12),0_4px_16px_rgba(15,23,42,0.04)] overflow-hidden max-h-[88vh] flex flex-col font-['Inter_Tight',sans-serif]";
  const STUDENT_MODAL_LABEL_CLS = "text-[11px] font-normal text-slate-400 dark:text-slate-500 block truncate";
  const STUDENT_MODAL_INPUT_CLS = "w-full bg-transparent border-0 border-b border-transparent hover:border-slate-300 dark:hover:border-slate-700 focus:border-[#2864E8] dark:focus:border-[#2864E8] focus:outline-none focus:ring-0 text-[12.5px] font-medium text-slate-700 dark:text-slate-200 placeholder:font-normal placeholder:text-slate-400/80 p-0 m-0 mt-0.5 h-[19px] leading-tight transition-colors";
  const STUDENT_MODAL_MONO_INPUT_CLS = "w-full bg-transparent border-0 border-b border-transparent hover:border-slate-300 dark:hover:border-slate-700 focus:border-[#2864E8] dark:focus:border-[#2864E8] focus:outline-none focus:ring-0 text-[12px] font-medium text-slate-700 dark:text-slate-200 font-mono tabular-nums placeholder:font-normal placeholder:text-slate-400/80 p-0 m-0 mt-0.5 h-[19px] leading-tight transition-colors";
  const STUDENT_MODAL_SELECT_CLS = "w-full bg-transparent border-0 border-b border-transparent hover:border-slate-300 dark:hover:border-slate-700 focus:border-[#2864E8] dark:focus:border-[#2864E8] focus:outline-none focus:ring-0 text-[12.5px] font-medium text-slate-700 dark:text-slate-200 data-[placeholder]:text-slate-400/80 data-[placeholder]:font-normal p-0 m-0 mt-0.5 h-[19px] shadow-none flex items-center justify-between cursor-pointer transition-colors [&>svg]:h-2.5 [&>svg]:w-2.5 [&>svg]:text-slate-400 [&>svg]:opacity-60 hover:[&>svg]:text-[#2864E8] hover:[&>svg]:opacity-100";
  const STUDENT_MODAL_FOOTER_BTN_CLS = "group w-full h-9 !rounded-[5px] text-xs font-semibold uppercase tracking-wider bg-[#2864E8] hover:bg-[#1E4ED8] active:bg-[#1842BE] text-white shadow-[0_1px_2px_rgba(15,23,42,0.08)] flex items-center justify-center gap-1.5 transition-all cursor-pointer";

  // 1. Create Class Modal
  const EMPTY_CLASS_FORM: {
    name: string;
    code: string;
    division: string;
    branchId: string;
    academicSession: string;
    description: string;
    defaultMonthlyFee: number;
    order?: number | '';
  } = {
    name: '',
    code: '',
    division: '',
    branchId: '',
    academicSession: '',
    description: '',
    defaultMonthlyFee: 0,
    order: '',
  };
  const [isClassModalOpen, setIsClassModalOpen] = useState(false);
  const [classForm, setClassForm] = useState({ ...EMPTY_CLASS_FORM });

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
  const [isBatchSubjectInputOpen, setIsBatchSubjectInputOpen] = useState(false);
  const batchSubjectInputRef = useRef<HTMLInputElement | null>(null);
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
  type EnrollStudentFormState = {
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
  };
  const EMPTY_STUDENT_FORM: EnrollStudentFormState = {
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
  };
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [studentForm, setStudentForm] = useState<EnrollStudentFormState>({ ...EMPTY_STUDENT_FORM });

  const [isCustomRollNumber, setIsCustomRollNumber] = useState(false);
  const [enrollStudentSubjectTab, setEnrollStudentSubjectTab] = useState<'enrolled' | 'additional'>('enrolled');
  const [showEnrollAddSubjectInput, setShowEnrollAddSubjectInput] = useState(false);
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

  // Reset & Restore confirmation dialogs
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [isRestoreConfirmOpen, setIsRestoreConfirmOpen] = useState(false);
  const [isRestoringData, setIsRestoringData] = useState(false);
  const [resetBackupStatus, setResetBackupStatus] = useState<ResetBackupStatus>({
    success: true,
    hasBackup: false,
  });

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
        isResetConfirmOpen ||
        isRestoreConfirmOpen;

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
    isRestoreConfirmOpen,
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

    try {
      await ensureActiveServerSession();
      const res = await createFeeClass(payload);
      if (res.success) {
        toast({ title: 'Success', description: res.message });
        setIsClassModalOpen(false);
        setClassForm({ ...EMPTY_CLASS_FORM });
        if (res.data) {
          setClasses(prev => [
            { ...res.data!, batchCount: 0, studentCount: 0 },
            ...prev.filter(c => c.id !== res.data!.id),
          ]);
        }
        const nextBranch =
          !isBranchAdmin && selectedBranch !== 'all' && !branchIdsMatch(selectedBranch, payload.branchId)
            ? 'all'
            : selectedBranch;
        if (nextBranch !== selectedBranch) {
          setSelectedBranch(nextBranch);
        }
        refreshAllData(selectedMonth, nextBranch);
      } else {
        toast({ variant: 'destructive', title: 'Error', description: res.message });
      }
    } catch (err: any) {
      toast({ variant: 'destructive', title: 'Error', description: err?.message || 'Failed to create class' });
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

      const finalSubjects = parseSubjectEntries(newBatchSubjectInput, batchForm.subjects);

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

      await ensureActiveServerSession();
      const res = await createFeeBatch(payload);
      if (res.success) {
        toast({ title: 'Success', description: res.message });
        setIsBatchModalOpen(false);
        if (res.data) {
          setBatches(prev => [res.data!, ...prev.filter(b => b.id !== res.data!.id)]);
          setSelectedBatchPerClass(prev => ({ ...prev, [payload.classId]: res.data!.id }));
        }
        const nextBranch =
          !isBranchAdmin && selectedBranch !== 'all' && !branchIdsMatch(selectedBranch, payload.branchId)
            ? 'all'
            : selectedBranch;
        if (nextBranch !== selectedBranch) {
          setSelectedBranch(nextBranch);
        }
        setBatchForm({
          classId: '',
          branchId: nextBranch && nextBranch !== 'all' ? nextBranch : '',
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
        setIsBatchSubjectInputOpen(false);
        setEditingBatchSubIdx(null);
        setIsCustomBatchFee(false);
        refreshAllData(selectedMonth, nextBranch);
      } else {
        toast({ variant: 'destructive', title: 'Error', description: res.message });
      }
    } catch (err: any) {
      toast({ variant: 'destructive', title: 'Error', description: err.message || 'Failed to create batch' });
    } finally {
      setIsSubmittingBatch(false);
    }
  };

  // Parse comma-separated subjects while deduplicating case-insensitively
  const parseSubjectEntries = (raw: string, existing: string[] = []): string[] => {
    const result = [...existing];
    for (const part of raw.split(',')) {
      const clean = part.trim();
      if (clean && !result.some(s => s.toLowerCase() === clean.toLowerCase())) {
        result.push(clean);
      }
    }
    return result;
  };

  // Handlers for dynamic batch subjects creation, editing & deletion
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
    const resolvedContact1 =
      studentForm.contact1.trim() ||
      (studentForm.fatherContact || '').trim() ||
      (studentForm.motherContact || '').trim();
    if (!studentForm.name.trim() || !resolvedContact1 || !studentForm.branchId || !studentForm.classId || !studentForm.batchId) {
      toast({ variant: 'destructive', title: 'Error', description: 'Name, Contact, Branch, Class, and Batch are mandatory.' });
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
      contact1: resolvedContact1,
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

    await ensureActiveServerSession();
    const res = await createFeeStudent(payload);
    if (res.success) {
      toast({ title: 'Student Enrolled', description: res.message });
      setIsStudentModalOpen(false);
      if (res.data) {
        setStudents(prev => [res.data!, ...prev.filter(s => s.id !== res.data!.id)]);
      }
      const nextBranch =
        !isBranchAdmin && selectedBranch !== 'all' && !branchIdsMatch(selectedBranch, payload.branchId)
          ? 'all'
          : selectedBranch;
      if (nextBranch !== selectedBranch) {
        setSelectedBranch(nextBranch);
      }
      setStudentForm({
        ...EMPTY_STUDENT_FORM,
        branchId: nextBranch && nextBranch !== 'all' ? nextBranch : '',
      });
      setEnrollStudentSubjectTab('enrolled');
      setShowEnrollAddSubjectInput(false);
      setNewEnrollAddlSubjectName('');
      setNewEnrollAddlSubjectFee('');
      refreshAllData(selectedMonth, nextBranch);
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

    const activeLedgerEntry = ledger.find(l => l.studentId === student.id && (!selectedMonth || l.month === selectedMonth));
    const today = new Date();
    const currentMonthStr = String(today.getMonth() + 1).padStart(2, '0');
    const currentYearStr = String(today.getFullYear());
    const dueDay = String(student.dueDayOfMonth || 5).padStart(2, '0');
    const fallbackDueDate = `${dueDay}-${currentMonthStr}-${currentYearStr}`;
    const ledgerDueFormatted = activeLedgerEntry?.dueDate ? formatAdmDate(activeLedgerEntry.dueDate) : '—';
    const computedDueDate = ledgerDueFormatted !== '—' ? ledgerDueFormatted : fallbackDueDate;

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
      try {
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
      } catch (err: any) {
        toast({ variant: 'destructive', title: 'Error', description: err?.message || 'Failed to update student' });
      }
    });
  };

  const loadResetBackupStatus = async () => {
    try {
      const status = await getResetBackupStatus();
      if (status?.success) {
        setResetBackupStatus(status);
      }
    } catch (err) {
      console.error('Failed to load reset backup status:', err);
    }
  };

  // Handle Clear All Data
  const handleClearAllData = async () => {
    setIsResetConfirmOpen(false);
    try {
      const res = await clearAllFeeData();
      if (res.success) {
        setSelectedStudentProfile(null);
        toast({ title: 'Data Cleared', description: res.message });
        refreshAllData();
        loadResetBackupStatus();
      } else {
        toast({ variant: 'destructive', title: 'Error', description: res.message });
      }
    } catch (err: any) {
      toast({ variant: 'destructive', title: 'Error', description: err?.message || 'Failed to clear fee data' });
    }
  };

  const openRestoreConfirmDialog = () => {
    setIsRestoreConfirmOpen(true);
    loadResetBackupStatus();
  };

  // Handle Restore Reset Data
  const handleRestoreResetData = async () => {
    if (isRestoringData) return;
    setIsRestoringData(true);
    try {
      const res = await restoreResetFeeData();
      if (res.success) {
        setIsRestoreConfirmOpen(false);
        toast({ title: 'Data Restored', description: res.message });
        refreshAllData();
        loadResetBackupStatus();
      } else {
        toast({ variant: 'destructive', title: 'Restore Failed', description: res.message });
      }
    } catch (err: any) {
      toast({ variant: 'destructive', title: 'Restore Failed', description: err?.message || 'Failed to restore fee data' });
    } finally {
      setIsRestoringData(false);
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
          setMonthPayments(prev => prev.some(p => p.id === res.receipt!.id) ? prev : [res.receipt!, ...prev]);
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
        setMonthPayments(prev => prev.some(p => p.id === res.receipt!.id) ? prev : [res.receipt!, ...prev]);
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

  const getYearlyPackageMeta = (student?: FeeStudent, fallbackMonthly = 0) => {
    const isYearly = Boolean(
      student && (student.feeType === 'yearly_package' || Boolean(student.yearlyPackage?.totalYearlyFee))
    );
    if (!isYearly || !student) return null;
    const courseMonths = Math.max(
      1,
      Number(student.yearlyPackage?.courseMonths || student.paymentCycleMonths) || 12
    );
    const explicitYearlyTotal = Number(student.yearlyPackage?.totalYearlyFee) || 0;
    const baseMonthly = Number(student.netFee) || 0;
    const totalYearlyFee = explicitYearlyTotal || (baseMonthly > 0 ? baseMonthly * courseMonths : fallbackMonthly * courseMonths);
    const monthlyEquated =
      baseMonthly > 0
        ? baseMonthly
        : fallbackMonthly > 0 && fallbackMonthly !== totalYearlyFee
          ? fallbackMonthly
          : Math.round(totalYearlyFee / courseMonths);
    return { courseMonths, monthlyEquated, totalYearlyFee };
  };

  const buildYearlyPackageReceipt = (entry: FeeLedgerEntry & { student: FeeStudent }): FeePayment | null => {
    const meta = getYearlyPackageMeta(entry.student, entry.paidAmount);
    if (!meta || entry.paidAmount <= 0) return null;
    const startMonth = (entry.student.joiningDate || `${entry.month}-01`).slice(0, 7);
    const [sy, sm] = startMonth.split('-').map(Number);
    const startLabel =
      sy && sm
        ? new Date(sy, sm - 1, 1).toLocaleString('en-US', { month: 'long', year: 'numeric' })
        : entry.monthLabel;
    const rollDigits = String(entry.student.rollNumber || entry.studentId).replace(/\D/g, '');
    const suffix = (rollDigits.slice(-4) || '0001').padStart(4, '0');
    return {
      id: `yr-pkg-${entry.studentId}-${startMonth}`,
      receiptNumber: `YR-${startMonth.replace('-', '')}-${suffix}`,
      studentId: entry.studentId,
      studentName: entry.student.name,
      rollNumber: entry.student.rollNumber,
      branchId: entry.branchId,
      classId: entry.classId,
      batchId: entry.batchId,
      month: startMonth,
      monthLabel: `${startLabel} (Yearly Package)`,
      amount: meta.totalYearlyFee,
      paymentMode: 'cash',
      transactionRef: 'YEARLY-PACKAGE-LUMPSUM',
      paymentDate: entry.lastPaymentDate || entry.student.joiningDate || `${entry.month}-01`,
      collectedBy: 'Admin Desk',
      remarks: `Yearly Package (${meta.courseMonths} Months). Equated: ₹${entry.paidAmount.toLocaleString('en-IN')}/mo`,
      createdAt: entry.student.createdAt || new Date().toISOString(),
    };
  };

  // Open Revert / Mark Unpaid Modal (with Payment Receipts ready together with window open)
  const openRevertModal = async (entry: FeeLedgerEntry & { student: FeeStudent }) => {
    const isYearlyMatch = (p: FeePayment) =>
      p.studentId === entry.studentId &&
      (p.transactionRef === 'YEARLY-PACKAGE-LUMPSUM' || (p.monthLabel || '').includes('Yearly Package'));
    const isYearlyStudent = Boolean(getYearlyPackageMeta(entry.student, entry.paidAmount));

    const cachedDirect = monthPayments.filter(
      p => p.studentId === entry.studentId && p.month === entry.month
    );
    const recentDirect =
      cachedDirect.length > 0
        ? cachedDirect
        : (stats.recentPayments || []).filter(
          p => p.studentId === entry.studentId && p.month === entry.month
        );

    const cachedYearly =
      recentDirect.length === 0 && isYearlyStudent
        ? monthPayments.filter(isYearlyMatch)
        : [];
    const initialMatches =
      recentDirect.length > 0
        ? recentDirect
        : cachedYearly.length > 0
          ? cachedYearly
          : isYearlyStudent
            ? (stats.recentPayments || []).filter(isYearlyMatch)
            : [];

    if (initialMatches.length > 0) {
      setRevertTarget(entry);
      setRevertTargetPayments(initialMatches);
      setIsRevertModalOpen(true);
      try {
        const res = await getFeePayments({ studentId: entry.studentId, month: entry.month });
        if (res.success && res.data.length > 0) {
          setRevertTargetPayments(prev => {
            if (prev.length === 0) return prev;
            const same =
              prev.length === res.data.length &&
              prev.every(
                (p, i) =>
                  p.id === res.data[i].id &&
                  p.paymentDate === res.data[i].paymentDate &&
                  p.amount === res.data[i].amount
              );
            return same ? prev : res.data;
          });
        }
      } catch (e) {
        console.error('Error syncing payments:', e);
      }
      return;
    }

    // Fetch before opening modal when not cached locally so receipts (or yearly receipt fallback) render together with the dialog
    try {
      const res = await getFeePayments({ studentId: entry.studentId, month: entry.month });
      let paymentsToShow = res.success ? res.data : [];
      if (paymentsToShow.length === 0 && isYearlyStudent) {
        const fallbackYearly = buildYearlyPackageReceipt(entry);
        if (fallbackYearly) {
          paymentsToShow = [fallbackYearly];
        }
      }
      setRevertTarget(entry);
      setRevertTargetPayments(paymentsToShow);
      setIsRevertModalOpen(true);
    } catch (e) {
      console.error('Error fetching payments:', e);
      const fallbackYearly = isYearlyStudent ? buildYearlyPackageReceipt(entry) : null;
      setRevertTarget(entry);
      setRevertTargetPayments(fallbackYearly ? [fallbackYearly] : []);
      setIsRevertModalOpen(true);
    }
  };

  // Revert / Mark Entire Month Unpaid
  const handleMarkEntireMonthUnpaid = async () => {
    if (!revertTarget) return;
    setIsReverting(true);
    try {
      const targetStudentId = revertTarget.studentId;
      const targetMonth = revertTarget.month;
      const res = await markMonthUnpaid(targetStudentId, targetMonth);
      if (res.success) {
        toast({ title: 'Marked as Unpaid', description: res.message });
        setMonthPayments(prev =>
          prev.filter(p => !(p.studentId === targetStudentId && p.month === targetMonth))
        );
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
        setMonthPayments(prev => prev.filter(p => p.id !== paymentId));
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
        if (res.updatedPayment) {
          setMonthPayments(prev => prev.map(p => (p.id === res.updatedPayment!.id ? res.updatedPayment! : p)));
        }
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

  // Helper to draw rounded rectangle safely on any canvas context
  const drawCanvasRoundRect = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    r: number
  ) => {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  };

  // Generate crisp, professional 2D canvas of the fee receipt
  const generateReceiptCanvas = async (pay: FeePayment, student?: FeeStudent): Promise<HTMLCanvasElement> => {
    const canvas = document.createElement('canvas');
    const width = 560;
    const outerMargin = 16;
    const cardX = outerMargin;
    const cardY = outerMargin;
    const cardW = width - outerMargin * 2;
    const contentLeft = 36;
    const contentRight = width - 36;
    const scale = 3; // high resolution for razor-sharp PDF text & printing

    const clsName = classes.find(c => c.id === pay.classId)?.name || pay.classId || 'Class';
    const batchName = batches.find(b => b.id === pay.batchId)?.name || student?.batchId || '';

    const yearlyMeta = getYearlyPackageMeta(student, pay.amount);
    const isYearlyReceipt =
      pay.transactionRef === 'YEARLY-PACKAGE-LUMPSUM' ||
      (pay.monthLabel || '').includes('Yearly Package');

    // Preserve exact receipt fields and order
    const details: [string, string][] = [
      ['Student Name', pay.studentName],
      ['Roll Number', pay.rollNumber || student?.rollNumber || 'N/A'],
      ['Father / Guardian', student?.fatherName || 'N/A'],
      ['Class & Batch', `${clsName}${batchName ? ` • ${batchName}` : ''}`],
      ['Billing Month', pay.monthLabel || pay.month],
    ];

    if (isYearlyReceipt && yearlyMeta) {
      details.push([
        'Package Plan',
        `${yearlyMeta.courseMonths} Months (₹${yearlyMeta.monthlyEquated.toLocaleString('en-IN')}/mo)`,
      ]);
    }

    details.push(
      ['Payment Date', formatAdmDate(pay.paymentDate)],
      ['Payment Mode', pay.paymentMode.toUpperCase()],
    );

    if (pay.transactionRef && pay.transactionRef !== 'YEARLY-PACKAGE-LUMPSUM') {
      details.push(['Reference / Txn ID', pay.transactionRef]);
    }

    // Proportional vertical layout metrics (calculated before sizing canvas)
    const headerTopY = 40;
    const logoW = 68;
    const logoH = 60; // exact 136:120 aspect ratio
    const headerCenterY = headerTopY + logoH / 2;
    const headerDividerY = headerTopY + logoH + 16;

    const detailsStartY = headerDividerY + 12;
    const rowHeight = 38;
    const detailsEndY = detailsStartY + details.length * rowHeight;

    const amountBoxY = detailsEndY + 14;
    const amountBoxH = 78;

    const stampSectionY = amountBoxY + amountBoxH + 20;
    const stampSize = 78;
    const stampSectionH = stampSize;

    const footerDividerY = stampSectionY + stampSectionH + 20;
    const footerLine1Y = footerDividerY + 20;
    const footerLine2Y = footerDividerY + 36;
    const cardBottomY = footerLine2Y + 22;
    const height = cardBottomY + outerMargin;

    canvas.width = width * scale;
    canvas.height = height * scale;
    const ctx = canvas.getContext('2d');
    if (!ctx) return canvas;

    ctx.scale(scale, scale);

    // Opaque white page/share background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, width, height);

    // Outer Receipt Card with subtle elevation & clean border
    ctx.save();
    drawCanvasRoundRect(ctx, cardX, cardY, cardW, height - outerMargin * 2, 14);
    ctx.shadowColor = 'rgba(15, 23, 42, 0.05)';
    ctx.shadowBlur = 12;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 3;
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();
    ctx.restore();

    drawCanvasRoundRect(ctx, cardX, cardY, cardW, height - outerMargin * 2, 14);
    ctx.lineWidth = 1.25;
    ctx.strokeStyle = '#E2E8F0';
    ctx.stroke();

    // Sleek Top Brand Blue Accent Strip clipped cleanly to rounded top corners
    ctx.save();
    drawCanvasRoundRect(ctx, cardX, cardY, cardW, height - outerMargin * 2, 14);
    ctx.clip();
    ctx.fillStyle = '#2864E8';
    ctx.fillRect(cardX, cardY, cardW, 5);
    ctx.restore();

    const loadCanvasImage = (src: string): Promise<HTMLImageElement | null> =>
      new Promise((resolve) => {
        try {
          const img = new Image();
          let settled = false;
          const done = (result: HTMLImageElement | null) => {
            if (!settled) {
              settled = true;
              resolve(result);
            }
          };
          img.onload = () => done(img.naturalWidth > 0 ? img : null);
          img.onerror = () => done(null);
          img.src = src;
          if (img.complete) {
            done(img.naturalWidth > 0 ? img : null);
          }
        } catch {
          resolve(null);
        }
      });

    const [logoImg, stampImg] = await Promise.all([
      loadCanvasImage(IDL_RECEIPT_LOGO_DATA_URL),
      loadCanvasImage(IDL_PAID_STAMP_DATA_URL),
    ]);

    // Header Left: Original IDL Logo (No "IDL EDUCATION" text, only authentic logo)
    if (logoImg) {
      ctx.drawImage(logoImg, contentLeft, headerTopY, logoW, logoH);
    }

    // Header Title & Branch beside logo, vertically balanced with logo centerline
    const titleX = contentLeft + logoW + 14;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#0F172A';
    ctx.font = 'bold 16px Inter, system-ui, sans-serif';
    ctx.fillText('Official Fee Receipt', titleX, headerCenterY - 10);

    ctx.fillStyle = '#64748B';
    ctx.font = '500 12px Inter, system-ui, sans-serif';
    const branchName = IDL_BRANCHES.find(b => b.id === pay.branchId)?.name || '';
    const branchSubtitle = branchName ? `${branchName} Branch` : 'Delhi Branch';
    ctx.fillText(branchSubtitle, titleX, headerCenterY + 10);

    // Header Right: Receipt Number Pill aligned to header centerline
    const pillW = 158;
    const pillH = 32;
    const pillX = contentRight - pillW;
    const pillY = headerCenterY - pillH / 2;
    drawCanvasRoundRect(ctx, pillX, pillY, pillW, pillH, 8);
    ctx.fillStyle = '#F8FAFC';
    ctx.fill();
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#CBD5E1';
    ctx.stroke();

    ctx.fillStyle = '#1E293B';
    ctx.font = 'bold 11.5px ui-monospace, SFMono-Regular, Menlo, monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(pay.receiptNumber, pillX + pillW / 2, headerCenterY, pillW - 14);

    // Subtle Header Divider
    ctx.strokeStyle = '#E2E8F0';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(contentLeft, headerDividerY);
    ctx.lineTo(contentRight, headerDividerY);
    ctx.stroke();

    // Two-column Student & Payment Details Table
    const leftX = contentLeft + 4;
    const rightX = contentRight - 4;

    details.forEach(([label, value], idx) => {
      const rowCenterY = detailsStartY + idx * rowHeight + rowHeight / 2;

      // Label (Left)
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#64748B';
      ctx.font = '500 12.5px Inter, system-ui, sans-serif';
      ctx.fillText(label, leftX, rowCenterY);

      // Value (Right-aligned along exact same vertical axis)
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#0F172A';
      ctx.font = '600 12.5px Inter, system-ui, sans-serif';
      ctx.fillText(value, rightX, rowCenterY, 270);

      // Clean subtle row divider centered between rows
      if (idx < details.length - 1) {
        const dividerY = detailsStartY + (idx + 1) * rowHeight;
        ctx.strokeStyle = '#EEF2F6';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(leftX, dividerY);
        ctx.lineTo(rightX, dividerY);
        ctx.stroke();
      }
    });

    // Amount Received Confirmation Card
    const amountBoxW = contentRight - contentLeft;
    drawCanvasRoundRect(ctx, contentLeft, amountBoxY, amountBoxW, amountBoxH, 12);
    ctx.fillStyle = '#ECFDF5';
    ctx.fill();
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#A7F3D0';
    ctx.stroke();

    // Left: Payment label + crisp vector verified checkmark status
    const amountLeftX = contentLeft + 18;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#065F46';
    ctx.font = 'bold 11.5px Inter, system-ui, sans-serif';
    ctx.fillText('AMOUNT RECEIVED (PAID)', amountLeftX, amountBoxY + 27);

    // Draw crisp vector checkmark badge (avoids OS emoji inconsistencies in PDFs)
    const badgeCenterX = amountLeftX + 6.5;
    const badgeCenterY = amountBoxY + 51;
    ctx.save();
    ctx.fillStyle = '#059669';
    ctx.beginPath();
    ctx.arc(badgeCenterX, badgeCenterY, 6.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 1.6;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(badgeCenterX - 3.2, badgeCenterY + 0.2);
    ctx.lineTo(badgeCenterX - 0.8, badgeCenterY + 2.6);
    ctx.lineTo(badgeCenterX + 3.4, badgeCenterY - 2.3);
    ctx.stroke();
    ctx.restore();

    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#047857';
    ctx.font = '600 11px Inter, system-ui, sans-serif';
    ctx.fillText('Status: PAYMENT CONFIRMED', amountLeftX + 18, badgeCenterY);

    // Right: Prominent green amount vertically centered in card
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#059669';
    ctx.font = 'bold 23px Inter, system-ui, sans-serif';
    ctx.fillText(`₹${pay.amount.toLocaleString('en-IN')}`, contentRight - 18, amountBoxY + amountBoxH / 2);

    // Authorization & Official Paid Stamp Section (horizontally aligned)
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#334155';
    ctx.font = 'bold 12px Inter, system-ui, sans-serif';
    ctx.fillText('Authorized Collection Desk:', leftX, stampSectionY + 19);

    ctx.fillStyle = '#64748B';
    ctx.font = '500 11px Inter, system-ui, sans-serif';
    ctx.fillText(`${pay.collectedBy || 'Admin Desk'} • IDL Education Portal`, leftX, stampSectionY + 39);
    ctx.fillText(
      `Timestamp: ${pay.createdAt ? formatAdmDate(pay.createdAt.slice(0, 10)) : formatAdmDate(pay.paymentDate)}`,
      leftX,
      stampSectionY + 59
    );

    // Official IDL Education PAID Stamp (Right, aligned flush with content margin & vertically centered)
    if (stampImg) {
      const stampX = rightX - stampSize;
      const stampY = stampSectionY + (stampSectionH - stampSize) / 2;
      ctx.save();
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(stampImg, stampX, stampY, stampSize, stampSize);
      ctx.restore();
    }

    // Bottom Footer Note anchored directly below authorization block (no dead whitespace)
    ctx.strokeStyle = '#E2E8F0';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(contentLeft, footerDividerY);
    ctx.lineTo(contentRight, footerDividerY);
    ctx.stroke();

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#94A3B8';
    ctx.font = '500 10px Inter, system-ui, sans-serif';
    ctx.fillText('This is a computer-generated fee receipt. No physical signature is required.', width / 2, footerLine1Y);
    ctx.fillText('IDL Education • Helpline: 011 45035713 • info@idleducation.in', width / 2, footerLine2Y);

    return canvas;
  };

  // Direct A4 Portrait PDF Download
  const handleDirectPdfPrint = async (pay: FeePayment) => {
    try {
      const stu = students.find(s => s.id === pay.studentId);
      const canvas = await generateReceiptCanvas(pay, stu);
      const imgData = canvas.toDataURL('image/png');

      const { default: jsPDF } = await import('jspdf');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pageWidth = 210;
      const pageHeight = 297;
      const marginX = 14;
      let drawWidth = pageWidth - marginX * 2;
      let drawHeight = (canvas.height * drawWidth) / canvas.width;

      const maxDrawHeight = pageHeight - 24;
      if (drawHeight > maxDrawHeight) {
        drawHeight = maxDrawHeight;
        drawWidth = (canvas.width * drawHeight) / canvas.height;
      }

      const xPos = (pageWidth - drawWidth) / 2;
      const yPos = Math.max(12, Math.round(((pageHeight - drawHeight) * 0.45) * 10) / 10);

      pdf.addImage(imgData, 'PNG', xPos, yPos, drawWidth, drawHeight);
      pdf.save(`${pay.receiptNumber}_${pay.studentName.replace(/\s+/g, '_')}_Fee_Receipt.pdf`);

      toast({
        title: 'PDF Receipt Downloaded',
        description: `${pay.receiptNumber} ka official PDF download ho gaya hai.`,
      });
    } catch (err) {
      console.error('PDF generation error:', err);
      toast({
        variant: 'destructive',
        title: 'PDF Generation Failed',
        description: 'PDF receipt generate nahi ho payi.',
      });
    }
  };

  // Helper to convert dataURL to File synchronously (preserving user gesture for Web Share)
  const dataURLtoFile = (dataurl: string, filename: string): File => {
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/jpeg';
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };

  // Direct Share: opens native system share options (WhatsApp, etc.) with JPG receipt file
  const handleDirectWhatsAppShare = async (pay: FeePayment) => {
    try {
      const stu = students.find(s => s.id === pay.studentId);
      const canvas = await generateReceiptCanvas(pay, stu);
      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      const fileName = `${pay.receiptNumber}_Receipt.jpg`;
      const file = dataURLtoFile(imgData, fileName);

      const studentPhone = stu?.contact1 || stu?.fatherContact || stu?.contact2 || '';
      const cleanPhone = studentPhone.replace(/\D/g, '').slice(-10);
      const clsName = classes.find(c => c.id === pay.classId)?.name || pay.classId || 'Class';

      const messageLines = [
        `*IDL EDUCATION - OFFICIAL FEE RECEIPT* 🎓`,
        `━━━━━━━━━━━━━━━━━━━━`,
        `📄 *Receipt No:* ${pay.receiptNumber}`,
        `👤 *Student Name:* ${pay.studentName}`,
        stu?.rollNumber ? `🔢 *Roll No:* ${stu.rollNumber}` : '',
        `📚 *Class:* ${clsName}`,
        `🗓️ *Billing Month:* ${pay.monthLabel || pay.month}`,
        `📅 *Payment Date:* ${formatAdmDate(pay.paymentDate)}`,
        `💳 *Payment Mode:* ${pay.paymentMode.toUpperCase()}${pay.transactionRef ? ` (${pay.transactionRef})` : ''}`,
        `💰 *Amount Paid:* ₹${pay.amount.toLocaleString('en-IN')}`,
        `✅ *Status:* PAID`,
        `━━━━━━━━━━━━━━━━━━━━`,
        `Dhanyawad! IDL Education 🙏`,
      ].filter(Boolean).join('\n');

      // 1. Check for Web Share API (Direct Native Share sheet)
      if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
        // Pass ONLY the image file so that clicking "Copy" or sharing copies ONLY the single image (no text, no link)
        if (typeof navigator.canShare === 'function' && navigator.canShare({ files: [file] })) {
          try {
            await navigator.share({
              files: [file],
            });
            return;
          } catch (shareErr: any) {
            if (shareErr?.name === 'AbortError') {
              // User closed the share sheet intentionally, do nothing
              return;
            }
            console.warn('Native file share failed, using fallback:', shareErr);
          }
        }
      }

      // 2. Fallback: ONLY when native share is unsupported (e.g. desktop browser without Web Share)
      const waUrl = cleanPhone && cleanPhone.length === 10
        ? `https://wa.me/91${cleanPhone}?text=${encodeURIComponent(messageLines)}`
        : `https://wa.me/?text=${encodeURIComponent(messageLines)}`;

      window.open(waUrl, '_blank');
    } catch (err) {
      console.error('Share error:', err);
      toast({
        variant: 'destructive',
        title: 'Share Failed',
        description: 'Receipt share karne me samasya aayi.',
      });
    }
  };

  // View Receipt modal popup
  const handleViewReceipt = (pay: FeePayment) => {
    setRecentReceipt(pay);
    setIsReceiptOpen(true);
  };

  // Print Receipt directly via clean isolated A4 print frame
  const handlePrintReceipt = async (pay: FeePayment) => {
    try {
      const stu = students.find(s => s.id === pay.studentId);
      const canvas = await generateReceiptCanvas(pay, stu);
      const imgData = canvas.toDataURL('image/png');

      const iframe = document.createElement('iframe');
      iframe.style.position = 'fixed';
      iframe.style.right = '0';
      iframe.style.bottom = '0';
      iframe.style.width = '0';
      iframe.style.height = '0';
      iframe.style.border = '0';
      document.body.appendChild(iframe);

      const doc = iframe.contentWindow?.document;
      if (!doc || !iframe.contentWindow) {
        if (document.body.contains(iframe)) document.body.removeChild(iframe);
        return;
      }

      doc.open();
      doc.write(
        '<!DOCTYPE html><html><head><style>@page{size:A4 portrait;margin:12mm;}html,body{margin:0;padding:0;background:#ffffff;display:flex;align-items:center;justify-content:center;min-height:100vh;}img{width:100%;max-width:182mm;height:auto;display:block;}</style></head><body></body></html>'
      );
      doc.close();
      doc.title = `${pay.receiptNumber} - Official Fee Receipt`;

      const printImg = doc.createElement('img');
      printImg.alt = 'Official Fee Receipt';
      printImg.src = imgData;
      doc.body.appendChild(printImg);

      const cleanup = () => {
        if (document.body.contains(iframe)) {
          document.body.removeChild(iframe);
        }
      };

      const triggerPrint = () => {
        setTimeout(() => {
          if (!iframe.contentWindow) return;
          iframe.contentWindow.onafterprint = cleanup;
          iframe.contentWindow.focus();
          iframe.contentWindow.print();
          setTimeout(cleanup, 60000);
        }, 80);
      };

      if (!printImg.complete) {
        printImg.onload = triggerPrint;
      } else {
        triggerPrint();
      }
    } catch (err) {
      console.error('Print receipt error:', err);
      toast({
        variant: 'destructive',
        title: 'Print Failed',
        description: 'Receipt print karne me samasya aayi.',
      });
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
    if (!hasBranchSelection) {
      setYearlyReport(null);
      setIsLoadingYearly(false);
      return;
    }
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
  }, [activeTab, branchReportMode, hasBranchSelection]);

  // Students excluded for current month
  const excludedStudentsForMonth = React.useMemo(() => {
    if (!hasBranchSelection) return [];
    return students.filter(s => {
      if (selectedBranch !== 'all' && !branchIdsMatch(s.branchId, selectedBranch)) return false;
      return s.excludedMonths?.includes(selectedMonth);
    });
  }, [students, selectedBranch, selectedMonth, hasBranchSelection]);

  // Open Create Class Modal (pre-fills branch if a single branch is active in toolbar)
  const openCreateClassModal = () => {
    const defaultBranchId = isBranchAdmin && branchAdminBranchId
      ? branchAdminBranchId
      : (selectedBranch && selectedBranch !== 'all' && selectedBranch !== 'none' ? selectedBranch : '');
    setClassForm({
      ...EMPTY_CLASS_FORM,
      branchId: defaultBranchId,
      academicSession: '2026-27',
    });
    setIsClassModalOpen(true);
  };

  // Open Create Student Modal with clean defaults and dynamic watermarks
  const openCreateStudentModal = () => {
    setIsCustomRollNumber(false);
    const defaultBranchId = isBranchAdmin && branchAdminBranchId
      ? branchAdminBranchId
      : (selectedBranch && selectedBranch !== 'all' && selectedBranch !== 'none' ? selectedBranch : '');
    const branchClasses = defaultBranchId
      ? classes.filter(c => branchIdsMatch(c.branchId, defaultBranchId) || c.branchId === 'all')
      : [];
    const autoClass = branchClasses.length === 1 ? branchClasses[0] : undefined;
    const classBatches = autoClass ? batches.filter(b => b.classId === autoClass.id) : [];
    const autoBatch = classBatches.length === 1 ? classBatches[0] : undefined;
    const autoMonthlyFee = autoBatch?.monthlyFee || autoClass?.defaultMonthlyFee || 0;
    const autoYearlyFee = autoBatch?.courseFee || (autoMonthlyFee * 12);

    setStudentForm({
      ...EMPTY_STUDENT_FORM,
      branchId: defaultBranchId,
      classId: autoClass?.id || '',
      batchId: autoBatch?.id || '',
      baseFee: autoMonthlyFee,
      yearlyStandardFee: autoYearlyFee,
      totalYearlyFee: autoYearlyFee,
      subjects: autoBatch?.subjects ? [...autoBatch.subjects] : [],
    });
    setEnrollStudentSubjectTab('enrolled');
    setShowEnrollAddSubjectInput(false);
    setNewEnrollAddlSubjectName('');
    setNewEnrollAddlSubjectFee('');
    setIsStudentModalOpen(true);
  };

  // Open Create Batch Modal with clean defaults (auto-selects class if only 1 exists)
  const openCreateBatchModal = (initialClassId?: string) => {
    const available = filteredClasses.length > 0 ? filteredClasses : classes;
    const targetClassId = initialClassId || (available.length === 1 ? available[0].id : (classes.length === 1 ? classes[0].id : ''));
    const matchedClass = classes.find(c => c.id === targetClassId);
    const defaultBranch = matchedClass?.branchId
      || (isBranchAdmin && branchAdminBranchId ? branchAdminBranchId : '')
      || (selectedBranch && selectedBranch !== 'all' && selectedBranch !== 'none' ? selectedBranch : '');
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

  // Handle student delete option choice (month_only vs all_months)
  const handleDeleteStudentChoice = async (mode: 'month_only' | 'all_months') => {
    if (!studentDeleteModal.student) return;
    const student = studentDeleteModal.student;
    const month = selectedMonth;
    setStudentDeleteModal({ isOpen: false, student: null, source: 'students' });

    startTransition(async () => {
      try {
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
      } catch (err: any) {
        toast({ variant: 'destructive', title: 'Error', description: err?.message || 'Failed to delete student' });
      }
    });
  };

  // Restore student to month handler
  const handleRestoreStudent = async (studentId: string, month: string) => {
    startTransition(async () => {
      try {
        const res = await restoreStudentToMonth(studentId, month);
        if (res.success) {
          toast({ title: 'Student Restored', description: res.message });
          refreshAllData();
        } else {
          toast({ variant: 'destructive', title: 'Error', description: res.message });
        }
      } catch (err: any) {
        toast({ variant: 'destructive', title: 'Error', description: err?.message || 'Failed to restore student' });
      }
    });
  };

  // Filtered classes matching active branch selection, arranged by order number
  const filteredClasses = React.useMemo(() => {
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

  // Filtered batches for student directory filter (respects selected branch & class filter)
  const availableBatchesForStudentFilter = React.useMemo(() => {
    if (!hasBranchSelection) return [];
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
  }, [batches, selectedBranch, classFilter, classes, hasBranchSelection]);

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
      const pure = dueDateStr.trim().split('T')[0].replace(/\//g, '-');
      const parts = pure.split('-');
      if (parts.length !== 3) return 0;

      let year: number;
      let month: number;
      let day: number;
      if (parts[0].length === 4) {
        year = Number(parts[0]);
        month = Number(parts[1]) - 1;
        day = Number(parts[2]);
      } else if (parts[2].length === 4) {
        day = Number(parts[0]);
        month = Number(parts[1]) - 1;
        year = Number(parts[2]);
      } else {
        return 0;
      }

      if (
        !Number.isInteger(year) ||
        !Number.isInteger(month) ||
        !Number.isInteger(day) ||
        year < 1900 ||
        month < 0 ||
        month > 11 ||
        day < 1 ||
        day > 31
      ) {
        return 0;
      }

      const dueDate = new Date(year, month, day);
      if (
        dueDate.getFullYear() !== year ||
        dueDate.getMonth() !== month ||
        dueDate.getDate() !== day
      ) {
        return 0;
      }

      const today = new Date();
      const todayUtc = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
      const dueUtc = Date.UTC(year, month, day);
      return Math.max(0, Math.floor((todayUtc - dueUtc) / 86400000));
    } catch {
      return 0;
    }
  };

  /** Renders the compact two-line rose Overdue days indicator used beside Due Dates. */
  const renderOverdueDaysBadge = (days: number, marginClass = 'ml-2') => (
    <div className={`inline-flex flex-col items-start justify-center font-sans leading-none text-rose-600 dark:text-rose-400 shrink-0 ${marginClass}`}>
      <span className="flex items-baseline gap-0.5 leading-none">
        <strong className="font-bold text-[10.5px] tabular-nums leading-none">{days}</strong>
        <span className="text-[8px] font-medium leading-none">{days === 1 ? 'day' : 'days'}</span>
      </span>
      <span className="text-[8px] font-semibold leading-none mt-0.5">
        Overdue
      </span>
    </div>
  );

  const cleanSubjectLabel = (sub: string) =>
    (sub || '').replace(/Socil\s*Studies/gi, 'Social Studies').replace(/Socil/gi, 'Social');

  /** Updates discount rupee amount, percentage, and yearly net total consistently across student forms. */
  const applyScholarshipDiscountUpdate = <T extends {
    feeType: 'monthly' | 'course_onetime' | 'yearly_package';
    baseFee: number;
    yearlyStandardFee?: number;
    totalYearlyFee?: number;
    yearlyCourseMonths?: number;
    discountAmount?: number;
    scholarshipPercent: number;
  }>(prev: T, val: number): T => {
    const cMonths = prev.yearlyCourseMonths || 12;
    if (prev.feeType === 'yearly_package') {
      const yearlyStd = prev.yearlyStandardFee || ((prev.baseFee || 0) * cMonths);
      const cappedDisc = Math.min(yearlyStd, Math.max(0, val));
      const pct = yearlyStd > 0 ? Number(((cappedDisc / yearlyStd) * 100).toFixed(1)) : 0;
      const net = Math.max(0, yearlyStd - cappedDisc);
      const monthlyDisc = Math.round(cappedDisc / cMonths);
      return {
        ...prev,
        yearlyStandardFee: yearlyStd,
        totalYearlyFee: net,
        scholarshipPercent: pct,
        discountAmount: monthlyDisc,
      };
    }
    const base = Number(prev.baseFee || 0);
    const cappedDisc = Math.min(base, Math.max(0, val));
    const pct = base > 0 ? Number(((cappedDisc / base) * 100).toFixed(1)) : 0;
    const yearlyStd = prev.yearlyStandardFee || (base * cMonths);
    const totalYr = Math.max(0, yearlyStd - (cappedDisc * cMonths));
    return {
      ...prev,
      discountAmount: cappedDisc,
      scholarshipPercent: pct,
      totalYearlyFee: totalYr,
    };
  };

  /** Shared Fee Breakdown card used by both Enroll New Student and Edit Student Details (fixed read-only Net Payable Fee). */
  const renderStudentFeeBreakdownCard = <T extends {
    feeType: 'monthly' | 'course_onetime' | 'yearly_package';
    baseFee: number;
    yearlyStandardFee?: number;
    totalYearlyFee?: number;
    yearlyCourseMonths?: number;
    scholarshipPercent: number;
    discountAmount?: number;
    additionalSubjects?: AdditionalSubject[];
  }>({
    form,
    previewDiscount: discPreview,
    previewNetFee: netPreview,
    addlFee,
    onToggleFeeType,
    onDiscountAmountChange,
  }: {
    form: T;
    previewDiscount: number;
    previewNetFee: number;
    addlFee: number;
    onToggleFeeType: (mode: 'monthly' | 'yearly_package') => void;
    onDiscountAmountChange: (amount: number) => void;
  }) => {
    const isYearly = form.feeType === 'yearly_package';
    const cMonths = form.yearlyCourseMonths || 12;
    const stdFee = isYearly
      ? (form.yearlyStandardFee || (form.baseFee > 0 ? form.baseFee * cMonths : 0))
      : (form.baseFee || 0);
    const activeAddlCount = (form.additionalSubjects || []).filter(s => s.status !== 'removed').length;

    return (
      <div className="p-3 rounded-xl bg-slate-50/50 dark:bg-slate-900/30 border border-slate-100 dark:border-slate-800/80 space-y-1.5 text-xs">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            FEE BREAKDOWN
          </span>

          <div className="flex items-center gap-1.5 text-[10px] font-medium tracking-wider uppercase">
            <button
              type="button"
              onClick={() => onToggleFeeType('monthly')}
              className={`transition-colors cursor-pointer ${!isYearly
                ? 'text-slate-700 dark:text-slate-200 font-semibold'
                : 'text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300'
                }`}
            >
              Monthly Fee
            </button>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <button
              type="button"
              onClick={() => onToggleFeeType('yearly_package')}
              className={`transition-colors cursor-pointer ${isYearly
                ? 'text-slate-700 dark:text-slate-200 font-semibold'
                : 'text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300'
                }`}
            >
              Yearly Package
            </button>
          </div>
        </div>

        <div className="space-y-1 pt-0.5 text-xs">
          {/* Standard Fee: Fixed from batch/class, non-editable */}
          <div className="flex justify-between items-center text-slate-500 dark:text-slate-400">
            <span className="font-normal text-[12px]">Standard Fee:</span>
            <span className="font-medium text-slate-700 dark:text-slate-200 font-mono text-[12px] tabular-nums">
              ₹{Number(stdFee).toLocaleString('en-IN')}
              <span className="text-[10px] text-slate-400 font-normal ml-0.5">
                {isYearly ? '/yr' : '/mo'}
              </span>
            </span>
          </div>

          {/* Scholarship: Percentage is non-editable, only discount amount (₹) is editable */}
          <div className="flex justify-between items-center text-slate-500 dark:text-slate-400">
            <span className="font-normal text-[12px]">Scholarship:</span>
            <div className="flex items-center justify-end font-medium text-emerald-600 dark:text-emerald-400 font-mono text-[12px] tabular-nums">
              <span>{form.scholarshipPercent || 0}%</span>
              <span className="ml-1 mr-0.5 text-emerald-600 dark:text-emerald-400">(-₹</span>
              <input
                type="text"
                inputMode="numeric"
                placeholder="0"
                title="Enter scholarship discount amount in ₹"
                value={discPreview ? discPreview : ""}
                onChange={e => {
                  const rawVal = e.target.value.replace(/[^0-9]/g, "");
                  onDiscountAmountChange(rawVal === "" ? 0 : Number(rawVal));
                }}
                style={{ width: `${Math.max(2, String(discPreview || "").length)}ch` }}
                className="bg-transparent border-0 border-b border-transparent hover:border-emerald-300 focus:border-emerald-500 focus:outline-none focus:ring-0 p-0 m-0 font-medium text-emerald-600 dark:text-emerald-400 font-mono text-[12px] text-right transition-colors"
              />
              <span className="text-emerald-600 dark:text-emerald-400">)</span>
            </div>
          </div>

          {/* Additional Subjects Fee (if any) */}
          {addlFee > 0 && (
            <div className="flex justify-between items-center text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1.5 text-[12px]">
                <span className="font-normal text-[12px]">Additional Subjects:</span>
                <span className="text-[9.5px] text-violet-600 dark:text-violet-400 font-medium bg-violet-50/80 dark:bg-violet-950/40 border border-violet-200/50 dark:border-violet-800/40 px-1.5 py-0.2 rounded">
                  {activeAddlCount} subj
                </span>
              </span>
              <span className="font-medium text-violet-600 dark:text-violet-400 font-mono text-[12px] tabular-nums">
                +₹{Number(isYearly ? addlFee * cMonths : addlFee).toLocaleString('en-IN')}
                <span className="text-[10px] text-slate-400 font-normal ml-0.5">
                  {isYearly ? '/yr' : '/mo'}
                </span>
              </span>
            </div>
          )}
        </div>

        {/* Net Payable Fee: Auto-computed, fixed and non-editable */}
        <div className="flex justify-between items-baseline pt-1.5 border-t border-slate-100 dark:border-slate-800">
          <span className="font-semibold text-slate-900 dark:text-white text-[12.5px] tracking-tight">Net Payable Fee:</span>
          <span
            data-testid="net-payable-fee-value"
            className="text-[#2864E8] font-bold text-[16px] font-mono tracking-tight tabular-nums select-none"
          >
            ₹{Number(netPreview || 0).toLocaleString('en-IN')}
            <span className="text-[11px] font-normal text-slate-400 dark:text-slate-500 ml-0.5">
              {isYearly ? '/year' : '/month'}
            </span>
          </span>
        </div>
      </div>
    );
  };

  /** Shared Enrolled & Additional Subjects tab bar + content used by Enroll and Edit Student modals. */
  const renderStudentSubjectsTabs = ({
    activeTab,
    onTabChange,
    showAddInput,
    onToggleAddInput,
    batchId,
    enrolledSubjects,
    onToggleEnrolledSubject,
    emptyEnrolledText,
    additionalSubjects,
    onRemoveAdditionalSubject,
    newAddlName,
    onNewAddlNameChange,
    newAddlFee,
    onNewAddlFeeChange,
    onAddAdditionalSubject,
  }: {
    activeTab: 'enrolled' | 'additional';
    onTabChange: (tab: 'enrolled' | 'additional') => void;
    showAddInput: boolean;
    onToggleAddInput: () => void;
    batchId: string;
    enrolledSubjects: string[];
    onToggleEnrolledSubject: (sub: string) => void;
    emptyEnrolledText: string;
    additionalSubjects: AdditionalSubject[];
    onRemoveAdditionalSubject: (id: string) => void;
    newAddlName: string;
    onNewAddlNameChange: (val: string) => void;
    newAddlFee: string;
    onNewAddlFeeChange: (val: string) => void;
    onAddAdditionalSubject: () => void;
  }) => {
    const activeAddlCount = additionalSubjects.filter(s => s.status !== 'removed').length;
    const currentBatch = batches.find(b => b.id === batchId);
    const batchSubjects = currentBatch?.subjects && currentBatch.subjects.length > 0
      ? currentBatch.subjects
      : (enrolledSubjects.length > 0 ? enrolledSubjects : []);

    return (
      <div className="py-2 border-b border-slate-100 dark:border-slate-800/70 space-y-1.5 text-xs">
        <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
          <button
            type="button"
            onClick={() => onTabChange('enrolled')}
            className={`text-[10.5px] uppercase font-semibold tracking-wider transition-colors cursor-pointer bg-transparent border-0 p-0 ${activeTab === 'enrolled'
              ? 'text-slate-900 dark:text-white'
              : 'text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300'
              }`}
          >
            ENROLLED SUBJECTS ({enrolledSubjects.length})
          </button>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => onTabChange('additional')}
              className={`text-[10.5px] uppercase font-semibold tracking-wider transition-colors cursor-pointer bg-transparent border-0 p-0 ${activeTab === 'additional'
                ? 'text-slate-900 dark:text-white'
                : 'text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300'
                }`}
            >
              ADDITIONAL SUBJECTS ({activeAddlCount})
            </button>
            <button
              type="button"
              onClick={onToggleAddInput}
              title={showAddInput ? "Hide Add Subject Input" : "Add Additional Subject"}
              aria-label={showAddInput ? "Hide Add Subject Input" : "Add Additional Subject"}
              className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors cursor-pointer bg-transparent ${showAddInput
                ? 'border-[#2864E8] text-[#2864E8]'
                : 'border-slate-200 dark:border-slate-700 hover:border-[#2864E8] text-slate-400 hover:text-[#2864E8]'
                }`}
            >
              <Plus className="w-2.5 h-2.5" />
            </button>
          </div>
        </div>

        {activeTab === 'enrolled' && (
          batchSubjects.length === 0 ? (
            <div className="pt-0.5 text-xs text-slate-400 italic">
              {emptyEnrolledText}
            </div>
          ) : (
            <div className="flex flex-wrap items-center gap-x-3.5 gap-y-1 pt-0.5">
              {batchSubjects.map(sub => {
                const cleanSub = cleanSubjectLabel(sub);
                const active = enrolledSubjects.includes(sub);
                return (
                  <button
                    type="button"
                    key={sub}
                    onClick={() => onToggleEnrolledSubject(sub)}
                    title={active ? `Click to remove ${cleanSub}` : `Click to add ${cleanSub}`}
                    className={`inline-flex items-center gap-1.5 text-[12px] transition-colors cursor-pointer ${active
                      ? "font-medium text-slate-700 dark:text-slate-200"
                      : "font-normal text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
                      }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full shrink-0 transition-colors ${active ? "bg-blue-500/80 dark:bg-blue-400/80" : "bg-slate-200 dark:bg-slate-700"
                        }`}
                    />
                    <span>{cleanSub}</span>
                  </button>
                );
              })}
            </div>
          )
        )}

        {activeTab === 'additional' && (
          <div className="flex flex-wrap items-center gap-x-3.5 gap-y-1.5 pt-0.5">
            {additionalSubjects.length > 0 ? (
              additionalSubjects.map((sub, idx) => {
                const cleanName = cleanSubjectLabel(sub.name);
                const isRemoved = sub.status === 'removed';
                return (
                  <span
                    key={sub.id || idx}
                    className={`inline-flex items-center gap-1 text-[12px] ${isRemoved ? 'line-through text-slate-400 opacity-60' : 'font-medium text-slate-700 dark:text-slate-200'
                      }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500/80 dark:bg-blue-400/80 shrink-0" />
                    <span>{cleanName}</span>
                    <span className={`text-[11px] font-mono tabular-nums ${isRemoved ? 'text-slate-400' : 'text-violet-600 dark:text-violet-400 font-medium'}`}>
                      (+₹{sub.fee})
                    </span>
                    <button
                      type="button"
                      onClick={() => onRemoveAdditionalSubject(sub.id)}
                      className="text-slate-400 hover:text-rose-500 transition-colors cursor-pointer p-0.5 ml-0.5"
                      title={`Delete ${cleanName}`}
                      aria-label={`Remove ${cleanName}`}
                    >
                      <X className="w-2.5 h-2.5" />
                    </button>
                  </span>
                );
              })
            ) : (
              !showAddInput && (
                <div className="text-xs text-slate-400 italic">
                  No additional subjects. Click (+) above to add.
                </div>
              )
            )}

            {showAddInput && (
              <div className="inline-flex items-center gap-1.5">
                <input
                  autoFocus
                  placeholder="Add subject..."
                  value={newAddlName}
                  onChange={e => onNewAddlNameChange(toTitleCase(e.target.value))}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      onAddAdditionalSubject();
                    }
                  }}
                  className="h-[21px] w-[110px] sm:w-[125px] bg-transparent border-0 border-b border-transparent hover:border-slate-300 dark:hover:border-slate-700 focus:border-[#2864E8] dark:focus:border-[#2864E8] focus:outline-none focus:ring-0 text-xs font-medium text-slate-800 dark:text-slate-100 placeholder:text-slate-400 p-0 m-0 transition-colors"
                />
                <div className="inline-flex items-center">
                  <span className="text-slate-400 text-xs font-mono mr-0.5">₹</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="Fee"
                    value={newAddlFee}
                    onChange={e => onNewAddlFeeChange(e.target.value.replace(/[^0-9]/g, ''))}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        onAddAdditionalSubject();
                      }
                    }}
                    className="h-[21px] w-[42px] bg-transparent border-0 border-b border-transparent hover:border-slate-300 dark:hover:border-slate-700 focus:border-[#2864E8] dark:focus:border-[#2864E8] focus:outline-none focus:ring-0 text-xs font-medium text-violet-600 dark:text-violet-400 placeholder:text-slate-400 font-mono p-0 m-0 transition-colors"
                  />
                </div>
                <button
                  type="button"
                  onClick={onAddAdditionalSubject}
                  className="w-4 h-4 rounded-full border border-slate-200 dark:border-slate-700 hover:border-[#2864E8] text-slate-400 hover:text-[#2864E8] flex items-center justify-center transition-colors cursor-pointer shrink-0 bg-transparent"
                  title="Add Subject"
                  aria-label="Confirm Add Subject"
                >
                  <Plus className="w-2.5 h-2.5" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  // Filtered Students (Respects admission date, month exclusions, and month status when in 'month' scope)
  const filteredStudents = students.filter(s => {
    if (!hasBranchSelection) return false;
    if (selectedBranch !== 'all' && !branchIdsMatch(s.branchId, selectedBranch)) return false;
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

  const toolbarControlClass =
    'h-7 px-0.5 py-0.5 bg-transparent hover:bg-transparent border-0 rounded-none shadow-none ring-0 outline-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 text-xs sm:text-[13px] font-semibold text-[#172033] dark:text-slate-100 hover:text-[#2864E8] dark:hover:text-blue-400 inline-flex items-center gap-1.5 transition-colors cursor-pointer shrink-0';

  return (
    <div className="min-h-[calc(100svh-68px)] flex-1 flex flex-col">
      {/* Left-aligned borderless/bg-less Fee Management controls under Main Site Header */}
      <section
        aria-label="Fee management toolbar"
        className="w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border-b border-[#E5EAF2] dark:border-slate-800 md:sticky md:top-[68px] z-40"
      >
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-start flex-wrap gap-4 sm:gap-6 min-w-0">
          {/* 1. Branch Selector */}
          {isBranchAdmin ? (
            <div className="h-7 inline-flex items-center gap-1.5 bg-transparent border-0 text-xs sm:text-[13px] font-semibold text-[#172033] dark:text-slate-100 shrink-0">
              <Building2 className="w-3.5 h-3.5 text-[#2864E8] dark:text-blue-400 shrink-0" />
              <span className="whitespace-nowrap">{user?.branchName || 'Mangol Puri Branch'}</span>
              <span className="text-[11px] font-medium text-[#2864E8] dark:text-blue-400 whitespace-nowrap">
                (Branch Admin)
              </span>
            </div>
          ) : (
              <Popover open={isBranchPickerOpen} onOpenChange={setIsBranchPickerOpen}>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    aria-label="Select branch"
                    className={toolbarControlClass}
                  >
                    <Building2 className="w-3.5 h-3.5 text-[#2864E8] dark:text-blue-400 shrink-0" />
                    <span className="whitespace-nowrap">
                      {!selectedBranch || selectedBranch === 'none'
                        ? 'Select Branch'
                        : selectedBranch === 'all'
                          ? 'All Branches'
                          : IDL_BRANCHES.find(b => b.id === selectedBranch)?.name || 'Select Branch'}
                    </span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 shrink-0 ${isBranchPickerOpen ? 'rotate-180 text-slate-700 dark:text-slate-200' : ''}`}
                    />
                  </button>
                </PopoverTrigger>
                <PopoverContent
                  align="center"
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
            )}

            {/* 2. Date / Month Selector */}
            <Popover
              open={isMonthPickerOpen}
              onOpenChange={(open) => {
                setIsMonthPickerOpen(open);
                if (open) {
                  const parsedYear = parseInt((selectedMonth || initialMonth || '2026-11').split('-')[0], 10);
                  if (!Number.isNaN(parsedYear)) setMonthPickerYear(parsedYear);
                }
              }}
            >
              <PopoverTrigger asChild>
                <button
                  type="button"
                  aria-label="Select billing month and year"
                  className={toolbarControlClass}
                >
                  <Calendar className="w-3.5 h-3.5 text-[#2864E8] dark:text-blue-400 shrink-0" />
                  <span className="whitespace-nowrap">{selectedMonthLabel || 'Select Month'}</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 shrink-0 ${isMonthPickerOpen ? 'rotate-180 text-slate-700 dark:text-slate-200' : ''}`}
                  />
                </button>
              </PopoverTrigger>
              <PopoverContent
                align="center"
                sideOffset={8}
                className="w-[236px] p-2.5 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
              >
                {/* Compact Year Selector */}
                <div className="flex items-center justify-between px-1 pb-2 mb-2 border-b border-slate-100 dark:border-slate-800/80">
                  <button
                    type="button"
                    disabled={monthPickerYear <= minPickerYear}
                    onClick={() => setMonthPickerYear(y => Math.max(minPickerYear, y - 1))}
                    aria-label="Previous year"
                    className="h-6 w-6 rounded-md flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-xs font-bold text-slate-900 dark:text-white tracking-tight tabular-nums select-none">
                    {monthPickerYear}
                  </span>
                  <button
                    type="button"
                    disabled={monthPickerYear >= maxPickerYear}
                    onClick={() => setMonthPickerYear(y => Math.min(maxPickerYear, y + 1))}
                    aria-label="Next year"
                    className="h-6 w-6 rounded-md flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-colors cursor-pointer"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Clean 3x4 Month Grid */}
                <div className="grid grid-cols-3 gap-1">
                  {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((monthName, idx) => {
                    const monthValue = `${monthPickerYear}-${String(idx + 1).padStart(2, '0')}`;
                    const isSelected = selectedMonth === monthValue;
                    const isEnabled = allowedMonthSet.has(monthValue);

                    return (
                      <button
                        key={monthValue}
                        type="button"
                        disabled={!isEnabled}
                        onClick={() => {
                          setSelectedMonth(monthValue);
                          setIsMonthPickerOpen(false);
                        }}
                        className={`h-8 rounded-lg text-xs transition-all flex items-center justify-center select-none ${
                          isSelected
                            ? 'bg-[#2864E8] text-white font-semibold shadow-xs hover:bg-[#1E4ED8] cursor-pointer'
                            : isEnabled
                              ? 'text-slate-700 dark:text-slate-200 font-medium hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-[#2864E8] dark:hover:text-blue-400 cursor-pointer'
                              : 'text-slate-300 dark:text-slate-600 font-normal cursor-not-allowed'
                        }`}
                      >
                        {monthName}
                      </button>
                    );
                  })}
                </div>
              </PopoverContent>
            </Popover>

            {/* 3. Sync Button */}
            <button
              type="button"
              onClick={() => refreshAllData()}
              disabled={isPending}
              className={`${toolbarControlClass} disabled:opacity-50 disabled:cursor-not-allowed`}
              title="Refresh fee data"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-[#2864E8] dark:text-blue-400 shrink-0 ${isPending ? 'animate-spin' : ''}`} />
              <span>Sync</span>
            </button>

            {/* 4. Reset & Restore Folder Group */}
            <Popover
              open={isDataGroupOpen}
              onOpenChange={(open) => {
                setIsDataGroupOpen(open);
                if (open) loadResetBackupStatus();
              }}
            >
              <PopoverTrigger asChild>
                <button
                  type="button"
                  aria-label="Reset and Restore data folder"
                  className={toolbarControlClass}
                  title="Reset & Restore data options"
                >
                  <Folder className="w-3.5 h-3.5 text-[#2864E8] dark:text-blue-400 shrink-0" />
                  <span className="whitespace-nowrap">Reset &amp; Restore</span>
                  {resetBackupStatus.hasBackup && (
                    <span
                      className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"
                      aria-hidden="true"
                    />
                  )}
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 shrink-0 ${isDataGroupOpen ? 'rotate-180 text-slate-700 dark:text-slate-200' : ''}`}
                  />
                </button>
              </PopoverTrigger>
              <PopoverContent
                align="start"
                sideOffset={8}
                className="w-[244px] p-2 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
              >
                <div className="flex items-center justify-between px-2 pt-1 pb-2 mb-1.5 border-b border-slate-100 dark:border-slate-800/80">
                  <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    <Folder className="w-3.5 h-3.5 text-[#2864E8] dark:text-blue-400" />
                    <span>Data Folder</span>
                  </span>
                  {resetBackupStatus.hasBackup && (
                    <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                      Backup Ready
                    </span>
                  )}
                </div>

                <div className="space-y-1">
                  <button
                    type="button"
                    onClick={() => {
                      setIsDataGroupOpen(false);
                      setIsResetConfirmOpen(true);
                    }}
                    className="w-full px-2 py-2 rounded-lg text-left flex items-center gap-2.5 hover:bg-rose-50/80 dark:hover:bg-rose-950/40 transition-colors cursor-pointer group"
                  >
                    <span className="w-7 h-7 rounded-lg bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
                      <Trash2 className="w-3.5 h-3.5" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-xs font-semibold text-slate-800 dark:text-slate-100 group-hover:text-rose-700 dark:group-hover:text-rose-300">
                        Reset Data
                      </span>
                      <span className="block text-[10px] text-slate-500 dark:text-slate-400 truncate">
                        Clear records &amp; auto-save backup
                      </span>
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsDataGroupOpen(false);
                      openRestoreConfirmDialog();
                    }}
                    className="w-full px-2 py-2 rounded-lg text-left flex items-center gap-2.5 hover:bg-emerald-50/80 dark:hover:bg-emerald-950/40 transition-colors cursor-pointer group"
                  >
                    <span
                      className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                        resetBackupStatus.hasBackup
                          ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500'
                      }`}
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-xs font-semibold text-slate-800 dark:text-slate-100 group-hover:text-emerald-700 dark:group-hover:text-emerald-300">
                        Restore Data
                      </span>
                      <span className="block text-[10px] text-slate-500 dark:text-slate-400 truncate">
                        {resetBackupStatus.hasBackup && resetBackupStatus.counts
                          ? `Restore ${resetBackupStatus.counts.classes} classes, ${resetBackupStatus.counts.students} students`
                          : 'No reset backup saved yet'}
                      </span>
                    </span>
                  </button>
                </div>
              </PopoverContent>
            </Popover>
        </div>
      </section>

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
                ₹{Number(stats.totalExpectedFee ?? 0).toLocaleString('en-IN')}
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
                ₹{Number(stats.totalReceivedFee ?? 0).toLocaleString('en-IN')}
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
                ₹{Number(stats.totalPendingFee ?? 0).toLocaleString('en-IN')}
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
                {stats.overdueCount} {stats.overdueCount === 1 ? 'Student' : 'Students'}
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
                  {hasBranchSelection && stats.overdueCount > 0 && (
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
                        TOTAL CLASSES {hasBranchSelection ? filteredClasses.length : 0}
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
                          {!hasBranchSelection ? (
                            <tr>
                              <td colSpan={6} className="py-10 text-center text-slate-400">
                                <Building2 className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-700 mb-2" />
                                <p className="font-semibold text-xs text-slate-600 dark:text-slate-300">No branch selected</p>
                                <p className="text-[11px] text-slate-400 mt-0.5">Please select a branch from the top dropdown to view class-wise fee data.</p>
                              </td>
                            </tr>
                          ) : stats.classBreakdown.length === 0 ? (
                            <tr>
                              <td colSpan={6} className="py-10 text-center text-slate-400">
                                <GraduationCap className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-700 mb-2" />
                                <p className="font-semibold text-xs text-slate-600 dark:text-slate-300">No classes added yet</p>
                                <p className="text-[11px] text-slate-400 mt-0.5">Click + Class above to create classes for this branch.</p>
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
                                    ₹{Number(item.expectedFee ?? 0).toLocaleString('en-IN')}
                                  </td>
                                  <td className="py-3 px-3.5 text-right font-bold text-emerald-600 dark:text-emerald-400 text-[13px] tabular-nums whitespace-nowrap tracking-tight">
                                    ₹{Number(item.receivedFee ?? 0).toLocaleString('en-IN')}
                                  </td>
                                  <td className="py-3 px-3.5 text-right pr-5 font-bold text-amber-600 dark:text-amber-400 text-[13px] tabular-nums whitespace-nowrap tracking-tight">
                                    ₹{Number(item.pendingFee ?? 0).toLocaleString('en-IN')}
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
                {hasBranchSelection && stats.overdueCount > 0 && (
                  <Card className="rounded-xl border border-slate-200/80 dark:border-slate-800 bg-amber-50/20 dark:bg-amber-950/10 shadow-none">
                    <CardHeader className="py-2 px-3.5 sm:px-4 border-b border-slate-200/60 dark:border-slate-800/60">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-amber-500" />
                          <CardTitle className="text-xs sm:text-[13px] font-bold tracking-tight text-slate-800 dark:text-slate-100">
                            Immediate Overdue Attention Required
                          </CardTitle>
                          <span className="ml-1 text-[11px] font-semibold text-rose-600 dark:text-rose-400 tabular-nums">
                            {stats.overdueCount} {stats.overdueCount === 1 ? 'Student' : 'Students'}
                          </span>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setLedgerStatusFilter('OVERDUE');
                            setActiveTab('ledger');
                          }}
                          className="h-6 px-2.5 text-[11px] font-semibold rounded-[5px] border border-slate-200/90 dark:border-slate-700 text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 shadow-none transition-colors cursor-pointer"
                        >
                          View All
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="p-2 sm:p-2.5 space-y-1.5">
                      {(() => {
                        const overdueList = ledger.filter(l => l.isOverdue || l.status === 'OVERDUE');
                        return (
                          <>
                            {overdueList.slice(0, 5).map(item => {
                              const cls = classes.find(c => c.id === item.student.classId);
                              const batch = batches.find(b => b.id === item.student.batchId);
                              const effectiveDueDate = (item.student.feeType === 'yearly_package' || Boolean(item.student.yearlyPackage))
                                ? (item.student.joiningDate || item.dueDate)
                                : item.dueDate;
                              const overdueDays = getOverdueDays(effectiveDueDate);
                              return (
                                <div
                                  key={item.id}
                                  onClick={() => openCollectFeeModal(item)}
                                  className="group flex flex-col sm:flex-row sm:items-center justify-between p-2.5 sm:px-4 sm:py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-rose-100/80 dark:border-rose-950/50 hover:border-rose-200 dark:hover:border-rose-900/80 hover:bg-rose-50/20 dark:hover:bg-rose-950/20 transition-all cursor-pointer shadow-2xs"
                                  title="Click to view details or collect fee"
                                >
                                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4 items-center flex-1 min-w-0">
                                    {/* 1. Student Name & Father Name */}
                                    <div className="sm:col-span-3 min-w-0">
                                      <div className="font-semibold text-slate-900 dark:text-white text-[12.5px] sm:text-[13px] flex items-center gap-1.5 tracking-tight truncate leading-tight group-hover:text-[#2864E8] dark:group-hover:text-blue-400 transition-colors">
                                        <span className="truncate">{item.student.name}</span>
                                        {(item.student.feeType === 'yearly_package' || Boolean(item.student.yearlyPackage)) && (
                                          <span title="Yearly Package Student" className="inline-flex items-center justify-center shrink-0 ml-0.5">
                                            <span className="w-1.5 h-1.5 rounded-full bg-violet-600 dark:bg-violet-400 shadow-[0_0_6px_1px_rgba(139,92,246,0.7)] animate-pulse" />
                                          </span>
                                        )}
                                      </div>
                                      <div className="text-[11px] text-slate-400 dark:text-slate-500 font-normal truncate mt-0.5 leading-tight">
                                        Father : <span className="text-slate-600 dark:text-slate-400 capitalize">{item.student.fatherName || '—'}</span>
                                      </div>
                                    </div>

                                    {/* 2. Class & Batch Typography */}
                                    <div className="sm:col-span-2 min-w-0">
                                      <div className="text-[12px] font-medium text-slate-700 dark:text-slate-200 tracking-tight truncate leading-tight">
                                        {cls?.name || 'Class'}
                                      </div>
                                      <div className="text-[11.5px] font-medium text-slate-500 dark:text-slate-400 tracking-tight truncate mt-0.5 leading-tight">
                                        {batch?.name || 'Batch'}
                                      </div>
                                    </div>

                                    {/* 3. Join Date, Due Date & Overdue Indicator */}
                                    <div className="sm:col-span-5 min-w-0 flex flex-col justify-center space-y-1">
                                      <div className="text-[11.5px] font-normal text-slate-400 dark:text-slate-500 tracking-tight flex items-center leading-none">
                                        <span className="inline-block w-[64px] shrink-0 text-slate-400 dark:text-slate-500">Join Date :</span>
                                        <span className="font-mono font-medium text-slate-600 dark:text-slate-300 tabular-nums">
                                          {formatAdmDate(item.student.joiningDate) !== '—' ? formatAdmDate(item.student.joiningDate) : '01-11-2026'}
                                        </span>
                                      </div>
                                      <div className="text-[11.5px] font-normal tracking-tight flex items-center leading-none">
                                        <span className="inline-block w-[64px] shrink-0 text-rose-600 dark:text-rose-400 font-normal">Due Date :</span>
                                        <span className="font-mono font-medium text-rose-600 dark:text-rose-400 tabular-nums">
                                          {formatAdmDate(effectiveDueDate)}
                                        </span>
                                        {overdueDays > 0 && (
                                          <div className="inline-flex flex-col items-start justify-center leading-none text-rose-600 dark:text-rose-400 shrink-0 ml-2.5">
                                            <span className="flex items-baseline gap-0.5 leading-none">
                                              <strong className="font-bold text-[10.5px] tabular-nums leading-none">{overdueDays}</strong>
                                              <span className="text-[8.5px] font-medium leading-none">{overdueDays === 1 ? 'day' : 'days'}</span>
                                            </span>
                                            <span className="text-[8.5px] font-semibold leading-none mt-0.5">
                                              Overdue
                                            </span>
                                          </div>
                                        )}
                                      </div>
                                    </div>

                                    {/* 4. Overdue Amount */}
                                    <div className="sm:col-span-2 min-w-0 sm:text-right flex sm:flex-col items-center sm:items-end justify-between sm:justify-center pt-1.5 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
                                      <div className="font-bold text-rose-600 dark:text-rose-400 text-[15px] sm:text-[16px] font-mono tabular-nums tracking-tight leading-tight">
                                        ₹{item.balanceAmount.toLocaleString('en-IN')}
                                      </div>
                                      <div className="text-[10px] text-slate-400 dark:text-slate-500 font-medium tracking-tight leading-tight mt-0.5">
                                        Overdue Amount
                                      </div>
                                    </div>
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
                                  View All ({overdueList.length} Overdue {overdueList.length === 1 ? 'Student' : 'Students'}) →
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
                <Card className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-[0_1px_2px_rgba(15,23,42,0.02)]">
                  <CardHeader className="py-2 px-3.5 sm:px-4 border-b border-slate-100 dark:border-slate-800/80">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-[14px] sm:text-[14.5px] font-bold text-slate-900 dark:text-white flex items-center gap-1.5 tracking-tight leading-none">
                        <Receipt className="w-3.5 h-3.5 text-[#2864E8] shrink-0" />
                        <span>Recent Receipts</span>
                      </CardTitle>
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200/40 dark:border-emerald-800/40 text-emerald-700 dark:text-emerald-400 text-[9px] font-semibold uppercase tracking-wider leading-none">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Live
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="p-2.5 sm:p-3 space-y-1.5">
                    {!hasBranchSelection ? (
                      <div className="py-6 text-center text-slate-400 px-2">
                        <Building2 className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-700 mb-2" />
                        <p className="font-semibold text-xs text-slate-600 dark:text-slate-300">No branch selected</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">Select a branch to view recent receipts.</p>
                      </div>
                    ) : stats.recentPayments.length === 0 ? (
                      <div className="py-6 text-center text-slate-400 px-2">
                        <Receipt className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-700 mb-2" />
                        <p className="font-semibold text-xs text-slate-600 dark:text-slate-300">No recent receipts</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">Recent fee payments will appear here.</p>
                      </div>
                    ) : (
                      stats.recentPayments.slice(0, 6).map(pay => (
                        <div
                          key={pay.id}
                          className="px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 shadow-[0_1px_2px_rgba(15,23,42,0.02)] space-y-1"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[12.5px] font-semibold text-slate-900 dark:text-white tracking-tight truncate leading-tight">
                              {pay.studentName}
                            </span>
                            <span className="text-[13px] font-bold text-emerald-600 dark:text-emerald-400 tabular-nums shrink-0 tracking-tight leading-tight">
                              +₹{pay.amount.toLocaleString('en-IN')}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-[10px] text-slate-400 dark:text-slate-500">
                            <span className="font-mono text-[10px] tabular-nums tracking-tight leading-none">{pay.receiptNumber}</span>
                            <span className="text-[8.5px] uppercase font-semibold py-[1px] px-1.5 rounded bg-slate-50 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700 text-slate-600 dark:text-slate-300 leading-tight">
                              {pay.paymentMode}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-[10px] text-slate-400 dark:text-slate-500 pt-0.5">
                            <span className="tabular-nums leading-none">Date: {formatAdmDate(pay.paymentDate)}</span>
                            <div className="flex items-center gap-0.5 -mr-1 -my-0.5">
                              {/* 1. Print Icon -> Opens Receipt View Popup Modal */}
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleViewReceipt(pay);
                                }}
                                title="Print / View Fee Receipt"
                                className="p-1 rounded-md text-slate-400 dark:text-slate-500 hover:text-[#2864E8] dark:hover:text-blue-400 hover:bg-blue-50/80 dark:hover:bg-blue-950/40 transition-colors cursor-pointer"
                              >
                                <Printer className="w-3.5 h-3.5" />
                              </button>

                              {/* 2. Share Icon -> Direct Native Share Options (WhatsApp & Apps) */}
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDirectWhatsAppShare(pay);
                                }}
                                title="Share Receipt (Direct Share Options)"
                                className="p-1 rounded-md text-slate-400 dark:text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50/80 dark:hover:bg-emerald-950/40 transition-colors cursor-pointer"
                              >
                                <Share2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
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
                        className={`flex items-center rounded-full transition-all duration-300 ease-in-out border ${isLedgerSearchOpen || studentSearch
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
                          className={`shrink-0 flex items-center justify-center text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors cursor-pointer ${isLedgerSearchOpen || studentSearch ? 'w-4 h-4' : 'w-7 h-7 rounded-full'
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
                          className={`bg-transparent text-xs text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none transition-all duration-300 ${isLedgerSearchOpen || studentSearch
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
                {hasBranchSelection && excludedStudentsForMonth.length > 0 && (
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
                    <thead className="bg-slate-50/80 dark:bg-slate-900/60 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider text-[10.5px] border-b border-slate-200/70 dark:border-slate-800/80">
                      <tr>
                        <th className="py-2.5 sm:py-3 px-3.5 pl-5 whitespace-nowrap w-[260px] min-w-[260px]">STUDENT NAME & DETAILS</th>
                        <th className="py-2.5 sm:py-3 px-3.5 whitespace-nowrap w-[220px] min-w-[220px]">CLASS/BATCH</th>
                        <th className="py-2.5 sm:py-3 px-3.5 whitespace-nowrap w-[150px] min-w-[150px]">CONTACT</th>
                        <th className="py-2.5 sm:py-3 px-3.5 text-right whitespace-nowrap min-w-[85px]">Total Fee</th>
                        <th className="py-2.5 sm:py-3 px-3.5 text-right whitespace-nowrap min-w-[80px]">Pending</th>
                        <th className="py-2.5 sm:py-3 px-3.5 text-right whitespace-nowrap min-w-[80px]">Received</th>
                        <th className="py-2.5 sm:py-3 px-3.5 text-center whitespace-nowrap w-[110px] min-w-[100px]">Status</th>
                        <th className="py-2.5 sm:py-3 px-3.5 text-right pr-5 whitespace-nowrap min-w-[120px]">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                      {(() => {
                        const filteredLedger = !hasBranchSelection
                          ? []
                          : ledger.filter(entry => {
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
                                {!hasBranchSelection ? (
                                  <>
                                    <Building2 className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-700 mb-2" />
                                    <p className="font-semibold text-xs text-slate-600 dark:text-slate-300">
                                      No branch selected
                                    </p>
                                    <p className="text-[11px] text-slate-400 mt-0.5">
                                      Please select a branch from the top dropdown to view fee collection ledger.
                                    </p>
                                  </>
                                ) : (
                                  <>
                                    <IndianRupee className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-700 mb-2" />
                                    <p className="font-semibold text-xs text-slate-600 dark:text-slate-300">
                                      {ledgerStatusFilter !== 'all' || studentSearch.trim() ? 'No matching records' : 'No fee records found'}
                                    </p>
                                    <p className="text-[11px] text-slate-400 mt-0.5">
                                      {ledgerStatusFilter !== 'all' || studentSearch.trim()
                                        ? 'Try adjusting your status filter or search query.'
                                        : `Enrolled students and fee records for ${monthName} will appear here.`}
                                    </p>
                                  </>
                                )}
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
                          const isYearlyFee = student.feeType === 'yearly_package' || Boolean(student.yearlyPackage);

                          return (
                            <tr
                              key={entry.id}
                              className={`transition-colors duration-150 ${isOver
                                ? 'bg-rose-50/15 hover:bg-rose-50/30 dark:bg-rose-950/10 dark:hover:bg-rose-950/20'
                                : isYearlyFee
                                  ? 'bg-[#FFFBEB] hover:bg-[#FEF3C7]/45 dark:bg-amber-950/15 dark:hover:bg-amber-950/25'
                                  : 'bg-white hover:bg-slate-50/60 dark:bg-slate-900 dark:hover:bg-slate-800/40'
                                }`}
                            >
                              <td className="py-3 px-3.5 pl-5 whitespace-nowrap align-middle">
                                <div className="font-semibold text-slate-900 dark:text-white text-[13.5px] sm:text-[14px] flex items-center gap-1.5 whitespace-nowrap tracking-tight leading-none h-[18px]">
                                  <span>{student.name}</span>
                                </div>
                                <div className="text-[11.5px] text-slate-500 dark:text-slate-400 font-normal whitespace-nowrap mt-1 leading-none h-[16px] flex items-center">
                                  Father : <span className="font-medium text-slate-700 dark:text-slate-300 capitalize ml-1">{student.fatherName || '—'}</span>
                                </div>
                                <div className="text-[11px] text-slate-400 dark:text-slate-500 font-normal whitespace-nowrap mt-1 leading-none h-[16px] flex items-center">
                                  Admission No. : <span className="font-mono font-medium text-slate-600 dark:text-slate-400 ml-1">{student.rollNumber || student.id}</span>
                                </div>
                              </td>
                              <td className="py-3 px-3.5 whitespace-nowrap align-middle">
                                <div className="flex items-center gap-1 font-medium text-slate-700 dark:text-slate-200 text-[13px] whitespace-nowrap tracking-tight leading-none h-[18px]">
                                  <span>{cls?.name || 'Class'}</span>
                                  {batch?.name && (
                                    <>
                                      <span className="inline-block w-px h-3 bg-slate-200 dark:bg-slate-700 mx-1.5 shrink-0" aria-hidden="true" />
                                      <span className="font-medium text-slate-700 dark:text-slate-200">{batch.name}</span>
                                    </>
                                  )}
                                </div>
                                <div className="text-[11.5px] text-slate-400 dark:text-slate-500 font-normal whitespace-nowrap mt-1 leading-none h-[16px] flex items-center">
                                  <span className="inline-block w-[64px] shrink-0">Join Date :</span>
                                  <span className="font-mono font-medium text-slate-600 dark:text-slate-400 tabular-nums w-[72px] shrink-0">
                                    {formatAdmDate(student.joiningDate)}
                                  </span>
                                </div>
                                {(() => {
                                  const effectiveDueDate = (student.feeType === 'yearly_package' || Boolean(student.yearlyPackage))
                                    ? (student.joiningDate || entry.dueDate)
                                    : entry.dueDate;
                                  const overdueDays = isOver ? getOverdueDays(effectiveDueDate) : 0;
                                  return (
                                    <div className={`text-[11.5px] font-normal whitespace-nowrap mt-1 leading-none h-[16px] flex items-center ${isOver ? "text-rose-600 dark:text-rose-400" : "text-slate-400 dark:text-slate-500"
                                      }`}>
                                      <span className="inline-block w-[64px] shrink-0">Due Date :</span>
                                      <span className={`font-mono font-medium tabular-nums w-[72px] shrink-0 ${isOver ? "text-rose-600 dark:text-rose-400" : "text-slate-600 dark:text-slate-400"
                                        }`}>
                                        {formatAdmDate(effectiveDueDate)}
                                      </span>
                                      {isOver && overdueDays > 0 && (
                                        <span className="inline-flex flex-col items-start justify-center leading-none text-rose-600 dark:text-rose-400 shrink-0 ml-2">
                                          <span className="flex items-baseline gap-0.5 leading-none">
                                            <span className="font-bold text-[10.5px] tabular-nums leading-none">{overdueDays}</span>
                                            <span className="text-[8px] font-medium leading-none">{overdueDays === 1 ? 'day' : 'days'}</span>
                                          </span>
                                          <span className="text-[8px] font-semibold leading-none mt-0.5">
                                            Overdue
                                          </span>
                                        </span>
                                      )}
                                    </div>
                                  );
                                })()}
                              </td>
                              <td className="py-3 px-3.5 whitespace-nowrap align-middle">
                                {/* 1. Father Contact (Primary) */}
                                <div className="font-medium text-slate-700 dark:text-slate-300 text-[13px] font-mono tabular-nums whitespace-nowrap tracking-tight leading-none h-[18px] flex items-center" title="Father Contact">
                                  {student.fatherContact || student.contact1 || '—'}
                                </div>

                                {/* 2. Mother Contact (Smaller text) */}
                                {(student.motherContact || (student.contact2 && student.contact2 !== student.fatherContact && student.contact2 !== student.contact1)) ? (
                                  <div className="text-[11px] text-slate-400 dark:text-slate-500 font-mono tabular-nums whitespace-nowrap mt-1 leading-none h-[16px] flex items-center" title="Mother Contact">
                                    {student.motherContact || student.contact2}
                                  </div>
                                ) : null}

                                {/* 3. Student Contact (Smaller text) */}
                                {student.contact1 && student.contact1 !== student.fatherContact ? (
                                  <div className="text-[11px] text-slate-400 dark:text-slate-500 font-mono tabular-nums whitespace-nowrap mt-1 leading-none h-[16px] flex items-center" title="Student Contact">
                                    {student.contact1}
                                  </div>
                                ) : null}
                              </td>
                              <td className="py-3 px-3.5 text-right whitespace-nowrap align-middle">
                                <div className="font-medium text-slate-900 dark:text-white text-[13.5px] font-mono tabular-nums tracking-tight whitespace-nowrap leading-none h-[18px] flex items-center justify-end">
                                  ₹{Number(entry.netDueAmount ?? 0).toLocaleString('en-IN')}
                                </div>
                                {Number(entry.carriedForwardDue ?? 0) > 0 ? (
                                  <div className="text-[10px] text-amber-700 dark:text-amber-300 font-medium bg-amber-50/80 dark:bg-amber-950/40 rounded px-1.5 py-0.5 inline-block border border-amber-200/60 mt-1 whitespace-nowrap tabular-nums leading-none">
                                    Fee: ₹{Number((entry.baseAmount ?? 0) - (entry.discountAmount ?? 0)).toLocaleString('en-IN')} + Prev Due: ₹{Number(entry.carriedForwardDue ?? 0).toLocaleString('en-IN')}
                                  </div>
                                ) : null}
                              </td>
                              <td className="py-3 px-3.5 text-right whitespace-nowrap align-middle">
                                <div className="font-medium text-[13.5px] font-mono tabular-nums tracking-tight whitespace-nowrap leading-none h-[18px] flex items-center justify-end">
                                  <span
                                    className={
                                      Number(entry.balanceAmount ?? 0) <= 0
                                        ? 'text-slate-400 dark:text-slate-500'
                                        : isOver
                                          ? 'text-rose-600 dark:text-rose-400'
                                          : 'text-amber-600 dark:text-amber-400'
                                    }
                                  >
                                    ₹{Number(entry.balanceAmount ?? 0).toLocaleString('en-IN')}
                                  </span>
                                </div>
                              </td>
                              <td className="py-3 px-3.5 text-right whitespace-nowrap align-middle">
                                <div className="font-medium text-emerald-600 dark:text-emerald-400 text-[13.5px] font-mono tabular-nums tracking-tight whitespace-nowrap leading-none h-[18px] flex items-center justify-end">
                                  ₹{Number(entry.paidAmount ?? 0).toLocaleString('en-IN')}
                                </div>
                                {(() => {
                                  const isYearly = student.feeType === 'yearly_package' || Boolean(student.yearlyPackage);
                                  const collectionDate = entry.lastPaymentDate || (isYearly ? student.joiningDate : null);
                                  if (!collectionDate || entry.paidAmount <= 0) return null;
                                  return (
                                    <div className="text-[10px] text-slate-400 dark:text-slate-500 font-mono font-normal mt-1 tabular-nums whitespace-nowrap text-right leading-none h-[16px] flex items-center justify-end" title={`Fee collection date: ${formatAdmDate(collectionDate)}`}>
                                      {formatAdmDate(collectionDate)}
                                    </div>
                                  );
                                })()}
                              </td>
                              <td className="py-3 px-3.5 text-center whitespace-nowrap align-middle">
                                <div className="flex flex-col items-center justify-center gap-1">
                                  <span
                                    className={`h-[28px] min-w-[78px] px-2.5 inline-flex items-center justify-center text-[11px] font-semibold tracking-wider rounded-md whitespace-nowrap uppercase ${entry.status === 'PAID'
                                      ? 'bg-emerald-50/80 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200/70 dark:border-emerald-800/40'
                                      : entry.status === 'PARTIAL'
                                        ? 'bg-amber-50/80 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border border-amber-200/70 dark:border-amber-800/40'
                                        : entry.status === 'OVERDUE'
                                          ? 'bg-rose-50/80 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 border border-rose-200/70 dark:border-rose-800/40'
                                          : entry.status === 'ADVANCE'
                                            ? 'bg-blue-50/80 dark:bg-blue-950/30 text-[#2864E8] dark:text-blue-400 border border-blue-200/70 dark:border-blue-800/40'
                                            : 'bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700'
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
                                      className="h-[34px] min-w-[88px] px-2.5 rounded-[5px] border border-rose-200/80 dark:border-rose-900/40 bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400 hover:bg-rose-50/80 dark:hover:bg-rose-950/30 hover:border-rose-300 text-[11px] font-semibold tracking-wider uppercase shadow-none whitespace-nowrap flex items-center justify-center cursor-pointer transition-colors"
                                      title="Fee Receipt"
                                    >
                                      FEE RECEIPT
                                    </button>
                                  ) : (
                                    <div className="flex items-center justify-end gap-1.5 flex-nowrap">
                                      <Button
                                        size="sm"
                                        onClick={() => openCollectFeeModal(entry)}
                                        className="h-[34px] min-w-[88px] px-2.5 rounded-[5px] text-[11px] font-semibold tracking-wider uppercase bg-[#2864E8] hover:bg-[#1E4ED8] text-white shadow-none whitespace-nowrap flex items-center justify-center cursor-pointer transition-colors"
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
            {!hasBranchSelection ? (
              <div className="w-full h-40 sm:h-48 flex flex-col items-center justify-center rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 text-center px-4">
                <Building2 className="w-8 h-8 text-slate-300 dark:text-slate-700 mb-2" />
                <p className="font-semibold text-xs text-slate-600 dark:text-slate-300">No branch selected</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Please select a branch from the top dropdown to view classes and batches.</p>
              </div>
            ) : filteredClasses.length === 0 ? (
              <div className="w-full h-40 sm:h-48 flex flex-col items-center justify-center rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 text-center px-4">
                <School className="w-8 h-8 text-slate-300 dark:text-slate-700 mb-2" />
                <p className="font-semibold text-xs text-slate-600 dark:text-slate-300">No classes added yet</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Click + Class above to create classes and batches for this branch.</p>
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
                                        className={`text-[12px] transition-colors cursor-pointer shrink-0 whitespace-nowrap bg-transparent p-0 ${isActive
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
                              className="py-5 px-3 rounded-xl text-center cursor-pointer transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-800/40 border border-slate-100 dark:border-slate-800/80"
                            >
                              <Layers className="w-7 h-7 mx-auto text-slate-300 dark:text-slate-700 mb-1.5" />
                              <p className="font-semibold text-xs text-slate-600 dark:text-slate-300">No batches added yet</p>
                              <p className="text-[11px] text-slate-400 mt-0.5">Click + above to create a batch for this class.</p>
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
                      STUDENT DIRECTORY ({hasBranchSelection ? filteredStudents.length : 0})
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
                        className={`flex items-center rounded-full transition-all duration-300 ease-in-out border ${isStudentSearchOpen || studentSearch
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
                          className={`shrink-0 flex items-center justify-center text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors cursor-pointer ${isStudentSearchOpen || studentSearch ? 'w-4 h-4' : 'w-7 h-7 rounded-full'
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
                          className={`text-xs bg-transparent border-none outline-none focus:outline-none focus:ring-0 text-slate-800 dark:text-white placeholder:text-slate-400 transition-all duration-300 ${isStudentSearchOpen || studentSearch ? 'w-full ml-1.5 opacity-100' : 'w-0 ml-0 opacity-0 pointer-events-none'
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
                {hasBranchSelection && excludedStudentsForMonth.length > 0 && (
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
                    <thead className="bg-slate-50/80 dark:bg-slate-900/60 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider text-[10.5px] border-b border-slate-200/70 dark:border-slate-800/80">
                      <tr>
                        <th className="py-2.5 sm:py-3 px-3.5 pl-5 whitespace-nowrap w-[260px] min-w-[260px]">STUDENT NAME & DETAILS</th>
                        <th className="py-2.5 sm:py-3 px-3.5 whitespace-nowrap w-[220px] min-w-[220px]">CLASS/BATCH</th>
                        <th className="py-2.5 sm:py-3 px-3.5 whitespace-nowrap w-[150px] min-w-[150px]">CONTACT</th>
                        <th className="py-2.5 sm:py-3 px-3.5 text-right whitespace-nowrap min-w-[140px]">MONTHLY FEE</th>
                        <th className="py-2.5 sm:py-3 px-3.5 text-center whitespace-nowrap w-[110px] min-w-[100px]">STATUS</th>
                        <th className="py-2.5 sm:py-3 px-3.5 text-right pr-5 whitespace-nowrap min-w-[85px]">ACTIONS</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                      {filteredStudents.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-12 text-center text-slate-400">
                            {!hasBranchSelection ? (
                              <>
                                <Building2 className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-700 mb-2" />
                                <p className="font-semibold text-xs text-slate-600 dark:text-slate-300">No branch selected</p>
                                <p className="text-[11px] text-slate-400 mt-0.5 max-w-sm mx-auto">
                                  Please select a branch from the top dropdown to view student directory.
                                </p>
                              </>
                            ) : (
                              <>
                                <Users className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-700 mb-2" />
                                <p className="font-semibold text-xs text-slate-600 dark:text-slate-300">
                                  {classFilter !== 'all' || batchFilter !== 'all' || statusFilter !== 'all' || studentSearch.trim()
                                    ? 'No matching students'
                                    : 'No students enrolled yet'}
                                </p>
                                <p className="text-[11px] text-slate-400 mt-0.5">
                                  {classFilter !== 'all' || batchFilter !== 'all' || statusFilter !== 'all' || studentSearch.trim()
                                    ? 'Try adjusting your class, batch, status or search filter.'
                                    : 'Click + Student above to enroll students in this branch.'}
                                </p>
                              </>
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
                          const isYearlyFee = student.feeType === 'yearly_package' || Boolean(student.yearlyPackage);
                          const genderLabel = student.gender
                            ? student.gender.charAt(0).toUpperCase() + student.gender.slice(1).toLowerCase()
                            : '';

                          return (
                            <tr
                              key={student.id}
                              className={`transition-colors duration-150 ${isOver
                                ? 'bg-rose-50/15 hover:bg-rose-50/30 dark:bg-rose-950/10 dark:hover:bg-rose-950/20'
                                : isYearlyFee
                                  ? 'bg-[#FFFBEB] hover:bg-[#FEF3C7]/45 dark:bg-amber-950/15 dark:hover:bg-amber-950/25'
                                  : 'bg-white hover:bg-slate-50/60 dark:bg-slate-900 dark:hover:bg-slate-800/40'
                                }`}
                            >
                              <td className="py-3 px-3.5 pl-5 whitespace-nowrap align-middle">
                                <div className="font-semibold text-slate-900 dark:text-white text-[13.5px] sm:text-[14px] flex items-center gap-1.5 whitespace-nowrap tracking-tight leading-none h-[18px]">
                                  <span>{student.name}</span>
                                </div>
                                <div className="text-[11.5px] text-slate-500 dark:text-slate-400 font-normal whitespace-nowrap mt-1 leading-none h-[16px] flex items-center">
                                  Father : <span className="font-medium text-slate-700 dark:text-slate-300 capitalize ml-1">{student.fatherName || '—'}</span>
                                </div>
                                <div className="text-[11px] text-slate-400 dark:text-slate-500 font-normal whitespace-nowrap mt-1 leading-none h-[16px] flex items-center">
                                  Admission No. : <span className="font-mono font-medium text-slate-600 dark:text-slate-400 ml-1">{student.rollNumber || student.id}</span>
                                </div>
                              </td>
                              <td className="py-3 px-3.5 whitespace-nowrap align-middle">
                                <div className="flex items-center gap-1 font-medium text-slate-700 dark:text-slate-200 text-[13px] whitespace-nowrap tracking-tight leading-none h-[18px]">
                                  <span>{cls?.name || 'Class'}</span>
                                  {batch?.name && (
                                    <>
                                      <span className="inline-block w-px h-3 bg-slate-200 dark:bg-slate-700 mx-1.5 shrink-0" aria-hidden="true" />
                                      <span className="font-medium text-slate-700 dark:text-slate-200">{batch.name}</span>
                                    </>
                                  )}
                                </div>
                                <div className="text-[11.5px] text-slate-400 dark:text-slate-500 font-normal whitespace-nowrap mt-1 leading-none h-[16px] flex items-center">
                                  <span className="inline-block w-[64px] shrink-0">Join Date :</span>
                                  <span className="font-mono font-medium text-slate-600 dark:text-slate-400 tabular-nums w-[72px] shrink-0">
                                    {formatAdmDate(student.joiningDate)}
                                  </span>
                                </div>
                                {(() => {
                                  const effectiveDueDate = (student.feeType === 'yearly_package' || Boolean(student.yearlyPackage))
                                    ? (student.joiningDate || dueDateStr)
                                    : dueDateStr;
                                  const overdueDays = isOver ? getOverdueDays(effectiveDueDate) : 0;
                                  return (
                                    <div className={`text-[11.5px] font-normal whitespace-nowrap mt-1 leading-none h-[16px] flex items-center ${isOver ? "text-rose-600 dark:text-rose-400" : "text-slate-400 dark:text-slate-500"
                                      }`}>
                                      <span className="inline-block w-[64px] shrink-0">Due Date :</span>
                                      <span className={`font-mono font-medium tabular-nums w-[72px] shrink-0 ${isOver ? "text-rose-600 dark:text-rose-400" : "text-slate-600 dark:text-slate-400"
                                        }`}>
                                        {formatAdmDate(effectiveDueDate)}
                                      </span>
                                      {isOver && overdueDays > 0 && (
                                        <span className="inline-flex flex-col items-start justify-center leading-none text-rose-600 dark:text-rose-400 shrink-0 ml-2">
                                          <span className="flex items-baseline gap-0.5 leading-none">
                                            <span className="font-bold text-[10.5px] tabular-nums leading-none">{overdueDays}</span>
                                            <span className="text-[8px] font-medium leading-none">{overdueDays === 1 ? 'day' : 'days'}</span>
                                          </span>
                                          <span className="text-[8px] font-semibold leading-none mt-0.5">
                                            Overdue
                                          </span>
                                        </span>
                                      )}
                                    </div>
                                  );
                                })()}
                              </td>
                              <td className="py-3 px-3.5 whitespace-nowrap align-middle">
                                {/* 1. Father Contact (Primary) */}
                                <div className="font-medium text-slate-700 dark:text-slate-300 text-[13px] font-mono tabular-nums whitespace-nowrap tracking-tight leading-none h-[18px] flex items-center" title="Father Contact">
                                  {student.fatherContact || student.contact1 || '—'}
                                </div>

                                {/* 2. Mother Contact (Smaller text) */}
                                {(student.motherContact || (student.contact2 && student.contact2 !== student.fatherContact && student.contact2 !== student.contact1)) ? (
                                  <div className="text-[11px] text-slate-400 dark:text-slate-500 font-mono tabular-nums whitespace-nowrap mt-1 leading-none h-[16px] flex items-center" title="Mother Contact">
                                    {student.motherContact || student.contact2}
                                  </div>
                                ) : null}

                                {/* 3. Student Contact (Smaller text) */}
                                {student.contact1 && student.contact1 !== student.fatherContact ? (
                                  <div className="text-[11px] text-slate-400 dark:text-slate-500 font-mono tabular-nums whitespace-nowrap mt-1 leading-none h-[16px] flex items-center" title="Student Contact">
                                    {student.contact1}
                                  </div>
                                ) : null}
                              </td>
                              <td className="py-3 px-3.5 text-right whitespace-nowrap align-middle">
                                <div className="font-medium text-slate-900 dark:text-white text-[13.5px] font-mono tabular-nums tracking-tight whitespace-nowrap leading-none h-[18px] flex items-center justify-end">
                                  <span>₹{Number(student.netFee ?? student.baseFee ?? 0).toLocaleString('en-IN')}</span>
                                  <span className="text-[10.5px] text-slate-400 dark:text-slate-500 font-normal ml-0.5">/mo</span>
                                </div>
                                {Boolean((student.scholarshipPercent && student.scholarshipPercent > 0) || (student.discountAmount && student.discountAmount > 0)) && (
                                  <div className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 mt-1 tabular-nums whitespace-nowrap leading-none h-[16px] flex items-center justify-end">
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
                                      className="text-[11px] font-medium text-violet-600 dark:text-violet-400 mt-1 cursor-help tabular-nums whitespace-nowrap leading-none h-[16px] flex items-center justify-end"
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
                                    className={`h-[28px] min-w-[78px] px-2.5 inline-flex items-center justify-center text-[11px] font-semibold tracking-wider rounded-md whitespace-nowrap uppercase ${sStatus === 'active'
                                      ? 'bg-emerald-50/80 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200/70 dark:border-emerald-800/40'
                                      : 'bg-amber-50/80 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border border-amber-200/70 dark:border-amber-800/40'
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
                                    className="h-[28px] min-w-[78px] px-2.5 inline-flex items-center justify-center gap-1.5 text-[11px] font-semibold tracking-wider rounded-md border border-slate-200/80 dark:border-slate-700/80 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:text-[#2864E8] dark:hover:text-blue-400 hover:border-[#2864E8]/50 hover:bg-blue-50/40 dark:hover:bg-slate-800 transition-colors cursor-pointer uppercase shadow-none"
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
                        className={`h-7 flex items-center gap-1.5 px-1.5 text-xs transition-colors cursor-pointer bg-transparent border-0 shadow-none focus:outline-none focus:ring-0 ${branchReportMode === 'monthly'
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
                        className={`h-7 flex items-center gap-1.5 px-1.5 text-xs transition-colors cursor-pointer bg-transparent border-0 shadow-none focus:outline-none focus:ring-0 ${branchReportMode === 'yearly'
                          ? 'text-[#2864E8] font-bold'
                          : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white font-medium'
                          }`}
                      >
                        <BarChart3 className={`w-3.5 h-3.5 ${branchReportMode === 'yearly' ? 'text-[#2864E8]' : 'text-slate-400'}`} />
                        <span>Yearly</span>
                      </button>
                    </div>
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
                    {!hasBranchSelection ? (
                      <div className="py-12 text-center text-slate-400 px-4">
                        <Building2 className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-700 mb-2" />
                        <p className="font-semibold text-xs text-slate-600 dark:text-slate-300">No branch selected</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">Please select a branch from the top dropdown to view monthly financial reports.</p>
                      </div>
                    ) : selectedBranch === 'all' ? (
                      (stats.branchBreakdown.length === 0 || (stats.totalStudents === 0 && stats.totalExpectedFee === 0 && stats.totalReceivedFee === 0 && classes.length === 0)) ? (
                        <div className="py-12 text-center text-slate-400 px-4">
                          <BarChart3 className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-700 mb-2" />
                          <p className="font-semibold text-xs text-slate-600 dark:text-slate-300">No report data available</p>
                          <p className="text-[11px] text-slate-400 mt-0.5">Add classes and students to view the monthly branch report.</p>
                        </div>
                      ) : (
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
                                    <span className={`text-[12px] font-bold tabular-nums ${rate >= 75
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
                      )
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

                          if ((curBranch?.studentCount || 0) === 0 && (curBranch?.expectedFee || 0) === 0 && (curBranch?.receivedFee || 0) === 0 && branchClasses.length === 0) {
                            return (
                              <div className="py-10 text-center text-slate-400">
                                <BarChart3 className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-700 mb-2" />
                                <p className="font-semibold text-xs text-slate-600 dark:text-slate-300">No report data available</p>
                                <p className="text-[11px] text-slate-400 mt-0.5">Add classes and students to view the monthly report for this branch.</p>
                              </div>
                            );
                          }

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
                                        <td colSpan={4} className="py-10 text-center text-slate-400">
                                          <GraduationCap className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-700 mb-2" />
                                          <p className="font-semibold text-xs text-slate-600 dark:text-slate-300">No classes added yet</p>
                                          <p className="text-[11px] text-slate-400 mt-0.5">Click + Class above to create classes for this branch.</p>
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
                    {!hasBranchSelection ? (
                      <div className="py-12 text-center text-slate-400 px-4">
                        <Building2 className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-700 mb-2" />
                        <p className="font-semibold text-xs text-slate-600 dark:text-slate-300">No branch selected</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">Please select a branch from the top dropdown to view yearly financial reports.</p>
                      </div>
                    ) : isLoadingYearly ? (
                      <div className="p-12 text-center text-xs font-semibold text-slate-500 flex items-center justify-center gap-2">
                        <RefreshCw className="w-4 h-4 animate-spin text-[#2864E8]" />
                        <span>Loading Yearly Academic Session Data...</span>
                      </div>
                    ) : selectedBranch === 'all' ? (
                      /* Case C: All Branches Yearly Comparison */
                      (!yearlyReport || yearlyReport.branches.length === 0 || (yearlyReport.totals.activeStudents === 0 && yearlyReport.totals.annualExpected === 0 && yearlyReport.totals.annualReceived === 0)) ? (
                        <div className="py-12 text-center text-slate-400 px-4">
                          <BarChart3 className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-700 mb-2" />
                          <p className="font-semibold text-xs text-slate-600 dark:text-slate-300">No yearly data available</p>
                          <p className="text-[11px] text-slate-400 mt-0.5">Enroll students or record payments to view the annual session report.</p>
                        </div>
                      ) : (
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
                                  <span className={`text-[12px] font-bold tabular-nums ${b.annualRate >= 75
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
                      )
                    ) : (
                      /* Case D: Particular Branch Selected -> Month-by-Month Trend for Full Year */
                      <div className="p-5 space-y-6">
                        {(() => {
                          const curBranchYearly = yearlyReport?.branches.find(
                            b => b.branchId === selectedBranch ||
                              (selectedBranch === 'mangolpuri' && b.branchId === 'mangol-puri') ||
                              (selectedBranch === 'mangol-puri' && b.branchId === 'mangolpuri')
                          );

                          if (!curBranchYearly || (curBranchYearly.activeStudents === 0 && curBranchYearly.annualExpected === 0 && curBranchYearly.annualReceived === 0)) {
                            return (
                              <div className="py-10 text-center text-slate-400">
                                <BarChart3 className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-700 mb-2" />
                                <p className="font-semibold text-xs text-slate-600 dark:text-slate-300">No yearly data available</p>
                                <p className="text-[11px] text-slate-400 mt-0.5">Enroll students or record payments to view the yearly report for this branch.</p>
                              </div>
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
                                          <span className={`text-[12px] font-bold tabular-nums ${m.rate >= 75
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
          <DialogContent className={FORM_CARD_DIALOG_CLS}>
            <DialogHeader className={FORM_CARD_HEADER_CLS}>
              <div>
                <DialogTitle className={FORM_CARD_TITLE_CLS}>
                  Create Academic Class
                </DialogTitle>
                <DialogDescription className={FORM_CARD_DESC_CLS}>
                  Define a new academic class and assign it to a branch.
                </DialogDescription>
              </div>
            </DialogHeader>

            <form onSubmit={handleCreateClass} className="space-y-3 pt-1" autoComplete="off">
              {/* Row 1: Class Name & Class Division */}
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

              {/* Row 2: Branch & Academic Session */}
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

                <div className="space-y-1.5">
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
              <div className="space-y-1.5">
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

              <DialogFooter className="pt-2">
                <Button
                  type="submit"
                  disabled={isPending}
                  className={FORM_CARD_SUBMIT_BTN_CLS}
                >
                  <span>CREATE CLASS</span>
                  <ArrowRight className="w-3.5 h-3.5 text-white/90 group-hover:translate-x-0.5 transition-transform duration-150 shrink-0" />
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* -------------------------------------------------------------------- */}
        {/* MODAL 2: CREATE BATCH (Restyled to match Contact Us Design System) */}
        {/* -------------------------------------------------------------------- */}
        <Dialog open={isBatchModalOpen} onOpenChange={setIsBatchModalOpen}>
          <DialogContent className={`${FORM_CARD_DIALOG_CLS} max-h-[90dvh] overflow-y-auto`}>
            <DialogHeader className={FORM_CARD_HEADER_CLS}>
              <div>
                <DialogTitle className={FORM_CARD_TITLE_CLS}>
                  Create Academic Batch
                </DialogTitle>
                <DialogDescription className={FORM_CARD_DESC_CLS}>
                  Define a new academic batch, schedule, and fee structure.
                </DialogDescription>
              </div>
            </DialogHeader>

            <form onSubmit={handleCreateBatch} className="space-y-3 pt-1" autoComplete="off">
              {/* Row 1: Branch & Class */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className={FORM_CARD_LABEL_CLS}>
                    Branch <span className="text-slate-400 dark:text-slate-500 font-normal">*</span>
                  </Label>
                  <Select
                    value={batchForm.branchId || undefined}
                    onValueChange={val => {
                      const branchClasses = classes.filter(c => branchIdsMatch(c.branchId, val));
                      const nextClass =
                        branchClasses.length === 1
                          ? branchClasses[0]
                          : branchClasses.find(c => c.id === batchForm.classId);
                      setBatchForm(prev => ({
                        ...prev,
                        branchId: val,
                        classId: nextClass ? nextClass.id : '',
                        monthlyFee: prev.monthlyFee || nextClass?.defaultMonthlyFee || 0,
                        courseFee: prev.courseFee || ((prev.monthlyFee || nextClass?.defaultMonthlyFee || 0) * 12),
                      }));
                    }}
                  >
                    <SelectTrigger className={FORM_CARD_SELECT_TRIGGER_CLS}>
                      <SelectValue placeholder="Select branch" />
                    </SelectTrigger>
                    <SelectContent className={FORM_CARD_SELECT_CONTENT_CLS}>
                      {IDL_BRANCHES.filter(b => b.id !== 'all' && (!isBranchAdmin || branchIdsMatch(b.id, branchAdminBranchId))).map(b => (
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
                        courseFee: prev.courseFee || ((prev.monthlyFee || matchedClass?.defaultMonthlyFee || 0) * 12),
                      }));
                    }}
                  >
                    <SelectTrigger className={FORM_CARD_SELECT_TRIGGER_CLS}>
                      <SelectValue placeholder="Select class" />
                    </SelectTrigger>
                    <SelectContent className={FORM_CARD_SELECT_CONTENT_CLS}>
                      {(() => {
                        const allAvailable = classes.length > 0 ? classes : filteredClasses;
                        const branchScoped =
                          batchForm.branchId && batchForm.branchId !== 'all'
                            ? allAvailable.filter(c => branchIdsMatch(c.branchId, batchForm.branchId))
                            : allAvailable;
                        const listToRender = branchScoped.length > 0 ? branchScoped : allAvailable;
                        return listToRender.map(c => {
                          const brLabel = IDL_BRANCHES.find(b => branchIdsMatch(b.id, c.branchId))?.name.replace(' Branch', '');
                          return (
                            <SelectItem
                              key={c.id}
                              value={c.id}
                              className={FORM_CARD_SELECT_ITEM_CLS}
                            >
                              {(!batchForm.branchId || batchForm.branchId === 'all' || branchScoped.length === 0) && brLabel
                                ? `${c.name} (${brLabel})`
                                : c.name}
                            </SelectItem>
                          );
                        });
                      })()}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Row 1B: Batch Name */}
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

              {/* Row 2: Batch Start Date & Batch End Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
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

                <div className="space-y-1.5">
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
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

                <div className="space-y-1.5">
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className={FORM_CARD_LABEL_CLS}>
                    Batch Monthly Fee (₹)
                  </Label>
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
                  <Label className={FORM_CARD_LABEL_CLS}>
                    Batch Yearly Fee (₹)
                  </Label>
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

              {/* Row 5: Subjects */}
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
                <Button
                  type="submit"
                  disabled={isSubmittingBatch || isPending}
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
                className="group w-full h-9 !rounded-[5px] text-xs font-semibold uppercase tracking-wider bg-[#2864E8] hover:bg-[#1E4ED8] active:bg-[#1842BE] text-white shadow-[0_1px_2px_rgba(15,23,42,0.08)] transition-all flex items-center justify-center gap-1.5 cursor-pointer mt-1 sm:mt-1.5"
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
        <Dialog open={isStudentModalOpen} onOpenChange={open => {
          if (!open) {
            setIsStudentModalOpen(false);
            setShowEnrollAddSubjectInput(false);
          }
        }}>
          <DialogContent
            onOpenAutoFocus={(e) => e.preventDefault()}
            className={STUDENT_MODAL_DIALOG_CLS}
          >
            <form onSubmit={handleCreateStudent} noValidate className="flex flex-col flex-1 min-h-0 overflow-hidden text-left" autoComplete="off">
              {/* Header: Student Full Name Title + Compact Auto-Sized ID, Join Date & Due Date */}
              <DialogHeader className="pb-2.5 border-b border-slate-100 dark:border-slate-800/80 shrink-0">
                <div>
                  <DialogTitle className="text-[16px] sm:text-[17px] font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5 leading-snug pr-8">
                    <span className="sr-only">Enroll New Student</span>
                    <input
                      type="text"
                      aria-label="Student Full Name"
                      placeholder="Student Full Name"
                      value={studentForm.name}
                      onChange={e => setStudentForm({ ...studentForm, name: toTitleCase(e.target.value) })}
                      required
                      className="text-[16px] sm:text-[17px] font-bold tracking-tight text-slate-900 dark:text-white bg-transparent border-0 border-b border-transparent hover:border-slate-300 dark:hover:border-slate-700 focus:border-[#2864E8] p-0 m-0 focus:outline-none focus:ring-0 leading-snug w-full placeholder:text-slate-400/90 dark:placeholder:text-slate-500 selection:bg-[#2864E8]/20 transition-colors"
                    />
                    {studentForm.feeType === 'yearly_package' && (
                      <span title="Yearly Package Student" className="inline-flex items-center justify-center shrink-0 ml-1">
                        <span className="w-2 h-2 rounded-full bg-violet-600 dark:bg-violet-400 shadow-[0_0_7px_2px_rgba(139,92,246,0.75)] animate-pulse" />
                      </span>
                    )}
                  </DialogTitle>
                  <div className="text-[11.5px] text-slate-500 font-mono mt-1.5 flex items-center flex-wrap gap-x-1.5 gap-y-1">
                    <span className="inline-flex items-center gap-1 whitespace-nowrap shrink-0">
                      <span className="text-[10px] uppercase tracking-wider font-medium text-slate-400 dark:text-slate-500 shrink-0">ID:</span>
                      <span className="inline-grid items-center">
                        <span aria-hidden="true" className="invisible col-start-1 row-start-1 whitespace-pre font-mono font-medium uppercase text-[11.5px] pointer-events-none select-none min-w-[4ch]">
                          {studentForm.rollNumber || studentIdWatermark}
                        </span>
                        <input
                          type="text"
                          size={1}
                          placeholder={studentIdWatermark}
                          value={studentForm.rollNumber || ""}
                          onChange={e => {
                            setIsCustomRollNumber(true);
                            setStudentForm({ ...studentForm, rollNumber: e.target.value });
                          }}
                          className="col-start-1 row-start-1 w-full min-w-0 font-medium text-slate-700 dark:text-slate-200 placeholder:text-slate-500/90 dark:placeholder:text-slate-400 placeholder:font-medium bg-transparent border-0 border-b border-transparent hover:border-slate-300 focus:border-[#2864E8] focus:outline-none p-0 m-0 font-mono uppercase cursor-text selection:bg-[#2864E8]/20 text-[11.5px]"
                        />
                      </span>
                    </span>
                    <span className="text-slate-300 dark:text-slate-700 shrink-0 select-none">•</span>
                    <span className="inline-flex items-center gap-1 whitespace-nowrap shrink-0">
                      <span className="text-[10px] uppercase tracking-wider font-medium text-slate-400 dark:text-slate-500 shrink-0">JOIN:</span>
                      <span className="inline-grid items-center">
                        <span aria-hidden="true" className="invisible col-start-1 row-start-1 whitespace-pre font-mono font-medium text-[11.5px] pointer-events-none select-none tabular-nums">
                          {studentForm.joiningDate || todayDateWatermark}
                        </span>
                        <input
                          type="text"
                          size={1}
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
                          className="col-start-1 row-start-1 w-full min-w-0 font-medium tabular-nums text-slate-700 dark:text-slate-300 placeholder:text-slate-500/90 dark:placeholder:text-slate-400 placeholder:font-medium bg-transparent border-0 border-b border-transparent hover:border-slate-300 focus:border-[#2864E8] focus:outline-none p-0 m-0 font-mono cursor-text selection:bg-[#2864E8]/20 text-[11.5px]"
                        />
                      </span>
                    </span>
                    <span className="text-slate-300 dark:text-slate-700 shrink-0 select-none">•</span>
                    <span className="inline-flex items-center gap-1 whitespace-nowrap shrink-0">
                      <span className="text-[10px] uppercase tracking-wider font-medium text-slate-400 dark:text-slate-500 shrink-0">DUE:</span>
                      <span className="inline-grid items-center">
                        <span aria-hidden="true" className="invisible col-start-1 row-start-1 whitespace-pre font-mono font-medium text-[11.5px] pointer-events-none select-none tabular-nums">
                          {studentForm.dueDate || defaultDueDateWatermark}
                        </span>
                        <input
                          type="text"
                          size={1}
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
                          className="col-start-1 row-start-1 w-full min-w-0 font-medium tabular-nums text-slate-700 dark:text-slate-300 placeholder:text-slate-500/90 dark:placeholder:text-slate-400 placeholder:font-medium bg-transparent border-0 border-b border-transparent hover:border-slate-300 focus:border-[#2864E8] focus:outline-none p-0 m-0 font-mono cursor-text selection:bg-[#2864E8]/20 text-[11.5px]"
                        />
                      </span>
                    </span>
                  </div>
                </div>
              </DialogHeader>

              <div className="flex-1 overflow-y-auto pr-1 pb-1 space-y-2.5 pt-2">
                {/* Personal Information Grid (1:1 Match with Profile View / Edit Student Details) */}
                <div className="py-2 border-b border-slate-100 dark:border-slate-800/80 space-y-2 text-xs">
                  {/* Row 1: Father / Guardian Name, Date of Birth, Gender */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-4 gap-y-1.5">
                    <div>
                      <span className={STUDENT_MODAL_LABEL_CLS}>
                        Father / Guardian Name
                      </span>
                      <input
                        placeholder="Father Name"
                        value={studentForm.fatherName}
                        onChange={e => setStudentForm({ ...studentForm, fatherName: toTitleCase(e.target.value) })}
                        className={STUDENT_MODAL_INPUT_CLS}
                      />
                    </div>

                    <div>
                      <span className={STUDENT_MODAL_LABEL_CLS}>
                        Date of Birth
                      </span>
                      <input
                        type="text"
                        inputMode="numeric"
                        placeholder="DD-MM-YYYY"
                        value={studentForm.dob || ""}
                        onChange={e => {
                          const formatted = handleDateTyping(e.target.value, studentForm.dob);
                          setStudentForm({ ...studentForm, dob: formatted });
                        }}
                        onBlur={e => {
                          const normalized = normalizeDateBlur(e.target.value);
                          setStudentForm({ ...studentForm, dob: normalized });
                        }}
                        className={STUDENT_MODAL_MONO_INPUT_CLS}
                      />
                    </div>

                    <div>
                      <span className={STUDENT_MODAL_LABEL_CLS}>
                        Gender
                      </span>
                      <Select
                        value={studentForm.gender || ""}
                        onValueChange={(val: any) => setStudentForm({ ...studentForm, gender: val })}
                      >
                        <SelectTrigger className={STUDENT_MODAL_SELECT_CLS}>
                          <SelectValue placeholder="Gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male" className="text-xs">Male</SelectItem>
                          <SelectItem value="female" className="text-xs">Female</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Row 2: Primary Contact, Secondary Contact, Emergency Contact */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-4 gap-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800/60">
                    <div>
                      <span className={STUDENT_MODAL_LABEL_CLS}>
                        Primary Contact
                      </span>
                      <input
                        type="tel"
                        maxLength={10}
                        placeholder="Primary Phone"
                        value={studentForm.fatherContact || ""}
                        onChange={e => setStudentForm({ ...studentForm, fatherContact: e.target.value.replace(/\D/g, "") })}
                        className={STUDENT_MODAL_MONO_INPUT_CLS}
                      />
                    </div>

                    <div>
                      <span className={STUDENT_MODAL_LABEL_CLS}>
                        Secondary Contact
                      </span>
                      <input
                        type="tel"
                        maxLength={10}
                        placeholder="Secondary Phone"
                        value={studentForm.motherContact || ""}
                        onChange={e => {
                          const digits = e.target.value.replace(/\D/g, "");
                          setStudentForm({ ...studentForm, motherContact: digits, contact2: digits });
                        }}
                        className={STUDENT_MODAL_MONO_INPUT_CLS}
                      />
                    </div>

                    <div>
                      <span className={STUDENT_MODAL_LABEL_CLS}>
                        Emergency Contact
                      </span>
                      <input
                        type="tel"
                        maxLength={10}
                        placeholder="Emergency Phone"
                        value={studentForm.contact1}
                        onChange={e => setStudentForm({ ...studentForm, contact1: e.target.value.replace(/\D/g, "") })}
                        className={STUDENT_MODAL_MONO_INPUT_CLS}
                      />
                    </div>
                  </div>

                  {/* Row 3: Residential Address */}
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800/60">
                    <span className={STUDENT_MODAL_LABEL_CLS}>
                      Residential Address
                    </span>
                    <input
                      placeholder="Residential Address"
                      value={studentForm.address}
                      onChange={e => setStudentForm({ ...studentForm, address: toTitleCase(e.target.value) })}
                      className={`${STUDENT_MODAL_INPUT_CLS} leading-snug`}
                    />
                  </div>

                  {/* Row 4: Branch, Class, Batch */}
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800/60 grid grid-cols-1 sm:grid-cols-3 gap-x-4 gap-y-1.5">
                    <div>
                      <span className={STUDENT_MODAL_LABEL_CLS}>
                        Branch
                      </span>
                      <Select
                        value={studentForm.branchId}
                        onValueChange={val => {
                          const branchClasses = classes.filter(c => branchIdsMatch(c.branchId, val) || c.branchId === "all");
                          const autoClass = branchClasses.length === 1 ? branchClasses[0] : undefined;
                          const classBatches = autoClass ? batches.filter(b => b.classId === autoClass.id) : [];
                          const autoBatch = classBatches.length === 1 ? classBatches[0] : undefined;
                          const actualMonthlyFee = autoBatch?.monthlyFee || autoClass?.defaultMonthlyFee || 0;
                          setStudentForm(prev => {
                            const cMonths = prev.yearlyCourseMonths || 12;
                            const actualYearlyFee = autoBatch?.courseFee || (actualMonthlyFee * cMonths);
                            return {
                              ...prev,
                              branchId: val,
                              classId: autoClass?.id || "",
                              batchId: autoBatch?.id || "",
                              baseFee: actualMonthlyFee,
                              yearlyStandardFee: actualYearlyFee,
                              totalYearlyFee: actualYearlyFee,
                              discountAmount: 0,
                              scholarshipPercent: 0,
                              subjects: autoBatch?.subjects ? [...autoBatch.subjects] : [],
                            };
                          });
                        }}
                      >
                        <SelectTrigger className={STUDENT_MODAL_SELECT_CLS}>
                          <SelectValue placeholder="Branch" />
                        </SelectTrigger>
                        <SelectContent>
                          {IDL_BRANCHES.filter(b => b.id !== "all" && (!isBranchAdmin || branchIdsMatch(b.id, branchAdminBranchId))).map(b => (
                            <SelectItem key={b.id} value={b.id} className="text-xs">{b.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <span className={STUDENT_MODAL_LABEL_CLS}>
                        Class
                      </span>
                      <Select
                        value={studentForm.classId}
                        onValueChange={val => {
                          const c = classes.find(item => item.id === val);
                          const classBatches = batches.filter(b => b.classId === val);
                          const autoBatch = classBatches.length === 1 ? classBatches[0] : undefined;
                          const clsFee = autoBatch?.monthlyFee || c?.defaultMonthlyFee || 0;
                          setStudentForm(prev => {
                            const cMonths = prev.yearlyCourseMonths || 12;
                            const actualYearlyFee = autoBatch?.courseFee || (clsFee * cMonths);
                            return {
                              ...prev,
                              classId: val,
                              branchId: prev.branchId || (c?.branchId && c.branchId !== 'all' ? c.branchId : prev.branchId),
                              batchId: autoBatch?.id || "",
                              baseFee: clsFee,
                              yearlyStandardFee: actualYearlyFee,
                              totalYearlyFee: actualYearlyFee,
                              discountAmount: 0,
                              scholarshipPercent: 0,
                              subjects: autoBatch?.subjects ? [...autoBatch.subjects] : [],
                            };
                          });
                        }}
                      >
                        <SelectTrigger className={STUDENT_MODAL_SELECT_CLS}>
                          <SelectValue placeholder="Class" />
                        </SelectTrigger>
                        <SelectContent>
                          {classes
                            .filter(c => !studentForm.branchId || branchIdsMatch(c.branchId, studentForm.branchId) || c.branchId === "all")
                            .map(c => {
                              const brLabel = IDL_BRANCHES.find(b => branchIdsMatch(b.id, c.branchId))?.name.replace(' Branch', '');
                              return (
                                <SelectItem key={c.id} value={c.id} className="text-xs">
                                  {!studentForm.branchId && brLabel ? `${c.name} (${brLabel})` : c.name}
                                </SelectItem>
                              );
                            })}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <span className={STUDENT_MODAL_LABEL_CLS}>
                        Batch
                      </span>
                      <Select
                        value={studentForm.batchId}
                        onValueChange={val => {
                          const b = batches.find(item => item.id === val);
                          const c = classes.find(item => item.id === studentForm.classId);
                          const actualMonthlyFee = (b && typeof b.monthlyFee === 'number' && b.monthlyFee > 0)
                            ? b.monthlyFee
                            : (c?.defaultMonthlyFee || 0);
                          const cMonths = studentForm.yearlyCourseMonths || 12;
                          const actualYearlyFee = (b && typeof b.courseFee === 'number' && b.courseFee > 0)
                            ? b.courseFee
                            : (actualMonthlyFee * cMonths);

                          setStudentForm(prev => {
                            const pct = prev.scholarshipPercent || 0;
                            const yearlyDisc = Math.round((actualYearlyFee * pct) / 100);
                            const monthlyDisc = Math.round((actualMonthlyFee * pct) / 100);
                            return {
                              ...prev,
                              batchId: val,
                              baseFee: actualMonthlyFee,
                              yearlyStandardFee: actualYearlyFee,
                              totalYearlyFee: actualYearlyFee - yearlyDisc,
                              discountAmount: monthlyDisc,
                              scholarshipPercent: pct,
                              subjects: b?.subjects ? [...b.subjects] : prev.subjects,
                            };
                          });
                        }}
                      >
                        <SelectTrigger className={STUDENT_MODAL_SELECT_CLS}>
                          <SelectValue placeholder="Batch" />
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
                </div>

                {/* Fee Breakdown Card: Exact Match with Student Edit Modal & Fixed Read-Only Net Payable Fee */}
                {renderStudentFeeBreakdownCard({
                  form: studentForm,
                  previewDiscount,
                  previewNetFee,
                  addlFee: currentStudentAddlFee,
                  onToggleFeeType: handleToggleStudentFeeType,
                  onDiscountAmountChange: amount =>
                    setStudentForm(prev => applyScholarshipDiscountUpdate(prev, amount)),
                })}

                {/* Enrolled & Additional Subjects Tabs */}
                {renderStudentSubjectsTabs({
                  activeTab: enrollStudentSubjectTab,
                  onTabChange: setEnrollStudentSubjectTab,
                  showAddInput: showEnrollAddSubjectInput,
                  onToggleAddInput: () => {
                    if (enrollStudentSubjectTab !== 'additional') {
                      setEnrollStudentSubjectTab('additional');
                      setShowEnrollAddSubjectInput(true);
                    } else {
                      setShowEnrollAddSubjectInput(prev => !prev);
                    }
                  },
                  batchId: studentForm.batchId,
                  enrolledSubjects: studentForm.subjects,
                  onToggleEnrolledSubject: sub =>
                    setStudentForm(prev => ({
                      ...prev,
                      subjects: prev.subjects.includes(sub)
                        ? prev.subjects.filter(s => s !== sub)
                        : [...prev.subjects, sub],
                    })),
                  emptyEnrolledText: studentForm.batchId
                    ? 'No subjects configured in selected batch.'
                    : 'Select a batch to view enrolled subjects.',
                  additionalSubjects: studentForm.additionalSubjects || [],
                  onRemoveAdditionalSubject: handleRemoveEnrollAddlSubject,
                  newAddlName: newEnrollAddlSubjectName,
                  onNewAddlNameChange: setNewEnrollAddlSubjectName,
                  newAddlFee: newEnrollAddlSubjectFee,
                  onNewAddlFeeChange: setNewEnrollAddlSubjectFee,
                  onAddAdditionalSubject: () => handleAddEnrollAddlSubject(),
                })}
              </div>

              {/* Submit Button (Pinned Bottom Action Footer matching Reference Card) */}
              <div className="pt-2 mt-1 border-t border-slate-100 dark:border-slate-800/80 shrink-0">
                <Button
                  type="submit"
                  disabled={isPending}
                  className={STUDENT_MODAL_FOOTER_BTN_CLS}
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
            <form onSubmit={handleUpdateStudent} className="flex flex-col flex-1 min-h-0 overflow-hidden text-left" autoComplete="off">
              {/* Header: Student Name / Edit Title + Compact Student ID & Joined Date matching Profile */}
              <DialogHeader className="pb-2.5 border-b border-slate-100 dark:border-slate-800/80 shrink-0">
                <div>
                  <DialogTitle className="text-[16px] sm:text-[17px] font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5 leading-snug pr-8">
                    <input
                      type="text"
                      placeholder="Student Full Name"
                      value={editStudentForm.name}
                      onChange={e => setEditStudentForm({ ...editStudentForm, name: toTitleCase(e.target.value) })}
                      required
                      className="text-[16px] sm:text-[17px] font-bold tracking-tight text-slate-900 dark:text-white bg-transparent border-0 border-b border-transparent hover:border-slate-300 dark:hover:border-slate-700 focus:border-[#2864E8] p-0 m-0 focus:outline-none focus:ring-0 leading-snug w-full selection:bg-[#2864E8]/20 transition-colors"
                    />
                    {(editStudentForm.feeType === 'yearly_package' || Boolean(editingStudent?.yearlyPackage)) && (
                      <span title="Yearly Package Student" className="inline-flex items-center justify-center shrink-0 ml-1">
                        <span className="w-2 h-2 rounded-full bg-violet-600 dark:bg-violet-400 shadow-[0_0_7px_2px_rgba(139,92,246,0.75)] animate-pulse" />
                      </span>
                    )}
                  </DialogTitle>
                  {(() => {
                    const effDue = editingStudent
                      ? ((editingStudent.feeType === 'yearly_package' || Boolean(editingStudent.yearlyPackage))
                        ? (editingStudent.joiningDate || editingStudent.dueDate)
                        : (editStudentForm.dueDate || editingStudent.dueDate))
                      : (editStudentForm.dueDate || "");
                    const oDays = effDue ? getOverdueDays(effDue) : 0;
                    const studentLedger = editingStudent ? ledger.find(l => l.studentId === editingStudent.id && (!selectedMonth || l.month === selectedMonth)) : null;
                    const isOver = oDays > 0 && studentLedger && (studentLedger.balanceAmount > 0 || studentLedger.status === 'OVERDUE');

                    return (
                      <div className="text-[11.5px] text-slate-500 font-mono mt-1.5 flex items-center flex-wrap gap-x-1.5 gap-y-1">
                        <span className="inline-flex items-center gap-1 whitespace-nowrap shrink-0">
                          <span className="text-[10px] uppercase tracking-wider font-medium text-slate-400 dark:text-slate-500 shrink-0">ID:</span>
                          <span className="inline-grid items-center">
                            <span aria-hidden="true" className="invisible col-start-1 row-start-1 whitespace-pre font-mono font-medium uppercase text-[11.5px] pointer-events-none select-none min-w-[4ch]">
                              {editStudentForm.rollNumber || "ID"}
                            </span>
                            <input
                              type="text"
                              size={1}
                              placeholder="ID"
                              value={editStudentForm.rollNumber || ""}
                              onChange={e => setEditStudentForm({ ...editStudentForm, rollNumber: e.target.value })}
                              className="col-start-1 row-start-1 w-full min-w-0 font-medium text-slate-700 dark:text-slate-200 bg-transparent border-0 border-b border-transparent hover:border-slate-300 focus:border-[#2864E8] focus:outline-none p-0 m-0 font-mono uppercase cursor-text selection:bg-[#2864E8]/20 text-[11.5px]"
                            />
                          </span>
                        </span>
                        <span className="text-slate-300 dark:text-slate-700 shrink-0 select-none">•</span>
                        <span className="inline-flex items-center gap-1 whitespace-nowrap shrink-0">
                          <span className="text-[10px] uppercase tracking-wider font-medium text-slate-400 dark:text-slate-500 shrink-0">JOIN:</span>
                          <span className="inline-grid items-center">
                            <span aria-hidden="true" className="invisible col-start-1 row-start-1 whitespace-pre font-mono font-medium text-[11.5px] pointer-events-none select-none tabular-nums">
                              {editStudentForm.joiningDate || "DD-MM-YYYY"}
                            </span>
                            <input
                              type="text"
                              size={1}
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
                              className="col-start-1 row-start-1 w-full min-w-0 font-medium tabular-nums text-slate-700 dark:text-slate-300 bg-transparent border-0 border-b border-transparent hover:border-slate-300 focus:border-[#2864E8] focus:outline-none p-0 m-0 font-mono cursor-text selection:bg-[#2864E8]/20 text-[11.5px]"
                            />
                          </span>
                        </span>
                        <span className="text-slate-300 dark:text-slate-700 shrink-0 select-none">•</span>
                        <span className="inline-flex items-center whitespace-nowrap shrink-0">
                          <span className="inline-flex items-center gap-1">
                            <span className={`text-[10px] uppercase tracking-wider font-medium shrink-0 ${isOver ? "text-rose-600 dark:text-rose-400" : "text-slate-400 dark:text-slate-500"}`}>DUE:</span>
                            <span className="inline-grid items-center">
                              <span aria-hidden="true" className="invisible col-start-1 row-start-1 whitespace-pre font-mono font-medium text-[11.5px] pointer-events-none select-none tabular-nums">
                                {editStudentForm.dueDate || "DD-MM-YYYY"}
                              </span>
                              <input
                                type="text"
                                size={1}
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
                                className={`col-start-1 row-start-1 w-full min-w-0 font-medium tabular-nums bg-transparent border-0 border-b border-transparent hover:border-slate-300 focus:border-[#2864E8] focus:outline-none p-0 m-0 font-mono cursor-text selection:bg-[#2864E8]/20 text-[11.5px] ${isOver ? "text-rose-600 dark:text-rose-400" : "text-slate-700 dark:text-slate-300"}`}
                              />
                            </span>
                          </span>
                          {isOver && renderOverdueDaysBadge(oDays, 'ml-2')}
                        </span>
                      </div>
                    );
                  })()}
                </div>
              </DialogHeader>

              <div className="flex-1 overflow-y-auto pr-1 pb-1 space-y-2.5 pt-2">
                {/* Personal Information Grid (Father/Guardian Name, DOB, Gender, Contacts, Address, Academic) */}
                <div className="py-2 border-b border-slate-100 dark:border-slate-800/80 space-y-2 text-xs">
                  {/* Row 1: Father / Guardian Name, Date of Birth, Gender (3 columns matching profile view card) */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-4 gap-y-1.5">
                    <div>
                      <span className="text-[11px] font-normal text-slate-400 dark:text-slate-500 block truncate">
                        Father / Guardian Name
                      </span>
                      <input
                        placeholder="Father Name"
                        value={editStudentForm.fatherName}
                        onChange={e => setEditStudentForm({ ...editStudentForm, fatherName: toTitleCase(e.target.value) })}
                        required
                        className="w-full bg-transparent border-0 border-b border-transparent hover:border-slate-300 dark:hover:border-slate-700 focus:border-[#2864E8] dark:focus:border-[#2864E8] focus:outline-none focus:ring-0 text-[12.5px] font-medium text-slate-700 dark:text-slate-200 placeholder:text-slate-400/80 p-0 m-0 mt-0.5 h-[19px] leading-tight transition-colors"
                      />
                    </div>

                    <div>
                      <span className="text-[11px] font-normal text-slate-400 dark:text-slate-500 block">
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
                        className="w-full bg-transparent border-0 border-b border-transparent hover:border-slate-300 dark:hover:border-slate-700 focus:border-[#2864E8] dark:focus:border-[#2864E8] focus:outline-none focus:ring-0 text-[12px] font-medium text-slate-700 dark:text-slate-200 font-mono tabular-nums placeholder:text-slate-400/80 p-0 m-0 mt-0.5 h-[19px] leading-tight transition-colors"
                      />
                    </div>

                    <div>
                      <span className="text-[11px] font-normal text-slate-400 dark:text-slate-500 block">
                        Gender
                      </span>
                      <Select
                        value={editStudentForm.gender || ""}
                        onValueChange={(val: any) => setEditStudentForm({ ...editStudentForm, gender: val })}
                      >
                        <SelectTrigger className="w-full bg-transparent border-0 border-b border-transparent hover:border-slate-300 dark:hover:border-slate-700 focus:border-[#2864E8] dark:focus:border-[#2864E8] focus:outline-none focus:ring-0 text-[12.5px] font-medium text-slate-700 dark:text-slate-200 p-0 m-0 mt-0.5 h-[19px] shadow-none flex items-center justify-between cursor-pointer transition-colors [&>svg]:h-2.5 [&>svg]:w-2.5 [&>svg]:text-slate-400 [&>svg]:opacity-60 hover:[&>svg]:text-[#2864E8] hover:[&>svg]:opacity-100">
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
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-4 gap-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800/60">
                    <div>
                      <span className="text-[11px] font-normal text-slate-400 dark:text-slate-500 block">
                        Primary Contact
                      </span>
                      <input
                        type="tel"
                        maxLength={10}
                        placeholder="Primary Phone"
                        value={editStudentForm.fatherContact || ""}
                        onChange={e => setEditStudentForm({ ...editStudentForm, fatherContact: e.target.value })}
                        className="w-full bg-transparent border-0 border-b border-transparent hover:border-slate-300 dark:hover:border-slate-700 focus:border-[#2864E8] dark:focus:border-[#2864E8] focus:outline-none focus:ring-0 text-[12px] font-medium text-slate-700 dark:text-slate-200 font-mono tabular-nums placeholder:text-slate-400/80 p-0 m-0 mt-0.5 h-[19px] leading-tight transition-colors"
                      />
                    </div>

                    <div>
                      <span className="text-[11px] font-normal text-slate-400 dark:text-slate-500 block">
                        Secondary Contact
                      </span>
                      <input
                        type="tel"
                        maxLength={10}
                        placeholder="Secondary Phone"
                        value={editStudentForm.motherContact || ""}
                        onChange={e => setEditStudentForm({ ...editStudentForm, motherContact: e.target.value, contact2: e.target.value })}
                        className="w-full bg-transparent border-0 border-b border-transparent hover:border-slate-300 dark:hover:border-slate-700 focus:border-[#2864E8] dark:focus:border-[#2864E8] focus:outline-none focus:ring-0 text-[12px] font-medium text-slate-700 dark:text-slate-200 font-mono tabular-nums placeholder:text-slate-400/80 p-0 m-0 mt-0.5 h-[19px] leading-tight transition-colors"
                      />
                    </div>

                    <div>
                      <span className="text-[11px] font-normal text-slate-400 dark:text-slate-500 block">
                        Emergency Contact
                      </span>
                      <input
                        type="tel"
                        maxLength={10}
                        placeholder="Emergency Phone"
                        value={editStudentForm.contact1}
                        onChange={e => setEditStudentForm({ ...editStudentForm, contact1: e.target.value })}
                        required
                        className="w-full bg-transparent border-0 border-b border-transparent hover:border-slate-300 dark:hover:border-slate-700 focus:border-[#2864E8] dark:focus:border-[#2864E8] focus:outline-none focus:ring-0 text-[12px] font-medium text-slate-700 dark:text-slate-200 font-mono tabular-nums placeholder:text-slate-400/80 p-0 m-0 mt-0.5 h-[19px] leading-tight transition-colors"
                      />
                    </div>
                  </div>

                  {/* Row 3: Residential Address (Full-width row matching profile view card) */}
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800/60">
                    <span className="text-[11px] font-normal text-slate-400 dark:text-slate-500 block">
                      Residential Address
                    </span>
                    <input
                      placeholder="Residential Address"
                      value={editStudentForm.address}
                      onChange={e => setEditStudentForm({ ...editStudentForm, address: toTitleCase(e.target.value) })}
                      className="w-full bg-transparent border-0 border-b border-transparent hover:border-slate-300 dark:hover:border-slate-700 focus:border-[#2864E8] dark:focus:border-[#2864E8] focus:outline-none focus:ring-0 text-[12px] font-medium text-slate-700 dark:text-slate-200 placeholder:text-slate-400/80 p-0 m-0 mt-0.5 h-[19px] leading-snug transition-colors"
                    />
                  </div>

                  {/* Row 4: Academic Details (Branch, Class, Batch) in clean 3-column row matching profile view card */}
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800/60 grid grid-cols-1 sm:grid-cols-3 gap-x-4 gap-y-1.5">
                    <div>
                      <span className="text-[11px] font-normal text-slate-400 dark:text-slate-500 block">
                        Branch
                      </span>
                      <Select
                        value={editStudentForm.branchId}
                        onValueChange={val => setEditStudentForm({ ...editStudentForm, branchId: val, classId: "", batchId: "" })}
                      >
                        <SelectTrigger className="w-full bg-transparent border-0 border-b border-transparent hover:border-slate-300 dark:hover:border-slate-700 focus:border-[#2864E8] dark:focus:border-[#2864E8] focus:outline-none focus:ring-0 text-[12.5px] font-medium text-slate-700 dark:text-slate-200 p-0 m-0 mt-0.5 h-[19px] shadow-none flex items-center justify-between cursor-pointer transition-colors [&>svg]:h-2.5 [&>svg]:w-2.5 [&>svg]:text-slate-400 [&>svg]:opacity-60 hover:[&>svg]:text-[#2864E8] hover:[&>svg]:opacity-100">
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
                      <span className="text-[11px] font-normal text-slate-400 dark:text-slate-500 block">
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
                        <SelectTrigger className="w-full bg-transparent border-0 border-b border-transparent hover:border-slate-300 dark:hover:border-slate-700 focus:border-[#2864E8] dark:focus:border-[#2864E8] focus:outline-none focus:ring-0 text-[12.5px] font-medium text-slate-700 dark:text-slate-200 p-0 m-0 mt-0.5 h-[19px] shadow-none flex items-center justify-between cursor-pointer transition-colors [&>svg]:h-2.5 [&>svg]:w-2.5 [&>svg]:text-slate-400 [&>svg]:opacity-60 hover:[&>svg]:text-[#2864E8] hover:[&>svg]:opacity-100">
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
                      <span className="text-[11px] font-normal text-slate-400 dark:text-slate-500 block">
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
                        <SelectTrigger className="w-full bg-transparent border-0 border-b border-transparent hover:border-slate-300 dark:hover:border-slate-700 focus:border-[#2864E8] dark:focus:border-[#2864E8] focus:outline-none focus:ring-0 text-[12.5px] font-medium text-slate-700 dark:text-slate-200 p-0 m-0 mt-0.5 h-[19px] shadow-none flex items-center justify-between cursor-pointer transition-colors [&>svg]:h-2.5 [&>svg]:w-2.5 [&>svg]:text-slate-400 [&>svg]:opacity-60 hover:[&>svg]:text-[#2864E8] hover:[&>svg]:opacity-100">
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

                {/* Fee Breakdown Card: Shared with Enroll New Student */}
                {renderStudentFeeBreakdownCard({
                  form: editStudentForm,
                  previewDiscount: editPreviewDiscount,
                  previewNetFee: editPreviewNetFee,
                  addlFee: currentEditStudentAddlFee,
                  onToggleFeeType: handleToggleEditStudentFeeType,
                  onDiscountAmountChange: amount =>
                    setEditStudentForm(prev => applyScholarshipDiscountUpdate(prev, amount)),
                })}

                {/* Enrolled & Additional Subjects: Shared Interactive Text Tabs */}
                {renderStudentSubjectsTabs({
                  activeTab: editStudentSubjectTab,
                  onTabChange: setEditStudentSubjectTab,
                  showAddInput: showAddSubjectInput,
                  onToggleAddInput: () => {
                    if (editStudentSubjectTab !== 'additional') {
                      setEditStudentSubjectTab('additional');
                      setShowAddSubjectInput(true);
                    } else {
                      setShowAddSubjectInput(prev => !prev);
                    }
                  },
                  batchId: editStudentForm.batchId,
                  enrolledSubjects: editStudentForm.subjects,
                  onToggleEnrolledSubject: sub =>
                    setEditStudentForm(prev => ({
                      ...prev,
                      subjects: prev.subjects.includes(sub)
                        ? prev.subjects.filter(s => s !== sub)
                        : [...prev.subjects, sub],
                    })),
                  emptyEnrolledText: 'No subjects configured in selected batch.',
                  additionalSubjects: editStudentForm.additionalSubjects || [],
                  onRemoveAdditionalSubject: id =>
                    setEditStudentForm(prev => ({
                      ...prev,
                      additionalSubjects: (prev.additionalSubjects || []).filter(s => s.id !== id),
                    })),
                  newAddlName: newEditAddlSubjectName,
                  onNewAddlNameChange: setNewEditAddlSubjectName,
                  newAddlFee: newEditAddlSubjectFee,
                  onNewAddlFeeChange: setNewEditAddlSubjectFee,
                  onAddAdditionalSubject: () => handleAddEditAddlSubject(),
                })}
              </div>

              {/* Submit Button (Pinned Bottom Action Footer) - Compact & Elegant (Exact 44px Footer matching View Modal) */}
              <div className="pt-2 mt-1 border-t border-slate-100 dark:border-slate-800/80 shrink-0">
                <Button
                  type="submit"
                  disabled={isPending}
                  className={STUDENT_MODAL_FOOTER_BTN_CLS}
                >
                  <span>SAVE STUDENT CHANGES</span>
                  <ArrowRight className="w-3.5 h-3.5 text-white/90 group-hover:translate-x-0.5 transition-transform duration-150" />
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
                <DialogTitle className="text-[16px] sm:text-[17px] font-bold text-slate-900 dark:text-white tracking-tight">
                  Collect Student Fee
                </DialogTitle>
                <DialogDescription className="text-[11.5px] text-slate-500 dark:text-slate-400 font-normal mt-0.5">
                  Record payment and update monthly fee records.
                </DialogDescription>
              </div>
            </DialogHeader>

            {collectTarget && (
              <form onSubmit={handleRecordPayment} className="space-y-3 pt-1">
                {/* Target Student Header Section: Matched to Reference Screenshot */}
                {(() => {
                  const targetClass = classes.find(c => c.id === collectTarget.student.classId || c.id === collectTarget.classId);
                  const targetBatch = batches.find(b => b.id === collectTarget.student.batchId || b.id === collectTarget.batchId);
                  const targetBranch = IDL_BRANCHES.find(b => b.id === collectTarget.student.branchId || b.id === collectTarget.branchId);
                  const effDue = (collectTarget.student.feeType === 'yearly_package' || Boolean(collectTarget.student.yearlyPackage))
                    ? (collectTarget.student.joiningDate || collectTarget.dueDate)
                    : collectTarget.dueDate;
                  const oDays = getOverdueDays(effDue);
                  const isOverdue = oDays > 0 && (collectTarget.status === 'OVERDUE' || collectTarget.isOverdue || collectTarget.balanceAmount > 0);

                  const classNameDisplay = targetClass?.name
                    ? (targetClass.name.toLowerCase().startsWith('class') ? targetClass.name : `Class ${targetClass.name}`)
                    : 'Class 9';
                  const batchNameDisplay = targetBatch?.name
                    ? (targetBatch.name.toLowerCase().startsWith('batch') ? targetBatch.name : `Batch ${targetBatch.name}`)
                    : 'Batch A1';
                  const branchName = targetBranch?.name || collectTarget.student.branchId || 'Budh Vihar';

                  return (
                    <div className="pb-3 border-b border-slate-100 dark:border-slate-800/80" title={`Branch: ${branchName}`}>
                      <div className="grid grid-cols-2 gap-x-4 sm:gap-x-6 gap-y-1.5 text-[12px] leading-tight">
                        {/* Row 1: Student Name (Left) & Class | Batch (Right) */}
                        <div className="flex items-center gap-1.5 min-w-0 h-[18px]">
                          <span className="text-[14px] font-bold text-slate-900 dark:text-white truncate tracking-tight">
                            {collectTarget.student.name}
                          </span>
                          {(collectTarget.student.feeType === 'yearly_package' || Boolean(collectTarget.student.yearlyPackage)) && (
                            <span title="Yearly Package Student" className="inline-flex items-center justify-center shrink-0 ml-0.5">
                              <span className="w-2 h-2 rounded-full bg-violet-600 dark:bg-violet-400 shadow-[0_0_7px_2px_rgba(139,92,246,0.75)] animate-pulse" />
                            </span>
                          )}
                        </div>
                        <div className="flex items-center min-w-0 h-[18px]">
                          <span className="font-medium text-slate-500 dark:text-slate-400 text-[12px] truncate tracking-tight w-[54px] shrink-0">
                            {classNameDisplay}
                          </span>
                          <div className="w-[10px] shrink-0 flex items-center justify-center">
                            <span className="inline-block w-px h-3 bg-slate-200 dark:bg-slate-700 select-none" aria-hidden="true" />
                          </div>
                          <span className="font-medium text-slate-500 dark:text-slate-400 text-[12px] truncate tracking-tight">
                            {batchNameDisplay}
                          </span>
                        </div>

                        {/* Row 2: Father Name (Left) & Join Date (Right) */}
                        <div className="text-slate-400 dark:text-slate-500 font-normal truncate flex items-center h-[18px]">
                          Father : <span className="font-medium text-slate-700 dark:text-slate-200 capitalize ml-1">{collectTarget.student.fatherName || '—'}</span>
                        </div>
                        <div className="text-slate-400 dark:text-slate-500 font-normal whitespace-nowrap flex items-center h-[18px]">
                          <div className="inline-flex items-center w-[64px] shrink-0">
                            <span className="w-[54px] shrink-0">Join Date</span>
                            <span className="w-[10px] shrink-0 text-center">:</span>
                          </div>
                          <span className="font-mono font-medium text-slate-700 dark:text-slate-300 tabular-nums w-[74px] shrink-0 whitespace-nowrap">{formatAdmDate(collectTarget.student.joiningDate)}</span>
                        </div>

                        {/* Row 3: Admission No. (Left) & Due Date + Overdue (Right) */}
                        <div className="text-slate-400 dark:text-slate-500 font-normal truncate flex items-center h-[18px]">
                          Admission No. : <span className="font-mono font-medium text-slate-700 dark:text-slate-300 ml-1">{collectTarget.student.rollNumber || collectTarget.student.id}</span>
                        </div>
                        <div className={`flex items-center min-w-0 whitespace-nowrap h-[18px] ${isOverdue ? "text-rose-600 dark:text-rose-400" : "text-slate-400 dark:text-slate-500"}`}>
                          <div className="inline-flex items-center w-[64px] shrink-0 font-normal">
                            <span className="w-[54px] shrink-0">Due Date</span>
                            <span className="w-[10px] shrink-0 text-center">:</span>
                          </div>
                          <span className={`font-mono font-medium tabular-nums w-[74px] shrink-0 whitespace-nowrap ${isOverdue ? "text-rose-600 dark:text-rose-400" : "text-slate-700 dark:text-slate-300"}`}>
                            {formatAdmDate(effDue)}
                          </span>
                          {isOverdue && renderOverdueDaysBadge(oDays, 'ml-2')}
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* Fee Breakdown Section: Clean White with Horizontal Separator */}
                <div className="space-y-2 text-xs pb-3 border-b border-slate-100 dark:border-slate-800/80">
                  <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    <span className="whitespace-nowrap shrink-0">
                      FEE BREAKDOWN
                    </span>
                    <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500 tracking-wider uppercase">
                      {(collectTarget.student.feeType === 'yearly_package' || Boolean(collectTarget.student.yearlyPackage)) ? "Yearly Package" : "MONTHLY FEE"}
                    </span>
                  </div>

                  <div className="space-y-1.5 pt-0.5 text-xs">
                    {/* Standard Fee */}
                    <div className="flex justify-between items-center text-slate-500 dark:text-slate-400">
                      <span className="font-normal text-[12px]">Standard Fee:</span>
                      <span className="font-medium text-slate-700 dark:text-slate-200 font-mono tabular-nums text-[12.5px]">
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
                    <div className="flex justify-between items-center text-slate-500 dark:text-slate-400">
                      <span className="font-normal text-[12px]">Scholarship:</span>
                      <span className="font-medium text-emerald-600 dark:text-emerald-400 font-mono tabular-nums text-[12.5px]">
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
                        <div className="flex justify-between items-center text-slate-500 dark:text-slate-400">
                          <span className="flex items-center gap-1.5">
                            <span className="font-normal text-[12px]">Additional Subjects:</span>
                            <span className="text-[9.5px] text-violet-600 dark:text-violet-400 font-semibold bg-violet-50/80 dark:bg-violet-950/50 border border-violet-200/60 dark:border-violet-800/50 px-1.5 py-0.5 rounded">
                              {activeSubs.length} subj
                            </span>
                          </span>
                          <span className="font-medium text-violet-600 dark:text-violet-400 font-mono tabular-nums text-[12.5px]">
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
                    <span className="font-semibold text-slate-900 dark:text-white text-[13px] tracking-tight">Net Payable Fee:</span>
                    <span className="text-[#2864E8] font-bold text-[17px] font-mono tabular-nums tracking-tight">
                      ₹{Number(
                        (collectTarget.student.feeType === 'yearly_package' || Boolean(collectTarget.student.yearlyPackage))
                          ? (collectTarget.student.yearlyPackage?.totalYearlyFee || (collectTarget.student.netFee * 12))
                          : collectTarget.netDueAmount
                      ).toLocaleString('en-IN')}
                      <span className="text-xs font-normal text-slate-400 dark:text-slate-500 ml-0.5">
                        {(collectTarget.student.feeType === 'yearly_package' || Boolean(collectTarget.student.yearlyPackage)) ? "/year" : "/month"}
                      </span>
                    </span>
                  </div>
                </div>

                {/* Partial Payment Reminder (if student has already paid part of fee) */}
                {collectTarget.paidAmount > 0 && (
                  <div className="flex items-center justify-between text-[11px] px-3 py-1.5 rounded-[5px] bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200/70 dark:border-amber-900/40 text-amber-800 dark:text-amber-300 font-medium">
                    <span>Already Paid: <strong className="font-semibold text-emerald-700 dark:text-emerald-400">₹{Number(collectTarget.paidAmount ?? 0).toLocaleString('en-IN')}</strong></span>
                    <span>Balance Due: <strong className="font-semibold text-rose-700 dark:text-rose-400">₹{Number(collectTarget.balanceAmount ?? 0).toLocaleString('en-IN')}</strong></span>
                  </div>
                )}

                {/* Mode of Payment: Single Line Selectable Options with Gray Circular Outline (Blue + Check on Select) */}
                <div className="flex items-center justify-between py-1 pb-3 border-b border-slate-100 dark:border-slate-800/80">
                  <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                    Mode of Payment :
                  </span>
                  <div className="flex items-center gap-3">
                    {/* Cash */}
                    <button
                      type="button"
                      onClick={() => setCollectForm({ ...collectForm, paymentMode: collectForm.paymentMode === 'cash' ? '' : 'cash', transactionRef: '' })}
                      className="inline-flex items-center gap-1.5 text-xs cursor-pointer transition-colors bg-transparent border-0 p-0 shadow-none focus:outline-none select-none group"
                    >
                      <span className={collectForm.paymentMode === 'cash' ? 'font-semibold text-[#2864E8]' : 'font-medium text-slate-600 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white'}>
                        Cash
                      </span>
                      <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center shrink-0 transition-all bg-transparent ${collectForm.paymentMode === 'cash'
                        ? 'border-[1.5px] border-[#2864E8] text-[#2864E8] shadow-[0_0_0_2px_rgba(40,100,232,0.14)]'
                        : 'border border-slate-300 dark:border-slate-600 group-hover:border-slate-400 dark:group-hover:border-slate-500'
                        }`}>
                        {collectForm.paymentMode === 'cash' && (
                          <Check className="w-2.5 h-2.5 stroke-[2.5]" />
                        )}
                      </div>
                    </button>

                    {/* Online */}
                    <button
                      type="button"
                      onClick={() => {
                        const isOnline = collectForm.paymentMode === 'online' || collectForm.paymentMode === 'upi' || collectForm.paymentMode === 'net_banking' || collectForm.paymentMode === 'cheque' || collectForm.paymentMode === 'card';
                        setCollectForm({ ...collectForm, paymentMode: isOnline ? '' : 'online' });
                      }}
                      className="inline-flex items-center gap-1.5 text-xs cursor-pointer transition-colors bg-transparent border-0 p-0 shadow-none focus:outline-none select-none group"
                    >
                      <span className={
                        collectForm.paymentMode === 'online' || collectForm.paymentMode === 'upi' || collectForm.paymentMode === 'net_banking' || collectForm.paymentMode === 'cheque' || collectForm.paymentMode === 'card'
                          ? 'font-semibold text-[#2864E8]'
                          : 'font-medium text-slate-600 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white'
                      }>
                        Online
                      </span>
                      {(() => {
                        const isOnline = collectForm.paymentMode === 'online' || collectForm.paymentMode === 'upi' || collectForm.paymentMode === 'net_banking' || collectForm.paymentMode === 'cheque' || collectForm.paymentMode === 'card';
                        return (
                          <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center shrink-0 transition-all bg-transparent ${isOnline
                            ? 'border-[1.5px] border-[#2864E8] text-[#2864E8] shadow-[0_0_0_2px_rgba(40,100,232,0.14)]'
                            : 'border border-slate-300 dark:border-slate-600 group-hover:border-slate-400 dark:group-hover:border-slate-500'
                            }`}>
                            {isOnline && (
                              <Check className="w-2.5 h-2.5 stroke-[2.5]" />
                            )}
                          </div>
                        );
                      })()}
                    </button>
                  </div>
                </div>

                {/* Remarks (Optional): 100% Rectangular Shape with 5% Corner Round */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-slate-600 dark:text-slate-400">
                    Remarks <span className="text-slate-400 dark:text-slate-500 font-normal">(Optional)</span>
                  </Label>
                  <Input
                    placeholder="Notes, installments, etc."
                    value={collectForm.remarks}
                    onChange={e => setCollectForm({ ...collectForm, remarks: e.target.value })}
                    className="h-10 text-xs sm:text-[13px] rounded-[5px] border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700 focus:bg-white dark:focus:bg-slate-950 focus-visible:ring-2 focus-visible:ring-[#2864E8]/15 focus-visible:border-[#2864E8] placeholder:text-slate-400 dark:placeholder:text-slate-500 text-slate-800 dark:text-slate-100 transition-colors shadow-none"
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
                    className={`w-full h-9 !rounded-[5px] text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-none active:scale-[0.995] ${!collectForm.paymentMode
                      ? 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 cursor-not-allowed shadow-none'
                      : 'bg-[#2864E8] hover:bg-[#1E4ED8] active:bg-[#1842BE] text-white shadow-[0_1px_2px_rgba(15,23,42,0.08)]'
                      }`}
                  >
                    {isRecordingPayment ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Recording...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className={`w-4 h-4 shrink-0 ${!collectForm.paymentMode ? 'text-slate-500 dark:text-slate-400' : 'text-white'}`} />
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
          <DialogContent overlayClassName="z-[130]" className="z-[131] max-w-md w-[94vw] rounded-2xl p-5 sm:p-6 bg-white dark:bg-slate-950 border border-slate-200/90 dark:border-slate-800 shadow-[0_25px_60px_-15px_rgba(15,23,42,0.18),0_4px_16px_rgba(15,23,42,0.06)] text-left font-['Inter_Tight',sans-serif]">
            <DialogHeader className="sr-only">
              <DialogTitle>Student Fee Receipt</DialogTitle>
              <DialogDescription>Official student fee receipt details</DialogDescription>
            </DialogHeader>
            {recentReceipt && (
              <div className="space-y-3.5">
                {/* Receipt Header */}
                <div className="text-center border-b border-slate-100 dark:border-slate-800/80 pb-3.5">
                  <div className="flex items-center justify-center">
                    <img
                      src={IDL_RECEIPT_LOGO_DATA_URL}
                      alt="IDL Education"
                      className="h-11 w-auto object-contain dark:hidden"
                    />
                    <img
                      src="/idllogo-white.png"
                      alt="IDL Education"
                      className="h-11 w-auto object-contain hidden dark:block"
                    />
                  </div>
                  <p className="text-[12px] text-slate-500 dark:text-slate-400 mt-1.5 font-medium tracking-tight">
                    Official Fee Receipt
                  </p>
                  <div className="relative flex items-center justify-center mt-2">
                    <div className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200/70 dark:border-slate-700/70 text-[11px] font-mono font-medium text-slate-600 dark:text-slate-300 tabular-nums">
                      Receipt No: {recentReceipt.receiptNumber}
                    </div>
                    <div className="absolute right-0 flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handlePrintReceipt(recentReceipt)}
                        title="Print Fee Receipt"
                        className="p-1 text-slate-400 dark:text-slate-500 hover:text-[#2864E8] dark:hover:text-blue-400 transition-colors cursor-pointer focus:outline-none"
                      >
                        <Printer className="w-3.5 h-3.5 stroke-[1.75]" />
                        <span className="sr-only">Print Receipt</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDirectWhatsAppShare(recentReceipt)}
                        title="Share Receipt (Direct Share Options)"
                        className="p-1 text-slate-400 dark:text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer focus:outline-none"
                      >
                        <Share2 className="w-3.5 h-3.5 stroke-[1.75]" />
                        <span className="sr-only">Share Receipt</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Receipt Details Table */}
                {(() => {
                  const receiptStudent = students.find(s => s.id === recentReceipt.studentId);
                  const receiptYearlyMeta = getYearlyPackageMeta(receiptStudent, recentReceipt.amount);
                  const isYearlyReceipt =
                    recentReceipt.transactionRef === 'YEARLY-PACKAGE-LUMPSUM' ||
                    (recentReceipt.monthLabel || '').includes('Yearly Package');
                  const showTxnRef =
                    Boolean(recentReceipt.transactionRef) &&
                    recentReceipt.transactionRef !== 'YEARLY-PACKAGE-LUMPSUM';

                  return (
                    <div className="divide-y divide-slate-100/80 dark:divide-slate-800/60">
                      <div className="flex items-center justify-between py-1.5">
                        <span className="text-[12px] font-medium text-slate-500 dark:text-slate-400">Student Name:</span>
                        <span className="text-[12.5px] font-semibold text-slate-900 dark:text-white text-right">{recentReceipt.studentName}</span>
                      </div>
                      <div className="flex items-center justify-between py-1.5">
                        <span className="text-[12px] font-medium text-slate-500 dark:text-slate-400">Roll Number:</span>
                        <span className="text-[12.5px] font-mono font-semibold text-slate-900 dark:text-white text-right tabular-nums">{recentReceipt.rollNumber}</span>
                      </div>
                      <div className="flex items-center justify-between py-1.5">
                        <span className="text-[12px] font-medium text-slate-500 dark:text-slate-400">Billing Month:</span>
                        <span className="text-[12.5px] font-semibold text-slate-900 dark:text-white text-right">{recentReceipt.monthLabel}</span>
                      </div>
                      {isYearlyReceipt && receiptYearlyMeta && (
                        <div className="flex items-center justify-between py-1.5">
                          <span className="text-[12px] font-medium text-slate-500 dark:text-slate-400">Package Plan:</span>
                          <span className="text-[12.5px] font-semibold text-slate-900 dark:text-white text-right tabular-nums">
                            {receiptYearlyMeta.courseMonths} Months (₹{receiptYearlyMeta.monthlyEquated.toLocaleString('en-IN')}/mo)
                          </span>
                        </div>
                      )}
                      <div className="flex items-center justify-between py-1.5">
                        <span className="text-[12px] font-medium text-slate-500 dark:text-slate-400">Payment Date:</span>
                        <span className="text-[12.5px] font-medium text-slate-700 dark:text-slate-300 text-right tabular-nums">{formatAdmDate(recentReceipt.paymentDate)}</span>
                      </div>
                      <div className="flex items-center justify-between py-1.5">
                        <span className="text-[12px] font-medium text-slate-500 dark:text-slate-400">Payment Mode:</span>
                        <span className="text-[12px] font-semibold uppercase tracking-wide text-slate-900 dark:text-white text-right">{recentReceipt.paymentMode}</span>
                      </div>
                      {showTxnRef && (
                        <div className="flex items-center justify-between py-1.5">
                          <span className="text-[12px] font-medium text-slate-500 dark:text-slate-400">Reference No:</span>
                          <span className="text-[12px] font-mono font-medium text-slate-700 dark:text-slate-300 text-right">{recentReceipt.transactionRef}</span>
                        </div>
                      )}
                    </div>
                  );
                })()}

                {/* Amount Received Card */}
                <div className="flex items-center justify-between px-3.5 py-2.5 bg-emerald-50/70 dark:bg-emerald-950/30 rounded-xl border border-emerald-200/50 dark:border-emerald-800/40">
                  <span className="text-[12.5px] font-semibold text-emerald-800 dark:text-emerald-300">Amount Received:</span>
                  <span className="text-[15.5px] font-bold text-emerald-600 dark:text-emerald-400 font-mono tabular-nums tracking-tight">
                    ₹{recentReceipt.amount.toLocaleString('en-IN')}
                  </span>
                </div>

                <DialogFooter className="pt-1">
                  <Button
                    type="button"
                    onClick={() => handleDirectPdfPrint(recentReceipt)}
                    className="w-full h-9 !rounded-[5px] text-xs font-semibold uppercase tracking-wider bg-[#2864E8] hover:bg-[#1E4ED8] active:bg-[#1842BE] text-white shadow-[0_1px_2px_rgba(15,23,42,0.08)] flex items-center justify-center gap-2 cursor-pointer transition-all"
                    title="Download Official PDF Receipt"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download PDF</span>
                  </Button>
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
                <DialogHeader className="pb-2.5 border-b border-slate-100 dark:border-slate-800/80 shrink-0">
                  <div>
                    <DialogTitle className="text-[16px] sm:text-[17px] font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5 leading-snug pr-8">
                      <span>{selectedStudentProfile.name}</span>
                      {(selectedStudentProfile.feeType === 'yearly_package' || Boolean(selectedStudentProfile.yearlyPackage)) && (
                        <span title="Yearly Package Student" className="inline-flex items-center justify-center shrink-0 ml-1">
                          <span className="w-2 h-2 rounded-full bg-violet-600 dark:bg-violet-400 shadow-[0_0_7px_2px_rgba(139,92,246,0.75)] animate-pulse" />
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

                      const oDays = getOverdueDays(effectiveDueDate);
                      const studentLedger = profileLedgerEntry || ledger.find(l => l.studentId === selectedStudentProfile.id && l.month === (selectedMonth || '2026-11'));
                      const isOver = oDays > 0 && studentLedger && (studentLedger.balanceAmount > 0 || studentLedger.status === 'OVERDUE');

                      return (
                        <div className="text-[11.5px] text-slate-500 font-mono mt-1.5 flex items-center flex-wrap gap-x-1.5 gap-y-1">
                          <span className="inline-flex items-center gap-1 whitespace-nowrap shrink-0">
                            <span className="text-[10px] uppercase tracking-wider font-medium text-slate-400 dark:text-slate-500">ID:</span>
                            <span className="font-medium text-slate-700 dark:text-slate-200">
                              {selectedStudentProfile.rollNumber || selectedStudentProfile.id}
                            </span>
                          </span>
                          <span className="text-slate-300 dark:text-slate-700 shrink-0 select-none">•</span>
                          <span className="inline-flex items-center gap-1 whitespace-nowrap shrink-0">
                            <span className="text-[10px] uppercase tracking-wider font-medium text-slate-400 dark:text-slate-500">JOIN:</span>
                            <span className="font-medium text-slate-700 dark:text-slate-300 tabular-nums">
                              {formatAdmDate(selectedStudentProfile.joiningDate)}
                            </span>
                          </span>
                          <span className="text-slate-300 dark:text-slate-700 shrink-0 select-none">•</span>
                          <span className="inline-flex items-center whitespace-nowrap shrink-0">
                            <span className="inline-flex items-center gap-1">
                              <span className={`text-[10px] uppercase tracking-wider font-medium ${isOver ? "text-rose-600 dark:text-rose-400" : "text-slate-400 dark:text-slate-500"}`}>DUE:</span>
                              <span className={`font-medium tabular-nums ${isOver ? "text-rose-600 dark:text-rose-400" : "text-slate-700 dark:text-slate-300"}`}>
                                {formatAdmDate(effectiveDueDate)}
                              </span>
                            </span>
                            {isOver && renderOverdueDaysBadge(oDays, 'ml-1.5')}
                          </span>
                        </div>
                      );
                    })()}
                  </div>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto pr-1 pb-1 space-y-2.5 pt-2">
                  {/* Personal Information Grid (Father/Guardian Name, DOB, Gender, Contacts, Address, Academic) */}
                  <div className="py-2 border-b border-slate-100 dark:border-slate-800/80 space-y-2 text-xs">
                    {/* Row 1: Father/Guardian Name, Date of Birth, Gender (3 columns) */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-4 gap-y-1.5">
                      <div>
                        <span className="text-[11px] font-normal text-slate-400 dark:text-slate-500 block truncate">
                          Father / Guardian Name
                        </span>
                        <div className="text-[12.5px] font-medium text-slate-700 dark:text-slate-200 mt-0.5 truncate">
                          {selectedStudentProfile.fatherName || "—"}
                        </div>
                      </div>

                      <div>
                        <span className="text-[11px] font-normal text-slate-400 dark:text-slate-500 block">
                          Date of Birth
                        </span>
                        <div className="text-[12px] font-medium text-slate-700 dark:text-slate-200 font-mono tabular-nums mt-0.5">
                          {formatAdmDate(selectedStudentProfile.dob)}
                        </div>
                      </div>

                      <div>
                        <span className="text-[11px] font-normal text-slate-400 dark:text-slate-500 block">
                          Gender
                        </span>
                        <div className="text-[12.5px] font-medium text-slate-700 dark:text-slate-200 mt-0.5">
                          {selectedStudentProfile.gender
                            ? selectedStudentProfile.gender.charAt(0).toUpperCase() + selectedStudentProfile.gender.slice(1).toLowerCase()
                            : "—"}
                        </div>
                      </div>
                    </div>

                    {/* Row 2: Primary Contact, Secondary Contact, Emergency Contact (3 columns) */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-4 gap-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800/60">
                      <div>
                        <span className="text-[11px] font-normal text-slate-400 dark:text-slate-500 block">
                          Primary Contact
                        </span>
                        <div className="text-[12px] font-medium text-slate-700 dark:text-slate-200 font-mono tabular-nums mt-0.5">
                          {selectedStudentProfile.fatherContact || selectedStudentProfile.contact1 || "—"}
                        </div>
                      </div>

                      <div>
                        <span className="text-[11px] font-normal text-slate-400 dark:text-slate-500 block">
                          Secondary Contact
                        </span>
                        <div className="text-[12px] font-medium text-slate-700 dark:text-slate-200 font-mono tabular-nums mt-0.5">
                          {selectedStudentProfile.motherContact || selectedStudentProfile.contact2 || "—"}
                        </div>
                      </div>

                      <div>
                        <span className="text-[11px] font-normal text-slate-400 dark:text-slate-500 block">
                          Emergency Contact
                        </span>
                        <div className="text-[12px] font-medium text-slate-700 dark:text-slate-200 font-mono tabular-nums mt-0.5">
                          {selectedStudentProfile.contact1 || selectedStudentProfile.contact2 || "—"}
                        </div>
                      </div>
                    </div>

                    {/* Residential Address: Full-width row matching Edit Modal */}
                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800/60">
                      <span className="text-[11px] font-normal text-slate-400 dark:text-slate-500 block">
                        Residential Address
                      </span>
                      <div className="text-[12px] font-medium text-slate-700 dark:text-slate-200 mt-0.5 leading-snug">
                        {selectedStudentProfile.address || "—"}
                      </div>
                    </div>

                    {/* Academic Details (Branch, Class, Batch) in clean 3-column row */}
                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800/60 grid grid-cols-1 sm:grid-cols-3 gap-x-4 gap-y-1.5">
                      <div>
                        <span className="text-[11px] font-normal text-slate-400 dark:text-slate-500 block">
                          Branch
                        </span>
                        <div className="text-[12.5px] font-medium text-slate-700 dark:text-slate-200 mt-0.5 truncate">
                          {IDL_BRANCHES.find(b => b.id === selectedStudentProfile.branchId)?.name || "—"}
                        </div>
                      </div>

                      <div>
                        <span className="text-[11px] font-normal text-slate-400 dark:text-slate-500 block">
                          Class
                        </span>
                        <div className="text-[12.5px] font-medium text-slate-700 dark:text-slate-200 mt-0.5 truncate">
                          {classes.find(c => c.id === selectedStudentProfile.classId)?.name || "—"}
                        </div>
                      </div>

                      <div>
                        <span className="text-[11px] font-normal text-slate-400 dark:text-slate-500 block">
                          Batch
                        </span>
                        <div className="text-[12.5px] font-medium text-slate-700 dark:text-slate-200 mt-0.5 truncate">
                          {batches.find(b => b.id === selectedStudentProfile.batchId)?.name || "—"}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Fee Breakdown Card: Clean, Compact Premium Styling */}
                  <div className="p-3 rounded-xl bg-slate-50/50 dark:bg-slate-900/30 border border-slate-100 dark:border-slate-800/80 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                        FEE BREAKDOWN
                      </span>
                      <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500 tracking-wider uppercase">
                        {selectedStudentProfile.feeType === "yearly_package" ? "Yearly Package" : "MONTHLY FEE"}
                      </span>
                    </div>

                    <div className="space-y-1 pt-0.5 text-xs">
                      <div className="flex justify-between items-center text-slate-500 dark:text-slate-400">
                        <span className="font-normal text-[12px]">Standard Fee:</span>
                        <span className="font-medium text-slate-700 dark:text-slate-200 font-mono tabular-nums text-[12px]">
                          ₹{Number((selectedStudentProfile.feeType === "yearly_package"
                            ? (selectedStudentProfile.yearlyPackage?.totalYearlyFee
                              ? (selectedStudentProfile.yearlyPackage.totalYearlyFee + ((selectedStudentProfile.discountAmount ?? 0) * (selectedStudentProfile.yearlyPackage.courseMonths || 12)))
                              : (selectedStudentProfile.baseFee ?? 0) * 12)
                            : selectedStudentProfile.baseFee) ?? 0).toLocaleString('en-IN')}
                          <span className="text-[10px] text-slate-400 font-normal ml-0.5">
                            {selectedStudentProfile.feeType === "yearly_package" ? "/yr" : "/mo"}
                          </span>
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-slate-500 dark:text-slate-400">
                        <span className="font-normal text-[12px]">Scholarship:</span>
                        <span className="font-medium text-emerald-600 dark:text-emerald-400 font-mono tabular-nums text-[12px]">
                          {selectedStudentProfile.scholarshipPercent ?? 0}% (-₹
                          {Number((selectedStudentProfile.feeType === "yearly_package"
                            ? (selectedStudentProfile.discountAmount ?? 0) * (selectedStudentProfile.yearlyPackage?.courseMonths || 12)
                            : selectedStudentProfile.discountAmount) ?? 0).toLocaleString('en-IN')})
                        </span>
                      </div>

                      {(() => {
                        const activeSubs = getActiveAdditionalSubjectsForMonth(selectedStudentProfile, selectedMonth || '2026-11');
                        const totalAddl = activeSubs.reduce((sum, s) => sum + (Number(s.fee) || 0), 0);
                        if (totalAddl <= 0) return null;
                        return (
                          <div className="flex justify-between items-center text-slate-500 dark:text-slate-400">
                            <span className="flex items-center gap-1.5">
                              <span className="font-normal text-[12px]">Additional Subjects:</span>
                              <span className="text-[9.5px] text-violet-600 dark:text-violet-400 font-medium bg-violet-50/80 dark:bg-violet-950/40 border border-violet-200/50 dark:border-violet-800/40 px-1.5 py-0.2 rounded">
                                {activeSubs.length} subj
                              </span>
                            </span>
                            <span className="font-medium text-violet-600 dark:text-violet-400 font-mono tabular-nums text-[12px]">
                              +₹{Number(selectedStudentProfile.feeType === 'yearly_package' ? totalAddl * 12 : totalAddl).toLocaleString('en-IN')}
                              <span className="text-[10px] text-slate-400 font-normal ml-0.5">
                                {selectedStudentProfile.feeType === 'yearly_package' ? '/yr' : '/mo'}
                              </span>
                            </span>
                          </div>
                        );
                      })()}
                    </div>

                    <div className="flex justify-between items-baseline pt-1.5 border-t border-slate-100 dark:border-slate-800">
                      <span className="font-semibold text-slate-900 dark:text-white text-[12.5px] tracking-tight">Net Payable Fee:</span>
                      <span className="text-[#2864E8] font-bold text-[16px] font-mono tabular-nums tracking-tight">
                        ₹{Number((selectedStudentProfile.feeType === "yearly_package"
                          ? (selectedStudentProfile.yearlyPackage?.totalYearlyFee || ((selectedStudentProfile.netFee ?? selectedStudentProfile.baseFee ?? 0) * 12))
                          : (selectedStudentProfile.netFee ?? selectedStudentProfile.baseFee)) ?? 0).toLocaleString('en-IN')}
                        <span className="text-[11px] font-normal text-slate-400 dark:text-slate-500 ml-0.5">
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
                        className={`text-[10.5px] uppercase font-semibold tracking-wider transition-colors cursor-pointer bg-transparent border-0 p-0 ${profileSubjectTab === 'enrolled'
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
                          className={`text-[10.5px] uppercase font-semibold tracking-wider transition-colors cursor-pointer bg-transparent border-0 p-0 ${profileSubjectTab === 'additional'
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
                                className="inline-flex items-center gap-1.5 text-[12px] font-medium text-slate-700 dark:text-slate-200"
                              >
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-500/80 dark:bg-blue-400/80 shrink-0" />
                                <span>{cleanSub}</span>
                              </span>
                            );
                          })
                        ) : (
                          <span className="text-slate-400 font-normal italic text-[11.5px]">No subjects selected</span>
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
                                className="inline-flex items-center gap-1.5 text-[12px] font-medium text-slate-700 dark:text-slate-200"
                              >
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-500/80 dark:bg-blue-400/80 shrink-0" />
                                <span>{cleanName}</span>
                              </span>
                            );
                          })
                        ) : (
                          <span className="text-slate-400 font-normal italic text-[11.5px]">No additional subjects</span>
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
                    className={`h-8 w-8 rounded-lg flex items-center justify-center transition-colors cursor-pointer focus:outline-none bg-transparent hover:bg-slate-100/70 dark:hover:bg-slate-800/70 ${(selectedMonth ? getStudentStatusForMonth(selectedStudentProfile, selectedMonth) : selectedStudentProfile.status) === "active"
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
                    className={`flex items-center gap-2.5 mb-1 ${statusOptionsModal.targetStatus === 'disabled' ? 'text-amber-600' : 'text-emerald-600'
                      }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${statusOptionsModal.targetStatus === 'disabled'
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
                    className={`w-full text-left p-3.5 rounded-xl border-2 transition-all cursor-pointer group ${statusOptionsModal.targetStatus === 'disabled'
                      ? 'border-amber-200 dark:border-amber-900/60 bg-amber-50/60 dark:bg-amber-950/30 hover:bg-amber-100/70 dark:hover:bg-amber-950/50 hover:border-amber-400'
                      : 'border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/60 dark:bg-emerald-950/30 hover:bg-emerald-100/70 dark:hover:bg-emerald-950/50 hover:border-emerald-400'
                      }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-105 transition-transform ${statusOptionsModal.targetStatus === 'disabled'
                          ? 'bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300'
                          : 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300'
                          }`}
                      >
                        <Calendar className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span
                            className={`font-bold text-xs sm:text-sm ${statusOptionsModal.targetStatus === 'disabled'
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
                            className={`text-[10px] font-bold ${statusOptionsModal.targetStatus === 'disabled'
                              ? 'bg-amber-100 text-amber-800 border-amber-300'
                              : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                              }`}
                          >
                            Month Specific
                          </Badge>
                        </div>
                        <p
                          className={`text-[11px] mt-1 leading-relaxed ${statusOptionsModal.targetStatus === 'disabled'
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
                    className={`w-full text-left p-3.5 rounded-xl border-2 transition-all cursor-pointer group ${statusOptionsModal.targetStatus === 'disabled'
                      ? 'border-rose-200 dark:border-rose-900/60 bg-rose-50/60 dark:bg-rose-950/30 hover:bg-rose-100/70 dark:hover:bg-rose-950/50 hover:border-rose-400'
                      : 'border-blue-200 dark:border-blue-900/60 bg-blue-50/60 dark:bg-blue-950/30 hover:bg-blue-100/70 dark:hover:bg-blue-950/50 hover:border-blue-400'
                      }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-105 transition-transform ${statusOptionsModal.targetStatus === 'disabled'
                          ? 'bg-rose-100 dark:bg-rose-900/60 text-rose-600'
                          : 'bg-blue-100 dark:bg-blue-900/60 text-blue-600'
                          }`}
                      >
                        <RotateCcw className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span
                            className={`font-bold text-xs sm:text-sm ${statusOptionsModal.targetStatus === 'disabled'
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
                            className={`text-[10px] font-bold ${statusOptionsModal.targetStatus === 'disabled'
                              ? 'bg-rose-100 text-rose-800 border-rose-300'
                              : 'bg-blue-100 text-blue-800 border-blue-300'
                              }`}
                          >
                            All Months
                          </Badge>
                        </div>
                        <p
                          className={`text-[11px] mt-1 leading-relaxed ${statusOptionsModal.targetStatus === 'disabled'
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
          <DialogContent overlayClassName="z-[120]" className="z-[121] max-w-[450px] w-[94vw] rounded-2xl p-4 sm:p-5 bg-white dark:bg-slate-950 text-left border border-slate-200/80 dark:border-slate-800 shadow-[0_20px_50px_-12px_rgba(15,23,42,0.12),0_4px_16px_rgba(15,23,42,0.04)] overflow-hidden font-['Inter_Tight',sans-serif]">
            <DialogHeader className="pb-2.5 border-b border-slate-100 dark:border-slate-800/80 shrink-0 space-y-1">
              <DialogTitle className="pr-9 text-[16px] sm:text-[17px] font-bold tracking-tight text-slate-900 dark:text-white leading-snug">
                Fee Mark as Unpaid / Revert
              </DialogTitle>
              <div className="flex items-center justify-between gap-3 pt-1">
                <DialogDescription className="text-[11.5px] text-slate-500 dark:text-slate-400 leading-normal">
                  Revert payment status to unpaid.
                </DialogDescription>
                {revertTargetPayments.length > 0 && (
                  <div className="flex items-center gap-1 -mr-1 shrink-0">
                    {/* 1. Print Icon -> Opens Receipt View Popup Modal */}
                    <button
                      type="button"
                      onClick={() => handleViewReceipt(revertTargetPayments[0])}
                      title="Print / View Fee Receipt"
                      className="w-6 h-6 inline-flex items-center justify-center rounded-md text-slate-400 dark:text-slate-500 hover:text-[#2864E8] dark:hover:text-blue-400 hover:bg-blue-50/80 dark:hover:bg-blue-950/40 transition-colors cursor-pointer"
                    >
                      <Printer className="w-3.5 h-3.5" />
                    </button>

                    {/* 2. Share Icon -> Direct Native Share Options (WhatsApp & Apps) */}
                    <button
                      type="button"
                      onClick={() => handleDirectWhatsAppShare(revertTargetPayments[0])}
                      title="Share Receipt (Direct Share Options)"
                      className="w-6 h-6 inline-flex items-center justify-center rounded-md text-slate-400 dark:text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50/80 dark:hover:bg-emerald-950/40 transition-colors cursor-pointer"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </DialogHeader>

            {revertTarget && (() => {
              const revertYearlyMeta = getYearlyPackageMeta(revertTarget.student, revertTarget.paidAmount);
              return (
                <div className="space-y-3 pt-2.5">
                  {/* Student & Fee Summary Card */}
                  <div className="p-3 rounded-xl bg-slate-50/50 dark:bg-slate-900/30 border border-slate-100 dark:border-slate-800/80 space-y-1.5 text-xs">
                    <div className="flex justify-between items-center gap-3 text-slate-500 dark:text-slate-400">
                      <span className="font-normal text-[12px] shrink-0">Student:</span>
                      <span className="font-medium text-slate-800 dark:text-slate-200 text-[12px] text-right truncate">
                        {revertTarget.student.name}{' '}
                        <span className="font-mono text-slate-500 dark:text-slate-400">
                          ({revertTarget.student.rollNumber})
                        </span>
                      </span>
                    </div>
                    {revertYearlyMeta && (
                      <div className="flex justify-between items-center gap-3 text-slate-500 dark:text-slate-400">
                        <span className="font-normal text-[12px] shrink-0">Fee Plan:</span>
                        <span className="font-medium text-slate-700 dark:text-slate-200 text-[12px] text-right">
                          Yearly Package ({revertYearlyMeta.courseMonths} Months)
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between items-center gap-3 text-slate-500 dark:text-slate-400">
                      <span className="font-normal text-[12px] shrink-0">Billing Month:</span>
                      <span className="font-medium text-slate-700 dark:text-slate-200 text-[12px] text-right">
                        {revertTarget.monthLabel}
                      </span>
                    </div>
                    <div className="flex justify-between items-center gap-3 text-slate-500 dark:text-slate-400">
                      <span className="font-normal text-[12px] shrink-0">Net Monthly Due:</span>
                      <span className="font-medium text-slate-700 dark:text-slate-200 font-mono tabular-nums text-[12px] text-right">
                        ₹{Number(revertTarget.netDueAmount ?? 0).toLocaleString('en-IN')}
                      </span>
                    </div>
                    {revertYearlyMeta && (
                      <div className="flex justify-between items-center gap-3 text-slate-500 dark:text-slate-400">
                        <span className="font-normal text-[12px] shrink-0">Yearly Package Total:</span>
                        <span className="font-medium text-slate-700 dark:text-slate-200 font-mono tabular-nums text-[12px] text-right">
                          ₹{Number(revertYearlyMeta.totalYearlyFee ?? 0).toLocaleString('en-IN')}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between items-center gap-3 pt-2 border-t border-slate-100 dark:border-slate-800/80 text-slate-500 dark:text-slate-400">
                      <span className="font-normal text-[12px] shrink-0">Currently Recorded Paid:</span>
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400 font-mono tabular-nums text-[13px] text-right">
                        ₹{Number(revertTarget.paidAmount ?? 0).toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div className="flex justify-between items-center gap-3 text-slate-500 dark:text-slate-400">
                      <span className="font-normal text-[12px] shrink-0">Current Status:</span>
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9.5px] font-semibold tracking-wider uppercase bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/50">
                        {revertTarget.status}
                      </span>
                    </div>
                  </div>

                  {/* Individual Receipts Breakdown */}
                  <div className="space-y-1.5">
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      Payment Receipts ({revertTargetPayments.length})
                    </div>

                    {revertTargetPayments.length === 0 ? (
                      <p className="text-xs text-slate-400 italic py-2.5 text-center bg-slate-50/50 dark:bg-slate-900/30 rounded-xl border border-dashed border-slate-200/80 dark:border-slate-800">
                        No individual receipts found for this month.
                      </p>
                    ) : (
                      <div className={`space-y-1.5 ${revertTargetPayments.length > 2 ? 'max-h-48 overflow-y-auto pr-1' : ''}`}>
                        {revertTargetPayments.map(pay => {
                          const isYearlyRef = pay.transactionRef === 'YEARLY-PACKAGE-LUMPSUM';
                          return (
                            <div
                              key={pay.id}
                              className="flex items-center justify-between px-3 py-2.5 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/40 dark:bg-slate-900/20 text-xs transition-colors hover:border-slate-200 dark:hover:border-slate-700"
                            >
                              <div className="space-y-0.5">
                                <div className="flex items-center gap-2">
                                  <span className="font-mono font-semibold text-slate-900 dark:text-white text-[12px]">{pay.receiptNumber}</span>
                                  <span className="text-[9.5px] uppercase font-semibold px-1.5 py-[1px] leading-tight rounded border border-slate-200/80 dark:border-slate-700 text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-800">
                                    {pay.paymentMode}
                                  </span>
                                  {(isYearlyRef || (pay.monthLabel || '').includes('Yearly Package')) && (
                                    <span className="text-[9px] uppercase font-semibold px-1.5 py-[1px] leading-tight rounded border border-slate-200/80 dark:border-slate-700 text-slate-600 dark:text-slate-300 bg-slate-100/70 dark:bg-slate-800/80">
                                      Yearly
                                    </span>
                                  )}
                                </div>
                                <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5 flex-wrap">
                                  <span>Date: <strong className="font-mono font-medium text-slate-700 dark:text-slate-200">{formatAdmDate(pay.paymentDate)}</strong></span>
                                  {isYearlyRef ? (
                                    <span>• {revertYearlyMeta ? `${revertYearlyMeta.courseMonths} Months Package` : 'Yearly Package'}</span>
                                  ) : pay.transactionRef ? (
                                    <span>• Ref: {pay.transactionRef}</span>
                                  ) : null}
                                </div>
                              </div>
                              <div className="flex items-center shrink-0 ml-3">
                                <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono text-[12.5px] tabular-nums">
                                  ₹{pay.amount.toLocaleString('en-IN')}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Master Option: Mark Entire Month Unpaid */}
                  <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800/80">
                    <Button
                      type="button"
                      disabled={isReverting}
                      onClick={handleMarkEntireMonthUnpaid}
                      className="w-full h-9 !rounded-[5px] text-xs font-semibold uppercase tracking-wider bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white shadow-[0_1px_2px_rgba(15,23,42,0.06)] flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                      {isReverting ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Processing Revert...</span>
                        </>
                      ) : (
                        <span>Mark Unpaid / Revert</span>
                      )}
                    </Button>
                  </div>
                </div>
              );
            })()}
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
                    Iske baad sabhi classes, batches, students, ledger records, aur receipts remove ho jayenge. System clear karne se pehle ek automatic backup save kar lega jise aap <strong>Restore</strong> button se wapas la sakte hain.
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

        <AlertDialog open={isRestoreConfirmOpen} onOpenChange={setIsRestoreConfirmOpen}>
          <AlertDialogContent className="max-w-md rounded-2xl p-6 bg-white dark:bg-slate-900">
            <AlertDialogHeader>
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 mb-1">
                <RotateCcw className="w-5 h-5" />
                <AlertDialogTitle className="text-base font-bold">
                  Restore Reset Fee Data?
                </AlertDialogTitle>
              </div>
              <AlertDialogDescription asChild className="text-xs text-slate-600 dark:text-slate-400">
                {resetBackupStatus.hasBackup && resetBackupStatus.counts ? (
                  <div className="space-y-2.5">
                    <p>
                      Last reset se pehle save kiya gaya backup snapshot wapas restore karein?
                    </p>
                    <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                      <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                        <span>Backup Saved</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                          {resetBackupStatus.savedAt && !Number.isNaN(new Date(resetBackupStatus.savedAt).getTime())
                            ? new Date(resetBackupStatus.savedAt).toLocaleString('en-IN', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              })
                            : 'Saved snapshot'}
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-1.5 pt-1 border-t border-slate-200/70 dark:border-slate-700/70 text-[11px]">
                        <div className="rounded-md bg-white dark:bg-slate-900 px-2 py-1 border border-slate-200/70 dark:border-slate-700">
                          <span className="text-slate-400 block">Classes</span>
                          <span className="font-bold text-slate-900 dark:text-white">{resetBackupStatus.counts.classes}</span>
                        </div>
                        <div className="rounded-md bg-white dark:bg-slate-900 px-2 py-1 border border-slate-200/70 dark:border-slate-700">
                          <span className="text-slate-400 block">Batches</span>
                          <span className="font-bold text-slate-900 dark:text-white">{resetBackupStatus.counts.batches}</span>
                        </div>
                        <div className="rounded-md bg-white dark:bg-slate-900 px-2 py-1 border border-slate-200/70 dark:border-slate-700">
                          <span className="text-slate-400 block">Students</span>
                          <span className="font-bold text-slate-900 dark:text-white">{resetBackupStatus.counts.students}</span>
                        </div>
                        <div className="rounded-md bg-white dark:bg-slate-900 px-2 py-1 border border-slate-200/70 dark:border-slate-700">
                          <span className="text-slate-400 block">Ledger</span>
                          <span className="font-bold text-slate-900 dark:text-white">{resetBackupStatus.counts.ledger}</span>
                        </div>
                        <div className="rounded-md bg-white dark:bg-slate-900 px-2 py-1 border border-slate-200/70 dark:border-slate-700 col-span-2">
                          <span className="text-slate-400 block">Payments / Receipts</span>
                          <span className="font-bold text-slate-900 dark:text-white">{resetBackupStatus.counts.payments}</span>
                        </div>
                      </div>
                    </div>
                    {(classes.length > 0 || students.length > 0) && (
                      <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200/70 text-amber-800 dark:text-amber-300 text-[11px] font-medium">
                        Note: Abhi system me {classes.length} classes aur {students.length} students maujood hain — restore karne par current data backup snapshot se replace ho jayega.
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">
                    Abhi tak koi reset backup snapshot save nahi hua hai. Jab aap <strong>Reset</strong> button se data clear karenge, usse pehle system automatic backup save kar lega jise aap yahan se restore kar sakte hain.
                  </div>
                )}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="pt-2">
              <AlertDialogCancel className="h-9 text-xs" disabled={isRestoringData}>
                {resetBackupStatus.hasBackup ? 'Cancel' : 'Close'}
              </AlertDialogCancel>
              {resetBackupStatus.hasBackup && (
                <AlertDialogAction
                  onClick={(e) => {
                    e.preventDefault();
                    handleRestoreResetData();
                  }}
                  disabled={isRestoringData}
                  className="h-9 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  {isRestoringData ? 'Restoring...' : 'Haan, Data Restore Karo'}
                </AlertDialogAction>
              )}
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
                  <DialogFooter className="pt-2.5 border-t border-slate-100 dark:border-slate-800 shrink-0">
                    <Button
                      type="submit"
                      disabled={transferModal.isSubmitting || isSameBatch || !transferModal.targetBatchId}
                      className="w-full h-9 !rounded-[5px] text-xs font-semibold uppercase tracking-wider bg-[#2864E8] hover:bg-[#1E4ED8] active:bg-[#1842BE] text-white shadow-[0_1px_2px_rgba(15,23,42,0.08)] flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
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
