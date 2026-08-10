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
// // // // // // } from 'react-native';
// // // // // // import Icon from 'react-native-vector-icons/Ionicons';
// // // // // // import { AuthContext } from '../../context/AuthContext';

// // // // // // const LoginScreen: React.FC = ({ navigation }: any) => {
// // // // // //   const [email, setEmail] = useState('');
// // // // // //   const [password, setPassword] = useState('');
// // // // // //   const [loading, setLoading] = useState(false);
// // // // // //   const { login } = useContext(AuthContext);

// // // // // //   const handleLogin = async () => {
// // // // // //     if (!email || !password) {
// // // // // //       Alert.alert('Error', 'Please fill all fields');
// // // // // //       return;
// // // // // //     }

// // // // // //     setLoading(true);
// // // // // //     try {
// // // // // //       const success = await login({ email, password });
// // // // // //       if (!success) {
// // // // // //         Alert.alert('Error', 'Login failed. Please try again.');
// // // // // //       }
// // // // // //     } catch (error) {
// // // // // //       Alert.alert('Error', 'Something went wrong');
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
// // // // // //           <Text style={styles.subtitle}>Order food from favourite restaurants</Text>
// // // // // //         </View>

// // // // // //         <View style={styles.formContainer}>
// // // // // //           <Text style={styles.title}>Sign In</Text>
// // // // // //           <Text style={styles.subtitle2}>Login to your account</Text>

// // // // // //           <View style={styles.inputContainer}>
// // // // // //             <Icon name="mail-outline" size={20} color="#7e808c" style={styles.inputIcon} />
// // // // // //             <TextInput
// // // // // //               style={styles.input}
// // // // // //               placeholder="Email"
// // // // // //               placeholderTextColor="#7e808c"
// // // // // //               value={email}
// // // // // //               onChangeText={setEmail}
// // // // // //               autoCapitalize="none"
// // // // // //               keyboardType="email-address"
// // // // // //             />
// // // // // //           </View>

// // // // // //           <View style={styles.inputContainer}>
// // // // // //             <Icon name="lock-closed-outline" size={20} color="#7e808c" style={styles.inputIcon} />
// // // // // //             <TextInput
// // // // // //               style={styles.input}
// // // // // //               placeholder="Password"
// // // // // //               placeholderTextColor="#7e808c"
// // // // // //               value={password}
// // // // // //               onChangeText={setPassword}
// // // // // //               secureTextEntry
// // // // // //             />
// // // // // //           </View>

// // // // // //           <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
// // // // // //             <Text style={styles.buttonText}>{loading ? 'Signing in...' : 'Sign In'}</Text>
// // // // // //           </TouchableOpacity>

// // // // // //           <View style={styles.footer}>
// // // // // //             <Text style={styles.footerText}>Don’t have an account?</Text>
// // // // // //             <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
// // // // // //               <Text style={styles.footerLink}> Sign Up</Text>
// // // // // //             </TouchableOpacity>
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
// // // // // //     marginBottom: 40,
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
// // // // // //     marginBottom: 10,
// // // // // //   },
// // // // // //   subtitle2: {
// // // // // //     fontSize: 14,
// // // // // //     color: '#6d6d78',
// // // // // //     marginBottom: 24,
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
// // // // // // });

// // // // // // export default LoginScreen;
// // // // // // delivery-app/src/screens/auth/LoginScreen.tsx
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
// // // // // // ✅ FIXED: Correct import path - go up two levels to src, then into context
// // // // // import { AuthContext } from '../../context/AuthContext';

// // // // // const LoginScreen: React.FC = ({ navigation }: any) => {
// // // // //   const [email, setEmail] = useState('');
// // // // //   const [password, setPassword] = useState('');
// // // // //   const [loading, setLoading] = useState(false);
// // // // //   const [showPassword, setShowPassword] = useState(false);
// // // // //   const { login } = useContext(AuthContext);

// // // // //   const handleLogin = async () => {
// // // // //     // Validate inputs
// // // // //     if (!email.trim()) {
// // // // //       Alert.alert('Error', 'Please enter your email');
// // // // //       return;
// // // // //     }

// // // // //     if (!password) {
// // // // //       Alert.alert('Error', 'Please enter your password');
// // // // //       return;
// // // // //     }

