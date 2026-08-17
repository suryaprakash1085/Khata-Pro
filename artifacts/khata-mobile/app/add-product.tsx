// import React, { useEffect, useRef, useState } from 'react';
// import { ActivityIndicator, StyleSheet, Text, View, TextInput, TouchableOpacity, Modal, Platform, Alert, ScrollView } from 'react-native';
// import { router, useLocalSearchParams } from 'expo-router';
// import { Feather } from '@expo/vector-icons';
// import { useQueryClient } from '@tanstack/react-query';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import { KeyboardAwareScrollViewCompat } from '@/components/KeyboardAwareScrollViewCompat';
// import { useColors } from '@/hooks/useColors';
// import { useBusiness } from '@/contexts/BusinessContext';
// // @ts-ignore
// import {
//   useCreateProduct,
//   useUpdateProduct,
//   useGetProduct,
//   getGetProductQueryKey,
//   getListProductsQueryKey,
//   useListProducts,
//   useListVendors,
//   getListVendorsQueryKey,
//   useCreateVendor,
//   useCreatePurchase,
//   getListPurchasesQueryKey,
// } from '@workspace/api-client-react';
// import { FormField } from '@/components/FormField';
// import { PrimaryButton } from '@/components/PrimaryButton';
// import { BarcodeSvg } from '@/components/BarcodeSvg';
// import { BarcodeLabelPrintModal } from '@/components/BarcodeLabelPrintModal';

// const UNITS = ['pcs', 'kg', 'g', 'l', 'ml', 'pkt', 'box', 'bottle', 'dozen'];

// // Theme — matches the POS dashboard visual language
// const THEME = {
//   primary: '#5B21B6',
//   primarySoft: 'rgba(91,33,182,0.08)',
//   background: '#F8FAFC',
//   card: '#FFFFFF',
//   border: '#E5E7EB',
//   divider: '#E5E7EB',
//   text: '#0F172A',
//   label: '#374151',
//   placeholder: '#9CA3AF',
//   muted: '#6B7280',
//   danger: '#DC2626',
//   dangerBg: '#FEE2E2',
//   success: '#16A34A',
//   successBg: 'rgba(22,163,74,0.10)',
//   warning: '#D97706',
//   warningBg: 'rgba(217,119,6,0.10)',
// };

// const FONT_FAMILY = Platform.OS === 'ios' ? 'Times New Roman' : 'serif';
// const IS_WEB = Platform.OS === 'web';

// const showAlert = (title: string, message: string, onOk?: () => void) => {
//   if (Platform.OS === 'web') {
//     // eslint-disable-next-line no-alert
//     window.alert(`${title}\n\n${message}`);
//     onOk?.();
//   } else {
//     Alert.alert(title, message, [{ text: 'OK', onPress: onOk }]);
//   }
// };

// const uniqStrings = (values: (string | null | undefined)[]): string[] =>
//   Array.from(new Set(values.map((v) => (v ?? '').trim()).filter(Boolean)));

// // ---------------------------------------------------------------------------
// // Section card wrapper — icon badge + numbered title, matches the reference
// // design (white rounded card, subtle border, light shadow).
// // ---------------------------------------------------------------------------
// function SectionCard({
//   icon,
//   number,
//   title,
//   children,
//   last,
// }: {
//   icon: keyof typeof Feather.glyphMap;
//   number: number;
//   title: string;
//   children: React.ReactNode;
//   last?: boolean;
// }) {
//   return (
//     <View style={styles.section}>
//       <View style={styles.cardHeaderRow}>
//         <View style={styles.cardIconWrap}>
//           <Feather name={icon} size={15} color={THEME.primary} />
//         </View>
//         <Text style={styles.cardTitle}>
//           {number}. {title}
//         </Text>
//       </View>
//       {children}
//       {!last ? <View style={styles.sectionDivider} /> : null}
//     </View>
//   );
// }

// // Two-column responsive row — stacks to one column on narrow/mobile.
// function FieldRow({ children }: { children: React.ReactNode }) {
//   return <View style={[styles.fieldRow, { zIndex: 1 }]}>{children}</View>;
// }
// function FieldCol({ children, style }: { children: React.ReactNode; style?: any }) {
//   return <View style={[styles.fieldCol, { zIndex: 1 }, style]}>{children}</View>;
// }

// // A text input with a live suggestion dropdown filtered from DB values as you type.
// function AutocompleteField({
//   label,
//   required,
//   placeholder,
//   value,
//   onChangeText,
//   suggestions,
//   footer,
// }: {
//   label: string;
//   required?: boolean;
//   placeholder: string;
//   value: string;
//   onChangeText: (t: string) => void;
//   suggestions: string[];
//   footer?: React.ReactNode;
// }) {
//   const [focused, setFocused] = useState(false);
//   const query = value.trim().toLowerCase();
//   const filtered = focused
//     ? suggestions
//         .filter((s) => {
//           const low = s.toLowerCase();
//           return query.length === 0 ? true : low.includes(query) && low !== query;
//         })
//         .slice(0, 6)
//     : [];

//   return (
//     <View style={[styles.acWrap, focused ? styles.acWrapActive : null]}>
//       <Text style={styles.fieldLabel}>
//         {label}
//         {required ? <Text style={{ color: THEME.danger }}> *</Text> : null}
//       </Text>
//       <View style={{ position: 'relative' }}>
//         <View style={styles.selectLikeInput}>
//           <TextInput
//             placeholder={placeholder}
//             placeholderTextColor={THEME.placeholder}
//             value={value}
//             onChangeText={onChangeText}
//             onFocus={() => setFocused(true)}
//             onBlur={() => setTimeout(() => setFocused(false), 150)}
//             style={styles.selectLikeInputText}
//           />
//           <Feather name="chevron-down" size={14} color={THEME.placeholder} />
//         </View>
//         {filtered.length > 0 ? (
//           <View style={styles.suggestionBox}>
//             {filtered.map((s) => (
//               <TouchableOpacity
//                 key={s}
//                 style={styles.suggestionItem}
//                 onPress={() => {
//                   onChangeText(s);
//                   setFocused(false);
//                 }}
//               >
//                 <Text style={styles.suggestionText}>{s}</Text>
//               </TouchableOpacity>
//             ))}
//           </View>
//         ) : null}
//       </View>
//       {footer}
//     </View>
//   );
// }

// export default function AddProductScreen() {
//   const colors = useColors();
//   const insets = useSafeAreaInsets();
//   const { business } = useBusiness();
//   const queryClient = useQueryClient();
//   const { id } = useLocalSearchParams<{ id?: string }>();
//   const isEditMode = !!id;
//   const productId = id ? Number(id) : undefined;

//   const [name, setName] = useState('');
//   const [barcode, setBarcode] = useState('');
//   const [category, setCategory] = useState('');
//   const [unit, setUnit] = useState('pcs');
//   const [gstRate, setGstRate] = useState('0');
//   const [costPrice, setCostPrice] = useState('');
//   const [sellingPrice, setSellingPrice] = useState('');
//   const [stockQty, setStockQty] = useState('0');
//   const [lowStockAlert, setLowStockAlert] = useState('5'); // existing backend field, now editable
//   const [brand, setBrand] = useState('');
//   const [description, setDescription] = useState('');
//   const [error, setError] = useState<string | null>(null);
//   const [hydrated, setHydrated] = useState(!isEditMode);

//   // ---- Barcode section ----
//   const [barcodeType, setBarcodeType] = useState<'auto' | 'manual'>('manual');
//   const [barcodeLocked, setBarcodeLocked] = useState(false);
//   const [barcodeCheck, setBarcodeCheck] = useState<'idle' | 'checking' | 'available' | 'duplicate'>('idle');
//   const [duplicateWithName, setDuplicateWithName] = useState('');
//   const [barcodeQueryValue, setBarcodeQueryValue] = useState('');
//   const [printModalVisible, setPrintModalVisible] = useState(false);
//   const [postSaveModal, setPostSaveModal] = useState<{ barcode: string; productName: string } | null>(null);
//   const autoRetryRef = useRef(0);

//   // Vendor field + inline "create vendor" form
//   const [vendor, setVendor] = useState('');
//   const [isVendorModalVisible, setVendorModalVisible] = useState(false);
//   const [newVendorName, setNewVendorName] = useState('');
//   const [newVendorPhone, setNewVendorPhone] = useState('');
//   const [newVendorAddress, setNewVendorAddress] = useState('');
//   const [vendorError, setVendorError] = useState<string | null>(null);

//   const handleCreateVendor = () => {
//     setVendorError(null);
//     if (newVendorName.trim().length < 2) {
//       setVendorError('Enter vendor name');
//       return;
//     }
//     if (!business?.id) {
//       setVendorError('No business selected');
//       return;
//     }
//     createVendor.mutate(
//       {
//         data: {
//           business_id: business.id,
//           name: newVendorName.trim(),
//           phone: newVendorPhone.trim() || undefined,
//           address: newVendorAddress.trim() || undefined,
//         },
//       },
//       {
//         onSuccess: (created: any) => {
//           queryClient.invalidateQueries({
//             queryKey: getListVendorsQueryKey({ business_id: business.id }),
//             exact: false,
//           });
//           setVendor(created?.name ?? newVendorName.trim());
//           setNewVendorName('');
//           setNewVendorPhone('');
//           setNewVendorAddress('');
//           setVendorModalVisible(false);
//         },
//         onError: () => setVendorError('Could not save vendor. Please try again.'),
//       }
//     );
//   };

//   const { data: existingProduct, isLoading: isLoadingProduct } = useGetProduct(productId as number, {
//     query: { enabled: isEditMode && !!productId, queryKey: getGetProductQueryKey(productId as number) },
//   });

//   useEffect(() => {
//     if (isEditMode && existingProduct && !hydrated) {
//       setName(existingProduct.name ?? '');
//       setBarcode(existingProduct.barcode ?? '');
//       setCategory(existingProduct.category ?? '');
//       setUnit(existingProduct.unit ?? 'pcs');
//       setGstRate(String(existingProduct.gst_rate ?? 0));
//       setCostPrice(existingProduct.cost_price ? String(existingProduct.cost_price) : '');
//       setSellingPrice(existingProduct.selling_price ? String(existingProduct.selling_price) : '');
//       setStockQty(String(existingProduct.stock_qty ?? 0));
//       setLowStockAlert(String((existingProduct as any)?.low_stock_alert ?? 5));
//       setBrand((existingProduct as any)?.brand ?? '');
//       setDescription((existingProduct as any)?.description ?? '');
//       setBarcodeType('manual');
//       setBarcodeLocked(!!existingProduct.barcode);
//       setHydrated(true);
//     }
//   }, [isEditMode, existingProduct, hydrated]);

//   const createProduct = useCreateProduct();
//   const updateProduct = useUpdateProduct();
//   const createPurchase = useCreatePurchase();
//   const isSaving = createProduct.isPending || updateProduct.isPending || createPurchase.isPending;

//   const { data: productsData } = useListProducts(
//     { business_id: business?.id as number, limit: 100 },
//     {
//       query: {
//         enabled: !!business?.id,
//         queryKey: getListProductsQueryKey({ business_id: business?.id as number, limit: 100 }),
//       },
//     }
//   );
//   const { data: vendorsData } = useListVendors(
//     { business_id: business?.id as number },
//     {
//       query: {
//         enabled: !!business?.id,
//         queryKey: getListVendorsQueryKey({ business_id: business?.id as number }),
//       },
//     }
//   );

//   const toArray = (d: any): any[] =>
//     Array.isArray(d) ? d : d?.data ?? d?.items ?? d?.products ?? d?.vendors ?? [];

//   const productList = toArray(productsData);
//   const vendorList = toArray(vendorsData);

//   const categorySuggestions = uniqStrings(productList.map((p: any) => p?.category));
//   const brandSuggestions = uniqStrings(productList.map((p: any) => p?.brand));
//   const vendorSuggestions = uniqStrings(vendorList.map((v: any) => v?.name));

//   const createVendor = useCreateVendor();

