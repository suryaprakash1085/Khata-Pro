import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';
import { useAuth } from '@/contexts/AuthContext';
import { useBusiness } from '@/contexts/BusinessContext';
import { Avatar } from '@/components/Avatar';
import { PrimaryButton } from '@/components/PrimaryButton';

function InfoRow({ icon, label, value }: { icon: keyof typeof Feather.glyphMap; label: string; value: string }) {
  const colors = useColors();
  return (
    <View style={styles.infoRow}>
      <View style={[styles.infoIcon, { backgroundColor: colors.muted, borderRadius: colors.radius }]}>
        <Feather name={icon} size={16} color={colors.mutedForeground} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[styles.infoLabel, { color: colors.mutedForeground }]}>{label}</Text>
        <Text style={[styles.infoValue, { color: colors.foreground }]}>{value}</Text>
      </View>
    </View>
  );
}

export default function ProfileScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { user, signOut } = useAuth();
  const { business } = useBusiness();

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ paddingTop: insets.top + 20, paddingBottom: insets.bottom + 100, paddingHorizontal: 20 }}
    >
      <View style={styles.header}>
        <Avatar name={user?.name ?? '?'} size={64} />
        <View style={{ marginLeft: 14, flex: 1 }}>
          <Text style={[styles.name, { color: colors.foreground }]}>{user?.name}</Text>
          <Text style={[styles.phone, { color: colors.mutedForeground }]}>{user?.phone}</Text>
        </View>
      </View>

      <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Business</Text>
      <View style={[styles.card, { backgroundColor: colors.card, borderRadius: colors.radius }]}>
        <InfoRow icon="briefcase" label="Business name" value={business?.business_name ?? '-'} />
        <InfoRow icon="tag" label="Type" value={business?.business_type ?? '-'} />
        <InfoRow icon="hash" label="GSTIN" value={business?.gstin ?? 'Not added'} />
        <InfoRow icon="star" label="Plan" value={(business?.plan ?? 'free').toUpperCase()} />
      </View>

      <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Account</Text>
      <View style={[styles.card, { backgroundColor: colors.card, borderRadius: colors.radius }]}>
        <InfoRow icon="user" label="Role" value={(user?.role ?? 'owner').toUpperCase()} />
        {user?.email ? <InfoRow icon="mail" label="Email" value={user.email} /> : null}
      </View>

      <PrimaryButton label="Log out" onPress={signOut} variant="destructive" style={{ marginTop: 8 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 28 },
  name: { fontSize: 20, fontFamily: 'Inter_700Bold', fontWeight: '700' },
  phone: { fontSize: 13, fontFamily: 'Inter_400Regular', marginTop: 2 },
  sectionTitle: { fontSize: 14, fontFamily: 'Inter_600SemiBold', fontWeight: '600', marginBottom: 10, marginTop: 4 },
  card: { paddingHorizontal: 14, paddingVertical: 4, marginBottom: 22 },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12 },
  infoIcon: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
  infoLabel: { fontSize: 11, fontFamily: 'Inter_400Regular' },
  infoValue: { fontSize: 14, fontFamily: 'Inter_600SemiBold', fontWeight: '600', marginTop: 1 },
});
