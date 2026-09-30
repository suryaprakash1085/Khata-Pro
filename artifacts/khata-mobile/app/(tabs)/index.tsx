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
  useWindowDimensions,
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
import type { Customer, Product } from '@workspace/api-client-react';
import { formatCurrency } from '@/lib/format';
import { customFetch } from '@workspace/api-client-react';
import { useQuery } from '@tanstack/react-query';
import { AIAssistantButton } from '@/components/AIAssistant/AIAssistantButton';
// Add import near the top:
import { NotificationBell } from '@/components/NotificationBell/NotificationBell';
const IS_WEB = Platform.OS === 'web';

const ACTIONS = [
  { icon: 'shopping-cart', label: 'New Billing', route: '/billing', color: '#2563EB' },
  { icon: 'box', label: 'Add Product', route: '/add-product', color: '#14B8A6' },
  { icon: 'user-plus', label: 'Add Customer', route: '/add-customer', color: '#8B5CF6' },
  { icon: 'file-text', label: 'Create Order', route: '/create-purchase-order', color: '#F59E0B' },
  { icon: 'trending-down', label: 'Add Expense', route: '/add-expense', color: '#E4664B' },

] as const;

// Sales Activity — 3x2 grid on desktop (order matters: fills left-to-right, top-to-bottom)
// "direct_*" cards come from POS/Admin billing (existing business-stats calculation).
// "online_*" cards come from Customer/Delivery App orders (sales_orders with channel === 'online').
const SALES_ACTIVITY_CARDS = [
  {
    label: 'To be Collected',
    description: 'COD & pending',
    unit: 'Amount',
    field: 'total_to_collect',
    color: '#2563EB',
    icon: 'inbox',
  },
  {
    label: 'To be Paid',
    description: 'Pending payments',
    unit: 'Amount',
    field: 'total_to_pay',
    color: '#F97316',
    icon: 'credit-card',
  },
  {
    label: 'Direct Sales',
    description: 'Sales from POS / Admin',
    unit: 'Amount',
    field: 'direct_sales',
    color: '#16A34A',
    icon: 'shopping-bag',
  },
  {
    label: 'Online Sales',
    description: 'Sales from Customer App',
    unit: 'Amount',
    field: 'online_sales',
    color: '#7C3AED',
    icon: 'smartphone',
  },
  {
    label: 'Direct Transactions',
    description: 'Transactions from POS / Admin',
    unit: 'Count',
    field: 'direct_transactions',
    color: '#8B5CF6',
    icon: 'file-text',
  },
  {
    label: 'Online Orders',
    description: 'Orders from Customer App',
    unit: 'Count',
    field: 'online_orders',
    color: '#0EA5E9',
    icon: 'package',
  },
] as const;

// ---------------------------------------------------------------------------
// Period filter — powers the "Today / This Week / This Month" dropdown that
// used to be a static, non-interactive "This Month" label on Top Selling
// Items, Purchase Order, and Sales Order.
// ---------------------------------------------------------------------------
type PeriodFilter = 'today' | 'week' | 'month';

const PERIOD_OPTIONS: { value: PeriodFilter; label: string }[] = [
  { value: 'today', label: 'Today' },
  { value: 'week', label: 'This Week' },
  { value: 'month', label: 'This Month' },
];

