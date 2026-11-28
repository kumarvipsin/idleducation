'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Script from 'next/script';
import { format } from 'date-fns';
import { useSearchParams } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Check,
  Edit,
  FileText,
  Send,
} from 'lucide-react';
import { getNextScholarshipId, registerForScholarship } from '@/app/actions/forms';
import { getPublicBranchClassCatalog } from '@/app/actions/fee-management';
import { normalizeBranchId } from '@/lib/branch-utils';
import {
  BOOK_DEMO_BRANCHES,
  formatBranchClassLabel,
  getClassesForBranchValue,
  getSubjectSelectorConfig,
  getTitlesForBranchClass,
  type BranchClassCatalogResult,
} from '@/lib/branch-courses';
import {
  formatFeeBadge,
  processRazorpayFeePayment,
  SCHOLARSHIP_APPLICATION_FEE_INR,
} from '@/lib/form-fees';
import { DemoSubjectSelector } from '@/components/demo-subject-selector';
import {
  clearScholarshipPreviewDraft,
  downloadScholarshipA4Pdf,
  loadScholarshipPreviewDraft,
  saveScholarshipPreviewDraft,
  SCHOLARSHIP_SUBMITTED_MESSAGE,
  ScholarshipA4Document,
  type ScholarshipPreviewDraftValues,
} from '@/components/scholarship/scholarship-a4-preview';
import { ScholarshipSubmissionDialogs } from '@/components/scholarship/scholarship-dialogs';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import {
  CleanFormCard,
  CleanMobileInput,
  CLEAN_ERROR_CLASS,
  CLEAN_INPUT_CLASS,
  CLEAN_SELECT_CONTENT_CLASS,
  CLEAN_SELECT_ITEM_CLASS,
  CLEAN_SELECT_TRIGGER_CLASS,
  toTitleCase,
} from '@/components/clean-form-card';

const phoneRegex = /^\d{10}$/;
const currentYear = new Date().getFullYear();

const STEPS = [
  { id: 1, title: 'Student Info' },
  { id: 2, title: 'Contact & Exam' },
  { id: 3, title: 'Form Review' },
] as const;

const SCHOLARSHIP_REASON_OPTIONS = [
  'Fee Concession / Tuition Scholarship',
  'Admission to JEE / NEET / CUET Coaching',
  'Board Exam Preparation (Class 9–12)',
  'Foundation Batch & Academic Guidance',
  'Academic Merit & Performance Assessment',
  'Other',
] as const;

const formatDobDigits = (digits: string, isDeleting: boolean): string => {
  if (!digits) return '';
  if (digits.length <= 2) {
    return digits.length === 2 && !isDeleting ? `${digits}-` : digits;
  }
  if (digits.length <= 4) {
    const mm = digits.slice(2);
    return digits.length === 4 && !isDeleting
      ? `${digits.slice(0, 2)}-${mm}-`
      : `${digits.slice(0, 2)}-${mm}`;
  }
  return `${digits.slice(0, 2)}-${digits.slice(2, 4)}-${digits.slice(4, 8)}`;
};

function isValidDobString(dobStr: string): boolean {
  const digits = dobStr.replace(/\D/g, '');
  if (digits.length !== 8) return false;
  const dayNum = parseInt(digits.slice(0, 2), 10);
  const monthNum = parseInt(digits.slice(2, 4), 10);
  const yearNum = parseInt(digits.slice(4, 8), 10);
  const candidate = new Date(yearNum, monthNum - 1, dayNum);
  return (
    monthNum >= 1 &&
    monthNum <= 12 &&
    dayNum >= 1 &&
    yearNum >= 1950 &&
    yearNum <= currentYear &&
    candidate.getFullYear() === yearNum &&
    candidate.getMonth() === monthNum - 1 &&
    candidate.getDate() === dayNum
  );
}

const scholarshipFormSchema = z
  .object({
    registrationId: z.string().optional().or(z.literal('')),
    studentName: z.string().min(2, { message: 'Student full name is required (min 2 letters).' }),
    fatherName: z.string().min(2, { message: 'Father name is required.' }),
    fatherOccupation: z.string().optional().or(z.literal('')),
    motherName: z.string().optional().or(z.literal('')),
    motherOccupation: z.string().optional().or(z.literal('')),
    dob: z
      .string()
      .min(1, { message: 'Date of birth is required (DD-MM-YYYY).' })
      .refine((val) => isValidDobString(val), {
        message: 'Enter a valid Date of Birth in DD-MM-YYYY format.',
      }),
    gender: z.enum(['male', 'female', 'other'], {
      required_error: 'Please select gender.',
    }),
    fatherPhone: z.string().regex(phoneRegex, { message: 'Enter a valid 10-digit father contact.' }),
    motherPhone: z
      .string()
      .regex(phoneRegex, { message: 'Enter a valid 10-digit mother contact.' })
      .optional()
      .or(z.literal('')),
    studentPhone: z
      .string()
      .regex(phoneRegex, { message: 'Enter a valid 10-digit student contact.' })
      .optional()
      .or(z.literal('')),
    email: z.string().email({ message: 'Enter a valid email address.' }).optional().or(z.literal('')),
    address: z.string().min(4, { message: 'Full residential address is required.' }),
    branch: z.string().min(1, { message: 'Please select preferred branch.' }),
    classCourse: z.string().min(1, { message: 'Please select a class or course.' }),
    programTitle: z.string().min(1, { message: 'Please select a class title.' }),
    targetStream: z.string().optional().or(z.literal('')),
    previousSchool: z.string().optional().or(z.literal('')),
    previousSubjects: z
      .string()
      .min(2, { message: 'Please enter the subject(s) you studied in your previous class.' }),
    previousMarks: z
      .string()
      .min(1, { message: 'Please enter your previous class marks or percentage.' }),
    scholarshipReason: z.string().min(1, { message: 'Please select why you are taking the scholarship exam.' }),
    customScholarshipReason: z.string().optional().or(z.literal('')),
  })
  .superRefine((data, ctx) => {
    if (
      data.scholarshipReason === 'Other' &&
      (!data.customScholarshipReason || data.customScholarshipReason.trim().length < 3)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Please specify your reason for taking the scholarship exam.',
        path: ['customScholarshipReason'],
      });
    }
  });

type ScholarshipFormValues = z.infer<typeof scholarshipFormSchema>;

interface ScholarshipFormClientProps {
  initialCatalog: BranchClassCatalogResult;
}

const CATALOG_REFRESH_THROTTLE_MS = 2500;

