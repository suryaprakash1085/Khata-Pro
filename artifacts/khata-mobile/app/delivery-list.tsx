// Place this file at app/delivery-list.tsx
//
// Admin screen: shows all deliveries for the business, lets the admin
// filter by status and tap a delivery to assign an available driver.

import React, { useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Stack } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';
import { useBusiness } from '@/contexts/BusinessContext';
import { EmptyState } from '@/components/EmptyState';
import {
  useListDeliveries,
  useAssignDriver,
  getListDeliveriesQueryKey,
  useListDrivers,
  getListDriversQueryKey,
  type Delivery,
  type DeliveryStatus,
  type Driver,
} from '@workspace/api-client-react';

const FONT_FAMILY = Platform.OS === 'web' ? 'Times New Roman' : 'serif';
const LIMIT = 100;

const STATUS_META: Record<DeliveryStatus, { label: string; color: string; bg: string }> = {
  pending: { label: 'Pending', color: '#B91C1C', bg: '#FEE2E2' },
  assigned: { label: 'Assigned', color: '#B45309', bg: '#FEF3C7' },
  picked_up: { label: 'Picked Up', color: '#1D4ED8', bg: '#DBEAFE' },
  in_transit: { label: 'In Transit', color: '#1D4ED8', bg: '#DBEAFE' },
  delivered: { label: 'Delivered', color: '#15803D', bg: '#DCFCE7' },
  cancelled: { label: 'Cancelled', color: '#6B7280', bg: '#F3F4F6' },
};

const STATUS_FILTERS: { value: DeliveryStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'assigned', label: 'Assigned' },
  { value: 'in_transit', label: 'In Transit' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
];

export default function DeliveryListScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { business } = useBusiness();

  const [statusFilter, setStatusFilter] = useState<DeliveryStatus | 'all'>('all');
  const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(null);
  const [assignModalOpen, setAssignModalOpen] = useState(false);

  // ---- Deliveries list ----
  const deliveryParams = {
    business_id: business?.id as number,
    status: statusFilter === 'all' ? undefined : statusFilter,
    limit: LIMIT,
  };
  const {
    data: deliveryData,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useListDeliveries(deliveryParams, {
    query: { enabled: !!business?.id, queryKey: getListDeliveriesQueryKey(deliveryParams) },
  });

  const deliveries: Delivery[] = deliveryData?.data ?? [];
  const total = deliveryData?.total ?? 0;

  // ---- Available drivers (for the assign modal) ----
  const driverParams = { business_id: business?.id as number, status: 'available' as const, limit: 100 };
  const { data: driverData, isLoading: isLoadingDrivers } = useListDrivers(driverParams, {
    query: { enabled: !!business?.id && assignModalOpen, queryKey: getListDriversQueryKey(driverParams) },
  });
  const availableDrivers: Driver[] = driverData?.data ?? [];

  const assignDriver = useAssignDriver();

  const openAssignModal = (delivery: Delivery) => {
    setSelectedDelivery(delivery);
    setAssignModalOpen(true);
  };

  const handleAssign = (driverId: number) => {
    if (!selectedDelivery) return;
    assignDriver.mutate(
      { id: selectedDelivery.id, data: { driver_id: driverId } },
      {
        onSuccess: () => {
          setAssignModalOpen(false);
          setSelectedDelivery(null);
        },
      },
    );
  };

  const renderDeliveryCard = ({ item }: { item: Delivery }) => {
    const meta = STATUS_META[item.status];
    const canAssign = item.status === 'pending';

    return (
      <View
        style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius }]}
      >
        <View style={styles.cardTopRow}>
          <Text style={[styles.deliveryId, { color: colors.foreground }]}>Delivery #{item.id}</Text>
          <View style={[styles.statusPill, { backgroundColor: meta.bg }]}>
            <Text style={[styles.statusPillText, { color: meta.color }]}>{meta.label}</Text>
          </View>
        </View>

        <View style={styles.addressRow}>
          <Feather name="package" size={13} color={colors.mutedForeground} />
          <Text style={[styles.addressText, { color: colors.foreground }]} numberOfLines={1}>
            {item.pickup_address}
          </Text>
        </View>
        <View style={styles.addressRow}>
          <Feather name="map-pin" size={13} color={colors.mutedForeground} />
          <Text style={[styles.addressText, { color: colors.foreground }]} numberOfLines={1}>
            {item.drop_address}
          </Text>
        </View>

        <View style={styles.cardBottomRow}>
          <Text style={[styles.customerText, { color: colors.mutedForeground }]}>Customer #{item.customer_id}</Text>
          {item.driver_id ? (
            <Text style={[styles.driverText, { color: colors.mutedForeground }]}>Driver #{item.driver_id}</Text>
          ) : (
            <Text style={[styles.driverText, { color: colors.destructive }]}>No driver assigned</Text>
          )}
        </View>

        {canAssign && (
          <Pressable
            onPress={() => openAssignModal(item)}
            style={[styles.assignBtn, { backgroundColor: colors.primary, borderRadius: colors.radius }]}
          >
            <Feather name="user-plus" size={14} color={colors.primaryForeground} />
            <Text style={[styles.assignBtnText, { color: colors.primaryForeground }]}>Assign Driver</Text>
          </Pressable>
        )}
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 12, borderBottomColor: colors.border }]}>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>Deliveries</Text>
        <Text style={[styles.headerSubtitle, { color: colors.mutedForeground }]}>
          {total} delivery{total === 1 ? '' : 'ies'}
        </Text>
      </View>

      {/* Status filter chips */}
      <View style={styles.filterStripWrap}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterStrip}
          contentContainerStyle={styles.filterStripContent}
        >
          {STATUS_FILTERS.map((f) => {
            const active = f.value === statusFilter;
            return (
              <Pressable
                key={f.value}
                onPress={() => setStatusFilter(f.value)}
                style={[
                  styles.filterChip,
                  {
                    borderRadius: colors.radius,
                    backgroundColor: active ? colors.primary : colors.card,
                    borderColor: active ? colors.primary : colors.border,
                  },
                ]}
              >
                <Text style={{ color: active ? colors.primaryForeground : colors.foreground, fontSize: 12, fontFamily: FONT_FAMILY }}>
                  {f.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {/* List */}
      {isLoading ? (
        <ActivityIndicator style={{ marginTop: 40 }} color={colors.primary} />
      ) : isError ? (
        <View style={styles.errorBox}>
          <Feather name="alert-triangle" size={20} color={colors.destructive} />
          <Text style={[styles.errorText, { color: colors.destructive }]}>Could not load deliveries.</Text>
          <Pressable onPress={() => refetch()} style={[styles.retryBtn, { borderColor: colors.border, borderRadius: colors.radius }]}>
            <Text style={{ color: colors.primary, fontSize: 13, fontFamily: FONT_FAMILY }}>Retry</Text>
          </Pressable>
        </View>
      ) : deliveries.length === 0 ? (
        <EmptyState
          icon="truck"
          title="No deliveries yet"
          subtitle="Deliveries created for customer orders will show up here."
        />
      ) : (
        <FlatList
          data={deliveries}
          keyExtractor={(item) => `delivery-${item.id}`}
          renderItem={renderDeliveryCard}
          contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 12, paddingBottom: insets.bottom + 20 }}
          refreshing={isFetching}
          onRefresh={refetch}
        />
      )}

      {/* Assign driver modal */}
      <Modal
        visible={assignModalOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setAssignModalOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <View style={styles.modalHeaderRow}>
              <Text style={[styles.modalTitle, { color: colors.foreground }]}>
                Assign Driver {selectedDelivery ? `— #${selectedDelivery.id}` : ''}
              </Text>
              <Pressable onPress={() => setAssignModalOpen(false)} hitSlop={8}>
                <Feather name="x" size={20} color={colors.mutedForeground} />
              </Pressable>
            </View>

            {isLoadingDrivers ? (
              <ActivityIndicator style={{ marginTop: 20 }} color={colors.primary} />
            ) : availableDrivers.length === 0 ? (
              <View style={{ paddingVertical: 30, alignItems: 'center' }}>
                <Feather name="user-x" size={22} color={colors.mutedForeground} />
                <Text style={[styles.noDriversText, { color: colors.mutedForeground }]}>
                  No available drivers right now.
                </Text>
              </View>
            ) : (
              <ScrollView style={{ maxHeight: 340, marginTop: 10 }}>
                {availableDrivers.map((driver) => (
                  <Pressable
                    key={driver.id}
                    disabled={assignDriver.isPending}
                    onPress={() => handleAssign(driver.id)}
                    style={({ pressed }) => [
                      styles.driverRow,
                      { borderBottomColor: colors.border, backgroundColor: pressed ? colors.muted : 'transparent' },
                    ]}
                  >
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.driverName, { color: colors.foreground }]}>{driver.name}</Text>
                      <Text style={[styles.driverMeta, { color: colors.mutedForeground }]}>
                        {driver.phone} • {driver.vehicle_type}
                        {driver.vehicle_number ? ` • ${driver.vehicle_number}` : ''}
                      </Text>
                    </View>
                    {assignDriver.isPending ? (
                      <ActivityIndicator size="small" color={colors.primary} />
                    ) : (
                      <Feather name="chevron-right" size={16} color={colors.mutedForeground} />
                    )}
                  </Pressable>
                ))}
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: 16, paddingBottom: 14, borderBottomWidth: 1 },
  headerTitle: { fontSize: 20, fontFamily: FONT_FAMILY, fontWeight: '700' },
  headerSubtitle: { fontSize: 12, fontFamily: FONT_FAMILY, marginTop: 4 },

  filterStripWrap: { paddingTop: 10, paddingBottom: 4 },
  filterStrip: { flexGrow: 0, height: 44 },
  filterStripContent: { paddingHorizontal: 16, gap: 8, alignItems: 'center' },
  filterChip: { paddingHorizontal: 14, paddingVertical: 8, borderWidth: 1 },

  card: { borderWidth: 1, padding: 14, marginBottom: 10 },
  cardTopRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  deliveryId: { fontSize: 15, fontFamily: FONT_FAMILY, fontWeight: '700' },
  statusPill: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  statusPillText: { fontSize: 11, fontFamily: FONT_FAMILY, fontWeight: '600' },

  addressRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8 },
  addressText: { fontSize: 13, fontFamily: FONT_FAMILY, flex: 1 },

  cardBottomRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 },
  customerText: { fontSize: 12, fontFamily: FONT_FAMILY },
  driverText: { fontSize: 12, fontFamily: FONT_FAMILY },

  assignBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 10, marginTop: 12 },
  assignBtnText: { fontSize: 13, fontFamily: FONT_FAMILY, fontWeight: '600' },

  errorBox: { alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 40, paddingHorizontal: 20 },
  errorText: { fontSize: 13, fontFamily: FONT_FAMILY },
  retryBtn: { paddingHorizontal: 16, paddingVertical: 8, borderWidth: 1, marginTop: 4 },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalContent: { width: '100%', maxWidth: 420, maxHeight: '80%', padding: 22, borderRadius: 16 },
  modalHeaderRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  modalTitle: { fontSize: 17, fontFamily: FONT_FAMILY, fontWeight: '700', flex: 1, marginRight: 10 },

  noDriversText: { fontSize: 13, fontFamily: FONT_FAMILY, marginTop: 8, textAlign: 'center' },

  driverRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1 },
  driverName: { fontSize: 14, fontFamily: FONT_FAMILY, fontWeight: '600' },
  driverMeta: { fontSize: 12, fontFamily: FONT_FAMILY, marginTop: 2 },
});
// // // // // import React, { useCallback, useEffect, useState } from 'react';
// // // // // import {
// // // // //   ActivityIndicator,
// // // // //   FlatList,
// // // // //   Platform,
// // // // //   Pressable,
// // // // //   ScrollView,
// // // // //   StyleSheet,
// // // // //   Text,
// // // // //   View,
// // // // // } from 'react-native';
// // // // // import { Stack } from 'expo-router';
// // // // // import { Feather } from '@expo/vector-icons';
// // // // // import { useSafeAreaInsets } from 'react-native-safe-area-context';
// // // // // import { useColors } from '@/hooks/useColors';
// // // // // import { useBusiness } from '@/contexts/BusinessContext';
// // // // // import { EmptyState } from '@/components/EmptyState';
// // // // // // 🔴 TODO: adjust this import path to wherever your Supabase client actually
// // // // // // lives in this project (e.g. '@/lib/supabase', '@/services/supabaseClient').
// // // // // import { supabase } from '@/lib/supabase';

// // // // // const FONT_FAMILY = Platform.OS === 'web' ? 'Times New Roman' : 'serif';

// // // // // // ✅ Matches the `delivery_status` enum created on the deliveries table
// // // // // type DeliveryStatus = 'Pending' | 'Assigned' | 'In Transit' | 'Delivered' | 'Cancelled';

// // // // // // ✅ Matches the deliveries table columns exactly
// // // // // interface Delivery {
// // // // //   id: number;
// // // // //   business_id: number;
// // // // //   customer_id: number;
// // // // //   customer_name: string;
// // // // //   customer_email: string | null;
// // // // //   customer_phone: string;
// // // // //   customer_address: string | null;
// // // // //   order_id: string;
// // // // //   product_description: string;
// // // // //   amount: number;
// // // // //   payment_mode: string; // 'cash' | 'online'
// // // // //   transaction_type: string; // 'you_got' | 'you_gave'
// // // // //   status: DeliveryStatus;
// // // // //   created_at: string;
// // // // //   updated_at: string;
// // // // // }

// // // // // const STATUS_META: Record<DeliveryStatus, { label: string; color: string; bg: string }> = {
// // // // //   Pending: { label: 'Pending', color: '#B91C1C', bg: '#FEE2E2' },
// // // // //   Assigned: { label: 'Assigned', color: '#B45309', bg: '#FEF3C7' },
// // // // //   'In Transit': { label: 'In Transit', color: '#1D4ED8', bg: '#DBEAFE' },
// // // // //   Delivered: { label: 'Delivered', color: '#15803D', bg: '#DCFCE7' },
// // // // //   Cancelled: { label: 'Cancelled', color: '#6B7280', bg: '#F3F4F6' },
// // // // // };

// // // // // const STATUS_FILTERS: { value: DeliveryStatus | 'all'; label: string }[] = [
// // // // //   { value: 'all', label: 'All' },
// // // // //   { value: 'Pending', label: 'Pending' },
// // // // //   { value: 'Assigned', label: 'Assigned' },
// // // // //   { value: 'In Transit', label: 'In Transit' },
// // // // //   { value: 'Delivered', label: 'Delivered' },
// // // // //   { value: 'Cancelled', label: 'Cancelled' },
// // // // // ];

// // // // // export default function DeliveryListScreen() {
// // // // //   const colors = useColors();
// // // // //   const insets = useSafeAreaInsets();
// // // // //   const { business } = useBusiness();

// // // // //   const [statusFilter, setStatusFilter] = useState<DeliveryStatus | 'all'>('all');
// // // // //   const [deliveries, setDeliveries] = useState<Delivery[]>([]);
// // // // //   const [isLoading, setIsLoading] = useState(true);
// // // // //   const [isFetching, setIsFetching] = useState(false);
// // // // //   const [isError, setIsError] = useState(false);

// // // // //   const fetchDeliveries = useCallback(
// // // // //     async (opts: { showSpinner: boolean }) => {
// // // // //       if (!business?.id) return;

// // // // //       if (opts.showSpinner) setIsLoading(true);
// // // // //       setIsFetching(true);
// // // // //       setIsError(false);

// // // // //       try {
// // // // //         let query = supabase
// // // // //           .from('deliveries')
// // // // //           .select('*')
// // // // //           .eq('business_id', business.id)
// // // // //           .order('created_at', { ascending: false });

// // // // //         if (statusFilter !== 'all') {
// // // // //           query = query.eq('status', statusFilter);
// // // // //         }

// // // // //         const { data, error } = await query;

// // // // //         if (error) {
// // // // //           console.error('❌ Failed to fetch deliveries:', error);
// // // // //           setIsError(true);
// // // // //         } else {
// // // // //           setDeliveries(data || []);
// // // // //         }
// // // // //       } catch (error) {
// // // // //         console.error('❌ Delivery fetch exception:', error);
// // // // //         setIsError(true);
// // // // //       } finally {
// // // // //         setIsLoading(false);
// // // // //         setIsFetching(false);
// // // // //       }
// // // // //     },
// // // // //     [business?.id, statusFilter],
// // // // //   );

// // // // //   useEffect(() => {
// // // // //     fetchDeliveries({ showSpinner: true });
// // // // //   }, [fetchDeliveries]);

// // // // //   const total = deliveries.length;

// // // // //   const renderDeliveryCard = ({ item }: { item: Delivery }) => {
// // // // //     const meta = STATUS_META[item.status] || STATUS_META.Pending;

// // // // //     return (
// // // // //       <View
// // // // //         style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius }]}
// // // // //       >
// // // // //         <View style={styles.cardTopRow}>
// // // // //           <Text style={[styles.deliveryId, { color: colors.foreground }]}>Order #{item.order_id}</Text>
// // // // //           <View style={[styles.statusPill, { backgroundColor: meta.bg }]}>
// // // // //             <Text style={[styles.statusPillText, { color: meta.color }]}>{meta.label}</Text>
// // // // //           </View>
// // // // //         </View>

// // // // //         {/* Customer info */}
// // // // //         <View style={styles.addressRow}>
// // // // //           <Feather name="user" size={13} color={colors.mutedForeground} />
// // // // //           <Text style={[styles.addressText, { color: colors.foreground }]} numberOfLines={1}>
// // // // //             {item.customer_name}
// // // // //           </Text>
// // // // //         </View>
// // // // //         <View style={styles.addressRow}>
// // // // //           <Feather name="phone" size={13} color={colors.mutedForeground} />
// // // // //           <Text style={[styles.addressText, { color: colors.foreground }]} numberOfLines={1}>
// // // // //             {item.customer_phone}
// // // // //           </Text>
// // // // //         </View>
// // // // //         {item.customer_email && (
// // // // //           <View style={styles.addressRow}>
// // // // //             <Feather name="mail" size={13} color={colors.mutedForeground} />
// // // // //             <Text style={[styles.addressText, { color: colors.foreground }]} numberOfLines={1}>
// // // // //               {item.customer_email}
// // // // //             </Text>
// // // // //           </View>
// // // // //         )}
// // // // //         {item.customer_address && (
// // // // //           <View style={styles.addressRow}>
// // // // //             <Feather name="map-pin" size={13} color={colors.mutedForeground} />
// // // // //             <Text style={[styles.addressText, { color: colors.foreground }]} numberOfLines={2}>
// // // // //               {item.customer_address}
// // // // //             </Text>
// // // // //           </View>
// // // // //         )}

// // // // //         {/* Product + payment info */}
// // // // //         <View style={styles.addressRow}>
// // // // //           <Feather name="package" size={13} color={colors.mutedForeground} />
// // // // //           <Text style={[styles.addressText, { color: colors.foreground }]} numberOfLines={2}>
// // // // //             {item.product_description}
// // // // //           </Text>
// // // // //         </View>

