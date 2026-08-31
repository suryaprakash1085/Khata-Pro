

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from './DriverHomeComponents';
import { OrderCardData, OrderFilterKey, OrderStatus, OrderSummaryItem } from '../../types/driverOrders.types';


const FONT_FAMILY = Platform.select({
  web: '"Times New Roman", Times, serif',
  default: 'Times New Roman',
});
const webNoOutlineStyle = (Platform.OS === 'web' ? { outlineStyle: 'none' } : {}) as any;

/* ---------------------------------- */
/* Status meta (shared by badge + summary cards) */
/* ---------------------------------- */
export const orderStatusMeta: Record<OrderStatus, { label: string; color: string; bg: string }> = {
  pending: { label: 'Pending', color: COLORS.amber, bg: COLORS.amberLight },
  assigned: { label: 'Assigned', color: COLORS.primary, bg: COLORS.primaryLight },
  picked_up: { label: 'Picked Up', color: '#7C3AED', bg: '#EDE9FE' },
  // in_progress: { label: 'In Progress', color: COLORS.secondary, bg: COLORS.secondaryLight },
  in_progress: { label: 'Out for Delivery', color: COLORS.secondary, bg: COLORS.secondaryLight },
  delivered: { label: 'Delivered', color: COLORS.secondary, bg: COLORS.secondaryLight },
  cancelled: { label: 'Cancelled', color: COLORS.danger, bg: COLORS.dangerLight },
  failed: { label: 'Failed', color: COLORS.danger, bg: COLORS.dangerLight },
};

/* ---------------------------------- */
/* Order Status Badge                  */
/* ---------------------------------- */
export const OrderStatusBadge: React.FC<{ status: OrderStatus }> = ({ status }) => {
  const meta = orderStatusMeta[status];
  return (
    <View style={[styles.badge, { backgroundColor: meta.bg }]}>
      <Text style={[styles.badgeText, { color: meta.color }]}>{meta.label}</Text>
    </View>
  );
};

/* ---------------------------------- */
/* Order Summary Card (compact)        */
/* ---------------------------------- */
export const OrderSummaryCard: React.FC<{ item: OrderSummaryItem; active?: boolean; onPress?: () => void }> = ({
  item,
  active,
  onPress,
}) => (
  <TouchableOpacity
    style={[styles.summaryCard, active && { borderColor: item.color, borderWidth: 1.5 }, webNoOutlineStyle]}
    onPress={onPress}
    activeOpacity={0.75}
  >
    <View style={[styles.summaryIconWrap, { backgroundColor: item.bgColor }]}>
      <Ionicons name={item.icon} size={16} color={item.color} />
    </View>
    <Text style={styles.summaryValue}>{item.count}</Text>
    <Text style={styles.summaryLabel} numberOfLines={1}>
      {item.label}
    </Text>
  </TouchableOpacity>
);

/* ---------------------------------- */
/* Filter Tabs                         */
/* ---------------------------------- */
const FILTERS: { key: OrderFilterKey; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'pending', label: 'Pending' },
  { key: 'picked_up', label: 'Picked Up' },
  { key: 'in_progress', label: 'In Progress' },
  { key: 'delivered', label: 'Delivered' },
  { key: 'cancelled', label: 'Cancelled' },
];

export const OrderFilterTabs: React.FC<{ active: OrderFilterKey; onChange: (key: OrderFilterKey) => void }> = ({
  active,
  onChange,
}) => (
  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
    {FILTERS.map((f) => {
      const isActive = f.key === active;
      return (
        <TouchableOpacity
          key={f.key}
          style={[styles.filterTab, isActive && styles.filterTabActive, webNoOutlineStyle]}
          onPress={() => onChange(f.key)}
          activeOpacity={0.8}
        >
          <Text style={[styles.filterTabText, isActive && styles.filterTabTextActive]}>{f.label}</Text>
        </TouchableOpacity>
      );
    })}
  </ScrollView>
);

/* ---------------------------------- */
/* Order Action Button                 */
/* ---------------------------------- */
type ActionVariant = 'primary' | 'success' | 'danger' | 'outline';

