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
    PlayCircle, 
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
    ShieldCheck
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
            { icon: <GraduationCap className="w-3.5 h-3.5" />, text: "For Undergraduate admissions in Central & other participating universities" }
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
            { icon: <Info className="w-3.5 h-3.5" />, text: "Sometimes extended to July (if multiple phases required)" }
        ],
        accent: "bg-violet-600"
    },
    {
        number: 4,
        title: "Application Timeline",
        items: [
            { icon: <Edit className="w-3.5 h-3.5" />, text: "Application Form Release: February – March" },
            { icon: <Clock className="w-3.5 h-3.5" />, text: "Last Date to Apply: March – April" },
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

const whyChooseFeatures = [
    {
        title: "Expert Faculty",
        description: "A team of expert faculties under the guidance of our academic director mentor students through the academic journey with personalized support and insightful instructions.",
        accent: "bg-red-500"
    },
    {
        title: "Exam Oriented Foundation",
        description: "IDL CUET (UG) program focuses on building a strong foundational knowledge base to ensure that when students eventually face the exam, they are well-prepared to solve problems.",
        accent: "bg-blue-500"
    },
    {
        title: "One-to-One Guidance",
        description: "We offer personalized guidance, regular doubt sessions and interaction with faculties ensuring each student receives tailored support.",
        accent: "bg-amber-500"
    },
    {
        title: "Regular Class Tests",
        description: "Our class tests are meticulously structured to simulate CUET (UG) exam conditions and provide targeted feedback for improvement.",
        accent: "bg-emerald-500"
    },
    {
        title: "Topic-wise Practice Worksheets",
        description: "Customized worksheets to sharpen critical thinking, ensuring students are prepared to tackle the complexities of the exam with confidence.",
        accent: "bg-indigo-500"
    },
    {
        title: "Printed Study Materials",
        description: "Materials curated by dedicated content writers and reviewed by the faculty team to ensure 100% correlation with lectures.",
        accent: "bg-rose-500"
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
    <div className="min-h-screen w-full bg-[#FFF5F5]">
      
      {/* Top Hero/Form Section */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4 md:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            
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
                    <p className="text-slate-600 font-bold text-sm md:text-base leading-relaxed text-left">
                    Secure admission to undergraduate (UG) programs at top Central Universities in India by taking the Common Universities Entrance Test (CUET).
                    </p>
                </div>
                <div className="flex items-start gap-4 text-left">
                    <Sparkles className="w-5 h-5 text-yellow-400 shrink-0 mt-1" />
                    <p className="text-slate-600 font-bold text-sm md:text-base leading-relaxed text-left">
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

            {/* Right Form Card (Stylized like Contact Us) */}
            <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                <Card className="w-full max-w-lg mx-auto bg-white/80 dark:bg-card/80 backdrop-blur-sm shadow-2xl rounded-2xl border-2 border-slate-200 dark:border-slate-800 overflow-hidden">
                <CardHeader className="text-center p-8 pb-0">
                    <CardTitle className="text-2xl font-black text-red-600 tracking-tighter uppercase">Join IDL CUET (UG) Now</CardTitle>
                    <CardDescription className="text-muted-foreground text-[11px] font-black uppercase tracking-widest">Fill out the form to get a call back</CardDescription>
                </CardHeader>
                <CardContent className="p-0 mt-6">
                    <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col">
                        <div className="grid grid-cols-1 divide-y divide-slate-100 dark:divide-slate-800">
                            {/* Row 1 */}
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

                            {/* Row 2 */}
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

                            {/* Row 3 */}
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
                                            <Building className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-red-600 transition-colors" />
                                            <Input placeholder="City *" {...field} className="pl-12 h-14 bg-transparent border-0 rounded-none font-bold text-[13px] transition-all focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-slate-400" />
                                        </div>
                                        </FormControl>
                                        <FormMessage className="text-[10px] px-4 pb-2" />
                                    </FormItem>
                                    )}
                                />
                            </div>

                            {/* Row 4 */}
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

      {/* Detailed Info Section (Full Width White Background) */}
      <section className="w-full bg-white py-20 animate-fade-in-up">
        <div className="container mx-auto px-4 md:px-6">
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
                        <h3 className="text-xl md:text-2xl font-black text-slate-900 uppercase tracking-tight text-left">
                            <span className="text-red-600">WHAT</span> IS CUET?
                        </h3>
                        <p className="text-slate-600 font-bold text-xs md:text-sm leading-relaxed text-left">
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
                                <span className="text-slate-600 font-bold text-xs md:text-sm leading-snug text-left flex-1">
                                    {item}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
      </section>

      <div className="container mx-auto px-4 md:px-6">
        {/* Why and Who Section */}
        <section className="animate-fade-in-up mt-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start max-w-6xl mx-auto p-8 md:p-12 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
                <div className="space-y-10">
                    <div className="space-y-4">
                        <h3 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight text-left">
                            <span className="text-red-600">WHY</span> CUET (UG)?
                        </h3>
                        <p className="text-slate-600 dark:text-slate-400 font-bold text-sm md:text-base leading-relaxed text-left">
                            This examination is beneficial to the students as it :
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

                    <div className="space-y-4">
                        <h3 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight text-left">
                            <span className="text-red-600">WHO</span> Can Appear For CUET (UG)?
                        </h3>
                        <p className="text-slate-600 dark:text-slate-400 font-bold text-sm md:text-base leading-relaxed text-left">
                            Students who have qualified their 10+2 or intermediate or equivalent from any recognised board and seek admission to various Science, Commerce and Humanities undergraduate courses in top Central Universities.
                        </p>
                    </div>
                </div>

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

        {/* WHERE Section */}
        <section className="animate-fade-in-up mt-20 mb-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto p-8 md:p-12 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
                <div className="relative aspect-video lg:aspect-square flex items-center justify-center">
                    <div className="relative w-full h-full max-w-md">
                        <Image 
                            src="https://picsum.photos/seed/cuet-where/800/800" 
                            alt="Where is CUET Conducted" 
                            fill 
                            className="object-contain"
                            data-ai-hint="online learning illustration"
                        />
                    </div>
                </div>
                <div className="space-y-6">
                    <h3 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight text-left">
                        <span className="text-red-600">WHERE</span> IS CUET (UG) CONDUCTED?
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 font-bold text-sm md:text-base leading-relaxed text-left">
                        This examination is conducted in 13 languages across multiple cities in India. The mode of examination is Online - Computer Based Test (CBT).
                    </p>
                </div>
            </div>
        </section>

        {/* Exam Pattern Section */}
        <section className="animate-fade-in-up mt-20 mb-20">
            <div className="text-center mb-12">
                <h2 className="text-2xl md:text-3xl font-black text-slate-900 uppercase tracking-tighter">
                    Exam Pattern of <span className="text-red-600">CUET (UG)</span>
                </h2>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start max-w-6xl mx-auto">
                <div className="space-y-8">
                    <div className="space-y-4">
                        <p className="text-slate-600 font-bold text-sm md:text-base leading-relaxed text-left">
                            The exam is broadly divided into three sections of 37 Subjects in total:
                        </p>
                        <ul className="space-y-2 ml-4">
                            {[
                                "13 Languages",
                                "23 Domain-specific subjects",
                                "01 General Aptitude Test"
                            ].map((item, i) => (
                                <li key={i} className="flex items-center gap-2 text-slate-600 font-bold text-sm md:text-base">
                                    <div className="w-1.5 h-1.5 rounded-full bg-red-600" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="space-y-6">
                        <div className="flex gap-4 items-start text-left">
                            <span className="font-black text-red-600 text-lg">1.</span>
                            <div className="space-y-2">
                                <p className="text-slate-600 font-bold text-sm md:text-base leading-relaxed">
                                    50 questions in all sections – General Aptitude Test, Languages and Domain-specific subjects.
                                </p>
                                <p className="text-slate-900 font-black text-sm md:text-base leading-relaxed">
                                    <span className="text-red-600">Note:</span> Students are allowed to appear for CUET (UG) in any subject irrespective of subjects studied in class 12th
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-4 items-start text-left">
                            <span className="font-black text-red-600 text-lg">2.</span>
                            <p className="text-slate-600 font-bold text-sm md:text-base leading-relaxed">
                                The duration of the test will be of 60 minutes.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <p className="text-slate-900 font-black text-sm md:text-base leading-relaxed text-left">
                        <span className="text-red-600">Note:</span> Candidates may choose a maximum 5 subjects including Languages and General Aptitude Test
                    </p>

                    <div className="rounded-2xl border-2 border-purple-200 overflow-hidden shadow-sm">
                        <div className="divide-y-2 divide-purple-100">
                            {[
                                { label: "Mode", value: "Computer Based Test (CBT)" },
                                { label: "Exam Pattern", value: "Objective type with Multiple Choice Questions" },
                                { label: "Medium", value: "13 languages (Assamese, Bengali, English, Gujarati, Hindi, Kannada, Malayalam, Marathi, Punjabi, Odia, Tamil, Telugu, and Urdu)" },
                                { label: "Registration", value: "Registration will be online at https://exams.nta.ac.in/CUET-UG/", isLink: true }
                            ].map((row, i) => (
                                <div key={i} className="grid grid-cols-3 md:grid-cols-4 divide-x-2 divide-purple-100">
                                    <div className="p-4 bg-purple-50/30 flex items-center font-black text-[10px] md:text-xs text-slate-900 uppercase tracking-tight">
                                        {row.label}
                                    </div>
                                    <div className="col-span-2 md:col-span-3 p-4 bg-white flex items-center text-[11px] md:text-xs font-bold text-slate-600 leading-relaxed text-left">
                                        {row.isLink ? (
                                            <span className="break-all">
                                                Registration will be online at <a href="https://exams.nta.ac.in/CUET-UG/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">https://exams.nta.ac.in/CUET-UG/</a>
                                            </span>
                                        ) : row.value}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/* Marking Scheme Section */}
        <section className="animate-fade-in-up mt-20 mb-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto p-8 md:p-12 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
                <div className="space-y-6">
                    <h3 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight text-left">
                        <span className="text-red-600">MARKING</span> SCHEME
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 font-bold text-sm md:text-base leading-relaxed text-left">
                        Understanding the scoring system is crucial for a better attempt strategy. Here is how you will be graded:
                    </p>
                    <div className="space-y-4">
                        <div className="flex items-center gap-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-100 dark:border-green-800/30">
                            <div className="bg-green-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-black text-xs shrink-0">+5</div>
                            <span className="text-sm font-bold text-slate-700 dark:text-slate-300">For each correct answer</span>
                        </div>
                        <div className="flex items-center gap-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-100 dark:border-red-800/30">
                            <div className="bg-red-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-black text-xs shrink-0">-1</div>
                            <span className="text-sm font-bold text-slate-700 dark:text-slate-300">For each incorrect answer</span>
                        </div>
                        <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700">
                            <div className="bg-slate-400 text-white w-8 h-8 rounded-full flex items-center justify-center font-black text-xs shrink-0">0</div>
                            <span className="text-sm font-bold text-slate-700 dark:text-slate-300">For unanswered or marked for review questions</span>
                        </div>
                    </div>
                </div>
                <div className="relative aspect-video rounded-xl overflow-hidden shadow-sm">
                    <Image
                        src="https://picsum.photos/seed/cuet-marks/800/600"
                        alt="Marking Scheme"
                        fill
                        className="object-cover"
                        data-ai-hint="exam marks calculation"
                    />
                </div>
            </div>
        </section>

        {/* Why Choose Section */}
        <section className="animate-fade-in-up mt-32 mb-20 px-4">
            <div className="text-center mb-16 max-w-4xl mx-auto space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-50 border border-red-100 text-red-600 text-[10px] font-black uppercase tracking-[0.2em] shadow-sm">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    IDL ADVANTAGE
                </div>
                <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-none">
                    WHY CHOOSE <span className="text-red-600">IDL CUET</span>?
                </h2>
                <p className="text-slate-600 dark:text-slate-400 font-bold text-sm md:text-lg leading-relaxed text-balance">
                    In the journey towards achieving a distinguished career, choosing the right guide is as crucial as the aspirant's dedication. IDL stands as a beacon of excellence for young aspirants.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16 max-w-6xl mx-auto">
                {whyChooseFeatures.map((feature, i) => (
                    <div key={i} className="group relative flex flex-col items-start gap-4 animate-fade-in-up" style={{ animationDelay: `${i * 0.1}s` }}>
                        <div className="flex items-center gap-4">
                            <span className="text-4xl font-black text-slate-100 dark:text-white/5 transition-colors group-hover:text-primary/10 select-none">
                                0{i + 1}
                            </span>
                        </div>
                        <div className="space-y-3 border-l-2 border-slate-100 dark:border-slate-800 pl-6 group-hover:border-primary transition-colors duration-500">
                            <h4 className="font-black text-slate-900 dark:text-white uppercase text-base tracking-tight group-hover:text-primary transition-colors">
                                {feature.title}
                            </h4>
                            <p className="text-slate-500 dark:text-slate-400 font-bold text-xs leading-relaxed text-left opacity-80 group-hover:opacity-100 transition-opacity">
                                {feature.description}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
      </div>

      <AnimatePresence>
        {isSuccessOpen && (
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
        )}
      </AnimatePresence>
    </div>
  );
}
