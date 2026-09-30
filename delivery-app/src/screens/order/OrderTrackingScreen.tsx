import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  AppState,
  Platform,
  useWindowDimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { ordersApi, CustomerOrder, CUSTOMER_TRACKING_STEPS } from '../../api/orders';

// ── Design tokens — matched to OrdersScreen ─────────────────────
const PURPLE = '#6C5CE7';
const PURPLE_DARK = '#5541D7';
const PURPLE_LIGHT = '#F1EEFF';
const PURPLE_SOFT = '#EDE9FE';
const ACCENT = '#8B7CF6';
const SUCCESS = '#22C55E';
const SUCCESS_BG = '#DCFCE7';
const DANGER = '#EF4444';
const DANGER_BG = '#FEE2E2';
const TEXT_MAIN = '#1E1B2E';
const TEXT_SECONDARY = '#8A85A0';
const BORDER = '#EFEDF7';
const BG = '#FFFFFF';
const BG_SOFT = '#FAFAFD';

const FONT_FAMILY = Platform.select({
  web: "'Times New Roman', Times, serif",
  default: 'Times New Roman',
}) as string;

const THEME_COLOR = PURPLE;
const THEME_COLOR_LIGHT = PURPLE_LIGHT; // kept for compatibility with any external references

const DESKTOP_BREAKPOINT = 768;
const DESKTOP_MAX_WIDTH = 1200;

interface OrderTrackingScreenProps {
  navigation: any;
  route: any;
}

// Customer-facing stage metadata — icon/label/message only, no business logic here.
const STAGE_META: Record<string, { label: string; icon: string; message: string }> = {
  ORDER_PLACED: { label: 'Order Placed', icon: 'time-outline', message: 'Your order has been placed.' },
  ORDER_CONFIRMED: { label: 'Order Confirmed', icon: 'checkmark-circle-outline', message: 'Your order has been confirmed by the store.' },
  DRIVER_ASSIGNED: { label: 'Driver Assigned', icon: 'person-outline', message: 'A delivery partner has been assigned to your order.' },
  PICKED_UP: { label: 'Picked Up', icon: 'cube-outline', message: 'Your order has been picked up.' },
  OUT_FOR_DELIVERY: { label: 'Out for Delivery', icon: 'bicycle-outline', message: 'Your delivery partner is on the way!' },
  DELIVERED: { label: 'Delivered', icon: 'checkmark-done-circle-outline', message: '🎉 Your order has been delivered successfully!' },
};

// Masks a phone number, showing only the last 3 digits
// e.g. "8846876543" -> "XXXXXXX543"
const maskPhone = (phone?: string | null): string => {
  if (!phone) return 'No phone on file';
  const digits = phone.replace(/\D/g, ''); // keep only numbers
  if (digits.length <= 3) return digits;
  const last3 = digits.slice(-3);
  const masked = 'X'.repeat(digits.length - 3);
  return `${masked}${last3}`;
};

const POLL_INTERVAL_MS = 15000; // fallback polling — swap for Supabase Realtime later if enabled

