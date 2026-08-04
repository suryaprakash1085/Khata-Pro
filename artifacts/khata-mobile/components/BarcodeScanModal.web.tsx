// BarcodeScanModal.web.tsx
// This file is ONLY used when the app runs in a web browser.
// The bundler picks this automatically because of the ".web.tsx" name —
// billing.tsx keeps importing "@/components/BarcodeScanModal" unchanged.
//
// Uses the laptop/desktop webcam + the ZXing library to read barcodes.
// Needs: pnpm add @zxing/library @zxing/browser

import React, { useEffect, useRef, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { useColors } from '@/hooks/useColors';
import { BrowserMultiFormatReader } from '@zxing/browser';
import { NotFoundException } from '@zxing/library';

interface Props {
  visible: boolean;
  onClose: () => void;
  onScanned: (code: string) => void;
}

export function BarcodeScanModal({ visible, onClose, onScanned }: Props) {
  const colors = useColors();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const controlsRef = useRef<{ stop: () => void } | null>(null);
  const lockedRef = useRef(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!visible) return;
    setError(null);
    lockedRef.current = false;

    const reader = new BrowserMultiFormatReader();
    let cancelled = false;

    reader
      .decodeFromVideoDevice(undefined, videoRef.current as HTMLVideoElement, (result, err, controls) => {
        controlsRef.current = controls;
        if (cancelled) return;

        if (result && !lockedRef.current) {
          lockedRef.current = true;
          onScanned(result.getText());
          setTimeout(() => {
            lockedRef.current = false;
          }, 800);
        }
        // NotFoundException fires continuously while no barcode is in view —
        // that's normal, not a real error, so we ignore it.
        if (err && !(err instanceof NotFoundException)) {
          console.warn('Barcode scan error:', err);
        }
      })
      .catch((e: any) => {
        setError(
          e?.name === 'NotAllowedError'
            ? 'Camera permission denied. Please allow camera access in your browser and try again.'
            : `Could not access webcam: ${e?.message ?? 'unknown error'}`,
        );
      });

    return () => {
      cancelled = true;
      controlsRef.current?.stop();
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <Modal visible animationType="slide" onRequestClose={onClose} transparent={false}>
      <View style={[styles.container, { backgroundColor: '#000' }]}>
        {error ? (
          <View style={[styles.center, { backgroundColor: colors.background }]}>
            <Text style={{ color: colors.foreground, textAlign: 'center', marginBottom: 16, fontSize: 15 }}>
              {error}
            </Text>
            <Pressable
              onPress={onClose}
              style={[styles.closeBtn, { backgroundColor: colors.primary, borderRadius: colors.radius }]}
            >
              <Text style={{ color: colors.primaryForeground, fontWeight: '600' }}>Close</Text>
            </Pressable>
          </View>
        ) : (
          <>
            {/* Raw HTML video element — this file only runs on web, so this is safe */}
            <video ref={videoRef as any} style={videoStyle} muted playsInline />
            <View style={styles.topBar}>
              <Text style={styles.hint}>Point your webcam at a barcode</Text>
            </View>
            <Pressable
              onPress={onClose}
              style={[styles.closeBtnFloating, { backgroundColor: colors.card, borderRadius: colors.radius }]}
            >
              <Text style={{ color: colors.foreground, fontWeight: '600' }}>Close</Text>
            </Pressable>
          </>
        )}
      </View>
    </Modal>
  );
}

const videoStyle: any = {
  width: '100%',
  height: '100%',
  objectFit: 'cover',
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 },
  topBar: { position: 'absolute', top: 24, alignSelf: 'center' },
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
  closeBtn: { paddingHorizontal: 22, paddingVertical: 12 },
  closeBtnFloating: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
});