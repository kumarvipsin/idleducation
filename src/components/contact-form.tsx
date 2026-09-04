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
import { submitContactForm } from "@/app/actions";
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="px-5 sm:px-7 py-4 sm:py-5 space-y-4 sm:space-y-4.5 text-left overflow-y-auto flex-1 min-h-0 overscroll-contain" autoComplete="off">
        {/* Row 1: Full Name & Phone Number (2 Columns) */}
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
                      onChange={(e) => {
                        field.onChange(toTitleCase(e.target.value));
                      }}
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
            name="phone"
            render={({ field }) => (
              <FormItem className="space-y-0">
                <FormLabel className="text-[15px] sm:text-[16px] font-semibold text-[#18233A] flex items-center gap-2 mb-2">
                  <Phone className="h-4 w-4 text-[#102A68]" />
                  Phone Number <span className="text-[#E11D48]">*</span>
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

        {/* Row 2: Email Address */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="space-y-0">
              <FormLabel className="text-[15px] sm:text-[16px] font-semibold text-[#18233A] flex items-center gap-2 mb-2">
                <Mail className="h-4 w-4 text-[#102A68]" />
                Email Address
              </FormLabel>
              <FormControl>
                <div className="relative rounded-[11px] border-[1.5px] border-[#D5DDEA] bg-white shadow-xs">
                  <Input 
                    type="email" 
                    placeholder="e.g. rahul@example.com" 
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

        {/* Row 3: Your Message / Query */}
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem className="space-y-0">
              <FormLabel className="text-[15px] sm:text-[16px] font-semibold text-[#18233A] flex items-center gap-2 mb-2">
                <MessageSquare className="h-4 w-4 text-[#102A68]" />
                Your Message / Query <span className="text-[#E11D48]">*</span>
              </FormLabel>
              <FormControl>
                <div className="relative rounded-[11px] border-[1.5px] border-[#D5DDEA] bg-white shadow-xs">
                  <Textarea 
                    placeholder="Tell us about your enquiry or requirement..." 
                    className="min-h-[90px] border-0 bg-transparent text-[16px] sm:text-[17px] font-medium text-[#18233A] placeholder:text-[#94A3BA] focus-visible:ring-0 focus-visible:ring-offset-0 focus:ring-0 focus:outline-none outline-none p-3.5 resize-none leading-relaxed" 
                    {...field}
                    autoFocus={false}
                    value={field.value}
                    onChange={(e) => {
                      field.onChange(toSentenceCase(e.target.value));
                    }}
                  />
                </div>
              </FormControl>
              <FormMessage className="text-[12px] font-medium text-rose-500 pt-1" />
            </FormItem>
          )}
        />

        {/* Footer: Submit Button & Security Note */}
        <div className="pt-2 space-y-2.5">
          <Button 
            type="submit" 
            className="w-full h-11 px-6 rounded-[10px] text-[15px] sm:text-[16px] font-semibold bg-[#102A68] hover:bg-[#0D2254] text-white shadow-sm hover:shadow active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer" 
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? (
              <span>Sending Your Message...</span>
            ) : (
              <>
                <span>Send Message</span>
                <Send className="h-4 w-4" />
              </>
            )}
          </Button>

          <div className="flex items-center justify-center gap-1.5 text-[12px] text-[#52627A] text-center font-medium">
            <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
            <span>100% confidential. No spam guaranteed.</span>
          </div>
        </div>
      </form>
    </Form>
  );
}