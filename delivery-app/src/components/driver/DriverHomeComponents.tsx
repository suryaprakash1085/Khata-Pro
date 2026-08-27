

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  DeliveryOrder,
  DeliveryStatus,
  NotificationEntry,
  NotificationType,
  QuickActionItem,
  ScheduleEntry,
} from '../../types/driverHome.types';

// Keep this in sync with the FONT_FAMILY constant in DriverHomeScreen.tsx.
// (If you want a single source of truth, move this into a shared
// constants file and import it in both places instead of duplicating it.)
const FONT_FAMILY = Platform.select({
  web: '"Times New Roman", Times, serif',
  default: 'Times New Roman',
});

// RN Web renders TouchableOpacity as a real DOM element, so it gets the
// browser's default focus ring (the black box you saw around "Earnings"
// after clicking it). This isn't a real border in the design — it's just
// the browser saying "this element has focus." Merge this into any
// TouchableOpacity's `style` array to suppress it, e.g.
// style={[styles.quickAction, webNoOutlineStyle]}
const webNoOutlineStyle = (Platform.OS === 'web' ? { outlineStyle: 'none' } : {}) as any;

export const COLORS = {
  primary: '#2563EB',
  primaryDark: '#1D4ED8',
  primaryLight: '#DBEAFE',
  secondary: '#10B981',
  secondaryLight: '#D1FAE5',
  bg: '#F8FAFC',
  card: '#FFFFFF',
  ink: '#111827',
  slate: '#6B7280',
  slateLight: '#9CA3AF',
  border: '#E5E7EB',
  danger: '#EF4444',
  dangerLight: '#FEE2E2',
  amber: '#F59E0B',
  amberLight: '#FEF3C7',
};

/* ---------------------------------- */
/* Section Header                      */
/* ---------------------------------- */
export const SectionHeader: React.FC<{ title: string; actionLabel?: string; onPressAction?: () => void }> = ({
  title,
  actionLabel,
  onPressAction,
}) => (
  <View style={styles.sectionHeaderRow}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {actionLabel ? (
      <TouchableOpacity onPress={onPressAction} hitSlop={8}>
        <Text style={styles.sectionAction}>{actionLabel}</Text>
      </TouchableOpacity>
    ) : null}
  </View>
);

/* ---------------------------------- */
/* Summary Stat Card                   */
/* ---------------------------------- */
// NOTE: width intentionally left off the root style — the parent grid
// (DriverHomeScreen's `grid` + per-item wrapper) owns column sizing.
// This card just fills whatever width its wrapper gives it.
export const SummaryCard: React.FC<{
  label: string;
  value: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  bgColor: string;
}> = ({ label, value, icon, color, bgColor }) => (
  <View style={styles.summaryCard}>
    <View style={[styles.summaryIconWrap, { backgroundColor: bgColor }]}>
      <Ionicons name={icon} size={18} color={color} />
    </View>
    <Text style={styles.summaryValue}>{value}</Text>
    <Text style={styles.summaryLabel} numberOfLines={1} ellipsizeMode="tail">
      {label}
    </Text>
  </View>
);

/* ---------------------------------- */
/* Quick Action Button                 */
/* ---------------------------------- */
export const QuickActionButton: React.FC<{ item: QuickActionItem; onPress?: () => void }> = ({ item, onPress }) => (
  <TouchableOpacity style={[styles.quickAction, webNoOutlineStyle]} onPress={onPress} activeOpacity={0.75}>
    <View style={[styles.quickActionIconWrap, { backgroundColor: item.bgColor }]}>
      <Ionicons name={item.icon as keyof typeof Ionicons.glyphMap} size={22} color={item.color} />
    </View>
    <Text style={styles.quickActionLabel} numberOfLines={2}>
      {item.label}
    </Text>
  </TouchableOpacity>
);

/* ---------------------------------- */
/* Status Badge                        */
/* ---------------------------------- */
const statusMeta: Record<DeliveryStatus, { label: string; color: string; bg: string }> = {
  pending: { label: 'Pending', color: COLORS.amber, bg: COLORS.amberLight },
  assigned: { label: 'Assigned', color: COLORS.primary, bg: COLORS.primaryLight },
  picked_up: { label: 'Picked Up', color: '#7C3AED', bg: '#EDE9FE' },
  in_progress: { label: 'In Progress', color: COLORS.secondary, bg: COLORS.secondaryLight },
  delivered: { label: 'Delivered', color: COLORS.secondary, bg: COLORS.secondaryLight },
  failed: { label: 'Failed', color: COLORS.danger, bg: COLORS.dangerLight },
};

