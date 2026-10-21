import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Modal,
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
// "direct_*" cards come from POS/Admin billing (business-stats calculation).
// "online_*" cards come from Customer/Delivery App orders (sales_orders with channel === 'online').
// "total_sales" = Direct + Online for the selected period (default: Overall).
const SALES_ACTIVITY_CARDS = [
  {
    label: 'Total Sales',
    description: 'Direct + Online',
    unit: 'Amount',
    field: 'total_sales',
    color: '#2563EB',
    icon: 'trending-up',
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
// Date filter — Overall / Today / Yesterday / This Week / This Month / Custom (calendar)
// ---------------------------------------------------------------------------
type PeriodFilter = 'all' | 'today' | 'yesterday' | 'week' | 'month' | 'custom';
type FilterTarget = 'salesActivity' | 'topSelling' | 'purchaseOrder' | 'salesOrder';
type DateFilterState = { period: PeriodFilter; from?: string; to?: string };

const PERIOD_OPTIONS: { value: PeriodFilter; label: string }[] = [
  { value: 'all', label: 'Overall' },
  { value: 'today', label: 'Today' },
  { value: 'yesterday', label: 'Yesterday' },
  { value: 'week', label: 'This Week' },
  { value: 'month', label: 'This Month' },
  { value: 'custom', label: 'Custom Range' },
];

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
const WEEKDAYS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

const pad = (n: number) => String(n).padStart(2, '0');

// Local-time YYYY-MM-DD (toISOString uses UTC, which gives the wrong day in IST before 5:30 AM)
function toYMD(d: Date) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}
function parseYMD(s: string) {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, m - 1, d);
}
function formatShort(ymd: string) {
  const d = parseYMD(ymd);
  return `${d.getDate()} ${MONTHS[d.getMonth()].slice(0, 3)}`;
}

// Returns { from, to } as YYYY-MM-DD strings (matches entry_date filters on the API)
function getDateRange(f: DateFilterState) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  if (f.period === 'all') {
    // Overall = everything from the beginning until today
    return { from: '2000-01-01', to: toYMD(today) };
  }
  if (f.period === 'custom' && f.from) {
    return { from: f.from, to: f.to ?? f.from };
  }
  if (f.period === 'yesterday') {
    const y = new Date(today);
    y.setDate(today.getDate() - 1);
    return { from: toYMD(y), to: toYMD(y) };
  }
  if (f.period === 'week') {
    // This Week = last 7 days including today (same as Reports → Sales Report)
    const start = new Date(today);
    start.setDate(today.getDate() - 6);
    return { from: toYMD(start), to: toYMD(today) };
  }
  if (f.period === 'month') {
    return { from: toYMD(new Date(today.getFullYear(), today.getMonth(), 1)), to: toYMD(today) };
  }
  return { from: toYMD(today), to: toYMD(today) }; // today
}

function getFilterLabel(f: DateFilterState) {
  if (f.period === 'custom' && f.from) {
    const to = f.to ?? f.from;
    return f.from === to ? formatShort(f.from) : `${formatShort(f.from)} – ${formatShort(to)}`;
  }
  return PERIOD_OPTIONS.find((o) => o.value === f.period)?.label ?? 'This Month';
}

const SO_STATUSES = ['pending', 'confirmed', 'packed', 'shipped', 'invoiced'] as const;
const SO_CHANNELS = ['online', 'store', 'phone'] as const;
const SO_CHANNEL_LABELS: Record<(typeof SO_CHANNELS)[number], string> = {
  online: 'Online',
  store: 'Store',
  phone: 'Phone',
};

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

