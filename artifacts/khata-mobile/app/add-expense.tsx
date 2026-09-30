import React, { useState } from 'react';
import { ActivityIndicator, Alert, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useColors } from '@/hooks/useColors';
import { useBusiness } from '@/contexts/BusinessContext';
import { customFetch } from '@workspace/api-client-react';

const FONT_REGULAR = Platform.select({ ios: 'Times New Roman', android: 'serif', default: '"Times New Roman", Times, serif' });
const FONT_BOLD = FONT_REGULAR;
const ACCENT = '#7C3AED';

type ExpenseCategory = 'Rent' | 'Salaries' | 'Utilities' | 'Transport' | 'Miscellaneous';
const CATEGORIES: ExpenseCategory[] = ['Rent', 'Salaries', 'Utilities', 'Transport', 'Miscellaneous'];
const CATEGORY_VALUE_MAP: Record<ExpenseCategory, string> = {
  Rent: 'rent',
  Salaries: 'salary',
  Utilities: 'utilities',
  Transport: 'transport',
  Miscellaneous: 'other',
};

type PaymentMethod = 'cash' | 'bank_transfer' | 'card' | 'upi';
const PAYMENT_METHODS: { key: PaymentMethod; label: string; icon: keyof typeof Feather.glyphMap }[] = [
  { key: 'cash', label: 'Cash', icon: 'dollar-sign' },
  { key: 'bank_transfer', label: 'Bank Transfer', icon: 'credit-card' },
  { key: 'card', label: 'Card', icon: 'credit-card' },
  { key: 'upi', label: 'UPI', icon: 'smartphone' },
];

type CardType = 'debit' | 'credit';

function toLocalISODate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}
function toLocalTimeStr(d: Date): string {
  const h = String(d.getHours()).padStart(2, '0');
  const m = String(d.getMinutes()).padStart(2, '0');
  return `${h}:${m}`;
}

// ---- Create expense mutation ----
function useCreateExpense() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Record<string, any>) =>
      customFetch('/api/expenses', {
        method: 'POST',
        responseType: 'json',
        body: JSON.stringify(payload),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports', 'expenses'], exact: false });
    },
  });
}

// ---------------------------------------------------------------------------
// Small layout helper — puts two fields side by side on wide screens,
// stacks them on narrow ones, so the form uses horizontal space instead
// of stretching vertically with one field per row.
// ---------------------------------------------------------------------------
function FieldGrid({ children }: { children: React.ReactNode }) {
  return <View style={styles.fieldGrid}>{children}</View>;
}
function FieldCol({ children }: { children: React.ReactNode }) {
  return <View style={styles.fieldCol}>{children}</View>;
}

