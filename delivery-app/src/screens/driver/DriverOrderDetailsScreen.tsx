

import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  ScrollView,
  TextInput,
  Alert,
  ActivityIndicator,
  Platform,
  Linking,
  useWindowDimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { COLORS } from '../../components/driver/DriverHomeComponents';
import { DriverWebShell, DriverShellTab } from '../../components/driver/DriverWebShell';
import { DeliveryProgressStepper } from '../../components/driver/DeliveryProgressStepper';
import { DriverAuthContext } from '../../context/DriverAuthContext';
import type { DriverMainStackParamList } from '../../navigation/DriverMainNavigator';

// ── Orval-generated hooks ────────────────────────────────────────────────
import {
  useGetMyDeliveryDetails,
  useAcceptDelivery,
  useRejectDelivery,
  usePickupDelivery,
  useStartDeliveryTrip,
  useMarkDeliveryArrived,
  useResendDeliveryOtp,
  useVerifyDeliveryOtp,
  useConfirmDeliveryPayment,
  useCompleteDelivery,
  useUpdateDriver,
  useListNotifications,
  useCallDeliveryCustomer,
} from '@workspace/api-client-react';

const FONT_FAMILY = Platform.select({
  web: '"Times New Roman", Times, serif',
  default: 'Times New Roman',
});
const webNoOutlineStyle = (Platform.OS === 'web' ? { outlineStyle: 'none' } : {}) as any;

function confirmAction(title: string, message: string, onConfirm: () => void) {
  if (Platform.OS === 'web') {
    // eslint-disable-next-line no-alert
    if (window.confirm(`${title}\n\n${message}`)) onConfirm();
  } else {
    Alert.alert(title, message, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Confirm', style: 'destructive', onPress: onConfirm },
    ]);
  }
}

function showAlert(title: string, message?: string) {
  if (Platform.OS === 'web') {
    // eslint-disable-next-line no-alert
    window.alert(message ? `${title}\n\n${message}` : title);
  } else {
    Alert.alert(title, message);
  }
}

type RouteParams = RouteProp<DriverMainStackParamList, 'DriverOrderDetails'>;

