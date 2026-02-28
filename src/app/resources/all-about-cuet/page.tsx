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
    Trophy,
    X,
    Minus
} from "lucide-react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { submitStudentEnquiry } from "@/app/actions";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import Image from "next/image";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { format } from "date-fns";

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
        title: "Exam Frequency",
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

const whyChooseFeatures = [
    { title: "Expert Faculty", desc: "A team of expert faculties mentor students with personalized support." },
    { title: "Exam Oriented Foundation", desc: "Building strong knowledge bases for future complex problem solving." },
    { title: "One-to-One Guidance", desc: "Regular doubt sessions and tailored interaction with faculties." },
    { title: "Regular Class Tests", desc: "Structured simulations of CUET (UG) exam conditions." },
    { title: "Practice Worksheets", desc: "Customized worksheets to sharpen critical thinking skills." },
    { title: "Study Materials", desc: "Curated content reviewed by faculty for perfect correlation." }
];

const facts = [
    { title: "Full Form", value: "Common University Entrance Test", icon: <GraduationCap className="w-5 h-5" /> },
    { title: "Conducting Body", value: "NTA", icon: <Building className="w-5 h-5" /> },
    { title: "Frequency", value: "Once a year", icon: <Repeat className="w-5 h-5" /> },
    { title: "Exam Mode", value: "CBT (Online)", icon: <Monitor className="w-5 h-5" /> },
    { title: "Question Type", value: "Objective (MCQs)", icon: <Edit className="w-5 h-5" /> },
    { title: "Marking", value: "+5 | -1 scheme", icon: <BarChart3 className="w-5 h-5" /> }
];

