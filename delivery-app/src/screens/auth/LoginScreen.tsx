


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
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { AuthContext } from '../../context/AuthContext';

const LoginScreen: React.FC = ({ navigation }: any) => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [phoneError, setPhoneError] = useState('');
  const [passwordError, setPasswordError] = useState('');

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
      return { isValid: false, message: 'First letter must be uppercase' };
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

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* ── Illustration — store + delivery rider (full-bleed banner, never floats) ── */}
        <View style={styles.illustrationSection}>
          <Image
            source={require('../../../assets/images/login-illustration.png')}
            style={styles.illustrationImage}
            resizeMode="contain"
            // @ts-ignore - objectFit "contain" guarantees the full illustration is always
            // visible with zero cropping on any screen size (web and mobile alike).
            // Any leftover space blends seamlessly since it matches the white background.
            objectFit="contain"
          />
        </View>

        {/* ── Sheet ── */}
        <View style={styles.sheet}>
          <View style={styles.sheetHeader}>
            <View style={styles.lockBadge}>
              <Icon name="lock-closed" size={22} color="#4F46E5" />
            </View>
            <View>
              <Text style={styles.title}>Sign In</Text>
              <Text style={styles.subtitle}>Login to your account</Text>
            </View>
          </View>

          <View style={styles.inputWrapper}>
            <View style={[styles.inputContainer, phoneError ? styles.inputError : null]}>
              <Icon name="call-outline" size={20} color="#8b8d98" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Phone Number"
                placeholderTextColor="#9a9ca6"
                value={phone}
                onChangeText={setPhone}
                autoCapitalize="none"
                keyboardType="phone-pad"
                autoCorrect={false}
              />
            </View>
            {phoneError ? <Text style={styles.errorText}>{phoneError}</Text> : null}
          </View>

          <View style={styles.inputWrapper}>
            <View style={[styles.inputContainer, passwordError ? styles.inputError : null]}>
              <Icon name="lock-closed-outline" size={20} color="#8b8d98" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#9a9ca6"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCorrect={false}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Icon
                  name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                  size={20}
                  color="#8b8d98"
                />
              </TouchableOpacity>
            </View>
            {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
          </View>

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

          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
              <Text style={styles.footerLink}> Sign Up</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={() => navigation.navigate('StaffLogin')}
            style={{ marginTop: 16, alignItems: 'center', marginBottom: 12 }}
          >
            <Text style={styles.footerLink}>Login as Staff / Driver</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: '#ffffff',
  },
  scrollContent: {
    flexGrow: 1,
    width: '100%',
    alignItems: 'stretch',
  },

  illustrationSection: {
    width: '100%',
    alignSelf: 'stretch',
    height: 220,
    overflow: 'hidden',
    backgroundColor: '#ffffff',
    position: 'relative',
  },
  illustrationImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },

  sheet: {
    flexGrow: 1,
    backgroundColor: '#F7F7FB',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 24,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  lockBadge: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#E9E7FE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#15151a',
  },
  subtitle: {
    fontSize: 13,
    color: '#8b8d98',
    marginTop: 2,
  },

  inputWrapper: {
    marginBottom: 14,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 14,
    paddingHorizontal: 16,
    height: 54,
    borderWidth: 1,
    borderColor: '#eaeaf0',
  },
  inputError: {
    borderColor: '#FF3B30',
    borderWidth: 1.5,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 15,
    color: '#15151a',
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 12,
    marginTop: 5,
    marginLeft: 4,
    fontWeight: '500',
  },

  button: {
    backgroundColor: '#4F46E5',
    borderRadius: 14,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 3,
  },
  buttonDisabled: {
    backgroundColor: '#a5a1f0',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },

  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 22,
  },
  footerText: {
    color: '#6d6d78',
    fontSize: 14,
  },
  footerLink: {
    color: '#4F46E5',
    fontWeight: '700',
    fontSize: 14,
  },
});

export default LoginScreen;
