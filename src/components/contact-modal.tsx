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
        maxWidthClass="max-w-[490px] sm:max-w-[510px]"
        className="w-[90vw] sm:w-[92vw]"
      >
        <DialogHeader className="px-5 sm:px-6 pt-5 pb-3 text-left shrink-0 border-b border-[#E8EFF8] dark:border-slate-800/80">
          <DialogTitle className="text-left text-[18px] sm:text-[19px] font-bold text-[#0B1F4B] dark:text-white tracking-tight leading-snug">
            Contact Us
          </DialogTitle>
          <DialogDescription className="text-left text-[12px] sm:text-[12.5px] font-normal text-slate-500 dark:text-slate-400 mt-0.5 leading-normal">
            Have questions? Connect with our team and we’ll get back shortly.
          </DialogDescription>
        </DialogHeader>

        <ContactForm onSuccess={() => onOpenChange(false)} />
      </FormModalDialogContent>
    </Dialog>
  );
}
