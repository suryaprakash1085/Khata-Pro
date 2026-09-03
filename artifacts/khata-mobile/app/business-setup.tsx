
// // import React, { useState } from 'react';
// // import {
// //   Image,
// //   Pressable,
// //   StyleSheet,
// //   Text,
// //   View,
// //   useWindowDimensions,
// // } from 'react-native';
// // import { useSafeAreaInsets } from 'react-native-safe-area-context';
// // import { KeyboardAwareScrollViewCompat } from '@/components/KeyboardAwareScrollViewCompat';
// // import { Feather } from '@expo/vector-icons';
// // import { useColors } from '@/hooks/useColors';
// // import { useCreateBusiness, type Business } from '@workspace/api-client-react';
// // import { useBusiness } from '@/contexts/BusinessContext';
// // import { useAuth } from '@/contexts/AuthContext';
// // import { PrimaryButton } from '@/components/PrimaryButton';
// // import { FormField } from '@/components/FormField';
// // import { SelectField } from '@/components/SelectField';
// // import * as ImagePicker from 'expo-image-picker';

// // const BUSINESS_TYPES = ['Retail Store', 'Wholesale', 'Manufacturing', 'Services', 'Distribution', 'Other'];

// // const INDIAN_STATES = [
// //   'Andhra Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Delhi', 'Goa', 'Gujarat',
// //   'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala',
// //   'Madhya Pradesh', 'Maharashtra', 'Odisha', 'Punjab', 'Rajasthan',
// //   'Tamil Nadu', 'Telangana', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
// // ];

// // const COUNTRIES = ['India', 'United States', 'United Arab Emirates', 'Singapore', 'United Kingdom'];

// // const DESKTOP_BREAKPOINT = 820;

// // export default function BusinessSetupScreen() {
// //   const colors = useColors();
// //   const insets = useSafeAreaInsets();
// //   const { width } = useWindowDimensions();
// //   const isWide = width >= DESKTOP_BREAKPOINT;
// //   const { signOut } = useAuth();
// //   const { setBusiness } = useBusiness();

// //   const [name, setName] = useState('');
// //   const [type, setType] = useState(BUSINESS_TYPES[0]);
// //   const [phone, setPhone] = useState('');
// //   const [email, setEmail] = useState('');
// //   const [gstin, setGstin] = useState('');
// //   const [latitude, setLatitude] = useState('');
// //   const [longitude, setLongitude] = useState('');
// //   const [addressLine1, setAddressLine1] = useState('');
// //   const [addressLine2, setAddressLine2] = useState('');
// //   const [city, setCity] = useState('');
// //   const [state, setState] = useState('');
// //   const [postalCode, setPostalCode] = useState('');
// //   const [country, setCountry] = useState('India');

// //   const [logoUri, setLogoUri] = useState<string | null>(null);
// //   const [errors, setErrors] = useState<Record<string, string>>({});

// //   const createBusiness = useCreateBusiness();
// //   const [description, setDescription] = useState('');

// //   const handlePickLogo = async () => {
// //     const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
// //     if (!permission.granted) return;

// //     const result = await ImagePicker.launchImageLibraryAsync({
// //       mediaTypes: ImagePicker.MediaTypeOptions.Images,
// //       quality: 0.7,
// //       base64: true,
// //       allowsEditing: true,
// //       aspect: [1, 1],
// //     });

// //     if (!result.canceled && result.assets[0]) {
// //       const asset = result.assets[0];
// //       const dataUri = asset.base64 ? `data:image/jpeg;base64,${asset.base64}` : asset.uri;
// //       setLogoUri(dataUri);
// //     }
// //   };

// //   const validate = () => {
// //     const next: Record<string, string> = {};
// //     if (name.trim().length < 2) next.name = 'Enter your business name';
// //     if (!phone.trim()) next.phone = 'Enter a phone number';
// //     if (!email.trim()) next.email = 'Enter an email address';
// //     if (!addressLine1.trim()) next.addressLine1 = 'Enter address line 1';
// //     if (!city.trim()) next.city = 'Enter city';
// //     if (!state.trim()) next.state = 'Select a state';
// //     if (!postalCode.trim()) next.postalCode = 'Enter postal code';
// //     setErrors(next);
// //     return Object.keys(next).length === 0;
// //   };

// //   const handleCreate = () => {
// //     if (!validate()) return;

// //     createBusiness.mutate(
// //       {
// //         data: {
// //           business_name: name.trim(),
// //           business_type: type,
// //           phone: phone.trim(),
// //           email: email.trim(),
// //           gstin: gstin.trim() || undefined,
// //           description: description.trim() || undefined,
// //           address_line1: addressLine1.trim(),
// //           address_line2: addressLine2.trim() || undefined,
// //           city: city.trim(),
// //           state,
// //           postal_code: postalCode.trim(),
// //           country,
// //           logo_url: logoUri || undefined,
// //           latitude: latitude.trim() ? parseFloat(latitude.trim()) : undefined,
// //           longitude: longitude.trim() ? parseFloat(longitude.trim()) : undefined
// //         },
// //       },
// //       {
// //         onSuccess: (biz: Business) => setBusiness(biz),
// //         onError: () => setErrors((e) => ({ ...e, form: 'Could not create business. Please try again.' })),
// //       },
// //     );
// //   };

// //   const steps = [
// //     { n: 1, title: 'Business Info', subtitle: 'Basic information', active: true },
// //     { n: 2, title: 'Preferences', subtitle: 'Business preferences', active: false },
// //     { n: 3, title: 'Tax & Currency', subtitle: 'Tax and currency setup', active: false },
// //     { n: 4, title: 'Finish Setup', subtitle: 'Complete setup', active: false },
// //   ];

// //   return (
// //     <View style={[styles.screen, isWide && { flexDirection: 'row' }]}>
// //       {/* Sidebar — only on wide/web screens */}
// //       {isWide && (
// //         <View style={[styles.sidebar, { backgroundColor: colors.primary, paddingTop: insets.top + 28 }]}>
// //           <View style={styles.sidebarBrandRow}>
// //             <View style={[styles.sidebarLogo, { backgroundColor: colors.primaryForeground + '22' }]}>
// //               <Feather name="book-open" size={22} color={colors.primaryForeground} />
// //             </View>
// //             <Text style={[styles.sidebarBrand, { color: colors.primaryForeground }]}>Khata-Pro POS</Text>
// //           </View>

// //           <View style={styles.stepsWrap}>
// //             {steps.map((s, i) => (
// //               <View key={s.n} style={styles.stepRow}>
// //                 <View style={styles.stepCol}>
// //                   <View
// //                     style={[
// //                       styles.stepBadge,
// //                       s.active
// //                         ? { backgroundColor: colors.primaryForeground }
// //                         : { backgroundColor: colors.primaryForeground + '33' },
// //                     ]}
// //                   >
// //                     <Text style={[styles.stepBadgeText, { color: s.active ? colors.primary : colors.primaryForeground }]}>
// //                       {s.n}
// //                     </Text>
// //                   </View>
// //                   {i < steps.length - 1 && (
// //                     <View style={[styles.stepConnector, { backgroundColor: colors.primaryForeground + '33' }]} />
// //                   )}
// //                 </View>
// //                 <View style={{ paddingBottom: 26 }}>
// //                   <Text
// //                     style={[
// //                       styles.stepTitle,
// //                       { color: s.active ? colors.primaryForeground : colors.primaryForeground + 'AA' },
// //                     ]}
// //                   >
// //                     {s.title}
// //                   </Text>
// //                   <Text style={[styles.stepSubtitle, { color: colors.primaryForeground + '88' }]}>{s.subtitle}</Text>
// //                 </View>
// //               </View>
// //             ))}
// //           </View>

