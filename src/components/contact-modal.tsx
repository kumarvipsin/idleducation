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
      >
        <DialogHeader className="px-5 sm:px-7 pt-5 pb-3 text-left shrink-0 border-b border-slate-100 dark:border-slate-800/80">
          <DialogTitle className="text-left text-xl sm:text-2xl font-bold text-[#102A68] dark:text-white tracking-tight leading-snug">
            Contact Us
          </DialogTitle>
          <DialogDescription className="text-left text-[13px] sm:text-[14px] font-normal text-slate-500 dark:text-slate-400 mt-0.5 leading-normal">
            Have questions about admissions, courses, or offline centres? Connect with our team and we’ll get back to you shortly.
          </DialogDescription>
        </DialogHeader>

        <ContactForm onSuccess={() => onOpenChange(false)} />
      </FormModalDialogContent>
    </Dialog>
  );
}