export const OrderActionButton: React.FC<{
  label: string;
  icon?: keyof typeof Ionicons.glyphMap;
  variant?: ActionVariant;
  loading?: boolean;
  onPress?: () => void;
}> = ({ label, icon, variant = 'outline', loading, onPress }) => {
  const variantStyle =
    variant === 'primary'
      ? { bg: COLORS.primary, fg: '#FFFFFF', border: COLORS.primary }
      : variant === 'success'
      ? { bg: COLORS.secondary, fg: '#FFFFFF', border: COLORS.secondary }
      : variant === 'danger'
      ? { bg: COLORS.dangerLight, fg: COLORS.danger, border: COLORS.dangerLight }
      : { bg: COLORS.card, fg: COLORS.ink, border: COLORS.border };

  return (
    <TouchableOpacity
      style={[styles.actionBtn, { backgroundColor: variantStyle.bg, borderColor: variantStyle.border }, webNoOutlineStyle]}
      onPress={onPress}
      disabled={loading}
      activeOpacity={0.8}
    >
      {icon && !loading ? <Ionicons name={icon} size={14} color={variantStyle.fg} /> : null}
      <Text style={[styles.actionBtnText, { color: variantStyle.fg }]}>{loading ? 'Updating…' : label}</Text>
    </TouchableOpacity>
  );
};

