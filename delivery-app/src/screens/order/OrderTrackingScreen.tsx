
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
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { ordersApi, CustomerOrder, CUSTOMER_TRACKING_STEPS } from '../../api/orders';

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

const POLL_INTERVAL_MS = 15000; // fallback polling — swap for Supabase Realtime later if enabled

const OrderTrackingScreen: React.FC<OrderTrackingScreenProps> = ({ navigation, route }) => {
  const { orderId } = route.params || {};

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

  const handleGoHome = () => navigation.navigate('Home');

  // ── Loading state ──────────────────────────────────────────
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Icon name="arrow-back" size={24} color="#282c3f" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Order Tracking</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.centerFill}>
          <ActivityIndicator size="large" color="#fc8019" />
        </View>
      </SafeAreaView>
    );
  }

  // ── Error / fallback state ─────────────────────────────────
  if (error || !order) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Icon name="arrow-back" size={24} color="#282c3f" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Order Tracking</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.centerFill}>
          <Icon name="alert-circle-outline" size={48} color="#dc3545" />
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
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#282c3f" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Order Tracking</Text>
        <TouchableOpacity style={styles.refreshButton} onPress={() => { setRefreshing(true); fetchTracking(true); }}>
          {refreshing ? <ActivityIndicator size="small" color="#fc8019" /> : <Icon name="refresh-outline" size={22} color="#fc8019" />}
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Order summary */}
        <View style={styles.restaurantContainer}>
          <View style={styles.restaurantHeader}>
            <View style={styles.restaurantIcon}>
              <Text style={styles.restaurantIconText}>#</Text>
            </View>
            <View style={styles.restaurantInfo}>
              <Text style={styles.restaurantName}>Order #{order.id}</Text>
              <Text style={styles.orderTime}>
                Placed on {new Date(order.entry_date).toLocaleDateString()}
              </Text>
            </View>
          </View>
          <View style={styles.orderIdBadge}>
            <Text style={styles.orderIdText}>₹{order.amount}</Text>
          </View>
        </View>

        {/* Current status */}
        <View style={styles.progressContainer}>
          <View style={styles.statusHeader}>
            <Icon name={isCancelled ? 'close-circle' : (activeMeta.icon as any)} size={28} color={isCancelled ? '#dc3545' : '#fc8019'} />
            <Text style={styles.statusTitle}>{isCancelled ? 'Cancelled' : activeMeta.label}</Text>
          </View>
          <Text style={styles.statusMessage}>
            {isCancelled ? 'This order has been cancelled.' : activeMeta.message}
          </Text>
        </View>

        {/* Driver info — only shown once a driver is assigned */}
        {order.delivery?.driver_name && !isCancelled && (
          <View style={styles.driverCard}>
            <Icon name="person-circle-outline" size={32} color="#fc8019" />
            <View style={{ marginLeft: 10, flex: 1 }}>
              <Text style={styles.driverName}>{order.delivery.driver_name}</Text>
              <Text style={styles.driverPhone}>{order.delivery.driver_phone || 'No phone on file'}</Text>
            </View>
          </View>
        )}

        {/* 6-stage timeline */}
        {!isCancelled && (
          <View style={styles.stepsContainer}>
            {CUSTOMER_TRACKING_STEPS.map((step, index) => {
              const isCompleted = index < currentStepIndex;
              const isActive = index === currentStepIndex;
              const meta = STAGE_META[step];

              return (
                <View key={step} style={styles.stepItem}>
                  <View style={styles.stepIndicator}>
                    <View style={[
                      styles.stepCircle,
                      isCompleted && styles.stepCircleCompleted,
                      isActive && styles.stepCircleActive,
                    ]}>
                      {isCompleted ? (
                        <Icon name="checkmark" size={16} color="#ffffff" />
                      ) : isActive ? (
                        <View style={styles.stepPulse} />
                      ) : (
                        <View style={styles.stepDot} />
                      )}
                    </View>
                    {index < CUSTOMER_TRACKING_STEPS.length - 1 && (
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
          <View style={styles.detailsCard}>
            <Text style={styles.detailsTitle}>Delivery Details</Text>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Pickup</Text>
              <Text style={styles.detailValue}>{order.delivery.pickup_address}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Delivery</Text>
              <Text style={styles.detailValue}>{order.delivery.drop_address}</Text>
            </View>
          </View>
        )}

        {trackingStatus === 'DELIVERED' && (
          <TouchableOpacity style={styles.homeButton} onPress={handleGoHome}>
            <Icon name="home-outline" size={20} color="#ffffff" />
            <Text style={styles.homeButtonText}>Back to Home</Text>
          </TouchableOpacity>
        )}

        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  centerFill: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  errorText: { fontSize: 15, color: '#7e808c', textAlign: 'center', marginTop: 12, marginBottom: 20 },
  retryButton: { backgroundColor: '#fc8019', paddingHorizontal: 24, paddingVertical: 10, borderRadius: 8 },
  retryButtonText: { color: '#ffffff', fontSize: 14, fontWeight: '600' },

  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#ffffff', borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  backButton: { padding: 4 },
  headerTitle: { flex: 1, fontSize: 18, fontWeight: '600', color: '#282c3f', textAlign: 'center' },
  refreshButton: { padding: 4, width: 32, alignItems: 'center' },

  restaurantContainer: { backgroundColor: '#ffffff', margin: 16, padding: 16, borderRadius: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', elevation: 2 },
  restaurantHeader: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  restaurantIcon: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#fc8019', justifyContent: 'center', alignItems: 'center' },
  restaurantIconText: { fontSize: 20, fontWeight: '700', color: '#ffffff' },
  restaurantInfo: { marginLeft: 12, flex: 1 },
  restaurantName: { fontSize: 16, fontWeight: '600', color: '#282c3f' },
  orderTime: { fontSize: 12, color: '#7e808c', marginTop: 2 },
  orderIdBadge: { backgroundColor: '#f0f0f5', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 },
  orderIdText: { fontSize: 13, color: '#282c3f', fontWeight: '700' },

  progressContainer: { backgroundColor: '#ffffff', marginHorizontal: 16, padding: 20, borderRadius: 12, alignItems: 'center', elevation: 2 },
  statusHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  statusTitle: { fontSize: 20, fontWeight: '700', color: '#282c3f' },
  statusMessage: { fontSize: 14, color: '#7e808c', textAlign: 'center' },

  driverCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#ffffff', marginHorizontal: 16, marginTop: 12, padding: 14, borderRadius: 12, elevation: 1 },
  driverName: { fontSize: 14, fontWeight: '600', color: '#282c3f' },
  driverPhone: { fontSize: 12, color: '#7e808c', marginTop: 2 },

  stepsContainer: { backgroundColor: '#ffffff', margin: 16, padding: 20, borderRadius: 12, elevation: 2 },
  stepItem: { flexDirection: 'row', marginBottom: 16 },
  stepIndicator: { alignItems: 'center', marginRight: 16, position: 'relative' },
  stepCircle: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#f0f0f5', justifyContent: 'center', alignItems: 'center', zIndex: 1 },
  stepCircleCompleted: { backgroundColor: '#28a745' },
  stepCircleActive: { backgroundColor: '#fc8019' },
  stepPulse: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#ffffff', borderWidth: 2, borderColor: '#fc8019' },
  stepDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#d0d0d0' },
  stepLine: { position: 'absolute', top: 32, width: 2, height: 40, backgroundColor: '#e0e0e0' },
  stepLineCompleted: { backgroundColor: '#28a745' },
  stepContent: { flex: 1, justifyContent: 'center' },
  stepLabel: { fontSize: 14, color: '#7e808c' },
  stepLabelCompleted: { color: '#28a745', fontWeight: '500' },
  stepLabelActive: { color: '#fc8019', fontWeight: '600' },
  stepSubtext: { fontSize: 11, color: '#fc8019', marginTop: 2 },
  stepSubtextCompleted: { fontSize: 11, color: '#28a745', marginTop: 2 },

  detailsCard: { backgroundColor: '#ffffff', marginHorizontal: 16, padding: 16, borderRadius: 12, marginTop: 4, elevation: 2 },
  detailsTitle: { fontSize: 16, fontWeight: '600', color: '#282c3f', marginBottom: 12 },
  detailRow: { paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: '#f0f0f5' },
  detailLabel: { fontSize: 12, color: '#7e808c', marginBottom: 2 },
  detailValue: { fontSize: 14, color: '#282c3f', fontWeight: '500' },

  homeButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fc8019', marginHorizontal: 16, marginTop: 16, paddingVertical: 14, borderRadius: 10, gap: 8 },
  homeButtonText: { color: '#ffffff', fontSize: 14, fontWeight: '600' },

  bottomPadding: { height: 30 },
});

export default OrderTrackingScreen;