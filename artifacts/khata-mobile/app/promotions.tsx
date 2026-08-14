import React, { useMemo, useState } from 'react';
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
  useListPromotions,
  useUpdatePromotionStatus,
  getListPromotionsQueryKey,
  getListActivePromotionsQueryKey,
} from '@workspace/api-client-react';
// @ts-ignore
import type { Promotion } from '@workspace/api-client-react';
import { EmptyState } from '@/components/EmptyState';

const TAB_BAR_HEIGHT = Platform.OS === 'web' ? 84 : 49;

type DerivedStatus = 'active' | 'upcoming' | 'expired' | 'disabled';

function getDerivedStatus(promo: Promotion): DerivedStatus {
  if (promo.status === 'inactive') return 'disabled';
  const today = new Date().toISOString().split('T')[0];
  if (promo.end_date < today) return 'expired';
  if (promo.start_date > today) return 'upcoming';
  return 'active';
}

const STATUS_META: Record<DerivedStatus, { label: string; color: string; bg: string }> = {
  active: { label: 'Active', color: '#16A34A', bg: 'rgba(22,163,74,0.12)' },
  upcoming: { label: 'Upcoming', color: '#D97706', bg: 'rgba(217,119,6,0.12)' },
  expired: { label: 'Expired', color: '#DC2626', bg: 'rgba(220,38,38,0.12)' },
  disabled: { label: 'Disabled', color: '#6B7280', bg: 'rgba(107,114,128,0.12)' },
};

function formatDateShort(d: string) {
  try {
    return new Date(d + 'T00:00:00').toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  } catch {
    return d;
  }
}

