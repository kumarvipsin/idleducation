'use client';

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { User, UserCheck, BookOpen, Phone, MapPin, CheckCircle2, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { registerForScholarship } from "@/app/actions/forms";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FormModalDialogContent } from "@/components/ui/form-modal-dialog";

const scholarshipSchema = z.object({
  studentName: z.string().min(2, { message: "Name must be at least 2 characters." }),
  guardianName: z.string().min(2, { message: "Guardian name is required." }),
  class: z.string().min(1, { message: "Please select a class." }),
  mobile: z.string().regex(/^\d{10}$/, { message: "Please enter a valid 10-digit mobile number." }),
  country: z.string().min(1, { message: "Please select a country." }),
  state: z.string().min(1, { message: "Please select a state." }),
});

type ScholarshipFormValues = z.infer<typeof scholarshipSchema>;

const scholarshipClasses = [
  "JEE",
  "NEET",
  "Class 9",
  "Class 10",
  "Class 11 - Science",
  "Class 11 - Commerce",
  "Class 11 - Arts",
  "Class 12 - Science",
  "Class 12 - Commerce",
  "Class 12 - Arts"
];

const indianStates = [
  "Delhi",
  "Bihar"
];

interface ScholarshipModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const toTitleCase = (str: string) => {
  return str.replace(/\b([a-z])/g, (char) => char.toUpperCase());
};

