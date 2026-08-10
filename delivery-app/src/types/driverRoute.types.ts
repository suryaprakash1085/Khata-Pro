// ── Route Screen types ──────────────────────────────────────────────────
// Mirrors the shape/conventions of driverHome.types.ts and
// driverOrders.types.ts so the three screens stay consistent.

export type RouteStopType = 'pickup' | 'delivery';
export type RouteStopState = 'completed' | 'current' | 'upcoming';

export interface RouteStop {
  id: string; // `${orderId}-pickup` | `${orderId}-delivery`
  stopNumber: number;
  type: RouteStopType;
  state: RouteStopState;
  orderId: string; // display id, e.g. "#DEL-1024"
  rawOrderId: string; // underlying delivery id, for API calls
  customerName: string;
  phone: string;
  address: string;
  distanceKm: number | null;
  etaMinutes: number | null;
  amount: number;
  paymentMethod: string;
  completedAt?: string | null;
  assignedAt?: string | null;
}

export interface RouteSummaryData {
  totalStops: number;
  completedStops: number;
  remainingStops: number;
  totalDistanceKm: number;
  completedDistanceKm: number;
  remainingDistanceKm: number;
  progress: number; // 0..1, safe (0 when no stops)
}

export interface RouteSummaryItem {
  key: string;
  label: string;
  value: string;
  icon: string;
  color: string;
  bgColor: string;
}

export type RouteAlertType = 'cancelled' | 'delayed' | 'updated' | 'added' | 'changed';

export interface RouteAlertItem {
  id: string;
  type: RouteAlertType;
  message: string;
  time: string;
}