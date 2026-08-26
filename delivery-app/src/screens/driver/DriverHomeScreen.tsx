// import React, { useContext, useMemo, useState } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   StatusBar,
//   SafeAreaView,
//   ScrollView,
//   Switch,
//   Alert,
//   ActivityIndicator,
//   Platform,
//   useWindowDimensions,
// } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import { useNavigation } from '@react-navigation/native';
// import { DriverAuthContext } from '../../context/DriverAuthContext';
// import { COLORS, NotificationRow } from '../../components/driver/DriverHomeComponents';
// import { NotificationEntry, NotificationType } from '../../types/driverHome.types';

// // ── Orval-generated hooks (run codegen after updating openapi.yaml) ────────
// import {
//   useGetDriver,
//   useGetDriverStats,
//   useGetDriverEarnings,
//   useListDeliveries,
//   useListNotifications,
//   useUpdateDriver,
//   useUpdateDeliveryStatus,
// } from '@workspace/api-client-react';

// const FONT_FAMILY = Platform.select({
//   web: '"Times New Roman", Times, serif',
//   default: 'Times New Roman', // register via expo-font / app.json for native
// });

// // Suppresses the browser's default focus ring on RN Web TouchableOpacity
// const webNoOutlineStyle = (Platform.OS === 'web' ? { outlineStyle: 'none' } : {}) as any;

// function showAlert(title: string, message?: string) {
//   if (Platform.OS === 'web') {
//     // eslint-disable-next-line no-alert
//     window.alert(message ? `${title}\n\n${message}` : title);
//   } else {
//     Alert.alert(title, message);
//   }
// }

// // ── Local colors not yet in the shared COLORS palette ──────────────────────
// // TODO: move these into DriverHomeComponents' COLORS once agreed on.
// const SIDEBAR = {
//   bg: '#0B1220',
//   bgActive: '#16A34A',
//   text: '#CBD5E1',
//   textMuted: '#64748B',
//   border: '#1E293B',
// };

// // ── Local shape of the API's Delivery object ────────────────────────────────
// interface ApiDelivery {
//   id: number;
//   business_id: number;
//   customer_id: number;
//   driver_id: number | null;
//   pickup_address: string;
//   drop_address: string;
//   status: string;
//   notes?: string | null;
//   amount?: number | null;
//   payment_method?: string | null;
//   distance_km?: number | null;
//   assigned_at?: string | null;
//   picked_up_at?: string | null;
//   delivered_at?: string | null;
//   cancelled_at?: string | null;
//   created_at: string;
//   customer_name?: string;
//   customer_phone?: string;
// }

// interface ApiNotification {
//   id: number;
//   type: NotificationType;
//   message: string;
//   created_at: string;
// }

// function initials(name?: string) {
//   if (!name) return '?';
//   return name.trim().split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase();
// }

// function timeAgo(iso?: string | null) {
//   if (!iso) return '';
//   const diffMs = Date.now() - new Date(iso).getTime();
//   const mins = Math.max(0, Math.round(diffMs / 60000));
//   if (mins < 1) return 'Just now';
//   if (mins < 60) return `${mins} min ago`;
//   const hrs = Math.round(mins / 60);
//   return `${hrs} hr${hrs > 1 ? 's' : ''} ago`;
// }

// const bottomTabs: { key: string; label: string; icon: string; screen?: string }[] = [
//   { key: 'home', label: 'Home', icon: 'home', screen: 'DriverHome' },
//   { key: 'orders', label: 'Orders', icon: 'receipt-outline', screen: 'DriverOrders' },
//   { key: 'earnings', label: 'Earnings', icon: 'wallet-outline', screen: 'DriverEarnings' },
//   { key: 'notifications', label: 'Notifications', icon: 'notifications-outline', screen: 'DriverAlerts' },
//   { key: 'profile', label: 'Profile', icon: 'person-outline', screen: 'DriverProfile' },
// ];
// const ACTIVE_TAB = 'home';

// // ── Tiny line-sparkline (no chart lib / no new dependency) ─────────────────
// // Built from small rotated <View> segments connecting each point — mimics a
// // real line chart without pulling in react-native-svg or a chart library.
// const SPARK_W = 130;
// const SPARK_H = 32;
// const Sparkline: React.FC<{ values: number[]; color: string }> = ({ values, color }) => {
//   const max = Math.max(...values, 1);
//   const min = Math.min(...values, 0);
//   const range = Math.max(max - min, 1);
//   const points = values.map((v, i) => ({
//     x: (i / Math.max(values.length - 1, 1)) * SPARK_W,
//     y: 4 + (1 - (v - min) / range) * (SPARK_H - 8),
//   }));

//   return (
//     <View style={[styles.sparkline, { width: SPARK_W, height: SPARK_H }]}>
//       {points.slice(0, -1).map((p, i) => {
//         const next = points[i + 1];
//         const dx = next.x - p.x;
//         const dy = next.y - p.y;
//         const length = Math.sqrt(dx * dx + dy * dy);
//         const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
//         return (
//           <View
//             key={i}
//             style={[
//               styles.sparklineSegment,
//               {
//                 left: p.x,
//                 top: p.y - 1,
//                 width: length,
//                 backgroundColor: color,
//                 opacity: 0.5 + (i / points.length) * 0.5,
//                 transform: [{ rotate: `${angle}deg` }],
//                 ...(Platform.OS === 'web' ? ({ transformOrigin: 'left center' } as any) : null),
//               },
//             ]}
//           />
//         );
//       })}
//       {points.length > 0 && (
//         <View style={[styles.sparklineDot, { left: points[points.length - 1].x - 3, top: points[points.length - 1].y - 3, backgroundColor: color }]} />
//       )}
//     </View>
//   );
// };

// // Static placeholder trend shapes until the stats API returns a time series.
// // TODO: replace with real hourly/daily series once /api/driver/dashboard exposes it.
// const MOCK_TRENDS = {
//   total: [2, 3, 2, 4, 3, 5, 4, 5],
//   newAssign: [1, 0, 1, 2, 1, 2, 1, 2],
//   active: [0, 1, 0, 1, 1, 0, 1, 1],
//   completed: [0, 1, 1, 1, 2, 2, 3, 3],
// };

// const StatCard: React.FC<{
//   icon: keyof typeof Ionicons.glyphMap;
//   iconColor: string;
//   iconBg: string;
//   value: string | number;
//   label: string;
//   sublabel: string;
//   trend: number[];
// }> = ({ icon, iconColor, iconBg, value, label, sublabel, trend }) => (
//   <View style={styles.statCard}>
//     <View style={[styles.statIconWrap, { backgroundColor: iconBg }]}>
//       <Ionicons name={icon} size={18} color={iconColor} />
//     </View>
//     <Text style={styles.statValue}>{value}</Text>
//     <Text style={styles.statLabel}>{label}</Text>
//     <Text style={styles.statSublabel}>{sublabel}</Text>
//     <Sparkline values={trend} color={iconColor} />
//   </View>
// );

// // Bigger horizontal card for Today's Summary — sized to match the top stat
// // cards (the shared library's SummaryCard was too compact for this layout).
// const SummaryStatCard: React.FC<{
//   icon: keyof typeof Ionicons.glyphMap;
//   iconColor: string;
//   iconBg: string;
//   value: string;
//   label: string;
//   sublabel?: string;
// }> = ({ icon, iconColor, iconBg, value, label, sublabel }) => (
//   <View style={styles.summaryStatCard}>
//     <View style={[styles.summaryStatIconWrap, { backgroundColor: iconBg }]}>
//       <Ionicons name={icon} size={20} color={iconColor} />
//     </View>
//     <Text style={styles.summaryStatValue}>{value}</Text>
//     <Text numberOfLines={1} style={styles.summaryStatLabel}>{label}</Text>
//     {sublabel ? <Text style={styles.summaryStatSublabel}>{sublabel}</Text> : null}
//   </View>
// );

// const SectionTitleRow: React.FC<{ title: string; onViewAll?: () => void }> = ({ title, onViewAll }) => (
//   <View style={styles.sectionTitleRow}>
//     <Text style={styles.sectionTitle}>{title}</Text>
//     {onViewAll && (
//       <TouchableOpacity onPress={onViewAll} hitSlop={6} style={webNoOutlineStyle}>
//         <Text style={styles.viewAllLink}>View All ›</Text>
//       </TouchableOpacity>
//     )}
//   </View>
// );

// // Simple static route-preview graphic — not a real map, just a visual echo
// // of the mockup until a maps SDK is wired in.
// // TODO: replace with react-native-maps / a static maps image once available.
// const RoutePreview: React.FC = () => (
//   <View style={styles.routePreview}>
//     <View style={styles.routeDotStart} />
//     <View style={styles.routeLine} />
//     <Ionicons name="location" size={18} color={COLORS.danger} style={styles.routePin} />
//   </View>
// );

// const DriverHomeScreen: React.FC = () => {
//   const navigation = useNavigation<any>();
//   const { driver: authDriver, driverLogout } = useContext(DriverAuthContext) as any;
//   const driverId = authDriver?.id;
//   const businessId = authDriver?.business_id;

//   const { width } = useWindowDimensions();
//   const isWideWeb = Platform.OS === 'web' && width >= 1000;

//   const [isOnline, setIsOnline] = useState<boolean>(authDriver?.status === 'available');

//   // ── Data fetching (unchanged from existing wiring) ─────────────────────
//   const { data: driver, isLoading: driverLoading } = useGetDriver(driverId, { query: { enabled: !!driverId } });
//   const { data: stats, isLoading: statsLoading } = useGetDriverStats(driverId, { query: { enabled: !!driverId } });
//   const { data: earnings } = useGetDriverEarnings(driverId, { query: { enabled: !!driverId } });
//   const { data: deliveriesResponse, isLoading: deliveriesLoading, refetch: refetchDeliveries } = useListDeliveries(
//     { driver_id: driverId, business_id: businessId },
//     { query: { enabled: !!driverId && !!businessId } }
//   );
//   const { data: notificationsData } = useListNotifications(
//     { driver_id: driverId, limit: 8 },
//     { query: { enabled: !!driverId } }
//   );

