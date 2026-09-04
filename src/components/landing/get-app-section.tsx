
'use client';

import { Button } from "@/components/ui/button";
import { MessageCircle, User, Mail, Phone, Edit, Headset, Copy, CheckCircle2, MapPin, Send, GraduationCap, ShieldCheck } from "lucide-react";
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
                <button className="relative flex items-center gap-3.5 p-3.5 sm:p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-[#1F4FA3]/50 dark:hover:border-blue-500/50 hover:shadow-xs transition-all duration-200 group overflow-hidden text-left cursor-pointer active:scale-[0.99]">
                  <div className="w-11 h-11 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-900/50 flex items-center justify-center shrink-0 group-hover:bg-[#1F4FA3] transition-colors duration-200">
                    <Headset className="w-5 h-5 text-[#1F4FA3] dark:text-blue-400 group-hover:text-white transition-colors duration-200" />
                  </div>
                  <div className="space-y-0.5 min-w-0">
                    <p className="text-[14px] sm:text-[15px] font-extrabold text-[#0B1F4B] dark:text-white tracking-tight">Technical Support</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Get help with your IDL experience.</p>
                  </div>
                </button>
              </DialogTrigger>
            <DialogContent 
                onOpenAutoFocus={(e) => e.preventDefault()}
                onCloseAutoFocus={(e) => e.preventDefault()}
                className="w-[95vw] sm:w-full sm:max-w-[495px] shadow-lg rounded-2xl border border-[#D5DDEA] dark:border-slate-800 bg-white dark:bg-slate-950 p-0 overflow-hidden top-[calc(4rem+1rem)] sm:top-[calc(4rem+1.25rem)] translate-y-0 max-h-[calc(100dvh-7.5rem)] sm:max-h-[calc(100dvh-8rem)] flex flex-col data-[state=open]:slide-in-from-top-6 data-[state=open]:duration-300 data-[state=closed]:slide-out-to-top-6 data-[state=closed]:duration-200 ease-out"
            >
                <DialogHeader className="px-5 sm:px-7 pt-5 pb-2 text-left shrink-0">
                    <DialogTitle className="text-left text-2xl sm:text-[26px] font-bold text-[#18233A] tracking-tight leading-snug">
                        Raise a Support Ticket
                    </DialogTitle>
                    <DialogDescription className="text-left text-[14px] sm:text-[15px] font-normal text-[#52627A] mt-1 leading-relaxed">
                        Experiencing an issue with portal, study app or account? Submit your details below.
                    </DialogDescription>
                </DialogHeader>
                <Form {...supportForm}>
                    <form onSubmit={supportForm.handleSubmit(onSupportSubmit)} className="px-5 sm:px-7 py-4 sm:py-5 space-y-4 sm:space-y-4.5 text-left overflow-y-auto flex-1 min-h-0 overscroll-contain" autoComplete="off">
                        {/* Row 1: Student Name & Mobile */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                            <FormField
                                control={supportForm.control}
                                name="studentName"
                                render={({ field }) => (
                                    <FormItem className="space-y-0">
                                        <FormLabel className="text-[15px] sm:text-[16px] font-semibold text-[#18233A] flex items-center gap-2 mb-2">
                                            <User className="h-4 w-4 text-[#102A68]" />
                                            Full Name <span className="text-[#E11D48]">*</span>
                                        </FormLabel>
                                        <FormControl>
                                            <div className="relative rounded-[11px] border-[1.5px] border-[#D5DDEA] bg-white shadow-xs">
                                                <Input 
                                                    placeholder="e.g. Rahul Sharma" 
                                                    {...field} 
                                                    autoFocus={false}
                                                    className="h-12 border-0 bg-transparent text-[16px] sm:text-[17px] font-medium text-[#18233A] placeholder:text-[#94A3BA] focus-visible:ring-0 focus-visible:ring-offset-0 focus:ring-0 focus:outline-none outline-none px-3.5 capitalize" 
                                                />
                                            </div>
                                        </FormControl>
                                        <FormMessage className="text-[12px] font-medium text-rose-500 pt-1" />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={supportForm.control}
                                name="mobile"
                                render={({ field }) => (
                                    <FormItem className="space-y-0">
                                        <FormLabel className="text-[15px] sm:text-[16px] font-semibold text-[#18233A] flex items-center gap-2 mb-2">
                                            <Phone className="h-4 w-4 text-[#102A68]" />
                                            Mobile Number <span className="text-[#E11D48]">*</span>
                                        </FormLabel>
                                        <FormControl>
                                            <div className="relative rounded-[11px] border-[1.5px] border-[#D5DDEA] bg-white shadow-xs">
                                                <Input 
                                                    type="tel" 
                                                    maxLength={10} 
                                                    placeholder="e.g. 9876543210" 
                                                    {...field} 
                                                    autoFocus={false}
                                                    className="h-12 border-0 bg-transparent text-[16px] sm:text-[17px] font-medium text-[#18233A] placeholder:text-[#94A3BA] focus-visible:ring-0 focus-visible:ring-offset-0 focus:ring-0 focus:outline-none outline-none px-3.5" 
                                                />
                                            </div>
                                        </FormControl>
                                        <FormMessage className="text-[12px] font-medium text-rose-500 pt-1" />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Row 2: Email */}
                        <FormField
                            control={supportForm.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem className="space-y-0">
                                    <FormLabel className="text-[15px] sm:text-[16px] font-semibold text-[#18233A] flex items-center gap-2 mb-2">
                                        <Mail className="h-4 w-4 text-[#102A68]" />
                                        Email Address <span className="text-[#E11D48]">*</span>
                                    </FormLabel>
                                    <FormControl>
                                        <div className="relative rounded-[11px] border-[1.5px] border-[#D5DDEA] bg-white shadow-xs">
                                            <Input 
                                                type="email" 
                                                placeholder="e.g. rahul@example.com" 
                                                {...field} 
                                                autoFocus={false}
                                                className="h-12 border-0 bg-transparent text-[16px] sm:text-[17px] font-medium text-[#18233A] placeholder:text-[#94A3BA] focus-visible:ring-0 focus-visible:ring-offset-0 focus:ring-0 focus:outline-none outline-none px-3.5" 
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage className="text-[12px] font-medium text-rose-500 pt-1" />
                                </FormItem>
                            )}
                        />

                        {/* Row 3: Problem Description */}
                        <FormField
                            control={supportForm.control}
                            name="problem"
                            render={({ field }) => (
                                <FormItem className="space-y-0">
                                    <FormLabel className="text-[15px] sm:text-[16px] font-semibold text-[#18233A] flex items-center gap-2 mb-2">
                                        <Edit className="h-4 w-4 text-[#102A68]" />
                                        Describe Your Issue <span className="text-[#E11D48]">*</span>
                                    </FormLabel>
                                    <FormControl>
                                        <div className="relative rounded-[11px] border-[1.5px] border-[#D5DDEA] bg-white shadow-xs">
                                            <Textarea 
                                                placeholder="Describe the issue or error you are encountering in detail..." 
                                                className="min-h-[90px] border-0 bg-transparent text-[16px] sm:text-[17px] font-medium text-[#18233A] placeholder:text-[#94A3BA] focus-visible:ring-0 focus-visible:ring-offset-0 focus:ring-0 focus:outline-none outline-none p-3.5 resize-none leading-relaxed" 
                                                {...field} 
                                                autoFocus={false}
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage className="text-[12px] font-medium text-rose-500 pt-1" />
                                </FormItem>
                            )}
                        />

                        {/* Submit & Note */}
                        <div className="pt-2 space-y-2.5">
                            <Button 
                                type="submit" 
                                className="w-full h-11 px-6 rounded-[10px] text-[15px] sm:text-[16px] font-semibold bg-[#102A68] hover:bg-[#0D2254] text-white shadow-sm hover:shadow active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer" 
                                disabled={supportForm.formState.isSubmitting}
                            >
                                <span>{supportForm.formState.isSubmitting ? 'Submitting Ticket...' : 'Raise Support Ticket'}</span>
                                <Send className="h-4 w-4" />
                            </Button>

                            <div className="flex items-center justify-center gap-1.5 text-[12px] text-[#52627A] text-center font-medium">
                                <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                                <span>Priority support desk. Fast resolution guaranteed.</span>
                            </div>
                        </div>
                    </form>
                </Form>
            </DialogContent>
          </Dialog>

            {/* Action 2: Talk to an Expert */}
            <Dialog open={isCallbackDialogOpen} onOpenChange={setIsCallbackDialogOpen}>
              <DialogTrigger asChild>
                <button className="relative flex items-center gap-3.5 p-3.5 sm:p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-emerald-600/50 dark:hover:border-emerald-500/50 hover:shadow-xs transition-all duration-200 group overflow-hidden text-left cursor-pointer active:scale-[0.99]">
                  <div className="w-11 h-11 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-100 dark:border-emerald-900/50 flex items-center justify-center shrink-0 group-hover:bg-emerald-600 transition-colors duration-200">
                    <MessageCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 group-hover:text-white transition-colors duration-200" />
                  </div>
                  <div className="space-y-0.5 min-w-0">
                    <p className="text-[14px] sm:text-[15px] font-extrabold text-[#0B1F4B] dark:text-white tracking-tight">Talk to an Expert</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Have a question? Let’s help.</p>
                  </div>
                </button>
              </DialogTrigger>
            <DialogContent 
                onOpenAutoFocus={(e) => e.preventDefault()}
                onCloseAutoFocus={(e) => e.preventDefault()}
                className="w-[95vw] sm:w-full sm:max-w-[495px] shadow-lg rounded-2xl border border-[#D5DDEA] dark:border-slate-800 bg-white dark:bg-slate-950 p-0 overflow-hidden top-[calc(4rem+1rem)] sm:top-[calc(4rem+1.25rem)] translate-y-0 max-h-[calc(100dvh-7.5rem)] sm:max-h-[calc(100dvh-8rem)] flex flex-col data-[state=open]:slide-in-from-top-6 data-[state=open]:duration-300 data-[state=closed]:slide-out-to-top-6 data-[state=closed]:duration-200 ease-out"
            >
                <DialogHeader className="px-5 sm:px-7 pt-5 pb-2 text-left shrink-0">
                    <DialogTitle className="text-left text-2xl sm:text-[26px] font-bold text-[#18233A] tracking-tight leading-snug">
                        Talk to Our Expert
                    </DialogTitle>
                    <DialogDescription className="text-left text-[14px] sm:text-[15px] font-normal text-[#52627A] mt-1 leading-relaxed">
                        Have questions on courses, batches, or career roadmap? Request an expert call back.
                    </DialogDescription>
                </DialogHeader>
                 <Form {...callBackForm}>
                    <form onSubmit={callBackForm.handleSubmit(onCallBackSubmit)} className="px-5 sm:px-7 py-4 sm:py-5 space-y-4 sm:space-y-4.5 text-left overflow-y-auto flex-1 min-h-0 overscroll-contain" autoComplete="off">
                        {/* Row 1: Name & Mobile */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                            <FormField
                                control={callBackForm.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem className="space-y-0">
                                        <FormLabel className="text-[15px] sm:text-[16px] font-semibold text-[#18233A] flex items-center gap-2 mb-2">
                                            <User className="h-4 w-4 text-[#102A68]" />
                                            Full Name <span className="text-[#E11D48]">*</span>
                                        </FormLabel>
                                        <FormControl>
                                            <div className="relative rounded-[11px] border-[1.5px] border-[#D5DDEA] bg-white shadow-xs">
                                                <Input 
                                                    placeholder="e.g. Rahul Sharma" 
                                                    {...field} 
                                                    autoFocus={false}
                                                    className="h-12 border-0 bg-transparent text-[16px] sm:text-[17px] font-medium text-[#18233A] placeholder:text-[#94A3BA] focus-visible:ring-0 focus-visible:ring-offset-0 focus:ring-0 focus:outline-none outline-none px-3.5 capitalize" 
                                                />
                                            </div>
                                        </FormControl>
                                        <FormMessage className="text-[12px] font-medium text-rose-500 pt-1" />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={callBackForm.control}
                                name="mobile"
                                render={({ field }) => (
                                    <FormItem className="space-y-0">
                                        <FormLabel className="text-[15px] sm:text-[16px] font-semibold text-[#18233A] flex items-center gap-2 mb-2">
                                            <Phone className="h-4 w-4 text-[#102A68]" />
                                            Mobile Number <span className="text-[#E11D48]">*</span>
                                        </FormLabel>
                                        <FormControl>
                                            <div className="relative rounded-[11px] border-[1.5px] border-[#D5DDEA] bg-white shadow-xs">
                                                <Input 
                                                    type="tel" 
                                                    maxLength={10} 
                                                    placeholder="e.g. 9876543210" 
                                                    {...field} 
                                                    autoFocus={false}
                                                    className="h-12 border-0 bg-transparent text-[16px] sm:text-[17px] font-medium text-[#18233A] placeholder:text-[#94A3BA] focus-visible:ring-0 focus-visible:ring-offset-0 focus:ring-0 focus:outline-none outline-none px-3.5" 
                                                />
                                            </div>
                                        </FormControl>
                                        <FormMessage className="text-[12px] font-medium text-rose-500 pt-1" />
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
                                    <FormItem className="space-y-0">
                                        <FormLabel className="text-[15px] sm:text-[16px] font-semibold text-[#18233A] flex items-center gap-2 mb-2">
                                            <Mail className="h-4 w-4 text-[#102A68]" />
                                            Email (Optional)
                                        </FormLabel>
                                        <FormControl>
                                            <div className="relative rounded-[11px] border-[1.5px] border-[#D5DDEA] bg-white shadow-xs">
                                                <Input 
                                                    type="email" 
                                                    placeholder="e.g. rahul@example.com" 
                                                    {...field} 
                                                    autoFocus={false}
                                                    className="h-12 border-0 bg-transparent text-[16px] sm:text-[17px] font-medium text-[#18233A] placeholder:text-[#94A3BA] focus-visible:ring-0 focus-visible:ring-offset-0 focus:ring-0 focus:outline-none outline-none px-3.5" 
                                                />
                                            </div>
                                        </FormControl>
                                        <FormMessage className="text-[12px] font-medium text-rose-500 pt-1" />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={callBackForm.control}
                                name="place"
                                render={({ field }) => (
                                    <FormItem className="space-y-0">
                                        <FormLabel className="text-[15px] sm:text-[16px] font-semibold text-[#18233A] flex items-center gap-2 mb-2">
                                            <MapPin className="h-4 w-4 text-[#102A68]" />
                                            Location / City <span className="text-[#E11D48]">*</span>
                                        </FormLabel>
                                        <FormControl>
                                            <div className="relative rounded-[11px] border-[1.5px] border-[#D5DDEA] bg-white shadow-xs">
                                                <Input 
                                                    placeholder="e.g. Patna, Bihar" 
                                                    {...field} 
                                                    autoFocus={false}
                                                    className="h-12 border-0 bg-transparent text-[16px] sm:text-[17px] font-medium text-[#18233A] placeholder:text-[#94A3BA] focus-visible:ring-0 focus-visible:ring-offset-0 focus:ring-0 focus:outline-none outline-none px-3.5 capitalize" 
                                                />
                                            </div>
                                        </FormControl>
                                        <FormMessage className="text-[12px] font-medium text-rose-500 pt-1" />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Row 3: Target Class / Course */}
                        <FormField
                            control={callBackForm.control}
                            name="classCourse"
                            render={({ field }) => (
                                <FormItem className="space-y-0">
                                    <FormLabel className="text-[15px] sm:text-[16px] font-semibold text-[#18233A] flex items-center gap-2 mb-2">
                                        <GraduationCap className="h-4 w-4 text-[#102A68]" />
                                        Target Class / Course <span className="text-[#E11D48]">*</span>
                                    </FormLabel>
                                    <FormControl>
                                        <div className="relative rounded-[11px] border-[1.5px] border-[#D5DDEA] bg-white shadow-xs">
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <SelectTrigger className="h-12 border-0 bg-transparent text-[16px] sm:text-[17px] font-medium text-[#18233A] focus-visible:ring-0 focus-visible:ring-offset-0 focus:ring-0 focus:outline-none outline-none ring-0 ring-offset-0 px-3.5">
                                                    <SelectValue placeholder="Select Target Class or Course *" />
                                                </SelectTrigger>
                                                <SelectContent className="max-h-56">
                                                    {allPrograms.map(program => (
                                                        <SelectItem key={program.name} value={program.name} className="text-[14px] font-medium text-[#18233A]">{program.name}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </FormControl>
                                    <FormMessage className="text-[12px] font-medium text-rose-500 pt-1" />
                                </FormItem>
                            )}
                        />

                        {/* Submit & Trust Note */}
                        <div className="pt-2 space-y-2.5">
                            <Button 
                                type="submit" 
                                className="w-full h-11 px-6 rounded-[10px] text-[15px] sm:text-[16px] font-semibold bg-[#102A68] hover:bg-[#0D2254] text-white shadow-sm hover:shadow active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer" 
                                disabled={callBackForm.formState.isSubmitting}
                            >
                                <span>{callBackForm.formState.isSubmitting ? 'Requesting Call Back...' : 'Get a Call Back'}</span>
                                <Send className="h-4 w-4" />
                            </Button>

                            <div className="flex items-center justify-center gap-1.5 text-[12px] text-[#52627A] text-center font-medium">
                                <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                                <span>Direct academic guidance. 100% free consultation.</span>
                            </div>
                        </div>
                    </form>
                </Form>
            </DialogContent>
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
                <h2 className="text-2xl sm:text-3xl lg:text-[34px] font-black tracking-tight text-[#0B1F4B] dark:text-white">
                  IDL Learning App
                </h2>
                <p className="text-sm sm:text-base font-semibold text-slate-600 dark:text-slate-400">
                  Learn. Practice. Improve. Anywhere.
                </p>
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
                <div className="flex items-center gap-3 sm:gap-4 p-3.5 sm:p-4 bg-slate-50 dark:bg-slate-900/40 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs max-w-md">
                  {/* Store Badges */}
                  <div className="flex flex-col gap-2 shrink-0">
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
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-wide text-primary mb-0.5">Quick Scan</p>
                    <p className="text-xs sm:text-sm font-extrabold leading-tight text-foreground">Get IDL Learning App</p>
                  </div>

                  {/* QR Code */}
                  <div className="bg-white p-1.5 rounded-xl shadow-xs border border-border/50 shrink-0">
                    <Image
                      src="https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg"
                      alt="QR Code"
                      data-ai-hint="qr code"
                      width={48}
                      height={48}
                      className="opacity-90"
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
      <DialogContent className="rounded-2xl">
        <DialogHeader>
          <div className="flex justify-center mb-4">
            <CheckCircle2 className="w-16 h-16 text-green-500" />
          </div>
          <DialogTitle className="text-center text-2xl font-extrabold">Ticket Submitted!</DialogTitle>
          <DialogDescription className="text-center font-bold">
            Your support ticket has been successfully submitted. Our team will review it and get back to you shortly.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div 
            className="flex items-center justify-between p-4 border-2 border-dashed rounded-xl bg-muted/50 cursor-pointer hover:bg-muted transition-colors"
            onClick={handleCopyToClipboard}
          >
            <div className="flex flex-col">
                <span className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground mb-1">Your Reference ID</span>
                <span className="font-mono font-extrabold text-lg text-primary">{submittedTicketId}</span>
            </div>
            <Copy className="w-5 h-5 text-primary/60" />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={() => setSubmittedTicketId(null)} className="w-full font-bold h-11 rounded-xl">
            Close &amp; Return
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </>
  );
}
