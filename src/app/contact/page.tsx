'use client';

import { useCallback, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowRight, Lock, Mail, MessageCircle, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { submitContactForm } from "@/app/actions/forms";

const ENQUIRY_TYPES = [
  "Franchise Opportunity",
  "Investment / Investor Enquiry",
  "Business Partnership",
  "Meeting / Appointment",
  "Collaboration",
  "Other Business Enquiry",
] as const;

const SUPPORT_HIGHLIGHTS = [
  {
    id: "call",
    title: "Call Us",
    text: "8860040010",
    href: "tel:8860040010",
    icon: Phone,
    spacingClass: "pb-2.5 sm:pb-0 sm:pr-2.5",
  },
  {
    id: "email",
    title: "Email Us",
    text: "info@idleducation.in",
    href: "mailto:info@idleducation.in",
    icon: Mail,
    spacingClass: "py-2.5 sm:py-0 sm:px-2.5",
  },
  {
    id: "help",
    title: "We're Here to Help",
    text: "We're happy to discuss your enquiry.",
    icon: MessageCircle,
    spacingClass: "pt-2.5 sm:pt-0 sm:pl-2.5",
  },
] as const;

const businessContactSchema = z.object({
  name: z.string().min(2, { message: "Full Name must be at least 2 characters." }),
  phone: z.string().min(10, { message: "Please enter a valid 10-digit phone number." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  enquiryType: z.string().min(1, { message: "Please select an Enquiry Type." }),
  company: z.string().optional().or(z.literal("")),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }),
});

type BusinessContactValues = z.infer<typeof businessContactSchema>;

const toTitleCase = (str: string) =>
  str.replace(/\b([a-z])/g, (char) => char.toUpperCase());

const toSentenceCase = (str: string) =>
  str.replace(/(^\s*|[.!?]\s+)([a-z])/g, (_, p1, p2) => p1 + p2.toUpperCase());

export default function ContactPage() {
  const { toast } = useToast();
  const cardRef = useRef<HTMLDivElement>(null);

  // Keep global floating WhatsApp & AI widgets clear of the card on smaller viewports without touching global components.
  const syncFloatingWidgetClearance = useCallback(() => {
    if (typeof window === "undefined") return;
    const whatsappBtn = document.getElementById("whatsapp-floating-btn");
    const aiBtn = document.getElementById("idl-ai-floating-btn");
    const resetInlinePosition = (el: HTMLElement | null) => {
      if (!el) return;
      el.style.removeProperty("position");
      el.style.removeProperty("top");
      el.style.removeProperty("right");
      el.style.removeProperty("bottom");
    };

    const cardEl = cardRef.current;
    if (!cardEl) {
      resetInlinePosition(whatsappBtn);
      resetInlinePosition(aiBtn);
      return;
    }

    const rect = cardEl.getBoundingClientRect();
    const needsClearance = rect.right + 96 > window.innerWidth;

    if (!needsClearance) {
      resetInlinePosition(whatsappBtn);
      resetInlinePosition(aiBtn);
      return;
    }

    const cardBottomDoc = window.scrollY + rect.bottom;
    if (whatsappBtn) {
      whatsappBtn.style.position = "absolute";
      whatsappBtn.style.top = `${Math.round(cardBottomDoc + 16)}px`;
      whatsappBtn.style.right = "16px";
      whatsappBtn.style.bottom = "auto";
    }
    if (aiBtn) {
      aiBtn.style.position = "absolute";
      aiBtn.style.top = `${Math.round(cardBottomDoc + 26)}px`;
      aiBtn.style.right = "74px";
      aiBtn.style.bottom = "auto";
    }
  }, []);

  useEffect(() => {
    syncFloatingWidgetClearance();
    const rafId = window.requestAnimationFrame(syncFloatingWidgetClearance);
    const resizeObserver =
      typeof ResizeObserver !== "undefined" && cardRef.current
        ? new ResizeObserver(syncFloatingWidgetClearance)
        : null;
    if (resizeObserver && cardRef.current) {
      resizeObserver.observe(cardRef.current);
    }

    const mutationObserver = new MutationObserver(syncFloatingWidgetClearance);
    mutationObserver.observe(document.body, { childList: true, subtree: true });
    window.addEventListener("resize", syncFloatingWidgetClearance);

    return () => {
      window.cancelAnimationFrame(rafId);
      resizeObserver?.disconnect();
      mutationObserver.disconnect();
      window.removeEventListener("resize", syncFloatingWidgetClearance);
      const whatsappBtn = document.getElementById("whatsapp-floating-btn");
      const aiBtn = document.getElementById("idl-ai-floating-btn");
      [whatsappBtn, aiBtn].forEach((el) => {
        if (!el) return;
        el.style.removeProperty("position");
        el.style.removeProperty("top");
        el.style.removeProperty("right");
        el.style.removeProperty("bottom");
      });
    };
  }, [syncFloatingWidgetClearance]);

  const form = useForm<BusinessContactValues>({
    resolver: zodResolver(businessContactSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      enquiryType: "",
      company: "",
      message: "",
    },
  });

  const onSubmit: SubmitHandler<BusinessContactValues> = async (data) => {
    const metaLines = [
      `Enquiry Type: ${data.enquiryType}`,
      ...(data.company?.trim() ? [`Company / Organisation: ${data.company.trim()}`] : []),
    ].join("\n");

    const result = await submitContactForm({
      name: data.name,
      phone: data.phone,
      email: data.email,
      message: `${metaLines}\n\n${data.message}`,
    });

    if (result.success) {
      toast({
        title: "Business Enquiry Sent!",
        description: "Thank you for connecting with IDL Education. Our team will get in touch shortly.",
      });
      form.reset();
    } else {
      toast({
        variant: "destructive",
        title: "Unable to Submit",
        description: result.message,
      });
    }
  };

  const inputBaseClass =
    "h-[40px] w-full border-0 border-b border-slate-200 dark:border-slate-700/85 hover:border-slate-300 dark:hover:border-slate-600 !bg-transparent rounded-none px-0 text-[13.5px] sm:text-[14px] font-medium text-[#0B1F4B] dark:text-slate-100 placeholder:text-[#7A8CA8] dark:placeholder:text-slate-500 placeholder:font-normal focus:outline-none focus:ring-0 focus:ring-offset-0 focus:border-[#155EEF] focus:shadow-[0_1.5px_0_0_#155EEF] focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-[#155EEF] focus-visible:shadow-[0_1.5px_0_0_#155EEF] shadow-none leading-none transition-[border-color,box-shadow] duration-150";

  return (
    <div className="bg-white dark:bg-background antialiased">
      {/* CENTERED BUSINESS CONTACT CARD — MATCHING /PAY-FEE CLEAN CARD LAYOUT */}
      <section className="relative overflow-hidden pt-7 pb-[82px] sm:pt-9 md:py-11 min-h-[calc(100vh-360px)] bg-gradient-to-b from-[#FFFFFF] via-[#F9FBFE] via-65% to-[#FFFFFF] dark:from-[#070C18] dark:to-background flex items-start justify-center">
        {/* Centered Subtle Pale-Blue Ambient Wash */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 46% 58% at 50% 50%, rgba(219, 234, 254, 0.34) 0%, rgba(239, 246, 255, 0.14) 48%, transparent 72%)",
          }}
        />

        {/* Restrained Centered Low-Opacity Dot Grid Texture */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(#0B1F4B0a_1.2px,transparent_1.2px)] dark:bg-[radial-gradient(#ffffff09_1.2px,transparent_1.2px)] [background-size:24px_24px] pointer-events-none [mask-image:radial-gradient(ellipse_64%_68%_at_50%_50%,#000_34%,transparent_90%)] opacity-50"
        />

        <div className="w-full md:container mx-auto px-4 md:px-6 relative z-10 flex justify-center">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            onAnimationComplete={syncFloatingWidgetClearance}
            className="w-full max-w-[520px] sm:max-w-[540px] mx-auto relative"
          >
            <div
              ref={cardRef}
              data-contact-card
              className="relative rounded-2xl bg-white/95 dark:bg-slate-900/90 border border-[#DCE7F6] dark:border-slate-800/85 shadow-none overflow-hidden"
            >
              {/* Form Header */}
              <div className="px-5 sm:px-7 pt-4 sm:pt-[18px] pb-3 sm:pb-3.5 bg-gradient-to-b from-[#F8FBFF]/80 to-white/95 dark:from-slate-900 dark:to-slate-900 border-b border-[#EBF2FC] dark:border-slate-800/75 text-left">
                <h1 className="text-[20px] sm:text-[22px] font-extrabold tracking-[-0.018em] text-[#0B1F4B] dark:text-white leading-snug">
                  Connect With IDL
                </h1>
                <p className="mt-1 text-[12.5px] sm:text-[13.5px] font-medium text-[#526789] dark:text-slate-400 leading-relaxed">
                  Have a question, partnership idea, or business enquiry? Our team is here to help you connect with IDL Education.
                </p>
              </div>

                {/* Form Body */}
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="px-5 sm:px-7 pt-3.5 sm:pt-4 pb-4 sm:pb-5 space-y-3 sm:space-y-3.5 text-left"
                    autoComplete="off"
                  >
                    {/* Row 1: Full Name & Phone Number */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-5">
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
                                onChange={(e) => field.onChange(toTitleCase(e.target.value))}
                                className={`${inputBaseClass} capitalize placeholder:normal-case`}
                              />
                            </FormControl>
                            <FormMessage className="text-[11.5px] font-medium text-rose-500 pt-1" />
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
                              <div className="relative h-[40px] w-full flex items-center">
                                <span className="absolute left-0 top-1/2 -translate-y-1/2 pr-2.5 border-r border-slate-200/90 dark:border-slate-700 text-[13.5px] sm:text-[14px] font-semibold text-[#334E7B] dark:text-slate-300 leading-none select-none pointer-events-none">
                                  +91
                                </span>
                                <Input
                                  type="tel"
                                  maxLength={10}
                                  placeholder="Phone Number *"
                                  {...field}
                                  onChange={(e) =>
                                    field.onChange(e.target.value.replace(/\D/g, ""))
                                  }
                                  className={`${inputBaseClass} pl-[44px]`}
                                />
                              </div>
                            </FormControl>
                            <FormMessage className="text-[11.5px] font-medium text-rose-500 pt-1" />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Row 2: Email Address & Enquiry Type */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-5">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem className="space-y-0 text-left">
                            <FormLabel className="sr-only">Email Address</FormLabel>
                            <FormControl>
                              <Input
                                type="email"
                                placeholder="Email Address *"
                                {...field}
                                className={inputBaseClass}
                              />
                            </FormControl>
                            <FormMessage className="text-[11.5px] font-medium text-rose-500 pt-1" />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="enquiryType"
                        render={({ field }) => (
                          <FormItem className="space-y-0 text-left">
                            <FormLabel className="sr-only">Enquiry Type</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger className="h-[40px] w-full border-0 border-b border-slate-200 dark:border-slate-700/85 hover:border-slate-300 dark:hover:border-slate-600 !bg-transparent rounded-none px-0 text-[13.5px] sm:text-[14px] font-medium text-[#0B1F4B] dark:text-slate-100 data-[placeholder]:text-[#7A8CA8] dark:data-[placeholder]:text-slate-500 data-[placeholder]:font-normal focus:outline-none focus:ring-0 focus:ring-offset-0 focus:border-[#155EEF] focus:shadow-[0_1.5px_0_0_#155EEF] data-[state=open]:border-[#155EEF] data-[state=open]:shadow-[0_1.5px_0_0_#155EEF] shadow-none transition-[border-color,box-shadow] duration-150 [&>svg]:w-4 [&>svg]:h-4 [&>svg]:text-[#64748B] [&>svg]:opacity-85 [&>svg]:transition-transform [&>svg]:duration-200 data-[state=open]:[&>svg]:rotate-180 data-[state=open]:[&>svg]:text-[#155EEF]">
                                  <SelectValue placeholder="Enquiry Type *" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-1 shadow-[0_12px_32px_-8px_rgba(11,34,77,0.16),0_2px_6px_rgba(11,34,77,0.05)]">
                                {ENQUIRY_TYPES.map((type) => (
                                  <SelectItem
                                    key={type}
                                    value={type}
                                    className="rounded-lg cursor-pointer py-2 text-[13px] font-medium text-[#0B1F4B] dark:text-slate-100 focus:bg-[#EEF4FF] focus:text-[#155EEF] transition-colors"
                                  >
                                    {type}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage className="text-[11.5px] font-medium text-rose-500 pt-1" />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Row 3: Company / Organisation (Optional) */}
                    <FormField
                      control={form.control}
                      name="company"
                      render={({ field }) => (
                        <FormItem className="space-y-0 text-left">
                          <FormLabel className="sr-only">Company / Organisation (Optional)</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Company / Organisation (Optional)"
                              {...field}
                              value={field.value}
                              onChange={(e) => field.onChange(toTitleCase(e.target.value))}
                              className={inputBaseClass}
                            />
                          </FormControl>
                          <FormMessage className="text-[11.5px] font-medium text-rose-500 pt-1" />
                        </FormItem>
                      )}
                    />

                    {/* Row 4: Your Message */}
                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem className="space-y-0 text-left">
                          <FormLabel className="sr-only">Your Message</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Your Message *"
                              rows={2}
                              {...field}
                              value={field.value}
                              onChange={(e) => field.onChange(toSentenceCase(e.target.value))}
                              className="min-h-[62px] w-full border-0 border-b border-slate-200 dark:border-slate-700/85 hover:border-slate-300 dark:hover:border-slate-600 !bg-transparent rounded-none px-0 py-1.5 text-[13.5px] sm:text-[14px] font-medium text-[#0B1F4B] dark:text-slate-100 placeholder:text-[#7A8CA8] dark:placeholder:text-slate-500 placeholder:font-normal focus:outline-none focus:ring-0 focus:ring-offset-0 focus:border-[#155EEF] focus:shadow-[0_1.5px_0_0_#155EEF] focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-[#155EEF] focus-visible:shadow-[0_1.5px_0_0_#155EEF] shadow-none resize-none leading-relaxed transition-[border-color,box-shadow] duration-150"
                            />
                          </FormControl>
                          <FormMessage className="text-[11.5px] font-medium text-rose-500 pt-1" />
                        </FormItem>
                      )}
                    />

                    {/* CTA Button */}
                    <div className="pt-1.5">
                      <Button
                        type="submit"
                        disabled={form.formState.isSubmitting}
                        className="group w-full h-11 rounded-[7px] font-bold text-xs tracking-[0.09em] bg-[#155EEF] hover:bg-[#114FD1] active:bg-[#0D41B5] text-white border border-[#155EEF] shadow-none active:scale-[0.99] transition-[background-color,transform] duration-150 cursor-pointer touch-manipulation flex items-center justify-center gap-2 uppercase"
                      >
                        {form.formState.isSubmitting ? (
                          <span className="inline-flex items-center gap-2">
                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            SENDING...
                          </span>
                        ) : (
                          <>
                            <span>SEND BUSINESS ENQUIRY</span>
                            <ArrowRight className="w-4 h-4 text-white/95 group-hover:translate-x-1 transition-transform duration-200 shrink-0" />
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </Form>

                {/* Compact Contact Support Row & Privacy Reassurance */}
                <div className="px-5 sm:px-6 py-3.5 sm:py-4 bg-[#FAFBFD]/75 dark:bg-slate-900/60 border-t border-[#EBF2FC] dark:border-slate-800/75">
                  <div
                    data-contact-support-row
                    className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-[#EBF2FC] dark:divide-slate-800/80"
                  >
                    {SUPPORT_HIGHLIGHTS.map((item) => {
                      const Icon = item.icon;
                      return (
                        <div
                          key={item.id}
                          className={`flex sm:flex-col items-center sm:text-center gap-2.5 sm:gap-1.5 ${item.spacingClass}`}
                        >
                          <div className="w-8 h-8 rounded-lg bg-[#EFF5FF] dark:bg-blue-950/60 border border-[#DCE7F6] dark:border-blue-900/60 text-[#155EEF] dark:text-blue-400 flex items-center justify-center shrink-0">
                            <Icon className="w-3.5 h-3.5 stroke-[2.1]" aria-hidden="true" />
                          </div>
                          <div className="min-w-0 text-left sm:text-center">
                            <h2 className="text-[12px] !font-bold text-[#0B1F4B] dark:text-white leading-tight sm:whitespace-nowrap">
                              {item.title}
                            </h2>
                            {"href" in item ? (
                              <a
                                href={item.href}
                                className="mt-0.5 inline-block py-0.5 text-[11.5px] font-medium text-[#526789] dark:text-slate-400 hover:text-[#155EEF] dark:hover:text-blue-400 tabular-nums transition-colors duration-150 whitespace-nowrap"
                              >
                                {item.text}
                              </a>
                            ) : (
                              <p className="mt-0.5 text-[11.5px] font-medium text-[#526789] dark:text-slate-400 leading-snug">
                                {item.text}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Privacy Reassurance Line */}
                  <div
                    data-contact-privacy
                    className="mt-3 pt-2.5 border-t border-[#EBF2FC] dark:border-slate-800/75 flex items-start sm:items-center justify-center gap-1.5 text-left sm:text-center"
                  >
                    <Lock
                      className="w-3 h-3 text-[#7A8CA8] dark:text-slate-500 shrink-0 mt-[3px] sm:mt-0"
                      aria-hidden="true"
                    />
                    <p className="text-[11px] tracking-[-0.005em] font-medium text-[#64748B] dark:text-slate-400 leading-relaxed sm:whitespace-nowrap">
                      We respect your privacy. Your information will only be used to respond to your enquiry.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
        </div>
      </section>
    </div>
  );
}
