'use client';

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Star, Send, Phone, User, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { submitFeedback } from "@/app/actions";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const feedbackSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  mobile: z.string().regex(/^\d{10}$/, { message: "Please enter a valid 10-digit mobile number." }),
  feedback: z.string().min(5, { message: "Please share a few words (min 5 characters)." }),
  rating: z.number().min(1, { message: "Please select a rating (1-10)." }).max(10),
});

type FeedbackFormValues = z.infer<typeof feedbackSchema>;

const getRatingDetails = (rating: number) => {
  switch (rating) {
    case 1:  return { label: "Very Poor",              emoji: "😞", color: "text-rose-500   bg-rose-500/10    border-rose-200" };
    case 2:  return { label: "Poor",                   emoji: "🙁", color: "text-rose-400   bg-rose-500/10    border-rose-200" };
    case 3:  return { label: "Below Average",          emoji: "😐", color: "text-amber-600  bg-amber-500/10   border-amber-200" };
    case 4:  return { label: "Average",                emoji: "🙂", color: "text-amber-500  bg-amber-500/10   border-amber-200" };
    case 5:  return { label: "Decent",                 emoji: "😊", color: "text-blue-500   bg-blue-500/10    border-blue-200" };
    case 6:  return { label: "Good",                   emoji: "😃", color: "text-blue-600   bg-blue-500/10    border-blue-200" };
    case 7:  return { label: "Very Good",              emoji: "😄", color: "text-emerald-500 bg-emerald-500/10 border-emerald-200" };
    case 8:  return { label: "Great Experience",       emoji: "🤩", color: "text-emerald-600 bg-emerald-500/10 border-emerald-200" };
    case 9:  return { label: "Excellent & Inspiring",  emoji: "🌟", color: "text-primary     bg-primary/10     border-primary/30" };
    case 10: return { label: "Perfection & Outstanding!", emoji: "🏆", color: "text-primary  bg-primary/15     border-primary/40 font-black" };
    default: return { label: "Select your rating (1 to 10)", emoji: "✨", color: "text-slate-400 bg-slate-100 dark:bg-slate-800 border-slate-200" };
  }
};

