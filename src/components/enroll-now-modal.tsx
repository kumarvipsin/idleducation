'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ArrowRight, Check, X, MapPin, Building2, User, Phone, Mail, BookOpen, Sparkles, GraduationCap, Laptop, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { submitEnrollment } from "@/app/actions/enrollment";
import { enrollmentSchema, type EnrollmentFormValues } from "@/types/enrollment";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FormModalDialogContent } from "@/components/ui/form-modal-dialog";
import { cn } from "@/lib/utils";

export const IDL_BRANCH_OPTIONS = [
  { id: "budh-vihar", label: "Budh Vihar, Delhi-110086", name: "Budh Vihar Branch" },
  { id: "krishan-vihar", label: "Krishan Vihar, Delhi-110086", name: "Krishan Vihar Branch" },
  { id: "mangolpuri", label: "Mangol Puri, Delhi-110083", name: "Mangolpuri Branch" },
  { id: "mukherjee-nagar", label: "Mukherjee Nagar, Delhi-110009", name: "Mukherjee Nagar Branch" },
];

export const GENERAL_CLASSES = [
  "Class 4th",
  "Class 5th",
  "Class 6th",
  "Class 7th",
  "Class 8th",
  "Class 9th",
  "Class 10th",
  "Class 11th",
  "Class 12th"
];

export const GENERAL_COURSES = [
  "Academic Foundation (Class 4–10: All Main Subjects)",
  "Commerce Foundation (Class 11–12: Accounts, Eco, BST, Maths)",
  "Science & Engineering (JEE Main & Advanced Foundation)",
  "Pre-Medical (NEET-UG Foundation)",
  "CUET (UG) Integrated Preparation",
  "CBSE Board Special Revision / Crash Course"
];

// Specialized presets for Explore Academic Programs cards
export const JUNIOR_CLASSES = [
  "Class 4th",
  "Class 5th",
  "Class 6th",
  "Class 7th",
  "Class 8th"
];

export const JUNIOR_COURSES = [
  "Junior Foundation (Maths, Science, English, Reasoning)",
  "Full CBSE All Subjects Foundation",
  "Special Focus Batch (Maths & Science Excellence)"
];

export const SECONDARY_CLASSES = [
  "Class 9th",
  "Class 10th"
];

export const SECONDARY_COURSES = [
  "Secondary Board Foundation (Maths, Science, English, SST)",
  "CBSE Board Topper Batch (All 5 Main Subjects)",
  "Maths & Science Intensive Batch"
];

export const SENIOR_CLASSES = [
  "Class 11th",
  "Class 12th"
];

export const SENIOR_COURSES = [
  "Commerce Foundation (Full Stream: Accounts, Eco, BST, Maths)",
  "Commerce with Applied / Core Mathematics",
  "Commerce Core (Accounts + Economics + Business Studies)",
  "CUET (UG) Commerce Integrated Batch"
];

export const SENIOR_COMMERCE_SUBJECTS = [
  "Mathematics",
  "Accounts",
  "Economics",
  "Business Studies"
];

export const SENIOR_SCIENCE_SUBJECTS = [
  "PCM",
  "PCB",
  "PCMB"
];

export const SENIOR_HUMANITIES_SUBJECTS = [
  "Economics",
  "Political Science",
  "History",
  "Geography"
];

export const JEE_NEET_CLASSES = [
  "Class 11",
  "Class 12",
  "Class 12 PASS"
];

export const JEE_NEET_COURSES = [
  "JEE (Main & Advanced) Comprehensive Batch",
  "NEET-UG (Medical Entrance) Comprehensive Batch",
  "Target Repeater / Dropper Batch (JEE / NEET)",
  "Class 11th + 12th Integrated CBSE + Entrance",
  "Pre-Foundation for JEE & Medical (Classes 9–10)"
];

export const JEE_NEET_SUBJECTS = [
  "NEET",
  "JEE Main",
  "JEE Advance",
  "JEE Main+Advance"
];

const JEE_NEET_SHORT_LABELS: Record<string, string> = {
  "NEET": "NEET",
  "JEE Main": "JEE Main",
  "JEE Advance": "JEE Adv",
  "JEE Main+Advance": "JEE Main+Adv",
};

export { GENERAL_CLASSES as CLASS_OPTIONS, GENERAL_COURSES as COURSE_OPTIONS };

interface EnrollNowModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  defaultBranch?: string;
  hideBranchField?: boolean;
  defaultClass?: string;
  defaultCourse?: string;
  programTitle?: string;
  allowedClasses?: string[];
  allowedCourses?: string[];
  availableBranches?: string[];
  source?: string;
}

// Capitalizes the first letter of each word (Title Case)
const toTitleCase = (str: string) => {
  return str.replace(/\b([a-z])/g, (char) => char.toUpperCase());
};

/**
 * Normalizes branch string or slug to match IDL_BRANCH_OPTIONS
 */
