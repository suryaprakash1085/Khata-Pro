import React, { useState } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import {
  GST_STATE_CODES,
  INDIAN_STATES,
  type VendorFormErrors,
  type VendorFormValues,
} from '@/lib/vendorForm';

const FONT = Platform.OS === 'android' ? 'serif' : 'Times New Roman';
const PURPLE = '#7C3AED';
const LABEL_WIDTH = 150;

type Props = {
  values: VendorFormValues;
  errors: VendorFormErrors;
  onChange: (patch: Partial<VendorFormValues>) => void;
  /** 'row' = label left / input right (Add Customer page). 'stack' = label above (popup). */
  layout: 'row' | 'stack';
  /** Popup mode: shows Name, Phone, GSTIN first, rest behind "More details". */
  collapsible?: boolean;
  phoneRequired?: boolean;
  autoFocusName?: boolean;
};

// ---- helpers defined OUTSIDE the main component so inputs don't remount (and lose focus) on every keystroke ----

function Field({
  label,
  required,
  error,
  hint,
  isRow,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  isRow: boolean;
  children: React.ReactNode;
}) {
  const colors = useColors();
  const labelEl = (
    <>
      {label}
      {required ? <Text style={{ color: colors.destructive }}> *</Text> : null}
    </>
  );
  const extras = (
    <>
      {hint && !error ? <Text style={[styles.hint, { color: colors.mutedForeground, fontFamily: FONT }]}>{hint}</Text> : null}
      {error ? <Text style={[styles.error, { color: colors.destructive, fontFamily: FONT }]}>{error}</Text> : null}
    </>
  );

  if (isRow) {
    return (
      <>
        <View style={styles.row}>
          <Text style={[styles.label, { color: colors.mutedForeground, width: LABEL_WIDTH, fontFamily: FONT }]}>
            {labelEl}
          </Text>
          <View style={styles.rowRight}>
            {children}
            {extras}
          </View>
        </View>
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
      </>
    );
  }
  return (
    <View style={styles.stackWrap}>
      <Text style={[styles.stackLabel, { color: colors.mutedForeground, fontFamily: FONT }]}>{labelEl}</Text>
      {children}
      {extras}
    </View>
  );
}

function SectionTitle({ title, isRow }: { title: string; isRow: boolean }) {
  return <Text style={[styles.sectionTitle, { fontFamily: FONT, marginTop: isRow ? 20 : 12 }]}>{title}</Text>;
}

function Chip({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  const colors = useColors();
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.chip,
        { backgroundColor: active ? PURPLE : colors.background, borderColor: active ? PURPLE : colors.border },
      ]}
    >
      <Text style={[styles.chipText, { color: active ? '#FFFFFF' : colors.foreground, fontFamily: FONT }]}>{label}</Text>
    </Pressable>
  );
}

