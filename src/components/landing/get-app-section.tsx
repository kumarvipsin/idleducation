
'use client';

import { Button } from "@/components/ui/button";
import { MessageCircle, User, Mail, Phone, Edit, Headset, Copy, CheckCircle2, MapPin, Send, GraduationCap } from "lucide-react";
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
    <section className="w-full pt-2 pb-8 md:pb-12 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 max-w-3xl mx-auto">
          <Dialog open={isSupportDialogOpen} onOpenChange={setIsSupportDialogOpen}>
            <DialogTrigger asChild>
                <button className="relative flex items-center gap-4 p-5 bg-white dark:bg-slate-900 rounded-lg border border-muted-foreground/10 hover:border-primary/30 transition-all group overflow-hidden text-left shadow-sm active:scale-[0.98]">
                    <div className="absolute -top-2 -right-2 p-2 opacity-[0.03] group-hover:opacity-[0.08] transition-all duration-500 group-hover:scale-110">
                        <Headset className="w-20 h-20 -rotate-12" />
                    </div>
                    <div className="bg-blue-500/10 p-3 rounded-full group-hover:bg-blue-500 group-hover:text-white transition-colors duration-300 shrink-0">
                        <Headset className="w-5 h-5 text-blue-600 group-hover:text-inherit" />
                    </div>
                    <div className="space-y-0.5">
                        <p className="text-[9px] font-bold uppercase tracking-tight text-blue-600/60">System Help</p>
                        <p className="text-[13px] font-extrabold text-foreground">Technical Support</p>
                    </div>
                </button>
            </DialogTrigger>
            <DialogContent 
                onOpenAutoFocus={(e) => e.preventDefault()}
                className="sm:max-w-md shadow-2xl rounded-2xl border-2 border-primary/10 bg-white p-0 overflow-hidden"
            >
                <DialogHeader className="text-center p-8 pb-0">
                    <DialogTitle className="text-2xl font-extrabold text-primary">Raise a Support Ticket</DialogTitle>
                    <DialogDescription className="text-muted-foreground text-sm font-medium">Fill out the form below and our support team will get in touch with you.</DialogDescription>
                </DialogHeader>
                <Form {...supportForm}>
                    <form onSubmit={supportForm.handleSubmit(onSupportSubmit)} className="flex flex-col">
                        <div className="grid grid-cols-1 divide-y divide-slate-100 dark:divide-slate-800">
                            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100 dark:divide-slate-800">
                                <FormField
                                    control={supportForm.control}
                                    name="studentName"
                                    render={({ field }) => (
                                        <FormItem className="space-y-0">
                                            <FormControl>
                                                <div className="relative group h-full">
                                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none transition-transform duration-300 group-focus-within:scale-110">
                                                        <User className="h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                                                    </div>
                                                    <Input placeholder="Full Name *" {...field} className="pl-12 h-14 bg-transparent border-0 rounded-none font-bold text-[13px] transition-all focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-slate-400" />
                                                </div>
                                            </FormControl>
                                            <FormMessage className="text-[10px] px-4 pb-2" />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={supportForm.control}
                                    name="mobile"
                                    render={({ field }) => (
                                        <FormItem className="space-y-0">
                                            <FormControl>
                                                <div className="relative group h-full">
                                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none transition-transform duration-300 group-focus-within:scale-110">
                                                        <Phone className="h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                                                    </div>
                                                    <Input placeholder="Mobile Number *" {...field} className="pl-12 h-14 bg-transparent border-0 rounded-none font-bold text-[13px] transition-all focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-slate-400" type="tel" maxLength={10} />
                                                </div>
                                            </FormControl>
                                            <FormMessage className="text-[10px] px-4 pb-2" />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <FormField
                                control={supportForm.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem className="space-y-0">
                                        <FormControl>
                                            <div className="relative group h-full">
                                                <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none transition-transform duration-300 group-focus-within:scale-110">
                                                    <Mail className="h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                                                </div>
                                                <Input type="email" placeholder="Email Address *" {...field} className="pl-12 h-14 bg-transparent border-0 rounded-none font-bold text-[13px] transition-all focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-slate-400" />
                                            </div>
                                        </FormControl>
                                        <FormMessage className="text-[10px] px-4 pb-2" />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={supportForm.control}
                                name="problem"
                                render={({ field }) => (
                                    <FormItem className="space-y-0">
                                        <FormControl>
                                            <div className="relative group h-full">
                                                <div className="absolute left-4 top-5 pointer-events-none transition-transform duration-300 group-focus-within:scale-110">
                                                    <Edit className="h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                                                </div>
                                                <Textarea 
                                                    placeholder="Describe your issue in detail... *" 
                                                    className="min-h-[140px] pl-12 pt-4 bg-transparent border-0 rounded-none font-bold text-[13px] transition-all focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-slate-400 resize-none"
                                                    {...field} 
                                                />
                                            </div>
                                        </FormControl>
                                        <FormMessage className="text-[10px] px-4 pb-2" />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="p-6 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800">
                            <Button 
                                type="submit" 
                                className="w-full h-12 text-[11px] font-black bg-primary hover:bg-primary/90 text-white rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-[0.98] group uppercase" 
                                disabled={supportForm.formState.isSubmitting}
                            >
                                {supportForm.formState.isSubmitting ? 'SUBMITTING...' : 'RAISE SUPPORT TICKET'}
                                <Send className="ml-2 h-3.5 w-3.5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
          </Dialog>

          <Dialog open={isCallbackDialogOpen} onOpenChange={setIsCallbackDialogOpen}>
            <DialogTrigger asChild>
              <button className="relative flex items-center gap-4 p-5 bg-white dark:bg-slate-900 rounded-lg border border-muted-foreground/10 hover:border-primary/30 transition-all group overflow-hidden text-left shadow-sm active:scale-[0.98]">
                <div className="absolute -top-2 -right-2 p-2 opacity-[0.03] group-hover:opacity-[0.08] transition-all duration-500 group-hover:scale-110">
                    <MessageCircle className="w-20 h-20 -rotate-12" />
                </div>
                <div className="bg-green-500/10 p-3 rounded-full group-hover:bg-green-500 group-hover:text-white transition-colors duration-300 shrink-0">
                  <MessageCircle className="w-5 h-5 text-green-600 group-hover:text-inherit" />
                </div>
                <div className="space-y-0.5">
                    <p className="text-[9px] font-bold uppercase tracking-tight text-green-600/60">Direct Line</p>
                    <p className="text-[13px] font-extrabold text-foreground">Talk to our expert</p>
                </div>
              </button>
            </DialogTrigger>
            <DialogContent 
                onOpenAutoFocus={(e) => e.preventDefault()}
                className="sm:max-w-md shadow-2xl rounded-2xl border-2 border-primary/10 bg-white p-0 overflow-hidden"
            >
                <DialogHeader className="text-center p-8 pb-0">
                    <DialogTitle className="text-2xl font-extrabold text-primary">Request a Call Back</DialogTitle>
                    <DialogDescription className="text-muted-foreground text-sm font-medium">Our expert will call you back shortly.</DialogDescription>
                </DialogHeader>
                 <Form {...callBackForm}>
                    <form onSubmit={callBackForm.handleSubmit(onCallBackSubmit)} className="flex flex-col">
                        <div className="grid grid-cols-1 divide-y divide-slate-100 dark:divide-slate-800">
                            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100 dark:divide-slate-800">
                                <FormField
                                    control={callBackForm.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem className="space-y-0">
                                            <FormControl>
                                                <div className="relative group h-full">
                                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none transition-transform duration-300 group-focus-within:scale-110">
                                                        <User className="h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                                                    </div>
                                                    <Input placeholder="Full Name *" {...field} className="pl-12 h-14 bg-transparent border-0 rounded-none font-bold text-[13px] transition-all focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-slate-400" />
                                                </div>
                                            </FormControl>
                                            <FormMessage className="text-[10px] px-4 pb-2" />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={callBackForm.control}
                                    name="mobile"
                                    render={({ field }) => (
                                        <FormItem className="space-y-0">
                                            <FormControl>
                                                <div className="relative group h-full">
                                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none transition-transform duration-300 group-focus-within:scale-110">
                                                        <Phone className="h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                                                    </div>
                                                    <Input placeholder="Mobile Number *" {...field} className="pl-12 h-14 bg-transparent border-0 rounded-none font-bold text-[13px] transition-all focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-slate-400" type="tel" maxLength={10} />
                                                </div>
                                            </FormControl>
                                            <FormMessage className="text-[10px] px-4 pb-2" />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100 dark:divide-slate-800">
                                <FormField
                                    control={callBackForm.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem className="space-y-0">
                                            <FormControl>
                                                <div className="relative group h-full">
                                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none transition-transform duration-300 group-focus-within:scale-110">
                                                        <Mail className="h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                                                    </div>
                                                    <Input type="email" placeholder="Email (Optional)" {...field} className="pl-12 h-14 bg-transparent border-0 rounded-none font-bold text-[13px] transition-all focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-slate-400" />
                                                </div>
                                            </FormControl>
                                            <FormMessage className="text-[10px] px-4 pb-2" />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={callBackForm.control}
                                    name="place"
                                    render={({ field }) => (
                                        <FormItem className="space-y-0">
                                            <FormControl>
                                                <div className="relative group h-full">
                                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none transition-transform duration-300 group-focus-within:scale-110">
                                                        <MapPin className="h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                                                    </div>
                                                    <Input placeholder="Location *" {...field} className="pl-12 h-14 bg-transparent border-0 rounded-none font-bold text-[13px] transition-all focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-slate-400" />
                                                </div>
                                            </FormControl>
                                            <FormMessage className="text-[10px] px-4 pb-2" />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <FormField
                                control={callBackForm.control}
                                name="classCourse"
                                render={({ field }) => (
                                    <FormItem className="space-y-0">
                                        <div className="relative group h-full">
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none z-10">
                                                <GraduationCap className="h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                                            </div>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className="pl-12 h-14 bg-transparent border-0 rounded-none font-bold text-[13px] shadow-none focus:ring-0 focus:ring-offset-0">
                                                        <SelectValue placeholder="Select Class/Course *" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {allPrograms.map(program => (
                                                        <SelectItem key={program.name} value={program.name} className="text-xs font-bold">{program.name}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <FormMessage className="text-[10px] px-4 pb-2" />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="p-6 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800">
                            <Button 
                                type="submit" 
                                className="w-full h-12 text-[11px] font-black bg-primary hover:bg-primary/90 text-white rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-[0.98] group uppercase" 
                                disabled={callBackForm.formState.isSubmitting}
                            >
                                {callBackForm.formState.isSubmitting ? 'REQUESTING...' : 'GET A CALL BACK'}
                                <Send className="ml-2 h-3.5 w-3.5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
          </Dialog>
        </div>
        
        <div className="relative p-[1.5px] rounded-2xl bg-white overflow-hidden shadow-sm">
          <div className="rounded-[calc(1rem-1.5px)] bg-white p-6 md:p-8 relative overflow-hidden border border-white">
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
                  <div className="relative w-full h-full">
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
                  <h2 className="text-xl md:text-2xl font-extrabold tracking-tight text-foreground">
                      <span className="text-primary">IDL Learning App</span>-Learn from anywhere
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
                          <span className="text-[11px] font-bold text-muted-foreground group-hover:text-foreground transition-colors">{item}</span>
                      </li>
                  ))}
                </ul>
              </div>

              <div className="lg:col-span-4 flex flex-col items-center justify-center gap-4">
                  <div className="flex items-center gap-4 p-4 bg-primary/5 dark:bg-slate-900/10 backdrop-blur-xl rounded-2xl border border-primary/10 w-full sm:w-auto lg:w-[350px] shadow-sm">
                      {/* Store Badges Section */}
                      <div className="flex flex-col gap-2 shrink-0">
                          {/* Google Play */}
                          <div className="bg-white p-2 rounded-xl shadow-sm border border-border/50 flex items-center gap-2">
                              <Image
                                  src="https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/google-play-store-icon.png"
                                  alt="Google Play"
                                  data-ai-hint="google play"
                                  width={20}
                                  height={20}
                                  className="object-contain"
                              />
                              <div className="flex flex-col -space-y-1">
                                  <span className="text-[7px] font-bold text-black uppercase tracking-tight opacity-60">GET IT ON</span>
                                  <span className="text-[11px] font-extrabold text-black tracking-tight">Google Play</span>
                              </div>
                          </div>
                          
                          {/* App Store */}
                          <div className="bg-white p-2 rounded-xl shadow-sm border border-border/50 flex items-center gap-2">
                              <Image
                                  src="https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/apple-app-store-icon.png"
                                  alt="App Store"
                                  data-ai-hint="app store"
                                  width={20}
                                  height={20}
                                  className="object-contain"
                              />
                              <div className="flex flex-col -space-y-1">
                                  <span className="text-[7px] font-bold text-black uppercase tracking-tight opacity-60">Download on the</span>
                                  <span className="text-[11px] font-extrabold text-black tracking-tight">App Store</span>
                              </div>
                          </div>
                      </div>

                      {/* Text */}
                      <div className="flex-1 min-w-0">
                          <p className="text-[10px] font-bold uppercase tracking-wide text-primary mb-0.5">Quick Scan</p>
                          <p className="text-xs sm:text-sm font-extrabold leading-tight text-foreground truncate">Get IDL Learning App</p>
                      </div>

                      {/* QR Code */}
                      <div className="bg-white p-1.5 rounded-xl shadow-sm border border-border/50 shrink-0">
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
