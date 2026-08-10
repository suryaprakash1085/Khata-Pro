// // // // // import React, { useState, useContext } from 'react';
// // // // // import {
// // // // //   View,
// // // // //   Text,
// // // // //   TextInput,
// // // // //   TouchableOpacity,
// // // // //   StyleSheet,
// // // // //   KeyboardAvoidingView,
// // // // //   Platform,
// // // // //   ScrollView,
// // // // //   StatusBar,
// // // // //   Alert,
// // // // // } from 'react-native';
// // // // // import Icon from 'react-native-vector-icons/Ionicons';
// // // // // import { AuthContext } from '../../context/AuthContext';

// // // // // const SignupScreen: React.FC = ({ navigation }: any) => {
// // // // //   const [name, setName] = useState('');
// // // // //   const [email, setEmail] = useState('');
// // // // //   const [phone, setPhone] = useState('');
// // // // //   const [password, setPassword] = useState('');
// // // // //   const [confirmPassword, setConfirmPassword] = useState('');
// // // // //   const [loading, setLoading] = useState(false);
// // // // //   const { signup } = useContext(AuthContext);

// // // // //   const handleSignup = async () => {
// // // // //     if (!name || !email || !phone || !password || !confirmPassword) {
// // // // //       Alert.alert('Error', 'Please fill all fields');
// // // // //       return;
// // // // //     }

// // // // //     if (password !== confirmPassword) {
// // // // //       Alert.alert('Error', 'Passwords do not match');
// // // // //       return;
// // // // //     }

// // // // //     if (password.length < 6) {
// // // // //       Alert.alert('Error', 'Password must be at least 6 characters');
// // // // //       return;
// // // // //     }

// // // // //     setLoading(true);
// // // // //     try {
// // // // //       const success = await signup({ name, email, phone, password });
// // // // //       if (!success) {
// // // // //         Alert.alert('Error', 'Signup failed. Please try again.');
// // // // //       }
// // // // //     } catch (error) {
// // // // //       Alert.alert('Error', 'Something went wrong');
// // // // //     } finally {
// // // // //       setLoading(false);
// // // // //     }
// // // // //   };

// // // // //   return (
// // // // //     <KeyboardAvoidingView
// // // // //       style={styles.container}
// // // // //       behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
// // // // //     >
// // // // //       <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
// // // // //       <ScrollView contentContainerStyle={styles.scrollContent}>
// // // // //         <View style={styles.logoContainer}>
// // // // //           <Text style={styles.logoText}>🍔 QuickBite</Text>
// // // // //           <Text style={styles.subtitle}>Create your account</Text>
// // // // //         </View>

// // // // //         <View style={styles.formContainer}>
// // // // //           <Text style={styles.title}>Sign Up</Text>

// // // // //           <View style={styles.inputContainer}>
// // // // //             <Icon name="person-outline" size={20} color="#7e808c" style={styles.inputIcon} />
// // // // //             <TextInput
// // // // //               style={styles.input}
// // // // //               placeholder="Name"
// // // // //               placeholderTextColor="#7e808c"
// // // // //               value={name}
// // // // //               onChangeText={setName}
// // // // //             />
// // // // //           </View>

// // // // //           <View style={styles.inputContainer}>
// // // // //             <Icon name="mail-outline" size={20} color="#7e808c" style={styles.inputIcon} />
// // // // //             <TextInput
// // // // //               style={styles.input}
// // // // //               placeholder="Email"
// // // // //               placeholderTextColor="#7e808c"
// // // // //               value={email}
// // // // //               onChangeText={setEmail}
// // // // //               autoCapitalize="none"
// // // // //               keyboardType="email-address"
// // // // //             />
// // // // //           </View>

// // // // //           <View style={styles.inputContainer}>
// // // // //             <Icon name="call-outline" size={20} color="#7e808c" style={styles.inputIcon} />
// // // // //             <TextInput
// // // // //               style={styles.input}
// // // // //               placeholder="Phone"
// // // // //               placeholderTextColor="#7e808c"
// // // // //               value={phone}
// // // // //               onChangeText={setPhone}
// // // // //               keyboardType="phone-pad"
// // // // //             />
// // // // //           </View>

// // // // //           <View style={styles.inputContainer}>
// // // // //             <Icon name="lock-closed-outline" size={20} color="#7e808c" style={styles.inputIcon} />
// // // // //             <TextInput
// // // // //               style={styles.input}
// // // // //               placeholder="Password"
// // // // //               placeholderTextColor="#7e808c"
// // // // //               value={password}
// // // // //               onChangeText={setPassword}
// // // // //               secureTextEntry
// // // // //             />
// // // // //           </View>

// // // // //           <View style={styles.inputContainer}>
// // // // //             <Icon name="lock-closed-outline" size={20} color="#7e808c" style={styles.inputIcon} />
// // // // //             <TextInput
// // // // //               style={styles.input}
// // // // //               placeholder="Confirm Password"
// // // // //               placeholderTextColor="#7e808c"
// // // // //               value={confirmPassword}
// // // // //               onChangeText={setConfirmPassword}
// // // // //               secureTextEntry
// // // // //             />
// // // // //           </View>

// // // // //           <TouchableOpacity style={styles.button} onPress={handleSignup} disabled={loading}>
// // // // //             <Text style={styles.buttonText}>{loading ? 'Signing up...' : 'Sign Up'}</Text>
// // // // //           </TouchableOpacity>

// // // // //           <View style={styles.footer}>
// // // // //             <Text style={styles.footerText}>Already have an account?</Text>
// // // // //             <TouchableOpacity onPress={() => navigation.navigate('Login')}>
// // // // //               <Text style={styles.footerLink}> Sign In</Text>
// // // // //             </TouchableOpacity>
// // // // //           </View>
// // // // //         </View>
// // // // //       </ScrollView>
// // // // //     </KeyboardAvoidingView>
// // // // //   );
// // // // // };

