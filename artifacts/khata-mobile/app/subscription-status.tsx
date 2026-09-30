// // import React, { useState } from 'react';
// // import {
// //   ActivityIndicator,
// //   Platform,
// //   Pressable,
// //   StyleSheet,
// //   Text,
// //   View,
// // } from 'react-native';
// // import { useSafeAreaInsets } from 'react-native-safe-area-context';
// // import { KeyboardAwareScrollViewCompat } from '@/components/KeyboardAwareScrollViewCompat';
// // import { Feather } from '@expo/vector-icons';
// // import { useColors } from '@/hooks/useColors';
// // import {
// //   useListActiveSubscriptionPlans,
// //   useGetMySubscription,
// //   useRenewSubscription,
// //   type SubscriptionPlan,
// //   type BusinessInputBillingCycle,
// // } from '@workspace/api-client-react';
// // import { useAuth } from '@/contexts/AuthContext';
// // import { useBusiness } from '@/contexts/BusinessContext';
// // import { PrimaryButton } from '@/components/PrimaryButton';

// // const BILLING_CYCLES: { label: string; value: BusinessInputBillingCycle }[] = [
// //   { label: 'Monthly', value: 'monthly' },
// //   { label: 'Quarterly', value: 'quarterly' },
// //   { label: 'Half-Yearly', value: 'half_yearly' },
// //   { label: 'Yearly', value: 'yearly' },
// // ];

// // const priceForCycle = (plan: SubscriptionPlan, cycle: BusinessInputBillingCycle): number => {
// //   switch (cycle) {
// //     case 'monthly':
// //       return plan.monthly_price;
// //     case 'quarterly':
// //       return plan.quarterly_price;
// //     case 'half_yearly':
// //       return plan.half_yearly_price;
// //     case 'yearly':
// //       return plan.yearly_price;
// //     default:
// //       return plan.monthly_price;
// //   }
// // };

// // const planDisplayName = (plan: SubscriptionPlan['plan']) =>
// //   plan.charAt(0).toUpperCase() + plan.slice(1);

// // // ============================================================
// // // 💳 Subscription Expired / Renew screen (spec §6).
// // // Shown when the business's subscription is `expired`, `cancelled`,
// // // or missing entirely. Blocks all subscription-protected app access
// // // until the person picks a plan + billing cycle and renews.
// // //
// // // ⚠️ NOTE: the "Renew Now" action needs a business-facing endpoint
// // // that actually reactivates/creates the subscription (e.g.
// // // POST /subscriptions/renew) — that endpoint doesn't exist on the
// // // backend yet, so the button is wired up to call it but will need
// // // that route added before this screen is fully functional.
// // // ============================================================
// // export default function SubscriptionStatusScreen() {
// //   const colors = useColors();
// //   const insets = useSafeAreaInsets();
// //   const { signOut } = useAuth();
// //   const { business, refetch: refetchBusiness } = useBusiness();

// //   const { data: mySub } = useGetMySubscription();
// //   const { data: plansData, isLoading: plansLoading } = useListActiveSubscriptionPlans();
// //   const plans: SubscriptionPlan[] = (plansData?.data ?? []).filter((p) => p.is_active);

// //   const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan['plan'] | ''>('');
// //   const [selectedBillingCycle, setSelectedBillingCycle] = useState<BusinessInputBillingCycle>('monthly');
// //   const [submitting, setSubmitting] = useState(false);
// //   const [error, setError] = useState<string | null>(null);
  
  

// //   React.useEffect(() => {
// //     if (!selectedPlan && plans.length > 0) {
// //       // Default to the business's current plan if we know it, else the first plan.
// //       setSelectedPlan((business?.plan as SubscriptionPlan['plan']) || plans[0].plan);
// //     }
// //   }, [plans, selectedPlan, business?.plan]);

// //   const status = business?.subscription_status; // 'expired' | 'cancelled' | null
// //   const isNoSubscription = !status;
// //   const heading = isNoSubscription ? 'Activate Your Subscription' : 'Subscription Expired';
// //   const subheading = isNoSubscription
// //     ? "You don't have an active plan yet. Choose a plan to continue using Khata-Pro."
// //     : 'Your subscription has expired. Choose a plan to continue using Khata-Pro.';
// //   const { mutateAsync: renewSubscription } = useRenewSubscription();

