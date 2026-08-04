// // // // // import React from 'react';
// // // // // import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
// // // // // import { router, useLocalSearchParams } from 'expo-router';
// // // // // import { Feather } from '@expo/vector-icons';
// // // // // import { useSafeAreaInsets } from 'react-native-safe-area-context';
// // // // // import { useColors } from '@/hooks/useColors';
// // // // // import { useBusiness } from '@/contexts/BusinessContext';
// // // // // import {
// // // // //   useGetCustomer,
// // // // //   useListTransactions,
// // // // //   getGetCustomerQueryKey,
// // // // //   getListTransactionsQueryKey,
// // // // // } from '@workspace/api-client-react';
// // // // // import type { Transaction } from '@workspace/api-client-react';
// // // // // import { Avatar } from '@/components/Avatar';
// // // // // import { BalancePill } from '@/components/BalancePill';
// // // // // import { EmptyState } from '@/components/EmptyState';
// // // // // import { formatCurrency, formatDateTime } from '@/lib/format';

// // // // // export default function CustomerLedgerScreen() {
// // // // //   const colors = useColors();
// // // // //   const insets = useSafeAreaInsets();
// // // // //   const { id } = useLocalSearchParams<{ id: string }>();
// // // // //   const customerId = Number(id);
// // // // //   const { business } = useBusiness();

// // // // //   const { data: customer, isLoading: customerLoading } = useGetCustomer(customerId, {
// // // // //     query: { enabled: !!customerId, queryKey: getGetCustomerQueryKey(customerId) },
// // // // //   });
// // // // //   const txParams = { business_id: business?.id as number, customer_id: customerId, limit: 200 };
// // // // //   const {
// // // // //     data: txData,
// // // // //     isLoading: txLoading,
// // // // //     refetch,
// // // // //     isRefetching,
// // // // //   } = useListTransactions(txParams, {
// // // // //     query: { enabled: !!business?.id && !!customerId, queryKey: getListTransactionsQueryKey(txParams) },
// // // // //   });

// // // // //   const transactions = txData?.data ?? [];

// // // // //   if (customerLoading) {
// // // // //     return (
// // // // //       <View style={{ flex: 1, backgroundColor: colors.background, justifyContent: 'center' }}>
// // // // //         <ActivityIndicator color={colors.primary} />
// // // // //       </View>
// // // // //     );
// // // // //   }

// // // // //   const renderItem = ({ item }: { item: Transaction }) => {
// // // // //     const isGave = item.type === 'you_gave';
// // // // //     // Backend: you_gave ADDS to balance (customer owes more), you_got SUBTRACTS.
// // // // //     // So the sign shown here must match that: '+' for you_gave, '-' for you_got.
// // // // //     return (
// // // // //       <View style={[styles.txRow, { borderBottomColor: colors.border }]}>
// // // // //         <View style={{ flex: 1 }}>
// // // // //           <Text style={[styles.txType, { color: isGave ? colors.destructive : colors.success }]}>
// // // // //             {isGave ? 'You gave' : 'You got'}
// // // // //           </Text>
// // // // //           {item.description ? (
// // // // //             <Text style={[styles.txDesc, { color: colors.mutedForeground }]} numberOfLines={1}>
// // // // //               {item.description}
// // // // //             </Text>
// // // // //           ) : null}
// // // // //           <Text style={[styles.txDate, { color: colors.mutedForeground }]}>{formatDateTime(item.entry_date)}</Text>
// // // // //         </View>
// // // // //         <View style={{ alignItems: 'flex-end' }}>
// // // // //           <Text style={[styles.txAmount, { color: isGave ? colors.destructive : colors.success }]}>
// // // // //             {isGave ? '+' : '-'}
// // // // //             {formatCurrency(item.amount, business?.currency)}
// // // // //           </Text>
// // // // //           <Text style={[styles.txBalance, { color: colors.mutedForeground }]}>
// // // // //             Bal: {formatCurrency(item.balance_after, business?.currency)}
// // // // //           </Text>
// // // // //         </View>
// // // // //       </View>
// // // // //     );
// // // // //   };

// // // // //   return (
// // // // //     <View style={{ flex: 1, backgroundColor: colors.background }}>
// // // // //       <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
// // // // //         <Avatar name={customer?.name ?? '?'} size={52} />
// // // // //         <View style={{ flex: 1, marginLeft: 12 }}>
// // // // //           <Text style={[styles.name, { color: colors.foreground }]} numberOfLines={1}>
// // // // //             {customer?.name}
// // // // //           </Text>
// // // // //           <Text style={[styles.phone, { color: colors.mutedForeground }]}>{customer?.phone}</Text>
// // // // //         </View>
// // // // //         <BalancePill balance={customer?.current_balance ?? 0} currency={business?.currency} />
// // // // //       </View>

// // // // //       {txLoading ? (
// // // // //         <ActivityIndicator style={{ marginTop: 40 }} color={colors.primary} />
// // // // //       ) : (
// // // // //         <FlatList
// // // // //           data={transactions}
// // // // //           keyExtractor={(t) => String(t.id)}
// // // // //           renderItem={renderItem}
// // // // //           refreshing={isRefetching}
// // // // //           onRefresh={refetch}
// // // // //           contentContainerStyle={{ paddingBottom: insets.bottom + 110, flexGrow: 1 }}
// // // // //           ListEmptyComponent={
// // // // //             <EmptyState icon="file-text" title="No entries yet" subtitle="Add the first ledger entry for this customer" />
// // // // //           }
// // // // //         />
// // // // //       )}

