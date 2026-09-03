
// import React, { useEffect, useState } from 'react';
// import { ActivityIndicator, Platform, Pressable, StyleSheet, Text, TextInput, View, Alert } from 'react-native';
// import { router, useLocalSearchParams } from 'expo-router';
// import { Feather } from '@expo/vector-icons';
// import { useQueryClient } from '@tanstack/react-query';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import { KeyboardAwareScrollViewCompat } from '@/components/KeyboardAwareScrollViewCompat';
// import { useColors } from '@/hooks/useColors';
// import { useBusiness } from '@/contexts/BusinessContext';
// // @ts-ignore
// import {
//   useCreatePromotion,
//   useUpdatePromotion,
//   useGetPromotion,
//   getGetPromotionQueryKey,
//   getListPromotionsQueryKey,
//   useListProducts,
//   getListProductsQueryKey,
//   getListActivePromotionsQueryKey,
// } from '@workspace/api-client-react';
// import { PrimaryButton } from '@/components/PrimaryButton';

// const FONT_FAMILY = Platform.OS === 'ios' ? 'Times New Roman' : 'serif';

// const showAlert = (title: string, message: string, onOk?: () => void) => {
//   if (Platform.OS === 'web') {
//     // eslint-disable-next-line no-alert
//     window.alert(`${title}\n\n${message}`);
//     onOk?.();
//   } else {
//     Alert.alert(title, message, [{ text: 'OK', onPress: onOk }]);
//   }
// };

// const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

// function DateField({ label, value, onChangeText }: { label: string; value: string; onChangeText: (v: string) => void }) {
//   return (
//     <View style={{ flex: 1 }}>
//       <Text style={styles.rowLabel}>
//         {label}
//         <Text style={{ color: '#DC2626' }}> *</Text>
//       </Text>
//       <TextInput
//         placeholder="YYYY-MM-DD"
//         placeholderTextColor="#9CA3AF"
//         value={value}
//         onChangeText={onChangeText}
//         style={styles.input}
//       />
//     </View>
//   );
// }

// export default function AddPromotionScreen() {
//   const colors = useColors();
//   const insets = useSafeAreaInsets();
//   const { business } = useBusiness();
//   const queryClient = useQueryClient();
//   const { id } = useLocalSearchParams<{ id?: string }>();
//   const isEditMode = !!id;
//   const promotionId = id ? Number(id) : undefined;

//   const [name, setName] = useState('');
//   const [promotionType, setPromotionType] = useState<'bogo' | 'percentage'>('bogo');
//   const [applyTo, setApplyTo] = useState<'all' | 'selected'>('selected');
//   const [startDate, setStartDate] = useState('');
//   const [endDate, setEndDate] = useState('');
//   const [status, setStatus] = useState<'active' | 'inactive'>('active');
//   const [selectedProductIds, setSelectedProductIds] = useState<number[]>([]);
//   const [selectedProductNames, setSelectedProductNames] = useState<Record<number, string>>({});
//   const [productSearch, setProductSearch] = useState('');
//   const [error, setError] = useState<string | null>(null);
//   const [hydrated, setHydrated] = useState(!isEditMode);

//   // ── New optional promotion detail fields ──────────────────────────────────
//   const [description, setDescription] = useState('');
//   const [promoCode, setPromoCode] = useState('');
//   const [minOrderAmount, setMinOrderAmount] = useState('');
//   const [bannerImage, setBannerImage] = useState('');

//   const { data: existingPromotion, isLoading: isLoadingPromotion } = useGetPromotion(promotionId as number, {
//     query: { enabled: isEditMode && !!promotionId, queryKey: getGetPromotionQueryKey(promotionId as number) },
//   });

//   useEffect(() => {
//     if (isEditMode && existingPromotion && !hydrated) {
//       setName(existingPromotion.name ?? '');
//       setPromotionType(existingPromotion.promotion_type);
//       setApplyTo(existingPromotion.apply_to);
//       setStartDate(existingPromotion.start_date ?? '');
//       setEndDate(existingPromotion.end_date ?? '');
//       setStatus(existingPromotion.status ?? 'active');
//       const ids: number[] = existingPromotion.product_ids ?? [];
//       const names: string[] = existingPromotion.product_names ?? [];
//       setSelectedProductIds(ids);
//       const nameMap: Record<number, string> = {};
//       ids.forEach((pid, i) => { nameMap[pid] = names[i] ?? `Product #${pid}`; });
//       setSelectedProductNames(nameMap);

//       // ── Hydrate new optional fields ──────────────────────────────────────
//       setDescription(existingPromotion.description ?? '');
//       setPromoCode(existingPromotion.promo_code ?? '');
//       setMinOrderAmount(
//         existingPromotion.min_order_amount != null ? String(existingPromotion.min_order_amount) : ''
//       );
//       setBannerImage(existingPromotion.banner_image ?? '');

//       setHydrated(true);
//     }
//   }, [isEditMode, existingPromotion, hydrated]);

//   // Percentage promotions are always All Products — force it whenever the
//   // type is percentage, mirroring the server-side rule (spec §6).
//   useEffect(() => {
//     if (promotionType === 'percentage') setApplyTo('all');
//   }, [promotionType]);

