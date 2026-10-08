import { Platform } from 'react-native';
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

export type ReturnReason =
  | 'EXPIRED_PRODUCT'
  | 'WRONG_PRODUCT'
  | 'DAMAGED'
  | 'MISSING_ITEM'
  | 'OTHER';

export type ReturnStatus = 'REQUESTED' | 'APPROVED' | 'REJECTED' | 'REPLACEMENT_SENT';

export interface ReturnItemInput {
  product_id: number;
  qty: number;
}

export interface ReturnMediaInput {
  type: 'photo' | 'video';
  url: string;
}

/** What the picker gives us (see screens/main/pickMedia.ts) */
export interface UploadableMedia {
  kind: 'photo' | 'video';
  uri: string;
  name: string;
  mimeType: string;
  file?: any; // web: File object
}

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

export interface CustomerOrderReturnRequest {
  id: number;
  status: ReturnStatus;
  reason: string;
  items?: { product_id: number; product_name: string; qty: number }[];
}

/** One return row, as returned by GET /customers/me/order-returns */
export interface CustomerReturn {
  id: number;
  sales_order_id: number;
  product_id: number;
  product_name: string;
  qty: number;
  reason: ReturnReason;
  description: string | null;
  status: ReturnStatus;
  admin_note: string | null;
  replacement_delivery_id: number | null;
  replacement_sent_at: string | null;
  media: { id: number; type: 'photo' | 'video'; url: string }[];
  created_at: string;
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
  return_request?: CustomerOrderReturnRequest | null;
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

  /** Single order tracking detail — used by OrderTrackingScreen and the Return modal (has items) */
  getOrderTracking: (orderId: number): Promise<CustomerOrder> =>
    apiClient.get(`/customers/me/orders/${orderId}/tracking`) as unknown as Promise<CustomerOrder>,

  /** Cancel a pending order — used by OrdersScreen's Cancel button */
  cancelOrder: (orderId: number): Promise<CancelOrderResponse> =>
    apiClient.put(`/customers/me/orders/${orderId}/cancel`) as unknown as Promise<CancelOrderResponse>,

  /**
   * Upload one photo/video (multipart) -> returns its public URL.
   * Used by the Return modal; the returned url goes into requestReturn({ media }).
   */
  uploadReturnMedia: async (
    media: UploadableMedia,
  ): Promise<{ type: 'photo' | 'video'; url: string }> => {
    const form = new FormData();
    if (Platform.OS === 'web' && media.file) {
      form.append('file', media.file, media.name);
    } else {
      form.append('file', { uri: media.uri, name: media.name, type: media.mimeType } as any);
    }

    const body: any = await apiClient.post('/customers/me/uploads', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 120000, // videos can be big on slow networks
      transformRequest: (data: any) => data, // never let axios turn FormData into JSON
    });

    // Works whether the client unwraps response.data or not
    const url = body?.url ?? body?.data?.url;
    const type = body?.type ?? body?.data?.type ?? media.kind;
    if (!url) throw new Error('Upload failed. Please try again.');
    return { type, url };
  },

  /**
   * Request a return for a delivered order (within 24h of delivery).
   * Photo + video are mandatory (upload them first with uploadReturnMedia).
   */
  requestReturn: (
    orderId: number,
    payload: {
      product_ids: number[];
      reason: ReturnReason;
      description?: string;
      media: ReturnMediaInput[];
    },
  ): Promise<{ data: { id: number; status: ReturnStatus; reason: string }[] }> =>
    apiClient.post(`/customers/me/orders/${orderId}/return`, payload) as unknown as Promise<{
      data: { id: number; status: ReturnStatus; reason: string }[];
    }>,

  /** Customer's own return requests with status / admin note / replacement info */
  getMyReturns: (): Promise<{ data: CustomerReturn[] }> =>
    apiClient.get('/customers/me/order-returns') as unknown as Promise<{ data: CustomerReturn[] }>,
};