// //  const handleRenew = async () => {
// //   if (!selectedPlan) { setError('Please choose a plan to continue.'); return; }
// //   setError(null);
// //   setSubmitting(true);
// //   try {
// //     await renewSubscription({ data: { plan: selectedPlan, billing_cycle: selectedBillingCycle } });
// //     await refetchBusiness();
// //   } catch {
// //     setError('Could not renew subscription. Please try again.');
// //   } finally {
// //     setSubmitting(false);
// //   }
// // };

// //   return (
// //     <View style={{ flex: 1, backgroundColor: colors.background }}>
// //       <KeyboardAwareScrollViewCompat
// //         contentContainerStyle={[
// //           styles.content,
// //           { paddingTop: insets.top + 32, paddingBottom: insets.bottom + 32 },
// //         ]}
// //       >
// //         <View style={[styles.iconWrap, { backgroundColor: colors.destructive + '15' }]}>
// //           <Feather name={isNoSubscription ? 'award' : 'alert-triangle'} size={26} color={colors.destructive} />
// //         </View>

// //         <Text style={[styles.title, { color: colors.foreground }]}>{heading}</Text>
// //         <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>{subheading}</Text>

// //         {business?.business_name && (
// //           <View style={[styles.businessBanner, { backgroundColor: colors.muted, borderRadius: colors.radius }]}>
// //             <Feather name="briefcase" size={14} color={colors.mutedForeground} />
// //             <Text style={[styles.businessBannerText, { color: colors.foreground }]}>{business.business_name}</Text>
// //           </View>
// //         )}

// //         <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Choose a Plan</Text>

// //         {plansLoading ? (
// //           <ActivityIndicator size="small" color={colors.primary} style={{ marginTop: 12 }} />
// //         ) : plans.length === 0 ? (
// //           <Text style={[styles.errorText, { color: colors.destructive }]}>
// //             Could not load subscription plans. Please try again.
// //           </Text>
// //         ) : (
// //           <>
// //             <View style={{ gap: 12, marginTop: 12 }}>
// //               {plans.map((p) => {
// //                 const isSelected = selectedPlan === p.plan;
// //                 return (
// //                   <Pressable
// //                     key={p.id}
// //                     onPress={() => setSelectedPlan(p.plan)}
// //                     style={{
// //                       borderWidth: isSelected ? 2 : 1,
// //                       borderColor: isSelected ? colors.primary : colors.border,
// //                       borderRadius: colors.radius,
// //                       padding: 14,
// //                       backgroundColor: isSelected ? colors.primary + '10' : colors.card,
// //                     }}
// //                   >
// //                     <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
// //                       <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 15, color: colors.foreground }}>
// //                         {planDisplayName(p.plan)}
// //                       </Text>
// //                       <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 15, color: colors.primary }}>
// //                         ₹{priceForCycle(p, isSelected ? selectedBillingCycle : 'monthly').toLocaleString('en-IN')}
// //                         <Text style={{ fontSize: 11, fontFamily: 'Inter_400Regular', color: colors.mutedForeground }}>
// //                           {' '}/ {(isSelected ? selectedBillingCycle : 'monthly').replace('_', ' ')}
// //                         </Text>
// //                       </Text>
// //                     </View>
// //                   </Pressable>
// //                 );
// //               })}
// //             </View>

// //             <Text style={[styles.sectionTitle, { color: colors.foreground, marginTop: 20 }]}>Billing Cycle</Text>
// //             <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 10 }}>
// //               {BILLING_CYCLES.map((cycle) => {
// //                 const isSelected = selectedBillingCycle === cycle.value;
// //                 return (
// //                   <Pressable
// //                     key={cycle.value}
// //                     onPress={() => setSelectedBillingCycle(cycle.value)}
// //                     style={{
// //                       paddingVertical: 8,
// //                       paddingHorizontal: 14,
// //                       borderRadius: 20,
// //                       borderWidth: 1,
// //                       borderColor: isSelected ? colors.primary : colors.border,
// //                       backgroundColor: isSelected ? colors.primary : colors.muted,
// //                     }}
// //                   >
// //                     <Text
// //                       style={{
// //                         fontSize: 12,
// //                         fontFamily: 'Inter_600SemiBold',
// //                         fontWeight: '600',
// //                         color: isSelected ? colors.primaryForeground : colors.foreground,
// //                       }}
// //                     >
// //                       {cycle.label}
// //                     </Text>
// //                   </Pressable>
// //                 );
// //               })}
// //             </View>
// //           </>
// //         )}

// //         {error ? <Text style={[styles.errorText, { color: colors.destructive, marginTop: 14 }]}>{error}</Text> : null}

