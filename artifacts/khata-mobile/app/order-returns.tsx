// artifacts/khata-mobile/app/order-returns.tsx
//
// Admin screen: customer return requests (online orders).
// Admin sees the customer's photo/video evidence, then approves or rejects
// (reject needs a note), and sends a replacement once approved.

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  ActivityIndicator,
  TextInput,
  Image,
  Linking,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useColors } from '@/hooks/useColors';
import { useBusiness } from '@/contexts/BusinessContext';
// @ts-ignore
import {
  useListOrderReturns,
  useUpdateOrderReturnStatus,
  useSendOrderReturnReplacement,
  getListOrderReturnsQueryKey,
} from '@workspace/api-client-react';

const FILTERS = [
  { key: 'ALL', label: 'All' },
  { key: 'REQUESTED', label: 'Pending' },
  { key: 'APPROVED', label: 'Approved' },
  { key: 'REPLACEMENT_SENT', label: 'Replaced' },
  { key: 'REJECTED', label: 'Rejected' },
] as const;

const STATUS_META: Record<string, { label: string; color: string }> = {
  REQUESTED: { label: 'Pending review', color: '#F59E0B' },
  APPROVED: { label: 'Approved', color: '#16A34A' },
  REJECTED: { label: 'Rejected', color: '#DC2626' },
  REPLACEMENT_SENT: { label: 'Replacement sent', color: '#2563EB' },
};

const REASON_LABEL: Record<string, string> = {
  EXPIRED_PRODUCT: 'Expired product',
  WRONG_PRODUCT: 'Wrong product delivered',
  DAMAGED: 'Damaged product',
  MISSING_ITEM: 'Item missing',
  OTHER: 'Other',
};

