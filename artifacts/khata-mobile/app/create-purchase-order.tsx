import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { KeyboardAwareScrollViewCompat } from '@/components/KeyboardAwareScrollViewCompat';
import { useBusiness } from '@/contexts/BusinessContext';
// @ts-ignore
import { useListVendors, getListVendorsQueryKey, useListProducts, getListProductsQueryKey } from '@workspace/api-client-react';
// @ts-ignore
import { customFetch } from '@workspace/api-client-react';
import { PrimaryButton } from '@/components/PrimaryButton';

// ---------------------------------------------------------------------------
// NOTE ON API ACCESS: the /purchase-orders backend routes exist and are
// mounted, but orval hasn't generated typed hooks for them yet (confirmed —
// no purchaseOrder* files under api-zod/generated). So this screen calls
// them directly via customFetch, exactly like useVendorPendingTotal() does
// on the dashboard. Once codegen picks up the new OpenAPI paths, these can
// be swapped for useCreatePurchaseOrder() / useListPurchaseOrders() etc.
// without changing anything else on this screen.
// ---------------------------------------------------------------------------

const THEME = {
  primary: '#5B21B6',
  primarySoft: 'rgba(91,33,182,0.08)',
  background: '#F8FAFC',
  card: '#FFFFFF',
  border: '#E5E7EB',
  divider: '#E5E7EB',
  text: '#0F172A',
  label: '#374151',
  placeholder: '#9CA3AF',
  muted: '#6B7280',
  danger: '#DC2626',
  dangerBg: '#FEE2E2',
  success: '#16A34A',
  warning: '#D97706',
  warningBg: 'rgba(217,119,6,0.10)',
};

const IS_WEB = Platform.OS === 'web';
const FONT_FAMILY = Platform.OS === 'ios' ? 'System' : 'sans-serif';

const showAlert = (title: string, message: string, onOk?: () => void) => {
  if (Platform.OS === 'web') {
    // eslint-disable-next-line no-alert
    window.alert(`${title}\n\n${message}`);
    onOk?.();
  } else {
    // eslint-disable-next-line global-require
    require('react-native').Alert.alert(title, message, [{ text: 'OK', onPress: onOk }]);
  }
};

const formatMoney = (n: number) => `\u20b9${n.toFixed(2)}`;

type Vendor = { id: number; name: string; phone?: string | null };
type Product = { id: number; name: string; barcode?: string | null; stock_qty?: number; unit?: string; cost_price?: number };

type OrderItem = {
  productId: number;
  name: string;
  barcode?: string | null;
  unit: string;
  currentStock: number;
  unitCost: string; // kept as string for the input, parsed on submit/total calc
  qty: number;
};

// ---------------------------------------------------------------------------
// Section wrapper — matches Add Product screen's card/section styling
// ---------------------------------------------------------------------------
function SectionCard({
  icon,
  number,
  title,
  children,
  last,
}: {
  icon: keyof typeof Feather.glyphMap;
  number: number;
  title: string;
  children: React.ReactNode;
  last?: boolean;
}) {
  return (
    <View style={{ zIndex: 100 - number * 10, position: 'relative' }}>
      <View style={styles.cardHeaderRow}>
        <View style={styles.cardIconWrap}>
          <Feather name={icon} size={15} color={THEME.primary} />
        </View>
        <Text style={styles.cardTitle}>
          {number}. {title}
        </Text>
      </View>
      {children}
      {!last ? <View style={styles.sectionDivider} /> : null}
    </View>
  );
}

function FieldRow({ children, z }: { children: React.ReactNode; z?: number }) {
  return <View style={[styles.fieldRow, { zIndex: z ?? 1, position: 'relative' }]}>{children}</View>;
}
function FieldCol({ children, style }: { children: React.ReactNode; style?: any }) {
  return <View style={[styles.fieldCol, style]}>{children}</View>;
}