//   const productSearchParams = { business_id: business?.id as number, search: productSearch.trim(), limit: 20 };
//   const { data: productResults, isFetching: isSearchingProducts } = useListProducts(productSearchParams, {
//     query: { enabled: !!business?.id && productSearch.trim().length > 0, queryKey: getListProductsQueryKey(productSearchParams) },
//   });
//   const foundProducts: any[] = productResults?.data ?? [];

//   const toggleProduct = (p: any) => {
//     setSelectedProductIds((prev) => {
//       if (prev.includes(p.id)) return prev.filter((x) => x !== p.id);
//       return [...prev, p.id];
//     });
//     setSelectedProductNames((prev) => ({ ...prev, [p.id]: p.name }));
//   };

//   const removeProduct = (pid: number) => {
//     setSelectedProductIds((prev) => prev.filter((x) => x !== pid));
//   };

//   const createPromotion = useCreatePromotion();
//   const updatePromotion = useUpdatePromotion();
//   const isSaving = createPromotion.isPending || updatePromotion.isPending;

//   const handleSave = () => {
//     setError(null);

//     if (name.trim().length < 2) { setError('Enter a promotion name'); return; }
//     if (!DATE_RE.test(startDate)) { setError('Enter a valid start date (YYYY-MM-DD)'); return; }
//     if (!DATE_RE.test(endDate)) { setError('Enter a valid end date (YYYY-MM-DD)'); return; }
//     if (endDate < startDate) { setError('End date cannot be before start date'); return; }
//     if (applyTo === 'selected' && selectedProductIds.length === 0) {
//       setError('Select at least one product for this promotion');
//       return;
//     }
//     if (minOrderAmount.trim() && Number.isNaN(parseFloat(minOrderAmount))) {
//       setError('Enter a valid minimum order amount');
//       return;
//     }
//     if (!business?.id) { setError('No business selected.'); return; }

//     const goBack = () => {
//       showAlert('Success', isEditMode ? 'Promotion updated successfully' : 'Promotion created successfully', () => {
//         router.replace('/promotions' as any);
//       });
//     };

//     const invalidate = () => {
//       if (business?.id) {
//         queryClient.invalidateQueries({
//           queryKey: getListPromotionsQueryKey({ business_id: business.id, limit: 200 } as any),
//           exact: false,
//         });
//         queryClient.invalidateQueries({
//           queryKey: getListActivePromotionsQueryKey({ business_id: business.id }),
//           exact: false,
//         });
//       }
//     };

//     if (isEditMode && promotionId) {
//       updatePromotion.mutate(
//         {
//           id: promotionId,
//           data: {
//             name: name.trim(),
//             apply_to: applyTo,
//             start_date: startDate,
//             end_date: endDate,
//             status,
//             description: description.trim() || undefined,
//             promo_code: promoCode.trim() || undefined,
//             min_order_amount: minOrderAmount.trim() ? parseFloat(minOrderAmount) : undefined,
//             banner_image: bannerImage.trim() || undefined,
//             product_ids: applyTo === 'selected' ? selectedProductIds : [],
//           },
//         } as any,
//         {
//           onSuccess: () => { invalidate(); goBack(); },
//           onError: (err: any) => setError(err?.message ?? 'Could not update promotion. Please try again.'),
//         }
//       );
//       return;
//     }

//     createPromotion.mutate(
//       {
//         data: {
//           business_id: business.id,
//           name: name.trim(),
//           promotion_type: promotionType,
//           apply_to: applyTo,
//           start_date: startDate,
//           end_date: endDate,
//           status,
//           discount_percentage: promotionType === 'percentage' ? 10 : undefined,
//           description: description.trim() || undefined,
//           promo_code: promoCode.trim() || undefined,
//           min_order_amount: minOrderAmount.trim() ? parseFloat(minOrderAmount) : undefined,
//           banner_image: bannerImage.trim() || undefined,
//           product_ids: applyTo === 'selected' ? selectedProductIds : undefined,
//         },
//       } as any,
//       {
//         onSuccess: () => { invalidate(); goBack(); },
//         onError: (err: any) => setError(err?.message ?? 'Could not create promotion. Please try again.'),
//       }
//     );
//   };

//   if (isEditMode && isLoadingPromotion && !hydrated) {
//     return (
//       <View style={{ flex: 1, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center' }}>
//         <ActivityIndicator color={colors.primary} />
//       </View>
//     );
//   }

//   return (
//     <KeyboardAwareScrollViewCompat
//       style={{ flex: 1, backgroundColor: colors.background }}
//       contentContainerStyle={{ padding: 20, paddingBottom: insets.bottom + 40, maxWidth: 640, width: '100%', alignSelf: 'center' }}
//     >
//       <Text style={[styles.title, { color: colors.foreground }]}>{isEditMode ? 'Edit Promotion' : 'Add Promotion'}</Text>

//       {error ? (
//         <View style={styles.errorBox}>
//           <Text style={styles.errorText}>{error}</Text>
//         </View>
//       ) : null}

//       {/* Promotion Name */}
//       <Text style={styles.rowLabel}>
//         Promotion Name<Text style={{ color: '#DC2626' }}> *</Text>
//       </Text>
//       <TextInput
//         placeholder="e.g. Buy 1 Get 1 Free - Shampoo"
//         placeholderTextColor="#9CA3AF"
//         value={name}
//         onChangeText={setName}
//         style={styles.input}
//       />

