'use client';

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { CheckCircle2, ArrowRight, Check, MapPin, Building2, User, Phone, Mail, BookOpen, Sparkles, GraduationCap, Laptop, Users } from "lucide-react";
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
  "Accounts",
  "Economics",
  "Mathematics",
  "Others"
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

export { GENERAL_CLASSES as CLASS_OPTIONS, GENERAL_COURSES as COURSE_OPTIONS };

interface EnrollNowModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  defaultBranch?: string;
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
 * 1. JEE / NEET: Available at Mukherjee Nagar and Mangolpuri only. (Budh Vihar & Krishan Vihar are disabled).
 * 2. Classes 4–8 (Junior Foundation): Available at Mangolpuri only.
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
    return branchId === 'mukherjee-nagar' || branchId === 'mangolpuri';
  }

  // Check if it's Junior Foundation (Classes 4 to 8)
  const isJunior = 
    pTitle.includes('junior') || pTitle.includes('4–8') || pTitle.includes('4-8') ||
    ['4th', '5th', '6th', '7th', '8th'].some(j => cLevel.includes(j)) ||
    (allowedClasses && allowedClasses.some(c => ['4th', '5th', '6th', '7th', '8th'].some(j => c.includes(j))));

  if (isJunior) {
    return branchId === 'mangolpuri';
  }

  // All other CBSE Board (Class 9, 10, 11, 12) & Commerce are available across all 4 branches
  return true;
};

