import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Rect } from 'react-native-svg';
import { encodeBarcode } from '@/lib/barcode';

export function BarcodeSvg({
  value,
  width = 230,
  height = 64,
  showValue = true,
  barColor = '#111827',
  background = '#FFFFFF',
}: {
  value: string;
  width?: number;
  height?: number;
  showValue?: boolean;
  barColor?: string;
  background?: string;
}) {
  const encoded = encodeBarcode(value);

  if (!encoded) {
    return (
      <View style={[styles.wrap, { width, height, backgroundColor: background }]}>
        <Text style={styles.errorText}>Unable to render barcode</Text>
      </View>
    );
  }

  const { pattern } = encoded;
  const moduleWidth = width / pattern.length;
  const bars: React.ReactNode[] = [];
  let x = 0;
  for (let i = 0; i < pattern.length; i++) {
    if (pattern[i] === '1') {
      bars.push(<Rect key={i} x={x} y={0} width={moduleWidth} height={height} fill={barColor} />);
    }
    x += moduleWidth;
  }

  return (
    <View style={[styles.wrap, { width, backgroundColor: background }]}>
      <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        {bars}
      </Svg>
      {showValue ? <Text style={styles.valueText}>{value}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', paddingVertical: 8, borderRadius: 8 },
  valueText: { marginTop: 6, fontSize: 13, fontWeight: '700', letterSpacing: 2, color: '#111827' },
  errorText: { fontSize: 11, color: '#DC2626', textAlign: 'center', padding: 10 },
});