// // // // //     setLoading(true);

// // // // //     try {
// // // // //       console.log('Login with email:', email.trim());
// // // // //       console.log('Login with password:', password);
      
// // // // //       const result = await login(email.trim(), password);

// // // // //       if (result.success) {
// // // // //         Alert.alert(
// // // // //           '✅ Success',
// // // // //           'Login successful!',
// // // // //           [{ text: 'OK', onPress: () => navigation.replace('Home') }]
// // // // //         );
// // // // //       } else {
// // // // //         Alert.alert('❌ Error', result.message || 'Login failed. Please try again.');
// // // // //       }
// // // // //     } catch (error: any) {
// // // // //       console.error('Login error:', error);
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
// // // // //           <Text style={styles.subtitle}>Order food from favourite restaurants</Text>
// // // // //         </View>

// // // // //         <View style={styles.formContainer}>
// // // // //           <Text style={styles.title}>Sign In</Text>
// // // // //           <Text style={styles.subtitle2}>Login to your account</Text>

// // // // //           {/* Email Input */}
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
// // // // //               autoCorrect={false}
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
// // // // //               autoCorrect={false}
// // // // //             />
// // // // //             <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
// // // // //               <Icon 
// // // // //                 name={showPassword ? "eye-outline" : "eye-off-outline"} 
// // // // //                 size={20} 
// // // // //                 color="#7e808c" 
// // // // //               />
// // // // //             </TouchableOpacity>
// // // // //           </View>

// // // // //           {/* Login Button */}
// // // // //           <TouchableOpacity 
// // // // //             style={[styles.button, loading && styles.buttonDisabled]} 
// // // // //             onPress={handleLogin} 
// // // // //             disabled={loading}
// // // // //           >
// // // // //             {loading ? (
// // // // //               <ActivityIndicator color="#ffffff" size="small" />
// // // // //             ) : (
// // // // //               <Text style={styles.buttonText}>Sign In</Text>
// // // // //             )}
// // // // //           </TouchableOpacity>

// // // // //           {/* Footer */}
// // // // //           <View style={styles.footer}>
// // // // //             <Text style={styles.footerText}>Don't have an account?</Text>
// // // // //             <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
// // // // //               <Text style={styles.footerLink}> Sign Up</Text>
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
// // // // //   subtitle2: {
// // // // //     fontSize: 14,
// // // // //     color: '#6d6d78',
// // // // //     marginBottom: 24,
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
// // // // // });

// // // // // export default LoginScreen;
// // // // // delivery-app/src/screens/auth/LoginScreen.tsx
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

// // // // const LoginScreen: React.FC = ({ navigation }: any) => {
// // // //   const [email, setEmail] = useState('');
// // // //   const [password, setPassword] = useState('');
// // // //   const [loading, setLoading] = useState(false);
// // // //   const [showPassword, setShowPassword] = useState(false);
// // // //   const { login } = useContext(AuthContext);

// // // //   const handleLogin = async () => {
// // // //     // Validate inputs
// // // //     if (!email.trim()) {
// // // //       Alert.alert('Error', 'Please enter your email');
// // // //       return;
// // // //     }

// // // //     if (!password) {
// // // //       Alert.alert('Error', 'Please enter your password');
// // // //       return;
// // // //     }

// // // //     setLoading(true);

// // // //     try {
// // // //       console.log('Login with email:', email.trim());
// // // //       console.log('Login with password:', password);
      
// // // //       const result = await login(email.trim(), password);

// // // //       if (result.success) {
// // // //         Alert.alert(
// // // //           '✅ Success',
// // // //           'Login successful!',
// // // //           [{ 
// // // //             text: 'OK', 
// // // //             onPress: () => {
// // // //               // Reset navigation stack to go to Home
// // // //               // The AppNavigator will handle showing Home based on user state
// // // //               navigation.reset({
// // // //                 index: 0,
// // // //                 routes: [{ name: 'Home' }],
// // // //               });
// // // //             }
// // // //           }]
// // // //         );
// // // //       } else {
// // // //         Alert.alert('❌ Error', result.message || 'Login failed. Please try again.');
// // // //       }
// // // //     } catch (error: any) {
// // // //       console.error('Login error:', error);
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
// // // //           <Text style={styles.subtitle}>Order food from favourite restaurants</Text>
// // // //         </View>

