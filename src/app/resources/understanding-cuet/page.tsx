'use client';

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
    Sparkles, 
    ArrowRight, 
    CheckCircle2, 
    PlayCircle, 
    Target, 
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
    MapPin
} from "lucide-react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { submitStudentEnquiry } from "@/app/actions";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { motion } from "framer-motion";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
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
const universities = ["University of Delhi", "Banaras Hindu University", "Jawaharlal Nehru University", "Jamia Millia Islamia", "Aligarh Muslim University", "Other"];

const timelineData = [
    {
        number: 1,
        title: "Conducting Authority",
        items: [
            { icon: <Building className="w-3.5 h-3.5" />, text: "Conducted by: National Testing Agency (NTA)" },
            { icon: <Globe className="w-3.5 h-3.5" />, text: "National-level entrance test" },
            { icon: <GraduationCap className="w-3.5 h-3.5" />, text: "For UG admissions in Central & participating universities" }
        ],
        accent: "bg-blue-600"
    },
    {
        number: 2,
        title: "Exam Frequency",
        items: [
            { icon: <Repeat className="w-3.5 h-3.5" />, text: "Conducted Once Every Year" },
            { icon: <CheckCircle2 className="w-3.5 h-3.5" />, text: "For admission in the same academic session" }
        ],
        accent: "bg-indigo-600"
    },
    {
        number: 3,
        title: "Usual Exam Month",
        items: [
            { icon: <Calendar className="w-3.5 h-3.5" />, text: "Generally held in May – June" },
            { icon: <Info className="w-3.5 h-3.5" />, text: "Sometimes extended to July (if phases required)" }
        ],
        accent: "bg-violet-600"
    },
    {
        number: 4,
        title: "Application Timeline",
        items: [
            { icon: <Edit className="w-3.5 h-3.5" />, text: "Form Release: February – March" },
            { icon: <Clock className="w-3.5 h-3.5" />, text: "Last Date: March – April" },
            { icon: <Edit className="w-3.5 h-3.5" />, text: "Correction Window: Few days after last date" }
        ],
        accent: "bg-red-600"
    },
    {
        number: 5,
        title: "Admit Card Release",
        items: [
            { icon: <Ticket className="w-3.5 h-3.5" />, text: "Released 3–7 days before exam date" },
            { icon: <Globe className="w-3.5 h-3.5" />, text: "Available online on official website" }
        ],
        accent: "bg-rose-600"
    },
    {
        number: 6,
        title: "Exam Mode & Duration",
        items: [
            { icon: <Monitor className="w-3.5 h-3.5" />, text: "Mode: Computer-Based Test (CBT)" },
            { icon: <Clock className="w-3.5 h-3.5" />, text: "Conducted in Multiple Shifts" },
            { icon: <MapPin className="w-3.5 h-3.5" />, text: "Across various cities in India" }
        ],
        accent: "bg-orange-600"
    },
    {
        number: 7,
        title: "Result Declaration",
        items: [
            { icon: <BarChart3 className="w-3.5 h-3.5" />, text: "Results usually declared in July" },
            { icon: <Send className="w-3.5 h-3.5" />, text: "Followed by university counselling process" }
        ],
        accent: "bg-amber-600"
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
    <div className="min-h-screen w-full bg-[#FFF5F5] py-12 md:py-20">
      <div className="container mx-auto px-4 md:px-6">
        
        {/* Top Hero/Form Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto mb-20">
          
          {/* Left Content */}
          <div className="space-y-8 animate-fade-in-up">
            <div className="space-y-4">
              <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight text-left">
                ACE <span className="text-red-600">CUET(UG)</span> 2026.
              </h1>
              <h2 className="text-xl md:text-2xl font-bold text-slate-800 text-left">
                Unlock doors to your dream college!
              </h2>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4 text-left">
                <Sparkles className="w-5 h-5 text-yellow-400 shrink-0 mt-1" />
                <p className="text-slate-600 font-medium leading-relaxed">
                  Secure admission to undergraduate (UG) programs at top Central Universities in India by taking the Common Universities Entrance Test (CUET).
                </p>
              </div>
              <div className="flex items-start gap-4 text-left">
                <Sparkles className="w-5 h-5 text-yellow-400 shrink-0 mt-1" />
                <p className="text-slate-600 font-medium leading-relaxed">
                  CUET (UG) is highly competitive with lakhs candidates seeking seats at the top universities in the country.
                </p>
              </div>
            </div>

            <div className="text-left">
                <Button size="lg" className="rounded-full bg-red-600 hover:bg-red-700 text-white font-bold h-14 px-10 shadow-xl shadow-red-600/20 group uppercase tracking-tight">
                Target CUET (UG) 2026 <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
            </div>
          </div>

          {/* Right Form Card */}
          <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <Card className="bg-white border-none shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-xl overflow-hidden">
              <CardContent className="p-8 md:p-10 space-y-8">
                <div className="text-center space-y-2">
                  <h3 className="text-xl md:text-2xl font-black text-red-600 uppercase tracking-tight leading-tight">
                    Join Drishti CUET (UG) Now
                  </h3>
                  <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">
                    Fill out the form to get a call back
                  </p>
                </div>

                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField control={form.control} name="fullName" render={({ field }) => (
                        <FormItem>
                          <FormControl><Input placeholder="Full Name*" {...field} className="h-12 border-slate-200" /></FormControl>
                          <FormMessage className="text-[10px]" />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="email" render={({ field }) => (
                        <FormItem>
                          <FormControl><Input type="email" placeholder="Email*" {...field} className="h-12 border-slate-200" /></FormControl>
                          <FormMessage className="text-[10px]" />
                        </FormItem>
                      )} />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField control={form.control} name="mobile" render={({ field }) => (
                        <FormItem>
                          <FormControl><Input type="tel" placeholder="Mobile Number*" {...field} maxLength={10} className="h-12 border-slate-200" /></FormControl>
                          <FormMessage className="text-[10px]" />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="targetYear" render={({ field }) => (
                        <FormItem>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="h-12 border-slate-200 font-medium">
                                <SelectValue placeholder="Target Year*" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {targetYears.map(year => <SelectItem key={year} value={year}>{year}</SelectItem>)}
                            </SelectContent>
                          </Select>
                          <FormMessage className="text-[10px]" />
                        </FormItem>
                      )} />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField control={form.control} name="state" render={({ field }) => (
                        <FormItem>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="h-12 border-slate-200 font-medium text-left">
                                <SelectValue placeholder="State*" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {indianStates.map(state => <SelectItem key={state} value={state}>{state}</SelectItem>)}
                            </SelectContent>
                          </Select>
                          <FormMessage className="text-[10px]" />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="city" render={({ field }) => (
                        <FormItem>
                          <FormControl><Input placeholder="City*" {...field} className="h-12 border-slate-200" /></FormControl>
                          <FormMessage className="text-[10px]" />
                        </FormItem>
                      )} />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField control={form.control} name="preferredUniversity" render={({ field }) => (
                        <FormItem>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="h-12 border-slate-200 font-medium text-left">
                                <SelectValue placeholder="Preferred University*" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {universities.map(uni => <SelectItem key={uni} value={uni}>{uni}</SelectItem>)}
                            </SelectContent>
                          </Select>
                          <FormMessage className="text-[10px]" />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="stream" render={({ field }) => (
                        <FormItem>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="h-12 border-slate-200 font-medium">
                                <SelectValue placeholder="Stream*" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {streams.map(stream => <SelectItem key={stream} value={stream}>{stream}</SelectItem>)}
                            </SelectContent>
                          </Select>
                          <FormMessage className="text-[10px]" />
                        </FormItem>
                      )} />
                    </div>

                    <Button type="submit" className="w-full h-14 rounded-full bg-red-600 hover:bg-red-700 text-white font-bold text-lg shadow-xl shadow-red-600/20 transition-all active:scale-95 uppercase tracking-tight">
                      Submit Enquiry
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Detailed Info Section */}
        <section className="animate-fade-in-up mt-20">
            <div className="text-center mb-12">
                <h2 className="text-2xl md:text-3xl font-black text-slate-900 uppercase tracking-tighter">
                    UNDERSTANDING <span className="text-red-600">CUET(UG)</span> EXAM
                </h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
                <div className="relative aspect-video lg:aspect-square flex items-center justify-center">
                    <div className="relative w-full h-full max-w-md">
                        <Image 
                            src="https://picsum.photos/seed/cuet-info/800/800" 
                            alt="Understanding CUET Exam" 
                            fill 
                            className="object-contain"
                            data-ai-hint="student studying"
                        />
                    </div>
                </div>
                <div className="space-y-8">
                    <div className="space-y-4">
                        <h3 className="text-2xl md:text-3xl font-black text-slate-900 uppercase tracking-tight text-left">
                            <span className="text-red-600">WHAT</span> IS CUET?
                        </h3>
                        <p className="text-slate-600 font-bold text-sm md:text-base leading-relaxed text-left">
                            Common Universities Entrance Test (CUET) is a standardised exam for admission into various undergraduate (UG), postgraduate and research programs in Central Universities under the Ministry of Education (MoE), Government of India.
                        </p>
                    </div>

                    <ul className="space-y-5">
                        {[
                            "Introduced by the National Testing Agency (NTA) in 2022.",
                            "One examination for candidates to participate in the admission processes.",
                            "Platform of equal opportunities for candidates across the country."
                        ].map((item, i) => (
                            <li key={i} className="flex items-start gap-4 group">
                                <div className="mt-1 bg-red-600 rounded-sm p-0.5 shadow-sm transition-transform group-hover:scale-110 shrink-0">
                                    <PlayCircle className="w-4 h-4 text-white fill-white" />
                                </div>
                                <span className="text-slate-600 font-bold text-sm md:text-base leading-snug text-left flex-1">
                                    {item}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>

        {/* Why and Who Section */}
        <section className="animate-fade-in-up mt-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start max-w-6xl mx-auto p-8 md:p-12 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
                <div className="space-y-10">
                    {/* WHY Section */}
                    <div className="space-y-4">
                        <h3 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight text-left">
                            <span className="text-red-600">WHY</span> CUET (UG)?
                        </h3>
                        <p className="text-slate-600 dark:text-slate-400 font-bold text-sm md:text-base leading-relaxed text-left">
                            This examination is beneficial to the students as it:
                        </p>
                        <ul className="space-y-3">
                            {[
                                "Tests fundamental skills and concepts.",
                                "Reduces the hassle of taking multiple entrance exams.",
                                "Provides a level playing field for students from different boards.",
                                "Ensures fairness for applicants by bringing all on a single platform."
                            ].map((item, i) => (
                                <li key={i} className="flex items-start gap-2">
                                    <span className="text-red-600 font-bold">•</span>
                                    <span className="text-slate-600 dark:text-slate-400 font-bold text-sm md:text-base leading-snug text-left flex-1">
                                        {item}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* WHO Section */}
                    <div className="space-y-4">
                        <h3 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight text-left">
                            <span className="text-red-600">WHO</span> Can Appear For CUET (UG)?
                        </h3>
                        <p className="text-slate-600 dark:text-slate-400 font-bold text-sm md:text-base leading-relaxed text-left">
                            Students who have qualified their 10+2 or intermediate or equivalent from any recognised board and seek admission to various Science, Commerce and Humanities undergraduate courses in top Central Universities.
                        </p>
                    </div>
                </div>

                {/* Video Section */}
                <div className="relative aspect-video rounded-xl overflow-hidden shadow-2xl bg-black border-4 border-white/10 mt-2">
                    <iframe
                        className="w-full h-full"
                        src="https://www.youtube.com/embed/dQw4w9WgXcQ?rel=0"
                        title="CUET Benefits Video"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                    ></iframe>
                </div>
            </div>
        </section>

        {/* When Section */}
        <section className="animate-fade-in-up mt-20 mb-10">
            <div className="text-center space-y-2">
                <h3 className="text-xl md:text-2xl font-black text-slate-900 uppercase tracking-tighter text-center">
                    <span className="text-red-600">WHEN</span> is CUET (UG) Conducted?
                </h3>
                <p className="text-slate-600 dark:text-slate-400 font-bold text-sm md:text-base leading-relaxed text-center">
                    Conducted once a year, usually in May, the exam spans multiple days.
                </p>
            </div>
        </section>

        {/* Modern Pathway Mind Map Section */}
        <section className="animate-fade-in-up mb-24 relative">
            <div className="max-w-5xl mx-auto px-4">
                
                {/* Header */}
                <div className="text-center mb-8 space-y-1">
                    <h2 className="text-lg md:text-xl font-black text-slate-900 uppercase tracking-tight flex items-center justify-center gap-2">
                        <span className="text-lg">🛤️</span> CUET (UG) Pathway
                    </h2>
                    <p className="text-red-600 font-bold uppercase text-[8px] tracking-[0.2em]">The complete institutional timeline</p>
                </div>

                <div className="relative">
                    {/* Central Connecting Pathway (Desktop) */}
                    <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-1 md:w-1.5 bg-gradient-to-b from-red-600 via-indigo-600 to-blue-600 rounded-full transform md:-translate-x-1/2 opacity-20" />

                    <div className="space-y-12 md:space-y-0">
                        {timelineData.map((item, index) => {
                            const isEven = index % 2 === 0;
                            return (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: isEven ? -30 : 30 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true, margin: "-100px" }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className={cn(
                                        "relative flex flex-col md:flex-row items-center justify-between md:mb-20 last:mb-0",
                                        isEven ? "md:flex-row-reverse" : "md:flex-row"
                                    )}
                                >
                                    {/* Content Card */}
                                    <div className="w-full md:w-[45%] ml-12 md:ml-0">
                                        <Card className={cn(
                                            "border-none shadow-[0_10px_30px_-10px_rgba(0,0,0,0.1)] hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.15)] transition-all duration-500 rounded-2xl group overflow-hidden",
                                            "bg-white dark:bg-slate-900"
                                        )}>
                                            <div className={cn("h-1.5 w-full", item.accent)} />
                                            <CardContent className="p-6 md:p-8 space-y-4">
                                                <h4 className="font-black text-slate-900 dark:text-white uppercase text-base tracking-tight flex items-center gap-2">
                                                    <span className={cn("text-white w-6 h-6 rounded-md flex items-center justify-center text-xs shrink-0", item.accent)}>
                                                        {item.number}
                                                    </span>
                                                    {item.title}
                                                </h4>
                                                <ul className="space-y-3">
                                                    {item.items.map((li, idx) => (
                                                        <li key={idx} className="flex items-start gap-3 group/li">
                                                            <div className={cn("mt-1 p-1 rounded-md transition-all group-hover/li:scale-110", "bg-slate-50 dark:bg-slate-800 text-primary")}>
                                                                {li.icon}
                                                            </div>
                                                            <span className="text-slate-600 dark:text-slate-400 font-bold text-xs leading-relaxed">{li.text}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </CardContent>
                                        </Card>
                                    </div>

                                    {/* Interactive Center Node */}
                                    <div className="absolute left-4 md:left-1/2 top-0 md:top-1/2 md:-translate-y-1/2 -translate-x-1/2 z-10">
                                        <div className={cn(
                                            "w-8 h-8 rounded-full bg-white shadow-xl border-4 flex items-center justify-center font-black text-xs transition-transform duration-500 group-hover:scale-125",
                                            "border-slate-100 text-slate-900 ring-4 ring-white/50"
                                        )}>
                                            {item.number}
                                        </div>
                                        {/* Animated Pulse Ring */}
                                        <div className={cn("absolute inset-0 rounded-full animate-ping opacity-20", item.accent)} />
                                    </div>

                                    {/* Placeholder for alternating layout */}
                                    <div className="hidden md:block md:w-[45%]" />
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
      </div>

      <Dialog open={isSuccessOpen} onOpenChange={setIsSuccessOpen}>
        <DialogContent className="rounded-3xl max-w-sm">
          <DialogHeader>
            <div className="flex justify-center mb-4">
              <CheckCircle2 className="w-16 h-16 text-green-500" />
            </div>
            <DialogTitle className="text-center text-2xl font-bold">Inquiry Received!</DialogTitle>
            <DialogDescription className="text-center font-medium leading-relaxed">
              Thank you for choosing Drishti CUET. Our expert counselor will call you back within 24 hours to guide you.
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
