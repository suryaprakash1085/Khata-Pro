import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { KeyboardAwareScrollViewCompat } from '@/components/KeyboardAwareScrollViewCompat';
import { Feather } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import { useAuth } from '@/contexts/AuthContext';
import {
  useSendOtp,
  useVerifyOtp,
  type AuthResponse,
} from "@workspace/api-client-react";
import { PrimaryButton } from '@/components/PrimaryButton';
import { FormField } from '@/components/FormField';

export default function LoginScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { signIn } = useAuth();
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState<string | null>(null);

  const sendOtp = useSendOtp();
  const verifyOtp = useVerifyOtp();

  // Explicit pixel width/height from the actual viewport — sidesteps every
  // RN-Web percentage/flex height-chain issue, since the image box is now a
  // fixed size regardless of what any ancestor container's height resolves to.
  const { width: winWidth, height: winHeight } = useWindowDimensions();

  const normalizedPhone = () => {
    const digits = phone.replace(/[^\d]/g, '');
    if (phone.trim().startsWith('+')) return phone.trim();
    return `+91${digits}`;
  };

  const handleSendOtp = () => {
    setError(null);
    const digits = phone.replace(/[^\d]/g, '');
    if (digits.length < 10) {
      setError('Enter a valid 10-digit phone number');
      return;
    }
    sendOtp.mutate(
      { data: { phone: normalizedPhone() } },
      {
        onSuccess: () => setStep('otp'),
        onError: () => setError('Could not send OTP. Try again.'),
      },
    );
  };

  const handleVerifyOtp = () => {
    setError(null);
    if (otp.length < 4) {
      setError('Enter the OTP you received');
      return;
    }
    verifyOtp.mutate(
      { data: { phone: normalizedPhone(), otp } },
      {
        onSuccess: async (res: AuthResponse) => {
          await signIn(res.token, res.user);
        },
        onError: () => setError('Invalid OTP. Please try again.'),
      },
    );
  };

  return (
    <View style={styles.root}>
      {/* Fixed-pixel-size image + overlay — always exactly viewport size,
          independent of any ancestor's resolved height */}
      <Image
        // 👉 make sure this file exists at khata-mobile/assets/images/login-bg.jpg
        source={require('@/assets/images/login-bg.jpg')}
        style={[styles.bgImage, { width: winWidth, height: winHeight }]}
        resizeMode="cover"
        blurRadius={2}
      />
      <View
        style={[styles.overlay, { width: winWidth, height: winHeight }]}
        pointerEvents="none"
      />

      <KeyboardAwareScrollViewCompat
        style={{ flex: 1 }}
        contentContainerStyle={[
          styles.centerWrap,
          { paddingTop: insets.top + 24, paddingBottom: insets.bottom + 24 },
        ]}
        bottomOffset={40}
      >
        <View style={[styles.card, { backgroundColor: colors.background }]}>
          {/* Logo + brand */}
          <View style={[styles.logoWrap, { backgroundColor: colors.primary }]}>
            <Feather name="book-open" size={28} color={colors.primaryForeground} />
          </View>
          <Text style={styles.brandTitle}>
            <Text style={{ color: colors.foreground }}>Khata-Pro </Text>
            <Text style={{ color: colors.primary }}>POS</Text>
          </Text>
          <Text style={[styles.tagline, { color: colors.mutedForeground }]}>
            Smart POS for Your Business
          </Text>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <Text style={[styles.welcome, { color: colors.foreground }]}>
            {step === 'phone' ? 'Welcome Back!' : 'Verify OTP'}
          </Text>
          <Text style={[styles.welcomeSub, { color: colors.mutedForeground }]}>
            {step === 'phone'
              ? 'Login to continue to your dashboard'
              : `Code sent to ${normalizedPhone()}`}
          </Text>

          {step === 'phone' ? (
            <>
              <View style={[styles.inputRow, { borderColor: colors.border, backgroundColor: colors.muted }]}>
                <Feather name="smartphone" size={18} color={colors.mutedForeground} />
                <Text style={[styles.prefixChip, { color: colors.foreground }]}>+91</Text>
                <FormField
                  label=""
                  placeholder="Mobile number"
                  keyboardType="phone-pad"
                  value={phone}
                  onChangeText={setPhone}
                  maxLength={13}
                  autoFocus
                  testID="phone-input"
                  style={{ flex: 1, borderWidth: 0, backgroundColor: 'transparent', paddingVertical: 0 }}
                />
              </View>

              {error ? (
                <View style={styles.errorRow}>
                  <Feather name="alert-circle" size={14} color={colors.destructive} />
                  <Text style={[styles.errorText, { color: colors.destructive }]}>{error}</Text>
                </View>
              ) : null}

              <PrimaryButton
                label="Send OTP"
                onPress={handleSendOtp}
                loading={sendOtp.isPending}
                style={styles.ctaButton}
              />
            </>
          ) : (
            <>
              <View style={[styles.inputRow, { borderColor: colors.border, backgroundColor: colors.muted }]}>
                <Feather name="lock" size={18} color={colors.mutedForeground} />
                <FormField
                  label=""
                  placeholder="• • • • • •"
                  keyboardType="number-pad"
                  value={otp}
                  onChangeText={setOtp}
                  maxLength={6}
                  autoFocus
                  testID="otp-input"
                  style={{ flex: 1, borderWidth: 0, backgroundColor: 'transparent', paddingVertical: 0, letterSpacing: 6, fontSize: 18 }}
                />
              </View>

              {error ? (
                <View style={styles.errorRow}>
                  <Feather name="alert-circle" size={14} color={colors.destructive} />
                  <Text style={[styles.errorText, { color: colors.destructive }]}>{error}</Text>
                </View>
              ) : null}

              <PrimaryButton
                label="Verify & Continue"
                onPress={handleVerifyOtp}
                loading={verifyOtp.isPending}
                style={styles.ctaButton}
              />

              <Text
                onPress={() => {
                  setStep('phone');
                  setOtp('');
                  setError(null);
                }}
                style={[styles.changeNumberLink, { color: colors.primary }]}
              >
                Change mobile number
              </Text>
            </>
          )}

          {/* Feature strip */}
          <View style={[styles.featureDivider, { backgroundColor: colors.border }]} />
          <View style={styles.featureRow}>
            {[
              { icon: 'bar-chart-2', label: 'Easy Billing', bg: '#DBEAFE' },
              { icon: 'box', label: 'Inventory', bg: '#DCFCE7' },
              { icon: 'file-text', label: 'Reports', bg: '#EDE9FE' },
              { icon: 'users', label: 'Multi User', bg: '#FFEDD5' },
            ].map((f) => (
              <View key={f.label} style={styles.featureItem}>
                <View style={[styles.featureIcon, { backgroundColor: f.bg }]}>
                  <Feather name={f.icon as any} size={18} color={colors.primary} />
                </View>
                <Text style={[styles.featureLabel, { color: colors.foreground }]}>{f.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Footer badge */}
        <View style={styles.footerRow}>
          <Feather name="shield" size={14} color={colors.primary} />
          <Text style={styles.footerText}>
            Secure & Reliable — your business data is always safe
          </Text>
        </View>
      </KeyboardAwareScrollViewCompat>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    // @ts-ignore - web-only, ensures full viewport height instead of collapsing to content height
    minHeight: '100%',
    backgroundColor: 'transparent',
  },
  bgImage: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: 'rgba(255,255,255,0.35)',
  },
  centerWrap: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  card: {
    width: '100%',
    maxWidth: 380,
    borderRadius: 24,
    paddingHorizontal: 24,
    paddingVertical: 28,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 10,
  },
  logoWrap: {
    width: 60,
    height: 60,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  brandTitle: { fontSize: 22, fontFamily: 'Inter_700Bold', fontWeight: '700' },
  tagline: { fontSize: 13, fontFamily: 'Inter_400Regular', marginTop: 4, marginBottom: 16 },
  divider: { width: '100%', height: 1, marginBottom: 20 },
  welcome: { fontSize: 20, fontFamily: 'Inter_700Bold', fontWeight: '700', marginBottom: 4, textAlign: 'center' },
  welcomeSub: { fontSize: 13, fontFamily: 'Inter_400Regular', marginBottom: 20, textAlign: 'center' },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    width: '100%',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 52,
    marginBottom: 6,
  },
  prefixChip: { fontSize: 15, fontFamily: 'Inter_700Bold' },
  errorRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 6, alignSelf: 'flex-start' },
  errorText: { fontSize: 13, fontFamily: 'Inter_400Regular' },
  ctaButton: { marginTop: 18, borderRadius: 12, height: 52, width: '100%' },
  changeNumberLink: {
    textAlign: 'center',
    marginTop: 16,
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
  },
  featureDivider: { width: '100%', height: 1, marginTop: 24, marginBottom: 18 },
  featureRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%' },
  featureItem: { alignItems: 'center', flex: 1, gap: 6 },
  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureLabel: { fontSize: 10, fontFamily: 'Inter_600SemiBold', textAlign: 'center' },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 20,
  },
  // Fixed white color so it stays readable over both light and dark backgrounds;
  // this sits over the background image, not the card, so it shouldn't follow the card theme.
  footerText: { fontSize: 12, fontFamily: 'Inter_500Medium', color: '#FFFFFF' },
});