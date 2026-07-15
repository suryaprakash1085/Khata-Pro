import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useColors } from '@/hooks/useColors';
import { initials } from '@/lib/format';

const PALETTE = ['#2563EB', '#059669', '#F59E0B', '#DC2626', '#7C3AED', '#0EA5E9', '#DB2777'];

function colorForName(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return PALETTE[Math.abs(hash) % PALETTE.length];
}

export function Avatar({ name, size = 44 }: { name: string; size?: number }) {
  const colors = useColors();
  const bg = colorForName(name || '?');
  return (
    <View
      style={[
        styles.circle,
        { width: size, height: size, borderRadius: size / 2, backgroundColor: bg },
      ]}
    >
      <Text style={[styles.text, { fontSize: size * 0.38, color: colors.primaryForeground }]}>
        {initials(name)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  circle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontFamily: 'Inter_600SemiBold',
    fontWeight: '600',
  },
});
