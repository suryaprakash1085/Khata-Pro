// // // // // // // import React, { useState, useContext } from 'react';
// // // // // // // import {
// // // // // // //   View,
// // // // // // //   Text,
// // // // // // //   TextInput,
// // // // // // //   TouchableOpacity,
// // // // // // //   StyleSheet,
// // // // // // //   KeyboardAvoidingView,
// // // // // // //   Platform,
// // // // // // //   ScrollView,
// // // // // // //   StatusBar,
// // // // // // //   Alert,
// // // // // // // } from 'react-native';
// // // // // // // import Icon from 'react-native-vector-icons/Ionicons';
// // // // // // // import { AuthContext } from '../../context/AuthContext';

// // // // // // // const SignupScreen: React.FC = ({ navigation }: any) => {
// // // // // // //   const [name, setName] = useState('');
// // // // // // //   const [email, setEmail] = useState('');
// // // // // // //   const [phone, setPhone] = useState('');
// // // // // // //   const [password, setPassword] = useState('');
// // // // // // //   const [confirmPassword, setConfirmPassword] = useState('');
// // // // // // //   const [loading, setLoading] = useState(false);
// // // // // // //   const { signup } = useContext(AuthContext);

// // // // // // //   const handleSignup = async () => {
// // // // // // //     if (!name || !email || !phone || !password || !confirmPassword) {
// // // // // // //       Alert.alert('Error', 'Please fill all fields');
// // // // // // //       return;
// // // // // // //     }

// // // // // // //     if (password !== confirmPassword) {
// // // // // // //       Alert.alert('Error', 'Passwords do not match');
// // // // // // //       return;
// // // // // // //     }

// // // // // // //     if (password.length < 6) {
// // // // // // //       Alert.alert('Error', 'Password must be at least 6 characters');
// // // // // // //       return;
// // // // // // //     }

// // // // // // //     setLoading(true);
// // // // // // //     try {
// // // // // // //       const success = await signup({ name, email, phone, password });
// // // // // // //       if (!success) {
// // // // // // //         Alert.alert('Error', 'Signup failed. Please try again.');
// // // // // // //       }
// // // // // // //     } catch (error) {
// // // // // // //       Alert.alert('Error', 'Something went wrong');
// // // // // // //     } finally {
// // // // // // //       setLoading(false);
// // // // // // //     }
// // // // // // //   };

// // // // // // //   return (
// // // // // // //     <KeyboardAvoidingView
// // // // // // //       style={styles.container}
// // // // // // //       behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
// // // // // // //     >
// // // // // // //       <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
// // // // // // //       <ScrollView contentContainerStyle={styles.scrollContent}>
// // // // // // //         <View style={styles.logoContainer}>
// // // // // // //           <Text style={styles.logoText}>🍔 QuickBite</Text>
// // // // // // //           <Text style={styles.subtitle}>Create your account</Text>
// // // // // // //         </View>

// // // // // // //         <View style={styles.formContainer}>
// // // // // // //           <Text style={styles.title}>Sign Up</Text>

// // // // // // //           <View style={styles.inputContainer}>
// // // // // // //             <Icon name="person-outline" size={20} color="#7e808c" style={styles.inputIcon} />
// // // // // // //             <TextInput
// // // // // // //               style={styles.input}
// // // // // // //               placeholder="Name"
// // // // // // //               placeholderTextColor="#7e808c"
// // // // // // //               value={name}
// // // // // // //               onChangeText={setName}
// // // // // // //             />
// // // // // // //           </View>

// // // // // // //           <View style={styles.inputContainer}>
// // // // // // //             <Icon name="mail-outline" size={20} color="#7e808c" style={styles.inputIcon} />
// // // // // // //             <TextInput
// // // // // // //               style={styles.input}
// // // // // // //               placeholder="Email"
// // // // // // //               placeholderTextColor="#7e808c"
// // // // // // //               value={email}
// // // // // // //               onChangeText={setEmail}
// // // // // // //               autoCapitalize="none"
// // // // // // //               keyboardType="email-address"
// // // // // // //             />
// // // // // // //           </View>

// // // // // // //           <View style={styles.inputContainer}>
// // // // // // //             <Icon name="call-outline" size={20} color="#7e808c" style={styles.inputIcon} />
// // // // // // //             <TextInput
// // // // // // //               style={styles.input}
// // // // // // //               placeholder="Phone"
// // // // // // //               placeholderTextColor="#7e808c"
// // // // // // //               value={phone}
// // // // // // //               onChangeText={setPhone}
// // // // // // //               keyboardType="phone-pad"
// // // // // // //             />
// // // // // // //           </View>

// // // // // // //           <View style={styles.inputContainer}>
// // // // // // //             <Icon name="lock-closed-outline" size={20} color="#7e808c" style={styles.inputIcon} />
// // // // // // //             <TextInput
// // // // // // //               style={styles.input}
// // // // // // //               placeholder="Password"
// // // // // // //               placeholderTextColor="#7e808c"
// // // // // // //               value={password}
// // // // // // //               onChangeText={setPassword}
// // // // // // //               secureTextEntry
// // // // // // //             />
// // // // // // //           </View>

// // // // // // //           <View style={styles.inputContainer}>
// // // // // // //             <Icon name="lock-closed-outline" size={20} color="#7e808c" style={styles.inputIcon} />
// // // // // // //             <TextInput
// // // // // // //               style={styles.input}
// // // // // // //               placeholder="Confirm Password"
// // // // // // //               placeholderTextColor="#7e808c"
// // // // // // //               value={confirmPassword}
// // // // // // //               onChangeText={setConfirmPassword}
// // // // // // //               secureTextEntry
// // // // // // //             />
// // // // // // //           </View>

// // // // // // //           <TouchableOpacity style={styles.button} onPress={handleSignup} disabled={loading}>
// // // // // // //             <Text style={styles.buttonText}>{loading ? 'Signing up...' : 'Sign Up'}</Text>
// // // // // // //           </TouchableOpacity>

