'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Script from 'next/script';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Camera,
  Check,
  Crop,
  Edit,
  FileText,
  GraduationCap,
  Send,
  Upload,
  User,
  Users,
} from 'lucide-react';
import {
  getNextStudentId,
  submitAdmissionForm,
} from '@/app/actions/forms';
import {
  ADMISSION_APPLICATION_FEE_INR,
  formatFeeBadge,
  processRazorpayFeePayment,
} from '@/lib/form-fees';
import { getPublicBranchClassCatalog } from '@/app/actions/fee-management';
import {
  BOOK_DEMO_BRANCHES,
  buildBranchClassCatalog,
  getClassesForBranchValue,
  getSubjectSelectorConfig,
  getTitlesForBranchClass,
  type BranchClassCatalogResult,
} from '@/lib/branch-courses';
import { CleanFormCard } from '@/components/clean-form-card';
import { Checkbox } from '@/components/ui/checkbox';
import { DemoSubjectSelector } from '@/components/demo-subject-selector';
import {
  ADMISSION_BOARD_OPTIONS,
  ADMISSION_MEDIUM_OPTIONS,
  ADMISSION_MODE_OPTIONS,
  ADMISSION_SESSION_OPTIONS,
  getCitiesForState,
  INDIAN_STATES,
} from '@/lib/india-locations';
import {
  ADMISSION_SUBMITTED_MESSAGE,
  clearAdmissionPreviewDraft,
  dataUrlToFile,
  formatDateForDisplay,
  loadAdmissionPreviewDraft,
  saveAdmissionPreviewDraft,
} from '@/components/admission/admission-a4-preview';
import { AdmissionSubmissionDialogs } from '@/components/admission/admission-submission-dialogs';
import { PhotoCropModal } from '@/components/admission/photo-crop-modal';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { FormModalDialogContent } from '@/components/ui/form-modal-dialog';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const phoneRegex = /^\d{10}$/;
const currentYear = new Date().getFullYear();

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

const STEPS = [
  { id: 1, title: 'Student Info', subtitle: 'Identity, Parents & Class', icon: User },
  { id: 2, title: 'Contact & Edu', subtitle: 'Contact, Photo & Academic', icon: Users },
  { id: 3, title: 'Form Review', subtitle: 'Full Application Review', icon: GraduationCap },
] as const;

const CATALOG_REFRESH_THROTTLE_MS = 2500;

const aadharRegex = /^\d{12}$/;

const admissionFormSchema = z
  .object({
    // STEP 1 — STUDENT INFO (IDENTITY, PARENTS & COURSE)
    studentId: z.string(),
    admissionSession: z.string().min(1, { message: 'Please select academic session.' }),
    mode: z.string().min(1, { message: 'Please select mode.' }),
    branch: z.string().min(1, { message: 'Please select preferred branch.' }),
    studentPhoto: z.any().optional(),

    studentName: z.string().min(2, { message: 'Student full name is required (min 2 letters).' }),
    fatherName: z.string().min(2, { message: 'Father name is required.' }),
    fatherOccupation: z.string().optional().or(z.literal('')),
    motherName: z.string().optional().or(z.literal('')),
    motherOccupation: z.string().optional().or(z.literal('')),
    dob: z
      .date({
        required_error: 'Date of birth is required.',
      })
      .refine(
        (dob) => {
          const today = new Date();
          const threeYearsAgo = new Date(today.getFullYear() - 3, today.getMonth(), today.getDate());
          return dob <= threeYearsAgo;
        },
        { message: 'Student must be at least 3 years old.' }
      ),
    gender: z.enum(['male', 'female', 'other'], { required_error: 'Please select gender.' }),
    aadharNumber: z
      .string()
      .regex(aadharRegex, { message: 'Enter a valid 12-digit Aadhar number.' })
      .optional()
      .or(z.literal('')),
    apaarId: z
      .string()
      .regex(/^[A-Za-z0-9-]{6,20}$/, { message: 'Enter a valid APAAR ID.' })
      .optional()
      .or(z.literal('')),
    classApplied: z.string().min(1, { message: 'Please select class / course.' }),
    board: z.string().min(1, { message: 'Please select board.' }),
    otherBoard: z.string().optional().or(z.literal('')),
    medium: z.string().min(1, { message: 'Please select medium.' }),
    program: z.string().min(1, { message: 'Please select class title.' }),
    studentPhone: z
      .string()
      .regex(phoneRegex, { message: 'Enter a valid 10-digit mobile number.' })
      .optional()
      .or(z.literal('')),

    // STEP 2 — CONTACT, LOCATION & PHOTO
    fatherPhone: z.string().regex(phoneRegex, { message: 'Enter a valid 10-digit mobile number.' }),
    motherPhone: z
      .string()
      .regex(phoneRegex, { message: 'Enter a valid 10-digit mobile number.' })
      .optional()
      .or(z.literal('')),
    parentEmail: z.string().email({ message: 'Please enter a valid email address.' }).optional().or(z.literal('')),
    email: z.string().email({ message: 'Please enter a valid email address.' }).optional().or(z.literal('')),
    address: z.string().min(5, { message: 'Full residential address is required.' }),
    city: z.string().min(1, { message: 'Please select city.' }),
    customCity: z.string().optional().or(z.literal('')),
    state: z.string().min(1, { message: 'Please select state.' }),
    pincode: z.string().optional().or(z.literal('')),
    emergencyContact: z
      .string()
      .regex(phoneRegex, { message: 'Enter a valid 10-digit emergency number.' })
      .optional()
      .or(z.literal('')),

    // STEP 3 — ACADEMIC & DECLARATION
    previousSchool: z.string().optional().or(z.literal('')),
    previousClass: z.string().optional().or(z.literal('')),
    previousPercentage: z.string().optional().or(z.literal('')),
    stream: z.string().optional().or(z.literal('')),
    scholarshipTest: z.string().optional().or(z.literal('')),
    acceptedTerms: z.boolean().refine((val) => val === true, {
      message: 'Please accept the declaration and Terms & Conditions to proceed.',
    }),

    // Compatibility fields
    transactionId: z.string().min(1, { message: 'Transaction ID is required.' }),
    telephone: z.string().optional().or(z.literal('')),
    country: z.string().optional().or(z.literal('')),
    bloodGroup: z.string().optional().or(z.literal('')),
    additionalInfo: z.string().optional().or(z.literal('')),
  })
  .superRefine((data, ctx) => {
    if (data.board === 'OTHER' && (!data.otherBoard || data.otherBoard.trim().length < 2)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Please specify your board name.',
        path: ['otherBoard'],
      });
    }
    if (data.city === 'Other' && (!data.customCity || data.customCity.trim().length < 2)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Please enter your city name.',
        path: ['customCity'],
      });
    }
  });

type AdmissionFormValues = z.infer<typeof admissionFormSchema>;

const capitalizeWords = (str: string) => {
  if (!str) return '';
  return str
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const EMPTY_CATALOG: BranchClassCatalogResult = buildBranchClassCatalog([]);

/** Shared label-value field renderer for Step 3 Form Review grids. */
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
        {value || '—'}
      </span>
    </div>
  );
}

const UNDERLINE_INPUT_CLASS =
  'h-[38px] sm:h-[40px] w-full border-0 border-b border-slate-200/90 dark:border-slate-700/80 !bg-transparent rounded-none px-0 text-[13px] sm:text-[13.5px] font-medium text-slate-900 dark:text-slate-100 placeholder:text-slate-400/90 placeholder:font-normal focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 ring-0 ring-offset-0 focus-visible:border-[#2864E8] focus-visible:shadow-[0_1px_0_0_#2864E8] shadow-none flex items-center leading-none transition-[border-color,box-shadow] duration-150';

const WRAPPED_UNDERLINE_CONTAINER_CLASS =
  'relative flex items-center h-[38px] sm:h-[40px] w-full border-b border-slate-200/90 dark:border-slate-700/80 focus-within:border-[#2864E8] focus-within:shadow-[0_1px_0_0_#2864E8] transition-[border-color,box-shadow] duration-150';

const WRAPPED_UNDERLINE_INPUT_CLASS =
  'h-full w-full border-0 !bg-transparent rounded-none px-0 text-[13px] sm:text-[13.5px] font-medium text-slate-900 dark:text-slate-100 placeholder:text-slate-400/90 placeholder:font-normal focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 ring-0 ring-offset-0 shadow-none flex items-center leading-none';

const UNDERLINE_SELECT_TRIGGER_CLASS =
  'h-[38px] sm:h-[40px] w-full border-0 border-b border-slate-200/90 dark:border-slate-700/80 !bg-transparent rounded-none px-0 text-[13px] sm:text-[13.5px] font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:outline-none focus-visible:ring-offset-0 ring-0 ring-offset-0 focus:border-[#2864E8] focus:shadow-[0_1px_0_0_#2864E8] shadow-none flex items-center justify-between transition-[border-color,box-shadow] duration-150 [&>span]:truncate [&>span]:leading-none data-[placeholder]:[&>span]:text-slate-400/90 data-[placeholder]:[&>span]:font-normal [&>svg]:text-slate-400 [&>svg]:opacity-75 [&>svg]:transition-transform data-[state=open]:[&>svg]:rotate-180 cursor-pointer';

