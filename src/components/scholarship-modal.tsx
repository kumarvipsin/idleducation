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
import { registerForScholarship } from "@/app/actions/forms";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FormModalDialogContent } from "@/components/ui/form-modal-dialog";
import { cn } from "@/lib/utils";

const indianStates = [
  "Delhi",
  "Other"
];

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

const scholarshipSchema = z.object({
  mode: z.string().default('Offline'),
  studentName: z.string().min(2, { message: "Name must be at least 2 characters." }),
  guardianName: z.string().min(2, { message: "Parent/Guardian name is required." }),
  mobile: z.string().regex(/^\d{10}$/, { message: "Please enter a valid 10-digit mobile number." }),
  otp: z.string().optional(),
  state: z.string().min(1, { message: "Please select your state." }),
  customState: z.string().optional(),
  city: z.string().min(1, { message: "Please enter your city." }),
  branch: z.string().optional(),
  class: z.string().min(1, { message: "Please select a class." }),
  country: z.string().default('India'),
  message: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.state === 'Delhi' && (!data.branch || data.branch.trim() === '')) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Please select a branch in Delhi.",
      path: ['branch'],
    });
  }
  if (data.state === 'Other' && (!data.customState || data.customState.trim().length < 2)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Please enter your state name.",
      path: ['customState'],
    });
  }
});

type ScholarshipFormValues = z.infer<typeof scholarshipSchema>;

