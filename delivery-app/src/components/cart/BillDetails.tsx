import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { colors } from '../../constants/colors';

interface BillDetailsProps {
  itemsTotal: number;
  deliveryFee?: number;
  platformFee?: number;
  taxesAndCharges?: number;
  total: number;
  showTitle?: boolean;
}

export default function BillDetails({
  itemsTotal,
  deliveryFee,
  platformFee,
  taxesAndCharges,
  total,
  showTitle = true,
}: BillDetailsProps) {
  return (
    <View style={styles.container}>
      {showTitle && <Text style={styles.title}>Bill Details</Text>}
      <View style={styles.row}>
        <Text style={styles.label}>Item Total</Text>
        <Text style={styles.value}>₹{itemsTotal}</Text>
      </View>
      {deliveryFee !== undefined && (
        <View style={styles.row}>
          <Text style={styles.label}>Delivery Fee</Text>
          <Text style={styles.value}>₹{deliveryFee}</Text>
        </View>
      )}
      {platformFee !== undefined && (
        <View style={styles.row}>
          <Text style={styles.label}>Platform Fee</Text>
          <Text style={styles.value}>₹{platformFee}</Text>
        </View>
      )}
      {taxesAndCharges !== undefined && (
        <View style={styles.row}>
          <Text style={styles.label}>Taxes and Charges</Text>
          <Text style={styles.value}>₹{taxesAndCharges}</Text>
        </View>
      )}
      <View style={[styles.row, styles.totalRow]}>
        <Text style={styles.totalLabel}>TO PAY</Text>
        <Text style={styles.totalValue}>₹{total}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.lightGray,
    borderRadius: 12,
    padding: 16,
    margin: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  label: {
    fontSize: 14,
    color: colors.textLight,
  },
  value: {
    fontSize: 14,
    color: colors.text,
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 12,
    marginTop: 8,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  totalValue: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
  },
});