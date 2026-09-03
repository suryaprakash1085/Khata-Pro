
// import React, { useState, useContext, useEffect, useCallback } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   SafeAreaView,
//   StatusBar,
//   FlatList,
//   TouchableOpacity,
//   Alert,
//   RefreshControl,
//   Modal,
//   ActivityIndicator,
//   Platform,
//   useWindowDimensions,
// } from 'react-native';
// import Icon from 'react-native-vector-icons/Ionicons';
// import { ordersApi, CustomerOrder, CustomerTrackingStatus } from '../../api/orders';
// import notificationService, { Notification } from '../../services/notificationService';
// import { AuthContext } from '../../context/AuthContext';
// import { SelectedBusinessContext } from '../../context/SelectedBusinessContext';

// // ✅ Theme color — matched to Cart / Address / Payment screens' purple/indigo
// const THEME_COLOR = '#6C5CE7';
// const THEME_COLOR_LIGHT = '#F1EFFE'; // light tint for badges/backgrounds

// // ✅ Same constants used by the other redesigned screens (Cart/Profile) —
// // kept in sync so this screen matches the same desktop-web behaviour.
// const WEB_NAV_HEIGHT = 64;
// const DESKTOP_BREAKPOINT = 768;

// const OrdersScreen: React.FC = ({ navigation }: any) => {
//   const { width: windowWidth } = useWindowDimensions();
//   const isDesktopWeb = Platform.OS === 'web' && windowWidth >= DESKTOP_BREAKPOINT;

//   const [activeTab, setActiveTab] = useState<'current' | 'past' | 'cancelled'>('current');
//   const [refreshing, setRefreshing] = useState(false);
//   const [ordersList, setOrdersList] = useState<CustomerOrder[]>([]);
//   const [ordersLoading, setOrdersLoading] = useState(true);
//   const [ordersError, setOrdersError] = useState<string | null>(null);

//   const { user } = useContext(AuthContext);
//   const { selectedBusiness } = useContext(SelectedBusinessContext);

//   const [showNotifications, setShowNotifications] = useState(false);
//   const [notifications, setNotifications] = useState<Notification[]>([]);
//   const [notificationLoading, setNotificationLoading] = useState(false);
//   const [notificationError, setNotificationError] = useState<string | null>(null);

//   const driverId = (user as any)?.driver_id;
//   const businessId = selectedBusiness?.id ?? user?.business_id;

//   // ── Orders: real backend fetch ──────────────────────────────
//   const fetchOrders = useCallback(async (silent = false) => {
//     try {
//       if (!silent) setOrdersLoading(true);
//       const res = await ordersApi.getMyOrders();
//       setOrdersList(res.data ?? []);
//       setOrdersError(null);
//     } catch (err: any) {
//       if (!silent) setOrdersError(err?.message || 'Unable to load your orders. Please try again.');
//     } finally {
//       if (!silent) setOrdersLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     fetchOrders(false);
//   }, [fetchOrders]);

//   // ── Notifications ──────────────────────────────────────────────
//   const fetchNotifications = async () => {
//     if (!driverId && !businessId) {
//       console.error('❌ No driver_id or business_id found for user');
//       setNotificationError('No account association found. Please contact support.');
//       return;
//     }
//     try {
//       setNotificationLoading(true);
//       setNotificationError(null);
//       const data = await notificationService.getNotifications({
//         ...(driverId ? { driver_id: driverId } : {}),
//         ...(businessId ? { business_id: businessId } : {}),
//         limit: 50,
//       });
//       setNotifications(data);
//     } catch (error) {
//       console.error('❌ Error fetching notifications:', error);
//       setNotificationError('Failed to load notifications');
//     } finally {
//       setNotificationLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (showNotifications) fetchNotifications();
//   }, [showNotifications, businessId]);

//   const handleMarkAsRead = async (notificationId: number) => {
//     try {
//       await notificationService.markAsRead(notificationId);
//       setNotifications((prev) => prev.map((n) => (n.id === notificationId ? { ...n, is_read: true } : n)));
//     } catch (error) {
//       console.error('Error marking notification as read:', error);
//     }
//   };

//   const handleMarkAllAsRead = async () => {
//     if (!driverId && !businessId) {
//       Alert.alert('Error', 'No account associated');
//       return;
//     }
//     try {
//       await notificationService.markAllAsRead({
//         ...(driverId ? { driver_id: driverId } : {}),
//         ...(businessId ? { business_id: businessId } : {}),
//       });
//       setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
//       Alert.alert('✅', 'All notifications marked as read');
//     } catch (error) {
//       console.error('Error marking all as read:', error);
//       Alert.alert('Error', 'Failed to mark all as read');
//     }
//   };

//   const handleCloseNotification = async (notificationId: number) => {
//     const previousNotifications = notifications;
//     setNotifications((prev) => prev.filter((n) => String(n.id) !== String(notificationId)));
//     try {
//       await notificationService.deleteNotification(notificationId);
//     } catch (error) {
//       console.error('❌ Error deleting notification (restoring card):', error);
//       setNotifications(previousNotifications);
//     }
//   };

//   const formatNotificationDate = (dateString: string) => {
//     if (!dateString) return 'Just now';
//     try {
//       const date = new Date(dateString);
//       if (isNaN(date.getTime())) return 'Just now';
//       const now = new Date();
//       const diffMs = now.getTime() - date.getTime();
//       const diffSec = Math.floor(diffMs / 1000);
//       const diffMin = Math.floor(diffSec / 60);
//       const diffHour = Math.floor(diffMin / 60);
//       const diffDay = Math.floor(diffHour / 24);
//       if (diffSec < 60) return 'Just now';
//       else if (diffMin < 60) return `${diffMin}m ago`;
//       else if (diffHour < 24) return `${diffHour}h ago`;
//       else if (diffDay === 1) return 'Yesterday';
//       else return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
//     } catch (e) {
//       return 'Just now';
//     }
//   };

