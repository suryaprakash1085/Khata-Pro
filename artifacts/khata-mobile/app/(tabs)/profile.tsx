// import React, { useState } from 'react';
// import {
//   ScrollView,
//   StyleSheet,
//   View,
//   Text,
//   TextInput,
//   Pressable,
//   Alert,
//   Platform,
//   useWindowDimensions,
// } from 'react-native';
// import { Feather } from '@expo/vector-icons';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import { useQueryClient } from '@tanstack/react-query';
// import { Avatar } from '@/components/Avatar';
// import { useColors } from '@/hooks/useColors';
// import { useAuth } from '@/contexts/AuthContext';
// import { useBusiness } from '@/contexts/BusinessContext';

// import {
//   useUpdateBusiness,
//   useRegister,
//   useAddStaff,
//   getGetBusinessQueryKey,
//   type BusinessUpdate,
//   type StaffPermissions,
// } from '@workspace/api-client-react';

// const FONT = 'Times New Roman';

// const LANGUAGE_NAMES: Record<string, string> = {
//   en: 'English',
//   ta: 'Tamil',
//   hi: 'Hindi',
//   te: 'Telugu',
//   kn: 'Kannada',
//   ml: 'Malayalam',
//   mr: 'Marathi',
//   bn: 'Bengali',
//   gu: 'Gujarati',
// };

// function languageFullName(code?: string | null) {
//   if (!code) return 'English';
//   return LANGUAGE_NAMES[code.toLowerCase()] ?? code;
// }

// // ─────────────────────────────────────────────────────────────────────────
// // Shared pieces
// // ─────────────────────────────────────────────────────────────────────────

// function TimesButton({
//   label,
//   onPress,
//   disabled,
//   variant = 'default',
//   style,
// }: {
//   label: string;
//   onPress: () => void;
//   disabled?: boolean;
//   variant?: 'default' | 'destructive';
//   style?: any;
// }) {
//   const colors = useColors();
//   const bg = variant === 'destructive' ? (colors.destructive ?? '#DC2626') : colors.primary;

//   return (
//     <Pressable
//       onPress={onPress}
//       disabled={disabled}
//       style={[
//         {
//           backgroundColor: bg,
//           paddingVertical: 10,
//           paddingHorizontal: 18,
//           borderRadius: 6,
//           alignItems: 'center',
//           justifyContent: 'center',
//           opacity: disabled ? 0.6 : 1,
//         },
//         style,
//       ]}
//     >
//       <Text style={{ fontFamily: FONT, color: '#fff', fontSize: 14, fontWeight: '600' }}>{label}</Text>
//     </Pressable>
//   );
// }

// function SectionLabel({ text }: { text: string }) {
//   const colors = useColors();
//   return (
//     <View style={styles.sectionLabelRow}>
//       <View style={[styles.sectionLabelBar, { backgroundColor: colors.primary }]} />
//       <Text style={[styles.sectionLabel, { color: colors.foreground }]}>{text.toUpperCase()}</Text>
//     </View>
//   );
// }

// function InfoRow({
//   icon,
//   label,
//   value,
//   onEdit,
//   dense,
// }: {
//   icon: keyof typeof Feather.glyphMap;
//   label: string;
//   value: string;
//   onEdit?: () => void;
//   dense?: boolean;
// }) {
//   const colors = useColors();

//   return (
//     <View style={[styles.infoRow, { borderBottomColor: colors.border }, dense && { paddingVertical: 10 }]}>
//       <Feather name={icon} size={15} color={colors.mutedForeground} style={{ width: 22 }} />
//       <Text style={[styles.infoLabel, { color: colors.mutedForeground }]}>{label}</Text>
//       <Text style={[styles.infoValue, { color: colors.foreground }]} numberOfLines={1}>
//         {value}
//       </Text>
//       {onEdit && (
//         <Pressable onPress={onEdit} hitSlop={10} style={{ marginLeft: 10 }}>
//           <Feather name="edit-2" size={15} color={colors.primary} />
//         </Pressable>
//       )}
//     </View>
//   );
// }

// // NOTE: no handleLogout / signOut here — this component has no access to auth.
// function EditableRow({
//   icon,
//   label,
//   value,
//   placeholder,
//   onSave,
//   saving,
// }: {
//   icon: keyof typeof Feather.glyphMap;
//   label: string;
//   value: string;
//   placeholder?: string;
//   onSave: (val: string) => void;
//   saving: boolean;
// }) {
//   const colors = useColors();
//   const [editing, setEditing] = useState(false);
//   const [draft, setDraft] = useState(value);

//   if (!editing) {
//     return (
//       <InfoRow
//         icon={icon}
//         label={label}
//         value={value || 'Not added'}
//         onEdit={() => {
//           setDraft(value);
//           setEditing(true);
//         }}
//       />
//     );
//   }

//   return (
//     <View style={[styles.inlineEditContainer, { borderBottomColor: colors.border }]}>
//       <Text style={[styles.inputLabel, { color: colors.mutedForeground }]}>{label}</Text>
//       <TextInput
//         value={draft}
//         onChangeText={setDraft}
//         placeholder={placeholder}
//         placeholderTextColor={colors.mutedForeground}
//         autoFocus
//         style={[
//           styles.input,
//           { color: colors.foreground, borderColor: colors.border, backgroundColor: colors.background },
//         ]}
//       />
//       <View style={styles.actionRow}>
//         <Pressable style={styles.cancelButton} onPress={() => setEditing(false)}>
//           <Text style={[styles.cancelText, { color: colors.mutedForeground }]}>Cancel</Text>
//         </Pressable>
//         <TimesButton
//           label={saving ? 'Saving...' : 'Save'}
//           onPress={() => {
//             onSave(draft.trim());
//             setEditing(false);
//           }}
//           style={{ flex: 1 }}
//         />
//       </View>
//     </View>
//   );
// }

// // ─────────────────────────────────────────────────────────────────────────
// // Screen
// // ─────────────────────────────────────────────────────────────────────────

// export default function ProfileScreen() {
//   const colors = useColors();
//   const insets = useSafeAreaInsets();
//   const { width } = useWindowDimensions();
//   const isWide = width >= 820;

//   const { user, signOut } = useAuth();
//   const { business } = useBusiness();
// const isOwner = user?.role === 'owner';
//   const queryClient = useQueryClient();