//       {/* Promotion Type */}
//       <Text style={[styles.rowLabel, { marginTop: 16 }]}>
//         Promotion Type<Text style={{ color: '#DC2626' }}> *</Text>
//       </Text>
//       <View style={styles.segmentedControl}>
//         <Pressable
//           onPress={() => !isEditMode && setPromotionType('bogo')}
//           style={[styles.segmentBtn, promotionType === 'bogo' && { backgroundColor: colors.primary }]}
//         >
//           <Feather name="gift" size={13} color={promotionType === 'bogo' ? '#fff' : colors.foreground} />
//           <Text style={[styles.segmentText, promotionType === 'bogo' && { color: '#fff' }]}>Buy 1 Get 1 Free</Text>
//         </Pressable>
//         <Pressable
//           onPress={() => !isEditMode && setPromotionType('percentage')}
//           style={[styles.segmentBtn, promotionType === 'percentage' && { backgroundColor: colors.primary }]}
//         >
//           <Feather name="percent" size={13} color={promotionType === 'percentage' ? '#fff' : colors.foreground} />
//           <Text style={[styles.segmentText, promotionType === 'percentage' && { color: '#fff' }]}>All Products 10% OFF</Text>
//         </Pressable>
//       </View>
//       {isEditMode ? (
//         <Text style={styles.hintText}>Promotion type can't be changed after creation.</Text>
//       ) : null}

//       {/* Apply To */}
//       {promotionType === 'bogo' ? (
//         <>
//           <Text style={[styles.rowLabel, { marginTop: 16 }]}>Apply To</Text>
//           <View style={styles.segmentedControl}>
//             <Pressable
//               onPress={() => setApplyTo('selected')}
//               style={[styles.segmentBtn, applyTo === 'selected' && { backgroundColor: colors.primary }]}
//             >
//               <Text style={[styles.segmentText, applyTo === 'selected' && { color: '#fff' }]}>Selected Products</Text>
//             </Pressable>
//             <Pressable
//               onPress={() => setApplyTo('all')}
//               style={[styles.segmentBtn, applyTo === 'all' && { backgroundColor: colors.primary }]}
//             >
//               <Text style={[styles.segmentText, applyTo === 'all' && { color: '#fff' }]}>All Products</Text>
//             </Pressable>
//           </View>

//           {applyTo === 'selected' ? (
//             <View style={{ marginTop: 12 }}>
//               <TextInput
//                 placeholder="Search product"
//                 placeholderTextColor="#9CA3AF"
//                 value={productSearch}
//                 onChangeText={setProductSearch}
//                 style={styles.input}
//               />
//               {isSearchingProducts ? (
//                 <ActivityIndicator size="small" color={colors.primary} style={{ marginTop: 8 }} />
//               ) : productSearch.trim().length > 0 && foundProducts.length > 0 ? (
//                 <View style={[styles.resultsBox, { borderColor: colors.border }]}>
//                   {foundProducts.map((p) => {
//                     const checked = selectedProductIds.includes(p.id);
//                     return (
//                       <Pressable key={p.id} onPress={() => toggleProduct(p)} style={styles.resultRow}>
//                         <Feather name={checked ? 'check-square' : 'square'} size={16} color={checked ? colors.primary : '#9CA3AF'} />
//                         <Text style={[styles.resultText, { color: colors.foreground }]}>{p.name}</Text>
//                       </Pressable>
//                     );
//                   })}
//                 </View>
//               ) : null}

//               <Text style={[styles.rowLabel, { marginTop: 14 }]}>
//                 Selected Products {selectedProductIds.length > 0 ? `(${selectedProductIds.length})` : ''}
//               </Text>
//               {selectedProductIds.length === 0 ? (
//                 <Text style={styles.hintText}>No products selected yet — search above to add.</Text>
//               ) : (
//                 <View style={{ gap: 6, marginTop: 6 }}>
//                   {selectedProductIds.map((pid) => (
//                     <View key={pid} style={[styles.selectedChip, { borderColor: colors.border }]}>
//                       <Feather name="check" size={13} color={colors.primary} />
//                       <Text style={[styles.selectedChipText, { color: colors.foreground }]}>{selectedProductNames[pid] ?? `Product #${pid}`}</Text>
//                       <Pressable onPress={() => removeProduct(pid)} hitSlop={8}>
//                         <Feather name="x" size={14} color="#9CA3AF" />
//                       </Pressable>
//                     </View>
//                   ))}
//                 </View>
//               )}
//             </View>
//           ) : null}
//         </>
//       ) : (
//         <>
//           <Text style={[styles.rowLabel, { marginTop: 16 }]}>Apply To</Text>
//           <View style={[styles.lockedField, { borderColor: colors.border }]}>
//             <Text style={{ fontFamily: FONT_FAMILY, color: colors.foreground }}>All Products</Text>
//           </View>

//           <Text style={[styles.rowLabel, { marginTop: 16 }]}>Discount</Text>
//           <View style={[styles.lockedField, { borderColor: colors.border }]}>
//             <Text style={{ fontFamily: FONT_FAMILY, color: colors.foreground }}>10%</Text>
//           </View>
//         </>
//       )}

