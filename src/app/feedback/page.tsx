'use client';

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Star, Send, User, Mail, MessageSquare, Sparkles, CheckCircle, Tag } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { submitFeedback } from "@/app/actions";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";

const feedbackSchema = z.object({
  name: z.string().optional(),
  email: z.string().email({ message: "Please enter a valid email." }).optional().or(z.literal('')),
  category: z.string().min(1, { message: "Please select a category." }),
  rating: z.number().min(1, { message: "Please provide a rating." }),
  feedback: z.string().min(10, { message: "Feedback must be at least 10 characters." }),
});

type FeedbackFormValues = z.infer<typeof feedbackSchema>;

const getRatingLabel = (rating: number) => {
    switch (rating) {
      case 1: return "Terrible";
      case 2: return "Bad";
      case 3: return "Okay";
      case 4: return "Good";
      case 5: return "Excellent";
      default: return "";
    }
};

export default function FeedbackPage() {
    const { toast } = useToast();
    const [hoverRating, setHoverRating] = useState(0);
    const [isThankYouOpen, setIsThankYouOpen] = useState(false);

    const form = useForm<FeedbackFormValues>({
        resolver: zodResolver(feedbackSchema),
        defaultValues: {
            name: '',
            email: '',
            category: '',
            rating: 0,
            feedback: '',
        },
    });

    const onSubmit: SubmitHandler<FeedbackFormValues> = async (data) => {
        const result = await submitFeedback(data);
        if (result.success) {
            setIsThankYouOpen(true);
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
                                <Sparkles className="w-8 h-8 text-primary animate-pulse" />
                            </div>
                        </motion.div>
                        
                        <div className="space-y-3">
                            <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tighter leading-tight">
                                Share Your{' '}
                                <span className="relative inline-block">
                                    <span className="relative z-10 text-primary">Feedback</span>
                                    <div className="absolute -bottom-1 left-0 w-full h-2 z-0">
                                        <svg viewBox="0 0 100 15" preserveAspectRatio="none" className="w-full h-full text-blue-500 fill-none stroke-current stroke-[10] opacity-70">
                                            <path d="M0,15 Q50,5 100,15" />
                                        </svg>
                                    </div>
                                </span>
                            </h1>
                            <p className="max-w-xl mx-auto text-slate-600 dark:text-slate-400 text-[11px] font-bold tracking-tight leading-relaxed">
                                We Value Your Opinion And Would Love To Hear About Your Experience.
                            </p>
                        </div>
                    </div>

                    {/* Premium Table-Style Form Card */}
                    <Card className="shadow-2xl rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                        <CardContent className="p-0">
                           <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col">
                                    <div className="grid grid-cols-1 divide-y divide-slate-100 dark:divide-slate-800">
                                        
                                        {/* Row 1: Name & Email */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100 dark:divide-slate-800">
                                            <FormField
                                                control={form.control}
                                                name="name"
                                                render={({ field }) => (
                                                    <FormItem className="space-y-0">
                                                        <FormControl>
                                                            <div className="relative group h-full">
                                                                <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none transition-transform duration-300 group-focus-within:scale-110">
                                                                    <User className="h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                                                                </div>
                                                                <Input placeholder="Your Name (Optional)" {...field} className="pl-12 h-14 bg-transparent border-0 rounded-none font-bold text-[13px] transition-all focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-slate-400" />
                                                            </div>
                                                        </FormControl>
                                                        <FormMessage className="text-[10px] px-4 pb-2" />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
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
                                        </div>

                                        {/* Row 2: Category */}
                                        <FormField
                                            control={form.control}
                                            name="category"
                                            render={({ field }) => (
                                                <FormItem className="space-y-0">
                                                    <div className="relative group h-full">
                                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none z-10">
                                                            <Tag className="h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                                                        </div>
                                                        <Select onValueChange={field.onChange} value={field.value}>
                                                            <FormControl>
                                                                <SelectTrigger className="pl-12 h-14 bg-transparent border-0 rounded-none font-bold text-[13px] shadow-none focus:ring-0 focus:ring-offset-0">
                                                                    <SelectValue placeholder="Feedback Category *" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                <SelectItem value="general" className="text-xs font-bold">General Feedback</SelectItem>
                                                                <SelectItem value="course-content" className="text-xs font-bold">Course Content</SelectItem>
                                                                <SelectItem value="teacher" className="text-xs font-bold">Teacher Experience</SelectItem>
                                                                <SelectItem value="technical-issue" className="text-xs font-bold">Technical Issue</SelectItem>
                                                                <SelectItem value="suggestion" className="text-xs font-bold">Suggestion</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                    <FormMessage className="text-[10px] px-4 pb-2" />
                                                </FormItem>
                                            )}
                                        />

                                        {/* Row 3: Rating Selection */}
                                        <div className="p-4 md:p-5 bg-slate-50/30 dark:bg-slate-800/30">
                                            <FormField
                                                control={form.control}
                                                name="rating"
                                                render={({ field }) => (
                                                    <FormItem className="space-y-3">
                                                        <div className="flex flex-col items-center gap-4">
                                                            <FormControl>
                                                                <div className="flex items-center justify-center gap-2 md:gap-3">
                                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                                        <button
                                                                            type="button"
                                                                            key={star}
                                                                            onMouseEnter={() => setHoverRating(star)}
                                                                            onMouseLeave={() => setHoverRating(0)}
                                                                            onClick={() => field.onChange(star)}
                                                                            className="relative group focus:outline-none transition-transform active:scale-90"
                                                                        >
                                                                            <Star className={cn(
                                                                                "w-8 h-8 md:w-10 md:h-10 transition-all duration-500",
                                                                                (hoverRating || field.value) >= star 
                                                                                    ? "text-yellow-400 fill-yellow-400 filter drop-shadow-[0_0_8px_rgba(250,204,21,0.3)]" 
                                                                                    : "text-slate-200 dark:text-slate-800"
                                                                            )} />
                                                                        </button>
                                                                    ))}
                                                                </div>
                                                            </FormControl>

                                                            <div className="h-6 flex items-center justify-center">
                                                                <AnimatePresence mode="wait">
                                                                    {(hoverRating || field.value) > 0 && (
                                                                        <motion.div 
                                                                            key={hoverRating || field.value}
                                                                            initial={{ opacity: 0, scale: 0.8 }}
                                                                            animate={{ opacity: 1, scale: 1 }}
                                                                            exit={{ opacity: 0, scale: 0.8 }}
                                                                            className={cn(
                                                                                "px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-[0.2em] border shadow-sm",
                                                                                (hoverRating || field.value) >= 4 ? "bg-green-50 text-green-600 border-green-100" :
                                                                                (hoverRating || field.value) >= 3 ? "bg-yellow-50 text-yellow-600 border-yellow-100" :
                                                                                "bg-red-50 text-red-600 border-red-100"
                                                                            )}
                                                                        >
                                                                            {getRatingLabel(hoverRating || field.value)}
                                                                        </motion.div>
                                                                    )}
                                                                </AnimatePresence>
                                                            </div>
                                                        </div>
                                                        <FormMessage className="text-center text-[10px]"/>
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        {/* Row 4: Detailed Feedback */}
                                        <FormField
                                            control={form.control}
                                            name="feedback"
                                            render={({ field }) => (
                                                <FormItem className="space-y-0">
                                                    <FormControl>
                                                        <div className="relative group h-full">
                                                            <div className="absolute left-4 top-5 pointer-events-none transition-transform duration-300 group-focus-within:scale-110">
                                                                <MessageSquare className="h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                                                            </div>
                                                            <Textarea 
                                                                placeholder="Describe your experience in detail... *" 
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

                                    {/* Footer / Submit Button */}
                                    <div className="p-6 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:divide-slate-800">
                                        <Button type="submit" className="w-full h-12 text-[11px] font-black bg-primary hover:bg-primary/90 text-white rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-[0.98] group uppercase" disabled={form.formState.isSubmitting}>
                                            {form.formState.isSubmitting ? 'PROCESSING...' : 'SUBMIT FEEDBACK'}
                                            <Send className="ml-2 h-3.5 w-3.5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                                        </Button>
                                    </div>
                                </form>
                           </Form>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <Dialog open={isThankYouOpen} onOpenChange={setIsThankYouOpen}>
                <DialogContent className="rounded-[2rem] max-w-sm border-none shadow-2xl p-8">
                    <DialogHeader>
                        <div className="flex justify-center mb-6">
                            <div className="bg-green-100 p-4 rounded-3xl">
                                <CheckCircle className="w-12 h-12 text-green-500" />
                            </div>
                        </div>
                        <DialogTitle className="text-center text-2xl font-black tracking-tight text-slate-900">Thank You!</DialogTitle>
                        <DialogDescription className="text-center font-bold text-xs text-slate-600 leading-relaxed pt-2 px-2">
                            Your feedback has been submitted successfully. We appreciate your input and will use it to enhance our services.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="mt-6">
                        <Button onClick={() => setIsThankYouOpen(false)} className="w-full h-12 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-primary/10">
                            Close Workspace
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}