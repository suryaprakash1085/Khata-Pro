import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from './DriverHomeComponents';
import { RouteStop, RouteStopState, RouteSummaryItem, RouteAlertItem } from '../../types/driverRoute.types';

// Kept local (not exported from DriverHomeComponents), same pattern used in
// DriverHomeScreen.tsx / DriverOrdersScreen.tsx.
const FONT_FAMILY = Platform.select({
  web: '"Times New Roman", Times, serif',
  default: 'Times New Roman',
});
const webNoOutlineStyle = (Platform.OS === 'web' ? { outlineStyle: 'none' } : {}) as any;

// ── Section header (local copy, same visual language as the rest of the app) ─
export const RouteSectionHeader: React.FC<{ title: string; right?: React.ReactNode }> = ({ title, right }) => (
  <View style={styles.sectionHeaderRow}>
    <Text style={styles.sectionHeaderText}>{title}</Text>
    {right}
  </View>
);

// ── Summary card (Total / Completed / Remaining) ─────────────────────────
export const RouteSummaryCard: React.FC<{ item: RouteSummaryItem }> = ({ item }) => (
  <View style={styles.summaryCard}>
    <View style={[styles.summaryIconWrap, { backgroundColor: item.bgColor }]}>
      <Ionicons name={item.icon as keyof typeof Ionicons.glyphMap} size={18} color={item.color} />
    </View>
    <Text style={styles.summaryValue}>{item.value}</Text>
    <Text style={styles.summaryLabel}>{item.label}</Text>
  </View>
);

// ── Route progress bar ────────────────────────────────────────────────────
export const RouteProgress: React.FC<{
  completed: number;
  total: number;
  progress: number;
}> = ({ completed, total, progress }) => (
  <View style={styles.progressWrap}>
    <View style={styles.progressLabelRow}>
      <Text style={styles.progressLabel}>Route Progress</Text>
      <Text style={styles.progressValue}>
        {completed}/{total} stops
      </Text>
    </View>
    <View style={styles.progressTrack}>
      <View style={[styles.progressFill, { width: `${Math.round(progress * 100)}%` }]} />
    </View>
  </View>
);

// ── Map placeholder ────────────────────────────────────────────────────────
// No map SDK (react-native-maps / Mapbox) was configured in the project, so
// this renders a clean, clearly-labeled stand-in that shows the same stop
// sequence a real map would plot. Swap the inner content for a <MapView> +
// <Marker>/<Polyline> once a map SDK is wired up — the stop data (lat/lng
// aren't available yet either) is already shaped and ready to feed in.
export const RouteMapPlaceholder: React.FC<{ stops: RouteStop[] }> = ({ stops }) => {
  const visibleStops = stops.slice(0, 6);
  return (
    <View style={styles.mapCard}>
      <View style={styles.mapHeaderRow}>
        <View style={styles.mapDriverBadge}>
          <Ionicons name="car-sport" size={16} color="#FFFFFF" />
        </View>
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={styles.mapTitle}>Live Route</Text>
          <Text style={styles.mapSubtitle}>Map integration point — connect react-native-maps / Mapbox here</Text>
        </View>
      </View>

      <View style={styles.mapStopsCol}>
        {visibleStops.map((stop, idx) => (
          <View key={stop.id} style={styles.mapStopRow}>
            <View style={styles.mapStopLineCol}>
              <View
                style={[
                  styles.mapStopDot,
                  stop.state === 'completed' && styles.mapStopDotCompleted,
                  stop.state === 'current' && styles.mapStopDotCurrent,
                ]}
              >
                {stop.state === 'completed' ? (
                  <Ionicons name="checkmark" size={11} color="#FFFFFF" />
                ) : (
                  <Text style={styles.mapStopDotText}>{stop.stopNumber}</Text>
                )}
              </View>
              {idx < visibleStops.length - 1 && (
                <View style={[styles.mapStopConnector, stop.state === 'completed' && styles.mapStopConnectorDone]} />
              )}
            </View>
            <View style={{ flex: 1, paddingBottom: 14 }}>
              <Text style={styles.mapStopType}>{stop.type === 'pickup' ? 'PICKUP' : 'DELIVERY'}</Text>
              <Text style={styles.mapStopName} numberOfLines={1}>
                {stop.type === 'pickup' ? stop.address : stop.customerName}
              </Text>
            </View>
          </View>
        ))}
        {stops.length > 6 && <Text style={styles.mapMoreText}>+{stops.length - 6} more stop(s)</Text>}
      </View>
    </View>
  );
};

