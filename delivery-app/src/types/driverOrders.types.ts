import { Ionicons } from '@expo/vector-icons';

// Superset of the Home screen's DeliveryStatus — adds 'cancelled' explicitly
// (the Home screen casts raw 'cancelled' through `as DeliveryStatus` without
// it being in that union; here it's a first-class value instead).
export type OrderStatus =
  | 'pending'
  | 'assigned'
  | 'picked_up'
  | 'in_progress'
  | 'delivered'
  | 'cancelled'
  | 'failed';

export type OrderFilterKey = 'all' | 'pending' | 'picked_up' | 'in_progress' | 'delivered' | 'cancelled';

export interface OrderCardData {
  id: string;
  orderId: string;
  status: OrderStatus;
  customerName: string;
  phone: string;
  pickupAddress: string;
  dropAddress: string;
  amount: number;
  paymentMethod: string;
  distanceKm: number | null;
  notes?: string | null;
  assignedAt?: string | null;
  pickedUpAt?: string | null;
  deliveredAt?: string | null;
  cancelledAt?: string | null;
}

export interface OrderSummaryItem {
  key: OrderFilterKey;
  label: string;
  count: number;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  bgColor: string;
}