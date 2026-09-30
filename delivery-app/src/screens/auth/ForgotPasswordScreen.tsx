import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  Alert,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

/* ── Design tokens (UI only) — same as Login / Signup ────────────────── */
const COLORS = {
  primary: '#4B3F9E',
  primaryDark: '#2B2266',
  primarySoft: '#EFEDFA',
  background: '#F8F7FC',
  card: '#FFFFFF',
  text: '#1A1745',
  textMuted: '#6E6A8E',
  placeholder: '#9A97B3',
  border: '#E4E1F2',
  white: '#FFFFFF',
};

const FONT_FAMILY = Platform.select({
  ios: 'Times New Roman',
  android: 'serif',
  default: '"Times New Roman", Times, serif',
}) as string;

export default function ForgotPasswordScreen({ navigation }: any) {
  const [email, setEmail] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [focused, setFocused] = useState<boolean>(false); // UI-only

  const handleResetPassword = (): void => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      Alert.alert(
        'Success',
        'Password reset link sent to your email',
        [
          { text: 'OK', onPress: () => navigation.navigate('Login') }
        ]
      );
    }, 1500);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View pointerEvents="none" style={styles.waveWrap}>
          <View style={styles.waveBack} />
          <View style={styles.waveFront} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Top bar: back + branding */}
          <View style={styles.topBar}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
              activeOpacity={0.8}
            >
              <Icon name="arrow-back" size={20} color={COLORS.primary} />
            </TouchableOpacity>

            <View style={styles.brandRow}>
              <View style={styles.brandIcon}>
                <Icon name="bicycle" size={18} color={COLORS.white} />
              </View>
              <View>
                <Text style={styles.brandName}>Khata-Pro</Text>
                <Text style={styles.brandTag}>Delivery Partner</Text>
              </View>
            </View>
          </View>

          {/* Heading */}
          <View style={styles.header}>
            <View style={styles.badge}>
              <Icon name="key-outline" size={26} color={COLORS.primary} />
            </View>
            <Text style={styles.title}>Forgot Password</Text>
            <Text style={styles.subtitle}>
              Enter your email address and we'll send you a link to reset your password
            </Text>
          </View>

          {/* Email field */}
          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Email Address</Text>
            <View style={[styles.inputContainer, focused && styles.inputFocused]}>
              <Icon
                name="mail-outline"
                size={20}
                color={focused ? COLORS.primary : COLORS.textMuted}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Enter your email address"
                placeholderTextColor={COLORS.placeholder}
                value={email}
                onChangeText={setEmail}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>

          <TouchableOpacity
            style={[styles.resetButton, loading && styles.buttonDisabled]}
            onPress={handleResetPassword}
            disabled={loading}
            activeOpacity={0.85}
          >
            <Text style={styles.resetButtonText}>
              {loading ? 'Sending...' : 'Send Reset Link'}
            </Text>
          </TouchableOpacity>

          {/* Back to login */}
          <View style={styles.divider} />
          <TouchableOpacity
            style={styles.linkRow}
            onPress={() => navigation.navigate('Login')}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Icon name="arrow-back" size={16} color={COLORS.primary} />
            <Text style={styles.loginLinkText}> Back to Login</Text>
          </TouchableOpacity>

          <Text style={styles.tagline}>Delivering Happiness ♥</Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0,
  },
  container: { flex: 1, width: '100%', backgroundColor: COLORS.background },
  scrollContent: {
    flexGrow: 1,
    width: '100%',
    maxWidth: 520,
    alignSelf: 'center',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 32,
  },

  waveWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 140,
    overflow: 'hidden',
  },
  waveBack: {
    position: 'absolute',
    left: -80,
    right: -80,
    bottom: -150,
    height: 220,
    borderRadius: 200,
    backgroundColor: COLORS.primarySoft,
    opacity: 0.6,
  },
  waveFront: {
    position: 'absolute',
    left: -40,
    right: -120,
    bottom: -170,
    height: 200,
    borderRadius: 200,
    backgroundColor: COLORS.primarySoft,
  },

  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandRow: { flexDirection: 'row', alignItems: 'center' },
  brandIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  brandName: {
    fontFamily: FONT_FAMILY,
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.primaryDark,
    letterSpacing: 0.3,
  },
  brandTag: { fontFamily: FONT_FAMILY, fontSize: 12, color: COLORS.textMuted },

  header: { marginTop: 28, marginBottom: 26 },
  badge: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: COLORS.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontFamily: FONT_FAMILY,
    fontSize: 32,
    fontWeight: '700',
    color: COLORS.text,
    lineHeight: 38,
  },
  subtitle: {
    fontFamily: FONT_FAMILY,
    fontSize: 16,
    color: COLORS.textMuted,
    marginTop: 8,
    lineHeight: 23,
  },

  inputWrapper: { marginBottom: 22 },
  label: {
    fontFamily: FONT_FAMILY,
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: 12,
    paddingHorizontal: 14,
    minHeight: 54,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  inputFocused: { borderColor: COLORS.primary, borderWidth: 1.5 },
  inputIcon: { marginRight: 10 },
  input: {
    flex: 1,
    minHeight: 52,
    fontFamily: FONT_FAMILY,
    fontSize: 16,
    color: COLORS.text,
    paddingVertical: 0,
  },

  resetButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    minHeight: 54,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 2,
  },
  buttonDisabled: { backgroundColor: '#A9A2D6', shadowOpacity: 0 },
  resetButtonText: {
    fontFamily: FONT_FAMILY,
    color: COLORS.white,
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.4,
  },

  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: COLORS.border,
    marginTop: 26,
    marginBottom: 18,
  },
  linkRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  loginLinkText: {
    fontFamily: FONT_FAMILY,
    color: COLORS.primary,
    fontSize: 15,
    fontWeight: '700',
  },
  tagline: {
    fontFamily: FONT_FAMILY,
    textAlign: 'center',
    fontSize: 13,
    color: COLORS.textMuted,
    marginTop: 28,
  },
});