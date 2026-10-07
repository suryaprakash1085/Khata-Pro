import React, { useContext, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import * as Location from 'expo-location';
import { AddressContext, Address } from '../../context/AddressContext';
import { CartContext } from '../../context/CartContext';
import { API_BASE_URL } from '../../config/api';


const COLORS = {
  primary: '#6C5CE7',
  primaryDark: '#5541D7',
  primaryLight: '#F1EEFF',
  primarySoft: '#EDE9FE',
  accent: '#8B7CF6',
  danger: '#EF4444',
  text: '#1E1B2E',
  textMuted: '#8A85A0',
  border: '#EFEDF7',
  bg: '#FAFAFD',
  white: '#FFFFFF',
};

const FONT = Platform.select({ ios: 'Times New Roman', android: 'serif', default: 'Times New Roman' });

type AddressType = Address['type'];
const TYPES: { key: AddressType; icon: string }[] = [
  { key: 'Home', icon: 'home-outline' },
  { key: 'Work', icon: 'briefcase-outline' },
  { key: 'Other', icon: 'location-outline' },
];

interface FormState {
  type: AddressType;
  address: string;
  city: string;
  state: string;
  pincode: string;
  landmark: string;
  phone: string;
  isDefault: boolean;
  latitude?: number;
  longitude?: number;
}

const EMPTY_FORM: FormState = {
  type: 'Home',
  address: '',
  city: '',
  state: '',
  pincode: '',
  landmark: '',
  phone: '',
  isDefault: false,
};

// Hard timeout so a slow server can never leave the UI hanging on a spinner.
const fetchWithTimeout = async (
  url: string,
  options: RequestInit = {},
  timeoutMs: number = 10000
): Promise<Response> => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
};

function formatLine(a: Address): string {
  return [a.address, a.city, a.state, a.pincode].filter(Boolean).join(', ');
}

interface Props {
  navigation: any;
  route: any;
}