// // // //         <View style={styles.formContainer}>
// // // //           <Text style={styles.title}>Sign In</Text>
// // // //           <Text style={styles.subtitle2}>Login to your account</Text>

// // // //           {/* Email Input */}
// // // //           <View style={styles.inputContainer}>
// // // //             <Icon name="mail-outline" size={20} color="#7e808c" style={styles.inputIcon} />
// // // //             <TextInput
// // // //               style={styles.input}
// // // //               placeholder="Email"
// // // //               placeholderTextColor="#7e808c"
// // // //               value={email}
// // // //               onChangeText={setEmail}
// // // //               autoCapitalize="none"
// // // //               keyboardType="email-address"
// // // //               autoCorrect={false}
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
// // // //               autoCorrect={false}
// // // //             />
// // // //             <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
// // // //               <Icon 
// // // //                 name={showPassword ? "eye-outline" : "eye-off-outline"} 
// // // //                 size={20} 
// // // //                 color="#7e808c" 
// // // //               />
// // // //             </TouchableOpacity>
// // // //           </View>

// // // //           {/* Login Button */}
// // // //           <TouchableOpacity 
// // // //             style={[styles.button, loading && styles.buttonDisabled]} 
// // // //             onPress={handleLogin} 
// // // //             disabled={loading}
// // // //           >
// // // //             {loading ? (
// // // //               <ActivityIndicator color="#ffffff" size="small" />
// // // //             ) : (
// // // //               <Text style={styles.buttonText}>Sign In</Text>
// // // //             )}
// // // //           </TouchableOpacity>

// // // //           {/* Footer */}
// // // //           <View style={styles.footer}>
// // // //             <Text style={styles.footerText}>Don't have an account?</Text>
// // // //             <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
// // // //               <Text style={styles.footerLink}> Sign Up</Text>
// // // //             </TouchableOpacity>
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
// // // //     marginBottom: 40,
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
// // // //     marginBottom: 10,
// // // //   },
// // // //   subtitle2: {
// // // //     fontSize: 14,
// // // //     color: '#6d6d78',
// // // //     marginBottom: 24,
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
// // // // });

// // // // export default LoginScreen;
// // // // delivery-app/src/screens/auth/LoginScreen.tsx
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

// // // const LoginScreen: React.FC = ({ navigation }: any) => {
// // //   const [email, setEmail] = useState('');
// // //   const [password, setPassword] = useState('');
// // //   const [loading, setLoading] = useState(false);
// // //   const [showPassword, setShowPassword] = useState(false);
// // //   const { login } = useContext(AuthContext);

// // //   const handleLogin = async () => {
// // //     // Validate inputs
// // //     if (!email.trim()) {
// // //       Alert.alert('Error', 'Please enter your email');
// // //       return;
// // //     }

// // //     if (!password) {
// // //       Alert.alert('Error', 'Please enter your password');
// // //       return;
// // //     }

// // //     setLoading(true);

// // //     try {
// // //       console.log('Login with email:', email.trim());
// // //       console.log('Login with password:', password);
      
// // //       const result = await login(email.trim(), password);

// // //       if (result.success) {
// // //         Alert.alert(
// // //           '✅ Success',
// // //           'Login successful!',
// // //           [{ 
// // //             text: 'OK', 
// // //             onPress: () => {
// // //               // Reset navigation stack to go to Home
// // //               navigation.reset({
// // //                 index: 0,
// // //                 routes: [{ name: 'Home' }],
// // //               });
// // //             }
// // //           }]
// // //         );
// // //       } else {
// // //         Alert.alert('❌ Error', result.message || 'Login failed. Please try again.');
// // //       }
// // //     } catch (error: any) {
// // //       console.error('Login error:', error);
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
// // //           <Text style={styles.subtitle}>Order food from favourite restaurants</Text>
// // //         </View>

// // //         <View style={styles.formContainer}>
// // //           <Text style={styles.title}>Sign In</Text>
// // //           <Text style={styles.subtitle2}>Login to your account</Text>

