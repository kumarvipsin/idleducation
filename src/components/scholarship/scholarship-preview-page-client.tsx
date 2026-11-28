'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Script from 'next/script';
import { useRouter } from 'next/navigation';
import { Download, Edit, FileText, Lock } from 'lucide-react';
import { registerForScholarship } from '@/app/actions/forms';
import {
  formatFeeBadge,
  processRazorpayFeePayment,
  SCHOLARSHIP_APPLICATION_FEE_INR,
} from '@/lib/form-fees';
import {
  clearScholarshipPreviewDraft,
  downloadScholarshipA4Pdf,
  loadScholarshipPreviewDraft,
  SCHOLARSHIP_PREVIEW_DRAFT_KEY,
  SCHOLARSHIP_SUBMITTED_MESSAGE,
  ScholarshipA4Document,
  type ScholarshipPreviewDraft,
  type ScholarshipPreviewDraftValues,
} from '@/components/scholarship/scholarship-a4-preview';
import { ScholarshipSubmissionDialogs } from '@/components/scholarship/scholarship-dialogs';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

/** Dedicated new-tab A4 Scholarship Form Preview page rendered between website Header and Footer. */
export function ScholarshipPreviewPageClient() {
  const { toast } = useToast();
  const router = useRouter();

  const [draft, setDraft] = useState<ScholarshipPreviewDraft | null>(null);
  const [hasLoaded, setHasLoaded] = useState(false);

  const [previewViewportEl, setPreviewViewportEl] = useState<HTMLDivElement | null>(null);
  const [previewSheetEl, setPreviewSheetEl] = useState<HTMLDivElement | null>(null);
  const [previewScale, setPreviewScale] = useState(1);
  const [previewSheetHeight, setPreviewSheetHeight] = useState(1123);
  const [isSavingPdf, setIsSavingPdf] = useState(false);

  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedValues, setSubmittedValues] = useState<ScholarshipPreviewDraftValues | null>(null);

  const previewRef = useRef<HTMLDivElement | null>(null);

  const setPreviewViewportNode = useCallback((node: HTMLDivElement | null) => {
    setPreviewViewportEl(node);
  }, []);

  const setPreviewSheetNode = useCallback((node: HTMLDivElement | null) => {
    previewRef.current = node;
    setPreviewSheetEl(node);
  }, []);

  useEffect(() => {
    setDraft(loadScholarshipPreviewDraft());
    setHasLoaded(true);

    const handleStorage = (e: StorageEvent) => {
      if (e.key === SCHOLARSHIP_PREVIEW_DRAFT_KEY) {
        setDraft(loadScholarshipPreviewDraft());
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  useEffect(() => {
    if (!draft) {
      document.body.classList.remove('admission-preview-page');
      return;
    }

    document.body.classList.add('admission-preview-page');

    const updatePreviewLayout = () => {
      if (previewViewportEl) {
        const availW = Math.max(240, previewViewportEl.clientWidth);
        setPreviewScale(availW >= 794 ? 1 : Number((availW / 794).toFixed(4)));
      }
      if (previewSheetEl) {
        setPreviewSheetHeight(Math.max(1123, previewSheetEl.scrollHeight));
      }
    };

    updatePreviewLayout();
    const observer =
      typeof ResizeObserver !== 'undefined' ? new ResizeObserver(updatePreviewLayout) : null;
    if (observer && previewViewportEl) observer.observe(previewViewportEl);
    if (observer && previewSheetEl) observer.observe(previewSheetEl);
    window.addEventListener('resize', updatePreviewLayout);

    return () => {
      observer?.disconnect();
      window.removeEventListener('resize', updatePreviewLayout);
      document.body.classList.remove('admission-preview-page');
    };
  }, [draft, previewViewportEl, previewSheetEl]);

  const handleEdit = () => {
    if (typeof window !== 'undefined' && window.opener && !window.opener.closed) {
      try {
        window.opener.focus();
      } catch {
        // Ignore cross-window focus restriction
      }
      window.close();
      setTimeout(() => {
        if (!window.closed) {
          router.push('/scholarship?draft=1&step=3');
        }
      }, 120);
      return;
    }

    router.push('/scholarship?draft=1&step=3');
  };

  const handleDownloadPdf = async () => {
    if (!previewRef.current || isSavingPdf || !draft) return;
    setIsSavingPdf(true);
    try {
      const targetName = submittedValues?.studentName || draft.values.studentName;
      await downloadScholarshipA4Pdf(previewRef.current, targetName);
    } catch (error) {
      console.error('Scholarship PDF generation failed:', error);
      toast({
        variant: 'destructive',
        title: 'PDF Generation Failed',
        description: 'Please try again.',
      });
    } finally {
      setIsSavingPdf(false);
    }
  };

  const submitDraftScholarship = async (
    txnId: string,
    feeAmount: number,
    paymentStatus: 'free_waived' | 'paid'
  ) => {
    if (!draft) return;
    setIsSubmitting(true);
    try {
      const v = draft.values;
      const resolvedReason =
        v.scholarshipReason === 'Other'
          ? v.customScholarshipReason?.trim() || 'Other'
          : v.scholarshipReason;

      const combinedSubjects = v.targetStream?.trim()
        ? `${v.previousSubjects.trim()} (Target: ${v.targetStream.trim()})`
        : v.previousSubjects.trim();

      const result = await registerForScholarship({
        registrationId: v.registrationId,
        mode: 'Offline',
        studentName: v.studentName,
        fatherName: v.fatherName,
        guardianName: v.fatherName,
        fatherOccupation: v.fatherOccupation || '',
        motherName: v.motherName || '',
        motherOccupation: v.motherOccupation || '',
        dob: v.dob,
        gender: v.gender,
        fatherPhone: v.fatherPhone,
        motherPhone: v.motherPhone || '',
        studentPhone: v.studentPhone || '',
        mobile: v.fatherPhone,
        email: v.email || '',
        address: v.address,
        branch: v.branch,
        class: v.classCourse,
        programTitle: v.programTitle,
        subjects: combinedSubjects,
        previousSchool: v.previousSchool || '',
        previousSubjects: v.previousSubjects,
        previousMarks: v.previousMarks,
        scholarshipReason: resolvedReason,
        feeAmount,
        paymentStatus,
        transactionId: txnId,
        message: `Marks: ${v.previousMarks.trim()} • Studied: ${v.previousSubjects.trim()} • Purpose: ${resolvedReason}`,
        state: 'Delhi',
        country: 'India',
      });

      if (result.success) {
        setSubmittedValues({ ...v, feeAmount, transactionId: txnId });
        setIsSuccessOpen(true);
        clearScholarshipPreviewDraft();
        try {
          window.opener?.postMessage({ type: SCHOLARSHIP_SUBMITTED_MESSAGE }, window.location.origin);
        } catch {
          // Ignore opener communication errors
        }
      } else {
        toast({
          variant: 'destructive',
          title: 'Submission Failed',
          description: result.message || 'Please check your details and try again.',
        });
      }
    } catch {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'A network or server error occurred. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePayment = async () => {
    if (!draft) return;
    setIsSubmitting(true);
    await processRazorpayFeePayment({
      amountInr: SCHOLARSHIP_APPLICATION_FEE_INR,
      description: 'Scholarship Exam Registration Fee',
      prefill: {
        name: draft.values.studentName || '',
        email: draft.values.email || '',
        contact: draft.values.fatherPhone || draft.values.studentPhone || '',
      },
      onPaid: async ({ transactionId, feeAmount, paymentStatus }) => {
        setIsPaymentDialogOpen(false);
        await submitDraftScholarship(transactionId, feeAmount, paymentStatus);
      },
      onError: (title, description) => {
        toast({ variant: 'destructive', title, description });
      },
      onDismiss: () => {
        setIsSubmitting(false);
      },
    });
  };

  if (!hasLoaded) {
    return (
      <div className="min-h-[60vh] bg-[#F3F5F8] flex items-center justify-center px-4 py-12">
        <div className="text-center text-sm text-neutral-500">Loading scholarship form preview...</div>
      </div>
    );
  }

  if (!draft) {
    return (
      <div className="min-h-[60vh] bg-[#F3F5F8] flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full bg-white rounded-xl border border-neutral-200 p-6 sm:p-8 text-center shadow-sm">
          <div className="w-11 h-11 rounded-full bg-neutral-100 text-neutral-600 flex items-center justify-center mx-auto mb-3.5">
            <FileText className="w-5 h-5" />
          </div>
          <h1 className="text-base sm:text-lg font-semibold text-neutral-900">
            No Scholarship Preview Draft Found
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1.5 leading-relaxed">
            Please fill the scholarship registration form first and click Preview to inspect your print-ready A4 copy.
          </p>
          <Button asChild className="mt-5 h-9 px-4 rounded-lg bg-[#2864E8] hover:bg-[#1E4ED8] text-white text-xs font-semibold">
            <Link href="/scholarship">Go to Scholarship Form</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Script id="razorpay-checkout-scholarship-preview-js" src="https://checkout.razorpay.com/v1/checkout.js" />

      <div
        data-preview-page="true"
        className="w-full bg-[#F3F5F8] dark:bg-slate-950 py-6 sm:py-9 px-3 sm:px-6 border-b border-neutral-200/80 dark:border-slate-800"
      >
        <div ref={setPreviewViewportNode} data-preview-viewport="true" className="max-w-[794px] mx-auto">
          <div
            data-preview-scale-box="true"
            className="mx-auto bg-white shadow-[0_6px_24px_rgba(0,0,0,0.08)] ring-1 ring-neutral-300/75 overflow-hidden"
            style={{
              width: `${Math.round(794 * previewScale)}px`,
              height: `${Math.round(previewSheetHeight * previewScale)}px`,
            }}
          >
            <ScholarshipA4Document
              sheetRef={setPreviewSheetNode}
              values={draft.values}
              applicationDate={draft.applicationDate}
              previewScale={previewScale}
              previewSheetHeight={previewSheetHeight}
            />
          </div>

          {/* Bottom-Right Action Controls */}
          <div
            data-preview-toolbar="true"
            className="mt-4 sm:mt-5 flex flex-wrap items-center justify-end gap-1.5 sm:gap-2.5"
          >
            <Button
              type="button"
              variant="outline"
              onClick={handleEdit}
              className="h-8 sm:h-9 px-2.5 sm:px-3.5 rounded-lg text-[11.5px] sm:text-xs font-medium cursor-pointer border-neutral-300 text-neutral-800 bg-white hover:bg-neutral-50 shadow-none"
            >
              <Edit className="w-3.5 h-3.5 mr-1 sm:mr-1.5 text-neutral-700" /> Edit
            </Button>
            <Button
              type="button"
              disabled={isSavingPdf}
              onClick={handleDownloadPdf}
              className="h-8 sm:h-9 px-2.5 sm:px-4 rounded-lg text-[11.5px] sm:text-xs font-medium bg-neutral-900 text-white hover:bg-neutral-800 cursor-pointer shadow-none"
            >
              <Download className="w-3.5 h-3.5 mr-1 sm:mr-1.5" /> {isSavingPdf ? 'Downloading...' : 'Download'}
            </Button>
            {!submittedValues && (
              <Button
                type="button"
                onClick={() => setIsPaymentDialogOpen(true)}
                className="h-8 sm:h-9 px-3 sm:px-4 rounded-lg text-[11.5px] sm:text-xs font-semibold bg-[#2864E8] hover:bg-[#1E4ED8] text-white cursor-pointer shadow-xs"
              >
                <Lock className="w-3.5 h-3.5 mr-1 sm:mr-1.5" /> Pay Now ({formatFeeBadge(SCHOLARSHIP_APPLICATION_FEE_INR)})
              </Button>
            )}
          </div>
        </div>
      </div>

      <ScholarshipSubmissionDialogs
        isPaymentDialogOpen={isPaymentDialogOpen}
        setIsPaymentDialogOpen={setIsPaymentDialogOpen}
        isSuccessOpen={isSuccessOpen}
        setIsSuccessOpen={setIsSuccessOpen}
        isSubmitting={isSubmitting}
        isDownloadingPdf={isSavingPdf}
        activeStudent={draft.values}
        submittedStudent={submittedValues}
        feeAmount={SCHOLARSHIP_APPLICATION_FEE_INR}
        onPay={handlePayment}
        onDownloadPdf={handleDownloadPdf}
      />
    </>
  );
}