const OrderTrackingScreen: React.FC<OrderTrackingScreenProps> = ({ navigation, route }) => {
  const { orderId } = route.params || {};
  const { width: windowWidth } = useWindowDimensions();
  const isDesktopWeb = Platform.OS === 'web' && windowWidth >= DESKTOP_BREAKPOINT;

  const [order, setOrder] = useState<CustomerOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const appStateRef = useRef(AppState.currentState);

  const fetchTracking = useCallback(async (silent = false) => {
    if (!orderId) {
      setError('No order specified.');
      setLoading(false);
      return;
    }
    try {
      if (!silent) setLoading(true);
      const data = await ordersApi.getOrderTracking(Number(orderId));
      setOrder(data);
      setError(null);
    } catch (err: any) {
      // Keep last-known state on background refresh failures — only show
      // the error screen on the initial load.
      if (!silent) {
        setError(err?.message || 'Unable to load order tracking. Please try again.');
      }
    } finally {
      if (!silent) setLoading(false);
      setRefreshing(false);
    }
  }, [orderId]);

  // Initial load
  useEffect(() => {
    fetchTracking(false);
  }, [fetchTracking]);

  // Poll while the order isn't in a terminal state, stop once delivered/cancelled.
  useEffect(() => {
    const isTerminal = order?.tracking_status === 'DELIVERED' || order?.tracking_status === 'CANCELLED';
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
    if (!isTerminal) {
      pollRef.current = setInterval(() => fetchTracking(true), POLL_INTERVAL_MS);
    }
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [order?.tracking_status, fetchTracking]);

  // Refresh immediately when the app comes back to foreground.
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (appStateRef.current === 'background' && nextAppState === 'active') {
        fetchTracking(true);
      }
      appStateRef.current = nextAppState;
    });
    return () => subscription.remove();
  }, [fetchTracking]);

  const handleRetry = () => {
    setError(null);
    fetchTracking(false);
  };

  // Resolves the app's actual root/initial screen name instead of assuming
  // it's called 'Home' — avoids "action NAVIGATE was not handled" errors
  // when the real route has a different name (e.g. 'Orders', 'Main').
  const getRootRouteName = (): string | undefined => {
    const state = navigation?.getState?.();
    return state?.routeNames?.[0];
  };

  const handleGoHome = () => {
    const rootRoute = getRootRouteName();
    if (rootRoute) {
      navigation.navigate(rootRoute);
    } else if (navigation?.canGoBack?.()) {
      navigation.goBack();
    }
  };

  const handleBack = () => {
    if (navigation?.canGoBack?.()) {
      navigation.goBack();
      return;
    }
    const rootRoute = getRootRouteName();
    if (rootRoute) {
      navigation.navigate(rootRoute);
    }
  };

  // ── Loading state ──────────────────────────────────────────
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor={BG} />
        <View style={styles.header}>
          <View style={[styles.headerInner, isDesktopWeb && styles.headerInnerDesktop]}>
            <TouchableOpacity onPress={handleBack} style={styles.backButton}>
              <Icon name="arrow-back" size={24} color={TEXT_MAIN} />
            </TouchableOpacity>
            <Text style={[styles.headerTitle, isDesktopWeb && styles.headerTitleDesktop]}>Order Tracking</Text>
            <View style={{ width: 32 }} />
          </View>
        </View>
        <View style={styles.centerFill}>
          <ActivityIndicator size="large" color={PURPLE} />
          <Text style={styles.loadingText}>Loading your order...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // ── Error / fallback state ─────────────────────────────────
  if (error || !order) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor={BG} />
        <View style={styles.header}>
          <View style={[styles.headerInner, isDesktopWeb && styles.headerInnerDesktop]}>
            <TouchableOpacity onPress={handleBack} style={styles.backButton}>
              <Icon name="arrow-back" size={24} color={TEXT_MAIN} />
            </TouchableOpacity>
            <Text style={[styles.headerTitle, isDesktopWeb && styles.headerTitleDesktop]}>Order Tracking</Text>
            <View style={{ width: 32 }} />
          </View>
        </View>
        <View style={styles.centerFill}>
          <View style={styles.errorIconWrap}>
            <Icon name="alert-circle-outline" size={40} color={DANGER} />
          </View>
          <Text style={styles.errorText}>Unable to load order tracking.{'\n'}Please try again.</Text>
          <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const trackingStatus = order.tracking_status;
  const isCancelled = trackingStatus === 'CANCELLED';
  const currentStepIndex = CUSTOMER_TRACKING_STEPS.indexOf(trackingStatus as any);
  const activeMeta = STAGE_META[trackingStatus] ?? STAGE_META.ORDER_PLACED;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={BG} />

      <View style={styles.header}>
        <View style={[styles.headerInner, isDesktopWeb && styles.headerInnerDesktop]}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Icon name="arrow-back" size={24} color={TEXT_MAIN} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, isDesktopWeb && styles.headerTitleDesktop]}>Order Tracking</Text>
          <TouchableOpacity
            style={[styles.refreshButton, isDesktopWeb && { marginLeft: 'auto' as any }]}
            onPress={() => {
              setRefreshing(true);
              fetchTracking(true);
            }}
          >
            {refreshing ? <ActivityIndicator size="small" color={PURPLE} /> : <Icon name="refresh-outline" size={22} color={PURPLE} />}
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={isDesktopWeb && styles.scrollContentDesktop}>
        {/* Order summary */}
        <View style={[styles.card, styles.summaryCard, isDesktopWeb && styles.cardDesktop]}>
          <View style={styles.summaryHeader}>
            <View style={styles.summaryIcon}>
              <Text style={styles.summaryIconText}>#</Text>
            </View>
            <View style={styles.summaryInfo}>
              <Text style={styles.summaryOrderName}>Order #{order.id}</Text>
              {order.business_name && (
    <Text style={styles.summaryShopName}>from {order.business_name}</Text>
  )}
  <Text style={styles.summaryTime}>
    Placed on {new Date(order.entry_date).toLocaleDateString()}
  </Text>
              <Text style={styles.summaryTime}>
                Placed on {new Date(order.entry_date).toLocaleDateString()}
              </Text>
            </View>
          </View>
          <View style={styles.amountBadge}>
            <Text style={styles.amountBadgeText}>₹{order.amount}</Text>
          </View>
        </View>

        {/* Current status */}
        <View style={[styles.card, styles.statusCard, isDesktopWeb && styles.cardDesktop]}>
          <View style={[styles.statusIconWrap, { backgroundColor: isCancelled ? DANGER_BG : PURPLE_LIGHT }]}>
            <Icon name={isCancelled ? 'close-circle' : (activeMeta.icon as any)} size={22} color={isCancelled ? DANGER : PURPLE} />
          </View>
          <Text style={styles.statusTitle}>{isCancelled ? 'Cancelled' : activeMeta.label}</Text>
          <Text style={styles.statusMessage}>
            {isCancelled ? 'This order has been cancelled.' : activeMeta.message}
          </Text>
        </View>

        {/* Driver info — only shown once a driver is assigned */}
        {order.delivery?.driver_name && !isCancelled && (
          <View style={[styles.card, styles.driverCard, isDesktopWeb && styles.cardDesktop]}>
            <View style={styles.driverAvatar}>
              <Icon name="person" size={20} color={PURPLE} />
            </View>
            <View style={{ marginLeft: 12, flex: 1 }}>
              <Text style={styles.driverName}>{order.delivery.driver_name}</Text>
              <Text style={styles.driverPhone}>{maskPhone(order.delivery.driver_phone)}</Text>
            </View>
            <Icon name="chevron-forward" size={16} color="#d4d1e3" />
          </View>
        )}

        {/* 6-stage timeline */}
        {!isCancelled && (
          <View style={[styles.card, styles.stepsCard, isDesktopWeb && styles.cardDesktop]}>
            {CUSTOMER_TRACKING_STEPS.map((step, index) => {
              const isCompleted = index < currentStepIndex;
              const isActive = index === currentStepIndex;
              const meta = STAGE_META[step];
              const isLast = index === CUSTOMER_TRACKING_STEPS.length - 1;

              return (
                <View key={step} style={[styles.stepItem, isLast && styles.stepItemLast]}>
                  <View style={styles.stepIndicator}>
                    <View style={[
                      styles.stepCircle,
                      isCompleted && styles.stepCircleCompleted,
                      isActive && styles.stepCircleActive,
                    ]}>
                      {isCompleted ? (
                        <Icon name="checkmark" size={13} color="#ffffff" />
                      ) : isActive ? (
                        <View style={styles.stepPulse} />
                      ) : (
                        <View style={styles.stepDot} />
                      )}
                    </View>
                    {!isLast && (
                      <View style={[styles.stepLine, isCompleted && styles.stepLineCompleted]} />
                    )}
                  </View>
                  <View style={styles.stepContent}>
                    <Text style={[
                      styles.stepLabel,
                      isCompleted && styles.stepLabelCompleted,
                      isActive && styles.stepLabelActive,
                    ]}>
                      {meta.label}
                    </Text>
                    {isActive && <Text style={styles.stepSubtext}>In progress</Text>}
                    {isCompleted && <Text style={styles.stepSubtextCompleted}>✓ Done</Text>}
                  </View>
                </View>
              );
            })}
          </View>
        )}

        {/* Delivery address */}
        {order.delivery && (
          <View style={[styles.card, styles.detailsCard, isDesktopWeb && styles.cardDesktop]}>
            <Text style={styles.detailsTitle}>Delivery Details</Text>
            <View style={styles.detailRow}>
              <View style={styles.detailIconWrap}>
                <Icon name="storefront-outline" size={14} color={PURPLE} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.detailLabel}>Pickup</Text>
                <Text style={styles.detailValue}>{order.delivery.pickup_address}</Text>
              </View>
            </View>
            <View style={[styles.detailRow, { borderBottomWidth: 0 }]}>
              <View style={styles.detailIconWrap}>
                <Icon name="location-outline" size={14} color={PURPLE} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.detailLabel}>Delivery</Text>
                <Text style={styles.detailValue}>{order.delivery.drop_address}</Text>
              </View>
            </View>
          </View>
        )}
        {/* Ordered items */}
{order.items && order.items.length > 0 && (
  <View style={[styles.card, styles.detailsCard, isDesktopWeb && styles.cardDesktop]}>
    <Text style={styles.detailsTitle}>Items Ordered</Text>
    {order.items.map((item, index) => (
      <View
        key={item.id}
        style={[
          styles.itemRow,
          index === order.items.length - 1 && { borderBottomWidth: 0 },
        ]}
      >
        <View style={{ flex: 1 }}>
          <Text style={styles.itemName}>{item.product_name}</Text>
          <Text style={styles.itemQty}>Qty: {item.qty}</Text>
        </View>
        <Text style={styles.itemPrice}>₹{(item.qty * item.unit_price).toFixed(2)}</Text>
      </View>
    ))}
  </View>
)}
        {trackingStatus === 'DELIVERED' && (
          <TouchableOpacity
            style={[styles.homeButton, isDesktopWeb && styles.homeButtonDesktop]}
            onPress={handleGoHome}
          >
            <Icon name="home-outline" size={19} color="#ffffff" />
            <Text style={styles.homeButtonText}>Back to Home</Text>
          </TouchableOpacity>
        )}

        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG_SOFT },
  centerFill: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  loadingText: { fontFamily: FONT_FAMILY, fontSize: 13.5, color: TEXT_SECONDARY, marginTop: 12 },
  errorIconWrap: { width: 76, height: 76, borderRadius: 38, backgroundColor: DANGER_BG, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  errorText: { fontFamily: FONT_FAMILY, fontSize: 15, color: TEXT_SECONDARY, textAlign: 'center', marginTop: 2, marginBottom: 20, lineHeight: 21 },
  retryButton: { backgroundColor: PURPLE, paddingHorizontal: 28, paddingVertical: 11, borderRadius: 10 },
  retryButtonText: { fontFamily: FONT_FAMILY, color: '#ffffff', fontSize: 14, fontWeight: '700' },

  // Header
  header: { backgroundColor: BG, borderBottomWidth: 1, borderBottomColor: BORDER },
  headerInner: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10 },
  headerInnerDesktop: { width: '100%', maxWidth: DESKTOP_MAX_WIDTH, alignSelf: 'center', paddingHorizontal: 8, paddingVertical: 8 },
  backButton: { padding: 4 },
  headerTitle: { flex: 1, fontFamily: FONT_FAMILY, fontSize: 17, fontWeight: '700', color: TEXT_MAIN, textAlign: 'center' },
  headerTitleDesktop: {
    flex: 0,
    flexShrink: 0,
    flexGrow: 0,
    fontSize: 19,
    lineHeight: 22,
    textAlign: 'left',
    marginLeft: 12,
    ...(Platform.OS === 'web' ? ({ whiteSpace: 'nowrap' } as any) : {}),
  },
  refreshButton: { padding: 4, width: 32, alignItems: 'center' },

  // Scroll / desktop centering
  scrollContentDesktop: { alignItems: 'center' },

  // Shared card
  card: { backgroundColor: BG, borderRadius: 14, borderWidth: 1, borderColor: BORDER, marginHorizontal: 16, marginTop: 10 },
  cardDesktop: { width: '100%', maxWidth: DESKTOP_MAX_WIDTH, marginHorizontal: 0, alignSelf: 'center' },

  // Order summary
  summaryCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 14 },
  summaryHeader: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  summaryIcon: { width: 42, height: 42, borderRadius: 12, backgroundColor: PURPLE, justifyContent: 'center', alignItems: 'center' },
  summaryIconText: { fontFamily: FONT_FAMILY, fontSize: 18, fontWeight: '700', color: '#ffffff' },
  summaryInfo: { marginLeft: 12, flex: 1 },
  summaryOrderName: { fontFamily: FONT_FAMILY, fontSize: 15.5, fontWeight: '700', color: TEXT_MAIN },
  summaryShopName: { fontFamily: FONT_FAMILY, fontSize: 12.5, color: PURPLE_DARK, fontWeight: '600', marginTop: 1 },

  summaryTime: { fontFamily: FONT_FAMILY, fontSize: 12, color: TEXT_SECONDARY, marginTop: 1 },
  amountBadge: { backgroundColor: PURPLE_LIGHT, paddingHorizontal: 11, paddingVertical: 5, borderRadius: 18 },
  amountBadgeText: { fontFamily: FONT_FAMILY, fontSize: 13, color: PURPLE_DARK, fontWeight: '700' },
  
  itemRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: BORDER },