// // //           {/* Email Input */}
// // //           <View style={styles.inputContainer}>
// // //             <Icon name="mail-outline" size={20} color="#7e808c" style={styles.inputIcon} />
// // //             <TextInput
// // //               style={styles.input}
// // //               placeholder="Email"
// // //               placeholderTextColor="#7e808c"
// // //               value={email}
// // //               onChangeText={setEmail}
// // //               autoCapitalize="none"
// // //               keyboardType="email-address"
// // //               autoCorrect={false}
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
// // //               autoCorrect={false}
// // //             />
// // //             <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
// // //               <Icon 
// // //                 name={showPassword ? "eye-outline" : "eye-off-outline"} 
// // //                 size={20} 
// // //                 color="#7e808c" 
// // //               />
// // //             </TouchableOpacity>
// // //           </View>

// // //           {/* Login Button */}
// // //           <TouchableOpacity 
// // //             style={[styles.button, loading && styles.buttonDisabled]} 
// // //             onPress={handleLogin} 
// // //             disabled={loading}
// // //           >
// // //             {loading ? (
// // //               <ActivityIndicator color="#ffffff" size="small" />
// // //             ) : (
// // //               <Text style={styles.buttonText}>Sign In</Text>
// // //             )}
// // //           </TouchableOpacity>

// // //           {/* Footer */}
// // //           <View style={styles.footer}>
// // //             <Text style={styles.footerText}>Don't have an account?</Text>
// // //             <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
// // //               <Text style={styles.footerLink}> Sign Up</Text>
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
// // //   subtitle2: {
// // //     fontSize: 14,
// // //     color: '#6d6d78',
// // //     marginBottom: 24,
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

// // // export default LoginScreen;
// // // delivery-app/src/screens/auth/LoginScreen.tsx
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

// // const LoginScreen: React.FC = ({ navigation }: any) => {
// //   const [email, setEmail] = useState('');
// //   const [password, setPassword] = useState('');
// //   const [loading, setLoading] = useState(false);
// //   const [showPassword, setShowPassword] = useState(false);
// //   const { login } = useContext(AuthContext);

// //   const handleLogin = async () => {
// //     // Validate inputs
// //     if (!email.trim()) {
// //       Alert.alert('Error', 'Please enter your email');
// //       return;
// //     }

// //     if (!password) {
// //       Alert.alert('Error', 'Please enter your password');
// //       return;
// //     }

// //     setLoading(true);

// //     try {
// //       console.log('Login with email:', email.trim());
// //       console.log('Login with password:', password);
      
// //       const result = await login(email.trim(), password);

// //       if (result.success) {
// //         Alert.alert(
// //           '✅ Success',
// //           'Login successful!',
// //           [{ 
// //             text: 'OK', 
// //             onPress: () => {
// //               // ✅ Navigate to Home on successful login
// //               navigation.reset({
// //                 index: 0,
// //                 routes: [{ name: 'Home' }],
// //               });
// //             }
// //           }]
// //         );
// //       } else {
// //         Alert.alert('❌ Error', result.message || 'Login failed. Please try again.');
// //       }
// //     } catch (error: any) {
// //       console.error('Login error:', error);
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
// //           <Text style={styles.subtitle}>Order food from favourite restaurants</Text>
// //         </View>

// //         <View style={styles.formContainer}>
// //           <Text style={styles.title}>Sign In</Text>
// //           <Text style={styles.subtitle2}>Login to your account</Text>

// //           {/* Email Input */}
// //           <View style={styles.inputContainer}>
// //             <Icon name="mail-outline" size={20} color="#7e808c" style={styles.inputIcon} />
// //             <TextInput
// //               style={styles.input}
// //               placeholder="Email"
// //               placeholderTextColor="#7e808c"
// //               value={email}
// //               onChangeText={setEmail}
// //               autoCapitalize="none"
// //               keyboardType="email-address"
// //               autoCorrect={false}
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
// //               autoCorrect={false}
// //             />
// //             <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
// //               <Icon 
// //                 name={showPassword ? "eye-outline" : "eye-off-outline"} 
// //                 size={20} 
// //                 color="#7e808c" 
// //               />
// //             </TouchableOpacity>
// //           </View>

