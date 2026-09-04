'use client';

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { User, GraduationCap, Phone, Mail, MapPin, Send, CheckCircle2, Sparkles, ShieldCheck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { bookFreeSession } from "@/app/actions";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const indianStates = [
  "Andaman and Nicobar Islands", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar",
  "Chandigarh", "Chhattisgarh", "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Goa",
  "Gujarat", "Haryana", "Himachal Pradesh", "Jammu and Kashmir", "Jharkhand", "Karnataka",
  "Kerala", "Ladakh", "Lakshadweep", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya",
  "Mizoram", "Nagaland", "Odisha", "Puducherry", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
];

const nearestBranches = indianStates;

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
  studentName: z.string().min(2, { message: "Name must be at least 2 characters." }),
  classCourse: z.string().min(1, { message: "Please select a class or course." }),
  mobile: z.string().regex(/^\d{10}$/, { message: "Please enter a valid 10-digit mobile number." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  nearestBranch: z.string().min(1, { message: "Please select a branch or state." }),
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
      studentName: '',
      classCourse: '',
      mobile: '',
      email: '',
      nearestBranch: '',
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

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsSubmitting(true);
    try {
      const result = await bookFreeSession({
        studentName: data.studentName,
        classCourse: data.classCourse,
        mobile: data.mobile,
        email: data.email,
        nearestBranch: data.nearestBranch,
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
        <DialogContent
          onOpenAutoFocus={(e) => e.preventDefault()}
          onCloseAutoFocus={(e) => e.preventDefault()}
          className="w-[95vw] sm:w-full sm:max-w-[495px] shadow-lg rounded-2xl border border-[#D5DDEA] dark:border-slate-800 bg-white dark:bg-slate-950 p-0 overflow-hidden top-[calc(4rem+1rem)] sm:top-[calc(4rem+1.25rem)] translate-y-0 max-h-[calc(100dvh-7.5rem)] sm:max-h-[calc(100dvh-8rem)] flex flex-col data-[state=open]:slide-in-from-top-6 data-[state=open]:duration-300 data-[state=closed]:slide-out-to-top-6 data-[state=closed]:duration-200 ease-out"
        >
          {/* Modal Header: Clean, subtle and calm */}
          <DialogHeader className="px-5 sm:px-7 pt-5 pb-2 text-left shrink-0">
            <DialogTitle className="text-left text-2xl sm:text-[26px] font-bold text-[#18233A] tracking-tight leading-snug">
              Book a Free Demo
            </DialogTitle>
            <DialogDescription className="text-left text-[14px] sm:text-[15px] font-normal text-[#52627A] mt-1 leading-relaxed">
              Experience our premier teaching methodology &amp; faculty guidance firsthand.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="px-5 sm:px-7 py-4 sm:py-5 space-y-4 sm:space-y-4.5 text-left overflow-y-auto flex-1 min-h-0 overscroll-contain" autoComplete="off">
              {/* Row 1: Student Name */}
              <FormField
                control={form.control}
                name="studentName"
                render={({ field }) => (
                  <FormItem className="space-y-0">
                    <FormLabel className="text-[15px] sm:text-[16px] font-semibold text-[#18233A] flex items-center gap-2 mb-2">
                      <User className="h-4 w-4 text-[#102A68]" />
                      Student Full Name <span className="text-[#E11D48]">*</span>
                    </FormLabel>
                    <FormControl>
                      <div className="relative rounded-[11px] border-[1.5px] border-[#D5DDEA] bg-white shadow-xs">
                        <Input
                          placeholder="e.g. Rahul Sharma"
                          {...field}
                          autoFocus={false}
                          value={field.value}
                          onChange={(e) => field.onChange(toTitleCase(e.target.value))}
                          className="h-12 border-0 bg-transparent text-[16px] sm:text-[17px] font-medium text-[#18233A] placeholder:text-[#94A3BA] focus-visible:ring-0 focus-visible:ring-offset-0 focus:ring-0 focus:outline-none outline-none px-3.5 capitalize"
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-[12px] font-medium text-rose-500 pt-1" />
                  </FormItem>
                )}
              />

              {/* Row 2: Target Course & Nearest Branch */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                <FormField
                  control={form.control}
                  name="classCourse"
                  render={({ field }) => (
                    <FormItem className="space-y-0">
                      <FormLabel className="text-[15px] sm:text-[16px] font-semibold text-[#18233A] flex items-center gap-2 mb-2">
                        <GraduationCap className="h-4 w-4 text-[#102A68]" />
                        Target Class/Course <span className="text-[#E11D48]">*</span>
                      </FormLabel>
                      <FormControl>
                        <div className="relative rounded-[11px] border-[1.5px] border-[#D5DDEA] bg-white shadow-xs">
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger className="h-12 border-0 bg-transparent text-[16px] sm:text-[17px] font-medium text-[#18233A] focus-visible:ring-0 focus-visible:ring-offset-0 focus:ring-0 focus:ring-offset-0 focus:outline-none outline-none ring-0 ring-offset-0 px-3.5">
                              <SelectValue placeholder="Select Course" />
                            </SelectTrigger>
                            <SelectContent className="max-h-56">
                              {courseOptions.map((c) => (
                                <SelectItem key={c} value={c} className="text-[14px] font-medium text-[#18233A]">
                                  {c}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </FormControl>
                      <FormMessage className="text-[12px] font-medium text-rose-500 pt-1" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="nearestBranch"
                  render={({ field }) => (
                    <FormItem className="space-y-0">
                      <FormLabel className="text-[15px] sm:text-[16px] font-semibold text-[#18233A] flex items-center gap-2 mb-2">
                        <MapPin className="h-4 w-4 text-[#102A68]" />
                        Branch / State <span className="text-[#E11D48]">*</span>
                      </FormLabel>
                      <FormControl>
                        <div className="relative rounded-[11px] border-[1.5px] border-[#D5DDEA] bg-white shadow-xs">
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger className="h-12 border-0 bg-transparent text-[16px] sm:text-[17px] font-medium text-[#18233A] focus-visible:ring-0 focus-visible:ring-offset-0 focus:ring-0 focus:ring-offset-0 focus:outline-none outline-none ring-0 ring-offset-0 px-3.5">
                              <SelectValue placeholder="Select Branch" />
                            </SelectTrigger>
                            <SelectContent className="max-h-56">
                              {nearestBranches.map((b) => (
                                <SelectItem key={b} value={b} className="text-[14px] font-medium text-[#18233A]">
                                  {b}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </FormControl>
                      <FormMessage className="text-[12px] font-medium text-rose-500 pt-1" />
                    </FormItem>
                  )}
                />
              </div>

              {/* Row 3: Mobile & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                <FormField
                  control={form.control}
                  name="mobile"
                  render={({ field }) => (
                    <FormItem className="space-y-0">
                      <FormLabel className="text-[15px] sm:text-[16px] font-semibold text-[#18233A] flex items-center gap-2 mb-2">
                        <Phone className="h-4 w-4 text-[#102A68]" />
                        Mobile Number <span className="text-[#E11D48]">*</span>
                      </FormLabel>
                      <FormControl>
                        <div className="relative rounded-[11px] border-[1.5px] border-[#D5DDEA] bg-white shadow-xs">
                          <Input
                            type="tel"
                            maxLength={10}
                            placeholder="e.g. 9876543210"
                            {...field}
                            autoFocus={false}
                            className="h-12 border-0 bg-transparent text-[16px] sm:text-[17px] font-medium text-[#18233A] placeholder:text-[#94A3BA] focus-visible:ring-0 focus-visible:ring-offset-0 focus:ring-0 focus:outline-none outline-none px-3.5"
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-[12px] font-medium text-rose-500 pt-1" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="space-y-0">
                      <FormLabel className="text-[15px] sm:text-[16px] font-semibold text-[#18233A] flex items-center gap-2 mb-2">
                        <Mail className="h-4 w-4 text-[#102A68]" />
                        Email Address <span className="text-[#E11D48]">*</span>
                      </FormLabel>
                      <FormControl>
                        <div className="relative rounded-[11px] border-[1.5px] border-[#D5DDEA] bg-white shadow-xs">
                          <Input
                            type="email"
                            placeholder="e.g. rahul@example.com"
                            {...field}
                            autoFocus={false}
                            className="h-12 border-0 bg-transparent text-[16px] sm:text-[17px] font-medium text-[#18233A] placeholder:text-[#94A3BA] focus-visible:ring-0 focus-visible:ring-offset-0 focus:ring-0 focus:outline-none outline-none px-3.5"
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-[12px] font-medium text-rose-500 pt-1" />
                    </FormItem>
                  )}
                />
              </div>

              {/* Submit & Trust Note */}
              <div className="pt-2 space-y-2.5">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-11 px-6 rounded-[10px] text-[15px] sm:text-[16px] font-semibold bg-[#102A68] hover:bg-[#0D2254] text-white shadow-sm hover:shadow active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>{isSubmitting ? 'Booking Free Session...' : 'Book Free Demo Session'}</span>
                  <Send className="h-4 w-4" />
                </Button>

                <div className="flex items-center justify-center gap-1.5 text-[12px] text-[#52627A] text-center font-medium">
                  <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>100% free session. Zero commitment required.</span>
                </div>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Success Dialog */}
      <Dialog open={isSuccessOpen} onOpenChange={setIsSuccessOpen}>
        <DialogContent className="rounded-2xl max-w-sm border border-[#D5DDEA] p-6 bg-white dark:bg-slate-900 text-center shadow-lg">
          <DialogHeader className="space-y-2">
            <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <DialogTitle className="text-xl font-bold text-[#18233A] dark:text-slate-100">Free Session Booked!</DialogTitle>
            <DialogDescription className="text-sm font-normal text-[#52627A] dark:text-slate-400 leading-relaxed">
              Your free demo session has been scheduled. Our academic counselor will call you shortly with details.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button
              onClick={() => {
                setIsSuccessOpen(false);
                onOpenChange(false);
              }}
              className="w-full h-11 rounded-[10px] font-semibold text-[15px] bg-[#102A68] hover:bg-[#0D2254] text-white cursor-pointer shadow-sm"
            >
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