const STATUS_LABELS: Record<string, string> = {
  pending: 'Pending',
  assigned: 'Assigned',
  picked_up: 'Picked Up',
  in_transit: 'Out for Delivery',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

function formatDateTime(iso?: string | null) {
  if (!iso) return '—';
  const d = new Date(iso);
  const date = d.toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' });
  const time = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  return `${date} · ${time}`;
}

function formatTime(iso?: string | null) {
  if (!iso) return '—';
  return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function initials(name?: string) {
  if (!name) return '?';
  return name.trim().split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase();
}

// ── Static route-preview graphic (same technique as the Home screen's map
// placeholder) — no maps SDK dependency added. Swap for react-native-maps
// once available; the address/distance shown below it are always real. ──
const RoutePreviewMap: React.FC<{ distanceKm?: number | null }> = ({ distanceKm }) => (
  <View style={styles.mapCanvas}>
    <View style={styles.mapDotStart} />
    <View style={styles.mapPathLine} />
    <Ionicons name="location" size={26} color={COLORS.danger} style={styles.mapPin} />
    {distanceKm != null && (
      <View style={styles.mapDistanceBadge}>
        <Ionicons name="navigate" size={11} color={COLORS.primary} />
        <Text style={styles.mapDistanceBadgeText}>{distanceKm} km</Text>
      </View>
    )}
  </View>
);

const DriverOrderDetailsScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<RouteParams>();
  const deliveryId = route.params?.deliveryId;
  const { driver: authDriver } = useContext(DriverAuthContext) as any;

  const { width } = useWindowDimensions();
  const isWideWeb = Platform.OS === 'web' && width >= 1000;

  const [otp, setOtp] = useState('');
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectInput, setShowRejectInput] = useState(false);
  const [collectAmount, setCollectAmount] = useState('');
  const [isOnline, setIsOnline] = useState<boolean>(authDriver?.status === 'available');

  const { data, isLoading, refetch } = useGetMyDeliveryDetails(deliveryId, {
    query: { enabled: !!deliveryId },
  });
  const { data: notificationsData } = useListNotifications(
    { driver_id: authDriver?.id, limit: 8 },
    { query: { enabled: !!authDriver?.id && isWideWeb } }
  );

    const acceptDelivery = useAcceptDelivery();
  const rejectDelivery = useRejectDelivery();
  const pickupDelivery = usePickupDelivery();
  const startDeliveryTrip = useStartDeliveryTrip();
  const markArrived = useMarkDeliveryArrived();
  const resendOtp = useResendDeliveryOtp();
  const verifyOtp = useVerifyDeliveryOtp();
  const confirmPayment = useConfirmDeliveryPayment();
  const completeDelivery = useCompleteDelivery();
  const updateDriver = useUpdateDriver();
  const callCustomer = useCallDeliveryCustomer();

    const anyMutating =
    acceptDelivery.isPending ||
    rejectDelivery.isPending ||
    pickupDelivery.isPending ||
    startDeliveryTrip.isPending ||
    markArrived.isPending ||
    resendOtp.isPending ||
    verifyOtp.isPending ||
    confirmPayment.isPending ||
    completeDelivery.isPending ||
    callCustomer.isPending;

  const notificationsCount = Array.isArray(notificationsData)
    ? notificationsData.length
    : ((notificationsData as any)?.data?.length ?? 0);

  const handleToggleOnline = (value: boolean) => {
    setIsOnline(value);
    if (!authDriver?.id) return;
    updateDriver.mutate({ id: authDriver.id, data: { status: value ? 'available' : 'offline' } });
  };

  const handleTabPress = (tab: DriverShellTab) => {
    if (tab.key === 'orders') return; // already in the orders area
    if (tab.screen) navigation.navigate(tab.screen);
    else showAlert(tab.label, 'Coming soon');
  };

  if (isLoading || !data) {
    return (
      <SafeAreaView style={[styles.safe, styles.centerFill]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </SafeAreaView>
    );
  }

  const { delivery, customer, items } = data as any;

  const onError = (fallbackMessage: string) => (err: any) => {
    const msg = err?.response?.data?.error ?? fallbackMessage;
    showAlert('Something went wrong', msg);
  };

  // ── Actions ──────────────────────────────────────────────────────────
  const handleAccept = () => {
    acceptDelivery.mutate({ id: deliveryId }, { onSuccess: () => refetch(), onError: onError('Could not accept delivery.') });
  };

  const handleReject = () => {
    if (!rejectReason.trim()) {
      showAlert('Reason required', 'Please tell us why you are rejecting this delivery.');
      return;
    }
    confirmAction('Reject Delivery', 'Are you sure you want to reject this delivery?', () => {
      rejectDelivery.mutate(
        { id: deliveryId, data: { reason: rejectReason.trim() } },
        {
          onSuccess: () => {
            showAlert('Delivery rejected');
            navigation.navigate('DriverOrders');
          },
          onError: onError('Could not reject delivery.'),
        }
      );
    });
  };

  const handlePickup = () => {
    pickupDelivery.mutate({ id: deliveryId }, { onSuccess: () => refetch(), onError: onError('Could not mark as picked up.') });
  };

  const handleStartDelivery = () => {
    startDeliveryTrip.mutate({ id: deliveryId }, { onSuccess: () => refetch(), onError: onError('Could not start delivery.') });
  };

  const handleMarkArrived = () => {
    markArrived.mutate(
      { id: deliveryId },
      {
        onSuccess: () => {
          refetch();
          showAlert('OTP sent', "We've sent a verification code to the customer's phone.");
        },
        onError: onError('Could not mark as arrived.'),
      }
    );
  };

  const handleResendOtp = () => {
    resendOtp.mutate({ id: deliveryId }, { onSuccess: () => showAlert('OTP resent'), onError: onError('Could not resend OTP.') });
  };

  const handleVerifyOtp = () => {
    if (otp.trim().length < 4) {
      showAlert('Enter OTP', 'Ask the customer for their delivery code.');
      return;
    }
    verifyOtp.mutate(
      { id: deliveryId, data: { otp: otp.trim() } },
      { onSuccess: () => { setOtp(''); refetch(); }, onError: onError('Incorrect OTP.') }
    );
  };

  const handleConfirmPayment = () => {
    const amount = parseFloat(collectAmount || String(delivery.amount ?? 0));
    if (!amount || amount <= 0) {
      showAlert('Enter amount', 'Please enter the amount collected.');
      return;
    }
    confirmAction('Confirm Payment', `Confirm that ₹${amount} has been collected from the customer?`, () => {
      confirmPayment.mutate(
        { id: deliveryId, data: { amount } },
        { onSuccess: () => refetch(), onError: onError('Could not confirm payment.') }
      );
    });
  };

  const handleComplete = () => {
    confirmAction('Complete Delivery', 'Confirm that the customer has received the order?', () => {
      completeDelivery.mutate(
        { id: deliveryId },
        {
          onSuccess: () => {
            showAlert('Delivery Completed 🎉', `Order #${delivery.id} delivered successfully.`);
            navigation.navigate('DriverOrders');
          },
          onError: onError('Could not complete delivery.'),
        }
      );
    });
  };

   const handleCall = () => {
    if (!customer) {
      showAlert('No phone number', 'This customer has no phone number on file.');
      return;
    }
    callCustomer.mutate(
      { id: deliveryId },
      {
        onSuccess: (res: any) => showAlert('Calling…', res?.data?.message ?? 'Your phone will ring shortly.'),
        onError: (err: any) => showAlert('Could not call', err?.response?.data?.error ?? 'Please try again.'),
      }
    );
  };

  const handleNavigate = () => {
    const query = encodeURIComponent(delivery.drop_address ?? '');
    const url = Platform.select({
      ios: `maps://app?daddr=${query}`,
      android: `google.navigation:q=${query}`,
      default: `https://www.google.com/maps/dir/?api=1&destination=${query}`,
    })!;
    Linking.openURL(url).catch(() => Linking.openURL(`https://www.google.com/maps/dir/?api=1&destination=${query}`));
  };

  // TODO(backend): wire to a real report/issue endpoint once one exists.
  // Left as a clear stub rather than faking a network call.
  const handleReportIssue = () => {
    showAlert('Report an Issue', 'This will be connected to support once the reporting API is available.');
  };

  // ── Derive current step ─────────────────────────────────────────────
  const isCod = delivery.payment_method === 'cod';
  const needsAccept = delivery.status === 'assigned' && !delivery.accepted_at;
  const needsPickup = delivery.status === 'assigned' && !!delivery.accepted_at;
  const needsStart = delivery.status === 'picked_up';
  const needsArrive = delivery.status === 'in_transit' && !delivery.arrived_at;
  const needsOtp = delivery.status === 'in_transit' && !!delivery.arrived_at && !delivery.otp_verified;
  const needsPayment = delivery.status === 'in_transit' && delivery.otp_verified && isCod && delivery.payment_status !== 'collected';
  const readyToComplete =
    delivery.status === 'in_transit' && !!delivery.arrived_at && delivery.otp_verified && (!isCod || delivery.payment_status === 'collected');
  const isDelivered = delivery.status === 'delivered';
  const isCancelled = delivery.status === 'cancelled';

  // ── Sub-blocks reused between mobile and wide-web layouts ───────────
  const orderHeaderCard = (
    <View style={styles.card}>
      <View style={styles.orderHeaderTopRow}>
        <Text style={styles.orderHeaderTitle}>Order #{delivery.id}</Text>
        <View style={[styles.statusPill, isDelivered && styles.statusPillSuccess, isCancelled && styles.statusPillDanger]}>
          <Text style={[styles.statusPillText, isDelivered && { color: COLORS.secondary }, isCancelled && { color: COLORS.danger }]}>
            {(STATUS_LABELS[delivery.status] ?? delivery.status).toUpperCase()}
          </Text>
        </View>
      </View>
      <View style={styles.orderHeaderMetaRow}>
        <Ionicons name="calendar-outline" size={13} color={COLORS.slate} />
        <Text style={styles.orderHeaderMetaText}>{formatDateTime(delivery.assigned_at ?? delivery.created_at)}</Text>
        {!!(delivery.order_number ?? delivery.sales_order_id) && (
          <>
            <Text style={styles.orderHeaderMetaDivider}>|</Text>
            <Text style={styles.orderHeaderMetaText}>Order ID: {delivery.order_number ?? `SO-${delivery.sales_order_id}`}</Text>
          </>
        )}
      </View>
    </View>
  );

  const deliveryInfoCard = (
    <View style={styles.card}>
      <View style={styles.sectionHeaderRow}>
        <Ionicons name="bicycle-outline" size={15} color={COLORS.primary} />
        <Text style={styles.sectionTitle}>Delivery Information</Text>
      </View>
      <View style={styles.infoGrid}>
        <View style={styles.infoGridItem}>
          <Text style={styles.infoLabel}>Distance</Text>
          <Text style={styles.infoValue}>{delivery.distance_km != null ? `${delivery.distance_km} km` : '—'}</Text>
        </View>
        <View style={styles.infoGridItem}>
          <Text style={styles.infoLabel}>Delivery Fee</Text>
          <Text style={styles.infoValue}>₹{delivery.delivery_fee ?? '0.00'}</Text>
        </View>
        <View style={styles.infoGridItem}>
          <Text style={styles.infoLabel}>Assigned At</Text>
          <Text style={styles.infoValue}>{formatTime(delivery.assigned_at)}</Text>
        </View>
        <View style={styles.infoGridItem}>
          <Text style={styles.infoLabel}>Estimated Time</Text>
          <Text style={styles.infoValue}>{delivery.estimated_minutes ? `${delivery.estimated_minutes} min` : '—'}</Text>
        </View>
        <View style={[styles.infoGridItem, { flexBasis: '100%' }]}>
          <Text style={styles.infoLabel}>Delivery Type</Text>
          <Text style={styles.infoValue}>{delivery.delivery_type ?? 'Standard'}</Text>
        </View>
      </View>
    </View>
  );

  const customerCard = (
    <View style={styles.card}>
      <View style={styles.sectionHeaderRow}>
        <Ionicons name="person-outline" size={15} color={COLORS.primary} />
        <Text style={styles.sectionTitle}>Customer Details</Text>
      </View>
      <View style={styles.customerRow}>
        <View style={styles.customerAvatar}>
          <Text style={styles.customerAvatarText}>{initials(customer?.name)}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.customerName}>{customer?.name ?? 'Customer'}</Text>
          <View style={styles.inlineRow}>
            <Ionicons name="call-outline" size={12.5} color={COLORS.slate} />
            <Text style={styles.customerMetaText}>{customer?.phone ?? '—'}</Text>
          </View>
        </View>
      </View>

      <View style={styles.inlineRow}>
        <Ionicons name="location-outline" size={13} color={COLORS.slate} style={{ marginTop: 2 }} />
        <Text style={styles.addressText}>{delivery.drop_address}</Text>
      </View>
      {!!delivery.delivery_landmark && (
        <Text style={styles.landmarkText}>Landmark: {delivery.delivery_landmark}</Text>
      )}

      <View style={styles.actionRow}>
        <TouchableOpacity style={[styles.secondaryBtn, webNoOutlineStyle]} onPress={handleCall}>
          <Ionicons name="call-outline" size={16} color={COLORS.primary} />
          <Text style={styles.secondaryBtnText}>Call Customer</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.secondaryBtnAlt, webNoOutlineStyle]} onPress={handleNavigate}>
          <Ionicons name="navigate-outline" size={16} color={COLORS.primary} />
          <Text style={styles.secondaryBtnText}>Navigate</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const mapCard = (
    <View style={styles.card}>
      <View style={styles.sectionHeaderRow}>
        <Ionicons name="map-outline" size={15} color={COLORS.primary} />
        <Text style={styles.sectionTitle}>Delivery Location</Text>
      </View>
      <RoutePreviewMap distanceKm={delivery.distance_km} />
      <View style={styles.mapFooterRow}>
        <Ionicons name="location-outline" size={13} color={COLORS.slate} />
        <Text style={styles.mapFooterText} numberOfLines={2}>{delivery.drop_address}</Text>
        {delivery.distance_km != null && <Text style={styles.mapFooterDistance}>{delivery.distance_km} km</Text>}
      </View>
    </View>
  );

  const orderItemsCard = (
    <View style={styles.card}>
      <View style={styles.sectionHeaderRow}>
        <Ionicons name="cube-outline" size={15} color={COLORS.primary} />
        <Text style={styles.sectionTitle}>Order Items</Text>
      </View>

      <View style={styles.itemsRow}>
        {/* Items table */}
        <View style={{ flex: 1.3 }}>
          <View style={styles.itemsTableHeader}>
            <Text style={[styles.itemsTableHeaderText, { flex: 2 }]}>Item</Text>
            <Text style={[styles.itemsTableHeaderText, { flex: 0.8, textAlign: 'center' }]}>Qty</Text>
            <Text style={[styles.itemsTableHeaderText, { flex: 1, textAlign: 'right' }]}>Unit Price</Text>
            <Text style={[styles.itemsTableHeaderText, { flex: 1, textAlign: 'right' }]}>Total</Text>
          </View>
          {items.length === 0 ? (
            <Text style={styles.emptyText}>No item details available.</Text>
          ) : (
            items.map((it: any) => (
              <View key={it.id} style={styles.itemsTableRow}>
                <Text style={[styles.itemsTableCellName, { flex: 2 }]}>{it.product_name}</Text>
                <Text style={[styles.itemsTableCell, { flex: 0.8, textAlign: 'center' }]}>{it.qty}</Text>
                <Text style={[styles.itemsTableCell, { flex: 1, textAlign: 'right' }]}>₹{it.unit_price}</Text>
                <Text style={[styles.itemsTableCellBold, { flex: 1, textAlign: 'right' }]}>₹{it.total_price}</Text>
              </View>
            ))
          )}
        </View>

        {/* Payment summary */}
        <View style={styles.itemsSummaryBox}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>₹{delivery.subtotal ?? delivery.amount ?? 0}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Tax</Text>
            <Text style={styles.summaryValue}>₹{delivery.tax ?? '0.00'}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Delivery Fee</Text>
            <Text style={styles.summaryValue}>₹{delivery.delivery_fee ?? '0.00'}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>Total Amount</Text>
            <Text style={styles.totalValue}>₹{delivery.amount ?? 0}</Text>
          </View>
        </View>
      </View>
    </View>
  );

  const paymentAndNotesRow = (
    <View style={styles.sideBySideRow}>
      <View style={[styles.card, { flex: 1 }]}>
        <View style={styles.sectionHeaderRow}>
          <Ionicons name="cash-outline" size={15} color={COLORS.primary} />
          <Text style={styles.sectionTitle}>Payment Information</Text>
        </View>
        <View style={[styles.paymentBadge, isCod ? styles.paymentBadgeCod : styles.paymentBadgePaid]}>
          <Ionicons name={isCod ? 'cash-outline' : 'card-outline'} size={16} color={isCod ? COLORS.amber : COLORS.secondary} />
          <View>
            <Text style={styles.paymentBadgeTitle}>{isCod ? 'Cash on Delivery' : (delivery.payment_method ?? '—').toUpperCase()}</Text>
            <Text style={styles.paymentBadgeSub}>{isCod ? 'Payment to be collected from customer' : 'Paid online'}</Text>
          </View>
        </View>
      </View>

      <View style={[styles.card, { flex: 1 }]}>
        <View style={styles.sectionHeaderRow}>
          <Ionicons name="document-text-outline" size={15} color={COLORS.primary} />
          <Text style={styles.sectionTitle}>Order Notes</Text>
        </View>
        <Text style={styles.notesText}>{delivery.delivery_instructions || delivery.notes || 'No notes for this order.'}</Text>
      </View>
    </View>
  );

  const deliveryStatusCard = (
    <View style={styles.card}>
      <View style={styles.sectionHeaderRow}>
        <Ionicons name="pulse-outline" size={15} color={COLORS.primary} />
        <Text style={styles.sectionTitle}>Delivery Status</Text>
      </View>
      <DeliveryProgressStepper delivery={delivery} />
    </View>
  );

  const actionRequiredCard = (
    <View style={styles.card}>
      <View style={styles.sectionHeaderRow}>
        <Ionicons name="flash-outline" size={15} color={COLORS.amber} />
        <Text style={styles.sectionTitle}>Action Required</Text>
      </View>

      {needsAccept && !showRejectInput && (
        <View style={styles.primaryActionRow}>
          <TouchableOpacity style={[styles.dangerOutlineBtn, webNoOutlineStyle]} onPress={() => setShowRejectInput(true)} disabled={anyMutating}>
            <Text style={styles.dangerOutlineBtnText}>Reject</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.bigPrimaryBtn, { flex: 1 }, webNoOutlineStyle]} onPress={handleAccept} disabled={anyMutating}>
            {acceptDelivery.isPending ? <ActivityIndicator color="#fff" size="small" /> : <><Ionicons name="checkmark-circle-outline" size={17} color="#fff" /><Text style={styles.bigPrimaryBtnText}>Accept Order</Text></>}
          </TouchableOpacity>
        </View>
      )}

      {needsAccept && showRejectInput && (
        <View>
          <TextInput
            style={styles.textInput}
            placeholder="Reason for rejecting (required)"
            placeholderTextColor={COLORS.slateLight}
            value={rejectReason}
            onChangeText={setRejectReason}
            multiline
          />
          <View style={styles.primaryActionRow}>
            <TouchableOpacity style={[styles.secondaryBtn, webNoOutlineStyle]} onPress={() => setShowRejectInput(false)}>
              <Text style={styles.secondaryBtnText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.dangerBtn, { flex: 1 }, webNoOutlineStyle]} onPress={handleReject} disabled={anyMutating}>
              {rejectDelivery.isPending ? <ActivityIndicator color="#fff" size="small" /> : <Text style={styles.bigPrimaryBtnText}>Confirm Reject</Text>}
            </TouchableOpacity>
          </View>
        </View>
      )}

      {needsPickup && (
        <TouchableOpacity style={[styles.bigPrimaryBtn, webNoOutlineStyle]} onPress={handlePickup} disabled={anyMutating}>
          {pickupDelivery.isPending ? <ActivityIndicator color="#fff" size="small" /> : <><Ionicons name="cube-outline" size={17} color="#fff" /><Text style={styles.bigPrimaryBtnText}>Mark as Picked Up</Text></>}
        </TouchableOpacity>
      )}

      {needsStart && (
        <TouchableOpacity style={[styles.bigPrimaryBtn, webNoOutlineStyle]} onPress={handleStartDelivery} disabled={anyMutating}>
          {startDeliveryTrip.isPending ? <ActivityIndicator color="#fff" size="small" /> : <><Ionicons name="bicycle-outline" size={17} color="#fff" /><Text style={styles.bigPrimaryBtnText}>Start Delivery</Text></>}
        </TouchableOpacity>
      )}

      {needsArrive && (
        <TouchableOpacity style={[styles.bigPrimaryBtn, webNoOutlineStyle]} onPress={handleMarkArrived} disabled={anyMutating}>
          {markArrived.isPending ? <ActivityIndicator color="#fff" size="small" /> : <><Ionicons name="checkmark-circle-outline" size={17} color="#fff" /><Text style={styles.bigPrimaryBtnText}>Mark as Arrived</Text></>}
        </TouchableOpacity>
      )}

      {needsOtp && (
        <View>
          <Text style={styles.instructionsText}>Ask the customer for their OTP.</Text>
          <TextInput
            style={styles.otpInput}
            placeholder="Enter OTP"
            placeholderTextColor={COLORS.slateLight}
            value={otp}
            onChangeText={setOtp}
            keyboardType="number-pad"
            maxLength={6}
          />
          {delivery.otp_attempts_remaining != null && (
            <Text style={styles.hintText}>{delivery.otp_attempts_remaining} attempts remaining</Text>
          )}
          <TouchableOpacity style={[styles.bigPrimaryBtn, styles.fullWidth, webNoOutlineStyle]} onPress={handleVerifyOtp} disabled={anyMutating}>
            {verifyOtp.isPending ? <ActivityIndicator color="#fff" size="small" /> : <Text style={styles.bigPrimaryBtnText}>Verify OTP</Text>}
          </TouchableOpacity>
          <TouchableOpacity style={[styles.linkBtn, webNoOutlineStyle]} onPress={handleResendOtp} disabled={anyMutating}>
            <Text style={styles.linkBtnText}>Didn't receive OTP? Resend</Text>
          </TouchableOpacity>
        </View>
      )}

      {needsPayment && (
        <View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Order Total</Text>
            <Text style={styles.totalValue}>₹{delivery.amount ?? 0}</Text>
          </View>
          <TextInput
            style={styles.textInput}
            placeholder={`Amount to collect (₹${delivery.amount ?? 0})`}
            placeholderTextColor={COLORS.slateLight}
            value={collectAmount}
            onChangeText={setCollectAmount}
            keyboardType="decimal-pad"
          />
          <TouchableOpacity style={[styles.bigPrimaryBtn, styles.fullWidth, webNoOutlineStyle]} onPress={handleConfirmPayment} disabled={anyMutating}>
            {confirmPayment.isPending ? <ActivityIndicator color="#fff" size="small" /> : <Text style={styles.bigPrimaryBtnText}>Confirm Payment</Text>}
          </TouchableOpacity>
        </View>
      )}

      {readyToComplete && (
        <View>
          <View style={styles.paidPill}>
            <Ionicons name="checkmark-circle" size={14} color={COLORS.secondary} />
            <Text style={styles.paidPillText}>OTP Verified{isCod ? ' · Payment Collected' : ''}</Text>
          </View>
          <TouchableOpacity style={[styles.successBtn, styles.fullWidth, webNoOutlineStyle]} onPress={handleComplete} disabled={anyMutating}>
            {completeDelivery.isPending ? <ActivityIndicator color="#fff" size="small" /> : <Text style={styles.bigPrimaryBtnText}>Complete Delivery</Text>}
          </TouchableOpacity>
        </View>
      )}

      {isDelivered && (
        <View style={[styles.centerFill, { paddingVertical: 16 }]}>
          <Ionicons name="checkmark-done-circle" size={40} color={COLORS.secondary} />
          <Text style={styles.doneTitle}>Delivery Completed 🎉</Text>
          <Text style={styles.hintText}>Delivered {delivery.delivered_at ? new Date(delivery.delivered_at).toLocaleString() : ''}</Text>
        </View>
      )}

      {isCancelled && (
        <View style={[styles.centerFill, { paddingVertical: 16 }]}>
          <Ionicons name="close-circle" size={40} color={COLORS.danger} />
          <Text style={styles.doneTitle}>Delivery Cancelled</Text>
          {!!delivery.rejection_reason && <Text style={styles.hintText}>{delivery.rejection_reason}</Text>}
        </View>
      )}

      {!isDelivered && !isCancelled && (
        <View style={styles.actionRow}>
          <TouchableOpacity style={[styles.secondaryBtn, webNoOutlineStyle]} onPress={handleCall}>
            <Ionicons name="call-outline" size={16} color={COLORS.primary} />
            <Text style={styles.secondaryBtnText}>Call Customer</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.secondaryBtnAlt, webNoOutlineStyle]} onPress={handleNavigate}>
            <Ionicons name="navigate-outline" size={16} color={COLORS.primary} />
            <Text style={styles.secondaryBtnText}>Navigate</Text>
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity style={[styles.reportBtn, webNoOutlineStyle]} onPress={handleReportIssue}>
        <Ionicons name="alert-circle-outline" size={15} color={COLORS.danger} />
        <Text style={styles.reportBtnText}>Report an Issue</Text>
      </TouchableOpacity>
    </View>
  );

  // ── Wide web: two-column layout matching the reference design ───────
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
        onProfilePress={undefined}
      >
        <ScrollView contentContainerStyle={styles.wideScrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.breadcrumbRow}>
            <TouchableOpacity style={[styles.breadcrumbBtn, webNoOutlineStyle]} onPress={() => navigation.navigate('DriverHome')}>
              <Ionicons name="arrow-back" size={15} color={COLORS.ink} />
              <Text style={styles.breadcrumbText}>Back to Home</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.historyBtn, webNoOutlineStyle]} onPress={() => navigation.navigate('DriverOrders')}>
              <Ionicons name="time-outline" size={14} color={COLORS.ink} />
              <Text style={styles.historyBtnText}>Order History</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.wideTwoCol}>
            <View style={{ flex: 1.35 }}>{orderHeaderCard}</View>
            <View style={{ flex: 1 }}>{deliveryInfoCard}</View>
          </View>

          <View style={styles.wideTwoCol}>
            <View style={{ flex: 1.35 }}>
              {customerCard}
              {orderItemsCard}
              {paymentAndNotesRow}
            </View>
            <View style={{ flex: 1 }}>
              {mapCard}
              {deliveryStatusCard}
              {actionRequiredCard}
            </View>
          </View>
        </ScrollView>
      </DriverWebShell>
    );
  }

  // ── Mobile / narrow web ───────────────────────────────────────────
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.bg} />

      <View style={styles.mobileHeader}>
        <TouchableOpacity style={[styles.backBtn, webNoOutlineStyle]} onPress={() => navigation.goBack()} hitSlop={8}>
          <Ionicons name="arrow-back" size={22} color={COLORS.ink} />
        </TouchableOpacity>
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={styles.mobileHeaderTitle}>Order #{delivery.id}</Text>
          <Text style={styles.mobileHeaderSubtitle}>{STATUS_LABELS[delivery.status] ?? delivery.status}</Text>
        </View>
        <View style={[styles.statusPill, isDelivered && styles.statusPillSuccess, isCancelled && styles.statusPillDanger]}>
          <Text style={[styles.statusPillText, isDelivered && { color: COLORS.secondary }, isCancelled && { color: COLORS.danger }]}>
            {STATUS_LABELS[delivery.status] ?? delivery.status}
          </Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {customerCard}
        {mapCard}
        {orderItemsCard}
        {paymentAndNotesRow}
        {deliveryStatusCard}
        {actionRequiredCard}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  centerFill: { alignItems: 'center', justifyContent: 'center' },

  // ── Wide web ──────────────────────────────────────────────────────
  wideScrollContent: { padding: 24, paddingBottom: 48 },
  breadcrumbRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  breadcrumbBtn: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  breadcrumbText: { fontFamily: FONT_FAMILY, fontSize: 13, fontWeight: '700', color: COLORS.ink },
  historyBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, borderWidth: 1, borderColor: COLORS.border, backgroundColor: COLORS.card, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8 },
  historyBtnText: { fontFamily: FONT_FAMILY, fontSize: 12.5, fontWeight: '700', color: COLORS.ink },
  wideTwoCol: { flexDirection: 'row', gap: 20, alignItems: 'flex-start' },
  sideBySideRow: { flexDirection: 'row', gap: 14 },

  // ── Mobile header ─────────────────────────────────────────────────
  mobileHeader: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 12, paddingBottom: 14,
    backgroundColor: COLORS.card, borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  backBtn: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.bg },
  mobileHeaderTitle: { fontFamily: FONT_FAMILY, fontSize: 16, fontWeight: '700', color: COLORS.ink },
  mobileHeaderSubtitle: { fontFamily: FONT_FAMILY, fontSize: 12, color: COLORS.slate, marginTop: 2 },
  scrollContent: { padding: 16, paddingBottom: 40 },

  // ── Shared card ───────────────────────────────────────────────────
  card: { backgroundColor: COLORS.card, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: COLORS.border, marginBottom: 14 },
  sectionHeaderRow: { flexDirection: 'row', alignItems: 'center', gap: 7, marginBottom: 12 },
  sectionTitle: { fontFamily: FONT_FAMILY, fontSize: 13.5, fontWeight: '700', color: COLORS.ink },
  emptyText: { fontFamily: FONT_FAMILY, fontSize: 13, color: COLORS.slate },

  // ── Order header card ─────────────────────────────────────────────
  orderHeaderTopRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  orderHeaderTitle: { fontFamily: FONT_FAMILY, fontSize: 19, fontWeight: '700', color: COLORS.ink },
  orderHeaderMetaRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 10 },
  orderHeaderMetaText: { fontFamily: FONT_FAMILY, fontSize: 12, color: COLORS.slate },
  orderHeaderMetaDivider: { fontSize: 12, color: COLORS.border, marginHorizontal: 4 },

  statusPill: { backgroundColor: COLORS.amberLight, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10 },
  statusPillSuccess: { backgroundColor: COLORS.secondaryLight },
  statusPillDanger: { backgroundColor: COLORS.dangerLight },
  statusPillText: { fontFamily: FONT_FAMILY, fontSize: 11, fontWeight: '700', color: COLORS.amber, letterSpacing: 0.3 },

  // ── Delivery info grid ────────────────────────────────────────────
  infoGrid: { flexDirection: 'row', flexWrap: 'wrap', rowGap: 14 },
  infoGridItem: { flexBasis: '50%' },
  infoLabel: { fontFamily: FONT_FAMILY, fontSize: 11.5, color: COLORS.slate },
  infoValue: { fontFamily: FONT_FAMILY, fontSize: 14.5, fontWeight: '700', color: COLORS.secondary, marginTop: 3 },

  // ── Customer card ─────────────────────────────────────────────────
  customerRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 10 },
  customerAvatar: { width: 46, height: 46, borderRadius: 23, backgroundColor: COLORS.primaryLight, alignItems: 'center', justifyContent: 'center' },
  customerAvatarText: { fontFamily: FONT_FAMILY, fontSize: 15, fontWeight: '700', color: COLORS.primaryDark },
  customerName: { fontFamily: FONT_FAMILY, fontSize: 16, fontWeight: '700', color: COLORS.ink },
  customerMetaText: { fontFamily: FONT_FAMILY, fontSize: 12.5, color: COLORS.slate },
  inlineRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 6, marginTop: 6 },
  addressText: { fontFamily: FONT_FAMILY, fontSize: 12.5, color: COLORS.slate, flexShrink: 1, lineHeight: 18 },
  landmarkText: { fontFamily: FONT_FAMILY, fontSize: 12, color: COLORS.slate, marginTop: 4, marginLeft: 19 },
  instructionsText: { fontFamily: FONT_FAMILY, fontSize: 12.5, color: COLORS.slate, marginBottom: 6 },

  actionRow: { flexDirection: 'row', gap: 10, marginTop: 14 },
  secondaryBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: COLORS.secondaryLight, paddingVertical: 11, borderRadius: 12 },
  secondaryBtnAlt: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: COLORS.primaryLight, paddingVertical: 11, borderRadius: 12 },
  secondaryBtnText: { fontFamily: FONT_FAMILY, fontSize: 12.5, fontWeight: '700', color: COLORS.primary },

  // ── Map card ──────────────────────────────────────────────────────
  mapCanvas: { height: 150, borderRadius: 12, backgroundColor: '#EAF3EC', overflow: 'hidden', justifyContent: 'center', paddingHorizontal: 16 },
  mapDotStart: { position: 'absolute', left: 20, bottom: 24, width: 10, height: 10, borderRadius: 5, backgroundColor: COLORS.secondary, borderWidth: 2, borderColor: '#FFFFFF' },
  mapPathLine: { position: 'absolute', left: 26, right: 40, top: 30, bottom: 30, borderStyle: 'dashed', borderWidth: 1.5, borderColor: COLORS.secondary, opacity: 0.6, transform: [{ rotate: '-18deg' }] },
  mapPin: { position: 'absolute', right: 22, top: 18 },
  mapDistanceBadge: { position: 'absolute', bottom: 10, right: 10, flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#FFFFFF', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 },
  mapDistanceBadgeText: { fontFamily: FONT_FAMILY, fontSize: 11, fontWeight: '700', color: COLORS.primary },
  mapFooterRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 10 },
  mapFooterText: { flex: 1, fontFamily: FONT_FAMILY, fontSize: 12, color: COLORS.slate },
  mapFooterDistance: { fontFamily: FONT_FAMILY, fontSize: 12.5, fontWeight: '700', color: COLORS.secondary },

  // ── Order items ───────────────────────────────────────────────────
  itemsRow: { flexDirection: 'row', gap: 16, flexWrap: 'wrap' },
  itemsTableHeader: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: COLORS.border, paddingBottom: 8, marginBottom: 4 },
  itemsTableHeaderText: { fontFamily: FONT_FAMILY, fontSize: 11, fontWeight: '700', color: COLORS.slate, textTransform: 'uppercase', letterSpacing: 0.3 },
  itemsTableRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 9, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  itemsTableCellName: { fontFamily: FONT_FAMILY, fontSize: 13, color: COLORS.ink, fontWeight: '600' },
  itemsTableCell: { fontFamily: FONT_FAMILY, fontSize: 12.5, color: COLORS.slate },
  itemsTableCellBold: { fontFamily: FONT_FAMILY, fontSize: 13, color: COLORS.ink, fontWeight: '700' },
  itemsSummaryBox: { flexBasis: 200, flexGrow: 1, backgroundColor: COLORS.bg, borderRadius: 12, padding: 14, borderWidth: 1, borderColor: COLORS.border },

  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 5 },
  summaryLabel: { fontFamily: FONT_FAMILY, fontSize: 12.5, color: COLORS.slate },
  summaryValue: { fontFamily: FONT_FAMILY, fontSize: 12.5, color: COLORS.ink, fontWeight: '600' },
  divider: { height: 1, backgroundColor: COLORS.border, marginVertical: 8 },
  totalLabel: { fontFamily: FONT_FAMILY, fontSize: 14, fontWeight: '700', color: COLORS.ink },
  totalValue: { fontFamily: FONT_FAMILY, fontSize: 16, fontWeight: '700', color: COLORS.primary },

  // ── Payment / notes ───────────────────────────────────────────────
  paymentBadge: { flexDirection: 'row', alignItems: 'center', gap: 10, borderRadius: 12, padding: 12, borderWidth: 1 },
  paymentBadgeCod: { backgroundColor: COLORS.amberLight, borderColor: COLORS.amber + '33' },
  paymentBadgePaid: { backgroundColor: COLORS.secondaryLight, borderColor: COLORS.secondary + '33' },
  paymentBadgeTitle: { fontFamily: FONT_FAMILY, fontSize: 13, fontWeight: '700', color: COLORS.ink },
  paymentBadgeSub: { fontFamily: FONT_FAMILY, fontSize: 11, color: COLORS.slate, marginTop: 2 },
  notesText: { fontFamily: FONT_FAMILY, fontSize: 12.5, color: COLORS.slate, lineHeight: 18 },

  paidPill: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: COLORS.secondaryLight, alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10, marginBottom: 10 },
  paidPillText: { fontFamily: FONT_FAMILY, fontSize: 12, fontWeight: '700', color: COLORS.secondary },

  // ── Action buttons ────────────────────────────────────────────────
  primaryActionRow: { flexDirection: 'row', gap: 10 },
  bigPrimaryBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: COLORS.secondary, paddingVertical: 15, paddingHorizontal: 20, borderRadius: 12 },
  bigPrimaryBtnText: { fontFamily: FONT_FAMILY, fontSize: 14.5, fontWeight: '700', color: '#FFFFFF' },
  successBtn: { backgroundColor: COLORS.secondary, paddingVertical: 15, paddingHorizontal: 20, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  dangerBtn: { backgroundColor: COLORS.danger, paddingVertical: 13, paddingHorizontal: 20, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  dangerOutlineBtn: { borderWidth: 1.5, borderColor: COLORS.danger, paddingVertical: 12, paddingHorizontal: 20, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  dangerOutlineBtnText: { fontFamily: FONT_FAMILY, fontSize: 14, fontWeight: '700', color: COLORS.danger },
  fullWidth: { width: '100%' },

  textInput: { borderWidth: 1, borderColor: COLORS.border, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 11, fontFamily: FONT_FAMILY, fontSize: 13.5, color: COLORS.ink, marginBottom: 10, minHeight: 44 },
  otpInput: { borderWidth: 1.5, borderColor: COLORS.primary, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 13, fontFamily: FONT_FAMILY, fontSize: 20, fontWeight: '700', letterSpacing: 6, color: COLORS.ink, marginBottom: 10, textAlign: 'center' },
  hintText: { fontFamily: FONT_FAMILY, fontSize: 11.5, color: COLORS.slate, marginTop: 6, textAlign: 'center' },
  linkBtn: { alignItems: 'center', paddingVertical: 12 },
  linkBtnText: { fontFamily: FONT_FAMILY, fontSize: 12.5, fontWeight: '700', color: COLORS.primary },

  reportBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, borderWidth: 1.5, borderColor: COLORS.danger, borderRadius: 12, paddingVertical: 12, marginTop: 14 },
  reportBtnText: { fontFamily: FONT_FAMILY, fontSize: 13, fontWeight: '700', color: COLORS.danger },

  doneTitle: { fontFamily: FONT_FAMILY, fontSize: 16, fontWeight: '700', color: COLORS.ink, marginTop: 10, marginBottom: 4 },
});

export default DriverOrderDetailsScreen;