// // // // //         <View style={styles.cardBottomRow}>
// // // // //           <Text style={[styles.amountText, { color: colors.foreground }]}>₹{item.amount}</Text>
// // // // //           <Text style={[styles.driverText, { color: colors.mutedForeground }]}>
// // // // //             {item.payment_mode === 'online' ? 'Paid Online' : 'Cash'} •{' '}
// // // // //             {item.transaction_type === 'you_got' ? 'Received' : 'Pending'}
// // // // //           </Text>
// // // // //         </View>
// // // // //       </View>
// // // // //     );
// // // // //   };

// // // // //   return (
// // // // //     <View style={{ flex: 1, backgroundColor: colors.background }}>
// // // // //       <Stack.Screen options={{ headerShown: false }} />

// // // // //       {/* Header */}
// // // // //       <View style={[styles.header, { paddingTop: insets.top + 12, borderBottomColor: colors.border }]}>
// // // // //         <Text style={[styles.headerTitle, { color: colors.foreground }]}>Deliveries</Text>
// // // // //         <Text style={[styles.headerSubtitle, { color: colors.mutedForeground }]}>
// // // // //           {total} delivery{total === 1 ? '' : 'ies'}
// // // // //         </Text>
// // // // //       </View>

// // // // //       {/* Status filter chips */}
// // // // //       <View style={styles.filterStripWrap}>
// // // // //         <ScrollView
// // // // //           horizontal
// // // // //           showsHorizontalScrollIndicator={false}
// // // // //           style={styles.filterStrip}
// // // // //           contentContainerStyle={styles.filterStripContent}
// // // // //         >
// // // // //           {STATUS_FILTERS.map((f) => {
// // // // //             const active = f.value === statusFilter;
// // // // //             return (
// // // // //               <Pressable
// // // // //                 key={f.value}
// // // // //                 onPress={() => setStatusFilter(f.value)}
// // // // //                 style={[
// // // // //                   styles.filterChip,
// // // // //                   {
// // // // //                     borderRadius: colors.radius,
// // // // //                     backgroundColor: active ? colors.primary : colors.card,
// // // // //                     borderColor: active ? colors.primary : colors.border,
// // // // //                   },
// // // // //                 ]}
// // // // //               >
// // // // //                 <Text style={{ color: active ? colors.primaryForeground : colors.foreground, fontSize: 12, fontFamily: FONT_FAMILY }}>
// // // // //                   {f.label}
// // // // //                 </Text>
// // // // //               </Pressable>
// // // // //             );
// // // // //           })}
// // // // //         </ScrollView>
// // // // //       </View>

// // // // //       {/* List */}
// // // // //       {isLoading ? (
// // // // //         <ActivityIndicator style={{ marginTop: 40 }} color={colors.primary} />
// // // // //       ) : isError ? (
// // // // //         <View style={styles.errorBox}>
// // // // //           <Feather name="alert-triangle" size={20} color={colors.destructive} />
// // // // //           <Text style={[styles.errorText, { color: colors.destructive }]}>Could not load deliveries.</Text>
// // // // //           <Pressable
// // // // //             onPress={() => fetchDeliveries({ showSpinner: true })}
// // // // //             style={[styles.retryBtn, { borderColor: colors.border, borderRadius: colors.radius }]}
// // // // //           >
// // // // //             <Text style={{ color: colors.primary, fontSize: 13, fontFamily: FONT_FAMILY }}>Retry</Text>
// // // // //           </Pressable>
// // // // //         </View>
// // // // //       ) : deliveries.length === 0 ? (
// // // // //         <EmptyState
// // // // //           icon="truck"
// // // // //           title="No deliveries yet"
// // // // //           subtitle="Deliveries created for customer orders will show up here."
// // // // //         />
// // // // //       ) : (
// // // // //         <FlatList
// // // // //           data={deliveries}
// // // // //           keyExtractor={(item) => `delivery-${item.id}`}
// // // // //           renderItem={renderDeliveryCard}
// // // // //           contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 12, paddingBottom: insets.bottom + 20 }}
// // // // //           refreshing={isFetching}
// // // // //           onRefresh={() => fetchDeliveries({ showSpinner: false })}
// // // // //         />
// // // // //       )}
// // // // //     </View>
// // // // //   );
// // // // // }

// // // // // const styles = StyleSheet.create({
// // // // //   header: { paddingHorizontal: 16, paddingBottom: 14, borderBottomWidth: 1 },
// // // // //   headerTitle: { fontSize: 20, fontFamily: FONT_FAMILY, fontWeight: '700' },
// // // // //   headerSubtitle: { fontSize: 12, fontFamily: FONT_FAMILY, marginTop: 4 },

// // // // //   filterStripWrap: { paddingTop: 10, paddingBottom: 4 },
// // // // //   filterStrip: { flexGrow: 0, height: 44 },
// // // // //   filterStripContent: { paddingHorizontal: 16, gap: 8, alignItems: 'center' },
// // // // //   filterChip: { paddingHorizontal: 14, paddingVertical: 8, borderWidth: 1 },

// // // // //   card: { borderWidth: 1, padding: 14, marginBottom: 10 },
// // // // //   cardTopRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
// // // // //   deliveryId: { fontSize: 15, fontFamily: FONT_FAMILY, fontWeight: '700' },
// // // // //   statusPill: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
// // // // //   statusPillText: { fontSize: 11, fontFamily: FONT_FAMILY, fontWeight: '600' },

// // // // //   addressRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8 },
// // // // //   addressText: { fontSize: 13, fontFamily: FONT_FAMILY, flex: 1 },

// // // // //   cardBottomRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 },
// // // // //   amountText: { fontSize: 15, fontFamily: FONT_FAMILY, fontWeight: '700' },
// // // // //   driverText: { fontSize: 12, fontFamily: FONT_FAMILY },

// // // // //   errorBox: { alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 40, paddingHorizontal: 20 },
// // // // //   errorText: { fontSize: 13, fontFamily: FONT_FAMILY },
// // // // //   retryBtn: { paddingHorizontal: 16, paddingVertical: 8, borderWidth: 1, marginTop: 4 },
// // // // // });
// // // // // app/deliveries.tsx or screens/DeliveriesScreen.tsx
// // // // // import React, { useCallback, useEffect, useState } from 'react';
// // // // // import {
// // // // //   ActivityIndicator,
// // // // //   FlatList,
// // // // //   Platform,
// // // // //   Pressable,
// // // // //   ScrollView,
// // // // //   StyleSheet,
// // // // //   Text,
// // // // //   TouchableOpacity,
// // // // //   View,
// // // // //   RefreshControl,
// // // // // } from 'react-native';
// // // // // import { Stack, useRouter, useNavigation } from 'expo-router';
// // // // // import { Feather } from '@expo/vector-icons';
// // // // // import { useSafeAreaInsets } from 'react-native-safe-area-context';
// // // // // import { supabase } from '../lib/supabase';

// // // // // type DeliveryStatus = 'Pending' | 'Assigned' | 'In Transit' | 'Delivered' | 'Cancelled';

// // // // // interface Delivery {
// // // // //   id: number;
// // // // //   business_id: number;
// // // // //   customer_id: number;
// // // // //   customer_name: string;
// // // // //   customer_email: string | null;
// // // // //   customer_phone: string;
// // // // //   customer_address: string | null;
// // // // //   order_id: string;
// // // // //   product_description: string;
// // // // //   amount: number;
// // // // //   payment_mode: string;
// // // // //   transaction_type: string;
// // // // //   status: DeliveryStatus;
// // // // //   created_at: string;
// // // // //   updated_at: string;
// // // // // }

// // // // // const STATUS_META: Record<DeliveryStatus, { label: string; color: string; bg: string; icon: string }> = {
// // // // //   Pending: { 
// // // // //     label: 'Pending', 
// // // // //     color: '#B91C1C', 
// // // // //     bg: '#FEE2E2',
// // // // //     icon: 'clock'
// // // // //   },
// // // // //   Assigned: { 
// // // // //     label: 'Assigned', 
// // // // //     color: '#B45309', 
// // // // //     bg: '#FEF3C7',
// // // // //     icon: 'user-check'
// // // // //   },
// // // // //   'In Transit': { 
// // // // //     label: 'In Transit', 
// // // // //     color: '#1D4ED8', 
// // // // //     bg: '#DBEAFE',
// // // // //     icon: 'truck'
// // // // //   },
// // // // //   Delivered: { 
// // // // //     label: 'Delivered', 
// // // // //     color: '#15803D', 
// // // // //     bg: '#DCFCE7',
// // // // //     icon: 'check-circle'
// // // // //   },
// // // // //   Cancelled: { 
// // // // //     label: 'Cancelled', 
// // // // //     color: '#6B7280', 
// // // // //     bg: '#F3F4F6',
// // // // //     icon: 'x-circle'
// // // // //   },
// // // // // };

// // // // // const STATUS_FILTERS = [
// // // // //   { value: 'all', label: 'All Deliveries' },
// // // // //   { value: 'Pending', label: '📋 Pending' },
// // // // //   { value: 'Assigned', label: '👤 Assigned' },
// // // // //   { value: 'In Transit', label: '🚚 In Transit' },
// // // // //   { value: 'Delivered', label: '✅ Delivered' },
// // // // //   { value: 'Cancelled', label: '❌ Cancelled' },
// // // // // ];

// // // // // export default function DeliveriesScreen() {
// // // // //   const insets = useSafeAreaInsets();
// // // // //   const router = useRouter();
// // // // //   const navigation = useNavigation();
  
// // // // //   const [deliveries, setDeliveries] = useState<Delivery[]>([]);
// // // // //   const [filteredDeliveries, setFilteredDeliveries] = useState<Delivery[]>([]);
// // // // //   const [statusFilter, setStatusFilter] = useState<string>('all');
// // // // //   const [isLoading, setIsLoading] = useState(true);
// // // // //   const [isRefreshing, setIsRefreshing] = useState(false);
// // // // //   const [error, setError] = useState<string | null>(null);

// // // // //   // Fetch deliveries from Supabase
// // // // //   const fetchDeliveries = useCallback(async (showLoading = true) => {
// // // // //     if (showLoading) setIsLoading(true);
// // // // //     setError(null);

// // // // //     try {
// // // // //       // Get the business_id (you can get this from context or fetch)
// // // // //       const { data: businessData, error: businessError } = await supabase
// // // // //         .from('businesses')
// // // // //         .select('id')
// // // // //         .limit(1)
// // // // //         .single();

// // // // //       if (businessError) throw businessError;

// // // // //       let query = supabase
// // // // //         .from('deliveries')
// // // // //         .select('*')
// // // // //         .eq('business_id', businessData.id)
// // // // //         .order('created_at', { ascending: false });

// // // // //       if (statusFilter !== 'all') {
// // // // //         query = query.eq('status', statusFilter);
// // // // //       }

// // // // //       const { data, error: deliveryError } = await query;

// // // // //       if (deliveryError) throw deliveryError;

// // // // //       setDeliveries(data || []);
// // // // //       setFilteredDeliveries(data || []);
// // // // //     } catch (error: any) {
// // // // //       console.error('❌ Error fetching deliveries:', error);
// // // // //       setError(error.message || 'Failed to load deliveries');
// // // // //     } finally {
// // // // //       setIsLoading(false);
// // // // //       setIsRefreshing(false);
// // // // //     }
// // // // //   }, [statusFilter]);

// // // // //   // Filter deliveries locally
// // // // //   useEffect(() => {
// // // // //     if (statusFilter === 'all') {
// // // // //       setFilteredDeliveries(deliveries);
// // // // //     } else {
// // // // //       setFilteredDeliveries(
// // // // //         deliveries.filter((d) => d.status === statusFilter)
// // // // //       );
// // // // //     }
// // // // //   }, [statusFilter, deliveries]);

// // // // //   // Initial fetch
// // // // //   useEffect(() => {
// // // // //     fetchDeliveries(true);
// // // // //   }, [fetchDeliveries]);

// // // // //   const onRefresh = () => {
// // // // //     setIsRefreshing(true);
// // // // //     fetchDeliveries(false);
// // // // //   };

// // // // //   // Get status counts
// // // // //   const getStatusCounts = () => {
// // // // //     const counts: Record<string, number> = { all: deliveries.length };
// // // // //     deliveries.forEach((d) => {
// // // // //       counts[d.status] = (counts[d.status] || 0) + 1;
// // // // //     });
// // // // //     return counts;
// // // // //   };

// // // // //   const statusCounts = getStatusCounts();

// // // // //   // Navigate to delivery detail - Using navigation.navigate instead of router.push
// // // // //   const navigateToDeliveryDetail = (deliveryId: number) => {
// // // // //     // @ts-ignore - Ignore type checking for navigation
// // // // //     navigation.navigate('delivery-detail', { id: deliveryId });
// // // // //   };

// // // // //   // Navigate to create delivery - Using navigation.navigate instead of router.push
// // // // //   const navigateToCreateDelivery = () => {
// // // // //     // @ts-ignore - Ignore type checking for navigation
// // // // //     navigation.navigate('create-delivery');
// // // // //   };

// // // // //   // Render individual delivery card
// // // // //   const renderDeliveryCard = ({ item }: { item: Delivery }) => {
// // // // //     const statusMeta = STATUS_META[item.status] || STATUS_META.Pending;
// // // // //     const isCancelled = item.status === 'Cancelled';

// // // // //     return (
// // // // //       <Pressable
// // // // //         style={[
// // // // //           styles.card,
// // // // //           {
// // // // //             borderLeftColor: statusMeta.color,
// // // // //             borderLeftWidth: 4,
// // // // //             opacity: isCancelled ? 0.7 : 1,
// // // // //           }
// // // // //         ]}
// // // // //         onPress={() => navigateToDeliveryDetail(item.id)}
// // // // //       >
// // // // //         {/* Header: Order ID and Status */}
// // // // //         <View style={styles.cardHeader}>
// // // // //           <View style={styles.orderIdContainer}>
// // // // //             <Feather name="hash" size={14} color="#666" />
// // // // //             <Text style={styles.orderId}>Order #{item.order_id}</Text>
// // // // //           </View>
// // // // //           <View style={[styles.statusBadge, { backgroundColor: statusMeta.bg }]}>
// // // // //             <Feather name={statusMeta.icon as any} size={12} color={statusMeta.color} />
// // // // //             <Text style={[styles.statusText, { color: statusMeta.color }]}>
// // // // //               {statusMeta.label}
// // // // //             </Text>
// // // // //           </View>
// // // // //         </View>

// // // // //         {/* Customer Info */}
// // // // //         <View style={styles.customerSection}>
// // // // //           <View style={styles.avatar}>
// // // // //             <Text style={styles.avatarText}>
// // // // //               {item.customer_name.charAt(0).toUpperCase()}
// // // // //             </Text>
// // // // //           </View>
// // // // //           <View style={styles.customerInfo}>
// // // // //             <Text style={styles.customerName}>{item.customer_name}</Text>
// // // // //             <View style={styles.contactRow}>
// // // // //               <Feather name="phone" size={12} color="#666" />
// // // // //               <Text style={styles.contactText}>{item.customer_phone}</Text>
// // // // //             </View>
// // // // //             {item.customer_email && (
// // // // //               <View style={styles.contactRow}>
// // // // //                 <Feather name="mail" size={12} color="#666" />
// // // // //                 <Text style={styles.contactText}>{item.customer_email}</Text>
// // // // //               </View>
// // // // //             )}
// // // // //           </View>
// // // // //         </View>

// // // // //         {/* Delivery Address */}
// // // // //         {item.customer_address && (
// // // // //           <View style={styles.addressSection}>
// // // // //             <Feather name="map-pin" size={14} color="#666" />
// // // // //             <Text style={styles.addressText} numberOfLines={2}>
// // // // //               {item.customer_address}
// // // // //             </Text>
// // // // //           </View>
// // // // //         )}

// // // // //         {/* Product Info */}
// // // // //         <View style={styles.productSection}>
// // // // //           <Feather name="package" size={14} color="#666" />
// // // // //           <Text style={styles.productText} numberOfLines={2}>
// // // // //             {item.product_description}
// // // // //           </Text>
// // // // //         </View>

// // // // //         {/* Footer: Amount, Payment, Transaction */}
// // // // //         <View style={styles.cardFooter}>
// // // // //           <View style={styles.amountContainer}>
// // // // //             <Text style={styles.amountLabel}>Amount</Text>
// // // // //             <Text style={styles.amountValue}>₹{item.amount.toFixed(2)}</Text>
// // // // //           </View>

// // // // //           <View style={styles.divider} />

// // // // //           <View style={styles.paymentContainer}>
// // // // //             <View style={styles.paymentRow}>
// // // // //               <Feather 
// // // // //                 name={item.payment_mode === 'online' ? 'credit-card' : 'dollar-sign'} 
// // // // //                 size={12} 
// // // // //                 color="#666" 
// // // // //               />
// // // // //               <Text style={styles.paymentText}>
// // // // //                 {item.payment_mode === 'online' ? 'Online' : 'Cash'}
// // // // //               </Text>
// // // // //             </View>
// // // // //             <View style={[styles.transactionBadge, {
// // // // //               backgroundColor: item.transaction_type === 'you_got' ? '#DCFCE7' : '#FEE2E2'
// // // // //             }]}>
// // // // //               <Text style={[styles.transactionText, {
// // // // //                 color: item.transaction_type === 'you_got' ? '#15803D' : '#B91C1C'
// // // // //               }]}>
// // // // //                 {item.transaction_type === 'you_got' ? 'Received' : 'To Pay'}
// // // // //               </Text>
// // // // //             </View>
// // // // //           </View>
// // // // //         </View>

// // // // //         {/* Timestamp */}
// // // // //         <View style={styles.timestampSection}>
// // // // //           <Feather name="clock" size={12} color="#999" />
// // // // //           <Text style={styles.timestampText}>
// // // // //             {new Date(item.created_at).toLocaleString()}
// // // // //           </Text>
// // // // //         </View>
// // // // //       </Pressable>
// // // // //     );
// // // // //   };

// // // // //   // Loading state
// // // // //   if (isLoading) {
// // // // //     return (
// // // // //       <View style={styles.centeredContainer}>
// // // // //         <ActivityIndicator size="large" color="#2563EB" />
// // // // //         <Text style={styles.loadingText}>Loading deliveries...</Text>
// // // // //       </View>
// // // // //     );
// // // // //   }

// // // // //   // Error state
// // // // //   if (error) {
// // // // //     return (
// // // // //       <View style={styles.centeredContainer}>
// // // // //         <Feather name="alert-circle" size={48} color="#EF4444" />
// // // // //         <Text style={styles.errorTitle}>Something went wrong</Text>
// // // // //         <Text style={styles.errorText}>{error}</Text>
// // // // //         <TouchableOpacity style={styles.retryButton} onPress={() => fetchDeliveries(true)}>
// // // // //           <Text style={styles.retryButtonText}>Retry</Text>
// // // // //         </TouchableOpacity>
// // // // //       </View>
// // // // //     );
// // // // //   }

// // // // //   return (
// // // // //     <View style={[styles.container, { paddingTop: insets.top }]}>
// // // // //       <Stack.Screen 
// // // // //         options={{
// // // // //           title: 'Deliveries',
// // // // //           headerShown: true,
// // // // //           headerRight: () => (
// // // // //             <TouchableOpacity 
// // // // //               onPress={navigateToCreateDelivery}
// // // // //               style={{ marginRight: 16 }}
// // // // //             >
// // // // //               <Feather name="plus" size={24} color="#2563EB" />
// // // // //             </TouchableOpacity>
// // // // //           ),
// // // // //         }}
// // // // //       />