export default function PromotionsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { business } = useBusiness();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const isOwner = user?.role === 'owner';

  const [search, setSearch] = useState('');

  const params = { business_id: business?.id as number, limit: 200 };
  const { data, isLoading, refetch, isRefetching } = useListPromotions(params, {
    query: { enabled: !!business?.id, queryKey: getListPromotionsQueryKey(params) },
  });

  const allPromotions: Promotion[] = data?.data ?? [];

  const promotions = allPromotions.filter((p) =>
    search.trim().length === 0 ? true : p.name.toLowerCase().includes(search.trim().toLowerCase())
  );

  const stats = useMemo(() => {
    let active = 0, upcoming = 0, expired = 0;
    allPromotions.forEach((p) => {
      const s = getDerivedStatus(p);
      if (s === 'active') active++;
      else if (s === 'upcoming') upcoming++;
      else if (s === 'expired') expired++;
    });
    return { total: allPromotions.length, active, upcoming, expired };
  }, [allPromotions]);

  const updateStatus = useUpdatePromotionStatus();

  const showPermissionAlert = () => {
    const message = "You don't have permission to do this. Please ask your admin.";
    if (Platform.OS === 'web') window.alert(message);
    else Alert.alert('Permission required', message);
  };

  const toggleStatus = (promo: Promotion) => {
    if (!isOwner) { showPermissionAlert(); return; }
    const nextStatus = promo.status === 'active' ? 'inactive' : 'active';
    updateStatus.mutate(
      { id: promo.id, data: { status: nextStatus } } as any,
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListPromotionsQueryKey(params), exact: false });
          queryClient.invalidateQueries({
            queryKey: getListActivePromotionsQueryKey({ business_id: business?.id as number }),
            exact: false,
          });
          refetch();
        },
        onError: () => {
          const msg = 'Could not update promotion status. Please try again.';
          if (Platform.OS === 'web') window.alert(msg);
          else Alert.alert('Error', msg);
        },
      }
    );
  };

  const renderCard = ({ item }: { item: Promotion }) => {
    const derived = getDerivedStatus(item);
    const meta = STATUS_META[derived];
    const isBogo = item.promotion_type === 'bogo';

    return (
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={[styles.typeIconWrap, { backgroundColor: isBogo ? 'rgba(124,58,237,0.12)' : 'rgba(22,163,74,0.12)' }]}>
          <Feather name={isBogo ? 'gift' : 'percent'} size={18} color={isBogo ? '#7C3AED' : '#16A34A'} />
        </View>

        <View style={{ flex: 1, minWidth: 180 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <Text style={[styles.cardTitle, { color: colors.foreground }]}>{item.name}</Text>
            {!isBogo && item.discount_percentage ? (
              <View style={styles.discountPill}>
                <Text style={styles.discountPillText}>{item.discount_percentage}% Discount</Text>
              </View>
            ) : null}
          </View>
          <Text style={[styles.cardSubtitle, { color: colors.mutedForeground }]}>
            {isBogo ? 'Buy 1 and get 1 free' : `Flat ${item.discount_percentage ?? 10}% discount on all products`}
          </Text>
        </View>

        <View style={styles.colType}>
          <Text style={[styles.colLabel, { color: colors.mutedForeground }]}>TYPE</Text>
          <Text style={[styles.colValue, { color: colors.foreground }]}>{isBogo ? 'Buy 1 Get 1 Free' : 'Percentage Discount'}</Text>
        </View>

        <View style={styles.colApplies}>
          <Text style={[styles.colLabel, { color: colors.mutedForeground }]}>APPLIES TO</Text>
          <Text style={[styles.colValue, { color: colors.foreground }]}>
            {item.apply_to === 'all' ? 'All Products' : `${item.product_ids?.length ?? 0} Product${(item.product_ids?.length ?? 0) === 1 ? '' : 's'}`}
          </Text>
        </View>

        <View style={styles.colPeriod}>
          <Text style={[styles.colLabel, { color: colors.mutedForeground }]}>PERIOD</Text>
          <Text style={[styles.colValue, { color: colors.foreground }]}>
            {formatDateShort(item.start_date)} - {formatDateShort(item.end_date)}
          </Text>
        </View>

        <View style={[styles.statusPill, { backgroundColor: meta.bg }]}>
          <View style={[styles.statusDot, { backgroundColor: meta.color }]} />
          <Text style={[styles.statusPillText, { color: meta.color }]}>{meta.label}</Text>
        </View>

        <View style={styles.actionsCol}>
          <Pressable
            onPress={() => {
              if (!isOwner) { showPermissionAlert(); return; }
              router.push({ pathname: '/add-promotion', params: { id: String(item.id) } });
            }}
            style={({ pressed }) => [styles.iconButton, { opacity: pressed ? 0.6 : 1 }]}
          >
            <Feather name="edit-2" size={15} color={colors.primary} />
          </Pressable>
          <Pressable
            onPress={() => toggleStatus(item)}
            style={({ pressed }) => [
              styles.iconButton,
              { backgroundColor: item.status === 'active' ? 'rgba(239,68,68,0.1)' : 'rgba(34,197,94,0.12)', opacity: pressed ? 0.6 : 1 },
            ]}
          >
            <Feather name={item.status === 'active' ? 'pause' : 'play'} size={15} color={item.status === 'active' ? '#EF4444' : '#16A34A'} />
          </Pressable>
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.title, { color: colors.foreground }]}>Promotions</Text>
          <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
            Manage Buy 1 Get 1 Free and percentage-discount offers
          </Text>
        </View>
        <Pressable
          onPress={() => {
            if (!isOwner) { showPermissionAlert(); return; }
            router.push('/add-promotion');
          }}
          style={[styles.addBtn, { backgroundColor: colors.primary }]}
        >
          <Feather name="plus" size={16} color="#fff" />
          <Text style={styles.addBtnText}>Add Promotion</Text>
        </Pressable>
      </View>

      {/* Stat tiles */}
      <View style={styles.statsRow}>
        <StatTile icon="gift" iconColor="#7C3AED" iconBg="rgba(124,58,237,0.12)" label="Total Promotions" sub="All time promotions" value={stats.total} colors={colors} />
        <StatTile icon="check-circle" iconColor="#16A34A" iconBg="rgba(22,163,74,0.12)" label="Active Promotions" sub="Currently running" value={stats.active} colors={colors} />
        <StatTile icon="clock" iconColor="#D97706" iconBg="rgba(217,119,6,0.12)" label="Upcoming Promotions" sub="Starts in future" value={stats.upcoming} colors={colors} />
        <StatTile icon="x-circle" iconColor="#DC2626" iconBg="rgba(220,38,38,0.12)" label="Expired Promotions" sub="Already ended" value={stats.expired} colors={colors} />
      </View>

      <View style={[styles.searchWrap, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius }]}>
        <Feather name="search" size={16} color={colors.mutedForeground} />
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search promotions..."
          placeholderTextColor={colors.mutedForeground}
          style={[styles.searchInput, { color: colors.foreground }]}
        />
      </View>

      {isLoading ? (
        <ActivityIndicator style={{ marginTop: 40 }} color={colors.primary} />
      ) : (
        <FlatList
          data={promotions}
          keyExtractor={(p: Promotion) => String(p.id)}
          renderItem={renderCard}
          refreshing={isRefetching}
          onRefresh={refetch}
          contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + TAB_BAR_HEIGHT + 40, gap: 12, flexGrow: 1 }}
          ListEmptyComponent={
            <EmptyState icon="gift" title="No promotions yet" subtitle="Create a Buy 1 Get 1 Free or 10% OFF promotion to get started." />
          }
        />
      )}
    </View>
  );
}