// // // // // // //           <View style={styles.footer}>
// // // // // // //             <Text style={styles.footerText}>Already have an account?</Text>
// // // // // // //             <TouchableOpacity onPress={() => navigation.navigate('Login')}>
// // // // // // //               <Text style={styles.footerLink}> Sign In</Text>
// // // // // // //             </TouchableOpacity>
// // // // // // //           </View>
// // // // // // //         </View>
// // // // // // //       </ScrollView>
// // // // // // //     </KeyboardAvoidingView>
// // // // // // //   );
// // // // // // // };

// // // // // // // const styles = StyleSheet.create({
// // // // // // //   container: {
// // // // // // //     flex: 1,
// // // // // // //     backgroundColor: '#ffffff',
// // // // // // //   },
// // // // // // //   scrollContent: {
// // // // // // //     flexGrow: 1,
// // // // // // //     justifyContent: 'center',
// // // // // // //     padding: 20,
// // // // // // //   },
// // // // // // //   logoContainer: {
// // // // // // //     marginBottom: 40,
// // // // // // //     alignItems: 'center',
// // // // // // //   },
// // // // // // //   logoText: {
// // // // // // //     fontSize: 32,
// // // // // // //     fontWeight: '700',
// // // // // // //     color: '#333333',
// // // // // // //   },
// // // // // // //   subtitle: {
// // // // // // //     marginTop: 8,
// // // // // // //     fontSize: 14,
// // // // // // //     color: '#6d6d78',
// // // // // // //   },
// // // // // // //   formContainer: {
// // // // // // //     backgroundColor: '#f9f9fb',
// // // // // // //     padding: 20,
// // // // // // //     borderRadius: 16,
// // // // // // //     shadowColor: '#000',
// // // // // // //     shadowOpacity: 0.05,
// // // // // // //     shadowRadius: 10,
// // // // // // //     elevation: 4,
// // // // // // //   },
// // // // // // //   title: {
// // // // // // //     fontSize: 26,
// // // // // // //     fontWeight: '700',
// // // // // // //     color: '#111111',
// // // // // // //     marginBottom: 10,
// // // // // // //   },
// // // // // // //   inputContainer: {
// // // // // // //     flexDirection: 'row',
// // // // // // //     alignItems: 'center',
// // // // // // //     backgroundColor: '#ffffff',
// // // // // // //     borderRadius: 12,
// // // // // // //     paddingHorizontal: 16,
// // // // // // //     marginBottom: 16,
// // // // // // //     borderWidth: 1,
// // // // // // //     borderColor: '#e6e6e9',
// // // // // // //   },
// // // // // // //   inputIcon: {
// // // // // // //     marginRight: 10,
// // // // // // //   },
// // // // // // //   input: {
// // // // // // //     flex: 1,
// // // // // // //     height: 48,
// // // // // // //     fontSize: 16,
// // // // // // //     color: '#111111',
// // // // // // //   },
// // // // // // //   button: {
// // // // // // //     backgroundColor: '#1e90ff',
// // // // // // //     borderRadius: 12,
// // // // // // //     paddingVertical: 14,
// // // // // // //     alignItems: 'center',
// // // // // // //     marginTop: 10,
// // // // // // //   },
// // // // // // //   buttonText: {
// // // // // // //     color: '#ffffff',
// // // // // // //     fontSize: 16,
// // // // // // //     fontWeight: '700',
// // // // // // //   },
// // // // // // //   footer: {
// // // // // // //     flexDirection: 'row',
// // // // // // //     justifyContent: 'center',
// // // // // // //     marginTop: 20,
// // // // // // //   },
// // // // // // //   footerText: {
// // // // // // //     color: '#6d6d78',
// // // // // // //   },
// // // // // // //   footerLink: {
// // // // // // //     color: '#1e90ff',
// // // // // // //     fontWeight: '700',
// // // // // // //   },
// // // // // // // });

// // // // // // // export default SignupScreen;
// // // // // // // delivery-app/src/screens/auth/SignupScreen.tsx
// // // // // // import React, { useState, useContext } from 'react';
// // // // // // import {
// // // // // //   View,
// // // // // //   Text,
// // // // // //   TextInput,
// // // // // //   TouchableOpacity,
// // // // // //   StyleSheet,
// // // // // //   KeyboardAvoidingView,
// // // // // //   Platform,
// // // // // //   ScrollView,
// // // // // //   StatusBar,
// // // // // //   Alert,
// // // // // //   ActivityIndicator,
// // // // // // } from 'react-native';
// // // // // // import Icon from 'react-native-vector-icons/Ionicons';
// // // // // // import { AuthContext } from '../../context/AuthContext';

// // // // // // const SignupScreen: React.FC = ({ navigation }: any) => {
// // // // // //   const [name, setName] = useState('');
// // // // // //   const [email, setEmail] = useState('');
// // // // // //   const [phone, setPhone] = useState('');
// // // // // //   const [password, setPassword] = useState('');
// // // // // //   const [confirmPassword, setConfirmPassword] = useState('');
// // // // // //   const [loading, setLoading] = useState(false);
// // // // // //   const [showPassword, setShowPassword] = useState(false);
// // // // // //   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
// // // // // //   const { signup } = useContext(AuthContext);

// // // // // //   const handleSignup = async () => {
// // // // // //     // Validation
// // // // // //     if (!name.trim()) {
// // // // // //       Alert.alert('Error', 'Please enter your name');
// // // // // //       return;
// // // // // //     }

// // // // // //     if (!email.trim()) {
// // // // // //       Alert.alert('Error', 'Please enter your email');
// // // // // //       return;
// // // // // //     }

// // // // // //     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// // // // // //     if (!emailRegex.test(email)) {
// // // // // //       Alert.alert('Error', 'Please enter a valid email address');
// // // // // //       return;
// // // // // //     }

// // // // // //     if (!phone.trim()) {
// // // // // //       Alert.alert('Error', 'Please enter your phone number');
// // // // // //       return;
// // // // // //     }

// // // // // //     if (!password) {
// // // // // //       Alert.alert('Error', 'Please enter a password');
// // // // // //       return;
// // // // // //     }

// // // // // //     if (password.length < 6) {
// // // // // //       Alert.alert('Error', 'Password must be at least 6 characters');
// // // // // //       return;
// // // // // //     }