export default function AllAboutCuetPage() {
  const { toast } = useToast();
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);

  const form = useForm<CuetInquiryValues>({
    resolver: zodResolver(cuetInquirySchema),
    defaultValues: { fullName: '', email: '', mobile: '', targetYear: '', state: '', city: '', preferredUniversity: '', stream: '' },
  });

  const onSubmit: SubmitHandler<CuetInquiryValues> = async (data) => {
    const result = await submitStudentEnquiry({
        studentName: data.fullName,
        guardianName: "N/A",
        classCourse: `CUET ${data.targetYear} - ${data.stream}`,
        mobile: data.mobile,
        state: data.state,
        message: `University: ${data.preferredUniversity}, City: ${data.city}`
    } as any);

    if (result.success) {
      setIsSuccessOpen(true);
      form.reset();
    } else {
      toast({ variant: "destructive", title: "Error", description: result.message });
    }
  };

  return (
    <div className="min-h-screen w-full bg-white dark:bg-slate-950 selection:bg-primary/10">
      
      {/* 1. Hero Section */}
      <section className="relative w-full py-16 md:py-24 bg-white overflow-hidden">
        <div className="container mx-auto px-4 md:px-6 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
                <div className="space-y-8 animate-fade-in-up text-left">
                    <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-slate-900 leading-[0.9] uppercase">
                        ALL ABOUT <br/>
                        <span className="text-red-600">CUET (UG)</span>
                    </h1>
                    <p className="text-slate-600 font-bold text-sm md:text-lg leading-relaxed max-w-lg">
                        Master every detail of the nation's biggest entrance exam. From registration to top college shortlisting, your journey starts here.
                    </p>
                    <Button asChild size="lg" className="rounded-xl bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-widest text-[10px] h-12 px-8 shadow-xl shadow-red-600/20">
                        <Link href="#enquiry">Book Free Counselling</Link>
                    </Button>
                </div>
                <div className="relative aspect-video lg:aspect-square flex items-center justify-center animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                    <div className="relative w-[300px] h-[300px] md:w-[450px] md:h-[450px] rounded-full overflow-hidden bg-white border-[12px] border-slate-50">
                        <Image src="/cuet.png" alt="CUET" fill className="object-contain p-10" />
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* 2. Key Facts Stripe */}
      <section className="w-full py-12 bg-primary text-white">
          <div className="container mx-auto px-4 md:px-6">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
                  {facts.map((info, i) => (
                      <div key={i} className="flex flex-col items-center text-center gap-2">
                          <div className="p-2 bg-white/10 rounded-lg text-white/60 mb-1">{info.icon}</div>
                          <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest leading-none">{info.title}</p>
                          <p className="text-[11px] font-black uppercase tracking-tight">{info.value}</p>
                      </div>
                  ))}
              </div>
          </div>
      </section>

      {/* 3. What is CUET Section */}
      <section className="w-full py-20 bg-white border-b">
          <div className="container mx-auto px-4 md:px-6">
              <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
                  <div className="space-y-8 text-left">
                      <h2 className="text-3xl md:text-4xl font-black text-slate-900 uppercase tracking-tight">Introduction to CUET</h2>
                      <p className="text-slate-600 font-bold text-base leading-relaxed">
                          The Common University Entrance Test (CUET) provides a single-window opportunity to students seeking admission in Central Universities across India. It eliminates high cut-off pressure and provides a level playing field for every aspirant.
                      </p>
                      <div className="p-6 bg-blue-50 rounded-2xl border border-blue-100">
                          <h4 className="font-black text-blue-600 uppercase text-xs mb-3 tracking-widest text-left">The Purpose</h4>
                          <p className="text-xs text-blue-900/70 font-bold leading-relaxed text-left">To standardize undergraduate admissions and ensure equal platform access regardless of regional board backgrounds.</p>
                      </div>
                  </div>
                  <div className="flex justify-center">
                      <div className="relative w-[300px] h-[300px] md:w-[450px] md:h-[450px] rounded-full overflow-hidden border-[12px] border-slate-50">
                          <Image src="/cuet.png" alt="CUET Intro" fill className="object-contain p-10" />
                      </div>
                  </div>
              </div>
          </div>
      </section>

      {/* 4. Why CUET (UG)? Section */}
      <section className="w-full py-20 bg-white border-b">
          <div className="container mx-auto px-4 md:px-6">
              <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
                  <div className="order-2 lg:order-1 flex justify-center">
                      <div className="relative w-[300px] h-[300px] md:w-[450px] md:h-[450px] rounded-full overflow-hidden border-[12px] border-slate-50">
                          <Image src="/cuet2.png" alt="Benefits" fill className="object-contain p-10" />
                      </div>
                  </div>
                  <div className="order-1 lg:order-2 space-y-8 text-left">
                      <h2 className="text-3xl md:text-4xl font-black text-slate-900 uppercase tracking-tight">Why CUET (UG)?</h2>
                      <ul className="space-y-4">
                          {[
                              "Tests fundamental skills and concepts accurately.",
                              "Reduces the burden of appearing in multiple entrance tests.",
                              "Equal opportunity for students from various backgrounds.",
                              "Single portal for admission to multiple institutions."
                          ].map((item, i) => (
                              <li key={i} className="flex items-start gap-3">
                                  <CheckCircle2 className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                                  <span className="text-slate-600 font-bold text-sm md:text-base leading-relaxed">{item}</span>
                              </li>
                          ))}
                      </ul>
                  </div>
              </div>
          </div>
      </section>

      {/* 5. Who Can Appear Section */}
      <section className="w-full py-20 bg-white border-b">
          <div className="container mx-auto px-4 md:px-6">
              <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
                  <div className="space-y-8 text-left">
                      <h2 className="text-3xl md:text-4xl font-black text-slate-900 uppercase tracking-tight">Who Can Appear?</h2>
                      <p className="text-slate-600 font-bold text-sm md:text-base leading-relaxed">
                          Students seeking admission to UG programs at Central Universities must meet basic eligibility criteria:
                      </p>
                      <ul className="space-y-4">
                          {[
                              "Qualified Class 12 or equivalent from a recognized board.",
                              "No standard age limit for appearing in CUET (UG).",
                              "Specific university eligibility requirements must be met.",
                              "Open to all streams: Science, Commerce, and Arts."
                          ].map((item, i) => (
                              <li key={i} className="flex items-start gap-3">
                                  <div className="mt-2 h-1.5 w-1.5 rounded-full bg-red-600 shrink-0" />
                                  <span className="text-slate-600 font-bold text-sm md:text-base leading-relaxed">{item}</span>
                              </li>
                          ))}
                      </ul>
                  </div>
                  <div className="flex justify-center">
                      <div className="relative w-[300px] h-[300px] md:w-[450px] md:h-[450px] rounded-full overflow-hidden border-[12px] border-slate-50">
                          <Image src="/cuet3.png" alt="Eligibility" fill className="object-contain p-10" />
                      </div>
                  </div>
              </div>
          </div>
      </section>

      {/* 6. Timeline Section (Modernized) */}
      <section className="w-full py-20 bg-white border-b">
          <div className="container mx-auto px-4 md:px-6">
              <div className="max-w-6xl mx-auto space-y-16">
                  <div className="text-center space-y-4">
                      <h2 className="text-3xl md:text-4xl font-black text-slate-900 uppercase tracking-tight">When is CUET Conducted?</h2>
                      <p className="text-slate-600 font-bold text-sm md:text-base">The chronological roadmap of the examination process.</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16">
                      {timelineData.map((item, i) => (
                          <div key={i} className="group relative flex flex-col items-start gap-4">
                              <span className={cn("text-4xl font-black text-slate-100 transition-colors duration-500", item.numColor)}>{item.number}</span>
                              <div className={cn("space-y-4 border-l-2 border-slate-100 pl-6 transition-colors duration-500", item.accentColor)}>
                                  <h4 className="font-black text-slate-900 uppercase text-sm tracking-tight text-left">{item.title}</h4>
                                  <div className="space-y-2">
                                      {item.items.map((li, idx) => (
                                          <div key={idx} className="flex items-center gap-2.5">
                                              <div className="p-1 bg-primary/5 rounded text-primary/40 group-hover:text-primary transition-colors">{li.icon}</div>
                                              <span className="text-slate-500 font-bold text-[10px] uppercase tracking-wide leading-none">{li.text}</span>
                                          </div>
                                      ))}
                                  </div>
                              </div>
                          </div>
                      ))}
                  </div>
              </div>
          </div>
      </section>

      {/* 7. Marking Scheme Section */}
      <section className="w-full py-20 bg-white border-b">
          <div className="container mx-auto px-4 md:px-6">
              <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
                  <div className="order-2 lg:order-1 flex justify-center">
                      <div className="relative w-[300px] h-[300px] md:w-[450px] md:h-[450px] rounded-full overflow-hidden border-[12px] border-slate-50">
                          <Image src="/cuet6.png" alt="Marking Scheme" fill className="object-contain p-10" />
                      </div>
                  </div>
                  <div className="order-1 lg:order-2 space-y-8 text-left">
                      <h2 className="text-3xl md:text-4xl font-black text-slate-900 uppercase tracking-tight">Marking Scheme</h2>
                      <div className="space-y-4">
                          {[
                              { label: "Correct Answer", value: "+5 Marks", icon: <Trophy className="text-green-600" /> },
                              { label: "Incorrect Answer", value: "-1 Mark", icon: <X className="text-red-600" /> },
                              { label: "Unanswered", value: "0 Marks", icon: <Minus className="text-slate-400" /> }
                          ].map((item, i) => (
                              <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                                  <div className="flex items-center gap-3">
                                      {item.icon}
                                      <span className="text-sm font-black uppercase text-slate-700">{item.label}</span>
                                  </div>
                                  <span className="font-black text-primary">{item.value}</span>
                              </div>
                          ))}
                      </div>
                  </div>
              </div>
          </div>
      </section>

      {/* 8. Why Choose IDL CUET Section */}
      <section className="w-full py-20 bg-white">
          <div className="container mx-auto px-4 md:px-6">
              <div className="max-w-6xl mx-auto space-y-16">
                  <div className="text-center space-y-4">
                      <h2 className="text-3xl md:text-4xl font-black text-slate-900 uppercase tracking-tight">Why Choose IDL CUET?</h2>
                      <p className="text-slate-600 font-bold text-sm md:text-base max-w-3xl mx-auto">Choosing the right guide is as crucial as dedication. IDL stands as a beacon of excellence for young aspirants.</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16">
                      {whyChooseFeatures.map((item, i) => (
                          <div key={i} className="group relative flex flex-col items-start gap-4">
                              <span className="text-4xl font-black text-slate-100 transition-colors duration-500 group-hover:text-red-600/10">0{i+1}</span>
                              <div className="space-y-3 border-l-2 border-slate-100 pl-6 group-hover:border-red-600 transition-colors duration-500 text-left">
                                  <h4 className="font-black text-slate-900 uppercase text-sm tracking-tight">{item.title}</h4>
                                  <p className="text-slate-500 font-bold text-xs leading-relaxed opacity-80">{item.desc}</p>
                              </div>
                          </div>
                      ))}
                  </div>
              </div>
          </div>
      </section>

      {/* Enquiry Form Section */}
      <section id="enquiry" className="w-full py-20 bg-slate-50 border-t">
          <div className="container mx-auto px-4 md:px-6">
              <div className="max-w-4xl mx-auto">
                  <div className="text-center mb-12 space-y-4">
                      <h2 className="text-3xl md:text-4xl font-black text-slate-900 uppercase tracking-tight">Need Expert Help?</h2>
                      <p className="text-slate-600 font-bold text-sm">Fill out the form below to receive a personalized CUET roadmap and study kit.</p>
                  </div>
                  <Card className="rounded-[2rem] border-none shadow-2xl overflow-hidden">
                      <CardContent className="p-8 md:p-12">
                          <Form {...form}>
                              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 text-left">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                      <FormField control={form.control} name="fullName" render={({ field }) => (
                                          <FormItem><FormLabel className="font-black text-[10px] uppercase tracking-widest text-slate-400">Full Name</FormLabel><FormControl><Input placeholder="Your full name" {...field} className="h-12 rounded-xl bg-slate-50 border-slate-100 font-bold"/></FormControl><FormMessage /></FormItem>
                                      )} />
                                      <FormField control={form.control} name="mobile" render={({ field }) => (
                                          <FormItem><FormLabel className="font-black text-[10px] uppercase tracking-widest text-slate-400">Phone</FormLabel><FormControl><Input placeholder="10-digit number" {...field} className="h-12 rounded-xl bg-slate-50 border-slate-100 font-bold"/></FormControl><FormMessage /></FormItem>
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