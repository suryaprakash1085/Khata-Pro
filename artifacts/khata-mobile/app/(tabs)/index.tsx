import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';
import { useBusiness } from '@/contexts/BusinessContext';
import { useAuth } from '@/contexts/AuthContext';
// @ts-ignore
import {
  useGetBusinessStats,
  useListCustomers,
  useListProducts,
  useListPurchases,
  useListSalesOrders,
  getGetBusinessStatsQueryKey,
  getListCustomersQueryKey,
  getListProductsQueryKey,
  getListPurchasesQueryKey,
  getListSalesOrdersQueryKey,
} from '@workspace/api-client-react';
// @ts-ignore
import type { Customer } from '@workspace/api-client-react';
import { formatCurrency } from '@/lib/format';

const IS_WEB = Platform.OS === 'web';

const ACTIONS = [
  { icon: 'shopping-cart', label: 'New Billing', route: '/billing', color: '#2563EB' },
  { icon: 'box', label: 'Add Product', route: '/add-product', color: '#14B8A6' },
  { icon: 'user-plus', label: 'Add Customer', route: '/add-customer', color: '#8B5CF6' },
  { icon: 'file-text', label: 'Create Order', route: '/add-transaction', color: '#F59E0B' },
  { icon: 'trending-down', label: 'Add Expense', route: '/add-expense', color: '#E4664B' },

] as const;

// 2x2 grid — order matters (fills top-left, top-right, bottom-left, bottom-right)
const SALES_ACTIVITY_CARDS = [
  { label: 'To be Collected', unit: 'Amount', field: 'total_to_collect', color: '#2563EB', icon: 'arrow-down-circle' },
  { label: 'To be Paid', unit: 'Amount', field: 'total_to_pay', color: '#F97316', icon: 'arrow-up-circle' },
  { label: "Today's Sales", unit: 'Amount', field: 'today_sales', color: '#16A34A', icon: 'trending-up' },
  { label: 'Orders', unit: 'Count', field: 'transaction_count', color: '#8B5CF6', icon: 'shopping-bag' },
];

// This month's date range, as YYYY-MM-DD strings (matches entry_date filters on the API)
function getMonthRange() {
  const now = new Date();
  const from = new Date(now.getFullYear(), now.getMonth(), 1);
  const fromStr = from.toISOString().split('T')[0];
  const toStr = now.toISOString().split('T')[0];
  return { from: fromStr, to: toStr };
}

const SO_STATUSES = ['pending', 'confirmed', 'packed', 'shipped', 'invoiced'] as const;
const SO_CHANNELS = ['online', 'store', 'phone'] as const;
const SO_CHANNEL_LABELS: Record<(typeof SO_CHANNELS)[number], string> = {
  online: 'Online',
  store: 'Store',
  phone: 'Phone',
};

// Defensive field readers — exact schema names can vary by backend version.
// Defensive field readers — matches productsTable schema (snake_case from API/Drizzle)
function getStockQty(p: any): number {
  return Number(p?.stock_qty ?? 0) || 0;
}
function getReorderPoint(p: any): number {
  return Number(p?.low_stock_alert ?? 5) || 5;
}
function isActiveProduct(p: any): boolean {
  return p?.is_deleted !== true;
}
function getProductImage(p: any): string | null {
  return p?.image ?? null;
}
function getProductUnit(p: any): string {
  return p?.unit ?? 'pcs';
}