export const normalizeBranchSelection = (branchStr?: string) => {
  if (!branchStr) return null;
  const normDef = branchStr.toLowerCase().replace(/[^a-z0-9]/g, '');
  return IDL_BRANCH_OPTIONS.find((b) => {
    const normLabel = b.label.toLowerCase().replace(/[^a-z0-9]/g, '');
    const normName = b.name.toLowerCase().replace(/[^a-z0-9]/g, '');
    const normId = b.id.toLowerCase().replace(/[^a-z0-9]/g, '');
    return normDef.includes(normId) || normId.includes(normDef) || 
           normLabel.includes(normDef) || normDef.includes(normLabel) ||
           normName.includes(normDef) || normDef.includes(normName);
  }) || null;
};

/**
 * Determines whether a specific branch offers the given program / course / class.
 * 
 * Rules:
 * 1. JEE / NEET: Available at Mukherjee Nagar, Mangolpuri, and Budh Vihar. (Krishan Vihar is disabled).
 * 2. Classes 4–8 (Junior Foundation): Available at Mangolpuri and Budh Vihar.
 * 3. Classes 9–10 (Secondary Board): Available at all 4 branches.
 * 4. Classes 11–12 (Commerce Foundation): Available at all 4 branches.
 * 5. If availableBranches prop is provided, strictly follow it.
 */
export const isBranchAvailableForCourse = ({
  branchId,
  programTitle,
  classLevel,
  course,
  allowedClasses,
  allowedCourses,
  availableBranches,
}: {
  branchId: string;
  programTitle?: string;
  classLevel?: string;
  course?: string;
  allowedClasses?: string[];
  allowedCourses?: string[];
  availableBranches?: string[];
}): boolean => {
  if (availableBranches && availableBranches.length > 0) {
    return availableBranches.includes(branchId);
  }

  const pTitle = (programTitle || '').toLowerCase();
  const cLevel = (classLevel || '').toLowerCase();
  const cName = (course || '').toLowerCase();

  // Check if it's JEE / NEET
  const isJeeNeet = 
    pTitle.includes('jee') || pTitle.includes('neet') ||
    cLevel.includes('jee') || cLevel.includes('neet') ||
    cName.includes('jee') || cName.includes('neet') ||
    (allowedCourses && allowedCourses.some(c => c.toLowerCase().includes('jee') || c.toLowerCase().includes('neet')));

  if (isJeeNeet) {
    return branchId === 'mukherjee-nagar' || branchId === 'mangolpuri' || branchId === 'budh-vihar';
  }

  // Check if it's Primary Junior (Classes 1 to 3 — Mangolpuri)
  const isPrimaryJunior =
    pTitle.includes('1–8') || pTitle.includes('1-8') ||
    ['1st', '2nd', '3rd'].some(j => cLevel.includes(j));

  if (isPrimaryJunior) {
    return branchId === 'mangolpuri';
  }

  // Check if it's Junior Foundation (Classes 4 to 8)
  const isJunior = 
    pTitle.includes('junior') || pTitle.includes('4–8') || pTitle.includes('4-8') ||
    ['4th', '5th', '6th', '7th', '8th'].some(j => cLevel.includes(j)) ||
    (allowedClasses && allowedClasses.some(c => ['4th', '5th', '6th', '7th', '8th'].some(j => c.includes(j))));

  if (isJunior) {
    return branchId === 'mangolpuri' || branchId === 'budh-vihar' || branchId === 'krishan-vihar';
  }

  // All other CBSE Board (Class 9, 10, 11, 12) & Commerce are available across all 4 branches
  return true;
};

