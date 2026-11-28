'use client';

import React from 'react';
import { CheckCircle2, Download, Lock, ShieldCheck } from 'lucide-react';
import { formatFeeBadge, SCHOLARSHIP_APPLICATION_FEE_INR } from '@/lib/form-fees';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export interface ScholarshipDialogSummary {
  registrationId?: string;
  studentName?: string;
  branch?: string;
  classCourse?: string;
  programTitle?: string;
}

/** Shared Fee Confirmation and Post-Submission Download dialogs for Scholarship flows. */
export function ScholarshipSubmissionDialogs({
  isPaymentDialogOpen,
  setIsPaymentDialogOpen,
  isSuccessOpen,
  setIsSuccessOpen,
  isSubmitting,
  isDownloadingPdf,
  activeStudent,
  submittedStudent,
  feeAmount = SCHOLARSHIP_APPLICATION_FEE_INR,
  onPay,
  onDownloadPdf,
}: {
  isPaymentDialogOpen: boolean;
  setIsPaymentDialogOpen: (open: boolean) => void;
  isSuccessOpen: boolean;
  setIsSuccessOpen: (open: boolean) => void;
  isSubmitting: boolean;
  isDownloadingPdf?: boolean;
  activeStudent: ScholarshipDialogSummary;
  submittedStudent: ScholarshipDialogSummary | null;
  feeAmount?: number;
  onPay: () => void | Promise<void>;
  onDownloadPdf: () => void | Promise<void>;
}) {
  const isFreeWaiver = feeAmount <= 0;
  const confirmed = submittedStudent || activeStudent;

  return (
    <>
      {/* Payment / Fee Confirmation Dialog */}
      <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
        <DialogContent
          onOpenAutoFocus={(e) => e.preventDefault()}
          onCloseAutoFocus={(e) => e.preventDefault()}
          className="w-[95vw] sm:w-full sm:max-w-[440px] shadow-none rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-950 p-6 overflow-hidden top-[calc(4rem+0.75rem)] sm:top-[calc(4rem+1.25rem)] translate-y-0 z-[150]"
        >
          <DialogHeader className="text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-[#2864E8]/10 text-[#2864E8] mx-auto flex items-center justify-center">
              <Lock className="w-6 h-6" />
            </div>
            <DialogTitle className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
              Scholarship Exam Fee
            </DialogTitle>
            <DialogDescription className="text-xs font-semibold text-slate-600 dark:text-slate-300">
              {isFreeWaiver
                ? 'Scholarship exam registration fee is currently ₹0 (100% fee waiver). Confirm below to submit your application.'
                : `A nominal exam registration fee of ${formatFeeBadge(feeAmount)} is required to complete your scholarship registration.`}
            </DialogDescription>
          </DialogHeader>

          <div className="my-4 p-4 rounded-[5px] bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-2.5 text-xs text-left">
            <div className="flex justify-between gap-3">
              <span className="text-slate-500 shrink-0">Student Name</span>
              <span className="font-bold text-slate-900 dark:text-white text-right">{activeStudent.studentName || '—'}</span>
            </div>
            <div className="flex justify-between gap-3">
              <span className="text-slate-500 shrink-0">Program Applied</span>
              <span className="font-bold text-slate-900 dark:text-white text-right">
                {activeStudent.classCourse || '—'}
                {activeStudent.programTitle ? ` — ${activeStudent.programTitle}` : ''}
              </span>
            </div>
            <div className="flex justify-between items-center border-t border-slate-200 dark:border-slate-700 pt-2 font-bold text-sm">
              <span className="text-slate-900 dark:text-white">Total Payable</span>
              <div className="flex items-center gap-2">
                {isFreeWaiver && (
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Fee Waived
                  </span>
                )}
                <span className="text-[#2864E8] font-black">₹{feeAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsPaymentDialogOpen(false)}
              className="w-full sm:w-auto text-xs font-bold rounded-[8px] border-slate-300 dark:border-slate-700 cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={onPay}
              disabled={isSubmitting}
              className="w-full sm:w-auto text-xs font-extrabold bg-[#2864E8] hover:bg-[#1E4ED8] text-white rounded-[8px] tracking-wide shadow-sm cursor-pointer"
            >
              {isSubmitting
                ? isFreeWaiver
                  ? 'Submitting...'
                  : 'Connecting...'
                : isFreeWaiver
                  ? 'Confirm & Submit (₹0)'
                  : `Pay ${formatFeeBadge(feeAmount)} via Razorpay`}
            </Button>
          </DialogFooter>

          <div className="text-center pt-2">
            <p className="text-[11px] font-bold text-slate-600 dark:text-slate-400 flex items-center justify-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
              {isFreeWaiver ? 'Razorpay Ready • Free Waiver Applied' : '256-Bit Encrypted Secure Payment'}
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Post-Submission Success + PDF Download Dialog */}
      <Dialog open={isSuccessOpen} onOpenChange={setIsSuccessOpen}>
        <DialogContent className="rounded-2xl max-w-sm border border-border p-6 bg-white dark:bg-slate-950 text-center z-[150]">
          <DialogHeader className="space-y-2">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <DialogTitle className="text-lg font-bold text-slate-900 dark:text-white text-center">
              Registration Confirmed!
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground leading-relaxed text-center">
              You have successfully registered for the IDL Scholarship Test. Download your application slip below.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 p-3 rounded-xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200/70 dark:border-blue-800/50 text-left">
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#2864E8] mb-1">
              Registration ID
            </p>
            <p className="text-base font-extrabold text-slate-900 dark:text-white font-mono">
              {confirmed.registrationId || 'SCH-2026'}
            </p>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium mt-0.5">
              {confirmed.studentName}
              {confirmed.branch ? ` • ${confirmed.branch.split(',')[0]}` : ''}
            </p>
          </div>

          <DialogFooter className="mt-4 flex flex-col gap-2 sm:flex-col">
            <Button
              type="button"
              disabled={isDownloadingPdf}
              onClick={onDownloadPdf}
              className="w-full h-10 rounded-[8px] font-bold text-xs bg-[#2864E8] hover:bg-[#1E4ED8] text-white cursor-pointer flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              {isDownloadingPdf ? 'Preparing PDF...' : 'Download Scholarship Form PDF'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsSuccessOpen(false)}
              className="w-full h-9 rounded-[8px] font-semibold text-xs cursor-pointer border-slate-200 dark:border-slate-700"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