export const StatusBadge: React.FC<{ status: DeliveryStatus }> = ({ status }) => {
  const meta = statusMeta[status];
  return (
    <View style={[styles.badge, { backgroundColor: meta.bg }]}>
      <Text style={[styles.badgeText, { color: meta.color }]}>{meta.label}</Text>
    </View>
  );
};

/* ---------------------------------- */
/* Progress Bar (linear)               */
/* ---------------------------------- */
export const ProgressBar: React.FC<{ progress: number; color?: string; height?: number; style?: ViewStyle }> = ({
  progress,
  color = COLORS.primary,
  height = 8,
  style,
}) => (
  <View style={[styles.progressTrack, { height, borderRadius: height / 2 }, style]}>
    <View
      style={[
        styles.progressFill,
        { width: `${Math.min(Math.max(progress, 0), 1) * 100}%`, backgroundColor: color, borderRadius: height / 2 },
      ]}
    />
  </View>
);

/* ---------------------------------- */
/* Circular Ring (simple, css-based)   */
/* ---------------------------------- */
export const CircularStat: React.FC<{ value: string; label: string; color?: string }> = ({
  value,
  label,
  color = COLORS.primary,
}) => (
  <View style={styles.circularWrap}>
    <View style={[styles.circularRing, { borderColor: color }]}>
      <Text style={[styles.circularValue, { color }]}>{value}</Text>
    </View>
    <Text style={styles.circularLabel}>{label}</Text>
  </View>
);

/* ---------------------------------- */
/* Delivery Order Card                 */
/* ---------------------------------- */
export const DeliveryCard: React.FC<{
  order: DeliveryOrder;
  onNavigate?: () => void;
  onCall?: () => void;
  onMarkPickedUp?: () => void;
}> = ({ order, onNavigate, onCall, onMarkPickedUp }) => (
  <View style={styles.deliveryCard}>
    <View style={styles.deliveryHeaderRow}>
      <Text style={styles.deliveryOrderId}>{order.orderId}</Text>
      <StatusBadge status={order.status} />
    </View>

    <Text style={styles.deliveryCustomer}>{order.customerName}</Text>

    <View style={styles.deliveryInfoRow}>
      <Ionicons name="call-outline" size={13} color={COLORS.slate} />
      <Text style={styles.deliveryInfoText}>{order.phone}</Text>
    </View>
    <View style={styles.deliveryInfoRow}>
      <Ionicons name="location-outline" size={13} color={COLORS.slate} />
      <Text style={styles.deliveryInfoText} numberOfLines={2}>
        {order.address}
      </Text>
    </View>

    <View style={styles.deliveryFooterRow}>
      <View>
        <Text style={styles.deliveryAmount}>₹{order.amount}</Text>
        <Text style={styles.deliveryPayment}>{order.paymentMethod}</Text>
      </View>
      <View style={styles.deliveryActionsRow}>
        <TouchableOpacity style={[styles.iconActionBtn, webNoOutlineStyle]} onPress={onCall}>
          <Ionicons name="call" size={16} color={COLORS.primary} />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.iconActionBtn, webNoOutlineStyle]} onPress={onNavigate}>
          <Ionicons name="navigate" size={16} color={COLORS.primary} />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.pickedUpBtn, webNoOutlineStyle]} onPress={onMarkPickedUp}>
          <Text style={styles.pickedUpBtnText}>Mark Picked Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
);

/* ---------------------------------- */
/* Schedule Row                        */
/* ---------------------------------- */
export const ScheduleRow: React.FC<{ item: ScheduleEntry }> = ({ item }) => (
  <View style={styles.scheduleRow}>
    <View style={styles.scheduleTimeWrap}>
      <Text style={styles.scheduleTime}>{item.time}</Text>
    </View>
    <View style={{ flex: 1 }}>
      <Text style={styles.scheduleCustomer}>{item.customerName}</Text>
      <Text style={styles.scheduleOrderId}>{item.orderId}</Text>
    </View>
    <StatusBadge status={item.status} />
  </View>
);

/* ---------------------------------- */
/* Notification Row                    */
/* ---------------------------------- */
const notifIconMeta: Record<NotificationType, { icon: keyof typeof Ionicons.glyphMap; color: string; bg: string }> = {
  assigned: { icon: 'cube-outline', color: COLORS.primary, bg: COLORS.primaryLight },
  completed: { icon: 'checkmark-circle-outline', color: COLORS.secondary, bg: COLORS.secondaryLight },
  address_updated: { icon: 'location-outline', color: COLORS.amber, bg: COLORS.amberLight },
  payment_received: { icon: 'cash-outline', color: '#7C3AED', bg: '#EDE9FE' },
  order_confirmed: { icon: 'receipt-outline', color: COLORS.secondary, bg: COLORS.secondaryLight },
};

