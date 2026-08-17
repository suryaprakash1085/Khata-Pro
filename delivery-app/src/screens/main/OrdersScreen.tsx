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

} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';

import { OrderContext } from '../../context/OrderContext';

import { supabase } from '../../services/supabaseClient';

import notificationService, { Notification } from '../../services/notificationService';

import { AuthContext } from '../../context/AuthContext';
 
const OrdersScreen: React.FC = ({ navigation }: any) => {

  const [activeTab, setActiveTab] = useState<'current' | 'past' | 'cancelled'>('current');

  const [refreshing, setRefreshing] = useState(false);

  const [ordersList, setOrdersList] = useState<any[]>([]);

  const { orders, updateOrderStatus } = useContext(OrderContext);

  const { user } = useContext(AuthContext);
 
  // Notification states

  const [showNotifications, setShowNotifications] = useState(false);

  const [notifications, setNotifications] = useState<Notification[]>([]);

  const [notificationLoading, setNotificationLoading] = useState(false);

  const [notificationError, setNotificationError] = useState<string | null>(null);
 
  // Get IDs from user

  const driverId = user?.driver_id;

  const businessId = user?.business_id;
 
  // Load orders from context

  useEffect(() => {

    console.log('📦 Orders from context:', orders.length);

    setOrdersList([...orders]);

  }, [orders]);
 
  // ------------------------------------------------------------

  // NOTIFICATION LOGIC (UNCHANGED)

  // ------------------------------------------------------------

  const fetchNotifications = async () => {

    if (!driverId && !businessId) {

      console.error('❌ No driver_id or business_id found for user');

      setNotificationError('No account association found. Please contact support.');

      return;

    }
 
    try {

      setNotificationLoading(true);

      setNotificationError(null);

      console.log('📬 Fetching notifications...', { driverId, businessId });

      const data = await notificationService.getNotifications({

        ...(driverId ? { driver_id: driverId } : {}),

        ...(businessId ? { business_id: businessId } : {}),

        limit: 50,

      });

      setNotifications(data);

      console.log('📬 Notifications fetched:', data.length);

    } catch (error) {

      console.error('❌ Error fetching notifications:', error);

      setNotificationError('Failed to load notifications');

    } finally {

      setNotificationLoading(false);

    }

  };
 
  useEffect(() => {

    if (showNotifications) {

      fetchNotifications();

    }

  }, [showNotifications]);
 
  const handleMarkAsRead = async (notificationId: number) => {

    try {

      await notificationService.markAsRead(notificationId);

      setNotifications(prev =>

        prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n)

      );

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

      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));

      Alert.alert('✅', 'All notifications marked as read');

    } catch (error) {

      console.error('Error marking all as read:', error);

      Alert.alert('Error', 'Failed to mark all as read');

    }

  };
 
  const handleDeleteNotification = async (notificationId: number) => {

    Alert.alert(

      'Delete Notification',

      'Are you sure you want to delete this notification?',

      [

        { text: 'Cancel', style: 'cancel' },

        {

          text: 'Delete',

          style: 'destructive',

          onPress: async () => {

            try {

              await notificationService.deleteNotification(notificationId);

              setNotifications(prev => prev.filter(n => n.id !== notificationId));

              Alert.alert('✅', 'Notification deleted');

            } catch (error) {

              console.error('Error deleting notification:', error);

              Alert.alert('Error', 'Failed to delete notification');

            }

          },

        },

      ]

    );

  };
 
  // ------------------------------------------------------------

  // 🔥 FULLY DYNAMIC REAL-TIME AMAZON PARSER

  // ------------------------------------------------------------
 
  // ✅ REAL-TIME DYNAMIC TIME FORMATTER (Like Amazon)

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
 
      // 🔥 REAL-TIME LOGIC (Exact match to Amazon)

      if (diffSec < 60) return 'Just now';                     // < 1 minute

      else if (diffMin < 60) return `${diffMin}m ago`;         // 1m - 59m

      else if (diffHour < 24) return `${diffHour}h ago`;       // 1h - 23h

      else if (diffDay === 1) return 'Yesterday';              // 1 day ago

      else return date.toLocaleDateString('en-IN', {           // Older

        day: '2-digit', 

        month: 'short'

      });

    } catch (e) {

      return 'Just now';

    }

  };
 
  // ✅ DYNAMIC ARRIVING BY / ADDRESS PARSER (Removes hardcoded "Tomorrow")

  const getDynamicDeliveryTime = (createdAt: string) => {

    try {

      const now = new Date();

      const createdDate = new Date(createdAt);

      if (isNaN(createdDate.getTime())) return 'Preparing...';
 
      const diffMs = now.getTime() - createdDate.getTime();

      const diffDay = Math.floor(diffMs / (1000 * 60 * 60 * 24));
 
      // 🔥 Real Amazon Logic:

      if (diffDay === 0) return 'Today';

      else if (diffDay === 1) return 'Tomorrow';

      else return createdDate.toLocaleDateString('en-IN', { 

        weekday: 'short', 

        day: '2-digit', 

        month: 'short' 

      });

    } catch (e) {

      return 'Preparing...';

    }

  };
 
  // ✅ DYNAMIC DATA EXTRACTOR

  const parseAmazonRealUI = (

    type: string, 

    rawMessage: string, 

    id: number, 

    createdAt: string, 

    isRead: boolean

  ) => {

    let title = 'Order Update';

    let bodyText = 'Your order status has been updated.';

    let deliveryLocation = 'Preparing...';

    let orderId = `Order #${String(id)}`; // 🔥 This will automatically show Order #64 if your real ID is 64

    let buttonText = 'View order details';

    let isUnread = !isRead;
 
    if (type === 'assigned' || type === 'confirmed') {

      title = 'Your order is confirmed';

      bodyText = 'Thank you for your order. Your order has been confirmed.';

      // Extract delivery address dynamically from message

      const addressParts = rawMessage ? rawMessage.split('deliver to ') : [];

      if (addressParts.length > 1) {

        deliveryLocation = addressParts[1].trim(); // e.g. "No 36 Angallam..."

      } else {

        deliveryLocation = rawMessage || 'Preparing...';

      }

    } else if (type === 'delivered') {

      title = 'Your order is delivered';

      bodyText = 'Your package has been delivered successfully.';

      deliveryLocation = 'Delivered';

    } else if (type === 'cancelled') {

      title = 'Your order is cancelled';

      bodyText = 'Your order has been cancelled.';

      deliveryLocation = 'Cancelled';

    }
 
    return { title, bodyText, deliveryLocation, orderId, buttonText, isUnread };

  };
 
  // ------------------------------------------------------------

  // DYNAMIC RENDER NOTIFICATION

  // ------------------------------------------------------------

  const renderNotification = ({ item }: { item: Notification }) => {

    const { 

      title, 

      bodyText, 

      deliveryLocation, 

      orderId, 

      buttonText, 

      isUnread 

    } = parseAmazonRealUI(

      item.type, 

      item.message_text, 

      item.id, 

      item.createdAt || item.created_at, 

      item.isRead ?? item.is_read 

    );
 
    // 🔥 Calculate Dynamic "Arriving by" time based on real current time

    const dynamicDeliveryDate = getDynamicDeliveryTime(item.createdAt || item.created_at);
 
    return (
<View style={styles.amazonCard}>

        {/* HEADER: Title + Real-Time Dynamic Time */}
<View style={styles.amazonCardHeader}>
<View style={styles.amazonTitleRow}>
<View style={styles.amazonIconCircle}>
<Icon name="bag-check-outline" size={18} color="#fff" />
</View>
<View style={styles.amazonTitleColumn}>
<Text style={styles.amazonTitleText}>{title}</Text>
<Text style={styles.amazonTimeText}>

                {formatNotificationDate(item.createdAt || item.created_at)}
</Text>
</View>
</View>
<View style={styles.amazonHeaderRight}>

            {isUnread && <View style={styles.amazonUnreadDot} />}
<TouchableOpacity onPress={() => handleDeleteNotification(item.id)} hitSlop={{top:10, bottom:10, left:10, right:10}}>
<Icon name="close" size={20} color="#ccc" />
</TouchableOpacity>
</View>
</View>
 
        {/* BODY: Dynamic Description */}
<Text style={styles.amazonBodyText}>{bodyText}</Text>
<Text style={styles.amazonOrderIdText}>{orderId}</Text>
 
        {/* 🔥 DYNAMIC DELIVERY CARD (Shows Real Time "Today", "Tomorrow", or Address) */}
<View style={styles.amazonDeliveryCard}>
<View style={styles.amazonDeliveryLeft}>
<Text style={styles.amazonDeliveryTitle}>Arriving by</Text>

            {/* 

              🔥 This line is 100% Dynamic. 

              If ordered today -> shows "Today"

              If ordered yesterday -> shows "Tomorrow"

              Otherwise -> Shows the Real Address extracted from your message

            */}
<Text style={styles.amazonDeliveryDate}>{deliveryLocation}</Text>
</View>

          {/* 🔥 RESERVED SPACE FOR FUTURE PRODUCT IMAGE (REMOVED) */}
<View style={styles.amazonProductImagePlaceholder} />
</View>
 
        {/* ACTION BUTTON */}
<TouchableOpacity 

          style={styles.amazonActionButton}

          onPress={() => {

            handleMarkAsRead(item.id);

            setShowNotifications(false);

          }}
>
<Text style={styles.amazonActionButtonText}>{buttonText}</Text>
</TouchableOpacity>
</View>

    );

  };
 
  // ------------------------------------------------------------

  // ORDER LOGIC (UNCHANGED)

  // ------------------------------------------------------------

  const getFilteredOrders = (tab: 'current' | 'past' | 'cancelled') => {

    return ordersList.filter((order: any) => {

      if (tab === 'current') return order.status !== 'Delivered' && order.status !== 'Cancelled';

      else if (tab === 'past') return order.status === 'Delivered';

      else return order.status === 'Cancelled';

    });

  };
 
  const filteredOrders = getFilteredOrders(activeTab);
 
  const getStatusColor = (status: string) => {

    switch (status) {

      case 'Delivered': return '#28a745';

      case 'On the way': return '#17a2b8';

      case 'Preparing': return '#ffc107';

      case 'Placed': return '#ffc107';

      case 'Ready': return '#28a745';

      case 'Cancelled': return '#dc3545';

      default: return '#7e808c';

    }

  };
 
  const getStatusIcon = (status: string) => {

    switch (status) {

      case 'Delivered': return 'checkmark-circle';

      case 'On the way': return 'bicycle';

      case 'Preparing': return 'time';

      case 'Placed': return 'time';

      case 'Ready': return 'checkmark-circle';

      case 'Cancelled': return 'close-circle';

      default: return 'time';

    }

  };
 
  const formatDate = (dateString: string) => {

    try {

      const date = new Date(dateString);

      const now = new Date();

      const diff = now.getTime() - date.getTime();

      const hours = Math.floor(diff / (1000 * 60 * 60));

      if (hours < 24) return `Today • ${date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}`;

      else if (hours < 48) return 'Yesterday';

      else return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

    } catch (e) { return 'Just now'; }

  };
 
  const handleCancelOrder = (item: any) => {

    Alert.alert(

      '❌ Cancel Order',

      `Are you sure you want to cancel this order?\n\nOrder: ${item.restaurantName}\nTotal: ₹${item.total}`,

      [

        { text: 'No', style: 'cancel' },

        {

          text: 'Yes, Cancel',

          style: 'destructive',

          onPress: async () => {

            try {

              setOrdersList(ordersList.map(order => order.id === item.id ? { ...order, status: 'Cancelled' } : order));

              if (updateOrderStatus) updateOrderStatus(item.id, 'Cancelled');

              setActiveTab('cancelled');

              Alert.alert('✅ Order Cancelled', 'Your order has been cancelled successfully.', [{ text: 'OK' }]);

              await supabase.from('orders').update({ status: 'Cancelled', updated_at: new Date().toISOString() }).eq('order_id', item.id);

              await supabase.from('deliveries').update({ status: 'Cancelled', updated_at: new Date().toISOString() }).eq('order_id', item.id);

            } catch (error) {

              console.error('Error cancelling order:', error);

              Alert.alert('Error', 'Failed to cancel order. Please try again.');

            }

          },

        },

      ]

    );

  };
 
  const handleViewOrder = (item: any) => {

    navigation.navigate('OrderTracking', {

      orderId: item.id,

      total: item.total,

      items: item.items,

      restaurantName: item.restaurantName,

      paymentMethod: item.paymentMethod || 'Cash on Delivery',

      paymentStatus: item.paymentStatus || 'Confirmed',

      status: item.status,

    });

  };
 
  const onRefresh = useCallback(() => {

    setRefreshing(true);

    setOrdersList([...orders]);

    if (showNotifications) fetchNotifications();

    setTimeout(() => setRefreshing(false), 1000);

  }, [orders, showNotifications]);
 
  const getTabCount = (tab: 'current' | 'past' | 'cancelled') => getFilteredOrders(tab).length;

  const unreadCount = notifications.filter(n => !(n.isRead ?? n.is_read)).length;
 
  const renderOrder = ({ item }: { item: any }) => {

    const isCurrent = activeTab === 'current';

    const isCancelled = activeTab === 'cancelled';

    const isDelivered = item.status === 'Delivered';

    const isPast = activeTab === 'past';

    const showCancelButton = isCurrent && !isDelivered && item.status !== 'Cancelled';

    const showViewButton = isPast || isCancelled;
 
    return (
<TouchableOpacity style={[styles.orderCard, isCancelled && styles.cancelledCard]} onPress={() => handleViewOrder(item)} activeOpacity={0.7}>
<View style={styles.orderHeader}>
<View style={styles.orderLeft}>
<Text style={styles.orderRestaurant}>{item.restaurantName}</Text>
<Text style={styles.orderDetails}>{item.items?.length || 0} {item.items?.length === 1 ? 'item' : 'items'} • ₹{item.total}</Text>
<Text style={styles.orderId}>Order #{item.id?.slice(0, 8) || 'N/A'}</Text>
</View>
<View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
<Icon name={getStatusIcon(item.status)} size={14} color={getStatusColor(item.status)} />
<Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>{item.status}</Text>
</View>
</View>
<View style={styles.productsContainer}>

          {item.items && item.items.slice(0, 3).map((product: any, index: number) => (
<View key={index} style={styles.productItem}>
<Text style={styles.productName}>{product.name || product.productName || product.itemName || 'Product'}</Text>
<Text style={styles.productQuantity}>×{product.quantity || 1}</Text>
<Text style={styles.productPrice}>₹{(product.price || 0) * (product.quantity || 1)}</Text>
</View>

          ))}

          {item.items && item.items.length > 3 && <Text style={styles.moreProducts}>+{item.items.length - 3} more items</Text>}
</View>
<View style={styles.orderFooter}>
<Text style={styles.orderTime}>{formatDate(item.createdAt)}</Text>
<View style={styles.footerButtons}>

            {showCancelButton && <TouchableOpacity style={styles.cancelButton} onPress={(e) => { e.stopPropagation(); handleCancelOrder(item); }} activeOpacity={0.8}><Icon name="close-outline" size={14} color="#dc3545" /><Text style={styles.cancelButtonText}>Cancel</Text></TouchableOpacity>}

            {showViewButton && <TouchableOpacity style={styles.viewButton} onPress={(e) => { e.stopPropagation(); handleViewOrder(item); }} activeOpacity={0.8}><Icon name="eye-outline" size={14} color="#fc8019" /><Text style={styles.viewButtonText}>View</Text></TouchableOpacity>}
</View>
</View>
</TouchableOpacity>

    );

  };
 
  return (
<SafeAreaView style={styles.container}>
<StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
<View style={styles.header}>
<TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}><Icon name="arrow-back" size={24} color="#282c3f" /></TouchableOpacity>
<Text style={styles.headerTitle}>My Orders</Text>
<TouchableOpacity style={styles.headerRight} onPress={() => setShowNotifications(true)}>
<Icon name="notifications-outline" size={24} color="#fc8019" />

          {unreadCount > 0 && <View style={styles.notificationBadge}><Text style={styles.notificationBadgeText}>{unreadCount > 9 ? '9+' : unreadCount}</Text></View>}
