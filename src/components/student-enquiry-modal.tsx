'use client';

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { submitStudentEnquiry } from "@/app/actions/forms";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FormModalDialogContent } from "@/components/ui/form-modal-dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const indianStates = [
  "Delhi",
  "Bihar"
];

const courseOptions = [
  "Class 6th Foundation", "Class 7th Foundation", "Class 8th Foundation",
  "Class 9th (Pre-Board & Olympiad)", "Class 10th (Board & Olympiad Prep)",
  "Class 11th - Medical (NEET-UG)", "Class 11th - Engineering (JEE Main & Adv)",
  "Class 11th - Commerce / Arts", "Class 12th - Medical (NEET-UG)",
  "Class 12th - Engineering (JEE Main & Adv)", "Class 12th - Board Focus",
  "Target Repeater Batch (NEET)", "Target Repeater Batch (JEE)",
  "CUET (UG) Preparation", "CBSE Board Special", "Other Program Enquiry"
];

const enquirySchema = z.object({
  studentName: z.string().min(2, { message: "Student Name must be at least 2 characters." }),
  guardianName: z.string().min(2, { message: "Guardian Name must be at least 2 characters." }),
  classCourse: z.string().min(1, { message: "Please select target class or course." }),
  mobile: z.string().regex(/^\d{10}$/, { message: "Please enter a valid 10-digit mobile number." }),
  state: z.string().min(1, { message: "Please select a state." }),
  message: z.string().optional(),
});

type EnquiryFormValues = z.infer<typeof enquirySchema>;

interface StudentEnquiryModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const toTitleCase = (str: string) => {
  return str.replace(/\b([a-z])/g, (char) => char.toUpperCase());
};

const toSentenceCase = (str: string) => {
  return str.replace(/(^\s*|[.!?]\s+)([a-z])/g, (_, p1, p2) => p1 + p2.toUpperCase());
};

export function StudentEnquiryModal({ isOpen, onOpenChange }: StudentEnquiryModalProps) {
  const { toast } = useToast();
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<EnquiryFormValues>({
    resolver: zodResolver(enquirySchema),
    defaultValues: {
      studentName: '',
      guardianName: '',
      classCourse: '',
      mobile: '',
      state: '',
      message: '',
    },
  });

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

  const onSubmit: SubmitHandler<EnquiryFormValues> = async (data) => {
    setIsSubmitting(true);
    try {
      const result = await submitStudentEnquiry(data);
      if (result.success) {
        setIsSuccessOpen(true);
        form.reset();
      } else {
        toast({
          variant: "destructive",
          title: "Submission Error",
          description: result.message || "Could not submit enquiry.",
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
              Student Enquiry
            </DialogTitle>
            <DialogDescription className="text-left text-[13.5px] sm:text-[14.5px] font-medium text-slate-600 dark:text-slate-300 mt-1 leading-normal">
              Have questions? We’re here to help.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col flex-1 h-full min-h-0 overflow-y-auto overscroll-contain" autoComplete="off">
              {/* Form Body & CTA Flow */}
              <div className="px-6 sm:px-8 pt-3 sm:pt-4 pb-6 sm:pb-7 space-y-3.5 sm:space-y-4 text-left">
                {/* Row 1: Student Name & Guardian Name */}
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

                {/* Row 2: Target Course & State */}
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
                    name="state"
                    render={({ field }) => (
                      <FormItem className="text-left">
                        <FormLabel className="sr-only">State / Location</FormLabel>
                        <FormControl>
                          <div className="relative flex items-center rounded-xl border border-[#DCE7F6] dark:border-slate-800 bg-[#F8FAFD] dark:bg-slate-900/60 shadow-[0_1px_2px_rgba(0,0,0,0.02)] focus-within:border-[#0B1F4B] focus-within:ring-2 focus-within:ring-[#0B1F4B]/10 transition-all overflow-hidden">
                            <Select onValueChange={field.onChange} value={field.value}>
                              <SelectTrigger 
                                style={{ outline: 'none', boxShadow: 'none' }}
                                className="h-11 sm:h-12 border-0 bg-transparent rounded-xl text-[14px] sm:text-[14.5px] font-medium text-[#0B1F4B] dark:text-slate-100 !ring-0 !ring-offset-0 focus:!ring-0 focus:!ring-offset-0 focus-visible:!ring-0 focus-visible:!ring-offset-0 !outline-none focus:!outline-none focus-visible:!outline-none shadow-none px-3.5 sm:px-4 w-full cursor-pointer data-[placeholder]:text-slate-500 dark:data-[placeholder]:text-slate-400 [&>span[data-placeholder]]:text-slate-500 dark:[&>span[data-placeholder]]:text-slate-400"
                              >
                                <SelectValue placeholder="State / Location *" />
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
                </div>

                {/* Row 3: Mobile Number */}
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
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-[11.5px] font-medium text-rose-500 pt-1" />
                    </FormItem>
                  )}
                />

                {/* Row 4: Message / Questions */}
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem className="text-left">
                      <FormLabel className="sr-only">Questions / Specific Enquiry</FormLabel>
                      <FormControl>
                        <div className="relative rounded-xl border border-[#DCE7F6] dark:border-slate-800 bg-[#F8FAFD] dark:bg-slate-900/60 shadow-[0_1px_2px_rgba(0,0,0,0.02)] focus-within:border-[#0B1F4B] focus-within:ring-2 focus-within:ring-[#0B1F4B]/10 transition-all">
                          <Textarea
                            placeholder="Questions / Specific Enquiry"
                            className="min-h-[85px] sm:min-h-[90px] max-h-[130px] border-0 bg-transparent text-[14px] sm:text-[14.5px] font-medium text-[#0B1F4B] dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400 focus-visible:ring-0 focus-visible:ring-offset-0 focus:ring-0 focus:outline-none outline-none px-3.5 sm:px-4 pt-3 pb-3 resize-none leading-relaxed"
                            {...field}
                            autoFocus={false}
                            value={field.value || ''}
                            onChange={(e) => field.onChange(toSentenceCase(e.target.value))}
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-[11.5px] font-medium text-rose-500 pt-1" />
                    </FormItem>
                  )}
                />

                {/* Row 5: Submit Student Enquiry Button */}
                <div className="pt-1.5 sm:pt-2">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-11 sm:h-12 rounded-xl text-[15px] sm:text-[15.5px] font-bold bg-[#0B1F4B] hover:bg-[#155EEF] text-white shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2.5 cursor-pointer active:scale-[0.99] disabled:opacity-70 group outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0B1F4B]/30"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Sending Enquiry...</span>
                      </>
                    ) : (
                      <>
                        <span>Send Enquiry</span>
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
            <DialogTitle className="text-xl font-bold text-[#102A68] dark:text-white">Enquiry Submitted!</DialogTitle>
            <DialogDescription className="text-[13px] sm:text-[14px] font-normal text-slate-500 dark:text-slate-400 leading-relaxed">
              We have received your enquiry. An IDL academic counsellor will contact you shortly to address all your questions.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button
              onClick={() => {
                setIsSuccessOpen(false);
                onOpenChange(false);
              }}
              className="w-full h-10 sm:h-11 rounded-[8px] font-semibold text-[13px] sm:text-[14px] bg-[#102A68] hover:bg-[#0C1E4A] text-white cursor-pointer shadow-sm"
            >
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
