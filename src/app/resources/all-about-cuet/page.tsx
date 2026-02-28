
'use client';

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
    Sparkles, 
    ArrowRight, 
    CheckCircle2, 
    Building, 
    Globe, 
    GraduationCap, 
    Repeat, 
    Calendar, 
    Info, 
    Edit, 
    Clock, 
    Ticket, 
    Monitor, 
    BarChart3, 
    Send,
    MapPin,
    Plus,
    Minus,
    User,
    Mail,
    Phone,
    X,
    ShieldCheck,
    Trophy,
    Award,
    Languages,
    Zap
} from "lucide-react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { submitStudentEnquiry } from "@/app/actions";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import Link from "next/link";

const cuetInquirySchema = z.object({
  fullName: z.string().min(2, "Full name is required."),
  email: z.string().email("Invalid email address."),
  mobile: z.string().regex(/^\d{10}$/, "Invalid 10-digit mobile number."),
  targetYear: z.string().min(1, "Target year is required."),
  state: z.string().min(1, "State is required."),
  city: z.string().min(1, "City is required."),
  preferredUniversity: z.string().min(1, "University is required."),
  stream: z.string().min(1, "Stream is required."),
});

type CuetInquiryValues = z.infer<typeof cuetInquirySchema>;

const indianStates = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Delhi", "Jammu and Kashmir", "Ladakh"
];

const targetYears = ["2026", "2027", "2028"];
const streams = ["Science", "Commerce", "Arts/Humanities", "Other"];
const universities = ["University of Delhi", "Banaras Hindu University", "Jawaharlal Nehru University", "Jamia Millia Islamia", "Aligarh Hindu University", "Other"];

const infoGrid = [
    {
        title: "CUET Full Form",
        value: "Common University Entrance Test",
        icon: <GraduationCap className="w-5 h-5" />
    },
    {
        title: "Conducting Body",
        value: "National Testing Agency (NTA)",
        icon: <Building className="w-5 h-5" />
    },
    {
        title: "Exam Frequency",
        value: "Once a year",
        icon: <Repeat className="w-5 h-5" />
    },
    {
        title: "Exam Mode",
        value: "Computer Based Test (CBT)",
        icon: <Monitor className="w-5 h-5" />
    },
    {
        title: "Questions Type",
        value: "Multiple Choice Questions (MCQs)",
        icon: <Edit className="w-5 h-5" />
    },
    {
        title: "Marking Scheme",
        value: "+5 for Correct, -1 for Wrong",
        icon: <BarChart3 className="w-5 h-5" />
    }
];

