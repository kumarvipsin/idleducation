'use client';

import Link from "next/link";
import { motion } from "framer-motion";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Phone,
  ArrowRight,
  BookOpen,
} from "lucide-react";
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
    "h-[42px] w-full border-0 border-b border-slate-200 dark:border-slate-700/85 hover:border-slate-300 dark:hover:border-slate-600 !bg-transparent rounded-none px-0 text-[13.5px] sm:text-[14px] font-medium text-[#0B1F4B] dark:text-slate-100 placeholder:text-[#7A8CA8] dark:placeholder:text-slate-500 placeholder:font-normal focus:outline-none focus:ring-0 focus:ring-offset-0 focus:border-[#155EEF] focus:shadow-[0_1.5px_0_0_#155EEF] focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-[#155EEF] focus-visible:shadow-[0_1.5px_0_0_#155EEF] shadow-none leading-none transition-[border-color,box-shadow] duration-150";

  return (
    <div className="bg-white dark:bg-background antialiased">
      {/* 1. CONTACT & BUSINESS ENQUIRIES HERO + FORM — MATCHING ABOUT US 1ST SECTION VISUAL */}
      <section className="relative overflow-hidden pt-6 pb-9 sm:pt-8 sm:pb-11 lg:pt-14 lg:pb-14 bg-gradient-to-b from-[#FFFFFF] via-[#F9FBFE] via-65% to-[#F1F6FD] dark:from-[#070C18] dark:to-[#0B132B]">
        {/* Subtle Pale-Blue Ambient Wash */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 42% 50% at 68% 52%, rgba(219, 234, 254, 0.30) 0%, rgba(239, 246, 255, 0.12) 46%, transparent 70%)",
          }}
        />

        {/* Restrained Low-Opacity Dot Grid Texture */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(#0B1F4B0a_1.2px,transparent_1.2px)] dark:bg-[radial-gradient(#ffffff09_1.2px,transparent_1.2px)] [background-size:24px_24px] pointer-events-none [mask-image:radial-gradient(ellipse_78%_68%_at_64%_46%,#000_34%,transparent_92%)] opacity-50"
        />

        <div className="w-full md:container mx-auto px-4 md:px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_470px] xl:grid-cols-[minmax(0,1fr)_520px] gap-6 sm:gap-8 lg:gap-10 xl:gap-12 items-start">
            {/* LEFT SECTION: Exact Starting Position & Editorial 4-Part Visual Parity with About Us */}
            <div className="flex flex-col justify-center text-left lg:pt-[22px] xl:pt-[33px]">
              {/* Eyebrow */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, ease: "easeOut" }}
                className="inline-flex items-center gap-2 mb-2.5 sm:mb-3"
              >
                <span className="w-3.5 h-[2px] rounded-full bg-[#FF6B00] shrink-0" />
                <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-[#0B1F4B]/85 dark:text-slate-200">
                  Contact For Business Enquiries
                </span>
              </motion.div>

              {/* Main 2-Line Headline — Matching About Us Size, Leading & Two-Tone Style */}
              <motion.h1
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.08, ease: "easeOut" }}
                className="text-[28px] min-[360px]:text-[30px] min-[390px]:text-[32px] sm:text-[42px] md:text-[46px] lg:text-[46px] xl:text-[54px] font-black tracking-[-0.025em] leading-[1.06] text-[#0B1F4B] dark:text-white"
              >
                <span className="block sm:whitespace-nowrap">Let’s Build Something</span>
                <span className="block text-[#0B1F4B] dark:text-white">
                  Great <span className="text-[#1F4FA3] dark:text-blue-400">Together.</span>
                </span>
              </motion.h1>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.16, ease: "easeOut" }}
                className="mt-3 sm:mt-4 lg:mt-[18px] text-[15px] sm:text-[16px] lg:text-[16.5px] text-[#475E82] dark:text-slate-300 font-medium leading-[1.65] max-w-[535px] [text-wrap:balance]"
              >
                Interested in partnering with IDL Education, exploring franchise opportunities, investment, or a business meeting? Let’s connect.
              </motion.p>

              {/* 3-Point Business Focus Strip */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.22, ease: "easeOut" }}
                className="mt-4 sm:mt-5 lg:mt-6 flex flex-wrap items-center gap-y-2 gap-x-1.5 sm:gap-x-2.5 text-[9px] min-[390px]:text-[9.5px] sm:text-[11px] font-bold tracking-[0.03em] min-[390px]:tracking-[0.045em] sm:tracking-[0.11em] uppercase leading-none text-[#162D54] dark:text-slate-200"
              >
                <span className="whitespace-nowrap">Franchise Opportunities</span>
                <span className="inline-flex items-center gap-x-1.5 sm:gap-x-2.5 whitespace-nowrap">
                  <span className="w-1 h-1 sm:w-[5px] sm:h-[5px] rounded-full bg-[#FF6B00] shrink-0" aria-hidden="true" />
                  <span>Partnerships</span>
                </span>
                <span className="inline-flex items-center gap-x-1.5 sm:gap-x-2.5 whitespace-nowrap">
                  <span className="w-1 h-1 sm:w-[5px] sm:h-[5px] rounded-full bg-[#1F4FA3] dark:bg-blue-400 shrink-0" aria-hidden="true" />
                  <span>Business Enquiries</span>
                </span>
              </motion.div>
            </div>

            {/* RIGHT FORM: Connect With IDL Education */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.14, ease: "easeOut" }}
              className="w-full"
            >
              <div className="rounded-2xl bg-white dark:bg-slate-900/95 border border-slate-200/80 dark:border-slate-800 ring-1 ring-[#0B1F4B]/[0.03] shadow-[0_1px_2px_rgba(11,34,77,0.04),0_8px_20px_-8px_rgba(11,34,77,0.07),0_24px_48px_-20px_rgba(11,34,77,0.13)] overflow-hidden">
                {/* Form Header */}
                <div className="px-5 sm:px-7 pt-5 sm:pt-6 pb-4 bg-gradient-to-b from-[#FAFBFD]/80 to-white dark:from-slate-900 dark:to-slate-900 border-b border-slate-100/95 dark:border-slate-800/80 text-left">
                  <h2 className="text-[19px] sm:text-[21px] font-extrabold tracking-[-0.018em] text-[#0B1F4B] dark:text-white leading-snug">
                    Connect With IDL Education
                  </h2>
                  <p className="mt-1 text-[12.5px] sm:text-[13.5px] font-medium text-[#526789] dark:text-slate-400 leading-relaxed">
                    Share your business enquiry with our team.
                  </p>
                </div>

                {/* Form Body */}
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="px-5 sm:px-7 pt-4 sm:pt-5 pb-5 sm:pb-6 space-y-4 sm:space-y-[18px] text-left"
                    autoComplete="off"
                  >
                    {/* Row 1: Full Name & Phone Number */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
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
                                className={`${inputBaseClass} capitalize`}
                              />
                            </FormControl>
                            <FormMessage className="text-[11.5px] font-medium text-rose-500 pt-1.5" />
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
                              <div className="relative h-[42px] w-full flex items-center">
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
                            <FormMessage className="text-[11.5px] font-medium text-rose-500 pt-1.5" />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Row 2: Email Address & Enquiry Type */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
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
                            <FormMessage className="text-[11.5px] font-medium text-rose-500 pt-1.5" />
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
                                <SelectTrigger className="h-[42px] w-full border-0 border-b border-slate-200 dark:border-slate-700/85 hover:border-slate-300 dark:hover:border-slate-600 !bg-transparent rounded-none px-0 text-[13.5px] sm:text-[14px] font-medium text-[#0B1F4B] dark:text-slate-100 data-[placeholder]:text-[#7A8CA8] dark:data-[placeholder]:text-slate-500 data-[placeholder]:font-normal focus:outline-none focus:ring-0 focus:ring-offset-0 focus:border-[#155EEF] focus:shadow-[0_1.5px_0_0_#155EEF] data-[state=open]:border-[#155EEF] data-[state=open]:shadow-[0_1.5px_0_0_#155EEF] shadow-none transition-[border-color,box-shadow] duration-150 [&>svg]:w-4 [&>svg]:h-4 [&>svg]:text-[#64748B] [&>svg]:opacity-85 [&>svg]:transition-transform [&>svg]:duration-200 data-[state=open]:[&>svg]:rotate-180 data-[state=open]:[&>svg]:text-[#155EEF]">
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
                            <FormMessage className="text-[11.5px] font-medium text-rose-500 pt-1.5" />
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
                          <FormMessage className="text-[11.5px] font-medium text-rose-500 pt-1.5" />
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
                              rows={3}
                              {...field}
                              value={field.value}
                              onChange={(e) => field.onChange(toSentenceCase(e.target.value))}
                              className="min-h-[80px] w-full border-0 border-b border-slate-200 dark:border-slate-700/85 hover:border-slate-300 dark:hover:border-slate-600 !bg-transparent rounded-none px-0 py-2 text-[13.5px] sm:text-[14px] font-medium text-[#0B1F4B] dark:text-slate-100 placeholder:text-[#7A8CA8] dark:placeholder:text-slate-500 placeholder:font-normal focus:outline-none focus:ring-0 focus:ring-offset-0 focus:border-[#155EEF] focus:shadow-[0_1.5px_0_0_#155EEF] focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-[#155EEF] focus-visible:shadow-[0_1.5px_0_0_#155EEF] shadow-none resize-none leading-relaxed transition-[border-color,box-shadow] duration-150"
                            />
                          </FormControl>
                          <FormMessage className="text-[11.5px] font-medium text-rose-500 pt-1.5" />
                        </FormItem>
                      )}
                    />

                    {/* CTA Button */}
                    <div className="pt-1">
                      <Button
                        type="submit"
                        disabled={form.formState.isSubmitting}
                        className="group w-full h-[46px] sm:h-[47px] rounded-[9px] font-bold text-[12.5px] sm:text-[13px] tracking-[0.09em] bg-[#155EEF] hover:bg-[#114FD1] active:bg-[#0D41B5] text-white border border-[#155EEF] shadow-[0_1px_2px_rgba(11,34,77,0.08),0_6px_16px_-4px_rgba(21,94,239,0.38)] hover:shadow-[0_2px_4px_rgba(11,34,77,0.08),0_10px_22px_-4px_rgba(21,94,239,0.46)] lg:hover:-translate-y-[1px] active:translate-y-0 active:scale-[0.99] transition-[background-color,box-shadow,transform] duration-200 cursor-pointer touch-manipulation flex items-center justify-center gap-2.5 uppercase"
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
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. CLOSING DIRECT DISCUSSION STRIP */}
      <section className="py-12 sm:py-14 md:py-16 bg-gradient-to-b from-[#FFFFFF] to-[#FAFCFF] dark:from-slate-900/35 dark:to-slate-900/60 border-t border-slate-200/70 border-b border-slate-200/60 dark:border-slate-800/60">
        <div className="container mx-auto px-4 md:px-6 text-center max-w-2xl">
          <h2 className="text-[22px] sm:text-[28px] md:text-[32px] font-extrabold text-[#0B1F4B] dark:text-white tracking-[-0.015em] leading-[1.2]">
            Prefer a Direct Business Discussion?
          </h2>
          <p className="mt-2.5 sm:mt-3 text-[14px] sm:text-[15.5px] text-[#475E82] dark:text-slate-400 font-medium leading-[1.6] mx-auto [text-wrap:balance]">
            Call us directly to schedule a meeting or discuss business partnerships.
          </p>
          <div className="mt-6 sm:mt-7 grid grid-cols-2 sm:inline-flex items-center justify-center gap-2.5 sm:gap-3.5 max-w-[330px] sm:max-w-none mx-auto">
            <a
              href="tel:8860040010"
              className="h-11 sm:h-[46px] sm:min-w-[160px] px-4 sm:px-6 rounded-xl bg-[#0A1E4A] hover:bg-[#122D68] text-white inline-flex items-center justify-center gap-2 text-[13.5px] sm:text-sm font-bold shadow-[0_2px_8px_rgba(11,34,77,0.16)] hover:shadow-[0_6px_16px_rgba(11,34,77,0.22)] lg:hover:-translate-y-[1px] active:translate-y-0 transition-[background-color,box-shadow,transform] duration-200 cursor-pointer"
            >
              <Phone className="w-4 h-4 text-white/90 shrink-0" />
              <span>Call Now</span>
            </a>

            <Link
              href="/about"
              className="h-11 sm:h-[46px] sm:min-w-[160px] px-4 sm:px-6 rounded-xl bg-white hover:bg-[#F5F8FD] dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200/90 hover:border-[#1F4FA3]/30 dark:border-slate-700 text-[#0B1F4B] dark:text-white inline-flex items-center justify-center gap-2 text-[13.5px] sm:text-sm font-bold shadow-[0_1px_2px_rgba(11,34,77,0.05)] hover:shadow-[0_4px_12px_rgba(11,34,77,0.08)] lg:hover:-translate-y-[1px] active:translate-y-0 transition-[background-color,border-color,box-shadow,transform] duration-200 cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-[#1F4FA3] dark:text-blue-400 shrink-0" />
              <span>About Us</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