// // // // //       {/* Status Filter Chips */}
// // // // //       <View style={styles.filterContainer}>
// // // // //         <ScrollView 
// // // // //           horizontal 
// // // // //           showsHorizontalScrollIndicator={false}
// // // // //           contentContainerStyle={styles.filterScrollContent}
// // // // //         >
// // // // //           {STATUS_FILTERS.map((filter) => (
// // // // //             <TouchableOpacity
// // // // //               key={filter.value}
// // // // //               style={[
// // // // //                 styles.filterChip,
// // // // //                 statusFilter === filter.value && styles.filterChipActive,
// // // // //               ]}
// // // // //               onPress={() => setStatusFilter(filter.value)}
// // // // //             >
// // // // //               <Text
// // // // //                 style={[
// // // // //                   styles.filterChipText,
// // // // //                   statusFilter === filter.value && styles.filterChipTextActive,
// // // // //                 ]}
// // // // //               >
// // // // //                 {filter.label}
// // // // //                 {filter.value !== 'all' && (
// // // // //                   <Text style={styles.filterCount}>
// // // // //                     {' '}({statusCounts[filter.value] || 0})
// // // // //                   </Text>
// // // // //                 )}
// // // // //               </Text>
// // // // //             </TouchableOpacity>
// // // // //           ))}
// // // // //         </ScrollView>
// // // // //       </View>

// // // // //       {/* Deliveries List */}
// // // // //       {filteredDeliveries.length === 0 ? (
// // // // //         <View style={styles.emptyState}>
// // // // //           <Feather name="truck" size={64} color="#D1D5DB" />
// // // // //           <Text style={styles.emptyStateTitle}>
// // // // //             {statusFilter === 'all' ? 'No deliveries yet' : `No ${statusFilter} deliveries`}
// // // // //           </Text>
// // // // //           <Text style={styles.emptyStateSubtitle}>
// // // // //             {statusFilter === 'all' 
// // // // //               ? 'Deliveries created for customer orders will show up here.' 
// // // // //               : `No deliveries with "${statusFilter}" status`}
// // // // //           </Text>
// // // // //           <TouchableOpacity 
// // // // //             style={styles.createDeliveryButton}
// // // // //             onPress={navigateToCreateDelivery}
// // // // //           >
// // // // //             <Text style={styles.createDeliveryButtonText}>Create First Delivery</Text>
// // // // //           </TouchableOpacity>
// // // // //         </View>
// // // // //       ) : (
// // // // //         <FlatList
// // // // //           data={filteredDeliveries}
// // // // //           keyExtractor={(item) => `delivery-${item.id}`}
// // // // //           renderItem={renderDeliveryCard}
// // // // //           contentContainerStyle={styles.listContent}
// // // // //           refreshControl={
// // // // //             <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
// // // // //           }
// // // // //           showsVerticalScrollIndicator={false}
// // // // //         />
// // // // //       )}
// // // // //     </View>
// // // // //   );
// // // // // }

// // // // // const styles = StyleSheet.create({
// // // // //   container: {
// // // // //     flex: 1,
// // // // //     backgroundColor: '#F9FAFB',
// // // // //   },
// // // // //   centeredContainer: {
// // // // //     flex: 1,
// // // // //     justifyContent: 'center',
// // // // //     alignItems: 'center',
// // // // //     paddingHorizontal: 20,
// // // // //   },
// // // // //   filterContainer: {
// // // // //     backgroundColor: 'white',
// // // // //     paddingVertical: 12,
// // // // //     borderBottomWidth: 1,
// // // // //     borderBottomColor: '#E5E7EB',
// // // // //   },
// // // // //   filterScrollContent: {
// // // // //     paddingHorizontal: 16,
// // // // //     gap: 8,
// // // // //   },
// // // // //   filterChip: {
// // // // //     paddingHorizontal: 16,
// // // // //     paddingVertical: 8,
// // // // //     borderRadius: 20,
// // // // //     backgroundColor: '#F3F4F6',
// // // // //     borderWidth: 1,
// // // // //     borderColor: 'transparent',
// // // // //   },
// // // // //   filterChipActive: {
// // // // //     backgroundColor: '#DBEAFE',
// // // // //     borderColor: '#2563EB',
// // // // //   },
// // // // //   filterChipText: {
// // // // //     fontSize: 13,
// // // // //     color: '#6B7280',
// // // // //     fontWeight: '500',
// // // // //   },
// // // // //   filterChipTextActive: {
// // // // //     color: '#2563EB',
// // // // //   },
// // // // //   filterCount: {
// // // // //     fontSize: 11,
// // // // //     color: '#9CA3AF',
// // // // //   },
// // // // //   listContent: {
// // // // //     padding: 16,
// // // // //     paddingBottom: 100,
// // // // //   },
// // // // //   card: {
// // // // //     backgroundColor: 'white',
// // // // //     borderRadius: 12,
// // // // //     padding: 16,
// // // // //     marginBottom: 12,
// // // // //     shadowColor: '#000',
// // // // //     shadowOffset: { width: 0, height: 2 },
// // // // //     shadowOpacity: 0.05,
// // // // //     shadowRadius: 4,
// // // // //     elevation: 2,
// // // // //     borderLeftWidth: 4,
// // // // //   },
// // // // //   cardHeader: {
// // // // //     flexDirection: 'row',
// // // // //     justifyContent: 'space-between',
// // // // //     alignItems: 'center',
// // // // //     marginBottom: 12,
// // // // //   },
// // // // //   orderIdContainer: {
// // // // //     flexDirection: 'row',
// // // // //     alignItems: 'center',
// // // // //     gap: 4,
// // // // //   },
// // // // //   orderId: {
// // // // //     fontSize: 14,
// // // // //     fontWeight: '600',
// // // // //     color: '#111827',
// // // // //   },
// // // // //   statusBadge: {
// // // // //     flexDirection: 'row',
// // // // //     alignItems: 'center',
// // // // //     gap: 4,
// // // // //     paddingHorizontal: 10,
// // // // //     paddingVertical: 4,
// // // // //     borderRadius: 12,
// // // // //   },
// // // // //   statusText: {
// // // // //     fontSize: 11,
// // // // //     fontWeight: '600',
// // // // //   },
// // // // //   customerSection: {
// // // // //     flexDirection: 'row',
// // // // //     alignItems: 'center',
// // // // //     marginBottom: 8,
// // // // //   },
// // // // //   avatar: {
// // // // //     width: 40,
// // // // //     height: 40,
// // // // //     borderRadius: 20,
// // // // //     backgroundColor: '#2563EB',
// // // // //     justifyContent: 'center',
// // // // //     alignItems: 'center',
// // // // //     marginRight: 12,
// // // // //   },
// // // // //   avatarText: {
// // // // //     color: 'white',
// // // // //     fontSize: 16,
// // // // //     fontWeight: '600',
// // // // //   },
// // // // //   customerInfo: {
// // // // //     flex: 1,
// // // // //   },
// // // // //   customerName: {
// // // // //     fontSize: 16,
// // // // //     fontWeight: '600',
// // // // //     color: '#111827',
// // // // //   },
// // // // //   contactRow: {
// // // // //     flexDirection: 'row',
// // // // //     alignItems: 'center',
// // // // //     gap: 4,
// // // // //     marginTop: 2,
// // // // //   },
// // // // //   contactText: {
// // // // //     fontSize: 12,
// // // // //     color: '#6B7280',
// // // // //   },
// // // // //   addressSection: {
// // // // //     flexDirection: 'row',
// // // // //     alignItems: 'flex-start',
// // // // //     gap: 6,
// // // // //     marginBottom: 6,
// // // // //     paddingTop: 6,
// // // // //     borderTopWidth: 1,
// // // // //     borderTopColor: '#F3F4F6',
// // // // //   },
// // // // //   addressText: {
// // // // //     flex: 1,
// // // // //     fontSize: 13,
// // // // //     color: '#4B5563',
// // // // //     lineHeight: 18,
// // // // //   },
// // // // //   productSection: {
// // // // //     flexDirection: 'row',
// // // // //     alignItems: 'flex-start',
// // // // //     gap: 6,
// // // // //     marginBottom: 10,
// // // // //   },
// // // // //   productText: {
// // // // //     flex: 1,
// // // // //     fontSize: 13,
// // // // //     color: '#4B5563',
// // // // //     lineHeight: 18,
// // // // //   },
// // // // //   cardFooter: {
// // // // //     flexDirection: 'row',
// // // // //     alignItems: 'center',
// // // // //     paddingTop: 10,
// // // // //     borderTopWidth: 1,
// // // // //     borderTopColor: '#F3F4F6',
// // // // //     gap: 12,
// // // // //   },
// // // // //   amountContainer: {
// // // // //     flex: 0.4,
// // // // //   },
// // // // //   amountLabel: {
// // // // //     fontSize: 11,
// // // // //     color: '#9CA3AF',
// // // // //     marginBottom: 2,
// // // // //   },
// // // // //   amountValue: {
// // // // //     fontSize: 18,
// // // // //     fontWeight: '700',
// // // // //     color: '#111827',
// // // // //   },
// // // // //   divider: {
// // // // //     width: 1,
// // // // //     height: 30,
// // // // //     backgroundColor: '#E5E7EB',
// // // // //   },
// // // // //   paymentContainer: {
// // // // //     flex: 0.6,
// // // // //     gap: 4,
// // // // //   },
// // // // //   paymentRow: {
// // // // //     flexDirection: 'row',
// // // // //     alignItems: 'center',
// // // // //     gap: 4,
// // // // //   },
// // // // //   paymentText: {
// // // // //     fontSize: 12,
// // // // //     color: '#6B7280',
// // // // //   },
// // // // //   transactionBadge: {
// // // // //     alignSelf: 'flex-start',
// // // // //     paddingHorizontal: 8,
// // // // //     paddingVertical: 2,
// // // // //     borderRadius: 4,
// // // // //   },
// // // // //   transactionText: {
// // // // //     fontSize: 10,
// // // // //     fontWeight: '600',
// // // // //   },
// // // // //   timestampSection: {
// // // // //     flexDirection: 'row',
// // // // //     alignItems: 'center',
// // // // //     gap: 4,
// // // // //     marginTop: 8,
// // // // //     paddingTop: 8,
// // // // //     borderTopWidth: 1,
// // // // //     borderTopColor: '#F9FAFB',
// // // // //   },
// // // // //   timestampText: {
// // // // //     fontSize: 11,
// // // // //     color: '#9CA3AF',
// // // // //   },
// // // // //   emptyState: {
// // // // //     flex: 1,
// // // // //     justifyContent: 'center',
// // // // //     alignItems: 'center',
// // // // //     paddingHorizontal: 40,
// // // // //   },
// // // // //   emptyStateTitle: {
// // // // //     fontSize: 20,
// // // // //     fontWeight: '600',
// // // // //     color: '#111827',
// // // // //     marginTop: 16,
// // // // //   },
// // // // //   emptyStateSubtitle: {
// // // // //     fontSize: 14,
// // // // //     color: '#6B7280',
// // // // //     textAlign: 'center',
// // // // //     marginTop: 8,
// // // // //   },
// // // // //   createDeliveryButton: {
// // // // //     marginTop: 20,
// // // // //     backgroundColor: '#2563EB',
// // // // //     paddingHorizontal: 24,
// // // // //     paddingVertical: 12,
// // // // //     borderRadius: 8,
// // // // //   },
// // // // //   createDeliveryButtonText: {
// // // // //     color: 'white',
// // // // //     fontSize: 14,
// // // // //     fontWeight: '600',
// // // // //   },
// // // // //   retryButton: {
// // // // //     marginTop: 16,
// // // // //     backgroundColor: '#2563EB',
// // // // //     paddingHorizontal: 24,
// // // // //     paddingVertical: 10,
// // // // //     borderRadius: 8,
// // // // //   },
// // // // //   retryButtonText: {
// // // // //     color: 'white',
// // // // //     fontSize: 14,
// // // // //     fontWeight: '600',
// // // // //   },
// // // // //   loadingText: {
// // // // //     marginTop: 12,
// // // // //     fontSize: 14,
// // // // //     color: '#6B7280',
// // // // //   },
// // // // //   errorTitle: {
// // // // //     fontSize: 18,
// // // // //     fontWeight: '600',
// // // // //     color: '#111827',
// // // // //     marginTop: 12,
// // // // //   },
// // // // //   errorText: {
// // // // //     fontSize: 14,
// // // // //     color: '#6B7280',
// // // // //     textAlign: 'center',
// // // // //     marginTop: 8,
// // // // //   },
// // // // // });
// // // // // delivery-app/app/delivery-list.tsx
// // // // import React, { useCallback, useEffect, useState } from 'react';
// // // // import {
// // // //   ActivityIndicator,
// // // //   FlatList,
// // // //   Pressable,
// // // //   ScrollView,
// // // //   StyleSheet,
// // // //   Text,
// // // //   TouchableOpacity,
// // // //   View,
// // // //   RefreshControl,
// // // // } from 'react-native';
// // // // import { useRouter, useNavigation } from 'expo-router';
// // // // import { Feather } from '@expo/vector-icons';
// // // // import { useSafeAreaInsets } from 'react-native-safe-area-context';
// // // // import { supabase } from '../lib/supabase';

// // // // type DeliveryStatus = 'Pending' | 'Assigned' | 'In Transit' | 'Delivered' | 'Cancelled';

// // // // interface Delivery {
// // // //   id: number;
// // // //   business_id: number;
// // // //   customer_id: number;
// // // //   customer_name: string;
// // // //   customer_email: string | null;
// // // //   customer_phone: string;
// // // //   customer_address: string | null;
// // // //   order_id: string;
// // // //   product_description: string;
// // // //   amount: number;
// // // //   payment_mode: string;
// // // //   transaction_type: string;
// // // //   status: DeliveryStatus;
// // // //   created_at: string;
// // // //   updated_at: string;
// // // // }

// // // // const STATUS_META: Record<DeliveryStatus, { label: string; color: string; bg: string; icon: string }> = {
// // // //   Pending: { label: 'Pending', color: '#B91C1C', bg: '#FEE2E2', icon: 'clock' },
// // // //   Assigned: { label: 'Assigned', color: '#B45309', bg: '#FEF3C7', icon: 'user-check' },
// // // //   'In Transit': { label: 'In Transit', color: '#1D4ED8', bg: '#DBEAFE', icon: 'truck' },
// // // //   Delivered: { label: 'Delivered', color: '#15803D', bg: '#DCFCE7', icon: 'check-circle' },
// // // //   Cancelled: { label: 'Cancelled', color: '#6B7280', bg: '#F3F4F6', icon: 'x-circle' },
// // // // };

// // // // const STATUS_FILTERS = [
// // // //   { value: 'all', label: 'All Deliveries' },
// // // //   { value: 'Pending', label: '📋 Pending' },
// // // //   { value: 'Assigned', label: '👤 Assigned' },
// // // //   { value: 'In Transit', label: '🚚 In Transit' },
// // // //   { value: 'Delivered', label: '✅ Delivered' },
// // // //   { value: 'Cancelled', label: '❌ Cancelled' },
// // // // ];

// // // // export default function DeliveryListScreen() {
// // // //   const insets = useSafeAreaInsets();
// // // //   const router = useRouter();
// // // //   const navigation = useNavigation();
  
// // // //   const [deliveries, setDeliveries] = useState<Delivery[]>([]);
// // // //   const [filteredDeliveries, setFilteredDeliveries] = useState<Delivery[]>([]);
// // // //   const [statusFilter, setStatusFilter] = useState<string>('all');
// // // //   const [isLoading, setIsLoading] = useState(true);
// // // //   const [isRefreshing, setIsRefreshing] = useState(false);
// // // //   const [error, setError] = useState<string | null>(null);

// // // //   // Get business ID
// // // //   const getBusinessId = useCallback(async () => {
// // // //     try {
// // // //       const { data, error } = await supabase
// // // //         .from('businesses')
// // // //         .select('id')
// // // //         .limit(1)
// // // //         .single();

// // // //       if (error) throw error;
// // // //       return data.id;
// // // //     } catch (error) {
// // // //       console.error('❌ Error getting business:', error);
// // // //       return 1;
// // // //     }
// // // //   }, []);

// // // //   // Fetch deliveries
// // // //   const fetchDeliveries = useCallback(async (showLoading = true) => {
// // // //     if (showLoading) setIsLoading(true);
// // // //     setError(null);

// // // //     try {
// // // //       const bizId = await getBusinessId();

// // // //       let query = supabase
// // // //         .from('deliveries')
// // // //         .select('*')
// // // //         .eq('business_id', bizId)
// // // //         .order('created_at', { ascending: false });

// // // //       if (statusFilter !== 'all') {
// // // //         query = query.eq('status', statusFilter);
// // // //       }

// // // //       const { data, error: deliveryError } = await query;

// // // //       if (deliveryError) throw deliveryError;

// // // //       setDeliveries(data || []);
// // // //       setFilteredDeliveries(data || []);
// // // //     } catch (error: any) {
// // // //       console.error('❌ Error fetching deliveries:', error);
// // // //       setError(error.message || 'Failed to load deliveries');
// // // //     } finally {
// // // //       setIsLoading(false);
// // // //       setIsRefreshing(false);
// // // //     }
// // // //   }, [statusFilter]);

// // // //   // Filter deliveries locally
// // // //   useEffect(() => {
// // // //     if (statusFilter === 'all') {
// // // //       setFilteredDeliveries(deliveries);
// // // //     } else {
// // // //       setFilteredDeliveries(
// // // //         deliveries.filter((d) => d.status === statusFilter)
// // // //       );
// // // //     }
// // // //   }, [statusFilter, deliveries]);

// // // //   // Initial fetch
// // // //   useEffect(() => {
// // // //     fetchDeliveries(true);
// // // //   }, [fetchDeliveries]);

// // // //   const onRefresh = () => {
// // // //     setIsRefreshing(true);
// // // //     fetchDeliveries(false);
// // // //   };

// // // //   // Get status counts
// // // //   const getStatusCounts = () => {
// // // //     const counts: Record<string, number> = { all: deliveries.length };
// // // //     deliveries.forEach((d) => {
// // // //       counts[d.status] = (counts[d.status] || 0) + 1;
// // // //     });
// // // //     return counts;
// // // //   };

// // // //   const statusCounts = getStatusCounts();

// // // //   // FIXED: Navigation using navigation.navigate instead of router.push
// // // //   const goToDeliveryDetail = (deliveryId: number) => {
// // // //     // @ts-ignore - Ignore type checking for navigation
// // // //     navigation.navigate('delivery-detail', { id: deliveryId });
// // // //   };

// // // //   const goToCreateDelivery = () => {
// // // //     // @ts-ignore - Ignore type checking for navigation
// // // //     navigation.navigate('create-delivery');
// // // //   };

// // // //   // Render delivery card
// // // //   const renderDeliveryCard = ({ item }: { item: Delivery }) => {
// // // //     const statusMeta = STATUS_META[item.status] || STATUS_META.Pending;