export function ScholarshipModal({ isOpen, onOpenChange }: ScholarshipModalProps) {
  const { toast } = useToast();
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ScholarshipFormValues>({
    resolver: zodResolver(scholarshipSchema),
    defaultValues: {
      studentName: '',
      guardianName: '',
      class: '',
      mobile: '',
      country: 'India',
      state: '',
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

  const onSubmit: SubmitHandler<ScholarshipFormValues> = async (data) => {
    setIsSubmitting(true);
    try {
      const result = await registerForScholarship(data);
      if (result.success) {
        setIsSuccessOpen(true);
        form.reset();
      } else {
        toast({
          variant: "destructive",
          title: "Registration Failed",
          description: result.message || "Failed to submit scholarship registration.",
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
          maxWidthClass="max-w-[490px] sm:max-w-[510px]"
          className="w-[90vw] sm:w-[92vw]"
        >
          {/* Modal Header */}
          <DialogHeader className="px-5 sm:px-6 pt-5 pb-3 sm:pt-5.5 sm:pb-3.5 text-left shrink-0 border-b border-[#E8EFF8] dark:border-slate-800/80 pr-12">
            <DialogTitle className="text-left text-[18px] sm:text-[19px] font-bold text-[#0B1F4B] dark:text-white tracking-tight leading-snug">
              Scholarship Registration
            </DialogTitle>
            <DialogDescription className="text-left text-[12px] sm:text-[12.5px] font-normal text-slate-500 dark:text-slate-400 mt-1 leading-normal">
              Appear for IDL Talent Hunt 2026–27 and earn up to 70% scholarship.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col flex-1 h-full min-h-0 overflow-hidden" autoComplete="off">
              <div className="px-5 sm:px-6 py-4 sm:py-4.5 space-y-3 sm:space-y-3.5 text-left overflow-y-auto flex-1 min-h-0 overscroll-contain">
                {/* Row 1: Student Name & Guardian Name */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5">
                  <FormField
                    control={form.control}
                    name="studentName"
                    render={({ field }) => (
                      <FormItem className="text-left">
                        <FormLabel className="sr-only">Student Full Name</FormLabel>
                        <FormControl>
                          <div className="relative flex items-center rounded-xl border border-[#DCE7F6] dark:border-slate-800 bg-[#F8FAFD] dark:bg-slate-900/60 shadow-2xs focus-within:border-[#2563EB] focus-within:ring-2 focus-within:ring-[#2563EB]/15 transition-all">
                            <User className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 pointer-events-none stroke-[1.8]" />
                            <Input
                              placeholder="Student Full Name *"
                              {...field}
                              autoFocus={false}
                              value={field.value}
                              onChange={(e) => field.onChange(toTitleCase(e.target.value))}
                              className="h-10.5 sm:h-11 border-0 bg-transparent text-[13.5px] sm:text-[14px] font-medium text-[#0B1F4B] dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus-visible:ring-0 focus-visible:ring-offset-0 focus:ring-0 focus:outline-none outline-none pl-10 pr-3.5 capitalize"
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
                          <div className="relative flex items-center rounded-xl border border-[#DCE7F6] dark:border-slate-800 bg-[#F8FAFD] dark:bg-slate-900/60 shadow-2xs focus-within:border-[#2563EB] focus-within:ring-2 focus-within:ring-[#2563EB]/15 transition-all">
                            <UserCheck className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 pointer-events-none stroke-[1.8]" />
                            <Input
                              placeholder="Parent / Guardian Name *"
                              {...field}
                              autoFocus={false}
                              value={field.value}
                              onChange={(e) => field.onChange(toTitleCase(e.target.value))}
                              className="h-10.5 sm:h-11 border-0 bg-transparent text-[13.5px] sm:text-[14px] font-medium text-[#0B1F4B] dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus-visible:ring-0 focus-visible:ring-offset-0 focus:ring-0 focus:outline-none outline-none pl-10 pr-3.5 capitalize"
                            />
                          </div>
                        </FormControl>
                        <FormMessage className="text-[11.5px] font-medium text-rose-500 pt-1" />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Row 2: Target Class & Mobile Number */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5">
                  <FormField
                    control={form.control}
                    name="class"
                    render={({ field }) => (
                      <FormItem className="text-left">
                        <FormLabel className="sr-only">Target Class / Exam</FormLabel>
                        <FormControl>
                          <div className="relative flex items-center rounded-xl border border-[#DCE7F6] dark:border-slate-800 bg-[#F8FAFD] dark:bg-slate-900/60 shadow-2xs focus-within:border-[#2563EB] focus-within:ring-2 focus-within:ring-[#2563EB]/15 transition-all">
                            <BookOpen className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 pointer-events-none stroke-[1.8] z-10" />
                            <Select onValueChange={field.onChange} value={field.value}>
                              <SelectTrigger className="h-10.5 sm:h-11 border-0 bg-transparent text-[13.5px] sm:text-[14px] font-medium text-[#0B1F4B] dark:text-slate-100 focus-visible:ring-0 focus-visible:ring-offset-0 focus:ring-0 focus:outline-none outline-none ring-0 ring-offset-0 pl-10 pr-3.5 w-full cursor-pointer data-[placeholder]:text-slate-400 dark:data-[placeholder]:text-slate-500 [&>span[data-placeholder]]:text-slate-400 dark:[&>span[data-placeholder]]:text-slate-500">
                                <SelectValue placeholder="Target Class / Exam *" />
                              </SelectTrigger>
                              <SelectContent className="max-h-56">
                                {scholarshipClasses.map((c) => (
                                  <SelectItem key={c} value={c} className="text-[13px] sm:text-[14px] font-medium text-[#0B1F4B] dark:text-slate-100">
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
                          <div className="relative flex items-center rounded-xl border border-[#DCE7F6] dark:border-slate-800 bg-[#F8FAFD] dark:bg-slate-900/60 shadow-2xs focus-within:border-[#2563EB] focus-within:ring-2 focus-within:ring-[#2563EB]/15 transition-all">
                            <Phone className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 pointer-events-none stroke-[1.8]" />
                            <Input
                              type="tel"
                              maxLength={10}
                              placeholder="Mobile Number *"
                              {...field}
                              autoFocus={false}
                              className="h-10.5 sm:h-11 border-0 bg-transparent text-[13.5px] sm:text-[14px] font-medium text-[#0B1F4B] dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus-visible:ring-0 focus-visible:ring-offset-0 focus:ring-0 focus:outline-none outline-none pl-10 pr-3.5"
                            />
                          </div>
                        </FormControl>
                        <FormMessage className="text-[11.5px] font-medium text-rose-500 pt-1" />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Row 3: State / Location */}
                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem className="text-left">
                      <FormLabel className="sr-only">State / Location</FormLabel>
                      <FormControl>
                        <div className="relative flex items-center rounded-xl border border-[#DCE7F6] dark:border-slate-800 bg-[#F8FAFD] dark:bg-slate-900/60 shadow-2xs focus-within:border-[#2563EB] focus-within:ring-2 focus-within:ring-[#2563EB]/15 transition-all">
                          <MapPin className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 pointer-events-none stroke-[1.8] z-10" />
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger className="h-10.5 sm:h-11 border-0 bg-transparent text-[13.5px] sm:text-[14px] font-medium text-[#0B1F4B] dark:text-slate-100 focus-visible:ring-0 focus-visible:ring-offset-0 focus:ring-0 focus:outline-none outline-none ring-0 ring-offset-0 pl-10 pr-3.5 w-full cursor-pointer data-[placeholder]:text-slate-400 dark:data-[placeholder]:text-slate-500 [&>span[data-placeholder]]:text-slate-400 dark:[&>span[data-placeholder]]:text-slate-500">
                              <SelectValue placeholder="Select State / Location *" />
                            </SelectTrigger>
                            <SelectContent className="max-h-56">
                              {indianStates.map((s) => (
                                <SelectItem key={s} value={s} className="text-[13px] sm:text-[14px] font-medium text-[#0B1F4B] dark:text-slate-100">
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

              {/* Action Footer: Touch-friendly Primary CTA */}
              <div className="px-5 sm:px-6 py-3.5 sm:py-4 bg-white dark:bg-slate-950 border-t border-[#E8EFF8] dark:border-slate-800/80 flex items-center shrink-0 mt-auto sticky bottom-0 z-20 pb-[max(0.875rem,env(safe-area-inset-bottom))]">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-[48px] sm:h-[50px] px-5 rounded-xl text-[14px] sm:text-[14.5px] font-semibold bg-[#0B1F4B] hover:bg-[#155EEF] text-white shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99] disabled:opacity-70 group"
                >
                  {isSubmitting ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Registering...</span>
                    </>
                  ) : (
                    <>
                      <span>Register for Scholarship</span>
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 stroke-[2.2]" />
                    </>
                  )}
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
            <DialogTitle className="text-xl font-bold text-[#102A68] dark:text-white">Registered Successfully!</DialogTitle>
            <DialogDescription className="text-[13px] sm:text-[14px] font-normal text-slate-500 dark:text-slate-400 leading-relaxed">
              Your scholarship test registration is confirmed. Our examination coordinator will contact you with test schedule and syllabus.
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
