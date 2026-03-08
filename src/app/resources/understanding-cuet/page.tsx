'use client';

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
    User,
    Mail,
    Phone,
    ShieldCheck,
    Zap,
    Landmark
} from "lucide-react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { submitStudentEnquiry } from "@/app/actions";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";

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

const timelineData = [
    {
        number: "01",
        title: "Conducting Authority",
        items: [
            { icon: <Building className="w-3.5 h-3.5" />, text: "Conducted by: NTA" },
            { icon: <Globe className="w-3.5 h-3.5" />, text: "National-level test" },
            { icon: <GraduationCap className="w-3.5 h-3.5" />, text: "UG admissions" }
        ],
        accentColor: "group-hover:border-blue-600",
        numColor: "group-hover:text-blue-600/10"
    },
    {
        number: "02",
        title: "Frequency",
        items: [
            { icon: <Repeat className="w-3.5 h-3.5" />, text: "Once Every Year" },
            { icon: <CheckCircle2 className="w-3.5 h-3.5" />, text: "Annual intake" }
        ],
        accentColor: "group-hover:border-indigo-600",
        numColor: "group-hover:text-indigo-600/10"
    },
    {
        number: "03",
        title: "Exam Month",
        items: [
            { icon: <Calendar className="w-3.5 h-3.5" />, text: "May – June" },
            { icon: <Info className="w-3.5 h-3.5" />, text: "Extended if needed" }
        ],
        accentColor: "group-hover:border-violet-600",
        numColor: "group-hover:text-violet-600/10"
    },
    {
        number: "04",
        title: "Timeline",
        items: [
            { icon: <Edit className="w-3.5 h-3.5" />, text: "Release: Feb – Mar" },
            { icon: <Clock className="w-3.5 h-3.5" />, text: "Last Date: Apr" }
        ],
        accentColor: "group-hover:border-red-600",
        numColor: "group-hover:text-red-600/10"
    },
    {
        number: "05",
        title: "Admit Card",
        items: [
            { icon: <Ticket className="w-3.5 h-3.5" />, text: "3–7 days before" },
            { icon: <Globe className="w-3.5 h-3.5" />, text: "Download online" }
        ],
        accentColor: "group-hover:border-rose-600",
        numColor: "group-hover:text-rose-600/10"
    },
    {
        number: "06",
        title: "Mode & Duration",
        items: [
            { icon: <Monitor className="w-3.5 h-3.5" />, text: "Mode: CBT" },
            { icon: <MapPin className="w-3.5 h-3.5" />, text: "Multi-city shifts" }
        ],
        accentColor: "group-hover:border-orange-600",
        numColor: "group-hover:text-orange-600/10"
    },
    {
        number: "07",
        title: "Declaration",
        items: [
            { icon: <BarChart3 className="w-3.5 h-3.5" />, text: "Results: July" },
            { icon: <Send className="w-3.5 h-3.5" />, text: "Counselling follows" }
        ],
        accentColor: "group-hover:border-amber-600",
        numColor: "group-hover:text-amber-600/10"
    }
];