// // // //     return (
// // // //       <Pressable
// // // //         style={[
// // // //           styles.card,
// // // //           { borderLeftColor: statusMeta.color, borderLeftWidth: 4 }
// // // //         ]}
// // // //         onPress={() => goToDeliveryDetail(item.id)}
// // // //       >
// // // //         {/* Header: Order ID and Status */}
// // // //         <View style={styles.cardHeader}>
// // // //           <View style={styles.orderIdContainer}>
// // // //             <Feather name="hash" size={14} color="#666" />
// // // //             <Text style={styles.orderId}>Order #{item.order_id}</Text>
// // // //           </View>
// // // //           <View style={[styles.statusBadge, { backgroundColor: statusMeta.bg }]}>
// // // //             <Feather name={statusMeta.icon as any} size={12} color={statusMeta.color} />
// // // //             <Text style={[styles.statusText, { color: statusMeta.color }]}>
// // // //               {statusMeta.label}
// // // //             </Text>
// // // //           </View>
// // // //         </View>

// // // //         {/* Customer Info */}
// // // //         <View style={styles.customerSection}>
// // // //           <View style={styles.avatar}>
// // // //             <Text style={styles.avatarText}>
// // // //               {item.customer_name.charAt(0).toUpperCase()}
// // // //             </Text>
// // // //           </View>
// // // //           <View style={styles.customerInfo}>
// // // //             <Text style={styles.customerName}>{item.customer_name}</Text>
// // // //             <View style={styles.contactRow}>
// // // //               <Feather name="phone" size={12} color="#666" />
// // // //               <Text style={styles.contactText}>{item.customer_phone}</Text>
// // // //             </View>
// // // //             {item.customer_email && (
// // // //               <View style={styles.contactRow}>
// // // //                 <Feather name="mail" size={12} color="#666" />
// // // //                 <Text style={styles.contactText}>{item.customer_email}</Text>
// // // //               </View>
// // // //             )}
// // // //           </View>
// // // //         </View>

// // // //         {/* Delivery Address */}
// // // //         {item.customer_address && (
// // // //           <View style={styles.addressSection}>
// // // //             <Feather name="map-pin" size={14} color="#666" />
// // // //             <Text style={styles.addressText} numberOfLines={2}>
// // // //               {item.customer_address}
// // // //             </Text>
// // // //           </View>
// // // //         )}

// // // //         {/* Product Description */}
// // // //         <View style={styles.productSection}>
// // // //           <Feather name="package" size={14} color="#666" />
// // // //           <Text style={styles.productText} numberOfLines={2}>
// // // //             {item.product_description}
// // // //           </Text>
// // // //         </View>

// // // //         {/* Footer: Amount, Payment, Transaction */}
// // // //         <View style={styles.cardFooter}>
// // // //           <View style={styles.amountContainer}>
// // // //             <Text style={styles.amountLabel}>Amount</Text>
// // // //             <Text style={styles.amountValue}>₹{item.amount.toFixed(2)}</Text>
// // // //           </View>

// // // //           <View style={styles.divider} />

// // // //           <View style={styles.paymentContainer}>
// // // //             <View style={styles.paymentRow}>
// // // //               <Feather 
// // // //                 name={item.payment_mode === 'online' ? 'credit-card' : 'dollar-sign'} 
// // // //                 size={12} 
// // // //                 color="#666" 
// // // //               />
// // // //               <Text style={styles.paymentText}>
// // // //                 {item.payment_mode === 'online' ? 'Online' : 'Cash'}
// // // //               </Text>
// // // //             </View>
// // // //             <View style={[styles.transactionBadge, {
// // // //               backgroundColor: item.transaction_type === 'you_got' ? '#DCFCE7' : '#FEE2E2'
// // // //             }]}>
// // // //               <Text style={[styles.transactionText, {
// // // //                 color: item.transaction_type === 'you_got' ? '#15803D' : '#B91C1C'
// // // //               }]}>
// // // //                 {item.transaction_type === 'you_got' ? 'Received' : 'To Pay'}
// // // //               </Text>
// // // //             </View>
// // // //           </View>
// // // //         </View>

// // // //         {/* Timestamp */}
// // // //         <View style={styles.timestampSection}>
// // // //           <Feather name="clock" size={12} color="#999" />
// // // //           <Text style={styles.timestampText}>
// // // //             {new Date(item.created_at).toLocaleString()}
// // // //           </Text>
// // // //         </View>
// // // //       </Pressable>
// // // //     );
// // // //   };

// // // //   if (isLoading) {
// // // //     return (
// // // //       <View style={styles.centeredContainer}>
// // // //         <ActivityIndicator size="large" color="#2563EB" />
// // // //         <Text style={styles.loadingText}>Loading deliveries...</Text>
// // // //       </View>
// // // //     );
// // // //   }

// // // //   if (error) {
// // // //     return (
// // // //       <View style={styles.centeredContainer}>
// // // //         <Feather name="alert-circle" size={48} color="#EF4444" />
// // // //         <Text style={styles.errorTitle}>Something went wrong</Text>
// // // //         <Text style={styles.errorText}>{error}</Text>
// // // //         <TouchableOpacity style={styles.retryButton} onPress={() => fetchDeliveries(true)}>
// // // //           <Text style={styles.retryButtonText}>Retry</Text>
// // // //         </TouchableOpacity>
// // // //       </View>
// // // //     );
// // // //   }

// // // //   return (
// // // //     <View style={[styles.container, { paddingTop: insets.top }]}>
// // // //       {/* Header */}
// // // //       <View style={styles.header}>
// // // //         <Text style={styles.headerTitle}>Deliveries</Text>
// // // //         <TouchableOpacity 
// // // //           style={styles.addButton}
// // // //           onPress={goToCreateDelivery}
// // // //         >
// // // //           <Feather name="plus" size={24} color="white" />
// // // //         </TouchableOpacity>
// // // //       </View>

// // // //       {/* Status Filter Chips */}
// // // //       <View style={styles.filterContainer}>
// // // //         <ScrollView 
// // // //           horizontal 
// // // //           showsHorizontalScrollIndicator={false}
// // // //           contentContainerStyle={styles.filterScrollContent}
// // // //         >
// // // //           {STATUS_FILTERS.map((filter) => (
// // // //             <TouchableOpacity
// // // //               key={filter.value}
// // // //               style={[
// // // //                 styles.filterChip,
// // // //                 statusFilter === filter.value && styles.filterChipActive,
// // // //               ]}
// // // //               onPress={() => setStatusFilter(filter.value)}
// // // //             >
// // // //               <Text
// // // //                 style={[
// // // //                   styles.filterChipText,
// // // //                   statusFilter === filter.value && styles.filterChipTextActive,
// // // //                 ]}
// // // //               >
// // // //                 {filter.label}
// // // //                 {filter.value !== 'all' && (
// // // //                   <Text style={styles.filterCount}>
// // // //                     {' '}({statusCounts[filter.value] || 0})
// // // //                   </Text>
// // // //                 )}
// // // //               </Text>
// // // //             </TouchableOpacity>
// // // //           ))}
// // // //         </ScrollView>
// // // //       </View>

// // // //       {/* Deliveries List */}
// // // //       {filteredDeliveries.length === 0 ? (
// // // //         <View style={styles.emptyState}>
// // // //           <Feather name="truck" size={64} color="#D1D5DB" />
// // // //           <Text style={styles.emptyStateTitle}>
// // // //             {statusFilter === 'all' ? 'No deliveries yet' : `No ${statusFilter} deliveries`}
// // // //           </Text>
// // // //           <Text style={styles.emptyStateSubtitle}>
// // // //             {statusFilter === 'all' 
// // // //               ? 'Deliveries created for customer orders will show up here.' 
// // // //               : `No deliveries with "${statusFilter}" status`}
// // // //           </Text>
// // // //           <TouchableOpacity 
// // // //             style={styles.createDeliveryButton}
// // // //             onPress={goToCreateDelivery}
// // // //           >
// // // //             <Text style={styles.createDeliveryButtonText}>Create First Delivery</Text>
// // // //           </TouchableOpacity>
// // // //         </View>
// // // //       ) : (
// // // //         <FlatList
// // // //           data={filteredDeliveries}
// // // //           keyExtractor={(item) => `delivery-${item.id}`}
// // // //           renderItem={renderDeliveryCard}
// // // //           contentContainerStyle={styles.listContent}
// // // //           refreshControl={
// // // //             <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
// // // //           }
// // // //           showsVerticalScrollIndicator={false}
// // // //         />
// // // //       )}
// // // //     </View>
// // // //   );
// // // // }

// // // // const styles = StyleSheet.create({
// // // //   container: {
// // // //     flex: 1,
// // // //     backgroundColor: '#F9FAFB',
// // // //   },
// // // //   centeredContainer: {
// // // //     flex: 1,
// // // //     justifyContent: 'center',
// // // //     alignItems: 'center',
// // // //     paddingHorizontal: 20,
// // // //   },
// // // //   header: {
// // // //     flexDirection: 'row',
// // // //     justifyContent: 'space-between',
// // // //     alignItems: 'center',
// // // //     paddingHorizontal: 16,
// // // //     paddingVertical: 16,
// // // //     backgroundColor: 'white',
// // // //     borderBottomWidth: 1,
// // // //     borderBottomColor: '#E5E7EB',
// // // //   },
// // // //   headerTitle: {
// // // //     fontSize: 24,
// // // //     fontWeight: '700',
// // // //     color: '#111827',
// // // //   },
// // // //   addButton: {
// // // //     width: 44,
// // // //     height: 44,
// // // //     borderRadius: 22,
// // // //     backgroundColor: '#2563EB',
// // // //     justifyContent: 'center',
// // // //     alignItems: 'center',
// // // //   },
// // // //   filterContainer: {
// // // //     backgroundColor: 'white',
// // // //     paddingVertical: 12,
// // // //     borderBottomWidth: 1,
// // // //     borderBottomColor: '#E5E7EB',
// // // //   },
// // // //   filterScrollContent: {
// // // //     paddingHorizontal: 16,
// // // //     gap: 8,
// // // //   },
// // // //   filterChip: {
// // // //     paddingHorizontal: 16,
// // // //     paddingVertical: 8,
// // // //     borderRadius: 20,
// // // //     backgroundColor: '#F3F4F6',
// // // //     borderWidth: 1,
// // // //     borderColor: 'transparent',
// // // //   },
// // // //   filterChipActive: {
// // // //     backgroundColor: '#DBEAFE',
// // // //     borderColor: '#2563EB',
// // // //   },
// // // //   filterChipText: {
// // // //     fontSize: 13,
// // // //     color: '#6B7280',
// // // //     fontWeight: '500',
// // // //   },
// // // //   filterChipTextActive: {
// // // //     color: '#2563EB',
// // // //   },
// // // //   filterCount: {
// // // //     fontSize: 11,
// // // //     color: '#9CA3AF',
// // // //   },
// // // //   listContent: {
// // // //     padding: 16,
// // // //     paddingBottom: 100,
// // // //   },
// // // //   card: {
// // // //     backgroundColor: 'white',
// // // //     borderRadius: 12,
// // // //     padding: 16,
// // // //     marginBottom: 12,
// // // //     shadowColor: '#000',
// // // //     shadowOffset: { width: 0, height: 2 },
// // // //     shadowOpacity: 0.05,
// // // //     shadowRadius: 4,
// // // //     elevation: 2,
// // // //   },
// // // //   cardHeader: {
// // // //     flexDirection: 'row',
// // // //     justifyContent: 'space-between',
// // // //     alignItems: 'center',
// // // //     marginBottom: 12,
// // // //   },
// // // //   orderIdContainer: {
// // // //     flexDirection: 'row',
// // // //     alignItems: 'center',
// // // //     gap: 4,
// // // //   },
// // // //   orderId: {
// // // //     fontSize: 14,
// // // //     fontWeight: '600',
// // // //     color: '#111827',
// // // //   },
// // // //   statusBadge: {
// // // //     flexDirection: 'row',
// // // //     alignItems: 'center',
// // // //     gap: 4,
// // // //     paddingHorizontal: 10,
// // // //     paddingVertical: 4,
// // // //     borderRadius: 12,
// // // //   },
// // // //   statusText: {
// // // //     fontSize: 11,
// // // //     fontWeight: '600',
// // // //   },
// // // //   customerSection: {
// // // //     flexDirection: 'row',
// // // //     alignItems: 'center',
// // // //     marginBottom: 8,
// // // //   },
// // // //   avatar: {
// // // //     width: 40,
// // // //     height: 40,
// // // //     borderRadius: 20,
// // // //     backgroundColor: '#2563EB',
// // // //     justifyContent: 'center',
// // // //     alignItems: 'center',
// // // //     marginRight: 12,
// // // //   },
// // // //   avatarText: {
// // // //     color: 'white',
// // // //     fontSize: 16,
// // // //     fontWeight: '600',
// // // //   },
// // // //   customerInfo: {
// // // //     flex: 1,
// // // //   },
// // // //   customerName: {
// // // //     fontSize: 16,
// // // //     fontWeight: '600',
// // // //     color: '#111827',
// // // //   },
// // // //   contactRow: {
// // // //     flexDirection: 'row',
// // // //     alignItems: 'center',
// // // //     gap: 4,
// // // //     marginTop: 2,
// // // //   },
// // // //   contactText: {
// // // //     fontSize: 12,
// // // //     color: '#6B7280',
// // // //   },
// // // //   addressSection: {
// // // //     flexDirection: 'row',
// // // //     alignItems: 'flex-start',
// // // //     gap: 6,
// // // //     marginBottom: 6,
// // // //     paddingTop: 6,
// // // //     borderTopWidth: 1,
// // // //     borderTopColor: '#F3F4F6',
// // // //   },
// // // //   addressText: {
// // // //     flex: 1,
// // // //     fontSize: 13,
// // // //     color: '#4B5563',
// // // //     lineHeight: 18,
// // // //   },
// // // //   productSection: {
// // // //     flexDirection: 'row',
// // // //     alignItems: 'flex-start',
// // // //     gap: 6,
// // // //     marginBottom: 10,
// // // //   },
// // // //   productText: {
// // // //     flex: 1,
// // // //     fontSize: 13,
// // // //     color: '#4B5563',
// // // //     lineHeight: 18,
// // // //   },
// // // //   cardFooter: {
// // // //     flexDirection: 'row',
// // // //     alignItems: 'center',
// // // //     paddingTop: 10,
// // // //     borderTopWidth: 1,
// // // //     borderTopColor: '#F3F4F6',
// // // //     gap: 12,
// // // //   },
// // // //   amountContainer: {
// // // //     flex: 0.3,
// // // //   },
// // // //   amountLabel: {
// // // //     fontSize: 11,
// // // //     color: '#9CA3AF',
// // // //     marginBottom: 2,
// // // //   },
// // // //   amountValue: {
// // // //     fontSize: 18,
// // // //     fontWeight: '700',
// // // //     color: '#111827',
// // // //   },
// // // //   divider: {
// // // //     width: 1,
// // // //     height: 30,
// // // //     backgroundColor: '#E5E7EB',
// // // //   },
// // // //   paymentContainer: {
// // // //     flex: 0.7,
// // // //     gap: 4,
// // // //   },
// // // //   paymentRow: {
// // // //     flexDirection: 'row',
// // // //     alignItems: 'center',
// // // //     gap: 4,
// // // //   },
// // // //   paymentText: {
// // // //     fontSize: 12,
// // // //     color: '#6B7280',
// // // //   },
// // // //   transactionBadge: {
// // // //     alignSelf: 'flex-start',
// // // //     paddingHorizontal: 8,
// // // //     paddingVertical: 2,
// // // //     borderRadius: 4,
// // // //   },
// // // //   transactionText: {
// // // //     fontSize: 10,
// // // //     fontWeight: '600',
// // // //   },
// // // //   timestampSection: {
// // // //     flexDirection: 'row',
// // // //     alignItems: 'center',
// // // //     gap: 4,
// // // //     marginTop: 8,
// // // //     paddingTop: 8,
// // // //     borderTopWidth: 1,
// // // //     borderTopColor: '#F9FAFB',
// // // //   },
// // // //   timestampText: {
// // // //     fontSize: 11,
// // // //     color: '#9CA3AF',
// // // //   },
// // // //   emptyState: {
// // // //     flex: 1,
// // // //     justifyContent: 'center',
// // // //     alignItems: 'center',
// // // //     paddingHorizontal: 40,
// // // //   },
// // // //   emptyStateTitle: {
// // // //     fontSize: 20,
// // // //     fontWeight: '600',
// // // //     color: '#111827',
// // // //     marginTop: 16,
// // // //   },
// // // //   emptyStateSubtitle: {
// // // //     fontSize: 14,
// // // //     color: '#6B7280',
// // // //     textAlign: 'center',
// // // //     marginTop: 8,
// // // //   },
// // // //   createDeliveryButton: {
// // // //     marginTop: 20,
// // // //     backgroundColor: '#2563EB',
// // // //     paddingHorizontal: 24,
// // // //     paddingVertical: 12,
// // // //     borderRadius: 8,
// // // //   },
// // // //   createDeliveryButtonText: {
// // // //     color: 'white',
// // // //     fontSize: 14,
// // // //     fontWeight: '600',
// // // //   },
// // // //   retryButton: {
// // // //     marginTop: 16,
// // // //     backgroundColor: '#2563EB',
// // // //     paddingHorizontal: 24,
// // // //     paddingVertical: 10,
// // // //     borderRadius: 8,
// // // //   },
// // // //   retryButtonText: {
// // // //     color: 'white',
// // // //     fontSize: 14,
// // // //     fontWeight: '600',
// // // //   },
// // // //   loadingText: {
// // // //     marginTop: 12,
// // // //     fontSize: 14,
// // // //     color: '#6B7280',
// // // //   },
// // // //   errorTitle: {
// // // //     fontSize: 18,
// // // //     fontWeight: '600',
// // // //     color: '#111827',
// // // //     marginTop: 12,
// // // //   },
// // // //   errorText: {
// // // //     fontSize: 14,
// // // //     color: '#6B7280',
// // // //     textAlign: 'center',
// // // //     marginTop: 8,
// // // //   },
// // // // });
// // // // Khata-Pro/khata-mobile/app/delivery-list.tsx
// // // import React, { useCallback, useEffect, useState } from 'react';
// // // import {
// // //   ActivityIndicator,
// // //   FlatList,
// // //   ScrollView,
// // //   StyleSheet,
// // //   Text,
// // //   TouchableOpacity,
// // //   View,
// // //   RefreshControl,
// // // } from 'react-native';
// // // import { useRouter, useNavigation } from 'expo-router';
// // // import { Feather } from '@expo/vector-icons';
// // // import { useSafeAreaInsets } from 'react-native-safe-area-context';
// // // import { supabase } from '../lib/supabase';

// // // type DeliveryStatus = 'Pending' | 'Assigned' | 'In Transit' | 'Delivered' | 'Cancelled';

// // // interface Delivery {
// // //   id: number;
// // //   business_id: number;
// // //   customer_id: number;
// // //   customer_name: string;
// // //   customer_email: string | null;
// // //   customer_phone: string;
// // //   customer_address: string | null;
// // //   order_id: string;
// // //   product_description: string;
// // //   amount: number;
// // //   payment_mode: string;
// // //   transaction_type: string;
// // //   status: DeliveryStatus;
// // //   created_at: string;
// // //   updated_at: string;
// // // }

