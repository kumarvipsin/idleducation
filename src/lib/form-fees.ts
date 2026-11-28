'use client';

import { createRazorpayOrder } from '@/app/actions/forms';

/** Centralized application fee constants (INR). Update here to enable live charges later. */
export const ADMISSION_APPLICATION_FEE_INR = 0;
export const SCHOLARSHIP_APPLICATION_FEE_INR = 0;

export interface FeePaymentOutcome {
  transactionId: string;
  feeAmount: number;
  paymentStatus: 'free_waived' | 'paid';
}

export function formatFeeBadge(amountInr: number): string {
  return `₹${Math.max(0, Math.round(amountInr))}`;
}

async function ensureRazorpayScriptLoaded(): Promise<boolean> {
  if (typeof window === 'undefined') return false;
  if ((window as unknown as { Razorpay?: unknown }).Razorpay) return true;

  return new Promise<boolean>((resolve) => {
    const existingScript = document.querySelector(
      'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
    );
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(true));
      existingScript.addEventListener('error', () => resolve(false));
      setTimeout(
        () => resolve(Boolean((window as unknown as { Razorpay?: unknown }).Razorpay)),
        300
      );
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

/**
 * Processes an application fee through Razorpay when amountInr > 0, or completes
 * immediately with a waiver record when amountInr === 0.
 */
export async function processRazorpayFeePayment({
  amountInr,
  description,
  prefill,
  onPaid,
  onError,
  onDismiss,
}: {
  amountInr: number;
  description: string;
  prefill: { name?: string; email?: string; contact?: string };
  onPaid: (outcome: FeePaymentOutcome) => Promise<void> | void;
  onError: (title: string, message: string) => void;
  onDismiss: () => void;
}): Promise<void> {
  const normalizedFee = Math.max(0, Math.round(amountInr));

  if (normalizedFee <= 0) {
    await onPaid({
      transactionId: `FREE-WAIVER-${Date.now().toString().slice(-6)}`,
      feeAmount: 0,
      paymentStatus: 'free_waived',
    });
    return;
  }

  const isScriptLoaded = await ensureRazorpayScriptLoaded();
  const RazorpayCtor = (window as unknown as { Razorpay?: new (opts: Record<string, unknown>) => { on: (event: string, cb: (resp: { error?: { description?: string } }) => void) => void; open: () => void } }).Razorpay;

  if (!isScriptLoaded || !RazorpayCtor) {
    onError(
      'Payment Gateway Offline',
      'Could not load Razorpay payment service. Please check your connection and try again.'
    );
    onDismiss();
    return;
  }

  const amountPaise = normalizedFee * 100;
  const result = await createRazorpayOrder({ amount: amountPaise, currency: 'INR' });
  if (!result.success || (!result.order && !result.orderId)) {
    onError(
      'Payment Gateway Error',
      result.message || 'Could not initialize payment. Please try again or contact support.'
    );
    onDismiss();
    return;
  }

  const orderData = (result.order || {}) as { id?: string; amount?: number; currency?: string };
  const orderId = result.orderId || orderData.id;
  const orderAmount = result.amount || orderData.amount || amountPaise;
  const orderCurrency = result.currency || orderData.currency || 'INR';
  const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_RKEYtYbYMDeMpw';

  const razorpay = new RazorpayCtor({
    key: razorpayKey,
    amount: orderAmount,
    currency: orderCurrency,
    name: 'IDL Education',
    description,
    order_id: orderId,
    handler: async (response: { razorpay_payment_id?: string }) => {
      try {
        const txnId = response.razorpay_payment_id || `TXN-${Date.now().toString().slice(-6)}`;
        await onPaid({
          transactionId: txnId,
          feeAmount: normalizedFee,
          paymentStatus: 'paid',
        });
      } catch (submitErr) {
        console.error('Submission failed after payment:', submitErr);
        onError(
          'Saving Error',
          'Payment was successful, but form submission encountered an issue. Please contact support.'
        );
        onDismiss();
      }
    },
    prefill: {
      name: prefill.name || '',
      email: prefill.email || '',
      contact: prefill.contact || '',
    },
    theme: { color: '#0F172A' },
    modal: {
      ondismiss: () => {
        onDismiss();
      },
    },
  });

  razorpay.on('payment.failed', (resp) => {
    onError('Payment Failed', resp?.error?.description || 'Payment was rejected or cancelled.');
    onDismiss();
  });

  razorpay.open();
}