// // // // // //     if (!confirmPassword) {
// // // // // //       Alert.alert('Error', 'Please confirm your password');
// // // // // //       return;
// // // // // //     }

// // // // // //     if (password !== confirmPassword) {
// // // // // //       Alert.alert('Error', 'Passwords do not match');
// // // // // //       return;
// // // // // //     }

// // // // // //     setLoading(true);

// // // // // //     try {
// // // // // //       const result = await signup({
// // // // // //         name: name.trim(),
// // // // // //         email: email.trim(),
// // // // // //         phone: phone.trim(),
// // // // // //         password,
// // // // // //       });

// // // // // //       if (result.success) {
// // // // // //         // ✅ FIXED: Navigate to Login screen, NOT Home
// // // // // //         Alert.alert(
// // // // // //           '✅ Success',
// // // // // //           'Account created successfully! Please login to continue.',
// // // // // //           [{ 
// // // // // //             text: 'OK', 
// // // // // //             onPress: () => {
// // // // // //               // Navigate to Login screen (not Home)
// // // // // //               navigation.navigate('Login');
// // // // // //             }
// // // // // //           }]
// // // // // //         );
// // // // // //       } else {
// // // // // //         Alert.alert('❌ Error', result.message || 'Signup failed. Please try again.');
// // // // // //       }
// // // // // //     } catch (error: any) {
// // // // // //       console.error('Signup error:', error);
// // // // // //       Alert.alert('❌ Error', error.message || 'Something went wrong');
// // // // // //     } finally {
// // // // // //       setLoading(false);
// // // // // //     }
// // // // // //   };

// // // // // //   return (
// // // // // //     <KeyboardAvoidingView
// // // // // //       style={styles.container}
// // // // // //       behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
// // // // // //     >
// // // // // //       <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
// // // // // //       <ScrollView contentContainerStyle={styles.scrollContent}>
// // // // // //         <View style={styles.logoContainer}>
// // // // // //           <Text style={styles.logoText}>🍔 QuickBite</Text>
// // // // // //           <Text style={styles.subtitle}>Create your account</Text>
// // // // // //           <Text style={styles.subtitleSmall}>Data will be stored in Supabase</Text>
// // // // // //         </View>

// // // // // //         <View style={styles.formContainer}>
// // // // // //           <Text style={styles.title}>Sign Up</Text>

// // // // // //           {/* Name Input */}
// // // // // //           <View style={styles.inputContainer}>
// // // // // //             <Icon name="person-outline" size={20} color="#7e808c" style={styles.inputIcon} />
// // // // // //             <TextInput
// // // // // //               style={styles.input}
// // // // // //               placeholder="Full Name"
// // // // // //               placeholderTextColor="#7e808c"
// // // // // //               value={name}
// // // // // //               onChangeText={setName}
// // // // // //             />
// // // // // //           </View>

// // // // // //           {/* Email Input */}
// // // // // //           <View style={styles.inputContainer}>
// // // // // //             <Icon name="mail-outline" size={20} color="#7e808c" style={styles.inputIcon} />
// // // // // //             <TextInput
// // // // // //               style={styles.input}
// // // // // //               placeholder="Email Address"
// // // // // //               placeholderTextColor="#7e808c"
// // // // // //               value={email}
// // // // // //               onChangeText={setEmail}
// // // // // //               autoCapitalize="none"
// // // // // //               keyboardType="email-address"
// // // // // //             />
// // // // // //           </View>

// // // // // //           {/* Phone Input */}
// // // // // //           <View style={styles.inputContainer}>
// // // // // //             <Icon name="call-outline" size={20} color="#7e808c" style={styles.inputIcon} />
// // // // // //             <TextInput
// // // // // //               style={styles.input}
// // // // // //               placeholder="Phone Number"
// // // // // //               placeholderTextColor="#7e808c"
// // // // // //               value={phone}
// // // // // //               onChangeText={setPhone}
// // // // // //               keyboardType="phone-pad"
// // // // // //             />
// // // // // //           </View>

// // // // // //           {/* Password Input */}
// // // // // //           <View style={styles.inputContainer}>
// // // // // //             <Icon name="lock-closed-outline" size={20} color="#7e808c" style={styles.inputIcon} />
// // // // // //             <TextInput
// // // // // //               style={styles.input}
// // // // // //               placeholder="Password"
// // // // // //               placeholderTextColor="#7e808c"
// // // // // //               value={password}
// // // // // //               onChangeText={setPassword}
// // // // // //               secureTextEntry={!showPassword}
// // // // // //             />
// // // // // //             <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
// // // // // //               <Icon 
// // // // // //                 name={showPassword ? "eye-outline" : "eye-off-outline"} 
// // // // // //                 size={20} 
// // // // // //                 color="#7e808c" 
// // // // // //               />
// // // // // //             </TouchableOpacity>
// // // // // //           </View>

// // // // // //           {/* Confirm Password Input */}
// // // // // //           <View style={styles.inputContainer}>
// // // // // //             <Icon name="lock-closed-outline" size={20} color="#7e808c" style={styles.inputIcon} />
// // // // // //             <TextInput
// // // // // //               style={styles.input}
// // // // // //               placeholder="Confirm Password"
// // // // // //               placeholderTextColor="#7e808c"
// // // // // //               value={confirmPassword}
// // // // // //               onChangeText={setConfirmPassword}
// // // // // //               secureTextEntry={!showConfirmPassword}
// // // // // //             />
// // // // // //             <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
// // // // // //               <Icon 
// // // // // //                 name={showConfirmPassword ? "eye-outline" : "eye-off-outline"} 
// // // // // //                 size={20} 
// // // // // //                 color="#7e808c" 
// // // // // //               />
// // // // // //             </TouchableOpacity>
// // // // // //           </View>

// // // // // //           {/* Signup Button */}
// // // // // //           <TouchableOpacity
// // // // // //             style={[styles.button, loading && styles.buttonDisabled]}
// // // // // //             onPress={handleSignup}
// // // // // //             disabled={loading}
// // // // // //           >
// // // // // //             {loading ? (
// // // // // //               <ActivityIndicator color="#ffffff" size="small" />
// // // // // //             ) : (
// // // // // //               <Text style={styles.buttonText}>Sign Up</Text>
// // // // // //             )}
// // // // // //           </TouchableOpacity>

