'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, HelpCircle, CheckCircle, Smartphone, User, Mail, Phone, MapPin, GraduationCap } from "lucide-react";
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
import { requestCallBack } from "@/app/actions/forms";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { allPrograms } from "@/lib/courses";

const faqs = [
  {
    question: "What courses do you offer?",
    answer: "We offer a wide range of courses for students from Class 4 to Class 10, covering subjects like Mathematics, Science, History, and Arts. We also have specialized courses for competitive exams.",
  },
  {
    question: "Are the classes live or recorded?",
    answer: "Our platform offers both live interactive classes and recorded sessions. This allows students to learn at their own pace and revisit concepts whenever they need to.",
  },
  {
    question: "How are doubts cleared?",
    answer: "We have a unique two-teacher model where one teacher conducts the class and another teacher is dedicated to clearing doubts instantly during the live session. We also have dedicated doubt-solving sessions.",
  },
  {
    question: "Do you provide study materials?",
    answer: "Yes, we provide comprehensive study materials including notes, practice questions, sample papers, and mock tests to ensure students are well-prepared for their exams.",
  },
  {
    question: "Is there a free trial available?",
    answer: "Absolutely! You can book a free demo class to experience our teaching methodology and platform features before enrolling in a course.",
  },
];

const callBackSchema = z.object({
  name: z.string().min(2, { message: "Name is required." }),
  mobile: z.string().regex(/^\d{10}$/, { message: "Please enter a valid 10-digit mobile number." }),
  email: z.string().email({ message: "Please enter a valid email." }).optional().or(z.literal('')),
  place: z.string().min(1, { message: "Place is required." }),
  classCourse: z.string().min(1, { message: "Class/Course is required." }),
});

type CallBackFormValues = z.infer<typeof callBackSchema>;


export function GetAppSection() {
    const { toast } = useToast();
    const [isCallbackDialogOpen, setIsCallbackDialogOpen] = useState(false);

    const form = useForm<CallBackFormValues>({
        resolver: zodResolver(callBackSchema),
        defaultValues: {
            name: '',
            mobile: '',
            email: '',
            place: '',
            classCourse: '',
        },
    });

    const onCallBackSubmit: SubmitHandler<CallBackFormValues> = async (data) => {
        const result = await requestCallBack(data);
        if (result.success) {
            toast({
                title: "Request Received",
                description: result.message,
            });
            form.reset();
            setIsCallbackDialogOpen(false);
        } else {
            toast({
                variant: "destructive",
                title: "Request Failed",
                description: result.message,
            });
        }
    };
    
  return (
    <section className="w-full py-6 md:py-12 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Dialog>
            <DialogTrigger asChild>
              <Card className="bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors cursor-pointer border">
                <div className="flex items-center gap-4 p-6">
                  <div className="bg-primary/10 text-primary p-3 rounded-full">
                    <HelpCircle className="w-6 h-6" />
                  </div>
                  <p className="text-lg font-semibold">Frequently Asked Questions</p>
                </div>
              </Card>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold">Frequently Asked Questions</DialogTitle>
              </DialogHeader>
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem value={`item-${index}`} key={index}>
                    <AccordionTrigger>{faq.question}</AccordionTrigger>
                    <AccordionContent>{faq.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </DialogContent>
          </Dialog>

          <Dialog open={isCallbackDialogOpen} onOpenChange={setIsCallbackDialogOpen}>
            <DialogTrigger asChild>
              <Card className="bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors cursor-pointer border">
                <div className="flex items-center gap-4 p-6">
                  <div className="bg-primary/10 text-primary p-3 rounded-full">
                    <MessageCircle className="w-6 h-6" />
                  </div>
                  <p className="text-lg font-semibold">Talk to an expert</p>
                </div>
              </Card>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md shadow-2xl rounded-2xl border-2 border-primary/10 bg-background/80 backdrop-blur-sm p-8">
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-primary">Request a Call Back</h2>
                    <p className="text-muted-foreground text-sm">Our expert will call you back shortly.</p>
                </div>
                 <Form {...form}>
                    <form onSubmit={form.handleSubmit(onCallBackSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
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
                            control={form.control}
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
                            control={form.control}
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
                            control={form.control}
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
                            control={form.control}
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
                        <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                            {form.formState.isSubmitting ? 'Requesting...' : 'Get a call back'}
                        </Button>
                    </form>
                </Form>
            </DialogContent>
          </Dialog>
        </div>
        
        <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 p-4 md:p-6 text-white border">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            {/* Column 1: Mobile App Image */}
            <div className="relative h-56 md:h-64 flex items-center justify-center overflow-hidden">
                <Image
                    src="https://images.unsplash.com/photo-1597740985671-2a8a3b80502e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxOXx8bW9iaWxlJTIwfGVufDB8fHx8MTc2ODY3MTQ5OXww&ixlib=rb-4.1.0&q=80&w=1080"
                    alt="IDL Education App Features"
                    data-ai-hint="education brochure mobile"
                    fill
                    className="object-contain transform scale-x-125"
                />
            </div>
            
            {/* Column 2: Title and Key Points */}
            <div className="space-y-6 text-center lg:text-left">
              <h2 className="text-2xl font-bold">
                IDL Learning App - Learn Smart
              </h2>
              <ul className="space-y-3 text-left">
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>Access <strong>free</strong> videos worth ₹5000</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>Explore core concept videos</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>Clear all your doubts</span>
                </li>
              </ul>
            </div>

            {/* Column 3: QR and App Store Links */}
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
                <div className="space-y-3 flex flex-col items-center">
                    <Link href="https://play.google.com/store" target="_blank" rel="noopener noreferrer">
                        <Image 
                            src="https://www.pw.live/_next/static/media/google-play-badge.171251c3.webp"
                            alt="Get it on Google Play"
                            width={135}
                            height={40}
                        />
                    </Link>
                     <Link href="https://apps.apple.com" target="_blank" rel="noopener noreferrer">
                        <Image 
                            src="https://www.pw.live/_next/static/media/apple-store-badge.acb101ce.webp"
                            alt="Download on the App Store"
                            width={135}
                            height={40}
                        />
                    </Link>
                </div>
              </div>
          </div>
        </div>
      </div>
    </section>
  );
}