export default function AddExpenseScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { business } = useBusiness();
  const createExpense = useCreateExpense();

  const [category, setCategory] = useState<ExpenseCategory>('Rent');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [payeeName, setPayeeName] = useState('');

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  // bank transfer fields
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [refNumber, setRefNumber] = useState('');
  // card fields
  const [cardType, setCardType] = useState<CardType>('debit');
  const [cardLast4, setCardLast4] = useState('');
  // upi field
  const [upiId, setUpiId] = useState('');

  const isValid = amount.trim().length > 0 && !isNaN(Number(amount)) && Number(amount) > 0;

  const handleSave = () => {
    if (!isValid) {
      Alert.alert('Missing info', 'Please enter a valid amount');
      return;
    }

    const paymentDetails: Record<string, any> =
      paymentMethod === 'bank_transfer'
        ? { bank_name: bankName.trim(), account_number: accountNumber.trim(), reference_number: refNumber.trim() }
        : paymentMethod === 'card'
        ? { card_type: cardType, card_last4: cardLast4.trim() }
        : paymentMethod === 'upi'
        ? { upi_id: upiId.trim() }
        : {};

    const payload = {
      business_id: business?.id,
      category: CATEGORY_VALUE_MAP[category],
      payee_name: payeeName.trim(),
      description: description.trim(),
      amount: Number(amount),
      entry_date: toLocalISODate(date),
      payment_mode: paymentMethod,
      payment_details: paymentDetails,
    };

    createExpense.mutate(payload, {
      onSuccess: () => {
        Alert.alert('Saved', 'Expense recorded successfully', [{ text: 'OK', onPress: () => router.back() }]);
      },
      onError: (err: any) => {
        Alert.alert('Error', err?.message ?? 'Could not save expense. Please try again.');
      },
    });
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ paddingTop: insets.top + 14, paddingBottom: insets.bottom + 16, paddingHorizontal: 16 }}
      keyboardShouldPersistTaps="handled"
    >
      <View style={{ width: '100%' }}>
        <View style={styles.headerRow}>
          <Pressable onPress={() => router.back()} hitSlop={10} style={{ marginRight: 10 }}>
            <Feather name="arrow-left" size={20} color={colors.foreground} />
          </Pressable>
          <Text style={[styles.title, { color: colors.foreground }]}>Add Expense</Text>
        </View>

        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius }]}>
          {/* Category */}
          <Text style={[styles.label, { color: colors.mutedForeground }]}>Category</Text>
          <View style={styles.chipRow}>
            {CATEGORIES.map((c) => {
              const active = c === category;
              return (
                <Pressable
                  key={c}
                  onPress={() => setCategory(c)}
                  style={[styles.chip, { borderColor: active ? ACCENT : colors.border, backgroundColor: active ? ACCENT + '15' : 'transparent' }]}
                >
                  <Text style={{ fontSize: 12.5, fontFamily: FONT_REGULAR, color: active ? ACCENT : colors.foreground }}>{c}</Text>
                </Pressable>
              );
            })}
          </View>

          {/* Payee Name + Description — side by side */}
          <FieldGrid>
            <FieldCol>
              <Text style={[styles.fieldLabel, { color: colors.mutedForeground }]}>Payee Name</Text>
              <View style={[styles.inputWrap, { borderColor: colors.border, backgroundColor: colors.background }]}>
                <TextInput
                  value={payeeName}
                  onChangeText={setPayeeName}
                  placeholder="e.g. Landlord"
                  placeholderTextColor={colors.mutedForeground}
                  style={{ fontFamily: FONT_REGULAR, fontSize: 13, color: colors.foreground, paddingVertical: 2 }}
                />
              </View>
            </FieldCol>
            <FieldCol>
              <Text style={[styles.fieldLabel, { color: colors.mutedForeground }]}>Description</Text>
              <View style={[styles.inputWrap, { borderColor: colors.border, backgroundColor: colors.background }]}>
                <TextInput
                  value={description}
                  onChangeText={setDescription}
                  placeholder="e.g. Shop rent - August"
                  placeholderTextColor={colors.mutedForeground}
                  style={{ fontFamily: FONT_REGULAR, fontSize: 13, color: colors.foreground, paddingVertical: 2 }}
                />
              </View>
            </FieldCol>
          </FieldGrid>

          {/* Amount + Date + Time — three across on wide screens */}
          <View style={styles.fieldGrid}>
            <View style={styles.fieldColThird}>
              <Text style={[styles.fieldLabel, { color: colors.mutedForeground }]}>Amount</Text>
              <View style={[styles.inputWrap, { borderColor: colors.border, backgroundColor: colors.background }]}>
                <TextInput
                  value={amount}
                  onChangeText={setAmount}
                  placeholder="0.00"
                  placeholderTextColor={colors.mutedForeground}
                  keyboardType="decimal-pad"
                  style={{ fontFamily: FONT_REGULAR, fontSize: 13, color: colors.foreground, paddingVertical: 2 }}
                />
              </View>
            </View>

            <View style={styles.fieldColThird}>
              <Text style={[styles.fieldLabel, { color: colors.mutedForeground }]}>Date</Text>
              <Pressable
                onPress={() => setShowDatePicker(true)}
                style={[styles.inputWrap, { borderColor: colors.border, backgroundColor: colors.background, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }]}
              >
                <Text style={{ fontFamily: FONT_REGULAR, color: colors.foreground, fontSize: 13 }}>{toLocalISODate(date)}</Text>
                <Feather name="calendar" size={14} color={colors.mutedForeground} />
              </Pressable>
              {showDatePicker && (
                <DateTimePicker
                  value={date}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'inline' : 'default'}
                  onChange={(e, d) => { setShowDatePicker(Platform.OS === 'ios'); if (d) setDate(d); }}
                />
              )}
            </View>

            <View style={styles.fieldColThird}>
              <Text style={[styles.fieldLabel, { color: colors.mutedForeground }]}>Time</Text>
              <Pressable
                onPress={() => setShowTimePicker(true)}
                style={[styles.inputWrap, { borderColor: colors.border, backgroundColor: colors.background, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }]}
              >
                <Text style={{ fontFamily: FONT_REGULAR, color: colors.foreground, fontSize: 13 }}>{toLocalTimeStr(date)}</Text>
                <Feather name="clock" size={14} color={colors.mutedForeground} />
              </Pressable>
              {showTimePicker && (
                <DateTimePicker
                  value={date}
                  mode="time"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={(e, d) => { setShowTimePicker(Platform.OS === 'ios'); if (d) setDate(d); }}
                />
              )}
            </View>
          </View>

          {/* Payment Method */}
          <Text style={[styles.label, { color: colors.mutedForeground, marginTop: 2 }]}>Payment Method</Text>
          <View style={styles.chipRow}>
            {PAYMENT_METHODS.map((m) => {
              const active = m.key === paymentMethod;
              return (
                <Pressable
                  key={m.key}
                  onPress={() => setPaymentMethod(m.key)}
                  style={[
                    styles.methodChip,
                    { borderColor: active ? ACCENT : colors.border, backgroundColor: active ? ACCENT + '15' : 'transparent' },
                  ]}
                >
                  <Feather name={m.icon} size={13} color={active ? ACCENT : colors.mutedForeground} style={{ marginRight: 6 }} />
                  <Text style={{ fontSize: 12.5, fontFamily: FONT_REGULAR, color: active ? ACCENT : colors.foreground }}>{m.label}</Text>
                </Pressable>
              );
            })}
          </View>

          {/* Conditional: Bank Transfer details — fields side by side */}
          {paymentMethod === 'bank_transfer' && (
            <View style={[styles.detailBox, { borderColor: colors.border, backgroundColor: colors.background }]}>
              <Text style={[styles.detailHeading, { color: colors.foreground }]}>Bank Details</Text>
              <FieldGrid>
                <FieldCol>
                  <Text style={[styles.fieldLabel, { color: colors.mutedForeground }]}>Bank Name</Text>
                  <View style={[styles.inputWrap, { borderColor: colors.border, backgroundColor: colors.card }]}>
                    <TextInput value={bankName} onChangeText={setBankName} placeholder="e.g. HDFC Bank" placeholderTextColor={colors.mutedForeground} style={{ fontFamily: FONT_REGULAR, fontSize: 13, color: colors.foreground }} />
                  </View>
                </FieldCol>
                <FieldCol>
                  <Text style={[styles.fieldLabel, { color: colors.mutedForeground }]}>Account Number</Text>
                  <View style={[styles.inputWrap, { borderColor: colors.border, backgroundColor: colors.card }]}>
                    <TextInput value={accountNumber} onChangeText={setAccountNumber} placeholder="XXXX1234" placeholderTextColor={colors.mutedForeground} keyboardType="number-pad" style={{ fontFamily: FONT_REGULAR, fontSize: 13, color: colors.foreground }} />
                  </View>
                </FieldCol>
              </FieldGrid>
              <View style={styles.fieldRowLast}>
                <Text style={[styles.fieldLabel, { color: colors.mutedForeground }]}>Reference / UTR Number</Text>
                <View style={[styles.inputWrap, { borderColor: colors.border, backgroundColor: colors.card }]}>
                  <TextInput value={refNumber} onChangeText={setRefNumber} placeholder="Transaction ref no." placeholderTextColor={colors.mutedForeground} style={{ fontFamily: FONT_REGULAR, fontSize: 13, color: colors.foreground }} />
                </View>
              </View>
            </View>
          )}

          {/* Conditional: Card details */}
          {paymentMethod === 'card' && (
            <View style={[styles.detailBox, { borderColor: colors.border, backgroundColor: colors.background }]}>
              <Text style={[styles.detailHeading, { color: colors.foreground }]}>Card Details</Text>
              <FieldGrid>
                <FieldCol>
                  <Text style={[styles.fieldLabel, { color: colors.mutedForeground }]}>Card Type</Text>
                  <View style={[styles.chipRow, { marginBottom: 0 }]}>
                    {(['debit', 'credit'] as CardType[]).map((t) => {
                      const active = t === cardType;
                      return (
                        <Pressable
                          key={t}
                          onPress={() => setCardType(t)}
                          style={[styles.chip, { borderColor: active ? ACCENT : colors.border, backgroundColor: active ? ACCENT + '15' : 'transparent' }]}
                        >
                          <Text style={{ fontSize: 12, fontFamily: FONT_REGULAR, color: active ? ACCENT : colors.foreground, textTransform: 'capitalize' }}>{t}</Text>
                        </Pressable>
                      );
                    })}
                  </View>
                </FieldCol>
                <FieldCol>
                  <Text style={[styles.fieldLabel, { color: colors.mutedForeground }]}>Card Last 4 Digits</Text>
                  <View style={[styles.inputWrap, { borderColor: colors.border, backgroundColor: colors.card }]}>
                    <TextInput value={cardLast4} onChangeText={setCardLast4} placeholder="1234" placeholderTextColor={colors.mutedForeground} keyboardType="number-pad" maxLength={4} style={{ fontFamily: FONT_REGULAR, fontSize: 13, color: colors.foreground }} />
                  </View>
                </FieldCol>
              </FieldGrid>
            </View>
          )}

          {/* Conditional: UPI */}
          {paymentMethod === 'upi' && (
            <View style={[styles.detailBox, { borderColor: colors.border, backgroundColor: colors.background }]}>
              <Text style={[styles.detailHeading, { color: colors.foreground }]}>UPI Details</Text>
              <View style={styles.fieldRowLast}>
                <Text style={[styles.fieldLabel, { color: colors.mutedForeground }]}>UPI ID</Text>
                <View style={[styles.inputWrap, { borderColor: colors.border, backgroundColor: colors.card }]}>
                  <TextInput value={upiId} onChangeText={setUpiId} placeholder="name@bank" placeholderTextColor={colors.mutedForeground} autoCapitalize="none" style={{ fontFamily: FONT_REGULAR, fontSize: 13, color: colors.foreground }} />
                </View>
              </View>
            </View>
          )}

          <Pressable
            onPress={handleSave}
            disabled={createExpense.isPending || !isValid}
            style={[styles.saveBtn, { backgroundColor: ACCENT, opacity: createExpense.isPending || !isValid ? 0.6 : 1 }]}
          >
            {createExpense.isPending ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveBtnText}>Save Expense</Text>}
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}

