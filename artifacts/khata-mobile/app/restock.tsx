import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useQueryClient } from '@tanstack/react-query';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { KeyboardAwareScrollViewCompat } from '@/components/KeyboardAwareScrollViewCompat';
import { useBusiness } from '@/contexts/BusinessContext';
// @ts-ignore
import {
  useGetProduct,
  getGetProductQueryKey,
  useListProducts,
  getListProductsQueryKey,
  useListVendors,
  getListVendorsQueryKey,
  useCreatePurchase,
  getListPurchasesQueryKey,
} from '@workspace/api-client-react';
import { PrimaryButton } from '@/components/PrimaryButton';

const THEME = {
  primary: '#5B21B6',
  primarySoft: 'rgba(91,33,182,0.08)',
  background: '#F8FAFC',
  card: '#FFFFFF',
  border: '#E5E7EB',
  text: '#0F172A',
  label: '#374151',
  placeholder: '#9CA3AF',
  muted: '#6B7280',
  danger: '#DC2626',
  dangerBg: '#FEE2E2',
  success: '#16A34A',
  warning: '#D97706',
};

const FONT_FAMILY = Platform.OS === 'ios' ? 'Times New Roman' : 'serif';
const IS_WEB = Platform.OS === 'web';

const showAlert = (title: string, message: string, onOk?: () => void) => {
  if (Platform.OS === 'web') {
    // eslint-disable-next-line no-alert
    window.alert(`${title}\n\n${message}`);
    onOk?.();
  } else {
    Alert.alert(title, message, [{ text: 'OK', onPress: onOk }]);
  }
};

const toArray = (d: any): any[] =>
  Array.isArray(d) ? d : d?.data ?? d?.items ?? d?.products ?? d?.vendors ?? [];

const money = (n: number) => `₹${n.toFixed(2)}`;