// // // // //       <View style={[styles.actionsRow, { paddingBottom: insets.bottom + 16, backgroundColor: colors.background }]}>
// // // // //         <Pressable
// // // // //           onPress={() => router.push({ pathname: '/add-transaction', params: { customerId: String(customerId), type: 'you_gave' } })}
// // // // //           style={[styles.actionBtn, { backgroundColor: colors.destructive, borderRadius: colors.radius }]}
// // // // //         >
// // // // //           <Feather name="arrow-up-right" size={16} color={colors.destructiveForeground} />
// // // // //           <Text style={[styles.actionLabel, { color: colors.destructiveForeground }]}>You gave</Text>
// // // // //         </Pressable>
// // // // //         <Pressable
// // // // //           onPress={() => router.push({ pathname: '/add-transaction', params: { customerId: String(customerId), type: 'you_got' } })}
// // // // //           style={[styles.actionBtn, { backgroundColor: colors.success, borderRadius: colors.radius }]}
// // // // //         >
// // // // //           <Feather name="arrow-down-left" size={16} color={colors.successForeground} />
// // // // //           <Text style={[styles.actionLabel, { color: colors.successForeground }]}>You got</Text>
// // // // //         </Pressable>
// // // // //       </View>
// // // // //     </View>
// // // // //   );
// // // // // }

// // // // // const styles = StyleSheet.create({
// // // // //   header: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1 },
// // // // //   name: { fontSize: 17, fontFamily: 'Inter_700Bold', fontWeight: '700' },
// // // // //   phone: { fontSize: 12, fontFamily: 'Inter_400Regular', marginTop: 2 },
// // // // //   txRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 14, borderBottomWidth: 1 },
// // // // //   txType: { fontSize: 14, fontFamily: 'Inter_600SemiBold', fontWeight: '600' },
// // // // //   txDesc: { fontSize: 12, fontFamily: 'Inter_400Regular', marginTop: 2 },
// // // // //   txDate: { fontSize: 11, fontFamily: 'Inter_400Regular', marginTop: 3 },
// // // // //   txAmount: { fontSize: 15, fontFamily: 'Inter_700Bold', fontWeight: '700' },
// // // // //   txBalance: { fontSize: 11, fontFamily: 'Inter_400Regular', marginTop: 2 },
// // // // //   actionsRow: {
// // // // //     position: 'absolute',
// // // // //     left: 0,
// // // // //     right: 0,
// // // // //     bottom: 0,
// // // // //     flexDirection: 'row',
// // // // //     gap: 12,
// // // // //     paddingHorizontal: 20,
// // // // //     paddingTop: 12,
// // // // //   },
// // // // //   actionBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 14 },
// // // // //   actionLabel: { fontSize: 15, fontFamily: 'Inter_600SemiBold', fontWeight: '600' },
// // // // // });

// // // // import React from 'react';
// // // // import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
// // // // import { router, useLocalSearchParams } from 'expo-router';
// // // // import { Feather } from '@expo/vector-icons';
// // // // import { useSafeAreaInsets } from 'react-native-safe-area-context';
// // // // import { useColors } from '@/hooks/useColors';
// // // // import { useBusiness } from '@/contexts/BusinessContext';
// // // // import {
// // // //   useGetCustomer,
// // // //   useListTransactions,
// // // //   getGetCustomerQueryKey,
// // // //   getListTransactionsQueryKey,
// // // // } from '@workspace/api-client-react';
// // // // import type { Transaction } from '@workspace/api-client-react';
// // // // import { Avatar } from '@/components/Avatar';
// // // // import { BalancePill } from '@/components/BalancePill';
// // // // import { EmptyState } from '@/components/EmptyState';
// // // // import { formatCurrency, formatDateTime } from '@/lib/format';

// // // // export default function CustomerLedgerScreen() {
// // // //   const colors = useColors();
// // // //   const insets = useSafeAreaInsets();
// // // //   const { id } = useLocalSearchParams<{ id: string }>();
// // // //   const customerId = Number(id);
// // // //   const { business } = useBusiness();

// // // //   const { data: customer, isLoading: customerLoading } = useGetCustomer(customerId, {
// // // //     query: { enabled: !!customerId, queryKey: getGetCustomerQueryKey(customerId) },
// // // //   });
// // // //   const txParams = { business_id: business?.id as number, customer_id: customerId, limit: 200 };
// // // //   const {
// // // //     data: txData,
// // // //     isLoading: txLoading,
// // // //     refetch,
// // // //     isRefetching,
// // // //   } = useListTransactions(txParams, {
// // // //     query: { enabled: !!business?.id && !!customerId, queryKey: getListTransactionsQueryKey(txParams) },
// // // //   });

// // // //   const transactions = txData?.data ?? [];

// // // //   if (customerLoading) {
// // // //     return (
// // // //       <View style={{ flex: 1, backgroundColor: colors.background, justifyContent: 'center' }}>
// // // //         <ActivityIndicator color={colors.primary} />
// // // //       </View>
// // // //     );
// // // //   }

// // // //   const renderItem = ({ item, index }: { item: Transaction; index: number }) => {
// // // //     const isGave = item.type === 'you_gave';
// // // //     const zebra = index % 2 === 1;
// // // //     // Backend: you_gave ADDS to balance (customer owes more), you_got SUBTRACTS.
// // // //     return (
// // // //       <View
// // // //         style={[
// // // //           styles.tableRow,
// // // //           { borderBottomColor: colors.border, backgroundColor: zebra ? colors.muted : colors.background },
// // // //         ]}
// // // //       >
// // // //         {/* Date column */}
// // // //         <View style={styles.colDate}>
// // // //           <Text style={[styles.cellDatePrimary, { color: colors.foreground }]}>{formatDateTime(item.entry_date)}</Text>
// // // //         </View>

// // // //         {/* Particulars column */}
// // // //         <View style={styles.colParticulars}>
// // // //           <Text style={[styles.cellParticularsTitle, { color: colors.foreground }]} numberOfLines={1}>
// // // //             {item.description || (isGave ? 'You gave' : 'You got')}
// // // //           </Text>
// // // //           {item.description ? (
// // // //             <Text style={[styles.cellParticularsSub, { color: colors.mutedForeground }]} numberOfLines={1}>
// // // //               {isGave ? 'You gave' : 'You got'}
// // // //             </Text>
// // // //           ) : null}
// // // //         </View>

