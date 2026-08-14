import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Platform, Pressable, StyleSheet, Text, TextInput, View, Alert } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useQueryClient } from '@tanstack/react-query';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { KeyboardAwareScrollViewCompat } from '@/components/KeyboardAwareScrollViewCompat';
import { useColors } from '@/hooks/useColors';
import { useBusiness } from '@/contexts/BusinessContext';
// @ts-ignore
import {
  useCreatePromotion,
  useUpdatePromotion,
  useGetPromotion,
  getGetPromotionQueryKey,
  getListPromotionsQueryKey,
  useListProducts,
  getListProductsQueryKey,
  getListActivePromotionsQueryKey,
} from '@workspace/api-client-react';
import { PrimaryButton } from '@/components/PrimaryButton';

const FONT_FAMILY = Platform.OS === 'ios' ? 'Times New Roman' : 'serif';

const showAlert = (title: string, message: string, onOk?: () => void) => {
  if (Platform.OS === 'web') {
    // eslint-disable-next-line no-alert
    window.alert(`${title}\n\n${message}`);
    onOk?.();
  } else {
    Alert.alert(title, message, [{ text: 'OK', onPress: onOk }]);
  }
};

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

function DateField({ label, value, onChangeText }: { label: string; value: string; onChangeText: (v: string) => void }) {
  return (
    <View style={{ flex: 1 }}>
      <Text style={styles.rowLabel}>
        {label}
        <Text style={{ color: '#DC2626' }}> *</Text>
      </Text>
      <TextInput
        placeholder="YYYY-MM-DD"
        placeholderTextColor="#9CA3AF"
        value={value}
        onChangeText={onChangeText}
        style={styles.input}
      />
    </View>
  );
}