//   // ---- Barcode uniqueness check ----
//   useEffect(() => {
//     const t = setTimeout(() => setBarcodeQueryValue(barcode.trim()), 400);
//     return () => clearTimeout(t);
//   }, [barcode]);

//   const barcodeCheckParams = { business_id: business?.id as number, search: barcodeQueryValue, limit: 5 };
//   const { data: barcodeCheckData, isFetching: isCheckingBarcode } = useListProducts(barcodeCheckParams, {
//     query: {
//       enabled: !!business?.id && barcodeQueryValue.length >= 4,
//       queryKey: getListProductsQueryKey(barcodeCheckParams),
//     },
//   });

//   useEffect(() => {
//     if (!barcodeQueryValue || barcodeQueryValue.length < 4) {
//       setBarcodeCheck('idle');
//       return;
//     }
//     if (isCheckingBarcode) {
//       setBarcodeCheck('checking');
//       return;
//     }
//     const list = toArray(barcodeCheckData);
//     const match = list.find(
//       (p: any) => String(p.barcode ?? '').trim() === barcodeQueryValue && (!isEditMode || p.id !== productId)
//     );

//     if (match) {
//       if (barcodeType === 'auto' && autoRetryRef.current < 20) {
//         autoRetryRef.current += 1;
//         setBarcode(String(parseInt(barcodeQueryValue, 10) + 1));
//         return;
//       }
//       setBarcodeCheck('duplicate');
//       setDuplicateWithName(match.name ?? 'another product');
//     } else {
//       autoRetryRef.current = 0;
//       setBarcodeCheck('available');
//       setDuplicateWithName('');
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [barcodeCheckData, isCheckingBarcode, barcodeQueryValue]);

//   const handleGenerateBarcode = () => {
//     autoRetryRef.current = 0;
//     const existingAutoCount = productList.filter((p: any) => /^2\d{11}$/.test(String(p?.barcode ?? ''))).length;
//     setBarcodeType('auto');
//     setBarcode(String(200000000001 + existingAutoCount));
//   };

//   const findMatchedVendor = (): any | undefined => {
//     const q = vendor.trim().toLowerCase();
//     if (!q) return undefined;
//     return vendorList.find((v: any) => (v?.name ?? '').trim().toLowerCase() === q);
//   };

//   const handleSave = () => {
//     setError(null);

//     if (barcode.trim().length === 0) {
//       setError('Enter the barcode number');
//       return;
//     }
//     if (barcodeCheck === 'duplicate') {
//       setError(`Barcode already exists for ${duplicateWithName}. Please use a different barcode.`);
//       return;
//     }
//     if (barcodeCheck === 'checking') {
//       setError('Please wait — checking barcode availability…');
//       return;
//     }
//     if (name.trim().length < 2) {
//       setError('Enter the product name');
//       return;
//     }
//     const parsedCost = parseFloat(costPrice);
//     if (isNaN(parsedCost) || parsedCost <= 0) {
//       setError('Enter a valid cost price');
//       return;
//     }
//     const parsedSelling = parseFloat(sellingPrice);
//     if (isNaN(parsedSelling) || parsedSelling <= 0) {
//       setError('Enter a valid selling price');
//       return;
//     }
//     const parsedQty = parseInt(stockQty, 10);
//     if (isNaN(parsedQty) || parsedQty <= 0) {
//       setError('Enter a valid quantity');
//       return;
//     }
//     if (!business?.id) {
//       setError('No business selected. Please set up your business first.');
//       return;
//     }

//     const matchedVendor = !isEditMode ? findMatchedVendor() : undefined;
//     if (!isEditMode && vendor.trim().length > 0 && !matchedVendor) {
//       setError('Select an existing vendor from the list, or tap "+ Add Vendor" to create one first.');
//       return;
//     }

//     const parsedLowStockAlert = parseInt(lowStockAlert, 10);

//     const payload = {
//       business_id: business.id,
//       name: name.trim(),
//       barcode: barcode.trim() || undefined,
//       category: category.trim() || undefined,
//       brand: brand.trim() || undefined,
//       description: description.trim() || undefined,
//       unit: (unit || 'pcs') as any,
//       gst_rate: gstRate ? parseFloat(gstRate) : 0,
//       cost_price: parsedCost,
//       selling_price: parsedSelling,
//       stock_qty: parsedQty,
//       low_stock_alert: !isNaN(parsedLowStockAlert) && parsedLowStockAlert >= 0 ? parsedLowStockAlert : 5,
//     };

//     const goToStock = () => {
//       showAlert('Success', isEditMode ? 'Product updated successfully' : 'Product added successfully', () => {
//         router.replace('/(tabs)/current-stock' as any);
//       });
//     };

//     const invalidateProductQueries = () => {
//       queryClient.invalidateQueries({ queryKey: ['/api/products'], exact: false });
//       if (business?.id) {
//         queryClient.invalidateQueries({
//           queryKey: getListProductsQueryKey({ business_id: business.id, limit: 100 }),
//           exact: false,
//         });
//       }
//     };

//     if (isEditMode && productId) {
//       updateProduct.mutate(
//         { id: productId, data: payload },
//         {
//           onSuccess: () => {
//             invalidateProductQueries();
//             goToStock();
//           },
//           onError: () => setError('Could not update product. Please try again.'),
//         }
//       );
//       return;
//     }

//     createProduct.mutate(
//       { data: payload },
//       {
//         onSuccess: (createdProduct: any) => {
//           invalidateProductQueries();

//           const finishCreate = () => {
//             setPostSaveModal({ barcode: barcode.trim(), productName: name.trim() });
//           };

//           if (!matchedVendor) {
//             finishCreate();
//             return;
//           }

//           createPurchase.mutate(
//             {
//               data: {
//                 business_id: business.id,
//                 vendor_id: matchedVendor.id,
//                 amount_paid: 0,
//                 entry_date: new Date().toISOString().split('T')[0],
//                 description: `Purchase: ${name.trim()}`,
//                 items: [
//                   {
//                     product_id: createdProduct.id,
//                     qty: parsedQty,
//                     unit_cost: parsedCost,
//                   },
//                 ],
//               },
//             },
//             {
//               onSuccess: () => {
//                 queryClient.invalidateQueries({
//                   queryKey: getListPurchasesQueryKey({ business_id: business.id }),
//                   exact: false,
//                 });
//                 finishCreate();
//               },
//               onError: () => {
//                 setError('Product saved, but recording the purchase failed. Please add it from Purchases.');
//                 finishCreate();
//               },
//             }
//           );
//         },
//         onError: () => setError('Could not save product. Please try again.'),
//       }
//     );
//   };

//   const handleReset = () => {
//     setName('');
//     setBarcode('');
//     setCategory('');
//     setUnit('pcs');
//     setGstRate('0');
//     setCostPrice('');
//     setSellingPrice('');
//     setStockQty('0');
//     setLowStockAlert('5');
//     setBrand('');
//     setDescription('');
//     setError(null);
//     setBarcodeType('manual');
//     setBarcodeCheck('idle');
//     setDuplicateWithName('');
//     autoRetryRef.current = 0;
//   };

//   // ---- Derived display-only values (Pricing & Inventory summaries) ----
//   const numCost = parseFloat(costPrice) || 0;
//   const numSelling = parseFloat(sellingPrice) || 0;
//   const profit = numSelling - numCost;
//   const margin = numSelling > 0 ? (profit / numSelling) * 100 : 0;

//   const numStock = parseInt(stockQty, 10) || 0;
//   const numLowAlert = parseInt(lowStockAlert, 10) || 0;
//   const stockStatus: { label: string; color: string; bg: string } =
//     numStock <= 0
//       ? { label: 'Out of Stock', color: THEME.danger, bg: THEME.dangerBg }
//       : numStock <= numLowAlert
//       ? { label: 'Low Stock', color: THEME.warning, bg: THEME.warningBg }
//       : { label: 'In Stock', color: THEME.success, bg: THEME.successBg };

//   if (isEditMode && isLoadingProduct && !hydrated) {
//     return (
//       <View style={{ flex: 1, backgroundColor: THEME.background, alignItems: 'center', justifyContent: 'center' }}>
//         <ActivityIndicator color={THEME.primary} />
//       </View>
//     );
//   }

//   return (
//     <View style={{ flex: 1, backgroundColor: THEME.background }}>
//       {/* ---- Page header ---- */}
//       <View style={[styles.pageHeader, { paddingTop: insets.top + 14 }]}>
//         <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} hitSlop={8}>
//           <Feather name="arrow-left" size={18} color={THEME.text} />
//         </TouchableOpacity>
//         <View>
//           <Text style={styles.pageTitle}>{isEditMode ? 'Edit Product' : 'Add New Product'}</Text>
//           <Text style={styles.pageSubtitle}>
//             {isEditMode
//               ? 'Update product details, pricing and inventory information'
//               : 'Add product details, pricing and inventory information'}
//           </Text>
//         </View>
//       </View>

//       <KeyboardAwareScrollViewCompat
//         style={{ flex: 1 }}
//         contentContainerStyle={styles.scrollContent}
//         bottomOffset={40}
//       >
//         {error ? (
//           <View style={styles.errorContainer}>
//             <Text style={styles.errorText}>{error}</Text>
//           </View>
//         ) : null}

//         <View style={styles.card}>

//         {/* ============================ SECTION 1 — PRODUCT INFORMATION ============================ */}
//         <SectionCard icon="package" number={1} title="Product Information">
//           <FieldRow>
//             <FieldCol>
//               <Text style={styles.fieldLabel}>
//                 Product Name<Text style={{ color: THEME.danger }}> *</Text>
//               </Text>
//               <TextInput
//                 placeholder="Enter product name"
//                 placeholderTextColor={THEME.placeholder}
//                 value={name}
//                 onChangeText={setName}
//                 style={styles.textInput}
//               />
//             </FieldCol>
//             <FieldCol>
//               <AutocompleteField
//                 label="Category"
//                 placeholder="Type or select category"
//                 value={category}
//                 onChangeText={setCategory}
//                 suggestions={categorySuggestions}
//               />
//             </FieldCol>
//           </FieldRow>

//           <FieldRow>
//             <FieldCol>
//               <AutocompleteField
//                 label="Brand"
//                 placeholder="Type or select brand"
//                 value={brand}
//                 onChangeText={setBrand}
//                 suggestions={brandSuggestions}
//               />
//             </FieldCol>
//             <FieldCol>
//               <Text style={styles.fieldLabel}>Description</Text>
//               <TextInput
//                 multiline
//                 numberOfLines={3}
//                 maxLength={250}
//                 placeholder="Enter product description (optional)"
//                 placeholderTextColor={THEME.placeholder}
//                 value={description}
//                 onChangeText={setDescription}
//                 style={[styles.textInput, styles.textArea]}
//               />
//               <Text style={styles.charCount}>{description.length} / 250</Text>
//             </FieldCol>
//           </FieldRow>
//         </SectionCard>

//         {/* ============================ CARD 2 — BARCODE & IDENTIFICATION ============================ */}
//         <SectionCard icon="hash" number={2} title="Barcode & Identification">
//           <FieldRow>
//             <FieldCol>
//               <Text style={styles.fieldLabel}>
//                 Barcode Type<Text style={{ color: THEME.danger }}> *</Text>
//               </Text>
//               <View style={styles.segmentedControl}>
//                 <TouchableOpacity
//                   onPress={() => setBarcodeType('manual')}
//                   style={[styles.segmentBtn, barcodeType === 'manual' && styles.segmentBtnActive]}
//                 >
//                   <Feather
//                     name="edit-3"
//                     size={12}
//                     color={barcodeType === 'manual' ? '#fff' : THEME.label}
//                     style={{ marginRight: 6 }}
//                   />
//                   <Text style={[styles.segmentText, barcodeType === 'manual' && styles.segmentTextActive]}>
//                     Manual
//                   </Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity
//                   onPress={() => setBarcodeType('auto')}
//                   style={[styles.segmentBtn, barcodeType === 'auto' && styles.segmentBtnActive]}
//                 >
//                   <Feather
//                     name="refresh-cw"
//                     size={12}
//                     color={barcodeType === 'auto' ? '#fff' : THEME.label}
//                     style={{ marginRight: 6 }}
//                   />
//                   <Text style={[styles.segmentText, barcodeType === 'auto' && styles.segmentTextActive]}>
//                     Auto Generate
//                   </Text>
//                 </TouchableOpacity>
//               </View>

