'use client';

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ArrowRight } from "lucide-react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { submitContactForm } from "@/app/actions/forms";
import { Input } from "@/components/ui/input";

const contactFormSchema = z.object({
  name: z.string().min(2, { message: "Full Name must be at least 2 characters." }),
  phone: z.string().min(10, { message: "A valid Phone Number is required." }),
  email: z.string().email({ message: "A valid Email Address is required." }).optional().or(z.literal('')),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

interface ContactFormProps {
  onSuccess?: () => void;
}

// Capitalizes the first letter of each word (Title Case)
const toTitleCase = (str: string) => {
  return str.replace(/\b([a-z])/g, (char) => char.toUpperCase());
};

// Capitalizes the first letter of sentences
const toSentenceCase = (str: string) => {
  return str.replace(/(^\s*|[.!?]\s+)([a-z])/g, (_, p1, p2) => p1 + p2.toUpperCase());
};

export function ContactForm({ onSuccess }: ContactFormProps) {
  const { toast } = useToast();

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      message: '',
    },
  });

  // Prevent auto-focusing / auto-selecting any field on popup open
  useEffect(() => {
    if (typeof document !== 'undefined' && document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    const timer = setTimeout(() => {
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  const onSubmit: SubmitHandler<ContactFormValues> = async (data) => {
    const result = await submitContactForm({ ...data, email: data.email || 'no-email@idleducation.in' });

    if (result.success) {
      toast({ title: "Message Sent Successfully!", description: "Our team will contact you shortly." });
      form.reset();
      if (onSuccess) onSuccess();
    } else {
      toast({ variant: "destructive", title: "Error", description: result.message });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col flex-1 min-h-0 overflow-y-auto overscroll-contain" autoComplete="off">
        {/* Form Body - Clean Underlines, Consistent Vertical Spacing matching Scholarship Form */}
        <div className="px-4 sm:px-7 pt-3.5 sm:pt-4 pb-4 sm:pb-5 space-y-3.5 sm:space-y-4 text-left">
          {/* Row 1: Full Name & Phone Number (2 Columns on desktop, stacked on mobile) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="space-y-0 text-left">
                  <FormLabel className="sr-only">Full Name</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Full Name *" 
                      {...field}
                      value={field.value}
                      onChange={(e) => {
                        field.onChange(toTitleCase(e.target.value));
                      }}
                      className="h-[38px] sm:h-[40px] w-full border-0 border-b border-slate-200/90 dark:border-slate-700/80 !bg-transparent rounded-none px-0 text-[13px] sm:text-[13.5px] font-medium text-slate-900 dark:text-slate-100 placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:ring-0 focus:ring-offset-0 focus:border-[#2864E8] focus:shadow-[0_1px_0_0_#2864E8] focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-[#2864E8] focus-visible:shadow-[0_1px_0_0_#2864E8] shadow-none capitalize flex items-center leading-none transition-[border-color,box-shadow] duration-150" 
                    />
                  </FormControl>
                  <FormMessage className="text-[11.5px] font-medium text-rose-500 pt-0.5" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem className="space-y-0 text-left">
                  <FormLabel className="sr-only">Phone Number</FormLabel>
                  <FormControl>
                    <div className="relative h-[38px] sm:h-[40px] w-full flex items-center">
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 text-[13px] sm:text-[13.5px] font-semibold text-slate-500 dark:text-slate-400 select-none pointer-events-none">
                        +91
                      </span>
                      <Input 
                        type="tel" 
                        maxLength={10}
                        placeholder="Phone Number *" 
                        {...field} 
                        className="h-[38px] sm:h-[40px] w-full border-0 border-b border-slate-200/90 dark:border-slate-700/80 !bg-transparent rounded-none pl-[30px] sm:pl-[32px] pr-0 text-[13px] sm:text-[13.5px] font-medium text-slate-900 dark:text-slate-100 placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:ring-0 focus:ring-offset-0 focus:border-[#2864E8] focus:shadow-[0_1px_0_0_#2864E8] focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-[#2864E8] focus-visible:shadow-[0_1px_0_0_#2864E8] shadow-none flex items-center leading-none transition-[border-color,box-shadow] duration-150" 
                        onChange={(e) => field.onChange(e.target.value.replace(/\D/g, ''))}
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-[11.5px] font-medium text-rose-500 pt-0.5" />
                </FormItem>
              )}
            />
          </div>

          {/* Row 2: Email Address (Full width) */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="space-y-0 text-left">
                <FormLabel className="sr-only">Email Address</FormLabel>
                <FormControl>
                  <Input 
                    type="email" 
                    placeholder="Email Address (Optional)" 
                    {...field} 
                    className="h-[38px] sm:h-[40px] w-full border-0 border-b border-slate-200/90 dark:border-slate-700/80 !bg-transparent rounded-none px-0 text-[13px] sm:text-[13.5px] font-medium text-slate-900 dark:text-slate-100 placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:ring-0 focus:ring-offset-0 focus:border-[#2864E8] focus:shadow-[0_1px_0_0_#2864E8] focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-[#2864E8] focus-visible:shadow-[0_1px_0_0_#2864E8] shadow-none flex items-center leading-none transition-[border-color,box-shadow] duration-150" 
                  />
                </FormControl>
                <FormMessage className="text-[11.5px] font-medium text-rose-500 pt-0.5" />
              </FormItem>
            )}
          />

          {/* Row 3: Your Message / Query (Full width) - increased height for comfortable typing */}
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem className="space-y-0 text-left">
                <FormLabel className="sr-only">Your Message / Query *</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Your Message / Query *" 
                    rows={3}
                    className="min-h-[84px] sm:min-h-[88px] w-full border-0 border-b border-slate-200/90 dark:border-slate-700/80 !bg-transparent rounded-none px-0 py-2 text-[13px] sm:text-[13.5px] font-medium text-slate-900 dark:text-slate-100 placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:ring-0 focus:ring-offset-0 focus:border-[#2864E8] focus:shadow-[0_1px_0_0_#2864E8] focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-[#2864E8] focus-visible:shadow-[0_1px_0_0_#2864E8] shadow-none resize-none leading-relaxed transition-[border-color,box-shadow] duration-150" 
                    {...field}
                    value={field.value}
                    onChange={(e) => {
                      field.onChange(toSentenceCase(e.target.value));
                    }}
                  />
                </FormControl>
                <FormMessage className="text-[11.5px] font-medium text-rose-500 pt-0.5" />
              </FormItem>
            )}
          />

          {/* Row 4: Submit Button matching Scholarship Modal styling with improved spacing */}
          <Button 
            type="submit" 
            disabled={form.formState.isSubmitting}
            className="group w-full h-[40px] sm:h-[42px] rounded-[6px] font-bold text-[12px] sm:text-[12.5px] tracking-[0.08em] bg-[#2864E8] hover:bg-[#1E4ED8] active:bg-[#1842BE] text-white shadow-[0_2px_10px_rgba(40,100,232,0.28)] hover:shadow-[0_4px_16px_rgba(40,100,232,0.38)] active:shadow-sm active:translate-y-[0.5px] transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 !mt-5 sm:!mt-5.5 uppercase shrink-0" 
          >
            {form.formState.isSubmitting ? (
              <span className="inline-flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                SUBMITTING...
              </span>
            ) : (
              <>
                <span>SUBMIT MESSAGE</span>
                <ArrowRight className="w-4 h-4 text-white/90 group-hover:translate-x-0.5 transition-transform duration-150" />
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}