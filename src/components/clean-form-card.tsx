'use client';

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

/** Shared Delhi offline center options across standalone registration forms. */
export const DELHI_BRANCHES = [
  "Mukherjee Nagar, Delhi-110009",
  "Mangol Puri, Delhi-110083",
  "Krishan Vihar, Delhi-110086",
  "Budh Vihar, Delhi-110086",
] as const;

export const FORM_STATES = ["Delhi", "Other"] as const;

export const STUDENT_CLASS_OPTIONS = [
  "Class 4",
  "Class 5",
  "Class 6",
  "Class 7",
  "Class 8",
  "Class 9",
  "Class 10",
  "Class 11",
  "Class 12",
  "Class 12 PASS",
  "JEE",
  "NEET",
  "CUET",
] as const;

export const CLEAN_INPUT_CLASS =
  "h-[42px] w-full border-0 border-b border-slate-200 dark:border-slate-700/85 hover:border-slate-300 dark:hover:border-slate-600 !bg-transparent rounded-none px-0 text-[13.5px] sm:text-[14px] font-medium text-[#0B1F4B] dark:text-slate-100 placeholder:text-[#7A8CA8] dark:placeholder:text-slate-500 placeholder:font-normal placeholder:normal-case focus:outline-none focus:ring-0 focus:ring-offset-0 focus:border-[#155EEF] focus:shadow-[0_1.5px_0_0_#155EEF] focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-[#155EEF] focus-visible:shadow-[0_1.5px_0_0_#155EEF] shadow-none leading-none transition-[border-color,box-shadow] duration-150";

export const CLEAN_SELECT_TRIGGER_CLASS =
  "h-[42px] w-full border-0 border-b border-slate-200 dark:border-slate-700/85 hover:border-slate-300 dark:hover:border-slate-600 !bg-transparent rounded-none px-0 text-[13.5px] sm:text-[14px] font-medium text-[#0B1F4B] dark:text-slate-100 data-[placeholder]:text-[#7A8CA8] dark:data-[placeholder]:text-slate-500 data-[placeholder]:font-normal focus:outline-none focus:ring-0 focus:ring-offset-0 focus:border-[#155EEF] focus:shadow-[0_1.5px_0_0_#155EEF] data-[state=open]:border-[#155EEF] data-[state=open]:shadow-[0_1.5px_0_0_#155EEF] shadow-none flex items-center justify-between transition-[border-color,box-shadow] duration-150 [&>span]:truncate [&>svg]:w-4 [&>svg]:h-4 [&>svg]:text-[#64748B] [&>svg]:opacity-85 [&>svg]:shrink-0 [&>svg]:transition-transform [&>svg]:duration-200 data-[state=open]:[&>svg]:rotate-180 data-[state=open]:[&>svg]:text-[#155EEF] cursor-pointer";

export const CLEAN_SELECT_CONTENT_CLASS =
  "rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-1 shadow-[0_12px_32px_-8px_rgba(11,34,77,0.16),0_2px_6px_rgba(11,34,77,0.05)] max-h-[240px]";

export const CLEAN_SELECT_ITEM_CLASS =
  "rounded-lg cursor-pointer py-2 text-[13px] font-medium text-[#0B1F4B] dark:text-slate-100 focus:bg-[#EEF4FF] focus:text-[#155EEF] transition-colors";

export const CLEAN_TEXTAREA_CLASS =
  "min-h-[80px] w-full border-0 border-b border-slate-200 dark:border-slate-700/85 hover:border-slate-300 dark:hover:border-slate-600 !bg-transparent rounded-none px-0 py-2 text-[13.5px] sm:text-[14px] font-medium text-[#0B1F4B] dark:text-slate-100 placeholder:text-[#7A8CA8] dark:placeholder:text-slate-500 placeholder:font-normal focus:outline-none focus:ring-0 focus:ring-offset-0 focus:border-[#155EEF] focus:shadow-[0_1.5px_0_0_#155EEF] focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-[#155EEF] focus-visible:shadow-[0_1.5px_0_0_#155EEF] shadow-none resize-none leading-relaxed transition-[border-color,box-shadow] duration-150";