const DEFAULT_NOTIF_META = { icon: 'notifications-outline' as const, color: COLORS.slate, bg: COLORS.border };

export const NotificationRow: React.FC<{ item: NotificationEntry }> = ({ item }) => {
  const meta = notifIconMeta[item.type] ?? DEFAULT_NOTIF_META;
  return (
    <View style={styles.notifRow}>
      <View style={[styles.notifIconWrap, { backgroundColor: meta.bg }]}>
        <Ionicons name={meta.icon} size={16} color={meta.color} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.notifMessage}>{item.message}</Text>
        <Text style={styles.notifTime}>{item.time}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: { fontFamily: FONT_FAMILY, fontSize: 15, fontWeight: '700', color: COLORS.ink },
  sectionAction: { fontFamily: FONT_FAMILY, fontSize: 12.5, fontWeight: '600', color: COLORS.primary },

  // width removed — parent grid wrapper (in DriverHomeScreen) controls column
  // width; this just needs to fill it and not overflow.
  summaryCard: {
    width: '100%',
    minWidth: 0,
    backgroundColor: COLORS.card,
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  summaryIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  summaryValue: { fontFamily: FONT_FAMILY, fontSize: 16, fontWeight: '700', color: COLORS.ink },
  summaryLabel: { fontFamily: FONT_FAMILY, fontSize: 11, color: COLORS.slate, marginTop: 2 },

  // width removed here too — same reasoning as summaryCard.
  quickAction: { width: '100%', minWidth: 0, alignItems: 'center' },
  quickActionIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  quickActionLabel: { fontFamily: FONT_FAMILY, fontSize: 11.5, fontWeight: '600', color: COLORS.ink, textAlign: 'center' },

  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  badgeText: { fontFamily: FONT_FAMILY, fontSize: 10.5, fontWeight: '700' },

  progressTrack: { backgroundColor: COLORS.border, width: '100%', overflow: 'hidden' },
  progressFill: { height: '100%' },

  circularWrap: { alignItems: 'center', width: '25%' },
  circularRing: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  circularValue: { fontFamily: FONT_FAMILY, fontSize: 13, fontWeight: '700' },
  circularLabel: { fontFamily: FONT_FAMILY, fontSize: 10.5, color: COLORS.slate, textAlign: 'center' },

  deliveryCard: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  deliveryHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  deliveryOrderId: { fontFamily: FONT_FAMILY, fontSize: 13, fontWeight: '700', color: COLORS.primary },
  deliveryCustomer: { fontFamily: FONT_FAMILY, fontSize: 15, fontWeight: '700', color: COLORS.ink, marginBottom: 6 },
  deliveryInfoRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  deliveryInfoText: { fontFamily: FONT_FAMILY, fontSize: 12.5, color: COLORS.slate, flexShrink: 1 },
  deliveryFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  deliveryAmount: { fontFamily: FONT_FAMILY, fontSize: 15, fontWeight: '700', color: COLORS.ink },
  deliveryPayment: { fontFamily: FONT_FAMILY, fontSize: 11, color: COLORS.slate },
  deliveryActionsRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  iconActionBtn: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pickedUpBtn: {
    backgroundColor: COLORS.secondary,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 10,
  },
  pickedUpBtnText: { fontFamily: FONT_FAMILY, fontSize: 11, fontWeight: '700', color: '#FFFFFF' },

  scheduleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 8,
    gap: 10,
  },
  scheduleTimeWrap: {
    backgroundColor: COLORS.primaryLight,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  scheduleTime: { fontFamily: FONT_FAMILY, fontSize: 11, fontWeight: '700', color: COLORS.primary },
  scheduleCustomer: { fontFamily: FONT_FAMILY, fontSize: 13.5, fontWeight: '600', color: COLORS.ink },
  scheduleOrderId: { fontFamily: FONT_FAMILY, fontSize: 11, color: COLORS.slate, marginTop: 1 },

  notifRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 12 },
  notifIconWrap: { width: 34, height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  notifMessage: { fontFamily: FONT_FAMILY, fontSize: 13, color: COLORS.ink, fontWeight: '500' },
  notifTime: { fontFamily: FONT_FAMILY, fontSize: 11, color: COLORS.slateLight, marginTop: 2 },
});