// // // // // //           {/* Footer */}
// // // // // //           <View style={styles.footer}>
// // // // // //             <Text style={styles.footerText}>Already have an account?</Text>
// // // // // //             <TouchableOpacity onPress={() => navigation.navigate('Login')}>
// // // // // //               <Text style={styles.footerLink}> Sign In</Text>
// // // // // //             </TouchableOpacity>
// // // // // //           </View>

// // // // // //           {/* Supabase Info */}
// // // // // //           <View style={styles.infoContainer}>
// // // // // //             <Icon name="cloud-outline" size={16} color="#6d6d78" />
// // // // // //             <Text style={styles.infoText}>Data stored in Supabase</Text>
// // // // // //           </View>
// // // // // //         </View>
// // // // // //       </ScrollView>
// // // // // //     </KeyboardAvoidingView>
// // // // // //   );
// // // // // // };

// // // // // // const styles = StyleSheet.create({
// // // // // //   container: {
// // // // // //     flex: 1,
// // // // // //     backgroundColor: '#ffffff',
// // // // // //   },
// // // // // //   scrollContent: {
// // // // // //     flexGrow: 1,
// // // // // //     justifyContent: 'center',
// // // // // //     padding: 20,
// // // // // //   },
// // // // // //   logoContainer: {
// // // // // //     marginBottom: 30,
// // // // // //     alignItems: 'center',
// // // // // //   },
// // // // // //   logoText: {
// // // // // //     fontSize: 32,
// // // // // //     fontWeight: '700',
// // // // // //     color: '#333333',
// // // // // //   },
// // // // // //   subtitle: {
// // // // // //     marginTop: 8,
// // // // // //     fontSize: 14,
// // // // // //     color: '#6d6d78',
// // // // // //   },
// // // // // //   subtitleSmall: {
// // // // // //     marginTop: 4,
// // // // // //     fontSize: 12,
// // // // // //     color: '#1e90ff',
// // // // // //     fontWeight: '500',
// // // // // //   },
// // // // // //   formContainer: {
// // // // // //     backgroundColor: '#f9f9fb',
// // // // // //     padding: 20,
// // // // // //     borderRadius: 16,
// // // // // //     shadowColor: '#000',
// // // // // //     shadowOpacity: 0.05,
// // // // // //     shadowRadius: 10,
// // // // // //     elevation: 4,
// // // // // //   },
// // // // // //   title: {
// // // // // //     fontSize: 26,
// // // // // //     fontWeight: '700',
// // // // // //     color: '#111111',
// // // // // //     marginBottom: 20,
// // // // // //   },
// // // // // //   inputContainer: {
// // // // // //     flexDirection: 'row',
// // // // // //     alignItems: 'center',
// // // // // //     backgroundColor: '#ffffff',
// // // // // //     borderRadius: 12,
// // // // // //     paddingHorizontal: 16,
// // // // // //     marginBottom: 16,
// // // // // //     borderWidth: 1,
// // // // // //     borderColor: '#e6e6e9',
// // // // // //   },
// // // // // //   inputIcon: {
// // // // // //     marginRight: 10,
// // // // // //   },
// // // // // //   input: {
// // // // // //     flex: 1,
// // // // // //     height: 48,
// // // // // //     fontSize: 16,
// // // // // //     color: '#111111',
// // // // // //   },
// // // // // //   button: {
// // // // // //     backgroundColor: '#1e90ff',
// // // // // //     borderRadius: 12,
// // // // // //     paddingVertical: 14,
// // // // // //     alignItems: 'center',
// // // // // //     marginTop: 10,
// // // // // //   },
// // // // // //   buttonDisabled: {
// // // // // //     backgroundColor: '#7e808c',
// // // // // //   },
// // // // // //   buttonText: {
// // // // // //     color: '#ffffff',
// // // // // //     fontSize: 16,
// // // // // //     fontWeight: '700',
// // // // // //   },
// // // // // //   footer: {
// // // // // //     flexDirection: 'row',
// // // // // //     justifyContent: 'center',
// // // // // //     marginTop: 20,
// // // // // //   },
// // // // // //   footerText: {
// // // // // //     color: '#6d6d78',
// // // // // //   },
// // // // // //   footerLink: {
// // // // // //     color: '#1e90ff',
// // // // // //     fontWeight: '700',
// // // // // //   },
// // // // // //   infoContainer: {
// // // // // //     flexDirection: 'row',
// // // // // //     alignItems: 'center',
// // // // // //     justifyContent: 'center',
// // // // // //     marginTop: 16,
// // // // // //     paddingTop: 16,
// // // // // //     borderTopWidth: 1,
// // // // // //     borderTopColor: '#e6e6e9',
// // // // // //   },
// // // // // //   infoText: {
// // // // // //     fontSize: 12,
// // // // // //     color: '#6d6d78',
// // // // // //     marginLeft: 6,
// // // // // //   },
// // // // // // });

// // // // // // export default SignupScreen;
// // // // // // delivery-app/src/screens/auth/SignupScreen.tsx
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
// // // // //   ActivityIndicator,
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
// // // // //   const [showPassword, setShowPassword] = useState(false);
// // // // //   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
// // // // //   const { signup } = useContext(AuthContext);

// // // // //   const handleSignup = async () => {
// // // // //     // Validation
// // // // //     if (!name.trim()) {
// // // // //       Alert.alert('Error', 'Please enter your name');
// // // // //       return;
// // // // //     }

// // // // //     if (!email.trim()) {
// // // // //       Alert.alert('Error', 'Please enter your email');
// // // // //       return;
// // // // //     }

// // // // //     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// // // // //     if (!emailRegex.test(email)) {
// // // // //       Alert.alert('Error', 'Please enter a valid email address');
// // // // //       return;
// // // // //     }

// // // // //     if (!phone.trim()) {
// // // // //       Alert.alert('Error', 'Please enter your phone number');
// // // // //       return;
// // // // //     }

// // // // //     if (!password) {
// // // // //       Alert.alert('Error', 'Please enter a password');
// // // // //       return;
// // // // //     }