//       {/* Description */}
//       <Text style={[styles.rowLabel, { marginTop: 16 }]}>Description</Text>
//       <TextInput
//         placeholder="e.g. Get 10% off on all shampoo products"
//         placeholderTextColor="#9CA3AF"
//         value={description}
//         onChangeText={setDescription}
//         style={[styles.input, { minHeight: 70, textAlignVertical: 'top' }]}
//         multiline
//       />

//       {/* Promo Code */}
//       <Text style={[styles.rowLabel, { marginTop: 16 }]}>Promo Code</Text>
//       <TextInput
//         placeholder="e.g. SHAMP10"
//         placeholderTextColor="#9CA3AF"
//         value={promoCode}
//         onChangeText={(v) => setPromoCode(v.toUpperCase())}
//         autoCapitalize="characters"
//         style={styles.input}
//       />

//       {/* Min Order Amount */}
//       <Text style={[styles.rowLabel, { marginTop: 16 }]}>Min Order Amount</Text>
//       <TextInput
//         placeholder="e.g. 500"
//         placeholderTextColor="#9CA3AF"
//         value={minOrderAmount}
//         onChangeText={(v) => setMinOrderAmount(v.replace(/[^0-9.]/g, ''))}
//         keyboardType="numeric"
//         style={styles.input}
//       />

//       {/* Banner Image URL */}
//       <Text style={[styles.rowLabel, { marginTop: 16 }]}>Banner Image URL</Text>
//       <TextInput
//         placeholder="https://..."
//         placeholderTextColor="#9CA3AF"
//         value={bannerImage}
//         onChangeText={setBannerImage}
//         autoCapitalize="none"
//         style={styles.input}
//       />

//       {/* Dates */}
//       <View style={{ flexDirection: 'row', gap: 12, marginTop: 16 }}>
//         <DateField label="Start Date" value={startDate} onChangeText={setStartDate} />
//         <DateField label="End Date" value={endDate} onChangeText={setEndDate} />
//       </View>

//       {/* Status */}
//       <Text style={[styles.rowLabel, { marginTop: 16 }]}>Status</Text>
//       <View style={styles.segmentedControl}>
//         <Pressable onPress={() => setStatus('active')} style={[styles.segmentBtn, status === 'active' && { backgroundColor: '#16A34A' }]}>
//           <Text style={[styles.segmentText, status === 'active' && { color: '#fff' }]}>Active</Text>
//         </Pressable>
//         <Pressable onPress={() => setStatus('inactive')} style={[styles.segmentBtn, status === 'inactive' && { backgroundColor: '#6B7280' }]}>
//           <Text style={[styles.segmentText, status === 'inactive' && { color: '#fff' }]}>Inactive</Text>
//         </Pressable>
//       </View>

//       {/* Footer */}
//       <View style={{ flexDirection: 'row', gap: 12, marginTop: 28 }}>
//         <PrimaryButton label={isEditMode ? 'Update Promotion' : 'Save Promotion'} onPress={handleSave} loading={isSaving} style={{ backgroundColor: colors.primary, flex: 1 }} />
//         <Pressable onPress={() => router.back()} style={[styles.cancelBtn, { borderColor: colors.border }]}>
//           <Text style={{ fontFamily: FONT_FAMILY, color: colors.foreground, fontWeight: '600' }}>Cancel</Text>
//         </Pressable>
//       </View>
//     </KeyboardAwareScrollViewCompat>
//   );
// }

// const styles = StyleSheet.create({
//   title: { fontSize: 22, fontFamily: FONT_FAMILY, fontWeight: 'bold', marginBottom: 16 },
//   rowLabel: { fontSize: 13, fontWeight: '500', color: '#374151', marginBottom: 6, fontFamily: FONT_FAMILY },
//   hintText: { fontSize: 12, color: '#9CA3AF', fontFamily: FONT_FAMILY, marginTop: 6 },
//   input: {
//     borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 10,
//     fontSize: 14, fontFamily: FONT_FAMILY, color: '#1F2937',
//   },
//   segmentedControl: { flexDirection: 'row', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 8, overflow: 'hidden' },
//   segmentBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 10, paddingHorizontal: 8 },
//   segmentText: { fontSize: 12.5, fontWeight: '600', fontFamily: FONT_FAMILY },
//   lockedField: { borderWidth: 1, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 10, backgroundColor: '#F9FAFB' },
//   resultsBox: { borderWidth: 1, borderRadius: 8, marginTop: 8, maxHeight: 200, overflow: 'hidden' },
//   resultRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 12, paddingVertical: 10 },
//   resultText: { fontSize: 13, fontFamily: FONT_FAMILY },
//   selectedChip: { flexDirection: 'row', alignItems: 'center', gap: 8, borderWidth: 1, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 8 },
//   selectedChipText: { flex: 1, fontSize: 13, fontFamily: FONT_FAMILY },
//   cancelBtn: { paddingHorizontal: 24, borderWidth: 1, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
//   errorBox: { backgroundColor: '#FEE2E2', borderRadius: 8, padding: 10, marginBottom: 12, borderLeftWidth: 4, borderLeftColor: '#DC2626' },
//   errorText: { fontSize: 13, fontWeight: '500', color: '#991B1B', fontFamily: FONT_FAMILY },
// });
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  Alert,
  useWindowDimensions,
} from 'react-native';
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

