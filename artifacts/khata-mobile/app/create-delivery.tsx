// Khata-Pro/artifacts/khata-mobile/app/create-delivery.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { supabase } from '../lib/supabase';

export default function CreateDeliveryScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    customerId: '',
    orderId: '',
    productDescription: '',
    amount: '',
    paymentMode: 'cash',
    transactionType: 'you_got',
  });

  const handleSubmit = async () => {
    if (!formData.customerId || !formData.orderId || !formData.productDescription || !formData.amount) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }

    setLoading(true);
    try {
      // Get customer details
      const { data: customer, error: customerError } = await supabase
        .from('customers')
        .select('*')
        .eq('id', parseInt(formData.customerId))
        .single();

      if (customerError) throw customerError;

      // Create delivery
      const { data, error } = await supabase
        .from('deliveries')
        .insert({
          business_id: customer.business_id || 1,
          customer_id: parseInt(formData.customerId),
          customer_name: customer.customer_name,
          customer_email: customer.customer_email,
          customer_phone: customer.customer_phone,
          customer_address: customer.delivery_address,
          order_id: formData.orderId,
          product_description: formData.productDescription,
          amount: parseFloat(formData.amount),
          payment_mode: formData.paymentMode,
          transaction_type: formData.transactionType,
          status: 'Pending',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      Alert.alert('Success', 'Delivery created successfully!');
      router.back();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to create delivery');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Create Delivery' }} />
      
      <ScrollView style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.label}>Customer ID *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter customer ID"
            value={formData.customerId}
            onChangeText={(text) => setFormData({ ...formData, customerId: text })}
            keyboardType="numeric"
          />

          <Text style={styles.label}>Order ID *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter order ID"
            value={formData.orderId}
            onChangeText={(text) => setFormData({ ...formData, orderId: text })}
          />

          <Text style={styles.label}>Product Description *</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Describe the product"
            value={formData.productDescription}
            onChangeText={(text) => setFormData({ ...formData, productDescription: text })}
            multiline
            numberOfLines={3}
          />

          <Text style={styles.label}>Amount (₹) *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter amount"
            value={formData.amount}
            onChangeText={(text) => setFormData({ ...formData, amount: text })}
            keyboardType="decimal-pad"
          />

          <Text style={styles.label}>Payment Mode</Text>
          <View style={styles.radioGroup}>
            <TouchableOpacity
              style={[styles.radioButton, formData.paymentMode === 'cash' && styles.radioSelected]}
              onPress={() => setFormData({ ...formData, paymentMode: 'cash' })}
            >
              <Text style={styles.radioText}>Cash</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.radioButton, formData.paymentMode === 'online' && styles.radioSelected]}
              onPress={() => setFormData({ ...formData, paymentMode: 'online' })}
            >
              <Text style={styles.radioText}>Online</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Transaction Type</Text>
          <View style={styles.radioGroup}>
            <TouchableOpacity
              style={[styles.radioButton, formData.transactionType === 'you_got' && styles.radioSelected]}
              onPress={() => setFormData({ ...formData, transactionType: 'you_got' })}
            >
              <Text style={styles.radioText}>You Got</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.radioButton, formData.transactionType === 'you_gave' && styles.radioSelected]}
              onPress={() => setFormData({ ...formData, transactionType: 'you_gave' })}
            >
              <Text style={styles.radioText}>You Gave</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.submitButton, loading && styles.submitDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            <Text style={styles.submitButtonText}>
              {loading ? 'Creating...' : 'Create Delivery'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  content: {
    padding: 16,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginTop: 12,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#111827',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  radioGroup: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 4,
  },
  radioButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: 'white',
  },
  radioSelected: {
    backgroundColor: '#DBEAFE',
    borderColor: '#2563EB',
  },
  radioText: {
    fontSize: 14,
    color: '#111827',
  },
  submitButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  submitDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});