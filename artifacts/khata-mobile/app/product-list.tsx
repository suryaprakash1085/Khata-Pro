import React, { useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useQueryClient } from '@tanstack/react-query';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';
import { useBusiness } from '@/contexts/BusinessContext';
import { useAuth } from '@/contexts/AuthContext';
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

export default function ProductListScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { business } = useBusiness();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');

  const isAdmin = user?.role === 'owner';

  const productsParams = { business_id: business?.id as number, search: search || undefined, limit: 100 };
  const {
    data: productsData,
    isLoading,
    refetch,
    isRefetching,
  } = useListProducts(productsParams, {
    query: { enabled: !!business?.id, queryKey: getListProductsQueryKey(productsParams) },
  });

  const products = productsData?.data ?? [];

  const totalProducts = products.length;
  const lowStockCount = products.filter((p: Product) => (p.stock_qty ?? 0) <= 5).length;

  const deleteProduct = useDeleteProduct();

  const handleDelete = (item: Product) => {
    const confirmDelete = Platform.OS === 'web' 
      ? window.confirm(`Delete "${item.name}"? This can't be undone.`)
      : true;

    if (Platform.OS === 'web') {
      if (!confirmDelete) return;
      executeDelete(item);
    } else {
      Alert.alert(
        'Delete product',
        `Delete "${item.name}"? This can't be undone.`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: () => executeDelete(item),
          },
        ]
      );
    }
  };

  const executeDelete = (item: Product) => {
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
          Alert.alert(
            "Delete Failed",
            error?.response?.data?.message ?? error?.message ?? "Could not delete product"
          );
        },
      }
    );
  };

  const renderItem = ({ item }: { item: Product }) => (
    <View
      style={[
        styles.tableRow,
        {
          borderBottomColor: colors.border,
        },
      ]}
    >
      <Text style={[styles.cell, styles.colProduct, { color: colors.foreground }]} numberOfLines={1}>
        {item.name}
      </Text>

      <Text style={[styles.cell, styles.colStock, { color: colors.foreground }]}>
        {item.stock_qty ?? 0}
      </Text>

      <Text style={[styles.cell, styles.colPrice, { color: colors.foreground }]}>
        {formatCurrency(item.selling_price ?? 0, business?.currency)}
      </Text>

      <Text style={[styles.cell, styles.colGst, { color: colors.foreground }]}>
        {item.gst_rate ?? 0}%
      </Text>
      
      <View style={styles.actionCell}>
        <Pressable
          onPress={() =>
            router.push({
              pathname: "/add-product",
              params: { id: String(item.id) },
            })
          }
          style={({ pressed }) => [styles.iconButton, { opacity: pressed ? 0.6 : 1 }]}
        >
          <Feather
            name="edit-2"
            size={16}
            color={colors.primary}
          />
        </Pressable>

        <Pressable
          onPress={(e: any) => {
            if (e && typeof e.stopPropagation === 'function') {
              e.stopPropagation();
            }
            handleDelete(item);
          }}
          style={({ pressed }) => [styles.iconButton, styles.deleteButton, { opacity: pressed ? 0.6 : 1 }]}
        >
          <Feather name="trash-2" size={16} color="#EF4444" />
        </Pressable>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <Text style={[styles.title, { color: colors.foreground }]}>Products</Text>
        <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
          Manage your inventory
        </Text>
      </View>

      <View style={styles.statsRow}>
        <View style={[styles.statCard, { backgroundColor: colors.card, borderRadius: colors.radius }]}>
          <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>Total products</Text>
          <Text style={[styles.statValue, { color: colors.foreground }]}>{totalProducts}</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: colors.card, borderRadius: colors.radius }]}>
          <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>Low stock</Text>
          <Text style={[styles.statValue, { color: colors.destructive }]}>{lowStockCount}</Text>
        </View>
      </View>

      <View style={[styles.searchWrap, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius }]}>
        <Feather name="search" size={16} color={colors.mutedForeground} />
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search products"
          placeholderTextColor={colors.mutedForeground}
          style={[styles.searchInput, { color: colors.foreground }]}
        />
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
              <Text style={[styles.headerText, styles.colProduct, { color: colors.mutedForeground }]}>Product</Text>
              <Text style={[styles.headerText, styles.colStock, { color: colors.mutedForeground }]}>Stock</Text>
              <Text style={[styles.headerText, styles.colPrice, { color: colors.mutedForeground }]}>Price</Text>
              <Text style={[styles.headerText, styles.colGst, { color: colors.mutedForeground }]}>GST</Text>
              <Text style={[styles.headerText, styles.actionCellHeader, { color: colors.mutedForeground }]}>Action</Text>
            </View>
          }
          refreshing={isRefetching}
          onRefresh={refetch}
          contentContainerStyle={{ paddingBottom: insets.bottom + TAB_BAR_HEIGHT + 100, flexGrow: 1 }}
          ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: colors.border }} />}
          ListEmptyComponent={
            <EmptyState
              icon="package"
              title="No products yet"
              subtitle="Add your first product to start tracking inventory"
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
  header: { paddingHorizontal: 20, paddingBottom: 14 },
  title: { fontSize: 24, fontFamily: 'Times New Roman', fontWeight: 'bold' },
  subtitle: { fontSize: 14, fontFamily: 'Times New Roman', marginTop: 2 },
  statsRow: { flexDirection: 'row', gap: 12, paddingHorizontal: 20, marginBottom: 14 },
  statCard: { flex: 1, padding: 14 },
  statLabel: { fontSize: 13, fontFamily: 'Times New Roman' },
  statValue: { fontSize: 20, fontFamily: 'Times New Roman', fontWeight: 'bold', marginTop: 4 },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginHorizontal: 20,
    marginBottom: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
  },
  searchInput: { flex: 1, fontSize: 15, fontFamily: 'Times New Roman' },
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
  tableHeader: {
    flexDirection: "row",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
  },
  tableRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
  },
  headerText: {
    fontFamily: 'Times New Roman',
    fontWeight: "bold",
    fontSize: 13,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  cell: {
    fontSize: 15,
    fontFamily: 'Times New Roman',
  },
  colProduct: { flex: 2, paddingRight: 8 },
  colStock: { flex: 1, paddingRight: 8 },
  colPrice: { flex: 1, paddingRight: 8 },
  colGst: { flex: 0.8, paddingRight: 8 },
  actionCell: { flex: 1, flexDirection: 'row', justifyContent: 'flex-end', gap: 8 },
  actionCellHeader: { flex: 1, textAlign: 'right' },
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
});