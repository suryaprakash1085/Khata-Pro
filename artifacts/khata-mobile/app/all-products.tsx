import React, { useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useQueryClient } from '@tanstack/react-query';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';
import { useBusiness } from '@/contexts/BusinessContext';
// @ts-ignore
import {
  useListProducts,
  useDeleteProduct,
  getListProductsQueryKey,
} from '@workspace/api-client-react';
// @ts-ignore
import type { Product } from '@workspace/api-client-react';
import { EmptyState } from '@/components/EmptyState';
import { formatCurrency } from '@/lib/format';

const TAB_BAR_HEIGHT = Platform.OS === 'web' ? 84 : 49;

export default function AllProductsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { business } = useBusiness();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [filterTab, setFilterTab] = useState<'all' | 'in-stock' | 'out-of-stock'>('all');

  const productsParams = { business_id: business?.id as number, search: search || undefined, limit: 200 };
  const {
    data: productsData,
    isLoading,
    refetch,
    isRefetching,
  } = useListProducts(productsParams, {
    query: { enabled: !!business?.id, queryKey: getListProductsQueryKey(productsParams) },
  });

  const allProducts = productsData?.data ?? [];

  const products = allProducts.filter((p: Product) => {
    const qty = p.stock_qty ?? 0;
    if (filterTab === 'in-stock') return qty > 0;
    if (filterTab === 'out-of-stock') return qty <= 0;
    return true;
  });

  const deleteProduct = useDeleteProduct();

  const handleDelete = (item: Product) => {
    const executeDelete = () => {
      deleteProduct.mutate(
        { id: item.id } as any,
        {
          onSuccess: () => {
            queryClient.invalidateQueries({
              queryKey: getListProductsQueryKey(productsParams),
            });
            refetch();
          },
          onError: (error: any) => {
            Alert.alert("Delete Failed", error?.message ?? "Could not delete product");
          },
        }
      );
    };

    if (Platform.OS === 'web') {
      if (window.confirm(`Delete "${item.name}"? This can't be undone.`)) {
        executeDelete();
      }
    } else {
      Alert.alert(
        'Delete product',
        `Delete "${item.name}"? This can't be undone.`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Delete', style: 'destructive', onPress: executeDelete },
        ]
      );
    }
  };

  const renderItem = ({ item }: { item: Product }) => {
    const isOut = (item.stock_qty ?? 0) <= 0;
    return (
      <View style={[styles.tableRow, { borderBottomColor: colors.border }]}>
        <View style={styles.colProduct}>
          <Text style={[styles.cellPrimary, { color: colors.foreground }]} numberOfLines={1}>
            {item.name}
          </Text>
          {item.sku ? <Text style={[styles.cellSecondary, { color: colors.mutedForeground }]}>SKU: {item.sku}</Text> : null}
        </View>

        <View style={styles.colStock}>
          <Text style={[styles.cell, { color: colors.foreground }]}>
            {item.stock_qty ?? 0}
          </Text>
          <View style={[styles.badge, { backgroundColor: isOut ? 'rgba(239, 68, 68, 0.12)' : 'rgba(34, 197, 94, 0.12)' }]}>
            <Text style={[styles.badgeText, { color: isOut ? '#EF4444' : '#22C55E' }]}>
              {isOut ? 'Out' : 'In Stock'}
            </Text>
          </View>
        </View>

        <Text style={[styles.cell, styles.colPrice, { color: colors.foreground }]}>
          {formatCurrency(item.selling_price ?? 0, business?.currency)}
        </Text>

        <Text style={[styles.cell, styles.colGst, { color: colors.foreground }]}>
          {item.gst_rate ?? 0}%
        </Text>

        <View style={styles.actionCell}>
          <Pressable
            onPress={() => router.push({ pathname: '/add-product', params: { id: String(item.id) } })}
            style={({ pressed }) => [styles.iconButton, { opacity: pressed ? 0.6 : 1 }]}
          >
            <Feather name="edit-2" size={16} color={colors.primary} />
          </Pressable>

          <Pressable
            onPress={(e: any) => {
              if (e && typeof e.stopPropagation === 'function') e.stopPropagation();
              handleDelete(item);
            }}
            style={({ pressed }) => [styles.iconButton, styles.deleteButton, { opacity: pressed ? 0.6 : 1 }]}
          >
            <Feather name="trash-2" size={16} color="#EF4444" />
          </Pressable>
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <Text style={[styles.title, { color: colors.foreground }]}>All Products Catalog</Text>
        <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
          View and manage the complete master inventory list
        </Text>
      </View>

      {/* Filter Tabs & Search Container for Responsiveness */}
      <View style={styles.filterSearchContainer}>
        <View style={styles.filterTabsRow}>
          {(['all', 'in-stock', 'out-of-stock'] as const).map((tab) => {
            const active = filterTab === tab;
            const label = tab === 'all' ? 'All Items' : tab === 'in-stock' ? 'In Stock' : 'Out of Stock';
            return (
              <Pressable
                key={tab}
                onPress={() => setFilterTab(tab)}
                style={[
                  styles.tabChip,
                  { backgroundColor: active ? colors.primary : colors.card, borderColor: colors.border },
                ]}
              >
                <Text style={[styles.tabChipText, { color: active ? colors.primaryForeground : colors.foreground }]}>
                  {label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <View style={[styles.searchWrap, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius }]}>
          <Feather name="search" size={16} color={colors.mutedForeground} />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search by product name or code..."
            placeholderTextColor={colors.mutedForeground}
            style={[styles.searchInput, { color: colors.foreground }]}
          />
        </View>
      </View>

      {isLoading ? (
        <ActivityIndicator style={{ marginTop: 40 }} color={colors.primary} />
      ) : (
        <FlatList
          data={products}
          keyExtractor={(p: Product) => String(p.id)}
          renderItem={renderItem}
          ListHeaderComponent={
            <View style={[styles.tableHeader, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
              <Text style={[styles.headerText, styles.colProduct, { color: colors.mutedForeground }]}>Product Details</Text>
              <Text style={[styles.headerText, styles.colStock, { color: colors.mutedForeground }]}>Stock Status</Text>
              <Text style={[styles.headerText, styles.colPrice, { color: colors.mutedForeground }]}>Price</Text>
              <Text style={[styles.headerText, styles.colGst, { color: colors.mutedForeground }]}>GST</Text>
              <Text style={[styles.headerText, styles.actionCellHeader, { color: colors.mutedForeground }]}>Actions</Text>
            </View>
          }
          refreshing={isRefetching}
          onRefresh={refetch}
          contentContainerStyle={{ paddingBottom: insets.bottom + TAB_BAR_HEIGHT + 100, flexGrow: 1 }}
          ListEmptyComponent={
            <EmptyState
              icon="package"
              title="No products found"
              subtitle="Try adjusting your search criteria or add new items."
            />
          }
        />
      )}

      <Pressable
        onPress={() => router.push('/add-product')}
        style={[styles.fab, { backgroundColor: colors.primary, bottom: insets.bottom + TAB_BAR_HEIGHT + 20 }]}
      >
        <Feather name="plus" size={26} color={colors.primaryForeground} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    maxWidth: 1400,
    alignSelf: 'center',
  },
  header: { 
    paddingHorizontal: 20, 
    paddingBottom: 10 
  },
  title: { 
    fontSize: 24, 
    fontFamily: 'Times New Roman', 
    fontWeight: 'bold' 
  },
  subtitle: { 
    fontSize: 14, 
    fontFamily: 'Times New Roman', 
    marginTop: 2 
  },
  filterSearchContainer: {
    flexDirection: Platform.OS === 'web' ? 'row' : 'column',
    justifyContent: 'space-between',
    alignItems: Platform.OS === 'web' ? 'center' : 'stretch',
    paddingHorizontal: 20,
    marginVertical: 12,
    gap: 12,
  },
  filterTabsRow: { 
    flexDirection: 'row', 
    flexWrap: 'wrap',
    gap: 8,
  },
  tabChip: { 
    paddingHorizontal: 14, 
    paddingVertical: 8, 
    borderRadius: 16, 
    borderWidth: 1,
  },
  tabChipText: { 
    fontSize: 13, 
    fontFamily: 'Times New Roman',
  },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    minWidth: Platform.OS === 'web' ? 280 : '100%',
  },
  searchInput: { 
    flex: 1, 
    fontSize: 15, 
    fontFamily: 'Times New Roman',
  },
  tableHeader: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
  },
  headerText: { 
    fontSize: 13, 
    fontFamily: 'Times New Roman', 
    fontWeight: 'bold',
    textTransform: 'uppercase', 
    letterSpacing: 0.5 
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
  },
  colProduct: { flex: 2, paddingRight: 8 },
  colStock: { flex: 1.2, flexDirection: 'row', alignItems: 'center', gap: 6, paddingRight: 8 },
  colPrice: { flex: 1, paddingRight: 8 },
  colGst: { flex: 0.8, paddingRight: 8 },
  actionCell: { flex: 1, flexDirection: 'row', justifyContent: 'flex-end', gap: 8 },
  actionCellHeader: { flex: 1, textAlign: 'right' },
  cellPrimary: { fontSize: 15, fontFamily: 'Times New Roman', fontWeight: 'bold' },
  cellSecondary: { fontSize: 12, fontFamily: 'Times New Roman', marginTop: 2 },
  cell: { fontSize: 15, fontFamily: 'Times New Roman' },
  badge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  badgeText: { fontSize: 11, fontFamily: 'Times New Roman', fontWeight: 'bold' },
  iconButton: {
    width: 32,
    height: 32,
    borderRadius: 6,
    backgroundColor: 'rgba(124, 58, 237, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButton: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
  },
  fab: {
    position: 'absolute',
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
    zIndex: 10,
  },
});