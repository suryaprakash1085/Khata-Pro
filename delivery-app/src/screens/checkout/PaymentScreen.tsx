// // // // // // // // // // // // // import React, { useState } from 'react';
// // // // // // // // // // // // // import {
// // // // // // // // // // // // //   View,
// // // // // // // // // // // // //   Text,
// // // // // // // // // // // // //   ScrollView,
// // // // // // // // // // // // //   TouchableOpacity,
// // // // // // // // // // // // //   StyleSheet,
// // // // // // // // // // // // //   TextInput,
// // // // // // // // // // // // //   Alert,
// // // // // // // // // // // // // } from 'react-native';
// // // // // // // // // // // // // import Icon from 'react-native-vector-icons/Ionicons';
// // // // // // // // // // // // // import { colors } from '../../constants/colors';

// // // // // // // // // // // // // interface PaymentScreenProps {
// // // // // // // // // // // // //   navigation: any;
// // // // // // // // // // // // //   route: any;
// // // // // // // // // // // // // }

// // // // // // // // // // // // // export default function PaymentScreen({ route, navigation }: PaymentScreenProps) {
// // // // // // // // // // // // //   const { totalAmount } = route.params || { totalAmount: 461 };
// // // // // // // // // // // // //   const [selectedMethod, setSelectedMethod] = useState<string>('card');
// // // // // // // // // // // // //   const [cardNumber, setCardNumber] = useState<string>('');
// // // // // // // // // // // // //   const [expiryDate, setExpiryDate] = useState<string>('');
// // // // // // // // // // // // //   const [cvv, setCvv] = useState<string>('');
// // // // // // // // // // // // //   const [cardHolder, setCardHolder] = useState<string>('');

// // // // // // // // // // // // //   const paymentMethods: { id: string; name: string; icon: string }[] = [
// // // // // // // // // // // // //     { id: 'card', name: 'Credit/Debit Card', icon: 'card-outline' },
// // // // // // // // // // // // //     { id: 'upi', name: 'UPI', icon: 'phone-portrait-outline' },
// // // // // // // // // // // // //     { id: 'netbanking', name: 'Net Banking', icon: 'business-outline' },
// // // // // // // // // // // // //     { id: 'wallet', name: 'Wallet', icon: 'wallet-outline' },
// // // // // // // // // // // // //     { id: 'cash', name: 'Cash on Delivery', icon: 'cash-outline' },
// // // // // // // // // // // // //   ];

// // // // // // // // // // // // //   const handlePayment = (): void => {
// // // // // // // // // // // // //     if (selectedMethod === 'card') {
// // // // // // // // // // // // //       if (!cardNumber || !expiryDate || !cvv || !cardHolder) {
// // // // // // // // // // // // //         Alert.alert('Error', 'Please fill all card details');
// // // // // // // // // // // // //         return;
// // // // // // // // // // // // //       }
// // // // // // // // // // // // //       if (cardNumber.replace(/\s/g, '').length !== 16) {
// // // // // // // // // // // // //         Alert.alert('Error', 'Please enter a valid 16-digit card number');
// // // // // // // // // // // // //         return;
// // // // // // // // // // // // //       }
// // // // // // // // // // // // //     }

// // // // // // // // // // // // //     Alert.alert(
// // // // // // // // // // // // //       'Payment Successful',
// // // // // // // // // // // // //       `Your payment of ₹${totalAmount} has been processed successfully.`,
// // // // // // // // // // // // //       [
// // // // // // // // // // // // //         {
// // // // // // // // // // // // //           text: 'OK',
// // // // // // // // // // // // //           onPress: () => navigation.navigate('OrderTracking'),
// // // // // // // // // // // // //         },
// // // // // // // // // // // // //       ]
// // // // // // // // // // // // //     );
// // // // // // // // // // // // //   };

// // // // // // // // // // // // //   const formatCardNumber = (text: string): string => {
// // // // // // // // // // // // //     const cleaned = text.replace(/\s/g, '');
// // // // // // // // // // // // //     const matches = cleaned.match(/.{1,4}/g);
// // // // // // // // // // // // //     if (matches) {
// // // // // // // // // // // // //       return matches.join(' ');
// // // // // // // // // // // // //     }
// // // // // // // // // // // // //     return text;
// // // // // // // // // // // // //   };

// // // // // // // // // // // // //   const formatExpiryDate = (text: string): string => {
// // // // // // // // // // // // //     const cleaned = text.replace(/\D/g, '');
// // // // // // // // // // // // //     if (cleaned.length >= 2) {
// // // // // // // // // // // // //       return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
// // // // // // // // // // // // //     }
// // // // // // // // // // // // //     return text;
// // // // // // // // // // // // //   };

// // // // // // // // // // // // //   return (
// // // // // // // // // // // // //     <View style={styles.container}>
// // // // // // // // // // // // //       <ScrollView showsVerticalScrollIndicator={false}>
// // // // // // // // // // // // //         <View style={styles.header}>
// // // // // // // // // // // // //           <TouchableOpacity onPress={() => navigation.goBack()}>
// // // // // // // // // // // // //             <Icon name="arrow-back" size={24} color={colors.text} />
// // // // // // // // // // // // //           </TouchableOpacity>
// // // // // // // // // // // // //           <Text style={styles.headerTitle}>Payment</Text>
// // // // // // // // // // // // //           <View style={{ width: 24 }} />
// // // // // // // // // // // // //         </View>

// // // // // // // // // // // // //         <View style={styles.amountContainer}>
// // // // // // // // // // // // //           <Text style={styles.amountLabel}>Amount to Pay</Text>
// // // // // // // // // // // // //           <Text style={styles.amountValue}>₹{totalAmount}</Text>
// // // // // // // // // // // // //         </View>

// // // // // // // // // // // // //         <View style={styles.methodsContainer}>
// // // // // // // // // // // // //           <Text style={styles.sectionTitle}>Payment Methods</Text>
// // // // // // // // // // // // //           {paymentMethods.map((method) => (
// // // // // // // // // // // // //             <TouchableOpacity
// // // // // // // // // // // // //               key={method.id}
// // // // // // // // // // // // //               style={[
// // // // // // // // // // // // //                 styles.methodItem,
// // // // // // // // // // // // //                 selectedMethod === method.id && styles.selectedMethod,
// // // // // // // // // // // // //               ]}
// // // // // // // // // // // // //               onPress={() => setSelectedMethod(method.id)}
// // // // // // // // // // // // //             >
// // // // // // // // // // // // //               <View style={styles.methodLeft}>
// // // // // // // // // // // // //                 <Icon name={method.icon} size={24} color={selectedMethod === method.id ? colors.primary : colors.text} />
// // // // // // // // // // // // //                 <Text style={[
// // // // // // // // // // // // //                   styles.methodName,
// // // // // // // // // // // // //                   selectedMethod === method.id && styles.selectedMethodText,
// // // // // // // // // // // // //                 ]}>
// // // // // // // // // // // // //                   {method.name}
// // // // // // // // // // // // //                 </Text>
// // // // // // // // // // // // //               </View>
// // // // // // // // // // // // //               {selectedMethod === method.id && (
// // // // // // // // // // // // //                 <Icon name="checkmark-circle" size={24} color={colors.primary} />
// // // // // // // // // // // // //               )}
// // // // // // // // // // // // //             </TouchableOpacity>
// // // // // // // // // // // // //           ))}
// // // // // // // // // // // // //         </View>

// // // // // // // // // // // // //         {selectedMethod === 'card' && (
// // // // // // // // // // // // //           <View style={styles.cardContainer}>
// // // // // // // // // // // // //             <Text style={styles.sectionTitle}>Card Details</Text>
            
// // // // // // // // // // // // //             <View style={styles.inputContainer}>
// // // // // // // // // // // // //               <Text style={styles.inputLabel}>Card Number</Text>
// // // // // // // // // // // // //               <TextInput
// // // // // // // // // // // // //                 style={styles.input}
// // // // // // // // // // // // //                 placeholder="1234 5678 9012 3456"
// // // // // // // // // // // // //                 value={cardNumber}
// // // // // // // // // // // // //                 onChangeText={(text) => setCardNumber(formatCardNumber(text))}
// // // // // // // // // // // // //                 keyboardType="numeric"
// // // // // // // // // // // // //                 maxLength={19}
// // // // // // // // // // // // //               />
// // // // // // // // // // // // //             </View>

// // // // // // // // // // // // //             <View style={styles.inputContainer}>
// // // // // // // // // // // // //               <Text style={styles.inputLabel}>Card Holder Name</Text>
// // // // // // // // // // // // //               <TextInput
// // // // // // // // // // // // //                 style={styles.input}
// // // // // // // // // // // // //                 placeholder="John Doe"
// // // // // // // // // // // // //                 value={cardHolder}
// // // // // // // // // // // // //                 onChangeText={setCardHolder}
// // // // // // // // // // // // //               />
// // // // // // // // // // // // //             </View>

// // // // // // // // // // // // //             <View style={styles.rowInputs}>
// // // // // // // // // // // // //               <View style={[styles.inputContainer, styles.halfInput]}>
// // // // // // // // // // // // //                 <Text style={styles.inputLabel}>Expiry Date</Text>
// // // // // // // // // // // // //                 <TextInput
// // // // // // // // // // // // //                   style={styles.input}
// // // // // // // // // // // // //                   placeholder="MM/YY"
// // // // // // // // // // // // //                   value={expiryDate}
// // // // // // // // // // // // //                   onChangeText={(text) => setExpiryDate(formatExpiryDate(text))}
// // // // // // // // // // // // //                   keyboardType="numeric"
// // // // // // // // // // // // //                   maxLength={5}
// // // // // // // // // // // // //                 />
// // // // // // // // // // // // //               </View>
// // // // // // // // // // // // //               <View style={[styles.inputContainer, styles.halfInput]}>
// // // // // // // // // // // // //                 <Text style={styles.inputLabel}>CVV</Text>
// // // // // // // // // // // // //                 <TextInput
// // // // // // // // // // // // //                   style={styles.input}
// // // // // // // // // // // // //                   placeholder="123"
// // // // // // // // // // // // //                   value={cvv}
// // // // // // // // // // // // //                   onChangeText={setCvv}
// // // // // // // // // // // // //                   keyboardType="numeric"
// // // // // // // // // // // // //                   maxLength={4}
// // // // // // // // // // // // //                   secureTextEntry
// // // // // // // // // // // // //                 />
// // // // // // // // // // // // //               </View>
// // // // // // // // // // // // //             </View>

// // // // // // // // // // // // //             <View style={styles.secureContainer}>
// // // // // // // // // // // // //               <Icon name="lock-closed-outline" size={16} color={colors.success} />
// // // // // // // // // // // // //               <Text style={styles.secureText}>Your payment is secure</Text>
// // // // // // // // // // // // //             </View>
// // // // // // // // // // // // //           </View>
// // // // // // // // // // // // //         )}

// // // // // // // // // // // // //         {selectedMethod === 'upi' && (
// // // // // // // // // // // // //           <View style={styles.cardContainer}>
// // // // // // // // // // // // //             <Text style={styles.sectionTitle}>UPI Details</Text>
// // // // // // // // // // // // //             <View style={styles.inputContainer}>
// // // // // // // // // // // // //               <Text style={styles.inputLabel}>UPI ID</Text>
// // // // // // // // // // // // //               <TextInput
// // // // // // // // // // // // //                 style={styles.input}
// // // // // // // // // // // // //                 placeholder="example@upi"
// // // // // // // // // // // // //               />
// // // // // // // // // // // // //             </View>
// // // // // // // // // // // // //             <View style={styles.upiApps}>
// // // // // // // // // // // // //               <Text style={styles.inputLabel}>Pay with</Text>
// // // // // // // // // // // // //               <View style={styles.upiAppList}>
// // // // // // // // // // // // //                 {['Google Pay', 'PhonePe', 'Paytm', 'Amazon Pay'].map((app) => (
// // // // // // // // // // // // //                   <TouchableOpacity key={app} style={styles.upiAppButton}>
// // // // // // // // // // // // //                     <Text style={styles.upiAppText}>{app}</Text>
// // // // // // // // // // // // //                   </TouchableOpacity>
// // // // // // // // // // // // //                 ))}
// // // // // // // // // // // // //               </View>
// // // // // // // // // // // // //             </View>
// // // // // // // // // // // // //           </View>
// // // // // // // // // // // // //         )}
// // // // // // // // // // // // //       </ScrollView>

// // // // // // // // // // // // //       <View style={styles.footer}>
// // // // // // // // // // // // //         <TouchableOpacity style={styles.payButton} onPress={handlePayment}>
// // // // // // // // // // // // //           <Text style={styles.payButtonText}>
// // // // // // // // // // // // //             Pay ₹{totalAmount}
// // // // // // // // // // // // //           </Text>
// // // // // // // // // // // // //         </TouchableOpacity>
// // // // // // // // // // // // //       </View>
// // // // // // // // // // // // //     </View>
// // // // // // // // // // // // //   );
// // // // // // // // // // // // // }

// // // // // // // // // // // // // const styles = StyleSheet.create({
// // // // // // // // // // // // //   container: {
// // // // // // // // // // // // //     flex: 1,
// // // // // // // // // // // // //     backgroundColor: colors.white,
// // // // // // // // // // // // //   },
// // // // // // // // // // // // //   header: {
// // // // // // // // // // // // //     flexDirection: 'row',
// // // // // // // // // // // // //     alignItems: 'center',
// // // // // // // // // // // // //     justifyContent: 'space-between',
// // // // // // // // // // // // //     padding: 16,
// // // // // // // // // // // // //     paddingTop: 40,
// // // // // // // // // // // // //     borderBottomWidth: 1,
// // // // // // // // // // // // //     borderBottomColor: colors.border,
// // // // // // // // // // // // //   },
// // // // // // // // // // // // //   headerTitle: {
// // // // // // // // // // // // //     fontSize: 18,
// // // // // // // // // // // // //     fontWeight: '600',
// // // // // // // // // // // // //     color: colors.text,
// // // // // // // // // // // // //   },
// // // // // // // // // // // // //   amountContainer: {
// // // // // // // // // // // // //     backgroundColor: colors.primary,
// // // // // // // // // // // // //     padding: 20,
// // // // // // // // // // // // //     margin: 16,
// // // // // // // // // // // // //     borderRadius: 12,
// // // // // // // // // // // // //     alignItems: 'center',
// // // // // // // // // // // // //   },
// // // // // // // // // // // // //   amountLabel: {
// // // // // // // // // // // // //     fontSize: 14,
// // // // // // // // // // // // //     color: colors.white,
// // // // // // // // // // // // //     opacity: 0.8,
// // // // // // // // // // // // //   },
// // // // // // // // // // // // //   amountValue: {
// // // // // // // // // // // // //     fontSize: 28,
// // // // // // // // // // // // //     fontWeight: '700',
// // // // // // // // // // // // //     color: colors.white,
// // // // // // // // // // // // //     marginTop: 4,
// // // // // // // // // // // // //   },
// // // // // // // // // // // // //   methodsContainer: {
// // // // // // // // // // // // //     paddingHorizontal: 16,
// // // // // // // // // // // // //   },
// // // // // // // // // // // // //   sectionTitle: {
// // // // // // // // // // // // //     fontSize: 16,
// // // // // // // // // // // // //     fontWeight: '600',
// // // // // // // // // // // // //     color: colors.text,
// // // // // // // // // // // // //     marginBottom: 12,
// // // // // // // // // // // // //   },
// // // // // // // // // // // // //   methodItem: {
// // // // // // // // // // // // //     flexDirection: 'row',
// // // // // // // // // // // // //     justifyContent: 'space-between',
// // // // // // // // // // // // //     alignItems: 'center',
// // // // // // // // // // // // //     padding: 14,
// // // // // // // // // // // // //     borderWidth: 1,
// // // // // // // // // // // // //     borderColor: colors.border,
// // // // // // // // // // // // //     borderRadius: 10,
// // // // // // // // // // // // //     marginBottom: 8,
// // // // // // // // // // // // //   },
// // // // // // // // // // // // //   selectedMethod: {
// // // // // // // // // // // // //     borderColor: colors.primary,
// // // // // // // // // // // // //     backgroundColor: '#fff5ec',
// // // // // // // // // // // // //   },
// // // // // // // // // // // // //   methodLeft: {
// // // // // // // // // // // // //     flexDirection: 'row',
// // // // // // // // // // // // //     alignItems: 'center',
// // // // // // // // // // // // //   },
// // // // // // // // // // // // //   methodName: {
// // // // // // // // // // // // //     fontSize: 14,
// // // // // // // // // // // // //     color: colors.text,
// // // // // // // // // // // // //     marginLeft: 12,
// // // // // // // // // // // // //   },
// // // // // // // // // // // // //   selectedMethodText: {
// // // // // // // // // // // // //     color: colors.primary,
// // // // // // // // // // // // //     fontWeight: '500',
// // // // // // // // // // // // //   },
// // // // // // // // // // // // //   cardContainer: {
// // // // // // // // // // // // //     padding: 16,
// // // // // // // // // // // // //     margin: 16,
// // // // // // // // // // // // //     backgroundColor: colors.lightGray,
// // // // // // // // // // // // //     borderRadius: 12,
// // // // // // // // // // // // //   },
// // // // // // // // // // // // //   inputContainer: {
// // // // // // // // // // // // //     marginBottom: 12,
// // // // // // // // // // // // //   },
// // // // // // // // // // // // //   inputLabel: {
// // // // // // // // // // // // //     fontSize: 14,
// // // // // // // // // // // // //     fontWeight: '500',
// // // // // // // // // // // // //     color: colors.text,
// // // // // // // // // // // // //     marginBottom: 4,
// // // // // // // // // // // // //   },
// // // // // // // // // // // // //   input: {
// // // // // // // // // // // // //     borderWidth: 1,
// // // // // // // // // // // // //     borderColor: colors.border,
// // // // // // // // // // // // //     borderRadius: 8,
// // // // // // // // // // // // //     paddingHorizontal: 12,
// // // // // // // // // // // // //     paddingVertical: 10,
// // // // // // // // // // // // //     fontSize: 14,
// // // // // // // // // // // // //     color: colors.text,
// // // // // // // // // // // // //     backgroundColor: colors.white,
// // // // // // // // // // // // //   },
// // // // // // // // // // // // //   rowInputs: {
// // // // // // // // // // // // //     flexDirection: 'row',
// // // // // // // // // // // // //     justifyContent: 'space-between',
// // // // // // // // // // // // //   },
// // // // // // // // // // // // //   halfInput: {
// // // // // // // // // // // // //     flex: 1,
// // // // // // // // // // // // //     marginRight: 8,
// // // // // // // // // // // // //   },
// // // // // // // // // // // // //   secureContainer: {
// // // // // // // // // // // // //     flexDirection: 'row',
// // // // // // // // // // // // //     alignItems: 'center',
// // // // // // // // // // // // //     marginTop: 8,
// // // // // // // // // // // // //   },
// // // // // // // // // // // // //   secureText: {
// // // // // // // // // // // // //     fontSize: 12,
// // // // // // // // // // // // //     color: colors.success,
// // // // // // // // // // // // //     marginLeft: 4,
// // // // // // // // // // // // //   },
// // // // // // // // // // // // //   upiApps: {
// // // // // // // // // // // // //     marginTop: 8,
// // // // // // // // // // // // //   },
// // // // // // // // // // // // //   upiAppList: {
// // // // // // // // // // // // //     flexDirection: 'row',
// // // // // // // // // // // // //     flexWrap: 'wrap',
// // // // // // // // // // // // //     marginTop: 8,
// // // // // // // // // // // // //   },
// // // // // // // // // // // // //   upiAppButton: {
// // // // // // // // // // // // //     backgroundColor: colors.white,
// // // // // // // // // // // // //     paddingHorizontal: 16,
// // // // // // // // // // // // //     paddingVertical: 8,
// // // // // // // // // // // // //     borderRadius: 8,
// // // // // // // // // // // // //     marginRight: 8,
// // // // // // // // // // // // //     marginBottom: 8,
// // // // // // // // // // // // //     borderWidth: 1,
// // // // // // // // // // // // //     borderColor: colors.border,
// // // // // // // // // // // // //   },
// // // // // // // // // // // // //   upiAppText: {
// // // // // // // // // // // // //     fontSize: 12,
// // // // // // // // // // // // //     color: colors.text,
// // // // // // // // // // // // //   },
// // // // // // // // // // // // //   footer: {
// // // // // // // // // // // // //     padding: 16,
// // // // // // // // // // // // //     backgroundColor: colors.white,
// // // // // // // // // // // // //     borderTopWidth: 1,
// // // // // // // // // // // // //     borderTopColor: colors.border,
// // // // // // // // // // // // //   },
// // // // // // // // // // // // //   payButton: {
// // // // // // // // // // // // //     backgroundColor: colors.primary,
// // // // // // // // // // // // //     borderRadius: 12,
// // // // // // // // // // // // //     height: 50,
// // // // // // // // // // // // //     justifyContent: 'center',
// // // // // // // // // // // // //     alignItems: 'center',
// // // // // // // // // // // // //   },
// // // // // // // // // // // // //   payButtonText: {
// // // // // // // // // // // // //     color: colors.white,
// // // // // // // // // // // // //     fontSize: 16,
// // // // // // // // // // // // //     fontWeight: '600',
// // // // // // // // // // // // //   },
// // // // // // // // // // // // // });
// // // // // // // // // // // // import React, { useState } from 'react';
// // // // // // // // // // // // import {
// // // // // // // // // // // //   View,
// // // // // // // // // // // //   Text,
// // // // // // // // // // // //   ScrollView,
// // // // // // // // // // // //   TouchableOpacity,
// // // // // // // // // // // //   StyleSheet,
// // // // // // // // // // // //   TextInput,
// // // // // // // // // // // //   Alert,
// // // // // // // // // // // // } from 'react-native';
// // // // // // // // // // // // import Icon from 'react-native-vector-icons/Ionicons';
// // // // // // // // // // // // import { colors } from '../../constants/colors';

// // // // // // // // // // // // interface PaymentScreenProps {
// // // // // // // // // // // //   navigation: any;
// // // // // // // // // // // //   route: any;
// // // // // // // // // // // // }

// // // // // // // // // // // // export default function PaymentScreen({ route, navigation }: PaymentScreenProps) {
// // // // // // // // // // // //   const { totalAmount } = route.params || { totalAmount: 461 };
// // // // // // // // // // // //   const [selectedMethod, setSelectedMethod] = useState<string>('card');
// // // // // // // // // // // //   const [cardNumber, setCardNumber] = useState<string>('');
// // // // // // // // // // // //   const [expiryDate, setExpiryDate] = useState<string>('');
// // // // // // // // // // // //   const [cvv, setCvv] = useState<string>('');
// // // // // // // // // // // //   const [cardHolder, setCardHolder] = useState<string>('');

// // // // // // // // // // // //   const paymentMethods: { id: string; name: string; icon: string }[] = [
// // // // // // // // // // // //     { id: 'card', name: 'Credit/Debit Card', icon: 'card-outline' },
// // // // // // // // // // // //     { id: 'upi', name: 'UPI', icon: 'phone-portrait-outline' },
// // // // // // // // // // // //     { id: 'netbanking', name: 'Net Banking', icon: 'business-outline' },
// // // // // // // // // // // //     { id: 'wallet', name: 'Wallet', icon: 'wallet-outline' },
// // // // // // // // // // // //     { id: 'cash', name: 'Cash on Delivery', icon: 'cash-outline' },
// // // // // // // // // // // //   ];

// // // // // // // // // // // //   const handleSelectMethod = (methodId: string) => {
// // // // // // // // // // // //     setSelectedMethod(methodId);
// // // // // // // // // // // //   };

// // // // // // // // // // // //   const handleConfirmPayment = (): void => {
// // // // // // // // // // // //     if (selectedMethod === 'card') {
// // // // // // // // // // // //       if (!cardNumber || !expiryDate || !cvv || !cardHolder) {
// // // // // // // // // // // //         Alert.alert('Error', 'Please fill all card details');
// // // // // // // // // // // //         return;
// // // // // // // // // // // //       }
// // // // // // // // // // // //       if (cardNumber.replace(/\s/g, '').length !== 16) {
// // // // // // // // // // // //         Alert.alert('Error', 'Please enter a valid 16-digit card number');
// // // // // // // // // // // //         return;
// // // // // // // // // // // //       }
// // // // // // // // // // // //     }

// // // // // // // // // // // //     // Navigate back to Checkout with selected payment method
// // // // // // // // // // // //     navigation.navigate('Checkout', { selectedPayment: selectedMethod });
// // // // // // // // // // // //   };

// // // // // // // // // // // //   const formatCardNumber = (text: string): string => {
// // // // // // // // // // // //     const cleaned = text.replace(/\s/g, '');
// // // // // // // // // // // //     const matches = cleaned.match(/.{1,4}/g);
// // // // // // // // // // // //     if (matches) {
// // // // // // // // // // // //       return matches.join(' ');
// // // // // // // // // // // //     }
// // // // // // // // // // // //     return text;
// // // // // // // // // // // //   };

// // // // // // // // // // // //   const formatExpiryDate = (text: string): string => {
// // // // // // // // // // // //     const cleaned = text.replace(/\D/g, '');
// // // // // // // // // // // //     if (cleaned.length >= 2) {
// // // // // // // // // // // //       return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
// // // // // // // // // // // //     }
// // // // // // // // // // // //     return text;
// // // // // // // // // // // //   };

// // // // // // // // // // // //   return (
// // // // // // // // // // // //     <View style={styles.container}>
// // // // // // // // // // // //       <ScrollView showsVerticalScrollIndicator={false}>
// // // // // // // // // // // //         <View style={styles.header}>
// // // // // // // // // // // //           <TouchableOpacity onPress={() => navigation.goBack()}>
// // // // // // // // // // // //             <Icon name="arrow-back" size={24} color={colors.text} />
// // // // // // // // // // // //           </TouchableOpacity>
// // // // // // // // // // // //           <Text style={styles.headerTitle}>Payment</Text>
// // // // // // // // // // // //           <View style={{ width: 24 }} />
// // // // // // // // // // // //         </View>

// // // // // // // // // // // //         <View style={styles.amountContainer}>
// // // // // // // // // // // //           <Text style={styles.amountLabel}>Amount to Pay</Text>
// // // // // // // // // // // //           <Text style={styles.amountValue}>₹{totalAmount}</Text>
// // // // // // // // // // // //         </View>

// // // // // // // // // // // //         <View style={styles.methodsContainer}>
// // // // // // // // // // // //           <Text style={styles.sectionTitle}>Payment Methods</Text>
// // // // // // // // // // // //           {paymentMethods.map((method) => (
// // // // // // // // // // // //             <TouchableOpacity
// // // // // // // // // // // //               key={method.id}
// // // // // // // // // // // //               style={[
// // // // // // // // // // // //                 styles.methodItem,
// // // // // // // // // // // //                 selectedMethod === method.id && styles.selectedMethod,
// // // // // // // // // // // //               ]}
// // // // // // // // // // // //               onPress={() => handleSelectMethod(method.id)}
// // // // // // // // // // // //             >
// // // // // // // // // // // //               <View style={styles.methodLeft}>
// // // // // // // // // // // //                 <Icon name={method.icon} size={24} color={selectedMethod === method.id ? colors.primary : colors.text} />
// // // // // // // // // // // //                 <Text style={[
// // // // // // // // // // // //                   styles.methodName,
// // // // // // // // // // // //                   selectedMethod === method.id && styles.selectedMethodText,
// // // // // // // // // // // //                 ]}>
// // // // // // // // // // // //                   {method.name}
// // // // // // // // // // // //                 </Text>
// // // // // // // // // // // //               </View>
// // // // // // // // // // // //               {selectedMethod === method.id && (
// // // // // // // // // // // //                 <Icon name="checkmark-circle" size={24} color={colors.primary} />
// // // // // // // // // // // //               )}
// // // // // // // // // // // //             </TouchableOpacity>
// // // // // // // // // // // //           ))}
// // // // // // // // // // // //         </View>

// // // // // // // // // // // //         {selectedMethod === 'card' && (
// // // // // // // // // // // //           <View style={styles.cardContainer}>
// // // // // // // // // // // //             <Text style={styles.sectionTitle}>Card Details</Text>
            
// // // // // // // // // // // //             <View style={styles.inputContainer}>
// // // // // // // // // // // //               <Text style={styles.inputLabel}>Card Number</Text>
// // // // // // // // // // // //               <TextInput
// // // // // // // // // // // //                 style={styles.input}
// // // // // // // // // // // //                 placeholder="1234 5678 9012 3456"
// // // // // // // // // // // //                 value={cardNumber}
// // // // // // // // // // // //                 onChangeText={(text) => setCardNumber(formatCardNumber(text))}
// // // // // // // // // // // //                 keyboardType="numeric"
// // // // // // // // // // // //                 maxLength={19}
// // // // // // // // // // // //               />
// // // // // // // // // // // //             </View>

// // // // // // // // // // // //             <View style={styles.inputContainer}>
// // // // // // // // // // // //               <Text style={styles.inputLabel}>Card Holder Name</Text>
// // // // // // // // // // // //               <TextInput
// // // // // // // // // // // //                 style={styles.input}
// // // // // // // // // // // //                 placeholder="John Doe"
// // // // // // // // // // // //                 value={cardHolder}
// // // // // // // // // // // //                 onChangeText={setCardHolder}
// // // // // // // // // // // //               />
// // // // // // // // // // // //             </View>

// // // // // // // // // // // //             <View style={styles.rowInputs}>
// // // // // // // // // // // //               <View style={[styles.inputContainer, styles.halfInput]}>
// // // // // // // // // // // //                 <Text style={styles.inputLabel}>Expiry Date</Text>
// // // // // // // // // // // //                 <TextInput
// // // // // // // // // // // //                   style={styles.input}
// // // // // // // // // // // //                   placeholder="MM/YY"
// // // // // // // // // // // //                   value={expiryDate}
// // // // // // // // // // // //                   onChangeText={(text) => setExpiryDate(formatExpiryDate(text))}
// // // // // // // // // // // //                   keyboardType="numeric"
// // // // // // // // // // // //                   maxLength={5}
// // // // // // // // // // // //                 />
// // // // // // // // // // // //               </View>
// // // // // // // // // // // //               <View style={[styles.inputContainer, styles.halfInput]}>
// // // // // // // // // // // //                 <Text style={styles.inputLabel}>CVV</Text>
// // // // // // // // // // // //                 <TextInput
// // // // // // // // // // // //                   style={styles.input}
// // // // // // // // // // // //                   placeholder="123"
// // // // // // // // // // // //                   value={cvv}
// // // // // // // // // // // //                   onChangeText={setCvv}
// // // // // // // // // // // //                   keyboardType="numeric"
// // // // // // // // // // // //                   maxLength={4}
// // // // // // // // // // // //                   secureTextEntry
// // // // // // // // // // // //                 />
// // // // // // // // // // // //               </View>
// // // // // // // // // // // //             </View>

// // // // // // // // // // // //             <View style={styles.secureContainer}>
// // // // // // // // // // // //               <Icon name="lock-closed-outline" size={16} color={colors.success} />
// // // // // // // // // // // //               <Text style={styles.secureText}>Your payment is secure</Text>
// // // // // // // // // // // //             </View>
// // // // // // // // // // // //           </View>
// // // // // // // // // // // //         )}

// // // // // // // // // // // //         {selectedMethod === 'upi' && (
// // // // // // // // // // // //           <View style={styles.cardContainer}>
// // // // // // // // // // // //             <Text style={styles.sectionTitle}>UPI Details</Text>
// // // // // // // // // // // //             <View style={styles.inputContainer}>
// // // // // // // // // // // //               <Text style={styles.inputLabel}>UPI ID</Text>
// // // // // // // // // // // //               <TextInput
// // // // // // // // // // // //                 style={styles.input}
// // // // // // // // // // // //                 placeholder="example@upi"
// // // // // // // // // // // //               />
// // // // // // // // // // // //             </View>
// // // // // // // // // // // //             <View style={styles.upiApps}>
// // // // // // // // // // // //               <Text style={styles.inputLabel}>Pay with</Text>
// // // // // // // // // // // //               <View style={styles.upiAppList}>
// // // // // // // // // // // //                 {['Google Pay', 'PhonePe', 'Paytm', 'Amazon Pay'].map((app) => (
// // // // // // // // // // // //                   <TouchableOpacity key={app} style={styles.upiAppButton}>
// // // // // // // // // // // //                     <Text style={styles.upiAppText}>{app}</Text>
// // // // // // // // // // // //                   </TouchableOpacity>
// // // // // // // // // // // //                 ))}
// // // // // // // // // // // //               </View>
// // // // // // // // // // // //             </View>
// // // // // // // // // // // //           </View>
// // // // // // // // // // // //         )}
// // // // // // // // // // // //       </ScrollView>

// // // // // // // // // // // //       <View style={styles.footer}>
// // // // // // // // // // // //         <TouchableOpacity style={styles.payButton} onPress={handleConfirmPayment}>
// // // // // // // // // // // //           <Text style={styles.payButtonText}>
// // // // // // // // // // // //             Confirm Payment
// // // // // // // // // // // //           </Text>
// // // // // // // // // // // //         </TouchableOpacity>
// // // // // // // // // // // //       </View>
// // // // // // // // // // // //     </View>
// // // // // // // // // // // //   );
// // // // // // // // // // // // }

// // // // // // // // // // // // const styles = StyleSheet.create({
// // // // // // // // // // // //   container: {
// // // // // // // // // // // //     flex: 1,
// // // // // // // // // // // //     backgroundColor: colors.white,
// // // // // // // // // // // //   },
// // // // // // // // // // // //   header: {
// // // // // // // // // // // //     flexDirection: 'row',
// // // // // // // // // // // //     alignItems: 'center',
// // // // // // // // // // // //     justifyContent: 'space-between',
// // // // // // // // // // // //     padding: 16,
// // // // // // // // // // // //     paddingTop: 40,
// // // // // // // // // // // //     borderBottomWidth: 1,
// // // // // // // // // // // //     borderBottomColor: colors.border,
// // // // // // // // // // // //   },
// // // // // // // // // // // //   headerTitle: {
// // // // // // // // // // // //     fontSize: 18,
// // // // // // // // // // // //     fontWeight: '600',
// // // // // // // // // // // //     color: colors.text,
// // // // // // // // // // // //   },
// // // // // // // // // // // //   amountContainer: {
// // // // // // // // // // // //     backgroundColor: colors.primary,
// // // // // // // // // // // //     padding: 20,
// // // // // // // // // // // //     margin: 16,
// // // // // // // // // // // //     borderRadius: 12,
// // // // // // // // // // // //     alignItems: 'center',
// // // // // // // // // // // //   },
// // // // // // // // // // // //   amountLabel: {
// // // // // // // // // // // //     fontSize: 14,
// // // // // // // // // // // //     color: colors.white,
// // // // // // // // // // // //     opacity: 0.8,
// // // // // // // // // // // //   },
// // // // // // // // // // // //   amountValue: {
// // // // // // // // // // // //     fontSize: 28,
// // // // // // // // // // // //     fontWeight: '700',
// // // // // // // // // // // //     color: colors.white,
// // // // // // // // // // // //     marginTop: 4,
// // // // // // // // // // // //   },
// // // // // // // // // // // //   methodsContainer: {
// // // // // // // // // // // //     paddingHorizontal: 16,
// // // // // // // // // // // //   },
// // // // // // // // // // // //   sectionTitle: {
// // // // // // // // // // // //     fontSize: 16,
// // // // // // // // // // // //     fontWeight: '600',
// // // // // // // // // // // //     color: colors.text,
// // // // // // // // // // // //     marginBottom: 12,
// // // // // // // // // // // //   },
// // // // // // // // // // // //   methodItem: {
// // // // // // // // // // // //     flexDirection: 'row',
// // // // // // // // // // // //     justifyContent: 'space-between',
// // // // // // // // // // // //     alignItems: 'center',
// // // // // // // // // // // //     padding: 14,
// // // // // // // // // // // //     borderWidth: 1,
// // // // // // // // // // // //     borderColor: colors.border,
// // // // // // // // // // // //     borderRadius: 10,
// // // // // // // // // // // //     marginBottom: 8,
// // // // // // // // // // // //   },
// // // // // // // // // // // //   selectedMethod: {
// // // // // // // // // // // //     borderColor: colors.primary,
// // // // // // // // // // // //     backgroundColor: '#fff5ec',
// // // // // // // // // // // //   },
// // // // // // // // // // // //   methodLeft: {
// // // // // // // // // // // //     flexDirection: 'row',
// // // // // // // // // // // //     alignItems: 'center',
// // // // // // // // // // // //   },
// // // // // // // // // // // //   methodName: {
// // // // // // // // // // // //     fontSize: 14,
// // // // // // // // // // // //     color: colors.text,
// // // // // // // // // // // //     marginLeft: 12,
// // // // // // // // // // // //   },
// // // // // // // // // // // //   selectedMethodText: {
// // // // // // // // // // // //     color: colors.primary,
// // // // // // // // // // // //     fontWeight: '500',
// // // // // // // // // // // //   },
// // // // // // // // // // // //   cardContainer: {
// // // // // // // // // // // //     padding: 16,
// // // // // // // // // // // //     margin: 16,
// // // // // // // // // // // //     backgroundColor: colors.lightGray,
// // // // // // // // // // // //     borderRadius: 12,
// // // // // // // // // // // //   },
// // // // // // // // // // // //   inputContainer: {
// // // // // // // // // // // //     marginBottom: 12,
// // // // // // // // // // // //   },
// // // // // // // // // // // //   inputLabel: {
// // // // // // // // // // // //     fontSize: 14,
// // // // // // // // // // // //     fontWeight: '500',
// // // // // // // // // // // //     color: colors.text,
// // // // // // // // // // // //     marginBottom: 4,
// // // // // // // // // // // //   },
// // // // // // // // // // // //   input: {
// // // // // // // // // // // //     borderWidth: 1,
// // // // // // // // // // // //     borderColor: colors.border,
// // // // // // // // // // // //     borderRadius: 8,
// // // // // // // // // // // //     paddingHorizontal: 12,
// // // // // // // // // // // //     paddingVertical: 10,
// // // // // // // // // // // //     fontSize: 14,
// // // // // // // // // // // //     color: colors.text,
// // // // // // // // // // // //     backgroundColor: colors.white,
// // // // // // // // // // // //   },
// // // // // // // // // // // //   rowInputs: {
// // // // // // // // // // // //     flexDirection: 'row',
// // // // // // // // // // // //     justifyContent: 'space-between',
// // // // // // // // // // // //   },
// // // // // // // // // // // //   halfInput: {
// // // // // // // // // // // //     flex: 1,
// // // // // // // // // // // //     marginRight: 8,
// // // // // // // // // // // //   },
// // // // // // // // // // // //   secureContainer: {
// // // // // // // // // // // //     flexDirection: 'row',
// // // // // // // // // // // //     alignItems: 'center',
// // // // // // // // // // // //     marginTop: 8,
// // // // // // // // // // // //   },
// // // // // // // // // // // //   secureText: {
// // // // // // // // // // // //     fontSize: 12,
// // // // // // // // // // // //     color: colors.success,
// // // // // // // // // // // //     marginLeft: 4,
// // // // // // // // // // // //   },
// // // // // // // // // // // //   upiApps: {
// // // // // // // // // // // //     marginTop: 8,
// // // // // // // // // // // //   },
// // // // // // // // // // // //   upiAppList: {
// // // // // // // // // // // //     flexDirection: 'row',
// // // // // // // // // // // //     flexWrap: 'wrap',
// // // // // // // // // // // //     marginTop: 8,
// // // // // // // // // // // //   },
// // // // // // // // // // // //   upiAppButton: {
// // // // // // // // // // // //     backgroundColor: colors.white,
// // // // // // // // // // // //     paddingHorizontal: 16,
// // // // // // // // // // // //     paddingVertical: 8,
// // // // // // // // // // // //     borderRadius: 8,
// // // // // // // // // // // //     marginRight: 8,
// // // // // // // // // // // //     marginBottom: 8,
// // // // // // // // // // // //     borderWidth: 1,
// // // // // // // // // // // //     borderColor: colors.border,
// // // // // // // // // // // //   },
// // // // // // // // // // // //   upiAppText: {
// // // // // // // // // // // //     fontSize: 12,
// // // // // // // // // // // //     color: colors.text,
// // // // // // // // // // // //   },
// // // // // // // // // // // //   footer: {
// // // // // // // // // // // //     padding: 16,
// // // // // // // // // // // //     backgroundColor: colors.white,
// // // // // // // // // // // //     borderTopWidth: 1,
// // // // // // // // // // // //     borderTopColor: colors.border,
// // // // // // // // // // // //   },
// // // // // // // // // // // //   payButton: {
// // // // // // // // // // // //     backgroundColor: colors.primary,
// // // // // // // // // // // //     borderRadius: 12,
// // // // // // // // // // // //     height: 50,
// // // // // // // // // // // //     justifyContent: 'center',
// // // // // // // // // // // //     alignItems: 'center',
// // // // // // // // // // // //   },
// // // // // // // // // // // //   payButtonText: {
// // // // // // // // // // // //     color: colors.white,
// // // // // // // // // // // //     fontSize: 16,
// // // // // // // // // // // //     fontWeight: '600',
// // // // // // // // // // // //   },
// // // // // // // // // // // // });
// // // // // // // // // // // import React, { useState } from 'react';
// // // // // // // // // // // import {
// // // // // // // // // // //   View,
// // // // // // // // // // //   Text,
// // // // // // // // // // //   ScrollView,
// // // // // // // // // // //   TouchableOpacity,
// // // // // // // // // // //   StyleSheet,
// // // // // // // // // // //   TextInput,
// // // // // // // // // // //   Alert,
// // // // // // // // // // //   Modal,
// // // // // // // // // // //   ActivityIndicator,
// // // // // // // // // // //   Image,
// // // // // // // // // // //   TextInput as RNTextInput,
// // // // // // // // // // // } from 'react-native';
// // // // // // // // // // // import * as Haptics from 'expo-haptics';
// // // // // // // // // // // import Icon from 'react-native-vector-icons/Ionicons';
// // // // // // // // // // // import { colors } from '../../constants/colors';

// // // // // // // // // // // interface PaymentScreenProps {
// // // // // // // // // // //   navigation: any;
// // // // // // // // // // //   route: any;
// // // // // // // // // // // }

// // // // // // // // // // // export default function PaymentScreen({ route, navigation }: PaymentScreenProps) {
// // // // // // // // // // //   const { totalAmount } = route.params || { totalAmount: 461 };
// // // // // // // // // // //   const [selectedMethod, setSelectedMethod] = useState<string>('');
// // // // // // // // // // //   const [showUPIModal, setShowUPIModal] = useState<boolean>(false);
// // // // // // // // // // //   const [selectedUPIApp, setSelectedUPIApp] = useState<string>('');
// // // // // // // // // // //   const [showCardModal, setShowCardModal] = useState<boolean>(false);
// // // // // // // // // // //   const [showNetBankingModal, setShowNetBankingModal] = useState<boolean>(false);
// // // // // // // // // // //   const [showWalletModal, setShowWalletModal] = useState<boolean>(false);
// // // // // // // // // // //   const [loading, setLoading] = useState<boolean>(false);
// // // // // // // // // // //   const [upiPin, setUpiPin] = useState<string>('');
// // // // // // // // // // //   const [showUPIPinModal, setShowUPIPinModal] = useState<boolean>(false);
// // // // // // // // // // //   const [paymentSuccess, setPaymentSuccess] = useState<boolean>(false);
  
// // // // // // // // // // //   // Card Details
// // // // // // // // // // //   const [cardNumber, setCardNumber] = useState<string>('');
// // // // // // // // // // //   const [expiryDate, setExpiryDate] = useState<string>('');
// // // // // // // // // // //   const [cvv, setCvv] = useState<string>('');
// // // // // // // // // // //   const [cardHolder, setCardHolder] = useState<string>('');

// // // // // // // // // // //   // Wallet
// // // // // // // // // // //   const walletBalance = 2500;
// // // // // // // // // // //   const [walletPin, setWalletPin] = useState<string>('');

// // // // // // // // // // //   // Net Banking Banks
// // // // // // // // // // //   const banks = [
// // // // // // // // // // //     { id: 'sbi', name: 'State Bank of India', icon: '🏦' },
// // // // // // // // // // //     { id: 'hdfc', name: 'HDFC Bank', icon: '🏛️' },
// // // // // // // // // // //     { id: 'icici', name: 'ICICI Bank', icon: '🏛️' },
// // // // // // // // // // //     { id: 'axis', name: 'Axis Bank', icon: '🏦' },
// // // // // // // // // // //     { id: 'kotak', name: 'Kotak Mahindra Bank', icon: '🏦' },
// // // // // // // // // // //     { id: 'yes', name: 'Yes Bank', icon: '🏛️' },
// // // // // // // // // // //     { id: 'pNB', name: 'Punjab National Bank', icon: '🏦' },
// // // // // // // // // // //     { id: 'bob', name: 'Bank of Baroda', icon: '🏛️' },
// // // // // // // // // // //   ];

// // // // // // // // // // //   // UPI Apps
// // // // // // // // // // //   const upiApps = [
// // // // // // // // // // //     { id: 'gpay', name: 'Google Pay', icon: '💳', color: '#4285F4' },
// // // // // // // // // // //     { id: 'phonepe', name: 'PhonePe', icon: '📱', color: '#5F259F' },
// // // // // // // // // // //     { id: 'paytm', name: 'Paytm', icon: '🔵', color: '#00BAF2' },
// // // // // // // // // // //     { id: 'amazonpay', name: 'Amazon Pay', icon: '🟠', color: '#FF9900' },
// // // // // // // // // // //     { id: 'bhim', name: 'BHIM UPI', icon: '🔷', color: '#0084B4' },
// // // // // // // // // // //   ];

// // // // // // // // // // //   const paymentMethods: { id: string; name: string; icon: string; desc: string }[] = [
// // // // // // // // // // //     { id: 'card', name: 'Credit/Debit Card', icon: 'card-outline', desc: 'Pay with card' },
// // // // // // // // // // //     { id: 'upi', name: 'UPI', icon: 'phone-portrait-outline', desc: 'Google Pay, PhonePe, Paytm' },
// // // // // // // // // // //     { id: 'netbanking', name: 'Net Banking', icon: 'business-outline', desc: 'All major banks' },
// // // // // // // // // // //     { id: 'wallet', name: 'Wallet', icon: 'wallet-outline', desc: `Balance: ₹${walletBalance}` },
// // // // // // // // // // //     { id: 'cash', name: 'Cash on Delivery', icon: 'cash-outline', desc: 'Pay when you receive' },
// // // // // // // // // // //   ];

// // // // // // // // // // //   const handleSelectMethod = (methodId: string) => {
// // // // // // // // // // //     Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
// // // // // // // // // // //     setSelectedMethod(methodId);
    
// // // // // // // // // // //     switch (methodId) {
// // // // // // // // // // //       case 'upi':
// // // // // // // // // // //         setShowUPIModal(true);
// // // // // // // // // // //         break;
// // // // // // // // // // //       case 'card':
// // // // // // // // // // //         setShowCardModal(true);
// // // // // // // // // // //         break;
// // // // // // // // // // //       case 'netbanking':
// // // // // // // // // // //         setShowNetBankingModal(true);
// // // // // // // // // // //         break;
// // // // // // // // // // //       case 'wallet':
// // // // // // // // // // //         setShowWalletModal(true);
// // // // // // // // // // //         break;
// // // // // // // // // // //       case 'cash':
// // // // // // // // // // //         handleCashOnDelivery();
// // // // // // // // // // //         break;
// // // // // // // // // // //       default:
// // // // // // // // // // //         break;
// // // // // // // // // // //     }
// // // // // // // // // // //   };

// // // // // // // // // // //   // ============ UPI FLOW ============
// // // // // // // // // // //   const handleUPISelection = (app: any) => {
// // // // // // // // // // //     setSelectedUPIApp(app.name);
// // // // // // // // // // //     setShowUPIModal(false);
    
// // // // // // // // // // //     Alert.alert(
// // // // // // // // // // //       `Pay with ${app.name}`,
// // // // // // // // // // //       `Amount: ₹${totalAmount}\n\nYou will be redirected to ${app.name} to complete the payment.`,
// // // // // // // // // // //       [
// // // // // // // // // // //         { text: 'Cancel', style: 'cancel' },
// // // // // // // // // // //         { 
// // // // // // // // // // //           text: 'Proceed', 
// // // // // // // // // // //           onPress: () => showUPIPinEntry()
// // // // // // // // // // //         }
// // // // // // // // // // //       ]
// // // // // // // // // // //     );
// // // // // // // // // // //   };

// // // // // // // // // // //   const showUPIPinEntry = () => {
// // // // // // // // // // //     Alert.alert(
// // // // // // // // // // //       'Enter UPI PIN',
// // // // // // // // // // //       'Please enter your UPI PIN to confirm payment',
// // // // // // // // // // //       [
// // // // // // // // // // //         { text: 'Cancel', style: 'cancel' },
// // // // // // // // // // //         { 
// // // // // // // // // // //           text: 'Confirm', 
// // // // // // // // // // //           onPress: () => {
// // // // // // // // // // //             Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
// // // // // // // // // // //             simulateUPIPayment();
// // // // // // // // // // //           }
// // // // // // // // // // //         }
// // // // // // // // // // //       ]
// // // // // // // // // // //     );
// // // // // // // // // // //   };

// // // // // // // // // // //   const simulateUPIPayment = () => {
// // // // // // // // // // //     setLoading(true);
// // // // // // // // // // //     // Simulate UPI payment processing
// // // // // // // // // // //     setTimeout(() => {
// // // // // // // // // // //       setLoading(false);
// // // // // // // // // // //       setPaymentSuccess(true);
// // // // // // // // // // //       Alert.alert(
// // // // // // // // // // //         '✅ Payment Successful!',
// // // // // // // // // // //         `₹${totalAmount} has been sent via ${selectedUPIApp || 'UPI'}\n\nTransaction ID: UPI${Date.now().toString().slice(-10)}`,
// // // // // // // // // // //         [
// // // // // // // // // // //           {
// // // // // // // // // // //             text: 'Continue',
// // // // // // // // // // //             onPress: () => {
// // // // // // // // // // //               setPaymentSuccess(false);
// // // // // // // // // // //               navigation.navigate('OrderTracking');
// // // // // // // // // // //             }
// // // // // // // // // // //           }
// // // // // // // // // // //         ]
// // // // // // // // // // //       );
// // // // // // // // // // //     }, 2000);
// // // // // // // // // // //   };

// // // // // // // // // // //   // ============ CARD FLOW ============
// // // // // // // // // // //   const handleCardPayment = () => {
// // // // // // // // // // //     if (!cardNumber || !expiryDate || !cvv || !cardHolder) {
// // // // // // // // // // //       Alert.alert('Error', 'Please fill all card details');
// // // // // // // // // // //       return;
// // // // // // // // // // //     }
// // // // // // // // // // //     if (cardNumber.replace(/\s/g, '').length !== 16) {
// // // // // // // // // // //       Alert.alert('Error', 'Please enter a valid 16-digit card number');
// // // // // // // // // // //       return;
// // // // // // // // // // //     }
// // // // // // // // // // //     if (cvv.length < 3) {
// // // // // // // // // // //       Alert.alert('Error', 'Please enter a valid CVV');
// // // // // // // // // // //       return;
// // // // // // // // // // //     }

// // // // // // // // // // //     Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
// // // // // // // // // // //     setShowCardModal(false);
// // // // // // // // // // //     setLoading(true);
    
// // // // // // // // // // //     // Simulate card processing
// // // // // // // // // // //     setTimeout(() => {
// // // // // // // // // // //       setLoading(false);
// // // // // // // // // // //       setPaymentSuccess(true);
// // // // // // // // // // //       Alert.alert(
// // // // // // // // // // //         '✅ Payment Successful!',
// // // // // // // // // // //         `₹${totalAmount} has been charged to your card ending in ${cardNumber.slice(-4)}\n\nTransaction ID: CARD${Date.now().toString().slice(-10)}`,
// // // // // // // // // // //         [
// // // // // // // // // // //           {
// // // // // // // // // // //             text: 'Continue',
// // // // // // // // // // //             onPress: () => {
// // // // // // // // // // //               setPaymentSuccess(false);
// // // // // // // // // // //               navigation.navigate('OrderTracking');
// // // // // // // // // // //             }
// // // // // // // // // // //           }
// // // // // // // // // // //         ]
// // // // // // // // // // //       );
// // // // // // // // // // //     }, 2500);
// // // // // // // // // // //   };

// // // // // // // // // // //   // ============ NET BANKING FLOW ============
// // // // // // // // // // //   const handleNetBankingSelect = (bank: any) => {
// // // // // // // // // // //     setShowNetBankingModal(false);
    
// // // // // // // // // // //     Alert.alert(
// // // // // // // // // // //       `Pay with ${bank.name}`,
// // // // // // // // // // //       `Amount: ₹${totalAmount}\n\nYou will be redirected to ${bank.name}'s secure payment page.`,
// // // // // // // // // // //       [
// // // // // // // // // // //         { text: 'Cancel', style: 'cancel' },
// // // // // // // // // // //         { 
// // // // // // // // // // //           text: 'Proceed', 
// // // // // // // // // // //           onPress: () => {
// // // // // // // // // // //             setLoading(true);
// // // // // // // // // // //             setTimeout(() => {
// // // // // // // // // // //               setLoading(false);
// // // // // // // // // // //               setPaymentSuccess(true);
// // // // // // // // // // //               Alert.alert(
// // // // // // // // // // //                 '✅ Payment Successful!',
// // // // // // // // // // //                 `₹${totalAmount} has been paid via ${bank.name}\n\nTransaction ID: NB${Date.now().toString().slice(-10)}`,
// // // // // // // // // // //                 [
// // // // // // // // // // //                   {
// // // // // // // // // // //                     text: 'Continue',
// // // // // // // // // // //                     onPress: () => {
// // // // // // // // // // //                       setPaymentSuccess(false);
// // // // // // // // // // //                       navigation.navigate('OrderTracking');
// // // // // // // // // // //                     }
// // // // // // // // // // //                   }
// // // // // // // // // // //                 ]
// // // // // // // // // // //               );
// // // // // // // // // // //             }, 2000);
// // // // // // // // // // //           }
// // // // // // // // // // //         }
// // // // // // // // // // //       ]
// // // // // // // // // // //     );
// // // // // // // // // // //   };

// // // // // // // // // // //   // ============ WALLET FLOW ============
// // // // // // // // // // //   const handleWalletPayment = () => {
// // // // // // // // // // //     if (totalAmount > walletBalance) {
// // // // // // // // // // //       Alert.alert(
// // // // // // // // // // //         'Insufficient Balance',
// // // // // // // // // // //         `Wallet balance: ₹${walletBalance}\nAmount needed: ₹${totalAmount}\n\nPlease add money to your wallet or use another payment method.`,
// // // // // // // // // // //         [
// // // // // // // // // // //           { text: 'OK', onPress: () => setShowWalletModal(false) }
// // // // // // // // // // //         ]
// // // // // // // // // // //       );
// // // // // // // // // // //       return;
// // // // // // // // // // //     }

// // // // // // // // // // //     setShowWalletModal(false);
// // // // // // // // // // //     Alert.alert(
// // // // // // // // // // //       'Pay with Wallet',
// // // // // // // // // // //       `Amount: ₹${totalAmount}\nWallet Balance: ₹${walletBalance}\n\nAfter payment, balance: ₹${walletBalance - totalAmount}`,
// // // // // // // // // // //       [
// // // // // // // // // // //         { text: 'Cancel', style: 'cancel' },
// // // // // // // // // // //         { 
// // // // // // // // // // //           text: 'Pay Now', 
// // // // // // // // // // //           onPress: () => {
// // // // // // // // // // //             setLoading(true);
// // // // // // // // // // //             setTimeout(() => {
// // // // // // // // // // //               setLoading(false);
// // // // // // // // // // //               setPaymentSuccess(true);
// // // // // // // // // // //               Alert.alert(
// // // // // // // // // // //                 '✅ Payment Successful!',
// // // // // // // // // // //                 `₹${totalAmount} has been deducted from your wallet\n\nNew Balance: ₹${walletBalance - totalAmount}\nTransaction ID: WLT${Date.now().toString().slice(-10)}`,
// // // // // // // // // // //                 [
// // // // // // // // // // //                   {
// // // // // // // // // // //                     text: 'Continue',
// // // // // // // // // // //                     onPress: () => {
// // // // // // // // // // //                       setPaymentSuccess(false);
// // // // // // // // // // //                       navigation.navigate('OrderTracking');
// // // // // // // // // // //                     }
// // // // // // // // // // //                   }
// // // // // // // // // // //                 ]
// // // // // // // // // // //               );
// // // // // // // // // // //             }, 1500);
// // // // // // // // // // //           }
// // // // // // // // // // //         }
// // // // // // // // // // //       ]
// // // // // // // // // // //     );
// // // // // // // // // // //   };

// // // // // // // // // // //   // ============ CASH ON DELIVERY ============
// // // // // // // // // // //   const handleCashOnDelivery = () => {
// // // // // // // // // // //     Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    
// // // // // // // // // // //     Alert.alert(
// // // // // // // // // // //       '💳 Cash on Delivery',
// // // // // // // // // // //       `Order Total: ₹${totalAmount}\n\nYou will pay ₹${totalAmount} in cash when your order arrives.\n\nPlease keep the exact amount ready.`,
// // // // // // // // // // //       [
// // // // // // // // // // //         { text: 'Cancel', style: 'cancel' },
// // // // // // // // // // //         { 
// // // // // // // // // // //           text: 'Confirm COD', 
// // // // // // // // // // //           onPress: () => {
// // // // // // // // // // //             setLoading(true);
// // // // // // // // // // //             setTimeout(() => {
// // // // // // // // // // //               setLoading(false);
// // // // // // // // // // //               setPaymentSuccess(true);
// // // // // // // // // // //               Alert.alert(
// // // // // // // // // // //                 '✅ Order Placed Successfully!',
// // // // // // // // // // //                 `Your order worth ₹${totalAmount} has been placed with Cash on Delivery.\n\nOrder ID: COD${Date.now().toString().slice(-10)}`,
// // // // // // // // // // //                 [
// // // // // // // // // // //                   {
// // // // // // // // // // //                     text: 'Track Order',
// // // // // // // // // // //                     onPress: () => {
// // // // // // // // // // //                       setPaymentSuccess(false);
// // // // // // // // // // //                       navigation.navigate('OrderTracking');
// // // // // // // // // // //                     }
// // // // // // // // // // //                   }
// // // // // // // // // // //                 ]
// // // // // // // // // // //               );
// // // // // // // // // // //             }, 1500);
// // // // // // // // // // //           }
// // // // // // // // // // //         }
// // // // // // // // // // //       ]
// // // // // // // // // // //     );
// // // // // // // // // // //   };

// // // // // // // // // // //   const formatCardNumber = (text: string): string => {
// // // // // // // // // // //     const cleaned = text.replace(/\s/g, '');
// // // // // // // // // // //     const matches = cleaned.match(/.{1,4}/g);
// // // // // // // // // // //     if (matches) {
// // // // // // // // // // //       return matches.join(' ');
// // // // // // // // // // //     }
// // // // // // // // // // //     return text;
// // // // // // // // // // //   };

// // // // // // // // // // //   const formatExpiryDate = (text: string): string => {
// // // // // // // // // // //     const cleaned = text.replace(/\D/g, '');
// // // // // // // // // // //     if (cleaned.length >= 2) {
// // // // // // // // // // //       return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
// // // // // // // // // // //     }
// // // // // // // // // // //     return text;
// // // // // // // // // // //   };

// // // // // // // // // // //   // ============ RENDER ============
// // // // // // // // // // //   return (
// // // // // // // // // // //     <View style={styles.container}>
// // // // // // // // // // //       <ScrollView showsVerticalScrollIndicator={false}>
// // // // // // // // // // //         {/* Header */}
// // // // // // // // // // //         <View style={styles.header}>
// // // // // // // // // // //           <TouchableOpacity onPress={() => navigation.goBack()}>
// // // // // // // // // // //             <Icon name="arrow-back" size={24} color={colors.text} />
// // // // // // // // // // //           </TouchableOpacity>
// // // // // // // // // // //           <Text style={styles.headerTitle}>Payment</Text>
// // // // // // // // // // //           <View style={{ width: 24 }} />
// // // // // // // // // // //         </View>

// // // // // // // // // // //         {/* Amount */}
// // // // // // // // // // //         <View style={styles.amountContainer}>
// // // // // // // // // // //           <Text style={styles.amountLabel}>Amount to Pay</Text>
// // // // // // // // // // //           <Text style={styles.amountValue}>₹{totalAmount}</Text>
// // // // // // // // // // //         </View>

// // // // // // // // // // //         {/* Payment Methods */}
// // // // // // // // // // //         <View style={styles.methodsContainer}>
// // // // // // // // // // //           <Text style={styles.sectionTitle}>Payment Methods</Text>
// // // // // // // // // // //           {paymentMethods.map((method) => (
// // // // // // // // // // //             <TouchableOpacity
// // // // // // // // // // //               key={method.id}
// // // // // // // // // // //               style={[
// // // // // // // // // // //                 styles.methodItem,
// // // // // // // // // // //                 selectedMethod === method.id && styles.selectedMethod,
// // // // // // // // // // //               ]}
// // // // // // // // // // //               onPress={() => handleSelectMethod(method.id)}
// // // // // // // // // // //             >
// // // // // // // // // // //               <View style={styles.methodLeft}>
// // // // // // // // // // //                 <View style={[styles.methodIcon, selectedMethod === method.id && styles.selectedMethodIcon]}>
// // // // // // // // // // //                   <Icon name={method.icon} size={22} color={selectedMethod === method.id ? colors.white : colors.text} />
// // // // // // // // // // //                 </View>
// // // // // // // // // // //                 <View style={styles.methodInfo}>
// // // // // // // // // // //                   <Text style={[
// // // // // // // // // // //                     styles.methodName,
// // // // // // // // // // //                     selectedMethod === method.id && styles.selectedMethodText,
// // // // // // // // // // //                   ]}>
// // // // // // // // // // //                     {method.name}
// // // // // // // // // // //                   </Text>
// // // // // // // // // // //                   <Text style={styles.methodDesc}>{method.desc}</Text>
// // // // // // // // // // //                 </View>
// // // // // // // // // // //               </View>
// // // // // // // // // // //               {selectedMethod === method.id && (
// // // // // // // // // // //                 <Icon name="checkmark-circle" size={24} color={colors.primary} />
// // // // // // // // // // //               )}
// // // // // // // // // // //             </TouchableOpacity>
// // // // // // // // // // //           ))}
// // // // // // // // // // //         </View>

// // // // // // // // // // //         {/* Cash on Delivery Info */}
// // // // // // // // // // //         {selectedMethod === 'cash' && (
// // // // // // // // // // //           <View style={styles.infoContainer}>
// // // // // // // // // // //             <Icon name="information-circle-outline" size={20} color={colors.info} />
// // // // // // // // // // //             <Text style={styles.infoText}>
// // // // // // // // // // //               Pay with cash when your order arrives. No additional charges.
// // // // // // // // // // //             </Text>
// // // // // // // // // // //           </View>
// // // // // // // // // // //         )}
// // // // // // // // // // //       </ScrollView>

// // // // // // // // // // //       {/* ============ UPI MODAL ============ */}
// // // // // // // // // // //       <Modal
// // // // // // // // // // //         visible={showUPIModal}
// // // // // // // // // // //         transparent={true}
// // // // // // // // // // //         animationType="slide"
// // // // // // // // // // //         onRequestClose={() => setShowUPIModal(false)}
// // // // // // // // // // //       >
// // // // // // // // // // //         <View style={styles.modalOverlay}>
// // // // // // // // // // //           <View style={styles.modalContainer}>
// // // // // // // // // // //             <View style={styles.modalHeader}>
// // // // // // // // // // //               <Text style={styles.modalTitle}>Select UPI App</Text>
// // // // // // // // // // //               <TouchableOpacity onPress={() => setShowUPIModal(false)}>
// // // // // // // // // // //                 <Icon name="close" size={24} color={colors.text} />
// // // // // // // // // // //               </TouchableOpacity>
// // // // // // // // // // //             </View>

// // // // // // // // // // //             <View style={styles.upiAppsContainer}>
// // // // // // // // // // //               {upiApps.map((app) => (
// // // // // // // // // // //                 <TouchableOpacity
// // // // // // // // // // //                   key={app.id}
// // // // // // // // // // //                   style={styles.upiAppItem}
// // // // // // // // // // //                   onPress={() => handleUPISelection(app)}
// // // // // // // // // // //                 >
// // // // // // // // // // //                   <View style={[styles.upiAppIcon, { backgroundColor: app.color + '20' }]}>
// // // // // // // // // // //                     <Text style={styles.upiAppEmoji}>{app.icon}</Text>
// // // // // // // // // // //                   </View>
// // // // // // // // // // //                   <View style={styles.upiAppInfo}>
// // // // // // // // // // //                     <Text style={styles.upiAppName}>{app.name}</Text>
// // // // // // // // // // //                     <Text style={styles.upiAppDesc}>UPI Payment</Text>
// // // // // // // // // // //                   </View>
// // // // // // // // // // //                   <Icon name="chevron-forward" size={20} color={colors.gray} />
// // // // // // // // // // //                 </TouchableOpacity>
// // // // // // // // // // //               ))}
// // // // // // // // // // //             </View>

// // // // // // // // // // //             <TouchableOpacity 
// // // // // // // // // // //               style={styles.enterUPIButton}
// // // // // // // // // // //               onPress={() => {
// // // // // // // // // // //                 setShowUPIModal(false);
// // // // // // // // // // //                 Alert.alert(
// // // // // // // // // // //                   'Enter UPI ID',
// // // // // // // // // // //                   'Please enter your UPI ID (e.g., example@upi)',
// // // // // // // // // // //                   [
// // // // // // // // // // //                     { text: 'Cancel', style: 'cancel' },
// // // // // // // // // // //                     {
// // // // // // // // // // //                       text: 'Pay',
// // // // // // // // // // //                       onPress: () => showUPIPinEntry()
// // // // // // // // // // //                     }
// // // // // // // // // // //                   ]
// // // // // // // // // // //                 );
// // // // // // // // // // //               }}
// // // // // // // // // // //             >
// // // // // // // // // // //               <Text style={styles.enterUPIButtonText}>Enter UPI ID Manually</Text>
// // // // // // // // // // //             </TouchableOpacity>
// // // // // // // // // // //           </View>
// // // // // // // // // // //         </View>
// // // // // // // // // // //       </Modal>

// // // // // // // // // // //       {/* ============ CARD MODAL ============ */}
// // // // // // // // // // //       <Modal
// // // // // // // // // // //         visible={showCardModal}
// // // // // // // // // // //         transparent={true}
// // // // // // // // // // //         animationType="slide"
// // // // // // // // // // //         onRequestClose={() => setShowCardModal(false)}
// // // // // // // // // // //       >
// // // // // // // // // // //         <View style={styles.modalOverlay}>
// // // // // // // // // // //           <View style={styles.modalContainer}>
// // // // // // // // // // //             <View style={styles.modalHeader}>
// // // // // // // // // // //               <Text style={styles.modalTitle}>Card Details</Text>
// // // // // // // // // // //               <TouchableOpacity onPress={() => setShowCardModal(false)}>
// // // // // // // // // // //                 <Icon name="close" size={24} color={colors.text} />
// // // // // // // // // // //               </TouchableOpacity>
// // // // // // // // // // //             </View>

// // // // // // // // // // //             <View style={styles.cardModalBody}>
// // // // // // // // // // //               <View style={styles.cardPreview}>
// // // // // // // // // // //                 <Icon name="card-outline" size={40} color={colors.primary} />
// // // // // // // // // // //                 <Text style={styles.cardPreviewText}>Enter Card Details</Text>
// // // // // // // // // // //               </View>

// // // // // // // // // // //               <View style={styles.inputContainer}>
// // // // // // // // // // //                 <Text style={styles.inputLabel}>Card Number</Text>
// // // // // // // // // // //                 <TextInput
// // // // // // // // // // //                   style={styles.input}
// // // // // // // // // // //                   placeholder="1234 5678 9012 3456"
// // // // // // // // // // //                   value={cardNumber}
// // // // // // // // // // //                   onChangeText={(text) => setCardNumber(formatCardNumber(text))}
// // // // // // // // // // //                   keyboardType="numeric"
// // // // // // // // // // //                   maxLength={19}
// // // // // // // // // // //                 />
// // // // // // // // // // //               </View>

// // // // // // // // // // //               <View style={styles.inputContainer}>
// // // // // // // // // // //                 <Text style={styles.inputLabel}>Card Holder Name</Text>
// // // // // // // // // // //                 <TextInput
// // // // // // // // // // //                   style={styles.input}
// // // // // // // // // // //                   placeholder="John Doe"
// // // // // // // // // // //                   value={cardHolder}
// // // // // // // // // // //                   onChangeText={setCardHolder}
// // // // // // // // // // //                 />
// // // // // // // // // // //               </View>

// // // // // // // // // // //               <View style={styles.rowInputs}>
// // // // // // // // // // //                 <View style={[styles.inputContainer, styles.halfInput]}>
// // // // // // // // // // //                   <Text style={styles.inputLabel}>Expiry Date</Text>
// // // // // // // // // // //                   <TextInput
// // // // // // // // // // //                     style={styles.input}
// // // // // // // // // // //                     placeholder="MM/YY"
// // // // // // // // // // //                     value={expiryDate}
// // // // // // // // // // //                     onChangeText={(text) => setExpiryDate(formatExpiryDate(text))}
// // // // // // // // // // //                     keyboardType="numeric"
// // // // // // // // // // //                     maxLength={5}
// // // // // // // // // // //                   />
// // // // // // // // // // //                 </View>
// // // // // // // // // // //                 <View style={[styles.inputContainer, styles.halfInput]}>
// // // // // // // // // // //                   <Text style={styles.inputLabel}>CVV</Text>
// // // // // // // // // // //                   <TextInput
// // // // // // // // // // //                     style={styles.input}
// // // // // // // // // // //                     placeholder="123"
// // // // // // // // // // //                     value={cvv}
// // // // // // // // // // //                     onChangeText={setCvv}
// // // // // // // // // // //                     keyboardType="numeric"
// // // // // // // // // // //                     maxLength={4}
// // // // // // // // // // //                     secureTextEntry
// // // // // // // // // // //                   />
// // // // // // // // // // //                 </View>
// // // // // // // // // // //               </View>

// // // // // // // // // // //               <TouchableOpacity 
// // // // // // // // // // //                 style={styles.payNowButton} 
// // // // // // // // // // //                 onPress={handleCardPayment}
// // // // // // // // // // //                 disabled={loading}
// // // // // // // // // // //               >
// // // // // // // // // // //                 {loading ? (
// // // // // // // // // // //                   <ActivityIndicator color="#ffffff" />
// // // // // // // // // // //                 ) : (
// // // // // // // // // // //                   <Text style={styles.payNowButtonText}>Pay ₹{totalAmount}</Text>
// // // // // // // // // // //                 )}
// // // // // // // // // // //               </TouchableOpacity>
// // // // // // // // // // //             </View>
// // // // // // // // // // //           </View>
// // // // // // // // // // //         </View>
// // // // // // // // // // //       </Modal>

// // // // // // // // // // //       {/* ============ NET BANKING MODAL ============ */}
// // // // // // // // // // //       <Modal
// // // // // // // // // // //         visible={showNetBankingModal}
// // // // // // // // // // //         transparent={true}
// // // // // // // // // // //         animationType="slide"
// // // // // // // // // // //         onRequestClose={() => setShowNetBankingModal(false)}
// // // // // // // // // // //       >
// // // // // // // // // // //         <View style={styles.modalOverlay}>
// // // // // // // // // // //           <View style={styles.modalContainer}>
// // // // // // // // // // //             <View style={styles.modalHeader}>
// // // // // // // // // // //               <Text style={styles.modalTitle}>Select Bank</Text>
// // // // // // // // // // //               <TouchableOpacity onPress={() => setShowNetBankingModal(false)}>
// // // // // // // // // // //                 <Icon name="close" size={24} color={colors.text} />
// // // // // // // // // // //               </TouchableOpacity>
// // // // // // // // // // //             </View>

// // // // // // // // // // //             <View style={styles.banksContainer}>
// // // // // // // // // // //               {banks.map((bank) => (
// // // // // // // // // // //                 <TouchableOpacity
// // // // // // // // // // //                   key={bank.id}
// // // // // // // // // // //                   style={styles.bankItem}
// // // // // // // // // // //                   onPress={() => handleNetBankingSelect(bank)}
// // // // // // // // // // //                 >
// // // // // // // // // // //                   <View style={styles.bankIcon}>
// // // // // // // // // // //                     <Text style={styles.bankEmoji}>{bank.icon}</Text>
// // // // // // // // // // //                   </View>
// // // // // // // // // // //                   <View style={styles.bankInfo}>
// // // // // // // // // // //                     <Text style={styles.bankName}>{bank.name}</Text>
// // // // // // // // // // //                     <Text style={styles.bankDesc}>Net Banking</Text>
// // // // // // // // // // //                   </View>
// // // // // // // // // // //                   <Icon name="chevron-forward" size={20} color={colors.gray} />
// // // // // // // // // // //                 </TouchableOpacity>
// // // // // // // // // // //               ))}
// // // // // // // // // // //             </View>
// // // // // // // // // // //           </View>
// // // // // // // // // // //         </View>
// // // // // // // // // // //       </Modal>

// // // // // // // // // // //       {/* ============ WALLET MODAL ============ */}
// // // // // // // // // // //       <Modal
// // // // // // // // // // //         visible={showWalletModal}
// // // // // // // // // // //         transparent={true}
// // // // // // // // // // //         animationType="slide"
// // // // // // // // // // //         onRequestClose={() => setShowWalletModal(false)}
// // // // // // // // // // //       >
// // // // // // // // // // //         <View style={styles.modalOverlay}>
// // // // // // // // // // //           <View style={styles.modalContainer}>
// // // // // // // // // // //             <View style={styles.modalHeader}>
// // // // // // // // // // //               <Text style={styles.modalTitle}>Pay with Wallet</Text>
// // // // // // // // // // //               <TouchableOpacity onPress={() => setShowWalletModal(false)}>
// // // // // // // // // // //                 <Icon name="close" size={24} color={colors.text} />
// // // // // // // // // // //               </TouchableOpacity>
// // // // // // // // // // //             </View>

// // // // // // // // // // //             <View style={styles.walletModalBody}>
// // // // // // // // // // //               <View style={styles.walletBalanceContainer}>
// // // // // // // // // // //                 <Icon name="wallet-outline" size={40} color={colors.primary} />
// // // // // // // // // // //                 <Text style={styles.walletBalanceTitle}>Wallet Balance</Text>
// // // // // // // // // // //                 <Text style={styles.walletBalanceAmount}>₹{walletBalance}</Text>
// // // // // // // // // // //               </View>

// // // // // // // // // // //               <View style={styles.walletInfoContainer}>
// // // // // // // // // // //                 <View style={styles.walletInfoRow}>
// // // // // // // // // // //                   <Text style={styles.walletInfoLabel}>Order Total</Text>
// // // // // // // // // // //                   <Text style={styles.walletInfoValue}>₹{totalAmount}</Text>
// // // // // // // // // // //                 </View>
// // // // // // // // // // //                 <View style={styles.walletInfoRow}>
// // // // // // // // // // //                   <Text style={styles.walletInfoLabel}>Balance After Payment</Text>
// // // // // // // // // // //                   <Text style={[styles.walletInfoValue, { color: totalAmount <= walletBalance ? colors.success : colors.danger }]}>
// // // // // // // // // // //                     ₹{walletBalance - totalAmount}
// // // // // // // // // // //                   </Text>
// // // // // // // // // // //                 </View>
// // // // // // // // // // //               </View>

// // // // // // // // // // //               <TouchableOpacity 
// // // // // // // // // // //                 style={[styles.walletPayButton, totalAmount > walletBalance && styles.walletPayButtonDisabled]}
// // // // // // // // // // //                 onPress={handleWalletPayment}
// // // // // // // // // // //                 disabled={loading || totalAmount > walletBalance}
// // // // // // // // // // //               >
// // // // // // // // // // //                 {loading ? (
// // // // // // // // // // //                   <ActivityIndicator color="#ffffff" />
// // // // // // // // // // //                 ) : (
// // // // // // // // // // //                   <Text style={styles.walletPayButtonText}>
// // // // // // // // // // //                     {totalAmount > walletBalance ? 'Insufficient Balance' : `Pay ₹${totalAmount}`}
// // // // // // // // // // //                   </Text>
// // // // // // // // // // //                 )}
// // // // // // // // // // //               </TouchableOpacity>
// // // // // // // // // // //             </View>
// // // // // // // // // // //           </View>
// // // // // // // // // // //         </View>
// // // // // // // // // // //       </Modal>

// // // // // // // // // // //       {/* Loading Overlay */}
// // // // // // // // // // //       {loading && (
// // // // // // // // // // //         <View style={styles.loadingOverlay}>
// // // // // // // // // // //           <View style={styles.loadingContainer}>
// // // // // // // // // // //             <ActivityIndicator size="large" color={colors.primary} />
// // // // // // // // // // //             <Text style={styles.loadingText}>Processing Payment...</Text>
// // // // // // // // // // //             <Text style={styles.loadingSubText}>Please do not close the app</Text>
// // // // // // // // // // //           </View>
// // // // // // // // // // //         </View>
// // // // // // // // // // //       )}
// // // // // // // // // // //     </View>
// // // // // // // // // // //   );
// // // // // // // // // // // }

// // // // // // // // // // // const styles = StyleSheet.create({
// // // // // // // // // // //   container: {
// // // // // // // // // // //     flex: 1,
// // // // // // // // // // //     backgroundColor: colors.white,
// // // // // // // // // // //   },
// // // // // // // // // // //   header: {
// // // // // // // // // // //     flexDirection: 'row',
// // // // // // // // // // //     alignItems: 'center',
// // // // // // // // // // //     justifyContent: 'space-between',
// // // // // // // // // // //     padding: 16,
// // // // // // // // // // //     paddingTop: 40,
// // // // // // // // // // //     borderBottomWidth: 1,
// // // // // // // // // // //     borderBottomColor: colors.border,
// // // // // // // // // // //   },
// // // // // // // // // // //   headerTitle: {
// // // // // // // // // // //     fontSize: 18,
// // // // // // // // // // //     fontWeight: '600',
// // // // // // // // // // //     color: colors.text,
// // // // // // // // // // //   },
// // // // // // // // // // //   amountContainer: {
// // // // // // // // // // //     backgroundColor: colors.primary,
// // // // // // // // // // //     padding: 20,
// // // // // // // // // // //     margin: 16,
// // // // // // // // // // //     borderRadius: 12,
// // // // // // // // // // //     alignItems: 'center',
// // // // // // // // // // //   },
// // // // // // // // // // //   amountLabel: {
// // // // // // // // // // //     fontSize: 14,
// // // // // // // // // // //     color: colors.white,
// // // // // // // // // // //     opacity: 0.8,
// // // // // // // // // // //   },
// // // // // // // // // // //   amountValue: {
// // // // // // // // // // //     fontSize: 28,
// // // // // // // // // // //     fontWeight: '700',
// // // // // // // // // // //     color: colors.white,
// // // // // // // // // // //     marginTop: 4,
// // // // // // // // // // //   },
// // // // // // // // // // //   methodsContainer: {
// // // // // // // // // // //     paddingHorizontal: 16,
// // // // // // // // // // //     paddingBottom: 20,
// // // // // // // // // // //   },
// // // // // // // // // // //   sectionTitle: {
// // // // // // // // // // //     fontSize: 16,
// // // // // // // // // // //     fontWeight: '600',
// // // // // // // // // // //     color: colors.text,
// // // // // // // // // // //     marginBottom: 12,
// // // // // // // // // // //   },
// // // // // // // // // // //   methodItem: {
// // // // // // // // // // //     flexDirection: 'row',
// // // // // // // // // // //     justifyContent: 'space-between',
// // // // // // // // // // //     alignItems: 'center',
// // // // // // // // // // //     padding: 14,
// // // // // // // // // // //     borderWidth: 1,
// // // // // // // // // // //     borderColor: colors.border,
// // // // // // // // // // //     borderRadius: 10,
// // // // // // // // // // //     marginBottom: 8,
// // // // // // // // // // //   },
// // // // // // // // // // //   selectedMethod: {
// // // // // // // // // // //     borderColor: colors.primary,
// // // // // // // // // // //     backgroundColor: '#fff5ec',
// // // // // // // // // // //   },
// // // // // // // // // // //   methodLeft: {
// // // // // // // // // // //     flexDirection: 'row',
// // // // // // // // // // //     alignItems: 'center',
// // // // // // // // // // //     flex: 1,
// // // // // // // // // // //   },
// // // // // // // // // // //   methodIcon: {
// // // // // // // // // // //     width: 36,
// // // // // // // // // // //     height: 36,
// // // // // // // // // // //     borderRadius: 18,
// // // // // // // // // // //     backgroundColor: colors.lightGray,
// // // // // // // // // // //     justifyContent: 'center',
// // // // // // // // // // //     alignItems: 'center',
// // // // // // // // // // //     marginRight: 12,
// // // // // // // // // // //   },
// // // // // // // // // // //   selectedMethodIcon: {
// // // // // // // // // // //     backgroundColor: colors.primary,
// // // // // // // // // // //   },
// // // // // // // // // // //   methodInfo: {
// // // // // // // // // // //     flex: 1,
// // // // // // // // // // //   },
// // // // // // // // // // //   methodName: {
// // // // // // // // // // //     fontSize: 14,
// // // // // // // // // // //     color: colors.text,
// // // // // // // // // // //   },
// // // // // // // // // // //   selectedMethodText: {
// // // // // // // // // // //     color: colors.primary,
// // // // // // // // // // //     fontWeight: '500',
// // // // // // // // // // //   },
// // // // // // // // // // //   methodDesc: {
// // // // // // // // // // //     fontSize: 11,
// // // // // // // // // // //     color: colors.textLight,
// // // // // // // // // // //     marginTop: 1,
// // // // // // // // // // //   },
// // // // // // // // // // //   infoContainer: {
// // // // // // // // // // //     flexDirection: 'row',
// // // // // // // // // // //     alignItems: 'center',
// // // // // // // // // // //     backgroundColor: '#f8f9fa',
// // // // // // // // // // //     marginHorizontal: 16,
// // // // // // // // // // //     marginBottom: 16,
// // // // // // // // // // //     padding: 12,
// // // // // // // // // // //     borderRadius: 8,
// // // // // // // // // // //     borderWidth: 1,
// // // // // // // // // // //     borderColor: colors.border,
// // // // // // // // // // //   },
// // // // // // // // // // //   infoText: {
// // // // // // // // // // //     fontSize: 13,
// // // // // // // // // // //     color: colors.textLight,
// // // // // // // // // // //     marginLeft: 10,
// // // // // // // // // // //     flex: 1,
// // // // // // // // // // //   },
// // // // // // // // // // //   modalOverlay: {
// // // // // // // // // // //     flex: 1,
// // // // // // // // // // //     backgroundColor: 'rgba(0,0,0,0.5)',
// // // // // // // // // // //     justifyContent: 'flex-end',
// // // // // // // // // // //   },
// // // // // // // // // // //   modalContainer: {
// // // // // // // // // // //     backgroundColor: colors.white,
// // // // // // // // // // //     borderTopLeftRadius: 24,
// // // // // // // // // // //     borderTopRightRadius: 24,
// // // // // // // // // // //     paddingHorizontal: 20,
// // // // // // // // // // //     paddingBottom: 30,
// // // // // // // // // // //     maxHeight: '80%',
// // // // // // // // // // //   },
// // // // // // // // // // //   modalHeader: {
// // // // // // // // // // //     flexDirection: 'row',
// // // // // // // // // // //     justifyContent: 'space-between',
// // // // // // // // // // //     alignItems: 'center',
// // // // // // // // // // //     paddingVertical: 16,
// // // // // // // // // // //     borderBottomWidth: 1,
// // // // // // // // // // //     borderBottomColor: colors.border,
// // // // // // // // // // //   },
// // // // // // // // // // //   modalTitle: {
// // // // // // // // // // //     fontSize: 18,
// // // // // // // // // // //     fontWeight: '600',
// // // // // // // // // // //     color: colors.text,
// // // // // // // // // // //   },
// // // // // // // // // // //   // UPI Modal
// // // // // // // // // // //   upiAppsContainer: {
// // // // // // // // // // //     marginTop: 12,
// // // // // // // // // // //   },
// // // // // // // // // // //   upiAppItem: {
// // // // // // // // // // //     flexDirection: 'row',
// // // // // // // // // // //     alignItems: 'center',
// // // // // // // // // // //     paddingVertical: 14,
// // // // // // // // // // //     borderBottomWidth: 1,
// // // // // // // // // // //     borderBottomColor: colors.border,
// // // // // // // // // // //   },
// // // // // // // // // // //   upiAppIcon: {
// // // // // // // // // // //     width: 48,
// // // // // // // // // // //     height: 48,
// // // // // // // // // // //     borderRadius: 24,
// // // // // // // // // // //     justifyContent: 'center',
// // // // // // // // // // //     alignItems: 'center',
// // // // // // // // // // //     marginRight: 12,
// // // // // // // // // // //   },
// // // // // // // // // // //   upiAppEmoji: {
// // // // // // // // // // //     fontSize: 24,
// // // // // // // // // // //   },
// // // // // // // // // // //   upiAppInfo: {
// // // // // // // // // // //     flex: 1,
// // // // // // // // // // //   },
// // // // // // // // // // //   upiAppName: {
// // // // // // // // // // //     fontSize: 15,
// // // // // // // // // // //     fontWeight: '500',
// // // // // // // // // // //     color: colors.text,
// // // // // // // // // // //   },
// // // // // // // // // // //   upiAppDesc: {
// // // // // // // // // // //     fontSize: 12,
// // // // // // // // // // //     color: colors.textLight,
// // // // // // // // // // //     marginTop: 2,
// // // // // // // // // // //   },
// // // // // // // // // // //   enterUPIButton: {
// // // // // // // // // // //     marginTop: 16,
// // // // // // // // // // //     paddingVertical: 12,
// // // // // // // // // // //     borderWidth: 1,
// // // // // // // // // // //     borderColor: colors.primary,
// // // // // // // // // // //     borderRadius: 8,
// // // // // // // // // // //     alignItems: 'center',
// // // // // // // // // // //   },
// // // // // // // // // // //   enterUPIButtonText: {
// // // // // // // // // // //     color: colors.primary,
// // // // // // // // // // //     fontSize: 14,
// // // // // // // // // // //     fontWeight: '500',
// // // // // // // // // // //   },
// // // // // // // // // // //   // Card Modal
// // // // // // // // // // //   cardModalBody: {
// // // // // // // // // // //     marginTop: 8,
// // // // // // // // // // //   },
// // // // // // // // // // //   cardPreview: {
// // // // // // // // // // //     alignItems: 'center',
// // // // // // // // // // //     paddingVertical: 20,
// // // // // // // // // // //     backgroundColor: '#f8f9fa',
// // // // // // // // // // //     borderRadius: 12,
// // // // // // // // // // //     marginBottom: 16,
// // // // // // // // // // //   },
// // // // // // // // // // //   cardPreviewText: {
// // // // // // // // // // //     fontSize: 14,
// // // // // // // // // // //     color: colors.textLight,
// // // // // // // // // // //     marginTop: 8,
// // // // // // // // // // //   },
// // // // // // // // // // //   inputContainer: {
// // // // // // // // // // //     marginBottom: 12,
// // // // // // // // // // //   },
// // // // // // // // // // //   inputLabel: {
// // // // // // // // // // //     fontSize: 14,
// // // // // // // // // // //     fontWeight: '500',
// // // // // // // // // // //     color: colors.text,
// // // // // // // // // // //     marginBottom: 4,
// // // // // // // // // // //   },
// // // // // // // // // // //   input: {
// // // // // // // // // // //     borderWidth: 1,
// // // // // // // // // // //     borderColor: colors.border,
// // // // // // // // // // //     borderRadius: 8,
// // // // // // // // // // //     paddingHorizontal: 12,
// // // // // // // // // // //     paddingVertical: 10,
// // // // // // // // // // //     fontSize: 14,
// // // // // // // // // // //     color: colors.text,
// // // // // // // // // // //     backgroundColor: colors.white,
// // // // // // // // // // //   },
// // // // // // // // // // //   rowInputs: {
// // // // // // // // // // //     flexDirection: 'row',
// // // // // // // // // // //     justifyContent: 'space-between',
// // // // // // // // // // //   },
// // // // // // // // // // //   halfInput: {
// // // // // // // // // // //     flex: 1,
// // // // // // // // // // //     marginRight: 8,
// // // // // // // // // // //   },
// // // // // // // // // // //   payNowButton: {
// // // // // // // // // // //     backgroundColor: colors.primary,
// // // // // // // // // // //     borderRadius: 12,
// // // // // // // // // // //     height: 50,
// // // // // // // // // // //     justifyContent: 'center',
// // // // // // // // // // //     alignItems: 'center',
// // // // // // // // // // //     marginTop: 8,
// // // // // // // // // // //   },
// // // // // // // // // // //   payNowButtonText: {
// // // // // // // // // // //     color: colors.white,
// // // // // // // // // // //     fontSize: 16,
// // // // // // // // // // //     fontWeight: '600',
// // // // // // // // // // //   },
// // // // // // // // // // //   // Net Banking Modal
// // // // // // // // // // //   banksContainer: {
// // // // // // // // // // //     marginTop: 12,
// // // // // // // // // // //   },
// // // // // // // // // // //   bankItem: {
// // // // // // // // // // //     flexDirection: 'row',
// // // // // // // // // // //     alignItems: 'center',
// // // // // // // // // // //     paddingVertical: 14,
// // // // // // // // // // //     borderBottomWidth: 1,
// // // // // // // // // // //     borderBottomColor: colors.border,
// // // // // // // // // // //   },
// // // // // // // // // // //   bankIcon: {
// // // // // // // // // // //     width: 44,
// // // // // // // // // // //     height: 44,
// // // // // // // // // // //     borderRadius: 22,
// // // // // // // // // // //     backgroundColor: colors.lightGray,
// // // // // // // // // // //     justifyContent: 'center',
// // // // // // // // // // //     alignItems: 'center',
// // // // // // // // // // //     marginRight: 12,
// // // // // // // // // // //   },
// // // // // // // // // // //   bankEmoji: {
// // // // // // // // // // //     fontSize: 20,
// // // // // // // // // // //   },
// // // // // // // // // // //   bankInfo: {
// // // // // // // // // // //     flex: 1,
// // // // // // // // // // //   },
// // // // // // // // // // //   bankName: {
// // // // // // // // // // //     fontSize: 14,
// // // // // // // // // // //     fontWeight: '500',
// // // // // // // // // // //     color: colors.text,
// // // // // // // // // // //   },
// // // // // // // // // // //   bankDesc: {
// // // // // // // // // // //     fontSize: 12,
// // // // // // // // // // //     color: colors.textLight,
// // // // // // // // // // //     marginTop: 1,
// // // // // // // // // // //   },
// // // // // // // // // // //   // Wallet Modal
// // // // // // // // // // //   walletModalBody: {
// // // // // // // // // // //     marginTop: 8,
// // // // // // // // // // //   },
// // // // // // // // // // //   walletBalanceContainer: {
// // // // // // // // // // //     alignItems: 'center',
// // // // // // // // // // //     paddingVertical: 20,
// // // // // // // // // // //     backgroundColor: '#f8f9fa',
// // // // // // // // // // //     borderRadius: 12,
// // // // // // // // // // //     marginBottom: 16,
// // // // // // // // // // //   },
// // // // // // // // // // //   walletBalanceTitle: {
// // // // // // // // // // //     fontSize: 14,
// // // // // // // // // // //     color: colors.textLight,
// // // // // // // // // // //     marginTop: 8,
// // // // // // // // // // //   },
// // // // // // // // // // //   walletBalanceAmount: {
// // // // // // // // // // //     fontSize: 28,
// // // // // // // // // // //     fontWeight: '700',
// // // // // // // // // // //     color: colors.primary,
// // // // // // // // // // //     marginTop: 4,
// // // // // // // // // // //   },
// // // // // // // // // // //   walletInfoContainer: {
// // // // // // // // // // //     backgroundColor: '#f8f9fa',
// // // // // // // // // // //     borderRadius: 12,
// // // // // // // // // // //     padding: 16,
// // // // // // // // // // //     marginBottom: 16,
// // // // // // // // // // //   },
// // // // // // // // // // //   walletInfoRow: {
// // // // // // // // // // //     flexDirection: 'row',
// // // // // // // // // // //     justifyContent: 'space-between',
// // // // // // // // // // //     paddingVertical: 4,
// // // // // // // // // // //   },
// // // // // // // // // // //   walletInfoLabel: {
// // // // // // // // // // //     fontSize: 14,
// // // // // // // // // // //     color: colors.textLight,
// // // // // // // // // // //   },
// // // // // // // // // // //   walletInfoValue: {
// // // // // // // // // // //     fontSize: 14,
// // // // // // // // // // //     fontWeight: '500',
// // // // // // // // // // //     color: colors.text,
// // // // // // // // // // //   },
// // // // // // // // // // //   walletPayButton: {
// // // // // // // // // // //     backgroundColor: colors.primary,
// // // // // // // // // // //     borderRadius: 12,
// // // // // // // // // // //     height: 50,
// // // // // // // // // // //     justifyContent: 'center',
// // // // // // // // // // //     alignItems: 'center',
// // // // // // // // // // //   },
// // // // // // // // // // //   walletPayButtonDisabled: {
// // // // // // // // // // //     backgroundColor: colors.gray,
// // // // // // // // // // //   },
// // // // // // // // // // //   walletPayButtonText: {
// // // // // // // // // // //     color: colors.white,
// // // // // // // // // // //     fontSize: 16,
// // // // // // // // // // //     fontWeight: '600',
// // // // // // // // // // //   },
// // // // // // // // // // //   // Loading Overlay
// // // // // // // // // // //   loadingOverlay: {
// // // // // // // // // // //     position: 'absolute',
// // // // // // // // // // //     top: 0,
// // // // // // // // // // //     left: 0,
// // // // // // // // // // //     right: 0,
// // // // // // // // // // //     bottom: 0,
// // // // // // // // // // //     backgroundColor: 'rgba(0,0,0,0.7)',
// // // // // // // // // // //     justifyContent: 'center',
// // // // // // // // // // //     alignItems: 'center',
// // // // // // // // // // //   },
// // // // // // // // // // //   loadingContainer: {
// // // // // // // // // // //     backgroundColor: colors.white,
// // // // // // // // // // //     padding: 30,
// // // // // // // // // // //     borderRadius: 16,
// // // // // // // // // // //     alignItems: 'center',
// // // // // // // // // // //     minWidth: 200,
// // // // // // // // // // //   },
// // // // // // // // // // //   loadingText: {
// // // // // // // // // // //     fontSize: 16,
// // // // // // // // // // //     fontWeight: '600',
// // // // // // // // // // //     color: colors.text,
// // // // // // // // // // //     marginTop: 12,
// // // // // // // // // // //   },
// // // // // // // // // // //   loadingSubText: {
// // // // // // // // // // //     fontSize: 12,
// // // // // // // // // // //     color: colors.textLight,
// // // // // // // // // // //     marginTop: 4,
// // // // // // // // // // //   },
// // // // // // // // // // // });
// // // // // // // // // // import React, { useState } from 'react';
// // // // // // // // // // import {
// // // // // // // // // //   View,
// // // // // // // // // //   Text,
// // // // // // // // // //   ScrollView,
// // // // // // // // // //   TouchableOpacity,
// // // // // // // // // //   StyleSheet,
// // // // // // // // // //   TextInput,
// // // // // // // // // //   Alert,
// // // // // // // // // //   Modal,
// // // // // // // // // //   ActivityIndicator,
// // // // // // // // // //   Image,
// // // // // // // // // // } from 'react-native';
// // // // // // // // // // import * as Haptics from 'expo-haptics';
// // // // // // // // // // import Icon from 'react-native-vector-icons/Ionicons';
// // // // // // // // // // import { colors } from '../../constants/colors';

// // // // // // // // // // interface PaymentScreenProps {
// // // // // // // // // //   navigation: any;
// // // // // // // // // //   route: any;
// // // // // // // // // // }

// // // // // // // // // // export default function PaymentScreen({ route, navigation }: PaymentScreenProps) {
// // // // // // // // // //   const { totalAmount } = route.params || { totalAmount: 461 };
// // // // // // // // // //   const [selectedMethod, setSelectedMethod] = useState<string>('');
// // // // // // // // // //   const [showUPIModal, setShowUPIModal] = useState<boolean>(false);
// // // // // // // // // //   const [selectedUPIApp, setSelectedUPIApp] = useState<string>('');
// // // // // // // // // //   const [showUPIPinModal, setShowUPIPinModal] = useState<boolean>(false);
// // // // // // // // // //   const [upiPin, setUpiPin] = useState<string>('');
// // // // // // // // // //   const [showCardModal, setShowCardModal] = useState<boolean>(false);
// // // // // // // // // //   const [showNetBankingModal, setShowNetBankingModal] = useState<boolean>(false);
// // // // // // // // // //   const [showWalletModal, setShowWalletModal] = useState<boolean>(false);
// // // // // // // // // //   const [loading, setLoading] = useState<boolean>(false);
// // // // // // // // // //   const [paymentSuccess, setPaymentSuccess] = useState<boolean>(false);
// // // // // // // // // //   const [upiTransactionId, setUpiTransactionId] = useState<string>('');
  
// // // // // // // // // //   // Card Details
// // // // // // // // // //   const [cardNumber, setCardNumber] = useState<string>('');
// // // // // // // // // //   const [expiryDate, setExpiryDate] = useState<string>('');
// // // // // // // // // //   const [cvv, setCvv] = useState<string>('');
// // // // // // // // // //   const [cardHolder, setCardHolder] = useState<string>('');

// // // // // // // // // //   // Wallet
// // // // // // // // // //   const walletBalance = 2500;
// // // // // // // // // //   const [walletPin, setWalletPin] = useState<string>('');

// // // // // // // // // //   // Net Banking Banks
// // // // // // // // // //   const banks = [
// // // // // // // // // //     { id: 'sbi', name: 'State Bank of India', icon: '🏦' },
// // // // // // // // // //     { id: 'hdfc', name: 'HDFC Bank', icon: '🏛️' },
// // // // // // // // // //     { id: 'icici', name: 'ICICI Bank', icon: '🏛️' },
// // // // // // // // // //     { id: 'axis', name: 'Axis Bank', icon: '🏦' },
// // // // // // // // // //     { id: 'kotak', name: 'Kotak Mahindra Bank', icon: '🏦' },
// // // // // // // // // //     { id: 'yes', name: 'Yes Bank', icon: '🏛️' },
// // // // // // // // // //     { id: 'pNB', name: 'Punjab National Bank', icon: '🏦' },
// // // // // // // // // //     { id: 'bob', name: 'Bank of Baroda', icon: '🏛️' },
// // // // // // // // // //   ];

// // // // // // // // // //   // UPI Apps
// // // // // // // // // //   const upiApps = [
// // // // // // // // // //     { id: 'gpay', name: 'Google Pay', icon: '💳', color: '#4285F4', emoji: '🟢' },
// // // // // // // // // //     { id: 'phonepe', name: 'PhonePe', icon: '📱', color: '#5F259F', emoji: '🟣' },
// // // // // // // // // //     { id: 'paytm', name: 'Paytm', icon: '🔵', color: '#00BAF2', emoji: '🔵' },
// // // // // // // // // //     { id: 'amazonpay', name: 'Amazon Pay', icon: '🟠', color: '#FF9900', emoji: '🟠' },
// // // // // // // // // //     { id: 'bhim', name: 'BHIM UPI', icon: '🔷', color: '#0084B4', emoji: '🔷' },
// // // // // // // // // //   ];

// // // // // // // // // //   const paymentMethods: { id: string; name: string; icon: string; desc: string }[] = [
// // // // // // // // // //     { id: 'card', name: 'Credit/Debit Card', icon: 'card-outline', desc: 'Pay with card' },
// // // // // // // // // //     { id: 'upi', name: 'UPI', icon: 'phone-portrait-outline', desc: 'Google Pay, PhonePe, Paytm' },
// // // // // // // // // //     { id: 'netbanking', name: 'Net Banking', icon: 'business-outline', desc: 'All major banks' },
// // // // // // // // // //     { id: 'wallet', name: 'Wallet', icon: 'wallet-outline', desc: `Balance: ₹${walletBalance}` },
// // // // // // // // // //     { id: 'cash', name: 'Cash on Delivery', icon: 'cash-outline', desc: 'Pay when you receive' },
// // // // // // // // // //   ];

// // // // // // // // // //   const handleSelectMethod = (methodId: string) => {
// // // // // // // // // //     Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
// // // // // // // // // //     setSelectedMethod(methodId);
    
// // // // // // // // // //     switch (methodId) {
// // // // // // // // // //       case 'upi':
// // // // // // // // // //         setShowUPIModal(true);
// // // // // // // // // //         break;
// // // // // // // // // //       case 'card':
// // // // // // // // // //         setShowCardModal(true);
// // // // // // // // // //         break;
// // // // // // // // // //       case 'netbanking':
// // // // // // // // // //         setShowNetBankingModal(true);
// // // // // // // // // //         break;
// // // // // // // // // //       case 'wallet':
// // // // // // // // // //         setShowWalletModal(true);
// // // // // // // // // //         break;
// // // // // // // // // //       case 'cash':
// // // // // // // // // //         handleCashOnDelivery();
// // // // // // // // // //         break;
// // // // // // // // // //       default:
// // // // // // // // // //         break;
// // // // // // // // // //     }
// // // // // // // // // //   };

// // // // // // // // // //   // ============ UPI FLOW ============
// // // // // // // // // //   const handleUPISelection = (app: any) => {
// // // // // // // // // //     setSelectedUPIApp(app.name);
// // // // // // // // // //     setShowUPIModal(false);
// // // // // // // // // //     // Show UPI PIN modal after selecting app
// // // // // // // // // //     setTimeout(() => {
// // // // // // // // // //       setShowUPIPinModal(true);
// // // // // // // // // //     }, 300);
// // // // // // // // // //   };

// // // // // // // // // //   const handleUPIPinSubmit = () => {
// // // // // // // // // //     if (upiPin.length !== 4) {
// // // // // // // // // //       Alert.alert('Error', 'Please enter a valid 4-digit UPI PIN');
// // // // // // // // // //       return;
// // // // // // // // // //     }

// // // // // // // // // //     Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
// // // // // // // // // //     setShowUPIPinModal(false);
// // // // // // // // // //     setLoading(true);
// // // // // // // // // //     setUpiPin('');
    
// // // // // // // // // //     // Simulate UPI payment processing
// // // // // // // // // //     setTimeout(() => {
// // // // // // // // // //       setLoading(false);
// // // // // // // // // //       setPaymentSuccess(true);
// // // // // // // // // //       const transactionId = 'UPI' + Date.now().toString().slice(-10);
// // // // // // // // // //       setUpiTransactionId(transactionId);
      
// // // // // // // // // //       Alert.alert(
// // // // // // // // // //         '✅ Payment Successful!',
// // // // // // // // // //         `₹${totalAmount} has been sent via ${selectedUPIApp || 'UPI'}\n\nTransaction ID: ${transactionId}\n\nPayment Method: UPI (${selectedUPIApp})`,
// // // // // // // // // //         [
// // // // // // // // // //           {
// // // // // // // // // //             text: 'Continue',
// // // // // // // // // //             onPress: () => {
// // // // // // // // // //               setPaymentSuccess(false);
// // // // // // // // // //               navigation.navigate('OrderTracking');
// // // // // // // // // //             }
// // // // // // // // // //           }
// // // // // // // // // //         ]
// // // // // // // // // //       );
// // // // // // // // // //     }, 2000);
// // // // // // // // // //   };

// // // // // // // // // //   // ============ CARD FLOW ============
// // // // // // // // // //   const handleCardPayment = () => {
// // // // // // // // // //     if (!cardNumber || !expiryDate || !cvv || !cardHolder) {
// // // // // // // // // //       Alert.alert('Error', 'Please fill all card details');
// // // // // // // // // //       return;
// // // // // // // // // //     }
// // // // // // // // // //     if (cardNumber.replace(/\s/g, '').length !== 16) {
// // // // // // // // // //       Alert.alert('Error', 'Please enter a valid 16-digit card number');
// // // // // // // // // //       return;
// // // // // // // // // //     }
// // // // // // // // // //     if (cvv.length < 3) {
// // // // // // // // // //       Alert.alert('Error', 'Please enter a valid CVV');
// // // // // // // // // //       return;
// // // // // // // // // //     }

// // // // // // // // // //     Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
// // // // // // // // // //     setShowCardModal(false);
// // // // // // // // // //     setLoading(true);
    
// // // // // // // // // //     // Simulate card processing
// // // // // // // // // //     setTimeout(() => {
// // // // // // // // // //       setLoading(false);
// // // // // // // // // //       setPaymentSuccess(true);
// // // // // // // // // //       const transactionId = 'CARD' + Date.now().toString().slice(-10);
      
// // // // // // // // // //       Alert.alert(
// // // // // // // // // //         '✅ Payment Successful!',
// // // // // // // // // //         `₹${totalAmount} has been charged to your card ending in ${cardNumber.slice(-4)}\n\nTransaction ID: ${transactionId}`,
// // // // // // // // // //         [
// // // // // // // // // //           {
// // // // // // // // // //             text: 'Continue',
// // // // // // // // // //             onPress: () => {
// // // // // // // // // //               setPaymentSuccess(false);
// // // // // // // // // //               navigation.navigate('OrderTracking');
// // // // // // // // // //             }
// // // // // // // // // //           }
// // // // // // // // // //         ]
// // // // // // // // // //       );
// // // // // // // // // //     }, 2500);
// // // // // // // // // //   };

// // // // // // // // // //   // ============ NET BANKING FLOW ============
// // // // // // // // // //   const handleNetBankingSelect = (bank: any) => {
// // // // // // // // // //     setShowNetBankingModal(false);
    
// // // // // // // // // //     Alert.alert(
// // // // // // // // // //       `Pay with ${bank.name}`,
// // // // // // // // // //       `Amount: ₹${totalAmount}\n\nYou will be redirected to ${bank.name}'s secure payment page.`,
// // // // // // // // // //       [
// // // // // // // // // //         { text: 'Cancel', style: 'cancel' },
// // // // // // // // // //         { 
// // // // // // // // // //           text: 'Proceed', 
// // // // // // // // // //           onPress: () => {
// // // // // // // // // //             setLoading(true);
// // // // // // // // // //             setTimeout(() => {
// // // // // // // // // //               setLoading(false);
// // // // // // // // // //               setPaymentSuccess(true);
// // // // // // // // // //               const transactionId = 'NB' + Date.now().toString().slice(-10);
              
// // // // // // // // // //               Alert.alert(
// // // // // // // // // //                 '✅ Payment Successful!',
// // // // // // // // // //                 `₹${totalAmount} has been paid via ${bank.name}\n\nTransaction ID: ${transactionId}`,
// // // // // // // // // //                 [
// // // // // // // // // //                   {
// // // // // // // // // //                     text: 'Continue',
// // // // // // // // // //                     onPress: () => {
// // // // // // // // // //                       setPaymentSuccess(false);
// // // // // // // // // //                       navigation.navigate('OrderTracking');
// // // // // // // // // //                     }
// // // // // // // // // //                   }
// // // // // // // // // //                 ]
// // // // // // // // // //               );
// // // // // // // // // //             }, 2000);
// // // // // // // // // //           }
// // // // // // // // // //         }
// // // // // // // // // //       ]
// // // // // // // // // //     );
// // // // // // // // // //   };

// // // // // // // // // //   // ============ WALLET FLOW ============
// // // // // // // // // //   const handleWalletPayment = () => {
// // // // // // // // // //     if (totalAmount > walletBalance) {
// // // // // // // // // //       Alert.alert(
// // // // // // // // // //         'Insufficient Balance',
// // // // // // // // // //         `Wallet balance: ₹${walletBalance}\nAmount needed: ₹${totalAmount}\n\nPlease add money to your wallet or use another payment method.`,
// // // // // // // // // //         [
// // // // // // // // // //           { text: 'OK', onPress: () => setShowWalletModal(false) }
// // // // // // // // // //         ]
// // // // // // // // // //       );
// // // // // // // // // //       return;
// // // // // // // // // //     }

// // // // // // // // // //     setShowWalletModal(false);
// // // // // // // // // //     Alert.alert(
// // // // // // // // // //       'Pay with Wallet',
// // // // // // // // // //       `Amount: ₹${totalAmount}\nWallet Balance: ₹${walletBalance}\n\nAfter payment, balance: ₹${walletBalance - totalAmount}`,
// // // // // // // // // //       [
// // // // // // // // // //         { text: 'Cancel', style: 'cancel' },
// // // // // // // // // //         { 
// // // // // // // // // //           text: 'Pay Now', 
// // // // // // // // // //           onPress: () => {
// // // // // // // // // //             setLoading(true);
// // // // // // // // // //             setTimeout(() => {
// // // // // // // // // //               setLoading(false);
// // // // // // // // // //               setPaymentSuccess(true);
// // // // // // // // // //               const transactionId = 'WLT' + Date.now().toString().slice(-10);
              
// // // // // // // // // //               Alert.alert(
// // // // // // // // // //                 '✅ Payment Successful!',
// // // // // // // // // //                 `₹${totalAmount} has been deducted from your wallet\n\nNew Balance: ₹${walletBalance - totalAmount}\nTransaction ID: ${transactionId}`,
// // // // // // // // // //                 [
// // // // // // // // // //                   {
// // // // // // // // // //                     text: 'Continue',
// // // // // // // // // //                     onPress: () => {
// // // // // // // // // //                       setPaymentSuccess(false);
// // // // // // // // // //                       navigation.navigate('OrderTracking');
// // // // // // // // // //                     }
// // // // // // // // // //                   }
// // // // // // // // // //                 ]
// // // // // // // // // //               );
// // // // // // // // // //             }, 1500);
// // // // // // // // // //           }
// // // // // // // // // //         }
// // // // // // // // // //       ]
// // // // // // // // // //     );
// // // // // // // // // //   };

// // // // // // // // // //   // ============ CASH ON DELIVERY ============
// // // // // // // // // //   const handleCashOnDelivery = () => {
// // // // // // // // // //     Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    
// // // // // // // // // //     Alert.alert(
// // // // // // // // // //       '💳 Cash on Delivery',
// // // // // // // // // //       `Order Total: ₹${totalAmount}\n\nYou will pay ₹${totalAmount} in cash when your order arrives.\n\nPlease keep the exact amount ready.`,
// // // // // // // // // //       [
// // // // // // // // // //         { text: 'Cancel', style: 'cancel' },
// // // // // // // // // //         { 
// // // // // // // // // //           text: 'Confirm COD', 
// // // // // // // // // //           onPress: () => {
// // // // // // // // // //             setLoading(true);
// // // // // // // // // //             setTimeout(() => {
// // // // // // // // // //               setLoading(false);
// // // // // // // // // //               setPaymentSuccess(true);
// // // // // // // // // //               const transactionId = 'COD' + Date.now().toString().slice(-10);
              
// // // // // // // // // //               Alert.alert(
// // // // // // // // // //                 '✅ Order Placed Successfully!',
// // // // // // // // // //                 `Your order worth ₹${totalAmount} has been placed with Cash on Delivery.\n\nOrder ID: ${transactionId}`,
// // // // // // // // // //                 [
// // // // // // // // // //                   {
// // // // // // // // // //                     text: 'Track Order',
// // // // // // // // // //                     onPress: () => {
// // // // // // // // // //                       setPaymentSuccess(false);
// // // // // // // // // //                       navigation.navigate('OrderTracking');
// // // // // // // // // //                     }
// // // // // // // // // //                   }
// // // // // // // // // //                 ]
// // // // // // // // // //               );
// // // // // // // // // //             }, 1500);
// // // // // // // // // //           }
// // // // // // // // // //         }
// // // // // // // // // //       ]
// // // // // // // // // //     );
// // // // // // // // // //   };

// // // // // // // // // //   const formatCardNumber = (text: string): string => {
// // // // // // // // // //     const cleaned = text.replace(/\s/g, '');
// // // // // // // // // //     const matches = cleaned.match(/.{1,4}/g);
// // // // // // // // // //     if (matches) {
// // // // // // // // // //       return matches.join(' ');
// // // // // // // // // //     }
// // // // // // // // // //     return text;
// // // // // // // // // //   };

// // // // // // // // // //   const formatExpiryDate = (text: string): string => {
// // // // // // // // // //     const cleaned = text.replace(/\D/g, '');
// // // // // // // // // //     if (cleaned.length >= 2) {
// // // // // // // // // //       return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
// // // // // // // // // //     }
// // // // // // // // // //     return text;
// // // // // // // // // //   };

// // // // // // // // // //   return (
// // // // // // // // // //     <View style={styles.container}>
// // // // // // // // // //       <ScrollView showsVerticalScrollIndicator={false}>
// // // // // // // // // //         {/* Header */}
// // // // // // // // // //         <View style={styles.header}>
// // // // // // // // // //           <TouchableOpacity onPress={() => navigation.goBack()}>
// // // // // // // // // //             <Icon name="arrow-back" size={24} color={colors.text} />
// // // // // // // // // //           </TouchableOpacity>
// // // // // // // // // //           <Text style={styles.headerTitle}>Payment</Text>
// // // // // // // // // //           <View style={{ width: 24 }} />
// // // // // // // // // //         </View>

// // // // // // // // // //         {/* Amount */}
// // // // // // // // // //         <View style={styles.amountContainer}>
// // // // // // // // // //           <Text style={styles.amountLabel}>Amount to Pay</Text>
// // // // // // // // // //           <Text style={styles.amountValue}>₹{totalAmount}</Text>
// // // // // // // // // //         </View>

// // // // // // // // // //         {/* Payment Methods */}
// // // // // // // // // //         <View style={styles.methodsContainer}>
// // // // // // // // // //           <Text style={styles.sectionTitle}>Payment Methods</Text>
// // // // // // // // // //           {paymentMethods.map((method) => (
// // // // // // // // // //             <TouchableOpacity
// // // // // // // // // //               key={method.id}
// // // // // // // // // //               style={[
// // // // // // // // // //                 styles.methodItem,
// // // // // // // // // //                 selectedMethod === method.id && styles.selectedMethod,
// // // // // // // // // //               ]}
// // // // // // // // // //               onPress={() => handleSelectMethod(method.id)}
// // // // // // // // // //             >
// // // // // // // // // //               <View style={styles.methodLeft}>
// // // // // // // // // //                 <View style={[styles.methodIcon, selectedMethod === method.id && styles.selectedMethodIcon]}>
// // // // // // // // // //                   <Icon name={method.icon} size={22} color={selectedMethod === method.id ? colors.white : colors.text} />
// // // // // // // // // //                 </View>
// // // // // // // // // //                 <View style={styles.methodInfo}>
// // // // // // // // // //                   <Text style={[
// // // // // // // // // //                     styles.methodName,
// // // // // // // // // //                     selectedMethod === method.id && styles.selectedMethodText,
// // // // // // // // // //                   ]}>
// // // // // // // // // //                     {method.name}
// // // // // // // // // //                   </Text>
// // // // // // // // // //                   <Text style={styles.methodDesc}>{method.desc}</Text>
// // // // // // // // // //                 </View>
// // // // // // // // // //               </View>
// // // // // // // // // //               {selectedMethod === method.id && (
// // // // // // // // // //                 <Icon name="checkmark-circle" size={24} color={colors.primary} />
// // // // // // // // // //               )}
// // // // // // // // // //             </TouchableOpacity>
// // // // // // // // // //           ))}
// // // // // // // // // //         </View>

// // // // // // // // // //         {/* Cash on Delivery Info */}
// // // // // // // // // //         {selectedMethod === 'cash' && (
// // // // // // // // // //           <View style={styles.infoContainer}>
// // // // // // // // // //             <Icon name="information-circle-outline" size={20} color={colors.info} />
// // // // // // // // // //             <Text style={styles.infoText}>
// // // // // // // // // //               Pay with cash when your order arrives. No additional charges.
// // // // // // // // // //             </Text>
// // // // // // // // // //           </View>
// // // // // // // // // //         )}
// // // // // // // // // //       </ScrollView>

// // // // // // // // // //       {/* ============ UPI MODAL ============ */}
// // // // // // // // // //       <Modal
// // // // // // // // // //         visible={showUPIModal}
// // // // // // // // // //         transparent={true}
// // // // // // // // // //         animationType="slide"
// // // // // // // // // //         onRequestClose={() => setShowUPIModal(false)}
// // // // // // // // // //       >
// // // // // // // // // //         <View style={styles.modalOverlay}>
// // // // // // // // // //           <View style={styles.modalContainer}>
// // // // // // // // // //             <View style={styles.modalHeader}>
// // // // // // // // // //               <Text style={styles.modalTitle}>Select UPI App</Text>
// // // // // // // // // //               <TouchableOpacity onPress={() => setShowUPIModal(false)}>
// // // // // // // // // //                 <Icon name="close" size={24} color={colors.text} />
// // // // // // // // // //               </TouchableOpacity>
// // // // // // // // // //             </View>

// // // // // // // // // //             <View style={styles.upiAppsContainer}>
// // // // // // // // // //               {upiApps.map((app) => (
// // // // // // // // // //                 <TouchableOpacity
// // // // // // // // // //                   key={app.id}
// // // // // // // // // //                   style={styles.upiAppItem}
// // // // // // // // // //                   onPress={() => handleUPISelection(app)}
// // // // // // // // // //                 >
// // // // // // // // // //                   <View style={[styles.upiAppIcon, { backgroundColor: app.color + '20' }]}>
// // // // // // // // // //                     <Text style={styles.upiAppEmoji}>{app.emoji}</Text>
// // // // // // // // // //                   </View>
// // // // // // // // // //                   <View style={styles.upiAppInfo}>
// // // // // // // // // //                     <Text style={styles.upiAppName}>{app.name}</Text>
// // // // // // // // // //                     <Text style={styles.upiAppDesc}>UPI Payment</Text>
// // // // // // // // // //                   </View>
// // // // // // // // // //                   <Icon name="chevron-forward" size={20} color={colors.gray} />
// // // // // // // // // //                 </TouchableOpacity>
// // // // // // // // // //               ))}
// // // // // // // // // //             </View>

// // // // // // // // // //             <TouchableOpacity 
// // // // // // // // // //               style={styles.enterUPIButton}
// // // // // // // // // //               onPress={() => {
// // // // // // // // // //                 setShowUPIModal(false);
// // // // // // // // // //                 setSelectedUPIApp('Manual UPI');
// // // // // // // // // //                 setTimeout(() => {
// // // // // // // // // //                   setShowUPIPinModal(true);
// // // // // // // // // //                 }, 300);
// // // // // // // // // //               }}
// // // // // // // // // //             >
// // // // // // // // // //               <Text style={styles.enterUPIButtonText}>Enter UPI ID Manually</Text>
// // // // // // // // // //             </TouchableOpacity>
// // // // // // // // // //           </View>
// // // // // // // // // //         </View>
// // // // // // // // // //       </Modal>

// // // // // // // // // //       {/* ============ UPI PIN MODAL ============ */}
// // // // // // // // // //       <Modal
// // // // // // // // // //         visible={showUPIPinModal}
// // // // // // // // // //         transparent={true}
// // // // // // // // // //         animationType="fade"
// // // // // // // // // //         onRequestClose={() => {
// // // // // // // // // //           setShowUPIPinModal(false);
// // // // // // // // // //           setUpiPin('');
// // // // // // // // // //         }}
// // // // // // // // // //       >
// // // // // // // // // //         <View style={styles.pinModalOverlay}>
// // // // // // // // // //           <View style={styles.pinModalContainer}>
// // // // // // // // // //             <View style={styles.pinModalHeader}>
// // // // // // // // // //               <Text style={styles.pinModalTitle}>
// // // // // // // // // //                 {selectedUPIApp || 'UPI'} PIN
// // // // // // // // // //               </Text>
// // // // // // // // // //               <Text style={styles.pinModalSubtitle}>
// // // // // // // // // //                 Enter your 4-digit UPI PIN to confirm payment
// // // // // // // // // //               </Text>
// // // // // // // // // //             </View>

// // // // // // // // // //             <View style={styles.pinDisplayContainer}>
// // // // // // // // // //               <View style={styles.pinDisplay}>
// // // // // // // // // //                 {[0, 1, 2, 3].map((index) => (
// // // // // // // // // //                   <View key={index} style={styles.pinDotContainer}>
// // // // // // // // // //                     <View style={[
// // // // // // // // // //                       styles.pinDot,
// // // // // // // // // //                       upiPin.length > index && styles.pinDotFilled,
// // // // // // // // // //                     ]} />
// // // // // // // // // //                   </View>
// // // // // // // // // //                 ))}
// // // // // // // // // //               </View>
// // // // // // // // // //             </View>

// // // // // // // // // //             <View style={styles.pinKeyboard}>
// // // // // // // // // //               {[1, 2, 3, 4, 5, 6, 7, 8, 9, 'clear', 0, 'delete'].map((key) => (
// // // // // // // // // //                 <TouchableOpacity
// // // // // // // // // //                   key={key.toString()}
// // // // // // // // // //                   style={styles.pinKey}
// // // // // // // // // //                   onPress={() => {
// // // // // // // // // //                     if (key === 'clear') {
// // // // // // // // // //                       setUpiPin('');
// // // // // // // // // //                     } else if (key === 'delete') {
// // // // // // // // // //                       setUpiPin(upiPin.slice(0, -1));
// // // // // // // // // //                     } else if (upiPin.length < 4) {
// // // // // // // // // //                       setUpiPin(upiPin + key.toString());
// // // // // // // // // //                     }
// // // // // // // // // //                   }}
// // // // // // // // // //                 >
// // // // // // // // // //                   <Text style={styles.pinKeyText}>
// // // // // // // // // //                     {key === 'clear' ? 'Clear' : key === 'delete' ? '⌫' : key}
// // // // // // // // // //                   </Text>
// // // // // // // // // //                 </TouchableOpacity>
// // // // // // // // // //               ))}
// // // // // // // // // //             </View>

// // // // // // // // // //             <TouchableOpacity
// // // // // // // // // //               style={[styles.pinConfirmButton, upiPin.length !== 4 && styles.pinConfirmButtonDisabled]}
// // // // // // // // // //               onPress={handleUPIPinSubmit}
// // // // // // // // // //               disabled={upiPin.length !== 4}
// // // // // // // // // //             >
// // // // // // // // // //               <Text style={styles.pinConfirmButtonText}>
// // // // // // // // // //                 Pay ₹{totalAmount}
// // // // // // // // // //               </Text>
// // // // // // // // // //             </TouchableOpacity>

// // // // // // // // // //             <TouchableOpacity
// // // // // // // // // //               style={styles.pinCancelButton}
// // // // // // // // // //               onPress={() => {
// // // // // // // // // //                 setShowUPIPinModal(false);
// // // // // // // // // //                 setUpiPin('');
// // // // // // // // // //               }}
// // // // // // // // // //             >
// // // // // // // // // //               <Text style={styles.pinCancelButtonText}>Cancel</Text>
// // // // // // // // // //             </TouchableOpacity>
// // // // // // // // // //           </View>
// // // // // // // // // //         </View>
// // // // // // // // // //       </Modal>

// // // // // // // // // //       {/* ============ CARD MODAL ============ */}
// // // // // // // // // //       <Modal
// // // // // // // // // //         visible={showCardModal}
// // // // // // // // // //         transparent={true}
// // // // // // // // // //         animationType="slide"
// // // // // // // // // //         onRequestClose={() => setShowCardModal(false)}
// // // // // // // // // //       >
// // // // // // // // // //         <View style={styles.modalOverlay}>
// // // // // // // // // //           <View style={styles.modalContainer}>
// // // // // // // // // //             <View style={styles.modalHeader}>
// // // // // // // // // //               <Text style={styles.modalTitle}>Card Details</Text>
// // // // // // // // // //               <TouchableOpacity onPress={() => setShowCardModal(false)}>
// // // // // // // // // //                 <Icon name="close" size={24} color={colors.text} />
// // // // // // // // // //               </TouchableOpacity>
// // // // // // // // // //             </View>

// // // // // // // // // //             <View style={styles.cardModalBody}>
// // // // // // // // // //               <View style={styles.cardPreview}>
// // // // // // // // // //                 <Icon name="card-outline" size={40} color={colors.primary} />
// // // // // // // // // //                 <Text style={styles.cardPreviewText}>Enter Card Details</Text>
// // // // // // // // // //               </View>

// // // // // // // // // //               <View style={styles.inputContainer}>
// // // // // // // // // //                 <Text style={styles.inputLabel}>Card Number</Text>
// // // // // // // // // //                 <TextInput
// // // // // // // // // //                   style={styles.input}
// // // // // // // // // //                   placeholder="1234 5678 9012 3456"
// // // // // // // // // //                   value={cardNumber}
// // // // // // // // // //                   onChangeText={(text) => setCardNumber(formatCardNumber(text))}
// // // // // // // // // //                   keyboardType="numeric"
// // // // // // // // // //                   maxLength={19}
// // // // // // // // // //                 />
// // // // // // // // // //               </View>

// // // // // // // // // //               <View style={styles.inputContainer}>
// // // // // // // // // //                 <Text style={styles.inputLabel}>Card Holder Name</Text>
// // // // // // // // // //                 <TextInput
// // // // // // // // // //                   style={styles.input}
// // // // // // // // // //                   placeholder="John Doe"
// // // // // // // // // //                   value={cardHolder}
// // // // // // // // // //                   onChangeText={setCardHolder}
// // // // // // // // // //                 />
// // // // // // // // // //               </View>

// // // // // // // // // //               <View style={styles.rowInputs}>
// // // // // // // // // //                 <View style={[styles.inputContainer, styles.halfInput]}>
// // // // // // // // // //                   <Text style={styles.inputLabel}>Expiry Date</Text>
// // // // // // // // // //                   <TextInput
// // // // // // // // // //                     style={styles.input}
// // // // // // // // // //                     placeholder="MM/YY"
// // // // // // // // // //                     value={expiryDate}
// // // // // // // // // //                     onChangeText={(text) => setExpiryDate(formatExpiryDate(text))}
// // // // // // // // // //                     keyboardType="numeric"
// // // // // // // // // //                     maxLength={5}
// // // // // // // // // //                   />
// // // // // // // // // //                 </View>
// // // // // // // // // //                 <View style={[styles.inputContainer, styles.halfInput]}>
// // // // // // // // // //                   <Text style={styles.inputLabel}>CVV</Text>
// // // // // // // // // //                   <TextInput
// // // // // // // // // //                     style={styles.input}
// // // // // // // // // //                     placeholder="123"
// // // // // // // // // //                     value={cvv}
// // // // // // // // // //                     onChangeText={setCvv}
// // // // // // // // // //                     keyboardType="numeric"
// // // // // // // // // //                     maxLength={4}
// // // // // // // // // //                     secureTextEntry
// // // // // // // // // //                   />
// // // // // // // // // //                 </View>
// // // // // // // // // //               </View>

// // // // // // // // // //               <TouchableOpacity 
// // // // // // // // // //                 style={styles.payNowButton} 
// // // // // // // // // //                 onPress={handleCardPayment}
// // // // // // // // // //                 disabled={loading}
// // // // // // // // // //               >
// // // // // // // // // //                 {loading ? (
// // // // // // // // // //                   <ActivityIndicator color="#ffffff" />
// // // // // // // // // //                 ) : (
// // // // // // // // // //                   <Text style={styles.payNowButtonText}>Pay ₹{totalAmount}</Text>
// // // // // // // // // //                 )}
// // // // // // // // // //               </TouchableOpacity>
// // // // // // // // // //             </View>
// // // // // // // // // //           </View>
// // // // // // // // // //         </View>
// // // // // // // // // //       </Modal>

// // // // // // // // // //       {/* ============ NET BANKING MODAL ============ */}
// // // // // // // // // //       <Modal
// // // // // // // // // //         visible={showNetBankingModal}
// // // // // // // // // //         transparent={true}
// // // // // // // // // //         animationType="slide"
// // // // // // // // // //         onRequestClose={() => setShowNetBankingModal(false)}
// // // // // // // // // //       >
// // // // // // // // // //         <View style={styles.modalOverlay}>
// // // // // // // // // //           <View style={styles.modalContainer}>
// // // // // // // // // //             <View style={styles.modalHeader}>
// // // // // // // // // //               <Text style={styles.modalTitle}>Select Bank</Text>
// // // // // // // // // //               <TouchableOpacity onPress={() => setShowNetBankingModal(false)}>
// // // // // // // // // //                 <Icon name="close" size={24} color={colors.text} />
// // // // // // // // // //               </TouchableOpacity>
// // // // // // // // // //             </View>

// // // // // // // // // //             <View style={styles.banksContainer}>
// // // // // // // // // //               {banks.map((bank) => (
// // // // // // // // // //                 <TouchableOpacity
// // // // // // // // // //                   key={bank.id}
// // // // // // // // // //                   style={styles.bankItem}
// // // // // // // // // //                   onPress={() => handleNetBankingSelect(bank)}
// // // // // // // // // //                 >
// // // // // // // // // //                   <View style={styles.bankIcon}>
// // // // // // // // // //                     <Text style={styles.bankEmoji}>{bank.icon}</Text>
// // // // // // // // // //                   </View>
// // // // // // // // // //                   <View style={styles.bankInfo}>
// // // // // // // // // //                     <Text style={styles.bankName}>{bank.name}</Text>
// // // // // // // // // //                     <Text style={styles.bankDesc}>Net Banking</Text>
// // // // // // // // // //                   </View>
// // // // // // // // // //                   <Icon name="chevron-forward" size={20} color={colors.gray} />
// // // // // // // // // //                 </TouchableOpacity>
// // // // // // // // // //               ))}
// // // // // // // // // //             </View>
// // // // // // // // // //           </View>
// // // // // // // // // //         </View>
// // // // // // // // // //       </Modal>

// // // // // // // // // //       {/* ============ WALLET MODAL ============ */}
// // // // // // // // // //       <Modal
// // // // // // // // // //         visible={showWalletModal}
// // // // // // // // // //         transparent={true}
// // // // // // // // // //         animationType="slide"
// // // // // // // // // //         onRequestClose={() => setShowWalletModal(false)}
// // // // // // // // // //       >
// // // // // // // // // //         <View style={styles.modalOverlay}>
// // // // // // // // // //           <View style={styles.modalContainer}>
// // // // // // // // // //             <View style={styles.modalHeader}>
// // // // // // // // // //               <Text style={styles.modalTitle}>Pay with Wallet</Text>
// // // // // // // // // //               <TouchableOpacity onPress={() => setShowWalletModal(false)}>
// // // // // // // // // //                 <Icon name="close" size={24} color={colors.text} />
// // // // // // // // // //               </TouchableOpacity>
// // // // // // // // // //             </View>

// // // // // // // // // //             <View style={styles.walletModalBody}>
// // // // // // // // // //               <View style={styles.walletBalanceContainer}>
// // // // // // // // // //                 <Icon name="wallet-outline" size={40} color={colors.primary} />
// // // // // // // // // //                 <Text style={styles.walletBalanceTitle}>Wallet Balance</Text>
// // // // // // // // // //                 <Text style={styles.walletBalanceAmount}>₹{walletBalance}</Text>
// // // // // // // // // //               </View>

// // // // // // // // // //               <View style={styles.walletInfoContainer}>
// // // // // // // // // //                 <View style={styles.walletInfoRow}>
// // // // // // // // // //                   <Text style={styles.walletInfoLabel}>Order Total</Text>
// // // // // // // // // //                   <Text style={styles.walletInfoValue}>₹{totalAmount}</Text>
// // // // // // // // // //                 </View>
// // // // // // // // // //                 <View style={styles.walletInfoRow}>
// // // // // // // // // //                   <Text style={styles.walletInfoLabel}>Balance After Payment</Text>
// // // // // // // // // //                   <Text style={[styles.walletInfoValue, { color: totalAmount <= walletBalance ? colors.success : colors.danger }]}>
// // // // // // // // // //                     ₹{walletBalance - totalAmount}
// // // // // // // // // //                   </Text>
// // // // // // // // // //                 </View>
// // // // // // // // // //               </View>

// // // // // // // // // //               <TouchableOpacity 
// // // // // // // // // //                 style={[styles.walletPayButton, totalAmount > walletBalance && styles.walletPayButtonDisabled]}
// // // // // // // // // //                 onPress={handleWalletPayment}
// // // // // // // // // //                 disabled={loading || totalAmount > walletBalance}
// // // // // // // // // //               >
// // // // // // // // // //                 {loading ? (
// // // // // // // // // //                   <ActivityIndicator color="#ffffff" />
// // // // // // // // // //                 ) : (
// // // // // // // // // //                   <Text style={styles.walletPayButtonText}>
// // // // // // // // // //                     {totalAmount > walletBalance ? 'Insufficient Balance' : `Pay ₹${totalAmount}`}
// // // // // // // // // //                   </Text>
// // // // // // // // // //                 )}
// // // // // // // // // //               </TouchableOpacity>
// // // // // // // // // //             </View>
// // // // // // // // // //           </View>
// // // // // // // // // //         </View>
// // // // // // // // // //       </Modal>

// // // // // // // // // //       {/* Loading Overlay */}
// // // // // // // // // //       {loading && (
// // // // // // // // // //         <View style={styles.loadingOverlay}>
// // // // // // // // // //           <View style={styles.loadingContainer}>
// // // // // // // // // //             <ActivityIndicator size="large" color={colors.primary} />
// // // // // // // // // //             <Text style={styles.loadingText}>Processing Payment...</Text>
// // // // // // // // // //             <Text style={styles.loadingSubText}>Please do not close the app</Text>
// // // // // // // // // //           </View>
// // // // // // // // // //         </View>
// // // // // // // // // //       )}
// // // // // // // // // //     </View>
// // // // // // // // // //   );
// // // // // // // // // // }

// // // // // // // // // // const styles = StyleSheet.create({
// // // // // // // // // //   container: {
// // // // // // // // // //     flex: 1,
// // // // // // // // // //     backgroundColor: colors.white,
// // // // // // // // // //   },
// // // // // // // // // //   header: {
// // // // // // // // // //     flexDirection: 'row',
// // // // // // // // // //     alignItems: 'center',
// // // // // // // // // //     justifyContent: 'space-between',
// // // // // // // // // //     padding: 16,
// // // // // // // // // //     paddingTop: 40,
// // // // // // // // // //     borderBottomWidth: 1,
// // // // // // // // // //     borderBottomColor: colors.border,
// // // // // // // // // //   },
// // // // // // // // // //   headerTitle: {
// // // // // // // // // //     fontSize: 18,
// // // // // // // // // //     fontWeight: '600',
// // // // // // // // // //     color: colors.text,
// // // // // // // // // //   },
// // // // // // // // // //   amountContainer: {
// // // // // // // // // //     backgroundColor: colors.primary,
// // // // // // // // // //     padding: 20,
// // // // // // // // // //     margin: 16,
// // // // // // // // // //     borderRadius: 12,
// // // // // // // // // //     alignItems: 'center',
// // // // // // // // // //   },
// // // // // // // // // //   amountLabel: {
// // // // // // // // // //     fontSize: 14,
// // // // // // // // // //     color: colors.white,
// // // // // // // // // //     opacity: 0.8,
// // // // // // // // // //   },
// // // // // // // // // //   amountValue: {
// // // // // // // // // //     fontSize: 28,
// // // // // // // // // //     fontWeight: '700',
// // // // // // // // // //     color: colors.white,
// // // // // // // // // //     marginTop: 4,
// // // // // // // // // //   },
// // // // // // // // // //   methodsContainer: {
// // // // // // // // // //     paddingHorizontal: 16,
// // // // // // // // // //     paddingBottom: 20,
// // // // // // // // // //   },
// // // // // // // // // //   sectionTitle: {
// // // // // // // // // //     fontSize: 16,
// // // // // // // // // //     fontWeight: '600',
// // // // // // // // // //     color: colors.text,
// // // // // // // // // //     marginBottom: 12,
// // // // // // // // // //   },
// // // // // // // // // //   methodItem: {
// // // // // // // // // //     flexDirection: 'row',
// // // // // // // // // //     justifyContent: 'space-between',
// // // // // // // // // //     alignItems: 'center',
// // // // // // // // // //     padding: 14,
// // // // // // // // // //     borderWidth: 1,
// // // // // // // // // //     borderColor: colors.border,
// // // // // // // // // //     borderRadius: 10,
// // // // // // // // // //     marginBottom: 8,
// // // // // // // // // //   },
// // // // // // // // // //   selectedMethod: {
// // // // // // // // // //     borderColor: colors.primary,
// // // // // // // // // //     backgroundColor: '#fff5ec',
// // // // // // // // // //   },
// // // // // // // // // //   methodLeft: {
// // // // // // // // // //     flexDirection: 'row',
// // // // // // // // // //     alignItems: 'center',
// // // // // // // // // //     flex: 1,
// // // // // // // // // //   },
// // // // // // // // // //   methodIcon: {
// // // // // // // // // //     width: 36,
// // // // // // // // // //     height: 36,
// // // // // // // // // //     borderRadius: 18,
// // // // // // // // // //     backgroundColor: colors.lightGray,
// // // // // // // // // //     justifyContent: 'center',
// // // // // // // // // //     alignItems: 'center',
// // // // // // // // // //     marginRight: 12,
// // // // // // // // // //   },
// // // // // // // // // //   selectedMethodIcon: {
// // // // // // // // // //     backgroundColor: colors.primary,
// // // // // // // // // //   },
// // // // // // // // // //   methodInfo: {
// // // // // // // // // //     flex: 1,
// // // // // // // // // //   },
// // // // // // // // // //   methodName: {
// // // // // // // // // //     fontSize: 14,
// // // // // // // // // //     color: colors.text,
// // // // // // // // // //   },
// // // // // // // // // //   selectedMethodText: {
// // // // // // // // // //     color: colors.primary,
// // // // // // // // // //     fontWeight: '500',
// // // // // // // // // //   },
// // // // // // // // // //   methodDesc: {
// // // // // // // // // //     fontSize: 11,
// // // // // // // // // //     color: colors.textLight,
// // // // // // // // // //     marginTop: 1,
// // // // // // // // // //   },
// // // // // // // // // //   infoContainer: {
// // // // // // // // // //     flexDirection: 'row',
// // // // // // // // // //     alignItems: 'center',
// // // // // // // // // //     backgroundColor: '#f8f9fa',
// // // // // // // // // //     marginHorizontal: 16,
// // // // // // // // // //     marginBottom: 16,
// // // // // // // // // //     padding: 12,
// // // // // // // // // //     borderRadius: 8,
// // // // // // // // // //     borderWidth: 1,
// // // // // // // // // //     borderColor: colors.border,
// // // // // // // // // //   },
// // // // // // // // // //   infoText: {
// // // // // // // // // //     fontSize: 13,
// // // // // // // // // //     color: colors.textLight,
// // // // // // // // // //     marginLeft: 10,
// // // // // // // // // //     flex: 1,
// // // // // // // // // //   },
// // // // // // // // // //   modalOverlay: {
// // // // // // // // // //     flex: 1,
// // // // // // // // // //     backgroundColor: 'rgba(0,0,0,0.5)',
// // // // // // // // // //     justifyContent: 'flex-end',
// // // // // // // // // //   },
// // // // // // // // // //   modalContainer: {
// // // // // // // // // //     backgroundColor: colors.white,
// // // // // // // // // //     borderTopLeftRadius: 24,
// // // // // // // // // //     borderTopRightRadius: 24,
// // // // // // // // // //     paddingHorizontal: 20,
// // // // // // // // // //     paddingBottom: 30,
// // // // // // // // // //     maxHeight: '80%',
// // // // // // // // // //   },
// // // // // // // // // //   modalHeader: {
// // // // // // // // // //     flexDirection: 'row',
// // // // // // // // // //     justifyContent: 'space-between',
// // // // // // // // // //     alignItems: 'center',
// // // // // // // // // //     paddingVertical: 16,
// // // // // // // // // //     borderBottomWidth: 1,
// // // // // // // // // //     borderBottomColor: colors.border,
// // // // // // // // // //   },
// // // // // // // // // //   modalTitle: {
// // // // // // // // // //     fontSize: 18,
// // // // // // // // // //     fontWeight: '600',
// // // // // // // // // //     color: colors.text,
// // // // // // // // // //   },
// // // // // // // // // //   // UPI Modal
// // // // // // // // // //   upiAppsContainer: {
// // // // // // // // // //     marginTop: 12,
// // // // // // // // // //   },
// // // // // // // // // //   upiAppItem: {
// // // // // // // // // //     flexDirection: 'row',
// // // // // // // // // //     alignItems: 'center',
// // // // // // // // // //     paddingVertical: 14,
// // // // // // // // // //     borderBottomWidth: 1,
// // // // // // // // // //     borderBottomColor: colors.border,
// // // // // // // // // //   },
// // // // // // // // // //   upiAppIcon: {
// // // // // // // // // //     width: 48,
// // // // // // // // // //     height: 48,
// // // // // // // // // //     borderRadius: 24,
// // // // // // // // // //     justifyContent: 'center',
// // // // // // // // // //     alignItems: 'center',
// // // // // // // // // //     marginRight: 12,
// // // // // // // // // //   },
// // // // // // // // // //   upiAppEmoji: {
// // // // // // // // // //     fontSize: 24,
// // // // // // // // // //   },
// // // // // // // // // //   upiAppInfo: {
// // // // // // // // // //     flex: 1,
// // // // // // // // // //   },
// // // // // // // // // //   upiAppName: {
// // // // // // // // // //     fontSize: 15,
// // // // // // // // // //     fontWeight: '500',
// // // // // // // // // //     color: colors.text,
// // // // // // // // // //   },
// // // // // // // // // //   upiAppDesc: {
// // // // // // // // // //     fontSize: 12,
// // // // // // // // // //     color: colors.textLight,
// // // // // // // // // //     marginTop: 2,
// // // // // // // // // //   },
// // // // // // // // // //   enterUPIButton: {
// // // // // // // // // //     marginTop: 16,
// // // // // // // // // //     paddingVertical: 12,
// // // // // // // // // //     borderWidth: 1,
// // // // // // // // // //     borderColor: colors.primary,
// // // // // // // // // //     borderRadius: 8,
// // // // // // // // // //     alignItems: 'center',
// // // // // // // // // //   },
// // // // // // // // // //   enterUPIButtonText: {
// // // // // // // // // //     color: colors.primary,
// // // // // // // // // //     fontSize: 14,
// // // // // // // // // //     fontWeight: '500',
// // // // // // // // // //   },
// // // // // // // // // //   // UPI PIN Modal
// // // // // // // // // //   pinModalOverlay: {
// // // // // // // // // //     flex: 1,
// // // // // // // // // //     backgroundColor: 'rgba(0,0,0,0.7)',
// // // // // // // // // //     justifyContent: 'center',
// // // // // // // // // //     alignItems: 'center',
// // // // // // // // // //   },
// // // // // // // // // //   pinModalContainer: {
// // // // // // // // // //     backgroundColor: colors.white,
// // // // // // // // // //     borderRadius: 24,
// // // // // // // // // //     padding: 24,
// // // // // // // // // //     width: '85%',
// // // // // // // // // //     maxWidth: 400,
// // // // // // // // // //   },
// // // // // // // // // //   pinModalHeader: {
// // // // // // // // // //     alignItems: 'center',
// // // // // // // // // //     marginBottom: 20,
// // // // // // // // // //   },
// // // // // // // // // //   pinModalTitle: {
// // // // // // // // // //     fontSize: 20,
// // // // // // // // // //     fontWeight: '700',
// // // // // // // // // //     color: colors.text,
// // // // // // // // // //   },
// // // // // // // // // //   pinModalSubtitle: {
// // // // // // // // // //     fontSize: 14,
// // // // // // // // // //     color: colors.textLight,
// // // // // // // // // //     marginTop: 4,
// // // // // // // // // //   },
// // // // // // // // // //   pinDisplayContainer: {
// // // // // // // // // //     alignItems: 'center',
// // // // // // // // // //     marginBottom: 24,
// // // // // // // // // //   },
// // // // // // // // // //   pinDisplay: {
// // // // // // // // // //     flexDirection: 'row',
// // // // // // // // // //     justifyContent: 'center',
// // // // // // // // // //   },
// // // // // // // // // //   pinDotContainer: {
// // // // // // // // // //     marginHorizontal: 8,
// // // // // // // // // //   },
// // // // // // // // // //   pinDot: {
// // // // // // // // // //     width: 16,
// // // // // // // // // //     height: 16,
// // // // // // // // // //     borderRadius: 8,
// // // // // // // // // //     borderWidth: 2,
// // // // // // // // // //     borderColor: colors.border,
// // // // // // // // // //     backgroundColor: colors.white,
// // // // // // // // // //   },
// // // // // // // // // //   pinDotFilled: {
// // // // // // // // // //     backgroundColor: colors.primary,
// // // // // // // // // //     borderColor: colors.primary,
// // // // // // // // // //   },
// // // // // // // // // //   pinKeyboard: {
// // // // // // // // // //     flexDirection: 'row',
// // // // // // // // // //     flexWrap: 'wrap',
// // // // // // // // // //     justifyContent: 'center',
// // // // // // // // // //     marginBottom: 16,
// // // // // // // // // //   },
// // // // // // // // // //   pinKey: {
// // // // // // // // // //     width: '30%',
// // // // // // // // // //     aspectRatio: 1.2,
// // // // // // // // // //     justifyContent: 'center',
// // // // // // // // // //     alignItems: 'center',
// // // // // // // // // //     margin: '1.5%',
// // // // // // // // // //     borderRadius: 12,
// // // // // // // // // //     backgroundColor: colors.lightGray,
// // // // // // // // // //   },
// // // // // // // // // //   pinKeyText: {
// // // // // // // // // //     fontSize: 22,
// // // // // // // // // //     fontWeight: '500',
// // // // // // // // // //     color: colors.text,
// // // // // // // // // //   },
// // // // // // // // // //   pinConfirmButton: {
// // // // // // // // // //     backgroundColor: colors.primary,
// // // // // // // // // //     paddingVertical: 14,
// // // // // // // // // //     borderRadius: 12,
// // // // // // // // // //     alignItems: 'center',
// // // // // // // // // //     marginBottom: 8,
// // // // // // // // // //   },
// // // // // // // // // //   pinConfirmButtonDisabled: {
// // // // // // // // // //     backgroundColor: colors.gray,
// // // // // // // // // //   },
// // // // // // // // // //   pinConfirmButtonText: {
// // // // // // // // // //     color: colors.white,
// // // // // // // // // //     fontSize: 16,
// // // // // // // // // //     fontWeight: '600',
// // // // // // // // // //   },
// // // // // // // // // //   pinCancelButton: {
// // // // // // // // // //     paddingVertical: 10,
// // // // // // // // // //     alignItems: 'center',
// // // // // // // // // //   },
// // // // // // // // // //   pinCancelButtonText: {
// // // // // // // // // //     color: colors.textLight,
// // // // // // // // // //     fontSize: 14,
// // // // // // // // // //   },
// // // // // // // // // //   // Card Modal
// // // // // // // // // //   cardModalBody: {
// // // // // // // // // //     marginTop: 8,
// // // // // // // // // //   },
// // // // // // // // // //   cardPreview: {
// // // // // // // // // //     alignItems: 'center',
// // // // // // // // // //     paddingVertical: 20,
// // // // // // // // // //     backgroundColor: '#f8f9fa',
// // // // // // // // // //     borderRadius: 12,
// // // // // // // // // //     marginBottom: 16,
// // // // // // // // // //   },
// // // // // // // // // //   cardPreviewText: {
// // // // // // // // // //     fontSize: 14,
// // // // // // // // // //     color: colors.textLight,
// // // // // // // // // //     marginTop: 8,
// // // // // // // // // //   },
// // // // // // // // // //   inputContainer: {
// // // // // // // // // //     marginBottom: 12,
// // // // // // // // // //   },
// // // // // // // // // //   inputLabel: {
// // // // // // // // // //     fontSize: 14,
// // // // // // // // // //     fontWeight: '500',
// // // // // // // // // //     color: colors.text,
// // // // // // // // // //     marginBottom: 4,
// // // // // // // // // //   },
// // // // // // // // // //   input: {
// // // // // // // // // //     borderWidth: 1,
// // // // // // // // // //     borderColor: colors.border,
// // // // // // // // // //     borderRadius: 8,
// // // // // // // // // //     paddingHorizontal: 12,
// // // // // // // // // //     paddingVertical: 10,
// // // // // // // // // //     fontSize: 14,
// // // // // // // // // //     color: colors.text,
// // // // // // // // // //     backgroundColor: colors.white,
// // // // // // // // // //   },
// // // // // // // // // //   rowInputs: {
// // // // // // // // // //     flexDirection: 'row',
// // // // // // // // // //     justifyContent: 'space-between',
// // // // // // // // // //   },
// // // // // // // // // //   halfInput: {
// // // // // // // // // //     flex: 1,
// // // // // // // // // //     marginRight: 8,
// // // // // // // // // //   },
// // // // // // // // // //   payNowButton: {
// // // // // // // // // //     backgroundColor: colors.primary,
// // // // // // // // // //     borderRadius: 12,
// // // // // // // // // //     height: 50,
// // // // // // // // // //     justifyContent: 'center',
// // // // // // // // // //     alignItems: 'center',
// // // // // // // // // //     marginTop: 8,
// // // // // // // // // //   },
// // // // // // // // // //   payNowButtonText: {
// // // // // // // // // //     color: colors.white,
// // // // // // // // // //     fontSize: 16,
// // // // // // // // // //     fontWeight: '600',
// // // // // // // // // //   },
// // // // // // // // // //   // Net Banking Modal
// // // // // // // // // //   banksContainer: {
// // // // // // // // // //     marginTop: 12,
// // // // // // // // // //   },
// // // // // // // // // //   bankItem: {
// // // // // // // // // //     flexDirection: 'row',
// // // // // // // // // //     alignItems: 'center',
// // // // // // // // // //     paddingVertical: 14,
// // // // // // // // // //     borderBottomWidth: 1,
// // // // // // // // // //     borderBottomColor: colors.border,
// // // // // // // // // //   },
// // // // // // // // // //   bankIcon: {
// // // // // // // // // //     width: 44,
// // // // // // // // // //     height: 44,
// // // // // // // // // //     borderRadius: 22,
// // // // // // // // // //     backgroundColor: colors.lightGray,
// // // // // // // // // //     justifyContent: 'center',
// // // // // // // // // //     alignItems: 'center',
// // // // // // // // // //     marginRight: 12,
// // // // // // // // // //   },
// // // // // // // // // //   bankEmoji: {
// // // // // // // // // //     fontSize: 20,
// // // // // // // // // //   },
// // // // // // // // // //   bankInfo: {
// // // // // // // // // //     flex: 1,
// // // // // // // // // //   },
// // // // // // // // // //   bankName: {
// // // // // // // // // //     fontSize: 14,
// // // // // // // // // //     fontWeight: '500',
// // // // // // // // // //     color: colors.text,
// // // // // // // // // //   },
// // // // // // // // // //   bankDesc: {
// // // // // // // // // //     fontSize: 12,
// // // // // // // // // //     color: colors.textLight,
// // // // // // // // // //     marginTop: 1,
// // // // // // // // // //   },
// // // // // // // // // //   // Wallet Modal
// // // // // // // // // //   walletModalBody: {
// // // // // // // // // //     marginTop: 8,
// // // // // // // // // //   },
// // // // // // // // // //   walletBalanceContainer: {
// // // // // // // // // //     alignItems: 'center',
// // // // // // // // // //     paddingVertical: 20,
// // // // // // // // // //     backgroundColor: '#f8f9fa',
// // // // // // // // // //     borderRadius: 12,
// // // // // // // // // //     marginBottom: 16,
// // // // // // // // // //   },
// // // // // // // // // //   walletBalanceTitle: {
// // // // // // // // // //     fontSize: 14,
// // // // // // // // // //     color: colors.textLight,
// // // // // // // // // //     marginTop: 8,
// // // // // // // // // //   },
// // // // // // // // // //   walletBalanceAmount: {
// // // // // // // // // //     fontSize: 28,
// // // // // // // // // //     fontWeight: '700',
// // // // // // // // // //     color: colors.primary,
// // // // // // // // // //     marginTop: 4,
// // // // // // // // // //   },
// // // // // // // // // //   walletInfoContainer: {
// // // // // // // // // //     backgroundColor: '#f8f9fa',
// // // // // // // // // //     borderRadius: 12,
// // // // // // // // // //     padding: 16,
// // // // // // // // // //     marginBottom: 16,
// // // // // // // // // //   },
// // // // // // // // // //   walletInfoRow: {
// // // // // // // // // //     flexDirection: 'row',
// // // // // // // // // //     justifyContent: 'space-between',
// // // // // // // // // //     paddingVertical: 4,
// // // // // // // // // //   },
// // // // // // // // // //   walletInfoLabel: {
// // // // // // // // // //     fontSize: 14,
// // // // // // // // // //     color: colors.textLight,
// // // // // // // // // //   },
// // // // // // // // // //   walletInfoValue: {
// // // // // // // // // //     fontSize: 14,
// // // // // // // // // //     fontWeight: '500',
// // // // // // // // // //     color: colors.text,
// // // // // // // // // //   },
// // // // // // // // // //   walletPayButton: {
// // // // // // // // // //     backgroundColor: colors.primary,
// // // // // // // // // //     borderRadius: 12,
// // // // // // // // // //     height: 50,
// // // // // // // // // //     justifyContent: 'center',
// // // // // // // // // //     alignItems: 'center',
// // // // // // // // // //   },
// // // // // // // // // //   walletPayButtonDisabled: {
// // // // // // // // // //     backgroundColor: colors.gray,
// // // // // // // // // //   },
// // // // // // // // // //   walletPayButtonText: {
// // // // // // // // // //     color: colors.white,
// // // // // // // // // //     fontSize: 16,
// // // // // // // // // //     fontWeight: '600',
// // // // // // // // // //   },
// // // // // // // // // //   // Loading Overlay
// // // // // // // // // //   loadingOverlay: {
// // // // // // // // // //     position: 'absolute',
// // // // // // // // // //     top: 0,
// // // // // // // // // //     left: 0,
// // // // // // // // // //     right: 0,
// // // // // // // // // //     bottom: 0,
// // // // // // // // // //     backgroundColor: 'rgba(0,0,0,0.7)',
// // // // // // // // // //     justifyContent: 'center',
// // // // // // // // // //     alignItems: 'center',
// // // // // // // // // //   },
// // // // // // // // // //   loadingContainer: {
// // // // // // // // // //     backgroundColor: colors.white,
// // // // // // // // // //     padding: 30,
// // // // // // // // // //     borderRadius: 16,
// // // // // // // // // //     alignItems: 'center',
// // // // // // // // // //     minWidth: 200,
// // // // // // // // // //   },
// // // // // // // // // //   loadingText: {
// // // // // // // // // //     fontSize: 16,
// // // // // // // // // //     fontWeight: '600',
// // // // // // // // // //     color: colors.text,
// // // // // // // // // //     marginTop: 12,
// // // // // // // // // //   },
// // // // // // // // // //   loadingSubText: {
// // // // // // // // // //     fontSize: 12,
// // // // // // // // // //     color: colors.textLight,
// // // // // // // // // //     marginTop: 4,
// // // // // // // // // //   },
// // // // // // // // // // });
// // // // // // // // // import React, { useState } from 'react';
// // // // // // // // // import {
// // // // // // // // //   View,
// // // // // // // // //   Text,
// // // // // // // // //   ScrollView,
// // // // // // // // //   TouchableOpacity,
// // // // // // // // //   StyleSheet,
// // // // // // // // //   TextInput,
// // // // // // // // //   Alert,
// // // // // // // // //   Modal,
// // // // // // // // //   ActivityIndicator,
// // // // // // // // // } from 'react-native';
// // // // // // // // // import * as Haptics from 'expo-haptics';
// // // // // // // // // import Icon from 'react-native-vector-icons/Ionicons';
// // // // // // // // // import { colors } from '../../constants/colors';

// // // // // // // // // interface PaymentScreenProps {
// // // // // // // // //   navigation: any;
// // // // // // // // //   route: any;
// // // // // // // // // }

// // // // // // // // // export default function PaymentScreen({ route, navigation }: PaymentScreenProps) {
// // // // // // // // //   const { totalAmount } = route.params || { totalAmount: 461 };
// // // // // // // // //   const [selectedMethod, setSelectedMethod] = useState<string>('');
// // // // // // // // //   const [showUPIModal, setShowUPIModal] = useState<boolean>(false);
// // // // // // // // //   const [selectedUPIApp, setSelectedUPIApp] = useState<string>('');
// // // // // // // // //   const [showUPIPinModal, setShowUPIPinModal] = useState<boolean>(false);
// // // // // // // // //   const [upiPin, setUpiPin] = useState<string>('');
// // // // // // // // //   const [showCardModal, setShowCardModal] = useState<boolean>(false);
// // // // // // // // //   const [showNetBankingModal, setShowNetBankingModal] = useState<boolean>(false);
// // // // // // // // //   const [showWalletModal, setShowWalletModal] = useState<boolean>(false);
// // // // // // // // //   const [loading, setLoading] = useState<boolean>(false);
// // // // // // // // //   const [paymentSuccess, setPaymentSuccess] = useState<boolean>(false);
// // // // // // // // //   const [upiTransactionId, setUpiTransactionId] = useState<string>('');
  
// // // // // // // // //   // Card Details
// // // // // // // // //   const [cardNumber, setCardNumber] = useState<string>('');
// // // // // // // // //   const [expiryDate, setExpiryDate] = useState<string>('');
// // // // // // // // //   const [cvv, setCvv] = useState<string>('');
// // // // // // // // //   const [cardHolder, setCardHolder] = useState<string>('');

// // // // // // // // //   // Wallet
// // // // // // // // //   const walletBalance = 2500;

// // // // // // // // //   // Net Banking Banks
// // // // // // // // //   const banks = [
// // // // // // // // //     { id: 'sbi', name: 'State Bank of India', icon: '🏦', color: '#2E6B98' },
// // // // // // // // //     { id: 'hdfc', name: 'HDFC Bank', icon: '🏛️', color: '#004F8C' },
// // // // // // // // //     { id: 'icici', name: 'ICICI Bank', icon: '🏛️', color: '#F58A1E' },
// // // // // // // // //     { id: 'axis', name: 'Axis Bank', icon: '🏦', color: '#8B1A2B' },
// // // // // // // // //     { id: 'kotak', name: 'Kotak Mahindra Bank', icon: '🏦', color: '#003F6C' },
// // // // // // // // //     { id: 'yes', name: 'Yes Bank', icon: '🏛️', color: '#1B4F7A' },
// // // // // // // // //     { id: 'pnb', name: 'Punjab National Bank', icon: '🏦', color: '#008C45' },
// // // // // // // // //     { id: 'bob', name: 'Bank of Baroda', icon: '🏛️', color: '#0F4C81' },
// // // // // // // // //   ];

// // // // // // // // //   // UPI Apps
// // // // // // // // //   const upiApps = [
// // // // // // // // //     { id: 'gpay', name: 'Google Pay', emoji: '🟢', color: '#4285F4' },
// // // // // // // // //     { id: 'phonepe', name: 'PhonePe', emoji: '🟣', color: '#5F259F' },
// // // // // // // // //     { id: 'paytm', name: 'Paytm', emoji: '🔵', color: '#00BAF2' },
// // // // // // // // //     { id: 'amazonpay', name: 'Amazon Pay', emoji: '🟠', color: '#FF9900' },
// // // // // // // // //     { id: 'bhim', name: 'BHIM UPI', emoji: '🔷', color: '#0084B4' },
// // // // // // // // //   ];

// // // // // // // // //   const paymentMethods: { id: string; name: string; icon: string; desc: string }[] = [
// // // // // // // // //     { id: 'card', name: 'Credit/Debit Card', icon: 'card-outline', desc: 'Pay with card' },
// // // // // // // // //     { id: 'upi', name: 'UPI', icon: 'phone-portrait-outline', desc: 'Google Pay, PhonePe, Paytm' },
// // // // // // // // //     { id: 'netbanking', name: 'Net Banking', icon: 'business-outline', desc: 'All major banks' },
// // // // // // // // //     { id: 'wallet', name: 'Wallet', icon: 'wallet-outline', desc: `Balance: ₹${walletBalance}` },
// // // // // // // // //     { id: 'cash', name: 'Cash on Delivery', icon: 'cash-outline', desc: 'Pay when you receive' },
// // // // // // // // //   ];

// // // // // // // // //   const handleSelectMethod = (methodId: string) => {
// // // // // // // // //     Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
// // // // // // // // //     setSelectedMethod(methodId);
    
// // // // // // // // //     switch (methodId) {
// // // // // // // // //       case 'upi':
// // // // // // // // //         setShowUPIModal(true);
// // // // // // // // //         break;
// // // // // // // // //       case 'card':
// // // // // // // // //         setShowCardModal(true);
// // // // // // // // //         break;
// // // // // // // // //       case 'netbanking':
// // // // // // // // //         setShowNetBankingModal(true);
// // // // // // // // //         break;
// // // // // // // // //       case 'wallet':
// // // // // // // // //         setShowWalletModal(true);
// // // // // // // // //         break;
// // // // // // // // //       case 'cash':
// // // // // // // // //         handleCashOnDelivery();
// // // // // // // // //         break;
// // // // // // // // //       default:
// // // // // // // // //         break;
// // // // // // // // //     }
// // // // // // // // //   };

// // // // // // // // //   // ============ UPI FLOW ============
// // // // // // // // //   const handleUPISelection = (app: any) => {
// // // // // // // // //     setSelectedUPIApp(app.name);
// // // // // // // // //     setShowUPIModal(false);
// // // // // // // // //     setTimeout(() => {
// // // // // // // // //       setShowUPIPinModal(true);
// // // // // // // // //     }, 300);
// // // // // // // // //   };

// // // // // // // // //   const handleUPIPinSubmit = () => {
// // // // // // // // //     if (upiPin.length !== 4) {
// // // // // // // // //       Alert.alert('Error', 'Please enter a valid 4-digit UPI PIN');
// // // // // // // // //       return;
// // // // // // // // //     }

// // // // // // // // //     Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
// // // // // // // // //     setShowUPIPinModal(false);
// // // // // // // // //     setLoading(true);
// // // // // // // // //     setUpiPin('');
    
// // // // // // // // //     setTimeout(() => {
// // // // // // // // //       setLoading(false);
// // // // // // // // //       setPaymentSuccess(true);
// // // // // // // // //       const transactionId = 'UPI' + Date.now().toString().slice(-10);
// // // // // // // // //       setUpiTransactionId(transactionId);
      
// // // // // // // // //       Alert.alert(
// // // // // // // // //         '✅ Payment Successful!',
// // // // // // // // //         `₹${totalAmount} has been sent via ${selectedUPIApp || 'UPI'}\n\nTransaction ID: ${transactionId}\n\nPayment Method: UPI (${selectedUPIApp})`,
// // // // // // // // //         [
// // // // // // // // //           {
// // // // // // // // //             text: 'Continue',
// // // // // // // // //             onPress: () => {
// // // // // // // // //               setPaymentSuccess(false);
// // // // // // // // //               navigation.navigate('OrderTracking');
// // // // // // // // //             }
// // // // // // // // //           }
// // // // // // // // //         ]
// // // // // // // // //       );
// // // // // // // // //     }, 2000);
// // // // // // // // //   };

// // // // // // // // //   // ============ CARD FLOW ============
// // // // // // // // //   const handleCardPayment = () => {
// // // // // // // // //     if (!cardNumber || !expiryDate || !cvv || !cardHolder) {
// // // // // // // // //       Alert.alert('Error', 'Please fill all card details');
// // // // // // // // //       return;
// // // // // // // // //     }
// // // // // // // // //     if (cardNumber.replace(/\s/g, '').length !== 16) {
// // // // // // // // //       Alert.alert('Error', 'Please enter a valid 16-digit card number');
// // // // // // // // //       return;
// // // // // // // // //     }
// // // // // // // // //     if (cvv.length < 3) {
// // // // // // // // //       Alert.alert('Error', 'Please enter a valid CVV');
// // // // // // // // //       return;
// // // // // // // // //     }

// // // // // // // // //     Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
// // // // // // // // //     setShowCardModal(false);
// // // // // // // // //     setLoading(true);
    
// // // // // // // // //     setTimeout(() => {
// // // // // // // // //       setLoading(false);
// // // // // // // // //       setPaymentSuccess(true);
// // // // // // // // //       const transactionId = 'CARD' + Date.now().toString().slice(-10);
      
// // // // // // // // //       Alert.alert(
// // // // // // // // //         '✅ Payment Successful!',
// // // // // // // // //         `₹${totalAmount} has been charged to your card ending in ${cardNumber.slice(-4)}\n\nTransaction ID: ${transactionId}`,
// // // // // // // // //         [
// // // // // // // // //           {
// // // // // // // // //             text: 'Continue',
// // // // // // // // //             onPress: () => {
// // // // // // // // //               setPaymentSuccess(false);
// // // // // // // // //               navigation.navigate('OrderTracking');
// // // // // // // // //             }
// // // // // // // // //           }
// // // // // // // // //         ]
// // // // // // // // //       );
// // // // // // // // //     }, 2500);
// // // // // // // // //   };

// // // // // // // // //   // ============ NET BANKING FLOW ============
// // // // // // // // //   const handleNetBankingSelect = (bank: any) => {
// // // // // // // // //     setShowNetBankingModal(false);
    
// // // // // // // // //     // Show loading and process payment
// // // // // // // // //     setLoading(true);
// // // // // // // // //     setTimeout(() => {
// // // // // // // // //       setLoading(false);
// // // // // // // // //       setPaymentSuccess(true);
// // // // // // // // //       const transactionId = 'NB' + Date.now().toString().slice(-10);
      
// // // // // // // // //       Alert.alert(
// // // // // // // // //         '✅ Payment Successful!',
// // // // // // // // //         `₹${totalAmount} has been paid via ${bank.name}\n\nTransaction ID: ${transactionId}\n\nBank: ${bank.name}`,
// // // // // // // // //         [
// // // // // // // // //           {
// // // // // // // // //             text: 'Continue',
// // // // // // // // //             onPress: () => {
// // // // // // // // //               setPaymentSuccess(false);
// // // // // // // // //               navigation.navigate('OrderTracking');
// // // // // // // // //             }
// // // // // // // // //           }
// // // // // // // // //         ]
// // // // // // // // //       );
// // // // // // // // //     }, 2000);
// // // // // // // // //   };

// // // // // // // // //   // ============ WALLET FLOW ============
// // // // // // // // //   const handleWalletPayment = () => {
// // // // // // // // //     if (totalAmount > walletBalance) {
// // // // // // // // //       Alert.alert(
// // // // // // // // //         'Insufficient Balance',
// // // // // // // // //         `Wallet balance: ₹${walletBalance}\nAmount needed: ₹${totalAmount}\n\nPlease add money to your wallet or use another payment method.`,
// // // // // // // // //         [
// // // // // // // // //           { text: 'OK', onPress: () => setShowWalletModal(false) }
// // // // // // // // //         ]
// // // // // // // // //       );
// // // // // // // // //       return;
// // // // // // // // //     }

// // // // // // // // //     setShowWalletModal(false);
// // // // // // // // //     setLoading(true);
// // // // // // // // //     setTimeout(() => {
// // // // // // // // //       setLoading(false);
// // // // // // // // //       setPaymentSuccess(true);
// // // // // // // // //       const transactionId = 'WLT' + Date.now().toString().slice(-10);
      
// // // // // // // // //       Alert.alert(
// // // // // // // // //         '✅ Payment Successful!',
// // // // // // // // //         `₹${totalAmount} has been deducted from your wallet\n\nNew Balance: ₹${walletBalance - totalAmount}\nTransaction ID: ${transactionId}`,
// // // // // // // // //         [
// // // // // // // // //           {
// // // // // // // // //             text: 'Continue',
// // // // // // // // //             onPress: () => {
// // // // // // // // //               setPaymentSuccess(false);
// // // // // // // // //               navigation.navigate('OrderTracking');
// // // // // // // // //             }
// // // // // // // // //           }
// // // // // // // // //         ]
// // // // // // // // //       );
// // // // // // // // //     }, 1500);
// // // // // // // // //   };

// // // // // // // // //   // ============ CASH ON DELIVERY ============
// // // // // // // // //   const handleCashOnDelivery = () => {
// // // // // // // // //     Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    
// // // // // // // // //     Alert.alert(
// // // // // // // // //       '💳 Cash on Delivery',
// // // // // // // // //       `Order Total: ₹${totalAmount}\n\nYou will pay ₹${totalAmount} in cash when your order arrives.\n\nPlease keep the exact amount ready.`,
// // // // // // // // //       [
// // // // // // // // //         { text: 'Cancel', style: 'cancel' },
// // // // // // // // //         { 
// // // // // // // // //           text: 'Confirm COD', 
// // // // // // // // //           onPress: () => {
// // // // // // // // //             setLoading(true);
// // // // // // // // //             setTimeout(() => {
// // // // // // // // //               setLoading(false);
// // // // // // // // //               setPaymentSuccess(true);
// // // // // // // // //               const transactionId = 'COD' + Date.now().toString().slice(-10);
              
// // // // // // // // //               Alert.alert(
// // // // // // // // //                 '✅ Order Placed Successfully!',
// // // // // // // // //                 `Your order worth ₹${totalAmount} has been placed with Cash on Delivery.\n\nOrder ID: ${transactionId}`,
// // // // // // // // //                 [
// // // // // // // // //                   {
// // // // // // // // //                     text: 'Track Order',
// // // // // // // // //                     onPress: () => {
// // // // // // // // //                       setPaymentSuccess(false);
// // // // // // // // //                       navigation.navigate('OrderTracking');
// // // // // // // // //                     }
// // // // // // // // //                   }
// // // // // // // // //                 ]
// // // // // // // // //               );
// // // // // // // // //             }, 1500);
// // // // // // // // //           }
// // // // // // // // //         }
// // // // // // // // //       ]
// // // // // // // // //     );
// // // // // // // // //   };

// // // // // // // // //   const formatCardNumber = (text: string): string => {
// // // // // // // // //     const cleaned = text.replace(/\s/g, '');
// // // // // // // // //     const matches = cleaned.match(/.{1,4}/g);
// // // // // // // // //     if (matches) {
// // // // // // // // //       return matches.join(' ');
// // // // // // // // //     }
// // // // // // // // //     return text;
// // // // // // // // //   };

// // // // // // // // //   const formatExpiryDate = (text: string): string => {
// // // // // // // // //     const cleaned = text.replace(/\D/g, '');
// // // // // // // // //     if (cleaned.length >= 2) {
// // // // // // // // //       return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
// // // // // // // // //     }
// // // // // // // // //     return text;
// // // // // // // // //   };

// // // // // // // // //   return (
// // // // // // // // //     <View style={styles.container}>
// // // // // // // // //       <ScrollView showsVerticalScrollIndicator={false}>
// // // // // // // // //         {/* Header */}
// // // // // // // // //         <View style={styles.header}>
// // // // // // // // //           <TouchableOpacity onPress={() => navigation.goBack()}>
// // // // // // // // //             <Icon name="arrow-back" size={24} color={colors.text} />
// // // // // // // // //           </TouchableOpacity>
// // // // // // // // //           <Text style={styles.headerTitle}>Payment</Text>
// // // // // // // // //           <View style={{ width: 24 }} />
// // // // // // // // //         </View>

// // // // // // // // //         {/* Amount */}
// // // // // // // // //         <View style={styles.amountContainer}>
// // // // // // // // //           <Text style={styles.amountLabel}>Amount to Pay</Text>
// // // // // // // // //           <Text style={styles.amountValue}>₹{totalAmount}</Text>
// // // // // // // // //         </View>

// // // // // // // // //         {/* Payment Methods */}
// // // // // // // // //         <View style={styles.methodsContainer}>
// // // // // // // // //           <Text style={styles.sectionTitle}>Payment Methods</Text>
// // // // // // // // //           {paymentMethods.map((method) => (
// // // // // // // // //             <TouchableOpacity
// // // // // // // // //               key={method.id}
// // // // // // // // //               style={[
// // // // // // // // //                 styles.methodItem,
// // // // // // // // //                 selectedMethod === method.id && styles.selectedMethod,
// // // // // // // // //               ]}
// // // // // // // // //               onPress={() => handleSelectMethod(method.id)}
// // // // // // // // //             >
// // // // // // // // //               <View style={styles.methodLeft}>
// // // // // // // // //                 <View style={[styles.methodIcon, selectedMethod === method.id && styles.selectedMethodIcon]}>
// // // // // // // // //                   <Icon name={method.icon} size={22} color={selectedMethod === method.id ? colors.white : colors.text} />
// // // // // // // // //                 </View>
// // // // // // // // //                 <View style={styles.methodInfo}>
// // // // // // // // //                   <Text style={[
// // // // // // // // //                     styles.methodName,
// // // // // // // // //                     selectedMethod === method.id && styles.selectedMethodText,
// // // // // // // // //                   ]}>
// // // // // // // // //                     {method.name}
// // // // // // // // //                   </Text>
// // // // // // // // //                   <Text style={styles.methodDesc}>{method.desc}</Text>
// // // // // // // // //                 </View>
// // // // // // // // //               </View>
// // // // // // // // //               {selectedMethod === method.id && (
// // // // // // // // //                 <Icon name="checkmark-circle" size={24} color={colors.primary} />
// // // // // // // // //               )}
// // // // // // // // //             </TouchableOpacity>
// // // // // // // // //           ))}
// // // // // // // // //         </View>
// // // // // // // // //       </ScrollView>

// // // // // // // // //       {/* ============ UPI MODAL ============ */}
// // // // // // // // //       <Modal
// // // // // // // // //         visible={showUPIModal}
// // // // // // // // //         transparent={true}
// // // // // // // // //         animationType="slide"
// // // // // // // // //         onRequestClose={() => setShowUPIModal(false)}
// // // // // // // // //       >
// // // // // // // // //         <View style={styles.modalOverlay}>
// // // // // // // // //           <View style={styles.modalContainer}>
// // // // // // // // //             <View style={styles.modalHeader}>
// // // // // // // // //               <Text style={styles.modalTitle}>Select UPI App</Text>
// // // // // // // // //               <TouchableOpacity onPress={() => setShowUPIModal(false)}>
// // // // // // // // //                 <Icon name="close" size={24} color={colors.text} />
// // // // // // // // //               </TouchableOpacity>
// // // // // // // // //             </View>

// // // // // // // // //             <View style={styles.upiAppsContainer}>
// // // // // // // // //               {upiApps.map((app) => (
// // // // // // // // //                 <TouchableOpacity
// // // // // // // // //                   key={app.id}
// // // // // // // // //                   style={styles.upiAppItem}
// // // // // // // // //                   onPress={() => handleUPISelection(app)}
// // // // // // // // //                 >
// // // // // // // // //                   <View style={[styles.upiAppIcon, { backgroundColor: app.color + '20' }]}>
// // // // // // // // //                     <Text style={styles.upiAppEmoji}>{app.emoji}</Text>
// // // // // // // // //                   </View>
// // // // // // // // //                   <View style={styles.upiAppInfo}>
// // // // // // // // //                     <Text style={styles.upiAppName}>{app.name}</Text>
// // // // // // // // //                     <Text style={styles.upiAppDesc}>UPI Payment</Text>
// // // // // // // // //                   </View>
// // // // // // // // //                   <Icon name="chevron-forward" size={20} color={colors.gray} />
// // // // // // // // //                 </TouchableOpacity>
// // // // // // // // //               ))}
// // // // // // // // //             </View>

// // // // // // // // //             <TouchableOpacity 
// // // // // // // // //               style={styles.enterUPIButton}
// // // // // // // // //               onPress={() => {
// // // // // // // // //                 setShowUPIModal(false);
// // // // // // // // //                 setSelectedUPIApp('Manual UPI');
// // // // // // // // //                 setTimeout(() => {
// // // // // // // // //                   setShowUPIPinModal(true);
// // // // // // // // //                 }, 300);
// // // // // // // // //               }}
// // // // // // // // //             >
// // // // // // // // //               <Text style={styles.enterUPIButtonText}>Enter UPI ID Manually</Text>
// // // // // // // // //             </TouchableOpacity>
// // // // // // // // //           </View>
// // // // // // // // //         </View>
// // // // // // // // //       </Modal>

// // // // // // // // //       {/* ============ UPI PIN MODAL ============ */}
// // // // // // // // //       <Modal
// // // // // // // // //         visible={showUPIPinModal}
// // // // // // // // //         transparent={true}
// // // // // // // // //         animationType="fade"
// // // // // // // // //         onRequestClose={() => {
// // // // // // // // //           setShowUPIPinModal(false);
// // // // // // // // //           setUpiPin('');
// // // // // // // // //         }}
// // // // // // // // //       >
// // // // // // // // //         <View style={styles.pinModalOverlay}>
// // // // // // // // //           <View style={styles.pinModalContainer}>
// // // // // // // // //             <View style={styles.pinModalHeader}>
// // // // // // // // //               <Text style={styles.pinModalTitle}>
// // // // // // // // //                 {selectedUPIApp || 'UPI'} PIN
// // // // // // // // //               </Text>
// // // // // // // // //               <Text style={styles.pinModalSubtitle}>
// // // // // // // // //                 Enter your 4-digit UPI PIN to confirm payment
// // // // // // // // //               </Text>
// // // // // // // // //             </View>

// // // // // // // // //             <View style={styles.pinDisplayContainer}>
// // // // // // // // //               <View style={styles.pinDisplay}>
// // // // // // // // //                 {[0, 1, 2, 3].map((index) => (
// // // // // // // // //                   <View key={index} style={styles.pinDotContainer}>
// // // // // // // // //                     <View style={[
// // // // // // // // //                       styles.pinDot,
// // // // // // // // //                       upiPin.length > index && styles.pinDotFilled,
// // // // // // // // //                     ]} />
// // // // // // // // //                   </View>
// // // // // // // // //                 ))}
// // // // // // // // //               </View>
// // // // // // // // //             </View>

// // // // // // // // //             <View style={styles.pinKeyboard}>
// // // // // // // // //               {[1, 2, 3, 4, 5, 6, 7, 8, 9, 'clear', 0, 'delete'].map((key) => (
// // // // // // // // //                 <TouchableOpacity
// // // // // // // // //                   key={key.toString()}
// // // // // // // // //                   style={styles.pinKey}
// // // // // // // // //                   onPress={() => {
// // // // // // // // //                     if (key === 'clear') {
// // // // // // // // //                       setUpiPin('');
// // // // // // // // //                     } else if (key === 'delete') {
// // // // // // // // //                       setUpiPin(upiPin.slice(0, -1));
// // // // // // // // //                     } else if (upiPin.length < 4) {
// // // // // // // // //                       setUpiPin(upiPin + key.toString());
// // // // // // // // //                     }
// // // // // // // // //                   }}
// // // // // // // // //                 >
// // // // // // // // //                   <Text style={styles.pinKeyText}>
// // // // // // // // //                     {key === 'clear' ? 'Clear' : key === 'delete' ? '⌫' : key}
// // // // // // // // //                   </Text>
// // // // // // // // //                 </TouchableOpacity>
// // // // // // // // //               ))}
// // // // // // // // //             </View>

// // // // // // // // //             <TouchableOpacity
// // // // // // // // //               style={[styles.pinConfirmButton, upiPin.length !== 4 && styles.pinConfirmButtonDisabled]}
// // // // // // // // //               onPress={handleUPIPinSubmit}
// // // // // // // // //               disabled={upiPin.length !== 4}
// // // // // // // // //             >
// // // // // // // // //               <Text style={styles.pinConfirmButtonText}>
// // // // // // // // //                 Pay ₹{totalAmount}
// // // // // // // // //               </Text>
// // // // // // // // //             </TouchableOpacity>

// // // // // // // // //             <TouchableOpacity
// // // // // // // // //               style={styles.pinCancelButton}
// // // // // // // // //               onPress={() => {
// // // // // // // // //                 setShowUPIPinModal(false);
// // // // // // // // //                 setUpiPin('');
// // // // // // // // //               }}
// // // // // // // // //             >
// // // // // // // // //               <Text style={styles.pinCancelButtonText}>Cancel</Text>
// // // // // // // // //             </TouchableOpacity>
// // // // // // // // //           </View>
// // // // // // // // //         </View>
// // // // // // // // //       </Modal>

// // // // // // // // //       {/* ============ CARD MODAL ============ */}
// // // // // // // // //       <Modal
// // // // // // // // //         visible={showCardModal}
// // // // // // // // //         transparent={true}
// // // // // // // // //         animationType="slide"
// // // // // // // // //         onRequestClose={() => setShowCardModal(false)}
// // // // // // // // //       >
// // // // // // // // //         <View style={styles.modalOverlay}>
// // // // // // // // //           <View style={styles.modalContainer}>
// // // // // // // // //             <View style={styles.modalHeader}>
// // // // // // // // //               <Text style={styles.modalTitle}>Card Details</Text>
// // // // // // // // //               <TouchableOpacity onPress={() => setShowCardModal(false)}>
// // // // // // // // //                 <Icon name="close" size={24} color={colors.text} />
// // // // // // // // //               </TouchableOpacity>
// // // // // // // // //             </View>

// // // // // // // // //             <View style={styles.cardModalBody}>
// // // // // // // // //               <View style={styles.cardPreview}>
// // // // // // // // //                 <Icon name="card-outline" size={40} color={colors.primary} />
// // // // // // // // //                 <Text style={styles.cardPreviewText}>Enter Card Details</Text>
// // // // // // // // //               </View>

// // // // // // // // //               <View style={styles.inputContainer}>
// // // // // // // // //                 <Text style={styles.inputLabel}>Card Number</Text>
// // // // // // // // //                 <TextInput
// // // // // // // // //                   style={styles.input}
// // // // // // // // //                   placeholder="1234 5678 9012 3456"
// // // // // // // // //                   value={cardNumber}
// // // // // // // // //                   onChangeText={(text) => setCardNumber(formatCardNumber(text))}
// // // // // // // // //                   keyboardType="numeric"
// // // // // // // // //                   maxLength={19}
// // // // // // // // //                 />
// // // // // // // // //               </View>

// // // // // // // // //               <View style={styles.inputContainer}>
// // // // // // // // //                 <Text style={styles.inputLabel}>Card Holder Name</Text>
// // // // // // // // //                 <TextInput
// // // // // // // // //                   style={styles.input}
// // // // // // // // //                   placeholder="John Doe"
// // // // // // // // //                   value={cardHolder}
// // // // // // // // //                   onChangeText={setCardHolder}
// // // // // // // // //                 />
// // // // // // // // //               </View>

// // // // // // // // //               <View style={styles.rowInputs}>
// // // // // // // // //                 <View style={[styles.inputContainer, styles.halfInput]}>
// // // // // // // // //                   <Text style={styles.inputLabel}>Expiry Date</Text>
// // // // // // // // //                   <TextInput
// // // // // // // // //                     style={styles.input}
// // // // // // // // //                     placeholder="MM/YY"
// // // // // // // // //                     value={expiryDate}
// // // // // // // // //                     onChangeText={(text) => setExpiryDate(formatExpiryDate(text))}
// // // // // // // // //                     keyboardType="numeric"
// // // // // // // // //                     maxLength={5}
// // // // // // // // //                   />
// // // // // // // // //                 </View>
// // // // // // // // //                 <View style={[styles.inputContainer, styles.halfInput]}>
// // // // // // // // //                   <Text style={styles.inputLabel}>CVV</Text>
// // // // // // // // //                   <TextInput
// // // // // // // // //                     style={styles.input}
// // // // // // // // //                     placeholder="123"
// // // // // // // // //                     value={cvv}
// // // // // // // // //                     onChangeText={setCvv}
// // // // // // // // //                     keyboardType="numeric"
// // // // // // // // //                     maxLength={4}
// // // // // // // // //                     secureTextEntry
// // // // // // // // //                   />
// // // // // // // // //                 </View>
// // // // // // // // //               </View>

// // // // // // // // //               <TouchableOpacity 
// // // // // // // // //                 style={styles.payNowButton} 
// // // // // // // // //                 onPress={handleCardPayment}
// // // // // // // // //                 disabled={loading}
// // // // // // // // //               >
// // // // // // // // //                 {loading ? (
// // // // // // // // //                   <ActivityIndicator color="#ffffff" />
// // // // // // // // //                 ) : (
// // // // // // // // //                   <Text style={styles.payNowButtonText}>Pay ₹{totalAmount}</Text>
// // // // // // // // //                 )}
// // // // // // // // //               </TouchableOpacity>
// // // // // // // // //             </View>
// // // // // // // // //           </View>
// // // // // // // // //         </View>
// // // // // // // // //       </Modal>

// // // // // // // // //       {/* ============ NET BANKING MODAL ============ */}
// // // // // // // // //       <Modal
// // // // // // // // //         visible={showNetBankingModal}
// // // // // // // // //         transparent={true}
// // // // // // // // //         animationType="slide"
// // // // // // // // //         onRequestClose={() => setShowNetBankingModal(false)}
// // // // // // // // //       >
// // // // // // // // //         <View style={styles.modalOverlay}>
// // // // // // // // //           <View style={styles.modalContainer}>
// // // // // // // // //             <View style={styles.modalHeader}>
// // // // // // // // //               <Text style={styles.modalTitle}>Select Bank</Text>
// // // // // // // // //               <TouchableOpacity onPress={() => setShowNetBankingModal(false)}>
// // // // // // // // //                 <Icon name="close" size={24} color={colors.text} />
// // // // // // // // //               </TouchableOpacity>
// // // // // // // // //             </View>

// // // // // // // // //             <View style={styles.banksContainer}>
// // // // // // // // //               {banks.map((bank) => (
// // // // // // // // //                 <TouchableOpacity
// // // // // // // // //                   key={bank.id}
// // // // // // // // //                   style={styles.bankItem}
// // // // // // // // //                   onPress={() => handleNetBankingSelect(bank)}
// // // // // // // // //                 >
// // // // // // // // //                   <View style={[styles.bankIcon, { backgroundColor: bank.color + '20' }]}>
// // // // // // // // //                     <Text style={styles.bankEmoji}>{bank.icon}</Text>
// // // // // // // // //                   </View>
// // // // // // // // //                   <View style={styles.bankInfo}>
// // // // // // // // //                     <Text style={styles.bankName}>{bank.name}</Text>
// // // // // // // // //                     <Text style={styles.bankDesc}>Net Banking</Text>
// // // // // // // // //                   </View>
// // // // // // // // //                   <Icon name="chevron-forward" size={20} color={colors.gray} />
// // // // // // // // //                 </TouchableOpacity>
// // // // // // // // //               ))}
// // // // // // // // //             </View>
// // // // // // // // //           </View>
// // // // // // // // //         </View>
// // // // // // // // //       </Modal>

// // // // // // // // //       {/* ============ WALLET MODAL ============ */}
// // // // // // // // //       <Modal
// // // // // // // // //         visible={showWalletModal}
// // // // // // // // //         transparent={true}
// // // // // // // // //         animationType="slide"
// // // // // // // // //         onRequestClose={() => setShowWalletModal(false)}
// // // // // // // // //       >
// // // // // // // // //         <View style={styles.modalOverlay}>
// // // // // // // // //           <View style={styles.modalContainer}>
// // // // // // // // //             <View style={styles.modalHeader}>
// // // // // // // // //               <Text style={styles.modalTitle}>Pay with Wallet</Text>
// // // // // // // // //               <TouchableOpacity onPress={() => setShowWalletModal(false)}>
// // // // // // // // //                 <Icon name="close" size={24} color={colors.text} />
// // // // // // // // //               </TouchableOpacity>
// // // // // // // // //             </View>

// // // // // // // // //             <View style={styles.walletModalBody}>
// // // // // // // // //               <View style={styles.walletBalanceContainer}>
// // // // // // // // //                 <Icon name="wallet-outline" size={40} color={colors.primary} />
// // // // // // // // //                 <Text style={styles.walletBalanceTitle}>Wallet Balance</Text>
// // // // // // // // //                 <Text style={styles.walletBalanceAmount}>₹{walletBalance}</Text>
// // // // // // // // //               </View>

// // // // // // // // //               <View style={styles.walletInfoContainer}>
// // // // // // // // //                 <View style={styles.walletInfoRow}>
// // // // // // // // //                   <Text style={styles.walletInfoLabel}>Order Total</Text>
// // // // // // // // //                   <Text style={styles.walletInfoValue}>₹{totalAmount}</Text>
// // // // // // // // //                 </View>
// // // // // // // // //                 <View style={styles.walletInfoRow}>
// // // // // // // // //                   <Text style={styles.walletInfoLabel}>Balance After Payment</Text>
// // // // // // // // //                   <Text style={[styles.walletInfoValue, { color: totalAmount <= walletBalance ? colors.success : colors.danger }]}>
// // // // // // // // //                     ₹{walletBalance - totalAmount}
// // // // // // // // //                   </Text>
// // // // // // // // //                 </View>
// // // // // // // // //               </View>

// // // // // // // // //               <TouchableOpacity 
// // // // // // // // //                 style={[styles.walletPayButton, totalAmount > walletBalance && styles.walletPayButtonDisabled]}
// // // // // // // // //                 onPress={handleWalletPayment}
// // // // // // // // //                 disabled={loading || totalAmount > walletBalance}
// // // // // // // // //               >
// // // // // // // // //                 {loading ? (
// // // // // // // // //                   <ActivityIndicator color="#ffffff" />
// // // // // // // // //                 ) : (
// // // // // // // // //                   <Text style={styles.walletPayButtonText}>
// // // // // // // // //                     {totalAmount > walletBalance ? 'Insufficient Balance' : `Pay ₹${totalAmount}`}
// // // // // // // // //                   </Text>
// // // // // // // // //                 )}
// // // // // // // // //               </TouchableOpacity>
// // // // // // // // //             </View>
// // // // // // // // //           </View>
// // // // // // // // //         </View>
// // // // // // // // //       </Modal>

// // // // // // // // //       {/* Loading Overlay */}
// // // // // // // // //       {loading && (
// // // // // // // // //         <View style={styles.loadingOverlay}>
// // // // // // // // //           <View style={styles.loadingContainer}>
// // // // // // // // //             <ActivityIndicator size="large" color={colors.primary} />
// // // // // // // // //             <Text style={styles.loadingText}>Processing Payment...</Text>
// // // // // // // // //             <Text style={styles.loadingSubText}>Please do not close the app</Text>
// // // // // // // // //           </View>
// // // // // // // // //         </View>
// // // // // // // // //       )}
// // // // // // // // //     </View>
// // // // // // // // //   );
// // // // // // // // // }

// // // // // // // // // const styles = StyleSheet.create({
// // // // // // // // //   container: {
// // // // // // // // //     flex: 1,
// // // // // // // // //     backgroundColor: colors.white,
// // // // // // // // //   },
// // // // // // // // //   header: {
// // // // // // // // //     flexDirection: 'row',
// // // // // // // // //     alignItems: 'center',
// // // // // // // // //     justifyContent: 'space-between',
// // // // // // // // //     padding: 16,
// // // // // // // // //     paddingTop: 40,
// // // // // // // // //     borderBottomWidth: 1,
// // // // // // // // //     borderBottomColor: colors.border,
// // // // // // // // //   },
// // // // // // // // //   headerTitle: {
// // // // // // // // //     fontSize: 18,
// // // // // // // // //     fontWeight: '600',
// // // // // // // // //     color: colors.text,
// // // // // // // // //   },
// // // // // // // // //   amountContainer: {
// // // // // // // // //     backgroundColor: colors.primary,
// // // // // // // // //     padding: 20,
// // // // // // // // //     margin: 16,
// // // // // // // // //     borderRadius: 12,
// // // // // // // // //     alignItems: 'center',
// // // // // // // // //   },
// // // // // // // // //   amountLabel: {
// // // // // // // // //     fontSize: 14,
// // // // // // // // //     color: colors.white,
// // // // // // // // //     opacity: 0.8,
// // // // // // // // //   },
// // // // // // // // //   amountValue: {
// // // // // // // // //     fontSize: 28,
// // // // // // // // //     fontWeight: '700',
// // // // // // // // //     color: colors.white,
// // // // // // // // //     marginTop: 4,
// // // // // // // // //   },
// // // // // // // // //   methodsContainer: {
// // // // // // // // //     paddingHorizontal: 16,
// // // // // // // // //     paddingBottom: 20,
// // // // // // // // //   },
// // // // // // // // //   sectionTitle: {
// // // // // // // // //     fontSize: 16,
// // // // // // // // //     fontWeight: '600',
// // // // // // // // //     color: colors.text,
// // // // // // // // //     marginBottom: 12,
// // // // // // // // //   },
// // // // // // // // //   methodItem: {
// // // // // // // // //     flexDirection: 'row',
// // // // // // // // //     justifyContent: 'space-between',
// // // // // // // // //     alignItems: 'center',
// // // // // // // // //     padding: 14,
// // // // // // // // //     borderWidth: 1,
// // // // // // // // //     borderColor: colors.border,
// // // // // // // // //     borderRadius: 10,
// // // // // // // // //     marginBottom: 8,
// // // // // // // // //   },
// // // // // // // // //   selectedMethod: {
// // // // // // // // //     borderColor: colors.primary,
// // // // // // // // //     backgroundColor: '#fff5ec',
// // // // // // // // //   },
// // // // // // // // //   methodLeft: {
// // // // // // // // //     flexDirection: 'row',
// // // // // // // // //     alignItems: 'center',
// // // // // // // // //     flex: 1,
// // // // // // // // //   },
// // // // // // // // //   methodIcon: {
// // // // // // // // //     width: 36,
// // // // // // // // //     height: 36,
// // // // // // // // //     borderRadius: 18,
// // // // // // // // //     backgroundColor: colors.lightGray,
// // // // // // // // //     justifyContent: 'center',
// // // // // // // // //     alignItems: 'center',
// // // // // // // // //     marginRight: 12,
// // // // // // // // //   },
// // // // // // // // //   selectedMethodIcon: {
// // // // // // // // //     backgroundColor: colors.primary,
// // // // // // // // //   },
// // // // // // // // //   methodInfo: {
// // // // // // // // //     flex: 1,
// // // // // // // // //   },
// // // // // // // // //   methodName: {
// // // // // // // // //     fontSize: 14,
// // // // // // // // //     color: colors.text,
// // // // // // // // //   },
// // // // // // // // //   selectedMethodText: {
// // // // // // // // //     color: colors.primary,
// // // // // // // // //     fontWeight: '500',
// // // // // // // // //   },
// // // // // // // // //   methodDesc: {
// // // // // // // // //     fontSize: 11,
// // // // // // // // //     color: colors.textLight,
// // // // // // // // //     marginTop: 1,
// // // // // // // // //   },
// // // // // // // // //   modalOverlay: {
// // // // // // // // //     flex: 1,
// // // // // // // // //     backgroundColor: 'rgba(0,0,0,0.5)',
// // // // // // // // //     justifyContent: 'flex-end',
// // // // // // // // //   },
// // // // // // // // //   modalContainer: {
// // // // // // // // //     backgroundColor: colors.white,
// // // // // // // // //     borderTopLeftRadius: 24,
// // // // // // // // //     borderTopRightRadius: 24,
// // // // // // // // //     paddingHorizontal: 20,
// // // // // // // // //     paddingBottom: 30,
// // // // // // // // //     maxHeight: '80%',
// // // // // // // // //   },
// // // // // // // // //   modalHeader: {
// // // // // // // // //     flexDirection: 'row',
// // // // // // // // //     justifyContent: 'space-between',
// // // // // // // // //     alignItems: 'center',
// // // // // // // // //     paddingVertical: 16,
// // // // // // // // //     borderBottomWidth: 1,
// // // // // // // // //     borderBottomColor: colors.border,
// // // // // // // // //   },
// // // // // // // // //   modalTitle: {
// // // // // // // // //     fontSize: 18,
// // // // // // // // //     fontWeight: '600',
// // // // // // // // //     color: colors.text,
// // // // // // // // //   },
// // // // // // // // //   // UPI Modal
// // // // // // // // //   upiAppsContainer: {
// // // // // // // // //     marginTop: 12,
// // // // // // // // //   },
// // // // // // // // //   upiAppItem: {
// // // // // // // // //     flexDirection: 'row',
// // // // // // // // //     alignItems: 'center',
// // // // // // // // //     paddingVertical: 14,
// // // // // // // // //     borderBottomWidth: 1,
// // // // // // // // //     borderBottomColor: colors.border,
// // // // // // // // //   },
// // // // // // // // //   upiAppIcon: {
// // // // // // // // //     width: 48,
// // // // // // // // //     height: 48,
// // // // // // // // //     borderRadius: 24,
// // // // // // // // //     justifyContent: 'center',
// // // // // // // // //     alignItems: 'center',
// // // // // // // // //     marginRight: 12,
// // // // // // // // //   },
// // // // // // // // //   upiAppEmoji: {
// // // // // // // // //     fontSize: 24,
// // // // // // // // //   },
// // // // // // // // //   upiAppInfo: {
// // // // // // // // //     flex: 1,
// // // // // // // // //   },
// // // // // // // // //   upiAppName: {
// // // // // // // // //     fontSize: 15,
// // // // // // // // //     fontWeight: '500',
// // // // // // // // //     color: colors.text,
// // // // // // // // //   },
// // // // // // // // //   upiAppDesc: {
// // // // // // // // //     fontSize: 12,
// // // // // // // // //     color: colors.textLight,
// // // // // // // // //     marginTop: 2,
// // // // // // // // //   },
// // // // // // // // //   enterUPIButton: {
// // // // // // // // //     marginTop: 16,
// // // // // // // // //     paddingVertical: 12,
// // // // // // // // //     borderWidth: 1,
// // // // // // // // //     borderColor: colors.primary,
// // // // // // // // //     borderRadius: 8,
// // // // // // // // //     alignItems: 'center',
// // // // // // // // //   },
// // // // // // // // //   enterUPIButtonText: {
// // // // // // // // //     color: colors.primary,
// // // // // // // // //     fontSize: 14,
// // // // // // // // //     fontWeight: '500',
// // // // // // // // //   },
// // // // // // // // //   // UPI PIN Modal
// // // // // // // // //   pinModalOverlay: {
// // // // // // // // //     flex: 1,
// // // // // // // // //     backgroundColor: 'rgba(0,0,0,0.7)',
// // // // // // // // //     justifyContent: 'center',
// // // // // // // // //     alignItems: 'center',
// // // // // // // // //   },
// // // // // // // // //   pinModalContainer: {
// // // // // // // // //     backgroundColor: colors.white,
// // // // // // // // //     borderRadius: 24,
// // // // // // // // //     padding: 24,
// // // // // // // // //     width: '85%',
// // // // // // // // //     maxWidth: 400,
// // // // // // // // //   },
// // // // // // // // //   pinModalHeader: {
// // // // // // // // //     alignItems: 'center',
// // // // // // // // //     marginBottom: 20,
// // // // // // // // //   },
// // // // // // // // //   pinModalTitle: {
// // // // // // // // //     fontSize: 20,
// // // // // // // // //     fontWeight: '700',
// // // // // // // // //     color: colors.text,
// // // // // // // // //   },
// // // // // // // // //   pinModalSubtitle: {
// // // // // // // // //     fontSize: 14,
// // // // // // // // //     color: colors.textLight,
// // // // // // // // //     marginTop: 4,
// // // // // // // // //   },
// // // // // // // // //   pinDisplayContainer: {
// // // // // // // // //     alignItems: 'center',
// // // // // // // // //     marginBottom: 24,
// // // // // // // // //   },
// // // // // // // // //   pinDisplay: {
// // // // // // // // //     flexDirection: 'row',
// // // // // // // // //     justifyContent: 'center',
// // // // // // // // //   },
// // // // // // // // //   pinDotContainer: {
// // // // // // // // //     marginHorizontal: 8,
// // // // // // // // //   },
// // // // // // // // //   pinDot: {
// // // // // // // // //     width: 16,
// // // // // // // // //     height: 16,
// // // // // // // // //     borderRadius: 8,
// // // // // // // // //     borderWidth: 2,
// // // // // // // // //     borderColor: colors.border,
// // // // // // // // //     backgroundColor: colors.white,
// // // // // // // // //   },
// // // // // // // // //   pinDotFilled: {
// // // // // // // // //     backgroundColor: colors.primary,
// // // // // // // // //     borderColor: colors.primary,
// // // // // // // // //   },
// // // // // // // // //   pinKeyboard: {
// // // // // // // // //     flexDirection: 'row',
// // // // // // // // //     flexWrap: 'wrap',
// // // // // // // // //     justifyContent: 'center',
// // // // // // // // //     marginBottom: 16,
// // // // // // // // //   },
// // // // // // // // //   pinKey: {
// // // // // // // // //     width: '30%',
// // // // // // // // //     aspectRatio: 1.2,
// // // // // // // // //     justifyContent: 'center',
// // // // // // // // //     alignItems: 'center',
// // // // // // // // //     margin: '1.5%',
// // // // // // // // //     borderRadius: 12,
// // // // // // // // //     backgroundColor: colors.lightGray,
// // // // // // // // //   },
// // // // // // // // //   pinKeyText: {
// // // // // // // // //     fontSize: 22,
// // // // // // // // //     fontWeight: '500',
// // // // // // // // //     color: colors.text,
// // // // // // // // //   },
// // // // // // // // //   pinConfirmButton: {
// // // // // // // // //     backgroundColor: colors.primary,
// // // // // // // // //     paddingVertical: 14,
// // // // // // // // //     borderRadius: 12,
// // // // // // // // //     alignItems: 'center',
// // // // // // // // //     marginBottom: 8,
// // // // // // // // //   },
// // // // // // // // //   pinConfirmButtonDisabled: {
// // // // // // // // //     backgroundColor: colors.gray,
// // // // // // // // //   },
// // // // // // // // //   pinConfirmButtonText: {
// // // // // // // // //     color: colors.white,
// // // // // // // // //     fontSize: 16,
// // // // // // // // //     fontWeight: '600',
// // // // // // // // //   },
// // // // // // // // //   pinCancelButton: {
// // // // // // // // //     paddingVertical: 10,
// // // // // // // // //     alignItems: 'center',
// // // // // // // // //   },
// // // // // // // // //   pinCancelButtonText: {
// // // // // // // // //     color: colors.textLight,
// // // // // // // // //     fontSize: 14,
// // // // // // // // //   },
// // // // // // // // //   // Card Modal
// // // // // // // // //   cardModalBody: {
// // // // // // // // //     marginTop: 8,
// // // // // // // // //   },
// // // // // // // // //   cardPreview: {
// // // // // // // // //     alignItems: 'center',
// // // // // // // // //     paddingVertical: 20,
// // // // // // // // //     backgroundColor: '#f8f9fa',
// // // // // // // // //     borderRadius: 12,
// // // // // // // // //     marginBottom: 16,
// // // // // // // // //   },
// // // // // // // // //   cardPreviewText: {
// // // // // // // // //     fontSize: 14,
// // // // // // // // //     color: colors.textLight,
// // // // // // // // //     marginTop: 8,
// // // // // // // // //   },
// // // // // // // // //   inputContainer: {
// // // // // // // // //     marginBottom: 12,
// // // // // // // // //   },
// // // // // // // // //   inputLabel: {
// // // // // // // // //     fontSize: 14,
// // // // // // // // //     fontWeight: '500',
// // // // // // // // //     color: colors.text,
// // // // // // // // //     marginBottom: 4,
// // // // // // // // //   },
// // // // // // // // //   input: {
// // // // // // // // //     borderWidth: 1,
// // // // // // // // //     borderColor: colors.border,
// // // // // // // // //     borderRadius: 8,
// // // // // // // // //     paddingHorizontal: 12,
// // // // // // // // //     paddingVertical: 10,
// // // // // // // // //     fontSize: 14,
// // // // // // // // //     color: colors.text,
// // // // // // // // //     backgroundColor: colors.white,
// // // // // // // // //   },
// // // // // // // // //   rowInputs: {
// // // // // // // // //     flexDirection: 'row',
// // // // // // // // //     justifyContent: 'space-between',
// // // // // // // // //   },
// // // // // // // // //   halfInput: {
// // // // // // // // //     flex: 1,
// // // // // // // // //     marginRight: 8,
// // // // // // // // //   },
// // // // // // // // //   payNowButton: {
// // // // // // // // //     backgroundColor: colors.primary,
// // // // // // // // //     borderRadius: 12,
// // // // // // // // //     height: 50,
// // // // // // // // //     justifyContent: 'center',
// // // // // // // // //     alignItems: 'center',
// // // // // // // // //     marginTop: 8,
// // // // // // // // //   },
// // // // // // // // //   payNowButtonText: {
// // // // // // // // //     color: colors.white,
// // // // // // // // //     fontSize: 16,
// // // // // // // // //     fontWeight: '600',
// // // // // // // // //   },
// // // // // // // // //   // Net Banking Modal
// // // // // // // // //   banksContainer: {
// // // // // // // // //     marginTop: 12,
// // // // // // // // //   },
// // // // // // // // //   bankItem: {
// // // // // // // // //     flexDirection: 'row',
// // // // // // // // //     alignItems: 'center',
// // // // // // // // //     paddingVertical: 14,
// // // // // // // // //     borderBottomWidth: 1,
// // // // // // // // //     borderBottomColor: colors.border,
// // // // // // // // //   },
// // // // // // // // //   bankIcon: {
// // // // // // // // //     width: 44,
// // // // // // // // //     height: 44,
// // // // // // // // //     borderRadius: 22,
// // // // // // // // //     justifyContent: 'center',
// // // // // // // // //     alignItems: 'center',
// // // // // // // // //     marginRight: 12,
// // // // // // // // //   },
// // // // // // // // //   bankEmoji: {
// // // // // // // // //     fontSize: 20,
// // // // // // // // //   },
// // // // // // // // //   bankInfo: {
// // // // // // // // //     flex: 1,
// // // // // // // // //   },
// // // // // // // // //   bankName: {
// // // // // // // // //     fontSize: 14,
// // // // // // // // //     fontWeight: '500',
// // // // // // // // //     color: colors.text,
// // // // // // // // //   },
// // // // // // // // //   bankDesc: {
// // // // // // // // //     fontSize: 12,
// // // // // // // // //     color: colors.textLight,
// // // // // // // // //     marginTop: 1,
// // // // // // // // //   },
// // // // // // // // //   // Wallet Modal
// // // // // // // // //   walletModalBody: {
// // // // // // // // //     marginTop: 8,
// // // // // // // // //   },
// // // // // // // // //   walletBalanceContainer: {
// // // // // // // // //     alignItems: 'center',
// // // // // // // // //     paddingVertical: 20,
// // // // // // // // //     backgroundColor: '#f8f9fa',
// // // // // // // // //     borderRadius: 12,
// // // // // // // // //     marginBottom: 16,
// // // // // // // // //   },
// // // // // // // // //   walletBalanceTitle: {
// // // // // // // // //     fontSize: 14,
// // // // // // // // //     color: colors.textLight,
// // // // // // // // //     marginTop: 8,
// // // // // // // // //   },
// // // // // // // // //   walletBalanceAmount: {
// // // // // // // // //     fontSize: 28,
// // // // // // // // //     fontWeight: '700',
// // // // // // // // //     color: colors.primary,
// // // // // // // // //     marginTop: 4,
// // // // // // // // //   },
// // // // // // // // //   walletInfoContainer: {
// // // // // // // // //     backgroundColor: '#f8f9fa',
// // // // // // // // //     borderRadius: 12,
// // // // // // // // //     padding: 16,
// // // // // // // // //     marginBottom: 16,
// // // // // // // // //   },
// // // // // // // // //   walletInfoRow: {
// // // // // // // // //     flexDirection: 'row',
// // // // // // // // //     justifyContent: 'space-between',
// // // // // // // // //     paddingVertical: 4,
// // // // // // // // //   },
// // // // // // // // //   walletInfoLabel: {
// // // // // // // // //     fontSize: 14,
// // // // // // // // //     color: colors.textLight,
// // // // // // // // //   },
// // // // // // // // //   walletInfoValue: {
// // // // // // // // //     fontSize: 14,
// // // // // // // // //     fontWeight: '500',
// // // // // // // // //     color: colors.text,
// // // // // // // // //   },
// // // // // // // // //   walletPayButton: {
// // // // // // // // //     backgroundColor: colors.primary,
// // // // // // // // //     borderRadius: 12,
// // // // // // // // //     height: 50,
// // // // // // // // //     justifyContent: 'center',
// // // // // // // // //     alignItems: 'center',
// // // // // // // // //   },
// // // // // // // // //   walletPayButtonDisabled: {
// // // // // // // // //     backgroundColor: colors.gray,
// // // // // // // // //   },
// // // // // // // // //   walletPayButtonText: {
// // // // // // // // //     color: colors.white,
// // // // // // // // //     fontSize: 16,
// // // // // // // // //     fontWeight: '600',
// // // // // // // // //   },
// // // // // // // // //   // Loading Overlay
// // // // // // // // //   loadingOverlay: {
// // // // // // // // //     position: 'absolute',
// // // // // // // // //     top: 0,
// // // // // // // // //     left: 0,
// // // // // // // // //     right: 0,
// // // // // // // // //     bottom: 0,
// // // // // // // // //     backgroundColor: 'rgba(0,0,0,0.7)',
// // // // // // // // //     justifyContent: 'center',
// // // // // // // // //     alignItems: 'center',
// // // // // // // // //   },
// // // // // // // // //   loadingContainer: {
// // // // // // // // //     backgroundColor: colors.white,
// // // // // // // // //     padding: 30,
// // // // // // // // //     borderRadius: 16,
// // // // // // // // //     alignItems: 'center',
// // // // // // // // //     minWidth: 200,
// // // // // // // // //   },
// // // // // // // // //   loadingText: {
// // // // // // // // //     fontSize: 16,
// // // // // // // // //     fontWeight: '600',
// // // // // // // // //     color: colors.text,
// // // // // // // // //     marginTop: 12,
// // // // // // // // //   },
// // // // // // // // //   loadingSubText: {
// // // // // // // // //     fontSize: 12,
// // // // // // // // //     color: colors.textLight,
// // // // // // // // //     marginTop: 4,
// // // // // // // // //   },
// // // // // // // // // });
// // // // // // // // import React, { useState } from 'react';
// // // // // // // // import {
// // // // // // // //   View,
// // // // // // // //   Text,
// // // // // // // //   ScrollView,
// // // // // // // //   TouchableOpacity,
// // // // // // // //   StyleSheet,
// // // // // // // //   TextInput,
// // // // // // // //   Alert,
// // // // // // // //   Modal,
// // // // // // // //   ActivityIndicator,
// // // // // // // // } from 'react-native';
// // // // // // // // import * as Haptics from 'expo-haptics';
// // // // // // // // import Icon from 'react-native-vector-icons/Ionicons';
// // // // // // // // import { colors } from '../../constants/colors';

// // // // // // // // interface PaymentScreenProps {
// // // // // // // //   navigation: any;
// // // // // // // //   route: any;
// // // // // // // // }

// // // // // // // // export default function PaymentScreen({ route, navigation }: PaymentScreenProps) {
// // // // // // // //   const { totalAmount } = route.params || { totalAmount: 461 };
// // // // // // // //   const [selectedMethod, setSelectedMethod] = useState<string>('');
// // // // // // // //   const [showUPIModal, setShowUPIModal] = useState<boolean>(false);
// // // // // // // //   const [selectedUPIApp, setSelectedUPIApp] = useState<string>('');
// // // // // // // //   const [showUPIPinModal, setShowUPIPinModal] = useState<boolean>(false);
// // // // // // // //   const [upiPin, setUpiPin] = useState<string>('');
// // // // // // // //   const [showCardModal, setShowCardModal] = useState<boolean>(false);
// // // // // // // //   const [showNetBankingModal, setShowNetBankingModal] = useState<boolean>(false);
// // // // // // // //   const [showWalletModal, setShowWalletModal] = useState<boolean>(false);
// // // // // // // //   const [loading, setLoading] = useState<boolean>(false);
// // // // // // // //   const [paymentSuccess, setPaymentSuccess] = useState<boolean>(false);
// // // // // // // //   const [upiTransactionId, setUpiTransactionId] = useState<string>('');
  
// // // // // // // //   // Card Details
// // // // // // // //   const [cardNumber, setCardNumber] = useState<string>('');
// // // // // // // //   const [expiryDate, setExpiryDate] = useState<string>('');
// // // // // // // //   const [cvv, setCvv] = useState<string>('');
// // // // // // // //   const [cardHolder, setCardHolder] = useState<string>('');

// // // // // // // //   // Wallet
// // // // // // // //   const walletBalance = 2500;

// // // // // // // //   // Net Banking Banks
// // // // // // // //   const banks = [
// // // // // // // //     { id: 'sbi', name: 'State Bank of India', icon: '🏦', color: '#2E6B98' },
// // // // // // // //     { id: 'hdfc', name: 'HDFC Bank', icon: '🏛️', color: '#004F8C' },
// // // // // // // //     { id: 'icici', name: 'ICICI Bank', icon: '🏛️', color: '#F58A1E' },
// // // // // // // //     { id: 'axis', name: 'Axis Bank', icon: '🏦', color: '#8B1A2B' },
// // // // // // // //     { id: 'kotak', name: 'Kotak Mahindra Bank', icon: '🏦', color: '#003F6C' },
// // // // // // // //     { id: 'yes', name: 'Yes Bank', icon: '🏛️', color: '#1B4F7A' },
// // // // // // // //     { id: 'pnb', name: 'Punjab National Bank', icon: '🏦', color: '#008C45' },
// // // // // // // //     { id: 'bob', name: 'Bank of Baroda', icon: '🏛️', color: '#0F4C81' },
// // // // // // // //   ];

// // // // // // // //   // UPI Apps
// // // // // // // //   const upiApps = [
// // // // // // // //     { id: 'gpay', name: 'Google Pay', emoji: '🟢', color: '#4285F4' },
// // // // // // // //     { id: 'phonepe', name: 'PhonePe', emoji: '🟣', color: '#5F259F' },
// // // // // // // //     { id: 'paytm', name: 'Paytm', emoji: '🔵', color: '#00BAF2' },
// // // // // // // //     { id: 'amazonpay', name: 'Amazon Pay', emoji: '🟠', color: '#FF9900' },
// // // // // // // //     { id: 'bhim', name: 'BHIM UPI', emoji: '🔷', color: '#0084B4' },
// // // // // // // //   ];

// // // // // // // //   const paymentMethods: { id: string; name: string; icon: string; desc: string }[] = [
// // // // // // // //     { id: 'card', name: 'Credit/Debit Card', icon: 'card-outline', desc: 'Pay with card' },
// // // // // // // //     { id: 'upi', name: 'UPI', icon: 'phone-portrait-outline', desc: 'Google Pay, PhonePe, Paytm' },
// // // // // // // //     { id: 'netbanking', name: 'Net Banking', icon: 'business-outline', desc: 'All major banks' },
// // // // // // // //     { id: 'wallet', name: 'Wallet', icon: 'wallet-outline', desc: `Balance: ₹${walletBalance}` },
// // // // // // // //     { id: 'cash', name: 'Cash on Delivery', icon: 'cash-outline', desc: 'Pay when you receive' },
// // // // // // // //   ];

// // // // // // // //   const handleSelectMethod = (methodId: string) => {
// // // // // // // //     Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
// // // // // // // //     setSelectedMethod(methodId);
    
// // // // // // // //     switch (methodId) {
// // // // // // // //       case 'upi':
// // // // // // // //         setShowUPIModal(true);
// // // // // // // //         break;
// // // // // // // //       case 'card':
// // // // // // // //         setShowCardModal(true);
// // // // // // // //         break;
// // // // // // // //       case 'netbanking':
// // // // // // // //         setShowNetBankingModal(true);
// // // // // // // //         break;
// // // // // // // //       case 'wallet':
// // // // // // // //         setShowWalletModal(true);
// // // // // // // //         break;
// // // // // // // //       case 'cash':
// // // // // // // //         handleCashOnDelivery();
// // // // // // // //         break;
// // // // // // // //       default:
// // // // // // // //         break;
// // // // // // // //     }
// // // // // // // //   };

// // // // // // // //   // ============ UPI FLOW ============
// // // // // // // //   const handleUPISelection = (app: any) => {
// // // // // // // //     setSelectedUPIApp(app.name);
// // // // // // // //     setShowUPIModal(false);
// // // // // // // //     setTimeout(() => {
// // // // // // // //       setShowUPIPinModal(true);
// // // // // // // //     }, 300);
// // // // // // // //   };

// // // // // // // //   // UPI - Navigate to OrderSuccess
// // // // // // // //   const handleUPIPinSubmit = () => {
// // // // // // // //     if (upiPin.length !== 4) {
// // // // // // // //       Alert.alert('Error', 'Please enter a valid 4-digit UPI PIN');
// // // // // // // //       return;
// // // // // // // //     }

// // // // // // // //     Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
// // // // // // // //     setShowUPIPinModal(false);
// // // // // // // //     setLoading(true);
// // // // // // // //     setUpiPin('');
    
// // // // // // // //     setTimeout(() => {
// // // // // // // //       setLoading(false);
// // // // // // // //       setPaymentSuccess(true);
// // // // // // // //       const transactionId = 'UPI' + Date.now().toString().slice(-10);
// // // // // // // //       setUpiTransactionId(transactionId);
      
// // // // // // // //       // Navigate to OrderSuccess
// // // // // // // //       navigation.replace('OrderSuccess', {
// // // // // // // //         orderId: transactionId,
// // // // // // // //         totalAmount: totalAmount,
// // // // // // // //         paymentMethod: `${selectedUPIApp || 'UPI'}`,
// // // // // // // //       });
// // // // // // // //     }, 2000);
// // // // // // // //   };

// // // // // // // //   // ============ CARD FLOW ============
// // // // // // // //   const handleCardPayment = () => {
// // // // // // // //     if (!cardNumber || !expiryDate || !cvv || !cardHolder) {
// // // // // // // //       Alert.alert('Error', 'Please fill all card details');
// // // // // // // //       return;
// // // // // // // //     }
// // // // // // // //     if (cardNumber.replace(/\s/g, '').length !== 16) {
// // // // // // // //       Alert.alert('Error', 'Please enter a valid 16-digit card number');
// // // // // // // //       return;
// // // // // // // //     }
// // // // // // // //     if (cvv.length < 3) {
// // // // // // // //       Alert.alert('Error', 'Please enter a valid CVV');
// // // // // // // //       return;
// // // // // // // //     }

// // // // // // // //     Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
// // // // // // // //     setShowCardModal(false);
// // // // // // // //     setLoading(true);
    
// // // // // // // //     setTimeout(() => {
// // // // // // // //       setLoading(false);
// // // // // // // //       setPaymentSuccess(true);
// // // // // // // //       const transactionId = 'CARD' + Date.now().toString().slice(-10);
      
// // // // // // // //       // Navigate to OrderSuccess
// // // // // // // //       navigation.replace('OrderSuccess', {
// // // // // // // //         orderId: transactionId,
// // // // // // // //         totalAmount: totalAmount,
// // // // // // // //         paymentMethod: 'Credit/Debit Card',
// // // // // // // //       });
// // // // // // // //     }, 2500);
// // // // // // // //   };

// // // // // // // //   // ============ NET BANKING FLOW ============
// // // // // // // //   const handleNetBankingSelect = (bank: any) => {
// // // // // // // //     setShowNetBankingModal(false);
    
// // // // // // // //     setLoading(true);
// // // // // // // //     setTimeout(() => {
// // // // // // // //       setLoading(false);
// // // // // // // //       setPaymentSuccess(true);
// // // // // // // //       const transactionId = 'NB' + Date.now().toString().slice(-10);
      
// // // // // // // //       // Navigate to OrderSuccess
// // // // // // // //       navigation.replace('OrderSuccess', {
// // // // // // // //         orderId: transactionId,
// // // // // // // //         totalAmount: totalAmount,
// // // // // // // //         paymentMethod: `${bank.name} (Net Banking)`,
// // // // // // // //       });
// // // // // // // //     }, 2000);
// // // // // // // //   };

// // // // // // // //   // ============ WALLET FLOW ============
// // // // // // // //   const handleWalletPayment = () => {
// // // // // // // //     if (totalAmount > walletBalance) {
// // // // // // // //       Alert.alert(
// // // // // // // //         'Insufficient Balance',
// // // // // // // //         `Wallet balance: ₹${walletBalance}\nAmount needed: ₹${totalAmount}\n\nPlease add money to your wallet or use another payment method.`,
// // // // // // // //         [
// // // // // // // //           { text: 'OK', onPress: () => setShowWalletModal(false) }
// // // // // // // //         ]
// // // // // // // //       );
// // // // // // // //       return;
// // // // // // // //     }

// // // // // // // //     setShowWalletModal(false);
// // // // // // // //     setLoading(true);
// // // // // // // //     setTimeout(() => {
// // // // // // // //       setLoading(false);
// // // // // // // //       setPaymentSuccess(true);
// // // // // // // //       const transactionId = 'WLT' + Date.now().toString().slice(-10);
      
// // // // // // // //       // Navigate to OrderSuccess
// // // // // // // //       navigation.replace('OrderSuccess', {
// // // // // // // //         orderId: transactionId,
// // // // // // // //         totalAmount: totalAmount,
// // // // // // // //         paymentMethod: 'Wallet',
// // // // // // // //       });
// // // // // // // //     }, 1500);
// // // // // // // //   };

// // // // // // // //   // ============ CASH ON DELIVERY ============
// // // // // // // //   const handleCashOnDelivery = () => {
// // // // // // // //     Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    
// // // // // // // //     Alert.alert(
// // // // // // // //       '💳 Cash on Delivery',
// // // // // // // //       `Order Total: ₹${totalAmount}\n\nYou will pay ₹${totalAmount} in cash when your order arrives.\n\nPlease keep the exact amount ready.`,
// // // // // // // //       [
// // // // // // // //         { text: 'Cancel', style: 'cancel' },
// // // // // // // //         { 
// // // // // // // //           text: 'Confirm COD', 
// // // // // // // //           onPress: () => {
// // // // // // // //             setLoading(true);
// // // // // // // //             setTimeout(() => {
// // // // // // // //               setLoading(false);
// // // // // // // //               setPaymentSuccess(true);
// // // // // // // //               const transactionId = 'COD' + Date.now().toString().slice(-10);
              
// // // // // // // //               // Navigate to OrderSuccess
// // // // // // // //               navigation.replace('OrderSuccess', {
// // // // // // // //                 orderId: transactionId,
// // // // // // // //                 totalAmount: totalAmount,
// // // // // // // //                 paymentMethod: 'Cash on Delivery',
// // // // // // // //               });
// // // // // // // //             }, 1500);
// // // // // // // //           }
// // // // // // // //         }
// // // // // // // //       ]
// // // // // // // //     );
// // // // // // // //   };

// // // // // // // //   const formatCardNumber = (text: string): string => {
// // // // // // // //     const cleaned = text.replace(/\s/g, '');
// // // // // // // //     const matches = cleaned.match(/.{1,4}/g);
// // // // // // // //     if (matches) {
// // // // // // // //       return matches.join(' ');
// // // // // // // //     }
// // // // // // // //     return text;
// // // // // // // //   };

// // // // // // // //   const formatExpiryDate = (text: string): string => {
// // // // // // // //     const cleaned = text.replace(/\D/g, '');
// // // // // // // //     if (cleaned.length >= 2) {
// // // // // // // //       return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
// // // // // // // //     }
// // // // // // // //     return text;
// // // // // // // //   };

// // // // // // // //   return (
// // // // // // // //     <View style={styles.container}>
// // // // // // // //       <ScrollView showsVerticalScrollIndicator={false}>
// // // // // // // //         {/* Header */}
// // // // // // // //         <View style={styles.header}>
// // // // // // // //           <TouchableOpacity onPress={() => navigation.goBack()}>
// // // // // // // //             <Icon name="arrow-back" size={24} color={colors.text} />
// // // // // // // //           </TouchableOpacity>
// // // // // // // //           <Text style={styles.headerTitle}>Payment</Text>
// // // // // // // //           <View style={{ width: 24 }} />
// // // // // // // //         </View>

// // // // // // // //         {/* Amount */}
// // // // // // // //         <View style={styles.amountContainer}>
// // // // // // // //           <Text style={styles.amountLabel}>Amount to Pay</Text>
// // // // // // // //           <Text style={styles.amountValue}>₹{totalAmount}</Text>
// // // // // // // //         </View>

// // // // // // // //         {/* Payment Methods */}
// // // // // // // //         <View style={styles.methodsContainer}>
// // // // // // // //           <Text style={styles.sectionTitle}>Payment Methods</Text>
// // // // // // // //           {paymentMethods.map((method) => (
// // // // // // // //             <TouchableOpacity
// // // // // // // //               key={method.id}
// // // // // // // //               style={[
// // // // // // // //                 styles.methodItem,
// // // // // // // //                 selectedMethod === method.id && styles.selectedMethod,
// // // // // // // //               ]}
// // // // // // // //               onPress={() => handleSelectMethod(method.id)}
// // // // // // // //             >
// // // // // // // //               <View style={styles.methodLeft}>
// // // // // // // //                 <View style={[styles.methodIcon, selectedMethod === method.id && styles.selectedMethodIcon]}>
// // // // // // // //                   <Icon name={method.icon} size={22} color={selectedMethod === method.id ? colors.white : colors.text} />
// // // // // // // //                 </View>
// // // // // // // //                 <View style={styles.methodInfo}>
// // // // // // // //                   <Text style={[
// // // // // // // //                     styles.methodName,
// // // // // // // //                     selectedMethod === method.id && styles.selectedMethodText,
// // // // // // // //                   ]}>
// // // // // // // //                     {method.name}
// // // // // // // //                   </Text>
// // // // // // // //                   <Text style={styles.methodDesc}>{method.desc}</Text>
// // // // // // // //                 </View>
// // // // // // // //               </View>
// // // // // // // //               {selectedMethod === method.id && (
// // // // // // // //                 <Icon name="checkmark-circle" size={24} color={colors.primary} />
// // // // // // // //               )}
// // // // // // // //             </TouchableOpacity>
// // // // // // // //           ))}
// // // // // // // //         </View>
// // // // // // // //       </ScrollView>

// // // // // // // //       {/* ============ UPI MODAL ============ */}
// // // // // // // //       <Modal
// // // // // // // //         visible={showUPIModal}
// // // // // // // //         transparent={true}
// // // // // // // //         animationType="slide"
// // // // // // // //         onRequestClose={() => setShowUPIModal(false)}
// // // // // // // //       >
// // // // // // // //         <View style={styles.modalOverlay}>
// // // // // // // //           <View style={styles.modalContainer}>
// // // // // // // //             <View style={styles.modalHeader}>
// // // // // // // //               <Text style={styles.modalTitle}>Select UPI App</Text>
// // // // // // // //               <TouchableOpacity onPress={() => setShowUPIModal(false)}>
// // // // // // // //                 <Icon name="close" size={24} color={colors.text} />
// // // // // // // //               </TouchableOpacity>
// // // // // // // //             </View>

// // // // // // // //             <View style={styles.upiAppsContainer}>
// // // // // // // //               {upiApps.map((app) => (
// // // // // // // //                 <TouchableOpacity
// // // // // // // //                   key={app.id}
// // // // // // // //                   style={styles.upiAppItem}
// // // // // // // //                   onPress={() => handleUPISelection(app)}
// // // // // // // //                 >
// // // // // // // //                   <View style={[styles.upiAppIcon, { backgroundColor: app.color + '20' }]}>
// // // // // // // //                     <Text style={styles.upiAppEmoji}>{app.emoji}</Text>
// // // // // // // //                   </View>
// // // // // // // //                   <View style={styles.upiAppInfo}>
// // // // // // // //                     <Text style={styles.upiAppName}>{app.name}</Text>
// // // // // // // //                     <Text style={styles.upiAppDesc}>UPI Payment</Text>
// // // // // // // //                   </View>
// // // // // // // //                   <Icon name="chevron-forward" size={20} color={colors.gray} />
// // // // // // // //                 </TouchableOpacity>
// // // // // // // //               ))}
// // // // // // // //             </View>

// // // // // // // //             <TouchableOpacity 
// // // // // // // //               style={styles.enterUPIButton}
// // // // // // // //               onPress={() => {
// // // // // // // //                 setShowUPIModal(false);
// // // // // // // //                 setSelectedUPIApp('Manual UPI');
// // // // // // // //                 setTimeout(() => {
// // // // // // // //                   setShowUPIPinModal(true);
// // // // // // // //                 }, 300);
// // // // // // // //               }}
// // // // // // // //             >
// // // // // // // //               <Text style={styles.enterUPIButtonText}>Enter UPI ID Manually</Text>
// // // // // // // //             </TouchableOpacity>
// // // // // // // //           </View>
// // // // // // // //         </View>
// // // // // // // //       </Modal>

// // // // // // // //       {/* ============ UPI PIN MODAL ============ */}
// // // // // // // //       <Modal
// // // // // // // //         visible={showUPIPinModal}
// // // // // // // //         transparent={true}
// // // // // // // //         animationType="fade"
// // // // // // // //         onRequestClose={() => {
// // // // // // // //           setShowUPIPinModal(false);
// // // // // // // //           setUpiPin('');
// // // // // // // //         }}
// // // // // // // //       >
// // // // // // // //         <View style={styles.pinModalOverlay}>
// // // // // // // //           <View style={styles.pinModalContainer}>
// // // // // // // //             <View style={styles.pinModalHeader}>
// // // // // // // //               <Text style={styles.pinModalTitle}>
// // // // // // // //                 {selectedUPIApp || 'UPI'} PIN
// // // // // // // //               </Text>
// // // // // // // //               <Text style={styles.pinModalSubtitle}>
// // // // // // // //                 Enter your 4-digit UPI PIN to confirm payment
// // // // // // // //               </Text>
// // // // // // // //             </View>

// // // // // // // //             <View style={styles.pinDisplayContainer}>
// // // // // // // //               <View style={styles.pinDisplay}>
// // // // // // // //                 {[0, 1, 2, 3].map((index) => (
// // // // // // // //                   <View key={index} style={styles.pinDotContainer}>
// // // // // // // //                     <View style={[
// // // // // // // //                       styles.pinDot,
// // // // // // // //                       upiPin.length > index && styles.pinDotFilled,
// // // // // // // //                     ]} />
// // // // // // // //                   </View>
// // // // // // // //                 ))}
// // // // // // // //               </View>
// // // // // // // //             </View>

// // // // // // // //             <View style={styles.pinKeyboard}>
// // // // // // // //               {[1, 2, 3, 4, 5, 6, 7, 8, 9, 'clear', 0, 'delete'].map((key) => (
// // // // // // // //                 <TouchableOpacity
// // // // // // // //                   key={key.toString()}
// // // // // // // //                   style={styles.pinKey}
// // // // // // // //                   onPress={() => {
// // // // // // // //                     if (key === 'clear') {
// // // // // // // //                       setUpiPin('');
// // // // // // // //                     } else if (key === 'delete') {
// // // // // // // //                       setUpiPin(upiPin.slice(0, -1));
// // // // // // // //                     } else if (upiPin.length < 4) {
// // // // // // // //                       setUpiPin(upiPin + key.toString());
// // // // // // // //                     }
// // // // // // // //                   }}
// // // // // // // //                 >
// // // // // // // //                   <Text style={styles.pinKeyText}>
// // // // // // // //                     {key === 'clear' ? 'Clear' : key === 'delete' ? '⌫' : key}
// // // // // // // //                   </Text>
// // // // // // // //                 </TouchableOpacity>
// // // // // // // //               ))}
// // // // // // // //             </View>

// // // // // // // //             <TouchableOpacity
// // // // // // // //               style={[styles.pinConfirmButton, upiPin.length !== 4 && styles.pinConfirmButtonDisabled]}
// // // // // // // //               onPress={handleUPIPinSubmit}
// // // // // // // //               disabled={upiPin.length !== 4}
// // // // // // // //             >
// // // // // // // //               <Text style={styles.pinConfirmButtonText}>
// // // // // // // //                 Pay ₹{totalAmount}
// // // // // // // //               </Text>
// // // // // // // //             </TouchableOpacity>

// // // // // // // //             <TouchableOpacity
// // // // // // // //               style={styles.pinCancelButton}
// // // // // // // //               onPress={() => {
// // // // // // // //                 setShowUPIPinModal(false);
// // // // // // // //                 setUpiPin('');
// // // // // // // //               }}
// // // // // // // //             >
// // // // // // // //               <Text style={styles.pinCancelButtonText}>Cancel</Text>
// // // // // // // //             </TouchableOpacity>
// // // // // // // //           </View>
// // // // // // // //         </View>
// // // // // // // //       </Modal>

// // // // // // // //       {/* ============ CARD MODAL ============ */}
// // // // // // // //       <Modal
// // // // // // // //         visible={showCardModal}
// // // // // // // //         transparent={true}
// // // // // // // //         animationType="slide"
// // // // // // // //         onRequestClose={() => setShowCardModal(false)}
// // // // // // // //       >
// // // // // // // //         <View style={styles.modalOverlay}>
// // // // // // // //           <View style={styles.modalContainer}>
// // // // // // // //             <View style={styles.modalHeader}>
// // // // // // // //               <Text style={styles.modalTitle}>Card Details</Text>
// // // // // // // //               <TouchableOpacity onPress={() => setShowCardModal(false)}>
// // // // // // // //                 <Icon name="close" size={24} color={colors.text} />
// // // // // // // //               </TouchableOpacity>
// // // // // // // //             </View>

// // // // // // // //             <View style={styles.cardModalBody}>
// // // // // // // //               <View style={styles.cardPreview}>
// // // // // // // //                 <Icon name="card-outline" size={40} color={colors.primary} />
// // // // // // // //                 <Text style={styles.cardPreviewText}>Enter Card Details</Text>
// // // // // // // //               </View>

// // // // // // // //               <View style={styles.inputContainer}>
// // // // // // // //                 <Text style={styles.inputLabel}>Card Number</Text>
// // // // // // // //                 <TextInput
// // // // // // // //                   style={styles.input}
// // // // // // // //                   placeholder="1234 5678 9012 3456"
// // // // // // // //                   value={cardNumber}
// // // // // // // //                   onChangeText={(text) => setCardNumber(formatCardNumber(text))}
// // // // // // // //                   keyboardType="numeric"
// // // // // // // //                   maxLength={19}
// // // // // // // //                 />
// // // // // // // //               </View>

// // // // // // // //               <View style={styles.inputContainer}>
// // // // // // // //                 <Text style={styles.inputLabel}>Card Holder Name</Text>
// // // // // // // //                 <TextInput
// // // // // // // //                   style={styles.input}
// // // // // // // //                   placeholder="John Doe"
// // // // // // // //                   value={cardHolder}
// // // // // // // //                   onChangeText={setCardHolder}
// // // // // // // //                 />
// // // // // // // //               </View>

// // // // // // // //               <View style={styles.rowInputs}>
// // // // // // // //                 <View style={[styles.inputContainer, styles.halfInput]}>
// // // // // // // //                   <Text style={styles.inputLabel}>Expiry Date</Text>
// // // // // // // //                   <TextInput
// // // // // // // //                     style={styles.input}
// // // // // // // //                     placeholder="MM/YY"
// // // // // // // //                     value={expiryDate}
// // // // // // // //                     onChangeText={(text) => setExpiryDate(formatExpiryDate(text))}
// // // // // // // //                     keyboardType="numeric"
// // // // // // // //                     maxLength={5}
// // // // // // // //                   />
// // // // // // // //                 </View>
// // // // // // // //                 <View style={[styles.inputContainer, styles.halfInput]}>
// // // // // // // //                   <Text style={styles.inputLabel}>CVV</Text>
// // // // // // // //                   <TextInput
// // // // // // // //                     style={styles.input}
// // // // // // // //                     placeholder="123"
// // // // // // // //                     value={cvv}
// // // // // // // //                     onChangeText={setCvv}
// // // // // // // //                     keyboardType="numeric"
// // // // // // // //                     maxLength={4}
// // // // // // // //                     secureTextEntry
// // // // // // // //                   />
// // // // // // // //                 </View>
// // // // // // // //               </View>

// // // // // // // //               <TouchableOpacity 
// // // // // // // //                 style={styles.payNowButton} 
// // // // // // // //                 onPress={handleCardPayment}
// // // // // // // //                 disabled={loading}
// // // // // // // //               >
// // // // // // // //                 {loading ? (
// // // // // // // //                   <ActivityIndicator color="#ffffff" />
// // // // // // // //                 ) : (
// // // // // // // //                   <Text style={styles.payNowButtonText}>Pay ₹{totalAmount}</Text>
// // // // // // // //                 )}
// // // // // // // //               </TouchableOpacity>
// // // // // // // //             </View>
// // // // // // // //           </View>
// // // // // // // //         </View>
// // // // // // // //       </Modal>

// // // // // // // //       {/* ============ NET BANKING MODAL ============ */}
// // // // // // // //       <Modal
// // // // // // // //         visible={showNetBankingModal}
// // // // // // // //         transparent={true}
// // // // // // // //         animationType="slide"
// // // // // // // //         onRequestClose={() => setShowNetBankingModal(false)}
// // // // // // // //       >
// // // // // // // //         <View style={styles.modalOverlay}>
// // // // // // // //           <View style={styles.modalContainer}>
// // // // // // // //             <View style={styles.modalHeader}>
// // // // // // // //               <Text style={styles.modalTitle}>Select Bank</Text>
// // // // // // // //               <TouchableOpacity onPress={() => setShowNetBankingModal(false)}>
// // // // // // // //                 <Icon name="close" size={24} color={colors.text} />
// // // // // // // //               </TouchableOpacity>
// // // // // // // //             </View>

// // // // // // // //             <View style={styles.banksContainer}>
// // // // // // // //               {banks.map((bank) => (
// // // // // // // //                 <TouchableOpacity
// // // // // // // //                   key={bank.id}
// // // // // // // //                   style={styles.bankItem}
// // // // // // // //                   onPress={() => handleNetBankingSelect(bank)}
// // // // // // // //                 >
// // // // // // // //                   <View style={[styles.bankIcon, { backgroundColor: bank.color + '20' }]}>
// // // // // // // //                     <Text style={styles.bankEmoji}>{bank.icon}</Text>
// // // // // // // //                   </View>
// // // // // // // //                   <View style={styles.bankInfo}>
// // // // // // // //                     <Text style={styles.bankName}>{bank.name}</Text>
// // // // // // // //                     <Text style={styles.bankDesc}>Net Banking</Text>
// // // // // // // //                   </View>
// // // // // // // //                   <Icon name="chevron-forward" size={20} color={colors.gray} />
// // // // // // // //                 </TouchableOpacity>
// // // // // // // //               ))}
// // // // // // // //             </View>
// // // // // // // //           </View>
// // // // // // // //         </View>
// // // // // // // //       </Modal>

// // // // // // // //       {/* ============ WALLET MODAL ============ */}
// // // // // // // //       <Modal
// // // // // // // //         visible={showWalletModal}
// // // // // // // //         transparent={true}
// // // // // // // //         animationType="slide"
// // // // // // // //         onRequestClose={() => setShowWalletModal(false)}
// // // // // // // //       >
// // // // // // // //         <View style={styles.modalOverlay}>
// // // // // // // //           <View style={styles.modalContainer}>
// // // // // // // //             <View style={styles.modalHeader}>
// // // // // // // //               <Text style={styles.modalTitle}>Pay with Wallet</Text>
// // // // // // // //               <TouchableOpacity onPress={() => setShowWalletModal(false)}>
// // // // // // // //                 <Icon name="close" size={24} color={colors.text} />
// // // // // // // //               </TouchableOpacity>
// // // // // // // //             </View>

// // // // // // // //             <View style={styles.walletModalBody}>
// // // // // // // //               <View style={styles.walletBalanceContainer}>
// // // // // // // //                 <Icon name="wallet-outline" size={40} color={colors.primary} />
// // // // // // // //                 <Text style={styles.walletBalanceTitle}>Wallet Balance</Text>
// // // // // // // //                 <Text style={styles.walletBalanceAmount}>₹{walletBalance}</Text>
// // // // // // // //               </View>

// // // // // // // //               <View style={styles.walletInfoContainer}>
// // // // // // // //                 <View style={styles.walletInfoRow}>
// // // // // // // //                   <Text style={styles.walletInfoLabel}>Order Total</Text>
// // // // // // // //                   <Text style={styles.walletInfoValue}>₹{totalAmount}</Text>
// // // // // // // //                 </View>
// // // // // // // //                 <View style={styles.walletInfoRow}>
// // // // // // // //                   <Text style={styles.walletInfoLabel}>Balance After Payment</Text>
// // // // // // // //                   <Text style={[styles.walletInfoValue, { color: totalAmount <= walletBalance ? colors.success : colors.danger }]}>
// // // // // // // //                     ₹{walletBalance - totalAmount}
// // // // // // // //                   </Text>
// // // // // // // //                 </View>
// // // // // // // //               </View>

// // // // // // // //               <TouchableOpacity 
// // // // // // // //                 style={[styles.walletPayButton, totalAmount > walletBalance && styles.walletPayButtonDisabled]}
// // // // // // // //                 onPress={handleWalletPayment}
// // // // // // // //                 disabled={loading || totalAmount > walletBalance}
// // // // // // // //               >
// // // // // // // //                 {loading ? (
// // // // // // // //                   <ActivityIndicator color="#ffffff" />
// // // // // // // //                 ) : (
// // // // // // // //                   <Text style={styles.walletPayButtonText}>
// // // // // // // //                     {totalAmount > walletBalance ? 'Insufficient Balance' : `Pay ₹${totalAmount}`}
// // // // // // // //                   </Text>
// // // // // // // //                 )}
// // // // // // // //               </TouchableOpacity>
// // // // // // // //             </View>
// // // // // // // //           </View>
// // // // // // // //         </View>
// // // // // // // //       </Modal>

// // // // // // // //       {/* Loading Overlay */}
// // // // // // // //       {loading && (
// // // // // // // //         <View style={styles.loadingOverlay}>
// // // // // // // //           <View style={styles.loadingContainer}>
// // // // // // // //             <ActivityIndicator size="large" color={colors.primary} />
// // // // // // // //             <Text style={styles.loadingText}>Processing Payment...</Text>
// // // // // // // //             <Text style={styles.loadingSubText}>Please do not close the app</Text>
// // // // // // // //           </View>
// // // // // // // //         </View>
// // // // // // // //       )}
// // // // // // // //     </View>
// // // // // // // //   );
// // // // // // // // }

// // // // // // // // const styles = StyleSheet.create({
// // // // // // // //   container: {
// // // // // // // //     flex: 1,
// // // // // // // //     backgroundColor: colors.white,
// // // // // // // //   },
// // // // // // // //   header: {
// // // // // // // //     flexDirection: 'row',
// // // // // // // //     alignItems: 'center',
// // // // // // // //     justifyContent: 'space-between',
// // // // // // // //     padding: 16,
// // // // // // // //     paddingTop: 40,
// // // // // // // //     borderBottomWidth: 1,
// // // // // // // //     borderBottomColor: colors.border,
// // // // // // // //   },
// // // // // // // //   headerTitle: {
// // // // // // // //     fontSize: 18,
// // // // // // // //     fontWeight: '600',
// // // // // // // //     color: colors.text,
// // // // // // // //   },
// // // // // // // //   amountContainer: {
// // // // // // // //     backgroundColor: colors.primary,
// // // // // // // //     padding: 20,
// // // // // // // //     margin: 16,
// // // // // // // //     borderRadius: 12,
// // // // // // // //     alignItems: 'center',
// // // // // // // //   },
// // // // // // // //   amountLabel: {
// // // // // // // //     fontSize: 14,
// // // // // // // //     color: colors.white,
// // // // // // // //     opacity: 0.8,
// // // // // // // //   },
// // // // // // // //   amountValue: {
// // // // // // // //     fontSize: 28,
// // // // // // // //     fontWeight: '700',
// // // // // // // //     color: colors.white,
// // // // // // // //     marginTop: 4,
// // // // // // // //   },
// // // // // // // //   methodsContainer: {
// // // // // // // //     paddingHorizontal: 16,
// // // // // // // //     paddingBottom: 20,
// // // // // // // //   },
// // // // // // // //   sectionTitle: {
// // // // // // // //     fontSize: 16,
// // // // // // // //     fontWeight: '600',
// // // // // // // //     color: colors.text,
// // // // // // // //     marginBottom: 12,
// // // // // // // //   },
// // // // // // // //   methodItem: {
// // // // // // // //     flexDirection: 'row',
// // // // // // // //     justifyContent: 'space-between',
// // // // // // // //     alignItems: 'center',
// // // // // // // //     padding: 14,
// // // // // // // //     borderWidth: 1,
// // // // // // // //     borderColor: colors.border,
// // // // // // // //     borderRadius: 10,
// // // // // // // //     marginBottom: 8,
// // // // // // // //   },
// // // // // // // //   selectedMethod: {
// // // // // // // //     borderColor: colors.primary,
// // // // // // // //     backgroundColor: '#fff5ec',
// // // // // // // //   },
// // // // // // // //   methodLeft: {
// // // // // // // //     flexDirection: 'row',
// // // // // // // //     alignItems: 'center',
// // // // // // // //     flex: 1,
// // // // // // // //   },
// // // // // // // //   methodIcon: {
// // // // // // // //     width: 36,
// // // // // // // //     height: 36,
// // // // // // // //     borderRadius: 18,
// // // // // // // //     backgroundColor: colors.lightGray,
// // // // // // // //     justifyContent: 'center',
// // // // // // // //     alignItems: 'center',
// // // // // // // //     marginRight: 12,
// // // // // // // //   },
// // // // // // // //   selectedMethodIcon: {
// // // // // // // //     backgroundColor: colors.primary,
// // // // // // // //   },
// // // // // // // //   methodInfo: {
// // // // // // // //     flex: 1,
// // // // // // // //   },
// // // // // // // //   methodName: {
// // // // // // // //     fontSize: 14,
// // // // // // // //     color: colors.text,
// // // // // // // //   },
// // // // // // // //   selectedMethodText: {
// // // // // // // //     color: colors.primary,
// // // // // // // //     fontWeight: '500',
// // // // // // // //   },
// // // // // // // //   methodDesc: {
// // // // // // // //     fontSize: 11,
// // // // // // // //     color: colors.textLight,
// // // // // // // //     marginTop: 1,
// // // // // // // //   },
// // // // // // // //   modalOverlay: {
// // // // // // // //     flex: 1,
// // // // // // // //     backgroundColor: 'rgba(0,0,0,0.5)',
// // // // // // // //     justifyContent: 'flex-end',
// // // // // // // //   },
// // // // // // // //   modalContainer: {
// // // // // // // //     backgroundColor: colors.white,
// // // // // // // //     borderTopLeftRadius: 24,
// // // // // // // //     borderTopRightRadius: 24,
// // // // // // // //     paddingHorizontal: 20,
// // // // // // // //     paddingBottom: 30,
// // // // // // // //     maxHeight: '80%',
// // // // // // // //   },
// // // // // // // //   modalHeader: {
// // // // // // // //     flexDirection: 'row',
// // // // // // // //     justifyContent: 'space-between',
// // // // // // // //     alignItems: 'center',
// // // // // // // //     paddingVertical: 16,
// // // // // // // //     borderBottomWidth: 1,
// // // // // // // //     borderBottomColor: colors.border,
// // // // // // // //   },
// // // // // // // //   modalTitle: {
// // // // // // // //     fontSize: 18,
// // // // // // // //     fontWeight: '600',
// // // // // // // //     color: colors.text,
// // // // // // // //   },
// // // // // // // //   // UPI Modal
// // // // // // // //   upiAppsContainer: {
// // // // // // // //     marginTop: 12,
// // // // // // // //   },
// // // // // // // //   upiAppItem: {
// // // // // // // //     flexDirection: 'row',
// // // // // // // //     alignItems: 'center',
// // // // // // // //     paddingVertical: 14,
// // // // // // // //     borderBottomWidth: 1,
// // // // // // // //     borderBottomColor: colors.border,
// // // // // // // //   },
// // // // // // // //   upiAppIcon: {
// // // // // // // //     width: 48,
// // // // // // // //     height: 48,
// // // // // // // //     borderRadius: 24,
// // // // // // // //     justifyContent: 'center',
// // // // // // // //     alignItems: 'center',
// // // // // // // //     marginRight: 12,
// // // // // // // //   },
// // // // // // // //   upiAppEmoji: {
// // // // // // // //     fontSize: 24,
// // // // // // // //   },
// // // // // // // //   upiAppInfo: {
// // // // // // // //     flex: 1,
// // // // // // // //   },
// // // // // // // //   upiAppName: {
// // // // // // // //     fontSize: 15,
// // // // // // // //     fontWeight: '500',
// // // // // // // //     color: colors.text,
// // // // // // // //   },
// // // // // // // //   upiAppDesc: {
// // // // // // // //     fontSize: 12,
// // // // // // // //     color: colors.textLight,
// // // // // // // //     marginTop: 2,
// // // // // // // //   },
// // // // // // // //   enterUPIButton: {
// // // // // // // //     marginTop: 16,
// // // // // // // //     paddingVertical: 12,
// // // // // // // //     borderWidth: 1,
// // // // // // // //     borderColor: colors.primary,
// // // // // // // //     borderRadius: 8,
// // // // // // // //     alignItems: 'center',
// // // // // // // //   },
// // // // // // // //   enterUPIButtonText: {
// // // // // // // //     color: colors.primary,
// // // // // // // //     fontSize: 14,
// // // // // // // //     fontWeight: '500',
// // // // // // // //   },
// // // // // // // //   // UPI PIN Modal
// // // // // // // //   pinModalOverlay: {
// // // // // // // //     flex: 1,
// // // // // // // //     backgroundColor: 'rgba(0,0,0,0.7)',
// // // // // // // //     justifyContent: 'center',
// // // // // // // //     alignItems: 'center',
// // // // // // // //   },
// // // // // // // //   pinModalContainer: {
// // // // // // // //     backgroundColor: colors.white,
// // // // // // // //     borderRadius: 24,
// // // // // // // //     padding: 24,
// // // // // // // //     width: '85%',
// // // // // // // //     maxWidth: 400,
// // // // // // // //   },
// // // // // // // //   pinModalHeader: {
// // // // // // // //     alignItems: 'center',
// // // // // // // //     marginBottom: 20,
// // // // // // // //   },
// // // // // // // //   pinModalTitle: {
// // // // // // // //     fontSize: 20,
// // // // // // // //     fontWeight: '700',
// // // // // // // //     color: colors.text,
// // // // // // // //   },
// // // // // // // //   pinModalSubtitle: {
// // // // // // // //     fontSize: 14,
// // // // // // // //     color: colors.textLight,
// // // // // // // //     marginTop: 4,
// // // // // // // //   },
// // // // // // // //   pinDisplayContainer: {
// // // // // // // //     alignItems: 'center',
// // // // // // // //     marginBottom: 24,
// // // // // // // //   },
// // // // // // // //   pinDisplay: {
// // // // // // // //     flexDirection: 'row',
// // // // // // // //     justifyContent: 'center',
// // // // // // // //   },
// // // // // // // //   pinDotContainer: {
// // // // // // // //     marginHorizontal: 8,
// // // // // // // //   },
// // // // // // // //   pinDot: {
// // // // // // // //     width: 16,
// // // // // // // //     height: 16,
// // // // // // // //     borderRadius: 8,
// // // // // // // //     borderWidth: 2,
// // // // // // // //     borderColor: colors.border,
// // // // // // // //     backgroundColor: colors.white,
// // // // // // // //   },
// // // // // // // //   pinDotFilled: {
// // // // // // // //     backgroundColor: colors.primary,
// // // // // // // //     borderColor: colors.primary,
// // // // // // // //   },
// // // // // // // //   pinKeyboard: {
// // // // // // // //     flexDirection: 'row',
// // // // // // // //     flexWrap: 'wrap',
// // // // // // // //     justifyContent: 'center',
// // // // // // // //     marginBottom: 16,
// // // // // // // //   },
// // // // // // // //   pinKey: {
// // // // // // // //     width: '30%',
// // // // // // // //     aspectRatio: 1.2,
// // // // // // // //     justifyContent: 'center',
// // // // // // // //     alignItems: 'center',
// // // // // // // //     margin: '1.5%',
// // // // // // // //     borderRadius: 12,
// // // // // // // //     backgroundColor: colors.lightGray,
// // // // // // // //   },
// // // // // // // //   pinKeyText: {
// // // // // // // //     fontSize: 22,
// // // // // // // //     fontWeight: '500',
// // // // // // // //     color: colors.text,
// // // // // // // //   },
// // // // // // // //   pinConfirmButton: {
// // // // // // // //     backgroundColor: colors.primary,
// // // // // // // //     paddingVertical: 14,
// // // // // // // //     borderRadius: 12,
// // // // // // // //     alignItems: 'center',
// // // // // // // //     marginBottom: 8,
// // // // // // // //   },
// // // // // // // //   pinConfirmButtonDisabled: {
// // // // // // // //     backgroundColor: colors.gray,
// // // // // // // //   },
// // // // // // // //   pinConfirmButtonText: {
// // // // // // // //     color: colors.white,
// // // // // // // //     fontSize: 16,
// // // // // // // //     fontWeight: '600',
// // // // // // // //   },
// // // // // // // //   pinCancelButton: {
// // // // // // // //     paddingVertical: 10,
// // // // // // // //     alignItems: 'center',
// // // // // // // //   },
// // // // // // // //   pinCancelButtonText: {
// // // // // // // //     color: colors.textLight,
// // // // // // // //     fontSize: 14,
// // // // // // // //   },
// // // // // // // //   // Card Modal
// // // // // // // //   cardModalBody: {
// // // // // // // //     marginTop: 8,
// // // // // // // //   },
// // // // // // // //   cardPreview: {
// // // // // // // //     alignItems: 'center',
// // // // // // // //     paddingVertical: 20,
// // // // // // // //     backgroundColor: '#f8f9fa',
// // // // // // // //     borderRadius: 12,
// // // // // // // //     marginBottom: 16,
// // // // // // // //   },
// // // // // // // //   cardPreviewText: {
// // // // // // // //     fontSize: 14,
// // // // // // // //     color: colors.textLight,
// // // // // // // //     marginTop: 8,
// // // // // // // //   },
// // // // // // // //   inputContainer: {
// // // // // // // //     marginBottom: 12,
// // // // // // // //   },
// // // // // // // //   inputLabel: {
// // // // // // // //     fontSize: 14,
// // // // // // // //     fontWeight: '500',
// // // // // // // //     color: colors.text,
// // // // // // // //     marginBottom: 4,
// // // // // // // //   },
// // // // // // // //   input: {
// // // // // // // //     borderWidth: 1,
// // // // // // // //     borderColor: colors.border,
// // // // // // // //     borderRadius: 8,
// // // // // // // //     paddingHorizontal: 12,
// // // // // // // //     paddingVertical: 10,
// // // // // // // //     fontSize: 14,
// // // // // // // //     color: colors.text,
// // // // // // // //     backgroundColor: colors.white,
// // // // // // // //   },
// // // // // // // //   rowInputs: {
// // // // // // // //     flexDirection: 'row',
// // // // // // // //     justifyContent: 'space-between',
// // // // // // // //   },
// // // // // // // //   halfInput: {
// // // // // // // //     flex: 1,
// // // // // // // //     marginRight: 8,
// // // // // // // //   },
// // // // // // // //   payNowButton: {
// // // // // // // //     backgroundColor: colors.primary,
// // // // // // // //     borderRadius: 12,
// // // // // // // //     height: 50,
// // // // // // // //     justifyContent: 'center',
// // // // // // // //     alignItems: 'center',
// // // // // // // //     marginTop: 8,
// // // // // // // //   },
// // // // // // // //   payNowButtonText: {
// // // // // // // //     color: colors.white,
// // // // // // // //     fontSize: 16,
// // // // // // // //     fontWeight: '600',
// // // // // // // //   },
// // // // // // // //   // Net Banking Modal
// // // // // // // //   banksContainer: {
// // // // // // // //     marginTop: 12,
// // // // // // // //   },
// // // // // // // //   bankItem: {
// // // // // // // //     flexDirection: 'row',
// // // // // // // //     alignItems: 'center',
// // // // // // // //     paddingVertical: 14,
// // // // // // // //     borderBottomWidth: 1,
// // // // // // // //     borderBottomColor: colors.border,
// // // // // // // //   },
// // // // // // // //   bankIcon: {
// // // // // // // //     width: 44,
// // // // // // // //     height: 44,
// // // // // // // //     borderRadius: 22,
// // // // // // // //     justifyContent: 'center',
// // // // // // // //     alignItems: 'center',
// // // // // // // //     marginRight: 12,
// // // // // // // //   },
// // // // // // // //   bankEmoji: {
// // // // // // // //     fontSize: 20,
// // // // // // // //   },
// // // // // // // //   bankInfo: {
// // // // // // // //     flex: 1,
// // // // // // // //   },
// // // // // // // //   bankName: {
// // // // // // // //     fontSize: 14,
// // // // // // // //     fontWeight: '500',
// // // // // // // //     color: colors.text,
// // // // // // // //   },
// // // // // // // //   bankDesc: {
// // // // // // // //     fontSize: 12,
// // // // // // // //     color: colors.textLight,
// // // // // // // //     marginTop: 1,
// // // // // // // //   },
// // // // // // // //   // Wallet Modal
// // // // // // // //   walletModalBody: {
// // // // // // // //     marginTop: 8,
// // // // // // // //   },
// // // // // // // //   walletBalanceContainer: {
// // // // // // // //     alignItems: 'center',
// // // // // // // //     paddingVertical: 20,
// // // // // // // //     backgroundColor: '#f8f9fa',
// // // // // // // //     borderRadius: 12,
// // // // // // // //     marginBottom: 16,
// // // // // // // //   },
// // // // // // // //   walletBalanceTitle: {
// // // // // // // //     fontSize: 14,
// // // // // // // //     color: colors.textLight,
// // // // // // // //     marginTop: 8,
// // // // // // // //   },
// // // // // // // //   walletBalanceAmount: {
// // // // // // // //     fontSize: 28,
// // // // // // // //     fontWeight: '700',
// // // // // // // //     color: colors.primary,
// // // // // // // //     marginTop: 4,
// // // // // // // //   },
// // // // // // // //   walletInfoContainer: {
// // // // // // // //     backgroundColor: '#f8f9fa',
// // // // // // // //     borderRadius: 12,
// // // // // // // //     padding: 16,
// // // // // // // //     marginBottom: 16,
// // // // // // // //   },
// // // // // // // //   walletInfoRow: {
// // // // // // // //     flexDirection: 'row',
// // // // // // // //     justifyContent: 'space-between',
// // // // // // // //     paddingVertical: 4,
// // // // // // // //   },
// // // // // // // //   walletInfoLabel: {
// // // // // // // //     fontSize: 14,
// // // // // // // //     color: colors.textLight,
// // // // // // // //   },
// // // // // // // //   walletInfoValue: {
// // // // // // // //     fontSize: 14,
// // // // // // // //     fontWeight: '500',
// // // // // // // //     color: colors.text,
// // // // // // // //   },
// // // // // // // //   walletPayButton: {
// // // // // // // //     backgroundColor: colors.primary,
// // // // // // // //     borderRadius: 12,
// // // // // // // //     height: 50,
// // // // // // // //     justifyContent: 'center',
// // // // // // // //     alignItems: 'center',
// // // // // // // //   },
// // // // // // // //   walletPayButtonDisabled: {
// // // // // // // //     backgroundColor: colors.gray,
// // // // // // // //   },
// // // // // // // //   walletPayButtonText: {
// // // // // // // //     color: colors.white,
// // // // // // // //     fontSize: 16,
// // // // // // // //     fontWeight: '600',
// // // // // // // //   },
// // // // // // // //   // Loading Overlay
// // // // // // // //   loadingOverlay: {
// // // // // // // //     position: 'absolute',
// // // // // // // //     top: 0,
// // // // // // // //     left: 0,
// // // // // // // //     right: 0,
// // // // // // // //     bottom: 0,
// // // // // // // //     backgroundColor: 'rgba(0,0,0,0.7)',
// // // // // // // //     justifyContent: 'center',
// // // // // // // //     alignItems: 'center',
// // // // // // // //   },
// // // // // // // //   loadingContainer: {
// // // // // // // //     backgroundColor: colors.white,
// // // // // // // //     padding: 30,
// // // // // // // //     borderRadius: 16,
// // // // // // // //     alignItems: 'center',
// // // // // // // //     minWidth: 200,
// // // // // // // //   },
// // // // // // // //   loadingText: {
// // // // // // // //     fontSize: 16,
// // // // // // // //     fontWeight: '600',
// // // // // // // //     color: colors.text,
// // // // // // // //     marginTop: 12,
// // // // // // // //   },
// // // // // // // //   loadingSubText: {
// // // // // // // //     fontSize: 12,
// // // // // // // //     color: colors.textLight,
// // // // // // // //     marginTop: 4,
// // // // // // // //   },
// // // // // // // // });
// // // // // // // import React, { useState } from 'react';
// // // // // // // import {
// // // // // // //   View,
// // // // // // //   Text,
// // // // // // //   ScrollView,
// // // // // // //   TouchableOpacity,
// // // // // // //   StyleSheet,
// // // // // // //   TextInput,
// // // // // // //   Alert,
// // // // // // //   Modal,
// // // // // // //   ActivityIndicator,
// // // // // // // } from 'react-native';
// // // // // // // import * as Haptics from 'expo-haptics';
// // // // // // // import Icon from 'react-native-vector-icons/Ionicons';
// // // // // // // import { colors } from '../../constants/colors';

// // // // // // // interface PaymentScreenProps {
// // // // // // //   navigation: any;
// // // // // // //   route: any;
// // // // // // // }

// // // // // // // export default function PaymentScreen({ route, navigation }: PaymentScreenProps) {
// // // // // // //   const { totalAmount } = route.params || { totalAmount: 461 };
// // // // // // //   const [selectedMethod, setSelectedMethod] = useState<string>('');
// // // // // // //   const [showUPIModal, setShowUPIModal] = useState<boolean>(false);
// // // // // // //   const [selectedUPIApp, setSelectedUPIApp] = useState<string>('');
// // // // // // //   const [showUPIPinModal, setShowUPIPinModal] = useState<boolean>(false);
// // // // // // //   const [upiPin, setUpiPin] = useState<string>('');
// // // // // // //   const [showCardModal, setShowCardModal] = useState<boolean>(false);
// // // // // // //   const [showNetBankingModal, setShowNetBankingModal] = useState<boolean>(false);
// // // // // // //   const [showWalletModal, setShowWalletModal] = useState<boolean>(false);
// // // // // // //   const [loading, setLoading] = useState<boolean>(false);
// // // // // // //   const [paymentSuccess, setPaymentSuccess] = useState<boolean>(false);
// // // // // // //   const [upiTransactionId, setUpiTransactionId] = useState<string>('');
  
// // // // // // //   // Card Details
// // // // // // //   const [cardNumber, setCardNumber] = useState<string>('');
// // // // // // //   const [expiryDate, setExpiryDate] = useState<string>('');
// // // // // // //   const [cvv, setCvv] = useState<string>('');
// // // // // // //   const [cardHolder, setCardHolder] = useState<string>('');

// // // // // // //   // Wallet
// // // // // // //   const walletBalance = 2500;

// // // // // // //   // Net Banking Banks
// // // // // // //   const banks = [
// // // // // // //     { id: 'sbi', name: 'State Bank of India', icon: '🏦', color: '#2E6B98' },
// // // // // // //     { id: 'hdfc', name: 'HDFC Bank', icon: '🏛️', color: '#004F8C' },
// // // // // // //     { id: 'icici', name: 'ICICI Bank', icon: '🏛️', color: '#F58A1E' },
// // // // // // //     { id: 'axis', name: 'Axis Bank', icon: '🏦', color: '#8B1A2B' },
// // // // // // //     { id: 'kotak', name: 'Kotak Mahindra Bank', icon: '🏦', color: '#003F6C' },
// // // // // // //     { id: 'yes', name: 'Yes Bank', icon: '🏛️', color: '#1B4F7A' },
// // // // // // //     { id: 'pnb', name: 'Punjab National Bank', icon: '🏦', color: '#008C45' },
// // // // // // //     { id: 'bob', name: 'Bank of Baroda', icon: '🏛️', color: '#0F4C81' },
// // // // // // //   ];

// // // // // // //   // UPI Apps
// // // // // // //   const upiApps = [
// // // // // // //     { id: 'gpay', name: 'Google Pay', emoji: '🟢', color: '#4285F4' },
// // // // // // //     { id: 'phonepe', name: 'PhonePe', emoji: '🟣', color: '#5F259F' },
// // // // // // //     { id: 'paytm', name: 'Paytm', emoji: '🔵', color: '#00BAF2' },
// // // // // // //     { id: 'amazonpay', name: 'Amazon Pay', emoji: '🟠', color: '#FF9900' },
// // // // // // //     { id: 'bhim', name: 'BHIM UPI', emoji: '🔷', color: '#0084B4' },
// // // // // // //   ];

// // // // // // //   const paymentMethods: { id: string; name: string; icon: string; desc: string }[] = [
// // // // // // //     { id: 'card', name: 'Credit/Debit Card', icon: 'card-outline', desc: 'Pay with card' },
// // // // // // //     { id: 'upi', name: 'UPI', icon: 'phone-portrait-outline', desc: 'Google Pay, PhonePe, Paytm' },
// // // // // // //     { id: 'netbanking', name: 'Net Banking', icon: 'business-outline', desc: 'All major banks' },
// // // // // // //     { id: 'wallet', name: 'Wallet', icon: 'wallet-outline', desc: `Balance: ₹${walletBalance}` },
// // // // // // //     { id: 'cash', name: 'Cash on Delivery', icon: 'cash-outline', desc: 'Pay when you receive' },
// // // // // // //   ];

// // // // // // //   const handleSelectMethod = (methodId: string) => {
// // // // // // //     Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
// // // // // // //     setSelectedMethod(methodId);
    
// // // // // // //     switch (methodId) {
// // // // // // //       case 'upi':
// // // // // // //         setShowUPIModal(true);
// // // // // // //         break;
// // // // // // //       case 'card':
// // // // // // //         setShowCardModal(true);
// // // // // // //         break;
// // // // // // //       case 'netbanking':
// // // // // // //         setShowNetBankingModal(true);
// // // // // // //         break;
// // // // // // //       case 'wallet':
// // // // // // //         setShowWalletModal(true);
// // // // // // //         break;
// // // // // // //       case 'cash':
// // // // // // //         // Directly call Cash on Delivery with a small delay
// // // // // // //         setTimeout(() => {
// // // // // // //           handleCashOnDelivery();
// // // // // // //         }, 300);
// // // // // // //         break;
// // // // // // //       default:
// // // // // // //         break;
// // // // // // //     }
// // // // // // //   };

// // // // // // //   // ============ UPI FLOW ============
// // // // // // //   const handleUPISelection = (app: any) => {
// // // // // // //     setSelectedUPIApp(app.name);
// // // // // // //     setShowUPIModal(false);
// // // // // // //     setTimeout(() => {
// // // // // // //       setShowUPIPinModal(true);
// // // // // // //     }, 300);
// // // // // // //   };

// // // // // // //   // UPI - Navigate to OrderSuccess
// // // // // // //   const handleUPIPinSubmit = () => {
// // // // // // //     if (upiPin.length !== 4) {
// // // // // // //       Alert.alert('Error', 'Please enter a valid 4-digit UPI PIN');
// // // // // // //       return;
// // // // // // //     }

// // // // // // //     Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
// // // // // // //     setShowUPIPinModal(false);
// // // // // // //     setLoading(true);
// // // // // // //     setUpiPin('');
    
// // // // // // //     setTimeout(() => {
// // // // // // //       setLoading(false);
// // // // // // //       setPaymentSuccess(true);
// // // // // // //       const transactionId = 'UPI' + Date.now().toString().slice(-10);
// // // // // // //       setUpiTransactionId(transactionId);
      
// // // // // // //       navigation.replace('OrderSuccess', {
// // // // // // //         orderId: transactionId,
// // // // // // //         totalAmount: totalAmount,
// // // // // // //         paymentMethod: `${selectedUPIApp || 'UPI'}`,
// // // // // // //       });
// // // // // // //     }, 2000);
// // // // // // //   };

// // // // // // //   // ============ CARD FLOW ============
// // // // // // //   const handleCardPayment = () => {
// // // // // // //     if (!cardNumber || !expiryDate || !cvv || !cardHolder) {
// // // // // // //       Alert.alert('Error', 'Please fill all card details');
// // // // // // //       return;
// // // // // // //     }
// // // // // // //     if (cardNumber.replace(/\s/g, '').length !== 16) {
// // // // // // //       Alert.alert('Error', 'Please enter a valid 16-digit card number');
// // // // // // //       return;
// // // // // // //     }
// // // // // // //     if (cvv.length < 3) {
// // // // // // //       Alert.alert('Error', 'Please enter a valid CVV');
// // // // // // //       return;
// // // // // // //     }

// // // // // // //     Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
// // // // // // //     setShowCardModal(false);
// // // // // // //     setLoading(true);
    
// // // // // // //     setTimeout(() => {
// // // // // // //       setLoading(false);
// // // // // // //       setPaymentSuccess(true);
// // // // // // //       const transactionId = 'CARD' + Date.now().toString().slice(-10);
      
// // // // // // //       navigation.replace('OrderSuccess', {
// // // // // // //         orderId: transactionId,
// // // // // // //         totalAmount: totalAmount,
// // // // // // //         paymentMethod: 'Credit/Debit Card',
// // // // // // //       });
// // // // // // //     }, 2500);
// // // // // // //   };

// // // // // // //   // ============ NET BANKING FLOW ============
// // // // // // //   const handleNetBankingSelect = (bank: any) => {
// // // // // // //     setShowNetBankingModal(false);
    
// // // // // // //     setLoading(true);
// // // // // // //     setTimeout(() => {
// // // // // // //       setLoading(false);
// // // // // // //       setPaymentSuccess(true);
// // // // // // //       const transactionId = 'NB' + Date.now().toString().slice(-10);
      
// // // // // // //       navigation.replace('OrderSuccess', {
// // // // // // //         orderId: transactionId,
// // // // // // //         totalAmount: totalAmount,
// // // // // // //         paymentMethod: `${bank.name} (Net Banking)`,
// // // // // // //       });
// // // // // // //     }, 2000);
// // // // // // //   };

// // // // // // //   // ============ WALLET FLOW ============
// // // // // // //   const handleWalletPayment = () => {
// // // // // // //     if (totalAmount > walletBalance) {
// // // // // // //       Alert.alert(
// // // // // // //         'Insufficient Balance',
// // // // // // //         `Wallet balance: ₹${walletBalance}\nAmount needed: ₹${totalAmount}\n\nPlease add money to your wallet or use another payment method.`,
// // // // // // //         [
// // // // // // //           { text: 'OK', onPress: () => setShowWalletModal(false) }
// // // // // // //         ]
// // // // // // //       );
// // // // // // //       return;
// // // // // // //     }

// // // // // // //     setShowWalletModal(false);
// // // // // // //     setLoading(true);
// // // // // // //     setTimeout(() => {
// // // // // // //       setLoading(false);
// // // // // // //       setPaymentSuccess(true);
// // // // // // //       const transactionId = 'WLT' + Date.now().toString().slice(-10);
      
// // // // // // //       navigation.replace('OrderSuccess', {
// // // // // // //         orderId: transactionId,
// // // // // // //         totalAmount: totalAmount,
// // // // // // //         paymentMethod: 'Wallet',
// // // // // // //       });
// // // // // // //     }, 1500);
// // // // // // //   };

// // // // // // //   // ============ CASH ON DELIVERY ============
// // // // // // //   const handleCashOnDelivery = () => {
// // // // // // //     // Vibrate for feedback
// // // // // // //     Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    
// // // // // // //     Alert.alert(
// // // // // // //       '💳 Cash on Delivery',
// // // // // // //       `Order Total: ₹${totalAmount}\n\nYou will pay ₹${totalAmount} in cash when your order arrives.\n\nPlease keep the exact amount ready.`,
// // // // // // //       [
// // // // // // //         { 
// // // // // // //           text: 'Cancel', 
// // // // // // //           style: 'cancel',
// // // // // // //           onPress: () => {
// // // // // // //             // User cancelled, deselect the method
// // // // // // //             setSelectedMethod('');
// // // // // // //           }
// // // // // // //         },
// // // // // // //         { 
// // // // // // //           text: 'Confirm COD', 
// // // // // // //           onPress: () => {
// // // // // // //             setLoading(true);
// // // // // // //             setTimeout(() => {
// // // // // // //               setLoading(false);
// // // // // // //               setPaymentSuccess(true);
// // // // // // //               const transactionId = 'COD' + Date.now().toString().slice(-10);
              
// // // // // // //               // Navigate to OrderSuccess
// // // // // // //               navigation.replace('OrderSuccess', {
// // // // // // //                 orderId: transactionId,
// // // // // // //                 totalAmount: totalAmount,
// // // // // // //                 paymentMethod: 'Cash on Delivery',
// // // // // // //               });
// // // // // // //             }, 1500);
// // // // // // //           }
// // // // // // //         }
// // // // // // //       ]
// // // // // // //     );
// // // // // // //   };

// // // // // // //   const formatCardNumber = (text: string): string => {
// // // // // // //     const cleaned = text.replace(/\s/g, '');
// // // // // // //     const matches = cleaned.match(/.{1,4}/g);
// // // // // // //     if (matches) {
// // // // // // //       return matches.join(' ');
// // // // // // //     }
// // // // // // //     return text;
// // // // // // //   };

// // // // // // //   const formatExpiryDate = (text: string): string => {
// // // // // // //     const cleaned = text.replace(/\D/g, '');
// // // // // // //     if (cleaned.length >= 2) {
// // // // // // //       return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
// // // // // // //     }
// // // // // // //     return text;
// // // // // // //   };

// // // // // // //   return (
// // // // // // //     <View style={styles.container}>
// // // // // // //       <ScrollView showsVerticalScrollIndicator={false}>
// // // // // // //         {/* Header */}
// // // // // // //         <View style={styles.header}>
// // // // // // //           <TouchableOpacity onPress={() => navigation.goBack()}>
// // // // // // //             <Icon name="arrow-back" size={24} color={colors.text} />
// // // // // // //           </TouchableOpacity>
// // // // // // //           <Text style={styles.headerTitle}>Payment</Text>
// // // // // // //           <View style={{ width: 24 }} />
// // // // // // //         </View>

// // // // // // //         {/* Amount */}
// // // // // // //         <View style={styles.amountContainer}>
// // // // // // //           <Text style={styles.amountLabel}>Amount to Pay</Text>
// // // // // // //           <Text style={styles.amountValue}>₹{totalAmount}</Text>
// // // // // // //         </View>

// // // // // // //         {/* Payment Methods */}
// // // // // // //         <View style={styles.methodsContainer}>
// // // // // // //           <Text style={styles.sectionTitle}>Payment Methods</Text>
// // // // // // //           {paymentMethods.map((method) => (
// // // // // // //             <TouchableOpacity
// // // // // // //               key={method.id}
// // // // // // //               style={[
// // // // // // //                 styles.methodItem,
// // // // // // //                 selectedMethod === method.id && styles.selectedMethod,
// // // // // // //               ]}
// // // // // // //               onPress={() => handleSelectMethod(method.id)}
// // // // // // //             >
// // // // // // //               <View style={styles.methodLeft}>
// // // // // // //                 <View style={[styles.methodIcon, selectedMethod === method.id && styles.selectedMethodIcon]}>
// // // // // // //                   <Icon name={method.icon} size={22} color={selectedMethod === method.id ? colors.white : colors.text} />
// // // // // // //                 </View>
// // // // // // //                 <View style={styles.methodInfo}>
// // // // // // //                   <Text style={[
// // // // // // //                     styles.methodName,
// // // // // // //                     selectedMethod === method.id && styles.selectedMethodText,
// // // // // // //                   ]}>
// // // // // // //                     {method.name}
// // // // // // //                   </Text>
// // // // // // //                   <Text style={styles.methodDesc}>{method.desc}</Text>
// // // // // // //                 </View>
// // // // // // //               </View>
// // // // // // //               {selectedMethod === method.id && (
// // // // // // //                 <Icon name="checkmark-circle" size={24} color={colors.primary} />
// // // // // // //               )}
// // // // // // //             </TouchableOpacity>
// // // // // // //           ))}
// // // // // // //         </View>
// // // // // // //       </ScrollView>

// // // // // // //       {/* ============ UPI MODAL ============ */}
// // // // // // //       <Modal
// // // // // // //         visible={showUPIModal}
// // // // // // //         transparent={true}
// // // // // // //         animationType="slide"
// // // // // // //         onRequestClose={() => setShowUPIModal(false)}
// // // // // // //       >
// // // // // // //         <View style={styles.modalOverlay}>
// // // // // // //           <View style={styles.modalContainer}>
// // // // // // //             <View style={styles.modalHeader}>
// // // // // // //               <Text style={styles.modalTitle}>Select UPI App</Text>
// // // // // // //               <TouchableOpacity onPress={() => setShowUPIModal(false)}>
// // // // // // //                 <Icon name="close" size={24} color={colors.text} />
// // // // // // //               </TouchableOpacity>
// // // // // // //             </View>

// // // // // // //             <View style={styles.upiAppsContainer}>
// // // // // // //               {upiApps.map((app) => (
// // // // // // //                 <TouchableOpacity
// // // // // // //                   key={app.id}
// // // // // // //                   style={styles.upiAppItem}
// // // // // // //                   onPress={() => handleUPISelection(app)}
// // // // // // //                 >
// // // // // // //                   <View style={[styles.upiAppIcon, { backgroundColor: app.color + '20' }]}>
// // // // // // //                     <Text style={styles.upiAppEmoji}>{app.emoji}</Text>
// // // // // // //                   </View>
// // // // // // //                   <View style={styles.upiAppInfo}>
// // // // // // //                     <Text style={styles.upiAppName}>{app.name}</Text>
// // // // // // //                     <Text style={styles.upiAppDesc}>UPI Payment</Text>
// // // // // // //                   </View>
// // // // // // //                   <Icon name="chevron-forward" size={20} color={colors.gray} />
// // // // // // //                 </TouchableOpacity>
// // // // // // //               ))}
// // // // // // //             </View>

// // // // // // //             <TouchableOpacity 
// // // // // // //               style={styles.enterUPIButton}
// // // // // // //               onPress={() => {
// // // // // // //                 setShowUPIModal(false);
// // // // // // //                 setSelectedUPIApp('Manual UPI');
// // // // // // //                 setTimeout(() => {
// // // // // // //                   setShowUPIPinModal(true);
// // // // // // //                 }, 300);
// // // // // // //               }}
// // // // // // //             >
// // // // // // //               <Text style={styles.enterUPIButtonText}>Enter UPI ID Manually</Text>
// // // // // // //             </TouchableOpacity>
// // // // // // //           </View>
// // // // // // //         </View>
// // // // // // //       </Modal>

// // // // // // //       {/* ============ UPI PIN MODAL ============ */}
// // // // // // //       <Modal
// // // // // // //         visible={showUPIPinModal}
// // // // // // //         transparent={true}
// // // // // // //         animationType="fade"
// // // // // // //         onRequestClose={() => {
// // // // // // //           setShowUPIPinModal(false);
// // // // // // //           setUpiPin('');
// // // // // // //         }}
// // // // // // //       >
// // // // // // //         <View style={styles.pinModalOverlay}>
// // // // // // //           <View style={styles.pinModalContainer}>
// // // // // // //             <View style={styles.pinModalHeader}>
// // // // // // //               <Text style={styles.pinModalTitle}>
// // // // // // //                 {selectedUPIApp || 'UPI'} PIN
// // // // // // //               </Text>
// // // // // // //               <Text style={styles.pinModalSubtitle}>
// // // // // // //                 Enter your 4-digit UPI PIN to confirm payment
// // // // // // //               </Text>
// // // // // // //             </View>

// // // // // // //             <View style={styles.pinDisplayContainer}>
// // // // // // //               <View style={styles.pinDisplay}>
// // // // // // //                 {[0, 1, 2, 3].map((index) => (
// // // // // // //                   <View key={index} style={styles.pinDotContainer}>
// // // // // // //                     <View style={[
// // // // // // //                       styles.pinDot,
// // // // // // //                       upiPin.length > index && styles.pinDotFilled,
// // // // // // //                     ]} />
// // // // // // //                   </View>
// // // // // // //                 ))}
// // // // // // //               </View>
// // // // // // //             </View>

// // // // // // //             <View style={styles.pinKeyboard}>
// // // // // // //               {[1, 2, 3, 4, 5, 6, 7, 8, 9, 'clear', 0, 'delete'].map((key) => (
// // // // // // //                 <TouchableOpacity
// // // // // // //                   key={key.toString()}
// // // // // // //                   style={styles.pinKey}
// // // // // // //                   onPress={() => {
// // // // // // //                     if (key === 'clear') {
// // // // // // //                       setUpiPin('');
// // // // // // //                     } else if (key === 'delete') {
// // // // // // //                       setUpiPin(upiPin.slice(0, -1));
// // // // // // //                     } else if (upiPin.length < 4) {
// // // // // // //                       setUpiPin(upiPin + key.toString());
// // // // // // //                     }
// // // // // // //                   }}
// // // // // // //                 >
// // // // // // //                   <Text style={styles.pinKeyText}>
// // // // // // //                     {key === 'clear' ? 'Clear' : key === 'delete' ? '⌫' : key}
// // // // // // //                   </Text>
// // // // // // //                 </TouchableOpacity>
// // // // // // //               ))}
// // // // // // //             </View>

// // // // // // //             <TouchableOpacity
// // // // // // //               style={[styles.pinConfirmButton, upiPin.length !== 4 && styles.pinConfirmButtonDisabled]}
// // // // // // //               onPress={handleUPIPinSubmit}
// // // // // // //               disabled={upiPin.length !== 4}
// // // // // // //             >
// // // // // // //               <Text style={styles.pinConfirmButtonText}>
// // // // // // //                 Pay ₹{totalAmount}
// // // // // // //               </Text>
// // // // // // //             </TouchableOpacity>

// // // // // // //             <TouchableOpacity
// // // // // // //               style={styles.pinCancelButton}
// // // // // // //               onPress={() => {
// // // // // // //                 setShowUPIPinModal(false);
// // // // // // //                 setUpiPin('');
// // // // // // //               }}
// // // // // // //             >
// // // // // // //               <Text style={styles.pinCancelButtonText}>Cancel</Text>
// // // // // // //             </TouchableOpacity>
// // // // // // //           </View>
// // // // // // //         </View>
// // // // // // //       </Modal>

// // // // // // //       {/* ============ CARD MODAL ============ */}
// // // // // // //       <Modal
// // // // // // //         visible={showCardModal}
// // // // // // //         transparent={true}
// // // // // // //         animationType="slide"
// // // // // // //         onRequestClose={() => setShowCardModal(false)}
// // // // // // //       >
// // // // // // //         <View style={styles.modalOverlay}>
// // // // // // //           <View style={styles.modalContainer}>
// // // // // // //             <View style={styles.modalHeader}>
// // // // // // //               <Text style={styles.modalTitle}>Card Details</Text>
// // // // // // //               <TouchableOpacity onPress={() => setShowCardModal(false)}>
// // // // // // //                 <Icon name="close" size={24} color={colors.text} />
// // // // // // //               </TouchableOpacity>
// // // // // // //             </View>

// // // // // // //             <View style={styles.cardModalBody}>
// // // // // // //               <View style={styles.cardPreview}>
// // // // // // //                 <Icon name="card-outline" size={40} color={colors.primary} />
// // // // // // //                 <Text style={styles.cardPreviewText}>Enter Card Details</Text>
// // // // // // //               </View>

// // // // // // //               <View style={styles.inputContainer}>
// // // // // // //                 <Text style={styles.inputLabel}>Card Number</Text>
// // // // // // //                 <TextInput
// // // // // // //                   style={styles.input}
// // // // // // //                   placeholder="1234 5678 9012 3456"
// // // // // // //                   value={cardNumber}
// // // // // // //                   onChangeText={(text) => setCardNumber(formatCardNumber(text))}
// // // // // // //                   keyboardType="numeric"
// // // // // // //                   maxLength={19}
// // // // // // //                 />
// // // // // // //               </View>

// // // // // // //               <View style={styles.inputContainer}>
// // // // // // //                 <Text style={styles.inputLabel}>Card Holder Name</Text>
// // // // // // //                 <TextInput
// // // // // // //                   style={styles.input}
// // // // // // //                   placeholder="John Doe"
// // // // // // //                   value={cardHolder}
// // // // // // //                   onChangeText={setCardHolder}
// // // // // // //                 />
// // // // // // //               </View>

// // // // // // //               <View style={styles.rowInputs}>
// // // // // // //                 <View style={[styles.inputContainer, styles.halfInput]}>
// // // // // // //                   <Text style={styles.inputLabel}>Expiry Date</Text>
// // // // // // //                   <TextInput
// // // // // // //                     style={styles.input}
// // // // // // //                     placeholder="MM/YY"
// // // // // // //                     value={expiryDate}
// // // // // // //                     onChangeText={(text) => setExpiryDate(formatExpiryDate(text))}
// // // // // // //                     keyboardType="numeric"
// // // // // // //                     maxLength={5}
// // // // // // //                   />
// // // // // // //                 </View>
// // // // // // //                 <View style={[styles.inputContainer, styles.halfInput]}>
// // // // // // //                   <Text style={styles.inputLabel}>CVV</Text>
// // // // // // //                   <TextInput
// // // // // // //                     style={styles.input}
// // // // // // //                     placeholder="123"
// // // // // // //                     value={cvv}
// // // // // // //                     onChangeText={setCvv}
// // // // // // //                     keyboardType="numeric"
// // // // // // //                     maxLength={4}
// // // // // // //                     secureTextEntry
// // // // // // //                   />
// // // // // // //                 </View>
// // // // // // //               </View>

// // // // // // //               <TouchableOpacity 
// // // // // // //                 style={styles.payNowButton} 
// // // // // // //                 onPress={handleCardPayment}
// // // // // // //                 disabled={loading}
// // // // // // //               >
// // // // // // //                 {loading ? (
// // // // // // //                   <ActivityIndicator color="#ffffff" />
// // // // // // //                 ) : (
// // // // // // //                   <Text style={styles.payNowButtonText}>Pay ₹{totalAmount}</Text>
// // // // // // //                 )}
// // // // // // //               </TouchableOpacity>
// // // // // // //             </View>
// // // // // // //           </View>
// // // // // // //         </View>
// // // // // // //       </Modal>

// // // // // // //       {/* ============ NET BANKING MODAL ============ */}
// // // // // // //       <Modal
// // // // // // //         visible={showNetBankingModal}
// // // // // // //         transparent={true}
// // // // // // //         animationType="slide"
// // // // // // //         onRequestClose={() => setShowNetBankingModal(false)}
// // // // // // //       >
// // // // // // //         <View style={styles.modalOverlay}>
// // // // // // //           <View style={styles.modalContainer}>
// // // // // // //             <View style={styles.modalHeader}>
// // // // // // //               <Text style={styles.modalTitle}>Select Bank</Text>
// // // // // // //               <TouchableOpacity onPress={() => setShowNetBankingModal(false)}>
// // // // // // //                 <Icon name="close" size={24} color={colors.text} />
// // // // // // //               </TouchableOpacity>
// // // // // // //             </View>

// // // // // // //             <View style={styles.banksContainer}>
// // // // // // //               {banks.map((bank) => (
// // // // // // //                 <TouchableOpacity
// // // // // // //                   key={bank.id}
// // // // // // //                   style={styles.bankItem}
// // // // // // //                   onPress={() => handleNetBankingSelect(bank)}
// // // // // // //                 >
// // // // // // //                   <View style={[styles.bankIcon, { backgroundColor: bank.color + '20' }]}>
// // // // // // //                     <Text style={styles.bankEmoji}>{bank.icon}</Text>
// // // // // // //                   </View>
// // // // // // //                   <View style={styles.bankInfo}>
// // // // // // //                     <Text style={styles.bankName}>{bank.name}</Text>
// // // // // // //                     <Text style={styles.bankDesc}>Net Banking</Text>
// // // // // // //                   </View>
// // // // // // //                   <Icon name="chevron-forward" size={20} color={colors.gray} />
// // // // // // //                 </TouchableOpacity>
// // // // // // //               ))}
// // // // // // //             </View>
// // // // // // //           </View>
// // // // // // //         </View>
// // // // // // //       </Modal>

// // // // // // //       {/* ============ WALLET MODAL ============ */}
// // // // // // //       <Modal
// // // // // // //         visible={showWalletModal}
// // // // // // //         transparent={true}
// // // // // // //         animationType="slide"
// // // // // // //         onRequestClose={() => setShowWalletModal(false)}
// // // // // // //       >
// // // // // // //         <View style={styles.modalOverlay}>
// // // // // // //           <View style={styles.modalContainer}>
// // // // // // //             <View style={styles.modalHeader}>
// // // // // // //               <Text style={styles.modalTitle}>Pay with Wallet</Text>
// // // // // // //               <TouchableOpacity onPress={() => setShowWalletModal(false)}>
// // // // // // //                 <Icon name="close" size={24} color={colors.text} />
// // // // // // //               </TouchableOpacity>
// // // // // // //             </View>

// // // // // // //             <View style={styles.walletModalBody}>
// // // // // // //               <View style={styles.walletBalanceContainer}>
// // // // // // //                 <Icon name="wallet-outline" size={40} color={colors.primary} />
// // // // // // //                 <Text style={styles.walletBalanceTitle}>Wallet Balance</Text>
// // // // // // //                 <Text style={styles.walletBalanceAmount}>₹{walletBalance}</Text>
// // // // // // //               </View>

// // // // // // //               <View style={styles.walletInfoContainer}>
// // // // // // //                 <View style={styles.walletInfoRow}>
// // // // // // //                   <Text style={styles.walletInfoLabel}>Order Total</Text>
// // // // // // //                   <Text style={styles.walletInfoValue}>₹{totalAmount}</Text>
// // // // // // //                 </View>
// // // // // // //                 <View style={styles.walletInfoRow}>
// // // // // // //                   <Text style={styles.walletInfoLabel}>Balance After Payment</Text>
// // // // // // //                   <Text style={[styles.walletInfoValue, { color: totalAmount <= walletBalance ? colors.success : colors.danger }]}>
// // // // // // //                     ₹{walletBalance - totalAmount}
// // // // // // //                   </Text>
// // // // // // //                 </View>
// // // // // // //               </View>

// // // // // // //               <TouchableOpacity 
// // // // // // //                 style={[styles.walletPayButton, totalAmount > walletBalance && styles.walletPayButtonDisabled]}
// // // // // // //                 onPress={handleWalletPayment}
// // // // // // //                 disabled={loading || totalAmount > walletBalance}
// // // // // // //               >
// // // // // // //                 {loading ? (
// // // // // // //                   <ActivityIndicator color="#ffffff" />
// // // // // // //                 ) : (
// // // // // // //                   <Text style={styles.walletPayButtonText}>
// // // // // // //                     {totalAmount > walletBalance ? 'Insufficient Balance' : `Pay ₹${totalAmount}`}
// // // // // // //                   </Text>
// // // // // // //                 )}
// // // // // // //               </TouchableOpacity>
// // // // // // //             </View>
// // // // // // //           </View>
// // // // // // //         </View>
// // // // // // //       </Modal>

// // // // // // //       {/* Loading Overlay */}
// // // // // // //       {loading && (
// // // // // // //         <View style={styles.loadingOverlay}>
// // // // // // //           <View style={styles.loadingContainer}>
// // // // // // //             <ActivityIndicator size="large" color={colors.primary} />
// // // // // // //             <Text style={styles.loadingText}>Processing Payment...</Text>
// // // // // // //             <Text style={styles.loadingSubText}>Please do not close the app</Text>
// // // // // // //           </View>
// // // // // // //         </View>
// // // // // // //       )}
// // // // // // //     </View>
// // // // // // //   );
// // // // // // // }

// // // // // // // const styles = StyleSheet.create({
// // // // // // //   container: {
// // // // // // //     flex: 1,
// // // // // // //     backgroundColor: colors.white,
// // // // // // //   },
// // // // // // //   header: {
// // // // // // //     flexDirection: 'row',
// // // // // // //     alignItems: 'center',
// // // // // // //     justifyContent: 'space-between',
// // // // // // //     padding: 16,
// // // // // // //     paddingTop: 40,
// // // // // // //     borderBottomWidth: 1,
// // // // // // //     borderBottomColor: colors.border,
// // // // // // //   },
// // // // // // //   headerTitle: {
// // // // // // //     fontSize: 18,
// // // // // // //     fontWeight: '600',
// // // // // // //     color: colors.text,
// // // // // // //   },
// // // // // // //   amountContainer: {
// // // // // // //     backgroundColor: colors.primary,
// // // // // // //     padding: 20,
// // // // // // //     margin: 16,
// // // // // // //     borderRadius: 12,
// // // // // // //     alignItems: 'center',
// // // // // // //   },
// // // // // // //   amountLabel: {
// // // // // // //     fontSize: 14,
// // // // // // //     color: colors.white,
// // // // // // //     opacity: 0.8,
// // // // // // //   },
// // // // // // //   amountValue: {
// // // // // // //     fontSize: 28,
// // // // // // //     fontWeight: '700',
// // // // // // //     color: colors.white,
// // // // // // //     marginTop: 4,
// // // // // // //   },
// // // // // // //   methodsContainer: {
// // // // // // //     paddingHorizontal: 16,
// // // // // // //     paddingBottom: 20,
// // // // // // //   },
// // // // // // //   sectionTitle: {
// // // // // // //     fontSize: 16,
// // // // // // //     fontWeight: '600',
// // // // // // //     color: colors.text,
// // // // // // //     marginBottom: 12,
// // // // // // //   },
// // // // // // //   methodItem: {
// // // // // // //     flexDirection: 'row',
// // // // // // //     justifyContent: 'space-between',
// // // // // // //     alignItems: 'center',
// // // // // // //     padding: 14,
// // // // // // //     borderWidth: 1,
// // // // // // //     borderColor: colors.border,
// // // // // // //     borderRadius: 10,
// // // // // // //     marginBottom: 8,
// // // // // // //   },
// // // // // // //   selectedMethod: {
// // // // // // //     borderColor: colors.primary,
// // // // // // //     backgroundColor: '#fff5ec',
// // // // // // //   },
// // // // // // //   methodLeft: {
// // // // // // //     flexDirection: 'row',
// // // // // // //     alignItems: 'center',
// // // // // // //     flex: 1,
// // // // // // //   },
// // // // // // //   methodIcon: {
// // // // // // //     width: 36,
// // // // // // //     height: 36,
// // // // // // //     borderRadius: 18,
// // // // // // //     backgroundColor: colors.lightGray,
// // // // // // //     justifyContent: 'center',
// // // // // // //     alignItems: 'center',
// // // // // // //     marginRight: 12,
// // // // // // //   },
// // // // // // //   selectedMethodIcon: {
// // // // // // //     backgroundColor: colors.primary,
// // // // // // //   },
// // // // // // //   methodInfo: {
// // // // // // //     flex: 1,
// // // // // // //   },
// // // // // // //   methodName: {
// // // // // // //     fontSize: 14,
// // // // // // //     color: colors.text,
// // // // // // //   },
// // // // // // //   selectedMethodText: {
// // // // // // //     color: colors.primary,
// // // // // // //     fontWeight: '500',
// // // // // // //   },
// // // // // // //   methodDesc: {
// // // // // // //     fontSize: 11,
// // // // // // //     color: colors.textLight,
// // // // // // //     marginTop: 1,
// // // // // // //   },
// // // // // // //   modalOverlay: {
// // // // // // //     flex: 1,
// // // // // // //     backgroundColor: 'rgba(0,0,0,0.5)',
// // // // // // //     justifyContent: 'flex-end',
// // // // // // //   },
// // // // // // //   modalContainer: {
// // // // // // //     backgroundColor: colors.white,
// // // // // // //     borderTopLeftRadius: 24,
// // // // // // //     borderTopRightRadius: 24,
// // // // // // //     paddingHorizontal: 20,
// // // // // // //     paddingBottom: 30,
// // // // // // //     maxHeight: '80%',
// // // // // // //   },
// // // // // // //   modalHeader: {
// // // // // // //     flexDirection: 'row',
// // // // // // //     justifyContent: 'space-between',
// // // // // // //     alignItems: 'center',
// // // // // // //     paddingVertical: 16,
// // // // // // //     borderBottomWidth: 1,
// // // // // // //     borderBottomColor: colors.border,
// // // // // // //   },
// // // // // // //   modalTitle: {
// // // // // // //     fontSize: 18,
// // // // // // //     fontWeight: '600',
// // // // // // //     color: colors.text,
// // // // // // //   },
// // // // // // //   upiAppsContainer: {
// // // // // // //     marginTop: 12,
// // // // // // //   },
// // // // // // //   upiAppItem: {
// // // // // // //     flexDirection: 'row',
// // // // // // //     alignItems: 'center',
// // // // // // //     paddingVertical: 14,
// // // // // // //     borderBottomWidth: 1,
// // // // // // //     borderBottomColor: colors.border,
// // // // // // //   },
// // // // // // //   upiAppIcon: {
// // // // // // //     width: 48,
// // // // // // //     height: 48,
// // // // // // //     borderRadius: 24,
// // // // // // //     justifyContent: 'center',
// // // // // // //     alignItems: 'center',
// // // // // // //     marginRight: 12,
// // // // // // //   },
// // // // // // //   upiAppEmoji: {
// // // // // // //     fontSize: 24,
// // // // // // //   },
// // // // // // //   upiAppInfo: {
// // // // // // //     flex: 1,
// // // // // // //   },
// // // // // // //   upiAppName: {
// // // // // // //     fontSize: 15,
// // // // // // //     fontWeight: '500',
// // // // // // //     color: colors.text,
// // // // // // //   },
// // // // // // //   upiAppDesc: {
// // // // // // //     fontSize: 12,
// // // // // // //     color: colors.textLight,
// // // // // // //     marginTop: 2,
// // // // // // //   },
// // // // // // //   enterUPIButton: {
// // // // // // //     marginTop: 16,
// // // // // // //     paddingVertical: 12,
// // // // // // //     borderWidth: 1,
// // // // // // //     borderColor: colors.primary,
// // // // // // //     borderRadius: 8,
// // // // // // //     alignItems: 'center',
// // // // // // //   },
// // // // // // //   enterUPIButtonText: {
// // // // // // //     color: colors.primary,
// // // // // // //     fontSize: 14,
// // // // // // //     fontWeight: '500',
// // // // // // //   },
// // // // // // //   pinModalOverlay: {
// // // // // // //     flex: 1,
// // // // // // //     backgroundColor: 'rgba(0,0,0,0.7)',
// // // // // // //     justifyContent: 'center',
// // // // // // //     alignItems: 'center',
// // // // // // //   },
// // // // // // //   pinModalContainer: {
// // // // // // //     backgroundColor: colors.white,
// // // // // // //     borderRadius: 24,
// // // // // // //     padding: 24,
// // // // // // //     width: '85%',
// // // // // // //     maxWidth: 400,
// // // // // // //   },
// // // // // // //   pinModalHeader: {
// // // // // // //     alignItems: 'center',
// // // // // // //     marginBottom: 20,
// // // // // // //   },
// // // // // // //   pinModalTitle: {
// // // // // // //     fontSize: 20,
// // // // // // //     fontWeight: '700',
// // // // // // //     color: colors.text,
// // // // // // //   },
// // // // // // //   pinModalSubtitle: {
// // // // // // //     fontSize: 14,
// // // // // // //     color: colors.textLight,
// // // // // // //     marginTop: 4,
// // // // // // //   },
// // // // // // //   pinDisplayContainer: {
// // // // // // //     alignItems: 'center',
// // // // // // //     marginBottom: 24,
// // // // // // //   },
// // // // // // //   pinDisplay: {
// // // // // // //     flexDirection: 'row',
// // // // // // //     justifyContent: 'center',
// // // // // // //   },
// // // // // // //   pinDotContainer: {
// // // // // // //     marginHorizontal: 8,
// // // // // // //   },
// // // // // // //   pinDot: {
// // // // // // //     width: 16,
// // // // // // //     height: 16,
// // // // // // //     borderRadius: 8,
// // // // // // //     borderWidth: 2,
// // // // // // //     borderColor: colors.border,
// // // // // // //     backgroundColor: colors.white,
// // // // // // //   },
// // // // // // //   pinDotFilled: {
// // // // // // //     backgroundColor: colors.primary,
// // // // // // //     borderColor: colors.primary,
// // // // // // //   },
// // // // // // //   pinKeyboard: {
// // // // // // //     flexDirection: 'row',
// // // // // // //     flexWrap: 'wrap',
// // // // // // //     justifyContent: 'center',
// // // // // // //     marginBottom: 16,
// // // // // // //   },
// // // // // // //   pinKey: {
// // // // // // //     width: '30%',
// // // // // // //     aspectRatio: 1.2,
// // // // // // //     justifyContent: 'center',
// // // // // // //     alignItems: 'center',
// // // // // // //     margin: '1.5%',
// // // // // // //     borderRadius: 12,
// // // // // // //     backgroundColor: colors.lightGray,
// // // // // // //   },
// // // // // // //   pinKeyText: {
// // // // // // //     fontSize: 22,
// // // // // // //     fontWeight: '500',
// // // // // // //     color: colors.text,
// // // // // // //   },
// // // // // // //   pinConfirmButton: {
// // // // // // //     backgroundColor: colors.primary,
// // // // // // //     paddingVertical: 14,
// // // // // // //     borderRadius: 12,
// // // // // // //     alignItems: 'center',
// // // // // // //     marginBottom: 8,
// // // // // // //   },
// // // // // // //   pinConfirmButtonDisabled: {
// // // // // // //     backgroundColor: colors.gray,
// // // // // // //   },
// // // // // // //   pinConfirmButtonText: {
// // // // // // //     color: colors.white,
// // // // // // //     fontSize: 16,
// // // // // // //     fontWeight: '600',
// // // // // // //   },
// // // // // // //   pinCancelButton: {
// // // // // // //     paddingVertical: 10,
// // // // // // //     alignItems: 'center',
// // // // // // //   },
// // // // // // //   pinCancelButtonText: {
// // // // // // //     color: colors.textLight,
// // // // // // //     fontSize: 14,
// // // // // // //   },
// // // // // // //   cardModalBody: {
// // // // // // //     marginTop: 8,
// // // // // // //   },
// // // // // // //   cardPreview: {
// // // // // // //     alignItems: 'center',
// // // // // // //     paddingVertical: 20,
// // // // // // //     backgroundColor: '#f8f9fa',
// // // // // // //     borderRadius: 12,
// // // // // // //     marginBottom: 16,
// // // // // // //   },
// // // // // // //   cardPreviewText: {
// // // // // // //     fontSize: 14,
// // // // // // //     color: colors.textLight,
// // // // // // //     marginTop: 8,
// // // // // // //   },
// // // // // // //   inputContainer: {
// // // // // // //     marginBottom: 12,
// // // // // // //   },
// // // // // // //   inputLabel: {
// // // // // // //     fontSize: 14,
// // // // // // //     fontWeight: '500',
// // // // // // //     color: colors.text,
// // // // // // //     marginBottom: 4,
// // // // // // //   },
// // // // // // //   input: {
// // // // // // //     borderWidth: 1,
// // // // // // //     borderColor: colors.border,
// // // // // // //     borderRadius: 8,
// // // // // // //     paddingHorizontal: 12,
// // // // // // //     paddingVertical: 10,
// // // // // // //     fontSize: 14,
// // // // // // //     color: colors.text,
// // // // // // //     backgroundColor: colors.white,
// // // // // // //   },
// // // // // // //   rowInputs: {
// // // // // // //     flexDirection: 'row',
// // // // // // //     justifyContent: 'space-between',
// // // // // // //   },
// // // // // // //   halfInput: {
// // // // // // //     flex: 1,
// // // // // // //     marginRight: 8,
// // // // // // //   },
// // // // // // //   payNowButton: {
// // // // // // //     backgroundColor: colors.primary,
// // // // // // //     borderRadius: 12,
// // // // // // //     height: 50,
// // // // // // //     justifyContent: 'center',
// // // // // // //     alignItems: 'center',
// // // // // // //     marginTop: 8,
// // // // // // //   },
// // // // // // //   payNowButtonText: {
// // // // // // //     color: colors.white,
// // // // // // //     fontSize: 16,
// // // // // // //     fontWeight: '600',
// // // // // // //   },
// // // // // // //   banksContainer: {
// // // // // // //     marginTop: 12,
// // // // // // //   },
// // // // // // //   bankItem: {
// // // // // // //     flexDirection: 'row',
// // // // // // //     alignItems: 'center',
// // // // // // //     paddingVertical: 14,
// // // // // // //     borderBottomWidth: 1,
// // // // // // //     borderBottomColor: colors.border,
// // // // // // //   },
// // // // // // //   bankIcon: {
// // // // // // //     width: 44,
// // // // // // //     height: 44,
// // // // // // //     borderRadius: 22,
// // // // // // //     justifyContent: 'center',
// // // // // // //     alignItems: 'center',
// // // // // // //     marginRight: 12,
// // // // // // //   },
// // // // // // //   bankEmoji: {
// // // // // // //     fontSize: 20,
// // // // // // //   },
// // // // // // //   bankInfo: {
// // // // // // //     flex: 1,
// // // // // // //   },
// // // // // // //   bankName: {
// // // // // // //     fontSize: 14,
// // // // // // //     fontWeight: '500',
// // // // // // //     color: colors.text,
// // // // // // //   },
// // // // // // //   bankDesc: {
// // // // // // //     fontSize: 12,
// // // // // // //     color: colors.textLight,
// // // // // // //     marginTop: 1,
// // // // // // //   },
// // // // // // //   walletModalBody: {
// // // // // // //     marginTop: 8,
// // // // // // //   },
// // // // // // //   walletBalanceContainer: {
// // // // // // //     alignItems: 'center',
// // // // // // //     paddingVertical: 20,
// // // // // // //     backgroundColor: '#f8f9fa',
// // // // // // //     borderRadius: 12,
// // // // // // //     marginBottom: 16,
// // // // // // //   },
// // // // // // //   walletBalanceTitle: {
// // // // // // //     fontSize: 14,
// // // // // // //     color: colors.textLight,
// // // // // // //     marginTop: 8,
// // // // // // //   },
// // // // // // //   walletBalanceAmount: {
// // // // // // //     fontSize: 28,
// // // // // // //     fontWeight: '700',
// // // // // // //     color: colors.primary,
// // // // // // //     marginTop: 4,
// // // // // // //   },
// // // // // // //   walletInfoContainer: {
// // // // // // //     backgroundColor: '#f8f9fa',
// // // // // // //     borderRadius: 12,
// // // // // // //     padding: 16,
// // // // // // //     marginBottom: 16,
// // // // // // //   },
// // // // // // //   walletInfoRow: {
// // // // // // //     flexDirection: 'row',
// // // // // // //     justifyContent: 'space-between',
// // // // // // //     paddingVertical: 4,
// // // // // // //   },
// // // // // // //   walletInfoLabel: {
// // // // // // //     fontSize: 14,
// // // // // // //     color: colors.textLight,
// // // // // // //   },
// // // // // // //   walletInfoValue: {
// // // // // // //     fontSize: 14,
// // // // // // //     fontWeight: '500',
// // // // // // //     color: colors.text,
// // // // // // //   },
// // // // // // //   walletPayButton: {
// // // // // // //     backgroundColor: colors.primary,
// // // // // // //     borderRadius: 12,
// // // // // // //     height: 50,
// // // // // // //     justifyContent: 'center',
// // // // // // //     alignItems: 'center',
// // // // // // //   },
// // // // // // //   walletPayButtonDisabled: {
// // // // // // //     backgroundColor: colors.gray,
// // // // // // //   },
// // // // // // //   walletPayButtonText: {
// // // // // // //     color: colors.white,
// // // // // // //     fontSize: 16,
// // // // // // //     fontWeight: '600',
// // // // // // //   },
// // // // // // //   loadingOverlay: {
// // // // // // //     position: 'absolute',
// // // // // // //     top: 0,
// // // // // // //     left: 0,
// // // // // // //     right: 0,
// // // // // // //     bottom: 0,
// // // // // // //     backgroundColor: 'rgba(0,0,0,0.7)',
// // // // // // //     justifyContent: 'center',
// // // // // // //     alignItems: 'center',
// // // // // // //   },
// // // // // // //   loadingContainer: {
// // // // // // //     backgroundColor: colors.white,
// // // // // // //     padding: 30,
// // // // // // //     borderRadius: 16,
// // // // // // //     alignItems: 'center',
// // // // // // //     minWidth: 200,
// // // // // // //   },
// // // // // // //   loadingText: {
// // // // // // //     fontSize: 16,
// // // // // // //     fontWeight: '600',
// // // // // // //     color: colors.text,
// // // // // // //     marginTop: 12,
// // // // // // //   },
// // // // // // //   loadingSubText: {
// // // // // // //     fontSize: 12,
// // // // // // //     color: colors.textLight,
// // // // // // //     marginTop: 4,
// // // // // // //   },
// // // // // // // });
// // // // // // import React, { useState } from 'react';
// // // // // // import {
// // // // // //   View,
// // // // // //   Text,
// // // // // //   ScrollView,
// // // // // //   TouchableOpacity,
// // // // // //   StyleSheet,
// // // // // //   TextInput,
// // // // // //   Alert,
// // // // // //   Modal,
// // // // // //   ActivityIndicator,
// // // // // // } from 'react-native';
// // // // // // import * as Haptics from 'expo-haptics';
// // // // // // import Icon from 'react-native-vector-icons/Ionicons';
// // // // // // import { colors } from '../../constants/colors';

// // // // // // interface PaymentScreenProps {
// // // // // //   navigation: any;
// // // // // //   route: any;
// // // // // // }

// // // // // // export default function PaymentScreen({ route, navigation }: PaymentScreenProps) {
// // // // // //   const { totalAmount } = route.params || { totalAmount: 461 };
// // // // // //   const [selectedMethod, setSelectedMethod] = useState<string>('cash');
// // // // // //   const [showUPIModal, setShowUPIModal] = useState<boolean>(false);
// // // // // //   const [selectedUPIApp, setSelectedUPIApp] = useState<string>('');
// // // // // //   const [showUPIPinModal, setShowUPIPinModal] = useState<boolean>(false);
// // // // // //   const [upiPin, setUpiPin] = useState<string>('');
// // // // // //   const [showCardModal, setShowCardModal] = useState<boolean>(false);
// // // // // //   const [showNetBankingModal, setShowNetBankingModal] = useState<boolean>(false);
// // // // // //   const [showWalletModal, setShowWalletModal] = useState<boolean>(false);
// // // // // //   const [loading, setLoading] = useState<boolean>(false);
// // // // // //   const [paymentSuccess, setPaymentSuccess] = useState<boolean>(false);
  
// // // // // //   // Card Details
// // // // // //   const [cardNumber, setCardNumber] = useState<string>('');
// // // // // //   const [expiryDate, setExpiryDate] = useState<string>('');
// // // // // //   const [cvv, setCvv] = useState<string>('');
// // // // // //   const [cardHolder, setCardHolder] = useState<string>('');

// // // // // //   // Wallet
// // // // // //   const walletBalance = 2500;

// // // // // //   // Net Banking Banks
// // // // // //   const banks = [
// // // // // //     { id: 'sbi', name: 'State Bank of India', icon: '🏦', color: '#2E6B98' },
// // // // // //     { id: 'hdfc', name: 'HDFC Bank', icon: '🏛️', color: '#004F8C' },
// // // // // //     { id: 'icici', name: 'ICICI Bank', icon: '🏛️', color: '#F58A1E' },
// // // // // //     { id: 'axis', name: 'Axis Bank', icon: '🏦', color: '#8B1A2B' },
// // // // // //     { id: 'kotak', name: 'Kotak Mahindra Bank', icon: '🏦', color: '#003F6C' },
// // // // // //     { id: 'yes', name: 'Yes Bank', icon: '🏛️', color: '#1B4F7A' },
// // // // // //     { id: 'pnb', name: 'Punjab National Bank', icon: '🏦', color: '#008C45' },
// // // // // //     { id: 'bob', name: 'Bank of Baroda', icon: '🏛️', color: '#0F4C81' },
// // // // // //   ];

// // // // // //   // UPI Apps
// // // // // //   const upiApps = [
// // // // // //     { id: 'gpay', name: 'Google Pay', emoji: '🟢', color: '#4285F4' },
// // // // // //     { id: 'phonepe', name: 'PhonePe', emoji: '🟣', color: '#5F259F' },
// // // // // //     { id: 'paytm', name: 'Paytm', emoji: '🔵', color: '#00BAF2' },
// // // // // //     { id: 'amazonpay', name: 'Amazon Pay', emoji: '🟠', color: '#FF9900' },
// // // // // //     { id: 'bhim', name: 'BHIM UPI', emoji: '🔷', color: '#0084B4' },
// // // // // //   ];

// // // // // //   const paymentMethods: { id: string; name: string; icon: string; desc: string }[] = [
// // // // // //     { id: 'card', name: 'Credit/Debit Card', icon: 'card-outline', desc: 'Pay with card' },
// // // // // //     { id: 'upi', name: 'UPI', icon: 'phone-portrait-outline', desc: 'Google Pay, PhonePe, Paytm' },
// // // // // //     { id: 'netbanking', name: 'Net Banking', icon: 'business-outline', desc: 'All major banks' },
// // // // // //     { id: 'wallet', name: 'Wallet', icon: 'wallet-outline', desc: `Balance: ₹${walletBalance}` },
// // // // // //     { id: 'cash', name: 'Cash on Delivery', icon: 'cash-outline', desc: 'Pay when you receive' },
// // // // // //   ];

// // // // // //   const handleSelectMethod = (methodId: string) => {
// // // // // //     Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
// // // // // //     setSelectedMethod(methodId);
    
// // // // // //     switch (methodId) {
// // // // // //       case 'upi':
// // // // // //         setShowUPIModal(true);
// // // // // //         break;
// // // // // //       case 'card':
// // // // // //         setShowCardModal(true);
// // // // // //         break;
// // // // // //       case 'netbanking':
// // // // // //         setShowNetBankingModal(true);
// // // // // //         break;
// // // // // //       case 'wallet':
// // // // // //         setShowWalletModal(true);
// // // // // //         break;
// // // // // //       case 'cash':
// // // // // //         // COD selected - show alert with place order option
// // // // // //         handleCashOnDelivery();
// // // // // //         break;
// // // // // //       default:
// // // // // //         break;
// // // // // //     }
// // // // // //   };

// // // // // //   // ============ UPI FLOW ============
// // // // // //   const handleUPISelection = (app: any) => {
// // // // // //     setSelectedUPIApp(app.name);
// // // // // //     setShowUPIModal(false);
// // // // // //     setTimeout(() => {
// // // // // //       setShowUPIPinModal(true);
// // // // // //     }, 300);
// // // // // //   };

// // // // // //   const handleUPIPinSubmit = () => {
// // // // // //     if (upiPin.length !== 4) {
// // // // // //       Alert.alert('Error', 'Please enter a valid 4-digit UPI PIN');
// // // // // //       return;
// // // // // //     }

// // // // // //     Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
// // // // // //     setShowUPIPinModal(false);
// // // // // //     setLoading(true);
// // // // // //     setUpiPin('');
    
// // // // // //     setTimeout(() => {
// // // // // //       setLoading(false);
// // // // // //       setPaymentSuccess(true);
// // // // // //       const transactionId = 'UPI' + Date.now().toString().slice(-10);
      
// // // // // //       navigation.replace('OrderSuccess', {
// // // // // //         orderId: transactionId,
// // // // // //         totalAmount: totalAmount,
// // // // // //         paymentMethod: `${selectedUPIApp || 'UPI'}`,
// // // // // //       });
// // // // // //     }, 2000);
// // // // // //   };

// // // // // //   // ============ CARD FLOW ============
// // // // // //   const handleCardPayment = () => {
// // // // // //     if (!cardNumber || !expiryDate || !cvv || !cardHolder) {
// // // // // //       Alert.alert('Error', 'Please fill all card details');
// // // // // //       return;
// // // // // //     }
// // // // // //     if (cardNumber.replace(/\s/g, '').length !== 16) {
// // // // // //       Alert.alert('Error', 'Please enter a valid 16-digit card number');
// // // // // //       return;
// // // // // //     }
// // // // // //     if (cvv.length < 3) {
// // // // // //       Alert.alert('Error', 'Please enter a valid CVV');
// // // // // //       return;
// // // // // //     }

// // // // // //     Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
// // // // // //     setShowCardModal(false);
// // // // // //     setLoading(true);
    
// // // // // //     setTimeout(() => {
// // // // // //       setLoading(false);
// // // // // //       setPaymentSuccess(true);
// // // // // //       const transactionId = 'CARD' + Date.now().toString().slice(-10);
      
// // // // // //       navigation.replace('OrderSuccess', {
// // // // // //         orderId: transactionId,
// // // // // //         totalAmount: totalAmount,
// // // // // //         paymentMethod: 'Credit/Debit Card',
// // // // // //       });
// // // // // //     }, 2500);
// // // // // //   };

// // // // // //   // ============ NET BANKING FLOW ============
// // // // // //   const handleNetBankingSelect = (bank: any) => {
// // // // // //     setShowNetBankingModal(false);
// // // // // //     setLoading(true);
// // // // // //     setTimeout(() => {
// // // // // //       setLoading(false);
// // // // // //       setPaymentSuccess(true);
// // // // // //       const transactionId = 'NB' + Date.now().toString().slice(-10);
      
// // // // // //       navigation.replace('OrderSuccess', {
// // // // // //         orderId: transactionId,
// // // // // //         totalAmount: totalAmount,
// // // // // //         paymentMethod: `${bank.name} (Net Banking)`,
// // // // // //       });
// // // // // //     }, 2000);
// // // // // //   };

// // // // // //   // ============ WALLET FLOW ============
// // // // // //   const handleWalletPayment = () => {
// // // // // //     if (totalAmount > walletBalance) {
// // // // // //       Alert.alert(
// // // // // //         'Insufficient Balance',
// // // // // //         `Wallet balance: ₹${walletBalance}\nAmount needed: ₹${totalAmount}\n\nPlease add money to your wallet or use another payment method.`,
// // // // // //         [
// // // // // //           { text: 'OK', onPress: () => setShowWalletModal(false) }
// // // // // //         ]
// // // // // //       );
// // // // // //       return;
// // // // // //     }

// // // // // //     setShowWalletModal(false);
// // // // // //     setLoading(true);
// // // // // //     setTimeout(() => {
// // // // // //       setLoading(false);
// // // // // //       setPaymentSuccess(true);
// // // // // //       const transactionId = 'WLT' + Date.now().toString().slice(-10);
      
// // // // // //       navigation.replace('OrderSuccess', {
// // // // // //         orderId: transactionId,
// // // // // //         totalAmount: totalAmount,
// // // // // //         paymentMethod: 'Wallet',
// // // // // //       });
// // // // // //     }, 1500);
// // // // // //   };

// // // // // //   // ============ CASH ON DELIVERY - WITH PLACE ORDER BUTTON ============
// // // // // //   const handleCashOnDelivery = () => {
// // // // // //     Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    
// // // // // //     Alert.alert(
// // // // // //       '💳 Cash on Delivery',
// // // // // //       `Order Total: ₹${totalAmount}\n\nYou will pay ₹${totalAmount} in cash when your order arrives.\n\nPlease keep the exact amount ready.`,
// // // // // //       [
// // // // // //         { 
// // // // // //           text: 'Cancel', 
// // // // // //           style: 'cancel',
// // // // // //           onPress: () => setSelectedMethod('')
// // // // // //         },
// // // // // //         { 
// // // // // //           text: 'Place Order', 
// // // // // //           onPress: () => {
// // // // // //             setLoading(true);
// // // // // //             setTimeout(() => {
// // // // // //               setLoading(false);
// // // // // //               setPaymentSuccess(true);
// // // // // //               const transactionId = 'COD' + Date.now().toString().slice(-10);
              
// // // // // //               navigation.replace('OrderSuccess', {
// // // // // //                 orderId: transactionId,
// // // // // //                 totalAmount: totalAmount,
// // // // // //                 paymentMethod: 'Cash on Delivery',
// // // // // //               });
// // // // // //             }, 1500);
// // // // // //           }
// // // // // //         }
// // // // // //       ]
// // // // // //     );
// // // // // //   };

// // // // // //   const formatCardNumber = (text: string): string => {
// // // // // //     const cleaned = text.replace(/\s/g, '');
// // // // // //     const matches = cleaned.match(/.{1,4}/g);
// // // // // //     if (matches) {
// // // // // //       return matches.join(' ');
// // // // // //     }
// // // // // //     return text;
// // // // // //   };

// // // // // //   const formatExpiryDate = (text: string): string => {
// // // // // //     const cleaned = text.replace(/\D/g, '');
// // // // // //     if (cleaned.length >= 2) {
// // // // // //       return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
// // // // // //     }
// // // // // //     return text;
// // // // // //   };

// // // // // //   return (
// // // // // //     <View style={styles.container}>
// // // // // //       <ScrollView showsVerticalScrollIndicator={false}>
// // // // // //         {/* Header */}
// // // // // //         <View style={styles.header}>
// // // // // //           <TouchableOpacity onPress={() => navigation.goBack()}>
// // // // // //             <Icon name="arrow-back" size={24} color={colors.text} />
// // // // // //           </TouchableOpacity>
// // // // // //           <Text style={styles.headerTitle}>Payment</Text>
// // // // // //           <View style={{ width: 24 }} />
// // // // // //         </View>

// // // // // //         {/* Amount */}
// // // // // //         <View style={styles.amountContainer}>
// // // // // //           <Text style={styles.amountLabel}>Amount to Pay</Text>
// // // // // //           <Text style={styles.amountValue}>₹{totalAmount}</Text>
// // // // // //         </View>

// // // // // //         {/* Payment Methods */}
// // // // // //         <View style={styles.methodsContainer}>
// // // // // //           <Text style={styles.sectionTitle}>Payment Methods</Text>
// // // // // //           {paymentMethods.map((method) => (
// // // // // //             <TouchableOpacity
// // // // // //               key={method.id}
// // // // // //               style={[
// // // // // //                 styles.methodItem,
// // // // // //                 selectedMethod === method.id && styles.selectedMethod,
// // // // // //               ]}
// // // // // //               onPress={() => handleSelectMethod(method.id)}
// // // // // //             >
// // // // // //               <View style={styles.methodLeft}>
// // // // // //                 <View style={[styles.methodIcon, selectedMethod === method.id && styles.selectedMethodIcon]}>
// // // // // //                   <Icon name={method.icon} size={22} color={selectedMethod === method.id ? colors.white : colors.text} />
// // // // // //                 </View>
// // // // // //                 <View style={styles.methodInfo}>
// // // // // //                   <Text style={[
// // // // // //                     styles.methodName,
// // // // // //                     selectedMethod === method.id && styles.selectedMethodText,
// // // // // //                   ]}>
// // // // // //                     {method.name}
// // // // // //                   </Text>
// // // // // //                   <Text style={styles.methodDesc}>{method.desc}</Text>
// // // // // //                 </View>
// // // // // //               </View>
// // // // // //               {selectedMethod === method.id && (
// // // // // //                 <Icon name="checkmark-circle" size={24} color={colors.primary} />
// // // // // //               )}
// // // // // //             </TouchableOpacity>
// // // // // //           ))}
// // // // // //         </View>

// // // // // //         {/* Cash on Delivery Info */}
// // // // // //         {selectedMethod === 'cash' && (
// // // // // //           <View style={styles.infoContainer}>
// // // // // //             <Icon name="information-circle-outline" size={20} color={colors.info} />
// // // // // //             <Text style={styles.infoText}>
// // // // // //               Pay with cash when your order arrives. No additional charges.
// // // // // //             </Text>
// // // // // //           </View>
// // // // // //         )}
// // // // // //       </ScrollView>

// // // // // //       {/* Place Order Button for Cash on Delivery */}
// // // // // //       {selectedMethod === 'cash' && (
// // // // // //         <View style={styles.footer}>
// // // // // //           <TouchableOpacity 
// // // // // //             style={styles.placeOrderButton} 
// // // // // //             onPress={handleCashOnDelivery}
// // // // // //             disabled={loading}
// // // // // //           >
// // // // // //             {loading ? (
// // // // // //               <ActivityIndicator color="#ffffff" />
// // // // // //             ) : (
// // // // // //               <Text style={styles.placeOrderButtonText}>Place Order • ₹{totalAmount}</Text>
// // // // // //             )}
// // // // // //           </TouchableOpacity>
// // // // // //         </View>
// // // // // //       )}

// // // // // //       {/* ============ UPI MODAL ============ */}
// // // // // //       <Modal
// // // // // //         visible={showUPIModal}
// // // // // //         transparent={true}
// // // // // //         animationType="slide"
// // // // // //         onRequestClose={() => setShowUPIModal(false)}
// // // // // //       >
// // // // // //         <View style={styles.modalOverlay}>
// // // // // //           <View style={styles.modalContainer}>
// // // // // //             <View style={styles.modalHeader}>
// // // // // //               <Text style={styles.modalTitle}>Select UPI App</Text>
// // // // // //               <TouchableOpacity onPress={() => setShowUPIModal(false)}>
// // // // // //                 <Icon name="close" size={24} color={colors.text} />
// // // // // //               </TouchableOpacity>
// // // // // //             </View>

// // // // // //             <View style={styles.upiAppsContainer}>
// // // // // //               {upiApps.map((app) => (
// // // // // //                 <TouchableOpacity
// // // // // //                   key={app.id}
// // // // // //                   style={styles.upiAppItem}
// // // // // //                   onPress={() => handleUPISelection(app)}
// // // // // //                 >
// // // // // //                   <View style={[styles.upiAppIcon, { backgroundColor: app.color + '20' }]}>
// // // // // //                     <Text style={styles.upiAppEmoji}>{app.emoji}</Text>
// // // // // //                   </View>
// // // // // //                   <View style={styles.upiAppInfo}>
// // // // // //                     <Text style={styles.upiAppName}>{app.name}</Text>
// // // // // //                     <Text style={styles.upiAppDesc}>UPI Payment</Text>
// // // // // //                   </View>
// // // // // //                   <Icon name="chevron-forward" size={20} color={colors.gray} />
// // // // // //                 </TouchableOpacity>
// // // // // //               ))}
// // // // // //             </View>

// // // // // //             <TouchableOpacity 
// // // // // //               style={styles.enterUPIButton}
// // // // // //               onPress={() => {
// // // // // //                 setShowUPIModal(false);
// // // // // //                 setSelectedUPIApp('Manual UPI');
// // // // // //                 setTimeout(() => {
// // // // // //                   setShowUPIPinModal(true);
// // // // // //                 }, 300);
// // // // // //               }}
// // // // // //             >
// // // // // //               <Text style={styles.enterUPIButtonText}>Enter UPI ID Manually</Text>
// // // // // //             </TouchableOpacity>
// // // // // //           </View>
// // // // // //         </View>
// // // // // //       </Modal>

// // // // // //       {/* ============ UPI PIN MODAL ============ */}
// // // // // //       <Modal
// // // // // //         visible={showUPIPinModal}
// // // // // //         transparent={true}
// // // // // //         animationType="fade"
// // // // // //         onRequestClose={() => {
// // // // // //           setShowUPIPinModal(false);
// // // // // //           setUpiPin('');
// // // // // //         }}
// // // // // //       >
// // // // // //         <View style={styles.pinModalOverlay}>
// // // // // //           <View style={styles.pinModalContainer}>
// // // // // //             <View style={styles.pinModalHeader}>
// // // // // //               <Text style={styles.pinModalTitle}>
// // // // // //                 {selectedUPIApp || 'UPI'} PIN
// // // // // //               </Text>
// // // // // //               <Text style={styles.pinModalSubtitle}>
// // // // // //                 Enter your 4-digit UPI PIN to confirm payment
// // // // // //               </Text>
// // // // // //             </View>

// // // // // //             <View style={styles.pinDisplayContainer}>
// // // // // //               <View style={styles.pinDisplay}>
// // // // // //                 {[0, 1, 2, 3].map((index) => (
// // // // // //                   <View key={index} style={styles.pinDotContainer}>
// // // // // //                     <View style={[
// // // // // //                       styles.pinDot,
// // // // // //                       upiPin.length > index && styles.pinDotFilled,
// // // // // //                     ]} />
// // // // // //                   </View>
// // // // // //                 ))}
// // // // // //               </View>
// // // // // //             </View>

// // // // // //             <View style={styles.pinKeyboard}>
// // // // // //               {[1, 2, 3, 4, 5, 6, 7, 8, 9, 'clear', 0, 'delete'].map((key) => (
// // // // // //                 <TouchableOpacity
// // // // // //                   key={key.toString()}
// // // // // //                   style={styles.pinKey}
// // // // // //                   onPress={() => {
// // // // // //                     if (key === 'clear') {
// // // // // //                       setUpiPin('');
// // // // // //                     } else if (key === 'delete') {
// // // // // //                       setUpiPin(upiPin.slice(0, -1));
// // // // // //                     } else if (upiPin.length < 4) {
// // // // // //                       setUpiPin(upiPin + key.toString());
// // // // // //                     }
// // // // // //                   }}
// // // // // //                 >
// // // // // //                   <Text style={styles.pinKeyText}>
// // // // // //                     {key === 'clear' ? 'Clear' : key === 'delete' ? '⌫' : key}
// // // // // //                   </Text>
// // // // // //                 </TouchableOpacity>
// // // // // //               ))}
// // // // // //             </View>

// // // // // //             <TouchableOpacity
// // // // // //               style={[styles.pinConfirmButton, upiPin.length !== 4 && styles.pinConfirmButtonDisabled]}
// // // // // //               onPress={handleUPIPinSubmit}
// // // // // //               disabled={upiPin.length !== 4}
// // // // // //             >
// // // // // //               <Text style={styles.pinConfirmButtonText}>
// // // // // //                 Pay ₹{totalAmount}
// // // // // //               </Text>
// // // // // //             </TouchableOpacity>

// // // // // //             <TouchableOpacity
// // // // // //               style={styles.pinCancelButton}
// // // // // //               onPress={() => {
// // // // // //                 setShowUPIPinModal(false);
// // // // // //                 setUpiPin('');
// // // // // //               }}
// // // // // //             >
// // // // // //               <Text style={styles.pinCancelButtonText}>Cancel</Text>
// // // // // //             </TouchableOpacity>
// // // // // //           </View>
// // // // // //         </View>
// // // // // //       </Modal>

// // // // // //       {/* ============ CARD MODAL ============ */}
// // // // // //       <Modal
// // // // // //         visible={showCardModal}
// // // // // //         transparent={true}
// // // // // //         animationType="slide"
// // // // // //         onRequestClose={() => setShowCardModal(false)}
// // // // // //       >
// // // // // //         <View style={styles.modalOverlay}>
// // // // // //           <View style={styles.modalContainer}>
// // // // // //             <View style={styles.modalHeader}>
// // // // // //               <Text style={styles.modalTitle}>Card Details</Text>
// // // // // //               <TouchableOpacity onPress={() => setShowCardModal(false)}>
// // // // // //                 <Icon name="close" size={24} color={colors.text} />
// // // // // //               </TouchableOpacity>
// // // // // //             </View>

// // // // // //             <View style={styles.cardModalBody}>
// // // // // //               <View style={styles.cardPreview}>
// // // // // //                 <Icon name="card-outline" size={40} color={colors.primary} />
// // // // // //                 <Text style={styles.cardPreviewText}>Enter Card Details</Text>
// // // // // //               </View>

// // // // // //               <View style={styles.inputContainer}>
// // // // // //                 <Text style={styles.inputLabel}>Card Number</Text>
// // // // // //                 <TextInput
// // // // // //                   style={styles.input}
// // // // // //                   placeholder="1234 5678 9012 3456"
// // // // // //                   value={cardNumber}
// // // // // //                   onChangeText={(text) => setCardNumber(formatCardNumber(text))}
// // // // // //                   keyboardType="numeric"
// // // // // //                   maxLength={19}
// // // // // //                 />
// // // // // //               </View>

// // // // // //               <View style={styles.inputContainer}>
// // // // // //                 <Text style={styles.inputLabel}>Card Holder Name</Text>
// // // // // //                 <TextInput
// // // // // //                   style={styles.input}
// // // // // //                   placeholder="John Doe"
// // // // // //                   value={cardHolder}
// // // // // //                   onChangeText={setCardHolder}
// // // // // //                 />
// // // // // //               </View>

// // // // // //               <View style={styles.rowInputs}>
// // // // // //                 <View style={[styles.inputContainer, styles.halfInput]}>
// // // // // //                   <Text style={styles.inputLabel}>Expiry Date</Text>
// // // // // //                   <TextInput
// // // // // //                     style={styles.input}
// // // // // //                     placeholder="MM/YY"
// // // // // //                     value={expiryDate}
// // // // // //                     onChangeText={(text) => setExpiryDate(formatExpiryDate(text))}
// // // // // //                     keyboardType="numeric"
// // // // // //                     maxLength={5}
// // // // // //                   />
// // // // // //                 </View>
// // // // // //                 <View style={[styles.inputContainer, styles.halfInput]}>
// // // // // //                   <Text style={styles.inputLabel}>CVV</Text>
// // // // // //                   <TextInput
// // // // // //                     style={styles.input}
// // // // // //                     placeholder="123"
// // // // // //                     value={cvv}
// // // // // //                     onChangeText={setCvv}
// // // // // //                     keyboardType="numeric"
// // // // // //                     maxLength={4}
// // // // // //                     secureTextEntry
// // // // // //                   />
// // // // // //                 </View>
// // // // // //               </View>

// // // // // //               <TouchableOpacity 
// // // // // //                 style={styles.payNowButton} 
// // // // // //                 onPress={handleCardPayment}
// // // // // //                 disabled={loading}
// // // // // //               >
// // // // // //                 {loading ? (
// // // // // //                   <ActivityIndicator color="#ffffff" />
// // // // // //                 ) : (
// // // // // //                   <Text style={styles.payNowButtonText}>Pay ₹{totalAmount}</Text>
// // // // // //                 )}
// // // // // //               </TouchableOpacity>
// // // // // //             </View>
// // // // // //           </View>
// // // // // //         </View>
// // // // // //       </Modal>

// // // // // //       {/* ============ NET BANKING MODAL ============ */}
// // // // // //       <Modal
// // // // // //         visible={showNetBankingModal}
// // // // // //         transparent={true}
// // // // // //         animationType="slide"
// // // // // //         onRequestClose={() => setShowNetBankingModal(false)}
// // // // // //       >
// // // // // //         <View style={styles.modalOverlay}>
// // // // // //           <View style={styles.modalContainer}>
// // // // // //             <View style={styles.modalHeader}>
// // // // // //               <Text style={styles.modalTitle}>Select Bank</Text>
// // // // // //               <TouchableOpacity onPress={() => setShowNetBankingModal(false)}>
// // // // // //                 <Icon name="close" size={24} color={colors.text} />
// // // // // //               </TouchableOpacity>
// // // // // //             </View>

// // // // // //             <View style={styles.banksContainer}>
// // // // // //               {banks.map((bank) => (
// // // // // //                 <TouchableOpacity
// // // // // //                   key={bank.id}
// // // // // //                   style={styles.bankItem}
// // // // // //                   onPress={() => handleNetBankingSelect(bank)}
// // // // // //                 >
// // // // // //                   <View style={[styles.bankIcon, { backgroundColor: bank.color + '20' }]}>
// // // // // //                     <Text style={styles.bankEmoji}>{bank.icon}</Text>
// // // // // //                   </View>
// // // // // //                   <View style={styles.bankInfo}>
// // // // // //                     <Text style={styles.bankName}>{bank.name}</Text>
// // // // // //                     <Text style={styles.bankDesc}>Net Banking</Text>
// // // // // //                   </View>
// // // // // //                   <Icon name="chevron-forward" size={20} color={colors.gray} />
// // // // // //                 </TouchableOpacity>
// // // // // //               ))}
// // // // // //             </View>
// // // // // //           </View>
// // // // // //         </View>
// // // // // //       </Modal>

// // // // // //       {/* ============ WALLET MODAL ============ */}
// // // // // //       <Modal
// // // // // //         visible={showWalletModal}
// // // // // //         transparent={true}
// // // // // //         animationType="slide"
// // // // // //         onRequestClose={() => setShowWalletModal(false)}
// // // // // //       >
// // // // // //         <View style={styles.modalOverlay}>
// // // // // //           <View style={styles.modalContainer}>
// // // // // //             <View style={styles.modalHeader}>
// // // // // //               <Text style={styles.modalTitle}>Pay with Wallet</Text>
// // // // // //               <TouchableOpacity onPress={() => setShowWalletModal(false)}>
// // // // // //                 <Icon name="close" size={24} color={colors.text} />
// // // // // //               </TouchableOpacity>
// // // // // //             </View>

// // // // // //             <View style={styles.walletModalBody}>
// // // // // //               <View style={styles.walletBalanceContainer}>
// // // // // //                 <Icon name="wallet-outline" size={40} color={colors.primary} />
// // // // // //                 <Text style={styles.walletBalanceTitle}>Wallet Balance</Text>
// // // // // //                 <Text style={styles.walletBalanceAmount}>₹{walletBalance}</Text>
// // // // // //               </View>

// // // // // //               <View style={styles.walletInfoContainer}>
// // // // // //                 <View style={styles.walletInfoRow}>
// // // // // //                   <Text style={styles.walletInfoLabel}>Order Total</Text>
// // // // // //                   <Text style={styles.walletInfoValue}>₹{totalAmount}</Text>
// // // // // //                 </View>
// // // // // //                 <View style={styles.walletInfoRow}>
// // // // // //                   <Text style={styles.walletInfoLabel}>Balance After Payment</Text>
// // // // // //                   <Text style={[styles.walletInfoValue, { color: totalAmount <= walletBalance ? colors.success : colors.danger }]}>
// // // // // //                     ₹{walletBalance - totalAmount}
// // // // // //                   </Text>
// // // // // //                 </View>
// // // // // //               </View>

// // // // // //               <TouchableOpacity 
// // // // // //                 style={[styles.walletPayButton, totalAmount > walletBalance && styles.walletPayButtonDisabled]}
// // // // // //                 onPress={handleWalletPayment}
// // // // // //                 disabled={loading || totalAmount > walletBalance}
// // // // // //               >
// // // // // //                 {loading ? (
// // // // // //                   <ActivityIndicator color="#ffffff" />
// // // // // //                 ) : (
// // // // // //                   <Text style={styles.walletPayButtonText}>
// // // // // //                     {totalAmount > walletBalance ? 'Insufficient Balance' : `Pay ₹${totalAmount}`}
// // // // // //                   </Text>
// // // // // //                 )}
// // // // // //               </TouchableOpacity>
// // // // // //             </View>
// // // // // //           </View>
// // // // // //         </View>
// // // // // //       </Modal>

// // // // // //       {/* Loading Overlay */}
// // // // // //       {loading && (
// // // // // //         <View style={styles.loadingOverlay}>
// // // // // //           <View style={styles.loadingContainer}>
// // // // // //             <ActivityIndicator size="large" color={colors.primary} />
// // // // // //             <Text style={styles.loadingText}>Processing Payment...</Text>
// // // // // //             <Text style={styles.loadingSubText}>Please do not close the app</Text>
// // // // // //           </View>
// // // // // //         </View>
// // // // // //       )}
// // // // // //     </View>
// // // // // //   );
// // // // // // }

// // // // // // const styles = StyleSheet.create({
// // // // // //   container: {
// // // // // //     flex: 1,
// // // // // //     backgroundColor: colors.white,
// // // // // //   },
// // // // // //   header: {
// // // // // //     flexDirection: 'row',
// // // // // //     alignItems: 'center',
// // // // // //     justifyContent: 'space-between',
// // // // // //     padding: 16,
// // // // // //     paddingTop: 40,
// // // // // //     borderBottomWidth: 1,
// // // // // //     borderBottomColor: colors.border,
// // // // // //   },
// // // // // //   headerTitle: {
// // // // // //     fontSize: 18,
// // // // // //     fontWeight: '600',
// // // // // //     color: colors.text,
// // // // // //   },
// // // // // //   amountContainer: {
// // // // // //     backgroundColor: colors.primary,
// // // // // //     padding: 20,
// // // // // //     margin: 16,
// // // // // //     borderRadius: 12,
// // // // // //     alignItems: 'center',
// // // // // //   },
// // // // // //   amountLabel: {
// // // // // //     fontSize: 14,
// // // // // //     color: colors.white,
// // // // // //     opacity: 0.8,
// // // // // //   },
// // // // // //   amountValue: {
// // // // // //     fontSize: 28,
// // // // // //     fontWeight: '700',
// // // // // //     color: colors.white,
// // // // // //     marginTop: 4,
// // // // // //   },
// // // // // //   methodsContainer: {
// // // // // //     paddingHorizontal: 16,
// // // // // //     paddingBottom: 20,
// // // // // //   },
// // // // // //   sectionTitle: {
// // // // // //     fontSize: 16,
// // // // // //     fontWeight: '600',
// // // // // //     color: colors.text,
// // // // // //     marginBottom: 12,
// // // // // //   },
// // // // // //   methodItem: {
// // // // // //     flexDirection: 'row',
// // // // // //     justifyContent: 'space-between',
// // // // // //     alignItems: 'center',
// // // // // //     padding: 14,
// // // // // //     borderWidth: 1,
// // // // // //     borderColor: colors.border,
// // // // // //     borderRadius: 10,
// // // // // //     marginBottom: 8,
// // // // // //   },
// // // // // //   selectedMethod: {
// // // // // //     borderColor: colors.primary,
// // // // // //     backgroundColor: '#fff5ec',
// // // // // //   },
// // // // // //   methodLeft: {
// // // // // //     flexDirection: 'row',
// // // // // //     alignItems: 'center',
// // // // // //     flex: 1,
// // // // // //   },
// // // // // //   methodIcon: {
// // // // // //     width: 36,
// // // // // //     height: 36,
// // // // // //     borderRadius: 18,
// // // // // //     backgroundColor: colors.lightGray,
// // // // // //     justifyContent: 'center',
// // // // // //     alignItems: 'center',
// // // // // //     marginRight: 12,
// // // // // //   },
// // // // // //   selectedMethodIcon: {
// // // // // //     backgroundColor: colors.primary,
// // // // // //   },
// // // // // //   methodInfo: {
// // // // // //     flex: 1,
// // // // // //   },
// // // // // //   methodName: {
// // // // // //     fontSize: 14,
// // // // // //     color: colors.text,
// // // // // //   },
// // // // // //   selectedMethodText: {
// // // // // //     color: colors.primary,
// // // // // //     fontWeight: '500',
// // // // // //   },
// // // // // //   methodDesc: {
// // // // // //     fontSize: 11,
// // // // // //     color: colors.textLight,
// // // // // //     marginTop: 1,
// // // // // //   },
// // // // // //   infoContainer: {
// // // // // //     flexDirection: 'row',
// // // // // //     alignItems: 'center',
// // // // // //     backgroundColor: '#f8f9fa',
// // // // // //     marginHorizontal: 16,
// // // // // //     marginBottom: 16,
// // // // // //     padding: 12,
// // // // // //     borderRadius: 8,
// // // // // //     borderWidth: 1,
// // // // // //     borderColor: colors.border,
// // // // // //   },
// // // // // //   infoText: {
// // // // // //     fontSize: 13,
// // // // // //     color: colors.textLight,
// // // // // //     marginLeft: 10,
// // // // // //     flex: 1,
// // // // // //   },
// // // // // //   footer: {
// // // // // //     padding: 16,
// // // // // //     backgroundColor: colors.white,
// // // // // //     borderTopWidth: 1,
// // // // // //     borderTopColor: colors.border,
// // // // // //   },
// // // // // //   placeOrderButton: {
// // // // // //     backgroundColor: colors.primary,
// // // // // //     borderRadius: 12,
// // // // // //     height: 50,
// // // // // //     justifyContent: 'center',
// // // // // //     alignItems: 'center',
// // // // // //   },
// // // // // //   placeOrderButtonText: {
// // // // // //     color: colors.white,
// // // // // //     fontSize: 16,
// // // // // //     fontWeight: '600',
// // // // // //   },
// // // // // //   modalOverlay: {
// // // // // //     flex: 1,
// // // // // //     backgroundColor: 'rgba(0,0,0,0.5)',
// // // // // //     justifyContent: 'flex-end',
// // // // // //   },
// // // // // //   modalContainer: {
// // // // // //     backgroundColor: colors.white,
// // // // // //     borderTopLeftRadius: 24,
// // // // // //     borderTopRightRadius: 24,
// // // // // //     paddingHorizontal: 20,
// // // // // //     paddingBottom: 30,
// // // // // //     maxHeight: '80%',
// // // // // //   },
// // // // // //   modalHeader: {
// // // // // //     flexDirection: 'row',
// // // // // //     justifyContent: 'space-between',
// // // // // //     alignItems: 'center',
// // // // // //     paddingVertical: 16,
// // // // // //     borderBottomWidth: 1,
// // // // // //     borderBottomColor: colors.border,
// // // // // //   },
// // // // // //   modalTitle: {
// // // // // //     fontSize: 18,
// // // // // //     fontWeight: '600',
// // // // // //     color: colors.text,
// // // // // //   },
// // // // // //   upiAppsContainer: {
// // // // // //     marginTop: 12,
// // // // // //   },
// // // // // //   upiAppItem: {
// // // // // //     flexDirection: 'row',
// // // // // //     alignItems: 'center',
// // // // // //     paddingVertical: 14,
// // // // // //     borderBottomWidth: 1,
// // // // // //     borderBottomColor: colors.border,
// // // // // //   },
// // // // // //   upiAppIcon: {
// // // // // //     width: 48,
// // // // // //     height: 48,
// // // // // //     borderRadius: 24,
// // // // // //     justifyContent: 'center',
// // // // // //     alignItems: 'center',
// // // // // //     marginRight: 12,
// // // // // //   },
// // // // // //   upiAppEmoji: {
// // // // // //     fontSize: 24,
// // // // // //   },
// // // // // //   upiAppInfo: {
// // // // // //     flex: 1,
// // // // // //   },
// // // // // //   upiAppName: {
// // // // // //     fontSize: 15,
// // // // // //     fontWeight: '500',
// // // // // //     color: colors.text,
// // // // // //   },
// // // // // //   upiAppDesc: {
// // // // // //     fontSize: 12,
// // // // // //     color: colors.textLight,
// // // // // //     marginTop: 2,
// // // // // //   },
// // // // // //   enterUPIButton: {
// // // // // //     marginTop: 16,
// // // // // //     paddingVertical: 12,
// // // // // //     borderWidth: 1,
// // // // // //     borderColor: colors.primary,
// // // // // //     borderRadius: 8,
// // // // // //     alignItems: 'center',
// // // // // //   },
// // // // // //   enterUPIButtonText: {
// // // // // //     color: colors.primary,
// // // // // //     fontSize: 14,
// // // // // //     fontWeight: '500',
// // // // // //   },
// // // // // //   pinModalOverlay: {
// // // // // //     flex: 1,
// // // // // //     backgroundColor: 'rgba(0,0,0,0.7)',
// // // // // //     justifyContent: 'center',
// // // // // //     alignItems: 'center',
// // // // // //   },
// // // // // //   pinModalContainer: {
// // // // // //     backgroundColor: colors.white,
// // // // // //     borderRadius: 24,
// // // // // //     padding: 24,
// // // // // //     width: '85%',
// // // // // //     maxWidth: 400,
// // // // // //   },
// // // // // //   pinModalHeader: {
// // // // // //     alignItems: 'center',
// // // // // //     marginBottom: 20,
// // // // // //   },
// // // // // //   pinModalTitle: {
// // // // // //     fontSize: 20,
// // // // // //     fontWeight: '700',
// // // // // //     color: colors.text,
// // // // // //   },
// // // // // //   pinModalSubtitle: {
// // // // // //     fontSize: 14,
// // // // // //     color: colors.textLight,
// // // // // //     marginTop: 4,
// // // // // //   },
// // // // // //   pinDisplayContainer: {
// // // // // //     alignItems: 'center',
// // // // // //     marginBottom: 24,
// // // // // //   },
// // // // // //   pinDisplay: {
// // // // // //     flexDirection: 'row',
// // // // // //     justifyContent: 'center',
// // // // // //   },
// // // // // //   pinDotContainer: {
// // // // // //     marginHorizontal: 8,
// // // // // //   },
// // // // // //   pinDot: {
// // // // // //     width: 16,
// // // // // //     height: 16,
// // // // // //     borderRadius: 8,
// // // // // //     borderWidth: 2,
// // // // // //     borderColor: colors.border,
// // // // // //     backgroundColor: colors.white,
// // // // // //   },
// // // // // //   pinDotFilled: {
// // // // // //     backgroundColor: colors.primary,
// // // // // //     borderColor: colors.primary,
// // // // // //   },
// // // // // //   pinKeyboard: {
// // // // // //     flexDirection: 'row',
// // // // // //     flexWrap: 'wrap',
// // // // // //     justifyContent: 'center',
// // // // // //     marginBottom: 16,
// // // // // //   },
// // // // // //   pinKey: {
// // // // // //     width: '30%',
// // // // // //     aspectRatio: 1.2,
// // // // // //     justifyContent: 'center',
// // // // // //     alignItems: 'center',
// // // // // //     margin: '1.5%',
// // // // // //     borderRadius: 12,
// // // // // //     backgroundColor: colors.lightGray,
// // // // // //   },
// // // // // //   pinKeyText: {
// // // // // //     fontSize: 22,
// // // // // //     fontWeight: '500',
// // // // // //     color: colors.text,
// // // // // //   },
// // // // // //   pinConfirmButton: {
// // // // // //     backgroundColor: colors.primary,
// // // // // //     paddingVertical: 14,
// // // // // //     borderRadius: 12,
// // // // // //     alignItems: 'center',
// // // // // //     marginBottom: 8,
// // // // // //   },
// // // // // //   pinConfirmButtonDisabled: {
// // // // // //     backgroundColor: colors.gray,
// // // // // //   },
// // // // // //   pinConfirmButtonText: {
// // // // // //     color: colors.white,
// // // // // //     fontSize: 16,
// // // // // //     fontWeight: '600',
// // // // // //   },
// // // // // //   pinCancelButton: {
// // // // // //     paddingVertical: 10,
// // // // // //     alignItems: 'center',
// // // // // //   },
// // // // // //   pinCancelButtonText: {
// // // // // //     color: colors.textLight,
// // // // // //     fontSize: 14,
// // // // // //   },
// // // // // //   cardModalBody: {
// // // // // //     marginTop: 8,
// // // // // //   },
// // // // // //   cardPreview: {
// // // // // //     alignItems: 'center',
// // // // // //     paddingVertical: 20,
// // // // // //     backgroundColor: '#f8f9fa',
// // // // // //     borderRadius: 12,
// // // // // //     marginBottom: 16,
// // // // // //   },
// // // // // //   cardPreviewText: {
// // // // // //     fontSize: 14,
// // // // // //     color: colors.textLight,
// // // // // //     marginTop: 8,
// // // // // //   },
// // // // // //   inputContainer: {
// // // // // //     marginBottom: 12,
// // // // // //   },
// // // // // //   inputLabel: {
// // // // // //     fontSize: 14,
// // // // // //     fontWeight: '500',
// // // // // //     color: colors.text,
// // // // // //     marginBottom: 4,
// // // // // //   },
// // // // // //   input: {
// // // // // //     borderWidth: 1,
// // // // // //     borderColor: colors.border,
// // // // // //     borderRadius: 8,
// // // // // //     paddingHorizontal: 12,
// // // // // //     paddingVertical: 10,
// // // // // //     fontSize: 14,
// // // // // //     color: colors.text,
// // // // // //     backgroundColor: colors.white,
// // // // // //   },
// // // // // //   rowInputs: {
// // // // // //     flexDirection: 'row',
// // // // // //     justifyContent: 'space-between',
// // // // // //   },
// // // // // //   halfInput: {
// // // // // //     flex: 1,
// // // // // //     marginRight: 8,
// // // // // //   },
// // // // // //   payNowButton: {
// // // // // //     backgroundColor: colors.primary,
// // // // // //     borderRadius: 12,
// // // // // //     height: 50,
// // // // // //     justifyContent: 'center',
// // // // // //     alignItems: 'center',
// // // // // //     marginTop: 8,
// // // // // //   },
// // // // // //   payNowButtonText: {
// // // // // //     color: colors.white,
// // // // // //     fontSize: 16,
// // // // // //     fontWeight: '600',
// // // // // //   },
// // // // // //   banksContainer: {
// // // // // //     marginTop: 12,
// // // // // //   },
// // // // // //   bankItem: {
// // // // // //     flexDirection: 'row',
// // // // // //     alignItems: 'center',
// // // // // //     paddingVertical: 14,
// // // // // //     borderBottomWidth: 1,
// // // // // //     borderBottomColor: colors.border,
// // // // // //   },
// // // // // //   bankIcon: {
// // // // // //     width: 44,
// // // // // //     height: 44,
// // // // // //     borderRadius: 22,
// // // // // //     justifyContent: 'center',
// // // // // //     alignItems: 'center',
// // // // // //     marginRight: 12,
// // // // // //   },
// // // // // //   bankEmoji: {
// // // // // //     fontSize: 20,
// // // // // //   },
// // // // // //   bankInfo: {
// // // // // //     flex: 1,
// // // // // //   },
// // // // // //   bankName: {
// // // // // //     fontSize: 14,
// // // // // //     fontWeight: '500',
// // // // // //     color: colors.text,
// // // // // //   },
// // // // // //   bankDesc: {
// // // // // //     fontSize: 12,
// // // // // //     color: colors.textLight,
// // // // // //     marginTop: 1,
// // // // // //   },
// // // // // //   walletModalBody: {
// // // // // //     marginTop: 8,
// // // // // //   },
// // // // // //   walletBalanceContainer: {
// // // // // //     alignItems: 'center',
// // // // // //     paddingVertical: 20,
// // // // // //     backgroundColor: '#f8f9fa',
// // // // // //     borderRadius: 12,
// // // // // //     marginBottom: 16,
// // // // // //   },
// // // // // //   walletBalanceTitle: {
// // // // // //     fontSize: 14,
// // // // // //     color: colors.textLight,
// // // // // //     marginTop: 8,
// // // // // //   },
// // // // // //   walletBalanceAmount: {
// // // // // //     fontSize: 28,
// // // // // //     fontWeight: '700',
// // // // // //     color: colors.primary,
// // // // // //     marginTop: 4,
// // // // // //   },
// // // // // //   walletInfoContainer: {
// // // // // //     backgroundColor: '#f8f9fa',
// // // // // //     borderRadius: 12,
// // // // // //     padding: 16,
// // // // // //     marginBottom: 16,
// // // // // //   },
// // // // // //   walletInfoRow: {
// // // // // //     flexDirection: 'row',
// // // // // //     justifyContent: 'space-between',
// // // // // //     paddingVertical: 4,
// // // // // //   },
// // // // // //   walletInfoLabel: {
// // // // // //     fontSize: 14,
// // // // // //     color: colors.textLight,
// // // // // //   },
// // // // // //   walletInfoValue: {
// // // // // //     fontSize: 14,
// // // // // //     fontWeight: '500',
// // // // // //     color: colors.text,
// // // // // //   },
// // // // // //   walletPayButton: {
// // // // // //     backgroundColor: colors.primary,
// // // // // //     borderRadius: 12,
// // // // // //     height: 50,
// // // // // //     justifyContent: 'center',
// // // // // //     alignItems: 'center',
// // // // // //   },
// // // // // //   walletPayButtonDisabled: {
// // // // // //     backgroundColor: colors.gray,
// // // // // //   },
// // // // // //   walletPayButtonText: {
// // // // // //     color: colors.white,
// // // // // //     fontSize: 16,
// // // // // //     fontWeight: '600',
// // // // // //   },
// // // // // //   loadingOverlay: {
// // // // // //     position: 'absolute',
// // // // // //     top: 0,
// // // // // //     left: 0,
// // // // // //     right: 0,
// // // // // //     bottom: 0,
// // // // // //     backgroundColor: 'rgba(0,0,0,0.7)',
// // // // // //     justifyContent: 'center',
// // // // // //     alignItems: 'center',
// // // // // //   },
// // // // // //   loadingContainer: {
// // // // // //     backgroundColor: colors.white,
// // // // // //     padding: 30,
// // // // // //     borderRadius: 16,
// // // // // //     alignItems: 'center',
// // // // // //     minWidth: 200,
// // // // // //   },
// // // // // //   loadingText: {
// // // // // //     fontSize: 16,
// // // // // //     fontWeight: '600',
// // // // // //     color: colors.text,
// // // // // //     marginTop: 12,
// // // // // //   },
// // // // // //   loadingSubText: {
// // // // // //     fontSize: 12,
// // // // // //     color: colors.textLight,
// // // // // //     marginTop: 4,
// // // // // //   },
// // // // // // });
// // // // // import React, { useState } from 'react';
// // // // // import {
// // // // //   View,
// // // // //   Text,
// // // // //   ScrollView,
// // // // //   TouchableOpacity,
// // // // //   StyleSheet,
// // // // //   TextInput,
// // // // //   Alert,
// // // // //   Modal,
// // // // //   ActivityIndicator,
// // // // // } from 'react-native';
// // // // // import * as Haptics from 'expo-haptics';
// // // // // import Icon from 'react-native-vector-icons/Ionicons';
// // // // // import { colors } from '../../constants/colors';

// // // // // interface PaymentScreenProps {
// // // // //   navigation: any;
// // // // //   route: any;
// // // // // }

// // // // // export default function PaymentScreen({ route, navigation }: PaymentScreenProps) {
// // // // //   const { totalAmount } = route.params || { totalAmount: 461 };
// // // // //   const [selectedMethod, setSelectedMethod] = useState<string>('cash');
// // // // //   const [showUPIModal, setShowUPIModal] = useState<boolean>(false);
// // // // //   const [selectedUPIApp, setSelectedUPIApp] = useState<string>('');
// // // // //   const [showUPIPinModal, setShowUPIPinModal] = useState<boolean>(false);
// // // // //   const [upiPin, setUpiPin] = useState<string>('');
// // // // //   const [showCardModal, setShowCardModal] = useState<boolean>(false);
// // // // //   const [showNetBankingModal, setShowNetBankingModal] = useState<boolean>(false);
// // // // //   const [showWalletModal, setShowWalletModal] = useState<boolean>(false);
// // // // //   const [loading, setLoading] = useState<boolean>(false);
// // // // //   const [paymentSuccess, setPaymentSuccess] = useState<boolean>(false);
  
// // // // //   // Card Details
// // // // //   const [cardNumber, setCardNumber] = useState<string>('');
// // // // //   const [expiryDate, setExpiryDate] = useState<string>('');
// // // // //   const [cvv, setCvv] = useState<string>('');
// // // // //   const [cardHolder, setCardHolder] = useState<string>('');

// // // // //   // Wallet
// // // // //   const walletBalance = 2500;

// // // // //   // Net Banking Banks
// // // // //   const banks = [
// // // // //     { id: 'sbi', name: 'State Bank of India', icon: '🏦', color: '#2E6B98' },
// // // // //     { id: 'hdfc', name: 'HDFC Bank', icon: '🏛️', color: '#004F8C' },
// // // // //     { id: 'icici', name: 'ICICI Bank', icon: '🏛️', color: '#F58A1E' },
// // // // //     { id: 'axis', name: 'Axis Bank', icon: '🏦', color: '#8B1A2B' },
// // // // //     { id: 'kotak', name: 'Kotak Mahindra Bank', icon: '🏦', color: '#003F6C' },
// // // // //     { id: 'yes', name: 'Yes Bank', icon: '🏛️', color: '#1B4F7A' },
// // // // //     { id: 'pnb', name: 'Punjab National Bank', icon: '🏦', color: '#008C45' },
// // // // //     { id: 'bob', name: 'Bank of Baroda', icon: '🏛️', color: '#0F4C81' },
// // // // //   ];

// // // // //   // UPI Apps
// // // // //   const upiApps = [
// // // // //     { id: 'gpay', name: 'Google Pay', emoji: '🟢', color: '#4285F4' },
// // // // //     { id: 'phonepe', name: 'PhonePe', emoji: '🟣', color: '#5F259F' },
// // // // //     { id: 'paytm', name: 'Paytm', emoji: '🔵', color: '#00BAF2' },
// // // // //     { id: 'amazonpay', name: 'Amazon Pay', emoji: '🟠', color: '#FF9900' },
// // // // //     { id: 'bhim', name: 'BHIM UPI', emoji: '🔷', color: '#0084B4' },
// // // // //   ];

// // // // //   const paymentMethods: { id: string; name: string; icon: string; desc: string }[] = [
// // // // //     { id: 'card', name: 'Credit/Debit Card', icon: 'card-outline', desc: 'Pay with card' },
// // // // //     { id: 'upi', name: 'UPI', icon: 'phone-portrait-outline', desc: 'Google Pay, PhonePe, Paytm' },
// // // // //     { id: 'netbanking', name: 'Net Banking', icon: 'business-outline', desc: 'All major banks' },
// // // // //     { id: 'wallet', name: 'Wallet', icon: 'wallet-outline', desc: `Balance: ₹${walletBalance}` },
// // // // //     { id: 'cash', name: 'Cash on Delivery', icon: 'cash-outline', desc: 'Pay when you receive' },
// // // // //   ];

// // // // //   const handleSelectMethod = (methodId: string) => {
// // // // //     Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
// // // // //     setSelectedMethod(methodId);
    
// // // // //     switch (methodId) {
// // // // //       case 'upi':
// // // // //         setShowUPIModal(true);
// // // // //         break;
// // // // //       case 'card':
// // // // //         setShowCardModal(true);
// // // // //         break;
// // // // //       case 'netbanking':
// // // // //         setShowNetBankingModal(true);
// // // // //         break;
// // // // //       case 'wallet':
// // // // //         setShowWalletModal(true);
// // // // //         break;
// // // // //       case 'cash':
// // // // //         // Just select the method, don't show alert
// // // // //         break;
// // // // //       default:
// // // // //         break;
// // // // //     }
// // // // //   };

// // // // //   // ============ UPI FLOW ============
// // // // //   const handleUPISelection = (app: any) => {
// // // // //     setSelectedUPIApp(app.name);
// // // // //     setShowUPIModal(false);
// // // // //     setTimeout(() => {
// // // // //       setShowUPIPinModal(true);
// // // // //     }, 300);
// // // // //   };

// // // // //   const handleUPIPinSubmit = () => {
// // // // //     if (upiPin.length !== 4) {
// // // // //       Alert.alert('Error', 'Please enter a valid 4-digit UPI PIN');
// // // // //       return;
// // // // //     }

// // // // //     Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
// // // // //     setShowUPIPinModal(false);
// // // // //     setLoading(true);
// // // // //     setUpiPin('');
    
// // // // //     setTimeout(() => {
// // // // //       setLoading(false);
// // // // //       setPaymentSuccess(true);
// // // // //       const transactionId = 'UPI' + Date.now().toString().slice(-10);
      
// // // // //       navigation.replace('OrderSuccess', {
// // // // //         orderId: transactionId,
// // // // //         totalAmount: totalAmount,
// // // // //         paymentMethod: `${selectedUPIApp || 'UPI'}`,
// // // // //       });
// // // // //     }, 2000);
// // // // //   };

// // // // //   // ============ CARD FLOW ============
// // // // //   const handleCardPayment = () => {
// // // // //     if (!cardNumber || !expiryDate || !cvv || !cardHolder) {
// // // // //       Alert.alert('Error', 'Please fill all card details');
// // // // //       return;
// // // // //     }
// // // // //     if (cardNumber.replace(/\s/g, '').length !== 16) {
// // // // //       Alert.alert('Error', 'Please enter a valid 16-digit card number');
// // // // //       return;
// // // // //     }
// // // // //     if (cvv.length < 3) {
// // // // //       Alert.alert('Error', 'Please enter a valid CVV');
// // // // //       return;
// // // // //     }

// // // // //     Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
// // // // //     setShowCardModal(false);
// // // // //     setLoading(true);
    
// // // // //     setTimeout(() => {
// // // // //       setLoading(false);
// // // // //       setPaymentSuccess(true);
// // // // //       const transactionId = 'CARD' + Date.now().toString().slice(-10);
      
// // // // //       navigation.replace('OrderSuccess', {
// // // // //         orderId: transactionId,
// // // // //         totalAmount: totalAmount,
// // // // //         paymentMethod: 'Credit/Debit Card',
// // // // //       });
// // // // //     }, 2500);
// // // // //   };

// // // // //   // ============ NET BANKING FLOW ============
// // // // //   const handleNetBankingSelect = (bank: any) => {
// // // // //     setShowNetBankingModal(false);
// // // // //     setLoading(true);
// // // // //     setTimeout(() => {
// // // // //       setLoading(false);
// // // // //       setPaymentSuccess(true);
// // // // //       const transactionId = 'NB' + Date.now().toString().slice(-10);
      
// // // // //       navigation.replace('OrderSuccess', {
// // // // //         orderId: transactionId,
// // // // //         totalAmount: totalAmount,
// // // // //         paymentMethod: `${bank.name} (Net Banking)`,
// // // // //       });
// // // // //     }, 2000);
// // // // //   };

// // // // //   // ============ WALLET FLOW ============
// // // // //   const handleWalletPayment = () => {
// // // // //     if (totalAmount > walletBalance) {
// // // // //       Alert.alert(
// // // // //         'Insufficient Balance',
// // // // //         `Wallet balance: ₹${walletBalance}\nAmount needed: ₹${totalAmount}\n\nPlease add money to your wallet or use another payment method.`,
// // // // //         [
// // // // //           { text: 'OK', onPress: () => setShowWalletModal(false) }
// // // // //         ]
// // // // //       );
// // // // //       return;
// // // // //     }

// // // // //     setShowWalletModal(false);
// // // // //     setLoading(true);
// // // // //     setTimeout(() => {
// // // // //       setLoading(false);
// // // // //       setPaymentSuccess(true);
// // // // //       const transactionId = 'WLT' + Date.now().toString().slice(-10);
      
// // // // //       navigation.replace('OrderSuccess', {
// // // // //         orderId: transactionId,
// // // // //         totalAmount: totalAmount,
// // // // //         paymentMethod: 'Wallet',
// // // // //       });
// // // // //     }, 1500);
// // // // //   };

// // // // //   // ============ CASH ON DELIVERY - DIRECT PLACE ORDER ============
// // // // //   const handlePlaceOrder = () => {
// // // // //     Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    
// // // // //     setLoading(true);
// // // // //     setTimeout(() => {
// // // // //       setLoading(false);
// // // // //       setPaymentSuccess(true);
// // // // //       const transactionId = 'COD' + Date.now().toString().slice(-10);
      
// // // // //       navigation.replace('OrderSuccess', {
// // // // //         orderId: transactionId,
// // // // //         totalAmount: totalAmount,
// // // // //         paymentMethod: 'Cash on Delivery',
// // // // //       });
// // // // //     }, 1500);
// // // // //   };

// // // // //   const formatCardNumber = (text: string): string => {
// // // // //     const cleaned = text.replace(/\s/g, '');
// // // // //     const matches = cleaned.match(/.{1,4}/g);
// // // // //     if (matches) {
// // // // //       return matches.join(' ');
// // // // //     }
// // // // //     return text;
// // // // //   };

// // // // //   const formatExpiryDate = (text: string): string => {
// // // // //     const cleaned = text.replace(/\D/g, '');
// // // // //     if (cleaned.length >= 2) {
// // // // //       return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
// // // // //     }
// // // // //     return text;
// // // // //   };

// // // // //   return (
// // // // //     <View style={styles.container}>
// // // // //       <ScrollView showsVerticalScrollIndicator={false}>
// // // // //         {/* Header */}
// // // // //         <View style={styles.header}>
// // // // //           <TouchableOpacity onPress={() => navigation.goBack()}>
// // // // //             <Icon name="arrow-back" size={24} color={colors.text} />
// // // // //           </TouchableOpacity>
// // // // //           <Text style={styles.headerTitle}>Payment</Text>
// // // // //           <View style={{ width: 24 }} />
// // // // //         </View>

// // // // //         {/* Amount */}
// // // // //         <View style={styles.amountContainer}>
// // // // //           <Text style={styles.amountLabel}>Amount to Pay</Text>
// // // // //           <Text style={styles.amountValue}>₹{totalAmount}</Text>
// // // // //         </View>

// // // // //         {/* Payment Methods */}
// // // // //         <View style={styles.methodsContainer}>
// // // // //           <Text style={styles.sectionTitle}>Payment Methods</Text>
// // // // //           {paymentMethods.map((method) => (
// // // // //             <TouchableOpacity
// // // // //               key={method.id}
// // // // //               style={[
// // // // //                 styles.methodItem,
// // // // //                 selectedMethod === method.id && styles.selectedMethod,
// // // // //               ]}
// // // // //               onPress={() => handleSelectMethod(method.id)}
// // // // //             >
// // // // //               <View style={styles.methodLeft}>
// // // // //                 <View style={[styles.methodIcon, selectedMethod === method.id && styles.selectedMethodIcon]}>
// // // // //                   <Icon name={method.icon} size={22} color={selectedMethod === method.id ? colors.white : colors.text} />
// // // // //                 </View>
// // // // //                 <View style={styles.methodInfo}>
// // // // //                   <Text style={[
// // // // //                     styles.methodName,
// // // // //                     selectedMethod === method.id && styles.selectedMethodText,
// // // // //                   ]}>
// // // // //                     {method.name}
// // // // //                   </Text>
// // // // //                   <Text style={styles.methodDesc}>{method.desc}</Text>
// // // // //                 </View>
// // // // //               </View>
// // // // //               {selectedMethod === method.id && (
// // // // //                 <Icon name="checkmark-circle" size={24} color={colors.primary} />
// // // // //               )}
// // // // //             </TouchableOpacity>
// // // // //           ))}
// // // // //         </View>

// // // // //         {/* Cash on Delivery Info */}
// // // // //         {selectedMethod === 'cash' && (
// // // // //           <View style={styles.infoContainer}>
// // // // //             <Icon name="information-circle-outline" size={20} color={colors.info} />
// // // // //             <Text style={styles.infoText}>
// // // // //               Pay with cash when your order arrives. No additional charges.
// // // // //             </Text>
// // // // //           </View>
// // // // //         )}
// // // // //       </ScrollView>

// // // // //       {/* Place Order Button - Shows for Cash on Delivery only */}
// // // // //       {selectedMethod === 'cash' && (
// // // // //         <View style={styles.footer}>
// // // // //           <TouchableOpacity 
// // // // //             style={styles.placeOrderButton} 
// // // // //             onPress={handlePlaceOrder}
// // // // //             disabled={loading}
// // // // //           >
// // // // //             {loading ? (
// // // // //               <ActivityIndicator color="#ffffff" />
// // // // //             ) : (
// // // // //               <Text style={styles.placeOrderButtonText}>Place Order • ₹{totalAmount}</Text>
// // // // //             )}
// // // // //           </TouchableOpacity>
// // // // //         </View>
// // // // //       )}

// // // // //       {/* ============ UPI MODAL ============ */}
// // // // //       <Modal
// // // // //         visible={showUPIModal}
// // // // //         transparent={true}
// // // // //         animationType="slide"
// // // // //         onRequestClose={() => setShowUPIModal(false)}
// // // // //       >
// // // // //         <View style={styles.modalOverlay}>
// // // // //           <View style={styles.modalContainer}>
// // // // //             <View style={styles.modalHeader}>
// // // // //               <Text style={styles.modalTitle}>Select UPI App</Text>
// // // // //               <TouchableOpacity onPress={() => setShowUPIModal(false)}>
// // // // //                 <Icon name="close" size={24} color={colors.text} />
// // // // //               </TouchableOpacity>
// // // // //             </View>

// // // // //             <View style={styles.upiAppsContainer}>
// // // // //               {upiApps.map((app) => (
// // // // //                 <TouchableOpacity
// // // // //                   key={app.id}
// // // // //                   style={styles.upiAppItem}
// // // // //                   onPress={() => handleUPISelection(app)}
// // // // //                 >
// // // // //                   <View style={[styles.upiAppIcon, { backgroundColor: app.color + '20' }]}>
// // // // //                     <Text style={styles.upiAppEmoji}>{app.emoji}</Text>
// // // // //                   </View>
// // // // //                   <View style={styles.upiAppInfo}>
// // // // //                     <Text style={styles.upiAppName}>{app.name}</Text>
// // // // //                     <Text style={styles.upiAppDesc}>UPI Payment</Text>
// // // // //                   </View>
// // // // //                   <Icon name="chevron-forward" size={20} color={colors.gray} />
// // // // //                 </TouchableOpacity>
// // // // //               ))}
// // // // //             </View>

// // // // //             <TouchableOpacity 
// // // // //               style={styles.enterUPIButton}
// // // // //               onPress={() => {
// // // // //                 setShowUPIModal(false);
// // // // //                 setSelectedUPIApp('Manual UPI');
// // // // //                 setTimeout(() => {
// // // // //                   setShowUPIPinModal(true);
// // // // //                 }, 300);
// // // // //               }}
// // // // //             >
// // // // //               <Text style={styles.enterUPIButtonText}>Enter UPI ID Manually</Text>
// // // // //             </TouchableOpacity>
// // // // //           </View>
// // // // //         </View>
// // // // //       </Modal>

// // // // //       {/* ============ UPI PIN MODAL ============ */}
// // // // //       <Modal
// // // // //         visible={showUPIPinModal}
// // // // //         transparent={true}
// // // // //         animationType="fade"
// // // // //         onRequestClose={() => {
// // // // //           setShowUPIPinModal(false);
// // // // //           setUpiPin('');
// // // // //         }}
// // // // //       >
// // // // //         <View style={styles.pinModalOverlay}>
// // // // //           <View style={styles.pinModalContainer}>
// // // // //             <View style={styles.pinModalHeader}>
// // // // //               <Text style={styles.pinModalTitle}>
// // // // //                 {selectedUPIApp || 'UPI'} PIN
// // // // //               </Text>
// // // // //               <Text style={styles.pinModalSubtitle}>
// // // // //                 Enter your 4-digit UPI PIN to confirm payment
// // // // //               </Text>
// // // // //             </View>

// // // // //             <View style={styles.pinDisplayContainer}>
// // // // //               <View style={styles.pinDisplay}>
// // // // //                 {[0, 1, 2, 3].map((index) => (
// // // // //                   <View key={index} style={styles.pinDotContainer}>
// // // // //                     <View style={[
// // // // //                       styles.pinDot,
// // // // //                       upiPin.length > index && styles.pinDotFilled,
// // // // //                     ]} />
// // // // //                   </View>
// // // // //                 ))}
// // // // //               </View>
// // // // //             </View>

// // // // //             <View style={styles.pinKeyboard}>
// // // // //               {[1, 2, 3, 4, 5, 6, 7, 8, 9, 'clear', 0, 'delete'].map((key) => (
// // // // //                 <TouchableOpacity
// // // // //                   key={key.toString()}
// // // // //                   style={styles.pinKey}
// // // // //                   onPress={() => {
// // // // //                     if (key === 'clear') {
// // // // //                       setUpiPin('');
// // // // //                     } else if (key === 'delete') {
// // // // //                       setUpiPin(upiPin.slice(0, -1));
// // // // //                     } else if (upiPin.length < 4) {
// // // // //                       setUpiPin(upiPin + key.toString());
// // // // //                     }
// // // // //                   }}
// // // // //                 >
// // // // //                   <Text style={styles.pinKeyText}>
// // // // //                     {key === 'clear' ? 'Clear' : key === 'delete' ? '⌫' : key}
// // // // //                   </Text>
// // // // //                 </TouchableOpacity>
// // // // //               ))}
// // // // //             </View>

// // // // //             <TouchableOpacity
// // // // //               style={[styles.pinConfirmButton, upiPin.length !== 4 && styles.pinConfirmButtonDisabled]}
// // // // //               onPress={handleUPIPinSubmit}
// // // // //               disabled={upiPin.length !== 4}
// // // // //             >
// // // // //               <Text style={styles.pinConfirmButtonText}>
// // // // //                 Pay ₹{totalAmount}
// // // // //               </Text>
// // // // //             </TouchableOpacity>

// // // // //             <TouchableOpacity
// // // // //               style={styles.pinCancelButton}
// // // // //               onPress={() => {
// // // // //                 setShowUPIPinModal(false);
// // // // //                 setUpiPin('');
// // // // //               }}
// // // // //             >
// // // // //               <Text style={styles.pinCancelButtonText}>Cancel</Text>
// // // // //             </TouchableOpacity>
// // // // //           </View>
// // // // //         </View>
// // // // //       </Modal>

// // // // //       {/* ============ CARD MODAL ============ */}
// // // // //       <Modal
// // // // //         visible={showCardModal}
// // // // //         transparent={true}
// // // // //         animationType="slide"
// // // // //         onRequestClose={() => setShowCardModal(false)}
// // // // //       >
// // // // //         <View style={styles.modalOverlay}>
// // // // //           <View style={styles.modalContainer}>
// // // // //             <View style={styles.modalHeader}>
// // // // //               <Text style={styles.modalTitle}>Card Details</Text>
// // // // //               <TouchableOpacity onPress={() => setShowCardModal(false)}>
// // // // //                 <Icon name="close" size={24} color={colors.text} />
// // // // //               </TouchableOpacity>
// // // // //             </View>

// // // // //             <View style={styles.cardModalBody}>
// // // // //               <View style={styles.cardPreview}>
// // // // //                 <Icon name="card-outline" size={40} color={colors.primary} />
// // // // //                 <Text style={styles.cardPreviewText}>Enter Card Details</Text>
// // // // //               </View>

// // // // //               <View style={styles.inputContainer}>
// // // // //                 <Text style={styles.inputLabel}>Card Number</Text>
// // // // //                 <TextInput
// // // // //                   style={styles.input}
// // // // //                   placeholder="1234 5678 9012 3456"
// // // // //                   value={cardNumber}
// // // // //                   onChangeText={(text) => setCardNumber(formatCardNumber(text))}
// // // // //                   keyboardType="numeric"
// // // // //                   maxLength={19}
// // // // //                 />
// // // // //               </View>

// // // // //               <View style={styles.inputContainer}>
// // // // //                 <Text style={styles.inputLabel}>Card Holder Name</Text>
// // // // //                 <TextInput
// // // // //                   style={styles.input}
// // // // //                   placeholder="John Doe"
// // // // //                   value={cardHolder}
// // // // //                   onChangeText={setCardHolder}
// // // // //                 />
// // // // //               </View>

// // // // //               <View style={styles.rowInputs}>
// // // // //                 <View style={[styles.inputContainer, styles.halfInput]}>
// // // // //                   <Text style={styles.inputLabel}>Expiry Date</Text>
// // // // //                   <TextInput
// // // // //                     style={styles.input}
// // // // //                     placeholder="MM/YY"
// // // // //                     value={expiryDate}
// // // // //                     onChangeText={(text) => setExpiryDate(formatExpiryDate(text))}
// // // // //                     keyboardType="numeric"
// // // // //                     maxLength={5}
// // // // //                   />
// // // // //                 </View>
// // // // //                 <View style={[styles.inputContainer, styles.halfInput]}>
// // // // //                   <Text style={styles.inputLabel}>CVV</Text>
// // // // //                   <TextInput
// // // // //                     style={styles.input}
// // // // //                     placeholder="123"
// // // // //                     value={cvv}
// // // // //                     onChangeText={setCvv}
// // // // //                     keyboardType="numeric"
// // // // //                     maxLength={4}
// // // // //                     secureTextEntry
// // // // //                   />
// // // // //                 </View>
// // // // //               </View>

// // // // //               <TouchableOpacity 
// // // // //                 style={styles.payNowButton} 
// // // // //                 onPress={handleCardPayment}
// // // // //                 disabled={loading}
// // // // //               >
// // // // //                 {loading ? (
// // // // //                   <ActivityIndicator color="#ffffff" />
// // // // //                 ) : (
// // // // //                   <Text style={styles.payNowButtonText}>Pay ₹{totalAmount}</Text>
// // // // //                 )}
// // // // //               </TouchableOpacity>
// // // // //             </View>
// // // // //           </View>
// // // // //         </View>
// // // // //       </Modal>

// // // // //       {/* ============ NET BANKING MODAL ============ */}
// // // // //       <Modal
// // // // //         visible={showNetBankingModal}
// // // // //         transparent={true}
// // // // //         animationType="slide"
// // // // //         onRequestClose={() => setShowNetBankingModal(false)}
// // // // //       >
// // // // //         <View style={styles.modalOverlay}>
// // // // //           <View style={styles.modalContainer}>
// // // // //             <View style={styles.modalHeader}>
// // // // //               <Text style={styles.modalTitle}>Select Bank</Text>
// // // // //               <TouchableOpacity onPress={() => setShowNetBankingModal(false)}>
// // // // //                 <Icon name="close" size={24} color={colors.text} />
// // // // //               </TouchableOpacity>
// // // // //             </View>

// // // // //             <View style={styles.banksContainer}>
// // // // //               {banks.map((bank) => (
// // // // //                 <TouchableOpacity
// // // // //                   key={bank.id}
// // // // //                   style={styles.bankItem}
// // // // //                   onPress={() => handleNetBankingSelect(bank)}
// // // // //                 >
// // // // //                   <View style={[styles.bankIcon, { backgroundColor: bank.color + '20' }]}>
// // // // //                     <Text style={styles.bankEmoji}>{bank.icon}</Text>
// // // // //                   </View>
// // // // //                   <View style={styles.bankInfo}>
// // // // //                     <Text style={styles.bankName}>{bank.name}</Text>
// // // // //                     <Text style={styles.bankDesc}>Net Banking</Text>
// // // // //                   </View>
// // // // //                   <Icon name="chevron-forward" size={20} color={colors.gray} />
// // // // //                 </TouchableOpacity>
// // // // //               ))}
// // // // //             </View>
// // // // //           </View>
// // // // //         </View>
// // // // //       </Modal>

// // // // //       {/* ============ WALLET MODAL ============ */}
// // // // //       <Modal
// // // // //         visible={showWalletModal}
// // // // //         transparent={true}
// // // // //         animationType="slide"
// // // // //         onRequestClose={() => setShowWalletModal(false)}
// // // // //       >
// // // // //         <View style={styles.modalOverlay}>
// // // // //           <View style={styles.modalContainer}>
// // // // //             <View style={styles.modalHeader}>
// // // // //               <Text style={styles.modalTitle}>Pay with Wallet</Text>
// // // // //               <TouchableOpacity onPress={() => setShowWalletModal(false)}>
// // // // //                 <Icon name="close" size={24} color={colors.text} />
// // // // //               </TouchableOpacity>
// // // // //             </View>

// // // // //             <View style={styles.walletModalBody}>
// // // // //               <View style={styles.walletBalanceContainer}>
// // // // //                 <Icon name="wallet-outline" size={40} color={colors.primary} />
// // // // //                 <Text style={styles.walletBalanceTitle}>Wallet Balance</Text>
// // // // //                 <Text style={styles.walletBalanceAmount}>₹{walletBalance}</Text>
// // // // //               </View>

// // // // //               <View style={styles.walletInfoContainer}>
// // // // //                 <View style={styles.walletInfoRow}>
// // // // //                   <Text style={styles.walletInfoLabel}>Order Total</Text>
// // // // //                   <Text style={styles.walletInfoValue}>₹{totalAmount}</Text>
// // // // //                 </View>
// // // // //                 <View style={styles.walletInfoRow}>
// // // // //                   <Text style={styles.walletInfoLabel}>Balance After Payment</Text>
// // // // //                   <Text style={[styles.walletInfoValue, { color: totalAmount <= walletBalance ? colors.success : colors.danger }]}>
// // // // //                     ₹{walletBalance - totalAmount}
// // // // //                   </Text>
// // // // //                 </View>
// // // // //               </View>

// // // // //               <TouchableOpacity 
// // // // //                 style={[styles.walletPayButton, totalAmount > walletBalance && styles.walletPayButtonDisabled]}
// // // // //                 onPress={handleWalletPayment}
// // // // //                 disabled={loading || totalAmount > walletBalance}
// // // // //               >
// // // // //                 {loading ? (
// // // // //                   <ActivityIndicator color="#ffffff" />
// // // // //                 ) : (
// // // // //                   <Text style={styles.walletPayButtonText}>
// // // // //                     {totalAmount > walletBalance ? 'Insufficient Balance' : `Pay ₹${totalAmount}`}
// // // // //                   </Text>
// // // // //                 )}
// // // // //               </TouchableOpacity>
// // // // //             </View>
// // // // //           </View>
// // // // //         </View>
// // // // //       </Modal>

// // // // //       {/* Loading Overlay */}
// // // // //       {loading && (
// // // // //         <View style={styles.loadingOverlay}>
// // // // //           <View style={styles.loadingContainer}>
// // // // //             <ActivityIndicator size="large" color={colors.primary} />
// // // // //             <Text style={styles.loadingText}>Processing Payment...</Text>
// // // // //             <Text style={styles.loadingSubText}>Please do not close the app</Text>
// // // // //           </View>
// // // // //         </View>
// // // // //       )}
// // // // //     </View>
// // // // //   );
// // // // // }

// // // // // const styles = StyleSheet.create({
// // // // //   container: {
// // // // //     flex: 1,
// // // // //     backgroundColor: colors.white,
// // // // //   },
// // // // //   header: {
// // // // //     flexDirection: 'row',
// // // // //     alignItems: 'center',
// // // // //     justifyContent: 'space-between',
// // // // //     padding: 16,
// // // // //     paddingTop: 40,
// // // // //     borderBottomWidth: 1,
// // // // //     borderBottomColor: colors.border,
// // // // //   },
// // // // //   headerTitle: {
// // // // //     fontSize: 18,
// // // // //     fontWeight: '600',
// // // // //     color: colors.text,
// // // // //   },
// // // // //   amountContainer: {
// // // // //     backgroundColor: colors.primary,
// // // // //     padding: 20,
// // // // //     margin: 16,
// // // // //     borderRadius: 12,
// // // // //     alignItems: 'center',
// // // // //   },
// // // // //   amountLabel: {
// // // // //     fontSize: 14,
// // // // //     color: colors.white,
// // // // //     opacity: 0.8,
// // // // //   },
// // // // //   amountValue: {
// // // // //     fontSize: 28,
// // // // //     fontWeight: '700',
// // // // //     color: colors.white,
// // // // //     marginTop: 4,
// // // // //   },
// // // // //   methodsContainer: {
// // // // //     paddingHorizontal: 16,
// // // // //     paddingBottom: 20,
// // // // //   },
// // // // //   sectionTitle: {
// // // // //     fontSize: 16,
// // // // //     fontWeight: '600',
// // // // //     color: colors.text,
// // // // //     marginBottom: 12,
// // // // //   },
// // // // //   methodItem: {
// // // // //     flexDirection: 'row',
// // // // //     justifyContent: 'space-between',
// // // // //     alignItems: 'center',
// // // // //     padding: 14,
// // // // //     borderWidth: 1,
// // // // //     borderColor: colors.border,
// // // // //     borderRadius: 10,
// // // // //     marginBottom: 8,
// // // // //   },
// // // // //   selectedMethod: {
// // // // //     borderColor: colors.primary,
// // // // //     backgroundColor: '#fff5ec',
// // // // //   },
// // // // //   methodLeft: {
// // // // //     flexDirection: 'row',
// // // // //     alignItems: 'center',
// // // // //     flex: 1,
// // // // //   },
// // // // //   methodIcon: {
// // // // //     width: 36,
// // // // //     height: 36,
// // // // //     borderRadius: 18,
// // // // //     backgroundColor: colors.lightGray,
// // // // //     justifyContent: 'center',
// // // // //     alignItems: 'center',
// // // // //     marginRight: 12,
// // // // //   },
// // // // //   selectedMethodIcon: {
// // // // //     backgroundColor: colors.primary,
// // // // //   },
// // // // //   methodInfo: {
// // // // //     flex: 1,
// // // // //   },
// // // // //   methodName: {
// // // // //     fontSize: 14,
// // // // //     color: colors.text,
// // // // //   },
// // // // //   selectedMethodText: {
// // // // //     color: colors.primary,
// // // // //     fontWeight: '500',
// // // // //   },
// // // // //   methodDesc: {
// // // // //     fontSize: 11,
// // // // //     color: colors.textLight,
// // // // //     marginTop: 1,
// // // // //   },
// // // // //   infoContainer: {
// // // // //     flexDirection: 'row',
// // // // //     alignItems: 'center',
// // // // //     backgroundColor: '#f8f9fa',
// // // // //     marginHorizontal: 16,
// // // // //     marginBottom: 16,
// // // // //     padding: 12,
// // // // //     borderRadius: 8,
// // // // //     borderWidth: 1,
// // // // //     borderColor: colors.border,
// // // // //   },
// // // // //   infoText: {
// // // // //     fontSize: 13,
// // // // //     color: colors.textLight,
// // // // //     marginLeft: 10,
// // // // //     flex: 1,
// // // // //   },
// // // // //   footer: {
// // // // //     padding: 16,
// // // // //     backgroundColor: colors.white,
// // // // //     borderTopWidth: 1,
// // // // //     borderTopColor: colors.border,
// // // // //   },
// // // // //   placeOrderButton: {
// // // // //     backgroundColor: colors.primary,
// // // // //     borderRadius: 12,
// // // // //     height: 50,
// // // // //     justifyContent: 'center',
// // // // //     alignItems: 'center',
// // // // //   },
// // // // //   placeOrderButtonText: {
// // // // //     color: colors.white,
// // // // //     fontSize: 16,
// // // // //     fontWeight: '600',
// // // // //   },
// // // // //   modalOverlay: {
// // // // //     flex: 1,
// // // // //     backgroundColor: 'rgba(0,0,0,0.5)',
// // // // //     justifyContent: 'flex-end',
// // // // //   },
// // // // //   modalContainer: {
// // // // //     backgroundColor: colors.white,
// // // // //     borderTopLeftRadius: 24,
// // // // //     borderTopRightRadius: 24,
// // // // //     paddingHorizontal: 20,
// // // // //     paddingBottom: 30,
// // // // //     maxHeight: '80%',
// // // // //   },
// // // // //   modalHeader: {
// // // // //     flexDirection: 'row',
// // // // //     justifyContent: 'space-between',
// // // // //     alignItems: 'center',
// // // // //     paddingVertical: 16,
// // // // //     borderBottomWidth: 1,
// // // // //     borderBottomColor: colors.border,
// // // // //   },
// // // // //   modalTitle: {
// // // // //     fontSize: 18,
// // // // //     fontWeight: '600',
// // // // //     color: colors.text,
// // // // //   },
// // // // //   upiAppsContainer: {
// // // // //     marginTop: 12,
// // // // //   },
// // // // //   upiAppItem: {
// // // // //     flexDirection: 'row',
// // // // //     alignItems: 'center',
// // // // //     paddingVertical: 14,
// // // // //     borderBottomWidth: 1,
// // // // //     borderBottomColor: colors.border,
// // // // //   },
// // // // //   upiAppIcon: {
// // // // //     width: 48,
// // // // //     height: 48,
// // // // //     borderRadius: 24,
// // // // //     justifyContent: 'center',
// // // // //     alignItems: 'center',
// // // // //     marginRight: 12,
// // // // //   },
// // // // //   upiAppEmoji: {
// // // // //     fontSize: 24,
// // // // //   },
// // // // //   upiAppInfo: {
// // // // //     flex: 1,
// // // // //   },
// // // // //   upiAppName: {
// // // // //     fontSize: 15,
// // // // //     fontWeight: '500',
// // // // //     color: colors.text,
// // // // //   },
// // // // //   upiAppDesc: {
// // // // //     fontSize: 12,
// // // // //     color: colors.textLight,
// // // // //     marginTop: 2,
// // // // //   },
// // // // //   enterUPIButton: {
// // // // //     marginTop: 16,
// // // // //     paddingVertical: 12,
// // // // //     borderWidth: 1,
// // // // //     borderColor: colors.primary,
// // // // //     borderRadius: 8,
// // // // //     alignItems: 'center',
// // // // //   },
// // // // //   enterUPIButtonText: {
// // // // //     color: colors.primary,
// // // // //     fontSize: 14,
// // // // //     fontWeight: '500',
// // // // //   },
// // // // //   pinModalOverlay: {
// // // // //     flex: 1,
// // // // //     backgroundColor: 'rgba(0,0,0,0.7)',
// // // // //     justifyContent: 'center',
// // // // //     alignItems: 'center',
// // // // //   },
// // // // //   pinModalContainer: {
// // // // //     backgroundColor: colors.white,
// // // // //     borderRadius: 24,
// // // // //     padding: 24,
// // // // //     width: '85%',
// // // // //     maxWidth: 400,
// // // // //   },
// // // // //   pinModalHeader: {
// // // // //     alignItems: 'center',
// // // // //     marginBottom: 20,
// // // // //   },
// // // // //   pinModalTitle: {
// // // // //     fontSize: 20,
// // // // //     fontWeight: '700',
// // // // //     color: colors.text,
// // // // //   },
// // // // //   pinModalSubtitle: {
// // // // //     fontSize: 14,
// // // // //     color: colors.textLight,
// // // // //     marginTop: 4,
// // // // //   },
// // // // //   pinDisplayContainer: {
// // // // //     alignItems: 'center',
// // // // //     marginBottom: 24,
// // // // //   },
// // // // //   pinDisplay: {
// // // // //     flexDirection: 'row',
// // // // //     justifyContent: 'center',
// // // // //   },
// // // // //   pinDotContainer: {
// // // // //     marginHorizontal: 8,
// // // // //   },
// // // // //   pinDot: {
// // // // //     width: 16,
// // // // //     height: 16,
// // // // //     borderRadius: 8,
// // // // //     borderWidth: 2,
// // // // //     borderColor: colors.border,
// // // // //     backgroundColor: colors.white,
// // // // //   },
// // // // //   pinDotFilled: {
// // // // //     backgroundColor: colors.primary,
// // // // //     borderColor: colors.primary,
// // // // //   },
// // // // //   pinKeyboard: {
// // // // //     flexDirection: 'row',
// // // // //     flexWrap: 'wrap',
// // // // //     justifyContent: 'center',
// // // // //     marginBottom: 16,
// // // // //   },
// // // // //   pinKey: {
// // // // //     width: '30%',
// // // // //     aspectRatio: 1.2,
// // // // //     justifyContent: 'center',
// // // // //     alignItems: 'center',
// // // // //     margin: '1.5%',
// // // // //     borderRadius: 12,
// // // // //     backgroundColor: colors.lightGray,
// // // // //   },
// // // // //   pinKeyText: {
// // // // //     fontSize: 22,
// // // // //     fontWeight: '500',
// // // // //     color: colors.text,
// // // // //   },
// // // // //   pinConfirmButton: {
// // // // //     backgroundColor: colors.primary,
// // // // //     paddingVertical: 14,
// // // // //     borderRadius: 12,
// // // // //     alignItems: 'center',
// // // // //     marginBottom: 8,
// // // // //   },
// // // // //   pinConfirmButtonDisabled: {
// // // // //     backgroundColor: colors.gray,
// // // // //   },
// // // // //   pinConfirmButtonText: {
// // // // //     color: colors.white,
// // // // //     fontSize: 16,
// // // // //     fontWeight: '600',
// // // // //   },
// // // // //   pinCancelButton: {
// // // // //     paddingVertical: 10,
// // // // //     alignItems: 'center',
// // // // //   },
// // // // //   pinCancelButtonText: {
// // // // //     color: colors.textLight,
// // // // //     fontSize: 14,
// // // // //   },
// // // // //   cardModalBody: {
// // // // //     marginTop: 8,
// // // // //   },
// // // // //   cardPreview: {
// // // // //     alignItems: 'center',
// // // // //     paddingVertical: 20,
// // // // //     backgroundColor: '#f8f9fa',
// // // // //     borderRadius: 12,
// // // // //     marginBottom: 16,
// // // // //   },
// // // // //   cardPreviewText: {
// // // // //     fontSize: 14,
// // // // //     color: colors.textLight,
// // // // //     marginTop: 8,
// // // // //   },
// // // // //   inputContainer: {
// // // // //     marginBottom: 12,
// // // // //   },
// // // // //   inputLabel: {
// // // // //     fontSize: 14,
// // // // //     fontWeight: '500',
// // // // //     color: colors.text,
// // // // //     marginBottom: 4,
// // // // //   },
// // // // //   input: {
// // // // //     borderWidth: 1,
// // // // //     borderColor: colors.border,
// // // // //     borderRadius: 8,
// // // // //     paddingHorizontal: 12,
// // // // //     paddingVertical: 10,
// // // // //     fontSize: 14,
// // // // //     color: colors.text,
// // // // //     backgroundColor: colors.white,
// // // // //   },
// // // // //   rowInputs: {
// // // // //     flexDirection: 'row',
// // // // //     justifyContent: 'space-between',
// // // // //   },
// // // // //   halfInput: {
// // // // //     flex: 1,
// // // // //     marginRight: 8,
// // // // //   },
// // // // //   payNowButton: {
// // // // //     backgroundColor: colors.primary,
// // // // //     borderRadius: 12,
// // // // //     height: 50,
// // // // //     justifyContent: 'center',
// // // // //     alignItems: 'center',
// // // // //     marginTop: 8,
// // // // //   },
// // // // //   payNowButtonText: {
// // // // //     color: colors.white,
// // // // //     fontSize: 16,
// // // // //     fontWeight: '600',
// // // // //   },
// // // // //   banksContainer: {
// // // // //     marginTop: 12,
// // // // //   },
// // // // //   bankItem: {
// // // // //     flexDirection: 'row',
// // // // //     alignItems: 'center',
// // // // //     paddingVertical: 14,
// // // // //     borderBottomWidth: 1,
// // // // //     borderBottomColor: colors.border,
// // // // //   },
// // // // //   bankIcon: {
// // // // //     width: 44,
// // // // //     height: 44,
// // // // //     borderRadius: 22,
// // // // //     justifyContent: 'center',
// // // // //     alignItems: 'center',
// // // // //     marginRight: 12,
// // // // //   },
// // // // //   bankEmoji: {
// // // // //     fontSize: 20,
// // // // //   },
// // // // //   bankInfo: {
// // // // //     flex: 1,
// // // // //   },
// // // // //   bankName: {
// // // // //     fontSize: 14,
// // // // //     fontWeight: '500',
// // // // //     color: colors.text,
// // // // //   },
// // // // //   bankDesc: {
// // // // //     fontSize: 12,
// // // // //     color: colors.textLight,
// // // // //     marginTop: 1,
// // // // //   },
// // // // //   walletModalBody: {
// // // // //     marginTop: 8,
// // // // //   },
// // // // //   walletBalanceContainer: {
// // // // //     alignItems: 'center',
// // // // //     paddingVertical: 20,
// // // // //     backgroundColor: '#f8f9fa',
// // // // //     borderRadius: 12,
// // // // //     marginBottom: 16,
// // // // //   },
// // // // //   walletBalanceTitle: {
// // // // //     fontSize: 14,
// // // // //     color: colors.textLight,
// // // // //     marginTop: 8,
// // // // //   },
// // // // //   walletBalanceAmount: {
// // // // //     fontSize: 28,
// // // // //     fontWeight: '700',
// // // // //     color: colors.primary,
// // // // //     marginTop: 4,
// // // // //   },
// // // // //   walletInfoContainer: {
// // // // //     backgroundColor: '#f8f9fa',
// // // // //     borderRadius: 12,
// // // // //     padding: 16,
// // // // //     marginBottom: 16,
// // // // //   },
// // // // //   walletInfoRow: {
// // // // //     flexDirection: 'row',
// // // // //     justifyContent: 'space-between',
// // // // //     paddingVertical: 4,
// // // // //   },
// // // // //   walletInfoLabel: {
// // // // //     fontSize: 14,
// // // // //     color: colors.textLight,
// // // // //   },
// // // // //   walletInfoValue: {
// // // // //     fontSize: 14,
// // // // //     fontWeight: '500',
// // // // //     color: colors.text,
// // // // //   },
// // // // //   walletPayButton: {
// // // // //     backgroundColor: colors.primary,
// // // // //     borderRadius: 12,
// // // // //     height: 50,
// // // // //     justifyContent: 'center',
// // // // //     alignItems: 'center',
// // // // //   },
// // // // //   walletPayButtonDisabled: {
// // // // //     backgroundColor: colors.gray,
// // // // //   },
// // // // //   walletPayButtonText: {
// // // // //     color: colors.white,
// // // // //     fontSize: 16,
// // // // //     fontWeight: '600',
// // // // //   },
// // // // //   loadingOverlay: {
// // // // //     position: 'absolute',
// // // // //     top: 0,
// // // // //     left: 0,
// // // // //     right: 0,
// // // // //     bottom: 0,
// // // // //     backgroundColor: 'rgba(0,0,0,0.7)',
// // // // //     justifyContent: 'center',
// // // // //     alignItems: 'center',
// // // // //   },
// // // // //   loadingContainer: {
// // // // //     backgroundColor: colors.white,
// // // // //     padding: 30,
// // // // //     borderRadius: 16,
// // // // //     alignItems: 'center',
// // // // //     minWidth: 200,
// // // // //   },
// // // // //   loadingText: {
// // // // //     fontSize: 16,
// // // // //     fontWeight: '600',
// // // // //     color: colors.text,
// // // // //     marginTop: 12,
// // // // //   },
// // // // //   loadingSubText: {
// // // // //     fontSize: 12,
// // // // //     color: colors.textLight,
// // // // //     marginTop: 4,
// // // // //   },
// // // // // });
// // // // // import React, { useState } from 'react';
// // // // // import {
// // // // //   View,
// // // // //   Text,
// // // // //   ScrollView,
// // // // //   TouchableOpacity,
// // // // //   StyleSheet,
// // // // //   TextInput,
// // // // //   Alert,
// // // // //   Modal,
// // // // //   ActivityIndicator,
// // // // // } from 'react-native';
// // // // // import * as Haptics from 'expo-haptics';
// // // // // import Icon from 'react-native-vector-icons/Ionicons';
// // // // // import { colors } from '../../constants/colors';

// // // // // interface PaymentScreenProps {
// // // // //   navigation: any;
// // // // //   route: any;
// // // // // }

// // // // // export default function PaymentScreen({ route, navigation }: PaymentScreenProps) {
// // // // //   // 🔥 FIX: Get totalAmount from route params with NO hardcoded fallback
// // // // //   const { totalAmount } = route.params || {};
  
// // // // //   // If totalAmount is not passed or is 0, show error
// // // // //   const [selectedMethod, setSelectedMethod] = useState<string>('cash');
// // // // //   const [showUPIModal, setShowUPIModal] = useState<boolean>(false);
// // // // //   const [selectedUPIApp, setSelectedUPIApp] = useState<string>('');
// // // // //   const [showUPIPinModal, setShowUPIPinModal] = useState<boolean>(false);
// // // // //   const [upiPin, setUpiPin] = useState<string>('');
// // // // //   const [showCardModal, setShowCardModal] = useState<boolean>(false);
// // // // //   const [showNetBankingModal, setShowNetBankingModal] = useState<boolean>(false);
// // // // //   const [showWalletModal, setShowWalletModal] = useState<boolean>(false);
// // // // //   const [loading, setLoading] = useState<boolean>(false);
// // // // //   const [paymentSuccess, setPaymentSuccess] = useState<boolean>(false);
  
// // // // //   // Card Details
// // // // //   const [cardNumber, setCardNumber] = useState<string>('');
// // // // //   const [expiryDate, setExpiryDate] = useState<string>('');
// // // // //   const [cvv, setCvv] = useState<string>('');
// // // // //   const [cardHolder, setCardHolder] = useState<string>('');

// // // // //   // Wallet
// // // // //   const walletBalance = 2500;

// // // // //   // Net Banking Banks
// // // // //   const banks = [
// // // // //     { id: 'sbi', name: 'State Bank of India', icon: '🏦', color: '#2E6B98' },
// // // // //     { id: 'hdfc', name: 'HDFC Bank', icon: '🏛️', color: '#004F8C' },
// // // // //     { id: 'icici', name: 'ICICI Bank', icon: '🏛️', color: '#F58A1E' },
// // // // //     { id: 'axis', name: 'Axis Bank', icon: '🏦', color: '#8B1A2B' },
// // // // //     { id: 'kotak', name: 'Kotak Mahindra Bank', icon: '🏦', color: '#003F6C' },
// // // // //     { id: 'yes', name: 'Yes Bank', icon: '🏛️', color: '#1B4F7A' },
// // // // //     { id: 'pnb', name: 'Punjab National Bank', icon: '🏦', color: '#008C45' },
// // // // //     { id: 'bob', name: 'Bank of Baroda', icon: '🏛️', color: '#0F4C81' },
// // // // //   ];

// // // // //   // UPI Apps
// // // // //   const upiApps = [
// // // // //     { id: 'gpay', name: 'Google Pay', emoji: '🟢', color: '#4285F4' },
// // // // //     { id: 'phonepe', name: 'PhonePe', emoji: '🟣', color: '#5F259F' },
// // // // //     { id: 'paytm', name: 'Paytm', emoji: '🔵', color: '#00BAF2' },
// // // // //     { id: 'amazonpay', name: 'Amazon Pay', emoji: '🟠', color: '#FF9900' },
// // // // //     { id: 'bhim', name: 'BHIM UPI', emoji: '🔷', color: '#0084B4' },
// // // // //   ];

// // // // //   const paymentMethods: { id: string; name: string; icon: string; desc: string }[] = [
// // // // //     { id: 'card', name: 'Credit/Debit Card', icon: 'card-outline', desc: 'Pay with card' },
// // // // //     { id: 'upi', name: 'UPI', icon: 'phone-portrait-outline', desc: 'Google Pay, PhonePe, Paytm' },
// // // // //     { id: 'netbanking', name: 'Net Banking', icon: 'business-outline', desc: 'All major banks' },
// // // // //     { id: 'wallet', name: 'Wallet', icon: 'wallet-outline', desc: `Balance: ₹${walletBalance}` },
// // // // //     { id: 'cash', name: 'Cash on Delivery', icon: 'cash-outline', desc: 'Pay when you receive' },
// // // // //   ];

// // // // //   const handleSelectMethod = (methodId: string) => {
// // // // //     Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
// // // // //     setSelectedMethod(methodId);
    
// // // // //     switch (methodId) {
// // // // //       case 'upi':
// // // // //         setShowUPIModal(true);
// // // // //         break;
// // // // //       case 'card':
// // // // //         setShowCardModal(true);
// // // // //         break;
// // // // //       case 'netbanking':
// // // // //         setShowNetBankingModal(true);
// // // // //         break;
// // // // //       case 'wallet':
// // // // //         setShowWalletModal(true);
// // // // //         break;
// // // // //       case 'cash':
// // // // //         // Just select the method
// // // // //         break;
// // // // //       default:
// // // // //         break;
// // // // //     }
// // // // //   };

// // // // //   // ============ UPI FLOW ============
// // // // //   const handleUPISelection = (app: any) => {
// // // // //     setSelectedUPIApp(app.name);
// // // // //     setShowUPIModal(false);
// // // // //     setTimeout(() => {
// // // // //       setShowUPIPinModal(true);
// // // // //     }, 300);
// // // // //   };

// // // // //   const handleUPIPinSubmit = () => {
// // // // //     if (upiPin.length !== 4) {
// // // // //       Alert.alert('Error', 'Please enter a valid 4-digit UPI PIN');
// // // // //       return;
// // // // //     }

// // // // //     Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
// // // // //     setShowUPIPinModal(false);
// // // // //     setLoading(true);
// // // // //     setUpiPin('');
    
// // // // //     setTimeout(() => {
// // // // //       setLoading(false);
// // // // //       setPaymentSuccess(true);
// // // // //       const transactionId = 'UPI' + Date.now().toString().slice(-10);
      
// // // // //       navigation.replace('OrderSuccess', {
// // // // //         orderId: transactionId,
// // // // //         totalAmount: totalAmount,
// // // // //         paymentMethod: `${selectedUPIApp || 'UPI'}`,
// // // // //       });
// // // // //     }, 2000);
// // // // //   };

// // // // //   // ============ CARD FLOW ============
// // // // //   const handleCardPayment = () => {
// // // // //     if (!cardNumber || !expiryDate || !cvv || !cardHolder) {
// // // // //       Alert.alert('Error', 'Please fill all card details');
// // // // //       return;
// // // // //     }
// // // // //     if (cardNumber.replace(/\s/g, '').length !== 16) {
// // // // //       Alert.alert('Error', 'Please enter a valid 16-digit card number');
// // // // //       return;
// // // // //     }
// // // // //     if (cvv.length < 3) {
// // // // //       Alert.alert('Error', 'Please enter a valid CVV');
// // // // //       return;
// // // // //     }

// // // // //     Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
// // // // //     setShowCardModal(false);
// // // // //     setLoading(true);
    
// // // // //     setTimeout(() => {
// // // // //       setLoading(false);
// // // // //       setPaymentSuccess(true);
// // // // //       const transactionId = 'CARD' + Date.now().toString().slice(-10);
      
// // // // //       navigation.replace('OrderSuccess', {
// // // // //         orderId: transactionId,
// // // // //         totalAmount: totalAmount,
// // // // //         paymentMethod: 'Credit/Debit Card',
// // // // //       });
// // // // //     }, 2500);
// // // // //   };

// // // // //   // ============ NET BANKING FLOW ============
// // // // //   const handleNetBankingSelect = (bank: any) => {
// // // // //     setShowNetBankingModal(false);
// // // // //     setLoading(true);
// // // // //     setTimeout(() => {
// // // // //       setLoading(false);
// // // // //       setPaymentSuccess(true);
// // // // //       const transactionId = 'NB' + Date.now().toString().slice(-10);
      
// // // // //       navigation.replace('OrderSuccess', {
// // // // //         orderId: transactionId,
// // // // //         totalAmount: totalAmount,
// // // // //         paymentMethod: `${bank.name} (Net Banking)`,
// // // // //       });
// // // // //     }, 2000);
// // // // //   };

// // // // //   // ============ WALLET FLOW ============
// // // // //   const handleWalletPayment = () => {
// // // // //     if (totalAmount > walletBalance) {
// // // // //       Alert.alert(
// // // // //         'Insufficient Balance',
// // // // //         `Wallet balance: ₹${walletBalance}\nAmount needed: ₹${totalAmount}\n\nPlease add money to your wallet or use another payment method.`,
// // // // //         [
// // // // //           { text: 'OK', onPress: () => setShowWalletModal(false) }
// // // // //         ]
// // // // //       );
// // // // //       return;
// // // // //     }

// // // // //     setShowWalletModal(false);
// // // // //     setLoading(true);
// // // // //     setTimeout(() => {
// // // // //       setLoading(false);
// // // // //       setPaymentSuccess(true);
// // // // //       const transactionId = 'WLT' + Date.now().toString().slice(-10);
      
// // // // //       navigation.replace('OrderSuccess', {
// // // // //         orderId: transactionId,
// // // // //         totalAmount: totalAmount,
// // // // //         paymentMethod: 'Wallet',
// // // // //       });
// // // // //     }, 1500);
// // // // //   };

// // // // //   // ============ CASH ON DELIVERY ============
// // // // //   const handlePlaceOrder = () => {
// // // // //     Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    
// // // // //     setLoading(true);
// // // // //     setTimeout(() => {
// // // // //       setLoading(false);
// // // // //       setPaymentSuccess(true);
// // // // //       const transactionId = 'COD' + Date.now().toString().slice(-10);
      
// // // // //       navigation.replace('OrderSuccess', {
// // // // //         orderId: transactionId,
// // // // //         totalAmount: totalAmount,
// // // // //         paymentMethod: 'Cash on Delivery',
// // // // //       });
// // // // //     }, 1500);
// // // // //   };

// // // // //   const formatCardNumber = (text: string): string => {
// // // // //     const cleaned = text.replace(/\s/g, '');
// // // // //     const matches = cleaned.match(/.{1,4}/g);
// // // // //     if (matches) {
// // // // //       return matches.join(' ');
// // // // //     }
// // // // //     return text;
// // // // //   };

// // // // //   const formatExpiryDate = (text: string): string => {
// // // // //     const cleaned = text.replace(/\D/g, '');
// // // // //     if (cleaned.length >= 2) {
// // // // //       return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
// // // // //     }
// // // // //     return text;
// // // // //   };

// // // // //   // 🔥 FIX: If no amount is passed, show error instead of using hardcoded value
// // // // //   if (!totalAmount || totalAmount === 0) {
// // // // //     return (
// // // // //       <View style={[styles.container, styles.centerContent]}>
// // // // //         <Icon name="alert-circle-outline" size={60} color={colors.danger || '#ff4444'} />
// // // // //         <Text style={styles.errorText}>No amount specified</Text>
// // // // //         <Text style={styles.errorSubText}>Please go back and try again</Text>
// // // // //         <TouchableOpacity 
// // // // //           style={styles.goBackButton}
// // // // //           onPress={() => navigation.goBack()}
// // // // //         >
// // // // //           <Text style={styles.goBackButtonText}>Go Back</Text>
// // // // //         </TouchableOpacity>
// // // // //       </View>
// // // // //     );
// // // // //   }

// // // // //   return (
// // // // //     <View style={styles.container}>
// // // // //       <ScrollView showsVerticalScrollIndicator={false}>
// // // // //         {/* Header */}
// // // // //         <View style={styles.header}>
// // // // //           <TouchableOpacity onPress={() => navigation.goBack()}>
// // // // //             <Icon name="arrow-back" size={24} color={colors.text} />
// // // // //           </TouchableOpacity>
// // // // //           <Text style={styles.headerTitle}>Payment</Text>
// // // // //           <View style={{ width: 24 }} />
// // // // //         </View>

// // // // //         {/* Amount - Shows dynamic value */}
// // // // //         <View style={styles.amountContainer}>
// // // // //           <Text style={styles.amountLabel}>Amount to Pay</Text>
// // // // //           <Text style={styles.amountValue}>₹{totalAmount}</Text>
// // // // //         </View>

// // // // //         {/* Payment Methods */}
// // // // //         <View style={styles.methodsContainer}>
// // // // //           <Text style={styles.sectionTitle}>Payment Methods</Text>
// // // // //           {paymentMethods.map((method) => (
// // // // //             <TouchableOpacity
// // // // //               key={method.id}
// // // // //               style={[
// // // // //                 styles.methodItem,
// // // // //                 selectedMethod === method.id && styles.selectedMethod,
// // // // //               ]}
// // // // //               onPress={() => handleSelectMethod(method.id)}
// // // // //             >
// // // // //               <View style={styles.methodLeft}>
// // // // //                 <View style={[styles.methodIcon, selectedMethod === method.id && styles.selectedMethodIcon]}>
// // // // //                   <Icon name={method.icon} size={22} color={selectedMethod === method.id ? colors.white : colors.text} />
// // // // //                 </View>
// // // // //                 <View style={styles.methodInfo}>
// // // // //                   <Text style={[
// // // // //                     styles.methodName,
// // // // //                     selectedMethod === method.id && styles.selectedMethodText,
// // // // //                   ]}>
// // // // //                     {method.name}
// // // // //                   </Text>
// // // // //                   <Text style={styles.methodDesc}>{method.desc}</Text>
// // // // //                 </View>
// // // // //               </View>
// // // // //               {selectedMethod === method.id && (
// // // // //                 <Icon name="checkmark-circle" size={24} color={colors.primary} />
// // // // //               )}
// // // // //             </TouchableOpacity>
// // // // //           ))}
// // // // //         </View>

// // // // //         {/* Cash on Delivery Info */}
// // // // //         {selectedMethod === 'cash' && (
// // // // //           <View style={styles.infoContainer}>
// // // // //             <Icon name="information-circle-outline" size={20} color={colors.info || '#2196F3'} />
// // // // //             <Text style={styles.infoText}>
// // // // //               Pay with cash when your order arrives. No additional charges.
// // // // //             </Text>
// // // // //           </View>
// // // // //         )}
// // // // //       </ScrollView>

// // // // //       {/* Place Order Button - Shows for Cash on Delivery only */}
// // // // //       {selectedMethod === 'cash' && (
// // // // //         <View style={styles.footer}>
// // // // //           <TouchableOpacity 
// // // // //             style={styles.placeOrderButton} 
// // // // //             onPress={handlePlaceOrder}
// // // // //             disabled={loading}
// // // // //           >
// // // // //             {loading ? (
// // // // //               <ActivityIndicator color="#ffffff" />
// // // // //             ) : (
// // // // //               <Text style={styles.placeOrderButtonText}>Place Order • ₹{totalAmount}</Text>
// // // // //             )}
// // // // //           </TouchableOpacity>
// // // // //         </View>
// // // // //       )}

// // // // //       {/* ============ UPI MODAL ============ */}
// // // // //       <Modal
// // // // //         visible={showUPIModal}
// // // // //         transparent={true}
// // // // //         animationType="slide"
// // // // //         onRequestClose={() => setShowUPIModal(false)}
// // // // //       >
// // // // //         <View style={styles.modalOverlay}>
// // // // //           <View style={styles.modalContainer}>
// // // // //             <View style={styles.modalHeader}>
// // // // //               <Text style={styles.modalTitle}>Select UPI App</Text>
// // // // //               <TouchableOpacity onPress={() => setShowUPIModal(false)}>
// // // // //                 <Icon name="close" size={24} color={colors.text} />
// // // // //               </TouchableOpacity>
// // // // //             </View>

// // // // //             <View style={styles.upiAppsContainer}>
// // // // //               {upiApps.map((app) => (
// // // // //                 <TouchableOpacity
// // // // //                   key={app.id}
// // // // //                   style={styles.upiAppItem}
// // // // //                   onPress={() => handleUPISelection(app)}
// // // // //                 >
// // // // //                   <View style={[styles.upiAppIcon, { backgroundColor: app.color + '20' }]}>
// // // // //                     <Text style={styles.upiAppEmoji}>{app.emoji}</Text>
// // // // //                   </View>
// // // // //                   <View style={styles.upiAppInfo}>
// // // // //                     <Text style={styles.upiAppName}>{app.name}</Text>
// // // // //                     <Text style={styles.upiAppDesc}>UPI Payment</Text>
// // // // //                   </View>
// // // // //                   <Icon name="chevron-forward" size={20} color={colors.gray} />
// // // // //                 </TouchableOpacity>
// // // // //               ))}
// // // // //             </View>

// // // // //             <TouchableOpacity 
// // // // //               style={styles.enterUPIButton}
// // // // //               onPress={() => {
// // // // //                 setShowUPIModal(false);
// // // // //                 setSelectedUPIApp('Manual UPI');
// // // // //                 setTimeout(() => {
// // // // //                   setShowUPIPinModal(true);
// // // // //                 }, 300);
// // // // //               }}
// // // // //             >
// // // // //               <Text style={styles.enterUPIButtonText}>Enter UPI ID Manually</Text>
// // // // //             </TouchableOpacity>
// // // // //           </View>
// // // // //         </View>
// // // // //       </Modal>

// // // // //       {/* ============ UPI PIN MODAL ============ */}
// // // // //       <Modal
// // // // //         visible={showUPIPinModal}
// // // // //         transparent={true}
// // // // //         animationType="fade"
// // // // //         onRequestClose={() => {
// // // // //           setShowUPIPinModal(false);
// // // // //           setUpiPin('');
// // // // //         }}
// // // // //       >
// // // // //         <View style={styles.pinModalOverlay}>
// // // // //           <View style={styles.pinModalContainer}>
// // // // //             <View style={styles.pinModalHeader}>
// // // // //               <Text style={styles.pinModalTitle}>
// // // // //                 {selectedUPIApp || 'UPI'} PIN
// // // // //               </Text>
// // // // //               <Text style={styles.pinModalSubtitle}>
// // // // //                 Enter your 4-digit UPI PIN to confirm payment
// // // // //               </Text>
// // // // //             </View>

// // // // //             <View style={styles.pinDisplayContainer}>
// // // // //               <View style={styles.pinDisplay}>
// // // // //                 {[0, 1, 2, 3].map((index) => (
// // // // //                   <View key={index} style={styles.pinDotContainer}>
// // // // //                     <View style={[
// // // // //                       styles.pinDot,
// // // // //                       upiPin.length > index && styles.pinDotFilled,
// // // // //                     ]} />
// // // // //                   </View>
// // // // //                 ))}
// // // // //               </View>
// // // // //             </View>

// // // // //             <View style={styles.pinKeyboard}>
// // // // //               {[1, 2, 3, 4, 5, 6, 7, 8, 9, 'clear', 0, 'delete'].map((key) => (
// // // // //                 <TouchableOpacity
// // // // //                   key={key.toString()}
// // // // //                   style={styles.pinKey}
// // // // //                   onPress={() => {
// // // // //                     if (key === 'clear') {
// // // // //                       setUpiPin('');
// // // // //                     } else if (key === 'delete') {
// // // // //                       setUpiPin(upiPin.slice(0, -1));
// // // // //                     } else if (upiPin.length < 4) {
// // // // //                       setUpiPin(upiPin + key.toString());
// // // // //                     }
// // // // //                   }}
// // // // //                 >
// // // // //                   <Text style={styles.pinKeyText}>
// // // // //                     {key === 'clear' ? 'Clear' : key === 'delete' ? '⌫' : key}
// // // // //                   </Text>
// // // // //                 </TouchableOpacity>
// // // // //               ))}
// // // // //             </View>

// // // // //             <TouchableOpacity
// // // // //               style={[styles.pinConfirmButton, upiPin.length !== 4 && styles.pinConfirmButtonDisabled]}
// // // // //               onPress={handleUPIPinSubmit}
// // // // //               disabled={upiPin.length !== 4}
// // // // //             >
// // // // //               <Text style={styles.pinConfirmButtonText}>
// // // // //                 Pay ₹{totalAmount}
// // // // //               </Text>
// // // // //             </TouchableOpacity>

// // // // //             <TouchableOpacity
// // // // //               style={styles.pinCancelButton}
// // // // //               onPress={() => {
// // // // //                 setShowUPIPinModal(false);
// // // // //                 setUpiPin('');
// // // // //               }}
// // // // //             >
// // // // //               <Text style={styles.pinCancelButtonText}>Cancel</Text>
// // // // //             </TouchableOpacity>
// // // // //           </View>
// // // // //         </View>
// // // // //       </Modal>

// // // // //       {/* ============ CARD MODAL ============ */}
// // // // //       <Modal
// // // // //         visible={showCardModal}
// // // // //         transparent={true}
// // // // //         animationType="slide"
// // // // //         onRequestClose={() => setShowCardModal(false)}
// // // // //       >
// // // // //         <View style={styles.modalOverlay}>
// // // // //           <View style={styles.modalContainer}>
// // // // //             <View style={styles.modalHeader}>
// // // // //               <Text style={styles.modalTitle}>Card Details</Text>
// // // // //               <TouchableOpacity onPress={() => setShowCardModal(false)}>
// // // // //                 <Icon name="close" size={24} color={colors.text} />
// // // // //               </TouchableOpacity>
// // // // //             </View>

// // // // //             <View style={styles.cardModalBody}>
// // // // //               <View style={styles.cardPreview}>
// // // // //                 <Icon name="card-outline" size={40} color={colors.primary} />
// // // // //                 <Text style={styles.cardPreviewText}>Enter Card Details</Text>
// // // // //               </View>

// // // // //               <View style={styles.inputContainer}>
// // // // //                 <Text style={styles.inputLabel}>Card Number</Text>
// // // // //                 <TextInput
// // // // //                   style={styles.input}
// // // // //                   placeholder="1234 5678 9012 3456"
// // // // //                   value={cardNumber}
// // // // //                   onChangeText={(text) => setCardNumber(formatCardNumber(text))}
// // // // //                   keyboardType="numeric"
// // // // //                   maxLength={19}
// // // // //                 />
// // // // //               </View>

// // // // //               <View style={styles.inputContainer}>
// // // // //                 <Text style={styles.inputLabel}>Card Holder Name</Text>
// // // // //                 <TextInput
// // // // //                   style={styles.input}
// // // // //                   placeholder="John Doe"
// // // // //                   value={cardHolder}
// // // // //                   onChangeText={setCardHolder}
// // // // //                 />
// // // // //               </View>

// // // // //               <View style={styles.rowInputs}>
// // // // //                 <View style={[styles.inputContainer, styles.halfInput]}>
// // // // //                   <Text style={styles.inputLabel}>Expiry Date</Text>
// // // // //                   <TextInput
// // // // //                     style={styles.input}
// // // // //                     placeholder="MM/YY"
// // // // //                     value={expiryDate}
// // // // //                     onChangeText={(text) => setExpiryDate(formatExpiryDate(text))}
// // // // //                     keyboardType="numeric"
// // // // //                     maxLength={5}
// // // // //                   />
// // // // //                 </View>
// // // // //                 <View style={[styles.inputContainer, styles.halfInput]}>
// // // // //                   <Text style={styles.inputLabel}>CVV</Text>
// // // // //                   <TextInput
// // // // //                     style={styles.input}
// // // // //                     placeholder="123"
// // // // //                     value={cvv}
// // // // //                     onChangeText={setCvv}
// // // // //                     keyboardType="numeric"
// // // // //                     maxLength={4}
// // // // //                     secureTextEntry
// // // // //                   />
// // // // //                 </View>
// // // // //               </View>

// // // // //               <TouchableOpacity 
// // // // //                 style={styles.payNowButton} 
// // // // //                 onPress={handleCardPayment}
// // // // //                 disabled={loading}
// // // // //               >
// // // // //                 {loading ? (
// // // // //                   <ActivityIndicator color="#ffffff" />
// // // // //                 ) : (
// // // // //                   <Text style={styles.payNowButtonText}>Pay ₹{totalAmount}</Text>
// // // // //                 )}
// // // // //               </TouchableOpacity>
// // // // //             </View>
// // // // //           </View>
// // // // //         </View>
// // // // //       </Modal>

// // // // //       {/* ============ NET BANKING MODAL ============ */}
// // // // //       <Modal
// // // // //         visible={showNetBankingModal}
// // // // //         transparent={true}
// // // // //         animationType="slide"
// // // // //         onRequestClose={() => setShowNetBankingModal(false)}
// // // // //       >
// // // // //         <View style={styles.modalOverlay}>
// // // // //           <View style={styles.modalContainer}>
// // // // //             <View style={styles.modalHeader}>
// // // // //               <Text style={styles.modalTitle}>Select Bank</Text>
// // // // //               <TouchableOpacity onPress={() => setShowNetBankingModal(false)}>
// // // // //                 <Icon name="close" size={24} color={colors.text} />
// // // // //               </TouchableOpacity>
// // // // //             </View>

// // // // //             <View style={styles.banksContainer}>
// // // // //               {banks.map((bank) => (
// // // // //                 <TouchableOpacity
// // // // //                   key={bank.id}
// // // // //                   style={styles.bankItem}
// // // // //                   onPress={() => handleNetBankingSelect(bank)}
// // // // //                 >
// // // // //                   <View style={[styles.bankIcon, { backgroundColor: bank.color + '20' }]}>
// // // // //                     <Text style={styles.bankEmoji}>{bank.icon}</Text>
// // // // //                   </View>
// // // // //                   <View style={styles.bankInfo}>
// // // // //                     <Text style={styles.bankName}>{bank.name}</Text>
// // // // //                     <Text style={styles.bankDesc}>Net Banking</Text>
// // // // //                   </View>
// // // // //                   <Icon name="chevron-forward" size={20} color={colors.gray} />
// // // // //                 </TouchableOpacity>
// // // // //               ))}
// // // // //             </View>
// // // // //           </View>
// // // // //         </View>
// // // // //       </Modal>

// // // // //       {/* ============ WALLET MODAL ============ */}
// // // // //       <Modal
// // // // //         visible={showWalletModal}
// // // // //         transparent={true}
// // // // //         animationType="slide"
// // // // //         onRequestClose={() => setShowWalletModal(false)}
// // // // //       >
// // // // //         <View style={styles.modalOverlay}>
// // // // //           <View style={styles.modalContainer}>
// // // // //             <View style={styles.modalHeader}>
// // // // //               <Text style={styles.modalTitle}>Pay with Wallet</Text>
// // // // //               <TouchableOpacity onPress={() => setShowWalletModal(false)}>
// // // // //                 <Icon name="close" size={24} color={colors.text} />
// // // // //               </TouchableOpacity>
// // // // //             </View>

// // // // //             <View style={styles.walletModalBody}>
// // // // //               <View style={styles.walletBalanceContainer}>
// // // // //                 <Icon name="wallet-outline" size={40} color={colors.primary} />
// // // // //                 <Text style={styles.walletBalanceTitle}>Wallet Balance</Text>
// // // // //                 <Text style={styles.walletBalanceAmount}>₹{walletBalance}</Text>
// // // // //               </View>

// // // // //               <View style={styles.walletInfoContainer}>
// // // // //                 <View style={styles.walletInfoRow}>
// // // // //                   <Text style={styles.walletInfoLabel}>Order Total</Text>
// // // // //                   <Text style={styles.walletInfoValue}>₹{totalAmount}</Text>
// // // // //                 </View>
// // // // //                 <View style={styles.walletInfoRow}>
// // // // //                   <Text style={styles.walletInfoLabel}>Balance After Payment</Text>
// // // // //                   <Text style={[styles.walletInfoValue, { color: totalAmount <= walletBalance ? colors.success : colors.danger }]}>
// // // // //                     ₹{walletBalance - totalAmount}
// // // // //                   </Text>
// // // // //                 </View>
// // // // //               </View>

// // // // //               <TouchableOpacity 
// // // // //                 style={[styles.walletPayButton, totalAmount > walletBalance && styles.walletPayButtonDisabled]}
// // // // //                 onPress={handleWalletPayment}
// // // // //                 disabled={loading || totalAmount > walletBalance}
// // // // //               >
// // // // //                 {loading ? (
// // // // //                   <ActivityIndicator color="#ffffff" />
// // // // //                 ) : (
// // // // //                   <Text style={styles.walletPayButtonText}>
// // // // //                     {totalAmount > walletBalance ? 'Insufficient Balance' : `Pay ₹${totalAmount}`}
// // // // //                   </Text>
// // // // //                 )}
// // // // //               </TouchableOpacity>
// // // // //             </View>
// // // // //           </View>
// // // // //         </View>
// // // // //       </Modal>

// // // // //       {/* Loading Overlay */}
// // // // //       {loading && (
// // // // //         <View style={styles.loadingOverlay}>
// // // // //           <View style={styles.loadingContainer}>
// // // // //             <ActivityIndicator size="large" color={colors.primary} />
// // // // //             <Text style={styles.loadingText}>Processing Payment...</Text>
// // // // //             <Text style={styles.loadingSubText}>Please do not close the app</Text>
// // // // //           </View>
// // // // //         </View>
// // // // //       )}
// // // // //     </View>
// // // // //   );
// // // // // }

// // // // // const styles = StyleSheet.create({
// // // // //   container: {
// // // // //     flex: 1,
// // // // //     backgroundColor: colors.white,
// // // // //   },
// // // // //   centerContent: {
// // // // //     flex: 1,
// // // // //     justifyContent: 'center',
// // // // //     alignItems: 'center',
// // // // //     padding: 20,
// // // // //   },
// // // // //   errorText: {
// // // // //     fontSize: 20,
// // // // //     fontWeight: '600',
// // // // //     color: colors.text,
// // // // //     marginTop: 16,
// // // // //   },
// // // // //   errorSubText: {
// // // // //     fontSize: 14,
// // // // //     color: colors.textLight,
// // // // //     marginTop: 8,
// // // // //     marginBottom: 24,
// // // // //   },
// // // // //   goBackButton: {
// // // // //     backgroundColor: colors.primary,
// // // // //     paddingHorizontal: 32,
// // // // //     paddingVertical: 12,
// // // // //     borderRadius: 8,
// // // // //   },
// // // // //   goBackButtonText: {
// // // // //     color: colors.white,
// // // // //     fontSize: 16,
// // // // //     fontWeight: '600',
// // // // //   },
// // // // //   header: {
// // // // //     flexDirection: 'row',
// // // // //     alignItems: 'center',
// // // // //     justifyContent: 'space-between',
// // // // //     padding: 16,
// // // // //     paddingTop: 40,
// // // // //     borderBottomWidth: 1,
// // // // //     borderBottomColor: colors.border,
// // // // //   },
// // // // //   headerTitle: {
// // // // //     fontSize: 18,
// // // // //     fontWeight: '600',
// // // // //     color: colors.text,
// // // // //   },
// // // // //   amountContainer: {
// // // // //     backgroundColor: colors.primary,
// // // // //     padding: 20,
// // // // //     margin: 16,
// // // // //     borderRadius: 12,
// // // // //     alignItems: 'center',
// // // // //   },
// // // // //   amountLabel: {
// // // // //     fontSize: 14,
// // // // //     color: colors.white,
// // // // //     opacity: 0.8,
// // // // //   },
// // // // //   amountValue: {
// // // // //     fontSize: 28,
// // // // //     fontWeight: '700',
// // // // //     color: colors.white,
// // // // //     marginTop: 4,
// // // // //   },
// // // // //   methodsContainer: {
// // // // //     paddingHorizontal: 16,
// // // // //     paddingBottom: 20,
// // // // //   },
// // // // //   sectionTitle: {
// // // // //     fontSize: 16,
// // // // //     fontWeight: '600',
// // // // //     color: colors.text,
// // // // //     marginBottom: 12,
// // // // //   },
// // // // //   methodItem: {
// // // // //     flexDirection: 'row',
// // // // //     justifyContent: 'space-between',
// // // // //     alignItems: 'center',
// // // // //     padding: 14,
// // // // //     borderWidth: 1,
// // // // //     borderColor: colors.border,
// // // // //     borderRadius: 10,
// // // // //     marginBottom: 8,
// // // // //   },
// // // // //   selectedMethod: {
// // // // //     borderColor: colors.primary,
// // // // //     backgroundColor: '#fff5ec',
// // // // //   },
// // // // //   methodLeft: {
// // // // //     flexDirection: 'row',
// // // // //     alignItems: 'center',
// // // // //     flex: 1,
// // // // //   },
// // // // //   methodIcon: {
// // // // //     width: 36,
// // // // //     height: 36,
// // // // //     borderRadius: 18,
// // // // //     backgroundColor: colors.lightGray,
// // // // //     justifyContent: 'center',
// // // // //     alignItems: 'center',
// // // // //     marginRight: 12,
// // // // //   },
// // // // //   selectedMethodIcon: {
// // // // //     backgroundColor: colors.primary,
// // // // //   },
// // // // //   methodInfo: {
// // // // //     flex: 1,
// // // // //   },
// // // // //   methodName: {
// // // // //     fontSize: 14,
// // // // //     color: colors.text,
// // // // //   },
// // // // //   selectedMethodText: {
// // // // //     color: colors.primary,
// // // // //     fontWeight: '500',
// // // // //   },
// // // // //   methodDesc: {
// // // // //     fontSize: 11,
// // // // //     color: colors.textLight,
// // // // //     marginTop: 1,
// // // // //   },
// // // // //   infoContainer: {
// // // // //     flexDirection: 'row',
// // // // //     alignItems: 'center',
// // // // //     backgroundColor: '#f8f9fa',
// // // // //     marginHorizontal: 16,
// // // // //     marginBottom: 16,
// // // // //     padding: 12,
// // // // //     borderRadius: 8,
// // // // //     borderWidth: 1,
// // // // //     borderColor: colors.border,
// // // // //   },
// // // // //   infoText: {
// // // // //     fontSize: 13,
// // // // //     color: colors.textLight,
// // // // //     marginLeft: 10,
// // // // //     flex: 1,
// // // // //   },
// // // // //   footer: {
// // // // //     padding: 16,
// // // // //     backgroundColor: colors.white,
// // // // //     borderTopWidth: 1,
// // // // //     borderTopColor: colors.border,
// // // // //   },
// // // // //   placeOrderButton: {
// // // // //     backgroundColor: colors.primary,
// // // // //     borderRadius: 12,
// // // // //     height: 50,
// // // // //     justifyContent: 'center',
// // // // //     alignItems: 'center',
// // // // //   },
// // // // //   placeOrderButtonText: {
// // // // //     color: colors.white,
// // // // //     fontSize: 16,
// // // // //     fontWeight: '600',
// // // // //   },
// // // // //   modalOverlay: {
// // // // //     flex: 1,
// // // // //     backgroundColor: 'rgba(0,0,0,0.5)',
// // // // //     justifyContent: 'flex-end',
// // // // //   },
// // // // //   modalContainer: {
// // // // //     backgroundColor: colors.white,
// // // // //     borderTopLeftRadius: 24,
// // // // //     borderTopRightRadius: 24,
// // // // //     paddingHorizontal: 20,
// // // // //     paddingBottom: 30,
// // // // //     maxHeight: '80%',
// // // // //   },
// // // // //   modalHeader: {
// // // // //     flexDirection: 'row',
// // // // //     justifyContent: 'space-between',
// // // // //     alignItems: 'center',
// // // // //     paddingVertical: 16,
// // // // //     borderBottomWidth: 1,
// // // // //     borderBottomColor: colors.border,
// // // // //   },
// // // // //   modalTitle: {
// // // // //     fontSize: 18,
// // // // //     fontWeight: '600',
// // // // //     color: colors.text,
// // // // //   },
// // // // //   upiAppsContainer: {
// // // // //     marginTop: 12,
// // // // //   },
// // // // //   upiAppItem: {
// // // // //     flexDirection: 'row',
// // // // //     alignItems: 'center',
// // // // //     paddingVertical: 14,
// // // // //     borderBottomWidth: 1,
// // // // //     borderBottomColor: colors.border,
// // // // //   },
// // // // //   upiAppIcon: {
// // // // //     width: 48,
// // // // //     height: 48,
// // // // //     borderRadius: 24,
// // // // //     justifyContent: 'center',
// // // // //     alignItems: 'center',
// // // // //     marginRight: 12,
// // // // //   },
// // // // //   upiAppEmoji: {
// // // // //     fontSize: 24,
// // // // //   },
// // // // //   upiAppInfo: {
// // // // //     flex: 1,
// // // // //   },
// // // // //   upiAppName: {
// // // // //     fontSize: 15,
// // // // //     fontWeight: '500',
// // // // //     color: colors.text,
// // // // //   },
// // // // //   upiAppDesc: {
// // // // //     fontSize: 12,
// // // // //     color: colors.textLight,
// // // // //     marginTop: 2,
// // // // //   },
// // // // //   enterUPIButton: {
// // // // //     marginTop: 16,
// // // // //     paddingVertical: 12,
// // // // //     borderWidth: 1,
// // // // //     borderColor: colors.primary,
// // // // //     borderRadius: 8,
// // // // //     alignItems: 'center',
// // // // //   },
// // // // //   enterUPIButtonText: {
// // // // //     color: colors.primary,
// // // // //     fontSize: 14,
// // // // //     fontWeight: '500',
// // // // //   },
// // // // //   pinModalOverlay: {
// // // // //     flex: 1,
// // // // //     backgroundColor: 'rgba(0,0,0,0.7)',
// // // // //     justifyContent: 'center',
// // // // //     alignItems: 'center',
// // // // //   },
// // // // //   pinModalContainer: {
// // // // //     backgroundColor: colors.white,
// // // // //     borderRadius: 24,
// // // // //     padding: 24,
// // // // //     width: '85%',
// // // // //     maxWidth: 400,
// // // // //   },
// // // // //   pinModalHeader: {
// // // // //     alignItems: 'center',
// // // // //     marginBottom: 20,
// // // // //   },
// // // // //   pinModalTitle: {
// // // // //     fontSize: 20,
// // // // //     fontWeight: '700',
// // // // //     color: colors.text,
// // // // //   },
// // // // //   pinModalSubtitle: {
// // // // //     fontSize: 14,
// // // // //     color: colors.textLight,
// // // // //     marginTop: 4,
// // // // //   },
// // // // //   pinDisplayContainer: {
// // // // //     alignItems: 'center',
// // // // //     marginBottom: 24,
// // // // //   },
// // // // //   pinDisplay: {
// // // // //     flexDirection: 'row',
// // // // //     justifyContent: 'center',
// // // // //   },
// // // // //   pinDotContainer: {
// // // // //     marginHorizontal: 8,
// // // // //   },
// // // // //   pinDot: {
// // // // //     width: 16,
// // // // //     height: 16,
// // // // //     borderRadius: 8,
// // // // //     borderWidth: 2,
// // // // //     borderColor: colors.border,
// // // // //     backgroundColor: colors.white,
// // // // //   },
// // // // //   pinDotFilled: {
// // // // //     backgroundColor: colors.primary,
// // // // //     borderColor: colors.primary,
// // // // //   },
// // // // //   pinKeyboard: {
// // // // //     flexDirection: 'row',
// // // // //     flexWrap: 'wrap',
// // // // //     justifyContent: 'center',
// // // // //     marginBottom: 16,
// // // // //   },
// // // // //   pinKey: {
// // // // //     width: '30%',
// // // // //     aspectRatio: 1.2,
// // // // //     justifyContent: 'center',
// // // // //     alignItems: 'center',
// // // // //     margin: '1.5%',
// // // // //     borderRadius: 12,
// // // // //     backgroundColor: colors.lightGray,
// // // // //   },
// // // // //   pinKeyText: {
// // // // //     fontSize: 22,
// // // // //     fontWeight: '500',
// // // // //     color: colors.text,
// // // // //   },
// // // // //   pinConfirmButton: {
// // // // //     backgroundColor: colors.primary,
// // // // //     paddingVertical: 14,
// // // // //     borderRadius: 12,
// // // // //     alignItems: 'center',
// // // // //     marginBottom: 8,
// // // // //   },
// // // // //   pinConfirmButtonDisabled: {
// // // // //     backgroundColor: colors.gray,
// // // // //   },
// // // // //   pinConfirmButtonText: {
// // // // //     color: colors.white,
// // // // //     fontSize: 16,
// // // // //     fontWeight: '600',
// // // // //   },
// // // // //   pinCancelButton: {
// // // // //     paddingVertical: 10,
// // // // //     alignItems: 'center',
// // // // //   },
// // // // //   pinCancelButtonText: {
// // // // //     color: colors.textLight,
// // // // //     fontSize: 14,
// // // // //   },
// // // // //   cardModalBody: {
// // // // //     marginTop: 8,
// // // // //   },
// // // // //   cardPreview: {
// // // // //     alignItems: 'center',
// // // // //     paddingVertical: 20,
// // // // //     backgroundColor: '#f8f9fa',
// // // // //     borderRadius: 12,
// // // // //     marginBottom: 16,
// // // // //   },
// // // // //   cardPreviewText: {
// // // // //     fontSize: 14,
// // // // //     color: colors.textLight,
// // // // //     marginTop: 8,
// // // // //   },
// // // // //   inputContainer: {
// // // // //     marginBottom: 12,
// // // // //   },
// // // // //   inputLabel: {
// // // // //     fontSize: 14,
// // // // //     fontWeight: '500',
// // // // //     color: colors.text,
// // // // //     marginBottom: 4,
// // // // //   },
// // // // //   input: {
// // // // //     borderWidth: 1,
// // // // //     borderColor: colors.border,
// // // // //     borderRadius: 8,
// // // // //     paddingHorizontal: 12,
// // // // //     paddingVertical: 10,
// // // // //     fontSize: 14,
// // // // //     color: colors.text,
// // // // //     backgroundColor: colors.white,
// // // // //   },
// // // // //   rowInputs: {
// // // // //     flexDirection: 'row',
// // // // //     justifyContent: 'space-between',
// // // // //   },
// // // // //   halfInput: {
// // // // //     flex: 1,
// // // // //     marginRight: 8,
// // // // //   },
// // // // //   payNowButton: {
// // // // //     backgroundColor: colors.primary,
// // // // //     borderRadius: 12,
// // // // //     height: 50,
// // // // //     justifyContent: 'center',
// // // // //     alignItems: 'center',
// // // // //     marginTop: 8,
// // // // //   },
// // // // //   payNowButtonText: {
// // // // //     color: colors.white,
// // // // //     fontSize: 16,
// // // // //     fontWeight: '600',
// // // // //   },
// // // // //   banksContainer: {
// // // // //     marginTop: 12,
// // // // //   },
// // // // //   bankItem: {
// // // // //     flexDirection: 'row',
// // // // //     alignItems: 'center',
// // // // //     paddingVertical: 14,
// // // // //     borderBottomWidth: 1,
// // // // //     borderBottomColor: colors.border,
// // // // //   },
// // // // //   bankIcon: {
// // // // //     width: 44,
// // // // //     height: 44,
// // // // //     borderRadius: 22,
// // // // //     justifyContent: 'center',
// // // // //     alignItems: 'center',
// // // // //     marginRight: 12,
// // // // //   },
// // // // //   bankEmoji: {
// // // // //     fontSize: 20,
// // // // //   },
// // // // //   bankInfo: {
// // // // //     flex: 1,
// // // // //   },
// // // // //   bankName: {
// // // // //     fontSize: 14,
// // // // //     fontWeight: '500',
// // // // //     color: colors.text,
// // // // //   },
// // // // //   bankDesc: {
// // // // //     fontSize: 12,
// // // // //     color: colors.textLight,
// // // // //     marginTop: 1,
// // // // //   },
// // // // //   walletModalBody: {
// // // // //     marginTop: 8,
// // // // //   },
// // // // //   walletBalanceContainer: {
// // // // //     alignItems: 'center',
// // // // //     paddingVertical: 20,
// // // // //     backgroundColor: '#f8f9fa',
// // // // //     borderRadius: 12,
// // // // //     marginBottom: 16,
// // // // //   },
// // // // //   walletBalanceTitle: {
// // // // //     fontSize: 14,
// // // // //     color: colors.textLight,
// // // // //     marginTop: 8,
// // // // //   },
// // // // //   walletBalanceAmount: {
// // // // //     fontSize: 28,
// // // // //     fontWeight: '700',
// // // // //     color: colors.primary,
// // // // //     marginTop: 4,
// // // // //   },
// // // // //   walletInfoContainer: {
// // // // //     backgroundColor: '#f8f9fa',
// // // // //     borderRadius: 12,
// // // // //     padding: 16,
// // // // //     marginBottom: 16,
// // // // //   },
// // // // //   walletInfoRow: {
// // // // //     flexDirection: 'row',
// // // // //     justifyContent: 'space-between',
// // // // //     paddingVertical: 4,
// // // // //   },
// // // // //   walletInfoLabel: {
// // // // //     fontSize: 14,
// // // // //     color: colors.textLight,
// // // // //   },
// // // // //   walletInfoValue: {
// // // // //     fontSize: 14,
// // // // //     fontWeight: '500',
// // // // //     color: colors.text,
// // // // //   },
// // // // //   walletPayButton: {
// // // // //     backgroundColor: colors.primary,
// // // // //     borderRadius: 12,
// // // // //     height: 50,
// // // // //     justifyContent: 'center',
// // // // //     alignItems: 'center',
// // // // //   },
// // // // //   walletPayButtonDisabled: {
// // // // //     backgroundColor: colors.gray,
// // // // //   },
// // // // //   walletPayButtonText: {
// // // // //     color: colors.white,
// // // // //     fontSize: 16,
// // // // //     fontWeight: '600',
// // // // //   },
// // // // //   loadingOverlay: {
// // // // //     position: 'absolute',
// // // // //     top: 0,
// // // // //     left: 0,
// // // // //     right: 0,
// // // // //     bottom: 0,
// // // // //     backgroundColor: 'rgba(0,0,0,0.7)',
// // // // //     justifyContent: 'center',
// // // // //     alignItems: 'center',
// // // // //   },
// // // // //   loadingContainer: {
// // // // //     backgroundColor: colors.white,
// // // // //     padding: 30,
// // // // //     borderRadius: 16,
// // // // //     alignItems: 'center',
// // // // //     minWidth: 200,
// // // // //   },
// // // // //   loadingText: {
// // // // //     fontSize: 16,
// // // // //     fontWeight: '600',
// // // // //     color: colors.text,
// // // // //     marginTop: 12,
// // // // //   },
// // // // //   loadingSubText: {
// // // // //     fontSize: 12,
// // // // //     color: colors.textLight,
// // // // //     marginTop: 4,
// // // // //   },
// // // // // });
// // // // // delivery-app/src/screens/PaymentScreen.tsx
// // // // // import React, { useState, useContext } from 'react';
// // // // // import {
// // // // //   View,
// // // // //   Text,
// // // // //   ScrollView,
// // // // //   TouchableOpacity,
// // // // //   StyleSheet,
// // // // //   TextInput,
// // // // //   Alert,
// // // // //   Modal,
// // // // //   ActivityIndicator,
// // // // //   Linking,
// // // // //   Platform,
// // // // // } from 'react-native';
// // // // // import * as Haptics from 'expo-haptics';
// // // // // import Icon from 'react-native-vector-icons/Ionicons';
// // // // // import { WebView } from 'react-native-webview';
// // // // // import { colors } from '../../constants/colors';
// // // // // import { AuthContext } from '../../context/AuthContext';
// // // // // import { CartContext } from '../../context/CartContext';
// // // // // import { OrderContext } from '../../context/OrderContext';
// // // // // import { paymentService } from '../../services/paymentService';

// // // // // interface PaymentScreenProps {
// // // // //   navigation: any;
// // // // //   route: any;
// // // // // }

// // // // // export default function PaymentScreen({ route, navigation }: PaymentScreenProps) {
// // // // //   const { totalAmount, orderId } = route.params || {};
  
// // // // //   const { user } = useContext(AuthContext);
// // // // //   const { clearCart } = useContext(CartContext);
// // // // //   const { addOrder } = useContext(OrderContext);
  
// // // // //   const [selectedMethod, setSelectedMethod] = useState<string>('razorpay');
// // // // //   const [showUPIModal, setShowUPIModal] = useState<boolean>(false);
// // // // //   const [selectedUPIApp, setSelectedUPIApp] = useState<string>('');
// // // // //   const [showUPIPinModal, setShowUPIPinModal] = useState<boolean>(false);
// // // // //   const [upiPin, setUpiPin] = useState<string>('');
// // // // //   const [showCardModal, setShowCardModal] = useState<boolean>(false);
// // // // //   const [showNetBankingModal, setShowNetBankingModal] = useState<boolean>(false);
// // // // //   const [showWalletModal, setShowWalletModal] = useState<boolean>(false);
// // // // //   const [showWebView, setShowWebView] = useState<boolean>(false);
// // // // //   const [webViewUrl, setWebViewUrl] = useState<string>('');
// // // // //   const [loading, setLoading] = useState<boolean>(false);
// // // // //   const [paymentSuccess, setPaymentSuccess] = useState<boolean>(false);
  
// // // // //   // Card Details
// // // // //   const [cardNumber, setCardNumber] = useState<string>('');
// // // // //   const [expiryDate, setExpiryDate] = useState<string>('');
// // // // //   const [cvv, setCvv] = useState<string>('');
// // // // //   const [cardHolder, setCardHolder] = useState<string>('');

// // // // //   // Wallet
// // // // //   const walletBalance = 2500;

// // // // //   // Net Banking Banks
// // // // //   const banks = [
// // // // //     { id: 'sbi', name: 'State Bank of India', icon: '🏦', color: '#2E6B98' },
// // // // //     { id: 'hdfc', name: 'HDFC Bank', icon: '🏛️', color: '#004F8C' },
// // // // //     { id: 'icici', name: 'ICICI Bank', icon: '🏛️', color: '#F58A1E' },
// // // // //     { id: 'axis', name: 'Axis Bank', icon: '🏦', color: '#8B1A2B' },
// // // // //     { id: 'kotak', name: 'Kotak Mahindra Bank', icon: '🏦', color: '#003F6C' },
// // // // //     { id: 'yes', name: 'Yes Bank', icon: '🏛️', color: '#1B4F7A' },
// // // // //     { id: 'pnb', name: 'Punjab National Bank', icon: '🏦', color: '#008C45' },
// // // // //     { id: 'bob', name: 'Bank of Baroda', icon: '🏛️', color: '#0F4C81' },
// // // // //   ];

// // // // //   // UPI Apps
// // // // //   const upiApps = [
// // // // //     { id: 'gpay', name: 'Google Pay', emoji: '🟢', color: '#4285F4' },
// // // // //     { id: 'phonepe', name: 'PhonePe', emoji: '🟣', color: '#5F259F' },
// // // // //     { id: 'paytm', name: 'Paytm', emoji: '🔵', color: '#00BAF2' },
// // // // //     { id: 'amazonpay', name: 'Amazon Pay', emoji: '🟠', color: '#FF9900' },
// // // // //     { id: 'bhim', name: 'BHIM UPI', emoji: '🔷', color: '#0084B4' },
// // // // //   ];

// // // // //   const paymentMethods: { id: string; name: string; icon: string; desc: string }[] = [
// // // // //     { id: 'razorpay', name: 'Razorpay (UPI/Card)', icon: 'phone-portrait-outline', desc: 'UPI, Cards, Net Banking' },
// // // // //     { id: 'card', name: 'Credit/Debit Card', icon: 'card-outline', desc: 'Pay with card' },
// // // // //     { id: 'upi', name: 'UPI', icon: 'phone-portrait-outline', desc: 'Google Pay, PhonePe, Paytm' },
// // // // //     { id: 'netbanking', name: 'Net Banking', icon: 'business-outline', desc: 'All major banks' },
// // // // //     { id: 'wallet', name: 'Wallet', icon: 'wallet-outline', desc: `Balance: ₹${walletBalance}` },
// // // // //     { id: 'cash', name: 'Cash on Delivery', icon: 'cash-outline', desc: 'Pay when you receive' },
// // // // //   ];

// // // // //   // ============ 🔥 RAZORPAY PAYMENT USING WebView (Expo Compatible) ============
// // // // //   const handleRazorpayPayment = async () => {
// // // // //     try {
// // // // //       setLoading(true);
// // // // //       Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

// // // // //       // 1. Create Razorpay Order
// // // // //       const orderData = await paymentService.createRazorpayOrder(totalAmount, orderId);
      
// // // // //       if (!orderData.success) {
// // // // //         Alert.alert('Error', orderData.message || 'Failed to create order');
// // // // //         setLoading(false);
// // // // //         return;
// // // // //       }

// // // // //       const { order, key } = orderData;

// // // // //       // 2. Generate payment page URL
// // // // //       // You need to create a HTML page or use Razorpay's checkout URL
// // // // //       const paymentUrl = `https://your-backend-url.com/payment/checkout?order_id=${order.id}&amount=${order.amount}&key=${key}`;
      
// // // // //       setWebViewUrl(paymentUrl);
// // // // //       setShowWebView(true);
// // // // //       setLoading(false);

// // // // //     } catch (error: any) {
// // // // //       console.error('Payment error:', error);
// // // // //       Alert.alert('Payment Error', error.message || 'Something went wrong');
// // // // //       setLoading(false);
// // // // //     }
// // // // //   };

// // // // //   // ============ WebView Navigation Handler ============
// // // // //   const handleWebViewNavigation = (navState: any) => {
// // // // //     const { url } = navState;
    
// // // // //     // Check if payment is successful
// // // // //     if (url.includes('payment-success')) {
// // // // //       setShowWebView(false);
// // // // //       clearCart();
// // // // //       Alert.alert(
// // // // //         '✅ Payment Successful!',
// // // // //         'Your order has been placed successfully.',
// // // // //         [
// // // // //           {
// // // // //             text: 'View Order',
// // // // //             onPress: () => navigation.replace('Orders'),
// // // // //           },
// // // // //           {
// // // // //             text: 'Track Order',
// // // // //             onPress: () => navigation.replace('OrderTracking', { orderId }),
// // // // //           },
// // // // //         ]
// // // // //       );
// // // // //     }
    
// // // // //     // Check if payment failed
// // // // //     if (url.includes('payment-failed')) {
// // // // //       setShowWebView(false);
// // // // //       Alert.alert(
// // // // //         'Payment Failed',
// // // // //         'Your payment was not successful. Please try again.'
// // // // //       );
// // // // //     }
// // // // //   };

// // // // //   // ============ UPI APP DEEP LINKING ============
// // // // //   const handleUPIDeepLink = (app: any) => {
// // // // //     setSelectedUPIApp(app.name);
// // // // //     setShowUPIModal(false);
    
// // // // //     // Different UPI apps have different URL schemes
// // // // //     const upiLinks: { [key: string]: string } = {
// // // // //       gpay: 'gpay://upi/pay?pa=',
// // // // //       phonepe: 'phonepe://upi/pay?pa=',
// // // // //       paytm: 'paytmmp://upi/pay?pa=',
// // // // //       amazonpay: 'amazonpay://upi/pay?pa=',
// // // // //       bhim: 'bhim://upi/pay?pa=',
// // // // //     };

// // // // //     const upiLink = upiLinks[app.id] || 'upi://pay?pa=';
// // // // //     const upiId = 'quickbite@razorpay'; // Your UPI ID
    
// // // // //     const paymentUrl = `${upiLink}${upiId}&pn=QuickBite&am=${totalAmount}&cu=INR`;
    
// // // // //     Linking.openURL(paymentUrl).catch(() => {
// // // // //       Alert.alert(
// // // // //         'App Not Installed',
// // // // //         `Please install ${app.name} to continue with UPI payment.`
// // // // //       );
// // // // //     });
// // // // //   };

// // // // //   const handleSelectMethod = (methodId: string) => {
// // // // //     Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
// // // // //     setSelectedMethod(methodId);
    
// // // // //     // If Razorpay is selected, handle it directly
// // // // //     if (methodId === 'razorpay') {
// // // // //       handleRazorpayPayment();
// // // // //       return;
// // // // //     }
    
// // // // //     switch (methodId) {
// // // // //       case 'upi':
// // // // //         setShowUPIModal(true);
// // // // //         break;
// // // // //       case 'card':
// // // // //         setShowCardModal(true);
// // // // //         break;
// // // // //       case 'netbanking':
// // // // //         setShowNetBankingModal(true);
// // // // //         break;
// // // // //       case 'wallet':
// // // // //         setShowWalletModal(true);
// // // // //         break;
// // // // //       case 'cash':
// // // // //         // Just select the method
// // // // //         break;
// // // // //       default:
// // // // //         break;
// // // // //     }
// // // // //   };

// // // // //   // ============ CARD FLOW ============
// // // // //   const handleCardPayment = () => {
// // // // //     if (!cardNumber || !expiryDate || !cvv || !cardHolder) {
// // // // //       Alert.alert('Error', 'Please fill all card details');
// // // // //       return;
// // // // //     }
// // // // //     if (cardNumber.replace(/\s/g, '').length !== 16) {
// // // // //       Alert.alert('Error', 'Please enter a valid 16-digit card number');
// // // // //       return;
// // // // //     }
// // // // //     if (cvv.length < 3) {
// // // // //       Alert.alert('Error', 'Please enter a valid CVV');
// // // // //       return;
// // // // //     }

// // // // //     Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
// // // // //     setShowCardModal(false);
// // // // //     setLoading(true);
    
// // // // //     setTimeout(() => {
// // // // //       setLoading(false);
// // // // //       setPaymentSuccess(true);
// // // // //       const transactionId = 'CARD' + Date.now().toString().slice(-10);
      
// // // // //       navigation.replace('OrderSuccess', {
// // // // //         orderId: transactionId,
// // // // //         totalAmount: totalAmount,
// // // // //         paymentMethod: 'Credit/Debit Card',
// // // // //       });
// // // // //     }, 2500);
// // // // //   };

// // // // //   // ============ NET BANKING FLOW ============
// // // // //   const handleNetBankingSelect = (bank: any) => {
// // // // //     setShowNetBankingModal(false);
// // // // //     setLoading(true);
// // // // //     setTimeout(() => {
// // // // //       setLoading(false);
// // // // //       setPaymentSuccess(true);
// // // // //       const transactionId = 'NB' + Date.now().toString().slice(-10);
      
// // // // //       navigation.replace('OrderSuccess', {
// // // // //         orderId: transactionId,
// // // // //         totalAmount: totalAmount,
// // // // //         paymentMethod: `${bank.name} (Net Banking)`,
// // // // //       });
// // // // //     }, 2000);
// // // // //   };

// // // // //   // ============ WALLET FLOW ============
// // // // //   const handleWalletPayment = () => {
// // // // //     if (totalAmount > walletBalance) {
// // // // //       Alert.alert(
// // // // //         'Insufficient Balance',
// // // // //         `Wallet balance: ₹${walletBalance}\nAmount needed: ₹${totalAmount}\n\nPlease add money to your wallet or use another payment method.`,
// // // // //         [
// // // // //           { text: 'OK', onPress: () => setShowWalletModal(false) }
// // // // //         ]
// // // // //       );
// // // // //       return;
// // // // //     }

// // // // //     setShowWalletModal(false);
// // // // //     setLoading(true);
// // // // //     setTimeout(() => {
// // // // //       setLoading(false);
// // // // //       setPaymentSuccess(true);
// // // // //       const transactionId = 'WLT' + Date.now().toString().slice(-10);
      
// // // // //       navigation.replace('OrderSuccess', {
// // // // //         orderId: transactionId,
// // // // //         totalAmount: totalAmount,
// // // // //         paymentMethod: 'Wallet',
// // // // //       });
// // // // //     }, 1500);
// // // // //   };

// // // // //   // ============ CASH ON DELIVERY ============
// // // // //   const handlePlaceOrder = () => {
// // // // //     Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    
// // // // //     setLoading(true);
// // // // //     setTimeout(() => {
// // // // //       setLoading(false);
// // // // //       setPaymentSuccess(true);
// // // // //       const transactionId = 'COD' + Date.now().toString().slice(-10);
      
// // // // //       navigation.replace('OrderSuccess', {
// // // // //         orderId: transactionId,
// // // // //         totalAmount: totalAmount,
// // // // //         paymentMethod: 'Cash on Delivery',
// // // // //       });
// // // // //     }, 1500);
// // // // //   };

// // // // //   const formatCardNumber = (text: string): string => {
// // // // //     const cleaned = text.replace(/\s/g, '');
// // // // //     const matches = cleaned.match(/.{1,4}/g);
// // // // //     if (matches) {
// // // // //       return matches.join(' ');
// // // // //     }
// // // // //     return text;
// // // // //   };

// // // // //   const formatExpiryDate = (text: string): string => {
// // // // //     const cleaned = text.replace(/\D/g, '');
// // // // //     if (cleaned.length >= 2) {
// // // // //       return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
// // // // //     }
// // // // //     return text;
// // // // //   };

// // // // //   // 🔥 If no amount is passed, show error
// // // // //   if (!totalAmount || totalAmount === 0) {
// // // // //     return (
// // // // //       <View style={[styles.container, styles.centerContent]}>
// // // // //         <Icon name="alert-circle-outline" size={60} color={colors.danger || '#ff4444'} />
// // // // //         <Text style={styles.errorText}>No amount specified</Text>
// // // // //         <Text style={styles.errorSubText}>Please go back and try again</Text>
// // // // //         <TouchableOpacity 
// // // // //           style={styles.goBackButton}
// // // // //           onPress={() => navigation.goBack()}
// // // // //         >
// // // // //           <Text style={styles.goBackButtonText}>Go Back</Text>
// // // // //         </TouchableOpacity>
// // // // //       </View>
// // // // //     );
// // // // //   }

// // // // //   // 🔥 WebView Modal for Razorpay
// // // // //   if (showWebView) {
// // // // //     return (
// // // // //       <View style={styles.container}>
// // // // //         <View style={styles.webViewHeader}>
// // // // //           <TouchableOpacity onPress={() => setShowWebView(false)}>
// // // // //             <Icon name="close" size={24} color="#282c3f" />
// // // // //           </TouchableOpacity>
// // // // //           <Text style={styles.webViewTitle}>Secure Payment</Text>
// // // // //           <View style={{ width: 24 }} />
// // // // //         </View>
// // // // //         <WebView
// // // // //           source={{ uri: webViewUrl }}
// // // // //           onNavigationStateChange={handleWebViewNavigation}
// // // // //           javaScriptEnabled={true}
// // // // //           domStorageEnabled={true}
// // // // //           startInLoadingState={true}
// // // // //           renderLoading={() => (
// // // // //             <View style={styles.webViewLoading}>
// // // // //               <ActivityIndicator size="large" color={colors.primary} />
// // // // //               <Text style={styles.webViewLoadingText}>Loading Payment...</Text>
// // // // //             </View>
// // // // //           )}
// // // // //         />
// // // // //       </View>
// // // // //     );
// // // // //   }

// // // // //   return (
// // // // //     <View style={styles.container}>
// // // // //       <ScrollView showsVerticalScrollIndicator={false}>
// // // // //         {/* Header */}
// // // // //         <View style={styles.header}>
// // // // //           <TouchableOpacity onPress={() => navigation.goBack()}>
// // // // //             <Icon name="arrow-back" size={24} color={colors.text} />
// // // // //           </TouchableOpacity>
// // // // //           <Text style={styles.headerTitle}>Payment</Text>
// // // // //           <View style={{ width: 24 }} />
// // // // //         </View>

// // // // //         {/* Amount */}
// // // // //         <View style={styles.amountContainer}>
// // // // //           <Text style={styles.amountLabel}>Amount to Pay</Text>
// // // // //           <Text style={styles.amountValue}>₹{totalAmount}</Text>
// // // // //         </View>

// // // // //         {/* Payment Methods */}
// // // // //         <View style={styles.methodsContainer}>
// // // // //           <Text style={styles.sectionTitle}>Payment Methods</Text>
// // // // //           {paymentMethods.map((method) => (
// // // // //             <TouchableOpacity
// // // // //               key={method.id}
// // // // //               style={[
// // // // //                 styles.methodItem,
// // // // //                 selectedMethod === method.id && styles.selectedMethod,
// // // // //               ]}
// // // // //               onPress={() => handleSelectMethod(method.id)}
// // // // //               disabled={loading}
// // // // //             >
// // // // //               <View style={styles.methodLeft}>
// // // // //                 <View style={[styles.methodIcon, selectedMethod === method.id && styles.selectedMethodIcon]}>
// // // // //                   <Icon name={method.icon} size={22} color={selectedMethod === method.id ? colors.white : colors.text} />
// // // // //                 </View>
// // // // //                 <View style={styles.methodInfo}>
// // // // //                   <Text style={[
// // // // //                     styles.methodName,
// // // // //                     selectedMethod === method.id && styles.selectedMethodText,
// // // // //                   ]}>
// // // // //                     {method.name}
// // // // //                   </Text>
// // // // //                   <Text style={styles.methodDesc}>{method.desc}</Text>
// // // // //                 </View>
// // // // //               </View>
// // // // //               {selectedMethod === method.id && (
// // // // //                 <Icon name="checkmark-circle" size={24} color={colors.primary} />
// // // // //               )}
// // // // //             </TouchableOpacity>
// // // // //           ))}
// // // // //         </View>

// // // // //         {/* Cash on Delivery Info */}
// // // // //         {selectedMethod === 'cash' && (
// // // // //           <View style={styles.infoContainer}>
// // // // //             <Icon name="information-circle-outline" size={20} color={colors.info || '#2196F3'} />
// // // // //             <Text style={styles.infoText}>
// // // // //               Pay with cash when your order arrives. No additional charges.
// // // // //             </Text>
// // // // //           </View>
// // // // //         )}
// // // // //       </ScrollView>

// // // // //       {/* Place Order Button - Shows for Cash on Delivery only */}
// // // // //       {selectedMethod === 'cash' && (
// // // // //         <View style={styles.footer}>
// // // // //           <TouchableOpacity 
// // // // //             style={styles.placeOrderButton} 
// // // // //             onPress={handlePlaceOrder}
// // // // //             disabled={loading}
// // // // //           >
// // // // //             {loading ? (
// // // // //               <ActivityIndicator color="#ffffff" />
// // // // //             ) : (
// // // // //               <Text style={styles.placeOrderButtonText}>Place Order • ₹{totalAmount}</Text>
// // // // //             )}
// // // // //           </TouchableOpacity>
// // // // //         </View>
// // // // //       )}

// // // // //       {/* ============ UPI MODAL ============ */}
// // // // //       <Modal
// // // // //         visible={showUPIModal}
// // // // //         transparent={true}
// // // // //         animationType="slide"
// // // // //         onRequestClose={() => setShowUPIModal(false)}
// // // // //       >
// // // // //         <View style={styles.modalOverlay}>
// // // // //           <View style={styles.modalContainer}>
// // // // //             <View style={styles.modalHeader}>
// // // // //               <Text style={styles.modalTitle}>Select UPI App</Text>
// // // // //               <TouchableOpacity onPress={() => setShowUPIModal(false)}>
// // // // //                 <Icon name="close" size={24} color={colors.text} />
// // // // //               </TouchableOpacity>
// // // // //             </View>

// // // // //             <View style={styles.upiAppsContainer}>
// // // // //               {upiApps.map((app) => (
// // // // //                 <TouchableOpacity
// // // // //                   key={app.id}
// // // // //                   style={styles.upiAppItem}
// // // // //                   onPress={() => handleUPIDeepLink(app)}
// // // // //                 >
// // // // //                   <View style={[styles.upiAppIcon, { backgroundColor: app.color + '20' }]}>
// // // // //                     <Text style={styles.upiAppEmoji}>{app.emoji}</Text>
// // // // //                   </View>
// // // // //                   <View style={styles.upiAppInfo}>
// // // // //                     <Text style={styles.upiAppName}>{app.name}</Text>
// // // // //                     <Text style={styles.upiAppDesc}>UPI Payment</Text>
// // // // //                   </View>
// // // // //                   <Icon name="chevron-forward" size={20} color={colors.gray} />
// // // // //                 </TouchableOpacity>
// // // // //               ))}
// // // // //             </View>

// // // // //             <TouchableOpacity 
// // // // //               style={styles.enterUPIButton}
// // // // //               onPress={() => {
// // // // //                 setShowUPIModal(false);
// // // // //                 // Open UPI intent
// // // // //                 Linking.openURL('upi://pay?pa=quickbite@razorpay&pn=QuickBite&am=' + totalAmount + '&cu=INR');
// // // // //               }}
// // // // //             >
// // // // //               <Text style={styles.enterUPIButtonText}>Enter UPI ID Manually</Text>
// // // // //             </TouchableOpacity>
// // // // //           </View>
// // // // //         </View>
// // // // //       </Modal>

// // // // //       {/* ============ CARD MODAL ============ */}
// // // // //       <Modal
// // // // //         visible={showCardModal}
// // // // //         transparent={true}
// // // // //         animationType="slide"
// // // // //         onRequestClose={() => setShowCardModal(false)}
// // // // //       >
// // // // //         <View style={styles.modalOverlay}>
// // // // //           <View style={styles.modalContainer}>
// // // // //             <View style={styles.modalHeader}>
// // // // //               <Text style={styles.modalTitle}>Card Details</Text>
// // // // //               <TouchableOpacity onPress={() => setShowCardModal(false)}>
// // // // //                 <Icon name="close" size={24} color={colors.text} />
// // // // //               </TouchableOpacity>
// // // // //             </View>

// // // // //             <View style={styles.cardModalBody}>
// // // // //               <View style={styles.cardPreview}>
// // // // //                 <Icon name="card-outline" size={40} color={colors.primary} />
// // // // //                 <Text style={styles.cardPreviewText}>Enter Card Details</Text>
// // // // //               </View>

// // // // //               <View style={styles.inputContainer}>
// // // // //                 <Text style={styles.inputLabel}>Card Number</Text>
// // // // //                 <TextInput
// // // // //                   style={styles.input}
// // // // //                   placeholder="1234 5678 9012 3456"
// // // // //                   value={cardNumber}
// // // // //                   onChangeText={(text) => setCardNumber(formatCardNumber(text))}
// // // // //                   keyboardType="numeric"
// // // // //                   maxLength={19}
// // // // //                 />
// // // // //               </View>

// // // // //               <View style={styles.inputContainer}>
// // // // //                 <Text style={styles.inputLabel}>Card Holder Name</Text>
// // // // //                 <TextInput
// // // // //                   style={styles.input}
// // // // //                   placeholder="John Doe"
// // // // //                   value={cardHolder}
// // // // //                   onChangeText={setCardHolder}
// // // // //                 />
// // // // //               </View>

// // // // //               <View style={styles.rowInputs}>
// // // // //                 <View style={[styles.inputContainer, styles.halfInput]}>
// // // // //                   <Text style={styles.inputLabel}>Expiry Date</Text>
// // // // //                   <TextInput
// // // // //                     style={styles.input}
// // // // //                     placeholder="MM/YY"
// // // // //                     value={expiryDate}
// // // // //                     onChangeText={(text) => setExpiryDate(formatExpiryDate(text))}
// // // // //                     keyboardType="numeric"
// // // // //                     maxLength={5}
// // // // //                   />
// // // // //                 </View>
// // // // //                 <View style={[styles.inputContainer, styles.halfInput]}>
// // // // //                   <Text style={styles.inputLabel}>CVV</Text>
// // // // //                   <TextInput
// // // // //                     style={styles.input}
// // // // //                     placeholder="123"
// // // // //                     value={cvv}
// // // // //                     onChangeText={setCvv}
// // // // //                     keyboardType="numeric"
// // // // //                     maxLength={4}
// // // // //                     secureTextEntry
// // // // //                   />
// // // // //                 </View>
// // // // //               </View>

// // // // //               <TouchableOpacity 
// // // // //                 style={styles.payNowButton} 
// // // // //                 onPress={handleCardPayment}
// // // // //                 disabled={loading}
// // // // //               >
// // // // //                 {loading ? (
// // // // //                   <ActivityIndicator color="#ffffff" />
// // // // //                 ) : (
// // // // //                   <Text style={styles.payNowButtonText}>Pay ₹{totalAmount}</Text>
// // // // //                 )}
// // // // //               </TouchableOpacity>
// // // // //             </View>
// // // // //           </View>
// // // // //         </View>
// // // // //       </Modal>

// // // // //       {/* ============ NET BANKING MODAL ============ */}
// // // // //       <Modal
// // // // //         visible={showNetBankingModal}
// // // // //         transparent={true}
// // // // //         animationType="slide"
// // // // //         onRequestClose={() => setShowNetBankingModal(false)}
// // // // //       >
// // // // //         <View style={styles.modalOverlay}>
// // // // //           <View style={styles.modalContainer}>
// // // // //             <View style={styles.modalHeader}>
// // // // //               <Text style={styles.modalTitle}>Select Bank</Text>
// // // // //               <TouchableOpacity onPress={() => setShowNetBankingModal(false)}>
// // // // //                 <Icon name="close" size={24} color={colors.text} />
// // // // //               </TouchableOpacity>
// // // // //             </View>

// // // // //             <View style={styles.banksContainer}>
// // // // //               {banks.map((bank) => (
// // // // //                 <TouchableOpacity
// // // // //                   key={bank.id}
// // // // //                   style={styles.bankItem}
// // // // //                   onPress={() => handleNetBankingSelect(bank)}
// // // // //                 >
// // // // //                   <View style={[styles.bankIcon, { backgroundColor: bank.color + '20' }]}>
// // // // //                     <Text style={styles.bankEmoji}>{bank.icon}</Text>
// // // // //                   </View>
// // // // //                   <View style={styles.bankInfo}>
// // // // //                     <Text style={styles.bankName}>{bank.name}</Text>
// // // // //                     <Text style={styles.bankDesc}>Net Banking</Text>
// // // // //                   </View>
// // // // //                   <Icon name="chevron-forward" size={20} color={colors.gray} />
// // // // //                 </TouchableOpacity>
// // // // //               ))}
// // // // //             </View>
// // // // //           </View>
// // // // //         </View>
// // // // //       </Modal>

// // // // //       {/* ============ WALLET MODAL ============ */}
// // // // //       <Modal
// // // // //         visible={showWalletModal}
// // // // //         transparent={true}
// // // // //         animationType="slide"
// // // // //         onRequestClose={() => setShowWalletModal(false)}
// // // // //       >
// // // // //         <View style={styles.modalOverlay}>
// // // // //           <View style={styles.modalContainer}>
// // // // //             <View style={styles.modalHeader}>
// // // // //               <Text style={styles.modalTitle}>Pay with Wallet</Text>
// // // // //               <TouchableOpacity onPress={() => setShowWalletModal(false)}>
// // // // //                 <Icon name="close" size={24} color={colors.text} />
// // // // //               </TouchableOpacity>
// // // // //             </View>

// // // // //             <View style={styles.walletModalBody}>
// // // // //               <View style={styles.walletBalanceContainer}>
// // // // //                 <Icon name="wallet-outline" size={40} color={colors.primary} />
// // // // //                 <Text style={styles.walletBalanceTitle}>Wallet Balance</Text>
// // // // //                 <Text style={styles.walletBalanceAmount}>₹{walletBalance}</Text>
// // // // //               </View>

// // // // //               <View style={styles.walletInfoContainer}>
// // // // //                 <View style={styles.walletInfoRow}>
// // // // //                   <Text style={styles.walletInfoLabel}>Order Total</Text>
// // // // //                   <Text style={styles.walletInfoValue}>₹{totalAmount}</Text>
// // // // //                 </View>
// // // // //                 <View style={styles.walletInfoRow}>
// // // // //                   <Text style={styles.walletInfoLabel}>Balance After Payment</Text>
// // // // //                   <Text style={[styles.walletInfoValue, { color: totalAmount <= walletBalance ? colors.success : colors.danger }]}>
// // // // //                     ₹{walletBalance - totalAmount}
// // // // //                   </Text>
// // // // //                 </View>
// // // // //               </View>

// // // // //               <TouchableOpacity 
// // // // //                 style={[styles.walletPayButton, totalAmount > walletBalance && styles.walletPayButtonDisabled]}
// // // // //                 onPress={handleWalletPayment}
// // // // //                 disabled={loading || totalAmount > walletBalance}
// // // // //               >
// // // // //                 {loading ? (
// // // // //                   <ActivityIndicator color="#ffffff" />
// // // // //                 ) : (
// // // // //                   <Text style={styles.walletPayButtonText}>
// // // // //                     {totalAmount > walletBalance ? 'Insufficient Balance' : `Pay ₹${totalAmount}`}
// // // // //                   </Text>
// // // // //                 )}
// // // // //               </TouchableOpacity>
// // // // //             </View>
// // // // //           </View>
// // // // //         </View>
// // // // //       </Modal>

// // // // //       {/* Loading Overlay */}
// // // // //       {loading && (
// // // // //         <View style={styles.loadingOverlay}>
// // // // //           <View style={styles.loadingContainer}>
// // // // //             <ActivityIndicator size="large" color={colors.primary} />
// // // // //             <Text style={styles.loadingText}>Processing Payment...</Text>
// // // // //             <Text style={styles.loadingSubText}>Please do not close the app</Text>
// // // // //           </View>
// // // // //         </View>
// // // // //       )}
// // // // //     </View>
// // // // //   );
// // // // // }

// // // // // const styles = StyleSheet.create({
// // // // //   container: {
// // // // //     flex: 1,
// // // // //     backgroundColor: colors.white,
// // // // //   },
// // // // //   centerContent: {
// // // // //     flex: 1,
// // // // //     justifyContent: 'center',
// // // // //     alignItems: 'center',
// // // // //     padding: 20,
// // // // //   },
// // // // //   errorText: {
// // // // //     fontSize: 20,
// // // // //     fontWeight: '600',
// // // // //     color: colors.text,
// // // // //     marginTop: 16,
// // // // //   },
// // // // //   errorSubText: {
// // // // //     fontSize: 14,
// // // // //     color: colors.textLight,
// // // // //     marginTop: 8,
// // // // //     marginBottom: 24,
// // // // //   },
// // // // //   goBackButton: {
// // // // //     backgroundColor: colors.primary,
// // // // //     paddingHorizontal: 32,
// // // // //     paddingVertical: 12,
// // // // //     borderRadius: 8,
// // // // //   },
// // // // //   goBackButtonText: {
// // // // //     color: colors.white,
// // // // //     fontSize: 16,
// // // // //     fontWeight: '600',
// // // // //   },
// // // // //   header: {
// // // // //     flexDirection: 'row',
// // // // //     alignItems: 'center',
// // // // //     justifyContent: 'space-between',
// // // // //     padding: 16,
// // // // //     paddingTop: 40,
// // // // //     borderBottomWidth: 1,
// // // // //     borderBottomColor: colors.border,
// // // // //   },
// // // // //   headerTitle: {
// // // // //     fontSize: 18,
// // // // //     fontWeight: '600',
// // // // //     color: colors.text,
// // // // //   },
// // // // //   amountContainer: {
// // // // //     backgroundColor: colors.primary,
// // // // //     padding: 20,
// // // // //     margin: 16,
// // // // //     borderRadius: 12,
// // // // //     alignItems: 'center',
// // // // //   },
// // // // //   amountLabel: {
// // // // //     fontSize: 14,
// // // // //     color: colors.white,
// // // // //     opacity: 0.8,
// // // // //   },
// // // // //   amountValue: {
// // // // //     fontSize: 28,
// // // // //     fontWeight: '700',
// // // // //     color: colors.white,
// // // // //     marginTop: 4,
// // // // //   },
// // // // //   methodsContainer: {
// // // // //     paddingHorizontal: 16,
// // // // //     paddingBottom: 20,
// // // // //   },
// // // // //   sectionTitle: {
// // // // //     fontSize: 16,
// // // // //     fontWeight: '600',
// // // // //     color: colors.text,
// // // // //     marginBottom: 12,
// // // // //   },
// // // // //   methodItem: {
// // // // //     flexDirection: 'row',
// // // // //     justifyContent: 'space-between',
// // // // //     alignItems: 'center',
// // // // //     padding: 14,
// // // // //     borderWidth: 1,
// // // // //     borderColor: colors.border,
// // // // //     borderRadius: 10,
// // // // //     marginBottom: 8,
// // // // //   },
// // // // //   selectedMethod: {
// // // // //     borderColor: colors.primary,
// // // // //     backgroundColor: '#fff5ec',
// // // // //   },
// // // // //   methodLeft: {
// // // // //     flexDirection: 'row',
// // // // //     alignItems: 'center',
// // // // //     flex: 1,
// // // // //   },
// // // // //   methodIcon: {
// // // // //     width: 36,
// // // // //     height: 36,
// // // // //     borderRadius: 18,
// // // // //     backgroundColor: colors.lightGray,
// // // // //     justifyContent: 'center',
// // // // //     alignItems: 'center',
// // // // //     marginRight: 12,
// // // // //   },
// // // // //   selectedMethodIcon: {
// // // // //     backgroundColor: colors.primary,
// // // // //   },
// // // // //   methodInfo: {
// // // // //     flex: 1,
// // // // //   },
// // // // //   methodName: {
// // // // //     fontSize: 14,
// // // // //     color: colors.text,
// // // // //   },
// // // // //   selectedMethodText: {
// // // // //     color: colors.primary,
// // // // //     fontWeight: '500',
// // // // //   },
// // // // //   methodDesc: {
// // // // //     fontSize: 11,
// // // // //     color: colors.textLight,
// // // // //     marginTop: 1,
// // // // //   },
// // // // //   infoContainer: {
// // // // //     flexDirection: 'row',
// // // // //     alignItems: 'center',
// // // // //     backgroundColor: '#f8f9fa',
// // // // //     marginHorizontal: 16,
// // // // //     marginBottom: 16,
// // // // //     padding: 12,
// // // // //     borderRadius: 8,
// // // // //     borderWidth: 1,
// // // // //     borderColor: colors.border,
// // // // //   },
// // // // //   infoText: {
// // // // //     fontSize: 13,
// // // // //     color: colors.textLight,
// // // // //     marginLeft: 10,
// // // // //     flex: 1,
// // // // //   },
// // // // //   footer: {
// // // // //     padding: 16,
// // // // //     backgroundColor: colors.white,
// // // // //     borderTopWidth: 1,
// // // // //     borderTopColor: colors.border,
// // // // //   },
// // // // //   placeOrderButton: {
// // // // //     backgroundColor: colors.primary,
// // // // //     borderRadius: 12,
// // // // //     height: 50,
// // // // //     justifyContent: 'center',
// // // // //     alignItems: 'center',
// // // // //   },
// // // // //   placeOrderButtonText: {
// // // // //     color: colors.white,
// // // // //     fontSize: 16,
// // // // //     fontWeight: '600',
// // // // //   },
// // // // //   modalOverlay: {
// // // // //     flex: 1,
// // // // //     backgroundColor: 'rgba(0,0,0,0.5)',
// // // // //     justifyContent: 'flex-end',
// // // // //   },
// // // // //   modalContainer: {
// // // // //     backgroundColor: colors.white,
// // // // //     borderTopLeftRadius: 24,
// // // // //     borderTopRightRadius: 24,
// // // // //     paddingHorizontal: 20,
// // // // //     paddingBottom: 30,
// // // // //     maxHeight: '80%',
// // // // //   },
// // // // //   modalHeader: {
// // // // //     flexDirection: 'row',
// // // // //     justifyContent: 'space-between',
// // // // //     alignItems: 'center',
// // // // //     paddingVertical: 16,
// // // // //     borderBottomWidth: 1,
// // // // //     borderBottomColor: colors.border,
// // // // //   },
// // // // //   modalTitle: {
// // // // //     fontSize: 18,
// // // // //     fontWeight: '600',
// // // // //     color: colors.text,
// // // // //   },
// // // // //   upiAppsContainer: {
// // // // //     marginTop: 12,
// // // // //   },
// // // // //   upiAppItem: {
// // // // //     flexDirection: 'row',
// // // // //     alignItems: 'center',
// // // // //     paddingVertical: 14,
// // // // //     borderBottomWidth: 1,
// // // // //     borderBottomColor: colors.border,
// // // // //   },
// // // // //   upiAppIcon: {
// // // // //     width: 48,
// // // // //     height: 48,
// // // // //     borderRadius: 24,
// // // // //     justifyContent: 'center',
// // // // //     alignItems: 'center',
// // // // //     marginRight: 12,
// // // // //   },
// // // // //   upiAppEmoji: {
// // // // //     fontSize: 24,
// // // // //   },
// // // // //   upiAppInfo: {
// // // // //     flex: 1,
// // // // //   },
// // // // //   upiAppName: {
// // // // //     fontSize: 15,
// // // // //     fontWeight: '500',
// // // // //     color: colors.text,
// // // // //   },
// // // // //   upiAppDesc: {
// // // // //     fontSize: 12,
// // // // //     color: colors.textLight,
// // // // //     marginTop: 2,
// // // // //   },
// // // // //   enterUPIButton: {
// // // // //     marginTop: 16,
// // // // //     paddingVertical: 12,
// // // // //     borderWidth: 1,
// // // // //     borderColor: colors.primary,
// // // // //     borderRadius: 8,
// // // // //     alignItems: 'center',
// // // // //   },
// // // // //   enterUPIButtonText: {
// // // // //     color: colors.primary,
// // // // //     fontSize: 14,
// // // // //     fontWeight: '500',
// // // // //   },
// // // // //   cardModalBody: {
// // // // //     marginTop: 8,
// // // // //   },
// // // // //   cardPreview: {
// // // // //     alignItems: 'center',
// // // // //     paddingVertical: 20,
// // // // //     backgroundColor: '#f8f9fa',
// // // // //     borderRadius: 12,
// // // // //     marginBottom: 16,
// // // // //   },
// // // // //   cardPreviewText: {
// // // // //     fontSize: 14,
// // // // //     color: colors.textLight,
// // // // //     marginTop: 8,
// // // // //   },
// // // // //   inputContainer: {
// // // // //     marginBottom: 12,
// // // // //   },
// // // // //   inputLabel: {
// // // // //     fontSize: 14,
// // // // //     fontWeight: '500',
// // // // //     color: colors.text,
// // // // //     marginBottom: 4,
// // // // //   },
// // // // //   input: {
// // // // //     borderWidth: 1,
// // // // //     borderColor: colors.border,
// // // // //     borderRadius: 8,
// // // // //     paddingHorizontal: 12,
// // // // //     paddingVertical: 10,
// // // // //     fontSize: 14,
// // // // //     color: colors.text,
// // // // //     backgroundColor: colors.white,
// // // // //   },
// // // // //   rowInputs: {
// // // // //     flexDirection: 'row',
// // // // //     justifyContent: 'space-between',
// // // // //   },
// // // // //   halfInput: {
// // // // //     flex: 1,
// // // // //     marginRight: 8,
// // // // //   },
// // // // //   payNowButton: {
// // // // //     backgroundColor: colors.primary,
// // // // //     borderRadius: 12,
// // // // //     height: 50,
// // // // //     justifyContent: 'center',
// // // // //     alignItems: 'center',
// // // // //     marginTop: 8,
// // // // //   },
// // // // //   payNowButtonText: {
// // // // //     color: colors.white,
// // // // //     fontSize: 16,
// // // // //     fontWeight: '600',
// // // // //   },
// // // // //   banksContainer: {
// // // // //     marginTop: 12,
// // // // //   },
// // // // //   bankItem: {
// // // // //     flexDirection: 'row',
// // // // //     alignItems: 'center',
// // // // //     paddingVertical: 14,
// // // // //     borderBottomWidth: 1,
// // // // //     borderBottomColor: colors.border,
// // // // //   },
// // // // //   bankIcon: {
// // // // //     width: 44,
// // // // //     height: 44,
// // // // //     borderRadius: 22,
// // // // //     justifyContent: 'center',
// // // // //     alignItems: 'center',
// // // // //     marginRight: 12,
// // // // //   },
// // // // //   bankEmoji: {
// // // // //     fontSize: 20,
// // // // //   },
// // // // //   bankInfo: {
// // // // //     flex: 1,
// // // // //   },
// // // // //   bankName: {
// // // // //     fontSize: 14,
// // // // //     fontWeight: '500',
// // // // //     color: colors.text,
// // // // //   },
// // // // //   bankDesc: {
// // // // //     fontSize: 12,
// // // // //     color: colors.textLight,
// // // // //     marginTop: 1,
// // // // //   },
// // // // //   walletModalBody: {
// // // // //     marginTop: 8,
// // // // //   },
// // // // //   walletBalanceContainer: {
// // // // //     alignItems: 'center',
// // // // //     paddingVertical: 20,
// // // // //     backgroundColor: '#f8f9fa',
// // // // //     borderRadius: 12,
// // // // //     marginBottom: 16,
// // // // //   },
// // // // //   walletBalanceTitle: {
// // // // //     fontSize: 14,
// // // // //     color: colors.textLight,
// // // // //     marginTop: 8,
// // // // //   },
// // // // //   walletBalanceAmount: {
// // // // //     fontSize: 28,
// // // // //     fontWeight: '700',
// // // // //     color: colors.primary,
// // // // //     marginTop: 4,
// // // // //   },
// // // // //   walletInfoContainer: {
// // // // //     backgroundColor: '#f8f9fa',
// // // // //     borderRadius: 12,
// // // // //     padding: 16,
// // // // //     marginBottom: 16,
// // // // //   },
// // // // //   walletInfoRow: {
// // // // //     flexDirection: 'row',
// // // // //     justifyContent: 'space-between',
// // // // //     paddingVertical: 4,
// // // // //   },
// // // // //   walletInfoLabel: {
// // // // //     fontSize: 14,
// // // // //     color: colors.textLight,
// // // // //   },
// // // // //   walletInfoValue: {
// // // // //     fontSize: 14,
// // // // //     fontWeight: '500',
// // // // //     color: colors.text,
// // // // //   },
// // // // //   walletPayButton: {
// // // // //     backgroundColor: colors.primary,
// // // // //     borderRadius: 12,
// // // // //     height: 50,
// // // // //     justifyContent: 'center',
// // // // //     alignItems: 'center',
// // // // //   },
// // // // //   walletPayButtonDisabled: {
// // // // //     backgroundColor: colors.gray,
// // // // //   },
// // // // //   walletPayButtonText: {
// // // // //     color: colors.white,
// // // // //     fontSize: 16,
// // // // //     fontWeight: '600',
// // // // //   },
// // // // //   loadingOverlay: {
// // // // //     position: 'absolute',
// // // // //     top: 0,
// // // // //     left: 0,
// // // // //     right: 0,
// // // // //     bottom: 0,
// // // // //     backgroundColor: 'rgba(0,0,0,0.7)',
// // // // //     justifyContent: 'center',
// // // // //     alignItems: 'center',
// // // // //   },
// // // // //   loadingContainer: {
// // // // //     backgroundColor: colors.white,
// // // // //     padding: 30,
// // // // //     borderRadius: 16,
// // // // //     alignItems: 'center',
// // // // //     minWidth: 200,
// // // // //   },
// // // // //   loadingText: {
// // // // //     fontSize: 16,
// // // // //     fontWeight: '600',
// // // // //     color: colors.text,
// // // // //     marginTop: 12,
// // // // //   },
// // // // //   loadingSubText: {
// // // // //     fontSize: 12,
// // // // //     color: colors.textLight,
// // // // //     marginTop: 4,
// // // // //   },
// // // // //   // WebView Styles
// // // // //   webViewHeader: {
// // // // //     flexDirection: 'row',
// // // // //     alignItems: 'center',
// // // // //     justifyContent: 'space-between',
// // // // //     paddingHorizontal: 16,
// // // // //     paddingTop: 12,
// // // // //     paddingBottom: 16,
// // // // //     backgroundColor: '#ffffff',
// // // // //     borderBottomWidth: 1,
// // // // //     borderBottomColor: '#f0f0f5',
// // // // //   },
// // // // //   webViewTitle: {
// // // // //     fontSize: 18,
// // // // //     fontWeight: '600',
// // // // //     color: '#282c3f',
// // // // //   },
// // // // //   webViewLoading: {
// // // // //     flex: 1,
// // // // //     justifyContent: 'center',
// // // // //     alignItems: 'center',
// // // // //     backgroundColor: '#ffffff',
// // // // //   },
// // // // //   webViewLoadingText: {
// // // // //     fontSize: 16,
// // // // //     color: '#7e808c',
// // // // //     marginTop: 12,
// // // // //   },
// // // // // });
// // // // // delivery-app/src/screens/PaymentScreen.tsx
// // // // import React, { useState, useContext } from 'react';
// // // // import {
// // // //   View,
// // // //   Text,
// // // //   ScrollView,
// // // //   TouchableOpacity,
// // // //   StyleSheet,
// // // //   SafeAreaView,
// // // //   StatusBar,
// // // //   Alert,
// // // //   ActivityIndicator,
// // // //   Modal,
// // // //   TextInput,
// // // //   Dimensions,
// // // // } from 'react-native';
// // // // import Icon from 'react-native-vector-icons/Ionicons';
// // // // import { WebView } from 'react-native-webview';
// // // // import { AuthContext } from '../../context/AuthContext';
// // // // import { CartContext } from '../../context/CartContext';
// // // // import { OrderContext } from '../../context/OrderContext';
// // // // import { paymentService } from '../../services/paymentService';

// // // // const { width, height } = Dimensions.get('window');

// // // // interface PaymentScreenProps {
// // // //   navigation: any;
// // // //   route: any;
// // // // }

// // // // const PaymentScreen: React.FC<PaymentScreenProps> = ({ navigation, route }) => {
// // // //   const { totalAmount, orderId } = route.params || {};
// // // //   const { user } = useContext(AuthContext);
// // // //   const { clearCart } = useContext(CartContext);
// // // //   const { addOrder } = useContext(OrderContext);

// // // //   const [selectedMethod, setSelectedMethod] = useState<string>('razorpay');
// // // //   const [loading, setLoading] = useState<boolean>(false);
// // // //   const [showWebView, setShowWebView] = useState<boolean>(false);
// // // //   const [webViewUrl, setWebViewUrl] = useState<string>('');
// // // //   const [showUPIModal, setShowUPIModal] = useState<boolean>(false);
// // // //   const [upiId, setUpiId] = useState<string>('');
// // // //   const [selectedBank, setSelectedBank] = useState<string>('');
// // // //   const [showBankModal, setShowBankModal] = useState<boolean>(false);

// // // //   // Payment Methods
// // // //   const paymentMethods = [
// // // //     {
// // // //       id: 'razorpay',
// // // //       icon: 'phone-portrait-outline',
// // // //       name: 'Razorpay',
// // // //       description: 'UPI, Cards, Net Banking',
// // // //       color: '#fc8019',
// // // //       bg: '#fff5ec',
// // // //     },
// // // //     {
// // // //       id: 'card',
// // // //       icon: 'card-outline',
// // // //       name: 'Credit/Debit Card',
// // // //       description: 'Pay with card',
// // // //       color: '#1a73e8',
// // // //       bg: '#e8f0fe',
// // // //     },
// // // //     {
// // // //       id: 'upi',
// // // //       icon: 'phone-portrait-outline',
// // // //       name: 'UPI',
// // // //       description: 'Google Pay, PhonePe, Paytm',
// // // //       color: '#6f42c1',
// // // //       bg: '#f3e5f5',
// // // //     },
// // // //     {
// // // //       id: 'netbanking',
// // // //       icon: 'business-outline',
// // // //       name: 'Net Banking',
// // // //       description: 'All major banks',
// // // //       color: '#0d6efd',
// // // //       bg: '#cfe2ff',
// // // //     },
// // // //     {
// // // //       id: 'wallet',
// // // //       icon: 'wallet-outline',
// // // //       name: 'Wallet',
// // // //       description: 'Balance: ₹2,500',
// // // //       color: '#28a745',
// // // //       bg: '#d4edda',
// // // //     },
// // // //     {
// // // //       id: 'cash',
// // // //       icon: 'cash-outline',
// // // //       name: 'Cash on Delivery',
// // // //       description: 'Pay when you receive',
// // // //       color: '#fd7e14',
// // // //       bg: '#fff3cd',
// // // //     },
// // // //   ];

// // // //   // Banks List
// // // //   const banks = [
// // // //     { id: 'sbi', name: 'State Bank of India', icon: '🏦' },
// // // //     { id: 'hdfc', name: 'HDFC Bank', icon: '🏛️' },
// // // //     { id: 'icici', name: 'ICICI Bank', icon: '🏛️' },
// // // //     { id: 'axis', name: 'Axis Bank', icon: '🏦' },
// // // //     { id: 'kotak', name: 'Kotak Mahindra Bank', icon: '🏦' },
// // // //     { id: 'yes', name: 'Yes Bank', icon: '🏛️' },
// // // //     { id: 'pnb', name: 'Punjab National Bank', icon: '🏦' },
// // // //     { id: 'bob', name: 'Bank of Baroda', icon: '🏛️' },
// // // //   ];

// // // //   // ============================================
// // // //   // HANDLE RAZORPAY PAYMENT (WebView)
// // // //   // ============================================
// // // //   const handleRazorpayPayment = async () => {
// // // //     try {
// // // //       setLoading(true);

// // // //       // 1. Create Razorpay Order
// // // //       const orderData = await paymentService.createRazorpayOrder(totalAmount, orderId);

// // // //       if (!orderData.success) {
// // // //         Alert.alert('Error', orderData.message || 'Failed to create order');
// // // //         setLoading(false);
// // // //         return;
// // // //       }

// // // //       const { order, key } = orderData;

// // // //       // 2. Build payment URL for WebView
// // // //       // You need to create a HTML page that uses Razorpay checkout
// // // //       const paymentUrl = `http://localhost:3000/payment/checkout?order_id=${order.id}&amount=${order.amount}&key=${key}`;
      
// // // //       setWebViewUrl(paymentUrl);
// // // //       setShowWebView(true);
// // // //       setLoading(false);

// // // //     } catch (error: any) {
// // // //       console.error('Payment error:', error);
// // // //       Alert.alert('Payment Error', error.message || 'Something went wrong');
// // // //       setLoading(false);
// // // //     }
// // // //   };

// // // //   // ============================================
// // // //   // WebView Navigation Handler
// // // //   // ============================================
// // // //   const handleWebViewNavigation = (navState: any) => {
// // // //     const { url } = navState;
    
// // // //     // Check if payment is successful
// // // //     if (url.includes('payment-success')) {
// // // //       setShowWebView(false);
// // // //       clearCart();
// // // //       Alert.alert(
// // // //         '✅ Payment Successful!',
// // // //         'Your order has been placed successfully.',
// // // //         [
// // // //           {
// // // //             text: 'View Order',
// // // //             onPress: () => navigation.replace('Orders'),
// // // //           },
// // // //           {
// // // //             text: 'Track Order',
// // // //             onPress: () => navigation.replace('OrderTracking', { orderId }),
// // // //           },
// // // //         ]
// // // //       );
// // // //     }
    
// // // //     // Check if payment failed
// // // //     if (url.includes('payment-failed')) {
// // // //       setShowWebView(false);
// // // //       Alert.alert(
// // // //         'Payment Failed',
// // // //         'Your payment was not successful. Please try again.'
// // // //       );
// // // //     }
// // // //   };

// // // //   // ============================================
// // // //   // HANDLE CASH ON DELIVERY
// // // //   // ============================================
// // // //   const handleCashOnDelivery = () => {
// // // //     Alert.alert(
// // // //       'Confirm Order',
// // // //       `Total Amount: ₹${totalAmount}\n\nYou will pay when the order arrives.`,
// // // //       [
// // // //         { text: 'Cancel', style: 'cancel' },
// // // //         {
// // // //           text: 'Place Order',
// // // //           onPress: () => {
// // // //             clearCart();
// // // //             navigation.replace('OrderSuccess', {
// // // //               orderId,
// // // //               totalAmount,
// // // //               paymentMethod: 'Cash on Delivery',
// // // //             });
// // // //           },
// // // //         },
// // // //       ]
// // // //     );
// // // //   };

// // // //   // ============================================
// // // //   // HANDLE UPI PAYMENT
// // // //   // ============================================
// // // //   const handleUPIPayment = () => {
// // // //     if (!upiId.trim()) {
// // // //       Alert.alert('Error', 'Please enter a valid UPI ID');
// // // //       return;
// // // //     }
// // // //     setShowUPIModal(false);
// // // //     setLoading(true);

// // // //     // Simulate UPI payment
// // // //     setTimeout(() => {
// // // //       setLoading(false);
// // // //       clearCart();
// // // //       navigation.replace('OrderSuccess', {
// // // //         orderId,
// // // //         totalAmount,
// // // //         paymentMethod: 'UPI',
// // // //       });
// // // //     }, 2000);
// // // //   };

// // // //   // ============================================
// // // //   // HANDLE NET BANKING
// // // //   // ============================================
// // // //   const handleNetBanking = () => {
// // // //     if (!selectedBank) {
// // // //       Alert.alert('Error', 'Please select a bank');
// // // //       return;
// // // //     }
// // // //     setShowBankModal(false);
// // // //     setLoading(true);

// // // //     setTimeout(() => {
// // // //       setLoading(false);
// // // //       clearCart();
// // // //       navigation.replace('OrderSuccess', {
// // // //         orderId,
// // // //         totalAmount,
// // // //         paymentMethod: 'Net Banking',
// // // //       });
// // // //     }, 2000);
// // // //   };

// // // //   // ============================================
// // // //   // HANDLE WALLET PAYMENT
// // // //   // ============================================
// // // //   const handleWalletPayment = () => {
// // // //     const walletBalance = 2500;
// // // //     if (totalAmount > walletBalance) {
// // // //       Alert.alert(
// // // //         'Insufficient Balance',
// // // //         `Wallet balance: ₹${walletBalance}\nAmount needed: ₹${totalAmount}`
// // // //       );
// // // //       return;
// // // //     }

// // // //     setLoading(true);
// // // //     setTimeout(() => {
// // // //       setLoading(false);
// // // //       clearCart();
// // // //       navigation.replace('OrderSuccess', {
// // // //         orderId,
// // // //         totalAmount,
// // // //         paymentMethod: 'Wallet',
// // // //       });
// // // //     }, 2000);
// // // //   };

// // // //   // ============================================
// // // //   // HANDLE PAYMENT SELECTION
// // // //   // ============================================
// // // //   const handlePaymentSelect = (methodId: string) => {
// // // //     setSelectedMethod(methodId);

// // // //     switch (methodId) {
// // // //       case 'razorpay':
// // // //         handleRazorpayPayment();
// // // //         break;
// // // //       case 'cash':
// // // //         handleCashOnDelivery();
// // // //         break;
// // // //       case 'upi':
// // // //         setShowUPIModal(true);
// // // //         break;
// // // //       case 'netbanking':
// // // //         setShowBankModal(true);
// // // //         break;
// // // //       case 'wallet':
// // // //         handleWalletPayment();
// // // //         break;
// // // //       case 'card':
// // // //         Alert.alert('Card Payment', 'Card payment option coming soon!');
// // // //         break;
// // // //       default:
// // // //         break;
// // // //     }
// // // //   };

// // // //   // 🔥 If no amount
// // // //   if (!totalAmount || totalAmount === 0) {
// // // //     return (
// // // //       <SafeAreaView style={[styles.container, styles.centerContent]}>
// // // //         <Icon name="alert-circle-outline" size={60} color="#dc3545" />
// // // //         <Text style={styles.errorText}>No amount specified</Text>
// // // //         <TouchableOpacity style={styles.goBackButton} onPress={() => navigation.goBack()}>
// // // //           <Text style={styles.goBackButtonText}>Go Back</Text>
// // // //         </TouchableOpacity>
// // // //       </SafeAreaView>
// // // //     );
// // // //   }

// // // //   // 🔥 Show WebView
// // // //   if (showWebView) {
// // // //     return (
// // // //       <SafeAreaView style={styles.container}>
// // // //         <View style={styles.webViewHeader}>
// // // //           <TouchableOpacity onPress={() => setShowWebView(false)}>
// // // //             <Icon name="close" size={24} color="#282c3f" />
// // // //           </TouchableOpacity>
// // // //           <Text style={styles.webViewTitle}>Secure Payment</Text>
// // // //           <View style={{ width: 24 }} />
// // // //         </View>
// // // //         <WebView
// // // //           source={{ uri: webViewUrl }}
// // // //           onNavigationStateChange={handleWebViewNavigation}
// // // //           javaScriptEnabled={true}
// // // //           domStorageEnabled={true}
// // // //           startInLoadingState={true}
// // // //           renderLoading={() => (
// // // //             <View style={styles.webViewLoading}>
// // // //               <ActivityIndicator size="large" color="#fc8019" />
// // // //               <Text style={styles.webViewLoadingText}>Loading Payment...</Text>
// // // //             </View>
// // // //           )}
// // // //         />
// // // //       </SafeAreaView>
// // // //     );
// // // //   }

// // // //   return (
// // // //     <SafeAreaView style={styles.container}>
// // // //       <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

// // // //       {/* Header */}
// // // //       <View style={styles.header}>
// // // //         <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
// // // //           <Icon name="arrow-back" size={24} color="#282c3f" />
// // // //         </TouchableOpacity>
// // // //         <Text style={styles.headerTitle}>Payment</Text>
// // // //         <View style={{ width: 40 }} />
// // // //       </View>

// // // //       <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
// // // //         {/* Amount Card */}
// // // //         <View style={styles.amountCard}>
// // // //           <Text style={styles.amountLabel}>Amount to Pay</Text>
// // // //           <Text style={styles.amountValue}>₹{totalAmount}</Text>
// // // //           <View style={styles.amountBadge}>
// // // //             <Text style={styles.amountBadgeText}>Secure Payment</Text>
// // // //           </View>
// // // //         </View>

// // // //         {/* Payment Methods */}
// // // //         <Text style={styles.sectionTitle}>Payment Methods</Text>

// // // //         {paymentMethods.map((method) => (
// // // //           <TouchableOpacity
// // // //             key={method.id}
// // // //             style={[
// // // //               styles.methodItem,
// // // //               selectedMethod === method.id && styles.methodSelected,
// // // //             ]}
// // // //             onPress={() => handlePaymentSelect(method.id)}
// // // //             disabled={loading}
// // // //           >
// // // //             <View style={styles.methodLeft}>
// // // //               <View style={[styles.methodIcon, { backgroundColor: method.bg }]}>
// // // //                 <Icon name={method.icon} size={22} color={method.color} />
// // // //               </View>
// // // //               <View>
// // // //                 <Text style={[
// // // //                   styles.methodName,
// // // //                   selectedMethod === method.id && styles.methodNameSelected,
// // // //                 ]}>
// // // //                   {method.name}
// // // //                 </Text>
// // // //                 <Text style={styles.methodDescription}>{method.description}</Text>
// // // //               </View>
// // // //             </View>
// // // //             {selectedMethod === method.id && (
// // // //               <View style={styles.checkmark}>
// // // //                 <Icon name="checkmark-circle" size={24} color="#fc8019" />
// // // //               </View>
// // // //             )}
// // // //           </TouchableOpacity>
// // // //         ))}

// // // //         {/* Secure Payment Badge */}
// // // //         <View style={styles.secureBadge}>
// // // //           <Icon name="shield-checkmark-outline" size={18} color="#28a745" />
// // // //           <Text style={styles.secureBadgeText}>Your payment is secure and encrypted</Text>
// // // //         </View>
// // // //       </ScrollView>

// // // //       {/* ============================================ */}
// // // //       {/* UPI MODAL */}
// // // //       {/* ============================================ */}
// // // //       <Modal
// // // //         visible={showUPIModal}
// // // //         transparent={true}
// // // //         animationType="slide"
// // // //         onRequestClose={() => setShowUPIModal(false)}
// // // //       >
// // // //         <View style={styles.modalOverlay}>
// // // //           <View style={styles.modalContainer}>
// // // //             <View style={styles.modalHeader}>
// // // //               <Text style={styles.modalTitle}>Enter UPI ID</Text>
// // // //               <TouchableOpacity onPress={() => setShowUPIModal(false)}>
// // // //                 <Icon name="close" size={24} color="#282c3f" />
// // // //               </TouchableOpacity>
// // // //             </View>

// // // //             <View style={styles.modalBody}>
// // // //               <Text style={styles.modalSubtitle}>
// // // //                 Enter your UPI ID to make payment
// // // //               </Text>

// // // //               <View style={styles.upiInputContainer}>
// // // //                 <TextInput
// // // //                   style={styles.upiInput}
// // // //                   placeholder="example@upi"
// // // //                   value={upiId}
// // // //                   onChangeText={setUpiId}
// // // //                   autoCapitalize="none"
// // // //                   autoCorrect={false}
// // // //                 />
// // // //               </View>

// // // //               <TouchableOpacity style={styles.payButton} onPress={handleUPIPayment} disabled={loading}>
// // // //                 {loading ? (
// // // //                   <ActivityIndicator color="#ffffff" />
// // // //                 ) : (
// // // //                   <Text style={styles.payButtonText}>Pay ₹{totalAmount}</Text>
// // // //                 )}
// // // //               </TouchableOpacity>
// // // //             </View>
// // // //           </View>
// // // //         </View>
// // // //       </Modal>

// // // //       {/* ============================================ */}
// // // //       {/* BANK MODAL */}
// // // //       {/* ============================================ */}
// // // //       <Modal
// // // //         visible={showBankModal}
// // // //         transparent={true}
// // // //         animationType="slide"
// // // //         onRequestClose={() => setShowBankModal(false)}
// // // //       >
// // // //         <View style={styles.modalOverlay}>
// // // //           <View style={[styles.modalContainer, { maxHeight: '80%' }]}>
// // // //             <View style={styles.modalHeader}>
// // // //               <Text style={styles.modalTitle}>Select Bank</Text>
// // // //               <TouchableOpacity onPress={() => setShowBankModal(false)}>
// // // //                 <Icon name="close" size={24} color="#282c3f" />
// // // //               </TouchableOpacity>
// // // //             </View>

// // // //             <ScrollView style={styles.bankList}>
// // // //               {banks.map((bank) => (
// // // //                 <TouchableOpacity
// // // //                   key={bank.id}
// // // //                   style={[
// // // //                     styles.bankItem,
// // // //                     selectedBank === bank.id && styles.bankItemSelected,
// // // //                   ]}
// // // //                   onPress={() => {
// // // //                     setSelectedBank(bank.id);
// // // //                     setTimeout(() => handleNetBanking(), 300);
// // // //                   }}
// // // //                 >
// // // //                   <Text style={styles.bankIcon}>{bank.icon}</Text>
// // // //                   <Text style={styles.bankName}>{bank.name}</Text>
// // // //                   {selectedBank === bank.id && (
// // // //                     <Icon name="checkmark-circle" size={20} color="#fc8019" />
// // // //                   )}
// // // //                 </TouchableOpacity>
// // // //               ))}
// // // //             </ScrollView>
// // // //           </View>
// // // //         </View>
// // // //       </Modal>

// // // //       {/* ============================================ */}
// // // //       {/* LOADING OVERLAY */}
// // // //       {/* ============================================ */}
// // // //       {loading && (
// // // //         <View style={styles.loadingOverlay}>
// // // //           <View style={styles.loadingContainer}>
// // // //             <ActivityIndicator size="large" color="#fc8019" />
// // // //             <Text style={styles.loadingText}>Processing Payment...</Text>
// // // //             <Text style={styles.loadingSubtext}>Please wait, do not close the app</Text>
// // // //           </View>
// // // //         </View>
// // // //       )}
// // // //     </SafeAreaView>
// // // //   );
// // // // };

// // // // const styles = StyleSheet.create({
// // // //   container: {
// // // //     flex: 1,
// // // //     backgroundColor: '#f8f9fa',
// // // //   },
// // // //   centerContent: {
// // // //     justifyContent: 'center',
// // // //     alignItems: 'center',
// // // //     padding: 20,
// // // //   },
// // // //   errorText: {
// // // //     fontSize: 18,
// // // //     fontWeight: '600',
// // // //     color: '#282c3f',
// // // //     marginTop: 16,
// // // //   },
// // // //   goBackButton: {
// // // //     backgroundColor: '#fc8019',
// // // //     paddingHorizontal: 32,
// // // //     paddingVertical: 12,
// // // //     borderRadius: 8,
// // // //     marginTop: 16,
// // // //   },
// // // //   goBackButtonText: {
// // // //     color: '#ffffff',
// // // //     fontSize: 16,
// // // //     fontWeight: '600',
// // // //   },

// // // //   // Header
// // // //   header: {
// // // //     flexDirection: 'row',
// // // //     alignItems: 'center',
// // // //     justifyContent: 'space-between',
// // // //     paddingHorizontal: 16,
// // // //     paddingTop: 12,
// // // //     paddingBottom: 16,
// // // //     backgroundColor: '#ffffff',
// // // //     borderBottomWidth: 1,
// // // //     borderBottomColor: '#f0f0f5',
// // // //   },
// // // //   backButton: {
// // // //     padding: 4,
// // // //   },
// // // //   headerTitle: {
// // // //     fontSize: 18,
// // // //     fontWeight: '600',
// // // //     color: '#282c3f',
// // // //   },
// // // //   scrollContent: {
// // // //     paddingBottom: 30,
// // // //   },

// // // //   // WebView
// // // //   webViewHeader: {
// // // //     flexDirection: 'row',
// // // //     alignItems: 'center',
// // // //     justifyContent: 'space-between',
// // // //     paddingHorizontal: 16,
// // // //     paddingTop: 12,
// // // //     paddingBottom: 16,
// // // //     backgroundColor: '#ffffff',
// // // //     borderBottomWidth: 1,
// // // //     borderBottomColor: '#f0f0f5',
// // // //   },
// // // //   webViewTitle: {
// // // //     fontSize: 18,
// // // //     fontWeight: '600',
// // // //     color: '#282c3f',
// // // //   },
// // // //   webViewLoading: {
// // // //     flex: 1,
// // // //     justifyContent: 'center',
// // // //     alignItems: 'center',
// // // //     backgroundColor: '#ffffff',
// // // //   },
// // // //   webViewLoadingText: {
// // // //     fontSize: 16,
// // // //     color: '#7e808c',
// // // //     marginTop: 12,
// // // //   },

// // // //   // Amount Card
// // // //   amountCard: {
// // // //     backgroundColor: '#fc8019',
// // // //     marginHorizontal: 16,
// // // //     marginTop: 16,
// // // //     padding: 24,
// // // //     borderRadius: 16,
// // // //     alignItems: 'center',
// // // //     shadowColor: '#fc8019',
// // // //     shadowOffset: { width: 0, height: 4 },
// // // //     shadowOpacity: 0.3,
// // // //     shadowRadius: 8,
// // // //     elevation: 6,
// // // //   },
// // // //   amountLabel: {
// // // //     fontSize: 14,
// // // //     color: '#ffffff',
// // // //     opacity: 0.8,
// // // //     fontWeight: '500',
// // // //   },
// // // //   amountValue: {
// // // //     fontSize: 36,
// // // //     fontWeight: '700',
// // // //     color: '#ffffff',
// // // //     marginTop: 4,
// // // //   },
// // // //   amountBadge: {
// // // //     backgroundColor: 'rgba(255,255,255,0.2)',
// // // //     paddingHorizontal: 12,
// // // //     paddingVertical: 4,
// // // //     borderRadius: 12,
// // // //     marginTop: 8,
// // // //   },
// // // //   amountBadgeText: {
// // // //     fontSize: 12,
// // // //     color: '#ffffff',
// // // //     fontWeight: '500',
// // // //   },

// // // //   // Section
// // // //   sectionTitle: {
// // // //     fontSize: 16,
// // // //     fontWeight: '600',
// // // //     color: '#282c3f',
// // // //     marginHorizontal: 16,
// // // //     marginTop: 24,
// // // //     marginBottom: 12,
// // // //   },

// // // //   // Payment Methods
// // // //   methodItem: {
// // // //     flexDirection: 'row',
// // // //     alignItems: 'center',
// // // //     justifyContent: 'space-between',
// // // //     backgroundColor: '#ffffff',
// // // //     marginHorizontal: 16,
// // // //     marginBottom: 8,
// // // //     padding: 14,
// // // //     borderRadius: 12,
// // // //     borderWidth: 1,
// // // //     borderColor: '#f0f0f5',
// // // //   },
// // // //   methodSelected: {
// // // //     borderColor: '#fc8019',
// // // //     backgroundColor: '#fff5ec',
// // // //   },
// // // //   methodLeft: {
// // // //     flexDirection: 'row',
// // // //     alignItems: 'center',
// // // //     flex: 1,
// // // //   },
// // // //   methodIcon: {
// // // //     width: 44,
// // // //     height: 44,
// // // //     borderRadius: 22,
// // // //     justifyContent: 'center',
// // // //     alignItems: 'center',
// // // //     marginRight: 14,
// // // //   },
// // // //   methodName: {
// // // //     fontSize: 15,
// // // //     fontWeight: '500',
// // // //     color: '#282c3f',
// // // //   },
// // // //   methodNameSelected: {
// // // //     color: '#fc8019',
// // // //   },
// // // //   methodDescription: {
// // // //     fontSize: 12,
// // // //     color: '#7e808c',
// // // //     marginTop: 2,
// // // //   },
// // // //   checkmark: {
// // // //     marginLeft: 8,
// // // //   },

// // // //   // Secure Badge
// // // //   secureBadge: {
// // // //     flexDirection: 'row',
// // // //     alignItems: 'center',
// // // //     justifyContent: 'center',
// // // //     marginHorizontal: 16,
// // // //     marginTop: 20,
// // // //     padding: 12,
// // // //     backgroundColor: '#d4edda',
// // // //     borderRadius: 8,
// // // //   },
// // // //   secureBadgeText: {
// // // //     fontSize: 13,
// // // //     color: '#155724',
// // // //     marginLeft: 8,
// // // //   },

// // // //   // Modal
// // // //   modalOverlay: {
// // // //     flex: 1,
// // // //     backgroundColor: 'rgba(0,0,0,0.5)',
// // // //     justifyContent: 'flex-end',
// // // //   },
// // // //   modalContainer: {
// // // //     backgroundColor: '#ffffff',
// // // //     borderTopLeftRadius: 24,
// // // //     borderTopRightRadius: 24,
// // // //     paddingHorizontal: 20,
// // // //     paddingBottom: 30,
// // // //   },
// // // //   modalHeader: {
// // // //     flexDirection: 'row',
// // // //     justifyContent: 'space-between',
// // // //     alignItems: 'center',
// // // //     paddingVertical: 16,
// // // //     borderBottomWidth: 1,
// // // //     borderBottomColor: '#f0f0f5',
// // // //   },
// // // //   modalTitle: {
// // // //     fontSize: 18,
// // // //     fontWeight: '600',
// // // //     color: '#282c3f',
// // // //   },
// // // //   modalBody: {
// // // //     paddingTop: 20,
// // // //   },
// // // //   modalSubtitle: {
// // // //     fontSize: 14,
// // // //     color: '#7e808c',
// // // //     marginBottom: 16,
// // // //   },
// // // //   upiInputContainer: {
// // // //     marginBottom: 16,
// // // //   },
// // // //   upiInput: {
// // // //     borderWidth: 1,
// // // //     borderColor: '#e0e0e0',
// // // //     borderRadius: 10,
// // // //     paddingHorizontal: 14,
// // // //     paddingVertical: 12,
// // // //     fontSize: 16,
// // // //     color: '#282c3f',
// // // //     backgroundColor: '#f8f9fa',
// // // //   },
// // // //   payButton: {
// // // //     backgroundColor: '#fc8019',
// // // //     paddingVertical: 14,
// // // //     borderRadius: 10,
// // // //     alignItems: 'center',
// // // //   },
// // // //   payButtonText: {
// // // //     color: '#ffffff',
// // // //     fontSize: 16,
// // // //     fontWeight: '600',
// // // //   },

// // // //   // Bank List
// // // //   bankList: {
// // // //     maxHeight: 400,
// // // //   },
// // // //   bankItem: {
// // // //     flexDirection: 'row',
// // // //     alignItems: 'center',
// // // //     paddingVertical: 14,
// // // //     borderBottomWidth: 1,
// // // //     borderBottomColor: '#f0f0f5',
// // // //   },
// // // //   bankItemSelected: {
// // // //     backgroundColor: '#fff5ec',
// // // //     paddingHorizontal: 8,
// // // //     marginHorizontal: -8,
// // // //     borderRadius: 8,
// // // //   },
// // // //   bankIcon: {
// // // //     fontSize: 24,
// // // //     marginRight: 12,
// // // //   },
// // // //   bankName: {
// // // //     fontSize: 15,
// // // //     color: '#282c3f',
// // // //     flex: 1,
// // // //   },

// // // //   // Loading
// // // //   loadingOverlay: {
// // // //     position: 'absolute',
// // // //     top: 0,
// // // //     left: 0,
// // // //     right: 0,
// // // //     bottom: 0,
// // // //     backgroundColor: 'rgba(0,0,0,0.7)',
// // // //     justifyContent: 'center',
// // // //     alignItems: 'center',
// // // //   },
// // // //   loadingContainer: {
// // // //     backgroundColor: '#ffffff',
// // // //     padding: 30,
// // // //     borderRadius: 16,
// // // //     alignItems: 'center',
// // // //     minWidth: 200,
// // // //   },
// // // //   loadingText: {
// // // //     fontSize: 16,
// // // //     fontWeight: '600',
// // // //     color: '#282c3f',
// // // //     marginTop: 12,
// // // //   },
// // // //   loadingSubtext: {
// // // //     fontSize: 12,
// // // //     color: '#7e808c',
// // // //     marginTop: 4,
// // // //   },
// // // // });

// // // // export default PaymentScreen;
// // // // delivery-app/src/screens/PaymentScreen.tsx
// // // import React, { useState, useContext } from 'react';
// // // import {
// // //   View,
// // //   Text,
// // //   ScrollView,
// // //   TouchableOpacity,
// // //   StyleSheet,
// // //   SafeAreaView,
// // //   StatusBar,
// // //   Alert,
// // //   ActivityIndicator,
// // //   Modal,
// // //   TextInput,
// // //   Dimensions,
// // //   Image,
// // // } from 'react-native';
// // // import Icon from 'react-native-vector-icons/Ionicons';
// // // import { WebView } from 'react-native-webview';
// // // import { AuthContext } from '../../context/AuthContext';
// // // import { CartContext } from '../../context/CartContext';
// // // import { paymentService } from '../../services/paymentService';

// // // const { width, height } = Dimensions.get('window');

// // // interface PaymentScreenProps {
// // //   navigation: any;
// // //   route: any;
// // // }

// // // const PaymentScreen: React.FC<PaymentScreenProps> = ({ navigation, route }) => {
// // //   const { totalAmount, orderId } = route.params || {};
// // //   const { user } = useContext(AuthContext);
// // //   const { clearCart } = useContext(CartContext);

// // //   const [selectedMethod, setSelectedMethod] = useState<string>('razorpay');
// // //   const [loading, setLoading] = useState<boolean>(false);
// // //   const [showWebView, setShowWebView] = useState<boolean>(false);
// // //   const [webViewUrl, setWebViewUrl] = useState<string>('');
// // //   const [showUPIModal, setShowUPIModal] = useState<boolean>(false);
// // //   const [upiId, setUpiId] = useState<string>('');
// // //   const [selectedBank, setSelectedBank] = useState<string>('');
// // //   const [showBankModal, setShowBankModal] = useState<boolean>(false);

// // //   // 🔥 REAL APP PAYMENT METHODS - Like Swiggy/Zomato
// // //   const paymentMethods = [
// // //     {
// // //       id: 'razorpay',
// // //       icon: 'phone-portrait-outline',
// // //       name: 'Razorpay',
// // //       description: 'UPI, Cards, Net Banking • Instant',
// // //       color: '#fc8019',
// // //       bg: '#fff5ec',
// // //       badge: 'Popular',
// // //     },
// // //     {
// // //       id: 'wallet',
// // //       icon: 'wallet-outline',
// // //       name: 'QuickBite Wallet',
// // //       description: `Balance: ₹2,500 • Instant`,
// // //       color: '#28a745',
// // //       bg: '#d4edda',
// // //     },
// // //     {
// // //       id: 'cash',
// // //       icon: 'cash-outline',
// // //       name: 'Cash on Delivery',
// // //       description: 'Pay when you receive • No extra charge',
// // //       color: '#fd7e14',
// // //       bg: '#fff3cd',
// // //     },
// // //   ];

// // //   // Banks List for Net Banking
// // //   const banks = [
// // //     { id: 'sbi', name: 'State Bank of India', icon: '🏦' },
// // //     { id: 'hdfc', name: 'HDFC Bank', icon: '🏛️' },
// // //     { id: 'icici', name: 'ICICI Bank', icon: '🏛️' },
// // //     { id: 'axis', name: 'Axis Bank', icon: '🏦' },
// // //     { id: 'kotak', name: 'Kotak Mahindra Bank', icon: '🏦' },
// // //     { id: 'yes', name: 'Yes Bank', icon: '🏛️' },
// // //     { id: 'pnb', name: 'Punjab National Bank', icon: '🏦' },
// // //     { id: 'bob', name: 'Bank of Baroda', icon: '🏛️' },
// // //   ];

// // //   // ============================================
// // //   // HANDLE RAZORPAY PAYMENT (ALL IN ONE)
// // //   // ============================================
// // //   const handleRazorpayPayment = async () => {
// // //     try {
// // //       setLoading(true);

// // //       // Create Razorpay Order
// // //       const orderData = await paymentService.createRazorpayOrder(totalAmount, orderId);

// // //       if (!orderData.success) {
// // //         Alert.alert('Error', orderData.message || 'Failed to create order');
// // //         setLoading(false);
// // //         return;
// // //       }

// // //       const { order, key } = orderData;

// // //       // Open Razorpay WebView Checkout
// // //       const paymentUrl = `http://localhost:3000/payment/checkout?order_id=${order.id}&amount=${order.amount}&key=${key}`;
      
// // //       setWebViewUrl(paymentUrl);
// // //       setShowWebView(true);
// // //       setLoading(false);

// // //     } catch (error: any) {
// // //       console.error('Payment error:', error);
// // //       Alert.alert('Payment Error', error.message || 'Something went wrong');
// // //       setLoading(false);
// // //     }
// // //   };

// // //   // ============================================
// // //   // WebView Navigation Handler
// // //   // ============================================
// // //   const handleWebViewNavigation = (navState: any) => {
// // //     const { url } = navState;
    
// // //     if (url.includes('payment-success')) {
// // //       setShowWebView(false);
// // //       clearCart();
// // //       Alert.alert(
// // //         '✅ Payment Successful!',
// // //         'Your order has been placed successfully.',
// // //         [
// // //           {
// // //             text: 'View Order',
// // //             onPress: () => navigation.replace('Orders'),
// // //           },
// // //           {
// // //             text: 'Track Order',
// // //             onPress: () => navigation.replace('OrderTracking', { orderId }),
// // //           },
// // //         ]
// // //       );
// // //     }
    
// // //     if (url.includes('payment-failed')) {
// // //       setShowWebView(false);
// // //       Alert.alert(
// // //         'Payment Failed',
// // //         'Your payment was not successful. Please try again.'
// // //       );
// // //     }
// // //   };

// // //   // ============================================
// // //   // HANDLE CASH ON DELIVERY
// // //   // ============================================
// // //   const handleCashOnDelivery = () => {
// // //     Alert.alert(
// // //       'Confirm Order',
// // //       `Total Amount: ₹${totalAmount}\n\nYou will pay when the order arrives.`,
// // //       [
// // //         { text: 'Cancel', style: 'cancel' },
// // //         {
// // //           text: 'Place Order',
// // //           onPress: () => {
// // //             clearCart();
// // //             navigation.replace('OrderSuccess', {
// // //               orderId,
// // //               totalAmount,
// // //               paymentMethod: 'Cash on Delivery',
// // //             });
// // //           },
// // //         },
// // //       ]
// // //     );
// // //   };

// // //   // ============================================
// // //   // HANDLE WALLET PAYMENT
// // //   // ============================================
// // //   const handleWalletPayment = () => {
// // //     const walletBalance = 2500;
// // //     if (totalAmount > walletBalance) {
// // //       Alert.alert(
// // //         'Insufficient Balance',
// // //         `Wallet balance: ₹${walletBalance}\nAmount needed: ₹${totalAmount}\n\nPlease add money to your wallet.`
// // //       );
// // //       return;
// // //     }

// // //     Alert.alert(
// // //       'Confirm Payment',
// // //       `Pay ₹${totalAmount} from your wallet?`,
// // //       [
// // //         { text: 'Cancel', style: 'cancel' },
// // //         {
// // //           text: 'Pay Now',
// // //           onPress: () => {
// // //             setLoading(true);
// // //             setTimeout(() => {
// // //               setLoading(false);
// // //               clearCart();
// // //               navigation.replace('OrderSuccess', {
// // //                 orderId,
// // //                 totalAmount,
// // //                 paymentMethod: 'QuickBite Wallet',
// // //               });
// // //             }, 2000);
// // //           },
// // //         },
// // //       ]
// // //     );
// // //   };

// // //   // ============================================
// // //   // HANDLE PAYMENT SELECTION
// // //   // ============================================
// // //   const handlePaymentSelect = (methodId: string) => {
// // //     setSelectedMethod(methodId);

// // //     switch (methodId) {
// // //       case 'razorpay':
// // //         handleRazorpayPayment();
// // //         break;
// // //       case 'cash':
// // //         handleCashOnDelivery();
// // //         break;
// // //       case 'wallet':
// // //         handleWalletPayment();
// // //         break;
// // //       default:
// // //         break;
// // //     }
// // //   };

// // //   // 🔥 If no amount
// // //   if (!totalAmount || totalAmount === 0) {
// // //     return (
// // //       <SafeAreaView style={[styles.container, styles.centerContent]}>
// // //         <Icon name="alert-circle-outline" size={60} color="#dc3545" />
// // //         <Text style={styles.errorText}>No amount specified</Text>
// // //         <TouchableOpacity style={styles.goBackButton} onPress={() => navigation.goBack()}>
// // //           <Text style={styles.goBackButtonText}>Go Back</Text>
// // //         </TouchableOpacity>
// // //       </SafeAreaView>
// // //     );
// // //   }

// // //   // 🔥 Show WebView
// // //   if (showWebView) {
// // //     return (
// // //       <SafeAreaView style={styles.container}>
// // //         <View style={styles.webViewHeader}>
// // //           <TouchableOpacity onPress={() => setShowWebView(false)}>
// // //             <Icon name="close" size={24} color="#282c3f" />
// // //           </TouchableOpacity>
// // //           <Text style={styles.webViewTitle}>Secure Payment</Text>
// // //           <View style={{ width: 24 }} />
// // //         </View>
// // //         <WebView
// // //           source={{ uri: webViewUrl }}
// // //           onNavigationStateChange={handleWebViewNavigation}
// // //           javaScriptEnabled={true}
// // //           domStorageEnabled={true}
// // //           startInLoadingState={true}
// // //           renderLoading={() => (
// // //             <View style={styles.webViewLoading}>
// // //               <ActivityIndicator size="large" color="#fc8019" />
// // //               <Text style={styles.webViewLoadingText}>Loading Payment...</Text>
// // //             </View>
// // //           )}
// // //         />
// // //       </SafeAreaView>
// // //     );
// // //   }

// // //   return (
// // //     <SafeAreaView style={styles.container}>
// // //       <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

// // //       {/* Header */}
// // //       <View style={styles.header}>
// // //         <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
// // //           <Icon name="arrow-back" size={24} color="#282c3f" />
// // //         </TouchableOpacity>
// // //         <Text style={styles.headerTitle}>Payment</Text>
// // //         <TouchableOpacity onPress={() => Alert.alert('Help', 'Payment help & support')}>
// // //           <Icon name="help-circle-outline" size={24} color="#282c3f" />
// // //         </TouchableOpacity>
// // //       </View>

// // //       <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
// // //         {/* Amount Card */}
// // //         <View style={styles.amountCard}>
// // //           <View style={styles.amountRow}>
// // //             <Text style={styles.amountLabel}>Amount to Pay</Text>
// // //             <View style={styles.secureBadgeSmall}>
// // //               <Icon name="lock-closed" size={12} color="#ffffff" />
// // //               <Text style={styles.secureBadgeSmallText}>Secure</Text>
// // //             </View>
// // //           </View>
// // //           <Text style={styles.amountValue}>₹{totalAmount}</Text>
// // //           <Text style={styles.amountSubtext}>Including all taxes & fees</Text>
// // //         </View>

// // //         {/* Payment Methods - Clean Professional UI */}
// // //         <Text style={styles.sectionTitle}>Choose Payment Method</Text>

// // //         {paymentMethods.map((method) => (
// // //           <TouchableOpacity
// // //             key={method.id}
// // //             style={[
// // //               styles.methodItem,
// // //               selectedMethod === method.id && styles.methodSelected,
// // //             ]}
// // //             onPress={() => handlePaymentSelect(method.id)}
// // //             disabled={loading}
// // //           >
// // //             <View style={styles.methodLeft}>
// // //               <View style={[styles.methodIcon, { backgroundColor: method.bg }]}>
// // //                 <Icon name={method.icon} size={22} color={method.color} />
// // //               </View>
// // //               <View style={styles.methodInfo}>
// // //                 <View style={styles.methodNameRow}>
// // //                   <Text style={[
// // //                     styles.methodName,
// // //                     selectedMethod === method.id && styles.methodNameSelected,
// // //                   ]}>
// // //                     {method.name}
// // //                   </Text>
// // //                   {method.badge && (
// // //                     <View style={styles.badgeContainer}>
// // //                       <Text style={styles.badgeText}>{method.badge}</Text>
// // //                     </View>
// // //                   )}
// // //                 </View>
// // //                 <Text style={styles.methodDescription}>{method.description}</Text>
// // //               </View>
// // //             </View>
// // //             {selectedMethod === method.id && (
// // //               <View style={styles.checkmark}>
// // //                 <Icon name="checkmark-circle" size={24} color="#fc8019" />
// // //               </View>
// // //             )}
// // //           </TouchableOpacity>
// // //         ))}

// // //         {/* What's included in Razorpay */}
// // //         <View style={styles.infoBox}>
// // //           <Icon name="information-circle-outline" size={18} color="#fc8019" />
// // //           <Text style={styles.infoText}>
// // //             Razorpay supports all payment methods: UPI, Cards, Net Banking, and more
// // //           </Text>
// // //         </View>

// // //         {/* Order Summary */}
// // //         <View style={styles.summaryCard}>
// // //           <Text style={styles.summaryTitle}>Order Summary</Text>
// // //           <View style={styles.summaryRow}>
// // //             <Text style={styles.summaryLabel}>Item Total</Text>
// // //             <Text style={styles.summaryValue}>₹{totalAmount}</Text>
// // //           </View>
// // //           <View style={styles.summaryRow}>
// // //             <Text style={styles.summaryLabel}>Delivery Fee</Text>
// // //             <Text style={styles.summaryValue}>₹0</Text>
// // //           </View>
// // //           <View style={styles.summaryRow}>
// // //             <Text style={styles.summaryLabel}>Platform Fee</Text>
// // //             <Text style={styles.summaryValue}>₹0</Text>
// // //           </View>
// // //           <View style={styles.summaryDivider} />
// // //           <View style={styles.summaryRow}>
// // //             <Text style={styles.summaryTotalLabel}>Total</Text>
// // //             <Text style={styles.summaryTotalValue}>₹{totalAmount}</Text>
// // //           </View>
// // //         </View>

// // //         {/* Secure Payment Badge */}
// // //         <View style={styles.secureBadge}>
// // //           <Icon name="shield-checkmark-outline" size={18} color="#28a745" />
// // //           <Text style={styles.secureBadgeText}>Your payment is secure and encrypted</Text>
// // //         </View>

// // //         {/* Footer Spacer */}
// // //         <View style={styles.footerSpacer} />
// // //       </ScrollView>

// // //       {/* Loading Overlay */}
// // //       {loading && (
// // //         <View style={styles.loadingOverlay}>
// // //           <View style={styles.loadingContainer}>
// // //             <ActivityIndicator size="large" color="#fc8019" />
// // //             <Text style={styles.loadingText}>Processing Payment...</Text>
// // //             <Text style={styles.loadingSubtext}>Please wait, do not close the app</Text>
// // //           </View>
// // //         </View>
// // //       )}
// // //     </SafeAreaView>
// // //   );
// // // };

// // // const styles = StyleSheet.create({
// // //   container: {
// // //     flex: 1,
// // //     backgroundColor: '#f8f9fa',
// // //   },
// // //   centerContent: {
// // //     justifyContent: 'center',
// // //     alignItems: 'center',
// // //     padding: 20,
// // //     flex: 1,
// // //   },
// // //   errorText: {
// // //     fontSize: 18,
// // //     fontWeight: '600',
// // //     color: '#282c3f',
// // //     marginTop: 16,
// // //   },
// // //   goBackButton: {
// // //     backgroundColor: '#fc8019',
// // //     paddingHorizontal: 32,
// // //     paddingVertical: 12,
// // //     borderRadius: 8,
// // //     marginTop: 16,
// // //   },
// // //   goBackButtonText: {
// // //     color: '#ffffff',
// // //     fontSize: 16,
// // //     fontWeight: '600',
// // //   },

// // //   // Header
// // //   header: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     justifyContent: 'space-between',
// // //     paddingHorizontal: 16,
// // //     paddingTop: 12,
// // //     paddingBottom: 16,
// // //     backgroundColor: '#ffffff',
// // //     borderBottomWidth: 1,
// // //     borderBottomColor: '#f0f0f5',
// // //   },
// // //   backButton: {
// // //     padding: 4,
// // //   },
// // //   headerTitle: {
// // //     fontSize: 18,
// // //     fontWeight: '600',
// // //     color: '#282c3f',
// // //   },
// // //   scrollContent: {
// // //     paddingBottom: 30,
// // //   },

// // //   // WebView
// // //   webViewHeader: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     justifyContent: 'space-between',
// // //     paddingHorizontal: 16,
// // //     paddingTop: 12,
// // //     paddingBottom: 16,
// // //     backgroundColor: '#ffffff',
// // //     borderBottomWidth: 1,
// // //     borderBottomColor: '#f0f0f5',
// // //   },
// // //   webViewTitle: {
// // //     fontSize: 18,
// // //     fontWeight: '600',
// // //     color: '#282c3f',
// // //   },
// // //   webViewLoading: {
// // //     flex: 1,
// // //     justifyContent: 'center',
// // //     alignItems: 'center',
// // //     backgroundColor: '#ffffff',
// // //   },
// // //   webViewLoadingText: {
// // //     fontSize: 16,
// // //     color: '#7e808c',
// // //     marginTop: 12,
// // //   },

// // //   // Amount Card
// // //   amountCard: {
// // //     backgroundColor: '#fc8019',
// // //     marginHorizontal: 16,
// // //     marginTop: 16,
// // //     padding: 20,
// // //     borderRadius: 16,
// // //     shadowColor: '#fc8019',
// // //     shadowOffset: { width: 0, height: 4 },
// // //     shadowOpacity: 0.3,
// // //     shadowRadius: 8,
// // //     elevation: 6,
// // //   },
// // //   amountRow: {
// // //     flexDirection: 'row',
// // //     justifyContent: 'space-between',
// // //     alignItems: 'center',
// // //   },
// // //   amountLabel: {
// // //     fontSize: 14,
// // //     color: '#ffffff',
// // //     opacity: 0.9,
// // //     fontWeight: '500',
// // //   },
// // //   amountValue: {
// // //     fontSize: 36,
// // //     fontWeight: '700',
// // //     color: '#ffffff',
// // //     marginTop: 4,
// // //   },
// // //   amountSubtext: {
// // //     fontSize: 12,
// // //     color: '#ffffff',
// // //     opacity: 0.7,
// // //     marginTop: 4,
// // //   },
// // //   secureBadgeSmall: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     backgroundColor: 'rgba(255,255,255,0.2)',
// // //     paddingHorizontal: 10,
// // //     paddingVertical: 4,
// // //     borderRadius: 12,
// // //   },
// // //   secureBadgeSmallText: {
// // //     fontSize: 11,
// // //     color: '#ffffff',
// // //     marginLeft: 4,
// // //     fontWeight: '500',
// // //   },

// // //   // Section
// // //   sectionTitle: {
// // //     fontSize: 16,
// // //     fontWeight: '600',
// // //     color: '#282c3f',
// // //     marginHorizontal: 16,
// // //     marginTop: 24,
// // //     marginBottom: 12,
// // //   },

// // //   // Payment Methods
// // //   methodItem: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     justifyContent: 'space-between',
// // //     backgroundColor: '#ffffff',
// // //     marginHorizontal: 16,
// // //     marginBottom: 8,
// // //     padding: 14,
// // //     borderRadius: 12,
// // //     borderWidth: 1,
// // //     borderColor: '#f0f0f5',
// // //   },
// // //   methodSelected: {
// // //     borderColor: '#fc8019',
// // //     backgroundColor: '#fff5ec',
// // //   },
// // //   methodLeft: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     flex: 1,
// // //   },
// // //   methodIcon: {
// // //     width: 44,
// // //     height: 44,
// // //     borderRadius: 22,
// // //     justifyContent: 'center',
// // //     alignItems: 'center',
// // //     marginRight: 14,
// // //   },
// // //   methodInfo: {
// // //     flex: 1,
// // //   },
// // //   methodNameRow: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //   },
// // //   methodName: {
// // //     fontSize: 15,
// // //     fontWeight: '500',
// // //     color: '#282c3f',
// // //   },
// // //   methodNameSelected: {
// // //     color: '#fc8019',
// // //   },
// // //   methodDescription: {
// // //     fontSize: 12,
// // //     color: '#7e808c',
// // //     marginTop: 2,
// // //   },
// // //   badgeContainer: {
// // //     backgroundColor: '#fc8019',
// // //     paddingHorizontal: 8,
// // //     paddingVertical: 2,
// // //     borderRadius: 10,
// // //     marginLeft: 8,
// // //   },
// // //   badgeText: {
// // //     fontSize: 9,
// // //     color: '#ffffff',
// // //     fontWeight: '600',
// // //   },
// // //   checkmark: {
// // //     marginLeft: 8,
// // //   },

// // //   // Info Box
// // //   infoBox: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     backgroundColor: '#fff5ec',
// // //     marginHorizontal: 16,
// // //     marginTop: 8,
// // //     padding: 12,
// // //     borderRadius: 10,
// // //     borderWidth: 1,
// // //     borderColor: '#fc8019',
// // //   },
// // //   infoText: {
// // //     fontSize: 12,
// // //     color: '#7e808c',
// // //     marginLeft: 8,
// // //     flex: 1,
// // //   },

// // //   // Order Summary
// // //   summaryCard: {
// // //     backgroundColor: '#ffffff',
// // //     marginHorizontal: 16,
// // //     marginTop: 16,
// // //     padding: 16,
// // //     borderRadius: 12,
// // //     borderWidth: 1,
// // //     borderColor: '#f0f0f5',
// // //   },
// // //   summaryTitle: {
// // //     fontSize: 14,
// // //     fontWeight: '600',
// // //     color: '#282c3f',
// // //     marginBottom: 12,
// // //   },
// // //   summaryRow: {
// // //     flexDirection: 'row',
// // //     justifyContent: 'space-between',
// // //     paddingVertical: 4,
// // //   },
// // //   summaryLabel: {
// // //     fontSize: 13,
// // //     color: '#7e808c',
// // //   },
// // //   summaryValue: {
// // //     fontSize: 13,
// // //     color: '#282c3f',
// // //   },
// // //   summaryDivider: {
// // //     height: 1,
// // //     backgroundColor: '#f0f0f5',
// // //     marginVertical: 8,
// // //   },
// // //   summaryTotalLabel: {
// // //     fontSize: 15,
// // //     fontWeight: '600',
// // //     color: '#282c3f',
// // //   },
// // //   summaryTotalValue: {
// // //     fontSize: 15,
// // //     fontWeight: '700',
// // //     color: '#fc8019',
// // //   },

// // //   // Secure Badge
// // //   secureBadge: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     justifyContent: 'center',
// // //     marginHorizontal: 16,
// // //     marginTop: 20,
// // //     padding: 12,
// // //     backgroundColor: '#d4edda',
// // //     borderRadius: 8,
// // //   },
// // //   secureBadgeText: {
// // //     fontSize: 13,
// // //     color: '#155724',
// // //     marginLeft: 8,
// // //   },
// // //   footerSpacer: {
// // //     height: 20,
// // //   },

// // //   // Loading
// // //   loadingOverlay: {
// // //     position: 'absolute',
// // //     top: 0,
// // //     left: 0,
// // //     right: 0,
// // //     bottom: 0,
// // //     backgroundColor: 'rgba(0,0,0,0.7)',
// // //     justifyContent: 'center',
// // //     alignItems: 'center',
// // //   },
// // //   loadingContainer: {
// // //     backgroundColor: '#ffffff',
// // //     padding: 30,
// // //     borderRadius: 16,
// // //     alignItems: 'center',
// // //     minWidth: 200,
// // //   },
// // //   loadingText: {
// // //     fontSize: 16,
// // //     fontWeight: '600',
// // //     color: '#282c3f',
// // //     marginTop: 12,
// // //   },
// // //   loadingSubtext: {
// // //     fontSize: 12,
// // //     color: '#7e808c',
// // //     marginTop: 4,
// // //   },
// // // });

// // // export default PaymentScreen;
// // // delivery-app/src/screens/PaymentScreen.tsx
// // import React, { useState, useContext } from 'react';
// // import {
// //   View,
// //   Text,
// //   ScrollView,
// //   TouchableOpacity,
// //   StyleSheet,
// //   SafeAreaView,
// //   StatusBar,
// //   Alert,
// //   ActivityIndicator,
// //   Modal,
// //   Dimensions,
// //   Linking,
// //   Platform,
// // } from 'react-native';
// // import Icon from 'react-native-vector-icons/Ionicons';
// // import { WebView } from 'react-native-webview';
// // import { AuthContext } from '../../context/AuthContext';
// // import { CartContext } from '../../context/CartContext';
// // import { paymentService } from '../../services/paymentService';

// // const { width, height } = Dimensions.get('window');

// // interface PaymentScreenProps {
// //   navigation: any;
// //   route: any;
// // }

// // const PaymentScreen: React.FC<PaymentScreenProps> = ({ navigation, route }) => {
// //   const { totalAmount, orderId } = route.params || {};
// //   const { user } = useContext(AuthContext);
// //   const { clearCart } = useContext(CartContext);

// //   const [selectedMethod, setSelectedMethod] = useState<string>('razorpay');
// //   const [loading, setLoading] = useState<boolean>(false);
// //   const [showWebView, setShowWebView] = useState<boolean>(false);
// //   const [webViewUrl, setWebViewUrl] = useState<string>('');
// //   const [webViewError, setWebViewError] = useState<string>('');

// //   // 🔥 REAL APP PAYMENT METHODS
// //   const paymentMethods = [
// //     {
// //       id: 'razorpay',
// //       icon: 'phone-portrait-outline',
// //       name: 'Razorpay',
// //       description: 'UPI, Cards, Net Banking • Instant',
// //       color: '#fc8019',
// //       bg: '#fff5ec',
// //       badge: 'Popular',
// //     },
// //     {
// //       id: 'wallet',
// //       icon: 'wallet-outline',
// //       name: 'QuickBite Wallet',
// //       description: `Balance: ₹2,500 • Instant`,
// //       color: '#28a745',
// //       bg: '#d4edda',
// //     },
// //     {
// //       id: 'cash',
// //       icon: 'cash-outline',
// //       name: 'Cash on Delivery',
// //       description: 'Pay when you receive • No extra charge',
// //       color: '#fd7e14',
// //       bg: '#fff3cd',
// //     },
// //   ];

// //   // ============================================
// //   // HANDLE RAZORPAY PAYMENT
// //   // ============================================
// //   const handleRazorpayPayment = async () => {
// //     try {
// //       setLoading(true);
// //       console.log('🔄 Step 1: Creating Razorpay order...');

// //       // Create Razorpay Order
// //       const orderData = await paymentService.createRazorpayOrder(totalAmount, orderId);
      
// //       console.log('📦 Step 2: Order created:', orderData);

// //       if (!orderData.success) {
// //         Alert.alert('Error', orderData.message || 'Failed to create order');
// //         setLoading(false);
// //         return;
// //       }const handleRazorpayPayment = async () => {


// //       const { order, key } = orderData;

// //       // Build payment URL
// //       const paymentUrl = `http://localhost:3000/payment/checkout?order_id=${order.id}&amount=${order.amount}&key=${key}`;
      
// //       console.log('🔗 Step 3: Opening WebView with URL:', paymentUrl);
      
// //       setWebViewUrl(paymentUrl);
// //       setShowWebView(true);
// //       setLoading(false);

// //     } catch (error: any) {
// //       console.error('❌ Payment error:', error);
// //       Alert.alert(
// //         'Payment Error',
// //         error.message || 'Something went wrong. Please try again.'
// //       );
// //       setLoading(false);
// //     }
// //   };

// //   // ============================================
// //   // WebView Navigation Handler
// //   // ============================================
// //   const handleWebViewNavigation = (navState: any) => {
// //     const { url, loading, title } = navState;
// //     console.log('🌐 WebView navigation:', { url, loading, title });
    
// //     if (url.includes('payment-success')) {
// //       console.log('✅ Payment success detected!');
// //       setShowWebView(false);
// //       clearCart();
// //       Alert.alert(
// //         '✅ Payment Successful!',
// //         'Your order has been placed successfully.',
// //         [
// //           {
// //             text: 'View Order',
// //             onPress: () => navigation.replace('Orders'),
// //           },
// //           {
// //             text: 'Track Order',
// //             onPress: () => navigation.replace('OrderTracking', { orderId }),
// //           },
// //         ]
// //       );
// //     }
    
// //     if (url.includes('payment-failed')) {
// //       console.log('❌ Payment failed detected!');
// //       setShowWebView(false);
// //       Alert.alert(
// //         'Payment Failed',
// //         'Your payment was not successful. Please try again.'
// //       );
// //     }
// //   };

// //   // ============================================
// //   // WebView Error Handler
// //   // ============================================
// //   const handleWebViewError = (error: any) => {
// //     console.error('❌ WebView error:', error);
// //     setWebViewError(error.nativeEvent?.description || 'Failed to load payment page');
// //     Alert.alert(
// //       'Payment Error',
// //       'Could not load payment page. Please check your internet connection.',
// //       [
// //         { 
// //           text: 'Retry', 
// //           onPress: () => {
// //             setWebViewError('');
// //             setShowWebView(false);
// //             setTimeout(() => {
// //               handleRazorpayPayment();
// //             }, 500);
// //           }
// //         },
// //         { text: 'Cancel', style: 'cancel' }
// //       ]
// //     );
// //   };

// //   // ============================================
// //   // HANDLE CASH ON DELIVERY
// //   // ============================================
// //   const handleCashOnDelivery = () => {
// //     Alert.alert(
// //       'Confirm Order',
// //       `Total Amount: ₹${totalAmount}\n\nYou will pay when the order arrives.`,
// //       [
// //         { text: 'Cancel', style: 'cancel' },
// //         {
// //           text: 'Place Order',
// //           onPress: () => {
// //             clearCart();
// //             navigation.replace('OrderSuccess', {
// //               orderId,
// //               totalAmount,
// //               paymentMethod: 'Cash on Delivery',
// //             });
// //           },
// //         },
// //       ]
// //     );
// //   };

// //   // ============================================
// //   // HANDLE WALLET PAYMENT
// //   // ============================================
// //   const handleWalletPayment = () => {
// //     const walletBalance = 2500;
// //     if (totalAmount > walletBalance) {
// //       Alert.alert(
// //         'Insufficient Balance',
// //         `Wallet balance: ₹${walletBalance}\nAmount needed: ₹${totalAmount}\n\nPlease add money to your wallet.`
// //       );
// //       return;
// //     }

// //     Alert.alert(
// //       'Confirm Payment',
// //       `Pay ₹${totalAmount} from your wallet?`,
// //       [
// //         { text: 'Cancel', style: 'cancel' },
// //         {
// //           text: 'Pay Now',
// //           onPress: () => {
// //             setLoading(true);
// //             setTimeout(() => {
// //               setLoading(false);
// //               clearCart();
// //               navigation.replace('OrderSuccess', {
// //                 orderId,
// //                 totalAmount,
// //                 paymentMethod: 'QuickBite Wallet',
// //               });
// //             }, 2000);
// //           },
// //         },
// //       ]
// //     );
// //   };

// //   // ============================================
// //   // HANDLE PAYMENT SELECTION
// //   // ============================================
// //   const handlePaymentSelect = (methodId: string) => {
// //     console.log('🔄 Payment method selected:', methodId);
// //     setSelectedMethod(methodId);

// //     switch (methodId) {
// //       case 'razorpay':
// //         handleRazorpayPayment();
// //         break;
// //       case 'cash':
// //         handleCashOnDelivery();
// //         break;
// //       case 'wallet':
// //         handleWalletPayment();
// //         break;
// //       default:
// //         break;
// //     }
// //   };

// //   // 🔥 If no amount
// //   if (!totalAmount || totalAmount === 0) {
// //     return (
// //       <SafeAreaView style={[styles.container, styles.centerContent]}>
// //         <Icon name="alert-circle-outline" size={60} color="#dc3545" />
// //         <Text style={styles.errorText}>No amount specified</Text>
// //         <TouchableOpacity style={styles.goBackButton} onPress={() => navigation.goBack()}>
// //           <Text style={styles.goBackButtonText}>Go Back</Text>
// //         </TouchableOpacity>
// //       </SafeAreaView>
// //     );
// //   }

// //   // 🔥 Show WebView
// //   if (showWebView) {
// //     return (
// //       <SafeAreaView style={styles.container}>
// //         <View style={styles.webViewHeader}>
// //           <TouchableOpacity onPress={() => setShowWebView(false)}>
// //             <Icon name="close" size={24} color="#282c3f" />
// //           </TouchableOpacity>
// //           <Text style={styles.webViewTitle}>Secure Payment</Text>
// //           <TouchableOpacity onPress={() => {
// //             setShowWebView(false);
// //             Alert.alert('Refresh', 'Reloading payment page...');
// //             setTimeout(() => {
// //               setShowWebView(true);
// //             }, 500);
// //           }}>
// //             <Icon name="refresh-outline" size={24} color="#282c3f" />
// //           </TouchableOpacity>
// //         </View>
// //         {webViewError ? (
// //           <View style={styles.webViewError}>
// //             <Icon name="alert-circle-outline" size={50} color="#dc3545" />
// //             <Text style={styles.webViewErrorText}>{webViewError}</Text>
// //             <TouchableOpacity 
// //               style={styles.webViewRetryButton}
// //               onPress={() => {
// //                 setWebViewError('');
// //                 setShowWebView(false);
// //                 setTimeout(() => handleRazorpayPayment(), 500);
// //               }}
// //             >
// //               <Text style={styles.webViewRetryButtonText}>Retry</Text>
// //             </TouchableOpacity>
// //           </View>
// //         ) : (
// //           <WebView
// //             source={{ uri: webViewUrl }}
// //             onNavigationStateChange={handleWebViewNavigation}
// //             onError={handleWebViewError}
// //             onHttpError={(syntheticEvent) => {
// //               const { nativeEvent } = syntheticEvent;
// //               console.error('HTTP Error:', nativeEvent);
// //               handleWebViewError(nativeEvent);
// //             }}
// //             javaScriptEnabled={true}
// //             domStorageEnabled={true}
// //             startInLoadingState={true}
// //             renderLoading={() => (
// //               <View style={styles.webViewLoading}>
// //                 <ActivityIndicator size="large" color="#fc8019" />
// //                 <Text style={styles.webViewLoadingText}>Loading Payment...</Text>
// //               </View>
// //             )}
// //             renderError={(error) => (
// //               <View style={styles.webViewError}>
// //                 <Icon name="alert-circle-outline" size={50} color="#dc3545" />
// //                 <Text style={styles.webViewErrorText}>Failed to load payment page</Text>
// //                 <TouchableOpacity 
// //                   style={styles.webViewRetryButton}
// //                   onPress={() => {
// //                     setShowWebView(false);
// //                     setTimeout(() => setShowWebView(true), 500);
// //                   }}
// //                 >
// //                   <Text style={styles.webViewRetryButtonText}>Retry</Text>
// //                 </TouchableOpacity>
// //               </View>
// //             )}
// //           />
// //         )}
// //       </SafeAreaView>
// //     );
// //   }

// //   return (
// //     <SafeAreaView style={styles.container}>
// //       <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

// //       {/* Header */}
// //       <View style={styles.header}>
// //         <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
// //           <Icon name="arrow-back" size={24} color="#282c3f" />
// //         </TouchableOpacity>
// //         <Text style={styles.headerTitle}>Payment</Text>
// //         <TouchableOpacity onPress={() => Alert.alert('Help', 'Payment help & support')}>
// //           <Icon name="help-circle-outline" size={24} color="#282c3f" />
// //         </TouchableOpacity>
// //       </View>

// //       <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
// //         {/* Amount Card */}
// //         <View style={styles.amountCard}>
// //           <View style={styles.amountRow}>
// //             <Text style={styles.amountLabel}>Amount to Pay</Text>
// //             <View style={styles.secureBadgeSmall}>
// //               <Icon name="lock-closed" size={12} color="#ffffff" />
// //               <Text style={styles.secureBadgeSmallText}>Secure</Text>
// //             </View>
// //           </View>
// //           <Text style={styles.amountValue}>₹{totalAmount}</Text>
// //           <Text style={styles.amountSubtext}>Including all taxes & fees</Text>
// //         </View>

// //         {/* Payment Methods */}
// //         <Text style={styles.sectionTitle}>Choose Payment Method</Text>

// //         {paymentMethods.map((method) => (
// //           <TouchableOpacity
// //             key={method.id}
// //             style={[
// //               styles.methodItem,
// //               selectedMethod === method.id && styles.methodSelected,
// //             ]}
// //             onPress={() => handlePaymentSelect(method.id)}
// //             disabled={loading}
// //           >
// //             <View style={styles.methodLeft}>
// //               <View style={[styles.methodIcon, { backgroundColor: method.bg }]}>
// //                 <Icon name={method.icon} size={22} color={method.color} />
// //               </View>
// //               <View style={styles.methodInfo}>
// //                 <View style={styles.methodNameRow}>
// //                   <Text style={[
// //                     styles.methodName,
// //                     selectedMethod === method.id && styles.methodNameSelected,
// //                   ]}>
// //                     {method.name}
// //                   </Text>
// //                   {method.badge && (
// //                     <View style={styles.badgeContainer}>
// //                       <Text style={styles.badgeText}>{method.badge}</Text>
// //                     </View>
// //                   )}
// //                 </View>
// //                 <Text style={styles.methodDescription}>{method.description}</Text>
// //               </View>
// //             </View>
// //             {selectedMethod === method.id && (
// //               <View style={styles.checkmark}>
// //                 <Icon name="checkmark-circle" size={24} color="#fc8019" />
// //               </View>
// //             )}
// //           </TouchableOpacity>
// //         ))}

// //         {/* Info Box */}
// //         <View style={styles.infoBox}>
// //           <Icon name="information-circle-outline" size={18} color="#fc8019" />
// //           <Text style={styles.infoText}>
// //             Razorpay supports all payment methods: UPI, Cards, Net Banking, and more
// //           </Text>
// //         </View>

// //         {/* Order Summary */}
// //         <View style={styles.summaryCard}>
// //           <Text style={styles.summaryTitle}>Order Summary</Text>
// //           <View style={styles.summaryRow}>
// //             <Text style={styles.summaryLabel}>Item Total</Text>
// //             <Text style={styles.summaryValue}>₹{totalAmount}</Text>
// //           </View>
// //           <View style={styles.summaryRow}>
// //             <Text style={styles.summaryLabel}>Delivery Fee</Text>
// //             <Text style={styles.summaryValue}>₹0</Text>
// //           </View>
// //           <View style={styles.summaryRow}>
// //             <Text style={styles.summaryLabel}>Platform Fee</Text>
// //             <Text style={styles.summaryValue}>₹0</Text>
// //           </View>
// //           <View style={styles.summaryDivider} />
// //           <View style={styles.summaryRow}>
// //             <Text style={styles.summaryTotalLabel}>Total</Text>
// //             <Text style={styles.summaryTotalValue}>₹{totalAmount}</Text>
// //           </View>
// //         </View>

// //         {/* Secure Payment Badge */}
// //         <View style={styles.secureBadge}>
// //           <Icon name="shield-checkmark-outline" size={18} color="#28a745" />
// //           <Text style={styles.secureBadgeText}>Your payment is secure and encrypted</Text>
// //         </View>

// //         <View style={styles.footerSpacer} />
// //       </ScrollView>

// //       {/* Loading Overlay */}
// //       {loading && (
// //         <View style={styles.loadingOverlay}>
// //           <View style={styles.loadingContainer}>
// //             <ActivityIndicator size="large" color="#fc8019" />
// //             <Text style={styles.loadingText}>Processing Payment...</Text>
// //             <Text style={styles.loadingSubtext}>Please wait, do not close the app</Text>
// //           </View>
// //         </View>
// //       )}
// //     </SafeAreaView>
// //   );
// // };

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     backgroundColor: '#f8f9fa',
// //   },
// //   centerContent: {
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     padding: 20,
// //     flex: 1,
// //   },
// //   errorText: {
// //     fontSize: 18,
// //     fontWeight: '600',
// //     color: '#282c3f',
// //     marginTop: 16,
// //   },
// //   goBackButton: {
// //     backgroundColor: '#fc8019',
// //     paddingHorizontal: 32,
// //     paddingVertical: 12,
// //     borderRadius: 8,
// //     marginTop: 16,
// //   },
// //   goBackButtonText: {
// //     color: '#ffffff',
// //     fontSize: 16,
// //     fontWeight: '600',
// //   },

// //   // Header
// //   header: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     justifyContent: 'space-between',
// //     paddingHorizontal: 16,
// //     paddingTop: 12,
// //     paddingBottom: 16,
// //     backgroundColor: '#ffffff',
// //     borderBottomWidth: 1,
// //     borderBottomColor: '#f0f0f5',
// //   },
// //   backButton: {
// //     padding: 4,
// //   },
// //   headerTitle: {
// //     fontSize: 18,
// //     fontWeight: '600',
// //     color: '#282c3f',
// //   },
// //   scrollContent: {
// //     paddingBottom: 30,
// //   },

// //   // WebView
// //   webViewHeader: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     justifyContent: 'space-between',
// //     paddingHorizontal: 16,
// //     paddingTop: 12,
// //     paddingBottom: 16,
// //     backgroundColor: '#ffffff',
// //     borderBottomWidth: 1,
// //     borderBottomColor: '#f0f0f5',
// //   },
// //   webViewTitle: {
// //     fontSize: 18,
// //     fontWeight: '600',
// //     color: '#282c3f',
// //   },
// //   webViewLoading: {
// //     flex: 1,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     backgroundColor: '#ffffff',
// //   },
// //   webViewLoadingText: {
// //     fontSize: 16,
// //     color: '#7e808c',
// //     marginTop: 12,
// //   },
// //   webViewError: {
// //     flex: 1,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     backgroundColor: '#ffffff',
// //     padding: 20,
// //   },
// //   webViewErrorText: {
// //     fontSize: 16,
// //     color: '#7e808c',
// //     marginTop: 12,
// //     textAlign: 'center',
// //   },
// //   webViewRetryButton: {
// //     backgroundColor: '#fc8019',
// //     paddingHorizontal: 30,
// //     paddingVertical: 12,
// //     borderRadius: 8,
// //     marginTop: 16,
// //   },
// //   webViewRetryButtonText: {
// //     color: '#ffffff',
// //     fontSize: 16,
// //     fontWeight: '600',
// //   },

// //   // Amount Card
// //   amountCard: {
// //     backgroundColor: '#fc8019',
// //     marginHorizontal: 16,
// //     marginTop: 16,
// //     padding: 20,
// //     borderRadius: 16,
// //     shadowColor: '#fc8019',
// //     shadowOffset: { width: 0, height: 4 },
// //     shadowOpacity: 0.3,
// //     shadowRadius: 8,
// //     elevation: 6,
// //   },
// //   amountRow: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     alignItems: 'center',
// //   },
// //   amountLabel: {
// //     fontSize: 14,
// //     color: '#ffffff',
// //     opacity: 0.9,
// //     fontWeight: '500',
// //   },
// //   amountValue: {
// //     fontSize: 36,
// //     fontWeight: '700',
// //     color: '#ffffff',
// //     marginTop: 4,
// //   },
// //   amountSubtext: {
// //     fontSize: 12,
// //     color: '#ffffff',
// //     opacity: 0.7,
// //     marginTop: 4,
// //   },
// //   secureBadgeSmall: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     backgroundColor: 'rgba(255,255,255,0.2)',
// //     paddingHorizontal: 10,
// //     paddingVertical: 4,
// //     borderRadius: 12,
// //   },
// //   secureBadgeSmallText: {
// //     fontSize: 11,
// //     color: '#ffffff',
// //     marginLeft: 4,
// //     fontWeight: '500',
// //   },

// //   // Section
// //   sectionTitle: {
// //     fontSize: 16,
// //     fontWeight: '600',
// //     color: '#282c3f',
// //     marginHorizontal: 16,
// //     marginTop: 24,
// //     marginBottom: 12,
// //   },

// //   // Payment Methods
// //   methodItem: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     justifyContent: 'space-between',
// //     backgroundColor: '#ffffff',
// //     marginHorizontal: 16,
// //     marginBottom: 8,
// //     padding: 14,
// //     borderRadius: 12,
// //     borderWidth: 1,
// //     borderColor: '#f0f0f5',
// //   },
// //   methodSelected: {
// //     borderColor: '#fc8019',
// //     backgroundColor: '#fff5ec',
// //   },
// //   methodLeft: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     flex: 1,
// //   },
// //   methodIcon: {
// //     width: 44,
// //     height: 44,
// //     borderRadius: 22,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     marginRight: 14,
// //   },
// //   methodInfo: {
// //     flex: 1,
// //   },
// //   methodNameRow: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //   },
// //   methodName: {
// //     fontSize: 15,
// //     fontWeight: '500',
// //     color: '#282c3f',
// //   },
// //   methodNameSelected: {
// //     color: '#fc8019',
// //   },
// //   methodDescription: {
// //     fontSize: 12,
// //     color: '#7e808c',
// //     marginTop: 2,
// //   },
// //   badgeContainer: {
// //     backgroundColor: '#fc8019',
// //     paddingHorizontal: 8,
// //     paddingVertical: 2,
// //     borderRadius: 10,
// //     marginLeft: 8,
// //   },
// //   badgeText: {
// //     fontSize: 9,
// //     color: '#ffffff',
// //     fontWeight: '600',
// //   },
// //   checkmark: {
// //     marginLeft: 8,
// //   },

// //   // Info Box
// //   infoBox: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     backgroundColor: '#fff5ec',
// //     marginHorizontal: 16,
// //     marginTop: 8,
// //     padding: 12,
// //     borderRadius: 10,
// //     borderWidth: 1,
// //     borderColor: '#fc8019',
// //   },
// //   infoText: {
// //     fontSize: 12,
// //     color: '#7e808c',
// //     marginLeft: 8,
// //     flex: 1,
// //   },

// //   // Order Summary
// //   summaryCard: {
// //     backgroundColor: '#ffffff',
// //     marginHorizontal: 16,
// //     marginTop: 16,
// //     padding: 16,
// //     borderRadius: 12,
// //     borderWidth: 1,
// //     borderColor: '#f0f0f5',
// //   },
// //   summaryTitle: {
// //     fontSize: 14,
// //     fontWeight: '600',
// //     color: '#282c3f',
// //     marginBottom: 12,
// //   },
// //   summaryRow: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     paddingVertical: 4,
// //   },
// //   summaryLabel: {
// //     fontSize: 13,
// //     color: '#7e808c',
// //   },
// //   summaryValue: {
// //     fontSize: 13,
// //     color: '#282c3f',
// //   },
// //   summaryDivider: {
// //     height: 1,
// //     backgroundColor: '#f0f0f5',
// //     marginVertical: 8,
// //   },
// //   summaryTotalLabel: {
// //     fontSize: 15,
// //     fontWeight: '600',
// //     color: '#282c3f',
// //   },
// //   summaryTotalValue: {
// //     fontSize: 15,
// //     fontWeight: '700',
// //     color: '#fc8019',
// //   },

// //   // Secure Badge
// //   secureBadge: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //     marginHorizontal: 16,
// //     marginTop: 20,
// //     padding: 12,
// //     backgroundColor: '#d4edda',
// //     borderRadius: 8,
// //   },
// //   secureBadgeText: {
// //     fontSize: 13,
// //     color: '#155724',
// //     marginLeft: 8,
// //   },
// //   footerSpacer: {
// //     height: 20,
// //   },

// //   // Loading
// //   loadingOverlay: {
// //     position: 'absolute',
// //     top: 0,
// //     left: 0,
// //     right: 0,
// //     bottom: 0,
// //     backgroundColor: 'rgba(0,0,0,0.7)',
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //   },
// //   loadingContainer: {
// //     backgroundColor: '#ffffff',
// //     padding: 30,
// //     borderRadius: 16,
// //     alignItems: 'center',
// //     minWidth: 200,
// //   },
// //   loadingText: {
// //     fontSize: 16,
// //     fontWeight: '600',
// //     color: '#282c3f',
// //     marginTop: 12,
// //   },
// //   loadingSubtext: {
// //     fontSize: 12,
// //     color: '#7e808c',
// //     marginTop: 4,
// //   },
// // });

// // export default PaymentScreen;
// // delivery-app/src/screens/PaymentScreen.tsx
// import React, { useState, useContext } from 'react';
// import {
//   View,
//   Text,
//   ScrollView,
//   TouchableOpacity,
//   StyleSheet,
//   SafeAreaView,
//   StatusBar,
//   Alert,
//   ActivityIndicator,
//   Modal,
//   Dimensions,
//   Linking,
//   Platform,
// } from 'react-native';
// import Icon from 'react-native-vector-icons/Ionicons';
// import { WebView } from 'react-native-webview';
// import { AuthContext } from '../../context/AuthContext';
// import { CartContext } from '../../context/CartContext';
// import { paymentService } from '../../services/paymentService';

// const { width, height } = Dimensions.get('window');

// interface PaymentScreenProps {
//   navigation: any;
//   route: any;
// }

// const PaymentScreen: React.FC<PaymentScreenProps> = ({ navigation, route }) => {
//   const { totalAmount, orderId } = route.params || {};
//   const { user } = useContext(AuthContext);
//   const { clearCart } = useContext(CartContext);

//   const [selectedMethod, setSelectedMethod] = useState<string>('razorpay');
//   const [loading, setLoading] = useState<boolean>(false);
//   const [showWebView, setShowWebView] = useState<boolean>(false);
//   const [webViewUrl, setWebViewUrl] = useState<string>('');
//   const [webViewError, setWebViewError] = useState<string>('');

//   // 🔥 REAL APP PAYMENT METHODS
//   const paymentMethods = [
//     {
//       id: 'razorpay',
//       icon: 'phone-portrait-outline',
//       name: 'Razorpay',
//       description: 'UPI, Cards, Net Banking • Instant',
//       color: '#fc8019',
//       bg: '#fff5ec',
//       badge: 'Popular',
//     },
//     {
//       id: 'wallet',
//       icon: 'wallet-outline',
//       name: 'QuickBite Wallet',
//       description: `Balance: ₹2,500 • Instant`,
//       color: '#28a745',
//       bg: '#d4edda',
//     },
//     {
//       id: 'cash',
//       icon: 'cash-outline',
//       name: 'Cash on Delivery',
//       description: 'Pay when you receive • No extra charge',
//       color: '#fd7e14',
//       bg: '#fff3cd',
//     },
//   ];

//   // ============================================
//   // HANDLE RAZORPAY PAYMENT
//   // ============================================
//   const handleRazorpayPayment = async () => {
//     try {
//       setLoading(true);
//       console.log('🔄 Creating Razorpay order...');

//       const orderData = await paymentService.createRazorpayOrder(totalAmount, orderId);

//       if (!orderData.success) {
//         Alert.alert('Error', orderData.message || 'Failed to create order');
//         setLoading(false);
//         return;
//       }

//       const { order, key } = orderData;

//       // For emulator - use localhost
//       const paymentUrl = `http://localhost:3000/payment/checkout?order_id=${order.id}&amount=${order.amount}&key=${key}`;
      
//       // FOR PHYSICAL DEVICE - Uncomment and use your computer's IP
//       // const paymentUrl = `http://192.168.1.100:3000/payment/checkout?order_id=${order.id}&amount=${order.amount}&key=${key}`;
      
//       console.log('🔗 Opening WebView:', paymentUrl);
      
//       setWebViewUrl(paymentUrl);
//       setShowWebView(true);
//       setLoading(false);

//     } catch (error: any) {
//       console.error('❌ Payment error:', error);
//       Alert.alert(
//         'Payment Error',
//         error.message || 'Something went wrong. Please try again.'
//       );
//       setLoading(false);
//     }
//   };

//   // ============================================
//   // WebView Navigation Handler
//   // ============================================
//   const handleWebViewNavigation = (navState: any) => {
//     const { url } = navState;
//     console.log('🌐 WebView URL:', url);
    
//     if (url.includes('payment-success')) {
//       setShowWebView(false);
//       clearCart();
//       Alert.alert(
//         '✅ Payment Successful!',
//         'Your order has been placed successfully.',
//         [
//           {
//             text: 'View Order',
//             onPress: () => navigation.replace('Orders'),
//           },
//           {
//             text: 'Track Order',
//             onPress: () => navigation.replace('OrderTracking', { orderId }),
//           },
//         ]
//       );
//     }
    
//     if (url.includes('payment-failed')) {
//       setShowWebView(false);
//       Alert.alert(
//         'Payment Failed',
//         'Your payment was not successful. Please try again.'
//       );
//     }
//   };

//   // ============================================
//   // WebView Error Handler
//   // ============================================
//   const handleWebViewError = (error: any) => {
//     console.error('❌ WebView error:', error);
//     setWebViewError('Failed to load payment page');
//     Alert.alert(
//       'Payment Error',
//       'Could not load payment page. Please check your internet connection.',
//       [
//         { 
//           text: 'Retry', 
//           onPress: () => {
//             setWebViewError('');
//             setShowWebView(false);
//             setTimeout(() => handleRazorpayPayment(), 500);
//           }
//         },
//         { text: 'Cancel', style: 'cancel' }
//       ]
//     );
//   };

//   // ============================================
//   // HANDLE CASH ON DELIVERY
//   // ============================================
//   const handleCashOnDelivery = () => {
//     Alert.alert(
//       'Confirm Order',
//       `Total Amount: ₹${totalAmount}\n\nYou will pay when the order arrives.`,
//       [
//         { text: 'Cancel', style: 'cancel' },
//         {
//           text: 'Place Order',
//           onPress: () => {
//             clearCart();
//             navigation.replace('OrderSuccess', {
//               orderId,
//               totalAmount,
//               paymentMethod: 'Cash on Delivery',
//             });
//           },
//         },
//       ]
//     );
//   };

//   // ============================================
//   // HANDLE WALLET PAYMENT
//   // ============================================
//   const handleWalletPayment = () => {
//     const walletBalance = 2500;
//     if (totalAmount > walletBalance) {
//       Alert.alert(
//         'Insufficient Balance',
//         `Wallet balance: ₹${walletBalance}\nAmount needed: ₹${totalAmount}\n\nPlease add money to your wallet.`
//       );
//       return;
//     }

//     Alert.alert(
//       'Confirm Payment',
//       `Pay ₹${totalAmount} from your wallet?`,
//       [
//         { text: 'Cancel', style: 'cancel' },
//         {
//           text: 'Pay Now',
//           onPress: () => {
//             setLoading(true);
//             setTimeout(() => {
//               setLoading(false);
//               clearCart();
//               navigation.replace('OrderSuccess', {
//                 orderId,
//                 totalAmount,
//                 paymentMethod: 'QuickBite Wallet',
//               });
//             }, 2000);
//           },
//         },
//       ]
//     );
//   };

//   // ============================================
//   // HANDLE PAYMENT SELECTION
//   // ============================================
//   const handlePaymentSelect = (methodId: string) => {
//     setSelectedMethod(methodId);

//     switch (methodId) {
//       case 'razorpay':
//         handleRazorpayPayment();
//         break;
//       case 'cash':
//         handleCashOnDelivery();
//         break;
//       case 'wallet':
//         handleWalletPayment();
//         break;
//       default:
//         break;
//     }
//   };

//   // 🔥 If no amount
//   if (!totalAmount || totalAmount === 0) {
//     return (
//       <SafeAreaView style={[styles.container, styles.centerContent]}>
//         <Icon name="alert-circle-outline" size={60} color="#dc3545" />
//         <Text style={styles.errorText}>No amount specified</Text>
//         <TouchableOpacity style={styles.goBackButton} onPress={() => navigation.goBack()}>
//           <Text style={styles.goBackButtonText}>Go Back</Text>
//         </TouchableOpacity>
//       </SafeAreaView>
//     );
//   }

//   // 🔥 Show WebView
//   if (showWebView) {
//     return (
//       <SafeAreaView style={styles.container}>
//         <View style={styles.webViewHeader}>
//           <TouchableOpacity onPress={() => setShowWebView(false)}>
//             <Icon name="close" size={24} color="#282c3f" />
//           </TouchableOpacity>
//           <Text style={styles.webViewTitle}>Secure Payment</Text>
//           <TouchableOpacity onPress={() => {
//             setShowWebView(false);
//             setTimeout(() => {
//               setWebViewError('');
//               setShowWebView(true);
//             }, 500);
//           }}>
//             <Icon name="refresh-outline" size={24} color="#282c3f" />
//           </TouchableOpacity>
//         </View>
//         {webViewError ? (
//           <View style={styles.webViewError}>
//             <Icon name="alert-circle-outline" size={50} color="#dc3545" />
//             <Text style={styles.webViewErrorText}>{webViewError}</Text>
//             <TouchableOpacity 
//               style={styles.webViewRetryButton}
//               onPress={() => {
//                 setWebViewError('');
//                 setShowWebView(false);
//                 setTimeout(() => handleRazorpayPayment(), 500);
//               }}
//             >
//               <Text style={styles.webViewRetryButtonText}>Retry</Text>
//             </TouchableOpacity>
//           </View>
//         ) : (
//           <WebView
//             source={{ uri: webViewUrl }}
//             onNavigationStateChange={handleWebViewNavigation}
//             onError={handleWebViewError}
//             javaScriptEnabled={true}
//             domStorageEnabled={true}
//             startInLoadingState={true}
//             renderLoading={() => (
//               <View style={styles.webViewLoading}>
//                 <ActivityIndicator size="large" color="#fc8019" />
//                 <Text style={styles.webViewLoadingText}>Loading Payment...</Text>
//               </View>
//             )}
//           />
//         )}
//       </SafeAreaView>
//     );
//   }

//   return (
//     <SafeAreaView style={styles.container}>
//       <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

//       {/* Header */}
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
//           <Icon name="arrow-back" size={24} color="#282c3f" />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>Payment</Text>
//         <TouchableOpacity onPress={() => Alert.alert('Help', 'Payment help & support')}>
//           <Icon name="help-circle-outline" size={24} color="#282c3f" />
//         </TouchableOpacity>
//       </View>

//       <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
//         {/* Amount Card */}
//         <View style={styles.amountCard}>
//           <View style={styles.amountRow}>
//             <Text style={styles.amountLabel}>Amount to Pay</Text>
//             <View style={styles.secureBadgeSmall}>
//               <Icon name="lock-closed" size={12} color="#ffffff" />
//               <Text style={styles.secureBadgeSmallText}>Secure</Text>
//             </View>
//           </View>
//           <Text style={styles.amountValue}>₹{totalAmount}</Text>
//           <Text style={styles.amountSubtext}>Including all taxes & fees</Text>
//         </View>

//         {/* Payment Methods */}
//         <Text style={styles.sectionTitle}>Choose Payment Method</Text>

//         {paymentMethods.map((method) => (
//           <TouchableOpacity
//             key={method.id}
//             style={[
//               styles.methodItem,
//               selectedMethod === method.id && styles.methodSelected,
//             ]}
//             onPress={() => handlePaymentSelect(method.id)}
//             disabled={loading}
//           >
//             <View style={styles.methodLeft}>
//               <View style={[styles.methodIcon, { backgroundColor: method.bg }]}>
//                 <Icon name={method.icon} size={22} color={method.color} />
//               </View>
//               <View style={styles.methodInfo}>
//                 <View style={styles.methodNameRow}>
//                   <Text style={[
//                     styles.methodName,
//                     selectedMethod === method.id && styles.methodNameSelected,
//                   ]}>
//                     {method.name}
//                   </Text>
//                   {method.badge && (
//                     <View style={styles.badgeContainer}>
//                       <Text style={styles.badgeText}>{method.badge}</Text>
//                     </View>
//                   )}
//                 </View>
//                 <Text style={styles.methodDescription}>{method.description}</Text>
//               </View>
//             </View>
//             {selectedMethod === method.id && (
//               <View style={styles.checkmark}>
//                 <Icon name="checkmark-circle" size={24} color="#fc8019" />
//               </View>
//             )}
//           </TouchableOpacity>
//         ))}

//         {/* Info Box */}
//         <View style={styles.infoBox}>
//           <Icon name="information-circle-outline" size={18} color="#fc8019" />
//           <Text style={styles.infoText}>
//             Razorpay supports all payment methods: UPI, Cards, Net Banking, and more
//           </Text>
//         </View>

//         {/* Order Summary */}
//         <View style={styles.summaryCard}>
//           <Text style={styles.summaryTitle}>Order Summary</Text>
//           <View style={styles.summaryRow}>
//             <Text style={styles.summaryLabel}>Item Total</Text>
//             <Text style={styles.summaryValue}>₹{totalAmount}</Text>
//           </View>
//           <View style={styles.summaryRow}>
//             <Text style={styles.summaryLabel}>Delivery Fee</Text>
//             <Text style={styles.summaryValue}>₹0</Text>
//           </View>
//           <View style={styles.summaryRow}>
//             <Text style={styles.summaryLabel}>Platform Fee</Text>
//             <Text style={styles.summaryValue}>₹0</Text>
//           </View>
//           <View style={styles.summaryDivider} />
//           <View style={styles.summaryRow}>
//             <Text style={styles.summaryTotalLabel}>Total</Text>
//             <Text style={styles.summaryTotalValue}>₹{totalAmount}</Text>
//           </View>
//         </View>

//         {/* Secure Payment Badge */}
//         <View style={styles.secureBadge}>
//           <Icon name="shield-checkmark-outline" size={18} color="#28a745" />
//           <Text style={styles.secureBadgeText}>Your payment is secure and encrypted</Text>
//         </View>

//         <View style={styles.footerSpacer} />
//       </ScrollView>

//       {/* Loading Overlay */}
//       {loading && (
//         <View style={styles.loadingOverlay}>
//           <View style={styles.loadingContainer}>
//             <ActivityIndicator size="large" color="#fc8019" />
//             <Text style={styles.loadingText}>Processing Payment...</Text>
//             <Text style={styles.loadingSubtext}>Please wait, do not close the app</Text>
//           </View>
//         </View>
//       )}
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f8f9fa',
//   },
//   centerContent: {
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//     flex: 1,
//   },
//   errorText: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: '#282c3f',
//     marginTop: 16,
//   },
//   goBackButton: {
//     backgroundColor: '#fc8019',
//     paddingHorizontal: 32,
//     paddingVertical: 12,
//     borderRadius: 8,
//     marginTop: 16,
//   },
//   goBackButtonText: {
//     color: '#ffffff',
//     fontSize: 16,
//     fontWeight: '600',
//   },

//   // Header
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     paddingHorizontal: 16,
//     paddingTop: 12,
//     paddingBottom: 16,
//     backgroundColor: '#ffffff',
//     borderBottomWidth: 1,
//     borderBottomColor: '#f0f0f5',
//   },
//   backButton: {
//     padding: 4,
//   },
//   headerTitle: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: '#282c3f',
//   },
//   scrollContent: {
//     paddingBottom: 30,
//   },

//   // WebView
//   webViewHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     paddingHorizontal: 16,
//     paddingTop: 12,
//     paddingBottom: 16,
//     backgroundColor: '#ffffff',
//     borderBottomWidth: 1,
//     borderBottomColor: '#f0f0f5',
//   },
//   webViewTitle: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: '#282c3f',
//   },
//   webViewLoading: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#ffffff',
//   },
//   webViewLoadingText: {
//     fontSize: 16,
//     color: '#7e808c',
//     marginTop: 12,
//   },
//   webViewError: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#ffffff',
//     padding: 20,
//   },
//   webViewErrorText: {
//     fontSize: 16,
//     color: '#7e808c',
//     marginTop: 12,
//     textAlign: 'center',
//   },
//   webViewRetryButton: {
//     backgroundColor: '#fc8019',
//     paddingHorizontal: 30,
//     paddingVertical: 12,
//     borderRadius: 8,
//     marginTop: 16,
//   },
//   webViewRetryButtonText: {
//     color: '#ffffff',
//     fontSize: 16,
//     fontWeight: '600',
//   },

//   // Amount Card
//   amountCard: {
//     backgroundColor: '#fc8019',
//     marginHorizontal: 16,
//     marginTop: 16,
//     padding: 20,
//     borderRadius: 16,
//     shadowColor: '#fc8019',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 8,
//     elevation: 6,
//   },
//   amountRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   amountLabel: {
//     fontSize: 14,
//     color: '#ffffff',
//     opacity: 0.9,
//     fontWeight: '500',
//   },
//   amountValue: {
//     fontSize: 36,
//     fontWeight: '700',
//     color: '#ffffff',
//     marginTop: 4,
//   },
//   amountSubtext: {
//     fontSize: 12,
//     color: '#ffffff',
//     opacity: 0.7,
//     marginTop: 4,
//   },
//   secureBadgeSmall: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: 'rgba(255,255,255,0.2)',
//     paddingHorizontal: 10,
//     paddingVertical: 4,
//     borderRadius: 12,
//   },
//   secureBadgeSmallText: {
//     fontSize: 11,
//     color: '#ffffff',
//     marginLeft: 4,
//     fontWeight: '500',
//   },

//   // Section
//   sectionTitle: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#282c3f',
//     marginHorizontal: 16,
//     marginTop: 24,
//     marginBottom: 12,
//   },

//   // Payment Methods
//   methodItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     backgroundColor: '#ffffff',
//     marginHorizontal: 16,
//     marginBottom: 8,
//     padding: 14,
//     borderRadius: 12,
//     borderWidth: 1,
//     borderColor: '#f0f0f5',
//   },
//   methodSelected: {
//     borderColor: '#fc8019',
//     backgroundColor: '#fff5ec',
//   },
//   methodLeft: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     flex: 1,
//   },
//   methodIcon: {
//     width: 44,
//     height: 44,
//     borderRadius: 22,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 14,
//   },
//   methodInfo: {
//     flex: 1,
//   },
//   methodNameRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   methodName: {
//     fontSize: 15,
//     fontWeight: '500',
//     color: '#282c3f',
//   },
//   methodNameSelected: {
//     color: '#fc8019',
//   },
//   methodDescription: {
//     fontSize: 12,
//     color: '#7e808c',
//     marginTop: 2,
//   },
//   badgeContainer: {
//     backgroundColor: '#fc8019',
//     paddingHorizontal: 8,
//     paddingVertical: 2,
//     borderRadius: 10,
//     marginLeft: 8,
//   },
//   badgeText: {
//     fontSize: 9,
//     color: '#ffffff',
//     fontWeight: '600',
//   },
//   checkmark: {
//     marginLeft: 8,
//   },

//   // Info Box
//   infoBox: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#fff5ec',
//     marginHorizontal: 16,
//     marginTop: 8,
//     padding: 12,
//     borderRadius: 10,
//     borderWidth: 1,
//     borderColor: '#fc8019',
//   },
//   infoText: {
//     fontSize: 12,
//     color: '#7e808c',
//     marginLeft: 8,
//     flex: 1,
//   },

//   // Order Summary
//   summaryCard: {
//     backgroundColor: '#ffffff',
//     marginHorizontal: 16,
//     marginTop: 16,
//     padding: 16,
//     borderRadius: 12,
//     borderWidth: 1,
//     borderColor: '#f0f0f5',
//   },
//   summaryTitle: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#282c3f',
//     marginBottom: 12,
//   },
//   summaryRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     paddingVertical: 4,
//   },
//   summaryLabel: {
//     fontSize: 13,
//     color: '#7e808c',
//   },
//   summaryValue: {
//     fontSize: 13,
//     color: '#282c3f',
//   },
//   summaryDivider: {
//     height: 1,
//     backgroundColor: '#f0f0f5',
//     marginVertical: 8,
//   },
//   summaryTotalLabel: {
//     fontSize: 15,
//     fontWeight: '600',
//     color: '#282c3f',
//   },
//   summaryTotalValue: {
//     fontSize: 15,
//     fontWeight: '700',
//     color: '#fc8019',
//   },

//   // Secure Badge
//   secureBadge: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginHorizontal: 16,
//     marginTop: 20,
//     padding: 12,
//     backgroundColor: '#d4edda',
//     borderRadius: 8,
//   },
//   secureBadgeText: {
//     fontSize: 13,
//     color: '#155724',
//     marginLeft: 8,
//   },
//   footerSpacer: {
//     height: 20,
//   },

//   // Loading
//   loadingOverlay: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     backgroundColor: 'rgba(0,0,0,0.7)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   loadingContainer: {
//     backgroundColor: '#ffffff',
//     padding: 30,
//     borderRadius: 16,
//     alignItems: 'center',
//     minWidth: 200,
//   },
//   loadingText: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#282c3f',
//     marginTop: 12,
//   },
//   loadingSubtext: {
//     fontSize: 12,
//     color: '#7e808c',
//     marginTop: 4,
//   },
// });

// export default PaymentScreen;
// delivery-app/src/screens/checkout/PaymentScreen.tsx
import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Alert,
  ActivityIndicator,
  Modal,
  Dimensions,
  Linking,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { WebView } from 'react-native-webview';
import { AuthContext } from '../../context/AuthContext';
import { CartContext } from '../../context/CartContext';
import { paymentService } from '../../services/paymentService';

const { width, height } = Dimensions.get('window');

interface PaymentScreenProps {
  navigation: any;
  route: any;
}

const PaymentScreen: React.FC<PaymentScreenProps> = ({ navigation, route }) => {
  const { totalAmount, orderId } = route.params || {};
  const { user } = useContext(AuthContext);
  const { clearCart } = useContext(CartContext);

  const [selectedMethod, setSelectedMethod] = useState<string>('razorpay');
  const [loading, setLoading] = useState<boolean>(false);
  const [showWebView, setShowWebView] = useState<boolean>(false);
  const [webViewUrl, setWebViewUrl] = useState<string>('');
  const [webViewError, setWebViewError] = useState<string>('');

  // REAL APP PAYMENT METHODS
  const paymentMethods = [
    {
      id: 'razorpay',
      icon: 'phone-portrait-outline',
      name: 'Razorpay',
      description: 'UPI, Cards, Net Banking • Instant',
      color: '#fc8019',
      bg: '#fff5ec',
      badge: 'Popular',
    },
    {
      id: 'wallet',
      icon: 'wallet-outline',
      name: 'QuickBite Wallet',
      description: `Balance: ₹2,500 • Instant`,
      color: '#28a745',
      bg: '#d4edda',
    },
    {
      id: 'cash',
      icon: 'cash-outline',
      name: 'Cash on Delivery',
      description: 'Pay when you receive • No extra charge',
      color: '#fd7e14',
      bg: '#fff3cd',
    },
  ];

  // ============================================
  // HANDLE RAZORPAY PAYMENT
  // ============================================
  const handleRazorpayPayment = async () => {
    try {
      setLoading(true);
      console.log('🔄 Creating Razorpay order...');

      const orderData = await paymentService.createRazorpayOrder(totalAmount, orderId);

      if (!orderData.success) {
        Alert.alert('Error', orderData.message || 'Failed to create order');
        setLoading(false);
        return;
      }

      const { order, key } = orderData;

      // 🔥 For Android Emulator:
      const paymentUrl = `http://10.0.2.2:3000/payment/checkout?order_id=${order.id}&amount=${order.amount}&key=${key}`;

      // 🔥 For iOS Simulator:
      // const paymentUrl = `http://127.0.0.1:3000/payment/checkout?order_id=${order.id}&amount=${order.amount}&key=${key}`;

      // 🔥 For Physical Device (use your computer's IP):
      // const paymentUrl = `http://192.168.1.100:3000/payment/checkout?order_id=${order.id}&amount=${order.amount}&key=${key}`;
      
      console.log('🔗 Opening WebView:', paymentUrl);
      
      setWebViewUrl(paymentUrl);
      setShowWebView(true);
      setLoading(false);

    } catch (error: any) {
      console.error('❌ Payment error:', error);
      Alert.alert(
        'Payment Error',
        error.message || 'Something went wrong. Please try again.'
      );
      setLoading(false);
    }
  };

  // ============================================
  // WebView Navigation Handler
  // ============================================
  const handleWebViewNavigation = (navState: any) => {
    const { url } = navState;
    console.log('🌐 WebView URL:', url);
    
    if (url.includes('payment-success')) {
      setShowWebView(false);
      clearCart();
      Alert.alert(
        '✅ Payment Successful!',
        'Your order has been placed successfully.',
        [
          {
            text: 'View Order',
            onPress: () => navigation.replace('Orders'),
          },
          {
            text: 'Track Order',
            onPress: () => navigation.replace('OrderTracking', { orderId }),
          },
        ]
      );
    }
    
    if (url.includes('payment-failed')) {
      setShowWebView(false);
      Alert.alert(
        'Payment Failed',
        'Your payment was not successful. Please try again.'
      );
    }
  };

  // ============================================
  // WebView Error Handler
  // ============================================
  const handleWebViewError = (error: any) => {
    console.error('❌ WebView error:', error);
    setWebViewError('Failed to load payment page');
    Alert.alert(
      'Payment Error',
      'Could not load payment page. Please check your internet connection.',
      [
        { 
          text: 'Retry', 
          onPress: () => {
            setWebViewError('');
            setShowWebView(false);
            setTimeout(() => handleRazorpayPayment(), 500);
          }
        },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  // ============================================
  // HANDLE CASH ON DELIVERY
  // ============================================
  const handleCashOnDelivery = () => {
    Alert.alert(
      'Confirm Order',
      `Total Amount: ₹${totalAmount}\n\nYou will pay when the order arrives.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Place Order',
          onPress: () => {
            clearCart();
            navigation.replace('OrderSuccess', {
              orderId,
              totalAmount,
              paymentMethod: 'Cash on Delivery',
            });
          },
        },
      ]
    );
  };

  // ============================================
  // HANDLE WALLET PAYMENT
  // ============================================
  const handleWalletPayment = () => {
    const walletBalance = 2500;
    if (totalAmount > walletBalance) {
      Alert.alert(
        'Insufficient Balance',
        `Wallet balance: ₹${walletBalance}\nAmount needed: ₹${totalAmount}\n\nPlease add money to your wallet.`
      );
      return;
    }

    Alert.alert(
      'Confirm Payment',
      `Pay ₹${totalAmount} from your wallet?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Pay Now',
          onPress: () => {
            setLoading(true);
            setTimeout(() => {
              setLoading(false);
              clearCart();
              navigation.replace('OrderSuccess', {
                orderId,
                totalAmount,
                paymentMethod: 'QuickBite Wallet',
              });
            }, 2000);
          },
        },
      ]
    );
  };

  // ============================================
  // HANDLE PAYMENT SELECTION
  // ============================================
  const handlePaymentSelect = (methodId: string) => {
    setSelectedMethod(methodId);

    switch (methodId) {
      case 'razorpay':
        handleRazorpayPayment();
        break;
      case 'cash':
        handleCashOnDelivery();
        break;
      case 'wallet':
        handleWalletPayment();
        break;
      default:
        break;
    }
  };

  // 🔥 If no amount
  if (!totalAmount || totalAmount === 0) {
    return (
      <SafeAreaView style={[styles.container, styles.centerContent]}>
        <Icon name="alert-circle-outline" size={60} color="#dc3545" />
        <Text style={styles.errorText}>No amount specified</Text>
        <TouchableOpacity style={styles.goBackButton} onPress={() => navigation.goBack()}>
          <Text style={styles.goBackButtonText}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  // 🔥 Show WebView
  if (showWebView) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.webViewHeader}>
          <TouchableOpacity onPress={() => setShowWebView(false)}>
            <Icon name="close" size={24} color="#282c3f" />
          </TouchableOpacity>
          <Text style={styles.webViewTitle}>Secure Payment</Text>
          <TouchableOpacity onPress={() => {
            setShowWebView(false);
            setTimeout(() => {
              setWebViewError('');
              setShowWebView(true);
            }, 500);
          }}>
            <Icon name="refresh-outline" size={24} color="#282c3f" />
          </TouchableOpacity>
        </View>
        {webViewError ? (
          <View style={styles.webViewError}>
            <Icon name="alert-circle-outline" size={50} color="#dc3545" />
            <Text style={styles.webViewErrorText}>{webViewError}</Text>
            <TouchableOpacity 
              style={styles.webViewRetryButton}
              onPress={() => {
                setWebViewError('');
                setShowWebView(false);
                setTimeout(() => handleRazorpayPayment(), 500);
              }}
            >
              <Text style={styles.webViewRetryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <WebView
            source={{ uri: webViewUrl }}
            onNavigationStateChange={handleWebViewNavigation}
            onError={handleWebViewError}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            startInLoadingState={true}
            renderLoading={() => (
              <View style={styles.webViewLoading}>
                <ActivityIndicator size="large" color="#fc8019" />
                <Text style={styles.webViewLoadingText}>Loading Payment...</Text>
              </View>
            )}
          />
        )}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#282c3f" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment</Text>
        <TouchableOpacity onPress={() => Alert.alert('Help', 'Payment help & support')}>
          <Icon name="help-circle-outline" size={24} color="#282c3f" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Amount Card */}
        <View style={styles.amountCard}>
          <View style={styles.amountRow}>
            <Text style={styles.amountLabel}>Amount to Pay</Text>
            <View style={styles.secureBadgeSmall}>
              <Icon name="lock-closed" size={12} color="#ffffff" />
              <Text style={styles.secureBadgeSmallText}>Secure</Text>
            </View>
          </View>
          <Text style={styles.amountValue}>₹{totalAmount}</Text>
          <Text style={styles.amountSubtext}>Including all taxes & fees</Text>
        </View>

        {/* Payment Methods */}
        <Text style={styles.sectionTitle}>Choose Payment Method</Text>

        {paymentMethods.map((method) => (
          <TouchableOpacity
            key={method.id}
            style={[
              styles.methodItem,
              selectedMethod === method.id && styles.methodSelected,
            ]}
            onPress={() => handlePaymentSelect(method.id)}
            disabled={loading}
          >
            <View style={styles.methodLeft}>
              <View style={[styles.methodIcon, { backgroundColor: method.bg }]}>
                <Icon name={method.icon} size={22} color={method.color} />
              </View>
              <View style={styles.methodInfo}>
                <View style={styles.methodNameRow}>
                  <Text style={[
                    styles.methodName,
                    selectedMethod === method.id && styles.methodNameSelected,
                  ]}>
                    {method.name}
                  </Text>
                  {method.badge && (
                    <View style={styles.badgeContainer}>
                      <Text style={styles.badgeText}>{method.badge}</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.methodDescription}>{method.description}</Text>
              </View>
            </View>
            {selectedMethod === method.id && (
              <View style={styles.checkmark}>
                <Icon name="checkmark-circle" size={24} color="#fc8019" />
              </View>
            )}
          </TouchableOpacity>
        ))}

        {/* Info Box */}
        <View style={styles.infoBox}>
          <Icon name="information-circle-outline" size={18} color="#fc8019" />
          <Text style={styles.infoText}>
            Razorpay supports all payment methods: UPI, Cards, Net Banking, and more
          </Text>
        </View>

        {/* Order Summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Order Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Item Total</Text>
            <Text style={styles.summaryValue}>₹{totalAmount}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Delivery Fee</Text>
            <Text style={styles.summaryValue}>₹0</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Platform Fee</Text>
            <Text style={styles.summaryValue}>₹0</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryRow}>
            <Text style={styles.summaryTotalLabel}>Total</Text>
            <Text style={styles.summaryTotalValue}>₹{totalAmount}</Text>
          </View>
        </View>

        {/* Secure Payment Badge */}
        <View style={styles.secureBadge}>
          <Icon name="shield-checkmark-outline" size={18} color="#28a745" />
          <Text style={styles.secureBadgeText}>Your payment is secure and encrypted</Text>
        </View>

        <View style={styles.footerSpacer} />
      </ScrollView>

      {/* Loading Overlay */}
      {loading && (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#fc8019" />
            <Text style={styles.loadingText}>Processing Payment...</Text>
            <Text style={styles.loadingSubtext}>Please wait, do not close the app</Text>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    flex: 1,
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#282c3f',
    marginTop: 16,
  },
  goBackButton: {
    backgroundColor: '#fc8019',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  goBackButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f5',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#282c3f',
  },
  scrollContent: {
    paddingBottom: 30,
  },

  // WebView
  webViewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f5',
  },
  webViewTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#282c3f',
  },
  webViewLoading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  webViewLoadingText: {
    fontSize: 16,
    color: '#7e808c',
    marginTop: 12,
  },
  webViewError: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 20,
  },
  webViewErrorText: {
    fontSize: 16,
    color: '#7e808c',
    marginTop: 12,
    textAlign: 'center',
  },
  webViewRetryButton: {
    backgroundColor: '#fc8019',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  webViewRetryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },

  // Amount Card
  amountCard: {
    backgroundColor: '#fc8019',
    marginHorizontal: 16,
    marginTop: 16,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#fc8019',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  amountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  amountLabel: {
    fontSize: 14,
    color: '#ffffff',
    opacity: 0.9,
    fontWeight: '500',
  },
  amountValue: {
    fontSize: 36,
    fontWeight: '700',
    color: '#ffffff',
    marginTop: 4,
  },
  amountSubtext: {
    fontSize: 12,
    color: '#ffffff',
    opacity: 0.7,
    marginTop: 4,
  },
  secureBadgeSmall: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  secureBadgeSmallText: {
    fontSize: 11,
    color: '#ffffff',
    marginLeft: 4,
    fontWeight: '500',
  },

  // Section
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#282c3f',
    marginHorizontal: 16,
    marginTop: 24,
    marginBottom: 12,
  },

  // Payment Methods
  methodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    marginBottom: 8,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#f0f0f5',
  },
  methodSelected: {
    borderColor: '#fc8019',
    backgroundColor: '#fff5ec',
  },
  methodLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  methodIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  methodInfo: {
    flex: 1,
  },
  methodNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  methodName: {
    fontSize: 15,
    fontWeight: '500',
    color: '#282c3f',
  },
  methodNameSelected: {
    color: '#fc8019',
  },
  methodDescription: {
    fontSize: 12,
    color: '#7e808c',
    marginTop: 2,
  },
  badgeContainer: {
    backgroundColor: '#fc8019',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginLeft: 8,
  },
  badgeText: {
    fontSize: 9,
    color: '#ffffff',
    fontWeight: '600',
  },
  checkmark: {
    marginLeft: 8,
  },

  // Info Box
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff5ec',
    marginHorizontal: 16,
    marginTop: 8,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#fc8019',
  },
  infoText: {
    fontSize: 12,
    color: '#7e808c',
    marginLeft: 8,
    flex: 1,
  },

  // Order Summary
  summaryCard: {
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#f0f0f5',
  },
  summaryTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#282c3f',
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  summaryLabel: {
    fontSize: 13,
    color: '#7e808c',
  },
  summaryValue: {
    fontSize: 13,
    color: '#282c3f',
  },
  summaryDivider: {
    height: 1,
    backgroundColor: '#f0f0f5',
    marginVertical: 8,
  },
  summaryTotalLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#282c3f',
  },
  summaryTotalValue: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fc8019',
  },

  // Secure Badge
  secureBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
    marginTop: 20,
    padding: 12,
    backgroundColor: '#d4edda',
    borderRadius: 8,
  },
  secureBadgeText: {
    fontSize: 13,
    color: '#155724',
    marginLeft: 8,
  },
  footerSpacer: {
    height: 20,
  },

  // Loading
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    backgroundColor: '#ffffff',
    padding: 30,
    borderRadius: 16,
    alignItems: 'center',
    minWidth: 200,
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#282c3f',
    marginTop: 12,
  },
  loadingSubtext: {
    fontSize: 12,
    color: '#7e808c',
    marginTop: 4,
  },
});

export default PaymentScreen;