//   const updateDriver = useUpdateDriver();
//   const updateDeliveryStatus = useUpdateDeliveryStatus();

//   const isLoading = driverLoading || statsLoading || deliveriesLoading;

//   // ── Derived view data ───────────────────────────────────────────────────
//   const deliveriesPayload: any = deliveriesResponse;
//   const allDeliveries: ApiDelivery[] = Array.isArray(deliveriesPayload)
//     ? deliveriesPayload
//     : Array.isArray(deliveriesPayload?.data)
//     ? deliveriesPayload.data
//     : Array.isArray(deliveriesPayload?.data?.data)
//     ? deliveriesPayload.data.data
//     : [];

//   // Active delivery: driver's current in-progress job.
//   const activeDelivery: ApiDelivery | undefined = allDeliveries.find((d) =>
//     ['accepted', 'picked_up', 'in_transit', 'out_for_delivery', 'arrived'].includes(d.status)
//   );

//   // New assignment: most recently assigned job still awaiting driver action.
//   const newAssignment: ApiDelivery | undefined = allDeliveries
//     .filter((d) => d.status === 'assigned')
//     .sort((a, b) => new Date(b.assigned_at ?? b.created_at).getTime() - new Date(a.assigned_at ?? a.created_at).getTime())[0];

//   const rawNotifications: ApiNotification[] = Array.isArray(notificationsData)
//     ? (notificationsData as unknown as ApiNotification[])
//     : (((notificationsData as any)?.data as ApiNotification[]) ?? []);

//   const notifications: NotificationEntry[] = rawNotifications.map((n) => ({
//     id: String(n.id),
//     type: n.type,
//     message: n.message,
//     time: new Date(n.created_at).toLocaleString(),
//   }));

//   const greeting = useMemo(() => {
//     const hour = new Date().getHours();
//     if (hour < 12) return 'Good Morning';
//     if (hour < 17) return 'Good Afternoon';
//     return 'Good Evening';
//   }, []);

//   const today = useMemo(
//     () => new Date().toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric', weekday: 'long' }),
//     []
//   );

//   const handleToggleOnline = (value: boolean) => {
//     setIsOnline(value);
//     if (!driverId) return;
//     updateDriver.mutate({ id: driverId, data: { status: value ? 'available' : 'offline' } });
//   };

//   const handleAcceptNav = () => {
//     if (!activeDelivery) return;
//     navigation.navigate('DriverOrderDetails', { deliveryId: activeDelivery.id });
//   };

//   const handleRejectAssignment = () => {
//     if (!newAssignment) return;
//     updateDeliveryStatus.mutate(
//       { id: newAssignment.id, data: { status: 'cancelled' } },
//       { onSuccess: () => refetchDeliveries(), onError: () => showAlert('Error', 'Could not reject the assignment') }
//     );
//   };

//   const handleViewAssignment = () => {
//     if (!newAssignment) return;
//     navigation.navigate('DriverOrderDetails', { deliveryId: newAssignment.id });
//   };

//   const handleTabPress = (tab: (typeof bottomTabs)[number]) => {
//     if (tab.key === ACTIVE_TAB) return;
//     if (tab.screen) {
//       navigation.navigate(tab.screen);
//     } else {
//       showAlert(tab.label, 'Coming soon');
//     }
//   };

//   // Placeholder — TODO: expose real online-duration from the backend
//   const workingHours = (earnings as any)?.online_duration_hours ?? '—';
//   // Placeholder — TODO: expose real online-payments total from the backend
//   const onlinePaymentsToday = (earnings as any)?.online_payments_today ?? 0;

//   if (isLoading && !driver) {
//     return (
//       <SafeAreaView style={[styles.safe, { alignItems: 'center', justifyContent: 'center' }]}>
//         <ActivityIndicator size="large" color={COLORS.primary} />
//       </SafeAreaView>
//     );
//   }

//   const mainContent = (
//     <ScrollView
//       showsVerticalScrollIndicator={false}
//       contentContainerStyle={[styles.scrollContent, !isWideWeb && { paddingBottom: 90 }]}
//     >
//       <View style={[styles.contentInner, isWideWeb && styles.contentInnerWide]}>
//         {/* ── Header ─────────────────────────────────────────────────── */}
//         <View style={styles.headerRow}>
//           <View style={{ flexDirection: 'row', alignItems: 'center' }}>
//             {!isWideWeb && (
//               <TouchableOpacity style={[styles.iconBtn, webNoOutlineStyle]} hitSlop={8} onPress={() => showAlert('Menu', 'Open menu')}>
//                 <Ionicons name="menu" size={22} color={COLORS.ink} />
//               </TouchableOpacity>
//             )}
//             <View>
//               <Text style={styles.greetingText}>
//                 {greeting}, {driver?.name?.split(' ')[0] ?? 'Driver'}! 👋
//               </Text>
//               <Text style={styles.greetingSub}>Have a great day and drive safe.</Text>
//             </View>
//           </View>

//           <View style={styles.headerRight}>
//             <View style={styles.onlinePill}>
//               <View style={[styles.onlineDot, { backgroundColor: isOnline ? COLORS.secondary : COLORS.slateLight }]} />
//               <Text style={styles.onlinePillText}>{isOnline ? 'Online' : 'Offline'}</Text>
//               <Switch
//                 value={isOnline}
//                 onValueChange={handleToggleOnline}
//                 trackColor={{ false: '#D1D5DB', true: COLORS.secondary }}
//                 thumbColor="#FFFFFF"
//                 style={{ transform: [{ scaleX: 0.75 }, { scaleY: 0.75 }], marginLeft: 4 }}
//               />
//             </View>

//             <TouchableOpacity
//               style={[styles.iconBtn, webNoOutlineStyle]}
//               hitSlop={8}
//               onPress={() => handleTabPress(bottomTabs.find((t) => t.key === 'notifications')!)}
//             >
//               <Ionicons name="notifications-outline" size={20} color={COLORS.ink} />
//               {notifications.length > 0 && (
//                 <View style={styles.notifBadge}>
//                   <Text style={styles.notifBadgeText}>{Math.min(notifications.length, 9)}</Text>
//                 </View>
//               )}
//             </TouchableOpacity>

//             {isWideWeb && (
//               <TouchableOpacity style={[styles.profileChip, webNoOutlineStyle]} onPress={driverLogout}>
//                 <View style={styles.avatar}>
//                   <Text style={styles.avatarText}>{initials(driver?.name)}</Text>
//                 </View>
//                 <View>
//                   <Text style={styles.profileName}>{driver?.name ?? 'Driver'}</Text>
//                   <Text style={styles.profileRole}>Driver</Text>
//                 </View>
//                 <Ionicons name="chevron-down" size={14} color={COLORS.slate} />
//               </TouchableOpacity>
//             )}
//           </View>
//         </View>

//         {/* ── Stat cards ─────────────────────────────────────────────── */}
//         <View style={styles.statRow}>
//           <View style={styles.statCol}>
//             <StatCard
//               icon="bicycle-outline"
//               iconColor={COLORS.secondary}
//               iconBg={COLORS.secondaryLight}
//               value={stats?.total_deliveries ?? 0}
//               label="Today's Deliveries"
//               sublabel="Total assigned"
//               trend={MOCK_TRENDS.total}
//             />
//           </View>
//           <View style={styles.statCol}>
//             <StatCard
//               icon="bag-handle-outline"
//               iconColor={COLORS.amber}
//               iconBg={COLORS.amberLight}
//               value={stats?.pending_deliveries ?? (newAssignment ? 1 : 0)}
//               label="New Assignments"
//               sublabel="Waiting for action"
//               trend={MOCK_TRENDS.newAssign}
//             />
//           </View>
//           <View style={styles.statCol}>
//             <StatCard
//               icon="bus-outline"
//               iconColor={COLORS.primary}
//               iconBg={COLORS.primaryLight}
//               value={activeDelivery ? 1 : 0}
//               label="Active Delivery"
//               sublabel="In progress"
//               trend={MOCK_TRENDS.active}
//             />
//           </View>
//           <View style={styles.statCol}>
//             <StatCard
//               icon="checkmark-circle-outline"
//               iconColor="#7C3AED"
//               iconBg="#EDE9FE"
//               value={stats?.completed_deliveries ?? 0}
//               label="Completed Today"
//               sublabel="Successfully delivered"
//               trend={MOCK_TRENDS.completed}
//             />
//           </View>
//           {isWideWeb && (
//             <View style={styles.miniInfoCol}>
//               <View style={styles.miniInfoCard}>
//                 <Ionicons name="calendar-outline" size={16} color={COLORS.slate} />
//                 <Text style={styles.miniInfoValue}>{today}</Text>
//               </View>
//               <View style={[styles.miniInfoCard, { position: 'relative' }]}>
//                 {isOnline && <View style={styles.miniInfoOnlineDot} />}
//                 <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
//                   <Ionicons name="time-outline" size={16} color={COLORS.slate} />
//                   <Text style={styles.miniInfoLabel}>Working Hours</Text>
//                 </View>
//                 <Text style={styles.miniInfoValue}>{workingHours} hrs</Text>
//                 <Text style={styles.miniInfoSub}>Online today</Text>
//               </View>
//             </View>
//           )}
//         </View>

//         {/* ── Active Delivery + New Assignment ──────────────────────────── */}
//         <View style={[styles.twoColRow, !isWideWeb && styles.stackedCol]}>
//           <View style={isWideWeb ? styles.twoColLeft : undefined}>
//             <SectionTitleRow title="Active Delivery" onViewAll={() => navigation.navigate('DriverOrders')} />
//             {activeDelivery ? (
//               <View style={styles.activeCard}>
//                 <View style={styles.statusBadge}>
//                   <Text style={styles.statusBadgeText}>{activeDelivery.status.replace(/_/g, ' ').toUpperCase()}</Text>
//                 </View>

