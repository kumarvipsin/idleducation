'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { User, Users, GraduationCap, Phone, Globe, MapPin, Sparkles, Send, CheckCircle, Award, Trophy, IndianRupee, Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { registerForScholarship } from "@/app/actions";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";
import { format, lastDayOfMonth } from "date-fns";

const scholarshipSchema = z.object({
  studentName: z.string().min(2, { message: "Name must be at least 2 characters." }),
  guardianName: z.string().min(2, { message: "Guardian name is required." }),
  class: z.string().min(1, { message: "Please select a class." }),
  mobile: z.string().regex(/^\d{10}$/, { message: "Please enter a valid 10-digit mobile number." }),
  country: z.string().min(1, { message: "Please select a country." }),
  state: z.string().min(1, { message: "Please select a state." }),
});

type ScholarshipFormValues = z.infer<typeof scholarshipSchema>;

const scholarshipClasses = ["Class 4", "Class 5", "Class 6", "Class 7", "Class 8", "Class 9", "Class 10", "Class 11", "Class 12"];

const indianStates = [
  "Andaman and Nicobar Islands", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar",
  "Chandigarh", "Chhattisgarh", "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Goa",
  "Gujarat", "Haryana", "Himachal Pradesh", "Jammu and Kashmir", "Jharkhand", "Karnataka",
  "Kerala", "Ladakh", "Lakshadweep", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya",
  "Mizoram", "Nagaland", "Odisha", "Puducherry", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
];

const countries = [
  "India", "United States", "United Kingdom", "Canada", "Australia", "Other"
];