// ── Next delivery card ────────────────────────────────────────────────────
export const NextDeliveryCard: React.FC<{
  stop: RouteStop | null;
  onNavigate: () => void;
  onCall: () => void;
}> = ({ stop, onNavigate, onCall }) => {
  if (!stop) {
    return (
      <View style={[styles.nextCard, styles.nextCardEmpty]}>
        <Ionicons name="checkmark-done-circle-outline" size={26} color={COLORS.secondary} />
        <Text style={styles.nextEmptyText}>No pending deliveries next — you're all caught up.</Text>
      </View>
    );
  }

  return (
    <View style={styles.nextCard}>
      <Text style={styles.nextLabel}>NEXT DELIVERY</Text>
      <Text style={styles.nextOrderId}>{stop.orderId}</Text>

      <View style={styles.nextInfoRow}>
        <Text style={styles.nextInfoLabel}>Customer</Text>
        <Text style={styles.nextInfoValue} numberOfLines={1}>{stop.customerName}</Text>
      </View>
      <View style={styles.nextInfoRow}>
        <Text style={styles.nextInfoLabel}>Phone</Text>
        <Text style={styles.nextInfoValue}>{stop.phone || '—'}</Text>
      </View>
      <View style={styles.nextInfoRow}>
        <Text style={styles.nextInfoLabel}>Address</Text>
        <Text style={styles.nextInfoValue} numberOfLines={2}>{stop.address}</Text>
      </View>
      <View style={styles.nextInfoRowSplit}>
        <View>
          <Text style={styles.nextInfoLabel}>Distance</Text>
          <Text style={styles.nextInfoValue}>{stop.distanceKm != null ? `${stop.distanceKm} km` : '—'}</Text>
        </View>
        <View>
          <Text style={styles.nextInfoLabel}>Est. Time</Text>
          <Text style={styles.nextInfoValue}>{stop.etaMinutes != null ? `${stop.etaMinutes} mins` : '—'}</Text>
        </View>
        <View>
          <Text style={styles.nextInfoLabel}>Payment</Text>
          <Text style={styles.nextInfoValue}>{stop.paymentMethod}</Text>
        </View>
      </View>

      <View style={styles.nextActionsRow}>
        <TouchableOpacity style={[styles.navigateBtn, webNoOutlineStyle]} onPress={onNavigate}>
          <Ionicons name="navigate" size={15} color="#FFFFFF" />
          <Text style={styles.navigateBtnText}>Navigate</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.callBtn, webNoOutlineStyle]} onPress={onCall}>
          <Ionicons name="call" size={15} color={COLORS.primary} />
          <Text style={styles.callBtnText}>Call Customer</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// ── Generic route action button ───────────────────────────────────────────
export const RouteActionButton: React.FC<{
  label: string;
  icon?: string;
  variant?: 'primary' | 'success' | 'danger' | 'neutral';
  onPress: () => void;
  disabled?: boolean;
}> = ({ label, icon, variant = 'neutral', onPress, disabled }) => {
  const variantStyle =
    variant === 'primary' ? styles.actionPrimary :
    variant === 'success' ? styles.actionSuccess :
    variant === 'danger' ? styles.actionDanger :
    styles.actionNeutral;
  const textStyle =
    variant === 'neutral' ? styles.actionTextNeutral : styles.actionTextLight;

  return (
    <TouchableOpacity
      style={[styles.actionBtn, variantStyle, webNoOutlineStyle, disabled && { opacity: 0.5 }]}
      onPress={onPress}
      disabled={disabled}
    >
      {icon && (
        <Ionicons
          name={icon as keyof typeof Ionicons.glyphMap}
          size={14}
          color={variant === 'neutral' ? COLORS.ink : '#FFFFFF'}
        />
      )}
      <Text style={textStyle}>{label}</Text>
    </TouchableOpacity>
  );
};