const AddressSelectionScreen: React.FC<Props> = ({ navigation, route }) => {
  const {
    totalAmount,
    restaurantName,
    cartItems,
    discount = 0,
    promoCode = null,
    promoId = null,
  } = route?.params || {};

  const {
    addresses,
    selectedAddress,
    loading,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
    setSelectedAddress,
    refreshAddresses,
  } = useContext(AddressContext);
  const { getTotalPrice, getTotalItems } = useContext(CartContext);

  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [saving, setSaving] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [locating, setLocating] = useState(false);
  const [proceeding, setProceeding] = useState(false);

  const isFirstAddress = addresses.length === 0;
  const editing = editingId !== null;
  const totalPrice = totalAmount || getTotalPrice();
  const totalItems = getTotalItems();

  // ------------------------------------------------------------------
  // Redirect to PaymentScreen (same behaviour + params as the original)
  // ------------------------------------------------------------------
  const calculateDeliveryFee = async (address: Address): Promise<{ fee: number; breakdown: any }> => {
    const businessId = cartItems?.[0]?.restaurantId ? Number(cartItems[0].restaurantId) : undefined;
    if (!businessId || !address.latitude || !address.longitude) {
      console.warn('Missing businessId or address coordinates - using fallback fee 30', {
        businessId,
        lat: address.latitude,
        lng: address.longitude,
      });
      return { fee: 30, breakdown: null };
    }

    try {
      // API_BASE_URL already ends with /api - do NOT add another /api here
      const response = await fetchWithTimeout(
        `${API_BASE_URL}/delivery-fees/calculate`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            business_id: businessId,
            customer_latitude: address.latitude,
            customer_longitude: address.longitude,
          }),
        },
        8000
      );
      const data = await response.json();
      if (!response.ok) {
        console.error('Delivery fee calculate error:', response.status, data);
        return { fee: 30, breakdown: null };
      }
      return { fee: data.delivery_fee, breakdown: data };
    } catch (err) {
      console.error('Network error calculating delivery fee:', err);
      return { fee: 30, breakdown: null };
    }
  };

  const handleProceed = async () => {
    if (!selectedAddress || proceeding) return;
    setProceeding(true);
    try {
      const { fee, breakdown } = await calculateDeliveryFee(selectedAddress);

      const items = cartItems || [];
      const gstTotal = items.reduce((sum: number, item: any) => {
        const itemTotal = (item.price || 0) * (item.quantity || 1);
        return sum + itemTotal * ((item.gst_rate || 0) / 100);
      }, 0);
      const roundedGst = Math.round(gstTotal);
      const subtotal = items.reduce(
        (sum: number, item: any) => sum + (item.price || 0) * (item.quantity || 1),
        0
      );

      navigation.navigate('PaymentScreen', {
        address: selectedAddress,
        totalAmount: subtotal + fee + roundedGst,
        subtotal,
        deliveryFee: fee,
        deliveryFeeBreakdown: breakdown,
        tax: roundedGst,
        discount,
        promoCode,
        promoId,
        restaurantName,
        cartItems,
        orderId: 'ORD-' + Date.now().toString().slice(-6),
      });
    } finally {
      setProceeding(false);
    }
  };

  // ------------------------------------------------------------------
  // Form helpers
  // ------------------------------------------------------------------
  const openAdd = () => {
    setEditingId(null);
    setForm({ ...EMPTY_FORM, isDefault: isFirstAddress });
    setErrors({});
    setModalVisible(true);
  };

  const openEdit = (a: Address) => {
    setEditingId(a.id);
    setForm({
      type: a.type,
      address: a.address,
      city: a.city || '',
      state: a.state || '',
      pincode: a.pincode || '',
      landmark: a.landmark || '',
      phone: a.phone || '',
      isDefault: a.isDefault,
      latitude: a.latitude,
      longitude: a.longitude,
    });
    setErrors({});
    setModalVisible(true);
  };

  const closeModal = () => {
    if (saving) return;
    setModalVisible(false);
  };

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const validate = (): boolean => {
    const next: Partial<Record<keyof FormState, string>> = {};
    if (!form.address.trim()) next.address = 'Enter the house, street and area';
    if (!form.city.trim()) next.city = 'Enter the city';
    if (!/^\d{6}$/.test(form.pincode.trim())) next.pincode = 'Enter a 6-digit pincode';
    if (form.phone.trim() && !/^\d{10}$/.test(form.phone.trim())) {
      next.phone = 'Phone number must be exactly 10 digits';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  // ------------------------------------------------------------------
  // Live location: fills address/city/state/pincode and lat/lng
  // ------------------------------------------------------------------
  const detectLocation = async () => {
    if (locating) return;
    setLocating(true);
    try {
      let latitude: number;
      let longitude: number;

      if (Platform.OS === 'web') {
        const pos: any = await new Promise((resolve, reject) => {
          if (typeof navigator === 'undefined' || !navigator.geolocation) {
            reject(new Error('Geolocation is not supported by this browser.'));
            return;
          }
          // Desktop browsers have no GPS chip - low accuracy uses WiFi/IP and is much faster
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: false,
            timeout: 20000,
            maximumAge: 60000,
          });
        });
        latitude = pos.coords.latitude;
        longitude = pos.coords.longitude;
      } else {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          throw new Error('Location permission was denied. Allow it in your device settings.');
        }
        const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
        latitude = loc.coords.latitude;
        longitude = loc.coords.longitude;
      }

      let address = '';
      let city = '';
      let state = '';
      let pincode = '';

      try {
        if (Platform.OS === 'web') {
          const res = await fetchWithTimeout(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
            { headers: { Accept: 'application/json' } },
            8000
          );
          if (res.ok) {
            const data = await res.json();
            const a = data?.address || {};
            city = a.city || a.town || a.village || a.suburb || a.county || '';
            state = a.state || '';
            pincode = a.postcode || '';
            address = data?.display_name || [a.road, a.suburb, a.city].filter(Boolean).join(', ');
          }
        } else {
          const results = await Location.reverseGeocodeAsync({ latitude, longitude });
          const r = results[0];
          if (r) {
            city = r.city || r.district || r.subregion || '';
            state = r.region || '';
            pincode = r.postalCode || '';
            address = [r.name, r.street, r.district, r.city].filter(Boolean).join(', ');
          }
        }
      } catch (geoErr) {
        console.error('Reverse geocode failed:', geoErr);
      }

      setForm((f) => ({
        ...f,
        address: address || f.address || `${latitude}, ${longitude}`,
        city: city || f.city,
        state: state || f.state,
        pincode: (pincode || f.pincode).replace(/\D/g, '').slice(0, 6),
        latitude,
        longitude,
      }));
      setErrors({});
      if (!address) {
        Alert.alert('Location found', 'We could not look up the street address. Please type it in.');
      }
    } catch (e: any) {
      const code = e?.code;
      let message = e?.message || 'Unable to get your current location.';
      if (code === 1) message = 'Location permission was denied. Allow it in your browser settings.';
      else if (code === 2) message = 'Location is currently unavailable.';
      else if (code === 3) message = 'Location request timed out. Check that location services are on and try again.';
      Alert.alert('Location error', message);
    } finally {
      setLocating(false);
    }
  };

  // ------------------------------------------------------------------
  // Save / delete / select
  // ------------------------------------------------------------------
  const handleSave = async () => {
    if (!validate() || saving) return;
    setSaving(true);
    try {
      if (editing && editingId) {
        await updateAddress(editingId, {
          type: form.type,
          address: form.address.trim(),
          city: form.city.trim(),
          state: form.state.trim(),
          pincode: form.pincode.trim(),
          landmark: form.landmark.trim(),
          phone: form.phone.trim(),
          isDefault: form.isDefault,
          ...(form.latitude !== undefined && form.longitude !== undefined
            ? { latitude: form.latitude, longitude: form.longitude }
            : {}),
        });
        setModalVisible(false);
      } else {
        const created = await addAddress({
          type: form.type,
          address: form.address.trim(),
          city: form.city.trim(),
          state: form.state.trim(),
          pincode: form.pincode.trim(),
          ...(form.landmark.trim() ? { landmark: form.landmark.trim() } : {}),
          ...(form.phone.trim() ? { phone: form.phone.trim() } : {}),
          ...(form.latitude !== undefined && form.longitude !== undefined
            ? { latitude: form.latitude, longitude: form.longitude }
            : {}),
          isDefault: form.isDefault || isFirstAddress,
        });
        if (created) {
          setModalVisible(false);
          setSelectedAddress(created); // select what was just added
        } else {
          Alert.alert('Could not save address', 'Check your connection and try again.');
        }
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (a: Address) => {
    const doDelete = () => deleteAddress(a.id);
    if (Platform.OS === 'web') {
      // Alert.alert with multiple buttons is unreliable on react-native-web
      if (typeof window !== 'undefined' && window.confirm(`Delete your ${a.type} address?`)) doDelete();
      return;
    }
    Alert.alert('Delete address', `Remove your ${a.type} address? This cannot be undone.`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: doDelete },
    ]);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshAddresses();
    setRefreshing(false);
  };

  const sorted = useMemo(
    () => [...addresses].sort((a, b) => Number(b.isDefault) - Number(a.isDefault)),
    [addresses]
  );

  // ------------------------------------------------------------------
  // UI
  // ------------------------------------------------------------------
  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.iconBtn} hitSlop={8} accessibilityLabel="Go back">
          <Icon name="arrow-back" size={22} color={COLORS.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Delivery addresses</Text>
        <View style={styles.iconBtn} />
      </View>

      {loading && !refreshing ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.mutedText}>Loading your addresses…</Text>
        </View>
      ) : (
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={styles.content}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />}
        >
          <View style={styles.column}>
            <Pressable
              onPress={openAdd}
              style={({ pressed }) => [styles.addCard, pressed && { opacity: 0.85 }]}
              accessibilityRole="button"
            >
              <View style={styles.addIcon}>
                <Icon name="add" size={20} color={COLORS.white} />
              </View>
              <Text style={styles.addText}>Add a new address</Text>
            </Pressable>

            {sorted.length === 0 ? (
              <View style={styles.empty}>
                <View style={styles.emptyIcon}>
                  <Icon name="location-outline" size={30} color={COLORS.primary} />
                </View>
                <Text style={styles.emptyTitle}>No saved addresses</Text>
                <Text style={styles.emptyBody}>Add a delivery address to continue with your order.</Text>
              </View>
            ) : (
              sorted.map((a) => {
                const isSelected = selectedAddress?.id === a.id;
                const icon = TYPES.find((t) => t.key === a.type)?.icon ?? 'location-outline';
                return (
                  <Pressable
                    key={a.id}
                    onPress={() => setSelectedAddress(a)}
                    style={[styles.card, isSelected && styles.cardSelected]}
                    accessibilityRole="button"
                    accessibilityLabel={`Select ${a.type} address`}
                  >
                    <View style={styles.cardTop}>
                      <View style={styles.typeIcon}>
                        <Icon name={icon} size={20} color={COLORS.primary} />
                      </View>
                      <View style={{ flex: 1 }}>
                        <View style={styles.titleRow}>
                          <Text style={styles.cardTitle}>{a.type}</Text>
                          {a.isDefault && (
                            <View style={styles.defaultBadge}>
                              <Text style={styles.defaultBadgeText}>Default</Text>
                            </View>
                          )}
                          {!!a.latitude && !!a.longitude && (
                            <View style={styles.pinTag}>
                              <Icon name="locate-outline" size={12} color={COLORS.primaryDark} />
                              <Text style={styles.pinTagText}>Live location</Text>
                            </View>
                          )}
                        </View>
                        <Text style={styles.cardAddress}>{formatLine(a)}</Text>
                        {!!a.landmark && <Text style={styles.cardMeta}>Landmark: {a.landmark}</Text>}
                        {!!a.phone && <Text style={styles.cardMeta}>Phone: {a.phone}</Text>}
                      </View>
                      <View style={[styles.radio, isSelected && styles.radioOn]}>
                        {isSelected && <Icon name="checkmark" size={14} color={COLORS.white} />}
                      </View>
                    </View>

                    <View style={styles.actions}>
                      {!a.isDefault && (
                        <Pressable onPress={() => setDefaultAddress(a.id)} style={styles.actionBtn} hitSlop={6}>
                          <Icon name="star-outline" size={15} color={COLORS.primary} />
                          <Text style={styles.actionText}>Set as default</Text>
                        </Pressable>
                      )}
                      <Pressable onPress={() => openEdit(a)} style={styles.actionBtn} hitSlop={6}>
                        <Icon name="create-outline" size={15} color={COLORS.primary} />
                        <Text style={styles.actionText}>Edit</Text>
                      </Pressable>
                      <Pressable onPress={() => handleDelete(a)} style={styles.actionBtn} hitSlop={6}>
                        <Icon name="trash-outline" size={15} color={COLORS.danger} />
                        <Text style={[styles.actionText, { color: COLORS.danger }]}>Delete</Text>
                      </Pressable>
                    </View>
                  </Pressable>
                );
              })
            )}
          </View>
        </ScrollView>
      )}

      {/* Bottom bar - same as the original: total, item count, and the button that goes to PaymentScreen */}
      {!!selectedAddress && (
        <View style={styles.bottomBar}>
          <View>
            <Text style={styles.bottomTotal}>₹{totalPrice}</Text>
            <Text style={styles.bottomItems}>{totalItems} items</Text>
          </View>
          <Pressable
            onPress={handleProceed}
            disabled={proceeding}
            style={({ pressed }) => [styles.deliverBtn, (pressed || proceeding) && { opacity: 0.85 }]}
            accessibilityRole="button"
          >
            {proceeding ? (
              <ActivityIndicator color={COLORS.white} />
            ) : (
              <>
                <Text style={styles.deliverText}>Deliver to {selectedAddress.type}</Text>
                <Icon name="arrow-forward" size={18} color={COLORS.white} />
              </>
            )}
          </Pressable>
        </View>
      )}

      {/* Add / edit sheet */}
      <Modal visible={modalVisible} animationType="slide" transparent onRequestClose={closeModal}>
        <KeyboardAvoidingView style={styles.modalWrap} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <Pressable style={styles.backdrop} onPress={closeModal} />
          <View style={styles.sheet}>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>{editing ? 'Edit address' : 'New address'}</Text>
              <Pressable onPress={closeModal} hitSlop={8} accessibilityLabel="Close">
                <Icon name="close" size={24} color={COLORS.textMuted} />
              </Pressable>
            </View>

            <ScrollView style={{ flexShrink: 1 }} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
              <Pressable
                onPress={detectLocation}
                disabled={locating}
                style={({ pressed }) => [styles.locBtn, (pressed || locating) && { opacity: 0.85 }]}
                accessibilityRole="button"
              >
                {locating ? (
                  <ActivityIndicator size="small" color={COLORS.primary} />
                ) : (
                  <>
                    <Icon name="locate-outline" size={20} color={COLORS.primary} />
                    <Text style={styles.locBtnText}>Use live location</Text>
                  </>
                )}
              </Pressable>
              {form.latitude !== undefined && form.longitude !== undefined && (
                <Text style={styles.locOk}>Location saved with this address, so your delivery fee uses the real distance.</Text>
              )}

              <Text style={styles.label}>Address type</Text>
              <View style={styles.chips}>
                {TYPES.map((t) => {
                  const on = form.type === t.key;
                  return (
                    <Pressable
                      key={t.key}
                      onPress={() => set('type', t.key)}
                      style={[styles.chip, on && styles.chipOn]}
                      accessibilityRole="button"
                      accessibilityState={{ selected: on }}
                    >
                      <Icon name={t.icon} size={16} color={on ? COLORS.white : COLORS.primary} />
                      <Text style={[styles.chipText, on && { color: COLORS.white }]}>{t.key}</Text>
                    </Pressable>
                  );
                })}
              </View>

              <Field
                label="House, street and area"
                value={form.address}
                onChangeText={(v) => set('address', v)}
                error={errors.address}
                multiline
                maxLength={500}
              />
              <View style={styles.row}>
                <View style={{ flex: 1 }}>
                  <Field label="City" value={form.city} onChangeText={(v) => set('city', v)} error={errors.city} />
                </View>
                <View style={{ flex: 1 }}>
                  <Field label="State" value={form.state} onChangeText={(v) => set('state', v)} />
                </View>
              </View>
              <View style={styles.row}>
                <View style={{ flex: 1 }}>
                  <Field
                    label="Pincode"
                    value={form.pincode}
                    onChangeText={(v) => set('pincode', v.replace(/\D/g, '').slice(0, 6))}
                    error={errors.pincode}
                    keyboardType="number-pad"
                    maxLength={6}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Field
                    label="Phone (optional)"
                    value={form.phone}
                    onChangeText={(v) => set('phone', v.replace(/\D/g, '').slice(0, 10))}
                    error={errors.phone}
                    keyboardType="phone-pad"
                    maxLength={10}
                  />
                </View>
              </View>
              <Field
                label="Landmark (optional)"
                value={form.landmark}
                onChangeText={(v) => set('landmark', v)}
                maxLength={255}
              />

              <View style={styles.switchRow}>
                <Text style={styles.switchLabel}>Make this my default address</Text>
                <Switch
                  value={form.isDefault}
                  onValueChange={(v) => set('isDefault', v)}
                  disabled={editing && form.isDefault}
                  trackColor={{ false: COLORS.border, true: COLORS.accent }}
                  thumbColor={COLORS.white}
                />
              </View>
            </ScrollView>

            <Pressable
              onPress={handleSave}
              disabled={saving}
              style={({ pressed }) => [styles.saveBtn, (pressed || saving) && { opacity: 0.85 }]}
              accessibilityRole="button"
            >
              {saving ? (
                <ActivityIndicator color={COLORS.white} />
              ) : (
                <Text style={styles.saveText}>{editing ? 'Save changes' : 'Save address'}</Text>
              )}
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
};