export default function FeedbackPage() {
    const { toast } = useToast();
    const [hoverRating, setHoverRating] = useState(0);
    const [isThankYouOpen, setIsThankYouOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<FeedbackFormValues>({
        resolver: zodResolver(feedbackSchema),
        defaultValues: { name: '', mobile: '', feedback: '', rating: 0 },
    });

    const currentRating = hoverRating || form.watch('rating') || 0;
    const ratingDetails = getRatingDetails(currentRating);
    const feedbackMessage = form.watch('feedback') || '';

    const onSubmit: SubmitHandler<FeedbackFormValues> = async (data) => {
        setIsSubmitting(true);
        try {
            const result = await submitFeedback({ ...data } as any);
            if (result.success) {
                setIsThankYouOpen(true);
                form.reset();
                setHoverRating(0);
            } else {
                toast({ variant: "destructive", title: "Submission Error", description: result.message });
            }
        } catch {
            toast({ variant: "destructive", title: "Error", description: "An unexpected error occurred." });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen w-full bg-[#F8F7FF] dark:bg-slate-950 relative selection:bg-primary/10">
            <div className="container mx-auto px-4 md:px-6 py-12 lg:py-16 relative z-10">
                <div className="max-w-lg mx-auto">
                    <Card className="shadow-none rounded-2xl border-2 border-primary/10 bg-white dark:bg-slate-900 overflow-hidden">
                        <div className="px-6 py-5 text-left border-b border-slate-100 dark:border-slate-800 space-y-0.5">
                            <h1 className="text-2xl font-extrabold text-primary tracking-tighter">Share Your Feedback</h1>
                            <p className="text-[13px] font-extrabold text-muted-foreground">
                                Rate your experience and help us elevate our teaching and facilities
                            </p>
                        </div>

                        <CardContent className="p-0">
                           <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col">
                                    <div className="grid grid-cols-1 divide-y divide-slate-100 dark:divide-slate-800">

                                        {/* Name */}
                                        <FormField
                                            control={form.control}
                                            name="name"
                                            render={({ field }) => (
                                                <FormItem className="space-y-0">
                                                    <FormControl>
                                                        <div className="relative group">
                                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none group-focus-within:scale-110 transition-transform">
                                                                <User className="h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                                                            </div>
                                                            <Input
                                                                {...field}
                                                                placeholder="Your Full Name *"
                                                                className="pl-12 h-14 bg-transparent border-0 rounded-none font-bold text-[13px] text-slate-800 dark:text-slate-200 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-slate-400"
                                                            />
                                                        </div>
                                                    </FormControl>
                                                    <FormMessage className="text-[10px] px-4 pb-2 text-rose-500 font-bold" />
                                                </FormItem>
                                            )}
                                        />

                                        {/* Mobile */}
                                        <FormField
                                            control={form.control}
                                            name="mobile"
                                            render={({ field }) => (
                                                <FormItem className="space-y-0">
                                                    <FormControl>
                                                        <div className="relative group">
                                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none group-focus-within:scale-110 transition-transform">
                                                                <Phone className="h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                                                            </div>
                                                            <Input
                                                                {...field}
                                                                type="tel"
                                                                maxLength={10}
                                                                placeholder="Mobile Number (10 digits) *"
                                                                className="pl-12 h-14 bg-transparent border-0 rounded-none font-bold text-[13px] text-slate-800 dark:text-slate-200 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-slate-400"
                                                            />
                                                        </div>
                                                    </FormControl>
                                                    <FormMessage className="text-[10px] px-4 pb-2 text-rose-500 font-bold" />
                                                </FormItem>
                                            )}
                                        />

                                        {/* Message */}
                                        <div className="p-5">
                                            <FormField
                                                control={form.control}
                                                name="feedback"
                                                render={({ field }) => (
                                                    <FormItem className="space-y-1.5">
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                                                                Your Message *
                                                            </span>
                                                            <span className="text-[10.5px] font-bold text-slate-400">
                                                                {feedbackMessage.length} chars
                                                            </span>
                                                        </div>
                                                        <FormControl>
                                                            <Textarea
                                                                {...field}
                                                                rows={4}
                                                                placeholder="Tell us what you liked, your experience with classes or faculties, or suggestions for improvement..."
                                                                className="p-3.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-[13px] text-slate-800 dark:text-slate-200 focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-offset-0 placeholder:text-slate-400 resize-none min-h-[110px]"
                                                            />
                                                        </FormControl>
                                                        <FormMessage className="text-[10px] text-rose-500 font-bold" />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        {/* 10-Star Rating — last */}
                                        <div className="p-5 bg-gradient-to-b from-slate-50/80 to-white dark:from-slate-800/40 dark:to-slate-900 space-y-2.5">
                                            <FormField
                                                control={form.control}
                                                name="rating"
                                                render={({ field }) => (
                                                    <FormItem className="space-y-2">
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                                                                Your Rating *
                                                            </span>
                                                            <span className="text-xs font-black font-mono text-primary bg-primary/10 px-2 py-0.5 rounded-md">
                                                                {currentRating > 0 ? `${currentRating} / 10` : 'Tap to rate'}
                                                            </span>
                                                        </div>

                                                        <div className="flex items-center justify-between gap-0.5 p-2 bg-white dark:bg-slate-950 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-inner">
                                                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => {
                                                                const isFilled = currentRating >= star;
                                                                return (
                                                                    <button
                                                                        key={star}
                                                                        type="button"
                                                                        onClick={() => field.onChange(star)}
                                                                        onMouseEnter={() => setHoverRating(star)}
                                                                        onMouseLeave={() => setHoverRating(0)}
                                                                        className={cn(
                                                                            "flex-1 flex flex-col items-center justify-center p-1 rounded-lg cursor-pointer transition-all duration-150 focus:outline-none",
                                                                            isFilled ? "scale-105" : "hover:scale-110 opacity-40 hover:opacity-100"
                                                                        )}
                                                                    >
                                                                        <Star className={cn(
                                                                            "w-5 h-5 transition-colors duration-150",
                                                                            isFilled
                                                                                ? "fill-amber-400 text-amber-400 drop-shadow-[0_2px_8px_rgba(251,191,36,0.4)]"
                                                                                : "text-slate-300 dark:text-slate-600"
                                                                        )} />
                                                                        <span className={cn(
                                                                            "text-[8px] font-black mt-0.5 font-mono",
                                                                            isFilled ? "text-amber-600 dark:text-amber-400" : "text-slate-400"
                                                                        )}>
                                                                            {star}
                                                                        </span>
                                                                    </button>
                                                                );
                                                            })}
                                                        </div>

                                                        <div className={cn(
                                                            "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border transition-all duration-200",
                                                            ratingDetails.color
                                                        )}>
                                                            <span>{ratingDetails.emoji}</span>
                                                            <span>{ratingDetails.label}</span>
                                                        </div>

                                                        <FormMessage className="text-[10px] text-rose-500 font-bold" />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </div>

                                    {/* Submit */}
                                    <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                                        <Button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="w-full sm:w-auto h-11 px-8 text-xs font-bold bg-primary text-white rounded-xl hover:bg-primary/90 active:scale-[0.98] group uppercase cursor-pointer"
                                        >
                                            <span>{isSubmitting ? 'Submitting...' : 'Submit Feedback'}</span>
                                            <Send className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                        </Button>
                                    </div>
                                </form>
                            </Form>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <Dialog open={isThankYouOpen} onOpenChange={setIsThankYouOpen}>
                <DialogContent className="rounded-2xl max-w-sm border border-border p-6 bg-white dark:bg-slate-900 text-center">
                    <DialogHeader className="space-y-2">
                        <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center">
                            <CheckCircle2 className="w-8 h-8" />
                        </div>
                        <DialogTitle className="text-xl font-bold text-slate-900 dark:text-slate-100">Thank You!</DialogTitle>
                        <DialogDescription className="text-xs text-muted-foreground leading-relaxed">
                            We deeply appreciate your feedback. Your insights help us continuously elevate the student academic experience.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="mt-4">
                        <Button
                            onClick={() => setIsThankYouOpen(false)}
                            className="w-full h-10 rounded-xl font-bold text-xs bg-primary text-white cursor-pointer"
                        >
                            Done
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}