import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { customFetch } from '@workspace/api-client-react';

const FONT_FAMILY = Platform.OS === 'web' ? 'Times New Roman' : 'serif';

type ReturnReason = 'Damaged' | 'Expired' | 'Wrong Item' | 'Customer Return' | 'Other';
const REASONS: ReturnReason[] = ['Damaged', 'Expired', 'Wrong Item', 'Customer Return', 'Other'];

interface BillItem {
  product_id: number;
  product_name: string;
  unit: string;
  qty: number;
  unit_price: number;
}

interface ReturnLine {
  product_id: number;
  product_name: string;
  unitPrice: number;
  maxQty: number;
  returnQty: string;
  reason: ReturnReason;
}

export interface ReturnableBill {
  id: number;
  invoiceNumber: string;
  customerId: number;
  customerName: string;
  businessId: number;
}

interface ExchangeResult {
  credit: string;
  note: string;
  customerId: number;
  customerName: string;
}

// ---------------------------------------------------------------------------
// Same return flow that used to live inline inside billing-list.tsx — pulled
// out so both the Billing List screen and the Customer Ledger receipt popup
// call the exact same submit logic (one place to fix bugs / add reasons).
// ---------------------------------------------------------------------------
export function ReturnModal({
  visible,
  bill,
  colors,
  onClose,
  onSuccess,
}: {
  visible: boolean;
  bill: ReturnableBill | null;
  colors: any;
  onClose: () => void;
  /** Called after a successful return submit (not called for the exchange
   * path, since that navigates to Billing instead). Use it to refetch. */
  onSuccess: () => void;
}) {
  const [returnLines, setReturnLines] = useState<ReturnLine[]>([]);
  const [loadingReturnItems, setLoadingReturnItems] = useState(false);
  const [submittingReturn, setSubmittingReturn] = useState(false);
  const [refundMethod, setRefundMethod] = useState<'cash' | 'exchange'>('cash');
  const [exchangeResult, setExchangeResult] = useState<ExchangeResult | null>(null);
  // Guards against a double-click/double-tap firing submitReturn twice before
  // the `submittingReturn` state re-render disables the button.
  const submittingReturnRef = useRef(false);

  useEffect(() => {
    if (!visible || !bill) {
      setReturnLines([]);
      return;
    }
    setRefundMethod('cash');
    setLoadingReturnItems(true);
    customFetch<BillItem[]>(`/api/transactions/${bill.id}/items`, { responseType: 'json' })
      .then((items) => {
        setReturnLines(
          items.map((i) => ({
            product_id: i.product_id,
            product_name: i.product_name,
            unitPrice: i.unit_price,
            maxQty: i.qty,
            returnQty: String(i.qty),
            reason: 'Customer Return' as ReturnReason,
          })),
        );
      })
      .catch((e) => console.error('Failed to load bill items for return:', e))
      .finally(() => setLoadingReturnItems(false));
  }, [visible, bill?.id]);

  const submitReturn = async () => {
    if (!bill) return;
    if (submittingReturnRef.current) return;
    const linesToReturn = returnLines.filter((l) => (parseInt(l.returnQty, 10) || 0) > 0);
    if (linesToReturn.length === 0) return;

    const isExchange = refundMethod === 'exchange';
    const exchangeCredit = linesToReturn.reduce((sum, l) => sum + (parseInt(l.returnQty, 10) || 0) * l.unitPrice, 0);
    const returnedProductNames = linesToReturn.map((l) => l.product_name).join(', ');

    submittingReturnRef.current = true;
    setSubmittingReturn(true);
    try {
      for (const l of linesToReturn) {
        await customFetch('/api/returns', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            business_id: bill.businessId,
            transaction_id: bill.id,
            product_id: l.product_id,
            qty: parseInt(l.returnQty, 10),
            reason: l.reason,
            refunded: !isExchange,
          }),
          responseType: 'json',
        } as any);
      }

      if (isExchange) {
        // Don't close the return modal yet — show the "Exchanged" success
        // popup first. The form modal and the success popup are sibling
        // Modals (not nested), so both can be controlled independently.
        setExchangeResult({
          credit: exchangeCredit.toFixed(2),
          note: `Exchange credit for returned ${returnedProductNames} (${bill.invoiceNumber})`,
          customerId: bill.customerId,
          customerName: bill.customerName,
        });
      } else {
        onSuccess();
        onClose();
      }
    } catch (e) {
      console.error('Failed to submit return:', e);
    } finally {
      submittingReturnRef.current = false;
      setSubmittingReturn(false);
    }
  };

  const handleExchangeContinue = () => {
    if (!exchangeResult) return;
    setExchangeResult(null);
    onClose();
    router.push({
      pathname: '/billing',
      params: {
        customer_id: String(exchangeResult.customerId),
        customer_name: exchangeResult.customerName,
        exchange_credit: exchangeResult.credit,
        exchange_note: exchangeResult.note,
      },
    } as any);
  };

  return (
    <>
      {/* --- Return form modal --- */}
      <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
        <View style={styles.overlay}>
          <View style={[styles.content, { backgroundColor: colors.card, maxHeight: '85%' }]}>
            <View style={styles.headerRow}>
              <Text style={[styles.title, { color: colors.foreground }]}>Return — {bill?.invoiceNumber}</Text>
              <Pressable onPress={onClose} hitSlop={8}>
                <Feather name="x" size={20} color={colors.mutedForeground} />
              </Pressable>
            </View>

            {loadingReturnItems ? (
              <ActivityIndicator color={colors.primary} style={{ marginVertical: 20 }} />
            ) : returnLines.length === 0 ? (
              <Text
                style={{
                  fontFamily: FONT_FAMILY,
                  fontSize: 12,
                  color: colors.mutedForeground,
                  textAlign: 'center',
                  paddingVertical: 20,
                }}
              >
                No items found for this bill.
              </Text>
            ) : (
              <ScrollView style={{ maxHeight: 400, marginTop: 12 }} showsVerticalScrollIndicator={false}>
                {returnLines.map((line, idx) => (
                  <View
                    key={line.product_id}
                    style={{ borderBottomWidth: 1, borderColor: colors.border, paddingVertical: 10 }}
                  >
                    <Text style={{ fontFamily: FONT_FAMILY, fontWeight: '700', color: colors.foreground }}>
                      {line.product_name}
                    </Text>
                    <Text style={{ fontFamily: FONT_FAMILY, fontSize: 11, color: colors.mutedForeground, marginBottom: 6 }}>
                      Sold qty: {line.maxQty}
                    </Text>
                    <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
                      <TextInput
                        value={line.returnQty}
                        onChangeText={(t) => {
                          const n = Math.min(parseInt(t, 10) || 0, line.maxQty);
                          setReturnLines((prev) => prev.map((l, i) => (i === idx ? { ...l, returnQty: String(n) } : l)));
                        }}
                        keyboardType="number-pad"
                        style={{
                          borderWidth: 1,
                          borderColor: colors.border,
                          borderRadius: 6,
                          width: 60,
                          textAlign: 'center',
                          paddingVertical: 6,
                          fontFamily: FONT_FAMILY,
                          color: colors.foreground,
                        }}
                      />
                      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flex: 1 }}>
                        <View style={{ flexDirection: 'row', gap: 6 }}>
                          {REASONS.map((r) => {
                            const active = line.reason === r;
                            return (
                              <Pressable
                                key={r}
                                onPress={() =>
                                  setReturnLines((prev) => prev.map((l, i) => (i === idx ? { ...l, reason: r } : l)))
                                }
                                style={{
                                  paddingHorizontal: 10,
                                  paddingVertical: 6,
                                  borderRadius: 14,
                                  borderWidth: 1,
                                  borderColor: active ? colors.primary : colors.border,
                                  backgroundColor: active ? colors.primary + '15' : 'transparent',
                                }}
                              >
                                <Text
                                  style={{
                                    fontFamily: FONT_FAMILY,
                                    fontSize: 11,
                                    color: active ? colors.primary : colors.mutedForeground,
                                  }}
                                >
                                  {r}
                                </Text>
                              </Pressable>
                            );
                          })}
                        </View>
                      </ScrollView>
                    </View>
                  </View>
                ))}
              </ScrollView>
            )}

            {!loadingReturnItems && returnLines.length > 0 && (
              <View style={{ marginTop: 14 }}>
                <Text
                  style={{
                    fontFamily: FONT_FAMILY,
                    fontSize: 12,
                    fontWeight: '700',
                    color: colors.foreground,
                    marginBottom: 8,
                  }}
                >
                  Settle this return with
                </Text>
                <View style={{ flexDirection: 'row', gap: 8 }}>
                  <Pressable
                    onPress={() => setRefundMethod('cash')}
                    style={{
                      flex: 1,
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 6,
                      paddingVertical: 10,
                      borderRadius: 10,
                      borderWidth: 1,
                      borderColor: refundMethod === 'cash' ? '#DC2626' : colors.border,
                      backgroundColor: refundMethod === 'cash' ? '#FEE2E2' : 'transparent',
                    }}
                  >
                    <Feather name="rotate-ccw" size={14} color={refundMethod === 'cash' ? '#DC2626' : colors.mutedForeground} />
                    <Text
                      style={{
                        fontFamily: FONT_FAMILY,
                        fontSize: 12.5,
                        color: refundMethod === 'cash' ? '#DC2626' : colors.foreground,
                        fontWeight: refundMethod === 'cash' ? '700' : '400',
                      }}
                    >
                      Cash Refund
                    </Text>
                  </Pressable>
                  <Pressable
                    onPress={() => setRefundMethod('exchange')}
                    style={{
                      flex: 1,
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 6,
                      paddingVertical: 10,
                      borderRadius: 10,
                      borderWidth: 1,
                      borderColor: refundMethod === 'exchange' ? colors.primary : colors.border,
                      backgroundColor: refundMethod === 'exchange' ? colors.primary + '15' : 'transparent',
                    }}
                  >
                    <Feather name="repeat" size={14} color={refundMethod === 'exchange' ? colors.primary : colors.mutedForeground} />
                    <Text
                      style={{
                        fontFamily: FONT_FAMILY,
                        fontSize: 12.5,
                        color: refundMethod === 'exchange' ? colors.primary : colors.foreground,
                        fontWeight: refundMethod === 'exchange' ? '700' : '400',
                      }}
                    >
                      Exchange for Product
                    </Text>
                  </Pressable>
                </View>
                {refundMethod === 'exchange' && (
                  <Text
                    style={{
                      fontFamily: FONT_FAMILY,
                      fontSize: 11,
                      color: colors.mutedForeground,
                      marginTop: 6,
                      lineHeight: 15,
                    }}
                  >
                    No cash goes out. After confirming, you'll be taken to Billing with this customer and the return
                    value pre-filled as a discount — pick whatever product they're exchanging it for.
                  </Text>
                )}
              </View>
            )}

            <Pressable
              onPress={submitReturn}
              disabled={submittingReturn || loadingReturnItems || returnLines.length === 0}
              style={[
                styles.actionBtn,
                {
                  backgroundColor: refundMethod === 'exchange' ? colors.primary : '#DC2626',
                  borderRadius: colors.radius,
                  marginTop: 14,
                  opacity: submittingReturn || loadingReturnItems || returnLines.length === 0 ? 0.6 : 1,
                },
              ]}
            >
              {submittingReturn ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.actionBtnText}>
                  {refundMethod === 'exchange' ? 'Confirm & Pick Replacement' : 'Confirm Return'}
                </Text>
              )}
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* --- Exchange success popup (sibling modal, not nested) --- */}
      <Modal visible={!!exchangeResult} transparent animationType="fade">
        <View style={styles.overlay}>
          <View
            style={[
              styles.content,
              { backgroundColor: colors.card, maxWidth: 340, alignItems: 'center', paddingVertical: 28 },
            ]}
          >
            <View
              style={{
                width: 56,
                height: 56,
                borderRadius: 28,
                backgroundColor: colors.primary + '15',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 14,
              }}
            >
              <Feather name="check-circle" size={30} color={colors.primary} />
            </View>
            <Text
              style={{
                fontFamily: FONT_FAMILY,
                fontSize: 17,
                fontWeight: '700',
                color: colors.foreground,
                marginBottom: 6,
              }}
            >
              Exchanged
            </Text>
            <Text
              style={{
                fontFamily: FONT_FAMILY,
                fontSize: 12.5,
                color: colors.mutedForeground,
                textAlign: 'center',
                lineHeight: 18,
              }}
            >
              ₹{exchangeResult?.credit} credit added. Pick a replacement product for {exchangeResult?.customerName}.
            </Text>
            <Pressable
              onPress={handleExchangeContinue}
              style={[
                styles.actionBtn,
                { backgroundColor: colors.primary, borderRadius: colors.radius, marginTop: 18, width: '100%' },
              ]}
            >
              <Text style={styles.actionBtnText}>Continue</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  content: { width: '100%', maxWidth: 420, padding: 22, borderRadius: 16 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  title: { fontSize: 18, fontFamily: FONT_FAMILY, fontWeight: '700' },
  actionBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 12 },
  actionBtnText: { color: '#fff', fontSize: 14, fontFamily: FONT_FAMILY, fontWeight: '600' },
});