interface FieldProps extends React.ComponentProps<typeof TextInput> {
  label: string;
  error?: string;
}

function Field({ label, error, style, ...rest }: FieldProps) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        {...rest}
        placeholderTextColor={COLORS.textMuted}
        style={[
          styles.input,
          rest.multiline && { minHeight: 72, textAlignVertical: 'top' },
          !!error && { borderColor: COLORS.danger },
          style,
        ]}
      />
      {!!error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.bg },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  iconBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontFamily: FONT, fontSize: 20, fontWeight: '700', color: COLORS.text },

  content: { padding: 16, paddingBottom: 32, alignItems: 'center' },
  column: { width: '100%', maxWidth: 640 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  mutedText: { fontFamily: FONT, fontSize: 15, color: COLORS.textMuted },

  addCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: COLORS.accent,
    backgroundColor: COLORS.primaryLight,
    marginBottom: 16,
  },
  addIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addText: { fontFamily: FONT, fontSize: 16, fontWeight: '700', color: COLORS.primaryDark },

  card: {
    backgroundColor: COLORS.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 14,
    marginBottom: 12,
  },
  cardSelected: { borderColor: COLORS.primary, borderWidth: 1.5, backgroundColor: '#FDFCFF' },
  cardTop: { flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
  typeIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: COLORS.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 8, marginBottom: 3 },
  cardTitle: { fontFamily: FONT, fontSize: 17, fontWeight: '700', color: COLORS.text },
  defaultBadge: { backgroundColor: COLORS.primarySoft, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 999 },
  defaultBadgeText: { fontFamily: FONT, fontSize: 12, fontWeight: '700', color: COLORS.primaryDark },
  pinTag: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  pinTagText: { fontFamily: FONT, fontSize: 12, color: COLORS.primaryDark },
  cardAddress: { fontFamily: FONT, fontSize: 15, lineHeight: 21, color: COLORS.text },
  cardMeta: { fontFamily: FONT, fontSize: 14, color: COLORS.textMuted, marginTop: 3 },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOn: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 18,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  actionBtn: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  actionText: { fontFamily: FONT, fontSize: 14, fontWeight: '700', color: COLORS.primary },

  empty: { alignItems: 'center', paddingVertical: 48, paddingHorizontal: 24 },
  emptyIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  emptyTitle: { fontFamily: FONT, fontSize: 18, fontWeight: '700', color: COLORS.text, marginBottom: 6 },
  emptyBody: { fontFamily: FONT, fontSize: 15, lineHeight: 22, color: COLORS.textMuted, textAlign: 'center' },

  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  bottomTotal: { fontFamily: FONT, fontSize: 22, fontWeight: '700', color: COLORS.text },
  bottomItems: { fontFamily: FONT, fontSize: 13, color: COLORS.textMuted },
  deliverBtn: {
    minWidth: 190,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 13,
    borderRadius: 12,
  },
  deliverText: { fontFamily: FONT, fontSize: 16, fontWeight: '700', color: COLORS.white },

  modalWrap: { flex: 1, justifyContent: 'flex-end', alignItems: 'center' },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(30,27,46,0.45)' },
  sheet: {
    width: '100%',
    maxWidth: 640,
    maxHeight: '92%',
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: Platform.OS === 'ios' ? 32 : 18,
  },
  sheetHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sheetTitle: { fontFamily: FONT, fontSize: 20, fontWeight: '700', color: COLORS.text },

  locBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: COLORS.accent,
    backgroundColor: COLORS.primaryLight,
    marginBottom: 8,
  },
  locBtnText: { fontFamily: FONT, fontSize: 15, fontWeight: '700', color: COLORS.primaryDark },
  locOk: { fontFamily: FONT, fontSize: 13, color: COLORS.primaryDark, marginBottom: 12 },

  label: { fontFamily: FONT, fontSize: 14, fontWeight: '700', color: COLORS.text, marginBottom: 6, marginTop: 4 },
  chips: { flexDirection: 'row', gap: 10, marginBottom: 14 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: COLORS.primary,
    backgroundColor: COLORS.white,
  },
  chipOn: { backgroundColor: COLORS.primary },
  chipText: { fontFamily: FONT, fontSize: 15, fontWeight: '700', color: COLORS.primary },

  row: { flexDirection: 'row', gap: 12 },
  field: { marginBottom: 12 },
  input: {
    fontFamily: FONT,
    fontSize: 16,
    color: COLORS.text,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: COLORS.bg,
  },
  error: { fontFamily: FONT, fontSize: 13, color: COLORS.danger, marginTop: 4 },

  switchRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 8, marginBottom: 8 },
  switchLabel: { fontFamily: FONT, fontSize: 15, color: COLORS.text, flex: 1, paddingRight: 12 },

  saveBtn: { backgroundColor: COLORS.primary, borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginTop: 8 },
  saveText: { fontFamily: FONT, fontSize: 17, fontWeight: '700', color: COLORS.white },
});

export default AddressSelectionScreen;