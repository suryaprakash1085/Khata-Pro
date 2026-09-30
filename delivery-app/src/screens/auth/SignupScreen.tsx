import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Platform,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { AuthContext } from '../../context/AuthContext';

/* ── Design tokens (UI only) — same as LoginScreen ───────────────────── */
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
  error: '#B3261E',
  white: '#FFFFFF',
};

const FONT_FAMILY = Platform.select({
  ios: 'Times New Roman',
  android: 'serif',
  default: '"Times New Roman", Times, serif',
}) as string;

const SignupScreen: React.FC = ({ navigation }: any) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { signup } = useContext(AuthContext);

  // UI-only: which input is focused (for purple focus border)
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // Error states
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  // Name validation - only letters allowed
  const validateNameInput = (text: string) => {
    const letterRegex = /^[A-Za-z\s]*$/;

    setNameError('');

    if (text === '') {
      setName(text);
      return;
    }

    if (!letterRegex.test(text)) {
      setNameError('Only letters are allowed');
      return;
    }

    setName(text);
  };

  // Email validation - only allow letters, numbers, @, and .
  const validateEmailInput = (text: string) => {
    const emailCharRegex = /^[A-Za-z0-9@._]*$/;

    if (text === '') {
      setEmail(text);
      setEmailError('');
      return;
    }

    if (!emailCharRegex.test(text)) {
      return;
    }

    setEmail(text);
    setEmailError('');
  };

  // Phone validation - only numbers and 10 digits
  const validatePhoneInput = (text: string) => {
    const numericRegex = /^[0-9]*$/;

    setPhoneError('');

    if (text === '') {
      setPhone(text);
      return;
    }

    if (!numericRegex.test(text)) {
      setPhoneError('Only numbers are allowed');
      return;
    }

    if (text.length > 10) {
      setPhoneError('Phone number must be 10 digits');
      return;
    }

    setPhone(text);
  };

  // Password validation
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

  // Confirm Password validation
  const validateConfirmPasswordInput = (text: string) => {
    setConfirmPassword(text);
    setConfirmPasswordError('');

    if (text.length === 0) return;

    if (text !== password) {
      setConfirmPasswordError('Passwords do not match');
    }
  };

  // Full validation on submit
  const validateForm = (): boolean => {
    let hasError = false;

    if (!name.trim()) {
      setNameError('Full name cannot be empty');
      hasError = true;
    } else if (!/^[A-Za-z\s]+$/.test(name.trim())) {
      setNameError('Only letters are allowed');
      hasError = true;
    }

    if (!email.trim()) {
      setEmailError('Email cannot be empty');
      hasError = true;
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setEmailError('Please enter a valid email address');
        hasError = true;
      }
    }

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
      if (!/^[A-Z]/.test(password)) {
        setPasswordError('First letter must be uppercase');
        hasError = true;
      } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        setPasswordError('At least one special character required');
        hasError = true;
      } else if (!/[0-9]/.test(password)) {
        setPasswordError('At least one number required');
        hasError = true;
      } else {
        const remainingText = password.substring(1);
        const remainingRegex = /^[a-z0-9!@#$%^&*(),.?":{}|<>]*$/;
        if (!remainingRegex.test(remainingText)) {
          setPasswordError('Use lowercase, numbers & special chars only');
          hasError = true;
        }
      }
    }

    if (!confirmPassword) {
      setConfirmPasswordError('Confirm password cannot be empty');
      hasError = true;
    } else if (confirmPassword !== password) {
      setConfirmPasswordError('Passwords do not match');
      hasError = true;
    }

    return !hasError;
  };

  const handleSignup = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const result = await signup({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        password,
      });

      if (result.success) {
        setName('');
        setEmail('');
        setPhone('');
        setPassword('');
        setConfirmPassword('');
        setNameError('');
        setEmailError('');
        setPhoneError('');
        setPasswordError('');
        setConfirmPasswordError('');

        Alert.alert(
          'Success',
          'Account created successfully! Please login to continue.',
          [
            {
              text: 'OK',
              onPress: () => {
                navigation.navigate('Login');
              },
            },
          ]
        );
      } else {
        Alert.alert('Error', result.message || 'Signup failed. Please try again.');
      }
    } catch (error: any) {
      console.error('Signup error:', error);
      Alert.alert('Error', error.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const renderInput = (
    fieldKey: string,
    icon: string,
    label: string,
    placeholder: string,
    value: string,
    onChangeText: (t: string) => void,
    error: string,
    options: any = {}
  ) => {
    // UI-only props are pulled out so they aren't spread onto TextInput
    const { isPassword, visible, onToggle, ...inputProps } = options;
    const focused = focusedField === fieldKey;

    return (
      <View style={styles.inputWrapper}>
        <Text style={styles.label}>{label}</Text>
        <View
          style={[
            styles.inputContainer,
            focused && styles.inputFocused,
            error ? styles.inputErrorBorder : null,
          ]}
        >
          <Icon
            name={icon}
            size={20}
            color={error ? COLORS.error : focused ? COLORS.primary : COLORS.textMuted}
            style={styles.inputIcon}
          />
          <TextInput
            style={styles.input}
            placeholder={placeholder}
            placeholderTextColor={COLORS.placeholder}
            value={value}
            onChangeText={onChangeText}
            onFocus={() => setFocusedField(fieldKey)}
            onBlur={() => setFocusedField(null)}
            {...inputProps}
          />
          {isPassword && (
            <TouchableOpacity
              onPress={onToggle}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            >
              <Icon
                name={visible ? 'eye-outline' : 'eye-off-outline'}
                size={20}
                color={COLORS.textMuted}
              />
            </TouchableOpacity>
          )}
        </View>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
      </View>
    );
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
          {/* ── Top bar: back + branding ── */}
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

          {/* ── Heading ── */}
          <View style={styles.heading}>
            <Text style={styles.title}>Sign Up</Text>
            <Text style={styles.subtitle}>Create your new account</Text>
          </View>

          {/* ── Fields ── */}
          {renderInput(
            'name',
            'person-outline',
            'Full Name',
            'Enter your full name',
            name,
            validateNameInput,
            nameError
          )}
          {renderInput(
            'email',
            'mail-outline',
            'Email Address',
            'Enter your email address',
            email,
            validateEmailInput,
            emailError,
            {
              autoCapitalize: 'none',
              keyboardType: 'email-address',
            }
          )}
          {renderInput(
            'phone',
            'call-outline',
            'Phone Number',
            'Enter 10 digit phone number',
            phone,
            validatePhoneInput,
            phoneError,
            {
              keyboardType: 'phone-pad',
            }
          )}
          {renderInput(
            'password',
            'lock-closed-outline',
            'Password',
            'Enter your password',
            password,
            validatePasswordInput,
            passwordError,
            {
              secureTextEntry: !showPassword,
              isPassword: true,
              visible: showPassword,
              onToggle: () => setShowPassword(!showPassword),
            }
          )}
          {renderInput(
            'confirmPassword',
            'lock-closed-outline',
            'Confirm Password',
            'Re-enter your password',
            confirmPassword,
            validateConfirmPasswordInput,
            confirmPasswordError,
            {
              secureTextEntry: !showConfirmPassword,
              isPassword: true,
              visible: showConfirmPassword,
              onToggle: () => setShowConfirmPassword(!showConfirmPassword),
            }
          )}

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

          {/* ── Create account ── */}
          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleSignup}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading ? (
              <ActivityIndicator color="#ffffff" size="small" />
            ) : (
              <Text style={styles.buttonText}>Create Account</Text>
            )}
          </TouchableOpacity>

          {/* ── Login link ── */}
          <View style={styles.divider} />
          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account?</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('Login')}
              hitSlop={{ top: 10, bottom: 10, left: 6, right: 6 }}
            >
              <Text style={styles.footerLink}> Login</Text>
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
    paddingTop: 16,
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

  /* Top bar */
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
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
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
  brandTag: {
    fontFamily: FONT_FAMILY,
    fontSize: 12,
    color: COLORS.textMuted,
  },

  /* Heading */
  heading: {
    marginTop: 26,
    marginBottom: 26,
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
  inputErrorBorder: {
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

  /* Button */
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
    shadowOpacity: 0,
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

export default SignupScreen;