function resolveDeepLinkSelection(
  searchParams: Pick<URLSearchParams, 'get'>,
  catalog: BranchClassCatalogResult
): { branch: string; classCourse: string; programTitle: string } {
  const branchParam = searchParams.get('branch') || searchParams.get('center');
  const courseParam = searchParams.get('course') || searchParams.get('class');
  const titleParam = searchParams.get('title');

  let matchedBranchValue = '';
  if (branchParam) {
    const paramBranchId = normalizeBranchId(branchParam);
    const matchedBranch = BOOK_DEMO_BRANCHES.find((b) => {
      if (paramBranchId && normalizeBranchId(b) === paramBranchId) return true;
      const shortName = b.split(',')[0].toLowerCase();
      return (
        b.toLowerCase().includes(branchParam.toLowerCase()) ||
        branchParam.toLowerCase().includes(shortName)
      );
    });
    if (matchedBranch) {
      matchedBranchValue = matchedBranch;
    }
  }

  let matchedCourseValue = '';
  if (courseParam && matchedBranchValue) {
    const branchCourses = getClassesForBranchValue(catalog, matchedBranchValue);
    const normalizedCourseParam = formatBranchClassLabel(courseParam).toLowerCase();
    const matchedCourse = branchCourses.find(
      (c) =>
        c.toLowerCase() === normalizedCourseParam ||
        c.toLowerCase().replace(/[^a-z0-9]/g, '') === normalizedCourseParam.replace(/[^a-z0-9]/g, '')
    );
    if (matchedCourse) {
      matchedCourseValue = matchedCourse;
    }
  }

  let matchedTitleValue = '';
  if (matchedBranchValue && matchedCourseValue) {
    const availableTitles = getTitlesForBranchClass(catalog, matchedBranchValue, matchedCourseValue);
    if (titleParam) {
      const normalizedTitle = titleParam.trim().toLowerCase();
      const matched = availableTitles.find((t) => t.toLowerCase() === normalizedTitle);
      if (matched) matchedTitleValue = matched;
    } else if (availableTitles.length === 1) {
      matchedTitleValue = availableTitles[0];
    }
  }

  return {
    branch: matchedBranchValue,
    classCourse: matchedCourseValue,
    programTitle: matchedTitleValue,
  };
}

function ReviewDetailItem({
  label,
  value,
  className,
  valueClassName,
}: {
  label: string;
  value?: string | null;
  className?: string;
  valueClassName?: string;
}) {
  return (
    <div className={cn('min-w-0', className)}>
      <span className="block text-[10px] font-normal text-[#737373] dark:text-slate-400 leading-[1.35]">
        {label}
      </span>
      <span
        className={cn(
          'mt-0.5 block text-[12px] font-medium text-[#171717] dark:text-slate-100 leading-[1.45] break-words',
          valueClassName
        )}
      >
        {value?.trim() ? value : '—'}
      </span>
    </div>
  );
}