//                 <View style={styles.activeMainRow}>
//                   <View style={{ flex: 1 }}>
//                     <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
//                       <View style={styles.customerAvatar}>
//                         <Text style={styles.customerAvatarText}>{initials(activeDelivery.customer_name)}</Text>
//                       </View>
//                       <View>
//                         <Text style={styles.orderIdText}>Order #{activeDelivery.id}</Text>
//                         <Text style={styles.customerNameText}>{activeDelivery.customer_name ?? 'Customer'}</Text>
//                       </View>
//                     </View>
//                     <View style={styles.addressRow}>
//                       <Ionicons name="call-outline" size={13} color={COLORS.slate} />
//                       <Text style={styles.addressText}>{activeDelivery.customer_phone ?? '—'}</Text>
//                     </View>
//                     <View style={styles.addressRow}>
//                       <Ionicons name="location-outline" size={13} color={COLORS.slate} />
//                       <Text style={styles.addressText}>{activeDelivery.drop_address}</Text>
//                     </View>
//                   </View>

//                   {isWideWeb && (
//                     <View style={styles.mapWrap}>
//                       <RoutePreview />
//                       <View style={styles.distancePill}>
//                         <Ionicons name="navigate-outline" size={12} color={COLORS.primary} />
//                         <Text style={styles.distancePillText}>{activeDelivery.distance_km ?? '—'} km</Text>
//                       </View>
//                     </View>
//                   )}
//                 </View>

//                 <View style={styles.activeFooterRow}>
//                   <View>
//                     <Text style={styles.footerAmount}>₹{Number(activeDelivery.amount ?? 0).toFixed(2)}</Text>
//                     <Text style={styles.footerAmountLabel}>Order Amount</Text>
//                   </View>
//                   <View>
//                     <Text style={styles.footerTime}>
//                       {activeDelivery.assigned_at
//                         ? new Date(activeDelivery.assigned_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
//                         : '—'}
//                     </Text>
//                     <Text style={styles.footerAmountLabel}>Assigned Time</Text>
//                   </View>
//                   <TouchableOpacity style={[styles.primaryBtn, webNoOutlineStyle]} onPress={handleAcceptNav}>
//                     <Text style={styles.primaryBtnText}>View Delivery Details</Text>
//                     <Ionicons name="chevron-forward" size={14} color="#FFFFFF" />
//                   </TouchableOpacity>
//                 </View>
//               </View>
//             ) : (
//               <View style={styles.emptyCard}>
//                 <Ionicons name="cube-outline" size={26} color={COLORS.slateLight} />
//                 <Text style={styles.emptyTitle}>No Active Delivery</Text>
//                 <Text style={styles.emptyText}>You don't have an active delivery right now. We'll notify you when a new delivery is assigned.</Text>
//               </View>
//             )}
//           </View>

//           <View style={isWideWeb ? styles.twoColRight : { marginTop: 22 }}>
//             <SectionTitleRow title="New Assignment" onViewAll={() => navigation.navigate('DriverOrders')} />
//             {newAssignment ? (
//               <View style={styles.assignCard}>
//                 <View style={styles.assignHeaderRow}>
//                   <View style={styles.assignBadge}>
//                     <Text style={styles.assignBadgeText}>NEW ASSIGNMENT</Text>
//                   </View>
//                   <Text style={styles.assignTimeAgo}>{timeAgo(newAssignment.assigned_at ?? newAssignment.created_at)}</Text>
//                 </View>

//                 <Text style={styles.orderIdText}>Order #{newAssignment.id}</Text>
//                 <Text style={styles.customerNameText}>{newAssignment.customer_name ?? 'Customer'}</Text>
//                 <View style={styles.addressRow}>
//                   <Ionicons name="call-outline" size={13} color={COLORS.slate} />
//                   <Text style={styles.addressText}>{newAssignment.customer_phone ?? '—'}</Text>
//                 </View>
//                 <View style={styles.addressRow}>
//                   <Ionicons name="location-outline" size={13} color={COLORS.slate} />
//                   <Text style={styles.addressText}>{newAssignment.drop_address}</Text>
//                 </View>

//                 <View style={styles.assignStatsRow}>
//                   <View>
//                     <Text style={styles.footerAmount}>{newAssignment.distance_km ?? '—'} km</Text>
//                     <Text style={styles.footerAmountLabel}>Distance</Text>
//                   </View>
//                   <View>
//                     <Text style={styles.footerAmount}>₹{Number(newAssignment.amount ?? 0).toFixed(2)}</Text>
//                     <Text style={styles.footerAmountLabel}>Order Amount</Text>
//                   </View>
//                 </View>

//                 <View style={styles.assignBtnRow}>
//                   <TouchableOpacity style={[styles.rejectBtn, webNoOutlineStyle]} onPress={handleRejectAssignment}>
//                     <Text style={styles.rejectBtnText}>Reject</Text>
//                   </TouchableOpacity>
//                   <TouchableOpacity style={[styles.primaryBtn, { flex: 1, justifyContent: 'center' }, webNoOutlineStyle]} onPress={handleViewAssignment}>
//                     <Text style={styles.primaryBtnText}>View Order</Text>
//                   </TouchableOpacity>
//                 </View>
//               </View>
//             ) : (
//               <View style={styles.emptyCard}>
//                 <Ionicons name="checkmark-circle-outline" size={26} color={COLORS.slateLight} />
//                 <Text style={styles.emptyTitle}>No New Deliveries</Text>
//                 <Text style={styles.emptyText}>You're all caught up! 🎉</Text>
//               </View>
//             )}
//           </View>
//         </View>

//         {/* ── Today's Summary + Recent Activity ─────────────────────────── */}
//         <View style={[styles.twoColRow, !isWideWeb && styles.stackedCol]}>
//           <View style={isWideWeb ? styles.twoColLeft : undefined}>
//             <SectionTitleRow title="Today's Summary" />
//             <View style={[styles.summaryStrip, !isWideWeb && { flexWrap: 'wrap' }]}>
//               <View style={styles.summaryGridItem}>
//                 <SummaryStatCard
//                   label="Completed Deliveries"
//                   sublabel={(stats?.completed_deliveries ?? 0) > 0 ? 'Good job! 🎉' : undefined}
//                   value={`${stats?.completed_deliveries ?? 0}`}
//                   icon="checkmark-done-outline"
//                   iconColor={COLORS.secondary}
//                   iconBg={COLORS.secondaryLight}
//                 />
//               </View>
//               <View style={styles.summaryGridItem}>
//                 <SummaryStatCard
//                   label="COD Collected"
//                   sublabel="Today"
//                   value={`₹${earnings?.cod_collected ?? 0}`}
//                   icon="cash-outline"
//                   iconColor={COLORS.amber}
//                   iconBg={COLORS.amberLight}
//                 />
//               </View>
//               <View style={styles.summaryGridItem}>
//                 <SummaryStatCard
//                   label="Online Payments"
//                   sublabel="Today"
//                   value={`₹${onlinePaymentsToday}`}
//                   icon="card-outline"
//                   iconColor={COLORS.primary}
//                   iconBg={COLORS.primaryLight}
//                 />
//               </View>
//               <View style={styles.summaryGridItem}>
//                 <SummaryStatCard
//                   label="Online Duration"
//                   sublabel="Today"
//                   value={`${workingHours} hrs`}
//                   icon="time-outline"
//                   iconColor="#7C3AED"
//                   iconBg="#EDE9FE"
//                 />
//               </View>
//             </View>
//           </View>

//           <View style={isWideWeb ? styles.twoColRight : { marginTop: 22 }}>
//             <SectionTitleRow title="Recent Activity" onViewAll={() => handleTabPress(bottomTabs.find((t) => t.key === 'notifications')!)} />
//             <View style={styles.activityCard}>
//               {notifications.length === 0 ? (
//                 <Text style={styles.emptyText}>No recent activity.</Text>
//               ) : (
//                 notifications.slice(0, 5).map((item) => <NotificationRow key={item.id} item={item} />)
//               )}
//             </View>
//           </View>
//         </View>

//         {isWideWeb && (
//           <View style={styles.footerRow}>
//             <Text style={styles.footerText}>© {new Date().getFullYear()} Khata-Pro Drivers. All rights reserved.</Text>
//           </View>
//         )}
//       </View>
//     </ScrollView>
//   );

//   // ── Wide web: dark sidebar layout ─────────────────────────────────────
//   if (isWideWeb) {
//     return (
//       <SafeAreaView style={styles.safe}>
//         <StatusBar barStyle="dark-content" backgroundColor={COLORS.bg} />
//         <View style={styles.webShell}>
//           <View style={styles.sidebar}>
//             <View>
//               <View style={styles.sidebarBrandRow}>
//                 <View style={styles.sidebarLogo}>
//                   <Ionicons name="bicycle" size={18} color="#FFFFFF" />
//                 </View>
//                 <Text style={styles.sidebarBrand}>Khata-Pro{'\n'}Drivers</Text>
//               </View>

//               <View style={{ marginTop: 8 }}>
//                 {bottomTabs.map((tab) => {
//                   const active = tab.key === ACTIVE_TAB;
//                   return (
//                     <TouchableOpacity
//                       key={tab.key}
//                       style={[styles.sidebarItem, active && styles.sidebarItemActive, webNoOutlineStyle]}
//                       onPress={() => handleTabPress(tab)}
//                     >
//                       <Ionicons name={tab.icon as keyof typeof Ionicons.glyphMap} size={18} color={active ? '#FFFFFF' : SIDEBAR.text} />
//                       <Text style={[styles.sidebarItemText, active && { color: '#FFFFFF', fontWeight: '700' }]}>{tab.label}</Text>
//                       {tab.key === 'notifications' && notifications.length > 0 && (
//                         <View style={styles.sidebarBadge}>
//                           <Text style={styles.sidebarBadgeText}>{Math.min(notifications.length, 9)}</Text>
//                         </View>
//                       )}
//                     </TouchableOpacity>
//                   );
//                 })}
//               </View>
//             </View>

