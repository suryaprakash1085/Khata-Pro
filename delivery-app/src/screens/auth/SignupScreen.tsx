
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
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { AuthContext } from '../../context/AuthContext';

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
    icon: string,
    label: string,
    value: string,
    onChangeText: (t: string) => void,
    error: string,
    options: any = {}
  ) => (
    <View style={styles.inputWrapper}>
      <View style={[styles.inputContainer, error && styles.inputErrorBorder]}>
        <Icon
          name={icon}
          size={19}
          color={error ? '#E4572E' : '#8B8D98'}
          style={styles.inputIcon}
        />
        <TextInput
          style={styles.input}
          placeholder={label}
          placeholderTextColor="#9CA0AC"
          value={value}
          onChangeText={onChangeText}
          {...options}
        />
        {options.isPassword && (
          <TouchableOpacity
            onPress={options.onToggle}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Icon
              name={options.visible ? 'eye-outline' : 'eye-off-outline'}
              size={19}
              color="#8B8D98"
            />
          </TouchableOpacity>
        )}
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#EDEBFB" />

      <View style={styles.heroSection}>
        <View style={styles.heroCircleLarge} />
        <View style={styles.heroCircleSmall} />
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={20} color="#5B4FE8" />
        </TouchableOpacity>
        <Icon name="person-add" size={54} color="#5B4FE8" style={styles.heroIcon} />
      </View>

      <ScrollView
        style={styles.sheet}
        contentContainerStyle={styles.sheetContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.titleRow}>
          <View style={styles.iconBadge}>
            <Icon name="create-outline" size={22} color="#5B4FE8" />
          </View>
          <View>
            <Text style={styles.title}>Sign Up</Text>
            <Text style={styles.subtitle}>Create your new account</Text>
          </View>
        </View>

        {renderInput('person-outline', 'Full Name', name, validateNameInput, nameError)}
        {renderInput('mail-outline', 'Email Address', email, validateEmailInput, emailError, {
          autoCapitalize: 'none',
          keyboardType: 'email-address',
        })}
        {renderInput('call-outline', 'Phone Number', phone, validatePhoneInput, phoneError, {
          keyboardType: 'phone-pad',
        })}
        {renderInput(
          'lock-closed-outline',
          'Password',
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
          'lock-closed-outline',
          'Confirm Password',
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

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.footerLink}> Login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EDEBFB',
  },
  heroSection: {
    height: 150,
    backgroundColor: '#EDEBFB',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  heroCircleLarge: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(91,79,232,0.08)',
    top: -70,
    right: -50,
  },
  heroCircleSmall: {
    position: 'absolute',
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: 'rgba(91,79,232,0.06)',
    bottom: -40,
    left: -30,
  },
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 54 : 34,
    left: 20,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroIcon: {
    opacity: 0.95,
  },
  sheet: {
    flex: 1,
    backgroundColor: '#F5F4FB',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    marginTop: -20,
  },
  sheetContent: {
    padding: 24,
    paddingTop: 28,
    paddingBottom: 40,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  iconBadge: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: '#E1DEFB',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1B1D28',
  },
  subtitle: {
    fontSize: 13,
    color: '#7A7D89',
    marginTop: 2,
  },
  inputWrapper: {
    marginBottom: 14,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    paddingHorizontal: 16,
    borderWidth: 1.5,
    borderColor: '#ffffff',
    shadowColor: '#5B4FE8',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 1,
  },
  inputErrorBorder: {
    borderColor: '#E4572E',
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 15,
    color: '#1B1D28',
  },
  errorText: {
    color: '#E4572E',
    fontSize: 12,
    marginTop: 6,
    marginLeft: 4,
    fontWeight: '500',
  },
  button: {
    backgroundColor: '#5B4FE8',
    borderRadius: 16,
    paddingVertical: 17,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
    shadowColor: '#5B4FE8',
    shadowOpacity: 0.35,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  buttonDisabled: {
    backgroundColor: '#C4C1E8',
    shadowOpacity: 0,
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
    color: '#5F6270',
    fontSize: 14,
  },
  footerLink: {
    color: '#5B4FE8',
    fontWeight: '700',
    fontSize: 14,
  },
});

export default SignupScreen;