// // // // // const styles = StyleSheet.create({
// // // // //   container: {
// // // // //     flex: 1,
// // // // //     backgroundColor: '#ffffff',
// // // // //   },
// // // // //   scrollContent: {
// // // // //     flexGrow: 1,
// // // // //     justifyContent: 'center',
// // // // //     padding: 20,
// // // // //   },
// // // // //   logoContainer: {
// // // // //     marginBottom: 40,
// // // // //     alignItems: 'center',
// // // // //   },
// // // // //   logoText: {
// // // // //     fontSize: 32,
// // // // //     fontWeight: '700',
// // // // //     color: '#333333',
// // // // //   },
// // // // //   subtitle: {
// // // // //     marginTop: 8,
// // // // //     fontSize: 14,
// // // // //     color: '#6d6d78',
// // // // //   },
// // // // //   formContainer: {
// // // // //     backgroundColor: '#f9f9fb',
// // // // //     padding: 20,
// // // // //     borderRadius: 16,
// // // // //     shadowColor: '#000',
// // // // //     shadowOpacity: 0.05,
// // // // //     shadowRadius: 10,
// // // // //     elevation: 4,
// // // // //   },
// // // // //   title: {
// // // // //     fontSize: 26,
// // // // //     fontWeight: '700',
// // // // //     color: '#111111',
// // // // //     marginBottom: 10,
// // // // //   },
// // // // //   inputContainer: {
// // // // //     flexDirection: 'row',
// // // // //     alignItems: 'center',
// // // // //     backgroundColor: '#ffffff',
// // // // //     borderRadius: 12,
// // // // //     paddingHorizontal: 16,
// // // // //     marginBottom: 16,
// // // // //     borderWidth: 1,
// // // // //     borderColor: '#e6e6e9',
// // // // //   },
// // // // //   inputIcon: {
// // // // //     marginRight: 10,
// // // // //   },
// // // // //   input: {
// // // // //     flex: 1,
// // // // //     height: 48,
// // // // //     fontSize: 16,
// // // // //     color: '#111111',
// // // // //   },
// // // // //   button: {
// // // // //     backgroundColor: '#1e90ff',
// // // // //     borderRadius: 12,
// // // // //     paddingVertical: 14,
// // // // //     alignItems: 'center',
// // // // //     marginTop: 10,
// // // // //   },
// // // // //   buttonText: {
// // // // //     color: '#ffffff',
// // // // //     fontSize: 16,
// // // // //     fontWeight: '700',
// // // // //   },
// // // // //   footer: {
// // // // //     flexDirection: 'row',
// // // // //     justifyContent: 'center',
// // // // //     marginTop: 20,
// // // // //   },
// // // // //   footerText: {
// // // // //     color: '#6d6d78',
// // // // //   },
// // // // //   footerLink: {
// // // // //     color: '#1e90ff',
// // // // //     fontWeight: '700',
// // // // //   },
// // // // // });

// // // // // export default SignupScreen;
// // // // // delivery-app/src/screens/auth/SignupScreen.tsx
// // // // import React, { useState, useContext } from 'react';
// // // // import {
// // // //   View,
// // // //   Text,
// // // //   TextInput,
// // // //   TouchableOpacity,
// // // //   StyleSheet,
// // // //   KeyboardAvoidingView,
// // // //   Platform,
// // // //   ScrollView,
// // // //   StatusBar,
// // // //   Alert,
// // // //   ActivityIndicator,
// // // // } from 'react-native';
// // // // import Icon from 'react-native-vector-icons/Ionicons';
// // // // import { AuthContext } from '../../context/AuthContext';

// // // // const SignupScreen: React.FC = ({ navigation }: any) => {
// // // //   const [name, setName] = useState('');
// // // //   const [email, setEmail] = useState('');
// // // //   const [phone, setPhone] = useState('');
// // // //   const [password, setPassword] = useState('');
// // // //   const [confirmPassword, setConfirmPassword] = useState('');
// // // //   const [loading, setLoading] = useState(false);
// // // //   const [showPassword, setShowPassword] = useState(false);
// // // //   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
// // // //   const { signup } = useContext(AuthContext);

// // // //   const handleSignup = async () => {
// // // //     // Validation
// // // //     if (!name.trim()) {
// // // //       Alert.alert('Error', 'Please enter your name');
// // // //       return;
// // // //     }

// // // //     if (!email.trim()) {
// // // //       Alert.alert('Error', 'Please enter your email');
// // // //       return;
// // // //     }

// // // //     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// // // //     if (!emailRegex.test(email)) {
// // // //       Alert.alert('Error', 'Please enter a valid email address');
// // // //       return;
// // // //     }

// // // //     if (!phone.trim()) {
// // // //       Alert.alert('Error', 'Please enter your phone number');
// // // //       return;
// // // //     }

// // // //     if (!password) {
// // // //       Alert.alert('Error', 'Please enter a password');
// // // //       return;
// // // //     }

// // // //     if (password.length < 6) {
// // // //       Alert.alert('Error', 'Password must be at least 6 characters');
// // // //       return;
// // // //     }

// // // //     if (!confirmPassword) {
// // // //       Alert.alert('Error', 'Please confirm your password');
// // // //       return;
// // // //     }

// // // //     if (password !== confirmPassword) {
// // // //       Alert.alert('Error', 'Passwords do not match');
// // // //       return;
// // // //     }

// // // //     setLoading(true);

// // // //     try {
// // // //       const result = await signup({
// // // //         name: name.trim(),
// // // //         email: email.trim(),
// // // //         phone: phone.trim(),
// // // //         password,
// // // //       });

// // // //       if (result.success) {
// // // //         // ✅ FIXED: Navigate to Login screen, NOT Home
// // // //         Alert.alert(
// // // //           '✅ Success',
// // // //           'Account created successfully! Please login to continue.',
// // // //           [{ 
// // // //             text: 'OK', 
// // // //             onPress: () => {
// // // //               // Navigate to Login screen (not Home)
// // // //               navigation.navigate('Login');
// // // //             }
// // // //           }]
// // // //         );
// // // //       } else {
// // // //         Alert.alert('❌ Error', result.message || 'Signup failed. Please try again.');
// // // //       }
// // // //     } catch (error: any) {
// // // //       console.error('Signup error:', error);
// // // //       Alert.alert('❌ Error', error.message || 'Something went wrong');
// // // //     } finally {
// // // //       setLoading(false);
// // // //     }
// // // //   };

