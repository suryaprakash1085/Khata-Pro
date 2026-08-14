  import React, { useMemo, useState } from 'react';
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
  import { useAuth } from '@/contexts/AuthContext';
  import Svg, { Rect, Circle, Polyline, Text as SvgText, Defs, LinearGradient, Stop } from 'react-native-svg';


  const TAB_BAR_HEIGHT = Platform.OS === 'web' ? 84 : 49;

  export default function AllProductsScreen() {
    const colors = useColors();
    const insets = useSafeAreaInsets();
    const { business } = useBusiness();
    const queryClient = useQueryClient();
    const [search, setSearch] = useState('');
    const [filterTab, setFilterTab] = useState<'all' | 'in-stock' | 'low-stock' | 'out-of-stock'>('all');

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

    const LOW_STOCK_THRESHOLD = 5;
    const isLowStock = (p: Product) => {
      const qty = p.stock_qty ?? 0;
      const alertLevel = p.low_stock_alert ?? LOW_STOCK_THRESHOLD;
      return qty > 0 && qty <= alertLevel;
    };

    const products = allProducts.filter((p: Product) => {
      const qty = p.stock_qty ?? 0;
      if (filterTab === 'in-stock') return qty > (p.low_stock_alert ?? LOW_STOCK_THRESHOLD);
      if (filterTab === 'low-stock') return isLowStock(p);
      if (filterTab === 'out-of-stock') return qty <= 0;
      return true;
    });

    const stockStats = useMemo(() => {
      let inStock = 0, lowStock = 0, outOfStock = 0;
      allProducts.forEach((p: Product) => {
        const qty = p.stock_qty ?? 0;
        if (qty <= 0) outOfStock++;
        else if (isLowStock(p)) lowStock++;
        else inStock++;
      });
      return { total: allProducts.length, inStock, lowStock, outOfStock };
    }, [allProducts]);

    
  const { user } = useAuth();
  const isOwner = user?.role === 'owner';

  const showPermissionAlert = () => {
    const message = "You don't have permission to do this. Please ask your admin.";
    if (Platform.OS === 'web') {
      window.alert(message);
    } else {
      Alert.alert('Permission required', message);
    }
  };
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
    onPress={() => {
      if (!isOwner) {
        showPermissionAlert();
        return;
      }
      router.push({ pathname: '/add-product', params: { id: String(item.id) } });
    }}
    style={({ pressed }) => [styles.iconButton, { opacity: pressed ? 0.6 : 1 }]}
  >
    <Feather name="edit-2" size={16} color={colors.primary} />
  </Pressable>

  <Pressable
    onPress={(e: any) => {
      if (e && typeof e.stopPropagation === 'function') e.stopPropagation();
      if (!isOwner) {
        showPermissionAlert();
        return;
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
    };

    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
       <View style={[styles.header, { paddingTop: insets.top + 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }]}>
          <View style={{ flex: 1, minWidth: 260 }}>
            <Text style={[styles.title, { color: colors.foreground }]}>All Products Catalog</Text>
            <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
              View and manage the complete master inventory list
            </Text>
           <Pressable
              onPress={() => router.push('/add-product')}
              style={[styles.addProductBtn, { backgroundColor: colors.primary }]}
            >
              <Feather name="plus" size={16} color={colors.primaryForeground} />
              <Text style={[styles.addProductBtnText, { color: colors.primaryForeground }]}>Add Product</Text>
            </Pressable>
            {/* Filter Tabs & Search — now inside the header's left column */}
            <View style={styles.filterSearchContainer}>
              <View style={styles.filterTabsRow}>
                {(['all', 'in-stock', 'low-stock', 'out-of-stock'] as const).map((tab) => {
                  const active = filterTab === tab;
                  const label =
                    tab === 'all' ? 'All Items' :
                    tab === 'in-stock' ? 'In Stock' :
                    tab === 'low-stock' ? 'Low Stock' : 'Out of Stock';
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
          </View>
          <StockBarChart stats={stockStats} colors={colors} />
        </View>

        {isLoading ? (
          <ActivityIndicator style={{ marginTop: 40 }} color={colors.primary} />
        ) : (
          <View style={[styles.tableCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <FlatList
            data={products}
            keyExtractor={(p: Product) => String(p.id)}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
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
          </View>
        )}

        
      </View>
    );
  }

  function StockBarChart({
  stats,
  colors,
}: {
  stats: { total: number; inStock: number; lowStock: number; outOfStock: number };
  colors: any;
}) {
  const bars = [
    { key: 'total', label: 'Total', value: stats.total, from: '#FBBF24', to: '#F59E0B' },
    { key: 'in', label: 'In Stock', value: stats.inStock, from: '#F472B6', to: '#EC4899' },
    { key: 'low', label: 'Low', value: stats.lowStock, from: '#C084FC', to: '#A855F7' },
    { key: 'out', label: 'Out', value: stats.outOfStock, from: '#818CF8', to: '#6D28D9' },
  ];

  const CHART_W = 210;
  const CHART_H = 100;
  const BAR_W = 24;
  const TOP_PAD = 30;   // space for value + dot
  const BASE_Y = CHART_H - 14; // space for label at bottom
  const max = Math.max(...bars.map((b) => b.value), 1);
  const gap = (CHART_W - BAR_W * bars.length) / (bars.length + 1);

  const barGeom = bars.map((b, i) => {
    const x = gap + i * (BAR_W + gap);
    const usable = BASE_Y - TOP_PAD;
    const h = b.value > 0 ? Math.max((b.value / max) * usable, 6) : 3;
    const y = BASE_Y - h;
    return { ...b, x, y, h, cx: x + BAR_W / 2 };
  });

  const points = barGeom.map((b) => `${b.cx},${b.y - 12}`).join(' ');

  return (
    <View style={[chartStyles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <Text style={[chartStyles.title, { color: colors.foreground }]}>Stock Overview</Text>
      <Svg width={CHART_W} height={CHART_H}>
        <Defs>
          {barGeom.map((b) => (
            <LinearGradient id={`grad-${b.key}`} key={b.key} x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor={b.from} />
              <Stop offset="1" stopColor={b.to} />
            </LinearGradient>
          ))}
        </Defs>

        <Polyline points={points} fill="none" stroke={colors.mutedForeground} strokeWidth={1.2} opacity={0.5} />

        {barGeom.map((b) => (
          <React.Fragment key={b.key}>
            <SvgText x={b.cx} y={b.y - 20} fontSize="10" fontWeight="bold" fill={b.to} textAnchor="middle">
              {b.value}
            </SvgText>
            <Circle cx={b.cx} cy={b.y - 12} r={3} fill={b.to} />
            <Rect x={b.x} y={b.y} width={BAR_W} height={b.h} rx={6} fill={`url(#grad-${b.key})`} />
            <SvgText x={b.cx} y={BASE_Y + 13} fontSize="9" fill={colors.mutedForeground} textAnchor="middle">
              {b.label}
            </SvgText>
          </React.Fragment>
        ))}
      </Svg>
    </View>
  );
}

const chartStyles = StyleSheet.create({
  card: { borderWidth: 1, borderRadius: 10, paddingVertical: 8, paddingHorizontal: 10, alignItems: 'center' },
  title: { fontFamily: 'Times New Roman', fontSize: 11, fontWeight: '700', marginBottom: 2, alignSelf: 'flex-start' },
});

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      width: '100%',
      maxWidth: 1400,
      alignSelf: 'center',
    },
    header: { 
      paddingHorizontal: 20, 
      paddingBottom: 20
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
      justifyContent: 'flex-start',
      alignItems: Platform.OS === 'web' ? 'center' : 'stretch',
      marginTop: 18,
      marginBottom: 8,
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
      minWidth: Platform.OS === 'web' ? 200 : '100%',
      flex: Platform.OS === 'web' ? 1 : undefined,
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
      borderTopLeftRadius: 12,
      borderTopRightRadius: 12,
    },
    tableCard: {
      marginHorizontal: 20,
      borderWidth: 1,
      borderRadius: 12,
      overflow: 'hidden',
      flex: 1,
      ...(Platform.OS === 'web' ? ({ scrollbarWidth: 'none' } as any) : {}),
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
    addProductBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      alignSelf: 'flex-start',
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderRadius: 8,
      marginTop: 10,
    },
    addProductBtnText: {
      fontFamily: 'Times New Roman',
      fontSize: 13,
      fontWeight: '700',
    },
  });