//   // ── Logout — defined HERE, where `signOut` actually exists ────────────
//   const handleLogout = () => {
//     if (Platform.OS === 'web') {
//       if (window.confirm('Are you sure you want to logout?')) {
//         signOut();
//       }
//     } else {
//       Alert.alert('Logout', 'Are you sure you want to logout?', [
//         { text: 'Cancel', style: 'cancel' },
//         { text: 'Logout', style: 'destructive', onPress: signOut },
//       ]);
//     }
//   };

//   const updateBusiness = useUpdateBusiness({
//     mutation: {
//       onSuccess: () => {
//         if (business?.id) {
//           queryClient.invalidateQueries({ queryKey: getGetBusinessQueryKey(business.id) });
//         }
//       },
//       onError: () => Alert.alert('Error', 'Unable to update business details.'),
//     },
//   });

//   const saveBusinessField = (payload: BusinessUpdate) => {
//     if (!business?.id) return;
//     updateBusiness.mutate({ id: business.id, data: payload });
//   };

//   // ── Add employee ──────────────────────────────────────────────────────
//   const [staffFormOpen, setStaffFormOpen] = useState(false);
//   const [staffName, setStaffName] = useState('');
//   const [staffPhone, setStaffPhone] = useState('');
//   const [staffEmail, setStaffEmail] = useState('');
//   const [staffPassword, setStaffPassword] = useState('');
//   const [permissions, setPermissions] = useState<StaffPermissions>({
//     add_entry: true,
//     delete_entry: false,
//     view_reports: false,
//     manage_customers: false,
//   });

//   const register = useRegister();
//   const addStaff = useAddStaff({
//     mutation: {
//       onSuccess: () => {
//         setStaffFormOpen(false);
//         resetStaffForm();
//         queryClient.invalidateQueries({ queryKey: ['reports', 'employee-performance'], exact: false });
//         Alert.alert('Employee added', `${staffName} can now log in with the phone/email you entered.`);
//       },
//       onError: () => Alert.alert('Could not add employee', 'The account may already exist, or something went wrong.'),
//     },
//   });

//   const resetStaffForm = () => {
//     setStaffName('');
//     setStaffPhone('');
//     setStaffEmail('');
//     setStaffPassword('');
//     setPermissions({ add_entry: true, delete_entry: false, view_reports: false, manage_customers: false });
//   };

//   const togglePermission = (key: keyof StaffPermissions) => {
//     setPermissions((prev) => ({ ...prev, [key]: !prev[key] }));
//   };

//   const submitStaff = () => {
//     if (!business?.id) return;
//     if (!staffName || !staffPhone || !staffEmail || !staffPassword) {
//       Alert.alert('Missing info', 'Please fill in name, phone, email, and a password for the employee.');
//       return;
//     }
//     register.mutate(
//       { data: { name: staffName, phone: staffPhone, email: staffEmail, password: staffPassword } },
//       {
//         onSuccess: (auth: any) => {
//           addStaff.mutate({ id: business.id, data: { user_id: auth.user.id, permissions } });
//         },
//         onError: () => Alert.alert('Could not create login', 'That phone or email may already be registered.'),
//       }
//     );
//   };

//   // ── Column building blocks ──────────────────────────────────────────

//   const identityCard = (
//     <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
//       <View style={styles.identityRow}>
//         <Avatar name={user?.name ?? '?'} size={56} />
//         <View style={{ flex: 1, marginLeft: 14 }}>
//           <Text style={[styles.ownerName, { color: colors.foreground }]}>{user?.name}</Text>
//           <Text style={[styles.ownerMeta, { color: colors.mutedForeground }]}>
//             {(user?.role ?? 'OWNER').toUpperCase()} · {user?.phone}
//           </Text>
//         </View>

//         <View style={styles.headerActions}>
//           <View style={[styles.planTag, { backgroundColor: colors.primary }]}>
//             <Text style={styles.planTagText}>{(business?.plan ?? 'FREE').toUpperCase()}</Text>
//           </View>
//           {/* fixed: now calls handleLogout, not the old broken inline Alert */}
//           <TimesButton
//             label="Logout"
//             variant="destructive"
//             onPress={handleLogout}
//             style={styles.logoutButton}
//           />
//         </View>
//       </View>

//       <View style={[styles.divider, { backgroundColor: colors.border }]} />

//       <Text style={[styles.businessName, { color: colors.foreground }]}>
//         {business?.business_name ?? '-'}
//       </Text>
//       <Text style={[styles.businessType, { color: colors.mutedForeground }]}>
//         {business?.business_type ?? '-'}
//       </Text>
//     </View>
//   );

//   const businessInfoCard = (
//     <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
//       <SectionLabel text="Business Information" />
//       <EditableRow
//         icon="briefcase"
//         label="Business Name"
//         value={business?.business_name ?? ''}
//         onSave={(val) => saveBusinessField({ business_name: val })}
//         saving={updateBusiness.isPending}
//       />
//       <EditableRow
//         icon="tag"
//         label="Business Type"
//         value={business?.business_type ?? ''}
//         onSave={(val) => saveBusinessField({ business_type: val })}
//         saving={updateBusiness.isPending}
//       />
//       <EditableRow
//         icon="hash"
//         label="GST Number"
//         value={business?.gstin ?? ''}
//         placeholder="22AAAAA0000A1Z5"
//         onSave={(val) => saveBusinessField({ gstin: val })}
//         saving={updateBusiness.isPending}
//       />
//       <EditableRow
//         icon="map-pin"
//         label="Address"
//         value={business?.address_line1 ?? ''}
//         onSave={(val) => saveBusinessField({ address_line1: val })}
//         saving={updateBusiness.isPending}
//       />
//       <InfoRow icon="dollar-sign" label="Currency" value={business?.currency ?? 'INR'} />
//       <InfoRow icon="star" label="Plan" value={(business?.plan ?? 'free').toUpperCase()} dense />
//     </View>
//   );

//   const accountInfoCard = (
//     <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
//       <SectionLabel text="Account Information" />
//       <InfoRow icon="user" label="Owner" value={user?.name ?? '-'} />
//       <InfoRow icon="phone" label="Phone" value={user?.phone ?? '-'} />
//       <InfoRow icon="mail" label="Email" value={user?.email ?? '-'} />
//       <InfoRow icon="shield" label="Role" value={(user?.role ?? 'OWNER').toUpperCase()} />
//       <InfoRow icon="globe" label="Language" value={languageFullName(user?.language_pref)} dense />
//     </View>
//   );

//   const teamCard = (
    