//   const parseAmazonRealUI = (type: string, rawMessage: string, id: number, isRead: boolean) => {
//     let title = 'Order Update';
//     let bodyText = 'Your order status has been updated.';
//     let deliveryLocation = 'Preparing...';
//     const orderIdMatch = rawMessage?.match(/order\s*#\s*(\d+)/i);
//     let orderId = orderIdMatch ? `Order #${orderIdMatch[1]}` : `Order #${String(id)}`;
//     const numericOrderId = orderIdMatch ? parseInt(orderIdMatch[1], 10) : null;
//     let buttonText = 'View order details';
//     let isUnread = !isRead;

//     if (type === 'assigned') {
//       title = 'Driver Assigned';
//       bodyText = 'A driver has been assigned to your order.';
//       const addressMatch = rawMessage?.match(/deliver to\s*([^,.]*)/i);
//       deliveryLocation = addressMatch?.[1]?.trim() || 'Preparing...';
//     } else if (type === 'order_confirmed' || type === 'confirmed') {
//       title = 'Your order is confirmed';
//       bodyText = 'Thank you for your order. Your order has been confirmed.';
//       const addressMatch = rawMessage?.match(/deliver to\s*([^,.]*)/i);
//       deliveryLocation = addressMatch?.[1]?.trim() || 'Today';
//     } else if (type === 'completed') {
//       title = 'Your order is delivered';
//       bodyText = 'Your package has been delivered successfully.';
//       deliveryLocation = 'Delivered';
//     } else if (type === 'address_updated') {
//       title = 'Delivery Address Updated';
//       bodyText = 'Your delivery address has been updated.';
//       deliveryLocation = 'Updated';
//     } else if (type === 'payment_received') {
//       title = 'Payment Received';
//       bodyText = 'Your payment has been received.';
//       deliveryLocation = 'Confirmed';
//     }

//     return { title, bodyText, deliveryLocation, orderId, numericOrderId, buttonText, isUnread };
//   };

//   const renderNotification = ({ item }: { item: Notification }) => {
//     const { title, bodyText, deliveryLocation, orderId, numericOrderId, buttonText, isUnread } = parseAmazonRealUI(
//       item.type,
//       item.message,
//       item.id,
//       item.is_read,
//     );
//     return (
//       <View style={styles.amazonCard}>
//         <View style={styles.amazonCardHeader}>
//           <View style={styles.amazonTitleRow}>
//             <View style={styles.amazonIconCircle}>
//               <Icon name="bag-check-outline" size={18} color="#fff" />
//             </View>
//             <View style={styles.amazonTitleColumn}>
//               <Text style={styles.amazonTitleText}>{title}</Text>
//               <Text style={styles.amazonTimeText}>{formatNotificationDate(item.created_at)}</Text>
//             </View>
//           </View>
//           <View style={styles.amazonHeaderRight}>
//             {isUnread && <View style={styles.amazonUnreadDot} />}
//             <TouchableOpacity onPress={() => handleCloseNotification(item.id)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
//               <Icon name="close" size={20} color="#ccc" />
//             </TouchableOpacity>
//           </View>
//         </View>
//         <Text style={styles.amazonBodyText}>{bodyText}</Text>
//         <Text style={styles.amazonOrderIdText}>{orderId}</Text>
//         <View style={styles.amazonDeliveryCard}>
//           <View style={styles.amazonDeliveryLeft}>
//             <Text style={styles.amazonDeliveryTitle}>Arriving by</Text>
//             <Text style={styles.amazonDeliveryDate}>{deliveryLocation}</Text>
//           </View>
//           <View style={styles.amazonProductImagePlaceholder} />
//         </View>
//         <TouchableOpacity
//           style={styles.amazonActionButton}
//           onPress={() => {
//             handleMarkAsRead(item.id);
//             setShowNotifications(false);
//             if (numericOrderId) {
//               navigation.navigate('OrderTracking', { orderId: numericOrderId });
//             }
//           }}
//         >
//           <Text style={styles.amazonActionButtonText}>{buttonText}</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   };

//   // ── Order status → display meta ─────────────────────────────
//   const STATUS_META: Record<CustomerTrackingStatus, { label: string; color: string; icon: string }> = {
//     ORDER_PLACED: { label: 'Placed', color: '#ffc107', icon: 'time' },
//     ORDER_CONFIRMED: { label: 'Confirmed', color: '#17a2b8', icon: 'checkmark-circle' },
//     DRIVER_ASSIGNED: { label: 'Driver Assigned', color: '#17a2b8', icon: 'person' },
//     PICKED_UP: { label: 'Picked Up', color: '#7C3AED', icon: 'cube' },
//     OUT_FOR_DELIVERY: { label: 'On the way', color: THEME_COLOR, icon: 'bicycle' },
//     DELIVERED: { label: 'Delivered', color: '#28a745', icon: 'checkmark-circle' },
//     CANCELLED: { label: 'Cancelled', color: '#dc3545', icon: 'close-circle' },
//   };

//   const getFilteredOrders = (tab: 'current' | 'past' | 'cancelled') => {
//     return ordersList.filter((order) => {
//       if (tab === 'current') return order.tracking_status !== 'DELIVERED' && order.tracking_status !== 'CANCELLED';
//       if (tab === 'past') return order.tracking_status === 'DELIVERED';
//       return order.tracking_status === 'CANCELLED';
//     });
//   };

//   const filteredOrders = getFilteredOrders(activeTab);

//   const formatDate = (dateString: string) => {
//     try {
//       const date = new Date(dateString);
//       const now = new Date();
//       const diff = now.getTime() - date.getTime();
//       const hours = Math.floor(diff / (1000 * 60 * 60));
//       if (hours < 24) return `Today • ${date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}`;
//       else if (hours < 48) return 'Yesterday';
//       else return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
//     } catch (e) {
//       return 'Just now';
//     }
//   };

//   // ── Cancel order ─────────────────────────────────────────────
//   const doCancelOrder = async (item: CustomerOrder) => {
//     try {
//       const response = await ordersApi.cancelOrder(item.id);
//       let updatedStatus: CustomerTrackingStatus = 'CANCELLED';

