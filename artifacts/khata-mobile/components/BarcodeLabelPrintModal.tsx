import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Platform, Share } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { BarcodeSvg } from './BarcodeSvg';

export function BarcodeLabelPrintModal({
  visible,
  onClose,
  businessName,
  productName,
  barcode,
  sellingPrice,
}: {
  visible: boolean;
  onClose: () => void;
  businessName?: string;
  productName: string;
  barcode: string;
  sellingPrice?: string;
}) {
  const triggerPrint = () => {
    // @ts-ignore — web-only
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      // @ts-ignore
      const node = document.getElementById('barcode-label-print-area');
      if (node) {
        // @ts-ignore
        const w = window.open('', '_blank', 'width=380,height=300');
        if (w) {
          w.document.write(`<html><head><title>Barcode Label</title>
            <style>
              body{font-family:Arial,sans-serif;text-align:center;padding:14px;}
              .biz{font-size:12px;font-weight:700;margin-bottom:2px;}
              .name{font-size:12px;margin-bottom:6px;}
              .price{font-size:13px;font-weight:700;margin-top:6px;}
            </style>
            </head><body>${node.innerHTML}</body></html>`);
          w.document.close();
          w.focus();
          w.print();
          w.close();
        }
      }
    } else {
      Share.share({
        message: `${businessName ?? ''}\n${productName}\nBarcode: ${barcode}${sellingPrice ? `\nPrice: ₹${sellingPrice}` : ''}`,
      });
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <View style={styles.headerRow}>
            <Text style={styles.title}>Barcode Label</Text>
            <TouchableOpacity onPress={onClose} hitSlop={8}>
              <Feather name="x" size={20} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <View nativeID="barcode-label-print-area" style={styles.labelBox}>
            {businessName ? <Text style={styles.biz}>{businessName}</Text> : null}
            <Text style={styles.name} numberOfLines={1}>{productName}</Text>
            <BarcodeSvg value={barcode} width={220} height={60} />
            {sellingPrice ? <Text style={styles.price}>₹ {sellingPrice}</Text> : null}
          </View>

          <View style={styles.btnRow}>
            <TouchableOpacity onPress={triggerPrint} style={[styles.btn, styles.btnPrimary]}>
              <Feather name="printer" size={15} color="#fff" />
              <Text style={styles.btnPrimaryText}>{Platform.OS === 'web' ? 'Print' : 'Share'}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onClose} style={[styles.btn, styles.btnGhost]}>
              <Text style={styles.btnGhostText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  card: { width: '100%', maxWidth: 340, backgroundColor: '#fff', borderRadius: 14, padding: 20 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  title: { fontSize: 16, fontWeight: '700', color: '#1F2937' },
  labelBox: { borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 10, paddingVertical: 16, alignItems: 'center' },
  biz: { fontSize: 12, fontWeight: '700', color: '#1F2937' },
  name: { fontSize: 12, color: '#374151', marginBottom: 6, maxWidth: 220 },
  price: { fontSize: 14, fontWeight: '700', color: '#1F2937', marginTop: 6 },
  btnRow: { flexDirection: 'row', gap: 10, marginTop: 16 },
  btn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 11, borderRadius: 10 },
  btnPrimary: { backgroundColor: '#5B21B6' },
  btnPrimaryText: { color: '#fff', fontWeight: '700', marginLeft: 6, fontSize: 13 },
  btnGhost: { borderWidth: 1, borderColor: '#E5E7EB' },
  btnGhostText: { color: '#1F2937', fontWeight: '600', fontSize: 13 },
});