// // // //         {/* You Gave column */}
// // // //         <View style={styles.colAmount}>
// // // //           {isGave ? (
// // // //             <Text style={[styles.cellAmount, { color: colors.destructive }]}>
// // // //               {formatCurrency(item.amount, business?.currency)}
// // // //             </Text>
// // // //           ) : (
// // // //             <Text style={[styles.cellAmount, { color: colors.mutedForeground }]}>-</Text>
// // // //           )}
// // // //         </View>

// // // //         {/* You Got column */}
// // // //         <View style={styles.colAmount}>
// // // //           {!isGave ? (
// // // //             <Text style={[styles.cellAmount, { color: colors.success }]}>
// // // //               {formatCurrency(item.amount, business?.currency)}
// // // //             </Text>
// // // //           ) : (
// // // //             <Text style={[styles.cellAmount, { color: colors.mutedForeground }]}>-</Text>
// // // //           )}
// // // //         </View>

// // // //         {/* Balance column */}
// // // //         <View style={styles.colBalance}>
// // // //           <Text style={[styles.cellBalance, { color: colors.foreground }]}>
// // // //             {formatCurrency(item.balance_after, business?.currency)}
// // // //           </Text>
// // // //         </View>
// // // //       </View>
// // // //     );
// // // //   };

// // // //   const TableHeader = () => (
// // // //     <View style={[styles.tableHeader, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
// // // //       <Text style={[styles.headerCell, styles.colDate, { color: colors.mutedForeground }]}>DATE</Text>
// // // //       <Text style={[styles.headerCell, styles.colParticulars, { color: colors.mutedForeground }]}>PARTICULARS</Text>
// // // //       <Text style={[styles.headerCell, styles.colAmount, { color: colors.mutedForeground, textAlign: 'right' }]}>
// // // //         YOU GAVE
// // // //       </Text>
// // // //       <Text style={[styles.headerCell, styles.colAmount, { color: colors.mutedForeground, textAlign: 'right' }]}>
// // // //         YOU GOT
// // // //       </Text>
// // // //       <Text style={[styles.headerCell, styles.colBalance, { color: colors.mutedForeground, textAlign: 'right' }]}>
// // // //         BALANCE
// // // //       </Text>
// // // //     </View>
// // // //   );

// // // //   return (
// // // //     <View style={{ flex: 1, backgroundColor: colors.background }}>
// // // //       <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
// // // //         <Avatar name={customer?.name ?? '?'} size={52} />
// // // //         <View style={{ flex: 1, marginLeft: 12 }}>
// // // //           <Text style={[styles.name, { color: colors.foreground }]} numberOfLines={1}>
// // // //             {customer?.name}
// // // //           </Text>
// // // //           <Text style={[styles.phone, { color: colors.mutedForeground }]}>{customer?.phone}</Text>
// // // //         </View>
// // // //         <BalancePill balance={customer?.current_balance ?? 0} currency={business?.currency} />
// // // //       </View>

// // // //       {txLoading ? (
// // // //         <ActivityIndicator style={{ marginTop: 40 }} color={colors.primary} />
// // // //       ) : transactions.length === 0 ? (
// // // //         <EmptyState icon="file-text" title="No entries yet" subtitle="Add the first ledger entry for this customer" />
// // // //       ) : (
// // // //         <FlatList
// // // //           data={transactions}
// // // //           keyExtractor={(t) => String(t.id)}
// // // //           renderItem={renderItem}
// // // //           refreshing={isRefetching}
// // // //           onRefresh={refetch}
// // // //           ListHeaderComponent={TableHeader}
// // // //           stickyHeaderIndices={[0]}
// // // //           contentContainerStyle={{ paddingBottom: insets.bottom + 110, flexGrow: 1 }}
// // // //         />
// // // //       )}

// // // //       <View style={[styles.actionsRow, { paddingBottom: insets.bottom + 16, backgroundColor: colors.background }]}>
// // // //         <Pressable
// // // //           onPress={() => router.push({ pathname: '/add-transaction', params: { customerId: String(customerId), type: 'you_gave' } })}
// // // //           style={[styles.actionBtn, { backgroundColor: colors.destructive, borderRadius: colors.radius }]}
// // // //         >
// // // //           <Feather name="arrow-up-right" size={16} color={colors.destructiveForeground} />
// // // //           <Text style={[styles.actionLabel, { color: colors.destructiveForeground }]}>You gave</Text>
// // // //         </Pressable>
// // // //         <Pressable
// // // //           onPress={() => router.push({ pathname: '/add-transaction', params: { customerId: String(customerId), type: 'you_got' } })}
// // // //           style={[styles.actionBtn, { backgroundColor: colors.success, borderRadius: colors.radius }]}
// // // //         >
// // // //           <Feather name="arrow-down-left" size={16} color={colors.successForeground} />
// // // //           <Text style={[styles.actionLabel, { color: colors.successForeground }]}>You got</Text>
// // // //         </Pressable>
// // // //       </View>
// // // //     </View>
// // // //   );
// // // // }

// // // // const styles = StyleSheet.create({
// // // //   header: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1 },
// // // //   name: { fontSize: 17, fontFamily: 'Inter_700Bold', fontWeight: '700' },
// // // //   phone: { fontSize: 12, fontFamily: 'Inter_400Regular', marginTop: 2 },

// // // //   // Table header
// // // //   tableHeader: {
// // // //     flexDirection: 'row',
// // // //     alignItems: 'center',
// // // //     paddingHorizontal: 12,
// // // //     paddingVertical: 10,
// // // //     borderBottomWidth: 1,
// // // //   },
// // // //   headerCell: {
// // // //     fontSize: 10,
// // // //     fontFamily: 'Inter_600SemiBold',
// // // //     fontWeight: '600',
// // // //     letterSpacing: 0.4,
// // // //   },

// // // //   // Table row
// // // //   tableRow: {
// // // //     flexDirection: 'row',
// // // //     alignItems: 'center',
// // // //     paddingHorizontal: 12,
// // // //     paddingVertical: 12,
// // // //     borderBottomWidth: 1,
// // // //   },

