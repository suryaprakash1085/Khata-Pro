import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
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
  useGetDelivery,
  getGetDeliveryQueryKey,
  useGetSalesOrder,
  getGetSalesOrderQueryKey,
  useGetCustomer,
  getGetCustomerQueryKey,
  useGetDriver,
  getGetDriverQueryKey,
  useUpdateSalesOrderStatus,
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

// 🔶 NEW — payment status pill colors. Only rendered if the field actually
// exists on the order — see the `salesOrder as any` note near topBar below.
const PAYMENT_STATUS_META: Record<string, { label: string; color: string; bg: string }> = {
  paid: { label: 'Paid', color: '#15803D', bg: '#DCFCE7' },
  unpaid: { label: 'Unpaid', color: '#B91C1C', bg: '#FEE2E2' },
  partial: { label: 'Partial', color: '#B45309', bg: '#FEF3C7' },
};

const STATUS_FILTERS: { value: DeliveryStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'assigned', label: 'Assigned' },
  { value: 'in_transit', label: 'In Transit' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
];

const PAYMENT_METHOD_LABEL: Record<string, string> = {
  cod: 'Cash on Delivery',
  online: 'Online',
  card: 'Card',
};

function formatCurrency(n?: number | null) {
  if (n === undefined || n === null || Number.isNaN(n)) return undefined;
  return `₹${n.toFixed(2)}`;
}

// 🔶 NEW — small helper for the tinted circular icon badge used in every
// section header (Customer / Delivery / Driver / Items / Summary), matching
// the reference mockup's purple-badge look.
function SectionIconBadge({ name, color, tint }: { name: React.ComponentProps<typeof Feather>['name']; color: string; tint: string }) {
  return (
    <View style={[styles.iconBadge, { backgroundColor: tint }]}>
      <Feather name={name} size={14} color={color} />
    </View>
  );
}

