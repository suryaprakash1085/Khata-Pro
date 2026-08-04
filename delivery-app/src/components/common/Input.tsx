// import React, { useState } from 'react';
// import {
//   View,
//   TextInput,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   KeyboardTypeOptions,
// } from 'react-native';
// import Icon from 'react-native-vector-icons/Ionicons';
// import { colors } from '../../constants/colors';

// interface InputProps {
//   label?: string;
//   value: string;
//   onChangeText: (text: string) => void;
//   placeholder?: string;
//   secureTextEntry?: boolean;
//   keyboardType?: KeyboardTypeOptions;
//   autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
//   error?: string;
//   icon?: string;
//   iconRight?: string;
//   onIconPress?: () => void;
//   containerStyle?: object;
//   inputStyle?: object;
//   labelStyle?: object;
// }

// export default function Input({
//   label,
//   value,
//   onChangeText,
//   placeholder,
//   secureTextEntry = false,
//   keyboardType = 'default',
//   autoCapitalize = 'none',
//   error,
//   icon,
//   iconRight,
//   onIconPress,
//   containerStyle,
//   inputStyle,
//   labelStyle,
// }: InputProps) {
//   const [showPassword, setShowPassword] = useState<boolean>(false);
//   const isPassword = secureTextEntry;

//   return (
//     <View style={[styles.container, containerStyle]}>
//       {label && <Text style={[styles.label, labelStyle]}>{label}</Text>}
//       <View style={[styles.inputWrapper, error && styles.inputError]}>
//         {icon && (
//           <TouchableOpacity onPress={onIconPress} disabled={!onIconPress}>
//             <Icon name={icon} size={20} color={colors.gray} style={styles.icon} />
//           </TouchableOpacity>
//         )}
//         <TextInput
//           style={[styles.input, inputStyle]}
//           value={value}
//           onChangeText={onChangeText}
//           placeholder={placeholder}
//           placeholderTextColor={colors.textLight}
//           secureTextEntry={isPassword ? !showPassword : false}
//           keyboardType={keyboardType}
//           autoCapitalize={autoCapitalize}
//         />
//         {isPassword && (
//           <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
//             <Icon
//               name={showPassword ? 'eye-off-outline' : 'eye-outline'}
//               size={20}
//               color={colors.gray}
//             />
//           </TouchableOpacity>
//         )}
//         {iconRight && (
//           <TouchableOpacity onPress={onIconPress} disabled={!onIconPress}>
//             <Icon name={iconRight} size={20} color={colors.gray} />
//           </TouchableOpacity>
//         )}
//       </View>
//       {error && <Text style={styles.errorText}>{error}</Text>}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     marginBottom: 16,
//   },
//   label: {
//     fontSize: 14,
//     fontWeight: '500',
//     color: colors.text,
//     marginBottom: 6,
//   },
//   inputWrapper: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: colors.border,
//     borderRadius: 8,
//     paddingHorizontal: 12,
//     height: 48,
//   },
//   inputError: {
//     borderColor: colors.danger,
//   },
//   input: {
//     flex: 1,
//     fontSize: 14,
//     color: colors.text,
//   },
//   icon: {
//     marginRight: 8,
//   },
//   errorText: {
//     color: colors.danger,
//     fontSize: 12,
//     marginTop: 4,
//   },
// });
import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  KeyboardTypeOptions,
  ViewStyle,
  TextStyle,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../../constants/colors';

interface InputProps {
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  error?: string;
  icon?: string;
  iconRight?: string;
  onIconPress?: () => void;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  labelStyle?: TextStyle;
}

export default function Input({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'none',
  error,
  icon,
  iconRight,
  onIconPress,
  containerStyle,
  inputStyle,
  labelStyle,
}: InputProps) {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const isPassword = secureTextEntry;

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={[styles.label, labelStyle]}>{label}</Text>}
      <View style={[
        styles.inputWrapper, 
        error ? styles.inputError : null
      ]}>
        {icon && (
          <TouchableOpacity onPress={onIconPress} disabled={!onIconPress}>
            <Icon name={icon} size={20} color={colors.gray} style={styles.icon} />
          </TouchableOpacity>
        )}
        <TextInput
          style={[styles.input, inputStyle]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.textLight}
          secureTextEntry={isPassword ? !showPassword : false}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
        />
        {isPassword && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Icon
              name={showPassword ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color={colors.gray}
            />
          </TouchableOpacity>
        )}
        {iconRight && (
          <TouchableOpacity onPress={onIconPress} disabled={!onIconPress}>
            <Icon name={iconRight} size={20} color={colors.gray} />
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 48,
  },
  inputError: {
    borderColor: colors.danger,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
  },
  icon: {
    marginRight: 8,
  },
  errorText: {
    color: colors.danger,
    fontSize: 12,
    marginTop: 4,
  },
});