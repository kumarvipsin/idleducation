'use client';

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { User, Users, MessageSquare, CheckCircle2, GraduationCap, Phone, MapPin, ShieldCheck, ArrowRight } from "lucide-react";
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
  "Andaman and Nicobar Islands", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar",
  "Chandigarh", "Chhattisgarh", "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Goa",
  "Gujarat", "Haryana", "Himachal Pradesh", "Jammu and Kashmir", "Jharkhand", "Karnataka",
  "Kerala", "Ladakh", "Lakshadweep", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya",
  "Mizoram", "Nagaland", "Odisha", "Puducherry", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
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
        >
          {/* Modal Header: Exact Admission Form visual standard */}
          <DialogHeader className="px-5 sm:px-7 pt-5 pb-3 text-left shrink-0 border-b border-slate-100 dark:border-slate-800/80">
            <DialogTitle className="text-left text-xl sm:text-2xl font-bold text-[#102A68] dark:text-white tracking-tight leading-snug">
              Student Enquiry
            </DialogTitle>
            <DialogDescription className="text-left text-[13px] sm:text-[14px] font-normal text-slate-500 dark:text-slate-400 mt-0.5 leading-normal">
              Have questions regarding admissions, batches or fees? Connect directly with our counsellors.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col flex-1 h-full min-h-0 overflow-hidden" autoComplete="off">
              <div className="px-5 sm:px-7 py-4 sm:py-5 space-y-3.5 sm:space-y-4 text-left overflow-y-auto flex-1 min-h-0 overscroll-contain">
                {/* Row 1: Student Name & Guardian Name */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                  <FormField
                    control={form.control}
                    name="studentName"
                    render={({ field }) => (
                      <FormItem className="space-y-1.5">
                        <FormLabel className="text-[13px] sm:text-[14px] font-semibold text-[#18233A] dark:text-slate-200 flex items-center gap-1.5">
                          <User className="h-3.5 w-3.5 text-[#102A68] dark:text-blue-400" />
                          Student Full Name <span className="text-[#E11D48]">*</span>
                        </FormLabel>
                        <FormControl>
                          <div className="relative rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs focus-within:border-[#1F4FA3] focus-within:ring-2 focus-within:ring-[#1F4FA3]/15 transition-all">
                            <Input
                              placeholder="e.g. Rahul Sharma"
                              {...field}
                              autoFocus={false}
                              value={field.value}
                              onChange={(e) => field.onChange(toTitleCase(e.target.value))}
                              className="h-10 sm:h-11 border-0 bg-transparent text-[14px] sm:text-[15px] font-medium text-[#18233A] dark:text-slate-100 placeholder:text-[13px] sm:placeholder:text-[14px] placeholder:text-slate-400 focus-visible:ring-0 focus-visible:ring-offset-0 focus:ring-0 focus:outline-none outline-none px-3 capitalize"
                            />
                          </div>
                        </FormControl>
                        <FormMessage className="text-[12px] font-medium text-rose-500 pt-0.5" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="guardianName"
                    render={({ field }) => (
                      <FormItem className="space-y-1.5">
                        <FormLabel className="text-[13px] sm:text-[14px] font-semibold text-[#18233A] dark:text-slate-200 flex items-center gap-1.5">
                          <Users className="h-3.5 w-3.5 text-[#102A68] dark:text-blue-400" />
                          Parent / Guardian <span className="text-[#E11D48]">*</span>
                        </FormLabel>
                        <FormControl>
                          <div className="relative rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs focus-within:border-[#1F4FA3] focus-within:ring-2 focus-within:ring-[#1F4FA3]/15 transition-all">
                            <Input
                              placeholder="e.g. Rajesh Sharma"
                              {...field}
                              autoFocus={false}
                              value={field.value}
                              onChange={(e) => field.onChange(toTitleCase(e.target.value))}
                              className="h-10 sm:h-11 border-0 bg-transparent text-[14px] sm:text-[15px] font-medium text-[#18233A] dark:text-slate-100 placeholder:text-[13px] sm:placeholder:text-[14px] placeholder:text-slate-400 focus-visible:ring-0 focus-visible:ring-offset-0 focus:ring-0 focus:outline-none outline-none px-3 capitalize"
                            />
                          </div>
                        </FormControl>
                        <FormMessage className="text-[12px] font-medium text-rose-500 pt-0.5" />
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
                      <FormItem className="space-y-1.5">
                        <FormLabel className="text-[13px] sm:text-[14px] font-semibold text-[#18233A] dark:text-slate-200 flex items-center gap-1.5">
                          <GraduationCap className="h-3.5 w-3.5 text-[#102A68] dark:text-blue-400" />
                          Target Class/Course <span className="text-[#E11D48]">*</span>
                        </FormLabel>
                        <FormControl>
                          <div className="relative rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs focus-within:border-[#1F4FA3] focus-within:ring-2 focus-within:ring-[#1F4FA3]/15 transition-all">
                            <Select onValueChange={field.onChange} value={field.value}>
                              <SelectTrigger className="h-10 sm:h-11 border-0 bg-transparent text-[14px] sm:text-[15px] font-medium text-[#18233A] dark:text-slate-100 focus-visible:ring-0 focus-visible:ring-offset-0 focus:ring-0 focus:outline-none outline-none ring-0 ring-offset-0 px-3">
                                <SelectValue placeholder="Select Course" />
                              </SelectTrigger>
                              <SelectContent className="max-h-56">
                                {courseOptions.map((c) => (
                                  <SelectItem key={c} value={c} className="text-[13px] sm:text-[14px] font-medium text-[#18233A] dark:text-slate-100">
                                    {c}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </FormControl>
                        <FormMessage className="text-[12px] font-medium text-rose-500 pt-0.5" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem className="space-y-1.5">
                        <FormLabel className="text-[13px] sm:text-[14px] font-semibold text-[#18233A] dark:text-slate-200 flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5 text-[#102A68] dark:text-blue-400" />
                          State / Location <span className="text-[#E11D48]">*</span>
                        </FormLabel>
                        <FormControl>
                          <div className="relative rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs focus-within:border-[#1F4FA3] focus-within:ring-2 focus-within:ring-[#1F4FA3]/15 transition-all">
                            <Select onValueChange={field.onChange} value={field.value}>
                              <SelectTrigger className="h-10 sm:h-11 border-0 bg-transparent text-[14px] sm:text-[15px] font-medium text-[#18233A] dark:text-slate-100 focus-visible:ring-0 focus-visible:ring-offset-0 focus:ring-0 focus:outline-none outline-none ring-0 ring-offset-0 px-3">
                                <SelectValue placeholder="Select State" />
                              </SelectTrigger>
                              <SelectContent className="max-h-56">
                                {indianStates.map((s) => (
                                  <SelectItem key={s} value={s} className="text-[13px] sm:text-[14px] font-medium text-[#18233A] dark:text-slate-100">
                                    {s}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </FormControl>
                        <FormMessage className="text-[12px] font-medium text-rose-500 pt-0.5" />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Row 3: Mobile Number */}
                <FormField
                  control={form.control}
                  name="mobile"
                  render={({ field }) => (
                    <FormItem className="space-y-1.5">
                      <FormLabel className="text-[13px] sm:text-[14px] font-semibold text-[#18233A] dark:text-slate-200 flex items-center gap-1.5">
                        <Phone className="h-3.5 w-3.5 text-[#102A68] dark:text-blue-400" />
                        Mobile Number <span className="text-[#E11D48]">*</span>
                      </FormLabel>
                      <FormControl>
                        <div className="relative rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs focus-within:border-[#1F4FA3] focus-within:ring-2 focus-within:ring-[#1F4FA3]/15 transition-all">
                          <Input
                            type="tel"
                            maxLength={10}
                            placeholder="e.g. 9876543210"
                            {...field}
                            autoFocus={false}
                            className="h-10 sm:h-11 border-0 bg-transparent text-[14px] sm:text-[15px] font-medium text-[#18233A] dark:text-slate-100 placeholder:text-[13px] sm:placeholder:text-[14px] placeholder:text-slate-400 focus-visible:ring-0 focus-visible:ring-offset-0 focus:ring-0 focus:outline-none outline-none px-3"
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-[12px] font-medium text-rose-500 pt-0.5" />
                    </FormItem>
                  )}
                />

                {/* Row 4: Message / Questions */}
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem className="space-y-1.5">
                      <FormLabel className="text-[13px] sm:text-[14px] font-semibold text-[#18233A] dark:text-slate-200 flex items-center gap-1.5">
                        <MessageSquare className="h-3.5 w-3.5 text-[#102A68] dark:text-blue-400" />
                        Questions / Specific Enquiry
                      </FormLabel>
                      <FormControl>
                        <div className="relative rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs focus-within:border-[#1F4FA3] focus-within:ring-2 focus-within:ring-[#1F4FA3]/15 transition-all">
                          <Textarea
                            placeholder="Ask about fees, timing, batches, study materials..."
                            className="min-h-[85px] border-0 bg-transparent text-[14px] sm:text-[15px] font-medium text-[#18233A] dark:text-slate-100 placeholder:text-[13px] sm:placeholder:text-[14px] placeholder:text-slate-400 focus-visible:ring-0 focus-visible:ring-offset-0 focus:ring-0 focus:outline-none outline-none p-3 resize-none leading-relaxed"
                            {...field}
                            autoFocus={false}
                            value={field.value || ''}
                            onChange={(e) => field.onChange(toSentenceCase(e.target.value))}
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-[12px] font-medium text-rose-500 pt-0.5" />
                    </FormItem>
                  )}
                />
              </div>

              {/* Sticky Footer: Unified CTA & Trust Line */}
              <div className="px-5 sm:px-7 py-3 sm:py-3.5 bg-white/95 dark:bg-slate-950/95 backdrop-blur-sm border-t border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0 mt-auto sticky bottom-0 z-20 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
                <div className="flex items-center justify-center sm:justify-start gap-1.5 text-[11px] sm:text-[12px] text-slate-500 dark:text-slate-400 font-medium order-2 sm:order-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>Verified academic support. Direct counselor response.</span>
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-10 sm:h-11 px-6 sm:px-7 rounded-xl text-[13px] sm:text-[14px] font-semibold bg-[#102A68] hover:bg-[#0C1E4A] text-white shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 cursor-pointer w-full sm:w-auto order-1 sm:order-2"
                >
                  <span>{isSubmitting ? 'Submitting Enquiry...' : 'Submit Student Enquiry'}</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
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
              className="w-full h-10 sm:h-11 rounded-xl font-semibold text-[13px] sm:text-[14px] bg-[#102A68] hover:bg-[#0C1E4A] text-white cursor-pointer shadow-sm"
            >
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
