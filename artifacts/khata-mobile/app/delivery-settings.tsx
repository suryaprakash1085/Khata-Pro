// TARGET PATH: artifacts/khata-mobile/app/delivery-settings.tsx
//
// Uses the Orval-generated hooks from @workspace/api-client-react
// (GET /api/delivery-fees/settings, PUT /api/delivery-fees/settings).

import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Switch, ScrollView, ActivityIndicator } from 'react-native';
import { Feather } from '@expo/vector-icons';
import {
  useGetDeliveryFeeSettings,
  useUpdateDeliveryFeeSettings,
} from '@workspace/api-client-react';

const ACCENT = '#7C3AED';
const TEXT_DARK = '#1E293B';
const TEXT_MUTED = '#64748B';
const BORDER = '#E2E8F0';
const CARD_BG = '#FFFFFF';
const PAGE_BG = '#F8FAFC';
const GREEN = '#16A34A';
const GREEN_BG = '#F0FDF4';
const BLUE = '#2563EB';
const BLUE_BG = '#EFF6FF';

function computeExampleFee(distance: number, radius: number, perKm: number) {
  if (distance <= radius) return 0;
  const chargeable = Math.ceil(distance - radius);
  return chargeable * perKm;
}

export default function DeliverySettingsScreen() {
  const { data, isLoading, isError } = useGetDeliveryFeeSettings();

  const [radius, setRadius] = useState('5');
  const [perKm, setPerKm] = useState('2');
  const [isActive, setIsActive] = useState(true);
  const [savedMessage, setSavedMessage] = useState(false);
  const [fieldError, setFieldError] = useState<string | null>(null);

  useEffect(() => {
    if (data) {
      setRadius(String(data.free_delivery_radius));
      setPerKm(String(data.per_km_charge));
      setIsActive(data.is_active);
    }
  }, [data]);

  const { mutate: updateSettings, isPending } = useUpdateDeliveryFeeSettings({
    mutation: {
      onSuccess: () => {
        setSavedMessage(true);
        setTimeout(() => setSavedMessage(false), 3000);
      },
    },
  });

  const handleSave = () => {
    const radiusNum = parseFloat(radius);
    const perKmNum = parseFloat(perKm);

    if (Number.isNaN(radiusNum) || radiusNum <= 0) {
      setFieldError('Free Delivery Radius must be a number greater than 0.');
      return;
    }
    if (Number.isNaN(perKmNum) || perKmNum < 0) {
      setFieldError('Additional Delivery Charge must be a valid non-negative number.');
      return;
    }
    setFieldError(null);
    updateSettings({
      data: {
        free_delivery_radius: radiusNum,
        per_km_charge: perKmNum,
        is_active: isActive,
      },
    });
  };

  if (isLoading) {
    return (
      <View style={styles.centerFill}>
        <ActivityIndicator size="large" color={ACCENT} />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.centerFill}>
        <Text style={styles.errorText}>Couldn't load delivery settings. Please try again.</Text>
      </View>
    );
  }

  const radiusNum = parseFloat(radius) || 0;
  const perKmNum = parseFloat(perKm) || 0;
  const exampleDistance = radiusNum + 3; // matches the "3 KM extra" example pattern
  const exampleFee = computeExampleFee(exampleDistance, radiusNum, perKmNum);

  const examples = [2, 5, 6, 8, 10, 12.5];

  return (
    <ScrollView style={styles.page} contentContainerStyle={{ padding: 24 }}>
      <Text style={styles.pageTitle}>Delivery Settings</Text>
      <Text style={styles.pageSubtitle}>
        Configure delivery charges based on the distance between your shop and the customer's delivery location.
      </Text>

      {/* Delivery Fee Configuration */}
      <View style={styles.card}>
        <View style={styles.cardHeaderRow}>
          <View style={styles.accentBar} />
          <Text style={styles.cardTitle}>Delivery Fee Configuration</Text>
        </View>

        <View style={styles.fieldsRow}>
          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Free Delivery Radius</Text>
            <View style={styles.inputRow}>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={radius}
                onChangeText={setRadius}
              />
              <View style={styles.inputSuffix}>
                <Text style={styles.inputSuffixText}>KM</Text>
              </View>
            </View>
            <Text style={styles.fieldHelper}>Orders within this distance are delivered free of charge.</Text>
          </View>

          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Additional Delivery Charge</Text>
            <View style={styles.inputRow}>
              <View style={styles.inputPrefix}>
                <Text style={styles.inputPrefixText}>₹</Text>
              </View>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={perKm}
                onChangeText={setPerKm}
              />
              <View style={styles.inputSuffix}>
                <Text style={styles.inputSuffixText}>/ KM</Text>
              </View>
            </View>
            <Text style={styles.fieldHelper}>Charge applied for each additional kilometer beyond the free delivery radius.</Text>
          </View>

          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Enable Distance-Based Delivery Fees</Text>
            <View style={styles.toggleRow}>
              <Switch
                value={isActive}
                onValueChange={setIsActive}
                trackColor={{ false: BORDER, true: ACCENT }}
                thumbColor="#fff"
              />
              <Text style={[styles.toggleLabel, { color: isActive ? GREEN : TEXT_MUTED }]}>
                {isActive ? 'ON' : 'OFF'}
              </Text>
            </View>
            <Text style={styles.fieldHelper}>When disabled, distance-based delivery fees will not be applied.</Text>
          </View>
        </View>

        {fieldError && <Text style={styles.errorText}>{fieldError}</Text>}

        <View style={styles.saveRow}>
          <Pressable
            style={({ pressed }) => [styles.saveButton, pressed && { opacity: 0.85 }]}
            onPress={handleSave}
            disabled={isPending}
          >
            <Feather name="save" size={16} color="#fff" />
            <Text style={styles.saveButtonText}>
              {isPending ? 'Saving...' : 'Save Changes'}
            </Text>
          </Pressable>
        </View>

        {savedMessage && (
          <View style={styles.toast}>
            <Feather name="check-circle" size={16} color={GREEN} />
            <Text style={styles.toastText}>Delivery settings updated successfully.</Text>
          </View>
        )}
      </View>

      <View style={styles.twoColRow}>
        {/* Current Delivery Policy */}
        <View style={[styles.card, styles.halfCard]}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.accentBar} />
            <Text style={styles.cardTitle}>Current Delivery Policy</Text>
          </View>

          <View style={styles.policyRow}>
            <View style={[styles.policyIcon, { backgroundColor: GREEN_BG }]}>
              <Feather name="gift" size={18} color={GREEN} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.policyTitle}>Free delivery up to {radiusNum} KM</Text>
              <Text style={styles.policySubtitle}>Orders within {radiusNum} KM are delivered free of charge.</Text>
            </View>
          </View>

          <View style={styles.policyRow}>
            <View style={[styles.policyIcon, { backgroundColor: BLUE_BG }]}>
              <Feather name="truck" size={18} color={BLUE} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.policyTitle}>₹{perKmNum} per additional KM</Text>
              <Text style={styles.policySubtitle}>Charge applied for every additional kilometer beyond {radiusNum} KM.</Text>
            </View>
          </View>

          <View style={styles.exampleBox}>
            <Text style={styles.exampleLabel}>Example</Text>
            <Text style={styles.exampleMain}>
              {exampleDistance} KM delivery → ₹{exampleFee} delivery fee
            </Text>
            <Text style={styles.exampleSub}>(3 KM extra × ₹{perKmNum} = ₹{exampleFee})</Text>
          </View>
        </View>

        {/* Distance & Charge Examples */}
        <View style={[styles.card, styles.halfCard]}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.accentBar} />
            <Text style={styles.cardTitle}>Distance & Charge Examples</Text>
          </View>

          <View style={styles.table}>
            <View style={styles.tableHeaderRow}>
              <Text style={[styles.tableHeaderCell, { flex: 1 }]}>Total Distance</Text>
              <Text style={[styles.tableHeaderCell, { flex: 1.3 }]}>Chargeable Distance</Text>
              <Text style={[styles.tableHeaderCell, { flex: 1 }]}>Delivery Fee</Text>
            </View>
            {examples.map((dist) => {
              const chargeable = dist <= radiusNum ? 0 : Math.ceil(dist - radiusNum);
              const fee = chargeable * perKmNum;
              const isFree = dist <= radiusNum;
              return (
                <View key={dist} style={styles.tableRow}>
                  <Text style={[styles.tableCell, { flex: 1 }]}>
                    {dist} KM{Number.isInteger(dist) ? '' : ' (Rounded Up)'}
                  </Text>
                  <Text style={[styles.tableCell, { flex: 1.3 }]}>{chargeable} KM</Text>
                  {isFree ? (
                    <View style={{ flex: 1 }}>
                      <Text style={styles.freeBadge}>FREE</Text>
                    </View>
                  ) : (
                    <Text style={[styles.tableCell, { flex: 1 }]}>₹{fee}</Text>
                  )}
                </View>
              );
            })}
          </View>
          <Text style={styles.tableFootnote}>Chargeable distance is rounded up to the next whole kilometer.</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: PAGE_BG },
  centerFill: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  pageTitle: { fontSize: 24, fontWeight: '700', color: TEXT_DARK, fontFamily: 'Times New Roman' },
  pageSubtitle: { fontSize: 14, color: TEXT_MUTED, marginTop: 4, marginBottom: 20, fontFamily: 'Times New Roman' },
  card: { backgroundColor: CARD_BG, borderRadius: 12, padding: 20, borderWidth: 1, borderColor: BORDER, marginBottom: 20 },
  halfCard: { flex: 1 },
  twoColRow: { flexDirection: 'row', gap: 20 },
  cardHeaderRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16, gap: 10 },
  accentBar: { width: 4, height: 18, backgroundColor: ACCENT, borderRadius: 2 },
  cardTitle: { fontSize: 16, fontWeight: '700', color: TEXT_DARK, fontFamily: 'Times New Roman' },
  fieldsRow: { flexDirection: 'row', gap: 24, flexWrap: 'wrap' },
  field: { flex: 1, minWidth: 200 },
  fieldLabel: { fontSize: 13, fontWeight: '600', color: TEXT_DARK, marginBottom: 8, fontFamily: 'Times New Roman' },
  inputRow: { flexDirection: 'row', alignItems: 'stretch', borderWidth: 1, borderColor: BORDER, borderRadius: 8, overflow: 'hidden' },
  input: { flex: 1, paddingHorizontal: 12, paddingVertical: 10, fontSize: 15, color: TEXT_DARK, fontFamily: 'Times New Roman' },
  inputPrefix: { paddingHorizontal: 10, justifyContent: 'center', backgroundColor: PAGE_BG, borderRightWidth: 1, borderRightColor: BORDER },
  inputPrefixText: { color: TEXT_MUTED, fontFamily: 'Times New Roman' },
  inputSuffix: { paddingHorizontal: 10, justifyContent: 'center', backgroundColor: PAGE_BG, borderLeftWidth: 1, borderLeftColor: BORDER },
  inputSuffixText: { color: TEXT_MUTED, fontFamily: 'Times New Roman' },
  fieldHelper: { fontSize: 12, color: TEXT_MUTED, marginTop: 6, fontFamily: 'Times New Roman' },
  toggleRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 4 },
  toggleLabel: { fontSize: 13, fontWeight: '700', fontFamily: 'Times New Roman' },
  saveRow: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 20 },
  saveButton: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: ACCENT, paddingHorizontal: 18, paddingVertical: 12, borderRadius: 8 },
  saveButtonText: { color: '#fff', fontWeight: '600', fontFamily: 'Times New Roman' },
  toast: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 12, padding: 10, backgroundColor: GREEN_BG, borderRadius: 8 },
  toastText: { color: GREEN, fontSize: 13, fontFamily: 'Times New Roman' },
  policyRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 16 },
  policyIcon: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  policyTitle: { fontSize: 14, fontWeight: '600', color: TEXT_DARK, fontFamily: 'Times New Roman' },
  policySubtitle: { fontSize: 12, color: TEXT_MUTED, marginTop: 2, fontFamily: 'Times New Roman' },
  exampleBox: { borderWidth: 1, borderColor: ACCENT, borderStyle: 'dashed', borderRadius: 8, padding: 12, backgroundColor: '#FAF5FF', marginTop: 8 },
  exampleLabel: { fontSize: 12, color: ACCENT, fontWeight: '600', fontFamily: 'Times New Roman' },
  exampleMain: { fontSize: 15, fontWeight: '700', color: TEXT_DARK, marginTop: 4, fontFamily: 'Times New Roman' },
  exampleSub: { fontSize: 12, color: TEXT_MUTED, marginTop: 2, fontFamily: 'Times New Roman' },
  table: { marginTop: 4 },
  tableHeaderRow: { flexDirection: 'row', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: BORDER },
  tableHeaderCell: { fontSize: 12, fontWeight: '700', color: TEXT_MUTED, fontFamily: 'Times New Roman' },
  tableRow: { flexDirection: 'row', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: BORDER, alignItems: 'center' },
  tableCell: { fontSize: 13, color: TEXT_DARK, fontFamily: 'Times New Roman' },
  freeBadge: { color: GREEN, backgroundColor: GREEN_BG, fontSize: 11, fontWeight: '700', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10, alignSelf: 'flex-start', fontFamily: 'Times New Roman' },
  tableFootnote: { fontSize: 11, color: TEXT_MUTED, marginTop: 10, fontFamily: 'Times New Roman' },
  errorText: { color: '#DC2626', fontSize: 13, marginTop: 8, fontFamily: 'Times New Roman' },
});