// // // // //     if (password.length < 6) {
// // // // //       Alert.alert('Error', 'Password must be at least 6 characters');
// // // // //       return;
// // // // //     }

// // // // //     if (!confirmPassword) {
// // // // //       Alert.alert('Error', 'Please confirm your password');
// // // // //       return;
// // // // //     }

// // // // //     if (password !== confirmPassword) {
// // // // //       Alert.alert('Error', 'Passwords do not match');
// // // // //       return;
// // // // //     }

// // // // //     setLoading(true);

// // // // //     try {
// // // // //       const result = await signup({
// // // // //         name: name.trim(),
// // // // //         email: email.trim(),
// // // // //         phone: phone.trim(),
// // // // //         password,
// // // // //       });

// // // // //       if (result.success) {
// // // // //         // ✅ Show alert and STAY on Signup page (don't navigate)
// // // // //         Alert.alert(
// // // // //           '✅ Success',
// // // // //           'User created successfully! Please login to continue.',
// // // // //           [{ text: 'OK' }]  // ← No navigation, stays on Signup page
// // // // //         );
// // // // //         // Clear form fields after successful signup
// // // // //         setName('');
// // // // //         setEmail('');
// // // // //         setPhone('');
// // // // //         setPassword('');
// // // // //         setConfirmPassword('');
// // // // //       } else {
// // // // //         Alert.alert('❌ Error', result.message || 'Signup failed. Please try again.');
// // // // //       }
// // // // //     } catch (error: any) {
// // // // //       console.error('Signup error:', error);
// // // // //       Alert.alert('❌ Error', error.message || 'Something went wrong');
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
// // // // //           <Text style={styles.subtitleSmall}>Data will be stored in Supabase</Text>
// // // // //         </View>

// // // // //         <View style={styles.formContainer}>
// // // // //           <Text style={styles.title}>Sign Up</Text>

// // // // //           {/* Name Input */}
// // // // //           <View style={styles.inputContainer}>
// // // // //             <Icon name="person-outline" size={20} color="#7e808c" style={styles.inputIcon} />
// // // // //             <TextInput
// // // // //               style={styles.input}
// // // // //               placeholder="Full Name"
// // // // //               placeholderTextColor="#7e808c"
// // // // //               value={name}
// // // // //               onChangeText={setName}
// // // // //             />
// // // // //           </View>

// // // // //           {/* Email Input */}
// // // // //           <View style={styles.inputContainer}>
// // // // //             <Icon name="mail-outline" size={20} color="#7e808c" style={styles.inputIcon} />
// // // // //             <TextInput
// // // // //               style={styles.input}
// // // // //               placeholder="Email Address"
// // // // //               placeholderTextColor="#7e808c"
// // // // //               value={email}
// // // // //               onChangeText={setEmail}
// // // // //               autoCapitalize="none"
// // // // //               keyboardType="email-address"
// // // // //             />
// // // // //           </View>

// // // // //           {/* Phone Input */}
// // // // //           <View style={styles.inputContainer}>
// // // // //             <Icon name="call-outline" size={20} color="#7e808c" style={styles.inputIcon} />
// // // // //             <TextInput
// // // // //               style={styles.input}
// // // // //               placeholder="Phone Number"
// // // // //               placeholderTextColor="#7e808c"
// // // // //               value={phone}
// // // // //               onChangeText={setPhone}
// // // // //               keyboardType="phone-pad"
// // // // //             />
// // // // //           </View>

// // // // //           {/* Password Input */}
// // // // //           <View style={styles.inputContainer}>
// // // // //             <Icon name="lock-closed-outline" size={20} color="#7e808c" style={styles.inputIcon} />
// // // // //             <TextInput
// // // // //               style={styles.input}
// // // // //               placeholder="Password"
// // // // //               placeholderTextColor="#7e808c"
// // // // //               value={password}
// // // // //               onChangeText={setPassword}
// // // // //               secureTextEntry={!showPassword}
// // // // //             />
// // // // //             <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
// // // // //               <Icon 
// // // // //                 name={showPassword ? "eye-outline" : "eye-off-outline"} 
// // // // //                 size={20} 
// // // // //                 color="#7e808c" 
// // // // //               />
// // // // //             </TouchableOpacity>
// // // // //           </View>

// // // // //           {/* Confirm Password Input */}
// // // // //           <View style={styles.inputContainer}>
// // // // //             <Icon name="lock-closed-outline" size={20} color="#7e808c" style={styles.inputIcon} />
// // // // //             <TextInput
// // // // //               style={styles.input}
// // // // //               placeholder="Confirm Password"
// // // // //               placeholderTextColor="#7e808c"
// // // // //               value={confirmPassword}
// // // // //               onChangeText={setConfirmPassword}
// // // // //               secureTextEntry={!showConfirmPassword}
// // // // //             />
// // // // //             <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
// // // // //               <Icon 
// // // // //                 name={showConfirmPassword ? "eye-outline" : "eye-off-outline"} 
// // // // //                 size={20} 
// // // // //                 color="#7e808c" 
// // // // //               />
// // // // //             </TouchableOpacity>
// // // // //           </View>

// // // // //           {/* Signup Button */}
// // // // //           <TouchableOpacity
// // // // //             style={[styles.button, loading && styles.buttonDisabled]}
// // // // //             onPress={handleSignup}
// // // // //             disabled={loading}
// // // // //           >
// // // // //             {loading ? (
// // // // //               <ActivityIndicator color="#ffffff" size="small" />
// // // // //             ) : (
// // // // //               <Text style={styles.buttonText}>Sign Up</Text>
// // // // //             )}
// // // // //           </TouchableOpacity>

// // // // //           {/* Footer - Clicking this navigates to Login */}
// // // // //           <View style={styles.footer}>
// // // // //             <Text style={styles.footerText}>Already have an account?</Text>
// // // // //             <TouchableOpacity onPress={() => navigation.navigate('Login')}>
// // // // //               <Text style={styles.footerLink}> Login</Text>
// // // // //             </TouchableOpacity>
// // // // //           </View>