function StatePicker({ value, onSelect, error }: { value: string; onSelect: (s: string) => void; error?: string }) {
  const colors = useColors();
  const [open, setOpen] = useState(false);
  return (
    <View>
      <Pressable
        onPress={() => setOpen((o) => !o)}
        style={[
          styles.input,
          styles.select,
          { borderColor: error ? colors.destructive : colors.border, backgroundColor: colors.background },
        ]}
      >
        <Text style={{ fontSize: 14, fontFamily: FONT, color: value ? colors.foreground : colors.mutedForeground }}>
          {value || 'Select state'}
        </Text>
        <Ionicons name={open ? 'chevron-up' : 'chevron-down'} size={16} color={colors.mutedForeground} />
      </Pressable>
      {open ? (
        <View style={[styles.dropdown, { borderColor: colors.border, backgroundColor: colors.background }]}>
          <ScrollView style={{ maxHeight: 200 }} nestedScrollEnabled keyboardShouldPersistTaps="handled">
            {INDIAN_STATES.map((s) => (
              <Pressable
                key={s}
                onPress={() => {
                  onSelect(s);
                  setOpen(false);
                }}
                style={[styles.option, { borderBottomColor: colors.border }, s === value ? { backgroundColor: '#F3E8FF' } : null]}
              >
                <Text style={{ fontSize: 14, fontFamily: FONT, color: colors.foreground }}>{s}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      ) : null}
    </View>
  );
}

// ---- main component ----

export function VendorFormFields({ values, errors, onChange, layout, collapsible, phoneRequired, autoFocusName }: Props) {
  const colors = useColors();
  const [expanded, setExpanded] = useState(false);
  const isRow = layout === 'row';
  const showMore = !collapsible || expanded;

  const inputStyle = (err?: string) => [
    styles.input,
    {
      color: colors.foreground,
      borderColor: err ? colors.destructive : colors.border,
      backgroundColor: colors.background,
      fontFamily: FONT,
    },
  ];

  const handleGstin = (t: string) => {
    const g = t.toUpperCase().replace(/[^0-9A-Z]/g, '').slice(0, 15);
    const patch: Partial<VendorFormValues> = { gstNumber: g };
    // auto-fill state from the GSTIN state code, only if state is still empty
    if (!values.state && g.length >= 2) {
      const st = GST_STATE_CODES[g.slice(0, 2)];
      if (st) patch.state = st;
    }
    onChange(patch);
  };

  return (
    <View>
      {showMore ? <SectionTitle title="BASIC DETAILS" isRow={isRow} /> : null}

      <Field label="Vendor name" required error={errors.name} isRow={isRow}>
        <TextInput
          value={values.name}
          onChangeText={(t) => onChange({ name: t })}
          placeholder="Sri Balaji Traders"
          placeholderTextColor={colors.mutedForeground}
          autoFocus={autoFocusName}
          style={inputStyle(errors.name)}
        />
      </Field>

      {showMore ? (
        <Field label="Company name" error={errors.companyName} isRow={isRow}>
          <TextInput
            value={values.companyName}
            onChangeText={(t) => onChange({ companyName: t })}
            placeholder="Balaji Textiles Pvt Ltd"
            placeholderTextColor={colors.mutedForeground}
            style={inputStyle(errors.companyName)}
          />
        </Field>
      ) : null}

      <Field label="Phone number" required={phoneRequired} error={errors.phone} isRow={isRow}>
        <TextInput
          value={values.phone}
          onChangeText={(t) => onChange({ phone: t })}
          placeholder="98765 43210"
          placeholderTextColor={colors.mutedForeground}
          keyboardType="phone-pad"
          style={inputStyle(errors.phone)}
        />
      </Field>

      {showMore ? (
        <>
          <Field label="Alternate phone" error={errors.alternatePhone} isRow={isRow}>
            <TextInput
              value={values.alternatePhone}
              onChangeText={(t) => onChange({ alternatePhone: t })}
              placeholder="WhatsApp / other number"
              placeholderTextColor={colors.mutedForeground}
              keyboardType="phone-pad"
              style={inputStyle(errors.alternatePhone)}
            />
          </Field>
          <Field label="Email" error={errors.email} isRow={isRow}>
            <TextInput
              value={values.email}
              onChangeText={(t) => onChange({ email: t })}
              placeholder="vendor@example.com"
              placeholderTextColor={colors.mutedForeground}
              keyboardType="email-address"
              autoCapitalize="none"
              style={inputStyle(errors.email)}
            />
          </Field>
          <SectionTitle title="TAX DETAILS" isRow={isRow} />
        </>
      ) : null}

      <Field
        label="GSTIN"
        error={errors.gstNumber}
        hint="15 characters. State auto-fills from the first 2 digits."
        isRow={isRow}
      >
        <TextInput
          value={values.gstNumber}
          onChangeText={handleGstin}
          placeholder="33ABCDE1234F1Z5"
          placeholderTextColor={colors.mutedForeground}
          autoCapitalize="characters"
          maxLength={15}
          style={inputStyle(errors.gstNumber)}
        />
      </Field>

      {showMore ? (
        <>
          <Field label="PAN number" error={errors.panNumber} isRow={isRow}>
            <TextInput
              value={values.panNumber}
              onChangeText={(t) => onChange({ panNumber: t.toUpperCase().replace(/[^0-9A-Z]/g, '').slice(0, 10) })}
              placeholder="ABCDE1234F"
              placeholderTextColor={colors.mutedForeground}
              autoCapitalize="characters"
              maxLength={10}
              style={inputStyle(errors.panNumber)}
            />
          </Field>

          <SectionTitle title="ADDRESS" isRow={isRow} />
          <Field label="Address" error={errors.address} isRow={isRow}>
            <TextInput
              value={values.address}
              onChangeText={(t) => onChange({ address: t })}
              placeholder="Shop no, street"
              placeholderTextColor={colors.mutedForeground}
              style={inputStyle(errors.address)}
            />
          </Field>
          <Field label="City" error={errors.city} isRow={isRow}>
            <TextInput
              value={values.city}
              onChangeText={(t) => onChange({ city: t })}
              placeholder="Chennai"
              placeholderTextColor={colors.mutedForeground}
              style={inputStyle(errors.city)}
            />
          </Field>
          <Field label="State" error={errors.state} isRow={isRow}>
            <StatePicker value={values.state} onSelect={(s) => onChange({ state: s })} error={errors.state} />
          </Field>
          <Field label="Pincode" error={errors.pincode} isRow={isRow}>
            <TextInput
              value={values.pincode}
              onChangeText={(t) => onChange({ pincode: t.replace(/\D/g, '').slice(0, 6) })}
              placeholder="600001"
              placeholderTextColor={colors.mutedForeground}
              keyboardType="number-pad"
              maxLength={6}
              style={inputStyle(errors.pincode)}
            />
          </Field>
        </>
      ) : null}

      {collapsible ? (
        <Pressable onPress={() => setExpanded((e) => !e)} style={styles.moreBtn} hitSlop={8}>
          <Text style={{ color: PURPLE, fontSize: 13, fontWeight: '600', fontFamily: FONT }}>
            {expanded ? 'Fewer details' : 'More details (company, address, opening balance…)'}
          </Text>
          <Ionicons name={expanded ? 'chevron-up' : 'chevron-down'} size={14} color={PURPLE} />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-start', paddingVertical: 14, gap: 16 },
  label: { fontSize: 14, paddingTop: 10 },
  rowRight: { flex: 1, maxWidth: 420 },
  divider: { height: 1, opacity: 0.6 },
  stackWrap: { marginBottom: 12, gap: 4 },
  stackLabel: { fontSize: 12, fontWeight: '500' },
  input: { borderWidth: 1, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 9, fontSize: 14 },
  hint: { fontSize: 11, marginTop: 4 },
  error: { fontSize: 12, marginTop: 4 },
  sectionTitle: { fontSize: 12, fontWeight: '700', letterSpacing: 0.6, color: PURPLE, marginBottom: 2 },
  chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { borderWidth: 1, borderRadius: 8, paddingVertical: 8, paddingHorizontal: 12 },
  chipText: { fontSize: 13, fontWeight: '500' },
  select: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  dropdown: { borderWidth: 1, borderRadius: 8, marginTop: 4, overflow: 'hidden' },
  option: { paddingHorizontal: 12, paddingVertical: 10, borderBottomWidth: 1 },
  moreBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 6 },
});