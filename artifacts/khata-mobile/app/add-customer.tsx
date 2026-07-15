import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { useQueryClient } from '@tanstack/react-query';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { KeyboardAwareScrollViewCompat } from '@/components/KeyboardAwareScrollViewCompat';
import { useColors } from '@/hooks/useColors';
import { useBusiness } from '@/contexts/BusinessContext';
import { useCreateCustomer, CustomerInputCategory, CustomerInputOpeningBalanceType } from '@workspace/api-client-react';
import { FormField } from '@/components/FormField';
import { PrimaryButton } from '@/components/PrimaryButton';

export default function AddCustomerScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { business } = useBusiness();
  const queryClient = useQueryClient();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [category, setCategory] = useState<CustomerInputCategory>(CustomerInputCategory.customer);
  const [openingBalance, setOpeningBalance] = useState('');
  const [balanceType, setBalanceType] = useState<CustomerInputOpeningBalanceType>(CustomerInputOpeningBalanceType.credit);
  const [error, setError] = useState<string | null>(null);

  const createCustomer = useCreateCustomer();

  const handleSave = () => {
    setError(null);
    if (name.trim().length < 2) {
      setError('Enter the customer name');
      return;
    }
    if (phone.replace(/[^\d]/g, '').length < 10) {
      setError('Enter a valid phone number');
      return;
    }
    if (!business?.id) return;

    createCustomer.mutate(
      {
        data: {
          business_id: business.id,
          name: name.trim(),
          phone: phone.trim(),
          category,
          opening_balance: openingBalance ? parseFloat(openingBalance) : 0,
          opening_balance_type: balanceType,
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
      <FormField label="Customer name" placeholder="Ramesh Kumar" value={name} onChangeText={setName} autoFocus />
      <FormField label="Phone number" placeholder="98765 43210" keyboardType="phone-pad" value={phone} onChangeText={setPhone} />

      <View style={styles.chipGroup}>
        <Text style={[styles.groupLabel, { color: colors.mutedForeground }]}>Type</Text>
        <View style={styles.chipsRow}>
          {[CustomerInputCategory.customer, CustomerInputCategory.supplier].map((c) => {
            const active = c === category;
            return (
              <Text
                key={c}
                onPress={() => setCategory(c)}
                style={[
                  styles.chip,
                  {
                    borderRadius: colors.radius,
                    backgroundColor: active ? colors.primary : colors.card,
                    borderColor: active ? colors.primary : colors.border,
                    color: active ? colors.primaryForeground : colors.foreground,
                  },
                ]}
              >
                {c === 'customer' ? 'Customer' : 'Supplier'}
              </Text>
            );
          })}
        </View>
      </View>

      <FormField
        label="Opening balance (optional)"
        placeholder="0"
        keyboardType="decimal-pad"
        value={openingBalance}
        onChangeText={setOpeningBalance}
      />

      <View style={styles.chipGroup}>
        <Text style={[styles.groupLabel, { color: colors.mutedForeground }]}>Balance type</Text>
        <View style={styles.chipsRow}>
          {[CustomerInputOpeningBalanceType.credit, CustomerInputOpeningBalanceType.debit].map((b) => {
            const active = b === balanceType;
            return (
              <Text
                key={b}
                onPress={() => setBalanceType(b)}
                style={[
                  styles.chip,
                  {
                    borderRadius: colors.radius,
                    backgroundColor: active ? colors.primary : colors.card,
                    borderColor: active ? colors.primary : colors.border,
                    color: active ? colors.primaryForeground : colors.foreground,
                  },
                ]}
              >
                {b === 'credit' ? 'They owe you' : 'You owe them'}
              </Text>
            );
          })}
        </View>
      </View>

      {error ? <Text style={[styles.errorText, { color: colors.destructive }]}>{error}</Text> : null}

      <PrimaryButton label="Save customer" onPress={handleSave} loading={createCustomer.isPending} style={{ marginTop: 8 }} />
    </KeyboardAwareScrollViewCompat>
  );
}

const styles = StyleSheet.create({
  content: { padding: 20, gap: 16 },
  chipGroup: { gap: 8 },
  groupLabel: { fontSize: 13, fontFamily: 'Inter_500Medium', fontWeight: '500' },
  chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { paddingHorizontal: 14, paddingVertical: 9, borderWidth: 1, fontSize: 13, fontFamily: 'Inter_500Medium', overflow: 'hidden' },
  errorText: { fontSize: 13, fontFamily: 'Inter_400Regular' },
});
