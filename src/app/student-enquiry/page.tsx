'use client';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Send, User, Users, MessageSquare, CheckCircle, GraduationCap, Phone, MapPin, Sparkles, HelpCircle } from "lucide-react";
import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { submitStudentEnquiry } from "@/app/actions";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { DISCOVER_COURSES } from "@/lib/courses";
import { motion } from "framer-motion";

const enquirySchema = z.object({
  studentName: z.string().min(2, { message: "Name must be at least 2 characters." }),
  guardianName: z.string().min(2, { message: "Guardian's name must be at least 2 characters." }),
  classCourse: z.string().min(1, { message: "Please select a class or course." }),
  mobile: z.string().regex(/^\d{10}$/, { message: "Please enter a valid 10-digit mobile number." }),
  state: z.string().min(1, { message: "Please select a state." }),
  message: z.string().optional(),
});

type EnquiryFormValues = z.infer<typeof enquirySchema>;

const indianStates = [
    "Andaman and Nicobar Islands", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar",
    "Chandigarh", "Chhattisgarh", "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Goa",
    "Gujarat", "Haryana", "Himachal Pradesh", "Jammu and Kashmir", "Jharkhand", "Karnataka",
    "Kerala", "Ladakh", "Lakshadweep", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya",
    "Mizoram", "Nagaland", "Odisha", "Puducherry", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
    "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
];