// // // //   return (
// // // //     <KeyboardAvoidingView
// // // //       style={styles.container}
// // // //       behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
// // // //     >
// // // //       <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
// // // //       <ScrollView contentContainerStyle={styles.scrollContent}>
// // // //         <View style={styles.logoContainer}>
// // // //           <Text style={styles.logoText}>🍔 QuickBite</Text>
// // // //           <Text style={styles.subtitle}>Create your account</Text>
// // // //           <Text style={styles.subtitleSmall}>Data will be stored in Supabase</Text>
// // // //         </View>

// // // //         <View style={styles.formContainer}>
// // // //           <Text style={styles.title}>Sign Up</Text>

// // // //           {/* Name Input */}
// // // //           <View style={styles.inputContainer}>
// // // //             <Icon name="person-outline" size={20} color="#7e808c" style={styles.inputIcon} />
// // // //             <TextInput
// // // //               style={styles.input}
// // // //               placeholder="Full Name"
// // // //               placeholderTextColor="#7e808c"
// // // //               value={name}
// // // //               onChangeText={setName}
// // // //             />
// // // //           </View>

// // // //           {/* Email Input */}
// // // //           <View style={styles.inputContainer}>
// // // //             <Icon name="mail-outline" size={20} color="#7e808c" style={styles.inputIcon} />
// // // //             <TextInput
// // // //               style={styles.input}
// // // //               placeholder="Email Address"
// // // //               placeholderTextColor="#7e808c"
// // // //               value={email}
// // // //               onChangeText={setEmail}
// // // //               autoCapitalize="none"
// // // //               keyboardType="email-address"
// // // //             />
// // // //           </View>

// // // //           {/* Phone Input */}
// // // //           <View style={styles.inputContainer}>
// // // //             <Icon name="call-outline" size={20} color="#7e808c" style={styles.inputIcon} />
// // // //             <TextInput
// // // //               style={styles.input}
// // // //               placeholder="Phone Number"
// // // //               placeholderTextColor="#7e808c"
// // // //               value={phone}
// // // //               onChangeText={setPhone}
// // // //               keyboardType="phone-pad"
// // // //             />
// // // //           </View>

// // // //           {/* Password Input */}
// // // //           <View style={styles.inputContainer}>
// // // //             <Icon name="lock-closed-outline" size={20} color="#7e808c" style={styles.inputIcon} />
// // // //             <TextInput
// // // //               style={styles.input}
// // // //               placeholder="Password"
// // // //               placeholderTextColor="#7e808c"
// // // //               value={password}
// // // //               onChangeText={setPassword}
// // // //               secureTextEntry={!showPassword}
// // // //             />
// // // //             <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
// // // //               <Icon 
// // // //                 name={showPassword ? "eye-outline" : "eye-off-outline"} 
// // // //                 size={20} 
// // // //                 color="#7e808c" 
// // // //               />
// // // //             </TouchableOpacity>
// // // //           </View>

// // // //           {/* Confirm Password Input */}
// // // //           <View style={styles.inputContainer}>
// // // //             <Icon name="lock-closed-outline" size={20} color="#7e808c" style={styles.inputIcon} />
// // // //             <TextInput
// // // //               style={styles.input}
// // // //               placeholder="Confirm Password"
// // // //               placeholderTextColor="#7e808c"
// // // //               value={confirmPassword}
// // // //               onChangeText={setConfirmPassword}
// // // //               secureTextEntry={!showConfirmPassword}
// // // //             />
// // // //             <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
// // // //               <Icon 
// // // //                 name={showConfirmPassword ? "eye-outline" : "eye-off-outline"} 
// // // //                 size={20} 
// // // //                 color="#7e808c" 
// // // //               />
// // // //             </TouchableOpacity>
// // // //           </View>

// // // //           {/* Signup Button */}
// // // //           <TouchableOpacity
// // // //             style={[styles.button, loading && styles.buttonDisabled]}
// // // //             onPress={handleSignup}
// // // //             disabled={loading}
// // // //           >
// // // //             {loading ? (
// // // //               <ActivityIndicator color="#ffffff" size="small" />
// // // //             ) : (
// // // //               <Text style={styles.buttonText}>Sign Up</Text>
// // // //             )}
// // // //           </TouchableOpacity>

// // // //           {/* Footer */}
// // // //           <View style={styles.footer}>
// // // //             <Text style={styles.footerText}>Already have an account?</Text>
// // // //             <TouchableOpacity onPress={() => navigation.navigate('Login')}>
// // // //               <Text style={styles.footerLink}> Sign In</Text>
// // // //             </TouchableOpacity>
// // // //           </View>

// // // //           {/* Supabase Info */}
// // // //           <View style={styles.infoContainer}>
// // // //             <Icon name="cloud-outline" size={16} color="#6d6d78" />
// // // //             <Text style={styles.infoText}>Data stored in Supabase</Text>
// // // //           </View>
// // // //         </View>
// // // //       </ScrollView>
// // // //     </KeyboardAvoidingView>
// // // //   );
// // // // };

