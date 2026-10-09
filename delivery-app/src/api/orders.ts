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

export type ReturnMediaType = 'photo' | 'video';

/** What the Return modal sends to the server after the files are uploaded */
export interface ReturnMediaInput {
  type: ReturnMediaType;
  url: string;
}

/** A picked (not yet uploaded) file — shape matches PickedMedia in pickMedia.ts */
export interface ReturnMediaFile {
  kind: ReturnMediaType;
  uri: string;
  name: string;
  mimeType: string;
  file?: any; // web only (File object)
}

export interface RequestReturnPayload {
  product_ids: number[];
  reason: ReturnReason;
  description?: string;
  media: ReturnMediaInput[];
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
  status: 'REQUESTED' | 'APPROVED' | 'REJECTED' | 'REPLACEMENT_SENT';
  reason: string;
  admin_note?: string | null;
  items?: { product_id: number; product_name: string; qty: number; status?: string }[];
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

export interface RequestReturnResponse {
  data: { id: number; status: string; reason: string }[];
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
   * Upload one photo/video (multipart). Returns the public URL.
   * Called once per file by the Return modal BEFORE requestReturn.
   */
  uploadReturnMedia: (media: ReturnMediaFile): Promise<{ type: ReturnMediaType; url: string }> => {
    const form = new FormData();
    if (Platform.OS === 'web') {
      form.append('file', media.file as Blob, media.name);
    } else {
      form.append('file', { uri: media.uri, name: media.name, type: media.mimeType } as any);
    }
    return apiClient.post('/customers/me/uploads', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 120000, // videos can be up to 50 MB
    }) as unknown as Promise<{ type: ReturnMediaType; url: string }>;
  },

  /** Request a return for a delivered order (24h window, photo + video required) */
  requestReturn: (orderId: number, payload: RequestReturnPayload): Promise<RequestReturnResponse> =>
    apiClient.post(`/customers/me/orders/${orderId}/return`, payload) as unknown as Promise<RequestReturnResponse>,
};