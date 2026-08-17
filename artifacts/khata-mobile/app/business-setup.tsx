import React, { useState } from 'react';
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { KeyboardAwareScrollViewCompat } from '@/components/KeyboardAwareScrollViewCompat';
import { Feather } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import { useCreateBusiness, type Business } from '@workspace/api-client-react';
import { useBusiness } from '@/contexts/BusinessContext';
import { useAuth } from '@/contexts/AuthContext';
import { PrimaryButton } from '@/components/PrimaryButton';
import { FormField } from '@/components/FormField';
import { SelectField } from '@/components/SelectField';
import * as ImagePicker from 'expo-image-picker';

const BUSINESS_TYPES = ['Retail Store', 'Wholesale', 'Manufacturing', 'Services', 'Distribution', 'Other'];

const INDIAN_STATES = [
  'Andhra Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Delhi', 'Goa', 'Gujarat',
  'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala',
  'Madhya Pradesh', 'Maharashtra', 'Odisha', 'Punjab', 'Rajasthan',
  'Tamil Nadu', 'Telangana', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
];

const COUNTRIES = ['India', 'United States', 'United Arab Emirates', 'Singapore', 'United Kingdom'];

const DESKTOP_BREAKPOINT = 820;

export default function BusinessSetupScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const isWide = width >= DESKTOP_BREAKPOINT;
  const { signOut } = useAuth();
  const { setBusiness } = useBusiness();

  const [name, setName] = useState('');
  const [type, setType] = useState(BUSINESS_TYPES[0]);
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [gstin, setGstin] = useState('');

  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('India');

  const [logoUri, setLogoUri] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const createBusiness = useCreateBusiness();
  const [description, setDescription] = useState('');

  const handlePickLogo = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
      base64: true,
      allowsEditing: true,
      aspect: [1, 1],
    });

    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];
      // Stored as a data URI for now — simplest path with no extra file-storage
      // infra. Swap for a real upload (S3 / local disk) later if logos need
      // to be served at scale.
      const dataUri = asset.base64 ? `data:image/jpeg;base64,${asset.base64}` : asset.uri;
      setLogoUri(dataUri);
    }
  };

  const validate = () => {
    const next: Record<string, string> = {};
    if (name.trim().length < 2) next.name = 'Enter your business name';
    if (!phone.trim()) next.phone = 'Enter a phone number';
    if (!email.trim()) next.email = 'Enter an email address';
    if (!addressLine1.trim()) next.addressLine1 = 'Enter address line 1';
    if (!city.trim()) next.city = 'Enter city';
    if (!state.trim()) next.state = 'Select a state';
    if (!postalCode.trim()) next.postalCode = 'Enter postal code';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleCreate = () => {
    if (!validate()) return;

    createBusiness.mutate(
      {
        data: {
          business_name: name.trim(),
          business_type: type,
          phone: phone.trim(),
          email: email.trim(),
          gstin: gstin.trim() || undefined,
          description: description.trim() || undefined,
          address_line1: addressLine1.trim(),
          address_line2: addressLine2.trim() || undefined,
          city: city.trim(),
          state,
          postal_code: postalCode.trim(),
          country,
          logo_url: logoUri || undefined,
        },
      },
      {
        onSuccess: (biz: Business) => setBusiness(biz),
        onError: () => setErrors((e) => ({ ...e, form: 'Could not create business. Please try again.' })),
      },
    );
  };

  const steps = [
    { n: 1, title: 'Business Info', subtitle: 'Basic information', active: true },
    { n: 2, title: 'Preferences', subtitle: 'Business preferences', active: false },
    { n: 3, title: 'Tax & Currency', subtitle: 'Tax and currency setup', active: false },
    { n: 4, title: 'Finish Setup', subtitle: 'Complete setup', active: false },
  ];

  return (
    <View style={[styles.screen, isWide && { flexDirection: 'row' }]}>
      {/* Sidebar — only on wide/web screens */}
      {isWide && (
        <View style={[styles.sidebar, { backgroundColor: colors.primary, paddingTop: insets.top + 28 }]}>
          <View style={styles.sidebarBrandRow}>
            <View style={[styles.sidebarLogo, { backgroundColor: colors.primaryForeground + '22' }]}>
              <Feather name="book-open" size={22} color={colors.primaryForeground} />
            </View>
            <Text style={[styles.sidebarBrand, { color: colors.primaryForeground }]}>Khata-Pro POS</Text>
          </View>

          <View style={styles.stepsWrap}>
            {steps.map((s, i) => (
              <View key={s.n} style={styles.stepRow}>
                <View style={styles.stepCol}>
                  <View
                    style={[
                      styles.stepBadge,
                      s.active
                        ? { backgroundColor: colors.primaryForeground }
                        : { backgroundColor: colors.primaryForeground + '33' },
                    ]}
                  >
                    <Text style={[styles.stepBadgeText, { color: s.active ? colors.primary : colors.primaryForeground }]}>
                      {s.n}
                    </Text>
                  </View>
                  {i < steps.length - 1 && (
                    <View style={[styles.stepConnector, { backgroundColor: colors.primaryForeground + '33' }]} />
                  )}
                </View>
                <View style={{ paddingBottom: 26 }}>
                  <Text
                    style={[
                      styles.stepTitle,
                      { color: s.active ? colors.primaryForeground : colors.primaryForeground + 'AA' },
                    ]}
                  >
                    {s.title}
                  </Text>
                  <Text style={[styles.stepSubtitle, { color: colors.primaryForeground + '88' }]}>{s.subtitle}</Text>
                </View>
              </View>
            ))}
          </View>

          <View style={[styles.tipCard, { backgroundColor: colors.primaryForeground + '15' }]}>
            <Feather name="shield" size={18} color={colors.primaryForeground} />
            <Text style={[styles.tipText, { color: colors.primaryForeground }]}>
              Your business setup helps us to customize POS experience for you.
            </Text>
          </View>
        </View>
      )}

      {/* Form */}
      <KeyboardAwareScrollViewCompat
        style={{ flex: 1, backgroundColor: colors.background }}
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + (isWide ? 28 : 40), paddingBottom: insets.bottom + 32 },
        ]}
        bottomOffset={40}
      >
        <View style={styles.headerRow}>
          {!isWide && (
            <View style={[styles.iconWrap, { backgroundColor: colors.primary, borderRadius: colors.radius + 6 }]}>
              <Feather name="briefcase" size={24} color={colors.primaryForeground} />
            </View>
          )}
          <Text style={[styles.title, { color: colors.foreground }]}>Business Setup</Text>
          <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
            Let's get started with your business information.
          </Text>
        </View>

        {/* Business Information */}
        <View style={styles.sectionHeader}>
          <Feather name="briefcase" size={16} color={colors.primary} />
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Business Information</Text>
        </View>

        <View style={[styles.grid, isWide && styles.gridRow]}>
          <View style={isWide ? styles.gridCol : undefined}>
            <FormField
              label="Business Name"
              required
              placeholder="Sharma General Store"
              value={name}
              onChangeText={setName}
              error={errors.name}
              autoFocus
            />
          </View>
          <View style={isWide ? styles.gridCol : undefined}>
            <SelectField
              label="Business Type"
              required
              icon="shopping-bag"
              value={type}
              options={BUSINESS_TYPES}
              onChange={setType}
            />
          </View>
        </View>

        <View style={[styles.grid, isWide && styles.gridRow]}>
          <View style={isWide ? styles.gridCol : undefined}>
            <FormField
              label="Phone Number"
              required
              placeholder="+91 98765 43210"
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
              error={errors.phone}
            />
          </View>
          <View style={isWide ? styles.gridCol : undefined}>
            <FormField
              label="Email Address"
              required
              placeholder="you@business.com"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
              error={errors.email}
            />
          </View>
        </View>

        <FormField
          label="GSTIN (Optional)"
          placeholder="22AAAAA0000A1Z5"
          value={gstin}
          onChangeText={(v) => setGstin(v.toUpperCase())}
          autoCapitalize="characters"
        />

        {/* Business Address */}
        <View style={[styles.sectionHeader, { marginTop: 24 }]}>
          <Feather name="map-pin" size={16} color={colors.primary} />
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Business Address</Text>
        </View>
        
        <FormField
  label="Business Description (Optional)"
  placeholder="Tell customers a bit about your store"
  value={description}
  onChangeText={setDescription}
  multiline
  numberOfLines={3}
