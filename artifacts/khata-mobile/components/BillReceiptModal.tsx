// import React, { useState } from 'react';
// import { ActivityIndicator, Linking, Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
// import { router } from 'expo-router';
// import { Feather } from '@expo/vector-icons';
// import { useQueryClient } from '@tanstack/react-query';
// import {
//   useGetTransaction,
//   getGetTransactionQueryKey,
//   useGetCustomer,
//   getGetCustomerQueryKey,
//   customFetch,
// } from '@workspace/api-client-react';
// import { BillReceiptCard, useBillItems } from './BillReceiptView';
// import { ReturnModal, type ReturnableBill } from './ReturnModal';
// import { downloadReceipt, buildWhatsAppUrl, confirmAsync, notify, type ReceiptBill, type ReceiptItem } from '@/lib/billReceiptHelpers';

// export function BillReceiptModal({
//   visible,
//   billId,
//   business,
//   colors,
//   onClose,
//   onChanged,
//   canEdit = true,
//   canDelete = true,
// }: {
//   visible: boolean;
//   billId: number | null;
//   business: any;
//   colors: any;
//   onClose: () => void;
//   onChanged?: () => void;
//   canEdit?: boolean;
//   canDelete?: boolean
// }) {
//   const queryClient = useQueryClient();
//   const enabled = visible && !!billId;

//   const [deleting, setDeleting] = useState(false);
//   const [showReturn, setShowReturn] = useState(false);

//   const { data: transaction, isLoading: txLoading } = useGetTransaction(billId as number, {
//     query: { enabled, queryKey: getGetTransactionQueryKey(billId as number) },
//   });
//   const { data: items, isLoading: itemsLoading, isError: itemsError } = useBillItems(billId ?? undefined, enabled);
//   const customerId = (transaction as any)?.customer_id as number | undefined;
//   const { data: customer } = useGetCustomer(customerId as number, {
//     query: { enabled: enabled && !!customerId, queryKey: getGetCustomerQueryKey(customerId as number) },
//   });

//   const isLoading = txLoading || itemsLoading;

//   const handleEdit = () => {
//     if (!transaction) return;
//     onClose();
//     router.push({
//       pathname: '/billing',
//       params: { customerId: String((transaction as any).customer_id), editBillId: String((transaction as any).id) },
//     } as any);
//   };

//   const handleDelete = async () => {
//     if (!transaction) return;
//     const t: any = transaction;
//     const confirmed = await confirmAsync(
//       'Delete bill',
//       `Delete ${t.invoice_no || `#${t.id}`}? This cannot be undone.`,
//       'Delete',
//     );
//     if (!confirmed) return;

//     setDeleting(true);
//     try {
//       await customFetch(`/api/transactions/${t.id}`, { method: 'DELETE' });
//       queryClient.invalidateQueries();
//       onChanged?.();
//       onClose();
//     } catch (e: any) {
//       // Surface the real reason — is the endpoint missing (404), forbidden
//       // (403), or something else? This is what "delete isn't working" needs
//       // to actually diagnose.
//       const message = e?.message || e?.response?.data?.message || 'Unknown error';
//       notify('Could not delete this bill', String(message));
//     } finally {
//       setDeleting(false);
//     }
//   };

//   const handleDownload = () => {
//     if (!transaction) return;
//     const t: any = transaction;
//     const businessName = business?.business_name || 'Khata-Pro';
//     const billItems = itemsError ? [] : items ?? [];

//     const itemsSubtotal = billItems.reduce((sum, i) => sum + (i.unit_price ?? 0) * (i.qty ?? 0), 0);
//     const tax = t.tax ?? 0;
//     const grandTotal = t.amount ?? 0;
//     const derivedDiscount = Math.max(itemsSubtotal + tax - grandTotal, 0);
//     const isCredit = !!t.due_date;
//     const paidAmount = isCredit ? 0 : grandTotal;
//     const balanceDue = isCredit ? grandTotal : 0;

//     const receiptItems: ReceiptItem[] = billItems.map((i) => ({
//       name: i.product_name,
//       qty: i.qty,
//       unit: i.unit,
//       unitPrice: i.unit_price,
//     }));

