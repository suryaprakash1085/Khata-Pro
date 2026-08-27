
import React, { useContext, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  FlatList,
  TextInput,
  Alert,
  ActivityIndicator,
  Platform,
  Linking,
  RefreshControl,
  useWindowDimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { DriverAuthContext } from '../../context/DriverAuthContext';
import { COLORS } from '../../components/driver/DriverHomeComponents';
import { DriverWebShell, DriverShellTab } from '../../components/driver/DriverWebShell';
import { OrderCardData, OrderFilterKey, OrderStatus } from '../../types/driverOrders.types';
import { OrderSummaryCard, OrderFilterTabs, OrderCard } from '../../components/driver/DriverOrdersComponents';

// ── Orval-generated hooks ────────────────────────────────────────────────
import {
  useListMyDeliveries,
  useUpdateDriver,
  useListNotifications,
  useRejectDelivery,
} from '@workspace/api-client-react';
import { useCallDeliveryCustomer } from '@workspace/api-client-react';


import { getDriverToken } from '../../utils/storage';

const FONT_FAMILY = Platform.select({
  web: '"Times New Roman", Times, serif',
  default: 'Times New Roman',
});
const webNoOutlineStyle = (Platform.OS === 'web' ? { outlineStyle: 'none' } : {}) as any;
const TypedFlatList = FlatList as unknown as React.ComponentType<any>;

// Extra color used only for the "Picked Up" status pill — not part of the
// shared COLORS palette yet, so it's kept local instead of touching the
// shared design-system file.
const PICKUP_BLUE = '#2563EB';
const PICKUP_BLUE_LIGHT = '#DBEAFE';

const ACTIVE_TAB = 'orders';

interface ApiDelivery {
  id: number;
  business_id: number;
  customer_id: number;
  driver_id: number | null;
  pickup_address: string;
  drop_address: string;
  status: string;
  notes?: string | null;
  amount?: number | null;
  payment_method?: string | null;
  distance_km?: number | null;
  assigned_at?: string | null;
  accepted_at?: string | null;
  picked_up_at?: string | null;
  delivered_at?: string | null;
  cancelled_at?: string | null;
  created_at: string;
<<<<<<< HEAD
  customer_name?: string;
  customer_phone?: string;
  out_for_delivery_at?: string | null;
  order_number?: string | number | null;
  customer_has_phone?: boolean;
=======
  customer_name?: string | null;
  customer_has_phone?: boolean; 
  order_number?: string | null;
  sales_order_id?: number | null;
  customer_phone?: string;
  out_for_delivery_at?: string | null;
>>>>>>> 26841bfa2b2b0e92eefdd1c4fa082340002355e0
}



function mapStatus(status: string): OrderStatus {
  // if (status === 'in_transit') return 'in_progress';
  return status as OrderStatus;
}

function timeAgo(iso?: string | null) {
  if (!iso) return '';
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.max(0, Math.round(diffMs / 60000));
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs} hr${hrs > 1 ? 's' : ''} ago`;
  const days = Math.round(hrs / 24);
  return `${days} day${days > 1 ? 's' : ''} ago`;
}

function formatDateTime(iso?: string | null) {
  if (!iso) return '—';
  const d = new Date(iso);
  const date = d.toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' });
  const time = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  return `${date} • ${time}`;
}

function initials(name?: string) {
  if (!name) return '?';
  return name.trim().split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase();
}

function showAlert(title: string, message?: string) {
  if (Platform.OS === 'web') {
    // eslint-disable-next-line no-alert
    window.alert(message ? `${title}\n\n${message}` : title);
  } else {
    Alert.alert(title, message);
  }
}

// Which "step" a card is on determines badge label/colour. Rejection reason
// is only ever collected for a brand-new, not-yet-accepted assignment.
function statusMeta(status: OrderStatus) {
  switch (status) {
    case 'pending':
    case 'assigned':
      return { label: 'NEW ASSIGNMENT', bg: COLORS.amberLight, fg: COLORS.amber, outline: false };
    case 'in_progress':
      return { label: 'OUT FOR DELIVERY', bg: COLORS.amberLight, fg: COLORS.amber, outline: false };
    case 'picked_up':
      return { label: 'PICKED UP', bg: PICKUP_BLUE_LIGHT, fg: PICKUP_BLUE, outline: false };
    case 'delivered':
      return { label: 'DELIVERED', bg: COLORS.secondaryLight, fg: COLORS.secondary, outline: false };
    case 'cancelled':
    case 'failed':
      return { label: 'CANCELLED', bg: '#FFFFFF', fg: COLORS.danger, outline: true };
    default:
      return { label: String(status).toUpperCase(), bg: COLORS.bg, fg: COLORS.slate, outline: false };
  }
}

const FILTERS: { key: OrderFilterKey; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'pending', label: 'New' },
  { key: 'picked_up', label: 'Active' },
  { key: 'delivered', label: 'Completed' },
  { key: 'cancelled', label: 'Cancelled' },
];

const PAYMENT_FILTERS: { key: 'all' | 'cod' | 'upi'; label: string }[] = [
  { key: 'all', label: 'All Payments' },
  { key: 'cod', label: 'Cash on Delivery' },
  { key: 'upi', label: 'Online / UPI' },
];

// ────────────────────────────────────────────────────────────────────────
// Wide-web horizontal row — mirrors the reference design 1:1.
// ────────────────────────────────────────────────────────────────────────
const OrderRowWide: React.FC<{
  order: OrderCardData;
  isRejecting: boolean;
  rejecting: boolean;
  rejectReason: string;
  onRejectReasonChange: (v: string) => void;
  onStartReject: () => void;
  onCancelReject: () => void;
  onConfirmReject: () => void;
  onOpen: () => void;
  onCall: () => void;
  onNavigate: () => void;
}> = ({
  order,
  isRejecting,
  rejecting,
  rejectReason,
  onRejectReasonChange,
  onStartReject,
  onCancelReject,
  onConfirmReject,
  onOpen,
  onCall,
  onNavigate,
}) => {
  const meta = statusMeta(order.status);
  const isNew = order.status === 'assigned' || order.status === 'pending';
  const isTerminal = order.status === 'delivered' || order.status === 'cancelled' || order.status === 'failed';
  const isCod = order.paymentMethod?.toUpperCase() !== 'UPI' && order.paymentMethod?.toUpperCase() !== 'ONLINE';

  return (
    <View style={styles.rowCard}>
      <View style={styles.rowMain}>
        {/* Left: status + order meta */}
        <View style={styles.rowColOrder}>
          <View style={[styles.statusPill, { backgroundColor: meta.bg }, meta.outline && styles.statusPillOutline]}>
            <Text style={[styles.statusPillText, { color: meta.fg }]}>{meta.label}</Text>
          </View>
          <Text style={styles.rowOrderId}>Order {order.orderId}</Text>
          <Text style={styles.rowOrderDate}>{formatDateTime(order.assignedAt)}</Text>
        </View>

        {/* Middle: customer */}
        <View style={styles.rowColCustomer}>
          <View style={styles.rowCustomerAvatar}>
            <Text style={styles.rowCustomerAvatarText}>{initials(order.customerName)}</Text>
          </View>
          <View style={{ flex: 1, minWidth: 0 }}>
            <Text style={styles.rowCustomerName}>{order.customerName}</Text>
            <TouchableOpacity onPress={onCall} disabled={!order.phone} hitSlop={4} style={webNoOutlineStyle}>
              <Text style={[styles.rowCustomerMeta, !!order.phone && styles.rowCustomerPhoneLink]}>{order.phone || '—'}</Text>
            </TouchableOpacity>
            <Text style={styles.rowCustomerMeta} numberOfLines={1}>{order.dropAddress}</Text>
          </View>
        </View>

        {/* Right: distance / amount / payment / time */}
        <View style={styles.rowColStat}>
          <Text style={styles.rowStatValue}>{order.distanceKm != null ? `${order.distanceKm} km` : '—'}</Text>
          <Text style={styles.rowStatLabel}>Distance</Text>
        </View>
        <View style={styles.rowColStat}>
          <Text style={styles.rowStatValue}>₹{order.amount.toFixed(2)}</Text>
          <Text style={styles.rowStatLabel}>Order Amount</Text>
        </View>
        <View style={styles.rowColStat}>
          <View style={[styles.paymentPill, isCod ? styles.paymentPillCod : styles.paymentPillUpi]}>
            <Text style={[styles.paymentPillText, { color: isCod ? COLORS.amber : PICKUP_BLUE }]}>
              {isCod ? 'COD' : 'UPI'}
            </Text>
          </View>
          <Text style={styles.rowStatLabel}>{isCod ? 'Cash on Delivery' : 'Online Payment'}</Text>
        </View>
        <View style={styles.rowColStat}>
          <Text style={styles.rowStatValue}>{timeAgo(order.assignedAt)}</Text>
          <Text style={styles.rowStatLabel}>{isNew ? 'Assigned' : (order.status === 'picked_up' ? 'Picked Up' : 'Updated')}</Text>
        </View>

        {/* Far right: actions */}
        <View style={styles.rowColActions}>
          {isNew && !isRejecting && (
            <TouchableOpacity style={[styles.rejectBtn, webNoOutlineStyle]} onPress={onStartReject} disabled={rejecting}>
              <Text style={styles.rejectBtnText}>Reject</Text>
            </TouchableOpacity>
          )}
          {!isTerminal && (
            <TouchableOpacity style={[styles.viewDetailsBtnWide, webNoOutlineStyle]} onPress={onOpen}>
              <Text style={styles.viewDetailsBtnText}>View Details</Text>
              <Ionicons name="chevron-forward" size={14} color="#FFFFFF" />
            </TouchableOpacity>
          )}
          {isTerminal && (
            <TouchableOpacity style={[styles.viewDetailsOutlineBtn, webNoOutlineStyle]} onPress={onOpen}>
              <Text style={styles.viewDetailsOutlineBtnText}>View Details</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {isNew && isRejecting && (
        <View style={styles.rejectPanel}>
          <TextInput
            style={styles.rejectInput}
            placeholder="Reason for rejecting (required)"
            placeholderTextColor={COLORS.slateLight}
            value={rejectReason}
            onChangeText={onRejectReasonChange}
          />
          <TouchableOpacity style={[styles.secondaryBtnSmall, webNoOutlineStyle]} onPress={onCancelReject} disabled={rejecting}>
            <Text style={styles.secondaryBtnSmallText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.dangerBtnSmall, webNoOutlineStyle]} onPress={onConfirmReject} disabled={rejecting}>
            {rejecting ? <ActivityIndicator color="#fff" size="small" /> : <Text style={styles.dangerBtnSmallText}>Confirm Reject</Text>}
          </TouchableOpacity>
        </View>
      )}

    </View>
  );
};

// ────────────────────────────────────────────────────────────────────────
// Mobile / narrow-web vertical card.
// ────────────────────────────────────────────────────────────────────────
const OrderCardMobile: React.FC<{
  order: OrderCardData;
  isRejecting: boolean;
  rejecting: boolean;
  rejectReason: string;
  onRejectReasonChange: (v: string) => void;
  onStartReject: () => void;
  onCancelReject: () => void;
  onConfirmReject: () => void;
  onOpen: () => void;
  onCall: () => void;
  onNavigate: () => void;
}> = ({
  order,
  isRejecting,
  rejecting,
  rejectReason,
  onRejectReasonChange,
  onStartReject,
  onCancelReject,
  onConfirmReject,
  onOpen,
  onCall,
  onNavigate,
}) => {
  const meta = statusMeta(order.status);
  const isNew = order.status === 'assigned' || order.status === 'pending';
  const isTerminal = order.status === 'delivered' || order.status === 'cancelled' || order.status === 'failed';

  return (
    <TouchableOpacity style={[styles.mobileCard, webNoOutlineStyle]} activeOpacity={0.85} onPress={onOpen}>
      <View style={[styles.statusPill, { backgroundColor: meta.bg, alignSelf: 'flex-start' }, meta.outline && styles.statusPillOutline]}>
        <Text style={[styles.statusPillText, { color: meta.fg }]}>{meta.label}</Text>
      </View>

      <View style={styles.mobileTopRow}>
        <Text style={styles.mobileOrderId}>Order {order.orderId}</Text>
        <Text style={styles.mobileOrderDate}>{timeAgo(order.assignedAt)}</Text>
      </View>
      <Text style={styles.mobileOrderDate}>{formatDateTime(order.assignedAt)}</Text>

      <Text style={styles.mobileCustomerName}>{order.customerName}</Text>
      <View style={styles.metaRow}>
        <Ionicons name="call-outline" size={12.5} color={COLORS.slate} />
        <Text style={styles.metaText}>{order.phone || '—'}</Text>
      </View>
      <View style={styles.metaRow}>
        <Ionicons name="location-outline" size={12.5} color={COLORS.slate} />
        <Text style={styles.metaText} numberOfLines={1}>{order.dropAddress}</Text>
      </View>

      <View style={styles.mobileStatsRow}>
        <View>
          <Text style={styles.rowStatValue}>{order.distanceKm != null ? `${order.distanceKm} km` : '—'}</Text>
          <Text style={styles.rowStatLabel}>Distance</Text>
        </View>
        <View>
          <Text style={styles.rowStatValue}>₹{order.amount.toFixed(2)}</Text>
          <Text style={styles.rowStatLabel}>Amount</Text>
        </View>
        <Text style={styles.mobilePaymentText}>{order.paymentMethod}</Text>
      </View>

      {isNew && !isRejecting && (
        <View style={styles.mobileBtnRow}>
          <TouchableOpacity style={[styles.rejectBtn, { flex: 1 }, webNoOutlineStyle]} onPress={onStartReject}>
            <Text style={styles.rejectBtnText}>Reject</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.viewDetailsBtnWide, { flex: 1 }, webNoOutlineStyle]} onPress={onOpen}>
            <Text style={styles.viewDetailsBtnText}>View Details</Text>
          </TouchableOpacity>
        </View>
      )}

      {isNew && isRejecting && (
        <View style={{ marginTop: 10 }}>
          <TextInput
            style={styles.rejectInputMobile}
            placeholder="Reason for rejecting (required)"
            placeholderTextColor={COLORS.slateLight}
            value={rejectReason}
            onChangeText={onRejectReasonChange}
          />
          <View style={styles.mobileBtnRow}>
            <TouchableOpacity style={[styles.secondaryBtnSmall, { flex: 1 }, webNoOutlineStyle]} onPress={onCancelReject} disabled={rejecting}>
              <Text style={styles.secondaryBtnSmallText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.dangerBtnSmall, { flex: 1 }, webNoOutlineStyle]} onPress={onConfirmReject} disabled={rejecting}>
              {rejecting ? <ActivityIndicator color="#fff" size="small" /> : <Text style={styles.dangerBtnSmallText}>Confirm</Text>}
            </TouchableOpacity>
          </View>
        </View>
      )}

      {!isNew && !isTerminal && (
        <View style={styles.mobileBtnRow}>
          <TouchableOpacity style={[styles.iconOnlyBtn, webNoOutlineStyle]} onPress={onCall} hitSlop={6}>
            <Ionicons name="call-outline" size={15} color={COLORS.primary} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.iconOnlyBtn, webNoOutlineStyle]} onPress={onNavigate} hitSlop={6}>
            <Ionicons name="navigate-outline" size={15} color={COLORS.primary} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.viewDetailsBtnWide, { flex: 1 }, webNoOutlineStyle]} onPress={onOpen}>
            <Text style={styles.viewDetailsBtnText}>View Details</Text>
            <Ionicons name="chevron-forward" size={14} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      )}

      {isTerminal && (
        <TouchableOpacity style={[styles.viewDetailsOutlineBtn, styles.mobileFullWidthBtn, webNoOutlineStyle]} onPress={onOpen}>
          <Text style={styles.viewDetailsOutlineBtnText}>View Details</Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};

const EmptyOrdersState: React.FC<{ message: string }> = ({ message }) => (
  <View style={styles.emptyWrap}>
    <Ionicons name="file-tray-outline" size={40} color={COLORS.slateLight} />
    <Text style={styles.emptyTitle}>No orders found</Text>
    <Text style={styles.emptyText}>{message}</Text>
  </View>
);

// API base — mirrors the same default used elsewhere in the app.
const API_BASE = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';

const DriverOrdersScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { driver: authDriver } = useContext(DriverAuthContext) as any;
  const driverId = authDriver?.id;
  const businessId = authDriver?.business_id;

  const { width } = useWindowDimensions();
  const isWideWeb = Platform.OS === 'web' && width >= 1000;

  const [activeFilter, setActiveFilter] = useState<OrderFilterKey>('all');
<<<<<<< HEAD
  const [paymentFilter, setPaymentFilter] = useState<'all' | 'cod' | 'upi'>('all');
  const [search, setSearch] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [markingOutForDeliveryId, setMarkingOutForDeliveryId] = useState<string | null>(null);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
=======
  const [search, setSearch] = useState('');
  const [isOnline, setIsOnline] = useState<boolean>(authDriver?.status === 'available');
  const [showFilters, setShowFilters] = useState(false);
  const [paymentFilter, setPaymentFilter] = useState<'all' | 'cod' | 'upi'>('all');
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [markingOutForDeliveryId, setMarkingOutForDeliveryId] = useState<string | null>(null);
>>>>>>> 26841bfa2b2b0e92eefdd1c4fa082340002355e0

  const {
    data: deliveriesResponse,
    isLoading,
    isFetching,
    refetch: refetchDeliveries,
  } = useListMyDeliveries(
    { limit: 50 },
    { query: { enabled: !!driverId } }
  );
  const { data: notificationsData } = useListNotifications(
    { driver_id: driverId, limit: 8 },
    { query: { enabled: !!driverId && isWideWeb } }
  );

  
  const rejectDelivery = useRejectDelivery();

  const notificationsCount = Array.isArray(notificationsData)
    ? notificationsData.length
    : ((notificationsData as any)?.data?.length ?? 0);

  // ── Derived view data ──────────────────────────────────────────────────
  const deliveriesPayload: any = deliveriesResponse;
  const rawDeliveries: ApiDelivery[] = Array.isArray(deliveriesPayload)
    ? deliveriesPayload
    : Array.isArray(deliveriesPayload?.data)
    ? deliveriesPayload.data
    : Array.isArray(deliveriesPayload?.data?.data)
    ? deliveriesPayload.data.data
    : [];

  const allOrders: OrderCardData[] = rawDeliveries.map((d) => ({
    id: String(d.id),
    orderId: `#${d.order_number ?? d.id}`,
    status: mapStatus(d.status),
    customerName: d.customer_name ?? 'Customer',
    phone: d.customer_has_phone ? 'On file' : '',
    pickupAddress: d.pickup_address,
    dropAddress: d.drop_address,
    amount: Number(d.amount ?? 0),
    paymentMethod: d.payment_method?.toUpperCase() ?? 'COD',
    distanceKm: d.distance_km ?? null,
    notes: d.notes,
    assignedAt: d.assigned_at ?? d.created_at,
    pickedUpAt: d.picked_up_at,
    deliveredAt: d.delivered_at,
    cancelledAt: d.cancelled_at,
    outForDeliveryAt: d.out_for_delivery_at ?? null,
  }));

  const counts = useMemo(() => {
    const c: Record<OrderFilterKey, number> = { all: allOrders.length, pending: 0, picked_up: 0, delivered: 0, cancelled: 0 } as any;
    allOrders.forEach((o) => {
      if (o.status === 'pending' || o.status === 'assigned') c.pending += 1;
      else if (o.status === 'picked_up' || o.status === 'in_progress') c.picked_up += 1;
      else if (o.status === 'delivered') c.delivered += 1;
      else if (o.status === 'cancelled' || o.status === 'failed') c.cancelled += 1;
    });
    return c;
  }, [allOrders]);

  const filteredOrders = useMemo(() => {
    let list = allOrders;
    if (activeFilter !== 'all') {
      list = list.filter((o) => {
        if (activeFilter === 'pending') return o.status === 'pending' || o.status === 'assigned';
        if (activeFilter === 'picked_up') return o.status === 'picked_up' || o.status === 'in_progress';
        if (activeFilter === 'cancelled') return o.status === 'cancelled' || o.status === 'failed';
        return o.status === activeFilter;
      });
    }
    if (paymentFilter !== 'all') {
      list = list.filter((o) => {
        const isCod = o.paymentMethod !== 'UPI' && o.paymentMethod !== 'ONLINE';
        return paymentFilter === 'cod' ? isCod : !isCod;
      });
    }
    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (o) => o.orderId.toLowerCase().includes(q) || o.customerName.toLowerCase().includes(q) || o.phone.toLowerCase().includes(q)
      );
    }
    return list;
  }, [allOrders, activeFilter, paymentFilter, search]);

  const todayLabel = new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' });
  const updateDriver = useUpdateDriver();
  const callCustomer = useCallDeliveryCustomer();

  // ── Summary items ──────────────────────────────────────────────────────
  const summaryItems = useMemo(() => {
    return [
      {
        key: 'all',
        label: 'All Orders',
        count: allOrders.length,
        icon: 'cube-outline' as const,
        color: COLORS.primary,
        bgColor: COLORS.primaryLight,
      },
      {
        key: 'pending',
        label: 'New',
        count: counts.pending || 0,
        icon: 'time-outline' as const,
        color: COLORS.amber,
        bgColor: COLORS.amberLight,
      },
      {
        key: 'picked_up',
        label: 'Active',
        count: counts.picked_up || 0,
        icon: 'bicycle-outline' as const,
        color: '#7C3AED',
        bgColor: '#EDE9FE',
      },
      {
        key: 'delivered',
        label: 'Completed',
        count: counts.delivered || 0,
        icon: 'checkmark-circle-outline' as const,
        color: COLORS.secondary,
        bgColor: COLORS.secondaryLight,
      },
      {
        key: 'cancelled',
        label: 'Cancelled',
        count: counts.cancelled || 0,
        icon: 'close-circle-outline' as const,
        color: COLORS.danger,
        bgColor: COLORS.dangerLight,
      },
    ];
  }, [allOrders, counts]);

  // ── Handlers ─────────────────────────────────────────────────────────
  const handleToggleOnline = () => {
    setIsOnline(!isOnline);
  };

  const runStatusUpdate = async (id: string, status: string) => {
    setUpdatingId(id);
    try {
      const token = await getDriverToken();
      const res = await fetch(`${API_BASE}/deliveries/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error || 'Failed to update status');
      }
      refetchDeliveries();
    } catch (err: any) {
      Alert.alert('Error', err?.message || 'Could not update status. Please try again.');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleCall = (order: OrderCardData) => {
    if (!order.phone) {
      showAlert('No phone number', 'This customer has no phone number on file.');
      return;
    }
    callCustomer.mutate(
      { id: Number(order.id) },
      {
        onSuccess: (res: any) => showAlert('Calling…', res?.data?.message ?? 'Your phone will ring shortly.'),
        onError: (err: any) => showAlert('Could not call', err?.response?.data?.error ?? 'Please try again.'),
      }
    );
  };

  const handleNavigate = (order: OrderCardData) => {
    const query = encodeURIComponent(order.dropAddress);
    Linking.openURL(`https://www.google.com/maps/dir/?api=1&destination=${query}`);
  };

  // View Details always routes to the single, already-built
  // DriverOrderDetailsScreen — accept/pickup/OTP/payment/complete all stay
  // in that one place. Reject is the only action duplicated here, since the
  // reference design calls for it directly on the list.
  const handleOpenOrder = (id: string) => navigation.navigate('DriverOrderDetails', { deliveryId: Number(id) });

  const handleStartReject = (id: string) => {
    setRejectingId(id);
    setRejectReason('');
  };
  const handleCancelReject = () => {
    setRejectingId(null);
    setRejectReason('');
  };
  const handleConfirmReject = (id: string) => {
    if (!rejectReason.trim()) {
      showAlert('Reason required', 'Please tell us why you are rejecting this delivery.');
      return;
    }
    rejectDelivery.mutate(
      { id: Number(id), data: { reason: rejectReason.trim() } },
      {
        onSuccess: () => {
          setRejectingId(null);
          setRejectReason('');
          refetchDeliveries();
        },
        onError: (err: any) => {
<<<<<<< HEAD
=======
          showAlert('Could not reject delivery', err?.response?.data?.error ?? 'Please try again.');
>>>>>>> 26841bfa2b2b0e92eefdd1c4fa082340002355e0
          setUpdatingId(null);
          const msg = err?.response?.data?.error || err?.error || 'Could not update the order. Please try again.';
          Alert.alert('Error', msg);
          refetchDeliveries(); // resync UI in case another action already changed it
        },
      }
    );
  };

<<<<<<< HEAD
=======
   const handleToggleOnline = (value: boolean) => {
    setIsOnline(value);
    if (!driverId) return;
    updateDriver.mutate({ id: driverId, data: { status: value ? 'available' : 'offline' } });
  };

  // Shared status-update helper used by pickedUp/delivered/cancelled below —
  // hits the driver's own "/my-status" route with the driver token, same
  // pattern as handleStartDelivery's out-for-delivery call.
  const runStatusUpdate = async (id: string, status: 'picked_up' | 'delivered' | 'cancelled') => {
    setUpdatingId(id);
    try {
      const token = await getDriverToken();
      const res = await fetch(`${API_BASE}/deliveries/${id}/my-status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error || 'Failed to update');
      }
      refetchDeliveries();
    } catch (err: any) {
      showAlert('Error', err?.message || 'Could not update the order. Please try again.');
    } finally {
      setUpdatingId(null);
    }
  };

>>>>>>> 26841bfa2b2b0e92eefdd1c4fa082340002355e0
  const handleMarkPickedUp = (id: string) => runStatusUpdate(id, 'picked_up');

  // ✅ FIXED — was using the customer-app apiClient (wrong token, caused
  // 401 Unauthorized). Now uses the driver's own token via getDriverToken(),
  // the same storage the Orval-generated hooks above already use successfully.
  const handleStartDelivery = async (id: string) => {
    setMarkingOutForDeliveryId(id);
    try {
      const token = await getDriverToken();
      const res = await fetch(`${API_BASE}/deliveries/${id}/my-out-for-delivery`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error || 'Failed to update');
      }
      refetchDeliveries();
    } catch (err: any) {
      showAlert('Error', err?.message || 'Could not mark as out for delivery. Please try again.');
    } finally {
      setMarkingOutForDeliveryId(null);
    }
  };

  const handleMarkDelivered = (id: string) => runStatusUpdate(id, 'delivered');
  const handleUnableToDeliver = (id: string) => runStatusUpdate(id, 'cancelled');

<<<<<<< HEAD
  const handleNavigateLegacy = (order: OrderCardData) => {
    Alert.alert('Navigate', order.dropAddress);
  };

=======
>>>>>>> 26841bfa2b2b0e92eefdd1c4fa082340002355e0
  const handleTabPress = (tab: DriverShellTab) => {
    if (tab.key === 'orders') return;
    if (tab.screen) navigation.navigate(tab.screen);
    else showAlert(tab.label, 'Coming soon');
  };

  const renderRow = (item: OrderCardData) => {
    const shared = {
      order: item,
      isRejecting: rejectingId === item.id,
      rejecting: rejectDelivery.isPending && rejectingId === item.id,
      rejectReason,
      onRejectReasonChange: setRejectReason,
      onStartReject: () => handleStartReject(item.id),
      onCancelReject: handleCancelReject,
      onConfirmReject: () => handleConfirmReject(item.id),
      onOpen: () => handleOpenOrder(item.id),
      onCall: () => handleCall(item),
      onNavigate: () => handleNavigate(item),
    };
    return isWideWeb ? <OrderRowWide {...shared} /> : <OrderCardMobile {...shared} />;
  };

  const headerBlock = (
    <View>
      <View style={isWideWeb ? styles.webHeader : styles.mobileHeader}>
        <View>
          <Text style={styles.headerTitle}>My Orders</Text>
          <Text style={styles.headerDate}>Manage all your deliveries</Text>
        </View>
        <TouchableOpacity style={[styles.refreshBtn, webNoOutlineStyle]} onPress={() => refetchDeliveries()}>
          <Ionicons name="refresh-outline" size={16} color={COLORS.ink} />
          {isWideWeb && <Text style={styles.refreshBtnText}>Refresh</Text>}
        </TouchableOpacity>
      </View>

      <View style={[styles.section, isWideWeb && styles.controlsRowWide]}>
        <TypedFlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={FILTERS}
          keyExtractor={(f: any) => f.key}
          contentContainerStyle={{ gap: 8 }}
          style={isWideWeb ? { flexGrow: 0 } : undefined}
          renderItem={({ item }: { item: (typeof FILTERS)[number] }) => {
            const active = activeFilter === item.key;
            const count = item.key === 'all' ? counts.all : (counts as any)[item.key] ?? 0;
            return (
              <TouchableOpacity
                style={[styles.filterTab, active && styles.filterTabActive, webNoOutlineStyle]}
                onPress={() => setActiveFilter(item.key)}
              >
                <Text style={[styles.filterTabText, active && styles.filterTabTextActive]}>{item.label}</Text>
                <View style={[styles.filterCountPill, active && styles.filterCountPillActive]}>
                  <Text style={[styles.filterCountText, active && styles.filterCountTextActive]}>{count}</Text>
                </View>
              </TouchableOpacity>
            );
          }}
        />

        <View style={[styles.searchBar, isWideWeb && styles.searchBarWide]}>
          <Ionicons name="search-outline" size={16} color={COLORS.slate} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by order ID, customer name or phone..."
            placeholderTextColor={COLORS.slateLight}
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')} hitSlop={8}>
              <Ionicons name="close-circle" size={18} color={COLORS.slateLight} />
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity
          style={[styles.filtersBtn, showFilters && styles.filtersBtnActive, webNoOutlineStyle]}
          onPress={() => setShowFilters((v) => !v)}
        >
          <Ionicons name="options-outline" size={15} color={showFilters ? '#FFFFFF' : COLORS.ink} />
          <Text style={[styles.filtersBtnText, showFilters && { color: '#FFFFFF' }]}>Filters</Text>
        </TouchableOpacity>
      </View>

      {showFilters && (
        <View style={[styles.section, styles.filtersPanel]}>
          <Text style={styles.filtersPanelLabel}>Payment Method</Text>
          <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
            {PAYMENT_FILTERS.map((pf) => {
              const active = paymentFilter === pf.key;
              return (
                <TouchableOpacity
                  key={pf.key}
                  style={[styles.paymentFilterChip, active && styles.paymentFilterChipActive, webNoOutlineStyle]}
                  onPress={() => setPaymentFilter(pf.key)}
                >
                  <Text style={[styles.paymentFilterChipText, active && { color: '#FFFFFF' }]}>{pf.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      )}
    </View>
  );

  const listBody = (
    <TypedFlatList
      data={filteredOrders}
      keyExtractor={(item: OrderCardData) => item.id}
      contentContainerStyle={[styles.listContent, !isWideWeb && { paddingBottom: 90 }]}
      refreshControl={<RefreshControl refreshing={!isLoading && isFetching} onRefresh={refetchDeliveries} tintColor={COLORS.primary} />}
      ListHeaderComponent={headerBlock}
      renderItem={({ item }: { item: OrderCardData }) => <View style={styles.cardWrapper}>{renderRow(item)}</View>}
      ListEmptyComponent={
        isLoading ? (
          <View style={styles.loadingWrap}>
            <ActivityIndicator size="large" color={COLORS.primary} />
          </View>
        ) : (
          <EmptyOrdersState message={search ? 'No matching deliveries found.' : 'New assigned deliveries will appear here.'} />
        )
      }
    />
  );

  if (isWideWeb) {
    return (
      <DriverWebShell
        activeTabKey="orders"
        driverName={authDriver?.name}
        driverPhone={authDriver?.phone}
        isOnline={isOnline}
        onToggleOnline={handleToggleOnline}
        notificationsCount={notificationsCount}
        onTabPress={handleTabPress}
        onNotificationsPress={() => handleTabPress({ key: 'notifications', label: 'Notifications', icon: 'notifications-outline', screen: 'DriverAlerts' })}
      >
        <View style={styles.wideListWrap}>{listBody}</View>
      </DriverWebShell>
    );
  }

  const bottomTabs: DriverShellTab[] = [
    { key: 'home', label: 'Home', icon: 'home-outline', screen: 'DriverHome' },
    { key: 'orders', label: 'Orders', icon: 'cube', screen: 'DriverOrders' },
    { key: 'earnings', label: 'Earnings', icon: 'wallet-outline', screen: 'DriverEarnings' },
    { key: 'notifications', label: 'Alerts', icon: 'notifications-outline', screen: 'DriverAlerts' },
    { key: 'profile', label: 'Profile', icon: 'person-outline', screen: 'DriverProfile' },
  ];

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.bg} />
<<<<<<< HEAD

      {isWideWeb && (
        <View style={styles.webTopBar}>
          <View style={styles.webTopBarInner}>
            <Text style={styles.webBrand}>Khata-Pro · Driver</Text>
            <View style={styles.webTopBarTabs}>
              {bottomTabs.map((tab) => {
                const active = tab.key === ACTIVE_TAB;
                return (
                  <TouchableOpacity
                    key={tab.key}
                    style={[styles.webTopBarTab, webNoOutlineStyle]}
                    onPress={() => handleTabPress(tab)}
                  >
                    <Ionicons name={tab.icon as keyof typeof Ionicons.glyphMap} size={17} color={active ? COLORS.primary : COLORS.slate} />
                    <Text style={[styles.webTopBarTabLabel, active && { color: COLORS.primary, fontWeight: '700' }]}>{tab.label}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>
      )}

      <TypedFlatList
        data={filteredOrders}
        keyExtractor={(item: OrderCardData) => item.id}
        numColumns={1}
        key="cols-1"
        contentContainerStyle={[styles.listContent, !isWideWeb && { paddingBottom: 90 }]}
        refreshControl={
          <RefreshControl refreshing={!isLoading && isFetching} onRefresh={refetchDeliveries} tintColor={COLORS.primary} />
        }
        ListHeaderComponent={
          <View style={[styles.webContainer, isWideWeb && styles.webContainerWide]}>
            {/* Header */}
            {!isWideWeb ? (
              <View style={styles.mobileHeader}>
                <View>
                  <Text style={styles.headerTitle}>My Orders</Text>
                  <Text style={styles.headerDate}>{todayLabel}</Text>
                </View>
                <TouchableOpacity style={[styles.refreshBtn, webNoOutlineStyle]} onPress={() => refetchDeliveries()} hitSlop={8}>
                  <Ionicons name="refresh-outline" size={20} color={COLORS.ink} />
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.webHeader}>
                <View>
                  <Text style={styles.headerTitle}>My Orders</Text>
                  <Text style={styles.headerDate}>{todayLabel}</Text>
                </View>
                <TouchableOpacity style={[styles.refreshBtn, webNoOutlineStyle]} onPress={() => refetchDeliveries()}>
                  <Ionicons name="refresh-outline" size={16} color={COLORS.ink} />
                  <Text style={styles.refreshBtnText}>Refresh</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Summary */}
            <View style={styles.section}>
              <View style={styles.summaryGrid}>
                {summaryItems.map((item) => (
                  <View key={item.key} style={styles.summaryGridItem}>
                    <OrderSummaryCard item={item} active={activeFilter === item.key} onPress={() => setActiveFilter(item.key as OrderFilterKey)} />
                  </View>
                ))}
              </View>
            </View>

            {/* Search */}
            <View style={styles.section}>
              <View style={styles.searchBar}>
                <Ionicons name="search-outline" size={16} color={COLORS.slate} />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search by Order ID, customer name or phone"
                  placeholderTextColor={COLORS.slateLight}
                  value={search}
                  onChangeText={setSearch}
                />
                {search.length > 0 && (
                  <TouchableOpacity onPress={() => setSearch('')} hitSlop={8}>
                    <Ionicons name="close-circle" size={18} color={COLORS.slateLight} />
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {/* Filter tabs */}
            <View style={[styles.section, { marginBottom: 4 }]}>
              <OrderFilterTabs active={activeFilter} onChange={setActiveFilter} />
            </View>
          </View>
        }
        renderItem={({ item }: { item: OrderCardData }) => (
          <View style={[styles.cardWrapper, isWideWeb && styles.cardWrapperWide]}>
            <OrderCard
              order={item}
              updating={updatingId === item.id || markingOutForDeliveryId === item.id}
              onNavigate={() => handleNavigate(item)}
              onCall={() => handleCall(item)}
              onMarkPickedUp={() => handleMarkPickedUp(item.id)}
              onStartDelivery={() => handleStartDelivery(item.id)}
              onMarkDelivered={() => handleMarkDelivered(item.id)}
              onUnableToDeliver={() => handleUnableToDeliver(item.id)}
            />
          </View>
        )}
        ListEmptyComponent={
          isLoading ? (
            <View style={styles.loadingWrap}>
              <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
          ) : (
            <View style={[styles.webContainer, isWideWeb && styles.webContainerWide]}>
              <EmptyOrdersState
                message={activeFilter === 'all' ? 'No deliveries assigned yet.' : 'No orders found'}
              />
            </View>
          )
        }
      />

      {!isWideWeb && (
        <View style={styles.bottomNav}>
          {bottomTabs.map((tab) => {
            const active = tab.key === ACTIVE_TAB;
            return (
              <TouchableOpacity
                key={tab.key}
                style={[styles.bottomNavItem, webNoOutlineStyle]}
                activeOpacity={0.7}
                onPress={() => handleTabPress(tab)}
              >
                <Ionicons name={tab.icon as keyof typeof Ionicons.glyphMap} size={22} color={active ? COLORS.primary : COLORS.slateLight} />
                <Text style={[styles.bottomNavLabel, { color: active ? COLORS.primary : COLORS.slateLight }]}>{tab.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      )}
=======
      {listBody}
      <View style={styles.bottomNav}>
        {bottomTabs.map((tab) => {
          const active = tab.key === 'orders';
          return (
            <TouchableOpacity key={tab.key} style={[styles.bottomNavItem, webNoOutlineStyle]} activeOpacity={0.7} onPress={() => handleTabPress(tab)}>
              <Ionicons name={tab.icon} size={22} color={active ? COLORS.primary : COLORS.slateLight} />
              <Text style={[styles.bottomNavLabel, { color: active ? COLORS.primary : COLORS.slateLight }]}>{tab.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
>>>>>>> 26841bfa2b2b0e92eefdd1c4fa082340002355e0
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  wideListWrap: { flex: 1, width: '100%', paddingHorizontal: 24 },

  mobileHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 16 },
  webHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 22 },
  headerTitle: { fontFamily: FONT_FAMILY, fontSize: 20, fontWeight: '700', color: COLORS.ink },
  headerDate: { fontFamily: FONT_FAMILY, fontSize: 12.5, color: COLORS.slate, marginTop: 2 },
  refreshBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    width: Platform.OS === 'web' ? undefined : 38, height: Platform.OS === 'web' ? undefined : 38,
    paddingHorizontal: Platform.OS === 'web' ? 14 : 0, paddingVertical: Platform.OS === 'web' ? 9 : 0,
    borderRadius: 10, backgroundColor: COLORS.card, borderWidth: 1, borderColor: COLORS.border,
  },
  refreshBtnText: { fontFamily: FONT_FAMILY, fontSize: 12.5, fontWeight: '700', color: COLORS.ink },

  section: { paddingHorizontal: 20, marginTop: 18 },
  controlsRowWide: { flexDirection: 'row', alignItems: 'center', gap: 12 },

  filterTab: {
    flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: COLORS.card, borderWidth: 1, borderColor: COLORS.border,
    borderRadius: 20, paddingHorizontal: 14, paddingVertical: 9,
  },
  filterTabActive: { backgroundColor: COLORS.secondaryLight, borderColor: COLORS.secondary },
  filterTabText: { fontFamily: FONT_FAMILY, fontSize: 12.5, fontWeight: '700', color: COLORS.ink },
  filterTabTextActive: { color: COLORS.ink },
  filterCountPill: { minWidth: 20, height: 20, borderRadius: 10, backgroundColor: COLORS.bg, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 5 },
  filterCountPillActive: { backgroundColor: '#FFFFFF' },
  filterCountText: { fontFamily: FONT_FAMILY, fontSize: 10.5, fontWeight: '700', color: COLORS.ink },
  filterCountTextActive: { color: COLORS.ink },

  searchBar: {
    flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: COLORS.card, borderRadius: 12,
    borderWidth: 1, borderColor: COLORS.border, paddingHorizontal: 12, paddingVertical: Platform.OS === 'web' ? 10 : 6, marginTop: 12,
  },
  searchBarWide: { flex: 1, marginTop: 0 },
  searchInput: { flex: 1, fontFamily: FONT_FAMILY, fontSize: 13, color: COLORS.ink, paddingVertical: 4 },

  filtersBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: COLORS.card, borderWidth: 1, borderColor: COLORS.border,
    borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10, marginTop: Platform.OS === 'web' ? 0 : 10, alignSelf: 'flex-start',
  },
  filtersBtnActive: { backgroundColor: COLORS.ink, borderColor: COLORS.ink },
  filtersBtnText: { fontFamily: FONT_FAMILY, fontSize: 12.5, fontWeight: '700', color: COLORS.ink },

  filtersPanel: { backgroundColor: COLORS.card, borderWidth: 1, borderColor: COLORS.border, borderRadius: 12, padding: 14, marginTop: 10 },
  filtersPanelLabel: { fontFamily: FONT_FAMILY, fontSize: 11.5, fontWeight: '700', color: COLORS.slate, textTransform: 'uppercase', letterSpacing: 0.4 },
  paymentFilterChip: { borderWidth: 1, borderColor: COLORS.border, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8, backgroundColor: COLORS.bg },
  paymentFilterChipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  paymentFilterChipText: { fontFamily: FONT_FAMILY, fontSize: 12, fontWeight: '600', color: COLORS.ink },

  listContent: { flexGrow: 1, paddingBottom: 24 },
  cardWrapper: { paddingHorizontal: 20, marginTop: 14 },

  statusPill: { alignSelf: 'flex-start', borderRadius: 8, paddingHorizontal: 9, paddingVertical: 5 },
  statusPillOutline: { borderWidth: 1.3, borderColor: COLORS.danger },
  statusPillText: { fontFamily: FONT_FAMILY, fontSize: 10, fontWeight: '700', letterSpacing: 0.3 },

  rowCard: { backgroundColor: COLORS.card, borderRadius: 16, borderWidth: 1, borderColor: COLORS.border, padding: 16 },
  rowMain: { flexDirection: 'row', alignItems: 'center', gap: 18 },
  rowColOrder: { width: 150 },
  rowOrderId: { fontFamily: FONT_FAMILY, fontSize: 14.5, fontWeight: '700', color: COLORS.ink, marginTop: 8 },
  rowOrderDate: { fontFamily: FONT_FAMILY, fontSize: 11, color: COLORS.slate, marginTop: 3 },

  rowColCustomer: { flex: 1.4, flexDirection: 'row', alignItems: 'center', gap: 10, minWidth: 0 },
  rowCustomerAvatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.primaryLight, alignItems: 'center', justifyContent: 'center' },
  rowCustomerAvatarText: { fontFamily: FONT_FAMILY, fontSize: 13, fontWeight: '700', color: COLORS.primaryDark },
  rowCustomerName: { fontFamily: FONT_FAMILY, fontSize: 13.5, fontWeight: '700', color: COLORS.ink },
  rowCustomerMeta: { fontFamily: FONT_FAMILY, fontSize: 11.5, color: COLORS.slate, marginTop: 2 },
  rowCustomerPhoneLink: { color: COLORS.primary, fontWeight: '600' },

  rowColStat: { alignItems: 'flex-start', minWidth: 78 },
  rowStatValue: { fontFamily: FONT_FAMILY, fontSize: 13.5, fontWeight: '700', color: COLORS.ink },
  rowStatLabel: { fontFamily: FONT_FAMILY, fontSize: 10.5, color: COLORS.slate, marginTop: 2 },

  paymentPill: { borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3, alignSelf: 'flex-start' },
  paymentPillCod: { backgroundColor: COLORS.amberLight },
  paymentPillUpi: { backgroundColor: PICKUP_BLUE_LIGHT },
  paymentPillText: { fontFamily: FONT_FAMILY, fontSize: 10.5, fontWeight: '700' },

  rowColActions: { alignItems: 'flex-end', gap: 8, minWidth: 130 },

  rejectBtn: { borderWidth: 1.5, borderColor: COLORS.danger, borderRadius: 10, paddingHorizontal: 16, paddingVertical: 9 },
  rejectBtnText: { fontFamily: FONT_FAMILY, fontSize: 12.5, fontWeight: '700', color: COLORS.danger },
  viewDetailsBtnWide: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: COLORS.secondary, borderRadius: 10, paddingHorizontal: 16, paddingVertical: 10 },
  viewDetailsBtnText: { fontFamily: FONT_FAMILY, fontSize: 12.5, fontWeight: '700', color: '#FFFFFF' },
  viewDetailsOutlineBtn: { borderWidth: 1, borderColor: COLORS.border, borderRadius: 10, paddingHorizontal: 16, paddingVertical: 10 },
  viewDetailsOutlineBtnText: { fontFamily: FONT_FAMILY, fontSize: 12.5, fontWeight: '700', color: COLORS.ink },

  rejectPanel: { flexDirection: 'row', gap: 8, marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: COLORS.border, alignItems: 'center' },
  rejectInput: { flex: 1, borderWidth: 1, borderColor: COLORS.border, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 9, fontFamily: FONT_FAMILY, fontSize: 12.5, color: COLORS.ink },
  secondaryBtnSmall: { borderWidth: 1, borderColor: COLORS.border, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 9, alignItems: 'center', justifyContent: 'center' },
  secondaryBtnSmallText: { fontFamily: FONT_FAMILY, fontSize: 12, fontWeight: '700', color: COLORS.ink },
  dangerBtnSmall: { backgroundColor: COLORS.danger, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 9, alignItems: 'center', justifyContent: 'center' },
  dangerBtnSmallText: { fontFamily: FONT_FAMILY, fontSize: 12, fontWeight: '700', color: '#FFFFFF' },

  iconOnlyBtn: { width: 34, height: 34, borderRadius: 10, backgroundColor: COLORS.primaryLight, alignItems: 'center', justifyContent: 'center' },

  mobileCard: { backgroundColor: COLORS.card, borderRadius: 16, borderWidth: 1, borderColor: COLORS.border, padding: 16 },
  mobileTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 },
  mobileOrderId: { fontFamily: FONT_FAMILY, fontSize: 15, fontWeight: '700', color: COLORS.ink },
  mobileOrderDate: { fontFamily: FONT_FAMILY, fontSize: 11, color: COLORS.slateLight },
  mobileCustomerName: { fontFamily: FONT_FAMILY, fontSize: 13.5, fontWeight: '700', color: COLORS.ink, marginTop: 8 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 5 },
  metaText: { fontFamily: FONT_FAMILY, fontSize: 12, color: COLORS.slate, flexShrink: 1 },
  mobileStatsRow: { flexDirection: 'row', alignItems: 'center', gap: 24, marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: COLORS.border },
  mobilePaymentText: { fontFamily: FONT_FAMILY, fontSize: 12, fontWeight: '700', color: COLORS.ink, marginLeft: 'auto' },
  mobileBtnRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 12 },
  mobileFullWidthBtn: { width: '100%', marginTop: 12, alignItems: 'center' },
  rejectInputMobile: { borderWidth: 1, borderColor: COLORS.border, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, fontFamily: FONT_FAMILY, fontSize: 12.5, color: COLORS.ink },

  emptyWrap: { alignItems: 'center', paddingVertical: 60, paddingHorizontal: 30 },
  emptyTitle: { fontFamily: FONT_FAMILY, fontSize: 14, fontWeight: '700', color: COLORS.ink, marginTop: 10 },
  emptyText: { fontFamily: FONT_FAMILY, fontSize: 12, color: COLORS.slate, marginTop: 4, textAlign: 'center' },
  loadingWrap: { paddingVertical: 60, alignItems: 'center' },

  // ── Additional styles ──────────────────────────────────────────────
  columnWrapper: { gap: 12 },
  webContainer: { paddingHorizontal: 20 },
  webContainerWide: { paddingHorizontal: 0 },
  summaryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  summaryGridItem: { flex: 1, minWidth: 80 },
  cardWrapperWide: { paddingHorizontal: 0, marginTop: 14 },
  webTopBar: { backgroundColor: COLORS.card, borderBottomWidth: 1, borderBottomColor: COLORS.border, paddingVertical: 12 },
  webTopBarInner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24, maxWidth: 1200, alignSelf: 'center', width: '100%' },
  webBrand: { fontFamily: FONT_FAMILY, fontSize: 16, fontWeight: '700', color: COLORS.ink },
  webTopBarTabs: { flexDirection: 'row', gap: 24 },
  webTopBarTab: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 6 },
  webTopBarTabLabel: { fontFamily: FONT_FAMILY, fontSize: 13, fontWeight: '600', color: COLORS.slate },

  bottomNav: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', backgroundColor: COLORS.card, borderTopWidth: 1, borderTopColor: COLORS.border, paddingTop: 8, paddingBottom: 20 },
  bottomNavItem: { flex: 1, alignItems: 'center', gap: 3 },
  bottomNavLabel: { fontFamily: FONT_FAMILY, fontSize: 10.5, fontWeight: '600' },
});

export default DriverOrdersScreen;