//             <View style={styles.sidebarBottom}>
//               <View style={styles.sidebarStatusCard}>
//                 <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
//                   <View style={[styles.onlineDot, { backgroundColor: isOnline ? COLORS.secondary : SIDEBAR.textMuted }]} />
//                   <Text style={styles.sidebarStatusTitle}>{isOnline ? 'Online' : 'Offline'}</Text>
//                 </View>
//                 <Text style={styles.sidebarStatusSub}>
//                   {isOnline ? 'You are available for new deliveries' : 'You will not receive new deliveries'}
//                 </Text>
//                 <TouchableOpacity style={[styles.sidebarToggleBtn, webNoOutlineStyle]} onPress={() => handleToggleOnline(!isOnline)}>
//                   <Ionicons name={isOnline ? 'power' : 'power-outline'} size={14} color={isOnline ? '#FCA5A5' : COLORS.secondary} />
//                   <Text style={[styles.sidebarToggleBtnText, { color: isOnline ? '#FCA5A5' : COLORS.secondary }]}>
//                     {isOnline ? 'Go Offline' : 'Go Online'}
//                   </Text>
//                 </TouchableOpacity>
//               </View>

//               <TouchableOpacity style={[styles.sidebarHelp, webNoOutlineStyle]} onPress={() => showAlert('Need Help?', 'Contact support')}>
//                 <Ionicons name="headset-outline" size={16} color={SIDEBAR.text} />
//                 <View>
//                   <Text style={styles.sidebarHelpTitle}>Need Help?</Text>
//                   <Text style={styles.sidebarHelpSub}>{driver?.phone ?? 'Contact support'}</Text>
//                 </View>
//               </TouchableOpacity>
//             </View>
//           </View>

//           <View style={styles.webMain}>{mainContent}</View>
//         </View>
//       </SafeAreaView>
//     );
//   }

//   // ── Mobile / narrow web ─────────────────────────────────────────────────
//   return (
//     <SafeAreaView style={styles.safe}>
//       <StatusBar barStyle="dark-content" backgroundColor={COLORS.bg} />
//       {mainContent}

//       <View style={styles.bottomNav}>
//         {bottomTabs.map((tab) => {
//           const active = tab.key === ACTIVE_TAB;
//           return (
//             <TouchableOpacity
//               key={tab.key}
//               style={[styles.bottomNavItem, webNoOutlineStyle]}
//               activeOpacity={0.7}
//               onPress={() => handleTabPress(tab)}
//             >
//               <Ionicons name={tab.icon as keyof typeof Ionicons.glyphMap} size={22} color={active ? COLORS.primary : COLORS.slateLight} />
//               <Text numberOfLines={1} style={[styles.bottomNavLabel, { color: active ? COLORS.primary : COLORS.slateLight }]}>{tab.label}</Text>
//             </TouchableOpacity>
//           );
//         })}
//       </View>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   safe: { flex: 1, backgroundColor: COLORS.bg, ...(Platform.OS === 'web' ? ({ height: '100vh' } as any) : null) },
//   scrollContent: { flexGrow: 1 },

//   webShell: { flex: 1, flexDirection: 'row', ...(Platform.OS === 'web' ? ({ height: '100%', overflow: 'hidden' } as any) : null) },
//   sidebar: { width: 220, backgroundColor: SIDEBAR.bg, paddingVertical: 14, paddingHorizontal: 14, justifyContent: 'space-between' },
//   sidebarBrandRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 6, marginBottom: 14 },
//   sidebarLogo: { width: 32, height: 32, borderRadius: 10, backgroundColor: COLORS.secondary, alignItems: 'center', justifyContent: 'center' },
//   sidebarBrand: { fontFamily: FONT_FAMILY, fontSize: 13, fontWeight: '700', color: '#FFFFFF', lineHeight: 16 },
//   sidebarItem: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 12, paddingVertical: 11, borderRadius: 10, marginBottom: 2 },
//   sidebarItemActive: { backgroundColor: SIDEBAR.bgActive },
//   sidebarItemText: { fontFamily: FONT_FAMILY, fontSize: 13.5, color: SIDEBAR.text, flex: 1 },
//   sidebarBadge: { minWidth: 18, height: 18, borderRadius: 9, backgroundColor: COLORS.danger, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 4 },
//   sidebarBadgeText: { fontFamily: FONT_FAMILY, fontSize: 10, fontWeight: '700', color: '#FFFFFF' },
//   sidebarBottom: { gap: 12 },
//   sidebarStatusCard: { backgroundColor: '#111C33', borderRadius: 14, padding: 12 },
//   sidebarStatusTitle: { fontFamily: FONT_FAMILY, fontSize: 13, fontWeight: '700', color: '#FFFFFF' },
//   sidebarStatusSub: { fontFamily: FONT_FAMILY, fontSize: 11, color: SIDEBAR.textMuted, marginTop: 4, lineHeight: 15 },
//   sidebarToggleBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 10, borderWidth: 1, borderColor: SIDEBAR.border, borderRadius: 10, paddingVertical: 8, justifyContent: 'center' },
//   sidebarToggleBtnText: { fontFamily: FONT_FAMILY, fontSize: 12, fontWeight: '700' },
//   sidebarHelp: { flexDirection: 'row', alignItems: 'center', gap: 10, borderTopWidth: 1, borderTopColor: SIDEBAR.border, paddingTop: 14, paddingHorizontal: 2 },
//   sidebarHelpTitle: { fontFamily: FONT_FAMILY, fontSize: 12, fontWeight: '700', color: '#FFFFFF' },
//   sidebarHelpSub: { fontFamily: FONT_FAMILY, fontSize: 11, color: SIDEBAR.textMuted, marginTop: 1 },

//   webMain: { flex: 1, backgroundColor: COLORS.bg, ...(Platform.OS === 'web' ? ({ height: '100%', overflow: 'hidden' } as any) : null) },
//   contentInner: { width: '100%', paddingHorizontal: 20, paddingTop: 18 },
//   contentInnerWide: { paddingHorizontal: 32, paddingTop: 26 },

//   headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 },
//   headerRight: { flexDirection: 'row', alignItems: 'center', gap: 12 },
//   iconBtn: { width: 38, height: 38, borderRadius: 12, backgroundColor: COLORS.card, borderWidth: 1, borderColor: COLORS.border, alignItems: 'center', justifyContent: 'center', marginRight: 4 },
//   notifBadge: { position: 'absolute', top: -4, right: -4, minWidth: 16, height: 16, borderRadius: 8, backgroundColor: COLORS.danger, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 3 },
//   notifBadgeText: { fontFamily: FONT_FAMILY, fontSize: 9, fontWeight: '700', color: '#FFFFFF' },
//   greetingText: { fontFamily: FONT_FAMILY, fontSize: 19, fontWeight: '700', color: COLORS.ink },
//   greetingSub: { fontFamily: FONT_FAMILY, fontSize: 12.5, color: COLORS.slate, marginTop: 2 },

//   onlinePill: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: COLORS.secondaryLight, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6 },
//   onlineDot: { width: 8, height: 8, borderRadius: 4 },
//   onlinePillText: { fontFamily: FONT_FAMILY, fontSize: 12.5, fontWeight: '700', color: COLORS.secondary },

//   profileChip: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: COLORS.card, borderWidth: 1, borderColor: COLORS.border, borderRadius: 14, paddingHorizontal: 10, paddingVertical: 6 },
//   avatar: { width: 34, height: 34, borderRadius: 17, backgroundColor: COLORS.primaryLight, alignItems: 'center', justifyContent: 'center' },
//   avatarText: { fontFamily: FONT_FAMILY, fontSize: 13, fontWeight: '700', color: COLORS.primaryDark },
//   profileName: { fontFamily: FONT_FAMILY, fontSize: 12.5, fontWeight: '700', color: COLORS.ink },
//   profileRole: { fontFamily: FONT_FAMILY, fontSize: 10.5, color: COLORS.slate },

//   statRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 14, marginTop: 22 },
//   statCol: { flexGrow: 1, flexBasis: 160, maxWidth: 260 },
//   statCard: { backgroundColor: COLORS.card, borderRadius: 16, borderWidth: 1, borderColor: COLORS.border, padding: 14 },
//   statIconWrap: { width: 34, height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
//   statValue: { fontFamily: FONT_FAMILY, fontSize: 24, fontWeight: '700', color: COLORS.ink },
//   statLabel: { fontFamily: FONT_FAMILY, fontSize: 12.5, fontWeight: '700', color: COLORS.ink, marginTop: 2 },
//   statSublabel: { fontFamily: FONT_FAMILY, fontSize: 10.5, color: COLORS.slate, marginTop: 1, marginBottom: 8 },
//   sparkline: { position: 'relative' },
//   sparklineSegment: { position: 'absolute', height: 2, borderRadius: 1 },
//   sparklineDot: { position: 'absolute', width: 6, height: 6, borderRadius: 3 },

//   miniInfoCol: { gap: 12, flexGrow: 1, flexBasis: 150, maxWidth: 200 },
//   miniInfoCard: { backgroundColor: COLORS.card, borderRadius: 14, borderWidth: 1, borderColor: COLORS.border, padding: 12 },
//   miniInfoOnlineDot: { position: 'absolute', top: 10, right: 10, width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.secondary },
//   miniInfoLabel: { fontFamily: FONT_FAMILY, fontSize: 11, color: COLORS.slate },
//   miniInfoValue: { fontFamily: FONT_FAMILY, fontSize: 13.5, fontWeight: '700', color: COLORS.ink, marginTop: 6 },
//   miniInfoSub: { fontFamily: FONT_FAMILY, fontSize: 10, color: COLORS.slateLight, marginTop: 2 },

//   twoColRow: { flexDirection: 'row', gap: 20, alignItems: 'flex-start', marginTop: 24 },
//   stackedCol: { flexDirection: 'column' },
//   twoColLeft: { flex: 1.4 },
//   twoColRight: { flex: 1 },

//   sectionTitleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
//   sectionTitle: { fontFamily: FONT_FAMILY, fontSize: 15, fontWeight: '700', color: COLORS.ink },
//   viewAllLink: { fontFamily: FONT_FAMILY, fontSize: 12, fontWeight: '700', color: COLORS.primary },