//       if (response && typeof response === 'object') {
//         if ('tracking_status' in response) {
//           updatedStatus = (response as any).tracking_status;
//         } else if ('data' in response && response.data && typeof response.data === 'object' && 'tracking_status' in response.data) {
//           updatedStatus = (response.data as any).tracking_status;
//         } else if ('status' in response) {
//           updatedStatus = (response as any).status as CustomerTrackingStatus;
//         } else if ('data' in response && response.data && typeof response.data === 'object' && 'status' in response.data) {
//           updatedStatus = (response.data as any).status as CustomerTrackingStatus;
//         }
//       }

//       setOrdersList((prev) =>
//         prev.map((o) =>
//           o.id === item.id
//             ? { ...o, tracking_status: updatedStatus }
//             : o,
//         ),
//       );

//       const successMsg = `Order #${item.id} has been cancelled.`;
//       if (Platform.OS === 'web') {
//         window.alert(successMsg);
//       } else {
//         Alert.alert('Order Cancelled', successMsg);
//       }
//     } catch (err: any) {
//       console.error('❌ Error cancelling order:', err);
//       const errorMsg =
//         err?.response?.data?.error || 'This order could not be cancelled. Please try again.';
//       if (Platform.OS === 'web') {
//         window.alert(errorMsg);
//       } else {
//         Alert.alert('Unable to cancel', errorMsg);
//       }
//       fetchOrders(true);
//     }
//   };

//   const handleCancelOrder = (item: CustomerOrder) => {
//     if (Platform.OS === 'web') {
//       const confirmed = window.confirm(`Are you sure you want to cancel Order #${item.id}?`);
//       if (confirmed) doCancelOrder(item);
//       return;
//     }

//     Alert.alert(
//       'Cancel Order',
//       `Are you sure you want to cancel Order #${item.id}?`,
//       [
//         { text: 'No', style: 'cancel' },
//         { text: 'Yes, Cancel', style: 'destructive', onPress: () => doCancelOrder(item) },
//       ],
//     );
//   };

//   const handleViewOrder = (item: CustomerOrder) => {
//     navigation.navigate('OrderTracking', { orderId: item.id });
//   };

//   const onRefresh = useCallback(() => {
//     setRefreshing(true);
//     Promise.all([fetchOrders(true), showNotifications ? fetchNotifications() : Promise.resolve()]).finally(() =>
//       setRefreshing(false),
//     );
//   }, [fetchOrders, showNotifications, businessId]);

//   const getTabCount = (tab: 'current' | 'past' | 'cancelled') => getFilteredOrders(tab).length;
//   const unreadCount = notifications.filter((n) => !n.is_read).length;

//   const renderOrder = ({ item }: { item: CustomerOrder }) => {
//     const isCurrent = activeTab === 'current';
//     const isCancelled = activeTab === 'cancelled';
//     const isPast = activeTab === 'past';
//     const meta = STATUS_META[item.tracking_status] ?? STATUS_META.ORDER_PLACED;
//     const showCancelButton = isCurrent && item.tracking_status === 'ORDER_PLACED';
//     const showViewButton = !isPast;

//     return (
//       <TouchableOpacity
//         style={[styles.orderCard, isCancelled && styles.cancelledCard]}
//         onPress={() => {
//           if (isPast) return;
//           handleViewOrder(item);
//         }}
//         activeOpacity={isPast ? 1 : 0.7}
//       >
//         <View style={styles.orderHeader}>
//           <View style={styles.orderIdBadge}>
//             <Icon name="bag-handle-outline" size={15} color={THEME_COLOR} />
//           </View>
//           <View style={styles.orderLeft}>
//             <Text style={styles.orderRestaurant}>Order #{item.id}</Text>
//             <Text style={styles.orderDetails}>₹{item.amount}</Text>
//             {item.delivery?.driver_name && (
//               <View style={styles.driverChip}>
//                 <Icon name="bicycle-outline" size={11} color="#7e808c" />
//                 <Text style={styles.orderId}>{item.delivery.driver_name}</Text>
//               </View>
//             )}
//           </View>
//           <View style={[styles.statusBadge, { backgroundColor: meta.color + '18' }]}>
//             <Icon name={meta.icon as any} size={13} color={meta.color} />
//             <Text style={[styles.statusText, { color: meta.color }]}>{meta.label}</Text>
//           </View>
//         </View>
//         <View style={styles.orderFooter}>
//           <View style={styles.orderTimeRow}>
//             <Icon name="time-outline" size={12} color="#a2a4b0" />
//             <Text style={styles.orderTime}>{formatDate(item.entry_date)}</Text>
//           </View>
//           <View style={styles.footerButtons}>
//             {showCancelButton && (
//               <TouchableOpacity
//                 style={styles.cancelButton}
//                 onPress={(e) => {
//                   e.stopPropagation();
//                   handleCancelOrder(item);
//                 }}
//                 activeOpacity={0.8}
//               >
//                 <Icon name="close-outline" size={14} color="#dc3545" />
//                 <Text style={styles.cancelButtonText}>Cancel</Text>
//               </TouchableOpacity>
//             )}
//             {showViewButton && (
//               <TouchableOpacity
//                 style={styles.viewButton}
//                 onPress={(e) => {
//                   e.stopPropagation();
//                   handleViewOrder(item);
//                 }}
//                 activeOpacity={0.8}
//               >
//                 <Icon name="eye-outline" size={14} color={THEME_COLOR} />
//                 <Text style={styles.viewButtonText}>Track</Text>
//               </TouchableOpacity>
//             )}
//           </View>
//         </View>
//       </TouchableOpacity>
//     );
//   };

//   const TABS: { key: 'current' | 'past' | 'cancelled'; label: string }[] = [
//     { key: 'current', label: 'Current' },
//     { key: 'past', label: 'Past' },
//     { key: 'cancelled', label: 'Cancelled' },
//   ];