//     <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
//       <SectionLabel text="Team" />
//       {!staffFormOpen ? (
//         <View style={{ paddingTop: 4 }}>
//           <Text style={[styles.teamHint, { color: colors.mutedForeground }]}>
//             Add a login for a staff member so they can use this app. Viewing the list of existing staff
//             isn't supported by the backend yet — only adding new ones is.
//           </Text>
//           <TimesButton label="+ Add Employee" onPress={() => setStaffFormOpen(true)} style={{ marginTop: 14 }} />
//         </View>
//       ) : (
//         <View style={{ paddingTop: 4 }}>
//           <Text style={[styles.inputLabel, { color: colors.mutedForeground }]}>Name</Text>
//           <TextInput
//             value={staffName}
//             onChangeText={setStaffName}
//             placeholder="Employee name"
//             placeholderTextColor={colors.mutedForeground}
//             style={[styles.input, { color: colors.foreground, borderColor: colors.border, backgroundColor: colors.background }]}
//           />

//           <Text style={[styles.inputLabel, { color: colors.mutedForeground, marginTop: 12 }]}>Phone</Text>
//           <TextInput
//             value={staffPhone}
//             onChangeText={setStaffPhone}
//             placeholder="10-digit phone number"
//             placeholderTextColor={colors.mutedForeground}
//             keyboardType="phone-pad"
//             style={[styles.input, { color: colors.foreground, borderColor: colors.border, backgroundColor: colors.background }]}
//           />

//           <Text style={[styles.inputLabel, { color: colors.mutedForeground, marginTop: 12 }]}>Email</Text>
//           <TextInput
//             value={staffEmail}
//             onChangeText={setStaffEmail}
//             placeholder="employee@email.com"
//             placeholderTextColor={colors.mutedForeground}
//             keyboardType="email-address"
//             autoCapitalize="none"
//             style={[styles.input, { color: colors.foreground, borderColor: colors.border, backgroundColor: colors.background }]}
//           />

//           <Text style={[styles.inputLabel, { color: colors.mutedForeground, marginTop: 12 }]}>Temporary Password</Text>
//           <TextInput
//             value={staffPassword}
//             onChangeText={setStaffPassword}
//             placeholder="They can change this later"
//             placeholderTextColor={colors.mutedForeground}
//             secureTextEntry
//             style={[styles.input, { color: colors.foreground, borderColor: colors.border, backgroundColor: colors.background }]}
//           />

//           <Text style={[styles.inputLabel, { color: colors.mutedForeground, marginTop: 16 }]}>Permissions</Text>
//           {(
//             [
//               ['add_entry', 'Add Entries'],
//               ['delete_entry', 'Delete Entries'],
//               ['view_reports', 'View Reports'],
//               ['manage_customers', 'Manage Customers'],
//             ] as [keyof StaffPermissions, string][]
//           ).map(([key, label]) => (
//             <Pressable
//               key={key}
//               onPress={() => togglePermission(key)}
//               style={[styles.permissionRow, { borderBottomColor: colors.border }]}
//             >
//               <Text style={[styles.permissionLabel, { color: colors.foreground }]}>{label}</Text>
//               <Feather
//                 name={permissions[key] ? 'check-square' : 'square'}
//                 size={18}
//                 color={permissions[key] ? colors.primary : colors.mutedForeground}
//               />
//             </Pressable>
//           ))}

//           <View style={styles.actionRow}>
//             <Pressable
//               style={styles.cancelButton}
//               onPress={() => {
//                 setStaffFormOpen(false);
//                 resetStaffForm();
//               }}
//             >
//               <Text style={[styles.cancelText, { color: colors.mutedForeground }]}>Cancel</Text>
//             </Pressable>
//             <TimesButton
//               label={register.isPending || addStaff.isPending ? 'Adding…' : 'Add Employee'}
//               onPress={submitStaff}
//               disabled={register.isPending || addStaff.isPending}
//               style={{ flex: 1 }}
//             />
//           </View>
//         </View>
//       )}
//     </View>
//   );

//   const supportCard = (
//     <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
//       <SectionLabel text="Help & Support" />
//       <InfoRow icon="phone-call" label="Contact Support" value={user?.phone ?? '—'} />
//       <InfoRow icon="mail" label="Support Email" value={user?.email ?? '—'} dense />
//     </View>
//   );

//   return (
//     <ScrollView
//       style={{ flex: 1, backgroundColor: colors.background }}
//       contentContainerStyle={{
//         paddingTop: insets.top + 8,
//         paddingBottom: insets.bottom + 16,
//         paddingHorizontal: isWide ? 20 : 16,
//         maxWidth: 1280,
//         alignSelf: 'center',
//         width: '100%',
//       }}
//     >
//       <Text style={[styles.pageTitle, { color: colors.foreground }]}>Profile & Settings</Text>

//       {identityCard}

//    {isWide ? (
//   <View style={styles.twoColRow}>
//     <View style={styles.col}>
//       {businessInfoCard}
//       {isOwner && teamCard}
//     </View>
//     <View style={styles.col}>
//       {accountInfoCard}
//       {supportCard}
//     </View>
//   </View>
// ) : (
//   <>
//     {businessInfoCard}
//     {accountInfoCard}
//     {isOwner && teamCard}
//     {supportCard}
//   </>
// )}
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   pageTitle: { fontFamily: FONT, fontSize: 22, fontWeight: '700', marginBottom: 12, letterSpacing: 0.3 },

//   twoColRow: { flexDirection: 'row', gap: 16 },
//   col: { flex: 1 },

//   card: { borderRadius: 4, borderWidth: 1, padding: 16, marginBottom: 14 },
//   identityRow: { flexDirection: 'row', alignItems: 'center' },
//   ownerName: { fontFamily: FONT, fontSize: 18, fontWeight: '700' },
//   ownerMeta: { fontFamily: FONT, fontSize: 13, marginTop: 3 },

//   headerActions: { alignItems: 'flex-end', gap: 8 },
//   planTag: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 3 },
//   planTagText: { fontFamily: FONT, color: '#fff', fontSize: 11, fontWeight: '700', letterSpacing: 0.5 },
//   logoutButton: { width: 100, paddingVertical: 6, borderRadius: 4 },

//   divider: { height: 1, marginVertical: 12 },
//   businessName: { fontFamily: FONT, fontSize: 20, fontWeight: '700' },
//   businessType: { fontFamily: FONT, fontSize: 13, marginTop: 2 },

//   sectionLabelRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
//   sectionLabelBar: { width: 3, height: 14, borderRadius: 2, marginRight: 8 },
//   sectionLabel: { fontFamily: FONT, fontSize: 13, fontWeight: '700', letterSpacing: 0.8 },