// // // //   // Column widths (flex-based, consistent across header + rows)
// // // //   colDate: { flex: 1.1, paddingRight: 6 },
// // // //   colParticulars: { flex: 2, paddingRight: 6 },
// // // //   colAmount: { flex: 1.2, alignItems: 'flex-end' },
// // // //   colBalance: { flex: 1.2, alignItems: 'flex-end' },

// // // //   cellDatePrimary: { fontSize: 11.5, fontFamily: 'Inter_400Regular' },
// // // //   cellParticularsTitle: { fontSize: 13, fontFamily: 'Inter_600SemiBold', fontWeight: '600' },
// // // //   cellParticularsSub: { fontSize: 10.5, fontFamily: 'Inter_400Regular', marginTop: 1 },
// // // //   cellAmount: { fontSize: 12.5, fontFamily: 'Inter_600SemiBold', fontWeight: '600', textAlign: 'right' },
// // // //   cellBalance: { fontSize: 12.5, fontFamily: 'Inter_700Bold', fontWeight: '700', textAlign: 'right' },

// // // //   actionsRow: {
// // // //     position: 'absolute',
// // // //     left: 0,
// // // //     right: 0,
// // // //     bottom: 0,
// // // //     flexDirection: 'row',
// // // //     gap: 12,
// // // //     paddingHorizontal: 20,
// // // //     paddingTop: 12,
// // // //   },
// // // //   actionBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 14 },
// // // //   actionLabel: { fontSize: 15, fontFamily: 'Inter_600SemiBold', fontWeight: '600' },
// // // // });

// // // import React from 'react';
// // // import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
// // // import { router, useLocalSearchParams } from 'expo-router';
// // // import { Feather } from '@expo/vector-icons';
// // // import { useSafeAreaInsets } from 'react-native-safe-area-context';
// // // import { useColors } from '@/hooks/useColors';
// // // import { useBusiness } from '@/contexts/BusinessContext';
// // // import {
// // //   useGetCustomer,
// // //   useListTransactions,
// // //   getGetCustomerQueryKey,
// // //   getListTransactionsQueryKey,
// // // } from '@workspace/api-client-react';
// // // import type { Transaction } from '@workspace/api-client-react';
// // // import { Avatar } from '@/components/Avatar';
// // // import { BalancePill } from '@/components/BalancePill';
// // // import { EmptyState } from '@/components/EmptyState';
// // // import { formatCurrency, formatDateTime } from '@/lib/format';

// // // export default function CustomerLedgerScreen() {
// // //   const colors = useColors();
// // //   const insets = useSafeAreaInsets();
// // //   const { id } = useLocalSearchParams<{ id: string }>();
// // //   const customerId = Number(id);
// // //   const { business } = useBusiness();

// // //   const { data: customer, isLoading: customerLoading } = useGetCustomer(customerId, {
// // //     query: { enabled: !!customerId, queryKey: getGetCustomerQueryKey(customerId) },
// // //   });
// // //   const txParams = { business_id: business?.id as number, customer_id: customerId, limit: 200 };
// // //   const {
// // //     data: txData,
// // //     isLoading: txLoading,
// // //     refetch,
// // //     isRefetching,
// // //   } = useListTransactions(txParams, {
// // //     query: { enabled: !!business?.id && !!customerId, queryKey: getListTransactionsQueryKey(txParams) },
// // //   });

// // //   // Every real "bill" is a you_gave transaction (items + total at time of sale).
// // //   // you_got entries are just payment settlements, not bills — hide them here.
// // //   const bills = (txData?.data ?? []).filter((t: Transaction) => t.type === 'you_gave');

// // //   if (customerLoading) {
// // //     return (
// // //       <View style={{ flex: 1, backgroundColor: colors.background, justifyContent: 'center' }}>
// // //         <ActivityIndicator color={colors.primary} />
// // //       </View>
// // //     );
// // //   }

// // //   const renderItem = ({ item, index }: { item: Transaction; index: number }) => {
// // //     const zebra = index % 2 === 1;
// // //     return (
// // //       <Pressable
// // //         style={[
// // //           styles.tableRow,
// // //           { borderBottomColor: colors.border, backgroundColor: zebra ? colors.muted : colors.background },
// // //         ]}
// // //       >
// // //         {/* Date column */}
// // //         <View style={styles.colDate}>
// // //           <Text style={[styles.cellDate, { color: colors.foreground }]}>{formatDateTime(item.entry_date)}</Text>
// // //         </View>

// // //         {/* Items column */}
// // //         <View style={styles.colItems}>
// // //           <Text style={[styles.cellItems, { color: colors.foreground }]} numberOfLines={2}>
// // //             {item.description || '—'}
// // //           </Text>
// // //         </View>

// // //         {/* Total column */}
// // //         <View style={styles.colTotal}>
// // //           <Text style={[styles.cellTotal, { color: colors.foreground }]}>
// // //             {formatCurrency(item.amount, business?.currency)}
// // //           </Text>
// // //         </View>
// // //       </Pressable>
// // //     );
// // //   };

// // //   const TableHeader = () => (
// // //     <View style={[styles.tableHeader, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
// // //       <Text style={[styles.headerCell, styles.colDate, { color: colors.mutedForeground }]}>DATE</Text>
// // //       <Text style={[styles.headerCell, styles.colItems, { color: colors.mutedForeground }]}>ITEMS</Text>
// // //       <Text style={[styles.headerCell, styles.colTotal, { color: colors.mutedForeground, textAlign: 'right' }]}>
// // //         TOTAL
// // //       </Text>
// // //     </View>
// // //   );

// // //   return (
// // //     <View style={{ flex: 1, backgroundColor: colors.background }}>
// // //       <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
// // //         <Avatar name={customer?.name ?? '?'} size={52} />
// // //         <View style={{ flex: 1, marginLeft: 12 }}>
// // //           <Text style={[styles.name, { color: colors.foreground }]} numberOfLines={1}>
// // //             {customer?.name}
// // //           </Text>
// // //           <Text style={[styles.phone, { color: colors.mutedForeground }]}>{customer?.phone}</Text>
// // //         </View>
// // //         <BalancePill balance={customer?.current_balance ?? 0} currency={business?.currency} />
// // //       </View>