export default function CreatePurchaseOrderScreen() {
  const insets = useSafeAreaInsets();
  const { business } = useBusiness();
  const queryClient = useQueryClient();

  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [vendorQuery, setVendorQuery] = useState('');
  const [vendorFocused, setVendorFocused] = useState(false);

  const [productQuery, setProductQuery] = useState('');
  const [productFocused, setProductFocused] = useState(false);
  const [items, setItems] = useState<OrderItem[]>([]);
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);

  // ---- Vendors — reuse the exact same hook Add Product uses ----
  const vendorsParams = { business_id: business?.id as number };
  const { data: vendorsData } = useListVendors(vendorsParams, {
    query: { enabled: !!business?.id, queryKey: getListVendorsQueryKey(vendorsParams) },
  });
  const toArray = (d: any): any[] => (Array.isArray(d) ? d : d?.data ?? d?.items ?? d?.vendors ?? d?.products ?? []);
  const vendorList: Vendor[] = toArray(vendorsData);

  const filteredVendors = vendorFocused
    ? vendorList
        .filter((v) => v.name.toLowerCase().includes(vendorQuery.trim().toLowerCase()))
        .slice(0, 6)
    : [];

  // ---- Products — reuse the exact same hook Add Product uses ----
  const productsParams = { business_id: business?.id as number, limit: 300 };
  const { data: productsData } = useListProducts(productsParams, {
    query: { enabled: !!business?.id, queryKey: getListProductsQueryKey(productsParams) },
  });
  const productList: Product[] = toArray(productsData);

  const filteredProducts = productFocused
    ? productList
        .filter((p) => {
          const q = productQuery.trim().toLowerCase();
          if (!q) return true;
          return p.name.toLowerCase().includes(q) || (p.barcode ?? '').includes(q);
        })
        .slice(0, 8)
    : [];

  // ---- PO number preview (cosmetic only — the real one is assigned atomically on save) ----
  const { data: nextNumberData } = useQuery({
    queryKey: ['/api/purchase-orders/next-number', business?.id],
    enabled: !!business?.id,
    queryFn: () => customFetch(`/api/purchase-orders/next-number?business_id=${business?.id}`, { responseType: 'json' }),
  });
  const previewNumber = (nextNumberData as any)?.preview_number ?? '—';

  const orderDate = useMemo(() => new Date().toLocaleDateString('en-GB'), []);

  // ---- Add / update item ----
  const handleSelectProduct = (p: Product) => {
    setItems((prev) => {
      const existing = prev.find((it) => it.productId === p.id);
      if (existing) {
        return prev.map((it) => (it.productId === p.id ? { ...it, qty: it.qty + 1 } : it));
      }
      return [
        ...prev,
        {
          productId: p.id,
          name: p.name,
          barcode: p.barcode,
          unit: p.unit ?? 'pcs',
          currentStock: p.stock_qty ?? 0,
          unitCost: p.cost_price != null ? String(p.cost_price) : '0',
          qty: 1,
        },
      ];
    });
    setProductQuery('');
    setProductFocused(false);
  };

  const updateQty = (productId: number, delta: number) => {
    setItems((prev) =>
      prev.map((it) => (it.productId === productId ? { ...it, qty: Math.max(1, it.qty + delta) } : it)),
    );
  };
  const updateUnitCost = (productId: number, value: string) => {
    setItems((prev) => prev.map((it) => (it.productId === productId ? { ...it, unitCost: value } : it)));
  };
  const removeItem = (productId: number) => {
    setItems((prev) => prev.filter((it) => it.productId !== productId));
  };

  // ---- Summary ----
  const totalItems = items.length;
  const totalQty = items.reduce((sum, it) => sum + it.qty, 0);
  const purchaseTotal = items.reduce((sum, it) => sum + it.qty * (parseFloat(it.unitCost) || 0), 0);

  // ---- Create PO ----
  const createPurchaseOrder = useMutation({
    mutationFn: (payload: any) => customFetch('/api/purchase-orders', { method: 'POST', body: JSON.stringify(payload) }),
  });

  const handleCreate = () => {
    setError(null);

    if (!business?.id) {
      setError('No business selected. Please set up your business first.');
      return;
    }
    if (!selectedVendor) {
      setError('Select a vendor from the list.');
      return;
    }
    if (items.length === 0) {
      setError('Add at least one product to the order.');
      return;
    }
    for (const it of items) {
      if (!it.qty || it.qty <= 0) {
        setError(`${it.name}: quantity must be greater than 0.`);
        return;
      }
      const cost = parseFloat(it.unitCost);
      if (isNaN(cost) || cost < 0) {
        setError(`${it.name}: enter a valid unit cost.`);
        return;
      }
    }

    const payload = {
      business_id: business.id,
      vendor_id: selectedVendor.id,
      notes: notes.trim() || undefined,
      items: items.map((it) => ({
        product_id: it.productId,
        qty: it.qty,
        unit_cost: parseFloat(it.unitCost),
      })),
    };

    createPurchaseOrder.mutate(payload, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['/api/purchase-orders'], exact: false });
        showAlert('Success', 'Purchase Order created successfully.', () => router.back());
      },
      onError: () => setError('Could not create purchase order. Please try again.'),
    });
  };

  return (
    <View style={{ flex: 1, backgroundColor: THEME.background }}>
      <View style={[styles.pageHeader, { paddingTop: insets.top + 14 }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} hitSlop={8}>
          <Feather name="arrow-left" size={18} color={THEME.text} />
        </TouchableOpacity>
        <View>
          <Text style={styles.pageTitle}>Create Purchase Order</Text>
          <Text style={styles.pageSubtitle}>Create a new purchase order for your supplier</Text>
        </View>
      </View>

      <KeyboardAwareScrollViewCompat style={{ flex: 1 }} contentContainerStyle={styles.scrollContent} bottomOffset={40}>
        {error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        <View style={styles.card}>
          {/* 1. ORDER INFORMATION */}
          <SectionCard icon="file-text" number={1} title="Order Information">
            <FieldRow>
              <FieldCol>
                <Text style={styles.fieldLabel}>Purchase Order Number</Text>
                <View style={[styles.textInput, styles.inputDisabled]}>
                  <Text style={styles.disabledText}>{previewNumber}</Text>
                </View>
                <Text style={styles.hintText}>Automatically generated</Text>
              </FieldCol>
              <FieldCol>
                <Text style={styles.fieldLabel}>Order Date</Text>
                <View style={[styles.textInput, styles.inputDisabled]}>
                  <Text style={styles.disabledText}>{orderDate}</Text>
                </View>
              </FieldCol>
              <FieldCol>
                <Text style={styles.fieldLabel}>Order Type</Text>
                <View style={[styles.textInput, styles.inputDisabled]}>
                  <Text style={styles.disabledText}>Purchase Order</Text>
                </View>
                <Text style={styles.hintText}>Read only</Text>
              </FieldCol>
            </FieldRow>
            <View>
              <Text style={styles.fieldLabel}>Status</Text>
              <View style={[styles.statusPill, { backgroundColor: THEME.warningBg }]}>
                <View style={[styles.statusDot, { backgroundColor: THEME.warning }]} />
                <Text style={[styles.statusPillText, { color: THEME.warning }]}>Pending</Text>
              </View>
              <Text style={styles.hintText}>Initial status is set to Pending</Text>
            </View>
          </SectionCard>

          {/* 2. SUPPLIER INFORMATION */}
          <SectionCard icon="truck" number={2} title="Supplier Information">
            <View style={{ zIndex: 30 }}>
              <Text style={styles.fieldLabel}>
                Select Vendor<Text style={{ color: THEME.danger }}> *</Text>
              </Text>
              {selectedVendor ? (
                <View style={styles.selectedVendorRow}>
                  <View style={styles.selectedVendorInfo}>
                    <Feather name="check-circle" size={14} color={THEME.success} />
                    <Text style={styles.selectedVendorName}>{selectedVendor.name}</Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => {
                      setSelectedVendor(null);
                      setVendorQuery('');
                    }}
                  >
                    <Text style={styles.changeLink}>Change</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={{ position: 'relative' }}>
                  <View style={styles.selectLikeInput}>
                    <Feather name="search" size={14} color={THEME.placeholder} />
                    <TextInput
                      placeholder="Search and select vendor..."
                      placeholderTextColor={THEME.placeholder}
                      value={vendorQuery}
                      onChangeText={setVendorQuery}
                      onFocus={() => setVendorFocused(true)}
                      onBlur={() => setTimeout(() => setVendorFocused(false), 150)}
                      style={styles.selectLikeInputText}
                    />
                  </View>
                  {vendorFocused && filteredVendors.length > 0 ? (
                    <View style={styles.suggestionBox}>
                      {filteredVendors.map((v) => (
                        <TouchableOpacity
                          key={v.id}
                          style={styles.suggestionItem}
                          onPress={() => {
                            setSelectedVendor(v);
                            setVendorFocused(false);
                          }}
                        >
                          <Text style={styles.suggestionText}>{v.name}</Text>
                          {v.phone ? <Text style={styles.suggestionSubtext}>{v.phone}</Text> : null}
                        </TouchableOpacity>
                      ))}
                    </View>
                  ) : null}
                </View>
              )}
              {vendorList.length === 0 ? (
                <Text style={styles.hintText}>No vendors found. Add a vendor from the Add Product screen first.</Text>
              ) : null}
            </View>
          </SectionCard>

          {/* 3. PRODUCTS / ORDER ITEMS */}
          <SectionCard icon="package" number={3} title="Products / Order Items">
            <View style={{ zIndex: 20 }}>
              <View style={{ position: 'relative' }}>
                <View style={styles.selectLikeInput}>
                  <Feather name="search" size={14} color={THEME.placeholder} />
                  <TextInput
                    placeholder="Search product by name, barcode..."
                    placeholderTextColor={THEME.placeholder}
                    value={productQuery}
                    onChangeText={setProductQuery}
                    onFocus={() => setProductFocused(true)}
                    onBlur={() => setTimeout(() => setProductFocused(false), 150)}
                    style={styles.selectLikeInputText}
                  />
                </View>
                {productFocused && filteredProducts.length > 0 ? (
                  <View style={styles.suggestionBox}>
                    {filteredProducts.map((p) => (
                      <TouchableOpacity key={p.id} style={styles.suggestionItem} onPress={() => handleSelectProduct(p)}>
                        <Text style={styles.suggestionText}>{p.name}</Text>
                        <Text style={styles.suggestionSubtext}>
                          {p.barcode ? `Barcode: ${p.barcode} · ` : ''}Stock: {p.stock_qty ?? 0} {p.unit ?? 'pcs'}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                ) : null}
              </View>
            </View>

            {items.length === 0 ? (
              <View style={styles.emptyItemsBox}>
                <Feather name="box" size={22} color={THEME.placeholder} />
                <Text style={styles.emptyItemsText}>No products added yet. Search above to add items.</Text>
              </View>
            ) : (
              <View style={styles.itemsTable}>
                {IS_WEB ? (
                  <View style={styles.itemsTableHeaderRow}>
                    <Text style={[styles.itemsTableHeaderCell, { flex: 2.4 }]}>Product</Text>
                    <Text style={styles.itemsTableHeaderCell}>Stock</Text>
                    <Text style={styles.itemsTableHeaderCell}>Unit Cost</Text>
                    <Text style={[styles.itemsTableHeaderCell, { flex: 1.4 }]}>Qty</Text>
                    <Text style={styles.itemsTableHeaderCell}>Total</Text>
                    <Text style={[styles.itemsTableHeaderCell, { flex: 0.6 }]} />
                  </View>
                ) : null}

                {items.map((it) => {
                  const lineTotal = it.qty * (parseFloat(it.unitCost) || 0);
                  return (
                    <View key={it.productId} style={styles.itemRow}>
                      <View style={{ flex: IS_WEB ? 2.4 : undefined, marginBottom: IS_WEB ? 0 : 8 }}>
                        <Text style={styles.itemName} numberOfLines={1}>
                          {it.name}
                        </Text>
                        {it.barcode ? <Text style={styles.itemMeta}>Barcode: {it.barcode}</Text> : null}
                      </View>
                      <View style={styles.itemCell}>
                        <Text style={styles.itemMeta}>
                          {it.currentStock} {it.unit}
                        </Text>
                      </View>
                      <View style={styles.itemCell}>
                        <TextInput
                          value={it.unitCost}
                          onChangeText={(v) => updateUnitCost(it.productId, v.replace(/[^0-9.]/g, ''))}
                          keyboardType="decimal-pad"
                          style={styles.itemCostInput}
                        />
                      </View>
                      <View style={[styles.itemCell, { flex: 1.4, flexDirection: 'row', alignItems: 'center', gap: 6 }]}>
                        <TouchableOpacity onPress={() => updateQty(it.productId, -1)} style={styles.qtyBtn}>
                          <Feather name="minus" size={12} color={THEME.text} />
                        </TouchableOpacity>
                        <Text style={styles.qtyValue}>{it.qty}</Text>
                        <TouchableOpacity onPress={() => updateQty(it.productId, 1)} style={styles.qtyBtn}>
                          <Feather name="plus" size={12} color={THEME.text} />
                        </TouchableOpacity>
                      </View>
                      <View style={styles.itemCell}>
                        <Text style={styles.itemTotalText}>{formatMoney(lineTotal)}</Text>
                      </View>
                      <View style={[styles.itemCell, { flex: 0.6, alignItems: 'flex-end' }]}>
                        <TouchableOpacity onPress={() => removeItem(it.productId)} hitSlop={6}>
                          <Feather name="trash-2" size={16} color={THEME.danger} />
                        </TouchableOpacity>
                      </View>
                    </View>
                  );
                })}
              </View>
            )}
          </SectionCard>

          {/* 4. NOTES */}
          <SectionCard icon="file-text" number={4} title="Notes / Remarks (Optional)" last>
            <TextInput
              multiline
              numberOfLines={4}
              maxLength={250}
              placeholder="Enter any notes or remarks about this purchase order..."
              placeholderTextColor={THEME.placeholder}
              value={notes}
              onChangeText={setNotes}
              style={[styles.textInput, styles.textArea]}
            />
            <Text style={styles.charCount}>{notes.length} / 250 characters</Text>
          </SectionCard>

          {/* ORDER SUMMARY */}
          <View style={styles.summaryBox}>
            <Text style={styles.summaryTitle}>Order Summary</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total Items</Text>
              <Text style={styles.summaryValue}>{totalItems}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total Quantity</Text>
              <Text style={styles.summaryValue}>{totalQty} pcs</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryRow}>
              <Text style={styles.summaryTotalLabel}>Purchase Total</Text>
              <Text style={styles.summaryTotalValue}>{formatMoney(purchaseTotal)}</Text>
            </View>
          </View>

          {/* ACTIONS */}
          <View style={styles.bottomBarInline}>
            <TouchableOpacity onPress={() => router.back()} style={styles.cancelBtn} activeOpacity={0.7}>
              <Feather name="x" size={15} color={THEME.text} style={{ marginRight: 6 }} />
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
            <PrimaryButton
              label="Create Purchase Order"
              onPress={handleCreate}
              loading={createPurchaseOrder.isPending}
              disabled={createPurchaseOrder.isPending}
              style={styles.saveBtn}
            />
          </View>
        </View>
      </KeyboardAwareScrollViewCompat>
    </View>
  );
}

const CONTENT_MAX_WIDTH = 1160;

const styles = StyleSheet.create({
  pageHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingHorizontal: 20,
    paddingBottom: 14,
    backgroundColor: THEME.background,
    borderBottomWidth: 1,
    borderBottomColor: THEME.divider,
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

  scrollContent: { padding: 20, paddingBottom: 28, maxWidth: CONTENT_MAX_WIDTH, width: '100%', alignSelf: 'center' },

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
    gap: 0,
    ...(IS_WEB
      ? ({ boxShadow: '0 1px 3px rgba(15,23,42,0.04)' } as any)
      : { shadowColor: '#000', shadowOpacity: 0.03, shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, elevation: 1 }),
  },
  sectionDivider: { height: 1, backgroundColor: THEME.divider, marginVertical: 20 },

  cardHeaderRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 16 },
  cardIconWrap: { width: 28, height: 28, borderRadius: 8, backgroundColor: THEME.primarySoft, alignItems: 'center', justifyContent: 'center' },
  cardTitle: { fontSize: 15, fontWeight: '700', color: THEME.text, fontFamily: FONT_FAMILY },

  fieldRow: { flexDirection: IS_WEB ? 'row' : 'column', gap: 16, marginBottom: 14 },
  fieldCol: { flex: 1, minWidth: IS_WEB ? 180 : undefined },
  fieldLabel: { fontSize: 12.5, fontWeight: '600', color: THEME.label, marginBottom: 6, fontFamily: FONT_FAMILY },
  hintText: { fontSize: 10.5, color: THEME.placeholder, marginTop: 4, fontFamily: FONT_FAMILY },

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
  inputDisabled: { backgroundColor: '#F3F4F6', justifyContent: 'center' },
  disabledText: { fontSize: 13.5, color: THEME.muted, fontFamily: FONT_FAMILY },
  textArea: { minHeight: 80, textAlignVertical: 'top' },
  charCount: { fontSize: 10.5, color: THEME.placeholder, textAlign: 'right', marginTop: 4, fontFamily: FONT_FAMILY },

  statusPill: { flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8 },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  statusPillText: { fontSize: 12.5, fontWeight: '700', fontFamily: FONT_FAMILY },

  selectLikeInput: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: THEME.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: THEME.card,
  },
  selectLikeInputText: { flex: 1, fontSize: 13.5, color: THEME.text, fontFamily: FONT_FAMILY, ...(IS_WEB ? ({ outlineStyle: 'none' } as any) : {}) },
  suggestionBox: {
    position: 'absolute',
    top: 44,
    left: 0,
    right: 0,
    backgroundColor: THEME.card,
    borderWidth: 1,
    borderColor: THEME.border,
    borderRadius: 8,
    overflow: 'hidden',
    zIndex: 999,
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    maxHeight: 280,
  },
  suggestionItem: { paddingHorizontal: 12, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: THEME.divider },
  suggestionText: { fontSize: 13, color: THEME.text, fontFamily: FONT_FAMILY, fontWeight: '600' },
  suggestionSubtext: { fontSize: 11, color: THEME.muted, fontFamily: FONT_FAMILY, marginTop: 2 },

  selectedVendorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: THEME.success,
    backgroundColor: 'rgba(22,163,74,0.06)',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  selectedVendorInfo: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  selectedVendorName: { fontSize: 13.5, fontWeight: '700', color: THEME.text, fontFamily: FONT_FAMILY },
  changeLink: { fontSize: 12, fontWeight: '700', color: THEME.primary, fontFamily: FONT_FAMILY },

  emptyItemsBox: {
    borderWidth: 1,
    borderColor: THEME.border,
    borderStyle: 'dashed',
    borderRadius: 10,
    paddingVertical: 28,
    alignItems: 'center',
    gap: 8,
    marginTop: 14,
    backgroundColor: '#FAFAFA',
  },
  emptyItemsText: { fontSize: 12.5, color: THEME.placeholder, fontFamily: FONT_FAMILY },

  itemsTable: { marginTop: 14, borderWidth: 1, borderColor: THEME.border, borderRadius: 10, overflow: 'hidden' },
  itemsTableHeaderRow: { flexDirection: 'row', backgroundColor: '#F9FAFB', paddingHorizontal: 12, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: THEME.border },
  itemsTableHeaderCell: { flex: 1, fontSize: 10.5, fontWeight: '700', color: THEME.muted, textTransform: 'uppercase', fontFamily: FONT_FAMILY },
  itemRow: {
    flexDirection: IS_WEB ? 'row' : 'column',
    alignItems: IS_WEB ? 'center' : 'stretch',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: THEME.divider,
  },
  itemCell: { flex: 1, justifyContent: 'center' },
  itemName: { fontSize: 13, fontWeight: '700', color: THEME.text, fontFamily: FONT_FAMILY },
  itemMeta: { fontSize: 11, color: THEME.muted, fontFamily: FONT_FAMILY, marginTop: 2 },
  itemCostInput: {
    borderWidth: 1,
    borderColor: THEME.border,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 6,
    fontSize: 12.5,
    color: THEME.text,
    fontFamily: FONT_FAMILY,
    maxWidth: 90,
    ...(IS_WEB ? ({ outlineStyle: 'none' } as any) : {}),
  },
  qtyBtn: { width: 24, height: 24, borderRadius: 6, borderWidth: 1, borderColor: THEME.border, alignItems: 'center', justifyContent: 'center' },
  qtyValue: { fontSize: 13, fontWeight: '700', color: THEME.text, fontFamily: FONT_FAMILY, minWidth: 18, textAlign: 'center' },
  itemTotalText: { fontSize: 13, fontWeight: '700', color: THEME.text, fontFamily: FONT_FAMILY },

  summaryBox: {
    marginTop: 20,
    backgroundColor: THEME.primarySoft,
    borderRadius: 10,
    padding: 16,
  },
  summaryTitle: { fontSize: 13, fontWeight: '700', color: THEME.primary, marginBottom: 10, fontFamily: FONT_FAMILY },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 },
  summaryLabel: { fontSize: 12.5, color: THEME.muted, fontFamily: FONT_FAMILY },
  summaryValue: { fontSize: 12.5, fontWeight: '700', color: THEME.text, fontFamily: FONT_FAMILY },
  summaryDivider: { height: 1, backgroundColor: THEME.border, marginVertical: 8 },
  summaryTotalLabel: { fontSize: 13.5, fontWeight: '700', color: THEME.primary, fontFamily: FONT_FAMILY },
  summaryTotalValue: { fontSize: 17, fontWeight: '800', color: THEME.primary, fontFamily: FONT_FAMILY },

  bottomBarInline: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 22,
    paddingTop: 18,
    borderTopWidth: 1,
    borderTopColor: THEME.divider,
  },
  cancelBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.card,
    borderWidth: 1,
    borderColor: THEME.border,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  cancelBtnText: { fontSize: 13.5, fontWeight: '600', color: THEME.text, fontFamily: FONT_FAMILY },
  saveBtn: { backgroundColor: THEME.primary, paddingHorizontal: 26 },
});