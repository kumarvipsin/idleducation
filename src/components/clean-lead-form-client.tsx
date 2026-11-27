'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowRight } from 'lucide-react';
import { bookFreeSession, registerForScholarship, submitStudentEnquiry } from '@/app/actions/forms';
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
import { DemoSubjectSelector } from '@/components/demo-subject-selector';
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
  CleanSuccessDialog,
  CLEAN_CTA_BUTTON_CLASS,
  CLEAN_ERROR_CLASS,
  CLEAN_INPUT_CLASS,
  CLEAN_SELECT_CONTENT_CLASS,
  CLEAN_SELECT_ITEM_CLASS,
  CLEAN_SELECT_TRIGGER_CLASS,
  toSentenceCase,
  toTitleCase,
} from '@/components/clean-form-card';

export type CleanLeadFormKind = 'demo' | 'enquiry' | 'scholarship';

const cleanLeadSchema = z.object({
  studentName: z.string().min(2, { message: 'Student name must be at least 2 characters.' }),
  guardianName: z.string().min(2, { message: 'Father / Guardian name is required.' }),
  mobile: z.string().regex(/^\d{10}$/, { message: 'Please enter a valid 10-digit mobile number.' }),
  branch: z.string().min(1, { message: 'Please select a branch.' }),
  classCourse: z.string().min(1, { message: 'Please select a class or course.' }),
  programTitle: z.string().min(1, { message: 'Please select a title.' }),
  subjects: z.string().min(2, { message: 'Please select or enter subject(s).' }),
  previousScore: z.string().optional(),
});

type CleanLeadValues = z.infer<typeof cleanLeadSchema>;

interface CleanLeadFormClientProps {
  formKind: CleanLeadFormKind;
  initialCatalog: BranchClassCatalogResult;
}

const CATALOG_REFRESH_THROTTLE_MS = 2500;

const FORM_COPY: Record<
  CleanLeadFormKind,
  {
    title: string;
    subtitle: string;
    dataAttr: string;
    textPlaceholder: string;
    ctaLabel: string;
    loadingLabel: string;
    successTitle: string;
    successDescription: string;
    errorFallback: string;
  }
> = {
  demo: {
    title: 'Book Free Demo',
    subtitle: 'Schedule a free trial class at your preferred branch.',
    dataAttr: 'data-book-demo-card',
    textPlaceholder: 'Subject(s) You Need Help With *',
    ctaLabel: 'BOOK FREE DEMO',
    loadingLabel: 'BOOKING...',
    successTitle: 'Free Demo Session Booked!',
    successDescription:
      'Thank you for booking your free demo session. Our academic counsellor will contact you shortly to confirm your schedule.',
    errorFallback: 'Could not book free demo.',
  },
  enquiry: {
    title: 'Student Enquiry',
    subtitle: 'Ask about batches, admissions, or fees.',
    dataAttr: 'data-student-enquiry-card',
    textPlaceholder: 'Which stream or subject are you enquiring for? *',
    ctaLabel: 'SUBMIT ENQUIRY',
    loadingLabel: 'SUBMITTING...',
    successTitle: 'Enquiry Received!',
    successDescription:
      'Thank you for reaching out. Our academic counselling team will contact you shortly to guide you further.',
    errorFallback: 'Unable to submit enquiry. Please try again.',
  },
  scholarship: {
    title: 'Apply for Scholarship',
    subtitle: 'Register for the IDL Admission & Scholarship Test.',
    dataAttr: 'data-scholarship-card',
    textPlaceholder: 'Subject(s) for Test *',
    ctaLabel: 'SUBMIT REGISTRATION',
    loadingLabel: 'SUBMITTING...',
    successTitle: 'Registration Confirmed!',
    successDescription:
      'You have successfully registered for the IDL Scholarship Test. Our team will reach out shortly with your test schedule.',
    errorFallback: 'Something went wrong. Please try again.',
  },
};

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

