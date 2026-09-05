'use client';

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Star, Phone, User, CheckCircle2, MessageSquare, ShieldCheck, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { submitFeedback } from "@/app/actions/forms";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FormModalDialogContent } from "@/components/ui/form-modal-dialog";
import { cn } from "@/lib/utils";

const feedbackSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  mobile: z.string().regex(/^\d{10}$/, { message: "Please enter a valid 10-digit mobile number." }),
  feedback: z.string().min(5, { message: "Please share a few words about your experience (min 5 characters)." }),
  rating: z.number().min(1, { message: "Please select a rating (1-5 stars)." }).max(10),
});

type FeedbackFormValues = z.infer<typeof feedbackSchema>;

const getRatingDetails = (rating: number) => {
  switch (rating) {
    case 1:  return { label: "Needs Improvement", emoji: "😞" };
    case 2:  return { label: "Fair Experience",   emoji: "😐" };
    case 3:  return { label: "Good Experience",   emoji: "🙂" };
    case 4:  return { label: "Very Good",         emoji: "😄" };
    case 5:  return { label: "Excellent!",        emoji: "🌟" };
    default: return { label: "Select Rating (1 to 5 stars)", emoji: "✨" };
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
        <FormModalDialogContent
          onOpenAutoFocus={(e) => e.preventDefault()}
          onCloseAutoFocus={(e) => e.preventDefault()}
        >
          {/* Modal Header: Exact Admission Form standard */}
          <DialogHeader className="px-5 sm:px-7 pt-5 pb-3 text-left shrink-0 border-b border-slate-100 dark:border-slate-800/80">
            <DialogTitle className="text-left text-xl sm:text-2xl font-bold text-[#102A68] dark:text-white tracking-tight leading-snug">
              Share Your Feedback
            </DialogTitle>
            <DialogDescription className="text-left text-[13px] sm:text-[14px] font-normal text-slate-500 dark:text-slate-400 mt-0.5 leading-normal">
              Rate your experience and help us continuously improve our academic delivery and facilities.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col flex-1 h-full min-h-0 overflow-hidden" autoComplete="off">
              {/* Form Content */}
              <div className="px-5 sm:px-7 py-4 sm:py-5 space-y-3.5 sm:space-y-4 text-left overflow-y-auto flex-1 min-h-0 overscroll-contain">
                {/* Row 1: Name & Mobile Number */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="space-y-1.5">
                        <FormLabel className="text-[13px] sm:text-[14px] font-semibold text-[#18233A] dark:text-slate-200 flex items-center gap-1.5">
                          <User className="h-3.5 w-3.5 text-[#102A68] dark:text-blue-400" />
                          Full Name <span className="text-[#E11D48]">*</span>
                        </FormLabel>
                        <FormControl>
                          <div className="relative rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs focus-within:border-[#1F4FA3] focus-within:ring-2 focus-within:ring-[#1F4FA3]/15 transition-all">
                            <Input
                              placeholder="e.g. Rahul Sharma"
                              {...field}
                              autoFocus={false}
                              value={field.value}
                              onChange={(e) => field.onChange(toTitleCase(e.target.value))}
                              className="h-10 sm:h-11 border-0 bg-transparent text-[14px] sm:text-[15px] font-medium text-[#18233A] dark:text-slate-100 placeholder:text-[13px] sm:placeholder:text-[14px] placeholder:text-slate-400 focus-visible:ring-0 focus-visible:ring-offset-0 focus:ring-0 focus:outline-none outline-none px-3 capitalize"
                            />
                          </div>
                        </FormControl>
                        <FormMessage className="text-[12px] font-medium text-rose-500 pt-0.5" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="mobile"
                    render={({ field }) => (
                      <FormItem className="space-y-1.5">
                        <FormLabel className="text-[13px] sm:text-[14px] font-semibold text-[#18233A] dark:text-slate-200 flex items-center gap-1.5">
                          <Phone className="h-3.5 w-3.5 text-[#102A68] dark:text-blue-400" />
                          Mobile Number <span className="text-[#E11D48]">*</span>
                        </FormLabel>
                        <FormControl>
                          <div className="relative rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs focus-within:border-[#1F4FA3] focus-within:ring-2 focus-within:ring-[#1F4FA3]/15 transition-all">
                            <Input
                              type="tel"
                              maxLength={10}
                              placeholder="e.g. 9876543210"
                              {...field}
                              autoFocus={false}
                              className="h-10 sm:h-11 border-0 bg-transparent text-[14px] sm:text-[15px] font-medium text-[#18233A] dark:text-slate-100 placeholder:text-[13px] sm:placeholder:text-[14px] placeholder:text-slate-400 focus-visible:ring-0 focus-visible:ring-offset-0 focus:ring-0 focus:outline-none outline-none px-3"
                              onChange={(e) => field.onChange(e.target.value.replace(/\D/g, ''))}
                            />
                          </div>
                        </FormControl>
                        <FormMessage className="text-[12px] font-medium text-rose-500 pt-0.5" />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Row 2: Star Rating (5 Stars) */}
                <FormField
                  control={form.control}
                  name="rating"
                  render={({ field }) => (
                    <FormItem className="space-y-1.5">
                      <FormLabel className="text-[13px] sm:text-[14px] font-semibold text-[#18233A] dark:text-slate-200 flex items-center gap-1.5">
                        <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                        Rate Your Experience <span className="text-[#E11D48]">*</span>
                      </FormLabel>
                      <FormControl>
                        <div className="h-10 sm:h-11 px-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs flex items-center justify-between">
                          <div className="flex items-center gap-1.5 sm:gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                onClick={() => field.onChange(star)}
                                onMouseEnter={() => setHoverRating(star)}
                                onMouseLeave={() => setHoverRating(0)}
                                className="p-1 hover:scale-115 transition-transform cursor-pointer focus:outline-none"
                              >
                                <Star
                                  className={cn(
                                    "w-5 h-5 sm:w-5.5 sm:h-5.5 transition-colors",
                                    star <= currentRating
                                      ? "text-amber-500 fill-amber-500"
                                      : "text-slate-300 dark:text-slate-700 hover:text-amber-300"
                                  )}
                                />
                              </button>
                            ))}
                          </div>
                          {currentRating > 0 ? (
                            <span className="text-[12px] font-semibold text-[#102A68] dark:text-blue-400">
                              {ratingDetails.emoji} {currentRating}/5 · {ratingDetails.label}
                            </span>
                          ) : (
                            <span className="text-[12px] font-medium text-slate-400">
                              Tap star to rate (1–5)
                            </span>
                          )}
                        </div>
                      </FormControl>
                      <FormMessage className="text-[12px] font-medium text-rose-500 pt-0.5" />
                    </FormItem>
                  )}
                />

                {/* Row 3: Feedback Message */}
                <FormField
                  control={form.control}
                  name="feedback"
                  render={({ field }) => (
                    <FormItem className="space-y-1.5">
                      <FormLabel className="text-[13px] sm:text-[14px] font-semibold text-[#18233A] dark:text-slate-200 flex items-center gap-1.5">
                        <MessageSquare className="h-3.5 w-3.5 text-[#102A68] dark:text-blue-400" />
                        Your Feedback &amp; Suggestions <span className="text-[#E11D48]">*</span>
                      </FormLabel>
                      <FormControl>
                        <div className="relative rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs focus-within:border-[#1F4FA3] focus-within:ring-2 focus-within:ring-[#1F4FA3]/15 transition-all">
                          <Textarea
                            placeholder="Tell us what you liked and how we can improve..."
                            className="min-h-[90px] border-0 bg-transparent text-[14px] sm:text-[15px] font-medium text-[#18233A] dark:text-slate-100 placeholder:text-[13px] sm:placeholder:text-[14px] placeholder:text-slate-400 focus-visible:ring-0 focus-visible:ring-offset-0 focus:ring-0 focus:outline-none outline-none p-3 resize-none leading-relaxed"
                            {...field}
                            autoFocus={false}
                            onChange={(e) => field.onChange(toSentenceCase(e.target.value))}
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-[12px] font-medium text-rose-500 pt-0.5" />
                    </FormItem>
                  )}
                />
              </div>

              {/* Sticky Footer: Unified CTA & Trust Line */}
              <div className="px-5 sm:px-7 py-3 sm:py-3.5 bg-white/95 dark:bg-slate-950/95 backdrop-blur-sm border-t border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0 mt-auto sticky bottom-0 z-20 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
                <div className="flex items-center justify-center sm:justify-start gap-1.5 text-[11px] sm:text-[12px] text-slate-500 dark:text-slate-400 font-medium order-2 sm:order-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>We value your genuine response to build better education.</span>
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-10 sm:h-11 px-6 sm:px-7 rounded-xl text-[13px] sm:text-[14px] font-semibold bg-[#102A68] hover:bg-[#0C1E4A] text-white shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 cursor-pointer w-full sm:w-auto order-1 sm:order-2"
                >
                  <span>{isSubmitting ? 'Submitting...' : 'Submit Feedback'}</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </form>
          </Form>
        </FormModalDialogContent>
      </Dialog>

      {/* Thank You Dialog */}
      <Dialog open={isThankYouOpen} onOpenChange={setIsThankYouOpen}>
        <DialogContent className="rounded-2xl max-w-sm border border-slate-200 dark:border-slate-800 p-6 bg-white dark:bg-slate-900 text-center shadow-2xl">
          <DialogHeader className="space-y-2">
            <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <DialogTitle className="text-xl font-bold text-[#102A68] dark:text-white">Thank You!</DialogTitle>
            <DialogDescription className="text-[13px] sm:text-[14px] font-normal text-slate-500 dark:text-slate-400 leading-relaxed">
              Your feedback has been submitted successfully. Our team deeply appreciates your time and suggestions.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button
              onClick={() => {
                setIsThankYouOpen(false);
                onOpenChange(false);
              }}
              className="w-full h-10 sm:h-11 rounded-xl font-semibold text-[13px] sm:text-[14px] bg-[#102A68] hover:bg-[#0C1E4A] text-white cursor-pointer shadow-sm"
            >
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
