import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from './DriverHomeComponents';

const FONT_FAMILY = Platform.select({
  web: '"Times New Roman", Times, serif',
  default: 'Times New Roman',
});

type StepKey = 'assigned' | 'accepted' | 'picked_up' | 'in_transit' | 'arrived' | 'delivered';

interface DeliveryLike {
  status: string;
  assigned_at?: string | null;
  accepted_at?: string | null;
  picked_up_at?: string | null;
  started_at?: string | null;
  arrived_at?: string | null;
  delivered_at?: string | null;
}

const STEP_DEFS: { key: StepKey; label: string; icon: keyof typeof Ionicons.glyphMap; tsField: keyof DeliveryLike }[] = [
  { key: 'assigned', label: 'Assigned', icon: 'clipboard-outline', tsField: 'assigned_at' },
  { key: 'accepted', label: 'Accepted', icon: 'checkmark-outline', tsField: 'accepted_at' },
  { key: 'picked_up', label: 'Picked Up', icon: 'cube-outline', tsField: 'picked_up_at' },
  { key: 'in_transit', label: 'Out for Delivery', icon: 'bicycle-outline', tsField: 'started_at' },
  { key: 'arrived', label: 'Arrived', icon: 'location-outline', tsField: 'arrived_at' },
];

function formatTime(iso?: string | null) {
  if (!iso) return null;
  return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

interface Props {
  delivery: DeliveryLike;
}

/**
 * Renders each step purely from real backend timestamps — a step is only
 * marked "done" when its timestamp field is present. No fake progress.
 */
export const DeliveryProgressStepper: React.FC<Props> = ({ delivery }) => {
  if (delivery.status === 'cancelled') return null;

  const steps = STEP_DEFS.map((def) => {
    const ts = delivery[def.tsField] as string | null | undefined;
    return { ...def, timestamp: ts, done: !!ts };
  });

  const lastDoneIndex = steps.reduce((acc, s, i) => (s.done ? i : acc), -1);
  const allDone = delivery.status === 'delivered';

  return (
    <View style={styles.wrap}>
      {steps.map((step, i) => {
        const isDone = step.done || allDone;
        const isCurrent = !isDone && i === lastDoneIndex + 1;
        const isLast = i === steps.length - 1;

        return (
          <View key={step.key} style={styles.stepCol}>
            <View style={styles.rowCenter}>
              <View style={[styles.dot, isDone && styles.dotDone, isCurrent && styles.dotCurrent]}>
                <Ionicons
                  name={isDone ? 'checkmark' : step.icon}
                  size={13}
                  color={isDone || isCurrent ? '#FFFFFF' : COLORS.slateLight}
                />
              </View>
              {!isLast && <View style={[styles.line, isDone && styles.lineDone]} />}
            </View>
            <Text numberOfLines={1} style={[styles.label, (isDone || isCurrent) && styles.labelActive, isCurrent && styles.labelCurrent]}>
              {step.label}
            </Text>
            {step.timestamp ? <Text style={styles.time}>{formatTime(step.timestamp)}</Text> : <Text style={styles.time}> </Text>}
          </View>
        );
      })}
    </View>
  );
};

const DOT_SIZE = 26;

const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', alignItems: 'flex-start' },
  stepCol: { flex: 1, alignItems: 'center' },
  rowCenter: { flexDirection: 'row', alignItems: 'center', width: '100%' },
  dot: { width: DOT_SIZE, height: DOT_SIZE, borderRadius: DOT_SIZE / 2, backgroundColor: COLORS.border, alignItems: 'center', justifyContent: 'center' },
  dotDone: { backgroundColor: COLORS.secondary },
  dotCurrent: { backgroundColor: COLORS.amber },
  line: { flex: 1, height: 3, backgroundColor: COLORS.border, marginHorizontal: -2 },
  lineDone: { backgroundColor: COLORS.secondary },
  label: { fontFamily: FONT_FAMILY, fontSize: 9.5, color: COLORS.slateLight, marginTop: 6, textAlign: 'center' },
  labelActive: { color: COLORS.ink, fontWeight: '700' },
  labelCurrent: { color: COLORS.amber },
  time: { fontFamily: FONT_FAMILY, fontSize: 9, color: COLORS.slate, marginTop: 2 },
});

export default DeliveryProgressStepper;