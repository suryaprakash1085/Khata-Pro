import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import { useQueryClient } from '@tanstack/react-query';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { KeyboardAwareScrollViewCompat } from '@/components/KeyboardAwareScrollViewCompat';
import { useColors } from '@/hooks/useColors';
import { useBusiness } from '@/contexts/BusinessContext';
import { useCreateCustomer, useCreateVendor, CustomerInputCategory } from '@workspace/api-client-react';
import { Ionicons } from '@expo/vector-icons';
import { VendorFormFields } from '@/components/VendorFormFields';
import { useVendorForm, validateVendorForm, buildVendorPayload, getApiErrorInfo } from '@/lib/vendorForm';

const FONT_FAMILY = 'Times New Roman';
const LABEL_WIDTH = 150;
const PURPLE = '#7C3AED';

export default function AddCustomerScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { business } = useBusiness();
  const queryClient = useQueryClient();

  // Customer fields
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  // The Type toggle is only UI now: Customer -> customers table, Vendor -> vendors table.
  const [category, setCategory] = useState<CustomerInputCategory>(CustomerInputCategory.customer);
  const [error, setError] = useState<string | null>(null);

  // Vendor fields (shared form + validation)
  const vendorForm = useVendorForm();

  const isVendor = category === CustomerInputCategory.supplier;
  const createCustomer = useCreateCustomer();
  const createVendor = useCreateVendor();
  const isSaving = createCustomer.isPending || createVendor.isPending;

  const handleSave = () => {
    setError(null);
    if (!business?.id) return;

    // ---------- Vendor ----------
    if (isVendor) {
      const errs = validateVendorForm(vendorForm.values, { requirePhone: true });
      if (Object.keys(errs).length > 0) {
        vendorForm.setErrors(errs);
        setError('Please fix the highlighted fields');
        return;
      }
      createVendor.mutate(
        { data: buildVendorPayload(vendorForm.values, business.id) as any },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['/api/vendors'], exact: false });
            router.back();
          },
          onError: (err: any) => {
            const info = getApiErrorInfo(err);
            if (info.field) vendorForm.setErrors({ [info.field]: info.message } as any);
            setError(info.message);
          },
        },
      );
      return;
    }

    // ---------- Customer (unchanged) ----------
    if (name.trim().length < 2) {
      setError('Enter the customer name');
      return;
    }
    if (phone.replace(/[^\d]/g, '').length < 10) {
      setError('Enter a valid phone number');
      return;
    }
    createCustomer.mutate(
      {
        data: {
          business_id: business.id,
          name: name.trim(),
          phone: phone.trim(),
          category,
        },
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['/api/customers'], exact: false });
          queryClient.invalidateQueries({ predicate: (q) => typeof q.queryKey[0] === 'string' && (q.queryKey[0] as string).includes('/stats') });
          router.back();
        },
        onError: () => setError('Could not save customer. Please try again.'),
      },
    );
  };

  return (
    <KeyboardAwareScrollViewCompat
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 24 }]}
      bottomOffset={40}
    >
      {/* Type toggle */}
      <View style={styles.row}>
        <Text style={[styles.label, { color: colors.mutedForeground, width: LABEL_WIDTH, fontFamily: FONT_FAMILY }]}>Type</Text>
        <View style={styles.typeToggle}>
          {[CustomerInputCategory.customer, CustomerInputCategory.supplier].map((c) => {
            const active = c === category;
            return (
              <Pressable
                key={c}
                onPress={() => {
                  setCategory(c);
                  setError(null);
                }}
                style={[
                  styles.typeChip,
                  {
                    backgroundColor: active ? PURPLE : colors.background,
                    borderColor: active ? PURPLE : colors.border,
                  },
                ]}
              >
                <Text style={[styles.typeChipText, { color: active ? '#FFFFFF' : colors.foreground, fontFamily: FONT_FAMILY }]}>
                  {c === 'customer' ? 'Customer' : 'Vendor'}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>
      <View style={[styles.divider, { backgroundColor: colors.border }]} />

      {isVendor ? (
        <VendorFormFields
          layout="row"
          values={vendorForm.values}
          errors={vendorForm.errors}
          onChange={vendorForm.onChange}
          phoneRequired
          autoFocusName
        />
      ) : (
        <>
          {/* Name */}
          <View style={styles.row}>
            <Text style={[styles.label, { color: colors.mutedForeground, width: LABEL_WIDTH, fontFamily: FONT_FAMILY }]}>
              Customer name <Text style={{ color: colors.destructive }}>*</Text>
            </Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Ramesh Kumar"
              placeholderTextColor={colors.mutedForeground}
              autoFocus
              style={[
                styles.input,
                { color: colors.foreground, borderColor: colors.border, backgroundColor: colors.background, fontFamily: FONT_FAMILY },
              ]}
            />
          </View>
          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          {/* Phone */}
          <View style={styles.row}>
            <Text style={[styles.label, { color: colors.mutedForeground, width: LABEL_WIDTH, fontFamily: FONT_FAMILY }]}>
              Phone number <Text style={{ color: colors.destructive }}>*</Text>
            </Text>
            <TextInput
              value={phone}
              onChangeText={setPhone}
              placeholder="98765 43210"
              placeholderTextColor={colors.mutedForeground}
              keyboardType="phone-pad"
              style={[
                styles.input,
                { color: colors.foreground, borderColor: colors.border, backgroundColor: colors.background, fontFamily: FONT_FAMILY },
              ]}
            />
          </View>
        </>
      )}

      {error ? (
        <View style={styles.errorRow}>
          <Ionicons name="alert-circle-outline" size={16} color={colors.destructive} />
          <Text style={[styles.errorText, { color: colors.destructive, fontFamily: FONT_FAMILY }]}>{error}</Text>
        </View>
      ) : null}

      <Pressable
        onPress={handleSave}
        disabled={isSaving}
        style={[styles.saveButton, { backgroundColor: PURPLE, opacity: isSaving ? 0.7 : 1 }]}
      >
        <Text style={[styles.saveButtonText, { color: '#FFFFFF', fontFamily: FONT_FAMILY }]}>
          {isSaving ? 'Saving…' : isVendor ? 'Save vendor' : 'Save customer'}
        </Text>
      </Pressable>
    </KeyboardAwareScrollViewCompat>
  );
}

const styles = StyleSheet.create({
  content: { padding: 20, paddingTop: 8 },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, gap: 16 },
  label: { fontSize: 14 },
  input: { flex: 1, borderWidth: 1, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 9, fontSize: 14, maxWidth: 420 },
  divider: { height: 1, opacity: 0.6 },
  typeToggle: { flexDirection: 'row', gap: 8, maxWidth: 420, flex: 1 },
  typeChip: { flex: 1, borderWidth: 1, borderRadius: 8, paddingVertical: 9, alignItems: 'center' },
  typeChipText: { fontSize: 14, fontWeight: '500' },
  errorRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8 },
  errorText: { fontSize: 13 },
  saveButton: { marginTop: 24, borderRadius: 8, paddingVertical: 13, alignItems: 'center', maxWidth: 220 },
  saveButtonText: { fontSize: 15, fontWeight: '600' },
});