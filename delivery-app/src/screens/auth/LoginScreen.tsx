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
  ActivityIndicator,
  Alert,
  Image,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { AuthContext } from '../../context/AuthContext';

/* ── Design tokens (UI only) ─────────────────────────────────────────── */
const COLORS = {
  primary: '#4B3F9E', // deep indigo-purple
  primaryDark: '#2B2266',
  primarySoft: '#EFEDFA', // subtle lavender surface
  background: '#F8F7FC',
  card: '#FFFFFF',
  text: '#1A1745', // dark navy/purple
  textMuted: '#6E6A8E', // muted gray-purple
  placeholder: '#9A97B3',
  border: '#E4E1F2', // light lavender-gray
  error: '#B3261E', // dark red
  white: '#FFFFFF',
};

const FONT_FAMILY = Platform.select({
  ios: 'Times New Roman',
  android: 'serif',
  default: '"Times New Roman", Times, serif',
}) as string;

const LoginScreen: React.FC = ({ navigation }: any) => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [phoneError, setPhoneError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // UI-only: which input is focused (for purple focus border)
  const [focusedField, setFocusedField] = useState<'phone' | 'password' | null>(null);

  const { login } = useContext(AuthContext);

  const validatePasswordInput = (text: string) => {
    setPassword(text);
    setPasswordError('');
    if (text.length === 0) {
      return;
    }
    if (!/^[A-Z]/.test(text)) {
      setPasswordError('First letter must be uppercase');
      return;
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(text)) {
      setPasswordError('At least one special character required');
      return;
    }
    if (!/[0-9]/.test(text)) {
      setPasswordError('At least one number required');
      return;
    }
    const remainingText = text.substring(1);
    const remainingRegex = /^[a-z0-9!@#$%^&*(),.?":{}|<>]*$/;
    if (!remainingRegex.test(remainingText)) {
      setPasswordError('Use lowercase, numbers & special chars only');
      return;
    }
    setPasswordError('');
  };

  const validatePasswordFormat = (pwd: string): { isValid: boolean; message: string } => {
    if (pwd.length === 0) {
      return { isValid: false, message: 'Password cannot be empty' };
    }
    if (!/^[A-Z]/.test(pwd)) {
      return { isValid: false, message: 'First letter must be upprcase' };
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(pwd)) {
      return { isValid: false, message: 'At least one special character required' };
    }
    if (!/[0-9]/.test(pwd)) {
      return { isValid: false, message: 'At least one number required' };
    }
    const remainingText = pwd.substring(1);
    const remainingRegex = /^[a-z0-9!@#$%^&*(),.?":{}|<>]*$/;
    if (!remainingRegex.test(remainingText)) {
      return { isValid: false, message: 'Use lowercase, numbers & special chars only' };
    }
    return { isValid: true, message: '' };
  };

  const handleLogin = async () => {
    let hasError = false;

    if (!phone.trim()) {
      setPhoneError('Phone number cannot be empty');
      hasError = true;
    } else if (!/^[0-9]+$/.test(phone.trim())) {
      setPhoneError('Only numbers are allowed');
      hasError = true;
    } else if (phone.trim().length !== 10) {
      setPhoneError('Phone number must be 10 digits');
      hasError = true;
    }

    if (!password) {
      setPasswordError('Password cannot be empty');
      hasError = true;
    } else {
      const passwordValidation = validatePasswordFormat(password);
      if (!passwordValidation.isValid) {
        setPasswordError(passwordValidation.message);
        hasError = true;
      }
    }

    if (hasError) {
      return;
    }

    setLoading(true);

    try {
      const result = await login(phone.trim(), password);

      if (result.success) {
        Alert.alert(
          '✅ Success',
          'Login successful!',
          [
            {
              text: 'OK',
              onPress: () => {
                navigation.reset({
                  index: 0,
                  routes: [{ name: 'MainTabs' }],
                });
              },
            },
          ]
        );
      } else {
        setPasswordError(result.message || 'Login failed. Please try again.');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      setPasswordError(error.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const requirements = [
    'First letter must be uppercase',
    'At least one special character',
    'At least one number',
    'Use lowercase, numbers & special chars only',
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Decorative lavender wave at the bottom — sits behind content */}
        <View pointerEvents="none" style={styles.waveWrap}>
          <View style={styles.waveBack} />
          <View style={styles.waveFront} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* ── Top branding ── */}
          <View style={styles.brandRow}>
            <View style={styles.brandIcon}>
              <Icon name="bicycle" size={22} color={COLORS.white} />
            </View>
            <View>
              <Text style={styles.brandName}>Khata-Pro</Text>
              <Text style={styles.brandTag}>Delivery Partner</Text>
            </View>
          </View>

          {/* ── Welcome + illustration ── */}
          <View style={styles.heroRow}>
            <View style={styles.heroText}>
              <Text style={styles.title}>Welcome Back</Text>
              <Text style={styles.subtitle}>Login to continue your journey</Text>
            </View>
            <View style={styles.illustrationBlob}>
              <Image
                source={require('../../../assets/images/login-illustration.png')}
                style={styles.illustrationImage}
                resizeMode="contain"
              />
            </View>
          </View>

          {/* ── Phone ── */}
          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Phone Number</Text>
            <View
              style={[
                styles.inputContainer,
                focusedField === 'phone' && styles.inputFocused,
                phoneError ? styles.inputError : null,
              ]}
            >
              <Icon
                name="call-outline"
                size={20}
                color={focusedField === 'phone' ? COLORS.primary : COLORS.textMuted}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Enter 10 digit phone number"
                placeholderTextColor={COLORS.placeholder}
                value={phone}
                onChangeText={setPhone}
                onFocus={() => setFocusedField('phone')}
                onBlur={() => setFocusedField(null)}
                autoCapitalize="none"
                keyboardType="phone-pad"
                autoCorrect={false}
              />
            </View>
            {phoneError ? <Text style={styles.errorText}>{phoneError}</Text> : null}
          </View>

          {/* ── Password ── */}
          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Password</Text>
            <View
              style={[
                styles.inputContainer,
                focusedField === 'password' && styles.inputFocused,
                passwordError ? styles.inputError : null,
              ]}
            >
              <Icon
                name="lock-closed-outline"
                size={20}
                color={focusedField === 'password' ? COLORS.primary : COLORS.textMuted}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Enter your password"
                placeholderTextColor={COLORS.placeholder}
                value={password}
                onChangeText={setPassword}
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField(null)}
                secureTextEntry={!showPassword}
                autoCorrect={false}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              >
                <Icon
                  name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                  size={20}
                  color={COLORS.textMuted}
                />
              </TouchableOpacity>
            </View>
            {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
          </View>

          {/* ── Password requirements (static info) ── */}
          <View style={styles.requirementsCard}>
            <View style={styles.requirementsHeader}>
              <Icon name="shield-checkmark-outline" size={18} color={COLORS.primary} />
              <Text style={styles.requirementsTitle}>Password Requirements</Text>
            </View>
            {requirements.map((item) => (
              <View key={item} style={styles.requirementRow}>
                <View style={styles.bullet} />
                <Text style={styles.requirementText}>{item}</Text>
              </View>
            ))}
          </View>

          {/* ── Login button ── */}
          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading ? (
              <ActivityIndicator color="#ffffff" size="small" />
            ) : (
              <Text style={styles.buttonText}>Login</Text>
            )}
          </TouchableOpacity>

          {/* ── Sign up ── */}
          <View style={styles.divider} />
          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account?</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('Signup')}
              hitSlop={{ top: 10, bottom: 10, left: 6, right: 6 }}
            >
              <Text style={styles.footerLink}> Sign Up</Text>
            </TouchableOpacity>
          </View>

          {/* ── Footer tagline ── */}
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
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    flexGrow: 1,
    width: '100%',
    maxWidth: 520,
    alignSelf: 'center',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 32,
  },

  /* Decorative wave */
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

  /* Branding */
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
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
  brandTag: {
    fontFamily: FONT_FAMILY,
    fontSize: 13,
    color: COLORS.textMuted,
    marginTop: 1,
  },

  /* Hero */
  heroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 28,
    marginBottom: 28,
  },
  heroText: {
    flex: 1,
    paddingRight: 8,
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
    lineHeight: 22,
  },
  illustrationBlob: {
    width: '38%',
    aspectRatio: 1,
    borderRadius: 999,
    backgroundColor: COLORS.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  illustrationImage: {
    width: '85%',
    height: '85%',
  },

  /* Inputs */
  inputWrapper: {
    marginBottom: 18,
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
  },
  inputFocused: {
    borderColor: COLORS.primary,
    borderWidth: 1.5,
  },
  inputError: {
    borderColor: COLORS.error,
    borderWidth: 1.5,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    minHeight: 52,
    fontFamily: FONT_FAMILY,
    fontSize: 16,
    color: COLORS.text,
    paddingVertical: 0,
  },
  errorText: {
    fontFamily: FONT_FAMILY,
    color: COLORS.error,
    fontSize: 13,
    marginTop: 6,
    marginLeft: 2,
    fontWeight: '600',
  },

  /* Requirements */
  requirementsCard: {
    backgroundColor: COLORS.primarySoft,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 22,
  },
  requirementsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  requirementsTitle: {
    fontFamily: FONT_FAMILY,
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.primary,
    marginLeft: 8,
  },
  requirementRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 2,
    paddingLeft: 2,
  },
  bullet: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.textMuted,
    marginTop: 8,
    marginRight: 10,
  },
  requirementText: {
    flex: 1,
    fontFamily: FONT_FAMILY,
    fontSize: 13.5,
    lineHeight: 20,
    color: COLORS.textMuted,
  },

  /* Buttons */
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
  buttonDisabled: {
    backgroundColor: '#A9A2D6',
  },
  buttonText: {
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
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  footerText: {
    fontFamily: FONT_FAMILY,
    color: COLORS.textMuted,
    fontSize: 15,
  },
  footerLink: {
    fontFamily: FONT_FAMILY,
    color: COLORS.primary,
    fontWeight: '700',
    fontSize: 15,
  },


  tagline: {
    fontFamily: FONT_FAMILY,
    textAlign: 'center',
    fontSize: 13,
    color: COLORS.textMuted,
    marginTop: 28,
  },
});

export default LoginScreen;