'use client';

import React, { useState } from 'react';
import { 
  Search, 
  CreditCard, 
  CheckCircle2, 
  AlertCircle, 
  User, 
  Phone, 
  GraduationCap, 
  Calendar, 
  ArrowRight, 
  RotateCcw, 
  ShieldCheck, 
  X,
  Loader2,
  Printer,
  Clock,
  AlertTriangle
} from 'lucide-react';
import { lookupStudentForFeePayment, collectFeePayment } from '@/app/actions/fee-management';
import { toast } from '@/hooks/use-toast';

interface PayFeeCardProps {
  onClose?: () => void;
  isMobile?: boolean;
}

interface StudentData {
  id: string;
  rollNumber: string;
  name: string;
  fatherName: string;
  contact: string;
  className: string;
  batchName: string;
  branchName: string;
  branchId: string;
  classId: string;
  batchId: string;
  currentMonth: string;
  currentMonthLabel: string;
  monthlyFee: number;
  dueAmount: number;
  paidAmount: number;
  status: 'PAID' | 'PENDING' | 'OVERDUE' | 'PARTIAL';
  dueDate: string;
  isOverdue?: boolean;
  overdueDays?: number;
}

interface SuccessData {
  receiptId: string;
  paymentId: string;
  amount: number;
  date: string;
  studentName: string;
  rollNumber: string;
  monthLabel: string;
}