//     const receiptBill: ReceiptBill = {
//       invoiceNumber: t.invoice_no || `#${t.id}`,
//       entryDate: t.entry_date || t.created_at,
//       customerName: customer?.name ?? t.customer_name ?? 'Walk-in customer',
//       customerPhone: customer?.phone,
//       paymentMode: t.payment_mode ?? 'cash',
//       items: receiptItems,
//       subtotal: itemsSubtotal,
//       discount: derivedDiscount > 0.01 ? derivedDiscount : undefined,
//       tax,
//       gstRate: t.gst_rate,
//       amount: grandTotal,
//       paidAmount,
//       balanceDue,
//     };
//     downloadReceipt(receiptBill, businessName);
//   };

//   const handleShareWhatsApp = () => {
//     if (!transaction) return;
//     const t: any = transaction;
//     if (!customer?.phone) {
//       notify('No phone number', 'This customer has no WhatsApp number on file.');
//       return;
//     }
//     const message = `Hi ${customer?.name ?? ''}, here is your bill ${t.invoice_no || `#${t.id}`} from ${
//       business?.business_name ?? ''
//     }. Total: ${t.amount}. Thank you!`;
//     const url = buildWhatsAppUrl(customer.phone, message);
//     Linking.openURL(url).catch(() => notify('Error', 'Could not open WhatsApp.'));
//   };

//   const returnableBill: ReturnableBill | null =
//     transaction && customer
//       ? {
//           id: (transaction as any).id,
//           invoiceNumber: (transaction as any).invoice_no || `#${(transaction as any).id}`,
//           customerId: (transaction as any).customer_id,
//           customerName: customer?.name ?? (transaction as any).customer_name ?? 'Walk-in',
//           businessId: business?.id,
//         }
//       : null;

//   return (
//     <>
//       <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
//         <View style={styles.backdrop}>
//           <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
//           <View style={[styles.sheet, { backgroundColor: colors.background, borderColor: colors.border }]}>
//             <View style={[styles.topBar, { borderBottomColor: colors.border, backgroundColor: colors.card }]}>
//               <Text style={[styles.topBarTitle, { color: colors.foreground }]} numberOfLines={1}>
//                 {(transaction as any)?.invoice_no || (billId ? `Bill #${billId}` : 'Bill')}
//               </Text>
//               <Pressable onPress={onClose} hitSlop={10}>
//                 <Feather name="x" size={20} color={colors.foreground} />
//               </Pressable>
//             </View>

//             {isLoading || !transaction ? (
//               <ActivityIndicator style={{ marginTop: 60, marginBottom: 60 }} color={colors.primary} />
//             ) : (
//               <>
//                 <ScrollView
//                   contentContainerStyle={{ padding: 16, paddingBottom: 10 }}
//                   showsVerticalScrollIndicator={false}
//                 >
//                   <BillReceiptCard
//                     colors={colors}
//                     business={business}
//                     transaction={transaction}
//                     customer={customer}
//                     items={items ?? []}
//                     itemsError={itemsError}
//                   />
//                 </ScrollView>

//                 <View style={[styles.actionsGrid, { borderTopColor: colors.border, backgroundColor: colors.card }]}>
//                   {canEdit && (
//                  <ActionButton icon="edit-2" label="Edit" color={colors.primary} onPress={handleEdit} />
//                   )}
//                   {canDelete && (
//     <ActionButton
//       icon="trash-2"
//       label="Delete"
//       color="#DC2626"
//       onPress={handleDelete}
//       loading={deleting}
//     />
//   )}
//                   {/* <ActionButton icon="edit-2" label="Edit" color={colors.primary} onPress={handleEdit} />
//                   <ActionButton
//                     icon="trash-2"
//                     label="Delete"
//                     color="#DC2626"
//                     onPress={handleDelete}
//                     loading={deleting}
//                   /> */}
//                   <ActionButton icon="message-circle" label="WhatsApp" color="#16A34A" onPress={handleShareWhatsApp} />
//                   <ActionButton icon="download" label="Download" color={colors.foreground} onPress={handleDownload} />
//                   <ActionButton
//                     icon="corner-up-left"
//                     label="Return"
//                     color="#F97316"
//                     onPress={() => setShowReturn(true)}
//                   />
//                 </View>
//               </>
//             )}
//           </View>
//         </View>
//       </Modal>

