'use client';

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Send, User, Users, MessageSquare, CheckCircle2, GraduationCap, Phone, MapPin } from "lucide-react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { submitStudentEnquiry } from "@/app/actions";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DISCOVER_COURSES } from "@/lib/courses";

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
  studentName: z.string().min(2, { message: "Student name is required (min 2 characters)." }),
  guardianName: z.string().min(2, { message: "Guardian name is required (min 2 characters)." }),
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
    } catch (error) {
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
          className="w-[95vw] max-w-[500px] p-0 overflow-hidden bg-white dark:bg-slate-900 border-2 border-primary/10 rounded-2xl shadow-none focus:outline-hidden h-[82vh] max-h-[660px] top-[calc(50%+1.5rem)] flex flex-col gap-0"
        >
          {/* Header matching Contact Us & Admission modal style */}
          <DialogHeader className="px-6 py-4 text-left border-b border-slate-100 dark:border-slate-800 shrink-0 space-y-0.5">
            <DialogTitle className="text-2xl font-extrabold text-primary tracking-tighter text-left">
              Student Enquiry
            </DialogTitle>
            <DialogDescription className="text-[13px] font-extrabold text-muted-foreground text-left">
              Have questions regarding admissions, batches or fees? Ask us directly
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col flex-1 h-full min-h-0 overflow-hidden">
              {/* Scrollable Form Body */}
              <div className="overflow-y-auto flex-1 min-h-0 divide-y divide-slate-100 dark:divide-slate-800">
                {/* Student Name */}
                <FormField
                  control={form.control}
                  name="studentName"
                  render={({ field }) => (
                    <FormItem className="space-y-0">
                      <FormControl>
                        <div className="relative group">
                          <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none transition-transform duration-300 group-focus-within:scale-110">
                            <User className="h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                          </div>
                          <Input
                            {...field}
                            placeholder="Student Full Name *"
                            className="pl-12 h-14 bg-transparent border-0 rounded-none font-bold text-[13px] text-slate-800 dark:text-slate-200 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-slate-400"
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-[10px] px-4 pb-2 text-rose-500 font-bold" />
                    </FormItem>
                  )}
                />

                {/* Guardian Name */}
                <FormField
                  control={form.control}
                  name="guardianName"
                  render={({ field }) => (
                    <FormItem className="space-y-0">
                      <FormControl>
                        <div className="relative group">
                          <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none transition-transform duration-300 group-focus-within:scale-110">
                            <Users className="h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                          </div>
                          <Input
                            {...field}
                            placeholder="Father / Mother / Guardian Name *"
                            className="pl-12 h-14 bg-transparent border-0 rounded-none font-bold text-[13px] text-slate-800 dark:text-slate-200 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-slate-400"
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-[10px] px-4 pb-2 text-rose-500 font-bold" />
                    </FormItem>
                  )}
                />

                {/* Class / Course */}
                <FormField
                  control={form.control}
                  name="classCourse"
                  render={({ field }) => (
                    <FormItem className="space-y-0">
                      <FormControl>
                        <div className="relative group">
                          <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none transition-transform duration-300 group-focus-within:scale-110">
                            <GraduationCap className="h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                          </div>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger className="pl-12 h-14 bg-transparent border-0 rounded-none font-bold text-[13px] focus-visible:ring-0 focus-visible:ring-offset-0 focus:ring-0 shadow-none text-slate-800 dark:text-slate-200">
                              <SelectValue placeholder="Select Class or Target Course *" />
                            </SelectTrigger>
                            <SelectContent className="max-h-56">
                              {courseOptions.map((c) => (
                                <SelectItem key={c} value={c} className="text-xs font-medium">
                                  {c}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </FormControl>
                      <FormMessage className="text-[10px] px-4 pb-2 text-rose-500 font-bold" />
                    </FormItem>
                  )}
                />

                {/* Mobile Number */}
                <FormField
                  control={form.control}
                  name="mobile"
                  render={({ field }) => (
                    <FormItem className="space-y-0">
                      <FormControl>
                        <div className="relative group">
                          <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none transition-transform duration-300 group-focus-within:scale-110">
                            <Phone className="h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                          </div>
                          <Input
                            {...field}
                            type="tel"
                            maxLength={10}
                            placeholder="Mobile Number (10 digits) *"
                            className="pl-12 h-14 bg-transparent border-0 rounded-none font-bold text-[13px] text-slate-800 dark:text-slate-200 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-slate-400"
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-[10px] px-4 pb-2 text-rose-500 font-bold" />
                    </FormItem>
                  )}
                />

                {/* State */}
                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem className="space-y-0">
                      <FormControl>
                        <div className="relative group">
                          <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none transition-transform duration-300 group-focus-within:scale-110">
                            <MapPin className="h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                          </div>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger className="pl-12 h-14 bg-transparent border-0 rounded-none font-bold text-[13px] focus-visible:ring-0 focus-visible:ring-offset-0 focus:ring-0 shadow-none text-slate-800 dark:text-slate-200">
                              <SelectValue placeholder="Select State *" />
                            </SelectTrigger>
                            <SelectContent className="max-h-56">
                              {indianStates.map((s) => (
                                <SelectItem key={s} value={s} className="text-xs font-medium">
                                  {s}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </FormControl>
                      <FormMessage className="text-[10px] px-4 pb-2 text-rose-500 font-bold" />
                    </FormItem>
                  )}
                />

                {/* Query / Message Textarea */}
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem className="space-y-0">
                      <FormControl>
                        <div className="relative group">
                          <div className="absolute left-4 top-4 pointer-events-none transition-transform duration-300 group-focus-within:scale-110">
                            <MessageSquare className="h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                          </div>
                          <Textarea
                            {...field}
                            rows={3}
                            placeholder="Your enquiry or question details (optional)..."
                            className="pl-12 pt-3.5 bg-transparent border-0 rounded-none font-bold text-[13px] text-slate-800 dark:text-slate-200 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-slate-400 resize-none min-h-[90px]"
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-[10px] px-4 pb-2 text-rose-500 font-bold" />
                    </FormItem>
                  )}
                />
              </div>

              {/* Fixed Footer */}
              <div className="p-3.5 sm:p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 shrink-0 mt-auto sticky bottom-0 z-20">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  className="h-10 sm:h-11 px-4 rounded-xl font-bold text-xs uppercase border-primary bg-white hover:bg-primary/10 text-slate-700"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-10 sm:h-11 px-6 text-xs font-bold bg-primary text-white rounded-xl hover:bg-primary/90 active:scale-[0.98] group uppercase cursor-pointer"
                >
                  <span>{isSubmitting ? 'Submitting...' : 'Send Enquiry'}</span>
                  <Send className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Success Dialog */}
      <Dialog open={isSuccessOpen} onOpenChange={setIsSuccessOpen}>
        <DialogContent className="rounded-2xl max-w-sm border border-border p-6 bg-white dark:bg-slate-900 text-center">
          <DialogHeader className="space-y-2">
            <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <DialogTitle className="text-xl font-bold text-slate-900 dark:text-slate-100">Enquiry Submitted!</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground leading-relaxed">
              We have received your enquiry. Our admissions team will reach out to you within 24 hours.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button
              onClick={() => {
                setIsSuccessOpen(false);
                onOpenChange(false);
              }}
              className="w-full h-10 rounded-xl font-bold text-xs bg-primary text-white cursor-pointer"
            >
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