export default function CleanLeadFormClient({ formKind, initialCatalog }: CleanLeadFormClientProps) {
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const copy = FORM_COPY[formKind];
  const isEnquiry = formKind === 'enquiry';
  const isScholarship = formKind === 'scholarship';

  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [branchCatalog, setBranchCatalog] = useState<BranchClassCatalogResult>(initialCatalog);
  const lastFetchedAtRef = useRef<number>(0);

  const searchQueryKey = searchParams.toString();
  const initialDeepLink = useMemo(
    () => resolveDeepLinkSelection(searchParams, initialCatalog),
    // Resolve synchronously on first render for SSR/deep links
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  const lastAppliedQueryRef = useRef<string>(searchQueryKey);

  const form = useForm<CleanLeadValues>({
    resolver: zodResolver(cleanLeadSchema),
    defaultValues: {
      studentName: '',
      guardianName: '',
      mobile: '',
      branch: initialDeepLink.branch,
      classCourse: initialDeepLink.classCourse,
      programTitle: initialDeepLink.programTitle,
      subjects: '',
      previousScore: '',
    },
  });

  const selectedBranch = form.watch('branch');
  const selectedClassCourse = form.watch('classCourse');
  const selectedProgramTitle = form.watch('programTitle');

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

  // Reset subjects whenever active class/title switches to/from a different stream mode
  const lastStreamKeyRef = useRef<string>('');
  useEffect(() => {
    const nextKey = `${subjectConfig.mode}::${subjectConfig.heading}::${selectedProgramTitle}`;
    if (lastStreamKeyRef.current && lastStreamKeyRef.current !== nextKey) {
      setSelectedStreamSubjects([]);
      form.setValue('subjects', '');
      form.clearErrors('subjects');
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
      // Keep last known catalog cleanly on transient network issues
    }
  }, []);

  // Auto-sync live branch classes/courses on mount & tab focus/visibility return
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

  // Apply updated deep-link query params only when query string changes after mount
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

  // Sync Class / Course and Title cleanly when Branch or Catalog changes
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

  // Sync Title cleanly when Class / Course changes
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

  const classPlaceholder = !selectedBranch
    ? 'Select Branch First *'
    : availableCourses.length === 0
      ? 'No classes available'
      : 'Class / Course *';

  const titlePlaceholder = !selectedBranch || !selectedClassCourse
    ? 'Select Class First *'
    : availableTitles.length === 0
      ? 'No titles available'
      : 'Select Title *';

  const onSubmit: SubmitHandler<CleanLeadValues> = async (data) => {
    try {
      const result = isScholarship
        ? await registerForScholarship({
            mode: 'Offline',
            studentName: data.studentName,
            guardianName: data.guardianName,
            mobile: data.mobile,
            branch: data.branch,
            class: data.classCourse,
            programTitle: data.programTitle,
            subjects: data.subjects,
            message: data.previousScore?.trim() || '',
            state: 'Delhi',
            country: 'India',
          })
        : isEnquiry
          ? await submitStudentEnquiry({
              studentName: data.studentName,
              guardianName: data.guardianName,
              mobile: data.mobile,
              state: 'Delhi',
              branch: data.branch,
              classCourse: data.classCourse,
              programTitle: data.programTitle,
              message: data.subjects,
            })
          : await bookFreeSession({
              mode: 'Offline',
              studentName: data.studentName,
              guardianName: data.guardianName,
              mobile: data.mobile,
              email: '',
              state: 'Delhi',
              branch: data.branch,
              nearestBranch: data.branch,
              classCourse: data.classCourse,
              programTitle: data.programTitle,
              subjects: data.subjects,
            });

      if (result.success) {
        setIsSuccessOpen(true);
        setSelectedStreamSubjects([]);
        form.reset({
          studentName: '',
          guardianName: '',
          mobile: '',
          branch: '',
          classCourse: '',
          programTitle: '',
          subjects: '',
          previousScore: '',
        });
      } else {
        toast({
          variant: 'destructive',
          title: 'Submission Failed',
          description: result.message || copy.errorFallback,
        });
      }
    } catch {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Something went wrong. Please try again.',
      });
    }
  };

  return (
    <>
      <CleanFormCard title={copy.title} subtitle={copy.subtitle} dataAttr={copy.dataAttr}>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 sm:space-y-[18px]" autoComplete="off">
            {/* Row 1: 1. Student Full Name & 2. Father / Guardian Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
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
                        className={`${CLEAN_INPUT_CLASS} capitalize placeholder:normal-case`}
                      />
                    </FormControl>
                    <FormMessage className={CLEAN_ERROR_CLASS} />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="guardianName"
                render={({ field }) => (
                  <FormItem className="space-y-0 text-left">
                    <FormLabel className="sr-only">Father / Guardian Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Father / Guardian Name *"
                        {...field}
                        onChange={(e) => field.onChange(toTitleCase(e.target.value))}
                        className={`${CLEAN_INPUT_CLASS} capitalize placeholder:normal-case`}
                      />
                    </FormControl>
                    <FormMessage className={CLEAN_ERROR_CLASS} />
                  </FormItem>
                )}
              />
            </div>

            {/* Row 2: 3. Mobile Number & 4. Select Branch */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              <FormField
                control={form.control}
                name="mobile"
                render={({ field }) => (
                  <FormItem className="space-y-0 text-left">
                    <FormLabel className="sr-only">Mobile Number</FormLabel>
                    <FormControl>
                      <CleanMobileInput value={field.value} onDigitsChange={field.onChange} placeholder="Mobile Number *" />
                    </FormControl>
                    <FormMessage className={CLEAN_ERROR_CLASS} />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="branch"
                render={({ field }) => (
                  <FormItem className="space-y-0 text-left">
                    <FormLabel className="sr-only">Select Branch</FormLabel>
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
                          <SelectValue placeholder="Select Branch *" />
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

            {/* Row 3: 5. Class / Course & 6. Select Title */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
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
                    <FormLabel className="sr-only">Select Title</FormLabel>
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

            {/* Row 4: 7. Subject(s) or Stream Subject Checkboxes (+ optional Previous Class % for Scholarship) */}
            <div
              className={cn(
                isScholarship && subjectConfig.mode !== 'stream'
                  ? 'grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5'
                  : 'space-y-4 sm:space-y-[18px]'
              )}
            >
              <FormField
                control={form.control}
                name="subjects"
                render={({ field }) => (
                  <FormItem className="space-y-0 text-left">
                    <FormLabel className="sr-only">
                      {subjectConfig.mode === 'stream' ? subjectConfig.heading : copy.textPlaceholder}
                    </FormLabel>
                    {subjectConfig.mode === 'stream' ? (
                      <DemoSubjectSelector
                        config={subjectConfig}
                        selectedSubjects={selectedStreamSubjects}
                        onChange={(next) => {
                          setSelectedStreamSubjects(next);
                          field.onChange(next.join(', '));
                          if (next.length > 0) {
                            form.clearErrors('subjects');
                          }
                        }}
                        variant="underline"
                      />
                    ) : (
                      <FormControl>
                        <Input
                          placeholder={copy.textPlaceholder}
                          {...field}
                          onChange={(e) => field.onChange(toSentenceCase(e.target.value))}
                          className={CLEAN_INPUT_CLASS}
                        />
                      </FormControl>
                    )}
                    <FormMessage className={CLEAN_ERROR_CLASS} />
                  </FormItem>
                )}
              />

              {isScholarship && (
                <FormField
                  control={form.control}
                  name="previousScore"
                  render={({ field }) => (
                    <FormItem className="space-y-0 text-left">
                      <FormLabel className="sr-only">Previous Class %</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Previous Class % (Optional)"
                          {...field}
                          value={field.value || ''}
                          onChange={(e) => field.onChange(toSentenceCase(e.target.value))}
                          className={CLEAN_INPUT_CLASS}
                        />
                      </FormControl>
                      <FormMessage className={CLEAN_ERROR_CLASS} />
                    </FormItem>
                  )}
                />
              )}
            </div>

            <div className="pt-1">
              <Button type="submit" disabled={form.formState.isSubmitting} className={CLEAN_CTA_BUTTON_CLASS}>
                {form.formState.isSubmitting ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    {copy.loadingLabel}
                  </span>
                ) : (
                  <>
                    <span>{copy.ctaLabel}</span>
                    <ArrowRight className="w-4 h-4 text-white/95 group-hover:translate-x-1 transition-transform duration-200 shrink-0" />
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CleanFormCard>

      <CleanSuccessDialog
        open={isSuccessOpen}
        onOpenChange={setIsSuccessOpen}
        title={copy.successTitle}
        description={copy.successDescription}
      />
    </>
  );
}
