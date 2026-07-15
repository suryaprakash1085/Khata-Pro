import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useQueryClient } from '@tanstack/react-query';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { KeyboardAwareScrollViewCompat } from '@/components/KeyboardAwareScrollViewCompat';
import { useColors } from '@/hooks/useColors';
import { useBusiness } from '@/contexts/BusinessContext';
import { useCreateTransaction, TransactionInputType, TransactionInputPaymentMode } from '@workspace/api-client-react';
import { FormField } from '@/components/FormField';
import { PrimaryButton } from '@/components/PrimaryButton';

const PAYMENT_MODES = [
  { value: TransactionInputPaymentMode.cash, label: 'Cash' },
  { value: TransactionInputPaymentMode.upi, label: 'UPI' },
  { value: TransactionInputPaymentMode.online, label: 'Online' },
  { value: TransactionInputPaymentMode.cheque, label: 'Cheque' },
];

export default function AddTransactionScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { business } = useBusiness();
  const queryClient = useQueryClient();
  const params = useLocalSearchParams<{ customerId: string; type?: string }>();
  const customerId = Number(params.customerId);

  const [type, setType] = useState<TransactionInputType>(
    params.type === 'you_got' ? TransactionInputType.you_got : TransactionInputType.you_gave,
  );
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [paymentMode, setPaymentMode] = useState<TransactionInputPaymentMode>(TransactionInputPaymentMode.cash);
  const [error, setError] = useState<string | null>(null);

  const createTransaction = useCreateTransaction();

  const handleSave = () => {
    setError(null);
    const parsedAmount = parseFloat(amount);
    if (!parsedAmount || parsedAmount <= 0) {
      setError('Enter a valid amount');
      return;
    }
    if (!business?.id || !customerId) return;

    createTransaction.mutate(
      {
        data: {
          business_id: business.id,
          customer_id: customerId,
          type,
          amount: parsedAmount,
          description: description.trim() || undefined,
          payment_mode: paymentMode,
          entry_date: new Date().toISOString(),
        },
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['/api/transactions'], exact: false });
          queryClient.invalidateQueries({ queryKey: [`/api/customers/${customerId}`] });
          queryClient.invalidateQueries({ queryKey: ['/api/customers'], exact: false });
          queryClient.invalidateQueries({ predicate: (q) => typeof q.queryKey[0] === 'string' && (q.queryKey[0] as string).includes('/stats') });
          router.back();
        },
        onError: () => setError('Could not save entry. Please try again.'),
      },
    );
  };

  return (
    <KeyboardAwareScrollViewCompat
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 24 }]}
      bottomOffset={40}
    >
      <View style={styles.chipGroup}>
        <Text style={[styles.groupLabel, { color: colors.mutedForeground }]}>Entry type</Text>
        <View style={styles.typeRow}>
          <Text
            onPress={() => setType(TransactionInputType.you_gave)}
            style={[
              styles.typeChip,
              {
                borderRadius: colors.radius,
                backgroundColor: type === 'you_gave' ? colors.destructive : colors.card,
                borderColor: type === 'you_gave' ? colors.destructive : colors.border,
                color: type === 'you_gave' ? colors.destructiveForeground : colors.foreground,
              },
            ]}
          >
            You gave
          </Text>
          <Text
            onPress={() => setType(TransactionInputType.you_got)}
            style={[
              styles.typeChip,
              {
                borderRadius: colors.radius,
                backgroundColor: type === 'you_got' ? colors.success : colors.card,
                borderColor: type === 'you_got' ? colors.success : colors.border,
                color: type === 'you_got' ? colors.successForeground : colors.foreground,
              },
            ]}
          >
            You got
          </Text>
        </View>
      </View>

      <FormField label="Amount" placeholder="0" keyboardType="decimal-pad" value={amount} onChangeText={setAmount} autoFocus />
      <FormField label="Note (optional)" placeholder="What was this for?" value={description} onChangeText={setDescription} />

      <View style={styles.chipGroup}>
        <Text style={[styles.groupLabel, { color: colors.mutedForeground }]}>Payment mode</Text>
        <View style={styles.chipsRow}>
          {PAYMENT_MODES.map((m) => {
            const active = m.value === paymentMode;
            return (
              <Text
                key={m.value}
                onPress={() => setPaymentMode(m.value)}
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
                {m.label}
              </Text>
            );
          })}
        </View>
      </View>

      {error ? <Text style={[styles.errorText, { color: colors.destructive }]}>{error}</Text> : null}

      <PrimaryButton label="Save entry" onPress={handleSave} loading={createTransaction.isPending} style={{ marginTop: 8 }} />
    </KeyboardAwareScrollViewCompat>
  );
}

const styles = StyleSheet.create({
  content: { padding: 20, gap: 16 },
  chipGroup: { gap: 8 },
  groupLabel: { fontSize: 13, fontFamily: 'Inter_500Medium', fontWeight: '500' },
  typeRow: { flexDirection: 'row', gap: 10 },
  typeChip: {
    flex: 1,
    textAlign: 'center',
    paddingVertical: 12,
    borderWidth: 1,
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    fontWeight: '600',
    overflow: 'hidden',
  },
  chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { paddingHorizontal: 14, paddingVertical: 9, borderWidth: 1, fontSize: 13, fontFamily: 'Inter_500Medium', overflow: 'hidden' },
  errorText: { fontSize: 13, fontFamily: 'Inter_400Regular' },
});