// // // // const styles = StyleSheet.create({
// // // //   container: {
// // // //     flex: 1,
// // // //     backgroundColor: '#ffffff',
// // // //   },
// // // //   scrollContent: {
// // // //     flexGrow: 1,
// // // //     justifyContent: 'center',
// // // //     padding: 20,
// // // //   },
// // // //   logoContainer: {
// // // //     marginBottom: 30,
// // // //     alignItems: 'center',
// // // //   },
// // // //   logoText: {
// // // //     fontSize: 32,
// // // //     fontWeight: '700',
// // // //     color: '#333333',
// // // //   },
// // // //   subtitle: {
// // // //     marginTop: 8,
// // // //     fontSize: 14,
// // // //     color: '#6d6d78',
// // // //   },
// // // //   subtitleSmall: {
// // // //     marginTop: 4,
// // // //     fontSize: 12,
// // // //     color: '#1e90ff',
// // // //     fontWeight: '500',
// // // //   },
// // // //   formContainer: {
// // // //     backgroundColor: '#f9f9fb',
// // // //     padding: 20,
// // // //     borderRadius: 16,
// // // //     shadowColor: '#000',
// // // //     shadowOpacity: 0.05,
// // // //     shadowRadius: 10,
// // // //     elevation: 4,
// // // //   },
// // // //   title: {
// // // //     fontSize: 26,
// // // //     fontWeight: '700',
// // // //     color: '#111111',
// // // //     marginBottom: 20,
// // // //   },
// // // //   inputContainer: {
// // // //     flexDirection: 'row',
// // // //     alignItems: 'center',
// // // //     backgroundColor: '#ffffff',
// // // //     borderRadius: 12,
// // // //     paddingHorizontal: 16,
// // // //     marginBottom: 16,
// // // //     borderWidth: 1,
// // // //     borderColor: '#e6e6e9',
// // // //   },
// // // //   inputIcon: {
// // // //     marginRight: 10,
// // // //   },
// // // //   input: {
// // // //     flex: 1,
// // // //     height: 48,
// // // //     fontSize: 16,
// // // //     color: '#111111',
// // // //   },
// // // //   button: {
// // // //     backgroundColor: '#1e90ff',
// // // //     borderRadius: 12,
// // // //     paddingVertical: 14,
// // // //     alignItems: 'center',
// // // //     marginTop: 10,
// // // //   },
// // // //   buttonDisabled: {
// // // //     backgroundColor: '#7e808c',
// // // //   },
// // // //   buttonText: {
// // // //     color: '#ffffff',
// // // //     fontSize: 16,
// // // //     fontWeight: '700',
// // // //   },
// // // //   footer: {
// // // //     flexDirection: 'row',
// // // //     justifyContent: 'center',
// // // //     marginTop: 20,
// // // //   },
// // // //   footerText: {
// // // //     color: '#6d6d78',
// // // //   },
// // // //   footerLink: {
// // // //     color: '#1e90ff',
// // // //     fontWeight: '700',
// // // //   },
// // // //   infoContainer: {
// // // //     flexDirection: 'row',
// // // //     alignItems: 'center',
// // // //     justifyContent: 'center',
// // // //     marginTop: 16,
// // // //     paddingTop: 16,
// // // //     borderTopWidth: 1,
// // // //     borderTopColor: '#e6e6e9',
// // // //   },
// // // //   infoText: {
// // // //     fontSize: 12,
// // // //     color: '#6d6d78',
// // // //     marginLeft: 6,
// // // //   },
// // // // });

// // // // export default SignupScreen;
// // // // delivery-app/src/screens/auth/SignupScreen.tsx
// // // import React, { useState, useContext } from 'react';
// // // import {
// // //   View,
// // //   Text,
// // //   TextInput,
// // //   TouchableOpacity,
// // //   StyleSheet,
// // //   KeyboardAvoidingView,
// // //   Platform,
// // //   ScrollView,
// // //   StatusBar,
// // //   Alert,
// // //   ActivityIndicator,
// // // } from 'react-native';
// // // import Icon from 'react-native-vector-icons/Ionicons';
// // // import { AuthContext } from '../../context/AuthContext';

// // // const SignupScreen: React.FC = ({ navigation }: any) => {
// // //   const [name, setName] = useState('');
// // //   const [email, setEmail] = useState('');
// // //   const [phone, setPhone] = useState('');
// // //   const [password, setPassword] = useState('');
// // //   const [confirmPassword, setConfirmPassword] = useState('');
// // //   const [loading, setLoading] = useState(false);
// // //   const [showPassword, setShowPassword] = useState(false);
// // //   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
// // //   const { signup } = useContext(AuthContext);

// // //   const handleSignup = async () => {
// // //     // Validation
// // //     if (!name.trim()) {
// // //       Alert.alert('Error', 'Please enter your name');
// // //       return;
// // //     }

// // //     if (!email.trim()) {
// // //       Alert.alert('Error', 'Please enter your email');
// // //       return;
// // //     }

// // //     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// // //     if (!emailRegex.test(email)) {
// // //       Alert.alert('Error', 'Please enter a valid email address');
// // //       return;
// // //     }

// // //     if (!phone.trim()) {
// // //       Alert.alert('Error', 'Please enter your phone number');
// // //       return;
// // //     }

// // //     if (!password) {
// // //       Alert.alert('Error', 'Please enter a password');
// // //       return;
// // //     }

// // //     if (password.length < 6) {
// // //       Alert.alert('Error', 'Password must be at least 6 characters');
// // //       return;
// // //     }

// // //     if (!confirmPassword) {
// // //       Alert.alert('Error', 'Please confirm your password');
// // //       return;
// // //     }

// // //     if (password !== confirmPassword) {
// // //       Alert.alert('Error', 'Passwords do not match');
// // //       return;
// // //     }

// // //     setLoading(true);

// // //     try {
// // //       const result = await signup({
// // //         name: name.trim(),
// // //         email: email.trim(),
// // //         phone: phone.trim(),
// // //         password,
// // //       });

