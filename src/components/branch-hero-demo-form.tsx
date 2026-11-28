'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { bookFreeSession, submitStudentEnquiry } from '@/app/actions/forms';
import { getPublicBranchClassCatalog } from '@/app/actions/fee-management';
import {
  getClassesForBranchValue,
  getSubjectSelectorConfig,
  getTitlesForBranchClass,
  type BranchClassCatalogResult,
} from '@/lib/branch-courses';
import { DemoSubjectSelector } from '@/components/demo-subject-selector';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  CLEAN_SELECT_CONTENT_CLASS,
  CLEAN_SELECT_ITEM_CLASS,
  toSentenceCase,
  toTitleCase,
} from '@/components/clean-form-card';
import { useToast } from '@/hooks/use-toast';

export type HeroLeadFormKind = 'demo' | 'enquiry';

interface BranchHeroDemoFormProps {
  branchValue: string;
  branchShortName: string;
  initialCatalog?: BranchClassCatalogResult;
  formKind?: HeroLeadFormKind;
}

const CATALOG_REFRESH_THROTTLE_MS = 2500;

const HERO_INPUT_CLASS =
  'w-full h-[44px] md:h-[38px] px-3.5 rounded-[10px] md:rounded-[8px] border border-slate-200/80 md:border-slate-200/85 hover:border-slate-300/90 bg-[#F8FAFD] md:bg-slate-50/35 focus:bg-white text-[13.5px] md:text-[13px] font-medium text-[#173568] md:text-slate-800 placeholder:text-slate-400 md:placeholder:text-slate-400/90 placeholder:font-normal focus:outline-none focus:border-[#2864E8] focus:ring-2 focus:ring-[#2864E8]/15 transition-all';

const HERO_SELECT_TRIGGER_CLASS =
  'w-full h-[44px] md:h-[38px] px-3.5 rounded-[10px] md:rounded-[8px] border border-slate-200/80 md:border-slate-200/85 hover:border-slate-300/90 bg-[#F8FAFD] md:bg-slate-50/35 data-[state=open]:bg-white text-[13.5px] md:text-[13px] font-medium text-[#173568] md:text-slate-800 data-[placeholder]:text-slate-400 md:data-[placeholder]:text-slate-400/90 data-[placeholder]:font-normal focus:outline-none focus:ring-2 focus:ring-[#2864E8]/15 focus:border-[#2864E8] data-[state=open]:border-[#2864E8] data-[state=open]:ring-2 data-[state=open]:ring-[#2864E8]/15 shadow-none flex items-center justify-between transition-all [&>span]:truncate [&>svg]:w-4 [&>svg]:h-4 [&>svg]:text-slate-400 [&>svg]:shrink-0 [&>svg]:transition-transform [&>svg]:duration-200 data-[state=open]:[&>svg]:rotate-180 data-[state=open]:[&>svg]:text-[#2864E8] cursor-pointer';

const EMPTY_CATALOG: BranchClassCatalogResult = {
  classesByBranch: {},
  titlesByBranchAndClass: {},
  sourcesByBranch: {},
};

const HERO_FORM_COPY: Record<
  HeroLeadFormKind,
  {
    heading: string;
    textPlaceholder: string;
    submitLabel: string;
    submittingLabel: string;
    successTitle: string;
    resetButtonLabel: string;
  }
> = {
  demo: {
    heading: 'Book your Free Demo',
    textPlaceholder: 'Subject(s) You Need Help With *',
    submitLabel: 'Book Free Demo',
    submittingLabel: 'Booking Session...',
    successTitle: 'Free Demo Session Booked!',
    resetButtonLabel: 'Book Another Demo',
  },
  enquiry: {
    heading: 'Student Enquiry',
    textPlaceholder: 'Which stream, subject(s), or question? *',
    submitLabel: 'Submit Enquiry',
    submittingLabel: 'Submitting...',
    successTitle: 'Enquiry Submitted!',
    resetButtonLabel: 'Submit Another Enquiry',
  },
};

