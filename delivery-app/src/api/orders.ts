
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
export interface CustomerOrderItem {
  id: number;
  product_id: number;
  product_name: string;
  qty: number;
  unit_price: number;
}

export interface CustomerOrder {
  id: number;
  business_id: number;
  business_name?: string | null; 
  customer_id: number;
  amount: number;
  tax?: number | null;
  discount?: number | null;
  delivery_fee?: number | null;
  delivery_distance_km?: number | null;
  promo_code?: string | null;
  entry_date: string;
  created_at?: string;
  sales_order_status: string;
  delivery_status: string | null;
  tracking_status: CustomerTrackingStatus;
  tracking_steps: readonly string[];
  items: CustomerOrderItem[];
  delivery: CustomerOrderDelivery | null;
store_name?: string;
description?: string;

return_request?: { id: number; status: 'REQUESTED' | 'APPROVED' | 'REJECTED'; reason: string } | null;

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

  requestReturn: (orderId: number, payload: { reason: ReturnReason; description?: string }): Promise<any> =>
  apiClient.post(`/customers/me/orders/${orderId}/return`, payload) as unknown as Promise<any>,
};

export type ReturnReason = 'EXPIRED_PRODUCT' | 'WRONG_PRODUCT' | 'DAMAGED' | 'MISSING_ITEM' | 'OTHER';