// // //       {txLoading ? (
// // //         <ActivityIndicator style={{ marginTop: 40 }} color={colors.primary} />
// // //       ) : bills.length === 0 ? (
// // //         <EmptyState icon="file-text" title="No bills yet" subtitle="Create the first bill for this customer" />
// // //       ) : (
// // //         <FlatList
// // //           data={bills}
// // //           keyExtractor={(t) => String(t.id)}
// // //           renderItem={renderItem}
// // //           refreshing={isRefetching}
// // //           onRefresh={refetch}
// // //           ListHeaderComponent={TableHeader}
// // //           stickyHeaderIndices={[0]}
// // //           contentContainerStyle={{ paddingBottom: insets.bottom + 90, flexGrow: 1 }}
// // //         />
// // //       )}

// // //       <View style={[styles.actionsRow, { paddingBottom: insets.bottom + 16, backgroundColor: colors.background }]}>
// // //         <Pressable
// // //           onPress={() => router.push({ pathname: '/billing', params: { customerId: String(customerId) } })}
// // //           style={[styles.newBillBtn, { backgroundColor: colors.primary, borderRadius: colors.radius }]}
// // //         >
// // //           <Feather name="plus" size={18} color={colors.primaryForeground} />
// // //           <Text style={[styles.newBillLabel, { color: colors.primaryForeground }]}>New Bill</Text>
// // //         </Pressable>
// // //       </View>
// // //     </View>
// // //   );
// // // }

// // // const styles = StyleSheet.create({
// // //   header: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1 },
// // //   name: { fontSize: 17, fontFamily: 'Inter_700Bold', fontWeight: '700' },
// // //   phone: { fontSize: 12, fontFamily: 'Inter_400Regular', marginTop: 2 },

// // //   // Table header
// // //   tableHeader: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     paddingHorizontal: 16,
// // //     paddingVertical: 10,
// // //     borderBottomWidth: 1,
// // //   },
// // //   headerCell: {
// // //     fontSize: 10,
// // //     fontFamily: 'Inter_600SemiBold',
// // //     fontWeight: '600',
// // //     letterSpacing: 0.4,
// // //   },

// // //   // Table row
// // //   tableRow: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     paddingHorizontal: 16,
// // //     paddingVertical: 14,
// // //     borderBottomWidth: 1,
// // //   },

// // //   // Column widths (flex-based, consistent across header + rows)
// // //   colDate: { flex: 1, paddingRight: 8 },
// // //   colItems: { flex: 2.4, paddingRight: 8 },
// // //   colTotal: { flex: 1, alignItems: 'flex-end' },

// // //   cellDate: { fontSize: 12, fontFamily: 'Inter_400Regular' },
// // //   cellItems: { fontSize: 13, fontFamily: 'Inter_500Medium', lineHeight: 18 },
// // //   cellTotal: { fontSize: 14, fontFamily: 'Inter_700Bold', fontWeight: '700', textAlign: 'right' },

// // //   actionsRow: {
// // //     position: 'absolute',
// // //     left: 0,
// // //     right: 0,
// // //     bottom: 0,
// // //     paddingHorizontal: 20,
// // //     paddingTop: 12,
// // //   },
// // //   newBillBtn: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     justifyContent: 'center',
// // //     gap: 8,
// // //     paddingVertical: 14,
// // //   },
// // //   newBillLabel: { fontSize: 15, fontFamily: 'Inter_600SemiBold', fontWeight: '600' },
// // // });

// // import React from 'react';
// // import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
// // import { router, useLocalSearchParams } from 'expo-router';
// // import { Feather } from '@expo/vector-icons';
// // import { useSafeAreaInsets } from 'react-native-safe-area-context';
// // import { useColors } from '@/hooks/useColors';
// // import { useBusiness } from '@/contexts/BusinessContext';
// // import {
// //   useGetCustomer,
// //   useListTransactions,
// //   getGetCustomerQueryKey,
// //   getListTransactionsQueryKey,
// // } from '@workspace/api-client-react';
// // import type { Transaction } from '@workspace/api-client-react';
// // import { Avatar } from '@/components/Avatar';
// // import { BalancePill } from '@/components/BalancePill';
// // import { EmptyState } from '@/components/EmptyState';
// // import { formatCurrency, formatDateTime } from '@/lib/format';

// // export default function CustomerLedgerScreen() {
// //   const colors = useColors();
// //   const insets = useSafeAreaInsets();
// //   const { id } = useLocalSearchParams<{ id: string }>();
// //   const customerId = Number(id);
// //   const { business } = useBusiness();

// //   const { data: customer, isLoading: customerLoading } = useGetCustomer(customerId, {
// //     query: { enabled: !!customerId, queryKey: getGetCustomerQueryKey(customerId) },
// //   });
// //   const txParams = { business_id: business?.id as number, customer_id: customerId, limit: 200 };
// //   const {
// //     data: txData,
// //     isLoading: txLoading,
// //     refetch,
// //     isRefetching,
// //   } = useListTransactions(txParams, {
// //     query: { enabled: !!business?.id && !!customerId, queryKey: getListTransactionsQueryKey(txParams) },
// //   });

// //   // Show every transaction as a bill row (items + total) — no type filtering,
// //   // since existing entries were recorded as either you_gave or you_got.
// //   const bills = txData?.data ?? [];

// //   if (customerLoading) {
// //     return (
// //       <View style={{ flex: 1, backgroundColor: colors.background, justifyContent: 'center' }}>
// //         <ActivityIndicator color={colors.primary} />
// //       </View>
// //     );
// //   }

