
'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, Send, Headset, Building, User, Edit, Globe, CheckCircle, Copy, X } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { submitContactForm, submitSupportTicket } from "@/app/actions";
import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import Link from "next/link";

const countryCodes = [
    { code: "+91", country: "India" },
    { code: "+1", country: "United States" },
    { code: "+44", country: "United Kingdom" },
    { code: "+61", country: "Australia" },
    { code: "+1", country: "Canada" },
].sort((a, b) => a.country.localeCompare(b.country));

const indianStates = [
    "Andaman and Nicobar Islands", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar",
    "Chandigarh", "Chhattisgarh", "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Goa",
    "Gujarat", "Haryana", "Himachal Pradesh", "Jammu and Kashmir", "Jharkhand", "Karnataka",
    "Kerala", "Ladakh", "Lakshadweep", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya",
    "Mizoram", "Nagaland", "Odisha", "Puducherry", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
    "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
];

const contactFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email." }).optional().or(z.literal('')),
  countryCode: z.string().optional(),
  phone: z.string().min(10, { message: "Please enter a valid phone number." }),
  state: z.string().optional(),
  message: z.string().optional(),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

const supportTicketSchema = z.object({
    studentName: z.string().min(2, { message: "Name must be at least 2 characters." }),
    email: z.string().email({ message: "Please enter a valid email." }),
    problem: z.string().min(10, { message: "Please describe your problem in at least 10 characters." }),
});

type SupportTicketValues = z.infer<typeof supportTicketSchema>;

export default function ContactPage() {
  const { toast } = useToast();
  const [showSupportForm, setShowSupportForm] = useState(false);
  const [submittedTicketId, setSubmittedTicketId] = useState<string | null>(null);

  const contactForm = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: '',
      email: '',
      countryCode: '+91-India',
      phone: '',
      state: '',
      message: '',
    },
  });

  const supportForm = useForm<SupportTicketValues>({
    resolver: zodResolver(supportTicketSchema),
    defaultValues: {
      studentName: '',
      email: '',
      problem: '',
    },
  });
  
  const onContactSubmit: SubmitHandler<ContactFormValues> = async (data) => {
    const result = await submitContactForm({ ...data });
    if (result.success) {
      toast({ title: "Success", description: result.message });
      contactForm.reset();
    } else {
      toast({ variant: "destructive", title: "Error", description: result.message });
    }
  };

  const onSupportSubmit: SubmitHandler<SupportTicketValues> = async (data) => {
    const result = await submitSupportTicket(data);
    if (result.success) {
        setSubmittedTicketId(result.ticketId || null);
        supportForm.reset();
        setShowSupportForm(false);
    } else {
        toast({ variant: "destructive", title: "Error", description: result.message });
    }
  }

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
      <div className="bg-white dark:bg-background py-12 md:py-24">
        <div className="container">
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-extrabold text-primary tracking-tight">Contact Us</h1>
                <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">We'd love to hear from you! Whether you have a question about our courses, need support, or anything else, our team is ready to answer all your questions.</p>
            </div>
            <div className="max-w-2xl mx-auto">
                <Card className="shadow-2xl rounded-2xl border-2 border-primary/10 bg-background/80 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="text-center text-2xl font-bold text-primary">Send a Message</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Form {...contactForm}>
                            <form onSubmit={contactForm.handleSubmit(onContactSubmit)} className="space-y-4">
                                <FormField
                                control={contactForm.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormControl>
                                        <div className="relative">
                                            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <Input placeholder="Enter your name *" {...field} className="pl-9" />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                                />
                                <FormField
                                control={contactForm.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormControl>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <Input type="email" placeholder="Enter your email" {...field} className="pl-9" />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                                />
                                <div className="flex items-start gap-2">
                                    <FormField
                                        control={contactForm.control}
                                        name="countryCode"
                                        render={({ field }) => (
                                        <FormItem className="w-32">
                                            <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Code" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {countryCodes.map((country) => (
                                                <SelectItem key={`${country.country}-${country.code}`} value={`${country.code}-${country.country}`}>
                                                    {country.code}
                                                </SelectItem>
                                                ))}
                                            </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={contactForm.control}
                                        name="phone"
                                        render={({ field }) => (
                                        <FormItem className="flex-1">
                                            <FormControl>
                                                <div className="relative">
                                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                <Input type="tel" placeholder="Enter phone number *" {...field} maxLength={10} className="pl-9" />
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                        )}
                                    />
                                </div>
                                <FormField
                                    control={contactForm.control}
                                    name="state"
                                    render={({ field }) => (
                                    <FormItem>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <div className="relative">
                                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <SelectTrigger className="pl-9">
                                                <SelectValue placeholder="Select a state *" />
                                            </SelectTrigger>
                                            </div>
                                        </FormControl>
                                        <SelectContent>
                                            {indianStates.map(state => (
                                            <SelectItem key={state} value={state}>{state}</SelectItem>
                                            ))}
                                        </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                    )}
                                />
                                <FormField
                                control={contactForm.control}
                                name="message"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormControl>
                                        <div className="relative">
                                        <Edit className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Textarea placeholder="Enter your message" className="min-h-[100px] pl-9" {...field} />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                                />
                                <Button type="submit" size="lg" className="w-full" disabled={contactForm.formState.isSubmitting}>
                                {contactForm.formState.isSubmitting ? 'Sending...' : (
                                    <>
                                    <Send className="mr-2 h-4 w-4" />
                                    Send Message
                                    </>
                                )}
                                </Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </div>
      </div>
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
            <Button onClick={() => setSubmittedTicketId(null)} className="w-full">Close</Button>
            </DialogFooter>
        </DialogContent>
        </Dialog>
    </>
  );
}