/** Compact 3-Step Scholarship Registration Wizard matching Admission Form UX & visuals. */
export default function ScholarshipFormClient({ initialCatalog }: ScholarshipFormClientProps) {
  const { toast } = useToast();
  const searchParams = useSearchParams();

  const [currentStep, setCurrentStep] = useState(1);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const [submittedSnapshot, setSubmittedSnapshot] = useState<ScholarshipPreviewDraftValues | null>(null);
  const [branchCatalog, setBranchCatalog] = useState<BranchClassCatalogResult>(initialCatalog);

  const lastFetchedAtRef = useRef<number>(0);
  const restoredFromDraftRef = useRef<boolean>(false);
  const printableSheetRef = useRef<HTMLDivElement | null>(null);

  const searchQueryKey = searchParams.toString();
  const initialDeepLink = useMemo(
    () => resolveDeepLinkSelection(searchParams, initialCatalog),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  const lastAppliedQueryRef = useRef<string>(searchQueryKey);

  const form = useForm<ScholarshipFormValues>({
    resolver: zodResolver(scholarshipFormSchema),
    defaultValues: {
      registrationId: '',
      studentName: '',
      fatherName: '',
      fatherOccupation: '',
      motherName: '',
      motherOccupation: '',
      dob: '',
      gender: undefined,
      fatherPhone: '',
      motherPhone: '',
      studentPhone: '',
      email: '',
      address: '',
      branch: initialDeepLink.branch,
      classCourse: initialDeepLink.classCourse,
      programTitle: initialDeepLink.programTitle,
      targetStream: '',
      previousSchool: '',
      previousSubjects: '',
      previousMarks: '',
      scholarshipReason: '',
      customScholarshipReason: '',
    },
  });

  const selectedBranch = form.watch('branch');
  const selectedClassCourse = form.watch('classCourse');
  const selectedProgramTitle = form.watch('programTitle');
  const selectedReason = form.watch('scholarshipReason');
  const dobValue = form.watch('dob');

  const availableCourses = useMemo(
    () => getClassesForBranchValue(branchCatalog, selectedBranch),
    [branchCatalog, selectedBranch]
  );

  const availableTitles = useMemo(
    () => getTitlesForBranchClass(branchCatalog, selectedBranch, selectedClassCourse),
    [branchCatalog, selectedBranch, selectedClassCourse]
  );

  const subjectConfig = useMemo(
    () => getSubjectSelectorConfig(selectedClassCourse, selectedProgramTitle),
    [selectedClassCourse, selectedProgramTitle]
  );

  const [selectedStreamSubjects, setSelectedStreamSubjects] = useState<string[]>([]);
  const lastStreamKeyRef = useRef<string>('');

  useEffect(() => {
    const nextKey = `${subjectConfig.mode}::${subjectConfig.heading}::${selectedProgramTitle}`;
    if (lastStreamKeyRef.current && lastStreamKeyRef.current !== nextKey) {
      setSelectedStreamSubjects([]);
      form.setValue('targetStream', '');
    }
    lastStreamKeyRef.current = nextKey;
  }, [subjectConfig.mode, subjectConfig.heading, selectedProgramTitle, form]);

  const refreshCatalog = useCallback(async (force = false) => {
    const now = Date.now();
    if (!force && now - lastFetchedAtRef.current < CATALOG_REFRESH_THROTTLE_MS) {
      return;
    }
    lastFetchedAtRef.current = now;
    try {
      const res = await getPublicBranchClassCatalog();
      if (res.success && res.data) {
        setBranchCatalog(res.data);
      }
    } catch {
      // Preserve last loaded catalog on transient network issues
    }
  }, []);

  useEffect(() => {
    void refreshCatalog(false);
    const handleFocus = () => {
      void refreshCatalog();
    };
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        void refreshCatalog();
      }
    };
    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibility);
    return () => {
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [refreshCatalog]);

  const assignFreshRegistrationId = useCallback(async () => {
    const res = await getNextScholarshipId();
    if (res.success && res.registrationId) {
      form.setValue('registrationId', res.registrationId);
    } else {
      form.setValue('registrationId', `SCH-${format(new Date(), 'ddMMyy')}-101`);
    }
  }, [form]);

  useEffect(() => {
    if (restoredFromDraftRef.current && form.getValues('registrationId')) return;
    void assignFreshRegistrationId();
  }, [assignFreshRegistrationId, form]);

  // Hydrate saved draft when returning from Preview tab (?draft=1)
  useEffect(() => {
    if (typeof window === 'undefined' || restoredFromDraftRef.current) return;
    const params = new URLSearchParams(window.location.search);
    if (params.get('draft') !== '1') return;

    const saved = loadScholarshipPreviewDraft();
    if (!saved?.values) return;
    restoredFromDraftRef.current = true;

    const v = saved.values;
    const restoredCfg = getSubjectSelectorConfig(v.classCourse || '', v.programTitle || '');
    lastStreamKeyRef.current = `${restoredCfg.mode}::${restoredCfg.heading}::${v.programTitle || ''}`;

    form.reset({
      ...form.getValues(),
      ...v,
      gender: v.gender as ScholarshipFormValues['gender'],
    });

    if (Array.isArray(v.selectedStreamSubjects) && v.selectedStreamSubjects.length > 0) {
      setSelectedStreamSubjects(v.selectedStreamSubjects);
    } else if (v.targetStream) {
      setSelectedStreamSubjects(v.targetStream.split(',').map((s) => s.trim()).filter(Boolean));
    }

    const targetStep = Number(params.get('step') || '3');
    if (targetStep >= 1 && targetStep <= 3) {
      setCurrentStep(targetStep);
    }
  }, [form]);

  // Reset form if submitted from the Preview tab
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleMessage = async (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      if (event.data?.type !== SCHOLARSHIP_SUBMITTED_MESSAGE) return;
      form.reset();
      setSelectedStreamSubjects([]);
      setCurrentStep(1);
      await assignFreshRegistrationId();
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [form, assignFreshRegistrationId]);

  useEffect(() => {
    if (lastAppliedQueryRef.current === searchQueryKey) return;
    lastAppliedQueryRef.current = searchQueryKey;

    const resolved = resolveDeepLinkSelection(searchParams, branchCatalog);
    if (resolved.branch) {
      form.setValue('branch', resolved.branch);
      form.setValue('classCourse', resolved.classCourse);
      form.setValue('programTitle', resolved.programTitle);
    }
  }, [searchQueryKey, searchParams, branchCatalog, form]);

  useEffect(() => {
    if (!selectedBranch) {
      if (selectedClassCourse) form.setValue('classCourse', '');
      if (selectedProgramTitle) form.setValue('programTitle', '');
      return;
    }

    if (selectedClassCourse && !availableCourses.includes(selectedClassCourse)) {
      form.setValue('classCourse', '');
      form.setValue('programTitle', '');
    }
  }, [selectedBranch, selectedClassCourse, selectedProgramTitle, availableCourses, form]);

  useEffect(() => {
    if (!selectedBranch || !selectedClassCourse) {
      if (selectedProgramTitle) form.setValue('programTitle', '');
      return;
    }

    if (availableTitles.length === 1) {
      if (selectedProgramTitle !== availableTitles[0]) {
        form.setValue('programTitle', availableTitles[0]);
        form.clearErrors('programTitle');
      }
      return;
    }

    if (selectedProgramTitle && !availableTitles.includes(selectedProgramTitle)) {
      form.setValue('programTitle', '');
    }
  }, [selectedBranch, selectedClassCourse, selectedProgramTitle, availableTitles, form]);

  const scrollStepTop = useCallback(() => {
    if (typeof window !== 'undefined' && window.scrollY > 180) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep((prev) => prev + 1);
      scrollStepTop();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      scrollStepTop();
    }
  };

  const handleStepClick = (targetStep: number) => {
    setCurrentStep(targetStep);
    scrollStepTop();
  };

  const handleDobChange = useCallback(
    (rawValue: string) => {
      const prev = dobValue || '';
      const isDeleting = rawValue.length < prev.length;
      let digits = rawValue.replace(/\D/g, '').slice(0, 8);
      if (isDeleting && prev.endsWith('-') && rawValue === prev.slice(0, -1)) {
        digits = digits.slice(0, -1);
      }
      const formatted = formatDobDigits(digits, isDeleting);
      form.setValue('dob', formatted, { shouldValidate: digits.length === 8 });
      if (digits.length < 8) {
        form.clearErrors('dob');
      }
    },
    [dobValue, form]
  );

  const buildDraftPayload = useCallback((): {
    values: ScholarshipPreviewDraftValues;
    applicationDate: string;
    savedAt: number;
  } => {
    const v = form.getValues();
    return {
      values: {
        ...v,
        registrationId: v.registrationId || `SCH-${format(new Date(), 'ddMMyy')}-101`,
        selectedStreamSubjects,
        feeAmount: SCHOLARSHIP_APPLICATION_FEE_INR,
      },
      applicationDate: format(new Date(), 'dd MMMM yyyy'),
      savedAt: Date.now(),
    };
  }, [form, selectedStreamSubjects]);

  const validateAllCompulsoryFields = async (): Promise<boolean> => {
    const isBasicValid = await form.trigger([
      'branch',
      'studentName',
      'fatherName',
      'dob',
      'gender',
      'classCourse',
      'programTitle',
      'fatherPhone',
      'address',
      'previousSubjects',
      'previousMarks',
      'scholarshipReason',
    ]);

    if (form.getValues('motherPhone')) await form.trigger('motherPhone');
    if (form.getValues('studentPhone')) await form.trigger('studentPhone');
    if (form.getValues('email')) await form.trigger('email');
    if (form.getValues('scholarshipReason') === 'Other') {
      await form.trigger('customScholarshipReason');
    }

    if (subjectConfig.mode === 'stream' && !form.getValues('targetStream')?.trim()) {
      form.setError('targetStream', {
        type: 'manual',
        message: 'Please select target subject(s) / stream.',
      });
    }

    const errors = form.formState.errors;
    if (!isBasicValid || Object.keys(errors).length > 0) {
      const step1Fields: (keyof ScholarshipFormValues)[] = [
        'branch',
        'studentName',
        'fatherName',
        'fatherOccupation',
        'motherName',
        'motherOccupation',
        'dob',
        'gender',
        'classCourse',
        'programTitle',
        'targetStream',
      ];
      const step2Fields: (keyof ScholarshipFormValues)[] = [
        'fatherPhone',
        'motherPhone',
        'studentPhone',
        'email',
        'address',
        'previousSchool',
        'previousSubjects',
        'previousMarks',
        'scholarshipReason',
        'customScholarshipReason',
      ];

      if (step1Fields.some((f) => errors[f])) {
        setCurrentStep(1);
      } else if (step2Fields.some((f) => errors[f])) {
        setCurrentStep(2);
      }
      scrollStepTop();

      const firstKey = Object.keys(errors)[0] as keyof ScholarshipFormValues;
      const errorMsg = firstKey
        ? (errors[firstKey]?.message as string)
        : 'Please complete all compulsory fields marked with (*).';

      toast({
        variant: 'destructive',
        title: 'Compulsory Fields Missing',
        description: errorMsg || 'Please fill all required fields before proceeding.',
      });
      return false;
    }

    return true;
  };

  const handlePreview = async () => {
    const isValid = await validateAllCompulsoryFields();
    if (!isValid) return;

    saveScholarshipPreviewDraft(buildDraftPayload());
    form.clearErrors();
    const previewWin = window.open('/scholarship/preview', '_blank');
    if (!previewWin) {
      window.location.assign('/scholarship/preview');
    }
  };

  const submitFinalScholarship: (
    data: ScholarshipFormValues,
    paymentMeta: { transactionId: string; feeAmount: number; paymentStatus: 'free_waived' | 'paid' }
  ) => Promise<void> = async (data, paymentMeta) => {
    setIsSubmitting(true);
    try {
      const resolvedReason =
        data.scholarshipReason === 'Other'
          ? data.customScholarshipReason?.trim() || 'Other'
          : data.scholarshipReason;

      const combinedSubjects = data.targetStream?.trim()
        ? `${data.previousSubjects.trim()} (Target: ${data.targetStream.trim()})`
        : data.previousSubjects.trim();

      const regId = data.registrationId?.trim() || `SCH-${format(new Date(), 'ddMMyy')}-101`;

      const result = await registerForScholarship({
        registrationId: regId,
        mode: 'Offline',
        studentName: data.studentName,
        fatherName: data.fatherName,
        guardianName: data.fatherName,
        fatherOccupation: data.fatherOccupation || '',
        motherName: data.motherName || '',
        motherOccupation: data.motherOccupation || '',
        dob: data.dob,
        gender: data.gender,
        fatherPhone: data.fatherPhone,
        motherPhone: data.motherPhone || '',
        studentPhone: data.studentPhone || '',
        mobile: data.fatherPhone,
        email: data.email || '',
        address: data.address,
        branch: data.branch,
        class: data.classCourse,
        programTitle: data.programTitle,
        subjects: combinedSubjects,
        previousSchool: data.previousSchool || '',
        previousSubjects: data.previousSubjects,
        previousMarks: data.previousMarks,
        scholarshipReason: resolvedReason,
        feeAmount: paymentMeta.feeAmount,
        paymentStatus: paymentMeta.paymentStatus,
        transactionId: paymentMeta.transactionId,
        message: `Marks: ${data.previousMarks.trim()} • Studied: ${data.previousSubjects.trim()} • Purpose: ${resolvedReason}`,
        state: 'Delhi',
        country: 'India',
      });

      if (result.success) {
        const snapshot: ScholarshipPreviewDraftValues = {
          ...data,
          registrationId: result.registrationId || regId,
          selectedStreamSubjects,
          feeAmount: paymentMeta.feeAmount,
          transactionId: paymentMeta.transactionId,
        };
        clearScholarshipPreviewDraft();
        setSubmittedSnapshot(snapshot);
        setIsSuccessOpen(true);
        form.reset();
        setSelectedStreamSubjects([]);
        setCurrentStep(1);
        await assignFreshRegistrationId();
      } else {
        toast({
          variant: 'destructive',
          title: 'Submission Failed',
          description: result.message || 'Something went wrong. Please try again.',
        });
      }
    } catch {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Something went wrong. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePayment = async () => {
    setIsSubmitting(true);
    await processRazorpayFeePayment({
      amountInr: SCHOLARSHIP_APPLICATION_FEE_INR,
      description: 'Scholarship Exam Registration Fee',
      prefill: {
        name: form.getValues('studentName') || '',
        email: form.getValues('email') || '',
        contact: form.getValues('fatherPhone') || form.getValues('studentPhone') || '',
      },
      onPaid: async ({ transactionId, feeAmount, paymentStatus }) => {
        setIsPaymentDialogOpen(false);
        await submitFinalScholarship(form.getValues(), {
          transactionId,
          feeAmount,
          paymentStatus,
        });
      },
      onError: (title, description) => {
        toast({ variant: 'destructive', title, description });
      },
      onDismiss: () => {
        setIsSubmitting(false);
      },
    });
  };

  const handleDownloadConfirmedPdf = async () => {
    if (!printableSheetRef.current || !submittedSnapshot || isDownloadingPdf) return;
    setIsDownloadingPdf(true);
    try {
      await downloadScholarshipA4Pdf(printableSheetRef.current, submittedSnapshot.studentName);
    } catch {
      toast({
        variant: 'destructive',
        title: 'PDF Generation Failed',
        description: 'Please try again.',
      });
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  const classPlaceholder = !selectedBranch
    ? 'Select Branch First *'
    : availableCourses.length === 0
      ? 'No classes available'
      : 'Class / Course *';

  const titlePlaceholder = !selectedBranch || !selectedClassCourse
    ? 'Select Class First *'
    : availableTitles.length === 0
      ? 'No titles available'
      : 'Class Title *';

  const activeValues = form.watch();
  const resolvedReviewPurpose =
    activeValues.scholarshipReason === 'Other'
      ? activeValues.customScholarshipReason?.trim() || 'Other'
      : activeValues.scholarshipReason;

  return (
    <>
      <Script id="razorpay-checkout-scholarship-js" src="https://checkout.razorpay.com/v1/checkout.js" />

      <CleanFormCard
        title="Scholarship Form 2026–27"
        subtitle="Complete your scholarship registration in 3 simple steps."
        maxWidthClass="max-w-[600px] sm:max-w-[640px]"
        bodyClassName="p-0"
        dataAttr="data-scholarship-card"
      >
        <Form {...form}>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex flex-col"
            autoComplete="off"
          >
            {/* 3-Step Progress Stepper matching Admission Form */}
            <div className="px-4 sm:px-7 py-2.5 border-b border-slate-100 dark:border-slate-800 bg-[#F8FAFD]/65 dark:bg-slate-900/45 shrink-0">
              <div className="max-w-[330px] sm:max-w-[390px] mx-auto flex items-center justify-between relative">
                <div className="absolute left-7 right-7 sm:left-9 sm:right-9 top-[12px] sm:top-[13px] h-[1.5px] bg-slate-200/80 dark:bg-slate-800 -translate-y-1/2 z-0 overflow-hidden">
                  <div
                    className="h-full bg-[#2864E8] transition-all duration-300"
                    style={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }}
                  />
                </div>

                {STEPS.map((s) => {
                  const isCompleted = currentStep > s.id;
                  const isStepActive = currentStep === s.id;

                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => handleStepClick(s.id)}
                      className="relative z-10 flex flex-col items-center group cursor-pointer focus:outline-none"
                    >
                      <div
                        className={cn(
                          'w-6 h-6 sm:w-[26px] sm:h-[26px] rounded-full flex items-center justify-center text-[11px] font-semibold transition-all duration-200',
                          isCompleted
                            ? 'bg-[#EEF4FF] dark:bg-blue-950/70 text-[#2864E8] dark:text-blue-400 border border-[#2864E8]/35'
                            : isStepActive
                              ? 'bg-[#2864E8] text-white ring-2 ring-[#2864E8]/15'
                              : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500 group-hover:border-[#2864E8]/50'
                        )}
                      >
                        {isCompleted ? <Check className="w-3 h-3 stroke-[2.5]" /> : <span>{s.id}</span>}
                      </div>
                      <span
                        className={cn(
                          'text-[11px] sm:text-[11.5px] mt-1 leading-tight tracking-normal transition-colors',
                          isStepActive
                            ? 'text-[#2864E8] dark:text-blue-400 font-semibold'
                            : isCompleted
                              ? 'text-slate-700 dark:text-slate-300 font-medium'
                              : 'text-slate-400 dark:text-slate-500 font-normal'
                        )}
                      >
                        {s.title}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Form Steps */}
            <AnimatePresence mode="wait">
              {/* STEP 1 — Student Info */}
              {currentStep === 1 && (
                <motion.div
                  key="scholarship-step-1"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="px-4 sm:px-7 pt-4 pb-5 space-y-3.5 text-left"
                >
                  {/* Row 1: Provisional Reg. ID & Preferred Branch */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                    <FormField
                      control={form.control}
                      name="registrationId"
                      render={({ field }) => (
                        <FormItem className="space-y-0 text-left">
                          <FormLabel className="sr-only">Registration ID</FormLabel>
                          <FormControl>
                            <div className="flex items-center h-[42px] border-b border-slate-200 dark:border-slate-700/85">
                              <span className="text-[12px] sm:text-[12.5px] font-semibold text-slate-500 dark:text-slate-400 mr-2 shrink-0 select-none">
                                ID:
                              </span>
                              <Input
                                {...field}
                                readOnly
                                placeholder="Reg ID"
                                className="h-full border-0 bg-transparent text-[13px] sm:text-[13.5px] font-bold text-[#2864E8] dark:text-blue-400 font-mono tracking-tight focus-visible:ring-0 focus-visible:ring-offset-0 focus:ring-0 focus:outline-none px-0 cursor-default select-all shadow-none"
                              />
                            </div>
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="branch"
                      render={({ field }) => (
                        <FormItem className="space-y-0 text-left">
                          <FormLabel className="sr-only">Preferred Branch</FormLabel>
                          <Select
                            onValueChange={(val) => {
                              field.onChange(val);
                              form.clearErrors('branch');
                              const nextCourses = getClassesForBranchValue(branchCatalog, val);
                              const currentCourse = form.getValues('classCourse');
                              if (currentCourse && !nextCourses.includes(currentCourse)) {
                                form.setValue('classCourse', '');
                                form.setValue('programTitle', '');
                              } else if (currentCourse) {
                                const nextTitles = getTitlesForBranchClass(branchCatalog, val, currentCourse);
                                const currentTitle = form.getValues('programTitle');
                                if (nextTitles.length === 1) {
                                  form.setValue('programTitle', nextTitles[0]);
                                } else if (currentTitle && !nextTitles.includes(currentTitle)) {
                                  form.setValue('programTitle', '');
                                }
                              }
                              void refreshCatalog();
                            }}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className={CLEAN_SELECT_TRIGGER_CLASS}>
                                <SelectValue placeholder="Preferred Branch *" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className={CLEAN_SELECT_CONTENT_CLASS}>
                              {BOOK_DEMO_BRANCHES.map((b) => (
                                <SelectItem key={b} value={b} className={CLEAN_SELECT_ITEM_CLASS}>
                                  {b}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage className={CLEAN_ERROR_CLASS} />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Row 2: Student Full Name */}
                  <FormField
                    control={form.control}
                    name="studentName"
                    render={({ field }) => (
                      <FormItem className="space-y-0 text-left">
                        <FormLabel className="sr-only">Student Full Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Student Full Name *"
                            {...field}
                            onChange={(e) => field.onChange(toTitleCase(e.target.value))}
                            className={CLEAN_INPUT_CLASS}
                          />
                        </FormControl>
                        <FormMessage className={CLEAN_ERROR_CLASS} />
                      </FormItem>
                    )}
                  />

                  {/* Row 3: Father Name & Occupation */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                    <FormField
                      control={form.control}
                      name="fatherName"
                      render={({ field }) => (
                        <FormItem className="space-y-0 text-left">
                          <FormLabel className="sr-only">Father Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Father Name *"
                              {...field}
                              onChange={(e) => field.onChange(toTitleCase(e.target.value))}
                              className={CLEAN_INPUT_CLASS}
                            />
                          </FormControl>
                          <FormMessage className={CLEAN_ERROR_CLASS} />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="fatherOccupation"
                      render={({ field }) => (
                        <FormItem className="space-y-0 text-left">
                          <FormLabel className="sr-only">Father Occupation</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Father Occupation (Optional)"
                              {...field}
                              onChange={(e) => field.onChange(toTitleCase(e.target.value))}
                              className={CLEAN_INPUT_CLASS}
                            />
                          </FormControl>
                          <FormMessage className={CLEAN_ERROR_CLASS} />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Row 4: Mother Name & Occupation */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                    <FormField
                      control={form.control}
                      name="motherName"
                      render={({ field }) => (
                        <FormItem className="space-y-0 text-left">
                          <FormLabel className="sr-only">Mother Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Mother Name (Optional)"
                              {...field}
                              onChange={(e) => field.onChange(toTitleCase(e.target.value))}
                              className={CLEAN_INPUT_CLASS}
                            />
                          </FormControl>
                          <FormMessage className={CLEAN_ERROR_CLASS} />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="motherOccupation"
                      render={({ field }) => (
                        <FormItem className="space-y-0 text-left">
                          <FormLabel className="sr-only">Mother Occupation</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Mother Occupation (Optional)"
                              {...field}
                              onChange={(e) => field.onChange(toTitleCase(e.target.value))}
                              className={CLEAN_INPUT_CLASS}
                            />
                          </FormControl>
                          <FormMessage className={CLEAN_ERROR_CLASS} />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Row 5: Date of Birth & Gender */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                    <FormField
                      control={form.control}
                      name="dob"
                      render={({ field }) => (
                        <FormItem className="space-y-0 text-left">
                          <FormLabel className="sr-only">Date of Birth (DD-MM-YYYY)</FormLabel>
                          <FormControl>
                            <div className="relative h-[42px] w-full flex items-center">
                              <Calendar className="w-4 h-4 text-[#7A8CA8] absolute left-0 top-1/2 -translate-y-1/2 shrink-0 pointer-events-none" />
                              <Input
                                type="text"
                                inputMode="numeric"
                                maxLength={10}
                                placeholder="Date of Birth (DD-MM-YYYY) *"
                                aria-label="Date of Birth (DD-MM-YYYY)"
                                value={field.value}
                                onChange={(e) => handleDobChange(e.target.value)}
                                className={`${CLEAN_INPUT_CLASS} pl-[26px] tabular-nums`}
                              />
                            </div>
                          </FormControl>
                          <FormMessage className={CLEAN_ERROR_CLASS} />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="gender"
                      render={({ field }) => (
                        <FormItem className="space-y-0 text-left">
                          <FormLabel className="sr-only">Gender</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className={CLEAN_SELECT_TRIGGER_CLASS}>
                                <SelectValue placeholder="Gender *" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className={CLEAN_SELECT_CONTENT_CLASS}>
                              <SelectItem value="male" className={CLEAN_SELECT_ITEM_CLASS}>
                                Male
                              </SelectItem>
                              <SelectItem value="female" className={CLEAN_SELECT_ITEM_CLASS}>
                                Female
                              </SelectItem>
                              <SelectItem value="other" className={CLEAN_SELECT_ITEM_CLASS}>
                                Other
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage className={CLEAN_ERROR_CLASS} />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Row 6: Class / Course & Class Title */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                    <FormField
                      control={form.control}
                      name="classCourse"
                      render={({ field }) => (
                        <FormItem className="space-y-0 text-left">
                          <FormLabel className="sr-only">Class / Course</FormLabel>
                          <Select
                            key={selectedBranch || 'no-branch'}
                            disabled={!selectedBranch || availableCourses.length === 0}
                            onValueChange={(val) => {
                              field.onChange(val);
                              form.clearErrors('classCourse');
                              const nextTitles = getTitlesForBranchClass(branchCatalog, selectedBranch, val);
                              if (nextTitles.length === 1) {
                                form.setValue('programTitle', nextTitles[0]);
                                form.clearErrors('programTitle');
                              } else {
                                form.setValue('programTitle', '');
                              }
                            }}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger
                                className={cn(
                                  CLEAN_SELECT_TRIGGER_CLASS,
                                  (!selectedBranch || availableCourses.length === 0) && 'cursor-not-allowed opacity-65'
                                )}
                              >
                                <SelectValue placeholder={classPlaceholder} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className={CLEAN_SELECT_CONTENT_CLASS}>
                              {availableCourses.map((courseName) => (
                                <SelectItem key={courseName} value={courseName} className={CLEAN_SELECT_ITEM_CLASS}>
                                  {courseName}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage className={CLEAN_ERROR_CLASS} />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="programTitle"
                      render={({ field }) => (
                        <FormItem className="space-y-0 text-left">
                          <FormLabel className="sr-only">Class Title</FormLabel>
                          <Select
                            key={`${selectedBranch || 'no-branch'}::${selectedClassCourse || 'no-class'}`}
                            disabled={!selectedBranch || !selectedClassCourse || availableTitles.length === 0}
                            onValueChange={(val) => {
                              field.onChange(val);
                              form.clearErrors('programTitle');
                            }}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger
                                className={cn(
                                  CLEAN_SELECT_TRIGGER_CLASS,
                                  (!selectedBranch || !selectedClassCourse || availableTitles.length === 0) &&
                                    'cursor-not-allowed opacity-65'
                                )}
                              >
                                <SelectValue placeholder={titlePlaceholder} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className={CLEAN_SELECT_CONTENT_CLASS}>
                              {availableTitles.map((titleOption) => (
                                <SelectItem key={titleOption} value={titleOption} className={CLEAN_SELECT_ITEM_CLASS}>
                                  {titleOption}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage className={CLEAN_ERROR_CLASS} />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Row 7: Target Subject(s) / Stream when applicable */}
                  {subjectConfig.mode === 'stream' && (
                    <FormField
                      control={form.control}
                      name="targetStream"
                      render={({ field }) => (
                        <FormItem className="space-y-0 text-left pt-0.5">
                          <FormLabel className="sr-only">{subjectConfig.heading}</FormLabel>
                          <DemoSubjectSelector
                            config={subjectConfig}
                            selectedSubjects={selectedStreamSubjects}
                            onChange={(next) => {
                              setSelectedStreamSubjects(next);
                              field.onChange(next.join(', '));
                              if (next.length > 0) {
                                form.clearErrors('targetStream');
                              }
                            }}
                            variant="underline"
                          />
                          <FormMessage className={CLEAN_ERROR_CLASS} />
                        </FormItem>
                      )}
                    />
                  )}
                </motion.div>
              )}

              {/* STEP 2 — Contact, Address & Exam Details */}
              {currentStep === 2 && (
                <motion.div
                  key="scholarship-step-2"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="px-4 sm:px-7 pt-4 pb-5 space-y-3.5 text-left"
                >
                  {/* Row 1: Father & Mother Contacts */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                    <FormField
                      control={form.control}
                      name="fatherPhone"
                      render={({ field }) => (
                        <FormItem className="space-y-0 text-left">
                          <FormLabel className="sr-only">Father Contact</FormLabel>
                          <FormControl>
                            <CleanMobileInput
                              value={field.value}
                              onDigitsChange={field.onChange}
                              placeholder="Father Contact *"
                            />
                          </FormControl>
                          <FormMessage className={CLEAN_ERROR_CLASS} />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="motherPhone"
                      render={({ field }) => (
                        <FormItem className="space-y-0 text-left">
                          <FormLabel className="sr-only">Mother Contact</FormLabel>
                          <FormControl>
                            <CleanMobileInput
                              value={field.value || ''}
                              onDigitsChange={field.onChange}
                              placeholder="Mother Contact (Optional)"
                            />
                          </FormControl>
                          <FormMessage className={CLEAN_ERROR_CLASS} />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Row 2: Student Contact & Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                    <FormField
                      control={form.control}
                      name="studentPhone"
                      render={({ field }) => (
                        <FormItem className="space-y-0 text-left">
                          <FormLabel className="sr-only">Student Contact</FormLabel>
                          <FormControl>
                            <CleanMobileInput
                              value={field.value || ''}
                              onDigitsChange={field.onChange}
                              placeholder="Student Contact (Optional)"
                            />
                          </FormControl>
                          <FormMessage className={CLEAN_ERROR_CLASS} />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem className="space-y-0 text-left">
                          <FormLabel className="sr-only">Email Address</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="Email Address (Optional)"
                              {...field}
                              className={CLEAN_INPUT_CLASS}
                            />
                          </FormControl>
                          <FormMessage className={CLEAN_ERROR_CLASS} />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Row 3: Full Residential Address */}
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem className="space-y-0 text-left">
                        <FormLabel className="sr-only">Full Residential Address</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Full Residential Address *"
                            {...field}
                            onChange={(e) => field.onChange(toTitleCase(e.target.value))}
                            className={CLEAN_INPUT_CLASS}
                          />
                        </FormControl>
                        <FormMessage className={CLEAN_ERROR_CLASS} />
                      </FormItem>
                    )}
                  />

                  {/* Row 4: Previous School Name */}
                  <FormField
                    control={form.control}
                    name="previousSchool"
                    render={({ field }) => (
                      <FormItem className="space-y-0 text-left">
                        <FormLabel className="sr-only">Your Previous School Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Your Previous School Name (Optional)"
                            {...field}
                            onChange={(e) => field.onChange(toTitleCase(e.target.value))}
                            className={CLEAN_INPUT_CLASS}
                          />
                        </FormControl>
                        <FormMessage className={CLEAN_ERROR_CLASS} />
                      </FormItem>
                    )}
                  />

                  {/* Row 5: Subjects Studied & Previous Marks */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                    <FormField
                      control={form.control}
                      name="previousSubjects"
                      render={({ field }) => (
                        <FormItem className="space-y-0 text-left">
                          <FormLabel className="sr-only">Subjects Studied in Previous Class</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Subjects You Studied (Previous Class) *"
                              {...field}
                              onChange={(e) => field.onChange(toTitleCase(e.target.value))}
                              className={CLEAN_INPUT_CLASS}
                            />
                          </FormControl>
                          <FormMessage className={CLEAN_ERROR_CLASS} />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="previousMarks"
                      render={({ field }) => (
                        <FormItem className="space-y-0 text-left">
                          <FormLabel className="sr-only">Previous Class Marks or Percentage</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Previous Class Marks / % (e.g., 85%) *"
                              {...field}
                              onChange={(e) => field.onChange(toTitleCase(e.target.value))}
                              className={CLEAN_INPUT_CLASS}
                            />
                          </FormControl>
                          <FormMessage className={CLEAN_ERROR_CLASS} />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Row 6: Why taking the Scholarship Exam? */}
                  <FormField
                    control={form.control}
                    name="scholarshipReason"
                    render={({ field }) => (
                      <FormItem className="space-y-0 text-left">
                        <FormLabel className="sr-only">Why do you want to take the Scholarship Exam?</FormLabel>
                        <Select
                          onValueChange={(val) => {
                            field.onChange(val);
                            form.clearErrors('scholarshipReason');
                            if (val !== 'Other') {
                              form.setValue('customScholarshipReason', '');
                              form.clearErrors('customScholarshipReason');
                            }
                          }}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className={CLEAN_SELECT_TRIGGER_CLASS}>
                              <SelectValue placeholder="Why do you want to take the Scholarship Exam? *" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className={CLEAN_SELECT_CONTENT_CLASS}>
                            {SCHOLARSHIP_REASON_OPTIONS.map((reason) => (
                              <SelectItem key={reason} value={reason} className={CLEAN_SELECT_ITEM_CLASS}>
                                {reason === 'Other' ? 'Other (Please Specify)' : reason}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage className={CLEAN_ERROR_CLASS} />
                      </FormItem>
                    )}
                  />

                  {selectedReason === 'Other' && (
                    <FormField
                      control={form.control}
                      name="customScholarshipReason"
                      render={({ field }) => (
                        <FormItem className="space-y-0 text-left">
                          <FormLabel className="sr-only">Specify Scholarship Exam Purpose</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Please specify why you want to take the scholarship exam *"
                              {...field}
                              onChange={(e) => field.onChange(toTitleCase(e.target.value))}
                              className={CLEAN_INPUT_CLASS}
                            />
                          </FormControl>
                          <FormMessage className={CLEAN_ERROR_CLASS} />
                        </FormItem>
                      )}
                    />
                  )}
                </motion.div>
              )}

              {/* STEP 3 — Clean Institutional Form Review matching Admission Form */}
              {currentStep === 3 && (
                <motion.div
                  key="scholarship-step-3"
                  data-scholarship-review-panel="true"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="px-4 sm:px-7 pt-3.5 pb-4 space-y-3 text-left bg-white dark:bg-slate-950"
                >
                  {/* Student & Exam Summary Strip */}
                  <div className="rounded-lg bg-[#F8FAFD] dark:bg-slate-900/55 border border-[#E6EEF8] dark:border-slate-800/90 px-4 py-2.5 flex items-center justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                        <h4 className="text-[14.5px] sm:text-[15px] font-semibold text-[#171717] dark:text-white leading-snug truncate">
                          {activeValues.studentName || 'Student Name —'}
                        </h4>
                        <span className="inline-flex items-center text-[10.5px] font-medium font-mono text-[#475569] dark:text-slate-300 bg-[#E9EFF8] dark:bg-slate-800 px-2 py-0.5 rounded-[4px] shrink-0">
                          {activeValues.registrationId || 'SCH-2026'}
                        </span>
                        <span className="inline-flex items-center text-[10.5px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-[4px] shrink-0">
                          Fee: {formatFeeBadge(SCHOLARSHIP_APPLICATION_FEE_INR)}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-[11.5px] text-[#525252] dark:text-slate-300 mt-0.5 leading-snug">
                        <span className="font-medium text-[#262626] dark:text-slate-200">
                          {activeValues.branch?.split(',')[0] || 'Branch —'}
                        </span>
                        {activeValues.classCourse && (
                          <>
                            <span className="text-neutral-300 dark:text-slate-700" aria-hidden="true">•</span>
                            <span>
                              {activeValues.classCourse}
                              {activeValues.programTitle ? ` — ${activeValues.programTitle}` : ''}
                            </span>
                          </>
                        )}
                      </div>
                      {activeValues.targetStream && (
                        <p className="text-[11px] text-[#737373] dark:text-slate-400 mt-0.5 leading-snug">
                          <span>Target Subjects: </span>
                          <span className="font-medium text-[#262626] dark:text-slate-200">
                            {activeValues.targetStream}
                          </span>
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Section 1: Student & Parent Details */}
                  <section className="rounded-lg border border-neutral-200/90 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-3">
                    <div className="flex items-center justify-between gap-2 mb-2.5">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="w-[18px] h-[18px] rounded-full border border-neutral-300 dark:border-slate-700 text-[9.5px] font-semibold text-[#262626] dark:text-slate-200 flex items-center justify-center shrink-0">
                          1
                        </span>
                        <h3 className="text-[9.5px] sm:text-[10.5px] font-semibold uppercase tracking-[0.02em] sm:tracking-[0.03em] text-[#171717] dark:text-slate-100 leading-tight">
                          Student &amp; Parent Details
                        </h3>
                      </div>
                      <button
                        type="button"
                        onClick={() => setCurrentStep(1)}
                        className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] font-medium text-[#2864E8] dark:text-blue-400 hover:bg-blue-50/70 dark:hover:bg-blue-950/40 transition-colors cursor-pointer shrink-0"
                      >
                        <Edit className="w-3 h-3" /> Edit
                      </button>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2.5">
                      <ReviewDetailItem label="Date of Birth" value={activeValues.dob} valueClassName="tabular-nums" />
                      <ReviewDetailItem label="Gender" value={activeValues.gender} valueClassName="capitalize" />
                      <ReviewDetailItem label="Father Name" value={activeValues.fatherName} />
                      <ReviewDetailItem label="Father Occupation" value={activeValues.fatherOccupation} />
                      <ReviewDetailItem label="Mother Name" value={activeValues.motherName} />
                      <ReviewDetailItem label="Mother Occupation" value={activeValues.motherOccupation} />
                    </div>
                  </section>

                  {/* Section 2: Contact, Address & Exam Details */}
                  <section className="rounded-lg border border-neutral-200/90 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-3">
                    <div className="flex items-center justify-between gap-2 mb-2.5">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="w-[18px] h-[18px] rounded-full border border-neutral-300 dark:border-slate-700 text-[9.5px] font-semibold text-[#262626] dark:text-slate-200 flex items-center justify-center shrink-0">
                          2
                        </span>
                        <h3 className="text-[9.5px] sm:text-[10.5px] font-semibold uppercase tracking-[0.02em] sm:tracking-[0.03em] text-[#171717] dark:text-slate-100 leading-tight">
                          Contact, Address &amp; Exam Details
                        </h3>
                      </div>
                      <button
                        type="button"
                        onClick={() => setCurrentStep(2)}
                        className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] font-medium text-[#2864E8] dark:text-blue-400 hover:bg-blue-50/70 dark:hover:bg-blue-950/40 transition-colors cursor-pointer shrink-0"
                      >
                        <Edit className="w-3 h-3" /> Edit
                      </button>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2.5">
                      <ReviewDetailItem
                        label="Father Contact"
                        value={activeValues.fatherPhone ? `+91 ${activeValues.fatherPhone}` : ''}
                        valueClassName="tabular-nums whitespace-nowrap"
                      />
                      <ReviewDetailItem
                        label="Mother Contact"
                        value={activeValues.motherPhone ? `+91 ${activeValues.motherPhone}` : ''}
                        valueClassName="tabular-nums whitespace-nowrap"
                      />
                      <ReviewDetailItem
                        label="Student Contact"
                        value={activeValues.studentPhone ? `+91 ${activeValues.studentPhone}` : ''}
                        valueClassName="tabular-nums whitespace-nowrap"
                      />
                      <ReviewDetailItem label="Email" value={activeValues.email} valueClassName="break-all" />
                      <ReviewDetailItem
                        label="Full Address"
                        value={activeValues.address}
                        className="col-span-2 sm:col-span-2"
                      />
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2.5 pt-2.5 mt-2.5 border-t border-neutral-100 dark:border-slate-800/70">
                      <ReviewDetailItem
                        label="Previous School"
                        value={activeValues.previousSchool}
                        className="col-span-2 sm:col-span-1"
                      />
                      <ReviewDetailItem label="Subjects Studied" value={activeValues.previousSubjects} />
                      <ReviewDetailItem label="Marks / %" value={activeValues.previousMarks} />
                      <ReviewDetailItem
                        label="Exam Purpose"
                        value={resolvedReviewPurpose}
                        className="col-span-2 sm:col-span-3"
                      />
                    </div>
                  </section>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Responsive Footer Action Bar matching Admission Form */}
            <div
              className={cn(
                'px-3 sm:px-7 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-1.5 sm:gap-2 shrink-0',
                currentStep === 3 ? 'py-2.5 bg-white dark:bg-slate-950' : 'py-3 bg-[#F8FBFF]/60 dark:bg-slate-900/60'
              )}
            >
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={handleBack}
                  className={cn(
                    'group cursor-pointer flex items-center gap-1 sm:gap-1.5 transition-colors focus:outline-none shrink-0',
                    currentStep === 3
                      ? 'h-8 sm:h-9 px-1.5 sm:px-2 -ml-1 sm:-ml-1.5 rounded-md text-[10.5px] sm:text-[12px] font-semibold tracking-[0.04em] sm:tracking-[0.06em] uppercase text-slate-500 hover:text-slate-900 hover:bg-slate-100/80 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800/60'
                      : 'h-[38px] sm:h-[40px] px-1 text-[12px] sm:text-[12.5px] font-bold tracking-[0.08em] uppercase text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                  )}
                >
                  <ArrowLeft className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700 dark:group-hover:text-white group-hover:-translate-x-0.5 transition-all duration-150" />
                  <span>BACK</span>
                </button>
              ) : (
                <div className="shrink-0" />
              )}

              {currentStep < 3 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="group h-[38px] sm:h-[40px] px-1 font-bold text-[12px] sm:text-[12.5px] tracking-[0.08em] uppercase text-[#2864E8] hover:text-[#1E4ED8] dark:text-blue-400 dark:hover:text-blue-300 cursor-pointer flex items-center justify-center gap-1.5 transition-colors focus:outline-none ml-auto shrink-0"
                >
                  <span>NEXT STEP</span>
                  <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#2864E8] dark:text-blue-400 group-hover:translate-x-0.5 transition-transform duration-150" />
                </button>
              ) : (
                <div className="flex items-center gap-1.5 sm:gap-2 ml-auto shrink-0">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handlePreview}
                    className="h-8 sm:h-9 px-2 sm:px-3.5 rounded-lg text-[10.5px] sm:text-[11.5px] font-semibold tracking-[0.03em] sm:tracking-[0.05em] uppercase border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-50 hover:border-slate-300 dark:hover:bg-slate-800/70 cursor-pointer shadow-none flex items-center gap-1 sm:gap-1.5 transition-colors outline-none shrink-0 whitespace-nowrap"
                  >
                    <FileText className="h-3.5 w-3.5 text-[#2864E8] dark:text-blue-400 shrink-0" />
                    <span>PREVIEW</span>
                  </Button>
                  <Button
                    type="button"
                    onClick={async () => {
                      const isValid = await validateAllCompulsoryFields();
                      if (isValid) {
                        setIsPaymentDialogOpen(true);
                      }
                    }}
                    className="group h-8 sm:h-9 px-2.5 sm:px-4 rounded-lg font-semibold text-[10.5px] sm:text-[11.5px] tracking-[0.03em] sm:tracking-[0.05em] uppercase bg-[#2864E8] hover:bg-[#1E4ED8] active:bg-[#1842BE] text-white shadow-xs transition-all duration-150 cursor-pointer flex items-center justify-center gap-1 sm:gap-1.5 shrink-0 whitespace-nowrap"
                  >
                    <span>SUBMIT &amp; PAY ({formatFeeBadge(SCHOLARSHIP_APPLICATION_FEE_INR)})</span>
                    <Send className="h-3 w-3 text-white/90 shrink-0" />
                  </Button>
                </div>
              )}
            </div>
          </form>
        </Form>
      </CleanFormCard>

      {/* Off-screen A4 Capture Container for Post-Submission PDF Download */}
      {submittedSnapshot && (
        <div
          aria-hidden="true"
          className="fixed -left-[9999px] top-0 pointer-events-none opacity-0"
        >
          <ScholarshipA4Document
            sheetRef={(node) => {
              printableSheetRef.current = node;
            }}
            values={submittedSnapshot}
            applicationDate={format(new Date(), 'dd MMMM yyyy')}
          />
        </div>
      )}

      <ScholarshipSubmissionDialogs
        isPaymentDialogOpen={isPaymentDialogOpen}
        setIsPaymentDialogOpen={setIsPaymentDialogOpen}
        isSuccessOpen={isSuccessOpen}
        setIsSuccessOpen={setIsSuccessOpen}
        isSubmitting={isSubmitting}
        isDownloadingPdf={isDownloadingPdf}
        activeStudent={activeValues}
        submittedStudent={submittedSnapshot}
        feeAmount={SCHOLARSHIP_APPLICATION_FEE_INR}
        onPay={handlePayment}
        onDownloadPdf={handleDownloadConfirmedPdf}
      />
    </>
  );
}