// // // // //           {/* Supabase Info */}
// // // // //           <View style={styles.infoContainer}>
// // // // //             <Icon name="cloud-outline" size={16} color="#6d6d78" />
// // // // //             <Text style={styles.infoText}>Data stored in Supabase</Text>
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
// // // // //     marginBottom: 30,
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
// // // // //   subtitleSmall: {
// // // // //     marginTop: 4,
// // // // //     fontSize: 12,
// // // // //     color: '#1e90ff',
// // // // //     fontWeight: '500',
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
// // // // //     marginBottom: 20,
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
// // // // //   buttonDisabled: {
// // // // //     backgroundColor: '#7e808c',
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
// // // // //   infoContainer: {
// // // // //     flexDirection: 'row',
// // // // //     alignItems: 'center',
// // // // //     justifyContent: 'center',
// // // // //     marginTop: 16,
// // // // //     paddingTop: 16,
// // // // //     borderTopWidth: 1,
// // // // //     borderTopColor: '#e6e6e9',
// // // // //   },
// // // // //   infoText: {
// // // // //     fontSize: 12,
// // // // //     color: '#6d6d78',
// // // // //     marginLeft: 6,
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
// // // //         // ✅ Show alert and STAY on Signup page (no navigation)
// // // //         Alert.alert(
// // // //           '✅ Success',
// // // //           'User created successfully! Please login to continue.',
// // // //           [{ text: 'OK' }]  // ← No navigation, stays on Signup page
// // // //         );
// // // //         // Clear form fields after successful signup
// // // //         setName('');
// // // //         setEmail('');
// // // //         setPhone('');
// // // //         setPassword('');
// // // //         setConfirmPassword('');
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

// // // //           {/* Footer - Clicking this navigates to Login */}
// // // //           <View style={styles.footer}>
// // // //             <Text style={styles.footerText}>Already have an account?</Text>
// // // //             <TouchableOpacity onPress={() => navigation.navigate('Login')}>
// // // //               <Text style={styles.footerLink}> Login</Text>
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

// // //       // if (result.success) {
// // //       //   Alert.alert(
// // //       //     '✅ Success',
// // //       //     'User created successfully! Please login to continue.',
// // //       //     [{ text: 'OK' }]
// // //       //   );
// // //       //   setName('');
// // //       //   setEmail('');
// // //       //   setPhone('');
// // //       //   setPassword('');
// // //       //   setConfirmPassword('');
// // //       // } 
// // //       if (result.success) {
// // //   Alert.alert(
// // //     '✅ Success',
// // //     'User created successfully! Please login to continue.',
// // //     [
// // //       {
// // //         text: 'OK',
// // //         onPress: () => {
// // //           setName('');
// // //           setEmail('');
// // //           setPhone('');
// // //           setPassword('');
// // //           setConfirmPassword('');
// // //           navigation.navigate('Login'); // ✅ NEW: go to Login only when OK is tapped
// // //         },
// // //       },
// // //     ]
// // //   );
// // // }else {
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
// // //         </View>

// // //         <View style={styles.formContainer}>
// // //           <Text style={styles.title}>Sign Up</Text>

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

// // //           <View style={styles.footer}>
// // //             <Text style={styles.footerText}>Already have an account?</Text>
// // //             <TouchableOpacity onPress={() => navigation.navigate('Login')}>
// // //               <Text style={styles.footerLink}> Login</Text>
// // //             </TouchableOpacity>
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
// // //     marginBottom: 40,
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
// // //     marginBottom: 10,
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
// // // });

// // // export default SignupScreen;
// // import React, { useState, useContext } from 'react';
// // import {
// //   View,
// //   Text,
// //   TextInput,
// //   TouchableOpacity,
// //   Alert,
// //   ActivityIndicator,
// //   KeyboardAvoidingView,
// //   ScrollView,
// //   StatusBar,
// //   StyleSheet,
// //   Platform,
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
// //         // ✅ Clear form
// //         setName('');
// //         setEmail('');
// //         setPhone('');
// //         setPassword('');
// //         setConfirmPassword('');
        
// //         // ✅ Show success message and navigate to Login
// //         Alert.alert(
// //           '✅ Success',
// //           'Account created successfully! Please login to continue.',
// //           [
// //             {
// //               text: 'OK',
// //               onPress: () => {
// //                 // ✅ Navigate to Login page (not Home)
// //                 navigation.navigate('Login');
// //               },
// //             },
// //           ]
// //         );
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
// //         </View>

// //         <View style={styles.formContainer}>
// //           <Text style={styles.title}>Sign Up</Text>

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

// //           <View style={styles.footer}>
// //             <Text style={styles.footerText}>Already have an account?</Text>
// //             <TouchableOpacity onPress={() => navigation.navigate('Login')}>
// //               <Text style={styles.footerLink}> Login</Text>
// //             </TouchableOpacity>
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
// //     marginBottom: 40,
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
// //     marginBottom: 10,
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
// // });

// // export default SignupScreen;
// // delivery-app/src/screens/auth/SignupScreen.tsx
// import React, { useState, useContext } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   Alert,
//   ActivityIndicator,
//   KeyboardAvoidingView,
//   ScrollView,
//   StatusBar,
//   StyleSheet,
//   Platform,
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

//   // Error states
//   const [nameError, setNameError] = useState('');
//   const [emailError, setEmailError] = useState('');
//   const [phoneError, setPhoneError] = useState('');
//   const [passwordError, setPasswordError] = useState('');
//   const [confirmPasswordError, setConfirmPasswordError] = useState('');

//   // Name validation - only letters allowed
//   const validateNameInput = (text: string) => {
//     const letterRegex = /^[A-Za-z\s]*$/;
    
//     setNameError('');
    
//     if (text === '') {
//       setName(text);
//       return;
//     }

//     if (!letterRegex.test(text)) {
//       setNameError('Only letters are allowed');
//       return;
//     }

//     setName(text);
//   };

//   // Email validation
//   const validateEmailInput = (text: string) => {
//     setEmail(text);
//     setEmailError('');
    