export default function UnderstandingCuetPage() {
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
    <div className="min-h-screen w-full bg-white relative overflow-hidden">
      
      {/* Decorative Floating Blobs */}
      <div className="absolute top-[10%] left-[5%] w-64 h-64 bg-red-500/5 rounded-full blur-3xl animate-pulse pointer-events-none" />
      <div className="absolute bottom-[10%] right-[10%] w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse pointer-events-none" />

      {/* Top Hero/Form Section */}
      <section className="relative w-full py-12 md:py-20 bg-white/80 backdrop-blur-sm z-10">
        <div className="container mx-auto px-4 md:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            
            {/* Left Content */}
            <div className="space-y-8 animate-fade-in-up text-left">
                <div className="space-y-4">
                <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight text-left uppercase">
                    ACE <span className="text-red-600">CUET(UG)</span> 2026
                </h1>
                <h2 className="text-xl md:text-2xl font-bold text-slate-800 text-left">
                    Unlock doors to your dream college!
                </h2>
                </div>

                <div className="space-y-6">
                <div className="flex items-start gap-4 text-left">
                    <Sparkles className="w-5 h-5 text-yellow-400 shrink-0 mt-1" />
                    <p className="text-slate-600 font-bold text-sm md:text-base leading-relaxed text-left text-balance">
                    Secure admission to undergraduate (UG) programs at top Central Universities in India by taking the Common Universities Entrance Test (CUET).
                    </p>
                </div>
                <div className="flex items-start gap-4 text-left">
                    <Sparkles className="w-5 h-5 text-yellow-400 shrink-0 mt-1" />
                    <p className="text-slate-600 font-bold text-sm md:text-base leading-relaxed text-left text-balance">
                    CUET (UG) is highly competitive with lakhs candidates seeking seats at the top universities in the country.
                    </p>
                </div>
                </div>

                <div className="text-left">
                    <Button size="lg" className="rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold h-12 px-10 shadow-xl shadow-red-600/20 group uppercase tracking-tight">
                    Target CUET (UG) 2026 <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                </div>
            </div>

            {/* Right Form Card */}
            <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                <Card className="w-full max-w-lg mx-auto bg-white/90 backdrop-blur-xl shadow-2xl rounded-2xl border-2 border-primary/10 overflow-hidden">
                <CardHeader className="text-center p-8 pb-0">
                    <CardTitle className="text-2xl font-black text-red-600 tracking-tighter uppercase">Join IDL CUET (UG) Now</CardTitle>
                    <CardDescription className="text-muted-foreground text-[11px] font-black uppercase tracking-widest">Fill out the form to get a call back</CardDescription>
                </CardHeader>
                <CardContent className="p-0 mt-6">
                    <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col">
                        <div className="grid grid-cols-1 divide-y divide-slate-100 dark:divide-slate-800">
                            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100 dark:divide-slate-800">
                                <FormField
                                    control={form.control}
                                    name="fullName"
                                    render={({ field }) => (
                                    <FormItem className="space-y-0">
                                        <FormControl>
                                        <div className="relative group h-full">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-red-600 transition-colors" />
                                            <Input placeholder="Full Name *" {...field} className="pl-12 h-14 bg-transparent border-0 rounded-none font-bold text-[13px] transition-all focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-slate-400" />
                                        </div>
                                        </FormControl>
                                        <FormMessage className="text-[10px] px-4 pb-2" />
                                    </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                    <FormItem className="space-y-0">
                                        <FormControl>
                                        <div className="relative group h-full">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-red-600 transition-colors" />
                                            <Input type="email" placeholder="Email Address *" {...field} className="pl-12 h-14 bg-transparent border-0 rounded-none font-bold text-[13px] transition-all focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-slate-400" />
                                        </div>
                                        </FormControl>
                                        <FormMessage className="text-[10px] px-4 pb-2" />
                                    </FormItem>
                                    )}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100 dark:divide-slate-800">
                                <FormField
                                    control={form.control}
                                    name="mobile"
                                    render={({ field }) => (
                                    <FormItem className="space-y-0">
                                        <FormControl>
                                        <div className="relative group h-full">
                                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-red-600 transition-colors" />
                                            <Input type="tel" placeholder="Phone Number *" {...field} maxLength={10} className="pl-12 h-14 bg-transparent border-0 rounded-none font-bold text-[13px] transition-all focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-slate-400" />
                                        </div>
                                        </FormControl>
                                        <FormMessage className="text-[10px] px-4 pb-2" />
                                    </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="targetYear"
                                    render={({ field }) => (
                                    <FormItem className="space-y-0">
                                        <div className="relative group h-full">
                                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 z-10" />
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className="pl-12 h-14 bg-transparent border-0 rounded-none font-bold text-[13px] focus:ring-0 shadow-none">
                                                        <SelectValue placeholder="Target Year *" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {targetYears.map(year => <SelectItem key={year} value={year}>{year}</SelectItem>)}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <FormMessage className="text-[10px] px-4 pb-2" />
                                    </FormItem>
                                    )}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100 dark:divide-slate-800">
                                <FormField
                                    control={form.control}
                                    name="state"
                                    render={({ field }) => (
                                    <FormItem className="space-y-0">
                                        <div className="relative group h-full">
                                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 z-10" />
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className="pl-12 h-14 bg-transparent border-0 rounded-none font-bold text-[13px] focus:ring-0 shadow-none">
                                                        <SelectValue placeholder="State *" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {indianStates.map(state => <SelectItem key={state} value={state}>{state}</SelectItem>)}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <FormMessage className="text-[10px] px-4 pb-2" />
                                    </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="city"
                                    render={({ field }) => (
                                    <FormItem className="space-y-0">
                                        <FormControl>
                                        <div className="relative group h-full">
                                            <Building className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-red-600 transition-colors" />
                                            <Input placeholder="City *" {...field} className="pl-12 h-14 bg-transparent border-0 rounded-none font-bold text-[13px] transition-all focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-slate-400" />
                                        </div>
                                        </FormControl>
                                        <FormMessage className="text-[10px] px-4 pb-2" />
                                    </FormItem>
                                    )}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100 dark:divide-slate-800">
                                <FormField
                                    control={form.control}
                                    name="preferredUniversity"
                                    render={({ field }) => (
                                    <FormItem className="space-y-0">
                                        <div className="relative group h-full">
                                            <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 z-10" />
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className="pl-12 h-14 bg-transparent border-0 rounded-none font-bold text-[13px] focus:ring-0 shadow-none">
                                                        <SelectValue placeholder="University *" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {universities.map(uni => <SelectItem key={uni} value={uni}>{uni}</SelectItem>)}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <FormMessage className="text-[10px] px-4 pb-2" />
                                    </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="stream"
                                    render={({ field }) => (
                                    <FormItem className="space-y-0">
                                        <div className="relative group h-full">
                                            <Monitor className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 z-10" />
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className="pl-12 h-14 bg-transparent border-0 rounded-none font-bold text-[13px] focus:ring-0 shadow-none">
                                                        <SelectValue placeholder="Stream *" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {streams.map(stream => <SelectItem key={stream} value={stream}>{stream}</SelectItem>)}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <FormMessage className="text-[10px] px-4 pb-2" />
                                    </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                        <div className="p-6 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800">
                            <Button type="submit" size="lg" className="w-full h-12 text-[11px] font-black bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-lg shadow-red-600/20 transition-all active:scale-[0.98] group uppercase" disabled={form.formState.isSubmitting}>
                                {form.formState.isSubmitting ? 'Submitting...' : 'SUBMIT ENQUIRY'}
                                <Send className="ml-2 h-3.5 w-3.5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                            </Button>
                        </div>
                    </form>
                    </Form>
                </CardContent>
                </Card>
            </div>
            </div>
        </div>
      </section>

      {/* WHAT IS CUET? Section */}
      <section className="w-full bg-white py-12 md:py-20 animate-fade-in-up">
        <div className="container mx-auto px-4 md:px-6 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
                <div className="relative aspect-video lg:aspect-square flex items-center justify-center">
                    <div className="relative w-[300px] h-[300px] md:w-[450px] md:h-[450px] rounded-full border-[12px] border-white overflow-hidden bg-white shadow-2xl shadow-red-500/10">
                        <Image 
                            src="/cuet.png" 
                            alt="Understanding CUET Exam" 
                            fill 
                            className="object-contain p-8"
                        />
                    </div>
                </div>
                <div className="space-y-8">
                    <div className="space-y-4">
                        <h3 className="text-2xl md:text-3xl font-black text-slate-900 uppercase tracking-tight text-left">
                            <span className="text-red-600">WHAT</span> IS CUET?
                        </h3>
                        <p className="text-slate-600 font-bold text-sm md:text-base leading-relaxed text-left text-balance">
                            Common Universities Entrance Test (CUET) is a standardised exam for admission into various undergraduate (UG), postgraduate and research programs in Central Universities under the Ministry of Education (MoE), Government of India.
                        </p>
                    </div>

                    <ul className="space-y-3">
                        {[
                            "Introduced by the National Testing Agency (NTA) in 2022.",
                            "One examination for candidates to participate in the admission processes.",
                            "Platform of equal opportunities for candidates across the country."
                        ].map((item, i) => (
                            <li key={i} className="flex items-start gap-3">
                                <div className="mt-1.5 h-2 w-2 rounded-full bg-red-600 shrink-0" />
                                <span className="text-slate-600 font-bold text-sm md:text-base leading-relaxed text-left flex-1">
                                    {item}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
      </section>

      <Dialog open={isSuccessOpen} onOpenChange={setIsSuccessOpen}>
        <DialogContent className="rounded-3xl max-w-sm">
          <DialogHeader>
            <div className="flex justify-center mb-4">
              <CheckCircle2 className="w-16 h-16 text-green-500" />
            </div>
            <DialogTitle className="text-center text-2xl font-bold">Inquiry Received!</DialogTitle>
            <DialogDescription className="text-center font-medium leading-relaxed">
              Thank you for choosing IDL CUET. Our expert counselor will call you back within 24 hours to guide you.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setIsSuccessOpen(false)} className="w-full rounded-xl h-12 font-bold bg-red-600 hover:bg-red-700 text-white">
              Dismiss
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