//               <Text style={[styles.fieldLabel, { marginTop: 14 }]}>
//                 Barcode Number<Text style={{ color: THEME.danger }}> *</Text>
//               </Text>
//               <View style={styles.barcodeRow}>
//                 <TextInput
//                   placeholder={barcodeType === 'auto' ? 'Tap Generate to create a barcode' : 'Enter barcode number'}
//                   placeholderTextColor={THEME.placeholder}
//                   value={barcode}
//                   onChangeText={(t) => {
//                     setBarcode(t.replace(/[^0-9]/g, ''));
//                     autoRetryRef.current = 0;
//                   }}
//                   editable={barcodeType === 'manual' && !(isEditMode && barcodeLocked)}
//                   keyboardType="number-pad"
//                   style={[
//                     styles.textInput,
//                     { flex: 1 },
//                     barcodeType === 'auto' || (isEditMode && barcodeLocked) ? styles.inputDisabled : null,
//                   ]}
//                 />
//                 {barcodeType === 'auto' ? (
//                   <TouchableOpacity onPress={handleGenerateBarcode} style={styles.smallActionBtn}>
//                     <Feather name="hash" size={13} color="#fff" style={{ marginRight: 6 }} />
//                     <Text style={styles.smallActionBtnText}>{barcode ? 'Regenerate' : 'Generate Barcode'}</Text>
//                   </TouchableOpacity>
//                 ) : isEditMode && barcodeLocked ? (
//                   <TouchableOpacity onPress={() => setBarcodeLocked(false)} style={styles.smallActionBtn}>
//                     <Text style={styles.smallActionBtnText}>Change Barcode</Text>
//                   </TouchableOpacity>
//                 ) : null}
//               </View>

//               {barcodeCheck === 'checking' ? (
//                 <View style={styles.statusRow}>
//                   <ActivityIndicator size="small" color={THEME.primary} />
//                   <Text style={styles.statusChecking}>Checking barcode availability…</Text>
//                 </View>
//               ) : barcodeCheck === 'available' ? (
//                 <View style={[styles.statusPill, { backgroundColor: THEME.successBg }]}>
//                   <Feather name="check-circle" size={13} color={THEME.success} />
//                   <Text style={[styles.statusPillText, { color: THEME.success }]}>Barcode Available</Text>
//                 </View>
//               ) : barcodeCheck === 'duplicate' ? (
//                 <View style={[styles.statusPill, { backgroundColor: THEME.dangerBg }]}>
//                   <Feather name="x-circle" size={13} color={THEME.danger} />
//                   <Text style={[styles.statusPillText, { color: THEME.danger }]}>
//                     Barcode already exists for {duplicateWithName}
//                   </Text>
//                 </View>
//               ) : (
//                 <View style={[styles.statusPill, { backgroundColor: THEME.primarySoft }]}>
//                   <Feather name="info" size={13} color={THEME.primary} />
//                   <Text style={[styles.statusPillText, { color: THEME.primary }]}>
//                     Barcode will be checked automatically for duplicates.
//                   </Text>
//                 </View>
//               )}
//             </FieldCol>

//             <FieldCol>
//               <Text style={styles.fieldLabel}>Barcode Preview</Text>
//               <View style={styles.previewCard}>
//                 {barcode.trim().length >= 4 && barcodeCheck !== 'duplicate' ? (
//                   <>
//                     <BarcodeSvg value={barcode.trim()} />
//                     <TouchableOpacity onPress={() => setPrintModalVisible(true)} style={styles.printLink}>
//                       <Feather name="printer" size={13} color={THEME.primary} />
//                       <Text style={styles.printLinkText}>Print Barcode</Text>
//                     </TouchableOpacity>
//                   </>
//                 ) : (
//                   <View style={styles.previewEmpty}>
//                     <Feather name="hash" size={22} color={THEME.placeholder} />
//                     <Text style={styles.previewEmptyText}>Enter a barcode to preview</Text>
//                   </View>
//                 )}
//               </View>
//             </FieldCol>
//           </FieldRow>
//         </SectionCard>

//         {/* ============================ CARD 3 — PRICING ============================ */}
//         <SectionCard icon="tag" number={3} title="Pricing">
//           <FieldRow>
//             <FieldCol>
//               <Text style={styles.fieldLabel}>
//                 Cost Price (₹)<Text style={{ color: THEME.danger }}> *</Text>
//               </Text>
//               <TextInput
//                 placeholder="Enter cost price"
//                 placeholderTextColor={THEME.placeholder}
//                 keyboardType="decimal-pad"
//                 value={costPrice}
//                 onChangeText={setCostPrice}
//                 style={styles.textInput}
//               />
//             </FieldCol>
//             <FieldCol>
//               <Text style={styles.fieldLabel}>
//                 Selling Price (₹)<Text style={{ color: THEME.danger }}> *</Text>
//               </Text>
//               <TextInput
//                 placeholder="Enter selling price"
//                 placeholderTextColor={THEME.placeholder}
//                 keyboardType="decimal-pad"
//                 value={sellingPrice}
//                 onChangeText={setSellingPrice}
//                 style={styles.textInput}
//               />
//             </FieldCol>
//             <FieldCol>
//               <Text style={styles.fieldLabel}>GST (%)</Text>
//               <TextInput
//                 placeholder="0"
//                 placeholderTextColor={THEME.placeholder}
//                 keyboardType="decimal-pad"
//                 value={gstRate}
//                 onChangeText={setGstRate}
//                 style={styles.textInput}
//               />
//             </FieldCol>
//           </FieldRow>

//           <View style={styles.summaryStrip}>
//             <SummaryTile icon="dollar-sign" iconColor={THEME.primary} label="Cost Price" value={`₹${numCost.toFixed(2)}`} />
//             <SummaryTile icon="tag" iconColor="#7C3AED" label="Selling Price" value={`₹${numSelling.toFixed(2)}`} />
//             <SummaryTile
//               icon="trending-up"
//               iconColor={THEME.success}
//               label="Profit"
//               value={`₹${profit.toFixed(2)}`}
//               valueColor={profit >= 0 ? THEME.success : THEME.danger}
//             />
//             <SummaryTile
//               icon="percent"
//               iconColor={THEME.warning}
//               label="Margin"
//               value={`${margin.toFixed(2)}%`}
//               valueColor={margin >= 0 ? THEME.warning : THEME.danger}
//             />
//           </View>
//           <Text style={styles.summaryHint}>Profit and margin are calculated based on cost and selling price.</Text>
//         </SectionCard>

//         {/* ============================ CARD 4 — INVENTORY ============================ */}
//         <SectionCard icon="archive" number={4} title="Inventory">
//           <FieldRow>
//             <FieldCol>
//               <Text style={styles.fieldLabel}>
//                 Opening Stock<Text style={{ color: THEME.danger }}> *</Text>
//               </Text>
//               <TextInput
//                 placeholder="0"
//                 placeholderTextColor={THEME.placeholder}
//                 keyboardType="number-pad"
//                 value={stockQty}
//                 onChangeText={setStockQty}
//                 style={styles.textInput}
//               />
//             </FieldCol>
//             <FieldCol>
//               <Text style={styles.fieldLabel}>
//                 Unit<Text style={{ color: THEME.danger }}> *</Text>
//               </Text>
//               <View style={styles.unitChipsRow}>
//                 {UNITS.map((u) => {
//                   const active = unit === u;
//                   return (
//                     <TouchableOpacity
//                       key={u}
//                       onPress={() => setUnit(u)}
//                       style={[styles.unitChip, active && styles.unitChipActive]}
//                     >
//                       <Text style={[styles.unitChipText, active && styles.unitChipTextActive]}>{u}</Text>
//                     </TouchableOpacity>
//                   );
//                 })}
//               </View>
//             </FieldCol>
//             <FieldCol>
//               <Text style={styles.fieldLabel}>Low Stock Alert</Text>
//               <TextInput
//                 placeholder="5"
//                 placeholderTextColor={THEME.placeholder}
//                 keyboardType="number-pad"
//                 value={lowStockAlert}
//                 onChangeText={setLowStockAlert}
//                 style={styles.textInput}
//               />
//             </FieldCol>
//           </FieldRow>

//           <View style={styles.stockSummaryRow}>
//             <View style={styles.stockSummaryTile}>
//               <View style={[styles.stockIconWrap, { backgroundColor: THEME.primarySoft }]}>
//                 <Feather name="box" size={14} color={THEME.primary} />
//               </View>
//               <View>
//                 <Text style={styles.stockSummaryLabel}>Current Stock</Text>
//                 <Text style={styles.stockSummaryValue}>
//                   {numStock} <Text style={styles.stockSummaryUnit}>{unit}</Text>
//                 </Text>
//               </View>
//             </View>
//             <View style={styles.stockSummaryTile}>
//               <Text style={styles.stockSummaryLabel}>Stock Status</Text>
//               <View style={[styles.stockStatusPill, { backgroundColor: stockStatus.bg }]}>
//                 <Text style={[styles.stockStatusPillText, { color: stockStatus.color }]}>{stockStatus.label}</Text>
//               </View>
//             </View>
//             <View style={[styles.stockSummaryTile, { flex: 1.4 }]}>
//               <Text style={styles.stockSummaryLabel}>Status Info</Text>
//               <Text style={styles.stockInfoText}>Stock will be updated after purchase or manual adjustment.</Text>
//             </View>
//           </View>
//         </SectionCard>

//         {/* ============================ CARD 5 — SUPPLIER INFORMATION ============================ */}
//         <SectionCard icon="truck" number={5} title="Supplier Information">
//           <FieldRow>
//             <FieldCol style={{ flex: 2 }}>
//               <AutocompleteField
//                 label="Vendor"
//                 placeholder="Type or select vendor"
//                 value={vendor}
//                 onChangeText={setVendor}
//                 suggestions={vendorSuggestions}
//               />
//               <Text style={styles.summaryHint}>Select the supplier for this product. You can add a new vendor if not available.</Text>
//             </FieldCol>
//             <FieldCol>
//               <Text style={styles.fieldLabel}> </Text>
//               <TouchableOpacity onPress={() => setVendorModalVisible(true)} style={styles.addVendorBtn}>
//                 <Feather name="user-plus" size={14} color={THEME.primary} />
//                 <Text style={styles.addVendorBtnText}>Add Vendor</Text>
//               </TouchableOpacity>
//             </FieldCol>
//           </FieldRow>
//         </SectionCard>

//         {/* ============================ SECTION 6 — ADDITIONAL INFORMATION ============================ */}
//         <SectionCard icon="file-text" number={6} title="Additional Information" last>
//           <Text style={styles.fieldLabel}>Notes / Description</Text>
//           <TextInput
//             multiline
//             numberOfLines={4}
//             maxLength={290}
//             placeholder="Add any additional notes about this product (optional)"
//             placeholderTextColor={THEME.placeholder}
//             value={description}
//             onChangeText={setDescription}
//             style={[styles.textInput, styles.textArea, { minHeight: 90 }]}
//           />
//           <Text style={styles.charCount}>{description.length} / 290</Text>
//         </SectionCard>

//         {/* ---- Action buttons — inline, inside the same card ---- */}
//         <View style={styles.bottomBarInline}>
//           <TouchableOpacity onPress={handleReset} style={styles.cancelBtn} activeOpacity={0.7}>
//             <Feather name="x" size={15} color={THEME.text} style={{ marginRight: 6 }} />
//             <Text style={styles.cancelBtnText}>Cancel / Reset</Text>
//           </TouchableOpacity>
//           <PrimaryButton
//             label={isEditMode ? 'Update Product' : 'Save Product'}
//             onPress={handleSave}
//             loading={isSaving}
//             disabled={isSaving}
//             style={styles.saveBtn}
//           />
//         </View>