// //   const renderItem = ({ item, index }: { item: Transaction; index: number }) => {
// //     const zebra = index % 2 === 1;
// //     return (
// //       <Pressable
// //         style={[
// //           styles.tableRow,
// //           { borderBottomColor: colors.border, backgroundColor: zebra ? colors.muted : colors.background },
// //         ]}
// //       >
// //         {/* Date column */}
// //         <View style={styles.colDate}>
// //           <Text style={[styles.cellDate, { color: colors.foreground }]}>{formatDateTime(item.entry_date)}</Text>
// //         </View>

// //         {/* Items column */}
// //         <View style={styles.colItems}>
// //           <Text style={[styles.cellItems, { color: colors.foreground }]} numberOfLines={2}>
// //             {item.description || '—'}
// //           </Text>
// //         </View>

// //         {/* Total column */}
// //         <View style={styles.colTotal}>
// //           <Text style={[styles.cellTotal, { color: colors.foreground }]}>
// //             {formatCurrency(item.amount, business?.currency)}
// //           </Text>
// //         </View>
// //       </Pressable>
// //     );
// //   };

// //   const TableHeader = () => (
// //     <View style={[styles.tableHeader, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
// //       <Text style={[styles.headerCell, styles.colDate, { color: colors.mutedForeground }]}>DATE</Text>
// //       <Text style={[styles.headerCell, styles.colItems, { color: colors.mutedForeground }]}>ITEMS</Text>
// //       <Text style={[styles.headerCell, styles.colTotal, { color: colors.mutedForeground, textAlign: 'right' }]}>
// //         TOTAL
// //       </Text>
// //     </View>
// //   );

// //   return (
// //     <View style={{ flex: 1, backgroundColor: colors.background }}>
// //       <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
// //         <Avatar name={customer?.name ?? '?'} size={52} />
// //         <View style={{ flex: 1, marginLeft: 12 }}>
// //           <Text style={[styles.name, { color: colors.foreground }]} numberOfLines={1}>
// //             {customer?.name}
// //           </Text>
// //           <Text style={[styles.phone, { color: colors.mutedForeground }]}>{customer?.phone}</Text>
// //         </View>
// //         <BalancePill balance={customer?.current_balance ?? 0} currency={business?.currency} />
// //       </View>

// //       {txLoading ? (
// //         <ActivityIndicator style={{ marginTop: 40 }} color={colors.primary} />
// //       ) : bills.length === 0 ? (
// //         <EmptyState icon="file-text" title="No bills yet" subtitle="Create the first bill for this customer" />
// //       ) : (
// //         <FlatList
// //           data={bills}
// //           keyExtractor={(t) => String(t.id)}
// //           renderItem={renderItem}
// //           refreshing={isRefetching}
// //           onRefresh={refetch}
// //           ListHeaderComponent={TableHeader}
// //           stickyHeaderIndices={[0]}
// //           contentContainerStyle={{ paddingBottom: insets.bottom + 90, flexGrow: 1 }}
// //         />
// //       )}

// //       <View style={[styles.actionsRow, { paddingBottom: insets.bottom + 16, backgroundColor: colors.background }]}>
// //         <Pressable
// //           onPress={() => router.push({ pathname: '/billing', params: { customerId: String(customerId) } })}
// //           style={[styles.newBillBtn, { backgroundColor: colors.primary, borderRadius: colors.radius }]}
// //         >
// //           <Feather name="plus" size={18} color={colors.primaryForeground} />
// //           <Text style={[styles.newBillLabel, { color: colors.primaryForeground }]}>New Bill</Text>
// //         </Pressable>
// //       </View>
// //     </View>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   header: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1 },
// //   name: { fontSize: 17, fontFamily: 'Inter_700Bold', fontWeight: '700' },
// //   phone: { fontSize: 12, fontFamily: 'Inter_400Regular', marginTop: 2 },

// //   // Table header
// //   tableHeader: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     paddingHorizontal: 16,
// //     paddingVertical: 10,
// //     borderBottomWidth: 1,
// //   },
// //   headerCell: {
// //     fontSize: 10,
// //     fontFamily: 'Inter_600SemiBold',
// //     fontWeight: '600',
// //     letterSpacing: 0.4,
// //   },

// //   // Table row
// //   tableRow: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     paddingHorizontal: 16,
// //     paddingVertical: 14,
// //     borderBottomWidth: 1,
// //   },

// //   // Column widths (flex-based, consistent across header + rows)
// //   colDate: { flex: 1, paddingRight: 8 },
// //   colItems: { flex: 2.4, paddingRight: 8 },
// //   colTotal: { flex: 1, alignItems: 'flex-end' },

// //   cellDate: { fontSize: 12, fontFamily: 'Inter_400Regular' },
// //   cellItems: { fontSize: 13, fontFamily: 'Inter_500Medium', lineHeight: 18 },
// //   cellTotal: { fontSize: 14, fontFamily: 'Inter_700Bold', fontWeight: '700', textAlign: 'right' },

// //   actionsRow: {
// //     position: 'absolute',
// //     left: 0,
// //     right: 0,
// //     bottom: 0,
// //     paddingHorizontal: 20,
// //     paddingTop: 12,
// //   },
// //   newBillBtn: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //     gap: 8,
// //     paddingVertical: 14,
// //   },
// //   newBillLabel: { fontSize: 15, fontFamily: 'Inter_600SemiBold', fontWeight: '600' },
// // });

// import React from 'react';
// import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
// import { router, useLocalSearchParams } from 'expo-router';
// import { Feather } from '@expo/vector-icons';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import { useColors } from '@/hooks/useColors';
// import { useBusiness } from '@/contexts/BusinessContext';
// import {
//   useGetCustomer,
//   useListTransactions,
//   getGetCustomerQueryKey,
//   getListTransactionsQueryKey,
// } from '@workspace/api-client-react';
// import type { Transaction } from '@workspace/api-client-react';
// import { Avatar } from '@/components/Avatar';
// import { BalancePill } from '@/components/BalancePill';
// import { EmptyState } from '@/components/EmptyState';
// import { formatCurrency, formatDateTime } from '@/lib/format';

