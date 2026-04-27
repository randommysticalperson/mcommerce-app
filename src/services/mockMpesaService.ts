/**
 * Mock M-Pesa Service
 * ───────────────────
 * Simulates the full Safaricom Daraja STK Push flow locally.
 * No consumer key, consumer secret, or shortcode needed.
 *
 * In production, replace calls to this service with real Daraja API calls
 * via your backend server (never call Daraja directly from the mobile app).
 *
 * Flow:
 *   1. initiateStkPush()  → sends push to mock server → returns CheckoutRequestID
 *   2. queryStkStatus()   → polls mock server → returns success/failure
 *   3. App updates order status based on result
 */

import api from './api';

export interface StkPushRequest {
  phone: string;
  amount: number;
  orderId: string;
}

export interface StkPushResponse {
  success: boolean;
  CheckoutRequestID?: string;
  MerchantRequestID?: string;
  CustomerMessage?: string;
  error?: string;
}

export interface StkQueryResponse {
  success: boolean;
  ResultCode?: string;
  ResultDesc?: string;
  MpesaReceiptNumber?: string;
  error?: string;
}

/**
 * Normalize a Kenyan phone number to 2547XXXXXXXX format.
 * Works with 07XXXXXXXX, 7XXXXXXXX, and 2547XXXXXXXX inputs.
 */
export const normalizeKenyanPhone = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.startsWith('254')) return cleaned;
  if (cleaned.startsWith('0')) return `254${cleaned.slice(1)}`;
  if (cleaned.startsWith('7') || cleaned.startsWith('1')) return `254${cleaned}`;
  throw new Error(`Invalid Kenyan phone number: ${phone}`);
};

/**
 * Format a KES amount for display (e.g. 42999 → "KES 42,999.00")
 */
export const formatKES = (amount: number): string =>
  `KES ${amount.toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

/**
 * Calculate 16% VAT on a given amount.
 */
export const calculateVAT = (amount: number): { subtotal: number; vat: number; total: number } => {
  const vat = amount * 0.16;
  return {
    subtotal: Math.round(amount * 100) / 100,
    vat: Math.round(vat * 100) / 100,
    total: Math.round((amount + vat) * 100) / 100,
  };
};

/**
 * Initiate an M-Pesa STK Push payment.
 * In mock mode: calls local mock server.
 * In production: calls your backend which calls Daraja.
 */
export const initiateStkPush = async (request: StkPushRequest): Promise<StkPushResponse> => {
  try {
    const normalizedPhone = normalizeKenyanPhone(request.phone);
    const response = await api.post('/mpesa/stkpush', {
      phone: normalizedPhone,
      amount: request.amount,
      orderId: request.orderId,
    });
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.error || error.message || 'STK Push failed',
    };
  }
};

/**
 * Query the status of an STK Push request.
 * Poll this every 3 seconds until ResultCode is returned.
 */
export const queryStkStatus = async (checkoutRequestId: string): Promise<StkQueryResponse> => {
  try {
    const response = await api.post('/mpesa/stkquery', { checkoutRequestId });
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.error || error.message || 'STK query failed',
    };
  }
};

/**
 * Full STK Push flow with polling.
 * Initiates the push, then polls every 3s for up to 60s.
 *
 * @param request - Phone, amount, and order ID
 * @param onStatusUpdate - Callback for status messages (e.g. "Waiting for PIN...")
 * @returns Final result with M-Pesa receipt number or error
 */
export const processMpesaPayment = async (
  request: StkPushRequest,
  onStatusUpdate?: (message: string) => void
): Promise<{ success: boolean; mpesaRef?: string; error?: string }> => {
  onStatusUpdate?.('Sending payment request to your phone...');

  const pushResult = await initiateStkPush(request);
  if (!pushResult.success || !pushResult.CheckoutRequestID) {
    return { success: false, error: pushResult.error || 'Failed to initiate payment' };
  }

  onStatusUpdate?.(pushResult.CustomerMessage || 'Enter your M-Pesa PIN on your phone');

  // Poll for result — max 20 attempts × 3s = 60s timeout
  const MAX_POLLS = 20;
  const POLL_INTERVAL_MS = 3000;

  for (let i = 0; i < MAX_POLLS; i++) {
    await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS));
    onStatusUpdate?.(`Waiting for confirmation... (${i + 1}/${MAX_POLLS})`);

    const queryResult = await queryStkStatus(pushResult.CheckoutRequestID);

    if (queryResult.ResultCode === '0') {
      onStatusUpdate?.('Payment confirmed!');
      return { success: true, mpesaRef: queryResult.MpesaReceiptNumber };
    }

    if (queryResult.ResultCode && queryResult.ResultCode !== '0') {
      return { success: false, error: queryResult.ResultDesc || 'Payment failed or cancelled' };
    }
  }

  return { success: false, error: 'Payment timeout — please try again' };
};
