export type DeliveryStatus =
  | 'pending'
  | 'assigned'
  | 'picked_up'
  | 'in_progress'
  | 'delivered'
  | 'failed';

export type PaymentMethod = 'COD' | 'Online' | 'Card';

export interface DriverProfile {
  id: string;
  name: string;
  driverId: string;
  avatarUrl?: string;
  rating: number;
  isOnline: boolean;
}

export interface SummaryStats {
  totalDeliveries: number;
  completedDeliveries: number;
  pendingDeliveries: number;
  cashToCollect: number;
  distanceTravelledKm: number;
  rating: number;
}

export interface QuickActionItem {
  id: string;
  label: string;
  icon: string;
  color: string;
  bgColor: string;
}

export interface DeliveryOrder {
  id: string;
  orderId: string;
  customerName: string;
  phone: string;
  address: string;
  paymentMethod: PaymentMethod;
  amount: number;
  status: DeliveryStatus;
}

export interface InProgressDelivery {
  orderId: string;
  customerName: string;
  phone: string;
  eta: string;
  distanceKm: number;
  progress: number; // 0 to 1
}

export interface ScheduleEntry {
  id: string;
  time: string;
  customerName: string;
  orderId: string;
  status: DeliveryStatus;
}

export interface PerformanceStats {
  successRate: number; // 0-100
  avgDeliveryTimeMinutes: number;
  completedOrders: number;
  customerRating: number; // 0-5
}

export type NotificationType =
  | 'assigned'
  | 'completed'
  | 'address_updated'
  | 'payment_received'
  | 'order_confirmed';

export interface NotificationEntry {
  id: string;
  type: NotificationType;
  message: string;
  time: string;
}

export interface EarningsSummary {
  todayEarnings: number;
  codCollected: number;
  incentives: number;
  weeklyEarnings: number;
}