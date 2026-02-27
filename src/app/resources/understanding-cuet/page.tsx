'use client';

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sparkles, ArrowRight, CheckCircle2, PlayCircle } from "lucide-react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { submitStudentEnquiry } from "@/app/actions";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { motion } from "framer-motion";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";

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
    // Reusing student enquiry logic for this purpose
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
        
        {/* Top Info Section (From Image) */}
        <section className="mb-20 animate-fade-in-up">
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
                                <div className="mt-1 bg-red-600 rounded-sm p-0.5 shadow-sm transition-transform group-hover:scale-110">
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

        <Separator className="mb-20 opacity-10 bg-red-200" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          
          {/* Left Content */}
          <div className="space-y-8 animate-fade-in-up">
            <div className="space-y-4">
              <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
                ACE <span className="text-red-600">CUET(UG)</span> 2026.
              </h1>
              <h2 className="text-xl md:text-2xl font-bold text-slate-800">
                Unlock doors to your dream college!
              </h2>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <Sparkles className="w-5 h-5 text-yellow-400 shrink-0 mt-1" />
                <p className="text-slate-600 font-medium leading-relaxed">
                  Secure admission to undergraduate (UG) programs at top Central Universities in India by taking the Common Universities Entrance Test (CUET).
                </p>
              </div>
              <div className="flex items-start gap-4">
                <Sparkles className="w-5 h-5 text-yellow-400 shrink-0 mt-1" />
                <p className="text-slate-600 font-medium leading-relaxed">
                  CUET (UG) is highly competitive with lakhs candidates seeking seats at the top universities in the country.
                </p>
              </div>
            </div>

            <Button size="lg" className="rounded-full bg-red-600 hover:bg-red-700 text-white font-bold h-14 px-10 shadow-xl shadow-red-600/20 group uppercase tracking-tight">
              Target CUET (UG) 2026 <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
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