/* ---------------------------------- */
/* Order Card                          */
/* ---------------------------------- */
function formatTime(iso?: string | null) {
  if (!iso) return '—';
  return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export const OrderCard: React.FC<{
  order: OrderCardData;
  updating?: boolean;
  onNavigate: () => void;
  onCall: () => void;
  onMarkPickedUp: () => void;
  onStartDelivery: () => void;
  onMarkDelivered: () => void;
  onUnableToDeliver: () => void;
}> = ({ order, updating, onNavigate, onCall, onMarkPickedUp, onStartDelivery, onMarkDelivered, onUnableToDeliver }) => {
  const isMuted = order.status === 'cancelled' || order.status === 'failed';
  const isDelivered = order.status === 'delivered';
  const isPickupStage = order.status === 'pending' || order.status === 'assigned';
  
  // isPickedUp: waiting for driver to start delivery
  // isOutForDelivery: driver already started delivery, waiting for delivered/unable
  const isPickedUp = order.status === 'picked_up' && !order.outForDeliveryAt;
  const isOutForDelivery = order.status === 'picked_up' && !!order.outForDeliveryAt;

  return (
    <View style={[styles.card, isMuted && styles.cardMuted]}>
      <View style={styles.cardHeaderRow}>
        <Text style={styles.orderId}>{order.orderId}</Text>
        <OrderStatusBadge status={order.status} />
      </View>

      <Text style={styles.customerName}>{order.customerName}</Text>
      <View style={styles.infoRow}>
        <Ionicons name="call-outline" size={13} color={COLORS.slate} />
        <Text style={styles.infoText}>{order.phone}</Text>
      </View>

      <View style={styles.addressBlock}>
        <View style={styles.infoRow}>
          <Ionicons name="storefront-outline" size={13} color={COLORS.slate} />
          <Text style={styles.infoLabel}>Pickup</Text>
        </View>
        <Text style={styles.addressText} numberOfLines={2}>
          {order.pickupAddress}
        </Text>
      </View>

      <View style={styles.addressBlock}>
        <View style={styles.infoRow}>
          <Ionicons name="location-outline" size={13} color={COLORS.slate} />
          <Text style={styles.infoLabel}>Delivery</Text>
        </View>
        <Text style={styles.addressText} numberOfLines={2}>
          {order.dropAddress}
        </Text>
      </View>

      {order.notes ? (
        <View style={styles.notesBox}>
          <Text style={styles.notesText} numberOfLines={2}>
            {order.notes}
          </Text>
        </View>
      ) : null}

      <View style={styles.metaGridRow}>
        <View style={styles.metaItem}>
          <Text style={styles.metaValue}>₹{order.amount}</Text>
          <Text style={styles.metaLabel}>{order.paymentMethod}</Text>
        </View>
        <View style={styles.metaItem}>
          <Text style={styles.metaValue}>{order.distanceKm != null ? `${order.distanceKm} km` : '—'}</Text>
          <Text style={styles.metaLabel}>Distance</Text>
        </View>
        <View style={styles.metaItem}>
          <Text style={styles.metaValue}>
            {isDelivered
              ? formatTime(order.deliveredAt)
              : isOutForDelivery
              ? formatTime(order.pickedUpAt)
              : formatTime(order.assignedAt)}
          </Text>
          <Text style={styles.metaLabel}>
            {isDelivered ? 'Delivered' : isOutForDelivery ? 'Picked Up' : 'Assigned'}
          </Text>
        </View>
      </View>

      {!isMuted && !isDelivered && (
        <View style={styles.actionsRow}>
          <OrderActionButton label="Navigate" icon="navigate-outline" variant="outline" onPress={onNavigate} />
          <OrderActionButton label="Call" icon="call-outline" variant="outline" onPress={onCall} />
          
          {isPickupStage && (
            <OrderActionButton label="Mark Picked Up" variant="primary" loading={updating} onPress={onMarkPickedUp} />
          )}
          
          {isPickedUp && (
            <OrderActionButton 
              label="Out for Delivery" 
              icon="bicycle-outline" 
              variant="primary" 
              loading={updating} 
              onPress={onStartDelivery} 
            />
          )}
          
          {isOutForDelivery && (
            <>
              <OrderActionButton label="Delivered" variant="success" loading={updating} onPress={onMarkDelivered} />
              <OrderActionButton label="Unable to Deliver" variant="danger" loading={updating} onPress={onUnableToDeliver} />
            </>
          )}
        </View>
      )}
    </View>
  );
};

/* ---------------------------------- */
/* Empty State                         */
/* ---------------------------------- */
export const EmptyOrdersState: React.FC<{ message: string }> = ({ message }) => (
  <View style={styles.emptyWrap}>
    <View style={styles.emptyIconWrap}>
      <Ionicons name="file-tray-outline" size={26} color={COLORS.slateLight} />
    </View>
    <Text style={styles.emptyText}>{message}</Text>
  </View>
);

const styles = StyleSheet.create({
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  badgeText: { fontFamily: FONT_FAMILY, fontSize: 10.5, fontWeight: '700' },

  // Summary cards are intentionally compact — icon + count + label, nothing
  // more. Width comes from the parent grid wrapper, same pattern as the
  // Home screen's SummaryCard.
  summaryCard: {
    width: '100%',
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  summaryIconWrap: { width: 26, height: 26, borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginBottom: 6 },
  summaryValue: { fontFamily: FONT_FAMILY, fontSize: 15, fontWeight: '700', color: COLORS.ink },
  summaryLabel: { fontFamily: FONT_FAMILY, fontSize: 10.5, color: COLORS.slate, marginTop: 1 },

  filterRow: { flexDirection: 'row', gap: 8, paddingVertical: 2 },
  filterTab: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  filterTabActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  filterTabText: { fontFamily: FONT_FAMILY, fontSize: 12.5, fontWeight: '600', color: COLORS.slate },
  filterTabTextActive: { color: '#FFFFFF' },

  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 10,
    borderWidth: 1,
  },
  actionBtnText: { fontFamily: FONT_FAMILY, fontSize: 12, fontWeight: '700' },

  card: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  cardMuted: { opacity: 0.65 },
  cardHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  orderId: { fontFamily: FONT_FAMILY, fontSize: 13.5, fontWeight: '700', color: COLORS.primary },
  customerName: { fontFamily: FONT_FAMILY, fontSize: 15, fontWeight: '700', color: COLORS.ink, marginBottom: 4 },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 2 },
  infoText: { fontFamily: FONT_FAMILY, fontSize: 12.5, color: COLORS.slate },
  infoLabel: { fontFamily: FONT_FAMILY, fontSize: 11, fontWeight: '700', color: COLORS.slate, textTransform: 'uppercase' },
  addressBlock: { marginTop: 8 },
  addressText: { fontFamily: FONT_FAMILY, fontSize: 12.5, color: COLORS.ink, marginTop: 2 },
  notesBox: { marginTop: 10, backgroundColor: COLORS.bg, borderRadius: 10, padding: 8 },
  notesText: { fontFamily: FONT_FAMILY, fontSize: 12, color: COLORS.slate, fontStyle: 'italic' },

  metaGridRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  metaItem: { flex: 1 },
  metaValue: { fontFamily: FONT_FAMILY, fontSize: 13, fontWeight: '700', color: COLORS.ink },
  metaLabel: { fontFamily: FONT_FAMILY, fontSize: 10.5, color: COLORS.slate, marginTop: 1 },

  actionsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 },

  emptyWrap: { alignItems: 'center', justifyContent: 'center', paddingVertical: 48 },
  emptyIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: COLORS.bg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  emptyText: { fontFamily: FONT_FAMILY, fontSize: 13, color: COLORS.slate, textAlign: 'center' },
});