//   activeCard: { backgroundColor: COLORS.secondaryLight, borderRadius: 18, padding: 16, borderWidth: 1, borderColor: COLORS.secondary + '33' },
//   statusBadge: { alignSelf: 'flex-start', backgroundColor: COLORS.secondary, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4, marginBottom: 10 },
//   statusBadgeText: { fontFamily: FONT_FAMILY, fontSize: 10.5, fontWeight: '700', color: '#FFFFFF', letterSpacing: 0.3 },
//   activeMainRow: { flexDirection: 'row', gap: 16, alignItems: 'flex-start' },
//   customerAvatar: { width: 42, height: 42, borderRadius: 21, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' },
//   customerAvatarText: { fontFamily: FONT_FAMILY, fontSize: 14, fontWeight: '700', color: COLORS.secondary },
//   orderIdText: { fontFamily: FONT_FAMILY, fontSize: 15, fontWeight: '700', color: COLORS.ink },
//   customerNameText: { fontFamily: FONT_FAMILY, fontSize: 13, color: COLORS.slate, marginTop: 1 },
//   addressRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8 },
//   addressText: { fontFamily: FONT_FAMILY, fontSize: 12.5, color: COLORS.slate, flexShrink: 1 },
//   mapWrap: { width: 160, gap: 6 },
//   routePreview: { height: 90, borderRadius: 12, backgroundColor: '#FFFFFF', justifyContent: 'center', paddingHorizontal: 12, overflow: 'hidden' },
//   routeDotStart: { width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.secondary },
//   routeLine: { position: 'absolute', left: 16, right: 24, height: 2, backgroundColor: COLORS.border, top: '50%' },
//   routePin: { position: 'absolute', right: 12, top: '35%' },
//   distancePill: { flexDirection: 'row', alignItems: 'center', gap: 4, alignSelf: 'flex-end', backgroundColor: '#FFFFFF', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 },
//   distancePillText: { fontFamily: FONT_FAMILY, fontSize: 11, fontWeight: '700', color: COLORS.primary },

//   activeFooterRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 16, paddingTop: 14, borderTopWidth: 1, borderTopColor: '#FFFFFF', gap: 10, flexWrap: 'wrap' },
//   footerAmount: { fontFamily: FONT_FAMILY, fontSize: 16, fontWeight: '700', color: COLORS.ink },
//   footerAmountLabel: { fontFamily: FONT_FAMILY, fontSize: 10.5, color: COLORS.slate, marginTop: 1 },
//   footerTime: { fontFamily: FONT_FAMILY, fontSize: 14, fontWeight: '700', color: COLORS.ink },
//   primaryBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: COLORS.secondary, paddingHorizontal: 14, paddingVertical: 11, borderRadius: 12 },
//   primaryBtnText: { fontFamily: FONT_FAMILY, color: '#FFFFFF', fontSize: 12.5, fontWeight: '700' },

//   assignCard: { backgroundColor: COLORS.amberLight, borderRadius: 18, padding: 16, borderWidth: 1, borderColor: COLORS.amber + '33' },
//   assignHeaderRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
//   assignBadge: { backgroundColor: COLORS.amber, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
//   assignBadgeText: { fontFamily: FONT_FAMILY, fontSize: 10.5, fontWeight: '700', color: '#FFFFFF', letterSpacing: 0.3 },
//   assignTimeAgo: { fontFamily: FONT_FAMILY, fontSize: 11, color: COLORS.slate },
//   assignStatsRow: { flexDirection: 'row', gap: 24, marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#FFFFFF' },
//   assignBtnRow: { flexDirection: 'row', gap: 10, marginTop: 14 },
//   rejectBtn: { borderWidth: 1, borderColor: COLORS.danger, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 11 },
//   rejectBtnText: { fontFamily: FONT_FAMILY, fontSize: 12.5, fontWeight: '700', color: COLORS.danger },

//   emptyCard: { backgroundColor: COLORS.card, borderRadius: 18, borderWidth: 1, borderColor: COLORS.border, padding: 26, alignItems: 'center' },
//   emptyTitle: { fontFamily: FONT_FAMILY, fontSize: 14, fontWeight: '700', color: COLORS.ink, marginTop: 8 },
//   emptyText: { fontFamily: FONT_FAMILY, fontSize: 12, color: COLORS.slate, textAlign: 'center', marginTop: 4, lineHeight: 17 },

//   summaryStrip: { flexDirection: 'row', flexWrap: 'nowrap', gap: 12 },
//   summaryGridItem: { flex: 1, minWidth: 0 },
//   summaryStatCard: { backgroundColor: COLORS.card, borderRadius: 16, borderWidth: 1, borderColor: COLORS.border, padding: 16, height: 128, justifyContent: 'flex-start' },
//   summaryStatIconWrap: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
//   summaryStatValue: { fontFamily: FONT_FAMILY, fontSize: 22, fontWeight: '700', color: COLORS.ink },
//   summaryStatLabel: { fontFamily: FONT_FAMILY, fontSize: 11.5, color: COLORS.slate, marginTop: 3 },
//   summaryStatSublabel: { fontFamily: FONT_FAMILY, fontSize: 10.5, color: COLORS.slateLight, marginTop: 2 },
//   activityCard: { backgroundColor: COLORS.card, borderRadius: 16, borderWidth: 1, borderColor: COLORS.border, padding: 14 },
//   footerRow: { alignItems: 'center', paddingVertical: 24 },
//   footerText: { fontFamily: FONT_FAMILY, fontSize: 11.5, color: COLORS.slateLight },

//   bottomNav: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', backgroundColor: COLORS.card, borderTopWidth: 1, borderTopColor: COLORS.border, paddingTop: 8, paddingBottom: 20 },
//   bottomNavItem: { flex: 1, alignItems: 'center', gap: 3 },
//   bottomNavLabel: { fontFamily: FONT_FAMILY, fontSize: 10.5, fontWeight: '600' },
// });

// export default DriverHomeScreen;

import React, { useContext, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  ScrollView,
  Switch,
  Alert,
  ActivityIndicator,
  Platform,
  useWindowDimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { DriverAuthContext } from '../../context/DriverAuthContext';
import { COLORS, NotificationRow } from '../../components/driver/DriverHomeComponents';
import { DriverWebShell, DriverShellTab } from '../../components/driver/DriverWebShell';
import { NotificationEntry, NotificationType } from '../../types/driverHome.types';

// ── Orval-generated hooks (run codegen after updating openapi.yaml) ────────
import {
  useGetDriver,
  useGetDriverStats,
  useGetDriverEarnings,
  useListDeliveries,
  useListNotifications,
  useUpdateDriver,
  useUpdateDeliveryStatus,
} from '@workspace/api-client-react';

const FONT_FAMILY = Platform.select({
  web: '"Times New Roman", Times, serif',
  default: 'Times New Roman', // register via expo-font / app.json for native
});

// Suppresses the browser's default focus ring on RN Web TouchableOpacity
const webNoOutlineStyle = (Platform.OS === 'web' ? { outlineStyle: 'none' } : {}) as any;

function showAlert(title: string, message?: string) {
  if (Platform.OS === 'web') {
    // eslint-disable-next-line no-alert
    window.alert(message ? `${title}\n\n${message}` : title);
  } else {
    Alert.alert(title, message);
  }
}

// ── Local shape of the API's Delivery object ────────────────────────────────
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
  picked_up_at?: string | null;
  delivered_at?: string | null;
  cancelled_at?: string | null;
  created_at: string;
  customer_name?: string;
  customer_phone?: string;
}

interface ApiNotification {
  id: number;
  type: NotificationType;
  message: string;
  created_at: string;
}

function initials(name?: string) {
  if (!name) return '?';
  return name.trim().split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase();
}

function timeAgo(iso?: string | null) {
  if (!iso) return '';
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.max(0, Math.round(diffMs / 60000));
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.round(mins / 60);
  return `${hrs} hr${hrs > 1 ? 's' : ''} ago`;
}

const bottomTabs: DriverShellTab[] = [
  { key: 'home', label: 'Home', icon: 'home', screen: 'DriverHome' },
  { key: 'orders', label: 'Orders', icon: 'cube-outline', screen: 'DriverOrders' },
  { key: 'earnings', label: 'Earnings', icon: 'wallet-outline', screen: 'DriverEarnings' },
  { key: 'notifications', label: 'Notifications', icon: 'notifications-outline', screen: 'DriverAlerts' },
  { key: 'profile', label: 'Profile', icon: 'person-outline', screen: 'DriverProfile' },
];
const ACTIVE_TAB = 'home';

// ── Tiny line-sparkline (no chart lib / no new dependency) ─────────────────
const SPARK_W = 130;
const SPARK_H = 32;
const Sparkline: React.FC<{ values: number[]; color: string }> = ({ values, color }) => {
  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const range = Math.max(max - min, 1);
  const points = values.map((v, i) => ({
    x: (i / Math.max(values.length - 1, 1)) * SPARK_W,
    y: 4 + (1 - (v - min) / range) * (SPARK_H - 8),
  }));

  return (
    <View style={[styles.sparkline, { width: SPARK_W, height: SPARK_H }]}>
      {points.slice(0, -1).map((p, i) => {
        const next = points[i + 1];
        const dx = next.x - p.x;
        const dy = next.y - p.y;
        const length = Math.sqrt(dx * dx + dy * dy);
        const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
        return (
          <View
            key={i}
            style={[
              styles.sparklineSegment,
              {
                left: p.x,
                top: p.y - 1,
                width: length,
                backgroundColor: color,
                opacity: 0.5 + (i / points.length) * 0.5,
                transform: [{ rotate: `${angle}deg` }],
                ...(Platform.OS === 'web' ? ({ transformOrigin: 'left center' } as any) : null),
              },
            ]}
          />
        );
      })}
      {points.length > 0 && (
        <View style={[styles.sparklineDot, { left: points[points.length - 1].x - 3, top: points[points.length - 1].y - 3, backgroundColor: color }]} />
      )}
    </View>
  );
};