// // //       if (result.success) {
// // //         // ✅ Show alert and STAY on Signup page (don't navigate)
// // //         Alert.alert(
// // //           '✅ Success',
// // //           'User created successfully! Please login to continue.',
// // //           [{ text: 'OK' }]  // ← No navigation, stays on Signup page
// // //         );
// // //         // Clear form fields after successful signup
// // //         setName('');
// // //         setEmail('');
// // //         setPhone('');
// // //         setPassword('');
// // //         setConfirmPassword('');
// // //       } else {
// // //         Alert.alert('❌ Error', result.message || 'Signup failed. Please try again.');
// // //       }
// // //     } catch (error: any) {
// // //       console.error('Signup error:', error);
// // //       Alert.alert('❌ Error', error.message || 'Something went wrong');
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   return (
// // //     <KeyboardAvoidingView
// // //       style={styles.container}
// // //       behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
// // //     >
// // //       <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
// // //       <ScrollView contentContainerStyle={styles.scrollContent}>
// // //         <View style={styles.logoContainer}>
// // //           <Text style={styles.logoText}>🍔 QuickBite</Text>
// // //           <Text style={styles.subtitle}>Create your account</Text>
// // //           <Text style={styles.subtitleSmall}>Data will be stored in Supabase</Text>
// // //         </View>

// // //         <View style={styles.formContainer}>
// // //           <Text style={styles.title}>Sign Up</Text>

// // //           {/* Name Input */}
// // //           <View style={styles.inputContainer}>
// // //             <Icon name="person-outline" size={20} color="#7e808c" style={styles.inputIcon} />
// // //             <TextInput
// // //               style={styles.input}
// // //               placeholder="Full Name"
// // //               placeholderTextColor="#7e808c"
// // //               value={name}
// // //               onChangeText={setName}
// // //             />
// // //           </View>

// // //           {/* Email Input */}
// // //           <View style={styles.inputContainer}>
// // //             <Icon name="mail-outline" size={20} color="#7e808c" style={styles.inputIcon} />
// // //             <TextInput
// // //               style={styles.input}
// // //               placeholder="Email Address"
// // //               placeholderTextColor="#7e808c"
// // //               value={email}
// // //               onChangeText={setEmail}
// // //               autoCapitalize="none"
// // //               keyboardType="email-address"
// // //             />
// // //           </View>

// // //           {/* Phone Input */}
// // //           <View style={styles.inputContainer}>
// // //             <Icon name="call-outline" size={20} color="#7e808c" style={styles.inputIcon} />
// // //             <TextInput
// // //               style={styles.input}
// // //               placeholder="Phone Number"
// // //               placeholderTextColor="#7e808c"
// // //               value={phone}
// // //               onChangeText={setPhone}
// // //               keyboardType="phone-pad"
// // //             />
// // //           </View>

// // //           {/* Password Input */}
// // //           <View style={styles.inputContainer}>
// // //             <Icon name="lock-closed-outline" size={20} color="#7e808c" style={styles.inputIcon} />
// // //             <TextInput
// // //               style={styles.input}
// // //               placeholder="Password"
// // //               placeholderTextColor="#7e808c"
// // //               value={password}
// // //               onChangeText={setPassword}
// // //               secureTextEntry={!showPassword}
// // //             />
// // //             <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
// // //               <Icon 
// // //                 name={showPassword ? "eye-outline" : "eye-off-outline"} 
// // //                 size={20} 
// // //                 color="#7e808c" 
// // //               />
// // //             </TouchableOpacity>
// // //           </View>

// // //           {/* Confirm Password Input */}
// // //           <View style={styles.inputContainer}>
// // //             <Icon name="lock-closed-outline" size={20} color="#7e808c" style={styles.inputIcon} />
// // //             <TextInput
// // //               style={styles.input}
// // //               placeholder="Confirm Password"
// // //               placeholderTextColor="#7e808c"
// // //               value={confirmPassword}
// // //               onChangeText={setConfirmPassword}
// // //               secureTextEntry={!showConfirmPassword}
// // //             />
// // //             <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
// // //               <Icon 
// // //                 name={showConfirmPassword ? "eye-outline" : "eye-off-outline"} 
// // //                 size={20} 
// // //                 color="#7e808c" 
// // //               />
// // //             </TouchableOpacity>
// // //           </View>

// // //           {/* Signup Button */}
// // //           <TouchableOpacity
// // //             style={[styles.button, loading && styles.buttonDisabled]}
// // //             onPress={handleSignup}
// // //             disabled={loading}
// // //           >
// // //             {loading ? (
// // //               <ActivityIndicator color="#ffffff" size="small" />
// // //             ) : (
// // //               <Text style={styles.buttonText}>Sign Up</Text>
// // //             )}
// // //           </TouchableOpacity>

// // //           {/* Footer - Clicking this navigates to Login */}
// // //           <View style={styles.footer}>
// // //             <Text style={styles.footerText}>Already have an account?</Text>
// // //             <TouchableOpacity onPress={() => navigation.navigate('Login')}>
// // //               <Text style={styles.footerLink}> Login</Text>
// // //             </TouchableOpacity>
// // //           </View>

// // //           {/* Supabase Info */}
// // //           <View style={styles.infoContainer}>
// // //             <Icon name="cloud-outline" size={16} color="#6d6d78" />
// // //             <Text style={styles.infoText}>Data stored in Supabase</Text>
// // //           </View>
// // //         </View>
// // //       </ScrollView>
// // //     </KeyboardAvoidingView>
// // //   );
// // // };

// // // const styles = StyleSheet.create({
// // //   container: {
// // //     flex: 1,
// // //     backgroundColor: '#ffffff',
// // //   },
// // //   scrollContent: {
// // //     flexGrow: 1,
// // //     justifyContent: 'center',
// // //     padding: 20,
// // //   },
// // //   logoContainer: {
// // //     marginBottom: 30,
// // //     alignItems: 'center',
// // //   },
// // //   logoText: {
// // //     fontSize: 32,
// // //     fontWeight: '700',
// // //     color: '#333333',
// // //   },
// // //   subtitle: {
// // //     marginTop: 8,
// // //     fontSize: 14,
// // //     color: '#6d6d78',
// // //   },
// // //   subtitleSmall: {
// // //     marginTop: 4,
// // //     fontSize: 12,
// // //     color: '#1e90ff',
// // //     fontWeight: '500',
// // //   },
// // //   formContainer: {
// // //     backgroundColor: '#f9f9fb',
// // //     padding: 20,
// // //     borderRadius: 16,
// // //     shadowColor: '#000',
// // //     shadowOpacity: 0.05,
// // //     shadowRadius: 10,
// // //     elevation: 4,
// // //   },
// // //   title: {
// // //     fontSize: 26,
// // //     fontWeight: '700',
// // //     color: '#111111',
// // //     marginBottom: 20,
// // //   },
// // //   inputContainer: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     backgroundColor: '#ffffff',
// // //     borderRadius: 12,
// // //     paddingHorizontal: 16,
// // //     marginBottom: 16,
// // //     borderWidth: 1,
// // //     borderColor: '#e6e6e9',
// // //   },
// // //   inputIcon: {
// // //     marginRight: 10,
// // //   },
// // //   input: {
// // //     flex: 1,
// // //     height: 48,
// // //     fontSize: 16,
// // //     color: '#111111',
// // //   },
// // //   button: {
// // //     backgroundColor: '#1e90ff',
// // //     borderRadius: 12,
// // //     paddingVertical: 14,
// // //     alignItems: 'center',
// // //     marginTop: 10,
// // //   },
// // //   buttonDisabled: {
// // //     backgroundColor: '#7e808c',
// // //   },
// // //   buttonText: {
// // //     color: '#ffffff',
// // //     fontSize: 16,
// // //     fontWeight: '700',
// // //   },
// // //   footer: {
// // //     flexDirection: 'row',
// // //     justifyContent: 'center',
// // //     marginTop: 20,
// // //   },
// // //   footerText: {
// // //     color: '#6d6d78',
// // //   },
// // //   footerLink: {
// // //     color: '#1e90ff',
// // //     fontWeight: '700',
// // //   },
// // //   infoContainer: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     justifyContent: 'center',
// // //     marginTop: 16,
// // //     paddingTop: 16,
// // //     borderTopWidth: 1,
// // //     borderTopColor: '#e6e6e9',
// // //   },
// // //   infoText: {
// // //     fontSize: 12,
// // //     color: '#6d6d78',
// // //     marginLeft: 6,
// // //   },
// // // });

// // // export default SignupScreen;

// // // delivery-app/src/screens/auth/SignupScreen.tsx
// // import React, { useState, useContext } from 'react';
// // import {
// //   View,
// //   Text,
// //   TextInput,
// //   TouchableOpacity,
// //   StyleSheet,
// //   KeyboardAvoidingView,
// //   Platform,
// //   ScrollView,
// //   StatusBar,
// //   Alert,
// //   ActivityIndicator,
// // } from 'react-native';
// // import Icon from 'react-native-vector-icons/Ionicons';
// // import { AuthContext } from '../../context/AuthContext';

// // const SignupScreen: React.FC = ({ navigation }: any) => {
// //   const [name, setName] = useState('');
// //   const [email, setEmail] = useState('');
// //   const [phone, setPhone] = useState('');
// //   const [password, setPassword] = useState('');
// //   const [confirmPassword, setConfirmPassword] = useState('');
// //   const [loading, setLoading] = useState(false);
// //   const [showPassword, setShowPassword] = useState(false);
// //   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
// //   const { signup } = useContext(AuthContext);

// //   const handleSignup = async () => {
// //     // Validation
// //     if (!name.trim()) {
// //       Alert.alert('Error', 'Please enter your name');
// //       return;
// //     }

// //     if (!email.trim()) {
// //       Alert.alert('Error', 'Please enter your email');
// //       return;
// //     }

// //     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// //     if (!emailRegex.test(email)) {
// //       Alert.alert('Error', 'Please enter a valid email address');
// //       return;
// //     }

// //     if (!phone.trim()) {
// //       Alert.alert('Error', 'Please enter your phone number');
// //       return;
// //     }

// //     if (!password) {
// //       Alert.alert('Error', 'Please enter a password');
// //       return;
// //     }

// //     if (password.length < 6) {
// //       Alert.alert('Error', 'Password must be at least 6 characters');
// //       return;
// //     }

// //     if (!confirmPassword) {
// //       Alert.alert('Error', 'Please confirm your password');
// //       return;
// //     }

// //     if (password !== confirmPassword) {
// //       Alert.alert('Error', 'Passwords do not match');
// //       return;
// //     }

// //     setLoading(true);

// //     try {
// //       const result = await signup({
// //         name: name.trim(),
// //         email: email.trim(),
// //         phone: phone.trim(),
// //         password,
// //       });

// //       if (result.success) {
// //         // ✅ Show alert and STAY on Signup page (no navigation)
// //         Alert.alert(
// //           '✅ Success',
// //           'User created successfully! Please login to continue.',
// //           [{ text: 'OK' }]  // ← No navigation, stays on Signup page
// //         );
// //         // Clear form fields after successful signup
// //         setName('');
// //         setEmail('');
// //         setPhone('');
// //         setPassword('');
// //         setConfirmPassword('');
// //       } else {
// //         Alert.alert('❌ Error', result.message || 'Signup failed. Please try again.');
// //       }
// //     } catch (error: any) {
// //       console.error('Signup error:', error);
// //       Alert.alert('❌ Error', error.message || 'Something went wrong');
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   return (
// //     <KeyboardAvoidingView
// //       style={styles.container}
// //       behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
// //     >
// //       <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
// //       <ScrollView contentContainerStyle={styles.scrollContent}>
// //         <View style={styles.logoContainer}>
// //           <Text style={styles.logoText}>🍔 QuickBite</Text>
// //           <Text style={styles.subtitle}>Create your account</Text>
// //           <Text style={styles.subtitleSmall}>Data will be stored in Supabase</Text>
// //         </View>

// //         <View style={styles.formContainer}>
// //           <Text style={styles.title}>Sign Up</Text>

// //           {/* Name Input */}
// //           <View style={styles.inputContainer}>
// //             <Icon name="person-outline" size={20} color="#7e808c" style={styles.inputIcon} />
// //             <TextInput
// //               style={styles.input}
// //               placeholder="Full Name"
// //               placeholderTextColor="#7e808c"
// //               value={name}
// //               onChangeText={setName}
// //             />
// //           </View>

// //           {/* Email Input */}
// //           <View style={styles.inputContainer}>
// //             <Icon name="mail-outline" size={20} color="#7e808c" style={styles.inputIcon} />
// //             <TextInput
// //               style={styles.input}
// //               placeholder="Email Address"
// //               placeholderTextColor="#7e808c"
// //               value={email}
// //               onChangeText={setEmail}
// //               autoCapitalize="none"
// //               keyboardType="email-address"
// //             />
// //           </View>

// //           {/* Phone Input */}
// //           <View style={styles.inputContainer}>
// //             <Icon name="call-outline" size={20} color="#7e808c" style={styles.inputIcon} />
// //             <TextInput
// //               style={styles.input}
// //               placeholder="Phone Number"
// //               placeholderTextColor="#7e808c"
// //               value={phone}
// //               onChangeText={setPhone}
// //               keyboardType="phone-pad"
// //             />
// //           </View>

// //           {/* Password Input */}
// //           <View style={styles.inputContainer}>
// //             <Icon name="lock-closed-outline" size={20} color="#7e808c" style={styles.inputIcon} />
// //             <TextInput
// //               style={styles.input}
// //               placeholder="Password"
// //               placeholderTextColor="#7e808c"
// //               value={password}
// //               onChangeText={setPassword}
// //               secureTextEntry={!showPassword}
// //             />
// //             <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
// //               <Icon 
// //                 name={showPassword ? "eye-outline" : "eye-off-outline"} 
// //                 size={20} 
// //                 color="#7e808c" 
// //               />
// //             </TouchableOpacity>
// //           </View>

// //           {/* Confirm Password Input */}
// //           <View style={styles.inputContainer}>
// //             <Icon name="lock-closed-outline" size={20} color="#7e808c" style={styles.inputIcon} />
// //             <TextInput
// //               style={styles.input}
// //               placeholder="Confirm Password"
// //               placeholderTextColor="#7e808c"
// //               value={confirmPassword}
// //               onChangeText={setConfirmPassword}
// //               secureTextEntry={!showConfirmPassword}
// //             />
// //             <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
// //               <Icon 
// //                 name={showConfirmPassword ? "eye-outline" : "eye-off-outline"} 
// //                 size={20} 
// //                 color="#7e808c" 
// //               />
// //             </TouchableOpacity>
// //           </View>

// //           {/* Signup Button */}
// //           <TouchableOpacity
// //             style={[styles.button, loading && styles.buttonDisabled]}
// //             onPress={handleSignup}
// //             disabled={loading}
// //           >
// //             {loading ? (
// //               <ActivityIndicator color="#ffffff" size="small" />
// //             ) : (
// //               <Text style={styles.buttonText}>Sign Up</Text>
// //             )}
// //           </TouchableOpacity>

// //           {/* Footer - Clicking this navigates to Login */}
// //           <View style={styles.footer}>
// //             <Text style={styles.footerText}>Already have an account?</Text>
// //             <TouchableOpacity onPress={() => navigation.navigate('Login')}>
// //               <Text style={styles.footerLink}> Login</Text>
// //             </TouchableOpacity>
// //           </View>

// //           {/* Supabase Info */}
// //           <View style={styles.infoContainer}>
// //             <Icon name="cloud-outline" size={16} color="#6d6d78" />
// //             <Text style={styles.infoText}>Data stored in Supabase</Text>
// //           </View>
// //         </View>
// //       </ScrollView>
// //     </KeyboardAvoidingView>
// //   );
// // };

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     backgroundColor: '#ffffff',
// //   },
// //   scrollContent: {
// //     flexGrow: 1,
// //     justifyContent: 'center',
// //     padding: 20,
// //   },
// //   logoContainer: {
// //     marginBottom: 30,
// //     alignItems: 'center',
// //   },
// //   logoText: {
// //     fontSize: 32,
// //     fontWeight: '700',
// //     color: '#333333',
// //   },
// //   subtitle: {
// //     marginTop: 8,
// //     fontSize: 14,
// //     color: '#6d6d78',
// //   },
// //   subtitleSmall: {
// //     marginTop: 4,
// //     fontSize: 12,
// //     color: '#1e90ff',
// //     fontWeight: '500',
// //   },
// //   formContainer: {
// //     backgroundColor: '#f9f9fb',
// //     padding: 20,
// //     borderRadius: 16,
// //     shadowColor: '#000',
// //     shadowOpacity: 0.05,
// //     shadowRadius: 10,
// //     elevation: 4,
// //   },
// //   title: {
// //     fontSize: 26,
// //     fontWeight: '700',
// //     color: '#111111',
// //     marginBottom: 20,
// //   },
// //   inputContainer: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     backgroundColor: '#ffffff',
// //     borderRadius: 12,
// //     paddingHorizontal: 16,
// //     marginBottom: 16,
// //     borderWidth: 1,
// //     borderColor: '#e6e6e9',
// //   },
// //   inputIcon: {
// //     marginRight: 10,
// //   },
// //   input: {
// //     flex: 1,
// //     height: 48,
// //     fontSize: 16,
// //     color: '#111111',
// //   },
// //   button: {
// //     backgroundColor: '#1e90ff',
// //     borderRadius: 12,
// //     paddingVertical: 14,
// //     alignItems: 'center',
// //     marginTop: 10,
// //   },
// //   buttonDisabled: {
// //     backgroundColor: '#7e808c',
// //   },
// //   buttonText: {
// //     color: '#ffffff',
// //     fontSize: 16,
// //     fontWeight: '700',
// //   },
// //   footer: {
// //     flexDirection: 'row',
// //     justifyContent: 'center',
// //     marginTop: 20,
// //   },
// //   footerText: {
// //     color: '#6d6d78',
// //   },
// //   footerLink: {
// //     color: '#1e90ff',
// //     fontWeight: '700',
// //   },
// //   infoContainer: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //     marginTop: 16,
// //     paddingTop: 16,
// //     borderTopWidth: 1,
// //     borderTopColor: '#e6e6e9',
// //   },
// //   infoText: {
// //     fontSize: 12,
// //     color: '#6d6d78',
// //     marginLeft: 6,
// //   },
// // });

// // export default SignupScreen;
// // delivery-app/src/screens/auth/SignupScreen.tsx
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

// const SignupScreen: React.FC = ({ navigation }: any) => {
//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [phone, setPhone] = useState('');
//   const [password, setPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const { signup } = useContext(AuthContext);

//   const handleSignup = async () => {
//     if (!name.trim()) {
//       Alert.alert('Error', 'Please enter your name');
//       return;
//     }

//     if (!email.trim()) {
//       Alert.alert('Error', 'Please enter your email');
//       return;
//     }

//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(email)) {
//       Alert.alert('Error', 'Please enter a valid email address');
//       return;
//     }

//     if (!phone.trim()) {
//       Alert.alert('Error', 'Please enter your phone number');
//       return;
//     }

//     if (!password) {
//       Alert.alert('Error', 'Please enter a password');
//       return;
//     }

//     if (password.length < 6) {
//       Alert.alert('Error', 'Password must be at least 6 characters');
//       return;
//     }

//     if (!confirmPassword) {
//       Alert.alert('Error', 'Please confirm your password');
//       return;
//     }

//     if (password !== confirmPassword) {
//       Alert.alert('Error', 'Passwords do not match');
//       return;
//     }

//     setLoading(true);

//     try {
//       const result = await signup({
//         name: name.trim(),
//         email: email.trim(),
//         phone: phone.trim(),
//         password,
//       });

//       // if (result.success) {
//       //   Alert.alert(
//       //     '✅ Success',
//       //     'User created successfully! Please login to continue.',
//       //     [{ text: 'OK' }]
//       //   );
//       //   setName('');
//       //   setEmail('');
//       //   setPhone('');
//       //   setPassword('');
//       //   setConfirmPassword('');
//       // } 
//       if (result.success) {
//   Alert.alert(
//     '✅ Success',
//     'User created successfully! Please login to continue.',
//     [
//       {
//         text: 'OK',
//         onPress: () => {
//           setName('');
//           setEmail('');
//           setPhone('');
//           setPassword('');
//           setConfirmPassword('');
//           navigation.navigate('Login'); // ✅ NEW: go to Login only when OK is tapped
//         },
//       },
//     ]
//   );
// }else {
//         Alert.alert('❌ Error', result.message || 'Signup failed. Please try again.');
//       }
//     } catch (error: any) {
//       console.error('Signup error:', error);
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
//           <Text style={styles.subtitle}>Create your account</Text>
//         </View>

//         <View style={styles.formContainer}>
//           <Text style={styles.title}>Sign Up</Text>

//           <View style={styles.inputContainer}>
//             <Icon name="person-outline" size={20} color="#7e808c" style={styles.inputIcon} />
//             <TextInput
//               style={styles.input}
//               placeholder="Full Name"
//               placeholderTextColor="#7e808c"
//               value={name}
//               onChangeText={setName}
//             />
//           </View>

//           <View style={styles.inputContainer}>
//             <Icon name="mail-outline" size={20} color="#7e808c" style={styles.inputIcon} />
//             <TextInput
//               style={styles.input}
//               placeholder="Email Address"
//               placeholderTextColor="#7e808c"
//               value={email}
//               onChangeText={setEmail}
//               autoCapitalize="none"
//               keyboardType="email-address"
//             />
//           </View>

//           <View style={styles.inputContainer}>
//             <Icon name="call-outline" size={20} color="#7e808c" style={styles.inputIcon} />
//             <TextInput
//               style={styles.input}
//               placeholder="Phone Number"
//               placeholderTextColor="#7e808c"
//               value={phone}
//               onChangeText={setPhone}
//               keyboardType="phone-pad"
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
//             />
//             <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
//               <Icon 
//                 name={showPassword ? "eye-outline" : "eye-off-outline"} 
//                 size={20} 
//                 color="#7e808c" 
//               />
//             </TouchableOpacity>
//           </View>

//           <View style={styles.inputContainer}>
//             <Icon name="lock-closed-outline" size={20} color="#7e808c" style={styles.inputIcon} />
//             <TextInput
//               style={styles.input}
//               placeholder="Confirm Password"
//               placeholderTextColor="#7e808c"
//               value={confirmPassword}
//               onChangeText={setConfirmPassword}
//               secureTextEntry={!showConfirmPassword}
//             />
//             <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
//               <Icon 
//                 name={showConfirmPassword ? "eye-outline" : "eye-off-outline"} 
//                 size={20} 
//                 color="#7e808c" 
//               />
//             </TouchableOpacity>
//           </View>

//           <TouchableOpacity
//             style={[styles.button, loading && styles.buttonDisabled]}
//             onPress={handleSignup}
//             disabled={loading}
//           >
//             {loading ? (
//               <ActivityIndicator color="#ffffff" size="small" />
//             ) : (
//               <Text style={styles.buttonText}>Sign Up</Text>
//             )}
//           </TouchableOpacity>

//           <View style={styles.footer}>
//             <Text style={styles.footerText}>Already have an account?</Text>
//             <TouchableOpacity onPress={() => navigation.navigate('Login')}>
//               <Text style={styles.footerLink}> Login</Text>
//             </TouchableOpacity>
//           </View>
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

// export default SignupScreen;
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

  const handleSignup = async () => {
    // Validation
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter your name');
      return;
    }

    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    if (!phone.trim()) {
      Alert.alert('Error', 'Please enter your phone number');
      return;
    }

    if (!password) {
      Alert.alert('Error', 'Please enter a password');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    if (!confirmPassword) {
      Alert.alert('Error', 'Please confirm your password');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
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
        // ✅ Clear form
        setName('');
        setEmail('');
        setPhone('');
        setPassword('');
        setConfirmPassword('');
        
        // ✅ Show success message and navigate to Login
        Alert.alert(
          '✅ Success',
          'Account created successfully! Please login to continue.',
          [
            {
              text: 'OK',
              onPress: () => {
                // ✅ Navigate to Login page (not Home)
                navigation.navigate('Login');
              },
            },
          ]
        );
      } else {
        Alert.alert('❌ Error', result.message || 'Signup failed. Please try again.');
      }
    } catch (error: any) {
      console.error('Signup error:', error);
      Alert.alert('❌ Error', error.message || 'Something went wrong');
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
          <Text style={styles.subtitle}>Create your account</Text>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.title}>Sign Up</Text>

          <View style={styles.inputContainer}>
            <Icon name="person-outline" size={20} color="#7e808c" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              placeholderTextColor="#7e808c"
              value={name}
              onChangeText={setName}
            />
          </View>

          <View style={styles.inputContainer}>
            <Icon name="mail-outline" size={20} color="#7e808c" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Email Address"
              placeholderTextColor="#7e808c"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          <View style={styles.inputContainer}>
            <Icon name="call-outline" size={20} color="#7e808c" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Phone Number"
              placeholderTextColor="#7e808c"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
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
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Icon 
                name={showPassword ? "eye-outline" : "eye-off-outline"} 
                size={20} 
                color="#7e808c" 
              />
            </TouchableOpacity>
          </View>

          <View style={styles.inputContainer}>
            <Icon name="lock-closed-outline" size={20} color="#7e808c" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              placeholderTextColor="#7e808c"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirmPassword}
            />
            <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
              <Icon 
                name={showConfirmPassword ? "eye-outline" : "eye-off-outline"} 
                size={20} 
                color="#7e808c" 
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleSignup}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#ffffff" size="small" />
            ) : (
              <Text style={styles.buttonText}>Sign Up</Text>
            )}
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.footerLink}> Login</Text>
            </TouchableOpacity>
          </View>
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
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e6e6e9',
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

export default SignupScreen;