export interface AdmissionFormClientProps {
  variant?: 'page' | 'modal';
  initialCatalog?: BranchClassCatalogResult;
  initialSelection?: {
    branch?: string;
    classCourse?: string;
    programTitle?: string;
  };
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function AdmissionFormClient({
  variant = 'page',
  initialCatalog,
  initialSelection,
  isOpen = true,
  onOpenChange,
}: AdmissionFormClientProps) {
  const { toast } = useToast();
  const isModal = variant === 'modal';
  const isActive = isModal ? isOpen : true;

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [isThankYouOpen, setIsThankYouOpen] = useState(false);
  const [isIdCardOpen, setIsIdCardOpen] = useState(false);
  const [submittedData, setSubmittedData] = useState<AdmissionFormValues | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [activeCropImage, setActiveCropImage] = useState<string | null>(null);
  const [isCropOpen, setIsCropOpen] = useState(false);

  const [branchCatalog, setBranchCatalog] = useState<BranchClassCatalogResult>(
    initialCatalog || EMPTY_CATALOG
  );
  const lastFetchedAtRef = useRef<number>(initialCatalog ? Date.now() : 0);
  const restoredFromDraftRef = useRef(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const stepContainerRef = useRef<HTMLDivElement>(null);

  const [dobInput, setDobInput] = useState('');

  const form = useForm<AdmissionFormValues>({
    resolver: zodResolver(admissionFormSchema),
    defaultValues: {
      studentId: '',
      admissionSession: '2026-2027',
      mode: 'Offline Classroom',
      branch: initialSelection?.branch || '',
      studentName: '',
      gender: undefined,
      classApplied: initialSelection?.classCourse || '',
      board: '',
      otherBoard: '',
      medium: '',
      program: initialSelection?.programTitle || '',
      studentPhone: '',
      fatherName: '',
      motherName: '',
      fatherPhone: '',
      parentEmail: '',
      fatherOccupation: '',
      email: '',
      address: '',
      city: '',
      customCity: '',
      state: '',
      pincode: '',
      emergencyContact: '',
      previousSchool: '',
      previousClass: '',
      previousPercentage: '',
      stream: '',
      scholarshipTest: '',
      acceptedTerms: false,
      transactionId: 'N/A',
      motherPhone: '',
      motherOccupation: '',
      telephone: '',
      country: 'India',
      bloodGroup: '',
      aadharNumber: '',
      apaarId: '',
      additionalInfo: '',
    },
  });

  const handleDobChange = useCallback(
    (rawValue: string) => {
      const isDeleting = rawValue.length < dobInput.length;
      let digits = rawValue.replace(/\D/g, '').slice(0, 8);
      if (isDeleting && dobInput.endsWith('-') && rawValue === dobInput.slice(0, -1)) {
        digits = digits.slice(0, -1);
      }

      const formatted = formatDobDigits(digits, isDeleting);
      setDobInput(formatted);

      if (digits.length === 8) {
        const dayNum = parseInt(digits.slice(0, 2), 10);
        const monthNum = parseInt(digits.slice(2, 4), 10);
        const yearNum = parseInt(digits.slice(4, 8), 10);
        const candidate = new Date(yearNum, monthNum - 1, dayNum);
        const isValidCalendarDate =
          monthNum >= 1 &&
          monthNum <= 12 &&
          dayNum >= 1 &&
          yearNum >= 1950 &&
          yearNum <= currentYear &&
          candidate.getFullYear() === yearNum &&
          candidate.getMonth() === monthNum - 1 &&
          candidate.getDate() === dayNum;

        if (isValidCalendarDate) {
          form.setValue('dob', candidate, { shouldValidate: true });
        } else {
          form.setValue('dob', undefined as unknown as Date, { shouldValidate: false });
          form.setError('dob', {
            type: 'manual',
            message: 'Enter a valid Date of Birth in DD-MM-YYYY format.',
          });
        }
      } else {
        form.setValue('dob', undefined as unknown as Date, { shouldValidate: false });
        form.clearErrors('dob');
      }
    },
    [dobInput, form]
  );

  const selectedBranch = form.watch('branch');
  const selectedClassApplied = form.watch('classApplied');
  const selectedProgramTitle = form.watch('program');
  const selectedBoard = form.watch('board');
  const selectedState = form.watch('state');
  const selectedCity = form.watch('city');
  const selectedSession = form.watch('admissionSession');
  const availableCities = useMemo(() => getCitiesForState(selectedState), [selectedState]);

  const initialSelectionKey = `${initialSelection?.branch || ''}::${initialSelection?.classCourse || ''}::${initialSelection?.programTitle || ''}`;
  const lastInitialSelectionKeyRef = useRef(initialSelectionKey);
  useEffect(() => {
    if (lastInitialSelectionKeyRef.current === initialSelectionKey) return;
    lastInitialSelectionKeyRef.current = initialSelectionKey;
    if (initialSelection?.branch) {
      form.setValue('branch', initialSelection.branch);
      form.setValue('classApplied', initialSelection.classCourse || '');
      form.setValue('program', initialSelection.programTitle || '');
    }
  }, [initialSelectionKey, initialSelection, form]);

  const availableCourses = useMemo(
    () => getClassesForBranchValue(branchCatalog, selectedBranch),
    [branchCatalog, selectedBranch]
  );

  const availableTitles = useMemo(
    () => getTitlesForBranchClass(branchCatalog, selectedBranch, selectedClassApplied),
    [branchCatalog, selectedBranch, selectedClassApplied]
  );

  const subjectConfig = useMemo(
    () => getSubjectSelectorConfig(selectedClassApplied, selectedProgramTitle),
    [selectedClassApplied, selectedProgramTitle]
  );

  const [selectedStreamSubjects, setSelectedStreamSubjects] = useState<string[]>([]);

  // Reset subjects whenever active class/title switches to/from a different stream mode
  const lastStreamKeyRef = useRef<string>('');
  useEffect(() => {
    const nextKey = `${subjectConfig.mode}::${subjectConfig.heading}::${selectedProgramTitle}`;
    if (lastStreamKeyRef.current && lastStreamKeyRef.current !== nextKey) {
      setSelectedStreamSubjects([]);
      form.setValue('stream', '');
      form.clearErrors('stream');
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
      // Preserve last loaded catalog on transient network failures
    }
  }, []);

  // Auto-sync live classes on activation, mount, focus, and tab visibility
  useEffect(() => {
    if (!isActive) return;
    void refreshCatalog(!initialCatalog);

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
  }, [isActive, initialCatalog, refreshCatalog]);

  // Sync Class / Course and Title cleanly when Branch or Catalog changes
  useEffect(() => {
    if (!selectedBranch) {
      if (selectedClassApplied) form.setValue('classApplied', '');
      if (selectedProgramTitle) form.setValue('program', '');
      return;
    }

    if (selectedClassApplied && !availableCourses.includes(selectedClassApplied)) {
      form.setValue('classApplied', '');
      form.setValue('program', '');
    }
  }, [selectedBranch, selectedClassApplied, selectedProgramTitle, availableCourses, form]);

  // Sync Title cleanly when Class / Course changes
  useEffect(() => {
    if (!selectedBranch || !selectedClassApplied) {
      if (selectedProgramTitle) form.setValue('program', '');
      return;
    }

    if (availableTitles.length === 1) {
      if (selectedProgramTitle !== availableTitles[0]) {
        form.setValue('program', availableTitles[0]);
        form.clearErrors('program');
      }
      return;
    }

    if (selectedProgramTitle && !availableTitles.includes(selectedProgramTitle)) {
      form.setValue('program', '');
    }
  }, [selectedBranch, selectedClassApplied, selectedProgramTitle, availableTitles, form]);

  useEffect(() => {
    if (isActive) {
      if (isModal && typeof document !== 'undefined' && document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
      const blurTimer = isModal
        ? setTimeout(() => {
            if (document.activeElement instanceof HTMLElement) {
              document.activeElement.blur();
            }
          }, 50)
        : undefined;

      async function fetchStudentId() {
        if (restoredFromDraftRef.current && form.getValues('studentId')) return;
        const result = await getNextStudentId();
        if (restoredFromDraftRef.current && form.getValues('studentId')) return;
        if (result.success && result.studentId) {
          form.setValue('studentId', result.studentId);
        } else {
          form.setValue('studentId', `IDL-${Date.now().toString().slice(-6)}`);
        }
      }
      void fetchStudentId();
      return () => {
        if (blurTimer) clearTimeout(blurTimer);
      };
    } else if (isModal) {
      setCurrentStep(1);
    }
  }, [isActive, isModal, form]);

  const scrollStepTop = useCallback(() => {
    if (isModal && stepContainerRef.current) {
      stepContainerRef.current.scrollTop = 0;
    } else if (!isModal && typeof window !== 'undefined' && window.scrollY > 180) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [isModal]);

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

  // Hydrate saved draft when returning from Preview tab (?draft=1)
  useEffect(() => {
    if (typeof window === 'undefined' || isModal || restoredFromDraftRef.current) return;
    const params = new URLSearchParams(window.location.search);
    if (params.get('draft') !== '1') return;

    const saved = loadAdmissionPreviewDraft();
    if (!saved?.values) return;
    restoredFromDraftRef.current = true;

    const v = saved.values;
    const parsedDob = v.dob ? new Date(v.dob) : undefined;
    const validDob = parsedDob && !isNaN(parsedDob.getTime()) ? parsedDob : undefined;

    const restoredCfg = getSubjectSelectorConfig(v.classApplied || '', v.program || '');
    lastStreamKeyRef.current = `${restoredCfg.mode}::${restoredCfg.heading}::${v.program || ''}`;

    form.reset({
      ...form.getValues(),
      ...v,
      mode: v.mode && v.mode !== 'Online Classroom' ? v.mode : 'Offline Classroom',
      dob: validDob as Date,
      gender: v.gender as AdmissionFormValues['gender'],
      transactionId: v.transactionId || 'N/A',
    });

    if (v.dobInput) setDobInput(v.dobInput);
    else if (validDob) setDobInput(formatDateForDisplay(validDob));

    if (Array.isArray(v.selectedStreamSubjects) && v.selectedStreamSubjects.length > 0) {
      setSelectedStreamSubjects(v.selectedStreamSubjects);
    } else if (v.stream) {
      setSelectedStreamSubjects(v.stream.split(',').map((item) => item.trim()).filter(Boolean));
    }

    if (saved.photoPreview) {
      setPhotoPreview(saved.photoPreview);
      void dataUrlToFile(saved.photoPreview, `${v.studentId || 'student'}-photo.jpg`).then((fileBlob) => {
        form.setValue('studentPhoto', fileBlob);
      });
    }

    const targetStep = Number(params.get('step') || '3');
    if (targetStep >= 1 && targetStep <= 3) {
      setCurrentStep(targetStep);
    }
  }, [isModal, form]);

  // Reset form if admission submission finishes inside the Preview tab
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleMessage = async (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      if (event.data?.type !== ADMISSION_SUBMITTED_MESSAGE) return;
      form.reset();
      setDobInput('');
      setSelectedStreamSubjects([]);
      setPhotoPreview(null);
      setCurrentStep(1);
      const nextIdResult = await getNextStudentId();
      if (nextIdResult.success && nextIdResult.studentId) {
        form.setValue('studentId', nextIdResult.studentId);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [form]);

  const buildPreviewDraftPayload = useCallback(() => {
    const v = form.getValues();
    const { studentPhoto: _omitFile, ...rest } = v;
    return {
      values: {
        ...rest,
        dob: v.dob instanceof Date && !isNaN(v.dob.getTime()) ? v.dob.toISOString() : undefined,
        dobInput,
        selectedStreamSubjects,
      },
      photoPreview: photoPreview || null,
      applicationDate: format(new Date(), 'dd MMMM yyyy'),
      savedAt: Date.now(),
    };
  }, [form, dobInput, selectedStreamSubjects, photoPreview]);

  const validateCompulsoryFields = async (): Promise<boolean> => {
    const isBasicValid = await form.trigger([
      'admissionSession',
      'mode',
      'branch',
      'studentName',
      'fatherName',
      'dob',
      'gender',
      'classApplied',
      'program',
      'board',
      'medium',
      'fatherPhone',
      'state',
      'city',
      'address',
      'acceptedTerms',
    ]);

    if (form.getValues('board') === 'OTHER') await form.trigger('otherBoard');
    if (form.getValues('city') === 'Other') await form.trigger('customCity');
    if (form.getValues('aadharNumber')) await form.trigger('aadharNumber');
    if (form.getValues('apaarId')) await form.trigger('apaarId');
    if (form.getValues('motherPhone')) await form.trigger('motherPhone');
    if (form.getValues('studentPhone')) await form.trigger('studentPhone');
    if (form.getValues('email')) await form.trigger('email');

    if (dobInput.trim().length > 0 && !form.getValues('dob')) {
      form.setError('dob', {
        type: 'manual',
        message: 'Enter a valid Date of Birth in DD-MM-YYYY format.',
      });
    }

    if (subjectConfig.mode === 'stream' && !form.getValues('stream')?.trim()) {
      form.setError('stream', {
        type: 'manual',
        message: 'Please select target subject(s) / stream.',
      });
    }

    const errors = form.formState.errors;
    if (!isBasicValid || Object.keys(errors).length > 0) {
      const step1Fields: (keyof AdmissionFormValues)[] = [
        'admissionSession',
        'mode',
        'branch',
        'studentName',
        'fatherName',
        'fatherOccupation',
        'motherName',
        'motherOccupation',
        'dob',
        'gender',
        'aadharNumber',
        'apaarId',
        'classApplied',
        'program',
        'board',
        'otherBoard',
        'medium',
        'stream',
      ];
      const step2Fields: (keyof AdmissionFormValues)[] = [
        'fatherPhone',
        'motherPhone',
        'studentPhone',
        'email',
        'state',
        'city',
        'customCity',
        'address',
        'previousSchool',
        'previousPercentage',
        'scholarshipTest',
      ];

      if (step1Fields.some((f) => errors[f])) {
        setCurrentStep(1);
      } else if (step2Fields.some((f) => errors[f])) {
        setCurrentStep(2);
      } else {
        setCurrentStep(3);
      }

      scrollStepTop();

      const firstKey = Object.keys(errors)[0] as keyof AdmissionFormValues;
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

    if (!photoPreview) {
      setPhotoError('Student passport size photo is compulsory (*).');
      setCurrentStep(2);
      scrollStepTop();
      toast({
        variant: 'destructive',
        title: 'Photo Required',
        description: 'Student passport size photo is compulsory (*). Please upload photo.',
      });
      return false;
    }
    setPhotoError(null);

    return true;
  };

  const handlePreview = async () => {
    const values = form.getValues();
    const schemaValid = admissionFormSchema.safeParse(values).success;
    const dobValid = Boolean(values.dob instanceof Date && !isNaN(values.dob.getTime()));
    const streamValid = subjectConfig.mode !== 'stream' || Boolean(values.stream?.trim());
    const photoValid = Boolean(photoPreview);

    if (schemaValid && dobValid && streamValid && photoValid) {
      saveAdmissionPreviewDraft(buildPreviewDraftPayload());
      form.clearErrors();
      setPhotoError(null);
      const previewWin = window.open('/admission/preview', '_blank');
      if (!previewWin) {
        window.location.assign('/admission/preview');
      }
      return;
    }

    await validateCompulsoryFields();
  };

  const onSubmit: SubmitHandler<AdmissionFormValues> = async (data) => {
    setIsSubmitting(true);
    try {
      const resolvedBoard =
        data.board === 'OTHER' && data.otherBoard?.trim() ? data.otherBoard.trim() : data.board;
      const resolvedCity =
        data.city === 'Other' && data.customCity?.trim() ? data.customCity.trim() : data.city;
      const formData = new FormData();
      Object.entries({ ...data, board: resolvedBoard, city: resolvedCity }).forEach(([key, value]) => {
        if (key === 'otherBoard' || key === 'customCity') return;
        if (key === 'dob' && value instanceof Date) {
          formData.append(key, value.toISOString());
        } else if (value !== undefined && value !== null) {
          formData.append(key, String(value));
        }
      });
      if (data.studentPhoto) {
        formData.set('studentPhoto', data.studentPhoto as Blob);
      }
      formData.append('feeAmount', String(ADMISSION_APPLICATION_FEE_INR));
      formData.append(
        'paymentStatus',
        ADMISSION_APPLICATION_FEE_INR <= 0 ? 'free_waived' : 'paid'
      );

      const result = await submitAdmissionForm(formData);

      if (result.success) {
        clearAdmissionPreviewDraft();
        setSubmittedData({ ...data });
        setIsThankYouOpen(true);
        form.reset();
        setDobInput('');
        setSelectedStreamSubjects([]);
        setCurrentStep(1);
        const nextIdResult = await getNextStudentId();
        if (nextIdResult.success && nextIdResult.studentId) {
          form.setValue('studentId', nextIdResult.studentId);
        }
      } else {
        toast({
          variant: 'destructive',
          title: 'Submission Failed',
          description: result.message || 'Please check your details and try again.',
        });
      }
    } catch {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'A network or server error occurred. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePayment = async () => {
    setIsSubmitting(true);
    await processRazorpayFeePayment({
      amountInr: ADMISSION_APPLICATION_FEE_INR,
      description: 'Admission Processing Fee',
      prefill: {
        name: form.getValues('studentName') || '',
        email: form.getValues('email') || '',
        contact: form.getValues('fatherPhone') || form.getValues('studentPhone') || '',
      },
      onPaid: async ({ transactionId }) => {
        form.setValue('transactionId', transactionId);
        setIsPaymentDialogOpen(false);
        const values = form.getValues();
        values.transactionId = transactionId;
        await onSubmit(values);
      },
      onError: (title, description) => {
        toast({ variant: 'destructive', title, description });
      },
      onDismiss: () => {
        setIsSubmitting(false);
      },
    });
  };

  const classPlaceholder = !selectedBranch
    ? 'Select Branch First *'
    : availableCourses.length === 0
      ? 'No classes available'
      : 'Class / Course *';

  const titlePlaceholder =
    !selectedBranch || !selectedClassApplied
      ? 'Select Class First *'
      : availableTitles.length === 0
        ? 'No titles available'
        : 'Class Title *';

  const handlePhotoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        toast({
          variant: 'destructive',
          title: 'Unsupported format',
          description: 'Please upload a valid JPG, JPEG, or PNG image.',
        });
        e.target.value = '';
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        toast({
          variant: 'destructive',
          title: 'Image too large',
          description: 'Photo file size should be less than 10MB.',
        });
        e.target.value = '';
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        setActiveCropImage(dataUrl);
        setIsCropOpen(true);
      };
      reader.readAsDataURL(file);
    }
    e.target.value = '';
  };

  const formContent = (
    <Form {...form}>
      <form
        onSubmit={(e) => e.preventDefault()}
        className={cn('flex flex-col', isModal && 'flex-1 h-full min-h-0 overflow-hidden')}
        autoComplete="off"
      >
        {/* 3-Step Progress Stepper */}
        <div
          className={cn(
            'px-4 sm:px-7 py-2.5 border-b border-slate-100 dark:border-slate-800 shrink-0',
            isModal ? 'bg-white dark:bg-slate-950' : 'bg-[#F8FAFD]/65 dark:bg-slate-900/45'
          )}
        >
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

        {/* Form Body */}
        <div
          ref={stepContainerRef}
          className={cn(isModal && 'overflow-y-auto flex-1 min-h-0 overscroll-contain')}
        >
          <AnimatePresence mode="wait">
            {/* STEP 1 — Student Info (Identity, Parents & Course) */}
            {currentStep === 1 && (
              <motion.div
                key="step-1"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="px-4 sm:px-7 pt-4 pb-5 space-y-3.5 text-left"
              >
                {/* Row 1: Provisional ID & Academic Session */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <FormField
                    control={form.control}
                    name="studentId"
                    render={({ field }) => (
                      <FormItem className="space-y-0 text-left">
                        <FormLabel className="sr-only">Provisional Student ID</FormLabel>
                        <FormControl>
                          <div className="flex items-center h-[38px] sm:h-[40px] border-b border-slate-200/90 dark:border-slate-700/80">
                            <span className="text-[12px] sm:text-[12.5px] font-semibold text-slate-500 dark:text-slate-400 mr-2 shrink-0 select-none">
                              ID:
                            </span>
                            <Input
                              {...field}
                              readOnly
                              placeholder="Provisional ID"
                              className="h-full border-0 bg-transparent text-[13px] sm:text-[13.5px] font-bold text-[#2864E8] dark:text-blue-400 font-mono tracking-tight focus-visible:ring-0 focus-visible:ring-offset-0 focus:ring-0 focus:outline-none outline-none px-0 cursor-default select-all"
                            />
                          </div>
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="admissionSession"
                    render={({ field }) => (
                      <FormItem className="space-y-0 text-left">
                        <FormLabel className="sr-only">Academic Session</FormLabel>
                        <Select
                          onValueChange={(val) => {
                            field.onChange(val);
                            form.clearErrors('admissionSession');
                          }}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className={UNDERLINE_SELECT_TRIGGER_CLASS}>
                              <SelectValue placeholder="Academic Session *" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="max-h-56 z-[200]">
                            {ADMISSION_SESSION_OPTIONS.map((opt) => (
                              <SelectItem key={opt.value} value={opt.value} className="text-[13px] py-1.5 cursor-pointer font-medium">
                                Session: {opt.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage className="text-[11.5px] font-medium text-rose-500 pt-0.5" />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Row 2: Preferred Branch & Study Mode */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
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
                            const currentCourse = form.getValues('classApplied');
                            if (currentCourse && !nextCourses.includes(currentCourse)) {
                              form.setValue('classApplied', '');
                              form.setValue('program', '');
                            } else if (currentCourse) {
                              const nextTitles = getTitlesForBranchClass(branchCatalog, val, currentCourse);
                              const currentTitle = form.getValues('program');
                              if (nextTitles.length === 1) {
                                form.setValue('program', nextTitles[0]);
                              } else if (currentTitle && !nextTitles.includes(currentTitle)) {
                                form.setValue('program', '');
                              }
                            }
                            void refreshCatalog();
                          }}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className={UNDERLINE_SELECT_TRIGGER_CLASS}>
                              <SelectValue placeholder="Preferred Branch *" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="max-h-56 z-[200]">
                            {BOOK_DEMO_BRANCHES.map((b) => (
                              <SelectItem key={b} value={b} className="text-[13px] py-1.5 cursor-pointer font-medium">
                                {b}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage className="text-[11.5px] font-medium text-rose-500 pt-0.5" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="mode"
                    render={({ field }) => (
                      <FormItem className="space-y-0 text-left">
                        <FormLabel className="sr-only">Classroom Mode</FormLabel>
                        <Select
                          onValueChange={(val) => {
                            if (val === 'Online Classroom') return;
                            field.onChange(val);
                            form.clearErrors('mode');
                          }}
                          value={field.value || 'Offline Classroom'}
                        >
                          <FormControl>
                            <SelectTrigger className={UNDERLINE_SELECT_TRIGGER_CLASS}>
                              <SelectValue placeholder="Mode *" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="max-h-56 z-[200]">
                            {ADMISSION_MODE_OPTIONS.map((m) => {
                              const isDisabled = m === 'Online Classroom';
                              return (
                                <SelectItem
                                  key={m}
                                  value={m}
                                  disabled={isDisabled}
                                  className={cn(
                                    'text-[13px] py-1.5 font-medium',
                                    isDisabled ? 'opacity-50' : 'cursor-pointer'
                                  )}
                                >
                                  {m}
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>
                        <FormMessage className="text-[11.5px] font-medium text-rose-500 pt-0.5" />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Row 2: Student Full Name * */}
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
                          autoFocus={false}
                          value={field.value}
                          className={`${UNDERLINE_INPUT_CLASS} capitalize`}
                          onChange={(e) => field.onChange(capitalizeWords(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage className="text-[11.5px] font-medium text-rose-500 pt-0.5" />
                    </FormItem>
                  )}
                />

                {/* Row 3: Father Name * & Father Occupation */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
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
                            className={`${UNDERLINE_INPUT_CLASS} capitalize`}
                            onChange={(e) => field.onChange(capitalizeWords(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage className="text-[11.5px] font-medium text-rose-500 pt-0.5" />
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
                            className={`${UNDERLINE_INPUT_CLASS} capitalize`}
                            onChange={(e) => field.onChange(capitalizeWords(e.target.value))}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                {/* Row 4: Mother Name & Mother Occupation */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
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
                            className={`${UNDERLINE_INPUT_CLASS} capitalize`}
                            onChange={(e) => field.onChange(capitalizeWords(e.target.value))}
                          />
                        </FormControl>
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
                            className={`${UNDERLINE_INPUT_CLASS} capitalize`}
                            onChange={(e) => field.onChange(capitalizeWords(e.target.value))}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                {/* Row 5: Date of Birth * (Manual DD-MM-YYYY Auto-Dash Input) & Gender * */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <FormField
                    control={form.control}
                    name="dob"
                    render={() => (
                      <FormItem className="space-y-0 text-left">
                        <FormLabel className="sr-only">Date of Birth (DD-MM-YYYY)</FormLabel>
                        <FormControl>
                          <div className={WRAPPED_UNDERLINE_CONTAINER_CLASS}>
                            <Calendar className="w-3.5 h-3.5 text-slate-400 mr-2 shrink-0" />
                            <Input
                              type="tel"
                              inputMode="numeric"
                              maxLength={10}
                              placeholder="Date of Birth (DD-MM-YYYY) *"
                              aria-label="Date of Birth (DD-MM-YYYY)"
                              value={dobInput}
                              onChange={(e) => handleDobChange(e.target.value)}
                              className={`${WRAPPED_UNDERLINE_INPUT_CLASS} tabular-nums`}
                            />
                          </div>
                        </FormControl>
                        <FormMessage className="text-[11.5px] font-medium text-rose-500 pt-0.5" />
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
                            <SelectTrigger className={UNDERLINE_SELECT_TRIGGER_CLASS}>
                              <SelectValue placeholder="Gender *" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="z-[200]">
                            <SelectItem value="male" className="text-[13px] py-1.5 cursor-pointer">
                              Male
                            </SelectItem>
                            <SelectItem value="female" className="text-[13px] py-1.5 cursor-pointer">
                              Female
                            </SelectItem>
                            <SelectItem value="other" className="text-[13px] py-1.5 cursor-pointer">
                              Other
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage className="text-[11.5px] font-medium text-rose-500 pt-0.5" />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Row 6: Aadhar No. & APAAR ID */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <FormField
                    control={form.control}
                    name="aadharNumber"
                    render={({ field }) => (
                      <FormItem className="space-y-0 text-left">
                        <FormLabel className="sr-only">Aadhar Number</FormLabel>
                        <FormControl>
                          <Input
                            type="tel"
                            inputMode="numeric"
                            maxLength={12}
                            placeholder="Aadhar No. (Optional)"
                            {...field}
                            value={field.value || ''}
                            className={UNDERLINE_INPUT_CLASS}
                            onChange={(e) => field.onChange(e.target.value.replace(/\D/g, ''))}
                          />
                        </FormControl>
                        <FormMessage className="text-[11.5px] font-medium text-rose-500 pt-0.5" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="apaarId"
                    render={({ field }) => (
                      <FormItem className="space-y-0 text-left">
                        <FormLabel className="sr-only">APAAR ID</FormLabel>
                        <FormControl>
                          <Input
                            maxLength={16}
                            placeholder="APAAR ID (Optional)"
                            {...field}
                            value={field.value || ''}
                            className={`${UNDERLINE_INPUT_CLASS} uppercase placeholder:normal-case`}
                            onChange={(e) => field.onChange(e.target.value.replace(/[^a-zA-Z0-9-]/g, '').toUpperCase())}
                          />
                        </FormControl>
                        <FormMessage className="text-[11.5px] font-medium text-rose-500 pt-0.5" />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Row 7: Branch-Synced Class / Course * & Class Title * */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <FormField
                    control={form.control}
                    name="classApplied"
                    render={({ field }) => (
                      <FormItem className="space-y-0 text-left">
                        <FormLabel className="sr-only">Class / Course</FormLabel>
                        <Select
                          key={selectedBranch || 'no-branch'}
                          disabled={!selectedBranch || availableCourses.length === 0}
                          onValueChange={(val) => {
                            field.onChange(val);
                            form.clearErrors('classApplied');
                            const nextTitles = getTitlesForBranchClass(branchCatalog, selectedBranch, val);
                            if (nextTitles.length === 1) {
                              form.setValue('program', nextTitles[0]);
                              form.clearErrors('program');
                            } else {
                              form.setValue('program', '');
                            }
                          }}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger
                              className={cn(
                                UNDERLINE_SELECT_TRIGGER_CLASS,
                                (!selectedBranch || availableCourses.length === 0) && 'cursor-not-allowed opacity-65'
                              )}
                            >
                              <SelectValue placeholder={classPlaceholder} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="max-h-56 z-[200]">
                            {availableCourses.map((c) => (
                              <SelectItem key={c} value={c} className="text-[13px] py-1.5 cursor-pointer">
                                {c}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage className="text-[11.5px] font-medium text-rose-500 pt-0.5" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="program"
                    render={({ field }) => (
                      <FormItem className="space-y-0 text-left">
                        <FormLabel className="sr-only">Class Title</FormLabel>
                        <Select
                          key={`${selectedBranch || 'no-branch'}::${selectedClassApplied || 'no-class'}`}
                          disabled={!selectedBranch || !selectedClassApplied || availableTitles.length === 0}
                          onValueChange={(val) => {
                            field.onChange(val);
                            form.clearErrors('program');
                          }}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger
                              className={cn(
                                UNDERLINE_SELECT_TRIGGER_CLASS,
                                (!selectedBranch || !selectedClassApplied || availableTitles.length === 0) &&
                                  'cursor-not-allowed opacity-65'
                              )}
                            >
                              <SelectValue placeholder={titlePlaceholder} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="max-h-56 z-[200]">
                            {availableTitles.map((titleOption) => (
                              <SelectItem key={titleOption} value={titleOption} className="text-[13px] py-1.5 cursor-pointer">
                                {titleOption}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage className="text-[11.5px] font-medium text-rose-500 pt-0.5" />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Row 9: Board (CBSE, STATE, OTHER) & Medium (English, Hindi) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <FormField
                    control={form.control}
                    name="board"
                    render={({ field }) => (
                      <FormItem className="space-y-0 text-left">
                        <FormLabel className="sr-only">Board</FormLabel>
                        <Select
                          onValueChange={(val) => {
                            field.onChange(val);
                            form.clearErrors('board');
                            if (val !== 'OTHER') {
                              form.setValue('otherBoard', '');
                              form.clearErrors('otherBoard');
                            }
                          }}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className={UNDERLINE_SELECT_TRIGGER_CLASS}>
                              <SelectValue placeholder="Board *" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="max-h-56 z-[200]">
                            {ADMISSION_BOARD_OPTIONS.map((b) => (
                              <SelectItem key={b} value={b} className="text-[13px] py-1.5 cursor-pointer font-medium">
                                {b}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage className="text-[11.5px] font-medium text-rose-500 pt-0.5" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="medium"
                    render={({ field }) => (
                      <FormItem className="space-y-0 text-left">
                        <FormLabel className="sr-only">Medium</FormLabel>
                        <Select
                          onValueChange={(val) => {
                            field.onChange(val);
                            form.clearErrors('medium');
                          }}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className={UNDERLINE_SELECT_TRIGGER_CLASS}>
                              <SelectValue placeholder="Medium *" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="max-h-56 z-[200]">
                            {ADMISSION_MEDIUM_OPTIONS.map((m) => (
                              <SelectItem key={m} value={m} className="text-[13px] py-1.5 cursor-pointer font-medium">
                                {m}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage className="text-[11.5px] font-medium text-rose-500 pt-0.5" />
                      </FormItem>
                    )}
                  />
                </div>

                {selectedBoard === 'OTHER' && (
                  <FormField
                    control={form.control}
                    name="otherBoard"
                    render={({ field }) => (
                      <FormItem className="space-y-0 text-left">
                        <FormLabel className="sr-only">Specify Board Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Specify Board Name (e.g., ICSE / IB / NIOS) *"
                            {...field}
                            value={field.value || ''}
                            className={UNDERLINE_INPUT_CLASS}
                          />
                        </FormControl>
                        <FormMessage className="text-[11.5px] font-medium text-rose-500 pt-0.5" />
                      </FormItem>
                    )}
                  />
                )}

                {/* Conditional Stream Subject Checkboxes for Science/Commerce/Humanities/JEE-NEET */}
                {subjectConfig.mode === 'stream' && (
                  <FormField
                    control={form.control}
                    name="stream"
                    render={({ field }) => (
                      <FormItem className="space-y-0 text-left">
                        <FormLabel className="sr-only">{subjectConfig.heading}</FormLabel>
                        <DemoSubjectSelector
                          config={subjectConfig}
                          selectedSubjects={selectedStreamSubjects}
                          onChange={(next) => {
                            setSelectedStreamSubjects(next);
                            field.onChange(next.join(', '));
                            if (next.length > 0) {
                              form.clearErrors('stream');
                            }
                          }}
                          variant="underline"
                        />
                        <FormMessage className="text-[11.5px] font-medium text-rose-500 pt-0.5" />
                      </FormItem>
                    )}
                  />
                )}
              </motion.div>
            )}

            {/* STEP 2 — Contact, Address & Student Photo */}
            {currentStep === 2 && (
              <motion.div
                key="step-2"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="px-4 sm:px-7 pt-4 pb-5 space-y-3.5 text-left"
              >
                {/* Top Section: Father Contact, Mother Contact & Student Contact on left; Desktop Student Passport Photo on right */}
                <div className="grid grid-cols-1 sm:grid-cols-[1fr_94px] gap-x-5 gap-y-3.5">
                  <div className="sm:col-start-1 sm:row-start-1">
                    <FormField
                      control={form.control}
                      name="fatherPhone"
                      render={({ field }) => (
                        <FormItem className="space-y-0 text-left">
                          <FormLabel className="sr-only">Father Contact</FormLabel>
                          <FormControl>
                            <div className={WRAPPED_UNDERLINE_CONTAINER_CLASS}>
                              <span className="pr-2 text-[13px] sm:text-[13.5px] font-semibold text-slate-500 dark:text-slate-400 select-none shrink-0 leading-none">
                                +91
                              </span>
                              <Input
                                type="tel"
                                placeholder="Father Contact *"
                                {...field}
                                maxLength={10}
                                className={`${WRAPPED_UNDERLINE_INPUT_CLASS} pl-1 pr-0`}
                                onChange={(e) => field.onChange(e.target.value.replace(/\D/g, ''))}
                              />
                            </div>
                          </FormControl>
                          <FormMessage className="text-[11.5px] font-medium text-rose-500 pt-0.5" />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="sm:col-start-1 sm:row-start-2">
                    <FormField
                      control={form.control}
                      name="motherPhone"
                      render={({ field }) => (
                        <FormItem className="space-y-0 text-left">
                          <FormLabel className="sr-only">Mother Contact</FormLabel>
                          <FormControl>
                            <div className={WRAPPED_UNDERLINE_CONTAINER_CLASS}>
                              <span className="pr-2 text-[13px] sm:text-[13.5px] font-semibold text-slate-500 dark:text-slate-400 select-none shrink-0 leading-none">
                                +91
                              </span>
                              <Input
                                type="tel"
                                placeholder="Mother Contact (Optional)"
                                {...field}
                                maxLength={10}
                                className={`${WRAPPED_UNDERLINE_INPUT_CLASS} pl-1 pr-0`}
                                onChange={(e) => field.onChange(e.target.value.replace(/\D/g, ''))}
                              />
                            </div>
                          </FormControl>
                          <FormMessage className="text-[11.5px] font-medium text-rose-500 pt-0.5" />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="sm:col-start-1 sm:row-start-3">
                    <FormField
                      control={form.control}
                      name="studentPhone"
                      render={({ field }) => (
                        <FormItem className="space-y-0 text-left">
                          <FormLabel className="sr-only">Student Contact</FormLabel>
                          <FormControl>
                            <div className={WRAPPED_UNDERLINE_CONTAINER_CLASS}>
                              <span className="pr-2 text-[13px] sm:text-[13.5px] font-semibold text-slate-500 dark:text-slate-400 select-none shrink-0 leading-none">
                                +91
                              </span>
                              <Input
                                type="tel"
                                placeholder="Student Contact (Optional)"
                                {...field}
                                maxLength={10}
                                className={`${WRAPPED_UNDERLINE_INPUT_CLASS} pl-1 pr-0`}
                                onChange={(e) => field.onChange(e.target.value.replace(/\D/g, ''))}
                              />
                            </div>
                          </FormControl>
                          <FormMessage className="text-[11.5px] font-medium text-rose-500 pt-0.5" />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Desktop Student Passport Photo Area (aligned beside Father / Mother / Student Contacts) */}
                  <div className="hidden sm:flex flex-col items-center justify-start gap-1.5 self-start pt-0.5 w-[94px] sm:col-start-2 sm:row-start-1 sm:row-span-3">
                    <div
                      onClick={() => {
                        if (photoPreview) {
                          setActiveCropImage(photoPreview);
                          setIsCropOpen(true);
                        } else {
                          fileInputRef.current?.click();
                        }
                      }}
                      className={cn(
                        'w-[94px] aspect-[3.5/4.5] rounded-[9px] bg-slate-50/70 dark:bg-slate-900/60 border border-dashed transition-all flex flex-col items-center justify-center overflow-hidden relative group shrink-0 cursor-pointer shadow-xs',
                        photoError
                          ? 'border-rose-500 bg-rose-50/20 ring-2 ring-rose-500/20'
                          : 'border-slate-300 dark:border-slate-700 hover:border-[#2864E8] dark:hover:border-blue-400'
                      )}
                      title={photoPreview ? 'Click to crop & adjust photo' : 'Click to upload passport photo (Compulsory)'}
                    >
                      {photoPreview ? (
                        <>
                          <img src={photoPreview} alt="Passport Photo" className="w-full h-full object-cover block" />
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-[9px] font-semibold uppercase gap-0.5">
                            <Crop className="w-3.5 h-3.5" />
                            <span>Adjust</span>
                          </div>
                        </>
                      ) : (
                        <div className="flex flex-col items-center justify-center gap-0.5 p-1 text-center select-none">
                          <Camera
                            className={cn(
                              'w-4 h-4 transition-colors',
                              photoError ? 'text-rose-500' : 'text-slate-400 group-hover:text-[#2864E8]'
                            )}
                          />
                          <span
                            className={cn(
                              'text-[9px] font-semibold leading-tight',
                              photoError ? 'text-rose-600' : 'text-slate-600 dark:text-slate-300'
                            )}
                          >
                            Photo *
                          </span>
                          <span className="text-[7.5px] text-slate-400 font-mono leading-none">35×45mm</span>
                          {photoError && (
                            <span className="text-[7.5px] text-rose-500 font-bold leading-none mt-0.5">Required *</span>
                          )}
                        </div>
                      )}
                    </div>

                    {photoPreview ? (
                      <div className="flex items-center gap-1 w-[94px]">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveCropImage(photoPreview);
                            setIsCropOpen(true);
                          }}
                          className="h-6 px-1 text-[10px] font-semibold rounded-[5px] border border-slate-200 dark:border-slate-700 text-[#2864E8] dark:text-blue-400 bg-white dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/40 cursor-pointer shadow-none flex items-center justify-center gap-0.5 flex-1"
                          title="Crop & adjust photo"
                        >
                          <Crop className="w-2.5 h-2.5" />
                          <span>Crop</span>
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            fileInputRef.current?.click();
                          }}
                          className="h-6 px-1 text-[10px] font-semibold rounded-[5px] border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer shadow-none flex items-center justify-center gap-0.5 flex-1"
                          title="Change photo"
                        >
                          <span>Change</span>
                        </Button>
                      </div>
                    ) : (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => fileInputRef.current?.click()}
                        className="h-6 px-2 text-[10.5px] font-semibold rounded-[5px] border border-slate-200 dark:border-slate-700 text-[#2864E8] dark:text-blue-400 bg-white dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/40 cursor-pointer shadow-none flex items-center justify-center gap-1 w-[94px]"
                      >
                        <Upload className="w-2.5 h-2.5" />
                        <span>Upload</span>
                      </Button>
                    )}
                  </div>
                </div>

                {/* Email Address */}
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
                          className={UNDERLINE_INPUT_CLASS}
                          onChange={(e) => field.onChange(e.target.value.toLowerCase())}
                        />
                      </FormControl>
                      <FormMessage className="text-[11.5px] font-medium text-rose-500 pt-0.5" />
                    </FormItem>
                  )}
                />

                {/* Row 5: Full Address * */}
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem className="space-y-0 text-left">
                      <FormLabel className="sr-only">Full Address</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Full Residential Address *"
                          {...field}
                          className={UNDERLINE_INPUT_CLASS}
                          onChange={(e) => field.onChange(capitalizeWords(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage className="text-[11.5px] font-medium text-rose-500 pt-0.5" />
                    </FormItem>
                  )}
                />

                {/* State & City Selection */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem className="space-y-0 text-left">
                        <FormLabel className="sr-only">State</FormLabel>
                        <Select
                          onValueChange={(val) => {
                            field.onChange(val);
                            form.clearErrors('state');
                            const nextCities = getCitiesForState(val);
                            const currentCity = form.getValues('city');
                            if (currentCity && !nextCities.includes(currentCity)) {
                              form.setValue('city', '');
                              form.setValue('customCity', '');
                            }
                          }}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className={UNDERLINE_SELECT_TRIGGER_CLASS}>
                              <SelectValue placeholder="State *" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="max-h-56 z-[200]">
                            {INDIAN_STATES.map((st) => (
                              <SelectItem key={st} value={st} className="text-[13px] py-1.5 cursor-pointer font-medium">
                                {st}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage className="text-[11.5px] font-medium text-rose-500 pt-0.5" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem className="space-y-0 text-left">
                        <FormLabel className="sr-only">City</FormLabel>
                        <Select
                          key={selectedState || 'no-state'}
                          disabled={!selectedState}
                          onValueChange={(val) => {
                            field.onChange(val);
                            form.clearErrors('city');
                            if (val !== 'Other') {
                              form.setValue('customCity', '');
                              form.clearErrors('customCity');
                            }
                          }}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger
                              className={cn(
                                UNDERLINE_SELECT_TRIGGER_CLASS,
                                !selectedState && 'cursor-not-allowed opacity-65'
                              )}
                            >
                              <SelectValue placeholder={selectedState ? 'City *' : 'Select State First *'} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="max-h-56 z-[200]">
                            {availableCities.map((c) => (
                              <SelectItem key={c} value={c} className="text-[13px] py-1.5 cursor-pointer font-medium">
                                {c}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage className="text-[11.5px] font-medium text-rose-500 pt-0.5" />
                      </FormItem>
                    )}
                  />
                </div>

                {selectedCity === 'Other' && (
                  <FormField
                    control={form.control}
                    name="customCity"
                    render={({ field }) => (
                      <FormItem className="space-y-0 text-left">
                        <FormLabel className="sr-only">Enter City Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter City / Town Name *"
                            {...field}
                            value={field.value || ''}
                            className={`${UNDERLINE_INPUT_CLASS} capitalize`}
                            onChange={(e) => field.onChange(capitalizeWords(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage className="text-[11.5px] font-medium text-rose-500 pt-0.5" />
                      </FormItem>
                    )}
                  />
                )}

                {/* Row 6: Previous School & Marks (Moved from old Step 3 for equal form height) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <FormField
                    control={form.control}
                    name="previousSchool"
                    render={({ field }) => (
                      <FormItem className="space-y-0 text-left">
                        <FormLabel className="sr-only">Previous School Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Previous School Name (Optional)"
                            {...field}
                            className={`${UNDERLINE_INPUT_CLASS} capitalize`}
                            onChange={(e) => field.onChange(capitalizeWords(e.target.value))}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="previousPercentage"
                    render={({ field }) => (
                      <FormItem className="space-y-0 text-left">
                        <FormLabel className="sr-only">Previous Marks</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Previous Percentage / Grade (Optional)"
                            {...field}
                            className={UNDERLINE_INPUT_CLASS}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                {/* Row 7: Scholarship / Entrance Test */}
                <FormField
                  control={form.control}
                  name="scholarshipTest"
                  render={({ field }) => (
                    <FormItem className="space-y-0 text-left">
                      <FormLabel className="sr-only">Scholarship Test</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Scholarship / Entrance Test (Optional)"
                          {...field}
                          className={UNDERLINE_INPUT_CLASS}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {/* Mobile Student Passport Photo Card */}
                <div className="sm:hidden flex items-center justify-between gap-3 p-2.5 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40">
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      onClick={() => {
                        if (photoPreview) {
                          setActiveCropImage(photoPreview);
                          setIsCropOpen(true);
                        } else {
                          fileInputRef.current?.click();
                        }
                      }}
                      className={cn(
                        'w-[48px] h-[62px] rounded-[7px] bg-white dark:bg-slate-950 border border-dashed transition-all flex flex-col items-center justify-center overflow-hidden relative group shrink-0 cursor-pointer shadow-xs',
                        photoError
                          ? 'border-rose-500 bg-rose-50/20 ring-2 ring-rose-500/20'
                          : 'border-slate-300 dark:border-slate-700 hover:border-[#2864E8]'
                      )}
                      title={photoPreview ? 'Click to crop & adjust photo' : 'Click to upload passport photo'}
                    >
                      {photoPreview ? (
                        <>
                          <img src={photoPreview} alt="Passport Photo" className="w-full h-full object-cover block" />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                            <Crop className="w-3.5 h-3.5" />
                          </div>
                        </>
                      ) : (
                        <div className="flex flex-col items-center justify-center gap-0.5 p-1 text-center select-none">
                          <Camera className={cn('w-4 h-4', photoError ? 'text-rose-500' : 'text-slate-400')} />
                          <span className="text-[7.5px] text-slate-400 font-mono leading-none">35×45</span>
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={cn(
                            'text-[12px] font-semibold leading-tight',
                            photoError ? 'text-rose-600' : 'text-slate-700 dark:text-slate-200'
                          )}
                        >
                          Student Photo <span className="text-rose-500">*</span>
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 leading-tight mt-0.5">
                        Passport size (35×45mm, JPG/PNG)
                      </p>
                      {photoError && (
                        <p className="text-[10px] text-rose-500 font-semibold leading-tight mt-0.5">
                          Photo is compulsory *
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-1.5">
                    {photoPreview ? (
                      <>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setActiveCropImage(photoPreview);
                            setIsCropOpen(true);
                          }}
                          className="h-7 px-2 text-[10.5px] font-semibold rounded-[6px] border border-slate-200 dark:border-slate-700 text-[#2864E8] dark:text-blue-400 bg-white dark:bg-slate-800 hover:bg-blue-50 shadow-none cursor-pointer flex items-center gap-1"
                        >
                          <Crop className="w-3 h-3" />
                          <span>Crop</span>
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => fileInputRef.current?.click()}
                          className="h-7 px-2 text-[10.5px] font-semibold rounded-[6px] border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-100 shadow-none cursor-pointer flex items-center gap-1"
                        >
                          <span>Change</span>
                        </Button>
                      </>
                    ) : (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => fileInputRef.current?.click()}
                        className="h-7 px-2.5 text-[11px] font-semibold rounded-[6px] border border-blue-200 dark:border-blue-800/60 text-[#2864E8] dark:text-blue-400 bg-blue-50/70 dark:bg-blue-950/40 hover:bg-blue-100/70 shadow-none cursor-pointer flex items-center gap-1.5"
                      >
                        <Upload className="w-3 h-3" />
                        <span>Upload</span>
                      </Button>
                    )}
                  </div>
                </div>

                <Input
                  id={`photo-upload-${variant}`}
                  ref={fileInputRef}
                  type="file"
                  accept="image/png, image/jpeg, image/jpg, image/webp"
                  className="hidden"
                  onChange={handlePhotoFileChange}
                />
              </motion.div>
            )}

            {/* STEP 3 — Full Application Review */}
            {currentStep === 3 && (
              <motion.div
                key="step-3"
                data-review-panel="true"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="px-4 sm:px-7 pt-3.5 pb-4 space-y-3 text-left bg-white dark:bg-slate-950"
              >
                {/* Highlighted Student Photo & Identity Summary Strip */}
                <div className="rounded-lg bg-[#F8FAFD] dark:bg-slate-900/55 border border-[#E6EEF8] dark:border-slate-800/90 px-4 py-2.5 flex items-center gap-3.5">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    title={photoPreview ? 'Change photo on Step 2' : 'Upload compulsory photo on Step 2'}
                    className={cn(
                      'w-[46px] h-[58px] rounded-[4px] shrink-0 overflow-hidden flex flex-col items-center justify-center bg-white dark:bg-slate-950 cursor-pointer transition-colors',
                      photoPreview
                        ? 'border border-neutral-300 dark:border-slate-700'
                        : 'border border-dashed border-slate-300 hover:border-[#2864E8]'
                    )}
                  >
                    {photoPreview ? (
                      <img src={photoPreview} alt="Student" className="w-full h-full object-cover" />
                    ) : (
                      <>
                        <Camera className="w-3.5 h-3.5 text-slate-400" />
                        <span className="text-[8px] font-medium text-slate-400 mt-0.5">Photo</span>
                      </>
                    )}
                  </button>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                      <h4 className="text-[14.5px] sm:text-[15px] font-semibold text-[#171717] dark:text-white leading-snug truncate">
                        {form.watch('studentName') || 'Student Name —'}
                      </h4>
                      <span className="inline-flex items-center text-[10.5px] font-medium font-mono text-[#475569] dark:text-slate-300 bg-[#E9EFF8] dark:bg-slate-800 px-2 py-0.5 rounded-[4px] shrink-0">
                        {form.watch('studentId') || 'Provisional ID'}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-[11.5px] text-[#525252] dark:text-slate-300 mt-0.5 leading-snug">
                      <span className="font-medium text-[#262626] dark:text-slate-200">
                        {form.watch('branch')?.split(',')[0] || 'Branch —'}
                      </span>
                      {form.watch('classApplied') && (
                        <>
                          <span className="text-neutral-300 dark:text-slate-700" aria-hidden="true">•</span>
                          <span>
                            {form.watch('classApplied')}
                            {form.watch('program') ? ` — ${form.watch('program')}` : ''}
                          </span>
                        </>
                      )}
                      {form.watch('admissionSession') && (
                        <>
                          <span className="text-neutral-300 dark:text-slate-700" aria-hidden="true">•</span>
                          <span>{form.watch('admissionSession')}</span>
                        </>
                      )}
                      {form.watch('mode') && (
                        <>
                          <span className="text-neutral-300 dark:text-slate-700" aria-hidden="true">•</span>
                          <span>{form.watch('mode')}</span>
                        </>
                      )}
                    </div>
                    {(form.watch('board') || form.watch('medium') || form.watch('stream')) && (
                      <p className="text-[11px] text-[#737373] dark:text-slate-400 mt-0.5 leading-snug">
                        {[
                          form.watch('board')
                            ? `Board: ${
                                form.watch('board') === 'OTHER' && form.watch('otherBoard')?.trim()
                                  ? form.watch('otherBoard')?.trim()
                                  : form.watch('board')
                              }`
                            : '',
                          form.watch('medium') ? `Medium: ${form.watch('medium')}` : '',
                          form.watch('stream') ? `Subjects: ${form.watch('stream')}` : '',
                        ]
                          .filter(Boolean)
                          .join(' • ')}
                      </p>
                    )}
                  </div>
                </div>

                {/* Section 1: Student & Parent Details (A4-clean white hairline container) */}
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
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-2.5">
                    <ReviewDetailItem
                      label="Date of Birth"
                      value={formatDateForDisplay(form.watch('dob')) || dobInput}
                    />
                    <ReviewDetailItem
                      label="Gender"
                      value={form.watch('gender')}
                      valueClassName="capitalize"
                    />
                    <ReviewDetailItem label="Academic Session" value={form.watch('admissionSession')} />
                    <ReviewDetailItem label="Classroom Mode" value={form.watch('mode')} />
                    <ReviewDetailItem
                      label="Board"
                      value={
                        form.watch('board') === 'OTHER' && form.watch('otherBoard')?.trim()
                          ? form.watch('otherBoard')?.trim()
                          : form.watch('board')
                      }
                    />
                    <ReviewDetailItem label="Medium" value={form.watch('medium')} />
                    <ReviewDetailItem
                      label="Aadhar No."
                      value={form.watch('aadharNumber')}
                      valueClassName="tabular-nums"
                    />
                    <ReviewDetailItem label="APAAR ID" value={form.watch('apaarId')} />
                    <ReviewDetailItem label="Father Name" value={form.watch('fatherName')} />
                    <ReviewDetailItem label="Father Occupation" value={form.watch('fatherOccupation')} />
                    <ReviewDetailItem label="Mother Name" value={form.watch('motherName')} />
                    <ReviewDetailItem label="Mother Occupation" value={form.watch('motherOccupation')} />
                  </div>
                </section>

                {/* Section 2: Contact, Address & Academic Details (A4-clean white hairline container) */}
                <section className="rounded-lg border border-neutral-200/90 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-3">
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="w-[18px] h-[18px] rounded-full border border-neutral-300 dark:border-slate-700 text-[9.5px] font-semibold text-[#262626] dark:text-slate-200 flex items-center justify-center shrink-0">
                        2
                      </span>
                      <h3 className="text-[9.5px] sm:text-[10.5px] font-semibold uppercase tracking-[0.02em] sm:tracking-[0.03em] text-[#171717] dark:text-slate-100 leading-tight">
                        Contact, Address &amp; Academic Details
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
                      value={form.watch('fatherPhone') ? `+91 ${form.watch('fatherPhone')}` : ''}
                      valueClassName="tabular-nums whitespace-nowrap"
                    />
                    <ReviewDetailItem
                      label="Mother Contact"
                      value={form.watch('motherPhone') ? `+91 ${form.watch('motherPhone')}` : ''}
                      valueClassName="tabular-nums whitespace-nowrap"
                    />
                    <ReviewDetailItem
                      label="Student Contact"
                      value={form.watch('studentPhone') ? `+91 ${form.watch('studentPhone')}` : ''}
                      valueClassName="tabular-nums whitespace-nowrap"
                    />
                    <ReviewDetailItem
                      label="Email"
                      value={form.watch('email')}
                      valueClassName="break-all"
                    />
                    <ReviewDetailItem
                      label="Full Address"
                      value={form.watch('address')}
                      className="col-span-2 sm:col-span-2"
                    />
                    <ReviewDetailItem label="State" value={form.watch('state')} />
                    <ReviewDetailItem
                      label="City"
                      value={
                        form.watch('city') === 'Other' && form.watch('customCity')?.trim()
                          ? form.watch('customCity')?.trim()
                          : form.watch('city')
                      }
                    />
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2.5 pt-2.5 mt-2.5 border-t border-neutral-100 dark:border-slate-800/70">
                    <ReviewDetailItem
                      label="Previous School"
                      value={form.watch('previousSchool')}
                      className="col-span-2 sm:col-span-1"
                    />
                    <ReviewDetailItem label="Marks / Grade" value={form.watch('previousPercentage')} />
                    <ReviewDetailItem label="Scholarship / Test" value={form.watch('scholarshipTest')} />
                  </div>
                </section>

                {/* Declaration & Terms & Conditions Checkbox */}
                <FormField
                  control={form.control}
                  name="acceptedTerms"
                  render={({ field }) => (
                    <FormItem className="space-y-1 text-left">
                      <div className="pt-0.5 flex items-start gap-2.5">
                        <FormControl>
                          <Checkbox
                            id="admission-declaration-checkbox"
                            checked={Boolean(field.value)}
                            onCheckedChange={(checked) => {
                              field.onChange(Boolean(checked));
                              form.clearErrors('acceptedTerms');
                            }}
                            className="mt-0.5 border-slate-400 dark:border-slate-600 data-[state=checked]:bg-[#2864E8] data-[state=checked]:border-[#2864E8] cursor-pointer"
                          />
                        </FormControl>
                        <FormLabel
                          htmlFor="admission-declaration-checkbox"
                          className="text-[11.5px] sm:text-[12px] font-normal text-slate-600 dark:text-slate-300 leading-[1.5] cursor-pointer"
                        >
                          I hereby declare that I have read the{' '}
                          <a
                            href="/terms-conditions"
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-[#2864E8] dark:text-blue-400 font-medium underline underline-offset-2 hover:text-[#1E4ED8]"
                          >
                            Terms &amp; Conditions
                          </a>
                          . The details mentioned above in the form are correct to the best of my knowledge and belief.
                        </FormLabel>
                      </div>
                      <FormMessage className="text-[11.5px] font-medium text-rose-500" />
                    </FormItem>
                  )}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer Action Bar */}
        <div
          className={cn(
            'px-3 sm:px-7 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-1.5 sm:gap-2 shrink-0',
            currentStep === 3 ? 'py-2.5' : 'py-3',
            isModal
              ? 'bg-white/95 dark:bg-slate-950/95 backdrop-blur-sm mt-auto sticky bottom-0 z-20 pb-[max(0.75rem,env(safe-area-inset-bottom))]'
              : currentStep === 3
                ? 'bg-white dark:bg-slate-950'
                : 'bg-[#F8FBFF]/60 dark:bg-slate-900/60'
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
                  const isValid = await validateCompulsoryFields();
                  if (isValid) {
                    setIsPaymentDialogOpen(true);
                  }
                }}
                className="group h-8 sm:h-9 px-2.5 sm:px-4 rounded-lg font-semibold text-[10.5px] sm:text-[11.5px] tracking-[0.03em] sm:tracking-[0.05em] uppercase bg-[#2864E8] hover:bg-[#1E4ED8] active:bg-[#1842BE] text-white shadow-xs transition-all duration-150 cursor-pointer flex items-center justify-center gap-1 sm:gap-1.5 shrink-0 whitespace-nowrap"
              >
                <span>SUBMIT &amp; PAY ({formatFeeBadge(ADMISSION_APPLICATION_FEE_INR)})</span>
                <Send className="h-3 w-3 text-white/90 shrink-0" />
              </Button>
            </div>
          )}
        </div>
      </form>
    </Form>
  );

  return (
    <>
      <Script id="razorpay-checkout-admission-js" src="https://checkout.razorpay.com/v1/checkout.js" />

      {isModal ? (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
          <FormModalDialogContent
            onOpenAutoFocus={(e) => e.preventDefault()}
            onCloseAutoFocus={(e) => e.preventDefault()}
            maxWidthClass="max-w-[480px] sm:max-w-[580px] md:max-w-[620px]"
            className="w-[94vw] sm:w-[92vw] p-0 shadow-[0_24px_60px_-12px_rgba(15,23,42,0.18),0_2px_8px_rgba(15,23,42,0.06)] rounded-[20px] sm:rounded-[24px] border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-950 !outline-none focus:!outline-none focus:!ring-0 focus-visible:!outline-none focus-visible:!ring-0 ring-0"
          >
            <div className="flex items-center justify-between px-4 sm:px-7 py-3 sm:py-3.5 border-b border-slate-100 dark:border-slate-800/80 pr-12 sm:pr-14 bg-white dark:bg-slate-950 shrink-0">
              <div className="flex flex-col sm:flex-row sm:items-center items-start gap-0.5 sm:gap-x-2 select-none text-left">
                <span className="text-[11px] sm:text-[12px] font-bold tracking-[0.08em] uppercase text-slate-700 dark:text-slate-200">
                  ADMISSION FORM {selectedSession || '2026-2027'}
                </span>
              </div>
            </div>

            <DialogHeader className="sr-only">
              <DialogTitle>Admission Form {selectedSession || '2026-2027'}</DialogTitle>
              <DialogDescription>Complete the admission application in 3 simple steps.</DialogDescription>
            </DialogHeader>

            {formContent}
          </FormModalDialogContent>
        </Dialog>
      ) : (
        <CleanFormCard
          title={`Admission Form ${selectedSession || '2026-2027'}`}
          subtitle="Complete the admission application in 3 simple steps."
          maxWidthClass="max-w-[600px] sm:max-w-[640px]"
          bodyClassName="p-0"
          dataAttr="data-admission-card"
        >
          {formContent}
        </CleanFormCard>
      )}

      <AdmissionSubmissionDialogs
        isPaymentDialogOpen={isPaymentDialogOpen}
        setIsPaymentDialogOpen={setIsPaymentDialogOpen}
        isThankYouOpen={isThankYouOpen}
        setIsThankYouOpen={setIsThankYouOpen}
        isIdCardOpen={isIdCardOpen}
        setIsIdCardOpen={setIsIdCardOpen}
        isSubmitting={isSubmitting}
        activeStudent={form.getValues()}
        submittedStudent={submittedData}
        photoPreview={photoPreview}
        onPay={handlePayment}
        onAfterCloseAll={() => {
          if (isModal) onOpenChange?.(false);
          setPhotoPreview(null);
        }}
      />

      {/* Passport Photo Crop Modal */}
      <PhotoCropModal
        isOpen={isCropOpen}
        imageSrc={activeCropImage}
        onClose={() => setIsCropOpen(false)}
        onApplyCrop={(croppedDataUrl, fileBlob) => {
          setPhotoPreview(croppedDataUrl);
          setActiveCropImage(croppedDataUrl);
          setPhotoError(null);
          form.setValue('studentPhoto', fileBlob);
          setIsCropOpen(false);
          toast({
            title: 'Photo adjusted & confirmed',
            description: 'Passport photograph is ready for admission.',
          });
        }}
      />
    </>
  );
}