//   infoRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: StyleSheet.hairlineWidth },
//   infoLabel: { fontFamily: FONT, fontSize: 13, width: 110 },
//   infoValue: { fontFamily: FONT, fontSize: 14, fontWeight: '600', flex: 1 },

//   inlineEditContainer: { paddingVertical: 12, borderBottomWidth: StyleSheet.hairlineWidth },
//   inputLabel: { fontFamily: FONT, fontSize: 12, marginBottom: 6, fontWeight: '600' },
//   input: { fontFamily: FONT, borderWidth: 1, borderRadius: 4, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14 },
//   actionRow: { flexDirection: 'row', marginTop: 16, alignItems: 'center' },
//   cancelButton: { paddingHorizontal: 14, paddingVertical: 12, marginRight: 12 },
//   cancelText: { fontFamily: FONT, fontWeight: '600' },

//   teamHint: { fontFamily: FONT, fontSize: 13, lineHeight: 19 },
//   permissionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, borderBottomWidth: StyleSheet.hairlineWidth },
//   permissionLabel: { fontFamily: FONT, fontSize: 14 },
// });
import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  TextInput,
  Pressable,
  Switch,
  Alert,
  Platform,
  useWindowDimensions,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useQueryClient } from '@tanstack/react-query';
import { Avatar } from '@/components/Avatar';
import { useColors } from '@/hooks/useColors';
import { useAuth } from '@/contexts/AuthContext';
import { useBusiness } from '@/contexts/BusinessContext';

import {
  useUpdateBusiness,
  useRegister,
  useAddStaff,
  getGetBusinessQueryKey,
  useListServiceHighlights,
  useCreateServiceHighlight,
  useUpdateServiceHighlight,
  useUpdateServiceHighlightStatus,
  useDeleteServiceHighlight,
  getListServiceHighlightsQueryKey,
  type BusinessUpdate,
  type StaffPermissions,
  type ServiceHighlight,
} from '@workspace/api-client-react';

const FONT = 'Times New Roman';

const LANGUAGE_NAMES: Record<string, string> = {
  en: 'English',
  ta: 'Tamil',
  hi: 'Hindi',
  te: 'Telugu',
  kn: 'Kannada',
  ml: 'Malayalam',
  mr: 'Marathi',
  bn: 'Bengali',
  gu: 'Gujarati',
};

function languageFullName(code?: string | null) {
  if (!code) return 'English';
  return LANGUAGE_NAMES[code.toLowerCase()] ?? code;
}

// icon key stored in DB  →  Feather glyph shown in UI
const HIGHLIGHT_ICON_OPTIONS: { key: string; feather: keyof typeof Feather.glyphMap }[] = [
  { key: 'flash', feather: 'zap' },
  { key: 'time', feather: 'clock' },
  { key: 'shield', feather: 'shield' },
  { key: 'package', feather: 'package' },
  { key: 'heart', feather: 'heart' },
  { key: 'truck', feather: 'truck' },
];

function highlightIconToFeather(icon: string): keyof typeof Feather.glyphMap {
  return HIGHLIGHT_ICON_OPTIONS.find((o) => o.key === icon)?.feather ?? 'zap';
}

// ─────────────────────────────────────────────────────────────────────────
// Shared pieces
// ─────────────────────────────────────────────────────────────────────────

function TimesButton({
  label,
  onPress,
  disabled,
  variant = 'default',
  style,
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  variant?: 'default' | 'destructive';
  style?: any;
}) {
  const colors = useColors();
  const bg = variant === 'destructive' ? (colors.destructive ?? '#DC2626') : colors.primary;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={[
        {
          backgroundColor: bg,
          paddingVertical: 10,
          paddingHorizontal: 18,
          borderRadius: 6,
          alignItems: 'center',
          justifyContent: 'center',
          opacity: disabled ? 0.6 : 1,
        },
        style,
      ]}
    >
      <Text style={{ fontFamily: FONT, color: '#fff', fontSize: 14, fontWeight: '600' }}>{label}</Text>
    </Pressable>
  );
}

function SectionLabel({ text }: { text: string }) {
  const colors = useColors();
  return (
    <View style={styles.sectionLabelRow}>
      <View style={[styles.sectionLabelBar, { backgroundColor: colors.primary }]} />
      <Text style={[styles.sectionLabel, { color: colors.foreground }]}>{text.toUpperCase()}</Text>
    </View>
  );
}

function InfoRow({
  icon,
  label,
  value,
  onEdit,
  dense,
}: {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  value: string;
  onEdit?: () => void;
  dense?: boolean;
}) {
  const colors = useColors();

  return (
    <View style={[styles.infoRow, { borderBottomColor: colors.border }, dense && { paddingVertical: 10 }]}>
      <Feather name={icon} size={15} color={colors.mutedForeground} style={{ width: 22 }} />
      <Text style={[styles.infoLabel, { color: colors.mutedForeground }]}>{label}</Text>
      <Text style={[styles.infoValue, { color: colors.foreground }]} numberOfLines={1}>
        {value}
      </Text>
      {onEdit && (
        <Pressable onPress={onEdit} hitSlop={10} style={{ marginLeft: 10 }}>
          <Feather name="edit-2" size={15} color={colors.primary} />
        </Pressable>
      )}
    </View>
  );
}

