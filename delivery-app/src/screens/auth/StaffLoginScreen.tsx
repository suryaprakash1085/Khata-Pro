import React, { useState, useContext } from 'react';
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
import { DriverAuthContext } from '../../context/DriverAuthContext';

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

const StaffLoginScreen: React.FC = ({ navigation }: any) => {
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(false); // UI-only
  const { requestOtp } = useContext(DriverAuthContext);

  const handleSendOtp = async () => {
    if (!phone || phone.trim().length < 10) {
      Alert.alert('Error', 'Please enter a valid 10-digit phone number');
      return;
    }

    setLoading(true);
    try {
      const success = await requestOtp(phone.trim());
      if (success) {
        navigation.navigate('StaffOtp', { phone: phone.trim() });
      } else {
        Alert.alert('Error', 'No driver found with this phone number. Contact your admin.');
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
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
          {/* Branding */}
          <View style={styles.brandRow}>
            <View style={styles.brandIcon}>
              <Icon name="bicycle" size={22} color={COLORS.white} />
            </View>
            <View>
              <Text style={styles.brandName}>Khata-Pro</Text>
              <Text style={styles.brandTag}>Delivery Partner</Text>
            </View>
          </View>

          {/* Heading */}
          <View style={styles.heading}>
            <View style={styles.badge}>
              <Icon name="briefcase-outline" size={26} color={COLORS.primary} />
            </View>
            <Text style={styles.title}>Staff Login</Text>
            <Text style={styles.subtitle}>Sign in with your registered phone number</Text>
          </View>

          {/* Form card */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Enter Phone Number</Text>
            <Text style={styles.cardSubtitle}>We'll send you a one-time code to verify</Text>

            <Text style={styles.label}>Phone Number</Text>
            <View style={[styles.inputContainer, focused && styles.inputFocused]}>
              <Icon
                name="call-outline"
                size={20}
                color={focused ? COLORS.primary : COLORS.textMuted}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Enter 10 digit phone number"
                placeholderTextColor={COLORS.placeholder}
                value={phone}
                onChangeText={setPhone}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                keyboardType="phone-pad"
                maxLength={10}
              />
            </View>

            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleSendOtp}
              disabled={loading}
              activeOpacity={0.85}
            >
              <Text style={styles.buttonText}>{loading ? 'Sending code...' : 'Send OTP'}</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.tagline}>Delivering Happiness ♥</Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

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
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingTop: 20,
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

  brandRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  brandIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  brandName: {
    fontFamily: FONT_FAMILY,
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.primaryDark,
    letterSpacing: 0.3,
  },
  brandTag: { fontFamily: FONT_FAMILY, fontSize: 13, color: COLORS.textMuted, marginTop: 1 },

  heading: { marginTop: 28, marginBottom: 24, alignItems: 'center' },
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
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: FONT_FAMILY,
    fontSize: 16,
    color: COLORS.textMuted,
    marginTop: 8,
    lineHeight: 22,
    textAlign: 'center',
  },

  card: {
    backgroundColor: COLORS.card,
    borderRadius: 14,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 1,
  },
  cardTitle: {
    fontFamily: FONT_FAMILY,
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
  },
  cardSubtitle: {
    fontFamily: FONT_FAMILY,
    fontSize: 14.5,
    color: COLORS.textMuted,
    marginTop: 6,
    marginBottom: 20,
    lineHeight: 20,
  },
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
    marginBottom: 20,
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

  button: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    minHeight: 54,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 2,
  },
  buttonDisabled: { backgroundColor: '#A9A2D6', shadowOpacity: 0 },
  buttonText: {
    fontFamily: FONT_FAMILY,
    color: COLORS.white,
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.4,
  },

  tagline: {
    fontFamily: FONT_FAMILY,
    textAlign: 'center',
    fontSize: 13,
    color: COLORS.textMuted,
    marginTop: 28,
  },
});

export default StaffLoginScreen;