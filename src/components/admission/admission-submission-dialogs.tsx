'use client';

import React, { useRef, useState } from 'react';
import Link from 'next/link';
import jsPDF from 'jspdf';
import {
  CheckCircle2,
  CreditCard,
  Download,
  ExternalLink,
  Lock,
  ShieldCheck,
  User,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { ADMISSION_APPLICATION_FEE_INR, formatFeeBadge } from '@/lib/form-fees';
import { formatDateForDisplay } from '@/components/admission/admission-a4-preview';

const CODE39_PATTERNS: Record<string, string> = {
  '0': '000110100', '1': '100100001', '2': '001100001', '3': '101100000',
  '4': '000110001', '5': '100110000', '6': '001110000', '7': '000100101',
  '8': '100100100', '9': '001100100', 'A': '100001001', 'B': '001001001',
  'C': '101001000', 'D': '000011001', 'E': '100011000', 'F': '001011000',
  'G': '000001101', 'H': '100001100', 'I': '001001100', 'J': '000011100',
  'K': '100000011', 'L': '001000011', 'M': '101000010', 'N': '000010011',
  'O': '100010010', 'P': '001010010', 'Q': '000000111', 'R': '100000110',
  'S': '001000110', 'T': '000010110', 'U': '110000001', 'V': '011000001',
  'W': '111000000', 'X': '010010001', 'Y': '110010000', 'Z': '011010000',
  '-': '010000101', '.': '110000100', ' ': '011000100', '$': '010101000',
  '/': '010100010', '+': '010001010', '%': '000101010', '*': '010010100',
};

function generateCode39Bars(text: string): { bars: { x: number; width: number }[]; totalWidth: number } {
  const clean = '*' + (text || 'IDL2026').toUpperCase().replace(/[^0-9A-Z\-. $/+%]/g, '') + '*';
  const narrow = 1;
  const wide = 2.2;
  const gap = 1;
  let currentX = 4;
  const bars: { x: number; width: number }[] = [];

  for (let i = 0; i < clean.length; i++) {
    const pattern = CODE39_PATTERNS[clean[i]] || CODE39_PATTERNS['-'];
    for (let j = 0; j < 9; j++) {
      const isBar = j % 2 === 0;
      const width = pattern[j] === '1' ? wide : narrow;
      if (isBar) bars.push({ x: currentX, width });
      currentX += width;
    }
    currentX += gap;
  }
  currentX += 4;
  return { bars, totalWidth: currentX };
}

function generateQRMatrix(id: string) {
  const size = 21;
  const matrix: boolean[][] = Array.from({ length: size }, () => Array(size).fill(false));
  const fillFinder = (row: number, col: number) => {
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        if (r === 0 || r === 6 || c === 0 || c === 6 || (r >= 2 && r <= 4 && c >= 2 && c <= 4)) {
          matrix[row + r][col + c] = true;
        }
      }
    }
  };
  fillFinder(0, 0);
  fillFinder(0, 14);
  fillFinder(14, 0);
  for (let i = 8; i < 13; i += 2) {
    matrix[6][i] = true;
    matrix[i][6] = true;
  }
  matrix[8][13] = true;
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if ((r < 8 && c < 8) || (r < 8 && c >= 13) || (r >= 13 && c < 8)) continue;
      if (r === 6 || c === 6) continue;
      hash = (hash * 1103515245 + 12345) & 0x7fffffff;
      matrix[r][c] = hash % 3 === 0;
    }
  }
  return matrix;
}

export interface SubmissionStudentSummary {
  studentId?: string;
  studentName?: string;
  fatherName?: string;
  dob?: Date | string;
  bloodGroup?: string;
  studentPhone?: string;
  fatherPhone?: string;
  branch?: string;
  classApplied?: string;
  program?: string;
  stream?: string;
}