itemName: { fontFamily: FONT_FAMILY, fontSize: 13.5, fontWeight: '600', color: TEXT_MAIN },
itemQty: { fontFamily: FONT_FAMILY, fontSize: 11.5, color: TEXT_SECONDARY, marginTop: 1 },
itemPrice: { fontFamily: FONT_FAMILY, fontSize: 13.5, fontWeight: '700', color: PURPLE_DARK },
  // Status card
  statusCard: { alignItems: 'center', padding: 14 },
  statusIconWrap: { width: 46, height: 46, borderRadius: 23, alignItems: 'center', justifyContent: 'center', marginBottom: 6 },
  statusTitle: { fontFamily: FONT_FAMILY, fontSize: 17, fontWeight: '700', color: TEXT_MAIN, marginBottom: 3 },
  statusMessage: { fontFamily: FONT_FAMILY, fontSize: 13, color: TEXT_SECONDARY, textAlign: 'center', lineHeight: 17 },

  // Driver card
  driverCard: { flexDirection: 'row', alignItems: 'center', padding: 12 },
  driverAvatar: { width: 38, height: 38, borderRadius: 19, backgroundColor: PURPLE_LIGHT, alignItems: 'center', justifyContent: 'center' },
  driverName: { fontFamily: FONT_FAMILY, fontSize: 14, fontWeight: '700', color: TEXT_MAIN },
  driverPhone: { fontFamily: FONT_FAMILY, fontSize: 12, color: TEXT_SECONDARY, marginTop: 1 },

  // Timeline
  stepsCard: { padding: 16, paddingBottom: 4 },
  stepItem: { flexDirection: 'row', marginBottom: 10 },
  stepItemLast: { marginBottom: 0 },
  stepIndicator: { alignItems: 'center', marginRight: 14, position: 'relative' },
  stepCircle: { width: 26, height: 26, borderRadius: 13, backgroundColor: BG_SOFT, borderWidth: 1, borderColor: BORDER, justifyContent: 'center', alignItems: 'center', zIndex: 1 },
  stepCircleCompleted: { backgroundColor: SUCCESS, borderColor: SUCCESS },
  stepCircleActive: { backgroundColor: PURPLE, borderColor: PURPLE },
  stepPulse: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#ffffff' },
  stepDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#d4d1e3' },
  stepLine: { position: 'absolute', top: 26, width: 2, height: 24, backgroundColor: BORDER },
  stepLineCompleted: { backgroundColor: SUCCESS },
  stepContent: { flex: 1, justifyContent: 'center' },
  stepLabel: { fontFamily: FONT_FAMILY, fontSize: 13.5, color: TEXT_SECONDARY },
  stepLabelCompleted: { color: SUCCESS, fontWeight: '600' },
  stepLabelActive: { color: PURPLE, fontWeight: '700' },
  stepSubtext: { fontFamily: FONT_FAMILY, fontSize: 10.5, color: PURPLE, marginTop: 1, fontWeight: '600' },
  stepSubtextCompleted: { fontFamily: FONT_FAMILY, fontSize: 10.5, color: SUCCESS, marginTop: 1, fontWeight: '600' },

  // Delivery details
  detailsCard: { padding: 14 },
  detailsTitle: { fontFamily: FONT_FAMILY, fontSize: 15, fontWeight: '700', color: TEXT_MAIN, marginBottom: 6 },
  detailRow: { flexDirection: 'row', alignItems: 'flex-start', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: BORDER },
  detailIconWrap: { width: 24, height: 24, borderRadius: 7, backgroundColor: PURPLE_LIGHT, alignItems: 'center', justifyContent: 'center', marginRight: 10, marginTop: 1 },
  detailLabel: { fontFamily: FONT_FAMILY, fontSize: 11, color: TEXT_SECONDARY, marginBottom: 1 },
  detailValue: { fontFamily: FONT_FAMILY, fontSize: 13, color: TEXT_MAIN, fontWeight: '600' },

  // Home button
  homeButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: PURPLE, marginHorizontal: 16, marginTop: 14, paddingVertical: 12, borderRadius: 12, gap: 8 },
  homeButtonDesktop: { width: '100%', maxWidth: DESKTOP_MAX_WIDTH, marginHorizontal: 0, alignSelf: 'center' },
  homeButtonText: { fontFamily: FONT_FAMILY, color: '#ffffff', fontSize: 14, fontWeight: '700' },

  bottomPadding: { height: 16 },
});

export default OrderTrackingScreen;