// Static placeholder trend shapes until the stats API returns a time series.
// TODO: replace with real hourly/daily series once /api/driver/dashboard exposes it.
const MOCK_TRENDS = {
  total: [2, 3, 2, 4, 3, 5, 4, 5],
  newAssign: [1, 0, 1, 2, 1, 2, 1, 2],
  active: [0, 1, 0, 1, 1, 0, 1, 1],
  completed: [0, 1, 1, 1, 2, 2, 3, 3],
};

const StatCard: React.FC<{
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  iconBg: string;
  value: string | number;
  label: string;
  sublabel: string;
  trend: number[];
}> = ({ icon, iconColor, iconBg, value, label, sublabel, trend }) => (
  <View style={styles.statCard}>
    <View style={[styles.statIconWrap, { backgroundColor: iconBg }]}>
      <Ionicons name={icon} size={18} color={iconColor} />
    </View>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
    <Text style={styles.statSublabel}>{sublabel}</Text>
    <Sparkline values={trend} color={iconColor} />
  </View>
);

const SummaryStatCard: React.FC<{
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  iconBg: string;
  value: string;
  label: string;
  sublabel?: string;
}> = ({ icon, iconColor, iconBg, value, label, sublabel }) => (
  <View style={styles.summaryStatCard}>
    <View style={[styles.summaryStatIconWrap, { backgroundColor: iconBg }]}>
      <Ionicons name={icon} size={20} color={iconColor} />
    </View>
    <Text style={styles.summaryStatValue}>{value}</Text>
    <Text numberOfLines={1} style={styles.summaryStatLabel}>{label}</Text>
    {sublabel ? <Text style={styles.summaryStatSublabel}>{sublabel}</Text> : null}
  </View>
);

const SectionTitleRow: React.FC<{ title: string; onViewAll?: () => void }> = ({ title, onViewAll }) => (
  <View style={styles.sectionTitleRow}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {onViewAll && (
      <TouchableOpacity onPress={onViewAll} hitSlop={6} style={webNoOutlineStyle}>
        <Text style={styles.viewAllLink}>View All ›</Text>
      </TouchableOpacity>
    )}
  </View>
);

// Simple static route-preview graphic — not a real map, just a visual echo
// of the mockup until a maps SDK is wired in.
// TODO: replace with react-native-maps / a static maps image once available.
const RoutePreview: React.FC = () => (
  <View style={styles.routePreview}>
    <View style={styles.routeDotStart} />
    <View style={styles.routeLine} />
    <Ionicons name="location" size={18} color={COLORS.danger} style={styles.routePin} />
  </View>
);

const DriverHomeScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { driver: authDriver, driverLogout } = useContext(DriverAuthContext) as any;
  const driverId = authDriver?.id;
  const businessId = authDriver?.business_id;

  const { width } = useWindowDimensions();
  const isWideWeb = Platform.OS === 'web' && width >= 1000;

  const [isOnline, setIsOnline] = useState<boolean>(authDriver?.status === 'available');

  // ── Data fetching (unchanged from existing wiring) ─────────────────────
  const { data: driver, isLoading: driverLoading } = useGetDriver(driverId, { query: { enabled: !!driverId } });
  const { data: stats, isLoading: statsLoading } = useGetDriverStats(driverId, { query: { enabled: !!driverId } });
  const { data: earnings } = useGetDriverEarnings(driverId, { query: { enabled: !!driverId } });
  const { data: deliveriesResponse, isLoading: deliveriesLoading, refetch: refetchDeliveries } = useListDeliveries(
    { driver_id: driverId, business_id: businessId },
    { query: { enabled: !!driverId && !!businessId } }
  );
  const { data: notificationsData } = useListNotifications(
    { driver_id: driverId, limit: 8 },
    { query: { enabled: !!driverId } }
  );

  const updateDriver = useUpdateDriver();
  const updateDeliveryStatus = useUpdateDeliveryStatus();

  const isLoading = driverLoading || statsLoading || deliveriesLoading;

  // ── Derived view data ───────────────────────────────────────────────────
  const deliveriesPayload: any = deliveriesResponse;
  const allDeliveries: ApiDelivery[] = Array.isArray(deliveriesPayload)
    ? deliveriesPayload
    : Array.isArray(deliveriesPayload?.data)
    ? deliveriesPayload.data
    : Array.isArray(deliveriesPayload?.data?.data)
    ? deliveriesPayload.data.data
    : [];

  const activeDelivery: ApiDelivery | undefined = allDeliveries.find((d) =>
    ['accepted', 'picked_up', 'in_transit', 'out_for_delivery', 'arrived'].includes(d.status)
  );

  const newAssignment: ApiDelivery | undefined = allDeliveries
    .filter((d) => d.status === 'assigned')
    .sort((a, b) => new Date(b.assigned_at ?? b.created_at).getTime() - new Date(a.assigned_at ?? a.created_at).getTime())[0];

  const rawNotifications: ApiNotification[] = Array.isArray(notificationsData)
    ? (notificationsData as unknown as ApiNotification[])
    : (((notificationsData as any)?.data as ApiNotification[]) ?? []);

  const notifications: NotificationEntry[] = rawNotifications.map((n) => ({
    id: String(n.id),
    type: n.type,
    message: n.message,
    time: new Date(n.created_at).toLocaleString(),
  }));

  const today = useMemo(
    () => new Date().toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric', weekday: 'long' }),
    []
  );

  const handleToggleOnline = (value: boolean) => {
    setIsOnline(value);
    if (!driverId) return;
    updateDriver.mutate({ id: driverId, data: { status: value ? 'available' : 'offline' } });
  };

  const handleAcceptNav = () => {
    if (!activeDelivery) return;
    navigation.navigate('DriverOrderDetails', { deliveryId: activeDelivery.id });
  };

  const handleRejectAssignment = () => {
    if (!newAssignment) return;
    updateDeliveryStatus.mutate(
      { id: newAssignment.id, data: { status: 'cancelled' } },
      { onSuccess: () => refetchDeliveries(), onError: () => showAlert('Error', 'Could not reject the assignment') }
    );
  };

  const handleViewAssignment = () => {
    if (!newAssignment) return;
    navigation.navigate('DriverOrderDetails', { deliveryId: newAssignment.id });
  };

  const handleTabPress = (tab: DriverShellTab) => {
    if (tab.key === ACTIVE_TAB) return;
    if (tab.screen) {
      navigation.navigate(tab.screen);
    } else {
      showAlert(tab.label, 'Coming soon');
    }
  };

  // Placeholder — TODO: expose real online-duration from the backend
  const workingHours = (earnings as any)?.online_duration_hours ?? '—';
  // Placeholder — TODO: expose real online-payments total from the backend
  const onlinePaymentsToday = (earnings as any)?.online_payments_today ?? 0;

  if (isLoading && !driver) {
    return (
      <SafeAreaView style={[styles.safe, { alignItems: 'center', justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </SafeAreaView>
    );
  }

  // ── Page content shared by both layouts. On wide web the greeting/
  // online-toggle/notifications/profile chip live in DriverWebShell's top
  // bar instead of being repeated here. ─────────────────────────────────
  const pageBody = (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[styles.scrollContent, !isWideWeb && { paddingBottom: 90 }]}
    >
      <View style={[styles.contentInner, isWideWeb && styles.contentInnerWide]}>
        {/* ── Mobile-only header (wide web gets this from DriverWebShell) ── */}
        {!isWideWeb && (
          <View style={styles.headerRow}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TouchableOpacity style={[styles.iconBtn, webNoOutlineStyle]} hitSlop={8} onPress={() => showAlert('Menu', 'Open menu')}>
                <Ionicons name="menu" size={22} color={COLORS.ink} />
              </TouchableOpacity>
              <View>
                <Text style={styles.greetingText}>Good Morning, {driver?.name?.split(' ')[0] ?? 'Driver'}! 👋</Text>
                <Text style={styles.greetingSub}>Stay safe and deliver happiness.</Text>
              </View>
            </View>

            <View style={styles.headerRight}>
              <View style={styles.onlinePill}>
                <View style={[styles.onlineDot, { backgroundColor: isOnline ? COLORS.secondary : COLORS.slateLight }]} />
                <Text style={styles.onlinePillText}>{isOnline ? 'Online' : 'Offline'}</Text>
                <Switch
                  value={isOnline}
                  onValueChange={handleToggleOnline}
                  trackColor={{ false: '#D1D5DB', true: COLORS.secondary }}
                  thumbColor="#FFFFFF"
                  style={{ transform: [{ scaleX: 0.75 }, { scaleY: 0.75 }], marginLeft: 4 }}
                />
              </View>

              <TouchableOpacity
                style={[styles.iconBtn, webNoOutlineStyle]}
                hitSlop={8}
                onPress={() => handleTabPress(bottomTabs.find((t) => t.key === 'notifications')!)}
              >
                <Ionicons name="notifications-outline" size={20} color={COLORS.ink} />
                {notifications.length > 0 && (
                  <View style={styles.notifBadge}>
                    <Text style={styles.notifBadgeText}>{Math.min(notifications.length, 9)}</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* ── Stat cards ─────────────────────────────────────────────── */}
        <View style={[styles.statRow, !isWideWeb && { marginTop: 22 }]}>
          <View style={styles.statCol}>
            <StatCard
              icon="bicycle-outline"
              iconColor={COLORS.secondary}
              iconBg={COLORS.secondaryLight}
              value={stats?.total_deliveries ?? 0}
              label="Today's Deliveries"
              sublabel="Total assigned"
              trend={MOCK_TRENDS.total}
            />
          </View>
          <View style={styles.statCol}>
            <StatCard
              icon="bag-handle-outline"
              iconColor={COLORS.amber}
              iconBg={COLORS.amberLight}
              value={stats?.pending_deliveries ?? (newAssignment ? 1 : 0)}
              label="New Assignments"
              sublabel="Waiting for action"
              trend={MOCK_TRENDS.newAssign}
            />
          </View>
          <View style={styles.statCol}>
            <StatCard
              icon="bus-outline"
              iconColor={COLORS.primary}
              iconBg={COLORS.primaryLight}
              value={activeDelivery ? 1 : 0}
              label="Active Delivery"
              sublabel="In progress"
              trend={MOCK_TRENDS.active}
            />
          </View>
          <View style={styles.statCol}>
            <StatCard
              icon="checkmark-circle-outline"
              iconColor="#7C3AED"
              iconBg="#EDE9FE"
              value={stats?.completed_deliveries ?? 0}
              label="Completed Today"
              sublabel="Successfully delivered"
              trend={MOCK_TRENDS.completed}
            />
          </View>
          {isWideWeb && (
            <View style={styles.miniInfoCol}>
              <View style={styles.miniInfoCard}>
                <Ionicons name="calendar-outline" size={16} color={COLORS.slate} />
                <Text style={styles.miniInfoValue}>{today}</Text>
              </View>
              <View style={[styles.miniInfoCard, { position: 'relative' }]}>
                {isOnline && <View style={styles.miniInfoOnlineDot} />}
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Ionicons name="time-outline" size={16} color={COLORS.slate} />
                  <Text style={styles.miniInfoLabel}>Working Hours</Text>
                </View>
                <Text style={styles.miniInfoValue}>{workingHours} hrs</Text>
                <Text style={styles.miniInfoSub}>Online today</Text>
              </View>
            </View>
          )}
        </View>

        {/* ── Active Delivery + New Assignment ──────────────────────────── */}
        <View style={[styles.twoColRow, !isWideWeb && styles.stackedCol]}>
          <View style={isWideWeb ? styles.twoColLeft : undefined}>
            <SectionTitleRow title="Active Delivery" onViewAll={() => navigation.navigate('DriverOrders')} />
            {activeDelivery ? (
              <View style={styles.activeCard}>
                <View style={styles.statusBadge}>
                  <Text style={styles.statusBadgeText}>{activeDelivery.status.replace(/_/g, ' ').toUpperCase()}</Text>
                </View>

                <View style={styles.activeMainRow}>
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                      <View style={styles.customerAvatar}>
                        <Text style={styles.customerAvatarText}>{initials(activeDelivery.customer_name)}</Text>
                      </View>
                      <View>
                        <Text style={styles.orderIdText}>Order #{activeDelivery.id}</Text>
                        <Text style={styles.customerNameText}>{activeDelivery.customer_name ?? 'Customer'}</Text>
                      </View>
                    </View>
                    <View style={styles.addressRow}>
                      <Ionicons name="call-outline" size={13} color={COLORS.slate} />
                      <Text style={styles.addressText}>{activeDelivery.customer_phone ?? '—'}</Text>
                    </View>
                    <View style={styles.addressRow}>
                      <Ionicons name="location-outline" size={13} color={COLORS.slate} />
                      <Text style={styles.addressText}>{activeDelivery.drop_address}</Text>
                    </View>
                  </View>

                  {isWideWeb && (
                    <View style={styles.mapWrap}>
                      <RoutePreview />
                      <View style={styles.distancePill}>
                        <Ionicons name="navigate-outline" size={12} color={COLORS.primary} />
                        <Text style={styles.distancePillText}>{activeDelivery.distance_km ?? '—'} km</Text>
                      </View>
                    </View>
                  )}
                </View>

                <View style={styles.activeFooterRow}>
                  <View>
                    <Text style={styles.footerAmount}>₹{Number(activeDelivery.amount ?? 0).toFixed(2)}</Text>
                    <Text style={styles.footerAmountLabel}>Order Amount</Text>
                  </View>
                  <View>
                    <Text style={styles.footerTime}>
                      {activeDelivery.assigned_at
                        ? new Date(activeDelivery.assigned_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                        : '—'}
                    </Text>
                    <Text style={styles.footerAmountLabel}>Assigned Time</Text>
                  </View>
                  <TouchableOpacity style={[styles.primaryBtn, webNoOutlineStyle]} onPress={handleAcceptNav}>
                    <Text style={styles.primaryBtnText}>View Delivery Details</Text>
                    <Ionicons name="chevron-forward" size={14} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <View style={styles.emptyCard}>
                <Ionicons name="cube-outline" size={26} color={COLORS.slateLight} />
                <Text style={styles.emptyTitle}>No Active Delivery</Text>
                <Text style={styles.emptyText}>You don't have an active delivery right now. We'll notify you when a new delivery is assigned.</Text>
              </View>
            )}
          </View>

          <View style={isWideWeb ? styles.twoColRight : { marginTop: 22 }}>
            <SectionTitleRow title="New Assignment" onViewAll={() => navigation.navigate('DriverOrders')} />
            {newAssignment ? (
              <View style={styles.assignCard}>
                <View style={styles.assignHeaderRow}>
                  <View style={styles.assignBadge}>
                    <Text style={styles.assignBadgeText}>NEW ASSIGNMENT</Text>
                  </View>
                  <Text style={styles.assignTimeAgo}>{timeAgo(newAssignment.assigned_at ?? newAssignment.created_at)}</Text>
                </View>

                <Text style={styles.orderIdText}>Order #{newAssignment.id}</Text>
                <Text style={styles.customerNameText}>{newAssignment.customer_name ?? 'Customer'}</Text>
                <View style={styles.addressRow}>
                  <Ionicons name="call-outline" size={13} color={COLORS.slate} />
                  <Text style={styles.addressText}>{newAssignment.customer_phone ?? '—'}</Text>
                </View>
                <View style={styles.addressRow}>
                  <Ionicons name="location-outline" size={13} color={COLORS.slate} />
                  <Text style={styles.addressText}>{newAssignment.drop_address}</Text>
                </View>

                <View style={styles.assignStatsRow}>
                  <View>
                    <Text style={styles.footerAmount}>{newAssignment.distance_km ?? '—'} km</Text>
                    <Text style={styles.footerAmountLabel}>Distance</Text>
                  </View>
                  <View>
                    <Text style={styles.footerAmount}>₹{Number(newAssignment.amount ?? 0).toFixed(2)}</Text>
                    <Text style={styles.footerAmountLabel}>Order Amount</Text>
                  </View>
                </View>

                <View style={styles.assignBtnRow}>
                  <TouchableOpacity style={[styles.rejectBtn, webNoOutlineStyle]} onPress={handleRejectAssignment}>
                    <Text style={styles.rejectBtnText}>Reject</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.primaryBtn, { flex: 1, justifyContent: 'center' }, webNoOutlineStyle]} onPress={handleViewAssignment}>
                    <Text style={styles.primaryBtnText}>View Order</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <View style={styles.emptyCard}>
                <Ionicons name="checkmark-circle-outline" size={26} color={COLORS.slateLight} />
                <Text style={styles.emptyTitle}>No New Deliveries</Text>
                <Text style={styles.emptyText}>You're all caught up! 🎉</Text>
              </View>
            )}
          </View>
        </View>

        {/* ── Today's Summary + Recent Activity ─────────────────────────── */}
        <View style={[styles.twoColRow, !isWideWeb && styles.stackedCol]}>
          <View style={isWideWeb ? styles.twoColLeft : undefined}>
            <SectionTitleRow title="Today's Summary" />
            <View style={[styles.summaryStrip, !isWideWeb && { flexWrap: 'wrap' }]}>
              <View style={styles.summaryGridItem}>
                <SummaryStatCard
                  label="Completed Deliveries"
                  sublabel={(stats?.completed_deliveries ?? 0) > 0 ? 'Good job! 🎉' : undefined}
                  value={`${stats?.completed_deliveries ?? 0}`}
                  icon="checkmark-done-outline"
                  iconColor={COLORS.secondary}
                  iconBg={COLORS.secondaryLight}
                />
              </View>
              <View style={styles.summaryGridItem}>
                <SummaryStatCard
                  label="COD Collected"
                  sublabel="Today"
                  value={`₹${earnings?.cod_collected ?? 0}`}
                  icon="cash-outline"
                  iconColor={COLORS.amber}
                  iconBg={COLORS.amberLight}
                />
              </View>
              <View style={styles.summaryGridItem}>
                <SummaryStatCard
                  label="Online Payments"
                  sublabel="Today"
                  value={`₹${onlinePaymentsToday}`}
                  icon="card-outline"
                  iconColor={COLORS.primary}
                  iconBg={COLORS.primaryLight}
                />
              </View>
              <View style={styles.summaryGridItem}>
                <SummaryStatCard
                  label="Online Duration"
                  sublabel="Today"
                  value={`${workingHours} hrs`}
                  icon="time-outline"
                  iconColor="#7C3AED"
                  iconBg="#EDE9FE"
                />
              </View>
            </View>
          </View>

          <View style={isWideWeb ? styles.twoColRight : { marginTop: 22 }}>
            <SectionTitleRow title="Recent Activity" onViewAll={() => handleTabPress(bottomTabs.find((t) => t.key === 'notifications')!)} />
            <View style={styles.activityCard}>
              {notifications.length === 0 ? (
                <Text style={styles.emptyText}>No recent activity.</Text>
              ) : (
                notifications.slice(0, 5).map((item) => <NotificationRow key={item.id} item={item} />)
              )}
            </View>
          </View>
        </View>

        {isWideWeb && (
          <View style={styles.footerRow}>
            <Text style={styles.footerText}>© {new Date().getFullYear()} Khata-Pro Drivers. All rights reserved.</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );

  // ── Wide web: shared sidebar + top bar shell ──────────────────────────
  if (isWideWeb) {
    return (
      <SafeAreaView style={styles.safe}>
        <StatusBar barStyle="dark-content" backgroundColor={COLORS.bg} />
        <DriverWebShell
          activeTabKey={ACTIVE_TAB}
          driverName={driver?.name}
          driverPhone={driver?.phone}
          isOnline={isOnline}
          onToggleOnline={handleToggleOnline}
          notificationsCount={notifications.length}
          greetingSubtitle="Stay safe and deliver happiness."
          onTabPress={handleTabPress}
          onNotificationsPress={() => handleTabPress(bottomTabs.find((t) => t.key === 'notifications')!)}
          onProfilePress={driverLogout}
          onHelpPress={() => showAlert('Need Help?', 'Contact support')}
        >
          {pageBody}
        </DriverWebShell>
      </SafeAreaView>
    );
  }

  // ── Mobile / narrow web ─────────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.bg} />
      {pageBody}

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
              <Ionicons name={tab.icon} size={22} color={active ? COLORS.primary : COLORS.slateLight} />
              <Text numberOfLines={1} style={[styles.bottomNavLabel, { color: active ? COLORS.primary : COLORS.slateLight }]}>{tab.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg, ...(Platform.OS === 'web' ? ({ height: '100vh' } as any) : null) },
  scrollContent: { flexGrow: 1 },

  contentInner: { width: '100%', paddingHorizontal: 20, paddingTop: 18 },
  contentInnerWide: { paddingHorizontal: 32, paddingTop: 26 },

  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconBtn: { width: 38, height: 38, borderRadius: 12, backgroundColor: COLORS.card, borderWidth: 1, borderColor: COLORS.border, alignItems: 'center', justifyContent: 'center', marginRight: 4 },
  notifBadge: { position: 'absolute', top: -4, right: -4, minWidth: 16, height: 16, borderRadius: 8, backgroundColor: COLORS.danger, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 3 },
  notifBadgeText: { fontFamily: FONT_FAMILY, fontSize: 9, fontWeight: '700', color: '#FFFFFF' },
  greetingText: { fontFamily: FONT_FAMILY, fontSize: 19, fontWeight: '700', color: COLORS.ink },
  greetingSub: { fontFamily: FONT_FAMILY, fontSize: 12.5, color: COLORS.slate, marginTop: 2 },

  onlinePill: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: COLORS.secondaryLight, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6 },
  onlineDot: { width: 8, height: 8, borderRadius: 4 },
  onlinePillText: { fontFamily: FONT_FAMILY, fontSize: 12.5, fontWeight: '700', color: COLORS.secondary },

  statRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 14, marginTop: 22 },
  statCol: { flexGrow: 1, flexBasis: 160, maxWidth: 260 },
  statCard: { backgroundColor: COLORS.card, borderRadius: 16, borderWidth: 1, borderColor: COLORS.border, padding: 14 },
  statIconWrap: { width: 34, height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  statValue: { fontFamily: FONT_FAMILY, fontSize: 24, fontWeight: '700', color: COLORS.ink },
  statLabel: { fontFamily: FONT_FAMILY, fontSize: 12.5, fontWeight: '700', color: COLORS.ink, marginTop: 2 },
  statSublabel: { fontFamily: FONT_FAMILY, fontSize: 10.5, color: COLORS.slate, marginTop: 1, marginBottom: 8 },
  sparkline: { position: 'relative' },
  sparklineSegment: { position: 'absolute', height: 2, borderRadius: 1 },
  sparklineDot: { position: 'absolute', width: 6, height: 6, borderRadius: 3 },

  miniInfoCol: { gap: 12, flexGrow: 1, flexBasis: 150, maxWidth: 200 },
  miniInfoCard: { backgroundColor: COLORS.card, borderRadius: 14, borderWidth: 1, borderColor: COLORS.border, padding: 12 },
  miniInfoOnlineDot: { position: 'absolute', top: 10, right: 10, width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.secondary },
  miniInfoLabel: { fontFamily: FONT_FAMILY, fontSize: 11, color: COLORS.slate },
  miniInfoValue: { fontFamily: FONT_FAMILY, fontSize: 13.5, fontWeight: '700', color: COLORS.ink, marginTop: 6 },
  miniInfoSub: { fontFamily: FONT_FAMILY, fontSize: 10, color: COLORS.slateLight, marginTop: 2 },

  twoColRow: { flexDirection: 'row', gap: 20, alignItems: 'flex-start', marginTop: 24 },
  stackedCol: { flexDirection: 'column' },
  twoColLeft: { flex: 1.4 },
  twoColRight: { flex: 1 },

  sectionTitleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
  sectionTitle: { fontFamily: FONT_FAMILY, fontSize: 15, fontWeight: '700', color: COLORS.ink },
  viewAllLink: { fontFamily: FONT_FAMILY, fontSize: 12, fontWeight: '700', color: COLORS.primary },

  activeCard: { backgroundColor: COLORS.secondaryLight, borderRadius: 18, padding: 16, borderWidth: 1, borderColor: COLORS.secondary + '33' },
  statusBadge: { alignSelf: 'flex-start', backgroundColor: COLORS.secondary, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4, marginBottom: 10 },
  statusBadgeText: { fontFamily: FONT_FAMILY, fontSize: 10.5, fontWeight: '700', color: '#FFFFFF', letterSpacing: 0.3 },
  activeMainRow: { flexDirection: 'row', gap: 16, alignItems: 'flex-start' },
  customerAvatar: { width: 42, height: 42, borderRadius: 21, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' },
  customerAvatarText: { fontFamily: FONT_FAMILY, fontSize: 14, fontWeight: '700', color: COLORS.secondary },
  orderIdText: { fontFamily: FONT_FAMILY, fontSize: 15, fontWeight: '700', color: COLORS.ink },
  customerNameText: { fontFamily: FONT_FAMILY, fontSize: 13, color: COLORS.slate, marginTop: 1 },
  addressRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8 },
  addressText: { fontFamily: FONT_FAMILY, fontSize: 12.5, color: COLORS.slate, flexShrink: 1 },
  mapWrap: { width: 160, gap: 6 },
  routePreview: { height: 90, borderRadius: 12, backgroundColor: '#FFFFFF', justifyContent: 'center', paddingHorizontal: 12, overflow: 'hidden' },
  routeDotStart: { width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.secondary },
  routeLine: { position: 'absolute', left: 16, right: 24, height: 2, backgroundColor: COLORS.border, top: '50%' },
  routePin: { position: 'absolute', right: 12, top: '35%' },
  distancePill: { flexDirection: 'row', alignItems: 'center', gap: 4, alignSelf: 'flex-end', backgroundColor: '#FFFFFF', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 },
  distancePillText: { fontFamily: FONT_FAMILY, fontSize: 11, fontWeight: '700', color: COLORS.primary },

  activeFooterRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 16, paddingTop: 14, borderTopWidth: 1, borderTopColor: '#FFFFFF', gap: 10, flexWrap: 'wrap' },
  footerAmount: { fontFamily: FONT_FAMILY, fontSize: 16, fontWeight: '700', color: COLORS.ink },
  footerAmountLabel: { fontFamily: FONT_FAMILY, fontSize: 10.5, color: COLORS.slate, marginTop: 1 },
  footerTime: { fontFamily: FONT_FAMILY, fontSize: 14, fontWeight: '700', color: COLORS.ink },
  primaryBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: COLORS.secondary, paddingHorizontal: 14, paddingVertical: 11, borderRadius: 12 },
  primaryBtnText: { fontFamily: FONT_FAMILY, color: '#FFFFFF', fontSize: 12.5, fontWeight: '700' },

  assignCard: { backgroundColor: COLORS.amberLight, borderRadius: 18, padding: 16, borderWidth: 1, borderColor: COLORS.amber + '33' },
  assignHeaderRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
  assignBadge: { backgroundColor: COLORS.amber, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  assignBadgeText: { fontFamily: FONT_FAMILY, fontSize: 10.5, fontWeight: '700', color: '#FFFFFF', letterSpacing: 0.3 },
  assignTimeAgo: { fontFamily: FONT_FAMILY, fontSize: 11, color: COLORS.slate },
  assignStatsRow: { flexDirection: 'row', gap: 24, marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#FFFFFF' },
  assignBtnRow: { flexDirection: 'row', gap: 10, marginTop: 14 },
  rejectBtn: { borderWidth: 1, borderColor: COLORS.danger, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 11 },
  rejectBtnText: { fontFamily: FONT_FAMILY, fontSize: 12.5, fontWeight: '700', color: COLORS.danger },

  emptyCard: { backgroundColor: COLORS.card, borderRadius: 18, borderWidth: 1, borderColor: COLORS.border, padding: 26, alignItems: 'center' },
  emptyTitle: { fontFamily: FONT_FAMILY, fontSize: 14, fontWeight: '700', color: COLORS.ink, marginTop: 8 },
  emptyText: { fontFamily: FONT_FAMILY, fontSize: 12, color: COLORS.slate, textAlign: 'center', marginTop: 4, lineHeight: 17 },

  summaryStrip: { flexDirection: 'row', flexWrap: 'nowrap', gap: 12 },
  summaryGridItem: { flex: 1, minWidth: 0 },
  summaryStatCard: { backgroundColor: COLORS.card, borderRadius: 16, borderWidth: 1, borderColor: COLORS.border, padding: 16, height: 128, justifyContent: 'flex-start' },
  summaryStatIconWrap: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  summaryStatValue: { fontFamily: FONT_FAMILY, fontSize: 22, fontWeight: '700', color: COLORS.ink },
  summaryStatLabel: { fontFamily: FONT_FAMILY, fontSize: 11.5, color: COLORS.slate, marginTop: 3 },
  summaryStatSublabel: { fontFamily: FONT_FAMILY, fontSize: 10.5, color: COLORS.slateLight, marginTop: 2 },
  activityCard: { backgroundColor: COLORS.card, borderRadius: 16, borderWidth: 1, borderColor: COLORS.border, padding: 14 },
  footerRow: { alignItems: 'center', paddingVertical: 24 },
  footerText: { fontFamily: FONT_FAMILY, fontSize: 11.5, color: COLORS.slateLight },

  bottomNav: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', backgroundColor: COLORS.card, borderTopWidth: 1, borderTopColor: COLORS.border, paddingTop: 8, paddingBottom: 20 },
  bottomNavItem: { flex: 1, alignItems: 'center', gap: 3 },
  bottomNavLabel: { fontFamily: FONT_FAMILY, fontSize: 10.5, fontWeight: '600' },
});

export default DriverHomeScreen;