// export default function CustomerLedgerScreen() {
//   const colors = useColors();
//   const insets = useSafeAreaInsets();
//   const { id } = useLocalSearchParams<{ id: string }>();
//   const customerId = Number(id);
//   const { business } = useBusiness();

//   const { data: customer, isLoading: customerLoading } = useGetCustomer(customerId, {
//     query: { enabled: !!customerId, queryKey: getGetCustomerQueryKey(customerId) },
//   });
//   const txParams = { business_id: business?.id as number, customer_id: customerId, limit: 200 };
//   const {
//     data: txData,
//     isLoading: txLoading,
//     refetch,
//     isRefetching,
//   } = useListTransactions(txParams, {
//     query: { enabled: !!business?.id && !!customerId, queryKey: getListTransactionsQueryKey(txParams) },
//   });

//   // A real "bill" is a you_gave transaction (items + total at time of sale).
//   // "Payment received — ..." you_got entries are just settlement records for
//   // bills paid on the spot, not separate bills — hide them here so a single
//   // paid-now sale doesn't show up twice.
//   const bills = (txData?.data ?? []).filter((t: Transaction) => t.type === 'you_gave');

//   if (customerLoading) {
//     return (
//       <View style={{ flex: 1, backgroundColor: colors.background, justifyContent: 'center' }}>
//         <ActivityIndicator color={colors.primary} />
//       </View>
//     );
//   }

//   const renderItem = ({ item, index }: { item: Transaction; index: number }) => {
//     const zebra = index % 2 === 1;
//     return (
//       <Pressable
//         style={[
//           styles.tableRow,
//           { borderBottomColor: colors.border, backgroundColor: zebra ? colors.muted : colors.background },
//         ]}
//       >
//         {/* Date column */}
//         <View style={styles.colDate}>
//           <Text style={[styles.cellDate, { color: colors.foreground }]}>{formatDateTime(item.entry_date)}</Text>
//         </View>

//         {/* Items column */}
//         <View style={styles.colItems}>
//           <Text style={[styles.cellItems, { color: colors.foreground }]} numberOfLines={2}>
//             {item.description || '—'}
//           </Text>
//         </View>

//         {/* Total column */}
//         <View style={styles.colTotal}>
//           <Text style={[styles.cellTotal, { color: colors.foreground }]}>
//             {formatCurrency(item.amount, business?.currency)}
//           </Text>
//         </View>
//       </Pressable>
//     );
//   };

//   const TableHeader = () => (
//     <View style={[styles.tableHeader, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
//       <Text style={[styles.headerCell, styles.colDate, { color: colors.mutedForeground }]}>DATE</Text>
//       <Text style={[styles.headerCell, styles.colItems, { color: colors.mutedForeground }]}>ITEMS</Text>
//       <Text style={[styles.headerCell, styles.colTotal, { color: colors.mutedForeground, textAlign: 'right' }]}>
//         TOTAL
//       </Text>
//     </View>
//   );

//   return (
//     <View style={{ flex: 1, backgroundColor: colors.background }}>
//       <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
//         <Avatar name={customer?.name ?? '?'} size={52} />
//         <View style={{ flex: 1, marginLeft: 12 }}>
//           <Text style={[styles.name, { color: colors.foreground }]} numberOfLines={1}>
//             {customer?.name}
//           </Text>
//           <Text style={[styles.phone, { color: colors.mutedForeground }]}>{customer?.phone}</Text>
//         </View>
//         <BalancePill balance={customer?.current_balance ?? 0} currency={business?.currency} />
//       </View>

//       {txLoading ? (
//         <ActivityIndicator style={{ marginTop: 40 }} color={colors.primary} />
//       ) : bills.length === 0 ? (
//         <EmptyState icon="file-text" title="No bills yet" subtitle="Create the first bill for this customer" />
//       ) : (
//         <FlatList
//           data={bills}
//           keyExtractor={(t) => String(t.id)}
//           renderItem={renderItem}
//           refreshing={isRefetching}
//           onRefresh={refetch}
//           ListHeaderComponent={TableHeader}
//           stickyHeaderIndices={[0]}
//           contentContainerStyle={{ paddingBottom: insets.bottom + 90, flexGrow: 1 }}
//         />
//       )}

//       <View style={[styles.actionsRow, { paddingBottom: insets.bottom + 16, backgroundColor: colors.background }]}>
//         <Pressable
//           onPress={() => router.push({ pathname: '/billing', params: { customerId: String(customerId) } })}
//           style={[styles.newBillBtn, { backgroundColor: colors.primary, borderRadius: colors.radius }]}
//         >
//           <Feather name="plus" size={18} color={colors.primaryForeground} />
//           <Text style={[styles.newBillLabel, { color: colors.primaryForeground }]}>New Bill</Text>
//         </Pressable>
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   header: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1 },
//   name: { fontSize: 17, fontFamily: 'Inter_700Bold', fontWeight: '700' },
//   phone: { fontSize: 12, fontFamily: 'Inter_400Regular', marginTop: 2 },

//   // Table header
//   tableHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: 16,
//     paddingVertical: 10,
//     borderBottomWidth: 1,
//   },
//   headerCell: {
//     fontSize: 10,
//     fontFamily: 'Inter_600SemiBold',
//     fontWeight: '600',
//     letterSpacing: 0.4,
//   },

//   // Table row
//   tableRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: 16,
//     paddingVertical: 14,
//     borderBottomWidth: 1,
//   },

//   // Column widths (flex-based, consistent across header + rows)
//   colDate: { flex: 1, paddingRight: 8 },
//   colItems: { flex: 2.4, paddingRight: 8 },
//   colTotal: { flex: 1, alignItems: 'flex-end' },

//   cellDate: { fontSize: 12, fontFamily: 'Inter_400Regular' },
//   cellItems: { fontSize: 13, fontFamily: 'Inter_500Medium', lineHeight: 18 },
//   cellTotal: { fontSize: 14, fontFamily: 'Inter_700Bold', fontWeight: '700', textAlign: 'right' },

