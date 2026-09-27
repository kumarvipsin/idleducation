'use client';

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { CheckCircle2, ArrowRight, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { bookFreeSession } from "@/app/actions/forms";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FormModalDialogContent } from "@/components/ui/form-modal-dialog";
import { cn } from "@/lib/utils";

const indianStates = ["Delhi", "Bihar"];

const delhiBranches = [
  "Mukherjee Nagar, Delhi-110009",
  "Mangol Puri, Delhi-110083",
  "Krishan Vihar, Delhi-110086",
  "Budh Vihar, Delhi-110086"
];

const courseOptions = [
  "Class 6th Foundation", "Class 7th Foundation", "Class 8th Foundation",
  "Class 9th (Pre-Board & Olympiad)", "Class 10th (Board & Olympiad Prep)",
  "Class 11th - Medical (NEET-UG)", "Class 11th - Engineering (JEE Main & Adv)",
  "Class 11th - Commerce / Arts", "Class 12th - Medical (NEET-UG)",
  "Class 12th - Engineering (JEE Main & Adv)", "Class 12th - Board Focus",
  "Target Repeater Batch (NEET)", "Target Repeater Batch (JEE)",
  "CUET (UG) Preparation", "CBSE Board Special", "Free Demo / Foundation"
];

const formSchema = z.object({
  mode: z.string().min(1, { message: "Please select a mode of class." }),
  studentName: z.string().min(2, { message: "Name must be at least 2 characters." }),
  guardianName: z.string().min(2, { message: "Parent/Guardian name is required." }),
  classCourse: z.string().min(1, { message: "Please select a class / exam." }),
  mobile: z.string().regex(/^\d{10}$/, { message: "Please enter a valid 10-digit mobile number." }),
  state: z.string().min(1, { message: "Please select your state." }),
  branch: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.state === 'Delhi' && (!data.branch || data.branch.trim() === '')) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Please select a branch in Delhi.",
      path: ['branch'],
    });
  }
});

type FormValues = z.infer<typeof formSchema>;

interface BookDemoModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const toTitleCase = (str: string) => {
  return str.replace(/\b([a-z])/g, (char) => char.toUpperCase());
};

