<<<<<<< HEAD
﻿// // delivery-app/src/screens/auth/LoginScreen.tsx
// import React, { useState, useContext } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   KeyboardAvoidingView,
//   Platform,
//   ScrollView,
//   StatusBar,
//   Alert,
//   ActivityIndicator,
// } from 'react-native';
// import Icon from 'react-native-vector-icons/Ionicons';
// import { AuthContext } from '../../context/AuthContext';

// const LoginScreen: React.FC = ({ navigation }: any) => {
//   const [phone, setPhone] = useState('');
//   const [password, setPassword] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const { login } = useContext(AuthContext);

//   const handleLogin = async () => {
//     if (!phone.trim()) {
//       Alert.alert('Error', 'Please enter your phone number');
//       return;
//     }

//     if (!password) {
//       Alert.alert('Error', 'Please enter your password');
//       return;
//     }

//     setLoading(true);

//     try {
//       const result = await login(phone.trim(), password);

//       if (result.success) {
//         Alert.alert(
//           '✅ Success',
//           'Login successful!',
//           [{
//             text: 'OK',
//             onPress: () => {
//               navigation.reset({
//                 index: 0,
//                 routes: [{ name: 'MainTabs' }],
//               });
//             }
//           }]
//         );
//       } else {
//         Alert.alert('❌ Error', result.message || 'Login failed. Please try again.');
//       }
//     } catch (error: any) {
//       console.error('Login error:', error);
//       Alert.alert('❌ Error', error.message || 'Something went wrong');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <KeyboardAvoidingView
//       style={styles.container}
//       behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//     >
//       <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
//       <ScrollView contentContainerStyle={styles.scrollContent}>
//         <View style={styles.logoContainer}>
//           <Text style={styles.logoText}>🍔 QuickBite</Text>
//           <Text style={styles.subtitle}>Order food from favourite restaurants</Text>
//         </View>

//         <View style={styles.formContainer}>
//           <Text style={styles.title}>Sign In</Text>
//           <Text style={styles.subtitle2}>Login to your account</Text>

//           <View style={styles.inputContainer}>
//             <Icon name="call-outline" size={20} color="#7e808c" style={styles.inputIcon} />
//             <TextInput
//               style={styles.input}
//               placeholder="Phone Number"
//               placeholderTextColor="#7e808c"
//               value={phone}
//               onChangeText={setPhone}
//               autoCapitalize="none"
//               keyboardType="phone-pad"
//               autoCorrect={false}
//             />
//           </View>

//           <View style={styles.inputContainer}>
//             <Icon name="lock-closed-outline" size={20} color="#7e808c" style={styles.inputIcon} />
//             <TextInput
//               style={styles.input}
//               placeholder="Password"
//               placeholderTextColor="#7e808c"
//               value={password}
//               onChangeText={setPassword}
//               secureTextEntry={!showPassword}
//               autoCorrect={false}
//             />
//             <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
//               <Icon
//                 name={showPassword ? "eye-outline" : "eye-off-outline"}
//                 size={20}
//                 color="#7e808c"
//               />
//             </TouchableOpacity>
//           </View>

//           <TouchableOpacity
//             style={[styles.button, loading && styles.buttonDisabled]}
//             onPress={handleLogin}
//             disabled={loading}
//           >
//             {loading ? (
//               <ActivityIndicator color="#ffffff" size="small" />
//             ) : (
//               <Text style={styles.buttonText}>Login</Text>
//             )}
//           </TouchableOpacity>

//           <View style={styles.footer}>
//             <Text style={styles.footerText}>Don't have an account?</Text>
//             <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
//               <Text style={styles.footerLink}> Sign Up</Text>
//             </TouchableOpacity>
//           </View>