//   actionsRow: {
//     position: 'absolute',
//     left: 0,
//     right: 0,
//     bottom: 0,
//     paddingHorizontal: 20,
//     paddingTop: 12,
//   },
//   newBillBtn: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     gap: 8,
//     paddingVertical: 14,
//   },
//   newBillLabel: { fontSize: 15, fontFamily: 'Inter_600SemiBold', fontWeight: '600' },
// });

import React from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';
import { useBusiness } from '@/contexts/BusinessContext';
import {
  useGetCustomer,
  useListTransactions,
  getGetCustomerQueryKey,
  getListTransactionsQueryKey,
} from '@workspace/api-client-react';
import type { Transaction } from '@workspace/api-client-react';
import { Avatar } from '@/components/Avatar';
import { BalancePill } from '@/components/BalancePill';
import { EmptyState } from '@/components/EmptyState';
import { formatCurrency, formatDateTime } from '@/lib/format';

export default function CustomerLedgerScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const customerId = Number(id);
  const { business } = useBusiness();

  const { data: customer, isLoading: customerLoading } = useGetCustomer(customerId, {
    query: { enabled: !!customerId, queryKey: getGetCustomerQueryKey(customerId) },
  });
  const txParams = { business_id: business?.id as number, customer_id: customerId, limit: 200 };
  const {
    data: txData,
    isLoading: txLoading,
    refetch,
    isRefetching,
  } = useListTransactions(txParams, {
    query: { enabled: !!business?.id && !!customerId, queryKey: getListTransactionsQueryKey(txParams) },
  });

  // A real "bill" is a you_gave transaction (items + total at time of sale).
  // "Payment received — ..." you_got entries are just settlement records for
  // bills paid on the spot, not separate bills — hide them here so a single
  // paid-now sale doesn't show up twice.
  const bills = (txData?.data ?? []).filter((t: Transaction) => t.type === 'you_gave');

  if (customerLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, justifyContent: 'center' }}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  const renderItem = ({ item, index }: { item: Transaction; index: number }) => {
    const zebra = index % 2 === 1;
    return (
      <Pressable
        style={[
          styles.tableRow,
          { borderBottomColor: colors.border, backgroundColor: zebra ? colors.muted : colors.background },
        ]}
      >
        {/* Date column */}
        <View style={styles.colDate}>
          <Text style={[styles.cellDate, { color: colors.foreground }]}>{formatDateTime(item.created_at)}</Text>
        </View>

        {/* Items column */}
        <View style={styles.colItems}>
          <Text style={[styles.cellItems, { color: colors.foreground }]} numberOfLines={2}>
            {item.description || '—'}
          </Text>
        </View>

        {/* Total column */}
        <View style={styles.colTotal}>
          <Text style={[styles.cellTotal, { color: colors.foreground }]}>
            {formatCurrency(item.amount, business?.currency)}
          </Text>
        </View>
      </Pressable>
    );
  };

  const TableHeader = () => (
    <View style={[styles.tableHeader, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
      <Text style={[styles.headerCell, styles.colDate, { color: colors.mutedForeground }]}>DATE</Text>
      <Text style={[styles.headerCell, styles.colItems, { color: colors.mutedForeground }]}>ITEMS</Text>
      <Text style={[styles.headerCell, styles.colTotal, { color: colors.mutedForeground, textAlign: 'right' }]}>
        TOTAL
      </Text>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <Avatar name={customer?.name ?? '?'} size={52} />
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={[styles.name, { color: colors.foreground }]} numberOfLines={1}>
            {customer?.name}
          </Text>
          <Text style={[styles.phone, { color: colors.mutedForeground }]}>{customer?.phone}</Text>
        </View>
        <BalancePill balance={customer?.current_balance ?? 0} currency={business?.currency} />
      </View>

      {txLoading ? (
        <ActivityIndicator style={{ marginTop: 40 }} color={colors.primary} />
      ) : bills.length === 0 ? (
        <EmptyState icon="file-text" title="No bills yet" subtitle="Create the first bill for this customer" />
      ) : (
        <FlatList
          data={bills}
          keyExtractor={(t) => String(t.id)}
          renderItem={renderItem}
          refreshing={isRefetching}
          onRefresh={refetch}
          ListHeaderComponent={TableHeader}
          stickyHeaderIndices={[0]}
          contentContainerStyle={{ paddingBottom: insets.bottom + 90, flexGrow: 1 }}
        />
      )}

      <View style={[styles.actionsRow, { paddingBottom: insets.bottom + 16, backgroundColor: colors.background }]}>
        <Pressable
          onPress={() => router.push({ pathname: '/billing', params: { customerId: String(customerId) } })}
          style={[styles.newBillBtn, { backgroundColor: colors.primary, borderRadius: colors.radius }]}
        >
          <Feather name="plus" size={18} color={colors.primaryForeground} />
          <Text style={[styles.newBillLabel, { color: colors.primaryForeground }]}>New Bill</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1 },
  name: { fontSize: 17, fontFamily: 'Inter_700Bold', fontWeight: '700' },
  phone: { fontSize: 12, fontFamily: 'Inter_400Regular', marginTop: 2 },

  // Table header
  tableHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  headerCell: {
    fontSize: 10,
    fontFamily: 'Inter_600SemiBold',
    fontWeight: '600',
    letterSpacing: 0.4,
  },

  // Table row
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },

  // Column widths (flex-based, consistent across header + rows)
  colDate: { flex: 1, paddingRight: 8 },
  colItems: { flex: 2.4, paddingRight: 8 },
  colTotal: { flex: 1, alignItems: 'flex-end' },

  cellDate: { fontSize: 12, fontFamily: 'Inter_400Regular' },
  cellItems: { fontSize: 13, fontFamily: 'Inter_500Medium', lineHeight: 18 },
  cellTotal: { fontSize: 14, fontFamily: 'Inter_700Bold', fontWeight: '700', textAlign: 'right' },

  actionsRow: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  newBillBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
  },
  newBillLabel: { fontSize: 15, fontFamily: 'Inter_600SemiBold', fontWeight: '600' },
});