import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  Pressable,
  ActivityIndicator,
  RefreshControl,
  Platform,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useColors } from '@/hooks/useColors';
import { useBusiness } from '@/contexts/BusinessContext';
// @ts-ignore
import {
  useListProducts,
  getListProductsQueryKey,
} from '@workspace/api-client-react';
// @ts-ignore
import type { Product } from '@workspace/api-client-react';

export default function OutOfStockProductsScreen() {
  const colors = useColors();
  const { business } = useBusiness();
  const [searchQuery, setSearchQuery] = useState('');

  const productsParams = { business_id: business?.id as number, limit: 100 };
  const {
    data: productsData,
    isLoading,
    refetch,
    isRefetching,
    error,
  } = useListProducts(productsParams, {
    query: { enabled: !!business?.id, queryKey: getListProductsQueryKey(productsParams) },
  });

  const allProducts: Product[] = productsData?.data ?? [];

  // Filter products strictly where stock quantity is below 10
  const lowStockItems = allProducts.filter((item: Product) => (item.stock_qty ?? 0) < 10);

  const filteredProducts = lowStockItems.filter(
    (item: Product) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.sku && item.sku.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.category && item.category.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleRestock = (productName: string) => {
    alert(`Redirecting to restock order for: ${productName}`);
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <View>
          <Text style={styles.headerTitle}>Out of Stock & Low Stock</Text>
          <Text style={styles.headerSubtitle}>
            Products with less than 10 units remaining in inventory.
          </Text>
        </View>
        <View style={styles.badgeContainer}>
          <Feather name="alert-circle" size={16} color="#EF4444" />
          <Text style={styles.badgeText}>{lowStockItems.length} Items Below 10</Text>
        </View>
      </View>

      <View style={styles.toolbar}>
        <View style={styles.searchContainer}>
          <Feather name="search" size={16} color="#94A3B8" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by product name, SKU, or category..."
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={() => setSearchQuery('')}>
              <Feather name="x" size={16} color="#94A3B8" />
            </Pressable>
          )}
        </View>
      </View>

      {isLoading && !isRefetching ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#7C3AED" />
          <Text style={styles.loadingText}>Loading inventory status...</Text>
        </View>
      ) : error ? (
        <View style={styles.centerContainer}>
          <Feather name="alert-triangle" size={40} color="#EF4444" />
          <Text style={styles.errorText}>Failed to fetch products from server</Text>
          <Pressable style={styles.retryButton} onPress={() => refetch()}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </Pressable>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor="#7C3AED" />
          }
        >
          {filteredProducts.length === 0 ? (
            <View style={styles.emptyState}>
              <Feather name="check-circle" size={48} color="#10B981" />
              <Text style={styles.emptyTitle}>All stocked up!</Text>
              <Text style={styles.emptySubtitle}>
                No products have a stock quantity below 10 right now.
              </Text>
            </View>
          ) : (
            <View style={styles.table}>
              <View style={[styles.tableRow, styles.tableHeaderRow]}>
                <Text style={[styles.tableHeaderCell, { flex: 2 }]}>Product Name / SKU</Text>
                <Text style={[styles.tableHeaderCell, { flex: 1 }]}>Category</Text>
                <Text style={[styles.tableHeaderCell, { flex: 1 }]}>Stock Qty</Text>
                <Text style={[styles.tableHeaderCell, { flex: 1 }]}>Price / Cost</Text>
                <Text style={[styles.tableHeaderCell, { flex: 1, textAlign: 'right' }]}>Actions</Text>
              </View>

              {filteredProducts.map((item: Product) => (
                <View key={item.id} style={styles.tableRow}>
                  <View style={[styles.tableCell, { flex: 2 }]}>
                    <Text style={styles.productName}>{item.name}</Text>
                    <Text style={styles.productSku}>SKU: {item.sku || 'N/A'}</Text>
                  </View>
                  <View style={[styles.tableCell, { flex: 1 }]}>
                    <View style={styles.categoryPill}>
                      <Text style={styles.categoryText}>{item.category || 'General'}</Text>
                    </View>
                  </View>
                  <View style={[styles.tableCell, { flex: 1 }]}>
                    <View style={[styles.stockBadge, (item.stock_qty ?? 0) === 0 && styles.outOfStockBadge]}>
                      <Text style={[styles.stockBadgeText, (item.stock_qty ?? 0) === 0 && styles.outOfStockText]}>
                        {item.stock_qty ?? 0} {item.unit}
                      </Text>
                    </View>
                  </View>
                  <View style={[styles.tableCell, { flex: 1 }]}>
                    <Text style={styles.priceText}>₹{item.selling_price}</Text>
                    <Text style={styles.costText}>Cost: ₹{item.cost_price}</Text>
                  </View>
                  <View style={[styles.tableCell, { flex: 1, alignItems: 'flex-end' }]}>
                    <Pressable
                      style={styles.restockButton}
                      onPress={() => handleRestock(item.name)}
                    >
                      <Feather name="plus" size={14} color="#7C3AED" />
                      <Text style={styles.restockButtonText}>Restock</Text>
                    </Pressable>
                  </View>
                </View>
              ))}
            </View>
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC', padding: 24 },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 },
  headerTitle: { fontSize: 22, fontWeight: '700', color: '#0F172A', fontFamily: 'Inter_700Bold' },
  headerSubtitle: { fontSize: 14, color: '#64748B', marginTop: 4, fontFamily: 'Inter_500Medium' },
  badgeContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FEF2F2', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, gap: 6, borderWidth: 1, borderColor: '#FEE2E2' },
  badgeText: { color: '#DC2626', fontSize: 12, fontWeight: '600', fontFamily: 'Inter_600SemiBold' },
  toolbar: { flexDirection: 'row', marginBottom: 16 },
  searchContainer: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 8, paddingHorizontal: 12, height: 42, maxWidth: 400 },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, fontSize: 14, color: '#0F172A', fontFamily: 'Inter_400Regular' },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
  loadingText: { marginTop: 12, fontSize: 14, color: '#64748B', fontFamily: 'Inter_500Medium' },
  errorText: { marginTop: 12, fontSize: 14, color: '#EF4444', textAlign: 'center', fontFamily: 'Inter_500Medium' },
  retryButton: { marginTop: 16, backgroundColor: '#7C3AED', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 6 },
  retryButtonText: { color: '#FFFFFF', fontSize: 13, fontWeight: '600', fontFamily: 'Inter_600SemiBold' },
  listContainer: { paddingBottom: 24 },
  table: { backgroundColor: '#FFFFFF', borderRadius: 10, borderWidth: 1, borderColor: '#E2E8F0', overflow: 'hidden' },
  tableRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  tableHeaderRow: { backgroundColor: '#F8FAFC', borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
  tableHeaderCell: { fontSize: 12, fontWeight: '600', color: '#475569', fontFamily: 'Inter_600SemiBold', textTransform: 'uppercase', letterSpacing: 0.5 },
  tableCell: { justifyContent: 'center' },
  productName: { fontSize: 14, fontWeight: '600', color: '#0F172A', fontFamily: 'Inter_600SemiBold' },
  productSku: { fontSize: 12, color: '#64748B', marginTop: 2, fontFamily: 'Inter_400Regular' },
  categoryPill: { alignSelf: 'flex-start', backgroundColor: '#F1F5F9', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  categoryText: { fontSize: 12, color: '#334155', fontFamily: 'Inter_500Medium' },
  stockBadge: { alignSelf: 'flex-start', backgroundColor: '#FEF3C7', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  outOfStockBadge: { backgroundColor: '#FEE2E2' },
  stockBadgeText: { fontSize: 12, fontWeight: '600', color: '#D97706', fontFamily: 'Inter_600SemiBold' },
  outOfStockText: { color: '#DC2626' },
  priceText: { fontSize: 14, fontWeight: '600', color: '#0F172A', fontFamily: 'Inter_600SemiBold' },
  costText: { fontSize: 11, color: '#64748B', fontFamily: 'Inter_400Regular' },
  restockButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F5F3FF', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6, borderWidth: 1, borderColor: '#DDD6FE', gap: 4 },
  restockButtonText: { color: '#7C3AED', fontSize: 12, fontWeight: '600', fontFamily: 'Inter_600SemiBold' },
  emptyState: { alignItems: 'center', justifyContent: 'center', padding: 60, backgroundColor: '#FFFFFF', borderRadius: 10, borderWidth: 1, borderColor: '#E2E8F0' },
  emptyTitle: { fontSize: 18, fontWeight: '600', color: '#0F172A', marginTop: 12, fontFamily: 'Inter_600SemiBold' },
  emptySubtitle: { fontSize: 14, color: '#64748B', marginTop: 4, textAlign: 'center', fontFamily: 'Inter_400Regular' },
});