const IS_WEB = Platform.OS === 'web';

const styles = StyleSheet.create({
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  title: { fontSize: 19, fontFamily: FONT_BOLD, fontWeight: '700' },
  card: { padding: 16, borderWidth: StyleSheet.hairlineWidth },

  label: { fontSize: 11, fontFamily: FONT_REGULAR, textTransform: 'uppercase', letterSpacing: 0.4, marginBottom: 8 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 14 },
  chip: { paddingHorizontal: 12, paddingVertical: 7, borderRadius: 16, borderWidth: 1 },
  methodChip: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, borderWidth: 1 },

  // ---- Grid layout: fields sit side by side instead of stacking ----
  fieldGrid: { flexDirection: IS_WEB ? 'row' : 'column', gap: 12, marginBottom: 12 },
  fieldCol: { flex: 1, minWidth: IS_WEB ? 200 : undefined },
  fieldColThird: { flex: 1, minWidth: IS_WEB ? 140 : undefined },

  fieldLabel: { fontSize: 11, fontFamily: FONT_REGULAR, textTransform: 'uppercase', letterSpacing: 0.4, marginBottom: 6 },
  inputWrap: { borderWidth: 1, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 9 },

  fieldRowLast: { marginBottom: 0 },

  detailBox: { borderWidth: 1, borderRadius: 10, padding: 14, marginBottom: 14 },
  detailHeading: { fontSize: 12.5, fontFamily: FONT_BOLD, fontWeight: '700', marginBottom: 10 },

  saveBtn: { marginTop: 4, paddingVertical: 13, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  saveBtnText: { color: '#fff', fontSize: 14, fontFamily: FONT_BOLD, fontWeight: '700' },
});