//   return (
//     <SafeAreaView style={[styles.container, isDesktopWeb && { paddingTop: WEB_NAV_HEIGHT }]}>
//       <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

//       {/* Header — full-bleed toolbar, same on mobile & web */}
//       <View style={styles.header}>
//         <View style={[styles.headerInner, isDesktopWeb && styles.headerInnerDesktop]}>
//           <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
//             <Icon name="arrow-back" size={24} color="#282c3f" />
//           </TouchableOpacity>
//           <Text style={styles.headerTitle}>My Orders</Text>
//           <TouchableOpacity style={styles.headerRight} onPress={() => setShowNotifications(true)}>
//             <Icon name="notifications-outline" size={24} color={THEME_COLOR} />
//             {unreadCount > 0 && (
//               <View style={styles.notificationBadge}>
//                 <Text style={styles.notificationBadgeText}>{unreadCount > 9 ? '9+' : unreadCount}</Text>
//               </View>
//             )}
//           </TouchableOpacity>
//         </View>
//       </View>

//       {/* Tabs */}
//       {isDesktopWeb ? (
//         // ── Desktop web: fixed-width segmented control, each segment is an
//         // equal flex:1 slot inside one rounded track — no CSS `gap` and no
//         // overlapping absolutely-positioned pieces, so it can't collide.
//         <View style={styles.segmentedOuter}>
//           <View style={styles.segmentedTrack}>
//             {TABS.map(({ key, label }) => {
//               const active = activeTab === key;
//               const count = getTabCount(key);
//               return (
//                 <TouchableOpacity
//                   key={key}
//                   style={[styles.segment, active && styles.segmentActive]}
//                   onPress={() => setActiveTab(key)}
//                   activeOpacity={0.75}
//                 >
//                   <Text style={[styles.segmentLabel, active && styles.segmentLabelActive]}>{label}</Text>
//                   {count > 0 && (
//                     <View style={[styles.segmentBadge, active && styles.segmentBadgeActive]}>
//                       <Text style={[styles.segmentBadgeText, active && styles.segmentBadgeTextActive]}>{count}</Text>
//                     </View>
//                   )}
//                 </TouchableOpacity>
//               );
//             })}
//           </View>
//         </View>
//       ) : (
//         // ── Mobile / narrow web: original underline-tab row, unchanged
//         <View style={styles.tabsContainer}>
//           {TABS.map(({ key, label }) => {
//             const active = activeTab === key;
//             return (
//               <TouchableOpacity key={key} style={styles.tab} onPress={() => setActiveTab(key)} activeOpacity={0.7}>
//                 <Text style={[styles.tabText, active && styles.activeTabText]}>{label}</Text>
//                 {getTabCount(key) > 0 && (
//                   <View style={styles.badge}>
//                     <Text style={styles.badgeText}>{getTabCount(key)}</Text>
//                   </View>
//                 )}
//                 {active && <View style={styles.tabIndicator} />}
//               </TouchableOpacity>
//             );
//           })}
//         </View>
//       )}

//       {ordersLoading ? (
//         <View style={styles.emptyContainer}>
//           <ActivityIndicator size="large" color={THEME_COLOR} />
//         </View>
//       ) : ordersError ? (
//         <View style={styles.emptyContainer}>
//           <Icon name="alert-circle-outline" size={50} color="#dc3545" />
//           <Text style={styles.emptyText}>Unable to load your orders.</Text>
//           <Text style={styles.emptySubText}>{ordersError}</Text>
//           <TouchableOpacity style={styles.retryButton} onPress={() => fetchOrders(false)}>
//             <Text style={styles.retryButtonText}>Retry</Text>
//           </TouchableOpacity>
//         </View>
//       ) : (
//         <FlatList
//           data={filteredOrders}
//           renderItem={renderOrder}
//           keyExtractor={(item) => String(item.id)}
//           contentContainerStyle={[styles.ordersList, isDesktopWeb && styles.ordersListDesktop]}
//           showsVerticalScrollIndicator={false}
//           refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
//           ListEmptyComponent={
//             <View style={styles.emptyContainer}>
//               <Icon name="clipboard-outline" size={60} color="#ccc" />
//               <Text style={styles.emptyText}>
//                 {activeTab === 'current' && 'No current orders'}
//                 {activeTab === 'past' && 'No past orders'}
//                 {activeTab === 'cancelled' && 'No cancelled orders'}
//               </Text>
//               <Text style={styles.emptySubText}>
//                 {activeTab === 'current' && 'Your current orders will appear here'}
//                 {activeTab === 'past' && 'Your past orders will appear here'}
//                 {activeTab === 'cancelled' && 'Cancelled orders will appear here'}
//               </Text>
//             </View>
//           }
//         />
//       )}

//       {/* NOTIFICATION MODAL */}
//       <Modal visible={showNotifications} animationType="slide" transparent={false} onRequestClose={() => setShowNotifications(false)}>
//         <SafeAreaView style={styles.amazonModalContainer}>
//           <View style={styles.amazonModalHeader}>
//             <TouchableOpacity style={styles.amazonModalBackButton} onPress={() => setShowNotifications(false)}>
//               <Icon name="arrow-back" size={24} color="#232f3e" />
//             </TouchableOpacity>
//             <Text style={styles.amazonModalTitle}>Your Notifications</Text>
//             {unreadCount > 0 && (
//               <TouchableOpacity style={styles.amazonModalActionButton} onPress={handleMarkAllAsRead}>
//                 <Text style={styles.amazonModalActionText}>Mark all as read</Text>
//               </TouchableOpacity>
//             )}
//           </View>
//           {notificationLoading ? (
//             <View style={styles.loadingContainer}>
//               <Text>Loading notifications...</Text>
//             </View>
//           ) : notificationError ? (
//             <View style={styles.errorContainer}>
//               <Icon name="alert-circle-outline" size={50} color="#dc3545" />
//               <Text style={styles.errorText}>{notificationError}</Text>
//               <TouchableOpacity style={styles.retryButton} onPress={fetchNotifications}>
//                 <Text style={styles.retryButtonText}>Retry</Text>
//               </TouchableOpacity>
//             </View>
//           ) : notifications.length === 0 ? (
//             <View style={styles.emptyNotifications}>
//               <Icon name="notifications-off-outline" size={60} color="#ccc" />
//               <Text style={styles.emptyNotificationsText}>No notifications</Text>
//               <Text style={styles.emptyNotificationsSubText}>You're all caught up!</Text>
//             </View>
//           ) : (
//             <FlatList
//               data={notifications}
//               renderItem={renderNotification}
//               keyExtractor={(item) => item.id.toString()}
//               contentContainerStyle={styles.amazonNotificationsList}
//               showsVerticalScrollIndicator={false}
//             />
//           )}
//         </SafeAreaView>
//       </Modal>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#f5f5f5' },