export function EnrollNowModal({ 
  isOpen, 
  onOpenChange,
  defaultBranch,
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

  const classList = allowedClasses && allowedClasses.length > 0 ? allowedClasses : GENERAL_CLASSES;
  const courseList = allowedCourses && allowedCourses.length > 0 ? allowedCourses : GENERAL_COURSES;

  const initialClass = defaultClass || (allowedClasses && allowedClasses.length > 0 ? allowedClasses[0] : '');
  const initialCourse = defaultCourse || (allowedCourses && allowedCourses.length > 0 ? allowedCourses[0] : '');
  const initialBranch = defaultBranch ? (normalizeBranchSelection(defaultBranch)?.label || defaultBranch) : '';

  const form = useForm<EnrollmentFormValues>({
    resolver: zodResolver(enrollmentSchema),
    defaultValues: {
      mode: '' as any,
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

  const subjectListToUse = isJeeNeetActive ? JEE_NEET_SUBJECTS : SENIOR_COMMERCE_SUBJECTS;

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

      if (defaultClass) {
        form.setValue('classLevel', defaultClass);
      } else if (allowedClasses && allowedClasses.length > 0) {
        form.setValue('classLevel', allowedClasses[0]);
      }

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

      form.setValue('mode', '' as any);
      setSelectedSubjects([]);
      form.setValue('subjects', []);

      if (typeof document !== 'undefined' && document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
    }
  }, [isOpen, defaultBranch, defaultClass, defaultCourse, programTitle, allowedClasses, allowedCourses, source, form]);

  // If the currently selected branch is NOT available for the active course/class, reset it!
  useEffect(() => {
    if (currentBranch) {
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
  }, [currentBranch, currentClass, currentCourse, programTitle, allowedClasses, allowedCourses, availableBranches, form]);

  // Toggle subject selection
  const handleToggleSubject = (sub: string) => {
    let updated: string[];
    if (sub === "All Commerce Subjects") {
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
    form.setValue('subjects', updated);
  };

  const onSubmit: SubmitHandler<EnrollmentFormValues> = async (data) => {
    // 1. Validate that a mode was chosen
    if (!data.mode) {
      form.setError('mode', { message: 'Please select your learning mode (Offline, Online, or Hybrid).' });
      return;
    }

    // 2. Validate that a branch was chosen
    if (!data.branch) {
      form.setError('branch', { message: 'Please select an available branch / centre.' });
      return;
    }

    // 3. Validate that the chosen branch offers this course
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
          onOpenAutoFocus={(e) => e.preventDefault()}
          onCloseAutoFocus={(e) => e.preventDefault()}
          maxWidthClass="max-w-[460px] sm:max-w-[490px]"
          className="w-[92vw] sm:w-[94vw] p-0 shadow-[0_24px_60px_-12px_rgba(15,23,42,0.16),0_2px_8px_rgba(15,23,42,0.04)] border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-950 !outline-none focus:!outline-none focus:!ring-0 focus-visible:!outline-none focus-visible:!ring-0 ring-0"
        >
          {/* Top Heading: Left-aligned, All Capital Letters, Small Font - NO "ENROLL" prefix, singular "CLASS" */}
          <div className="flex items-center justify-between px-6 sm:px-7 pt-4 pb-2.5 border-b border-slate-100/90 dark:border-slate-800/80 pr-14 bg-white dark:bg-slate-950 shrink-0">
            <span className="text-[11px] sm:text-[11.5px] font-bold tracking-[0.12em] uppercase text-slate-500/90 dark:text-slate-400 select-none">
              {programTitle 
                ? programTitle.toUpperCase().replace(/^ENROLL:\s*/i, '').replace(/^ENROLL\s*/i, '').replace(/\bCLASSES\b/g, 'CLASS')
                : "STUDENT REGISTRATION"}
            </span>
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

                {/* 1. Mode Selector: "Your Mode:" on left, text + dot radio indicator, compulsory */}
                <FormField
                  control={form.control}
                  name="mode"
                  render={({ field }) => (
                    <FormItem className="space-y-0.5">
                      <FormLabel className="sr-only">Learning Mode</FormLabel>
                      <FormControl>
                        <div className="flex flex-wrap items-center gap-x-5 sm:gap-x-7 gap-y-1.5 py-0.5">
                          <span className="text-[13px] sm:text-[13.5px] font-bold text-slate-800 dark:text-slate-200 shrink-0 leading-none">
                            Your Mode:
                          </span>
                          <div className="flex items-center gap-5 sm:gap-6">
                            {[
                              { value: 'Offline', label: 'Offline' },
                              { value: 'Online', label: 'Online' },
                              { value: 'Hybrid', label: 'Hybrid' },
                            ].map((item) => {
                              const isSelected = field.value === item.value;
                              return (
                                <button
                                  key={item.value}
                                  type="button"
                                  onClick={() => field.onChange(item.value)}
                                  className="inline-flex items-center gap-2 cursor-pointer select-none bg-transparent border-0 py-1 px-0.5 focus:outline-none group transition-opacity"
                                >
                                  <div
                                    className={cn(
                                      "w-[17px] h-[17px] rounded-full flex items-center justify-center transition-all duration-150 shrink-0",
                                      isSelected
                                        ? "border-[2px] border-[#2864E8] bg-white dark:bg-slate-900 shadow-[0_0_0_2px_rgba(40,100,232,0.12)]"
                                        : "border-[1.5px] border-slate-300 dark:border-slate-600 bg-transparent group-hover:border-slate-400"
                                    )}
                                  >
                                    {isSelected && (
                                      <div className="w-[7px] h-[7px] rounded-full bg-[#2864E8]" />
                                    )}
                                  </div>
                                  <span
                                    className={cn(
                                      "text-[13px] sm:text-[13.5px] transition-colors leading-none",
                                      isSelected
                                        ? "font-semibold text-slate-900 dark:text-white"
                                        : "font-medium text-slate-600 dark:text-slate-400 group-hover:text-slate-900"
                                    )}
                                  >
                                    {item.label}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage className="text-[11.5px] font-medium text-rose-500 pt-0.5" />
                    </FormItem>
                  )}
                />

                {/* Horizontal Separation Line */}
                <div className="border-t border-slate-100 dark:border-slate-800/80 my-0.5" />

                {/* 2. Branch Selection: Plain Underline Never Hides, Height h-[38px] Centered */}
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
                          <SelectTrigger className="h-[38px] w-full border-0 border-b border-slate-200/90 dark:border-slate-700/80 !bg-transparent rounded-none px-0 text-[13px] sm:text-[13.5px] font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:outline-none focus-visible:ring-offset-0 ring-0 ring-offset-0 focus:border-[#2864E8] focus:shadow-[0_1px_0_0_#2864E8] shadow-none flex items-center justify-between transition-[border-color,box-shadow] duration-150 [&>span]:truncate [&>span]:leading-none data-[placeholder]:[&>span]:text-slate-400/90 data-[placeholder]:[&>span]:font-normal [&>svg]:text-slate-400 [&>svg]:opacity-75 [&>svg]:transition-transform data-[state=open]:[&>svg]:rotate-180 cursor-pointer">
                            <SelectValue placeholder="Branch / Centre *" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="max-h-[260px] z-[120]">
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
                          className="h-[38px] w-full border-0 border-b border-slate-200/90 dark:border-slate-700/80 !bg-transparent rounded-none px-0 text-[13px] sm:text-[13.5px] font-medium text-slate-900 dark:text-slate-100 placeholder:text-slate-400/90 placeholder:font-normal focus-visible:ring-0 focus-visible:border-[#2864E8] focus-visible:shadow-[0_1px_0_0_#2864E8] shadow-none capitalize flex items-center leading-none transition-[border-color,box-shadow] duration-150"
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
                          className="h-[38px] w-full border-0 border-b border-slate-200/90 dark:border-slate-700/80 !bg-transparent rounded-none px-0 text-[13px] sm:text-[13.5px] font-medium text-slate-900 dark:text-slate-100 placeholder:text-slate-400/90 placeholder:font-normal focus-visible:ring-0 focus-visible:border-[#2864E8] focus-visible:shadow-[0_1px_0_0_#2864E8] shadow-none capitalize flex items-center leading-none transition-[border-color,box-shadow] duration-150"
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
                        <div className="relative flex items-center h-[38px] w-full border-b border-slate-200/90 dark:border-slate-700/80 focus-within:border-[#2864E8] focus-within:shadow-[0_1px_0_0_#2864E8] transition-[border-color,box-shadow] duration-150">
                          <span className="pr-2 text-[13px] sm:text-[13.5px] font-semibold text-slate-500 dark:text-slate-400 select-none shrink-0 leading-none">
                            +91
                          </span>
                          <Input
                            type="tel"
                            maxLength={10}
                            placeholder="Mobile Number (10 digits) *"
                            {...field}
                            className="h-full w-full border-0 !bg-transparent rounded-none pl-1 pr-0 text-[13px] sm:text-[13.5px] font-medium text-slate-900 dark:text-slate-100 placeholder:text-slate-400/90 placeholder:font-normal focus-visible:ring-0 focus-visible:outline-none shadow-none flex items-center leading-none"
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-[11.5px] font-medium text-rose-500 pt-0.5" />
                    </FormItem>
                  )}
                />

                {/* 6. Email: Height h-[38px] Centered, Plain Underline, Watermark Inside */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="space-y-0">
                      <FormLabel className="sr-only">Email Address</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="Email Address (Optional)"
                          {...field}
                          className="h-[38px] w-full border-0 border-b border-slate-200/90 dark:border-slate-700/80 !bg-transparent rounded-none px-0 text-[13px] sm:text-[13.5px] font-medium text-slate-900 dark:text-slate-100 placeholder:text-slate-400/90 placeholder:font-normal focus-visible:ring-0 focus-visible:border-[#2864E8] focus-visible:shadow-[0_1px_0_0_#2864E8] shadow-none flex items-center leading-none transition-[border-color,box-shadow] duration-150"
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
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-[38px] w-full border-0 border-b border-slate-200/90 dark:border-slate-700/80 !bg-transparent rounded-none px-0 text-[13px] sm:text-[13.5px] font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:outline-none focus-visible:ring-offset-0 ring-0 ring-offset-0 focus:border-[#2864E8] focus:shadow-[0_1px_0_0_#2864E8] shadow-none flex items-center justify-between transition-[border-color,box-shadow] duration-150 [&>span]:truncate [&>span]:leading-none data-[placeholder]:[&>span]:text-slate-400/90 data-[placeholder]:[&>span]:font-normal [&>svg]:text-slate-400 [&>svg]:opacity-75 [&>svg]:transition-transform data-[state=open]:[&>svg]:rotate-180 cursor-pointer">
                            <SelectValue placeholder="Class / Grade *" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="max-h-[240px] z-[120]">
                          {classList.map((c) => (
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

                {/* 8. Subjects / Streams (If Senior / JEE / NEET): Clean 2-Column Grid with Checkboxes */}
                {isSeniorClassActive && (
                  <div className="space-y-2 pt-0.5 pb-0.5">
                    <span className="text-[10.5px] sm:text-[11px] font-bold tracking-[0.1em] uppercase text-slate-500 dark:text-slate-400 block select-none">
                      {isJeeNeetActive ? "SELECT TARGET STREAM / SUBJECT(S):" : "SELECT SUBJECT(S):"}
                    </span>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 w-full">
                      {subjectListToUse.map((sub) => {
                        const isSelected = selectedSubjects.includes(sub);
                        return (
                          <button
                            key={sub}
                            type="button"
                            onClick={() => handleToggleSubject(sub)}
                            className="flex items-center gap-2.5 text-left cursor-pointer group py-1 select-none focus:outline-none transition-colors"
                          >
                            <div
                              className={cn(
                                "w-[17px] h-[17px] rounded-[4px] border flex items-center justify-center shrink-0 transition-all duration-150",
                                isSelected
                                  ? "border-[1.5px] border-[#2864E8] bg-[#2864E8] text-white shadow-[0_1px_4px_rgba(40,100,232,0.3)]"
                                  : "border-[1.5px] border-slate-300 dark:border-slate-600 bg-white/40 dark:bg-slate-900 group-hover:border-[#2864E8]"
                              )}
                            >
                              {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                            </div>
                            <span
                              className={cn(
                                "text-[12.5px] sm:text-[13px] transition-colors leading-tight",
                                isSelected
                                  ? "font-semibold text-slate-900 dark:text-white"
                                  : "font-medium text-slate-600 dark:text-slate-400 group-hover:text-slate-900"
                              )}
                            >
                              {sub}
                            </span>
                          </button>
                        );
                      })}
                    </div>
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
                          className="h-[38px] w-full border-0 border-b border-slate-200/90 dark:border-slate-700/80 !bg-transparent rounded-none px-0 text-[13px] sm:text-[13.5px] font-medium text-slate-900 dark:text-slate-100 placeholder:text-slate-400/90 placeholder:font-normal focus-visible:ring-0 focus-visible:border-[#2864E8] focus-visible:shadow-[0_1px_0_0_#2864E8] shadow-none flex items-center leading-none transition-[border-color,box-shadow] duration-150"
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
                  className="group w-full h-[41px] sm:h-[42px] rounded-[6px] font-bold text-[12.5px] sm:text-[13px] tracking-[0.08em] bg-[#2864E8] hover:bg-[#1E4ED8] active:bg-[#1842BE] text-white shadow-[0_2px_10px_rgba(40,100,232,0.28)] hover:shadow-[0_4px_16px_rgba(40,100,232,0.38)] active:shadow-sm active:translate-y-[0.5px] transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 mt-3.5 uppercase"
                >
                  {isSubmitting ? (
                    <span className="inline-flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      SUBMITTING...
                    </span>
                  ) : (
                    <>
                      <span>SUBMIT</span>
                      <ArrowRight className="w-4 h-4 text-white/90 group-hover:translate-x-0.5 transition-transform duration-150" />
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