export function EnrollNowModal({ 
  isOpen, 
  onOpenChange,
  defaultBranch,
  hideBranchField,
  defaultClass,
  defaultCourse,
  programTitle,
  allowedClasses,
  allowedCourses,
  availableBranches,
  source = "Website Modal"
}: EnrollNowModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [submittedData, setSubmittedData] = useState<EnrollmentFormValues | null>(null);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const { toast } = useToast();

  const shouldHideBranch = hideBranchField ?? Boolean(defaultBranch);

  const classList = allowedClasses && allowedClasses.length > 0 ? allowedClasses : GENERAL_CLASSES;
  const courseList = allowedCourses && allowedCourses.length > 0 ? allowedCourses : GENERAL_COURSES;

  const initialClass = defaultClass || '';
  const initialCourse = defaultCourse || (allowedCourses && allowedCourses.length > 0 ? allowedCourses[0] : '');
  const initialBranch = defaultBranch ? (normalizeBranchSelection(defaultBranch)?.label || defaultBranch) : '';

  const modalSchema = useMemo(
    () =>
      enrollmentSchema.superRefine((vals, ctx) => {
        const trimmedEmail = (vals.email || '').trim();
        if (!trimmedEmail) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['email'],
            message: "Email address is required.",
          });
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['email'],
            message: "Please enter a valid email address.",
          });
        }

        const isJeeNeet = Boolean(
          programTitle?.toLowerCase().includes('jee') ||
          programTitle?.toLowerCase().includes('neet') ||
          vals.classLevel?.toLowerCase().includes('jee') ||
          vals.classLevel?.toLowerCase().includes('neet') ||
          vals.course?.toLowerCase().includes('jee') ||
          vals.course?.toLowerCase().includes('neet') ||
          (allowedCourses && allowedCourses.some(c => c.toLowerCase().includes('jee') || c.toLowerCase().includes('neet')))
        );
        const isSenior =
          isJeeNeet ||
          Boolean(programTitle?.includes('11') || programTitle?.includes('12')) ||
          Boolean(vals.classLevel?.includes('11') || vals.classLevel?.includes('12')) ||
          Boolean(allowedClasses && allowedClasses.some(c => c.includes('11') || c.includes('12')));

        if (isSenior && (!vals.subjects || vals.subjects.length === 0)) {
          const isScience =
            !isJeeNeet &&
            Boolean(
              programTitle?.toLowerCase().includes('science') ||
              vals.course?.toLowerCase().includes('science') ||
              (allowedCourses && allowedCourses.some(c => c.toLowerCase().includes('science')))
            );
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['subjects'],
            message: isJeeNeet
              ? "Please select a target stream."
              : isScience
                ? "Please select a subject stream (PCM, PCB, or PCMB)."
                : "Please select at least one subject.",
          });
        }
      }),
    [programTitle, allowedClasses, allowedCourses]
  );

  const form = useForm<EnrollmentFormValues>({
    resolver: zodResolver(modalSchema),
    defaultValues: {
      mode: 'Offline',
      studentName: '',
      fatherName: '',
      mobile: '',
      email: '',
      branch: initialBranch,
      branchSlug: '',
      classLevel: initialClass,
      course: initialCourse,
      subjects: [],
      programTitle: programTitle || '',
      state: 'Delhi',
      city: 'Delhi',
      pincode: '',
      previousSchool: '',
      remarks: '',
      source: source,
    },
  });

  const currentClass = form.watch("classLevel");
  const currentCourse = form.watch("course");
  const currentBranch = form.watch("branch");

  const isJeeNeetActive = Boolean(
    programTitle?.toLowerCase().includes('jee') || 
    programTitle?.toLowerCase().includes('neet') ||
    currentClass?.toLowerCase().includes('jee') ||
    currentClass?.toLowerCase().includes('neet') ||
    currentCourse?.toLowerCase().includes('jee') ||
    currentCourse?.toLowerCase().includes('neet') ||
    (allowedCourses && allowedCourses.some(c => c.toLowerCase().includes('jee') || c.toLowerCase().includes('neet')))
  );

  // Check if subject selector should be shown (for 11, 12, or JEE/NEET)
  const isSeniorClassActive = 
    isJeeNeetActive ||
    Boolean(programTitle?.includes('11') || programTitle?.includes('12')) ||
    Boolean(currentClass?.includes('11') || currentClass?.includes('12')) ||
    (allowedClasses && allowedClasses.some(c => c.includes('11') || c.includes('12')));

  const isScienceProgramActive =
    isSeniorClassActive &&
    !isJeeNeetActive &&
    Boolean(
      programTitle?.toLowerCase().includes('science') ||
      currentCourse?.toLowerCase().includes('science') ||
      (allowedCourses && allowedCourses.some(c => c.toLowerCase().includes('science')))
    );

  const isHumanitiesProgramActive =
    isSeniorClassActive &&
    !isJeeNeetActive &&
    !isScienceProgramActive &&
    Boolean(
      programTitle?.toLowerCase().includes('humanities') ||
      currentCourse?.toLowerCase().includes('humanities') ||
      (allowedCourses && allowedCourses.some(c => c.toLowerCase().includes('humanities')))
    );

  const isSingleSelectSubject = isJeeNeetActive || isScienceProgramActive;

  const subjectListToUse = isJeeNeetActive
    ? JEE_NEET_SUBJECTS
    : isScienceProgramActive
      ? SENIOR_SCIENCE_SUBJECTS
      : isHumanitiesProgramActive
        ? SENIOR_HUMANITIES_SUBJECTS
        : SENIOR_COMMERCE_SUBJECTS;

  // Synchronize when modal opens or props change
  useEffect(() => {
    if (isOpen) {
      if (defaultBranch) {
        const matched = normalizeBranchSelection(defaultBranch);
        if (matched) {
          form.setValue('branch', matched.label);
          form.setValue('branchSlug', matched.id);
        } else {
          form.setValue('branch', defaultBranch);
        }
      } else {
        // Main page / non-branch page: branch must start unselected and be manually chosen
        form.setValue('branch', '');
        form.setValue('branchSlug', '');
      }

      form.setValue('classLevel', defaultClass || '');

      if (defaultCourse) {
        form.setValue('course', defaultCourse);
      } else if (allowedCourses && allowedCourses.length > 0) {
        form.setValue('course', allowedCourses[0]);
      }

      if (programTitle) {
        form.setValue('programTitle', programTitle);
      }

      if (source) {
        form.setValue('source', source);
      }

      form.setValue('mode', 'Offline');
      setSelectedSubjects([]);
      form.setValue('subjects', []);
      form.clearErrors();

      if (typeof document !== 'undefined' && document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
    }
  }, [isOpen, defaultBranch, defaultClass, defaultCourse, programTitle, allowedClasses, allowedCourses, source, form]);

  // If the currently selected branch is NOT available for the active course/class, reset it!
  useEffect(() => {
    if (currentBranch && !shouldHideBranch) {
      const selectedOption = IDL_BRANCH_OPTIONS.find(b => b.label === currentBranch);
      if (selectedOption) {
        const available = isBranchAvailableForCourse({
          branchId: selectedOption.id,
          programTitle,
          classLevel: currentClass,
          course: currentCourse,
          allowedClasses,
          allowedCourses,
          availableBranches,
        });
        if (!available) {
          form.setValue('branch', '');
          form.setValue('branchSlug', '');
        }
      }
    }
  }, [currentBranch, shouldHideBranch, currentClass, currentCourse, programTitle, allowedClasses, allowedCourses, availableBranches, form]);

  // Toggle subject selection (single-select for Science PCM/PCB/PCMB and JEE/NEET, multi-select for Commerce)
  const handleToggleSubject = (sub: string) => {
    let updated: string[];
    if (isSingleSelectSubject) {
      updated = selectedSubjects.includes(sub) ? [] : [sub];
    } else if (sub === "All Commerce Subjects") {
      if (selectedSubjects.includes("All Commerce Subjects")) {
        updated = [];
      } else {
        updated = ["All Commerce Subjects"];
      }
    } else {
      const filtered = selectedSubjects.filter(s => s !== "All Commerce Subjects");
      if (filtered.includes(sub)) {
        updated = filtered.filter(s => s !== sub);
      } else {
        updated = [...filtered, sub];
      }
    }
    setSelectedSubjects(updated);
    form.setValue('subjects', updated, { shouldValidate: updated.length > 0 });
    if (updated.length > 0) {
      form.clearErrors('subjects');
    }
  };

  const onSubmit: SubmitHandler<EnrollmentFormValues> = async (data) => {
    // 1. Validate that a branch was chosen
    if (!data.branch) {
      form.setError('branch', { message: 'Please select an available branch / centre.' });
      return;
    }

    // 2. Validate that subjects / stream are selected whenever the subject section is active
    if (isSeniorClassActive && selectedSubjects.length === 0) {
      form.setError('subjects', {
        message: isJeeNeetActive
          ? 'Please select a target stream.'
          : isScienceProgramActive
            ? 'Please select a subject stream (PCM, PCB, or PCMB).'
            : 'Please select at least one subject.',
      });
      return;
    }

    // 2. Validate that the chosen branch offers this course
    const branchOption = IDL_BRANCH_OPTIONS.find(b => b.label === data.branch);
    if (branchOption) {
      const isAvailable = isBranchAvailableForCourse({
        branchId: branchOption.id,
        programTitle,
        classLevel: data.classLevel,
        course: data.course,
        allowedClasses,
        allowedCourses,
        availableBranches,
      });
      if (!isAvailable) {
        form.setError('branch', { message: 'This course is not available at the selected branch. Please choose an available branch.' });
        return;
      }
    }

    setIsSubmitting(true);
    try {
      // If subjects selected, attach to data
      const finalData: EnrollmentFormValues = {
        ...data,
        mode: data.mode || 'Offline',
        subjects: selectedSubjects,
        programTitle: programTitle || data.programTitle || '',
      };

      const result = await submitEnrollment(finalData);

      if (result.success) {
        setSubmittedData(finalData);
        setIsSuccessOpen(true);
        form.reset();
        setSelectedSubjects([]);
      } else {
        toast({
          variant: "destructive",
          title: "Submission Failed",
          description: result.message || "Failed to submit enrollment. Please try again.",
        });
      }
    } catch {
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <FormModalDialogContent
          hideCloseButton
          onOpenAutoFocus={(e) => e.preventDefault()}
          onCloseAutoFocus={(e) => e.preventDefault()}
          maxWidthClass="max-w-[460px] sm:max-w-[490px]"
          className="w-[92vw] sm:w-[94vw] p-0 shadow-[0_24px_60px_-12px_rgba(15,23,42,0.16),0_2px_8px_rgba(15,23,42,0.04)] border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-950 antialiased !outline-none focus:!outline-none focus:!ring-0 focus-visible:!outline-none focus-visible:!ring-0 ring-0"
        >
          {/* Top Heading: Left-aligned, Clean Navy Uppercase Header with Vertically-Centered Close Icon */}
          <div className="flex items-center justify-between gap-3 px-6 sm:px-7 py-2.5 border-b border-slate-200/75 dark:border-slate-800/80 bg-[#FAFBFD] dark:bg-slate-900/70 shrink-0">
            <span className="text-[11.5px] sm:text-[12px] font-extrabold tracking-[0.1em] uppercase text-[#173568] dark:text-slate-200 leading-none select-none truncate">
              {programTitle 
                ? programTitle.toUpperCase().replace(/^ENROLL:\s*/i, '').replace(/^ENROLL\s*/i, '').replace(/\bCLASSES\b/g, 'CLASS')
                : "STUDENT REGISTRATION"}
            </span>
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              aria-label="Close modal"
              className="w-7 h-7 -mr-1.5 rounded-full flex items-center justify-center text-slate-400 hover:text-[#173568] hover:bg-slate-200/65 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2864E8]/25 cursor-pointer shrink-0"
            >
              <X className="w-4 h-4 stroke-[2]" />
            </button>
          </div>

          <DialogHeader className="sr-only">
            <DialogTitle>
              {programTitle ? programTitle.replace(/^Enroll:\s*/i, '').replace(/^Enroll\s*/i, '').replace(/\bClasses\b/gi, 'Class') : "Student Registration"}
            </DialogTitle>
            <DialogDescription>
              {programTitle 
                ? `Registration form for ${programTitle.replace(/^Enroll:\s*/i, '').replace(/^Enroll\s*/i, '').replace(/\bClasses\b/gi, 'Class')}`
                : "Student registration form"
              }
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col flex-1 h-full min-h-0 overflow-y-auto overscroll-contain" autoComplete="off">
              {/* Form Body - Plain, Clean Underlines, Consistent Vertical Spacing */}
              <div className="px-6 sm:px-7 pt-3.5 pb-5 space-y-3 sm:space-y-3.5 text-left">

                {/* 1. Branch Selection: Hidden inside individual branch pages (pre-bound automatically), shown on main website */}
                {!shouldHideBranch && (
                  <FormField
                    control={form.control}
                    name="branch"
                    render={({ field }) => (
                      <FormItem className="space-y-0">
                        <FormLabel className="sr-only">Branch / Center</FormLabel>
                        <Select 
                          onValueChange={(val) => {
                            field.onChange(val);
                            const matched = IDL_BRANCH_OPTIONS.find(b => b.label === val);
                            if (matched) {
                              form.setValue('branchSlug', matched.id);
                            }
                          }} 
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger
                              className={cn(
                                "h-[38px] py-0 w-full border-0 border-b border-slate-200/90 hover:border-slate-300 dark:border-slate-700/80 !bg-transparent rounded-none px-0 text-[13.5px] md:text-[13.5px] tracking-[-0.005em] focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:outline-none focus-visible:ring-offset-0 ring-0 ring-offset-0 focus:border-[#2864E8] focus:shadow-[0_1px_0_0_#2864E8] shadow-none flex items-center justify-between transition-[border-color,box-shadow] duration-150 [&>span]:truncate [&>span]:leading-none [&>svg]:w-4 [&>svg]:h-4 [&>svg]:stroke-[1.9] [&>svg]:text-slate-400 [&>svg]:opacity-90 hover:[&>svg]:text-[#2864E8] data-[state=open]:[&>svg]:text-[#2864E8] [&>svg]:transition-all [&>svg]:duration-150 data-[state=open]:[&>svg]:rotate-180 cursor-pointer",
                                field.value
                                  ? "font-medium text-[#173568] dark:text-white"
                                  : "font-normal text-slate-400"
                              )}
                            >
                              <SelectValue placeholder="Branch / Centre *" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="max-h-[260px] z-[120] rounded-lg border-slate-200/85 shadow-lg">
                            {IDL_BRANCH_OPTIONS.map((b) => {
                              const isAvailable = isBranchAvailableForCourse({
                                branchId: b.id,
                                programTitle,
                                classLevel: currentClass,
                                course: currentCourse,
                                allowedClasses,
                                allowedCourses,
                                availableBranches,
                              });
                              return (
                                <SelectItem 
                                  key={b.id} 
                                  value={b.label} 
                                  disabled={!isAvailable}
                                  className={cn(
                                    "text-[13px] py-1.5 cursor-pointer",
                                    !isAvailable && "opacity-45 cursor-not-allowed pointer-events-none select-none bg-slate-50/50 dark:bg-slate-900/30"
                                  )}
                                >
                                  <div className="flex items-center justify-between w-full gap-2">
                                    <span className={cn(
                                      "font-semibold",
                                      isAvailable ? "text-slate-900 dark:text-white" : "text-slate-400 line-through decoration-slate-300"
                                    )}>
                                      {b.name}
                                    </span>
                                    {!isAvailable && (
                                      <span className="text-[9.5px] font-bold tracking-tight text-rose-500 bg-rose-50 dark:bg-rose-950/60 px-1.5 py-0.5 rounded shrink-0">
                                        Unavailable
                                      </span>
                                    )}
                                  </div>
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>
                        <FormMessage className="text-[11.5px] font-medium text-rose-500 pt-0.5" />
                      </FormItem>
                    )}
                  />
                )}

                {/* 3. Student Name: Height h-[38px] Centered, Plain Underline, Watermark Inside */}
                <FormField
                  control={form.control}
                  name="studentName"
                  render={({ field }) => (
                    <FormItem className="space-y-0">
                      <FormLabel className="sr-only">Student Full Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Student Full Name *"
                          {...field}
                          value={field.value}
                          onChange={(e) => field.onChange(toTitleCase(e.target.value))}
                          className="h-[38px] py-0 w-full border-0 border-b border-slate-200/90 hover:border-slate-300 dark:border-slate-700/80 !bg-transparent rounded-none px-0 text-[13.5px] md:text-[13.5px] font-medium tracking-[-0.005em] text-[#173568] dark:text-slate-100 placeholder:text-slate-400 placeholder:font-normal focus-visible:ring-0 focus-visible:border-[#2864E8] focus-visible:shadow-[0_1px_0_0_#2864E8] shadow-none capitalize leading-normal transition-[border-color,box-shadow] duration-150"
                        />
                      </FormControl>
                      <FormMessage className="text-[11.5px] font-medium text-rose-500 pt-0.5" />
                    </FormItem>
                  )}
                />

                {/* 4. Father / Guardian Name: Height h-[38px] Centered, Plain Underline, Watermark Inside */}
                <FormField
                  control={form.control}
                  name="fatherName"
                  render={({ field }) => (
                    <FormItem className="space-y-0">
                      <FormLabel className="sr-only">Father / Guardian Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Father / Guardian Name *"
                          {...field}
                          value={field.value}
                          onChange={(e) => field.onChange(toTitleCase(e.target.value))}
                          className="h-[38px] py-0 w-full border-0 border-b border-slate-200/90 hover:border-slate-300 dark:border-slate-700/80 !bg-transparent rounded-none px-0 text-[13.5px] md:text-[13.5px] font-medium tracking-[-0.005em] text-[#173568] dark:text-slate-100 placeholder:text-slate-400 placeholder:font-normal focus-visible:ring-0 focus-visible:border-[#2864E8] focus-visible:shadow-[0_1px_0_0_#2864E8] shadow-none capitalize leading-normal transition-[border-color,box-shadow] duration-150"
                        />
                      </FormControl>
                      <FormMessage className="text-[11.5px] font-medium text-rose-500 pt-0.5" />
                    </FormItem>
                  )}
                />

                {/* 5. Mobile Number: Height h-[38px] Centered, Plain Underline, No Vertical Line After +91 */}
                <FormField
                  control={form.control}
                  name="mobile"
                  render={({ field }) => (
                    <FormItem className="space-y-0">
                      <FormLabel className="sr-only">Mobile Number</FormLabel>
                      <FormControl>
                        <div className="relative flex items-center h-[38px] w-full border-b border-slate-200/90 hover:border-slate-300 dark:border-slate-700/80 focus-within:border-[#2864E8] focus-within:shadow-[0_1px_0_0_#2864E8] transition-[border-color,box-shadow] duration-150">
                          <span className="inline-flex items-center pr-2.5 text-[13.5px] font-bold text-[#173568]/80 dark:text-slate-300 tabular-nums select-none shrink-0 leading-normal">
                            +91
                          </span>
                          <Input
                            type="tel"
                            maxLength={10}
                            placeholder="Mobile Number (10 digits) *"
                            {...field}
                            className="h-full py-0 w-full border-0 !bg-transparent rounded-none px-0 text-[13.5px] md:text-[13.5px] font-medium tracking-[-0.005em] text-[#173568] dark:text-slate-100 placeholder:text-slate-400 placeholder:font-normal tabular-nums focus-visible:ring-0 focus-visible:outline-none shadow-none leading-normal"
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-[11.5px] font-medium text-rose-500 pt-0.5" />
                    </FormItem>
                  )}
                />

                {/* 6. Email: Height h-[38px] Centered, Plain Underline, Compulsory */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="space-y-0">
                      <FormLabel className="sr-only">Email Address</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="Email Address *"
                          {...field}
                          className="h-[38px] py-0 w-full border-0 border-b border-slate-200/90 hover:border-slate-300 dark:border-slate-700/80 !bg-transparent rounded-none px-0 text-[13.5px] md:text-[13.5px] font-medium tracking-[-0.005em] text-[#173568] dark:text-slate-100 placeholder:text-slate-400 placeholder:font-normal focus-visible:ring-0 focus-visible:border-[#2864E8] focus-visible:shadow-[0_1px_0_0_#2864E8] shadow-none leading-normal transition-[border-color,box-shadow] duration-150"
                        />
                      </FormControl>
                      <FormMessage className="text-[11.5px] font-medium text-rose-500 pt-0.5" />
                    </FormItem>
                  )}
                />

                {/* 7. Class / Grade: Height h-[38px] Centered, Plain Underline Never Hides */}
                <FormField
                  control={form.control}
                  name="classLevel"
                  render={({ field }) => (
                    <FormItem className="space-y-0">
                      <FormLabel className="sr-only">Class / Grade</FormLabel>
                      <Select
                        key={`class-${programTitle || 'default'}-${isOpen ? 'open' : 'closed'}`}
                        onValueChange={field.onChange}
                        value={field.value || ''}
                      >
                        <FormControl>
                          <SelectTrigger
                            className={cn(
                              "h-[38px] py-0 w-full border-0 border-b border-slate-200/90 hover:border-slate-300 dark:border-slate-700/80 !bg-transparent rounded-none px-0 text-[13.5px] md:text-[13.5px] tracking-[-0.005em] focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:outline-none focus-visible:ring-offset-0 ring-0 ring-offset-0 focus:border-[#2864E8] focus:shadow-[0_1px_0_0_#2864E8] shadow-none flex items-center justify-between transition-[border-color,box-shadow] duration-150 [&>span]:truncate [&>span]:leading-none [&>svg]:w-4 [&>svg]:h-4 [&>svg]:stroke-[1.9] [&>svg]:text-slate-400 [&>svg]:opacity-90 hover:[&>svg]:text-[#2864E8] data-[state=open]:[&>svg]:text-[#2864E8] [&>svg]:transition-all [&>svg]:duration-150 data-[state=open]:[&>svg]:rotate-180 cursor-pointer",
                              field.value
                                ? "font-medium text-[#173568] dark:text-white"
                                : "font-normal text-slate-400"
                            )}
                          >
                            <SelectValue placeholder="Class / Grade *" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="max-h-[240px] z-[120] rounded-lg border-slate-200/85 shadow-lg">
                          {classList.map((c) => (
                            <SelectItem key={c} value={c} className="text-[13px] font-medium text-[#173568] py-1.5 cursor-pointer focus:bg-[#F4F8FF] focus:text-[#2864E8]">
                              {c}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-[11.5px] font-medium text-rose-500 pt-0.5" />
                    </FormItem>
                  )}
                />

                {/* 8. Subjects / Streams (If Senior / JEE / NEET): Clean single-line row across JEE/NEET, Science (PCM/PCB/PCMB), Humanities, and Commerce (Compulsory) */}
                {isSeniorClassActive && (
                  <div className="space-y-2.5 pt-1 pb-2.5 border-b border-slate-200/90 dark:border-slate-700/80">
                    <span className="text-[10.5px] sm:text-[11px] font-bold tracking-[0.09em] uppercase text-[#173568]/75 dark:text-slate-400 block leading-none select-none">
                      {isJeeNeetActive ? "SELECT TARGET STREAM / SUBJECT(S) *" : "SELECT SUBJECT(S) *"}
                    </span>
                    <div
                      className={cn(
                        "w-full",
                        isScienceProgramActive
                          ? "flex items-center flex-nowrap gap-7 sm:gap-10"
                          : isJeeNeetActive
                            ? "flex items-center justify-between flex-nowrap gap-1 sm:gap-2"
                            : "grid grid-cols-2 gap-x-4 gap-y-2.5 sm:flex sm:items-center sm:justify-between sm:flex-nowrap sm:gap-1.5"
                      )}
                    >
                      {subjectListToUse.map((sub) => {
                        const isSelected = selectedSubjects.includes(sub);
                        const displayLabel = isJeeNeetActive ? (JEE_NEET_SHORT_LABELS[sub] || sub) : sub;
                        return (
                          <button
                            key={sub}
                            type="button"
                            title={sub}
                            onClick={() => handleToggleSubject(sub)}
                            className={cn(
                              "flex items-center text-left cursor-pointer group py-0.5 select-none focus:outline-none transition-colors shrink-0",
                              isScienceProgramActive
                                ? "gap-2"
                                : isJeeNeetActive
                                  ? "gap-1 sm:gap-1.5"
                                  : "gap-2 sm:gap-1.5"
                            )}
                          >
                            <div
                              className={cn(
                                "rounded-[4px] border flex items-center justify-center shrink-0 transition-all duration-150",
                                isScienceProgramActive
                                  ? "w-[16px] h-[16px]"
                                  : isJeeNeetActive
                                    ? "w-[14px] h-[14px] sm:w-[15px] sm:h-[15px]"
                                    : "w-[16px] h-[16px] sm:w-[15px] sm:h-[15px]",
                                isSelected
                                  ? "border-[1.5px] border-[#2864E8] bg-[#2864E8] text-white shadow-[0_1px_3px_rgba(40,100,232,0.28)]"
                                  : "border-[1.5px] border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 group-hover:border-[#2864E8]/80 group-hover:bg-[#F4F8FF]/60"
                              )}
                            >
                              {isSelected && <Check className={cn("stroke-[3]", isScienceProgramActive ? "w-3.5 h-3.5" : "w-3 h-3")} />}
                            </div>
                            <span
                              className={cn(
                                "transition-colors leading-[15px] whitespace-nowrap",
                                isScienceProgramActive
                                  ? "text-[12.5px] sm:text-[13px]"
                                  : isJeeNeetActive
                                    ? "text-[11px] sm:text-[12px]"
                                    : "text-[12.5px] sm:text-[12px] sm:tracking-[-0.01em]",
                                isSelected
                                  ? "font-semibold text-[#173568] dark:text-white"
                                  : "font-medium text-[#173568]/80 dark:text-slate-300 group-hover:text-[#173568]"
                              )}
                            >
                              {displayLabel}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                    {form.formState.errors.subjects?.message && (
                      <p className="text-[11.5px] font-medium text-rose-500 pt-0.5">
                        {String(form.formState.errors.subjects.message)}
                      </p>
                    )}
                  </div>
                )}

                {/* 9. Current School / Institution (Optional): Height h-[38px] Centered, Plain Underline */}
                <FormField
                  control={form.control}
                  name="previousSchool"
                  render={({ field }) => (
                    <FormItem className="space-y-0">
                      <FormLabel className="sr-only">Current School / Institution</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Current School / College (Optional)"
                          {...field}
                          className="h-[38px] py-0 w-full border-0 border-b border-slate-200/90 hover:border-slate-300 dark:border-slate-700/80 !bg-transparent rounded-none px-0 text-[13.5px] md:text-[13.5px] font-medium tracking-[-0.005em] text-[#173568] dark:text-slate-100 placeholder:text-slate-400 placeholder:font-normal focus-visible:ring-0 focus-visible:border-[#2864E8] focus-visible:shadow-[0_1px_0_0_#2864E8] shadow-none leading-normal transition-[border-color,box-shadow] duration-150"
                        />
                      </FormControl>
                      <FormMessage className="text-[11.5px] font-medium text-rose-500 pt-0.5" />
                    </FormItem>
                  )}
                />

                {/* 10. CTA Submit Button: Line Above Removed, Capital Only "SUBMIT" */}
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="group w-full h-[41px] sm:h-[42px] rounded-[8px] font-bold text-[13px] sm:text-[13.5px] tracking-[0.09em] leading-none bg-gradient-to-b from-[#2E6BF0] to-[#235CE0] hover:from-[#2660E4] hover:to-[#1C4FD0] active:from-[#1D52D2] active:to-[#1743B8] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_4px_14px_-2px_rgba(40,100,232,0.34)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.22),0_6px_18px_-2px_rgba(40,100,232,0.44)] active:shadow-sm active:translate-y-[0.5px] transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 mt-3.5 uppercase"
                >
                  {isSubmitting ? (
                    <span className="inline-flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      SUBMITTING...
                    </span>
                  ) : (
                    <>
                      <span>SUBMIT</span>
                      <ArrowRight className="w-4 h-4 stroke-[2.25] text-white/95 group-hover:translate-x-0.5 transition-transform duration-150" />
                    </>
                  )}
                </Button>

              </div>
            </form>
          </Form>
        </FormModalDialogContent>
      </Dialog>

      {/* Success Dialog */}
      <Dialog open={isSuccessOpen} onOpenChange={(open) => {
        setIsSuccessOpen(open);
        if (!open) {
          onOpenChange(false);
        }
      }}>
        <DialogContent className="max-w-[420px] rounded-2xl p-6 text-center z-[130]">
          <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <DialogTitle className="text-xl font-bold text-slate-900 dark:text-white">
            Enrollment Request Received!
          </DialogTitle>
          <DialogDescription className="text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
            Thank you, <span className="font-semibold text-slate-900 dark:text-white">{submittedData?.studentName}</span>. Your enrollment details for <span className="font-semibold text-slate-900 dark:text-white">{submittedData?.branch}</span> have been registered.
          </DialogDescription>
          <div className="mt-4 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 text-left space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
            <div className="flex justify-between">
              <span className="text-slate-400 font-medium">Program:</span>
              <span className="font-bold text-slate-800 dark:text-slate-200 truncate max-w-[200px]">{submittedData?.programTitle || submittedData?.classLevel}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400 font-medium">Class:</span>
              <span className="font-bold text-blue-600">{submittedData?.classLevel}</span>
            </div>
            {submittedData?.subjects && submittedData.subjects.length > 0 && (
              <div className="flex justify-between">
                <span className="text-slate-400 font-medium">Subjects:</span>
                <span className="font-semibold text-purple-700 truncate max-w-[200px]">{submittedData.subjects.join(', ')}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-slate-400 font-medium">Branch:</span>
              <span className="font-bold text-slate-800 dark:text-slate-200 truncate max-w-[200px]">{submittedData?.branch}</span>
            </div>
          </div>
          <DialogFooter className="mt-5">
            <Button 
              onClick={() => {
                setIsSuccessOpen(false);
                onOpenChange(false);
              }}
              className="w-full rounded-[5px] bg-[#2864E8] text-white font-semibold"
            >
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
