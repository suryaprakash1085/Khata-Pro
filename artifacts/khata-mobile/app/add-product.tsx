import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View, TextInput, TouchableOpacity, Modal, Platform, Alert } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
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

const UNITS = ['pcs', 'kg', 'g', 'l', 'ml', 'pkt', 'box', 'bottle', 'dozen'];

// Theme — matches the flat, label-left form design model
const THEME = {
  primary: '#5B21B6',
  background: '#FFFFFF',
  border: '#E5E7EB',
  divider: '#E5E7EB',
  text: '#1F2937',
  label: '#374151',
  placeholder: '#9CA3AF',
  danger: '#DC2626',
  dangerBg: '#FEE2E2',
};

const LABEL_WIDTH = 130;
const FONT_FAMILY = Platform.OS === 'ios' ? 'Times New Roman' : 'serif';

// Cross-platform alert: React Native's Alert.alert does not render on web,
// so fall back to the browser's window.alert there.
const showAlert = (title: string, message: string, onOk?: () => void) => {
  if (Platform.OS === 'web') {
    // eslint-disable-next-line no-alert
    window.alert(`${title}\n\n${message}`);
    onOk?.();
  } else {
    Alert.alert(title, message, [{ text: 'OK', onPress: onOk }]);
  }
};

// Unique, trimmed, non-empty string list
const uniqStrings = (values: (string | null | undefined)[]): string[] =>
  Array.from(new Set(values.map((v) => (v ?? '').trim()).filter(Boolean)));