//           <TouchableOpacity
//             onPress={() => navigation.navigate('StaffLogin')}
//             style={{ marginTop: 16, alignItems: 'center' }}
//           >
//             <Text style={styles.footerLink}>Login as Staff / Driver</Text>
//           </TouchableOpacity>
//         </View>
//       </ScrollView>
//     </KeyboardAvoidingView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#ffffff',
//   },
//   scrollContent: {
//     flexGrow: 1,
//     justifyContent: 'center',
//     padding: 20,
//   },
//   logoContainer: {
//     marginBottom: 40,
//     alignItems: 'center',
//   },
//   logoText: {
//     fontSize: 32,
//     fontWeight: '700',
//     color: '#333333',
//   },
//   subtitle: {
//     marginTop: 8,
//     fontSize: 14,
//     color: '#6d6d78',
//   },
//   formContainer: {
//     backgroundColor: '#f9f9fb',
//     padding: 20,
//     borderRadius: 16,
//     shadowColor: '#000',
//     shadowOpacity: 0.05,
//     shadowRadius: 10,
//     elevation: 4,
//   },
//   title: {
//     fontSize: 26,
//     fontWeight: '700',
//     color: '#111111',
//     marginBottom: 10,
//   },
//   subtitle2: {
//     fontSize: 14,
//     color: '#6d6d78',
//     marginBottom: 24,
//   },
//   inputContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#ffffff',
//     borderRadius: 12,
//     paddingHorizontal: 16,
//     marginBottom: 16,
//     borderWidth: 1,
//     borderColor: '#e6e6e9',
//   },
//   inputIcon: {
//     marginRight: 10,
//   },
//   input: {
//     flex: 1,
//     height: 48,
//     fontSize: 16,
//     color: '#111111',
//   },
//   button: {
//     backgroundColor: '#1e90ff',
//     borderRadius: 12,
//     paddingVertical: 14,
//     alignItems: 'center',
//     marginTop: 10,
//   },
//   buttonDisabled: {
//     backgroundColor: '#7e808c',
//   },
//   buttonText: {
//     color: '#ffffff',
//     fontSize: 16,
//     fontWeight: '700',
//   },
//   footer: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     marginTop: 20,
//   },
//   footerText: {
//     color: '#6d6d78',
//   },
//   footerLink: {
//     color: '#1e90ff',
//     fontWeight: '700',
//   },
// });

// export default LoginScreen;
// delivery-app/src/screens/auth/LoginScreen.tsx
=======
﻿// delivery-app/src/screens/auth/LoginScreen.tsx
>>>>>>> 150d30a8e855db2e63725445ccaf4fd4797b8cd4
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
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { AuthContext } from '../../context/AuthContext';

