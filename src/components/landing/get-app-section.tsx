'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MessageCircle, CheckCircle, User, Mail, Phone, Edit, Headset, MessageSquare, Copy, MapPin } from "lucide-react";
import Image from "next/image";
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
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { requestCallBack, submitSupportTicket } from "@/app/actions/forms";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { allPrograms } from "@/lib/courses";
import { Textarea } from "@/components/ui/textarea";
import { ContactForm } from "../contact-form";

const callBackSchema = z.object({
  name: z.string().min(2, { message: "Name is required." }),
  mobile: z.string().regex(/^\d{10}$/, { message: "Please enter a valid 10-digit mobile number." }),
  email: z.string().email({ message: "Please enter a valid email." }).optional().or(z.literal('')),
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
    const [isContactDialogOpen, setIsContactDialogOpen] = useState(false);
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
    <section className="w-full pt-2 pb-4 md:pb-6 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          <Dialog open={isSupportDialogOpen} onOpenChange={setIsSupportDialogOpen}>
            <DialogTrigger asChild>
                <Card className="bg-white dark:bg-card transition-all hover:shadow-md border cursor-pointer group active:scale-[0.98]">
                    <div className="flex items-center gap-3 p-4">
                        <div className="bg-blue-100 text-blue-600 p-2.5 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                            <Headset className="w-5 h-5" />
                        </div>
                        <p className="text-sm font-bold tracking-tight">Technical Support</p>
                    </div>
                </Card>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md shadow-2xl rounded-2xl border-2 border-primary/10 bg-background/80 backdrop-blur-sm p-8">
                <DialogHeader className="text-center mb-6">
                    <DialogTitle className="text-2xl font-bold text-primary">Raise a Support Ticket</DialogTitle>
                    <DialogDescription className="text-muted-foreground text-sm">Fill out the form below and our support team will get in touch with you.</DialogDescription>
                </DialogHeader>
                <Form {...supportForm}>
                    <form onSubmit={supportForm.handleSubmit(onSupportSubmit)} className="space-y-4">
                        <FormField
                            control={supportForm.control}
                            name="studentName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <div className="relative">
                                            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <Input placeholder="Your full name *" {...field} className="pl-9" />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={supportForm.control}
                            name="mobile"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <Input placeholder="Mobile Number *" {...field} className="pl-9" type="tel" maxLength={10} />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={supportForm.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input type="email" placeholder="Your email address *" {...field} className="pl-9" />
                                    </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={supportForm.control}
                            name="problem"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                    <div className="relative">
                                        <Edit className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Textarea placeholder="Describe your issue... *" {...field} className="pl-9" />
                                    </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="w-full font-bold" disabled={supportForm.formState.isSubmitting}>
                            {supportForm.formState.isSubmitting ? 'Submitting...' : 'Submit Support Ticket'}
                        </Button>
                    </form>
                </Form>
            </DialogContent>
          </Dialog>

          <Dialog open={isCallbackDialogOpen} onOpenChange={setIsCallbackDialogOpen}>
            <DialogTrigger asChild>
              <Card className="bg-white dark:bg-card transition-all hover:shadow-md border cursor-pointer group active:scale-[0.98]">
                <div className="flex items-center gap-3 p-4">
                  <div className="bg-green-100 text-green-600 p-2.5 rounded-xl group-hover:bg-green-600 group-hover:text-white transition-colors">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <p className="text-sm font-bold tracking-tight">Talk to an expert</p>
                </div>
              </Card>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md shadow-2xl rounded-2xl border-2 border-primary/10 bg-background/80 backdrop-blur-sm p-8">
                <DialogHeader className="text-center mb-6">
                    <DialogTitle className="text-2xl font-bold text-primary">Request a Call Back</DialogTitle>
                    <DialogDescription className="text-muted-foreground text-sm">Our expert will call you back shortly.</DialogDescription>
                </DialogHeader>
                 <Form {...callBackForm}>
                    <form onSubmit={callBackForm.handleSubmit(onCallBackSubmit)} className="space-y-4">
                        <FormField
                            control={callBackForm.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <div className="relative">
                                            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <Input placeholder="Your Name *" {...field} className="pl-9" />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={callBackForm.control}
                            name="mobile"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <Input placeholder="Mobile Number *" {...field} className="pl-9" type="tel" maxLength={10} />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={callBackForm.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <Input placeholder="Email (Optional)" {...field} className="pl-9" type="email" />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={callBackForm.control}
                            name="place"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <div className="relative">
                                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <Input placeholder="Your Place *" {...field} className="pl-9" />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={callBackForm.control}
                            name="classCourse"
                            render={({ field }) => (
                                <FormItem>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                        <div className="relative">
                                            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <SelectTrigger className="pl-9">
                                                <SelectValue placeholder="Select Class/Course *" />
                                            </SelectTrigger>
                                        </div>
                                        </FormControl>
                                        <SelectContent>
                                        {allPrograms.map(program => (
                                            <SelectItem key={program.name} value={program.name}>{program.name}</SelectItem>
                                        ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="w-full font-bold" disabled={callBackForm.formState.isSubmitting}>
                            {callBackForm.formState.isSubmitting ? 'Requesting...' : 'Get a call back'}
                        </Button>
                    </form>
                </Form>
            </DialogContent>
          </Dialog>

          <Dialog open={isContactDialogOpen} onOpenChange={setIsContactDialogOpen}>
            <DialogTrigger asChild>
              <Card className="bg-white dark:bg-card transition-all hover:shadow-md border cursor-pointer group active:scale-[0.98]">
                <div className="flex items-center gap-3 p-4">
                  <div className="bg-amber-100 text-amber-600 p-2.5 rounded-xl group-hover:bg-amber-600 group-hover:text-white transition-colors">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <p className="text-sm font-bold tracking-tight">General Enquiry</p>
                </div>
              </Card>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md shadow-2xl rounded-2xl border-2 border-primary/10 bg-background/80 backdrop-blur-sm p-8">
                <DialogHeader className="text-center mb-6">
                    <DialogTitle className="text-2xl font-bold text-primary">Contact Our Team</DialogTitle>
                    <DialogDescription className="text-muted-foreground text-sm">Have a general question? We're here to help you.</DialogDescription>
                </DialogHeader>
                <ContactForm onSuccess={() => setIsContactDialogOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>
        
        <div className="rounded-[2rem] bg-gradient-to-r from-blue-600 to-indigo-700 p-6 md:p-8 text-white shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            <div className="relative h-48 md:h-56 flex items-center justify-center">
                <Image
                    src="/mobileApp.webp"
                    alt="IDL Education App Features"
                    data-ai-hint="education app mobile"
                    fill
                    className="object-contain drop-shadow-2xl"
                />
            </div>
            
            <div className="space-y-4 text-center lg:text-left">
              <h2 className="text-2xl md:text-3xl font-black tracking-tight">
                Learn Smart with the IDL App
              </h2>
              <ul className="space-y-2 text-left text-white/80 text-sm font-medium">
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-4 h-4 text-green-400 shrink-0" />
                  <span>Access free high-quality video lessons</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-4 h-4 text-green-400 shrink-0" />
                  <span>Interactive doubt clearing sessions</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-4 h-4 text-green-400 shrink-0" />
                  <span>Premium study materials and mock tests</span>
                </li>
              </ul>
            </div>

            <div className="flex flex-col items-center justify-center gap-4">
                <div className="bg-white p-2 rounded-xl shadow-lg">
                    <Image
                        src="https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg"
                        alt="QR Code"
                        data-ai-hint="qr code"
                        width={90}
                        height={90}
                    />
                </div>
                <div className="flex items-center gap-2">
                    <a href="https://play.google.com/store" target="_blank" rel="noopener noreferrer" className="relative h-9 w-28 transition-transform hover:scale-105 active:scale-95">
                        <Image 
                            src="https://www.pw.live/_next/static/media/google-play-badge.171251c3.webp"
                            alt="Get it on Google Play"
                            fill
                            className="object-contain"
                        />
                    </a>
                     <a href="https://apps.apple.com" target="_blank" rel="noopener noreferrer" className="relative h-9 w-28 transition-transform hover:scale-105 active:scale-95">
                        <Image 
                            src="https://www.pw.live/_next/static/media/apple-store-badge.acb101ce.webp"
                            alt="Download on the App Store"
                            fill
                            className="object-contain"
                        />
                    </a>
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
            <CheckCircle className="w-16 h-16 text-green-500" />
          </div>
          <DialogTitle className="text-center text-2xl font-black">Ticket Submitted!</DialogTitle>
          <DialogDescription className="text-center font-medium">
            Your support ticket has been successfully submitted. Our team will review it and get back to you shortly.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div 
            className="flex items-center justify-between p-4 border-2 border-dashed rounded-xl bg-muted/50 cursor-pointer hover:bg-muted transition-colors"
            onClick={handleCopyToClipboard}
          >
            <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Your Reference ID</span>
                <span className="font-mono font-bold text-lg text-primary">{submittedTicketId}</span>
            </div>
            <Copy className="w-5 h-5 text-primary/60" />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={() => setSubmittedTicketId(null)} className="w-full font-bold h-11 rounded-xl">
            Close & Return
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </>
  );
}