</TouchableOpacity>
</View>
<View style={styles.tabsContainer}>

        {['current', 'past', 'cancelled'].map((tab) => (
<TouchableOpacity key={tab} style={[styles.tab, activeTab === tab && styles.activeTab]} onPress={() => setActiveTab(tab as any)} activeOpacity={0.7}>
<Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab.charAt(0).toUpperCase() + tab.slice(1)}</Text>

            {getTabCount(tab as any) > 0 && <View style={styles.badge}><Text style={styles.badgeText}>{getTabCount(tab as any)}</Text></View>}

            {activeTab === tab && <View style={styles.tabIndicator} />}
</TouchableOpacity>

        ))}
</View>
<FlatList data={filteredOrders} renderItem={renderOrder} keyExtractor={(item) => item.id} contentContainerStyle={styles.ordersList} showsVerticalScrollIndicator={false} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />} ListEmptyComponent={<View style={styles.emptyContainer}><Icon name="clipboard-outline" size={60} color="#ccc" /><Text style={styles.emptyText}>{activeTab === 'current' && 'No current orders'}{activeTab === 'past' && 'No past orders'}{activeTab === 'cancelled' && 'No cancelled orders'}</Text><Text style={styles.emptySubText}>{activeTab === 'current' && 'Your current orders will appear here'}{activeTab === 'past' && 'Your past orders will appear here'}{activeTab === 'cancelled' && 'Cancelled orders will appear here'}</Text></View>} />
 
      {/* DYNAMIC AMAZON APP UI NOTIFICATION MODAL */}