//         </View>
//       </KeyboardAwareScrollViewCompat>

//       {/* ---- Create Vendor modal ---- */}
//       <Modal visible={isVendorModalVisible} transparent animationType="fade" onRequestClose={() => setVendorModalVisible(false)}>
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalCard}>
//             <Text style={styles.modalTitle}>Add Vendor</Text>

//             {vendorError ? (
//               <View style={styles.errorContainer}>
//                 <Text style={styles.errorText}>{vendorError}</Text>
//               </View>
//             ) : null}

//             <FormField
//               layout="stack"
//               label="Vendor Name"
//               required
//               placeholder="Enter vendor name"
//               value={newVendorName}
//               onChangeText={setNewVendorName}
//             />
//             <View style={{ height: 12 }} />
//             <FormField
//               layout="stack"
//               label="Phone Number"
//               placeholder="Enter phone number"
//               keyboardType="phone-pad"
//               value={newVendorPhone}
//               onChangeText={setNewVendorPhone}
//             />
//             <View style={{ height: 12 }} />
//             <FormField
//               layout="stack"
//               label="Address"
//               placeholder="Enter address"
//               value={newVendorAddress}
//               onChangeText={setNewVendorAddress}
//             />

//             <View style={styles.modalButtons}>
//               <TouchableOpacity
//                 onPress={() => {
//                   setVendorModalVisible(false);
//                   setVendorError(null);
//                 }}
//                 style={styles.modalCancelBtn}
//               >
//                 <Text style={styles.cancelBtnText}>Cancel</Text>
//               </TouchableOpacity>
//               <PrimaryButton label="Save Vendor" onPress={handleCreateVendor} style={styles.saveBtn} />
//             </View>
//           </View>
//         </View>
//       </Modal>

//       {/* ---- Post-save: offer to print barcode label ---- */}
//       <Modal visible={!!postSaveModal} transparent animationType="fade" onRequestClose={() => {}}>
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalCard}>
//             <Text style={styles.modalTitle}>Product Saved</Text>
//             <Text style={{ fontFamily: FONT_FAMILY, fontSize: 13, color: THEME.label, marginBottom: 16 }}>
//               {postSaveModal?.productName} was added successfully. Print its barcode label now?
//             </Text>
//             <View style={styles.modalButtons}>
//               <TouchableOpacity onPress={() => router.replace('/(tabs)/current-stock' as any)} style={styles.modalCancelBtn}>
//                 <Text style={styles.cancelBtnText}>Continue / Close</Text>
//               </TouchableOpacity>
//               <PrimaryButton label="Print Barcode" onPress={() => setPrintModalVisible(true)} style={styles.saveBtn} />
//             </View>
//           </View>
//         </View>
//       </Modal>

//       <BarcodeLabelPrintModal
//         visible={printModalVisible}
//         onClose={() => {
//           setPrintModalVisible(false);
//           if (postSaveModal) {
//             router.replace('/(tabs)/current-stock' as any);
//           }
//         }}
//         businessName={business?.business_name}
//         productName={postSaveModal?.productName ?? name}
//         barcode={postSaveModal?.barcode ?? barcode}
//         sellingPrice={sellingPrice}
//       />
//     </View>
//   );
// }

// // ---------------------------------------------------------------------------
// // Small presentational helper for the pricing summary strip.
// // ---------------------------------------------------------------------------
// function SummaryTile({
//   icon,
//   iconColor,
//   label,
//   value,
//   valueColor,
// }: {
//   icon: keyof typeof Feather.glyphMap;
//   iconColor: string;
//   label: string;
//   value: string;
//   valueColor?: string;
// }) {
//   return (
//     <View style={styles.summaryTile}>
//       <View style={[styles.summaryTileIcon, { backgroundColor: iconColor + '18' }]}>
//         <Feather name={icon} size={13} color={iconColor} />
//       </View>
//       <View>
//         <Text style={styles.summaryTileLabel}>{label}</Text>
//         <Text style={[styles.summaryTileValue, valueColor ? { color: valueColor } : null]}>{value}</Text>
//       </View>
//     </View>
//   );
// }

// const CONTENT_MAX_WIDTH = 1160;

// const styles = StyleSheet.create({
//   // ---- Page header ----
//   pageHeader: {
//     flexDirection: 'row',
//     alignItems: 'flex-start',
//     gap: 12,
//     paddingHorizontal: 20,
//     paddingBottom: 14,
//     backgroundColor: THEME.background,
//     borderBottomWidth: 1,
//     borderBottomColor: THEME.divider,
//   },
//   backBtn: {
//     width: 30,
//     height: 30,
//     borderRadius: 8,
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: THEME.card,
//     borderWidth: 1,
//     borderColor: THEME.border,
//     marginTop: 2,
//   },
//   pageTitle: { fontSize: 19, fontWeight: '700', color: THEME.text, fontFamily: FONT_FAMILY },
//   pageSubtitle: { fontSize: 12.5, color: THEME.muted, marginTop: 2, fontFamily: FONT_FAMILY },

//   scrollContent: {
//     padding: 20,
//     paddingBottom: 100,
//     maxWidth: CONTENT_MAX_WIDTH,
//     width: '100%',
//     alignSelf: 'center',
//   },

//   errorContainer: {
//     backgroundColor: THEME.dangerBg,
//     borderRadius: 8,
//     padding: 10,
//     marginBottom: 14,
//     borderLeftWidth: 4,
//     borderLeftColor: THEME.danger,
//   },
//   errorText: { fontSize: 13, fontWeight: '500', color: '#991B1B', fontFamily: FONT_FAMILY },

//   // ---- Card (single outer container for all sections) ----
//   card: {
//     backgroundColor: THEME.card,
//     borderWidth: 1,
//     borderColor: THEME.border,
//     borderRadius: 14,
//     padding: 20,
//     ...(IS_WEB
//       ? ({ boxShadow: '0 1px 3px rgba(15,23,42,0.04)' } as any)
//       : { shadowColor: '#000', shadowOpacity: 0.03, shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, elevation: 1 }),
//   },
//   section: { position: 'relative' },
//   sectionDivider: { height: 1, backgroundColor: THEME.divider, marginVertical: 20 },
//   bottomBarInline: {
//     flexDirection: 'row',
//     justifyContent: 'flex-end',
//     gap: 12,
//     marginTop: 22,
//     paddingTop: 18,
//     borderTopWidth: 1,
//     borderTopColor: THEME.divider,
//   },
//   cardHeaderRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 16 },
//   cardIconWrap: {
//     width: 28,
//     height: 28,
//     borderRadius: 8,
//     backgroundColor: THEME.primarySoft,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   cardTitle: { fontSize: 15, fontWeight: '700', color: THEME.text, fontFamily: FONT_FAMILY },

//   // ---- Field layout ----
//   fieldRow: {
//     flexDirection: IS_WEB ? 'row' : 'column',
//     gap: 16,
//     marginBottom: 14,
//   },
//   fieldCol: { flex: 1, minWidth: IS_WEB ? 220 : undefined },
//   fieldLabel: { fontSize: 12.5, fontWeight: '600', color: THEME.label, marginBottom: 6, fontFamily: FONT_FAMILY },

//   textInput: {
//     borderWidth: 1,
//     borderColor: THEME.border,
//     borderRadius: 8,
//     paddingHorizontal: 12,
//     paddingVertical: 10,
//     fontSize: 13.5,
//     color: THEME.text,
//     backgroundColor: THEME.card,
//     fontFamily: FONT_FAMILY,
//     ...(IS_WEB ? ({ outlineStyle: 'none' } as any) : {}),
//   },
//   inputDisabled: { backgroundColor: '#F3F4F6', color: THEME.placeholder },
//   textArea: { minHeight: 68, textAlignVertical: 'top' },
//   charCount: { fontSize: 10.5, color: THEME.placeholder, textAlign: 'right', marginTop: 4, fontFamily: FONT_FAMILY },

//   // ---- Autocomplete ----
//   acWrap: { zIndex: 1 },
//   acWrapActive: { zIndex: 30, ...(Platform.OS === 'android' ? { elevation: 20 } : {}) },
//   selectLikeInput: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: THEME.border,
//     borderRadius: 8,
//     paddingHorizontal: 12,
//     paddingVertical: 10,
//     backgroundColor: THEME.card,
//   },
//   selectLikeInputText: { flex: 1, fontSize: 13.5, color: THEME.text, fontFamily: FONT_FAMILY, ...(IS_WEB ? ({ outlineStyle: 'none' } as any) : {}) },
//   suggestionBox: {
//     position: 'absolute',
//     top: 44,
//     left: 0,
//     right: 0,
//     backgroundColor: THEME.card,
//     borderWidth: 1,
//     borderColor: THEME.border,
//     borderRadius: 8,
//     overflow: 'hidden',
//     zIndex: 999,
//     elevation: 20,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.12,
//     shadowRadius: 6,
//   },
//   suggestionItem: { paddingHorizontal: 12, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: THEME.divider },
//   suggestionText: { fontSize: 13, color: THEME.text, fontFamily: FONT_FAMILY },

//   // ---- Barcode section ----
//   segmentedControl: { flexDirection: 'row', borderWidth: 1, borderColor: THEME.border, borderRadius: 8, overflow: 'hidden' },
//   segmentBtn: { flex: 1, flexDirection: 'row', paddingVertical: 9, alignItems: 'center', justifyContent: 'center', backgroundColor: THEME.card },
//   segmentBtnActive: { backgroundColor: THEME.primary },
//   segmentText: { fontSize: 12.5, fontWeight: '600', color: THEME.label, fontFamily: FONT_FAMILY },
//   segmentTextActive: { color: '#fff' },
//   barcodeRow: { flexDirection: 'row', gap: 8, alignItems: 'center' },
//   smallActionBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: THEME.primary, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10 },
//   smallActionBtnText: { color: '#fff', fontSize: 12, fontWeight: '700', fontFamily: FONT_FAMILY },
//   statusRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 10 },
//   statusChecking: { fontSize: 12, color: THEME.placeholder, fontFamily: FONT_FAMILY },
//   statusPill: { flexDirection: 'row', alignItems: 'center', gap: 6, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 8, marginTop: 10 },
//   statusPillText: { fontSize: 11.5, fontWeight: '600', fontFamily: FONT_FAMILY, flexShrink: 1 },

//   previewCard: {
//     borderWidth: 1,
//     borderColor: THEME.border,
//     borderRadius: 10,
//     padding: 14,
//     alignItems: 'center',
//     justifyContent: 'center',
//     minHeight: 120,
//     backgroundColor: '#FAFAFA',
//   },
//   previewEmpty: { alignItems: 'center', gap: 8 },
//   previewEmptyText: { fontSize: 12, color: THEME.placeholder, fontFamily: FONT_FAMILY },
//   printLink: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 10 },
//   printLinkText: { color: THEME.primary, fontWeight: '700', fontSize: 12.5, fontFamily: FONT_FAMILY },

//   // ---- Pricing summary strip ----
//   summaryStrip: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     gap: 10,
//     backgroundColor: THEME.primarySoft,
//     borderRadius: 10,
//     padding: 12,
//   },
//   summaryTile: { flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1, minWidth: 130 },
//   summaryTileIcon: { width: 26, height: 26, borderRadius: 7, alignItems: 'center', justifyContent: 'center' },
//   summaryTileLabel: { fontSize: 10.5, color: THEME.muted, fontFamily: FONT_FAMILY },
//   summaryTileValue: { fontSize: 14, fontWeight: '700', color: THEME.text, fontFamily: FONT_FAMILY },
//   summaryHint: { fontSize: 11, color: THEME.placeholder, textAlign: 'center', marginTop: 8, fontFamily: FONT_FAMILY },

//   // ---- Unit chips ----
//   unitChipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
//   unitChip: { borderWidth: 1, borderColor: THEME.border, borderRadius: 16, paddingHorizontal: 10, paddingVertical: 6 },
//   unitChipActive: { backgroundColor: THEME.primary, borderColor: THEME.primary },
//   unitChipText: { fontSize: 11.5, color: THEME.label, fontFamily: FONT_FAMILY, textTransform: 'capitalize' },
//   unitChipTextActive: { color: '#fff', fontWeight: '700' },