export default function StudentEnquiryPage() {
    const { toast } = useToast();
    const [isSuccessOpen, setIsSuccessOpen] = useState(false);

    const form = useForm<EnquiryFormValues>({
        resolver: zodResolver(enquirySchema),
        defaultValues: {
            studentName: '',
            guardianName: '',
            classCourse: '',
            mobile: '',
            state: '',
            message: '',
        },
    });

    const onSubmit: SubmitHandler<EnquiryFormValues> = async (data) => {
        const result = await submitStudentEnquiry(data as any);
        if (result.success) {
            setIsSuccessOpen(true);
            form.reset();
        } else {
            toast({
                variant: "destructive",
                title: "Submission Failed",
                description: result.message,
            });
        }
    };

    return (
        <div className="min-h-screen w-full bg-[#F8F7FF] dark:bg-slate-950 relative selection:bg-primary/10">
            {/* Subtle Background Texture */}
            <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none" />
            
            {/* Floating Decorative Elements */}
            <div className="absolute top-[10%] left-[5%] w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-pulse pointer-events-none" />
            <div className="absolute bottom-[10%] right-[5%] w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse pointer-events-none" />
            
            <div className="container mx-auto px-4 md:px-6 py-12 lg:py-20 relative z-10">
                <div className="max-w-md mx-auto space-y-10">
                    
                    {/* Header Section */}
                    <div className="text-center space-y-6">
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex flex-col items-center gap-4"
                        >
                            <div className="bg-primary/10 p-4 rounded-full border border-primary/20 shadow-sm transition-all duration-500 hover:scale-110">
                                <HelpCircle className="w-8 h-8 text-primary animate-ring" />
                            </div>
                        </motion.div>
                        
                        <div className="space-y-3">
                            <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tighter leading-tight">
                                Student{' '}
                                <span className="relative inline-block">
                                    <span className="relative z-10 text-primary">Enquiry</span>
                                    <div className="absolute -bottom-1 left-0 w-full h-2 z-0">
                                        <svg viewBox="0 0 100 15" preserveAspectRatio="none" className="w-full h-full text-blue-500 fill-none stroke-current stroke-[10] opacity-70">
                                            <path d="M0,15 Q50,5 100,15" />
                                        </svg>
                                    </div>
                                </span>
                            </h1>
                            <p className="max-w-xl mx-auto text-slate-600 dark:text-slate-400 text-[11px] font-bold capitalize tracking-tight leading-relaxed">
                                Inquire About Our Class & Course Structured Learning Programs To Begin Your Academic Success Journey.
                            </p>
                        </div>
                    </div>

                    {/* Premium Table-Style Enquiry Form Card */}
                    <Card className="shadow-2xl rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                        <CardContent className="p-0">
                           <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col">
                                    {/* Table Body */}
                                    <div className="grid grid-cols-1 divide-y divide-slate-100 dark:divide-slate-800">
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100 dark:divide-slate-800">
                                            <FormField
                                                control={form.control}
                                                name="studentName"
                                                render={({ field }) => (
                                                    <FormItem className="space-y-0">
                                                        <FormControl>
                                                            <div className="relative group h-full">
                                                                <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none transition-transform duration-300 group-focus-within:scale-110">
                                                                    <User className="h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                                                                </div>
                                                                <Input placeholder="Student's Name *" {...field} className="pl-12 h-14 bg-transparent border-0 rounded-none font-bold text-[13px] transition-all focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-slate-400" />
                                                            </div>
                                                        </FormControl>
                                                        <FormMessage className="text-[10px] px-4 pb-2" />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="guardianName"
                                                render={({ field }) => (
                                                    <FormItem className="space-y-0">
                                                        <FormControl>
                                                            <div className="relative group h-full">
                                                                <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none transition-transform duration-300 group-focus-within:scale-110">
                                                                    <Users className="h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                                                                </div>
                                                                <Input placeholder="Guardian's Name *" {...field} className="pl-12 h-14 bg-transparent border-0 rounded-none font-bold text-[13px] transition-all focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-slate-400" />
                                                            </div>
                                                        </FormControl>
                                                        <FormMessage className="text-[10px] px-4 pb-2" />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100 dark:divide-slate-800">
                                            <FormField
                                                control={form.control}
                                                name="classCourse"
                                                render={({ field }) => (
                                                    <FormItem className="space-y-0">
                                                        <div className="relative group h-full">
                                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none z-10">
                                                                <GraduationCap className="h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                                                            </div>
                                                            <Select onValueChange={field.onChange} value={field.value}>
                                                                <FormControl>
                                                                    <SelectTrigger className="pl-12 h-14 bg-transparent border-0 rounded-none font-bold text-[13px] shadow-none focus:ring-0 focus:ring-offset-0">
                                                                        <SelectValue placeholder="Select Class/Course *" />
                                                                    </SelectTrigger>
                                                                </FormControl>
                                                                <SelectContent>
                                                                    {DISCOVER_COURSES.map(c => <SelectItem key={c.name} value={c.name} className="text-xs font-bold">{c.name}</SelectItem>)}
                                                                </SelectContent>
                                                            </Select>
                                                        </div>
                                                        <FormMessage className="text-[10px] px-4 pb-2" />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="mobile"
                                                render={({ field }) => (
                                                    <FormItem className="space-y-0">
                                                        <FormControl>
                                                            <div className="relative group h-full">
                                                                <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none transition-transform duration-300 group-focus-within:scale-110">
                                                                    <Phone className="h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                                                                </div>
                                                                <Input type="tel" placeholder="Mobile Number *" {...field} className="pl-12 h-14 bg-transparent border-0 rounded-none font-bold text-[13px] transition-all focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-slate-400" />
                                                            </div>
                                                        </FormControl>
                                                        <FormMessage className="text-[10px] px-4 pb-2" />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        <FormField
                                            control={form.control}
                                            name="state"
                                            render={({ field }) => (
                                                <FormItem className="space-y-0">
                                                    <div className="relative group h-full">
                                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none z-10">
                                                            <MapPin className="h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                                                        </div>
                                                        <Select onValueChange={field.onChange} value={field.value}>
                                                            <FormControl>
                                                                <SelectTrigger className="pl-12 h-14 bg-transparent border-0 rounded-none font-bold text-[13px] shadow-none focus:ring-0 focus:ring-offset-0">
                                                                    <SelectValue placeholder="Select a state *" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                {indianStates.map(state => <SelectItem key={state} value={state} className="text-xs font-bold">{state}</SelectItem>)}
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                    <FormMessage className="text-[10px] px-4 pb-2" />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="message"
                                            render={({ field }) => (
                                                <FormItem className="space-y-0">
                                                    <FormControl>
                                                        <div className="relative group h-full">
                                                            <div className="absolute left-4 top-5 pointer-events-none transition-transform duration-300 group-focus-within:scale-110">
                                                                <MessageSquare className="h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                                                            </div>
                                                            <Textarea 
                                                                placeholder="Describe your enquiry... *" 
                                                                className="min-h-[120px] pl-12 pt-4 bg-transparent border-0 rounded-none font-bold text-[13px] transition-all focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-slate-400 resize-none"
                                                                {...field}
                                                            />
                                                        </div>
                                                    </FormControl>
                                                    <FormMessage className="text-[10px] px-4 pb-2" />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    {/* Footer / Submit Button */}
                                    <div className="p-6 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800">
                                        <Button type="submit" className="w-full h-12 text-[11px] font-black bg-primary hover:bg-primary/90 text-white rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-[0.98] group uppercase tracking-[0.2em]" disabled={form.formState.isSubmitting}>
                                            {form.formState.isSubmitting ? 'PROCESSING...' : 'SUBMIT ENQUIRY'}
                                            <Send className="ml-2 h-3.5 w-3.5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                                        </Button>
                                    </div>
                                </form>
                           </Form>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <Dialog open={isSuccessOpen} onOpenChange={setIsSuccessOpen}>
                <DialogContent className="rounded-[2rem] max-w-sm border-none shadow-2xl p-8">
                    <DialogHeader>
                        <div className="flex justify-center mb-6">
                            <div className="bg-green-100 p-4 rounded-3xl">
                                <CheckCircle className="w-12 h-12 text-green-500" />
                            </div>
                        </div>
                        <DialogTitle className="text-center text-2xl font-black tracking-tight text-slate-900">Enquiry Received!</DialogTitle>
                        <DialogDescription className="text-center font-bold text-xs text-slate-600 leading-relaxed pt-2 px-2">
                            Thank you for reaching out to us. Our academic counseling team will contact you shortly to guide you forward.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="mt-6">
                        <Button onClick={() => setIsSuccessOpen(false)} className="w-full h-12 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-primary/10">
                            Close Workspace
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