/** Shared Razorpay payment, submission thank-you, and Official Student ID Card dialogs. */
export function AdmissionSubmissionDialogs({
  isPaymentDialogOpen,
  setIsPaymentDialogOpen,
  isThankYouOpen,
  setIsThankYouOpen,
  isIdCardOpen,
  setIsIdCardOpen,
  isSubmitting,
  activeStudent,
  submittedStudent,
  photoPreview,
  feeAmount = ADMISSION_APPLICATION_FEE_INR,
  onPay,
  onAfterCloseAll,
}: {
  isPaymentDialogOpen: boolean;
  setIsPaymentDialogOpen: (open: boolean) => void;
  isThankYouOpen: boolean;
  setIsThankYouOpen: (open: boolean) => void;
  isIdCardOpen: boolean;
  setIsIdCardOpen: (open: boolean) => void;
  isSubmitting: boolean;
  activeStudent: SubmissionStudentSummary;
  submittedStudent: SubmissionStudentSummary | null;
  photoPreview: string | null;
  feeAmount?: number;
  onPay: () => void | Promise<void>;
  onAfterCloseAll?: () => void;
}) {
  const [idCardLayout, setIdCardLayout] = useState<'portrait_waves' | 'horizontal'>('portrait_waves');
  const [isDownloadingCard, setIsDownloadingCard] = useState(false);
  const idCardRef = useRef<HTMLDivElement>(null);

  const cardData = submittedStudent || activeStudent;
  const isFreeWaiver = feeAmount <= 0;

  return (
    <>
      {/* Razorpay / Fee Confirmation Dialog */}
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
              Application Processing Fee
            </DialogTitle>
            <DialogDescription className="text-xs font-semibold text-slate-600 dark:text-slate-300">
              {isFreeWaiver
                ? 'Admission processing fee is currently ₹0 (100% fee waiver). Confirm below to complete your application.'
                : `A nominal processing fee of ${formatFeeBadge(feeAmount)} is required to generate your official admission confirmation.`}
            </DialogDescription>
          </DialogHeader>

          <div className="my-4 p-4 rounded-[5px] bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-2.5 text-xs text-left">
            <div className="flex justify-between">
              <span className="text-slate-500">Student Name</span>
              <span className="font-bold text-slate-900 dark:text-white">{activeStudent.studentName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Program Applied</span>
              <span className="font-bold text-slate-900 dark:text-white">
                {activeStudent.classApplied}
                {activeStudent.program ? ` — ${activeStudent.program}` : ''}
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
              variant="outline"
              onClick={() => setIsPaymentDialogOpen(false)}
              className="w-full sm:w-auto text-xs font-bold rounded-[8px] border-slate-300 dark:border-slate-700 cursor-pointer"
            >
              Cancel
            </Button>
            <Button
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

      {/* Success + ID Card Dialog */}
      <Dialog open={isThankYouOpen} onOpenChange={setIsThankYouOpen}>
        <DialogContent className="rounded-2xl max-w-sm border border-border p-6 bg-white text-center">
          <DialogHeader className="space-y-2">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <DialogTitle className="text-lg font-bold text-slate-900">Application Submitted!</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground leading-relaxed">
              Your admission form has been received. Download your Student ID Card below.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 p-3 rounded-xl bg-primary/5 border border-primary/20 text-left">
            <p className="text-[10px] font-black uppercase tracking-wider text-primary mb-1.5">Your Student ID</p>
            <p className="text-base font-black text-slate-900 font-mono">{submittedStudent?.studentId}</p>
            <p className="text-[11px] text-slate-500 font-medium mt-0.5">{submittedStudent?.studentName}</p>
          </div>

          <DialogFooter className="mt-4 flex flex-col gap-2">
            <Button
              onClick={() => {
                setIsThankYouOpen(false);
                setIsIdCardOpen(true);
              }}
              className="w-full h-11 rounded-[8px] font-black text-xs bg-primary text-white cursor-pointer flex items-center justify-center gap-2"
            >
              <CreditCard className="w-4 h-4" />
              View &amp; Download ID Card
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setIsThankYouOpen(false);
                onAfterCloseAll?.();
              }}
              className="w-full h-10 rounded-[8px] font-bold text-xs cursor-pointer border-slate-200"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Student ID Card Dialog */}
      <Dialog
        open={isIdCardOpen}
        onOpenChange={(open) => {
          setIsIdCardOpen(open);
          if (!open) {
            onAfterCloseAll?.();
          }
        }}
      >
        <DialogContent
          onOpenAutoFocus={(e) => e.preventDefault()}
          className="sm:max-w-[560px] p-0 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-2xl z-[150] max-h-[96vh] flex flex-col"
        >
          <DialogTitle className="sr-only">Student ID Card</DialogTitle>
          <DialogDescription className="sr-only">Download your student identity card</DialogDescription>

          <div className="bg-white px-4 sm:px-5 py-3 border-b border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shrink-0">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Admission Confirmed</p>
              <h3 className="text-sm font-extrabold text-[#0B2A6F]">Official Student ID Card</h3>
            </div>

            <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto justify-end">
              <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200 mr-1">
                <button
                  type="button"
                  onClick={() => setIdCardLayout('portrait_waves')}
                  className={cn(
                    'px-2 py-1 text-[10.5px] font-bold rounded-md transition-all cursor-pointer',
                    idCardLayout === 'portrait_waves' ? 'bg-[#0A225C] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  )}
                >
                  Portrait Badge
                </button>
                <button
                  type="button"
                  onClick={() => setIdCardLayout('horizontal')}
                  className={cn(
                    'px-2 py-1 text-[10.5px] font-bold rounded-md transition-all cursor-pointer',
                    idCardLayout === 'horizontal' ? 'bg-[#0A225C] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  )}
                >
                  Horizontal
                </button>
              </div>

              <Button
                size="sm"
                variant="outline"
                disabled={isDownloadingCard}
                onClick={async () => {
                  if (!idCardRef.current) return;
                  setIsDownloadingCard(true);
                  try {
                    const { default: html2canvasLib } = await import('html2canvas');
                    const canvas = await html2canvasLib(idCardRef.current, {
                      scale: 3,
                      useCORS: true,
                      backgroundColor: null,
                      logging: false,
                    });
                    const link = document.createElement('a');
                    link.download = `${cardData.studentName || 'Student'}_IDCard.png`;
                    link.href = canvas.toDataURL('image/png');
                    link.click();
                  } finally {
                    setIsDownloadingCard(false);
                  }
                }}
                className="h-8 px-2.5 text-xs font-bold rounded-[8px] cursor-pointer border-[#D7DFEA] text-slate-700 hover:bg-slate-50"
              >
                <Download className="w-3.5 h-3.5 mr-1" /> PNG
              </Button>
              <Button
                size="sm"
                disabled={isDownloadingCard}
                onClick={async () => {
                  if (!idCardRef.current) return;
                  setIsDownloadingCard(true);
                  try {
                    const { default: html2canvasLib } = await import('html2canvas');
                    const canvas = await html2canvasLib(idCardRef.current, {
                      scale: 3,
                      useCORS: true,
                      backgroundColor: null,
                      logging: false,
                    });
                    const imgData = canvas.toDataURL('image/png');
                    const isPortrait = idCardLayout === 'portrait_waves';
                    const pdf = new jsPDF({
                      orientation: isPortrait ? 'portrait' : 'landscape',
                      unit: 'mm',
                      format: isPortrait ? [53.98, 85.6] : [85.6, 53.98],
                    });
                    pdf.addImage(
                      imgData,
                      'PNG',
                      0,
                      0,
                      isPortrait ? 53.98 : 85.6,
                      isPortrait ? 85.6 : 53.98,
                      '',
                      'FAST'
                    );
                    pdf.save(`${cardData.studentName || 'Student'}_IDCard.pdf`);
                  } finally {
                    setIsDownloadingCard(false);
                  }
                }}
                className="h-8 px-3 text-xs font-extrabold rounded-lg bg-[#0B2A6F] text-white hover:bg-[#071942] cursor-pointer shadow-xs"
              >
                <Download className="w-3.5 h-3.5 mr-1.5" /> PDF
              </Button>

              <Link
                href="/student-id-card"
                target="_blank"
                className="h-8 px-2.5 text-[11px] font-bold rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-50 hover:text-slate-900 inline-flex items-center gap-1"
                title="Open Studio to customize card"
              >
                Studio <ExternalLink className="w-3 h-3 text-slate-400" />
              </Link>
            </div>
          </div>

          <div className="p-4 sm:p-5 flex items-center justify-center bg-slate-100/90 overflow-y-auto flex-1">
            {(() => {
              const studentIdVal = cardData.studentId || '071126-101';
              const barcodeData = generateCode39Bars(studentIdVal);
              const qrMatrix = generateQRMatrix(studentIdVal);
              const studentNameVal = cardData.studentName || 'Student Name';
              const applyForVal = cardData.stream || cardData.program || 'Foundation';
              const classVal = cardData.classApplied || 'Class 12 PASS';
              const fatherVal = cardData.fatherName || '—';
              const bloodVal = cardData.bloodGroup || 'O+';
              const phoneVal = cardData.studentPhone || cardData.fatherPhone || '9876543210';
              const branchVal = (cardData.branch || 'Budh Vihar, Delhi')?.split(',')[0];
              const nameLength = studentNameVal.length;

              if (idCardLayout === 'portrait_waves') {
                return (
                  <div
                    ref={idCardRef}
                    style={{
                      width: 320,
                      height: 510,
                      borderRadius: 22,
                      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                      backgroundColor: '#FFFFFF',
                      boxShadow: '0 25px 60px -12px rgba(10, 34, 92, 0.25), 0 0 0 1.5px #CBD5E1',
                      boxSizing: 'border-box',
                      position: 'relative',
                      overflow: 'hidden',
                      userSelect: 'none',
                    }}
                  >
                    <div
                      style={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        padding: '0 0 14px 0',
                        boxSizing: 'border-box',
                        position: 'relative',
                      }}
                    >
                      <div
                        style={{
                          position: 'absolute',
                          top: 9,
                          left: '50%',
                          transform: 'translateX(-50%)',
                          width: 46,
                          height: 5.5,
                          borderRadius: 3,
                          backgroundColor: '#E2E8F0',
                          zIndex: 30,
                          boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.15)',
                        }}
                      />

                      <div
                        style={{
                          padding: '22px 18px 0 18px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          position: 'relative',
                          zIndex: 20,
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                          <img src="/idllogo.png" alt="IDL Education" style={{ height: 28, width: 'auto', objectFit: 'contain' }} />
                          <div style={{ textAlign: 'left' }}>
                            <h3
                              style={{
                                margin: 0,
                                fontSize: 11,
                                fontWeight: 900,
                                color: '#0A225C',
                                letterSpacing: '0.04em',
                                lineHeight: 1.1,
                              }}
                            >
                              IDL EDUCATION
                            </h3>
                            <p style={{ margin: 0, fontSize: 6.5, color: '#64748B', fontWeight: 700, letterSpacing: '0.05em' }}>
                              ACADEMY &bull; DELHI
                            </p>
                          </div>
                        </div>

                        <span
                          style={{
                            backgroundColor: '#0A225C',
                            color: '#FFFFFF',
                            fontSize: 7,
                            fontWeight: 800,
                            padding: '3px 8px',
                            borderRadius: 5,
                            letterSpacing: '0.06em',
                            textTransform: 'uppercase',
                            boxShadow: '0 2px 4px rgba(10, 34, 92, 0.2)',
                          }}
                        >
                          2026–27
                        </span>
                      </div>

                      <div style={{ position: 'absolute', top: 75, left: 0, right: 0, height: 115, zIndex: 5, pointerEvents: 'none' }}>
                        <svg viewBox="0 0 320 115" width="100%" height="100%" preserveAspectRatio="none" style={{ display: 'block' }}>
                          <path d="M-10,35 C70,80 220,10 330,55 L330,115 L-10,115 Z" fill="#EFF6FF" opacity="0.7" />
                          <path d="M-10,32 C70,78 220,8 330,52" stroke="#38BDF8" strokeWidth="2.5" fill="none" opacity="0.8" />
                          <path d="M-10,40 C75,86 215,16 330,62" stroke="#2563EB" strokeWidth="2" fill="none" />
                          <path d="M-10,48 C85,94 215,24 330,70" stroke="#0A225C" strokeWidth="3.5" fill="none" />
                        </svg>
                      </div>

                      <div style={{ position: 'relative', zIndex: 15, marginTop: 4 }}>
                        <div
                          style={{
                            width: 108,
                            height: 108,
                            borderRadius: '50%',
                            margin: '0 auto',
                            border: '4px solid #0A225C',
                            boxShadow: '0 10px 25px rgba(10, 34, 92, 0.22)',
                            backgroundColor: '#F8FAFC',
                            overflow: 'hidden',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          {photoPreview ? (
                            <img src={photoPreview} alt="Student" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : (
                            <User style={{ width: 44, height: 44, color: '#94A3B8' }} />
                          )}
                        </div>

                        <div style={{ textAlign: 'center', marginTop: 8 }}>
                          <h2
                            style={{
                              margin: 0,
                              fontSize: studentNameVal.length > 18 ? 14.5 : 17,
                              fontWeight: 900,
                              color: '#0A225C',
                              textTransform: 'uppercase',
                              letterSpacing: '0.02em',
                              lineHeight: 1.2,
                            }}
                          >
                            {studentNameVal}
                          </h2>
                          <p
                            style={{
                              margin: '2px 0 0',
                              fontSize: 9.5,
                              color: '#2563EB',
                              fontWeight: 800,
                              textTransform: 'uppercase',
                              letterSpacing: '0.04em',
                            }}
                          >
                            {applyForVal} &bull; {classVal}
                          </p>
                          <div style={{ width: 50, height: 2.5, backgroundColor: '#0A225C', borderRadius: 2, margin: '6px auto 0 auto' }} />
                        </div>
                      </div>

                      <div style={{ fontSize: 9.5, lineHeight: 1.85, textAlign: 'left', padding: '0 24px', position: 'relative', zIndex: 10 }}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <span style={{ width: 62, color: '#64748B', fontWeight: 800, fontSize: 9 }}>ID NO</span>
                          <span style={{ width: 12, color: '#94A3B8', fontWeight: 700 }}>:</span>
                          <strong style={{ color: '#0A225C', fontFamily: 'monospace', fontSize: 10.5, letterSpacing: '0.05em' }}>
                            {studentIdVal}
                          </strong>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <span style={{ width: 62, color: '#64748B', fontWeight: 800, fontSize: 9 }}>Father</span>
                          <span style={{ width: 12, color: '#94A3B8', fontWeight: 700 }}>:</span>
                          <span style={{ color: '#0F172A', fontWeight: 700, fontSize: 9, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {fatherVal}
                          </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <span style={{ width: 62, color: '#64748B', fontWeight: 800, fontSize: 9 }}>Blood</span>
                          <span style={{ width: 12, color: '#94A3B8', fontWeight: 700 }}>:</span>
                          <span style={{ color: '#0A225C', fontWeight: 800, fontSize: 9 }}>{bloodVal}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <span style={{ width: 62, color: '#64748B', fontWeight: 800, fontSize: 9 }}>Phone</span>
                          <span style={{ width: 12, color: '#94A3B8', fontWeight: 700 }}>:</span>
                          <span style={{ color: '#0F172A', fontWeight: 700, fontSize: 9 }}>+91 {phoneVal}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <span style={{ width: 62, color: '#64748B', fontWeight: 800, fontSize: 9 }}>Branch</span>
                          <span style={{ width: 12, color: '#94A3B8', fontWeight: 700 }}>:</span>
                          <span style={{ color: '#0F172A', fontWeight: 700, fontSize: 9, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {branchVal}
                          </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <span style={{ width: 62, color: '#64748B', fontWeight: 800, fontSize: 9 }}>Address</span>
                          <span style={{ width: 12, color: '#94A3B8', fontWeight: 700 }}>:</span>
                          <span style={{ color: '#0F172A', fontWeight: 700, fontSize: 9, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            Delhi, India
                          </span>
                        </div>
                      </div>

                      <div style={{ position: 'absolute', bottom: 0, left: 0, width: 130, height: 100, zIndex: 6, pointerEvents: 'none' }}>
                        <svg viewBox="0 0 130 100" width="100%" height="100%" style={{ display: 'block' }}>
                          <path d="M-20,100 C-10,50 35,35 75,58 C105,75 110,100 110,100 Z" fill="#EFF6FF" opacity="0.8" />
                          <path d="M-10,100 C5,65 40,50 70,68 C92,82 98,100 98,100" stroke="#38BDF8" strokeWidth="2" fill="none" opacity="0.7" />
                          <path d="M-10,100 C-5,75 25,60 55,75 C75,88 82,100 82,100" stroke="#0A225C" strokeWidth="3" fill="none" />
                        </svg>
                      </div>

                      <div style={{ padding: '0 20px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', position: 'relative', zIndex: 10 }}>
                        <div style={{ textAlign: 'left', paddingLeft: 4 }}>
                          <span style={{ fontSize: 7.5, color: '#0A225C', fontWeight: 900, display: 'block', letterSpacing: '0.02em' }}>
                            IDL EDUCATION ACADEMY
                          </span>
                          <span style={{ fontSize: 6.5, color: '#64748B', display: 'block', fontWeight: 600 }}>
                            www.idleducation.in &bull; 011 45035713
                          </span>
                        </div>

                        <div
                          style={{
                            width: 50,
                            height: 50,
                            backgroundColor: '#FFFFFF',
                            border: '1.5px solid #0A225C',
                            padding: 3,
                            borderRadius: 6,
                            boxShadow: '0 3px 8px rgba(10, 34, 92, 0.15)',
                            flexShrink: 0,
                          }}
                        >
                          <svg viewBox="0 0 21 21" width="100%" height="100%">
                            {qrMatrix.map((row, r) =>
                              row.map((val, c) => (val ? <rect key={`${r}-${c}`} x={c} y={r} width="1" height="1" fill="#0A225C" /> : null))
                            )}
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <div
                  ref={idCardRef}
                  className="relative overflow-hidden select-none"
                  style={{
                    width: 460,
                    height: 290,
                    minWidth: 460,
                    minHeight: 290,
                    borderRadius: 14,
                    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                    background: 'linear-gradient(145deg, #0A225C 0%, #081B4B 50%, #051336 100%)',
                    boxShadow: '0 20px 45px -10px rgba(5, 19, 54, 0.5), 0 0 0 1.5px rgba(255, 255, 255, 0.12)',
                    boxSizing: 'border-box',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: 3,
                      background: 'linear-gradient(90deg, #F5B51B 0%, #F8D06E 50%, #F5B51B 100%)',
                    }}
                  />

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px 0 18px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div
                        style={{
                          backgroundColor: '#FFFFFF',
                          padding: '3px 7px',
                          borderRadius: 6,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                        }}
                      >
                        <img src="/idllogo.png" alt="IDL Education" style={{ height: 22, width: 'auto', objectFit: 'contain' }} />
                      </div>
                      <div>
                        <h4 style={{ margin: 0, fontSize: 11, fontWeight: 800, color: '#FFFFFF', letterSpacing: '0.06em', textTransform: 'uppercase', lineHeight: 1.15 }}>
                          IDL EDUCATION
                        </h4>
                        <p style={{ margin: '1px 0 0', fontSize: 7.5, color: '#94A3B8', letterSpacing: '0.04em', fontWeight: 500 }}>
                          Academy &bull; Learning Centre
                        </p>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div
                        style={{
                          display: 'inline-block',
                          backgroundColor: 'rgba(245, 181, 27, 0.12)',
                          border: '1px solid rgba(245, 181, 27, 0.4)',
                          padding: '2px 8px',
                          borderRadius: 4,
                        }}
                      >
                        <p style={{ margin: 0, fontSize: 7.5, fontWeight: 800, color: '#F5B51B', letterSpacing: '0.08em', textTransform: 'uppercase', lineHeight: 1.2 }}>
                          STUDENT ID CARD
                        </p>
                      </div>
                      <p style={{ margin: '2px 0 0', fontSize: 7, color: '#94A3B8', letterSpacing: '0.04em', fontWeight: 500 }}>
                        Session 2026–27
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, padding: '12px 18px 0 18px' }}>
                    <div
                      style={{
                        width: 82,
                        height: 104,
                        borderRadius: 8,
                        overflow: 'hidden',
                        flexShrink: 0,
                        border: '1.5px solid rgba(245, 181, 27, 0.6)',
                        backgroundColor: 'rgba(255, 255, 255, 0.06)',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.25)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {photoPreview ? (
                        <img src={photoPreview} alt="Student" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <div style={{ textAlign: 'center', padding: 4 }}>
                          <User style={{ width: 28, height: 28, color: 'rgba(255, 255, 255, 0.3)', margin: '0 auto' }} />
                          <span style={{ fontSize: 7, color: 'rgba(255, 255, 255, 0.4)', display: 'block', marginTop: 2 }}>
                            Photo
                          </span>
                        </div>
                      )}
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h3
                        style={{
                          margin: 0,
                          fontSize: nameLength > 22 ? 12 : nameLength > 16 ? 13.5 : 15,
                          fontWeight: 700,
                          color: '#FFFFFF',
                          textTransform: 'uppercase',
                          letterSpacing: '0.02em',
                          lineHeight: 1.2,
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {studentNameVal}
                      </h3>
                      <p style={{ margin: '2px 0 0', fontSize: 8.5, color: '#94A3B8', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        S/O {fatherVal}
                      </p>

                      <div style={{ height: 1, backgroundColor: 'rgba(255, 255, 255, 0.1)', margin: '6px 0 8px 0' }} />

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px 12px' }}>
                        <div>
                          <p style={{ margin: 0, fontSize: 6.5, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>
                            STUDENT ID
                          </p>
                          <p style={{ margin: '1px 0 0', fontSize: 9.5, fontWeight: 800, color: '#F5B51B', letterSpacing: '0.04em', fontFamily: 'monospace' }}>
                            {studentIdVal}
                          </p>
                        </div>
                        <div>
                          <p style={{ margin: 0, fontSize: 6.5, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>
                            DATE OF BIRTH
                          </p>
                          <p style={{ margin: '1px 0 0', fontSize: 8.5, fontWeight: 600, color: '#FFFFFF' }}>
                            {cardData.dob ? formatDateForDisplay(cardData.dob) : '—'}
                          </p>
                        </div>
                        <div style={{ gridColumn: '1 / -1' }}>
                          <p style={{ margin: 0, fontSize: 6.5, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>
                            PROGRAM / CLASS
                          </p>
                          <p style={{ margin: '1px 0 0', fontSize: 8.5, fontWeight: 600, color: '#FFFFFF', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {applyForVal} &bull; {classVal}
                          </p>
                        </div>
                        <div>
                          <p style={{ margin: 0, fontSize: 6.5, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>
                            CENTER / BRANCH
                          </p>
                          <p style={{ margin: '1px 0 0', fontSize: 8, fontWeight: 600, color: '#CBD5E1', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {branchVal}
                          </p>
                        </div>
                        <div>
                          <p style={{ margin: 0, fontSize: 6.5, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>
                            BLOOD GROUP
                          </p>
                          <p style={{ margin: '1px 0 0', fontSize: 8, fontWeight: 600, color: '#F5B51B' }}>
                            {bloodVal}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div style={{ padding: '0 18px 10px 18px', marginTop: 'auto' }}>
                    <div style={{ height: 1, backgroundColor: 'rgba(255, 255, 255, 0.1)', marginBottom: 7 }} />

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div
                        style={{
                          backgroundColor: '#FFFFFF',
                          padding: '3px 6px',
                          borderRadius: 4,
                          boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          width: 130,
                        }}
                      >
                        <svg viewBox={`0 0 ${barcodeData.totalWidth} 16`} width="100%" height="16" preserveAspectRatio="none" style={{ display: 'block' }}>
                          {barcodeData.bars.map((bar, idx) => (
                            <rect key={idx} x={bar.x} y={0} width={bar.width} height={16} fill="#0F172A" />
                          ))}
                        </svg>
                        <span style={{ fontSize: 6.5, fontWeight: 700, color: '#0F172A', fontFamily: 'monospace', letterSpacing: '0.08em', marginTop: 1, lineHeight: 1 }}>
                          {studentIdVal}
                        </span>
                      </div>

                      <div style={{ textAlign: 'center' }}>
                        <p style={{ margin: 0, fontSize: 6.5, color: '#94A3B8', fontWeight: 500 }}>idleducation.in</p>
                        <p style={{ margin: '1px 0 0', fontSize: 6, color: 'rgba(148, 163, 184, 0.7)' }}>
                          Official Student ID
                        </p>
                      </div>

                      <div style={{ textAlign: 'center', width: 95 }}>
                        <div style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.4)', marginBottom: 2, height: 12 }} />
                        <p style={{ margin: 0, fontSize: 6, fontWeight: 600, color: '#94A3B8', letterSpacing: '0.06em', textTransform: 'uppercase', lineHeight: 1 }}>
                          AUTH. SIGNATORY
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>

          <div className="px-6 pb-4 pt-2 text-center bg-white border-t border-slate-200 shrink-0">
            <p className="text-[11px] text-slate-500 font-medium">
              This is your verified institutional digital Student ID Card.
            </p>
            <Button
              variant="ghost"
              size="sm"
              className="mt-1 text-xs text-slate-400 hover:text-slate-600 cursor-pointer"
              onClick={() => {
                setIsIdCardOpen(false);
                onAfterCloseAll?.();
              }}
            >
              Close &amp; Exit
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
