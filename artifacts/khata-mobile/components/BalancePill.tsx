import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useColors } from '@/hooks/useColors';
import { formatCurrency } from '@/lib/format';

/**
 * Shows an outstanding balance. Positive balance (customer owes you) is
 * rendered in the success color ("you'll get"); negative (you owe them) is
 * rendered in destructive color ("you'll pay").
 */
export function BalancePill({ balance, currency = 'INR' }: { balance: number; currency?: string }) {
  const colors = useColors();
  const willGet = balance >= 0;
  const color = balance === 0 ? colors.mutedForeground : willGet ? colors.success : colors.destructive;

  return (
    <View style={styles.wrap}>
      <Text style={[styles.amount, { color }]}>{formatCurrency(Math.abs(balance), currency)}</Text>
      {balance !== 0 ? (
        <Text style={[styles.label, { color: colors.mutedForeground }]}>
          {willGet ? "you'll get" : "you'll pay"}
        </Text>
      ) : (
        <Text style={[styles.label, { color: colors.mutedForeground }]}>settled</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'flex-end' },
  amount: { fontSize: 15, fontFamily: 'Inter_600SemiBold', fontWeight: '600' },
  label: { fontSize: 11, fontFamily: 'Inter_400Regular', marginTop: 1 },
});