export function BranchHeroDemoForm({
  branchValue,
  branchShortName,
  initialCatalog,
  formKind = 'demo',
}: BranchHeroDemoFormProps) {
  const { toast } = useToast();
  const isEnquiry = formKind === 'enquiry';
  const copy = HERO_FORM_COPY[formKind];

  const [branchCatalog, setBranchCatalog] = useState<BranchClassCatalogResult>(
    initialCatalog || EMPTY_CATALOG
  );
  const lastFetchedAtRef = useRef<number>(0);

  const [studentName, setStudentName] = useState('');
  const [guardianName, setGuardianName] = useState('');
  const [fatherPhone, setFatherPhone] = useState('');
  const [motherPhone, setMotherPhone] = useState('');
  const [studentPhone, setStudentPhone] = useState('');
  const [email, setEmail] = useState('');
  const [classCourse, setClassCourse] = useState('');
  const [programTitle, setProgramTitle] = useState('');
  const [subjects, setSubjects] = useState('');
  const [selectedStreamSubjects, setSelectedStreamSubjects] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSummary, setSubmittedSummary] = useState<{
    studentName: string;
    classCourse: string;
    programTitle: string;
    details: string;
  } | null>(null);

  const availableCourses = useMemo(
    () => getClassesForBranchValue(branchCatalog, branchValue),
    [branchCatalog, branchValue]
  );

  const availableTitles = useMemo(
    () => getTitlesForBranchClass(branchCatalog, branchValue, classCourse),
    [branchCatalog, branchValue, classCourse]
  );

  const subjectConfig = useMemo(
    () => getSubjectSelectorConfig(classCourse, programTitle),
    [classCourse, programTitle]
  );

  const lastStreamKeyRef = useRef<string>('');
  useEffect(() => {
    const nextKey = `${subjectConfig.mode}::${subjectConfig.heading}::${programTitle}`;
    if (lastStreamKeyRef.current && lastStreamKeyRef.current !== nextKey) {
      setSelectedStreamSubjects([]);
      setSubjects('');
    }
    lastStreamKeyRef.current = nextKey;
  }, [subjectConfig.mode, subjectConfig.heading, programTitle]);

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

  // Sync live branch classes/courses on mount & tab focus/visibility return
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

  // Clear or align selected class/title if branch catalog changes live
  useEffect(() => {
    if (classCourse && !availableCourses.includes(classCourse)) {
      setClassCourse('');
      setProgramTitle('');
      return;
    }
    if (!classCourse) {
      if (programTitle) setProgramTitle('');
      return;
    }
    if (availableTitles.length === 1) {
      if (programTitle !== availableTitles[0]) {
        setProgramTitle(availableTitles[0]);
      }
    } else if (programTitle && !availableTitles.includes(programTitle)) {
      setProgramTitle('');
    }
  }, [classCourse, programTitle, availableCourses, availableTitles]);

  const classPlaceholder = availableCourses.length === 0 ? 'No classes available' : 'Class / Course *';
  const titlePlaceholder = !classCourse
    ? 'Select Class First *'
    : availableTitles.length === 0
      ? 'No titles available'
      : 'Select Title *';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (studentName.trim().length < 2) {
      toast({
        title: 'Student Name Required',
        description: 'Please enter the student full name.',
        variant: 'destructive',
      });
      return;
    }
    if (guardianName.trim().length < 2) {
      toast({
        title: 'Guardian Name Required',
        description: 'Please enter parent / guardian name.',
        variant: 'destructive',
      });
      return;
    }
    if (!/^\d{10}$/.test(fatherPhone)) {
      toast({
        title: 'Father Contact Required',
        description: 'Please enter a valid 10-digit father contact number.',
        variant: 'destructive',
      });
      return;
    }
    if (motherPhone.trim() && !/^\d{10}$/.test(motherPhone.trim())) {
      toast({
        title: 'Invalid Mother Contact',
        description: 'Please enter a valid 10-digit mother contact number.',
        variant: 'destructive',
      });
      return;
    }
    if (studentPhone.trim() && !/^\d{10}$/.test(studentPhone.trim())) {
      toast({
        title: 'Invalid Student Contact',
        description: 'Please enter a valid 10-digit student contact number.',
        variant: 'destructive',
      });
      return;
    }
    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      toast({
        title: 'Invalid Email Address',
        description: 'Please enter a valid email address.',
        variant: 'destructive',
      });
      return;
    }
    if (!classCourse) {
      toast({
        title: 'Select Class / Course',
        description: 'Please select a class or course.',
        variant: 'destructive',
      });
      return;
    }
    if (!programTitle) {
      toast({
        title: 'Select Title',
        description: 'Please select a title.',
        variant: 'destructive',
      });
      return;
    }
    if (subjects.trim().length < 2) {
      toast({
        title: isEnquiry ? 'Enquiry Details Required' : 'Subject(s) Required',
        description:
          subjectConfig.mode === 'stream'
            ? 'Please select at least one stream / subject.'
            : isEnquiry
              ? 'Please enter stream, subject(s), or your question.'
              : 'Please enter subject(s) or learning requirement.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const result = isEnquiry
        ? await submitStudentEnquiry({
            studentName: studentName.trim(),
            guardianName: guardianName.trim(),
            fatherPhone: fatherPhone.trim(),
            motherPhone: motherPhone.trim(),
            studentPhone: studentPhone.trim(),
            mobile: fatherPhone.trim(),
            email: email.trim(),
            state: 'Delhi',
            branch: branchValue,
            classCourse,
            programTitle,
            message: subjects.trim(),
          })
        : await bookFreeSession({
            mode: 'Offline',
            studentName: studentName.trim(),
            guardianName: guardianName.trim(),
            fatherPhone: fatherPhone.trim(),
            motherPhone: motherPhone.trim(),
            studentPhone: studentPhone.trim(),
            mobile: fatherPhone.trim(),
            email: email.trim(),
            state: 'Delhi',
            branch: branchValue,
            nearestBranch: branchValue,
            classCourse,
            programTitle,
            subjects: subjects.trim(),
          });

      if (result.success) {
        setSubmittedSummary({
          studentName: studentName.trim(),
          classCourse,
          programTitle,
          details: subjects.trim(),
        });
        toast({
          title: copy.successTitle,
          description: isEnquiry
            ? `Thank you ${studentName.trim()}, our ${branchShortName} counsellor will reach out shortly.`
            : `Your ${branchShortName} Branch demo session is confirmed for ${studentName.trim()}.`,
        });
        setStudentName('');
        setGuardianName('');
        setFatherPhone('');
        setMotherPhone('');
        setStudentPhone('');
        setEmail('');
        setClassCourse('');
        setProgramTitle('');
        setSubjects('');
        setSelectedStreamSubjects([]);
      } else {
        toast({
          variant: 'destructive',
          title: 'Submission Failed',
          description: result.message || 'Failed to submit details. Please try again.',
        });
      }
    } catch {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'An unexpected error occurred. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submittedSummary) {
    return (
      <div className="py-5 text-center space-y-4 my-auto">
        <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-7 h-7" />
        </div>
        <div>
          <h2 className="text-[18px] sm:text-[19px] font-extrabold text-[#173568] tracking-[-0.02em] leading-snug">
            {copy.successTitle}
          </h2>
          <p className="text-[13px] text-slate-600 mt-1.5 leading-[1.6]">
            Thank you, <span className="font-bold text-[#173568]">{submittedSummary.studentName}</span>. Our{' '}
            {branchShortName} Branch counsellor will contact you shortly.
          </p>
        </div>
        <div className="rounded-xl bg-slate-50/90 border border-slate-200/70 p-3.5 text-left space-y-1.5 text-[12.5px]">
          <div className="flex justify-between gap-2">
            <span className="text-slate-500 font-medium">Branch:</span>
            <span className="font-bold text-[#173568]">{branchShortName}</span>
          </div>
          <div className="flex justify-between gap-2">
            <span className="text-slate-500 font-medium">Class / Course:</span>
            <span className="font-bold text-[#2864E8]">{submittedSummary.classCourse}</span>
          </div>
          <div className="flex justify-between gap-2">
            <span className="text-slate-500 font-medium">Title:</span>
            <span className="font-bold text-[#173568]">{submittedSummary.programTitle}</span>
          </div>
          <div className="flex justify-between gap-2">
            <span className="text-slate-500 font-medium">{isEnquiry ? 'Enquiry:' : 'Subject(s):'}</span>
            <span className="font-semibold text-slate-700 truncate max-w-[190px]">{submittedSummary.details}</span>
          </div>
        </div>
        <Button
          type="button"
          onClick={() => setSubmittedSummary(null)}
          className="w-full h-10 rounded-lg bg-[#2864E8] hover:bg-[#1E4ED8] text-white font-bold text-[14px] tracking-[0.01em] cursor-pointer"
        >
          {copy.resetButtonLabel}
        </Button>
      </div>
    );
  }

  return (
    <form
      {...(isEnquiry ? { 'data-hero-enquiry-form': '' } : { 'data-hero-demo-form': '' })}
      onSubmit={handleSubmit}
      className="flex-1 flex flex-col justify-between gap-4 md:gap-3.5"
      autoComplete="off"
    >
      <div className="space-y-3 md:space-y-2.5">
        <div className="text-center pb-0.5">
          <h2 className="text-[20px] sm:text-[21px] md:text-[20px] font-extrabold text-[#173568] tracking-[-0.025em] md:tracking-[-0.02em] leading-tight md:leading-snug">
            {copy.heading}
          </h2>
        </div>

        <div>
          <div className="flex items-center gap-3 md:gap-2.5 mb-2.5 md:mb-2">
            <div className="flex-1 h-[1px] bg-slate-200/55 md:bg-slate-200/65" />
            <span className="text-[11.5px] font-medium md:font-semibold text-slate-400 md:text-slate-500 tracking-[0.015em] md:tracking-[0.01em]">
              Enter Your Details
            </span>
            <div className="flex-1 h-[1px] bg-slate-200/55 md:bg-slate-200/65" />
          </div>

          <div className="space-y-2.5">
            {/* 1. Student Full Name & 2. Father / Guardian Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(toTitleCase(e.target.value))}
                placeholder="Student Full Name *"
                className={HERO_INPUT_CLASS}
              />

              <input
                type="text"
                value={guardianName}
                onChange={(e) => setGuardianName(toTitleCase(e.target.value))}
                placeholder="Father / Guardian Name *"
                className={HERO_INPUT_CLASS}
              />
            </div>

            {/* 3. Father Contact & Mother Contact (Optional) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="flex items-center h-[44px] md:h-[38px] rounded-[10px] md:rounded-[8px] border border-slate-200/80 md:border-slate-200/85 hover:border-slate-300/90 bg-[#F8FAFD] md:bg-slate-50/35 focus-within:bg-white overflow-hidden focus-within:border-[#2864E8] focus-within:ring-2 focus-within:ring-[#2864E8]/15 transition-all">
                <span className="pl-3 pr-1.5 text-[13px] md:text-[12px] font-bold md:font-semibold text-[#173568]/75 md:text-slate-500 tabular-nums select-none shrink-0">
                  +91
                </span>
                <input
                  type="tel"
                  maxLength={10}
                  value={fatherPhone}
                  onChange={(e) => setFatherPhone(e.target.value.replace(/\D/g, ''))}
                  placeholder="Father Contact *"
                  className="flex-1 min-w-0 h-full px-1 pr-2.5 bg-transparent text-[13px] md:text-[12.5px] font-medium text-[#173568] md:text-slate-800 placeholder:text-slate-400 md:placeholder:text-slate-400/90 placeholder:font-normal tabular-nums focus:outline-none"
                />
              </div>

              <div className="flex items-center h-[44px] md:h-[38px] rounded-[10px] md:rounded-[8px] border border-slate-200/80 md:border-slate-200/85 hover:border-slate-300/90 bg-[#F8FAFD] md:bg-slate-50/35 focus-within:bg-white overflow-hidden focus-within:border-[#2864E8] focus-within:ring-2 focus-within:ring-[#2864E8]/15 transition-all">
                <span className="pl-2.5 pr-1 text-[13px] md:text-[12px] font-bold md:font-semibold text-[#173568]/75 md:text-slate-500 tabular-nums select-none shrink-0">
                  +91
                </span>
                <input
                  type="tel"
                  maxLength={10}
                  value={motherPhone}
                  onChange={(e) => setMotherPhone(e.target.value.replace(/\D/g, ''))}
                  placeholder="Mother Contact (Opt.)"
                  className="flex-1 min-w-0 h-full px-1 pr-2 bg-transparent text-[13px] md:text-[12.5px] font-medium text-[#173568] md:text-slate-800 placeholder:text-slate-400 md:placeholder:text-slate-400/90 md:placeholder:text-[11.5px] placeholder:font-normal tabular-nums focus:outline-none"
                />
              </div>
            </div>

            {/* 4. Student Contact (Optional) & Email Address (Optional) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="flex items-center h-[44px] md:h-[38px] rounded-[10px] md:rounded-[8px] border border-slate-200/80 md:border-slate-200/85 hover:border-slate-300/90 bg-[#F8FAFD] md:bg-slate-50/35 focus-within:bg-white overflow-hidden focus-within:border-[#2864E8] focus-within:ring-2 focus-within:ring-[#2864E8]/15 transition-all">
                <span className="pl-2.5 pr-1 text-[13px] md:text-[12px] font-bold md:font-semibold text-[#173568]/75 md:text-slate-500 tabular-nums select-none shrink-0">
                  +91
                </span>
                <input
                  type="tel"
                  maxLength={10}
                  value={studentPhone}
                  onChange={(e) => setStudentPhone(e.target.value.replace(/\D/g, ''))}
                  placeholder="Student Contact (Opt.)"
                  className="flex-1 min-w-0 h-full px-1 pr-2 bg-transparent text-[13px] md:text-[12.5px] font-medium text-[#173568] md:text-slate-800 placeholder:text-slate-400 md:placeholder:text-slate-400/90 md:placeholder:text-[11.5px] placeholder:font-normal tabular-nums focus:outline-none"
                />
              </div>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email Address (Optional)"
                className={HERO_INPUT_CLASS}
              />
            </div>

            {/* 4. Class / Course & 5. Title (No Branch dropdown — locked to current branch) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <Select
                key={`${formKind}::${branchValue}`}
                disabled={availableCourses.length === 0}
                value={classCourse}
                onValueChange={(val) => {
                  setClassCourse(val);
                  const nextTitles = getTitlesForBranchClass(branchCatalog, branchValue, val);
                  setProgramTitle(nextTitles.length === 1 ? nextTitles[0] : '');
                }}
              >
                <SelectTrigger
                  className={cn(
                    HERO_SELECT_TRIGGER_CLASS,
                    availableCourses.length === 0 && 'cursor-not-allowed opacity-65'
                  )}
                >
                  <SelectValue placeholder={classPlaceholder} />
                </SelectTrigger>
                <SelectContent className={cn(CLEAN_SELECT_CONTENT_CLASS, 'z-[120]')}>
                  {availableCourses.map((courseName) => (
                    <SelectItem key={courseName} value={courseName} className={CLEAN_SELECT_ITEM_CLASS}>
                      {courseName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                key={`${formKind}::${branchValue}::${classCourse || 'no-class'}`}
                disabled={!classCourse || availableTitles.length === 0}
                value={programTitle}
                onValueChange={setProgramTitle}
              >
                <SelectTrigger
                  className={cn(
                    HERO_SELECT_TRIGGER_CLASS,
                    (!classCourse || availableTitles.length === 0) && 'cursor-not-allowed opacity-65'
                  )}
                >
                  <SelectValue placeholder={titlePlaceholder} />
                </SelectTrigger>
                <SelectContent className={cn(CLEAN_SELECT_CONTENT_CLASS, 'z-[120]')}>
                  {availableTitles.map((titleOption) => (
                    <SelectItem key={titleOption} value={titleOption} className={CLEAN_SELECT_ITEM_CLASS}>
                      {titleOption}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* 6. Stream Checkboxes or Subject(s) / Enquiry Message */}
            {subjectConfig.mode === 'stream' ? (
              <DemoSubjectSelector
                config={subjectConfig}
                selectedSubjects={selectedStreamSubjects}
                onChange={(next) => {
                  setSelectedStreamSubjects(next);
                  setSubjects(next.join(', '));
                }}
                variant="hero"
              />
            ) : (
              <input
                type="text"
                value={subjects}
                onChange={(e) => setSubjects(toSentenceCase(e.target.value))}
                placeholder={copy.textPlaceholder}
                className={HERO_INPUT_CLASS}
              />
            )}
          </div>
        </div>
      </div>

      {/* Primary Submit CTA */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full h-[46px] md:h-[40px] rounded-[10px] md:rounded-[8px] bg-gradient-to-b from-[#2E6BF0] to-[#235CE0] md:bg-none md:bg-[#2864E8] hover:from-[#2660E4] hover:to-[#1C4FD0] md:hover:bg-[#1E4ED8] active:bg-[#1842BE] text-white font-bold text-[14.5px] md:text-[14px] tracking-[0.01em] shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_6px_18px_-4px_rgba(40,100,232,0.38)] md:shadow-[0_4px_14px_-2px_rgba(40,100,232,0.34)] md:hover:shadow-[0_6px_18px_-2px_rgba(40,100,232,0.44)] active:scale-[0.99] transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-65 mt-auto"
      >
        {isSubmitting ? (
          <>
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            <span>{copy.submittingLabel}</span>
          </>
        ) : (
          <>
            <span>{copy.submitLabel}</span>
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </button>
    </form>
  );
}
