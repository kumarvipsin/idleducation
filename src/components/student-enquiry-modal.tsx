'use client';

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { submitStudentEnquiry } from "@/app/actions/forms";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FormModalDialogContent } from "@/components/ui/form-modal-dialog";
import { cn } from "@/lib/utils";

const indianStates = ["Delhi"];

const delhiBranches = [
  "Mukherjee Nagar, Delhi-110009",
  "Mangol Puri, Delhi-110083",
  "Krishan Vihar, Delhi-110086",
  "Budh Vihar, Delhi-110086"
];

const classOptions = [
  "Class 4",
  "Class 5",
  "Class 6",
  "Class 7",
  "Class 8",
  "Class 9",
  "Class 10",
  "Class 11",
  "Class 12",
  "Class 12 PASS"
];

const enquirySchema = z.object({
  studentName: z.string().min(2, { message: "Name must be at least 2 characters." }),
  guardianName: z.string().min(2, { message: "Parent/Guardian name is required." }),
  mobile: z.string().regex(/^\d{10}$/, { message: "Please enter a valid 10-digit mobile number." }),
  branch: z.string().min(1, { message: "Please select a branch / centre." }),
  state: z.string().min(1, { message: "Please select your state." }),
  classCourse: z.string().min(1, { message: "Please select a class." }),
  message: z.string().min(2, { message: "Please specify which stream or subject you are enquiring for." }),
});

type EnquiryFormValues = z.infer<typeof enquirySchema>;

interface StudentEnquiryModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  defaultBranch?: string;
}

const toTitleCase = (str: string) => {
  return str.replace(/\b([a-z])/g, (char) => char.toUpperCase());
};

const toSentenceCase = (str: string) => {
  return str.replace(/(^\s*|[.!?]\s+)([a-z])/g, (_, p1, p2) => p1 + p2.toUpperCase());
};