// //           <View style={[styles.tipCard, { backgroundColor: colors.primaryForeground + '15' }]}>
// //             <Feather name="shield" size={18} color={colors.primaryForeground} />
// //             <Text style={[styles.tipText, { color: colors.primaryForeground }]}>
// //               Your business setup helps us to customize POS experience for you.
// //             </Text>
// //           </View>
// //         </View>
// //       )}

// //       {/* Form */}
// //       <KeyboardAwareScrollViewCompat
// //         style={{ flex: 1, backgroundColor: colors.background }}
// //         contentContainerStyle={[
// //           styles.content,
// //           { paddingTop: insets.top + (isWide ? 28 : 40), paddingBottom: insets.bottom + 32 },
// //         ]}
// //         bottomOffset={40}
// //       >
// //         <View style={styles.headerRow}>
// //           {!isWide && (
// //             <View style={[styles.iconWrap, { backgroundColor: colors.primary, borderRadius: colors.radius + 6 }]}>
// //               <Feather name="briefcase" size={24} color={colors.primaryForeground} />
// //             </View>
// //           )}
// //           <Text style={[styles.title, { color: colors.foreground }]}>Business Setup</Text>
// //           <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
// //             Let's get started with your business information.
// //           </Text>
// //         </View>

// //         {/* Business Information */}
// //         <View style={styles.sectionHeader}>
// //           <Feather name="briefcase" size={16} color={colors.primary} />
// //           <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Business Information</Text>
// //         </View>

// //         <View style={[styles.grid, isWide && styles.gridRow]}>
// //           <View style={isWide ? styles.gridCol : undefined}>
// //             <FormField
// //               label="Business Name"
// //               required
// //               placeholder="Sharma General Store"
// //               value={name}
// //               onChangeText={setName}
// //               error={errors.name}
// //               autoFocus
// //             />
// //           </View>
// //           <View style={isWide ? styles.gridCol : undefined}>
// //             <SelectField
// //               label="Business Type"
// //               required
// //               icon="shopping-bag"
// //               value={type}
// //               options={BUSINESS_TYPES}
// //               onChange={setType}
// //             />
// //           </View>
// //         </View>

// //         <View style={[styles.grid, isWide && styles.gridRow]}>
// //           <View style={isWide ? styles.gridCol : undefined}>
// //             <FormField
// //               label="Phone Number"
// //               required
// //               placeholder="+91 98765 43210"
// //               keyboardType="phone-pad"
// //               value={phone}
// //               onChangeText={setPhone}
// //               error={errors.phone}
// //             />
// //           </View>
// //           <View style={isWide ? styles.gridCol : undefined}>
// //             <FormField
// //               label="Email Address"
// //               required
// //               placeholder="you@business.com"
// //               keyboardType="email-address"
// //               autoCapitalize="none"
// //               value={email}
// //               onChangeText={setEmail}
// //               error={errors.email}
// //             />
// //           </View>
// //         </View>

// //         <FormField
// //           label="GSTIN (Optional)"
// //           placeholder="22AAAAA0000A1Z5"
// //           value={gstin}
// //           onChangeText={(v) => setGstin(v.toUpperCase())}
// //           autoCapitalize="characters"
// //         />

// //         {/* Business Address */}
// //         <View style={[styles.sectionHeader, { marginTop: 24 }]}>
// //           <Feather name="map-pin" size={16} color={colors.primary} />
// //           <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Business Address</Text>
// //         </View>
        
// //         <FormField
// //           label="Business Description (Optional)"
// //           placeholder="Tell customers a bit about your store"
// //           value={description}
// //           onChangeText={setDescription}
// //           multiline
// //           numberOfLines={3}
// //         />
        
// //         <FormField
// //           label="Address Line 1"
// //           required
// //           placeholder="123, MG Road"
// //           value={addressLine1}
// //           onChangeText={setAddressLine1}
// //           error={errors.addressLine1}
// //         />
        
// //         <FormField
// //           label="Address Line 2 (Optional)"
// //           placeholder="Near City Mall"
// //           value={addressLine2}
// //           onChangeText={setAddressLine2}
// //         />

// //         <View style={[styles.grid, isWide && styles.gridRow3]}>
// //           <View style={isWide ? styles.gridCol3 : undefined}>
// //             <FormField
// //               label="City"
// //               required
// //               placeholder="Chennai"
// //               value={city}
// //               onChangeText={setCity}
// //               error={errors.city}
// //             />
// //           </View>
// //           <View style={isWide ? styles.gridCol3 : undefined}>
// //             <SelectField
// //               label="State / Province"
// //               required
// //               icon="map"
// //               value={state}
// //               options={INDIAN_STATES}
// //               onChange={setState}
// //               error={errors.state}
// //               placeholder="Select state"
// //             />
// //           </View>
// //           <View style={isWide ? styles.gridCol3 : undefined}>
// //             <FormField
// //               label="Postal Code"
// //               required
// //               placeholder="600001"
// //               keyboardType="number-pad"
// //               value={postalCode}
// //               onChangeText={setPostalCode}
// //               error={errors.postalCode}
// //             />
// //           </View>
// //         </View>

// //         <SelectField
// //           label="Country"
// //           required
// //           icon="globe"
// //           value={country}
// //           options={COUNTRIES}
// //           onChange={setCountry}
// //         />

// //         {/* Store Location for Delivery Fee - NEW SECTION */}
// //         <View style={[styles.sectionHeader, { marginTop: 24 }]}>
// //           <Feather name="crosshair" size={16} color={colors.primary} />
// //           <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Store Location (for delivery fee)</Text>
// //         </View>

// //         <Pressable
// //           onPress={async () => {
// //             try {
// //               const Location = await import('expo-location');
// //               const perm = await Location.requestForegroundPermissionsAsync();
// //               if (!perm.granted) {
// //                 setErrors((e) => ({ ...e, location: 'Location permission denied. Enter manually.' }));
// //                 return;
// //               }
// //               const pos = await Location.getCurrentPositionAsync({});
// //               setLatitude(String(pos.coords.latitude));
// //               setLongitude(String(pos.coords.longitude));
// //               setErrors((e) => ({ ...e, location: '' }));
// //             } catch {
// //               setErrors((e) => ({ ...e, location: 'Could not detect location. Enter manually.' }));
// //             }
// //           }}
// //           style={[
// //             styles.uploadBox, 
// //             { 
// //               borderColor: colors.border, 
// //               backgroundColor: colors.muted, 
// //               borderRadius: colors.radius, 
// //               minHeight: 56, 
// //               marginBottom: 12 
// //             }
// //           ]}
// //         >
// //           <Feather name="map-pin" size={18} color={colors.primary} />
// //           <Text style={[styles.uploadTitle, { color: colors.foreground }]}>Use Current Location</Text>
// //         </Pressable>