export const CLEAN_CTA_BUTTON_CLASS =
  "group w-full h-11 rounded-[7px] font-bold text-xs tracking-[0.09em] bg-[#155EEF] hover:bg-[#114FD1] active:bg-[#0D41B5] text-white border border-[#155EEF] shadow-none active:scale-[0.99] transition-[background-color,transform] duration-150 cursor-pointer touch-manipulation flex items-center justify-center gap-2 uppercase";

export const CLEAN_ERROR_CLASS = "text-[11.5px] font-medium text-rose-500 pt-1.5";

export const toTitleCase = (str: string) =>
  str.replace(/\b([a-z])/g, (char) => char.toUpperCase());

export const toSentenceCase = (str: string) =>
  str.replace(/(^\s*|[.!?]\s+)([a-z])/g, (_, p1, p2) => p1 + p2.toUpperCase());

/** Matches the card shell, padding, dot-grid backdrop, and position of /contact & /pay-fee. */
export function CleanFormCard({
  title,
  subtitle,
  badge,
  maxWidthClass = "max-w-[520px] sm:max-w-[540px]",
  bodyClassName,
  dataAttr,
  children,
}: {
  title: string;
  subtitle: string;
  badge?: string;
  maxWidthClass?: string;
  bodyClassName?: string;
  dataAttr?: string;
  children: ReactNode;
}) {
  return (
    <div className="bg-white dark:bg-background antialiased">
      <section className="relative overflow-hidden py-8 sm:py-10 lg:py-12 min-h-[calc(100vh-360px)] bg-gradient-to-b from-[#FFFFFF] via-[#F9FBFE] via-65% to-[#FFFFFF] dark:from-[#070C18] dark:to-background flex items-start justify-center">
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
            className={cn("w-full mx-auto relative", maxWidthClass)}
          >
            <div
              {...(dataAttr ? { [dataAttr]: true } : {})}
              className="relative rounded-2xl bg-white/95 dark:bg-slate-900/90 border border-[#DCE7F6] dark:border-slate-800/85 shadow-none overflow-hidden"
            >
              {/* Card Header */}
              <div className="px-5 sm:px-7 pt-4 sm:pt-5 pb-3.5 bg-gradient-to-b from-[#F8FBFF]/80 to-white/95 dark:from-slate-900 dark:to-slate-900 border-b border-[#EBF2FC] dark:border-slate-800/75 text-left">
                <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
                  <h1 className="text-[20px] sm:text-[22px] font-extrabold tracking-[-0.018em] text-[#0B1F4B] dark:text-white leading-snug">
                    {title}
                  </h1>
                  {badge && (
                    <span className="text-[10.5px] font-bold tracking-[0.06em] uppercase text-[#526789] dark:text-slate-400">
                      {badge}
                    </span>
                  )}
                </div>
                <p className="mt-1 text-[12.5px] sm:text-[13.5px] font-medium text-[#526789] dark:text-slate-400 leading-relaxed">
                  {subtitle}
                </p>
              </div>

              {/* Card Body */}
              <div className={cn("px-5 sm:px-7 pt-4 sm:pt-5 pb-5 sm:pb-6 text-left", bodyClassName)}>
                {children}
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

/** Clean +91 prefixed mobile input matching /contact & /pay-fee underline style. */
export function CleanMobileInput({
  value,
  onDigitsChange,
  placeholder = "Mobile Number *",
}: {
  value: string;
  onDigitsChange: (digits: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="relative h-[42px] w-full flex items-center">
      <span className="absolute left-0 top-1/2 -translate-y-1/2 pr-2.5 border-r border-slate-200/90 dark:border-slate-700 text-[13.5px] sm:text-[14px] font-semibold text-[#334E7B] dark:text-slate-300 leading-none select-none pointer-events-none">
        +91
      </span>
      <Input
        type="tel"
        maxLength={10}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onDigitsChange(e.target.value.replace(/\D/g, ""))}
        className={`${CLEAN_INPUT_CLASS} pl-[44px]`}
      />
    </div>
  );
}

/** Offline / Online / Hybrid radio strip matching standalone registration forms. */
export function CleanModeSelector({
  value,
  onChange,
}: {
  value: string;
  onChange: (val: string) => void;
}) {
  const options = [
    { value: "Offline", label: "Offline", disabled: false },
    { value: "Online", label: "Online", disabled: true },
    { value: "Hybrid", label: "Hybrid", disabled: true },
  ];

  return (
    <div
      data-mode-selector
      className="flex flex-wrap items-center gap-x-3 sm:gap-x-6 gap-y-1.5 pb-3 border-b border-[#EBF2FC] dark:border-slate-800/75"
    >
      <span className="text-[12px] min-[375px]:text-[12.5px] sm:text-[13px] font-semibold text-[#526789] dark:text-slate-400 shrink-0 leading-none">
        Your Mode:
      </span>
      <div className="flex items-center gap-3 min-[375px]:gap-3.5 sm:gap-5 shrink-0">
        {options.map((item) => {
          const isSelected = value === item.value;
          return (
            <button
              key={item.value}
              type="button"
              disabled={item.disabled}
              onClick={() => {
                if (!item.disabled) onChange(item.value);
              }}
              className={cn(
                "inline-flex items-center gap-1.5 sm:gap-2 select-none bg-transparent border-0 py-1 px-0.5 focus:outline-none transition-opacity",
                item.disabled ? "opacity-35 cursor-not-allowed" : "cursor-pointer group"
              )}
            >
              <div
                className={cn(
                  "w-[15px] h-[15px] sm:w-[17px] sm:h-[17px] rounded-full flex items-center justify-center transition-all duration-150 shrink-0",
                  isSelected
                    ? "border-[2px] border-[#155EEF] bg-white dark:bg-slate-900"
                    : "border-[1.5px] border-slate-300 dark:border-slate-700 bg-transparent"
                )}
              >
                {isSelected && <div className="w-[6px] h-[6px] sm:w-[7px] sm:h-[7px] rounded-full bg-[#155EEF]" />}
              </div>
              <span
                className={cn(
                  "text-[12px] min-[375px]:text-[13px] sm:text-[13.5px] leading-none transition-colors",
                  isSelected
                    ? "font-semibold text-[#0B1F4B] dark:text-white"
                    : item.disabled
                      ? "font-normal text-slate-400 dark:text-slate-500"
                      : "font-medium text-[#526789] dark:text-slate-400 group-hover:text-[#0B1F4B]"
                )}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/** Shared flat confirmation modal after successful form submission. */
export function CleanSuccessDialog({
  open,
  onOpenChange,
  title,
  description,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[390px] rounded-2xl border border-[#DCE7F6] dark:border-slate-800 bg-white dark:bg-slate-900 p-6 text-center shadow-none">
        <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-3">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <DialogTitle className="text-[19px] font-extrabold tracking-tight text-[#0B1F4B] dark:text-white text-center">
          {title}
        </DialogTitle>
        <DialogDescription className="text-[13px] font-medium text-[#526789] dark:text-slate-400 mt-1.5 leading-relaxed text-center">
          {description}
        </DialogDescription>
        <DialogFooter className="mt-5">
          <Button
            type="button"
            onClick={() => onOpenChange(false)}
            className="w-full h-10 rounded-[7px] bg-[#155EEF] hover:bg-[#114FD1] text-white font-bold text-xs tracking-[0.08em] uppercase shadow-none cursor-pointer"
          >
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
