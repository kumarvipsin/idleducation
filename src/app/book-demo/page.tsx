'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Home, User, GraduationCap, Phone, Mail, MapPin, Globe, X, Sparkles, MessageCircle, Star, ShieldCheck, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormMessage, FormLabel } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { bookFreeSession } from "@/app/actions";
import { useLanguage } from "@/context/language-context";
import { allPrograms } from "@/lib/courses";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

const formSchema = z.object({
  sessionMode: z.enum(["online", "offline"], { required_error: "Please select a session mode." }),
  studentName: z.string().min(2, { message: "Name must be at least 2 characters." }),
  classCourse: z.string().min(1, { message: "Please select a class or course." }),
  country: z.string().min(1, { message: "Please select a country." }),
  mobile: z.string().regex(/^\d{10}$/, { message: "Please enter a valid 10-digit mobile number." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  state: z.string().min(1, { message: "Please select a state." }),
});

type FormValues = z.infer<typeof formSchema>;

const indianStates = [
  "Andaman and Nicobar Islands", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar",
  "Chandigarh", "Chhattisgarh", "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Goa",
  "Gujarat", "Haryana", "Himachal Pradesh", "Jammu and Kashmir", "Jharkhand", "Karnataka",
  "Kerala", "Ladakh", "Lakshadweeip", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya",
  "Mizoram", "Nagaland", "Odisha", "Puducherry", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
];

const countries = [
  "India", "United States", "United Kingdom", "Canada", "Australia", "Singapore", "UAE", "Saudi Arabia"
];

export default function BookDemoPage() {
  const { toast } = useToast();
  const { t } = useLanguage();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      studentName: '',
      classCourse: '',
      country: 'India',
      mobile: '',
      email: '',
      state: '',
      sessionMode: 'online',
    },
  });
  
  const sessionMode = form.watch("sessionMode");

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      const result = await bookFreeSession({ ...data });
      if (result.success) {
        toast({
          title: "Success!",
          description: result.message,
        });
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

  const trustStats = [
    { label: "50K+ Expert Tutors", icon: <Users className="w-5 h-5" />, bg: "bg-blue-100 text-blue-600" },
    { label: "95% Student Success", icon: <Star className="w-5 h-5" />, bg: "bg-orange-100 text-orange-600" },
    { label: "30+ Countries Reached", icon: <Globe className="w-5 h-5" />, bg: "bg-green-100 text-green-600" },
  ];

  return (
    <div className="min-h-screen w-full bg-[#F8F7FF] dark:bg-slate-950 overflow-x-hidden">
      <div className="container mx-auto px-4 md:px-6 py-12 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Heading & Stats */}
          <div className="lg:col-span-5 space-y-10 animate-fade-in-up">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white shadow-sm border border-primary/5 text-primary text-[11px] font-black uppercase tracking-[0.2em]">
                <Sparkles className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                PREMIUM ONE-TO-ONE LEARNING
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tighter leading-[1.1]">
                One-to-One Online Classes for your <span className="text-primary italic">child</span>
              </h1>
              <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 font-bold max-w-lg leading-relaxed">
                Unlock your child's potential with personalized attention from India's top educators.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 max-w-sm">
              {trustStats.map((stat, idx) => (
                <div key={idx} className="flex items-center gap-4 p-4 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 transition-all hover:shadow-md">
                  <div className={cn("p-2.5 rounded-xl", stat.bg)}>
                    {stat.icon}
                  </div>
                  <span className="text-sm font-black text-slate-800 dark:text-slate-200 uppercase tracking-tight">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Middle Character Image */}
          <div className="hidden lg:block lg:col-span-3 relative h-[600px] -mx-12 z-10 pointer-events-none">
             <Image 
                src="https://d9hhrg4mnvzow.cloudfront.net/courses.vedantu.com/one-to-one-live/5d43ad04-group-14_10uw0uo000000000000028.png"
                alt="Student Learning"
                fill
                className="object-contain"
                priority
             />
          </div>

          {/* Right Column: Booking Card */}
          <div className="lg:col-span-4 relative z-20 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <Card className="shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-[2rem] border-none bg-white dark:bg-slate-900 overflow-hidden">
              <div className="bg-primary p-6 text-center">
                <h2 className="text-2xl font-black text-white tracking-tight">Book your Free Demo</h2>
                <p className="text-[11px] font-bold text-white/70 uppercase tracking-widest mt-1">Learn from India's best teachers</p>
              </div>
              <CardContent className="p-8 space-y-6">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="studentName"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <div className="relative">
                              <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                              <Input placeholder="Parent/Student Name *" {...field} className="pl-11 h-12 bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-700 rounded-xl font-bold" />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="mobile"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <div className="relative">
                              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                              <span className="absolute left-11 top-1/2 -translate-y-1/2 text-sm font-black text-slate-400">+91</span>
                              <Input type="tel" maxLength={10} placeholder="Phone Number *" {...field} className="pl-20 h-12 bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-700 rounded-xl font-bold" />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="classCourse"
                      render={({ field }) => (
                        <FormItem>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <div className="relative">
                                <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <SelectTrigger className="pl-11 h-12 bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-700 rounded-xl font-bold">
                                  <SelectValue placeholder="Grade/Class *" />
                                </SelectTrigger>
                              </div>
                            </FormControl>
                            <SelectContent>
                              {allPrograms.map(p => <SelectItem key={p.name} value={p.name}>{p.name}</SelectItem>)}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="pt-2 space-y-3">
                      <Button type="submit" className="w-full h-14 text-sm font-black bg-orange-500 hover:bg-orange-600 text-white rounded-xl shadow-xl shadow-orange-500/20 uppercase tracking-widest transition-all active:scale-95" disabled={form.formState.isSubmitting}>
                        {form.formState.isSubmitting ? "PROCESSING..." : "Book Free Demo Class"}
                      </Button>
                      
                      <div className="flex items-center gap-3">
                        <Separator className="flex-1 bg-slate-100 dark:bg-slate-800" />
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">OR</span>
                        <Separator className="flex-1 bg-slate-100 dark:bg-slate-800" />
                      </div>

                      <Button type="button" variant="outline" asChild className="w-full h-14 rounded-xl border-emerald-500 text-emerald-600 hover:bg-emerald-50 font-black text-sm uppercase tracking-widest shadow-sm">
                        <a href="https://wa.me/918860040010" target="_blank" rel="noopener noreferrer">
                          <MessageCircle className="w-5 h-5 mr-2 fill-current" />
                          Chat On WhatsApp
                        </a>
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}