// Returns { from, to } as YYYY-MM-DD strings (matches entry_date filters on the API)
function getDateRange(period: PeriodFilter) {
  const now = new Date();
  const toStr = now.toISOString().split('T')[0];
  let from: Date;
  if (period === 'today') {
    from = new Date(now);
  } else if (period === 'week') {
    from = new Date(now);
    from.setDate(now.getDate() - 6); // last 7 days, inclusive of today
  } else {
    from = new Date(now.getFullYear(), now.getMonth(), 1);
  }
  const fromStr = from.toISOString().split('T')[0];
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

// Defensive readers for sales_orders (Customer/Delivery App orders).
// NOTE: field name for the order amount is not confirmed against the live schema —
// this tries the common candidates. If your sales_orders rows use a different
// column, narrow this to just that one field.
function getOrderAmount(so: any): number {
  return Number(so?.amount ?? so?.total_amount ?? so?.order_amount ?? so?.grand_total ?? 0) || 0;
}
function isOnlineChannelOrder(so: any): boolean {
  return so?.channel === 'online';
}

function useVendorPendingTotal(businessId?: number, enabled?: boolean) {
  return useQuery<{ total_pending: number }>({
    queryKey: ['purchases', 'pending-total', businessId],
    enabled: !!businessId && !!enabled,
    queryFn: () => customFetch(`/api/purchases/pending-total?business_id=${businessId}`, { responseType: 'json' }),
  });
}

function usePendingReceiveQty(businessId?: number, enabled?: boolean) {
  return useQuery<{ total_pending_qty: number }>({
    queryKey: ['purchase-orders', 'pending-qty-total', businessId],
    enabled: !!businessId && !!enabled,
    queryFn: () => customFetch(`/api/purchase-orders/pending-qty-total?business_id=${businessId}`, { responseType: 'json' }),
  });
}

// Defensive readers for product search results in the global search dropdown.
function getBarcode(p: any): string {
  return p?.barcode ?? p?.sku ?? '';
}

export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { business } = useBusiness();
  const { user } = useAuth();
  const { width } = useWindowDimensions();
  const [search, setSearch] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);

  // Responsive breakpoints — used for the header (search/bell/profile),
  // AI assistant button position, and the Sales Activity grid overflow fix.
  const isSmallMobile = width < 380;
  const isMobile = width < 600;
  const isTablet = width >= 600 && width < 900;

  // Which section's Today/This Week/This Month dropdown is currently open —
  // only one at a time, anchored directly under that section's chip.
  const [openDropdown, setOpenDropdown] = useState<'topSelling' | 'purchaseOrder' | 'salesOrder' | null>(null);
  const [topSellingPeriod, setTopSellingPeriod] = useState<PeriodFilter>('month');
  const [purchaseOrderPeriod, setPurchaseOrderPeriod] = useState<PeriodFilter>('month');
  const [salesOrderPeriod, setSalesOrderPeriod] = useState<PeriodFilter>('month');

  // Sales Activity grid columns — 3 on wide/desktop screens, 2 on tablet, 1 on narrow mobile.
  const salesActivityColumns = width >= 700 ? 3 : width >= 420 ? 2 : 1;

  const { data: stats } = useGetBusinessStats(business?.id as number, {
    query: { enabled: !!business?.id, queryKey: getGetBusinessStatsQueryKey(business?.id as number) },
  });

  // ---------------- Global search — Customers + Products ----------------
  const customersParams = { business_id: business?.id as number, search: search || undefined, limit: 6 };
  const customersQuery = useListCustomers(customersParams, {
    query: { enabled: !!business?.id && search.trim().length > 0, queryKey: getListCustomersQueryKey(customersParams) },
  });
  const customerResults: Customer[] = search.trim().length > 0 ? customersQuery.data?.data ?? [] : [];
  const customerSearchLoading = customersQuery.isLoading && search.trim().length > 0;

  // Product search — reuses the existing product API's `search` param, which already
  // matches name AND barcode (same param Billing.tsx's product search relies on for
  // barcode-scan lookups), so a scanned/typed barcode surfaces the exact product here too.
  const productSearchParams = { business_id: business?.id as number, search: search.trim(), limit: 6 };
  const productSearchQuery = useListProducts(productSearchParams, {
    query: {
      enabled: !!business?.id && search.trim().length > 0,
      queryKey: getListProductsQueryKey(productSearchParams),
    },
  });
  const productResults: Product[] = search.trim().length > 0 ? productSearchQuery.data?.data ?? [] : [];
  const productSearchLoading = productSearchQuery.isLoading && search.trim().length > 0;

  const searchLoading = customerSearchLoading || productSearchLoading;
  const hasNoResults =
    !searchLoading && search.trim().length > 0 && customerResults.length === 0 && productResults.length === 0;

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

  // "Top selling" — best-effort sort by stock movement proxy (falls back to insertion order).
  // NOTE: `sold_count` is a lifetime counter on the product record — there's no
  // per-period (today/week/month) sales-by-product data available client-side,
  // so the Today/This Week/This Month picker on this card is UI-only for now;
  // the ranking itself doesn't change with it. Making that real needs a
  // backend endpoint that returns sales counts grouped by product + date range.
  const topSellingItems = useMemo(() => {
    return [...products]
      .sort((a, b) => (Number(b?.sold_count ?? 0) || 0) - (Number(a?.sold_count ?? 0) || 0))
      .slice(0, 10);
  }, [products]);

  // ---------------- Purchase Order — driven by its own period picker ----------------
  const purchaseDateRange = useMemo(() => getDateRange(purchaseOrderPeriod), [purchaseOrderPeriod]);

  const purchasesParams = {
    business_id: business?.id as number,
    from: purchaseDateRange.from,
    to: purchaseDateRange.to,
    limit: 200,
  };
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

  const { data: vendorPending } = useVendorPendingTotal(business?.id, !!business?.id);

  const { data: pendingReceiveQty } = usePendingReceiveQty(business?.id, !!business?.id);

  // ---------------- Sales Order — driven by its own period picker ----------------
  const salesOrderDateRange = useMemo(() => getDateRange(salesOrderPeriod), [salesOrderPeriod]);

  const salesOrdersParams = {
    business_id: business?.id as number,
    from: salesOrderDateRange.from,
    to: salesOrderDateRange.to,
    limit: 200,
  };
  const salesOrdersQuery = useListSalesOrders(salesOrdersParams, {
    query: { enabled: !!business?.id, queryKey: getListSalesOrdersQueryKey(salesOrdersParams) },
  });
  const salesOrders: any[] = salesOrdersQuery.data?.data ?? [];
  const salesOrdersLoading = salesOrdersQuery.isLoading;

  // Online Sales / Online Orders — sourced from the same sales_orders data used by the
  // Sales Order table below, filtered to channel === 'online' (Customer/Delivery App).
  // This is live query data, so it stays in sync as new online orders come in — nothing hardcoded.
  const onlineOrderMetrics = useMemo(() => {
    const onlineOrders = salesOrders.filter(isOnlineChannelOrder);
    const totalAmount = onlineOrders.reduce((sum, so) => sum + getOrderAmount(so), 0);
    return { count: onlineOrders.length, totalAmount };
  }, [salesOrders]);

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

  const handleSelectProduct = (_product: Product) => {
    setSearch('');
    setSearchOpen(false);
    router.push('/all-products' as any);
  };

  const webInputFix = IS_WEB
    ? ({ outlineStyle: 'none', outlineWidth: 0, caretColor: colors.primary } as any)
    : undefined;

  // AI Assistant button — on mobile the header row sits close to the top,
  // so push the button down below the header/quick-actions area instead of
  // letting it float over the search bar / bell / profile. Desktop keeps its
  // original position.
  // Desktop/tablet: match the header row's own top position (paddingTop
  // below) so the AI trigger sits in the exact same row as the bell/profile
  // icons. Mobile: push it below the header so it doesn't overlap search/
  // bell/profile there.
  const aiButtonTopOffset = isMobile ? insets.top + 108 : insets.top + 12;

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
        {/* Header: search bar + bell + profile, with results dropdown anchored right below it */}
        <View style={styles.searchAreaWrap}>
          <View style={styles.headerRow}>
            <View
              style={[
                styles.searchWrapper,
                styles.searchContainer,
                isTablet && styles.tabletSearchWrapper,
                isMobile && styles.mobileSearchWrapper,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
            >
              <Feather name="search" size={15} color={colors.mutedForeground} />
              <TextInput
                value={search}
                onChangeText={setSearch}
                onFocus={() => setSearchOpen(true)}
                onBlur={() => setTimeout(() => setSearchOpen(false), 150)}
                placeholder="Search customers, products, barcode..."
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

            <View style={styles.headerActions}>
              <View style={styles.headerIconWrapper}>
                <NotificationBell />
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
          </View>

          {searchOpen && search.trim().length > 0 && (
            <View style={[styles.searchDropdown, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <ScrollView keyboardShouldPersistTaps="handled" nestedScrollEnabled>
                {searchLoading ? (
                  <ActivityIndicator style={{ paddingVertical: 18 }} color={colors.primary} />
                ) : hasNoResults ? (
                  <Text style={[styles.searchEmptyText, { color: colors.mutedForeground }]}>No results found</Text>
                ) : (
                  <>
                    {customerResults.length > 0 && (
                      <>
                        <Text style={[styles.searchSectionLabel, { color: colors.mutedForeground }]}>Customers</Text>
                        {customerResults.map((c, index) => (
                          <Pressable
                            key={`customer-${c.id}`}
                            onPress={() => handleSelectCustomer(c)}
                            style={({ pressed }) => [
                              styles.searchResultRow,
                              index !== customerResults.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.border },
                              pressed && { backgroundColor: colors.background },
                            ]}
                          >
                            <View style={[styles.searchResultIcon, { backgroundColor: colors.primary + '15' }]}>
                              <Feather name="user" size={14} color={colors.primary} />
                            </View>
                            <View style={{ flex: 1 }}>
                              <Text style={[styles.searchResultText, { color: colors.foreground }]} numberOfLines={1}>
                                {c.name}
                              </Text>
                              {!!c.phone && (
                                <Text style={[styles.searchResultSubText, { color: colors.mutedForeground }]} numberOfLines={1}>
                                  {c.phone}
                                </Text>
                              )}
                            </View>
                            <Feather name="chevron-right" size={16} color={colors.mutedForeground} />
                          </Pressable>
                        ))}
                      </>
                    )}

                    {productResults.length > 0 && (
                      <>
                        <Text style={[styles.searchSectionLabel, { color: colors.mutedForeground }]}>Products</Text>
                        {productResults.map((p: any, index) => {
                          const outOfStock = getStockQty(p) <= 0;
                          return (
                            <Pressable
                              key={`product-${p.id}`}
                              onPress={() => handleSelectProduct(p)}
                              style={({ pressed }) => [
                                styles.searchResultRow,
                                index !== productResults.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.border },
                                pressed && { backgroundColor: colors.background },
                              ]}
                            >
                              <View style={[styles.searchResultIcon, { backgroundColor: '#14B8A6' + '15' }]}>
                                <Feather name="box" size={14} color="#14B8A6" />
                              </View>
                              <View style={{ flex: 1 }}>
                                <Text style={[styles.searchResultText, { color: colors.foreground }]} numberOfLines={1}>
                                  {p.name}
                                </Text>
                                <Text style={[styles.searchResultSubText, { color: colors.mutedForeground }]} numberOfLines={1}>
                                  {getBarcode(p) ? `#${getBarcode(p)} · ` : ''}
                                  {formatCurrency(p.selling_price ?? 0, business?.currency)} ·{' '}
                                  {outOfStock ? 'Out of stock' : `Stock ${getStockQty(p)}`}
                                </Text>
                              </View>
                              <Feather name="chevron-right" size={16} color={colors.mutedForeground} />
                            </Pressable>
                          );
                        })}
                      </>
                    )}
                  </>
                )}
              </ScrollView>
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
          <View style={[styles.statGrid, isMobile && styles.statGridMobile]}>
            {SALES_ACTIVITY_CARDS.map((item, i) => {
              let value: string;
              switch (item.field) {
                case 'total_to_pay':
                  value = formatCurrency(vendorPending?.total_pending ?? 0, business?.currency);
                  break;
                case 'direct_sales':
                  value = formatCurrency((stats as any)?.today_sales ?? 0, business?.currency);
                  break;
                case 'online_sales':
                  value = formatCurrency(onlineOrderMetrics.totalAmount, business?.currency);
                  break;
                case 'direct_transactions':
                  value = String(stats?.transaction_count ?? 0);
                  break;
                case 'online_orders':
                  value = String(onlineOrderMetrics.count);
                  break;
                case 'total_to_collect':
                default:
                  value = formatCurrency((stats as any)?.[item.field] ?? 0, business?.currency);
                  break;
              }

              const col = i % salesActivityColumns;
              const isRightCol = col === salesActivityColumns - 1;
              const isTopRow = i < salesActivityColumns;

              return (
                <View
                  key={item.label}
                  style={[
                    styles.statCell,
                    isMobile && styles.statCellMobile,
                    { flexBasis: `${100 / salesActivityColumns}%` },
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
                  {item.description && (
                    <Text style={[styles.statDescription, { color: colors.mutedForeground }]} numberOfLines={1}>
                      {item.description}
                    </Text>
                  )}
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
          <LabelValueRow
  colors={colors}
  label="Quantity to be Received"
  value={String(pendingReceiveQty?.total_pending_qty ?? 0)}
  muted
  last
/>
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
        <CardSection
          title="Top Selling Items"
          colors={colors}
          periodValue={topSellingPeriod}
          isOpen={openDropdown === 'topSelling'}
          onTogglePeriod={() => setOpenDropdown((d) => (d === 'topSelling' ? null : 'topSelling'))}
          onSelectPeriod={(v) => {
            setTopSellingPeriod(v);
            setOpenDropdown(null);
          }}
        >
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
        <CardSection
          title="Purchase Order"
          colors={colors}
          periodValue={purchaseOrderPeriod}
          isOpen={openDropdown === 'purchaseOrder'}
          onTogglePeriod={() => setOpenDropdown((d) => (d === 'purchaseOrder' ? null : 'purchaseOrder'))}
          onSelectPeriod={(v) => {
            setPurchaseOrderPeriod(v);
            setOpenDropdown(null);
          }}
        >
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
              No purchases recorded for this period.
            </Text>
          ) : null}
        </CardSection>

        {/* ---------------- Sales Order ---------------- */}
        <CardSection
          title="Sales Order"
          colors={colors}
          periodValue={salesOrderPeriod}
          isOpen={openDropdown === 'salesOrder'}
          onTogglePeriod={() => setOpenDropdown((d) => (d === 'salesOrder' ? null : 'salesOrder'))}
          onSelectPeriod={(v) => {
            setSalesOrderPeriod(v);
            setOpenDropdown(null);
          }}
        >
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
                No sales orders placed for this period.
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

      <AIAssistantButton topOffset={aiButtonTopOffset} />

    </View>

);
}

/* ---------------- Reusable pieces ---------------- */

function CardSection({
  title,
  colors,
  children,
  periodValue,
  isOpen,
  onTogglePeriod,
  onSelectPeriod,
}: {
  title: string;
  colors: any;
  children: React.ReactNode;
  periodValue?: PeriodFilter;
  isOpen?: boolean;
  onTogglePeriod?: () => void;
  onSelectPeriod?: (v: PeriodFilter) => void;
}) {
  const chipLabel = periodValue ? PERIOD_OPTIONS.find((o) => o.value === periodValue)?.label : undefined;

  return (
    <View style={[styles.sectionCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={[styles.sectionCardHeader, { borderBottomColor: colors.border, backgroundColor: colors.background }]}>
        <Text style={[styles.sectionCardTitle, { color: colors.foreground }]}>{title}</Text>
        {chipLabel && (
          <Pressable onPress={onTogglePeriod} style={styles.chip} hitSlop={8}>
            <Text style={[styles.chipText, { color: colors.mutedForeground }]}>{chipLabel}</Text>
            <Feather name={isOpen ? 'chevron-up' : 'chevron-down'} size={12} color={colors.mutedForeground} />
          </Pressable>
        )}
      </View>

      {isOpen && (
        <View style={[styles.periodInlineRow, { borderBottomColor: colors.border, backgroundColor: colors.background }]}>
          {PERIOD_OPTIONS.map((opt) => {
            const active = opt.value === periodValue;
            return (
              <Pressable
                key={opt.value}
                onPress={() => onSelectPeriod?.(opt.value)}
                style={[
                  styles.periodInlinePill,
                  { backgroundColor: active ? colors.primary : colors.card, borderColor: active ? colors.primary : colors.border },
                ]}
              >
                <Text
                  style={{
                    fontSize: 12,
                    fontFamily: 'Inter_500Medium',
                    color: active ? colors.primaryForeground : colors.foreground,
                    fontWeight: active ? '700' : '500',
                  }}
                >
                  {opt.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      )}

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

  headerRow: { width: '100%', flexDirection: 'row', alignItems: 'center', gap: 10 },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: 8, flexShrink: 0 },
  headerIconWrapper: { width: 38, height: 38, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  profileButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    flexShrink: 0,
  },
  profileAvatar: { width: 38, height: 38, borderRadius: 19 },

  // Desktop default — a wide-but-not-full search bar. On tablet/mobile this
  // is overridden by tabletSearchWrapper/mobileSearchWrapper (flex: 1) so the
  // bell + profile never get pushed off-screen.
  searchWrapper: { width: '68%', flexShrink: 1 },
  tabletSearchWrapper: { flex: 1, width: undefined, minWidth: 0 },
  mobileSearchWrapper: { flex: 1, width: undefined, minWidth: 0 },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    minHeight: 38,
    minWidth: 0,
    borderRadius: 11,
    borderWidth: 1,
    paddingHorizontal: 12,
  },
  searchInput: { flex: 1, minWidth: 0, fontSize: 13.5, fontFamily: 'Inter_500Medium', paddingVertical: 0 },

  /* Search area: dropdown is anchored right below the header row, full width, no page dimming */
  searchAreaWrap: { position: 'relative', zIndex: 30 as any, marginBottom: 18 },
  searchDropdown: {
    position: 'absolute',
    top: 46,
    left: 0,
    right: 0,
    borderWidth: 1,
    borderRadius: 14,
    maxHeight: 360,
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
  searchSectionLabel: {
    fontSize: 10.5,
    fontFamily: 'Inter_700Bold',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 4,
  },
  searchResultRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 14, paddingVertical: 12 },
  searchResultIcon: { width: 28, height: 28, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
  searchResultText: { fontSize: 13.5, fontFamily: 'Inter_500Medium' },
  searchResultSubText: { fontSize: 11, fontFamily: 'Inter_500Medium', marginTop: 1 },
  searchEmptyText: { fontSize: 13, fontFamily: 'Inter_500Medium', textAlign: 'center', paddingVertical: 18 },

  actionRow: { flexDirection: 'row', flexWrap: 'wrap',gap: 18, marginBottom: 22 },
  actionItem: { alignItems: 'center', width: 72 },
  actionIcon: { width: 46, height: 46, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginBottom: 6 },
  actionLabel: { fontSize: 10.5, fontFamily: 'Inter_500Medium', textAlign: 'center', lineHeight: 13 },

  /* Card section shell (matches the boxed header-bar reference look).
     No overflow:hidden here — a clipped card would cut off the anchored
     period dropdown, so the header gets its own top corner radius instead. */
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
chip: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingVertical: 4, paddingHorizontal: 2 },
chipText: { fontSize: 11.5, fontFamily: 'Inter_500Medium' },

periodInlineRow: { flexDirection: 'row', gap: 8, paddingHorizontal: 14, paddingVertical: 10, borderBottomWidth: 1 },
periodInlinePill: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1 },

  /* Period dropdown — anchored directly under its chip */
  periodMenu: {
    position: 'absolute',
    top: '100%',
    right: 0,
    marginTop: 6,
    width: 150,
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 4,
    // @ts-ignore - web-only shadow, harmless no-op on native
    boxShadow: '0 10px 24px rgba(0,0,0,0.14)',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    zIndex: 100,
  },
  periodMenuItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12, paddingVertical: 9 },

  /* Sales Activity stat grid — columns are set inline (flexBasis) based on screen width.
     The negative margin on statGrid must match statCell's horizontal padding, or the
     grid overflows the card horizontally on narrow phones — statGridMobile/statCellMobile
     shrink both together instead of leaving statGrid at -14 on a small screen. */
  statGrid: { flexDirection: 'row', flexWrap: 'wrap', margin: -14 },
  statGridMobile: { margin: -8 },
  statCell: { paddingVertical: 16, paddingHorizontal: 14 },
  statCellMobile: { paddingHorizontal: 8 },
  statValue: { fontSize: 19, fontFamily: 'Inter_700Bold', marginBottom: 2 },
  statUnit: { fontSize: 10.5, fontFamily: 'Inter_500Medium', marginBottom: 6 },
  statCaption: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  statCaptionText: { fontSize: 11, fontFamily: 'Inter_500Medium' },
  statDescription: { fontSize: 9.5, fontFamily: 'Inter_500Medium', marginTop: 2 },

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