//       <ReturnModal
//         visible={showReturn}
//         bill={returnableBill}
//         colors={colors}
//         onClose={() => setShowReturn(false)}
//         onSuccess={() => {
//           queryClient.invalidateQueries();
//           onChanged?.();
//         }}
//       />
//     </>
//   );
// }

// function ActionButton({
//   icon,
//   label,
//   color,
//   onPress,
//   loading,
// }: {
//   icon: keyof typeof Feather.glyphMap;
//   label: string;
//   color: string;
//   onPress: () => void;
//   loading?: boolean;
// }) {
//   return (
//     <Pressable style={styles.actionButton} onPress={onPress} disabled={loading} hitSlop={4}>
//       <View style={[styles.actionButtonIcon, { backgroundColor: color + '15' }]}>
//         {loading ? <ActivityIndicator size="small" color={color} /> : <Feather name={icon} size={17} color={color} />}
//       </View>
//       <Text style={[styles.actionButtonLabel, { color }]} numberOfLines={1}>
//         {label}
//       </Text>
//     </Pressable>
//   );
// }

// const styles = StyleSheet.create({
//   backdrop: {
//     flex: 1,
//     backgroundColor: 'rgba(0,0,0,0.45)',
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//   },
//   sheet: {
//     width: '100%',
//     maxWidth: 480,
//     maxHeight: '88%',
//     borderRadius: 18,
//     borderWidth: 1,
//     overflow: 'hidden',
//     // @ts-ignore - web-only shadow, harmless no-op on native
//     boxShadow: '0 20px 48px rgba(0,0,0,0.25)',
//     elevation: 12,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 10 },
//     shadowOpacity: 0.2,
//     shadowRadius: 24,
//   },
//   topBar: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     paddingHorizontal: 16,
//     paddingVertical: 13,
//     borderBottomWidth: 1,
//   },
//   topBarTitle: { fontSize: 15, fontFamily: 'Times New Roman', fontWeight: '700', flex: 1 },
//   actionsGrid: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     paddingVertical: 11,
//     paddingHorizontal: 8,
//     borderTopWidth: 1,
//   },
//   actionButton: { alignItems: 'center', gap: 4, width: 62 },
//   actionButtonIcon: { width: 38, height: 38, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
//   actionButtonLabel: { fontSize: 9.5, fontFamily: 'Times New Roman', fontWeight: '600' },
// });

import React, { useState } from 'react';
import { ActivityIndicator, Linking, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useQueryClient } from '@tanstack/react-query';
import {
  useGetTransaction,
  getGetTransactionQueryKey,
  useGetCustomer,
  getGetCustomerQueryKey,
  customFetch,
} from '@workspace/api-client-react';
import { BillReceiptCard, useBillItems } from './BillReceiptView';
import { ReturnModal, type ReturnableBill } from './ReturnModal';
import { downloadReceipt, buildWhatsAppUrl, confirmAsync, notify, type ReceiptBill, type ReceiptItem } from '@/lib/billReceiptHelpers';