const LoginScreen: React.FC = ({ navigation }: any) => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Error states
  const [phoneError, setPhoneError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  
  const { login } = useContext(AuthContext);

<<<<<<< HEAD
  // Validation function for phone number - blocks non-numeric and limits to 10 digits
  const validatePhoneInput = (text: string) => {
    const numericRegex = /^[0-9]*$/;
    
    // Clear error when user starts typing
    setPhoneError('');
    
    if (text === '') {
      setPhone(text);
=======
  const handleLogin = async () => {
    if (!phone.trim()) {
      Alert.alert('Error', 'Please enter your phone number');
>>>>>>> 150d30a8e855db2e63725445ccaf4fd4797b8cd4
      return;
    }

    // Block letters and show inline error
    if (!numericRegex.test(text)) {
      setPhoneError('Only numbers are allowed');
      return;
    }

    // Block more than 10 digits and show inline error
    if (text.length > 10) {
      setPhoneError('Phone number must be 10 digits');
      return;
    }

    // Only set phone if all validations pass
    setPhone(text);
  };

  // Validation function for password
  const validatePasswordInput = (text: string) => {
    setPassword(text);
    setPasswordError('');
    
    if (text.length === 0) {
      return;
    }

    // Check first letter is capital
    if (!/^[A-Z]/.test(text)) {
      setPasswordError('First letter must be uppercase');
      return;
    }

    // Check at least one special character
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(text)) {
      setPasswordError('At least one special character required');
      return;
    }

    // Check at least one number
    if (!/[0-9]/.test(text)) {
      setPasswordError('At least one number required');
      return;
    }

    // Check remaining characters (after first) are lowercase, numbers, or special characters only
    const remainingText = text.substring(1);
    const remainingRegex = /^[a-z0-9!@#$%^&*(),.?":{}|<>]*$/;
    if (!remainingRegex.test(remainingText)) {
      setPasswordError('Use lowercase, numbers & special chars only');
      return;
    }

    setPasswordError('');
  };

  // Validation function for password on submit
  const validatePasswordFormat = (pwd: string): { isValid: boolean; message: string } => {
    if (pwd.length === 0) {
      return { isValid: false, message: 'Password cannot be empty' };
    }

    // Check first letter is capital
    if (!/^[A-Z]/.test(pwd)) {
      return { isValid: false, message: 'First letter must be uppercase' };
    }

    // Check at least one special character
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(pwd)) {
      return { isValid: false, message: 'At least one special character required' };
    }

    // Check at least one number
    if (!/[0-9]/.test(pwd)) {
      return { isValid: false, message: 'At least one number required' };
    }

    // Check remaining characters (after first) are lowercase, numbers, or special characters only
    const remainingText = pwd.substring(1);
    const remainingRegex = /^[a-z0-9!@#$%^&*(),.?":{}|<>]*$/;
    if (!remainingRegex.test(remainingText)) {
      return { isValid: false, message: 'Use lowercase, numbers & special chars only' };
    }

    return { isValid: true, message: '' };
  };

  const handleLogin = async () => {
    let hasError = false;

    // Validate phone
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

    // Validate password
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
<<<<<<< HEAD
        // Success - navigate to main screen
        navigation.reset({
          index: 0,
          routes: [{ name: 'MainTabs' }],
        });
=======
        Alert.alert(
          '✅ Success',
          'Login successful!',
          [{
            text: 'OK',
            onPress: () => {
              navigation.reset({
                index: 0,
                routes: [{ name: 'MainTabs' }],
              });
            }
          }]
        );
>>>>>>> 150d30a8e855db2e63725445ccaf4fd4797b8cd4
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
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>🍔 QuickBite</Text>
          <Text style={styles.subtitle}>Order food from favourite restaurants</Text>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.title}>Sign In</Text>
          <Text style={styles.subtitle2}>Login to your account</Text>

<<<<<<< HEAD
          {/* Phone Input */}
          <View style={styles.inputWrapper}>
            <View style={[styles.inputContainer, phoneError && styles.inputError]}>
              <Icon name="call-outline" size={20} color={phoneError ? "#FF3B30" : "#7e808c"} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Phone Number"
                placeholderTextColor="#7e808c"
                value={phone}
                onChangeText={validatePhoneInput}
                autoCapitalize="none"
                keyboardType="phone-pad"
                autoCorrect={false}
=======
          <View style={styles.inputContainer}>
            <Icon name="call-outline" size={20} color="#7e808c" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Phone Number"
              placeholderTextColor="#7e808c"
              value={phone}
              onChangeText={setPhone}
              autoCapitalize="none"
              keyboardType="phone-pad"
              autoCorrect={false}
            />
          </View>

          <View style={styles.inputContainer}>
            <Icon name="lock-closed-outline" size={20} color="#7e808c" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#7e808c"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoCorrect={false}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Icon
                name={showPassword ? "eye-outline" : "eye-off-outline"}
                size={20}
                color="#7e808c"
>>>>>>> 150d30a8e855db2e63725445ccaf4fd4797b8cd4
              />
            </View>
            {phoneError ? <Text style={styles.errorText}>{phoneError}</Text> : null}
          </View>

<<<<<<< HEAD
          {/* Password Input */}
          <View style={styles.inputWrapper}>
            <View style={[styles.inputContainer, passwordError && styles.inputError]}>
              <Icon name="lock-closed-outline" size={20} color={passwordError ? "#FF3B30" : "#7e808c"} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#7e808c"
                value={password}
                onChangeText={validatePasswordInput}
                secureTextEntry={!showPassword}
                autoCorrect={false}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Icon
                  name={showPassword ? "eye-outline" : "eye-off-outline"}
                  size={20}
                  color="#7e808c"
                />
              </TouchableOpacity>
            </View>
            {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
          </View>

=======
>>>>>>> 150d30a8e855db2e63725445ccaf4fd4797b8cd4
          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={loading}
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
            style={{ marginTop: 16, alignItems: 'center' }}
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
    backgroundColor: '#ffffff',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  logoContainer: {
    marginBottom: 40,
    alignItems: 'center',
  },
  logoText: {
    fontSize: 32,
    fontWeight: '700',
    color: '#333333',
  },
  subtitle: {
    marginTop: 8,
    fontSize: 14,
    color: '#6d6d78',
  },
  formContainer: {
    backgroundColor: '#f9f9fb',
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 4,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#111111',
    marginBottom: 10,
  },
  subtitle2: {
    fontSize: 14,
    color: '#6d6d78',
    marginBottom: 24,
  },
  inputWrapper: {
    marginBottom: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#e6e6e9',
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
    height: 48,
    fontSize: 16,
    color: '#111111',
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 13,
    marginTop: 4,
    marginLeft: 4,
    fontWeight: '500',
  },
  button: {
    backgroundColor: '#1e90ff',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: '#7e808c',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  footerText: {
    color: '#6d6d78',
  },
  footerLink: {
    color: '#1e90ff',
    fontWeight: '700',
  },
});

export default LoginScreen;