// // // const STATUS_META: Record<DeliveryStatus, { label: string; color: string; bg: string }> = {
// // //   Pending: { label: 'Pending', color: '#B91C1C', bg: '#FEE2E2' },
// // //   Assigned: { label: 'Assigned', color: '#B45309', bg: '#FEF3C7' },
// // //   'In Transit': { label: 'In Transit', color: '#1D4ED8', bg: '#DBEAFE' },
// // //   Delivered: { label: 'Delivered', color: '#15803D', bg: '#DCFCE7' },
// // //   Cancelled: { label: 'Cancelled', color: '#6B7280', bg: '#F3F4F6' },
// // // };

// // // const STATUS_FILTERS = [
// // //   { value: 'all', label: 'All' },
// // //   { value: 'Pending', label: 'Pending' },
// // //   { value: 'Assigned', label: 'Assigned' },
// // //   { value: 'In Transit', label: 'In Transit' },
// // //   { value: 'Delivered', label: 'Delivered' },
// // //   { value: 'Cancelled', label: 'Cancelled' },
// // // ];

// // // export default function DeliveryListScreen() {
// // //   const insets = useSafeAreaInsets();
// // //   const router = useRouter();
// // //   const navigation = useNavigation();
  
// // //   const [deliveries, setDeliveries] = useState<Delivery[]>([]);
// // //   const [filteredDeliveries, setFilteredDeliveries] = useState<Delivery[]>([]);
// // //   const [statusFilter, setStatusFilter] = useState<string>('all');
// // //   const [isLoading, setIsLoading] = useState(true);
// // //   const [isRefreshing, setIsRefreshing] = useState(false);
// // //   const [error, setError] = useState<string | null>(null);

// // //   const getBusinessId = useCallback(async () => {
// // //     try {
// // //       const { data, error } = await supabase
// // //         .from('businesses')
// // //         .select('id')
// // //         .limit(1)
// // //         .single();

// // //       if (error) throw error;
// // //       return data.id;
// // //     } catch (error) {
// // //       console.error('❌ Error getting business:', error);
// // //       return 1;
// // //     }
// // //   }, []);

// // //   const fetchDeliveries = useCallback(async (showLoading = true) => {
// // //     if (showLoading) setIsLoading(true);
// // //     setError(null);

// // //     try {
// // //       const bizId = await getBusinessId();

// // //       let query = supabase
// // //         .from('deliveries')
// // //         .select('*')
// // //         .eq('business_id', bizId)
// // //         .order('created_at', { ascending: false });

// // //       if (statusFilter !== 'all') {
// // //         query = query.eq('status', statusFilter);
// // //       }

// // //       const { data, error: deliveryError } = await query;

// // //       if (deliveryError) throw deliveryError;

// // //       setDeliveries(data || []);
// // //       setFilteredDeliveries(data || []);
// // //     } catch (error: any) {
// // //       console.error('❌ Error fetching deliveries:', error);
// // //       setError(error.message || 'Failed to load deliveries');
// // //     } finally {
// // //       setIsLoading(false);
// // //       setIsRefreshing(false);
// // //     }
// // //   }, [statusFilter]);

// // //   useEffect(() => {
// // //     if (statusFilter === 'all') {
// // //       setFilteredDeliveries(deliveries);
// // //     } else {
// // //       setFilteredDeliveries(
// // //         deliveries.filter((d) => d.status === statusFilter)
// // //       );
// // //     }
// // //   }, [statusFilter, deliveries]);

// // //   useEffect(() => {
// // //     fetchDeliveries(true);
// // //   }, [fetchDeliveries]);

// // //   const onRefresh = () => {
// // //     setIsRefreshing(true);
// // //     fetchDeliveries(false);
// // //   };

// // //   const getStatusCounts = () => {
// // //     const counts: Record<string, number> = { all: deliveries.length };
// // //     deliveries.forEach((d) => {
// // //       counts[d.status] = (counts[d.status] || 0) + 1;
// // //     });
// // //     return counts;
// // //   };

// // //   const statusCounts = getStatusCounts();

// // //   const goToDeliveryDetail = (deliveryId: number) => {
// // //     // @ts-ignore
// // //     navigation.navigate('delivery-detail', { id: deliveryId });
// // //   };

// // //   // ✅ REMOVED: goToCreateDelivery function

// // //   // Render table row
// // //   const renderTableRow = ({ item }: { item: Delivery }) => {
// // //     const statusMeta = STATUS_META[item.status] || STATUS_META.Pending;

// // //     return (
// // //       <TouchableOpacity
// // //         style={styles.tableRow}
// // //         onPress={() => goToDeliveryDetail(item.id)}
// // //       >
// // //         <View style={[styles.rowCell, styles.rowNumberCell]}>
// // //           <Text style={styles.rowNumberText}>#{item.id}</Text>
// // //         </View>

// // //         <View style={[styles.rowCell, styles.customerCell]}>
// // //           <Text style={styles.customerNameText} numberOfLines={1}>
// // //             {item.customer_name}
// // //           </Text>
// // //         </View>

// // //         <View style={[styles.rowCell, styles.phoneCell]}>
// // //           <Text style={styles.phoneText} numberOfLines={1}>
// // //             {item.customer_phone}
// // //           </Text>
// // //         </View>

// // //         <View style={[styles.rowCell, styles.orderCell]}>
// // //           <Text style={styles.orderText} numberOfLines={1}>
// // //             {item.order_id}
// // //           </Text>
// // //         </View>

// // //         <View style={[styles.rowCell, styles.amountCell]}>
// // //           <Text style={styles.amountText}>₹{item.amount.toFixed(2)}</Text>
// // //         </View>

// // //         <View style={[styles.rowCell, styles.statusCell]}>
// // //           <View style={[styles.statusBadge, { backgroundColor: statusMeta.bg }]}>
// // //             <Text style={[styles.statusText, { color: statusMeta.color }]}>
// // //               {statusMeta.label}
// // //             </Text>
// // //           </View>
// // //         </View>

// // //         <View style={[styles.rowCell, styles.paymentCell]}>
// // //           <Text style={styles.paymentText}>
// // //             {item.payment_mode === 'online' ? 'Online' : 'Cash'}
// // //           </Text>
// // //         </View>

// // //         <View style={[styles.rowCell, styles.transactionCell]}>
// // //           <Text style={[
// // //             styles.transactionText,
// // //             { color: item.transaction_type === 'you_got' ? '#15803D' : '#B91C1C' }
// // //           ]}>
// // //             {item.transaction_type === 'you_got' ? 'Received' : 'To Pay'}
// // //           </Text>
// // //         </View>

// // //         <View style={[styles.rowCell, styles.dateCell]}>
// // //           <Text style={styles.dateText} numberOfLines={1}>
// // //             {new Date(item.created_at).toLocaleDateString()}
// // //           </Text>
// // //         </View>
// // //       </TouchableOpacity>
// // //     );
// // //   };

// // //   // Table Header
// // //   const TableHeader = () => (
// // //     <View style={styles.tableHeader}>
// // //       <Text style={[styles.headerText, styles.rowNumberCell]}>#</Text>
// // //       <Text style={[styles.headerText, styles.customerCell]}>Customer</Text>
// // //       <Text style={[styles.headerText, styles.phoneCell]}>Phone</Text>
// // //       <Text style={[styles.headerText, styles.orderCell]}>Order ID</Text>
// // //       <Text style={[styles.headerText, styles.amountCell]}>Amount</Text>
// // //       <Text style={[styles.headerText, styles.statusCell]}>Status</Text>
// // //       <Text style={[styles.headerText, styles.paymentCell]}>Payment</Text>
// // //       <Text style={[styles.headerText, styles.transactionCell]}>Type</Text>
// // //       <Text style={[styles.headerText, styles.dateCell]}>Date</Text>
// // //     </View>
// // //   );

// // //   if (isLoading) {
// // //     return (
// // //       <View style={styles.centeredContainer}>
// // //         <ActivityIndicator size="large" color="#2563EB" />
// // //         <Text style={styles.loadingText}>Loading deliveries...</Text>
// // //       </View>
// // //     );
// // //   }

// // //   if (error) {
// // //     return (
// // //       <View style={styles.centeredContainer}>
// // //         <Feather name="alert-circle" size={48} color="#EF4444" />
// // //         <Text style={styles.errorTitle}>Something went wrong</Text>
// // //         <Text style={styles.errorText}>{error}</Text>
// // //         <TouchableOpacity style={styles.retryButton} onPress={() => fetchDeliveries(true)}>
// // //           <Text style={styles.retryButtonText}>Retry</Text>
// // //         </TouchableOpacity>
// // //       </View>
// // //     );
// // //   }

// // //   return (
// // //     <View style={[styles.container, { paddingTop: insets.top }]}>
// // //       {/* Header - WITHOUT Add Button */}
// // //       <View style={styles.header}>
// // //         <View>
// // //           <Text style={styles.headerTitle}>📋 Deliveries</Text>
// // //           <Text style={styles.headerSubtitle}>
// // //             {deliveries.length} delivery{deliveries.length !== 1 ? 'ies' : ''} total
// // //           </Text>
// // //         </View>
// // //         {/* ✅ REMOVED: Add Button */}
// // //       </View>

// // //       {/* Status Filter */}
// // //       <View style={styles.filterContainer}>
// // //         <ScrollView 
// // //           horizontal 
// // //           showsHorizontalScrollIndicator={false}
// // //           contentContainerStyle={styles.filterScrollContent}
// // //         >
// // //           {STATUS_FILTERS.map((filter) => (
// // //             <TouchableOpacity
// // //               key={filter.value}
// // //               style={[
// // //                 styles.filterChip,
// // //                 statusFilter === filter.value && styles.filterChipActive,
// // //               ]}
// // //               onPress={() => setStatusFilter(filter.value)}
// // //             >
// // //               <Text
// // //                 style={[
// // //                   styles.filterChipText,
// // //                   statusFilter === filter.value && styles.filterChipTextActive,
// // //                 ]}
// // //               >
// // //                 {filter.label}
// // //                 {filter.value !== 'all' && (
// // //                   <Text style={styles.filterCount}>
// // //                     {' '}({statusCounts[filter.value] || 0})
// // //                   </Text>
// // //                 )}
// // //               </Text>
// // //             </TouchableOpacity>
// // //           ))}
// // //         </ScrollView>
// // //       </View>

// // //       {/* Deliveries Table */}
// // //       {filteredDeliveries.length === 0 ? (
// // //         <View style={styles.emptyState}>
// // //           <Feather name="truck" size={64} color="#D1D5DB" />
// // //           <Text style={styles.emptyStateTitle}>
// // //             {statusFilter === 'all' ? 'No deliveries yet' : `No ${statusFilter} deliveries`}
// // //           </Text>
// // //           <Text style={styles.emptyStateSubtitle}>
// // //             {statusFilter === 'all' 
// // //               ? 'Deliveries created from customer orders will show up here.' 
// // //               : `No deliveries with "${statusFilter}" status`}
// // //           </Text>
// // //           {/* ✅ REMOVED: Create First Delivery Button */}
// // //         </View>
// // //       ) : (
// // //         <FlatList
// // //           data={filteredDeliveries}
// // //           keyExtractor={(item) => `delivery-${item.id}`}
// // //           ListHeaderComponent={TableHeader}
// // //           renderItem={renderTableRow}
// // //           contentContainerStyle={styles.listContent}
// // //           refreshControl={
// // //             <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
// // //           }
// // //           stickyHeaderIndices={[0]}
// // //           showsVerticalScrollIndicator={false}
// // //         />
// // //       )}
// // //     </View>
// // //   );
// // // }

// // // const styles = StyleSheet.create({
// // //   container: {
// // //     flex: 1,
// // //     backgroundColor: '#F5F5F5',
// // //   },
// // //   centeredContainer: {
// // //     flex: 1,
// // //     justifyContent: 'center',
// // //     alignItems: 'center',
// // //     paddingHorizontal: 20,
// // //   },
// // //   header: {
// // //     flexDirection: 'row',
// // //     justifyContent: 'space-between',
// // //     alignItems: 'center',
// // //     paddingHorizontal: 16,
// // //     paddingVertical: 16,
// // //     backgroundColor: 'white',
// // //     borderBottomWidth: 1,
// // //     borderBottomColor: '#E5E7EB',
// // //   },
// // //   headerTitle: {
// // //     fontSize: 22,
// // //     fontWeight: '700',
// // //     color: '#111827',
// // //   },
// // //   headerSubtitle: {
// // //     fontSize: 13,
// // //     color: '#6B7280',
// // //     marginTop: 2,
// // //   },
// // //   filterContainer: {
// // //     backgroundColor: 'white',
// // //     paddingVertical: 12,
// // //     borderBottomWidth: 1,
// // //     borderBottomColor: '#E5E7EB',
// // //   },
// // //   filterScrollContent: {
// // //     paddingHorizontal: 16,
// // //     gap: 8,
// // //   },
// // //   filterChip: {
// // //     paddingHorizontal: 16,
// // //     paddingVertical: 8,
// // //     borderRadius: 20,
// // //     backgroundColor: '#F3F4F6',
// // //     borderWidth: 1,
// // //     borderColor: 'transparent',
// // //   },
// // //   filterChipActive: {
// // //     backgroundColor: '#DBEAFE',
// // //     borderColor: '#2563EB',
// // //   },
// // //   filterChipText: {
// // //     fontSize: 13,
// // //     color: '#6B7280',
// // //     fontWeight: '500',
// // //   },
// // //   filterChipTextActive: {
// // //     color: '#2563EB',
// // //   },
// // //   filterCount: {
// // //     fontSize: 11,
// // //     color: '#9CA3AF',
// // //   },
// // //   listContent: {
// // //     paddingBottom: 20,
// // //   },
// // //   tableHeader: {
// // //     flexDirection: 'row',
// // //     backgroundColor: '#E5E7EB',
// // //     paddingVertical: 12,
// // //     paddingHorizontal: 8,
// // //     borderBottomWidth: 2,
// // //     borderBottomColor: '#D1D5DB',
// // //   },
// // //   headerText: {
// // //     fontSize: 11,
// // //     fontWeight: '700',
// // //     color: '#374151',
// // //     textTransform: 'uppercase',
// // //   },
// // //   tableRow: {
// // //     flexDirection: 'row',
// // //     backgroundColor: 'white',
// // //     paddingVertical: 12,
// // //     paddingHorizontal: 8,
// // //     borderBottomWidth: 1,
// // //     borderBottomColor: '#F3F4F6',
// // //     alignItems: 'center',
// // //   },
// // //   rowCell: {
// // //     paddingHorizontal: 4,
// // //   },
// // //   rowNumberCell: {
// // //     width: 35,
// // //     minWidth: 35,
// // //   },
// // //   rowNumberText: {
// // //     fontSize: 12,
// // //     color: '#6B7280',
// // //     fontWeight: '500',
// // //   },
// // //   customerCell: {
// // //     width: 100,
// // //     minWidth: 100,
// // //   },
// // //   customerNameText: {
// // //     fontSize: 13,
// // //     color: '#111827',
// // //     fontWeight: '500',
// // //   },
// // //   phoneCell: {
// // //     width: 90,
// // //     minWidth: 90,
// // //   },
// // //   phoneText: {
// // //     fontSize: 12,
// // //     color: '#4B5563',
// // //   },
// // //   orderCell: {
// // //     width: 80,
// // //     minWidth: 80,
// // //   },
// // //   orderText: {
// // //     fontSize: 12,
// // //     color: '#2563EB',
// // //     fontWeight: '500',
// // //   },
// // //   amountCell: {
// // //     width: 70,
// // //     minWidth: 70,
// // //   },
// // //   amountText: {
// // //     fontSize: 13,
// // //     color: '#111827',
// // //     fontWeight: '600',
// // //   },
// // //   statusCell: {
// // //     width: 80,
// // //     minWidth: 80,
// // //   },
// // //   statusBadge: {
// // //     paddingHorizontal: 8,
// // //     paddingVertical: 2,
// // //     borderRadius: 4,
// // //     alignSelf: 'flex-start',
// // //   },
// // //   statusText: {
// // //     fontSize: 10,
// // //     fontWeight: '600',
// // //   },
// // //   paymentCell: {
// // //     width: 60,
// // //     minWidth: 60,
// // //   },
// // //   paymentText: {
// // //     fontSize: 11,
// // //     color: '#4B5563',
// // //   },
// // //   transactionCell: {
// // //     width: 65,
// // //     minWidth: 65,
// // //   },
// // //   transactionText: {
// // //     fontSize: 10,
// // //     fontWeight: '600',
// // //   },
// // //   dateCell: {
// // //     width: 75,
// // //     minWidth: 75,
// // //   },
// // //   dateText: {
// // //     fontSize: 10,
// // //     color: '#6B7280',
// // //   },
// // //   emptyState: {
// // //     flex: 1,
// // //     justifyContent: 'center',
// // //     alignItems: 'center',
// // //     paddingHorizontal: 40,
// // //   },
// // //   emptyStateTitle: {
// // //     fontSize: 20,
// // //     fontWeight: '600',
// // //     color: '#111827',
// // //     marginTop: 16,
// // //   },
// // //   emptyStateSubtitle: {
// // //     fontSize: 14,
// // //     color: '#6B7280',
// // //     textAlign: 'center',
// // //     marginTop: 8,
// // //   },
// // //   retryButton: {
// // //     marginTop: 16,
// // //     backgroundColor: '#2563EB',
// // //     paddingHorizontal: 24,
// // //     paddingVertical: 10,
// // //     borderRadius: 8,
// // //   },
// // //   retryButtonText: {
// // //     color: 'white',
// // //     fontSize: 14,
// // //     fontWeight: '600',
// // //   },
// // //   loadingText: {
// // //     marginTop: 12,
// // //     fontSize: 14,
// // //     color: '#6B7280',
// // //   },
// // //   errorTitle: {
// // //     fontSize: 18,
// // //     fontWeight: '600',
// // //     color: '#111827',
// // //     marginTop: 12,
// // //   },
// // //   errorText: {
// // //     fontSize: 14,
// // //     color: '#6B7280',
// // //     textAlign: 'center',
// // //     marginTop: 8,
// // //   },
// // // });
// // // Khata-Pro/khata-mobile/app/delivery-list.tsx
// // // import React, { useCallback, useEffect, useState } from 'react';
// // // import {
// // //   ActivityIndicator,
// // //   FlatList,
// // //   ScrollView,
// // //   StyleSheet,
// // //   Text,
// // //   TouchableOpacity,
// // //   View,
// // //   RefreshControl,
// // // } from 'react-native';
// // // import { useRouter, useNavigation } from 'expo-router';
// // // import { Feather } from '@expo/vector-icons';
// // // import { useSafeAreaInsets } from 'react-native-safe-area-context';
// // // import { supabase } from '../lib/supabase';

// // // type DeliveryStatus = 'Pending' | 'Assigned' | 'In Transit' | 'Delivered' | 'Cancelled';

// // // interface Delivery {
// // //   id: number;
// // //   business_id: number;
// // //   customer_id: number;
// // //   customer_name: string;
// // //   customer_email: string | null;
// // //   customer_phone: string;
// // //   customer_address: string | null;
// // //   order_id: string;
// // //   product_description: string;
// // //   amount: number;
// // //   payment_mode: string;
// // //   transaction_type: string;
// // //   status: DeliveryStatus;
// // //   created_at: string;
// // //   updated_at: string;
// // // }