<Modal visible={showNotifications} animationType="slide" transparent={false} onRequestClose={() => setShowNotifications(false)}>
<SafeAreaView style={styles.amazonModalContainer}>
<View style={styles.amazonModalHeader}>
<TouchableOpacity style={styles.amazonModalBackButton} onPress={() => setShowNotifications(false)}><Icon name="arrow-back" size={24} color="#232f3e" /></TouchableOpacity>
<Text style={styles.amazonModalTitle}>Your Notifications</Text>

            {unreadCount > 0 && <TouchableOpacity style={styles.amazonModalActionButton} onPress={handleMarkAllAsRead}><Text style={styles.amazonModalActionText}>Mark all as read</Text></TouchableOpacity>}
</View>

          {notificationLoading ? <View style={styles.loadingContainer}><Text>Loading notifications...</Text></View> : notificationError ? <View style={styles.errorContainer}><Icon name="alert-circle-outline" size={50} color="#dc3545" /><Text style={styles.errorText}>{notificationError}</Text><TouchableOpacity style={styles.retryButton} onPress={fetchNotifications}><Text style={styles.retryButtonText}>Retry</Text></TouchableOpacity></View> : notifications.length === 0 ? <View style={styles.emptyNotifications}><Icon name="notifications-off-outline" size={60} color="#ccc" /><Text style={styles.emptyNotificationsText}>No notifications</Text><Text style={styles.emptyNotificationsSubText}>You're all caught up!</Text></View> : <FlatList data={notifications} renderItem={renderNotification} keyExtractor={(item) => item.id.toString()} contentContainerStyle={styles.amazonNotificationsList} showsVerticalScrollIndicator={false} />}
</SafeAreaView>
</Modal>
</SafeAreaView>

  );

};
 
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
 
  // ============ DYNAMIC AMAZON APP UI STYLES ============

  amazonModalContainer: { flex: 1, backgroundColor: '#f5f5f5' },

  amazonModalHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 14, backgroundColor: '#ffffff', borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },

  amazonModalBackButton: { padding: 4 },

  amazonModalTitle: { fontSize: 20, fontWeight: '700', color: '#000000' },

  amazonModalActionButton: { padding: 4 },

  amazonModalActionText: { color: '#007185', fontSize: 14, fontWeight: '500' },

  amazonNotificationsList: { padding: 16, paddingBottom: 40 },
 
  amazonCard: {

    backgroundColor: '#ffffff',

    padding: 16,

    marginBottom: 12,

    borderRadius: 12,

    borderWidth: 1,

    borderColor: '#e8e8e8',

    shadowColor: '#000',

    shadowOffset: { width: 0, height: 1 },

    shadowOpacity: 0.05,

    shadowRadius: 2,

    elevation: 1,

  },

  amazonCardHeader: {

    flexDirection: 'row',

    justifyContent: 'space-between',

    alignItems: 'flex-start',

    marginBottom: 8,

  },

  amazonTitleRow: {

    flexDirection: 'row',

    alignItems: 'center',

    flex: 1,

  },

  amazonIconCircle: {

    width: 28,

    height: 28,

    borderRadius: 14,

    backgroundColor: '#ff9900',

    justifyContent: 'center',

    alignItems: 'center',

    marginRight: 10,

  },

  amazonTitleColumn: {

    flex: 1,

  },

  amazonTitleText: {

    fontSize: 16,

    fontWeight: '700',

    color: '#000000',

  },

  amazonTimeText: {

    fontSize: 12,

    color: '#565959',

  },

  amazonHeaderRight: {

    flexDirection: 'row',

    alignItems: 'center',

    gap: 12,

  },

  amazonUnreadDot: {

    width: 8,

    height: 8,

    borderRadius: 4,

    backgroundColor: '#ff9900',

  },

  amazonBodyText: {

    fontSize: 14,

    color: '#0f1111',

    lineHeight: 20,

    marginBottom: 4,

  },

  amazonOrderIdText: {

    fontSize: 12,

    color: '#565959',

    marginBottom: 12,

  },

  amazonDeliveryCard: {

    flexDirection: 'row',

    justifyContent: 'space-between',

    alignItems: 'center',

    backgroundColor: '#f7f8fa',

    padding: 12,

    borderRadius: 8,

    borderWidth: 1,

    borderColor: '#e8e8e8',

    marginBottom: 14,

  },

  amazonDeliveryLeft: {

    flex: 1,

  },

  amazonDeliveryTitle: {

    fontSize: 13,

    color: '#0f1111',

  },

  amazonDeliveryDate: {

    fontSize: 15,

    fontWeight: '700',

    color: '#067d62',

  },

  amazonProductImagePlaceholder: {

    width: 48,

    height: 48,

    borderRadius: 8,

    backgroundColor: '#ffffff',

    borderWidth: 1,

    borderColor: '#f0f0f0',

  },

  amazonActionButton: {

    backgroundColor: '#ffd814',

    paddingVertical: 12,

    borderRadius: 8,

    alignItems: 'center',

    justifyContent: 'center',

    borderWidth: 1,

    borderColor: '#fcd200',

  },

  amazonActionButtonText: {

    fontSize: 14,

    fontWeight: '600',

    color: '#0f1111',

  },
 
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
 