/>
        <FormField
          label="Address Line 1"
          required
          placeholder="123, MG Road"
          value={addressLine1}
          onChangeText={setAddressLine1}
          error={errors.addressLine1}
        />
        <FormField
          label="Address Line 2 (Optional)"
          placeholder="Near City Mall"
          value={addressLine2}
          onChangeText={setAddressLine2}
        />

        <View style={[styles.grid, isWide && styles.gridRow3]}>
          <View style={isWide ? styles.gridCol3 : undefined}>
            <FormField
              label="City"
              required
              placeholder="Chennai"
              value={city}
              onChangeText={setCity}
              error={errors.city}
            />
          </View>
          <View style={isWide ? styles.gridCol3 : undefined}>
            <SelectField
              label="State / Province"
              required
              icon="map"
              value={state}
              options={INDIAN_STATES}
              onChange={setState}
              error={errors.state}
              placeholder="Select state"
            />
          </View>
          <View style={isWide ? styles.gridCol3 : undefined}>
            <FormField
              label="Postal Code"
              required
              placeholder="600001"
              keyboardType="number-pad"
              value={postalCode}
              onChangeText={setPostalCode}
              error={errors.postalCode}
            />
          </View>
        </View>

        <SelectField
          label="Country"
          required
          icon="globe"
          value={country}
          options={COUNTRIES}
          onChange={setCountry}
        />

        {/* Business Logo */}
        <View style={[styles.sectionHeader, { marginTop: 24 }]}>
          <Feather name="image" size={16} color={colors.primary} />
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Business Logo (Optional)</Text>
        </View>

        <View style={[styles.logoSection, isWide && styles.logoSectionRow]}>
          <Pressable
            onPress={handlePickLogo}
            style={[
              styles.uploadBox,
              { borderColor: colors.border, backgroundColor: colors.muted, borderRadius: colors.radius },
            ]}
          >
            {logoUri ? (
              <Image source={{ uri: logoUri }} style={styles.uploadedImage} resizeMode="cover" />
            ) : (
              <>
                <Feather name="upload-cloud" size={26} color={colors.primary} />
                <Text style={[styles.uploadTitle, { color: colors.foreground }]}>Upload Logo</Text>
                <Text style={[styles.uploadHint, { color: colors.mutedForeground }]}>JPG, PNG up to 2MB</Text>
              </>
            )}
          </Pressable>

          <View style={[styles.previewCard, { borderColor: colors.border, borderRadius: colors.radius }]}>
            <Text style={[styles.previewLabel, { color: colors.mutedForeground }]}>Preview</Text>
            <View style={styles.previewRow}>
              <View style={[styles.previewThumb, { backgroundColor: colors.card }]}>
                {logoUri ? (
                  <Image source={{ uri: logoUri }} style={styles.previewImage} resizeMode="cover" />
                ) : (
                  <Feather name="home" size={18} color={colors.mutedForeground} />
                )}
              </View>
              <View>
                <Text style={[styles.previewName, { color: colors.foreground }]}>{name || 'Your Business Name'}</Text>
                <Text style={[styles.previewSub, { color: colors.mutedForeground }]}>Your logo will appear here</Text>
              </View>
            </View>
          </View>
        </View>

        {errors.form ? <Text style={[styles.errorText, { color: colors.destructive }]}>{errors.form}</Text> : null}

        <View style={[styles.footerRow, isWide && styles.footerRowWide]}>
          <PrimaryButton label="Log out" onPress={signOut} variant="secondary" style={{ flex: isWide ? 0 : 1 }} />
          <PrimaryButton
            label="Save & Continue"
            onPress={handleCreate}
            loading={createBusiness.isPending}
            style={{ flex: isWide ? 0 : 1, minWidth: isWide ? 200 : undefined }}
          />
        </View>
      </KeyboardAwareScrollViewCompat>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  sidebar: {
    width: 280,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
  },
  sidebarBrandRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 40 },
  sidebarLogo: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  sidebarBrand: { fontSize: 16, fontFamily: 'Inter_700Bold', fontWeight: '700' },
  stepsWrap: { flex: 1 },
  stepRow: { flexDirection: 'row', gap: 14 },
  stepCol: { alignItems: 'center' },
  stepBadge: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  stepBadgeText: { fontSize: 13, fontFamily: 'Inter_700Bold', fontWeight: '700' },
  stepConnector: { width: 2, flex: 1, marginVertical: 4 },
  stepTitle: { fontSize: 14, fontFamily: 'Inter_600SemiBold', fontWeight: '600' },
  stepSubtitle: { fontSize: 12, fontFamily: 'Inter_400Regular', marginTop: 2 },
  tipCard: { borderRadius: 14, padding: 14, gap: 8, marginBottom: 24 },
  tipText: { fontSize: 12, fontFamily: 'Inter_400Regular', lineHeight: 17 },

  content: { paddingHorizontal: 24, maxWidth: 760, width: '100%', alignSelf: 'center', gap: 14 },
  headerRow: { alignItems: 'flex-start', marginBottom: 8 },
  iconWrap: { width: 56, height: 56, alignItems: 'center', justifyContent: 'center', marginBottom: 14, alignSelf: 'center' },
  title: { fontSize: 22, fontFamily: 'Inter_700Bold', fontWeight: '700' },
  subtitle: { fontSize: 13, fontFamily: 'Inter_400Regular', marginTop: 4 },

  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 8 },
  sectionTitle: { fontSize: 15, fontFamily: 'Inter_700Bold', fontWeight: '700' },

  grid: { gap: 14 },
  gridRow: { flexDirection: 'row' },
  gridCol: { flex: 1 },
  gridRow3: { flexDirection: 'row' },
  gridCol3: { flex: 1 },

  logoSection: { gap: 14 },
  logoSectionRow: { flexDirection: 'row', alignItems: 'stretch' },
  uploadBox: {
    flex: 1,
    minHeight: 130,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    overflow: 'hidden',
  },
  uploadedImage: { width: '100%', height: '100%' },
  uploadTitle: { fontSize: 13, fontFamily: 'Inter_600SemiBold', fontWeight: '600', marginTop: 6 },
  uploadHint: { fontSize: 11, fontFamily: 'Inter_400Regular' },
  previewCard: { flex: 1, borderWidth: 1, padding: 14, justifyContent: 'center' },
  previewLabel: { fontSize: 11, fontFamily: 'Inter_500Medium', marginBottom: 10 },
  previewRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  previewThumb: { width: 40, height: 40, borderRadius: 10, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  previewImage: { width: '100%', height: '100%' },
  previewName: { fontSize: 13, fontFamily: 'Inter_600SemiBold', fontWeight: '600' },
  previewSub: { fontSize: 11, fontFamily: 'Inter_400Regular', marginTop: 2 },

  errorText: { fontSize: 13, fontFamily: 'Inter_400Regular' },
  footerRow: { flexDirection: 'row', gap: 10, marginTop: 10 },
  footerRowWide: { justifyContent: 'flex-end' },
});