function StatTile({ icon, iconColor, iconBg, label, sub, value, colors }: any) {
  return (
    <View style={[styles.statTile, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={[styles.statIconWrap, { backgroundColor: iconBg }]}>
        <Feather name={icon} size={18} color={iconColor} />
      </View>
      <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>{label}</Text>
      <Text style={[styles.statValue, { color: colors.foreground }]}>{value}</Text>
      <Text style={[styles.statSub, { color: colors.mutedForeground }]}>{sub}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, width: '100%', maxWidth: 1400, alignSelf: 'center' },
  header: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', paddingHorizontal: 20, paddingBottom: 14, gap: 12, flexWrap: 'wrap' },
  title: { fontSize: 24, fontFamily: 'Times New Roman', fontWeight: 'bold' },
  subtitle: { fontSize: 14, fontFamily: 'Times New Roman', marginTop: 2 },
  addBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8 },
  addBtnText: { color: '#fff', fontSize: 13, fontFamily: 'Times New Roman', fontWeight: '700' },

  statsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, paddingHorizontal: 20, marginBottom: 12 },
  statTile: { flex: 1, minWidth: 180, borderWidth: 1, borderRadius: 12, padding: 14 },
  statIconWrap: { width: 34, height: 34, borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  statLabel: { fontSize: 12, fontFamily: 'Times New Roman', fontWeight: '600' },
  statValue: { fontSize: 24, fontFamily: 'Times New Roman', fontWeight: 'bold', marginTop: 2 },
  statSub: { fontSize: 11, fontFamily: 'Times New Roman', marginTop: 2 },

  searchWrap: { flexDirection: 'row', alignItems: 'center', gap: 8, marginHorizontal: 20, paddingHorizontal: 14, paddingVertical: 8, borderWidth: 1, marginBottom: 12 },
  searchInput: { flex: 1, fontSize: 15, fontFamily: 'Times New Roman' },

  card: { flexDirection: 'row', alignItems: 'center', gap: 14, borderWidth: 1, borderRadius: 12, padding: 14, flexWrap: 'wrap' },
  typeIconWrap: { width: 40, height: 40, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  cardTitle: { fontSize: 15, fontFamily: 'Times New Roman', fontWeight: 'bold' },
  cardSubtitle: { fontSize: 12, fontFamily: 'Times New Roman', marginTop: 2 },
  discountPill: { backgroundColor: 'rgba(22,163,74,0.12)', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 },
  discountPillText: { fontSize: 11, fontFamily: 'Times New Roman', fontWeight: '700', color: '#16A34A' },

  colType: { minWidth: 120 },
  colApplies: { minWidth: 110 },
  colPeriod: { minWidth: 150 },
  colLabel: { fontSize: 10, fontFamily: 'Times New Roman', fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 3 },
  colValue: { fontSize: 13, fontFamily: 'Times New Roman' },

  statusPill: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 14 },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  statusPillText: { fontSize: 12, fontFamily: 'Times New Roman', fontWeight: '700' },

  actionsCol: { flexDirection: 'row', gap: 6 },
  iconButton: { width: 30, height: 30, borderRadius: 6, backgroundColor: 'rgba(124,58,237,0.1)', alignItems: 'center', justifyContent: 'center' },
});