//   // Header (full-bleed toolbar; inner content constrained on desktop)
//   header: { backgroundColor: '#ffffff', borderBottomWidth: 1, borderBottomColor: '#f0f0f0', elevation: 2 },
//   headerInner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 14 },
//   headerInnerDesktop: { width: '100%', maxWidth: 880, alignSelf: 'center', paddingHorizontal: 8 },
//   backButton: { padding: 4 },
//   headerTitle: { flex: 1, fontSize: 18, fontWeight: '600', color: '#282c3f', textAlign: 'center' },
//   headerRight: { padding: 4, position: 'relative' },
//   notificationBadge: { position: 'absolute', top: -4, right: -4, backgroundColor: '#dc3545', borderRadius: 10, minWidth: 18, height: 18, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 4 },
//   notificationBadgeText: { color: '#ffffff', fontSize: 10, fontWeight: '600' },

//   // Mobile tabs (unchanged underline style)
//   tabsContainer: { flexDirection: 'row', backgroundColor: '#ffffff', borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
//   tab: { flex: 1, paddingVertical: 14, alignItems: 'center', position: 'relative', flexDirection: 'row', justifyContent: 'center' },
//   tabText: { fontSize: 14, color: '#7e808c', fontWeight: '500' },
//   activeTabText: { color: THEME_COLOR, fontWeight: '600' },
//   badge: { backgroundColor: THEME_COLOR, borderRadius: 10, paddingHorizontal: 6, paddingVertical: 2, marginLeft: 6, minWidth: 20, alignItems: 'center' },
//   badgeText: { color: '#ffffff', fontSize: 10, fontWeight: '600' },
//   tabIndicator: { position: 'absolute', bottom: 0, left: '25%', right: '25%', height: 3, backgroundColor: THEME_COLOR, borderRadius: 2 },

//   // Desktop segmented control — fixed track width, 3 equal flex:1 slots.
//   segmentedOuter: { backgroundColor: '#ffffff', borderBottomWidth: 1, borderBottomColor: '#f0f0f0', alignItems: 'center', paddingVertical: 14 },
//   segmentedTrack: {
//     flexDirection: 'row',
//     width: 420,
//     maxWidth: '100%',
//     backgroundColor: '#f1f1f5',
//     borderRadius: 12,
//     padding: 4,
//   },
//   segment: {
//     flex: 1,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 9,
//     borderRadius: 9,
//   },
//   segmentActive: {
//     backgroundColor: '#ffffff',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.08,
//     shadowRadius: 3,
//     elevation: 2,
//   },
//   segmentLabel: { fontSize: 13.5, fontWeight: '600', color: '#7e808c' },
//   segmentLabelActive: { color: THEME_COLOR },
//   segmentBadge: {
//     marginLeft: 6,
//     minWidth: 19,
//     height: 19,
//     borderRadius: 9.5,
//     paddingHorizontal: 5,
//     backgroundColor: '#e2e2ea',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   segmentBadgeActive: { backgroundColor: THEME_COLOR },
//   segmentBadgeText: { fontSize: 10, fontWeight: '700', color: '#7e808c' },
//   segmentBadgeTextActive: { color: '#ffffff' },

//   // Orders list — constrained + centered on desktop so cards don't stretch
//   // edge-to-edge on wide screens.
//   ordersList: { padding: 16, paddingBottom: 80 },
//   ordersListDesktop: { width: '100%', maxWidth: 880, alignSelf: 'center', paddingTop: 20 },

//   orderCard: { backgroundColor: '#ffffff', borderRadius: 16, padding: 16, marginBottom: 14, borderWidth: 1, borderColor: '#eeeef4', shadowColor: '#6C5CE7', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 1 },
//   cancelledCard: { opacity: 0.7, borderColor: '#dc3545' },
//   orderHeader: { flexDirection: 'row', alignItems: 'flex-start' },
//   orderIdBadge: { width: 34, height: 34, borderRadius: 10, backgroundColor: THEME_COLOR_LIGHT, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
//   orderLeft: { flex: 1 },
//   orderRestaurant: { fontSize: 16, fontWeight: '700', color: '#282c3f', marginBottom: 2 },
//   orderDetails: { fontSize: 13, color: '#7e808c', marginTop: 2 },
//   driverChip: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 5 },
//   orderId: { fontSize: 11.5, color: '#9a9ca8' },
//   statusBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20, marginLeft: 8 },
//   statusText: { fontSize: 12, fontWeight: '600', marginLeft: 4 },
//   orderFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 14, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#f4f4f8' },
//   orderTimeRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
//   orderTime: { fontSize: 12, color: '#a2a4b0' },
//   footerButtons: { flexDirection: 'row', alignItems: 'center', gap: 8 },
//   cancelButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FEF2F2', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 9, borderWidth: 1, borderColor: '#FCDCDC' },
//   cancelButtonText: { color: '#dc3545', fontSize: 12, fontWeight: '600', marginLeft: 4 },
//   viewButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: THEME_COLOR_LIGHT, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 9, borderWidth: 1, borderColor: '#E3DEFB' },
//   viewButtonText: { color: THEME_COLOR, fontSize: 12, fontWeight: '600', marginLeft: 4 },

