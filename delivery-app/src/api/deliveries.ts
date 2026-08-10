/**
 * deliveries.ts
 * -----------------------------------------------------------------------
 * khata-mobile api-server /deliveries endpoints, built on top of the
 * existing apiClient (src/api/client.ts) — same base URL, same JWT
 * interceptor, same error normalization. No separate client needed.
 *
 * NOTE: apiClient's response interceptor already unwraps to response.data,
 * so these functions resolve directly to the JSON body — not an axios
 * response object.
 * -----------------------------------------------------------------------
 */
import apiClient from './client';

/** Matches formatDelivery() in api-server/src/routes/deliveries.ts exactly */
export interface Delivery {
  id: number;
  business_id: number;
  customer_id: number;
  driver_id: number | null;
  pickup_address: string;
  drop_address: string;
  status: 'pending' | 'assigned' | 'picked_up' | 'delivered' | 'cancelled';
  notes: string | null;
  assigned_at: string | null;
  picked_up_at: string | null;
  delivered_at: string | null;
  cancelled_at: string | null;
  created_at: string;
}

export interface PaginatedDeliveries {
  data: Delivery[];
  total: number;
  page: number;
  limit: number;
}

export const deliveriesApi = {
  /**
   * List deliveries. business_id is required by the backend.
   * Pass driver_id (current logged-in driver's user id) to scope to "my deliveries".
   */
  getDeliveries: (params: {
    business_id: number;
    driver_id?: number;
    status?: Delivery['status'];
    page?: number;
    limit?: number;
  }) =>
    apiClient.get('/deliveries', { params }) as unknown as Promise<PaginatedDeliveries>,

  getDeliveryById: (id: number) =>
    apiClient.get(`/deliveries/${id}`) as unknown as Promise<Delivery>,

  /** Driver progresses a delivery: picked_up -> delivered (or cancelled) */
  updateDeliveryStatus: (id: number, status: Delivery['status']) =>
    apiClient.put(`/deliveries/${id}/status`, { status }) as unknown as Promise<Delivery>,
};