// //         <View style={[styles.grid, isWide && styles.gridRow]}>
// //           <View style={isWide ? styles.gridCol : undefined}>
// //             <FormField
// //               label="Latitude"
// //               placeholder="13.0827"
// //               keyboardType="numbers-and-punctuation"
// //               value={latitude}
// //               onChangeText={setLatitude}
// //             />
// //           </View>
// //           <View style={isWide ? styles.gridCol : undefined}>
// //             <FormField
// //               label="Longitude"
// //               placeholder="80.2707"
// //               keyboardType="numbers-and-punctuation"
// //               value={longitude}
// //               onChangeText={setLongitude}
// //             />
// //           </View>
// //         </View>
// //         {errors.location ? (
// //           <Text style={[styles.errorText, { color: colors.destructive }]}>{errors.location}</Text>
// //         ) : null}

// //         {/* Business Logo */}
// //         <View style={[styles.sectionHeader, { marginTop: 24 }]}>
// //           <Feather name="image" size={16} color={colors.primary} />
// //           <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Business Logo (Optional)</Text>
// //         </View>

// //         <View style={[styles.logoSection, isWide && styles.logoSectionRow]}>
// //           <Pressable
// //             onPress={handlePickLogo}
// //             style={[
// //               styles.uploadBox,
// //               { borderColor: colors.border, backgroundColor: colors.muted, borderRadius: colors.radius },
// //             ]}
// //           >
// //             {logoUri ? (
// //               <Image source={{ uri: logoUri }} style={styles.uploadedImage} resizeMode="cover" />
// //             ) : (
// //               <>
// //                 <Feather name="upload-cloud" size={26} color={colors.primary} />
// //                 <Text style={[styles.uploadTitle, { color: colors.foreground }]}>Upload Logo</Text>
// //                 <Text style={[styles.uploadHint, { color: colors.mutedForeground }]}>JPG, PNG up to 2MB</Text>
// //               </>
// //             )}
// //           </Pressable>

// //           <View style={[styles.previewCard, { borderColor: colors.border, borderRadius: colors.radius }]}>
// //             <Text style={[styles.previewLabel, { color: colors.mutedForeground }]}>Preview</Text>
// //             <View style={styles.previewRow}>
// //               <View style={[styles.previewThumb, { backgroundColor: colors.card }]}>
// //                 {logoUri ? (
// //                   <Image source={{ uri: logoUri }} style={styles.previewImage} resizeMode="cover" />
// //                 ) : (
// //                   <Feather name="home" size={18} color={colors.mutedForeground} />
// //                 )}
// //               </View>
// //               <View>
// //                 <Text style={[styles.previewName, { color: colors.foreground }]}>{name || 'Your Business Name'}</Text>
// //                 <Text style={[styles.previewSub, { color: colors.mutedForeground }]}>Your logo will appear here</Text>
// //               </View>
// //             </View>
// //           </View>
// //         </View>

// //         {errors.form ? <Text style={[styles.errorText, { color: colors.destructive }]}>{errors.form}</Text> : null}

// //         <View style={[styles.footerRow, isWide && styles.footerRowWide]}>
// //           <PrimaryButton label="Log out" onPress={signOut} variant="secondary" style={{ flex: isWide ? 0 : 1 }} />
// //           <PrimaryButton
// //             label="Save & Continue"
// //             onPress={handleCreate}
// //             loading={createBusiness.isPending}
// //             style={{ flex: isWide ? 0 : 1, minWidth: isWide ? 200 : undefined }}
// //           />
// //         </View>
// //       </KeyboardAwareScrollViewCompat>
// //     </View>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   screen: { flex: 1 },
// //   sidebar: {
// //     width: 280,
// //     paddingHorizontal: 24,
// //     justifyContent: 'space-between',
// //   },
// //   sidebarBrandRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 40 },
// //   sidebarLogo: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
// //   sidebarBrand: { fontSize: 16, fontFamily: 'Inter_700Bold', fontWeight: '700' },
// //   stepsWrap: { flex: 1 },
// //   stepRow: { flexDirection: 'row', gap: 14 },
// //   stepCol: { alignItems: 'center' },
// //   stepBadge: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
// //   stepBadgeText: { fontSize: 13, fontFamily: 'Inter_700Bold', fontWeight: '700' },
// //   stepConnector: { width: 2, flex: 1, marginVertical: 4 },
// //   stepTitle: { fontSize: 14, fontFamily: 'Inter_600SemiBold', fontWeight: '600' },
// //   stepSubtitle: { fontSize: 12, fontFamily: 'Inter_400Regular', marginTop: 2 },
// //   tipCard: { borderRadius: 14, padding: 14, gap: 8, marginBottom: 24 },
// //   tipText: { fontSize: 12, fontFamily: 'Inter_400Regular', lineHeight: 17 },

// //   content: { paddingHorizontal: 24, maxWidth: 760, width: '100%', alignSelf: 'center', gap: 14 },
// //   headerRow: { alignItems: 'flex-start', marginBottom: 8 },
// //   iconWrap: { width: 56, height: 56, alignItems: 'center', justifyContent: 'center', marginBottom: 14, alignSelf: 'center' },
// //   title: { fontSize: 22, fontFamily: 'Inter_700Bold', fontWeight: '700' },
// //   subtitle: { fontSize: 13, fontFamily: 'Inter_400Regular', marginTop: 4 },

// //   sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 8 },
// //   sectionTitle: { fontSize: 15, fontFamily: 'Inter_700Bold', fontWeight: '700' },

// //   grid: { gap: 14 },
// //   gridRow: { flexDirection: 'row' },
// //   gridCol: { flex: 1 },
// //   gridRow3: { flexDirection: 'row' },
// //   gridCol3: { flex: 1 },

// //   logoSection: { gap: 14 },
// //   logoSectionRow: { flexDirection: 'row', alignItems: 'stretch' },
// //   uploadBox: {
// //     flex: 1,
// //     minHeight: 130,
// //     borderWidth: 1.5,
// //     borderStyle: 'dashed',
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //     gap: 4,
// //     overflow: 'hidden',
// //   },
// //   uploadedImage: { width: '100%', height: '100%' },
// //   uploadTitle: { fontSize: 13, fontFamily: 'Inter_600SemiBold', fontWeight: '600', marginTop: 6 },
// //   uploadHint: { fontSize: 11, fontFamily: 'Inter_400Regular' },
// //   previewCard: { flex: 1, borderWidth: 1, padding: 14, justifyContent: 'center' },
// //   previewLabel: { fontSize: 11, fontFamily: 'Inter_500Medium', marginBottom: 10 },
// //   previewRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
// //   previewThumb: { width: 40, height: 40, borderRadius: 10, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
// //   previewImage: { width: '100%', height: '100%' },
// //   previewName: { fontSize: 13, fontFamily: 'Inter_600SemiBold', fontWeight: '600' },
// //   previewSub: { fontSize: 11, fontFamily: 'Inter_400Regular', marginTop: 2 },

