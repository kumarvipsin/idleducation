'use client';

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Star, Send, User, Mail, MessageSquare, Sparkles, CheckCircle, ArrowRight } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { submitFeedback } from "@/app/actions";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const feedbackSchema = z.object({
  name: z.string().optional(),
  email: z.string().email({ message: "Please enter a valid email." }).optional().or(z.literal('')),
  category: z.string().min(1, { message: "Please select a category." }),
  rating: z.number().min(1, { message: "Please provide a rating." }),
  feedback: z.string().min(10, { message: "Feedback must be at least 10 characters." }),
});

type FeedbackFormValues = z.infer<typeof feedbackSchema>;

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

    const rating = form.watch('rating');

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
        <div className="min-h-screen w-full bg-[#F8F7FF] dark:bg-slate-950 overflow-x-hidden relative">
            {/* Floating Decorative Elements */}
            <div className="absolute top-[10%] left-[5%] w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-pulse pointer-events-none" />
            <div className="absolute bottom-[10%] right-[5%] w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse pointer-events-none" />
            
            <div className="container mx-auto px-4 md:px-6 py-12 lg:py-20 relative z-10">
                <div className="max-w-xl mx-auto space-y-10">
                    {/* Header Section */}
                    <div className="text-center space-y-4 animate-fade-in-up">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white shadow-sm border border-primary/5 text-primary text-[11px] font-black uppercase tracking-[0.2em]">
                            <Sparkles className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                            Community Voice
                        </div>
                        <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tighter leading-tight">
                            Share Your{' '}
                            <span className="relative inline-block">
                                <span className="relative z-10 text-primary">Feedback</span>
                                <div className="absolute -bottom-1 left-0 w-full h-3 z-0">
                                    <svg viewBox="0 0 100 15" preserveAspectRatio="none" className="w-full h-full text-blue-500 fill-none stroke-current stroke-[10] opacity-70">
                                        <path d="M0,15 Q50,5 100,15" />
                                    </svg>
                                </div>
                            </span>
                        </h1>
                        <p className="max-w-md mx-auto text-slate-600 dark:text-slate-400 text-sm md:text-base font-bold leading-relaxed text-balance">
                            We value your opinion and would love to hear about your experience.
                        </p>
                    </div>

                    {/* Feedback Form Card - Slightly Rounded */}
                    <Card className="shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-xl border-none bg-white dark:bg-slate-900 overflow-hidden animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                        <div className="bg-primary p-6 text-center">
                            <h2 className="text-xl font-black text-white tracking-tight uppercase">User Evaluation Form</h2>
                            <p className="text-[10px] font-bold text-white/70 uppercase tracking-widest mt-1">Help us improve your learning journey</p>
                        </div>
                        <CardContent className="p-8 space-y-6">
                           <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                    <div className="grid sm:grid-cols-2 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="name"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <div className="relative group">
                                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                                                            <Input placeholder="Name (Optional)" {...field} className="pl-11 h-12 bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-700 rounded-lg font-bold transition-all focus:ring-2 focus:ring-primary/20" />
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
                                                        <div className="relative group">
                                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                                                            <Input type="email" placeholder="Email (Optional)" {...field} className="pl-11 h-12 bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-700 rounded-lg font-bold transition-all focus:ring-2 focus:ring-primary/20" />
                                                        </div>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    
                                    <FormField
                                        control={form.control}
                                        name="category"
                                        render={({ field }) => (
                                            <FormItem>
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger className="h-12 bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-700 rounded-lg font-bold focus:ring-2 focus:ring-primary/20">
                                                            <SelectValue placeholder="Feedback Category *" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="general">General Feedback</SelectItem>
                                                        <SelectItem value="course-content">Course Content</SelectItem>
                                                        <SelectItem value="teacher">Teacher Experience</SelectItem>
                                                        <SelectItem value="technical-issue">Technical Issue</SelectItem>
                                                        <SelectItem value="suggestion">Suggestion</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="rating"
                                        render={({ field }) => (
                                            <FormItem className="text-center space-y-3">
                                                <p className="text-[11px] font-black uppercase tracking-widest text-slate-400">Experience Rating</p>
                                                <FormControl>
                                                     <div className="flex justify-center gap-3">
                                                        {[1, 2, 3, 4, 5].map((star) => (
                                                            <button
                                                                type="button"
                                                                key={star}
                                                                onMouseEnter={() => setHoverRating(star)}
                                                                onMouseLeave={() => setHoverRating(0)}
                                                                onClick={() => field.onChange(star)}
                                                                className="focus:outline-none transition-transform active:scale-90"
                                                            >
                                                                <Star className={cn(
                                                                    "w-10 h-10 transition-all duration-300",
                                                                    (hoverRating || rating) >= star 
                                                                        ? "text-yellow-400 fill-yellow-400 scale-110 drop-shadow-md" 
                                                                        : "text-slate-200 dark:text-slate-700 hover:scale-110"
                                                                )} />
                                                            </button>
                                                        ))}
                                                    </div>
                                                </FormControl>
                                                <FormMessage className="text-center"/>
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="feedback"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <div className="relative group">
                                                        <MessageSquare className="absolute left-4 top-4 h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                                                        <Textarea 
                                                            placeholder="Describe your experience in detail... *" 
                                                            className="min-h-[150px] pl-11 bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-700 rounded-lg font-bold transition-all focus:ring-2 focus:ring-primary/20"
                                                            {...field}
                                                        />
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <Button type="submit" className="w-full h-14 text-sm font-black bg-primary hover:bg-primary/90 text-white rounded-lg shadow-xl shadow-primary/20 transition-all active:scale-[0.98] group uppercase tracking-widest" disabled={form.formState.isSubmitting}>
                                        {form.formState.isSubmitting ? 'PROCESSING...' : 'Submit Feedback'}
                                        <Send className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                                    </Button>
                                </form>
                           </Form>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <Dialog open={isThankYouOpen} onOpenChange={setIsThankYouOpen}>
                <DialogContent className="rounded-xl">
                    <DialogHeader>
                        <div className="flex justify-center mb-4">
                            <div className="bg-green-100 p-4 rounded-full">
                                <CheckCircle className="w-16 h-16 text-green-500" />
                            </div>
                        </div>
                        <DialogTitle className="text-center text-2xl font-black tracking-tight text-slate-900">Thank You!</DialogTitle>
                        <DialogDescription className="text-center font-bold text-slate-600">
                            Your feedback has been submitted successfully. We appreciate you taking the time to share your thoughts with us.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button onClick={() => setIsThankYouOpen(false)} className="w-full h-12 rounded-lg font-black uppercase tracking-widest shadow-lg shadow-primary/10">
                            Close & Return
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