// //         <PrimaryButton
// //           label="Renew Now"
// //           onPress={handleRenew}
// //           loading={submitting}
// //           style={{ marginTop: 24 }}
// //         />

// //         <Pressable onPress={signOut} style={{ marginTop: 16, alignItems: 'center' }}>
// //           <Text style={{ color: colors.mutedForeground, fontSize: 13, fontFamily: 'Inter_500Medium' }}>Log out</Text>
// //         </Pressable>
// //       </KeyboardAwareScrollViewCompat>
// //     </View>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   content: { paddingHorizontal: 24, maxWidth: 480, width: '100%', alignSelf: 'center' },
// //   iconWrap: {
// //     width: 56,
// //     height: 56,
// //     borderRadius: 28,
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //     alignSelf: 'center',
// //     marginBottom: 16,
// //   },
// //   title: { fontSize: 22, fontFamily: 'Inter_700Bold', fontWeight: '700', textAlign: 'center' },
// //   subtitle: { fontSize: 13.5, fontFamily: 'Inter_400Regular', textAlign: 'center', marginTop: 8, lineHeight: 19 },
// //   businessBanner: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     gap: 8,
// //     paddingVertical: 10,
// //     paddingHorizontal: 14,
// //     marginTop: 20,
// //     alignSelf: 'center',
// //   },
// //   businessBannerText: { fontSize: 13, fontFamily: 'Inter_600SemiBold', fontWeight: '600' },
// //   sectionTitle: { fontSize: 14.5, fontFamily: 'Inter_700Bold', fontWeight: '700', marginTop: 24 },
// //   errorText: { fontSize: 13, fontFamily: 'Inter_400Regular' },
// // });

// import React, { useState } from 'react';
// import {
//   ActivityIndicator,
//   Platform,
//   Pressable,
//   StyleSheet,
//   Text,
//   View,
// } from 'react-native';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import { KeyboardAwareScrollViewCompat } from '@/components/KeyboardAwareScrollViewCompat';
// import { Feather } from '@expo/vector-icons';
// import { useColors } from '@/hooks/useColors';
// import {
//   useListActiveSubscriptionPlans,
//   useGetMySubscription,
//   useCreateSubscriptionOrder,
//   useVerifySubscriptionPayment,
//   type SubscriptionPlan,
//   type BusinessInputBillingCycle,
// } from '@workspace/api-client-react';
// import { useAuth } from '@/contexts/AuthContext';
// import { useBusiness } from '@/contexts/BusinessContext';
// import { PrimaryButton } from '@/components/PrimaryButton';

// // ============================================================
// // 💳 Razorpay checkout helpers
// // Native (iOS/Android): needs `react-native-razorpay` installed +
// //   the Expo config plugin added to app.json, then a dev build
// //   (this native module does NOT work inside Expo Go).
// //   npx expo install react-native-razorpay
// // Web: loads Razorpay's Checkout.js script on demand, no install
// //   needed.
// // Default checkout (no `method` restriction passed) shows every
// // payment method enabled on your Razorpay dashboard — UPI (GPay,
// // PhonePe, etc.), cards, netbanking, wallets, EMI.
// // ============================================================

// type RazorpaySuccessPayload = {
//   razorpay_order_id: string;
//   razorpay_payment_id: string;
//   razorpay_signature: string;
// };

// function loadRazorpayWebScript(): Promise<void> {
//   return new Promise((resolve, reject) => {
//     if (typeof window === 'undefined') return reject(new Error('No window'));
//     // @ts-ignore
//     if (window.Razorpay) return resolve();
//     const script = document.createElement('script');
//     script.src = 'https://checkout.razorpay.com/v1/checkout.js';
//     script.onload = () => resolve();
//     script.onerror = () => reject(new Error('Failed to load Razorpay checkout script'));
//     document.body.appendChild(script);
//   });
// }

// async function openRazorpayCheckout(options: {
//   key: string;
//   amount: number;
//   currency: string;
//   order_id: string;
//   name: string;
//   description?: string;
//   prefill?: { name?: string; email?: string; contact?: string };
//   theme?: { color?: string };
// }): Promise<RazorpaySuccessPayload> {
//   if (Platform.OS === 'web') {
//     await loadRazorpayWebScript();
//     return new Promise((resolve, reject) => {
//       // @ts-ignore
//       const rzp = new window.Razorpay({
//         ...options,
//         handler: (response: RazorpaySuccessPayload) => resolve(response),
//         modal: {
//           ondismiss: () => reject(new Error('dismissed')),
//         },
//       });
//       rzp.on('payment.failed', (resp: any) => {
//         reject(new Error(resp?.error?.description || 'Payment failed'));
//       });
//       rzp.open();
//     });
//   }