// //   errorText: { fontSize: 13, fontFamily: 'Inter_400Regular' },
// //   footerRow: { flexDirection: 'row', gap: 10, marginTop: 10 },
// //   footerRowWide: { justifyContent: 'flex-end' },
// // });
// import React, { useState } from 'react';
// import {
//   Image,
//   Pressable,
//   StyleSheet,
//   Text,
//   View,
//   useWindowDimensions,
// } from 'react-native';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import { KeyboardAwareScrollViewCompat } from '@/components/KeyboardAwareScrollViewCompat';
// import { Feather } from '@expo/vector-icons';
// import { useColors } from '@/hooks/useColors';
// import { useCreateBusiness, type Business } from '@workspace/api-client-react';
// import { useBusiness } from '@/contexts/BusinessContext';
// import { useAuth } from '@/contexts/AuthContext';
// import { PrimaryButton } from '@/components/PrimaryButton';
// import { FormField } from '@/components/FormField';
// import { SelectField } from '@/components/SelectField';
// import * as ImagePicker from 'expo-image-picker';

// const BUSINESS_TYPES = ['Retail Store', 'Wholesale', 'Manufacturing', 'Services', 'Distribution', 'Other'];

// const INDIAN_STATES = [
//   'Andhra Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Delhi', 'Goa', 'Gujarat',
//   'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala',
//   'Madhya Pradesh', 'Maharashtra', 'Odisha', 'Punjab', 'Rajasthan',
//   'Tamil Nadu', 'Telangana', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
// ];

// const COUNTRIES = ['India', 'United States', 'United Arab Emirates', 'Singapore', 'United Kingdom'];

// const DESKTOP_BREAKPOINT = 820;

// export default function BusinessSetupScreen() {
//   const colors = useColors();
//   const insets = useSafeAreaInsets();
//   const { width } = useWindowDimensions();
//   const isWide = width >= DESKTOP_BREAKPOINT;
//   const { signOut } = useAuth();
//   const { setBusiness } = useBusiness();

//   const [name, setName] = useState('');
//   const [type, setType] = useState(BUSINESS_TYPES[0]);
//   const [phone, setPhone] = useState('');
//   const [email, setEmail] = useState('');
//   const [gstin, setGstin] = useState('');
//   const [latitude, setLatitude] = useState('');
//   const [longitude, setLongitude] = useState('');
//   const [addressLine1, setAddressLine1] = useState('');
//   const [addressLine2, setAddressLine2] = useState('');
//   const [city, setCity] = useState('');
//   const [state, setState] = useState('');
//   const [postalCode, setPostalCode] = useState('');
//   const [country, setCountry] = useState('India');

//   const [logoUri, setLogoUri] = useState<string | null>(null);
//   const [errors, setErrors] = useState<Record<string, string>>({});

//   const createBusiness = useCreateBusiness();
//   const [description, setDescription] = useState('');

//   const handlePickLogo = async () => {
//     const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
//     if (!permission.granted) return;

//     const result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       quality: 0.7,
//       base64: true,
//       allowsEditing: true,
//       aspect: [1, 1],
//     });

//     if (!result.canceled && result.assets[0]) {
//       const asset = result.assets[0];
//       const dataUri = asset.base64 ? `data:image/jpeg;base64,${asset.base64}` : asset.uri;
//       setLogoUri(dataUri);
//     }
//   };

//   const validate = () => {
//     const next: Record<string, string> = {};
//     if (name.trim().length < 2) next.name = 'Enter your business name';
//     if (!phone.trim()) next.phone = 'Enter a phone number';
//     if (!email.trim()) next.email = 'Enter an email address';
//     if (!addressLine1.trim()) next.addressLine1 = 'Enter address line 1';
//     if (!city.trim()) next.city = 'Enter city';
//     if (!state.trim()) next.state = 'Select a state';
//     if (!postalCode.trim()) next.postalCode = 'Enter postal code';
//     setErrors(next);
//     return Object.keys(next).length === 0;
//   };

//   const handleCreate = () => {
//     if (!validate()) return;

//     createBusiness.mutate(
//       {
//         data: {
//           business_name: name.trim(),
//           business_type: type,
//           phone: phone.trim(),
//           email: email.trim(),
//           gstin: gstin.trim() || undefined,
//           description: description.trim() || undefined,
//           address_line1: addressLine1.trim(),
//           address_line2: addressLine2.trim() || undefined,
//           city: city.trim(),
//           state,
//           postal_code: postalCode.trim(),
//           country,
//           logo_url: logoUri || undefined,
//           latitude: latitude.trim() ? parseFloat(latitude.trim()) : undefined,
//           longitude: longitude.trim() ? parseFloat(longitude.trim()) : undefined
//         },
//       },
//       {
//         onSuccess: (biz: Business) => setBusiness(biz),
//         onError: () => setErrors((e) => ({ ...e, form: 'Could not create business. Please try again.' })),
//       },
//     );
//   };

//   const steps = [
//     { n: 1, title: 'Business Info', subtitle: 'Basic information', active: true },
//     { n: 2, title: 'Preferences', subtitle: 'Business preferences', active: false },
//     { n: 3, title: 'Tax & Currency', subtitle: 'Tax and currency setup', active: false },
//     { n: 4, title: 'Finish Setup', subtitle: 'Complete setup', active: false },
//   ];

//   return (
//     <View style={[styles.screen, isWide && { flexDirection: 'row' }]}>
//       {/* Sidebar — only on wide/web screens */}
//       {isWide && (
//         <View style={[styles.sidebar, { backgroundColor: colors.primary, paddingTop: insets.top + 28 }]}>
//           <View style={styles.sidebarBrandRow}>
//             <View style={[styles.sidebarLogo, { backgroundColor: colors.primaryForeground + '22' }]}>
//               <Feather name="book-open" size={22} color={colors.primaryForeground} />
//             </View>
//             <Text style={[styles.sidebarBrand, { color: colors.primaryForeground }]}>Khata-Pro POS</Text>
//           </View>

//           {/* FIX 1: removed flex:1 from stepsWrap — that was the empty
//               gap you saw between "Finish Setup" and the tip card.
//               Now the steps sit right under the brand row, and the tip
//               card follows immediately after with a fixed marginTop. */}
//           <View style={styles.stepsWrap}>
//             {steps.map((s, i) => (
//               <View key={s.n} style={styles.stepRow}>
//                 <View style={styles.stepCol}>
//                   <View
//                     style={[
//                       styles.stepBadge,
//                       s.active
//                         ? { backgroundColor: colors.primaryForeground }
//                         : { backgroundColor: colors.primaryForeground + '33' },
//                     ]}
//                   >
//                     <Text style={[styles.stepBadgeText, { color: s.active ? colors.primary : colors.primaryForeground }]}>
//                       {s.n}
//                     </Text>
//                   </View>
//                   {i < steps.length - 1 && (
//                     <View style={[styles.stepConnector, { backgroundColor: colors.primaryForeground + '33' }]} />
//                   )}
//                 </View>
//                 <View style={{ paddingBottom: 26 }}>
//                   <Text
//                     style={[
//                       styles.stepTitle,
//                       { color: s.active ? colors.primaryForeground : colors.primaryForeground + 'AA' },
//                     ]}
//                   >
//                     {s.title}
//                   </Text>
//                   <Text style={[styles.stepSubtitle, { color: colors.primaryForeground + '88' }]}>{s.subtitle}</Text>
//                 </View>
//               </View>
//             ))}
//           </View>

