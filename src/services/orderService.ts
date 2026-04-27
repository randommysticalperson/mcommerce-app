import api from './api';
import { Order, CartItem, Address, PaymentMethod } from '../types';

interface PlaceOrderData {
  items: CartItem[];
  paymentMethod: PaymentMethod;
  shippingAddress: Address;
}

export const orderService = {
  /**
   * Fetch all orders for the currently authenticated user.
   */
  getOrders: async (): Promise<Order[]> => {
    const response = await api.get<Order[]>('/orders');
    return response.data;
  },

  /**
   * Fetch a single order by its ID.
   */
  getOrderById: async (orderId: string): Promise<Order> => {
    const response = await api.get<Order>(`/orders/${orderId}`);
    return response.data;
  },

  /**
   * Place a new order.
   */
  placeOrder: async (orderData: PlaceOrderData): Promise<Order> => {
    const response = await api.post<Order>('/orders', orderData);
    return response.data;
  },

  /**
   * Cancel an existing order.
   */
  cancelOrder: async (orderId: string): Promise<Order> => {
    const response = await api.patch<Order>(`/orders/${orderId}/cancel`);
    return response.data;
  },
};

// ============================================================
// Payment Service
// ============================================================

export const paymentService = {
  /**
   * Initiate an M-Pesa STK Push payment via the Daraja API.
   */
  initiateMpesaPayment: async (params: {
    orderId: string;
    phone: string;
    amount: number;
  }): Promise<{ checkoutRequestId: string }> => {
    const response = await api.post('/payments/mpesa/stkpush', params);
    return response.data;
  },

  /**
   * Check the status of an M-Pesa payment.
   */
  checkMpesaStatus: async (
    checkoutRequestId: string
  ): Promise<{ status: 'pending' | 'success' | 'failed' }> => {
    const response = await api.get(`/payments/mpesa/status/${checkoutRequestId}`);
    return response.data;
  },

  /**
   * Initiate a card payment via Stripe.
   */
  initiateCardPayment: async (params: {
    orderId: string;
    amount: number;
    currency: string;
  }): Promise<{ clientSecret: string }> => {
    const response = await api.post('/payments/stripe/intent', params);
    return response.data;
  },
};
