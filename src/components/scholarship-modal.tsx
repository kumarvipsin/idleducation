'use client';

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { User, Users, GraduationCap, Phone, MapPin, Send, CheckCircle2, Trophy, ShieldCheck, Award } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { registerForScholarship } from "@/app/actions";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

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
  "Class 5th Foundation", "Class 6th Foundation", "Class 7th Foundation", "Class 8th Foundation",
  "Class 9th (Pre-Board / Olympiad)", "Class 10th (Board / Olympiad)",
  "Class 11th - Medical (NEET)", "Class 11th - Engineering (JEE)",
  "Class 12th - Medical (NEET)", "Class 12th - Engineering (JEE)",
  "Target / Dropper Batch (NEET / JEE)"
];

const indianStates = [
  "Andaman and Nicobar Islands", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar",
  "Chandigarh", "Chhattisgarh", "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Goa",
  "Gujarat", "Haryana", "Himachal Pradesh", "Jammu and Kashmir", "Jharkhand", "Karnataka",
  "Kerala", "Ladakh", "Lakshadweep", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya",
  "Mizoram", "Nagaland", "Odisha", "Puducherry", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
];

const countries = [
  "India", "Nepal", "Bhutan", "Bangladesh", "United Arab Emirates", "Other"
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
        <DialogContent
          onOpenAutoFocus={(e) => e.preventDefault()}
          onCloseAutoFocus={(e) => e.preventDefault()}
          className="w-[95vw] sm:w-full sm:max-w-[495px] shadow-lg rounded-2xl border border-[#D5DDEA] dark:border-slate-800 bg-white dark:bg-slate-950 p-0 overflow-hidden top-[calc(4rem+1rem)] sm:top-[calc(4rem+1.25rem)] translate-y-0 max-h-[calc(100dvh-7.5rem)] sm:max-h-[calc(100dvh-8rem)] flex flex-col data-[state=open]:slide-in-from-top-6 data-[state=open]:duration-300 data-[state=closed]:slide-out-to-top-6 data-[state=closed]:duration-200 ease-out"
        >
          {/* Modal Header: Clean, subtle and calm */}
          <DialogHeader className="px-5 sm:px-7 pt-5 pb-2 text-left shrink-0">
            <DialogTitle className="text-left text-2xl sm:text-[26px] font-bold text-[#18233A] tracking-tight leading-snug">
              Scholarship Registration
            </DialogTitle>
            <DialogDescription className="text-left text-[14px] sm:text-[15px] font-normal text-[#52627A] mt-1 leading-relaxed">
              Appear for IDL Talent Hunt 2026–27 and earn up to 100% academic scholarship &amp; fee rewards.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="px-5 sm:px-7 py-4 sm:py-5 space-y-4 sm:space-y-4.5 text-left overflow-y-auto flex-1 min-h-0 overscroll-contain" autoComplete="off">
              {/* Row 1: Student Name & Guardian Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
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

                <FormField
                  control={form.control}
                  name="guardianName"
                  render={({ field }) => (
                    <FormItem className="space-y-0">
                      <FormLabel className="text-[15px] sm:text-[16px] font-semibold text-[#18233A] flex items-center gap-2 mb-2">
                        <Users className="h-4 w-4 text-[#102A68]" />
                        Parent / Guardian <span className="text-[#E11D48]">*</span>
                      </FormLabel>
                      <FormControl>
                        <div className="relative rounded-[11px] border-[1.5px] border-[#D5DDEA] bg-white shadow-xs">
                          <Input
                            placeholder="e.g. Rajesh Sharma"
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
              </div>

              {/* Row 2: Target Class & Mobile Number */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                <FormField
                  control={form.control}
                  name="class"
                  render={({ field }) => (
                    <FormItem className="space-y-0">
                      <FormLabel className="text-[15px] sm:text-[16px] font-semibold text-[#18233A] flex items-center gap-2 mb-2">
                        <GraduationCap className="h-4 w-4 text-[#102A68]" />
                        Target Class / Exam <span className="text-[#E11D48]">*</span>
                      </FormLabel>
                      <FormControl>
                        <div className="relative rounded-[11px] border-[1.5px] border-[#D5DDEA] bg-white shadow-xs">
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger className="h-12 border-0 bg-transparent text-[16px] sm:text-[17px] font-medium text-[#18233A] focus-visible:ring-0 focus-visible:ring-offset-0 focus:ring-0 focus:ring-offset-0 focus:outline-none outline-none ring-0 ring-offset-0 px-3.5">
                              <SelectValue placeholder="Select Class" />
                            </SelectTrigger>
                            <SelectContent className="max-h-56">
                              {scholarshipClasses.map((c) => (
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
              </div>

              {/* Row 3: State / Location */}
              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem className="space-y-0">
                    <FormLabel className="text-[15px] sm:text-[16px] font-semibold text-[#18233A] flex items-center gap-2 mb-2">
                      <MapPin className="h-4 w-4 text-[#102A68]" />
                      State / Location <span className="text-[#E11D48]">*</span>
                    </FormLabel>
                    <FormControl>
                      <div className="relative rounded-[11px] border-[1.5px] border-[#D5DDEA] bg-white shadow-xs">
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger className="h-12 border-0 bg-transparent text-[16px] sm:text-[17px] font-medium text-[#18233A] focus-visible:ring-0 focus-visible:ring-offset-0 focus:ring-0 focus:ring-offset-0 focus:outline-none outline-none ring-0 ring-offset-0 px-3.5">
                            <SelectValue placeholder="Select State / Location" />
                          </SelectTrigger>
                          <SelectContent className="max-h-56">
                            {indianStates.map((s) => (
                              <SelectItem key={s} value={s} className="text-[14px] font-medium text-[#18233A]">
                                {s}
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

              {/* Submit & Trust Note */}
              <div className="pt-2 space-y-2.5">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-11 px-6 rounded-[10px] text-[15px] sm:text-[16px] font-semibold bg-[#102A68] hover:bg-[#0D2254] text-white shadow-sm hover:shadow active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>{isSubmitting ? 'Registering...' : 'Register For Scholarship (100% Free)'}</span>
                  <Send className="h-4 w-4" />
                </Button>

                <div className="flex items-center justify-center gap-1.5 text-[12px] text-[#52627A] text-center font-medium">
                  <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Zero registration fee. Merit-based scholarship test.</span>
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
            <DialogTitle className="text-xl font-bold text-[#18233A] dark:text-slate-100">Registered Successfully!</DialogTitle>
            <DialogDescription className="text-sm font-normal text-[#52627A] dark:text-slate-400 leading-relaxed">
              Your scholarship test registration is confirmed. Our examination coordinator will contact you with test schedule and syllabus.
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
