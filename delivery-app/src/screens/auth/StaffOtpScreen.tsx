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
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { DriverAuthContext } from '../../context/DriverAuthContext';

const StaffOtpScreen: React.FC = ({ navigation, route }: any) => {
  const { phone } = route.params;
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const { verifyOtp, requestOtp } = useContext(DriverAuthContext);

  const handleVerify = async () => {
    if (!otp || otp.trim().length < 5) {
      Alert.alert('Error', 'Please enter the OTP sent to your phone');
      return;
    }

    setLoading(true);
    try {
      const success = await verifyOtp(phone, otp.trim());
      if (!success) {
        Alert.alert('Error', 'Invalid or expired OTP. Please try again.');
      }
      // On success, isDriverAuthenticated flips to true and your navigator
      // (checking isDriverAuthenticated) automatically switches screens.
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setLoading(true);
    try {
      await requestOtp(phone);
      Alert.alert('Sent', 'A new OTP has been sent to your phone.');
    } catch (error) {
      Alert.alert('Error', 'Could not resend OTP.');
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
          <Text style={styles.logoText}>🔐 Verify OTP</Text>
          <Text style={styles.subtitle}>Code sent to {phone}</Text>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.title}>Enter OTP</Text>
          <Text style={styles.subtitle2}>Check your SMS for the 5-digit code</Text>

          <View style={styles.inputContainer}>
            <Icon name="key-outline" size={20} color="#7e808c" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="OTP code"
              placeholderTextColor="#7e808c"
              value={otp}
              onChangeText={setOtp}
              keyboardType="number-pad"
              maxLength={6}
            />
          </View>

          <TouchableOpacity style={styles.button} onPress={handleVerify} disabled={loading}>
            <Text style={styles.buttonText}>{loading ? 'Verifying...' : 'Verify & Login'}</Text>
          </TouchableOpacity>

          <View style={styles.footer}>
            <TouchableOpacity onPress={handleResend} disabled={loading}>
              <Text style={styles.footerLink}>Resend OTP</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  scrollContent: { flexGrow: 1, justifyContent: 'center', padding: 20 },
  logoContainer: { marginBottom: 40, alignItems: 'center' },
  logoText: { fontSize: 32, fontWeight: '700', color: '#333333' },
  subtitle: { marginTop: 8, fontSize: 14, color: '#6d6d78', textAlign: 'center' },
  formContainer: {
    backgroundColor: '#f9f9fb',
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 4,
  },
  title: { fontSize: 26, fontWeight: '700', color: '#111111', marginBottom: 10 },
  subtitle2: { fontSize: 14, color: '#6d6d78', marginBottom: 24 },
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
  inputIcon: { marginRight: 10 },
  input: { flex: 1, height: 48, fontSize: 16, color: '#111111', letterSpacing: 4 },
  button: {
    backgroundColor: '#1e90ff',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: { color: '#ffffff', fontSize: 16, fontWeight: '700' },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 20 },
  footerLink: { color: '#1e90ff', fontWeight: '700' },
});

export default StaffOtpScreen;