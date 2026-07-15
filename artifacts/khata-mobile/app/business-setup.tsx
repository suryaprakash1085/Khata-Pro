import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { KeyboardAwareScrollViewCompat } from '@/components/KeyboardAwareScrollViewCompat';
import { Feather } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import { useCreateBusiness, type Business } from '@workspace/api-client-react';
import { useBusiness } from '@/contexts/BusinessContext';
import { useAuth } from '@/contexts/AuthContext';
import { PrimaryButton } from '@/components/PrimaryButton';
import { FormField } from '@/components/FormField';

const BUSINESS_TYPES = ['Retail', 'Wholesale', 'Manufacturing', 'Services', 'Distribution', 'Other'];

export default function BusinessSetupScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { signOut } = useAuth();
  const { setBusiness } = useBusiness();
  const [name, setName] = useState('');
  const [type, setType] = useState(BUSINESS_TYPES[0]);
  const [gstin, setGstin] = useState('');
  const [error, setError] = useState<string | null>(null);

  const createBusiness = useCreateBusiness();

  const handleCreate = () => {
    setError(null);
    if (name.trim().length < 2) {
      setError('Enter your business name');
      return;
    }
    createBusiness.mutate(
      { data: { business_name: name.trim(), business_type: type, gstin: gstin.trim() || undefined } },
      {
        onSuccess: (biz: Business) => {
          setBusiness(biz);
        },
        onError: () => setError('Could not create business. Please try again.'),
      },
    );
  };

  return (
    <KeyboardAwareScrollViewCompat
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + 40, paddingBottom: insets.bottom + 24 }]}
      bottomOffset={40}
    >
      <View style={[styles.iconWrap, { backgroundColor: colors.primary, borderRadius: colors.radius + 6 }]}>
        <Feather name="briefcase" size={26} color={colors.primaryForeground} />
      </View>
      <Text style={[styles.title, { color: colors.foreground }]}>Set up your business</Text>
      <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
        This is what your customers will see on their bills and reminders
      </Text>

      <View style={styles.form}>
        <FormField label="Business name" placeholder="Sharma General Store" value={name} onChangeText={setName} autoFocus />

        <View style={styles.typeWrap}>
          <Text style={[styles.typeLabel, { color: colors.mutedForeground }]}>Business type</Text>
          <View style={styles.chipsRow}>
            {BUSINESS_TYPES.map((t) => {
              const active = t === type;
              return (
                <Text
                  key={t}
                  onPress={() => setType(t)}
                  style={[
                    styles.chip,
                    {
                      borderRadius: colors.radius,
                      backgroundColor: active ? colors.primary : colors.card,
                      borderColor: active ? colors.primary : colors.border,
                      color: active ? colors.primaryForeground : colors.foreground,
                    },
                  ]}
                >
                  {t}
                </Text>
              );
            })}
          </View>
        </View>

        <FormField
          label="GSTIN (optional)"
          placeholder="22AAAAA0000A1Z5"
          value={gstin}
          onChangeText={(v) => setGstin(v.toUpperCase())}
          autoCapitalize="characters"
        />

        {error ? <Text style={[styles.errorText, { color: colors.destructive }]}>{error}</Text> : null}

        <PrimaryButton label="Create business" onPress={handleCreate} loading={createBusiness.isPending} style={{ marginTop: 8 }} />
        <PrimaryButton label="Log out" onPress={signOut} variant="secondary" style={{ marginTop: 4 }} />
      </View>
    </KeyboardAwareScrollViewCompat>
  );
}

const styles = StyleSheet.create({
  content: { flexGrow: 1, paddingHorizontal: 24, alignItems: 'center' },
  iconWrap: { width: 60, height: 60, alignItems: 'center', justifyContent: 'center', marginBottom: 18 },
  title: { fontSize: 22, fontFamily: 'Inter_700Bold', fontWeight: '700', textAlign: 'center' },
  subtitle: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    marginTop: 8,
    marginBottom: 28,
    textAlign: 'center',
    paddingHorizontal: 12,
  },
  form: { width: '100%', gap: 14 },
  typeWrap: { gap: 8 },
  typeLabel: { fontSize: 13, fontFamily: 'Inter_500Medium', fontWeight: '500' },
  chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderWidth: 1,
    fontSize: 13,
    fontFamily: 'Inter_500Medium',
    overflow: 'hidden',
  },
  errorText: { fontSize: 13, fontFamily: 'Inter_400Regular' },
});