//   // Native (iOS/Android) — react-native-razorpay
//   const RazorpayCheckout = require('react-native-razorpay').default;
//   const data = await RazorpayCheckout.open(options);
//   return {
//     razorpay_order_id: data.razorpay_order_id,
//     razorpay_payment_id: data.razorpay_payment_id,
//     razorpay_signature: data.razorpay_signature,
//   };
// }

// const BILLING_CYCLES: { label: string; value: BusinessInputBillingCycle }[] = [
//   { label: 'Monthly', value: 'monthly' },
//   { label: 'Quarterly', value: 'quarterly' },
//   { label: 'Half-Yearly', value: 'half_yearly' },
//   { label: 'Yearly', value: 'yearly' },
// ];

// const priceForCycle = (plan: SubscriptionPlan, cycle: BusinessInputBillingCycle): number => {
//   switch (cycle) {
//     case 'monthly':
//       return plan.monthly_price;
//     case 'quarterly':
//       return plan.quarterly_price;
//     case 'half_yearly':
//       return plan.half_yearly_price;
//     case 'yearly':
//       return plan.yearly_price;
//     default:
//       return plan.monthly_price;
//   }
// };

// const planDisplayName = (plan: SubscriptionPlan['plan']) =>
//   plan.charAt(0).toUpperCase() + plan.slice(1);

// // ============================================================
// // 💳 Subscription Expired / Renew screen (spec §6).
// // Shown when the business's subscription is `expired`, `cancelled`,
// // or missing entirely. Blocks all subscription-protected app access
// // until the person picks a plan + billing cycle, pays via Razorpay
// // (UPI / cards / netbanking / wallets — whatever's enabled on the
// // dashboard), and the payment is verified.
// // ============================================================
// export default function SubscriptionStatusScreen() {
//   const colors = useColors();
//   const insets = useSafeAreaInsets();
//   const { signOut, user } = useAuth();
//   const { business, refetch: refetchBusiness } = useBusiness();

//   const { data: mySub } = useGetMySubscription();
//   const { data: plansData, isLoading: plansLoading } = useListActiveSubscriptionPlans();
//   const plans: SubscriptionPlan[] = (plansData?.data ?? []).filter((p) => p.is_active);

//   const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan['plan'] | ''>('');
//   const [selectedBillingCycle, setSelectedBillingCycle] = useState<BusinessInputBillingCycle>('monthly');
//   const [submitting, setSubmitting] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   React.useEffect(() => {
//     if (!selectedPlan && plans.length > 0) {
//       // Default to the business's current plan if we know it, else the first plan.
//       setSelectedPlan((business?.plan as SubscriptionPlan['plan']) || plans[0].plan);
//     }
//   }, [plans, selectedPlan, business?.plan]);

//   const status = business?.subscription_status; // 'expired' | 'cancelled' | null
//   const isNoSubscription = !status;
//   const heading = isNoSubscription ? 'Activate Your Subscription' : 'Subscription Expired';
//   const subheading = isNoSubscription
//     ? "You don't have an active plan yet. Choose a plan to continue using Khata-Pro."
//     : 'Your subscription has expired. Choose a plan to continue using Khata-Pro.';

//   const { mutateAsync: createOrder } = useCreateSubscriptionOrder();
//   const { mutateAsync: verifyPayment } = useVerifySubscriptionPayment();

//   const handleRenew = async () => {
//     if (!selectedPlan) {
//       setError('Please choose a plan to continue.');
//       return;
//     }
//     setError(null);
//     setSubmitting(true);
//     try {
//       // 1. Create a Razorpay order on the backend for this plan + cycle.
//       const order = await createOrder({
//         data: { plan: selectedPlan, billing_cycle: selectedBillingCycle },
//       });

//       // 2. Open Razorpay checkout — shows UPI/GPay/PhonePe, cards,
//       //    netbanking, wallets etc. automatically.
//       const payment = await openRazorpayCheckout({
//         key: order.key_id,
//         amount: order.amount,
//         currency: order.currency,
//         order_id: order.order_id,
//         name: business?.business_name || 'Khata-Pro',
//         description: `${planDisplayName(selectedPlan)} — ${selectedBillingCycle.replace('_', ' ')}`,
//         prefill: {
//           name: user?.name,
//           email: user?.email ?? undefined,
//           contact: user?.phone,
//         },
//         theme: { color: colors.primary },
//       });

