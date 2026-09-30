import React, { useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { useColors } from '@/hooks/useColors';
import { AIAssistantPanel } from './AIAssistantPanel';

interface Props {
  topOffset?: number;
}

export function AIAssistantButton({ topOffset = 16 }: Props) {
  const colors = useColors();
  const [open, setOpen] = useState(false);

  return (
    <>
      {open && <AIAssistantPanel onClose={() => setOpen(false)} topOffset={topOffset} />}

      {!open && (
        <Pressable
          onPress={() => setOpen(true)}
          style={[
            styles.trigger,
            {
              top: topOffset,
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
        >
          <Text style={{ fontSize: 16 }}>🤖</Text>
        </Pressable>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  // Small, icon-only circle — same footprint as the header's Bell/Profile
  // buttons (38x38) so it sits neatly in the top-right corner near them
  // instead of a wide pill with a text label.
  trigger: {
    position: Platform.OS === 'web' ? ('fixed' as any) : 'absolute',
    // 16 (profile's own right gap) + 38 (profile width) + 10 (spacing) —
    // sits immediately to the left of the Profile button, same row.
    right: 64,
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    // @ts-ignore
    boxShadow: '0 4px 14px rgba(0,0,0,0.15)',
    // @ts-ignore
    zIndex: 999,
  },
});