export function PayFeeCard({ onClose, isMobile = false }: PayFeeCardProps) {
  const [studentIdInput, setStudentIdInput] = useState('');
  const [phoneInput, setPhoneInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [studentData, setStudentData] = useState<StudentData | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isPaying, setIsPaying] = useState(false);
  const [successData, setSuccessData] = useState<SuccessData | null>(null);

  // Search student by ID / Roll Number + Registered Primary Phone Number
  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const queryId = studentIdInput.trim();
    const queryPhone = phoneInput.trim();

    if (!queryId) {
      setErrorMessage('Kripya apna Registration ID enter karein.');
      return;
    }

    if (!queryPhone || queryPhone.replace(/\D/g, '').length < 10) {
      setErrorMessage('Kripya apna 10-digit Primary Mobile number enter karein.');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');
    setStudentData(null);
    setSuccessData(null);

    try {
      const res = await lookupStudentForFeePayment(queryId, queryPhone);
      if (res.success && res.data) {
        setStudentData(res.data);
      } else {
        setErrorMessage(res.message || 'Verification fail ho gaya. Kripya Registration ID aur Primary Mobile number check karein.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Lookup failed. Kripya dobara try karein.');
    } finally {
      setIsLoading(false);
    }
  };

  // Trigger Razorpay Payment
  const handlePayViaRazorpay = async () => {
    if (!studentData || studentData.dueAmount <= 0) return;

    setIsPaying(true);

    try {
      // Ensure Razorpay checkout script is loaded
      if (typeof window !== 'undefined' && !(window as any).Razorpay) {
        await new Promise<void>((resolve, reject) => {
          const script = document.createElement('script');
          script.src = 'https://checkout.razorpay.com/v1/checkout.js';
          script.onload = () => resolve();
          script.onerror = () => reject(new Error('Failed to load Razorpay SDK'));
          document.body.appendChild(script);
        });
      }

      const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_RKEYtYbYMDeMpw';
      const payAmount = Number(studentData.dueAmount);

      const options = {
        key: razorpayKey,
        amount: Math.round(payAmount * 100), // in paise
        currency: 'INR',
        name: 'IDL Education',
        description: `Fee Payment - ${studentData.name} (${studentData.rollNumber}) • ${studentData.currentMonthLabel}`,
        handler: async function (response: any) {
          try {
            const txnId = response.razorpay_payment_id || `PAY-${Date.now()}`;
            // Record payment in fee management system
            const res = await collectFeePayment({
              studentId: studentData.id,
              month: studentData.currentMonth,
              amount: payAmount,
              paymentMode: 'online',
              transactionRef: txnId,
              remarks: 'Online fee payment via website (Razorpay)',
              collectedBy: 'Razorpay Gateway',
            });

            if (res.success) {
              setSuccessData({
                receiptId: res.receipt?.receiptNumber || `REC-${Date.now().toString().slice(-6)}`,
                paymentId: txnId,
                amount: payAmount,
                date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
                studentName: studentData.name,
                rollNumber: studentData.rollNumber,
                monthLabel: studentData.currentMonthLabel,
              });
              setStudentData(null);
              toast({ title: 'Payment Successful', description: 'Fee payment receipt generate ho gayi hai.' });
            } else {
              toast({ variant: 'destructive', title: 'Payment Recorded with Error', description: res.message });
            }
          } catch (recErr: any) {
            console.error('Record payment error:', recErr);
            toast({ variant: 'destructive', title: 'Error', description: 'Payment complete hui par update fail hua. Support se sampark karein.' });
          } finally {
            setIsPaying(false);
          }
        },
        prefill: {
          name: studentData.name,
          contact: studentData.contact && studentData.contact !== '—' ? studentData.contact : '',
        },
        theme: {
          color: '#2864E8',
        },
        modal: {
          ondismiss: function () {
            setIsPaying(false);
          },
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', function (resp: any) {
        toast({
          variant: 'destructive',
          title: 'Payment Failed',
          description: resp?.error?.description || 'Transaction fail ho gaya.',
        });
        setIsPaying(false);
      });
      rzp.open();
    } catch (err: any) {
      console.error('Razorpay open error:', err);
      toast({
        variant: 'destructive',
        title: 'Payment Gateway Error',
        description: err.message || 'Razorpay open nahi ho saka.',
      });
      setIsPaying(false);
    }
  };

  const handleReset = () => {
    setStudentData(null);
    setErrorMessage('');
    setSuccessData(null);
    setStudentIdInput('');
    setPhoneInput('');
  };

  const formatDisplayDate = (d?: string) => {
    if (!d) return '—';
    const pure = d.split('T')[0];
    const parts = pure.split('-');
    if (parts.length === 3) {
      if (parts[0].length === 4) {
        return `${parts[2]}-${parts[1]}-${parts[0]}`;
      }
      return pure;
    }
    return pure;
  };

  return (
    <div className={`bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl shadow-xl p-4 sm:p-5 text-left text-slate-800 dark:text-slate-100 ${isMobile ? 'w-full' : ''}`}>
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-50/90 dark:bg-blue-950/60 text-[#2864E8] border border-blue-100/80 dark:border-blue-900/60 flex items-center justify-center shrink-0">
            <CreditCard className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white leading-tight">
              Pay Student Fee
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-normal mt-0.5">
              Secure Online Fee Payment via Razorpay
            </p>
          </div>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Main Content Area */}
      <div className="pt-3 space-y-3">
        {/* Step 1: Input Search Form (Shown when no student data and no success) */}
        {!studentData && !successData && (
          <form onSubmit={handleSearch} className="space-y-3">
            {/* Registration ID */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-200 mb-1">
                Registration ID
              </label>
              <input
                type="text"
                value={studentIdInput}
                onChange={e => {
                  setStudentIdInput(e.target.value);
                  if (errorMessage) setErrorMessage('');
                }}
                placeholder="e.g. 09112026-102"
                autoFocus
                className="w-full h-11 px-3.5 rounded-[5px] border border-slate-200/90 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 focus:bg-white dark:focus:bg-slate-950 text-xs sm:text-[13px] font-mono font-medium text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-[#2864E8] focus:ring-2 focus:ring-[#2864E8]/15 transition-all"
              />
            </div>

            {/* Primary Mobile */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-200 mb-1">
                Primary Mobile
              </label>
              <input
                type="tel"
                maxLength={10}
                value={phoneInput}
                onChange={e => {
                  setPhoneInput(e.target.value.replace(/\D/g, ''));
                  if (errorMessage) setErrorMessage('');
                }}
                placeholder="e.g. 9990099900"
                className="w-full h-11 px-3.5 rounded-[5px] border border-slate-200/90 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 focus:bg-white dark:focus:bg-slate-950 text-xs sm:text-[13px] font-mono font-medium text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-[#2864E8] focus:ring-2 focus:ring-[#2864E8]/15 transition-all"
              />
            </div>

            {/* Privacy Information Section: Tinted subtle background with soft blue icon container */}
            <div className="p-2.5 rounded-[5px] bg-blue-50/50 dark:bg-blue-950/25 border border-blue-100/70 dark:border-blue-900/40 flex items-start gap-2.5 leading-relaxed">
              <div className="w-5 h-5 rounded-[4px] bg-blue-100/70 dark:bg-blue-900/50 text-[#2864E8] flex items-center justify-center shrink-0 mt-0.5">
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>
              <div className="space-y-0.5 min-w-0">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-800 dark:text-slate-200 block">
                  YOUR DETAILS ARE SECURE
                </span>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug">
                  Your Student ID and registered mobile number must match to securely access your fee details.
                </p>
              </div>
            </div>

            {errorMessage && (
              <div className="p-2.5 rounded-[5px] bg-rose-50/70 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 flex items-start gap-2 text-rose-700 dark:text-rose-300 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || !studentIdInput.trim() || phoneInput.length < 10}
              className="w-full h-11 rounded-[5px] bg-gradient-to-r from-[#2864E8] to-[#1E4ED8] hover:from-[#1E4ED8] hover:to-[#173EB0] active:scale-[0.99] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-[0_2px_8px_rgba(40,100,232,0.25)] hover:shadow-[0_4px_12px_rgba(40,100,232,0.35)] disabled:from-[#8EAEEF] disabled:to-[#8EAEEF] dark:disabled:from-[#1E3A8A]/70 dark:disabled:to-[#1E3A8A]/70 disabled:text-white/90 disabled:cursor-not-allowed disabled:pointer-events-none disabled:shadow-none"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" />
                  <span>VERIFYING DETAILS...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  <span>VERIFY & VIEW FEE DETAILS</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* Step 2: Student Details & Payment Card */}
        {studentData && !successData && (
          <div className="space-y-3.5">
            {/* Student Info Section (Clean White with Horizontal Separators) */}
            <div className="space-y-2 text-xs pb-3 border-b border-slate-100 dark:border-slate-800/80">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 dark:text-white text-sm">
                  {studentData.name}
                </span>
                <span className="font-mono font-medium text-[11px] text-slate-500 dark:text-slate-400">
                  {studentData.rollNumber}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] pt-1.5 border-t border-slate-100 dark:border-slate-800/80">
                <div>
                  <span className="text-slate-400 dark:text-slate-500 block text-[10px] font-medium">Father Name</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-200">
                    {studentData.fatherName}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 dark:text-slate-500 block text-[10px] font-medium">Contact Mobile</span>
                  <span className="font-mono font-semibold text-slate-700 dark:text-slate-200">
                    {studentData.contact}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 dark:text-slate-500 block text-[10px] font-medium">Class & Batch</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-200 truncate block">
                    {studentData.className} • {studentData.batchName}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 dark:text-slate-500 block text-[10px] font-medium">Branch</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-200 truncate block">
                    {studentData.branchName}
                  </span>
                </div>
              </div>
            </div>

            {/* Fee Summary Section (Clean White with Horizontal Separator) */}
            {(() => {
              const isOverdue = Boolean(studentData.isOverdue || studentData.status === 'OVERDUE') && studentData.dueAmount > 0;
              const overdueDays = studentData.overdueDays || 0;

              return (
                <div className="pb-3 border-b border-slate-100 dark:border-slate-800/80">
                  <div className="flex items-center justify-between gap-3">
                    {/* Left Details: Month -> Payment Status -> Due Date */}
                    <div className="space-y-1 min-w-0">
                      {/* Line 1: Header */}
                      <div className="text-[10.5px] uppercase font-bold tracking-wider text-slate-700 dark:text-slate-200">
                        FEE SUMMARY · {studentData.currentMonthLabel.toUpperCase()}
                      </div>

                      {/* Line 2: Payment Status */}
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5 flex-wrap">
                        <span>Payment Status:</span>
                        {studentData.dueAmount === 0 ? (
                          <span className="font-bold text-emerald-600 dark:text-emerald-400">
                            PAID
                          </span>
                        ) : isOverdue ? (
                          <span className="inline-flex items-center gap-1.5">
                            <span className="font-bold text-rose-600 dark:text-rose-400">
                              OVERDUE
                            </span>
                            {overdueDays > 0 && (
                              <span className="inline-flex flex-col items-start justify-center leading-none text-rose-600 dark:text-rose-400">
                                <span className="flex items-baseline gap-0.5 leading-none">
                                  <span className="font-bold text-[11px] tabular-nums leading-none">{overdueDays}</span>
                                  <span className="text-[8.5px] font-medium leading-none">{overdueDays === 1 ? 'day' : 'days'}</span>
                                </span>
                                <span className="text-[8.5px] font-semibold leading-none mt-0.5">
                                  Overdue
                                </span>
                              </span>
                            )}
                          </span>
                        ) : (
                          <span className="font-bold text-amber-600 dark:text-amber-400">
                            PENDING
                          </span>
                        )}
                      </div>

                      {/* Line 3: Due Date */}
                      {studentData.dueDate && (
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-400 shrink-0" />
                          <span>Due Date: <strong className="font-semibold text-slate-700 dark:text-slate-300 font-mono">{formatDisplayDate(studentData.dueDate)}</strong></span>
                        </div>
                      )}
                    </div>

                    {/* Right Side: Payable Amount */}
                    <div className="text-right shrink-0">
                      <span className={`font-mono text-xl sm:text-2xl font-bold block leading-tight ${
                        isOverdue ? 'text-rose-600 dark:text-rose-400' : 'text-[#2864E8] dark:text-blue-400'
                      }`}>
                        ₹{studentData.dueAmount.toLocaleString('en-IN')}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono block mt-0.5">
                        {isOverdue ? (
                          <span className="text-rose-500/90 dark:text-rose-400 font-medium">Overdue Amount</span>
                        ) : (
                          <span>Monthly Payable: ₹{studentData.monthlyFee.toLocaleString('en-IN')}</span>
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* If Fully Paid */}
            {studentData.dueAmount === 0 ? (
              <div className="p-3 rounded-[5px] bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 text-center space-y-1">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mx-auto" />
                <p className="font-bold text-xs text-emerald-800 dark:text-emerald-200">
                  All Dues Paid!
                </p>
                <p className="text-[11px] text-emerald-600 dark:text-emerald-400">
                  Is mahine ki poori fees jama ho chuki hai. Koi dues pending nahi hain.
                </p>
              </div>
            ) : (
              /* Pay via Razorpay CTA */
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={handlePayViaRazorpay}
                  disabled={isPaying}
                  className="w-full h-11 rounded-[5px] bg-[#2864E8] hover:bg-[#1E4ED8] active:scale-[0.99] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-none disabled:bg-[#8EAEEF] dark:disabled:bg-[#1E3A8A]/70 disabled:text-white disabled:cursor-not-allowed disabled:pointer-events-none"
                >
                  {isPaying ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" />
                      <span>Opening Razorpay...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4 shrink-0" />
                      <span>
                        PROCEED TO PAY ₹{studentData.dueAmount.toLocaleString('en-IN')}
                      </span>
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Back / Search Another */}
            <div className="pt-1 text-center">
              <button
                type="button"
                onClick={handleReset}
                className="text-[11px] font-medium text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:underline cursor-pointer inline-flex items-center gap-1.5 transition-colors"
              >
                <RotateCcw className="w-3 h-3 shrink-0" />
                <span>Change Student / Search Another ID</span>
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Success Screen (After payment) */}
        {successData && (
          <div className="space-y-3 text-center py-2">
            <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center mx-auto shadow-xs">
              <CheckCircle2 className="w-6 h-6" />
            </div>

            <div>
              <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                Payment Successful!
              </h4>
              <p className="text-[11px] text-slate-500">
                Aapki fee payment successfully confirm ho chuki hai.
              </p>
            </div>

            <div className="p-3.5 rounded-[5px] bg-slate-50/70 dark:bg-slate-950/60 border border-slate-200/90 dark:border-slate-800 text-left space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Student Name</span>
                <span className="font-bold text-slate-800 dark:text-slate-100">{successData.studentName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Receipt No.</span>
                <span className="font-mono font-bold text-[#2864E8]">{successData.receiptId}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Transaction ID</span>
                <span className="font-mono text-[11px] text-slate-600 dark:text-slate-300">{successData.paymentId}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Amount Paid</span>
                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">₹{successData.amount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Date</span>
                <span className="font-mono text-slate-600 dark:text-slate-300">{successData.date}</span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => window.print()}
                className="h-8 px-3 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold flex items-center gap-1.5 text-slate-700 dark:text-slate-300 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print</span>
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="h-8 px-3 rounded-lg bg-[#2864E8] hover:bg-blue-600 text-white text-xs font-bold cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