// Direct Sales / Direct Transactions for the selected date range.
// Backend: GET /api/businesses/:id/stats?from=YYYY-MM-DD&to=YYYY-MM-DD
function useRangeStats(businessId?: number, range?: { from: string; to: string }) {
  return useQuery<any>({
    queryKey: ['business-stats-range', businessId, range?.from, range?.to],
    enabled: !!businessId && !!range,
    retry: false,
    queryFn: () =>
      customFetch(`/api/businesses/${businessId}/stats?from=${range?.from}&to=${range?.to}`, { responseType: 'json' }),
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

  // Responsive breakpoints
  const isMobile = width < 600;
  const isTablet = width >= 600 && width < 900;

  // ---------------- Date filters ----------------
  // Which section's period dropdown is open (only one at a time)
  const [openDropdown, setOpenDropdown] = useState<FilterTarget | null>(null);
  // Which section the calendar popup is currently editing
  const [calendarTarget, setCalendarTarget] = useState<FilterTarget | null>(null);

  // Sales Activity opens on "Overall" (all-time Direct + Online), others stay on This Month
  const [salesActivityFilter, setSalesActivityFilter] = useState<DateFilterState>({ period: 'all' });
  const [topSellingFilter, setTopSellingFilter] = useState<DateFilterState>({ period: 'month' });
  const [purchaseOrderFilter, setPurchaseOrderFilter] = useState<DateFilterState>({ period: 'month' });
  const [salesOrderFilter, setSalesOrderFilter] = useState<DateFilterState>({ period: 'month' });

  const filterState: Record<FilterTarget, DateFilterState> = {
    salesActivity: salesActivityFilter,
    topSelling: topSellingFilter,
    purchaseOrder: purchaseOrderFilter,
    salesOrder: salesOrderFilter,
  };

  const setFilter = (t: FilterTarget, v: DateFilterState) => {
    if (t === 'salesActivity') setSalesActivityFilter(v);
    else if (t === 'topSelling') setTopSellingFilter(v);
    else if (t === 'purchaseOrder') setPurchaseOrderFilter(v);
    else setSalesOrderFilter(v);
  };

  const handlePickPeriod = (t: FilterTarget, p: PeriodFilter) => {
    setOpenDropdown(null);
    if (p === 'custom') setCalendarTarget(t); // open calendar
    else setFilter(t, { period: p });
  };

  // Spread onto <CardSection {...periodProps('x')} />
  const periodProps = (t: FilterTarget) => ({
    filter: filterState[t],
    isOpen: openDropdown === t,
    onTogglePeriod: () => setOpenDropdown((d) => (d === t ? null : t)),
    onSelectPeriod: (p: PeriodFilter) => handlePickPeriod(t, p),
  });

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

  // "Top selling" — sorted by lifetime `sold_count`.
  // NOTE: there's no per-period sales-by-product data client-side, so the date picker on this
  // card is UI-only for now; the ranking doesn't change with it. Making that real needs a
  // backend endpoint returning sales counts grouped by product + date range.
  const topSellingItems = useMemo(() => {
    return [...products]
      .sort((a, b) => (Number(b?.sold_count ?? 0) || 0) - (Number(a?.sold_count ?? 0) || 0))
      .slice(0, 10);
  }, [products]);

  // ---------------- Purchase Order — driven by its own date filter ----------------
  const purchaseDateRange = useMemo(() => getDateRange(purchaseOrderFilter), [purchaseOrderFilter]);

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
    // NOTE: list endpoint returns product_count (line items) per purchase, not exact unit qty.
    const itemsOrdered = purchases.reduce((sum, p) => sum + (Number(p?.product_count) || 0), 0);
    const totalCost = purchases.reduce((sum, p) => sum + (Number(p?.amount) || 0), 0);
    return { itemsOrdered, totalCost };
  }, [purchases]);

  const { data: vendorPending } = useVendorPendingTotal(business?.id, !!business?.id);
  const { data: pendingReceiveQty } = usePendingReceiveQty(business?.id, !!business?.id);

  // ---------------- Sales Order — driven by its own date filter ----------------
  const salesOrderDateRange = useMemo(() => getDateRange(salesOrderFilter), [salesOrderFilter]);

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

  // ---------------- Sales Activity — driven by its own date filter ----------------
  const activityRange = useMemo(() => getDateRange(salesActivityFilter), [salesActivityFilter]);

  const activityOrdersParams = {
    business_id: business?.id as number,
    from: activityRange.from,
    to: activityRange.to,
    limit: 5000, // high enough for "Overall"
  };
  const activityOrdersQuery = useListSalesOrders(activityOrdersParams, {
    query: { enabled: !!business?.id, queryKey: getListSalesOrdersQueryKey(activityOrdersParams) },
  });
  const activityOrders: any[] = activityOrdersQuery.data?.data ?? [];

  // Online Sales / Online Orders — channel === 'online' (Customer/Delivery App), for the selected range.
  // Same rules as Reports → Online (App): order count excludes cancelled,
  // revenue counts only invoiced orders.
  const onlineOrderMetrics = useMemo(() => {
    const live = activityOrders.filter((o) => isOnlineChannelOrder(o) && o?.status !== 'cancelled');
    const invoiced = live.filter((o) => o?.status === 'invoiced');
    const totalAmount = invoiced.reduce((sum, so) => sum + getOrderAmount(so), 0);
    return { count: live.length, totalAmount };
  }, [activityOrders]);

  // Direct Sales / Transactions for the selected range.
  const rangeStatsQuery = useRangeStats(business?.id, activityRange);
  // Fallback: if the range endpoint isn't ready yet, "Today" still works from the existing stats.
  const directStats: any = rangeStatsQuery.data ?? (salesActivityFilter.period === 'today' ? stats : undefined);

  const directSalesValue = Number(directStats?.direct_sales ?? 0) || 0;
  const totalSalesValue = directSalesValue + onlineOrderMetrics.totalAmount;
  const statsLoading = rangeStatsQuery.isLoading || activityOrdersQuery.isLoading;

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

  // Desktop/tablet: AI trigger sits in the same row as bell/profile.
  // Mobile: pushed below the header so it doesn't overlap search/bell/profile.
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
        <CardSection title="Sales Activity" colors={colors} {...periodProps('salesActivity')}>
          <View style={[styles.statGrid, isMobile && styles.statGridMobile]}>
            {SALES_ACTIVITY_CARDS.map((item, i) => {
              let value: string;
              switch (item.field) {
                case 'total_sales':
                  value = statsLoading ? '—' : formatCurrency(totalSalesValue, business?.currency);
                  break;
                case 'total_to_pay':
                  value = formatCurrency(vendorPending?.total_pending ?? 0, business?.currency);
                  break;
                case 'direct_sales':
                  value = rangeStatsQuery.isLoading ? '—' : formatCurrency(directSalesValue, business?.currency);
                  break;
                case 'online_sales':
                  value = activityOrdersQuery.isLoading ? '—' : formatCurrency(onlineOrderMetrics.totalAmount, business?.currency);
                  break;
                case 'direct_transactions':
                  value = rangeStatsQuery.isLoading ? '—' : String(directStats?.direct_transactions ?? 0);
                  break;
                case 'online_orders':
                  value = activityOrdersQuery.isLoading ? '—' : String(onlineOrderMetrics.count);
                  break;
                default:
                  value = '0';
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
        <CardSection title="Top Selling Items" colors={colors} {...periodProps('topSelling')}>
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
        <CardSection title="Purchase Order" colors={colors} {...periodProps('purchaseOrder')}>
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
        <CardSection title="Sales Order" colors={colors} {...periodProps('salesOrder')}>
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

      {/* Calendar popup for "Custom Range" */}
      <DateRangeModal
        visible={!!calendarTarget}
        initialFrom={calendarTarget ? filterState[calendarTarget].from : undefined}
        initialTo={calendarTarget ? filterState[calendarTarget].to : undefined}
        colors={colors}
        onClose={() => setCalendarTarget(null)}
        onApply={(from, to) => {
          if (calendarTarget) setFilter(calendarTarget, { period: 'custom', from, to });
          setCalendarTarget(null);
        }}
      />
    </View>
  );
}

/* ---------------- Reusable pieces ---------------- */

function CardSection({
  title,
  colors,
  children,
  filter,
  isOpen,
  onTogglePeriod,
  onSelectPeriod,
}: {
  title: string;
  colors: any;
  children: React.ReactNode;
  filter?: DateFilterState;
  isOpen?: boolean;
  onTogglePeriod?: () => void;
  onSelectPeriod?: (v: PeriodFilter) => void;
}) {
  const chipLabel = filter ? getFilterLabel(filter) : undefined;

  return (
    <View style={[styles.sectionCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={[styles.sectionCardHeader, { borderBottomColor: colors.border, backgroundColor: colors.background }]}>
        <Text style={[styles.sectionCardTitle, { color: colors.foreground }]}>{title}</Text>
        {chipLabel && (
          <Pressable onPress={onTogglePeriod} style={styles.chip} hitSlop={8}>
            <Feather name="calendar" size={12} color={colors.mutedForeground} />
            <Text style={[styles.chipText, { color: colors.mutedForeground }]}>{chipLabel}</Text>
            <Feather name={isOpen ? 'chevron-up' : 'chevron-down'} size={12} color={colors.mutedForeground} />
          </Pressable>
        )}
      </View>

      {isOpen && (
        <View style={[styles.periodInlineRow, { borderBottomColor: colors.border, backgroundColor: colors.background }]}>
          {PERIOD_OPTIONS.map((opt) => {
            const active = opt.value === filter?.period;
            return (
              <Pressable
                key={opt.value}
                onPress={() => onSelectPeriod?.(opt.value)}
                style={[
                  styles.periodInlinePill,
                  { backgroundColor: active ? colors.primary : colors.card, borderColor: active ? colors.primary : colors.border },
                ]}
              >
                {opt.value === 'custom' && (
                  <Feather name="calendar" size={11} color={active ? colors.primaryForeground : colors.foreground} />
                )}
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

// Calendar popup — tap a start date, then an end date (tap the same day twice for a single day).
function DateRangeModal({
  visible,
  initialFrom,
  initialTo,
  onClose,
  onApply,
  colors,
}: {
  visible: boolean;
  initialFrom?: string;
  initialTo?: string;
  onClose: () => void;
  onApply: (from: string, to: string) => void;
  colors: any;
}) {
  const todayStr = toYMD(new Date());
  const seed = initialFrom ? parseYMD(initialFrom) : new Date();
  const [viewYear, setViewYear] = useState(seed.getFullYear());
  const [viewMonth, setViewMonth] = useState(seed.getMonth());
  const [start, setStart] = useState<string | null>(initialFrom ?? null);
  const [end, setEnd] = useState<string | null>(initialTo ?? null);

  // Re-seed whenever the popup is opened
  useEffect(() => {
    if (!visible) return;
    const s = initialFrom ? parseYMD(initialFrom) : new Date();
    setViewYear(s.getFullYear());
    setViewMonth(s.getMonth());
    setStart(initialFrom ?? null);
    setEnd(initialTo ?? null);
  }, [visible]);

  const goMonth = (delta: number) => {
    const d = new Date(viewYear, viewMonth + delta, 1);
    setViewYear(d.getFullYear());
    setViewMonth(d.getMonth());
  };

  const weeks = useMemo(() => {
    const offset = (new Date(viewYear, viewMonth, 1).getDay() + 6) % 7; // Monday-first
    const days = new Date(viewYear, viewMonth + 1, 0).getDate();
    const cells: (string | null)[] = Array(offset).fill(null);
    for (let d = 1; d <= days; d++) cells.push(`${viewYear}-${pad(viewMonth + 1)}-${pad(d)}`);
    while (cells.length % 7 !== 0) cells.push(null);
    const rows: (string | null)[][] = [];
    for (let i = 0; i < cells.length; i += 7) rows.push(cells.slice(i, i + 7));
    return rows;
  }, [viewYear, viewMonth]);

  const onDayPress = (ymd: string) => {
    if (!start || (start && end)) {
      setStart(ymd);
      setEnd(null);
    } else if (ymd < start) {
      setStart(ymd);
    } else {
      setEnd(ymd); // same day tapped twice = single-day range
    }
  };

  const summary = !start
    ? 'Select start date'
    : !end
    ? `${formatShort(start)} → select end date`
    : start === end
    ? formatShort(start)
    : `${formatShort(start)} → ${formatShort(end)}`;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.modalBackdrop} onPress={onClose}>
        <Pressable
          onPress={() => {}}
          style={[styles.modalCard, { backgroundColor: colors.card, borderColor: colors.border }]}
        >
          <View style={styles.calHeader}>
            <Pressable onPress={() => goMonth(-1)} hitSlop={8} style={styles.calNavBtn}>
              <Feather name="chevron-left" size={18} color={colors.foreground} />
            </Pressable>
            <Text style={[styles.calTitle, { color: colors.foreground }]}>
              {MONTHS[viewMonth]} {viewYear}
            </Text>
            <Pressable onPress={() => goMonth(1)} hitSlop={8} style={styles.calNavBtn}>
              <Feather name="chevron-right" size={18} color={colors.foreground} />
            </Pressable>
          </View>

          <View style={styles.calRow}>
            {WEEKDAYS.map((w) => (
              <Text key={w} style={[styles.calWeekday, { color: colors.mutedForeground }]}>
                {w}
              </Text>
            ))}
          </View>

          {weeks.map((week, wi) => (
            <View key={wi} style={styles.calRow}>
              {week.map((ymd, di) => {
                if (!ymd) return <View key={di} style={styles.calCell} />;
                const isStart = ymd === start;
                const isEnd = ymd === end;
                const selected = isStart || isEnd;
                const inRange = !!start && !!end && ymd > start && ymd < end;
                const future = ymd > todayStr;
                return (
                  <Pressable
                    key={di}
                    disabled={future}
                    onPress={() => onDayPress(ymd)}
                    style={[styles.calCell, inRange && { backgroundColor: colors.primary + '20' }]}
                  >
                    <View style={[styles.calDayCircle, selected && { backgroundColor: colors.primary }]}>
                      <Text
                        style={[
                          styles.calDayText,
                          { color: selected ? colors.primaryForeground : future ? colors.border : colors.foreground },
                          ymd === todayStr && !selected && { color: colors.primary, fontFamily: 'Inter_700Bold' },
                        ]}
                      >
                        {Number(ymd.slice(8))}
                      </Text>
                    </View>
                  </Pressable>
                );
              })}
            </View>
          ))}

          <Text style={[styles.calSummary, { color: colors.mutedForeground }]}>{summary}</Text>

          <View style={styles.calFooter}>
            <Pressable onPress={onClose} style={[styles.calBtn, { borderColor: colors.border, borderWidth: 1 }]}>
              <Text style={[styles.calBtnText, { color: colors.foreground }]}>Cancel</Text>
            </Pressable>
            <Pressable
              disabled={!start}
              onPress={() => start && onApply(start, end ?? start)}
              style={[styles.calBtn, { backgroundColor: colors.primary, opacity: start ? 1 : 0.4 }]}
            >
              <Text style={[styles.calBtnText, { color: colors.primaryForeground }]}>Apply</Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
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

  actionRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 18, marginBottom: 22 },
  actionItem: { alignItems: 'center', width: 72 },
  actionIcon: { width: 46, height: 46, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginBottom: 6 },
  actionLabel: { fontSize: 10.5, fontFamily: 'Inter_500Medium', textAlign: 'center', lineHeight: 13 },

  /* Card section shell */
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
  chip: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingVertical: 4, paddingHorizontal: 2 },
  chipText: { fontSize: 11.5, fontFamily: 'Inter_500Medium' },

  periodInlineRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  periodInlinePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },

  /* Calendar popup */
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  modalCard: { width: '100%', maxWidth: 360, borderRadius: 16, borderWidth: 1, padding: 16 },
  calHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  calNavBtn: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  calTitle: { fontSize: 15, fontFamily: 'Inter_700Bold' },
  calRow: { flexDirection: 'row' },
  calWeekday: {
    width: `${100 / 7}%`,
    textAlign: 'center',
    fontSize: 11,
    fontFamily: 'Inter_600SemiBold',
    paddingBottom: 6,
  },
  calCell: { width: `${100 / 7}%`, height: 38, alignItems: 'center', justifyContent: 'center' },
  calDayCircle: { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center' },
  calDayText: { fontSize: 13, fontFamily: 'Inter_500Medium' },
  calSummary: { textAlign: 'center', fontSize: 12, fontFamily: 'Inter_500Medium', marginTop: 12 },
  calFooter: { flexDirection: 'row', gap: 10, marginTop: 14 },
  calBtn: { flex: 1, height: 40, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  calBtnText: { fontSize: 13, fontFamily: 'Inter_700Bold' },

  /* Sales Activity stat grid — columns are set inline (flexBasis) based on screen width.
     The negative margin on statGrid must match statCell's horizontal padding. */
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
  comingSoonText: { fontSize: 12, fontFamily: 'Inter_500Medium', textAlign: 'center', paddingHorizontal: 20, lineHeight: 17 },

  tableHeaderRow: { flexDirection: 'row', marginBottom: 4, paddingBottom: 8, borderBottomWidth: 1 },
  tableHeaderCell: { flex: 1, fontSize: 10.5, fontFamily: 'Inter_600SemiBold', textTransform: 'uppercase' },

  salesOrderRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10 },
  salesOrderChannelCell: { flex: 1, fontSize: 12.5, fontFamily: 'Inter_600SemiBold' },
  salesOrderCountCell: { flex: 1, fontSize: 12.5, fontFamily: 'Inter_500Medium', textAlign: 'center' },
});