export default function DeliveryListScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { business } = useBusiness();

  const [statusFilter, setStatusFilter] = useState<DeliveryStatus | 'all'>('all');
  const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(null);
  const [assignModalOpen, setAssignModalOpen] = useState(false);

  const [detailsTarget, setDetailsTarget] = useState<Delivery | null>(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);

  // ---- Deliveries list (unchanged) ----
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

  // ---- Available drivers (unchanged) ----
  const driverParams = { business_id: business?.id as number, status: 'available' as const, limit: 100 };
  const { data: driverData, isLoading: isLoadingDrivers } = useListDrivers(driverParams, {
    query: { enabled: !!business?.id && assignModalOpen, queryKey: getListDriversQueryKey(driverParams) },
  });
  const availableDrivers: Driver[] = driverData?.data ?? [];

  const assignDriver = useAssignDriver();

  const {
    data: deliveryDetail,
    isLoading: isLoadingDetail,
    isError: isDetailError,
    refetch: refetchDeliveryDetail,
  } = useGetDelivery(detailsTarget?.id as number, {
    query: {
      enabled: !!detailsTarget?.id && detailsModalOpen,
      queryKey: getGetDeliveryQueryKey(detailsTarget?.id as number),
    },
  });
  const activeDelivery: Delivery | undefined = deliveryDetail ?? detailsTarget ?? undefined;

  const salesOrderId = activeDelivery?.sales_order_id ?? undefined;
  const {
    data: salesOrder,
    isLoading: isLoadingSalesOrder,
    refetch: refetchSalesOrder,
  } = useGetSalesOrder(salesOrderId as number, {
    query: {
      enabled: !!salesOrderId && detailsModalOpen,
      queryKey: getGetSalesOrderQueryKey(salesOrderId as number),
    },
  });

  const { data: customer } = useGetCustomer(activeDelivery?.customer_id as number, {
    query: {
      enabled: !!activeDelivery?.customer_id && detailsModalOpen,
      queryKey: getGetCustomerQueryKey(activeDelivery?.customer_id as number),
    },
  });

  const { data: assignedDriver } = useGetDriver(activeDelivery?.driver_id as number, {
    query: {
      enabled: !!activeDelivery?.driver_id && detailsModalOpen,
      queryKey: getGetDriverQueryKey(activeDelivery?.driver_id as number),
    },
  });

  const confirmOrder = useUpdateSalesOrderStatus();

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
          if (detailsTarget?.id === selectedDelivery.id) refetchDeliveryDetail();
        },
      },
    );
  };

  const openDetails = (delivery: Delivery) => {
    setDetailsTarget(delivery);
    setDetailsModalOpen(true);
  };

  const closeDetails = () => {
    setDetailsModalOpen(false);
    setDetailsTarget(null);
  };

  const handleConfirmOrder = () => {
    if (!salesOrder) return;
    Alert.alert('Confirm this order?', 'The customer will be notified that their order has been confirmed.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Confirm',
        onPress: () => {
          confirmOrder.mutate(
            { id: salesOrder.id, data: { status: 'confirmed' } },
            {
              onSuccess: () => {
                refetch();
                refetchSalesOrder();
              },
              onError: () => {
                Alert.alert('Could not confirm order', 'Please try again.');
              },
            },
          );
        },
      },
    ]);
  };

  const renderDeliveryCard = ({ item }: { item: Delivery }) => {
    const meta = STATUS_META[item.status];
    const canAssign = item.status === 'pending';

    return (
      <Pressable
        onPress={() => openDetails(item)}
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
      </Pressable>
    );
  };

  // 🔶 NEW — payment_status / discount / delivery_charge are read defensively
  // with `as any` because they are NOT yet in the generated SalesOrder type.
  // Add them to the OpenAPI spec + Drizzle schema, re-run Orval, then remove
  // the `as any` casts. Until then these sections simply don't render.
  const salesOrderAny = salesOrder as (typeof salesOrder & {
    payment_status?: string;
    discount?: number;
    delivery_charge?: number;
  }) | undefined;

  const orderItems = salesOrder?.items ?? [];
  const subtotal = orderItems.length
    ? orderItems.reduce((sum, it) => sum + it.qty * it.unit_price, 0)
    : undefined;
  const isOrderPending = salesOrder?.status === 'pending';
  const paymentStatusMeta = salesOrderAny?.payment_status ? PAYMENT_STATUS_META[salesOrderAny.payment_status] : undefined;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={[styles.header, { paddingTop: insets.top + 12, borderBottomColor: colors.border }]}>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>Deliveries</Text>
        <Text style={[styles.headerSubtitle, { color: colors.mutedForeground }]}>
          {total} delivery{total === 1 ? '' : 'ies'}
        </Text>
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

      {/* Assign driver modal (unchanged) */}
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

      {/* Order Details modal — restyled to match reference mockup:
          tinted icon badges, product thumbnails, payment status pill,
          discount/delivery charge rows, notification confirmation line. */}
      <Modal visible={detailsModalOpen} animationType="slide" onRequestClose={closeDetails}>
        <View style={{ flex: 1, backgroundColor: colors.background }}>
          <View style={[styles.detailsHeader, { paddingTop: insets.top + 12, borderBottomColor: colors.border }]}>
            <Pressable onPress={closeDetails} hitSlop={8} style={styles.detailsBackBtn}>
              <Feather name="arrow-left" size={20} color={colors.foreground} />
            </Pressable>
            <View style={{ flex: 1 }}>
              <Text style={[styles.detailsTitle, { color: colors.foreground }]}>Order / Delivery Details</Text>
              {activeDelivery && (
                <Text style={[styles.detailsSubtitle, { color: colors.mutedForeground }]}>
                  Delivery #{activeDelivery.id}
                </Text>
              )}
            </View>
            <Pressable style={[styles.actionsBtn, { backgroundColor: colors.primary, borderRadius: colors.radius }]}>
              <Text style={[styles.actionsBtnText, { color: colors.primaryForeground }]}>Actions</Text>
              <Feather name="chevron-down" size={14} color={colors.primaryForeground} />
            </Pressable>
          </View>

          {isLoadingDetail && !activeDelivery ? (
            <ActivityIndicator style={{ marginTop: 40 }} color={colors.primary} />
          ) : isDetailError && !activeDelivery ? (
            <View style={styles.errorBox}>
              <Feather name="alert-triangle" size={20} color={colors.destructive} />
              <Text style={[styles.errorText, { color: colors.destructive }]}>Could not load order details.</Text>
              <Pressable
                onPress={() => refetchDeliveryDetail()}
                style={[styles.retryBtn, { borderColor: colors.border, borderRadius: colors.radius }]}
              >
                <Text style={{ color: colors.primary, fontSize: 13, fontFamily: FONT_FAMILY }}>Retry</Text>
              </Pressable>
            </View>
          ) : (
            <>
              <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 20 }}>
                {/* Top status strip */}
                {activeDelivery && (
                  <View style={[styles.topBar, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius }]}>
                    <View style={styles.topBarItem}>
                      <Text style={[styles.topBarLabel, { color: colors.mutedForeground }]}>Delivery Status</Text>
                      <View style={[styles.statusPill, { backgroundColor: STATUS_META[activeDelivery.status].bg, marginTop: 4 }]}>
                        <Text style={[styles.statusPillText, { color: STATUS_META[activeDelivery.status].color }]}>
                          {STATUS_META[activeDelivery.status].label}
                        </Text>
                      </View>
                    </View>
                    {salesOrder?.entry_date && (
                      <View style={styles.topBarItem}>
                        <View style={styles.iconLineRow}>
                          <Feather name="calendar" size={12} color={colors.primary} />
                          <Text style={[styles.topBarLabel, { color: colors.mutedForeground }]}>Order Date</Text>
                        </View>
                        <Text style={[styles.topBarValue, { color: colors.foreground }]}>{salesOrder.entry_date}</Text>
                      </View>
                    )}
                    {activeDelivery.payment_method && (
                      <View style={styles.topBarItem}>
                        <View style={styles.iconLineRow}>
                          <Feather name="credit-card" size={12} color={colors.primary} />
                          <Text style={[styles.topBarLabel, { color: colors.mutedForeground }]}>Payment Method</Text>
                        </View>
                        <Text style={[styles.topBarValue, { color: colors.foreground }]}>
                          {PAYMENT_METHOD_LABEL[activeDelivery.payment_method] ?? activeDelivery.payment_method}
                        </Text>
                      </View>
                    )}
                    {/* 🔶 Only shows once payment_status exists on SalesOrder — see note above */}
                    {paymentStatusMeta && (
                      <View style={styles.topBarItem}>
                        <View style={styles.iconLineRow}>
                          <Feather name="check-circle" size={12} color={colors.primary} />
                          <Text style={[styles.topBarLabel, { color: colors.mutedForeground }]}>Payment Status</Text>
                        </View>
                        <View style={[styles.statusPill, { backgroundColor: paymentStatusMeta.bg, marginTop: 4 }]}>
                          <Text style={[styles.statusPillText, { color: paymentStatusMeta.color }]}>{paymentStatusMeta.label}</Text>
                        </View>
                      </View>
                    )}
                    {(salesOrder?.amount !== undefined || activeDelivery.amount != null) && (
                      <View style={styles.topBarItem}>
                        <Text style={[styles.topBarLabel, { color: colors.mutedForeground }]}>Total Amount</Text>
                        <Text style={[styles.topBarValue, styles.topBarTotal, { color: colors.primary }]}>
                          {formatCurrency(salesOrder?.amount ?? activeDelivery.amount)}
                        </Text>
                      </View>
                    )}
                  </View>
                )}

                {/* 3-column info grid */}
                <View style={styles.gridRow}>
                  {(customer?.name || customer?.phone || salesOrder?.customer_name || activeDelivery?.customer_id) && (
                    <View style={[styles.gridCard, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius }]}>
                      <View style={styles.sectionHeaderRow}>
                        <SectionIconBadge name="user" color={colors.primary} tint={colors.muted} />
                        <Text style={[styles.sectionHeader, { color: colors.foreground }]}>Customer Information</Text>
                      </View>
                      {activeDelivery?.customer_id && (
                        <Text style={[styles.fieldSub, { color: colors.mutedForeground }]}>
                          Customer #{activeDelivery.customer_id}
                        </Text>
                      )}
                      {(customer?.name || salesOrder?.customer_name) && (
                        <Text style={[styles.fieldValue, { color: colors.foreground }]}>
                          {customer?.name ?? salesOrder?.customer_name}
                        </Text>
                      )}
                      {customer?.phone && (
                        <View style={styles.iconLineRow}>
                          <Feather name="phone" size={12} color={colors.mutedForeground} />
                          <Text style={[styles.fieldSub, { color: colors.mutedForeground }]}>{customer.phone}</Text>
                        </View>
                      )}
                      {customer?.address && (
                        <View style={styles.iconLineRow}>
                          <Feather name="map-pin" size={12} color={colors.mutedForeground} />
                          <Text style={[styles.fieldSub, { color: colors.mutedForeground, flex: 1 }]}>{customer.address}</Text>
                        </View>
                      )}
                    </View>
                  )}

                  {activeDelivery && (
                    <View style={[styles.gridCard, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius }]}>
                      <View style={styles.sectionHeaderRow}>
                        <SectionIconBadge name="map-pin" color={colors.primary} tint={colors.muted} />
                        <Text style={[styles.sectionHeader, { color: colors.foreground }]}>Delivery Information</Text>
                      </View>
                      <Text style={[styles.fieldLabel, { color: colors.mutedForeground }]}>Pickup Location</Text>
                      <Text style={[styles.fieldValue, { color: colors.foreground }]}>{activeDelivery.pickup_address}</Text>
                      <Text style={[styles.fieldLabel, { color: colors.mutedForeground, marginTop: 10 }]}>Delivery Location</Text>
                      <Text style={[styles.fieldValue, { color: colors.foreground }]}>{activeDelivery.drop_address}</Text>
                      {activeDelivery.notes && (
                        <>
                          <Text style={[styles.fieldLabel, { color: colors.mutedForeground, marginTop: 10 }]}>Notes</Text>
                          <Text style={[styles.fieldValue, { color: colors.foreground }]}>{activeDelivery.notes}</Text>
                        </>
                      )}
                    </View>
                  )}

                  {(activeDelivery?.driver_id || assignedDriver) && (
                    <View style={[styles.gridCard, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius }]}>
                      <View style={styles.sectionHeaderRow}>
                        <SectionIconBadge name="truck" color={colors.primary} tint={colors.muted} />
                        <Text style={[styles.sectionHeader, { color: colors.foreground }]}>Driver Information</Text>
                      </View>
                      <View style={styles.driverAvatarRow}>
                        <View style={[styles.driverAvatar, { backgroundColor: colors.muted }]}>
                          <Feather name="user" size={18} color={colors.mutedForeground} />
                        </View>
                        <View style={{ flex: 1 }}>
                          {assignedDriver?.name && (
                            <Text style={[styles.fieldValue, { color: colors.foreground, marginTop: 0 }]}>{assignedDriver.name}</Text>
                          )}
                          {assignedDriver?.phone && (
                            <Text style={[styles.fieldSub, { color: colors.mutedForeground }]}>{assignedDriver.phone}</Text>
                          )}
                          {(assignedDriver?.vehicle_type || assignedDriver?.vehicle_number) && (
                            <Text style={[styles.fieldSub, { color: colors.mutedForeground }]}>
                              {[assignedDriver?.vehicle_type, assignedDriver?.vehicle_number].filter(Boolean).join(' • ')}
                            </Text>
                          )}
                        </View>
                      </View>
                    </View>
                  )}
                </View>

                <View style={styles.gridRow}>
                  {!!orderItems.length && (
                    <View style={[styles.gridCardWide, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius }]}>
                      <View style={styles.sectionHeaderRow}>
                        <SectionIconBadge name="shopping-bag" color={colors.primary} tint={colors.muted} />
                        <Text style={[styles.sectionHeader, { color: colors.foreground }]}>Ordered Items</Text>
                      </View>
                      <View style={[styles.tableHeaderRow, { borderBottomColor: colors.border }]}>
                        <Text style={[styles.tableHeaderCell, styles.colIndex, { color: colors.mutedForeground }]}>#</Text>
                        <Text style={[styles.tableHeaderCell, styles.colProduct, { color: colors.mutedForeground }]}>Product</Text>
                        <Text style={[styles.tableHeaderCell, styles.colQty, { color: colors.mutedForeground }]}>Qty</Text>
                        <Text style={[styles.tableHeaderCell, styles.colPrice, { color: colors.mutedForeground }]}>Unit Price</Text>
                        <Text style={[styles.tableHeaderCell, styles.colPrice, { color: colors.mutedForeground }]}>Total</Text>
                      </View>
                      {orderItems.map((it, idx) => {
                        // 🔶 product_image not in current item type — cast
                        // defensively, thumbnail simply won't render until
                        // the schema/spec has it.
                        const image = (it as typeof it & { product_image?: string }).product_image;
                        return (
                          <View key={it.id ?? idx} style={[styles.tableRow, { borderBottomColor: colors.border }]}>
                            <Text style={[styles.tableCell, styles.colIndex, { color: colors.mutedForeground }]}>{idx + 1}</Text>
                            <View style={[styles.colProduct, styles.productCell]}>
                              {image ? (
                                <Image source={{ uri: image }} style={styles.productThumb} />
                              ) : (
                                <View style={[styles.productThumb, styles.productThumbFallback, { backgroundColor: colors.muted }]}>
                                  <Feather name="package" size={12} color={colors.mutedForeground} />
                                </View>
                              )}
                              <Text style={[styles.tableCell, { color: colors.foreground, flex: 1 }]} numberOfLines={1}>
                                {it.product_name}
                              </Text>
                            </View>
                            <Text style={[styles.tableCell, styles.colQty, { color: colors.foreground }]}>{it.qty}</Text>
                            <Text style={[styles.tableCell, styles.colPrice, { color: colors.foreground }]}>
                              {formatCurrency(it.unit_price)}
                            </Text>
                            <Text style={[styles.tableCell, styles.colPrice, styles.itemTotal, { color: colors.foreground }]}>
                              {formatCurrency(it.qty * it.unit_price)}
                            </Text>
                          </View>
                        );
                      })}
                    </View>
                  )}

                  {salesOrder && (
                    <View style={[styles.gridCard, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius }]}>
                      <View style={styles.sectionHeaderRow}>
                        <SectionIconBadge name="file-text" color={colors.primary} tint={colors.muted} />
                        <Text style={[styles.sectionHeader, { color: colors.foreground }]}>Order Summary</Text>
                      </View>
                      {subtotal !== undefined && (
                        <View style={styles.summaryRow}>
                          <Text style={[styles.fieldSub, { color: colors.mutedForeground }]}>Subtotal</Text>
                          <Text style={[styles.fieldValue, { color: colors.foreground, marginTop: 0 }]}>{formatCurrency(subtotal)}</Text>
                        </View>
                      )}
                      {/* 🔶 delivery_charge / discount — only if present on SalesOrder */}
                      {salesOrderAny?.delivery_charge !== undefined && (
                        <View style={styles.summaryRow}>
                          <Text style={[styles.fieldSub, { color: colors.mutedForeground }]}>Delivery Charge</Text>
                          <Text style={[styles.fieldValue, { color: colors.foreground, marginTop: 0 }]}>
                            {formatCurrency(salesOrderAny.delivery_charge)}
                          </Text>
                        </View>
                      )}
                      {salesOrderAny?.discount !== undefined && (
                        <View style={styles.summaryRow}>
                          <Text style={[styles.fieldSub, { color: colors.mutedForeground }]}>Discount</Text>
                          <Text style={[styles.fieldValue, { color: colors.destructive, marginTop: 0 }]}>
                            - {formatCurrency(salesOrderAny.discount)}
                          </Text>
                        </View>
                      )}
                      {salesOrder.tax !== undefined && (
                        <View style={styles.summaryRow}>
                          <Text style={[styles.fieldSub, { color: colors.mutedForeground }]}>Tax</Text>
                          <Text style={[styles.fieldValue, { color: colors.foreground, marginTop: 0 }]}>{formatCurrency(salesOrder.tax)}</Text>
                        </View>
                      )}
                      <View style={[styles.summaryRow, styles.grandTotalRow, { borderTopColor: colors.border }]}>
                        <Text style={[styles.grandTotalLabel, { color: colors.foreground }]}>Grand Total</Text>
                        <Text style={[styles.grandTotalValue, { color: colors.primary }]}>{formatCurrency(salesOrder.amount)}</Text>
                      </View>
                    </View>
                  )}
                </View>
              </ScrollView>

              {/* Bottom action bar */}
              <View style={[styles.bottomBar, { borderTopColor: colors.border, backgroundColor: colors.card, paddingBottom: insets.bottom + 12 }]}>
                <View style={styles.bottomBarLeft}>
                  <View style={[styles.bottomIconBadge, { backgroundColor: colors.primary }]}>
                    <Feather name="bell" size={16} color={colors.primaryForeground} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.bottomBarTitle, { color: colors.foreground }]}>
                      {salesOrderId ? (isOrderPending ? 'Confirm this order?' : `Order ${salesOrder?.status ?? 'confirmed'}`) : 'Delivery'}
                    </Text>
                    <Text style={[styles.bottomBarSubtitle, { color: colors.mutedForeground }]}>
                      {salesOrderId
                        ? isOrderPending
                          ? 'Review the details above, then confirm to move it forward.'
                          : 'This order has already been confirmed.'
                        : 'Not linked to an online order — nothing to confirm.'}
                    </Text>
                  </View>
                </View>

                <View style={styles.bottomBarRight}>
                  <View style={styles.bottomBarButtons}>
                    {activeDelivery?.status === 'pending' && (
                      <Pressable
                        onPress={() => activeDelivery && openAssignModal(activeDelivery)}
                        style={[styles.footerSecondaryBtn, { borderColor: colors.border, borderRadius: colors.radius }]}
                      >
                        <Feather name="user-plus" size={15} color={colors.foreground} />
                        <Text style={[styles.footerSecondaryBtnText, { color: colors.foreground }]}>Assign Driver</Text>
                      </Pressable>
                    )}

                    {salesOrderId && isOrderPending && (
                      <Pressable
                        onPress={handleConfirmOrder}
                        disabled={confirmOrder.isPending}
                        style={[
                          styles.footerPrimaryBtn,
                          { backgroundColor: colors.primary, borderRadius: colors.radius },
                          confirmOrder.isPending && styles.footerBtnDisabled,
                        ]}
                      >
                        {confirmOrder.isPending ? (
                          <ActivityIndicator size="small" color={colors.primaryForeground} />
                        ) : (
                          <Feather name="check-circle" size={16} color={colors.primaryForeground} />
                        )}
                        <Text style={[styles.footerPrimaryBtnText, { color: colors.primaryForeground }]}>
                          {confirmOrder.isPending ? 'Confirming…' : 'Confirm Order'}
                        </Text>
                      </Pressable>
                    )}

                    {salesOrderId && !isOrderPending && (
                      <View style={[styles.footerPrimaryBtn, styles.footerBtnDisabled, { backgroundColor: colors.muted, borderRadius: colors.radius }]}>
                        <Feather name="check-circle" size={16} color={colors.mutedForeground} />
                        <Text style={[styles.footerPrimaryBtnText, { color: colors.mutedForeground }]}>Order Confirmed</Text>
                      </View>
                    )}
                  </View>

                  {/* 🔶 NEW — matches the small check-line under the buttons in the mockup */}
                  {salesOrderId && (
                    <View style={styles.notifyRow}>
                      <Feather name="check" size={11} color={colors.primary} />
                      <Text style={[styles.notifyText, { color: colors.mutedForeground }]}>
                        Customer will receive a notification
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            </>
          )}
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

  detailsHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingBottom: 14, borderBottomWidth: 1 },
  detailsBackBtn: { padding: 4 },
  detailsTitle: { fontSize: 18, fontFamily: FONT_FAMILY, fontWeight: '700' },
  detailsSubtitle: { fontSize: 12, fontFamily: FONT_FAMILY, marginTop: 2 },

  sectionHeaderRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  sectionHeader: { fontSize: 14, fontFamily: FONT_FAMILY, fontWeight: '700' },

  // 🔶 NEW — tinted circular icon badge for section headers
  iconBadge: { width: 26, height: 26, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },

  fieldLabel: { fontSize: 11, fontFamily: FONT_FAMILY },
  fieldValue: { fontSize: 14, fontFamily: FONT_FAMILY, marginTop: 2 },
  fieldSub: { fontSize: 12, fontFamily: FONT_FAMILY, marginTop: 2 },
  iconLineRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },

  itemTotal: { fontSize: 13, fontFamily: FONT_FAMILY, fontWeight: '600' },

  topBar: { flexDirection: 'row', flexWrap: 'wrap', borderWidth: 1, padding: 14, marginBottom: 12, gap: 20 },
  topBarItem: { minWidth: 120 },
  topBarLabel: { fontSize: 11, fontFamily: FONT_FAMILY },
  topBarValue: { fontSize: 13, fontFamily: FONT_FAMILY, marginTop: 4, fontWeight: '600' },
  topBarTotal: { fontSize: 16, fontWeight: '700' },

  gridRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 12 },
  gridCard: { flexGrow: 1, flexBasis: 260, minWidth: 240, borderWidth: 1, padding: 14 },
  gridCardWide: { flexGrow: 2, flexBasis: 320, minWidth: 280, borderWidth: 1, padding: 14 },

  driverAvatarRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 2 },
  driverAvatar: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },

  tableHeaderRow: { flexDirection: 'row', borderBottomWidth: 1, paddingBottom: 8, marginTop: 4 },
  tableHeaderCell: { fontSize: 11, fontFamily: FONT_FAMILY, fontWeight: '600' },
  tableRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1 },
  tableCell: { fontSize: 13, fontFamily: FONT_FAMILY },
  colIndex: { width: 24 },
  colProduct: { flex: 1, paddingRight: 8 },
  colQty: { width: 40, textAlign: 'center' },
  colPrice: { width: 76, textAlign: 'right' },

  // 🔶 NEW — product thumbnail in items table
  productCell: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  productThumb: { width: 28, height: 28, borderRadius: 6 },
  productThumbFallback: { alignItems: 'center', justifyContent: 'center' },

  actionsBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 12, paddingVertical: 8 },
  actionsBtnText: { fontSize: 13, fontFamily: FONT_FAMILY, fontWeight: '600' },

  bottomBar: {
    borderTopWidth: 1,
    paddingHorizontal: 16,
    paddingTop: 14,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  bottomBarLeft: { flexDirection: 'row', alignItems: 'center', gap: 10, flexGrow: 1, flexBasis: 220 },
  bottomIconBadge: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  bottomBarTitle: { fontSize: 14, fontFamily: FONT_FAMILY, fontWeight: '700' },
  bottomBarSubtitle: { fontSize: 11, fontFamily: FONT_FAMILY, marginTop: 2 },
  bottomBarRight: { alignItems: 'flex-end', gap: 6 },
  bottomBarButtons: { flexDirection: 'row', gap: 10 },

  // 🔶 NEW — "Customer will receive a notification" line
  notifyRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  notifyText: { fontSize: 11, fontFamily: FONT_FAMILY },

  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 4 },
  grandTotalRow: { borderTopWidth: 1, marginTop: 6, paddingTop: 10 },
  grandTotalLabel: { fontSize: 14, fontFamily: FONT_FAMILY, fontWeight: '700' },
  grandTotalValue: { fontSize: 16, fontFamily: FONT_FAMILY, fontWeight: '700' },

  footerPrimaryBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 12, paddingHorizontal: 18 },
  footerPrimaryBtnText: { fontSize: 14, fontFamily: FONT_FAMILY, fontWeight: '700' },
  footerSecondaryBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 12, paddingHorizontal: 16, borderWidth: 1 },
  footerSecondaryBtnText: { fontSize: 14, fontFamily: FONT_FAMILY, fontWeight: '600' },
  footerBtnDisabled: { opacity: 0.6 },
});