//       // 3. Verify the payment signature on the backend & activate the plan.
//       await verifyPayment({
//         data: {
//           razorpay_order_id: payment.razorpay_order_id,
//           razorpay_payment_id: payment.razorpay_payment_id,
//           razorpay_signature: payment.razorpay_signature,
//           plan: selectedPlan,
//           billing_cycle: selectedBillingCycle,
//         },
//       });

//       await refetchBusiness();
//     } catch (err: any) {
//       if (err?.message === 'dismissed') {
//         setError('Payment cancelled.');
//       } else {
//         setError(err?.message || 'Could not complete payment. Please try again.');
//       }
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <View style={{ flex: 1, backgroundColor: colors.background }}>
//       <KeyboardAwareScrollViewCompat
//         contentContainerStyle={[
//           styles.content,
//           { paddingTop: insets.top + 32, paddingBottom: insets.bottom + 32 },
//         ]}
//       >
//         <View style={[styles.iconWrap, { backgroundColor: colors.destructive + '15' }]}>
//           <Feather name={isNoSubscription ? 'award' : 'alert-triangle'} size={26} color={colors.destructive} />
//         </View>

//         <Text style={[styles.title, { color: colors.foreground }]}>{heading}</Text>
//         <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>{subheading}</Text>

//         {business?.business_name && (
//           <View style={[styles.businessBanner, { backgroundColor: colors.muted, borderRadius: colors.radius }]}>
//             <Feather name="briefcase" size={14} color={colors.mutedForeground} />
//             <Text style={[styles.businessBannerText, { color: colors.foreground }]}>{business.business_name}</Text>
//           </View>
//         )}

//         <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Choose a Plan</Text>

//         {plansLoading ? (
//           <ActivityIndicator size="small" color={colors.primary} style={{ marginTop: 12 }} />
//         ) : plans.length === 0 ? (
//           <Text style={[styles.errorText, { color: colors.destructive }]}>
//             Could not load subscription plans. Please try again.
//           </Text>
//         ) : (
//           <>
//             <View style={{ gap: 12, marginTop: 12 }}>
//               {plans.map((p) => {
//                 const isSelected = selectedPlan === p.plan;
//                 return (
//                   <Pressable
//                     key={p.id}
//                     onPress={() => setSelectedPlan(p.plan)}
//                     style={{
//                       borderWidth: isSelected ? 2 : 1,
//                       borderColor: isSelected ? colors.primary : colors.border,
//                       borderRadius: colors.radius,
//                       padding: 14,
//                       backgroundColor: isSelected ? colors.primary + '10' : colors.card,
//                     }}
//                   >
//                     <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
//                       <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 15, color: colors.foreground }}>
//                         {planDisplayName(p.plan)}
//                       </Text>
//                       <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 15, color: colors.primary }}>
//                         ₹{priceForCycle(p, isSelected ? selectedBillingCycle : 'monthly').toLocaleString('en-IN')}
//                         <Text style={{ fontSize: 11, fontFamily: 'Inter_400Regular', color: colors.mutedForeground }}>
//                           {' '}/ {(isSelected ? selectedBillingCycle : 'monthly').replace('_', ' ')}
//                         </Text>
//                       </Text>
//                     </View>
//                   </Pressable>
//                 );
//               })}
//             </View>

//             <Text style={[styles.sectionTitle, { color: colors.foreground, marginTop: 20 }]}>Billing Cycle</Text>
//             <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 10 }}>
//               {BILLING_CYCLES.map((cycle) => {
//                 const isSelected = selectedBillingCycle === cycle.value;
//                 return (
//                   <Pressable
//                     key={cycle.value}
//                     onPress={() => setSelectedBillingCycle(cycle.value)}
//                     style={{
//                       paddingVertical: 8,
//                       paddingHorizontal: 14,
//                       borderRadius: 20,
//                       borderWidth: 1,
//                       borderColor: isSelected ? colors.primary : colors.border,
//                       backgroundColor: isSelected ? colors.primary : colors.muted,
//                     }}
//                   >
//                     <Text
//                       style={{
//                         fontSize: 12,
//                         fontFamily: 'Inter_600SemiBold',
//                         fontWeight: '600',
//                         color: isSelected ? colors.primaryForeground : colors.foreground,
//                       }}
//                     >
//                       {cycle.label}
//                     </Text>
//                   </Pressable>
//                 );
//               })}
//             </View>
//           </>
//         )}

