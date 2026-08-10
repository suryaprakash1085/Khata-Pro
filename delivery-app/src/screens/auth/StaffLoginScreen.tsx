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

const StaffLoginScreen: React.FC = ({ navigation }: any) => {
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
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
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>🚚 Staff Login</Text>
          <Text style={styles.subtitle}>Sign in with your registered phone number</Text>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.title}>Enter Phone Number</Text>
          <Text style={styles.subtitle2}>We'll send you a one-time code to verify</Text>

          <View style={styles.inputContainer}>
            <Icon name="call-outline" size={20} color="#7e808c" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="10-digit phone number"
              placeholderTextColor="#7e808c"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              maxLength={10}
            />
          </View>

          <TouchableOpacity style={styles.button} onPress={handleSendOtp} disabled={loading}>
            <Text style={styles.buttonText}>{loading ? 'Sending code...' : 'Send OTP'}</Text>
          </TouchableOpacity>

          <View style={styles.footer}>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.footerLink}>Back to Customer Login</Text>
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
  input: { flex: 1, height: 48, fontSize: 16, color: '#111111' },
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

export default StaffLoginScreen;