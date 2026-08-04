// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   KeyboardAvoidingView,
//   Platform,
//   Alert,
// } from 'react-native';
// import Icon from 'react-native-vector-icons/Ionicons';
// import { colors } from '../../constants/colors';

// export default function ForgotPasswordScreen({ navigation }: any) {
//   const [email, setEmail] = useState<string>('');
//   const [loading, setLoading] = useState<boolean>(false);

//   const handleResetPassword = (): void => {
//     if (!email) {
//       Alert.alert('Error', 'Please enter your email');
//       return;
//     }

//     setLoading(true);
//     setTimeout(() => {
//       setLoading(false);
//       Alert.alert(
//         'Success',
//         'Password reset link sent to your email',
//         [
//           { text: 'OK', onPress: () => navigation.navigate('Login') }
//         ]
//       );
//     }, 1500);
//   };

//   return (
//     <KeyboardAvoidingView
//       style={styles.container}
//       behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//     >
//       <View style={styles.content}>
//         <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
//           <Icon name="arrow-back" size={24} color={colors.text} />
//         </TouchableOpacity>

//         <View style={styles.header}>
//           <Text style={styles.title}>Forgot Password</Text>
//           <Text style={styles.subtitle}>
//             Enter your email address and we'll send you a link to reset your password
//           </Text>
//         </View>

//         <View style={styles.inputContainer}>
//           <Icon name="mail-outline" size={20} color={colors.gray} style={styles.inputIcon} />
//           <TextInput
//             style={styles.input}
//             placeholder="Email Address"
//             value={email}
//             onChangeText={setEmail}
//             keyboardType="email-address"
//             autoCapitalize="none"
//           />
//         </View>

//         <TouchableOpacity
//           style={styles.resetButton}
//           onPress={handleResetPassword}
//           disabled={loading}
//         >
//           <Text style={styles.resetButtonText}>
//             {loading ? 'Sending...' : 'Send Reset Link'}
//           </Text>
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={styles.loginLink}
//           onPress={() => navigation.navigate('Login')}
//         >
//           <Text style={styles.loginLinkText}>
//             <Icon name="arrow-back" size={14} /> Back to Login
//           </Text>
//         </TouchableOpacity>
//       </View>
//     </KeyboardAvoidingView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: colors.white,
//   },
//   content: {
//     flex: 1,
//     paddingHorizontal: 24,
//     paddingTop: 40,
//   },
//   backButton: {
//     marginBottom: 20,
//   },
//   header: {
//     marginBottom: 32,
//   },
//   title: {
//     fontSize: 28,
//     fontWeight: '700',
//     color: colors.text,
//     marginBottom: 8,
//   },
//   subtitle: {
//     fontSize: 14,
//     color: colors.textLight,
//     lineHeight: 20,
//   },
//   inputContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: colors.border,
//     borderRadius: 12,
//     paddingHorizontal: 12,
//     marginBottom: 20,
//     height: 50,
//   },
//   inputIcon: {
//     marginRight: 10,
//   },
//   input: {
//     flex: 1,
//     fontSize: 14,
//     color: colors.text,
//   },
//   resetButton: {
//     backgroundColor: colors.primary,
//     borderRadius: 12,
//     height: 50,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginTop: 8,
//   },
//   resetButtonText: {
//     color: colors.white,
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   loginLink: {
//     marginTop: 20,
//     alignItems: 'center',
//   },
//   loginLinkText: {
//     color: colors.primary,
//     fontSize: 14,
//     fontWeight: '500',
//   },
// });
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../../constants/colors';

export default function ForgotPasswordScreen({ navigation }: any) {
  const [email, setEmail] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleResetPassword = (): void => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      Alert.alert(
        'Success',
        'Password reset link sent to your email',
        [
          { text: 'OK', onPress: () => navigation.navigate('Login') }
        ]
      );
    }, 1500);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.title}>Forgot Password</Text>
          <Text style={styles.subtitle}>
            Enter your email address and we'll send you a link to reset your password
          </Text>
        </View>

        <View style={styles.inputContainer}>
          <Icon name="mail-outline" size={20} color={colors.gray} style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Email Address"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <TouchableOpacity
          style={styles.resetButton}
          onPress={handleResetPassword}
          disabled={loading}
        >
          <Text style={styles.resetButtonText}>
            {loading ? 'Sending...' : 'Send Reset Link'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.loginLink}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.loginLinkText}>
            <Icon name="arrow-back" size={14} /> Back to Login
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  backButton: {
    marginBottom: 20,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textLight,
    lineHeight: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 20,
    height: 50,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
  },
  resetButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  resetButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  loginLink: {
    marginTop: 20,
    alignItems: 'center',
  },
  loginLinkText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '500',
  },
});