'use client';

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { 
  Building2, 
  GraduationCap, 
  Laptop, 
  Users, 
  MapPin, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  Clock, 
  PhoneCall, 
  Award,
  ChevronRight
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { submitEnrollment } from "@/app/actions/enrollment";
import { enrollmentSchema, type EnrollmentFormValues } from "@/types/enrollment";
import { IDL_BRANCH_OPTIONS, CLASS_OPTIONS, COURSE_OPTIONS } from "@/components/enroll-now-modal";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogTitle } from "@/components/ui/dialog";

export default function EnrollPage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [submittedData, setSubmittedData] = useState<EnrollmentFormValues | null>(null);

  const form = useForm<EnrollmentFormValues>({
    resolver: zodResolver(enrollmentSchema),
    defaultValues: {
      mode: 'Offline',
      studentName: '',
      fatherName: '',
      mobile: '',
      email: '',
      branch: 'Mangol Puri, Delhi-110083',
      branchSlug: 'mangolpuri',
      classLevel: '',
      course: '',
      state: 'Delhi',
      city: 'Delhi',
      pincode: '',
      previousSchool: '',
      remarks: '',
      source: 'Enroll Page',
    },
  });

  const onSubmit: SubmitHandler<EnrollmentFormValues> = async (data) => {
    setIsSubmitting(true);
    try {
      const result = await submitEnrollment(data);
      if (result.success) {
        setSubmittedData(data);
        setIsSuccessOpen(true);
        form.reset({
          mode: 'Offline',
          studentName: '',
          fatherName: '',
          mobile: '',
          email: '',
          branch: 'Mangol Puri, Delhi-110083',
          classLevel: '',
          course: '',
          state: 'Delhi',
          city: 'Delhi',
          pincode: '',
          previousSchool: '',
          remarks: '',
          source: 'Enroll Page',
        });
      } else {
        toast({
          variant: "destructive",
          title: "Submission Failed",
          description: result.message || "Failed to submit enrollment.",
        });
      }
    } catch (err) {
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
    <div className="min-h-screen bg-[#F8FAFD] dark:bg-slate-950 pb-20">
      
      {/* Top Banner / Breadcrumb */}
      <div className="bg-[#091A3A] text-white pt-10 pb-16 px-4 sm:px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-radial from-blue-600/15 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-6xl mx-auto relative z-10">
          
          <div className="flex items-center gap-2 text-xs text-blue-200/80 mb-3">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-white font-medium">Student Enrollment</span>
          </div>

          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/20 text-blue-300 text-xs font-bold tracking-wide uppercase mb-3">
              <Sparkles className="w-3.5 h-3.5 text-[#2864E8]" />
              <span>Admissions Open 2026–27</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Enroll Student at IDL Education
            </h1>
            <p className="mt-3 text-slate-300 text-sm sm:text-base leading-relaxed">
              Reserve a seat for classroom coaching at your preferred branch, online interactive sessions, or hybrid learning. Start your journey toward academic excellence.
            </p>
          </div>

        </div>
      </div>

      {/* Main Content: Form & Highlights */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 -mt-8 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Enrollment Form Card (7 Cols) */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-[0_12px_40px_-10px_rgba(9,26,58,0.08)] border border-slate-200/80 dark:border-slate-800">
            
            <div className="mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                Student Enrollment Form
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                Please fill in all mandatory details marked with an asterisk (*).
              </p>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                
                {/* 1. Mode Selector */}
                <FormField
                  control={form.control}
                  name="mode"
                  render={({ field }) => (
                    <FormItem className="space-y-1.5">
                      <FormLabel className="text-[12.5px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                        Select Learning Mode *
                      </FormLabel>
                      <FormControl>
                        <div className="grid grid-cols-3 gap-2.5">
                          {[
                            { value: 'Offline', label: 'Offline', sub: 'Classroom Branch', icon: Building2 },
                            { value: 'Online', label: 'Online', sub: 'Live Digital', icon: Laptop },
                            { value: 'Hybrid', label: 'Hybrid', sub: 'Both Combined', icon: Users },
                          ].map((item) => {
                            const isSelected = field.value === item.value;
                            const IconComponent = item.icon;
                            return (
                              <button
                                key={item.value}
                                type="button"
                                onClick={() => {
                                  field.onChange(item.value);
                                  if (item.value === 'Online') {
                                    form.setValue('branch', 'Online / Digital Campus (Pan India)');
                                    form.setValue('branchSlug', 'online');
                                  }
                                }}
                                className={cn(
                                  "py-2.5 px-3 rounded-xl border text-center transition-all duration-200 cursor-pointer flex flex-col items-center justify-center gap-1",
                                  isSelected 
                                    ? "border-[#2864E8] bg-blue-50/80 dark:bg-blue-950/40 text-[#173568] dark:text-blue-300 shadow-xs ring-1 ring-[#2864E8]/30" 
                                    : "border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 text-slate-600 dark:text-slate-400 hover:border-slate-300"
                                )}
                              >
                                <div className="flex items-center gap-1.5">
                                  <IconComponent className={cn("w-4 h-4", isSelected ? "text-[#2864E8]" : "text-slate-400")} />
                                  <span className="text-[13.5px] font-bold tracking-tight">{item.label}</span>
                                </div>
                                <span className="text-[10.5px] text-slate-500 dark:text-slate-400 font-medium">{item.sub}</span>
                              </button>
                            );
                          })}
                        </div>
                      </FormControl>
                      <FormMessage className="text-[11.5px] font-medium text-rose-500" />
                    </FormItem>
                  )}
                />

                {/* 2. Branch */}
                <FormField
                  control={form.control}
                  name="branch"
                  render={({ field }) => (
                    <FormItem className="space-y-1">
                      <FormLabel className="text-[12.5px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                        Select Preferred Branch / Center *
                      </FormLabel>
                      <Select 
                        onValueChange={(val) => {
                          field.onChange(val);
                          const lower = val.toLowerCase();
                          if (lower.includes('mangol')) form.setValue('branchSlug', 'mangolpuri');
                          else if (lower.includes('budh')) form.setValue('branchSlug', 'budh-vihar');
                          else if (lower.includes('krishan')) form.setValue('branchSlug', 'krishan-vihar');
                          else if (lower.includes('mukherjee')) form.setValue('branchSlug', 'mukherjee-nagar');
                          else if (lower.includes('rohini')) form.setValue('branchSlug', 'rohini');
                          else if (lower.includes('online')) form.setValue('branchSlug', 'online');
                        }} 
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="h-11 rounded-xl border-slate-200 dark:border-slate-800 bg-[#F8FAFD] dark:bg-slate-900/60 text-sm">
                            <div className="flex items-center gap-2 truncate">
                              <MapPin className="w-4 h-4 text-[#2864E8] shrink-0" />
                              <SelectValue placeholder="Select IDL Branch" />
                            </div>
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="max-h-[260px] z-[120]">
                          {IDL_BRANCH_OPTIONS.map((b) => (
                            <SelectItem key={b.id} value={b.label} className="text-sm py-2 cursor-pointer">
                              <div className="flex flex-col">
                                <span className="font-semibold text-slate-900 dark:text-white">{b.name}</span>
                                <span className="text-xs text-slate-500 dark:text-slate-400">{b.label}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-[11.5px] font-medium text-rose-500" />
                    </FormItem>
                  )}
                />

                {/* 3. Student Name & Father's Name */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="studentName"
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <FormLabel className="text-[12.5px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                          Student Full Name *
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Student Name"
                            {...field}
                            className="h-11 rounded-xl border-slate-200 dark:border-slate-800 bg-[#F8FAFD] dark:bg-slate-900/60 text-sm"
                          />
                        </FormControl>
                        <FormMessage className="text-[11.5px] font-medium text-rose-500" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="fatherName"
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <FormLabel className="text-[12.5px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                          Father / Guardian Name *
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Father's Name"
                            {...field}
                            className="h-11 rounded-xl border-slate-200 dark:border-slate-800 bg-[#F8FAFD] dark:bg-slate-900/60 text-sm"
                          />
                        </FormControl>
                        <FormMessage className="text-[11.5px] font-medium text-rose-500" />
                      </FormItem>
                    )}
                  />
                </div>

                {/* 4. Mobile & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="mobile"
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <FormLabel className="text-[12.5px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                          Mobile Number *
                        </FormLabel>
                        <FormControl>
                          <div className="flex items-center rounded-xl border border-slate-200 dark:border-slate-800 bg-[#F8FAFD] dark:bg-slate-900/60 overflow-hidden">
                            <span className="px-3 text-xs font-bold text-slate-500 border-r border-slate-200 dark:border-slate-800">+91</span>
                            <Input
                              type="tel"
                              maxLength={10}
                              placeholder="10-digit mobile"
                              {...field}
                              className="h-11 border-0 shadow-none text-sm bg-transparent focus-visible:ring-0"
                            />
                          </div>
                        </FormControl>
                        <FormMessage className="text-[11.5px] font-medium text-rose-500" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <FormLabel className="text-[12.5px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                          Email (Optional)
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="student@example.com"
                            {...field}
                            className="h-11 rounded-xl border-slate-200 dark:border-slate-800 bg-[#F8FAFD] dark:bg-slate-900/60 text-sm"
                          />
                        </FormControl>
                        <FormMessage className="text-[11.5px] font-medium text-rose-500" />
                      </FormItem>
                    )}
                  />
                </div>

                {/* 5. Class & Course */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="classLevel"
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <FormLabel className="text-[12.5px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                          Class / Grade *
                        </FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-11 rounded-xl border-slate-200 dark:border-slate-800 bg-[#F8FAFD] dark:bg-slate-900/60 text-sm">
                              <SelectValue placeholder="Select Class" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="max-h-[240px] z-[120]">
                            {CLASS_OPTIONS.map((c) => (
                              <SelectItem key={c} value={c} className="text-sm py-1.5 cursor-pointer">
                                {c}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage className="text-[11.5px] font-medium text-rose-500" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="course"
                    render={({ field }) => (
                      <FormItem className="space-y-1">
                        <FormLabel className="text-[12.5px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                          Target Course / Stream *
                        </FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-11 rounded-xl border-slate-200 dark:border-slate-800 bg-[#F8FAFD] dark:bg-slate-900/60 text-sm">
                              <SelectValue placeholder="Select Course" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="max-h-[240px] z-[120]">
                            {COURSE_OPTIONS.map((c) => (
                              <SelectItem key={c} value={c} className="text-sm py-1.5 cursor-pointer">
                                {c}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage className="text-[11.5px] font-medium text-rose-500" />
                      </FormItem>
                    )}
                  />
                </div>

                {/* 6. Current School */}
                <FormField
                  control={form.control}
                  name="previousSchool"
                  render={({ field }) => (
                    <FormItem className="space-y-1">
                      <FormLabel className="text-[12.5px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                        Current School / Institution (Optional)
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. Modern Public School, KV, DPS"
                          {...field}
                          className="h-11 rounded-xl border-slate-200 dark:border-slate-800 bg-[#F8FAFD] dark:bg-slate-900/60 text-sm"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {/* Submit CTA */}
                <div className="pt-2">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-12 rounded-[5px] font-bold text-sm tracking-wide bg-[#2864E8] hover:bg-[#1E4ED8] text-white shadow-[0_4px_16px_rgba(40,100,232,0.3)] hover:shadow-[0_6px_20px_rgba(40,100,232,0.4)] transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <span className="inline-flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Submitting Enrollment...
                      </span>
                    ) : (
                      <>
                        <span>Submit Enrollment Now</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </Button>
                </div>

                <p className="text-[11.5px] text-center text-slate-500 dark:text-slate-400 font-medium flex items-center justify-center gap-1.5 pt-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>100% Secure & Confidential. Our branch counsellor will contact you within 2 hours.</span>
                </p>

              </form>
            </Form>

          </div>

          {/* Right Column: Why Enroll at IDL & Branch Info (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Highlights Card */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl p-6 sm:p-7 shadow-[0_8px_30px_-8px_rgba(9,26,58,0.06)] border border-slate-200/80 dark:border-slate-800">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-[#2864E8]" />
                <span>Why Enroll at IDL Education?</span>
              </h3>
              
              <div className="mt-5 space-y-4">
                {[
                  {
                    title: "Experienced Faculty Mentors",
                    desc: "Learn from subject specialists with 10+ years of teaching excellence in CBSE, JEE, NEET & CUET."
                  },
                  {
                    title: "Small Batch Sizes & Personal Focus",
                    desc: "Individual doubt clearing sessions, weekly mock tests, and rigorous tracking of every student's growth."
                  },
                  {
                    title: "Modern Smart Classrooms",
                    desc: "Interactive smartboard technology, digital notes, and fully air-conditioned student-friendly spaces."
                  },
                  {
                    title: "Flexible Learning Modes",
                    desc: "Choose between Classroom coaching at your local branch, Interactive Live Online, or Hybrid flexibility."
                  }
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-[#2864E8] flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">{item.title}</h4>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Helpline Card */}
            <div className="bg-gradient-to-br from-[#173568] to-[#091A3A] rounded-2xl sm:rounded-3xl p-6 text-white shadow-md">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                  <PhoneCall className="w-5 h-5 text-[#D9A441]" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Need Help Enrolling?</h4>
                  <p className="text-xs text-slate-300">Talk directly to our central admission desk</p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
                <a href="tel:8860040010" className="text-lg font-extrabold text-[#D9A441] hover:underline">
                  +91 88600 40010
                </a>
                <span className="text-[11px] text-slate-300">Mon - Sat: 8 AM - 8:30 PM</span>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* Success Dialog */}
      <Dialog open={isSuccessOpen} onOpenChange={setIsSuccessOpen}>
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
              <span className="text-slate-400 font-medium">Mode:</span>
              <span className="font-bold text-blue-600">{submittedData?.mode}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400 font-medium">Class:</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{submittedData?.classLevel}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400 font-medium">Branch:</span>
              <span className="font-bold text-slate-800 dark:text-slate-200 truncate max-w-[200px]">{submittedData?.branch}</span>
            </div>
          </div>
          <DialogFooter className="mt-5">
            <Button 
              onClick={() => setIsSuccessOpen(false)}
              className="w-full rounded-[5px] bg-[#2864E8] text-white font-semibold"
            >
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}
