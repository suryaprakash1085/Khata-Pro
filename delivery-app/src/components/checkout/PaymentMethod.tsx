import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../../constants/colors';

interface PaymentMethodProps {
  selectedMethod: string;
  onSelectMethod: (method: string) => void;
}

export default function PaymentMethod({
  selectedMethod,
  onSelectMethod,
}: PaymentMethodProps) {
  const paymentMethods: { id: string; name: string; icon: string }[] = [
    { id: 'card', name: 'Credit/Debit Card', icon: 'card-outline' },
    { id: 'upi', name: 'UPI', icon: 'phone-portrait-outline' },
    { id: 'netbanking', name: 'Net Banking', icon: 'business-outline' },
    { id: 'wallet', name: 'Wallet', icon: 'wallet-outline' },
    { id: 'cash', name: 'Cash on Delivery', icon: 'cash-outline' },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Payment Options</Text>
      {paymentMethods.map((method) => (
        <TouchableOpacity
          key={method.id}
          style={[
            styles.methodItem,
            selectedMethod === method.id && styles.selectedMethod,
          ]}
          onPress={() => onSelectMethod(method.id)}
        >
          <View style={styles.methodLeft}>
            <Icon name={method.icon} size={24} color={selectedMethod === method.id ? colors.primary : colors.text} />
            <Text style={[styles.methodName, selectedMethod === method.id && styles.selectedMethodText]}>
              {method.name}
            </Text>
          </View>
          {selectedMethod === method.id && (
            <Icon name="checkmark-circle" size={20} color={colors.primary} />
          )}
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: colors.white,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  methodItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    marginBottom: 8,
  },
  selectedMethod: {
    borderColor: colors.primary,
    backgroundColor: '#fff5ec',
  },
  methodLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  methodName: {
    fontSize: 14,
    color: colors.text,
    marginLeft: 12,
  },
  selectedMethodText: {
    color: colors.primary,
    fontWeight: '500',
  },
});