// //           {/* Login Button - Changed text from "Sign In" to "Login" */}
// //           <TouchableOpacity 
// //             style={[styles.button, loading && styles.buttonDisabled]} 
// //             onPress={handleLogin} 
// //             disabled={loading}
// //           >
// //             {loading ? (
// //               <ActivityIndicator color="#ffffff" size="small" />
// //             ) : (
// //               <Text style={styles.buttonText}>Login</Text>  // ← Changed to "Login"
// //             )}
// //           </TouchableOpacity>

// //           {/* Footer - Changed "Sign Up" to "Sign Up" */}
// //           <View style={styles.footer}>
// //             <Text style={styles.footerText}>Don't have an account?</Text>
// //             <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
// //               <Text style={styles.footerLink}> Sign Up</Text>
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
// //   subtitle2: {
// //     fontSize: 14,
// //     color: '#6d6d78',
// //     marginBottom: 24,
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

// // export default LoginScreen;

// // delivery-app/src/screens/auth/LoginScreen.tsx
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
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const { login } = useContext(AuthContext);

//   const handleLogin = async () => {
//     // Validate inputs
//     if (!email.trim()) {
//       Alert.alert('Error', 'Please enter your email');
//       return;
//     }

//     if (!password) {
//       Alert.alert('Error', 'Please enter your password');
//       return;
//     }

//     setLoading(true);

//     try {
//       console.log('Login with email:', email.trim());
//       console.log('Login with password:', password);
      
//       const result = await login(email.trim(), password);

//       if (result.success) {
//         // ✅ Navigate to Home on successful login
//         Alert.alert(
//           '✅ Success',
//           'Login successful!',
//           [{ 
//             text: 'OK', 
//             onPress: () => {
//               navigation.reset({
//                 index: 0,
//                 routes: [{ name: 'Home' }],
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

//           {/* Email Input */}
//           <View style={styles.inputContainer}>
//             <Icon name="mail-outline" size={20} color="#7e808c" style={styles.inputIcon} />
//             <TextInput
//               style={styles.input}
//               placeholder="Email"
//               placeholderTextColor="#7e808c"
//               value={email}
//               onChangeText={setEmail}
//               autoCapitalize="none"
//               keyboardType="email-address"
//               autoCorrect={false}
//             />
//           </View>

//           {/* Password Input */}
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

//           {/* Login Button */}
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

//           {/* Footer */}
//           <View style={styles.footer}>
//             <Text style={styles.footerText}>Don't have an account?</Text>
//             <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
//               <Text style={styles.footerLink}> Sign Up</Text>
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
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { AuthContext } from '../../context/AuthContext';

const LoginScreen: React.FC = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useContext(AuthContext);

  const handleLogin = async () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email');
      return;
    }

    if (!password) {
      Alert.alert('Error', 'Please enter your password');
      return;
    }

    setLoading(true);

    try {
      const result = await login(email.trim(), password);

      if (result.success) {
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
      } else {
        Alert.alert('❌ Error', result.message || 'Login failed. Please try again.');
      }
    } catch (error: any) {
      console.error('Login error:', error);
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
          <Text style={styles.subtitle}>Order food from favourite restaurants</Text>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.title}>Sign In</Text>
          <Text style={styles.subtitle2}>Login to your account</Text>

          <View style={styles.inputContainer}>
            <Icon name="mail-outline" size={20} color="#7e808c" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#7e808c"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
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
              />
            </TouchableOpacity>
          </View>

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
<<<<<<< HEAD
  <Text style={styles.footerText}>Don't have an account?</Text>
  <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
    <Text style={styles.footerLink}> Sign Up</Text>
  </TouchableOpacity>
</View>

{/* NEW: staff/driver login link */}
<TouchableOpacity
  onPress={() => navigation.navigate('StaffLogin')}
  style={{ marginTop: 16, alignItems: 'center' }}
>
  <Text style={styles.footerLink}>Login as Staff / Driver</Text>
</TouchableOpacity>
=======
            <Text style={styles.footerText}>Don't have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
              <Text style={styles.footerLink}> Sign Up</Text>
            </TouchableOpacity>
          </View>
>>>>>>> ac6bd4bc2969a1a1e43e3d7b270890302ced70d2
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

export default LoginScreen;