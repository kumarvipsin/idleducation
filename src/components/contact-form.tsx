'use client';

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { User, Phone, Mail, MessageSquare, Send, ShieldCheck } from "lucide-react";
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="px-6 sm:px-8 py-3 sm:py-4 space-y-3 sm:space-y-3.5 text-left overflow-y-auto flex-1 min-h-0 overscroll-contain" autoComplete="off">
        {/* Row 1: Full Name & Phone Number (2 Columns on desktop) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="space-y-0">
                <FormLabel className="text-[16px] sm:text-[18px] md:text-[19px] font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 mb-1.5">
                  <User className="h-4 w-4 text-[#102A68] dark:text-blue-400 shrink-0" />
                  <span>Full Name</span> <span className="text-[#E11D48]">*</span>
                </FormLabel>
                <FormControl>
                  <div className="relative rounded-xl border-[1.25px] border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus-within:border-[#1F4FA3] focus-within:ring-2 focus-within:ring-[#1F4FA3]/15 transition-all duration-200 shadow-xs">
                    <Input 
                      placeholder="e.g. Rahul Sharma" 
                      {...field}
                      autoFocus={false}
                      value={field.value}
                      onChange={(e) => {
                        field.onChange(toTitleCase(e.target.value));
                      }}
                      className="h-10 sm:h-11 border-0 bg-transparent text-[16px] sm:text-[17px] font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus-visible:ring-0 focus-visible:ring-offset-0 focus:ring-0 focus:outline-none outline-none px-3.5 capitalize" 
                    />
                  </div>
                </FormControl>
                <FormMessage className="text-[12px] font-medium text-rose-500 pt-0.5" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem className="space-y-0">
                <FormLabel className="text-[16px] sm:text-[18px] md:text-[19px] font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 mb-1.5">
                  <Phone className="h-4 w-4 text-[#102A68] dark:text-blue-400 shrink-0" />
                  <span>Phone Number</span> <span className="text-[#E11D48]">*</span>
                </FormLabel>
                <FormControl>
                  <div className="relative rounded-xl border-[1.25px] border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus-within:border-[#1F4FA3] focus-within:ring-2 focus-within:ring-[#1F4FA3]/15 transition-all duration-200 shadow-xs">
                    <Input 
                      type="tel" 
                      maxLength={10}
                      placeholder="e.g. 9876543210" 
                      {...field} 
                      autoFocus={false}
                      className="h-10 sm:h-11 border-0 bg-transparent text-[16px] sm:text-[17px] font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus-visible:ring-0 focus-visible:ring-offset-0 focus:ring-0 focus:outline-none outline-none px-3.5" 
                    />
                  </div>
                </FormControl>
                <FormMessage className="text-[12px] font-medium text-rose-500 pt-0.5" />
              </FormItem>
            )}
          />
        </div>

        {/* Row 2: Email Address (Full width) */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="space-y-0">
              <FormLabel className="text-[16px] sm:text-[18px] md:text-[19px] font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 mb-1.5">
                <Mail className="h-4 w-4 text-[#102A68] dark:text-blue-400 shrink-0" />
                <span>Email Address</span>
              </FormLabel>
              <FormControl>
                <div className="relative rounded-xl border-[1.25px] border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus-within:border-[#1F4FA3] focus-within:ring-2 focus-within:ring-[#1F4FA3]/15 transition-all duration-200 shadow-xs">
                  <Input 
                    type="email" 
                    placeholder="e.g. rahul@example.com" 
                    {...field} 
                    autoFocus={false}
                    className="h-10 sm:h-11 border-0 bg-transparent text-[16px] sm:text-[17px] font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus-visible:ring-0 focus-visible:ring-offset-0 focus:ring-0 focus:outline-none outline-none px-3.5" 
                  />
                </div>
              </FormControl>
              <FormMessage className="text-[12px] font-medium text-rose-500 pt-0.5" />
            </FormItem>
          )}
        />

        {/* Row 3: Your Message / Query (Full width) */}
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem className="space-y-0">
              <FormLabel className="text-[16px] sm:text-[18px] md:text-[19px] font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 mb-1.5">
                <MessageSquare className="h-4 w-4 text-[#102A68] dark:text-blue-400 shrink-0" />
                <span>Your Message / Query</span> <span className="text-[#E11D48]">*</span>
              </FormLabel>
              <FormControl>
                <div className="relative rounded-xl border-[1.25px] border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus-within:border-[#1F4FA3] focus-within:ring-2 focus-within:ring-[#1F4FA3]/15 transition-all duration-200 shadow-xs">
                  <Textarea 
                    placeholder="Tell us about your enquiry or requirement..." 
                    className="min-h-[76px] sm:min-h-[82px] max-h-[130px] border-0 bg-transparent text-[16px] sm:text-[17px] font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus-visible:ring-0 focus-visible:ring-offset-0 focus:ring-0 focus:outline-none outline-none p-3 sm:p-3.5 resize-none leading-relaxed" 
                    {...field}
                    autoFocus={false}
                    value={field.value}
                    onChange={(e) => {
                      field.onChange(toSentenceCase(e.target.value));
                    }}
                  />
                </div>
              </FormControl>
              <FormMessage className="text-[12px] font-medium text-rose-500 pt-0.5" />
            </FormItem>
          )}
        />

        {/* Footer: Submit Button & Security Note */}
        <div className="pt-1.5 sm:pt-2 space-y-2">
          <Button 
            type="submit" 
            className="w-full h-11 sm:h-[46px] px-6 rounded-xl text-[15px] sm:text-[16px] font-bold bg-[#102A68] hover:bg-[#0D2254] text-white shadow-sm hover:shadow active:scale-[0.99] transition-all flex items-center justify-center gap-1.5 cursor-pointer group" 
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? (
              <span>Sending Enquiry...</span>
            ) : (
              <span>Send Enquiry →</span>
            )}
          </Button>

          <div className="flex items-center justify-center gap-1.5 text-[12px] sm:text-[12.5px] text-slate-500 dark:text-slate-400 text-center font-normal pt-0.5">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
            <span>100% confidential. No spam guaranteed.</span>
          </div>
        </div>
      </form>
    </Form>
  );
}