// // // const STATUS_META: Record<DeliveryStatus, { label: string; color: string; bg: string; icon: string }> = {
// // //   Pending: { label: 'Pending', color: '#B91C1C', bg: '#FEE2E2', icon: 'clock' },
// // //   Assigned: { label: 'Assigned', color: '#B45309', bg: '#FEF3C7', icon: 'user-check' },
// // //   'In Transit': { label: 'In Transit', color: '#1D4ED8', bg: '#DBEAFE', icon: 'truck' },
// // //   Delivered: { label: 'Delivered', color: '#15803D', bg: '#DCFCE7', icon: 'check-circle' },
// // //   Cancelled: { label: 'Cancelled', color: '#6B7280', bg: '#F3F4F6', icon: 'x-circle' },
// // // };

// // // const STATUS_FILTERS = [
// // //   { value: 'all', label: 'All' },
// // //   { value: 'Pending', label: 'Pending' },
// // //   { value: 'Assigned', label: 'Assigned' },
// // //   { value: 'In Transit', label: 'In Transit' },
// // //   { value: 'Delivered', label: 'Delivered' },
// // //   { value: 'Cancelled', label: 'Cancelled' },
// // // ];

// // // export default function DeliveryListScreen() {
// // //   const insets = useSafeAreaInsets();
// // //   const router = useRouter();
// // //   const navigation = useNavigation();
  
// // //   const [deliveries, setDeliveries] = useState<Delivery[]>([]);
// // //   const [filteredDeliveries, setFilteredDeliveries] = useState<Delivery[]>([]);
// // //   const [statusFilter, setStatusFilter] = useState<string>('all');
// // //   const [isLoading, setIsLoading] = useState(true);
// // //   const [isRefreshing, setIsRefreshing] = useState(false);
// // //   const [error, setError] = useState<string | null>(null);

// // //   const getBusinessId = useCallback(async () => {
// // //     try {
// // //       const { data, error } = await supabase
// // //         .from('businesses')
// // //         .select('id')
// // //         .limit(1)
// // //         .single();

// // //       if (error) throw error;
// // //       return data.id;
// // //     } catch (error) {
// // //       console.error('❌ Error getting business:', error);
// // //       return 1;
// // //     }
// // //   }, []);

// // //   const fetchDeliveries = useCallback(async (showLoading = true) => {
// // //     if (showLoading) setIsLoading(true);
// // //     setError(null);

// // //     try {
// // //       const bizId = await getBusinessId();

// // //       let query = supabase
// // //         .from('deliveries')
// // //         .select('*')
// // //         .eq('business_id', bizId)
// // //         .order('created_at', { ascending: false });

// // //       if (statusFilter !== 'all') {
// // //         query = query.eq('status', statusFilter);
// // //       }

// // //       const { data, error: deliveryError } = await query;

// // //       if (deliveryError) throw deliveryError;

// // //       setDeliveries(data || []);
// // //       setFilteredDeliveries(data || []);
// // //     } catch (error: any) {
// // //       console.error('❌ Error fetching deliveries:', error);
// // //       setError(error.message || 'Failed to load deliveries');
// // //     } finally {
// // //       setIsLoading(false);
// // //       setIsRefreshing(false);
// // //     }
// // //   }, [statusFilter]);

// // //   useEffect(() => {
// // //     if (statusFilter === 'all') {
// // //       setFilteredDeliveries(deliveries);
// // //     } else {
// // //       setFilteredDeliveries(
// // //         deliveries.filter((d) => d.status === statusFilter)
// // //       );
// // //     }
// // //   }, [statusFilter, deliveries]);

// // //   useEffect(() => {
// // //     fetchDeliveries(true);
// // //   }, [fetchDeliveries]);

// // //   const onRefresh = () => {
// // //     setIsRefreshing(true);
// // //     fetchDeliveries(false);
// // //   };

// // //   const getStatusCounts = () => {
// // //     const counts: Record<string, number> = { all: deliveries.length };
// // //     deliveries.forEach((d) => {
// // //       counts[d.status] = (counts[d.status] || 0) + 1;
// // //     });
// // //     return counts;
// // //   };

// // //   const statusCounts = getStatusCounts();

// // //   const goToDeliveryDetail = (deliveryId: number) => {
// // //     // @ts-ignore
// // //     navigation.navigate('delivery-detail', { id: deliveryId });
// // //   };

// // //   // ✅ RENDER DELIVERY CARD WITH ALL DETAILS
// // //   const renderDeliveryCard = ({ item }: { item: Delivery }) => {
// // //     const statusMeta = STATUS_META[item.status] || STATUS_META.Pending;

// // //     return (
// // //       <TouchableOpacity
// // //         style={styles.card}
// // //         onPress={() => goToDeliveryDetail(item.id)}
// // //         activeOpacity={0.7}
// // //       >
// // //         {/* Header: Order ID and Status */}
// // //         <View style={styles.cardHeader}>
// // //           <View style={styles.orderIdContainer}>
// // //             <Feather name="hash" size={14} color="#666" />
// // //             <Text style={styles.orderId}>Order #{item.order_id}</Text>
// // //           </View>
// // //           <View style={[styles.statusBadge, { backgroundColor: statusMeta.bg }]}>
// // //             <Feather name={statusMeta.icon as any} size={12} color={statusMeta.color} />
// // //             <Text style={[styles.statusText, { color: statusMeta.color }]}>
// // //               {statusMeta.label}
// // //             </Text>
// // //           </View>
// // //         </View>

// // //         {/* Customer Info */}
// // //         <View style={styles.customerSection}>
// // //           <View style={styles.avatar}>
// // //             <Text style={styles.avatarText}>
// // //               {item.customer_name.charAt(0).toUpperCase()}
// // //             </Text>
// // //           </View>
// // //           <View style={styles.customerInfo}>
// // //             <Text style={styles.customerName}>{item.customer_name}</Text>
// // //             <View style={styles.contactRow}>
// // //               <Feather name="phone" size={12} color="#666" />
// // //               <Text style={styles.contactText}>{item.customer_phone}</Text>
// // //             </View>
// // //             {item.customer_email && (
// // //               <View style={styles.contactRow}>
// // //                 <Feather name="mail" size={12} color="#666" />
// // //                 <Text style={styles.contactText}>{item.customer_email}</Text>
// // //               </View>
// // //             )}
// // //           </View>
// // //         </View>

// // //         {/* Delivery Address */}
// // //         {item.customer_address && (
// // //           <View style={styles.addressSection}>
// // //             <Feather name="map-pin" size={14} color="#666" />
// // //             <Text style={styles.addressText} numberOfLines={2}>
// // //               {item.customer_address}
// // //             </Text>
// // //           </View>
// // //         )}

// // //         {/* Product Description */}
// // //         <View style={styles.productSection}>
// // //           <Feather name="package" size={14} color="#666" />
// // //           <Text style={styles.productText} numberOfLines={2}>
// // //             {item.product_description}
// // //           </Text>
// // //         </View>

// // //         {/* Footer: Amount, Payment, Transaction */}
// // //         <View style={styles.cardFooter}>
// // //           <View style={styles.amountContainer}>
// // //             <Text style={styles.amountLabel}>Amount</Text>
// // //             <Text style={styles.amountValue}>₹{item.amount.toFixed(2)}</Text>
// // //           </View>

// // //           <View style={styles.divider} />

// // //           <View style={styles.paymentContainer}>
// // //             <View style={styles.paymentRow}>
// // //               <Feather 
// // //                 name={item.payment_mode === 'online' ? 'credit-card' : 'dollar-sign'} 
// // //                 size={12} 
// // //                 color="#666" 
// // //               />
// // //               <Text style={styles.paymentText}>
// // //                 {item.payment_mode === 'online' ? 'Online' : 'Cash'}
// // //               </Text>
// // //             </View>
// // //             <View style={[styles.transactionBadge, {
// // //               backgroundColor: item.transaction_type === 'you_got' ? '#DCFCE7' : '#FEE2E2'
// // //             }]}>
// // //               <Text style={[styles.transactionText, {
// // //                 color: item.transaction_type === 'you_got' ? '#15803D' : '#B91C1C'
// // //               }]}>
// // //                 {item.transaction_type === 'you_got' ? 'Received' : 'To Pay'}
// // //               </Text>
// // //             </View>
// // //           </View>
// // //         </View>

// // //         {/* Timestamp */}
// // //         <View style={styles.timestampSection}>
// // //           <Feather name="clock" size={12} color="#999" />
// // //           <Text style={styles.timestampText}>
// // //             {new Date(item.created_at).toLocaleString()}
// // //           </Text>
// // //         </View>
// // //       </TouchableOpacity>
// // //     );
// // //   };

// // //   if (isLoading) {
// // //     return (
// // //       <View style={styles.centeredContainer}>
// // //         <ActivityIndicator size="large" color="#2563EB" />
// // //         <Text style={styles.loadingText}>Loading deliveries...</Text>
// // //       </View>
// // //     );
// // //   }

// // //   if (error) {
// // //     return (
// // //       <View style={styles.centeredContainer}>
// // //         <Feather name="alert-circle" size={48} color="#EF4444" />
// // //         <Text style={styles.errorTitle}>Something went wrong</Text>
// // //         <Text style={styles.errorText}>{error}</Text>
// // //         <TouchableOpacity style={styles.retryButton} onPress={() => fetchDeliveries(true)}>
// // //           <Text style={styles.retryButtonText}>Retry</Text>
// // //         </TouchableOpacity>
// // //       </View>
// // //     );
// // //   }

// // //   return (
// // //     <View style={[styles.container, { paddingTop: insets.top }]}>
// // //       {/* Header */}
// // //       <View style={styles.header}>
// // //         <View>
// // //           <Text style={styles.headerTitle}>🚚 Deliveries</Text>
// // //           <Text style={styles.headerSubtitle}>
// // //             {deliveries.length} delivery{deliveries.length !== 1 ? 'ies' : ''} total
// // //           </Text>
// // //         </View>
// // //       </View>

// // //       {/* Status Filter */}
// // //       <View style={styles.filterContainer}>
// // //         <ScrollView 
// // //           horizontal 
// // //           showsHorizontalScrollIndicator={false}
// // //           contentContainerStyle={styles.filterScrollContent}
// // //         >
// // //           {STATUS_FILTERS.map((filter) => (
// // //             <TouchableOpacity
// // //               key={filter.value}
// // //               style={[
// // //                 styles.filterChip,
// // //                 statusFilter === filter.value && styles.filterChipActive,
// // //               ]}
// // //               onPress={() => setStatusFilter(filter.value)}
// // //             >
// // //               <Text
// // //                 style={[
// // //                   styles.filterChipText,
// // //                   statusFilter === filter.value && styles.filterChipTextActive,
// // //                 ]}
// // //               >
// // //                 {filter.label}
// // //                 {filter.value !== 'all' && (
// // //                   <Text style={styles.filterCount}>
// // //                     {' '}({statusCounts[filter.value] || 0})
// // //                   </Text>
// // //                 )}
// // //               </Text>
// // //             </TouchableOpacity>
// // //           ))}
// // //         </ScrollView>
// // //       </View>

// // //       {/* Deliveries List - Cards with all data */}
// // //       {filteredDeliveries.length === 0 ? (
// // //         <View style={styles.emptyState}>
// // //           <Feather name="truck" size={64} color="#D1D5DB" />
// // //           <Text style={styles.emptyStateTitle}>
// // //             {statusFilter === 'all' ? 'No deliveries yet' : `No ${statusFilter} deliveries`}
// // //           </Text>
// // //           <Text style={styles.emptyStateSubtitle}>
// // //             {statusFilter === 'all' 
// // //               ? 'Deliveries created from customer orders will show up here.' 
// // //               : `No deliveries with "${statusFilter}" status`}
// // //           </Text>
// // //         </View>
// // //       ) : (
// // //         <FlatList
// // //           data={filteredDeliveries}
// // //           keyExtractor={(item) => `delivery-${item.id}`}
// // //           renderItem={renderDeliveryCard}
// // //           contentContainerStyle={styles.listContent}
// // //           refreshControl={
// // //             <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
// // //           }
// // //           showsVerticalScrollIndicator={false}
// // //         />
// // //       )}
// // //     </View>
// // //   );
// // // }

// // // const styles = StyleSheet.create({
// // //   container: {
// // //     flex: 1,
// // //     backgroundColor: '#F5F5F5',
// // //   },
// // //   centeredContainer: {
// // //     flex: 1,
// // //     justifyContent: 'center',
// // //     alignItems: 'center',
// // //     paddingHorizontal: 20,
// // //   },
// // //   header: {
// // //     flexDirection: 'row',
// // //     justifyContent: 'space-between',
// // //     alignItems: 'center',
// // //     paddingHorizontal: 16,
// // //     paddingVertical: 16,
// // //     backgroundColor: 'white',
// // //     borderBottomWidth: 1,
// // //     borderBottomColor: '#E5E7EB',
// // //   },
// // //   headerTitle: {
// // //     fontSize: 22,
// // //     fontWeight: '700',
// // //     color: '#111827',
// // //   },
// // //   headerSubtitle: {
// // //     fontSize: 13,
// // //     color: '#6B7280',
// // //     marginTop: 2,
// // //   },
// // //   filterContainer: {
// // //     backgroundColor: 'white',
// // //     paddingVertical: 12,
// // //     borderBottomWidth: 1,
// // //     borderBottomColor: '#E5E7EB',
// // //   },
// // //   filterScrollContent: {
// // //     paddingHorizontal: 16,
// // //     gap: 8,
// // //   },
// // //   filterChip: {
// // //     paddingHorizontal: 16,
// // //     paddingVertical: 8,
// // //     borderRadius: 20,
// // //     backgroundColor: '#F3F4F6',
// // //     borderWidth: 1,
// // //     borderColor: 'transparent',
// // //   },
// // //   filterChipActive: {
// // //     backgroundColor: '#DBEAFE',
// // //     borderColor: '#2563EB',
// // //   },
// // //   filterChipText: {
// // //     fontSize: 13,
// // //     color: '#6B7280',
// // //     fontWeight: '500',
// // //   },
// // //   filterChipTextActive: {
// // //     color: '#2563EB',
// // //   },
// // //   filterCount: {
// // //     fontSize: 11,
// // //     color: '#9CA3AF',
// // //   },
// // //   listContent: {
// // //     padding: 16,
// // //     paddingBottom: 100,
// // //   },
// // //   // CARD STYLES
// // //   card: {
// // //     backgroundColor: 'white',
// // //     borderRadius: 12,
// // //     padding: 16,
// // //     marginBottom: 12,
// // //     shadowColor: '#000',
// // //     shadowOffset: { width: 0, height: 2 },
// // //     shadowOpacity: 0.05,
// // //     shadowRadius: 4,
// // //     elevation: 2,
// // //   },
// // //   cardHeader: {
// // //     flexDirection: 'row',
// // //     justifyContent: 'space-between',
// // //     alignItems: 'center',
// // //     marginBottom: 12,
// // //   },
// // //   orderIdContainer: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     gap: 4,
// // //   },
// // //   orderId: {
// // //     fontSize: 14,
// // //     fontWeight: '600',
// // //     color: '#111827',
// // //   },
// // //   statusBadge: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     gap: 4,
// // //     paddingHorizontal: 10,
// // //     paddingVertical: 4,
// // //     borderRadius: 12,
// // //   },
// // //   statusText: {
// // //     fontSize: 11,
// // //     fontWeight: '600',
// // //   },
// // //   customerSection: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     marginBottom: 8,
// // //   },
// // //   avatar: {
// // //     width: 40,
// // //     height: 40,
// // //     borderRadius: 20,
// // //     backgroundColor: '#2563EB',
// // //     justifyContent: 'center',
// // //     alignItems: 'center',
// // //     marginRight: 12,
// // //   },
// // //   avatarText: {
// // //     color: 'white',
// // //     fontSize: 16,
// // //     fontWeight: '600',
// // //   },
// // //   customerInfo: {
// // //     flex: 1,
// // //   },
// // //   customerName: {
// // //     fontSize: 16,
// // //     fontWeight: '600',
// // //     color: '#111827',
// // //   },
// // //   contactRow: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     gap: 4,
// // //     marginTop: 2,
// // //   },
// // //   contactText: {
// // //     fontSize: 12,
// // //     color: '#6B7280',
// // //   },
// // //   addressSection: {
// // //     flexDirection: 'row',
// // //     alignItems: 'flex-start',
// // //     gap: 6,
// // //     marginBottom: 6,
// // //     paddingTop: 6,
// // //     borderTopWidth: 1,
// // //     borderTopColor: '#F3F4F6',
// // //   },
// // //   addressText: {
// // //     flex: 1,
// // //     fontSize: 13,
// // //     color: '#4B5563',
// // //     lineHeight: 18,
// // //   },
// // //   productSection: {
// // //     flexDirection: 'row',
// // //     alignItems: 'flex-start',
// // //     gap: 6,
// // //     marginBottom: 10,
// // //   },
// // //   productText: {
// // //     flex: 1,
// // //     fontSize: 13,
// // //     color: '#4B5563',
// // //     lineHeight: 18,
// // //   },
// // //   cardFooter: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     paddingTop: 10,
// // //     borderTopWidth: 1,
// // //     borderTopColor: '#F3F4F6',
// // //     gap: 12,
// // //   },
// // //   amountContainer: {
// // //     flex: 0.3,
// // //   },
// // //   amountLabel: {
// // //     fontSize: 11,
// // //     color: '#9CA3AF',
// // //     marginBottom: 2,
// // //   },
// // //   amountValue: {
// // //     fontSize: 18,
// // //     fontWeight: '700',
// // //     color: '#111827',
// // //   },
// // //   divider: {
// // //     width: 1,
// // //     height: 30,
// // //     backgroundColor: '#E5E7EB',
// // //   },
// // //   paymentContainer: {
// // //     flex: 0.7,
// // //     gap: 4,
// // //   },
// // //   paymentRow: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     gap: 4,
// // //   },
// // //   paymentText: {
// // //     fontSize: 12,
// // //     color: '#6B7280',
// // //   },
// // //   transactionBadge: {
// // //     alignSelf: 'flex-start',
// // //     paddingHorizontal: 8,
// // //     paddingVertical: 2,
// // //     borderRadius: 4,
// // //   },
// // //   transactionText: {
// // //     fontSize: 10,
// // //     fontWeight: '600',
// // //   },
// // //   timestampSection: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     gap: 4,
// // //     marginTop: 8,
// // //     paddingTop: 8,
// // //     borderTopWidth: 1,
// // //     borderTopColor: '#F9FAFB',
// // //   },
// // //   timestampText: {
// // //     fontSize: 11,
// // //     color: '#9CA3AF',
// // //   },
// // //   emptyState: {
// // //     flex: 1,
// // //     justifyContent: 'center',
// // //     alignItems: 'center',
// // //     paddingHorizontal: 40,
// // //   },
// // //   emptyStateTitle: {
// // //     fontSize: 20,
// // //     fontWeight: '600',
// // //     color: '#111827',
// // //     marginTop: 16,
// // //   },
// // //   emptyStateSubtitle: {
// // //     fontSize: 14,
// // //     color: '#6B7280',
// // //     textAlign: 'center',
// // //     marginTop: 8,
// // //   },
// // //   retryButton: {
// // //     marginTop: 16,
// // //     backgroundColor: '#2563EB',
// // //     paddingHorizontal: 24,
// // //     paddingVertical: 10,
// // //     borderRadius: 8,
// // //   },
// // //   retryButtonText: {
// // //     color: 'white',
// // //     fontSize: 14,
// // //     fontWeight: '600',
// // //   },
// // //   loadingText: {
// // //     marginTop: 12,
// // //     fontSize: 14,
// // //     color: '#6B7280',
// // //   },
// // //   errorTitle: {
// // //     fontSize: 18,
// // //     fontWeight: '600',
// // //     color: '#111827',
// // //     marginTop: 12,
// // //   },
// // //   errorText: {
// // //     fontSize: 14,
// // //     color: '#6B7280',
// // //     textAlign: 'center',
// // //     marginTop: 8,
// // //   },
// // // });
// // Khata-Pro/khata-mobile/app/delivery-list.tsx
// import React, { useCallback, useEffect, useState } from 'react';
// import {
//   ActivityIndicator,
//   FlatList,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
//   RefreshControl,
//   Alert,
// } from 'react-native';
// import { useRouter, useNavigation } from 'expo-router';
// import { Feather } from '@expo/vector-icons';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import { supabase } from '../lib/supabase';