// Breakpoint above which the form switches to a two-column layout.
const DESKTOP_BREAKPOINT = 860;
const FORM_MAX_WIDTH = 1080;

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

function FieldLabel({ label, required }: { label: string; required?: boolean }) {
  return (
    <Text style={styles.rowLabel}>
      {label}
      {required ? <Text style={{ color: '#DC2626' }}> *</Text> : null}
    </Text>
  );
}

function DateField({ label, value, onChangeText }: { label: string; value: string; onChangeText: (v: string) => void }) {
  return (
    <View style={{ flex: 1 }}>
      <FieldLabel label={label} required />
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

// Lays two fields side-by-side on desktop/tablet, stacks them on mobile.
function FieldRow({ isDesktop, children }: { isDesktop: boolean; children: React.ReactNode }) {
  return (
    <View style={[styles.fieldRow, isDesktop ? styles.fieldRowDesktop : styles.fieldRowMobile]}>
      {children}
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
  const { width } = useWindowDimensions();
  const isDesktop = width >= DESKTOP_BREAKPOINT;

  const [name, setName] = useState('');
  const [promotionType, setPromotionType] = useState<'bogo' | 'percentage'>('bogo');

  // ── BOGO apply-to (unchanged) ────────────────────────────────────────────
  const [applyTo, setApplyTo] = useState<'all' | 'selected'>('selected');

  // ── Percentage apply-to (NEW: all products vs a single category) ───────
  // BACKEND GAP: your openapi.yaml's Promotion/PromotionInput/PromotionUpdate
  // schemas only define apply_to: [all, selected], with no category field at
  // all. There is also no /categories endpoint or Category schema — Product
  // just has a plain `category: string` free-text field. So "category" here
  // is picked from the distinct category values already present on your
  // products (via the existing useListProducts hook), NOT a new API call.
  // Sending `apply_to: 'category'` / `category` in the payload WILL be
  // rejected by your current backend until you add:
  //   1. 'category' to the apply_to enum on Promotion / PromotionInput /
  //      PromotionUpdate in openapi.yaml
  //   2. a `category: ["string","null"]` field on those same three schemas
  //   3. a matching `category` column + migration on the promotions table
  //   4. billing-side logic that matches product.category === promotion.category
  const [percentageApplyTo, setPercentageApplyTo] = useState<'all' | 'category'>('all');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categoryPickerOpen, setCategoryPickerOpen] = useState(false);

  const [discountPercentage, setDiscountPercentage] = useState('10');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [status, setStatus] = useState<'active' | 'inactive'>('active');
  const [selectedProductIds, setSelectedProductIds] = useState<number[]>([]);
  const [selectedProductNames, setSelectedProductNames] = useState<Record<number, string>>({});
  const [productSearch, setProductSearch] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(!isEditMode);

  // ── Optional promotion detail fields ─────────────────────────────────────
  const [description, setDescription] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [minOrderAmount, setMinOrderAmount] = useState('');
  const [bannerImage, setBannerImage] = useState('');

  const { data: existingPromotion, isLoading: isLoadingPromotion } = useGetPromotion(promotionId as number, {
    query: { enabled: isEditMode && !!promotionId, queryKey: getGetPromotionQueryKey(promotionId as number) },
  });

  useEffect(() => {
    if (isEditMode && existingPromotion && !hydrated) {
      setName(existingPromotion.name ?? '');
      setPromotionType(existingPromotion.promotion_type);
      setDiscountPercentage(
        existingPromotion.discount_percentage != null ? String(existingPromotion.discount_percentage) : '10'
      );

      if (existingPromotion.promotion_type === 'percentage') {
        // Cast to `any` because your current generated Promotion type only
        // knows apply_to: 'all' | 'selected' — 'category' and `category`
        // don't exist on it yet (see BACKEND GAP note above the state decl).
        const existingAny = existingPromotion as any;
        if (existingAny.apply_to === 'category' && existingAny.category) {
          setPercentageApplyTo('category');
          setSelectedCategory(existingAny.category);
        } else {
          setPercentageApplyTo('all');
          setSelectedCategory('');
        }
        setApplyTo('all');
      } else {
    setApplyTo(existingPromotion.apply_to === 'category' ? 'all' : existingPromotion.apply_to);
}

      const ids: number[] = existingPromotion.product_ids ?? [];
      const names: string[] = existingPromotion.product_names ?? [];
      setSelectedProductIds(ids);
      const nameMap: Record<number, string> = {};
      ids.forEach((pid, i) => { nameMap[pid] = names[i] ?? `Product #${pid}`; });
      setSelectedProductNames(nameMap);

      setStartDate(existingPromotion.start_date ?? '');
      setEndDate(existingPromotion.end_date ?? '');
      setStatus(existingPromotion.status ?? 'active');
      setDescription(existingPromotion.description ?? '');
      setPromoCode(existingPromotion.promo_code ?? '');
      setMinOrderAmount(
        existingPromotion.min_order_amount != null ? String(existingPromotion.min_order_amount) : ''
      );
      setBannerImage(existingPromotion.banner_image ?? '');

      setHydrated(true);
    }
  }, [isEditMode, existingPromotion, hydrated]);

  // ── Product search (BOGO — unchanged) ────────────────────────────────────
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

  // ── Category list (NEW — percentage promotions only) ─────────────────────
  // There's no categories endpoint in the API, so this reuses the existing
  // useListProducts hook (same one BOGO's product search already uses) with
  // a high limit and no search term, then derives the distinct, non-empty
  // `category` strings from the returned products. This makes one extra
  // fetch only while the Category picker is open — no new backend surface.
  const categorySourceParams = { business_id: business?.id as number, limit: 200 };
  const { data: categorySourceProducts, isFetching: isLoadingCategoryOptions } = useListProducts(categorySourceParams, {
    query: {
      enabled: !!business?.id && promotionType === 'percentage' && percentageApplyTo === 'category',
      queryKey: getListProductsQueryKey(categorySourceParams),
    },
  });
  const categoryOptions: string[] = Array.from(
    new Set(
      ((categorySourceProducts?.data ?? []) as any[])
        .map((p) => (typeof p.category === 'string' ? p.category.trim() : ''))
        .filter((c) => c.length > 0)
    )
  ).sort();

  const pickCategory = (c: string) => {
    setSelectedCategory(c);
    setCategoryPickerOpen(false);
  };

  const clearCategory = () => {
    setSelectedCategory('');
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

    if (promotionType === 'bogo') {
      if (applyTo === 'selected' && selectedProductIds.length === 0) {
        setError('Select at least one product for this promotion');
        return;
      }
    }

    if (promotionType === 'percentage') {
      const discount = parseFloat(discountPercentage);
      if (Number.isNaN(discount) || discount <= 0 || discount > 100) {
        setError('Enter a discount percentage between 1 and 100');
        return;
      }
      if (percentageApplyTo === 'category' && !selectedCategory) {
        setError('Please select a category');
        return;
      }
    }

    if (minOrderAmount.trim() && Number.isNaN(parseFloat(minOrderAmount))) {
      setError('Enter a valid minimum order amount');
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

    // ── Build the apply_to / category / product_ids trio per type ─────────
    // BOGO: apply_to is 'all' | 'selected', product_ids drives 'selected'.
    // Percentage: apply_to is 'all' | 'category', category drives 'category'.
    //
    // CONFIRMED BACKEND GAP (from your openapi.yaml): Promotion /
    // PromotionInput / PromotionUpdate only define apply_to: [all, selected]
    // and have no category field. Sending 'category' / `category` below
    // WILL fail validation against your current API until that's added —
    // see the BACKEND GAP comment near the state declarations for the exact
    // 4 changes needed. This is intentionally left as the real shape the
    // frontend needs so the backend change is a drop-in match.
    const effectiveApplyTo = promotionType === 'percentage' ? percentageApplyTo : applyTo;

    const sharedPayload = {
      name: name.trim(),
      apply_to: effectiveApplyTo as any, // 'category' not yet in generated ApplyTo union
      start_date: startDate,
      end_date: endDate,
      status,
      description: description.trim() || undefined,
      promo_code: promoCode.trim() || undefined,
      min_order_amount: minOrderAmount.trim() ? parseFloat(minOrderAmount) : undefined,
      banner_image: bannerImage.trim() || undefined,
      discount_percentage: promotionType === 'percentage' ? parseFloat(discountPercentage) : undefined,
      category: promotionType === 'percentage' && percentageApplyTo === 'category' ? selectedCategory : undefined,
      product_ids: promotionType === 'bogo' && applyTo === 'selected' ? selectedProductIds : undefined,
    };

    if (isEditMode && promotionId) {
      updatePromotion.mutate(
        {
          id: promotionId,
          data: {
            ...sharedPayload,
            product_ids: promotionType === 'bogo' ? (applyTo === 'selected' ? selectedProductIds : []) : undefined,
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
          promotion_type: promotionType,
          ...sharedPayload,
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
      contentContainerStyle={{
        padding: isDesktop ? 32 : 16,
        paddingBottom: insets.bottom + 32,
        maxWidth: FORM_MAX_WIDTH,
        width: '100%',
        alignSelf: 'center',
      }}
    >
      {/* Header */}
      <View style={{ marginBottom: 20 }}>
        <Text style={[styles.title, { color: colors.foreground }]}>
          {isEditMode ? 'Edit Promotion' : 'Add Promotion'}
        </Text>
        <Text style={styles.subtitle}>Create and manage promotional offers for your products.</Text>
      </View>

      <View style={[styles.card, isDesktop && styles.cardDesktop]}>
        {error ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        {/* Promotion Name */}
        <View style={styles.field}>
          <FieldLabel label="Promotion Name" required />
          <TextInput
            placeholder="e.g. Buy 1 Get 1 Free - Shampoo"
            placeholderTextColor="#9CA3AF"
            value={name}
            onChangeText={setName}
            style={styles.input}
          />
        </View>

        {/* Promotion Type */}
        <View style={styles.field}>
          <FieldLabel label="Promotion Type" required />
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
              <Text style={[styles.segmentText, promotionType === 'percentage' && { color: '#fff' }]}>Percentage Discount</Text>
            </Pressable>
          </View>
          {isEditMode ? (
            <Text style={styles.hintText}>Promotion type can't be changed after creation.</Text>
          ) : null}
        </View>

        {/* ── BOGO section (unchanged) ───────────────────────────────────── */}
        {promotionType === 'bogo' ? (
          <View style={styles.field}>
            <FieldLabel label="Apply To" />
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

                <Text style={[styles.rowLabel, { marginTop: 12 }]}>
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
                        <Pressable onPress={() => removeProduct(pid)} hitSlop={8} style={styles.chipRemoveBtn}>
                          <Feather name="x" size={13} color="#9CA3AF" />
                        </Pressable>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            ) : null}
          </View>
        ) : (
          /* ── Percentage section (NEW: discount + all/category) ─────────── */
          <>
            <FieldRow isDesktop={isDesktop}>
              <View style={{ flex: isDesktop ? 0.4 : 1 }}>
                <FieldLabel label="Discount Percentage" required />
                <View style={styles.discountInputWrap}>
                  <TextInput
                    placeholder="10"
                    placeholderTextColor="#9CA3AF"
                    value={discountPercentage}
                    onChangeText={(v) => setDiscountPercentage(v.replace(/[^0-9.]/g, ''))}
                    keyboardType="numeric"
                    style={[styles.input, styles.discountInput]}
                  />
                  <Text style={styles.discountPercentSign}>%</Text>
                </View>
              </View>

              <View style={{ flex: isDesktop ? 0.6 : 1 }}>
                <FieldLabel label="Apply To" />
                <View style={styles.segmentedControl}>
                  <Pressable
                    onPress={() => setPercentageApplyTo('all')}
                    style={[styles.segmentBtn, percentageApplyTo === 'all' && { backgroundColor: colors.primary }]}
                  >
                    <Text style={[styles.segmentText, percentageApplyTo === 'all' && { color: '#fff' }]}>All Products</Text>
                  </Pressable>
                  <Pressable
                    onPress={() => setPercentageApplyTo('category')}
                    style={[styles.segmentBtn, percentageApplyTo === 'category' && { backgroundColor: colors.primary }]}
                  >
                    <Text style={[styles.segmentText, percentageApplyTo === 'category' && { color: '#fff' }]}>Category</Text>
                  </Pressable>
                </View>
              </View>
            </FieldRow>

            {percentageApplyTo === 'category' ? (
              <View style={styles.field}>
                <FieldLabel label="Category" required />
                {selectedCategory ? (
                  <View style={[styles.selectedChip, { borderColor: colors.border, maxWidth: isDesktop ? 320 : undefined }]}>
                    <Feather name="tag" size={13} color={colors.primary} />
                    <Text style={[styles.selectedChipText, { color: colors.foreground }]}>{selectedCategory}</Text>
                    <Pressable onPress={clearCategory} hitSlop={8} style={styles.chipRemoveBtn}>
                      <Feather name="x" size={13} color="#9CA3AF" />
                    </Pressable>
                  </View>
                ) : (
                  <>
                    <Pressable
                      onPress={() => setCategoryPickerOpen((v) => !v)}
                      style={[styles.input, { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }]}
                    >
                      <Text style={{ fontFamily: FONT_FAMILY, color: '#9CA3AF', fontSize: 14 }}>Select category</Text>
                      <Feather name={categoryPickerOpen ? 'chevron-up' : 'chevron-down'} size={16} color="#9CA3AF" />
                    </Pressable>
                    {categoryPickerOpen ? (
                      isLoadingCategoryOptions ? (
                        <ActivityIndicator size="small" color={colors.primary} style={{ marginTop: 8 }} />
                      ) : categoryOptions.length > 0 ? (
                        <View style={[styles.resultsBox, { borderColor: colors.border }]}>
                          {categoryOptions.map((c) => (
                            <Pressable key={c} onPress={() => pickCategory(c)} style={styles.resultRow}>
                              <Feather name="tag" size={14} color="#9CA3AF" />
                              <Text style={[styles.resultText, { color: colors.foreground }]}>{c}</Text>
                            </Pressable>
                          ))}
                        </View>
                      ) : (
                        <Text style={styles.hintText}>No product categories found yet — add a category to a product first.</Text>
                      )
                    ) : null}
                  </>
                )}
                <Text style={styles.hintText}>
                  Only products in this category will receive the discount.
                </Text>
              </View>
            ) : null}
          </>
        )}

        {/* Description | Promo Code */}
        <FieldRow isDesktop={isDesktop}>
          <View style={{ flex: 1 }}>
            <FieldLabel label="Description" />
            <TextInput
              placeholder="e.g. Get 10% off on all shampoo products"
              placeholderTextColor="#9CA3AF"
              value={description}
              onChangeText={setDescription}
              style={[styles.input, styles.textArea]}
              multiline
            />
          </View>
          <View style={{ flex: 1 }}>
            <FieldLabel label="Promo Code" />
            <TextInput
              placeholder="e.g. SHAMP10"
              placeholderTextColor="#9CA3AF"
              value={promoCode}
              onChangeText={(v) => setPromoCode(v.toUpperCase())}
              autoCapitalize="characters"
              style={styles.input}
            />
          </View>
        </FieldRow>

        {/* Min Order Amount | Banner Image URL */}
        <FieldRow isDesktop={isDesktop}>
          <View style={{ flex: 1 }}>
            <FieldLabel label="Min Order Amount" />
            <TextInput
              placeholder="e.g. 500"
              placeholderTextColor="#9CA3AF"
              value={minOrderAmount}
              onChangeText={(v) => setMinOrderAmount(v.replace(/[^0-9.]/g, ''))}
              keyboardType="numeric"
              style={styles.input}
            />
          </View>
          <View style={{ flex: 1 }}>
            <FieldLabel label="Banner Image URL" />
            <TextInput
              placeholder="https://..."
              placeholderTextColor="#9CA3AF"
              value={bannerImage}
              onChangeText={setBannerImage}
              autoCapitalize="none"
              style={styles.input}
            />
          </View>
        </FieldRow>

        {/* Start Date | End Date */}
        <FieldRow isDesktop={isDesktop}>
          <DateField label="Start Date" value={startDate} onChangeText={setStartDate} />
          <DateField label="End Date" value={endDate} onChangeText={setEndDate} />
        </FieldRow>

        {/* Status */}
        <View style={styles.field}>
          <FieldLabel label="Status" />
          <View style={[styles.segmentedControl, { maxWidth: isDesktop ? 320 : undefined }]}>
            <Pressable onPress={() => setStatus('active')} style={[styles.segmentBtn, status === 'active' && { backgroundColor: '#16A34A' }]}>
              <Text style={[styles.segmentText, status === 'active' && { color: '#fff' }]}>Active</Text>
            </Pressable>
            <Pressable onPress={() => setStatus('inactive')} style={[styles.segmentBtn, status === 'inactive' && { backgroundColor: '#6B7280' }]}>
              <Text style={[styles.segmentText, status === 'inactive' && { color: '#fff' }]}>Inactive</Text>
            </Pressable>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footerRow}>
          <Pressable onPress={() => router.back()} style={[styles.cancelBtn, { borderColor: colors.border }]}>
            <Text style={{ fontFamily: FONT_FAMILY, color: colors.foreground, fontWeight: '600' }}>Cancel</Text>
          </Pressable>
          <PrimaryButton
            label={isEditMode ? 'Update Promotion' : 'Save Promotion'}
            onPress={handleSave}
            loading={isSaving}
            style={{ backgroundColor: colors.primary, flex: isDesktop ? undefined : 1, minWidth: isDesktop ? 200 : undefined }}
          />
        </View>
      </View>
    </KeyboardAwareScrollViewCompat>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 22, fontFamily: FONT_FAMILY, fontWeight: 'bold' },
  subtitle: { fontSize: 13.5, color: '#6B7280', fontFamily: FONT_FAMILY, marginTop: 4 },

  card: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 16,
  },
  cardDesktop: { padding: 24 },

  field: { marginBottom: 14 },

  fieldRow: { marginBottom: 14, gap: 14 },
  fieldRowDesktop: { flexDirection: 'row' },
  fieldRowMobile: { flexDirection: 'column', gap: 14 },

  rowLabel: { fontSize: 13, fontWeight: '500', color: '#374151', marginBottom: 6, fontFamily: FONT_FAMILY },
  hintText: { fontSize: 12, color: '#9CA3AF', fontFamily: FONT_FAMILY, marginTop: 6 },

  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    fontFamily: FONT_FAMILY,
    color: '#1F2937',
    backgroundColor: '#FFFFFF',
  },
  textArea: { minHeight: 44, textAlignVertical: 'top' },

  discountInputWrap: { flexDirection: 'row', alignItems: 'center', gap: 8, maxWidth: 160 },
  discountInput: { flex: 1, textAlign: 'right' },
  discountPercentSign: { fontSize: 15, fontWeight: '600', color: '#374151', fontFamily: FONT_FAMILY },

  segmentedControl: { flexDirection: 'row', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 8, overflow: 'hidden' },
  segmentBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 10, paddingHorizontal: 8 },
  segmentText: { fontSize: 12.5, fontWeight: '600', fontFamily: FONT_FAMILY },

  lockedField: { borderWidth: 1, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, backgroundColor: '#F9FAFB' },

  resultsBox: { borderWidth: 1, borderRadius: 8, marginTop: 8, maxHeight: 200, overflow: 'hidden' },
  resultRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 12, paddingVertical: 10 },
  resultText: { fontSize: 13, fontFamily: FONT_FAMILY },

  selectedChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#F9FAFB',
  },
  selectedChipText: { flex: 1, fontSize: 13, fontFamily: FONT_FAMILY },
  chipRemoveBtn: { padding: 2 },

  footerRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 12,
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F1F2F4',
  },
  cancelBtn: { paddingHorizontal: 22, paddingVertical: 12, borderWidth: 1, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },

  errorBox: { backgroundColor: '#FEE2E2', borderRadius: 8, padding: 10, marginBottom: 14, borderLeftWidth: 4, borderLeftColor: '#DC2626' },
  errorText: { fontSize: 13, fontWeight: '500', color: '#991B1B', fontFamily: FONT_FAMILY },
});