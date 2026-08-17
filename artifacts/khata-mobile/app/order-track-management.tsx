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
  TextInput,
  View,
} from 'react-native';
import { router, Stack } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';
import { useBusiness } from '@/contexts/BusinessContext';
import { EmptyState } from '@/components/EmptyState';
import {
  useListDeliveries,
  useAssignDriver,
  // Best guess based on the status enum VS Code showed
  // ("pending" | "picked_up" | "in_transit" | "delivered" | "cancelled").
  // If this name is wrong, retype "useUpdate" in this import block and
  // let autocomplete show the real one — swap it in here only.
  useUpdateDeliveryStatus,
  getListDeliveriesQueryKey,
  useListDrivers,
  getListDriversQueryKey,
  type Delivery,
  type DeliveryStatus,
  type Driver,
} from '@workspace/api-client-react';

const FONT_FAMILY = Platform.OS === 'web' ? 'Times New Roman' : 'serif';
const LIMIT = 100;

const STATUS_FLOW: DeliveryStatus[] = ['pending', 'assigned', 'picked_up', 'in_transit', 'delivered'];

const STATUS_META: Record<DeliveryStatus, { label: string; color: string; bg: string }> = {
  pending: { label: 'Pending', color: '#92400E', bg: '#FEF3C7' },
  assigned: { label: 'Assigned', color: '#1D4ED8', bg: '#DBEAFE' },
  picked_up: { label: 'Picked Up', color: '#4338CA', bg: '#E0E7FF' },
  in_transit: { label: 'In Transit', color: '#6D28D9', bg: '#EDE9FE' },
  delivered: { label: 'Delivered', color: '#15803D', bg: '#DCFCE7' },
  cancelled: { label: 'Cancelled', color: '#B91C1C', bg: '#FEE2E2' },
};

const STATUS_FILTERS: { value: DeliveryStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'assigned', label: 'Assigned' },
  { value: 'picked_up', label: 'Picked Up' },
  { value: 'in_transit', label: 'In Transit' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
];

function nextStatus(status: DeliveryStatus): DeliveryStatus | null {
  const idx = STATUS_FLOW.indexOf(status);
  if (idx === -1 || idx === STATUS_FLOW.length - 1) return null;
  return STATUS_FLOW[idx + 1];
}

function formatTime(iso?: string | null): string {
  if (!iso) return '';
  return new Date(iso).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
}