// type DeliveryStatus = 'Pending' | 'Assigned' | 'In Transit' | 'Delivered' | 'Cancelled';

// interface Delivery {
//   id: number;
//   business_id: number;
//   customer_id: number;
//   customer_name: string;
//   customer_email: string | null;
//   customer_phone: string;
//   customer_address: string | null;
//   order_id: string;
//   product_description: string;
//   amount: number;
//   payment_mode: string;
//   transaction_type: string;
//   status: DeliveryStatus;
//   created_at: string;
//   updated_at: string;
// }

// const STATUS_META: Record<DeliveryStatus, { label: string; color: string; bg: string; icon: string }> = {
//   Pending: { label: 'Pending', color: '#B91C1C', bg: '#FEE2E2', icon: 'clock' },
//   Assigned: { label: 'Assigned', color: '#B45309', bg: '#FEF3C7', icon: 'user-check' },
//   'In Transit': { label: 'In Transit', color: '#1D4ED8', bg: '#DBEAFE', icon: 'truck' },
//   Delivered: { label: 'Delivered', color: '#15803D', bg: '#DCFCE7', icon: 'check-circle' },
//   Cancelled: { label: 'Cancelled', color: '#6B7280', bg: '#F3F4F6', icon: 'x-circle' },
// };

// const STATUS_FILTERS = [
//   { value: 'all', label: 'All' },
//   { value: 'Pending', label: 'Pending' },
//   { value: 'Assigned', label: 'Assigned' },
//   { value: 'In Transit', label: 'In Transit' },
//   { value: 'Delivered', label: 'Delivered' },
//   { value: 'Cancelled', label: 'Cancelled' },
// ];

// export default function DeliveryListScreen() {
//   const insets = useSafeAreaInsets();
//   const router = useRouter();
//   const navigation = useNavigation();
  
//   const [deliveries, setDeliveries] = useState<Delivery[]>([]);
//   const [filteredDeliveries, setFilteredDeliveries] = useState<Delivery[]>([]);
//   const [statusFilter, setStatusFilter] = useState<string>('all');
//   const [isLoading, setIsLoading] = useState(true);
//   const [isRefreshing, setIsRefreshing] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   // Get business ID
//   // const getBusinessId = useCallback(async () => {
//   //   try {
//   //     console.log('🔍 Getting business ID...');
//   //     const { data, error } = await supabase
//   //       .from('businesses')
//   //       .select('id')
//   //       .limit(1)
//   //       .single();

//   //     if (error) {
//   //       console.error('❌ Business error:', error);
//   //       return 1; // fallback to default
//   //     }
//   //     console.log('✅ Business ID:', data?.id);
//   //     return data?.id || 1;
//   //   } catch (error) {
//   //     console.error('❌ Error getting business:', error);
//   //     return 1;
//   //   }
//   // }, []);
// // In delivery-list.tsx, update the getBusinessId function
// const getBusinessId = useCallback(async () => {
//   try {
//     console.log('🔍 Getting business ID...');
//     // Try to get the first business
//     const { data, error } = await supabase
//       .from('businesses')
//       .select('id')
//       .limit(1)
//       .single();

//     if (error) {
//       console.error('❌ Business error:', error);
//       // If error, try to get from deliveries
//       const { data: deliveryData } = await supabase
//         .from('deliveries')
//         .select('business_id')
//         .limit(1)
//         .single();
      
//       if (deliveryData?.business_id) {
//         console.log('✅ Using business_id from deliveries:', deliveryData.business_id);
//         return deliveryData.business_id;
//       }
//       return 11; // Use 11 as fallback (from your screenshot)
//     }
//     console.log('✅ Business ID:', data?.id);
//     return data?.id || 11;
//   } catch (error) {
//     console.error('❌ Error getting business:', error);
//     return 11; // Use 11 as fallback
//   }
// }, []);
//   // Fetch deliveries
//   const fetchDeliveries = useCallback(async (showLoading = true) => {
//     if (showLoading) setIsLoading(true);
//     setError(null);

//     try {
//       const bizId = await getBusinessId();
//       console.log('🔍 Fetching deliveries for business:', bizId);

//       let query = supabase
//         .from('deliveries')
//         .select('*')
//         .eq('business_id', bizId)
//         .order('created_at', { ascending: false });

//       if (statusFilter !== 'all') {
//         query = query.eq('status', statusFilter);
//       }

//       const { data, error: deliveryError } = await query;

//       if (deliveryError) {
//         console.error('❌ Delivery fetch error:', deliveryError);
//         throw deliveryError;
//       }

//       console.log('✅ Deliveries fetched:', data?.length || 0, 'items');
//       console.log('📦 First delivery:', data?.[0]);

//       setDeliveries(data || []);
//       setFilteredDeliveries(data || []);
//     } catch (error: any) {
//       console.error('❌ Error fetching deliveries:', error);
//       setError(error.message || 'Failed to load deliveries');
//     } finally {
//       setIsLoading(false);
//       setIsRefreshing(false);
//     }
//   }, [statusFilter]);

//   // Filter deliveries locally
//   useEffect(() => {
//     if (statusFilter === 'all') {
//       setFilteredDeliveries(deliveries);
//     } else {
//       setFilteredDeliveries(
//         deliveries.filter((d) => d.status === statusFilter)
//       );
//     }
//     console.log('📊 Filtered deliveries:', filteredDeliveries.length);
//   }, [statusFilter, deliveries]);

//   // Initial fetch
//   useEffect(() => {
//     console.log('🔄 Initial fetch...');
//     fetchDeliveries(true);
//   }, [fetchDeliveries]);

//   const onRefresh = () => {
//     console.log('🔄 Pull to refresh...');
//     setIsRefreshing(true);
//     fetchDeliveries(false);
//   };

//   // Get status counts
//   const getStatusCounts = () => {
//     const counts: Record<string, number> = { all: deliveries.length };
//     deliveries.forEach((d) => {
//       counts[d.status] = (counts[d.status] || 0) + 1;
//     });
//     return counts;
//   };

//   const statusCounts = getStatusCounts();

//   const goToDeliveryDetail = (deliveryId: number) => {
//     // @ts-ignore
//     navigation.navigate('delivery-detail', { id: deliveryId });
//   };

//   // Render delivery card
//   const renderDeliveryCard = ({ item }: { item: Delivery }) => {
//     const statusMeta = STATUS_META[item.status] || STATUS_META.Pending;

//     return (
//       <TouchableOpacity
//         style={styles.card}
//         onPress={() => goToDeliveryDetail(item.id)}
//         activeOpacity={0.7}
//       >
//         {/* Header: Order ID and Status */}
//         <View style={styles.cardHeader}>
//           <View style={styles.orderIdContainer}>
//             <Feather name="hash" size={14} color="#666" />
//             <Text style={styles.orderId}>Order #{item.order_id}</Text>
//           </View>
//           <View style={[styles.statusBadge, { backgroundColor: statusMeta.bg }]}>
//             <Feather name={statusMeta.icon as any} size={12} color={statusMeta.color} />
//             <Text style={[styles.statusText, { color: statusMeta.color }]}>
//               {statusMeta.label}
//             </Text>
//           </View>
//         </View>

//         {/* Customer Info */}
//         <View style={styles.customerSection}>
//           <View style={styles.avatar}>
//             <Text style={styles.avatarText}>
//               {item.customer_name?.charAt(0)?.toUpperCase() || '?'}
//             </Text>
//           </View>
//           <View style={styles.customerInfo}>
//             <Text style={styles.customerName}>{item.customer_name || 'Unknown'}</Text>
//             <View style={styles.contactRow}>
//               <Feather name="phone" size={12} color="#666" />
//               <Text style={styles.contactText}>{item.customer_phone || 'N/A'}</Text>
//             </View>
//             {item.customer_email && (
//               <View style={styles.contactRow}>
//                 <Feather name="mail" size={12} color="#666" />
//                 <Text style={styles.contactText}>{item.customer_email}</Text>
//               </View>
//             )}
//           </View>
//         </View>

//         {/* Delivery Address */}
//         {item.customer_address && (
//           <View style={styles.addressSection}>
//             <Feather name="map-pin" size={14} color="#666" />
//             <Text style={styles.addressText} numberOfLines={2}>
//               {item.customer_address}
//             </Text>
//           </View>
//         )}

//         {/* Product Description */}
//         <View style={styles.productSection}>
//           <Feather name="package" size={14} color="#666" />
//           <Text style={styles.productText} numberOfLines={2}>
//             {item.product_description || 'No products'}
//           </Text>
//         </View>

//         {/* Footer: Amount, Payment, Transaction */}
//         <View style={styles.cardFooter}>
//           <View style={styles.amountContainer}>
//             <Text style={styles.amountLabel}>Amount</Text>
//             <Text style={styles.amountValue}>₹{item.amount?.toFixed(2) || '0.00'}</Text>
//           </View>

//           <View style={styles.divider} />

//           <View style={styles.paymentContainer}>
//             <View style={styles.paymentRow}>
//               <Feather 
//                 name={item.payment_mode === 'online' ? 'credit-card' : 'dollar-sign'} 
//                 size={12} 
//                 color="#666" 
//               />
//               <Text style={styles.paymentText}>
//                 {item.payment_mode === 'online' ? 'Online' : 'Cash'}
//               </Text>
//             </View>
//             <View style={[styles.transactionBadge, {
//               backgroundColor: item.transaction_type === 'you_got' ? '#DCFCE7' : '#FEE2E2'
//             }]}>
//               <Text style={[styles.transactionText, {
//                 color: item.transaction_type === 'you_got' ? '#15803D' : '#B91C1C'
//               }]}>
//                 {item.transaction_type === 'you_got' ? 'Received' : 'To Pay'}
//               </Text>
//             </View>
//           </View>
//         </View>

//         {/* Timestamp */}
//         <View style={styles.timestampSection}>
//           <Feather name="clock" size={12} color="#999" />
//           <Text style={styles.timestampText}>
//             {item.created_at ? new Date(item.created_at).toLocaleString() : 'N/A'}
//           </Text>
//         </View>
//       </TouchableOpacity>
//     );
//   };

//   if (isLoading) {
//     return (
//       <View style={styles.centeredContainer}>
//         <ActivityIndicator size="large" color="#2563EB" />
//         <Text style={styles.loadingText}>Loading deliveries...</Text>
//       </View>
//     );
//   }

//   if (error) {
//     return (
//       <View style={styles.centeredContainer}>
//         <Feather name="alert-circle" size={48} color="#EF4444" />
//         <Text style={styles.errorTitle}>Something went wrong</Text>
//         <Text style={styles.errorText}>{error}</Text>
//         <TouchableOpacity style={styles.retryButton} onPress={() => fetchDeliveries(true)}>
//           <Text style={styles.retryButtonText}>Retry</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   return (
//     <View style={[styles.container, { paddingTop: insets.top }]}>
//       {/* Header */}
//       <View style={styles.header}>
//         <View>
//           <Text style={styles.headerTitle}>🚚 Deliveries</Text>
//           <Text style={styles.headerSubtitle}>
//             {deliveries.length} delivery{deliveries.length !== 1 ? 'ies' : ''} total
//           </Text>
//         </View>
//         <TouchableOpacity 
//           style={styles.refreshButton}
//           onPress={() => fetchDeliveries(true)}
//         >
//           <Feather name="refresh-cw" size={20} color="#2563EB" />
//         </TouchableOpacity>
//       </View>

//       {/* Status Filter */}
//       <View style={styles.filterContainer}>
//         <ScrollView 
//           horizontal 
//           showsHorizontalScrollIndicator={false}
//           contentContainerStyle={styles.filterScrollContent}
//         >
//           {STATUS_FILTERS.map((filter) => (
//             <TouchableOpacity
//               key={filter.value}
//               style={[
//                 styles.filterChip,
//                 statusFilter === filter.value && styles.filterChipActive,
//               ]}
//               onPress={() => setStatusFilter(filter.value)}
//             >
//               <Text
//                 style={[
//                   styles.filterChipText,
//                   statusFilter === filter.value && styles.filterChipTextActive,
//                 ]}
//               >
//                 {filter.label}
//                 {filter.value !== 'all' && (
//                   <Text style={styles.filterCount}>
//                     {' '}({statusCounts[filter.value] || 0})
//                   </Text>
//                 )}
//               </Text>
//             </TouchableOpacity>
//           ))}
//         </ScrollView>
//       </View>

