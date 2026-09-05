
'use client';

import { Button } from "@/components/ui/button";
import { MessageCircle, User, Mail, Phone, Edit, Headset, Copy, CheckCircle2, MapPin, Send, GraduationCap, ShieldCheck, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { FormModalDialogContent } from "@/components/ui/form-modal-dialog";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { requestCallBack, submitSupportTicket } from "@/app/actions/forms";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { allPrograms } from "@/lib/courses";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const callBackSchema = z.object({
  name: z.string().min(2, { message: "Name is required." }),
  mobile: z.string().regex(/^\d{10}$/, { message: "Please enter a valid 10-digit mobile number." }),
  email: z.string().email({ message: "Please enter a valid email address." }).optional().or(z.literal('')),
  place: z.string().min(1, { message: "Place is required." }),
  classCourse: z.string().min(1, { message: "Class/Course is required." }),
});
type CallBackFormValues = z.infer<typeof callBackSchema>;

const supportTicketSchema = z.object({
    studentName: z.string().min(2, { message: "Name must be at least 2 characters." }),
    email: z.string().email({ message: "Please enter a valid email." }),
    mobile: z.string().regex(/^\d{10}$/, { message: "Please enter a valid 10-digit mobile number." }),
    problem: z.string().min(10, { message: "Please describe your problem in at least 10 characters." }),
});
type SupportTicketValues = z.infer<typeof supportTicketSchema>;


export function GetAppSection() {
    const { toast } = useToast();
    const [isCallbackDialogOpen, setIsCallbackDialogOpen] = useState(false);
    const [isSupportDialogOpen, setIsSupportDialogOpen] = useState(false);
    const [submittedTicketId, setSubmittedTicketId] = useState<string | null>(null);

    const callBackForm = useForm<CallBackFormValues>({
        resolver: zodResolver(callBackSchema),
        defaultValues: {
            name: '',
            mobile: '',
            email: '',
            place: '',
            classCourse: '',
        },
    });

    const supportForm = useForm<SupportTicketValues>({
        resolver: zodResolver(supportTicketSchema),
        defaultValues: {
            studentName: '',
            email: '',
            mobile: '',
            problem: '',
        },
    });

    const onCallBackSubmit: SubmitHandler<CallBackFormValues> = async (data) => {
        const result = await requestCallBack(data);
        if (result.success) {
            toast({
                title: "Request Received",
                description: result.message,
            });
            callBackForm.reset();
            setIsCallbackDialogOpen(false);
        } else {
            toast({
                variant: "destructive",
                title: "Request Failed",
                description: result.message,
            });
        }
    };

    const onSupportSubmit: SubmitHandler<SupportTicketValues> = async (data) => {
        const result = await submitSupportTicket(data);
        if (result.success) {
            setSubmittedTicketId(result.ticketId || null);
            supportForm.reset();
            setIsSupportDialogOpen(false);
        } else {
            toast({ variant: "destructive", title: "Error", description: result.message });
        }
    };
    
    const handleCopyToClipboard = () => {
        if (submittedTicketId) {
            navigator.clipboard.writeText(submittedTicketId);
            toast({
                title: "Copied to clipboard!",
                description: `Ticket ID: ${submittedTicketId}`,
            });
        }
    };
    
  return (
    <>
    <section className="w-full pt-1 pb-6 md:pb-8 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 md:px-6">
        {/* Support Area: Need Help? We're Here. */}
        <div className="max-w-3xl mx-auto mb-5 sm:mb-6">
          <div className="text-center mb-2.5">
            <h3 className="text-xs sm:text-sm font-extrabold text-[#0B1F4B] dark:text-slate-200 uppercase tracking-wider">
              Need Help? We&apos;re Here.
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-2 sm:p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800">
            {/* Action 1: Technical Support */}
            <Dialog open={isSupportDialogOpen} onOpenChange={setIsSupportDialogOpen}>
              <DialogTrigger asChild>
                <button className="relative flex items-center gap-3.5 sm:gap-4 p-3.5 sm:p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-[#1F4FA3]/40 dark:hover:border-blue-500/40 hover:shadow-xs transition-all duration-200 group overflow-hidden text-left cursor-pointer active:scale-[0.99]">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/50 group-hover:bg-blue-100/60 dark:group-hover:bg-blue-900/40 group-hover:border-blue-200 dark:group-hover:border-blue-800 flex items-center justify-center shrink-0 transition-all duration-200">
                    <Headset className="w-5 h-5 sm:w-6 sm:h-6 text-[#1F4FA3] dark:text-blue-400 transition-transform duration-200 group-hover:scale-105" strokeWidth={1.8} />
                  </div>
                  <div className="space-y-0.5 min-w-0 flex-1">
                    <p className="text-[14px] sm:text-[15px] font-extrabold text-[#0B1F4B] dark:text-white tracking-tight">Technical Support</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Get help with your IDL experience.</p>
                  </div>
                </button>
              </DialogTrigger>
            <FormModalDialogContent 
                onOpenAutoFocus={(e) => e.preventDefault()}
                onCloseAutoFocus={(e) => e.preventDefault()}
            >
                <DialogHeader className="px-5 sm:px-7 pt-5 pb-3 text-left shrink-0 border-b border-slate-100 dark:border-slate-800/80">
                    <DialogTitle className="text-left text-xl sm:text-2xl font-bold text-[#102A68] dark:text-white tracking-tight leading-snug">
                        Raise a Support Ticket
                    </DialogTitle>
                    <DialogDescription className="text-left text-[13px] sm:text-[14px] font-normal text-slate-500 dark:text-slate-400 mt-0.5 leading-normal">
                        Experiencing an issue with portal, study app or account? Submit your details below.
                    </DialogDescription>
                </DialogHeader>
                <Form {...supportForm}>
                    <form onSubmit={supportForm.handleSubmit(onSupportSubmit)} className="flex flex-col flex-1 h-full min-h-0 overflow-hidden" autoComplete="off">
                        <div className="px-5 sm:px-7 py-4 sm:py-5 space-y-3.5 sm:space-y-4 text-left overflow-y-auto flex-1 min-h-0 overscroll-contain">
                            {/* Row 1: Student Name & Mobile */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                                <FormField
                                    control={supportForm.control}
                                    name="studentName"
                                    render={({ field }) => (
                                        <FormItem className="space-y-1.5">
                                            <FormLabel className="text-[13px] sm:text-[14px] font-semibold text-[#18233A] dark:text-slate-200 flex items-center gap-1.5">
                                                <User className="h-3.5 w-3.5 text-[#102A68] dark:text-blue-400" />
                                                Full Name <span className="text-[#E11D48]">*</span>
                                            </FormLabel>
                                            <FormControl>
                                                <div className="relative rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs focus-within:border-[#1F4FA3] focus-within:ring-2 focus-within:ring-[#1F4FA3]/15 transition-all">
                                                    <Input 
                                                        placeholder="e.g. Rahul Sharma" 
                                                        {...field} 
                                                        autoFocus={false}
                                                        className="h-10 sm:h-11 border-0 bg-transparent text-[14px] sm:text-[15px] font-medium text-[#18233A] dark:text-slate-100 placeholder:text-[13px] sm:placeholder:text-[14px] placeholder:text-slate-400 focus-visible:ring-0 focus-visible:ring-offset-0 focus:ring-0 focus:outline-none outline-none px-3 capitalize" 
                                                    />
                                                </div>
                                            </FormControl>
                                            <FormMessage className="text-[12px] font-medium text-rose-500 pt-0.5" />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={supportForm.control}
                                    name="mobile"
                                    render={({ field }) => (
                                        <FormItem className="space-y-1.5">
                                            <FormLabel className="text-[13px] sm:text-[14px] font-semibold text-[#18233A] dark:text-slate-200 flex items-center gap-1.5">
                                                <Phone className="h-3.5 w-3.5 text-[#102A68] dark:text-blue-400" />
                                                Mobile Number <span className="text-[#E11D48]">*</span>
                                            </FormLabel>
                                            <FormControl>
                                                <div className="relative rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs focus-within:border-[#1F4FA3] focus-within:ring-2 focus-within:ring-[#1F4FA3]/15 transition-all">
                                                    <Input 
                                                        type="tel" 
                                                        maxLength={10} 
                                                        placeholder="e.g. 9876543210" 
                                                        {...field} 
                                                        autoFocus={false}
                                                        className="h-10 sm:h-11 border-0 bg-transparent text-[14px] sm:text-[15px] font-medium text-[#18233A] dark:text-slate-100 placeholder:text-[13px] sm:placeholder:text-[14px] placeholder:text-slate-400 focus-visible:ring-0 focus-visible:ring-offset-0 focus:ring-0 focus:outline-none outline-none px-3" 
                                                    />
                                                </div>
                                            </FormControl>
                                            <FormMessage className="text-[12px] font-medium text-rose-500 pt-0.5" />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Row 2: Email */}
                            <FormField
                                control={supportForm.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem className="space-y-1.5">
                                        <FormLabel className="text-[13px] sm:text-[14px] font-semibold text-[#18233A] dark:text-slate-200 flex items-center gap-1.5">
                                            <Mail className="h-3.5 w-3.5 text-[#102A68] dark:text-blue-400" />
                                            Email Address <span className="text-[#E11D48]">*</span>
                                        </FormLabel>
                                        <FormControl>
                                            <div className="relative rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs focus-within:border-[#1F4FA3] focus-within:ring-2 focus-within:ring-[#1F4FA3]/15 transition-all">
                                                <Input 
                                                    type="email" 
                                                    placeholder="e.g. rahul@example.com" 
                                                    {...field} 
                                                    autoFocus={false}
                                                    className="h-10 sm:h-11 border-0 bg-transparent text-[14px] sm:text-[15px] font-medium text-[#18233A] dark:text-slate-100 placeholder:text-[13px] sm:placeholder:text-[14px] placeholder:text-slate-400 focus-visible:ring-0 focus-visible:ring-offset-0 focus:ring-0 focus:outline-none outline-none px-3" 
                                                />
                                            </div>
                                        </FormControl>
                                        <FormMessage className="text-[12px] font-medium text-rose-500 pt-0.5" />
                                    </FormItem>
                                )}
                            />

                            {/* Row 3: Problem Description */}
                            <FormField
                                control={supportForm.control}
                                name="problem"
                                render={({ field }) => (
                                    <FormItem className="space-y-1.5">
                                        <FormLabel className="text-[13px] sm:text-[14px] font-semibold text-[#18233A] dark:text-slate-200 flex items-center gap-1.5">
                                            <Edit className="h-3.5 w-3.5 text-[#102A68] dark:text-blue-400" />
                                            Describe Your Issue <span className="text-[#E11D48]">*</span>
                                        </FormLabel>
                                        <FormControl>
                                            <div className="relative rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs focus-within:border-[#1F4FA3] focus-within:ring-2 focus-within:ring-[#1F4FA3]/15 transition-all">
                                                <Textarea 
                                                    placeholder="Describe the issue or error you are encountering in detail..." 
                                                    className="min-h-[85px] border-0 bg-transparent text-[14px] sm:text-[15px] font-medium text-[#18233A] dark:text-slate-100 placeholder:text-[13px] sm:placeholder:text-[14px] placeholder:text-slate-400 focus-visible:ring-0 focus-visible:ring-offset-0 focus:ring-0 focus:outline-none outline-none p-3 resize-none leading-relaxed" 
                                                    {...field} 
                                                    autoFocus={false}
                                                />
                                            </div>
                                        </FormControl>
                                        <FormMessage className="text-[12px] font-medium text-rose-500 pt-0.5" />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Sticky Footer: Unified CTA & Trust Line */}
                        <div className="px-5 sm:px-7 py-3 sm:py-3.5 bg-white/95 dark:bg-slate-950/95 backdrop-blur-sm border-t border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0 mt-auto sticky bottom-0 z-20 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
                            <div className="flex items-center justify-center sm:justify-start gap-1.5 text-[11px] sm:text-[12px] text-slate-500 dark:text-slate-400 font-medium order-2 sm:order-1">
                                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                                <span>Priority support desk. Fast resolution guaranteed.</span>
                            </div>

                            <Button 
                                type="submit" 
                                disabled={supportForm.formState.isSubmitting}
                                className="h-10 sm:h-11 px-6 sm:px-7 rounded-xl text-[13px] sm:text-[14px] font-semibold bg-[#102A68] hover:bg-[#0C1E4A] text-white shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 cursor-pointer w-full sm:w-auto order-1 sm:order-2" 
                            >
                                <span>{supportForm.formState.isSubmitting ? 'Submitting Ticket...' : 'Raise Support Ticket'}</span>
                                <ArrowRight className="w-4 h-4" />
                            </Button>
                        </div>
                    </form>
                </Form>
            </FormModalDialogContent>
          </Dialog>

            {/* Action 2: Talk to an Expert */}
            <Dialog open={isCallbackDialogOpen} onOpenChange={setIsCallbackDialogOpen}>
              <DialogTrigger asChild>
                <button className="relative flex items-center gap-3.5 sm:gap-4 p-3.5 sm:p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-emerald-600/40 dark:hover:border-emerald-500/40 hover:shadow-xs transition-all duration-200 group overflow-hidden text-left cursor-pointer active:scale-[0.99]">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/50 group-hover:bg-emerald-100/60 dark:group-hover:bg-emerald-900/40 group-hover:border-emerald-200 dark:group-hover:border-emerald-800 flex items-center justify-center shrink-0 transition-all duration-200">
                    <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600 dark:text-emerald-400 transition-transform duration-200 group-hover:scale-105" strokeWidth={1.8} />
                  </div>
                  <div className="space-y-0.5 min-w-0 flex-1">
                    <p className="text-[14px] sm:text-[15px] font-extrabold text-[#0B1F4B] dark:text-white tracking-tight">Talk to an Expert</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Have a question? Let’s help.</p>
                  </div>
                </button>
              </DialogTrigger>
            <FormModalDialogContent 
                onOpenAutoFocus={(e) => e.preventDefault()}
                onCloseAutoFocus={(e) => e.preventDefault()}
            >
                <DialogHeader className="px-5 sm:px-7 pt-5 pb-3 text-left shrink-0 border-b border-slate-100 dark:border-slate-800/80">
                    <DialogTitle className="text-left text-xl sm:text-2xl font-bold text-[#102A68] dark:text-white tracking-tight leading-snug">
                        Talk to Our Expert
                    </DialogTitle>
                    <DialogDescription className="text-left text-[13px] sm:text-[14px] font-normal text-slate-500 dark:text-slate-400 mt-0.5 leading-normal">
                        Have questions on courses, batches, or career roadmap? Request an expert call back.
                    </DialogDescription>
                </DialogHeader>
                 <Form {...callBackForm}>
                    <form onSubmit={callBackForm.handleSubmit(onCallBackSubmit)} className="flex flex-col flex-1 h-full min-h-0 overflow-hidden" autoComplete="off">
                        <div className="px-5 sm:px-7 py-4 sm:py-5 space-y-3.5 sm:space-y-4 text-left overflow-y-auto flex-1 min-h-0 overscroll-contain">
                            {/* Row 1: Name & Mobile */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                                <FormField
                                    control={callBackForm.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem className="space-y-1.5">
                                            <FormLabel className="text-[13px] sm:text-[14px] font-semibold text-[#18233A] dark:text-slate-200 flex items-center gap-1.5">
                                                <User className="h-3.5 w-3.5 text-[#102A68] dark:text-blue-400" />
                                                Full Name <span className="text-[#E11D48]">*</span>
                                            </FormLabel>
                                            <FormControl>
                                                <div className="relative rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs focus-within:border-[#1F4FA3] focus-within:ring-2 focus-within:ring-[#1F4FA3]/15 transition-all">
                                                    <Input 
                                                        placeholder="e.g. Rahul Sharma" 
                                                        {...field} 
                                                        autoFocus={false}
                                                        className="h-10 sm:h-11 border-0 bg-transparent text-[14px] sm:text-[15px] font-medium text-[#18233A] dark:text-slate-100 placeholder:text-[13px] sm:placeholder:text-[14px] placeholder:text-slate-400 focus-visible:ring-0 focus-visible:ring-offset-0 focus:ring-0 focus:outline-none outline-none px-3 capitalize" 
                                                    />
                                                </div>
                                            </FormControl>
                                            <FormMessage className="text-[12px] font-medium text-rose-500 pt-0.5" />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={callBackForm.control}
                                    name="mobile"
                                    render={({ field }) => (
                                        <FormItem className="space-y-1.5">
                                            <FormLabel className="text-[13px] sm:text-[14px] font-semibold text-[#18233A] dark:text-slate-200 flex items-center gap-1.5">
                                                <Phone className="h-3.5 w-3.5 text-[#102A68] dark:text-blue-400" />
                                                Mobile Number <span className="text-[#E11D48]">*</span>
                                            </FormLabel>
                                            <FormControl>
                                                <div className="relative rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs focus-within:border-[#1F4FA3] focus-within:ring-2 focus-within:ring-[#1F4FA3]/15 transition-all">
                                                    <Input 
                                                        type="tel" 
                                                        maxLength={10} 
                                                        placeholder="e.g. 9876543210" 
                                                        {...field} 
                                                        autoFocus={false}
                                                        className="h-10 sm:h-11 border-0 bg-transparent text-[14px] sm:text-[15px] font-medium text-[#18233A] dark:text-slate-100 placeholder:text-[13px] sm:placeholder:text-[14px] placeholder:text-slate-400 focus-visible:ring-0 focus-visible:ring-offset-0 focus:ring-0 focus:outline-none outline-none px-3" 
                                                    />
                                                </div>
                                            </FormControl>
                                            <FormMessage className="text-[12px] font-medium text-rose-500 pt-0.5" />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Row 2: Email & Location */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                                <FormField
                                    control={callBackForm.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem className="space-y-1.5">
                                            <FormLabel className="text-[13px] sm:text-[14px] font-semibold text-[#18233A] dark:text-slate-200 flex items-center gap-1.5">
                                                <Mail className="h-3.5 w-3.5 text-[#102A68] dark:text-blue-400" />
                                                Email (Optional)
                                            </FormLabel>
                                            <FormControl>
                                                <div className="relative rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs focus-within:border-[#1F4FA3] focus-within:ring-2 focus-within:ring-[#1F4FA3]/15 transition-all">
                                                    <Input 
                                                        type="email" 
                                                        placeholder="e.g. rahul@example.com" 
                                                        {...field} 
                                                        autoFocus={false}
                                                        className="h-10 sm:h-11 border-0 bg-transparent text-[14px] sm:text-[15px] font-medium text-[#18233A] dark:text-slate-100 placeholder:text-[13px] sm:placeholder:text-[14px] placeholder:text-slate-400 focus-visible:ring-0 focus-visible:ring-offset-0 focus:ring-0 focus:outline-none outline-none px-3" 
                                                    />
                                                </div>
                                            </FormControl>
                                            <FormMessage className="text-[12px] font-medium text-rose-500 pt-0.5" />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={callBackForm.control}
                                    name="place"
                                    render={({ field }) => (
                                        <FormItem className="space-y-1.5">
                                            <FormLabel className="text-[13px] sm:text-[14px] font-semibold text-[#18233A] dark:text-slate-200 flex items-center gap-1.5">
                                                <MapPin className="h-3.5 w-3.5 text-[#102A68] dark:text-blue-400" />
                                                Location / City <span className="text-[#E11D48]">*</span>
                                            </FormLabel>
                                            <FormControl>
                                                <div className="relative rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs focus-within:border-[#1F4FA3] focus-within:ring-2 focus-within:ring-[#1F4FA3]/15 transition-all">
                                                    <Input 
                                                        placeholder="e.g. Patna, Bihar" 
                                                        {...field} 
                                                        autoFocus={false}
                                                        className="h-10 sm:h-11 border-0 bg-transparent text-[14px] sm:text-[15px] font-medium text-[#18233A] dark:text-slate-100 placeholder:text-[13px] sm:placeholder:text-[14px] placeholder:text-slate-400 focus-visible:ring-0 focus-visible:ring-offset-0 focus:ring-0 focus:outline-none outline-none px-3 capitalize" 
                                                    />
                                                </div>
                                            </FormControl>
                                            <FormMessage className="text-[12px] font-medium text-rose-500 pt-0.5" />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Row 3: Target Class / Course */}
                            <FormField
                                control={callBackForm.control}
                                name="classCourse"
                                render={({ field }) => (
                                    <FormItem className="space-y-1.5">
                                        <FormLabel className="text-[13px] sm:text-[14px] font-semibold text-[#18233A] dark:text-slate-200 flex items-center gap-1.5">
                                            <GraduationCap className="h-3.5 w-3.5 text-[#102A68] dark:text-blue-400" />
                                            Target Class / Course <span className="text-[#E11D48]">*</span>
                                        </FormLabel>
                                        <FormControl>
                                            <div className="relative rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs focus-within:border-[#1F4FA3] focus-within:ring-2 focus-within:ring-[#1F4FA3]/15 transition-all">
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <SelectTrigger className="h-10 sm:h-11 border-0 bg-transparent text-[14px] sm:text-[15px] font-medium text-[#18233A] dark:text-slate-100 focus-visible:ring-0 focus-visible:ring-offset-0 focus:ring-0 focus:outline-none outline-none ring-0 ring-offset-0 px-3">
                                                        <SelectValue placeholder="Select Target Class or Course *" />
                                                    </SelectTrigger>
                                                    <SelectContent className="max-h-56">
                                                        {allPrograms.map(program => (
                                                            <SelectItem key={program.name} value={program.name} className="text-[13px] sm:text-[14px] font-medium text-[#18233A] dark:text-slate-100">{program.name}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </FormControl>
                                        <FormMessage className="text-[12px] font-medium text-rose-500 pt-0.5" />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Sticky Footer: Unified CTA & Trust Line */}
                        <div className="px-5 sm:px-7 py-3 sm:py-3.5 bg-white/95 dark:bg-slate-950/95 backdrop-blur-sm border-t border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0 mt-auto sticky bottom-0 z-20 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
                            <div className="flex items-center justify-center sm:justify-start gap-1.5 text-[11px] sm:text-[12px] text-slate-500 dark:text-slate-400 font-medium order-2 sm:order-1">
                                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                                <span>Verified academic guidance. Quick counselor callback.</span>
                            </div>

                            <Button 
                                type="submit" 
                                disabled={callBackForm.formState.isSubmitting}
                                className="h-10 sm:h-11 px-6 sm:px-7 rounded-xl text-[13px] sm:text-[14px] font-semibold bg-[#102A68] hover:bg-[#0C1E4A] text-white shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 cursor-pointer w-full sm:w-auto order-1 sm:order-2" 
                            >
                                <span>{callBackForm.formState.isSubmitting ? 'Requesting Call Back...' : 'Get a Call Back'}</span>
                                <ArrowRight className="w-4 h-4" />
                            </Button>
                        </div>
                    </form>
                </Form>
            </FormModalDialogContent>
          </Dialog>
          </div>
        </div>
        
        {/* Learning App Section */}
        <div className="relative rounded-[22px] bg-white dark:bg-card p-5 sm:p-7 md:p-8 border border-slate-200/80 dark:border-border/60 shadow-sm md:shadow-md overflow-hidden">
          {/* Background Texture & Map Silhouette */}
          <div className="absolute inset-0 bg-dot-pattern opacity-30 pointer-events-none" />
          <div className="absolute right-0 bottom-0 opacity-[0.03] pointer-events-none translate-x-1/4 translate-y-1/4 w-full h-full max-w-2xl">
            <Image 
              src="https://upload.wikimedia.org/wikipedia/commons/e/e0/India_map_silhouette.svg" 
              alt="India Map silhouette" 
              fill 
              className="object-contain"
            />
          </div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
            {/* LEFT (Desktop) / TOP (Mobile): Prominent Smartphone Illustration (+30-40% visual size) */}
            <div className="lg:col-span-6 relative w-full h-60 sm:h-72 md:h-80 lg:h-[350px] flex items-center justify-center">
              <div className="relative w-full h-full">
                <div className="absolute inset-4 bg-primary/5 rounded-[2rem] blur-2xl pointer-events-none" />
                <Image
                  src="/idlapp.png"
                  alt="IDL Education App Features"
                  data-ai-hint="education app mobile"
                  fill
                  className="object-contain drop-shadow-xl"
                  priority
                />
              </div>
            </div>

            {/* RIGHT (Desktop) / BELOW (Mobile): Content, Bullets & Download/QR */}
            <div className="lg:col-span-6 flex flex-col items-start text-left space-y-4">
              <div className="space-y-1.5">
                <h2 className="text-2xl sm:text-[28px] lg:text-[30px] font-extrabold tracking-tight text-slate-900 dark:text-white">
                  <span>IDL </span>
                  <span className="text-[0.86em] font-bold text-slate-500 dark:text-slate-400 tracking-normal">
                    Learning App
                  </span>
                </h2>
              </div>

              <ul className="space-y-2 w-full">
                {[
                  "Access free high-quality video lessons",
                  "Interactive doubt clearing sessions",
                  "Premium study materials and mock tests"
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center justify-start gap-2.5">
                    <div className="bg-primary/10 p-1 rounded-full text-primary shrink-0">
                      <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                    </div>
                    <span className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">{item}</span>
                  </li>
                ))}
              </ul>

              {/* Download / QR Quick Scan Area */}
              <div className="w-full pt-1">
                <div className="flex items-center justify-between sm:justify-start gap-2.5 sm:gap-3.5 p-3 sm:p-3.5 bg-slate-50 dark:bg-slate-900/40 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs w-full sm:w-fit">
                  {/* Store Badges */}
                  <div className="flex flex-col gap-1.5 shrink-0">
                    {/* Google Play */}
                    <div className="bg-white dark:bg-slate-800 p-2 rounded-xl shadow-xs border border-border/50 flex items-center gap-2">
                      <Image
                        src="https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/google-play-store-icon.png"
                        alt="Google Play"
                        data-ai-hint="google play"
                        width={20}
                        height={20}
                        className="object-contain shrink-0"
                      />
                      <div className="flex flex-col -space-y-1">
                        <span className="text-[7px] font-bold text-slate-500 uppercase tracking-tight">GET IT ON</span>
                        <span className="text-[11px] font-extrabold text-foreground tracking-tight">Google Play</span>
                      </div>
                    </div>
                    
                    {/* App Store */}
                    <div className="bg-white dark:bg-slate-800 p-2 rounded-xl shadow-xs border border-border/50 flex items-center gap-2">
                      <Image
                        src="https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/apple-app-store-icon.png"
                        alt="App Store"
                        data-ai-hint="app store"
                        width={20}
                        height={20}
                        className="object-contain shrink-0"
                      />
                      <div className="flex flex-col -space-y-1">
                        <span className="text-[7px] font-bold text-slate-500 uppercase tracking-tight">Download on</span>
                        <span className="text-[11px] font-extrabold text-foreground tracking-tight">App Store</span>
                      </div>
                    </div>
                  </div>

                  {/* Text */}
                  <div className="min-w-0 sm:shrink-0 pr-1 sm:pr-0">
                    <p className="text-[10px] font-bold uppercase tracking-wide text-primary mb-0.5">Quick Scan</p>
                    <p className="text-xs sm:text-sm font-extrabold leading-tight text-foreground">Get IDL Learning App</p>
                  </div>

                  {/* QR Code */}
                  <div className="bg-white p-2 rounded-xl shadow-xs border border-border/60 shrink-0 flex items-center justify-center">
                    <Image
                      src="https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg"
                      alt="QR Code"
                      data-ai-hint="qr code"
                      width={70}
                      height={70}
                      className="w-[58px] h-[58px] sm:w-[68px] sm:h-[68px] object-contain opacity-95"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
    <Dialog open={!!submittedTicketId} onOpenChange={() => setSubmittedTicketId(null)}>
      <FormModalDialogContent className="max-w-[480px]">
        <div className="p-6 sm:p-7 text-center">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-100 dark:border-emerald-900/50 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-[#102A68] dark:text-white tracking-tight">Ticket Submitted!</h3>
          <p className="text-[13px] sm:text-[14px] text-slate-500 dark:text-slate-400 mt-1.5 leading-normal">
            Your support ticket has been successfully submitted. Our team will review it and get back to you shortly.
          </p>

          <div 
            className="my-5 flex items-center justify-between p-4 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/80 dark:bg-slate-900/80 cursor-pointer hover:border-[#1F4FA3] transition-colors"
            onClick={handleCopyToClipboard}
          >
            <div className="flex flex-col text-left">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">Your Reference ID</span>
              <span className="font-mono font-bold text-base sm:text-lg text-[#102A68] dark:text-blue-400">{submittedTicketId}</span>
            </div>
            <Copy className="w-4 h-4 text-slate-400" />
          </div>

          <Button onClick={() => setSubmittedTicketId(null)} className="w-full h-10 sm:h-11 rounded-xl text-[13px] sm:text-[14px] font-semibold bg-[#102A68] hover:bg-[#0C1E4A] text-white shadow-sm hover:shadow transition-all cursor-pointer">
            Close &amp; Return
          </Button>
        </div>
      </FormModalDialogContent>
    </Dialog>
    </>
  );
}