//         {error ? <Text style={[styles.errorText, { color: colors.destructive, marginTop: 14 }]}>{error}</Text> : null}

//         <PrimaryButton
//           label="Renew Now"
//           onPress={handleRenew}
//           loading={submitting}
//           style={{ marginTop: 24 }}
//         />

//         <Pressable onPress={signOut} style={{ marginTop: 16, alignItems: 'center' }}>
//           <Text style={{ color: colors.mutedForeground, fontSize: 13, fontFamily: 'Inter_500Medium' }}>Log out</Text>
//         </Pressable>
//       </KeyboardAwareScrollViewCompat>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   content: { paddingHorizontal: 24, maxWidth: 480, width: '100%', alignSelf: 'center' },
//   iconWrap: {
//     width: 56,
//     height: 56,
//     borderRadius: 28,
//     alignItems: 'center',
//     justifyContent: 'center',
//     alignSelf: 'center',
//     marginBottom: 16,
//   },
//   title: { fontSize: 22, fontFamily: 'Inter_700Bold', fontWeight: '700', textAlign: 'center' },
//   subtitle: { fontSize: 13.5, fontFamily: 'Inter_400Regular', textAlign: 'center', marginTop: 8, lineHeight: 19 },
//   businessBanner: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//     paddingVertical: 10,
//     paddingHorizontal: 14,
//     marginTop: 20,
//     alignSelf: 'center',
//   },
//   businessBannerText: { fontSize: 13, fontFamily: 'Inter_600SemiBold', fontWeight: '600' },
//   sectionTitle: { fontSize: 14.5, fontFamily: 'Inter_700Bold', fontWeight: '700', marginTop: 24 },
//   errorText: { fontSize: 13, fontFamily: 'Inter_400Regular' },
// });
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { KeyboardAwareScrollViewCompat } from '@/components/KeyboardAwareScrollViewCompat';
import { Feather } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import {
  useListActiveSubscriptionPlans,
  useGetMySubscription,
  useCreateSubscriptionOrder,
  useVerifySubscriptionPayment,
  type SubscriptionPlan,
  type BusinessInputBillingCycle,
} from '@workspace/api-client-react';
import { useAuth } from '@/contexts/AuthContext';
import { useBusiness } from '@/contexts/BusinessContext';
import { PrimaryButton } from '@/components/PrimaryButton';

// ============================================================
// 💳 Razorpay checkout helpers
// Native (iOS/Android): needs `react-native-razorpay` installed +
//   the Expo config plugin added to app.json, then a dev build
//   (this native module does NOT work inside Expo Go).
//   npx expo install react-native-razorpay
// Web: loads Razorpay's Checkout.js script on demand, no install
//   needed.
// Default checkout (no `method` restriction passed) shows every
// payment method enabled on your Razorpay dashboard — UPI (GPay,
// PhonePe, etc.), cards, netbanking, wallets, EMI.
// ============================================================

type RazorpaySuccessPayload = {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
};

function loadRazorpayWebScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') return reject(new Error('No window'));
    // @ts-ignore
    if (window.Razorpay) return resolve();
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Razorpay checkout script'));
    document.body.appendChild(script);
  });
}

async function openRazorpayCheckout(options: {
  key: string;
  amount: number;
  currency: string;
  order_id: string;
  name: string;
  description?: string;
  prefill?: { name?: string; email?: string; contact?: string };
  theme?: { color?: string };
}): Promise<RazorpaySuccessPayload> {
  if (Platform.OS === 'web') {
    await loadRazorpayWebScript();
    return new Promise((resolve, reject) => {
      // @ts-ignore
      const rzp = new window.Razorpay({
        ...options,
        config: {
          display: {
            blocks: {
              upi: {
                name: 'Pay via UPI',
                instruments: [{ method: 'upi' }],
              },
              other: {
                name: 'Other Payment Methods',
                instruments: [
                  { method: 'card' },
                  { method: 'netbanking' },
                  { method: 'wallet' },
                ],
              },
            },
            sequence: ['block.upi', 'block.other'],
            preferences: { show_default_blocks: false },
          },
        },
        handler: (response: RazorpaySuccessPayload) => resolve(response),
        modal: {
          ondismiss: () => reject(new Error('dismissed')),
        },
      });
      rzp.on('payment.failed', (resp: any) => {
        reject(new Error(resp?.error?.description || 'Payment failed'));
      });
      rzp.open();
    });
  }

  // Native (iOS/Android) — react-native-razorpay
  const RazorpayCheckout = require('react-native-razorpay').default;
  const data = await RazorpayCheckout.open(options);
  return {
    razorpay_order_id: data.razorpay_order_id,
    razorpay_payment_id: data.razorpay_payment_id,
    razorpay_signature: data.razorpay_signature,
  };
}