export default function RestockScreen() {
  const insets = useSafeAreaInsets();
  const { business } = useBusiness();
  const queryClient = useQueryClient();
  const params = useLocalSearchParams<{ id?: string }>();

  const [selectedId, setSelectedId] = useState<number | undefined>(
    params.id ? Number(params.id) : undefined
  );
  const [search, setSearch] = useState('');
  const [qty, setQty] = useState('');
  const [unitCost, setUnitCost] = useState('');
  const [vendorId, setVendorId] = useState<number | undefined>(undefined);
  const [amountPaid, setAmountPaid] = useState('');
  const [invoiceNo, setInvoiceNo] = useState('');
  const [prefilled, setPrefilled] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ---- Selected product ----
  const { data: product, isLoading: isLoadingProduct } = useGetProduct(selectedId as number, {
    query: { enabled: !!selectedId, queryKey: getGetProductQueryKey(selectedId as number) },
  }) as { data: any; isLoading: boolean };

  // Pre-fill cost + vendor from the product (once per selected product)
  useEffect(() => {
    if (product && !prefilled) {
      setUnitCost(product.cost_price ? String(product.cost_price) : '');
      if (product.vendor_id != null) setVendorId(Number(product.vendor_id));
      setPrefilled(true);
    }
  }, [product, prefilled]);

  // ---- Product picker (only when no product is selected) ----
  const pickerParams = { business_id: business?.id as number, search: search.trim(), limit: 8 };
  const { data: pickerData, isFetching: isSearching } = useListProducts(pickerParams, {
    query: {
      enabled: !!business?.id && !selectedId,
      queryKey: getListProductsQueryKey(pickerParams),
    },
  });
  const pickerList = toArray(pickerData);

  // ---- Vendors ----
  const { data: vendorsData } = useListVendors(
    { business_id: business?.id as number },
    {
      query: {
        enabled: !!business?.id,
        queryKey: getListVendorsQueryKey({ business_id: business?.id as number }),
      },
    }
  );
  const vendorList = toArray(vendorsData);

  const createPurchase = useCreatePurchase();

  const pickProduct = (id: number) => {
    setSelectedId(id);
    setPrefilled(false);
    setQty('');
    setUnitCost('');
    setVendorId(undefined);
    setAmountPaid('');
    setInvoiceNo('');
    setError(null);
  };

  const changeProduct = () => {
    setSelectedId(undefined);
    setPrefilled(false);
    setSearch('');
  };

  // ---- Derived numbers ----
  const currentStock = Number(product?.stock_qty ?? 0);
  const qtyNum = parseInt(qty, 10) || 0;
  const costNum = parseFloat(unitCost) || 0;
  const paidNum = parseFloat(amountPaid) || 0;
  const total = qtyNum * costNum;
  const due = Math.max(0, total - paidNum);
  const newStock = currentStock + qtyNum;

  const handleSave = () => {
    setError(null);

    if (!business?.id) {
      setError('No business selected. Please set up your business first.');
      return;
    }
    if (!product) {
      setError('Select a product to restock');
      return;
    }
    if (qtyNum <= 0) {
      setError('Enter the quantity you received');
      return;
    }
    if (costNum <= 0) {
      setError('Enter a valid cost price per unit');
      return;
    }
    if (!vendorId) {
      setError('Select the vendor you bought this from');
      return;
    }
    if (paidNum < 0 || paidNum > total) {
      setError(`Amount paid must be between ₹0 and ${money(total)}`);
      return;
    }

    createPurchase.mutate(
      {
        data: {
          business_id: business.id,
          vendor_id: vendorId,
          invoice_no: invoiceNo.trim() || undefined,
          amount_paid: paidNum,
          entry_date: new Date().toISOString().split('T')[0],
          description: `Restock: ${product.name} (+${qtyNum})`,
          items: [{ product_id: Number(product.id), qty: qtyNum, unit_cost: costNum }],
        },
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['/api/products'], exact: false });
          queryClient.invalidateQueries({ queryKey: ['/api/purchases'], exact: false });
          queryClient.invalidateQueries({
            queryKey: getGetProductQueryKey(Number(product.id)),
            exact: false,
          });
          queryClient.invalidateQueries({
            queryKey: getListProductsQueryKey({ business_id: business.id, limit: 100 }),
            exact: false,
          });
          queryClient.invalidateQueries({
            queryKey: getListPurchasesQueryKey({ business_id: business.id }),
            exact: false,
          });
          // Bell / notification lists (low stock cleared, vendor payment added)
          queryClient.invalidateQueries({
            predicate: (q) => JSON.stringify(q.queryKey).toLowerCase().includes('notification'),
          });
          showAlert(
            'Stock added',
            `${product.name}: ${currentStock} + ${qtyNum} = ${newStock}${
              due > 0 ? `\nVendor payment pending: ${money(due)}` : ''
            }`,
            () => router.replace('/all-products' as any)
          );
        },
        onError: () => setError('Could not save the restock. Please try again.'),
      }
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: THEME.background }}>
      {/* ---- Header ---- */}
      <View style={[styles.pageHeader, { paddingTop: insets.top + 14 }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} hitSlop={8}>
          <Feather name="arrow-left" size={18} color={THEME.text} />
        </TouchableOpacity>
        <View>
          <Text style={styles.pageTitle}>Restock Product</Text>
          <Text style={styles.pageSubtitle}>Add received stock and record what you owe the vendor</Text>
        </View>
      </View>

      <KeyboardAwareScrollViewCompat
        style={{ flex: 1 }}
        contentContainerStyle={styles.scrollContent}
        bottomOffset={40}
      >
        {error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        <View style={styles.card}>
          {/* ---- 1. Product ---- */}
          <Text style={styles.sectionTitle}>1. Product</Text>

          {!selectedId ? (
            <View>
              <TextInput
                placeholder="Search product name or barcode"
                placeholderTextColor={THEME.placeholder}
                value={search}
                onChangeText={setSearch}
                style={styles.textInput}
              />
              {isSearching ? (
                <ActivityIndicator style={{ marginTop: 12 }} color={THEME.primary} />
              ) : (
                <View style={{ marginTop: 8 }}>
                  {pickerList.length === 0 ? (
                    <Text style={styles.hint}>No products found</Text>
                  ) : (
                    pickerList.map((p: any) => (
                      <TouchableOpacity key={p.id} style={styles.pickerRow} onPress={() => pickProduct(Number(p.id))}>
                        <Text style={styles.pickerName}>{p.name}</Text>
                        <Text style={styles.pickerStock}>Stock: {p.stock_qty}</Text>
                      </TouchableOpacity>
                    ))
                  )}
                </View>
              )}
            </View>
          ) : isLoadingProduct || !product ? (
            <ActivityIndicator color={THEME.primary} />
          ) : (
            <View style={styles.productCard}>
              <View style={{ flex: 1 }}>
                <Text style={styles.productName}>{product.name}</Text>
                <Text style={styles.hintLeft}>
                  Current stock: {currentStock} {product.unit ?? 'pcs'} · Low stock alert at {product.low_stock_alert ?? 5}
                </Text>
              </View>
              <TouchableOpacity onPress={changeProduct}>
                <Text style={styles.linkText}>Change</Text>
              </TouchableOpacity>
            </View>
          )}

          {product ? (
            <>
              <View style={styles.divider} />

              {/* ---- 2. Quantity & cost ---- */}
              <Text style={styles.sectionTitle}>2. Quantity &amp; Cost</Text>
              <View style={styles.row}>
                <View style={styles.col}>
                  <Text style={styles.fieldLabel}>
                    Quantity received<Text style={{ color: THEME.danger }}> *</Text>
                  </Text>
                  <TextInput
                    placeholder="e.g. 100"
                    placeholderTextColor={THEME.placeholder}
                    keyboardType="number-pad"
                    value={qty}
                    onChangeText={setQty}
                    style={styles.textInput}
                  />
                  <Text style={styles.hintLeft}>This is added to the current stock.</Text>
                </View>
                <View style={styles.col}>
                  <Text style={styles.fieldLabel}>
                    Cost price per unit (₹)<Text style={{ color: THEME.danger }}> *</Text>
                  </Text>
                  <TextInput
                    placeholder="Enter cost price"
                    placeholderTextColor={THEME.placeholder}
                    keyboardType="decimal-pad"
                    value={unitCost}
                    onChangeText={setUnitCost}
                    style={styles.textInput}
                  />
                </View>
              </View>

              <View style={styles.divider} />

              {/* ---- 3. Vendor & payment ---- */}
              <Text style={styles.sectionTitle}>3. Vendor &amp; Payment</Text>
              <Text style={styles.fieldLabel}>
                Vendor<Text style={{ color: THEME.danger }}> *</Text>
              </Text>
              {vendorList.length === 0 ? (
                <Text style={styles.hintLeft}>No vendors yet. Add one from Add Product first.</Text>
              ) : (
                <View style={styles.chipsRow}>
                  {vendorList.map((v: any) => {
                    const active = vendorId === Number(v.id);
                    return (
                      <TouchableOpacity
                        key={v.id}
                        onPress={() => setVendorId(Number(v.id))}
                        style={[styles.chip, active && styles.chipActive]}
                      >
                        <Text style={[styles.chipText, active && styles.chipTextActive]}>{v.name}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}

              <View style={[styles.row, { marginTop: 14 }]}>
                <View style={styles.col}>
                  <Text style={styles.fieldLabel}>Paid to vendor now (₹)</Text>
                  <TextInput
                    placeholder="0"
                    placeholderTextColor={THEME.placeholder}
                    keyboardType="decimal-pad"
                    value={amountPaid}
                    onChangeText={setAmountPaid}
                    style={styles.textInput}
                  />
                  <TouchableOpacity onPress={() => setAmountPaid(total > 0 ? String(total) : '')}>
                    <Text style={[styles.linkText, { marginTop: 6 }]}>Mark as fully paid</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.col}>
                  <Text style={styles.fieldLabel}>Invoice no. (optional)</Text>
                  <TextInput
                    placeholder="Vendor invoice number"
                    placeholderTextColor={THEME.placeholder}
                    value={invoiceNo}
                    onChangeText={setInvoiceNo}
                    style={styles.textInput}
                  />
                </View>
              </View>

              {/* ---- Summary ---- */}
              <View style={styles.summaryBox}>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Stock after restock</Text>
                  <Text style={styles.summaryValue}>
                    {currentStock} + {qtyNum} = {newStock}
                  </Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Total purchase</Text>
                  <Text style={styles.summaryValue}>{money(total)}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Paid now</Text>
                  <Text style={styles.summaryValue}>{money(paidNum)}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Vendor payment pending</Text>
                  <Text style={[styles.summaryValue, { color: due > 0 ? THEME.warning : THEME.success }]}>
                    {money(due)}
                  </Text>
                </View>
              </View>

              <View style={styles.actions}>
                <TouchableOpacity onPress={() => router.back()} style={styles.cancelBtn} activeOpacity={0.7}>
                  <Text style={styles.cancelBtnText}>Cancel</Text>
                </TouchableOpacity>
                <PrimaryButton
                  label="Add Stock"
                  onPress={handleSave}
                  loading={createPurchase.isPending}
                  disabled={createPurchase.isPending}
                  style={styles.saveBtn}
                />
              </View>
            </>
          ) : null}
        </View>
      </KeyboardAwareScrollViewCompat>
    </View>
  );
}

const styles = StyleSheet.create({
  pageHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingHorizontal: 20,
    paddingBottom: 14,
    backgroundColor: THEME.background,
    borderBottomWidth: 1,
    borderBottomColor: THEME.border,
  },
  backBtn: {
    width: 30,
    height: 30,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: THEME.card,
    borderWidth: 1,
    borderColor: THEME.border,
    marginTop: 2,
  },
  pageTitle: { fontSize: 19, fontWeight: '700', color: THEME.text, fontFamily: FONT_FAMILY },
  pageSubtitle: { fontSize: 12.5, color: THEME.muted, marginTop: 2, fontFamily: FONT_FAMILY },

  scrollContent: {
    padding: 20,
    paddingBottom: 28,
    maxWidth: 900,
    width: '100%',
    alignSelf: 'center',
  },
  errorContainer: {
    backgroundColor: THEME.dangerBg,
    borderRadius: 8,
    padding: 10,
    marginBottom: 14,
    borderLeftWidth: 4,
    borderLeftColor: THEME.danger,
  },
  errorText: { fontSize: 13, fontWeight: '500', color: '#991B1B', fontFamily: FONT_FAMILY },

  card: {
    backgroundColor: THEME.card,
    borderWidth: 1,
    borderColor: THEME.border,
    borderRadius: 14,
    padding: 20,
    ...(IS_WEB
      ? ({ boxShadow: '0 1px 3px rgba(15,23,42,0.04)' } as any)
      : { shadowColor: '#000', shadowOpacity: 0.03, shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, elevation: 1 }),
  },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: THEME.text, marginBottom: 12, fontFamily: FONT_FAMILY },
  divider: { height: 1, backgroundColor: THEME.border, marginVertical: 20 },

  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 16 },
  col: { flexGrow: 1, flexBasis: 240, minWidth: 200 },
  fieldLabel: { fontSize: 12.5, fontWeight: '600', color: THEME.label, marginBottom: 6, fontFamily: FONT_FAMILY },
  textInput: {
    borderWidth: 1,
    borderColor: THEME.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13.5,
    color: THEME.text,
    backgroundColor: THEME.card,
    fontFamily: FONT_FAMILY,
    ...(IS_WEB ? ({ outlineStyle: 'none' } as any) : {}),
  },
  hint: { fontSize: 12, color: THEME.placeholder, textAlign: 'center', marginTop: 8, fontFamily: FONT_FAMILY },
  hintLeft: { fontSize: 11.5, color: THEME.muted, marginTop: 6, fontFamily: FONT_FAMILY },
  linkText: { color: THEME.primary, fontWeight: '700', fontSize: 12.5, fontFamily: FONT_FAMILY },

  pickerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: THEME.border,
  },
  pickerName: { fontSize: 13.5, color: THEME.text, fontFamily: FONT_FAMILY, flexShrink: 1 },
  pickerStock: { fontSize: 12, color: THEME.muted, fontFamily: FONT_FAMILY },

  productCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: THEME.primarySoft,
    borderRadius: 10,
    padding: 14,
  },
  productName: { fontSize: 15, fontWeight: '700', color: THEME.text, fontFamily: FONT_FAMILY },

  chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { borderWidth: 1, borderColor: THEME.border, borderRadius: 16, paddingHorizontal: 14, paddingVertical: 8 },
  chipActive: { backgroundColor: THEME.primary, borderColor: THEME.primary },
  chipText: { fontSize: 12.5, color: THEME.label, fontFamily: FONT_FAMILY },
  chipTextActive: { color: '#fff', fontWeight: '700' },

  summaryBox: {
    marginTop: 20,
    backgroundColor: THEME.primarySoft,
    borderRadius: 10,
    padding: 14,
    gap: 8,
  },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  summaryLabel: { fontSize: 12.5, color: THEME.muted, fontFamily: FONT_FAMILY },
  summaryValue: { fontSize: 14, fontWeight: '700', color: THEME.text, fontFamily: FONT_FAMILY },

  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 22,
    paddingTop: 18,
    borderTopWidth: 1,
    borderTopColor: THEME.border,
  },
  cancelBtn: {
    backgroundColor: THEME.card,
    borderWidth: 1,
    borderColor: THEME.border,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: 'center',
  },
  cancelBtnText: { fontSize: 13.5, fontWeight: '600', color: THEME.text, fontFamily: FONT_FAMILY },
  saveBtn: { backgroundColor: THEME.primary, paddingHorizontal: 26 },
});