//           <View style={[styles.tipCard, { backgroundColor: colors.primaryForeground + '15' }]}>
//             <Feather name="shield" size={18} color={colors.primaryForeground} />
//             <Text style={[styles.tipText, { color: colors.primaryForeground }]}>
//               Your business setup helps us to customize POS experience for you.
//             </Text>
//           </View>
//         </View>
//       )}

//       {/* Form */}
//       <KeyboardAwareScrollViewCompat
//         style={{ flex: 1, backgroundColor: colors.background }}
//         contentContainerStyle={[
//           styles.content,
//           { paddingTop: insets.top + (isWide ? 28 : 40), paddingBottom: insets.bottom + 32 },
//         ]}
//         bottomOffset={40}
//       >
//         <View style={styles.headerRow}>
//           {!isWide && (
//             <View style={[styles.iconWrap, { backgroundColor: colors.primary, borderRadius: colors.radius + 6 }]}>
//               <Feather name="briefcase" size={24} color={colors.primaryForeground} />
//             </View>
//           )}
//           <Text style={[styles.title, { color: colors.foreground }]}>Business Setup</Text>
//           <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
//             Let's get started with your business information.
//           </Text>
//         </View>

//         {/* Business Information */}
//         <View style={styles.sectionHeader}>
//           <Feather name="briefcase" size={16} color={colors.primary} />
//           <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Business Information</Text>
//         </View>

//         <View style={[styles.grid, isWide && styles.gridRow]}>
//           <View style={isWide ? styles.gridCol : undefined}>
//             <FormField
//               label="Business Name"
//               required
//               placeholder="Sharma General Store"
//               value={name}
//               onChangeText={setName}
//               error={errors.name}
//               autoFocus
//             />
//           </View>
//           <View style={isWide ? styles.gridCol : undefined}>
//             <SelectField
//               label="Business Type"
//               required
//               icon="shopping-bag"
//               value={type}
//               options={BUSINESS_TYPES}
//               onChange={setType}
//             />
//           </View>
//         </View>

//         <View style={[styles.grid, isWide && styles.gridRow]}>
//           <View style={isWide ? styles.gridCol : undefined}>
//             <FormField
//               label="Phone Number"
//               required
//               placeholder="+91 98765 43210"
//               keyboardType="phone-pad"
//               value={phone}
//               onChangeText={setPhone}
//               error={errors.phone}
//             />
//           </View>
//           <View style={isWide ? styles.gridCol : undefined}>
//             <FormField
//               label="Email Address"
//               required
//               placeholder="you@business.com"
//               keyboardType="email-address"
//               autoCapitalize="none"
//               value={email}
//               onChangeText={setEmail}
//               error={errors.email}
//             />
//           </View>
//         </View>

//         <FormField
//           label="GSTIN (Optional)"
//           placeholder="22AAAAA0000A1Z5"
//           value={gstin}
//           onChangeText={(v) => setGstin(v.toUpperCase())}
//           autoCapitalize="characters"
//         />

//         {/* Business Address */}
//         <View style={[styles.sectionHeader, { marginTop: 24 }]}>
//           <Feather name="map-pin" size={16} color={colors.primary} />
//           <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Business Address</Text>
//         </View>

//         <FormField
//           label="Business Description (Optional)"
//           placeholder="Tell customers a bit about your store"
//           value={description}
//           onChangeText={setDescription}
//           multiline
//           numberOfLines={3}
//         />

//         <FormField
//           label="Address Line 1"
//           required
//           placeholder="123, MG Road"
//           value={addressLine1}
//           onChangeText={setAddressLine1}
//           error={errors.addressLine1}
//         />

//         <FormField
//           label="Address Line 2 (Optional)"
//           placeholder="Near City Mall"
//           value={addressLine2}
//           onChangeText={setAddressLine2}
//         />

//         <View style={[styles.grid, isWide && styles.gridRow3]}>
//           <View style={isWide ? styles.gridCol3 : undefined}>
//             <FormField
//               label="City"
//               required
//               placeholder="Chennai"
//               value={city}
//               onChangeText={setCity}
//               error={errors.city}
//             />
//           </View>
//           <View style={isWide ? styles.gridCol3 : undefined}>
//             <SelectField
//               label="State / Province"
//               required
//               icon="map"
//               value={state}
//               options={INDIAN_STATES}
//               onChange={setState}
//               error={errors.state}
//               placeholder="Select state"
//             />
//           </View>
//           <View style={isWide ? styles.gridCol3 : undefined}>
//             <FormField
//               label="Postal Code"
//               required
//               placeholder="600001"
//               keyboardType="number-pad"
//               value={postalCode}
//               onChangeText={setPostalCode}
//               error={errors.postalCode}
//             />
//           </View>
//         </View>

//         <SelectField
//           label="Country"
//           required
//           icon="globe"
//           value={country}
//           options={COUNTRIES}
//           onChange={setCountry}
//         />

//         {/* Store Location for Delivery Fee */}
//         <View style={[styles.sectionHeader, { marginTop: 24 }]}>
//           <Feather name="crosshair" size={16} color={colors.primary} />
//           <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Store Location (for delivery fee)</Text>
//         </View>

//         <Pressable
//           onPress={async () => {
//             try {
//               const Location = await import('expo-location');
//               const perm = await Location.requestForegroundPermissionsAsync();
//               if (!perm.granted) {
//                 setErrors((e) => ({ ...e, location: 'Location permission denied. Enter manually.' }));
//                 return;
//               }
//               const pos = await Location.getCurrentPositionAsync({});
//               setLatitude(String(pos.coords.latitude));
//               setLongitude(String(pos.coords.longitude));
//               setErrors((e) => ({ ...e, location: '' }));
//             } catch {
//               setErrors((e) => ({ ...e, location: 'Could not detect location. Enter manually.' }));
//             }
//           }}
//           style={[
//             styles.uploadBox,
//             {
//               borderColor: colors.border,
//               backgroundColor: colors.muted,
//               borderRadius: colors.radius,
//               minHeight: 56,
//               marginBottom: 12
//             }
//           ]}
//         >
//           <Feather name="map-pin" size={18} color={colors.primary} />
//           <Text style={[styles.uploadTitle, { color: colors.foreground }]}>Use Current Location</Text>
//         </Pressable>

//         <View style={[styles.grid, isWide && styles.gridRow]}>
//           <View style={isWide ? styles.gridCol : undefined}>
//             <FormField
//               label="Latitude"
//               placeholder="13.0827"
//               keyboardType="numbers-and-punctuation"
//               value={latitude}
//               onChangeText={setLatitude}
//             />
//           </View>
//           <View style={isWide ? styles.gridCol : undefined}>
//             <FormField
//               label="Longitude"
//               placeholder="80.2707"
//               keyboardType="numbers-and-punctuation"
//               value={longitude}
//               onChangeText={setLongitude}
//             />
//           </View>
//         </View>
//         {errors.location ? (
//           <Text style={[styles.errorText, { color: colors.destructive }]}>{errors.location}</Text>
//         ) : null}