//     if (text === '') return;
    
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(text) && text.length > 0) {
//       setEmailError('Invalid email address');
//     }
//   };

//   // Phone validation - only numbers and 10 digits
//   const validatePhoneInput = (text: string) => {
//     const numericRegex = /^[0-9]*$/;
    
//     setPhoneError('');
    
//     if (text === '') {
//       setPhone(text);
//       return;
//     }

//     if (!numericRegex.test(text)) {
//       setPhoneError('Only numbers are allowed');
//       return;
//     }

//     if (text.length > 10) {
//       setPhoneError('Phone number must be 10 digits');
//       return;
//     }

//     setPhone(text);
//   };

//   // Password validation
//   const validatePasswordInput = (text: string) => {
//     setPassword(text);
//     setPasswordError('');
    
//     if (text.length === 0) {
//       return;
//     }

//     // Check first letter is capital
//     if (!/^[A-Z]/.test(text)) {
//       setPasswordError('First letter must be uppercase');
//       return;
//     }

//     // Check at least one special character
//     if (!/[!@#$%^&*(),.?":{}|<>]/.test(text)) {
//       setPasswordError('At least one special character required');
//       return;
//     }

//     // Check at least one number
//     if (!/[0-9]/.test(text)) {
//       setPasswordError('At least one number required');
//       return;
//     }

//     // Check remaining characters (after first) are lowercase, numbers, or special characters only
//     const remainingText = text.substring(1);
//     const remainingRegex = /^[a-z0-9!@#$%^&*(),.?":{}|<>]*$/;
//     if (!remainingRegex.test(remainingText)) {
//       setPasswordError('Use lowercase, numbers & special chars only');
//       return;
//     }

//     setPasswordError('');
//   };

//   // Confirm Password validation
//   const validateConfirmPasswordInput = (text: string) => {
//     setConfirmPassword(text);
//     setConfirmPasswordError('');
    
//     if (text.length === 0) return;
    
//     if (text !== password) {
//       setConfirmPasswordError('Passwords do not match');
//     }
//   };

//   // Full validation on submit
//   const validateForm = (): boolean => {
//     let hasError = false;

//     // Validate Name
//     if (!name.trim()) {
//       setNameError('Full name cannot be empty');
//       hasError = true;
//     } else if (!/^[A-Za-z\s]+$/.test(name.trim())) {
//       setNameError('Only letters are allowed');
//       hasError = true;
//     }

//     // Validate Email
//     if (!email.trim()) {
//       setEmailError('Email cannot be empty');
//       hasError = true;
//     } else {
//       const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//       if (!emailRegex.test(email)) {
//         setEmailError('Invalid email address');
//         hasError = true;
//       }
//     }

//     // Validate Phone
//     if (!phone.trim()) {
//       setPhoneError('Phone number cannot be empty');
//       hasError = true;
//     } else if (!/^[0-9]+$/.test(phone.trim())) {
//       setPhoneError('Only numbers are allowed');
//       hasError = true;
//     } else if (phone.trim().length !== 10) {
//       setPhoneError('Phone number must be 10 digits');
//       hasError = true;
//     }

//     // Validate Password
//     if (!password) {
//       setPasswordError('Password cannot be empty');
//       hasError = true;
//     } else {
//       // Check first letter is capital
//       if (!/^[A-Z]/.test(password)) {
//         setPasswordError('First letter must be uppercase');
//         hasError = true;
//       }
//       // Check at least one special character
//       else if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
//         setPasswordError('At least one special character required');
//         hasError = true;
//       }
//       // Check at least one number
//       else if (!/[0-9]/.test(password)) {
//         setPasswordError('At least one number required');
//         hasError = true;
//       }
//       // Check remaining characters
//       else {
//         const remainingText = password.substring(1);
//         const remainingRegex = /^[a-z0-9!@#$%^&*(),.?":{}|<>]*$/;
//         if (!remainingRegex.test(remainingText)) {
//           setPasswordError('Use lowercase, numbers & special chars only');
//           hasError = true;
//         }
//       }
//     }

//     // Validate Confirm Password
//     if (!confirmPassword) {
//       setConfirmPasswordError('Confirm password cannot be empty');
//       hasError = true;
//     } else if (confirmPassword !== password) {
//       setConfirmPasswordError('Passwords do not match');
//       hasError = true;
//     }

//     return !hasError;
//   };

//   const handleSignup = async () => {
//     if (!validateForm()) {
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

//       if (result.success) {
//         // Clear form
//         setName('');
//         setEmail('');
//         setPhone('');
//         setPassword('');
//         setConfirmPassword('');
//         setNameError('');
//         setEmailError('');
//         setPhoneError('');
//         setPasswordError('');
//         setConfirmPasswordError('');
        
//         Alert.alert(
//           '✅ Success',
//           'Account created successfully! Please login to continue.',
//           [
//             {
//               text: 'OK',
//               onPress: () => {
//                 navigation.navigate('Login');
//               },
//             },
//           ]
//         );
//       } else {
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

//           {/* Full Name */}
//           <View style={styles.inputWrapper}>
//             <View style={[styles.inputContainer, nameError && styles.inputError]}>
//               <Icon name="person-outline" size={20} color={nameError ? "#FF3B30" : "#7e808c"} style={styles.inputIcon} />
//               <TextInput
//                 style={styles.input}
//                 placeholder="Full Name"
//                 placeholderTextColor="#7e808c"
//                 value={name}
//                 onChangeText={validateNameInput}
//               />
//             </View>
//             {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}
//           </View>

//           {/* Email */}
//           <View style={styles.inputWrapper}>
//             <View style={[styles.inputContainer, emailError && styles.inputError]}>
//               <Icon name="mail-outline" size={20} color={emailError ? "#FF3B30" : "#7e808c"} style={styles.inputIcon} />
//               <TextInput
//                 style={styles.input}
//                 placeholder="Email Address"
//                 placeholderTextColor="#7e808c"
//                 value={email}
//                 onChangeText={validateEmailInput}
//                 autoCapitalize="none"
//                 keyboardType="email-address"
//               />
//             </View>
//             {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
//           </View>

//           {/* Phone */}
//           <View style={styles.inputWrapper}>
//             <View style={[styles.inputContainer, phoneError && styles.inputError]}>
//               <Icon name="call-outline" size={20} color={phoneError ? "#FF3B30" : "#7e808c"} style={styles.inputIcon} />
//               <TextInput
//                 style={styles.input}
//                 placeholder="Phone Number"
//                 placeholderTextColor="#7e808c"
//                 value={phone}
//                 onChangeText={validatePhoneInput}
//                 keyboardType="phone-pad"
//               />
//             </View>
//             {phoneError ? <Text style={styles.errorText}>{phoneError}</Text> : null}
//           </View>

//           {/* Password */}
//           <View style={styles.inputWrapper}>
//             <View style={[styles.inputContainer, passwordError && styles.inputError]}>
//               <Icon name="lock-closed-outline" size={20} color={passwordError ? "#FF3B30" : "#7e808c"} style={styles.inputIcon} />
//               <TextInput
//                 style={styles.input}
//                 placeholder="Password"
//                 placeholderTextColor="#7e808c"
//                 value={password}
//                 onChangeText={validatePasswordInput}
//                 secureTextEntry={!showPassword}
//               />
//               <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
//                 <Icon 
//                   name={showPassword ? "eye-outline" : "eye-off-outline"} 
//                   size={20} 
//                   color="#7e808c" 
//                 />
//               </TouchableOpacity>
//             </View>
//             {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
//           </View>

//           {/* Confirm Password */}
//           <View style={styles.inputWrapper}>
//             <View style={[styles.inputContainer, confirmPasswordError && styles.inputError]}>
//               <Icon name="lock-closed-outline" size={20} color={confirmPasswordError ? "#FF3B30" : "#7e808c"} style={styles.inputIcon} />
//               <TextInput
//                 style={styles.input}
//                 placeholder="Confirm Password"
//                 placeholderTextColor="#7e808c"
//                 value={confirmPassword}
//                 onChangeText={validateConfirmPasswordInput}
//                 secureTextEntry={!showConfirmPassword}
//               />
//               <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
//                 <Icon 
//                   name={showConfirmPassword ? "eye-outline" : "eye-off-outline"} 
//                   size={20} 
//                   color="#7e808c" 
//                 />
//               </TouchableOpacity>
//             </View>
//             {confirmPasswordError ? <Text style={styles.errorText}>{confirmPasswordError}</Text> : null}
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
//   inputWrapper: {
//     marginBottom: 12,
//   },
//   inputContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#ffffff',
//     borderRadius: 12,
//     paddingHorizontal: 16,
//     borderWidth: 1,
//     borderColor: '#e6e6e9',
//   },
//   inputError: {
//     borderColor: '#FF3B30',
//     borderWidth: 1.5,
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
//   errorText: {
//     color: '#FF3B30',
//     fontSize: 13,
//     marginTop: 4,
//     marginLeft: 4,
//     fontWeight: '500',
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
// delivery-app/src/screens/auth/SignupScreen.tsx
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
    // Allow only letters, numbers, @, ., and _ (standard email characters)
    const emailCharRegex = /^[A-Za-z0-9@._]*$/;
    
    if (text === '') {
      setEmail(text);
      setEmailError('');
      return;
    }

    if (!emailCharRegex.test(text)) {
      // Block invalid characters silently (no error message while typing)
      return;
    }

    setEmail(text);
    // Clear error while typing
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

    // Validate Name
    if (!name.trim()) {
      setNameError('Full name cannot be empty');
      hasError = true;
    } else if (!/^[A-Za-z\s]+$/.test(name.trim())) {
      setNameError('Only letters are allowed');
      hasError = true;
    }

    // Validate Email - only show error on submit
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

    // Validate Phone
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

    // Validate Password
    if (!password) {
      setPasswordError('Password cannot be empty');
      hasError = true;
    } else {
      // Check first letter is capital
      if (!/^[A-Z]/.test(password)) {
        setPasswordError('First letter must be uppercase');
        hasError = true;
      }
      // Check at least one special character
      else if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        setPasswordError('At least one special character required');
        hasError = true;
      }
      // Check at least one number
      else if (!/[0-9]/.test(password)) {
        setPasswordError('At least one number required');
        hasError = true;
      }
      // Check remaining characters
      else {
        const remainingText = password.substring(1);
        const remainingRegex = /^[a-z0-9!@#$%^&*(),.?":{}|<>]*$/;
        if (!remainingRegex.test(remainingText)) {
          setPasswordError('Use lowercase, numbers & special chars only');
          hasError = true;
        }
      }
    }

    // Validate Confirm Password
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
        // Clear form
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
          '✅ Success',
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

          {/* Full Name */}
          <View style={styles.inputWrapper}>
            <View style={[styles.inputContainer, nameError && styles.inputError]}>
              <Icon name="person-outline" size={20} color={nameError ? "#FF3B30" : "#7e808c"} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Full Name"
                placeholderTextColor="#7e808c"
                value={name}
                onChangeText={validateNameInput}
              />
            </View>
            {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}
          </View>

          {/* Email */}
          <View style={styles.inputWrapper}>
            <View style={[styles.inputContainer, emailError && styles.inputError]}>
              <Icon name="mail-outline" size={20} color={emailError ? "#FF3B30" : "#7e808c"} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Email Address"
                placeholderTextColor="#7e808c"
                value={email}
                onChangeText={validateEmailInput}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>
            {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
          </View>

          {/* Phone */}
          <View style={styles.inputWrapper}>
            <View style={[styles.inputContainer, phoneError && styles.inputError]}>
              <Icon name="call-outline" size={20} color={phoneError ? "#FF3B30" : "#7e808c"} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Phone Number"
                placeholderTextColor="#7e808c"
                value={phone}
                onChangeText={validatePhoneInput}
                keyboardType="phone-pad"
              />
            </View>
            {phoneError ? <Text style={styles.errorText}>{phoneError}</Text> : null}
          </View>

          {/* Password */}
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

          {/* Confirm Password */}
          <View style={styles.inputWrapper}>
            <View style={[styles.inputContainer, confirmPasswordError && styles.inputError]}>
              <Icon name="lock-closed-outline" size={20} color={confirmPasswordError ? "#FF3B30" : "#7e808c"} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                placeholderTextColor="#7e808c"
                value={confirmPassword}
                onChangeText={validateConfirmPasswordInput}
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
            {confirmPasswordError ? <Text style={styles.errorText}>{confirmPasswordError}</Text> : null}
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

export default SignupScreen;