
import React, { useState, useContext, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  FlatList,
  TouchableOpacity,
  Alert,
  RefreshControl,
  Modal,
  ActivityIndicator,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { ordersApi, CustomerOrder, CustomerTrackingStatus } from '../../api/orders';
import notificationService, { Notification } from '../../services/notificationService';
import { AuthContext } from '../../context/AuthContext';
import { SelectedBusinessContext } from '../../context/SelectedBusinessContext';

const OrdersScreen: React.FC = ({ navigation }: any) => {
  const [activeTab, setActiveTab] = useState<'current' | 'past' | 'cancelled'>('current');
  const [refreshing, setRefreshing] = useState(false);
  const [ordersList, setOrdersList] = useState<CustomerOrder[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [ordersError, setOrdersError] = useState<string | null>(null);

  const { user } = useContext(AuthContext);
  const { selectedBusiness } = useContext(SelectedBusinessContext);

  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [notificationLoading, setNotificationLoading] = useState(false);
  const [notificationError, setNotificationError] = useState<string | null>(null);

  const driverId = (user as any)?.driver_id;
  const businessId = selectedBusiness?.id ?? user?.business_id;

  // ── Orders: real backend fetch ──────────────────────────────
  const fetchOrders = useCallback(async (silent = false) => {
    try {
      if (!silent) setOrdersLoading(true);
      const res = await ordersApi.getMyOrders();
      setOrdersList(res.data ?? []);
      setOrdersError(null);
    } catch (err: any) {
      if (!silent) setOrdersError(err?.message || 'Unable to load your orders. Please try again.');
    } finally {
      if (!silent) setOrdersLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders(false);
  }, [fetchOrders]);

  // ── Notifications (unchanged — already wired to real backend) ──
  const fetchNotifications = async () => {
    if (!driverId && !businessId) {
      console.error('❌ No driver_id or business_id found for user');
      setNotificationError('No account association found. Please contact support.');
      return;
    }
    try {
      setNotificationLoading(true);
      setNotificationError(null);
      const data = await notificationService.getNotifications({
        ...(driverId ? { driver_id: driverId } : {}),
        ...(businessId ? { business_id: businessId } : {}),
        limit: 50,
      });
      setNotifications(data);
    } catch (error) {
      console.error('❌ Error fetching notifications:', error);
      setNotificationError('Failed to load notifications');
    } finally {
      setNotificationLoading(false);
    }
  };

  useEffect(() => {
    if (showNotifications) fetchNotifications();
  }, [showNotifications, businessId]);

  const handleMarkAsRead = async (notificationId: number) => {
    try {
      await notificationService.markAsRead(notificationId);
      setNotifications((prev) => prev.map((n) => (n.id === notificationId ? { ...n, is_read: true } : n)));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    if (!driverId && !businessId) {
      Alert.alert('Error', 'No account associated');
      return;
    }
    try {
      await notificationService.markAllAsRead({
        ...(driverId ? { driver_id: driverId } : {}),
        ...(businessId ? { business_id: businessId } : {}),
      });
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
      Alert.alert('✅', 'All notifications marked as read');
    } catch (error) {
      console.error('Error marking all as read:', error);
      Alert.alert('Error', 'Failed to mark all as read');
    }
  };

  const handleCloseNotification = async (notificationId: number) => {
    const previousNotifications = notifications;
    setNotifications((prev) => prev.filter((n) => String(n.id) !== String(notificationId)));
    try {
      await notificationService.deleteNotification(notificationId);
    } catch (error) {
      console.error('❌ Error deleting notification (restoring card):', error);
      setNotifications(previousNotifications);
    }
  };

  const formatNotificationDate = (dateString: string) => {
    if (!dateString) return 'Just now';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Just now';
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffSec = Math.floor(diffMs / 1000);
      const diffMin = Math.floor(diffSec / 60);
      const diffHour = Math.floor(diffMin / 60);
      const diffDay = Math.floor(diffHour / 24);
      if (diffSec < 60) return 'Just now';
      else if (diffMin < 60) return `${diffMin}m ago`;
      else if (diffHour < 24) return `${diffHour}h ago`;
      else if (diffDay === 1) return 'Yesterday';
      else return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
    } catch (e) {
      return 'Just now';
    }
  };

  const parseAmazonRealUI = (type: string, rawMessage: string, id: number, isRead: boolean) => {
    let title = 'Order Update';
    let bodyText = 'Your order status has been updated.';
    let deliveryLocation = 'Preparing...';
    // let orderId = `Order #${String(id)}`;
    const orderIdMatch = rawMessage?.match(/order\s*#\s*(\d+)/i);
let orderId = orderIdMatch ? `Order #${orderIdMatch[1]}` : `Order #${String(id)}`;
const numericOrderId = orderIdMatch ? parseInt(orderIdMatch[1], 10) : null;
    let buttonText = 'View order details';
    let isUnread = !isRead;

    if (type === 'assigned') {
      title = 'Driver Assigned';
      bodyText = 'A driver has been assigned to your order.';
      const addressMatch = rawMessage?.match(/deliver to\s*([^,.]*)/i);
      deliveryLocation = addressMatch?.[1]?.trim() || 'Preparing...';
    } else if (type === 'order_confirmed' || type === 'confirmed') {
      title = 'Your order is confirmed';
      bodyText = 'Thank you for your order. Your order has been confirmed.';
      const addressMatch = rawMessage?.match(/deliver to\s*([^,.]*)/i);
      deliveryLocation = addressMatch?.[1]?.trim() || 'Today';
    } else if (type === 'completed') {
      title = 'Your order is delivered';
      bodyText = 'Your package has been delivered successfully.';
      deliveryLocation = 'Delivered';
    } else if (type === 'address_updated') {
      title = 'Delivery Address Updated';
      bodyText = 'Your delivery address has been updated.';
      deliveryLocation = 'Updated';
    } else if (type === 'payment_received') {
      title = 'Payment Received';
      bodyText = 'Your payment has been received.';
      deliveryLocation = 'Confirmed';
    }

    return { title, bodyText, deliveryLocation, orderId, numericOrderId, buttonText, isUnread };
  };

  const renderNotification = ({ item }: { item: Notification }) => {
    // const { title, bodyText, deliveryLocation, orderId, buttonText, isUnread } = parseAmazonRealUI(
    //   item.type,
    //   item.message,
    //   item.id,
    //   item.is_read,
    // );
    const { title, bodyText, deliveryLocation, orderId, numericOrderId, buttonText, isUnread } = parseAmazonRealUI(
  item.type,
  item.message,
  item.id,
  item.is_read,
);
    return (
      <View style={styles.amazonCard}>
        <View style={styles.amazonCardHeader}>
          <View style={styles.amazonTitleRow}>
            <View style={styles.amazonIconCircle}>
              <Icon name="bag-check-outline" size={18} color="#fff" />
            </View>
            <View style={styles.amazonTitleColumn}>
              <Text style={styles.amazonTitleText}>{title}</Text>
              <Text style={styles.amazonTimeText}>{formatNotificationDate(item.created_at)}</Text>
            </View>
          </View>
          <View style={styles.amazonHeaderRight}>
            {isUnread && <View style={styles.amazonUnreadDot} />}
            <TouchableOpacity onPress={() => handleCloseNotification(item.id)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Icon name="close" size={20} color="#ccc" />
            </TouchableOpacity>
          </View>
        </View>
        <Text style={styles.amazonBodyText}>{bodyText}</Text>
        <Text style={styles.amazonOrderIdText}>{orderId}</Text>
        <View style={styles.amazonDeliveryCard}>
          <View style={styles.amazonDeliveryLeft}>
            <Text style={styles.amazonDeliveryTitle}>Arriving by</Text>
            <Text style={styles.amazonDeliveryDate}>{deliveryLocation}</Text>
          </View>
          <View style={styles.amazonProductImagePlaceholder} />
        </View>
        {/* <TouchableOpacity
          style={styles.amazonActionButton}
          onPress={() => {
            handleMarkAsRead(item.id);
            setShowNotifications(false);
          }}
        > */}
        <TouchableOpacity
  style={styles.amazonActionButton}
  onPress={() => {
    handleMarkAsRead(item.id);
    setShowNotifications(false);
    if (numericOrderId) {
      navigation.navigate('OrderTracking', { orderId: numericOrderId });   // ✅ ADD THIS — navigate to the exact order
    }
  }}
>
          <Text style={styles.amazonActionButtonText}>{buttonText}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  // ── Order status → display meta ─────────────────────────────
  const STATUS_META: Record<CustomerTrackingStatus, { label: string; color: string; icon: string }> = {
    ORDER_PLACED: { label: 'Placed', color: '#ffc107', icon: 'time' },
    ORDER_CONFIRMED: { label: 'Confirmed', color: '#17a2b8', icon: 'checkmark-circle' },
    DRIVER_ASSIGNED: { label: 'Driver Assigned', color: '#17a2b8', icon: 'person' },
    PICKED_UP: { label: 'Picked Up', color: '#7C3AED', icon: 'cube' },
    OUT_FOR_DELIVERY: { label: 'On the way', color: '#fc8019', icon: 'bicycle' },
    DELIVERED: { label: 'Delivered', color: '#28a745', icon: 'checkmark-circle' },
    CANCELLED: { label: 'Cancelled', color: '#dc3545', icon: 'close-circle' },
  };

  const getFilteredOrders = (tab: 'current' | 'past' | 'cancelled') => {
    return ordersList.filter((order) => {
      if (tab === 'current') return order.tracking_status !== 'DELIVERED' && order.tracking_status !== 'CANCELLED';
      if (tab === 'past') return order.tracking_status === 'DELIVERED';
      return order.tracking_status === 'CANCELLED';
    });
  };

  const filteredOrders = getFilteredOrders(activeTab);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diff = now.getTime() - date.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      if (hours < 24) return `Today • ${date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}`;
      else if (hours < 48) return 'Yesterday';
      else return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    } catch (e) {
      return 'Just now';
    }
  };

  // ── Cancel order: real backend call ─────────────────────────
  // PUT /customers/me/orders/:id/cancel — only allowed while the order is
  // still "pending" on the server. On success we patch tracking_status
  // locally so the card moves to the Cancelled tab immediately.
  //
  // ⚠️ Alert.alert's multi-button confirm dialog does not render on
  // React Native Web — it silently no-ops. So on web we fall back to
  // window.confirm / window.alert; on native (iOS/Android) we keep the
  // normal Alert.alert flow.
  const doCancelOrder = async (item: CustomerOrder) => {
    try {
      const updatedOrder = await ordersApi.cancelOrder(item.id);
      // ✅ backend confirmed cancellation — update local state
      // so the card moves to the Cancelled tab immediately
      setOrdersList((prev) =>
        prev.map((o) =>
          o.id === item.id ? { ...o, tracking_status: updatedOrder.tracking_status } : o,
        ),
      );
      const successMsg = `Order #${item.id} has been cancelled.`;
      if (Platform.OS === 'web') {
        window.alert(successMsg);
      } else {
        Alert.alert('Order Cancelled', successMsg);
      }
    } catch (err: any) {
      console.error('❌ Error cancelling order:', err);
      const errorMsg =
        err?.response?.data?.error || 'This order could not be cancelled. Please try again.';
      if (Platform.OS === 'web') {
        window.alert(errorMsg);
      } else {
        Alert.alert('Unable to cancel', errorMsg);
      }
      // ✅ resync from server in case status already changed there
      fetchOrders(true);
    }
  };

  const handleCancelOrder = (item: CustomerOrder) => {
    console.log('🔴 1. handleCancelOrder called for order', item.id);
    console.log('🔴 2. Platform.OS is:', Platform.OS);

    if (Platform.OS === 'web') {
      console.log('🔴 3a. Taking WEB branch — calling window.confirm');
      const confirmed = window.confirm(`Are you sure you want to cancel Order #${item.id}?`);
      console.log('🔴 4a. window.confirm returned:', confirmed);
      if (confirmed) doCancelOrder(item);
      return;
    }

    console.log('🔴 3b. Taking NATIVE branch — calling Alert.alert');
    Alert.alert(
      'Cancel Order',
      `Are you sure you want to cancel Order #${item.id}?`,
      [
        { text: 'No', style: 'cancel' },
        { text: 'Yes, Cancel', style: 'destructive', onPress: () => doCancelOrder(item) },
      ],
    );
    console.log('🔴 4b. Alert.alert call finished (this logs even if dialog is not visible)');
  };

  const handleViewOrder = (item: CustomerOrder) => {
    navigation.navigate('OrderTracking', { orderId: item.id });
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    Promise.all([fetchOrders(true), showNotifications ? fetchNotifications() : Promise.resolve()]).finally(() =>
      setRefreshing(false),
    );
  }, [fetchOrders, showNotifications, businessId]);

  const getTabCount = (tab: 'current' | 'past' | 'cancelled') => getFilteredOrders(tab).length;
  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const renderOrder = ({ item }: { item: CustomerOrder }) => {
    const isCurrent = activeTab === 'current';
    const isCancelled = activeTab === 'cancelled';
    const isPast = activeTab === 'past';
    const meta = STATUS_META[item.tracking_status] ?? STATUS_META.ORDER_PLACED;
    const showCancelButton = isCurrent && item.tracking_status === 'ORDER_PLACED';
    const showViewButton = true;

    return (
      <TouchableOpacity style={[styles.orderCard, isCancelled && styles.cancelledCard]} onPress={() => handleViewOrder(item)} activeOpacity={0.7}>
        <View style={styles.orderHeader}>
          <View style={styles.orderLeft}>
            <Text style={styles.orderRestaurant}>Order #{item.id}</Text>
            <Text style={styles.orderDetails}>₹{item.amount}</Text>
            {item.delivery?.driver_name && (
              <Text style={styles.orderId}>Driver: {item.delivery.driver_name}</Text>
            )}
          </View>
          <View style={[styles.statusBadge, { backgroundColor: meta.color + '20' }]}>
            <Icon name={meta.icon as any} size={14} color={meta.color} />
            <Text style={[styles.statusText, { color: meta.color }]}>{meta.label}</Text>
          </View>
        </View>
        <View style={styles.orderFooter}>
          <Text style={styles.orderTime}>{formatDate(item.entry_date)}</Text>
          <View style={styles.footerButtons}>
            {showCancelButton && (
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={(e) => {
                  e.stopPropagation();
                  handleCancelOrder(item);
                }}
                activeOpacity={0.8}
              >
                <Icon name="close-outline" size={14} color="#dc3545" />
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            )}
            {showViewButton && (
              <TouchableOpacity
                style={styles.viewButton}
                onPress={(e) => {
                  e.stopPropagation();
                  handleViewOrder(item);
                }}
                activeOpacity={0.8}
              >
                <Icon name="eye-outline" size={14} color="#fc8019" />
                <Text style={styles.viewButtonText}>Track</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#282c3f" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Orders</Text>
        <TouchableOpacity style={styles.headerRight} onPress={() => setShowNotifications(true)}>
          <Icon name="notifications-outline" size={24} color="#fc8019" />
          {unreadCount > 0 && (
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationBadgeText}>{unreadCount > 9 ? '9+' : unreadCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.tabsContainer}>
        {['current', 'past', 'cancelled'].map((tab) => (
          <TouchableOpacity key={tab} style={[styles.tab, activeTab === tab && styles.activeTab]} onPress={() => setActiveTab(tab as any)} activeOpacity={0.7}>
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab.charAt(0).toUpperCase() + tab.slice(1)}</Text>
            {getTabCount(tab as any) > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{getTabCount(tab as any)}</Text>
              </View>
            )}
            {activeTab === tab && <View style={styles.tabIndicator} />}
          </TouchableOpacity>
        ))}
      </View>

      {ordersLoading ? (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color="#fc8019" />
        </View>
      ) : ordersError ? (
        <View style={styles.emptyContainer}>
          <Icon name="alert-circle-outline" size={50} color="#dc3545" />
          <Text style={styles.emptyText}>Unable to load your orders.</Text>
          <Text style={styles.emptySubText}>{ordersError}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => fetchOrders(false)}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filteredOrders}
          renderItem={renderOrder}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.ordersList}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Icon name="clipboard-outline" size={60} color="#ccc" />
              <Text style={styles.emptyText}>
                {activeTab === 'current' && 'No current orders'}
                {activeTab === 'past' && 'No past orders'}
                {activeTab === 'cancelled' && 'No cancelled orders'}
              </Text>
              <Text style={styles.emptySubText}>
                {activeTab === 'current' && 'Your current orders will appear here'}
                {activeTab === 'past' && 'Your past orders will appear here'}
                {activeTab === 'cancelled' && 'Cancelled orders will appear here'}
              </Text>
            </View>
          }
        />
      )}

      {/* NOTIFICATION MODAL — unchanged */}
      <Modal visible={showNotifications} animationType="slide" transparent={false} onRequestClose={() => setShowNotifications(false)}>
        <SafeAreaView style={styles.amazonModalContainer}>
          <View style={styles.amazonModalHeader}>
            <TouchableOpacity style={styles.amazonModalBackButton} onPress={() => setShowNotifications(false)}>
              <Icon name="arrow-back" size={24} color="#232f3e" />
            </TouchableOpacity>
            <Text style={styles.amazonModalTitle}>Your Notifications</Text>
            {unreadCount > 0 && (
              <TouchableOpacity style={styles.amazonModalActionButton} onPress={handleMarkAllAsRead}>
                <Text style={styles.amazonModalActionText}>Mark all as read</Text>
              </TouchableOpacity>
            )}
          </View>
          {notificationLoading ? (
            <View style={styles.loadingContainer}>
              <Text>Loading notifications...</Text>
            </View>
          ) : notificationError ? (
            <View style={styles.errorContainer}>
              <Icon name="alert-circle-outline" size={50} color="#dc3545" />
              <Text style={styles.errorText}>{notificationError}</Text>
              <TouchableOpacity style={styles.retryButton} onPress={fetchNotifications}>
                <Text style={styles.retryButtonText}>Retry</Text>
              </TouchableOpacity>
            </View>
          ) : notifications.length === 0 ? (
            <View style={styles.emptyNotifications}>
              <Icon name="notifications-off-outline" size={60} color="#ccc" />
              <Text style={styles.emptyNotificationsText}>No notifications</Text>
              <Text style={styles.emptyNotificationsSubText}>You're all caught up!</Text>
            </View>
          ) : (
            <FlatList
              data={notifications}
              renderItem={renderNotification}
              keyExtractor={(item) => item.id.toString()}
              contentContainerStyle={styles.amazonNotificationsList}
              showsVerticalScrollIndicator={false}
            />
          )}
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

// styles unchanged from original — keep exactly as-is
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 14, backgroundColor: '#ffffff', borderBottomWidth: 1, borderBottomColor: '#f0f0f0', elevation: 2 },
  backButton: { padding: 4 },
  headerTitle: { flex: 1, fontSize: 18, fontWeight: '600', color: '#282c3f', textAlign: 'center' },
  headerRight: { padding: 4, position: 'relative' },
  notificationBadge: { position: 'absolute', top: -4, right: -4, backgroundColor: '#dc3545', borderRadius: 10, minWidth: 18, height: 18, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 4 },
  notificationBadgeText: { color: '#ffffff', fontSize: 10, fontWeight: '600' },
  tabsContainer: { flexDirection: 'row', backgroundColor: '#ffffff', borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  tab: { flex: 1, paddingVertical: 14, alignItems: 'center', position: 'relative', flexDirection: 'row', justifyContent: 'center' },
  activeTab: {},
  tabText: { fontSize: 14, color: '#7e808c', fontWeight: '500' },
  activeTabText: { color: '#fc8019', fontWeight: '600' },
  badge: { backgroundColor: '#fc8019', borderRadius: 10, paddingHorizontal: 6, paddingVertical: 2, marginLeft: 6, minWidth: 20, alignItems: 'center' },
  badgeText: { color: '#ffffff', fontSize: 10, fontWeight: '600' },
  tabIndicator: { position: 'absolute', bottom: 0, left: '25%', right: '25%', height: 3, backgroundColor: '#fc8019', borderRadius: 2 },
  ordersList: { padding: 16, paddingBottom: 80 },
  orderCard: { backgroundColor: '#ffffff', borderRadius: 12, padding: 16, marginBottom: 14, borderWidth: 1, borderColor: '#e8e8e8', elevation: 1 },
  cancelledCard: { opacity: 0.7, borderColor: '#dc3545' },
  orderHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  orderLeft: { flex: 1 },
  orderRestaurant: { fontSize: 16, fontWeight: '600', color: '#282c3f', marginBottom: 2 },
  orderDetails: { fontSize: 13, color: '#7e808c', marginTop: 2 },
  orderId: { fontSize: 11, color: '#999', marginTop: 2 },
  statusBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, marginLeft: 8 },
  statusText: { fontSize: 12, fontWeight: '500', marginLeft: 4 },
  productsContainer: { marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: '#f0f0f0' },
  productItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 4 },
  productName: { flex: 1, fontSize: 13, color: '#282c3f' },
  productQuantity: { fontSize: 13, color: '#7e808c', marginHorizontal: 8 },
  productPrice: { fontSize: 13, fontWeight: '500', color: '#282c3f' },
  moreProducts: { fontSize: 12, color: '#fc8019', marginTop: 4, fontWeight: '500' },
  orderFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#f0f0f0' },
  orderTime: { fontSize: 12, color: '#7e808c' },
  footerButtons: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  cancelButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#ffebee', paddingHorizontal: 14, paddingVertical: 7, borderRadius: 6, borderWidth: 1, borderColor: '#dc3545' },
  cancelButtonText: { color: '#dc3545', fontSize: 12, fontWeight: '500', marginLeft: 4 },
  viewButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff3e0', paddingHorizontal: 14, paddingVertical: 7, borderRadius: 6, borderWidth: 1, borderColor: '#fc8019' },
  viewButtonText: { color: '#fc8019', fontSize: 12, fontWeight: '500', marginLeft: 4 },
  emptyContainer: { alignItems: 'center', justifyContent: 'center', paddingVertical: 80 },
  emptyText: { fontSize: 18, fontWeight: '500', color: '#282c3f', marginTop: 16 },
  emptySubText: { fontSize: 14, color: '#7e808c', marginTop: 8, marginBottom: 24 },
  amazonModalContainer: { flex: 1, backgroundColor: '#f5f5f5' },
  amazonModalHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 14, backgroundColor: '#ffffff', borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  amazonModalBackButton: { padding: 4 },
  amazonModalTitle: { fontSize: 20, fontWeight: '700', color: '#000000' },
  amazonModalActionButton: { padding: 4 },
  amazonModalActionText: { color: '#007185', fontSize: 14, fontWeight: '500' },
  amazonNotificationsList: { padding: 16, paddingBottom: 40 },
  amazonCard: { backgroundColor: '#ffffff', padding: 16, marginBottom: 12, borderRadius: 12, borderWidth: 1, borderColor: '#e8e8e8', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 },
  amazonCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 },
  amazonTitleRow: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  amazonIconCircle: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#ff9900', justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  amazonTitleColumn: { flex: 1 },
  amazonTitleText: { fontSize: 16, fontWeight: '700', color: '#000000' },
  amazonTimeText: { fontSize: 12, color: '#565959' },
  amazonHeaderRight: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  amazonUnreadDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#ff9900' },
  amazonBodyText: { fontSize: 14, color: '#0f1111', lineHeight: 20, marginBottom: 4 },
  amazonOrderIdText: { fontSize: 12, color: '#565959', marginBottom: 12 },
  amazonDeliveryCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f7f8fa', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#e8e8e8', marginBottom: 14 },
  amazonDeliveryLeft: { flex: 1 },
  amazonDeliveryTitle: { fontSize: 13, color: '#0f1111' },
  amazonDeliveryDate: { fontSize: 15, fontWeight: '700', color: '#067d62' },
  amazonProductImagePlaceholder: { width: 48, height: 48, borderRadius: 8, backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#f0f0f0' },
  amazonActionButton: { backgroundColor: '#ffd814', paddingVertical: 12, borderRadius: 8, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#fcd200' },
  amazonActionButtonText: { fontSize: 14, fontWeight: '600', color: '#0f1111' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  errorText: { color: '#dc3545', fontSize: 16, marginTop: 10, marginBottom: 20 },
  retryButton: { backgroundColor: '#fc8019', paddingHorizontal: 30, paddingVertical: 10, borderRadius: 8 },
  retryButtonText: { color: '#ffffff', fontSize: 16, fontWeight: '500' },
  emptyNotifications: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 60 },
  emptyNotificationsText: { fontSize: 18, fontWeight: '500', color: '#282c3f', marginTop: 16 },
  emptyNotificationsSubText: { fontSize: 14, color: '#7e808c', marginTop: 8 },
});

export default OrdersScreen;
