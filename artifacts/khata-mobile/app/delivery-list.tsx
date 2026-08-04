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