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
        maxWidthClass="max-w-[500px] sm:max-w-[530px]"
        className="w-[92vw] sm:w-[94vw]"
      >
        <DialogHeader className="px-6 sm:px-8 pt-6 sm:pt-7 pb-1 text-left shrink-0 pr-14">
          <DialogTitle className="text-left text-[24px] sm:text-[27px] font-bold text-[#0B1F4B] dark:text-white tracking-tight leading-tight">
            Contact Us
          </DialogTitle>
          <DialogDescription className="text-left text-[13.5px] sm:text-[14.5px] font-medium text-slate-600 dark:text-slate-300 mt-1 leading-normal">
            We’re here to help. Get in touch with our team.
          </DialogDescription>
        </DialogHeader>

        <ContactForm onSuccess={() => onOpenChange(false)} />
      </FormModalDialogContent>
    </Dialog>
  );
}