//         {/* Business Logo */}
//         <View style={[styles.sectionHeader, { marginTop: 24 }]}>
//           <Feather name="image" size={16} color={colors.primary} />
//           <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Business Logo (Optional)</Text>
//         </View>

//         <View style={[styles.logoSection, isWide && styles.logoSectionRow]}>
//           <Pressable
//             onPress={handlePickLogo}
//             style={[
//               styles.uploadBox,
//               { borderColor: colors.border, backgroundColor: colors.muted, borderRadius: colors.radius },
//             ]}
//           >
//             {logoUri ? (
//               <Image source={{ uri: logoUri }} style={styles.uploadedImage} resizeMode="cover" />
//             ) : (
//               <>
//                 <Feather name="upload-cloud" size={26} color={colors.primary} />
//                 <Text style={[styles.uploadTitle, { color: colors.foreground }]}>Upload Logo</Text>
//                 <Text style={[styles.uploadHint, { color: colors.mutedForeground }]}>JPG, PNG up to 2MB</Text>
//               </>
//             )}
//           </Pressable>

//           <View style={[styles.previewCard, { borderColor: colors.border, borderRadius: colors.radius }]}>
//             <Text style={[styles.previewLabel, { color: colors.mutedForeground }]}>Preview</Text>
//             <View style={styles.previewRow}>
//               <View style={[styles.previewThumb, { backgroundColor: colors.card }]}>
//                 {logoUri ? (
//                   <Image source={{ uri: logoUri }} style={styles.previewImage} resizeMode="cover" />
//                 ) : (
//                   <Feather name="home" size={18} color={colors.mutedForeground} />
//                 )}
//               </View>
//               <View>
//                 <Text style={[styles.previewName, { color: colors.foreground }]}>{name || 'Your Business Name'}</Text>
//                 <Text style={[styles.previewSub, { color: colors.mutedForeground }]}>Your logo will appear here</Text>
//               </View>
//             </View>
//           </View>
//         </View>

//         {errors.form ? <Text style={[styles.errorText, { color: colors.destructive }]}>{errors.form}</Text> : null}

//         {/* FIX 2: Log out + Save & Continue were overlapping in the wide
//             layout. Root cause was footerRowWide only setting
//             justifyContent:'flex-end' with no explicit sizing, so if
//             PrimaryButton's own width shrinks to fit text, the two
//             buttons can collide. Giving each button a guaranteed
//             minWidth + adding flexShrink:0 keeps them as two separate,
//             neatly spaced buttons on every screen size. */}
//         <View style={[styles.footerRow, isWide && styles.footerRowWide]}>
//           <PrimaryButton
//             label="Log out"
//             onPress={signOut}
//             variant="secondary"
//             style={{
//               ...styles.footerButton,
//               flex: isWide ? 0 : 1,
//               minWidth: isWide ? 140 : undefined,
//             }}
//           />
//           <PrimaryButton
//             label="Save & Continue"
//             onPress={handleCreate}
//             loading={createBusiness.isPending}
//             style={{
//               ...styles.footerButton,
//               flex: isWide ? 0 : 1,
//               minWidth: isWide ? 200 : undefined,
//             }}
//           />
//         </View>
//       </KeyboardAwareScrollViewCompat>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   screen: { flex: 1 },
//   sidebar: {
//     width: 280,
//     paddingHorizontal: 24,
//     paddingBottom: 24,
//   },
//   sidebarBrandRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 40 },
//   sidebarLogo: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
//   sidebarBrand: { fontSize: 16, fontFamily: 'Inter_700Bold', fontWeight: '700' },
//   // FIX 1: removed `flex: 1` here — this was stretching the steps list
//   // to fill the whole sidebar height and pushing the tip card way down,
//   // leaving a big empty gap under "Finish Setup".
//   stepsWrap: { marginBottom: 24 },
//   stepRow: { flexDirection: 'row', gap: 14 },
//   stepCol: { alignItems: 'center' },
//   stepBadge: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
//   stepBadgeText: { fontSize: 13, fontFamily: 'Inter_700Bold', fontWeight: '700' },
//   stepConnector: { width: 2, flex: 1, marginVertical: 4 },
//   stepTitle: { fontSize: 14, fontFamily: 'Inter_600SemiBold', fontWeight: '600' },
//   stepSubtitle: { fontSize: 12, fontFamily: 'Inter_400Regular', marginTop: 2 },
//   tipCard: { borderRadius: 14, padding: 14, gap: 8 },
//   tipText: { fontSize: 12, fontFamily: 'Inter_400Regular', lineHeight: 17 },

//   content: { paddingHorizontal: 24, maxWidth: 760, width: '100%', alignSelf: 'center', gap: 14 },
//   headerRow: { alignItems: 'flex-start', marginBottom: 8 },
//   iconWrap: { width: 56, height: 56, alignItems: 'center', justifyContent: 'center', marginBottom: 14, alignSelf: 'center' },
//   title: { fontSize: 22, fontFamily: 'Inter_700Bold', fontWeight: '700' },
//   subtitle: { fontSize: 13, fontFamily: 'Inter_400Regular', marginTop: 4 },

//   sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 8 },
//   sectionTitle: { fontSize: 15, fontFamily: 'Inter_700Bold', fontWeight: '700' },

//   grid: { gap: 14 },
//   gridRow: { flexDirection: 'row' },
//   gridCol: { flex: 1 },
//   gridRow3: { flexDirection: 'row' },
//   gridCol3: { flex: 1 },

//   logoSection: { gap: 14 },
//   logoSectionRow: { flexDirection: 'row', alignItems: 'stretch' },
//   uploadBox: {
//     flex: 1,
//     minHeight: 130,
//     borderWidth: 1.5,
//     borderStyle: 'dashed',
//     alignItems: 'center',
//     justifyContent: 'center',
//     gap: 4,
//     overflow: 'hidden',
//   },
//   uploadedImage: { width: '100%', height: '100%' },
//   uploadTitle: { fontSize: 13, fontFamily: 'Inter_600SemiBold', fontWeight: '600', marginTop: 6 },
//   uploadHint: { fontSize: 11, fontFamily: 'Inter_400Regular' },
//   previewCard: { flex: 1, borderWidth: 1, padding: 14, justifyContent: 'center' },
//   previewLabel: { fontSize: 11, fontFamily: 'Inter_500Medium', marginBottom: 10 },
//   previewRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
//   previewThumb: { width: 40, height: 40, borderRadius: 10, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
//   previewImage: { width: '100%', height: '100%' },
//   previewName: { fontSize: 13, fontFamily: 'Inter_600SemiBold', fontWeight: '600' },
//   previewSub: { fontSize: 11, fontFamily: 'Inter_400Regular', marginTop: 2 },

//   errorText: { fontSize: 13, fontFamily: 'Inter_400Regular' },
//   // FIX 2: increased gap + flexShrink:0 on buttons stops them from
//   // collapsing into each other; footerRowWide now also wraps if the
//   // window gets too narrow so they never sit on top of one another.
//   footerRow: { flexDirection: 'row', gap: 12, marginTop: 10, flexWrap: 'wrap' },
//   footerRowWide: { justifyContent: 'flex-end' },
//   footerButton: { flexShrink: 0 },
// });

import React, { useState, useRef } from 'react';
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  Modal,
  TextInput,
  ActivityIndicator,
  Platform,
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