export function BillReceiptModal({
  visible,
  billId,
  business,
  colors,
  onClose,
  onChanged, // called after a successful delete or return, so the caller can refetch its list
  canEdit = true,
  canDelete = true,
}: {
  visible: boolean;
  billId: number | null;
  business: any;
  colors: any;
  onClose: () => void;
  onChanged?: () => void;
  canEdit?: boolean;
  canDelete?: boolean;
}) {
  const queryClient = useQueryClient();
  const enabled = visible && !!billId;

  const [deleting, setDeleting] = useState(false);
  const [showReturn, setShowReturn] = useState(false);

  const { data: transaction, isLoading: txLoading } = useGetTransaction(billId as number, {
    query: { enabled, queryKey: getGetTransactionQueryKey(billId as number) },
  });
  const { data: items, isLoading: itemsLoading, isError: itemsError } = useBillItems(billId ?? undefined, enabled);
  const customerId = (transaction as any)?.customer_id as number | undefined;
  const { data: customer } = useGetCustomer(customerId as number, {
    query: { enabled: enabled && !!customerId, queryKey: getGetCustomerQueryKey(customerId as number) },
  });

  const isLoading = txLoading || itemsLoading;

  // Staff without permission still see Edit/Delete — tapping shows this
  // alert instead of performing the action.
  const showPermissionAlert = () => {
    const message = "You don't have permission to do this. Please ask your admin.";
    if (Platform.OS === 'web') window.alert(message);
    else notify('Permission required', message);
  };

  const handleEdit = () => {
    if (!canEdit) {
      showPermissionAlert();
      return;
    }
    if (!transaction) return;
    onClose();
    router.push({
      pathname: '/billing',
      params: { customerId: String((transaction as any).customer_id), editBillId: String((transaction as any).id) },
    } as any);
  };

  const handleDelete = async () => {
    if (!canDelete) {
      showPermissionAlert();
      return;
    }
    if (!transaction) return;
    const t: any = transaction;
    const confirmed = await confirmAsync(
      'Delete bill',
      `Delete ${t.invoice_no || `#${t.id}`}? This cannot be undone.`,
      'Delete',
    );
    if (!confirmed) return;

    setDeleting(true);
    try {
      await customFetch(`/api/transactions/${t.id}`, { method: 'DELETE' });
      queryClient.invalidateQueries();
      onChanged?.();
      onClose();
    } catch (e: any) {
      // Surface the real reason — is the endpoint missing (404), forbidden
      // (403), or something else? This is what "delete isn't working" needs
      // to actually diagnose.
      const message = e?.message || e?.response?.data?.message || 'Unknown error';
      notify('Could not delete this bill', String(message));
    } finally {
      setDeleting(false);
    }
  };

  const handleDownload = () => {
    if (!transaction) return;
    const t: any = transaction;
    const businessName = business?.business_name || 'Khata-Pro';
    const billItems = itemsError ? [] : items ?? [];

    const itemsSubtotal = billItems.reduce((sum, i) => sum + (i.unit_price ?? 0) * (i.qty ?? 0), 0);
    const tax = t.tax ?? 0;
    const grandTotal = t.amount ?? 0;
    const derivedDiscount = Math.max(itemsSubtotal + tax - grandTotal, 0);
    const isCredit = !!t.due_date;
    const paidAmount = isCredit ? 0 : grandTotal;
    const balanceDue = isCredit ? grandTotal : 0;

    const receiptItems: ReceiptItem[] = billItems.map((i) => ({
      name: i.product_name,
      qty: i.qty,
      unit: i.unit,
      unitPrice: i.unit_price,
    }));

    const receiptBill: ReceiptBill = {
      invoiceNumber: t.invoice_no || `#${t.id}`,
      entryDate: t.entry_date || t.created_at,
      customerName: customer?.name ?? t.customer_name ?? 'Walk-in customer',
      customerPhone: customer?.phone,
      paymentMode: t.payment_mode ?? 'cash',
      items: receiptItems,
      subtotal: itemsSubtotal,
      discount: derivedDiscount > 0.01 ? derivedDiscount : undefined,
      tax,
      gstRate: t.gst_rate,
      amount: grandTotal,
      paidAmount,
      balanceDue,
    };
    downloadReceipt(receiptBill, businessName);
  };

  const handleShareWhatsApp = () => {
    if (!transaction) return;
    const t: any = transaction;
    if (!customer?.phone) {
      notify('No phone number', 'This customer has no WhatsApp number on file.');
      return;
    }
    const message = `Hi ${customer?.name ?? ''}, here is your bill ${t.invoice_no || `#${t.id}`} from ${
      business?.business_name ?? ''
    }. Total: ${t.amount}. Thank you!`;
    const url = buildWhatsAppUrl(customer.phone, message);
    Linking.openURL(url).catch(() => notify('Error', 'Could not open WhatsApp.'));
  };

  const returnableBill: ReturnableBill | null =
    transaction && customer
      ? {
          id: (transaction as any).id,
          invoiceNumber: (transaction as any).invoice_no || `#${(transaction as any).id}`,
          customerId: (transaction as any).customer_id,
          customerName: customer?.name ?? (transaction as any).customer_name ?? 'Walk-in',
          businessId: business?.id,
        }
      : null;

  return (
    <>
      <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
        <View style={styles.backdrop}>
          <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
          <View style={[styles.sheet, { backgroundColor: colors.background, borderColor: colors.border }]}>
            <View style={[styles.topBar, { borderBottomColor: colors.border, backgroundColor: colors.card }]}>
              <Text style={[styles.topBarTitle, { color: colors.foreground }]} numberOfLines={1}>
                {(transaction as any)?.invoice_no || (billId ? `Bill #${billId}` : 'Bill')}
              </Text>
              <Pressable onPress={onClose} hitSlop={10}>
                <Feather name="x" size={20} color={colors.foreground} />
              </Pressable>
            </View>

            {isLoading || !transaction ? (
              <ActivityIndicator style={{ marginTop: 60, marginBottom: 60 }} color={colors.primary} />
            ) : (
              <>
                <ScrollView
                  contentContainerStyle={{ padding: 16, paddingBottom: 10 }}
                  showsVerticalScrollIndicator={false}
                >
                  <BillReceiptCard
                    colors={colors}
                    business={business}
                    transaction={transaction}
                    customer={customer}
                    items={items ?? []}
                    itemsError={itemsError}
                  />
                </ScrollView>

                {/* Edit and Delete stay visible for everyone — staff without
                    permission get a permission alert on tap instead of the
                    buttons being hidden (matches the Promotions screen's
                    pattern). */}
                <View style={[styles.actionsGrid, { borderTopColor: colors.border, backgroundColor: colors.card }]}>
                  <ActionButton icon="edit-2" label="Edit" color={colors.primary} onPress={handleEdit} />
                  <ActionButton
                    icon="trash-2"
                    label="Delete"
                    color="#DC2626"
                    onPress={handleDelete}
                    loading={deleting}
                  />
                  <ActionButton icon="message-circle" label="WhatsApp" color="#16A34A" onPress={handleShareWhatsApp} />
                  <ActionButton icon="download" label="Download" color={colors.foreground} onPress={handleDownload} />
                  <ActionButton
                    icon="corner-up-left"
                    label="Return"
                    color="#F97316"
                    onPress={() => setShowReturn(true)}
                  />
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>

      <ReturnModal
        visible={showReturn}
        bill={returnableBill}
        colors={colors}
        onClose={() => setShowReturn(false)}
        onSuccess={() => {
          queryClient.invalidateQueries();
          onChanged?.();
        }}
      />
    </>
  );
}

function ActionButton({
  icon,
  label,
  color,
  onPress,
  loading,
}: {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  color: string;
  onPress: () => void;
  loading?: boolean;
}) {
  return (
    <Pressable style={styles.actionButton} onPress={onPress} disabled={loading} hitSlop={4}>
      <View style={[styles.actionButtonIcon, { backgroundColor: color + '15' }]}>
        {loading ? <ActivityIndicator size="small" color={color} /> : <Feather name={icon} size={17} color={color} />}
      </View>
      <Text style={[styles.actionButtonLabel, { color }]} numberOfLines={1}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  sheet: {
    width: '100%',
    maxWidth: 480,
    maxHeight: '88%',
    borderRadius: 18,
    borderWidth: 1,
    overflow: 'hidden',
    // @ts-ignore - web-only shadow, harmless no-op on native
    boxShadow: '0 20px 48px rgba(0,0,0,0.25)',
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 13,
    borderBottomWidth: 1,
  },
  topBarTitle: { fontSize: 15, fontFamily: 'Times New Roman', fontWeight: '700', flex: 1 },
  actionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 11,
    paddingHorizontal: 8,
    borderTopWidth: 1,
  },
  actionButton: { alignItems: 'center', gap: 4, width: 62 },
  actionButtonIcon: { width: 38, height: 38, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  actionButtonLabel: { fontSize: 9.5, fontFamily: 'Times New Roman', fontWeight: '600' },
});