// A text input with a live suggestion dropdown filtered from DB values as you type.
function AutocompleteRow({
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
  const filtered =
    focused
      ? suggestions
          .filter((s) => {
            const low = s.toLowerCase();
            return query.length === 0 ? true : low.includes(query) && low !== query;
          })
          .slice(0, 6)
      : [];

  return (
    <View style={[styles.acRow, focused ? styles.acRowActive : null]}>
      <View style={{ width: LABEL_WIDTH }}>
        <Text style={styles.rowLabel}>
          {label}
          {required ? <Text style={{ color: THEME.danger }}> *</Text> : null}
        </Text>
      </View>
      <View style={styles.acInputWrap}>
        <TextInput
          placeholder={placeholder}
          placeholderTextColor={THEME.placeholder}
          value={value}
          onChangeText={onChangeText}
          onFocus={() => setFocused(true)}
          // Delay so a suggestion tap registers before the list hides
          onBlur={() => setTimeout(() => setFocused(false), 150)}
          style={styles.acInput}
        />
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
        {footer}
      </View>
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
  const [brand, setBrand] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(!isEditMode);

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
          // Refresh the vendor suggestions so the new vendor shows up immediately
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
      setBrand((existingProduct as any)?.brand ?? '');
      setDescription((existingProduct as any)?.description ?? '');
      setHydrated(true);
    }
  }, [isEditMode, existingProduct, hydrated]);

  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const createPurchase = useCreatePurchase();
  const isSaving = createProduct.isPending || updateProduct.isPending || createPurchase.isPending;

  // Pull existing products + vendors from the DB to power the autocomplete fields.
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

  // Response may be a raw array or wrapped ({ data | items | products | vendors }).
  const toArray = (d: any): any[] =>
    Array.isArray(d) ? d : d?.data ?? d?.items ?? d?.products ?? d?.vendors ?? [];

  const productList = toArray(productsData);
  const vendorList = toArray(vendorsData);

  const categorySuggestions = uniqStrings(productList.map((p: any) => p?.category));
  const brandSuggestions = uniqStrings(productList.map((p: any) => p?.brand));
  const vendorSuggestions = uniqStrings(vendorList.map((v: any) => v?.name));

  const createVendor = useCreateVendor();

  // Resolve the typed/selected vendor name to an actual vendor row (need its id for the purchase FK).
  const findMatchedVendor = (): any | undefined => {
    const q = vendor.trim().toLowerCase();
    if (!q) return undefined;
    return vendorList.find((v: any) => (v?.name ?? '').trim().toLowerCase() === q);
  };

  const handleSave = () => {
    setError(null);

    // Validate all required fields (the ones marked * in the form)
    if (barcode.trim().length === 0) {
      setError('Enter the barcode number');
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

    // Vendor is optional overall, but if something is typed it must match an existing vendor
    // (we need a real vendor_id to record the purchase against).
    const matchedVendor = !isEditMode ? findMatchedVendor() : undefined;
    if (!isEditMode && vendor.trim().length > 0 && !matchedVendor) {
      setError('Select an existing vendor from the list, or tap "+ Add Vendor" to create one first.');
      return;
    }

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
    };

    const goToStock = () => {
      showAlert(
        'Success',
        isEditMode ? 'Product updated successfully' : 'Product added successfully',
        () => {
          router.replace('/(tabs)/current-stock' as any);
        }
      );
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

    // Create mode: create the product, then (if a vendor was selected) record a purchase
    // from that vendor for this stock so it shows up in Purchase Report.
    createProduct.mutate(
      { data: payload },
      {
        onSuccess: (createdProduct: any) => {
          invalidateProductQueries();

          if (!matchedVendor) {
            goToStock();
            return;
          }

          createPurchase.mutate(
            {
              data: {
                business_id: business.id,
                vendor_id: matchedVendor.id,
                amount_paid: 0, // pending — pay vendor later
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
                goToStock();
              },
              onError: () => {
                // Product was saved fine; only the purchase record failed.
                setError('Product saved, but recording the purchase failed. Please add it from Purchases.');
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
    setBrand('');
    setDescription('');
    setError(null);
  };

  if (isEditMode && isLoadingProduct && !hydrated) {
    return (
      <View style={{ flex: 1, backgroundColor: THEME.background, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color={THEME.primary} />
      </View>
    );
  }

  return (
    <>
      <KeyboardAwareScrollViewCompat
        style={{ flex: 1, backgroundColor: THEME.background }}
        contentContainerStyle={{ padding: 20, paddingBottom: insets.bottom + 32 }}
        bottomOffset={40}
      >
        {/* Error Message */}
        {error ? <View style={styles.errorContainer}><Text style={styles.errorText}>{error}</Text></View> : null}

        {/* Flat field list — label left, input right */}
        <View style={styles.fieldList}>
          <FormField
            layout="row"
            labelWidth={LABEL_WIDTH}
            label="Barcode Number"
            required
            placeholder="Enter barcode"
            value={barcode}
            onChangeText={setBarcode}
            keyboardType="number-pad"
          />

          <FormField
            layout="row"
            labelWidth={LABEL_WIDTH}
            label="Product Name"
            required
            placeholder="Enter product name"
            value={name}
            onChangeText={setName}
          />

          <AutocompleteRow
            label="Category"
            placeholder="Enter category"
            value={category}
            onChangeText={setCategory}
            suggestions={categorySuggestions}
          />

          <AutocompleteRow
            label="Brand"
            placeholder="Enter brand"
            value={brand}
            onChangeText={setBrand}
            suggestions={brandSuggestions}
          />

          <AutocompleteRow
            label="Vendor"
            placeholder="Select or enter vendor"
            value={vendor}
            onChangeText={setVendor}
            suggestions={vendorSuggestions}
            footer={
              <TouchableOpacity onPress={() => setVendorModalVisible(true)} style={styles.addVendorLink}>
                <Text style={styles.addVendorLinkText}>+ Add Vendor</Text>
              </TouchableOpacity>
            }
          />

          <FormField
            layout="row"
            labelWidth={LABEL_WIDTH}
            label="Cost Price"
            required
            placeholder="0.00"
            keyboardType="decimal-pad"
            value={costPrice}
            onChangeText={setCostPrice}
          />

          <FormField
            layout="row"
            labelWidth={LABEL_WIDTH}
            label="Selling Price"
            required
            placeholder="0.00"
            keyboardType="decimal-pad"
            value={sellingPrice}
            onChangeText={setSellingPrice}
          />

          <FormField
            layout="row"
            labelWidth={LABEL_WIDTH}
            label="GST %"
            placeholder="0"
            keyboardType="decimal-pad"
            value={gstRate}
            onChangeText={setGstRate}
          />

          <FormField
            layout="row"
            labelWidth={LABEL_WIDTH}
            label="Quantity"
            required
            placeholder="0"
            keyboardType="number-pad"
            value={stockQty}
            onChangeText={setStockQty}
          />

          <FormField
            layout="row"
            labelWidth={LABEL_WIDTH}
            label="Unit"
            placeholder="pcs"
            value={unit}
            onChangeText={setUnit}
          />

          <View style={styles.descriptionRow}>
            <Text style={styles.rowLabel}>Description</Text>
            <TextInput
              multiline
              numberOfLines={3}
              placeholder="Enter product description..."
              placeholderTextColor={THEME.placeholder}
              value={description}
              onChangeText={setDescription}
              style={styles.descriptionBox}
            />
          </View>
        </View>

        <View style={styles.footerDivider} />

        {/* Footer Buttons */}
        <View style={styles.footerButtons}>
          <PrimaryButton
            label={isEditMode ? 'Update' : 'Submit'}
            onPress={handleSave}
            loading={isSaving}
            style={styles.submitBtn}
          />
          <TouchableOpacity onPress={handleReset} style={styles.resetBtn} activeOpacity={0.7}>
            <Text style={styles.resetBtnText}>Reset</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollViewCompat>

      {/* Create Vendor modal */}
      <Modal
        visible={isVendorModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setVendorModalVisible(false)}
      >
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
                <Text style={styles.resetBtnText}>Cancel</Text>
              </TouchableOpacity>
              <PrimaryButton label="Save Vendor" onPress={handleCreateVendor} style={styles.submitBtn} />
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  errorContainer: {
    backgroundColor: THEME.dangerBg,
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: THEME.danger,
  },
  errorText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#991B1B',
    fontFamily: FONT_FAMILY,
  },
  fieldList: {
    width: '100%',
  },
  rowWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  rowLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: THEME.label,
    marginBottom: 6,
    fontFamily: FONT_FAMILY,
  },
  acRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 8,
    zIndex: 1,
  },
  acRowActive: {
    // Raise the focused row so its dropdown overlays the rows below.
    zIndex: 20,
    ...(Platform.OS === 'android' ? { elevation: 20 } : {}),
  },
  acInputWrap: {
    flex: 1,
    position: 'relative',
  },
  acInput: {
    borderWidth: 1,
    borderColor: THEME.border,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 13,
    color: THEME.text,
    backgroundColor: THEME.background,
    fontFamily: FONT_FAMILY,
  },
  suggestionBox: {
    position: 'absolute',
    top: 42,
    left: 0,
    right: 0,
    backgroundColor: THEME.background,
    borderWidth: 1,
    borderColor: THEME.border,
    borderRadius: 8,
    overflow: 'hidden',
    zIndex: 30,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
  },
  suggestionItem: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: THEME.divider,
  },
  suggestionText: {
    fontSize: 13,
    color: THEME.text,
    fontFamily: FONT_FAMILY,
  },
  vendorInputWrap: {
    flex: 1,
  },
  vendorInput: {
    borderWidth: 1,
    borderColor: THEME.border,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 13,
    maxWidth: 180,
    color: THEME.text,
    backgroundColor: THEME.background,
    fontFamily: FONT_FAMILY,
  },
  addVendorLink: {
    marginTop: 6,
    alignSelf: 'flex-start',
  },
  addVendorLinkText: {
    fontSize: 12,
    fontWeight: '600',
    color: THEME.primary,
    fontFamily: FONT_FAMILY,
  },
  descriptionRow: {
    paddingVertical: 10,
  },
  descriptionBox: {
    minHeight: 72,
    borderWidth: 1,
    borderColor: THEME.border,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    textAlignVertical: 'top',
    fontSize: 14,
    backgroundColor: THEME.background,
    color: THEME.text,
    fontFamily: FONT_FAMILY,
  },
  footerDivider: {
    height: 1,
    backgroundColor: THEME.divider,
    marginTop: 8,
    marginBottom: 16,
  },
  footerButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  submitBtn: {
    backgroundColor: THEME.primary,
    paddingHorizontal: 24,
    alignSelf: 'flex-start',
  },
  resetBtn: {
    backgroundColor: THEME.background,
    borderWidth: 1,
    borderColor: THEME.border,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    alignSelf: 'flex-start',
    justifyContent: 'center',
    alignItems: 'center',
  },
  resetBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: THEME.text,
    fontFamily: FONT_FAMILY,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: THEME.background,
    borderRadius: 12,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: THEME.text,
    marginBottom: 16,
    fontFamily: FONT_FAMILY,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 20,
  },
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