interface ScholarshipModalProps {
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

export function ScholarshipModal({ isOpen, onOpenChange, defaultBranch }: ScholarshipModalProps) {
  const { toast } = useToast();
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedData, setSubmittedData] = useState<ScholarshipFormValues | null>(null);
  const [otpSent, setOtpSent] = useState(false);
  const [otpCountdown, setOtpCountdown] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (otpCountdown > 0) {
      timer = setTimeout(() => setOtpCountdown((c) => c - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [otpCountdown]);

  const handleGetOtp = () => {
    const mob = form.getValues('mobile');
    if (!mob || mob.length < 10) {
      toast({
        variant: "destructive",
        title: "Mobile Number Required",
        description: "Please enter a valid 10-digit mobile number first.",
      });
      return;
    }
    setOtpSent(true);
    setOtpCountdown(30);
    toast({
      title: "OTP Sent Successfully",
      description: `A verification OTP has been sent to +91 ${mob}.`,
    });
  };

  const form = useForm<ScholarshipFormValues>({
    resolver: zodResolver(scholarshipSchema),
    defaultValues: {
      mode: 'Offline',
      studentName: '',
      guardianName: '',
      mobile: '',
      otp: '',
      branch: '',
      state: '',
      customState: '',
      city: '',
      class: '',
      country: 'India',
      message: '',
    },
  });

  const selectedState = form.watch("state");

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
          form.setValue('state', 'Delhi');
          form.setValue('branch', match);
          form.setValue('city', 'Delhi');
        }
      }
    }
  }, [isOpen, defaultBranch, form]);

  const onSubmit: SubmitHandler<ScholarshipFormValues> = async (data) => {
    setIsSubmitting(true);
    try {
      const result = await registerForScholarship({
        mode: data.mode || 'Offline',
        studentName: data.studentName,
        guardianName: data.guardianName,
        class: data.class,
        mobile: data.mobile,
        otp: data.otp || '',
        state: data.state === 'Other' ? (data.customState || 'Other') : data.state,
        city: data.city || '',
        country: 'India',
        branch: data.state === 'Other' ? (data.customState || 'Other') : (data.branch || ''),
        message: data.message || '',
      });

      if (result.success) {
        setSubmittedData(data);
        setIsSuccessOpen(true);
        form.reset({
          mode: 'Offline',
          studentName: '',
          guardianName: '',
          mobile: '',
          otp: '',
          branch: '',
          state: '',
          customState: '',
          city: '',
          class: '',
          country: 'India',
          message: '',
        });
        setOtpSent(false);
        setOtpCountdown(0);
      } else {
        toast({
          variant: "destructive",
          title: "Registration Failed",
          description: result.message || "Failed to submit scholarship application. Please try again.",
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
                SCHOLARSHIP REGISTRATION FORM
              </span>
            </div>
          </div>

          <DialogHeader className="sr-only">
            <DialogTitle>Scholarship Registration Form</DialogTitle>
            <DialogDescription>Register for IDL Admission and Scholarship Test</DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col flex-1 min-h-0 overflow-y-auto overscroll-contain" autoComplete="off">
              {/* Form Body - Clean Underlines, Consistent Vertical Spacing matching Admission Form */}
              <div className="px-4 sm:px-7 pt-3.5 sm:pt-4 pb-4 sm:pb-5 space-y-3.5 sm:space-y-4 text-left">

                {/* Mode Selector: "Your Mode:" in Gray colour, Only Offline active, Online and Hybrid disabled */}
                <FormField
                  control={form.control}
                  name="mode"
                  render={({ field }) => (
                    <FormItem className="space-y-0.5">
                      <FormLabel className="sr-only">Scholarship Mode</FormLabel>
                      <FormControl>
                        <div className="flex items-center gap-x-3.5 sm:gap-x-6 gap-y-1.5 py-0.5 overflow-x-auto no-scrollbar">
                          <span className="text-[12px] sm:text-[13px] font-semibold text-slate-500 dark:text-slate-400 shrink-0 leading-none">
                            Your Mode:
                          </span>
                          <div className="flex items-center gap-3.5 sm:gap-5 shrink-0">
                            {[
                              { value: 'Offline', label: 'Offline', disabled: false },
                              { value: 'Online', label: 'Online', disabled: true },
                              { value: 'Hybrid', label: 'Hybrid', disabled: true },
                            ].map((item) => {
                              const isSelected = field.value === item.value;
                              return (
                                <button
                                  key={item.value}
                                  type="button"
                                  disabled={item.disabled}
                                  onClick={() => {
                                    if (!item.disabled) field.onChange(item.value);
                                  }}
                                  className={cn(
                                    "inline-flex items-center gap-1.5 sm:gap-2 select-none bg-transparent border-0 py-1 px-0.5 focus:outline-none transition-opacity",
                                    item.disabled ? "opacity-35 cursor-not-allowed" : "cursor-pointer group"
                                  )}
                                >
                                  <div
                                    className={cn(
                                      "w-[16px] h-[16px] sm:w-[18px] sm:h-[18px] rounded-full flex items-center justify-center transition-all duration-150 shrink-0",
                                      isSelected
                                        ? "border-[2px] border-[#2864E8] bg-white dark:bg-slate-900 shadow-[0_0_0_2px_rgba(40,100,232,0.12)]"
                                        : item.disabled
                                          ? "border-[1.5px] border-slate-300 dark:border-slate-700 bg-transparent"
                                          : "border-[1.5px] border-slate-300 dark:border-slate-600 bg-transparent group-hover:border-slate-400"
                                    )}
                                  >
                                    {isSelected && (
                                      <div className="w-[6px] h-[6px] sm:w-[8px] sm:h-[8px] rounded-full bg-[#2864E8]" />
                                    )}
                                  </div>
                                  <span
                                    className={cn(
                                      "text-[12px] sm:text-[13.5px] transition-colors leading-none",
                                      isSelected
                                        ? "font-semibold text-slate-900 dark:text-white"
                                        : item.disabled
                                          ? "font-normal text-slate-400 dark:text-slate-500"
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

                {/* Row 2: Mobile Number (Full-width underline on Input itself, like Student Name) & Enter OTP (underline directly on Input itself, NOT under GET OTP button) */}
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
                              placeholder="Mobile Number *"
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
                    name="otp"
                    render={({ field }) => (
                      <FormItem className="space-y-0 text-left">
                        <FormLabel className="sr-only">Enter OTP</FormLabel>
                        <FormControl>
                          <div className="flex items-center gap-2 sm:gap-2.5 h-[38px] sm:h-[40px] w-full">
                            <Input
                              type="text"
                              maxLength={6}
                              placeholder="Enter OTP"
                              {...field}
                              className="h-[38px] sm:h-[40px] flex-1 border-0 border-b border-slate-200/90 dark:border-slate-700/80 !bg-transparent rounded-none px-0 text-[13px] sm:text-[13.5px] font-medium text-slate-900 dark:text-slate-100 placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:ring-0 focus:ring-offset-0 focus:border-[#2864E8] focus:shadow-[0_1px_0_0_#2864E8] focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-[#2864E8] focus-visible:shadow-[0_1px_0_0_#2864E8] shadow-none flex items-center leading-none transition-[border-color,box-shadow] duration-150"
                              onChange={(e) => field.onChange(e.target.value.replace(/\D/g, ''))}
                            />
                            <button
                              type="button"
                              onClick={handleGetOtp}
                              className="shrink-0 h-[30px] sm:h-[32px] px-2.5 sm:px-3 font-bold text-[10.5px] sm:text-[11px] tracking-wider uppercase rounded-[5px] bg-[#2864E8]/10 hover:bg-[#2864E8]/20 text-[#2864E8] select-none transition-all duration-150 border border-[#2864E8]/25 cursor-pointer flex items-center justify-center active:scale-95 shadow-none whitespace-nowrap"
                            >
                              {otpCountdown > 0 ? `Resend (${otpCountdown}s)` : otpSent ? 'Resend OTP' : 'Get OTP'}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage className="text-[11.5px] font-medium text-rose-500 pt-0.5" />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Row 3: State (Delhi / Other) & (Preferred Branch OR Custom State Name) in 2-column grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                  <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem className="space-y-0 text-left">
                        <FormLabel className="sr-only">State</FormLabel>
                        <Select
                          onValueChange={(val) => {
                            field.onChange(val);
                            if (val === 'Delhi') {
                              if (!form.getValues('city')) {
                                form.setValue('city', 'Delhi');
                              }
                            } else if (val === 'Other') {
                              form.setValue('branch', '');
                              if (form.getValues('city') === 'Delhi') {
                                form.setValue('city', '');
                              }
                            }
                          }}
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

                  {selectedState === 'Other' ? (
                    <FormField
                      control={form.control}
                      name="customState"
                      render={({ field }) => (
                        <FormItem className="space-y-0 text-left">
                          <FormLabel className="sr-only">Enter State Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter State Name *"
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
                  ) : (
                    <FormField
                      control={form.control}
                      name="branch"
                      render={({ field }) => (
                        <FormItem className="space-y-0 text-left">
                          <FormLabel className="sr-only">Preferred Branch</FormLabel>
                          <Select
                            onValueChange={(val) => {
                              field.onChange(val);
                              if (!form.getValues('state')) {
                                form.setValue('state', 'Delhi');
                                if (!form.getValues('city')) form.setValue('city', 'Delhi');
                              }
                            }}
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
                  )}
                </div>

                {/* Row 4: City & Class / Course in 2-column grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem className="space-y-0 text-left">
                        <FormLabel className="sr-only">City</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="City *"
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
                    name="class"
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

                {/* Row 5: Previous Exam % / Academic Score (Full-width) */}
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem className="space-y-0 text-left">
                      <FormLabel className="sr-only">Previous Class % or Score</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Previous Class % or Score (Optional)"
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
            Scholarship Application Received!
          </DialogTitle>
          <DialogDescription className="text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
            Thank you, <span className="font-semibold text-slate-900 dark:text-white">{submittedData?.studentName}</span>. Your scholarship test registration for <span className="font-semibold text-slate-900 dark:text-white">{submittedData?.branch || 'Delhi'}</span> has been confirmed. Our coordinator will contact you with test schedule and syllabus.
          </DialogDescription>
          <div className="mt-4 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 text-left space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
            <div className="flex justify-between">
              <span className="text-slate-400 font-medium">Student:</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{submittedData?.studentName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400 font-medium">Class:</span>
              <span className="font-bold text-blue-600">{submittedData?.class}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400 font-medium">Mode:</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{submittedData?.mode || 'Offline'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400 font-medium">Branch / City:</span>
              <span className="font-bold text-slate-800 dark:text-slate-200 truncate max-w-[200px]">
                {submittedData?.state === 'Other' ? `${submittedData?.city}, ${submittedData?.customState}` : (submittedData?.branch || 'Delhi')}
              </span>
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