export default function OrderTrackManagementScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { business } = useBusiness();

  const [statusFilter, setStatusFilter] = useState<DeliveryStatus | 'all'>('all');
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState<number | null>(null);
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

  const allDeliveries: Delivery[] = deliveryData?.data ?? [];
  const total = deliveryData?.total ?? 0;

  const deliveries = allDeliveries.filter((d) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return (
      String(d.id).includes(q) ||
      String(d.customer_id).includes(q) ||
      (d.driver_id ? String(d.driver_id).includes(q) : false) ||
      d.drop_address?.toLowerCase().includes(q)
    );
  });

  // ---- Available drivers (for the assign modal) ----
  const driverParams = { business_id: business?.id as number, status: 'available' as const, limit: 100 };
  const { data: driverData, isLoading: isLoadingDrivers } = useListDrivers(driverParams, {
    query: { enabled: !!business?.id && assignModalOpen, queryKey: getListDriversQueryKey(driverParams) },
  });
  const availableDrivers: Driver[] = driverData?.data ?? [];

  const assignDriver = useAssignDriver();
  const updateDeliveryStatus = useUpdateDeliveryStatus();

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
          refetch();
        },
      },
    );
  };

  const handleAdvance = (delivery: Delivery) => {
    const next = nextStatus(delivery.status);
    if (!next) return;

    if (next === 'assigned') {
      openAssignModal(delivery);
      return;
    }

    updateDeliveryStatus.mutate(
      { id: delivery.id, data: { status: next as Exclude<DeliveryStatus, 'assigned'> } },
      { onSuccess: () => refetch() },
    );
  };

  const handleCancel = (delivery: Delivery) => {
    updateDeliveryStatus.mutate(
      { id: delivery.id, data: { status: 'cancelled' } },
      { onSuccess: () => refetch() },
    );
  };

  const renderDeliveryCard = ({ item }: { item: Delivery }) => {
    const meta = STATUS_META[item.status];
    const isExpanded = expandedId === item.id;
    const next = nextStatus(item.status);
    const canCancel = item.status !== 'delivered' && item.status !== 'cancelled';

    return (
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius }]}>
        <Pressable onPress={() => setExpandedId(isExpanded ? null : item.id)}>
          <View style={styles.cardTopRow}>
            <Text style={[styles.deliveryId, { color: colors.foreground, fontFamily: FONT_FAMILY }]}>Order #{item.id}</Text>
            <View style={[styles.statusPill, { backgroundColor: meta.bg }]}>
              <Text style={[styles.statusPillText, { color: meta.color, fontFamily: FONT_FAMILY }]}>{meta.label}</Text>
            </View>
          </View>

          <View style={styles.addressRow}>
            <Feather name="package" size={13} color={colors.mutedForeground} />
            <Text style={[styles.addressText, { color: colors.foreground, fontFamily: FONT_FAMILY }]} numberOfLines={1}>
              {item.pickup_address}
            </Text>
          </View>
          <View style={styles.addressRow}>
            <Feather name="map-pin" size={13} color={colors.mutedForeground} />
            <Text style={[styles.addressText, { color: colors.foreground, fontFamily: FONT_FAMILY }]} numberOfLines={1}>
              {item.drop_address}
            </Text>
          </View>

          <View style={styles.cardBottomRow}>
            <Text style={[styles.customerText, { color: colors.mutedForeground, fontFamily: FONT_FAMILY }]}>
              Customer #{item.customer_id}
            </Text>
            {item.driver_id ? (
              <Text style={[styles.driverText, { color: colors.mutedForeground, fontFamily: FONT_FAMILY }]}>
                Driver #{item.driver_id}
              </Text>
            ) : (
              <Text style={[styles.driverText, { color: colors.destructive, fontFamily: FONT_FAMILY }]}>No driver assigned</Text>
            )}
          </View>
        </Pressable>

        {isExpanded && (
          <View style={[styles.expandedArea, { borderTopColor: colors.border }]}>
            <View style={styles.timeline}>
              {STATUS_FLOW.map((step, i) => {
                const currentIdx = STATUS_FLOW.indexOf(item.status);
                const done = item.status === 'cancelled' ? false : i <= currentIdx;
                return (
                  <View key={step} style={styles.timelineRow}>
                    <View style={styles.timelineIconCol}>
                      <View style={[styles.timelineDot, { backgroundColor: done ? colors.primary : colors.border }]} />
                      {i < STATUS_FLOW.length - 1 && (
                        <View style={[styles.timelineLine, { backgroundColor: done ? colors.primary : colors.border }]} />
                      )}
                    </View>
                    <Text
                      style={[
                        styles.timelineLabel,
                        { color: done ? colors.foreground : colors.mutedForeground, fontFamily: FONT_FAMILY },
                      ]}
                    >
                      {STATUS_META[step].label}
                    </Text>
                  </View>
                );
              })}
              {item.status === 'cancelled' && (
                <View style={styles.timelineRow}>
                  <View style={styles.timelineIconCol}>
                    <View style={[styles.timelineDot, { backgroundColor: colors.destructive }]} />
                  </View>
                  <Text style={[styles.timelineLabel, { color: colors.destructive, fontFamily: FONT_FAMILY }]}>Cancelled</Text>
                </View>
              )}
            </View>

            {item.status !== 'delivered' && item.status !== 'cancelled' && (
              <View style={styles.actionRow}>
                {next && (
                  <Pressable
                    onPress={() => handleAdvance(item)}
                    disabled={updateDeliveryStatus.isPending}
                    style={[styles.primaryBtn, { backgroundColor: colors.primary, borderRadius: colors.radius }]}
                  >
                    <Feather name="check" size={14} color={colors.primaryForeground} />
                    <Text style={[styles.primaryBtnText, { color: colors.primaryForeground, fontFamily: FONT_FAMILY }]}>
                      {next === 'assigned' ? 'Assign Driver' : `Mark as ${STATUS_META[next].label}`}
                    </Text>
                  </Pressable>
                )}
                {canCancel && (
                  <Pressable
                    onPress={() => handleCancel(item)}
                    disabled={updateDeliveryStatus.isPending}
                    style={[styles.cancelBtn, { borderRadius: colors.radius }]}
                  >
                    <Feather name="x" size={14} color="#B91C1C" />
                    <Text style={[styles.cancelBtnText, { fontFamily: FONT_FAMILY }]}>Cancel Order</Text>
                  </Pressable>
                )}
              </View>
            )}
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={[styles.header, { paddingTop: insets.top + 12, borderBottomColor: colors.border }]}>
        <Pressable onPress={() => router.back()} hitSlop={10} style={styles.backBtn}>
          <Feather name="chevron-left" size={20} color={colors.foreground} />
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text style={[styles.headerTitle, { color: colors.foreground, fontFamily: FONT_FAMILY }]}>Order Track Management</Text>
          <Text style={[styles.headerSubtitle, { color: colors.mutedForeground, fontFamily: FONT_FAMILY }]}>
            {total} order{total === 1 ? '' : 's'}
          </Text>
        </View>
      </View>

      <View style={styles.searchWrap}>
        <View style={[styles.searchBox, { borderColor: colors.border, backgroundColor: colors.card, borderRadius: colors.radius }]}>
          <Feather name="search" size={15} color={colors.mutedForeground} />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search by order, customer or driver ID"
            placeholderTextColor={colors.mutedForeground}
            style={[styles.searchInput, { color: colors.foreground, fontFamily: FONT_FAMILY }]}
          />
        </View>
      </View>

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

      {isLoading ? (
        <ActivityIndicator style={{ marginTop: 40 }} color={colors.primary} />
      ) : isError ? (
        <View style={styles.errorBox}>
          <Feather name="alert-triangle" size={20} color={colors.destructive} />
          <Text style={[styles.errorText, { color: colors.destructive, fontFamily: FONT_FAMILY }]}>Could not load orders.</Text>
          <Pressable onPress={() => refetch()} style={[styles.retryBtn, { borderColor: colors.border, borderRadius: colors.radius }]}>
            <Text style={{ color: colors.primary, fontSize: 13, fontFamily: FONT_FAMILY }}>Retry</Text>
          </Pressable>
        </View>
      ) : deliveries.length === 0 ? (
        <EmptyState icon="truck" title="No orders yet" subtitle="Orders created for customer deliveries will show up here." />
      ) : (
        <FlatList
          data={deliveries}
          keyExtractor={(item) => `order-${item.id}`}
          renderItem={renderDeliveryCard}
          contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 12, paddingBottom: insets.bottom + 20 }}
          refreshing={isFetching}
          onRefresh={refetch}
        />
      )}

      <Modal visible={assignModalOpen} transparent animationType="slide" onRequestClose={() => setAssignModalOpen(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <View style={styles.modalHeaderRow}>
              <Text style={[styles.modalTitle, { color: colors.foreground, fontFamily: FONT_FAMILY }]}>
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
                <Text style={[styles.noDriversText, { color: colors.mutedForeground, fontFamily: FONT_FAMILY }]}>
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
                      <Text style={[styles.driverName, { color: colors.foreground, fontFamily: FONT_FAMILY }]}>{driver.name}</Text>
                      <Text style={[styles.driverMeta, { color: colors.mutedForeground, fontFamily: FONT_FAMILY }]}>
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
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingBottom: 14, borderBottomWidth: 1 },
  backBtn: { marginRight: 10, padding: 4 },
  headerTitle: { fontSize: 20, fontWeight: '700' },
  headerSubtitle: { fontSize: 12, marginTop: 2 },

  searchWrap: { paddingHorizontal: 16, paddingTop: 12 },
  searchBox: { flexDirection: 'row', alignItems: 'center', gap: 8, borderWidth: 1, paddingHorizontal: 12, paddingVertical: 10 },
  searchInput: { flex: 1, fontSize: 14 },

  filterStripWrap: { paddingTop: 10, paddingBottom: 4 },
  filterStrip: { flexGrow: 0, height: 44 },
  filterStripContent: { paddingHorizontal: 16, gap: 8, alignItems: 'center' },
  filterChip: { paddingHorizontal: 14, paddingVertical: 8, borderWidth: 1 },

  card: { borderWidth: 1, padding: 14, marginBottom: 10 },
  cardTopRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  deliveryId: { fontSize: 15, fontWeight: '700' },
  statusPill: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  statusPillText: { fontSize: 11, fontWeight: '600' },

  addressRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8 },
  addressText: { fontSize: 13, flex: 1 },

  cardBottomRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 },
  customerText: { fontSize: 12 },
  driverText: { fontSize: 12 },

  expandedArea: { borderTopWidth: 1, marginTop: 12, paddingTop: 12 },
  timeline: { marginBottom: 12, gap: 2 },
  timelineRow: { flexDirection: 'row', alignItems: 'center' },
  timelineIconCol: { alignItems: 'center', width: 18 },
  timelineDot: { width: 8, height: 8, borderRadius: 4 },
  timelineLine: { width: 2, height: 14 },
  timelineLabel: { fontSize: 12, marginLeft: 8, paddingVertical: 4 },

  actionRow: { flexDirection: 'row', gap: 10 },
  primaryBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 10, paddingHorizontal: 14, flex: 1 },
  primaryBtnText: { fontSize: 13, fontWeight: '600' },
  cancelBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 10, paddingHorizontal: 14, backgroundColor: '#FEE2E2' },
  cancelBtnText: { fontSize: 13, fontWeight: '600', color: '#B91C1C' },

  errorBox: { alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 40, paddingHorizontal: 20 },
  errorText: { fontSize: 13 },
  retryBtn: { paddingHorizontal: 16, paddingVertical: 8, borderWidth: 1, marginTop: 4 },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalContent: { width: '100%', maxWidth: 420, maxHeight: '80%', padding: 22, borderRadius: 16 },
  modalHeaderRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  modalTitle: { fontSize: 17, fontWeight: '700', flex: 1, marginRight: 10 },

  noDriversText: { fontSize: 13, marginTop: 8, textAlign: 'center' },

  driverRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1 },
  driverName: { fontSize: 14, fontWeight: '600' },
  driverMeta: { fontSize: 12, marginTop: 2 },
});