'use client';

import {
  Dialog,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FormModalDialogContent } from "@/components/ui/form-modal-dialog";
import { ContactForm } from "@/components/contact-form";

interface ContactModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ContactModal({ isOpen, onOpenChange }: ContactModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <FormModalDialogContent 
        onOpenAutoFocus={(e) => e.preventDefault()} 
        onCloseAutoFocus={(e) => e.preventDefault()}
        maxWidthClass="max-w-[480px] sm:max-w-[560px] md:max-w-[580px]"
        className="w-[94vw] sm:w-[92vw] p-0 shadow-[0_24px_60px_-12px_rgba(15,23,42,0.18),0_2px_8px_rgba(15,23,42,0.06)] rounded-[20px] sm:rounded-[24px] border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-950 !outline-none focus:!outline-none focus:!ring-0 focus-visible:!outline-none focus-visible:!ring-0 ring-0"
      >
        {/* Top Heading: Left-aligned, All Capital Letters, Small Font */}
        <div className="flex items-center justify-between px-4 sm:px-7 py-3 sm:py-3.5 border-b border-slate-100 dark:border-slate-800/80 pr-12 sm:pr-14 bg-white dark:bg-slate-950 shrink-0">
          <div className="flex items-center select-none text-left">
            <span className="text-[11px] sm:text-[12px] font-bold tracking-[0.08em] uppercase text-slate-700 dark:text-slate-200">
              CONTACT US
            </span>
          </div>
        </div>

        <DialogHeader className="sr-only">
          <DialogTitle>Contact Us</DialogTitle>
          <DialogDescription>Get in touch with IDL Education team</DialogDescription>
        </DialogHeader>

        <ContactForm onSuccess={() => onOpenChange(false)} />
      </FormModalDialogContent>
    </Dialog>
  );
}
