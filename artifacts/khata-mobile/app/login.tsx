import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
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
        onSuccess: () => {
          setStep('otp');
        },
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
    <KeyboardAwareScrollViewCompat
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + 60, paddingBottom: insets.bottom + 24 }]}
      bottomOffset={40}
    >
      <View style={[styles.logoWrap, { backgroundColor: colors.primary, borderRadius: colors.radius + 6 }]}>
        <Feather name="book-open" size={30} color={colors.primaryForeground} />
      </View>
      <Text style={[styles.title, { color: colors.foreground }]}>KhataPro</Text>
      <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
        Your digital ledger, always in your pocket
      </Text>

      <View style={styles.form}>
        {step === 'phone' ? (
          <>
            <FormField
              label="Mobile number"
              placeholder="98765 43210"
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
              maxLength={13}
              autoFocus
              testID="phone-input"
            />
            {error ? <Text style={[styles.errorText, { color: colors.destructive }]}>{error}</Text> : null}
            <PrimaryButton
              label="Send OTP"
              onPress={handleSendOtp}
              loading={sendOtp.isPending}
              style={{ marginTop: 8 }}
            />
          </>
        ) : (
          <>
            <Text style={[styles.otpHint, { color: colors.mutedForeground }]}>
              Enter the OTP sent to {normalizedPhone()}
            </Text>
            <FormField
              label="OTP"
              placeholder="123456"
              keyboardType="number-pad"
              value={otp}
              onChangeText={setOtp}
              maxLength={6}
              autoFocus
              testID="otp-input"
            />
            {error ? <Text style={[styles.errorText, { color: colors.destructive }]}>{error}</Text> : null}
            <PrimaryButton
              label="Verify & Continue"
              onPress={handleVerifyOtp}
              loading={verifyOtp.isPending}
              style={{ marginTop: 8 }}
            />
            <PrimaryButton
              label="Change number"
              onPress={() => {
                setStep('phone');
                setOtp('');
                setError(null);
              }}
              variant="secondary"
              style={{ marginTop: 10 }}
            />
          </>
        )}
      </View>
    </KeyboardAwareScrollViewCompat>
  );
}

const styles = StyleSheet.create({
  content: { flexGrow: 1, paddingHorizontal: 28, alignItems: 'center' },
  logoWrap: { width: 68, height: 68, alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  title: { fontSize: 28, fontFamily: 'Inter_700Bold', fontWeight: '700' },
  subtitle: { fontSize: 14, fontFamily: 'Inter_400Regular', marginTop: 6, marginBottom: 36, textAlign: 'center' },
  form: { width: '100%', gap: 14 },
  otpHint: { fontSize: 13, fontFamily: 'Inter_400Regular', marginBottom: 2 },
  errorText: { fontSize: 13, fontFamily: 'Inter_400Regular' },
});