// ── Status badge ───────────────────────────────────────────────────────────
const StopStatusBadge: React.FC<{ state: RouteStopState }> = ({ state }) => {
  if (state === 'completed') {
    return (
      <View style={[styles.badge, { backgroundColor: COLORS.secondaryLight }]}>
        <Ionicons name="checkmark-circle" size={12} color={COLORS.secondary} />
        <Text style={[styles.badgeText, { color: COLORS.secondary }]}>Completed</Text>
      </View>
    );
  }
  if (state === 'current') {
    return (
      <View style={[styles.badge, { backgroundColor: COLORS.primaryLight }]}>
        <Ionicons name="navigate" size={12} color={COLORS.primary} />
        <Text style={[styles.badgeText, { color: COLORS.primary }]}>In Progress</Text>
      </View>
    );
  }
  return (
    <View style={[styles.badge, { backgroundColor: '#F1F5F9' }]}>
      <Ionicons name="time-outline" size={12} color={COLORS.slate} />
      <Text style={[styles.badgeText, { color: COLORS.slate }]}>Pending</Text>
    </View>
  );
};

// ── A single stop card inside the timeline ─────────────────────────────────
export const RouteStopCard: React.FC<{
  stop: RouteStop;
  isLast: boolean;
  onNavigate: () => void;
  onCall: () => void;
  onMarkArrived?: () => void;
  onMarkDelivered?: () => void;
  onUnableToDeliver?: () => void;
  updating?: boolean;
}> = ({ stop, isLast, onNavigate, onCall, onMarkArrived, onMarkDelivered, onUnableToDeliver, updating }) => {
  return (
    <View style={styles.stopRow}>
      <View style={styles.stopLineCol}>
        <View
          style={[
            styles.stopNumberCircle,
            stop.state === 'completed' && styles.stopNumberCircleCompleted,
            stop.state === 'current' && styles.stopNumberCircleCurrent,
          ]}
        >
          {stop.state === 'completed' ? (
            <Ionicons name="checkmark" size={13} color="#FFFFFF" />
          ) : (
            <Text
              style={[
                styles.stopNumberText,
                stop.state === 'current' && { color: '#FFFFFF' },
              ]}
            >
              {stop.stopNumber}
            </Text>
          )}
        </View>
        {!isLast && <View style={[styles.stopConnector, stop.state === 'completed' && styles.stopConnectorDone]} />}
      </View>

      <View style={[styles.stopCard, stop.state === 'current' && styles.stopCardCurrent]}>
        <View style={styles.stopCardHeader}>
          <View style={{ flex: 1 }}>
            <Text style={styles.stopTypeLabel}>{stop.type === 'pickup' ? 'PICKUP' : 'DELIVERY'}</Text>
            <Text style={styles.stopOrderId}>{stop.orderId}</Text>
          </View>
          <StopStatusBadge state={stop.state} />
        </View>

        <Text style={styles.stopName} numberOfLines={1}>
          {stop.type === 'pickup' ? stop.address : stop.customerName}
        </Text>
        <Text style={styles.stopAddress} numberOfLines={2}>
          {stop.type === 'pickup' ? 'Pickup point' : stop.address}
        </Text>

        <View style={styles.stopMetaRow}>
          <Text style={styles.stopMetaText}>
            {stop.distanceKm != null ? `${stop.distanceKm} km` : '—'}
          </Text>
          <Text style={styles.stopMetaDot}>·</Text>
          <Text style={styles.stopMetaText}>
            {stop.etaMinutes != null ? `${stop.etaMinutes} mins` : '—'}
          </Text>
          {stop.state === 'completed' && stop.completedAt && (
            <>
              <Text style={styles.stopMetaDot}>·</Text>
              <Text style={styles.stopMetaText}>
                {new Date(stop.completedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </>
          )}
        </View>

        {/* Actions vary by state — nothing extraneous shown for completed stops */}
        {stop.state === 'current' && (
          <View style={styles.stopActionsRow}>
            <RouteActionButton label="Navigate" icon="navigate-outline" variant="primary" onPress={onNavigate} disabled={updating} />
            <RouteActionButton label="Call" icon="call-outline" variant="neutral" onPress={onCall} disabled={updating} />
            {stop.type === 'pickup' && onMarkArrived && (
              <RouteActionButton label="Mark Picked Up" icon="checkmark-outline" variant="success" onPress={onMarkArrived} disabled={updating} />
            )}
            {stop.type === 'delivery' && onMarkDelivered && (
              <RouteActionButton label="Mark Delivered" icon="checkmark-done-outline" variant="success" onPress={onMarkDelivered} disabled={updating} />
            )}
            {stop.type === 'delivery' && onUnableToDeliver && (
              <RouteActionButton label="Unable to Deliver" icon="close-outline" variant="danger" onPress={onUnableToDeliver} disabled={updating} />
            )}
          </View>
        )}

        {stop.state === 'upcoming' && (
          <View style={styles.stopActionsRow}>
            <RouteActionButton label="Navigate" icon="navigate-outline" variant="neutral" onPress={onNavigate} />
          </View>
        )}
      </View>
    </View>
  );
};

// ── Vertical timeline wrapper ──────────────────────────────────────────────
export const RouteStopTimeline: React.FC<{
  stops: RouteStop[];
  updatingId: string | null;
  onNavigate: (stop: RouteStop) => void;
  onCall: (stop: RouteStop) => void;
  onMarkArrived: (stop: RouteStop) => void;
  onMarkDelivered: (stop: RouteStop) => void;
  onUnableToDeliver: (stop: RouteStop) => void;
}> = ({ stops, updatingId, onNavigate, onCall, onMarkArrived, onMarkDelivered, onUnableToDeliver }) => (
  <View>
    {stops.map((stop, idx) => (
      <RouteStopCard
        key={stop.id}
        stop={stop}
        isLast={idx === stops.length - 1}
        onNavigate={() => onNavigate(stop)}
        onCall={() => onCall(stop)}
        onMarkArrived={() => onMarkArrived(stop)}
        onMarkDelivered={() => onMarkDelivered(stop)}
        onUnableToDeliver={() => onUnableToDeliver(stop)}
        updating={updatingId === stop.id}
      />
    ))}
  </View>
);

// ── Route alert row (compact) ──────────────────────────────────────────────
export const RouteAlertRow: React.FC<{ item: RouteAlertItem }> = ({ item }) => {
  const iconByType: Record<string, string> = {
    cancelled: 'close-circle-outline',
    delayed: 'time-outline',
    updated: 'create-outline',
    added: 'add-circle-outline',
    changed: 'swap-horizontal-outline',
  };
  const colorByType: Record<string, string> = {
    cancelled: COLORS.danger,
    delayed: COLORS.amber,
    updated: COLORS.primary,
    added: COLORS.secondary,
    changed: '#7C3AED',
  };
  return (
    <View style={styles.alertRow}>
      <Ionicons name={(iconByType[item.type] ?? 'information-circle-outline') as keyof typeof Ionicons.glyphMap} size={16} color={colorByType[item.type] ?? COLORS.slate} />
      <View style={{ flex: 1, marginLeft: 10 }}>
        <Text style={styles.alertMessage}>{item.message}</Text>
        <Text style={styles.alertTime}>{item.time}</Text>
      </View>
    </View>
  );
};

// ── Empty state ─────────────────────────────────────────────────────────────
export const RouteEmptyState: React.FC = () => (
  <View style={styles.emptyWrap}>
    <View style={styles.emptyIconWrap}>
      <Ionicons name="car-outline" size={30} color={COLORS.slateLight} />
    </View>
    <Text style={styles.emptyTitle}>No deliveries assigned for today.</Text>
    <Text style={styles.emptySubtitle}>Your route will appear here when deliveries are assigned.</Text>
  </View>
);

const styles = StyleSheet.create({
  sectionHeaderRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  sectionHeaderText: { fontFamily: FONT_FAMILY, fontSize: 15, fontWeight: '700', color: COLORS.ink },

  // Summary card
  summaryCard: { backgroundColor: COLORS.card, borderRadius: 14, borderWidth: 1, borderColor: COLORS.border, padding: 14 },
  summaryIconWrap: { width: 34, height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  summaryValue: { fontFamily: FONT_FAMILY, fontSize: 18, fontWeight: '700', color: COLORS.ink },
  summaryLabel: { fontFamily: FONT_FAMILY, fontSize: 11.5, color: COLORS.slate, marginTop: 2 },

  // Progress
  progressWrap: { backgroundColor: COLORS.card, borderRadius: 14, borderWidth: 1, borderColor: COLORS.border, padding: 14 },
  progressLabelRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  progressLabel: { fontFamily: FONT_FAMILY, fontSize: 12.5, fontWeight: '600', color: COLORS.ink },
  progressValue: { fontFamily: FONT_FAMILY, fontSize: 12.5, fontWeight: '700', color: COLORS.primary },
  progressTrack: { height: 8, borderRadius: 4, backgroundColor: '#EEF2F7', overflow: 'hidden' },
  progressFill: { height: 8, borderRadius: 4, backgroundColor: COLORS.primary },

  // Map placeholder
  mapCard: { backgroundColor: COLORS.card, borderRadius: 16, borderWidth: 1, borderColor: COLORS.border, padding: 16 },
  mapHeaderRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  mapDriverBadge: { width: 34, height: 34, borderRadius: 10, backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center' },
  mapTitle: { fontFamily: FONT_FAMILY, fontSize: 14, fontWeight: '700', color: COLORS.ink },
  mapSubtitle: { fontFamily: FONT_FAMILY, fontSize: 10.5, color: COLORS.slateLight, marginTop: 2 },
  mapStopsCol: { paddingLeft: 2 },
  mapStopRow: { flexDirection: 'row' },
  mapStopLineCol: { alignItems: 'center', width: 26 },
  mapStopDot: { width: 22, height: 22, borderRadius: 11, backgroundColor: '#E2E8F0', alignItems: 'center', justifyContent: 'center' },
  mapStopDotCompleted: { backgroundColor: COLORS.secondary },
  mapStopDotCurrent: { backgroundColor: COLORS.primary },
  mapStopDotText: { fontFamily: FONT_FAMILY, fontSize: 10.5, fontWeight: '700', color: COLORS.slate },
  mapStopConnector: { width: 2, flex: 1, minHeight: 18, backgroundColor: '#E2E8F0', marginVertical: 2 },
  mapStopConnectorDone: { backgroundColor: COLORS.secondary },
  mapStopType: { fontFamily: FONT_FAMILY, fontSize: 9.5, fontWeight: '700', color: COLORS.slateLight, letterSpacing: 0.5 },
  mapStopName: { fontFamily: FONT_FAMILY, fontSize: 12.5, fontWeight: '600', color: COLORS.ink, marginTop: 1 },
  mapMoreText: { fontFamily: FONT_FAMILY, fontSize: 11, color: COLORS.slateLight, marginTop: 2, marginLeft: 30 },

  // Next delivery
  nextCard: { backgroundColor: COLORS.card, borderRadius: 16, borderWidth: 1, borderColor: COLORS.border, padding: 16 },
  nextCardEmpty: { alignItems: 'center', gap: 8, paddingVertical: 24 },
  nextEmptyText: { fontFamily: FONT_FAMILY, fontSize: 12.5, color: COLORS.slate, textAlign: 'center' },
  nextLabel: { fontFamily: FONT_FAMILY, fontSize: 10.5, fontWeight: '700', color: COLORS.primary, letterSpacing: 0.6 },
  nextOrderId: { fontFamily: FONT_FAMILY, fontSize: 17, fontWeight: '700', color: COLORS.ink, marginTop: 2, marginBottom: 10 },
  nextInfoRow: { marginBottom: 8 },
  nextInfoRowSplit: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 4, marginBottom: 4 },
  nextInfoLabel: { fontFamily: FONT_FAMILY, fontSize: 10.5, color: COLORS.slateLight },
  nextInfoValue: { fontFamily: FONT_FAMILY, fontSize: 13, fontWeight: '600', color: COLORS.ink, marginTop: 1 },
  nextActionsRow: { flexDirection: 'row', gap: 8, marginTop: 14, flexWrap: 'wrap' },
  navigateBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: COLORS.primary, paddingHorizontal: 14, paddingVertical: 10, borderRadius: 12, flexGrow: 1, justifyContent: 'center' },
  navigateBtnText: { fontFamily: FONT_FAMILY, color: '#FFFFFF', fontSize: 12.5, fontWeight: '700' },
  callBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: COLORS.primaryLight, paddingHorizontal: 14, paddingVertical: 10, borderRadius: 12, flexGrow: 1, justifyContent: 'center' },
  callBtnText: { fontFamily: FONT_FAMILY, color: COLORS.primary, fontSize: 12.5, fontWeight: '700' },

  // Generic action button
  actionBtn: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 11, paddingVertical: 8, borderRadius: 10 },
  actionPrimary: { backgroundColor: COLORS.primary },
  actionSuccess: { backgroundColor: COLORS.secondary },
  actionDanger: { backgroundColor: COLORS.danger },
  actionNeutral: { backgroundColor: COLORS.bg, borderWidth: 1, borderColor: COLORS.border },
  actionTextLight: { fontFamily: FONT_FAMILY, fontSize: 11.5, fontWeight: '700', color: '#FFFFFF' },
  actionTextNeutral: { fontFamily: FONT_FAMILY, fontSize: 11.5, fontWeight: '700', color: COLORS.ink },

  // Badge
  badge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 9, paddingVertical: 4, borderRadius: 8 },
  badgeText: { fontFamily: FONT_FAMILY, fontSize: 10.5, fontWeight: '700' },

  // Stop timeline
  stopRow: { flexDirection: 'row' },
  stopLineCol: { alignItems: 'center', width: 34 },
  stopNumberCircle: { width: 26, height: 26, borderRadius: 13, backgroundColor: '#E2E8F0', alignItems: 'center', justifyContent: 'center' },
  stopNumberCircleCompleted: { backgroundColor: COLORS.secondary },
  stopNumberCircleCurrent: { backgroundColor: COLORS.primary },
  stopNumberText: { fontFamily: FONT_FAMILY, fontSize: 11.5, fontWeight: '700', color: COLORS.slate },
  stopConnector: { width: 2, flex: 1, minHeight: 40, backgroundColor: '#E2E8F0', marginVertical: 2 },
  stopConnectorDone: { backgroundColor: COLORS.secondary },
  stopCard: { flex: 1, backgroundColor: COLORS.card, borderRadius: 14, borderWidth: 1, borderColor: COLORS.border, padding: 14, marginBottom: 14 },
  stopCardCurrent: { borderColor: COLORS.primary, borderWidth: 1.5 },
  stopCardHeader: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' },
  stopTypeLabel: { fontFamily: FONT_FAMILY, fontSize: 9.5, fontWeight: '700', color: COLORS.slateLight, letterSpacing: 0.6 },
  stopOrderId: { fontFamily: FONT_FAMILY, fontSize: 13, fontWeight: '700', color: COLORS.ink, marginTop: 1 },
  stopName: { fontFamily: FONT_FAMILY, fontSize: 13.5, fontWeight: '700', color: COLORS.ink, marginTop: 8 },
  stopAddress: { fontFamily: FONT_FAMILY, fontSize: 12, color: COLORS.slate, marginTop: 2 },
  stopMetaRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8 },
  stopMetaText: { fontFamily: FONT_FAMILY, fontSize: 11.5, color: COLORS.slateLight },
  stopMetaDot: { color: COLORS.slateLight },
  stopActionsRow: { flexDirection: 'row', gap: 8, marginTop: 12, flexWrap: 'wrap' },

  // Alerts
  alertRow: { flexDirection: 'row', alignItems: 'flex-start', paddingVertical: 8 },
  alertMessage: { fontFamily: FONT_FAMILY, fontSize: 12.5, color: COLORS.ink, fontWeight: '600' },
  alertTime: { fontFamily: FONT_FAMILY, fontSize: 10.5, color: COLORS.slateLight, marginTop: 1 },

  // Empty state
  emptyWrap: { alignItems: 'center', paddingVertical: 48, paddingHorizontal: 24 },
  emptyIconWrap: { width: 64, height: 64, borderRadius: 32, backgroundColor: COLORS.bg, alignItems: 'center', justifyContent: 'center', marginBottom: 14 },
  emptyTitle: { fontFamily: FONT_FAMILY, fontSize: 14, fontWeight: '700', color: COLORS.ink, textAlign: 'center' },
  emptySubtitle: { fontFamily: FONT_FAMILY, fontSize: 12, color: COLORS.slate, textAlign: 'center', marginTop: 6 },
});