function timeAgo(dateStr: string): string {
  const mins = Math.floor((Date.now() - new Date(dateStr).getTime()) / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins} mins ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function errorMessage(e: any, fallback: string): string {
  return e?.response?.data?.error ?? e?.data?.error ?? e?.message ?? fallback;
}

function openUrl(url: string) {
  Linking.openURL(url).catch(() => {});
}

// ─────────────────────────────────────────────────────────────────────────
// One return request card
// ─────────────────────────────────────────────────────────────────────────
function ReturnCard({ item, onChanged }: { item: any; onChanged: () => Promise<unknown> | void }) {
  const colors = useColors();
  const [expanded, setExpanded] = useState(item.status === 'REQUESTED');
  const [note, setNote] = useState('');
  const [rejecting, setRejecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateStatus = useUpdateOrderReturnStatus();
  const sendReplacement = useSendOrderReturnReplacement();
  const busy = updateStatus.isPending || sendReplacement.isPending;

  const meta = STATUS_META[item.status] ?? { label: item.status, color: colors.mutedForeground };
  const photos = (item.media ?? []).filter((m: any) => m.type === 'photo');
  const videos = (item.media ?? []).filter((m: any) => m.type === 'video');

  const approve = async () => {
    setError(null);
    try {
      await updateStatus.mutateAsync({
        id: item.id,
        data: { status: 'APPROVED', admin_note: note.trim() || undefined },
      } as any);
      await onChanged();
    } catch (e) {
      setError(errorMessage(e, 'Could not approve. Try again.'));
    }
  };

  const reject = async () => {
    if (!note.trim()) {
      setError('Add a note so the customer knows why it was rejected.');
      return;
    }
    setError(null);
    try {
      await updateStatus.mutateAsync({
        id: item.id,
        data: { status: 'REJECTED', admin_note: note.trim() },
      } as any);
      setRejecting(false);
      await onChanged();
    } catch (e) {
      setError(errorMessage(e, 'Could not reject. Try again.'));
    }
  };

  const replace = async () => {
    setError(null);
    try {
      await sendReplacement.mutateAsync({ id: item.id } as any);
      await onChanged();
    } catch (e) {
      setError(errorMessage(e, 'Could not send replacement. Try again.'));
    }
  };

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <Pressable onPress={() => setExpanded((v) => !v)} style={styles.cardHead}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.productName, { color: colors.foreground }]} numberOfLines={1}>
            {item.product_name} × {item.qty}
          </Text>
          <Text style={[styles.sub, { color: colors.mutedForeground }]} numberOfLines={1}>
            Order #{item.sales_order_id} • {item.customer_name} • {timeAgo(item.created_at)}
          </Text>
        </View>
        <View style={[styles.pill, { backgroundColor: meta.color + '18' }]}>
          <Text style={[styles.pillText, { color: meta.color }]}>{meta.label}</Text>
        </View>
        <Feather name={expanded ? 'chevron-up' : 'chevron-down'} size={18} color={colors.mutedForeground} />
      </Pressable>

      {expanded && (
        <View style={[styles.body, { borderTopColor: colors.border }]}>
          <Text style={[styles.label, { color: colors.mutedForeground }]}>Reason</Text>
          <Text style={[styles.value, { color: colors.foreground }]}>
            {REASON_LABEL[item.reason] ?? item.reason}
          </Text>
          {!!item.description && (
            <Text style={[styles.desc, { color: colors.foreground }]}>{item.description}</Text>
          )}

          {item.customer_phone ? (
            <Pressable onPress={() => openUrl(`tel:${item.customer_phone}`)} style={styles.phoneRow}>
              <Feather name="phone" size={13} color={colors.primary} />
              <Text style={[styles.phoneText, { color: colors.primary }]}>{item.customer_phone}</Text>
            </Pressable>
          ) : null}

          <Text style={[styles.label, { color: colors.mutedForeground, marginTop: 14 }]}>
            Evidence ({photos.length} photo{photos.length === 1 ? '' : 's'}, {videos.length} video
            {videos.length === 1 ? '' : 's'})
          </Text>
          <View style={styles.mediaRow}>
            {photos.map((m: any) => (
              <Pressable key={m.id} onPress={() => openUrl(m.url)}>
                <Image source={{ uri: m.url }} style={[styles.thumb, { backgroundColor: colors.border }]} />
              </Pressable>
            ))}
            {videos.map((m: any) => (
              <Pressable
                key={m.id}
                onPress={() => openUrl(m.url)}
                style={[styles.thumb, styles.videoThumb, { backgroundColor: '#0F172A' }]}
              >
                <Feather name="play-circle" size={28} color="#fff" />
                <Text style={styles.videoText}>Video</Text>
              </Pressable>
            ))}
          </View>

          {!!item.admin_note && item.status !== 'REQUESTED' && (
            <View style={[styles.noteBox, { backgroundColor: colors.background, borderColor: colors.border }]}>
              <Text style={[styles.label, { color: colors.mutedForeground }]}>Admin note</Text>
              <Text style={[styles.value, { color: colors.foreground }]}>{item.admin_note}</Text>
            </View>
          )}

          {item.status === 'REQUESTED' && (
            <>
              <TextInput
                value={note}
                onChangeText={(t) => {
                  setNote(t);
                  setError(null);
                }}
                placeholder={rejecting ? 'Reason for rejecting (required)' : 'Note for customer (optional)'}
                placeholderTextColor={colors.mutedForeground}
                multiline
                style={[
                  styles.noteInput,
                  { color: colors.foreground, borderColor: colors.border, backgroundColor: colors.background },
                ]}
              />
              <View style={styles.actions}>
                {rejecting ? (
                  <>
                    <Pressable
                      onPress={() => {
                        setRejecting(false);
                        setError(null);
                      }}
                      disabled={busy}
                      style={[styles.btn, { borderColor: colors.border, borderWidth: 1 }]}
                    >
                      <Text style={[styles.btnText, { color: colors.foreground }]}>Cancel</Text>
                    </Pressable>
                    <Pressable
                      onPress={reject}
                      disabled={busy}
                      style={[styles.btn, { backgroundColor: '#DC2626', opacity: busy ? 0.6 : 1 }]}
                    >
                      {busy ? <ActivityIndicator color="#fff" size="small" /> : <Text style={styles.btnTextLight}>Confirm Reject</Text>}
                    </Pressable>
                  </>
                ) : (
                  <>
                    <Pressable
                      onPress={() => setRejecting(true)}
                      disabled={busy}
                      style={[styles.btn, { borderColor: '#DC2626', borderWidth: 1 }]}
                    >
                      <Text style={[styles.btnText, { color: '#DC2626' }]}>Reject</Text>
                    </Pressable>
                    <Pressable
                      onPress={approve}
                      disabled={busy}
                      style={[styles.btn, { backgroundColor: '#16A34A', opacity: busy ? 0.6 : 1 }]}
                    >
                      {busy ? <ActivityIndicator color="#fff" size="small" /> : <Text style={styles.btnTextLight}>Approve</Text>}
                    </Pressable>
                  </>
                )}
              </View>
            </>
          )}

          {item.status === 'APPROVED' && (
            <Pressable
              onPress={replace}
              disabled={busy}
              style={[styles.btn, { backgroundColor: colors.primary, marginTop: 14, opacity: busy ? 0.6 : 1 }]}
            >
              {busy ? (
                <ActivityIndicator color={colors.primaryForeground} size="small" />
              ) : (
                <Text style={[styles.btnText, { color: colors.primaryForeground }]}>Send Replacement</Text>
              )}
            </Pressable>
          )}

          {item.status === 'REPLACEMENT_SENT' && (
            <Text style={[styles.sub, { color: colors.mutedForeground, marginTop: 12 }]}>
              Replacement delivery #{item.replacement_delivery_id} created. Assign a driver from Deliveries.
            </Text>
          )}

          {!!error && <Text style={styles.errorText}>{error}</Text>}
        </View>
      )}
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Screen
// ─────────────────────────────────────────────────────────────────────────
export default function OrderReturnsScreen() {
  const colors = useColors();
  const { business } = useBusiness();
  const [filter, setFilter] = useState<(typeof FILTERS)[number]['key']>('ALL');

  const params = {
    business_id: business?.id as number,
    ...(filter !== 'ALL' ? { status: filter } : {}),
  } as any;

  const { data, isLoading, refetch } = useListOrderReturns(params, {
    query: {
      enabled: !!business?.id,
      queryKey: getListOrderReturnsQueryKey(params),
      refetchInterval: 30000,
    },
  });

  const rows: any[] = (data as any)?.data ?? [];

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Pressable
          onPress={() => (router.canGoBack() ? router.back() : router.replace('/' as any))}
          hitSlop={8}
          style={[styles.backBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
        >
          <Feather name="arrow-left" size={18} color={colors.foreground} />
        </Pressable>
        <Text style={[styles.title, { color: colors.foreground }]}>Return Requests</Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterBar} contentContainerStyle={{ gap: 8 }}>
        {FILTERS.map((f) => {
          const active = f.key === filter;
          return (
            <Pressable
              key={f.key}
              onPress={() => setFilter(f.key)}
              style={[
                styles.chip,
                { borderColor: active ? colors.primary : colors.border, backgroundColor: active ? colors.primary : colors.card },
              ]}
            >
              <Text style={[styles.chipText, { color: active ? colors.primaryForeground : colors.foreground }]}>
                {f.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
        {isLoading ? (
          <ActivityIndicator style={{ paddingVertical: 40 }} color={colors.primary} />
        ) : rows.length === 0 ? (
          <View style={styles.empty}>
            <Feather name="corner-up-left" size={30} color={colors.mutedForeground} />
            <Text style={[styles.emptyTitle, { color: colors.foreground }]}>No return requests</Text>
            <Text style={[styles.sub, { color: colors.mutedForeground }]}>
              Customer returns from delivered orders will show up here.
            </Text>
          </View>
        ) : (
          rows.map((item) => <ReturnCard key={item.id} item={item} onChanged={() => refetch()} />)
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, padding: 16 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 14 },
  backBtn: { width: 36, height: 36, borderRadius: 18, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 20, fontFamily: 'Inter_700Bold' },
  filterBar: { flexGrow: 0, marginBottom: 14 },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 18, borderWidth: 1 },
  chipText: { fontSize: 12.5, fontFamily: 'Inter_600SemiBold' },
  list: { gap: 12, paddingBottom: 40 },

  card: { borderWidth: 1, borderRadius: 14, overflow: 'hidden' },
  cardHead: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 14 },
  productName: { fontSize: 14, fontFamily: 'Inter_700Bold' },
  sub: { fontSize: 11.5, fontFamily: 'Inter_500Medium', marginTop: 2 },
  pill: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  pillText: { fontSize: 11, fontFamily: 'Inter_600SemiBold' },

  body: { borderTopWidth: 1, padding: 14 },
  label: { fontSize: 11, fontFamily: 'Inter_500Medium', marginBottom: 3 },
  value: { fontSize: 13.5, fontFamily: 'Inter_600SemiBold' },
  desc: { fontSize: 12.5, fontFamily: 'Inter_500Medium', marginTop: 6, lineHeight: 18 },
  phoneRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 10 },
  phoneText: { fontSize: 12.5, fontFamily: 'Inter_600SemiBold' },

  mediaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 4 },
  thumb: { width: 96, height: 96, borderRadius: 10 },
  videoThumb: { alignItems: 'center', justifyContent: 'center', gap: 4 },
  videoText: { color: '#fff', fontSize: 11, fontFamily: 'Inter_600SemiBold' },

  noteBox: { borderWidth: 1, borderRadius: 10, padding: 10, marginTop: 14 },
  noteInput: {
    borderWidth: 1, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10,
    fontSize: 13, fontFamily: 'Inter_500Medium', marginTop: 14, minHeight: 64, textAlignVertical: 'top',
  },
  actions: { flexDirection: 'row', gap: 10, marginTop: 12 },
  btn: { flex: 1, borderRadius: 10, paddingVertical: 12, alignItems: 'center', justifyContent: 'center' },
  btnText: { fontSize: 13.5, fontFamily: 'Inter_700Bold' },
  btnTextLight: { fontSize: 13.5, fontFamily: 'Inter_700Bold', color: '#fff' },
  errorText: { color: '#DC2626', fontSize: 12, fontFamily: 'Inter_500Medium', marginTop: 10 },

  empty: { alignItems: 'center', paddingVertical: 60, gap: 8 },
  emptyTitle: { fontSize: 14, fontFamily: 'Inter_700Bold' },
});