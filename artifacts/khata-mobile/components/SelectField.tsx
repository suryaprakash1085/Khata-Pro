import React, { useState } from 'react';
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';

type Props = {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
  icon?: keyof typeof Feather.glyphMap;
  required?: boolean;
  error?: string;
  placeholder?: string;
};

export function SelectField({
  label,
  value,
  options,
  onChange,
  icon = 'chevron-down',
  required,
  error,
  placeholder = 'Select',
}: Props) {
  const colors = useColors();
  const [open, setOpen] = useState(false);

  return (
    <View style={styles.wrap}>
      <Text style={[styles.label, { color: colors.foreground }]}>
        {label}
        {required ? <Text style={{ color: colors.destructive }}> *</Text> : null}
      </Text>

      <Pressable
        onPress={() => setOpen(true)}
        style={[
          styles.trigger,
          {
            borderColor: error ? colors.destructive : colors.border,
            backgroundColor: colors.card,
            borderRadius: colors.radius,
          },
        ]}
      >
        <Feather name={icon} size={16} color={colors.mutedForeground} style={{ marginRight: 8 }} />
        <Text
          style={[
            styles.triggerText,
            { color: value ? colors.foreground : colors.mutedForeground },
          ]}
          numberOfLines={1}
        >
          {value || placeholder}
        </Text>
        <Feather name="chevron-down" size={18} color={colors.mutedForeground} />
      </Pressable>

      {error ? <Text style={[styles.errorText, { color: colors.destructive }]}>{error}</Text> : null}

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)}>
          <Pressable
            style={[styles.sheet, { backgroundColor: colors.background, borderRadius: colors.radius + 8 }]}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={[styles.sheetHeader, { borderBottomColor: colors.border }]}>
              <Text style={[styles.sheetTitle, { color: colors.foreground }]}>{label}</Text>
              <Pressable onPress={() => setOpen(false)} hitSlop={10}>
                <Feather name="x" size={20} color={colors.mutedForeground} />
              </Pressable>
            </View>
            <FlatList
              data={options}
              keyExtractor={(item) => item}
              style={{ maxHeight: 360 }}
              renderItem={({ item }) => {
                const active = item === value;
                return (
                  <Pressable
                    onPress={() => {
                      onChange(item);
                      setOpen(false);
                    }}
                    style={[styles.option, active && { backgroundColor: colors.muted }]}
                  >
                    <Text style={[styles.optionText, { color: colors.foreground }]}>{item}</Text>
                    {active ? <Feather name="check" size={16} color={colors.primary} /> : null}
                  </Pressable>
                );
              }}
            />
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 6 },
  label: { fontSize: 13, fontFamily: 'Inter_500Medium', fontWeight: '500' },
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    paddingHorizontal: 14,
    height: 48,
  },
  triggerText: { flex: 1, fontSize: 14, fontFamily: 'Inter_400Regular' },
  errorText: { fontSize: 12, fontFamily: 'Inter_400Regular' },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  sheet: {
    maxHeight: '70%',
    paddingBottom: 12,
    // @ts-ignore - centers as a dialog on wide/web screens instead of a bottom sheet
    ...(typeof window !== 'undefined' && window.innerWidth >= 820
      ? { alignSelf: 'center', width: 420, marginBottom: 'auto', marginTop: 'auto' }
      : {}),
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  sheetTitle: { fontSize: 16, fontFamily: 'Inter_700Bold', fontWeight: '700' },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  optionText: { fontSize: 14, fontFamily: 'Inter_400Regular' },
});