//   emptyContainer: { alignItems: 'center', justifyContent: 'center', paddingVertical: 80 },
//   emptyText: { fontSize: 18, fontWeight: '500', color: '#282c3f', marginTop: 16 },
//   emptySubText: { fontSize: 14, color: '#7e808c', marginTop: 8, marginBottom: 24 },

//   amazonModalContainer: { flex: 1, backgroundColor: '#f5f5f5' },
//   amazonModalHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 14, backgroundColor: '#ffffff', borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
//   amazonModalBackButton: { padding: 4 },
//   amazonModalTitle: { fontSize: 20, fontWeight: '700', color: '#000000' },
//   amazonModalActionButton: { padding: 4 },
//   amazonModalActionText: { color: '#007185', fontSize: 14, fontWeight: '500' },
//   amazonNotificationsList: { padding: 16, paddingBottom: 40 },
//   amazonCard: { backgroundColor: '#ffffff', padding: 16, marginBottom: 12, borderRadius: 12, borderWidth: 1, borderColor: '#e8e8e8', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 },
//   amazonCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 },
//   amazonTitleRow: { flexDirection: 'row', alignItems: 'center', flex: 1 },
//   amazonIconCircle: { width: 28, height: 28, borderRadius: 14, backgroundColor: THEME_COLOR, justifyContent: 'center', alignItems: 'center', marginRight: 10 },
//   amazonTitleColumn: { flex: 1 },
//   amazonTitleText: { fontSize: 16, fontWeight: '700', color: '#000000' },
//   amazonTimeText: { fontSize: 12, color: '#565959' },
//   amazonHeaderRight: { flexDirection: 'row', alignItems: 'center', gap: 12 },
//   amazonUnreadDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: THEME_COLOR },
//   amazonBodyText: { fontSize: 14, color: '#0f1111', lineHeight: 20, marginBottom: 4 },
//   amazonOrderIdText: { fontSize: 12, color: '#565959', marginBottom: 12 },
//   amazonDeliveryCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f7f8fa', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#e8e8e8', marginBottom: 14 },
//   amazonDeliveryLeft: { flex: 1 },
//   amazonDeliveryTitle: { fontSize: 13, color: '#0f1111' },
//   amazonDeliveryDate: { fontSize: 15, fontWeight: '700', color: '#067d62' },
//   amazonProductImagePlaceholder: { width: 48, height: 48, borderRadius: 8, backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#f0f0f0' },
//   amazonActionButton: { backgroundColor: THEME_COLOR, paddingVertical: 12, borderRadius: 8, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: THEME_COLOR },
//   amazonActionButtonText: { fontSize: 14, fontWeight: '600', color: '#ffffff' },
//   loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
//   errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
//   errorText: { color: '#dc3545', fontSize: 16, marginTop: 10, marginBottom: 20 },
//   retryButton: { backgroundColor: THEME_COLOR, paddingHorizontal: 30, paddingVertical: 10, borderRadius: 8 },
//   retryButtonText: { color: '#ffffff', fontSize: 16, fontWeight: '500' },
//   emptyNotifications: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 60 },
//   emptyNotificationsText: { fontSize: 18, fontWeight: '500', color: '#282c3f', marginTop: 16 },
//   emptyNotificationsSubText: { fontSize: 14, color: '#7e808c', marginTop: 8 },
// });

// export default OrdersScreen;
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
  useWindowDimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { ordersApi, CustomerOrder, CustomerTrackingStatus } from '../../api/orders';
import notificationService, { Notification } from '../../services/notificationService';
import { AuthContext } from '../../context/AuthContext';
import { SelectedBusinessContext } from '../../context/SelectedBusinessContext';

// ✅ Theme color — matched to Cart / Address / Payment screens' purple/indigo
const THEME_COLOR = '#6C5CE7';
const THEME_COLOR_LIGHT = '#F1EFFE'; // light tint for badges/backgrounds

// ✅ Same constants used by the other redesigned screens (Cart/Profile) —
// kept in sync so this screen matches the same desktop-web behaviour.
const WEB_NAV_HEIGHT = 64;
const DESKTOP_BREAKPOINT = 768;