export function BookDemoModal({ isOpen, onOpenChange }: BookDemoModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      mode: '',
      studentName: '',
      guardianName: '',
      classCourse: '',
      mobile: '',
      state: '',
      branch: '',
    },
  });

  const selectedState = form.watch("state");
  const selectedMode = form.watch("mode");

  useEffect(() => {
    if (isOpen) {
      if (typeof document !== 'undefined' && document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
      const timer = setTimeout(() => {
        if (document.activeElement instanceof HTMLElement) {
          document.activeElement.blur();
        }
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsSubmitting(true);
    try {
      const result = await bookFreeSession({
        mode: data.mode,
        studentName: data.studentName,
        guardianName: data.guardianName,
        classCourse: data.classCourse,
        mobile: data.mobile,
        state: data.state,
        branch: data.branch || '',
        nearestBranch: data.branch || data.state,
        email: '',
      });

      if (result.success) {
        setIsSuccessOpen(true);
        form.reset();
      } else {
        toast({
          variant: "destructive",
          title: "Submission Failed",
          description: result.message || "Failed to book session. Please try again.",
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
          maxWidthClass="max-w-[500px] sm:max-w-[530px]"
          className="w-[92vw] sm:w-[94vw]"
        >
          {/* Modal Header */}
          <DialogHeader className="px-6 sm:px-8 pt-6 sm:pt-7 pb-1 text-left shrink-0 pr-14">
            <DialogTitle className="text-left text-[24px] sm:text-[27px] font-bold text-[#0B1F4B] dark:text-white tracking-tight leading-tight">
              Book a Free Demo
            </DialogTitle>
            <DialogDescription className="text-left text-[13.5px] sm:text-[14.5px] font-medium text-slate-600 dark:text-slate-300 mt-1 leading-normal">
              Experience our teaching approach with a free demo.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col flex-1 h-full min-h-0 overflow-y-auto overscroll-contain" autoComplete="off">
              {/* Form Body & CTA Flow */}
              <div className="px-6 sm:px-8 pt-3 sm:pt-4 pb-6 sm:pb-7 space-y-3.5 sm:space-y-4 text-left">
                {/* Mode Selector: Clean Text-Only with Minimal Outline Check */}
                <FormField
                  control={form.control}
                  name="mode"
                  render={({ field }) => (
                    <FormItem className="text-left space-y-1">
                      <FormLabel className="sr-only">Demo Mode</FormLabel>
                      <FormControl>
                        <div className="flex flex-wrap items-center gap-x-5 sm:gap-x-6 gap-y-2 pt-0.5 pb-1">
                          <span className="text-[13px] sm:text-[13.5px] font-medium text-slate-500 dark:text-slate-400 shrink-0">
                            Mode of Class:
                          </span>
                          <div className="flex items-center gap-5 sm:gap-6">
                            {/* Offline Mode Option */}
                            <button
                              type="button"
                              onClick={() => field.onChange('Offline')}
                              className="group inline-flex items-center gap-2 cursor-pointer select-none bg-transparent border-0 p-0 focus:outline-none"
                            >
                              <div
                                className={cn(
                                  "w-[18px] h-[18px] rounded-full flex items-center justify-center transition-all duration-200",
                                  field.value === 'Offline'
                                    ? "border-[1.5px] border-[#0B1F4B] dark:border-blue-400 bg-[#0B1F4B]/5 dark:bg-blue-400/10"
                                    : "border border-slate-300 dark:border-slate-600 bg-transparent group-hover:border-[#0B1F4B]/60"
                                )}
                              >
                                {field.value === 'Offline' && (
                                  <Check className="w-2.5 h-2.5 text-[#0B1F4B] dark:text-blue-400 stroke-[3]" />
                                )}
                              </div>
                              <span
                                className={cn(
                                  "text-[13.5px] sm:text-[14px] transition-colors select-none",
                                  field.value === 'Offline'
                                    ? "font-semibold text-[#0B1F4B] dark:text-white"
                                    : "font-medium text-slate-600 dark:text-slate-400 group-hover:text-[#0B1F4B]"
                                )}
                              >
                                Offline
                              </span>
                            </button>

                            {/* Online Mode Option - Disabled */}
                            <div
                              className="inline-flex items-center gap-2 opacity-45 cursor-not-allowed select-none"
                              title="Online demo mode coming soon"
                            >
                              <div className="w-[18px] h-[18px] rounded-full border border-slate-300 dark:border-slate-700 bg-transparent flex items-center justify-center" />
                              <span className="text-[13.5px] sm:text-[14px] font-medium text-slate-500 dark:text-slate-400">
                                Online
                              </span>
                            </div>
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage className="text-[11.5px] font-medium text-rose-500 pt-0.5" />
                    </FormItem>
                  )}
                />

                {/* Row 1: Student Name & Parent / Guardian */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                  <FormField
                    control={form.control}
                    name="studentName"
                    render={({ field }) => (
                      <FormItem className="text-left">
                        <FormLabel className="sr-only">Student Full Name</FormLabel>
                        <FormControl>
                          <div className="relative flex items-center rounded-xl border border-[#DCE7F6] dark:border-slate-800 bg-[#F8FAFD] dark:bg-slate-900/60 shadow-[0_1px_2px_rgba(0,0,0,0.02)] focus-within:border-[#0B1F4B] focus-within:ring-2 focus-within:ring-[#0B1F4B]/10 transition-all">
                            <Input
                              placeholder="Student Full Name *"
                              {...field}
                              autoFocus={false}
                              value={field.value}
                              onChange={(e) => field.onChange(toTitleCase(e.target.value))}
                              className="h-11 sm:h-12 border-0 bg-transparent text-[14px] sm:text-[14.5px] font-medium text-[#0B1F4B] dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400 focus-visible:ring-0 focus-visible:ring-offset-0 focus:ring-0 focus:outline-none outline-none px-3.5 sm:px-4 capitalize"
                            />
                          </div>
                        </FormControl>
                        <FormMessage className="text-[11.5px] font-medium text-rose-500 pt-1" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="guardianName"
                    render={({ field }) => (
                      <FormItem className="text-left">
                        <FormLabel className="sr-only">Parent / Guardian</FormLabel>
                        <FormControl>
                          <div className="relative flex items-center rounded-xl border border-[#DCE7F6] dark:border-slate-800 bg-[#F8FAFD] dark:bg-slate-900/60 shadow-[0_1px_2px_rgba(0,0,0,0.02)] focus-within:border-[#0B1F4B] focus-within:ring-2 focus-within:ring-[#0B1F4B]/10 transition-all">
                            <Input
                              placeholder="Parent / Guardian *"
                              {...field}
                              autoFocus={false}
                              value={field.value}
                              onChange={(e) => field.onChange(toTitleCase(e.target.value))}
                              className="h-11 sm:h-12 border-0 bg-transparent text-[14px] sm:text-[14.5px] font-medium text-[#0B1F4B] dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400 focus-visible:ring-0 focus-visible:ring-offset-0 focus:ring-0 focus:outline-none outline-none px-3.5 sm:px-4 capitalize"
                            />
                          </div>
                        </FormControl>
                        <FormMessage className="text-[11.5px] font-medium text-rose-500 pt-1" />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Row 2: Class / Exam & Mobile Number */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                  <FormField
                    control={form.control}
                    name="classCourse"
                    render={({ field }) => (
                      <FormItem className="text-left">
                        <FormLabel className="sr-only">Class / Exam</FormLabel>
                        <FormControl>
                          <div className="relative flex items-center rounded-xl border border-[#DCE7F6] dark:border-slate-800 bg-[#F8FAFD] dark:bg-slate-900/60 shadow-[0_1px_2px_rgba(0,0,0,0.02)] focus-within:border-[#0B1F4B] focus-within:ring-2 focus-within:ring-[#0B1F4B]/10 transition-all overflow-hidden">
                            <Select onValueChange={field.onChange} value={field.value}>
                              <SelectTrigger 
                                style={{ outline: 'none', boxShadow: 'none' }}
                                className="h-11 sm:h-12 border-0 bg-transparent rounded-xl text-[14px] sm:text-[14.5px] font-medium text-[#0B1F4B] dark:text-slate-100 !ring-0 !ring-offset-0 focus:!ring-0 focus:!ring-offset-0 focus-visible:!ring-0 focus-visible:!ring-offset-0 !outline-none focus:!outline-none focus-visible:!outline-none shadow-none px-3.5 sm:px-4 w-full cursor-pointer data-[placeholder]:text-slate-500 dark:data-[placeholder]:text-slate-400 [&>span[data-placeholder]]:text-slate-500 dark:[&>span[data-placeholder]]:text-slate-400"
                              >
                                <SelectValue placeholder="Class / Exam *" />
                              </SelectTrigger>
                              <SelectContent className="max-h-56">
                                {courseOptions.map((c) => (
                                  <SelectItem key={c} value={c} className="text-[13.5px] sm:text-[14px] font-medium text-[#0B1F4B] dark:text-slate-100">
                                    {c}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </FormControl>
                        <FormMessage className="text-[11.5px] font-medium text-rose-500 pt-1" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="mobile"
                    render={({ field }) => (
                      <FormItem className="text-left">
                        <FormLabel className="sr-only">Mobile Number</FormLabel>
                        <FormControl>
                          <div className="relative flex items-center rounded-xl border border-[#DCE7F6] dark:border-slate-800 bg-[#F8FAFD] dark:bg-slate-900/60 shadow-[0_1px_2px_rgba(0,0,0,0.02)] focus-within:border-[#0B1F4B] focus-within:ring-2 focus-within:ring-[#0B1F4B]/10 transition-all">
                            <Input
                              type="tel"
                              maxLength={10}
                              placeholder="Mobile Number *"
                              {...field}
                              autoFocus={false}
                              className="h-11 sm:h-12 border-0 bg-transparent text-[14px] sm:text-[14.5px] font-medium text-[#0B1F4B] dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400 focus-visible:ring-0 focus-visible:ring-offset-0 focus:ring-0 focus:outline-none outline-none px-3.5 sm:px-4"
                              onChange={(e) => field.onChange(e.target.value.replace(/\D/g, ''))}
                            />
                          </div>
                        </FormControl>
                        <FormMessage className="text-[11.5px] font-medium text-rose-500 pt-1" />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Row 3: State & Branch */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                  <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem className="text-left">
                        <FormLabel className="sr-only">State</FormLabel>
                        <FormControl>
                          <div className="relative flex items-center rounded-xl border border-[#DCE7F6] dark:border-slate-800 bg-[#F8FAFD] dark:bg-slate-900/60 shadow-[0_1px_2px_rgba(0,0,0,0.02)] focus-within:border-[#0B1F4B] focus-within:ring-2 focus-within:ring-[#0B1F4B]/10 transition-all overflow-hidden">
                            <Select
                              onValueChange={(val) => {
                                field.onChange(val);
                                if (val !== 'Delhi') {
                                  form.setValue('branch', '');
                                  form.clearErrors('branch');
                                }
                              }}
                              value={field.value}
                            >
                              <SelectTrigger 
                                style={{ outline: 'none', boxShadow: 'none' }}
                                className="h-11 sm:h-12 border-0 bg-transparent rounded-xl text-[14px] sm:text-[14.5px] font-medium text-[#0B1F4B] dark:text-slate-100 !ring-0 !ring-offset-0 focus:!ring-0 focus:!ring-offset-0 focus-visible:!ring-0 focus-visible:!ring-offset-0 !outline-none focus:!outline-none focus-visible:!outline-none shadow-none px-3.5 sm:px-4 w-full cursor-pointer data-[placeholder]:text-slate-500 dark:data-[placeholder]:text-slate-400 [&>span[data-placeholder]]:text-slate-500 dark:[&>span[data-placeholder]]:text-slate-400"
                              >
                                <SelectValue placeholder="State *" />
                              </SelectTrigger>
                              <SelectContent className="max-h-56">
                                {indianStates.map((s) => (
                                  <SelectItem key={s} value={s} className="text-[13.5px] sm:text-[14px] font-medium text-[#0B1F4B] dark:text-slate-100">
                                    {s}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </FormControl>
                        <FormMessage className="text-[11.5px] font-medium text-rose-500 pt-1" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="branch"
                    render={({ field }) => {
                      const isDelhi = selectedState === 'Delhi';
                      return (
                        <FormItem className="text-left">
                          <FormLabel className="sr-only">Branch</FormLabel>
                          <FormControl>
                            <div className={cn(
                              "relative flex items-center rounded-xl border border-[#DCE7F6] dark:border-slate-800 shadow-[0_1px_2px_rgba(0,0,0,0.02)] transition-all overflow-hidden",
                              isDelhi
                                ? "bg-[#F8FAFD] dark:bg-slate-900/60 focus-within:border-[#0B1F4B] focus-within:ring-2 focus-within:ring-[#0B1F4B]/10"
                                : "bg-slate-100/80 dark:bg-slate-800/40 cursor-not-allowed opacity-60"
                            )}>
                              <Select
                                disabled={!isDelhi}
                                onValueChange={field.onChange}
                                value={field.value}
                              >
                                <SelectTrigger 
                                  style={{ outline: 'none', boxShadow: 'none' }}
                                  className={cn(
                                    "h-11 sm:h-12 border-0 bg-transparent rounded-xl text-[14px] sm:text-[14.5px] font-medium !ring-0 !ring-offset-0 focus:!ring-0 focus:!ring-offset-0 focus-visible:!ring-0 focus-visible:!ring-offset-0 !outline-none focus:!outline-none focus-visible:!outline-none shadow-none px-3.5 sm:px-4 w-full data-[placeholder]:text-slate-500 dark:data-[placeholder]:text-slate-400 [&>span[data-placeholder]]:text-slate-500 dark:[&>span[data-placeholder]]:text-slate-400",
                                    isDelhi ? "text-[#0B1F4B] dark:text-slate-100 cursor-pointer" : "text-slate-400 dark:text-slate-500 cursor-not-allowed"
                                  )}
                                >
                                  <SelectValue placeholder={
                                    isDelhi
                                      ? "Branch *"
                                      : selectedState === 'Bihar'
                                        ? "Branch (Delhi only)"
                                        : "Select State first"
                                  } />
                                </SelectTrigger>
                                <SelectContent className="max-h-56">
                                  {delhiBranches.map((b) => (
                                    <SelectItem key={b} value={b} className="text-[13.5px] sm:text-[14px] font-medium text-[#0B1F4B] dark:text-slate-100">
                                      {b}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </FormControl>
                          <FormMessage className="text-[11.5px] font-medium text-rose-500 pt-1" />
                        </FormItem>
                      );
                    }}
                  />
                </div>

                {/* CTA Button */}
                <div className="pt-1.5 sm:pt-2">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-11 sm:h-12 rounded-xl text-[15px] sm:text-[15.5px] font-bold bg-[#0B1F4B] hover:bg-[#155EEF] text-white shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2.5 cursor-pointer active:scale-[0.99] disabled:opacity-70 group outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0B1F4B]/30"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Submitting Request...</span>
                      </>
                    ) : (
                      <>
                        <span>Request a Demo</span>
                        <ArrowRight className="w-4.5 h-4.5 stroke-[2.2] transition-transform group-hover:translate-x-1" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </FormModalDialogContent>
      </Dialog>

      {/* Success Dialog */}
      <Dialog open={isSuccessOpen} onOpenChange={setIsSuccessOpen}>
        <DialogContent className="rounded-2xl max-w-sm border border-slate-200 dark:border-slate-800 p-6 bg-white dark:bg-slate-900 text-center shadow-2xl">
          <DialogHeader className="space-y-2">
            <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <DialogTitle className="text-xl font-bold text-[#102A68] dark:text-white">Free Session Booked!</DialogTitle>
            <DialogDescription className="text-[13px] sm:text-[14px] font-normal text-slate-500 dark:text-slate-400 leading-relaxed">
              Your free demo session has been scheduled. Our academic counselor will call you shortly with details.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button
              onClick={() => {
                setIsSuccessOpen(false);
                onOpenChange(false);
              }}
              className="w-full h-10 sm:h-11 rounded-[10px] font-semibold text-[13px] sm:text-[14px] bg-[#102A68] hover:bg-[#0C1E4A] text-white cursor-pointer shadow-xs"
            >
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