//   // ---- Stock summary ----
//   stockSummaryRow: { flexDirection: IS_WEB ? 'row' : 'column', gap: 12, backgroundColor: THEME.primarySoft, borderRadius: 10, padding: 12 },
//   stockSummaryTile: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10 },
//   stockIconWrap: { width: 30, height: 30, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
//   stockSummaryLabel: { fontSize: 10.5, color: THEME.muted, fontFamily: FONT_FAMILY, marginBottom: 2 },
//   stockSummaryValue: { fontSize: 15, fontWeight: '700', color: THEME.text, fontFamily: FONT_FAMILY },
//   stockSummaryUnit: { fontSize: 11, fontWeight: '400', color: THEME.muted },
//   stockStatusPill: { alignSelf: 'flex-start', borderRadius: 6, paddingHorizontal: 10, paddingVertical: 4 },
//   stockStatusPillText: { fontSize: 11.5, fontWeight: '700', fontFamily: FONT_FAMILY },
//   stockInfoText: { fontSize: 11, color: THEME.muted, fontFamily: FONT_FAMILY, lineHeight: 15 },

//   // ---- Vendor ----
//   addVendorBtn: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     gap: 6,
//     borderWidth: 1,
//     borderColor: THEME.primary,
//     borderRadius: 8,
//     paddingVertical: 10,
//     paddingHorizontal: 14,
//   },
//   addVendorBtnText: { color: THEME.primary, fontSize: 12.5, fontWeight: '700', fontFamily: FONT_FAMILY },

//   // ---- Bottom bar ----
//   bottomBar: {
//     flexDirection: 'row',
//     justifyContent: 'flex-end',
//     gap: 12,
//     paddingHorizontal: 20,
//     paddingTop: 12,
//     backgroundColor: THEME.card,
//     borderTopWidth: 1,
//     borderTopColor: THEME.divider,
//   },
//   cancelBtn: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: THEME.card,
//     borderWidth: 1,
//     borderColor: THEME.border,
//     paddingHorizontal: 20,
//     paddingVertical: 12,
//     borderRadius: 8,
//   },
//   cancelBtnText: { fontSize: 13.5, fontWeight: '600', color: THEME.text, fontFamily: FONT_FAMILY },
//   saveBtn: { backgroundColor: THEME.primary, paddingHorizontal: 26 },

//   // ---- Modals ----
//   modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center', padding: 20 },
//   modalCard: { width: '100%', maxWidth: 420, backgroundColor: THEME.card, borderRadius: 12, padding: 20 },
//   modalTitle: { fontSize: 18, fontWeight: '700', color: THEME.text, marginBottom: 16, fontFamily: FONT_FAMILY },
//   modalButtons: { flexDirection: 'row', justifyContent: 'flex-end', gap: 12, marginTop: 20 },
//   modalCancelBtn: {
//     paddingHorizontal: 20,
//     paddingVertical: 12,
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: THEME.border,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
// });

import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View, TextInput, TouchableOpacity, Modal, Platform, Alert, ScrollView } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useQueryClient } from '@tanstack/react-query';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { KeyboardAwareScrollViewCompat } from '@/components/KeyboardAwareScrollViewCompat';
import { useColors } from '@/hooks/useColors';
import { useBusiness } from '@/contexts/BusinessContext';
// @ts-ignore
import {
  useCreateProduct,
  useUpdateProduct,
  useGetProduct,
  getGetProductQueryKey,
  getListProductsQueryKey,
  useListProducts,
  useListVendors,
  getListVendorsQueryKey,
  useCreateVendor,
  useCreatePurchase,
  getListPurchasesQueryKey,
} from '@workspace/api-client-react';
import { FormField } from '@/components/FormField';
import { PrimaryButton } from '@/components/PrimaryButton';
import { BarcodeSvg } from '@/components/BarcodeSvg';
import { BarcodeLabelPrintModal } from '@/components/BarcodeLabelPrintModal';

const UNITS = ['pcs', 'kg', 'g', 'l', 'ml', 'pkt', 'box', 'bottle', 'dozen'];

// Theme — matches the POS dashboard visual language
const THEME = {
  primary: '#5B21B6',
  primarySoft: 'rgba(91,33,182,0.08)',
  background: '#F8FAFC',
  card: '#FFFFFF',
  border: '#E5E7EB',
  divider: '#E5E7EB',
  text: '#0F172A',
  label: '#374151',
  placeholder: '#9CA3AF',
  muted: '#6B7280',
  danger: '#DC2626',
  dangerBg: '#FEE2E2',
  success: '#16A34A',
  successBg: 'rgba(22,163,74,0.10)',
  warning: '#D97706',
  warningBg: 'rgba(217,119,6,0.10)',
};

const FONT_FAMILY = Platform.OS === 'ios' ? 'Times New Roman' : 'serif';
const IS_WEB = Platform.OS === 'web';

const showAlert = (title: string, message: string, onOk?: () => void) => {
  if (Platform.OS === 'web') {
    // eslint-disable-next-line no-alert
    window.alert(`${title}\n\n${message}`);
    onOk?.();
  } else {
    Alert.alert(title, message, [{ text: 'OK', onPress: onOk }]);
  }
};

const uniqStrings = (values: (string | null | undefined)[]): string[] =>
  Array.from(new Set(values.map((v) => (v ?? '').trim()).filter(Boolean)));

// ---------------------------------------------------------------------------
// Section card wrapper — icon badge + numbered title, matches the reference
// design (white rounded card, subtle border, light shadow).
// ---------------------------------------------------------------------------
function SectionCard({
  icon,
  number,
  title,
  children,
  last,
}: {
  icon: keyof typeof Feather.glyphMap;
  number: number;
  title: string;
  children: React.ReactNode;
  last?: boolean;
}) {
  return (
    <View style={[styles.section, { zIndex: 100 - number * 10, position: 'relative' }]}>
      <View style={styles.cardHeaderRow}>
        <View style={styles.cardIconWrap}>
          <Feather name={icon} size={15} color={THEME.primary} />
        </View>
        <Text style={styles.cardTitle}>
          {number}. {title}
        </Text>
      </View>
      {children}
      {!last ? <View style={styles.sectionDivider} /> : null}
    </View>
  );
}

// Two-column responsive row — stacks to one column on narrow/mobile.
function FieldRow({ children, z }: { children: React.ReactNode; z?: number }) {
  return <View style={[styles.fieldRow, { zIndex: z ?? 1, position: 'relative' }]}>{children}</View>;
}
function FieldCol({ children, style }: { children: React.ReactNode; style?: any }) {
  return <View style={[styles.fieldCol, { zIndex: 1 }, style]}>{children}</View>;
}

