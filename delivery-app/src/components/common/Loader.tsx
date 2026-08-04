import React from 'react';
import {
  View,
  ActivityIndicator,
  StyleSheet,
  Modal,
  Text,
} from 'react-native';
import { colors } from '../../constants/colors';

interface LoaderProps {
  visible: boolean;
  message?: string;
  transparent?: boolean;
}

export default function Loader({
  visible = false,
  message = 'Loading...',
  transparent = true,
// }: LoaderProps): JSX.Element | null {
}: LoaderProps): React.ReactElement | null {
  if (!visible) return null;

  return (
    <Modal transparent={transparent} animationType="fade">
      <View style={styles.container}>
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          {message && <Text style={styles.message}>{message}</Text>}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  loaderContainer: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    minWidth: 120,
  },
  message: {
    marginTop: 12,
    fontSize: 14,
    color: colors.text,
  },
});