export default function ScholarshipPage() {
  const { toast } = useToast();
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [examDates, setExamDates] = useState({ sat: '', sun: '', monthYear: '' });

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
    const today = new Date();
    const lastDay = lastDayOfMonth(today);
    let lastSunday = new Date(lastDay);
    let lastSaturday = new Date(lastDay);

    while (lastSunday.getDay() !== 0) {
      lastSunday.setDate(lastSunday.getDate() - 1);
    }
    
    lastSaturday.setDate(lastSunday.getDate() - 1);
    
    if (lastDay.getDay() === 6) {
      lastSaturday = lastDay;
      lastSunday = new Date(lastDay);
      lastSunday.setDate(lastDay.getDate() - 1);
    }

    setExamDates({
      sat: format(lastSaturday, 'do'),
      sun: format(lastSunday, 'do'),
      monthYear: format(today, 'MMMM yyyy')
    });
  }, []);

  const onSubmit: SubmitHandler<ScholarshipFormValues> = async (data) => {
    try {
      const result = await registerForScholarship(data);
      if (result.success) {
        setIsSuccessOpen(true);
        form.reset();
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.message || "Something went wrong. Please try again.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
      });
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#F8F7FF] dark:bg-slate-950 relative selection:bg-primary/10">
      {/* Subtle Background Texture */}
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none" />
      
      {/* Floating Decorative Elements */}
      <div className="absolute top-[10%] left-[5%] w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-pulse pointer-events-none" />
      <div className="absolute bottom-[10%] right-[5%] w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse pointer-events-none" />
      
      <div className="container mx-auto px-4 md:px-6 py-12 lg:py-20 relative z-10">
        <div className="max-w-md mx-auto space-y-10">
          
          {/* Header Section */}
          <div className="text-center space-y-6">
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center gap-4"
            >
                <div className="bg-primary/10 p-4 rounded-full border border-primary/20 shadow-sm transition-all duration-500 hover:scale-110">
                    <Award className="w-8 h-8 text-primary animate-ring" />
                </div>
            </motion.div>
            
            <div className="space-y-3">
                <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tighter leading-tight text-balance">
                    Scholarship &{' '}
                    <span className="relative inline-block">
                        <span className="relative z-10 text-primary">Admission Test</span>
                        <div className="absolute -bottom-1 left-0 w-full h-2 z-0">
                            <svg viewBox="0 0 100 15" preserveAspectRatio="none" className="w-full h-full text-blue-500 fill-none stroke-current stroke-[10] opacity-70">
                                <path d="M0,15 Q50,5 100,15" />
                            </svg>
                        </div>
                    </span>
                </h1>
                <p className="max-w-xl mx-auto text-slate-600 dark:text-slate-400 text-[11px] font-bold tracking-tight leading-relaxed">
                    Get Upto 70% Scholarship On Admissions Test For Academic Excellence.
                </p>
            </div>
          </div>

          {/* Highlights Section */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Card className="bg-white/60 backdrop-blur-sm border-slate-200 dark:border-slate-800 shadow-sm hover:border-primary/20 transition-colors">
                  <CardContent className="p-3 flex flex-col items-center text-center gap-1">
                      <Trophy className="w-5 h-5 text-yellow-500" />
                      <p className="text-[9px] font-black text-primary uppercase leading-tight">₹50K Cash<br/>Rewards</p>
                  </CardContent>
              </Card>
              <Card className="bg-white/60 backdrop-blur-sm border-slate-200 dark:border-slate-800 shadow-sm hover:border-primary/20 transition-colors">
                  <CardContent className="p-3 flex flex-col items-center text-center gap-1">
                      <IndianRupee className="w-5 h-5 text-blue-500" />
                      <p className="text-[9px] font-black text-primary uppercase leading-tight">₹75K Merit<br/>Fund</p>
                  </CardContent>
              </Card>
              <Card className="bg-white/60 backdrop-blur-sm border-slate-200 dark:border-slate-800 shadow-sm hover:border-primary/20 transition-colors">
                  <CardContent className="p-3 flex flex-col items-center text-center gap-1">
                      <Calendar className="w-5 h-5 text-green-500" />
                      <p className="text-[9px] font-black text-primary uppercase leading-tight">{examDates.sat} & {examDates.sun}<br/>{examDates.monthYear.split(' ')[0]}</p>
                  </CardContent>
              </Card>
          </div>

          {/* Premium Form Card */}
          <Card className="shadow-none rounded-2xl border-2 border-primary/10 bg-white dark:bg-slate-900 overflow-hidden animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="px-6 py-4 text-left border-b border-slate-100 dark:border-slate-800 space-y-0.5">
              <h2 className="text-2xl font-extrabold text-primary tracking-tighter text-left">
                Scholarship Registration
              </h2>
              <p className="text-[13px] font-extrabold text-muted-foreground text-left">
                IDL National Talent Reward Exam • Up to 100% Scholarship
              </p>
            </div>
            <CardContent className="p-0">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col">
                  
                  <div className="grid grid-cols-1 divide-y divide-slate-100 dark:divide-slate-800">
                    
                    {/* Row 1: Student & Guardian */}
                    <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100 dark:divide-slate-800">
                      <FormField
                        control={form.control}
                        name="studentName"
                        render={({ field }) => (
                          <FormItem className="space-y-0">
                            <FormControl>
                              <div className="relative group h-full">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none transition-transform duration-300 group-focus-within:scale-110">
                                  <User className="h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                                </div>
                                <Input placeholder="Student's Name *" {...field} className="pl-12 h-14 bg-transparent border-0 rounded-none font-bold text-[13px] transition-all focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-slate-400" />
                              </div>
                            </FormControl>
                            <FormMessage className="text-[10px] px-4 pb-2" />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="guardianName"
                        render={({ field }) => (
                          <FormItem className="space-y-0">
                            <FormControl>
                              <div className="relative group h-full">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none transition-transform duration-300 group-focus-within:scale-110">
                                  <Users className="h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                                </div>
                                <Input placeholder="Guardian's Name *" {...field} className="pl-12 h-14 bg-transparent border-0 rounded-none font-bold text-[13px] transition-all focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-slate-400" />
                              </div>
                            </FormControl>
                            <FormMessage className="text-[10px] px-4 pb-2" />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Row 2: Class & Mobile */}
                    <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100 dark:divide-slate-800">
                      <FormField
                        control={form.control}
                        name="class"
                        render={({ field }) => (
                          <FormItem className="space-y-0">
                            <div className="relative group h-full">
                              <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none z-10">
                                <GraduationCap className="h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                              </div>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger className="pl-12 h-14 bg-transparent border-0 rounded-none font-bold text-[13px] shadow-none focus:ring-0 focus:ring-offset-0">
                                    <SelectValue placeholder="Select Class *" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {scholarshipClasses.map(c => <SelectItem key={c} value={c} className="text-xs font-bold">{c}</SelectItem>)}
                                </SelectContent>
                              </Select>
                            </div>
                            <FormMessage className="text-[10px] px-4 pb-2" />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="mobile"
                        render={({ field }) => (
                          <FormItem className="space-y-0">
                            <FormControl>
                              <div className="relative group h-full">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none transition-transform duration-300 group-focus-within:scale-110">
                                  <Phone className="h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                                </div>
                                <Input type="tel" placeholder="Mobile Number *" {...field} className="pl-12 h-14 bg-transparent border-0 rounded-none font-bold text-[13px] transition-all focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-slate-400" />
                              </div>
                            </FormControl>
                            <FormMessage className="text-[10px] px-4 pb-2" />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Row 3: Country & State */}
                    <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100 dark:divide-slate-800">
                      <FormField
                        control={form.control}
                        name="country"
                        render={({ field }) => (
                          <FormItem className="space-y-0">
                            <div className="relative group h-full">
                              <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none z-10">
                                <Globe className="h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                              </div>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger className="pl-12 h-14 bg-transparent border-0 rounded-none font-bold text-[13px] shadow-none focus:ring-0 focus:ring-offset-0">
                                    <SelectValue placeholder="Select Country *" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {countries.map(c => <SelectItem key={c} value={c} className="text-xs font-bold">{c}</SelectItem>)}
                                </SelectContent>
                              </Select>
                            </div>
                            <FormMessage className="text-[10px] px-4 pb-2" />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="state"
                        render={({ field }) => (
                          <FormItem className="space-y-0">
                            <div className="relative group h-full">
                              <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none z-10">
                                <MapPin className="h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                              </div>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger className="pl-12 h-14 bg-transparent border-0 rounded-none font-bold text-[13px] shadow-none focus:ring-0 focus:ring-offset-0">
                                    <SelectValue placeholder="Select State *" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {indianStates.map(s => <SelectItem key={s} value={s} className="text-xs font-bold">{s}</SelectItem>)}
                                </SelectContent>
                              </Select>
                            </div>
                            <FormMessage className="text-[10px] px-4 pb-2" />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* Footer / Submit Button */}
                  <div className="p-6 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800">
                    <Button type="submit" className="w-full h-12 text-[11px] font-black bg-primary hover:bg-primary/90 text-white rounded-[8px] uppercase active:scale-[0.98] group cursor-pointer" disabled={form.formState.isSubmitting}>
                      {form.formState.isSubmitting ? 'PROCESSING...' : 'SUBMIT REGISTRATION'}
                      <Send className="ml-2 h-3.5 w-3.5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={isSuccessOpen} onOpenChange={setIsSuccessOpen}>
        <DialogContent className="rounded-[2rem] max-w-sm border-none shadow-2xl p-8">
          <DialogHeader>
            <div className="flex justify-center mb-6">
              <div className="bg-green-100 p-4 rounded-3xl">
                <CheckCircle className="w-12 h-12 text-green-500" />
              </div>
            </div>
            <DialogTitle className="text-center text-2xl font-black tracking-tight text-slate-900">Registration Success!</DialogTitle>
            <DialogDescription className="text-center font-bold text-xs text-slate-600 leading-relaxed pt-2 px-2">
              You've successfully registered for the Talent Hunt. Our team will contact you soon with the test schedule.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-6">
            <Button onClick={() => setIsSuccessOpen(false)} className="w-full h-12 rounded-[8px] font-black text-[10px] uppercase tracking-widest shadow-lg shadow-primary/10">
              Close Workspace
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