export default function AddPromotionScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { business } = useBusiness();
  const queryClient = useQueryClient();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const isEditMode = !!id;
  const promotionId = id ? Number(id) : undefined;

  const [name, setName] = useState('');
  const [promotionType, setPromotionType] = useState<'bogo' | 'percentage'>('bogo');
  const [applyTo, setApplyTo] = useState<'all' | 'selected'>('selected');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [status, setStatus] = useState<'active' | 'inactive'>('active');
  const [selectedProductIds, setSelectedProductIds] = useState<number[]>([]);
  const [selectedProductNames, setSelectedProductNames] = useState<Record<number, string>>({});
  const [productSearch, setProductSearch] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(!isEditMode);

  const { data: existingPromotion, isLoading: isLoadingPromotion } = useGetPromotion(promotionId as number, {
    query: { enabled: isEditMode && !!promotionId, queryKey: getGetPromotionQueryKey(promotionId as number) },
  });

  useEffect(() => {
    if (isEditMode && existingPromotion && !hydrated) {
      setName(existingPromotion.name ?? '');
      setPromotionType(existingPromotion.promotion_type);
      setApplyTo(existingPromotion.apply_to);
      setStartDate(existingPromotion.start_date ?? '');
      setEndDate(existingPromotion.end_date ?? '');
      setStatus(existingPromotion.status ?? 'active');
      const ids: number[] = existingPromotion.product_ids ?? [];
      const names: string[] = existingPromotion.product_names ?? [];
      setSelectedProductIds(ids);
      const nameMap: Record<number, string> = {};
      ids.forEach((pid, i) => { nameMap[pid] = names[i] ?? `Product #${pid}`; });
      setSelectedProductNames(nameMap);
      setHydrated(true);
    }
  }, [isEditMode, existingPromotion, hydrated]);

  // Percentage promotions are always All Products — force it whenever the
  // type is percentage, mirroring the server-side rule (spec §6).
  useEffect(() => {
    if (promotionType === 'percentage') setApplyTo('all');
  }, [promotionType]);

  const productSearchParams = { business_id: business?.id as number, search: productSearch.trim(), limit: 20 };
  const { data: productResults, isFetching: isSearchingProducts } = useListProducts(productSearchParams, {
    query: { enabled: !!business?.id && productSearch.trim().length > 0, queryKey: getListProductsQueryKey(productSearchParams) },
  });
  const foundProducts: any[] = productResults?.data ?? [];

  const toggleProduct = (p: any) => {
    setSelectedProductIds((prev) => {
      if (prev.includes(p.id)) return prev.filter((x) => x !== p.id);
      return [...prev, p.id];
    });
    setSelectedProductNames((prev) => ({ ...prev, [p.id]: p.name }));
  };

  const removeProduct = (pid: number) => {
    setSelectedProductIds((prev) => prev.filter((x) => x !== pid));
  };

  const createPromotion = useCreatePromotion();
  const updatePromotion = useUpdatePromotion();
  const isSaving = createPromotion.isPending || updatePromotion.isPending;

  const handleSave = () => {
    setError(null);

    if (name.trim().length < 2) { setError('Enter a promotion name'); return; }
    if (!DATE_RE.test(startDate)) { setError('Enter a valid start date (YYYY-MM-DD)'); return; }
    if (!DATE_RE.test(endDate)) { setError('Enter a valid end date (YYYY-MM-DD)'); return; }
    if (endDate < startDate) { setError('End date cannot be before start date'); return; }
    if (applyTo === 'selected' && selectedProductIds.length === 0) {
      setError('Select at least one product for this promotion');
      return;
    }
    if (!business?.id) { setError('No business selected.'); return; }

    const goBack = () => {
      showAlert('Success', isEditMode ? 'Promotion updated successfully' : 'Promotion created successfully', () => {
        router.replace('/promotions' as any);
      });
    };

    const invalidate = () => {
      if (business?.id) {
        queryClient.invalidateQueries({
          queryKey: getListPromotionsQueryKey({ business_id: business.id, limit: 200 } as any),
          exact: false,
        });
        queryClient.invalidateQueries({
          queryKey: getListActivePromotionsQueryKey({ business_id: business.id }),
          exact: false,
        });
      }
    };

    if (isEditMode && promotionId) {
      updatePromotion.mutate(
        {
          id: promotionId,
          data: {
            name: name.trim(),
            apply_to: applyTo,
            start_date: startDate,
            end_date: endDate,
            status,
            product_ids: applyTo === 'selected' ? selectedProductIds : [],
          },
        } as any,
        {
          onSuccess: () => { invalidate(); goBack(); },
          onError: (err: any) => setError(err?.message ?? 'Could not update promotion. Please try again.'),
        }
      );
      return;
    }

    createPromotion.mutate(
      {
        data: {
          business_id: business.id,
          name: name.trim(),
          promotion_type: promotionType,
          apply_to: applyTo,
          start_date: startDate,
          end_date: endDate,
          status,
          discount_percentage: promotionType === 'percentage' ? 10 : undefined,
          product_ids: applyTo === 'selected' ? selectedProductIds : undefined,
        },
      } as any,
      {
        onSuccess: () => { invalidate(); goBack(); },
        onError: (err: any) => setError(err?.message ?? 'Could not create promotion. Please try again.'),
      }
    );
  };

  if (isEditMode && isLoadingPromotion && !hydrated) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  return (
    <KeyboardAwareScrollViewCompat
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ padding: 20, paddingBottom: insets.bottom + 40, maxWidth: 640, width: '100%', alignSelf: 'center' }}
    >
      <Text style={[styles.title, { color: colors.foreground }]}>{isEditMode ? 'Edit Promotion' : 'Add Promotion'}</Text>

      {error ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}

      {/* Promotion Name */}
      <Text style={styles.rowLabel}>
        Promotion Name<Text style={{ color: '#DC2626' }}> *</Text>
      </Text>
      <TextInput
        placeholder="e.g. Buy 1 Get 1 Free - Shampoo"
        placeholderTextColor="#9CA3AF"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />

      {/* Promotion Type */}
      <Text style={[styles.rowLabel, { marginTop: 16 }]}>
        Promotion Type<Text style={{ color: '#DC2626' }}> *</Text>
      </Text>
      <View style={styles.segmentedControl}>
        <Pressable
          onPress={() => !isEditMode && setPromotionType('bogo')}
          style={[styles.segmentBtn, promotionType === 'bogo' && { backgroundColor: colors.primary }]}
        >
          <Feather name="gift" size={13} color={promotionType === 'bogo' ? '#fff' : colors.foreground} />
          <Text style={[styles.segmentText, promotionType === 'bogo' && { color: '#fff' }]}>Buy 1 Get 1 Free</Text>
        </Pressable>
        <Pressable
          onPress={() => !isEditMode && setPromotionType('percentage')}
          style={[styles.segmentBtn, promotionType === 'percentage' && { backgroundColor: colors.primary }]}
        >
          <Feather name="percent" size={13} color={promotionType === 'percentage' ? '#fff' : colors.foreground} />
          <Text style={[styles.segmentText, promotionType === 'percentage' && { color: '#fff' }]}>All Products 10% OFF</Text>
        </Pressable>
      </View>
      {isEditMode ? (
        <Text style={styles.hintText}>Promotion type can't be changed after creation.</Text>
      ) : null}

      {/* Apply To */}
      {promotionType === 'bogo' ? (
        <>
          <Text style={[styles.rowLabel, { marginTop: 16 }]}>Apply To</Text>
          <View style={styles.segmentedControl}>
            <Pressable
              onPress={() => setApplyTo('selected')}
              style={[styles.segmentBtn, applyTo === 'selected' && { backgroundColor: colors.primary }]}
            >
              <Text style={[styles.segmentText, applyTo === 'selected' && { color: '#fff' }]}>Selected Products</Text>
            </Pressable>
            <Pressable
              onPress={() => setApplyTo('all')}
              style={[styles.segmentBtn, applyTo === 'all' && { backgroundColor: colors.primary }]}
            >
              <Text style={[styles.segmentText, applyTo === 'all' && { color: '#fff' }]}>All Products</Text>
            </Pressable>
          </View>

          {applyTo === 'selected' ? (
            <View style={{ marginTop: 12 }}>
              <TextInput
                placeholder="Search product"
                placeholderTextColor="#9CA3AF"
                value={productSearch}
                onChangeText={setProductSearch}
                style={styles.input}
              />
              {isSearchingProducts ? (
                <ActivityIndicator size="small" color={colors.primary} style={{ marginTop: 8 }} />
              ) : productSearch.trim().length > 0 && foundProducts.length > 0 ? (
                <View style={[styles.resultsBox, { borderColor: colors.border }]}>
                  {foundProducts.map((p) => {
                    const checked = selectedProductIds.includes(p.id);
                    return (
                      <Pressable key={p.id} onPress={() => toggleProduct(p)} style={styles.resultRow}>
                        <Feather name={checked ? 'check-square' : 'square'} size={16} color={checked ? colors.primary : '#9CA3AF'} />
                        <Text style={[styles.resultText, { color: colors.foreground }]}>{p.name}</Text>
                      </Pressable>
                    );
                  })}
                </View>
              ) : null}

              <Text style={[styles.rowLabel, { marginTop: 14 }]}>
                Selected Products {selectedProductIds.length > 0 ? `(${selectedProductIds.length})` : ''}
              </Text>
              {selectedProductIds.length === 0 ? (
                <Text style={styles.hintText}>No products selected yet — search above to add.</Text>
              ) : (
                <View style={{ gap: 6, marginTop: 6 }}>
                  {selectedProductIds.map((pid) => (
                    <View key={pid} style={[styles.selectedChip, { borderColor: colors.border }]}>
                      <Feather name="check" size={13} color={colors.primary} />
                      <Text style={[styles.selectedChipText, { color: colors.foreground }]}>{selectedProductNames[pid] ?? `Product #${pid}`}</Text>
                      <Pressable onPress={() => removeProduct(pid)} hitSlop={8}>
                        <Feather name="x" size={14} color="#9CA3AF" />
                      </Pressable>
                    </View>
                  ))}
                </View>
              )}
            </View>
          ) : null}
        </>
      ) : (
        <>
          <Text style={[styles.rowLabel, { marginTop: 16 }]}>Apply To</Text>
          <View style={[styles.lockedField, { borderColor: colors.border }]}>
            <Text style={{ fontFamily: FONT_FAMILY, color: colors.foreground }}>All Products</Text>
          </View>

          <Text style={[styles.rowLabel, { marginTop: 16 }]}>Discount</Text>
          <View style={[styles.lockedField, { borderColor: colors.border }]}>
            <Text style={{ fontFamily: FONT_FAMILY, color: colors.foreground }}>10%</Text>
          </View>
        </>
      )}

      {/* Dates */}
      <View style={{ flexDirection: 'row', gap: 12, marginTop: 16 }}>
        <DateField label="Start Date" value={startDate} onChangeText={setStartDate} />
        <DateField label="End Date" value={endDate} onChangeText={setEndDate} />
      </View>

      {/* Status */}
      <Text style={[styles.rowLabel, { marginTop: 16 }]}>Status</Text>
      <View style={styles.segmentedControl}>
        <Pressable onPress={() => setStatus('active')} style={[styles.segmentBtn, status === 'active' && { backgroundColor: '#16A34A' }]}>
          <Text style={[styles.segmentText, status === 'active' && { color: '#fff' }]}>Active</Text>
        </Pressable>
        <Pressable onPress={() => setStatus('inactive')} style={[styles.segmentBtn, status === 'inactive' && { backgroundColor: '#6B7280' }]}>
          <Text style={[styles.segmentText, status === 'inactive' && { color: '#fff' }]}>Inactive</Text>
        </Pressable>
      </View>

      {/* Footer */}
      <View style={{ flexDirection: 'row', gap: 12, marginTop: 28 }}>
        <PrimaryButton label={isEditMode ? 'Update Promotion' : 'Save Promotion'} onPress={handleSave} loading={isSaving} style={{ backgroundColor: colors.primary, flex: 1 }} />
        <Pressable onPress={() => router.back()} style={[styles.cancelBtn, { borderColor: colors.border }]}>
          <Text style={{ fontFamily: FONT_FAMILY, color: colors.foreground, fontWeight: '600' }}>Cancel</Text>
        </Pressable>
      </View>
    </KeyboardAwareScrollViewCompat>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 22, fontFamily: FONT_FAMILY, fontWeight: 'bold', marginBottom: 16 },
  rowLabel: { fontSize: 13, fontWeight: '500', color: '#374151', marginBottom: 6, fontFamily: FONT_FAMILY },
  hintText: { fontSize: 12, color: '#9CA3AF', fontFamily: FONT_FAMILY, marginTop: 6 },
  input: {
    borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 10,
    fontSize: 14, fontFamily: FONT_FAMILY, color: '#1F2937',
  },
  segmentedControl: { flexDirection: 'row', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 8, overflow: 'hidden' },
  segmentBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 10, paddingHorizontal: 8 },
  segmentText: { fontSize: 12.5, fontWeight: '600', fontFamily: FONT_FAMILY },
  lockedField: { borderWidth: 1, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 10, backgroundColor: '#F9FAFB' },
  resultsBox: { borderWidth: 1, borderRadius: 8, marginTop: 8, maxHeight: 200, overflow: 'hidden' },
  resultRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 12, paddingVertical: 10 },
  resultText: { fontSize: 13, fontFamily: FONT_FAMILY },
  selectedChip: { flexDirection: 'row', alignItems: 'center', gap: 8, borderWidth: 1, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 8 },
  selectedChipText: { flex: 1, fontSize: 13, fontFamily: FONT_FAMILY },
  cancelBtn: { paddingHorizontal: 24, borderWidth: 1, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  errorBox: { backgroundColor: '#FEE2E2', borderRadius: 8, padding: 10, marginBottom: 12, borderLeftWidth: 4, borderLeftColor: '#DC2626' },
  errorText: { fontSize: 13, fontWeight: '500', color: '#991B1B', fontFamily: FONT_FAMILY },
});