const BILLING_CYCLES: { label: string; value: BusinessInputBillingCycle }[] = [
  { label: 'Monthly', value: 'monthly' },
  { label: 'Quarterly', value: 'quarterly' },
  { label: 'Half-Yearly', value: 'half_yearly' },
  { label: 'Yearly', value: 'yearly' },
];

const priceForCycle = (plan: SubscriptionPlan, cycle: BusinessInputBillingCycle): number => {
  switch (cycle) {
    case 'monthly':
      return plan.monthly_price;
    case 'quarterly':
      return plan.quarterly_price;
    case 'half_yearly':
      return plan.half_yearly_price;
    case 'yearly':
      return plan.yearly_price;
    default:
      return plan.monthly_price;
  }
};

const planDisplayName = (plan: SubscriptionPlan['plan']) =>
  plan.charAt(0).toUpperCase() + plan.slice(1);

// ============================================================
// 💳 Subscription Expired / Renew screen (spec §6).
// Shown when the business's subscription is `expired`, `cancelled`,
// or missing entirely. Blocks all subscription-protected app access
// until the person picks a plan + billing cycle, pays via Razorpay
// (UPI / cards / netbanking / wallets — whatever's enabled on the
// dashboard), and the payment is verified.
// ============================================================
export default function SubscriptionStatusScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { signOut, user } = useAuth();
  const { business, refetch: refetchBusiness } = useBusiness();

  const { data: mySub } = useGetMySubscription();
  const { data: plansData, isLoading: plansLoading } = useListActiveSubscriptionPlans();
  const plans: SubscriptionPlan[] = (plansData?.data ?? []).filter((p) => p.is_active);

  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan['plan'] | ''>('');
  const [selectedBillingCycle, setSelectedBillingCycle] = useState<BusinessInputBillingCycle>('monthly');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    if (!selectedPlan && plans.length > 0) {
      // Default to the business's current plan if we know it, else the first plan.
      setSelectedPlan((business?.plan as SubscriptionPlan['plan']) || plans[0].plan);
    }
  }, [plans, selectedPlan, business?.plan]);

  const status = business?.subscription_status; // 'expired' | 'cancelled' | null
  const isNoSubscription = !status;
  const heading = isNoSubscription ? 'Activate Your Subscription' : 'Subscription Expired';
  const subheading = isNoSubscription
    ? "You don't have an active plan yet. Choose a plan to continue using Khata-Pro."
    : 'Your subscription has expired. Choose a plan to continue using Khata-Pro.';

  const { mutateAsync: createOrder } = useCreateSubscriptionOrder();
  const { mutateAsync: verifyPayment } = useVerifySubscriptionPayment();

  const handleRenew = async () => {
    if (!selectedPlan) {
      setError('Please choose a plan to continue.');
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      // 1. Create a Razorpay order on the backend for this plan + cycle.
      const order = await createOrder({
        data: { plan: selectedPlan, billing_cycle: selectedBillingCycle },
      });

      // 2. Open Razorpay checkout — shows UPI/GPay/PhonePe, cards,
      //    netbanking, wallets etc. automatically.
      const payment = await openRazorpayCheckout({
        key: order.key_id,
        amount: order.amount,
        currency: order.currency,
        order_id: order.order_id,
        name: business?.business_name || 'Khata-Pro',
        description: `${planDisplayName(selectedPlan)} — ${selectedBillingCycle.replace('_', ' ')}`,
        prefill: {
          name: user?.name ?? undefined,
          email: user?.email ?? undefined,
          contact: user?.phone ?? undefined,
        },
        theme: { color: colors.primary },
      });

      // 3. Verify the payment signature on the backend & activate the plan.
      await verifyPayment({
        data: {
          razorpay_order_id: payment.razorpay_order_id,
          razorpay_payment_id: payment.razorpay_payment_id,
          razorpay_signature: payment.razorpay_signature,
          plan: selectedPlan,
          billing_cycle: selectedBillingCycle,
        },
      });

      await refetchBusiness();
    } catch (err: any) {
      if (err?.message === 'dismissed') {
        setError('Payment cancelled.');
      } else {
        setError(err?.message || 'Could not complete payment. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <KeyboardAwareScrollViewCompat
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + 32, paddingBottom: insets.bottom + 32 },
        ]}
      >
        <View style={[styles.iconWrap, { backgroundColor: colors.destructive + '15' }]}>
          <Feather name={isNoSubscription ? 'award' : 'alert-triangle'} size={26} color={colors.destructive} />
        </View>

        <Text style={[styles.title, { color: colors.foreground }]}>{heading}</Text>
        <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>{subheading}</Text>

        {business?.business_name && (
          <View style={[styles.businessBanner, { backgroundColor: colors.muted, borderRadius: colors.radius }]}>
            <Feather name="briefcase" size={14} color={colors.mutedForeground} />
            <Text style={[styles.businessBannerText, { color: colors.foreground }]}>{business.business_name}</Text>
          </View>
        )}

        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Choose a Plan</Text>

        {plansLoading ? (
          <ActivityIndicator size="small" color={colors.primary} style={{ marginTop: 12 }} />
        ) : plans.length === 0 ? (
          <Text style={[styles.errorText, { color: colors.destructive }]}>
            Could not load subscription plans. Please try again.
          </Text>
        ) : (
          <>
            <View style={{ gap: 12, marginTop: 12 }}>
              {plans.map((p) => {
                const isSelected = selectedPlan === p.plan;
                return (
                  <Pressable
                    key={p.id}
                    onPress={() => setSelectedPlan(p.plan)}
                    style={{
                      borderWidth: isSelected ? 2 : 1,
                      borderColor: isSelected ? colors.primary : colors.border,
                      borderRadius: colors.radius,
                      padding: 14,
                      backgroundColor: isSelected ? colors.primary + '10' : colors.card,
                    }}
                  >
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 15, color: colors.foreground }}>
                        {planDisplayName(p.plan)}
                      </Text>
                      <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 15, color: colors.primary }}>
                        ₹{priceForCycle(p, isSelected ? selectedBillingCycle : 'monthly').toLocaleString('en-IN')}
                        <Text style={{ fontSize: 11, fontFamily: 'Inter_400Regular', color: colors.mutedForeground }}>
                          {' '}/ {(isSelected ? selectedBillingCycle : 'monthly').replace('_', ' ')}
                        </Text>
                      </Text>
                    </View>
                  </Pressable>
                );
              })}
            </View>

            <Text style={[styles.sectionTitle, { color: colors.foreground, marginTop: 20 }]}>Billing Cycle</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 10 }}>
              {BILLING_CYCLES.map((cycle) => {
                const isSelected = selectedBillingCycle === cycle.value;
                return (
                  <Pressable
                    key={cycle.value}
                    onPress={() => setSelectedBillingCycle(cycle.value)}
                    style={{
                      paddingVertical: 8,
                      paddingHorizontal: 14,
                      borderRadius: 20,
                      borderWidth: 1,
                      borderColor: isSelected ? colors.primary : colors.border,
                      backgroundColor: isSelected ? colors.primary : colors.muted,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 12,
                        fontFamily: 'Inter_600SemiBold',
                        fontWeight: '600',
                        color: isSelected ? colors.primaryForeground : colors.foreground,
                      }}
                    >
                      {cycle.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </>
        )}

        {error ? <Text style={[styles.errorText, { color: colors.destructive, marginTop: 14 }]}>{error}</Text> : null}

        <PrimaryButton
          label="Renew Now"
          onPress={handleRenew}
          loading={submitting}
          style={{ marginTop: 24 }}
        />

        <Pressable onPress={signOut} style={{ marginTop: 16, alignItems: 'center' }}>
          <Text style={{ color: colors.mutedForeground, fontSize: 13, fontFamily: 'Inter_500Medium' }}>Log out</Text>
        </Pressable>
      </KeyboardAwareScrollViewCompat>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 24, maxWidth: 480, width: '100%', alignSelf: 'center' },
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 16,
  },
  title: { fontSize: 22, fontFamily: 'Inter_700Bold', fontWeight: '700', textAlign: 'center' },
  subtitle: { fontSize: 13.5, fontFamily: 'Inter_400Regular', textAlign: 'center', marginTop: 8, lineHeight: 19 },
  businessBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginTop: 20,
    alignSelf: 'center',
  },
  businessBannerText: { fontSize: 13, fontFamily: 'Inter_600SemiBold', fontWeight: '600' },
  sectionTitle: { fontSize: 14.5, fontFamily: 'Inter_700Bold', fontWeight: '700', marginTop: 24 },
  errorText: { fontSize: 13, fontFamily: 'Inter_400Regular' },
});