const OrdersScreen: React.FC = ({ navigation }: any) => {
  const { width: windowWidth } = useWindowDimensions();
  const isDesktopWeb = Platform.OS === 'web' && windowWidth >= DESKTOP_BREAKPOINT;

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

  // ── Notifications ──────────────────────────────────────────────
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
        <TouchableOpacity
          style={styles.amazonActionButton}
          onPress={() => {
            handleMarkAsRead(item.id);
            setShowNotifications(false);
            if (numericOrderId) {
              navigation.navigate('OrderTracking', { orderId: numericOrderId });
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
    OUT_FOR_DELIVERY: { label: 'On the way', color: THEME_COLOR, icon: 'bicycle' },
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

  // ── Cancel order ─────────────────────────────────────────────
  const doCancelOrder = async (item: CustomerOrder) => {
    try {
      const response = await ordersApi.cancelOrder(item.id);
      let updatedStatus: CustomerTrackingStatus = 'CANCELLED';

      if (response && typeof response === 'object') {
        if ('tracking_status' in response) {
          updatedStatus = (response as any).tracking_status;
        } else if ('data' in response && response.data && typeof response.data === 'object' && 'tracking_status' in response.data) {
          updatedStatus = (response.data as any).tracking_status;
        } else if ('status' in response) {
          updatedStatus = (response as any).status as CustomerTrackingStatus;
        } else if ('data' in response && response.data && typeof response.data === 'object' && 'status' in response.data) {
          updatedStatus = (response.data as any).status as CustomerTrackingStatus;
        }
      }

      setOrdersList((prev) =>
        prev.map((o) =>
          o.id === item.id
            ? { ...o, tracking_status: updatedStatus }
            : o,
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
      fetchOrders(true);
    }
  };

  const handleCancelOrder = (item: CustomerOrder) => {
    if (Platform.OS === 'web') {
      const confirmed = window.confirm(`Are you sure you want to cancel Order #${item.id}?`);
      if (confirmed) doCancelOrder(item);
      return;
    }

    Alert.alert(
      'Cancel Order',
      `Are you sure you want to cancel Order #${item.id}?`,
      [
        { text: 'No', style: 'cancel' },
        { text: 'Yes, Cancel', style: 'destructive', onPress: () => doCancelOrder(item) },
      ],
    );
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
    const showViewButton = !isPast;

    return (
      <TouchableOpacity
        style={[styles.orderCard, isCancelled && styles.cancelledCard]}
        onPress={() => {
          if (isPast) return;
          handleViewOrder(item);
        }}
        activeOpacity={isPast ? 1 : 0.7}
      >
        <View style={styles.orderHeader}>
          <View style={styles.orderIdBadge}>
            <Icon name="bag-handle-outline" size={15} color={THEME_COLOR} />
          </View>
          <View style={styles.orderLeft}>
            {/* ✅ Updated: Show business_name or store_name or fallback to Order #ID */}
            <Text style={styles.orderRestaurant}>
              {item.business_name || item.store_name || `Order #${item.id}`}
            </Text>
            {/* ✅ Updated: Show description instead of amount */}
            <Text style={styles.orderProducts} numberOfLines={1}>
              {item.description || 'Order items'}
            </Text>
            {/* ✅ Updated: Show order time */}
            <Text style={styles.orderTimeText}>{formatDate(item.entry_date)}</Text>
            {item.delivery?.driver_name && (
              <View style={styles.driverChip}>
                <Icon name="bicycle-outline" size={11} color="#7e808c" />
                <Text style={styles.orderId}>{item.delivery.driver_name}</Text>
              </View>
            )}
          </View>
          <View style={[styles.statusBadge, { backgroundColor: meta.color + '18' }]}>
            <Icon name={meta.icon as any} size={13} color={meta.color} />
            <Text style={[styles.statusText, { color: meta.color }]}>{meta.label}</Text>
          </View>
        </View>
        <View style={styles.orderFooter}>
          <View style={styles.orderTimeRow}>
            <Icon name="time-outline" size={12} color="#a2a4b0" />
            <Text style={styles.orderTime}>₹{item.amount}</Text>
          </View>
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
                <Icon name="eye-outline" size={14} color={THEME_COLOR} />
                <Text style={styles.viewButtonText}>Track</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const TABS: { key: 'current' | 'past' | 'cancelled'; label: string }[] = [
    { key: 'current', label: 'Current' },
    { key: 'past', label: 'Past' },
    { key: 'cancelled', label: 'Cancelled' },
  ];

  return (
    <SafeAreaView style={[styles.container, isDesktopWeb && { paddingTop: WEB_NAV_HEIGHT }]}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* Header — full-bleed toolbar, same on mobile & web */}
      <View style={styles.header}>
        <View style={[styles.headerInner, isDesktopWeb && styles.headerInnerDesktop]}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Icon name="arrow-back" size={24} color="#282c3f" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Orders</Text>
          <TouchableOpacity style={styles.headerRight} onPress={() => setShowNotifications(true)}>
            <Icon name="notifications-outline" size={24} color={THEME_COLOR} />
            {unreadCount > 0 && (
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationBadgeText}>{unreadCount > 9 ? '9+' : unreadCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Tabs */}
      {isDesktopWeb ? (
        // ── Desktop web: fixed-width segmented control, each segment is an
        // equal flex:1 slot inside one rounded track — no CSS `gap` and no
        // overlapping absolutely-positioned pieces, so it can't collide.
        <View style={styles.segmentedOuter}>
          <View style={styles.segmentedTrack}>
            {TABS.map(({ key, label }) => {
              const active = activeTab === key;
              const count = getTabCount(key);
              return (
                <TouchableOpacity
                  key={key}
                  style={[styles.segment, active && styles.segmentActive]}
                  onPress={() => setActiveTab(key)}
                  activeOpacity={0.75}
                >
                  <Text style={[styles.segmentLabel, active && styles.segmentLabelActive]}>{label}</Text>
                  {count > 0 && (
                    <View style={[styles.segmentBadge, active && styles.segmentBadgeActive]}>
                      <Text style={[styles.segmentBadgeText, active && styles.segmentBadgeTextActive]}>{count}</Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      ) : (
        // ── Mobile / narrow web: original underline-tab row, unchanged
        <View style={styles.tabsContainer}>
          {TABS.map(({ key, label }) => {
            const active = activeTab === key;
            return (
              <TouchableOpacity key={key} style={styles.tab} onPress={() => setActiveTab(key)} activeOpacity={0.7}>
                <Text style={[styles.tabText, active && styles.activeTabText]}>{label}</Text>
                {getTabCount(key) > 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{getTabCount(key)}</Text>
                  </View>
                )}
                {active && <View style={styles.tabIndicator} />}
              </TouchableOpacity>
            );
          })}
        </View>
      )}

      {ordersLoading ? (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color={THEME_COLOR} />
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
          contentContainerStyle={[styles.ordersList, isDesktopWeb && styles.ordersListDesktop]}
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

      {/* NOTIFICATION MODAL */}
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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },

  // Header (full-bleed toolbar; inner content constrained on desktop)
  header: { backgroundColor: '#ffffff', borderBottomWidth: 1, borderBottomColor: '#f0f0f0', elevation: 2 },
  headerInner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 14 },
  headerInnerDesktop: { width: '100%', maxWidth: 880, alignSelf: 'center', paddingHorizontal: 8 },
  backButton: { padding: 4 },
  headerTitle: { flex: 1, fontSize: 18, fontWeight: '600', color: '#282c3f', textAlign: 'center' },
  headerRight: { padding: 4, position: 'relative' },
  notificationBadge: { position: 'absolute', top: -4, right: -4, backgroundColor: '#dc3545', borderRadius: 10, minWidth: 18, height: 18, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 4 },
  notificationBadgeText: { color: '#ffffff', fontSize: 10, fontWeight: '600' },

  // Mobile tabs (unchanged underline style)
  tabsContainer: { flexDirection: 'row', backgroundColor: '#ffffff', borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  tab: { flex: 1, paddingVertical: 14, alignItems: 'center', position: 'relative', flexDirection: 'row', justifyContent: 'center' },
  tabText: { fontSize: 14, color: '#7e808c', fontWeight: '500' },
  activeTabText: { color: THEME_COLOR, fontWeight: '600' },
  badge: { backgroundColor: THEME_COLOR, borderRadius: 10, paddingHorizontal: 6, paddingVertical: 2, marginLeft: 6, minWidth: 20, alignItems: 'center' },
  badgeText: { color: '#ffffff', fontSize: 10, fontWeight: '600' },
  tabIndicator: { position: 'absolute', bottom: 0, left: '25%', right: '25%', height: 3, backgroundColor: THEME_COLOR, borderRadius: 2 },

  // Desktop segmented control — fixed track width, 3 equal flex:1 slots.
  segmentedOuter: { backgroundColor: '#ffffff', borderBottomWidth: 1, borderBottomColor: '#f0f0f0', alignItems: 'center', paddingVertical: 14 },
  segmentedTrack: {
    flexDirection: 'row',
    width: 420,
    maxWidth: '100%',
    backgroundColor: '#f1f1f5',
    borderRadius: 12,
    padding: 4,
  },
  segment: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 9,
    borderRadius: 9,
  },
  segmentActive: {
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  segmentLabel: { fontSize: 13.5, fontWeight: '600', color: '#7e808c' },
  segmentLabelActive: { color: THEME_COLOR },
  segmentBadge: {
    marginLeft: 6,
    minWidth: 19,
    height: 19,
    borderRadius: 9.5,
    paddingHorizontal: 5,
    backgroundColor: '#e2e2ea',
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentBadgeActive: { backgroundColor: THEME_COLOR },
  segmentBadgeText: { fontSize: 10, fontWeight: '700', color: '#7e808c' },
  segmentBadgeTextActive: { color: '#ffffff' },

  // Orders list — constrained + centered on desktop so cards don't stretch
  // edge-to-edge on wide screens.
  ordersList: { padding: 16, paddingBottom: 80 },
  ordersListDesktop: { width: '100%', maxWidth: 880, alignSelf: 'center', paddingTop: 20 },

  orderCard: { backgroundColor: '#ffffff', borderRadius: 16, padding: 16, marginBottom: 14, borderWidth: 1, borderColor: '#eeeef4', shadowColor: '#6C5CE7', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 1 },
  cancelledCard: { opacity: 0.7, borderColor: '#dc3545' },
  orderHeader: { flexDirection: 'row', alignItems: 'flex-start' },
  orderIdBadge: { width: 34, height: 34, borderRadius: 10, backgroundColor: THEME_COLOR_LIGHT, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  orderLeft: { flex: 1 },
  orderRestaurant: { fontSize: 16, fontWeight: '700', color: '#282c3f', marginBottom: 2 },
  orderProducts: { fontSize: 13, color: '#7e808c', marginTop: 2 },
  orderTimeText: { fontSize: 12, color: '#a2a4b0', marginTop: 2 },
  driverChip: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 5 },
  orderId: { fontSize: 11.5, color: '#9a9ca8' },
  statusBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20, marginLeft: 8 },
  statusText: { fontSize: 12, fontWeight: '600', marginLeft: 4 },
  orderFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 14, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#f4f4f8' },
  orderTimeRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  orderTime: { fontSize: 12, color: '#a2a4b0' },
  footerButtons: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  cancelButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FEF2F2', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 9, borderWidth: 1, borderColor: '#FCDCDC' },
  cancelButtonText: { color: '#dc3545', fontSize: 12, fontWeight: '600', marginLeft: 4 },
  viewButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: THEME_COLOR_LIGHT, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 9, borderWidth: 1, borderColor: '#E3DEFB' },
  viewButtonText: { color: THEME_COLOR, fontSize: 12, fontWeight: '600', marginLeft: 4 },

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
  amazonIconCircle: { width: 28, height: 28, borderRadius: 14, backgroundColor: THEME_COLOR, justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  amazonTitleColumn: { flex: 1 },
  amazonTitleText: { fontSize: 16, fontWeight: '700', color: '#000000' },
  amazonTimeText: { fontSize: 12, color: '#565959' },
  amazonHeaderRight: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  amazonUnreadDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: THEME_COLOR },
  amazonBodyText: { fontSize: 14, color: '#0f1111', lineHeight: 20, marginBottom: 4 },
  amazonOrderIdText: { fontSize: 12, color: '#565959', marginBottom: 12 },
  amazonDeliveryCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f7f8fa', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#e8e8e8', marginBottom: 14 },
  amazonDeliveryLeft: { flex: 1 },
  amazonDeliveryTitle: { fontSize: 13, color: '#0f1111' },
  amazonDeliveryDate: { fontSize: 15, fontWeight: '700', color: '#067d62' },
  amazonProductImagePlaceholder: { width: 48, height: 48, borderRadius: 8, backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#f0f0f0' },
  amazonActionButton: { backgroundColor: THEME_COLOR, paddingVertical: 12, borderRadius: 8, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: THEME_COLOR },
  amazonActionButtonText: { fontSize: 14, fontWeight: '600', color: '#ffffff' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  errorText: { color: '#dc3545', fontSize: 16, marginTop: 10, marginBottom: 20 },
  retryButton: { backgroundColor: THEME_COLOR, paddingHorizontal: 30, paddingVertical: 10, borderRadius: 8 },
  retryButtonText: { color: '#ffffff', fontSize: 16, fontWeight: '500' },
  emptyNotifications: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 60 },
  emptyNotificationsText: { fontSize: 18, fontWeight: '500', color: '#282c3f', marginTop: 16 },
  emptyNotificationsSubText: { fontSize: 14, color: '#7e808c', marginTop: 8 },
});

export default OrdersScreen;