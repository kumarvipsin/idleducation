'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MessageCircle, User, Mail, Phone, Edit, Headset, Copy, MapPin, CheckCircle2 } from "lucide-react";
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
import { cn } from "@/lib/utils";

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
    <section className="w-full pt-2 pb-8 md:pb-12 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 max-w-2xl mx-auto">
          <Dialog open={isSupportDialogOpen} onOpenChange={setIsSupportDialogOpen}>
            <DialogTrigger asChild>
                <Card className="bg-white dark:bg-card transition-all hover:shadow-md border cursor-pointer group active:scale-[0.98]">
                    <div className="flex items-center gap-3 p-3">
                        <div className="bg-blue-100 text-blue-600 p-2 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                            <Headset className="w-4 h-4" />
                        </div>
                        <p className="text-xs font-bold tracking-tight">Technical Support</p>
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
                <div className="flex items-center gap-3 p-3">
                  <div className="bg-green-100 text-green-600 p-2 rounded-xl group-hover:bg-green-600 group-hover:text-white transition-colors">
                    <MessageCircle className="w-4 h-4" />
                  </div>
                  <p className="text-xs font-bold tracking-tight">Talk to an expert</p>
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
        </div>
        
        <div className="relative p-[1.5px] rounded-[2.5rem] bg-gradient-to-r from-primary/10 via-primary/30 to-primary/10 overflow-hidden shadow-sm">
          <div className="rounded-[calc(2.5rem-1.5px)] bg-white p-6 md:p-8 relative overflow-hidden">
            {/* Background Texture and India Map Silhouette */}
            <div className="absolute inset-0 bg-dot-pattern opacity-40 pointer-events-none" />
            <div className="absolute right-0 bottom-0 opacity-[0.03] pointer-events-none translate-x-1/4 translate-y-1/4 w-full h-full max-w-2xl">
              <Image 
                  src="https://upload.wikimedia.org/wikipedia/commons/e/e0/India_map_silhouette.svg" 
                  alt="India Map silhouette" 
                  fill 
                  className="object-contain"
              />
            </div>

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              <div className="lg:col-span-3 relative h-48 md:h-52 flex items-center justify-center">
                  <div className="relative w-full h-full transform -rotate-6 group hover:rotate-0 transition-transform duration-500">
                      <div className="absolute inset-4 bg-primary/5 rounded-[2rem] blur-2xl" />
                      <Image
                          src="/mobileApp.webp"
                          alt="IDL Education App Features"
                          data-ai-hint="education app mobile"
                          fill
                          className="object-contain drop-shadow-xl"
                      />
                  </div>
              </div>
              
              <div className="lg:col-span-5 space-y-3 text-left">
                <div className="space-y-1.5">
                  <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-primary/5 border border-primary/10 text-primary text-[9px] font-bold uppercase tracking-widest">
                      Available on iOS & Android
                  </div>
                  <h2 className="text-xl md:text-2xl font-bold tracking-tight text-foreground">
                      Learn Smart with the <span className="text-primary">IDL App</span>
                  </h2>
                </div>
                
                <ul className="space-y-1.5">
                  {[
                      "Access free high-quality video lessons",
                      "Interactive doubt clearing sessions",
                      "Premium study materials and mock tests"
                  ].map((item, idx) => (
                      <li key={idx} className="flex items-center justify-start gap-2.5 group">
                          <div className="bg-primary/10 p-1 rounded-full transition-colors group-hover:bg-primary group-hover:text-white">
                              <CheckCircle2 className="w-3 h-3 text-primary group-hover:text-white transition-colors" />
                          </div>
                          <span className="text-[11px] font-medium text-muted-foreground group-hover:text-foreground transition-colors">{item}</span>
                      </li>
                  ))}
                </ul>
              </div>

              <div className="lg:col-span-4 flex flex-col items-center justify-center gap-4">
                  <div className="flex items-center gap-4 p-4 bg-white/5 dark:bg-slate-900/10 backdrop-blur-xl rounded-[1.5rem] border border-slate-200/50 dark:border-white/10 w-full sm:w-auto">
                      <div className="bg-white p-1.5 rounded-lg shadow-inner border border-border/50">
                          <Image
                              src="https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg"
                              alt="QR Code"
                              data-ai-hint="qr code"
                              width={80}
                              height={100}
                              className="opacity-80"
                          />
                      </div>
                      <div className="space-y-0.5">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-primary">Quick Scan</p>
                          <p className="text-base font-bold leading-tight">Get the App <br/>Instantly</p>
                      </div>
                  </div>

                  <div className="flex items-center gap-2.5 w-full sm:w-auto">
                      <a href="https://play.google.com/store" target="_blank" rel="noopener noreferrer" className="flex-1 relative h-9 w-28 transition-all hover:-translate-y-1 active:scale-95 grayscale hover:grayscale-0">
                          <Image 
                              src="https://www.pw.live/_next/static/media/google-play-badge.171251c3.webp"
                              alt="Get it on Google Play"
                              fill
                              className="object-contain"
                          />
                      </a>
                      <a href="https://apps.apple.com" target="_blank" rel="noopener noreferrer" className="flex-1 relative h-9 w-28 transition-all hover:-translate-y-1 active:scale-95 grayscale hover:grayscale-0">
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
      </div>
    </section>
    <Dialog open={!!submittedTicketId} onOpenChange={() => setSubmittedTicketId(null)}>
      <DialogContent className="rounded-2xl">
        <DialogHeader>
          <div className="flex justify-center mb-4">
            <CheckCircle2 className="w-16 h-16 text-green-500" />
          </div>
          <DialogTitle className="text-center text-2xl font-bold">Ticket Submitted!</DialogTitle>
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
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Your Reference ID</span>
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
