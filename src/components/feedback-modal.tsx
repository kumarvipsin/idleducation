'use client';

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Star, Send, Phone, User, CheckCircle2, MessageSquare, ShieldCheck, HeartHandshake } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { submitFeedback } from "@/app/actions";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

const feedbackSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  mobile: z.string().regex(/^\d{10}$/, { message: "Please enter a valid 10-digit mobile number." }),
  feedback: z.string().min(5, { message: "Please share a few words about your experience (min 5 characters)." }),
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

interface FeedbackModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const toTitleCase = (str: string) => {
  return str.replace(/\b([a-z])/g, (char) => char.toUpperCase());
};

const toSentenceCase = (str: string) => {
  return str.replace(/(^\s*|[.!?]\s+)([a-z])/g, (_, p1, p2) => p1 + p2.toUpperCase());
};

export function FeedbackModal({ isOpen, onOpenChange }: FeedbackModalProps) {
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

  useEffect(() => {
    if (isOpen) {
      if (typeof document !== 'undefined' && document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
      const timer = setTimeout(() => {
        if (document.activeElement instanceof HTMLElement) {
          document.activeElement.blur();
        }
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

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
    <>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent
          onOpenAutoFocus={(e) => e.preventDefault()}
          onCloseAutoFocus={(e) => e.preventDefault()}
          className="w-[95vw] sm:w-full sm:max-w-[495px] shadow-lg rounded-2xl border border-[#D5DDEA] dark:border-slate-800 bg-white dark:bg-slate-950 p-0 overflow-hidden top-[calc(4rem+1rem)] sm:top-[calc(4rem+1.25rem)] translate-y-0 max-h-[calc(100dvh-7.5rem)] sm:max-h-[calc(100dvh-8rem)] flex flex-col data-[state=open]:slide-in-from-top-6 data-[state=open]:duration-300 data-[state=closed]:slide-out-to-top-6 data-[state=closed]:duration-200 ease-out"
        >
          {/* Modal Header: Clean, subtle and calm */}
          <DialogHeader className="px-5 sm:px-7 pt-5 pb-2 text-left shrink-0">
            <DialogTitle className="text-left text-2xl sm:text-[26px] font-bold text-[#18233A] tracking-tight leading-snug">
              Share Your Feedback
            </DialogTitle>
            <DialogDescription className="text-left text-[14px] sm:text-[15px] font-normal text-[#52627A] mt-1 leading-relaxed">
              Rate your experience and help us continuously improve our academic delivery and facilities.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="px-5 sm:px-7 py-4 sm:py-5 space-y-4 sm:space-y-4.5 text-left overflow-y-auto flex-1 min-h-0 overscroll-contain" autoComplete="off">
              {/* Row 1: Name & Mobile Number */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="space-y-0">
                      <FormLabel className="text-[15px] sm:text-[16px] font-semibold text-[#18233A] flex items-center gap-2 mb-2">
                        <User className="h-4 w-4 text-[#102A68]" />
                        Full Name <span className="text-[#E11D48]">*</span>
                      </FormLabel>
                      <FormControl>
                        <div className="relative rounded-[11px] border-[1.5px] border-[#D5DDEA] bg-white shadow-xs">
                          <Input
                            placeholder="e.g. Rahul Sharma"
                            {...field}
                            autoFocus={false}
                            value={field.value}
                            onChange={(e) => field.onChange(toTitleCase(e.target.value))}
                            className="h-12 border-0 bg-transparent text-[16px] sm:text-[17px] font-medium text-[#18233A] placeholder:text-[#94A3BA] focus-visible:ring-0 focus-visible:ring-offset-0 focus:ring-0 focus:outline-none outline-none px-3.5 capitalize"
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-[12px] font-medium text-rose-500 pt-1" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="mobile"
                  render={({ field }) => (
                    <FormItem className="space-y-0">
                      <FormLabel className="text-[15px] sm:text-[16px] font-semibold text-[#18233A] flex items-center gap-2 mb-2">
                        <Phone className="h-4 w-4 text-[#102A68]" />
                        Mobile Number <span className="text-[#E11D48]">*</span>
                      </FormLabel>
                      <FormControl>
                        <div className="relative rounded-[11px] border-[1.5px] border-[#D5DDEA] bg-white shadow-xs">
                          <Input
                            type="tel"
                            maxLength={10}
                            placeholder="e.g. 9876543210"
                            {...field}
                            autoFocus={false}
                            className="h-12 border-0 bg-transparent text-[16px] sm:text-[17px] font-medium text-[#18233A] placeholder:text-[#94A3BA] focus-visible:ring-0 focus-visible:ring-offset-0 focus:ring-0 focus:outline-none outline-none px-3.5"
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-[12px] font-medium text-rose-500 pt-1" />
                    </FormItem>
                  )}
                />
              </div>

              {/* Row 2: Star Rating (1 - 10) */}
              <FormField
                control={form.control}
                name="rating"
                render={({ field }) => (
                  <FormItem className="space-y-0">
                    <div className="flex items-center justify-between mb-2">
                      <FormLabel className="text-[15px] sm:text-[16px] font-semibold text-[#18233A] flex items-center gap-2">
                        <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                        Rate Your Experience <span className="text-[#E11D48]">*</span>
                      </FormLabel>
                      {currentRating > 0 && (
                        <span className="text-[12px] font-bold text-[#102A68]">
                          {ratingDetails.emoji} {currentRating}/10: {ratingDetails.label}
                        </span>
                      )}
                    </div>
                    <FormControl>
                      <div className="p-3.5 rounded-[11px] border-[1.5px] border-[#D5DDEA] bg-white shadow-xs flex items-center justify-between gap-1 overflow-x-auto">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => field.onChange(star)}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            className="p-1 hover:scale-110 transition-transform cursor-pointer focus:outline-none"
                          >
                            <Star
                              className={cn(
                                "w-5 h-5 sm:w-5.5 sm:h-5.5 transition-colors",
                                star <= currentRating
                                  ? "text-amber-500 fill-amber-500"
                                  : "text-slate-300 dark:text-slate-700"
                              )}
                            />
                          </button>
                        ))}
                      </div>
                    </FormControl>
                    <FormMessage className="text-[12px] font-medium text-rose-500 pt-1" />
                  </FormItem>
                )}
              />

              {/* Row 3: Feedback Message */}
              <FormField
                control={form.control}
                name="feedback"
                render={({ field }) => (
                  <FormItem className="space-y-0">
                    <FormLabel className="text-[15px] sm:text-[16px] font-semibold text-[#18233A] flex items-center gap-2 mb-2">
                      <MessageSquare className="h-4 w-4 text-[#102A68]" />
                      Your Feedback &amp; Suggestions <span className="text-[#E11D48]">*</span>
                    </FormLabel>
                    <FormControl>
                      <div className="relative rounded-[11px] border-[1.5px] border-[#D5DDEA] bg-white shadow-xs">
                        <Textarea
                          placeholder="Tell us what you liked and how we can improve..."
                          className="min-h-[90px] border-0 bg-transparent text-[16px] sm:text-[17px] font-medium text-[#18233A] placeholder:text-[#94A3BA] focus-visible:ring-0 focus-visible:ring-offset-0 focus:ring-0 focus:outline-none outline-none p-3.5 resize-none leading-relaxed"
                          {...field}
                          autoFocus={false}
                          onChange={(e) => field.onChange(toSentenceCase(e.target.value))}
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-[12px] font-medium text-rose-500 pt-1" />
                  </FormItem>
                )}
              />

              {/* Submit & Trust Note */}
              <div className="pt-2 space-y-2.5">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-11 px-6 rounded-[10px] text-[15px] sm:text-[16px] font-semibold bg-[#102A68] hover:bg-[#0D2254] text-white shadow-sm hover:shadow active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>{isSubmitting ? 'Submitting Feedback...' : 'Submit Feedback'}</span>
                  <Send className="h-4 w-4" />
                </Button>

                <div className="flex items-center justify-center gap-1.5 text-[12px] text-[#52627A] text-center font-medium">
                  <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>We value your genuine response to build better education.</span>
                </div>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Thank You Dialog */}
      <Dialog open={isThankYouOpen} onOpenChange={setIsThankYouOpen}>
        <DialogContent className="rounded-2xl max-w-sm border border-[#D5DDEA] p-6 bg-white dark:bg-slate-900 text-center shadow-lg">
          <DialogHeader className="space-y-2">
            <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <DialogTitle className="text-xl font-bold text-[#18233A] dark:text-slate-100">Thank You!</DialogTitle>
            <DialogDescription className="text-sm font-normal text-[#52627A] dark:text-slate-400 leading-relaxed">
              Your feedback has been submitted successfully. Our team deeply appreciates your time and suggestions.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button
              onClick={() => {
                setIsThankYouOpen(false);
                onOpenChange(false);
              }}
              className="w-full h-11 rounded-[10px] font-semibold text-[15px] bg-[#102A68] hover:bg-[#0D2254] text-white cursor-pointer shadow-sm"
            >
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