//       {/* Deliveries List */}
//       {filteredDeliveries.length === 0 ? (
//         <View style={styles.emptyState}>
//           <Feather name="truck" size={64} color="#D1D5DB" />
//           <Text style={styles.emptyStateTitle}>
//             {statusFilter === 'all' ? 'No deliveries yet' : `No ${statusFilter} deliveries`}
//           </Text>
//           <Text style={styles.emptyStateSubtitle}>
//             {statusFilter === 'all' 
//               ? 'Deliveries created from customer orders will show up here.' 
//               : `No deliveries with "${statusFilter}" status`}
//           </Text>
//           <TouchableOpacity 
//             style={styles.refreshButtonLarge}
//             onPress={() => fetchDeliveries(true)}
//           >
//             <Feather name="refresh-cw" size={20} color="white" />
//             <Text style={styles.refreshButtonText}>Refresh</Text>
//           </TouchableOpacity>
//         </View>
//       ) : (
//         <FlatList
//           data={filteredDeliveries}
//           keyExtractor={(item) => `delivery-${item.id}`}
//           renderItem={renderDeliveryCard}
//           contentContainerStyle={styles.listContent}
//           refreshControl={
//             <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
//           }
//           showsVerticalScrollIndicator={false}
//         />
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#F5F5F5',
//   },
//   centeredContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingHorizontal: 20,
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingHorizontal: 16,
//     paddingVertical: 16,
//     backgroundColor: 'white',
//     borderBottomWidth: 1,
//     borderBottomColor: '#E5E7EB',
//   },
//   headerTitle: {
//     fontSize: 22,
//     fontWeight: '700',
//     color: '#111827',
//   },
//   headerSubtitle: {
//     fontSize: 13,
//     color: '#6B7280',
//     marginTop: 2,
//   },
//   refreshButton: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: '#F3F4F6',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   filterContainer: {
//     backgroundColor: 'white',
//     paddingVertical: 12,
//     borderBottomWidth: 1,
//     borderBottomColor: '#E5E7EB',
//   },
//   filterScrollContent: {
//     paddingHorizontal: 16,
//     gap: 8,
//   },
//   filterChip: {
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//     borderRadius: 20,
//     backgroundColor: '#F3F4F6',
//     borderWidth: 1,
//     borderColor: 'transparent',
//   },
//   filterChipActive: {
//     backgroundColor: '#DBEAFE',
//     borderColor: '#2563EB',
//   },
//   filterChipText: {
//     fontSize: 13,
//     color: '#6B7280',
//     fontWeight: '500',
//   },
//   filterChipTextActive: {
//     color: '#2563EB',
//   },
//   filterCount: {
//     fontSize: 11,
//     color: '#9CA3AF',
//   },
//   listContent: {
//     padding: 16,
//     paddingBottom: 100,
//   },
//   card: {
//     backgroundColor: 'white',
//     borderRadius: 12,
//     padding: 16,
//     marginBottom: 12,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.05,
//     shadowRadius: 4,
//     elevation: 2,
//   },
//   cardHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 12,
//   },
//   orderIdContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 4,
//   },
//   orderId: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#111827',
//   },
//   statusBadge: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 4,
//     paddingHorizontal: 10,
//     paddingVertical: 4,
//     borderRadius: 12,
//   },
//   statusText: {
//     fontSize: 11,
//     fontWeight: '600',
//   },
//   customerSection: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 8,
//   },
//   avatar: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: '#2563EB',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 12,
//   },
//   avatarText: {
//     color: 'white',
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   customerInfo: {
//     flex: 1,
//   },
//   customerName: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#111827',
//   },
//   contactRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 4,
//     marginTop: 2,
//   },
//   contactText: {
//     fontSize: 12,
//     color: '#6B7280',
//   },
//   addressSection: {
//     flexDirection: 'row',
//     alignItems: 'flex-start',
//     gap: 6,
//     marginBottom: 6,
//     paddingTop: 6,
//     borderTopWidth: 1,
//     borderTopColor: '#F3F4F6',
//   },
//   addressText: {
//     flex: 1,
//     fontSize: 13,
//     color: '#4B5563',
//     lineHeight: 18,
//   },
//   productSection: {
//     flexDirection: 'row',
//     alignItems: 'flex-start',
//     gap: 6,
//     marginBottom: 10,
//   },
//   productText: {
//     flex: 1,
//     fontSize: 13,
//     color: '#4B5563',
//     lineHeight: 18,
//   },
//   cardFooter: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingTop: 10,
//     borderTopWidth: 1,
//     borderTopColor: '#F3F4F6',
//     gap: 12,
//   },
//   amountContainer: {
//     flex: 0.3,
//   },
//   amountLabel: {
//     fontSize: 11,
//     color: '#9CA3AF',
//     marginBottom: 2,
//   },
//   amountValue: {
//     fontSize: 18,
//     fontWeight: '700',
//     color: '#111827',
//   },
//   divider: {
//     width: 1,
//     height: 30,
//     backgroundColor: '#E5E7EB',
//   },
//   paymentContainer: {
//     flex: 0.7,
//     gap: 4,
//   },
//   paymentRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 4,
//   },
//   paymentText: {
//     fontSize: 12,
//     color: '#6B7280',
//   },
//   transactionBadge: {
//     alignSelf: 'flex-start',
//     paddingHorizontal: 8,
//     paddingVertical: 2,
//     borderRadius: 4,
//   },
//   transactionText: {
//     fontSize: 10,
//     fontWeight: '600',
//   },
//   timestampSection: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 4,
//     marginTop: 8,
//     paddingTop: 8,
//     borderTopWidth: 1,
//     borderTopColor: '#F9FAFB',
//   },
//   timestampText: {
//     fontSize: 11,
//     color: '#9CA3AF',
//   },
//   emptyState: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingHorizontal: 40,
//   },
//   emptyStateTitle: {
//     fontSize: 20,
//     fontWeight: '600',
//     color: '#111827',
//     marginTop: 16,
//   },
//   emptyStateSubtitle: {
//     fontSize: 14,
//     color: '#6B7280',
//     textAlign: 'center',
//     marginTop: 8,
//   },
//   refreshButtonLarge: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//     marginTop: 20,
//     backgroundColor: '#2563EB',
//     paddingHorizontal: 20,
//     paddingVertical: 10,
//     borderRadius: 8,
//   },
//   refreshButtonText: {
//     color: 'white',
//     fontSize: 14,
//     fontWeight: '600',
//   },
//   retryButton: {
//     marginTop: 16,
//     backgroundColor: '#2563EB',
//     paddingHorizontal: 24,
//     paddingVertical: 10,
//     borderRadius: 8,
//   },
//   retryButtonText: {
//     color: 'white',
//     fontSize: 14,
//     fontWeight: '600',
//   },
//   loadingText: {
//     marginTop: 12,
//     fontSize: 14,
//     color: '#6B7280',
//   },
//   errorTitle: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: '#111827',
//     marginTop: 12,
//   },
//   errorText: {
//     fontSize: 14,
//     color: '#6B7280',
//     textAlign: 'center',
//     marginTop: 8,
//   },
// });
// Khata-Pro/khata-mobile/app/delivery-list.tsx
// import React, { useCallback, useEffect, useState } from 'react';
// import {
//   ActivityIndicator,
//   FlatList,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
//   RefreshControl,
// } from 'react-native';
// import { useRouter, useNavigation } from 'expo-router';
// import { Feather } from '@expo/vector-icons';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import { supabase } from '../lib/supabase';

// type DeliveryStatus = 'Pending' | 'Assigned' | 'In Transit' | 'Delivered' | 'Cancelled';

// interface Delivery {
//   id: number;
//   business_id: number;
//   customer_id: number;
//   customer_name: string;
//   customer_email: string | null;
//   customer_phone: string;
//   customer_address: string | null;
//   order_id: string;
//   product_description: string;
//   amount: number;
//   payment_mode: string;
//   transaction_type: string;
//   status: DeliveryStatus;
//   created_at: string;
//   updated_at: string;
// }

// const STATUS_META: Record<DeliveryStatus, { label: string; color: string; bg: string; icon: string }> = {
//   Pending: { label: 'Pending', color: '#B91C1C', bg: '#FEE2E2', icon: 'clock' },
//   Assigned: { label: 'Assigned', color: '#B45309', bg: '#FEF3C7', icon: 'user-check' },
//   'In Transit': { label: 'In Transit', color: '#1D4ED8', bg: '#DBEAFE', icon: 'truck' },
//   Delivered: { label: 'Delivered', color: '#15803D', bg: '#DCFCE7', icon: 'check-circle' },
//   Cancelled: { label: 'Cancelled', color: '#6B7280', bg: '#F3F4F6', icon: 'x-circle' },
// };

// const STATUS_FILTERS = [
//   { value: 'all', label: 'All' },
//   { value: 'Pending', label: 'Pending' },
//   { value: 'Assigned', label: 'Assigned' },
//   { value: 'In Transit', label: 'In Transit' },
//   { value: 'Delivered', label: 'Delivered' },
//   { value: 'Cancelled', label: 'Cancelled' },
// ];

// export default function DeliveryListScreen() {
//   const insets = useSafeAreaInsets();
//   const router = useRouter();
//   const navigation = useNavigation();
  
//   const [deliveries, setDeliveries] = useState<Delivery[]>([]);
//   const [filteredDeliveries, setFilteredDeliveries] = useState<Delivery[]>([]);
//   const [statusFilter, setStatusFilter] = useState<string>('all');
//   const [isLoading, setIsLoading] = useState(true);
//   const [isRefreshing, setIsRefreshing] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   // Fetch deliveries - SIMPLIFIED
//   const fetchDeliveries = useCallback(async (showLoading = true) => {
//     if (showLoading) setIsLoading(true);
//     setError(null);

//     try {
//       console.log('📦 Fetching all deliveries...');

//       // Get ALL deliveries without any filter
//       const { data, error: deliveryError } = await supabase
//         .from('deliveries')
//         .select('*')
//         .order('created_at', { ascending: false });

//       if (deliveryError) {
//         console.error('❌ Delivery fetch error:', deliveryError);
//         throw deliveryError;
//       }

//       console.log(`✅ Found ${data?.length || 0} deliveries`);

//       if (data && data.length > 0) {
//         console.log('📋 First delivery:', data[0]);
//         // Log all business_ids found
//         const bizIds = [...new Set(data.map(d => d.business_id))];
//         console.log('📋 Business IDs in table:', bizIds);
//       }

//       // Apply status filter if needed
//       let filteredData = data || [];
//       if (statusFilter !== 'all') {
//         filteredData = filteredData.filter((d) => d.status === statusFilter);
//       }

//       setDeliveries(data || []);
//       setFilteredDeliveries(filteredData);
      
//     } catch (error: any) {
//       console.error('❌ Error:', error);
//       setError(error.message || 'Failed to load deliveries');
//     } finally {
//       setIsLoading(false);
//       setIsRefreshing(false);
//     }
//   }, [statusFilter]);

//   // Filter deliveries when status changes
//   useEffect(() => {
//     if (statusFilter === 'all') {
//       setFilteredDeliveries(deliveries);
//     } else {
//       setFilteredDeliveries(
//         deliveries.filter((d) => d.status === statusFilter)
//       );
//     }
//   }, [statusFilter, deliveries]);

//   // Initial fetch
//   useEffect(() => {
//     fetchDeliveries(true);
//   }, []);

//   const onRefresh = () => {
//     setIsRefreshing(true);
//     fetchDeliveries(false);
//   };

//   // Get status counts
//   const getStatusCounts = () => {
//     const counts: Record<string, number> = { all: deliveries.length };
//     deliveries.forEach((d) => {
//       counts[d.status] = (counts[d.status] || 0) + 1;
//     });
//     return counts;
//   };

//   const statusCounts = getStatusCounts();

//   const goToDeliveryDetail = (deliveryId: number) => {
//     // @ts-ignore
//     navigation.navigate('delivery-detail', { id: deliveryId });
//   };

//   // Render delivery card
//   const renderDeliveryCard = ({ item }: { item: Delivery }) => {
//     const statusMeta = STATUS_META[item.status] || STATUS_META.Pending;

//     return (
//       <TouchableOpacity
//         style={[styles.card, { borderLeftColor: statusMeta.color, borderLeftWidth: 4 }]}
//         onPress={() => goToDeliveryDetail(item.id)}
//         activeOpacity={0.7}
//       >
//         {/* Header: Order ID and Status */}
//         <View style={styles.cardHeader}>
//           <View style={styles.orderIdContainer}>
//             <Feather name="hash" size={14} color="#666" />
//             <Text style={styles.orderId}>Order #{item.order_id}</Text>
//           </View>
//           <View style={[styles.statusBadge, { backgroundColor: statusMeta.bg }]}>
//             <Feather name={statusMeta.icon as any} size={12} color={statusMeta.color} />
//             <Text style={[styles.statusText, { color: statusMeta.color }]}>
//               {statusMeta.label}
//             </Text>
//           </View>
//         </View>

//         {/* Customer Info */}
//         <View style={styles.customerSection}>
//           <View style={styles.avatar}>
//             <Text style={styles.avatarText}>
//               {item.customer_name?.charAt(0)?.toUpperCase() || '?'}
//             </Text>
//           </View>
//           <View style={styles.customerInfo}>
//             <Text style={styles.customerName}>{item.customer_name || 'Unknown'}</Text>
//             <View style={styles.contactRow}>
//               <Feather name="phone" size={12} color="#666" />
//               <Text style={styles.contactText}>{item.customer_phone || 'N/A'}</Text>
//             </View>
//             {item.customer_email && (
//               <View style={styles.contactRow}>
//                 <Feather name="mail" size={12} color="#666" />
//                 <Text style={styles.contactText}>{item.customer_email}</Text>
//               </View>
//             )}
//           </View>
//         </View>

//         {/* Delivery Address */}
//         {item.customer_address && (
//           <View style={styles.addressSection}>
//             <Feather name="map-pin" size={14} color="#666" />
//             <Text style={styles.addressText} numberOfLines={2}>
//               {item.customer_address}
//             </Text>
//           </View>
//         )}

//         {/* Product Description */}
//         <View style={styles.productSection}>
//           <Feather name="package" size={14} color="#666" />
//           <Text style={styles.productText} numberOfLines={2}>
//             {item.product_description || 'No products'}
//           </Text>
//         </View>

//         {/* Footer: Amount, Payment, Transaction */}
//         <View style={styles.cardFooter}>
//           <View style={styles.amountContainer}>
//             <Text style={styles.amountLabel}>Amount</Text>
//             <Text style={styles.amountValue}>₹{item.amount?.toFixed(2) || '0.00'}</Text>
//           </View>

//           <View style={styles.divider} />

//           <View style={styles.paymentContainer}>
//             <View style={styles.paymentRow}>
//               <Feather 
//                 name={item.payment_mode === 'online' ? 'credit-card' : 'dollar-sign'} 
//                 size={12} 
//                 color="#666" 
//               />
//               <Text style={styles.paymentText}>
//                 {item.payment_mode === 'online' ? 'Online' : 'Cash'}
//               </Text>
//             </View>
//             <View style={[styles.transactionBadge, {
//               backgroundColor: item.transaction_type === 'you_got' ? '#DCFCE7' : '#FEE2E2'
//             }]}>
//               <Text style={[styles.transactionText, {
//                 color: item.transaction_type === 'you_got' ? '#15803D' : '#B91C1C'
//               }]}>
//                 {item.transaction_type === 'you_got' ? 'Received' : 'To Pay'}
//               </Text>
//             </View>
//           </View>
//         </View>

//         {/* Timestamp */}
//         <View style={styles.timestampSection}>
//           <Feather name="clock" size={12} color="#999" />
//           <Text style={styles.timestampText}>
//             {item.created_at ? new Date(item.created_at).toLocaleString() : 'N/A'}
//           </Text>
//         </View>
//       </TouchableOpacity>
//     );
//   };

//   // Loading state
//   if (isLoading) {
//     return (
//       <View style={styles.centeredContainer}>
//         <ActivityIndicator size="large" color="#2563EB" />
//         <Text style={styles.loadingText}>Loading deliveries...</Text>
//       </View>
//     );
//   }

//   // Error state
//   if (error) {
//     return (
//       <View style={styles.centeredContainer}>
//         <Feather name="alert-circle" size={48} color="#EF4444" />
//         <Text style={styles.errorTitle}>Something went wrong</Text>
//         <Text style={styles.errorText}>{error}</Text>
//         <TouchableOpacity style={styles.retryButton} onPress={() => fetchDeliveries(true)}>
//           <Text style={styles.retryButtonText}>Retry</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   return (
//     <View style={[styles.container, { paddingTop: insets.top }]}>
//       {/* Header */}
//       <View style={styles.header}>
//         <View>
//           <Text style={styles.headerTitle}>🚚 Deliveries</Text>
//           <Text style={styles.headerSubtitle}>
//             {deliveries.length} delivery{deliveries.length !== 1 ? 'ies' : ''} total
//           </Text>
//         </View>
//         <TouchableOpacity 
//           style={styles.refreshButton}
//           onPress={() => fetchDeliveries(true)}
//         >
//           <Feather name="refresh-cw" size={20} color="#2563EB" />
//         </TouchableOpacity>
//       </View>

//       {/* Status Filter */}
//       <View style={styles.filterContainer}>
//         <ScrollView 
//           horizontal 
//           showsHorizontalScrollIndicator={false}
//           contentContainerStyle={styles.filterScrollContent}
//         >
//           {STATUS_FILTERS.map((filter) => (
//             <TouchableOpacity
//               key={filter.value}
//               style={[
//                 styles.filterChip,
//                 statusFilter === filter.value && styles.filterChipActive,
//               ]}
//               onPress={() => setStatusFilter(filter.value)}
//             >
//               <Text
//                 style={[
//                   styles.filterChipText,
//                   statusFilter === filter.value && styles.filterChipTextActive,
//                 ]}
//               >
//                 {filter.label}
//                 {filter.value !== 'all' && (
//                   <Text style={styles.filterCount}>
//                     {' '}({statusCounts[filter.value] || 0})
//                   </Text>
//                 )}
//               </Text>
//             </TouchableOpacity>
//           ))}
//         </ScrollView>
//       </View>

//       {/* Deliveries List */}
//       {filteredDeliveries.length === 0 ? (
//         <View style={styles.emptyState}>
//           <Feather name="truck" size={64} color="#D1D5DB" />
//           <Text style={styles.emptyStateTitle}>
//             {statusFilter === 'all' ? 'No deliveries yet' : `No ${statusFilter} deliveries`}
//           </Text>
//           <Text style={styles.emptyStateSubtitle}>
//             {statusFilter === 'all' 
//               ? 'Deliveries created from customer orders will show up here.' 
//               : `No deliveries with "${statusFilter}" status`}
//           </Text>
//           <TouchableOpacity 
//             style={styles.refreshButtonLarge}
//             onPress={() => fetchDeliveries(true)}
//           >
//             <Feather name="refresh-cw" size={20} color="white" />
//             <Text style={styles.refreshButtonText}>Refresh</Text>
//           </TouchableOpacity>
//         </View>
//       ) : (
//         <FlatList
//           data={filteredDeliveries}
//           keyExtractor={(item) => `delivery-${item.id}`}
//           renderItem={renderDeliveryCard}
//           contentContainerStyle={styles.listContent}
//           refreshControl={
//             <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
//           }
//           showsVerticalScrollIndicator={false}
//         />
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#F5F5F5',
//   },
//   centeredContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingHorizontal: 20,
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingHorizontal: 16,
//     paddingVertical: 16,
//     backgroundColor: 'white',
//     borderBottomWidth: 1,
//     borderBottomColor: '#E5E7EB',
//   },
//   headerTitle: {
//     fontSize: 22,
//     fontWeight: '700',
//     color: '#111827',
//   },
//   headerSubtitle: {
//     fontSize: 13,
//     color: '#6B7280',
//     marginTop: 2,
//   },
//   refreshButton: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: '#F3F4F6',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   filterContainer: {
//     backgroundColor: 'white',
//     paddingVertical: 12,
//     borderBottomWidth: 1,
//     borderBottomColor: '#E5E7EB',
//   },
//   filterScrollContent: {
//     paddingHorizontal: 16,
//     gap: 8,
//   },
//   filterChip: {
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//     borderRadius: 20,
//     backgroundColor: '#F3F4F6',
//     borderWidth: 1,
//     borderColor: 'transparent',
//   },
//   filterChipActive: {
//     backgroundColor: '#DBEAFE',
//     borderColor: '#2563EB',
//   },
//   filterChipText: {
//     fontSize: 13,
//     color: '#6B7280',
//     fontWeight: '500',
//   },
//   filterChipTextActive: {
//     color: '#2563EB',
//   },
//   filterCount: {
//     fontSize: 11,
//     color: '#9CA3AF',
//   },
//   listContent: {
//     padding: 16,
//     paddingBottom: 100,
//   },
//   card: {
//     backgroundColor: 'white',
//     borderRadius: 12,
//     padding: 16,
//     marginBottom: 12,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.05,
//     shadowRadius: 4,
//     elevation: 2,
//     borderLeftWidth: 4,
//   },
//   cardHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 12,
//   },
//   orderIdContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 4,
//   },
//   orderId: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#111827',
//   },
//   statusBadge: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 4,
//     paddingHorizontal: 10,
//     paddingVertical: 4,
//     borderRadius: 12,
//   },
//   statusText: {
//     fontSize: 11,
//     fontWeight: '600',
//   },
//   customerSection: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 8,
//   },
//   avatar: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: '#2563EB',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 12,
//   },
//   avatarText: {
//     color: 'white',
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   customerInfo: {
//     flex: 1,
//   },
//   customerName: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#111827',
//   },
//   contactRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 4,
//     marginTop: 2,
//   },
//   contactText: {
//     fontSize: 12,
//     color: '#6B7280',
//   },
//   addressSection: {
//     flexDirection: 'row',
//     alignItems: 'flex-start',
//     gap: 6,
//     marginBottom: 6,
//     paddingTop: 6,
//     borderTopWidth: 1,
//     borderTopColor: '#F3F4F6',
//   },
//   addressText: {
//     flex: 1,
//     fontSize: 13,
//     color: '#4B5563',
//     lineHeight: 18,
//   },
//   productSection: {
//     flexDirection: 'row',
//     alignItems: 'flex-start',
//     gap: 6,
//     marginBottom: 10,
//   },
//   productText: {
//     flex: 1,
//     fontSize: 13,
//     color: '#4B5563',
//     lineHeight: 18,
//   },
//   cardFooter: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingTop: 10,
//     borderTopWidth: 1,
//     borderTopColor: '#F3F4F6',
//     gap: 12,
//   },
//   amountContainer: {
//     flex: 0.3,
//   },
//   amountLabel: {
//     fontSize: 11,
//     color: '#9CA3AF',
//     marginBottom: 2,
//   },
//   amountValue: {
//     fontSize: 18,
//     fontWeight: '700',
//     color: '#111827',
//   },
//   divider: {
//     width: 1,
//     height: 30,
//     backgroundColor: '#E5E7EB',
//   },
//   paymentContainer: {
//     flex: 0.7,
//     gap: 4,
//   },
//   paymentRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 4,
//   },
//   paymentText: {
//     fontSize: 12,
//     color: '#6B7280',
//   },
//   transactionBadge: {
//     alignSelf: 'flex-start',
//     paddingHorizontal: 8,
//     paddingVertical: 2,
//     borderRadius: 4,
//   },
//   transactionText: {
//     fontSize: 10,
//     fontWeight: '600',
//   },
//   timestampSection: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 4,
//     marginTop: 8,
//     paddingTop: 8,
//     borderTopWidth: 1,
//     borderTopColor: '#F9FAFB',
//   },
//   timestampText: {
//     fontSize: 11,
//     color: '#9CA3AF',
//   },
//   emptyState: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingHorizontal: 40,
//   },
//   emptyStateTitle: {
//     fontSize: 20,
//     fontWeight: '600',
//     color: '#111827',
//     marginTop: 16,
//   },
//   emptyStateSubtitle: {
//     fontSize: 14,
//     color: '#6B7280',
//     textAlign: 'center',
//     marginTop: 8,
//   },
//   refreshButtonLarge: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//     marginTop: 20,
//     backgroundColor: '#2563EB',
//     paddingHorizontal: 20,
//     paddingVertical: 10,
//     borderRadius: 8,
//   },
//   refreshButtonText: {
//     color: 'white',
//     fontSize: 14,
//     fontWeight: '600',
//   },
//   retryButton: {
//     marginTop: 16,
//     backgroundColor: '#2563EB',
//     paddingHorizontal: 24,
//     paddingVertical: 10,
//     borderRadius: 8,
//   },
//   retryButtonText: {
//     color: 'white',
//     fontSize: 14,
//     fontWeight: '600',
//   },
//   loadingText: {
//     marginTop: 12,
//     fontSize: 14,
//     color: '#6B7280',
//   },
//   errorTitle: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: '#111827',
//     marginTop: 12,
//   },
//   errorText: {
//     fontSize: 14,
//     color: '#6B7280',
//     textAlign: 'center',
//     marginTop: 8,
//   },
// });