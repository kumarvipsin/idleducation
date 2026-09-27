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
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col flex-1 h-full min-h-0 overflow-y-auto overscroll-contain" autoComplete="off">
        {/* Form Body & CTA Flow */}
        <div className="px-6 sm:px-8 pt-3 sm:pt-4 pb-6 sm:pb-7 space-y-3.5 sm:space-y-4 text-left">
          {/* Row 1: Full Name & Phone Number (2 Columns on desktop, stacked on mobile) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="text-left">
                  <FormLabel className="sr-only">Full Name</FormLabel>
                  <FormControl>
                    <div className="relative flex items-center rounded-xl border border-[#DCE7F6] dark:border-slate-800 bg-[#F8FAFD] dark:bg-slate-900/60 shadow-[0_1px_2px_rgba(0,0,0,0.02)] focus-within:border-[#0B1F4B] focus-within:ring-2 focus-within:ring-[#0B1F4B]/10 transition-all">
                      <Input 
                        placeholder="Full Name *" 
                        {...field}
                        autoFocus={false}
                        value={field.value}
                        onChange={(e) => {
                          field.onChange(toTitleCase(e.target.value));
                        }}
                        className="h-11 sm:h-12 border-0 bg-transparent text-[14px] sm:text-[14.5px] font-medium text-[#0B1F4B] dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400 focus-visible:ring-0 focus-visible:ring-offset-0 focus:ring-0 focus:outline-none outline-none px-3.5 sm:px-4 capitalize" 
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-[11.5px] font-medium text-rose-500 pt-1" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem className="text-left">
                  <FormLabel className="sr-only">Phone Number</FormLabel>
                  <FormControl>
                    <div className="relative flex items-center rounded-xl border border-[#DCE7F6] dark:border-slate-800 bg-[#F8FAFD] dark:bg-slate-900/60 shadow-[0_1px_2px_rgba(0,0,0,0.02)] focus-within:border-[#0B1F4B] focus-within:ring-2 focus-within:ring-[#0B1F4B]/10 transition-all">
                      <Input 
                        type="tel" 
                        maxLength={10}
                        placeholder="Phone Number *" 
                        {...field} 
                        autoFocus={false}
                        className="h-11 sm:h-12 border-0 bg-transparent text-[14px] sm:text-[14.5px] font-medium text-[#0B1F4B] dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400 focus-visible:ring-0 focus-visible:ring-offset-0 focus:ring-0 focus:outline-none outline-none px-3.5 sm:px-4" 
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-[11.5px] font-medium text-rose-500 pt-1" />
                </FormItem>
              )}
            />
          </div>

          {/* Row 2: Email Address (Full width) */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="text-left">
                <FormLabel className="sr-only">Email Address</FormLabel>
                <FormControl>
                  <div className="relative flex items-center rounded-xl border border-[#DCE7F6] dark:border-slate-800 bg-[#F8FAFD] dark:bg-slate-900/60 shadow-[0_1px_2px_rgba(0,0,0,0.02)] focus-within:border-[#0B1F4B] focus-within:ring-2 focus-within:ring-[#0B1F4B]/10 transition-all">
                    <Input 
                      type="email" 
                      placeholder="Email Address (Optional)" 
                      {...field} 
                      autoFocus={false}
                      className="h-11 sm:h-12 border-0 bg-transparent text-[14px] sm:text-[14.5px] font-medium text-[#0B1F4B] dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400 focus-visible:ring-0 focus-visible:ring-offset-0 focus:ring-0 focus:outline-none outline-none px-3.5 sm:px-4" 
                    />
                  </div>
                </FormControl>
                <FormMessage className="text-[11.5px] font-medium text-rose-500 pt-1" />
              </FormItem>
            )}
          />

          {/* Row 3: Your Message / Query (Full width) */}
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem className="text-left">
                <FormLabel className="sr-only">Your Message / Query</FormLabel>
                <FormControl>
                  <div className="relative rounded-xl border border-[#DCE7F6] dark:border-slate-800 bg-[#F8FAFD] dark:bg-slate-900/60 shadow-[0_1px_2px_rgba(0,0,0,0.02)] focus-within:border-[#0B1F4B] focus-within:ring-2 focus-within:ring-[#0B1F4B]/10 transition-all">
                    <Textarea 
                      placeholder="Your Message / Query *" 
                      className="min-h-[94px] sm:min-h-[100px] max-h-[140px] border-0 bg-transparent text-[14px] sm:text-[14.5px] font-medium text-[#0B1F4B] dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400 focus-visible:ring-0 focus-visible:ring-offset-0 focus:ring-0 focus:outline-none outline-none px-3.5 sm:px-4 pt-3 pb-3 resize-none leading-relaxed" 
                      {...field}
                      autoFocus={false}
                      value={field.value}
                      onChange={(e) => {
                        field.onChange(toSentenceCase(e.target.value));
                      }}
                    />
                  </div>
                </FormControl>
                <FormMessage className="text-[11.5px] font-medium text-rose-500 pt-1" />
              </FormItem>
            )}
          />

          {/* Row 4: Submit Enquiry Button (Seamless flow matching master design) */}
          <div className="pt-1.5 sm:pt-2">
            <Button 
              type="submit" 
              disabled={form.formState.isSubmitting}
              className="w-full h-11 sm:h-12 rounded-xl text-[15px] sm:text-[15.5px] font-bold bg-[#0B1F4B] hover:bg-[#155EEF] text-white shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2.5 cursor-pointer active:scale-[0.99] disabled:opacity-70 group outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0B1F4B]/30" 
            >
              {form.formState.isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Submitting Enquiry...</span>
                </>
              ) : (
                <>
                  <span>Submit Enquiry</span>
                  <ArrowRight className="w-4.5 h-4.5 stroke-[2.2] transition-transform group-hover:translate-x-1" />
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}