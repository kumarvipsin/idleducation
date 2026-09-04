'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ContactForm } from "@/components/contact-form";

interface ContactModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ContactModal({ isOpen, onOpenChange }: ContactModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent 
        onOpenAutoFocus={(e) => e.preventDefault()} 
        onCloseAutoFocus={(e) => e.preventDefault()}
        className="w-[calc(100vw-1.5rem)] sm:w-[92vw] md:w-[88vw] max-w-[920px] max-h-[78vh] sm:max-h-[76vh] rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-950 p-0 overflow-hidden shadow-2xl shadow-slate-950/15 flex flex-col fixed left-[50%] top-[50%] -translate-x-1/2 -translate-y-1/2 duration-200"
      >
        <DialogHeader className="px-6 sm:px-8 pt-5 sm:pt-6 pb-1 sm:pb-1.5 text-left shrink-0">
          <DialogTitle className="text-left text-2xl sm:text-[28px] font-black text-slate-950 dark:text-white tracking-tight leading-tight">
            Let’s Talk
          </DialogTitle>
          <DialogDescription className="text-left text-[13.5px] sm:text-[14.5px] font-normal text-slate-500 dark:text-slate-400 mt-1 leading-snug">
            For admissions, partnerships, centres, and other enquiries, connect with our team.
          </DialogDescription>
        </DialogHeader>

        <ContactForm onSuccess={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
}
