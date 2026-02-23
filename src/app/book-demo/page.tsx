'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { User, GraduationCap, Phone, Mail, MapPin, Globe, Sparkles, MessageCircle, Monitor, Send, Layers } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { bookFreeSession } from "@/app/actions";
import { DISCOVER_COURSES } from "@/lib/courses";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CheckCircle } from "lucide-react";

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
  "Kerala", "Ladakh", "Lakshadweep", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya",
  "Mizoram", "Nagaland", "Odisha", "Puducherry", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
];

const countries = [
  "India", "United States", "United Kingdom", "Canada", "Australia", "Singapore", "UAE", "Saudi Arabia"
];

export default function BookDemoPage() {
  const { toast } = useToast();
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);

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

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      const result = await bookFreeSession({ ...data });
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
    <div className="min-h-screen w-full bg-[#F8F7FF] dark:bg-slate-950 overflow-x-hidden relative">
      {/* Floating Decorative Elements */}
      <div className="absolute top-[10%] left-[5%] w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-pulse pointer-events-none" />
      <div className="absolute bottom-[10%] right-[5%] w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse pointer-events-none" />
      
      <div className="container mx-auto px-4 md:px-6 py-12 lg:py-16 relative z-10">
        <div className="max-w-lg mx-auto space-y-8">
          {/* Header Section */}
          <div className="text-center space-y-3 animate-fade-in-up">
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white shadow-sm border border-primary/5 text-primary text-[8px] font-black uppercase tracking-wider">
              <Sparkles className="w-2 h-2 text-yellow-500 fill-yellow-500" />
              BOOKING HUB
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tighter leading-tight">
              Book Your{' '}
              <span className="relative inline-block">
                <span className="relative z-10 text-primary">Free Demo</span>
                <div className="absolute -bottom-1 left-0 w-full h-2 z-0">
                  <svg viewBox="0 0 100 15" preserveAspectRatio="none" className="w-full h-full text-blue-500 fill-none stroke-current stroke-[10] opacity-70">
                    <path d="M0,15 Q50,5 100,15" />
                  </svg>
                </div>
              </span>
            </h1>
            <p className="max-w-xl mx-auto text-slate-600 dark:text-slate-400 text-[11px] md:text-xs font-semibold leading-relaxed">
              Experience our premium one-to-one learning with India's top educators.
            </p>
          </div>

          {/* Booking Form Card */}
          <Card className="shadow-xl rounded-xl border border-border bg-white dark:bg-slate-900 overflow-hidden animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <CardContent className="p-6 md:p-8">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                  
                  <FormField
                    control={form.control}
                    name="sessionMode"
                    render={({ field }) => (
                      <FormItem>
                        <div className="relative group">
                          <div className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center rounded-full border border-slate-200 transition-all group-focus-within:border-primary group-focus-within:ring-4 group-focus-within:ring-primary/10 pointer-events-none z-10">
                            <Monitor className="h-3.5 w-3.5 text-slate-400 group-focus-within:text-primary transition-colors" />
                          </div>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className={cn(
                                "pl-11 h-10 bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-700 rounded-lg font-medium text-xs transition-all focus:ring-2 focus:ring-primary/20",
                                !field.value && "text-slate-400"
                              )}>
                                <SelectValue placeholder="Select Session Mode *" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="online" className="text-xs">Online Session</SelectItem>
                              <SelectItem value="offline" className="text-xs">Offline Centre</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <FormMessage className="text-[10px]" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="studentName"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="relative group">
                            <div className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center rounded-full border border-slate-200 transition-all group-focus-within:border-primary group-focus-within:ring-4 group-focus-within:ring-primary/10">
                              <User className="h-3.5 w-3.5 text-slate-400 group-focus-within:text-primary transition-colors" />
                            </div>
                            <Input placeholder="Student's Name *" {...field} className="pl-11 h-10 bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-700 rounded-lg font-medium text-xs transition-all focus:ring-2 focus:ring-primary/20" />
                          </div>
                        </FormControl>
                        <FormMessage className="text-[10px]" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="classCourse"
                    render={({ field }) => (
                      <FormItem>
                        <div className="relative group">
                          <div className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center rounded-full border border-slate-200 transition-all group-focus-within:border-primary group-focus-within:ring-4 group-focus-within:ring-primary/10 pointer-events-none z-10">
                            <GraduationCap className="h-3.5 w-3.5 text-slate-400 group-focus-within:text-primary transition-colors" />
                          </div>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className={cn(
                                "pl-11 h-10 bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-700 rounded-lg font-medium text-xs transition-all focus:ring-2 focus:ring-primary/20",
                                !field.value && "text-slate-400"
                              )}>
                                <SelectValue placeholder="Select Class/Course *" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {DISCOVER_COURSES.map(c => <SelectItem key={c.name} value={c.name} className="text-xs">{c.name}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        </div>
                        <FormMessage className="text-[10px]" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="mobile"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="relative group">
                            <div className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center rounded-full border border-slate-200 transition-all group-focus-within:border-primary group-focus-within:ring-4 group-focus-within:ring-primary/10">
                              <Phone className="h-3.5 w-3.5 text-slate-400 group-focus-within:text-primary transition-colors" />
                            </div>
                            <Input type="tel" placeholder="Mobile Number *" {...field} className="pl-11 h-10 bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-700 rounded-lg font-medium text-xs transition-all focus:ring-2 focus:ring-primary/20" />
                          </div>
                        </FormControl>
                        <FormMessage className="text-[10px]" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="relative group">
                            <div className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center rounded-full border border-slate-200 transition-all group-focus-within:border-primary group-focus-within:ring-4 group-focus-within:ring-primary/10">
                              <Mail className="h-3.5 w-3.5 text-slate-400 group-focus-within:text-primary transition-colors" />
                            </div>
                            <Input type="email" placeholder="Email Address *" {...field} className="pl-11 h-10 bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-700 rounded-lg font-medium text-xs transition-all focus:ring-2 focus:ring-primary/20" />
                          </div>
                        </FormControl>
                        <FormMessage className="text-[10px]" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem>
                        <div className="relative group">
                          <div className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center rounded-full border border-slate-200 transition-all group-focus-within:border-primary group-focus-within:ring-4 group-focus-within:ring-primary/10 pointer-events-none z-10">
                            <Globe className="h-3.5 w-3.5 text-slate-400 group-focus-within:text-primary transition-colors" />
                          </div>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className={cn(
                                "pl-11 h-10 bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-700 rounded-lg font-medium text-xs transition-all focus:ring-2 focus:ring-primary/20",
                                !field.value && "text-slate-400"
                              )}>
                                <SelectValue placeholder="Select Country *" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {countries.map(c => <SelectItem key={c} value={c} className="text-xs">{c}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        </div>
                        <FormMessage className="text-[10px]" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        <div className="relative group">
                          <div className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center rounded-full border border-slate-200 transition-all group-focus-within:border-primary group-focus-within:ring-4 group-focus-within:ring-primary/10 pointer-events-none z-10">
                            <MapPin className="h-3.5 w-3.5 text-slate-400 group-focus-within:text-primary transition-colors" />
                          </div>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className={cn(
                                "pl-11 h-10 bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-700 rounded-lg font-medium text-xs transition-all focus:ring-2 focus:ring-primary/20",
                                !field.value && "text-slate-400"
                              )}>
                                <SelectValue placeholder="Select State *" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {indianStates.map(s => <SelectItem key={s} value={s} className="text-xs">{s}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        </div>
                        <FormMessage className="text-[10px]" />
                      </FormItem>
                    )}
                  />

                  <div className="pt-2 space-y-4">
                    <Button type="submit" className="w-full h-11 text-[11px] font-black bg-primary hover:bg-primary/90 text-white rounded-lg shadow-none transition-all active:scale-[0.98] group uppercase" disabled={form.formState.isSubmitting}>
                      {form.formState.isSubmitting ? 'PROCESSING...' : 'Book Free Demo'}
                      <Send className="ml-2 h-3.5 w-3.5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                    </Button>
                    
                    <div className="flex items-center gap-3">
                      <Separator className="flex-1" />
                      <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">OR</span>
                      <Separator className="flex-1" />
                    </div>

                    <Button type="button" variant="outline" asChild className="w-full h-11 rounded-lg border-emerald-500 text-emerald-600 hover:bg-emerald-50 font-black text-[10px] uppercase tracking-widest transition-all">
                      <a href="https://wa.me/918860040010" target="_blank" rel="noopener noreferrer">
                        <MessageCircle className="w-4 h-4 mr-2 fill-current" />
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

      <Dialog open={isSuccessOpen} onOpenChange={setIsSuccessOpen}>
        <DialogContent className="rounded-xl max-w-sm">
          <DialogHeader>
            <div className="flex justify-center mb-4">
              <div className="bg-green-100 p-3 rounded-full">
                <CheckCircle className="w-12 h-12 text-green-500" />
              </div>
            </div>
            <DialogTitle className="text-center text-xl font-black tracking-tight text-slate-900">Booking Confirmed!</DialogTitle>
            <DialogDescription className="text-center font-semibold text-xs text-slate-600">
              Thank you for booking your free demo. Our academic counselor will contact you shortly to schedule your session.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setIsSuccessOpen(false)} className="w-full h-10 rounded-lg font-black text-[10px] uppercase tracking-widest shadow-lg shadow-primary/10">
              Close & Return
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
