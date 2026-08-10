// import React from 'react';
// import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';
// import { useColors } from '@/hooks/useColors';

// type Props = TextInputProps & {
//   label: string;
//   error?: string;
// };

// export function FormField({ label, error, style, ...rest }: Props) {
//   const colors = useColors();
//   return (
//     <View style={styles.wrap}>
//       <Text style={[styles.label, { color: colors.mutedForeground }]}>{label}</Text>
//       <TextInput
//         placeholderTextColor={colors.mutedForeground}
//         style={[
//           styles.input,
//           {
//             backgroundColor: colors.card,
//             borderColor: error ? colors.destructive : colors.border,
//             color: colors.foreground,
//             borderRadius: colors.radius,
//           },
//           style,
//         ]}
//         {...rest}
//       />
//       {error ? <Text style={[styles.error, { color: colors.destructive }]}>{error}</Text> : null}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   wrap: { gap: 6 },
//   label: { fontSize: 13, fontFamily: 'Inter_500Medium', fontWeight: '500' },
//   input: {
//     borderWidth: 1,
//     paddingHorizontal: 14,
//     paddingVertical: 13,
//     fontSize: 16,
//     fontFamily: 'Inter_400Regular',
//   },
//   error: { fontSize: 12, fontFamily: 'Inter_400Regular' },
// });
import React from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, View, Platform } from 'react-native';
import { useColors } from '@/hooks/useColors';

type Props = TextInputProps & {
  label: string;
  error?: string;
  required?: boolean;
  /** 'stack' = label above input (default). 'row' = label left, input right — matches the desktop form design. */
  layout?: 'stack' | 'row';
  labelWidth?: number;
};

export function FormField({ label, error, style, required, layout = 'stack', labelWidth = 120, ...rest }: Props) {
  const colors = useColors();

  const inputEl = (
    <TextInput
      placeholderTextColor={colors.mutedForeground}
      style={[
        layout === 'row' ? styles.inputRow : styles.input,
        {
          backgroundColor: colors.card,
          borderColor: error ? colors.destructive : colors.border,
          color: colors.foreground,
          borderRadius: 8,
        },
        style,
      ]}
      {...rest}
    />
  );

  if (layout === 'row') {
    return (
      <View>
        <View style={styles.rowWrap}>
          <View style={{ width: labelWidth }}>
            <Text style={[styles.rowLabel, { color: colors.foreground }]}>
              {label}
              {required ? <Text style={{ color: colors.destructive }}> *</Text> : null}
            </Text>
          </View>
          <View style={styles.rowInput}>{inputEl}</View>
        </View>
        {error ? <Text style={[styles.error, { color: colors.destructive, marginLeft: labelWidth }]}>{error}</Text> : null}
      </View>
    );
  }

  return (
  <View style={styles.wrap}>
    {label ? (
      <Text style={[styles.label, { color: colors.mutedForeground }]}>{label}</Text>
    ) : null}
    {inputEl}
    {error ? <Text style={[styles.error, { color: colors.destructive }]}>{error}</Text> : null}
  </View>
);
}

const styles = StyleSheet.create({
  wrap: { gap: 4 },
  label: { fontSize: 12, fontFamily: Platform.OS === 'ios' ? 'Times New Roman' : 'serif', fontWeight: '500' },
  input: {
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 9,
    fontSize: 14,
    fontFamily: Platform.OS === 'ios' ? 'Times New Roman' : 'serif',
  },
  error: { fontSize: 11, fontFamily: Platform.OS === 'ios' ? 'Times New Roman' : 'serif' },

  // Row layout — label left, input right (matches the design model)
  rowWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  rowLabel: {
    fontSize: 13,
    fontFamily: Platform.OS === 'ios' ? 'Times New Roman' : 'serif',
    fontWeight: '500',
  },
  rowInput: {
    // capped, not full-width — matches the compact design model
    maxWidth: 180,
  },
  inputRow: {
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 13,
    fontFamily: Platform.OS === 'ios' ? 'Times New Roman' : 'serif',
  },
});