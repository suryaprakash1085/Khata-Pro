import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { colors } from '../../constants/colors';

interface ButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  size?: 'small' | 'medium' | 'large';
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export default function Button({
  title,
  onPress,
  loading = false,
  disabled = false,
  variant = 'primary',
  size = 'medium',
  style,
  textStyle,
}: ButtonProps) {
  const getBackgroundColor = (): string => {
    if (disabled) return colors.gray;
    switch (variant) {
      case 'primary': return colors.primary;
      case 'secondary': return colors.lightGray;
      case 'danger': return colors.danger;
      case 'success': return colors.success;
      default: return colors.primary;
    }
  };

  const getTextColor = (): string => {
    if (disabled) return colors.white;
    switch (variant) {
      case 'primary': return colors.white;
      case 'secondary': return colors.text;
      case 'danger': return colors.white;
      case 'success': return colors.white;
      default: return colors.white;
    }
  };

  const getPadding = (): ViewStyle => {
    switch (size) {
      case 'small': return { paddingHorizontal: 12, paddingVertical: 6 };
      case 'large': return { paddingHorizontal: 32, paddingVertical: 14 };
      default: return { paddingHorizontal: 20, paddingVertical: 10 };
    }
  };

  const getFontSize = (): number => {
    switch (size) {
      case 'small': return 12;
      case 'large': return 18;
      default: return 14;
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor: getBackgroundColor() },
        getPadding(),
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} size="small" />
      ) : (
        <Text
          style={[
            styles.text,
            { color: getTextColor(), fontSize: getFontSize() },
            textStyle,
          ]}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: '600',
  },
});