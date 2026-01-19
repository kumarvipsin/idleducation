
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, HelpCircle, CheckCircle, Smartphone, User, Mail, Phone, MapPin, GraduationCap, Copy, Edit, Headset } from "lucide-react";
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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
    <section className="w-full py-6 md:py-12 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Dialog open={isSupportDialogOpen} onOpenChange={setIsSupportDialogOpen}>
            <DialogTrigger asChild>
                <Card className="bg-blue-50 dark:bg-blue-900/20 transition-colors cursor-pointer">
                    <div className="flex items-center gap-4 p-6">
                    <div className="bg-primary/10 text-primary p-3 rounded-full">
                        <Headset className="w-6 h-6" />
                    </div>
                    <p className="text-lg font-semibold">Technical Support</p>
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
                        <Button type="submit" className="w-full" disabled={supportForm.formState.isSubmitting}>
                            {supportForm.formState.isSubmitting ? 'Submitting...' : 'Get a Support'}
                        </Button>
                    </form>
                </Form>
            </DialogContent>
          </Dialog>

          <Dialog open={isCallbackDialogOpen} onOpenChange={setIsCallbackDialogOpen}>
            <DialogTrigger asChild>
              <Card className="bg-blue-50 dark:bg-blue-900/20 transition-colors cursor-pointer">
                <div className="flex items-center gap-4 p-6">
                  <div className="bg-primary/10 text-primary p-3 rounded-full">
                    <MessageCircle className="w-6 h-6" />
                  </div>
                  <p className="text-lg font-semibold">Talk to an expert</p>
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
                                            <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
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
                        <Button type="submit" className="w-full" disabled={callBackForm.formState.isSubmitting}>
                            {callBackForm.formState.isSubmitting ? 'Requesting...' : 'Get a call back'}
                        </Button>
                    </form>
                </Form>
            </DialogContent>
          </Dialog>
        </div>
        
        <div className="rounded-2xl bg-blue-50 dark:bg-blue-900/20 p-4 md:p-6 text-foreground">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            <div className="relative h-56 md:h-64 flex items-center justify-center overflow-hidden">
                <Image
                    src="/mobileApp.webp"
                    alt="IDL Education App Features"
                    data-ai-hint="education brochure mobile"
                    fill
                    className="object-contain"
                />
            </div>
            
            <div className="space-y-6 text-center lg:text-left">
              <h2 className="text-2xl font-bold">
                IDL Learning App - Learn Smart
              </h2>
              <ul className="space-y-3 text-left text-muted-foreground">
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>Access <strong>free</strong> videos worth ₹5000</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>Explore core concept videos</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>Clear all your doubts</span>
                </li>
              </ul>
            </div>

            <div className="flex flex-col items-center justify-center gap-4">
                <div className="bg-white p-2 rounded-lg">
                    <Image
                        src="https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg"
                        alt="QR Code"
                        data-ai-hint="qr code"
                        width={100}
                        height={100}
                    />
                </div>
                <div className="flex items-center gap-2">
                    <a href="https://play.google.com/store" target="_blank" rel="noopener noreferrer" className="relative h-10 w-32">
                        <Image 
                            src="https://www.pw.live/_next/static/media/google-play-badge.171251c3.webp"
                            alt="Get it on Google Play"
                            fill
                            className="object-contain"
                        />
                    </a>
                     <a href="https://apps.apple.com" target="_blank" rel="noopener noreferrer" className="relative h-10 w-32">
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
      <DialogContent>
        <DialogHeader>
          <div className="flex justify-center mb-4">
            <CheckCircle className="w-16 h-16 text-green-500" />
          </div>
          <DialogTitle className="text-center text-2xl">Ticket Submitted!</DialogTitle>
          <DialogDescription className="text-center">
            Your support ticket has been successfully submitted. Please save your ticket ID for future reference.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div 
            className="flex items-center justify-between p-3 border-2 border-dashed rounded-lg bg-muted cursor-pointer hover:bg-muted/80"
            onClick={handleCopyToClipboard}
          >
            <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">Your Ticket ID</span>
                <span className="font-mono font-semibold text-lg">{submittedTicketId}</span>
            </div>
            <Copy className="w-6 h-6 text-primary" />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={() => setSubmittedTicketId(null)} className="w-full">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </>
  );
}