export default function AllAboutCuetPage() {
  const { toast } = useToast();
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);

  const form = useForm<CuetInquiryValues>({
    resolver: zodResolver(cuetInquirySchema),
    defaultValues: {
      fullName: '',
      email: '',
      mobile: '',
      targetYear: '',
      state: '',
      city: '',
      preferredUniversity: '',
      stream: '',
    },
  });

  const onSubmit: SubmitHandler<CuetInquiryValues> = async (data) => {
    const result = await submitStudentEnquiry({
        studentName: data.fullName,
        guardianName: "N/A",
        classCourse: `CUET ${data.targetYear} - ${data.stream}`,
        mobile: data.mobile,
        state: data.state,
        message: `Preferred University: ${data.preferredUniversity}, City: ${data.city}, Email: ${data.email}`
    } as any);

    if (result.success) {
      setIsSuccessOpen(true);
      form.reset();
    } else {
      toast({ variant: "destructive", title: "Error", description: result.message });
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#FAFAFA] dark:bg-slate-950 selection:bg-primary/10">
      
      {/* 1. Hero Section */}
      <section className="relative w-full py-16 md:py-24 bg-white dark:bg-slate-900 overflow-hidden">
        <div className="container mx-auto px-4 md:px-6 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
                <div className="space-y-8 animate-fade-in-up">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 border border-red-100 text-red-600 text-[10px] font-black uppercase tracking-[0.2em]">
                            <Sparkles className="w-3 h-3" />
                            CUET UG 2026 Complete Guide
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-slate-900 dark:text-white leading-[0.9] uppercase text-left">
                            ALL ABOUT <br/>
                            <span className="text-red-600">CUET (UG)</span>
                        </h1>
                        <p className="text-slate-600 dark:text-slate-400 font-bold text-sm md:text-lg leading-relaxed max-w-lg text-left">
                            Master every detail of the nation's biggest entrance exam. From registration to top college shortlisting, your journey starts here.
                        </p>
                    </div>
                    <div className="flex gap-4">
                        <Button asChild size="lg" className="rounded-xl bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-widest text-[10px] h-12 px-8 shadow-xl shadow-red-600/20">
                            <Link href="#enquiry">Book Free Counselling</Link>
                        </Button>
                    </div>
                </div>

                <div className="relative aspect-video lg:aspect-square flex items-center justify-center animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                    <div className="relative w-[300px] h-[300px] md:w-[450px] md:h-[450px] rounded-full overflow-hidden bg-white shadow-none border-[12px] border-slate-50">
                        <Image src="/cuet.png" alt="CUET Portal" fill className="object-contain p-10" />
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* 2. Key Facts Stripe */}
      <section className="w-full py-12 bg-primary text-white">
          <div className="container mx-auto px-4 md:px-6">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
                  {infoGrid.map((info, i) => (
                      <div key={i} className="flex flex-col items-center text-center gap-2">
                          <div className="p-2 bg-white/10 rounded-lg text-white/60 mb-1">{info.icon}</div>
                          <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest leading-none">{info.title}</p>
                          <p className="text-[11px] font-black uppercase tracking-tight">{info.value}</p>
                      </div>
                  ))}
              </div>
          </div>
      </section>

      {/* 3. Deep Dive Sections */}
      <div className="space-y-0">
          
          {/* Section: Introduction */}
          <section className="w-full py-20 bg-white dark:bg-slate-950 border-b">
              <div className="container mx-auto px-4 md:px-6">
                  <div className="max-w-4xl mx-auto space-y-8">
                      <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tight text-left">Introduction to CUET</h2>
                      <p className="text-slate-600 dark:text-slate-400 font-bold text-base leading-relaxed text-left">
                          The Common University Entrance Test (CUET) was introduced by the Ministry of Education to provide a single-window opportunity to students seeking admission in any of the Central Universities across the country. It is a major reform in the higher education sector aimed at reducing the burden on students and providing an equal platform regardless of their regional board backgrounds.
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                          <div className="p-6 bg-red-50 rounded-2xl border border-red-100">
                              <h4 className="font-black text-red-600 uppercase text-xs mb-3 tracking-widest">Eligibility Criteria</h4>
                              <p className="text-xs text-red-900/70 font-bold leading-relaxed">Any candidate who has passed Class 12 or equivalent is eligible. There is no age limit for appearing in CUET (UG), though university-specific age criteria might apply.</p>
                          </div>
                          <div className="p-6 bg-blue-50 rounded-2xl border border-blue-100">
                              <h4 className="font-black text-blue-600 uppercase text-xs mb-3 tracking-widest">Purpose</h4>
                              <p className="text-xs text-blue-900/70 font-bold leading-relaxed">To eliminate high cut-off pressure and provide a fair chance to every student to secure a seat in premier institutions like DU, JNU, and BHU.</p>
                          </div>
                      </div>
                  </div>
              </div>
          </section>

          {/* Section: Exam Pattern */}
          <section className="w-full py-20 bg-[#FBFBFB] dark:bg-slate-900">
              <div className="container mx-auto px-4 md:px-6">
                  <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
                      <div className="order-2 lg:order-1 space-y-8 text-left">
                          <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Detailed Exam Pattern</h2>
                          <div className="space-y-4">
                              {[
                                  { title: "Section 1 - Languages", desc: "Choose from 13 languages in 1A and 20 in 1B. Focus on Reading Comprehension, Literary Aptitude, and Vocabulary." },
                                  { title: "Section 2 - Domains", desc: "Select up to 27 domain-specific subjects. The syllabus is strictly based on Class 12 NCERT textbooks." },
                                  { title: "Section 3 - General Test", desc: "Covers General Knowledge, Current Affairs, Mental Ability, Numerical Ability, and Logical Reasoning." }
                              ].map((item, i) => (
                                  <div key={i} className="flex gap-4 p-4 rounded-xl hover:bg-white transition-all border border-transparent hover:border-border">
                                      <div className="font-black text-red-600 opacity-20 text-2xl">0{i+1}</div>
                                      <div className="space-y-1">
                                          <h4 className="font-black text-foreground uppercase text-[13px] tracking-tight">{item.title}</h4>
                                          <p className="text-xs text-muted-foreground font-bold leading-relaxed">{item.desc}</p>
                                      </div>
                                  </div>
                              ))}
                          </div>
                      </div>
                      <div className="order-1 lg:order-2 flex justify-center">
                          <div className="relative w-[300px] h-[300px] md:w-[450px] md:h-[450px]">
                              <Image src="/cuet2.png" alt="Exam Pattern Structure" fill className="object-contain" />
                          </div>
                      </div>
                  </div>
              </div>
          </section>

          {/* Section: Form */}
          <section id="enquiry" className="w-full py-20 bg-white dark:bg-slate-950">
              <div className="container mx-auto px-4 md:px-6">
                  <div className="max-w-4xl mx-auto">
                      <div className="text-center mb-12 space-y-4">
                          <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Need Expert Help?</h2>
                          <p className="text-slate-600 dark:text-slate-400 font-bold text-sm">Fill out the form below to receive a personalized CUET roadmap and study kit.</p>
                      </div>
                      <Card className="rounded-[2rem] border-2 border-primary/5 shadow-2xl overflow-hidden">
                          <CardContent className="p-8 md:p-12">
                              <Form {...form}>
                                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 text-left">
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                          <FormField control={form.control} name="fullName" render={({ field }) => (
                                              <FormItem><FormLabel className="font-black text-[10px] uppercase tracking-widest text-slate-400">Full Name</FormLabel><FormControl><Input placeholder="Your full name" {...field} className="h-12 rounded-xl bg-slate-50 border-slate-100 font-bold"/></FormControl><FormMessage /></FormItem>
                                          )} />
                                          <FormField control={form.control} name="mobile" render={({ field }) => (
                                              <FormItem><FormLabel className="font-black text-[10px] uppercase tracking-widest text-slate-400">Phone</FormLabel><FormControl><Input placeholder="10-digit number" {...field} maxLength={10} className="h-12 rounded-xl bg-slate-50 border-slate-100 font-bold"/></FormControl><FormMessage /></FormItem>
                                          )} />
                                      </div>
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                          <FormField control={form.control} name="email" render={({ field }) => (
                                              <FormItem><FormLabel className="font-black text-[10px] uppercase tracking-widest text-slate-400">Email</FormLabel><FormControl><Input type="email" placeholder="example@gmail.com" {...field} className="h-12 rounded-xl bg-slate-50 border-slate-100 font-bold"/></FormControl><FormMessage /></FormItem>
                                          )} />
                                          <FormField control={form.control} name="targetYear" render={({ field }) => (
                                              <FormItem>
                                                  <FormLabel className="font-black text-[10px] uppercase tracking-widest text-slate-400">Targeting</FormLabel>
                                                  <Select onValueChange={field.onChange} value={field.value}>
                                                      <FormControl><SelectTrigger className="h-12 rounded-xl bg-slate-50 border-slate-100 font-bold"><SelectValue placeholder="Year" /></SelectTrigger></FormControl>
                                                      <SelectContent>{targetYears.map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}</SelectContent>
                                                  </Select>
                                              </FormItem>
                                          )} />
                                      </div>
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                          <FormField control={form.control} name="state" render={({ field }) => (
                                              <FormItem>
                                                  <FormLabel className="font-black text-[10px] uppercase tracking-widest text-slate-400">State</FormLabel>
                                                  <Select onValueChange={field.onChange} value={field.value}>
                                                      <FormControl><SelectTrigger className="h-12 rounded-xl bg-slate-50 border-slate-100 font-bold"><SelectValue placeholder="State" /></SelectTrigger></FormControl>
                                                      <SelectContent>{indianStates.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                                                  </Select>
                                              </FormItem>
                                          )} />
                                          <FormField control={form.control} name="city" render={({ field }) => (
                                              <FormItem><FormLabel className="font-black text-[10px] uppercase tracking-widest text-slate-400">City</FormLabel><FormControl><Input placeholder="Current city" {...field} className="h-12 rounded-xl bg-slate-50 border-slate-100 font-bold"/></FormControl><FormMessage /></FormItem>
                                          )} />
                                      </div>
                                      <Button type="submit" className="w-full h-14 rounded-2xl bg-primary text-white font-black uppercase tracking-[0.3em] text-xs shadow-xl shadow-primary/30" disabled={form.formState.isSubmitting}>
                                          {form.formState.isSubmitting ? 'Submitting Data...' : 'Get Personalized Roadmap'}
                                      </Button>
                                  </form>
                              </Form>
                          </CardContent>
                      </Card>
                  </div>
              </div>
          </section>
      </div>

      {/* Success Dialog */}
      <Dialog open={isSuccessOpen} onOpenChange={setIsSuccessOpen}>
        <DialogContent className="rounded-3xl max-w-sm">
          <DialogHeader>
            <div className="flex justify-center mb-4">
              <div className="bg-emerald-50 p-4 rounded-full"><CheckCircle2 className="w-12 h-12 text-emerald-500" /></div>
            </div>
            <DialogTitle className="text-center text-2xl font-black tracking-tight">Sync Complete!</DialogTitle>
            <DialogDescription className="text-center font-bold text-xs text-slate-500 leading-relaxed pt-2 px-2">
              Your academic interest has been successfully indexed. Our nodal counsellor will contact you shortly.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-6">
            <Button onClick={() => setIsSuccessOpen(false)} className="w-full rounded-xl h-12 font-black text-[10px] uppercase tracking-widest bg-primary text-white">
              Close Workspace
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