// NOTE: no handleLogout / signOut here — this component has no access to auth.
function EditableRow({
  icon,
  label,
  value,
  placeholder,
  onSave,
  saving,
}: {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  value: string;
  placeholder?: string;
  onSave: (val: string) => void;
  saving: boolean;
}) {
  const colors = useColors();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);

  if (!editing) {
    return (
      <InfoRow
        icon={icon}
        label={label}
        value={value || 'Not added'}
        onEdit={() => {
          setDraft(value);
          setEditing(true);
        }}
      />
    );
  }

  return (
    <View style={[styles.inlineEditContainer, { borderBottomColor: colors.border }]}>
      <Text style={[styles.inputLabel, { color: colors.mutedForeground }]}>{label}</Text>
      <TextInput
        value={draft}
        onChangeText={setDraft}
        placeholder={placeholder}
        placeholderTextColor={colors.mutedForeground}
        autoFocus
        style={[
          styles.input,
          { color: colors.foreground, borderColor: colors.border, backgroundColor: colors.background },
        ]}
      />
      <View style={styles.actionRow}>
        <Pressable style={styles.cancelButton} onPress={() => setEditing(false)}>
          <Text style={[styles.cancelText, { color: colors.mutedForeground }]}>Cancel</Text>
        </Pressable>
        <TimesButton
          label={saving ? 'Saving...' : 'Save'}
          onPress={() => {
            onSave(draft.trim());
            setEditing(false);
          }}
          style={{ flex: 1 }}
        />
      </View>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Why Choose Us — service highlights (inline expand, same pattern as EditableRow)
// ─────────────────────────────────────────────────────────────────────────

type HighlightDraft = {
  title: string;
  description: string;
  icon: string;
  is_active: boolean;
};

const EMPTY_HIGHLIGHT_DRAFT: HighlightDraft = { title: '', description: '', icon: 'flash', is_active: true };

function HighlightForm({
  draft,
  setDraft,
  onCancel,
  onSave,
  saving,
  error,
}: {
  draft: HighlightDraft;
  setDraft: React.Dispatch<React.SetStateAction<HighlightDraft>>;
  onCancel: () => void;
  onSave: () => void;
  saving: boolean;
  error: string | null;
}) {
  const colors = useColors();
  return (
    <View style={[styles.highlightFormContainer, { borderColor: colors.border, backgroundColor: colors.background }]}>
      <Text style={[styles.inputLabel, { color: colors.mutedForeground }]}>Icon</Text>
      <View style={styles.highlightIconRow}>
        {HIGHLIGHT_ICON_OPTIONS.map((opt) => {
          const selected = draft.icon === opt.key;
          return (
            <Pressable
              key={opt.key}
              onPress={() => setDraft((d) => ({ ...d, icon: opt.key }))}
              style={[
                styles.highlightIconOption,
                {
                  borderColor: selected ? colors.primary : colors.border,
                  backgroundColor: selected ? colors.primary + '15' : 'transparent',
                },
              ]}
            >
              <Feather name={opt.feather} size={18} color={selected ? colors.primary : colors.mutedForeground} />
            </Pressable>
          );
        })}
      </View>

      <Text style={[styles.inputLabel, { color: colors.mutedForeground, marginTop: 14 }]}>Highlight Title</Text>
      <TextInput
        value={draft.title}
        onChangeText={(v) => setDraft((d) => ({ ...d, title: v }))}
        placeholder="Fast Delivery"
        placeholderTextColor={colors.mutedForeground}
        maxLength={100}
        style={[styles.input, { color: colors.foreground, borderColor: colors.border, backgroundColor: colors.card }]}
      />

      <Text style={[styles.inputLabel, { color: colors.mutedForeground, marginTop: 12 }]}>Short Description</Text>
      <TextInput
        value={draft.description}
        onChangeText={(v) => setDraft((d) => ({ ...d, description: v }))}
        placeholder="We deliver your orders quickly and safely."
        placeholderTextColor={colors.mutedForeground}
        maxLength={300}
        multiline
        numberOfLines={2}
        style={[
          styles.input,
          { color: colors.foreground, borderColor: colors.border, backgroundColor: colors.card, minHeight: 60, textAlignVertical: 'top' },
        ]}
      />

      <View style={styles.highlightStatusRow}>
        <Text style={[styles.inputLabel, { color: colors.mutedForeground, marginTop: 0 }]}>
          {draft.is_active ? 'Active' : 'Inactive'}
        </Text>
        <Switch
          value={draft.is_active}
          onValueChange={(v) => setDraft((d) => ({ ...d, is_active: v }))}
          trackColor={{ true: colors.primary }}
        />
      </View>

      {error && <Text style={[styles.highlightErrorText, { color: colors.destructive ?? '#DC2626' }]}>{error}</Text>}

      <View style={styles.actionRow}>
        <Pressable style={styles.cancelButton} onPress={onCancel}>
          <Text style={[styles.cancelText, { color: colors.mutedForeground }]}>Cancel</Text>
        </Pressable>
        <TimesButton label={saving ? 'Saving...' : 'Save Highlight'} onPress={onSave} disabled={saving} style={{ flex: 1 }} />
      </View>
    </View>
  );
}

function HighlightRow({
  highlight,
  onEdit,
  onDelete,
  onToggleStatus,
  toggling,
}: {
  highlight: ServiceHighlight;
  onEdit: () => void;
  onDelete: () => void;
  onToggleStatus: (next: boolean) => void;
  toggling: boolean;
}) {
  const colors = useColors();
  return (
    <View style={[styles.highlightRow, { borderBottomColor: colors.border }]}>
      <View style={[styles.highlightIconBadge, { backgroundColor: colors.primary + '15' }]}>
        <Feather name={highlightIconToFeather(highlight.icon)} size={18} color={colors.primary} />
      </View>

      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text style={[styles.highlightTitle, { color: colors.foreground }]}>{highlight.title}</Text>
        <Text style={[styles.highlightDesc, { color: colors.mutedForeground }]} numberOfLines={2}>
          {highlight.description}
        </Text>
      </View>

      <View style={styles.highlightRowActions}>
        <Text
          style={[
            styles.highlightStatusTag,
            {
              color: highlight.is_active ? '#16A34A' : colors.mutedForeground,
              backgroundColor: highlight.is_active ? '#16A34A15' : colors.border + '55',
            },
          ]}
        >
          {highlight.is_active ? 'Active' : 'Inactive'}
        </Text>
        <Switch
          value={highlight.is_active}
          onValueChange={onToggleStatus}
          disabled={toggling}
          trackColor={{ true: colors.primary }}
        />
        <Pressable onPress={onEdit} hitSlop={8} style={{ marginLeft: 4 }}>
          <Feather name="edit-2" size={16} color={colors.primary} />
        </Pressable>
        <Pressable onPress={onDelete} hitSlop={8} style={{ marginLeft: 12 }}>
          <Feather name="trash-2" size={16} color={colors.destructive ?? '#DC2626'} />
        </Pressable>
      </View>
    </View>
  );
}

function WhyChooseUsCard() {
  const colors = useColors();
  const queryClient = useQueryClient();

  const { data: highlights, isLoading } = useListServiceHighlights();

  // 'idle' | 'adding' | <id of highlight being edited>
  const [mode, setMode] = useState<'idle' | 'adding' | number>('idle');
  const [draft, setDraft] = useState<HighlightDraft>(EMPTY_HIGHLIGHT_DRAFT);
  const [formError, setFormError] = useState<string | null>(null);

  const invalidateList = () => queryClient.invalidateQueries({ queryKey: getListServiceHighlightsQueryKey() });

  const createMutation = useCreateServiceHighlight({
    mutation: {
      onSuccess: () => {
        invalidateList();
        setMode('idle');
        setDraft(EMPTY_HIGHLIGHT_DRAFT);
      },
      onError: () => setFormError('Could not save highlight. Please try again.'),
    },
  });

  const updateMutation = useUpdateServiceHighlight({
    mutation: {
      onSuccess: () => {
        invalidateList();
        setMode('idle');
        setDraft(EMPTY_HIGHLIGHT_DRAFT);
      },
      onError: () => setFormError('Could not save highlight. Please try again.'),
    },
  });

  const statusMutation = useUpdateServiceHighlightStatus({
    mutation: { onSuccess: () => invalidateList() },
  });

  const deleteMutation = useDeleteServiceHighlight({
    mutation: { onSuccess: () => invalidateList() },
  });

  const startAdd = () => {
    setDraft(EMPTY_HIGHLIGHT_DRAFT);
    setFormError(null);
    setMode('adding');
  };

  const startEdit = (h: ServiceHighlight) => {
    setDraft({ title: h.title, description: h.description, icon: h.icon, is_active: h.is_active });
    setFormError(null);
    setMode(h.id);
  };

  const cancelForm = () => {
    setMode('idle');
    setFormError(null);
    setDraft(EMPTY_HIGHLIGHT_DRAFT);
  };

  const saveForm = () => {
    const title = draft.title.trim();
    const description = draft.description.trim();
    if (!title || !description) {
      setFormError('Title and description are required.');
      return;
    }
    setFormError(null);

    if (mode === 'adding') {
      createMutation.mutate({ data: { title, description, icon: draft.icon, is_active: draft.is_active } });
    } else if (typeof mode === 'number') {
      updateMutation.mutate({
        id: mode,
        data: { title, description, icon: draft.icon, is_active: draft.is_active },
      });
    }
  };

  const confirmDelete = (h: ServiceHighlight) => {
    const doDelete = () => deleteMutation.mutate({ id: h.id });
    if (Platform.OS === 'web') {
      if (window.confirm(`Delete Service Highlight?\n\nAre you sure you want to remove "${h.title}"?`)) doDelete();
    } else {
      Alert.alert('Delete Service Highlight?', `Are you sure you want to remove "${h.title}"?`, [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: doDelete },
      ]);
    }
  };

  const saving = createMutation.isPending || updateMutation.isPending;
  const list = highlights ?? [];

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={styles.highlightHeaderRow}>
        <View style={{ flex: 1 }}>
          <SectionLabel text="Why Choose Us?" />
          <Text style={[styles.highlightHeaderDesc, { color: colors.mutedForeground }]}>
            Show customers what makes your store special. Manage your service highlights displayed in the
            customer delivery app.
          </Text>
        </View>
        {mode === 'idle' && list.length > 0 && <TimesButton label="+ Add Highlight" onPress={startAdd} />}
      </View>

      {mode === 'adding' && (
        <HighlightForm draft={draft} setDraft={setDraft} onCancel={cancelForm} onSave={saveForm} saving={saving} error={formError} />
      )}

      {isLoading ? (
        <Text style={[styles.highlightEmptyText, { color: colors.mutedForeground }]}>Loading…</Text>
      ) : list.length === 0 && mode !== 'adding' ? (
        <View style={styles.highlightEmptyState}>
          <Text style={[styles.highlightEmptyTitle, { color: colors.foreground }]}>No service highlights added yet.</Text>
          <Text style={[styles.highlightEmptyText, { color: colors.mutedForeground }]}>
            Add service highlights to tell customers what makes your store special.
          </Text>
          <TimesButton label="+ Add Highlight" onPress={startAdd} style={{ marginTop: 12, alignSelf: 'flex-start' }} />
        </View>
      ) : (
        list.map((h) =>
          mode === h.id ? (
            <View key={h.id} style={{ marginBottom: 4 }}>
              <HighlightForm draft={draft} setDraft={setDraft} onCancel={cancelForm} onSave={saveForm} saving={saving} error={formError} />
            </View>
          ) : (
            <HighlightRow
              key={h.id}
              highlight={h}
              onEdit={() => startEdit(h)}
              onDelete={() => confirmDelete(h)}
              onToggleStatus={(next) => statusMutation.mutate({ id: h.id, data: { is_active: next } })}
              toggling={statusMutation.isPending}
            />
          )
        )
      )}
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Screen
// ─────────────────────────────────────────────────────────────────────────

export default function ProfileScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const isWide = width >= 820;

  const { user, signOut } = useAuth();
  const { business } = useBusiness();
  const isOwner = user?.role === 'owner';
  const queryClient = useQueryClient();

  // ── Logout — defined HERE, where `signOut` actually exists ────────────
  const handleLogout = () => {
    if (Platform.OS === 'web') {
      if (window.confirm('Are you sure you want to logout?')) {
        signOut();
      }
    } else {
      Alert.alert('Logout', 'Are you sure you want to logout?', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: signOut },
      ]);
    }
  };

  const updateBusiness = useUpdateBusiness({
    mutation: {
      onSuccess: () => {
        if (business?.id) {
          queryClient.invalidateQueries({ queryKey: getGetBusinessQueryKey(business.id) });
        }
      },
      onError: () => Alert.alert('Error', 'Unable to update business details.'),
    },
  });

  const saveBusinessField = (payload: BusinessUpdate) => {
    if (!business?.id) return;
    updateBusiness.mutate({ id: business.id, data: payload });
  };

  // ── Add employee ──────────────────────────────────────────────────────
  const [staffFormOpen, setStaffFormOpen] = useState(false);
  const [staffName, setStaffName] = useState('');
  const [staffPhone, setStaffPhone] = useState('');
  const [staffEmail, setStaffEmail] = useState('');
  const [staffPassword, setStaffPassword] = useState('');
  const [permissions, setPermissions] = useState<StaffPermissions>({
    add_entry: true,
    delete_entry: false,
    view_reports: false,
    manage_customers: false,
  });

  const register = useRegister();
  const addStaff = useAddStaff({
    mutation: {
      onSuccess: () => {
        setStaffFormOpen(false);
        resetStaffForm();
        queryClient.invalidateQueries({ queryKey: ['reports', 'employee-performance'], exact: false });
        Alert.alert('Employee added', `${staffName} can now log in with the phone/email you entered.`);
      },
      onError: () => Alert.alert('Could not add employee', 'The account may already exist, or something went wrong.'),
    },
  });

  const resetStaffForm = () => {
    setStaffName('');
    setStaffPhone('');
    setStaffEmail('');
    setStaffPassword('');
    setPermissions({ add_entry: true, delete_entry: false, view_reports: false, manage_customers: false });
  };

  const togglePermission = (key: keyof StaffPermissions) => {
    setPermissions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const submitStaff = () => {
    if (!business?.id) return;
    if (!staffName || !staffPhone || !staffEmail || !staffPassword) {
      Alert.alert('Missing info', 'Please fill in name, phone, email, and a password for the employee.');
      return;
    }
    register.mutate(
      { data: { name: staffName, phone: staffPhone, email: staffEmail, password: staffPassword } },
      {
        onSuccess: (auth: any) => {
          addStaff.mutate({ id: business.id, data: { user_id: auth.user.id, permissions } });
        },
        onError: () => Alert.alert('Could not create login', 'That phone or email may already be registered.'),
      }
    );
  };

  // ── Column building blocks ──────────────────────────────────────────

  const identityCard = (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={styles.identityRow}>
        <Avatar name={user?.name ?? '?'} size={56} />
        <View style={{ flex: 1, marginLeft: 14 }}>
          <Text style={[styles.ownerName, { color: colors.foreground }]}>{user?.name}</Text>
          <Text style={[styles.ownerMeta, { color: colors.mutedForeground }]}>
            {(user?.role ?? 'OWNER').toUpperCase()} · {user?.phone}
          </Text>
        </View>

        <View style={styles.headerActions}>
          <View style={[styles.planTag, { backgroundColor: colors.primary }]}>
            <Text style={styles.planTagText}>{(business?.plan ?? 'FREE').toUpperCase()}</Text>
          </View>
          {/* fixed: now calls handleLogout, not the old broken inline Alert */}
          <TimesButton
            label="Logout"
            variant="destructive"
            onPress={handleLogout}
            style={styles.logoutButton}
          />
        </View>
      </View>

      <View style={[styles.divider, { backgroundColor: colors.border }]} />

      <Text style={[styles.businessName, { color: colors.foreground }]}>
        {business?.business_name ?? '-'}
      </Text>
      <Text style={[styles.businessType, { color: colors.mutedForeground }]}>
        {business?.business_type ?? '-'}
      </Text>
    </View>
  );

  const businessInfoCard = (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <SectionLabel text="Business Information" />
      <EditableRow
        icon="briefcase"
        label="Business Name"
        value={business?.business_name ?? ''}
        onSave={(val) => saveBusinessField({ business_name: val })}
        saving={updateBusiness.isPending}
      />
      <EditableRow
        icon="tag"
        label="Business Type"
        value={business?.business_type ?? ''}
        onSave={(val) => saveBusinessField({ business_type: val })}
        saving={updateBusiness.isPending}
      />
      <EditableRow
        icon="hash"
        label="GST Number"
        value={business?.gstin ?? ''}
        placeholder="22AAAAA0000A1Z5"
        onSave={(val) => saveBusinessField({ gstin: val })}
        saving={updateBusiness.isPending}
      />
      <EditableRow
        icon="map-pin"
        label="Address"
        value={business?.address_line1 ?? ''}
        onSave={(val) => saveBusinessField({ address_line1: val })}
        saving={updateBusiness.isPending}
      />
      <InfoRow icon="dollar-sign" label="Currency" value={business?.currency ?? 'INR'} />
      <InfoRow icon="star" label="Plan" value={(business?.plan ?? 'free').toUpperCase()} dense />
    </View>
  );

  const accountInfoCard = (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <SectionLabel text="Account Information" />
      <InfoRow icon="user" label="Owner" value={user?.name ?? '-'} />
      <InfoRow icon="phone" label="Phone" value={user?.phone ?? '-'} />
      <InfoRow icon="mail" label="Email" value={user?.email ?? '-'} />
      <InfoRow icon="shield" label="Role" value={(user?.role ?? 'OWNER').toUpperCase()} />
      <InfoRow icon="globe" label="Language" value={languageFullName(user?.language_pref)} dense />
    </View>
  );

  // "Why Choose Us?" — owner-only, matches Team's isOwner gating
  const whyChooseUsCard = isOwner ? <WhyChooseUsCard /> : null;

  const teamCard = (
    
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <SectionLabel text="Team" />
      {!staffFormOpen ? (
        <View style={{ paddingTop: 4 }}>
          <Text style={[styles.teamHint, { color: colors.mutedForeground }]}>
            Add a login for a staff member so they can use this app. Viewing the list of existing staff
            isn't supported by the backend yet — only adding new ones is.
          </Text>
          <TimesButton label="+ Add Employee" onPress={() => setStaffFormOpen(true)} style={{ marginTop: 14 }} />
        </View>
      ) : (
        <View style={{ paddingTop: 4 }}>
          <Text style={[styles.inputLabel, { color: colors.mutedForeground }]}>Name</Text>
          <TextInput
            value={staffName}
            onChangeText={setStaffName}
            placeholder="Employee name"
            placeholderTextColor={colors.mutedForeground}
            style={[styles.input, { color: colors.foreground, borderColor: colors.border, backgroundColor: colors.background }]}
          />

          <Text style={[styles.inputLabel, { color: colors.mutedForeground, marginTop: 12 }]}>Phone</Text>
          <TextInput
            value={staffPhone}
            onChangeText={setStaffPhone}
            placeholder="10-digit phone number"
            placeholderTextColor={colors.mutedForeground}
            keyboardType="phone-pad"
            style={[styles.input, { color: colors.foreground, borderColor: colors.border, backgroundColor: colors.background }]}
          />

          <Text style={[styles.inputLabel, { color: colors.mutedForeground, marginTop: 12 }]}>Email</Text>
          <TextInput
            value={staffEmail}
            onChangeText={setStaffEmail}
            placeholder="employee@email.com"
            placeholderTextColor={colors.mutedForeground}
            keyboardType="email-address"
            autoCapitalize="none"
            style={[styles.input, { color: colors.foreground, borderColor: colors.border, backgroundColor: colors.background }]}
          />

          <Text style={[styles.inputLabel, { color: colors.mutedForeground, marginTop: 12 }]}>Temporary Password</Text>
          <TextInput
            value={staffPassword}
            onChangeText={setStaffPassword}
            placeholder="They can change this later"
            placeholderTextColor={colors.mutedForeground}
            secureTextEntry
            style={[styles.input, { color: colors.foreground, borderColor: colors.border, backgroundColor: colors.background }]}
          />

          <Text style={[styles.inputLabel, { color: colors.mutedForeground, marginTop: 16 }]}>Permissions</Text>
          {(
            [
              ['add_entry', 'Add Entries'],
              ['delete_entry', 'Delete Entries'],
              ['view_reports', 'View Reports'],
              ['manage_customers', 'Manage Customers'],
            ] as [keyof StaffPermissions, string][]
          ).map(([key, label]) => (
            <Pressable
              key={key}
              onPress={() => togglePermission(key)}
              style={[styles.permissionRow, { borderBottomColor: colors.border }]}
            >
              <Text style={[styles.permissionLabel, { color: colors.foreground }]}>{label}</Text>
              <Feather
                name={permissions[key] ? 'check-square' : 'square'}
                size={18}
                color={permissions[key] ? colors.primary : colors.mutedForeground}
              />
            </Pressable>
          ))}

          <View style={styles.actionRow}>
            <Pressable
              style={styles.cancelButton}
              onPress={() => {
                setStaffFormOpen(false);
                resetStaffForm();
              }}
            >
              <Text style={[styles.cancelText, { color: colors.mutedForeground }]}>Cancel</Text>
            </Pressable>
            <TimesButton
              label={register.isPending || addStaff.isPending ? 'Adding…' : 'Add Employee'}
              onPress={submitStaff}
              disabled={register.isPending || addStaff.isPending}
              style={{ flex: 1 }}
            />
          </View>
        </View>
      )}
    </View>
  );

  const supportCard = (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <SectionLabel text="Help & Support" />
      <InfoRow icon="phone-call" label="Contact Support" value={user?.phone ?? '—'} />
      <InfoRow icon="mail" label="Support Email" value={user?.email ?? '—'} dense />
    </View>
  );

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{
        paddingTop: insets.top + 8,
        paddingBottom: insets.bottom + 16,
        paddingHorizontal: isWide ? 20 : 16,
        maxWidth: 1280,
        alignSelf: 'center',
        width: '100%',
      }}
    >
      <Text style={[styles.pageTitle, { color: colors.foreground }]}>Profile & Settings</Text>

      {identityCard}

      {isWide ? (
        <View style={styles.twoColRow}>
          <View style={styles.col}>
            {businessInfoCard}
            {whyChooseUsCard}
          </View>
          <View style={styles.col}>
            {accountInfoCard}
            {isOwner && teamCard}
            {supportCard}
          </View>
        </View>
      ) : (
        <>
          {businessInfoCard}
          {accountInfoCard}
          {whyChooseUsCard}
          {isOwner && teamCard}
          {supportCard}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  pageTitle: { fontFamily: FONT, fontSize: 22, fontWeight: '700', marginBottom: 12, letterSpacing: 0.3 },

  twoColRow: { flexDirection: 'row', gap: 16 },
  col: { flex: 1 },

  card: { borderRadius: 4, borderWidth: 1, padding: 16, marginBottom: 14 },
  identityRow: { flexDirection: 'row', alignItems: 'center' },
  ownerName: { fontFamily: FONT, fontSize: 18, fontWeight: '700' },
  ownerMeta: { fontFamily: FONT, fontSize: 13, marginTop: 3 },

  headerActions: { alignItems: 'flex-end', gap: 8 },
  planTag: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 3 },
  planTagText: { fontFamily: FONT, color: '#fff', fontSize: 11, fontWeight: '700', letterSpacing: 0.5 },
  logoutButton: { width: 100, paddingVertical: 6, borderRadius: 4 },

  divider: { height: 1, marginVertical: 12 },
  businessName: { fontFamily: FONT, fontSize: 20, fontWeight: '700' },
  businessType: { fontFamily: FONT, fontSize: 13, marginTop: 2 },

  sectionLabelRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  sectionLabelBar: { width: 3, height: 14, borderRadius: 2, marginRight: 8 },
  sectionLabel: { fontFamily: FONT, fontSize: 13, fontWeight: '700', letterSpacing: 0.8 },

  infoRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: StyleSheet.hairlineWidth },
  infoLabel: { fontFamily: FONT, fontSize: 13, width: 110 },
  infoValue: { fontFamily: FONT, fontSize: 14, fontWeight: '600', flex: 1 },

  inlineEditContainer: { paddingVertical: 12, borderBottomWidth: StyleSheet.hairlineWidth },
  inputLabel: { fontFamily: FONT, fontSize: 12, marginBottom: 6, fontWeight: '600' },
  input: { fontFamily: FONT, borderWidth: 1, borderRadius: 4, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14 },
  actionRow: { flexDirection: 'row', marginTop: 16, alignItems: 'center' },
  cancelButton: { paddingHorizontal: 14, paddingVertical: 12, marginRight: 12 },
  cancelText: { fontFamily: FONT, fontWeight: '600' },

  teamHint: { fontFamily: FONT, fontSize: 13, lineHeight: 19 },
  permissionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, borderBottomWidth: StyleSheet.hairlineWidth },
  permissionLabel: { fontFamily: FONT, fontSize: 14 },

  // ── Why Choose Us ──────────────────────────────────────────────────────
  highlightHeaderRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12 },
  highlightHeaderDesc: { fontFamily: FONT, fontSize: 12, lineHeight: 17, marginTop: 2 },

  highlightRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: StyleSheet.hairlineWidth },
  highlightIconBadge: { width: 36, height: 36, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  highlightTitle: { fontFamily: FONT, fontSize: 14, fontWeight: '700' },
  highlightDesc: { fontFamily: FONT, fontSize: 12, marginTop: 2 },
  highlightRowActions: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  highlightStatusTag: { fontFamily: FONT, fontSize: 11, fontWeight: '700', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10, marginRight: 4 },

  highlightFormContainer: { borderWidth: 1, borderRadius: 6, padding: 14, marginBottom: 12 },
  highlightIconRow: { flexDirection: 'row', gap: 10, marginTop: 6 },
  highlightIconOption: { width: 38, height: 38, borderRadius: 6, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  highlightStatusRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 14 },
  highlightErrorText: { fontFamily: FONT, fontSize: 12, marginTop: 8 },

  highlightEmptyState: { paddingVertical: 16 },
  highlightEmptyTitle: { fontFamily: FONT, fontSize: 14, fontWeight: '700' },
  highlightEmptyText: { fontFamily: FONT, fontSize: 12, marginTop: 4, lineHeight: 17 },
});