export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { business } = useBusiness();
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);

  const { data: stats } = useGetBusinessStats(business?.id as number, {
    query: { enabled: !!business?.id, queryKey: getGetBusinessStatsQueryKey(business?.id as number) },
  });

  const customersParams = { business_id: business?.id as number, search: search || undefined, limit: 6 };
  const customersQuery = useListCustomers(customersParams, {
    query: { enabled: !!business?.id && search.trim().length > 0, queryKey: getListCustomersQueryKey(customersParams) },
  });
  const searchResults: Customer[] = search.trim().length > 0 ? customersQuery.data?.data ?? [] : [];
  const searchLoading = customersQuery.isLoading && search.trim().length > 0;

  // Products — powers Inventory Summary, Product Details, and Top Selling Items.
  const productsParams = { business_id: business?.id as number, limit: 500 };
  const productsQuery = useListProducts(productsParams, {
    query: { enabled: !!business?.id, queryKey: getListProductsQueryKey(productsParams) },
  });
  const products: any[] = productsQuery.data?.data ?? [];
  const productsLoading = productsQuery.isLoading;

  const inventoryMetrics = useMemo(() => {
    const totalItems = products.length;
    const quantityInHand = products.reduce((sum, p) => sum + getStockQty(p), 0);
    const lowStockCount = products.filter((p) => getStockQty(p) <= getReorderPoint(p)).length;
    const activeCount = products.filter(isActiveProduct).length;
    const activePercent = totalItems > 0 ? Math.round((activeCount / totalItems) * 100) : 0;
    const groupSet = new Set(products.map((p) => p?.category ?? p?.group_name).filter(Boolean));
    return { totalItems, quantityInHand, lowStockCount, activePercent, itemGroups: groupSet.size };
  }, [products]);

  // "Top selling" — best-effort sort by stock movement proxy (falls back to insertion order)
  const topSellingItems = useMemo(() => {
    return [...products]
      .sort((a, b) => (Number(b?.sold_count ?? 0) || 0) - (Number(a?.sold_count ?? 0) || 0))
      .slice(0, 10);
  }, [products]);

  // ---------------- Purchase Order — this month's purchases from vendors ----------------
  const { from: monthFrom, to: monthTo } = useMemo(() => getMonthRange(), []);

  const purchasesParams = { business_id: business?.id as number, from: monthFrom, to: monthTo, limit: 200 };
  const purchasesQuery = useListPurchases(purchasesParams, {
    query: { enabled: !!business?.id, queryKey: getListPurchasesQueryKey(purchasesParams) },
  });
  const purchases: any[] = purchasesQuery.data?.data ?? [];
  const purchasesLoading = purchasesQuery.isLoading;

  const purchaseMetrics = useMemo(() => {
    // NOTE: list endpoint returns product_count (line items) per purchase, not exact unit qty
    // (unit qty requires a per-purchase fetch of items). This is "items ordered", not "units ordered".
    const itemsOrdered = purchases.reduce((sum, p) => sum + (Number(p?.product_count) || 0), 0);
    const totalCost = purchases.reduce((sum, p) => sum + (Number(p?.amount) || 0), 0);
    return { itemsOrdered, totalCost };
  }, [purchases]);

  // ---------------- Sales Order — this month's orders, grouped by channel + status ----------------
  const salesOrdersParams = { business_id: business?.id as number, from: monthFrom, to: monthTo, limit: 200 };
  const salesOrdersQuery = useListSalesOrders(salesOrdersParams, {
    query: { enabled: !!business?.id, queryKey: getListSalesOrdersQueryKey(salesOrdersParams) },
  });
  const salesOrders: any[] = salesOrdersQuery.data?.data ?? [];
  const salesOrdersLoading = salesOrdersQuery.isLoading;

  const salesOrderMatrix = useMemo(() => {
    return SO_CHANNELS.map((channel) => {
      const row: Record<string, number> = { pending: 0, confirmed: 0, packed: 0, shipped: 0, invoiced: 0 };
      for (const so of salesOrders) {
        if (so?.channel === channel && row[so?.status] !== undefined) {
          row[so.status] += 1;
        }
      }
      return { channel, ...row };
    }).filter((row) => SO_STATUSES.some((s) => (row as any)[s] > 0)); // hide channels with zero orders
  }, [salesOrders]);

  const handleAction = (route: (typeof ACTIONS)[number]['route']) => router.push(route);

  const handleSelectCustomer = (customer: Customer) => {
    setSearch('');
    setSearchOpen(false);
    router.push(`/customer/${customer.id}` as any);
  };

  const webInputFix = IS_WEB
    ? ({ outlineStyle: 'none', outlineWidth: 0, caretColor: colors.primary } as any)
    : undefined;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top + 12,
          paddingBottom: insets.bottom + 32,
          paddingHorizontal: 16,
        }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header: search bar + profile, with results dropdown anchored right below it */}
        <View style={styles.searchAreaWrap}>
          <View style={styles.headerRow}>
            <View style={[styles.searchWrapper, styles.searchContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Feather name="search" size={15} color={colors.mutedForeground} />
              <TextInput
                value={search}
                onChangeText={setSearch}
                onFocus={() => setSearchOpen(true)}
                onBlur={() => setTimeout(() => setSearchOpen(false), 150)}
                placeholder="Search customers, products..."
                placeholderTextColor={colors.mutedForeground}
                selectionColor={colors.primary}
                style={[styles.searchInput, { color: colors.foreground }, webInputFix]}
              />
              {search.length > 0 && (
                <Pressable onPress={() => setSearch('')} hitSlop={8}>
                  <Feather name="x" size={15} color={colors.mutedForeground} />
                </Pressable>
              )}
            </View>

            <Pressable
              onPress={() => router.push('/profile' as any)}
              style={[styles.profileButton, { backgroundColor: colors.card, borderColor: colors.border }]}
            >
              {(user as any)?.avatar_url ? (
                <Image source={{ uri: (user as any).avatar_url }} style={styles.profileAvatar} />
              ) : (
                <Feather name="user" size={17} color={colors.primary} />
              )}
            </Pressable>
          </View>

          {searchOpen && search.trim().length > 0 && (
            <View style={[styles.searchDropdown, { backgroundColor: colors.card, borderColor: colors.border }]}>
              {searchLoading ? (
                <ActivityIndicator style={{ paddingVertical: 18 }} color={colors.primary} />
              ) : searchResults.length === 0 ? (
                <Text style={[styles.searchEmptyText, { color: colors.mutedForeground }]}>No customers found</Text>
              ) : (
                searchResults.map((c, index) => (
                  <Pressable
                    key={c.id}
                    onPress={() => handleSelectCustomer(c)}
                    style={({ pressed }) => [
                      styles.searchResultRow,
                      index !== searchResults.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.border },
                      pressed && { backgroundColor: colors.background },
                    ]}
                  >
                    <View style={[styles.searchResultIcon, { backgroundColor: colors.primary + '15' }]}>
                      <Feather name="user" size={14} color={colors.primary} />
                    </View>
                    <Text style={[styles.searchResultText, { color: colors.foreground }]} numberOfLines={1}>
                      {c.name}
                    </Text>
                    <Feather name="chevron-right" size={16} color={colors.mutedForeground} />
                  </Pressable>
                ))
              )}
            </View>
          )}
        </View>

        {/* Quick actions */}
        <View style={styles.actionRow}>
          {ACTIONS.map((action) => (
            <Pressable key={action.label} style={styles.actionItem} onPress={() => handleAction(action.route)} hitSlop={4}>
              <View style={[styles.actionIcon, { backgroundColor: action.color + '15' }]}>
                <Feather name={action.icon as any} size={20} color={action.color} />
              </View>
              <Text style={[styles.actionLabel, { color: colors.foreground }]} numberOfLines={2}>
                {action.label}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* ---------------- Sales Activity ---------------- */}
        <CardSection title="Sales Activity" colors={colors}>
          <View style={styles.statGrid}>
            {SALES_ACTIVITY_CARDS.map((item, i) => {
              const value =
                item.field === 'transaction_count'
                  ? String(stats?.transaction_count ?? 0)
                  : formatCurrency((stats as any)?.[item.field] ?? 0, business?.currency);
              const isRightCol = i % 2 === 1;
              const isTopRow = i < 2;
              return (
                <View
                  key={item.label}
                  style={[
                    styles.statCell,
                    !isRightCol && { borderRightWidth: 1, borderRightColor: colors.border },
                    isTopRow && { borderBottomWidth: 1, borderBottomColor: colors.border },
                  ]}
                >
                  <Text style={[styles.statValue, { color: item.color }]} numberOfLines={1}>
                    {value}
                  </Text>
                  <Text style={[styles.statUnit, { color: colors.mutedForeground }]}>{item.unit}</Text>
                  <View style={styles.statCaption}>
                    <Feather name={item.icon as any} size={11} color={colors.mutedForeground} />
                    <Text style={[styles.statCaptionText, { color: colors.mutedForeground }]} numberOfLines={1}>
                      {item.label}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        </CardSection>

        {/* ---------------- Inventory Summary ---------------- */}
        <CardSection title="Inventory Summary" colors={colors}>
          <LabelValueRow
            colors={colors}
            label="Quantity in Hand"
            value={productsLoading ? '—' : String(inventoryMetrics.quantityInHand)}
            onPress={() => router.push('/product-list' as any)}
          />
          <LabelValueRow colors={colors} label="Quantity to be Received" value="—" muted last />
        </CardSection>

        {/* ---------------- Product Details ---------------- */}
        <CardSection title="Product Details" colors={colors}>
          <View style={styles.productDetailsRow}>
            <View style={{ flex: 1 }}>
              <LabelValueRow
                colors={colors}
                label="Low Stock Items"
                value={productsLoading ? '—' : String(inventoryMetrics.lowStockCount)}
                valueColor="#DC2626"
                labelColor="#DC2626"
                onPress={() => router.push('/product-list' as any)}
                compact
              />
              <LabelValueRow
                colors={colors}
                label="All Item Groups"
                value={productsLoading ? '—' : String(inventoryMetrics.itemGroups)}
                compact
              />
              <LabelValueRow
                colors={colors}
                label="All Items"
                value={productsLoading ? '—' : String(inventoryMetrics.totalItems)}
                onPress={() => router.push('/product-list' as any)}
                compact
                last
              />
            </View>
            <View style={styles.donutWrap}>
              <DonutPercent
                percent={productsLoading ? 0 : inventoryMetrics.activePercent}
                color="#16A34A"
                trackColor={colors.border}
                bg={colors.card}
              />
              <Text style={[styles.donutLabel, { color: colors.mutedForeground }]}>Active Items</Text>
            </View>
          </View>
        </CardSection>

        {/* ---------------- Top Selling Items ---------------- */}
        <CardSection title="Top Selling Items" chip="This Month" colors={colors}>
          {productsLoading ? (
            <ActivityIndicator style={{ paddingVertical: 20 }} color={colors.primary} />
          ) : topSellingItems.length === 0 ? (
            <Text style={[styles.searchEmptyText, { color: colors.mutedForeground, paddingVertical: 12 }]}>
              No products added yet
            </Text>
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12 }}>
              {topSellingItems.map((p) => {
                const imgUri = getProductImage(p);
                return (
                  <Pressable
                    key={p.id}
                    style={styles.productTile}
                    onPress={() => router.push('/product-list' as any)}
                  >
                    <View style={styles.productImageWrap}>
                      {imgUri ? (
                        <Image source={{ uri: imgUri }} style={[styles.productImage, { backgroundColor: colors.background }]} />
                      ) : (
                        <View style={[styles.productImage, styles.productImageFallback, { backgroundColor: colors.background }]}>
                          <Feather name="image" size={18} color={colors.mutedForeground} />
                        </View>
                      )}
                      <View style={[styles.productQtyBadge, { backgroundColor: colors.card, borderColor: colors.border }]}>
                        <Text style={[styles.productQtyBadgeText, { color: colors.foreground }]}>
                          {getStockQty(p)}
                          <Text style={{ color: colors.mutedForeground, fontSize: 9 }}>{getProductUnit(p)}</Text>
                        </Text>
                      </View>
                    </View>
                    <Text style={[styles.productName, { color: colors.foreground }]} numberOfLines={2}>
                      {p?.name ?? 'Unnamed product'}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          )}
        </CardSection>

        {/* ---------------- Purchase Order ---------------- */}
        <CardSection title="Purchase Order" chip="This Month" colors={colors}>
          <View style={styles.purchaseOrderRow}>
            <View style={styles.purchaseOrderCol}>
              <Text style={[styles.purchaseOrderLabel, { color: colors.mutedForeground }]}>Items Ordered</Text>
              <Text style={[styles.purchaseOrderValue, { color: colors.primary }]}>
                {purchasesLoading ? '—' : String(purchaseMetrics.itemsOrdered)}
              </Text>
            </View>
            <View style={[styles.purchaseOrderCol, { borderLeftWidth: 1, borderLeftColor: colors.border }]}>
              <Text style={[styles.purchaseOrderLabel, { color: colors.mutedForeground }]}>Total Cost</Text>
              <Text style={[styles.purchaseOrderValue, { color: colors.foreground }]}>
                {purchasesLoading ? '—' : formatCurrency(purchaseMetrics.totalCost, business?.currency)}
              </Text>
            </View>
          </View>
          {purchasesLoading ? (
            <ActivityIndicator style={{ paddingVertical: 12 }} color={colors.primary} />
          ) : purchases.length === 0 ? (
            <Text style={[styles.comingSoonText, { color: colors.mutedForeground, marginTop: 10 }]}>
              No purchases recorded this month.
            </Text>
          ) : null}
        </CardSection>

        {/* ---------------- Sales Order ---------------- */}
        <CardSection title="Sales Order" chip="This Month" colors={colors}>
          <View style={[styles.tableHeaderRow, { borderBottomColor: colors.border }]}>
            {['Channel', 'Pending', 'Confirmed', 'Packed', 'Shipped', 'Invoiced'].map((h) => (
              <Text key={h} style={[styles.tableHeaderCell, { color: colors.mutedForeground }]}>
                {h}
              </Text>
            ))}
          </View>

          {salesOrdersLoading ? (
            <ActivityIndicator style={{ paddingVertical: 20 }} color={colors.primary} />
          ) : salesOrderMatrix.length === 0 ? (
            <View style={styles.centeredComingSoon}>
              <Text style={[styles.comingSoonText, { color: colors.mutedForeground }]}>
                No sales orders placed this month.
              </Text>
            </View>
          ) : (
            salesOrderMatrix.map((row) => (
              <View key={row.channel} style={styles.salesOrderRow}>
                <Text style={[styles.salesOrderChannelCell, { color: colors.foreground }]} numberOfLines={1}>
                  {SO_CHANNEL_LABELS[row.channel as (typeof SO_CHANNELS)[number]]}
                </Text>
                {SO_STATUSES.map((status) => (
                  <Text key={status} style={[styles.salesOrderCountCell, { color: colors.mutedForeground }]}>
                    {(row as any)[status]}
                  </Text>
                ))}
              </View>
            ))
          )}
        </CardSection>

      </ScrollView>
    </View>
  );
}

/* ---------------- Reusable pieces ---------------- */

function CardSection({
  title,
  chip,
  colors,
  children,
}: {
  title: string;
  chip?: string;
  colors: any;
  children: React.ReactNode;
}) {
  return (
    <View style={[styles.sectionCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={[styles.sectionCardHeader, { borderBottomColor: colors.border, backgroundColor: colors.background }]}>
        <Text style={[styles.sectionCardTitle, { color: colors.foreground }]}>{title}</Text>
        {chip && (
          <View style={styles.chip}>
            <Text style={[styles.chipText, { color: colors.mutedForeground }]}>{chip}</Text>
            <Feather name="chevron-down" size={12} color={colors.mutedForeground} />
          </View>
        )}
      </View>
      <View style={styles.sectionCardBody}>{children}</View>
    </View>
  );
}

function LabelValueRow({
  colors,
  label,
  value,
  valueColor,
  labelColor,
  onPress,
  compact,
  muted,
  last,
}: {
  colors: any;
  label: string;
  value: string;
  valueColor?: string;
  labelColor?: string;
  onPress?: () => void;
  compact?: boolean;
  muted?: boolean;
  last?: boolean;
}) {
  const Wrapper = onPress ? Pressable : View;
  return (
    <Wrapper
      onPress={onPress}
      style={[
        styles.labelValueRow,
        !last && { borderBottomWidth: 1, borderBottomColor: colors.border },
        compact && { paddingVertical: 9 },
      ]}
    >
      <Text style={[styles.labelValueLabel, { color: labelColor ?? colors.mutedForeground }]}>{label}</Text>
      <Text style={[styles.labelValueValue, { color: muted ? colors.mutedForeground : valueColor ?? colors.foreground }]}>
        {value}
      </Text>
    </Wrapper>
  );
}

// Simple percentage ring. Uses a CSS conic-gradient on web (crisp arc); on
// native it falls back to a flat colored badge so no extra SVG dependency
// is required.
function DonutPercent({
  percent,
  color,
  trackColor,
  bg,
}: {
  percent: number;
  color: string;
  trackColor: string;
  bg: string;
}) {
  const clamped = Math.max(0, Math.min(100, percent));
  if (IS_WEB) {
    const webStyle = {
      width: 72,
      height: 72,
      borderRadius: 36,
      // @ts-ignore - web-only CSS
      backgroundImage: `conic-gradient(${color} ${clamped * 3.6}deg, ${trackColor} 0deg)`,
      alignItems: 'center',
      justifyContent: 'center',
    } as any;
    return (
      <View style={webStyle}>
        <View style={{ width: 52, height: 52, borderRadius: 26, backgroundColor: bg, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: 13, fontFamily: 'Inter_700Bold', color }}>{clamped}%</Text>
        </View>
      </View>
    );
  }
  return (
    <View
      style={{
        width: 72,
        height: 72,
        borderRadius: 36,
        borderWidth: 6,
        borderColor: color,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: bg,
      }}
    >
      <Text style={{ fontSize: 13, fontFamily: 'Inter_700Bold', color }}>{clamped}%</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  profileButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  profileAvatar: { width: 38, height: 38, borderRadius: 19 },

  searchWrapper: { width: '68%' },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    minHeight: 38,
    borderRadius: 11,
    borderWidth: 1,
    paddingHorizontal: 12,
  },
  searchInput: { flex: 1, fontSize: 13.5, fontFamily: 'Inter_500Medium', paddingVertical: 0 },

  /* Search area: dropdown is anchored right below the header row, full width, no page dimming */
  searchAreaWrap: { position: 'relative', zIndex: 30 as any, marginBottom: 18 },
  searchDropdown: {
    position: 'absolute',
    top: 46,
    left: 0,
    right: 0,
    borderWidth: 1,
    borderRadius: 14,
    maxHeight: 320,
    overflow: 'hidden',
    // @ts-ignore - web-only shadow, harmless no-op on native
    boxShadow: '0 12px 28px rgba(0,0,0,0.14)',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    zIndex: 31 as any,
  },
  searchResultRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 14, paddingVertical: 12 },
  searchResultIcon: { width: 28, height: 28, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
  searchResultText: { fontSize: 13.5, fontFamily: 'Inter_500Medium', flex: 1 },
  searchEmptyText: { fontSize: 13, fontFamily: 'Inter_500Medium', textAlign: 'center', paddingVertical: 18 },

  actionRow: { flexDirection: 'row', flexWrap: 'wrap',gap: 18, marginBottom: 22 },
  actionItem: { alignItems: 'center', width: 72 },
  actionIcon: { width: 46, height: 46, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginBottom: 6 },
  actionLabel: { fontSize: 10.5, fontFamily: 'Inter_500Medium', textAlign: 'center', lineHeight: 13 },

  /* Card section shell (matches the boxed header-bar reference look) */
  sectionCard: { borderWidth: 1, borderRadius: 16, marginBottom: 16, overflow: 'hidden' },
  sectionCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderBottomWidth: 1,
  },
  sectionCardTitle: { fontSize: 13.5, fontFamily: 'Inter_700Bold' },
  sectionCardBody: { padding: 14 },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  chipText: { fontSize: 11.5, fontFamily: 'Inter_500Medium' },

  /* 2x2 stat grid with plus-shaped dividers, like the reference "Sales Activity" card */
  statGrid: { flexDirection: 'row', flexWrap: 'wrap', margin: -14 },
  statCell: { flexBasis: '50%', paddingVertical: 16, paddingHorizontal: 14 },
  statValue: { fontSize: 19, fontFamily: 'Inter_700Bold', marginBottom: 2 },
  statUnit: { fontSize: 10.5, fontFamily: 'Inter_500Medium', marginBottom: 6 },
  statCaption: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  statCaptionText: { fontSize: 11, fontFamily: 'Inter_500Medium' },

  labelValueRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12 },
  labelValueLabel: { fontSize: 12.5, fontFamily: 'Inter_500Medium' },
  labelValueValue: { fontSize: 14.5, fontFamily: 'Inter_700Bold' },

  productDetailsRow: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  donutWrap: { alignItems: 'center', gap: 8 },
  donutLabel: { fontSize: 11, fontFamily: 'Inter_500Medium' },

  productTile: { width: 96 },
  productImageWrap: { position: 'relative', marginBottom: 6 },
  productImage: { width: 96, height: 96, borderRadius: 12 },
  productImageFallback: { alignItems: 'center', justifyContent: 'center' },
  productQtyBadge: {
    position: 'absolute',
    bottom: 6,
    right: 6,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  productQtyBadgeText: { fontSize: 11, fontFamily: 'Inter_700Bold' },
  productName: { fontSize: 11.5, fontFamily: 'Inter_500Medium', lineHeight: 15 },

  purchaseOrderRow: { flexDirection: 'row' },
  purchaseOrderCol: { flex: 1, paddingHorizontal: 14, gap: 6 },
  purchaseOrderLabel: { fontSize: 11.5, fontFamily: 'Inter_500Medium' },
  purchaseOrderValue: { fontSize: 20, fontFamily: 'Inter_700Bold' },

  centeredComingSoon: { alignItems: 'center', paddingVertical: 20, gap: 6 },
  comingSoonBadge: {
    fontSize: 11,
    fontFamily: 'Inter_600SemiBold',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    overflow: 'hidden',
  },
  comingSoonText: { fontSize: 12, fontFamily: 'Inter_500Medium', textAlign: 'center', paddingHorizontal: 20, lineHeight: 17 },

  tableHeaderRow: { flexDirection: 'row', marginBottom: 4, paddingBottom: 8, borderBottomWidth: 1 },
  tableHeaderCell: { flex: 1, fontSize: 10.5, fontFamily: 'Inter_600SemiBold', textTransform: 'uppercase' },

  salesOrderRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10 },
  salesOrderChannelCell: { flex: 1, fontSize: 12.5, fontFamily: 'Inter_600SemiBold' },
  salesOrderCountCell: { flex: 1, fontSize: 12.5, fontFamily: 'Inter_500Medium', textAlign: 'center' },
});