// A text input with a live suggestion dropdown filtered from DB values as you type.
function AutocompleteField({
  label,
  required,
  placeholder,
  value,
  onChangeText,
  suggestions,
  footer,
}: {
  label: string;
  required?: boolean;
  placeholder: string;
  value: string;
  onChangeText: (t: string) => void;
  suggestions: string[];
  footer?: React.ReactNode;
}) {
  const [focused, setFocused] = useState(false);
  const query = value.trim().toLowerCase();
  const filtered = focused
    ? suggestions
        .filter((s) => {
          const low = s.toLowerCase();
          return query.length === 0 ? true : low.includes(query) && low !== query;
        })
        .slice(0, 6)
    : [];

  return (
    <View style={[styles.acWrap, focused ? styles.acWrapActive : null]}>
      <Text style={styles.fieldLabel}>
        {label}
        {required ? <Text style={{ color: THEME.danger }}> *</Text> : null}
      </Text>
      <View style={{ position: 'relative' }}>
        <View style={styles.selectLikeInput}>
          <TextInput
            placeholder={placeholder}
            placeholderTextColor={THEME.placeholder}
            value={value}
            onChangeText={onChangeText}
            onFocus={() => setFocused(true)}
            onBlur={() => setTimeout(() => setFocused(false), 150)}
            style={styles.selectLikeInputText}
          />
          <Feather name="chevron-down" size={14} color={THEME.placeholder} />
        </View>
        {filtered.length > 0 ? (
          <View style={styles.suggestionBox}>
            {filtered.map((s) => (
              <TouchableOpacity
                key={s}
                style={styles.suggestionItem}
                onPress={() => {
                  onChangeText(s);
                  setFocused(false);
                }}
              >
                <Text style={styles.suggestionText}>{s}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ) : null}
      </View>
      {footer}
    </View>
  );
}

export default function AddProductScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { business } = useBusiness();
  const queryClient = useQueryClient();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const isEditMode = !!id;
  const productId = id ? Number(id) : undefined;

  const [name, setName] = useState('');
  const [barcode, setBarcode] = useState('');
  const [category, setCategory] = useState('');
  const [unit, setUnit] = useState('pcs');
  const [gstRate, setGstRate] = useState('0');
  const [costPrice, setCostPrice] = useState('');
  const [sellingPrice, setSellingPrice] = useState('');
  const [stockQty, setStockQty] = useState('0');
  const [lowStockAlert, setLowStockAlert] = useState('5'); // existing backend field, now editable
  const [brand, setBrand] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(!isEditMode);

  // ---- Barcode section ----
  const [barcodeType, setBarcodeType] = useState<'auto' | 'manual'>('manual');
  const [barcodeLocked, setBarcodeLocked] = useState(false);
  const [barcodeCheck, setBarcodeCheck] = useState<'idle' | 'checking' | 'available' | 'duplicate'>('idle');
  const [duplicateWithName, setDuplicateWithName] = useState('');
  const [barcodeQueryValue, setBarcodeQueryValue] = useState('');
  const [printModalVisible, setPrintModalVisible] = useState(false);
  const [postSaveModal, setPostSaveModal] = useState<{ barcode: string; productName: string } | null>(null);
  const autoRetryRef = useRef(0);

  // Vendor field + inline "create vendor" form
  const [vendor, setVendor] = useState('');
  const [isVendorModalVisible, setVendorModalVisible] = useState(false);
  const [newVendorName, setNewVendorName] = useState('');
  const [newVendorPhone, setNewVendorPhone] = useState('');
  const [newVendorAddress, setNewVendorAddress] = useState('');
  const [vendorError, setVendorError] = useState<string | null>(null);

  const handleCreateVendor = () => {
    setVendorError(null);
    if (newVendorName.trim().length < 2) {
      setVendorError('Enter vendor name');
      return;
    }
    if (!business?.id) {
      setVendorError('No business selected');
      return;
    }
    createVendor.mutate(
      {
        data: {
          business_id: business.id,
          name: newVendorName.trim(),
          phone: newVendorPhone.trim() || undefined,
          address: newVendorAddress.trim() || undefined,
        },
      },
      {
        onSuccess: (created: any) => {
          queryClient.invalidateQueries({
            queryKey: getListVendorsQueryKey({ business_id: business.id }),
            exact: false,
          });
          setVendor(created?.name ?? newVendorName.trim());
          setNewVendorName('');
          setNewVendorPhone('');
          setNewVendorAddress('');
          setVendorModalVisible(false);
        },
        onError: () => setVendorError('Could not save vendor. Please try again.'),
      }
    );
  };

  const { data: existingProduct, isLoading: isLoadingProduct } = useGetProduct(productId as number, {
    query: { enabled: isEditMode && !!productId, queryKey: getGetProductQueryKey(productId as number) },
  });

  useEffect(() => {
    if (isEditMode && existingProduct && !hydrated) {
      setName(existingProduct.name ?? '');
      setBarcode(existingProduct.barcode ?? '');
      setCategory(existingProduct.category ?? '');
      setUnit(existingProduct.unit ?? 'pcs');
      setGstRate(String(existingProduct.gst_rate ?? 0));
      setCostPrice(existingProduct.cost_price ? String(existingProduct.cost_price) : '');
      setSellingPrice(existingProduct.selling_price ? String(existingProduct.selling_price) : '');
      setStockQty(String(existingProduct.stock_qty ?? 0));
      setLowStockAlert(String((existingProduct as any)?.low_stock_alert ?? 5));
      setBrand((existingProduct as any)?.brand ?? '');
      setDescription((existingProduct as any)?.description ?? '');
      setBarcodeType('manual');
      setBarcodeLocked(!!existingProduct.barcode);
      setHydrated(true);
    }
  }, [isEditMode, existingProduct, hydrated]);

  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const createPurchase = useCreatePurchase();
  const isSaving = createProduct.isPending || updateProduct.isPending || createPurchase.isPending;

  const { data: productsData } = useListProducts(
    { business_id: business?.id as number, limit: 100 },
    {
      query: {
        enabled: !!business?.id,
        queryKey: getListProductsQueryKey({ business_id: business?.id as number, limit: 100 }),
      },
    }
  );
  const { data: vendorsData } = useListVendors(
    { business_id: business?.id as number },
    {
      query: {
        enabled: !!business?.id,
        queryKey: getListVendorsQueryKey({ business_id: business?.id as number }),
      },
    }
  );

  const toArray = (d: any): any[] =>
    Array.isArray(d) ? d : d?.data ?? d?.items ?? d?.products ?? d?.vendors ?? [];

  const productList = toArray(productsData);
  const vendorList = toArray(vendorsData);

  const categorySuggestions = uniqStrings(productList.map((p: any) => p?.category));
  const brandSuggestions = uniqStrings(productList.map((p: any) => p?.brand));
  const vendorSuggestions = uniqStrings(vendorList.map((v: any) => v?.name));

  const createVendor = useCreateVendor();

  // ---- Barcode uniqueness check ----
  useEffect(() => {
    const t = setTimeout(() => setBarcodeQueryValue(barcode.trim()), 400);
    return () => clearTimeout(t);
  }, [barcode]);

  const barcodeCheckParams = { business_id: business?.id as number, search: barcodeQueryValue, limit: 5 };
  const { data: barcodeCheckData, isFetching: isCheckingBarcode } = useListProducts(barcodeCheckParams, {
    query: {
      enabled: !!business?.id && barcodeQueryValue.length >= 4,
      queryKey: getListProductsQueryKey(barcodeCheckParams),
    },
  });

  useEffect(() => {
    if (!barcodeQueryValue || barcodeQueryValue.length < 4) {
      setBarcodeCheck('idle');
      return;
    }
    if (isCheckingBarcode) {
      setBarcodeCheck('checking');
      return;
    }
    const list = toArray(barcodeCheckData);
    const match = list.find(
      (p: any) => String(p.barcode ?? '').trim() === barcodeQueryValue && (!isEditMode || p.id !== productId)
    );

    if (match) {
      if (barcodeType === 'auto' && autoRetryRef.current < 20) {
        autoRetryRef.current += 1;
        setBarcode(String(parseInt(barcodeQueryValue, 10) + 1));
        return;
      }
      setBarcodeCheck('duplicate');
      setDuplicateWithName(match.name ?? 'another product');
    } else {
      autoRetryRef.current = 0;
      setBarcodeCheck('available');
      setDuplicateWithName('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [barcodeCheckData, isCheckingBarcode, barcodeQueryValue]);

  const handleGenerateBarcode = () => {
    autoRetryRef.current = 0;
    const existingAutoCount = productList.filter((p: any) => /^2\d{11}$/.test(String(p?.barcode ?? ''))).length;
    setBarcodeType('auto');
    setBarcode(String(200000000001 + existingAutoCount));
  };

  const findMatchedVendor = (): any | undefined => {
    const q = vendor.trim().toLowerCase();
    if (!q) return undefined;
    return vendorList.find((v: any) => (v?.name ?? '').trim().toLowerCase() === q);
  };

  const handleSave = () => {
    setError(null);

    if (barcode.trim().length === 0) {
      setError('Enter the barcode number');
      return;
    }
    if (barcodeCheck === 'duplicate') {
      setError(`Barcode already exists for ${duplicateWithName}. Please use a different barcode.`);
      return;
    }
    if (barcodeCheck === 'checking') {
      setError('Please wait — checking barcode availability…');
      return;
    }
    if (name.trim().length < 2) {
      setError('Enter the product name');
      return;
    }
    const parsedCost = parseFloat(costPrice);
    if (isNaN(parsedCost) || parsedCost <= 0) {
      setError('Enter a valid cost price');
      return;
    }
    const parsedSelling = parseFloat(sellingPrice);
    if (isNaN(parsedSelling) || parsedSelling <= 0) {
      setError('Enter a valid selling price');
      return;
    }
    const parsedQty = parseInt(stockQty, 10);
    if (isNaN(parsedQty) || parsedQty <= 0) {
      setError('Enter a valid quantity');
      return;
    }
    if (!business?.id) {
      setError('No business selected. Please set up your business first.');
      return;
    }

    const matchedVendor = !isEditMode ? findMatchedVendor() : undefined;
    if (!isEditMode && vendor.trim().length > 0 && !matchedVendor) {
      setError('Select an existing vendor from the list, or tap "+ Add Vendor" to create one first.');
      return;
    }

    const parsedLowStockAlert = parseInt(lowStockAlert, 10);

    const payload = {
      business_id: business.id,
      name: name.trim(),
      barcode: barcode.trim() || undefined,
      category: category.trim() || undefined,
      brand: brand.trim() || undefined,
      description: description.trim() || undefined,
      unit: (unit || 'pcs') as any,
      gst_rate: gstRate ? parseFloat(gstRate) : 0,
      cost_price: parsedCost,
      selling_price: parsedSelling,
      stock_qty: parsedQty,
      low_stock_alert: !isNaN(parsedLowStockAlert) && parsedLowStockAlert >= 0 ? parsedLowStockAlert : 5,
    };

    const goToStock = () => {
      showAlert('Success', isEditMode ? 'Product updated successfully' : 'Product added successfully', () => {
        router.replace('/(tabs)/current-stock' as any);
      });
    };

    const invalidateProductQueries = () => {
      queryClient.invalidateQueries({ queryKey: ['/api/products'], exact: false });
      if (business?.id) {
        queryClient.invalidateQueries({
          queryKey: getListProductsQueryKey({ business_id: business.id, limit: 100 }),
          exact: false,
        });
      }
    };

    if (isEditMode && productId) {
      updateProduct.mutate(
        { id: productId, data: payload },
        {
          onSuccess: () => {
            invalidateProductQueries();
            goToStock();
          },
          onError: () => setError('Could not update product. Please try again.'),
        }
      );
      return;
    }

    createProduct.mutate(
      { data: payload },
      {
        onSuccess: (createdProduct: any) => {
          invalidateProductQueries();

          const finishCreate = () => {
            setPostSaveModal({ barcode: barcode.trim(), productName: name.trim() });
          };

          if (!matchedVendor) {
            finishCreate();
            return;
          }

          createPurchase.mutate(
            {
              data: {
                business_id: business.id,
                vendor_id: matchedVendor.id,
                amount_paid: 0,
                entry_date: new Date().toISOString().split('T')[0],
                description: `Purchase: ${name.trim()}`,
                items: [
                  {
                    product_id: createdProduct.id,
                    qty: parsedQty,
                    unit_cost: parsedCost,
                  },
                ],
              },
            },
            {
              onSuccess: () => {
                queryClient.invalidateQueries({
                  queryKey: getListPurchasesQueryKey({ business_id: business.id }),
                  exact: false,
                });
                finishCreate();
              },
              onError: () => {
                setError('Product saved, but recording the purchase failed. Please add it from Purchases.');
                finishCreate();
              },
            }
          );
        },
        onError: () => setError('Could not save product. Please try again.'),
      }
    );
  };

  const handleReset = () => {
    setName('');
    setBarcode('');
    setCategory('');
    setUnit('pcs');
    setGstRate('0');
    setCostPrice('');
    setSellingPrice('');
    setStockQty('0');
    setLowStockAlert('5');
    setBrand('');
    setDescription('');
    setError(null);
    setBarcodeType('manual');
    setBarcodeCheck('idle');
    setDuplicateWithName('');
    autoRetryRef.current = 0;
  };

  // ---- Derived display-only values (Pricing & Inventory summaries) ----
  const numCost = parseFloat(costPrice) || 0;
  const numSelling = parseFloat(sellingPrice) || 0;
  const profit = numSelling - numCost;
  const margin = numSelling > 0 ? (profit / numSelling) * 100 : 0;

  const numStock = parseInt(stockQty, 10) || 0;
  const numLowAlert = parseInt(lowStockAlert, 10) || 0;
  const stockStatus: { label: string; color: string; bg: string } =
    numStock <= 0
      ? { label: 'Out of Stock', color: THEME.danger, bg: THEME.dangerBg }
      : numStock <= numLowAlert
      ? { label: 'Low Stock', color: THEME.warning, bg: THEME.warningBg }
      : { label: 'In Stock', color: THEME.success, bg: THEME.successBg };

  if (isEditMode && isLoadingProduct && !hydrated) {
    return (
      <View style={{ flex: 1, backgroundColor: THEME.background, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color={THEME.primary} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: THEME.background }}>
      {/* ---- Page header ---- */}
      <View style={[styles.pageHeader, { paddingTop: insets.top + 14 }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} hitSlop={8}>
          <Feather name="arrow-left" size={18} color={THEME.text} />
        </TouchableOpacity>
        <View>
          <Text style={styles.pageTitle}>{isEditMode ? 'Edit Product' : 'Add New Product'}</Text>
          <Text style={styles.pageSubtitle}>
            {isEditMode
              ? 'Update product details, pricing and inventory information'
              : 'Add product details, pricing and inventory information'}
          </Text>
        </View>
      </View>

      <KeyboardAwareScrollViewCompat
        style={{ flex: 1 }}
        contentContainerStyle={styles.scrollContent}
        bottomOffset={40}
      >
        {error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        <View style={styles.card}>

        {/* ============================ SECTION 1 — PRODUCT INFORMATION ============================ */}
        <SectionCard icon="package" number={1} title="Product Information">
          <FieldRow z={60}>
            <FieldCol>
              <Text style={styles.fieldLabel}>
                Product Name<Text style={{ color: THEME.danger }}> *</Text>
              </Text>
              <TextInput
                placeholder="Enter product name"
                placeholderTextColor={THEME.placeholder}
                value={name}
                onChangeText={setName}
                style={styles.textInput}
              />
            </FieldCol>
            <FieldCol>
              <AutocompleteField
                label="Category"
                placeholder="Type or select category"
                value={category}
                onChangeText={setCategory}
                suggestions={categorySuggestions}
              />
            </FieldCol>
          </FieldRow>

          <FieldRow z={55}>
            <FieldCol>
              <AutocompleteField
                label="Brand"
                placeholder="Type or select brand"
                value={brand}
                onChangeText={setBrand}
                suggestions={brandSuggestions}
              />
            </FieldCol>
            <FieldCol>
              <Text style={styles.fieldLabel}>Description</Text>
              <TextInput
                multiline
                numberOfLines={3}
                maxLength={250}
                placeholder="Enter product description (optional)"
                placeholderTextColor={THEME.placeholder}
                value={description}
                onChangeText={setDescription}
                style={[styles.textInput, styles.textArea]}
              />
              <Text style={styles.charCount}>{description.length} / 250</Text>
            </FieldCol>
          </FieldRow>
        </SectionCard>

        {/* ============================ CARD 2 — BARCODE & IDENTIFICATION ============================ */}
        <SectionCard icon="hash" number={2} title="Barcode & Identification">
          <FieldRow z={50}>
            <FieldCol>
              <Text style={styles.fieldLabel}>
                Barcode Type<Text style={{ color: THEME.danger }}> *</Text>
              </Text>
              <View style={styles.segmentedControl}>
                <TouchableOpacity
                  onPress={() => setBarcodeType('manual')}
                  style={[styles.segmentBtn, barcodeType === 'manual' && styles.segmentBtnActive]}
                >
                  <Feather
                    name="edit-3"
                    size={12}
                    color={barcodeType === 'manual' ? '#fff' : THEME.label}
                    style={{ marginRight: 6 }}
                  />
                  <Text style={[styles.segmentText, barcodeType === 'manual' && styles.segmentTextActive]}>
                    Manual
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setBarcodeType('auto')}
                  style={[styles.segmentBtn, barcodeType === 'auto' && styles.segmentBtnActive]}
                >
                  <Feather
                    name="refresh-cw"
                    size={12}
                    color={barcodeType === 'auto' ? '#fff' : THEME.label}
                    style={{ marginRight: 6 }}
                  />
                  <Text style={[styles.segmentText, barcodeType === 'auto' && styles.segmentTextActive]}>
                    Auto Generate
                  </Text>
                </TouchableOpacity>
              </View>

              <Text style={[styles.fieldLabel, { marginTop: 14 }]}>
                Barcode Number<Text style={{ color: THEME.danger }}> *</Text>
              </Text>
              <View style={styles.barcodeRow}>
                <TextInput
                  placeholder={barcodeType === 'auto' ? 'Tap Generate to create a barcode' : 'Enter barcode number'}
                  placeholderTextColor={THEME.placeholder}
                  value={barcode}
                  onChangeText={(t) => {
                    setBarcode(t.replace(/[^0-9]/g, ''));
                    autoRetryRef.current = 0;
                  }}
                  editable={barcodeType === 'manual' && !(isEditMode && barcodeLocked)}
                  keyboardType="number-pad"
                  style={[
                    styles.textInput,
                    { flex: 1 },
                    barcodeType === 'auto' || (isEditMode && barcodeLocked) ? styles.inputDisabled : null,
                  ]}
                />
                {barcodeType === 'auto' ? (
                  <TouchableOpacity onPress={handleGenerateBarcode} style={styles.smallActionBtn}>
                    <Feather name="hash" size={13} color="#fff" style={{ marginRight: 6 }} />
                    <Text style={styles.smallActionBtnText}>{barcode ? 'Regenerate' : 'Generate Barcode'}</Text>
                  </TouchableOpacity>
                ) : isEditMode && barcodeLocked ? (
                  <TouchableOpacity onPress={() => setBarcodeLocked(false)} style={styles.smallActionBtn}>
                    <Text style={styles.smallActionBtnText}>Change Barcode</Text>
                  </TouchableOpacity>
                ) : null}
              </View>

              {barcodeCheck === 'checking' ? (
                <View style={styles.statusRow}>
                  <ActivityIndicator size="small" color={THEME.primary} />
                  <Text style={styles.statusChecking}>Checking barcode availability…</Text>
                </View>
              ) : barcodeCheck === 'available' ? (
                <View style={[styles.statusPill, { backgroundColor: THEME.successBg }]}>
                  <Feather name="check-circle" size={13} color={THEME.success} />
                  <Text style={[styles.statusPillText, { color: THEME.success }]}>Barcode Available</Text>
                </View>
              ) : barcodeCheck === 'duplicate' ? (
                <View style={[styles.statusPill, { backgroundColor: THEME.dangerBg }]}>
                  <Feather name="x-circle" size={13} color={THEME.danger} />
                  <Text style={[styles.statusPillText, { color: THEME.danger }]}>
                    Barcode already exists for {duplicateWithName}
                  </Text>
                </View>
              ) : (
                <View style={[styles.statusPill, { backgroundColor: THEME.primarySoft }]}>
                  <Feather name="info" size={13} color={THEME.primary} />
                  <Text style={[styles.statusPillText, { color: THEME.primary }]}>
                    Barcode will be checked automatically for duplicates.
                  </Text>
                </View>
              )}
            </FieldCol>

            <FieldCol>
              <Text style={styles.fieldLabel}>Barcode Preview</Text>
              <View style={styles.previewCard}>
                {barcode.trim().length >= 4 && barcodeCheck !== 'duplicate' ? (
                  <>
                    <BarcodeSvg value={barcode.trim()} />
                    <TouchableOpacity onPress={() => setPrintModalVisible(true)} style={styles.printLink}>
                      <Feather name="printer" size={13} color={THEME.primary} />
                      <Text style={styles.printLinkText}>Print Barcode</Text>
                    </TouchableOpacity>
                  </>
                ) : (
                  <View style={styles.previewEmpty}>
                    <Feather name="hash" size={22} color={THEME.placeholder} />
                    <Text style={styles.previewEmptyText}>Enter a barcode to preview</Text>
                  </View>
                )}
              </View>
            </FieldCol>
          </FieldRow>
        </SectionCard>

        {/* ============================ CARD 3 — PRICING ============================ */}
        <SectionCard icon="tag" number={3} title="Pricing">
          <FieldRow z={40}>
            <FieldCol>
              <Text style={styles.fieldLabel}>
                Cost Price (₹)<Text style={{ color: THEME.danger }}> *</Text>
              </Text>
              <TextInput
                placeholder="Enter cost price"
                placeholderTextColor={THEME.placeholder}
                keyboardType="decimal-pad"
                value={costPrice}
                onChangeText={setCostPrice}
                style={styles.textInput}
              />
            </FieldCol>
            <FieldCol>
              <Text style={styles.fieldLabel}>
                Selling Price (₹)<Text style={{ color: THEME.danger }}> *</Text>
              </Text>
              <TextInput
                placeholder="Enter selling price"
                placeholderTextColor={THEME.placeholder}
                keyboardType="decimal-pad"
                value={sellingPrice}
                onChangeText={setSellingPrice}
                style={styles.textInput}
              />
            </FieldCol>
            <FieldCol>
              <Text style={styles.fieldLabel}>GST (%)</Text>
              <TextInput
                placeholder="0"
                placeholderTextColor={THEME.placeholder}
                keyboardType="decimal-pad"
                value={gstRate}
                onChangeText={setGstRate}
                style={styles.textInput}
              />
            </FieldCol>
          </FieldRow>

          <View style={styles.summaryStrip}>
            <SummaryTile icon="dollar-sign" iconColor={THEME.primary} label="Cost Price" value={`₹${numCost.toFixed(2)}`} />
            <SummaryTile icon="tag" iconColor="#7C3AED" label="Selling Price" value={`₹${numSelling.toFixed(2)}`} />
            <SummaryTile
              icon="trending-up"
              iconColor={THEME.success}
              label="Profit"
              value={`₹${profit.toFixed(2)}`}
              valueColor={profit >= 0 ? THEME.success : THEME.danger}
            />
            <SummaryTile
              icon="percent"
              iconColor={THEME.warning}
              label="Margin"
              value={`${margin.toFixed(2)}%`}
              valueColor={margin >= 0 ? THEME.warning : THEME.danger}
            />
          </View>
          <Text style={styles.summaryHint}>Profit and margin are calculated based on cost and selling price.</Text>
        </SectionCard>

        {/* ============================ CARD 4 — INVENTORY ============================ */}
        <SectionCard icon="archive" number={4} title="Inventory">
          <FieldRow z={35}>
            <FieldCol>
              <Text style={styles.fieldLabel}>
                Opening Stock<Text style={{ color: THEME.danger }}> *</Text>
              </Text>
              <TextInput
                placeholder="0"
                placeholderTextColor={THEME.placeholder}
                keyboardType="number-pad"
                value={stockQty}
                onChangeText={setStockQty}
                style={styles.textInput}
              />
            </FieldCol>
            <FieldCol>
              <Text style={styles.fieldLabel}>
                Unit<Text style={{ color: THEME.danger }}> *</Text>
              </Text>
              <View style={styles.unitChipsRow}>
                {UNITS.map((u) => {
                  const active = unit === u;
                  return (
                    <TouchableOpacity
                      key={u}
                      onPress={() => setUnit(u)}
                      style={[styles.unitChip, active && styles.unitChipActive]}
                    >
                      <Text style={[styles.unitChipText, active && styles.unitChipTextActive]}>{u}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </FieldCol>
            <FieldCol>
              <Text style={styles.fieldLabel}>Low Stock Alert</Text>
              <TextInput
                placeholder="5"
                placeholderTextColor={THEME.placeholder}
                keyboardType="number-pad"
                value={lowStockAlert}
                onChangeText={setLowStockAlert}
                style={styles.textInput}
              />
            </FieldCol>
          </FieldRow>

          <View style={styles.stockSummaryRow}>
            <View style={styles.stockSummaryTile}>
              <View style={[styles.stockIconWrap, { backgroundColor: THEME.primarySoft }]}>
                <Feather name="box" size={14} color={THEME.primary} />
              </View>
              <View>
                <Text style={styles.stockSummaryLabel}>Current Stock</Text>
                <Text style={styles.stockSummaryValue}>
                  {numStock} <Text style={styles.stockSummaryUnit}>{unit}</Text>
                </Text>
              </View>
            </View>
            <View style={styles.stockSummaryTile}>
              <Text style={styles.stockSummaryLabel}>Stock Status</Text>
              <View style={[styles.stockStatusPill, { backgroundColor: stockStatus.bg }]}>
                <Text style={[styles.stockStatusPillText, { color: stockStatus.color }]}>{stockStatus.label}</Text>
              </View>
            </View>
            <View style={[styles.stockSummaryTile, { flex: 1.4 }]}>
              <Text style={styles.stockSummaryLabel}>Status Info</Text>
              <Text style={styles.stockInfoText}>Stock will be updated after purchase or manual adjustment.</Text>
            </View>
          </View>
        </SectionCard>

        {/* ============================ CARD 5 — SUPPLIER INFORMATION ============================ */}
        <SectionCard icon="truck" number={5} title="Supplier Information">
          <FieldRow z={30}>
            <FieldCol style={{ flex: 2 }}>
              <AutocompleteField
                label="Vendor"
                placeholder="Type or select vendor"
                value={vendor}
                onChangeText={setVendor}
                suggestions={vendorSuggestions}
              />
              <Text style={styles.summaryHint}>Select the supplier for this product. You can add a new vendor if not available.</Text>
            </FieldCol>
            <FieldCol>
              <Text style={styles.fieldLabel}> </Text>
              <TouchableOpacity onPress={() => setVendorModalVisible(true)} style={styles.addVendorBtn}>
                <Feather name="user-plus" size={14} color={THEME.primary} />
                <Text style={styles.addVendorBtnText}>Add Vendor</Text>
              </TouchableOpacity>
            </FieldCol>
          </FieldRow>
        </SectionCard>

        {/* ============================ SECTION 6 — ADDITIONAL INFORMATION ============================ */}
        <SectionCard icon="file-text" number={6} title="Additional Information" last>
          <Text style={styles.fieldLabel}>Notes / Description</Text>
          <TextInput
            multiline
            numberOfLines={4}
            maxLength={290}
            placeholder="Add any additional notes about this product (optional)"
            placeholderTextColor={THEME.placeholder}
            value={description}
            onChangeText={setDescription}
            style={[styles.textInput, styles.textArea, { minHeight: 90 }]}
          />
          <Text style={styles.charCount}>{description.length} / 290</Text>
        </SectionCard>

        {/* ---- Action buttons — inline, inside the same card ---- */}
        <View style={styles.bottomBarInline}>
          <TouchableOpacity onPress={handleReset} style={styles.cancelBtn} activeOpacity={0.7}>
            <Feather name="x" size={15} color={THEME.text} style={{ marginRight: 6 }} />
            <Text style={styles.cancelBtnText}>Cancel / Reset</Text>
          </TouchableOpacity>
          <PrimaryButton
            label={isEditMode ? 'Update Product' : 'Save Product'}
            onPress={handleSave}
            loading={isSaving}
            disabled={isSaving}
            style={styles.saveBtn}
          />
        </View>

        </View>
      </KeyboardAwareScrollViewCompat>

      {/* ---- Create Vendor modal ---- */}
      <Modal visible={isVendorModalVisible} transparent animationType="fade" onRequestClose={() => setVendorModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Add Vendor</Text>

            {vendorError ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{vendorError}</Text>
              </View>
            ) : null}

            <FormField
              layout="stack"
              label="Vendor Name"
              required
              placeholder="Enter vendor name"
              value={newVendorName}
              onChangeText={setNewVendorName}
            />
            <View style={{ height: 12 }} />
            <FormField
              layout="stack"
              label="Phone Number"
              placeholder="Enter phone number"
              keyboardType="phone-pad"
              value={newVendorPhone}
              onChangeText={setNewVendorPhone}
            />
            <View style={{ height: 12 }} />
            <FormField
              layout="stack"
              label="Address"
              placeholder="Enter address"
              value={newVendorAddress}
              onChangeText={setNewVendorAddress}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                onPress={() => {
                  setVendorModalVisible(false);
                  setVendorError(null);
                }}
                style={styles.modalCancelBtn}
              >
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <PrimaryButton label="Save Vendor" onPress={handleCreateVendor} style={styles.saveBtn} />
            </View>
          </View>
        </View>
      </Modal>

      {/* ---- Post-save: offer to print barcode label ---- */}
      <Modal visible={!!postSaveModal} transparent animationType="fade" onRequestClose={() => {}}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Product Saved</Text>
            <Text style={{ fontFamily: FONT_FAMILY, fontSize: 13, color: THEME.label, marginBottom: 16 }}>
              {postSaveModal?.productName} was added successfully. Print its barcode label now?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={() => router.replace('/(tabs)/current-stock' as any)} style={styles.modalCancelBtn}>
                <Text style={styles.cancelBtnText}>Continue / Close</Text>
              </TouchableOpacity>
              <PrimaryButton label="Print Barcode" onPress={() => setPrintModalVisible(true)} style={styles.saveBtn} />
            </View>
          </View>
        </View>
      </Modal>

      <BarcodeLabelPrintModal
        visible={printModalVisible}
        onClose={() => {
          setPrintModalVisible(false);
          if (postSaveModal) {
            router.replace('/(tabs)/current-stock' as any);
          }
        }}
        businessName={business?.business_name}
        productName={postSaveModal?.productName ?? name}
        barcode={postSaveModal?.barcode ?? barcode}
        sellingPrice={sellingPrice}
      />
    </View>
  );
}

// ---------------------------------------------------------------------------
// Small presentational helper for the pricing summary strip.
// ---------------------------------------------------------------------------
function SummaryTile({
  icon,
  iconColor,
  label,
  value,
  valueColor,
}: {
  icon: keyof typeof Feather.glyphMap;
  iconColor: string;
  label: string;
  value: string;
  valueColor?: string;
}) {
  return (
    <View style={styles.summaryTile}>
      <View style={[styles.summaryTileIcon, { backgroundColor: iconColor + '18' }]}>
        <Feather name={icon} size={13} color={iconColor} />
      </View>
      <View>
        <Text style={styles.summaryTileLabel}>{label}</Text>
        <Text style={[styles.summaryTileValue, valueColor ? { color: valueColor } : null]}>{value}</Text>
      </View>
    </View>
  );
}

const CONTENT_MAX_WIDTH = 1160;

const styles = StyleSheet.create({
  // ---- Page header ----
  pageHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingHorizontal: 20,
    paddingBottom: 14,
    backgroundColor: THEME.background,
    borderBottomWidth: 1,
    borderBottomColor: THEME.divider,
  },
  backBtn: {
    width: 30,
    height: 30,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: THEME.card,
    borderWidth: 1,
    borderColor: THEME.border,
    marginTop: 2,
  },
  pageTitle: { fontSize: 19, fontWeight: '700', color: THEME.text, fontFamily: FONT_FAMILY },
  pageSubtitle: { fontSize: 12.5, color: THEME.muted, marginTop: 2, fontFamily: FONT_FAMILY },

  scrollContent: {
    padding: 20,
    paddingBottom: 28,
    maxWidth: CONTENT_MAX_WIDTH,
    width: '100%',
    alignSelf: 'center',
  },

  errorContainer: {
    backgroundColor: THEME.dangerBg,
    borderRadius: 8,
    padding: 10,
    marginBottom: 14,
    borderLeftWidth: 4,
    borderLeftColor: THEME.danger,
  },
  errorText: { fontSize: 13, fontWeight: '500', color: '#991B1B', fontFamily: FONT_FAMILY },

  // ---- Card (single outer container for all sections) ----
  card: {
    backgroundColor: THEME.card,
    borderWidth: 1,
    borderColor: THEME.border,
    borderRadius: 14,
    padding: 20,
    ...(IS_WEB
      ? ({ boxShadow: '0 1px 3px rgba(15,23,42,0.04)' } as any)
      : { shadowColor: '#000', shadowOpacity: 0.03, shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, elevation: 1 }),
  },
  section: { position: 'relative' },
  sectionDivider: { height: 1, backgroundColor: THEME.divider, marginVertical: 20 },
  bottomBarInline: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 22,
    paddingTop: 18,
    borderTopWidth: 1,
    borderTopColor: THEME.divider,
  },
  cardHeaderRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 16 },
  cardIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: THEME.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: { fontSize: 15, fontWeight: '700', color: THEME.text, fontFamily: FONT_FAMILY },

  // ---- Field layout ----
  fieldRow: {
    flexDirection: IS_WEB ? 'row' : 'column',
    gap: 16,
    marginBottom: 14,
  },
  fieldCol: { flex: 1, minWidth: IS_WEB ? 220 : undefined },
  fieldLabel: { fontSize: 12.5, fontWeight: '600', color: THEME.label, marginBottom: 6, fontFamily: FONT_FAMILY },

  textInput: {
    borderWidth: 1,
    borderColor: THEME.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13.5,
    color: THEME.text,
    backgroundColor: THEME.card,
    fontFamily: FONT_FAMILY,
    ...(IS_WEB ? ({ outlineStyle: 'none' } as any) : {}),
  },
  inputDisabled: { backgroundColor: '#F3F4F6', color: THEME.placeholder },
  textArea: { minHeight: 68, textAlignVertical: 'top' },
  charCount: { fontSize: 10.5, color: THEME.placeholder, textAlign: 'right', marginTop: 4, fontFamily: FONT_FAMILY },

  // ---- Autocomplete ----
  acWrap: { zIndex: 1 },
  acWrapActive: { zIndex: 30, ...(Platform.OS === 'android' ? { elevation: 20 } : {}) },
  selectLikeInput: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: THEME.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: THEME.card,
  },
  selectLikeInputText: { flex: 1, fontSize: 13.5, color: THEME.text, fontFamily: FONT_FAMILY, ...(IS_WEB ? ({ outlineStyle: 'none' } as any) : {}) },
  suggestionBox: {
    position: 'absolute',
    top: 44,
    left: 0,
    right: 0,
    backgroundColor: THEME.card,
    borderWidth: 1,
    borderColor: THEME.border,
    borderRadius: 8,
    overflow: 'hidden',
    zIndex: 999,
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
  },
  suggestionItem: { paddingHorizontal: 12, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: THEME.divider },
  suggestionText: { fontSize: 13, color: THEME.text, fontFamily: FONT_FAMILY },

  // ---- Barcode section ----
  segmentedControl: { flexDirection: 'row', borderWidth: 1, borderColor: THEME.border, borderRadius: 8, overflow: 'hidden' },
  segmentBtn: { flex: 1, flexDirection: 'row', paddingVertical: 9, alignItems: 'center', justifyContent: 'center', backgroundColor: THEME.card },
  segmentBtnActive: { backgroundColor: THEME.primary },
  segmentText: { fontSize: 12.5, fontWeight: '600', color: THEME.label, fontFamily: FONT_FAMILY },
  segmentTextActive: { color: '#fff' },
  barcodeRow: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  smallActionBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: THEME.primary, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10 },
  smallActionBtnText: { color: '#fff', fontSize: 12, fontWeight: '700', fontFamily: FONT_FAMILY },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 10 },
  statusChecking: { fontSize: 12, color: THEME.placeholder, fontFamily: FONT_FAMILY },
  statusPill: { flexDirection: 'row', alignItems: 'center', gap: 6, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 8, marginTop: 10 },
  statusPillText: { fontSize: 11.5, fontWeight: '600', fontFamily: FONT_FAMILY, flexShrink: 1 },

  previewCard: {
    borderWidth: 1,
    borderColor: THEME.border,
    borderRadius: 10,
    padding: 14,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 120,
    backgroundColor: '#FAFAFA',
  },
  previewEmpty: { alignItems: 'center', gap: 8 },
  previewEmptyText: { fontSize: 12, color: THEME.placeholder, fontFamily: FONT_FAMILY },
  printLink: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 10 },
  printLinkText: { color: THEME.primary, fontWeight: '700', fontSize: 12.5, fontFamily: FONT_FAMILY },

  // ---- Pricing summary strip ----
  summaryStrip: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    backgroundColor: THEME.primarySoft,
    borderRadius: 10,
    padding: 12,
  },
  summaryTile: { flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1, minWidth: 130 },
  summaryTileIcon: { width: 26, height: 26, borderRadius: 7, alignItems: 'center', justifyContent: 'center' },
  summaryTileLabel: { fontSize: 10.5, color: THEME.muted, fontFamily: FONT_FAMILY },
  summaryTileValue: { fontSize: 14, fontWeight: '700', color: THEME.text, fontFamily: FONT_FAMILY },
  summaryHint: { fontSize: 11, color: THEME.placeholder, textAlign: 'center', marginTop: 8, fontFamily: FONT_FAMILY },

  // ---- Unit chips ----
  unitChipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  unitChip: { borderWidth: 1, borderColor: THEME.border, borderRadius: 16, paddingHorizontal: 10, paddingVertical: 6 },
  unitChipActive: { backgroundColor: THEME.primary, borderColor: THEME.primary },
  unitChipText: { fontSize: 11.5, color: THEME.label, fontFamily: FONT_FAMILY, textTransform: 'capitalize' },
  unitChipTextActive: { color: '#fff', fontWeight: '700' },

  // ---- Stock summary ----
  stockSummaryRow: { flexDirection: IS_WEB ? 'row' : 'column', gap: 12, backgroundColor: THEME.primarySoft, borderRadius: 10, padding: 12 },
  stockSummaryTile: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10 },
  stockIconWrap: { width: 30, height: 30, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  stockSummaryLabel: { fontSize: 10.5, color: THEME.muted, fontFamily: FONT_FAMILY, marginBottom: 2 },
  stockSummaryValue: { fontSize: 15, fontWeight: '700', color: THEME.text, fontFamily: FONT_FAMILY },
  stockSummaryUnit: { fontSize: 11, fontWeight: '400', color: THEME.muted },
  stockStatusPill: { alignSelf: 'flex-start', borderRadius: 6, paddingHorizontal: 10, paddingVertical: 4 },
  stockStatusPillText: { fontSize: 11.5, fontWeight: '700', fontFamily: FONT_FAMILY },
  stockInfoText: { fontSize: 11, color: THEME.muted, fontFamily: FONT_FAMILY, lineHeight: 15 },

  // ---- Vendor ----
  addVendorBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: THEME.primary,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  addVendorBtnText: { color: THEME.primary, fontSize: 12.5, fontWeight: '700', fontFamily: FONT_FAMILY },

  // ---- Bottom bar ----
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    paddingHorizontal: 20,
    paddingTop: 12,
    backgroundColor: THEME.card,
    borderTopWidth: 1,
    borderTopColor: THEME.divider,
  },
  cancelBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.card,
    borderWidth: 1,
    borderColor: THEME.border,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  cancelBtnText: { fontSize: 13.5, fontWeight: '600', color: THEME.text, fontFamily: FONT_FAMILY },
  saveBtn: { backgroundColor: THEME.primary, paddingHorizontal: 26 },

  // ---- Modals ----
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalCard: { width: '100%', maxWidth: 420, backgroundColor: THEME.card, borderRadius: 12, padding: 20 },
  modalTitle: { fontSize: 18, fontWeight: '700', color: THEME.text, marginBottom: 16, fontFamily: FONT_FAMILY },
  modalButtons: { flexDirection: 'row', justifyContent: 'flex-end', gap: 12, marginTop: 20 },
  modalCancelBtn: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: THEME.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
});