
import apiClient from './client';

export const CUSTOMER_TRACKING_STEPS = [
  'ORDER_PLACED',
  'ORDER_CONFIRMED',
  'DRIVER_ASSIGNED',
  'PICKED_UP',
  'OUT_FOR_DELIVERY',
  'DELIVERED',
] as const;

export type CustomerTrackingStatus = typeof CUSTOMER_TRACKING_STEPS[number] | 'CANCELLED';

export interface CustomerOrderDelivery {
  id: number;
  driver_id: number | null;
  driver_name: string | null;
  driver_phone: string | null;
  pickup_address: string;
  drop_address: string;
  assigned_at: string | null;
  picked_up_at: string | null;
  delivered_at: string | null;
}

export interface CustomerOrder {
  id: number;
  business_id: number;
  customer_id: number;
  amount: number;
  entry_date: string;
  sales_order_status: string;
  delivery_status: string | null;
  tracking_status: CustomerTrackingStatus;
  tracking_steps: readonly string[];
  delivery: CustomerOrderDelivery | null;
}

export interface CancelOrderResponse {
  data: {
    id: number;
    status: string;
  };
}

export const ordersApi = {
  /** Customer's own order list — used by OrdersScreen */
  getMyOrders: (): Promise<{ data: CustomerOrder[] }> =>
    apiClient.get('/customers/me/orders') as unknown as Promise<{ data: CustomerOrder[] }>,

  /** Single order tracking detail — used by OrderTrackingScreen */
  getOrderTracking: (orderId: number): Promise<CustomerOrder> =>
    apiClient.get(`/customers/me/orders/${orderId}/tracking`) as unknown as Promise<CustomerOrder>,

  /** Cancel a pending order — used by OrdersScreen's Cancel button */
  cancelOrder: (orderId: number): Promise<CancelOrderResponse> =>
    apiClient.put(`/customers/me/orders/${orderId}/cancel`) as unknown as Promise<CancelOrderResponse>,
};