export function StudentEnquiryModal({ isOpen, onOpenChange, defaultBranch }: StudentEnquiryModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [submittedData, setSubmittedData] = useState<EnquiryFormValues | null>(null);
  const { toast } = useToast();

  const form = useForm<EnquiryFormValues>({
    resolver: zodResolver(enquirySchema),
    defaultValues: {
      studentName: '',
      guardianName: '',
      mobile: '',
      branch: '',
      state: 'Delhi',
      classCourse: '',
      message: '',
    },
  });

  // Pre-fill branch if provided
  useEffect(() => {
    if (isOpen) {
      if (typeof document !== 'undefined' && document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
      if (defaultBranch) {
        const match = delhiBranches.find(b => 
          b.toLowerCase().includes(defaultBranch.toLowerCase()) || 
          defaultBranch.toLowerCase().includes(b.split(',')[0].toLowerCase())
        );
        if (match) {
          form.setValue('branch', match);
        }
      }
    }
  }, [isOpen, defaultBranch, form]);

  const onSubmit: SubmitHandler<EnquiryFormValues> = async (data) => {
    setIsSubmitting(true);
    try {
      const result = await submitStudentEnquiry({
        studentName: data.studentName,
        guardianName: data.guardianName,
        classCourse: data.classCourse,
        mobile: data.mobile,
        state: data.state || 'Delhi',
        branch: data.branch || '',
        message: data.message || '',
      });

      if (result.success) {
        setSubmittedData(data);
        setIsSuccessOpen(true);
        form.reset({
          studentName: '',
          guardianName: '',
          mobile: '',
          branch: '',
          state: 'Delhi',
          classCourse: '',
          message: '',
        });
      } else {
        toast({
          variant: "destructive",
          title: "Submission Failed",
          description: result.message || "Failed to submit enquiry. Please try again.",
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
          maxWidthClass="max-w-[480px] sm:max-w-[560px] md:max-w-[580px]"
          className="w-[94vw] sm:w-[92vw] p-0 shadow-[0_24px_60px_-12px_rgba(15,23,42,0.18),0_2px_8px_rgba(15,23,42,0.06)] rounded-[20px] sm:rounded-[24px] border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-950 !outline-none focus:!outline-none focus:!ring-0 focus-visible:!outline-none focus-visible:!ring-0 ring-0 max-h-[calc(100dvh-2rem)] sm:max-h-[calc(100dvh-3.5rem)] flex flex-col"
        >
          {/* Top Heading: Left-aligned, All Capital Letters, Small Font */}
          <div className="flex items-center justify-between px-4 sm:px-7 py-3 sm:py-3.5 border-b border-slate-100 dark:border-slate-800/80 pr-12 sm:pr-14 bg-white dark:bg-slate-950 shrink-0">
            <div className="flex items-center select-none text-left">
              <span className="text-[11px] sm:text-[12px] font-bold tracking-[0.08em] uppercase text-slate-700 dark:text-slate-200">
                STUDENT ENQUIRY
              </span>
            </div>
          </div>

          <DialogHeader className="sr-only">
            <DialogTitle>Student Enquiry</DialogTitle>
            <DialogDescription>Submit your queries and our academic counsellors will get back to you</DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col flex-1 min-h-0 overflow-y-auto overscroll-contain" autoComplete="off">
              {/* Form Body - Clean Underlines, Consistent Vertical Spacing matching Admission Form */}
              <div className="px-4 sm:px-7 pt-3.5 sm:pt-4 pb-4 sm:pb-5 space-y-3.5 sm:space-y-4 text-left">

                {/* Row 1: Student Full Name & Father / Guardian Name in 2-column grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
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
                            value={field.value}
                            onChange={(e) => field.onChange(toTitleCase(e.target.value))}
                            className="h-[38px] sm:h-[40px] w-full border-0 border-b border-slate-200/90 dark:border-slate-700/80 !bg-transparent rounded-none px-0 text-[13px] sm:text-[13.5px] font-medium text-slate-900 dark:text-slate-100 placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:ring-0 focus:ring-offset-0 focus:border-[#2864E8] focus:shadow-[0_1px_0_0_#2864E8] focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-[#2864E8] focus-visible:shadow-[0_1px_0_0_#2864E8] shadow-none capitalize flex items-center leading-none transition-[border-color,box-shadow] duration-150"
                          />
                        </FormControl>
                        <FormMessage className="text-[11.5px] font-medium text-rose-500 pt-0.5" />
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
                            value={field.value}
                            onChange={(e) => field.onChange(toTitleCase(e.target.value))}
                            className="h-[38px] sm:h-[40px] w-full border-0 border-b border-slate-200/90 dark:border-slate-700/80 !bg-transparent rounded-none px-0 text-[13px] sm:text-[13.5px] font-medium text-slate-900 dark:text-slate-100 placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:ring-0 focus:ring-offset-0 focus:border-[#2864E8] focus:shadow-[0_1px_0_0_#2864E8] focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-[#2864E8] focus-visible:shadow-[0_1px_0_0_#2864E8] shadow-none capitalize flex items-center leading-none transition-[border-color,box-shadow] duration-150"
                          />
                        </FormControl>
                        <FormMessage className="text-[11.5px] font-medium text-rose-500 pt-0.5" />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Row 2: Mobile Number & Preferred Branch in 2-column grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                  <FormField
                    control={form.control}
                    name="mobile"
                    render={({ field }) => (
                      <FormItem className="space-y-0 text-left">
                        <FormLabel className="sr-only">Mobile Number</FormLabel>
                        <FormControl>
                          <div className="relative h-[38px] sm:h-[40px] w-full flex items-center">
                            <span className="absolute left-0 top-1/2 -translate-y-1/2 text-[13px] sm:text-[13.5px] font-semibold text-slate-500 dark:text-slate-400 select-none pointer-events-none">
                              +91
                            </span>
                            <Input
                              type="tel"
                              maxLength={10}
                              placeholder="Mobile Number (10 digits) *"
                              {...field}
                              className="h-[38px] sm:h-[40px] w-full border-0 border-b border-slate-200/90 dark:border-slate-700/80 !bg-transparent rounded-none pl-[30px] sm:pl-[32px] pr-0 text-[13px] sm:text-[13.5px] font-medium text-slate-900 dark:text-slate-100 placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:ring-0 focus:ring-offset-0 focus:border-[#2864E8] focus:shadow-[0_1px_0_0_#2864E8] focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-[#2864E8] focus-visible:shadow-[0_1px_0_0_#2864E8] shadow-none flex items-center leading-none transition-[border-color,box-shadow] duration-150"
                              onChange={(e) => field.onChange(e.target.value.replace(/\D/g, ''))}
                            />
                          </div>
                        </FormControl>
                        <FormMessage className="text-[11.5px] font-medium text-rose-500 pt-0.5" />
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
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="h-[38px] sm:h-[40px] w-full border-0 border-b border-slate-200/90 dark:border-slate-700/80 !bg-transparent rounded-none px-0 text-[13px] sm:text-[13.5px] font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:outline-none focus-visible:ring-offset-0 ring-0 ring-offset-0 focus:border-[#2864E8] focus:shadow-[0_1px_0_0_#2864E8] data-[state=open]:border-[#2864E8] data-[state=open]:shadow-[0_1px_0_0_#2864E8] shadow-none flex items-center justify-between transition-[border-color,box-shadow] duration-150 [&>span]:truncate [&>span]:leading-none data-[placeholder]:[&>span]:text-slate-400 data-[placeholder]:[&>span]:font-normal [&>svg]:text-slate-400 [&>svg]:opacity-75 [&>svg]:w-3.5 [&>svg]:h-3.5 [&>svg]:shrink-0 [&>svg]:transition-transform data-[state=open]:[&>svg]:rotate-180 cursor-pointer">
                              <SelectValue placeholder="Preferred Branch *" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="max-h-[220px] z-[200]">
                            {delhiBranches.map((b) => (
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
                </div>

                {/* Row 3: State & Class / Course in 2-column grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                  <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem className="space-y-0 text-left">
                        <FormLabel className="sr-only">State</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="h-[38px] sm:h-[40px] w-full border-0 border-b border-slate-200/90 dark:border-slate-700/80 !bg-transparent rounded-none px-0 text-[13px] sm:text-[13.5px] font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:outline-none focus-visible:ring-offset-0 ring-0 ring-offset-0 focus:border-[#2864E8] focus:shadow-[0_1px_0_0_#2864E8] data-[state=open]:border-[#2864E8] data-[state=open]:shadow-[0_1px_0_0_#2864E8] shadow-none flex items-center justify-between transition-[border-color,box-shadow] duration-150 [&>span]:truncate [&>span]:leading-none data-[placeholder]:[&>span]:text-slate-400 data-[placeholder]:[&>span]:font-normal [&>svg]:text-slate-400 [&>svg]:opacity-75 [&>svg]:w-3.5 [&>svg]:h-3.5 [&>svg]:shrink-0 [&>svg]:transition-transform data-[state=open]:[&>svg]:rotate-180 cursor-pointer">
                              <SelectValue placeholder="State *" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="max-h-[220px] z-[200]">
                            {indianStates.map((s) => (
                              <SelectItem key={s} value={s} className="text-[13px] py-1.5 cursor-pointer font-medium">
                                {s}
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
                    name="classCourse"
                    render={({ field }) => (
                      <FormItem className="space-y-0 text-left">
                        <FormLabel className="sr-only">Class / Course</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-[38px] sm:h-[40px] w-full border-0 border-b border-slate-200/90 dark:border-slate-700/80 !bg-transparent rounded-none px-0 text-[13px] sm:text-[13.5px] font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:outline-none focus-visible:ring-offset-0 ring-0 ring-offset-0 focus:border-[#2864E8] focus:shadow-[0_1px_0_0_#2864E8] data-[state=open]:border-[#2864E8] data-[state=open]:shadow-[0_1px_0_0_#2864E8] shadow-none flex items-center justify-between transition-[border-color,box-shadow] duration-150 [&>span]:truncate [&>span]:leading-none data-[placeholder]:[&>span]:text-slate-400 data-[placeholder]:[&>span]:font-normal [&>svg]:text-slate-400 [&>svg]:opacity-75 [&>svg]:w-3.5 [&>svg]:h-3.5 [&>svg]:shrink-0 [&>svg]:transition-transform data-[state=open]:[&>svg]:rotate-180 cursor-pointer">
                              <SelectValue placeholder="Class / Course *" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="max-h-[240px] z-[200]">
                            {classOptions.map((c) => (
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

                {/* Row 4: Which Stream or Subject are you enquiring for? (Full-width) */}
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem className="space-y-0 text-left">
                      <FormLabel className="sr-only">Which Stream or Subject are you enquiring for? *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Which Stream or Subject are you enquiring for? *"
                          {...field}
                          value={field.value || ''}
                          onChange={(e) => field.onChange(toSentenceCase(e.target.value))}
                          className="h-[38px] sm:h-[40px] w-full border-0 border-b border-slate-200/90 dark:border-slate-700/80 !bg-transparent rounded-none px-0 text-[13px] sm:text-[13.5px] font-medium text-slate-900 dark:text-slate-100 placeholder:text-slate-400 placeholder:font-normal placeholder:truncate focus:outline-none focus:ring-0 focus:ring-offset-0 focus:border-[#2864E8] focus:shadow-[0_1px_0_0_#2864E8] focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-[#2864E8] focus-visible:shadow-[0_1px_0_0_#2864E8] shadow-none flex items-center leading-none transition-[border-color,box-shadow] duration-150"
                        />
                      </FormControl>
                      <FormMessage className="text-[11.5px] font-medium text-rose-500 pt-0.5" />
                    </FormItem>
                  )}
                />

                {/* CTA Submit Button matching Admission Form button styling */}
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="group w-full h-[40px] sm:h-[42px] rounded-[6px] font-bold text-[12px] sm:text-[12.5px] tracking-[0.08em] bg-[#2864E8] hover:bg-[#1E4ED8] active:bg-[#1842BE] text-white shadow-[0_2px_10px_rgba(40,100,232,0.28)] hover:shadow-[0_4px_16px_rgba(40,100,232,0.38)] active:shadow-sm active:translate-y-[0.5px] transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 mt-3.5 sm:mt-4 uppercase shrink-0"
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
            Enquiry Received!
          </DialogTitle>
          <DialogDescription className="text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
            Thank you, <span className="font-semibold text-slate-900 dark:text-white">{submittedData?.studentName}</span>. Your enquiry for <span className="font-semibold text-slate-900 dark:text-white">{submittedData?.branch || 'Delhi'}</span> has been submitted. Our academic counsellor will get in touch with you shortly.
          </DialogDescription>
          <div className="mt-4 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 text-left space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
            <div className="flex justify-between">
              <span className="text-slate-400 font-medium">Student:</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{submittedData?.studentName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400 font-medium">Class:</span>
              <span className="font-bold text-blue-600">{submittedData?.classCourse}</span>
            </div>
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
