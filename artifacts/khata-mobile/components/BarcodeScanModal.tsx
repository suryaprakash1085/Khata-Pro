import React, { useCallback, useRef, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { CameraView, useCameraPermissions, type BarcodeScanningResult } from 'expo-camera';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';



interface Props {
  visible: boolean;
  onClose: () => void;
  onScanned: (code: string) => void;
}

export function BarcodeScanModal({ visible, onClose, onScanned }: Props) {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [permission, requestPermission] = useCameraPermissions();
  const lockedRef = useRef(false);

  const handleScan = useCallback(
    (result: BarcodeScanningResult) => {
      if (lockedRef.current) return;
      lockedRef.current = true;
      onScanned(result.data);
      setTimeout(() => {
        lockedRef.current = false;
      }, 600);
    },
    [onScanned],
  );

  if (!visible) return null;

  return (
    <Modal visible animationType="slide" onRequestClose={onClose}>
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        {!permission ? (
          <View style={styles.center} />
        ) : !permission.granted ? (
          <View style={[styles.center, { paddingTop: insets.top + 24 }]}>
            <Feather name="camera-off" size={32} color={colors.mutedForeground} />
            <Text style={[styles.permMsg, { color: colors.foreground }]}>
              Camera access is needed to scan barcodes
            </Text>
            <Pressable
              onPress={requestPermission}
              style={[styles.grantBtn, { backgroundColor: colors.primary, borderRadius: colors.radius }]}
            >
              <Text style={{ color: colors.primaryForeground, fontFamily: 'Inter_600SemiBold', fontWeight: '600' }}>
                Grant permission
              </Text>
            </Pressable>
            <Pressable onPress={onClose} style={{ marginTop: 14 }}>
              <Text style={{ color: colors.mutedForeground, fontFamily: 'Inter_500Medium' }}>Cancel</Text>
            </Pressable>
          </View>
        ) : (
          <>
            <CameraView
              style={StyleSheet.absoluteFillObject}
              barcodeScannerSettings={{ barcodeTypes: ['ean13', 'ean8', 'upc_a', 'code128', 'qr'] }}
              onBarcodeScanned={handleScan}
            />
            <View style={[styles.topBar, { top: insets.top + 12 }]}>
              <Text style={styles.hint}>Point camera at a barcode</Text>
            </View>
            <Pressable
              onPress={onClose}
              style={[styles.closeBtn, { bottom: insets.bottom + 32, backgroundColor: colors.card, borderRadius: colors.radius }]}
            >
              <Feather name="x" size={18} color={colors.foreground} />
              <Text style={{ color: colors.foreground, fontFamily: 'Inter_600SemiBold', fontWeight: '600', marginLeft: 6 }}>
                Close
              </Text>
            </Pressable>
          </>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 },
  permMsg: { fontSize: 15, fontFamily: 'Inter_500Medium', textAlign: 'center', marginTop: 12, marginBottom: 20 },
  grantBtn: { paddingHorizontal: 22, paddingVertical: 12 },
  topBar: { position: 'absolute', alignSelf: 'center' },
  hint: {
    color: '#fff',
    fontSize: 13,
    fontFamily: 'Inter_500Medium',
    backgroundColor: 'rgba(0,0,0,0.55)',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    overflow: 'hidden',
  },
  closeBtn: {
    position: 'absolute',
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
});

