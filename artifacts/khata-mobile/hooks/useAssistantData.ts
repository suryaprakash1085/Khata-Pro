import { useQuery } from '@tanstack/react-query';
import {
  useGetTopCustomers,
  useListProducts,
  customFetch,
  type TopCustomer,
  type Product,
  getListProductsQueryKey,
  getGetTopCustomersQueryKey,
} from '@workspace/api-client-react';
import { useBusiness } from '@/contexts/BusinessContext';

// ---- Minimal local re-declarations of report hooks that exist in
// reports.tsx but aren't exported from there. Same endpoints, same
// query keys where possible, so TanStack Query's cache is shared
// with the Reports screen (no duplicate network calls if the user
// already opened Reports this session). ----

interface TxnListResponse {
  data: { id: number; amount: number; type: string; entry_date: string }[];
}

function useTxns(businessId: number | undefined, filter: 'today' | 'week', enabled: boolean) {
  return useQuery<TxnListResponse>({
    queryKey: ['transactions', { business_id: businessId, filter, type: 'you_gave', limit: 1000 }],
    enabled,
    queryFn: () => {
      const search = new URLSearchParams();
      if (businessId) search.set('business_id', String(businessId));
      search.set('filter', filter);
      search.set('type', 'you_gave');
      search.set('limit', '1000');
      return customFetch<TxnListResponse>(`/api/transactions?${search.toString()}`, { responseType: 'json' });
    },
  });
}

interface ProductSalesItem {
  product_id: number;
  name: string;
  qty_sold: number;
  sales_amount: number;
}

function useTodayProductSales(businessId: number | undefined, enabled: boolean) {
  return useQuery<ProductSalesItem[]>({
    queryKey: ['reports', 'product-sales', { business_id: businessId, filter: 'today' }],
    enabled,
    queryFn: () => {
      const search = new URLSearchParams();
      if (businessId) search.set('business_id', String(businessId));
      search.set('filter', 'today');
      return customFetch<ProductSalesItem[]>(`/api/reports/product-sales?${search.toString()}`, { responseType: 'json' });
    },
  });
}

export function useAssistantData() {
  const { business } = useBusiness();
  const businessId = business?.id;
  const enabled = !!businessId;

  const todayTxns = useTxns(businessId, 'today', enabled);
  const weekTxns = useTxns(businessId, 'week', enabled);
  const todayProductSales = useTodayProductSales(businessId, enabled);

  const productsParams = { business_id: businessId as number, limit: 500 };
//   const productsQuery = useListProducts(productsParams, { query: { enabled } });
const productsQuery = useListProducts(productsParams, {
    query: { enabled, queryKey: getListProductsQueryKey(productsParams) },
  });

  const customersParams = { business_id: businessId as number, limit: 100 };
//   const customersQuery = useGetTopCustomers(customersParams, { query: { enabled } });

const customersQuery = useGetTopCustomers(customersParams, {
    query: { enabled, queryKey: getGetTopCustomersQueryKey(customersParams) },
 });

  const isLoading =
    todayTxns.isLoading || weekTxns.isLoading || todayProductSales.isLoading ||
    productsQuery.isLoading || customersQuery.isLoading;

  // ---- Derived, ready-to-format shapes ----

  const todaySales = (() => {
    const txns = todayTxns.data?.data ?? [];
    const totalRevenue = txns.reduce((s, t) => s + t.amount, 0);
    const bills = txns.length;
    return { totalRevenue, bills, avgBill: bills ? totalRevenue / bills : 0 };
  })();

  const weekSummary = (() => {
    const txns = weekTxns.data?.data ?? [];
    const totalRevenue = txns.reduce((s, t) => s + t.amount, 0);
    const bills = txns.length;
    return { totalRevenue, bills, avgBill: bills ? totalRevenue / bills : 0 };
  })();

  const lowStockProducts = (productsQuery.data?.data ?? [])
    .filter((p: Product & any) => p.stock_qty > 0 && p.stock_qty <= (p.low_stock_alert ?? 5))
    .map((p: any) => ({ name: p.name, stock_qty: p.stock_qty, unit: p.unit }));

  const outOfStockCount = (productsQuery.data?.data ?? []).filter((p: any) => p.stock_qty === 0).length;

  const topProducts = [...(todayProductSales.data ?? [])]
    .sort((a, b) => b.sales_amount - a.sales_amount)
    .slice(0, 5);

  const pendingCustomers: TopCustomer[] = [...(customersQuery.data ?? [])]
    .filter((c: any) => (c.current_balance ?? 0) > 0)
    .sort((a: any, b: any) => (b.current_balance ?? 0) - (a.current_balance ?? 0))
    .slice(0, 5);

  const totalPendingFromCustomers = (customersQuery.data ?? []).reduce(
    (s: number, c: any) => s + Math.max(0, c.current_balance ?? 0),
    0,
  );

  return {
    isLoading,
    todaySales,
    weekSummary,
    lowStockProducts,
    outOfStockCount,
    topProducts,
    pendingCustomers,
    totalPendingFromCustomers,
  };
}

export type AssistantData = ReturnType<typeof useAssistantData>;