// ============================================================
// 🗺️ Load Google Maps JS API script once (web only)
// Same pattern as the customer delivery app's AddressSelectionScreen.
// ============================================================
let googleMapsLoadPromise: Promise<void> | null = null;

const loadGoogleMapsScript = (): Promise<void> => {
  if ((window as any).google?.maps) return Promise.resolve();
  if (googleMapsLoadPromise) return googleMapsLoadPromise;

  googleMapsLoadPromise = new Promise((resolve, reject) => {
    const apiKey = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      reject(new Error('Google Maps API key is missing. Add EXPO_PUBLIC_GOOGLE_MAPS_API_KEY to .env'));
      return;
    }

    const existingScript = document.getElementById('google-maps-script');
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve());
      return;
    }

    const script = document.createElement('script');
    script.id = 'google-maps-script';
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Google Maps script'));
    document.body.appendChild(script);
  });

  return googleMapsLoadPromise;
};

// ============================================================
// 🗺️ Reverse geocode via OpenStreetMap Nominatim (free, no billing)
// Same as the delivery app — Google Maps JS is only used for the
// visual map + draggable pin, address lookup goes through Nominatim.
// ============================================================
const reverseGeocodeNominatim = async (lat: number, lng: number): Promise<any> => {
  const response = await fetch(
    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
    { headers: { Accept: 'application/json' } }
  );

  if (!response.ok) {
    throw new Error(`Reverse geocode failed: ${response.status}`);
  }

  return response.json();
};

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
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
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

  // 📍 Location detection state
  const [gettingLocation, setGettingLocation] = useState(false);

  // 🗺️ Map picker modal state (web)
  const [showMapPicker, setShowMapPicker] = useState(false);
  const [mapMarkerPos, setMapMarkerPos] = useState<{ lat: number; lng: number } | null>(null);
  const [confirmingMapLocation, setConfirmingMapLocation] = useState(false);
  const mapContainerRef = useRef<any>(null);
  const googleMapRef = useRef<any>(null);
  const googleMarkerRef = useRef<any>(null);

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
      const dataUri = asset.base64 ? `data:image/jpeg;base64,${asset.base64}` : asset.uri;
      setLogoUri(dataUri);
    }
  };

  // ============================================================
  // 🗺️ Initialize the interactive map with a draggable marker
  // ============================================================
  const initMapPicker = async (lat: number, lng: number) => {
    try {
      await loadGoogleMapsScript();
    } catch (err: any) {
      console.error('❌ Google Maps script load error:', err);
      setErrors((e) => ({ ...e, location: err?.message || 'Failed to load map.' }));
      return;
    }

    const google = (window as any).google;
    if (!google?.maps || !mapContainerRef.current) return;

    const map = new google.maps.Map(mapContainerRef.current, {
      center: { lat, lng },
      zoom: 16,
      disableDefaultUI: false,
      zoomControl: true,
      streetViewControl: false,
      mapTypeControl: false,
    });

    const marker = new google.maps.Marker({
      position: { lat, lng },
      map,
      draggable: true,
    });

    marker.addListener('dragend', () => {
      const pos = marker.getPosition();
      if (pos) {
        setMapMarkerPos({ lat: pos.lat(), lng: pos.lng() });
      }
    });

    // Tapping anywhere on the map also moves the pin
    map.addListener('click', (e: any) => {
      const lat2 = e.latLng.lat();
      const lng2 = e.latLng.lng();
      marker.setPosition({ lat: lat2, lng: lng2 });
      setMapMarkerPos({ lat: lat2, lng: lng2 });
    });

    googleMapRef.current = map;
    googleMarkerRef.current = marker;
    setMapMarkerPos({ lat, lng });
  };

  // ============================================================
  // 🗺️ User confirms the pin position on the map — fills address
  // fields + lat/lng from the reverse-geocoded pin, no manual entry.
  // ============================================================
  const handleConfirmMapLocation = async () => {
    if (!mapMarkerPos) return;

    setConfirmingMapLocation(true);

    try {
      const data = await reverseGeocodeNominatim(mapMarkerPos.lat, mapMarkerPos.lng);
      const addr = data?.address || {};

      const geoCity =
        addr.city || addr.town || addr.village || addr.suburb || addr.county || '';

      const geoState = addr.state || '';
      const geoPostal = addr.postcode || '';

      const road = addr.road || '';
      const suburb = addr.suburb || '';

      setAddressLine1((prev) => prev.trim() ? prev : (road || data?.display_name || ''));
      setAddressLine2((prev) => prev.trim() ? prev : suburb);
      setCity(geoCity);

      // Match Nominatim's state name against our picker list (case-insensitive)
      const matchedState = INDIAN_STATES.find(
        (s) => s.toLowerCase() === geoState.toLowerCase()
      );
      setState(matchedState || geoState);

      setPostalCode(geoPostal);
      setLatitude(String(mapMarkerPos.lat));
      setLongitude(String(mapMarkerPos.lng));

      setErrors((e) => ({ ...e, location: '' }));
      setShowMapPicker(false);
    } catch (err: any) {
      console.error('❌ Reverse geocode error:', err);

      // Even if address lookup fails, keep the pin's coordinates
      setLatitude(String(mapMarkerPos.lat));
      setLongitude(String(mapMarkerPos.lng));
      setErrors((e) => ({
        ...e,
        location: 'Address lookup failed. Location pin saved — please check the address fields.',
      }));
      setShowMapPicker(false);
    } finally {
      setConfirmingMapLocation(false);
    }
  };

  // ============================================================
  // 📍 "Use Current Location" — gets a GPS/IP fix then opens the
  // interactive map so the store owner can drag/tap to confirm the
  // exact pin before we reverse-geocode it.
  // ============================================================
  const handleUseCurrentLocation = async () => {
    setErrors((e) => ({ ...e, location: '' }));
    setGettingLocation(true);

    if (Platform.OS === 'web') {
      if (typeof navigator === 'undefined' || !navigator.geolocation) {
        setErrors((e) => ({ ...e, location: 'Geolocation is not supported by this browser.' }));
        setGettingLocation(false);
        return;
      }

      const requestWebPosition = (isRetry: boolean) => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude: lat, longitude: lng } = position.coords;
            setGettingLocation(false);
            setShowMapPicker(true);
            // Wait for the modal to render before attaching the map
            setTimeout(() => initMapPicker(lat, lng), 300);
          },
          (error) => {
            if (error?.code === 3 && !isRetry) {
              requestWebPosition(true);
              return;
            }

            let message = error?.message || 'Unable to get your current location.';
            if (error?.code === 1) {
              message = 'Location permission was denied. Please allow location access from your browser settings.';
            } else if (error?.code === 2) {
              message = 'Location is currently unavailable.';
            } else if (error?.code === 3) {
              message = 'Location request timed out. Please check location services and try again.';
            }

            setErrors((e) => ({ ...e, location: message }));
            setGettingLocation(false);
          },
          {
            enableHighAccuracy: false,
            timeout: isRetry ? 30000 : 20000,
            maximumAge: 60000,
          }
        );
      };

      requestWebPosition(false);
      return;
    }

    // 📱 Native (Android/iOS) — get a GPS fix, then open the same map
    // modal for confirmation (react-native-maps would be needed to
    // render the map natively; for now we reverse-geocode the raw fix).
    try {
      const Location = await import('expo-location');
      const perm = await Location.requestForegroundPermissionsAsync();
      if (!perm.granted) {
        setErrors((e) => ({ ...e, location: 'Location permission denied. Enter address manually.' }));
        setGettingLocation(false);
        return;
      }

      const pos = await Location.getCurrentPositionAsync({});
      const { latitude: lat, longitude: lng } = pos.coords;

      try {
        const data = await reverseGeocodeNominatim(lat, lng);
        const addr = data?.address || {};
        const geoCity = addr.city || addr.town || addr.village || addr.suburb || addr.county || '';
        const geoState = addr.state || '';
        const geoPostal = addr.postcode || '';

        setAddressLine1((prev) => prev.trim() ? prev : (addr.road || data?.display_name || ''));
        setAddressLine2((prev) => prev.trim() ? prev : (addr.suburb || ''));
        setCity(geoCity);

        const matchedState = INDIAN_STATES.find((s) => s.toLowerCase() === geoState.toLowerCase());
        setState(matchedState || geoState);
        setPostalCode(geoPostal);
      } catch {
        // Address lookup failed — coordinates still saved below
      }

      setLatitude(String(lat));
      setLongitude(String(lng));
      setErrors((e) => ({ ...e, location: '' }));
    } catch {
      setErrors((e) => ({ ...e, location: 'Could not detect location. Enter manually.' }));
    } finally {
      setGettingLocation(false);
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
          latitude: latitude.trim() ? parseFloat(latitude.trim()) : undefined,
          longitude: longitude.trim() ? parseFloat(longitude.trim()) : undefined
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

        {/* 📍 Use Current Location — now opens the map picker instead of
            filling raw lat/lng fields. Address fields below get
            auto-filled once the pin is confirmed. */}
        <Pressable
          onPress={handleUseCurrentLocation}
          disabled={gettingLocation}
          style={[
            styles.uploadBox,
            {
              borderColor: colors.border,
              backgroundColor: colors.muted,
              borderRadius: colors.radius,
              minHeight: 56,
              marginBottom: 4,
              flexDirection: 'row',
              gap: 8,
            }
          ]}
        >
          {gettingLocation ? (
            <ActivityIndicator size="small" color={colors.primary} />
          ) : (
            <>
              <Feather name="crosshair" size={18} color={colors.primary} />
              <Text style={[styles.uploadTitle, { color: colors.foreground, marginTop: 0 }]}>Use Current Location</Text>
            </>
          )}
        </Pressable>

        {errors.location ? (
          <Text style={[styles.errorText, { color: colors.destructive, marginBottom: 8 }]}>{errors.location}</Text>
        ) : null}

        {latitude !== '' && (
          <View style={[styles.locationDetected, { backgroundColor: colors.primary + '15', borderRadius: colors.radius }]}>
            <Feather name="check-circle" size={14} color={colors.primary} />
            <Text style={[styles.locationDetectedText, { color: colors.primary }]}>Location detected ✓</Text>
          </View>
        )}

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
          <PrimaryButton
            label="Log out"
            onPress={signOut}
            variant="secondary"
            style={{
              ...styles.footerButton,
              flex: isWide ? 0 : 1,
              minWidth: isWide ? 140 : undefined,
            }}
          />
          <PrimaryButton
            label="Save & Continue"
            onPress={handleCreate}
            loading={createBusiness.isPending}
            style={{
              ...styles.footerButton,
              flex: isWide ? 0 : 1,
              minWidth: isWide ? 200 : undefined,
            }}
          />
        </View>
      </KeyboardAwareScrollViewCompat>

      {/* 🗺️ GOOGLE MAP PICKER MODAL (WEB) */}
      {Platform.OS === 'web' && (
        <Modal
          visible={showMapPicker}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setShowMapPicker(false)}
        >
          <View style={styles.modalContainer}>
            <View style={[styles.modalContent, { height: '85%', padding: 0 }]}>
              <View style={[styles.modalHeader, { padding: 16, borderBottomColor: colors.border }]}>
                <Text style={[styles.modalTitle, { color: colors.foreground }]}>Confirm Store Location</Text>
                <Pressable onPress={() => setShowMapPicker(false)}>
                  <Feather name="x" size={22} color={colors.foreground} />
                </Pressable>
              </View>

              <Text style={{ paddingHorizontal: 16, paddingBottom: 8, color: colors.mutedForeground, fontSize: 13 }}>
                Drag the pin or tap the map to set your exact store location
              </Text>

              {/* Map container — plain View renders as a <div> on web,
                  Google Maps JS attaches directly to this DOM node */}
              <View
                ref={mapContainerRef}
                // @ts-ignore — web-only DOM styling
                style={{ flex: 1, marginHorizontal: 16, borderRadius: 12, overflow: 'hidden' }}
              />

              <View style={{ padding: 16 }}>
                <Pressable
                  style={[
                    styles.confirmMapButton,
                    { backgroundColor: colors.primary },
                    confirmingMapLocation && { opacity: 0.6 },
                  ]}
                  onPress={handleConfirmMapLocation}
                  disabled={confirmingMapLocation || !mapMarkerPos}
                >
                  {confirmingMapLocation ? (
                    <ActivityIndicator size="small" color={colors.primaryForeground} />
                  ) : (
                    <Text style={[styles.confirmMapButtonText, { color: colors.primaryForeground }]}>
                      Confirm This Location
                    </Text>
                  )}
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  sidebar: {
    width: 280,
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  sidebarBrandRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 40 },
  sidebarLogo: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  sidebarBrand: { fontSize: 16, fontFamily: 'Inter_700Bold', fontWeight: '700' },
  stepsWrap: { marginBottom: 24 },
  stepRow: { flexDirection: 'row', gap: 14 },
  stepCol: { alignItems: 'center' },
  stepBadge: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  stepBadgeText: { fontSize: 13, fontFamily: 'Inter_700Bold', fontWeight: '700' },
  stepConnector: { width: 2, flex: 1, marginVertical: 4 },
  stepTitle: { fontSize: 14, fontFamily: 'Inter_600SemiBold', fontWeight: '600' },
  stepSubtitle: { fontSize: 12, fontFamily: 'Inter_400Regular', marginTop: 2 },
  tipCard: { borderRadius: 14, padding: 14, gap: 8 },
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

  locationDetected: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginBottom: 12,
    alignSelf: 'flex-start',
  },
  locationDetectedText: { fontSize: 12, fontFamily: 'Inter_500Medium', fontWeight: '500' },

  errorText: { fontSize: 13, fontFamily: 'Inter_400Regular' },
  footerRow: { flexDirection: 'row', gap: 12, marginTop: 10, flexWrap: 'wrap' },
  footerRowWide: { justifyContent: 'flex-end' },
  footerButton: { flexShrink: 0 },

  // 🗺️ Map picker modal
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
  },
  modalTitle: { fontSize: 18, fontFamily: 'Inter_700Bold', fontWeight: '700' },
  confirmMapButton: {
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  confirmMapButtonText: { fontSize: 16, fontFamily: 'Inter_600SemiBold', fontWeight: '600' },
});
